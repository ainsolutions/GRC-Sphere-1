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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, Filter, Plus, Eye, Edit, Trash2, Shield, Target, AlertTriangle, CheckCircle, Clock, Database, Link } from "lucide-react"
import { cn } from "@/lib/utils"
import { ActionButtons } from "@/components/ui/action-buttons"

interface Control {
  id: number
  control_id: string
  control_name: string
  control_category: string
  control_type: string
  control_family: string
  description: string
  control_objective: string
  control_activities: string[]
  applicable_frameworks: string[]
  regulatory_mappings: string[]
  risk_categories: string[]
  control_owner: string
  control_owner_email: string
  implementation_status: string
  effectiveness_rating: string
  last_review_date: string
  next_review_date: string
  testing_frequency: string
  testing_method: string
  control_design: string
  control_operation: string
  documentation_location: string
  related_controls: string[]
  tags: string[]
  created_at: string
  updated_at: string
}

interface RiskControlMapping {
  id: number
  risk_id: string
  control_id: string
  mapping_type: string
  effectiveness_rating: string
  coverage_percentage: number
  residual_risk_level: string
  last_assessment_date: string
  next_assessment_date: string
  assessment_notes: string
  control_name: string
  control_category: string
  control_family: string
  created_at: string
  updated_at: string
}

const mockControls: Control[] = [
  {
    id: 1,
    control_id: "CTRL-001",
    control_name: "User Access Management",
    control_category: "preventive",
    control_type: "automated",
    control_family: "access_control",
    description: "Controls for managing user access to systems and applications",
    control_objective: "Ensure only authorized users have appropriate access to systems",
    control_activities: ["User provisioning", "Access reviews", "Access revocation"],
    applicable_frameworks: ["COSO", "COBIT", "ISO27001"],
    regulatory_mappings: ["SOX", "GDPR"],
    risk_categories: ["Unauthorized Access", "Data Breach"],
    control_owner: "IT Security",
    control_owner_email: "security@company.com",
    implementation_status: "fully-implemented",
    effectiveness_rating: "effective",
    last_review_date: "2024-01-15",
    next_review_date: "2024-07-15",
    testing_frequency: "quarterly",
    testing_method: "inspection",
    control_design: "effective",
    control_operation: "effective",
    documentation_location: "/docs/controls/CTRL-001",
    related_controls: ["CTRL-002", "CTRL-003"],
    tags: ["access-control", "security", "critical"],
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-15T00:00:00Z"
  },
  {
    id: 2,
    control_id: "CTRL-002",
    control_name: "Data Backup and Recovery",
    control_category: "corrective",
    control_type: "automated",
    control_family: "data_protection",
    description: "Automated backup and recovery procedures for critical data",
    control_objective: "Ensure data can be recovered in case of loss or corruption",
    control_activities: ["Daily backups", "Recovery testing", "Backup verification"],
    applicable_frameworks: ["COBIT", "ISO27001"],
    regulatory_mappings: ["SOX", "GDPR"],
    risk_categories: ["Data Loss", "Business Continuity"],
    control_owner: "IT Operations",
    control_owner_email: "ops@company.com",
    implementation_status: "fully-implemented",
    effectiveness_rating: "effective",
    last_review_date: "2024-01-10",
    next_review_date: "2024-07-10",
    testing_frequency: "monthly",
    testing_method: "reperformance",
    control_design: "effective",
    control_operation: "effective",
    documentation_location: "/docs/controls/CTRL-002",
    related_controls: ["CTRL-001", "CTRL-004"],
    tags: ["backup", "recovery", "data-protection"],
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-10T00:00:00Z"
  },
  {
    id: 3,
    control_id: "CTRL-003",
    control_name: "Change Management Process",
    control_category: "preventive",
    control_type: "manual",
    control_family: "change_management",
    description: "Formal process for managing system and application changes",
    control_objective: "Ensure changes are properly authorized, tested, and implemented",
    control_activities: ["Change request", "Impact assessment", "Testing", "Approval"],
    applicable_frameworks: ["COBIT", "ITIL"],
    regulatory_mappings: ["SOX"],
    risk_categories: ["System Instability", "Unauthorized Changes"],
    control_owner: "IT Operations",
    control_owner_email: "ops@company.com",
    implementation_status: "partially-implemented",
    effectiveness_rating: "partially-effective",
    last_review_date: "2024-01-05",
    next_review_date: "2024-07-05",
    testing_frequency: "quarterly",
    testing_method: "inquiry",
    control_design: "effective",
    control_operation: "partially-effective",
    documentation_location: "/docs/controls/CTRL-003",
    related_controls: ["CTRL-001", "CTRL-005"],
    tags: ["change-management", "process", "governance"],
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-05T00:00:00Z"
  }
]

