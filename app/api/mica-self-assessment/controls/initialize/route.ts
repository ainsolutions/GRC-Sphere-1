import { type NextRequest, NextResponse } from "next/server"
import { withContext } from "@/lib/HttpContext"


export const POST = withContext(async({ tenantDb }, request) => {
  try {
    const body = await request.json()
    const { assessment_id, created_by } = body

    if (!assessment_id) {
      return NextResponse.json({ error: "Assessment ID is required" }, { status: 400 })
    }

    // Check if controls are already initialized
    const existingControls = await tenantDb`
      SELECT COUNT(*) as count 
      FROM mica_self_assessment_controls 
      WHERE mica_assessment_id = ${assessment_id}
    ` as Record<string, number>[]

    if (existingControls[0].count > 0) {
      return NextResponse.json({ message: "Controls already initialized for this assessment" }, { status: 200 })
    }

    // Get all MICA requirements
    const requirements = await tenantDb`
      SELECT 
        id,
        mica_domain,
        mica_control_id,
        mica_control_name,
        mica_description,
        mica_control_type,
        mica_maturity_level,
        mica_status,
        mica_implementation_guidance
      FROM mica_requirements 
      ORDER BY mica_control_id
    ` as Record<string, any>[]

    if (requirements.length === 0) {
      return NextResponse.json({ error: "No MICA requirements found" }, { status: 404 })
    }

    // Initialize control assessments for each requirement
    const controlsToInsert = requirements.map((req) => ({
      assessment_id,
      requirement_id: req.id,
      control_id: req.control_id,
      control_name: req.control_name,
      domain: req.domain,
      current_maturity_level: "not-implemented",
      target_maturity_level: req.maturity_level?.toLowerCase() || "intermediate",
      implementation_status: "not-implemented",
      existing_controls: "",
      target_controls: req.implementation_guidance || "",
      action_owner: "",
      action_owner_email: "",
      target_completion_date: null,
      evidence_provided: "",
      gaps_identified: "",
      remediation_actions: "",
      business_justification: "",
      estimated_cost: 0,
      estimated_effort_hours: 0,
      priority: "medium",
      compliance_percentage: 0,
      last_reviewed_date: null,
      next_review_date: null,
      reviewer_name: "",
      reviewer_comments: "",
      approval_status: "pending",
      approved_by: "",
      approval_date: null,
      created_by: created_by || "System",
    }))

    // Insert controls in batches to avoid query size limits
    const batchSize = 50
    let insertedCount = 0

    for (let i = 0; i < controlsToInsert.length; i += batchSize) {
      const batch = controlsToInsert.slice(i, i + batchSize)

      for (const control of batch) {
        await tenantDb`
          INSERT INTO mica_self_assessment_controls (
            mica_assessment_id,
            mica_requirement_id,
            mica_control_id,
            mica_control_name,
            mica_domain,
            mica_current_maturity_level,
            mica_target_maturity_level,
            mica_implementation_status,
            mica_existing_controls,
            mica_target_controls,
            mica_action_owner,
            mica_action_owner_email,
            mica_target_completion_date,
            mica_evidence_provided,
            mica_gaps_identified,
            mica_remediation_actions,
            mica_business_justification,
            mica_estimated_cost,
            mica_estimated_effort_hours,
            mica_priority,
            mica_compliance_percentage,
            mica_last_reviewed_date,
            mica_next_review_date,
            mica_reviewer_name,
            mica_reviewer_comments,
            mica_approval_status,
            mica_approved_by,
            mica_approval_date,
            created_by,
            created_at,
            updated_at
          ) VALUES (
            ${control.assessment_id},
            ${control.requirement_id},
            ${control.control_id},
            ${control.control_name},
            ${control.domain},
            ${control.current_maturity_level},
            ${control.target_maturity_level},
            ${control.implementation_status},
            ${control.existing_controls},
            ${control.target_controls},
            ${control.action_owner},
            ${control.action_owner_email},
            ${control.target_completion_date},
            ${control.evidence_provided},
            ${control.gaps_identified},
            ${control.remediation_actions},
            ${control.business_justification},
            ${control.estimated_cost},
            ${control.estimated_effort_hours},
            ${control.priority},
            ${control.compliance_percentage},
            ${control.last_reviewed_date},
            ${control.next_review_date},
            ${control.reviewer_name},
            ${control.reviewer_comments},
            ${control.approval_status},
            ${control.approved_by},
            ${control.approval_date},
            ${control.created_by},
            NOW(),
            NOW()
          )
        `
        insertedCount++
      }
    }

    // Update assessment statistics
    await tenantDb`
      UPDATE mica_self_assessments 
      SET 
        total_controls = ${insertedCount},
        implemented_controls = 0,
        partially_implemented_controls = 0,
        not_implemented_controls = ${insertedCount},
        not_applicable_controls = 0,
        high_priority_gaps = 0,
        medium_priority_gaps = ${insertedCount},
        low_priority_gaps = 0,
        compliance_percentage = 0,
        overall_maturity_score = 1,
        updated_at = NOW()
      WHERE id = ${assessment_id}
    `

    // Log the initialization
    await tenantDb`
      INSERT INTO mica_self_assessment_audit_log (
        mica_assessment_id,
         action_type,
        field_changed,
        old_value,
        new_value,
        changed_by,
        change_reason,
        timestamp
      ) VALUES (
        ${assessment_id},
        'SYSTEM',
        'INITIALIZE',
        'Controls Initialization',
        '0',
        ${insertedCount.toString()},
        ${created_by || "System"},
        'Initial control setup from MICA requirements',
        NOW()
      )
    `

    return NextResponse.json({
      message: "Controls initialized successfully",
      controlsCreated: insertedCount,
    })
  } catch (error) {
    console.error("Error initializing MICA self assessment controls:", error)
    return NextResponse.json({ error: "Failed to initialize controls" }, { status: 500 })
  }
});
