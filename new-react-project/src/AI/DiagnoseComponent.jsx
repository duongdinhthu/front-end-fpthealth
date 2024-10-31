import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './DiagnoseComponent1.css';

function DiagnoseComponent() {
    const [selectedFile, setSelectedFile] = useState(null);
    const [prediction, setPrediction] = useState([]);
    const [loading, setLoading] = useState(false);
    const [displayedText, setDisplayedText] = useState('');
    const [fullText, setFullText] = useState('');
    const [index, setIndex] = useState(0);
    const [isClicked, setIsClicked] = useState(false);

    useEffect(() => {
        if (index < fullText.length) {
            const timeout = setTimeout(() => {
                setDisplayedText((prev) => prev + fullText[index]);
                setIndex(index + 1);
            }, 50);
            return () => clearTimeout(timeout);
        }
    }, [index, fullText]);

    const handleFileChange = (event) => {
        setSelectedFile(event.target.files[0]);
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                document.getElementById('upload-image').src = e.target.result;
                document.getElementById('upload-image').style.display = 'block';
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!selectedFile) {
            alert('Please select a file first!');
            return;
        }

        const formData = new FormData();
        formData.append('file', selectedFile);

        setLoading(true);
        setDisplayedText('');
        setIndex(0);

        try {
            const response = await axios.post('http://localhost:8000/predict', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            setPrediction(response.data.predictions);
            setFullText(
                response.data.predictions
                    .map(
                        (pred) =>
                            `Label: ${pred.label}\nProbability: ${pred.probability}\nAdvice: ${pred.advice}\nPrescription: ${pred.prescription}\n\n`
                    )
                    .join('')
            );
        } catch (error) {
            console.error('There was an error making the request:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleClear = () => {
        document.getElementById('upload-image').src = '';
        document.getElementById('upload-image').style.display = 'none';
        setSelectedFile(null);
        setPrediction([]);
        setDisplayedText('');
        setIsClicked(false);
    };

    return (
        <div className="AI-container">
            <div className="AI-content">
                <h2 className="title">AI Diagnose System</h2>
                <form onSubmit={handleSubmit}>
                    <div
                        className={`img-upload ${isClicked ? 'clicked' : ''}`}
                        onClick={() => {
                            if (!isClicked) {
                                setIsClicked(true);
                                document.getElementById('img-input').click();
                            }
                        }}
                    >
                        <div className="upload-box">
                            <img alt="" id="upload-image" className="upload-image" />
                            <input
                                id="img-input"
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                                style={{ display: 'none' }}
                            />
                            <p>Click to upload an image</p>
                        </div>
                    </div>

                    {loading && <div className="loading-spinner">Loading...</div>}

                    <div className="button-group">
                        <button type="button" className="clearImage" onClick={handleClear}>
                            Clear
                        </button>
                        <button type="submit" className="submit-btn">
                            Predict
                        </button>
                    </div>
                </form>
            </div>

            {/* Phần dự đoán được tách riêng */}
            {displayedText && (
                <div className="prediction-container">
                    <div className="prediction">
                        <p>{displayedText}</p>
                    </div>
                </div>
            )}
        </div>
    );
}

export default DiagnoseComponent;
