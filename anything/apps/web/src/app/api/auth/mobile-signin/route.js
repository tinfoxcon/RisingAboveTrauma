import sql from "@/app/api/utils/sql";
import { verify } from "argon2";
import { encodeMobileAuthToken } from "@/app/api/utils/authJwt";

export async function POST(request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return Response.json(
        { error: "Email and password required" },
        { status: 400 },
      );
    }

    // Get user by email
    const userRows = await sql`
      SELECT * FROM auth_users WHERE email = ${email}
    `;

    if (userRows.length === 0) {
      return Response.json(
        { error: "Invalid email or password" },
        { status: 401 },
      );
    }

    const user = userRows[0];

    // Get credentials account for this user
    const accountRows = await sql`
      SELECT * FROM auth_accounts 
      WHERE "userId" = ${user.id} AND provider = 'credentials'
    `;

    if (accountRows.length === 0 || !accountRows[0].password) {
      return Response.json(
        { error: "Invalid email or password" },
        { status: 401 },
      );
    }

    // Verify password
    const isValid = await verify(accountRows[0].password, password);

    if (!isValid) {
      return Response.json(
        { error: "Invalid email or password" },
        { status: 401 },
      );
    }

    const jwt = await encodeMobileAuthToken(
      { sub: user.id.toString(), email: user.email, name: user.name },
      request,
    );

    if (!jwt || typeof jwt !== "string") {
      throw new Error("Failed to issue mobile auth token");
    }

    return Response.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        onboarded: user.onboarded || false,
        current_path: user.current_path,
        protecting_children: user.protecting_children,
        discreet_mode: user.discreet_mode,
        app_lock: user.app_lock,
        daily_reminder: user.daily_reminder,
        safety_nudges: user.safety_nudges,
        subscription_tier: user.subscription_tier,
        subscription_status: user.subscription_status,
        checkin_consent_given: user.checkin_consent_given || false,
        safety_plan_consent_given: user.safety_plan_consent_given || false,
      },
      jwt,
      success: true,
    });
  } catch (error) {
    console.error("Mobile signin error:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
