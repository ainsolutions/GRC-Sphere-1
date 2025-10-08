"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  createFinding,
  updateFinding,
  getAssessments,
  getUsers,
  type FindingFormData,
} from "@/lib/actions/findings-actions"
import { getOrganizations } from "@/lib/actions/organization-actions"
import { getDepartments } from "@/lib/actions/department-actions"
import { useToast } from "@/hooks/use-toast"

interface FindingFormProps {
  finding?: any
  assessmentId?: number
  onSuccess?: () => void
  onCancel?: () => void
}

export function FindingForm({ finding, assessmentId, onSuccess, onCancel }: FindingFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [assessments, setAssessments] = useState<any[]>([])
  const [organizations, setOrganizations] = useState<any[]>([])
  const [departments, setDepartments] = useState<any[]>([])
  const [users, setUsers] = useState<any[]>([])
  const [selectedAssessmentId, setSelectedAssessmentId] = useState(assessmentId || finding?.assessment_id || "")
  const [selectedOrgId, setSelectedOrgId] = useState(finding?.organization_id || "")
  const [selectedDeptId, setSelectedDeptId] = useState(finding?.department_id || "")
  const [selectedUserId, setSelectedUserId] = useState(finding?.user_id || "")
  const { toast } = useToast()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [assessmentsResult, orgsResult] = await Promise.all([getAssessments(), getOrganizations()])

        if (assessmentsResult.success) {
          setAssessments(assessmentsResult.data)
        }
        if (orgsResult.success) {
          setOrganizations(orgsResult.data)
        }
      } catch (error) {
        console.error("Failed to fetch form data:", error)
      }
    }

    fetchData()
  }, [])

  useEffect(() => {
    const fetchDepartments = async () => {
      if (selectedOrgId) {
        try {
          const result = await getDepartments(Number(selectedOrgId))
          if (result.success) {
            setDepartments(result.data)
          }
        } catch (error) {
          console.error("Failed to fetch departments:", error)
        }
      } else {
        setDepartments([])
        setSelectedDeptId("")
      }
    }

    fetchDepartments()
  }, [selectedOrgId])

  useEffect(() => {
    const fetchUsers = async () => {
      if (selectedOrgId) {
        try {
          const result = await getUsers(Number(selectedOrgId), selectedDeptId ? Number(selectedDeptId) : undefined)
          if (result.success) {
            setUsers(result.data)
          }
        } catch (error) {
          console.error("Failed to fetch users:", error)
        }
      } else {
        setUsers([])
        setSelectedUserId("")
      }
    }

    fetchUsers()
  }, [selectedOrgId, selectedDeptId])

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsSubmitting(true)

    const formData = new FormData(event.currentTarget)

    // Set the form data with proper values
    formData.set("assessment_id", selectedAssessmentId.toString())
    formData.set("organization_id", selectedOrgId.toString())
    if (selectedDeptId) formData.set("department_id", selectedDeptId.toString())
    if (selectedUserId) formData.set("user_id", selectedUserId.toString())

    const data: FindingFormData = {
      assessment_id: Number(selectedAssessmentId),
      finding_title: formData.get("finding_title") as string,
      finding_description: formData.get("finding_description") as string,
      severity: formData.get("severity") as string,
      category: formData.get("category") as string,
      recommendation: formData.get("recommendation") as string,
      status: formData.get("status") as string,
      organization_id: selectedOrgId ? Number(selectedOrgId) : undefined,
      department_id: selectedDeptId ? Number(selectedDeptId) : undefined,
      user_id: selectedUserId ? Number(selectedUserId) : undefined,
      due_date: (formData.get("due_date") as string) || undefined,
      assigned_to: (formData.get("assigned_to") as string) || undefined,
    }

    try {
      let result
      if (finding) {
        result = await updateFinding(finding.id, data)
      } else {
        result = await createFinding(data)
      }

      if (result.success) {
        toast({
          title: "Success",
          description: `Finding ${finding ? "updated" : "created"} successfully`,
        })
        onSuccess?.()
      } else {
        toast({
          title: "Error",
          description: result.error || `Failed to ${finding ? "update" : "create"} finding`,
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to ${finding ? "update" : "create"} finding`,
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const selectedAssessment = assessments.find((a) => a.id === Number(selectedAssessmentId))
  const selectedOrganization = organizations.find((o) => o.id === Number(selectedOrgId))
  const selectedDepartment = departments.find((d) => d.id === Number(selectedDeptId))
  const selectedUser = users.find((u) => u.id === Number(selectedUserId))

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Context Information */}
      <Card className="gradient-card form-gradient">
        <CardHeader>
          <CardTitle className="text-lg">Finding Context</CardTitle>
          <CardDescription>Link this finding to assessment, organization, department, and user</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="assessment_id">Assessment *</Label>
              <Select value={selectedAssessmentId.toString()} onValueChange={setSelectedAssessmentId} required>
                <SelectTrigger>
                  <SelectValue placeholder="Select assessment" />
                </SelectTrigger>
                <SelectContent>
                  {assessments.map((assessment) => (
                    <SelectItem key={assessment.id} value={assessment.id.toString()}>
                      <div className="flex flex-col">
                        <span className="font-medium">{assessment.assessment_name}</span>
                        <span className="text-sm text-muted-foreground">
                          {assessment.assessment_id} • {assessment.organization_name}
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="organization_id">Organization *</Label>
              <Select value={selectedOrgId.toString()} onValueChange={setSelectedOrgId} required>
                <SelectTrigger>
                  <SelectValue placeholder="Select organization" />
                </SelectTrigger>
                <SelectContent>
                  {organizations.map((org) => (
                    <SelectItem key={org.id} value={org.id.toString()}>
                      {org.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="department_id">Department</Label>
              <Select value={selectedDeptId.toString()} onValueChange={setSelectedDeptId} disabled={!selectedOrgId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select department" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="no_department">No Department</SelectItem>
                  {departments.map((dept) => (
                    <SelectItem key={dept.id} value={dept.id.toString()}>
                      {dept.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="user_id">Reporter/User</Label>
              <Select value={selectedUserId.toString()} onValueChange={setSelectedUserId} disabled={!selectedOrgId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select user" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="no_user">No User</SelectItem>
                  {users.map((user) => (
                    <SelectItem key={user.id} value={user.id.toString()}>
                      <div className="flex flex-col">
                        <span className="font-medium">
                          {user.first_name} {user.last_name}
                        </span>
                        <span className="text-sm text-muted-foreground">
                          @{user.username} • {user.department_name || "No Department"}
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Context Summary */}
          {(selectedAssessment || selectedOrganization || selectedDepartment || selectedUser) && (
            <div className="mt-4 p-4 bg-muted rounded-lg">
              <h4 className="font-medium mb-2">Finding Context Summary:</h4>
              <div className="flex flex-wrap gap-2">
                {selectedAssessment && (
                  <Badge variant="outline">Assessment: {selectedAssessment.assessment_name}</Badge>
                )}
                {selectedOrganization && <Badge variant="outline">Org: {selectedOrganization.name}</Badge>}
                {selectedDepartment && <Badge variant="outline">Dept: {selectedDepartment.name}</Badge>}
                {selectedUser && (
                  <Badge variant="outline">
                    User: {selectedUser.first_name} {selectedUser.last_name}
                  </Badge>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Finding Details */}
      <Card className="gradient-card form-gradient">
        <CardHeader>
          <CardTitle className="text-lg">Finding Details</CardTitle>
          <CardDescription>Provide detailed information about the finding</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="finding_title">Finding Title *</Label>
              <Input
                id="finding_title"
                name="finding_title"
                defaultValue={finding?.finding_title || ""}
                placeholder="Enter finding title"
                required
                className="border-purple-200 focus:border-cyan-500 focus:ring-cyan-500 dark:bg-gradient-to-r dark:from-slate-900/80 dark:to-blue-950/80 dark:border-blue-800/50 dark:text-white dark:placeholder-slate-400"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="severity">Severity *</Label>
              <Select name="severity" defaultValue={finding?.severity || ""} required>
                <SelectTrigger>
                  <SelectValue placeholder="Select severity" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Critical">🔴 Critical</SelectItem>
                  <SelectItem value="High">🟠 High</SelectItem>
                  <SelectItem value="Medium">🟡 Medium</SelectItem>
                  <SelectItem value="Low">🟢 Low</SelectItem>
                  <SelectItem value="Informational">ℹ️ Informational</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="finding_description">Finding Description *</Label>
            <Textarea
              id="finding_description"
              name="finding_description"
              defaultValue={finding?.finding_description || ""}
              placeholder="Describe the finding in detail"
              rows={4}
              required
              className="border-purple-200 focus:border-cyan-500 focus:ring-cyan-500 dark:bg-gradient-to-r dark:from-slate-900/80 dark:to-blue-950/80 dark:border-blue-800/50 dark:text-white dark:placeholder-slate-400"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select name="category" defaultValue={finding?.category || ""}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Access Control">🔐 Access Control</SelectItem>
                  <SelectItem value="Data Protection">🛡️ Data Protection</SelectItem>
                  <SelectItem value="Network Security">🌐 Network Security</SelectItem>
                  <SelectItem value="Application Security">💻 Application Security</SelectItem>
                  <SelectItem value="Physical Security">🏢 Physical Security</SelectItem>
                  <SelectItem value="Incident Response">🚨 Incident Response</SelectItem>
                  <SelectItem value="Business Continuity">📋 Business Continuity</SelectItem>
                  <SelectItem value="Risk Management">⚖️ Risk Management</SelectItem>
                  <SelectItem value="Compliance">📜 Compliance</SelectItem>
                  <SelectItem value="Other">❓ Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select name="status" defaultValue={finding?.status || "Open"}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Open">🔴 Open</SelectItem>
                  <SelectItem value="In Progress">🟡 In Progress</SelectItem>
                  <SelectItem value="Resolved">🟢 Resolved</SelectItem>
                  <SelectItem value="Closed">✅ Closed</SelectItem>
                  <SelectItem value="Accepted Risk">⚠️ Accepted Risk</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="recommendation">Recommendation *</Label>
            <Textarea
              id="recommendation"
              name="recommendation"
              defaultValue={finding?.recommendation || ""}
              placeholder="Provide recommendations to address this finding"
              rows={3}
              required
              className="border-purple-200 focus:border-cyan-500 focus:ring-cyan-500 dark:bg-gradient-to-r dark:from-slate-900/80 dark:to-blue-950/80 dark:border-blue-800/50 dark:text-white dark:placeholder-slate-400"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="assigned_to">Assigned To</Label>
              <Input
                id="assigned_to"
                name="assigned_to"
                defaultValue={finding?.assigned_to || ""}
                placeholder="Enter assignee name"
                className="border-purple-200 focus:border-cyan-500 focus:ring-cyan-500 dark:bg-gradient-to-r dark:from-slate-900/80 dark:to-blue-950/80 dark:border-blue-800/50 dark:text-white dark:placeholder-slate-400"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="due_date">Due Date</Label>
              <Input
                id="due_date"
                name="due_date"
                type="date"
                defaultValue={finding?.due_date || ""}
                className="border-purple-200 focus:border-cyan-500 focus:ring-cyan-500 dark:bg-gradient-to-r dark:from-slate-900/80 dark:to-blue-950/80 dark:border-blue-800/50 dark:text-white"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end space-x-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={isSubmitting}
          className="bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 text-white dark:from-blue-600 dark:via-blue-700 dark:to-blue-800"
        >
          {isSubmitting ? "Saving..." : finding ? "Update Finding" : "Create Finding"}
        </Button>
      </div>
    </form>
  )
}
