import React, { createContext, useContext, useState, useCallback } from 'react';

// Create Form Context
const FormContext = createContext();

// Custom hook to use FormContext
export const useFormContext = () => useContext(FormContext);

// Form Context Provider
export const FormProvider = ({ children }) => {
  const [formState, setFormState] = useState({});
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Update form state for a specific field
  const updateFormState = useCallback((key, value) => {
    setFormState((prevState) => ({ ...prevState, [key]: value }));
  }, []);

  // Update form error for a specific field
  const updateFormError = useCallback((key, errorMessage) => {
    setFormErrors((prevErrors) => ({ ...prevErrors, [key]: errorMessage }));
  }, []);

  // Validate form fields (example: required fields)
  const validateForm = useCallback((requiredFields) => {
    let isValid = true;
    const newErrors = {};

    requiredFields.forEach((field) => {
      if (!formState[field] || formState[field].trim() === '') {
        newErrors[field] = `${field} is required`;
        isValid = false;
      }
    });

    setFormErrors(newErrors);
    return isValid;
  }, [formState]);

  // Reset form state and errors
  const resetFormState = useCallback(() => {
    setFormState({});
    setFormErrors({});
  }, []);

  // Set submitting state
  const setSubmitting = useCallback((status) => {
    setIsSubmitting(status);
  }, []);

  return (
    <FormContext.Provider
      value={{
        formState,
        formErrors,
        updateFormState,
        updateFormError,
        validateForm,
        resetFormState,
        isSubmitting,
        setSubmitting,
      }}
    >
      {children}
    </FormContext.Provider>
  );
};

export default FormContext;
