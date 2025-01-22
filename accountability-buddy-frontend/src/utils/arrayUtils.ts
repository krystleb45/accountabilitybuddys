/**
 * Removes duplicate values from an array.
 *
 * @param array - The input array with potential duplicates.
 * @returns A new array with unique values.
 */
export const removeDuplicates = <T>(array: T[]): T[] => {
  return Array.from(new Set(array));
};

/**
 * Sorts an array of objects by a specific key.
 *
 * @param array - The array to sort.
 * @param key - The key to sort the objects by.
 * @param order - Sort order ('asc' for ascending, 'desc' for descending). Defaults to 'asc'.
 * @returns A new array sorted by the specified key.
 */
export const sortByKey = <T>(
  array: T[],
  key: keyof T,
  order: 'asc' | 'desc' = 'asc'
): T[] => {
  return [...array].sort((a, b) => {
    const aValue = a[key];
    const bValue = b[key];

    if (aValue < bValue) return order === 'asc' ? -1 : 1;
    if (aValue > bValue) return order === 'asc' ? 1 : -1;
    return 0;
  });
};

/**
 * Filters an array of objects by a specific key-value pair.
 *
 * @param array - The array to filter.
 * @param key - The key to filter by.
 * @param value - The value to match.
 * @returns A new array with objects matching the specified key-value pair.
 */
export const filterByKeyValue = <T>(
  array: T[],
  key: keyof T,
  value: T[keyof T]
): T[] => {
  return array.filter((item) => item[key] === value);
};

/**
 * Finds the first object in an array matching a specific key-value pair.
 *
 * @param array - The array to search.
 * @param key - The key to search by.
 * @param value - The value to match.
 * @returns The first object matching the specified key-value pair, or undefined if not found.
 */
export const findByKeyValue = <T>(
  array: T[],
  key: keyof T,
  value: T[keyof T]
): T | undefined => {
  return array.find((item) => item[key] === value);
};