const mockMappings: RiskControlMapping[] = [
  {
    id: 1,
    risk_id: "RISK-001",
    control_id: "CTRL-001",
    mapping_type: "mitigates",
    effectiveness_rating: "high",
    coverage_percentage: 85,
    residual_risk_level: "low",
    last_assessment_date: "2024-01-15",
    next_assessment_date: "2024-07-15",
    assessment_notes: "Control effectively mitigates unauthorized access risk",
    control_name: "User Access Management",
    control_category: "preventive",
    control_family: "access_control",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-15T00:00:00Z"
  },
  {
    id: 2,
    risk_id: "RISK-002",
    control_id: "CTRL-002",
    mapping_type: "mitigates",
    effectiveness_rating: "high",
    coverage_percentage: 90,
    residual_risk_level: "low",
    last_assessment_date: "2024-01-10",
    next_assessment_date: "2024-07-10",
    assessment_notes: "Backup controls provide strong protection against data loss",
    control_name: "Data Backup and Recovery",
    control_category: "corrective",
    control_family: "data_protection",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-10T00:00:00Z"
  }
]

export default function RiskControlRepositoryPage() {
  const [controls, setControls] = useState<Control[]>(mockControls)
  const [mappings, setMappings] = useState<RiskControlMapping[]>(mockMappings)
  const [activeTab, setActiveTab] = useState("controls")
  const [isCreateControlDialogOpen, setIsCreateControlDialogOpen] = useState(false)
  const [isCreateMappingDialogOpen, setIsCreateMappingDialogOpen] = useState(false)

  // Form states
  const [controlFormData, setControlFormData] = useState({
    control_id: "",
    control_name: "",
    control_category: "",
    control_type: "",
    control_family: "",
    description: "",
    control_objective: "",
    control_activities: [] as string[],
    applicable_frameworks: [] as string[],
    regulatory_mappings: [] as string[],
    risk_categories: [] as string[],
    control_owner: "",
    control_owner_email: "",
    implementation_status: "not-implemented",
    effectiveness_rating: "unknown",
    last_review_date: "",
    next_review_date: "",
    testing_frequency: "annual",
    testing_method: "",
    control_design: "unknown",
    control_operation: "unknown",
    documentation_location: "",
    related_controls: [] as string[],
    tags: [] as string[]
  })

  const [mappingFormData, setMappingFormData] = useState({
    risk_id: "",
    control_id: "",
    mapping_type: "",
    effectiveness_rating: "unknown",
    coverage_percentage: 0,
    residual_risk_level: "",
    last_assessment_date: "",
    next_assessment_date: "",
    assessment_notes: ""
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "not-implemented": return "bg-red-100 text-red-800"
      case "partially-implemented": return "bg-yellow-100 text-yellow-800"
      case "fully-implemented": return "bg-green-100 text-green-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  const getEffectivenessColor = (rating: string) => {
    switch (rating) {
      case "ineffective": return "bg-red-100 text-red-800"
      case "partially-effective": return "bg-yellow-100 text-yellow-800"
      case "effective": return "bg-green-100 text-green-800"
      case "unknown": return "bg-gray-100 text-gray-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "preventive": return "bg-blue-100 text-blue-800"
      case "detective": return "bg-purple-100 text-purple-800"
      case "corrective": return "bg-orange-100 text-orange-800"
      case "compensating": return "bg-indigo-100 text-indigo-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  const getMappingTypeColor = (type: string) => {
    switch (type) {
      case "mitigates": return "bg-green-100 text-green-800"
      case "monitors": return "bg-blue-100 text-blue-800"
      case "prevents": return "bg-purple-100 text-purple-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  const handleCreateControl = () => {
    const newControl: Control = {
      id: controls.length + 1,
      ...controlFormData,
      control_activities: controlFormData.control_activities,
      applicable_frameworks: controlFormData.applicable_frameworks,
      regulatory_mappings: controlFormData.regulatory_mappings,
      risk_categories: controlFormData.risk_categories,
      related_controls: controlFormData.related_controls,
      tags: controlFormData.tags,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
    setControls([...controls, newControl])
    setIsCreateControlDialogOpen(false)
    resetControlForm()
  }

  const handleCreateMapping = () => {
    const newMapping: RiskControlMapping = {
      id: mappings.length + 1,
      ...mappingFormData,
      control_name: controls.find(c => c.control_id === mappingFormData.control_id)?.control_name || "",
      control_category: controls.find(c => c.control_id === mappingFormData.control_id)?.control_category || "",
      control_family: controls.find(c => c.control_id === mappingFormData.control_id)?.control_family || "",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
    setMappings([...mappings, newMapping])
    setIsCreateMappingDialogOpen(false)
    resetMappingForm()
  }

  const resetControlForm = () => {
    setControlFormData({
      control_id: "",
      control_name: "",
      control_category: "",
      control_type: "",
      control_family: "",
      description: "",
      control_objective: "",
      control_activities: [],
      applicable_frameworks: [],
      regulatory_mappings: [],
      risk_categories: [],
      control_owner: "",
      control_owner_email: "",
      implementation_status: "not-implemented",
      effectiveness_rating: "unknown",
      last_review_date: "",
      next_review_date: "",
      testing_frequency: "annual",
      testing_method: "",
      control_design: "unknown",
      control_operation: "unknown",
      documentation_location: "",
      related_controls: [],
      tags: []
    })
  }

  const resetMappingForm = () => {
    setMappingFormData({
      risk_id: "",
      control_id: "",
      mapping_type: "",
      effectiveness_rating: "unknown",
      coverage_percentage: 0,
      residual_risk_level: "",
      last_assessment_date: "",
      next_assessment_date: "",
      assessment_notes: ""
    })
  }

  const uniqueCategories = Array.from(new Set(controls.map(control => control.control_category)))
  const uniqueFamilies = Array.from(new Set(controls.map(control => control.control_family)))

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto p-6">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Risk & Control Repository
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Manage your control library and risk-control mappings
              </p>
            </div>
          </div>

          {/* Summary Cards */}
          <div className="grid gap-4 md:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Controls</CardTitle>
                <Shield className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{controls.length}</div>
                <p className="text-xs text-muted-foreground">In control library</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Implemented</CardTitle>
                <CheckCircle className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {controls.filter(c => c.implementation_status === 'fully-implemented').length}
                </div>
                <p className="text-xs text-muted-foreground">Fully implemented</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Risk Mappings</CardTitle>
                <Link className="h-4 w-4 text-purple-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{mappings.length}</div>
                <p className="text-xs text-muted-foreground">Risk-control mappings</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Due for Review</CardTitle>
                <Clock className="h-4 w-4 text-orange-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {controls.filter(c => {
                    const reviewDate = new Date(c.next_review_date)
                    const today = new Date()
                    const diffDays = Math.ceil((reviewDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
                    return diffDays <= 30 && diffDays >= 0
                  }).length}
                </div>
                <p className="text-xs text-muted-foreground">Next 30 days</p>
              </CardContent>
            </Card>
          </div>

          {/* Main Content Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="controls">Control Library</TabsTrigger>
              <TabsTrigger value="mappings">Risk Mappings</TabsTrigger>
            </TabsList>

            {/* Controls Tab */}
            <TabsContent value="controls" className="space-y-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Control Library</CardTitle>
                    <CardDescription>
                      Manage your organization's control library
                    </CardDescription>
                  </div>
                  <Dialog open={isCreateControlDialogOpen} onOpenChange={setIsCreateControlDialogOpen}>
                    <DialogTrigger asChild>
                      <ActionButtons isTableAction={false} onAdd={() => { }} btnAddText="Add Control" />
                      {/* <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                        <Plus className="mr-2 h-4 w-4" />
                        Add Control
                      </Button> */}
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>Add New Control</DialogTitle>
                        <DialogDescription>
                          Add a new control to the library
                        </DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="control_id">Control ID</Label>
                            <Input
                              id="control_id"
                              value={controlFormData.control_id}
                              onChange={(e) => setControlFormData({ ...controlFormData, control_id: e.target.value })}
                              placeholder="CTRL-001"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="control_name">Control Name</Label>
                            <Input
                              id="control_name"
                              value={controlFormData.control_name}
                              onChange={(e) => setControlFormData({ ...controlFormData, control_name: e.target.value })}
                              placeholder="User Access Management"
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="control_category">Category</Label>
                            <Select value={controlFormData.control_category} onValueChange={(value) => setControlFormData({ ...controlFormData, control_category: value })}>
                              <SelectTrigger>
                                <SelectValue placeholder="Select category" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="preventive">Preventive</SelectItem>
                                <SelectItem value="detective">Detective</SelectItem>
                                <SelectItem value="corrective">Corrective</SelectItem>
                                <SelectItem value="compensating">Compensating</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="control_type">Type</Label>
                            <Select value={controlFormData.control_type} onValueChange={(value) => setControlFormData({ ...controlFormData, control_type: value })}>
                              <SelectTrigger>
                                <SelectValue placeholder="Select type" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="manual">Manual</SelectItem>
                                <SelectItem value="automated">Automated</SelectItem>
                                <SelectItem value="hybrid">Hybrid</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="control_family">Family</Label>
                            <Select value={controlFormData.control_family} onValueChange={(value) => setControlFormData({ ...controlFormData, control_family: value })}>
                              <SelectTrigger>
                                <SelectValue placeholder="Select family" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="access_control">Access Control</SelectItem>
                                <SelectItem value="data_protection">Data Protection</SelectItem>
                                <SelectItem value="change_management">Change Management</SelectItem>
                                <SelectItem value="incident_response">Incident Response</SelectItem>
                                <SelectItem value="business_continuity">Business Continuity</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="description">Description</Label>
                          <Textarea
                            id="description"
                            value={controlFormData.description}
                            onChange={(e) => setControlFormData({ ...controlFormData, description: e.target.value })}
                            placeholder="Describe the control..."
                            rows={3}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="control_objective">Control Objective</Label>
                          <Textarea
                            id="control_objective"
                            value={controlFormData.control_objective}
                            onChange={(e) => setControlFormData({ ...controlFormData, control_objective: e.target.value })}
                            placeholder="What is the control trying to achieve?"
                            rows={2}
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="control_owner">Control Owner</Label>
                            <Input
                              id="control_owner"
                              value={controlFormData.control_owner}
                              onChange={(e) => setControlFormData({ ...controlFormData, control_owner: e.target.value })}
                              placeholder="IT Security"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="control_owner_email">Owner Email</Label>
                            <Input
                              id="control_owner_email"
                              type="email"
                              value={controlFormData.control_owner_email}
                              onChange={(e) => setControlFormData({ ...controlFormData, control_owner_email: e.target.value })}
                              placeholder="security@company.com"
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="implementation_status">Implementation Status</Label>
                            <Select value={controlFormData.implementation_status} onValueChange={(value) => setControlFormData({ ...controlFormData, implementation_status: value })}>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="not-implemented">Not Implemented</SelectItem>
                                <SelectItem value="partially-implemented">Partially Implemented</SelectItem>
                                <SelectItem value="fully-implemented">Fully Implemented</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="effectiveness_rating">Effectiveness Rating</Label>
                            <Select value={controlFormData.effectiveness_rating} onValueChange={(value) => setControlFormData({ ...controlFormData, effectiveness_rating: value })}>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="ineffective">Ineffective</SelectItem>
                                <SelectItem value="partially-effective">Partially Effective</SelectItem>
                                <SelectItem value="effective">Effective</SelectItem>
                                <SelectItem value="unknown">Unknown</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="testing_frequency">Testing Frequency</Label>
                            <Select value={controlFormData.testing_frequency} onValueChange={(value) => setControlFormData({ ...controlFormData, testing_frequency: value })}>
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
                        <Button variant="outline" onClick={() => setIsCreateControlDialogOpen(false)}>
                          Cancel
                        </Button>
                        <Button onClick={handleCreateControl}>
                          Add Control
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Control ID</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Family</TableHead>
                        <TableHead>Owner</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Effectiveness</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {controls.map((control) => (
                        <TableRow key={control.id}>
                          <TableCell className="font-mono text-sm">{control.control_id}</TableCell>
                          <TableCell>
                            <div>
                              <div className="font-medium">{control.control_name}</div>
                              <div className="text-sm text-muted-foreground truncate max-w-xs">
                                {control.description}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge className={getCategoryColor(control.control_category)}>
                              {control.control_category.charAt(0).toUpperCase() + control.control_category.slice(1)}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">
                              {control.control_type.charAt(0).toUpperCase() + control.control_type.slice(1)}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge variant="secondary">
                              {control.control_family.replace('_', ' ').split(' ').map(word =>
                                word.charAt(0).toUpperCase() + word.slice(1)
                              ).join(' ')}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div>
                              <div className="text-sm font-medium">{control.control_owner}</div>
                              <div className="text-xs text-muted-foreground">{control.control_owner_email}</div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge className={getStatusColor(control.implementation_status)}>
                              {control.implementation_status.replace('-', ' ').split(' ').map(word =>
                                word.charAt(0).toUpperCase() + word.slice(1)
                              ).join(' ')}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge className={getEffectivenessColor(control.effectiveness_rating)}>
                              {control.effectiveness_rating.replace('-', ' ').split(' ').map(word =>
                                word.charAt(0).toUpperCase() + word.slice(1)
                              ).join(' ')}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <ActionButtons isTableAction={true}
                                onView={() => {}}
                                onEdit={() => {}}
                                actionObj={control}
                                //onDelete={() => handleDeleteAsset(asset)}
                                //deleteDialogTitle={control.control_name}
                              />

                              {/* <Button variant="ghost" size="sm">
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm">
                                <Edit className="h-4 w-4" />
                              </Button> */}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Mappings Tab */}
            <TabsContent value="mappings" className="space-y-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Risk-Control Mappings</CardTitle>
                    <CardDescription>
                      Manage mappings between risks and controls
                    </CardDescription>
                  </div>
                  <Dialog open={isCreateMappingDialogOpen} onOpenChange={setIsCreateMappingDialogOpen}>
                    <DialogTrigger asChild>
                      <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                        <Plus className="mr-2 h-4 w-4" />
                        Add Mapping
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>Add Risk-Control Mapping</DialogTitle>
                        <DialogDescription>
                          Create a new mapping between a risk and control
                        </DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="risk_id">Risk ID</Label>
                            <Input
                              id="risk_id"
                              value={mappingFormData.risk_id}
                              onChange={(e) => setMappingFormData({ ...mappingFormData, risk_id: e.target.value })}
                              placeholder="RISK-001"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="control_id">Control ID</Label>
                            <Select value={mappingFormData.control_id} onValueChange={(value) => setMappingFormData({ ...mappingFormData, control_id: value })}>
                              <SelectTrigger>
                                <SelectValue placeholder="Select control" />
                              </SelectTrigger>
                              <SelectContent>
                                {controls.map(control => (
                                  <SelectItem key={control.control_id} value={control.control_id}>
                                    {control.control_id} - {control.control_name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="mapping_type">Mapping Type</Label>
                            <Select value={mappingFormData.mapping_type} onValueChange={(value) => setMappingFormData({ ...mappingFormData, mapping_type: value })}>
                              <SelectTrigger>
                                <SelectValue placeholder="Select type" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="mitigates">Mitigates</SelectItem>
                                <SelectItem value="monitors">Monitors</SelectItem>
                                <SelectItem value="prevents">Prevents</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="effectiveness_rating">Effectiveness Rating</Label>
                            <Select value={mappingFormData.effectiveness_rating} onValueChange={(value) => setMappingFormData({ ...mappingFormData, effectiveness_rating: value })}>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="low">Low</SelectItem>
                                <SelectItem value="medium">Medium</SelectItem>
                                <SelectItem value="high">High</SelectItem>
                                <SelectItem value="unknown">Unknown</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="coverage_percentage">Coverage Percentage</Label>
                            <Input
                              id="coverage_percentage"
                              type="number"
                              min="0"
                              max="100"
                              value={mappingFormData.coverage_percentage}
                              onChange={(e) => setMappingFormData({ ...mappingFormData, coverage_percentage: parseInt(e.target.value) })}
                              placeholder="85"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="residual_risk_level">Residual Risk Level</Label>
                            <Select value={mappingFormData.residual_risk_level} onValueChange={(value) => setMappingFormData({ ...mappingFormData, residual_risk_level: value })}>
                              <SelectTrigger>
                                <SelectValue placeholder="Select level" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="low">Low</SelectItem>
                                <SelectItem value="medium">Medium</SelectItem>
                                <SelectItem value="high">High</SelectItem>
                                <SelectItem value="critical">Critical</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="assessment_notes">Assessment Notes</Label>
                          <Textarea
                            id="assessment_notes"
                            value={mappingFormData.assessment_notes}
                            onChange={(e) => setMappingFormData({ ...mappingFormData, assessment_notes: e.target.value })}
                            placeholder="Assessment notes..."
                            rows={3}
                          />
                        </div>
                      </div>
                      <div className="flex justify-end space-x-2">
                        <Button variant="outline" onClick={() => setIsCreateMappingDialogOpen(false)}>
                          Cancel
                        </Button>
                        <Button onClick={handleCreateMapping}>
                          Add Mapping
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Risk ID</TableHead>
                        <TableHead>Control</TableHead>
                        <TableHead>Mapping Type</TableHead>
                        <TableHead>Effectiveness</TableHead>
                        <TableHead>Coverage</TableHead>
                        <TableHead>Residual Risk</TableHead>
                        <TableHead>Last Assessment</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {mappings.map((mapping) => (
                        <TableRow key={mapping.id}>
                          <TableCell className="font-mono text-sm">{mapping.risk_id}</TableCell>
                          <TableCell>
                            <div>
                              <div className="font-medium">{mapping.control_name}</div>
                              <div className="text-sm text-muted-foreground">{mapping.control_id}</div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge className={getMappingTypeColor(mapping.mapping_type)}>
                              {mapping.mapping_type.charAt(0).toUpperCase() + mapping.mapping_type.slice(1)}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge className={getEffectivenessColor(mapping.effectiveness_rating)}>
                              {mapping.effectiveness_rating.charAt(0).toUpperCase() + mapping.effectiveness_rating.slice(1)}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm font-medium">{mapping.coverage_percentage}%</div>
                          </TableCell>
                          <TableCell>
                            <Badge className={getEffectivenessColor(mapping.residual_risk_level)}>
                              {mapping.residual_risk_level.charAt(0).toUpperCase() + mapping.residual_risk_level.slice(1)}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm">
                              {mapping.last_assessment_date ? new Date(mapping.last_assessment_date).toLocaleDateString() : 'N/A'}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <ActionButtons isTableAction={true}
                                onView={() => {}}
                                onEdit={() => {}}
                                actionObj={control}
                                //onDelete={() => handleDeleteAsset(asset)}
                                //deleteDialogTitle={control.control_name}
                              />
                              
                              {/* <Button variant="ghost" size="sm">
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm">
                                <Edit className="h-4 w-4" />
                              </Button> */}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
