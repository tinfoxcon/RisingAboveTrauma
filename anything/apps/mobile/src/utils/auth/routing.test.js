import {
  AUTHENTICATED_HOME_ROUTE,
  getRouteForAuthenticatedUser,
  getRouteForLoggedOutUser,
  ONBOARDING_ROUTE,
  SIGN_IN_ROUTE,
} from "./routing";

describe("auth routing", () => {
  it("routes logged-out users to sign in", () => {
    expect(getRouteForLoggedOutUser()).toBe(SIGN_IN_ROUTE);
  });

  it("routes new authenticated users to onboarding", () => {
    expect(getRouteForAuthenticatedUser({ onboarded: false })).toBe(
      ONBOARDING_ROUTE,
    );
  });

  it("routes onboarded users to the main app", () => {
    expect(getRouteForAuthenticatedUser({ onboarded: true })).toBe(
      AUTHENTICATED_HOME_ROUTE,
    );
  });
});
