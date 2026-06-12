import sql from "@/app/api/utils/sql";
import { getSession } from "@/app/api/utils/getSession";

export async function GET(request, { params }) {
  try {
    const session = await getSession(request);
    if (!session || !session.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = params;

    // Handle routing conflict: dynamic [id] sometimes catches /list
    if (id === "list") {
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
    }

    const numericId = parseInt(id, 10);
    if (isNaN(numericId)) {
      return Response.json({ error: "Not found" }, { status: 404 });
    }

    const entries = await sql`
      SELECT *
      FROM growth_tracker
      WHERE id = ${numericId} AND user_id = ${session.user.id}
    `;

    if (entries.length === 0) {
      return Response.json({ error: "Not found" }, { status: 404 });
    }

    return Response.json({ entry: entries[0] });
  } catch (error) {
    console.error("Growth tracker fetch error:", error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const session = await getSession(request);
    if (!session || !session.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = params;
    const numericId = parseInt(id, 10);
    if (isNaN(numericId)) {
      return Response.json({ error: "Not found" }, { status: 404 });
    }

    await sql`
      DELETE FROM growth_tracker
      WHERE id = ${numericId} AND user_id = ${session.user.id}
    `;

    return Response.json({ success: true });
  } catch (error) {
    console.error("Growth tracker delete error:", error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
