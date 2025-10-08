"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface RemediationEditFormProps {
  risk: any
  onSave: (data: any) => void
  onCancel: () => void
}

export function RemediationEditForm({ risk, onSave, onCancel }: RemediationEditFormProps) {
  const [formData, setFormData] = useState({
    risk_treatment: risk.risk_treatment || "",
    treatment_state: risk.treatment_state || "",
    action_owner: risk.action_owner || "",
    treatment_end_date: risk.treatment_end_date ? new Date(risk.treatment_end_date).toISOString().split("T")[0] : "",
    current_controls: risk.current_controls || "",
    recommended_controls: risk.recommended_controls || "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="risk_treatment">Treatment Strategy</Label>
          <Select
            value={formData.risk_treatment}
            onValueChange={(value) => setFormData({ ...formData, risk_treatment: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select treatment strategy" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="mitigate">Mitigate</SelectItem>
              <SelectItem value="transfer">Transfer</SelectItem>
              <SelectItem value="avoid">Avoid</SelectItem>
              <SelectItem value="accept">Accept</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="treatment_state">Treatment State</Label>
          <Select
            value={formData.treatment_state}
            onValueChange={(value) => setFormData({ ...formData, treatment_state: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select treatment state" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="planned">Planned</SelectItem>
              <SelectItem value="in-progress">In Progress</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="overdue">Overdue</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="action_owner">Action Owner</Label>
          <Input
            id="action_owner"
            value={formData.action_owner}
            onChange={(e) => setFormData({ ...formData, action_owner: e.target.value })}
            placeholder="Enter action owner"
          />
        </div>
        <div>
          <Label htmlFor="treatment_end_date">Target End Date</Label>
          <Input
            id="treatment_end_date"
            type="date"
            value={formData.treatment_end_date}
            onChange={(e) => setFormData({ ...formData, treatment_end_date: e.target.value })}
          />
        </div>
      </div>
      <div>
        <Label htmlFor="current_controls">Current Controls</Label>
        <Textarea
          id="current_controls"
          value={formData.current_controls}
          onChange={(e) => setFormData({ ...formData, current_controls: e.target.value })}
          placeholder="Describe current controls in place"
          rows={3}
        />
      </div>
      <div>
        <Label htmlFor="recommended_controls">Recommended Controls</Label>
        <Textarea
          id="recommended_controls"
          value={formData.recommended_controls}
          onChange={(e) => setFormData({ ...formData, recommended_controls: e.target.value })}
          placeholder="Describe recommended controls"
          rows={3}
        />
      </div>
      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">Save Changes</Button>
      </div>
    </form>
  )
}
