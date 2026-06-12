import sql from "@/app/api/utils/sql";
import { getSession } from "@/app/api/utils/getSession";

export async function GET(request) {
  try {
    const session = await getSession(request);
    if (!session || !session.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const courseNumber = parseInt(searchParams.get("course"));

    const lessons = await sql`
      SELECT *
      FROM course_progress
      WHERE user_id = ${session.user.id}
        AND course_number = ${courseNumber}
      ORDER BY lesson_number ASC
    `;

    return Response.json({ lessons });
  } catch (error) {
    console.error("Course progress error:", error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
