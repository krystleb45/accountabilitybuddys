// index.ts - Centralized exports for the Forms module

// Export form components
export { default as ForgotPassword } from "./ForgotPassword";
export { default as LoginForm } from "./LoginForm";
export { default as NewsletterSignup } from "./NewsletterSignup";
export { default as Register } from "./Register";
export { default as ResetPassword } from "./ResetPassword";
export { default as Signup } from "./Signup";

// Export utilities
export * from "./FormsUtils";

// Export styles (if needed for customization or usage in other components)
export { default as formStyles } from "./Forms.module.css";
