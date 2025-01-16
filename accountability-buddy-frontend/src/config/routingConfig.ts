// Route Constants
const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  LOGOUT: "/logout",
  REGISTER: "/register",
  DASHBOARD: "/dashboard",
  SETTINGS: "/settings",
  PROFILE: "/profile",
  TASKS: "/tasks",
  TASK_DETAILS: "/tasks/:id",
  NOT_FOUND: "*",
};

// Routing Configuration
const routingConfig = {
  // Core Routes
  routes: ROUTES,

  // Protected Routes (require authentication)
  protectedRoutes: [
    ROUTES.DASHBOARD,
    ROUTES.SETTINGS,
    ROUTES.PROFILE,
    ROUTES.TASKS,
  ],

  // Role-Based Routes (based on user roles)
  roleBasedRoutes: {
    admin: [ROUTES.DASHBOARD, ROUTES.SETTINGS, ROUTES.PROFILE, ROUTES.TASKS],
    user: [ROUTES.DASHBOARD, ROUTES.PROFILE, ROUTES.TASKS],
    guest: [ROUTES.LOGIN, ROUTES.REGISTER],
  },

  // Default Route Redirects
  defaultRedirects: {
    authenticated: ROUTES.DASHBOARD, // Redirect after successful login
    unauthenticated: ROUTES.LOGIN, // Redirect if user is not authenticated
  },

  // Function to check if a route is protected
  isProtectedRoute(route) {
    return this.protectedRoutes.includes(route);
  },

  // Function to get allowed routes for a specific role
  getRoleBasedRoutes(role) {
    return this.roleBasedRoutes[role] || this.roleBasedRoutes["guest"];
  },

  // Function to get the redirect route after login
  getRedirectRoute(isAuthenticated) {
    return isAuthenticated
      ? this.defaultRedirects.authenticated
      : this.defaultRedirects.unauthenticated;
  },

  // Function to generate dynamic routes (e.g., '/tasks/:id')
  generateDynamicRoute(route, params = {}) {
    let dynamicRoute = route;
    for (const [key, value] of Object.entries(params)) {
      dynamicRoute = dynamicRoute.replace(`:${key}`, value);
    }
    return dynamicRoute;
  },
};

// Example Usage:
// const userRoutes = routingConfig.getRoleBasedRoutes('user');
// const isProtected = routingConfig.isProtectedRoute('/dashboard');
// const taskDetailRoute = routingConfig.generateDynamicRoute(ROUTES.TASK_DETAILS, { id: 123 });

export default routingConfig;
