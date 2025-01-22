// routes.ts - Centralized route constants with metadata support

interface RouteDetails {
  path: string;
  requiresAuth: boolean;
  metadata?: {
    title?: string;
    description?: string;
  };
}

export const ROUTES: Record<string, RouteDetails> = {
  HOME: {
    path: '/',
    requiresAuth: false,
    metadata: {
      title: 'Home | Accountability Buddy',
      description:
        'Welcome to Accountability Buddy, your tool for tracking progress and achieving goals.',
    },
  },
  LOGIN: {
    path: '/login',
    requiresAuth: false,
    metadata: {
      title: 'Login | Accountability Buddy',
      description: 'Log in to access your account and track your progress.',
    },
  },
  REGISTER: {
    path: '/register',
    requiresAuth: false,
    metadata: {
      title: 'Register | Accountability Buddy',
      description: 'Create an account to start tracking your goals today.',
    },
  },
  DASHBOARD: {
    path: '/dashboard',
    requiresAuth: true,
    metadata: {
      title: 'Dashboard | Accountability Buddy',
      description:
        'View your progress, goals, and personalized recommendations.',
    },
  },
  PROFILE: {
    path: '/profile',
    requiresAuth: true,
    metadata: {
      title: 'Profile | Accountability Buddy',
      description: 'View and edit your personal profile information.',
    },
  },
  SETTINGS: {
    path: '/settings',
    requiresAuth: true,
    metadata: {
      title: 'Settings | Accountability Buddy',
      description: 'Manage your account settings and preferences.',
    },
  },
};

export default ROUTES;
