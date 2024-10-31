import React, { useState, useEffect } from 'react';
import axios from 'axios';

const RegistrationForm = () => {
    const [formData, setFormData] = useState({
        patient_name: '',
        patient_email: '',
        patient_phone: '',
        patient_address: '',
        department: '',
        doctor: '',
        date: '',
        timeSlot: '',
        type: 'Appointments',
        patient_username: '',
        patient_password: '',
        patient_gender: '' // Thêm trường này
    });

    const [departments, setDepartments] = useState([]);
    const [doctors, setDoctors] = useState([]);
    const [bookedSlots, setBookedSlots] = useState([]);
    const [availableSlots, setAvailableSlots] = useState([]);
    const [selectedDepartmentName, setSelectedDepartmentName] = useState('');
    const [selectedDoctorName, setSelectedDoctorName] = useState('');

    const timeSlots = [
        { label: '8:00 AM - 9:00 AM', value: 1 },
        { label: '9:00 AM - 10:00 AM', value: 2 },
        { label: '10:00 AM - 11:00 AM', value: 3 },
        { label: '11:00 AM - 12:00 PM', value: 4 },
        { label: '1:00 PM - 2:00 PM', value: 5 },
        { label: '2:00 PM - 3:00 PM', value: 6 },
        { label: '3:00 PM - 4:00 PM', value: 7 },
        { label: '4:00 PM - 5:00 PM', value: 8 }
    ];

    useEffect(() => {
        axios.get('http://localhost:8080/api/v1/departments/list')
            .then(response => {
                setDepartments(response.data);
            })
            .catch(error => {
                console.error('Có lỗi xảy ra khi lấy danh sách các khoa!', error);
            });
    }, []);

    useEffect(() => {
        if (formData.department) {
            const selectedDepartment = departments.find(dept => dept.department_id === formData.department);
            setSelectedDepartmentName(selectedDepartment ? selectedDepartment.department_name : '');
            axios.get(`http://localhost:8080/api/v1/departments/${formData.department}/doctors`)
                .then(response => {
                    setDoctors(response.data);
                })
                .catch(error => {
                    console.error('Có lỗi xảy ra khi lấy danh sách bác sĩ!', error);
                });
        }
    }, [formData.department, departments]);

    useEffect(() => {
        if (formData.doctor) {
            const selectedDoctor = doctors.find(doc => doc.doctor_id === formData.doctor);
            setSelectedDoctorName(selectedDoctor ? selectedDoctor.doctor_name : '');
        }
    }, [formData.doctor, doctors]);

    useEffect(() => {
        if (formData.doctor && formData.date) {
            axios.get(`http://localhost:8080/api/v1/appointments/${formData.doctor}/slots`)
                .then(response => {
                    setBookedSlots(response.data);
                })
                .catch(error => {
                    console.error('Có lỗi xảy ra khi lấy danh sách slot đã đặt!', error);
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
    };

    const generateRandomPassword = () => {
        const length = 8;
        const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let password = '';
        for (let i = 0; i < length; i++) {
            const randomIndex = Math.floor(Math.random() * charset.length);
            password += charset[randomIndex];
        }
        return password;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const dataToSend = {
            ...formData,
            appointment_date: new Date().toISOString(),
            medical_day: formData.date,
            slot: formData.timeSlot,
            doctor_id: formData.doctor,
            status: 'Pending',
            patient_username: formData.patient_email,
            patient_password: generateRandomPassword(),
            doctor_name: selectedDoctorName,
            department_name: selectedDepartmentName
        };

        console.log('Data to send:', dataToSend);

        try {
            const response = await axios.post('http://localhost:8080/api/v1/appointments/insert', dataToSend);
            console.log(response.data);
            alert('Đăng ký thành công!');

            // Gửi email sau khi đăng ký thành công
            sendEmailFormRegister(selectedDoctorName, selectedDepartmentName, dataToSend.appointment_date, formData.patient_email, formData.patient_name);
        } catch (error) {
            console.error('Có lỗi xảy ra khi đăng ký lịch hẹn!', error);
            alert('Đăng ký thất bại.');
        }
    };

    const sendEmailFormRegister = (doctorName, departmentName, appointmentDate, patientEmail, patientName) => {
        axios.post('http://localhost:8080/api/v1/appointments/send-email', {
            doctorName,
            departmentName,
            appointmentDate,
            patientEmail,
            patientName
        }).then(response => {
            console.log('Email sent successfully');
        }).catch(error => {
            console.error('Error sending email', error);
        });
    };

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label htmlFor="department">Khoa:</label>
                <select id="department" name="department" value={formData.department} onChange={handleChange} required>
                    <option value="">Chọn khoa</option>
                    {departments.map(department => (
                        <option key={department.department_id} value={department.department_id}>{department.department_name}</option>
                    ))}
                </select>
            </div>
            {formData.department && (
                <div>
                    <label htmlFor="doctor">Bác sĩ:</label>
                    <select id="doctor" name="doctor" value={formData.doctor} onChange={handleChange} required>
                        <option value="">Chọn bác sĩ</option>
                        {doctors.map(doctor => (
                            <option key={doctor.doctor_id} value={doctor.doctor_id}>{doctor.doctor_name}</option>
                        ))}
                    </select>
                </div>
            )}
            {formData.doctor && (
                <>
                    <div>
                        <label htmlFor="date">Ngày khám:</label>
                        <input type="date" id="date" name="date" value={formData.date} onChange={handleChange} required />
                    </div>
                    <div>
                        <label htmlFor="timeSlot">Giờ khám:</label>
                        <select id="timeSlot" name="timeSlot" value={formData.timeSlot} onChange={handleChange} required>
                            <option value="">Chọn giờ khám</option>
                            {availableSlots.map(slot => (
                                <option key={slot.value} value={slot.value}>{slot.label}</option>
                            ))}
                        </select>
                    </div>
                </>
            )}
            <div>
                <label htmlFor="patient_name">Họ và tên:</label>
                <input type="text" id="patient_name" name="patient_name" value={formData.patient_name} onChange={handleChange} required />
            </div>
            <div>
                <label htmlFor="patient_email">Email:</label>
                <input type="email" id="patient_email" name="patient_email" value={formData.patient_email} onChange={handleChange} required />
            </div>
            <div>
                <label htmlFor="patient_phone">Số điện thoại:</label>
                <input type="text" id="patient_phone" name="patient_phone" value={formData.patient_phone} onChange={handleChange} required />
            </div>
            <div>
                <label htmlFor="patient_address">Địa chỉ:</label>
                <input type="text" id="patient_address" name="patient_address" value={formData.patient_address} onChange={handleChange} />
            </div>
            <div>
                <label htmlFor="patient_gender">Giới tính:</label>
                <select id="patient_gender" name="patient_gender" value={formData.patient_gender} onChange={handleChange} required>
                    <option value="">Chọn giới tính</option>
                    <option value="male">Nam</option>
                    <option value="female">Nữ</option>
                    <option value="other">Khác</option>
                </select>
            </div>
            <button type="submit">Đặt lịch hẹn</button>
        </form>
    );
};

export default RegistrationForm;
