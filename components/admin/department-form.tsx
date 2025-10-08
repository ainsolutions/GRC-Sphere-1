"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { createDepartment, updateDepartment } from "@/lib/actions/department-actions"
import { getOrganizations } from "@/lib/actions/organization-actions"
import { getDepartments } from "@/lib/actions/department-actions"
import { toast } from "@/components/ui/use-toast"

interface DepartmentFormProps {
  department?: any
  onSuccess?: () => void
  onCancel?: () => void
}

export function DepartmentForm({ department, onSuccess, onCancel }: DepartmentFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [organizations, setOrganizations] = useState([])
  const [departments, setDepartments] = useState([])
  const [selectedOrgId, setSelectedOrgId] = useState(department?.organization_id?.toString() || "")

  useEffect(() => {
    const fetchData = async () => {
      const [orgsResult, deptsResult] = await Promise.all([getOrganizations(), getDepartments()])

      if (orgsResult.success) setOrganizations(orgsResult.data)
      if (deptsResult.success) setDepartments(deptsResult.data)
    }

    fetchData()
  }, [])

  const handleSubmit = async (formData: FormData) => {
    setIsSubmitting(true)

    try {
      // Ensure organization_id is set correctly
      if (selectedOrgId) {
        formData.set("organization_id", selectedOrgId)
      }

      // Handle parent_department_id properly
      const parentDeptId = formData.get("parent_department_id") as string
      if (!parentDeptId || parentDeptId === "none" || parentDeptId === "") {
        formData.delete("parent_department_id")
      }

      let result
      if (department) {
        result = await updateDepartment(department.id, formData)
      } else {
        result = await createDepartment(formData)
      }

      if (result.success) {
        toast({
          title: "Success",
          description: `Department ${department ? "updated" : "created"} successfully`,
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

  // Filter departments to exclude the current one (for parent selection)
  const availableParentDepartments = departments.filter((dept: any) => dept.id !== department?.id)

  return (
    <Card className="w-full max-w-2xl mx-auto gradient-card">
      <CardHeader>
        <CardTitle>{department ? "Edit Department" : "Add New Department"}</CardTitle>
        <CardDescription>{department ? "Update department details" : "Create a new department"}</CardDescription>
      </CardHeader>
      <CardContent>
        <form action={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="organization_id">Organization *</Label>
              <Select name="organization_id" value={selectedOrgId} onValueChange={setSelectedOrgId} required>
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
              <Label htmlFor="name">Department Name *</Label>
              <Input
                id="name"
                name="name"
                defaultValue={department?.name || ""}
                placeholder="Enter department name"
                required
                className="border-purple-200 focus:border-cyan-500 focus:ring-cyan-500 dark:bg-gradient-to-r dark:from-slate-900/80 dark:to-blue-950/80 dark:border-blue-800/50 dark:text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="parent_department_id">Parent Department</Label>
              <Select name="parent_department_id" defaultValue={department?.parent_department_id?.toString() || "none"}>
                <SelectTrigger>
                  <SelectValue placeholder="Select parent department" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  {availableParentDepartments
                    .filter((dept: any) => dept.organization_id.toString() === selectedOrgId)
                    .map((dept: any) => (
                      <SelectItem key={dept.id} value={dept.id.toString()}>
                        {dept.name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="department_head">Department Head</Label>
              <Input
                id="department_head"
                name="department_head"
                defaultValue={department?.department_head || ""}
                placeholder="Enter department head name"
                className="border-purple-200 focus:border-cyan-500 focus:ring-cyan-500 dark:bg-gradient-to-r dark:from-slate-900/80 dark:to-blue-950/80 dark:border-blue-800/50 dark:text-white"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              defaultValue={department?.description || ""}
              placeholder="Enter department description"
              rows={3}
              className="border-purple-200 focus:border-cyan-500 focus:ring-cyan-500 dark:bg-gradient-to-r dark:from-slate-900/80 dark:to-blue-950/80 dark:border-blue-800/50 dark:text-white"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="budget">Budget</Label>
              <Input
                id="budget"
                name="budget"
                type="number"
                step="0.01"
                defaultValue={department?.budget || ""}
                placeholder="Enter budget amount"
                className="border-purple-200 focus:border-cyan-500 focus:ring-cyan-500 dark:bg-gradient-to-r dark:from-slate-900/80 dark:to-blue-950/80 dark:border-blue-800/50 dark:text-white"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cost_center">Cost Center</Label>
              <Input
                id="cost_center"
                name="cost_center"
                defaultValue={department?.cost_center || ""}
                placeholder="Enter cost center code"
                className="border-purple-200 focus:border-cyan-500 focus:ring-cyan-500 dark:bg-gradient-to-r dark:from-slate-900/80 dark:to-blue-950/80 dark:border-blue-800/50 dark:text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                name="phone"
                defaultValue={department?.phone || ""}
                placeholder="Enter phone number"
                className="border-purple-200 focus:border-cyan-500 focus:ring-cyan-500 dark:bg-gradient-to-r dark:from-slate-900/80 dark:to-blue-950/80 dark:border-blue-800/50 dark:text-white"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                defaultValue={department?.email || ""}
                placeholder="Enter email address"
                className="border-purple-200 focus:border-cyan-500 focus:ring-cyan-500 dark:bg-gradient-to-r dark:from-slate-900/80 dark:to-blue-950/80 dark:border-blue-800/50 dark:text-white"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                name="location"
                defaultValue={department?.location || ""}
                placeholder="Enter location"
                className="border-purple-200 focus:border-cyan-500 focus:ring-cyan-500 dark:bg-gradient-to-r dark:from-slate-900/80 dark:to-blue-950/80 dark:border-blue-800/50 dark:text-white"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Status *</Label>
            <Select name="status" defaultValue={department?.status || "Active"} required>
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
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
              {isSubmitting ? "Saving..." : department ? "Update Department" : "Create Department"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
