"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  getDatabaseTables,
  getTablePermissions,
  updateTablePermissions,
  type TablePermissionData,
} from "@/lib/actions/role-actions"
import { useToast } from "@/hooks/use-toast"

interface TablePermissionsFormProps {
  roleId: number
  roleName: string
  onSuccess?: () => void
  onCancel?: () => void
}

export function TablePermissionsForm({ roleId, roleName, onSuccess, onCancel }: TablePermissionsFormProps) {
  const [tables, setTables] = useState<any[]>([])
  const [tablePermissions, setTablePermissions] = useState<any[]>([])
  const [permissions, setPermissions] = useState<Map<number, TablePermissionData>>(new Map())
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    fetchData()
  }, [roleId])

  const fetchData = async () => {
    setIsLoading(true)
    try {
      const [tablesResult, tablePermissionsResult] = await Promise.all([
        getDatabaseTables(),
        getTablePermissions(roleId),
      ])

      if (tablesResult.success) setTables(tablesResult.data)
      if (tablePermissionsResult.success) {
        setTablePermissions(tablePermissionsResult.data)

        // Initialize permissions map with all tables
        const permissionsMap = new Map<number, TablePermissionData>()

        // First, set default permissions for all tables
        if (tablesResult.success) {
          tablesResult.data.forEach((table: any) => {
            permissionsMap.set(table.id, {
              role_id: roleId,
              table_id: table.id,
              can_view: false,
              can_create: false,
              can_edit: false,
              can_delete: false,
              can_export: false,
              scope_filter: "organization",
            })
          })
        }

        // Then override with existing permissions
        tablePermissionsResult.data.forEach((tp: any) => {
          permissionsMap.set(tp.table_id, {
            role_id: roleId,
            table_id: tp.table_id,
            can_view: tp.can_view,
            can_create: tp.can_create,
            can_edit: tp.can_edit,
            can_delete: tp.can_delete,
            can_export: tp.can_export,
            scope_filter: tp.scope_filter,
          })
        })

        setPermissions(permissionsMap)
      }
    } catch (error) {
      console.error("Failed to fetch data:", error)
      toast({
        title: "Error",
        description: "Failed to load table permissions data",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handlePermissionChange = (tableId: number, field: keyof TablePermissionData, value: any) => {
    // Ensure value is properly converted to boolean for permission fields
    const processedValue = field === "scope_filter" ? value : Boolean(value)

    const currentPermission = permissions.get(tableId) || {
      role_id: roleId,
      table_id: tableId,
      can_view: false,
      can_create: false,
      can_edit: false,
      can_delete: false,
      can_export: false,
      scope_filter: "organization",
    }

    const updatedPermission = {
      ...currentPermission,
      [field]: processedValue,
    }

    // Create a new Map to trigger re-render
    const newPermissions = new Map(permissions)
    newPermissions.set(tableId, updatedPermission)
    setPermissions(newPermissions)

    console.log(`[v0] Permission changed for table ${tableId}, field ${field}, value: ${processedValue}`)
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    try {
      const permissionData = Array.from(permissions.values()).filter(
        (p) => p.can_view || p.can_create || p.can_edit || p.can_delete || p.can_export,
      )

      const result = await updateTablePermissions(roleId, permissionData)

      if (result.success) {
        toast({
          title: "Success",
          description: "Table permissions updated successfully",
        })
        onSuccess?.()
      } else {
        toast({
          title: "Error",
          description: result.error,
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const groupedTables = tables.reduce(
    (acc, table) => {
      if (!acc[table.module]) {
        acc[table.module] = []
      }
      acc[table.module].push(table)
      return acc
    },
    {} as Record<string, any[]>,
  )

  if (isLoading) {
    return <div className="flex justify-center p-8">Loading table permissions...</div>
  }

  return (
    <Card className="w-full max-w-6xl mx-auto gradient-card">
      <CardHeader>
        <CardTitle>Manage Database Permissions for {roleName}</CardTitle>
        <CardDescription>Configure table-level access permissions and data scope for this role</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {Object.entries(groupedTables).map(([module, moduleTables]) => (
          <div key={module} className="space-y-4">
            <div className="flex items-center space-x-2">
              <Badge variant="outline" className="text-sm font-semibold">
                {module}
              </Badge>
            </div>

            <div className="grid gap-4">
              {moduleTables.map((table) => {
                const permission = permissions.get(table.id) || {
                  role_id: roleId,
                  table_id: table.id,
                  can_view: false,
                  can_create: false,
                  can_edit: false,
                  can_delete: false,
                  can_export: false,
                  scope_filter: "organization",
                }

                return (
                  <div key={table.id} className="border rounded-lg p-4 space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">{table.display_name}</h4>
                        <p className="text-sm text-gray-500">{table.table_name}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id={`${table.id}-view`}
                          checked={permission.can_view}
                          onCheckedChange={(checked) => {
                            const booleanValue = checked === true
                            handlePermissionChange(table.id, "can_view", booleanValue)
                          }}
                        />
                        <Label htmlFor={`${table.id}-view`} className="text-sm">
                          View
                        </Label>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id={`${table.id}-create`}
                          checked={permission.can_create}
                          onCheckedChange={(checked) => {
                            const booleanValue = checked === true
                            handlePermissionChange(table.id, "can_create", booleanValue)
                          }}
                        />
                        <Label htmlFor={`${table.id}-create`} className="text-sm">
                          Create
                        </Label>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id={`${table.id}-edit`}
                          checked={permission.can_edit}
                          onCheckedChange={(checked) => {
                            const booleanValue = checked === true
                            handlePermissionChange(table.id, "can_edit", booleanValue)
                          }}
                        />
                        <Label htmlFor={`${table.id}-edit`} className="text-sm">
                          Edit
                        </Label>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id={`${table.id}-delete`}
                          checked={permission.can_delete}
                          onCheckedChange={(checked) => {
                            const booleanValue = checked === true
                            handlePermissionChange(table.id, "can_delete", booleanValue)
                          }}
                        />
                        <Label htmlFor={`${table.id}-delete`} className="text-sm">
                          Delete
                        </Label>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id={`${table.id}-export`}
                          checked={permission.can_export}
                          onCheckedChange={(checked) => {
                            const booleanValue = checked === true
                            handlePermissionChange(table.id, "can_export", booleanValue)
                          }}
                        />
                        <Label htmlFor={`${table.id}-export`} className="text-sm">
                          Export
                        </Label>
                      </div>

                      <div className="space-y-2">
                        <Label className="text-sm">Data Scope</Label>
                        <Select
                          value={permission.scope_filter}
                          onValueChange={(value) => handlePermissionChange(table.id, "scope_filter", value)}
                        >
                          <SelectTrigger className="h-8">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Data</SelectItem>
                            <SelectItem value="organization">Organization Only</SelectItem>
                            <SelectItem value="department">Department Only</SelectItem>
                            <SelectItem value="own">Own Records Only</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            <Separator />
          </div>
        ))}

        <div className="flex justify-end space-x-4 pt-4">
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          )}
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 text-white"
          >
            {isSubmitting ? "Saving..." : "Update Table Permissions"}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
