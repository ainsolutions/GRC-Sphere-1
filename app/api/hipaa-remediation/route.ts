import { withContext } from "@/lib/HttpContext";
import { type NextRequest, NextResponse } from "next/server"


function normalizeCase(value: string | undefined, fallback: string): string {
  if (!value) return fallback
  const lower = value.toLowerCase()
  switch (lower) {
    case "critical": return "Critical"
    case "high": return "High"
    case "medium": return "Medium"
    case "low": return "Low"
    case "open": return "Open"
    case "in progress": return "In Progress"
    case "under review": return "Under Review"
    case "completed": return "Completed"
    case "closed": return "Closed"
    case "deferred": return "Deferred"
    default: return fallback
  }
}


export const GET = withContext( async ({ tenantDb }, request) => {
  try {
    const { searchParams } = new URL(request.url)
    const assessmentId = searchParams.get("assessment_id")
    const status = searchParams.get("status")
    const priority = searchParams.get("priority")
    const assignedTo = searchParams.get("assigned_to")
    const search = searchParams.get("search")

    // Base query to get HIPAA remediation actions
    let query = `
      SELECT 
        id,
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
        estimated_effort_hours,
        actual_effort_hours,
        estimated_cost,
        actual_cost,
        progress_percentage,
        evidence_required,
        evidence_provided,
        risk_before_remediation,
        risk_after_remediation,
        business_impact,
        requires_approval,
        verification_status,
        verification_comments,
        timeline_status,
        'Sample Assessment' as assessment_name,
        'HIPAA Security Rule' as hipaa_section,
        'Administrative Safeguards' as control_name,
        created_at,
        updated_at
      FROM hipaa_remediation_actions
      WHERE 1=1
    `

    // Apply filters
    if (assessmentId) {
      query += ` AND assessment_id = ${assessmentId}`
    }

    if (status && status !== "all") {
      query += ` AND remediation_status = '${status}'`
    }

    if (priority && priority !== "all") {
      query += ` AND remediation_priority = '${priority}'`
    }

    if (assignedTo) {
      query += ` AND assigned_to ILIKE '%${assignedTo}%'`
    }

    if (search) {
      query += ` AND (
        finding_title ILIKE '%${search}%' OR 
        finding_id ILIKE '%${search}%' OR 
        assigned_to ILIKE '%${search}%' OR 
        assigned_department ILIKE '%${search}%'
      )`
    }

    query += ` ORDER BY 
      CASE remediation_priority 
        WHEN 'critical' THEN 1 
        WHEN 'high' THEN 2 
        WHEN 'medium' THEN 3 
        WHEN 'low' THEN 4 
        ELSE 5 
      END,
      target_completion_date ASC NULLS LAST,
      created_at DESC
    `

    // Check if table exists first
    const tableExists = (await tenantDb`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'hipaa_remediation_actions'
      )
    `) as Record<string,any>[];

    if (!tableExists[0]?.exists) {
      // Return sample data if table doesn't exist
      return NextResponse.json([
        {
          id: 1,
          assessment_id: 1,
          requirement_id: 1,
          finding_id: "HIPAA-2024-001",
          finding_title: "Inadequate Access Controls",
          finding_description: "User access controls do not meet HIPAA requirements for PHI protection",
          finding_severity: "high",
          finding_category: "administrative",
          remediation_action: "Implement role-based access controls and regular access reviews",
          remediation_priority: "high",
          remediation_status: "in-progress",
          remediation_type: "short-term",
          assigned_to: "John Smith",
          assigned_department: "IT Security",
          responsible_manager: "Jane Doe",
          target_completion_date: "2024-03-15",
          actual_completion_date: null,
          estimated_effort_hours: 40,
          actual_effort_hours: 25,
          estimated_cost: 5000,
          actual_cost: 3200,
          progress_percentage: 65,
          evidence_required: "Updated access control policies and audit logs",
          evidence_provided: "Draft policies completed",
          risk_before_remediation: "high",
          risk_after_remediation: "low",
          business_impact: "Ensures HIPAA compliance and reduces data breach risk",
          requires_approval: true,
          verification_status: "pending",
          verification_comments: "Awaiting security team review",
          timeline_status: "on-track",
          assessment_name: "HIPAA Security Assessment 2024",
          hipaa_section: "Administrative Safeguards",
          control_name: "Access Management",
          created_at: "2024-01-15T10:00:00Z",
          updated_at: "2024-02-01T14:30:00Z",
        },
        {
          id: 2,
          assessment_id: 1,
          requirement_id: 2,
          finding_id: "HIPAA-2024-002",
          finding_title: "Missing Encryption for PHI",
          finding_description: "PHI data is not encrypted at rest and in transit",
          finding_severity: "critical",
          finding_category: "technical",
          remediation_action: "Implement end-to-end encryption for all PHI data",
          remediation_priority: "critical",
          remediation_status: "open",
          remediation_type: "immediate",
          assigned_to: "Mike Johnson",
          assigned_department: "Infrastructure",
          responsible_manager: "Sarah Wilson",
          target_completion_date: "2024-02-28",
          actual_completion_date: null,
          estimated_effort_hours: 80,
          actual_effort_hours: 0,
          estimated_cost: 15000,
          actual_cost: 0,
          progress_percentage: 0,
          evidence_required: "Encryption implementation documentation and test results",
          evidence_provided: null,
          risk_before_remediation: "critical",
          risk_after_remediation: "low",
          business_impact: "Critical for HIPAA compliance and patient data protection",
          requires_approval: true,
          verification_status: "not-started",
          verification_comments: null,
          timeline_status: "overdue",
          assessment_name: "HIPAA Security Assessment 2024",
          hipaa_section: "Physical Safeguards",
          control_name: "Data Encryption",
          created_at: "2024-01-10T09:00:00Z",
          updated_at: "2024-01-10T09:00:00Z",
        },
      ])
    }

    // Execute the query using tagged template literal
    const result = await tenantDb.unsafe(query)
    return NextResponse.json(Array.isArray(result) ? result : [])
  } catch (error) {
    console.error("Error fetching HIPAA remediation actions:", error)
    return NextResponse.json([], { status: 200 }) // Return empty array instead of error
  }
});

