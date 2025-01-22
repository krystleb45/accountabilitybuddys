// FormErrorContext.tsx

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from 'react';

// Define the shape of the FormErrorContext
interface FormErrorContextType {
  formErrors: { [key: string]: string };
  addError: (field: string, message: string) => void;
  removeError: (field: string) => void;
  clearErrors: () => void;
  hasErrors: () => boolean;
}

// Create FormErrorContext with the appropriate type
const FormErrorContext = createContext<FormErrorContextType | undefined>(
  undefined
);

// Custom hook to use FormErrorContext
export const useFormError = (): FormErrorContextType => {
  const context = useContext(FormErrorContext);
  if (!context) {
    throw new Error('useFormError must be used within a FormErrorProvider');
  }
  return context;
};

// FormErrorProvider component props
interface FormErrorProviderProps {
  children: ReactNode;
}

// FormErrorProvider component
export const FormErrorProvider: React.FC<FormErrorProviderProps> = ({
  children,
}) => {
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});

  // Add an error for a specific field
  const addError = useCallback((field: string, message: string) => {
    setFormErrors((prevErrors) => ({ ...prevErrors, [field]: message }));
  }, []);

  // Remove an error for a specific field
  const removeError = useCallback((field: string) => {
    setFormErrors((prevErrors) => {
      const { [field]: _, ...rest } = prevErrors;
      return rest;
    });
  }, []);

  // Clear all errors
  const clearErrors = useCallback(() => {
    setFormErrors({});
  }, []);

  // Check if there are any errors
  const hasErrors = useCallback(
    () => Object.keys(formErrors).length > 0,
    [formErrors]
  );

  return (
    <FormErrorContext.Provider
      value={{ formErrors, addError, removeError, clearErrors, hasErrors }}
    >
      {children}
    </FormErrorContext.Provider>
  );
};

export default FormErrorContext;
