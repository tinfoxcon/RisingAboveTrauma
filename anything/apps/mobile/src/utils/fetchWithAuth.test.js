describe("fetchWithAuth", () => {
  let fetchWithAuth;
  let ensureValidAuthSession;
  let refreshAuthSession;
  let authState;
  let setAuth;

  beforeEach(() => {
    jest.resetModules();
    global.fetch = jest.fn();
    global.FormData =
      global.FormData ||
      class MockFormData {
        append() {}
      };
    setAuth = jest.fn();
    authState = {
      auth: { jwt: "stale-jwt", user: { id: 7 } },
      setAuth,
    };

    jest.doMock("./auth/session", () => ({
      ensureValidAuthSession: jest.fn(),
      refreshAuthSession: jest.fn(),
    }));

    jest.doMock("./auth/store", () => ({
      useAuthStore: {
        getState: jest.fn(() => authState),
      },
    }));

    ({ fetchWithAuth } = require("./fetchWithAuth"));
    ({ ensureValidAuthSession, refreshAuthSession } = require("./auth/session"));
  });

  it("retries once with a refreshed token after a 401 response", async () => {
    ensureValidAuthSession.mockResolvedValue({
      ok: true,
      auth: authState.auth,
      refreshed: false,
    });
    refreshAuthSession.mockResolvedValue({
      ok: true,
      auth: { jwt: "fresh-jwt", user: { id: 7 } },
      refreshed: true,
    });
    global.fetch
      .mockResolvedValueOnce({ ok: false, status: 401 })
      .mockResolvedValueOnce({ ok: true, status: 200 });

    const response = await fetchWithAuth("/api/checkins/entries");

    expect(response.status).toBe(200);
    expect(refreshAuthSession).toHaveBeenCalledWith({ force: true });
    expect(global.fetch).toHaveBeenNthCalledWith(
      1,
      "/api/checkins/entries",
      expect.objectContaining({
        headers: expect.any(Headers),
      }),
    );
    expect(
      global.fetch.mock.calls[0][1].headers.get("Authorization"),
    ).toBe("Bearer stale-jwt");
    expect(
      global.fetch.mock.calls[1][1].headers.get("Authorization"),
    ).toBe("Bearer fresh-jwt");
  });

  it("returns the original 401 when refresh fails", async () => {
    ensureValidAuthSession.mockResolvedValue({
      ok: true,
      auth: authState.auth,
      refreshed: false,
    });
    refreshAuthSession.mockResolvedValue({
      ok: false,
      reason: "expired",
      status: 401,
    });
    global.fetch.mockResolvedValue({ ok: false, status: 401 });

    const response = await fetchWithAuth("/api/checkins/entries");

    expect(response.status).toBe(401);
    expect(global.fetch).toHaveBeenCalledTimes(1);
    expect(setAuth).toHaveBeenCalledWith(null);
  });

  it("clears auth immediately when the stored session is already known to be expired", async () => {
    ensureValidAuthSession.mockResolvedValue({
      ok: false,
      reason: "expired",
    });
    global.fetch.mockResolvedValue({ ok: false, status: 401 });

    const response = await fetchWithAuth("/api/checkins/entries");

    expect(response.status).toBe(401);
    expect(setAuth).toHaveBeenCalledWith(null);
  });

  it("does not set json content type for FormData bodies", async () => {
    ensureValidAuthSession.mockResolvedValue({
      ok: true,
      auth: authState.auth,
      refreshed: false,
    });
    global.fetch.mockResolvedValue({ ok: true, status: 200 });
    const formData = new FormData();
    formData.append("file", "example");

    await fetchWithAuth("/api/upload", {
      method: "POST",
      body: formData,
    });

    expect(
      global.fetch.mock.calls[0][1].headers.has("Content-Type"),
    ).toBe(false);
  });
});
