import { AuditLogger, AUDIT_ACTIONS, ENTITY_TYPES } from "@/lib/audit-logger";
import { withContext } from "@/lib/HttpContext";
import { NextResponse } from "next/server";


export const GET = withContext(async ({ tenantDb, userId }, request, { params }: { params: { id: string } }) => {
  try {
    const { id } = await params;
    console.log("GET /api/threats id:", id);

    const threat = await tenantDb`
      SELECT * FROM threats WHERE id = ${id}
    `;

    if (threat.length === 0) {
      return NextResponse.json(
        { success: false, error: "Threat not found" },
        { status: 404 }
      );
    }

    await AuditLogger.log({
      userId: userId,
      userEmail: "system@company.com",
      action: AUDIT_ACTIONS.READ,
      entityType: ENTITY_TYPES.THREAT,
      entityId: id,
    }, tenantDb);

    return NextResponse.json({ success: true, data: threat[0] });
  } catch (error: any) {
    console.error("❌ GET /api/threats/[id] error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to get threat" },
      { status: 500 }
    );
  }
});

export const DELETE = withContext( async ({ tenantDb,  sessionData, userId }, request , {params}) => {
  try {
    
    const { id } = await params;
    console.log("DELETE /api/threats id:", id);

    // Check if threat exists
    const threat = await tenantDb`SELECT * FROM threats WHERE id = ${id}`;
    
    if (threat.length === 0) {
      return NextResponse.json(
        { success: false, error: "Threat not found" },
        { status: 404 }
      );
    }

   // reference check in threat_assessment
    const refs = await tenantDb`
      SELECT COUNT(*) as count FROM threat_assessments WHERE threat_id = ${id}
    `;
    if (refs[0]?.count > 0) {
      return NextResponse.json(
        { success: false, error: "Cannot delete threat as it is referenced in threat assessments" },
        { status: 400 }
      );
    }

    await tenantDb`DELETE FROM threats WHERE id = ${id}`;

    // Log audit trail
    await AuditLogger.log({
      userId: userId,
      userEmail: "threatEmailUpdate", // You might want to get actual user email
      action: AUDIT_ACTIONS.DELETE,
      entityType: ENTITY_TYPES.THREAT,
      entityId: id,
      oldValues: threat[0],
    }, tenantDb);

    return NextResponse.json({ 
      success: true, 
      message: `Threat "${threat[0].name}" deleted successfully` 
    });
  } catch (error: any) {
    console.error("❌ DELETE /api/threats error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to delete threat" },
      { status: 500 }
    );
  }
});