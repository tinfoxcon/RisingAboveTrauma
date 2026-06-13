import { auth } from "@/auth";
import { decode } from "@auth/core/jwt";

/**
 * Try to decode a JWT token with a given salt.
 * Returns the decoded payload or null on failure.
 */
async function tryDecode(token, secret, salt) {
  try {
    const decoded = await decode({ token, secret, salt });
    return decoded || null;
  } catch {
    return null;
  }
}

/**
 * Gets the current session from either:
 * 1. Authorization: Bearer <jwt> header (mobile app) — checked first
 * 2. Cookie-based session (web browser) — fallback
 *
 * For mobile Bearer tokens, we try BOTH salt variants (secure + non-secure)
 * so tokens minted in development still work against a production server and
 * vice-versa (defensive — primary salt is always tried first).
 */
export async function getSession(request) {
  try {
    // 1. Bearer token first — handles all mobile app requests
    const authHeader = request?.headers?.get?.("Authorization");
    if (authHeader?.startsWith("Bearer ")) {
      const token = authHeader.slice(7);
      if (token && token !== "authenticated") {
        try {
          const secret = process.env.AUTH_SECRET;
          const isSecure = process.env.AUTH_URL?.startsWith("https") ?? false;

          // Primary salt — matches the environment the server is currently running in
          const primarySalt = isSecure
            ? "__Secure-authjs.session-token"
            : "authjs.session-token";
          // Fallback salt — covers tokens minted in the opposite environment
          const fallbackSalt = isSecure
            ? "authjs.session-token"
            : "__Secure-authjs.session-token";

          let decoded =
            (await tryDecode(token, secret, primarySalt)) ||
            (await tryDecode(token, secret, fallbackSalt));

          if (decoded?.sub) {
            const userId = parseInt(String(decoded.sub), 10);
            if (userId && !isNaN(userId)) {
              return {
                user: {
                  id: userId,
                  email: decoded.email,
                  name: decoded.name,
                },
              };
            }
          }

          // Token present but could not be decoded — log for diagnostics
          console.error(
            "getSession: Bearer token decode failed with both salts. " +
              "Token may be expired, tampered, or signed with a different AUTH_SECRET.",
          );
        } catch (err) {
          console.error("getSession Bearer decode error:", err?.message || err);
          // fall through to cookie auth
        }
      }
    }

    // 2. Cookie-based session — handles web browser requests
    try {
      const session = await auth();
      if (session?.user?.id) {
        const userId = parseInt(String(session.user.id), 10);
        if (userId && !isNaN(userId)) {
          return {
            user: {
              id: userId,
              email: session.user.email,
              name: session.user.name,
            },
          };
        }
        // If id can't be parsed as int, return session as-is for non-SQL paths
        return session;
      }
    } catch (err) {
      console.error("getSession cookie auth error:", err?.message || err);
    }
  } catch (err) {
    console.error("getSession unexpected error:", err?.message || err);
  }

  return null;
}
