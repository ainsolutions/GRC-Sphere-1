import { getDatabase } from "@/lib/database"

// Only create database connection if DATABASE_URL is properly set
const sql = process.env.DATABASE_URL && process.env.DATABASE_URL !== "your-database-url" 
  ? neon(process.env.DATABASE_URL)
  : null

export interface UserPermissions {
  userId: number
  organizationId: number
  departmentId?: number
  roles: string[]
  pagePermissions: Record<string, string[]>
  tablePermissions: Record<
    string,
    {
      can_view: boolean
      can_create: boolean
      can_edit: boolean
      can_delete: boolean
      can_export: boolean
      scope_filter: string
    }
  >
}

export class PermissionChecker {
  private static cache = new Map<number, { permissions: UserPermissions; expires: number }>()
  private static CACHE_DURATION = 5 * 60 * 1000 // 5 minutes

  static async getUserPermissions(userId: number): Promise<UserPermissions | null> {
    // Check if database is available
    if (!sql) {
      console.warn("Database not configured. Returning null permissions.")
      return null
    }

    // Check cache first
    const cached = this.cache.get(userId)
    if (cached && cached.expires > Date.now()) {
      return cached.permissions
    }

    try {
      // Get user basic info
      const userResult = await sql`
        SELECT u.id, u.organization_id, u.department_id, u.primary_role_id
        FROM users u
        WHERE u.id = ${userId}
      `

      if (userResult.length === 0) {
        return null
      }

      const user = userResult[0]

      // Get user roles
      const rolesResult = await sql`
        SELECT r.name
        FROM user_roles ur
        JOIN roles r ON ur.role_id = r.id
        WHERE ur.user_id = ${userId} AND ur.is_active = TRUE
      `

      const roles = rolesResult.map((r: any) => r.name)

      // Get page permissions
      const pagePermissionsResult = await sql`
        SELECT p.path, perm.name as permission_name
        FROM user_roles ur
        JOIN role_permissions rp ON ur.role_id = rp.role_id
        JOIN pages p ON rp.page_id = p.id
        JOIN permissions perm ON rp.permission_id = perm.id
        WHERE ur.user_id = ${userId} AND ur.is_active = TRUE AND rp.granted = TRUE
      `

      const pagePermissions: Record<string, string[]> = {}
      pagePermissionsResult.forEach((pp: any) => {
        if (!pagePermissions[pp.path]) {
          pagePermissions[pp.path] = []
        }
        pagePermissions[pp.path].push(pp.permission_name)
      })

      // Get table permissions
      const tablePermissionsResult = await sql`
        SELECT dt.table_name, tp.can_view, tp.can_create, tp.can_edit, 
               tp.can_delete, tp.can_export, tp.scope_filter
        FROM user_roles ur
        JOIN table_permissions tp ON ur.role_id = tp.role_id
        JOIN database_tables dt ON tp.table_id = dt.id
        WHERE ur.user_id = ${userId} AND ur.is_active = TRUE
      `

      const tablePermissions: Record<string, any> = {}
      tablePermissionsResult.forEach((tp: any) => {
        tablePermissions[tp.table_name] = {
          can_view: tp.can_view,
          can_create: tp.can_create,
          can_edit: tp.can_edit,
          can_delete: tp.can_delete,
          can_export: tp.can_export,
          scope_filter: tp.scope_filter,
        }
      })

      const permissions: UserPermissions = {
        userId: user.id,
        organizationId: user.organization_id,
        departmentId: user.department_id,
        roles,
        pagePermissions,
        tablePermissions,
      }

      // Cache the result
      this.cache.set(userId, {
        permissions,
        expires: Date.now() + this.CACHE_DURATION,
      })

      return permissions
    } catch (error) {
      console.error("Failed to get user permissions:", error)
      return null
    }
  }

  static async hasPagePermission(userId: number, path: string, permission: string): Promise<boolean> {
    const permissions = await this.getUserPermissions(userId)
    if (!permissions) return false

    // Super admin has all permissions
    if (permissions.roles.includes("Super Admin")) return true

    const pagePerms = permissions.pagePermissions[path] || []
    return pagePerms.includes(permission) || pagePerms.includes("admin")
  }

  static async hasTablePermission(
    userId: number,
    tableName: string,
    permission: "view" | "create" | "edit" | "delete" | "export",
  ): Promise<boolean> {
    const permissions = await this.getUserPermissions(userId)
    if (!permissions) return false

    // Super admin has all permissions
    if (permissions.roles.includes("Super Admin")) return true

    const tablePerms = permissions.tablePermissions[tableName]
    if (!tablePerms) return false

    const permissionKey = `can_${permission}` as keyof typeof tablePerms
    return tablePerms[permissionKey] as boolean
  }

  static async getDataScope(userId: number, tableName: string): Promise<"all" | "organization" | "department" | "own"> {
    const permissions = await this.getUserPermissions(userId)
    if (!permissions) return "own"

    // Super admin sees all data
    if (permissions.roles.includes("Super Admin")) return "all"

    const tablePerms = permissions.tablePermissions[tableName]
    return tablePerms?.scope_filter || "organization"
  }

  static clearCache(userId?: number) {
    if (userId) {
      this.cache.delete(userId)
    } else {
      this.cache.clear()
    }
  }

  static buildScopeFilter(
    userId: number,
    organizationId: number,
    departmentId: number | null,
    scope: "all" | "organization" | "department" | "own",
  ): string {
    switch (scope) {
      case "all":
        return ""
      case "organization":
        return `organization_id = ${organizationId}`
      case "department":
        return departmentId
          ? `organization_id = ${organizationId} AND department_id = ${departmentId}`
          : `organization_id = ${organizationId}`
      case "own":
        return `created_by = ${userId} OR assigned_to = ${userId}`
      default:
        return `organization_id = ${organizationId}`
    }
  }
}

export async function checkPageAccess(userId: number, path: string, permission = "view"): Promise<boolean> {
  return PermissionChecker.hasPagePermission(userId, path, permission)
}

export async function checkTableAccess(
  userId: number,
  tableName: string,
  permission: "view" | "create" | "edit" | "delete" | "export",
): Promise<boolean> {
  return PermissionChecker.hasTablePermission(userId, tableName, permission)
}

export async function getUserDataScope(
  userId: number,
  tableName: string,
): Promise<"all" | "organization" | "department" | "own"> {
  return PermissionChecker.getDataScope(userId, tableName)
}
