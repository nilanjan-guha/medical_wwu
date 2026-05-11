import { describe, expect, it } from "@jest/globals";
import { loginSchema, signupSchema } from "../src/validators/auth.validator";

describe("auth validation", () => {
  it("validates signup payload", () => {
    const payload = {
      name: "Patient User",
      email: "patient@example.com",
      password: "StrongPass123",
      healthConditions: ["Cancer"],
      consentForEmotionAnalysis: true
    };

    expect(() => signupSchema.parse(payload)).not.toThrow();
  });

  it("rejects invalid login payload", () => {
    expect(() =>
      loginSchema.parse({
        email: "bad-email",
        password: "123"
      })
    ).toThrow();
  });
});
