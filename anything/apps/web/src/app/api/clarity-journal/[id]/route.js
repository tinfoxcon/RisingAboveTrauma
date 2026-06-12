import { getSession } from "@/app/api/utils/getSession";
import sql from "@/app/api/utils/sql";

export async function GET(request, { params }) {
  try {
    const session = await getSession(request);
    if (!session || !session.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = params;

    const entries = await sql`
      SELECT *
      FROM clarity_journal_entries
      WHERE id = ${id} AND user_id = ${session.user.id}
    `;

    if (entries.length === 0) {
      return Response.json({ error: "Not found" }, { status: 404 });
    }

    return Response.json({ entry: entries[0] });
  } catch (error) {
    console.error("Journal entry fetch error:", error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
