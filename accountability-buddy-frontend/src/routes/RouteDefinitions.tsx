import ROUTES from "./routes";
import Home from "src/app/homepage/page";
import Profile from "src/app/profile/page";
import Login from "src/app/login/page";
import Settings from "src/app/settings/page"; // Example of additional route import

export interface RouteDefinition {
  path: string;
  element: JSX.Element;
  isPrivate: boolean;
  metadata?: {
    title: string;
    description?: string;
  };
}

export const ROUTE_DEFINITIONS: RouteDefinition[] = [
  {
    path: ROUTES.HOME,
    element: <Home />,
    isPrivate: false,
    metadata: {
      title: "Home | Accountability Buddy",
      description: "Welcome to Accountability Buddy, your tool for tracking progress and achieving goals."
    },
  },
  {
    path: ROUTES.PROFILE,
    element: <Profile />,
    isPrivate: true,
    metadata: {
      title: "Profile | Accountability Buddy",
      description: "View and edit your profile information."
    },
  },
  {
    path: ROUTES.LOGIN,
    element: <Login />,
    isPrivate: false,
    metadata: {
      title: "Login | Accountability Buddy",
      description: "Log in to access your account and track your progress."
    },
  },
  {
    path: ROUTES.SETTINGS,
    element: <Settings />,
    isPrivate: true,
    metadata: {
      title: "Settings | Accountability Buddy",
      description: "Manage your account settings and preferences."
    },
  },
];
