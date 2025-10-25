import { NextResponse } from "next/server";
import { withContext } from "@/lib/HttpContext";
import { AuditLogger, AUDIT_ACTIONS } from "@/lib/audit-logger";

export const PUT = withContext(async ({ tenantDb, userId }, request, { params }: { params: { id: string } }) => {
  try {
    const { id } = await params;
    const body = await request.json();
    console.log("PUT /api/users id:", id, "body:", body);

    // Validate required fields
    const requiredFields = ["first_name", "last_name", "username", "email", "organization_id"];
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { success: false, error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }

    const [updatedUser] = await tenantDb`
      UPDATE users SET
        first_name = ${body.first_name},
        last_name = ${body.last_name},
        username = ${body.username},
        email = ${body.email},
        phone = ${body.phone || null},
        organization_id = ${body.organization_id},
        department_id = ${body.department_id || null},
        job_title = ${body.job_title || null},
        status = ${body.status || "Active"},
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ${id}
      RETURNING *
    `;

    if (!updatedUser) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    await AuditLogger.log({
      userId: userId,
      userEmail: "system@company.com",
      action: AUDIT_ACTIONS.UPDATE,
      entityType: "USER",
      entityId: id,
      newValues: body,
    }, tenantDb);

    return NextResponse.json({ success: true, data: updatedUser });
  } catch (error: any) {
    console.error("❌ PUT /api/users error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to update user" },
      { status: 500 }
    );
  }
});

export const DELETE = withContext(async ({ tenantDb, userId }, request, { params }: { params: { id: string } }) => {
  try {
    const { id } = await params;
    console.log("DELETE /api/users id:", id);

    // Check if user exists
    const existingUser = await tenantDb`
      SELECT * FROM users WHERE id = ${id}
    `;

    if (existingUser.length === 0) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    // Delete the user
    await tenantDb`
      DELETE FROM users WHERE id = ${id}
    `;

    await AuditLogger.log({
      userId: userId,
      userEmail: "system@company.com",
      action: AUDIT_ACTIONS.DELETE,
      entityType: "USER",
      entityId: id,
      oldValues: existingUser[0],
    }, tenantDb);

    return NextResponse.json({ 
      success: true, 
      message: `User "${existingUser[0].first_name} ${existingUser[0].last_name}" deleted successfully` 
    });
  } catch (error: any) {
    console.error("❌ DELETE /api/users error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to delete user" },
      { status: 500 }
    );
  }
});