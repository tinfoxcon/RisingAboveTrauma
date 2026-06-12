import sql from "@/app/api/utils/sql";
import { getSession } from "@/app/api/utils/getSession";

export async function GET(request, { params }) {
  try {
    const session = await getSession(request);
    if (!session || !session.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = parseInt(String(session.user.id), 10);
    if (!userId || isNaN(userId)) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = params;
    const entryId = parseInt(String(id), 10);
    if (!entryId || isNaN(entryId)) {
      return Response.json({ error: "Not found" }, { status: 404 });
    }

    const entries = await sql(
      `SELECT * FROM checkins WHERE id = $1 AND user_id = $2`,
      [entryId, userId],
    );

    if (entries.length === 0) {
      return Response.json({ error: "Not found" }, { status: 404 });
    }

    return Response.json({ entry: entries[0] });
  } catch (error) {
    console.error("Check-in fetch error:", error?.message || error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const session = await getSession(request);
    if (!session || !session.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = parseInt(String(session.user.id), 10);
    if (!userId || isNaN(userId)) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = params;
    const entryId = parseInt(String(id), 10);
    if (!entryId || isNaN(entryId)) {
      return Response.json({ error: "Not found" }, { status: 404 });
    }

    await sql(`DELETE FROM checkins WHERE id = $1 AND user_id = $2`, [
      entryId,
      userId,
    ]);

    return Response.json({ success: true });
  } catch (error) {
    console.error("Check-in delete error:", error?.message || error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
