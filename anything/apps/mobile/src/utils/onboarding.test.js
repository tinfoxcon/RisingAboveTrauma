jest.mock("@/utils/fetchWithAuth", () => ({
  fetchWithAuth: jest.fn(),
}));

import { fetchWithAuth } from "@/utils/fetchWithAuth";
import {
  applyCompletedOnboarding,
  persistOnboardingCompletion,
} from "./onboarding";

describe("onboarding helpers", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("applies onboarding completion to the user object", () => {
    const user = { id: 1, onboarded: false, current_path: null };
    const nextUser = applyCompletedOnboarding(user, {
      current_path: "rebuild",
      protecting_children: true,
    });

    expect(nextUser).toEqual({
      id: 1,
      onboarded: true,
      current_path: "rebuild",
      protecting_children: true,
    });
  });

  it("persists onboarding completion through the authenticated API", async () => {
    fetchWithAuth.mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue({ success: true }),
    });

    const result = await persistOnboardingCompletion({
      current_path: "rebuild",
      protecting_children: false,
    });

    expect(fetchWithAuth).toHaveBeenCalledWith("/api/onboarding/complete", {
      method: "POST",
      body: JSON.stringify({
        current_path: "rebuild",
        protecting_children: false,
      }),
    });
    expect(result).toEqual({ success: true });
  });

  it("throws when onboarding persistence fails so the UI stays on onboarding", async () => {
    fetchWithAuth.mockResolvedValue({
      ok: false,
      json: jest.fn().mockResolvedValue({
        error: "Unable to save onboarding",
      }),
    });

    await expect(
      persistOnboardingCompletion({
        current_path: "rebuild",
        protecting_children: false,
      }),
    ).rejects.toThrow("Unable to save onboarding");
  });
});
