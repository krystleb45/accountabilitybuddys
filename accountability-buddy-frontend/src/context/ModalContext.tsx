import React, { createContext, useState, useCallback, ReactNode } from "react";
import { createPortal } from "react-dom";

// Define the shape of the ModalContext
interface ModalContextType {
  isModalOpen: boolean;
  modalContent: ReactNode | null;
  openModal: (content: ReactNode, options?: ModalOptions) => void;
  closeModal: () => void;
  toggleModal: () => void;
}

// Define the shape of the modal options
interface ModalOptions {
  style?: React.CSSProperties; // Optional style for modal content
}

// Create ModalContext with the appropriate type
export const ModalContext = createContext<ModalContextType | undefined>(undefined);

// ModalProvider component props
interface ModalProviderProps {
  children: ReactNode;
}

// ModalProvider component
export const ModalProvider: React.FC<ModalProviderProps> = ({ children }) => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false); // Modal visibility
  const [modalContent, setModalContent] = useState<ReactNode | null>(null); // Modal content
  const [modalOptions, setModalOptions] = useState<ModalOptions>({}); // Modal options

  // Open the modal with content and optional settings
  const openModal = useCallback((content: ReactNode, options: ModalOptions = {}) => {
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
      <div
        style={{ ...modalContentStyles, ...modalOptions.style }}
        aria-modal="true"
        role="dialog"
      >
        {modalContent}
        <button
          onClick={closeModal}
          style={closeButtonStyles}
          aria-label="Close Modal"
        >
          Close
        </button>
      </div>
    </div>
  );

  return (
    <ModalContext.Provider
      value={{ isModalOpen, modalContent, openModal, closeModal, toggleModal }}
    >
      {children}
      {isModalOpen && createPortal(renderModal(), document.body)}
    </ModalContext.Provider>
  );
};

// Optional inline styles for modal
const modalStyles: React.CSSProperties = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  backgroundColor: "rgba(0, 0, 0, 0.5)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 1000,
  animation: "fadeIn 0.3s",
};

const modalContentStyles: React.CSSProperties = {
  backgroundColor: "white",
  padding: "20px",
  borderRadius: "8px",
  maxWidth: "500px",
  width: "100%",
  transition: "all 0.3s ease",
};

const closeButtonStyles: React.CSSProperties = {
  marginTop: "20px",
  padding: "10px",
  backgroundColor: "#f44336",
  color: "white",
  border: "none",
  cursor: "pointer",
  borderRadius: "4px",
};

export default ModalContext;
