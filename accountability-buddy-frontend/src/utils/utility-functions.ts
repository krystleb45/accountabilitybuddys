/**
 * Formats a number into a localized currency string.
 * @param amount - The number to format.
 * @param currency - The currency code (e.g., "USD", "EUR").
 * @param locale - The locale for formatting (default: "en-US").
 * @returns A string formatted as currency.
 */
export const formatCurrency = (amount: number, currency: string = "USD", locale: string = "en-US"): string => {
    if (isNaN(amount)) {
      throw new Error("Invalid amount provided for currency formatting.");
    }
    return new Intl.NumberFormat(locale, { style: "currency", currency }).format(amount);
  };
  
  /**
   * Creates a debounced version of a function that delays its execution.
   * @param func - The function to debounce.
   * @param delay - The delay in milliseconds.
   * @returns A debounced version of the function.
   */
  export const debounce = <T extends (...args: any[]) => any>(func: T, delay: number): (...args: Parameters<T>) => void => {
    let timeoutId: ReturnType<typeof setTimeout> | null = null;
  
    return (...args: Parameters<T>) => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      timeoutId = setTimeout(() => {
        func(...args);
      }, delay);
    };
  };
  
  /**
   * Fetches data from a given URL and returns the parsed JSON response.
   * @param url - The URL to fetch data from.
   * @param options - Optional fetch configuration options.
   * @returns A promise resolving to the parsed JSON response.
   * @throws An error if the fetch request fails.
   */
  export const fetchData = async <T>(url: string, options?: RequestInit): Promise<T> => {
    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          "Content-Type": "application/json",
          ...options?.headers,
        },
      });
  
      if (!response.ok) {
        throw new Error(`Failed to fetch data: ${response.status} ${response.statusText}`);
      }
  
      return await response.json();
    } catch (error) {
      throw new Error(`Error fetching data: ${(error as Error).message}`);
    }
  };
  