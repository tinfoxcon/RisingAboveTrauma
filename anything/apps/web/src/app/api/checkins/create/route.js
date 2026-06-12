import sql from "@/app/api/utils/sql";
import { getSession } from "@/app/api/utils/getSession";

export async function POST(request) {
  try {
    const session = await getSession(request);
    if (!session || !session.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const {
      what_happened,
      behaviors,
      assailant_name,
      assailant_relationship,
      safety_rating,
      needs_next,
      notes,
    } = body;

    // Check if behaviors include high-risk markers
    const dangerBehaviors = ["pushing", "hitting", "choking", "weapon"];
    const hasHighRisk =
      behaviors && behaviors.some((b) => dangerBehaviors.includes(b));

    const result = await sql`
      INSERT INTO checkins (
        user_id,
        what_happened,
        behaviors,
        assailant_name,
        assailant_relationship,
        safety_rating,
        needs_next,
        notes,
        is_high_risk
      ) VALUES (
        ${session.user.id},
        ${what_happened},
        ${behaviors},
        ${assailant_name || null},
        ${assailant_relationship || null},
        ${safety_rating || null},
        ${needs_next || null},
        ${notes || null},
        ${hasHighRisk}
      )
      RETURNING id, created_at
    `;

    return Response.json({
      success: true,
      checkin: result[0],
    });
  } catch (error) {
    console.error("Check-in creation error:", error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
