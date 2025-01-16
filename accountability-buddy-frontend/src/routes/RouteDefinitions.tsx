import ROUTES from "./routes";
import Home from "../pages/Home";
import Profile from "../pages/Profile";
import Login from "../pages/Login";

export const ROUTE_DEFINITIONS = [
  {
    path: ROUTES.HOME,
    element: <Home />,
    isPrivate: false,
  },
  {
    path: ROUTES.PROFILE,
    element: <Profile />,
    isPrivate: true,
  },
  {
    path: ROUTES.LOGIN,
    element: <Login />,
    isPrivate: false,
  },
];
