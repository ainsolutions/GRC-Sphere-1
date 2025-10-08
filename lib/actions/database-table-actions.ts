"use client";



export interface DatabaseTableFormData {
  table_name: string;
  display_name: string;
  description?: string;
  module: string;
  has_organization_filter: boolean;
  has_department_filter: boolean;
  organization_column: string;
  department_column: string;
  created_by_column: string;
  assigned_to_column: string;
}

/** ───────────────────────────────
 *  CRUD operations for tables
 *  ─────────────────────────────── */

export async function getDatabaseTables() {
  try {
    const res = await fetch("/api/database-tables", {
      method: "GET",
      cache: "no-store", // optional, avoids Next.js caching
    })

    if (!res.ok) {
      return { success: false, error: "Failed to fetch database tables", data: [] }
    }

    const result = await res.json()

    // ✅ Always return a clean array
    const tablesArray = Array.isArray(result.data) ? result.data : []

    return { success: true, data: tablesArray }
  } catch (error) {
    console.error("Failed to fetch database tables:", error)
    return { success: false, error: "Unexpected error", data: [] }
  }
}

export async function createDatabaseTable(formData: FormData) {
  const res = await fetch("/api/database-tables", {
    method: "POST",
    body: formData,
  });
  if (!res.ok) {
    const { error } = await res.json();
    throw new Error(error || "Failed to create database table");
  }
  return res.json();                 // newly created table row
}

export async function getDatabaseTableById(id: number) {
  const res = await fetch(`/api/database-tables/${id}`);
  if (!res.ok) throw new Error("Failed to fetch database table");
  return res.json();                 // single table row
}

export async function updateDatabaseTable(id: number, formData: FormData) {
  const res = await fetch(`/api/database-tables/${id}`, {
    method: "PUT",
    body: formData,
  });
  if (!res.ok) {
    const { error } = await res.json();
    throw new Error(error || "Failed to update database table");
  }
  return res.json();                 // updated table row
}

export async function deleteDatabaseTable(id: number) {
  const res = await fetch(`/api/database-tables/${id}`, { method: "DELETE" });
  if (!res.ok) {
    const { error } = await res.json();
    throw new Error(error || "Failed to delete database table");
  }
  return res.json();                 // { success: true }
}

/** ───────────────────────────────
 *  Table permissions
 *  ─────────────────────────────── */

export async function getTablePermissionsByTable(tableId: number) {
  const res = await fetch(`/api/database-tables/${tableId}/permissions`);
  if (!res.ok) throw new Error("Failed to fetch table permissions");
  return res.json();                 // array of permissions for that table
}
