"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/hooks/use-toast"
import { createRole, updateRole } from "@/lib/actions/role-actions"

interface RoleFormProps {
  role?: any
  onSuccess?: () => void
  onCancel?: () => void
}

export function RoleForm({ role, onSuccess, onCancel }: RoleFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    is_system_role: false,
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    if (role) {
      setFormData({
        name: role.name || "",
        description: role.description || "",
        is_system_role: role.is_system_role || false,
      })
    }
  }, [role])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const submitFormData = new FormData()
      submitFormData.append("name", formData.name)
      submitFormData.append("description", formData.description)
      submitFormData.append("is_system_role", formData.is_system_role.toString())

      let result
      if (role) {
        result = await updateRole(role.id, submitFormData)
      } else {
        result = await createRole(submitFormData)
      }

      if (result.success) {
        toast({
          title: "Success",
          description: `Role ${role ? "updated" : "created"} successfully`,
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
        <CardTitle>{role ? "Edit Role" : "Create New Role"}</CardTitle>
        <CardDescription>{role ? "Update role details" : "Add a new role to the system"}</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Role Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              placeholder="e.g., Risk Manager, Auditor, Admin"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              placeholder="Describe the responsibilities and scope of this role"
              rows={3}
            />
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="is_system_role"
              checked={formData.is_system_role}
              onCheckedChange={(checked) => handleInputChange("is_system_role", checked)}
            />
            <Label htmlFor="is_system_role" className="text-sm">
              System Role (cannot be deleted)
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
              {isSubmitting ? "Saving..." : role ? "Update Role" : "Create Role"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
