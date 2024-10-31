import React from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import '../Partners/Partners.css';
import $ from "jquery";

const Partner = () => {
    const settings = {
        dots: true,
        infinite: true,
        speed: 5000,
        slidesToShow: 4,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 3000,
    };

    $(document).ready(function (){
        $(".links li a").removeClass("active");
        $(".links li:nth-child(3) a").addClass("active");
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
                <div className="container-dt">
                    <div className="text-dt">
                        <h3>
                            Partner
                        </h3>
                        <p>Becoming a partner of multinational and domestic pharmaceutical corporations and companies
                            has
                            proven Demonstrate our partners capacity and trust in our services. FPT HEALTH is proud to
                            share
                            with the partners in Vietnam and foreign partners that we have and are cooperating.</p>
                    </div>
                    <div className="wrapper">
                        <Slider {...settings} className="carousel">
                            <div className="card carousel-item card-1">
                                <img src="https://yteco.vn/Data/Sites/1/News/2736/welbutech-1.png" alt="Scigen"/>
                            </div>
                            <div className="card carousel-item card-2">
                                <img src="https://yteco.vn/Data/Sites/1/News/2742/urgo-1.png" alt="Dr. Med"/>
                            </div>
                            <div className="card carousel-item card-3">
                                <img src="https://yteco.vn/Data/Sites/1/News/2735/ge-healthcare-1.png"
                                     alt="Allegens"/>
                            </div>
                            <div className="card carousel-item card-4">
                                <img src="https://yteco.vn/Data/Sites/1/News/2705/d-tek1.png"
                                     alt="Allegens"/>
                            </div>
                            <div className="card carousel-item card-5">
                                <img src="https://yteco.vn/Data/Sites/1/News/2702/and-3.png"
                                     alt="Allegens"/>
                            </div>
                            <div className="card carousel-item card-6">
                                <img src="https://yteco.vn/Data/Sites/1/News/2552/scigen-1.png"
                                     alt="Allegens"/>
                            </div>
                        </Slider>
                    </div>
                    <div className="panner-2">
                        <div className="panner-img2"><img
                            src="https://yteco.vn/Data/Sites/1/News/2742/urgo-1.png" alt=""/></div>
                        <div className="panner-img2"><img
                            src="https://yteco.vn/Data/Sites/1/News/2702/and-3.png" alt=""/></div>
                        <div className="panner-img2"><img
                            src="https://yteco.vn/Data/Sites/1/News/2705/d-tek1.png" alt=""/></div>
                        <div className="panner-img2"><img
                            src="https://yteco.vn/Data/Sites/1/News/2736/welbutech-1.png" alt=""/></div>
                    </div>
                </div>
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

export default Partner;
