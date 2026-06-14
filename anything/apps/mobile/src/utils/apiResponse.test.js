import { extractAuthPayload } from "./apiResponse";

describe("extractAuthPayload", () => {
  it("reads the flat mobile auth response shape", () => {
    expect(
      extractAuthPayload({
        jwt: "jwt-token",
        user: { id: 1, email: "user@example.com" },
      }),
    ).toEqual({
      jwt: "jwt-token",
      user: { id: 1, email: "user@example.com" },
    });
  });

  it("accepts nested auth payloads with token aliases", () => {
    expect(
      extractAuthPayload({
        result: {
          token: "nested-token",
          user: { id: 2, email: "nested@example.com" },
        },
      }),
    ).toEqual({
      jwt: "nested-token",
      user: { id: 2, email: "nested@example.com" },
    });
  });

  it("returns null when no token is present", () => {
    expect(
      extractAuthPayload({
        success: true,
        user: { id: 3, email: "missing@example.com" },
      }),
    ).toBeNull();
  });
});
