import { useContext } from "react";
import UserContext from "../context/data/UserContext";
import { User } from "../../src/types/User"; // Import centralized User type

const useUser = (): {
  user: User | null;
  refreshUserProfile: () => Promise<void>;
  loading: boolean;
  error: string | null;
} => {
  const context = useContext(UserContext);

  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }

  return context;
};

export default useUser;
