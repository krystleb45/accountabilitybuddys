import { ROUTES } from './routes';

/**
 * Get the route metadata for a given route key.
 *
 * @param routeKey - The key of the route in the ROUTES object.
 * @returns The metadata of the route or null if not found.
 */
export const getRouteMetadata = (routeKey: keyof typeof ROUTES) => {
  const route = ROUTES[routeKey];
  return route ? route.metadata : null;
};

/**
 * Check if a route requires authentication.
 *
 * @param routeKey - The key of the route in the ROUTES object.
 * @returns True if the route requires authentication, otherwise false.
 */
export const isRouteProtected = (routeKey: keyof typeof ROUTES): boolean => {
  const route = ROUTES[routeKey];
  return route ? route.requiresAuth : false;
};

/**
 * Generate a full URL for a given route and optional parameters.
 *
 * @param routeKey - The key of the route in the ROUTES object.
 * @param params - An object containing dynamic parameters for the route.
 * @returns The generated URL with parameters replaced or null if the route is not found.
 */
export const generateRouteUrl = (
  routeKey: keyof typeof ROUTES,
  params?: Record<string, string>
): string | null => {
  const route = ROUTES[routeKey];
  if (!route) return null;

  let path = route.path;

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      path = path.replace(`:${key}`, value);
    });
  }

  return path;
};

/**
 * Validate if the given route key exists in the ROUTES object.
 *
 * @param routeKey - The key of the route to validate.
 * @returns True if the route exists, otherwise false.
 */
export const isValidRoute = (routeKey: keyof typeof ROUTES): boolean => {
  return Object.prototype.hasOwnProperty.call(ROUTES, routeKey);
};

/**
 * Get all public routes from the ROUTES object.
 *
 * @returns An array of route paths that do not require authentication.
 */
export const getPublicRoutes = (): string[] => {
  return Object.values(ROUTES)
    .filter((route) => !route.requiresAuth)
    .map((route) => route.path);
};

/**
 * Get all private routes from the ROUTES object.
 *
 * @returns An array of route paths that require authentication.
 */
export const getPrivateRoutes = (): string[] => {
  return Object.values(ROUTES)
    .filter((route) => route.requiresAuth)
    .map((route) => route.path);
};
