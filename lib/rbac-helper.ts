import { neon } from "@neondatabase/serverless";
import { initSchemaDBClient } from "@/lib/db";

export interface UserRole {
  pageId: number;
  pageName: string;
  pagePath: string;
  module: string;
  icon: string | null;
  canRead: boolean;
  canCreate: boolean;
  canUpdate: boolean;
  canDelete: boolean;
  parentId: number | null;
  priority: number | null;
}

export async function getUserRole(userId: number, schemaid: string): Promise<UserRole[]> {
  const tenantDb = await initSchemaDBClient(schemaid);

  if (!tenantDb) {
    throw new Error("Failed to initialize tenant database client.");
  }

  const result = (await tenantDb`
    SELECT 

      p.id          AS page_id,
      p.name        AS page_name,
      p.path        AS page_path,
      p.module      AS module,
      p.icon        AS icon,
      p.is_active   AS is_active,
      rpa.can_read,
      rpa.can_create,
      rpa.can_update,
      rpa.can_delete,
      p.parent_id,
      p.priority
    FROM user_roles ur
    INNER JOIN roles r 
      ON r.id = ur.role_id
    INNER JOIN role_page_access rpa 
      ON rpa.role_id = r.id
    INNER JOIN pages p 
      ON p.id = rpa.page_id
    WHERE ur.user_id = ${userId}
      AND rpa.has_access = true
      AND p.is_active = true
  `) as Record<string, any>[];

  return result.map((row: any) => ({
    pageId: Number(row.page_id),
    pageName: row.page_name,
    pagePath: row.page_path,
    module: row.module,
    icon: row.icon,
    canRead: Boolean(row.can_read),
    canCreate: Boolean(row.can_create),
    canUpdate: Boolean(row.can_update),
    canDelete: Boolean(row.can_delete),
    parentId: row.parent_id !== undefined ? (row.parent_id !== null ? Number(row.parent_id) : null) : null,
    priority: row.priority !== undefined ? (row.priority !== null ? Number(row.priority) : null) : null,
  }));
}
