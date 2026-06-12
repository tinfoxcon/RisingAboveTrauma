import { getSession } from "@/app/api/utils/getSession";
import sql from "@/app/api/utils/sql";

/**
 * Returns fresh user data from DB.
 * Accepts Bearer token (mobile) or cookie session (web).
 */
export async function GET(request) {
  const session = await getSession(request);

  if (!session?.user?.id) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const rows = await sql`
      SELECT 
        id, name, email,
        onboarded, current_path, protecting_children,
        discreet_mode, app_lock, subscription_tier,
        daily_reminder, safety_nudges
      FROM auth_users
      WHERE id = ${session.user.id}
      LIMIT 1
    `;

    if (rows.length === 0) {
      return Response.json({ error: "User not found" }, { status: 404 });
    }

    const user = rows[0];

    return Response.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        onboarded: user.onboarded ?? false,
        current_path: user.current_path ?? null,
        protecting_children: user.protecting_children ?? false,
        discreet_mode: user.discreet_mode ?? false,
        app_lock: user.app_lock ?? false,
        subscription_tier: user.subscription_tier ?? "free",
        daily_reminder: user.daily_reminder ?? true,
        safety_nudges: user.safety_nudges ?? true,
      },
    });
  } catch (e) {
    console.error("Failed to fetch user:", e);
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}
