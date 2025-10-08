"use client"

import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Edit } from "lucide-react"

export function ControlCreateForm({ onSubmit, onCancel, loading }: {
  onSubmit: (data: any) => void
  onCancel: () => void
  loading: boolean
}) {
  const generateControlId = (): string => {
    const letters = Array.from({ length: 2 }, () => String.fromCharCode(65 + Math.floor(Math.random() * 26))).join("")
    const alnum = (() => {
      const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
      let out = ""
      for (let i = 0; i < 8; i++) out += chars[Math.floor(Math.random() * chars.length)]
      return out
    })()
    return `CTRL-${letters}-${alnum}`
  }
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    control_id: generateControlId(),
    framework: "ISO 27001",
    category: "",
    subcategory: "",
    control_type: "preventive",
    implementation_status: "not_implemented",
    effectiveness_rating: "medium",
    maturity_level: "initial",
    owner: "",
    department: "",
    responsible_party: "",
    implementation_date: "",
    assessment_frequency: "annual",
    evidence_location: "",
    notes: ""
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  const frameworks = ["ISO 27001", "NIST CSF", "COBIT", "PCI DSS", "SOX", "GDPR", "HIPAA", "Other"]
  const types = ["preventive", "detective", "corrective", "directive", "compensating"]
  const statuses = ["not_implemented", "in_progress", "implemented", "deprecated"]
  const effectiveness = ["low", "medium", "high"]
  const maturities = ["initial", "managed", "defined", "quantitatively_managed", "optimizing"]

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Control Name</Label>
          <Input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
        </div>
        <div className="space-y-2">
          <Label>Control ID</Label>
          <div className="flex gap-2">
            <Input value={formData.control_id} onChange={(e) => setFormData({ ...formData, control_id: e.target.value })} required />
            <Button
              type="button"
              variant="outline"
              onClick={() => setFormData({ ...formData, control_id: generateControlId() })}
            >
              Generate
            </Button>
          </div>
        </div>
      </div>
      <div className="space-y-2">
        <Label>Description</Label>
        <Textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} rows={3} />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label>Framework</Label>
          <Select value={formData.framework} onValueChange={(v) => setFormData({ ...formData, framework: v })}>
            <SelectTrigger><SelectValue placeholder="Select framework" /></SelectTrigger>
            <SelectContent>
              {frameworks.map(f => (<SelectItem key={f} value={f}>{f}</SelectItem>))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Category</Label>
          <Input value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} />
        </div>
        <div className="space-y-2">
          <Label>Subcategory</Label>
          <Input value={formData.subcategory} onChange={(e) => setFormData({ ...formData, subcategory: e.target.value })} />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label>Control Type</Label>
          <Select value={formData.control_type} onValueChange={(v) => setFormData({ ...formData, control_type: v })}>
            <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
            <SelectContent>
              {types.map(t => (<SelectItem key={t} value={t}>{t}</SelectItem>))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Status</Label>
          <Select value={formData.implementation_status} onValueChange={(v) => setFormData({ ...formData, implementation_status: v })}>
            <SelectTrigger><SelectValue placeholder="Select status" /></SelectTrigger>
            <SelectContent>
              {statuses.map(s => (<SelectItem key={s} value={s}>{s}</SelectItem>))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Effectiveness</Label>
          <Select value={formData.effectiveness_rating} onValueChange={(v) => setFormData({ ...formData, effectiveness_rating: v })}>
            <SelectTrigger><SelectValue placeholder="Select effectiveness" /></SelectTrigger>
            <SelectContent>
              {effectiveness.map(s => (<SelectItem key={s} value={s}>{s}</SelectItem>))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label>Maturity</Label>
          <Select value={formData.maturity_level} onValueChange={(v) => setFormData({ ...formData, maturity_level: v })}>
            <SelectTrigger><SelectValue placeholder="Select maturity" /></SelectTrigger>
            <SelectContent>
              {maturities.map(s => (<SelectItem key={s} value={s}>{s}</SelectItem>))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Owner</Label>
          <Input value={formData.owner} onChange={(e) => setFormData({ ...formData, owner: e.target.value })} required />
        </div>
        <div className="space-y-2">
          <Label>Department</Label>
          <Input value={formData.department} onChange={(e) => setFormData({ ...formData, department: e.target.value })} />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Responsible Party</Label>
          <Input value={formData.responsible_party} onChange={(e) => setFormData({ ...formData, responsible_party: e.target.value })} />
        </div>
        <div className="space-y-2">
          <Label>Implementation Date</Label>
          <Input type="date" value={formData.implementation_date} onChange={(e) => setFormData({ ...formData, implementation_date: e.target.value })} />
        </div>
      </div>
      <div className="flex justify-end gap-3 pt-2">
        <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
        <Button type="submit" disabled={loading}>
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
              Creating...
            </>
          ) : (
            <>
              <Plus className="h-4 w-4 mr-2" />
              Create Control
            </>
          )}
        </Button>
      </div>
    </form>
  )
}

