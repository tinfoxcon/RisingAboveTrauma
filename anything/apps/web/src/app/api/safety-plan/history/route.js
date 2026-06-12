import sql from "@/app/api/utils/sql";
import { getSession } from "@/app/api/utils/getSession";

export async function GET(request) {
  try {
    const session = await getSession(request);
    if (!session || !session.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const history = await sql`
      SELECT 
        id,
        version,
        warning_signs,
        safe_people,
        important_documents,
        emergency_bag,
        safe_places,
        children_safety,
        financial_safety,
        legal_protection,
        created_at,
        updated_at,
        is_current
      FROM safety_plans
      WHERE user_id = ${session.user.id}
      ORDER BY created_at DESC
    `;

    return Response.json({ history });
  } catch (error) {
    console.error("Safety plan history fetch error:", error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
