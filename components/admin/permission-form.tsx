"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/hooks/use-toast"
import { createPermission, updatePermission } from "@/lib/actions/permission-actions"

interface PermissionFormProps {
  permission?: any
  onSuccess?: () => void
  onCancel?: () => void
}

export function PermissionForm({ permission, onSuccess, onCancel }: PermissionFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    permission_type: "read",
    is_system_permission: false,
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    if (permission) {
      setFormData({
        name: permission.name || "",
        description: permission.description || "",
        permission_type: permission.permission_type || "read",
        is_system_permission: permission.is_system_permission || false,
      })
    }
  }, [permission])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const submitFormData = new FormData()
      submitFormData.append("name", formData.name)
      submitFormData.append("description", formData.description)
      submitFormData.append("permission_type", formData.permission_type)
      submitFormData.append("is_system_permission", formData.is_system_permission.toString())

      let result
      if (permission) {
        result = await updatePermission(permission.id, submitFormData)
      } else {
        result = await createPermission(submitFormData)
      }

      if (result.success) {
        toast({
          title: "Success",
          description: `Permission ${permission ? "updated" : "created"} successfully`,
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

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  return (
    <Card className="w-full gradient-card">
      <CardHeader>
        <CardTitle>{permission ? "Edit Permission" : "Create New Permission"}</CardTitle>
        <CardDescription>
          {permission ? "Update permission details" : "Add a new permission to the system"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="name">Permission Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                placeholder="e.g., view, create, edit, delete"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="permission_type">Permission Type *</Label>
              <Select
                value={formData.permission_type}
                onValueChange={(value) => handleInputChange("permission_type", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select permission type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="read">Read</SelectItem>
                  <SelectItem value="write">Write</SelectItem>
                  <SelectItem value="delete">Delete</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="export">Export</SelectItem>
                  <SelectItem value="import">Import</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              placeholder="Describe what this permission allows users to do"
              rows={3}
            />
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="is_system_permission"
              checked={formData.is_system_permission}
              onCheckedChange={(checked) => handleInputChange("is_system_permission", checked)}
            />
            <Label htmlFor="is_system_permission" className="text-sm">
              System Permission (cannot be deleted)
            </Label>
          </div>

          <div className="flex justify-end space-x-4 pt-4">
            {onCancel && (
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancel
              </Button>
            )}
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 text-white"
            >
              {isSubmitting ? "Saving..." : permission ? "Update Permission" : "Create Permission"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
