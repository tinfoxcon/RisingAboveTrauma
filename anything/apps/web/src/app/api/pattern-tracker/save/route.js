import { getSession } from "@/app/api/utils/getSession";
import sql from "@/app/api/utils/sql";

export async function POST(request) {
  const session = await getSession(request);
  if (!session?.user?.id) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
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

    const result = await sql`
      INSERT INTO pattern_tracker (
        user_id,
        behaviors,
        frequency,
        feelings,
        safety_rating,
        private_notes,
        assailant_name,
        assailant_relationship
      ) VALUES (
        ${session.user.id},
        ${behaviors || []},
        ${frequency || null},
        ${feelings || []},
        ${safety_rating || null},
        ${private_notes || null},
        ${assailant_name || null},
        ${assailant_relationship || null}
      )
      RETURNING id
    `;

    return Response.json({
      success: true,
      id: result[0].id,
    });
  } catch (error) {
    console.error("Pattern tracker save error:", error);
    return Response.json({ error: "Failed to save tracker" }, { status: 500 });
  }
}
