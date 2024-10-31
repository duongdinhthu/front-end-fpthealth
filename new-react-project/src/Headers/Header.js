import React, { useState, useEffect } from 'react';
import '../Headers/Header.css';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import News from "../News/News";
import logo from "../img/fpt-health-high-resolution-logo-transparent.png";
import fbLogo from "../img/icons8-facebook-48.png";
import ggLogo from "../img/icons8-google-48.png";
import $ from 'jquery';
import Home from "../Home/Home";
import Partner from "../Partners/Partners";
import Recruitment from "../Recruitment/Recruitment";
import Contact from "../Contact/Contact";
import Services from "../Services/Services";
import PatientDashboard from "../backend-client/Patients/PatientDashboard";  // Ensure the correct path
import axios from 'axios';
import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
import FacebookLogin from 'react-facebook-login-lite';
import {jwtDecode} from 'jwt-decode'; // Note: Import jwtDecode correctly
import Modal from "../backend-client/chatbox/Modal";
import AboutUs from "../AboutUs/AboutUs";
import aiImg from '../img/icons8-ai-64.png';
import RecordDetails from "../backend-client/Patients/RecordDetails";
import DiagnoseComponent from "../AI/DiagnoseComponent";
import Diagnosis from "../Diagnosis/Diagnosis";

