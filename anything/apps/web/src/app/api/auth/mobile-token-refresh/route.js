import { encode, decode } from "@auth/core/jwt";
import sql from "@/app/api/utils/sql";

/**
 * POST /api/auth/mobile-token-refresh
 *
 * Accepts an existing (non-expired) mobile JWT in the Authorization: Bearer header
 * and issues a fresh JWT with a new 30-day expiry.
 *
 * This allows the mobile app to silently refresh tokens before they expire
 * without requiring the user to sign in again.
 */
export async function POST(request) {
  try {
    const authHeader = request.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return Response.json({ error: "No token provided" }, { status: 401 });
    }

    const token = authHeader.slice(7);
    const secret = process.env.AUTH_SECRET;
    const isSecure = process.env.AUTH_URL?.startsWith("https") ?? false;

    const primarySalt = isSecure
      ? "__Secure-authjs.session-token"
      : "authjs.session-token";
    const fallbackSalt = isSecure
      ? "authjs.session-token"
      : "__Secure-authjs.session-token";

    // Try to decode with both salt variants
    let decoded = null;
    try {
      decoded = await decode({ token, secret, salt: primarySalt });
    } catch {}
    if (!decoded?.sub) {
      try {
        decoded = await decode({ token, secret, salt: fallbackSalt });
      } catch {}
    }

    if (!decoded?.sub) {
      return Response.json(
        { error: "Invalid or expired token" },
        { status: 401 },
      );
    }

    const userId = parseInt(String(decoded.sub), 10);
    if (!userId || isNaN(userId)) {
      return Response.json({ error: "Invalid token subject" }, { status: 401 });
    }

    // Verify user still exists in the database
    const userRows = await sql`
      SELECT id, email, name, onboarded, current_path, protecting_children,
             discreet_mode, app_lock, daily_reminder, safety_nudges,
             subscription_tier, subscription_status,
             checkin_consent_given, safety_plan_consent_given
      FROM auth_users
      WHERE id = ${userId}
      LIMIT 1
    `;

    if (userRows.length === 0) {
      return Response.json({ error: "User not found" }, { status: 401 });
    }

    const user = userRows[0];

    // Mint a fresh JWT with a new 30-day expiry
    const newJwt = await encode({
      token: {
        sub: user.id.toString(),
        email: user.email,
        name: user.name,
      },
      secret,
      salt: primarySalt,
      maxAge: 30 * 24 * 60 * 60, // 30 days
    });

    return Response.json({
      jwt: newJwt,
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
      success: true,
    });
  } catch (error) {
    console.error("Token refresh error:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
