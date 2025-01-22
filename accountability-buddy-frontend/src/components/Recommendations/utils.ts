// Utility functions for Recommendations components

/**
 * Filters recommendations by shared goals.
 * @param items - List of items to filter (individuals or groups).
 * @param userGoals - List of the user's goals.
 * @returns Filtered list of items that share goals with the user.
 */
export const filterBySharedGoals = <T extends { sharedGoals: string[] }>(
    items: T[],
    userGoals: string[]
  ): T[] => {
    return items.filter(item =>
      item.sharedGoals.some(goal => userGoals.includes(goal))
    );
  };
  
  /**
   * Sorts recommendations alphabetically by name.
   * @param items - List of items to sort.
   * @returns Sorted list of items.
   */
  export const sortByName = <T extends { name: string }>(items: T[]): T[] => {
    return [...items].sort((a, b) => a.name.localeCompare(b.name));
  };
  
  /**
   * Formats a book recommendation link for display.
   * @param link - The URL link to format.
   * @returns A formatted link with proper protocol or a fallback message if missing.
   */
  export const formatRecommendationLink = (link?: string): string => {
    if (!link) return "No link available";
    return link.startsWith("http://") || link.startsWith("https://") ? link : `https://${link}`;
  };
  