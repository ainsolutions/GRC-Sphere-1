"use client"; 

export interface RoleFormData {
  name: string
  description?: string
  is_system_role?: boolean
}

export interface RolePermissionData {
  role_id: number
  page_id: number
  permission_id: number
  granted: boolean
}

export interface TablePermissionData {
  role_id: number
  table_id: number
  can_view: boolean
  can_create: boolean
  can_edit: boolean
  can_delete: boolean
  can_export: boolean
  scope_filter: string
}

/* ----------------------------  Roles  ---------------------------- */

export async function createRole(formData: FormData) {
  const res = await fetch("/api/roles", {
    method: "POST",
    body: formData,
  });
  if (!res.ok) return { success: false, error: "Failed to create role" };
  return { success: true, data: await res.json() };
}

export async function getRoles() {
  try {
    const res = await fetch("/api/roles", {
      method: "GET",
      cache: "no-store", // avoid Next.js caching
    });

    if (!res.ok) {
      return { success: false, error: "Failed to fetch roles", data: [] };
    }

    const result = await res.json();

    // ✅ Always return a clean array
    const rolesArray = Array.isArray(result.data) ? result.data : [];

    return { success: true, data: rolesArray };
  } catch (error) {
    console.error("Failed to fetch roles:", error);
    return { success: false, error: "Unexpected error", data: [] };
  }
}

export async function updateRole(id: number, formData: FormData) {
  const res = await fetch(`/api/roles/${id}`, {
    method: "PUT",
    body: formData,
  });
  if (!res.ok) return { success: false, error: "Failed to update role" };
  return { success: true, data: await res.json() };
}

export async function deleteRole(id: number) {
  const res = await fetch(`/api/roles/${id}`, { method: "DELETE" });
  if (!res.ok) return { success: false, error: "Failed to delete role" };
  return { success: true };
}

/* ------------------------ Pages & Permissions --------------------- */

export async function getPages() {
  const res = await fetch("/api/pages"); // adjust if you expose a pages route
  if (!res.ok) return { success: false, error: "Failed to get pages", data: [] };
  return { success: true, data: await res.json() };
}

export async function getPermissions() {
  const res = await fetch("/api/permissions");
  if (!res.ok) return { success: false, error: "Failed to get permissions", data: [] };
  return { success: true, data: await res.json() };
}

/* ---------------------- Role Page Permissions --------------------- */

export async function getRolePermissions(roleId: number) {
  const res = await fetch(`/api/roles/${roleId}/permissions`);
  if (!res.ok) return { success: false, error: "Failed to get role permissions", data: [] };
  return { success: true, data: await res.json() };
}

export async function updateRolePermissions(roleId: number, permissions: RolePermissionData[]) {
  const res = await fetch(`/api/roles/${roleId}/permissions`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ permissions }),
  });
  if (!res.ok) return { success: false, error: "Failed to update role permissions" };
  return { success: true };
}

/* ---------------------- Table Permissions ------------------------- */

export async function getDatabaseTables() {
  const res = await fetch("/api/database-tables");
  if (!res.ok) return { success: false, error: "Failed to get database tables", data: [] };
  return { success: true, data: await res.json() };
}

export async function getTablePermissions(roleId: number) {
  const res = await fetch(`/api/roles/${roleId}/table-permissions`);
  if (!res.ok) return { success: false, error: "Failed to get table permissions", data: [] };
  return { success: true, data: await res.json() };
}

export async function updateTablePermissions(roleId: number, permissions: TablePermissionData[]) {
  const res = await fetch(`/api/roles/${roleId}/table-permissions`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ permissions }),
  });
  if (!res.ok) return { success: false, error: "Failed to update table permissions" };
  return { success: true };
}

/* ---------------------- User-Role Assignment ---------------------- */

export async function assignUserRole(userId: number, roleId: number, assignedBy = 1) {
  const res = await fetch(`/api/user-roles`, { // create route if needed
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId, roleId, assignedBy }),
  });
  if (!res.ok) return { success: false, error: "Failed to assign user role" };
  return { success: true, data: await res.json() };
}

export async function removeUserRole(userId: number, roleId: number) {
  const res = await fetch(`/api/user-roles`, { // create route if needed
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId, roleId }),
  });
  if (!res.ok) return { success: false, error: "Failed to remove user role" };
  return { success: true };
}

export async function getUserRoles(userId: number) {
  const res = await fetch(`/api/users/${userId}/roles`); // create route if needed
  if (!res.ok) return { success: false, error: "Failed to get user roles", data: [] };
  return { success: true, data: await res.json() };
}
