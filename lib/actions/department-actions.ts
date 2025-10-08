"use server"

import { getDatabase } from "@/lib/database"
import { revalidatePath } from "next/cache"
import { AuditLogger, AUDIT_ACTIONS } from "@/lib/audit-logger"

const sql = getDatabase()

export interface DepartmentFormData {
  name: string
  description?: string
  organization_id: number
  parent_department_id?: number
  department_head?: string
  budget?: number
  cost_center?: string
  phone?: string
  email?: string
  location?: string
  status: string
}

export async function createDepartment(formData: FormData) {
  try {
    const parentDeptIdValue = formData.get("parent_department_id") as string
    let parentDeptId = null

    if (parentDeptIdValue && parentDeptIdValue !== "none" && parentDeptIdValue !== "") {
      const parsed = Number.parseInt(parentDeptIdValue)
      if (!isNaN(parsed)) {
        parentDeptId = parsed
      }
    }

    const budgetValue = formData.get("budget") as string
    let budget = null
    if (budgetValue && budgetValue !== "") {
      const parsed = Number.parseFloat(budgetValue)
      if (!isNaN(parsed)) {
        budget = parsed
      }
    }

    const data: DepartmentFormData = {
      name: formData.get("name") as string,
      description: (formData.get("description") as string) || null,
      organization_id: Number.parseInt(formData.get("organization_id") as string),
      parent_department_id: parentDeptId,
      department_head: (formData.get("department_head") as string) || null,
      budget: budget,
      cost_center: (formData.get("cost_center") as string) || null,
      phone: (formData.get("phone") as string) || null,
      email: (formData.get("email") as string) || null,
      location: (formData.get("location") as string) || null,
      status: formData.get("status") as string,
    }

    const result = await sql`
      INSERT INTO departments (name, description, organization_id, department_id, 
                        department_head, budget, cost_center, phone, email, location, status)
      VALUES (${data.name}, ${data.description}, ${data.organization_id}, ${data.parent_department_id}, 
        ${data.department_head}, ${data.budget}, ${data.cost_center}, ${data.phone},
        ${data.email}, ${data.location}, ${data.status})
      RETURNING *
    `

    await AuditLogger.log({
      userId: "system",
      userEmail: "system@company.com",
      action: AUDIT_ACTIONS.CREATE,
      entityType: "DEPARTMENT",
      entityId: result[0].id.toString(),
      newValues: data,
    })

    revalidatePath("/settings")
    return { success: true, data: result[0] }
  } catch (error) {
    console.error("Failed to create department:", error)
    return { success: false, error: "Failed to create department" }
  }
}

export async function getDepartments(organizationId?: number) {
  try {
    let departments

    if (organizationId) {
      departments = await sql`
        SELECT d.*, 
               o.name as organization_name,
               p.name as parent_department_name,
               d.department_head as manager_name,
               COUNT(DISTINCT u.id) as user_count
        FROM departments d
        LEFT JOIN organizations o ON d.organization_id = o.id
        LEFT JOIN departments p ON d.department_id = p.id
        LEFT JOIN users u ON d.id = u.department_id
        WHERE d.organization_id = ${organizationId}
        GROUP BY d.id, o.name, p.name, d.department_head
        ORDER BY d.created_at DESC
      `
    } else {
      departments = await sql`
        SELECT d.*, 
               o.name as organization_name,
               p.name as parent_department_name,
               d.department_head as manager_name,
               COUNT(DISTINCT u.id) as user_count
        FROM departments d
        LEFT JOIN organizations o ON d.organization_id = o.id
        LEFT JOIN departments p ON d.department_id = p.id
        LEFT JOIN users u ON d.id = u.department_id
        GROUP BY d.id, o.name, p.name, d.department_head
        ORDER BY d.created_at DESC
      `
    }

    return { success: true, data: departments }
  } catch (error) {
    console.error("Failed to get departments:", error)
    return { success: false, error: "Failed to get departments", data: [] }
  }
}

export async function updateDepartment(id: number, formData: FormData) {
  try {
    const parentDeptIdValue = formData.get("parent_department_id") as string
    let parentDeptId = null

    if (parentDeptIdValue && parentDeptIdValue !== "none" && parentDeptIdValue !== "") {
      const parsed = Number.parseInt(parentDeptIdValue)
      if (!isNaN(parsed)) {
        parentDeptId = parsed
      }
    }

    const budgetValue = formData.get("budget") as string
    let budget = null
    if (budgetValue && budgetValue !== "") {
      const parsed = Number.parseFloat(budgetValue)
      if (!isNaN(parsed)) {
        budget = parsed
      }
    }

    const data: DepartmentFormData = {
      name: formData.get("name") as string,
      description: (formData.get("description") as string) || null,
      organization_id: Number.parseInt(formData.get("organization_id") as string),
      parent_department_id: parentDeptId,
      department_head: (formData.get("department_head") as string) || null,
      budget: budget,
      cost_center: (formData.get("cost_center") as string) || null,
      phone: (formData.get("phone") as string) || null,
      email: (formData.get("email") as string) || null,
      location: (formData.get("location") as string) || null,
      status: formData.get("status") as string,
    }

    const result = await sql`
      UPDATE departments SET
        name = ${data.name},
        description = ${data.description},
        organization_id = ${data.organization_id},
        department_id = ${data.parent_department_id},
        department_head = ${data.department_head},
        budget = ${data.budget},
        cost_center = ${data.cost_center},
        phone = ${data.phone},
        email = ${data.email},
        location = ${data.location},
        status = ${data.status},
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ${id}
      RETURNING *
    `

    await AuditLogger.log({
      userId: "system",
      userEmail: "system@company.com",
      action: AUDIT_ACTIONS.UPDATE,
      entityType: "DEPARTMENT",
      entityId: id.toString(),
      newValues: data,
    })

    revalidatePath("/settings")
    return { success: true, data: result[0] }
  } catch (error) {
    console.error("Failed to update department:", error)
    return { success: false, error: "Failed to update department" }
  }
}

export async function deleteDepartment(id: number) {
  try {
    await sql`DELETE FROM departments WHERE id = ${id}`

    await AuditLogger.log({
      userId: "system",
      userEmail: "system@company.com",
      action: AUDIT_ACTIONS.DELETE,
      entityType: "DEPARTMENT",
      entityId: id.toString(),
    })

    revalidatePath("/settings")
    return { success: true }
  } catch (error) {
    console.error("Failed to delete department:", error)
    return { success: false, error: "Failed to delete department" }
  }
}
