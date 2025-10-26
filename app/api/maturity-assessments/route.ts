import { NextRequest, NextResponse } from "next/server";
import { withContext, HttpSessionContext } from "@/lib/HttpContext";

// ✅ Server-side (read) queries
import { getMaturityAssessments } from "@/lib/actions/cyber-maturity-server";

// ✅ Client-side (write) mutations
import {
  createMaturityAssessment,
  updateMaturityAssessment
} from "@/lib/actions/cyber-maturity-client";

/**
 * GET – List all maturity assessments (optionally filtered by assessment_id)
 */
export const GET = withContext(async ({ tenantDb }: HttpSessionContext, request) => {
  try {
    const { searchParams } = new URL(request.url);
    const assessmentId = searchParams.get("assessment_id");

    const rows = assessmentId
      ? await tenantDb`
          SELECT * FROM maturity_assessments WHERE assessment_id = ${assessmentId}
        `
      : await tenantDb`SELECT * FROM maturity_assessments`;

    return NextResponse.json({
      success: true,
      data: rows,
      count: rows.length,
    });
  } catch (err) {
    console.error("Error fetching maturity assessments:", err);
    return NextResponse.json({ success: false, error: (err as Error).message }, { status: 500 });
  }
});

/**
 * POST – Create new maturity assessment (CRI model)
 */
export const POST = withContext(async ({ tenantDb }: HttpSessionContext, request) => {
  try {
    const body = await request.json();

    const required = [
      "assessment_id",
      "control_id",
      "current_maturity_level",
      "target_maturity_level",
    ] as const;

    for (const field of required) {
      if (body[field] === undefined || body[field] === null) {
        return NextResponse.json({ success: false, error: `${field} is required` }, { status: 400 });
      }
    }

    const inserted = await tenantDb`
      INSERT INTO maturity_assessments (
        assessment_id,
        control_id,
        current_maturity_level,
        target_maturity_level,
        assessment_date,
        assessor_comments,
        evidence
      )
      VALUES (
        ${body.assessment_id},
        ${body.control_id},
        ${body.current_maturity_level},
        ${body.target_maturity_level},
        ${body.assessment_date || new Date().toISOString().split("T")[0]},
        ${body.assessor_comments || ""},
        ${body.evidence || ""}
      )
      RETURNING *;
    `;

    return NextResponse.json({
      success: true,
      message: "Maturity assessment created successfully (CRI model)",
      data: inserted[0],
    });
  } catch (err) {
    console.error("Error creating maturity assessment:", err);
    return NextResponse.json({ success: false, error: (err as Error).message }, { status: 500 });
  }
});

/**
 * PUT – Update an existing maturity assessment
 */
export const PUT = withContext(async ({ tenantDb }: HttpSessionContext, request) => {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ success: false, error: "Maturity assessment ID is required" }, { status: 400 });
    }

    const body = await request.json();

    const updated = await tenantDb`
      UPDATE maturity_assessments
      SET
        current_maturity_level = ${body.current_maturity_level},
        target_maturity_level = ${body.target_maturity_level},
        assessment_date = ${body.assessment_date},
        assessor_comments = ${body.assessor_comments},
        evidence = ${body.evidence}
      WHERE id = ${id}
      RETURNING *;
    `;

    return NextResponse.json({
      success: true,
      message: "Maturity assessment updated successfully (CRI model)",
      data: updated[0],
    });
  } catch (err) {
    console.error("Error updating maturity assessment:", err);
    return NextResponse.json({ success: false, error: (err as Error).message }, { status: 500 });
  }
});
