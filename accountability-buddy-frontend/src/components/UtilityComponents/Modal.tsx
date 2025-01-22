import React from 'react';
import ReactDOM from 'react-dom';
import './Modal.css'; // CSS for styling the modal

interface ModalProps {
  isOpen: boolean; // Whether the modal is open
  title?: string; // Optional title for the modal
  children: React.ReactNode; // Modal content
  onClose: () => void; // Callback to close the modal
  showCloseButton?: boolean; // Whether to show the close button
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  title,
  children,
  onClose,
  showCloseButton = true,
}) => {
  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div
      className="modal-overlay"
      role="dialog"
      aria-labelledby="modal-title"
      aria-modal="true"
    >
      <div className="modal-content">
        {title && (
          <header className="modal-header">
            <h2 id="modal-title">{title}</h2>
            {showCloseButton && (
              <button
                className="modal-close-button"
                onClick={onClose}
                aria-label="Close modal"
              >
                &times;
              </button>
            )}
          </header>
        )}
        <main className="modal-body">{children}</main>
        {showCloseButton && (
          <footer className="modal-footer">
            <button className="modal-close-footer-button" onClick={onClose}>
              Close
            </button>
          </footer>
        )}
      </div>
    </div>,
    document.body
  );
};

export default Modal;
