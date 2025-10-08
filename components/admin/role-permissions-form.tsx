"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  getPages,
  getPermissions,
  getRolePermissions,
  updateRolePermissions,
  type RolePermissionData,
} from "@/lib/actions/role-actions"
import { useToast } from "@/hooks/use-toast"

interface RolePermissionsFormProps {
  roleId: number
  roleName: string
  onSuccess?: () => void
  onCancel?: () => void
}

export function RolePermissionsForm({ roleId, roleName, onSuccess, onCancel }: RolePermissionsFormProps) {
  const [pages, setPages] = useState<any[]>([])
  const [permissions, setPermissions] = useState<any[]>([])
  const [rolePermissions, setRolePermissions] = useState<any[]>([])
  const [selectedPermissions, setSelectedPermissions] = useState<Set<string>>(new Set())
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    fetchData()
  }, [roleId])

  const fetchData = async () => {
    setIsLoading(true)
    try {
      const [pagesResult, permissionsResult, rolePermissionsResult] = await Promise.all([
        getPages(),
        getPermissions(),
        getRolePermissions(roleId),
      ])

      if (pagesResult.success) setPages(pagesResult.data)
      if (permissionsResult.success) setPermissions(permissionsResult.data)
      if (rolePermissionsResult.success) {
        setRolePermissions(rolePermissionsResult.data)

        // Initialize selected permissions
        const selected = new Set<string>()
        rolePermissionsResult.data.forEach((rp: any) => {
          if (rp.granted) {
            selected.add(`${rp.page_id}-${rp.permission_id}`)
          }
        })
        setSelectedPermissions(selected)
      }
    } catch (error) {
      console.error("Failed to fetch data:", error)
      toast({
        title: "Error",
        description: "Failed to load permissions data",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handlePermissionChange = (pageId: number, permissionId: number, granted: boolean) => {
    const key = `${pageId}-${permissionId}`
    const newSelected = new Set(selectedPermissions)

    if (granted) {
      newSelected.add(key)
    } else {
      newSelected.delete(key)
    }

    setSelectedPermissions(newSelected)
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    try {
      const permissionData: RolePermissionData[] = []

      pages.forEach((page) => {
        permissions.forEach((permission) => {
          const key = `${page.id}-${permission.id}`
          const granted = selectedPermissions.has(key)

          permissionData.push({
            role_id: roleId,
            page_id: page.id,
            permission_id: permission.id,
            granted,
          })
        })
      })

      const result = await updateRolePermissions(roleId, permissionData)

      if (result.success) {
        toast({
          title: "Success",
          description: "Role permissions updated successfully",
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

  const groupedPages = pages.reduce(
    (acc, page) => {
      if (!acc[page.module]) {
        acc[page.module] = []
      }
      acc[page.module].push(page)
      return acc
    },
    {} as Record<string, any[]>,
  )

  if (isLoading) {
    return <div className="flex justify-center p-8">Loading role permissions...</div>
  }

  return (
    <Card className="w-full max-w-6xl mx-auto gradient-card">
      <CardHeader>
        <CardTitle>Manage Page Permissions for {roleName}</CardTitle>
        <CardDescription>Configure page-level access permissions for this role</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {Object.entries(groupedPages).map(([module, modulePages]) => (
          <div key={module} className="space-y-4">
            <div className="flex items-center space-x-2">
              <Badge variant="outline" className="text-sm font-semibold">
                {module}
              </Badge>
            </div>

            <div className="grid gap-4">
              {modulePages.map((page) => (
                <div key={page.id} className="border rounded-lg p-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">{page.name}</h4>
                      <p className="text-sm text-gray-500">{page.path}</p>
                      {page.description && <p className="text-sm text-gray-400">{page.description}</p>}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                    {permissions.map((permission) => {
                      const key = `${page.id}-${permission.id}`
                      const isChecked = selectedPermissions.has(key)

                      return (
                        <div key={permission.id} className="flex items-center space-x-2">
                          <Checkbox
                            id={`${page.id}-${permission.id}`}
                            checked={isChecked}
                            onCheckedChange={(checked) =>
                              handlePermissionChange(page.id, permission.id, checked as boolean)
                            }
                          />
                          <Label htmlFor={`${page.id}-${permission.id}`} className="text-sm">
                            {permission.name}
                          </Label>
                        </div>
                      )
                    })}
                  </div>
                </div>
              ))}
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
            {isSubmitting ? "Saving..." : "Update Permissions"}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
