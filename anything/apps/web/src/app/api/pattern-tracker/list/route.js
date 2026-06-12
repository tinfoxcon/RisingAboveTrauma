import { getSession } from "@/app/api/utils/getSession";
import sql from "@/app/api/utils/sql";

export async function GET(request) {
  const session = await getSession(request);
  if (!session?.user?.id) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const trackers = await sql`
      SELECT 
        id,
        created_at,
        behaviors,
        frequency,
        feelings,
        safety_rating,
        private_notes
      FROM pattern_tracker
      WHERE user_id = ${session.user.id}
      ORDER BY created_at DESC
      LIMIT 50
    `;

    return Response.json({ trackers });
  } catch (error) {
    console.error("Pattern tracker list error:", error);
    return Response.json({ error: "Failed to load trackers" }, { status: 500 });
  }
}
