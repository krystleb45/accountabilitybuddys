// DashboardUtils.ts

/**
 * Formats a large number into a readable string with commas.
 *
 * @param number - The number to format.
 * @returns A formatted string (e.g., "1,234,567").
 */
export const formatNumber = (number: number): string => {
    return number.toLocaleString();
  };
  
  /**
   * Calculates the percentage of completion for a given set of tasks.
   *
   * @param completed - The number of completed tasks.
   * @param total - The total number of tasks.
   * @returns A percentage (rounded to the nearest whole number).
   */
  export const calculateCompletionPercentage = (
    completed: number,
    total: number
  ): number => {
    if (total === 0) return 0;
    return Math.round((completed / total) * 100);
  };
  
  /**
   * Truncates text to a specified length and appends ellipsis if needed.
   *
   * @param text - The text to truncate.
   * @param maxLength - The maximum allowed length of the text.
   * @returns The truncated text with ellipsis if it exceeds maxLength.
   */
  export const truncateText = (text: string, maxLength: number): string => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };
  
  /**
   * Filters dashboard data by a specified key and value.
   *
   * @param data - The array of dashboard data to filter.
   * @param key - The key to filter by.
   * @param value - The value to match.
   * @returns A filtered array of objects.
   */
  export const filterDashboardData = <T extends Record<string, any>>(
    data: T[],
    key: keyof T,
    value: any
  ): T[] => {
    return data.filter((item) => item[key] === value);
  };
  
  /**
   * Sorts dashboard data by a specified key.
   *
   * @param data - The array of dashboard data to sort.
   * @param key - The key to sort by.
   * @param ascending - Whether to sort in ascending order (default: true).
   * @returns A sorted array of objects.
   */
  export const sortDashboardData = <T extends Record<string, any>>(
    data: T[],
    key: keyof T,
    ascending: boolean = true
  ): T[] => {
    return [...data].sort((a, b) => {
      if (a[key] < b[key]) return ascending ? -1 : 1;
      if (a[key] > b[key]) return ascending ? 1 : -1;
      return 0;
    });
  };
  