import React from 'react';
import './AboutUs.css';
import tamnhinsumenh from '../img/tamnhinsumenh.png';
import tamnhinicon from '../img/tamnhinicon.png';
import sumenhicon from '../img/sumenhicon.png';
import giatricotloi from '../img/giatricotloi.png';
import sodobenhvien from '../img/sodobenhvien.png';
import anhdayne from '../img/dayne.png';
import $ from "jquery";

const AboutUs = () => {

    $(document).ready(function (){
        $(".links li a").removeClass("active");
        $(".links li:nth-child(2) a").addClass("active");
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
            <div className="full-screen-section" style={{top: 0 + '%', zIndex: 5}}>
                <div className="about-intro-content-wrap">
                    <div className="introduction">
                        <div className="introduction-img">
                            <img src={anhdayne} alt="Yteco Image"/>
                        </div>
                        <div className="about-intro-content">
                            <h1 className="about-intro-title" title="Giới thiệu">About FPT HEALTH</h1>
                            <div className="scrollable-content article-content">
                                <p>
                                    FPT HEALTH International Hospital was established in 1984 (formerly known as FPT Hospital)
                                    Mainly to
                                    Bringing consumers the best support services from the medical industry in the city
                                    Health.
                                    <br/><br/>
                                    After more than 40 years of operation in the pharmaceutical industry, FPT HEALTH is
                                    proud to be
                                    a pioneer, always standing side by side with the city's healthcare industry, even in
                                    the
                                    most
                                    difficult times and gradually building a diverse business strategy, establishing a
                                    large
                                    distribution system nationwide including branches in Ho Chi Minh City, Hanoi, and
                                    other
                                    major
                                    cities.
                                    <br/><br/>
                                    In addition, FPT HEALTH also built a modern clinic system, with an area of ​​nearly
                                    3,500 m²
                                    meeting FPT standards, to ensure the quality of goods to serve community health.
                                    <br/><br/>
                                    With available potential and strengths, plus a team of experts and dedicated
                                    employees,
                                    highly
                                    qualified and experienced, Yteco has all the necessary elements to be able to stand
                                    in
                                    the ranks
                                    of leading companies in the medical field in Vietnam and the future in Southeast
                                    Asia.
                                    <br/><br/>
                                    As an organization with extensive business relationships at home and abroad,
                                    operating
                                    with the
                                    motto "Reconciling the rights and obligations between customers" to develop and grow
                                    together,
                                    FPT HEALTH has been continuing to take advantage of its advantages to serve
                                    community
                                    health
                                    better and better, to affirm its leading position in the medical field, not only in
                                    Vietnam but
                                    also reaching the international level and beyond.
                                    <br/><br/>
                                    FIELD OF ACTIVITIES:
                                </p>
                                <p>
                                    • Providing consumers with the best quality and most modern services
                                    <br/><br/>
                                    • Providing online medical examination and treatment services, at home and full
                                    medical
                                    examination and treatment services
                                    <br/><br/>
                                    • Bringing great experiences to consumers.
                                    <br/><br/>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="full-screen-section" style={{top: 0 + '%',zIndex: 4}}>
            <div className="about-core-bg">
                <div className="about-us">
                    <div className="no-gutter">
                        <div className="img-about">
                            <div className="core-img">
                                <figure>
                                    <img
                                        src={tamnhinsumenh}
                                        alt="Tầm nhìn - Sứ mệnh - Giá trị cốt lõi"
                                    />
                                </figure>
                            </div>
                        </div>
                        <div className="core-list-wrap">
                            <div className="core-list tooltip-container">
                                <CoreItem
                                    imgSrc={tamnhinicon}
                                    title="Vision"
                                    content="FPTHeath strives to become the leading hospital in Vietnam in all fields of medical examination and treatment services"
                                />
                                <CoreItem
                                    imgSrc={sumenhicon}
                                    title="Mission"
                                    content="FPT is dedicated to contributing to protecting health, improving quality of life and enhancing aging human lifespan"
                                />
                                <CoreItem
                                    imgSrc={giatricotloi}
                                    title="Core values"
                                    content="Integrity, respect, fairness, ethics, compliance"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            </div>
            <div className="full-screen-section" style={{top: 0 + '%',zIndex: 3}}>
            <div id="ls-ht">
                <h3>History Begin</h3>
                <div className="swiper-wrapper">
                    <div className="history-item">
                        <div className="history-year">
                            <span>2023</span>
                        </div>
                        <div className="history-content-wrap">
                            <p>The hospital carries out comprehensive digital transformation through the development of a work management and operation system on the Base platform - work platformization Restructuring family business orientation
                                Carry out work on the Base platform .</p>
                        </div>
                    </div>
                    <div className="history-item">
                        <div className="history-year">
                            <span>2021</span>
                        </div>
                        <div className="history-content-wrap">
                            <p>The hospital cooperates in business with the multinational company IMCD for distribution
                                Pharmacy at
                                Vietnam</p>
                        </div>
                    </div>
                    <div className="history-item">
                        <div className="history-year">
                            <span>2020</span>
                        </div>
                        <div className="history-content-wrap">
                            <p>FPT HEALTH medical hospital celebrates the 36th anniversary of the Company's establishment</p>
                        </div>
                    </div>
                    <div className="history-item">
                        <div className="history-year">
                            <span>2019</span>
                        </div>
                        <div className="history-content-wrap">
                            <p>May 17, 2019, the Company was honored to receive the Second Class Labor Medal from the President of the Republic of Vietnam.
                                Hoa Xa
                                Vietnam Socialist Association</p>
                        </div>
                    </div>
                    <div className="history-item">
                        <div className="history-year">
                            <span>2017</span>
                        </div>
                        <div className="history-content-wrap">
                            <p>On February 22, 2017, the Company was granted a Certificate by the Vietnam Securities Depository Center (VSD).
                                received Securities Registration No. 53/2017/GCNCP-VSD, with a total number of registered shares of
                                2,800,000 shares</p>
                        </div>
                    </div>
                </div>
            </div>
            </div>
            <div className="full-screen-section" style={{top: 0 + '%',zIndex: 2}}>
            <div className="hospital-diagram">
                <div className="hospital-diagram-text">
                    <h3>Hospital Diagram</h3>
                </div>
                <div className="hospital-diagram-sodo">
                    <img src={sodobenhvien}
                         alt="Hospital Diagram"/>
                </div>
            </div>
            </div>
            <div className="full-screen-section" style={{top: 0 + '%',zIndex: 1}}>
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

const CoreItem = ({imgSrc, title, content}) => {
    return (
        <div className="core-item-wrap">
            <div className="core-item">
                <div className="core-item-icon">
                    <figure>
                        <img src={imgSrc} alt={title}/>
                    </figure>
                </div>
                <div className="core-item-title">{title}</div>
                <div className="core-item-content">{content}</div>
            </div>
        </div>
    );
};

export default AboutUs;