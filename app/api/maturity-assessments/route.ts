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
 * GET – list maturity assessments
 * Optional query param ?assessment_id=<number> to filter by a single assessment
 */
export const GET = withContext(
  async ({ tenantDb }: HttpSessionContext, request) => {
    try {
      const { searchParams } = new URL(request.url);
      const assessmentIdParam = searchParams.get("assessment_id");
      const assessmentId = assessmentIdParam ? Number(assessmentIdParam) : undefined;

      const rows = await getMaturityAssessments(tenantDb, assessmentId);

      return NextResponse.json({
        success: true,
        data: rows,
        count: rows.length,
      });
    } catch (err) {
      console.error("Error fetching maturity assessments:", err);
      return NextResponse.json(
        { success: false, error: (err as Error).message },
        { status: 500 }
      );
    }
  }
);

/**
 * POST – create a new maturity assessment
 */
export const POST = withContext(
  async ({ tenantDb }: HttpSessionContext, request) => {
    try {
      const body = await request.json();

      // ✅ Validate required fields
      const required = ["assessment_id", "control_id", "maturity_level"] as const;
      for (const field of required) {
        if (!body[field]) {
          return NextResponse.json(
            { success: false, error: `${field} is required` },
            { status: 400 }
          );
        }
      }

      const newRow = await createMaturityAssessment(tenantDb, {
        assessment_id: body.assessment_id,
        control_id: body.control_id,
        maturity_level: body.maturity_level,
        comments: body.comments ?? ""
      });

      return NextResponse.json({
        success: true,
        data: newRow,
        message: "Maturity assessment created successfully",
      });
    } catch (err) {
      console.error("Error creating maturity assessment:", err);
      return NextResponse.json(
        { success: false, error: (err as Error).message },
        { status: 500 }
      );
    }
  }
);

/**
 * PUT – update an existing maturity assessment
 * Requires query param ?id=<number>
 */
export const PUT = withContext(
  async ({ tenantDb }: HttpSessionContext, request) => {
    try {
      const { searchParams } = new URL(request.url);
      const idParam = searchParams.get("id");
      const id = idParam ? Number(idParam) : NaN;

      if (!idParam || isNaN(id)) {
        return NextResponse.json(
          { success: false, error: "Valid maturity assessment ID is required" },
          { status: 400 }
        );
      }

      const body = await request.json();

      const updated = await updateMaturityAssessment(tenantDb, id, {
        maturity_level: body.maturity_level,
        comments: body.comments,
      });

      return NextResponse.json({
        success: true,
        data: updated,
        message: "Maturity assessment updated successfully",
      });
    } catch (err) {
      console.error("Error updating maturity assessment:", err);
      return NextResponse.json(
        { success: false, error: (err as Error).message },
        { status: 500 }
      );
    }
  }
);
