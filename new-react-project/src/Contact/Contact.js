import React, { useState } from 'react';
import axios from 'axios';
import '../Contact/Contact.css';
import $ from "jquery";

const Contact = () => {
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [subject, setSubject] = useState('');
    const [message, setMessage] = useState('');
    const [responseMessage, setResponseMessage] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();

        const feedbackData = {
            name,
            phone,
            email,
            subject,
            message,
        };

        axios.post('http://localhost:8080/api/v1/feedback/submit', feedbackData)
            .then(response => {
                setResponseMessage(response.data);
                setName('');
                setPhone('');
                setEmail('');
                setSubject('');
                setMessage('');
                $(".main-mess .message-text").text(responseMessage);
                $(".main-mess").addClass("active");
                var progressBar = $(".main-mess .timeout-bar");
                progressBar.addClass("active");
                setTimeout(function() {
                    $(".main-mess").removeClass("active");
                    progressBar.removeClass("active");
                }, 2000);
            })
            .catch(error => {
                setResponseMessage('There was an error submitting the feedback!');
                console.error('There was an error submitting the feedback!', error);
                $(".main-mess .message-text").text(responseMessage);
                $(".main-mess").addClass("active");
                var progressBar = $(".main-mess .timeout-bar");
                progressBar.addClass("active");
                setTimeout(function() {
                    $(".main-mess").removeClass("active");
                    progressBar.removeClass("active");
                }, 2000);
            });
    };

    $(document).ready(function (){
        $(".links li a").removeClass("active");
        $(".links li:nth-child(6) a").addClass("active");
        var sections = $('.full-screen-section');
        var currentSectionIndex = 0;
        var totalSections = sections.length;
        var isOnScroll = false;

        function scrollToSection(index) {
            if (isOnScroll) return;
            isOnScroll = true;

            sections.each(function(idx) {
                if (idx === index) {
                    $(this).css({
                        'top': 0 + '%',
                    });
                } else {
                    $(this).css({
                        'top': (idx < index ? -100 : 0) + '%',
                    });
                }
            });

            setTimeout(function() {
                currentSectionIndex = index;
                isOnScroll = false;
            }, 1000);
        }

        $(document).on('wheel', function(event) {
            event.preventDefault();
            if (isOnScroll) return;
            if (event.originalEvent.deltaY > 0) {
                if (currentSectionIndex < totalSections - 1) {
                    currentSectionIndex++;
                }
            } else {
                if (currentSectionIndex > 0) {
                    currentSectionIndex--;
                }
            }
            scrollToSection(currentSectionIndex);
        });
    });

    return (
        <div className="full-screen-container">
            <div className="full-screen-section" style={{top: 0 + '%', zIndex: 2}}>
            <section className="contact">
                <div className="contact-form">
                    <h3>Contact Us</h3>
                    <p>Please fill out the form below and send your comments and questions to FPTHealth. We will respond
                        to your email as soon as possible.</p>
                    <form onSubmit={handleSubmit}>
                        <input
                            placeholder="Your Name*"
                            required
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                        <input
                            placeholder="Sdt*"
                            required
                            type="text"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                        />
                        <input
                            placeholder="E-mail*"
                            required
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <input
                            placeholder="Write a Subject*"
                            required
                            type="text"
                            value={subject}
                            onChange={(e) => setSubject(e.target.value)}
                        />
                        <textarea
                            cols="30"
                            placeholder="Your Message*"
                            required
                            rows="10"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                        />
                        <input
                            className="btn"
                            type="submit"
                            value="Submit"
                        />
                    </form>
                </div>
                <div className="contact-map">
                    <iframe
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3724.102990388698!2d105.78090194668097!3d21.028564715860558!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3135ab00954decbf%3A0xdb4ee23b49ad50c8!2zRlBUIEFwdGVjaCBIw6AgTuG7mWkgLSBI4buHIHRo4buRbmcgxJHDoG8gdOG6oW8gbOG6rXAgdHLDrG5oIHZpw6puIHF14buRYyB04bq_!5e0!3m2!1svi!2s!4v1719625836130!5m2!1svi!2s"
                        width="554"
                        height="465"
                        style={{border: 0}}
                        allowFullScreen=""
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                    ></iframe>
                </div>
            </section>
            </div>
            <div className="full-screen-section" style={{top: 0 + '%', zIndex: 1}}>
                <footer className="footer">
                    <div className="footer-container">
                        <div className="footer-row">
                            <div className="footer-col">
                                <h3> FPT Health International Hospital Hanoi City </h3>
                                <ul>
                                    <li><img width={20} height={20}
                                             src="https://img.icons8.com/ios-filled/50/004B91/visit.png"
                                             alt="visit"/>
                                        109 Truong Chinh Street, Phuong Liet Ward, Thanh Xuan
                                        District, Hanoi City
                                    </li>
                                    <li><img width={20} height={20}
                                             src="https://img.icons8.com/ios-glyphs/30/004B91/phone--v1.png"
                                             alt="phone--v1"/> 012 3456 789
                                    </li>
                                    <li><img width={20} height={20}
                                             src="https://img.icons8.com/ios-filled/50/004B91/mail.png"
                                             alt="mail"/> FptHealth@gmail.com
                                    </li>
                                </ul>
                            </div>
                            <div className="footer-col">
                                <h3> FPT Health International Hospital Hanoi Branch </h3>
                                <ul>
                                    <li><img width={20} height={20}
                                             src="https://img.icons8.com/ios-filled/50/004B91/visit.png"
                                             alt="visit"/> 8A
                                        Ton
                                        That Thuyet, My Dinh Ward, Nam Tu Liem District
                                    </li>
                                    <li><img width={20} height={20}
                                             src="https://img.icons8.com/ios-glyphs/30/004B91/phone--v1.png"
                                             alt="phone--v1"/> 029 2376 6270
                                    </li>
                                    <li><img width={20} height={20}
                                             src="https://img.icons8.com/ios-filled/50/004B91/mail.png"
                                             alt="mail"/> FptHealth@gmail.com
                                    </li>
                                </ul>
                            </div>
                            <div className="footer-col">
                                <h3>FPT Health International Hospital Ho Chi Minh City</h3>
                                <ul>
                                    <li><img width={20} height={20}
                                             src="https://img.icons8.com/ios-filled/50/004B91/visit.png" alt="visit"/>181
                                        Nguyen Dinh Chieu Street, Vo Thi Sau Ward, District 3, Ho
                                        Chi Minh City
                                    </li>
                                    <li><img width={20} height={20}
                                             src="https://img.icons8.com/ios-glyphs/30/004B91/phone--v1.png"
                                             alt="phone--v1"/> 012 3456 789
                                    </li>
                                    <li><img width={20} height={20}
                                             src="https://img.icons8.com/ios-filled/50/004B91/mail.png"
                                             alt="mail"/> FptHealth@gmail.com
                                    </li>
                                </ul>
                            </div>
                            <div className="footer-col"><h3>FPT Health International Hospital Ho
                                Chi Minh City Branch</h3>
                                <ul>
                                    <li><img width={20} height={20}
                                             src="https://img.icons8.com/ios-filled/50/004B91/visit.png"
                                             alt="visit"/> 391A
                                        Nam Ky Khoi Nghia, Vo Thi Sau Ward, District 3
                                    </li>
                                    <li><img width={20} height={20}
                                             src="https://img.icons8.com/ios-glyphs/30/004B91/phone--v1.png"
                                             alt="phone--v1"/> 012 3456 789
                                    </li>
                                    <li><img width={20} height={20}
                                             src="https://img.icons8.com/?size=100&id=53435&format=png&color=004B91"
                                             alt=""/> FptHealth@gmail.com
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <div className="footer-bottom">
                            <div className="footer-social">
                                <ul>
                                    <li><a href="https://www.facebook.com"><img width="50" height="50"
                                                                                src="https://img.icons8.com/fluency/48/facebook-new.png"
                                                                                alt="facebook-new"/></a></li>
                                    <li><a href="https://zalo.me"><img width="50" height="50"
                                                                       src="https://img.icons8.com/color/48/zalo.png"
                                                                       alt="zalo"/></a></li>
                                    <li><a href=""><img width="50" height="50"
                                                        src="https://img.icons8.com/fluency/48/facebook-messenger--v2.png"
                                                        alt="facebook-messenger--v2"/></a>
                                    </li>
                                </ul>
                            </div>
                            <div className="footer-copyright">
                                <p>© 2024 FPT Health. All rights reserved.</p>
                                <p><a href="#">Terms of use</a> | <a href="#">Privacy Policy</a></p>
                            </div>
                        </div>
                    </div>
                </footer>
            </div>
        </div>
    );
};

export default Contact;
