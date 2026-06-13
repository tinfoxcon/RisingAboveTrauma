import {
  decodeMobileAuthToken,
  encodeMobileAuthToken,
  getPreferredAuthSessionSalt,
  LEGACY_AUTH_SESSION_SALT,
  SECURE_AUTH_SESSION_SALT,
} from "./authJwt";
import { decode, encode } from "@auth/core/jwt";

vi.mock("@auth/core/jwt", () => ({
  decode: vi.fn(),
  encode: vi.fn(),
}));

describe("authJwt", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    delete process.env.AUTH_URL;
    process.env.AUTH_SECRET = "test-secret";
  });

  afterEach(() => {
    delete process.env.AUTH_URL;
    delete process.env.AUTH_SECRET;
  });

  it("prefers the secure salt for https requests when AUTH_URL is unset", () => {
    expect(
      getPreferredAuthSessionSalt({ url: "https://example.com/api/user/me" }),
    ).toBe(SECURE_AUTH_SESSION_SALT);
  });

  it("falls back to the legacy salt when decoding an older mobile token", async () => {
    decode.mockRejectedValueOnce(new Error("wrong salt"));
    decode.mockResolvedValueOnce({ sub: "7", email: "user@example.com" });

    const decoded = await decodeMobileAuthToken("jwt-token", {
      url: "https://example.com/api/checkins/list",
    });

    expect(decoded).toEqual({ sub: "7", email: "user@example.com" });
    expect(decode).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({ salt: SECURE_AUTH_SESSION_SALT }),
    );
    expect(decode).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({ salt: LEGACY_AUTH_SESSION_SALT }),
    );
  });

  it("encodes refreshed tokens with the current preferred salt", async () => {
    encode.mockResolvedValue("next-jwt");

    const jwt = await encodeMobileAuthToken(
      { sub: "7", email: "user@example.com", name: "User" },
      { url: "https://example.com/api/auth/mobile-refresh" },
    );

    expect(jwt).toBe("next-jwt");
    expect(encode).toHaveBeenCalledWith(
      expect.objectContaining({
        salt: SECURE_AUTH_SESSION_SALT,
        secret: "test-secret",
        token: { sub: "7", email: "user@example.com", name: "User" },
      }),
    );
  });
});
