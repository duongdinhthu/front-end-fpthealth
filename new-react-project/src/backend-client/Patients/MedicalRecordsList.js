import React, {useEffect, useState} from 'react';
import { useNavigate } from 'react-router-dom';
import "./MedicalRecordsList.css";
import axios from "axios";

const MedicalRecordsList = ({ medicalRecords }) => {
    const navigate = useNavigate();

    const viewRecordDetails = (record) => {
        navigate('/record-details', { state: { record } });
    };
    const [doctors, setDoctors] = useState([]);
    const [departments, setDepartments] = useState([]);
    useEffect(() => {
        const fetchDetails = async () => {
            try {
                const [patientResponse, doctorsResponse, departmentsResponse] = await Promise.all([
                    axios.get('http://localhost:8080/api/v1/patients/list'),
                    axios.get('http://localhost:8080/api/v1/doctors/list'),
                    axios.get('http://localhost:8080/api/v1/departments/list')
                ]);

                setDoctors(doctorsResponse.data);
                setDepartments(departmentsResponse.data);
            } catch (error) {
                console.error('Error fetching details', error);
            }
        };

        fetchDetails();
    }, []);

    const getDepartmentName = (doctorId) => {
        const doctor = doctors.find(doc => doc.doctor_id === doctorId);
        if (doctor) {
            const department = departments.find(dep => dep.department_id === doctor.department_id);
            return department ? department.department_name : 'Unknown Department';
        }
        return 'Unknown Department';
    };

    return (
        <div style={{ width: '100%' }}>
            <div className="MedicalRecords">
                <div className="grid-container">
                    {medicalRecords && medicalRecords.map(record => (
                        <div key={record.record_id} className="grid-item">
                            <h3>{record.follow_up_date}</h3>
                            <p><strong>Department:</strong> {record.doctors && record.doctors.length > 0 ? getDepartmentName(record.doctors[0].department_id) : 'No Department Info'}</p>
                            <p>
                                <strong>Doctor:</strong> {record.doctors && record.doctors.length > 0 ? record.doctors[0].doctor_name : 'No Doctor Info'}
                            </p>
                            <p><strong>Symptoms:</strong> {record.symptoms}</p>
                            <p><strong>Diagnosis:</strong> {record.diagnosis}</p>
                            <button onClick={() => viewRecordDetails(record)}>View Details</button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default MedicalRecordsList;
