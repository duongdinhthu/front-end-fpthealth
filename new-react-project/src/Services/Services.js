import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Select, { components } from 'react-select';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';
import { useNavigate } from 'react-router-dom';
import "../Services/Services.css";
import $ from 'jquery';

// Custom Option component to display summary information
const CustomOption = (props) => {
    return (
        <components.Option {...props}>
            <div>
                <strong>{props.data.label}</strong>
                <p style={{ fontSize: '12px', margin: '0' }}>{props.data.summary}</p>
            </div>
        </components.Option>
    );
};

const SuccessMessage = () => {
    const navigate = useNavigate();

    const navigateToHomePage = () => {
        navigate('/');
    };

    const navigateToDashBoard = () => {
        navigate('/dashboard');
    };

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };
    scrollToTop();
    return (
        <div className="success-message">
            <div className="success-content">
                <h2>Appointment booked successfully!</h2>
            </div>
            <div className="button-group">
                <button onClick={navigateToHomePage}>Back to homepage</button>
                <button onClick={navigateToDashBoard}>View Appointment</button>
            </div>
        </div>
    );
};

const Services = () => {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        patient_name: '',
        patient_email: '',
        patient_phone: '',
        department: '',
        doctor: '',
        date: '',
        timeSlot: '',
    });
    const [phoneError, setPhoneError] = useState('');
    const [emailError, setEmailError] = useState('');
    const [nameError, setNameError] = useState('');
    const [departments, setDepartments] = useState([]);
    const [doctors, setDoctors] = useState([]);
    const [bookedSlots, setBookedSlots] = useState([]);
    const [availableSlots, setAvailableSlots] = useState([]);
    const [selectedDepartment, setSelectedDepartment] = useState(null);
    const [selectedDoctor, setSelectedDoctor] = useState(null);
    const [doctorPrice, setDoctorPrice] = useState(null);
    const [showSuccess, setShowSuccess] = useState(false);
    const [animationClass, setAnimationClass] = useState('');
    const [infoAnimationClass, setInfoAnimationClass] = useState('');
    const [isAnimating, setIsAnimating] = useState(false);

    const timeSlots = [
        { label: '08:00 AM - 09:00 AM', value: 1, start: '08:00', end: '09:00' },
        { label: '09:00 AM - 10:00 AM', value: 2, start: '09:00', end: '10:00' },
        { label: '10:00 AM - 11:00 AM', value: 3, start: '10:00', end: '11:00' },
        { label: '11:00 AM - 12:00 AM', value: 4, start: '11:00', end: '12:00' },
        { label: '01:00 PM - 02:00 PM', value: 5, start: '13:00', end: '14:00' },
        { label: '02:00 PM - 03:00 PM', value: 6, start: '14:00', end: '15:00' },
        { label: '03:00 PM - 04:00 PM', value: 7, start: '15:00', end: '16:00' },
        { label: '04:00 PM - 05:00 PM', value: 8, start: '16:00', end: '17:00' }
    ];

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth' // Optional: animated scroll behavior
        });
    };

    useEffect(() => {
        axios.get('http://localhost:8080/api/v1/departments/list')
            .then(response => {
                setDepartments(response.data);
            })
            .catch(error => {
                console.error('Error fetching department list!', error);
            });
    }, []);

    useEffect(() => {
        if (formData.department) {
            axios.get(`http://localhost:8080/api/v1/departments/search?department_id=${formData.department}`)
                .then(response => {
                    if (response.data.length > 0) {
                        setSelectedDepartment(response.data[0]);
                    }
                })
                .catch(error => {
                    console.error('Error fetching department info!', error);
                });
            axios.get(`http://localhost:8080/api/v1/departments/${formData.department}/doctors`)
                .then(response => {
                    setDoctors(response.data);
                    setFormData((prevData) => ({
                        ...prevData,
                        doctor: ''
                    }));
                    setSelectedDoctor(null);
                    setDoctorPrice(null);
                })
                .catch(error => {
                    console.error('Error fetching doctor list!', error);
                });
        }
    }, [formData.department]);

    useEffect(() => {
        if (formData.doctor) {
            axios.get(`http://localhost:8080/api/v1/doctors/search?doctor_id=${formData.doctor}`)
                .then(response => {
                    if (response.data.length > 0) {
                        setSelectedDoctor(response.data[0]);
                        setDoctorPrice(response.data[0].doctor_price);
                    }
                })
                .catch(error => {
                    console.error('Error fetching doctor info!', error);
                });
        }
    }, [formData.doctor]);

    useEffect(() => {
        if (formData.doctor && formData.date) {
            axios.get(`http://localhost:8080/api/v1/appointments/${formData.doctor}/slots`)
                .then(response => {
                    setBookedSlots(response.data);
                })
                .catch(error => {
                    console.error('Error fetching booked slots!', error);
                });

            axios.get(`http://localhost:8080/api/v1/appointments/check-locked-slots?doctorId=${formData.doctor}&date=${formData.date}`)
                .then(response => {
                    const lockedSlots = response.data;
                    const available = timeSlots.filter(slot => !lockedSlots.includes(slot.value));
                    setAvailableSlots(available);
                })
                .catch(error => {
                    console.error('Error fetching locked slots!', error);
                });
        }
    }, [formData.doctor, formData.date]);

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

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });

        if (name === 'patient_email') {
            if (value && !/^[A-Za-z0-9._-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(value)) {
                setEmailError('Invalid email format');
            } else {
                setEmailError('');
            }
        }

        if (name === 'patient_name') {
            if (value && !/^[A-Za-z ]+$/.test(value)) {
                setNameError('Name must contain only English letters');
            } else {
                setNameError('');
            }
        }

        if (name === 'patient_phone' && value.length > 10) {
            setPhoneError('Phone number must not exceed 10 digits');
        } else {
            setPhoneError('');
        }
    };

    const handleDepartmentChange = (selectedOption) => {
        setFormData({
            ...formData,
            department: selectedOption.value,
            doctor: '',
            date: '',
            timeSlot: ''
        });
        setSelectedDepartment(selectedOption);
        setSelectedDoctor(null);
        setDoctors([]);
    };

    const handleDoctorChange = (selectedOption) => {
        setFormData({
            ...formData,
            doctor: selectedOption.value,
            date: '',
            timeSlot: ''
        });
        setSelectedDoctor(selectedOption);
    };

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
            doctorId: formData.doctor,
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

    const getTimeSlotLabel = (slotValue) => {
        const slot = timeSlots.find(s => s.value === slotValue);
        return slot ? slot.label : '';
    };

    const isTimeSlotPast = (date, startTime) => {
        const appointmentDate = new Date(date);
        const currentDate = new Date();
        const [startHour, startMinute] = startTime.split(':').map(Number);

        appointmentDate.setHours(startHour, startMinute, 0, 0);

        return appointmentDate < currentDate;
    };

    const handleNextStep = () => {
        if (isAnimating) return; // Prevent double clicks
        setIsAnimating(true);
        setStep(step + 1);
        setAnimationClass('slide-in-left');
        setInfoAnimationClass('slide-in-right');
        scrollToTop();
        setTimeout(() => {
            setAnimationClass('');
            setInfoAnimationClass('');
            setIsAnimating(false);
        }, 500); // Ensure this time matches the animation duration
    };

    const handlePrevStep = () => {
        if (isAnimating) return; // Prevent double clicks
        setIsAnimating(true);
        setStep(step - 1);
        setAnimationClass('slide-in-right');
        setInfoAnimationClass('slide-in-left');
        scrollToTop();
        setTimeout(() => {
            setAnimationClass('');
            setInfoAnimationClass('');
            setIsAnimating(false);
        }, 500); // Ensure this time matches the animation duration
    };

    const handleSubmit = async (e) => {
        if (e && e.preventDefault) {
            e.preventDefault();
        }
        await submitAppointment();
    };

    const submitAppointment = async () => {
        console.log("Selected Doctor before sending:", selectedDoctor);
        console.log("Selected Department before sending:", selectedDepartment);

        const dataToSend = {
            ...formData,
            appointment_date: new Date().toISOString(),
            medical_day: formData.date,
            slot: formData.timeSlot,
            doctor_id: formData.doctor,
            status: 'Pending',
            patient_username: formData.patient_email,
            patient_password: generateRandomPassword(),
            doctor_name: selectedDoctor ? selectedDoctor.doctor_name : '', // Use doctor_name instead of label
            department_name: selectedDepartment ? selectedDepartment.department_name : '', // Use department_name instead of label
            price: doctorPrice // Send doctor's fee to API
        };

        console.log("Data To Send:", dataToSend);

        try {
            const response = await axios.post('http://localhost:8080/api/v1/appointments/insert', dataToSend);
            console.log(response.data);
            setShowSuccess(true);

            // Convert slot to specific time
            const timeSlotLabel = getTimeSlotLabel(dataToSend.slot);

            // Send email to patient and doctor simultaneously
            await Promise.all([
                sendEmailFormRegister(
                    dataToSend.doctor_name,
                    dataToSend.department_name,
                    dataToSend.medical_day,
                    dataToSend.patient_email,
                    dataToSend.patient_name,
                    timeSlotLabel // Send specific time instead of slot
                ),
                sendEmailToDoctor(
                    dataToSend.doctor_name,
                    dataToSend.department_name,
                    dataToSend.medical_day,
                    selectedDoctor.doctor_email, // Doctor's email
                    dataToSend.patient_name,
                    timeSlotLabel
                ),
                new Promise((resolve) => setTimeout(resolve, 1000)) // Wait 1 second before redirecting
            ]);
        } catch (error) {
            console.error('Error booking appointment!', error);
            alert('Booking failed.');
        }
    };

    const sendEmailFormRegister = (doctorName, departmentName, medicalDay, patientEmail, patientName, timeSlot) => {
        console.log("Sending Email with the following data:");
        console.log("Doctor Name:", doctorName);
        console.log("Department Name:", departmentName);
        console.log("Appointment Date:", medicalDay);
        console.log("Patient Email:", patientEmail);
        console.log("Patient Name:", patientName);
        console.log("Time Slot:", timeSlot);

        return axios.post('http://localhost:8080/api/v1/appointments/send-email', {
            doctorName,
            departmentName,
            medicalDay,
            patientEmail,
            patientName,
            timeSlot // Send specific time
        }).then(response => {
            console.log('Email sent successfully');
        }).catch(error => {
            console.error('Error sending email', error);
        });
    };

    const sendEmailToDoctor = (doctorName, departmentName, medicalDay, doctorEmail, patientName, timeSlot) => {
        console.log("Sending Email to Doctor with the following data:");
        console.log("Doctor Name:", doctorName);
        console.log("Department Name:", departmentName);
        console.log("Appointment Date:", medicalDay);
        console.log("Doctor Email:", doctorEmail);
        console.log("Patient Name:", patientName);
        console.log("Time Slot:", timeSlot);

        return axios.post('http://localhost:8080/api/v1/appointments/send-email-doctor', {
            doctorName,
            departmentName,
            medicalDay,
            doctorEmail,
            patientName,
            timeSlot
        }).then(response => {
            console.log('Email sent to doctor successfully');
        }).catch(error => {
            console.error('Error sending email to doctor', error);
        });
    };

    const generateRandomPassword = () => {
        const length = 8;
        const lowercaseCharset = 'abcdefghijklmnopqrstuvwxyz';
        const uppercaseCharset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        const numericCharset = '0123456789';
        const specialCharset = '!@#$%^&*()_+';
        let password =
            lowercaseCharset[Math.floor(Math.random() * lowercaseCharset.length)] +
            uppercaseCharset[Math.floor(Math.random() * uppercaseCharset.length)] +
            numericCharset[Math.floor(Math.random() * numericCharset.length)] +
            specialCharset[Math.floor(Math.random() * specialCharset.length)];
        for (let i = 4; i < length; i++) {
            const charset = lowercaseCharset + uppercaseCharset + numericCharset + specialCharset;
            const randomIndex = Math.floor(Math.random() * charset.length);
            password += charset[randomIndex];
        }

        password = shuffleString(password);
        return password;
    };

    function shuffleString(str) {
        const array = str.split('');
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array.join('');
    }

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

    const departmentOptions = departments.map(department => ({
        value: department.department_id,
        label: department.department_name,
        summary: department.summary,
        description: department.department_description,
        img: department.department_img
    }));

    const doctorOptions = doctors.map(doctor => ({
        value: doctor.doctor_id,
        label: doctor.doctor_name,
        summary: doctor.summary,
        description: doctor.doctor_description,
        image: doctor.doctor_image,
        price: doctor.doctor_price
    }));

    $(document).ready(function () {
        $(".links li a").removeClass("active");
        var currentStepIcon = '<div class="currentStepIcon"><img width="20" height="20" src="https://img.icons8.com/ios-glyphs/30/004b91/sort-up.png" alt="sort-up"/></div>'
        if (step === 1) {
            $(".process-bar div").removeClass("active");
            $(".process-bar-step1").text("1");
            $(".currentStepIcon").remove();
            $(".process-bar-step1").append(currentStepIcon);
            $(".process-bar div").removeClass("current");
            $(".process-bar-step1").addClass("current");
        } else if (step === 2) {
            $(".process-bar-step1").addClass("active");
            $(".process-bar-step1").text("");
            $(".process-bar-step1").append('<img width="25" height="25" src="https://img.icons8.com/ios-filled/50/FFFFFF/checkmark--v1.png" alt="checkmark--v1"/>')
            $(".process-bar-line12").addClass("active");
            $(".process-bar-line23").removeClass("active");
            $(".process-bar-step2").text("2");
            $(".process-bar-step2").removeClass("active");
            $(".currentStepIcon").remove();
            $(".process-bar-step2").append(currentStepIcon);
            $(".process-bar div").removeClass("current");
            $(".process-bar-step2").addClass("current");
        } else if (step === 3) {
            $(".process-bar-step2").addClass("active");
            $(".process-bar-step2").text("");
            $(".process-bar-step2").append('<img width="25" height="25" src="https://img.icons8.com/ios-filled/50/FFFFFF/checkmark--v1.png" alt="checkmark--v1"/>')
            $(".process-bar-line23").addClass("active");
            $(".currentStepIcon").remove();
            $(".process-bar-step3").append(currentStepIcon);
            $(".process-bar div").removeClass("current");
            $(".process-bar-step3").addClass("current");
        } else if (step === 4) {
            $(".process-bar-step3").addClass("active");
            $(".process-bar-step3").text("");
            $(".currentStepIcon").remove();
            $(".process-bar div").removeClass("current");
            $(".process-bar-step3").append('<img width="25" height="25" src="https://img.icons8.com/ios-filled/50/FFFFFF/checkmark--v1.png" alt="checkmark--v1"/>')
        }
    });

    return (
        <div>
            <div className="services-container">
                <div className="services-container-left">
                    <div className="services-title"><h2>Appointment Booking</h2></div>
                    <div className="process-bar">
                        <div className="process-bar-step1">1</div>
                        <div className="process-bar-line12"></div>
                        <div className="process-bar-step2">2</div>
                        <div className="process-bar-line23"></div>
                        <div className="process-bar-step3">3</div>
                    </div>
                    <div className="services-form-container">
                        {showSuccess && <SuccessMessage />}
                        {!showSuccess && (
                            <>
                                {step === 1 && (
                                    <>
                                        <div className={`form-section ${animationClass}`}>
                                            <h3>Select Department, Doctor, and Appointment Date</h3>
                                            <div>
                                                <label htmlFor="department">Department</label>
                                                <Select
                                                    id="department"
                                                    name="department"
                                                    options={departmentOptions}
                                                    onChange={handleDepartmentChange}
                                                    value={departmentOptions.find(option => option.value === formData.department)}
                                                    components={{ Option: CustomOption }}
                                                />
                                                {selectedDepartment && (
                                                    <div className="department-info">
                                                        <h4>{selectedDepartment.department_name}</h4>
                                                        <div>
                                                            <img src={selectedDepartment.department_img}
                                                                 alt="Department" />
                                                            <p>{selectedDepartment.department_description}</p>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                            {formData.department && (
                                                <div>
                                                    <label htmlFor="doctor">Doctor</label>
                                                    <Select
                                                        id="doctor"
                                                        name="doctor"
                                                        options={doctorOptions}
                                                        onChange={handleDoctorChange}
                                                        value={doctorOptions.find(option => option.value === formData.doctor)}
                                                        components={{ Option: CustomOption }}
                                                    />

                                                    {selectedDoctor && (
                                                        <div className="doctor-info">
                                                            <img src={selectedDoctor.doctor_image} alt="Doctor" />
                                                            <div>
                                                                <h4>{selectedDoctor.doctor_name}</h4>
                                                                <p>{selectedDoctor.doctor_description}</p>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            )}

                                            {formData.doctor && renderDateButtons()}
                                            {formData.doctor && formData.date && renderTimeSlots()}
                                            <button onClick={handleNextStep}
                                                    disabled={!formData.department || !formData.doctor || !formData.date || !formData.timeSlot || isAnimating}>
                                                Next Step
                                            </button>
                                        </div>
                                    </>
                                )}

                                {step === 2 && (
                                    <>
                                        <div className={`form-section ${animationClass}`}>
                                            <h3>Enter Patient Information</h3>
                                            <div>
                                                <label htmlFor="patient_name">Full Name:</label>
                                                <input type="text" id="patient_name" name="patient_name"
                                                       value={formData.patient_name} onChange={handleChange} required />
                                                {nameError && <p style={{ color: 'red' }}>{nameError}</p>}
                                            </div>
                                            <div>
                                                <label htmlFor="patient_email">Email:</label>
                                                <input type="email" id="patient_email" name="patient_email"
                                                       value={formData.patient_email} onChange={handleChange} required />
                                                {emailError && <p style={{ color: 'red' }}>{emailError}</p>}
                                            </div>
                                            <div>
                                                <label htmlFor="patient_phone">Phone Number:</label>
                                                <input type="text" id="patient_phone" name="patient_phone"
                                                       value={formData.patient_phone} onChange={handleChange} required />
                                                {phoneError && <p style={{ color: 'red' }}>{phoneError}</p>}
                                            </div>
                                            <div className="button-grp">
                                                <button onClick={handlePrevStep} disabled={isAnimating}>Previous Step</button>
                                                <button onClick={handleNextStep}
                                                        disabled={!formData.patient_name || !formData.patient_email || !formData.patient_phone || phoneError || emailError || nameError || isAnimating}>
                                                    Next Step
                                                </button>

                                            </div>
                                        </div>
                                    </>
                                )}

                                {step === 3 && (
                                    <>
                                        <div className={`form-section3 ${animationClass}`}>
                                            <h3>Confirm Information And Payment</h3>
                                            <div className="payment-container">
                                                <div className="appointment-div">
                                                    <h4>Appointment Information</h4>
                                                    <p>Department: {selectedDepartment ? selectedDepartment.department_name : ''}</p>
                                                    <p>Doctor: {selectedDoctor ? selectedDoctor.doctor_name : ''}</p>
                                                    <p>Date: {formData.date}</p>
                                                    <p>Time: {availableSlots.find(slot => slot.value === formData.timeSlot)?.label}</p>
                                                    <p>Total: {doctorPrice}$</p>
                                                </div>
                                                <div className="patient-div">
                                                    <h4>Patient Information</h4>
                                                    <p>Full Name: {formData.patient_name}</p>
                                                    <p>Email: {formData.patient_email}</p>
                                                    <p>Phone Number: {formData.patient_phone}</p>
                                                </div>
                                            </div>
                                            <PayPalScriptProvider options={{
                                                "client-id": "AeG-ZT8O4yhQvzCBjVp-w4bNu4oa0O1u7CIMWVg5MBDGmWQ3KwgQuDASxQup6DqOCCuo1QKILXWt4rUD",
                                                currency: "USD"
                                            }}>
                                                <PayPalButtons
                                                    createOrder={(data, actions) => {
                                                        return actions.order.create({
                                                            purchase_units: [{
                                                                amount: {
                                                                    value: doctorPrice.toString()
                                                                }
                                                            }]
                                                        });
                                                    }}
                                                    onApprove={(data, actions) => {
                                                        return actions.order.capture().then(details => {
                                                            setStep(4);
                                                            setShowSuccess(true);
                                                            submitAppointment();
                                                        });
                                                    }}
                                                />
                                            </PayPalScriptProvider>

                                            <button onClick={handlePrevStep} disabled={isAnimating}>Previous Step</button>
                                        </div>
                                    </>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>
            <footer className="footer">
                <div className="footer-container">
                    <div className="footer-row">
                        <div className="footer-col">
                            <h3> FPT Health International Hospital Hanoi City </h3>
                            <ul>
                                <li><img width={20} height={20}
                                         src="https://img.icons8.com/ios-filled/50/004B91/visit.png"
                                         alt="visit" />
                                    109 Truong Chinh Street, Phuong Liet Ward, Thanh Xuan
                                    District, Hanoi City
                                </li>
                                <li><img width={20} height={20}
                                         src="https://img.icons8.com/ios-glyphs/30/004B91/phone--v1.png"
                                         alt="phone--v1" /> 012 3456 789
                                </li>
                                <li><img width={20} height={20}
                                         src="https://img.icons8.com/ios-filled/50/004B91/mail.png"
                                         alt="mail" /> FptHealth@gmail.com
                                </li>
                            </ul>
                        </div>
                        <div className="footer-col">
                            <h3> FPT Health International Hospital Hanoi Branch </h3>
                            <ul>
                                <li><img width={20} height={20}
                                         src="https://img.icons8.com/ios-filled/50/004B91/visit.png"
                                         alt="visit" /> 8A
                                    Ton
                                    That Thuyet, My Dinh Ward, Nam Tu Liem District
                                </li>
                                <li><img width={20} height={20}
                                         src="https://img.icons8.com/ios-glyphs/30/004B91/phone--v1.png"
                                         alt="phone--v1" /> 029 2376 6270
                                </li>
                                <li><img width={20} height={20}
                                         src="https://img.icons8.com/ios-filled/50/004B91/mail.png"
                                         alt="mail" /> FptHealth@gmail.com
                                </li>
                            </ul>
                        </div>
                        <div className="footer-col">
                            <h3>FPT Health International Hospital Ho Chi Minh City</h3>
                            <ul>
                                <li><img width={20} height={20}
                                         src="https://img.icons8.com/ios-filled/50/004B91/visit.png" alt="visit" />181
                                    Nguyen Dinh Chieu Street, Vo Thi Sau Ward, District 3, Ho
                                    Chi Minh City
                                </li>
                                <li><img width={20} height={20}
                                         src="https://img.icons8.com/ios-glyphs/30/004B91/phone--v1.png"
                                         alt="phone--v1" /> 012 3456 789
                                </li>
                                <li><img width={20} height={20}
                                         src="https://img.icons8.com/ios-filled/50/004B91/mail.png"
                                         alt="mail" /> FptHealth@gmail.com
                                </li>
                            </ul>
                        </div>
                        <div className="footer-col"><h3>FPT Health International Hospital Ho
                            Chi Minh City Branch</h3>
                            <ul>
                                <li><img width={20} height={20}
                                         src="https://img.icons8.com/ios-filled/50/004B91/visit.png"
                                         alt="visit" /> 391A
                                    Nam Ky Khoi Nghia, Vo Thi Sau Ward, District 3
                                </li>
                                <li><img width={20} height={20}
                                         src="https://img.icons8.com/ios-glyphs/30/004B91/phone--v1.png"
                                         alt="phone--v1" /> 012 3456 789
                                </li>
                                <li><img width={20} height={20}
                                         src="https://img.icons8.com/?size=100&id=53435&format=png&color=004B91"
                                         alt="" /> FptHealth@gmail.com
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div className="footer-bottom">
                        <div className="footer-social">
                            <ul>
                                <li><a href="https://www.facebook.com"><img width="50" height="50"
                                                                            src="https://img.icons8.com/fluency/48/facebook-new.png"
                                                                            alt="facebook-new" /></a></li>
                                <li><a href="https://zalo.me"><img width="50" height="50"
                                                                   src="https://img.icons8.com/color/48/zalo.png"
                                                                   alt="zalo" /></a></li>
                                <li><a href=""><img width="50" height="50"
                                                    src="https://img.icons8.com/fluency/48/facebook-messenger--v2.png"
                                                    alt="facebook-messenger--v2" /></a>
                                </li>
                            </ul>
                        </div>
                        <div className="footer-copyright">
                            <p>© 2024 FPT Health. All rights reserved.</p>
                            <p><a href="#">Terms of use</a> | <a href="#">Privacy Policy</a></p>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Services;
