import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PatientInfo from './PatientInfo';
import AppointmentsList from './AppointmentsList';
import MedicalRecordsList from './MedicalRecordsList';
import EditPatientForm from './EditPatientForm';
import './PatientDashboard.css';
import $ from 'jquery';

const PatientDashboard = ({ patientId }) => {
    const [patient, setPatient] = useState(null);
    const [showAppointments, setShowAppointments] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');
    const [imagePath, setImagePath] = useState('');
    const [imageValid, setImageValid] = useState(false);
    const [alertMess, setAlertMess] = useState('');
    const [wrongPass, setWrongPass] = useState('');

    useEffect(() => {
        const fetchPatientData = async () => {
            try {
                if (patientId) {
                    $(".links li a").removeClass("active");
                    $(".login-container").removeClass("open");
                    $(".login-container").addClass("close");
                    const response = await axios.get(`http://localhost:8080/api/v1/patients/search?patient_id=${patientId}`);
                    const patientData = response.data[0];
                    setPatient(patientData);
                    if (patientData.patient_img === null || patientData.patient_img === undefined || patientData.patient_img === '') {
                        setImageValid(false);
                    } else {
                        setImagePath(`http://localhost:8080/${patientData.patient_img}`);
                        setImageValid(true);
                    }
                } else {
                    console.error('Invalid patientId:', patientId);
                    $(".login-container").removeClass("close");
                    $(".login-container").addClass("open");
                    $("#submit").val("Sign in");
                }
            } catch (error) {
                console.error('Error fetching patient data:', error);
            }
        };

        fetchPatientData();
    }, [patientId]);

    const handleEditClick = () => {
        setIsEditing(true);
    };

    const handleSaveClick = async (fieldsToUpdate) => {
        try {
            await axios.put('http://localhost:8080/api/v1/patients/update', { ...patient, ...fieldsToUpdate });
            setPatient((prev) => ({ ...prev, ...fieldsToUpdate }));
            setIsEditing(false);
        } catch (error) {
            console.error('Error updating patient data:', error);
        }
    };

    const handlePasswordChange = async (e) => {
        e.preventDefault();
        if (newPassword !== confirmNewPassword) {
            setAlertMess('Passwords do not match');
            return;
        } else {
            setAlertMess('');
        }

        try {
            await axios.post('http://localhost:8080/api/v1/patients/change-password', {
                patient_id: patientId,
                currentPassword,
                newPassword
            });
            $(document).ready(function () {
                $(".main-mess .message-text").text("Password has been change successfully");
                $(".main-mess").addClass("active");
                var timeoutDuration = 2000;
                var progressBar = $(".main-mess .timeout-bar");
                progressBar.addClass("active");
                setTimeout(function () {
                    $(".main-mess").removeClass("active");
                    progressBar.removeClass("active");
                }, timeoutDuration);
            });
            setCurrentPassword('');
            setNewPassword('');
            setConfirmNewPassword('');
            setAlertMess('');
            setWrongPass('');
            $(".changePassContainer").removeClass("open");
        } catch (error) {
            console.error('Error changing password:', error);
            setWrongPass('Incorrect password');
        }
    };

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        const formData = new FormData();
        formData.append('image', file);
        formData.append('patient_id', patientId);

        try {
            const response = await axios.post('http://localhost:8080/api/v1/patients/upload-image', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            // Thay đổi đường dẫn ảnh để lấy từ server
            setImagePath(`http://localhost:8080/${response.data.filePath}`);
            const updatedPatient = { ...patient, patient_img: response.data.filePath };
            setPatient(updatedPatient);
            setImageValid(true);
        } catch (error) {
            console.error('Error uploading image:', error);
        }
    };

    $(document).ready(function () {
        $("#changePatientImg").unbind("click");
        $("input:not([type='checkbox'])").each(function (i, ele) {
            if ($(ele).val() !== '') {
                $(this).addClass('has-value');
            } else {
                $(this).removeClass('has-value');
            }

            $(ele).on("input", function () {
                if ($(this).val() !== '') {
                    $(this).addClass('has-value');
                } else {
                    $(this).removeClass('has-value');
                }
            });
        });

        $(".changePass").on("click", function () {
            if ($(".changePassContainer").hasClass("open")) {
                $(this).removeClass("open");
            } else {
                $(".changePassContainer").addClass("open");
                $(".changePassContainer input").val("");
            }
        });

        $(".close-change-pass").on("click", function () {
            $(".changePassContainer").removeClass("open");
            $(".changePassContainer input").val("");
        });

        $('.patient_gender div input[type="checkbox"]').each(function (i, ele) {
            $(ele).change(function () {
                if ($(this).prop("checked")) {
                    $('.patient_gender div input[type="checkbox"]').not(this).prop("checked", false);
                }
            });
        });
    });

    return (
        <div className="dashboard-container">
            <div className="changePassContainer">
                <div className="changePassOverlay"></div>
                <div className="changePassForm">
                    <form onSubmit={handlePasswordChange}>
                        <div className="close-change-pass">
                            <img width="24" height="24"
                                 src="https://img.icons8.com/material-outlined/24/000000/delete-sign.png"
                                 alt="delete-sign" />
                        </div>
                        <h3>Change Your Password</h3>
                        <div className="input-list">
                            <div className="input-div">
                                <input type="password" id="recent_password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} />
                                <label htmlFor="recent_password">Current Password</label>
                                {wrongPass && <span className="changePassAlert">{wrongPass}</span>}
                            </div>
                            <div className="input-div">
                                <input type="password" id="new_password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
                                <label htmlFor="new_password">New Password</label>
                            </div>
                            <div className="input-div">
                                <input type="password" id="re_new_password" value={confirmNewPassword} onChange={(e) => setConfirmNewPassword(e.target.value)} />
                                <label htmlFor="re_new_password">Confirm New Password</label>
                                {alertMess && <span className="changePassAlert">{alertMess}</span>}
                            </div>
                            <div>
                                <button type="submit">Submit</button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
            {patient ? (
                <>
                    {isEditing ? (
                        <div className="edit-patient-form">
                            <EditPatientForm patient={patient} onSave={handleSaveClick} />
                        </div>
                    ) : (
                        <>
                            <div className="patient-info">
                                <div className="patient-info-left">
                                    {imageValid ? (
                                        <img id="patientImg" src={imagePath} alt="Patient" />
                                    ) : (
                                        <img id="patientImg" />
                                    )}
                                    <button id="changePatientImg" onClick={() => document.getElementById('ipPatientImg').click()}>Change Image</button>
                                    <input id="ipPatientImg" type="file" accept="image/*" onChange={handleFileChange} style={{ display: 'none' }} />
                                    <button className="edit-button" onClick={handleEditClick}>Edit Profile</button>
                                    <button className="changePass">Change Password</button>
                                </div>
                                <PatientInfo patient={patient} />
                            </div>

                            {showAppointments ? (
                                <div className="appointments-list">
                                    <div className="appointments-list-header">
                                        <h2>Appointments</h2>
                                        <div className="toggle-buttons">
                                            <button className="toggle-button"
                                                    onClick={() => setShowAppointments(true)}>Appointments
                                            </button>
                                            <button className="toggle-button"
                                                    onClick={() => setShowAppointments(false)}>Medical
                                                Records
                                            </button>
                                        </div>
                                    </div>
                                    <AppointmentsList appointments={patient.appointmentsList}/>
                                </div>
                            ) : (
                                <div className="medical-records-list">
                                    <div className="medical-records-list-header">
                                    <h2>Medical Records</h2>
                                    <div className="toggle-buttons">
                                        <button className="toggle-button"
                                                onClick={() => setShowAppointments(true)}>Appointments
                                        </button>
                                        <button className="toggle-button"
                                                onClick={() => setShowAppointments(false)}>Medical
                                            Records
                                        </button>
                                    </div>
                                    </div>
                                    <MedicalRecordsList medicalRecords={patient.medicalrecordsList}/>
                                </div>
                            )}
                        </>
                    )}
                </>
            ) : (
                <div>
                </div>
            )}
        </div>
    );
};

export default PatientDashboard;