export const POST = withContext(async ({ tenantDb }, request) => {
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
      created_by,
    } = body

// ✅ Safely parse integers
const assessmentIdNum =
  assessment_id && !isNaN(Number(assessment_id)) ? Number(assessment_id) : null
const requirementIdNum =
  requirement_id && !isNaN(Number(requirement_id)) ? Number(requirement_id) : null

if (!assessmentIdNum) {
  return NextResponse.json(
    { error: "Invalid or missing assessment_id" },
    { status: 400 }
  )
}

if (!requirementIdNum) {
  return NextResponse.json(
    { error: "Invalid or missing requirement_id" },
    { status: 400 }
  )
}

// ✅ Check existence only if IDs are valid
const assessmentExists = await tenantDb`
  SELECT 1 FROM hipaa_assessments WHERE id = ${assessmentIdNum} LIMIT 1
` as Record<string, any>[]
const requirementExists = await tenantDb`
  SELECT 1 FROM hipaa_requirements WHERE id = ${requirementIdNum} LIMIT 1
` as Record<string, any>[]

if (!assessmentExists.length) {
  return NextResponse.json(
    { error: `Assessment ID ${assessmentIdNum} not found` },
    { status: 400 }
  )
}
if (!requirementExists.length) {
  return NextResponse.json(
    { error: `Requirement ID ${requirementIdNum} not found` },
    { status: 400 }
  )
}

    // ✅ Insert new remediation action
    const result = await tenantDb`
      INSERT INTO hipaa_remediation_actions (
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
        created_by,
        created_at,
        updated_at
      ) VALUES (
        ${assessmentIdNum},
        ${requirementIdNum},
        ${finding_id},
        ${finding_title},
        ${finding_description || ""},
        ${normalizeCase(finding_severity, "Medium")},
        ${finding_category || "Technical"},
        ${remediation_action},
        ${normalizeCase(remediation_priority, "Medium")},
        ${remediation_type || "Short-term"},
        ${assigned_to || ""},
        ${assigned_department || ""},
        ${responsible_manager || ""},
        ${target_completion_date || null},
        ${estimated_effort_hours || 0},
        ${estimated_cost || 0},
        ${evidence_required || ""},
        ${normalizeCase(risk_before_remediation, "Medium")},
        ${normalizeCase(risk_after_remediation, "Low")},
        ${business_impact || ""},
        ${requires_approval || false},
        ${created_by || "System"},
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP
      )
      RETURNING *
    ` as Record<string, any>[]

    return NextResponse.json(result[0])
  } catch (error) {
    console.error("Error creating HIPAA remediation action:", error)
    return NextResponse.json({ error: "Failed to create remediation action" }, { status: 500 })
  }
})


