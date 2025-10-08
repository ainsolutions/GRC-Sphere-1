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
      FROM nesa_uae_self_assessment_controls 
      WHERE assessment_id = ${assessment_id}
    ` as Record<string, any>[]

    if (existingControls[0].count > 0) {
      return NextResponse.json({ message: "Controls already initialized for this assessment" }, { status: 200 })
    }

    // Get all NESA UAE requirements
    const requirements = await tenantDb`
      SELECT 
        id,
        domain,
        control_id,
        control_name,
        description,
        control_type,
        maturity_level,
        status,
        implementation_guidance
      FROM nesa_uae_requirements 
      WHERE status = 'active'
      ORDER BY control_id
    ` as Record<string, any>[]

    if (requirements.length === 0) {
      return NextResponse.json({ error: "No NESA UAE requirements found" }, { status: 404 })
    }

    // Initialize control assessments for each requirement
    const controlsToInsert = requirements.map((req) => ({
      assessment_id,
      requirement_id: req.id,
      control_id: req.control_id,
      control_name: req.control_name,
      domain: req.domain,
      current_maturity_level: "not-implemented",
      target_maturity_level: req.maturity_level || "intermediate",
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
          INSERT INTO nesa_uae_self_assessment_controls (
            assessment_id,
            requirement_id,
            control_id,
            control_name,
            domain,
            current_maturity_level,
            target_maturity_level,
            implementation_status,
            existing_controls,
            target_controls,
            action_owner,
            action_owner_email,
            target_completion_date,
            evidence_provided,
            gaps_identified,
            remediation_actions,
            business_justification,
            estimated_cost,
            estimated_effort_hours,
            priority,
            compliance_percentage,
            last_reviewed_date,
            next_review_date,
            reviewer_name,
            reviewer_comments,
            approval_status,
            approved_by,
            approval_date,
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
      UPDATE nesa_uae_self_assessments 
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
      INSERT INTO nesa_uae_self_assessment_audit_log (
        assessment_id,
        control_id,
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
        'Initial control setup from NESA UAE requirements',
        NOW()
      )
    `

    return NextResponse.json({
      message: "Controls initialized successfully",
      controlsCreated: insertedCount,
    })
  } catch (error) {
    console.error("Error initializing NESA UAE self assessment controls:", error)
    return NextResponse.json({ error: "Failed to initialize controls" }, { status: 500 })
  }
});
