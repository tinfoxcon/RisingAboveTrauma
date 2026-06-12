import sql from "@/app/api/utils/sql";
import { getSession } from "@/app/api/utils/getSession";

export async function DELETE(request, { params }) {
  try {
    const session = await getSession(request);
    if (!session || !session.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = params;

    await sql`
      DELETE FROM clarity_journal_entries
      WHERE id = ${id} AND user_id = ${session.user.id}
    `;

    return Response.json({ success: true });
  } catch (error) {
    console.error("Journal entry delete error:", error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
