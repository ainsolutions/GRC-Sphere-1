"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, Plus, Search, Filter, Eye, Edit, Trash2, AlertTriangle, CheckCircle, Clock } from "lucide-react"
import { cn } from "@/lib/utils"
import { format, parseISO, isValid } from 'date-fns';

const formattedDate = (entity: AuditUniverseEntity) => {
  if (!entity?.next_audit_due_date) return "N/A";
  const date = parseISO(entity.next_audit_due_date);
  return isValid(date) ? format(date, "MM dd, yyyy") : "N/A";
}

interface AuditUniverseEntity {
  id: number
  entity_id: string
  entity_name: string
  entity_type: string
  entity_category: string
  description: string
  owner_department: string
  owner_name: string
  owner_email: string
  risk_rating: string
  last_audit_date: string
  next_audit_due_date: string
  audit_frequency: string
  regulatory_requirements: string[]
  business_criticality: string
  materiality_score: number
  inherent_risk_score: number
  control_environment_score: number
  status: string
  tags: string[]
  created_at: string
  updated_at: string
}

const mockEntities: AuditUniverseEntity[] = [
  {
    id: 1,
    entity_id: "AU-001",
    entity_name: "Customer Database System",
    entity_type: "system",
    entity_category: "it",
    description: "Primary customer relationship management database",
    owner_department: "IT",
    owner_name: "John Smith",
    owner_email: "john.smith@company.com",
    risk_rating: "high",
    last_audit_date: "2023-12-15",
    next_audit_due_date: "2024-12-15",
    audit_frequency: "annual",
    regulatory_requirements: ["GDPR", "SOX"],
    business_criticality: "critical",
    materiality_score: 9,
    inherent_risk_score: 8,
    control_environment_score: 7,
    status: "active",
    tags: ["customer-data", "database", "critical"],
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z"
  },
  {
    id: 2,
    entity_id: "AU-002",
    entity_name: "Financial Reporting Process",
    entity_type: "process",
    entity_category: "financial",
    description: "Monthly financial statement preparation and review process",
    owner_department: "Finance",
    owner_name: "Sarah Johnson",
    owner_email: "sarah.johnson@company.com",
    risk_rating: "critical",
    last_audit_date: "2023-11-30",
    next_audit_due_date: "2024-11-30",
    audit_frequency: "annual",
    regulatory_requirements: ["SOX", "IFRS"],
    business_criticality: "critical",
    materiality_score: 10,
    inherent_risk_score: 9,
    control_environment_score: 8,
    status: "active",
    tags: ["financial", "reporting", "sox"],
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z"
  },
  {
    id: 3,
    entity_id: "AU-003",
    entity_name: "HR Payroll System",
    entity_type: "system",
    entity_category: "operational",
    description: "Employee payroll processing and benefits management",
    owner_department: "HR",
    owner_name: "Mike Wilson",
    owner_email: "mike.wilson@company.com",
    risk_rating: "medium",
    last_audit_date: "2023-10-15",
    next_audit_due_date: "2024-10-15",
    audit_frequency: "annual",
    regulatory_requirements: ["Labor Law", "Tax Compliance"],
    business_criticality: "high",
    materiality_score: 7,
    inherent_risk_score: 6,
    control_environment_score: 7,
    status: "active",
    tags: ["hr", "payroll", "employee-data"],
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z"
  }
]

