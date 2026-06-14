import {
  extractAuthPayload,
  resolveAuthPayloadFromResponse,
} from "./apiResponse";

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

  it("falls back to the session token endpoint when the initial payload has only success and user", async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      text: async () =>
        JSON.stringify({
          jwt: "session-jwt",
          user: { id: 4, onboarded: true },
        }),
      headers: { get: () => "application/json" },
    });

    await expect(
      resolveAuthPayloadFromResponse(
        {
          success: true,
          user: { id: 4, email: "session@example.com" },
        },
        { action: "Sign in" },
      ),
    ).resolves.toEqual({
      jwt: "session-jwt",
      user: { id: 4, email: "session@example.com", onboarded: true },
    });
  });

  it("surfaces token exchange errors when the fallback session lookup fails", async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
      status: 503,
      text: async () =>
        JSON.stringify({
          error:
            "Authentication is temporarily unavailable. Server auth secret is not configured.",
        }),
      headers: { get: () => "application/json" },
    });

    await expect(
      resolveAuthPayloadFromResponse(
        {
          success: true,
          user: { id: 4, email: "session@example.com" },
        },
        { action: "Sign in" },
      ),
    ).rejects.toThrow(
      "Authentication is temporarily unavailable. Server auth secret is not configured.",
    );
  });

  it("fails loudly when the token exchange response shape is invalid", async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      status: 200,
      text: async () =>
        JSON.stringify({
          success: true,
          user: { id: 4, email: "session@example.com" },
        }),
      headers: { get: () => "application/json" },
    });

    await expect(
      resolveAuthPayloadFromResponse(
        {
          success: true,
          user: { id: 4, email: "session@example.com" },
        },
        { action: "Sign in" },
      ),
    ).rejects.toThrow(
      "Sign in succeeded, but the server returned an invalid session token response.",
    );
  });
});
