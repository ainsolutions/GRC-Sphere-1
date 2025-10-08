"use client"


export interface PermissionFormData {
  name: string
  description?: string
  permission_type: string
  is_system_permission?: boolean
}

// Create a new permission
export async function createPermission(formData: FormData) {
  const res = await fetch("/api/permissions", {
    method: "POST",
    body: formData,
  })
  if (!res.ok) throw new Error("Failed to create permission")
  const data = await res.json()
  return { success: true, data }
}

// Get all permissions
export async function getPermissions() {
  try {
    const res = await fetch("/api/permissions", {
      method: "GET",
      cache: "no-store",  // optional: avoid Next.js caching
    })

    if (!res.ok) {
      return { success: false, error: "Failed to fetch permissions", data: [] }
    }

    const result = await res.json()

    // Ensure frontend always gets a clean array
    const permissionsArray = Array.isArray(result.data) ? result.data : []

    return { success: true, data: permissionsArray }
  } catch (error) {
    console.error("Failed to fetch permissions:", error)
    return { success: false, error: "Unexpected error", data: [] }
  }
}

// Get one permission by ID
export async function getPermissionById(id: number) {
  const res = await fetch(`/api/permissions/${id}`)
  if (res.status === 404) {
    return { success: false, error: "Permission not found", data: null }
  }
  if (!res.ok) throw new Error("Failed to get permission")
  const data = await res.json()
  return { success: true, data }
}

// Update a permission
export async function updatePermission(id: number, formData: FormData) {
  const res = await fetch(`/api/permissions/${id}`, {
    method: "PUT",
    body: formData,
  })
  if (!res.ok) {
    const { error } = await res.json().catch(() => ({ error: "Failed to update permission" }))
    return { success: false, error }
  }
  const data = await res.json()
  return { success: true, data }
}

// Delete a permission
export async function deletePermission(id: number) {
  const res = await fetch(`/api/permissions/${id}`, { method: "DELETE" })
  if (!res.ok) {
    const { error } = await res.json().catch(() => ({ error: "Failed to delete permission" }))
    return { success: false, error }
  }
  return { success: true }
}

// Get the roles that currently use a permission
export async function getPermissionUsage(id: number) {
  const res = await fetch(`/api/permissions/${id}/usage`)
  if (!res.ok) throw new Error("Failed to get permission usage")
  const data = await res.json()
  return { success: true, data }
}

// Bulk create permissions
export async function bulkCreatePermissions(permissions: PermissionFormData[]) {
  const res = await fetch("/api/permissions", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(permissions),
  })
  if (!res.ok) {
    const { error } = await res.json().catch(() => ({ error: "Failed to bulk create permissions" }))
    return { success: false, error }
  }
  const data = await res.json()
  return { success: true, data }
}
