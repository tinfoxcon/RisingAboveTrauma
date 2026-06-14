import sql from "@/app/api/utils/sql";
import {
  getAuthTokenPair,
  isAuthConfigurationError,
} from "@/app/api/utils/authJwt";

export async function GET(request) {
  try {
    const { token, jwt } = await getAuthTokenPair(request);

    if (!jwt) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    if (!token || typeof token !== "string") {
      throw new Error("Authenticated session is missing a raw token");
    }

    // Fetch fresh user data from DB so onboarded + settings are always up to date
    let dbUser = null;
    try {
      const rows = await sql`
        SELECT onboarded, current_path, protecting_children, discreet_mode, app_lock, subscription_tier
        FROM auth_users
        WHERE id = ${jwt.sub}
        LIMIT 1
      `;
      if (rows.length > 0) {
        dbUser = rows[0];
      }
    } catch (error) {
      console.error("Failed to fetch user from DB in token route:", error);
    }

    return new Response(
      JSON.stringify({
        success: true,
        jwt: token,
        user: {
          id: jwt.sub,
          email: jwt.email,
          name: jwt.name,
          onboarded: dbUser?.onboarded ?? false,
          current_path: dbUser?.current_path ?? null,
          protecting_children: dbUser?.protecting_children ?? false,
          discreet_mode: dbUser?.discreet_mode ?? false,
          app_lock: dbUser?.app_lock ?? false,
          subscription_tier: dbUser?.subscription_tier ?? "free",
        },
      }),
      {
        headers: { "Content-Type": "application/json" },
      },
    );
  } catch (error) {
    console.error("Auth token route error:", error);

    const status = isAuthConfigurationError(error) ? 503 : 500;
    const message = isAuthConfigurationError(error)
      ? "Authentication is temporarily unavailable. Server auth secret is not configured."
      : "Internal server error";

    return new Response(JSON.stringify({ error: message }), {
      status,
      headers: { "Content-Type": "application/json" },
    });
  }
}
