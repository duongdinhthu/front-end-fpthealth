import React, {useState} from 'react';

const PatientInfo = ({patient}) => {
    const [showPassword, setShowPassword] = useState(false);

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };
    return (
        <div className="patient-info-right">
            <h2>Patient Information</h2>
            <p><strong>Name:</strong> {patient.patient_name}</p>
            <p><strong>Email:</strong> {patient.patient_email}</p>
            <p><strong>Phone:</strong> {patient.patient_phone}</p>
            <p><strong>Address:</strong> {patient.patient_address}</p>
            <p><strong>Date of Birth:</strong> {patient.patient_dob}</p>
            <p><strong>Gender:</strong> {patient.patient_gender}</p>
            <div className="patient-password"><p>
                <strong>Password: </strong>
                <span>{showPassword ? patient.patient_password : 'x'.repeat(patient.patient_password.length)}</span>
            </p>
                <a className="show-pass" onClick={togglePasswordVisibility}>
                    {showPassword
                        ?
                        <img
                            width="24"
                            height="24"
                            src="https://img.icons8.com/material-outlined/24/0044a5/hide.png"
                            alt="hide"/>
                        :
                        <img
                            width="24"
                            height="24"
                            src="https://img.icons8.com/material-outlined/24/0044a5/visible--v1.png"
                            alt="toggle visibility"/>
                    }
                </a>
            </div>
        </div>
    );
};

export default PatientInfo;
