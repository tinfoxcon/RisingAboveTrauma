import { getSession } from "@/app/api/utils/getSession";
import sql from "@/app/api/utils/sql";

export async function GET(request, { params }) {
  const session = await getSession(request);
  if (!session?.user?.id) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }
  const user = session.user;

  try {
    const { id } = params;

    // Routing conflict guard: dynamic [id] sometimes catches /list
    if (id === "list") {
      const url = new URL(request.url);
      const limit = parseInt(url.searchParams.get("limit") || "50");
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
        WHERE user_id = ${user.id}
        ORDER BY created_at DESC
        LIMIT ${limit}
      `;
      return Response.json({ trackers });
    }

    const numericId = parseInt(id, 10);
    if (isNaN(numericId)) {
      return Response.json({ error: "Not found" }, { status: 404 });
    }

    const tracker = await sql`
      SELECT * FROM pattern_tracker
      WHERE id = ${numericId} AND user_id = ${user.id}
    `;
    if (tracker.length === 0) {
      return Response.json({ error: "Not found" }, { status: 404 });
    }
    return Response.json({ tracker: tracker[0] });
  } catch (error) {
    console.error("Pattern tracker get error:", error);
    return Response.json({ error: "Failed to load tracker" }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  const session = await getSession(request);
  if (!session?.user?.id) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }
  const user = session.user;

  try {
    const { id } = params;
    const numericId = parseInt(id, 10);
    if (isNaN(numericId)) {
      return Response.json({ error: "Not found" }, { status: 404 });
    }

    const body = await request.json();
    const {
      behaviors,
      frequency,
      feelings,
      safety_rating,
      private_notes,
      assailant_name,
      assailant_relationship,
    } = body;

    const existing = await sql`
      SELECT id FROM pattern_tracker WHERE id = ${numericId} AND user_id = ${user.id}
    `;
    if (existing.length === 0) {
      return Response.json({ error: "Not found" }, { status: 404 });
    }

    await sql`
      UPDATE pattern_tracker SET
        behaviors = ${behaviors || []},
        frequency = ${frequency || null},
        feelings = ${feelings || []},
        safety_rating = ${safety_rating || null},
        private_notes = ${private_notes || null},
        assailant_name = ${assailant_name || null},
        assailant_relationship = ${assailant_relationship || null}
      WHERE id = ${numericId} AND user_id = ${user.id}
    `;
    return Response.json({ success: true });
  } catch (error) {
    console.error("Pattern tracker update error:", error);
    return Response.json(
      { error: "Failed to update tracker" },
      { status: 500 },
    );
  }
}

export async function DELETE(request, { params }) {
  const session = await getSession(request);
  if (!session?.user?.id) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }
  const user = session.user;

  try {
    const { id } = params;
    const numericId = parseInt(id, 10);
    if (isNaN(numericId)) {
      return Response.json({ error: "Not found" }, { status: 404 });
    }

    const result = await sql`
      DELETE FROM pattern_tracker WHERE id = ${numericId} AND user_id = ${user.id} RETURNING id
    `;
    if (result.length === 0) {
      return Response.json({ error: "Not found" }, { status: 404 });
    }
    return Response.json({ success: true });
  } catch (error) {
    console.error("Pattern tracker delete error:", error);
    return Response.json(
      { error: "Failed to delete tracker" },
      { status: 500 },
    );
  }
}
