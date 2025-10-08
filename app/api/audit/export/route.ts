import { type NextRequest, NextResponse } from "next/server"
import { withContext } from "@/lib/HttpContext"


export const GET = withContext( async ({ tenantDb }, request) => {
  try {
    const { searchParams } = new URL(request.url)
    const user = searchParams.get("user")
    const action = searchParams.get("action")
    const entityType = searchParams.get("entity_type")
    const success = searchParams.get("success")
    const dateFrom = searchParams.get("date_from")
    const dateTo = searchParams.get("date_to")
    const search = searchParams.get("search")

    // Build where conditions
    const whereConditions = []

    if (user) {
      whereConditions.push(`u.username ILIKE '%${user}%'`)
    }

    if (action && action !== "all") {
      whereConditions.push(`al.action = '${action}'`)
    }

    if (entityType && entityType !== "all") {
      whereConditions.push(`al.entity_type = '${entityType}'`)
    }

    if (success && success !== "all") {
      whereConditions.push(`al.success = ${success === "true"}`)
    }

    if (dateFrom) {
      whereConditions.push(`al.created_at >= '${dateFrom}'`)
    }

    if (dateTo) {
      whereConditions.push(`al.created_at <= '${dateTo}'`)
    }

    if (search) {
      whereConditions.push(
        `(u.username ILIKE '%${search}%' OR al.action ILIKE '%${search}%' OR al.entity_type ILIKE '%${search}%')`,
      )
    }

    const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(" AND ")}` : ""

    const auditLogs = (await tenantDb` 
      SELECT 
        al.id,
        u.username,
        al.action,
        al.entity_type,
        al.entity_id,
        al.ip_address,
        al.success,
        al.created_at
      FROM audit_logs al
      LEFT JOIN users u ON al.user_id = u.id
      ${whereClause ? tenantDb.unsafe(whereClause) : tenantDb``}
      ORDER BY al.created_at DESC
    `as Record<string, any>[]
  )

    // Convert to CSV
    const csvHeaders = ["ID", "Username", "Action", "Entity Type", "Entity ID", "IP Address", "Success", "Timestamp"]

    const csvRows = auditLogs.map((log) => [
      log.id,
      log.username || "Unknown",
      log.action,
      log.entity_type,
      log.entity_id || "",
      log.ip_address || "",
      log.success ? "Success" : "Failed",
      new Date(log.created_at).toISOString(),
    ])

    const csvContent = [csvHeaders.join(","), ...csvRows.map((row) => row.map((field) => `"${field}"`).join(","))].join(
      "\n",
    )

    return new NextResponse(csvContent, {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": `attachment; filename="audit-logs-${new Date().toISOString().split("T")[0]}.csv"`,
      },
    })
  } catch (error) {
    console.error("Export error:", error)
    return NextResponse.json({ error: "Failed to export audit logs" }, { status: 500 })
  }
})