export function ControlEditForm({ control, onSubmit, onCancel, loading }: {
  control: any
  onSubmit: (data: any) => void
  onCancel: () => void
  loading: boolean
}) {
  const [formData, setFormData] = useState({
    name: control?.name || "",
    description: control?.description || "",
    control_id: control?.control_id || control?.controlId || "",
    framework: control?.framework || "ISO 27001",
    category: control?.category || "",
    subcategory: control?.subcategory || "",
    control_type: control?.control_type || "preventive",
    implementation_status: control?.implementation_status || control?.status || "not_implemented",
    effectiveness_rating: control?.effectiveness_rating || control?.effectiveness || "medium",
    maturity_level: control?.maturity_level || "initial",
    owner: control?.owner || "",
    department: control?.department || "",
    responsible_party: control?.responsible_party || "",
    implementation_date: control?.implementation_date ? String(control.implementation_date).split('T')[0] : "",
    assessment_frequency: control?.assessment_frequency || "annual",
    evidence_location: control?.evidence_location || "",
    notes: control?.notes || ""
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  const frameworks = ["ISO 27001", "NIST CSF", "COBIT", "PCI DSS", "SOX", "GDPR", "HIPAA", "Other"]
  const types = ["preventive", "detective", "corrective", "directive", "compensating"]
  const statuses = ["not_implemented", "in_progress", "implemented", "deprecated"]
  const effectiveness = ["low", "medium", "high"]
  const maturities = ["initial", "managed", "defined", "quantitatively_managed", "optimizing"]

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Control Name</Label>
          <Input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
        </div>
        <div className="space-y-2">
          <Label>Control ID</Label>
          <Input value={formData.control_id} onChange={(e) => setFormData({ ...formData, control_id: e.target.value })} required />
        </div>
      </div>
      <div className="space-y-2">
        <Label>Description</Label>
        <Textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} rows={3} />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label>Framework</Label>
          <Select value={formData.framework} onValueChange={(v) => setFormData({ ...formData, framework: v })}>
            <SelectTrigger><SelectValue placeholder="Select framework" /></SelectTrigger>
            <SelectContent>
              {frameworks.map(f => (<SelectItem key={f} value={f}>{f}</SelectItem>))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Category</Label>
          <Input value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} />
        </div>
        <div className="space-y-2">
          <Label>Subcategory</Label>
          <Input value={formData.subcategory} onChange={(e) => setFormData({ ...formData, subcategory: e.target.value })} />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label>Control Type</Label>
          <Select value={formData.control_type} onValueChange={(v) => setFormData({ ...formData, control_type: v })}>
            <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
            <SelectContent>
              {types.map(t => (<SelectItem key={t} value={t}>{t}</SelectItem>))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Status</Label>
          <Select value={formData.implementation_status} onValueChange={(v) => setFormData({ ...formData, implementation_status: v })}>
            <SelectTrigger><SelectValue placeholder="Select status" /></SelectTrigger>
            <SelectContent>
              {statuses.map(s => (<SelectItem key={s} value={s}>{s}</SelectItem>))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Effectiveness</Label>
          <Select value={formData.effectiveness_rating} onValueChange={(v) => setFormData({ ...formData, effectiveness_rating: v })}>
            <SelectTrigger><SelectValue placeholder="Select effectiveness" /></SelectTrigger>
            <SelectContent>
              {effectiveness.map(s => (<SelectItem key={s} value={s}>{s}</SelectItem>))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label>Maturity</Label>
          <Select value={formData.maturity_level} onValueChange={(v) => setFormData({ ...formData, maturity_level: v })}>
            <SelectTrigger><SelectValue placeholder="Select maturity" /></SelectTrigger>
            <SelectContent>
              {maturities.map(s => (<SelectItem key={s} value={s}>{s}</SelectItem>))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Owner</Label>
          <Input value={formData.owner} onChange={(e) => setFormData({ ...formData, owner: e.target.value })} required />
        </div>
        <div className="space-y-2">
          <Label>Department</Label>
          <Input value={formData.department} onChange={(e) => setFormData({ ...formData, department: e.target.value })} />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Responsible Party</Label>
          <Input value={formData.responsible_party} onChange={(e) => setFormData({ ...formData, responsible_party: e.target.value })} />
        </div>
        <div className="space-y-2">
          <Label>Implementation Date</Label>
          <Input type="date" value={formData.implementation_date} onChange={(e) => setFormData({ ...formData, implementation_date: e.target.value })} />
        </div>
      </div>
      <div className="flex justify-end gap-3 pt-2">
        <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
        <Button type="submit" disabled={loading}>
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
              Updating...
            </>
          ) : (
            <>
              <Edit className="h-4 w-4 mr-2" />
              Update Control
            </>
          )}
        </Button>
      </div>
    </form>
  )
}


