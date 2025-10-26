"use server"

import { getDatabase } from "@/lib/database"
import { revalidatePath } from "next/cache"

type ApiResponse<T> = { success: boolean; data?: T; error?: string; message?: string }

async function apiFetch(path: string, init: RequestInit = {}) {
  const base = process.env.NEXT_PUBLIC_BASE_URL || "" // ensure this points correctly
  const res = await fetch(`${base}${path}`, {
    ...init,
    headers: {
      ...(init.headers || {}),
      "Content-Type": "application/json",
    },
    cache: "no-store",
  })
  return res.json()
}

const sql = getDatabase()

// Generate incremental finding ID
async function generateFindingId(assessmentName: string): Promise<string> {

  try {
    // Get the current year
    const currentYear = new Date().getFullYear()
    
    // Truncate assessment name to 20 characters and format it
    const truncatedName = (assessmentName || "UNKNOWN")
      .substring(0, 20)
      .trim()
      .replace(/\s+/g, "-")
      .toUpperCase()

    // Get the highest finding ID for this assessment pattern
    const findingIdPattern = `FIND-${currentYear}-${truncatedName}-%`
    const result = await sql`
      SELECT finding_id 
      FROM assessment_findings 
      WHERE finding_id LIKE ${findingIdPattern}
      ORDER BY finding_id DESC 
      LIMIT 1
    `

    let nextNumber = 1
    if (result.length > 0) {
      // Extract the number part and increment
      const lastId = result[0].finding_id
      const parts = lastId.split("-")
      const numberPart = parts[parts.length - 1]
      nextNumber = Number.parseInt(numberPart) + 1
    }

    // Format with 6 digits
    const formattedNumber = nextNumber.toString().padStart(6, "0")
    return `FIND-${currentYear}-${truncatedName}-${formattedNumber}`
  } catch (error) {
    console.error("Error generating finding ID:", error)
    // Fallback to random generation
    const year = new Date().getFullYear()
    const randomNum = Math.floor(Math.random() * 999999)
      .toString()
      .padStart(6, "0")
    return `FIND-${year}-UNKNOWN-${randomNum}`
  }
}

// Initialize database connection with error handling


export interface FindingFormData {
  assessment_id: number
  finding_title: string
  finding_description: string
  severity: string
  category?: string
  recommendation?: string
  status: string
  user_id?: number
  department_id?: number
  organization_id?: number
  assigned_to?: string
  due_date?: string
}

export async function createFinding(data: FindingFormData) {

  try {
    // Validate required fields
    if (!data.assessment_id || !data.finding_title || !data.finding_description || !data.severity) {
      return { success: false, error: "Missing required fields (assessment, title, description, severity)" }
    }

    // Check if assessment exists
    const assessment = await sql`
      SELECT id, assessment_name
      FROM assessments 
      WHERE id = ${data.assessment_id}
    `

    if (assessment.length === 0) {
      return { success: false, error: "Assessment not found" }
    }
    
    // Generate finding ID with assessment name
    const findingId = await generateFindingId(assessment[0].assessment_name)


    // Create the finding
    const result = await sql`
      INSERT INTO assessment_findings (
        finding_id, assessment_id, finding_title, finding_description, severity, 
        category, recommendation, status, user_id, 
        assigned_to, due_date, created_at
      )
      VALUES (
        ${findingId},
        ${data.assessment_id}, 
        ${data.finding_title}, 
        ${data.finding_description}, 
        ${data.severity}, 
        ${data.category || null}, 
        ${data.recommendation || null}, 
        ${data.status || "Open"}, 
        ${data.user_id || null}, 
        ${data.assigned_to || null}, 
        ${data.due_date || null},
        CURRENT_TIMESTAMP
      )
      RETURNING *
    `

    revalidatePath("/assessments")
    revalidatePath("/assessments/findings")
    revalidatePath("/findings")
    return { success: true, data: result[0] }
  } catch (error) {
    console.error("Failed to create finding:", error)
    return { success: false, error: `Failed to create finding: ${error.message}` }
  }
}

export async function createBulkFindings(findingsData: FindingFormData[]) {
  const res = await fetch("/api/findings/bulk", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ findings: findingsData }),
  })
  return res.json()
}

export async function getFindings(
  assessmentId?: number,
  status?: string,
) {
  const params = new URLSearchParams()
  if (assessmentId) params.set("assessment_id", String(assessmentId))
  if (status) params.set("status", status)

  return apiFetch(`/api/findings${params.toString() ? `?${params}` : ""}`)
}


export async function updateFinding(id: number, data: Partial<FindingFormData>) {
  if (!sql) {
    return {
      success: true,
      data: {
        id,
        ...data,
        updated_at: new Date().toISOString(),
      },
    }
  }

  try {
    // Check if finding exists
    const existing = await sql`
      SELECT * FROM assessment_findings WHERE id = ${id}
    `

    if (existing.length === 0) {
      return { success: false, error: "Finding not found" }
    }

    // Update the finding
    const result = await sql`
      UPDATE assessment_findings 
      SET 
        finding_title = ${data.finding_title || existing[0].finding_title},
        finding_description = ${data.finding_description || existing[0].finding_description},
        severity = ${data.severity || existing[0].severity},
        category = ${data.category || existing[0].category},
        recommendation = ${data.recommendation || existing[0].recommendation},
        status = ${data.status || existing[0].status},
        user_id = ${data.user_id || existing[0].user_id},
        due_date = ${data.due_date || existing[0].due_date},
        assigned_to = ${data.assigned_to || existing[0].assigned_to},
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ${id}
      RETURNING *
    `

    revalidatePath("/assessments")
    revalidatePath("/assessments/findings")
    revalidatePath("/findings")
    return { success: true, data: result[0] }
  } catch (error) {
    console.error("Failed to update finding:", error)
    return { success: false, error: `Failed to update finding: ${error.message}` }
  }
}

