import { getToken } from "@auth/core/jwt";
import sql from "@/app/api/utils/sql";

export async function GET(request) {
  const isSecure =
    process.env.AUTH_URL?.startsWith("https") ??
    request.url?.startsWith("https") ??
    false;
  const [token, jwt] = await Promise.all([
    getToken({
      req: request,
      secret: process.env.AUTH_SECRET,
      secureCookie: isSecure,
      raw: true,
    }),
    getToken({
      req: request,
      secret: process.env.AUTH_SECRET,
      secureCookie: isSecure,
    }),
  ]);

  if (!jwt) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
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
  } catch (e) {
    console.error("Failed to fetch user from DB in token route:", e);
  }

  return new Response(
    JSON.stringify({
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
}
