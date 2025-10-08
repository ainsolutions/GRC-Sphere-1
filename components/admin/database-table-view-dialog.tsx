"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Shield, Database, Users, Building } from "lucide-react"

interface DatabaseTable {
  id: number
  table_name: string
  display_name: string
  description: string
  module: string
  has_organization_filter: boolean
  has_department_filter: boolean
  organization_column: string
  department_column: string
  created_at: string
  updated_at: string
}

interface TablePermission {
  role_name: string
  permission_type: string
  scope: string
}

interface DatabaseTableViewDialogProps {
  table: DatabaseTable
  open: boolean
  onClose: () => void
}

export function DatabaseTableViewDialog({ table, open, onClose }: DatabaseTableViewDialogProps) {
  const [permissions, setPermissions] = useState<TablePermission[]>([])
  const [loading, setLoading] = useState(false)

  const moduleColors = {
    Core: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
    Assets: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
    Risks: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
    Compliance: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
    Audit: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300",
    Incidents: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
    Users: "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300",
    Settings: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300",
    Reports: "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-300",
    Analytics: "bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-300",
  }

  const permissionColors = {
    view: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
    create: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
    edit: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
    delete: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
    export: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
    admin: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300",
  }

  const scopeColors = {
    all: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
    organization: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
    department: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
    own: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
  }

  useEffect(() => {
    if (open && table) {
      fetchPermissions()
    }
  }, [open, table])

  const fetchPermissions = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/database-tables/${table.id}/permissions`)
      if (response.ok) {
        const data = await response.json()
        setPermissions(data)
      }
    } catch (error) {
      console.error("Failed to fetch permissions:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            {table.display_name}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Table Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Table Name</label>
                  <p className="font-mono text-sm bg-muted p-2 rounded">{table.table_name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Display Name</label>
                  <p className="font-medium">{table.display_name}</p>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground">Description</label>
                <p className="text-sm">{table.description || "No description provided"}</p>
              </div>

              <div className="flex items-center gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Module</label>
                  <div className="mt-1">
                    <Badge className={moduleColors[table.module as keyof typeof moduleColors] || moduleColors.Core}>
                      {table.module}
                    </Badge>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Created</label>
                  <p className="text-sm">{new Date(table.created_at).toLocaleDateString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Access Control Configuration */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Access Control Configuration
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Building className="h-4 w-4" />
                    <span className="font-medium">Organization Filter</span>
                    <Badge variant={table.has_organization_filter ? "default" : "secondary"}>
                      {table.has_organization_filter ? "Enabled" : "Disabled"}
                    </Badge>
                  </div>
                  {table.has_organization_filter && (
                    <div className="ml-6">
                      <label className="text-sm font-medium text-muted-foreground">Column</label>
                      <p className="font-mono text-sm bg-muted p-2 rounded">{table.organization_column}</p>
                    </div>
                  )}
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    <span className="font-medium">Department Filter</span>
                    <Badge variant={table.has_department_filter ? "default" : "secondary"}>
                      {table.has_department_filter ? "Enabled" : "Disabled"}
                    </Badge>
                  </div>
                  {table.has_department_filter && (
                    <div className="ml-6">
                      <label className="text-sm font-medium text-muted-foreground">Column</label>
                      <p className="font-mono text-sm bg-muted p-2 rounded">{table.department_column}</p>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Role Permissions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Role Permissions</CardTitle>
              <CardDescription>Roles that have access to this table and their permission levels</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-600"></div>
                </div>
              ) : permissions.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No role permissions configured for this table
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Role</TableHead>
                      <TableHead>Permission</TableHead>
                      <TableHead>Scope</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {permissions.map((permission, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{permission.role_name}</TableCell>
                        <TableCell>
                          <Badge
                            className={
                              permissionColors[permission.permission_type as keyof typeof permissionColors] ||
                              permissionColors.view
                            }
                          >
                            {permission.permission_type}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge
                            className={scopeColors[permission.scope as keyof typeof scopeColors] || scopeColors.all}
                          >
                            {permission.scope}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  )
}
