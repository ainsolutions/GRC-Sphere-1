"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  FileText,
  Upload,
  Download,
  Trash2,
  Eye,
  Search,
  Filter,
  File,
  Image,
  FileSpreadsheet,
  FileVideo,
  Archive,
  AlertTriangle,
  CheckCircle,
  Clock,
  User,
  Calendar,
  HardDrive,
  Link as LinkIcon,
  Share,
  Copy,
  Edit,
} from "lucide-react"
import { format } from "date-fns"

interface PolicyAttachment {
  id: number
  policy_id: number
  version_id: number | null
  filename: string
  original_filename: string
  file_path: string
  file_size: number
  mime_type: string
  file_hash: string
  uploaded_by: number
  version: string | null
  is_current: boolean
  uploaded_at: string
  policy_title?: string
  policy_code?: string
  uploader_name?: string
}

interface FileCategory {
  type: string
  icon: React.ReactNode
  color: string
  extensions: string[]
}

interface FileStats {
  totalFiles: number
  totalSize: number
  fileTypes: Record<string, number>
  recentUploads: number
}

export function PolicyFileManagement() {
  const [attachments, setAttachments] = useState<PolicyAttachment[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState("all")
  const [filterPolicy, setFilterPolicy] = useState("all")
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [selectedAttachment, setSelectedAttachment] = useState<PolicyAttachment | null>(null)
  const [uploadFile, setUploadFile] = useState<File | null>(null)
  const [selectedPolicyForUpload, setSelectedPolicyForUpload] = useState("")
  const [selectedVersionForUpload, setSelectedVersionForUpload] = useState("")
  const [uploadDescription, setUploadDescription] = useState("")
  const [policies, setPolicies] = useState<any[]>([])
  const [fileStats, setFileStats] = useState<FileStats>({
    totalFiles: 0,
    totalSize: 0,
    fileTypes: {},
    recentUploads: 0
  })

  const fileCategories: FileCategory[] = [
    { type: "document", icon: <FileText className="h-4 w-4" />, color: "text-blue-400", extensions: [".pdf", ".doc", ".docx", ".txt", ".rtf"] },
    { type: "spreadsheet", icon: <FileSpreadsheet className="h-4 w-4" />, color: "text-green-400", extensions: [".xls", ".xlsx", ".csv"] },
    { type: "image", icon: <Image className="h-4 w-4" />, color: "text-purple-400", extensions: [".jpg", ".jpeg", ".png", ".gif", ".bmp"] },
    { type: "video", icon: <FileVideo className="h-4 w-4" />, color: "text-red-400", extensions: [".mp4", ".avi", ".mov", ".wmv"] },
    { type: "archive", icon: <Archive className="h-4 w-4" />, color: "text-yellow-400", extensions: [".zip", ".rar", ".7z", ".tar", ".gz"] },
    { type: "other", icon: <File className="h-4 w-4" />, color: "text-gray-400", extensions: [] }
  ]

  useEffect(() => {
    fetchAttachments()
    fetchPolicies()
  }, [])

  useEffect(() => {
    calculateFileStats()
  }, [attachments])

  const fetchAttachments = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/policy-attachments')
      if (!response.ok) throw new Error('Failed to fetch attachments')

      const data = await response.json()
      setAttachments(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error('Error fetching attachments:', error)
      setAttachments([])
    } finally {
      setLoading(false)
    }
  }

  const fetchPolicies = async () => {
    try {
      const response = await fetch('/api/policies')
      const data = await response.json()
      setPolicies(Array.isArray(data.policies) ? data.policies : [])
    } catch (error) {
      console.error('Error fetching policies:', error)
      setPolicies([])
    }
  }

  const calculateFileStats = () => {
    const stats: FileStats = {
      totalFiles: attachments.length,
      totalSize: attachments.reduce((sum, file) => sum + file.file_size, 0),
      fileTypes: {},
      recentUploads: 0
    }

    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

    attachments.forEach(attachment => {
      const fileType = getFileType(attachment.mime_type, attachment.original_filename)
      stats.fileTypes[fileType] = (stats.fileTypes[fileType] || 0) + 1

      if (new Date(attachment.uploaded_at) > sevenDaysAgo) {
        stats.recentUploads++
      }
    })

    setFileStats(stats)
  }

  const getFileType = (mimeType: string, filename: string): string => {
    const extension = filename.toLowerCase().split('.').pop() || ''

    if (mimeType.startsWith('image/')) return 'image'
    if (mimeType.startsWith('video/')) return 'video'
    if (mimeType === 'application/pdf' || extension === 'pdf') return 'document'
    if (mimeType.includes('spreadsheet') || ['xls', 'xlsx', 'csv'].includes(extension)) return 'spreadsheet'
    if (['zip', 'rar', '7z', 'tar', 'gz'].includes(extension)) return 'archive'

    return 'other'
  }

  const getFileIcon = (mimeType: string, filename: string) => {
    const fileType = getFileType(mimeType, filename)
    const category = fileCategories.find(cat => cat.type === fileType) || fileCategories.find(cat => cat.type === 'other')!
    return category.icon
  }

  const getFileColor = (mimeType: string, filename: string) => {
    const fileType = getFileType(mimeType, filename)
    const category = fileCategories.find(cat => cat.type === fileType) || fileCategories.find(cat => cat.type === 'other')!
    return category.color
  }

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  const handleFileUpload = async () => {
    if (!uploadFile || !selectedPolicyForUpload) return

    try {
      const formData = new FormData()
      formData.append("file", uploadFile)
      formData.append("policy_id", selectedPolicyForUpload)
      if (selectedVersionForUpload) {
        formData.append("version_id", selectedVersionForUpload)
      }
      if (uploadDescription) {
        formData.append("description", uploadDescription)
      }

      const response = await fetch(`/api/policies/${selectedPolicyForUpload}/attachments`, {
        method: "POST",
        body: formData,
      })

      const result = await response.json()
      if (!response.ok) {
        throw new Error(result.error || "Failed to upload file")
      }

      setIsUploadDialogOpen(false)
      setUploadFile(null)
      setSelectedPolicyForUpload("")
      setSelectedVersionForUpload("")
      setUploadDescription("")
      fetchAttachments()
    } catch (error) {
      console.error("Error uploading file:", error)
    }
  }

  const handleFileDownload = (attachment: PolicyAttachment) => {
    window.open(attachment.file_path, '_blank')
  }

  const handleFileDelete = async (attachment: PolicyAttachment) => {
    if (!confirm(`Are you sure you want to delete "${attachment.original_filename}"?`)) {
      return
    }

    try {
      const response = await fetch(`/api/policy-attachments/${attachment.id}`, {
        method: "DELETE"
      })

      if (!response.ok) throw new Error("Failed to delete file")

      fetchAttachments()
    } catch (error) {
      console.error("Error deleting file:", error)
    }
  }

  const filteredAttachments = attachments.filter(attachment => {
    const matchesSearch = attachment.original_filename.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         attachment.policy_title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         attachment.policy_code?.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesType = filterType === "all" || getFileType(attachment.mime_type, attachment.original_filename) === filterType
    const matchesPolicy = filterPolicy === "all" || attachment.policy_id.toString() === filterPolicy

    return matchesSearch && matchesType && matchesPolicy
  })

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Policy File Management</h2>
          <p className="text-gray-400">Advanced document management for policies and procedures</p>
        </div>
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
              <DialogDescription>Upload a document and associate it with a policy or version.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="policy-select">Policy</Label>
                <Select value={selectedPolicyForUpload} onValueChange={setSelectedPolicyForUpload}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a policy" />
                  </SelectTrigger>
                  <SelectContent>
                    {policies.map((policy) => (
                      <SelectItem key={policy.id} value={policy.id.toString()}>
                        {policy.policy_id} - {policy.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="file-upload">File</Label>
                <Input
                  id="file-upload"
                  type="file"
                  onChange={(e) => setUploadFile(e.target.files?.[0] || null)}
                  accept=".pdf,.doc,.docx,.txt,.rtf,.xls,.xlsx,.csv,.jpg,.jpeg,.png,.gif,.zip,.rar"
                />
              </div>
              <div>
                <Label htmlFor="description">Description (optional)</Label>
                <Textarea
                  id="description"
                  value={uploadDescription}
                  onChange={(e) => setUploadDescription(e.target.value)}
                  placeholder="Describe the purpose or content of this file"
                  rows={3}
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsUploadDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleFileUpload} disabled={!uploadFile || !selectedPolicyForUpload}>
                  Upload
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* File Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-400">Total Files</p>
                <p className="text-2xl font-bold">{fileStats.totalFiles}</p>
              </div>
              <FileText className="h-8 w-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-400">Total Size</p>
                <p className="text-2xl font-bold">{formatFileSize(fileStats.totalSize)}</p>
              </div>
              <HardDrive className="h-8 w-8 text-green-400" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-400">File Types</p>
                <p className="text-2xl font-bold">{Object.keys(fileStats.fileTypes).length}</p>
              </div>
              <File className="h-8 w-8 text-purple-400" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-400">Recent Uploads</p>
                <p className="text-2xl font-bold">{fileStats.recentUploads}</p>
              </div>
              <Clock className="h-8 w-8 text-orange-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* File Type Distribution */}
      <Card>
        <CardHeader>
          <CardTitle>File Type Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {fileCategories.map((category) => {
              const count = fileStats.fileTypes[category.type] || 0
              return (
                <div key={category.type} className="text-center p-4 rounded-lg">
                  <div className={`inline-flex items-center justify-center w-12 h-12 rounded-full bg-slate-600 mb-2 ${category.color}`}>
                    {category.icon}
                  </div>
                  <div className="text-lg font-bold">{count}</div>
                  <div className="text-sm text-gray-400 capitalize">{category.type}</div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Filters and Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search files..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                {fileCategories.map((category) => (
                  <SelectItem key={category.type} value={category.type}>
                    {category.type.charAt(0).toUpperCase() + category.type.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={filterPolicy} onValueChange={setFilterPolicy}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by policy" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Policies</SelectItem>
                {policies.map((policy) => (
                  <SelectItem key={policy.id} value={policy.id.toString()}>
                    {policy.policy_id}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Files Table */}
      <Card>
        <CardHeader>
          <CardTitle>File Library</CardTitle>
          <CardDescription className="text-gray-400">
            {filteredAttachments.length} files found
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredAttachments.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-400">No files found</p>
              <p className="text-gray-500 text-sm">Upload documents to get started</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="border-slate-700">
                  <TableHead className="text-gray-300">File</TableHead>
                  <TableHead className="text-gray-300">Policy</TableHead>
                  <TableHead className="text-gray-300">Type</TableHead>
                  <TableHead className="text-gray-300">Size</TableHead>
                  <TableHead className="text-gray-300">Version</TableHead>
                  <TableHead className="text-gray-300">Uploaded</TableHead>
                  <TableHead className="text-gray-300">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAttachments.map((attachment) => (
                  <TableRow key={attachment.id} className="border-slate-700">
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <div className={getFileColor(attachment.mime_type, attachment.original_filename)}>
                          {getFileIcon(attachment.mime_type, attachment.original_filename)}
                        </div>
                        <div>
                          <div className="text-white font-medium">{attachment.original_filename}</div>
                          <div className="text-sm text-gray-400">{attachment.filename}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        {attachment.policy_code}
                        {attachment.is_current && (
                          <Badge className="ml-2 bg-green-500 text-xs">Current</Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-slate-300">
                        {getFileType(attachment.mime_type, attachment.original_filename)}
                      </Badge>
                    </TableCell>
                    <TableCell>{formatFileSize(attachment.file_size)}</TableCell>
                    <TableCell>{attachment.version || "General"}</TableCell>
                    <TableCell>
                      {format(new Date(attachment.uploaded_at), "MMM dd, yyyy")}
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleFileDownload(attachment)}
                          className="text-slate-300 hover:bg-slate-700"
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setSelectedAttachment(attachment)
                            setIsViewDialogOpen(true)
                          }}
                          className="text-slate-300 hover:bg-slate-700"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleFileDelete(attachment)}
                          className="text-red-400 hover:bg-red-900/20"
                        >
                          <Trash2 className="h-4 w-4" />
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

      {/* File Detail Modal */}
      {selectedAttachment && (
        <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center space-x-3">
                <div className={getFileColor(selectedAttachment.mime_type, selectedAttachment.original_filename)}>
                  {getFileIcon(selectedAttachment.mime_type, selectedAttachment.original_filename)}
                </div>
                <span>{selectedAttachment.original_filename}</span>
              </DialogTitle>
              <DialogDescription>
                File details and metadata
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-gray-300">File Size</Label>
                  <p>{formatFileSize(selectedAttachment.file_size)}</p>
                </div>
                <div>
                  <Label className="text-gray-300">File Type</Label>
                  <p className="text-white capitalize">
                    {getFileType(selectedAttachment.mime_type, selectedAttachment.original_filename)}
                  </p>
                </div>
                <div>
                  <Label className="text-gray-300">Associated Policy</Label>
                  <p>{selectedAttachment.policy_code}</p>
                </div>
                <div>
                  <Label className="text-gray-300">Version</Label>
                  <p>{selectedAttachment.version || "General"}</p>
                </div>
                <div>
                  <Label className="text-gray-300">Upload Date</Label>
                  <p>
                    {format(new Date(selectedAttachment.uploaded_at), "MMM dd, yyyy HH:mm")}
                  </p>
                </div>
                <div>
                  <Label className="text-gray-300">Status</Label>
                  <div className="flex items-center space-x-2">
                    {selectedAttachment.is_current ? (
                      <Badge className="bg-green-500">Current</Badge>
                    ) : (
                      <Badge variant="outline" className="text-gray-400">Historical</Badge>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex space-x-2 pt-4">
                <Button onClick={() => handleFileDownload(selectedAttachment)} className="flex-1">
                  <Download className="h-4 w-4 mr-2" />
                  Download File
                </Button>
                <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>
                  Close
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
