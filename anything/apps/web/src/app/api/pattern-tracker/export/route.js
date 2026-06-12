import sql from "@/app/api/utils/sql";
import { getSession } from "@/app/api/utils/getSession";

export async function GET(request) {
  try {
    const session = await getSession(request);
    if (!session || !session.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const dateFilter = searchParams.get("dateFilter") || "all";

    // Calculate date threshold - create new Date objects to avoid mutation
    let dateThreshold = null;
    const now = new Date();

    if (dateFilter === "30days") {
      dateThreshold = new Date();
      dateThreshold.setDate(dateThreshold.getDate() - 30);
    } else if (dateFilter === "60days") {
      dateThreshold = new Date();
      dateThreshold.setDate(dateThreshold.getDate() - 60);
    } else if (dateFilter === "90days") {
      dateThreshold = new Date();
      dateThreshold.setDate(dateThreshold.getDate() - 90);
    } else if (dateFilter === "6months") {
      dateThreshold = new Date();
      dateThreshold.setMonth(dateThreshold.getMonth() - 6);
    }

    // Get user info
    const userInfo = await sql`
      SELECT name, email FROM auth_users WHERE id = ${session.user.id}
    `;

    // Get all pattern tracker entries with all fields
    const patternTrackers = dateThreshold
      ? await sql`
          SELECT 
            id,
            user_id,
            created_at,
            behaviors,
            frequency,
            feelings,
            safety_rating,
            private_notes,
            assailant_name,
            assailant_relationship
          FROM pattern_tracker
          WHERE user_id = ${session.user.id}
            AND created_at >= ${dateThreshold.toISOString()}
          ORDER BY created_at DESC
        `
      : await sql`
          SELECT 
            id,
            user_id,
            created_at,
            behaviors,
            frequency,
            feelings,
            safety_rating,
            private_notes,
            assailant_name,
            assailant_relationship
          FROM pattern_tracker
          WHERE user_id = ${session.user.id}
          ORDER BY created_at DESC
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
      patternTrackers,
      exportedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Pattern tracker export error:", error);
    return Response.json(
      {
        error: "Internal Server Error",
        message: error.message,
      },
      { status: 500 },
    );
  }
}
