import { auth } from "@/auth";
import { decodeMobileAuthToken } from "./authJwt";

/**
 * Gets the current session from either:
 * 1. Authorization: Bearer <jwt> header (mobile app) — checked first
 * 2. Cookie-based session (web browser) — fallback
 */
export async function getSession(request) {
  try {
    // 1. Bearer token first — handles all mobile app requests
    const authHeader = request?.headers?.get?.("Authorization");
    if (authHeader?.startsWith("Bearer ")) {
      const token = authHeader.slice(7);
      if (token && token !== "authenticated") {
        try {
          const decoded = await decodeMobileAuthToken(token, request);

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
