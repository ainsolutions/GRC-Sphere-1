"use client"

import React, { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useToast } from "@/hooks/use-toast"
import {
  FileText,
  Plus,
  Edit,
  Trash2,
  Eye,
  Download,
  Upload,
  Calendar,
  Users,
  AlertTriangle,
  CheckCircle,
  Clock,
  Search,
  Filter,
  RefreshCw,
  BookOpen,
  File,
  Archive,
  Share,
  Lock,
  Unlock,
  Loader2,
} from "lucide-react"

// Interface for governance document data from API
interface GovernanceDocument {
  id: number
  title: string
  document_type: string
  current_version: string
  status: string
  category: string
  subcategory?: string
  description: string
  document_owner: string
  department_owner?: string
  approval_authority?: string
  review_frequency: string
  related_documents: string[]
  applicable_frameworks: string[]
  tags: string[]
  confidentiality_level: string
  distribution_list: string[]
  compliance_requirements: string[]
  created_at: string
  updated_at: string
  created_by?: string
  updated_by?: string
  file_path?: string
  file_size?: number
  mime_type?: string
  version_count?: number
  pending_approvals?: number
}

const documentTypes = ["All", "Policy", "Procedure", "Standard", "Framework", "Guideline"]
const documentStatuses = ["All", "draft", "under_review", "active", "archived", "superseded"]
const categories = ["All", "Security Framework", "Data Protection", "Incident Management", "Access Control", "Risk Management"]
const confidentialityLevels = ["All", "public", "internal", "confidential", "restricted"]

