import { type NextRequest, NextResponse } from "next/server"
import { withContext } from "@/lib/HttpContext"


export const GET = withContext(async({ tenantDb }, request) => {
  try {
    const { searchParams } = new URL(request.url)
    const assessmentId = searchParams.get("assessment_id")
    const status = searchParams.get("status")
    const priority = searchParams.get("priority")
    const assignedTo = searchParams.get("assigned_to")

    // Check if the table exists first
    const tableExists = await tenantDb`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'nesa_uae_remediation_actions'
      )
    ` as Record<string, boolean>[]

    if (!tableExists[0].exists) {
      console.log("NESA UAE remediation actions table does not exist, returning empty array")
      return NextResponse.json([])
    }

    // Build the query using template literals instead of sql.unsafe
    let result
    
    if (assessmentId && status && priority && assignedTo) {
      // All filters
      result = await tenantDb`
        SELECT 
          ra.*,
          na.assessment_name,
          na.critical_infrastructure_type,
          nr.control_name,
          nr.domain,
          CASE 
            WHEN ra.target_completion_date < CURRENT_DATE AND ra.remediation_status NOT IN ('Completed', 'Closed') THEN 'Overdue'
            WHEN ra.target_completion_date <= CURRENT_DATE + INTERVAL '7 days' AND ra.remediation_status NOT IN ('Completed', 'Closed') THEN 'Due Soon'
            ELSE 'On Track'
          END as timeline_status
        FROM nesa_uae_remediation_actions ra
        LEFT JOIN nesa_uae_assessments na ON ra.assessment_id = na.id
        LEFT JOIN nesa_uae_requirements nr ON ra.requirement_id = nr.id
        WHERE ra.assessment_id = ${Number.parseInt(assessmentId)}
          AND ra.remediation_status = ${status}
          AND ra.remediation_priority = ${priority}
          AND ra.assigned_to ILIKE ${`%${assignedTo}%`}
        ORDER BY 
          CASE ra.remediation_priority 
            WHEN 'Critical' THEN 1 
            WHEN 'High' THEN 2 
            WHEN 'Medium' THEN 3 
            WHEN 'Low' THEN 4 
          END,
          ra.target_completion_date ASC,
          ra.created_at DESC
      `
    } else if (assessmentId && status && priority) {
      // Assessment, status, priority filters
      result = await tenantDb`
        SELECT 
          ra.*,
          na.assessment_name,
          na.critical_infrastructure_type,
          nr.control_name,
          nr.domain,
          CASE 
            WHEN ra.target_completion_date < CURRENT_DATE AND ra.remediation_status NOT IN ('Completed', 'Closed') THEN 'Overdue'
            WHEN ra.target_completion_date <= CURRENT_DATE + INTERVAL '7 days' AND ra.remediation_status NOT IN ('Completed', 'Closed') THEN 'Due Soon'
            ELSE 'On Track'
          END as timeline_status
        FROM nesa_uae_remediation_actions ra
        LEFT JOIN nesa_uae_assessments na ON ra.assessment_id = na.id
        LEFT JOIN nesa_uae_requirements nr ON ra.requirement_id = nr.id
        WHERE ra.assessment_id = ${Number.parseInt(assessmentId)}
          AND ra.remediation_status = ${status}
          AND ra.remediation_priority = ${priority}
        ORDER BY 
          CASE ra.remediation_priority 
            WHEN 'Critical' THEN 1 
            WHEN 'High' THEN 2 
            WHEN 'Medium' THEN 3 
            WHEN 'Low' THEN 4 
          END,
          ra.target_completion_date ASC,
          ra.created_at DESC
      `
    } else if (assessmentId && status) {
      // Assessment and status filters
      result = await tenantDb`
        SELECT 
          ra.*,
          na.assessment_name,
          na.critical_infrastructure_type,
          nr.control_name,
          nr.domain,
          CASE 
            WHEN ra.target_completion_date < CURRENT_DATE AND ra.remediation_status NOT IN ('Completed', 'Closed') THEN 'Overdue'
            WHEN ra.target_completion_date <= CURRENT_DATE + INTERVAL '7 days' AND ra.remediation_status NOT IN ('Completed', 'Closed') THEN 'Due Soon'
            ELSE 'On Track'
          END as timeline_status
        FROM nesa_uae_remediation_actions ra
        LEFT JOIN nesa_uae_assessments na ON ra.assessment_id = na.id
        LEFT JOIN nesa_uae_requirements nr ON ra.requirement_id = nr.id
        WHERE ra.assessment_id = ${Number.parseInt(assessmentId)}
          AND ra.remediation_status = ${status}
        ORDER BY 
          CASE ra.remediation_priority 
            WHEN 'Critical' THEN 1 
            WHEN 'High' THEN 2 
            WHEN 'Medium' THEN 3 
            WHEN 'Low' THEN 4 
          END,
          ra.target_completion_date ASC,
          ra.created_at DESC
      `
    } else if (assessmentId) {
      // Assessment filter only
      result = await tenantDb`
        SELECT 
          ra.*,
          na.assessment_name,
          na.critical_infrastructure_type,
          nr.control_name,
          nr.domain,
          CASE 
            WHEN ra.target_completion_date < CURRENT_DATE AND ra.remediation_status NOT IN ('Completed', 'Closed') THEN 'Overdue'
            WHEN ra.target_completion_date <= CURRENT_DATE + INTERVAL '7 days' AND ra.remediation_status NOT IN ('Completed', 'Closed') THEN 'Due Soon'
            ELSE 'On Track'
          END as timeline_status
        FROM nesa_uae_remediation_actions ra
        LEFT JOIN nesa_uae_assessments na ON ra.assessment_id = na.id
        LEFT JOIN nesa_uae_requirements nr ON ra.requirement_id = nr.id
        WHERE ra.assessment_id = ${Number.parseInt(assessmentId)}
        ORDER BY 
          CASE ra.remediation_priority 
            WHEN 'Critical' THEN 1 
            WHEN 'High' THEN 2 
            WHEN 'Medium' THEN 3 
            WHEN 'Low' THEN 4 
          END,
          ra.target_completion_date ASC,
          ra.created_at DESC
      `
    } else {
      // No filters - get all
      result = await tenantDb`
        SELECT 
          ra.*,
          na.assessment_name,
          na.critical_infrastructure_type,
          nr.control_name,
          nr.domain,
          CASE 
            WHEN ra.target_completion_date < CURRENT_DATE AND ra.remediation_status NOT IN ('Completed', 'Closed') THEN 'Overdue'
            WHEN ra.target_completion_date <= CURRENT_DATE + INTERVAL '7 days' AND ra.remediation_status NOT IN ('Completed', 'Closed') THEN 'Due Soon'
            ELSE 'On Track'
          END as timeline_status
        FROM nesa_uae_remediation_actions ra
        LEFT JOIN nesa_uae_assessments na ON ra.assessment_id = na.id
        LEFT JOIN nesa_uae_requirements nr ON ra.requirement_id = nr.id
        ORDER BY 
          CASE ra.remediation_priority 
            WHEN 'Critical' THEN 1 
            WHEN 'High' THEN 2 
            WHEN 'Medium' THEN 3 
            WHEN 'Low' THEN 4 
          END,
          ra.target_completion_date ASC,
          ra.created_at DESC
      `
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error("Error fetching NESA UAE remediation actions:", error)
    return NextResponse.json({ error: "Failed to fetch remediation actions" }, { status: 500 })
  }
});

export const POST = withContext(async({ tenantDb }, request) => {
  try {
    const body = await request.json()
    const {
      assessment_id,
      requirement_id,
      finding_id,
      finding_title,
      finding_description,
      finding_severity,
      finding_category,
      remediation_action,
      remediation_priority,
      remediation_status,
      remediation_type,
      assigned_to,
      assigned_department,
      responsible_manager,
      target_completion_date,
      actual_completion_date,
      actual_cost,
      estimated_effort_hours,
      estimated_cost,
      evidence_required,
      risk_before_remediation,
      risk_after_remediation,
      business_impact,
      requires_approval,
      verification_method,
      created_by,
    } = body

    if (!assessment_id || !finding_id || !finding_title || !remediation_action) {
      return NextResponse.json(
        { error: "Assessment ID, finding ID, finding title, and remediation action are required" },
        { status: 400 },
      )
    }

    const result = await tenantDb`
      INSERT INTO nesa_uae_remediation_actions (
        assessment_id,
        requirement_id,
        finding_id,
        finding_title,
        finding_description,
        finding_severity,
        finding_category,
        remediation_action,
        remediation_priority,
        remediation_type,
        assigned_to,
        assigned_department,
        responsible_manager,
        target_completion_date,
        estimated_effort_hours,
        estimated_cost,
        evidence_required,
        risk_before_remediation,
        risk_after_remediation,
        business_impact,
        requires_approval,
        verification_method,
        created_by
      ) VALUES (
        ${assessment_id},
        ${requirement_id || null},
        ${finding_id},
        ${finding_title},
        ${finding_description || ""},
        ${finding_severity || "Medium"},
        ${finding_category || "Technical"},
        ${remediation_action},
        ${remediation_priority || "Medium"},
        ${remediation_type || "Short-term"},
        ${assigned_to || ""},
        ${assigned_department || ""},
        ${responsible_manager || ""},
        ${target_completion_date || null},
        ${estimated_effort_hours || 0},
        ${estimated_cost || 0},
        ${evidence_required || ""},
        ${risk_before_remediation || "Medium"},
        ${risk_after_remediation || "Low"},
        ${business_impact || ""},
        ${requires_approval || false},
        ${verification_method || ""},
        ${created_by || "System"}
      )
      RETURNING *
    ` as Record<string, any>[]

    // Log the creation
    await tenantDb`
      INSERT INTO nesa_uae_remediation_updates (
        remediation_action_id,
        update_type,
        update_description,
        new_status,
        new_progress,
        update_by
      ) VALUES (
        ${result[0].id},
        'Status Change',
        'Remediation action created',
        'Open',
        0,
        ${created_by || "System"}
      )
    `

    return NextResponse.json(result[0], { status: 201 })
  } catch (error) {
    console.error("Error creating NESA UAE remediation action:", error)
    return NextResponse.json({ error: "Failed to create remediation action" }, { status: 500 })
  }
});

export const PUT = withContext(async({ tenantDb }, request) => {
  try {
    const body = await request.json()
    const {
      id,
      remediation_status,
      progress_percentage,
      assigned_to,
      assigned_department,
      responsible_manager,
      target_completion_date,
      actual_completion_date,
      estimated_effort_hours,
      actual_effort_hours,
      estimated_cost,
      actual_cost,
      evidence_provided,
      verification_status,
      verification_comments,
      updated_by,
      update_comment,
    } = body

    if (!id) {
      return NextResponse.json({ error: "Remediation action ID is required" }, { status: 400 })
    }

    // Get current values for logging
    const current = await tenantDb`
      SELECT remediation_status, progress_percentage 
      FROM nesa_uae_remediation_actions 
      WHERE id = ${id}
    ` as Record<string, any>[]

    if (current.length === 0) {
      return NextResponse.json({ error: "Remediation action not found" }, { status: 404 })
    }

    const result = await tenantDb`
      UPDATE nesa_uae_remediation_actions 
      SET 
        remediation_status = COALESCE(${remediation_status}, remediation_status),
        progress_percentage = COALESCE(${progress_percentage}, progress_percentage),
        assigned_to = COALESCE(${assigned_to}, assigned_to),
        assigned_department = COALESCE(${assigned_department}, assigned_department),
        responsible_manager = COALESCE(${responsible_manager}, responsible_manager),
        target_completion_date = COALESCE(${target_completion_date}, target_completion_date),
        actual_completion_date = COALESCE(${actual_completion_date}, actual_completion_date),
        estimated_effort_hours = COALESCE(${estimated_effort_hours}, estimated_effort_hours),
        actual_effort_hours = COALESCE(${actual_effort_hours}, actual_effort_hours),
        estimated_cost = COALESCE(${estimated_cost}, estimated_cost),
        actual_cost = COALESCE(${actual_cost}, actual_cost),
        evidence_provided = COALESCE(${evidence_provided}, evidence_provided),
        verification_status = COALESCE(${verification_status}, verification_status),
        verification_comments = COALESCE(${verification_comments}, verification_comments),
        last_update_date = CURRENT_DATE,
        updated_by = ${updated_by || "System"},
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ${id}
      RETURNING *
    ` as Record<string, any>[]

    // Log the update
    const updateType =
      remediation_status && remediation_status !== current[0].remediation_status ? "Status Change" : "Progress Update"

    await tenantDb`
      INSERT INTO nesa_uae_remediation_updates (
        remediation_action_id,
        update_type,
        update_description,
        previous_status,
        new_status,
        previous_progress,
        new_progress,
        update_by
      ) VALUES (
        ${id},
        ${updateType},
        ${update_comment || "Remediation action updated"},
        ${current[0].remediation_status},
        ${remediation_status || current[0].remediation_status},
        ${current[0].progress_percentage},
        ${progress_percentage || current[0].progress_percentage},
        ${updated_by || "System"}
      )
    `

    return NextResponse.json(result[0])
  } catch (error) {
    console.error("Error updating NESA UAE remediation action:", error)
    return NextResponse.json({ error: "Failed to update remediation action" }, { status: 500 })
  }
});

export const DELETE = withContext(async({ tenantDb }, request) => {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json({ error: "Remediation action ID is required" }, { status: 400 })
    }

    const result = await tenantDb`
      DELETE FROM nesa_uae_remediation_actions 
      WHERE id = ${id}
      RETURNING id
    ` as Record<string, any>[]

    if (result.length === 0) {
      return NextResponse.json({ error: "Remediation action not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "Remediation action deleted successfully" })
  } catch (error) {
    console.error("Error deleting NESA UAE remediation action:", error)
    return NextResponse.json({ error: "Failed to delete remediation action" }, { status: 500 })
  }
});
