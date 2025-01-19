// CardUtils.ts

/**
 * Utility function to combine multiple class names into a single string.
 * Handles conditional class names gracefully.
 * @param classes - An array of class names (strings or undefined).
 * @returns A single string with all valid class names joined by a space.
 */
export const combineClassNames = (...classes: (string | undefined)[]): string => {
    return classes.filter(Boolean).join(" ");
  };
  
  /**
   * Utility function to generate a unique identifier for cards.
   * Useful for dynamic rendering or testing purposes.
   * @param prefix - A prefix for the identifier.
   * @returns A unique identifier string.
   */
  export const generateCardId = (prefix: string = "card"): string => {
    return `${prefix}-${Math.random().toString(36).substr(2, 9)}`;
  };
  
  /**
   * Constants for default card configurations.
   */
  export const DEFAULT_CARD_CONFIG = {
    borderRadius: "8px",
    padding: "1rem",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
  };
  
  /**
   * Utility function to check if a DOM element is inside a specific card.
   * @param element - The DOM element to check.
   * @param cardId - The unique identifier of the card.
   * @returns True if the element is inside the card; otherwise, false.
   */
  export const isElementInsideCard = (element: HTMLElement, cardId: string): boolean => {
    let currentElement: HTMLElement | null = element;
    while (currentElement) {
      if (currentElement.id === cardId) return true;
      currentElement = currentElement.parentElement;
    }
    return false;
  };
  
  /**
   * Utility function to determine if a given value is a valid card configuration key.
   * @param key - The key to validate.
   * @returns True if the key is valid; otherwise, false.
   */
  export const isValidCardConfigKey = (key: string): key is keyof typeof DEFAULT_CARD_CONFIG => {
    return key in DEFAULT_CARD_CONFIG;
  };
  