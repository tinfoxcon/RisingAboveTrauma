import sql from "@/app/api/utils/sql";
import { getSession } from "@/app/api/utils/getSession";

export async function GET(request) {
  try {
    const session = await getSession(request);
    if (!session || !session.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    // NOTE: Subscription access is enforced on the mobile client via RevenueCat.
    // No DB-level subscription check here — the DB tier and RevenueCat can be out of
    // sync (e.g. dev paywall toggle off, fresh purchase not yet synced), which would
    // cause 403s for valid subscribers.

    const { searchParams } = new URL(request.url);
    const dateFilter = searchParams.get("dateFilter") || "all";

    // Calculate date threshold
    let dateThreshold = null;
    const now = new Date();
    if (dateFilter === "30days") {
      dateThreshold = new Date(now.setDate(now.getDate() - 30));
    } else if (dateFilter === "90days") {
      dateThreshold = new Date(now.setDate(now.getDate() - 90));
    } else if (dateFilter === "6months") {
      dateThreshold = new Date(now.setMonth(now.getMonth() - 6));
    }

    // Get user info
    const userInfo = await sql`
      SELECT name, email FROM auth_users WHERE id = ${session.user.id}
    `;

    // Get all check-ins
    const checkins = dateThreshold
      ? await sql`
          SELECT * FROM checkins
          WHERE user_id = ${session.user.id}
            AND created_at >= ${dateThreshold.toISOString()}
          ORDER BY created_at DESC
        `
      : await sql`
          SELECT * FROM checkins
          WHERE user_id = ${session.user.id}
          ORDER BY created_at DESC
        `;

    // Get all pattern tracker entries
    const patternTrackers = dateThreshold
      ? await sql`
          SELECT * FROM pattern_tracker
          WHERE user_id = ${session.user.id}
            AND created_at >= ${dateThreshold.toISOString()}
          ORDER BY created_at DESC
        `
      : await sql`
          SELECT * FROM pattern_tracker
          WHERE user_id = ${session.user.id}
          ORDER BY created_at DESC
        `;

    // Get safety plan
    const safetyPlan = await sql`
      SELECT * FROM safety_plans
      WHERE user_id = ${session.user.id}
      ORDER BY updated_at DESC
      LIMIT 1
    `;

    return Response.json({
      user: {
        name: userInfo[0]?.name || "Unknown",
        email: userInfo[0]?.email || "",
      },
      dateFilter,
      dateRange: {
        start: dateThreshold ? dateThreshold.toISOString() : null,
        end: new Date().toISOString(),
      },
      checkins,
      patternTrackers,
      safetyPlan: safetyPlan[0] || null,
      exportedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Evidence export error:", error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
