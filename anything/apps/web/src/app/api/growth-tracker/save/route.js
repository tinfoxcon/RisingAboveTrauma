import sql from "@/app/api/utils/sql";
import { getSession } from "@/app/api/utils/getSession";

export async function POST(request) {
  try {
    const session = await getSession(request);
    if (!session?.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const {
      behaviors,
      frequency,
      feelings,
      growth_rating,
      private_notes,
      support_person,
    } = await request.json();

    // Insert growth tracker entry
    await sql`
      INSERT INTO growth_tracker (
        user_id,
        behaviors,
        frequency,
        feelings,
        growth_rating,
        private_notes,
        support_person,
        created_at
      ) VALUES (
        ${session.user.id},
        ${behaviors || []},
        ${frequency || null},
        ${feelings || []},
        ${growth_rating || null},
        ${private_notes || null},
        ${support_person || null},
        NOW()
      )
    `;

    return Response.json({ success: true });
  } catch (error) {
    console.error("Growth tracker save error:", error);
    return Response.json(
      { error: "Failed to save growth tracker" },
      { status: 500 },
    );
  }
}
