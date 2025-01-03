import { useState, useEffect } from "react";

/**
 * Custom hook for fetching user data from an API.
 *
 * @template T - The type of the user data.
 * @param userId - The ID of the user to fetch data for.
 * @returns An object containing the user data, loading state, and error information.
 */
const useUserFetch = <T>(userId: string): {
  userData: T | null;
  loading: boolean;
  error: Error | null;
} => {
  const [userData, setUserData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true); // Set loading to true before fetching
      setError(null);   // Reset any previous error state

      try {
        const response = await fetch(`https://api.example.com/users/${userId}`); // Replace with your API endpoint
        if (!response.ok) {
          throw new Error(`Error fetching user: ${response.statusText}`);
        }
        const data: T = await response.json();
        setUserData(data);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false); // Set loading to false after fetching
      }
    };

    if (userId) {
      fetchUserData(); // Only fetch if userId is provided
    }
  }, [userId]); // Re-fetch when userId changes

  return { userData, loading, error };
};

export default useUserFetch;
