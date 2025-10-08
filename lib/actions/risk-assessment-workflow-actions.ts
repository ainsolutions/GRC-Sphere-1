"use server"

import { getDatabase } from "@/lib/database"
import { revalidatePath } from "next/cache"
import { AuditLogger, AUDIT_ACTIONS, ENTITY_TYPES } from "@/lib/audit-logger"

const sql = getDatabase()

export interface RiskAssessmentWorkflowData {
  workflow_name: string
  description?: string
  methodology: string
  scope?: string
  assessment_type: string
  created_by: string
  assigned_to?: string
  start_date?: string
  target_completion_date?: string
}

export interface WorkflowStepData {
  workflow_id: number
  step_number: number
  step_name: string
  step_description?: string
  assigned_to?: string
}

export interface WorkflowScopeData {
  workflow_id: number
  scope_type: string
  scope_name: string
  scope_description?: string
  inclusion_criteria?: string
  exclusion_criteria?: string
  business_impact?: string
}

export interface WorkflowContextData {
  workflow_id: number
  business_objectives?: string
  regulatory_requirements?: string
  stakeholder_expectations?: string
  risk_appetite?: string
  risk_tolerance?: string
  internal_context?: string
  external_context?: string
}

export interface WorkflowCriteriaData {
  workflow_id: number
  likelihood_scale: any
  impact_scale: any
  risk_matrix: any
  acceptance_criteria?: string
  escalation_criteria?: string
}

// Create new risk assessment workflow
export async function createRiskAssessmentWorkflow(formData: FormData) {
  try {
    const data: RiskAssessmentWorkflowData = {
      workflow_name: formData.get("workflow_name") as string,
      description: formData.get("description") as string,
      methodology: formData.get("methodology") as string,
      scope: formData.get("scope") as string,
      assessment_type: formData.get("assessment_type") as string,
      created_by: formData.get("created_by") as string,
      assigned_to: formData.get("assigned_to") as string,
      start_date: formData.get("start_date") as string,
      target_completion_date: formData.get("target_completion_date") as string,
    }

    const workflow_id = `WF-${Date.now()}`

    const result = await sql`
      INSERT INTO risk_assessment_workflows (
        workflow_id, workflow_name, description, methodology, scope,
        assessment_type, created_by, assigned_to, start_date, target_completion_date
      ) VALUES (
        ${workflow_id}, ${data.workflow_name}, ${data.description}, ${data.methodology},
        ${data.scope}, ${data.assessment_type}, ${data.created_by}, ${data.assigned_to},
        ${data.start_date}, ${data.target_completion_date}
      ) RETURNING *
    `

    // Create default steps based on template
    const template = await sql`
      SELECT default_steps FROM risk_assessment_templates 
      WHERE methodology = ${data.methodology} AND is_active = true
      LIMIT 1
    `

    if (template.length > 0 && template[0].default_steps) {
      const steps = template[0].default_steps
      for (const step of steps) {
        await sql`
          INSERT INTO risk_assessment_steps (
            workflow_id, step_number, step_name, step_description
          ) VALUES (
            ${result[0].id}, ${step.step}, ${step.name}, ${step.description}
          )
        `
      }
    }

    await AuditLogger.log({
      userId: data.created_by,
      userEmail: `${data.created_by}@company.com`,
      action: AUDIT_ACTIONS.CREATE,
      entityType: ENTITY_TYPES.RISK,
      entityId: result[0].id.toString(),
      newValues: data,
    })

    revalidatePath("/compliance")
    return { success: true, data: result[0] }
  } catch (error) {
    console.error("Failed to create risk assessment workflow:", error)
    return { success: false, error: "Failed to create risk assessment workflow" }
  }
}

// Get all risk assessment workflows
export async function getRiskAssessmentWorkflows(searchTerm?: string) {
  try {
    let workflows

    if (searchTerm) {
      workflows = await sql`
        SELECT * FROM risk_assessment_workflows
        WHERE workflow_name ILIKE ${`%${searchTerm}%`} 
        OR description ILIKE ${`%${searchTerm}%`}
        ORDER BY created_at DESC
      `
    } else {
      workflows = await sql`
        SELECT * FROM risk_assessment_workflows
        ORDER BY created_at DESC
      `
    }

    return { success: true, data: workflows }
  } catch (error) {
    console.error("Failed to get risk assessment workflows:", error)
    return { success: false, error: "Failed to get risk assessment workflows", data: [] }
  }
}

// Get workflow by ID with all related data
export async function getRiskAssessmentWorkflowById(id: number) {
  try {
    const workflow = await sql`
      SELECT * FROM risk_assessment_workflows WHERE id = ${id}
    `

    if (workflow.length === 0) {
      return { success: false, error: "Workflow not found" }
    }

    const steps = await sql`
      SELECT * FROM risk_assessment_steps 
      WHERE workflow_id = ${id} 
      ORDER BY step_number
    `

    const scope = await sql`
      SELECT * FROM risk_assessment_scope WHERE workflow_id = ${id}
    `

    const context = await sql`
      SELECT * FROM risk_assessment_context WHERE workflow_id = ${id}
    `

    const criteria = await sql`
      SELECT * FROM risk_assessment_criteria WHERE workflow_id = ${id}
    `

    const risks = await sql`
      SELECT wr.*, r.risk_title, r.risk_description, r.inherent_risk_score
      FROM workflow_risk_assessments wr
      JOIN risks r ON wr.risk_id = r.id
      WHERE wr.workflow_id = ${id}
    `

    return {
      success: true,
      data: {
        workflow: workflow[0],
        steps,
        scope,
        context: context[0] || null,
        criteria: criteria[0] || null,
        risks,
      },
    }
  } catch (error) {
    console.error("Failed to get workflow details:", error)
    return { success: false, error: "Failed to get workflow details" }
  }
}

