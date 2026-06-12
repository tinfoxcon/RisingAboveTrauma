import sql from "@/app/api/utils/sql";
import { hash } from "argon2";
import { encode } from "@auth/core/jwt";

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, email, password } = body;

    if (!email || !password) {
      return Response.json(
        { error: "Email and password required" },
        { status: 400 },
      );
    }

    if (!name) {
      return Response.json({ error: "Name required" }, { status: 400 });
    }

    // Check if user already exists
    const existingUserRows = await sql`
      SELECT * FROM auth_users WHERE email = ${email}
    `;

    if (existingUserRows.length > 0) {
      return Response.json(
        { error: "Email already registered" },
        { status: 400 },
      );
    }

    // Create new user
    const userRows = await sql`
      INSERT INTO auth_users (name, email, "emailVerified")
      VALUES (${name}, ${email}, NULL)
      RETURNING *
    `;

    const newUser = userRows[0];

    // Hash password and create credentials account
    const hashedPassword = await hash(password);

    await sql`
      INSERT INTO auth_accounts (
        "userId",
        provider,
        type,
        "providerAccountId",
        password
      )
      VALUES (
        ${newUser.id},
        'credentials',
        'credentials',
        ${newUser.id},
        ${hashedPassword}
      )
    `;

    // Generate a real signed JWT so mobile can authenticate future API requests
    const isSecure = process.env.AUTH_URL?.startsWith("https") ?? false;
    const salt = isSecure
      ? "__Secure-authjs.session-token"
      : "authjs.session-token";
    const jwt = await encode({
      token: {
        sub: newUser.id.toString(),
        email: newUser.email,
        name: newUser.name,
      },
      secret: process.env.AUTH_SECRET,
      salt,
    });

    return Response.json({
      user: {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
        onboarded: newUser.onboarded || false,
        current_path: newUser.current_path,
        protecting_children: newUser.protecting_children,
        discreet_mode: newUser.discreet_mode,
        app_lock: newUser.app_lock,
        daily_reminder: newUser.daily_reminder,
        safety_nudges: newUser.safety_nudges,
        subscription_tier: newUser.subscription_tier,
        subscription_status: newUser.subscription_status,
        checkin_consent_given: newUser.checkin_consent_given || false,
        safety_plan_consent_given: newUser.safety_plan_consent_given || false,
      },
      jwt,
      success: true,
    });
  } catch (error) {
    console.error("Mobile signup error:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
