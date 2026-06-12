import { getSession } from "@/app/api/utils/getSession";
import sql from "@/app/api/utils/sql";

export async function GET(request) {
  try {
    const session = await getSession(request);
    if (!session || !session.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const entries = await sql`
      SELECT 
        id,
        created_at,
        entry_type,
        what_is_happening,
        significance_rating,
        building_toward
      FROM clarity_journal_entries
      WHERE user_id = ${session.user.id}
      ORDER BY created_at DESC
    `;

    return Response.json({ entries });
  } catch (error) {
    console.error("Journal list error:", error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
