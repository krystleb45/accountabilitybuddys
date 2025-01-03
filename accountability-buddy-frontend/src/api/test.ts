import axios, { AxiosResponse } from "axios";
import MockAdapter from "axios-mock-adapter";

describe("API Test Suite", () => {
  // Create an instance of MockAdapter to mock axios
  const mock = new MockAdapter(axios);

  afterEach(() => {
    // Reset the mock after each test to avoid interference
    mock.reset();
  });

  it("should successfully fetch data from the API", async () => {
    const mockData = { message: "Success" };
    mock.onGet("/api/test-endpoint").reply(200, mockData);

    const response: AxiosResponse = await axios.get("/api/test-endpoint");

    expect(response.status).toBe(200);
    expect(response.data).toEqual(mockData);
  });

  it("should handle API errors gracefully", async () => {
    mock.onGet("/api/test-endpoint").reply(500);

    try {
      await axios.get("/api/test-endpoint");
    } catch (error: any) {
      expect(error.response.status).toBe(500);
    }
  });
});
