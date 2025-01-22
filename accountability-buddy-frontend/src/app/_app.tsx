import '../globals.css';
import { AppProps } from 'next/app';
import { AuthProvider } from '../context/auth/AuthContext'; // Assuming AuthContext exists
import Head from 'next/head';
import React, { Component, ReactNode, ErrorInfo } from 'react';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';

/** ErrorBoundary Component */
type ErrorBoundaryProps = {
  children: ReactNode; // Explicitly define the `children` prop
};

type ErrorBoundaryState = {
  hasError: boolean;
};

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    console.error('ErrorBoundary caught an error:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex items-center justify-center h-screen">
          <h1 className="text-xl font-bold text-red-600">
            Something went wrong. Please try again later.
          </h1>
        </div>
      );
    }
    return this.props.children;
  }
}

/** Loading Spinner Component */
const LoadingSpinner = () => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const handleStart = () => setLoading(true);
    const handleStop = () => setLoading(false);

    router.events.on('routeChangeStart', handleStart);
    router.events.on('routeChangeComplete', handleStop);
    router.events.on('routeChangeError', handleStop);

    return () => {
      router.events.off('routeChangeStart', handleStart);
      router.events.off('routeChangeComplete', handleStop);
      router.events.off('routeChangeError', handleStop);
    };
  }, [router]);

  return loading ? (
    <div className="fixed top-0 left-0 w-full h-1 bg-blue-500 animate-pulse" />
  ) : null;
};

/** Custom App Component */
function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Accountability Buddy</title>
        <meta
          name="description"
          content="Achieve your goals with Accountability Buddy."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <ErrorBoundary>
        <AuthProvider>
          <LoadingSpinner />
          <Component {...pageProps} />
        </AuthProvider>
      </ErrorBoundary>
    </>
  );
}

export default MyApp;
