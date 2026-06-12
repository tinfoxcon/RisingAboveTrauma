import sql from "@/app/api/utils/sql";
import { getSession } from "@/app/api/utils/getSession";

export async function POST(request) {
  try {
    const session = await getSession(request);
    if (!session || !session.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { course_number, lesson_number } = body;

    await sql`
      INSERT INTO course_progress (user_id, course_number, lesson_number, completed, completed_at)
      VALUES (${session.user.id}, ${course_number}, ${lesson_number}, true, NOW())
      ON CONFLICT (user_id, course_number, lesson_number)
      DO UPDATE SET completed = true, completed_at = NOW()
    `;

    return Response.json({ success: true });
  } catch (error) {
    console.error("Lesson completion error:", error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