export default function GovernanceDocuments() {
  const [documents, setDocuments] = useState<GovernanceDocument[]>([])
  const [filteredDocuments, setFilteredDocuments] = useState<GovernanceDocument[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedType, setSelectedType] = useState("All")
  const [selectedStatus, setSelectedStatus] = useState("All")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [selectedConfidentiality, setSelectedConfidentiality] = useState("All")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editingDocument, setEditingDocument] = useState<GovernanceDocument | null>(null)
  const { toast } = useToast()

  // Fetch documents from API
  const fetchDocuments = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      if (selectedType !== "All") params.append("type", selectedType)
      if (selectedStatus !== "All") params.append("status", selectedStatus)
      if (selectedCategory !== "All") params.append("category", selectedCategory)
      if (selectedConfidentiality !== "All") params.append("confidentiality_level", selectedConfidentiality)

      const response = await fetch(`/api/governance/documents?${params.toString()}`)
      const result = await response.json()

      if (result.success) {
        setDocuments(result.data || [])
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to fetch documents",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error fetching documents:", error)
      toast({
        title: "Error",
        description: "Failed to fetch documents",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  // Fetch documents on component mount and when filters change
  useEffect(() => {
    fetchDocuments()
  }, [selectedType, selectedStatus, selectedCategory, selectedConfidentiality])

  // Filter documents based on search (other filters are handled by API)
  useEffect(() => {
    let filtered = documents.filter(doc => {
      const matchesSearch = doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           doc.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           (doc.tags && doc.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())))

      return matchesSearch
    })
    setFilteredDocuments(filtered)
  }, [documents, searchTerm])

  const handleCreateDocument = async (documentData: any) => {
    try {
      const response = await fetch('/api/governance/documents', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
      ...documentData,
          created_by: 'Current User' // This should be replaced with actual user from session
        }),
      })

      const result = await response.json()

      if (result.success) {
        await fetchDocuments() // Refresh the documents list
    setIsCreateDialogOpen(false)
    toast({
      title: "Document Created",
      description: "New document has been successfully created.",
    })
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to create document",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error creating document:", error)
      toast({
        title: "Error",
        description: "Failed to create document",
        variant: "destructive",
      })
    }
  }

  const handleEditDocument = async (documentData: any) => {
    if (!editingDocument) return

    try {
      const response = await fetch(`/api/governance/documents/${editingDocument.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
      ...documentData,
          updated_by: 'Current User' // This should be replaced with actual user from session
        }),
      })

      const result = await response.json()

      if (result.success) {
        await fetchDocuments() // Refresh the documents list
    setIsEditDialogOpen(false)
    setEditingDocument(null)
    toast({
      title: "Document Updated",
      description: "Document has been successfully updated.",
    })
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to update document",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error updating document:", error)
      toast({
        title: "Error",
        description: "Failed to update document",
        variant: "destructive",
      })
    }
  }

  const handleDeleteDocument = async (id: number) => {
    try {
      const response = await fetch(`/api/governance/documents/${id}`, {
        method: 'DELETE',
      })

      const result = await response.json()

      if (result.success) {
        await fetchDocuments() // Refresh the documents list
    toast({
      title: "Document Deleted",
      description: "Document has been successfully deleted.",
    })
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to delete document",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error deleting document:", error)
      toast({
        title: "Error",
        description: "Failed to delete document",
        variant: "destructive",
      })
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      case "under_review": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
      case "archived": return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
      case "superseded": return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300"
      case "draft": return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
    }
  }

  const getConfidentialityColor = (level: string) => {
    switch (level) {
      case "public": return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      case "internal": return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
      case "confidential": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
      case "restricted": return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "Policy": return <FileText className="h-4 w-4" />
      case "Procedure": return <BookOpen className="h-4 w-4" />
      case "Standard": return <File className="h-4 w-4" />
      case "Framework": return <Archive className="h-4 w-4" />
      case "Guideline": return <BookOpen className="h-4 w-4" />
      default: return <FileText className="h-4 w-4" />
    }
  }

  // Calculate document statistics
  const totalDocuments = documents.length
  const activeDocuments = documents.filter(doc => doc.status === "active").length
  const underReviewDocuments = documents.filter(doc => doc.status === "under_review").length
  const archivedDocuments = documents.filter(doc => doc.status === "archived").length

  return (
    <div>
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-violet-600 bg-clip-text text-transparent">
                Document Management
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                Manage governance documents, policies, and procedures
              </p>
            </div>
            <div className="flex space-x-2">
              <Button variant="outline">
                <Upload className="h-4 w-4 mr-2" />
                Upload
              </Button>
              <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Document
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Create New Document</DialogTitle>
                    <DialogDescription>
                      Add a new governance document to the repository.
                    </DialogDescription>
                  </DialogHeader>
                  <DocumentForm onSubmit={handleCreateDocument} />
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Documents</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {totalDocuments}
                  </p>
                </div>
                <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-full">
                  <FileText className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Active</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {activeDocuments}
                  </p>
                </div>
                <div className="p-3 bg-green-100 dark:bg-green-900 rounded-full">
                  <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Under Review</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {underReviewDocuments}
                  </p>
                </div>
                <div className="p-3 bg-yellow-100 dark:bg-yellow-900 rounded-full">
                  <Clock className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Archived</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {archivedDocuments}
                  </p>
                </div>
                <div className="p-3 bg-red-100 dark:bg-red-900 rounded-full">
                  <AlertTriangle className="h-6 w-6 text-red-600 dark:text-red-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex flex-wrap gap-4 items-center">
              <div className="flex-1 min-w-64">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search documents..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={fetchDocuments}
                disabled={loading}
                className="flex items-center gap-2"
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <RefreshCw className="h-4 w-4" />
                )}
                Refresh
              </Button>
              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  {documentTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  {documentStatuses.map((status) => (
                    <SelectItem key={status} value={status}>
                      {status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={selectedConfidentiality} onValueChange={setSelectedConfidentiality}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Confidentiality" />
                </SelectTrigger>
                <SelectContent>
                  {confidentialityLevels.map((level) => (
                    <SelectItem key={level} value={level}>
                      {level}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Documents Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Governance Documents ({filteredDocuments.length})
                      </CardTitle>
            <CardDescription>
              Manage governance documents, policies, and procedures
                      </CardDescription>
              </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin" />
                <span className="ml-2">Loading documents...</span>
                  </div>
            ) : filteredDocuments.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No documents found. Try adjusting your filters or create a new document.
                  </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Version</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Owner</TableHead>
                      <TableHead>Department</TableHead>
                      <TableHead>Confidentiality</TableHead>
                      <TableHead>File Size</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead>Updated</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredDocuments.map((document) => (
                      <TableRow key={document.id}>
                        <TableCell>
                          <div className="max-w-xs">
                            <div className="font-semibold truncate" title={document.title}>
                              {document.title}
                  </div>
                            <div className="text-sm text-gray-500 truncate" title={document.description}>
                              {document.description}
                  </div>
                            {document.tags && document.tags.length > 0 && (
                              <div className="flex flex-wrap gap-1 mt-1">
                                {document.tags.slice(0, 2).map((tag, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                                {document.tags.length > 2 && (
                                  <Badge variant="secondary" className="text-xs">
                                    +{document.tags.length - 2}
                                  </Badge>
                                )}
                </div>
                            )}
                    </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {getTypeIcon(document.document_type)}
                            <span className="text-sm">{document.document_type}</span>
                    </div>
                        </TableCell>
                        <TableCell className="font-mono text-sm">
                          {document.current_version}
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(document.status)}>
                            {document.status.replace('_', ' ')}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{document.category}</Badge>
                        </TableCell>
                        <TableCell className="text-sm">{document.document_owner}</TableCell>
                        <TableCell className="text-sm">{document.department_owner || 'N/A'}</TableCell>
                        <TableCell>
                          <Badge className={getConfidentialityColor(document.confidentiality_level)}>
                            {document.confidentiality_level}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm">
                          {document.file_size ? 
                            `${(document.file_size / 1024 / 1024).toFixed(1)} MB` : 
                            'N/A'
                          }
                        </TableCell>
                        <TableCell className="text-sm">
                          {new Date(document.created_at).toLocaleDateString()}
                        </TableCell>
                        <TableCell className="text-sm">
                          {new Date(document.updated_at).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                  <Button variant="ghost" size="sm">
                              <Eye className="h-4 w-4" />
                  </Button>
                            {document.file_path && (
                  <Button variant="ghost" size="sm">
                                <Download className="h-4 w-4" />
                  </Button>
                            )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setEditingDocument(document)
                      setIsEditDialogOpen(true)
                    }}
                  >
                              <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteDocument(document.id)}
                  >
                              <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
              </CardContent>
            </Card>

        {/* Edit Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Edit Document</DialogTitle>
              <DialogDescription>
                Update the document details and metadata.
              </DialogDescription>
            </DialogHeader>
            <DocumentForm 
              document={editingDocument || undefined} 
              onSubmit={handleEditDocument}
              onCancel={() => {
                setIsEditDialogOpen(false)
                setEditingDocument(null)
              }}
            />
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}

// Document Form Component
function DocumentForm({ document, onSubmit, onCancel }: { 
  document?: GovernanceDocument
  onSubmit: (data: any) => void
  onCancel?: () => void
}) {
  const [formData, setFormData] = useState({
    title: document?.title || "",
    description: document?.description || "",
    document_type: document?.document_type || "Policy",
    version: document?.current_version || "1.0",
    status: document?.status || "draft",
    category: document?.category || "Security Framework",
    subcategory: document?.subcategory || "",
    document_owner: document?.document_owner || "",
    department_owner: document?.department_owner || "",
    approval_authority: document?.approval_authority || "",
    review_frequency: document?.review_frequency || "annual",
    confidentiality_level: document?.confidentiality_level || "internal",
    tags: document?.tags?.join(", ") || "",
    applicable_frameworks: document?.applicable_frameworks?.join(", ") || "",
    compliance_requirements: document?.compliance_requirements?.join(", ") || ""
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const documentData = {
      ...formData,
      tags: formData.tags.split(",").map(tag => tag.trim()).filter(tag => tag),
      applicable_frameworks: formData.applicable_frameworks.split(",").map(f => f.trim()).filter(f => f),
      compliance_requirements: formData.compliance_requirements.split(",").map(r => r.trim()).filter(r => r)
    }
    onSubmit(documentData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="title">Document Title</Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          required
        />
      </div>

      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          rows={3}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="document_type">Document Type</Label>
          <Select value={formData.document_type} onValueChange={(value) => setFormData({ ...formData, document_type: value })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Policy">Policy</SelectItem>
              <SelectItem value="Procedure">Procedure</SelectItem>
              <SelectItem value="Standard">Standard</SelectItem>
              <SelectItem value="Framework">Framework</SelectItem>
              <SelectItem value="Guideline">Guideline</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="version">Version</Label>
          <Input
            id="version"
            value={formData.version}
            onChange={(e) => setFormData({ ...formData, version: e.target.value })}
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="status">Status</Label>
          <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="under_review">Under Review</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="archived">Archived</SelectItem>
              <SelectItem value="superseded">Superseded</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="category">Category</Label>
          <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Security Framework">Security Framework</SelectItem>
              <SelectItem value="Data Protection">Data Protection</SelectItem>
              <SelectItem value="Incident Management">Incident Management</SelectItem>
              <SelectItem value="Access Control">Access Control</SelectItem>
              <SelectItem value="Risk Management">Risk Management</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="subcategory">Subcategory</Label>
          <Input
            id="subcategory"
            value={formData.subcategory}
            onChange={(e) => setFormData({ ...formData, subcategory: e.target.value })}
            placeholder="Optional subcategory"
          />
        </div>
        <div>
          <Label htmlFor="review_frequency">Review Frequency</Label>
          <Select value={formData.review_frequency} onValueChange={(value) => setFormData({ ...formData, review_frequency: value })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="monthly">Monthly</SelectItem>
              <SelectItem value="quarterly">Quarterly</SelectItem>
              <SelectItem value="semi-annual">Semi-Annual</SelectItem>
              <SelectItem value="annual">Annual</SelectItem>
              <SelectItem value="as-needed">As Needed</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="document_owner">Document Owner</Label>
          <Input
            id="document_owner"
            value={formData.document_owner}
            onChange={(e) => setFormData({ ...formData, document_owner: e.target.value })}
            required
          />
        </div>
        <div>
          <Label htmlFor="department_owner">Department Owner</Label>
          <Input
            id="department_owner"
            value={formData.department_owner}
            onChange={(e) => setFormData({ ...formData, department_owner: e.target.value })}
            placeholder="Optional"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="approval_authority">Approval Authority</Label>
        <Input
          id="approval_authority"
          value={formData.approval_authority}
          onChange={(e) => setFormData({ ...formData, approval_authority: e.target.value })}
          placeholder="Optional"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="confidentiality_level">Confidentiality Level</Label>
          <Select value={formData.confidentiality_level} onValueChange={(value) => setFormData({ ...formData, confidentiality_level: value })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="public">Public</SelectItem>
              <SelectItem value="internal">Internal</SelectItem>
              <SelectItem value="confidential">Confidential</SelectItem>
              <SelectItem value="restricted">Restricted</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="tags">Tags (comma-separated)</Label>
          <Input
            id="tags"
            value={formData.tags}
            onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
            placeholder="e.g., Security, Policy, Framework"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="applicable_frameworks">Applicable Frameworks (comma-separated)</Label>
          <Input
            id="applicable_frameworks"
            value={formData.applicable_frameworks}
            onChange={(e) => setFormData({ ...formData, applicable_frameworks: e.target.value })}
            placeholder="e.g., ISO 27001, NIST CSF, COBIT"
          />
        </div>
        <div>
          <Label htmlFor="compliance_requirements">Compliance Requirements (comma-separated)</Label>
          <Input
            id="compliance_requirements"
            value={formData.compliance_requirements}
            onChange={(e) => setFormData({ ...formData, compliance_requirements: e.target.value })}
            placeholder="e.g., SOX, GDPR, HIPAA"
          />
        </div>
      </div>

      <DialogFooter>
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button type="submit">
          {document ? "Update Document" : "Create Document"}
        </Button>
      </DialogFooter>
    </form>
  )
}
