import sql from "@/app/api/utils/sql";
import { getSession } from "@/app/api/utils/getSession";

export async function GET(request) {
  try {
    const session = await getSession(request);
    if (!session || !session.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    // NOTE: Subscription access is enforced on the mobile client via RevenueCat.
    // No DB-level subscription check here to avoid sync mismatches causing silent failures.

    const checkins = await sql`
      SELECT *
      FROM checkins
      WHERE user_id = ${session.user.id}
      ORDER BY created_at DESC
    `;

    const totalIncidents = checkins.length;
    const highRiskCount = checkins.filter((c) => c.is_high_risk).length;

    // Calculate days documented (unique dates)
    const uniqueDates = new Set(
      checkins.map((c) => new Date(c.created_at).toDateString()),
    );
    const daysDocumented = uniqueDates.size;

    // Most frequently named person
    const names = checkins
      .map((c) => c.assailant_name)
      .filter((n) => n && n.trim().length > 0);

    const nameCounts = {};
    names.forEach((name) => {
      nameCounts[name] = (nameCounts[name] || 0) + 1;
    });

    const personNamed =
      Object.entries(nameCounts).length > 0
        ? Object.entries(nameCounts).sort((a, b) => b[1] - a[1])[0][0]
        : "Unknown";

    return Response.json({
      total_incidents: totalIncidents,
      high_risk_count: highRiskCount,
      days_documented: daysDocumented,
      person_named: personNamed,
    });
  } catch (error) {
    console.error("Evidence stats error:", error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
