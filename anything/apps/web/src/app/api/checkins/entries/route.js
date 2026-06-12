import sql from "@/app/api/utils/sql";
import { getSession } from "@/app/api/utils/getSession";

export async function GET(request) {
  try {
    const session = await getSession(request);
    if (!session || !session.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = parseInt(String(session.user.id), 10);
    if (!userId || isNaN(userId)) {
      console.error(
        "checkins/entries: invalid userId from session",
        session.user.id,
      );
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const entries = await sql(
      `SELECT 
        id,
        created_at,
        what_happened,
        behaviors,
        safety_rating,
        notes,
        assailant_name,
        assailant_relationship,
        is_high_risk,
        needs_next
      FROM checkins
      WHERE user_id = $1
      ORDER BY created_at DESC`,
      [userId],
    );

    return Response.json({ entries });
  } catch (error) {
    console.error("Check-ins entries error:", error?.message || error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
