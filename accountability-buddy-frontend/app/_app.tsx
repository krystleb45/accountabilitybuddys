import '../globals.css';
import { AppProps } from 'next/app';
import { AuthProvider } from '../src/context/AuthContext'; // Assuming you have an AuthContext
import Head from 'next/head';

// This is the custom App component for Next.js
function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      {/* Set global meta tags */}
      <Head>
        <title>Accountability Buddy</title>
        <meta name="description" content="Achieve your goals with the help of Accountability Buddy." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      {/* Wrap the entire app with the AuthProvider for global state management */}
      <AuthProvider>
        <Component {...pageProps} />
      </AuthProvider>
    </>
  );
}

export default MyApp;
