"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { createControl } from "@/lib/actions/control-actions"
import { useToast } from "@/hooks/use-toast"
import OwnerSelectInput from "@/components/owner-search-input"

interface ControlFormProps {
  control?: any
  onSuccess?: () => void
  onCancel?: () => void
}

export function ControlForm({ control, onSuccess, onCancel }: ControlFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (formData: FormData) => {
    setIsSubmitting(true)

    try {
      const result = await createControl(formData)

      if (result.success) {
        toast({
          title: "Success",
          description: "Control created successfully",
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
    <Card className="w-full max-w-4xl mx-auto gradient-card">
      <CardHeader>
        <CardTitle>Security Control Management</CardTitle>
        <CardDescription>Define and manage security controls with ISO 27001 mapping</CardDescription>
      </CardHeader>
      <CardContent>
        <form action={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="control_id">Control ID *</Label>
              <Input
                id="control_id"
                name="control_id"
                defaultValue={control?.control_id || `CTRL-${Date.now()}`}
                placeholder="e.g., CTRL-001"
                required
                className="border-purple-200 focus:border-cyan-500 focus:ring-cyan-500 dark:bg-gradient-to-r dark:from-slate-900/80 dark:to-blue-950/80 dark:border-blue-800/50 dark:text-white"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="control_name">Control Name *</Label>
              <Input
                id="control_name"
                name="control_name"
                defaultValue={control?.control_name || ""}
                placeholder="Enter control name"
                required
                className="border-purple-200 focus:border-cyan-500 focus:ring-cyan-500 dark:bg-gradient-to-r dark:from-slate-900/80 dark:to-blue-950/80 dark:border-blue-800/50 dark:text-white"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="control_description">Control Description *</Label>
            <Textarea
              id="control_description"
              name="control_description"
              defaultValue={control?.control_description || ""}
              placeholder="Describe the control implementation"
              rows={3}
              required
              className="border-purple-200 focus:border-cyan-500 focus:ring-cyan-500 dark:bg-gradient-to-r dark:from-slate-900/80 dark:to-blue-950/80 dark:border-blue-800/50 dark:text-white"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="control_type">Control Type *</Label>
              <Select name="control_type" defaultValue={control?.control_type || ""} required>
                <SelectTrigger className="border-purple-200 focus:border-cyan-500 focus:ring-cyan-500 dark:bg-gradient-to-r dark:from-slate-900/80 dark:to-blue-950/80 dark:border-blue-800/50 dark:text-white">
                  <SelectValue placeholder="Select control type" />
                </SelectTrigger>
                <SelectContent className="border-purple-200 focus:border-cyan-500 focus:ring-cyan-500 dark:bg-gradient-to-r dark:from-slate-900/80 dark:to-blue-950/80 dark:border-blue-800/50 dark:text-white">
                  <SelectItem value="Preventive">Preventive</SelectItem>
                  <SelectItem value="Detective">Detective</SelectItem>
                  <SelectItem value="Corrective">Corrective</SelectItem>
                  <SelectItem value="Compensating">Compensating</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="control_category">Control Category *</Label>
              <Select name="control_category" defaultValue={control?.control_category || ""} required>
                <SelectTrigger className="border-purple-200 focus:border-cyan-500 focus:ring-cyan-500 dark:bg-gradient-to-r dark:from-slate-900/80 dark:to-blue-950/80 dark:border-blue-800/50 dark:text-white">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent className="border-purple-200 focus:border-cyan-500 focus:ring-cyan-500 dark:bg-gradient-to-r dark:from-slate-900/80 dark:to-blue-950/80 dark:border-blue-800/50 dark:text-white">
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
              <Label htmlFor="iso27001_reference">ISO 27001 Reference</Label>
              <Select name="iso27001_reference" defaultValue={control?.iso27001_reference || ""}>
                <SelectTrigger className="border-purple-200 focus:border-cyan-500 focus:ring-cyan-500 dark:bg-gradient-to-r dark:from-slate-900/80 dark:to-blue-950/80 dark:border-blue-800/50 dark:text-white">
                  <SelectValue placeholder="Select ISO 27001 control" />
                </SelectTrigger>
                <SelectContent className="border-purple-200 focus:border-cyan-500 focus:ring-cyan-500 dark:bg-gradient-to-r dark:from-slate-900/80 dark:to-blue-950/80 dark:border-blue-800/50 dark:text-white">
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
            <div className="space-y-2">
              <Label htmlFor="implementation_status">Implementation Status *</Label>
              <Select name="implementation_status" defaultValue={control?.implementation_status || ""} required>
                <SelectTrigger className="border-purple-200 focus:border-cyan-500 focus:ring-cyan-500 dark:bg-gradient-to-r dark:from-slate-900/80 dark:to-blue-950/80 dark:border-blue-800/50 dark:text-white">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent className="border-purple-200 focus:border-cyan-500 focus:ring-cyan-500 dark:bg-gradient-to-r dark:from-slate-900/80 dark:to-blue-950/80 dark:border-blue-800/50 dark:text-white">
                  <SelectItem value="Not Implemented">Not Implemented</SelectItem>
                  <SelectItem value="Planned">Planned</SelectItem>
                  <SelectItem value="In Progress">In Progress</SelectItem>
                  <SelectItem value="Implemented">Implemented</SelectItem>
                  <SelectItem value="Needs Review">Needs Review</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="effectiveness_rating">Effectiveness Rating *</Label>
              <Select name="effectiveness_rating" defaultValue={control?.effectiveness_rating || ""} required>
                <SelectTrigger className="border-purple-200 focus:border-cyan-500 focus:ring-cyan-500 dark:bg-gradient-to-r dark:from-slate-900/80 dark:to-blue-950/80 dark:border-blue-800/50 dark:text-white">
                  <SelectValue placeholder="Select rating" />
                </SelectTrigger>
                <SelectContent className="border-purple-200 focus:border-cyan-500 focus:ring-cyan-500 dark:bg-gradient-to-r dark:from-slate-900/80 dark:to-blue-950/80 dark:border-blue-800/50 dark:text-white">
                  <SelectItem value="Not Effective">Not Effective</SelectItem>
                  <SelectItem value="Partially Effective">Partially Effective</SelectItem>
                  <SelectItem value="Largely Effective">Largely Effective</SelectItem>
                  <SelectItem value="Fully Effective">Fully Effective</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="control_owner">Control Owner *</Label>
              {/* <OwnerSelectInput formData={control} setFormData={setControl} />                             */}

              <Input
                id="control_owner"
                name="control_owner"
                defaultValue={control?.control_owner || ""}
                placeholder="Enter control owner name"
                required
                className="border-purple-200 focus:border-cyan-500 focus:ring-cyan-500 dark:bg-gradient-to-r dark:from-slate-900/80 dark:to-blue-950/80 dark:border-blue-800/50 dark:text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="implementation_date">Implementation Date</Label>
              <Input
                id="implementation_date"
                name="implementation_date"
                type="date"
                defaultValue={control?.implementation_date || ""}
                className="border-purple-200 focus:border-cyan-500 focus:ring-cyan-500 dark:bg-gradient-to-r dark:from-slate-900/80 dark:to-blue-950/80 dark:border-blue-800/50 dark:text-white"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="testing_frequency">Testing Frequency *</Label>
              <Select name="testing_frequency" defaultValue={control?.testing_frequency || ""} required>
                <SelectTrigger className="border-purple-200 focus:border-cyan-500 focus:ring-cyan-500 dark:bg-gradient-to-r dark:from-slate-900/80 dark:to-blue-950/80 dark:border-blue-800/50 dark:text-white">
                  <SelectValue placeholder="Select frequency" />
                </SelectTrigger>
                <SelectContent className="border-purple-200 focus:border-cyan-500 focus:ring-cyan-500 dark:bg-gradient-to-r dark:from-slate-900/80 dark:to-blue-950/80 dark:border-blue-800/50 dark:text-white">
                  <SelectItem value="Monthly">Monthly</SelectItem>
                  <SelectItem value="Quarterly">Quarterly</SelectItem>
                  <SelectItem value="Semi-Annually">Semi-Annually</SelectItem>
                  <SelectItem value="Annually">Annually</SelectItem>
                  <SelectItem value="Ad-hoc">Ad-hoc</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="next_test_date">Next Test Date</Label>
              <Input
                id="next_test_date"
                name="next_test_date"
                type="date"
                defaultValue={control?.next_test_date || ""}
                className="border-purple-200 focus:border-cyan-500 focus:ring-cyan-500 dark:bg-gradient-to-r dark:from-slate-900/80 dark:to-blue-950/80 dark:border-blue-800/50 dark:text-white"
              />
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
              {isSubmitting ? "Saving..." : "Create Control"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
