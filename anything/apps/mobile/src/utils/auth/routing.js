export const SIGN_IN_ROUTE = "/signin";
export const SIGN_UP_ROUTE = "/signup";
export const ONBOARDING_ROUTE = "/onboarding";
export const AUTHENTICATED_HOME_ROUTE = "/(tabs)";

export function hasCompletedOnboarding(user) {
  return Boolean(user?.onboarded);
}

export function getRouteForAuthenticatedUser(user) {
  return hasCompletedOnboarding(user)
    ? AUTHENTICATED_HOME_ROUTE
    : ONBOARDING_ROUTE;
}

export function getRouteForLoggedOutUser() {
  return SIGN_IN_ROUTE;
}
