import React, { useState } from 'react';

const EditPatientForm = ({ patient, onSave }) => {
    const [updatedFields, setUpdatedFields] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUpdatedFields((prev) => ({ ...prev, [name]: value }));
    };

    const handleGenderChange = (value) => {
        setUpdatedFields((prev) => ({ ...prev, patient_gender: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Only include fields that have changed
        const fieldsToUpdate = Object.keys(updatedFields).reduce((acc, key) => {
            if (updatedFields[key] !== patient[key]) {
                acc[key] = updatedFields[key];
            }
            return acc;
        }, {});
        onSave(fieldsToUpdate);
    };

    const handleCancel = () => {
        window.location.href = '/dashboard';
    };

    return (
        <form onSubmit={handleSubmit} className="edit-form">
            <div className="form-group">
                <input type="email" name="patient_email" className="patient" defaultValue={patient.patient_email}
                       onChange={handleChange} />
                <label>Email</label>
            </div>
            <div className="form-group">
                <input type="number" name="patient_phone" className="patient" defaultValue={patient.patient_phone}
                       onChange={handleChange} />
                <label>Phone</label>
            </div>
            <div className="form-group">
                <input type="text" name="patient_address" className="patient" defaultValue={patient.patient_address}
                       onChange={handleChange} />
                <label>Address</label>
            </div>
            <div className="form-group">
                <input type="date" name="patient_dob" className="patient" defaultValue={patient.patient_dob}
                       onChange={handleChange} />
                <label>Date of Birth</label>
            </div>
            <div className="patient_gender">
                <div>
                    <label>Male</label>
                    <input type="checkbox" className="patient" checked={updatedFields.patient_gender ? updatedFields.patient_gender === 'Male' : patient.patient_gender === 'Male'} onChange={() => handleGenderChange('Male')} />
                </div>
                <div>
                    <label>Female</label>
                    <input type="checkbox" className="patient" checked={updatedFields.patient_gender ? updatedFields.patient_gender === 'Female' : patient.patient_gender === 'Female'} onChange={() => handleGenderChange('Female')} />
                </div>
                <div>
                    <label>Other</label>
                    <input type="checkbox" className="patient" checked={updatedFields.patient_gender ? updatedFields.patient_gender === 'Other' : patient.patient_gender === 'Other'} onChange={() => handleGenderChange('Other')} />
                </div>
            </div>
            <div className="btn-group">
                <button type="button" className="cancel-button" onClick={handleCancel}>Cancel</button>
                <button type="submit" className="save-button">Save</button>
            </div>
        </form>
    );
};

export default EditPatientForm;
