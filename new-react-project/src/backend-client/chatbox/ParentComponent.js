import React, { useState } from 'react';
import Modal from './Modal'; // Đảm bảo đường dẫn đúng tới file Modal

const ParentComponent = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleOpenModal = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    return (
        <div>
            <button onClick={handleOpenModal}>Open Modal</button>
            <Modal openModal={isModalOpen} closeModal={handleCloseModal} />
        </div>
    );
};

export default ParentComponent;
