import React, { useEffect, useRef } from 'react';
import './Modal.module.css';

interface ModalProps {
  title: string;
  content: React.ReactNode;
  isVisible: boolean;
  onClose: () => void;
}

const Modal: React.FC<ModalProps> = ({
  title,
  content,
  isVisible,
  onClose,
}) => {
  const modalRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isVisible) {
        onClose();
      }
    };

    if (isVisible && modalRef.current) {
      modalRef.current.focus();
    }

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isVisible, onClose]);

  if (!isVisible) return null;

  return (
    <div
      className="modal-overlay"
      data-testid="modal-overlay"
      onClick={onClose}
      role="presentation"
    >
      <div
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        ref={modalRef}
        tabIndex={-1}
        onClick={(e) => e.stopPropagation()}
      >
        <h2 id="modal-title">{title}</h2>
        <div className="modal-content">{content}</div>
        <button
          className="close-button"
          onClick={onClose}
          aria-label="Close modal"
        >
          &times;
        </button>
      </div>
    </div>
  );
};

export default Modal;
