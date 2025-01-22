import { useState, useEffect, useCallback } from "react";

/**
 * Generic custom hook for fetching data from an API.
 *
 * @template T - The expected type of the fetched data.
 * @param url - The API endpoint to fetch data from.
 * @param options - Optional configuration for the fetch request.
 * @returns An object containing the fetched data, loading state, error information, and a refetch function.
 */
const useFetch = <T>(
  url: string | null,
  options: RequestInit = {}
): {
  data: T | null;
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
} => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async () => {
    if (!url) return; // Do nothing if no URL is provided

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(url, options);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result: T = await response.json();
      setData(result);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, [url, options]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
};

export default useFetch;
