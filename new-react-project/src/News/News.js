import React, {useEffect, useState} from 'react';
import axios from 'axios';
import '../News/News.css';
import $ from 'jquery'

const News = () => {
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true);

    $(document).ready(function () {
        $(".links li a").removeClass("active");
        $(".links li:nth-child(4) a").addClass("active");
    });

    useEffect(() => {
        const fetchArticles = async () => {
            const storedArticles = localStorage.getItem('newsArticles');
            if (storedArticles) {
                setArticles(JSON.parse(storedArticles));
                setLoading(false);
            }
            try {
                const response = await fetch('http://localhost:5000/news');
                const data = await response.json();
                setArticles(data);
                localStorage.setItem('newsArticles', JSON.stringify(data));
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchArticles();
    }, []);

    return (
        <div>
            {loading ? (
                <div id="loading-div">
                    <div className="spinner"></div>
                </div>
            ) : (
                <div>
                    <div className="news-container">
                        <div className="div-title">
                            <h1>Latest News</h1>
                        </div>
                        {articles.map((article, i) => (
                            <div key={i} className="news-item">
                                {article.image && <img src={article.image} alt={article.title} width="300"/>}
                                <div className="news-item-right">
                                <div className="news-item-top">
                                    <a href={article.link} target="_blank" rel="noopener noreferrer">
                                        <p className="news-title">{article.title}</p>
                                    </a>
                                    <p className="news-description">{article.description}</p>
                                </div>
                                <div className="news-item-bottom">
                                    <a href={article.link} target="_blank" rel="noopener noreferrer"
                                       className="readMore">READ MORE<img
                                        width="5" height="10"
                                        src="https://img.icons8.com/android/24/3d5191/right.png" alt="right"/></a>
                                </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
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
                                         src="https://img.icons8.com/ios-glyphs/30/004B91/phone--v1.png" np
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
    );
}

export default News;
