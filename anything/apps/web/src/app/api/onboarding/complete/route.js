import sql from "@/app/api/utils/sql";
import { getSession } from "@/app/api/utils/getSession";

export async function POST(request) {
  try {
    const session = await getSession(request);
    if (!session || !session.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { current_path, protecting_children } = body;

    const result = await sql`
      UPDATE auth_users
      SET 
        current_path = ${current_path},
        protecting_children = ${protecting_children},
        onboarded = true
      WHERE id = ${session.user.id}
      RETURNING id
    `;

    if (result.length === 0) {
      return Response.json({ error: "User not found" }, { status: 404 });
    }

    return Response.json({ success: true });
  } catch (error) {
    console.error("Onboarding error:", error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
