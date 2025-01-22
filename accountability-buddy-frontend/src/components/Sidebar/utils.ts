/**
 * Determines if the current route matches the active route.
 * @param currentPath - The current path of the application.
 * @param targetPath - The path to check against.
 * @returns True if the current path matches the target path, otherwise false.
 */
export const isActiveRoute = (currentPath: string, targetPath: string): boolean => {
    return currentPath === targetPath;
  };
  
  /**
   * Formats a label to a readable format.
   * @param label - The label to format.
   * @returns A capitalized version of the label.
   */
  export const formatLabel = (label: string): string => {
    return label
      .split("-")
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };
  
  /**
   * Generates a unique key for sidebar items.
   * @param label - The label of the sidebar item.
   * @param index - The index of the sidebar item.
   * @returns A unique key for rendering lists.
   */
  export const generateSidebarKey = (label: string, index: number): string => {
    return `${label.replace(/\s+/g, "-").toLowerCase()}-${index}`;
  };
  