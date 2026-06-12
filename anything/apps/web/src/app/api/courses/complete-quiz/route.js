import sql from "@/app/api/utils/sql";
import { getSession } from "@/app/api/utils/getSession";

export async function POST(request) {
  try {
    const session = await getSession(request);
    if (!session || !session.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { course_number } = body;

    // Mark quiz as passed and certificate as earned for all lessons in this course
    await sql`
      INSERT INTO course_progress (user_id, course_number, lesson_number, completed, quiz_passed, certificate_earned, completed_at)
      VALUES (${session.user.id}, ${course_number}, 1, true, true, true, NOW())
      ON CONFLICT (user_id, course_number, lesson_number)
      DO UPDATE SET quiz_passed = true, certificate_earned = true
    `;

    return Response.json({ success: true });
  } catch (error) {
    console.error("Quiz completion error:", error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
