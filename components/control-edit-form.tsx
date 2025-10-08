"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { updateControl, getISO27002Controls } from "@/lib/actions/control-actions"
import { useToast } from "@/hooks/use-toast"
import { Shield, AlertTriangle, Target, User } from "lucide-react"

interface ControlEditFormProps {
  control: any
  onSuccess?: () => void
  onCancel?: () => void
}

export function ControlEditForm({ control, onSuccess, onCancel }: ControlEditFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [iso27002Controls, setIso27002Controls] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const { toast } = useToast()

  useEffect(() => {
    loadISO27002Controls()
  }, [])

  const loadISO27002Controls = async () => {
    const result = await getISO27002Controls()
    if (result.success) {
      setIso27002Controls(result.data)
    }
  }

  const handleSubmit = async (formData: FormData) => {
    setIsSubmitting(true)

    try {
      const result = await updateControl(control.id, formData)

      if (result.success) {
        toast({
          title: "Success",
          description: "Control updated successfully",
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

  const getRiskLevelColor = (score: number) => {
    if (score >= 20) return "bg-red-600 text-white"
    if (score >= 15) return "bg-orange-500 text-white"
    if (score >= 10) return "bg-yellow-500 text-white"
    if (score >= 5) return "bg-blue-500 text-white"
    return "bg-green-500 text-white"
  }

  const getRiskLevelText = (score: number) => {
    if (score >= 20) return "Critical"
    if (score >= 15) return "High"
    if (score >= 10) return "Medium"
    if (score >= 5) return "Low"
    return "Very Low"
  }

  const filteredISO27002Controls = iso27002Controls.filter(
    (ctrl: any) =>
      ctrl.control_code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ctrl.control_title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ctrl.category_name.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <form action={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-blue-600" />
              Basic Information
            </CardTitle>
            <CardDescription>Core control identification and details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="control_id">Control ID</Label>
                <Input
                  id="control_id"
                  name="control_id"
                  defaultValue={control?.control_id || ""}
                  disabled
                  className="bg-muted"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="iso27001_reference">ISO 27001 Reference</Label>
                <Select name="iso27001_reference" defaultValue={control?.iso27001_reference || ""}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select ISO 27001 control" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    <SelectItem value="A.5.1">A.5.1 - Information security policies</SelectItem>
                    <SelectItem value="A.6.1">A.6.1 - Internal organization</SelectItem>
                    <SelectItem value="A.7.1">A.7.1 - Prior to employment</SelectItem>
                    <SelectItem value="A.8.1">A.8.1 - Responsibility for assets</SelectItem>
                    <SelectItem value="A.9.1">A.9.1 - Business requirements of access control</SelectItem>
                    <SelectItem value="A.10.1">A.10.1 - Cryptographic controls</SelectItem>
                    <SelectItem value="A.11.1">A.11.1 - Secure areas</SelectItem>
                    <SelectItem value="A.12.1">A.12.1 - Operational procedures and responsibilities</SelectItem>
                    <SelectItem value="A.13.1">A.13.1 - Network security management</SelectItem>
                    <SelectItem value="A.14.1">A.14.1 - Security requirements of information systems</SelectItem>
                    <SelectItem value="A.15.1">A.15.1 - Information security in supplier relationships</SelectItem>
                    <SelectItem value="A.16.1">A.16.1 - Management of information security incidents</SelectItem>
                    <SelectItem value="A.17.1">A.17.1 - Information security continuity</SelectItem>
                    <SelectItem value="A.18.1">A.18.1 - Compliance with legal and contractual requirements</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="iso27002_control_id">ISO 27002 Control Mapping</Label>
              <div className="space-y-2">
                <Input
                  placeholder="Search ISO 27002 controls..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="mb-2"
                />
                <Select name="iso27002_control_id" defaultValue={control?.iso27002_control_id?.toString() || ""}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select ISO 27002 control" />
                  </SelectTrigger>
                  <SelectContent className="max-h-60">
                    <SelectItem value="none">None</SelectItem>
                    {filteredISO27002Controls.map((ctrl: any) => (
                      <SelectItem key={ctrl.id} value={ctrl.id.toString()}>
                        <div className="flex flex-col">
                          <span className="font-medium">
                            {ctrl.control_code} - {ctrl.control_title}
                          </span>
                          <span className="text-sm text-muted-foreground">{ctrl.category_name}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="control_name">Control Name</Label>
              <Input
                id="control_name"
                name="control_name"
                defaultValue={control?.control_name || ""}
                placeholder="Enter control name"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="control_description">Control Description</Label>
              <Textarea
                id="control_description"
                name="control_description"
                defaultValue={control?.control_description || ""}
                placeholder="Describe the control implementation"
                rows={3}
                required
              />
            </div>
          </CardContent>
        </Card>

  
        {/* Implementation Details */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-green-600" />
              Implementation Details
            </CardTitle>
            <CardDescription>Control implementation and effectiveness</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="control_type">Control Type</Label>
                <Select name="control_type" defaultValue={control?.control_type || ""} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select control type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Preventive">Preventive</SelectItem>
                    <SelectItem value="Detective">Detective</SelectItem>
                    <SelectItem value="Corrective">Corrective</SelectItem>
                    <SelectItem value="Compensating">Compensating</SelectItem>
                    <SelectItem value="Technical">Technical</SelectItem>
                    <SelectItem value="Administrative">Administrative</SelectItem>
                    <SelectItem value="Physical">Physical</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="control_category">Control Category</Label>
                <Select name="control_category" defaultValue={control?.control_category || ""} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Access Control">Access Control</SelectItem>
                    <SelectItem value="Cryptography">Cryptography</SelectItem>
                    <SelectItem value="Physical Security">Physical Security</SelectItem>
                    <SelectItem value="Operations Security">Operations Security</SelectItem>
                    <SelectItem value="Communications Security">Communications Security</SelectItem>
                    <SelectItem value="System Acquisition">System Acquisition</SelectItem>
                    <SelectItem value="Supplier Relationships">Supplier Relationships</SelectItem>
                    <SelectItem value="Incident Management">Incident Management</SelectItem>
                    <SelectItem value="Business Continuity">Business Continuity</SelectItem>
                    <SelectItem value="Compliance">Compliance</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="implementation_status">Implementation Status</Label>
                <Select name="implementation_status" defaultValue={control?.implementation_status || ""} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Not Implemented">Not Implemented</SelectItem>
                    <SelectItem value="Planned">Planned</SelectItem>
                    <SelectItem value="In Progress">In Progress</SelectItem>
                    <SelectItem value="Implemented">Implemented</SelectItem>
                    <SelectItem value="Needs Review">Needs Review</SelectItem>
                    <SelectItem value="Partially Implemented">Partially Implemented</SelectItem>
                    <SelectItem value="Under Review">Under Review</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="effectiveness_rating">Effectiveness Rating</Label>
                <Select name="effectiveness_rating" defaultValue={control?.effectiveness_rating || ""} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select rating" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Not Effective">Not Effective</SelectItem>
                    <SelectItem value="Partially Effective">Partially Effective</SelectItem>
                    <SelectItem value="Largely Effective">Largely Effective</SelectItem>
                    <SelectItem value="Fully Effective">Fully Effective</SelectItem>
                    <SelectItem value="Effective">Effective</SelectItem>
                    <SelectItem value="Ineffective">Ineffective</SelectItem>
                    <SelectItem value="Not Tested">Not Tested</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="implementation_date">Implementation Date</Label>
              <Input
                id="implementation_date"
                name="implementation_date"
                type="date"
                defaultValue={control?.implementation_date || ""}
              />
            </div>
          </CardContent>
        </Card>

        {/* Responsibility & Schedule */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5 text-purple-600" />
              Responsibility & Schedule
            </CardTitle>
            <CardDescription>Ownership and review schedules</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="control_owner">Control Owner</Label>
              <Input
                id="control_owner"
                name="control_owner"
                defaultValue={control?.control_owner || ""}
                placeholder="Enter control owner name"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="responsible_party">Responsible Party</Label>
              <Input
                id="responsible_party"
                name="responsible_party"
                defaultValue={control?.responsible_party || ""}
                placeholder="Enter responsible party/team"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="testing_frequency">Testing Frequency</Label>
                <Select name="testing_frequency" defaultValue={control?.testing_frequency || ""} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select frequency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Monthly">Monthly</SelectItem>
                    <SelectItem value="Quarterly">Quarterly</SelectItem>
                    <SelectItem value="Semi-Annually">Semi-Annually</SelectItem>
                    <SelectItem value="Annually">Annually</SelectItem>
                    <SelectItem value="Ad-hoc">Ad-hoc</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="review_frequency">Review Frequency</Label>
                <Select name="review_frequency" defaultValue={control?.review_frequency || "Annual"} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select frequency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Monthly">Monthly</SelectItem>
                    <SelectItem value="Quarterly">Quarterly</SelectItem>
                    <SelectItem value="Semi-Annual">Semi-Annual</SelectItem>
                    <SelectItem value="Annual">Annual</SelectItem>
                    <SelectItem value="Biennial">Biennial</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="last_test_date">Last Test Date</Label>
                <Input
                  id="last_test_date"
                  name="last_test_date"
                  type="date"
                  defaultValue={control?.last_test_date || ""}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="next_test_date">Next Test Date</Label>
                <Input
                  id="next_test_date"
                  name="next_test_date"
                  type="date"
                  defaultValue={control?.next_test_date || ""}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="next_review_date">Next Review Date</Label>
              <Input
                id="next_review_date"
                name="next_review_date"
                type="date"
                defaultValue={control?.next_review_date || ""}
              />
            </div>
          </CardContent>
        </Card>
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
          {isSubmitting ? "Updating..." : "Update Control"}
        </Button>
      </div>
    </form>
  )
}