// Update workflow step status
export async function updateWorkflowStep(stepId: number, status: string, notes?: string) {
  try {
    const result = await sql`
      UPDATE risk_assessment_steps SET
        status = ${status},
        notes = ${notes},
        started_at = CASE WHEN status = 'In Progress' AND started_at IS NULL THEN CURRENT_TIMESTAMP ELSE started_at END,
        completed_at = CASE WHEN status = 'Completed' THEN CURRENT_TIMESTAMP ELSE NULL END
      WHERE id = ${stepId}
      RETURNING *
    `

    revalidatePath("/compliance")
    return { success: true, data: result[0] }
  } catch (error) {
    console.error("Failed to update workflow step:", error)
    return { success: false, error: "Failed to update workflow step" }
  }
}

// Save workflow scope
export async function saveWorkflowScope(data: WorkflowScopeData) {
  try {
    const result = await sql`
      INSERT INTO risk_assessment_scope (
        workflow_id, scope_type, scope_name, scope_description,
        inclusion_criteria, exclusion_criteria, business_impact
      ) VALUES (
        ${data.workflow_id}, ${data.scope_type}, ${data.scope_name}, ${data.scope_description},
        ${data.inclusion_criteria}, ${data.exclusion_criteria}, ${data.business_impact}
      ) RETURNING *
    `

    revalidatePath("/compliance")
    return { success: true, data: result[0] }
  } catch (error) {
    console.error("Failed to save workflow scope:", error)
    return { success: false, error: "Failed to save workflow scope" }
  }
}

// Save workflow context
export async function saveWorkflowContext(data: WorkflowContextData) {
  try {
    // Check if context already exists
    const existing = await sql`
      SELECT id FROM risk_assessment_context WHERE workflow_id = ${data.workflow_id}
    `

    let result
    if (existing.length > 0) {
      result = await sql`
        UPDATE risk_assessment_context SET
          business_objectives = ${data.business_objectives},
          regulatory_requirements = ${data.regulatory_requirements},
          stakeholder_expectations = ${data.stakeholder_expectations},
          risk_appetite = ${data.risk_appetite},
          risk_tolerance = ${data.risk_tolerance},
          internal_context = ${data.internal_context},
          external_context = ${data.external_context}
        WHERE workflow_id = ${data.workflow_id}
        RETURNING *
      `
    } else {
      result = await sql`
        INSERT INTO risk_assessment_context (
          workflow_id, business_objectives, regulatory_requirements,
          stakeholder_expectations, risk_appetite, risk_tolerance,
          internal_context, external_context
        ) VALUES (
          ${data.workflow_id}, ${data.business_objectives}, ${data.regulatory_requirements},
          ${data.stakeholder_expectations}, ${data.risk_appetite}, ${data.risk_tolerance},
          ${data.internal_context}, ${data.external_context}
        ) RETURNING *
      `
    }

    revalidatePath("/compliance")
    return { success: true, data: result[0] }
  } catch (error) {
    console.error("Failed to save workflow context:", error)
    return { success: false, error: "Failed to save workflow context" }
  }
}

// Save workflow criteria
export async function saveWorkflowCriteria(data: WorkflowCriteriaData) {
  try {
    // Check if criteria already exists
    const existing = await sql`
      SELECT id FROM risk_assessment_criteria WHERE workflow_id = ${data.workflow_id}
    `

    let result
    if (existing.length > 0) {
      result = await sql`
        UPDATE risk_assessment_criteria SET
          likelihood_scale = ${JSON.stringify(data.likelihood_scale)},
          impact_scale = ${JSON.stringify(data.impact_scale)},
          risk_matrix = ${JSON.stringify(data.risk_matrix)},
          acceptance_criteria = ${data.acceptance_criteria},
          escalation_criteria = ${data.escalation_criteria}
        WHERE workflow_id = ${data.workflow_id}
        RETURNING *
      `
    } else {
      result = await sql`
        INSERT INTO risk_assessment_criteria (
          workflow_id, likelihood_scale, impact_scale, risk_matrix,
          acceptance_criteria, escalation_criteria
        ) VALUES (
          ${data.workflow_id}, ${JSON.stringify(data.likelihood_scale)}, 
          ${JSON.stringify(data.impact_scale)}, ${JSON.stringify(data.risk_matrix)},
          ${data.acceptance_criteria}, ${data.escalation_criteria}
        ) RETURNING *
      `
    }

    revalidatePath("/compliance")
    return { success: true, data: result[0] }
  } catch (error) {
    console.error("Failed to save workflow criteria:", error)
    return { success: false, error: "Failed to save workflow criteria" }
  }
}

// Get risk assessment templates
export async function getRiskAssessmentTemplates() {
  try {
    const templates = await sql`
      SELECT * FROM risk_assessment_templates 
      WHERE is_active = true 
      ORDER BY template_name
    `

    return { success: true, data: templates }
  } catch (error) {
    console.error("Failed to get risk assessment templates:", error)
    return { success: false, error: "Failed to get risk assessment templates", data: [] }
  }
}

// Update workflow status
export async function updateWorkflowStatus(id: number, status: string) {
  try {
    const result = await sql`
      UPDATE risk_assessment_workflows SET
        status = ${status},
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ${id}
      RETURNING *
    `

    revalidatePath("/compliance")
    return { success: true, data: result[0] }
  } catch (error) {
    console.error("Failed to update workflow status:", error)
    return { success: false, error: "Failed to update workflow status" }
  }
}
