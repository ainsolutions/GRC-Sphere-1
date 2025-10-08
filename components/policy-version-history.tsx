"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { format } from "date-fns"
import { History, Plus, Eye, RotateCcw, Upload, FileText, Download } from "lucide-react"

interface PolicyVersion {
  id: number
  policy_id: number
  version: string
  title: string
  description: string
  content: string
  change_summary: string
  status: string
  created_at: string
  is_current: boolean
  attachment_count: number
  version_status: string
}

interface PolicyAttachment {
  id: number
  policy_id: number
  version_id: number
  filename: string
  original_filename: string
  file_path: string
  file_size: number
  mime_type: string
  uploaded_at: string
  version: string
  is_current: boolean
}

interface PolicyVersionHistoryProps {
  policyId: number
  onVersionChange?: () => void
}

export function PolicyVersionHistory({ policyId, onVersionChange }: PolicyVersionHistoryProps) {
  const [versions, setVersions] = useState<PolicyVersion[]>([])
  const [attachments, setAttachments] = useState<PolicyAttachment[]>([])
  const [loading, setLoading] = useState(true)
  const [isCreateVersionDialogOpen, setIsCreateVersionDialogOpen] = useState(false)
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false)
  const [selectedVersion, setSelectedVersion] = useState<PolicyVersion | null>(null)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [changeSummary, setChangeSummary] = useState("")
  const [uploadFile, setUploadFile] = useState<File | null>(null)
  const [selectedVersionForUpload, setSelectedVersionForUpload] = useState<number | null>(null)

  useEffect(() => {
    fetchVersions()
    fetchAttachments()
  }, [policyId])

  const fetchVersions = async () => {
    try {
      const response = await fetch(`/api/policies/${policyId}/versions`)
      if (!response.ok) throw new Error("Failed to fetch versions")

      const data = await response.json()
      setVersions(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error("Error fetching versions:", error)
      setVersions([])
    } finally {
      setLoading(false)
    }
  }

  const fetchAttachments = async () => {
    try {
      const response = await fetch(`/api/policies/${policyId}/attachments`)
      if (!response.ok) {
        console.warn("Failed to fetch attachments, using empty array")
        setAttachments([])
        return
      }

      const data = await response.json()
      setAttachments(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error("Error fetching attachments:", error)
      setAttachments([])
    }
  }

  const handleCreateVersion = async () => {
    try {
      const response = await fetch(`/api/policies/${policyId}/versions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          change_summary: changeSummary,
        }),
      })

      if (!response.ok) throw new Error("Failed to create version")

      setIsCreateVersionDialogOpen(false)
      setChangeSummary("")
      fetchVersions()
      onVersionChange?.()
    } catch (error) {
      console.error("Error creating version:", error)
    }
  }

  const handleRollback = async (versionId: number) => {
    if (!confirm("Are you sure you want to rollback to this version? This will update the current policy.")) {
      return
    }

    try {
      const response = await fetch(`/api/policies/${policyId}/versions/${versionId}/rollback`, {
        method: "POST",
      })

      if (!response.ok) throw new Error("Failed to rollback")

      fetchVersions()
      onVersionChange?.()
    } catch (error) {
      console.error("Error rolling back:", error)
    }
  }

  const handleFileUpload = async () => {
    if (!uploadFile) return

    try {
      const formData = new FormData()
      formData.append("file", uploadFile)
      if (selectedVersionForUpload) {
        formData.append("version_id", selectedVersionForUpload.toString())
      }

      const response = await fetch(`/api/policies/${policyId}/attachments`, {
        method: "POST",
        body: formData,
      })

      if (!response.ok) throw new Error("Failed to upload file")

      setIsUploadDialogOpen(false)
      setUploadFile(null)
      setSelectedVersionForUpload(null)
      fetchAttachments()
    } catch (error) {
      console.error("Error uploading file:", error)
    }
  }

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      draft: { color: "bg-gray-500", label: "Draft" },
      under_review: { color: "bg-yellow-500", label: "Under Review" },
      approved: { color: "bg-blue-500", label: "Approved" },
      published: { color: "bg-green-500", label: "Published" },
      archived: { color: "bg-red-500", label: "Archived" },
    }

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.draft
    return <Badge className={`${config.color} `}>{config.label}</Badge>
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-32">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold ">Version History</h3>
          <p className="text-gray-400 text-sm">Track policy changes and manage file attachments</p>
        </div>
        <div className="flex space-x-2">
          <Dialog open={isCreateVersionDialogOpen} onOpenChange={setIsCreateVersionDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Create Version
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Version</DialogTitle>
                <DialogDescription>Create a new version of this policy with your recent changes.</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="change-summary">Change Summary</Label>
                  <Textarea
                    id="change-summary"
                    value={changeSummary}
                    onChange={(e) => setChangeSummary(e.target.value)}
                    placeholder="Describe what changed in this version..."
                    rows={3}
                  />
                </div>
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setIsCreateVersionDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleCreateVersion}>Create Version</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Upload className="h-4 w-4 mr-2" />
                Upload File
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Upload Policy Document</DialogTitle>
                <DialogDescription>Upload a document related to this policy.</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="file-upload">Select File</Label>
                  <Input
                    id="file-upload"
                    type="file"
                    onChange={(e) => setUploadFile(e.target.files?.[0] || null)}
                    accept=".pdf,.doc,.docx,.txt,.md"
                  />
                </div>
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setIsUploadDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleFileUpload} disabled={!uploadFile}>
                    Upload
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Version History Table */}
      <Card>
        <CardHeader>
          <CardTitle className=" flex items-center">
            <History className="h-5 w-5 mr-2" />
            Version History
          </CardTitle>
        </CardHeader>
        <CardContent>
          {versions.length === 0 ? (
            <div className="text-center py-8">
              <History className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-400">No version history available</p>
              <p className="text-gray-500 text-sm">Create a version to start tracking changes</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="border-slate-700">
                  <TableHead className="text-gray-300">Version</TableHead>
                  <TableHead className="text-gray-300">Status</TableHead>
                  <TableHead className="text-gray-300">Change Summary</TableHead>
                  <TableHead className="text-gray-300">Created</TableHead>
                  <TableHead className="text-gray-300">Attachments</TableHead>
                  <TableHead className="text-gray-300">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {versions.map((version) => (
                  <TableRow key={version.id} className="border-slate-700">
                    <TableCell className=" font-mono">
                      {version.version}
                      {version.is_current && <Badge className="ml-2 bg-green-500  text-xs">Current</Badge>}
                    </TableCell>
                    <TableCell>{getStatusBadge(version.status)}</TableCell>
                    <TableCell className=" max-w-xs truncate">
                      {version.change_summary || "No summary provided"}
                    </TableCell>
                    <TableCell className="">
                      {format(new Date(version.created_at), "MMM dd, yyyy HH:mm")}
                    </TableCell>
                    <TableCell className="">
                      {version.attachment_count > 0 && (
                        <Badge className="bg-blue-500 ">{version.attachment_count} files</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setSelectedVersion(version)
                            setIsViewDialogOpen(true)
                          }}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        {!version.is_current && (
                          <Button variant="ghost" size="sm" onClick={() => handleRollback(version.id)}>
                            <RotateCcw className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* File Attachments */}
      <Card>
        <CardHeader>
          <CardTitle className=" flex items-center">
            <FileText className="h-5 w-5 mr-2" />
            File Attachments
          </CardTitle>
        </CardHeader>
        <CardContent>
          {attachments.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-400">No files attached</p>
              <p className="text-gray-500 text-sm">Upload documents related to this policy</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="border-slate-700">
                  <TableHead className="text-gray-300">Filename</TableHead>
                  <TableHead className="text-gray-300">Version</TableHead>
                  <TableHead className="text-gray-300">Size</TableHead>
                  <TableHead className="text-gray-300">Uploaded</TableHead>
                  <TableHead className="text-gray-300">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {attachments.map((attachment) => (
                  <TableRow key={attachment.id} className="border-slate-700">
                    <TableCell className="">{attachment.original_filename}</TableCell>
                    <TableCell className="">
                      {attachment.version || "General"}
                      {attachment.is_current && <Badge className="ml-2 bg-green-500  text-xs">Current</Badge>}
                    </TableCell>
                    <TableCell className="">{formatFileSize(attachment.file_size)}</TableCell>
                    <TableCell className="">
                      {format(new Date(attachment.uploaded_at), "MMM dd, yyyy")}
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button variant="ghost" size="sm" onClick={() => window.open(attachment.file_path, "_blank")}>
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Version View Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              Version {selectedVersion?.version} - {selectedVersion?.title}
            </DialogTitle>
            <DialogDescription>
              Created on {selectedVersion && format(new Date(selectedVersion.created_at), "MMM dd, yyyy HH:mm")}
            </DialogDescription>
          </DialogHeader>
          {selectedVersion && (
            <div className="space-y-4">
              <div>
                <Label>Change Summary</Label>
                <p className="text-sm text-gray-600 mt-1">{selectedVersion.change_summary || "No summary provided"}</p>
              </div>
              <div>
                <Label>Description</Label>
                <p className="text-sm text-gray-600 mt-1">{selectedVersion.description}</p>
              </div>
              <div>
                <Label>Content</Label>
                <div className="mt-1 p-4 bg-gray-50 rounded-md max-h-96 overflow-y-auto">
                  <pre className="text-sm whitespace-pre-wrap">{selectedVersion.content}</pre>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
