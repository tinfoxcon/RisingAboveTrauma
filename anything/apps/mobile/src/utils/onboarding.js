import { fetchWithAuth } from "@/utils/fetchWithAuth";

export function applyCompletedOnboarding(user, values) {
  return {
    ...user,
    onboarded: true,
    current_path: values.current_path,
    protecting_children: values.protecting_children,
  };
}

export async function persistOnboardingCompletion(values) {
  const response = await fetchWithAuth("/api/onboarding/complete", {
    method: "POST",
    body: JSON.stringify(values),
  });

  if (!response.ok) {
    const payload = await response.json().catch(() => null);
    throw new Error(
      payload?.error ||
        "We couldn't save your onboarding progress. Please try again.",
    );
  }

  return response.json();
}
