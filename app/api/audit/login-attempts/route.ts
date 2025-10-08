import { type NextRequest, NextResponse } from "next/server"
import { withContext } from "@/lib/HttpContext"
import { te } from "date-fns/locale";


export const GET = withContext( async ({ tenantDb }, request) => {
  try {
    const { searchParams } = new URL(request.url)
    const limit = Number.parseInt(searchParams.get("limit") || "100")
    const offset = Number.parseInt(searchParams.get("offset") || "0")
    const username = searchParams.get("username")
    const success = searchParams.get("success")
    const startDate = searchParams.get("start_date")
    const endDate = searchParams.get("end_date")

    // Build the base query
    const whereConditions = []

    if (username) {
      whereConditions.push(`username ILIKE '%${username}%'`)
    }

    if (success !== null && success !== "all" && success !== "") {
      whereConditions.push(`success = ${success === "true"}`)
    }

    if (startDate) {
      whereConditions.push(`created_at >= '${startDate}'`)
    }

    if (endDate) {
      whereConditions.push(`created_at <= '${endDate}'`)
    }

    const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(" AND ")}` : ""

    const loginAttempts = await tenantDb`
      SELECT 
        id,
        username,
        ip_address,
        user_agent,
        success,
        failure_reason,
        created_at
      FROM login_attempts
      ${whereClause ? tenantDb.unsafe(whereClause) : tenantDb``}
      ORDER BY created_at DESC 
      LIMIT ${limit} OFFSET ${offset}
    `

    return NextResponse.json({
      data: loginAttempts,
      total: Array.isArray(loginAttempts) ? loginAttempts.length : 0,
      limit,
      offset,
    })
  } catch (error) {
    console.error("Login attempts API error:", error)
    return NextResponse.json(
      {
        error: "Failed to fetch login attempts",
        data: [],
        total: 0,
      },
      { status: 500 },
    )
  }
});

export const POST = withContext( async ({ tenantDb }, request) => {
  try {
    const body = await request.json()
    const { username, ip_address, user_agent, success, failure_reason } = body

    await tenantDb`
      INSERT INTO login_attempts (username, ip_address, user_agent, success, failure_reason)
      VALUES (${username}, ${ip_address}, ${user_agent}, ${success}, ${failure_reason})
    `

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Login attempt logging error:", error)
    return NextResponse.json({ error: "Failed to log login attempt" }, { status: 500 })
  }
})
