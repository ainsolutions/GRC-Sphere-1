"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableHead, TableHeader, TableRow, TableCell } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Plus, Edit, Trash2, Key } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { getPermissions, deletePermission } from "@/lib/actions/permission-actions"
import { PermissionForm } from "./permission-form"

export function PermissionsManagement() {
  const [permissions, setPermissions] = useState<any[]>([])
  const [showPermissionForm, setShowPermissionForm] = useState(false)
  const [editingPermission, setEditingPermission] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  const fetchPermissions = async () => {
    setIsLoading(true)
    try {
      const result = await getPermissions()
      if (result.success) {
        setPermissions(result.data)
      } else {
        toast({
          title: "Error",
          description: "Failed to load permissions",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Failed to fetch permissions:", error)
      toast({
        title: "Error",
        description: "Failed to load permissions",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchPermissions()
  }, [])

  const handleDeletePermission = async (permissionId: number) => {
    if (confirm("Are you sure you want to delete this permission? This action cannot be undone.")) {
      const result = await deletePermission(permissionId)
      if (result.success) {
        toast({
          title: "Success",
          description: "Permission deleted successfully",
        })
        fetchPermissions()
      } else {
        toast({
          title: "Error",
          description: result.error,
          variant: "destructive",
        })
      }
    }
  }

  const getPermissionTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case "read":
        return "bg-blue-100 text-blue-800"
      case "write":
        return "bg-green-100 text-green-800"
      case "delete":
        return "bg-red-100 text-red-800"
      case "admin":
        return "bg-purple-100 text-purple-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex justify-center items-center py-8">
          <div className="text-center">
            <Key className="h-8 w-8 mx-auto text-gray-400 mb-2" />
            <p>Loading permissions...</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Permission Management</CardTitle>
              <CardDescription>Manage system permissions and access levels</CardDescription>
            </div>
            <Button onClick={() => setShowPermissionForm(true)} className="gradient-bg text-white">
              <Plus className="h-4 w-4 mr-2" />
              Add Permission
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {permissions.length === 0 ? (
            <div className="text-center py-8">
              <Key className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <p className="text-gray-500 mb-4">No permissions found</p>
              <Button onClick={() => setShowPermissionForm(true)} className="gradient-bg text-white">
                <Plus className="h-4 w-4 mr-2" />
                Create First Permission
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Permission Name</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>System Permission</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {permissions.map((permission) => (
                  <TableRow key={permission.id}>
                    <TableCell className="font-medium">{permission.name}</TableCell>
                    <TableCell>{permission.description || "No description"}</TableCell>
                    <TableCell>
                      <Badge className={getPermissionTypeColor(permission.permission_type)}>
                        {permission.permission_type}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={permission.is_system_permission ? "default" : "secondary"}>
                        {permission.is_system_permission ? "System" : "Custom"}
                      </Badge>
                    </TableCell>
                    <TableCell>{new Date(permission.created_at).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setEditingPermission(permission)
                            setShowPermissionForm(true)
                          }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        {!permission.is_system_permission && (
                          <Button size="sm" variant="destructive" onClick={() => handleDeletePermission(permission.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Permission Form Modal */}
      {showPermissionForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <PermissionForm
              permission={editingPermission}
              onSuccess={() => {
                setShowPermissionForm(false)
                setEditingPermission(null)
                fetchPermissions()
              }}
              onCancel={() => {
                setShowPermissionForm(false)
                setEditingPermission(null)
              }}
            />
          </div>
        </div>
      )}
    </>
  )
}
