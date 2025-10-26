import { neon } from "@neondatabase/serverless";
import { initSchemaDBClient } from "@/lib/db";

export async function getUserRole(userId: number, schemaid: string): Promise<[]> {
  const tenantDb = await initSchemaDBClient(schemaid);

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
      rpa.can_delete
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
  `) as Record<string, string>[];

  return result.map((row: any) => ({
    pageId: row.page_id,
    pageName: row.page_name,
    pagePath: row.page_path,
    module: row.module,
    icon: row.icon,
    canRead: row.can_read,
    canCreate: row.can_create,
    canUpdate: row.can_update,
    canDelete: row.can_delete,
  }));
}
