import React, { createContext, useContext, useState, useCallback, ReactNode } from "react";

// Define the shape of the FormContext
interface FormContextType {
  formState: Record<string, any>;
  formErrors: Record<string, string>;
  updateFormState: (key: string, value: any) => void;
  updateFormError: (key: string, errorMessage: string) => void;
  validateForm: (requiredFields: string[]) => boolean;
  resetFormState: () => void;
  isSubmitting: boolean;
  setSubmitting: (status: boolean) => void;
}

// Create Form Context with the appropriate type
const FormContext = createContext<FormContextType | undefined>(undefined);

// Custom hook to use FormContext
export const useFormContext = (): FormContextType => {
  const context = useContext(FormContext);
  if (!context) {
    throw new Error("useFormContext must be used within a FormProvider");
  }
  return context;
};

// FormProvider component props
interface FormProviderProps {
  children: ReactNode;
}

// Form Context Provider
export const FormProvider: React.FC<FormProviderProps> = ({ children }) => {
  const [formState, setFormState] = useState<Record<string, any>>({});
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Update form state for a specific field
  const updateFormState = useCallback((key: string, value: any) => {
    setFormState((prevState) => ({ ...prevState, [key]: value }));
  }, []);

  // Update form error for a specific field
  const updateFormError = useCallback((key: string, errorMessage: string) => {
    setFormErrors((prevErrors) => ({ ...prevErrors, [key]: errorMessage }));
  }, []);

  // Validate form fields (example: required fields)
  const validateForm = useCallback(
    (requiredFields: string[]): boolean => {
      let isValid = true;
      const newErrors: Record<string, string> = {};

      requiredFields.forEach((field) => {
        if (!formState[field] || formState[field].trim() === "") {
          newErrors[field] = `${field} is required`;
          isValid = false;
        }
      });

      setFormErrors(newErrors);
      return isValid;
    },
    [formState],
  );

  // Reset form state and errors
  const resetFormState = useCallback(() => {
    setFormState({});
    setFormErrors({});
  }, []);

  // Set submitting state
  const setSubmitting = useCallback((status: boolean) => {
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
