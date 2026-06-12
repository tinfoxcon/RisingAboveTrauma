describe("auth store persistence", () => {
  let store;
  let secureStore;
  let memory;

  beforeEach(() => {
    jest.resetModules();
    process.env.EXPO_PUBLIC_PROJECT_GROUP_ID = "pg-123";
    memory = {};

    jest.doMock("expo-secure-store", () => ({
      getItemAsync: jest.fn(async (key) => memory[key] ?? null),
      setItemAsync: jest.fn(async (key, value) => {
        memory[key] = value;
      }),
      deleteItemAsync: jest.fn(async (key) => {
        delete memory[key];
      }),
    }));

    store = require("./store");
    secureStore = require("expo-secure-store");
  });

  afterEach(() => {
    delete process.env.EXPO_PUBLIC_PROJECT_GROUP_ID;
  });

  it("migrates legacy auth storage into the project-group key", async () => {
    const auth = { jwt: "legacy-jwt", user: { id: 42 } };
    memory[store.legacyAuthKey] = JSON.stringify(auth);

    const result = await store.readStoredAuth();

    expect(result).toEqual(auth);
    expect(secureStore.setItemAsync).toHaveBeenCalledWith(
      store.authKey,
      JSON.stringify(auth),
    );
  });

  it("clears both the active and legacy auth keys", async () => {
    memory[store.authKey] = "current";
    memory[store.legacyAuthKey] = "legacy";

    await store.clearStoredAuth();

    expect(secureStore.deleteItemAsync).toHaveBeenCalledWith(store.authKey);
    expect(secureStore.deleteItemAsync).toHaveBeenCalledWith(
      store.legacyAuthKey,
    );
    expect(memory[store.authKey]).toBeUndefined();
    expect(memory[store.legacyAuthKey]).toBeUndefined();
  });
});
