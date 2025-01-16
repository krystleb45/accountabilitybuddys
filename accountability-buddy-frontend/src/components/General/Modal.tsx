import React, { useEffect, useRef } from "react";
import "./Modal.css";

interface ModalProps {
  title: string;
  content: React.ReactNode;
  isVisible: boolean;
  onClose: () => void;
  customClass?: string;
}

const Modal: React.FC<ModalProps> = ({
  title,
  content,
  isVisible,
  onClose,
  customClass = "",
}) => {
  const modalRef = useRef<HTMLDivElement | null>(null);

  // Close modal on 'Escape' key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isVisible) {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isVisible, onClose]);

  // Focus on the modal when visible
  useEffect(() => {
    if (isVisible && modalRef.current) {
      modalRef.current.focus();
    }
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <div
      className="modal-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      onClick={onClose} // Close modal when clicking outside the content
    >
      <div
        className={`modal ${customClass}`}
        ref={modalRef}
        tabIndex={-1} // Use a valid tabIndex type
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the modal
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
