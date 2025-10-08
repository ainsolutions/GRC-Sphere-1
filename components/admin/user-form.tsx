"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { createUser, updateUser } from "@/lib/actions/user-actions"
import { getOrganizations } from "@/lib/actions/organization-actions"
import { getDepartments } from "@/lib/actions/department-actions"
import { useToast } from "@/hooks/use-toast"
import { Checkbox } from "@/components/ui/checkbox"
import { getRoles, assignUserRole, removeUserRole, getUserRoles } from "@/lib/actions/role-actions"

interface UserFormProps {
  user?: any
  onSuccess?: () => void
  onCancel?: () => void
}

export function UserForm({ user, onSuccess, onCancel }: UserFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [organizations, setOrganizations] = useState([])
  const [departments, setDepartments] = useState([])
  const [selectedOrgId, setSelectedOrgId] = useState<string>(user?.organization_id?.toString() || "")
  const [selectedDeptId, setSelectedDeptId] = useState<string>(user?.department_id?.toString() || "")
  const { toast } = useToast()
  const [roles, setRoles] = useState([])
  const [userRoles, setUserRoles] = useState([])
  const [selectedRoles, setSelectedRoles] = useState<number[]>([])

  useEffect(() => {
    const fetchData = async () => {
      const [orgsResult, deptsResult, rolesResult] = await Promise.all([
        getOrganizations(),
        getDepartments(),
        getRoles(),
      ])

      if (orgsResult.success) setOrganizations(orgsResult.data)
      if (deptsResult.success) setDepartments(deptsResult.data)
      if (rolesResult.success) setRoles(rolesResult.data)

      // If editing user, fetch their current roles
      if (user) {
        const userRolesResult = await getUserRoles(user.id)
        if (userRolesResult.success) {
          setUserRoles(userRolesResult.data)
          setSelectedRoles(userRolesResult.data.map((ur: any) => ur.role_id))
        }
      }
    }

    fetchData()
  }, [user])

  const handleSubmit = async (formData: FormData) => {
    setIsSubmitting(true)

    try {
      // Ensure the select values are properly set in FormData
      if (selectedOrgId && selectedOrgId !== "") {
        formData.set("organization_id", selectedOrgId)
      }
      if (selectedDeptId && selectedDeptId !== "" && selectedDeptId !== "none") {
        formData.set("department_id", selectedDeptId)
      } else {
        formData.delete("department_id")
      }

      let result
      if (user) {
        // Update existing user
        result = await updateUser(user.id, formData)
      } else {
        // Create new user
        result = await createUser(formData)
      }

      if (result.success) {
        const userId = user ? user.id : result.data.id

        // Handle role assignments
        if (user) {
          // Remove old roles that are no longer selected
          const rolesToRemove = userRoles
            .filter((ur: any) => !selectedRoles.includes(ur.role_id))
            .map((ur: any) => ur.role_id)

          for (const roleId of rolesToRemove) {
            await removeUserRole(userId, roleId)
          }
        }

        // Add new roles
        const currentRoleIds = user ? userRoles.map((ur: any) => ur.role_id) : []
        const rolesToAdd = selectedRoles.filter((roleId) => !currentRoleIds.includes(roleId))

        for (const roleId of rolesToAdd) {
          await assignUserRole(userId, roleId)
        }

        toast({
          title: "Success",
          description: user ? "User updated successfully" : "User created successfully",
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

  return (
    <Card className="w-full max-w-2xl mx-auto gradient-card">
      <CardHeader>
        <CardTitle>{user ? "Edit User" : "Add New User"}</CardTitle>
        <CardDescription>{user ? "Update user details" : "Create a new user account"}</CardDescription>
      </CardHeader>
      <CardContent>
        <form action={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="organization_id">Organization *</Label>
              <Select value={selectedOrgId} onValueChange={setSelectedOrgId} required>
                <SelectTrigger>
                  <SelectValue placeholder="Select organization" />
                </SelectTrigger>
                <SelectContent>
                  {organizations.map((org: any) => (
                    <SelectItem key={org.id} value={org.id.toString()}>
                      {org.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="department_id">Department</Label>
              <Select value={selectedDeptId} onValueChange={setSelectedDeptId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select department (optional)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  {departments
                    .filter((dept: any) => !selectedOrgId || dept.organization_id.toString() === selectedOrgId)
                    .map((dept: any) => (
                      <SelectItem key={dept.id} value={dept.id.toString()}>
                        {dept.name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="first_name">First Name *</Label>
              <Input
                id="first_name"
                name="first_name"
                defaultValue={user?.first_name || ""}
                placeholder="Enter first name"
                required
                className="border-purple-200 focus:border-cyan-500 focus:ring-cyan-500 dark:bg-gradient-to-r dark:from-slate-900/80 dark:to-blue-950/80 dark:border-blue-800/50 dark:text-white"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="last_name">Last Name *</Label>
              <Input
                id="last_name"
                name="last_name"
                defaultValue={user?.last_name || ""}
                placeholder="Enter last name"
                required
                className="border-purple-200 focus:border-cyan-500 focus:ring-cyan-500 dark:bg-gradient-to-r dark:from-slate-900/80 dark:to-blue-950/80 dark:border-blue-800/50 dark:text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username *</Label>
              <Input
                id="username"
                name="username"
                defaultValue={user?.username || ""}
                placeholder="Enter username"
                required
                className="border-purple-200 focus:border-cyan-500 focus:ring-cyan-500 dark:bg-gradient-to-r dark:from-slate-900/80 dark:to-blue-950/80 dark:border-blue-800/50 dark:text-white"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                name="email"
                type="email"
                defaultValue={user?.email || ""}
                placeholder="Enter email address"
                required
                className="border-purple-200 focus:border-cyan-500 focus:ring-cyan-500 dark:bg-gradient-to-r dark:from-slate-900/80 dark:to-blue-950/80 dark:border-blue-800/50 dark:text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                name="phone"
                defaultValue={user?.phone || ""}
                placeholder="Enter phone number"
                className="border-purple-200 focus:border-cyan-500 focus:ring-cyan-500 dark:bg-gradient-to-r dark:from-slate-900/80 dark:to-blue-950/80 dark:border-blue-800/50 dark:text-white"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="job_title">Job Title</Label>
              <Input
                id="job_title"
                name="job_title"
                defaultValue={user?.job_title || ""}
                placeholder="Enter job title"
                className="border-purple-200 focus:border-cyan-500 focus:ring-cyan-500 dark:bg-gradient-to-r dark:from-slate-900/80 dark:to-blue-950/80 dark:border-blue-800/50 dark:text-white"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Status *</Label>
            <Select name="status" defaultValue={user?.status || "Active"} required>
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Inactive">Inactive</SelectItem>
                <SelectItem value="Suspended">Suspended</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Assigned Roles</Label>
            <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto border rounded-md p-3">
              {roles.map((role: any) => (
                <div key={role.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`role-${role.id}`}
                    checked={selectedRoles.includes(role.id)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setSelectedRoles([...selectedRoles, role.id])
                      } else {
                        setSelectedRoles(selectedRoles.filter((id) => id !== role.id))
                      }
                    }}
                  />
                  <Label htmlFor={`role-${role.id}`} className="text-sm">
                    {role.name}
                  </Label>
                </div>
              ))}
            </div>
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
              className="bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 text-white dark:from-blue-600 dark:via-blue-700 dark:to-blue-800"
            >
              {isSubmitting ? "Saving..." : user ? "Update User" : "Create User"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
