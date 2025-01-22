// __mocks__/analytics.mock.ts

type AnalyticsEvent = {
  type: 'event';
  eventName: string;
  properties: Record<string, unknown>;
};

type AnalyticsPageView = {
  type: 'pageView';
  pageName: string;
  properties: Record<string, unknown>;
};

type AnalyticsIdentify = {
  type: 'identify';
  userId: string;
  traits: Record<string, unknown>;
};

type AnalyticsData = AnalyticsEvent | AnalyticsPageView | AnalyticsIdentify;

const mockAnalyticsData: AnalyticsData[] = [];

/**
 * Mock function to track an event.
 * @param eventName - The name of the event to track.
 * @param properties - Additional properties to send with the event.
 */
function trackEvent(
  eventName: string,
  properties: Record<string, unknown> = {}
): void {
  mockAnalyticsData.push({ type: 'event', eventName, properties });
  console.log(`[Analytics Mock] Event tracked: ${eventName}`, properties);
}

/**
 * Mock function to track a page view.
 * @param pageName - The name of the page.
 * @param properties - Additional properties to send with the page view.
 */
function trackPageView(
  pageName: string,
  properties: Record<string, unknown> = {}
): void {
  mockAnalyticsData.push({ type: 'pageView', pageName, properties });
  console.log(`[Analytics Mock] Page view tracked: ${pageName}`, properties);
}

/**
 * Mock function to identify a user.
 * @param userId - The unique identifier of the user.
 * @param traits - Additional traits or attributes about the user.
 */
function identifyUser(
  userId: string,
  traits: Record<string, unknown> = {}
): void {
  mockAnalyticsData.push({ type: 'identify', userId, traits });
  console.log(`[Analytics Mock] User identified: ${userId}`, traits);
}

/**
 * Mock function to clear all analytics data (for resetting between tests).
 */
function clearAnalyticsData(): void {
  mockAnalyticsData.length = 0;
  console.log(`[Analytics Mock] All analytics data cleared.`);
}

/**
 * Mock function to retrieve all tracked analytics data.
 * Useful for assertions in tests.
 * @returns - An array of tracked analytics data.
 */
function getAnalyticsData(): AnalyticsData[] {
  return [...mockAnalyticsData];
}

// Export mock functions
export {
  trackEvent,
  trackPageView,
  identifyUser,
  clearAnalyticsData,
  getAnalyticsData,
};
