/**
 * Centralized type definitions for the General folder components
 */

// Type for ErrorBoundary props
export interface ErrorBoundaryProps {
  children: React.ReactNode; // Child components wrapped by the ErrorBoundary
  fallbackMessage?: string; // Optional custom fallback message
}

// Type for Modal props
export interface ModalProps {
  isOpen: boolean; // Whether the modal is open or not
  onClose: () => void; // Function to close the modal
  title?: string; // Optional modal title
  children?: React.ReactNode; // Content of the modal
  footer?: React.ReactNode; // Optional footer content for the modal
}

// Type for NewsletterSignup form data
export interface NewsletterSignupData {
  email: string; // Email address entered by the user
  consent: boolean; // Whether the user consents to receive emails
}

// Type for SimpleComponent props
export interface SimpleComponentProps {
  text: string; // Text to display in the component
  onClick?: () => void; // Optional click handler
}

// Type for ThemeToggle props
export interface ThemeToggleProps {
  isDarkMode: boolean; // Whether dark mode is active
  onToggle: () => void; // Function to toggle theme mode
}

// Generic type for API responses
export interface ApiResponse<T> {
  success: boolean; // Whether the API request was successful
  message?: string; // Optional message from the API
  data?: T; // Optional data payload returned by the API
}

// Type for reusable Button props (if applicable)
export interface ButtonProps {
  text: string; // Button text
  onClick: () => void; // Click handler
  disabled?: boolean; // Whether the button is disabled
  variant?: 'primary' | 'secondary' | 'danger' | 'success'; // Optional button styles
}
