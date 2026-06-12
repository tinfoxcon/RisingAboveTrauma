import sql from "@/app/api/utils/sql";
import { getSession } from "@/app/api/utils/getSession";

export async function GET(request) {
  try {
    const session = await getSession(request);
    if (!session || !session.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const days = parseInt(searchParams.get("days") || "30");

    // Get all checkins in date range
    const checkins = await sql`
      SELECT *
      FROM checkins
      WHERE user_id = ${session.user.id}
        AND created_at >= NOW() - INTERVAL '${days} days'
      ORDER BY created_at DESC
    `;

    // Calculate stats
    const totalCheckins = checkins.length;
    const highRiskCount = checkins.filter((c) => c.is_high_risk).length;

    const safetyRatings = checkins
      .map((c) => c.safety_rating)
      .filter((r) => r !== null);
    const avgSafety =
      safetyRatings.length > 0
        ? safetyRatings.reduce((a, b) => a + b, 0) / safetyRatings.length
        : 0;

    // Count behaviors
    const behaviorCounts = {};
    checkins.forEach((c) => {
      if (c.behaviors && Array.isArray(c.behaviors)) {
        c.behaviors.forEach((b) => {
          behaviorCounts[b] = (behaviorCounts[b] || 0) + 1;
        });
      }
    });

    const topBehaviors = Object.entries(behaviorCounts)
      .map(([id, count]) => ({ label: formatBehavior(id), count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    return Response.json({
      total_checkins: totalCheckins,
      high_risk_count: highRiskCount,
      avg_safety_rating: avgSafety,
      top_behaviors: topBehaviors,
      next_steps: [],
    });
  } catch (error) {
    console.error("Pattern map error:", error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

function formatBehavior(id) {
  const labels = {
    yelling: "Yelling/Screaming",
    insults: "Name-calling/Insults",
    blame: "Blaming",
    silent: "Silent treatment",
    intimidation: "Intimidation",
    monitoring: "Checking phone/location",
    isolation: "Isolation",
    jealousy: "Extreme jealousy",
    pushing: "Pushing/Shoving",
    hitting: "Hitting/Slapping",
    choking: "Choking/Strangling",
    weapon: "Weapon threats",
    sexual: "Sexual coercion",
    property: "Destroying property",
    pets: "Hurting pets",
    children: "Threatening children",
  };
  return labels[id] || id;
}
