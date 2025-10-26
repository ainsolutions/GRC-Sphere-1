import { NextResponse } from "next/server";
import { withContext } from "@/lib/HttpContext";
import { AuditLogger, AUDIT_ACTIONS } from "@/lib/audit-logger";
import { db } from "@/lib/db";

export const GET = withContext(async ({ tenantDb, schemaId }, request) => {
  try {
    const { searchParams } = new URL(request.url);
    const organizationId = searchParams.get("organization_id");
    const departmentId = searchParams.get("department_id");
    const searchTerm = searchParams.get("search");

    // Search for owners
    if (searchTerm) {
      const users = await db`
        SELECT u.* 
        FROM users u
        WHERE u.schemaid = ${schemaId}
        AND (u.username ILIKE ${`%${searchTerm}%`}
          OR u.email ILIKE ${`%${searchTerm}%`}
          OR u.first_name ILIKE ${`%${searchTerm}%`}
          OR u.last_name ILIKE ${`%${searchTerm}%`})
          AND u.status = 'Active'
        ORDER BY u.created_at DESC
      `;
      return NextResponse.json({ success: true, data: users });
    }

    // Get users with filters
    let users;
    if (organizationId && departmentId) {
      users = await tenantDb`
        SELECT u.*, 
               o.name as organization_name,
               d.name as department_name
        FROM users u
        LEFT JOIN organizations o ON u.organization_id = o.id
        LEFT JOIN departments d ON u.department_id = d.id
        WHERE u.organization_id = ${organizationId} AND u.department_id = ${departmentId}
        ORDER BY u.created_at DESC
      `;
    } else if (organizationId) {
      users = await tenantDb`
        SELECT u.*, 
               o.name as organization_name,
               d.name as department_name
        FROM users u
        LEFT JOIN organizations o ON u.organization_id = o.id
        LEFT JOIN departments d ON u.department_id = d.id
        WHERE u.organization_id = ${organizationId}
        ORDER BY u.created_at DESC
      `;
    } else {
      users = await tenantDb`
        SELECT u.*, 
               o.name as organization_name,
               d.name as department_name
        FROM users u
        LEFT JOIN organizations o ON u.organization_id = o.id
        LEFT JOIN departments d ON u.department_id = d.id
        ORDER BY u.created_at DESC
      `;
    }

    return NextResponse.json({ success: true, data: users });
  } catch (error: any) {
    console.error("❌ GET /api/users error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to get users" },
      { status: 500 }
    );
  }
});

export const POST = withContext(async ({ tenantDb, userId }, request) => {
  try {
    const body = await request.json();
    console.log("POST /api/users body:", body);

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

    const [newUser] = await tenantDb`
      INSERT INTO users (
        first_name, last_name, username, email, phone, 
        organization_id, department_id, job_title, status
      ) VALUES (
        ${body.first_name}, ${body.last_name}, ${body.username}, 
        ${body.email}, ${body.phone || null}, ${body.organization_id},
        ${body.department_id || null}, ${body.job_title || null}, 
        ${body.status || "Active"}
      )
      RETURNING *
    `;

    await AuditLogger.log({
      userId: userId,
      userEmail: "system@company.com",
      action: AUDIT_ACTIONS.CREATE,
      entityType: "USER",
      entityId: newUser.id.toString(),
      newValues: body,
    }, tenantDb);

    return NextResponse.json({ success: true, data: newUser });
  } catch (error: any) {
    console.error("❌ POST /api/users error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to create user" },
      { status: 500 }
    );
  }
});