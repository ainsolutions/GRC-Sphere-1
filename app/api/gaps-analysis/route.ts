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
  async ({ tenantDb }: HttpSessionContext, request: Request) => {
    try {
      const body = await request.json();

      // Basic validation
      const required = ["assessment_id", "control_id", "gap_description"];
      for (const field of required) {
        if (!body[field]) {
          return NextResponse.json(
            { success: false, error: `${field} is required` },
            { status: 400 }
          );
        }
      }

      const created = await createGapAnalysis(tenantDb, {
        assessment_id: body.assessment_id,
        control_id: body.control_id,
        gap_description: body.gap_description,
        severity: body.severity ?? "medium",
        priority: body.priority ?? "medium",
        estimated_effort: body.estimated_effort ?? "",
        recommended_actions: body.recommended_actions ?? "",
      });

      return NextResponse.json({
        success: true,
        data: created,
        message: "Gap analysis created successfully",
      });
    } catch (err) {
      console.error("Error creating gap analysis:", err);
      return NextResponse.json(
        { success: false, error: (err as Error).message },
        { status: 500 }
      );
    }
  }
);
