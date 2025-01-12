import supertest from "supertest";
import app from "../app";

describe("Performance Tests", () => {
  it("should handle 100 concurrent requests", async () => {
    const promises = Array.from({ length: 100 }).map(() =>
      supertest(app).get("/")
    );
    const results = await Promise.all(promises);
    results.forEach((response) => {
      expect(response.status).toBe(200);
    });
  });
});
