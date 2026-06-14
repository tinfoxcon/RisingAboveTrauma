import { beforeEach, describe, expect, it, vi } from "vitest";

const decode = vi.fn();
const encode = vi.fn();
const getToken = vi.fn();

vi.mock("@auth/core/jwt", () => ({
  decode,
  encode,
  getToken,
}));

describe("authJwt", () => {
  beforeEach(() => {
    vi.resetModules();
    vi.clearAllMocks();
    process.env.AUTH_SECRET = "test-secret";
    delete process.env.NEXTAUTH_SECRET;
    delete process.env.AUTHJS_SECRET;
    process.env.AUTH_URL = "https://example.com";
  });

  it("prefers the secure salt for https requests", async () => {
    decode.mockResolvedValue({ sub: "42" });
    const { decodeMobileAuthToken } = await import("./authJwt");

    const decoded = await decodeMobileAuthToken("token", {
      url: "https://example.com/api/checkins/list",
    });

    expect(decoded).toEqual({ sub: "42" });
    expect(decode).toHaveBeenCalledWith(
      expect.objectContaining({
        salt: "__Secure-authjs.session-token",
      }),
    );
  });

  it("falls back to the legacy salt when secure decode fails", async () => {
    decode
      .mockRejectedValueOnce(new Error("bad signature"))
      .mockResolvedValueOnce({ sub: "42" });
    const { decodeMobileAuthToken } = await import("./authJwt");

    const decoded = await decodeMobileAuthToken("token", {
      url: "https://example.com/api/checkins/list",
    });

    expect(decoded).toEqual({ sub: "42" });
    expect(decode).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({
        salt: "__Secure-authjs.session-token",
      }),
    );
    expect(decode).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({
        salt: "authjs.session-token",
      }),
    );
  });

  it("encodes refreshed mobile tokens with the preferred salt", async () => {
    encode.mockResolvedValue("signed-token");
    const { encodeMobileAuthToken } = await import("./authJwt");

    const encoded = await encodeMobileAuthToken(
      { sub: "42", email: "test@example.com" },
      { url: "https://example.com/api/auth/mobile-refresh" },
    );

    expect(encoded).toBe("signed-token");
    expect(encode).toHaveBeenCalledWith(
      expect.objectContaining({
        salt: "__Secure-authjs.session-token",
        token: { sub: "42", email: "test@example.com" },
      }),
    );
  });

  it("falls back to NEXTAUTH_SECRET when AUTH_SECRET is missing", async () => {
    delete process.env.AUTH_SECRET;
    process.env.NEXTAUTH_SECRET = "nextauth-secret";
    encode.mockResolvedValue("signed-token");
    const { encodeMobileAuthToken } = await import("./authJwt");

    await encodeMobileAuthToken(
      { sub: "42", email: "test@example.com" },
      { url: "https://example.com/api/auth/mobile-signin" },
    );

    expect(encode).toHaveBeenCalledWith(
      expect.objectContaining({
        secret: "nextauth-secret",
      }),
    );
  });

  it("falls back to the legacy cookie name when reading auth sessions", async () => {
    getToken
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce("raw-session-token")
      .mockResolvedValueOnce({ sub: "42", email: "test@example.com" });

    const { getAuthTokenPair } = await import("./authJwt");

    const result = await getAuthTokenPair({
      url: "https://example.com/api/auth/token",
    });

    expect(result).toEqual({
      token: "raw-session-token",
      jwt: { sub: "42", email: "test@example.com" },
      secureCookie: false,
    });
    expect(getToken).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({
        secureCookie: true,
        raw: true,
        secret: "test-secret",
      }),
    );
    expect(getToken).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({
        secureCookie: true,
        secret: "test-secret",
      }),
    );
    expect(getToken).toHaveBeenNthCalledWith(
      3,
      expect.objectContaining({
        secureCookie: false,
        raw: true,
        secret: "test-secret",
      }),
    );
    expect(getToken).toHaveBeenNthCalledWith(
      4,
      expect.objectContaining({
        secureCookie: false,
        secret: "test-secret",
      }),
    );
  });
});