const Header = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 1080);
    const [isLogin, setIsLogin] = useState(false);
    const [isLoginForm, setIsLoginForm] = useState(true);
    const [isForgotPass, setIsForgotPass] = useState(false);
    const [username, setUsername] = useState('');
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [error, setError] = useState('');
    const [cooldown, setCooldown] = useState(0);
    const [isDone, setIsDone] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isAIOpen, setIsAIOpen] = useState(false);
    const [patientId, setPatientId] = useState(null);

    useEffect(() => {
        const storedUsername = sessionStorage.getItem('username');
        const storedPatientId = sessionStorage.getItem('patient_id');
        console.log('Stored Username:', storedUsername);
        if (storedUsername) {
            setUsername(storedUsername);
            setPatientId(storedPatientId);
            setIsLoggedIn(true);
        }
    }, []);
    const loginMenu = () => {
        setIsLogin(!isLogin);
    };

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    const toggleFormMode = () => {
        setIsLoginForm(!isLoginForm);
    };

    const setDefaultMode = () => {
        setIsLoginForm(true);
        setIsForgotPass(false);
    };

    const isDoneResetPass = () => {
        setIsDone(true);
    };

    const handleStartChat = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    const closeAI = () => {
        setIsAIOpen(false);
    };

    const handleStartAI = () => {
        setIsAIOpen(true);
    };


    const handleResize = () => {
        setIsMobile(window.innerWidth <= 1080);
        if (window.innerWidth > 1080) {
            setIsOpen(false);
        }
    };

    $(document).ready(function () {
        var loginMessage = sessionStorage.getItem('loginMessage');
        if (loginMessage) {
            $(".main-mess .message-text").text(loginMessage);
            $(".main-mess").addClass("active");
            var timeoutDuration = 2000;
            var progressBar = $(".main-mess .timeout-bar");
            progressBar.addClass("active");

            setTimeout(function() {
                $(".main-mess").removeClass("active");
                progressBar.removeClass("active");
                sessionStorage.removeItem('loginMessage');
            }, timeoutDuration);
        }

        $(".social-btn.gg").on("click", function (){
            $(".gg-btn div").click();
        });

        $(".links li:not(:last-child) a").on("click", function (){
            $(".links li:not(:last-child) a").removeClass("active");
            $(this).addClass("active");
        });

        $(".logo a").on("click", function (){
            if (!$(".links li:first-child a").hasClass("active")){
                $(".links li:not(:last-child) a").removeClass("active");
                $(".links li:first-child a").addClass("active");
            }
        });

        $(".social-btn.fb").on("click", function (){
            $(".fb-btn #fb-login").click();
        });

        $("#dropdown_menu li a").on("click", function () {
            setIsOpen(!isOpen);
        });

        $("input:not(.patient)").each(function (i, ele) {
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

        $(".disabled input").val("");
        $(".close input").val("");
        $(".disabled input").removeClass("not-valid");
        $(".disabled").find(".error-message").remove();

        var alertMess = "";

        function isValidEmail(email) {
            var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            alertMess = "Invalid email address";
            return emailRegex.test(email);
        }

        function isValidName(name) {
            var nameRegex = /^[A-Za-z\s]+$/;
            alertMess = "Invalid name";
            return nameRegex.test(name);
        }

        function isValidPassword(password) {
            if (password.length < 8) {
                alertMess = "Password must have at least 8 characters";
                return false;
            }

            var lowerCaseRegex = /[a-z]/;
            if (!lowerCaseRegex.test(password)) {
                alertMess = "Password must have at least 1 lowercase character";
                return false;
            }

            var upperCaseRegex = /[A-Z]/;
            if (!upperCaseRegex.test(password)) {
                alertMess = "Password must have at least 1 uppercase character";
                return false;
            }

            var digitRegex = /[0-9]/;
            if (!digitRegex.test(password)) {
                alertMess = "Password must have at least 1 number";
                return false;
            }

            var specialCharRegex = /[!@#$%^&*()_+]/;
            if (!specialCharRegex.test(password)) {
                alertMess = "Password must have at least 1 special character";
                return false;
            }

            return true;
        }

        $('input[type="password"]:not(.patient,.chatbot-input)').each(function (i, ele){
            $(ele).blur(function() {
                    var password = $(this).val();
                    if (!isValidPassword(password)) {
                        $(this).next('.error-message').remove();
                        if($(this).hasClass("has-value")){
                            $(this).addClass("not-valid")
                            $(this).after('<span class="error-message">'+ alertMess +'</span>');
                        } else {
                            $(this).next('.error-message').remove();
                            $(this).removeClass("not-valid");
                        }
                    } else {
                        $(this).next('.error-message').remove();
                        $(this).removeClass("not-valid");
                    }
            });
        });

        $('input[type="email"]:not(.patient,.chatbot-input)').each(function (i, ele){
            $(ele).blur(function() {
                var email = $(this).val();
                if (!isValidEmail(email)) {
                    $(this).next('.error-message').remove();
                    if($(this).hasClass("has-value")){
                        $(this).addClass("not-valid")
                        $(this).after('<span class="error-message">'+ alertMess +'</span>');
                    } else {
                        $(this).next('.error-message').remove();
                        $(this).removeClass("not-valid");
                    }
                } else {
                    $(this).next('.error-message').remove();
                    $(this).removeClass("not-valid");
                }
            });
        });

        $('input[type="text"]:not(.patient,.chatbot-input)').each(function (i, ele){
            $(ele).blur(function() {
                var name = $(this).val();
                if (!isValidName(name)) {
                    $(this).next('.error-message').remove();
                    if($(this).hasClass("has-value")){
                        $(this).addClass("not-valid")
                        $(this).after('<span class="error-message">'+ alertMess +'</span>');
                    } else {
                        $(this).next('.error-message').remove();
                        $(this).removeClass("not-valid");
                    }
                } else {
                    $(this).next('.error-message').remove();
                    $(this).removeClass("not-valid");
                }
            });
        });

        $("form.active").on("submit", function (){
            if ($(this).find(".not-valid").length > 0){
                return false;
            }

            var inputValue = $("#passwordPatient").val();
            var confirmInputValue = $("#re-passwordPatient").val();
            if (inputValue !== confirmInputValue){
                $("#re-passwordPatient").next('.error-message').remove();
                $("#re-passwordPatient").addClass("not-valid")
                $("#re-passwordPatient").after('<span class="error-message">Passwords do not match</span>');
                return false;
            } else {
                $("#re-passwordPatient").next('.error-message').remove();
                $("#re-passwordPatient").removeClass("not-valid");
            }
        });

        var canClick = true;
        $("#submit").each(function (i, ele){
            $(ele).on("click",function (){
                if (canClick) {
                    canClick = false;
                    setTimeout(function() {
                        canClick = true;
                    }, 2000);
                } else {
                    console.log('Please wait before clicking again')
                }
            });
        });

        $(".login-form-right").each(function (i, ele){
            $(ele).on("click",function (){
                if (canClick) {
                    canClick = false;
                    setTimeout(function() {
                        canClick = true;
                    }, 2000);
                } else {
                    console.log('Please wait before clicking again')
                }
            });
        });

        $(".contact-div").hover(
            function () {
                $(this).addClass("active");
                $(".contact-item").css("pointer-events", "all");
            },
            function () {
                $(this).removeClass("active");
                $(".contact-item").css("pointer-events", "none");
            }
        );

        $(".contact-item a").on("click", function(e) {
            if (!$(".contact-div").hasClass("active")) {
                e.preventDefault();
            }
        });
    });

    const generateRandomCode = () => {
        const length = 6;
        const charset = "0123456789";
        let code = "";
        for (let i = 0; i < length; i++) {
            const randomIndex = Math.floor(Math.random() * charset.length);
            code += charset[randomIndex];
        }
        return code;
    };

    const handleGetCode = async () => {
        const email = document.getElementById("forgot-email").value;
        const code = generateRandomCode();
        setIsLoading(true);

        try {
            await axios.put('http://localhost:8080/api/v1/forgotpass/forgot', {
                patient_email: email,
                patient_code: code
            });
            setCooldown(60);
        } catch (error) {
            $(document).ready(function () {
                $(".alert-mess").remove();
                $(".forgot-pass-container").append('<span class="alert-mess">Invalid email address, please try again.</span>')
                setTimeout(function () {
                    $(".alert-mess").remove();
                }, 2000);
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handlePasswordReset = async (event) => {
        event.preventDefault();
        const email = document.getElementById("forgot-email").value;
        const code = document.getElementById("forgot-email-code").value;
        const newPassword = document.getElementById("forgot-pass-new").value;
        const confirmNewPassword = document.getElementById("forgot-pass-new-confirm").value;

        if (newPassword !== confirmNewPassword) {
            $(document).ready(function () {
                $(".alert-mess").remove();
                $(".forgot-pass-container").append('<span class="alert-mess">Passwords do not match.</span>')
                setTimeout(function () {
                    $(".alert-mess").remove();
                }, 2000);
            });
            return;
        }

        try {
            await axios.put('http://localhost:8080/api/v1/forgotpass/reset', {
                patient_email: email,
                patient_code: code,
                new_password: newPassword
            });
            setIsForgotPass(false);
            isDoneResetPass();
        } catch (error) {
            $(document).ready(function () {
                $(".alert-mess").remove();
                $(".forgot-pass-container").append('<span class="alert-mess">Invalid code, please try again.</span>')
                setTimeout(function () {
                    $(".alert-mess").remove();
                }, 2000);
            });
        }
    };

    const handleLogin = async (event) => {
        event.preventDefault();
        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;

        try {
            const response = await axios.post('http://localhost:8080/api/v1/patients/login', {
                patient_email: email,
                patient_password: password
            });
            console.log('Login response:', response.data); // Kiểm tra phản hồi đăng nhập
            setUsername(response.data.username);
            setPatientId(response.data.patient_id);
            setIsLogin(false); // Close the login form after successful login
            sessionStorage.setItem('username', response.data.username);
            sessionStorage.setItem('patient_id', response.data.patient_id);
            setIsLoggedIn(true);
            sessionStorage.setItem('loginMessage', 'Sign in successfully');
        } catch (error) {
            $(document).ready(function (){
                $(".form-container").append('<span class="success-mess">Incorrect email or password. Please try again</span>');
                setTimeout(function () {
                    $(".success-mess").remove();
                }, 2000);
            });
            console.error('Error logging in:', error);
        }
    };

    const generateRandomPassword = () => {
        return Math.random().toString(36).slice(-8);
    };

    const handleSuccessGoogle = async (credentialResponse) => {
        try {
            const { name, email } = jwtDecode(credentialResponse.credential);
            const randomPassword = generateRandomPassword();
            const response = await axios.post('http://localhost:8080/api/v1/patients/google-login', {
                patient_name: name,
                patient_email: email,
                patient_password: randomPassword
            });
            console.log(response.data); // Kiểm tra dữ liệu trả về từ API

            const { patient_username, patient_id } = response.data; // Đổi từ 'username' sang 'patient_username'
            if (patient_username && patient_id) {
                setPatientId(patient_id);
                sessionStorage.setItem('patient_username', patient_username); // Lưu 'patient_username' thay vì 'username'
                sessionStorage.setItem('patient_id', patient_id);
                setUsername(patient_username); // Đặt 'patient_username'
                sessionStorage.setItem('loginMessage', 'Sign in successfully');
                setIsLoggedIn(true);
                setIsLogin(false); // Close the login form
            } else {
                setError('Google login failed.');
            }
        } catch (error) {
            console.error('Error during Google login!', error);
            setError('Error during Google login.');

            $(document).ready(function (){
                $(".main-mess .message-text").text("Login failed");
                $(".main-mess").addClass("active");
                var timeoutDuration = 2000;
                var progressBar = $(".main-mess .timeout-bar");
                progressBar.addClass("active");
                setTimeout(function() {
                    $(".main-mess").removeClass("active");
                    progressBar.removeClass("active");
                }, timeoutDuration);
            });
        }
    };

    const handleSuccessFacebook = async (response) => {
        try {
            const fbToken = response.authResponse.accessToken;
            const fbUserId = response.authResponse.userID;

            // Get user details from Facebook API
            const userDetailsResponse = await axios.get(`https://graph.facebook.com/me?fields=name,email&access_token=${fbToken}`);

            const { name, email } = userDetailsResponse.data;

            const serverResponse = await axios.post('http://localhost:8080/api/v1/patients/facebook-login', {
                accessToken: fbToken,
                userID: fbUserId,
                name: name,
                email: email
            });

            const { username, patient_id } = serverResponse.data; // Trích xuất patient_id từ phản hồi
            if (username && patient_id) { // Kiểm tra sự tồn tại của username và patient_id
                setIsLoggedIn(true);
                setPatientId(patient_id);
                sessionStorage.setItem('username', username);
                sessionStorage.setItem('patient_id', patient_id);
                setUsername(username);
                setIsLogin(false);
                alert('Facebook login successful!');
            } else {
                setError('Facebook login failed.');
            }
        } catch (error) {
            console.error('Error during Facebook login!', error);
            setError('Error during Facebook login.');
        }
    };

    const handleFailureGoogle = () => {
        console.error('Google Login Failed');
        setError('Google Login Failed');
    };

    const handleRegister = async (event) => {
        event.preventDefault();
        const name = document.getElementById("namePatient").value;
        const email = document.getElementById("emailPatient").value;
        const password = document.getElementById("passwordPatient").value;

        try {
            const response = await axios.post('http://localhost:8080/api/v1/patients/register', {
                patient_name: name,
                patient_email: email,
                patient_password: password,
                patient_username: email
            });
            $(document).ready(function (){
                $(".main-mess .message-text").text("Registration successfully");
                $(".main-mess").addClass("active");
                var timeoutDuration = 2000;
                var progressBar = $(".main-mess .timeout-bar");
                progressBar.addClass("active");
                setTimeout(function() {
                    $(".main-mess").removeClass("active");
                    progressBar.removeClass("active");
                }, timeoutDuration);
            });
                setIsLoginForm(true);
        } catch (error) {
            console.error('Error during registration:', error);
            $(document).ready(function (){
                $(".main-mess .message-text").text("Registration failed");
                $(".main-mess").addClass("active");
                var timeoutDuration = 2000;
                var progressBar = $(".main-mess .timeout-bar");
                progressBar.addClass("active");
                setTimeout(function() {
                    $(".main-mess").removeClass("active");
                    progressBar.removeClass("active");
                }, timeoutDuration);
            });
        }
    };


    const handleFailureFacebook = () => {
        console.error('Facebook Login Failed');
        setError('Facebook Login Failed');
    };

    const handleLogout = () => {
        sessionStorage.removeItem('username');
        sessionStorage.removeItem('patient_id');
        sessionStorage.setItem('loginMessage', 'Sign out successfully');
        window.location.href = '/';
        setUsername('');
        setPatientId(null);
        setIsLoggedIn(false);
    };

    useEffect(() => {
        const timer = setInterval(() => {
            if (cooldown > 0) {
                setCooldown(cooldown - 1);
            }
        }, 1000);

        return () => clearInterval(timer);
    }, [cooldown]);

    useEffect(() => {
        if (isDone) {
            $(document).ready(function (){
                $(".main-mess .message-text").text("Password has been reset successfully");
                $(".main-mess").addClass("active");
                var timeoutDuration = 2000;
                var progressBar = $(".main-mess .timeout-bar");
                progressBar.addClass("active");
                setTimeout(function() {
                    $(".main-mess").removeClass("active");
                    progressBar.removeClass("active");
                }, timeoutDuration);
            });
        }
    }, [isDone]);

    useEffect(() => {
        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);


    console.log('Render - isLoggedIn:', isLoggedIn, 'username:', username); // Kiểm tra trạng thái và username khi render

    return (
        <Router>
            <div className="main-mess">
                <span className="message-text"></span>
                <div className="timeout-bar"></div>
            </div>
            <div className="contact-div">
                <div className="btn-more">
                    <img width="25" height="25"
                         src="https://img.icons8.com/external-febrian-hidayat-basic-outline-febrian-hidayat/24/external-ui-ui-essential-febrian-hidayat-basic-outline-febrian-hidayat-2.png"
                         alt="external-ui-ui-essential-febrian-hidayat-basic-outline-febrian-hidayat-2"/>
                </div>
                <div className="contact-item fb">
                    <a href="https://www.facebook.com/duongthu087/" target="_blank" rel="noopener noreferrer">
                        <img width="30" height="30" src="https://img.icons8.com/fluency/48/facebook-new.png"
                             alt="facebook-new"/>
                    </a>
                </div>
                <div className="contact-item zalo">
                    <a href="https://zalo.me/0981300594" target="_blank" rel="noopener noreferrer">
                        <img width="30" height="30" src="https://img.icons8.com/color/48/zalo.png" alt="zalo"/>
                    </a>
                </div>
                <div className="contact-item mess">
                    <a href="https://www.messenger.com/t/duongthu087" target="_blank" rel="noopener noreferrer">
                        <img width="30" height="30" src="https://img.icons8.com/fluency/48/facebook-messenger--v2.png"
                             alt="facebook-messenger--v2"/>
                    </a>
                </div>
            </div>

            <div className="chatbox">
                <Modal openModal={isModalOpen} closeModal={closeModal}/>
                {!isModalOpen && (
                    <div className="start-chat" onClick={handleStartChat}>
                        <img width="30" height="30"
                             src={aiImg}
                             alt="aiImg"/>
                    </div>
                )}
            </div>
            <div className="AI">
                {!isAIOpen ? (
                    <div className="start-AI" onClick={handleStartAI}>
                        <img width="35" height="35"
                             src="https://img.icons8.com/external-others-anggara-putra/35/external-online-online-healthcare-others-anggara-putra-155.png"
                             alt="external-online-online-healthcare-others-anggara-putra-155"/>
                    </div>
                ) : (
                    <div className="AI-container">
                        <div className="AI-header">
                            <h4>Disease Diagnosis</h4>
                            <button className="close-ai" onClick={closeAI}>Close</button>
                        </div>
                        <DiagnoseComponent/>
                    </div>
                )}
            </div>
            <div id="main-container">
                <section>
                    <div className="container-header">
                        <header>
                            <div className="navbar">
                                <div className="logo">
                                    <Link to="/">
                                        <img
                                            src={logo}
                                            style={{width: '130px', height: '50px'}}
                                            alt="logo"
                                        />
                                    </Link>
                                </div>
                                <ul className="links">
                                    <li><Link to="/">Home</Link></li>
                                    <li><Link to="/about">About Us</Link></li>
                                    <li><Link to="/partners">Partners</Link></li>
                                    <li><Link to="/news">News</Link></li>
                                    <li><Link to="/recruitment">Recruitment</Link></li>
                                    <li><Link to="/contact">Contact</Link></li>
                                    <li><Link className="booking-btn" to="/services">Booking</Link></li>
                                    {isLoggedIn ? (
                                        <>
                                            <li className="username">
                                                Hello, {username}
                                                <div className="user-menu">
                                                    <Link className="user" to="/dashboard">Dashboard</Link>
                                                    <a className="user" onClick={handleLogout}>Sign out</a>
                                                </div>
                                            </li>
                                        </>
                                    ) : (
                                        <li id="login-btn" onClick={loginMenu}>
                                            Sign in
                                        </li>
                                    )}
                                </ul>
                                {isMobile && (
                                    <div className="toggle-btn" onClick={toggleMenu}>
                                        <div className={isOpen ? 'line line-1 open' : 'line line-1'}></div>
                                        <div className={isOpen ? 'line line-2 open' : 'line line-2'}></div>
                                        <div className={isOpen ? 'line line-3 open' : 'line line-3'}></div>
                                    </div>
                                )}
                            </div>
                            {isMobile && (
                                <div id="dropdown_menu" className={`dropdown_menu ${isOpen ? 'open' : ''}`}>
                                    <li><Link to="/">Home</Link></li>
                                    <li><Link to="/about">About Us</Link></li>
                                    <li><Link to="/partners">Partners</Link></li>
                                    <li><Link to="/news">News</Link></li>
                                    <li><Link to="/recruitment">Recruitment</Link></li>
                                    <li><Link to="/contact">Contact</Link></li>
                                    <li><Link to="/services">Booking</Link></li>
                                    {isLoggedIn ? (
                                        <>
                                            <li className="username-dropdown">
                                                Hello, {username}
                                                <Link className="user" to="/dashboard">Dashboard</Link>
                                                <Link className="user" to="/diagnosis">Diagnosis</Link>
                                                <a className="user" onClick={handleLogout}>Log out</a>
                                            </li>
                                        </>
                                    ) : (
                                        <div id="login-btn-dropdown" onClick={loginMenu}>
                                            <a>Sign in</a>
                                        </div>
                                    )}
                                </div>
                            )}
                        </header>
                    </div>
                    <div className={`login-container ${isLogin ? 'open' : 'close'}`}>
                        <div className={`form-container`}>
                            <a className="close-btn" onClick={() => {
                                loginMenu();
                                setDefaultMode();
                            }}><img width="24" height="24"
                                    src="https://img.icons8.com/material-outlined/24/000000/delete-sign.png"
                                    alt="delete-sign"/></a>
                            <div className="login-form">
                                <form className={`login-form-left ${isLoginForm ? "active" : "disabled"}`}
                                      onSubmit={handleLogin}>
                                    <div className="header-text">
                                        <h3>Sign in to FPT Health</h3>
                                    </div>
                                    <div className="social-login">
                                        <div className="social-btn gg">
                                            <span>Google</span>
                                            <a><img width="25" height="25"
                                                    src={ggLogo}
                                                    alt="google-logo"/></a>
                                        </div>
                                        <div className="gg-btn">
                                            <GoogleOAuthProvider
                                                clientId="1055399748338-10q97di87q0q9o5vqctm6obt55khqk6q.apps.googleusercontent.com">
                                                <GoogleLogin
                                                    onSuccess={handleSuccessGoogle}
                                                    onError={handleFailureGoogle}
                                                />
                                            </GoogleOAuthProvider>
                                        </div>
                                        <div className="social-btn fb">
                                            <span>Facebook</span>
                                            <a><img width="40" height="40"
                                                    src={fbLogo}
                                                    alt="facebook"/></a>
                                        </div>
                                        <div className="fb-btn">
                                            <FacebookLogin
                                                appId="358159890313550"
                                                onSuccess={handleSuccessFacebook}
                                                onFailure={handleFailureFacebook}
                                            />
                                        </div>
                                    </div>
                                    <p className="or">OR</p>
                                    <div className="input-list">
                                        <div className="input-div">
                                            <input type="email" id="email" name="email" required/>
                                            <label htmlFor="email" className="emailLabel">Email Address</label>
                                        </div>
                                        <div className="input-div">
                                            <input type="password" id="password" name="password" required/>
                                            <label htmlFor="password" className="passLabel">Password</label>
                                        </div>
                                        <div className="forgot-pass">
                                            <a onClick={() => setIsForgotPass(true)}>Forgot your password?</a>
                                        </div>
                                        <input type="submit" id="submit" value="Sign in"/>
                                    </div>
                                </form>
                                <form className={`login-form-right ${isLoginForm ? "right" : "left"}`}>
                                    <a onClick={toggleFormMode}>{isLoginForm ? "Sign up" : "Sign in"}</a>
                                    <h3>{isLoginForm ? "Don't have an account?" : "Already have an account?"}</h3>
                                </form>
                                <form className={`register-form ${isLoginForm ? "disabled" : "active"}`}
                                      onSubmit={handleRegister}>
                                    <div className="header-text">
                                        <h3>Create Account</h3>
                                    </div>
                                    <div className="input-list-register">
                                        <div className="input-div">
                                            <input type="text" id="namePatient" name="namePatient" required/>
                                            <label htmlFor="namePatient" className="nameLabel">Full Name</label>
                                        </div>
                                        <div className="input-div">
                                            <input type="email" id="emailPatient" name="emailPatient" required/>
                                            <label htmlFor="emailPatient" className="emailLabel">Email Address</label>
                                        </div>
                                        <div className="input-div">
                                            <input type="password" id="passwordPatient" name="passwordPatient"
                                                   required/>
                                            <label htmlFor="passwordPatient" className="passLabel">Password</label>
                                        </div>
                                        <div className="input-div">
                                            <input type="password" id="re-passwordPatient" name="re-passwordPatient"
                                                   required/>
                                            <label htmlFor="re-passwordPatient" className="re-passLabel">Confirm
                                                Password</label>
                                        </div>
                                        <div className="accept-btn">
                                            <input type="checkbox" className="acceptChk" required/>
                                            <span>I have read and agree to the <a>Terms of Service</a> and <a>Privacy Policy</a></span>
                                        </div>
                                        <input type="submit" id="submit" value="Sign up"/>
                                    </div>
                                </form>


                                <form className={`forgot-pass-form ${isForgotPass ? "active" : "disabled"}`}
                                      onSubmit={handlePasswordReset}>
                                    <div className={`forgot-pass-container`}>
                                        <div className="back-btn" onClick={() => setIsForgotPass(false)}>
                                            <img width="40" height="40" src="https://img.icons8.com/ios/50/left--v1.png"
                                                 alt="left--v1"/>
                                        </div>
                                        <div className="forgot-pass-header"><h3>Forgot Your Password?</h3></div>
                                        <div className="input-list">
                                            <div className="input-div">
                                                <input type="email" id="forgot-email" name="forgot-email" required/>
                                                <label htmlFor="forgot-email"
                                                       className="forgot-emailLabel">Email</label>
                                                <button type="button" className="get-code" onClick={handleGetCode}
                                                        disabled={cooldown > 0 || isLoading}>
                                                    {isLoading ? (<div
                                                        className="spinner"></div>) : (cooldown > 0 ? `Sent (${cooldown})` : 'Send')}
                                                </button>
                                            </div>
                                            <div className="input-div">
                                                <input type="number" id="forgot-email-code" name="forgot-email-code"
                                                       required/>
                                                <label htmlFor="forgot-email-code"
                                                       className="forgot-email-codeLabel">Code</label>
                                            </div>
                                            <div className="input-div">
                                                <input type="password" id="forgot-pass-new" name="forgot-pass-new"
                                                       required/>
                                                <label htmlFor="forgot-pass-new" className="forgot-pass-new">New
                                                    Password</label>
                                            </div>
                                            <div className="input-div">
                                                <input type="password" id="forgot-pass-new-confirm"
                                                       name="forgot-pass-new-confirm" required/>
                                                <label htmlFor="forgot-pass-new-confirm"
                                                       className="forgot-pass-new-confirmLabel">Confirm New
                                                    Password</label>
                                            </div>
                                            <input type="submit" id="submit" value="Submit"/>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                        <div className="login-overlay"></div>
                    </div>
                </section>
            </div>

            <Routes>
                <Route path="/" element={<Home/>}/>
                <Route path="/about" element={<AboutUs/>}/>
                <Route path="/partners" element={<Partner/>}/>
                <Route path="/news" element={<News/>}/>
                <Route path="/contact" element={<Contact/>}/>
                <Route path="/recruitment" element={<Recruitment/>}/>
                <Route path="/services" element={<Services/>}/>
                <Route path="/dashboard" element={<PatientDashboard patientId={patientId}/>}/>
                <Route path="/record-details" element={<RecordDetails/>}/>
                <Route path="/diagnosis" element={<Diagnosis/>}/>
            </Routes>
        </Router>
    );
}

export default Header;
