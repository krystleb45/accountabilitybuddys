import React, { useEffect, useRef } from 'react';
import styles from './Modal.module.css';

interface ModalProps {
  title?: string; // Title of the modal
  children?: React.ReactNode;
  content: React.ReactNode; // Content inside the modal
  isVisible: boolean; // Controls whether the modal is shown
  onClose: () => void; // Function to close the modal
  customClass?: string; // Optional additional CSS class for customization
  isOpen: boolean;
}

const Modal: React.FC<ModalProps> = ({
  title,
  content,
  isVisible,
  onClose,
  customClass = '',
}) => {
  const modalRef = useRef<HTMLDivElement | null>(null);

  // Close modal on 'Escape' key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent): void => {
      if (e.key === 'Escape' && isVisible) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isVisible, onClose]);

  // Focus on the modal when visible
  useEffect(() => {
    if (isVisible && modalRef.current) {
      modalRef.current.focus();
    }
  }, [isVisible]);

  // Prevent rendering when not visible
  if (!isVisible) return null;

  return (
    <div
      className={styles['modal-overlay']}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      data-testid="modal-overlay"
      onClick={onClose} // Close modal when clicking outside the content
    >
      <div
        className={`${styles.modal} ${customClass}`}
        ref={modalRef}
        tabIndex={-1}
        data-testid="modal"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the modal
      >
        <h2 id="modal-title" className={styles['modal-header']}>
          {title}
        </h2>
        <div className={styles['modal-content']}>{content}</div>
        <button
          className={styles['close-button']}
          onClick={onClose}
          aria-label="Close modal"
          data-testid="close-button"
        >
          &times;
        </button>
      </div>
    </div>
  );
};

export default Modal;
