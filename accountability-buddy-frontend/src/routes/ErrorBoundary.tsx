import React, { Component, ReactNode } from "react";
import { Properties } from 'csstype';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode; // Optional fallback UI
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
}

/**
 * ErrorBoundary Component
 *
 * This component catches JavaScript errors in its child component tree,
 * logs those errors, and displays a fallback UI.
 */
class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error, errorInfo: null };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    console.error("ErrorBoundary caught an error", error, errorInfo);
    this.setState({ errorInfo });

    // Optional: Send error details to an external service
    // Example: logErrorToService(error, errorInfo);
  }

  handleRetry = (): void => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  render() {
    const { hasError, error, errorInfo } = this.state;
    const { fallback, children } = this.props;

    if (hasError) {
      if (fallback) {
        return fallback;
      }

      return (
        <div style={errorBoundaryStyles.container}>
          <h1 style={errorBoundaryStyles.heading}>Something went wrong</h1>
          <p style={errorBoundaryStyles.message}>{error?.message}</p>
          {errorInfo && <details style={errorBoundaryStyles.details}>{errorInfo.componentStack}</details>}
          <button style={errorBoundaryStyles.button} onClick={this.handleRetry}>
            Try Again
          </button>
        </div>
      );
    }

    return children;
  }
}

const errorBoundaryStyles = {
    container: {
      display: "flex",
      flexDirection: "column" as React.CSSProperties["flexDirection"],
      alignItems: "center",
      justifyContent: "center",
      padding: "20px",
      textAlign: "center" as React.CSSProperties["textAlign"],
      backgroundColor: "#f8d7da",
      color: "#721c24",
      border: "1px solid #f5c6cb",
      borderRadius: "4px",
      maxWidth: "600px",
      margin: "40px auto",
    },
    heading: {
      fontSize: "24px",
      fontWeight: "bold",
    },
    message: {
      fontSize: "18px",
      margin: "10px 0",
    },
    details: {
      fontSize: "14px",
      whiteSpace: "pre-wrap" as React.CSSProperties["whiteSpace"],
      margin: "10px 0",
    },
    button: {
      padding: "10px 20px",
      fontSize: "16px",
      backgroundColor: "#007bff",
      color: "#fff",
      border: "none",
      borderRadius: "4px",
      cursor: "pointer",
    },
  };
  

export default ErrorBoundary;
