"use server"

import { getDatabase } from "@/lib/database"
import { revalidatePath } from "next/cache"
import { AuditLogger, AUDIT_ACTIONS } from "@/lib/audit-logger"

const sql = getDatabase()

export interface UserFormData {
  first_name: string
  last_name: string
  username: string
  email: string
  phone?: string
  organization_id: number
  department_id?: number | null
  job_title?: string
  status: string
}

export async function createUser(formData: FormData) {
  try {
    // Helper function to safely parse integers
    const parseIntSafe = (value: string | null): number | null => {
      if (!value || value === "" || value === "none") return null
      const parsed = Number.parseInt(value, 10)
      return isNaN(parsed) ? null : parsed
    }

    const organizationIdRaw = formData.get("organization_id") as string
    const departmentIdRaw = formData.get("department_id") as string

    const data: UserFormData = {
      first_name: formData.get("first_name") as string,
      last_name: formData.get("last_name") as string,
      username: formData.get("username") as string,
      email: formData.get("email") as string,
      phone: (formData.get("phone") as string) || null,
      organization_id: parseIntSafe(organizationIdRaw) || 0,
      department_id: parseIntSafe(departmentIdRaw),
      job_title: (formData.get("job_title") as string) || null,
      status: (formData.get("status") as string) || "Active",
    }

    // Validate required fields
    if (!data.first_name || !data.last_name || !data.username || !data.email || data.organization_id === 0) {
      return { success: false, error: "Missing required fields (first name, last name, username, email, organization)" }
    }

    const result = await sql`
      INSERT INTO users (first_name, last_name, username, email, phone, organization_id, department_id, job_title, status)
      VALUES (${data.first_name}, ${data.last_name}, ${data.username}, ${data.email}, ${data.phone}, 
              ${data.organization_id}, ${data.department_id}, ${data.job_title}, ${data.status})
      RETURNING *
    `

    await AuditLogger.log({
      userId: "system",
      userEmail: "system@company.com",
      action: AUDIT_ACTIONS.CREATE,
      entityType: "USER",
      entityId: result[0].id.toString(),
      newValues: data,
    })

    revalidatePath("/settings")
    return { success: true, data: result[0] }
  } catch (error) {
    console.error("Failed to create user:", error)
    return { success: false, error: "Failed to create user" }
  }
}

export async function getUsers(organizationId?: number, departmentId?: number) {
  try {
    let users

    if (organizationId && departmentId) {
      users = await sql`
        SELECT u.*, 
               o.name as organization_name,
               d.name as department_name
        FROM users u
        LEFT JOIN organizations o ON u.organization_id = o.id
        LEFT JOIN departments d ON u.department_id = d.id
        WHERE u.organization_id = ${organizationId} AND u.department_id = ${departmentId}
        ORDER BY u.created_at DESC
      `
    } else if (organizationId) {
      users = await sql`
        SELECT u.*, 
               o.name as organization_name,
               d.name as department_name
        FROM users u
        LEFT JOIN organizations o ON u.organization_id = o.id
        LEFT JOIN departments d ON u.department_id = d.id
        WHERE u.organization_id = ${organizationId}
        ORDER BY u.created_at DESC
      `
    } else {
      users = await sql`
        SELECT u.*, 
               o.name as organization_name,
               d.name as department_name
        FROM users u
        LEFT JOIN organizations o ON u.organization_id = o.id
        LEFT JOIN departments d ON u.department_id = d.id
        ORDER BY u.created_at DESC
      `
    }

    return { success: true, data: users }
  } catch (error) {
    console.error("Failed to get users:", error)
    return { success: false, error: "Failed to get users", data: [] }
  }
}

export async function updateUser(id: number, formData: FormData) {
  try {
    const parseIntSafe = (value: string | null): number | null => {
      if (!value || value === "" || value === "none") return null
      const parsed = Number.parseInt(value, 10)
      return isNaN(parsed) ? null : parsed
    }

    const organizationIdRaw = formData.get("organization_id") as string
    const departmentIdRaw = formData.get("department_id") as string

    const data: UserFormData = {
      first_name: formData.get("first_name") as string,
      last_name: formData.get("last_name") as string,
      username: formData.get("username") as string,
      email: formData.get("email") as string,
      phone: (formData.get("phone") as string) || null,
      organization_id: parseIntSafe(organizationIdRaw) || 0,
      department_id: parseIntSafe(departmentIdRaw),
      job_title: (formData.get("job_title") as string) || null,
      status: (formData.get("status") as string) || "Active",
    }

    if (!data.first_name || !data.last_name || !data.username || !data.email || data.organization_id === 0) {
      return { success: false, error: "Missing required fields" }
    }

    const result = await sql`
      UPDATE users SET
        first_name = ${data.first_name},
        last_name = ${data.last_name},
        username = ${data.username},
        email = ${data.email},
        phone = ${data.phone},
        organization_id = ${data.organization_id},
        department_id = ${data.department_id},
        job_title = ${data.job_title},
        status = ${data.status},
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ${id}
      RETURNING *
    `

    await AuditLogger.log({
      userId: "system",
      userEmail: "system@company.com",
      action: AUDIT_ACTIONS.UPDATE,
      entityType: "USER",
      entityId: id.toString(),
      newValues: data,
    })

    revalidatePath("/settings")
    return { success: true, data: result[0] }
  } catch (error) {
    console.error("Failed to update user:", error)
    return { success: false, error: "Failed to update user" }
  }
}

export async function deleteUser(id: number) {
  try {
    // First check if user exists
    const existingUser = await sql`
      SELECT id FROM users WHERE id = ${id}
    `

    if (existingUser.length === 0) {
      return { success: false, error: "User not found" }
    }

    // Delete the user
    await sql`
      DELETE FROM users WHERE id = ${id}
    `

    await AuditLogger.log({
      userId: "system",
      userEmail: "system@company.com",
      action: AUDIT_ACTIONS.DELETE,
      entityType: "USER",
      entityId: id.toString(),
    })

    revalidatePath("/settings")
    return { success: true }
  } catch (error) {
    console.error("Failed to delete user:", error)
    return { success: false, error: "Failed to delete user" }
  }
}

export async function getUserAsOwner(searchTerm: string){
    try {    
      let users

      users = await sql`
          SELECT 
                u.* 
          FROM 
                users u
          WHERE                 
                u.username ILIKE ${`%${searchTerm}%`}
                OR
                u.email ILIKE ${`%${searchTerm}%`}
                OR
                u.first_name ILIKE ${`%${searchTerm}%`}
                OR
                u.last_name ILIKE ${`%${searchTerm}%`}  
                AND
                u.is_active is true and u.email_verified is true      
          ORDER BY 
                u.created_at DESC
        `
        
      return { success: true, data: users }
    } catch (error) {
      console.error("Failed to search owner:", error)
      return { success: false, error: "Failed to search owner", data: [] }    
    }
  
}
