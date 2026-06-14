import { beforeEach, describe, expect, it, vi } from "vitest";

const decode = vi.fn();
const encode = vi.fn();

vi.mock("@auth/core/jwt", () => ({
  decode,
  encode,
}));

describe("authJwt", () => {
  beforeEach(() => {
    vi.resetModules();
    vi.clearAllMocks();
    process.env.AUTH_SECRET = "test-secret";
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
});
