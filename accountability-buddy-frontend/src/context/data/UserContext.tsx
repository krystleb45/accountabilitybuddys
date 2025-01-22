import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import { getUserProfile } from '../../services/userService'; // Adjust the path to match your service file
import { UserProfile } from '../../types/User.types';

interface UserContextType {
  user: UserProfile | null;
  loading: boolean;
  error: string | null;
  setUser: React.Dispatch<React.SetStateAction<UserProfile | null>>;
  logout: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        const userData = await getUserProfile(); // Fetch user data from the service
        setUser(userData as UserProfile);
        setError(null);
      } catch (err) {
        setError('Failed to fetch user profile.');
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const logout = () => {
    setUser(null);
    localStorage.removeItem('authToken'); // Clear auth token (adjust to your app's needs)
  };

  return (
    <UserContext.Provider value={{ user, loading, error, setUser, logout }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
