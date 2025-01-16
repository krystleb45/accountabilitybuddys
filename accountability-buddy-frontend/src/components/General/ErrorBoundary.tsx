import React, { ReactNode } from "react";

// Define types for props and state
interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
}

class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  // Catch errors in any components below and update state to display the fallback UI
  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error, errorInfo: null };
  }

  // Log error information to an external service or console
  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    console.error("Error caught by ErrorBoundary:", error, errorInfo);
    // Here you can add external logging service logic (e.g., Sentry, LogRocket)
  }

  render(): ReactNode {
    if (this.state.hasError) {
      // Render a custom fallback UI
      return (
        <div
          role="alert"
          aria-live="assertive"
          style={{
            padding: "20px",
            textAlign: "center",
            backgroundColor: "#f8d7da",
            color: "#721c24",
            border: "1px solid #f5c6cb",
            borderRadius: "5px",
          }}
        >
          <h1>Something went wrong.</h1>
          <p>We are working to fix the issue. Please try again later.</p>
        </div>
      );
    }

    // Render the child components
    return this.props.children;
  }
}

export default ErrorBoundary;
