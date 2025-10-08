"use client"

import React, { useRef, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { useToast } from "@/hooks/use-toast"
import { Upload, FileText, X } from "lucide-react"

type DocumentUploadFormProps = {
  onSubmit: (data: any) => void
  onCancel: () => void
  loading: boolean
}

type DocumentFormData = {
  title: string
  document_type: string
  category: string
  subcategory: string
  description: string
  document_owner: string
  department_owner: string
  approval_authority: string
  review_frequency: string
  applicable_frameworks: string[]
  tags: string[]
  confidentiality_level: string
  distribution_list: string[]
  compliance_requirements: string[]
  version_notes: string
}

const DOCUMENT_TYPES = [
  "Policy",
  "Procedure",
  "Standard",
  "Framework",
  "Guideline",
  "Template",
  "Manual",
  "Checklist",
]

const CONF_LEVELS = [
  { value: "public", label: "Public" },
  { value: "internal", label: "Internal" },
  { value: "confidential", label: "Confidential" },
  { value: "restricted", label: "Restricted" },
]

export function DocumentUploadForm({ onSubmit, onCancel, loading }: DocumentUploadFormProps) {
  const { toast } = useToast()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [formData, setFormData] = useState<DocumentFormData>({
    title: "",
    document_type: "",
    category: "",
    subcategory: "",
    description: "",
    document_owner: "",
    department_owner: "",
    approval_authority: "",
    review_frequency: "annual",
    applicable_frameworks: [],
    tags: [],
    confidentiality_level: "internal",
    distribution_list: [],
    compliance_requirements: [],
    version_notes: "Initial version",
  })

  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [uploadProgress, setUploadProgress] = useState(0)

  const handleInput = (key: keyof DocumentFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [key]: value }))
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "text/plain",
      "text/markdown",
      "application/rtf",
    ]
    if (!allowedTypes.includes(file.type)) {
      toast({ title: "Invalid file type", description: "Allowed: PDF, DOC, DOCX, TXT, MD, RTF", variant: "destructive" })
      return
    }
    if (file.size > 10 * 1024 * 1024) {
      toast({ title: "File too large", description: "Max 10MB", variant: "destructive" })
      return
    }
    setSelectedFile(file)
  }

  const resetFile = () => {
    setSelectedFile(null)
    if (fileInputRef.current) fileInputRef.current.value = ""
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.title || !formData.document_type || !formData.category || !formData.document_owner) {
      toast({
        title: "Validation Error",
        description: "Title, Type, Category and Owner are required",
        variant: "destructive",
      })
      return
    }

    try {
      setUploadProgress(10)

      const createPayload = {
        title: formData.title,
        document_type: formData.document_type,
        version: "1.0",
        status: "draft",
        category: formData.category,
        subcategory: formData.subcategory || null,
        description: formData.description || null,
        document_owner: formData.document_owner,
        department_owner: formData.department_owner || null,
        approval_authority: formData.approval_authority || null,
        review_frequency: formData.review_frequency,
        applicable_frameworks: formData.applicable_frameworks,
        tags: formData.tags,
        confidentiality_level: formData.confidentiality_level,
        distribution_list: formData.distribution_list,
        compliance_requirements: formData.compliance_requirements,
        created_by: "current-user",
      }

      const createRes = await fetch("/api/governance/documents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(createPayload),
      })
      if (!createRes.ok) {
        const err = await createRes.json().catch(() => ({}))
        throw new Error(err.error || "Failed to create document")
      }
      const created = await createRes.json()
      const documentId = created?.data?.id

      if (selectedFile && documentId) {
        setUploadProgress(60)
        const fd = new FormData()
        fd.append("file", selectedFile)
        fd.append("documentId", String(documentId))
        fd.append("version", "1.0")
        fd.append("uploadedBy", "current-user")
        fd.append("versionNotes", formData.version_notes)

        const uploadRes = await fetch("/api/governance/documents/upload", { method: "POST", body: fd })
        if (!uploadRes.ok) throw new Error("Failed to upload file")
      }

      setUploadProgress(100)
      toast({ title: "Success", description: selectedFile ? "Document created and file attached" : "Document created" })
      onSubmit(created.data)
    } catch (err: any) {
      toast({ title: "Error", description: err?.message || "Failed to create document", variant: "destructive" })
      setUploadProgress(0)
    }
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="h-5 w-5" />
          Add Document
        </CardTitle>
        <CardDescription>Create a new document and optionally attach a file</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Title</Label>
              <Input value={formData.title} onChange={(e) => handleInput("title", e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label>Document Type</Label>
              <Select value={formData.document_type} onValueChange={(v) => handleInput("document_type", v)}>
                <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
                <SelectContent>
                  {DOCUMENT_TYPES.map((t) => (<SelectItem key={t} value={t}>{t}</SelectItem>))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Category</Label>
              <Input value={formData.category} onChange={(e) => handleInput("category", e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Subcategory</Label>
              <Input value={formData.subcategory} onChange={(e) => handleInput("subcategory", e.target.value)} />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea rows={3} value={formData.description} onChange={(e) => handleInput("description", e.target.value)} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Owner</Label>
              <Input value={formData.document_owner} onChange={(e) => handleInput("document_owner", e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label>Department</Label>
              <Input value={formData.department_owner} onChange={(e) => handleInput("department_owner", e.target.value)} />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Review Frequency</Label>
              <Input value={formData.review_frequency} onChange={(e) => handleInput("review_frequency", e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Confidentiality</Label>
              <Select value={formData.confidentiality_level} onValueChange={(v) => handleInput("confidentiality_level", v)}>
                <SelectTrigger><SelectValue placeholder="Select level" /></SelectTrigger>
                <SelectContent>
                  {CONF_LEVELS.map((l) => (<SelectItem key={l.value} value={l.value}>{l.label}</SelectItem>))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Version Notes</Label>
              <Input value={formData.version_notes} onChange={(e) => handleInput("version_notes", e.target.value)} />
            </div>
          </div>

          {/* File Upload */}
          <div className="space-y-2">
            <Label>Attach File (optional)</Label>
            <div className="border-2 border-dashed rounded-md p-4">
              {!selectedFile ? (
                <div className="text-center">
                  <FileText className="mx-auto h-10 w-10 text-gray-400" />
                  <div className="mt-3">
                    <Input
                      ref={fileInputRef}
                      type="file"
                      accept=".pdf,.doc,.docx,.txt,.md,.rtf"
                      onChange={handleFileSelect}
                    />
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <div className="text-sm">
                    <div className="font-medium">{selectedFile.name}</div>
                    <div className="text-gray-500">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</div>
                  </div>
                  <Button type="button" variant="ghost" onClick={resetFile}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Progress */}
          {uploadProgress > 0 && (
            <div className="space-y-2">
              <Label>Progress</Label>
              <Progress value={uploadProgress} />
            </div>
          )}

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
            <Button type="submit" disabled={loading}>{loading ? "Saving..." : "Create Document"}</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}


