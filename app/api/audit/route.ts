import { type NextRequest, NextResponse } from "next/server"
import { AuditLogger } from "@/lib/audit-logger"
import { getAuditContext } from "@/lib/audit-middleware"
import { withContext } from "@/lib/HttpContext"

export const POST = withContext(async ({ tenantDb }, request) => {
  try {
    const body = await request.json()
    const context = getAuditContext(request as NextRequest)

    // Get user info from headers (in production, this would come from JWT/session)
    const userId = request.headers.get("x-user-id") || "anonymous"
    const userEmail = request.headers.get("x-user-email") || "anonymous@example.com"

    await AuditLogger.log(tenantDb, {
      userId,
      userEmail,
      action: body.action,
      entityType: body.entityType,
      entityId: body.entityId,
      oldValues: body.oldValues,
      newValues: body.newValues,
      ipAddress: context.ipAddress,
      userAgent: context.userAgent,
      sessionId: context.sessionId,
      additionalContext: body.additionalContext,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Audit API error:", error)
    // Return success even if logging fails to not break the main application
    return NextResponse.json({
      success: true,
      warning: "Audit logging may not be fully functional",
    })
  }
});

export const GET = withContext( async ({ tenantDb }, request) => {
  try {
    const { searchParams } = new URL(request.url)

    const filters = {
      userId: searchParams.get("userId") || undefined,
      entityType: searchParams.get("entityType") || undefined,
      action: searchParams.get("action") || undefined,
      startDate: searchParams.get("startDate") ? new Date(searchParams.get("startDate")!) : undefined,
      endDate: searchParams.get("endDate") ? new Date(searchParams.get("endDate")!) : undefined,
      limit: searchParams.get("limit") ? Number.parseInt(searchParams.get("limit")!) : 100,
      offset: searchParams.get("offset") ? Number.parseInt(searchParams.get("offset")!) : 0,
    }

    const logs = await AuditLogger.getAuditLogs(tenantDb,filters)
    return NextResponse.json({ logs })
  } catch (error) {
    console.error("Audit API error:", error)
    // Return empty logs array instead of error to not break the UI
    return NextResponse.json({
      logs: [],
      warning: "Unable to retrieve audit logs. Database may not be configured.",
    })
  }
})
