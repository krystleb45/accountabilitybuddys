// FooterUtils.ts

/**
 * Formats the current year as a string.
 *
 * @returns The current year (e.g., "2025").
 */
export const getCurrentYear = (): string => {
    return new Date().getFullYear().toString();
  };
  
  /**
   * Generates a list of footer links with their URLs and display names.
   *
   * @returns An array of footer link objects.
   */
  export const generateFooterLinks = (): { name: string; url: string }[] => {
    return [
      { name: "Privacy Policy", url: "/privacy" },
      { name: "Terms of Service", url: "/terms" },
      { name: "Contact Us", url: "/contact" },
    ];
  };
  