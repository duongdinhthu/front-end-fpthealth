import React, { useState } from 'react';
import axios from 'axios';
import './PatientData.css';

function PatientData() {
    const [data, setData] = useState(null);
    const [searchFields, setSearchFields] = useState({
        patient_id: '',
        patient_name: '',
        patient_dob: '',
        patient_email: '',
        patient_phone: '',
        patient_address: '',
        patient_username: ''
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setSearchFields({
            ...searchFields,
            [name]: value
        });
    };

    const fetchData = async () => {
        const validFields = Object.fromEntries(Object.entries(searchFields).filter(([_, v]) => v));
        if (Object.keys(validFields).length > 0) {
            const queryString = new URLSearchParams(validFields).toString();
            try {
                const response = await axios.get(`http://localhost:8080/api/v1/patients/getById?${queryString}`);
                setData(response.data);
            } catch (error) {
                console.error('Error fetching data: ', error);
                // Xử lý nếu có lỗi, ví dụ như thông báo cho người dùng
            }
        } else {
            alert('Please enter at least one search field');
        }
    };

    return (
        <div className="container">
            <h1>Patient and Appointment Details</h1>
            <div className="search-fields">
                <input
                    type="text"
                    name="patient_id"
                    value={searchFields.patient_id}
                    onChange={handleInputChange}
                    placeholder="Enter Patient ID"
                />
                <input
                    type="text"
                    name="patient_name"
                    value={searchFields.patient_name}
                    onChange={handleInputChange}
                    placeholder="Enter Patient Name"
                />
                <input
                    type="date"
                    name="patient_dob"
                    value={searchFields.patient_dob}
                    onChange={handleInputChange}
                    placeholder="Enter Patient DOB"
                />
                <input
                    type="text"
                    name="patient_email"
                    value={searchFields.patient_email}
                    onChange={handleInputChange}
                    placeholder="Enter Patient Email"
                />
                <input
                    type="text"
                    name="patient_phone"
                    value={searchFields.patient_phone}
                    onChange={handleInputChange}
                    placeholder="Enter Patient Phone"
                />
                <input
                    type="text"
                    name="patient_address"
                    value={searchFields.patient_address}
                    onChange={handleInputChange}
                    placeholder="Enter Patient Address"
                />
                <input
                    type="text"
                    name="patient_username"
                    value={searchFields.patient_username}
                    onChange={handleInputChange}
                    placeholder="Enter Patient Username"
                />
                <button onClick={fetchData}>Fetch Data</button>
            </div>

            {data && data.map((patient, index) => (
                <div key={index}>
                    <div className="patient-info">
                        <h2>Patient Info</h2>
                        <p>ID: {patient.patient_id}</p>
                        <p>Name: {patient.patient_name}</p>
                        <p>Email: {patient.patient_email}</p>
                        <p>Phone: {patient.patient_phone}</p>
                        <p>Address: {patient.patient_address}</p>
                        <p>Username: {patient.patient_username}</p>

                    </div>

                    <div className="appointments">
                        <h2>Appointments</h2>
                        <div className="grid-container">
                            {patient.appointmentsList && patient.appointmentsList.map(app => (
                                <div key={app.appointment_id} className="grid-item">
                                    <p>Date: {app.appointment_date}</p>
                                    <p>Status: {app.status}</p>
                                    <p>Doctor: {app.doctor[0].doctor_name}</p>
                                    <p>Department: {app.doctor[0].department[0].department_name}</p>
                                    <p>Staff Name: {app.staff[0].staff_name || 'No Staff Name'}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="medical-records">
                        <h2>Medical Records</h2>
                        <div className="grid-container">
                            {patient.medicalrecordsList && patient.medicalrecordsList.map(record => (
                                <div key={record.record_id} className="grid-item">
                                    <p>Symptoms: {record.symptoms}</p>
                                    <p>Diagnosis: {record.diagnosis}</p>
                                    <p>Treatment: {record.treatment}</p>
                                    <p>Doctor Name: {record.doctors[0].doctor_name}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default PatientData;
