import { type NextRequest, NextResponse } from "next/server"
import { HttpSessionContext, withContext } from "@/lib/HttpContext"
import { te } from "date-fns/locale"


export const GET = ( async ({ tenantDb }: { tenantDb: any }, request: NextRequest) => {
  try {
    const { searchParams } = new URL(request.url)
    const limit = Number.parseInt(searchParams.get("limit") || "100")
    const offset = Number.parseInt(searchParams.get("offset") || "0")

    const userSessions = await tenantDb`
      SELECT 
        id,
        user_id,
        username,
        ip_address,
        user_agent,
        last_activity,
        created_at,
        is_active
      FROM user_sessions 
      ORDER BY last_activity DESC 
      LIMIT ${limit} OFFSET ${offset}
    `

    return NextResponse.json({
      data: userSessions,
      total: userSessions.length,
      limit,
      offset,
    })
  } catch (error) {
    console.error("User sessions API error:", error)
    return NextResponse.json(
      {
        error: "Failed to fetch user sessions",
        data: [],
        total: 0,
      },
      { status: 500 },
    )
  }
});

export const POST = withContext(
  async ({ tenantDb }: HttpSessionContext, request: Request) => {
    try {
      const body = await request.json();
      const { user_id, username, ip_address, user_agent } = body;

      // ---- Validate required fields ----
      if (!user_id || !username || !ip_address || !user_agent) {
        return NextResponse.json(
          { error: "Missing required fields: user_id, username, ip_address, user_agent" },
          { status: 400 }
        );
      }

      const rawResult = await tenantDb`
        INSERT INTO user_sessions
          (user_id, username, ip_address, user_agent, is_active, last_activity)
        VALUES
          (${user_id}, ${username}, ${ip_address}, ${user_agent}, true, NOW())
        RETURNING id
      `;

      if (
        !Array.isArray(rawResult) ||
        rawResult.length === 0 ||
        typeof (rawResult as any)[0]?.id !== "number"
      ) {
        return NextResponse.json(
          { error: "Failed to create session: no valid ID returned" },
          { status: 500 }
        );
      }

      const rows = rawResult as Array<{ id: number }>;
      return NextResponse.json({ success: true, id: rows[0].id });
    } catch (error) {
      console.error("Session creation error:", error);
      return NextResponse.json({ error: "Failed to create session" }, { status: 500 });
    }
  }
);

export const DELETE = withContext( async ({ tenantDb }, request) => {
  try {
    const { searchParams } = new URL(request.url)
    const sessionId = searchParams.get("id")

    if (!sessionId) {
      return NextResponse.json({ error: "Session ID is required" }, { status: 400 })
    }

    await tenantDb`
      UPDATE user_sessions 
      SET is_active = false 
      WHERE id = ${sessionId}
    `

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Session termination error:", error)
    return NextResponse.json({ error: "Failed to terminate session" }, { status: 500 })
  }
});
