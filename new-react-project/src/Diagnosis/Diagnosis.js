import React, {useEffect, useState} from "react";
import './Diagnosis.css';
// import bannerImg from "../img/pexels-pavel-danilyuk-8442097.jpg";
// import logo from "../img/fpt-health-high-resolution-logo-transparent-white.png";
import axios from "axios";
// import rightImg from '../img/macroscopic_right-P2IJVT7N.digested.svg';
// import wrongImg from '../img/macroscopic_wrong-GNJLHPWX.digested.svg';

function Diagnosis() {
    const [imagePreviews, setImagePreviews] = useState([]); // Previews for selected images
    const [selectedFiles, setSelectedFiles] = useState([]); // List of selected files
    const [predictionResult, setPredictionResult] = useState(null); // Store prediction result
    const [loading, setLoading] = useState(false); // Loading state
    const [openInfo, setOpenInfo] = useState(true); // Info modal
    const [fullText, setFullText] = useState(''); // Full text to display (structured)
    const [medicalHistory, setMedicalHistory] = useState([]); // Store medical history
    const [comparisonMessage, setComparisonMessage] = useState(''); // Store comparison message
    const patientId = sessionStorage.getItem('patient_id'); // Lấy patient_id từ sessionStorage

    // Kiểm tra nếu không có patient_id
    useEffect(() => {
        if (!patientId) {
            alert('Please log in to access this feature.');
            window.location.href = '/'; // Điều hướng tới trang đăng nhập
        } else {
            // Gọi API để lấy lịch sử bệnh án của bệnh nhân
            loadMedicalHistory();
        }
    }, [patientId]);

    // Function to load medical history of the patient
    const loadMedicalHistory = async () => {
        setLoading(true); // Bắt đầu tải dữ liệu
        try {
            const response = await axios.get(`http://localhost:8080/api/v1/medicalrecords/search`, {
                params: {patient_id: patientId} // Truyền patient_id dưới dạng tham số
            });
            setMedicalHistory(response.data); // Lưu lịch sử bệnh án của bệnh nhân
        } catch (error) {
            console.error("Error loading medical history:", error); // Log lỗi nếu có vấn đề
        } finally {
            setLoading(false); // Kết thúc tải dữ liệu
        }
    };

    // Tìm kiếm lần chẩn đoán trước đó với cùng tên bệnh
    const findPreviousDiagnosis = (conclusion) => {
        // Lọc lịch sử để tìm lần khám với chẩn đoán tương tự
        const previousDiagnosis = medicalHistory.filter(record => record.diagnosis === conclusion);

        if (previousDiagnosis.length > 0) {
            // Lấy lần khám gần nhất trong số các lần khám cùng tên bệnh
            return previousDiagnosis[previousDiagnosis.length - 1];
        }
        return null; // Không có lần khám trước đó
    };

    // Xử lý khi người dùng chọn ảnh để tải lên
    const handleFileChange = (event) => {
        const files = Array.from(event.target.files); // Chuyển đổi file thành array
        setSelectedFiles(files); // Lưu danh sách file đã chọn

        // Tạo bản xem trước ảnh
        const previews = files.map((file) => URL.createObjectURL(file));
        setImagePreviews(previews); // Lưu bản xem trước ảnh
    };

    // Hàm xử lý khi nhấn submit
    const handleSubmit = async (event) => {
        event.preventDefault(); // Ngăn form reload trang
        if (selectedFiles.length === 0) return; // Đảm bảo có file được chọn

        const formData = new FormData(); // Tạo đối tượng FormData để chứa file
        selectedFiles.forEach((file) => {
            formData.append('files', file); // Thêm từng file vào FormData
        });

        setLoading(true); // Hiển thị trạng thái loading
        setFullText(''); // Reset văn bản đầy đủ

        try {
            // Gửi ảnh đến Spring Boot để lưu trữ và nhận lại đường dẫn ảnh
            const imageUploadResponse = await axios.post('http://localhost:8080/api/v1/medicalrecords/images/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            // Nhận danh sách đường dẫn của các ảnh đã tải lên từ phản hồi
            const uploadedImagePaths = imageUploadResponse.data.paths;

            // Gửi ảnh đến API AI để dự đoán
            const aiResponse = await axios.post('http://localhost:8000/predict', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            // Trích xuất dữ liệu từ phản hồi của AI
            const { conclusion, severity, advice, prescription } = aiResponse.data;

            // Làm tròn giá trị severity
            const roundedSeverity = parseFloat(severity).toFixed(2);

            // So sánh với lần khám trước đó
            const previousDiagnosis = findPreviousDiagnosis(conclusion);
            if (previousDiagnosis) {
                const previousSeverity = parseFloat(previousDiagnosis.severity);
                if (roundedSeverity > previousSeverity) {
                    setComparisonMessage('Tình trạng bệnh hiện tại nặng hơn lần khám trước.');
                } else {
                    setComparisonMessage('Tình trạng bệnh hiện tại đỡ hơn lần khám trước.');
                }
            } else {
                setComparisonMessage('Đây là lần khám đầu tiên cho bệnh này.');
            }

            // Lấy ngày hiện tại
            const today = new Date().toISOString().split('T')[0];

            // Tạo object gửi đến API Spring Boot để lưu vào cơ sở dữ liệu
            const medicalRecordData = {
                patient_id: patientId,
                diagnosis: conclusion,
                treatment: advice,
                prescription: prescription,
                follow_up_date: today,
                severity: roundedSeverity,
                image_paths: uploadedImagePaths // Lưu đường dẫn ảnh
            };

            // Gửi dữ liệu bệnh án đến API Spring Boot để lưu vào database
            await axios.post('http://localhost:8080/api/v1/medicalrecords/insert', medicalRecordData);

            // Hiển thị dữ liệu trên giao diện
            setFullText(`
                Conclusion: ${conclusion}
                Advice: ${advice}
                Prescription: ${prescription}
            `);

        } catch (error) {
            console.error('Error in prediction or saving medical record:', error);
        } finally {
            setLoading(false); // Kết thúc loading
        }
    };

    useEffect(() => {
        if (openInfo) {
            document.body.classList.add('no-scroll');
        } else {
            document.body.classList.remove('no-scroll');
        }
    }, [openInfo]);

    return (
        <main className="diagnosis-container">
            {openInfo && (
                <div className="diagnosis-notice">
                    <div className="notice-overlay"></div>
                    <div className="notice-content">
                        <div className="notice-content-left">
                            <h4>How to take a photo</h4>
                            <div className="tutorial-content">
                                <div className="tutorial-item">
                                    {/*<img className="tutorial-img" src={wrongImg} alt="wrong"/>*/}
                                    <span><img width="40" height="40"
                                               src="https://img.icons8.com/ios-filled/200/b90000/circled-x.png"
                                               alt="circled-x"/></span>
                                </div>
                                <div className="tutorial-item">
                                    {/*<img className="tutorial-img" src={rightImg} alt="right"/>*/}
                                    <span><img width="40" height="40"
                                               src="https://img.icons8.com/ios-filled/200/2ecc71/checked--v1.png"
                                               alt="checked--v1"/></span>
                                </div>
                            </div>
                            <button onClick={() => setOpenInfo(false)}>I Understand!</button>
                        </div>
                        <div className="notice-content-right">
                            <p>Take the photo about 4 inches away from the problem area</p>
                            <p>Center your symptom in the photo</p>
                            <p>Make sure there is good lighting</p>
                            <p>Ensure your photo isn't blurry</p>
                            <h5>Notes: The results provided are for reference purposes only and do not guarantee
                                absolute accuracy. Therefore, users should exercise caution and verify information from
                                other reliable sources before making decisions based on these results.</h5>
                        </div>
                    </div>
                </div>
            )}
            <section className="diagnosis-banner">
                {/*<img className="diagnosis-banner-img" src={bannerImg} alt="dashboard-banner-img"/>*/}
                <h4>Disease Diagnosis</h4>
                <div className="diagnosis-overlay"></div>
            </section>
            <section className="diagnosis-content">
                <div className="diagnosis-content-left">
                    <h4><img width="50" height="50" src="https://img.icons8.com/ios-filled/200/004b91/camera--v3.png"
                             alt="camera--v3"/>Upload your photo</h4>
                    <p>Make sure the photo is taken about 4 inches away from the problem area and center your symptom in
                        the frame.</p>
                </div>
                <div className="diagnosis-content-right">
                    <div className="upload-photo">
                        <button onClick={() => document.getElementById('img-input').click()}>
                            <img width="20" height="20"
                                 src="https://img.icons8.com/puffy-filled/200/ffffff/upload.png"
                                 alt="upload"/> Upload a photo
                        </button>
                        <input
                            id="img-input"
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            style={{display: 'none'}}
                            multiple
                        />
                        <div className="upload-box">
                            {imagePreviews.length > 0 && imagePreviews.map((src, index) => (
                                <img
                                    key={index}
                                    src={src}
                                    alt={`Uploaded ${index}`}
                                    className="upload-image"
                                />
                            ))}
                        </div>
                    </div>
                    <div className="diagnosis-action">
                        <button className="change-photo-btn"
                                onClick={() => document.getElementById('img-input').click()}
                                disabled={imagePreviews.length === 0}>Change Photo
                        </button>
                        <button className="prediction-btn" onClick={handleSubmit}
                                disabled={imagePreviews.length === 0 || loading}>Prediction
                        </button>
                    </div>
                    {loading && <div className="loading-spinner">Loading...</div>}
                    {fullText && (
                        <div className="prediction">
                            <p><strong>Conclusion:</strong> {fullText.split('\n')[1]}</p>
                            <p><strong>Advice:</strong> {fullText.split('\n')[2]}</p>
                            <p><strong>Prescription:</strong> {fullText.split('\n')[3]}</p>
                        </div>
                    )}
                    {comparisonMessage && (
                        <div className="comparison-message">
                            <p>{comparisonMessage}</p>
                        </div>
                    )}
                </div>
            </section>

            <footer>
                <div className="footer-container-top">
                    <div className="footer-logo">
                        {/*<img src={logo} alt="fpt-health" style={{width: 140 + 'px', height: 40 + 'px'}}/>*/}
                    </div>
                    <div className="footer-social">
                        <div className="fb-icon">
                            <img width="30" height="30"
                                 src="https://img.icons8.com/ios-filled/50/FFFFFF/facebook--v1.png"
                                 alt="facebook--v1"/>
                        </div>
                        <div className="zl-icon">
                            <img width="30" height="30" src="https://img.icons8.com/ios-filled/50/FFFFFF/zalo.png"
                                 alt="zalo"/>
                        </div>
                        <div className="ms-icon">
                            <img width="30" height="30"
                                 src="https://img.icons8.com/ios-filled/50/FFFFFF/facebook-messenger.png"
                                 alt="facebook-messenger"/>
                        </div>
                    </div>
                </div>
                <div className="footer-container-middle">
                    <div className="footer-content">
                        <h4>FPT Health</h4>
                        <p>FPT Health Hospital is committed to providing you and your family with the highest quality
                            medical services, featuring a team of professional doctors and state-of-the-art facilities.
                            Your health is our responsibility.</p>
                    </div>
                    <div className="footer-hours-content">
                        <h4>Opening Hours</h4>
                        <div className="footer-hours">
                            <div className="footer-content-item"><span>Monday - Friday:</span>
                                <span>7:00 AM - 8:00 PM</span></div>
                            <div className="footer-content-item"><span>Saturday:</span> <span>7:00 AM - 6:00 PM</span>
                            </div>
                            <div className="footer-content-item"><span>Sunday:</span> <span>7:30 AM - 6:00 PM</span>
                            </div>
                        </div>
                    </div>
                    <div className="footer-content">
                        <h4>Contact</h4>
                        <div className="footer-contact">
                            <div className="footer-contact-item">
                                <div>
                                    <img width="20" height="20"
                                         src="https://img.icons8.com/ios-filled/50/FFFFFF/marker.png" alt="marker"/>
                                </div>
                                <p>8 Ton That Thuyet, My Dinh Ward, Nam Tu Liem District, Ha Noi</p>
                            </div>
                            <div className="footer-contact-item">
                                <div>
                                    <img width="20" height="20"
                                         src="https://img.icons8.com/ios-filled/50/FFFFFF/phone.png" alt="phone"/>
                                </div>
                                <p>+84 987 654 321</p>
                            </div>
                            <div className="footer-contact-item">
                                <div>
                                    <img width="20" height="20"
                                         src="https://img.icons8.com/ios-filled/50/FFFFFF/new-post.png" alt="new-post"/>
                                </div>
                                <p>fpthealth@gmail.com</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="footer-container-bottom">
                    <div>© 2024 FPT Health. All rights reserved.</div>
                    <div><a>Terms of use</a> | <a>Privacy Policy</a></div>
                </div>
            </footer>
        </main>
    );
}

export default Diagnosis;
