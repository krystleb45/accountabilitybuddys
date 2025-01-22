import React from "react";

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  // Update state when an error is caught
  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error, errorInfo: null };
  }

  // Log error details to an external service or console
  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    this.setState({ error, errorInfo });
    console.error("Error caught by ErrorBoundary:", error, errorInfo);

    // You can send the error details to an external logging service here
    // Example:
    // logErrorToService({ error, errorInfo });
  }

  // Reset the error state (useful for retrying actions or navigation)
  handleRetry = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div
          role="alert"
          aria-live="assertive"
          style={{
            padding: "20px",
            textAlign: "center",
            backgroundColor: "#f8d7da",
            color: "#721c24",
            borderRadius: "8px",
            boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
            maxWidth: "600px",
            margin: "20px auto",
          }}
        >
          <h1>Something went wrong.</h1>
          <p>
            We're sorry, an unexpected error occurred. Please try refreshing the page or
            contact support if the problem persists.
          </p>
          <button
            onClick={this.handleRetry}
            style={{
              padding: "10px 20px",
              fontSize: "1rem",
              backgroundColor: "#007bff",
              color: "#fff",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Retry
          </button>

          {process.env.NODE_ENV === "development" && (
            <details style={{ marginTop: "20px", textAlign: "left", whiteSpace: "pre-wrap" }}>
              <summary>Error Details (Development Only)</summary>
              {this.state.error && this.state.error.toString()}
              <br />
              {this.state.errorInfo && this.state.errorInfo.componentStack}
            </details>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
