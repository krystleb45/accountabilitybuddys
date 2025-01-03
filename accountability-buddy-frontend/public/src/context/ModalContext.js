import React, { createContext, useState, useCallback } from 'react';
import { createPortal } from 'react-dom';

// Create ModalContext
export const ModalContext = createContext();

// ModalProvider component
export const ModalProvider = ({ children }) => {
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal visibility
  const [modalContent, setModalContent] = useState(null); // Modal content
  const [modalOptions, setModalOptions] = useState({}); // Modal options (e.g., size, animation)

  // Open the modal with content and optional settings
  const openModal = useCallback((content, options = {}) => {
    setModalContent(content);
    setModalOptions(options);
    setIsModalOpen(true);
  }, []);

  // Close the modal
  const closeModal = useCallback(() => {
    setModalContent(null);
    setModalOptions({});
    setIsModalOpen(false);
  }, []);

  // Toggle the modal's visibility
  const toggleModal = useCallback(() => {
    setIsModalOpen((prev) => !prev);
  }, []);

  // Modal component rendering
  const renderModal = () => (
    <div style={modalStyles}>
      <div style={{ ...modalContentStyles, ...modalOptions.style }} aria-modal="true" role="dialog">
        {modalContent}
        <button onClick={closeModal} style={closeButtonStyles} aria-label="Close Modal">Close</button>
      </div>
    </div>
  );

  return (
    <ModalContext.Provider value={{ isModalOpen, modalContent, openModal, closeModal, toggleModal }}>
      {children}
      {isModalOpen && createPortal(renderModal(), document.body)}
    </ModalContext.Provider>
  );
};

// Optional inline styles for modal
const modalStyles = {
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 1000,
  animation: 'fadeIn 0.3s',
};

const modalContentStyles = {
  backgroundColor: 'white',
  padding: '20px',
  borderRadius: '8px',
  maxWidth: '500px',
  width: '100%',
  transition: 'all 0.3s ease',
};

const closeButtonStyles = {
  marginTop: '20px',
  padding: '10px',
  backgroundColor: '#f44336',
  color: 'white',
  border: 'none',
  cursor: 'pointer',
  borderRadius: '4px',
};

export default ModalContext;
