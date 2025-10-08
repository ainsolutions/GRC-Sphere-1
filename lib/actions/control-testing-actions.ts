"use server"

import { getDatabase } from "@/lib/database"
import { revalidatePath } from "next/cache"
import { AuditLogger, AUDIT_ACTIONS } from "@/lib/audit-logger"

const sql = getDatabase()

export interface TestPlanFormData {
  control_id: number
  test_name: string
  test_description?: string
  test_type: string
  test_frequency: string
  test_procedures: string
  expected_evidence?: string
  test_criteria?: string
  assigned_tester?: string
}

export interface TestExecutionFormData {
  control_id: number
  test_plan_id?: number
  test_date: string
  tester_name: string
  tester_email?: string
  test_result: string
  effectiveness_rating?: string
  test_notes?: string
  evidence_collected?: string
  issues_identified?: string
  recommendations?: string
  next_test_date?: string
}

export async function createTestPlan(formData: FormData) {
  try {
    const data: TestPlanFormData = {
      control_id: Number.parseInt(formData.get("control_id") as string),
      test_name: formData.get("test_name") as string,
      test_description: (formData.get("test_description") as string) || null,
      test_type: formData.get("test_type") as string,
      test_frequency: formData.get("test_frequency") as string,
      test_procedures: formData.get("test_procedures") as string,
      expected_evidence: (formData.get("expected_evidence") as string) || null,
      test_criteria: (formData.get("test_criteria") as string) || null,
      assigned_tester: (formData.get("assigned_tester") as string) || null,
    }

    const result = await sql`
      INSERT INTO control_test_plans (
        control_id, test_name, test_description, test_type,
        test_frequency, test_procedures, expected_evidence,
        test_criteria, assigned_tester, created_by
      ) VALUES (
        ${data.control_id}, ${data.test_name}, ${data.test_description},
        ${data.test_type}, ${data.test_frequency}, ${data.test_procedures},
        ${data.expected_evidence}, ${data.test_criteria}, ${data.assigned_tester},
        'system'
      ) RETURNING *
    `

    await AuditLogger.log({
      userId: "system",
      userEmail: "system@company.com",
      action: AUDIT_ACTIONS.CREATE,
      entityType: "CONTROL_TEST_PLAN",
      entityId: result[0].id.toString(),
      newValues: data,
    })

    revalidatePath("/controls")
    return { success: true, data: result[0] }
  } catch (error) {
    console.error("Failed to create test plan:", error)
    return { success: false, error: "Failed to create test plan" }
  }
}

export async function executeControlTest(formData: FormData) {
  try {
    const data: TestExecutionFormData = {
      control_id: Number.parseInt(formData.get("control_id") as string),
      test_plan_id: formData.get("test_plan_id") ? Number.parseInt(formData.get("test_plan_id") as string) : null,
      test_date: formData.get("test_date") as string,
      tester_name: formData.get("tester_name") as string,
      tester_email: (formData.get("tester_email") as string) || null,
      test_result: formData.get("test_result") as string,
      effectiveness_rating: (formData.get("effectiveness_rating") as string) || null,
      test_notes: (formData.get("test_notes") as string) || null,
      evidence_collected: (formData.get("evidence_collected") as string) || null,
      issues_identified: (formData.get("issues_identified") as string) || null,
      recommendations: (formData.get("recommendations") as string) || null,
      next_test_date: (formData.get("next_test_date") as string) || null,
    }

    const result = await sql`
      INSERT INTO control_test_executions (
        control_id, test_plan_id, test_date, tester_name, tester_email,
        test_result, effectiveness_rating, test_notes, evidence_collected,
        issues_identified, recommendations, next_test_date
      ) VALUES (
        ${data.control_id}, ${data.test_plan_id}, ${data.test_date},
        ${data.tester_name}, ${data.tester_email}, ${data.test_result},
        ${data.effectiveness_rating}, ${data.test_notes}, ${data.evidence_collected},
        ${data.issues_identified}, ${data.recommendations}, ${data.next_test_date}
      ) RETURNING *
    `

    // Update the control's last test information
    await sql`
      UPDATE controls SET
        last_test_date = ${data.test_date},
        last_test_result = ${data.test_result},
        test_status = 'Tested',
        next_test_date = ${data.next_test_date},
        effectiveness_rating = COALESCE(${data.effectiveness_rating}, effectiveness_rating),
        updated_at = NOW()
      WHERE id = ${data.control_id}
    `

    await AuditLogger.log({
      userId: "system",
      userEmail: "system@company.com",
      action: AUDIT_ACTIONS.CREATE,
      entityType: "CONTROL_TEST_EXECUTION",
      entityId: result[0].id.toString(),
      newValues: data,
    })

    revalidatePath("/controls")
    return { success: true, data: result[0] }
  } catch (error) {
    console.error("Failed to execute control test:", error)
    return { success: false, error: "Failed to execute control test" }
  }
}

