import { type NextRequest, NextResponse } from "next/server"
import { withContext } from "@/lib/HttpContext"



export const POST = withContext(async({ tenantDb }, request) => {
  try {
    const body = await request.json()
    const {
      assessment_id,
      requirements,
      current_maturity_level,
      existing_controls,
      document_reference,
      gap_description,
      action_plan,
      action_owner,
      priority,
      target_completion_date,
    } = body

    if (!assessment_id || !requirements || requirements.length === 0) {
      return NextResponse.json({ error: "Assessment ID and requirements are required" }, { status: 400 })
    }

    const createdGaps = []

    // Create gap analysis for each selected requirement
    for (const requirement_id of requirements) {
      const result = await tenantDb`
        INSERT INTO mica_gap_analysis (
          assessment_id,
          requirement_id,
          current_maturity_level,
          existing_controls,
          document_reference,
          gap_description,
          action_plan,
          action_owner,
          priority,
          status,
          target_completion_date,
          created_at,
          updated_at
        ) VALUES (
          ${assessment_id},
          ${requirement_id},
          ${current_maturity_level || 0},
          ${existing_controls || ""},
          ${document_reference || ""},
          ${gap_description || ""},
          ${action_plan || ""},
          ${action_owner || ""},
          ${priority || "medium"},
          'open',
          ${target_completion_date || null},
          NOW(),
          NOW()
        )
        RETURNING *
      ` as Record <string, any>[];

      if (result.length > 0) {
        createdGaps.push(result[0])
      }
    }

    return NextResponse.json({
      message: "Bulk gap analyses created successfully",
      created: createdGaps.length,
      gaps: createdGaps,
    })
  } catch (error) {
    console.error("Error creating bulk gap analyses:", error)
    return NextResponse.json({ error: "Failed to create bulk gap analyses" }, { status: 500 })
  }
});
