import React, { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import useUser from "../hooks/useUser";
import PrivateRoute from "./PrivateRoute";
import PublicRoute from "./PublicRoute";
import { LoadingSpinner } from "../components/LoadingSpinner";


// Example route configuration
interface RouteConfig {
  path: string;
  component: React.LazyExoticComponent<React.FC> | React.FC;
  isPrivate?: boolean;
  allowedRoles?: string[]; // Optional roles for access control
}

// Lazy-loaded components
const Home = lazy(() => import("src/app/homepage/page"));
const Login = lazy(() => import("src/app/login/page"));
const Dashboard = lazy(() => import("src/app/dashboard/page"));
const Profile = lazy(() => import("src/app/profile/page"));

// Route definitions
const routeConfigs: RouteConfig[] = [
  { path: "/", component: Home },
  { path: "/login", component: Login },
  { path: "/dashboard", component: Dashboard, isPrivate: true },
  { path: "/profile", component: Profile, isPrivate: true },
];

const DynamicRoutes: React.FC = () => {
  const { user, isAuthenticated } = useUser();

  const renderRoute = ({ path, component: Component, isPrivate, allowedRoles }: RouteConfig) => {
    if (isPrivate) {
      return (
        <Route
          key={path}
          path={path}
          element={
            <PrivateRoute
              isAuthenticated={isAuthenticated}
              element={<Component />}
            />
          }
        />
      );
    }

    return (
      <Route
        key={path}
        path={path}
        element={
          <PublicRoute
            isAuthenticated={isAuthenticated}
            element={<Component />}
          />
        }
      />
    );
  };

  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Routes>
        {routeConfigs.map((route) => renderRoute(route))}
      </Routes>
    </Suspense>
  );
};

export default DynamicRoutes;