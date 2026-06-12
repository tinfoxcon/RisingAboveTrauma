import sql from "@/app/api/utils/sql";
import { getSession } from "@/app/api/utils/getSession";

export async function POST(request) {
  try {
    const session = await getSession(request);
    if (!session || !session.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const {
      warning_signs,
      safe_people,
      important_documents,
      emergency_bag,
      safe_places,
      children_safety,
      financial_safety,
      legal_protection,
    } = body;

    // Get current version number
    const currentPlan = await sql`
      SELECT version FROM safety_plans 
      WHERE user_id = ${session.user.id} 
      AND is_current = true
      LIMIT 1
    `;

    const newVersion = currentPlan.length > 0 ? currentPlan[0].version + 1 : 1;

    // Mark all existing plans as not current
    await sql`
      UPDATE safety_plans
      SET is_current = false
      WHERE user_id = ${session.user.id}
    `;

    // Insert new version
    await sql`
      INSERT INTO safety_plans (
        user_id,
        warning_signs,
        safe_people,
        important_documents,
        emergency_bag,
        safe_places,
        children_safety,
        financial_safety,
        legal_protection,
        version,
        is_current,
        created_at,
        updated_at
      ) VALUES (
        ${session.user.id},
        ${warning_signs || null},
        ${safe_people || null},
        ${important_documents || null},
        ${emergency_bag || null},
        ${safe_places || null},
        ${children_safety || null},
        ${financial_safety || null},
        ${legal_protection || null},
        ${newVersion},
        true,
        NOW(),
        NOW()
      )
    `;

    return Response.json({ success: true, version: newVersion });
  } catch (error) {
    console.error("Safety plan update error:", error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
