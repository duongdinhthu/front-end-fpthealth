import React, {useEffect, useState} from 'react';
import './AppointmentsList.css';
import axios from 'axios';
import $ from "jquery";


const AppointmentsList = ({appointments}) => {
    const sortedAppointments = appointments && appointments.slice().sort((a, b) => new Date(b.medical_day) - new Date(a.medical_day));
    const [openEditAppointment, setOpenEditAppointment] = useState(false);
    const [editAppointmentData, setEditAppointmentData] = useState(null);
    const [bookedSlots, setBookedSlots] = useState([]);
    const [availableSlots, setAvailableSlots] = useState([]);
    const timeSlots = [
        {label: '08:00 AM - 09:00 AM', value: 1, start: '08:00', end: '09:00'},
        {label: '09:00 AM - 10:00 AM', value: 2, start: '09:00', end: '10:00'},
        {label: '10:00 AM - 11:00 AM', value: 3, start: '10:00', end: '11:00'},
        {label: '11:00 AM - 12:00 AM', value: 4, start: '11:00', end: '12:00'},
        {label: '01:00 PM - 02:00 PM', value: 5, start: '13:00', end: '14:00'},
        {label: '02:00 PM - 03:00 PM', value: 6, start: '14:00', end: '15:00'},
        {label: '03:00 PM - 04:00 PM', value: 7, start: '15:00', end: '16:00'},
        {label: '04:00 PM - 05:00 PM', value: 8, start: '16:00', end: '17:00'}
    ];

    const formatTimeSlot = (slot) => {
        switch (slot) {
            case 1:
                return '8:00 AM - 9:00 AM';
            case 2:
                return '9:00 AM - 10:00 AM';
            case 3:
                return '10:00 AM - 11:00 AM';
            case 4:
                return '11:00 AM - 12:00 AM';
            case 5:
                return '01:00 PM - 02:00 PM';
            case 6:
                return '02:00 PM - 03:00 PM';
            case 7:
                return '03:00 PM - 04:00 PM';
            case 8:
                return '04:00 PM - 05:00 PM';
            default:
                return 'Slot Time Not Defined';
        }
    };

    const [formData, setFormData] = useState({
        date: '',
        timeSlot: ''
    });

    const handleCancelEditAppointment = () => {
        setFormData({
            date: '',
            timeSlot: ''
        });
        setBookedSlots([]);
        setAvailableSlots([]);
        setEditAppointmentData(null);
        setOpenEditAppointment(false);
    };

    useEffect(() => {
        if (formData.date) {
            axios.get(`http://localhost:8080/api/v1/appointments/${editAppointmentData.doctor_id}/slots`)
                .then(response => {
                    setBookedSlots(response.data);
                })
                .catch(error => {
                    console.error('Error fetching booked slots!', error);
                });

            axios.get(`http://localhost:8080/api/v1/appointments/check-locked-slots?doctorId=${editAppointmentData.doctor_id}&date=${formData.date}`)
                .then(response => {
                    const lockedSlots = response.data;
                    const available = timeSlots.filter(slot => !lockedSlots.includes(slot.value));
                    setAvailableSlots(available);
                    // Reset formData.timeSlot if it's no longer available
                    if (!available.find(slot => slot.value === formData.timeSlot)) {
                        setFormData({
                            ...formData,
                            timeSlot: ''
                        });
                    }
                })
                .catch(error => {
                    console.error('Error fetching locked slots!', error);
                });
        }
    }, [formData.date]);


    useEffect(() => {
        if (formData.date && bookedSlots.length > 0) {
            const bookedSlotsForDate = bookedSlots.filter(slot => {
                const slotDate = new Date(slot.medical_day).toISOString().split('T')[0];
                return slotDate === formData.date;
            }).map(slot => slot.slot);
            const available = timeSlots.filter(slot => !bookedSlotsForDate.includes(slot.value));
            setAvailableSlots(available);
        } else {
            setAvailableSlots(timeSlots);
        }
    }, [formData.date, bookedSlots]);

    const handleDateChange = (date) => {
        setFormData({
            ...formData,
            date: date,
            timeSlot: ''
        });
    };

    const handleTimeSlotChange = (slot) => {
        // Check and lock the selected slot
        axios.post('http://localhost:8080/api/v1/appointments/lock-slot', {
            doctorId: editAppointmentData.doctor_id,
            date: formData.date,
            time: slot
        }).then(response => {
            setFormData({
                ...formData,
                timeSlot: slot
            });

            // Schedule to release lock after 5 minutes if not confirmed
            setTimeout(() => {
                axios.post('http://localhost:8080/api/v1/appointments/unlock-slot', {
                    doctorId: formData.doctor,
                    date: formData.date,
                    time: slot
                }).catch(error => {
                    console.error('Error unlocking slot!', error);
                });
            }, 300000);
        }).catch(error => {
            console.error('Error locking slot!', error);
            $(".time-slots").append('<span class="time-error">This time slot is already taken, please choose another one.</span>');
            setTimeout(function() {
                $(".time-error").remove();
            }, 2000);
        });
    };

    const isTimeSlotPast = (date, startTime) => {
        const appointmentDate = new Date(date);
        const currentDate = new Date();
        const [startHour, startMinute] = startTime.split(':').map(Number);

        appointmentDate.setHours(startHour, startMinute, 0, 0);

        return appointmentDate < currentDate;
    };

    const generateDateButtons = () => {
        const today = new Date();
        const dates = [];
        for (let i = 0; i < 3; i++) {
            const date = new Date(today);
            date.setDate(today.getDate() + i);
            const dateString = date.toISOString().split('T')[0];
            dates.push({
                label: i === 0 ? `Today (${dateString})` : (i === 1 ? `Tomorrow (${dateString})` : `Day after tomorrow (${dateString})`),
                value: dateString
            });
        }
        return dates;
    };

    const renderDateButtons = () => {
        const dates = generateDateButtons();
        return (
            <div className="date-container">
                <label>Date</label>
                <div className="date-select">
                    <div className="date-buttons">
                        {dates.map(date => (
                            <button
                                key={date.value}
                                className={formData.date === date.value ? 'selected' : ''}
                                onClick={() => handleDateChange(date.value)}
                            >
                                {date.label}
                            </button>
                        ))}
                    </div>
                    <span>OR</span>
                    <input
                        type="date"
                        value={formData.date}
                        onChange={(e) => handleDateChange(e.target.value)}
                        min={new Date().toISOString().split('T')[0]}
                    />

                </div>
            </div>
        );
    };

    const renderTimeSlots = () => {
        return (
            <div className="time-container">
                <label>Time</label>
                <div className="time-slots">
                    {availableSlots.map(slot => (
                        <button
                            key={slot.value}
                            className={formData.timeSlot === slot.value ? 'selected' : ''}
                            onClick={() => handleTimeSlotChange(slot.value)}
                            disabled={isTimeSlotPast(formData.date, slot.start)} // Disable past slots
                            style={{
                                backgroundColor: isTimeSlotPast(formData.date, slot.start) ? '#d3d3d3' : '',
                                pointerEvents: isTimeSlotPast(formData.date, slot.start) ? 'none' : 'auto'
                            }}
                        >
                            {slot.label}
                        </button>
                    ))}
                </div>
            </div>
        );
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'Pending':
                return <span className="status-icon pending"></span>;
            case 'Completed':
                return <span className="status-icon completed"></span>;
            case 'Cancelled':
                return <span className="status-icon cancelled"></span>;
            default:
                return <span className="status-icon"></span>;
        }
    };

    const handleEditAppointment = async (appointment) => {
        try {
            await axios.put(`http://localhost:8080/api/v1/appointments/update`, {
                appointment_id: appointment.appointment_id,
                medical_day: formData.date,
                slot: formData.timeSlot,
                status: 'Pending'
            });
            sessionStorage.setItem('appointmentMessage', 'Appointment updated successfully');
            window.location.reload();
        } catch (error) {
            console.error("Failed to update the appointment.", error);
        }
    };

    const handleConfirmEditAppointment = () => {
        if (editAppointmentData) {
            handleEditAppointment(editAppointmentData);
        }
        setOpenEditAppointment(false);
    };

    const handleOpenEditAppointment = (appointment) => {
        setEditAppointmentData(appointment);
        setOpenEditAppointment(true);
    };

    $(document).ready(function () {
        var appointmentMessage = sessionStorage.getItem('appointmentMessage');
        if (appointmentMessage) {
            $(".main-mess .message-text").text(appointmentMessage);
            $(".main-mess").addClass("active");
            var timeoutDuration = 2000;
            var progressBar = $(".main-mess .timeout-bar");
            progressBar.addClass("active");
            setTimeout(function () {
                $(".main-mess").removeClass("active");
                progressBar.removeClass("active");
                sessionStorage.removeItem('appointmentMessage');
            }, timeoutDuration);
        }
    });

    return (
        <div style={{width: 100 + '%'}}>
            {openEditAppointment && (
                <div className="appointments-popup-container">
                    <div className="appointments-popup-overlay"></div>
                    <div className="appointments-popup">
                        <h4>Edit Appointment</h4>
                        {renderDateButtons()}
                        {formData.date && renderTimeSlots()}
                        <div className="button-group">
                            <button className="appointments-cancel" onClick={handleCancelEditAppointment}>Cancel
                            </button>
                            <button className="appointments-save" onClick={handleConfirmEditAppointment}
                                    disabled={!formData.date || !formData.timeSlot}>Save
                            </button>
                        </div>
                    </div>
                </div>
            )}
            <div className="appointments">
                    <div className="appointments-container">
                        {sortedAppointments && sortedAppointments.map(app => (
                            <div className="appointment-card" key={app.appointment_id}>
                                <div className="card-header">
                                    <h3>{new Date(app.appointment_date).toLocaleDateString()}</h3>
                                    <div>{getStatusIcon(app.status)}<p>{app.status}</p></div>
                                </div>
                                <p>
                                    <strong>Doctor:</strong> {app.doctor && app.doctor.length > 0 ? app.doctor[0].doctor_name : 'No Doctor Info'}
                                </p>
                                <p>
                                    <strong>Department:</strong> {app.doctor && app.doctor.length > 0 && app.doctor[0].department && app.doctor[0].department.length > 0 ? app.doctor[0].department[0].department_name : 'No Department Info'}
                                </p>
                                <p><strong>Staff
                                    Name:</strong> {app.staff && app.staff.length > 0 ? app.staff[0].staff_name : 'No Staff Name'}
                                </p>
                                <p><strong>Appointment Date:</strong> {new Date(app.medical_day).toLocaleDateString()}
                                </p>
                                <p><strong>Appointment Time:</strong> {formatTimeSlot(app.slot)}</p>
                                {app.status !== 'Cancelled' && app.status !== 'Completed' && (
                                    <button className="edit-appointment-button"
                                            onClick={() => handleOpenEditAppointment(app)}> Edit
                                        Appointment
                                    </button>
                                )}
                            </div>
                        ))}
                </div>
            </div>
        </div>
    );
};

export default AppointmentsList;
