// mockAuthProvider.tsx

import React, { createContext, ReactNode } from 'react';
import { AuthContextType } from 'src/context/auth/AuthContext'; // Ensure the correct path is imported

// Mock AuthContext shape
const mockAuthContext: AuthContextType = {
  authToken: 'mockAuthToken',
  isAuthenticated: true,
  user: {
    id: '1',
    name: 'Mock User',
    username: 'mockuser',
    email: 'mockuser@example.com',
    profilePictureUrl: 'https://example.com/mock-profile.jpg',
  },
  loading: false,
  login: jest.fn(),
  logout: jest.fn(),
  refreshUser: jest.fn(),
};

// Create a context for mock auth
const MockAuthContext = createContext<AuthContextType>(mockAuthContext);

// MockAuthProvider props
interface MockAuthProviderProps {
  children: ReactNode;
  customValues?: Partial<AuthContextType>;
}

// MockAuthProvider component
export const MockAuthProvider: React.FC<MockAuthProviderProps> = ({
  children,
  customValues,
}) => {
  // Combine customValues with the default mock context
  const mergedContext = { ...mockAuthContext, ...customValues };

  return (
    <MockAuthContext.Provider value={mergedContext}>
      {children}
    </MockAuthContext.Provider>
  );
};

// Utility hook to use MockAuthContext in tests
export const useMockAuth = (): AuthContextType => {
  const context = React.useContext(MockAuthContext);
  if (!context) {
    throw new Error('useMockAuth must be used within a MockAuthProvider');
  }
  return context;
};

export default MockAuthProvider;
