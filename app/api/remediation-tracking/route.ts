import { type NextRequest, NextResponse } from "next/server"
import { withContext } from "@/lib/HttpContext"
import { getRemediationTracking, createRemediationTracking,
  updateRemediationTracking } from "@/lib/actions/cyber-maturity-server"

/**
 * GET – list remediation tracking rows
 * Optional query param ?gap_id=<number> to filter by gap
 */
export const GET = withContext(
  async ({ tenantDb }, request) => {
    try {
      const { searchParams } = new URL(request.url);
      const gapIdParam = searchParams.get("gap_id");
      const gapId = gapIdParam ? Number(gapIdParam) : undefined;

      const rows = await getRemediationTracking(tenantDb, gapId);

      return NextResponse.json({
        success: true,
        data: rows,
        count: Array.isArray(rows) ? rows.length : 0,
      });
    } catch (err) {
      console.error("Error fetching remediation tracking:", err);
      return NextResponse.json(
        { success: false, error: (err as Error).message },
        { status: 500 }
      );
    }
  }
);

/**
 * POST – create a new remediation tracking record
 */
export const POST = withContext(
  async ({ tenantDb }, request) => {
    try {
      const body = await request.json();

      // Validate required fields
      const required = ["gap_id", "remediation_plan", "assigned_to", "due_date"] as const;
      for (const field of required) {
        if (!body[field]) {
          return NextResponse.json(
            { success: false, error: `${field} is required` },
            { status: 400 }
          );
        }
      }

      const newRow = await createRemediationTracking(tenantDb, {
        gap_id: body.gap_id,
        remediation_plan: body.remediation_plan,
        assigned_to: body.assigned_to,
        due_date: body.due_date,
        status: body.status ?? "not_started",
        notes: body.notes ?? "",
      });

      return NextResponse.json({
        success: true,
        data: newRow,
        message: "Remediation tracking created successfully",
      });
    } catch (err) {
      console.error("Error creating remediation tracking:", err);
      return NextResponse.json(
        { success: false, error: (err as Error).message },
        { status: 500 }
      );
    }
  }
);

/**
 * PUT – update an existing remediation tracking record
 * Requires query param ?id=<number>
 */
export const PUT = withContext(async ({ tenantDb }, request, { params }) => {
  try {
    const id = parseInt(params.id);
    if (!id) {
      return NextResponse.json({ success: false, error: "Invalid ID" }, { status: 400 });
    }

    const body = await request.json();

    // ✅ Build dynamic SQL safely
    const fields = Object.keys(body);
    if (fields.length === 0) {
      return NextResponse.json({ success: false, error: "No fields to update" }, { status: 400 });
    }

    const updates = fields.map(
      (key, idx) => `${key} = $${idx + 1}`
    ).join(", ");

    const values = fields.map((key) => body[key]);
    values.push(id);

    const query = `
      UPDATE remediation_tracking
      SET ${updates}
      WHERE id = $${values.length}
      RETURNING *;
    `;

    const result = await tenantDb.unsafe(query, values);

    if (!result || result.length === 0) {
      return NextResponse.json({ success: false, error: "Remediation not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: "Remediation updated successfully",
      data: result[0],
    });
  } catch (error) {
    console.error("Error updating remediation:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update remediation" },
      { status: 500 }
    );
  }
});

export const DELETE = withContext(async ({ tenantDb }, request, { params }) => {
  try {
    const id = parseInt(params.id);
    if (!id) {
      return NextResponse.json({ success: false, error: "Invalid ID" }, { status: 400 });
    }

    const result = await tenantDb`DELETE FROM remediation_tracking WHERE id = ${id} RETURNING *`;

    if (result.length === 0) {
      return NextResponse.json({ success: false, error: "Remediation not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Remediation deleted successfully" });
  } catch (error) {
    console.error("Error deleting remediation:", error);
    return NextResponse.json({ success: false, error: "Failed to delete remediation" }, { status: 500 });
  }
});