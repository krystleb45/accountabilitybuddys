import React, { useState, useEffect, Suspense, useCallback } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { ThemeProvider as MuiThemeProvider } from "@mui/material/styles";
import { Button, CircularProgress } from "@mui/material";
import { HelmetProvider, Helmet } from "react-helmet-async";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { UserProvider, useUser } from "./context/data/UserContext"; // Wrap app with UserProvider and useUser hook
import createAppTheme from "./config/themeConfig";
import Gamification from "./components/Gamification/Gamification";
import PremiumFeatures from "./components/PremiumFeatures";
import MilitarySupport from './MilitarySupport';
import "./App.css";

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY || "");

const App: React.FC = () => {
  const [theme, setTheme] = useState<string>("light");

  // Load the theme from localStorage when the component mounts
  useEffect(() => {
    const storedTheme = localStorage.getItem("theme");
    if (storedTheme) setTheme(storedTheme);
  }, []);

  // Handle theme toggling
  const handleThemeChange = useCallback(() => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
  }, [theme]);

  return (
    <UserProvider>
      <MuiThemeProvider theme={createAppTheme(theme)}>
        <HelmetProvider>
          <Elements stripe={stripePromise}>
            <Router>
              <Helmet>
                <title>Accountability Buddy</title>
              </Helmet>
              <Suspense fallback={<CircularProgress />}>
                <RoutesWithUser />
                <Button onClick={handleThemeChange} variant="contained">
                  Toggle Theme
                </Button>
              </Suspense>
            </Router>
          </Elements>
        </HelmetProvider>
      </MuiThemeProvider>
    </UserProvider>
  );
};

<Router>
    <Routes>
        <Route path="/military-support" element={<MilitarySupport />} />
    </Routes>
</Router>;

// Component to handle user and loading state
const RoutesWithUser: React.FC = () => {
  const { user, loading, error } = useUser();

  if (loading) return <CircularProgress />;
  if (error) return <p>Error: {error}</p>;
  if (!user) return <p>Please log in to access your account.</p>;

  return (
    <Routes>
      <Route path="/" element={<Gamification user={user} />} />
      <Route path="/premium" element={<PremiumFeatures />} />
    </Routes>
  );
};

export default App;
