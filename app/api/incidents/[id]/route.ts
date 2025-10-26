import { NextResponse } from "next/server";
import { withContext } from "@/lib/HttpContext";
import { AuditLogger, AUDIT_ACTIONS } from "@/lib/audit-logger";

export const GET = withContext(async ({ tenantDb, userId }, request, { params }: { params: { id: string } }) => {
  try {
    const { id } = await params;
    console.log("GET /api/incidents id:", id);

    const incidents = await tenantDb`
      SELECT i.*, ia.asset_name, r.title as risk_title
      FROM incidents i
      LEFT JOIN information_assets ia ON i.related_asset_id = ia.id
      LEFT JOIN iso27001_risks r ON i.related_risk_id = r.id
      WHERE i.id = ${id}
      LIMIT 1
    `;

    if (incidents.length === 0) {
      return NextResponse.json(
        { success: false, error: "Incident not found" },
        { status: 404 }
      );
    }

    await AuditLogger.log({
      userId: userId,
      userEmail: "system@company.com",
      action: AUDIT_ACTIONS.READ,
      entityType: "INCIDENT",
      entityId: id,
    }, tenantDb);

    return NextResponse.json({ success: true, data: incidents[0] });
  } catch (error: any) {
    console.error("❌ GET /api/incidents/[id] error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to get incident" },
      { status: 500 }
    );
  }
});

export const PUT = withContext(async ({ tenantDb, userId }, request, { params }: { params: { id: string } }) => {
  try {
    const { id } = await params;
    const body = await request.json();
    console.log("PUT /api/incidents id:", id, "body:", body);

    const [updatedIncident] = await tenantDb`
      UPDATE incidents SET
        title = ${body.title},
        description = ${body.description || null},
        severity = ${body.severity || "medium"},
        status = ${body.status || "open"},
        occurred_at = ${body.occurred_at || null},
        detected_at = ${body.detected_at || null},
        related_asset_id = ${body.related_asset_id || null},
        related_risk_id = ${body.related_risk_id || null},
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ${id}
      RETURNING *
    `;

    if (!updatedIncident) {
      return NextResponse.json(
        { success: false, error: "Incident not found" },
        { status: 404 }
      );
    }

    await AuditLogger.log({
      userId: userId,
      userEmail: "system@company.com",
      action: AUDIT_ACTIONS.UPDATE,
      entityType: "INCIDENT",
      entityId: id,
      newValues: body,
    }, tenantDb);

    return NextResponse.json({ success: true, data: updatedIncident });
  } catch (error: any) {
    console.error("❌ PUT /api/incidents/[id] error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to update incident" },
      { status: 500 }
    );
  }
});

export const DELETE = withContext(async ({ tenantDb, userId }, request, { params }: { params: { id: string } }) => {
  try {
    const { id } = await params;
    console.log("DELETE /api/incidents id:", id);

    const [deletedIncident] = await tenantDb`
      DELETE FROM incidents 
      WHERE id = ${id}
      RETURNING *
    `;

    if (!deletedIncident) {
      return NextResponse.json(
        { success: false, error: "Incident not found" },
        { status: 404 }
      );
    }

    await AuditLogger.log({
      userId: userId,
      userEmail: "system@company.com",
      action: AUDIT_ACTIONS.DELETE,
      entityType: "INCIDENT",
      entityId: id,
      oldValues: deletedIncident,
    }, tenantDb);

    return NextResponse.json({ 
      success: true, 
      message: `Incident "${deletedIncident.title}" deleted successfully` 
    });
  } catch (error: any) {
    console.error("❌ DELETE /api/incidents/[id] error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to delete incident" },
      { status: 500 }
    );
  }
});