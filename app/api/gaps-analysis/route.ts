import { NextResponse } from "next/server";
import { withContext, HttpSessionContext } from "@/lib/HttpContext";
import {
  getGapsAnalysis
} from "@/lib/actions/cyber-maturity-server";
import { createGapAnalysis } from "@/lib/actions/cyber-maturity-actions";

// ─── GET  /api/gaps-analysis ────────────────────────────────────────────────
// List all gap-analysis records or only those for a given assessment
export const GET = withContext(
  async ({ tenantDb }: HttpSessionContext, request: Request) => {
    try {
      const { searchParams } = new URL(request.url);
      const assessmentIdParam = searchParams.get("assessment_id");
      const assessmentId = assessmentIdParam
        ? Number(assessmentIdParam)
        : undefined;

      const rows = await getGapsAnalysis(tenantDb, assessmentId);

      return NextResponse.json({
        success: true,
        data: rows,
        count: Array.isArray(rows) ? rows.length : 0,
      });
    } catch (err) {
      console.error("Error fetching gaps analysis:", err);
      return NextResponse.json(
        { success: false, error: (err as Error).message },
        { status: 500 }
      );
    }
  }
);

// ─── POST  /api/gaps-analysis ───────────────────────────────────────────────
// Create a new gap-analysis record
export const POST = withContext(
  async ({ tenantDb }: HttpSessionContext, request) => {
    try {
      const body = await request.json();
      console.log("🧾 GAP PAYLOAD:", body);

      // ✅ Required fields validation
      const required = [
        "assessment_id",
        "control_id",
        "gap_description",
        "severity",
        "priority",
        "estimated_effort",
        "recommended_actions",
      ] as const;

      for (const field of required) {
        if (!body[field]) {
          return NextResponse.json(
            { success: false, error: `${field} is required` },
            { status: 400 }
          );
        }
      }

      // ✅ Check if assessment exists (prevents FK violation)
      const [assessmentExists] = await tenantDb`
        SELECT id FROM cybersecurity_assessments WHERE id = ${body.assessment_id}
      `;
      if (!assessmentExists) {
        return NextResponse.json(
          {
            success: false,
            error: `Assessment ID ${body.assessment_id} does not exist in this tenant's cybersecurity_assessments table.`,
          },
          { status: 400 }
        );
      }

      // ✅ Optional: check if control exists as well (safety)
      const [controlExists] = await tenantDb`
        SELECT id FROM cri_controls WHERE id = ${body.control_id}
      `;
      if (!controlExists) {
        return NextResponse.json(
          {
            success: false,
            error: `Control ID ${body.control_id} does not exist in this tenant's cri_controls table.`,
          },
          { status: 400 }
        );
      }

      // ✅ Run SQL insert query
      const result = await tenantDb`
        INSERT INTO gaps_analysis (
          assessment_id,
          control_id,
          gap_description,
          severity,
          priority,
          estimated_effort,
          recommended_actions
        ) VALUES (
          ${body.assessment_id},
          ${body.control_id},
          ${body.gap_description},
          ${body.severity},
          ${body.priority},
          ${body.estimated_effort},
          ${body.recommended_actions}
        )
        RETURNING *;
      `;

      if (!result || result.length === 0) {
        return NextResponse.json(
          { success: false, error: "Insert failed, no rows returned" },
          { status: 500 }
        );
      }

      return NextResponse.json({
        success: true,
        message: "Gap analysis created successfully",
        data: result[0],
      });
    } catch (error: any) {
      console.error("Error creating gap analysis:", error);
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }
  }
);