export async function deleteFinding(id: number) {
  if (!sql) {
    return { success: true }
  }

  try {
    // Check if finding exists
    const existing = await sql`
      SELECT * FROM assessment_findings WHERE id = ${id}
    `

    if (existing.length === 0) {
      return { success: false, error: "Finding not found" }
    }

    // Delete the finding
    await sql`
      DELETE FROM assessment_findings WHERE id = ${id}
    `

    revalidatePath("/assessments")
    revalidatePath("/findings")
    return { success: true }
  } catch (error) {
    console.error("Failed to delete finding:", error)
    return { success: false, error: `Failed to delete finding: ${error.message}` }
  }
}

export async function updateFindingStatus(id: number, status: string, userId?: string) {
  if (!sql) {
    return { success: true, data: { id, status, updated_at: new Date().toISOString() } }
  }

  try {
    // Check if finding exists
    const existing = await sql`
      SELECT * FROM assessment_findings WHERE id = ${id}
    `

    if (existing.length === 0) {
      return { success: false, error: "Finding not found" }
    }

    // Update only the status
    const result = await sql`
      UPDATE assessment_findings 
      SET 
        status = ${status},
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ${id}
      RETURNING *
    `

    revalidatePath("/assessments")
    revalidatePath("/assessments/findings")
    revalidatePath("/findings")
    return { success: true, data: result[0] }
  } catch (error) {
    console.error("Failed to update finding status:", error)
    return { success: false, error: `Failed to update finding status: ${error.message}` }
  }
}

// Helper functions for form data
export async function getAssessments() {
  try {
    const res = await fetch("/api/assessments", { cache: "no-store" })
    return await res.json()
  } catch (error: any) {
    return { success: false, error: error.message, data: [] }
  }
}

export async function getUsers(organizationId?: number, departmentId?: number) {
  if (!sql) {
    return {
      success: true,
      data: [
        {
          id: 1,
          first_name: "John",
          last_name: "Doe",
          username: "jdoe",
          email: "john.doe@company.com",
          organization_name: "Sample Organization",
          department_name: "IT Department",
        },
        {
          id: 2,
          first_name: "Jane",
          last_name: "Smith",
          username: "jsmith",
          email: "jane.smith@company.com",
          organization_name: "Sample Organization",
          department_name: "Security Department",
        },
      ],
    }
  }

  try {
    const whereConditions = []
    const params = []

    if (organizationId) {
      whereConditions.push(`u.organization_id = $${params.length + 1}`)
      params.push(organizationId)
    }

    if (departmentId) {
      whereConditions.push(`u.department_id = $${params.length + 1}`)
      params.push(departmentId)
    }

    const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(" AND ")}` : ""

    const users = await sql`
      SELECT 
        u.*,
        COALESCE(o.name, 'Unknown Organization') as organization_name,
        COALESCE(d.name, 'Unknown Department') as department_name
      FROM users u
      LEFT JOIN organizations o ON u.organization_id = o.id
      LEFT JOIN departments d ON u.department_id = d.id
      ${sql.unsafe(whereClause)}
      ORDER BY u.first_name, u.last_name
    `

    return { success: true, data: users }
  } catch (error) {
    console.error("Failed to get users:", error)
    return { success: false, error: `Failed to get users: ${error.message}`, data: [] }
  }
}

export async function getDepartments(organizationId?: number) {
  if (!sql) {
    return {
      success: true,
      data: [
        {
          id: 1,
          name: "IT Department",
          organization_id: 1,
          organization_name: "Sample Organization",
        },
        {
          id: 2,
          name: "Security Department",
          organization_id: 1,
          organization_name: "Sample Organization",
        },
      ],
    }
  }

  try {
    let whereClause = ""
    if (organizationId) {
      whereClause = `WHERE d.organization_id = ${organizationId}`
    }

    const departments = await sql`
      SELECT 
        d.*,
        COALESCE(o.name, 'Unknown Organization') as organization_name
      FROM departments d
      LEFT JOIN organizations o ON d.organization_id = o.id
      ${sql.unsafe(whereClause)}
      ORDER BY d.name
    `

    return { success: true, data: departments }
  } catch (error) {
    console.error("Failed to get departments:", error)
    return { success: false, error: `Failed to get departments: ${error.message}`, data: [] }
  }
}

export async function getOrganizations() {
  if (!sql) {
    return {
      success: true,
      data: [
        {
          id: 1,
          name: "Sample Organization",
          created_at: new Date().toISOString(),
        },
      ],
    }
  }

  try {
    const organizations = await sql`
      SELECT * FROM organizations ORDER BY name
    `
    return { success: true, data: organizations }
  } catch (error) {
    console.error("Failed to get organizations:", error)
    return { success: false, error: `Failed to get organizations: ${error.message}`, data: [] }
  }
}
