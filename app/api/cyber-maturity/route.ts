import { NextResponse } from "next/server";
import { withContext, HttpSessionContext } from "@/lib/HttpContext";
import { getCyberMaturityAssessments } from "@/lib/actions/cyber-maturity-server"; // ✅ server-side DB call

// ──────────────────────────────────────────────────────────────
// GET  → list all cyber maturity assessments for this tenant
// POST → create a new assessment
// ──────────────────────────────────────────────────────────────

export const GET = withContext(
  async ({ tenantDb }: HttpSessionContext) => {
    try {
      const rows = await getCyberMaturityAssessments(tenantDb);
      return NextResponse.json({
        success: true,
        data: rows,
        count: Array.isArray(rows) ? rows.length : 0
      });
    } catch (err) {
      console.error("Error fetching cyber maturity assessments:", err);
      return NextResponse.json(
        { success: false, error: (err as Error).message },
        { status: 500 }
      );
    }
  }
);

export const POST = withContext(async ({ tenantDb }, request) => {
  try {
    const body = await request.json()
    const { assessment_name, assessment_date, assessor_name, department, status, description } = body

    // Insert query
    const result = await tenantDb`
      INSERT INTO cyber_maturity_assessments (
        assessment_name,
        assessment_date,
        assessor_name,
        department,
        status,
        description
      )
      VALUES (
        ${assessment_name},
        ${assessment_date},
        ${assessor_name},
        ${department},
        ${status},
        ${description}
      )
      RETURNING *
    ` as Record<string, any>[]

    return NextResponse.json(result[0])
  } catch (error) {
    console.error("Failed to create Cyber Maturity assessment:", error)
    return NextResponse.json({ error: "Failed to create Cyber Maturity assessment" }, { status: 500 })
  }
})