import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import "../Patients/RecordDetails.css";
import axios from "axios";
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const RecordDetails = () => {
    const [patientData, setPatientData] = useState({});
    const [departmentData, setDepartmentData] = useState({});
    const [doctorData, setDoctorData] = useState({});
    const location = useLocation();
    const { record } = location.state || {};

    useEffect(() => {
        const scrollToTop = () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        };
        scrollToTop();
    }, []);

    useEffect(() => {
        const fetchDoctorData = async () => {
            try {
                if (record && record.doctors) {
                    const fetchPromises = record.doctors.map(async (doc) => {
                        const response = await axios.get(`http://localhost:8080/api/v1/departments/search?department_id=${doc.department_id}`);
                        setDepartmentData(response.data[0] || {});
                        setDoctorData(doc);
                    });
                    await Promise.all(fetchPromises);
                } else {
                    console.error("Record or record.doctors is undefined");
                }
            } catch (error) {
                console.error("Error fetching doctor data", error);
            }
        };

        fetchDoctorData();
    }, [record]);

    useEffect(() => {
        const fetchPatientData = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/api/v1/patients/search?patient_id=${record.patient_id}`);
                setPatientData(response.data[0] || {});
            } catch (error) {
                console.error("Error fetching patient data", error);
            }
        };

        if (record && record.patient_id) {
            fetchPatientData();
        }
    }, [record.patient_id]);

    const calculateAge = (dob) => {
        if (!dob) return 'Not Available';

        const birthDate = new Date(dob);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDifference = today.getMonth() - birthDate.getMonth();
        if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age;
    };

    const generatePDF = () => {
        const button = document.querySelector('.download-pdf-button');
        button.style.display = 'none';

        // Capture the content for PDF
        const input = document.getElementById('record-details-container');
        html2canvas(input).then((canvas) => {
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a4');
            const imgWidth = 210;
            const pageHeight = 295;
            const imgHeight = canvas.height * imgWidth / canvas.width;
            let heightLeft = imgHeight;
            let position = 0;

            pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
            heightLeft -= pageHeight;

            while (heightLeft >= 0) {
                position -= pageHeight;
                pdf.addPage();
                pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
                heightLeft -= pageHeight;
            }

            pdf.save('record-details-' + record.follow_up_date + '.pdf');
            button.style.display = 'block';
        });
    };


    if (!record) {
        return <p>No record details available</p>;
    }

    return (
        <div className="record-details-container" id="record-details-container">
            <h1 className="record-title">Medical Record Details</h1>
            <span className="recordID">MRN: {record.record_id}</span>
            <section>
                <h4>I. Patient Information</h4>
                <div className="patient-info-row">
                    <p><strong>Patient Name:</strong> {patientData.patient_name || 'Not Available'}</p>
                    <p><strong>Date of Birth:</strong> {patientData.patient_dob || 'Not Available'}</p>
                    <p>
                        <strong>Age:</strong> {patientData.patient_dob ? calculateAge(patientData.patient_dob) : 'Not Available'}
                    </p>
                </div>
                <p><strong>Gender:</strong> {patientData.patient_gender || 'Not Available'}</p>
                <p><strong>Address:</strong> {patientData.patient_address || 'Not Available'}</p>
                <p><strong>Email:</strong> {patientData.patient_email || 'Not Available'}</p>
            </section>

            <section>
                <h4>II. Diagnosis</h4>
                <p><strong>Record Date:</strong> {record.follow_up_date || 'Not Available'}</p>
                <p><strong>Department:</strong> {departmentData.department_name || 'Not Available'}</p>
                <p><strong>Doctor Name:</strong> {doctorData.doctor_name || 'Not Available'}</p>
                <p><strong>Symptoms:</strong> {record.symptoms || 'Not Available'}</p>
                <p><strong>Diagnosis Of Disease Name:</strong> {record.diagnosis || 'Not Available'}</p>
            </section>

            <section>
                <h4>III. Treatment</h4>
                <p><strong>Prognosis:</strong></p>
                <div className="prognosis-container">
                    {record.treatment || 'Not Available'}
                </div>
                <p><strong>Notes:</strong></p>
                <div className="notes-container">
                    {record.prescription || 'Not Available'}
                </div>
            </section>
            <button onClick={generatePDF} className="download-pdf-button"><img width="20" height="20" src="https://img.icons8.com/ios/50/FFFFFF/pdf--v1.png" alt="pdf--v1"/><span>Download
                PDF</span>
            </button>
        </div>

    );
};

export default RecordDetails;
