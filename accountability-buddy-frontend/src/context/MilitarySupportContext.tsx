// MilitarySupportContext.tsx

import React, {
  createContext,
  useState,
  useCallback,
  useContext,
  ReactNode,
} from 'react';

// Define the shape of a Military Resource
interface MilitaryResource {
  id: string;
  title: string;
  description: string;
  link: string;
}

// Define the shape of the MilitarySupportContext
interface MilitarySupportContextType {
  resources: MilitaryResource[];
  addResource: (resource: MilitaryResource) => void;
  removeResource: (id: string) => void;
  updateResource: (
    id: string,
    updatedResource: Partial<MilitaryResource>
  ) => void;
}

// Create MilitarySupportContext with the appropriate type
const MilitarySupportContext = createContext<
  MilitarySupportContextType | undefined
>(undefined);

// Custom hook to use MilitarySupportContext
export const useMilitarySupport = (): MilitarySupportContextType => {
  const context = useContext(MilitarySupportContext);
  if (!context) {
    throw new Error(
      'useMilitarySupport must be used within a MilitarySupportProvider'
    );
  }
  return context;
};

// MilitarySupportProvider component props
interface MilitarySupportProviderProps {
  children: ReactNode;
}

// MilitarySupportProvider component
export const MilitarySupportProvider: React.FC<
  MilitarySupportProviderProps
> = ({ children }) => {
  const [resources, setResources] = useState<MilitaryResource[]>([]);

  // Add a new resource
  const addResource = useCallback((resource: MilitaryResource) => {
    setResources((prev) => [...prev, resource]);
  }, []);

  // Remove a resource by ID
  const removeResource = useCallback((id: string) => {
    setResources((prev) => prev.filter((resource) => resource.id !== id));
  }, []);

  // Update a resource by ID
  const updateResource = useCallback(
    (id: string, updatedResource: Partial<MilitaryResource>) => {
      setResources((prev) =>
        prev.map((resource) =>
          resource.id === id ? { ...resource, ...updatedResource } : resource
        )
      );
    },
    []
  );

  return (
    <MilitarySupportContext.Provider
      value={{ resources, addResource, removeResource, updateResource }}
    >
      {children}
    </MilitarySupportContext.Provider>
  );
};

export default MilitarySupportContext;
