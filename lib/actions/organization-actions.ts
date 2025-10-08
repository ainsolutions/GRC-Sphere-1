"use server"

import { getDatabase } from "@/lib/database"
import { revalidatePath } from "next/cache"
import { AuditLogger, AUDIT_ACTIONS } from "@/lib/audit-logger"

const sql = getDatabase()

export interface OrganizationFormData {
  name: string
  description?: string
  address?: string
  phone?: string
  email?: string
  website?: string
  status: string
}

export async function createOrganization(formData: FormData) {
  try {
    const data: OrganizationFormData = {
      name: formData.get("name") as string,
      description: (formData.get("description") as string) || null,
      address: (formData.get("address") as string) || null,
      phone: (formData.get("phone") as string) || null,
      email: (formData.get("email") as string) || null,
      website: (formData.get("website") as string) || null,
      status: formData.get("status") as string,
    }

    const result = await sql`
      INSERT INTO organizations (name, description, address, phone, email, website, status)
      VALUES (${data.name}, ${data.description}, ${data.address}, ${data.phone}, 
              ${data.email}, ${data.website}, ${data.status})
      RETURNING *
    `

    await AuditLogger.log({
      userId: "system",
      userEmail: "system@company.com",
      action: AUDIT_ACTIONS.CREATE,
      entityType: "ORGANIZATION",
      entityId: result[0].id.toString(),
      newValues: data,
    })

    revalidatePath("/settings")
    return { success: true, data: result[0] }
  } catch (error) {
    console.error("Failed to create organization:", error)
    return { success: false, error: "Failed to create organization" }
  }
}

export async function getOrganizations() {
  try {
    const organizations = await sql`
      SELECT o.*, 
             COUNT(DISTINCT d.id) as department_count,
             COUNT(DISTINCT u.id) as user_count
      FROM organizations o
      LEFT JOIN departments d ON o.id = d.organization_id
      LEFT JOIN users u ON o.id = u.organization_id
      GROUP BY o.id
      ORDER BY o.created_at DESC
    `
    return { success: true, data: organizations }
  } catch (error) {
    console.error("Failed to get organizations:", error)
    return { success: false, error: "Failed to get organizations", data: [] }
  }
}

export async function updateOrganization(id: number, formData: FormData) {
  try {
    const data: OrganizationFormData = {
      name: formData.get("name") as string,
      description: (formData.get("description") as string) || null,
      address: (formData.get("address") as string) || null,
      phone: (formData.get("phone") as string) || null,
      email: (formData.get("email") as string) || null,
      website: (formData.get("website") as string) || null,
      status: formData.get("status") as string,
    }

    const result = await sql`
      UPDATE organizations SET
        name = ${data.name},
        description = ${data.description},
        address = ${data.address},
        phone = ${data.phone},
        email = ${data.email},
        website = ${data.website},
        status = ${data.status},
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ${id}
      RETURNING *
    `

    await AuditLogger.log({
      userId: "system",
      userEmail: "system@company.com",
      action: AUDIT_ACTIONS.UPDATE,
      entityType: "ORGANIZATION",
      entityId: id.toString(),
      newValues: data,
    })

    revalidatePath("/settings")
    return { success: true, data: result[0] }
  } catch (error) {
    console.error("Failed to update organization:", error)
    return { success: false, error: "Failed to update organization" }
  }
}

export async function deleteOrganization(id: number) {
  try {
    await sql`DELETE FROM organizations WHERE id = ${id}`

    await AuditLogger.log({
      userId: "system",
      userEmail: "system@company.com",
      action: AUDIT_ACTIONS.DELETE,
      entityType: "ORGANIZATION",
      entityId: id.toString(),
    })

    revalidatePath("/settings")
    return { success: true }
  } catch (error) {
    console.error("Failed to delete organization:", error)
    return { success: false, error: "Failed to delete organization" }
  }
}
