import { formatCurrency, debounce, fetchData } from "../../src/utils/utility-functions";

describe("Utility Functions", () => {
  describe("formatCurrency", () => {
    test("formats number as USD currency", () => {
      expect(formatCurrency(1234.56)).toBe("$1,234.56");
      expect(formatCurrency(0)).toBe("$0.00");
      expect(formatCurrency(-1234.56)).toBe("-$1,234.56");
    });

    test("handles invalid inputs gracefully", () => {
      expect(formatCurrency(null as unknown as number)).toBe("$0.00");
      expect(formatCurrency(undefined as unknown as number)).toBe("$0.00");
      expect(formatCurrency(NaN)).toBe("$0.00");
    });
  });

  describe("debounce", () => {
    jest.useFakeTimers();

    test("calls the function after the specified delay", () => {
      const mockFn = jest.fn();
      const debouncedFn = debounce(mockFn, 500);

      debouncedFn();
      debouncedFn();
      debouncedFn();

      // Fast forward time
      jest.advanceTimersByTime(500);

      expect(mockFn).toHaveBeenCalledTimes(1);
    });

    test("does not call the function before the delay", () => {
      const mockFn = jest.fn();
      const debouncedFn = debounce(mockFn, 500);

      debouncedFn();

      // Fast forward less than the delay
      jest.advanceTimersByTime(300);

      expect(mockFn).not.toHaveBeenCalled();
    });
  });

  describe("fetchData", () => {
    beforeEach(() => {
      global.fetch = jest.fn();
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    test("fetches data successfully", async () => {
      const mockResponse = { data: "mock data" };
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const data = await fetchData("/api/data");
      expect(data).toEqual(mockResponse);
      expect(fetch).toHaveBeenCalledWith("/api/data");
    });

    test("handles fetch errors", async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 404,
        statusText: "Not Found",
      });

      await expect(fetchData("/api/missing")).rejects.toThrow(
        "Fetch error: 404 Not Found"
      );
      expect(fetch).toHaveBeenCalledWith("/api/missing");
    });

    test("handles network errors", async () => {
      (fetch as jest.Mock).mockRejectedValueOnce(new Error("Network error"));

      await expect(fetchData("/api/fail")).rejects.toThrow("Network error");
      expect(fetch).toHaveBeenCalledWith("/api/fail");
    });
  });
});
