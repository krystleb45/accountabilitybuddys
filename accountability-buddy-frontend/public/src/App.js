import React, { useState, useEffect, Suspense, useCallback, useContext } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import axios from 'axios';
import { ThemeProvider } from '@mui/material/styles';
import { Button, CircularProgress } from '@mui/material';
import { HelmetProvider, Helmet } from 'react-helmet-async';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { createAppTheme } from './config/themeConfig';
import { ThemeContext, ThemeContextProvider } from './context/ThemeContext';
import { initGA, trackPageView } from './analytics/googleAnalytics';
import { initMixpanel, trackPageView as trackMixpanelView } from './analytics/mixpanelAnalytics';
import Gamification from './components/Gamification';
import PremiumFeatures from './components/PremiumFeatures';
import './App.css';

// Stripe public key initialization
const stripePromise = loadStripe('pk_test_XXXXXXXXXXXXXXXXXXXX'); // Replace with your actual key

// Lazy-loaded components for route-based code-splitting
const Feed = React.lazy(() => import('./components/Feed'));
const ProfileSettings = React.lazy(() => import('./components/ProfileSettings'));
const Dashboard = React.lazy(() => import('./components/Dashboard'));
const Signup = React.lazy(() => import('./components/Signup'));
const NotFound = React.lazy(() => import('./components/NotFound'));

// Error Boundary Component
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by Error Boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <p role="alert" aria-live="assertive" style={{ color: 'red', padding: '20px' }}>
          An unexpected error occurred. Please try refreshing the page.
        </p>
      );
    }
    return this.props.children;
  }
}

// Main App Component
const App = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { themeMode, toggleThemeMode } = useContext(ThemeContext);

  // Initialize Analytics
  useEffect(() => {
    initGA('G-XXXXXXXXXX'); // Replace with your actual GA tracking ID
    initMixpanel('YOUR_MIXPANEL_TOKEN'); // Replace with your Mixpanel token

    // Track initial page view
    const currentPage = window.location.pathname + window.location.search;
    trackPageView(currentPage);
    trackMixpanelView(currentPage);

    // Track page views on route changes
    const handleRouteChange = () => {
      const newPage = window.location.pathname + window.location.search;
      trackPageView(newPage);
      trackMixpanelView(newPage);
    };

    window.addEventListener('popstate', handleRouteChange);
    return () => window.removeEventListener('popstate', handleRouteChange);
  }, []);

  // Enhanced API Retry Logic with Exponential Backoff
  const fetchData = useCallback(async (retries = 3, delay = 1000) => {
    let attempt = 0;
    while (attempt < retries) {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/data`);
        setData(response.data.message);
        setError(null); // Clear error if successful
        break; // Exit loop if successful
      } catch (err) {
        attempt++;
        if (attempt >= retries) {
          setError('Error fetching data. Please try again later.');
        } else {
          // Exponential backoff
          await new Promise((res) => setTimeout(res, delay * attempt));
        }
      }
    }
    setLoading(false); // Ensure loading stops
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <ThemeProvider theme={createAppTheme(themeMode)}>
      <HelmetProvider>
        <Helmet>
          <title>Accountability Buddy - Achieve Your Goals</title>
          <meta name="description" content="Join the Accountability Buddy community and achieve your personal and professional goals." />
          <meta name="keywords" content="accountability, goals, community, productivity, motivation" />
          <meta property="og:title" content="Accountability Buddy" />
          <meta property="og:description" content="Join a community focused on goal achievement and personal growth." />
        </Helmet>

        <ErrorBoundary>
          <div className="App">
            <header className="App-header">
              <h1>Accountability Buddy</h1>
              <Button
                onClick={toggleThemeMode}
                variant="contained"
                color="primary"
                style={{ marginBottom: '20px' }}
                aria-label="Toggle Theme"
              >
                Toggle Theme
              </Button>

              {loading ? (
                <div aria-busy="true" aria-live="polite">
                  <CircularProgress />
                  <p>Loading data...</p>
                </div>
              ) : error ? (
                <p role="alert" aria-live="assertive" style={{ color: 'red' }}>
                  {error}
                </p>
              ) : (
                <p>{data ? data : 'Welcome to Accountability Buddy!'}</p>
              )}
            </header>

            <Elements stripe={stripePromise}>
              <Router>
                <Suspense fallback={<CircularProgress aria-label="Loading content..." />}>
                  <Switch>
                    <Route exact path="/" component={Feed} />
                    <Route path="/profile-settings" component={ProfileSettings} />
                    <Route path="/dashboard" component={Dashboard} />
                    <Route path="/signup" component={Signup} />
                    <Route path="/premium" component={PremiumFeatures} />
                    <Route path="/gamification" component={Gamification} />
                    <Route component={NotFound} />
                  </Switch>
                </Suspense>
              </Router>
            </Elements>
          </div>
        </ErrorBoundary>
      </HelmetProvider>
    </ThemeProvider>
  );
};

// App Wrapper with Theme Context
const AppWrapper = () => (
  <ThemeContextProvider>
    <App />
  </ThemeContextProvider>
);

export default AppWrapper;
