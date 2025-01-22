import { useState, useCallback } from 'react';

/**
 * Custom hook for managing modals.
 *
 * This hook provides utilities to control the visibility and content of modals.
 *
 * @template T - The type of the modal content.
 * @returns An object containing modal state, handlers to open/close/toggle modals, and a function to set modal content.
 */
const useModal = <T = any>() => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [modalContent, setModalContent] = useState<T | null>(null);

  // Open the modal with optional content
  const openModal = useCallback((content?: T) => {
    if (content) setModalContent(content);
    setIsOpen(true);
  }, []);

  // Close the modal and reset content
  const closeModal = useCallback(() => {
    setIsOpen(false);
    setModalContent(null);
  }, []);

  // Toggle modal visibility
  const toggleModal = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  return {
    isOpen,
    modalContent,
    openModal,
    closeModal,
    toggleModal,
    setModalContent, // Expose setModalContent for advanced use cases
  };
};

export default useModal;
