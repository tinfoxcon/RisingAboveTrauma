import { getSession } from "@/app/api/utils/getSession";
import sql from "@/app/api/utils/sql";

export async function POST(request) {
  try {
    const session = await getSession(request);
    if (!session || !session.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;
    const apiKey = process.env.REVENUE_CAT_API_KEY;
    const projectId = "proj9c52360e";

    if (!apiKey) {
      return Response.json(
        { error: "RevenueCat API key not configured" },
        { status: 500 },
      );
    }

    // Fetch customer info from RevenueCat
    const response = await fetch(
      `https://api.revenuecat.com/v2/projects/${projectId}/customers/${encodeURIComponent(userId)}`,
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
      },
    );

    if (response.ok) {
      const data = await response.json();
      const activeEntitlements = data.customer?.entitlements || {};

      // Determine tier based on entitlements — must match RevenueCat dashboard IDs
      let tier = "free";
      let status = "inactive";

      if (
        activeEntitlements.rise_pro &&
        activeEntitlements.rise_pro.expires_at
      ) {
        const expiresAt = new Date(activeEntitlements.rise_pro.expires_at);
        if (expiresAt > new Date()) {
          tier = "rise";
          status = "active";
        }
      } else if (
        activeEntitlements.shield_pro &&
        activeEntitlements.shield_pro.expires_at
      ) {
        const expiresAt = new Date(activeEntitlements.shield_pro.expires_at);
        if (expiresAt > new Date()) {
          tier = "shield";
          status = "active";
        }
      }

      // Update database
      await sql`
        UPDATE auth_users
        SET subscription_tier = ${tier},
            subscription_status = ${status},
            last_check_subscription_status_at = NOW()
        WHERE id = ${userId}
      `;

      return Response.json({
        success: true,
        tier,
        status,
      });
    } else if (response.status === 404) {
      // Customer doesn't exist in RevenueCat yet
      await sql`
        UPDATE auth_users
        SET subscription_tier = 'free',
            subscription_status = 'inactive',
            last_check_subscription_status_at = NOW()
        WHERE id = ${userId}
      `;

      return Response.json({
        success: true,
        tier: "free",
        status: "inactive",
      });
    } else {
      throw new Error(`RevenueCat API error: ${response.status}`);
    }
  } catch (error) {
    console.error("Error syncing subscription:", error);
    return Response.json(
      { error: error.message || "Failed to sync subscription" },
      { status: 500 },
    );
  }
}
