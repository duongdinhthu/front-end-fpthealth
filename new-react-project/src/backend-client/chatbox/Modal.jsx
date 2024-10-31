import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import './Modal.css';

const Modal = ({ openModal, closeModal }) => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async () => {
        if (input.trim()) {
            const userMessage = { sender: 'user', text: input };
            setMessages((prevMessages) => [...prevMessages, userMessage]);
            setInput(''); // Xoá giá trị trong ô nhập
            try {
                const response = await axios.post('http://localhost:8080/api/v1/chat', { message: input });
                const botResponse = response.data.reply.replace(/_/g, ' '); // Remove underscores
                const botMessage = { sender: 'bot', text: botResponse };
                setMessages((prevMessages) => [...prevMessages, botMessage]);
            } catch (error) {
                console.error('Error sending message', error);
            }

        }
    };

    console.log('openModal:', openModal); // Thêm log để kiểm tra giá trị openModal
    console.log('messages:', messages); // Thêm log để kiểm tra các messages

    return (
        <div className={`modal ${openModal ? 'open' : ''}`}>
            <div className="modal-content">
                <div className="modal-header">
                    <h2>Chatbot</h2>
                    <button className="close-button" onClick={closeModal}>Close</button>
                </div>
                <div className="messages">
                    {messages.map((msg, index) => (
                        <div key={index} className={`message ${msg.sender}`}>
                            <div className="message-content">
                                <img
                                    src={msg.sender === 'user' ? 'https://img.icons8.com/dusk/64/user.png' : 'https://img.icons8.com/external-thin-kawalan-studio/24/external-chat-send-chat-thin-kawalan-studio.png'}
                                    alt={`${msg.sender} Icon`}
                                    className="icon"
                                />
                                <div className="text">{msg.text}</div>
                            </div>
                        </div>
                    ))}
                    <div ref={messagesEndRef}></div>
                </div>
                <div className="input-area">
                    <input
                        className="chatbot-input"
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                        placeholder="Type something..."
                    />
                    <button onClick={handleSend}>Send</button>
                </div>
            </div>
        </div>
    );
};

export default Modal;
