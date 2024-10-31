import React, {useEffect, useState} from 'react';
import '../Home/Home.css';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import Slider from 'react-slick';
import home_new from '../img/home-bg-3.jpg';
import {useInView} from "react-intersection-observer";
import CountUp from "react-countup";
import $ from 'jquery';
import imgkhambenh from '../img/img-10.jpg';
import bannerImg from '../img/banner-img.png';

function Home() {
    const [isOpen, setIsOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 1080);
    const [articles, setArticles] = useState([]);

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    const handleResize = () => {
        setIsMobile(window.innerWidth <= 1080);
        if (window.innerWidth > 1080) {
            setIsOpen(false); // Đóng menu khi màn hình lớn hơn 1080px
        }
    };


    useEffect(() => {
        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);


    const [menuOpen, setMenuOpen] = useState(false);
    const {ref, inView} = useInView({
        triggerOnce: true,
        threshold: 0.1, // Điều chỉnh threshold nếu cần
    });

    const toggleCountupMenu = () => {
        setMenuOpen(!menuOpen);
    };

    useEffect(() => {
        const toggleBtnIcon = document.querySelector('.toggle-btn i');
        if (toggleBtnIcon) {
            toggleBtnIcon.className = menuOpen ? 'fas fa-indent' : 'fas fa-outdent';
        }
    }, [menuOpen]);

    const settings = {
        dots: true,
        infinite: true,
        speed: 5000,
        slidesToShow: 4,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 2000,

    };
    useEffect(() => {
        const fetchArticles = async () => {
            const storedArticles = localStorage.getItem('newsArticles');
            if (storedArticles) {
                setArticles(JSON.parse(storedArticles));
            }
            try {
                const response = await fetch('http://localhost:5000/news');
                const data = await response.json();
                setArticles(data);
                localStorage.setItem('newsArticles', JSON.stringify(data));
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
            }
        };

        fetchArticles();
    }, []);

    const settingsss = {
        lazyLoad: 'ondemand',
        slidesToShow: 4,
        slidesToScroll: 1
    };

    $(document).ready(function () {
        $(".banner-book-btn").unbind("click");
        $(".banner-book-btn").on("click",function (){
            window.location.href = "/services";
        });
        $(".links li a").removeClass("active");
        $(".links li:first-child a").addClass("active");
        var sections = $('.full-screen-section');
        var currentSectionIndex = 0;
        var totalSections = sections.length;
        var isOnScroll = false;

        function scrollToSection(index) {
            if (isOnScroll) return;
            isOnScroll = true;

            sections.each(function (idx) {
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

            setTimeout(function () {
                currentSectionIndex = index;
                isOnScroll = false;
            }, 1000);
        }

        $(document).on('wheel', function (event) {
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
            <div className="full-screen-section" style={{top: 0 + '%', zIndex: 6}}>
                <section id="banner-section">
                    <img className="banner-img" src={bannerImg}/>
                    <div className="banner-book-btn">
                        <img width="35" height="35" src="https://img.icons8.com/ios-filled/50/ffffff/right--v1.png"
                             alt="right--v1"/>
                        <h3 className="booking-btn-content">BOOK NOW</h3>
                    </div>
                </section>
            </div>
            <div className="full-screen-section" style={{top: 0 + '%', zIndex: 5}}>
                <section id="About_Us">
                    <div className="container-about">
                        <div className="about-img">
                            <img src={imgkhambenh} alt=""/>
                        </div>
                        <div className="about-text">
                            <h3>FPT HEALTH INTERNATIONAL STANDARD GENERAL HOSPITAL</h3>
                            <h1>Affirming its leading position in the field of health care not only in Vietnam but also
                                reaching the region and the world.</h1>
                            <p>FPT Health International General Hospital was established in 1945 (formerly FPT Medical
                                Clinic), and was converted from a clinic to a hospital in August 2001. After more than
                                55 years of operation in the medical industry with As a supplier of control and backup
                                management systems, FPT Health International General Hospital is proud to be a pioneer
                                hospital, always standing side by side with the city's healthcare industry even in the
                                most difficult times. .
                                Established a nationwide distribution system, including clinic branches</p>
                        </div>
                    </div>
                </section>
            </div>
            <div className="full-screen-section" style={{top: 0 + '%', zIndex: 4}}>
                <section className="number-nb">
                    <div className="text-nb">
                        <h3>
                            Outstanding Numbers
                        </h3>
                    </div>
                    <div className="counter-up">
                        <div className="content">
                            <div className="box">
                                <div className="counter" ref={ref}>
                                    {inView && <CountUp end={50} delay={0} duration={3}/>}+
                                </div>
                                <div className="text"> Year of development</div>
                            </div>
                            <div className="box">
                                <div className="counter" ref={ref}>
                                    {inView && <CountUp end={100} delay={0} duration={3}/>}+
                                </div>
                                <div className="text">Doctors & Employees</div>
                            </div>
                            <div className="box">
                                <div className="counter" ref={ref}>
                                    {inView && <CountUp end={1000} delay={0} duration={3}/>}+
                                </div>
                                <div className="text">Appointments / Month</div>
                            </div>
                            <div className="box">
                                <div className="counter" ref={ref}>
                                    {inView && <CountUp end={200} delay={0} duration={3}/>}+
                                </div>
                                <div className="text">Patients / Month</div>
                            </div>
                        </div>
                    </div>

                    <div className={`toggle-btn ${menuOpen ? 'open' : ''}`} onClick={toggleMenu}>
                        <i className={menuOpen ? 'fas fa-indent' : 'fas fa-outdent'} style={{color: 'black'}}/>
                    </div>
                </section>
            </div>
            <div className="full-screen-section" style={{top: 0 + '%', zIndex: 3}}>
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
            <div className="full-screen-section" style={{top: 0 + '%', zIndex: 2}}>
                <div className="news">
                    <div className="home-news-bg section-fp-padding-top section-wrapper background-cover">
                        <h2 className="new-title" data-tooltip="News - events">News</h2>
                        <Slider {...settingsss} className="slider lazy">
                            {articles.map((article, i) => (
                                <div key={i} className="news-item news-col">
                                    <div className="news-img">
                                        <figure>
                                            <a href={article.link} target="_self" title={article.title}>
                                                <img src={article.image} alt={article.alt}/>
                                            </a>
                                        </figure>
                                    </div>
                                    <div className="news-caption">
                                        <div className="news-title">
                                            <a href={article.link} target="_self"
                                               title={article.title}>{article.title}</a>
                                        </div>
                                        <a className="link-view-details" href={article.link} target="_self">READ
                                            MORE <img className="read-more" width="16" height="16"
                                                      src="https://img.icons8.com/small/16/004b91/right.png"
                                                      alt="right"/></a>
                                    </div>
                                </div>
                            ))}
                        </Slider>
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

export default Home;