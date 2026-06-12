import sql from "@/app/api/utils/sql";
import { getSession } from "@/app/api/utils/getSession";

export async function POST(request) {
  try {
    const session = await getSession(request);
    if (!session || !session.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const allowedFields = [
      "discreet_mode",
      "app_lock",
      "daily_reminder",
      "safety_nudges",
      "current_path",
    ];

    const setClauses = [];
    const values = [];

    Object.entries(body).forEach(([key, value]) => {
      if (allowedFields.includes(key)) {
        setClauses.push(`${key} = $${values.length + 1}`);
        values.push(value);
      }
    });

    if (setClauses.length === 0) {
      return Response.json(
        { error: "No valid fields to update" },
        { status: 400 },
      );
    }

    const query = `UPDATE auth_users SET ${setClauses.join(", ")} WHERE id = $${values.length + 1} RETURNING id`;
    await sql(query, [...values, session.user.id]);

    return Response.json({ success: true });
  } catch (error) {
    console.error("Settings update error:", error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
