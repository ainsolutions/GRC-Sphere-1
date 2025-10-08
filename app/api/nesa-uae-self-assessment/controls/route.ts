import { type NextRequest, NextResponse } from "next/server"
import { withContext } from "@/lib/HttpContext"


export const GET = withContext(async({ tenantDb }, request) => {
  try {
    const { searchParams } = new URL(request.url)
    const assessmentId = searchParams.get("assessment_id")

    if (!assessmentId) {
      return NextResponse.json({ error: "Assessment ID is required" }, { status: 400 })
    }

    const controls = await tenantDb`
      SELECT 
        id,
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
        created_at,
        updated_at
      FROM nesa_uae_self_assessment_controls 
      WHERE assessment_id = ${assessmentId}
      ORDER BY control_id
    `

    return NextResponse.json(controls)
  } catch (error) {
    console.error("Failed to fetch NESA UAE self assessment controls:", error)
    return NextResponse.json({ error: "Failed to fetch assessment controls" }, { status: 500 })
  }
});

export const PUT = withContext(async({ tenantDb }, request) => {
  try {
    const body = await request.json()
    const {
      id,
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
      updated_by,
      change_reason,
    } = body

    // Get the current control data for audit logging
    const currentControl = await tenantDb`
      SELECT * FROM nesa_uae_self_assessment_controls WHERE id = ${id}
    ` as Record<string, any>[]

    if (currentControl.length === 0) {
      return NextResponse.json({ error: "Control not found" }, { status: 404 })
    }

    const oldControl = currentControl[0]

    // Update the control
    const result = await tenantDb`
      UPDATE nesa_uae_self_assessment_controls 
      SET 
        current_maturity_level = ${current_maturity_level},
        target_maturity_level = ${target_maturity_level},
        implementation_status = ${implementation_status},
        existing_controls = ${existing_controls},
        target_controls = ${target_controls},
        action_owner = ${action_owner},
        action_owner_email = ${action_owner_email},
        target_completion_date = ${target_completion_date || null},
        evidence_provided = ${evidence_provided},
        gaps_identified = ${gaps_identified},
        remediation_actions = ${remediation_actions},
        business_justification = ${business_justification},
        estimated_cost = ${estimated_cost || 0},
        estimated_effort_hours = ${estimated_effort_hours || 0},
        priority = ${priority},
        compliance_percentage = ${compliance_percentage || 0},
        last_reviewed_date = NOW(),
        updated_by = ${updated_by || "System"},
        updated_at = NOW()
      WHERE id = ${id}
      RETURNING *
    ` as Record<string, any>[]

    const updatedControl = result[0]

    // Create audit log entries for changed fields
    const auditEntries = []
    const fieldsToTrack = {
      current_maturity_level: "Current Maturity Level",
      target_maturity_level: "Target Maturity Level",
      implementation_status: "Implementation Status",
      existing_controls: "Existing Controls",
      target_controls: "Target Controls",
      action_owner: "Action Owner",
      action_owner_email: "Action Owner Email",
      target_completion_date: "Target Completion Date",
      evidence_provided: "Evidence Provided",
      gaps_identified: "Gaps Identified",
      remediation_actions: "Remediation Actions",
      business_justification: "Business Justification",
      estimated_cost: "Estimated Cost",
      estimated_effort_hours: "Estimated Effort Hours",
      priority: "Priority",
      compliance_percentage: "Compliance Percentage",
    }

    for (const [field, displayName] of Object.entries(fieldsToTrack)) {
      const oldValue = oldControl[field]?.toString() || ""
      const newValue = updatedControl[field]?.toString() || ""

      if (oldValue !== newValue) {
        auditEntries.push({
          assessment_id: updatedControl.assessment_id,
          control_id: updatedControl.control_id,
          action_type: "UPDATE",
          field_changed: displayName,
          old_value: oldValue,
          new_value: newValue,
          changed_by: updated_by || "System",
          change_reason: change_reason || "Control assessment update",
        })
      }
    }

    // Insert audit log entries
    if (auditEntries.length > 0) {
      for (const entry of auditEntries) {
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
            ${entry.assessment_id},
            ${entry.control_id},
            ${entry.action_type},
            ${entry.field_changed},
            ${entry.old_value},
            ${entry.new_value},
            ${entry.changed_by},
            ${entry.change_reason},
            NOW()
          )
        `
      }
    }

    // Update assessment statistics
    await updateAssessmentStatistics(tenantDb, updatedControl.assessment_id)

    return NextResponse.json(updatedControl)
  } catch (error) {
    console.error("Failed to update NESA UAE self assessment control:", error)
    return NextResponse.json({ error: "Failed to update assessment control" }, { status: 500 })
  }
});

import type { NeonQueryFunction } from '@neondatabase/serverless' // or the type you use for tenantDb

// Accept tenantDb as an argument
export async function updateAssessmentStatistics(
  tenantDb: NeonQueryFunction<any, any>,   // <-- type of tenantDb
  assessmentId: number
) {
  try {
    // 1️⃣  Query current stats
    const stats = await tenantDb`
      SELECT 
        COUNT(*) as total_controls,
        COUNT(CASE WHEN implementation_status = 'implemented' THEN 1 END) as implemented_controls,
        COUNT(CASE WHEN implementation_status = 'partially-implemented' THEN 1 END) as partially_implemented_controls,
        COUNT(CASE WHEN implementation_status = 'not-implemented' THEN 1 END) as not_implemented_controls,
        COUNT(CASE WHEN implementation_status = 'not-applicable' THEN 1 END) as not_applicable_controls,
        COUNT(CASE WHEN priority = 'high' AND implementation_status != 'implemented' THEN 1 END) as high_priority_gaps,
        COUNT(CASE WHEN priority = 'medium' AND implementation_status != 'implemented' THEN 1 END) as medium_priority_gaps,
        COUNT(CASE WHEN priority = 'low' AND implementation_status != 'implemented' THEN 1 END) as low_priority_gaps,
        AVG(CASE WHEN compliance_percentage IS NOT NULL THEN compliance_percentage ELSE 0 END) as avg_compliance,
        AVG(CASE 
          WHEN current_maturity_level = 'advanced' THEN 4
          WHEN current_maturity_level = 'intermediate' THEN 3
          WHEN current_maturity_level = 'basic' THEN 2
          WHEN current_maturity_level = 'not-implemented' THEN 1
          ELSE 0
        END) as avg_maturity
      FROM nesa_uae_self_assessment_controls 
      WHERE assessment_id = ${assessmentId}
    ` as Record<string, any>[]

    const statistics = stats[0]

    // 2️⃣  Update the parent table
    await tenantDb`
      UPDATE nesa_uae_self_assessments 
      SET 
        total_controls = ${statistics.total_controls},
        implemented_controls = ${statistics.implemented_controls},
        partially_implemented_controls = ${statistics.partially_implemented_controls},
        not_implemented_controls = ${statistics.not_implemented_controls},
        not_applicable_controls = ${statistics.not_applicable_controls},
        high_priority_gaps = ${statistics.high_priority_gaps},
        medium_priority_gaps = ${statistics.medium_priority_gaps},
        low_priority_gaps = ${statistics.low_priority_gaps},
        compliance_percentage = ${statistics.avg_compliance || 0},
        overall_maturity_score = ${statistics.avg_maturity || 0},
        updated_at = NOW()
      WHERE id = ${assessmentId}
    `
  } catch (error) {
    console.error("Failed to update assessment statistics:", error)
  }
}

