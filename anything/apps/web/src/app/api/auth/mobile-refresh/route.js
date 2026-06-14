import sql from "@/app/api/utils/sql";
import { getSession } from "@/app/api/utils/getSession";
import {
  encodeMobileAuthToken,
  isAuthConfigurationError,
} from "@/app/api/utils/authJwt";

export async function POST(request) {
  try {
    const session = await getSession(request);

    if (!session?.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const rows = await sql`
      SELECT
        id,
        name,
        email,
        onboarded,
        current_path,
        protecting_children,
        discreet_mode,
        app_lock,
        daily_reminder,
        safety_nudges,
        subscription_tier,
        subscription_status,
        checkin_consent_given,
        safety_plan_consent_given
      FROM auth_users
      WHERE id = ${session.user.id}
      LIMIT 1
    `;

    if (rows.length === 0) {
      return Response.json({ error: "User not found" }, { status: 404 });
    }

    const user = rows[0];
    const jwt = await encodeMobileAuthToken(
      {
        sub: String(user.id),
        email: user.email,
        name: user.name,
      },
      request,
    );

    if (!jwt || typeof jwt !== "string") {
      throw new Error("Failed to refresh mobile auth token");
    }

    return Response.json({
      success: true,
      jwt,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        onboarded: user.onboarded || false,
        current_path: user.current_path,
        protecting_children: user.protecting_children,
        discreet_mode: user.discreet_mode,
        app_lock: user.app_lock,
        daily_reminder: user.daily_reminder,
        safety_nudges: user.safety_nudges,
        subscription_tier: user.subscription_tier,
        subscription_status: user.subscription_status,
        checkin_consent_given: user.checkin_consent_given || false,
        safety_plan_consent_given: user.safety_plan_consent_given || false,
      },
    });
  } catch (error) {
    console.error("Mobile refresh error:", error);

    const status = isAuthConfigurationError(error) ? 503 : 500;
    const message = isAuthConfigurationError(error)
      ? "Authentication is temporarily unavailable. Server auth secret is not configured."
      : "Internal server error";

    return Response.json({ error: message }, { status });
  }
}
