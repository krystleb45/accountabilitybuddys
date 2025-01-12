import  sanitizeInput  from "../utils/sanitizeInput";

describe("Utility Tests", () => {
  it("should sanitize input correctly", () => {
    const input = "<script>alert('test')</script>";
    const result = sanitizeInput(input);
    expect(result).toBe("alert('test')");
  });
});
