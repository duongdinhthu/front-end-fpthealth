import React from 'react';
import './Recruitment.css';
import tdung1 from "../img/tuyendung1.jpg";
import tdung2 from "../img/tuyendung2.jpg";
import $ from "jquery";

const Recruitment = () => {

    $(document).ready(function (){
        $(".links li a").removeClass("active");
        $(".links li:nth-child(5) a").addClass("active");
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
            <div className="full-screen-section" style={{top: 0 + '%', zIndex: 4}}>
            <section className="section career-section-1">
                <div className="container-rcmt">
                    <div className="row items-center">
                        <div className="col-lg-5">
                            <div className="content-wrap">
                                <h2 className="section-title text-main has-divider mb-lg-6 mb-4">Why Should You Choose FPTHealth</h2>
                                <div className="content">
                                    FPT HEALTH in the near future is building a development orientation to become
                                    the No. 1 hospital in medical services. At the same time, the Hospital's Board
                                    of Directors issued a management policy to strive to maintain the Top 3,
                                    upgrading the Hospital to have the best service quality in the medical and
                                    pharmaceutical industry in Vietnam.
                                    <br/><br/>
                                    Strengthen cooperation with domestic and foreign businesses with reasonable
                                    capabilities.
                                    Participate in learning new methods to improve techniques and skills.
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-6 offset-lg-1">
                            <div className="img">
                                <figure>
                                    <img className="w-100"
                                         src={tdung1}
                                         alt="Vì sao chọn Yteco"/>
                                </figure>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            </div>
            <div className="full-screen-section" style={{top: 0 + '%', zIndex: 3}}>
            <section className="section career-section-2 background-cover">
                <div className="container">
                    <div className="row items-center">
                        <div className="col-lg-5">
                            <div className="content-wrap">
                                <h2 className="section-title text-main has-divider mb-lg-6 mb-4">Recruitment Program
                                    Use</h2>
                                <div className="content">
                                    In addition to recruitment positions, FPT HEALTH also has internship programs:
                                    Internship is
                                    The transition period between the learning environment and practical society is
                                    the stage
                                    fit
                                    work while studying for students. The internship process will help you a lot
                                    spread
                                    Experience the job and working environment earlier, before graduating and
                                    leaving
                                    school.
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-7">
                            <div className="img">
                                <figure>
                                    <img className="w-100"
                                         src={tdung2}
                                         alt="Chương trình tuyển dụng"/>
                                </figure>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            </div>
            <div className="full-screen-section" style={{top: 0 + '%', zIndex: 2}}>
            <section className="section career-section-3">
                <div className="container">
                    <div className="Module Module-1386">
                        <div className="ModuleContent">
                            <h1 className="section-title text-main has-divider mb-lg-6 mb-4">VACANCIES</h1>
                            <div className="career-list">
                                <div className="table-responsive">
                                    <table>
                                        <thead>
                                        <tr>
                                            <th>STT</th>
                                            <th style={{textAlign: 'left'}}>VACANCIES</th>
                                            <th>QUANTITY</th>
                                            <th>DAY ON</th>
                                            <th>THE DEADLINE FOR SUBMISSION</th>
                                        </tr>
                                        </thead>
                                        <tbody className="ajaxresponse">
                                        <tr>
                                            <td> 1 <strong className="num"/></td>
                                            <td style={{textAlign: 'left'}}>
                                                <a target title="MATERIALS SALES OFFICER - CONTACT">Materials Sales
                                                    Officer - Contact</a>
                                                <span className="label">News</span>
                                            </td>
                                            <td>2</td>
                                            <td>05/06/2024</td>
                                            <td>25/07/2024</td>
                                        </tr>
                                        <tr>
                                            <td> 2 <strong className="num"/></td>
                                            <td style={{textAlign: 'left'}}>
                                                <a target title="Marketer">Marketer</a>
                                                <span className="label">News</span>
                                            </td>
                                            <td>3</td>
                                            <td>05/06/2024</td>
                                            <td>25/07/2024</td>
                                        </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
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
}

export default Recruitment;
