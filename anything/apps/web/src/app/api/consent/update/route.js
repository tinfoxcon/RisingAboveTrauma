import { getSession } from "@/app/api/utils/getSession";
import sql from "@/app/api/utils/sql";

export async function POST(request) {
  try {
    const session = await getSession(request);
    if (!session?.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { consentType } = body;

    if (!consentType || !["checkin", "safety_plan"].includes(consentType)) {
      return Response.json({ error: "Invalid consent type" }, { status: 400 });
    }

    if (consentType === "checkin") {
      await sql`
        UPDATE auth_users 
        SET checkin_consent_given = true 
        WHERE id = ${session.user.id}
      `;
    } else {
      await sql`
        UPDATE auth_users 
        SET safety_plan_consent_given = true 
        WHERE id = ${session.user.id}
      `;
    }

    return Response.json({ success: true });
  } catch (error) {
    console.error("Consent update error:", error);
    return Response.json(
      { error: "Failed to update consent" },
      { status: 500 },
    );
  }
}
