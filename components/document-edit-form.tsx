"use client"

import React, { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Edit } from "lucide-react"

type DocumentRecord = any

export function DocumentEditForm({ document: doc, onSubmit, onCancel, loading }: {
  document: DocumentRecord
  onSubmit: (data: any) => void
  onCancel: () => void
  loading: boolean
}) {
  const [formData, setFormData] = useState({
    title: doc?.title || "",
    document_type: doc?.document_type || "Policy",
    version: doc?.version || doc?.current_version || "1.0",
    status: (doc?.status || "draft") as string,
    category: doc?.category || "",
    subcategory: doc?.subcategory || "",
    description: doc?.description || "",
    document_owner: doc?.document_owner || "",
    department: doc?.department || doc?.department_owner || "",
    review_frequency: doc?.review_frequency || "annual",
    confidentiality_level: doc?.confidentiality_level || "internal",
    tagsCsv: Array.isArray(doc?.tags) ? (doc.tags as string[]).join(", ") : "",
    frameworksCsv: Array.isArray(doc?.applicable_frameworks) ? (doc.applicable_frameworks as string[]).join(", ") : "",
    relatedDocsCsv: Array.isArray(doc?.related_documents) ? (doc.related_documents as string[]).join(", ") : "",
    distListCsv: Array.isArray(doc?.distribution_list) ? (doc.distribution_list as string[]).join(", ") : "",
    complianceCsv: Array.isArray(doc?.compliance_requirements) ? (doc.compliance_requirements as string[]).join(", ") : ""
  })

  useEffect(() => {
    if (doc) {
      setFormData((prev) => ({
        ...prev,
        title: doc.title || "",
        document_type: doc.document_type || prev.document_type,
        version: doc.version || doc.current_version || "1.0",
        status: doc.status || "draft",
        category: doc.category || "",
        subcategory: doc.subcategory || "",
        description: doc.description || "",
        document_owner: doc.document_owner || "",
        department: doc.department || doc.department_owner || "",
        review_frequency: doc.review_frequency || "annual",
        confidentiality_level: doc.confidentiality_level || "internal",
        tagsCsv: Array.isArray(doc.tags) ? (doc.tags as string[]).join(", ") : "",
        frameworksCsv: Array.isArray(doc.applicable_frameworks) ? (doc.applicable_frameworks as string[]).join(", ") : "",
        relatedDocsCsv: Array.isArray(doc.related_documents) ? (doc.related_documents as string[]).join(", ") : "",
        distListCsv: Array.isArray(doc.distribution_list) ? (doc.distribution_list as string[]).join(", ") : "",
        complianceCsv: Array.isArray(doc.compliance_requirements) ? (doc.compliance_requirements as string[]).join(", ") : ""
      }))
    }
  }, [doc])

  const statuses = ["initial", "draft", "under_review", "reviewed", "approved", "published", "archived"]
  const types = ["Policy", "Procedure", "Standard", "Framework", "Guideline", "Template", "Manual", "Checklist"]
  const confLevels = ["public", "internal", "confidential", "restricted"]

  const toArray = (csv: string) => csv.split(",").map((s) => s.trim()).filter(Boolean)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const payload = {
      title: formData.title,
      document_type: formData.document_type,
      version: formData.version,
      status: formData.status,
      category: formData.category,
      subcategory: formData.subcategory || null,
      description: formData.description || null,
      content: null,
      file_path: doc?.file_path || null,
      file_size: doc?.file_size || null,
      mime_type: doc?.mime_type || null,
      document_owner: formData.document_owner,
      department: formData.department || null,
      approval_authority: doc?.approval_authority || null,
      effective_date: doc?.effective_date || null,
      last_review_date: doc?.last_review_date || null,
      next_review_date: doc?.next_review_date || null,
      review_frequency: formData.review_frequency,
      related_documents: toArray(formData.relatedDocsCsv),
      applicable_frameworks: toArray(formData.frameworksCsv),
      tags: toArray(formData.tagsCsv),
      confidentiality_level: formData.confidentiality_level,
      distribution_list: toArray(formData.distListCsv),
      change_history: doc?.change_history || {},
      approval_workflow: doc?.approval_workflow || {},
      compliance_requirements: toArray(formData.complianceCsv),
      updated_by: "current-user"
    }
    onSubmit(payload)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Title</Label>
          <Input value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} required />
        </div>
        <div className="space-y-2">
          <Label>Document Type</Label>
          <Select value={formData.document_type} onValueChange={(v) => setFormData({ ...formData, document_type: v })}>
            <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
            <SelectContent>
              {types.map((t) => (<SelectItem key={t} value={t}>{t}</SelectItem>))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label>Version</Label>
          <Input value={formData.version} onChange={(e) => setFormData({ ...formData, version: e.target.value })} />
        </div>
        <div className="space-y-2">
          <Label>Status</Label>
          <Select value={formData.status} onValueChange={(v) => setFormData({ ...formData, status: v })}>
            <SelectTrigger><SelectValue placeholder="Select status" /></SelectTrigger>
            <SelectContent>
              {statuses.map((s) => (<SelectItem key={s} value={s}>{s.replace("_", " ")}</SelectItem>))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Review Frequency</Label>
          <Input value={formData.review_frequency} onChange={(e) => setFormData({ ...formData, review_frequency: e.target.value })} />
        </div>
      </div>
      <div className="space-y-2">
        <Label>Description</Label>
        <Textarea rows={3} value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Owner</Label>
          <Input value={formData.document_owner} onChange={(e) => setFormData({ ...formData, document_owner: e.target.value })} required />
        </div>
        <div className="space-y-2">
          <Label>Department</Label>
          <Input value={formData.department} onChange={(e) => setFormData({ ...formData, department: e.target.value })} />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label>Category</Label>
          <Input value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} />
        </div>
        <div className="space-y-2">
          <Label>Subcategory</Label>
          <Input value={formData.subcategory} onChange={(e) => setFormData({ ...formData, subcategory: e.target.value })} />
        </div>
        <div className="space-y-2">
          <Label>Confidentiality</Label>
          <Select value={formData.confidentiality_level} onValueChange={(v) => setFormData({ ...formData, confidentiality_level: v })}>
            <SelectTrigger><SelectValue placeholder="Select level" /></SelectTrigger>
            <SelectContent>
              {confLevels.map((l) => (<SelectItem key={l} value={l}>{l}</SelectItem>))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Applicable Frameworks (comma-separated)</Label>
          <Input value={formData.frameworksCsv} onChange={(e) => setFormData({ ...formData, frameworksCsv: e.target.value })} />
        </div>
        <div className="space-y-2">
          <Label>Tags (comma-separated)</Label>
          <Input value={formData.tagsCsv} onChange={(e) => setFormData({ ...formData, tagsCsv: e.target.value })} />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Related Documents (IDs, comma-separated)</Label>
          <Input value={formData.relatedDocsCsv} onChange={(e) => setFormData({ ...formData, relatedDocsCsv: e.target.value })} />
        </div>
        <div className="space-y-2">
          <Label>Distribution List (comma-separated)</Label>
          <Input value={formData.distListCsv} onChange={(e) => setFormData({ ...formData, distListCsv: e.target.value })} />
        </div>
      </div>
      <div className="space-y-2">
        <Label>Compliance Requirements (comma-separated)</Label>
        <Input value={formData.complianceCsv} onChange={(e) => setFormData({ ...formData, complianceCsv: e.target.value })} />
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
              Update Document
            </>
          )}
        </Button>
      </div>
    </form>
  )
}


