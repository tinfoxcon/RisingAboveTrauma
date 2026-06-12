import sql from "@/app/api/utils/sql";
import { getSession } from "@/app/api/utils/getSession";

export async function GET(request) {
  try {
    const session = await getSession(request);
    if (!session || !session.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const result = await sql`
      SELECT * FROM safety_plans
      WHERE user_id = ${session.user.id}
      AND is_current = true
      LIMIT 1
    `;

    return Response.json({ plan: result[0] || null });
  } catch (error) {
    console.error("Safety plan fetch error:", error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
