import type { Request, Response } from "express";
import { globalRateLimiter } from "../utils/rateLimiter";

describe("Middleware Tests", () => {
  it("should call next if rate limit is not exceeded", () => {
    const req = {} as Request;
    const res = {} as Response;
    const next = jest.fn();

    void globalRateLimiter(req, res, next);
    expect(next).toHaveBeenCalled();
  });
});
