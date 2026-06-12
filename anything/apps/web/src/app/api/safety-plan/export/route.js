import sql from "@/app/api/utils/sql";
import { getSession } from "@/app/api/utils/getSession";

export async function POST(request) {
  try {
    const session = await getSession(request);
    if (!session || !session.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { planId } = body;

    let plan;

    if (planId) {
      // Get specific version
      const result = await sql`
        SELECT * FROM safety_plans
        WHERE id = ${planId}
        AND user_id = ${session.user.id}
      `;
      plan = result[0];
    } else {
      // Get current version
      const result = await sql`
        SELECT * FROM safety_plans
        WHERE user_id = ${session.user.id}
        AND is_current = true
        LIMIT 1
      `;
      plan = result[0];
    }

    if (!plan) {
      return Response.json({ error: "Plan not found" }, { status: 404 });
    }

    // Format the plan data for export
    const exportData = {
      title: "My Safety Plan",
      branding: "Rising Above Trauma",
      lastUpdated: plan.updated_at || plan.created_at,
      version: plan.version,
      steps: [
        {
          title: "Warning Signs",
          prompt: "What behaviors tell me violence might happen soon?",
          response: plan.warning_signs || "No information provided",
        },
        {
          title: "Safe People",
          prompt: "Who can I call? Who can I trust? (Names and phone numbers)",
          response: plan.safe_people || "No information provided",
        },
        {
          title: "Important Documents",
          prompt:
            "ID, birth certificates, passports, social security cards, insurance, medical records, school records",
          response: plan.important_documents || "No information provided",
        },
        {
          title: "Emergency Bag",
          prompt:
            "Clothes, money, keys, medications, chargers, important papers",
          response: plan.emergency_bag || "No information provided",
        },
        {
          title: "Safe Places",
          prompt: "Where can I go if I need to leave quickly? Exact addresses.",
          response: plan.safe_places || "No information provided",
        },
        {
          title: "Children's Safety",
          prompt: "How will I keep my children safe if I need to leave?",
          response: plan.children_safety || "No information provided",
        },
        {
          title: "Financial Safety",
          prompt: "Hidden cash, separate bank account, credit in my name",
          response: plan.financial_safety || "No information provided",
        },
        {
          title: "Legal Protection",
          prompt: "Restraining order, custody plan, legal aid contact",
          response: plan.legal_protection || "No information provided",
        },
      ],
    };

    return Response.json({ exportData });
  } catch (error) {
    console.error("Safety plan export error:", error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