export const PUT = withContext( async ({ tenantDb }, request) => {
  try {
    const body = await request.json()
    const {
      id,
      remediation_status,
      progress_percentage,
      evidence_provided,
      verification_status,
      verification_comments,
      updated_by,
      update_comment,
    } = body

    if (!id) {
      return NextResponse.json({ error: "Missing remediation action ID" }, { status: 400 })
    }

    // Check if table exists
    const tableExists = (await tenantDb`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'hipaa_remediation_actions'
      )
    `) as Record<string,any>[];

    if (!tableExists[0]?.exists) {
      return NextResponse.json({ error: "Remediation actions table not found" }, { status: 404 })
    }

    const result = (await tenantDb`
      UPDATE hipaa_remediation_actions 
      SET 
        remediation_status = COALESCE(${remediation_status}, remediation_status),
        progress_percentage = COALESCE(${progress_percentage}, progress_percentage),
        evidence_provided = COALESCE(${evidence_provided}, evidence_provided),
        verification_status = COALESCE(${verification_status}, verification_status),
        verification_comments = COALESCE(${verification_comments}, verification_comments),
        updated_by = ${updated_by || "System"},
        updated_at = CURRENT_TIMESTAMP,
        actual_completion_date = CASE 
          WHEN ${remediation_status} = 'completed' THEN CURRENT_DATE 
          ELSE actual_completion_date 
        END,
        timeline_status = CASE 
          WHEN target_completion_date < CURRENT_DATE AND ${remediation_status} != 'completed' THEN 'overdue'
          WHEN target_completion_date <= CURRENT_DATE + INTERVAL '7 days' AND ${remediation_status} != 'completed' THEN 'due-soon'
          ELSE 'on-track'
        END
      WHERE id = ${id}
      RETURNING *
    `) as Record<string,any>[];

    if (result.length === 0) {
      return NextResponse.json({ error: "Remediation action not found" }, { status: 404 })
    }

    // Log the update if update_comment is provided
    if (update_comment) {
      try {
        await tenantDb`
          INSERT INTO hipaa_remediation_updates (
            remediation_action_id,
            update_type,
            update_description,
            previous_status,
            new_status,
            previous_progress,
            new_progress,
            update_by,
            update_date
          ) VALUES (
            ${id},
            'status_update',
            ${update_comment},
            ${result[0].remediation_status},
            ${remediation_status || result[0].remediation_status},
            ${result[0].progress_percentage},
            ${progress_percentage || result[0].progress_percentage},
            ${updated_by || "System"},
            CURRENT_TIMESTAMP
          )
        `
      } catch (updateError) {
        console.warn("Failed to log update:", updateError)
        // Continue without failing the main update
      }
    }

    return NextResponse.json(result[0])
  } catch (error) {
    console.error("Error updating HIPAA remediation action:", error)
    return NextResponse.json({ error: "Failed to update remediation action" }, { status: 500 })
  }
});

export const DELETE = withContext( async ({ tenantDb }, request) => {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json({ error: "Missing remediation action ID" }, { status: 400 })
    }

    // Check if table exists
    const tableExists = (await tenantDb`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'hipaa_remediation_actions'
      )
    `) as Record<string,any>[];

    if (!tableExists[0]?.exists) {
      return NextResponse.json({ error: "Remediation actions table not found" }, { status: 404 })
    }

    const result = (await tenantDb`
      DELETE FROM hipaa_remediation_actions 
      WHERE id = ${id}
      RETURNING *
    `) as Record<string,any>[];

    if (result.length === 0) {
      return NextResponse.json({ error: "Remediation action not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "Remediation action deleted successfully" })
  } catch (error) {
    console.error("Error deleting HIPAA remediation action:", error)
    return NextResponse.json({ error: "Failed to delete remediation action" }, { status: 500 })
  }
});
