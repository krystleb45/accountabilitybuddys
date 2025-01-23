/**
 * Global TypeScript Declarations
 * This file extends the global namespace with additional interfaces and types
 * for window properties and observer callbacks.
 */

declare global {
  interface Window {
    /**
     * The global fetch API, providing a way to fetch resources.
     */
    fetch: typeof fetch;

    /**
     * The MutationObserver API, used to observe changes to the DOM.
     */
    MutationObserver: typeof MutationObserver;

    /**
     * The IntersectionObserver API, used to observe when an element enters or exits a viewport.
     */
    IntersectionObserver: typeof IntersectionObserver;

    /**
     * The ResizeObserver API, used to observe size changes of an element.
     */
    ResizeObserver: typeof ResizeObserver;

    /**
     * Add any custom global properties below.
     * Example: A global analytics function
     */
    customAnalytics?: (...args: unknown[]) => void;
  }

  /**
   * Callback for MutationObserver, invoked when observed DOM changes occur.
   * @param mutationsList - A list of MutationRecords representing changes.
   * @param observer - The MutationObserver instance observing the changes.
   */
  type MutationObserverCallback = (
    mutationsList: MutationRecord[],
    observer: MutationObserver
  ) => void;

  /**
   * Callback for IntersectionObserver, invoked when observed elements intersect with a root.
   * @param entries - A list of IntersectionObserverEntry objects.
   * @param observer - The IntersectionObserver instance observing the entries.
   */
  type IntersectionObserverCallback = (
    entries: IntersectionObserverEntry[],
    observer: IntersectionObserver
  ) => void;

  /**
   * Callback for ResizeObserver, invoked when observed elements are resized.
   * @param entries - A list of ResizeObserverEntry objects.
   * @param observer - The ResizeObserver instance observing the entries.
   */
  type ResizeObserverCallback = (
    entries: ResizeObserverEntry[],
    observer: ResizeObserver
  ) => void;

  /**
   * Add other global types as needed.
   */
}

export {};
