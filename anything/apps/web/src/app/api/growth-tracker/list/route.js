import sql from "@/app/api/utils/sql";
import { getSession } from "@/app/api/utils/getSession";

export async function GET(request) {
  try {
    const session = await getSession(request);
    if (!session?.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const url = new URL(request.url);
    const limit = parseInt(url.searchParams.get("limit") || "50");

    const entries = await sql`
      SELECT
        id,
        created_at,
        behaviors,
        frequency,
        feelings,
        growth_rating,
        private_notes,
        support_person
      FROM growth_tracker
      WHERE user_id = ${session.user.id}
      ORDER BY created_at DESC
      LIMIT ${limit}
    `;

    return Response.json({ entries });
  } catch (error) {
    console.error("Growth tracker list error:", error);
    return Response.json(
      { error: "Failed to fetch growth tracker entries" },
      { status: 500 },
    );
  }
}