export default function AuditUniversePage() {
  const [entities, setEntities] = useState<AuditUniverseEntity[]>(mockEntities)
  const [filteredEntities, setFilteredEntities] = useState<AuditUniverseEntity[]>(mockEntities)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedType, setSelectedType] = useState<string>("all")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [selectedStatus, setSelectedStatus] = useState<string>("all")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [selectedEntity, setSelectedEntity] = useState<AuditUniverseEntity | null>(null)

  // Form state for create/edit
  const [formData, setFormData] = useState({
    entity_id: "",
    entity_name: "",
    entity_type: "",
    entity_category: "",
    description: "",
    owner_department: "",
    owner_name: "",
    owner_email: "",
    risk_rating: "medium",
    last_audit_date: "",
    next_audit_due_date: "",
    audit_frequency: "annual",
    regulatory_requirements: [] as string[],
    business_criticality: "medium",
    materiality_score: 5,
    inherent_risk_score: 5,
    control_environment_score: 5,
    status: "active",
    tags: [] as string[]
  })

  useEffect(() => {
    let filtered = entities

    if (searchTerm) {
      filtered = filtered.filter(entity =>
        entity.entity_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        entity.entity_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        entity.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (selectedType !== "all") {
      filtered = filtered.filter(entity => entity.entity_type === selectedType)
    }

    if (selectedCategory !== "all") {
      filtered = filtered.filter(entity => entity.entity_category === selectedCategory)
    }

    if (selectedStatus !== "all") {
      filtered = filtered.filter(entity => entity.status === selectedStatus)
    }

    setFilteredEntities(filtered)
  }, [entities, searchTerm, selectedType, selectedCategory, selectedStatus])

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "low": return "bg-green-100 text-green-800"
      case "medium": return "bg-yellow-100 text-yellow-800"
      case "high": return "bg-orange-100 text-orange-800"
      case "critical": return "bg-red-100 text-red-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  const getCriticalityColor = (criticality: string) => {
    switch (criticality) {
      case "low": return "bg-green-100 text-green-800"
      case "medium": return "bg-yellow-100 text-yellow-800"
      case "high": return "bg-orange-100 text-orange-800"
      case "critical": return "bg-red-100 text-red-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active": return <CheckCircle className="h-4 w-4 text-green-600" />
      case "inactive": return <Clock className="h-4 w-4 text-gray-600" />
      case "archived": return <AlertTriangle className="h-4 w-4 text-red-600" />
      default: return <Clock className="h-4 w-4 text-gray-600" />
    }
  }

  const handleCreateEntity = () => {
    const newEntity: AuditUniverseEntity = {
      id: entities.length + 1,
      ...formData,
      regulatory_requirements: formData.regulatory_requirements,
      tags: formData.tags,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
    setEntities([...entities, newEntity])
    setIsCreateDialogOpen(false)
    resetForm()
  }

  const handleEditEntity = (entity: AuditUniverseEntity) => {
    setSelectedEntity(entity)
    setFormData({
      entity_id: entity.entity_id,
      entity_name: entity.entity_name,
      entity_type: entity.entity_type,
      entity_category: entity.entity_category,
      description: entity.description,
      owner_department: entity.owner_department,
      owner_name: entity.owner_name,
      owner_email: entity.owner_email,
      risk_rating: entity.risk_rating,
      last_audit_date: entity.last_audit_date,
      next_audit_due_date: entity.next_audit_due_date,
      audit_frequency: entity.audit_frequency,
      regulatory_requirements: entity.regulatory_requirements,
      business_criticality: entity.business_criticality,
      materiality_score: entity.materiality_score,
      inherent_risk_score: entity.inherent_risk_score,
      control_environment_score: entity.control_environment_score,
      status: entity.status,
      tags: entity.tags
    })
    setIsEditDialogOpen(true)
  }

  const handleUpdateEntity = () => {
    if (!selectedEntity) return

    const updatedEntities = entities.map(entity =>
      entity.id === selectedEntity.id
        ? { ...entity, ...formData, updated_at: new Date().toISOString() }
        : entity
    )
    setEntities(updatedEntities)
    setIsEditDialogOpen(false)
    setSelectedEntity(null)
    resetForm()
  }

  const resetForm = () => {
    setFormData({
      entity_id: "",
      entity_name: "",
      entity_type: "",
      entity_category: "",
      description: "",
      owner_department: "",
      owner_name: "",
      owner_email: "",
      risk_rating: "medium",
      last_audit_date: "",
      next_audit_due_date: "",
      audit_frequency: "annual",
      regulatory_requirements: [],
      business_criticality: "medium",
      materiality_score: 5,
      inherent_risk_score: 5,
      control_environment_score: 5,
      status: "active",
      tags: []
    })
  }

  const uniqueTypes = Array.from(new Set(entities.map(entity => entity.entity_type)))
  const uniqueCategories = Array.from(new Set(entities.map(entity => entity.entity_category)))

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto p-6">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Audit Universe
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Manage all auditable entities in your organization
              </p>
            </div>
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Entity
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Add New Audit Entity</DialogTitle>
                  <DialogDescription>
                    Create a new entity in the audit universe
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="entity_id">Entity ID</Label>
                      <Input
                        id="entity_id"
                        value={formData.entity_id}
                        onChange={(e) => setFormData({ ...formData, entity_id: e.target.value })}
                        placeholder="AU-001"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="entity_name">Entity Name</Label>
                      <Input
                        id="entity_name"
                        value={formData.entity_name}
                        onChange={(e) => setFormData({ ...formData, entity_name: e.target.value })}
                        placeholder="Customer Database System"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="entity_type">Entity Type</Label>
                      <Select value={formData.entity_type} onValueChange={(value) => setFormData({ ...formData, entity_type: value })}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="system">System</SelectItem>
                          <SelectItem value="process">Process</SelectItem>
                          <SelectItem value="location">Location</SelectItem>
                          <SelectItem value="department">Department</SelectItem>
                          <SelectItem value="vendor">Vendor</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="entity_category">Category</Label>
                      <Select value={formData.entity_category} onValueChange={(value) => setFormData({ ...formData, entity_category: value })}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="financial">Financial</SelectItem>
                          <SelectItem value="operational">Operational</SelectItem>
                          <SelectItem value="compliance">Compliance</SelectItem>
                          <SelectItem value="it">IT</SelectItem>
                          <SelectItem value="security">Security</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Describe the entity..."
                      rows={3}
                    />
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="owner_department">Owner Department</Label>
                      <Input
                        id="owner_department"
                        value={formData.owner_department}
                        onChange={(e) => setFormData({ ...formData, owner_department: e.target.value })}
                        placeholder="IT"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="owner_name">Owner Name</Label>
                      <Input
                        id="owner_name"
                        value={formData.owner_name}
                        onChange={(e) => setFormData({ ...formData, owner_name: e.target.value })}
                        placeholder="John Smith"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="owner_email">Owner Email</Label>
                      <Input
                        id="owner_email"
                        type="email"
                        value={formData.owner_email}
                        onChange={(e) => setFormData({ ...formData, owner_email: e.target.value })}
                        placeholder="john.smith@company.com"
                      />
                    </div>
                  </div>
                  
                 
                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="risk_rating">Risk Rating</Label>
                      <Select value={formData.risk_rating} onValueChange={(value) => setFormData({ ...formData, risk_rating: value })}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Low</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="high">High</SelectItem>
                          <SelectItem value="critical">Critical</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                
                    <div className="space-y-2">
                      <Label htmlFor="business_criticality">Materiality Score</Label>
                      <Select value={formData.materiality_score} onValueChange={(value) => setFormData({ ...formData, materiality_score: value })}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Low</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="high">High</SelectItem>
                          <SelectItem value="critical">Critical</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  
                    <div className="space-y-2">
                      <Label htmlFor="regulatory_requirements">Regulatory Requirements</Label>
                      <Input
                        id="regulatory_requirements"
                        type="text"
                        value={formData.regulatory_requirements}
                        onChange={(e) => setFormData({ ...formData, regulatory_requirements: e.target.value.split(',') })}
                        placeholder="Internal audit requirements, financial reporting requirements, etc."
                      />
                    </div>
                  
                    <div className="space-y-2">
                      <Label htmlFor="audit_frequency">Audit Frequency</Label>
                      <Select value={formData.audit_frequency} onValueChange={(value) => setFormData({ ...formData, audit_frequency: value })}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="quarterly">Quarterly</SelectItem>
                          <SelectItem value="semi-annual">Semi-Annual</SelectItem>
                          <SelectItem value="annual">Annual</SelectItem>
                          <SelectItem value="bi-annual">Bi-Annual</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleCreateEntity}>
                    Create Entity
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* Summary Cards */}
          <div className="grid gap-4 md:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Entities</CardTitle>
                <Eye className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{entities.length}</div>
                <p className="text-xs text-muted-foreground">In audit universe</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">High Risk</CardTitle>
                <AlertTriangle className="h-4 w-4 text-red-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {entities.filter(e => e.risk_rating === 'high' || e.risk_rating === 'critical').length}
                </div>
                <p className="text-xs text-muted-foreground">Require attention</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Due Soon</CardTitle>
                <Clock className="h-4 w-4 text-orange-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {entities.filter(e => {
                    const dueDate = new Date(e.next_audit_due_date)
                    const today = new Date()
                    const diffDays = Math.ceil((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
                    return diffDays <= 90 && diffDays >= 0
                  }).length}
                </div>
                <p className="text-xs text-muted-foreground">Next 90 days</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active</CardTitle>
                <CheckCircle className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {entities.filter(e => e.status === 'active').length}
                </div>
                <p className="text-xs text-muted-foreground">Currently active</p>
              </CardContent>
            </Card>
          </div>

          {/* Filters */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                Filters
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-4">
                <div className="space-y-2">
                  <Label>Search</Label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      placeholder="Search entities..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Entity Type</Label>
                  <Select value={selectedType} onValueChange={setSelectedType}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      {uniqueTypes.map(type => (
                        <SelectItem key={type} value={type}>
                          {type.charAt(0).toUpperCase() + type.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Category</Label>
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      {uniqueCategories.map(category => (
                        <SelectItem key={category} value={category}>
                          {category.charAt(0).toUpperCase() + category.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Status</Label>
                  <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                      <SelectItem value="archived">Archived</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Entities Table */}
          <Card>
            <CardHeader>
              <CardTitle>Audit Universe Entities</CardTitle>
              <CardDescription>
                Showing {filteredEntities.length} of {entities.length} entities
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Entity ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Owner</TableHead>
                    <TableHead>Risk Rating</TableHead>
                    <TableHead>Criticality</TableHead>
                    <TableHead>Next Audit</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredEntities.map((entity) => (
                    <TableRow key={entity.id}>
                      <TableCell className="font-mono text-sm">{entity.entity_id}</TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{entity.entity_name}</div>
                          <div className="text-sm text-muted-foreground truncate max-w-xs">
                            {entity.description}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {entity.entity_type.charAt(0).toUpperCase() + entity.entity_type.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">
                          {entity.entity_category.charAt(0).toUpperCase() + entity.entity_category.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="text-sm font-medium">{entity.owner_name}</div>
                          <div className="text-xs text-muted-foreground">{entity.owner_department}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getRiskColor(entity.risk_rating)}>
                          {entity.risk_rating.charAt(0).toUpperCase() + entity.risk_rating.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={getCriticalityColor(entity.business_criticality)}>
                          {entity.business_criticality.charAt(0).toUpperCase() + entity.business_criticality.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                            {formattedDate(entity)}
                            </div>
                        <div className="text-xs text-muted-foreground">
                          {entity.audit_frequency}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getStatusIcon(entity.status)}
                          <span className="text-sm capitalize">{entity.status}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditEntity(entity)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {/* Handle view */}}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
