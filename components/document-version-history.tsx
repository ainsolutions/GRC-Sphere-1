"use client"

import React, { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import {
  Clock,
  CheckCircle,
  XCircle,
  FileText,
  Download,
  Eye,
  Plus,
  AlertCircle,
  User,
  Calendar,
  GitBranch
} from "lucide-react"
import { ActionButtons } from "./ui/action-buttons"

interface VersionHistoryProps {
  documentId: number
  documentTitle: string
  onVersionChange?: (version: string) => void
}

interface DocumentVersion {
  id: number
  version: string
  title: string
  status: string
  version_notes: string
  file_name: string
  file_size: number
  mime_type: string
  created_at: string
  created_by: string
  reviewed_by?: string
  approved_by?: string
  reviewed_at?: string
  approved_at?: string
  approval_status: string
  pending_approvals: number
  approvals: Array<{
    approver_role: string
    approver_name?: string
    status: string
    comments?: string
    approved_at?: string
    created_at: string
  }>
}

const STATUS_CONFIG = {
  draft: { color: "bg-gray-500", label: "Draft", icon: FileText },
  under_review: { color: "bg-yellow-500", label: "Under Review", icon: Clock },
  reviewed: { color: "bg-blue-500", label: "Reviewed", icon: Eye },
  approved: { color: "bg-green-500", label: "Approved", icon: CheckCircle },
  rejected: { color: "bg-red-500", label: "Rejected", icon: XCircle },
  published: { color: "bg-purple-500", label: "Published", icon: CheckCircle }
}

const APPROVAL_STATUS_CONFIG = {
  draft: { color: "bg-gray-100 text-gray-800", label: "Draft" },
  pending_approval: { color: "bg-yellow-100 text-yellow-800", label: "Pending Approval" },
  approved: { color: "bg-green-100 text-green-800", label: "Approved" },
  rejected: { color: "bg-red-100 text-red-800", label: "Rejected" }
}

export function DocumentVersionHistory({ documentId, documentTitle, onVersionChange }: VersionHistoryProps) {
  const { toast } = useToast()
  const [versions, setVersions] = useState<DocumentVersion[]>([])
  const [loading, setLoading] = useState(true)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [newVersionData, setNewVersionData] = useState({
    version: "",
    version_notes: ""
  })

  useEffect(() => {
    fetchVersions()
  }, [documentId])

  const fetchVersions = async () => {
    try {
      setLoading(true)
      // For now, just show the current document as version 1.0
      // This will be enhanced when the full version history schema is implemented
      const mockVersion = {
        id: 1,
        version: "1.0",
        title: documentTitle,
        status: "current",
        version_notes: "Initial version",
        file_name: null,
        file_size: null,
        mime_type: null,
        created_at: new Date().toISOString(),
        created_by: "System",
        approval_status: "draft",
        pending_approvals: 0,
        approvals: []
      }
      setVersions([mockVersion])
    } catch (error) {
      console.error("Error fetching versions:", error)
      toast({
        title: "Error",
        description: "Failed to fetch version history",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDownload = async (versionId: number, fileName: string) => {
    try {
      const response = await fetch(`/api/governance/documents/download?documentId=${documentId}&versionId=${versionId}&userId=current-user`)

      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = fileName
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)

        toast({
          title: "Success",
          description: "File downloaded successfully"
        })
      } else {
        toast({
          title: "Error",
          description: "Failed to download file",
          variant: "destructive"
        })
      }
    } catch (error) {
      console.error("Download error:", error)
      toast({
        title: "Error",
        description: "Failed to download file",
        variant: "destructive"
      })
    }
  }

  const handleCreateVersion = async () => {
    if (!newVersionData.version || !newVersionData.version_notes) {
      toast({
        title: "Validation Error",
        description: "Please provide version number and notes",
        variant: "destructive"
      })
      return
    }

    try {
      const response = await fetch("/api/governance/documents/versions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          documentId,
          action: "create_version",
          newVersion: newVersionData.version,
          versionNotes: newVersionData.version_notes,
          userId: "current-user" // Replace with actual user ID
        })
      })

      const result = await response.json()

      if (result.success) {
        toast({
          title: "Success",
          description: "New version created successfully"
        })
        setIsCreateDialogOpen(false)
        setNewVersionData({ version: "", version_notes: "" })
        fetchVersions()
        onVersionChange?.(newVersionData.version)
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to create version",
          variant: "destructive"
        })
      }
    } catch (error) {
      console.error("Error creating version:", error)
      toast({
        title: "Error",
        description: "Failed to create version",
        variant: "destructive"
      })
    }
  }

  const handleSubmitForReview = async (versionId: number) => {
    try {
      const response = await fetch("/api/governance/documents/versions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          documentId,
          action: "submit_for_review",
          versionId,
          userId: "current-user" // Replace with actual user ID
        })
      })

      const result = await response.json()

      if (result.success) {
        toast({
          title: "Success",
          description: "Document submitted for review"
        })
        fetchVersions()
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to submit for review",
          variant: "destructive"
        })
      }
    } catch (error) {
      console.error("Error submitting for review:", error)
      toast({
        title: "Error",
        description: "Failed to submit for review",
        variant: "destructive"
      })
    }
  }

  const handleApproveVersion = async (versionId: number, approverRole: string) => {
    try {
      const response = await fetch("/api/governance/documents/versions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          documentId,
          action: "approve_version",
          versionId,
          approverName: "Current User", // Replace with actual user name
          approverRole,
          userId: "current-user" // Replace with actual user ID
        })
      })

      const result = await response.json()

      if (result.success) {
        toast({
          title: "Success",
          description: "Version approved successfully"
        })
        fetchVersions()
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to approve version",
          variant: "destructive"
        })
      }
    } catch (error) {
      console.error("Error approving version:", error)
      toast({
        title: "Error",
        description: "Failed to approve version",
        variant: "destructive"
      })
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
            <p className="text-sm text-gray-500">Loading version history...</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <GitBranch className="h-5 w-5" />
              Version History
            </CardTitle>
            <CardDescription>
              {documentTitle} - {versions.length} version{versions.length !== 1 ? 's' : ''}
            </CardDescription>
          </div>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <ActionButtons isTableAction={false} onAdd={()=>{}} btnAddText="New Version"/>
              {/* <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                New Version
              </Button> */}
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Version</DialogTitle>
                <DialogDescription>
                  Create a new version of this document
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="version">Version Number</Label>
                  <Input
                    id="version"
                    value={newVersionData.version}
                    onChange={(e) => setNewVersionData(prev => ({ ...prev, version: e.target.value }))}
                    placeholder="e.g., 2.0, 1.1"
                  />
                </div>
                <div>
                  <Label htmlFor="version_notes">Version Notes</Label>
                  <Textarea
                    id="version_notes"
                    value={newVersionData.version_notes}
                    onChange={(e) => setNewVersionData(prev => ({ ...prev, version_notes: e.target.value }))}
                    placeholder="Describe what changed in this version"
                    rows={3}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateVersion}>
                  Create Version
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>

      <CardContent>
        {versions.length === 0 ? (
          <div className="text-center py-8">
            <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <p className="text-gray-500">No versions found</p>
          </div>
        ) : (
          <div className="space-y-4">
            {versions.map((version, index) => {
              const StatusIcon = STATUS_CONFIG[version.status as keyof typeof STATUS_CONFIG]?.icon || FileText
              const statusConfig = STATUS_CONFIG[version.status as keyof typeof STATUS_CONFIG]
              const approvalConfig = APPROVAL_STATUS_CONFIG[version.approval_status as keyof typeof APPROVAL_STATUS_CONFIG]

              return (
                <div key={version.id} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className={`w-3 h-3 rounded-full ${statusConfig?.color || 'bg-gray-500'}`}></div>
                        <h4 className="font-medium">Version {version.version}</h4>
                        <Badge variant="outline" className={approvalConfig?.color}>
                          {approvalConfig?.label || version.status}
                        </Badge>
                        {version.file_name && (
                          <Badge variant="secondary" className="text-xs">
                            {version.file_name}
                          </Badge>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-3">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Calendar className="h-4 w-4" />
                          Created: {formatDate(version.created_at)}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <User className="h-4 w-4" />
                          By: {version.created_by}
                        </div>
                        {version.file_size && (
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <FileText className="h-4 w-4" />
                            Size: {formatFileSize(version.file_size)}
                          </div>
                        )}
                      </div>

                      {version.version_notes && (
                        <div className="mb-3">
                          <p className="text-sm text-gray-700 dark:text-gray-300">
                            <strong>Notes:</strong> {version.version_notes}
                          </p>
                        </div>
                      )}

                      {/* Approval Progress */}
                      {version.pending_approvals > 0 && (
                        <div className="mb-3">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium">Approval Progress</span>
                            <span className="text-sm text-gray-500">
                              {version.approvals.filter(a => a.status === 'approved').length} / {version.approvals.length} approved
                            </span>
                          </div>
                          <Progress
                            value={(version.approvals.filter(a => a.status === 'approved').length / version.approvals.length) * 100}
                            className="h-2"
                          />
                        </div>
                      )}

                      {/* Approval Details */}
                      {version.approvals && version.approvals.length > 0 && (
                        <div className="mb-3">
                          <h5 className="text-sm font-medium mb-2">Approvals:</h5>
                          <div className="space-y-2">
                            {version.approvals.map((approval, idx) => (
                              <div key={idx} className="flex items-center justify-between text-sm">
                                <div className="flex items-center gap-2">
                                  {approval.status === 'approved' && <CheckCircle className="h-4 w-4 text-green-500" />}
                                  {approval.status === 'rejected' && <XCircle className="h-4 w-4 text-red-500" />}
                                  {approval.status === 'pending' && <Clock className="h-4 w-4 text-yellow-500" />}
                                  <span>{approval.approver_role}</span>
                                  {approval.approver_name && (
                                    <span className="text-gray-500">({approval.approver_name})</span>
                                  )}
                                </div>
                                <Badge
                                  variant={approval.status === 'approved' ? 'default' :
                                         approval.status === 'rejected' ? 'destructive' : 'secondary'}
                                  className="text-xs"
                                >
                                  {approval.status}
                                </Badge>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="flex gap-2 ml-4">
                      {version.file_name && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDownload(version.id, version.file_name)}
                        >
                          <Download className="h-4 w-4 mr-1" />
                          Download
                        </Button>
                      )}

                      {version.status === 'draft' && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleSubmitForReview(version.id)}
                        >
                          Submit for Review
                        </Button>
                      )}

                      {version.approval_status === 'pending_approval' && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleApproveVersion(version.id, 'CISO')} // Replace with actual role
                        >
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Approve
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
