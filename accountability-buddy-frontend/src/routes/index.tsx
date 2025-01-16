import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import Profile from "../pages/Profile";
import Settings from "../pages/Settings";
import NotFound from "../pages/NotFound";
import RouteMetadata from "./RouteMetadata";

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <RouteMetadata title="Home | Accountability Buddy">
              <Home />
            </RouteMetadata>
          }
        />
        <Route
          path="/profile"
          element={
            <RouteMetadata title="Profile | Accountability Buddy">
              <Profile />
            </RouteMetadata>
          }
        />
        <Route
          path="/settings"
          element={
            <RouteMetadata title="Settings | Accountability Buddy">
              <Settings />
            </RouteMetadata>
          }
        />
        <Route
          path="*"
          element={
            <RouteMetadata title="404 | Page Not Found">
              <NotFound />
            </RouteMetadata>
          }
        />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
