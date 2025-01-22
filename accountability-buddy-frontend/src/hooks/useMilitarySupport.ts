import { useState, useEffect, useCallback } from 'react';
import axios from 'src/config/axiosConfig';

/**
 * Type definition for a military resource.
 */
interface MilitaryResource {
  id: string;
  title: string;
  description: string;
  link: string;
}

/**
 * Custom hook for managing military support resources.
 *
 * This hook provides functionality to fetch, add, update, and delete military resources.
 *
 * @returns An object containing resources, loading state, error information, and CRUD operations.
 */
const useMilitarySupport = () => {
  const [resources, setResources] = useState<MilitaryResource[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch resources from the API
  const fetchResources = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get<MilitaryResource[]>(
        '/military-support/resources'
      );
      setResources(response.data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to fetch resources.'
      );
    } finally {
      setLoading(false);
    }
  }, []);

  // Add a new resource
  const addResource = useCallback(
    async (newResource: Omit<MilitaryResource, 'id'>) => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.post<MilitaryResource>(
          '/military-support/resources',
          newResource
        );
        setResources((prev) => [...prev, response.data]);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'Failed to add resource.'
        );
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // Update an existing resource
  const updateResource = useCallback(
    async (id: string, updatedResource: Partial<MilitaryResource>) => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.put<MilitaryResource>(
          `/military-support/resources/${id}`,
          updatedResource
        );
        setResources((prev) =>
          prev.map((resource) =>
            resource.id === id ? response.data : resource
          )
        );
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'Failed to update resource.'
        );
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // Delete a resource
  const deleteResource = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      await axios.delete(`/military-support/resources/${id}`);
      setResources((prev) => prev.filter((resource) => resource.id !== id));
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to delete resource.'
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchResources();
  }, [fetchResources]);

  return {
    resources,
    loading,
    error,
    fetchResources,
    addResource,
    updateResource,
    deleteResource,
  };
};

export default useMilitarySupport;
export type { MilitaryResource };
