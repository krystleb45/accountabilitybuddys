import express, { Application } from "express";
import supertest from "supertest";
import { globalRateLimiter } from "../utils/rateLimiter";
import logger from "../utils/winstonLogger";

describe("Logger Tests", () => {
  beforeAll(() => {
    jest.spyOn(logger, "logStructured").mockImplementation((_infoObject: object) => {
      return logger;
    });
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  it("should log structured info without throwing an error", () => {
    expect(() => logger.logStructured({ message: "Test structured message" })).not.toThrow();
  });
});

const app: Application = express(); // Ensure app is typed as Application
app.use(globalRateLimiter);

app.get("/", (_req, res) => {
  res.send("Hello! This is a rate-limited route.");
});

describe("Rate Limiter Middleware", () => {
  let request: supertest.SuperTest<supertest.Test>;

  beforeAll(() => {
    request = supertest(app) as unknown as supertest.SuperTest<supertest.Test>; // Explicitly cast if needed
  });

  it("should allow requests within the rate limit", async () => {
    const response = await request.get("/");
    expect(response.status).toBe(200);
    expect(response.text).toBe("Hello! This is a rate-limited route.");
  });

  it("should block requests exceeding the rate limit", async () => {
    for (let i = 0; i < 10; i++) {
      await request.get("/");
    }
    const response = await request.get("/");
    expect(response.status).toBe(429);
    expect(response.body.message).toMatch(/Rate limit exceeded/i);
  });
});