export async function getControlTestHistory(controlId: number) {
  try {
    const history = await sql`
      SELECT 
        cte.*,
        ctp.test_name as plan_name,
        ctp.test_type as plan_type
      FROM control_test_executions cte
      LEFT JOIN control_test_plans ctp ON cte.test_plan_id = ctp.id
      WHERE cte.control_id = ${controlId}
      ORDER BY cte.test_date DESC
    `

    return { success: true, data: history }
  } catch (error) {
    console.error("Failed to get control test history:", error)
    return { success: false, error: "Failed to get control test history", data: [] }
  }
}

export async function getControlTestPlans(controlId: number) {
  try {
    const plans = await sql`
      SELECT * FROM control_test_plans
      WHERE control_id = ${controlId}
      ORDER BY created_at DESC
    `

    return { success: true, data: plans }
  } catch (error) {
    console.error("Failed to get control test plans:", error)
    return { success: false, error: "Failed to get control test plans", data: [] }
  }
}

export async function getTestingDashboardData() {
  try {
    const overdue = await sql`
      SELECT COUNT(*) as count
      FROM controls
      WHERE next_test_date < CURRENT_DATE
      AND test_status != 'Not Applicable'
    `

    const dueThisMonth = await sql`
      SELECT COUNT(*) as count
      FROM controls
      WHERE next_test_date BETWEEN CURRENT_DATE AND (CURRENT_DATE + INTERVAL '30 days')
      AND test_status != 'Not Applicable'
    `

    const recentTests = await sql`
      SELECT COUNT(*) as count
      FROM control_test_executions
      WHERE test_date >= (CURRENT_DATE - INTERVAL '30 days')
    `

    const failedTests = await sql`
      SELECT COUNT(*) as count
      FROM control_test_executions
      WHERE test_result = 'Fail'
      AND test_date >= (CURRENT_DATE - INTERVAL '90 days')
    `

    const upcomingTests = await sql`
      SELECT 
        c.control_id,
        c.control_name,
        c.next_test_date,
        c.control_owner,
        c.test_status
      FROM controls c
      WHERE c.next_test_date BETWEEN CURRENT_DATE AND (CURRENT_DATE + INTERVAL '30 days')
      ORDER BY c.next_test_date ASC
      LIMIT 10
    `

    return {
      success: true,
      data: {
        overdue: overdue[0].count,
        dueThisMonth: dueThisMonth[0].count,
        recentTests: recentTests[0].count,
        failedTests: failedTests[0].count,
        upcomingTests: upcomingTests,
      },
    }
  } catch (error) {
    console.error("Failed to get testing dashboard data:", error)
    return { success: false, error: "Failed to get testing dashboard data" }
  }
}

export async function scheduleControlTest(
  controlId: number,
  scheduledDate: string,
  testType: string,
  assignedTester?: string,
) {
  try {
    const result = await sql`
      INSERT INTO control_test_schedule (
        control_id, scheduled_date, test_type, assigned_tester, status
      ) VALUES (
        ${controlId}, ${scheduledDate}, ${testType}, ${assignedTester || null}, 'Scheduled'
      ) RETURNING *
    `

    await AuditLogger.log({
      userId: "system",
      userEmail: "system@company.com",
      action: AUDIT_ACTIONS.CREATE,
      entityType: "CONTROL_TEST_SCHEDULE",
      entityId: result[0].id.toString(),
      newValues: { controlId, scheduledDate, testType, assignedTester },
    })

    revalidatePath("/controls")
    return { success: true, data: result[0] }
  } catch (error) {
    console.error("Failed to schedule control test:", error)
    return { success: false, error: "Failed to schedule control test" }
  }
}

export async function createTestIssue(testExecutionId: number, issueData: any) {
  try {
    const result = await sql`
      INSERT INTO control_test_issues (
        test_execution_id, issue_title, issue_description,
        severity, assigned_to, due_date
      ) VALUES (
        ${testExecutionId}, ${issueData.title}, ${issueData.description},
        ${issueData.severity}, ${issueData.assignedTo || null}, ${issueData.dueDate || null}
      ) RETURNING *
    `

    await AuditLogger.log({
      userId: "system",
      userEmail: "system@company.com",
      action: AUDIT_ACTIONS.CREATE,
      entityType: "CONTROL_TEST_ISSUE",
      entityId: result[0].id.toString(),
      newValues: issueData,
    })

    return { success: true, data: result[0] }
  } catch (error) {
    console.error("Failed to create test issue:", error)
    return { success: false, error: "Failed to create test issue" }
  }
}
