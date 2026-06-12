describe("updatedFetch", () => {
  let updatedFetch;
  let expoFetchMock;
  let secureStoreMock;
  let originalFetchMock;

  beforeEach(() => {
    jest.resetModules();

    process.env.EXPO_PUBLIC_PROJECT_GROUP_ID = "pg-123";
    process.env.EXPO_PUBLIC_BASE_URL = "https://api.example.com";
    process.env.EXPO_PUBLIC_PROXY_BASE_URL = "https://proxy.example.com";
    process.env.EXPO_PUBLIC_HOST = "api.example.com";

    originalFetchMock = jest.fn();
    global.fetch = originalFetchMock;

    expoFetchMock = jest.fn().mockResolvedValue({ ok: true, status: 200 });
    secureStoreMock = {
      getItemAsync: jest.fn(),
    };

    jest.doMock("expo/fetch", () => ({
      fetch: expoFetchMock,
    }));

    jest.doMock("expo-secure-store", () => secureStoreMock);

    ({ default: updatedFetch } = require("./fetch"));
  });

  afterEach(() => {
    delete process.env.EXPO_PUBLIC_PROJECT_GROUP_ID;
    delete process.env.EXPO_PUBLIC_BASE_URL;
    delete process.env.EXPO_PUBLIC_PROXY_BASE_URL;
    delete process.env.EXPO_PUBLIC_HOST;
  });

  it("preserves an explicit authorization header", async () => {
    secureStoreMock.getItemAsync.mockResolvedValue(
      JSON.stringify({ jwt: "stale-jwt" }),
    );

    await updatedFetch("/api/onboarding/complete", {
      headers: {
        Authorization: "Bearer fresh-jwt",
      },
    });

    expect(secureStoreMock.getItemAsync).not.toHaveBeenCalled();
    expect(expoFetchMock).toHaveBeenCalledWith(
      "https://api.example.com/api/onboarding/complete",
      expect.objectContaining({
        headers: expect.any(Headers),
      }),
    );
    expect(
      expoFetchMock.mock.calls[0][1].headers.get("authorization"),
    ).toBe("Bearer fresh-jwt");
  });

  it("injects stored auth when no authorization header is provided", async () => {
    secureStoreMock.getItemAsync.mockResolvedValue(
      JSON.stringify({ jwt: "stored-jwt" }),
    );

    await updatedFetch("/api/onboarding/complete");

    expect(secureStoreMock.getItemAsync).toHaveBeenCalledWith("pg-123-jwt");
    expect(
      expoFetchMock.mock.calls[0][1].headers.get("authorization"),
    ).toBe("Bearer stored-jwt");
  });

  it("does not send an authorization header when stored auth has no jwt", async () => {
    secureStoreMock.getItemAsync.mockResolvedValue(
      JSON.stringify({ user: { id: 1 } }),
    );

    await updatedFetch("/api/onboarding/complete");

    expect(
      expoFetchMock.mock.calls[0][1].headers.has("authorization"),
    ).toBe(false);
  });
});
