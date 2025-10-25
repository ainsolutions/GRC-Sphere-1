import { NextResponse } from "next/server";
import { withContext } from "@/lib/HttpContext";

// GET - Fetch single SWIFT assessment
export const GET = withContext(async ({ tenantDb }, request, { params }: { params: { id: string } }) => {
  try {
    const result = await tenantDb`
      SELECT * FROM swift_assessments WHERE id = ${params.id}
    ` as Record<string, any>[];

    if (result.length === 0) {
      return NextResponse.json({ success: false, error: "Assessment not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: result[0] });
  } catch (error) {
    console.error("Error fetching SWIFT assessment:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch SWIFT assessment" },
      { status: 500 }
    );
  }
});

// PUT - Update SWIFT assessment
export const PUT = withContext(async ({ tenantDb }, request, { params }: { params: { id: string } }) => {
  try {
    const body = await request.json();

    const result = await tenantDb`
      UPDATE swift_assessments SET
        assessment_name = ${body.assessment_name},
        scope = ${body.scope || ''},
        status = ${body.status},
        assets = ${JSON.stringify(body.assets || [])},
        attestation_status = ${body.attestation_status || 'Pending'},
        updated_at = NOW()
      WHERE id = ${params.id}
      RETURNING *
    ` as Record<string, any>[];

    if (result.length === 0) {
      return NextResponse.json({ success: false, error: "Assessment not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: result[0] });
  } catch (error) {
    console.error("Error updating SWIFT assessment:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update SWIFT assessment" },
      { status: 500 }
    );
  }
});

// DELETE - Delete SWIFT assessment
export const DELETE = withContext(async ({ tenantDb }, request, { params }: { params: { id: string } }) => {
  try {
    await tenantDb`
      DELETE FROM swift_assessments WHERE id = ${params.id}
    `;

    return NextResponse.json({ success: true, message: "Assessment deleted successfully" });
  } catch (error) {
    console.error("Error deleting SWIFT assessment:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete SWIFT assessment" },
      { status: 500 }
    );
  }
});

