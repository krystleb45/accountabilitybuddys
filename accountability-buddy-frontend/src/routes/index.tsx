import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "src/app/homepage/page";
import Profile from "src/app/profile/page";
import Settings from "src/app/settings/page";
import NotFound from "src/app/notfound/page";
import RouteMetadata from "./RouteMetadata";

/**
 * Application Routes
 * 
 * This component defines the routing structure of the application,
 * including metadata for each route.
 */
const AppRoutes: React.FC = () => {
  const routes = [
    {
      path: "/",
      title: "Home | Accountability Buddy",
      component: <Home />,
    },
    {
      path: "/profile",
      title: "Profile | Accountability Buddy",
      component: <Profile />,
    },
    {
      path: "/settings",
      title: "Settings | Accountability Buddy",
      component: <Settings />,
    },
    {
      path: "*",
      title: "404 | Page Not Found",
      component: <NotFound />,
    },
  ];

  return (
    <Router>
      <Routes>
        {routes.map(({ path, title, component }) => (
          <Route
            key={path}
            path={path}
            element={<RouteMetadata title={title}>{component}</RouteMetadata>}
          />
        ))}
      </Routes>
    </Router>
  );
};

export default AppRoutes;
