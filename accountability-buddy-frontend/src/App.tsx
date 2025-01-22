import React, { useState, useEffect, Suspense, useCallback } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { ThemeProvider as MuiThemeProvider } from "@mui/material/styles";
import { Button, CircularProgress, CssBaseline } from "@mui/material";
import { HelmetProvider, Helmet } from "react-helmet-async";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { UserProvider, useUser } from "src/context/data/UserContext"; // Wrap app with UserProvider and useUser hook
import createAppTheme from "./config/themeConfig";
import Gamification from "./components/Gamification/Gamification";
import PremiumFeatures from "src/components/PremiumFeatures/PremiumFeatures";
import { MilitarySupport } from "./components/MilitarySupport"; // Ensure correct import path
import NotFoundPage from "./components//Notifications/NotFoundPage"; // Add a 404 page
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
        <CssBaseline />
        <HelmetProvider>
          <Elements stripe={stripePromise}>
            <Router>
              <Helmet>
                <title>Accountability Buddy</title>
                <meta name="description" content="A platform for accountability and goal tracking." />
              </Helmet>
              <Suspense fallback={<CircularProgress style={{ margin: "20px auto", display: "block" }} />}>
                <RoutesWithUser />
              </Suspense>
              <Button onClick={handleThemeChange} variant="contained" style={{ marginTop: 16 }}>
                Toggle Theme
              </Button>
            </Router>
          </Elements>
        </HelmetProvider>
      </MuiThemeProvider>
    </UserProvider>
  );
};

// Component to handle user authentication and loading state
const RoutesWithUser: React.FC = () => {
  const { user, loading, error } = useUser();

  if (loading) return <CircularProgress style={{ margin: "20px auto", display: "block" }} />;
  if (error) return <p style={{ textAlign: "center", color: "red" }}>Error: {error}</p>;
  if (!user) return <p style={{ textAlign: "center" }}>Please log in to access your account.</p>;

  return (
    <Routes>
      <Route path="/" element={<Gamification user={user} />} />
      <Route path="/premium" element={<PremiumFeatures />} />
      <Route path="/military-support" element={<MilitarySupport />} />
      <Route path="*" element={<NotFoundPage />} /> {/* Catch-all route for 404 */}
    </Routes>
  );
};

export default App;
