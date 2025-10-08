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
  Shield,
  Plus,
  Edit,
  Trash2,
  Eye,
  Target,
  BarChart3,
  PieChart,
  Activity,
  AlertTriangle,
  CheckCircle,
  Clock,
  Search,
  Filter,
  RefreshCw,
  Settings,
  Users,
  Calendar,
  ArrowUp,
  ArrowDown,
  Zap,
  Lock,
  Unlock,
  Loader2,
} from "lucide-react"

// Interface for governance control data from API
interface GovernanceControl {
  id: number
  name: string
  description: string
  control_id: string
  framework: string
  category: string
  subcategory?: string
  control_type: string
  implementation_status: string
  effectiveness_rating: string
  maturity_level: string
  owner: string
  department: string
  responsible_party?: string
  implementation_date?: string
  last_assessment_date?: string
  next_assessment_date?: string
  assessment_frequency: string
  cost_estimate?: number
  maintenance_cost?: number
  automation_level: string
  monitoring_frequency?: string
  reporting_frequency?: string
  compliance_requirements: string[]
  applicable_regulations: string[]
  control_measures: string[]
  created_at: string
  updated_at: string
  created_by?: string
  updated_by?: string
}

const categories = ["All", "Access Control", "Data Protection", "Incident Management", "Human Resources", "Security Operations"]
const types = ["All", "Administrative", "Technical", "Physical", "Preventive", "Detective", "Corrective"]
const frameworks = ["All", "ISO 27001", "NIST CSF", "COBIT", "PCI DSS"]
const statuses = ["All", "implemented", "partially_implemented", "not_implemented", "not_applicable"]
const effectivenessLevels = ["All", "high", "medium", "low", "not_assessed"]

export default function GovernanceControls() {
  const [controls, setControls] = useState<GovernanceControl[]>([])
  const [filteredControls, setFilteredControls] = useState<GovernanceControl[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [selectedType, setSelectedType] = useState("All")
  const [selectedFramework, setSelectedFramework] = useState("All")
  const [selectedStatus, setSelectedStatus] = useState("All")
  const [selectedEffectiveness, setSelectedEffectiveness] = useState("All")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editingControl, setEditingControl] = useState<GovernanceControl | null>(null)
  const { toast } = useToast()

  // Fetch controls from API
  const fetchControls = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      if (selectedFramework !== "All") params.append("framework", selectedFramework)
      if (selectedCategory !== "All") params.append("category", selectedCategory)
      if (selectedStatus !== "All") params.append("status", selectedStatus)
      if (selectedEffectiveness !== "All") params.append("effectiveness", selectedEffectiveness)

      const response = await fetch(`/api/governance/controls?${params.toString()}`)
      const result = await response.json()

      if (result.success) {
        setControls(result.data || [])
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to fetch controls",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error fetching controls:", error)
      toast({
        title: "Error",
        description: "Failed to fetch controls",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  // Fetch controls on component mount and when filters change
  useEffect(() => {
    fetchControls()
  }, [selectedFramework, selectedCategory, selectedStatus, selectedEffectiveness])

  // Filter controls based on search and local filters (type filter is handled locally since it's not in API)
  useEffect(() => {
    let filtered = controls.filter(control => {
      const matchesSearch = control.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           control.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           control.control_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           (control.control_measures && control.control_measures.some(measure => 
                             measure.toLowerCase().includes(searchTerm.toLowerCase())))
      const matchesType = selectedType === "All" || control.control_type === selectedType

      return matchesSearch && matchesType
    })
    setFilteredControls(filtered)
  }, [controls, searchTerm, selectedType])

  const handleCreateControl = async (controlData: any) => {
    try {
      const response = await fetch('/api/governance/controls', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
      ...controlData,
          created_by: 'Current User' // This should be replaced with actual user from session
        }),
      })

      const result = await response.json()

      if (result.success) {
        await fetchControls() // Refresh the controls list
    setIsCreateDialogOpen(false)
    toast({
      title: "Control Created",
      description: "New control has been successfully created.",
    })
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to create control",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error creating control:", error)
      toast({
        title: "Error",
        description: "Failed to create control",
        variant: "destructive",
      })
    }
  }

  const handleEditControl = async (controlData: any) => {
    if (!editingControl) return

    try {
      const response = await fetch(`/api/governance/controls/${editingControl.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
      ...controlData,
          updated_by: 'Current User' // This should be replaced with actual user from session
        }),
      })

      const result = await response.json()

      if (result.success) {
        await fetchControls() // Refresh the controls list
    setIsEditDialogOpen(false)
    setEditingControl(null)
    toast({
      title: "Control Updated",
      description: "Control has been successfully updated.",
    })
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to update control",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error updating control:", error)
      toast({
        title: "Error",
        description: "Failed to update control",
        variant: "destructive",
      })
    }
  }

  const handleDeleteControl = async (id: number) => {
    try {
      const response = await fetch(`/api/governance/controls/${id}`, {
        method: 'DELETE',
      })

      const result = await response.json()

      if (result.success) {
        await fetchControls() // Refresh the controls list
    toast({
      title: "Control Deleted",
      description: "Control has been successfully deleted.",
    })
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to delete control",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error deleting control:", error)
      toast({
        title: "Error",
        description: "Failed to delete control",
        variant: "destructive",
      })
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "implemented": return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      case "partially_implemented": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
      case "not_implemented": return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
      case "not_applicable": return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
    }
  }

  const getEffectivenessColor = (effectiveness: string) => {
    switch (effectiveness) {
      case "high": return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      case "medium": return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
      case "low": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
      case "not_assessed": return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
    }
  }

  const getMaturityLevelColor = (maturity: string) => {
    switch (maturity) {
      case "optimizing": return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      case "quantitatively_managed": return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
      case "defined": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
      case "managed": return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300"
      case "initial": return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "Administrative": return <Users className="h-4 w-4 text-blue-600" />
      case "Technical": return <Settings className="h-4 w-4 text-green-600" />
      case "Physical": return <Shield className="h-4 w-4 text-orange-600" />
      case "Preventive": return <Shield className="h-4 w-4 text-green-600" />
      case "Detective": return <Eye className="h-4 w-4 text-blue-600" />
      case "Corrective": return <Zap className="h-4 w-4 text-yellow-600" />
      default: return <Shield className="h-4 w-4 text-gray-600" />
    }
  }

  // Calculate control statistics
  const totalControls = controls.length
  const implementedControls = controls.filter(control => control.implementation_status === "implemented").length
  const partiallyImplementedControls = controls.filter(control => control.implementation_status === "partially_implemented").length
  const highEffectivenessControls = controls.filter(control => control.effectiveness_rating === "high").length

  return (
    <div>
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
                Controls Management
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                Manage and monitor governance controls and their effectiveness
              </p>
            </div>
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button className="default">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Control
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Create New Control</DialogTitle>
                  <DialogDescription>
                    Add a new governance control to the framework.
                  </DialogDescription>
                </DialogHeader>
                <ControlForm onSubmit={handleCreateControl} />
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Controls</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {totalControls}
                  </p>
                </div>
                <div className="p-3 bg-orange-100 dark:bg-orange-900 rounded-full">
                  <Shield className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Implemented</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {implementedControls}
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
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Partially Implemented</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {partiallyImplementedControls}
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
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">High Effectiveness</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {highEffectivenessControls}
                  </p>
                </div>
                <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-full">
                  <Target className="h-6 w-6 text-blue-600 dark:text-blue-400" />
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
                    placeholder="Search controls..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={fetchControls}
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
              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  {types.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={selectedFramework} onValueChange={setSelectedFramework}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Framework" />
                </SelectTrigger>
                <SelectContent>
                  {frameworks.map((framework) => (
                    <SelectItem key={framework} value={framework}>
                      {framework}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  {statuses.map((status) => (
                    <SelectItem key={status} value={status}>
                      {status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={selectedEffectiveness} onValueChange={setSelectedEffectiveness}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Effectiveness" />
                </SelectTrigger>
                <SelectContent>
                  {effectivenessLevels.map((level) => (
                    <SelectItem key={level} value={level}>
                      {level}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Controls Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Governance Controls ({filteredControls.length})
                      </CardTitle>
            <CardDescription>
              Manage and monitor governance controls and their effectiveness
                      </CardDescription>
              </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin" />
                <span className="ml-2">Loading controls...</span>
                  </div>
            ) : filteredControls.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No controls found. Try adjusting your filters or create a new control.
                  </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Control ID</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Framework</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Effectiveness</TableHead>
                      <TableHead>Owner</TableHead>
                      <TableHead>Department</TableHead>
                      <TableHead>Last Assessment</TableHead>
                      <TableHead>Next Assessment</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredControls.map((control) => (
                      <TableRow key={control.id}>
                        <TableCell className="font-mono text-sm">
                          {control.control_id}
                        </TableCell>
                        <TableCell>
                          <div className="max-w-xs">
                            <div className="font-semibold truncate" title={control.name}>
                              {control.name}
                  </div>
                            <div className="text-sm text-gray-500 truncate" title={control.description}>
                              {control.description}
                  </div>
                </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{control.framework}</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary">{control.category}</Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {getTypeIcon(control.control_type)}
                            <span className="text-sm">{control.control_type}</span>
                    </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(control.implementation_status)}>
                            {control.implementation_status.replace('_', ' ')}
                    </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge className={getEffectivenessColor(control.effectiveness_rating)}>
                            {control.effectiveness_rating}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm">{control.owner}</TableCell>
                        <TableCell className="text-sm">{control.department}</TableCell>
                        <TableCell className="text-sm">
                          {control.last_assessment_date ? 
                            new Date(control.last_assessment_date).toLocaleDateString() : 
                            'Not assessed'
                          }
                        </TableCell>
                        <TableCell className="text-sm">
                          {control.next_assessment_date ? 
                            new Date(control.next_assessment_date).toLocaleDateString() : 
                            'Not scheduled'
                          }
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Button variant="ghost" size="sm">
                              <Eye className="h-4 w-4" />
                  </Button>
                  <Button
                              variant="ghost"
                    size="sm"
                    onClick={() => {
                      setEditingControl(control)
                      setIsEditDialogOpen(true)
                    }}
                  >
                              <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                              variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteControl(control.id)}
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
              <DialogTitle>Edit Control</DialogTitle>
              <DialogDescription>
                Update the control details and configuration.
              </DialogDescription>
            </DialogHeader>
            <ControlForm 
              control={editingControl || undefined} 
              onSubmit={handleEditControl}
              onCancel={() => {
                setIsEditDialogOpen(false)
                setEditingControl(null)
              }}
            />
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}

// Control Form Component
function ControlForm({ control, onSubmit, onCancel }: { 
  control?: GovernanceControl
  onSubmit: (data: any) => void
  onCancel?: () => void
}) {
  const [formData, setFormData] = useState({
    name: control?.name || "",
    description: control?.description || "",
    control_id: control?.control_id || "",
    category: control?.category || "Access Control",
    subcategory: control?.subcategory || "",
    control_type: control?.control_type || "Administrative",
    framework: control?.framework || "ISO 27001",
    implementation_status: control?.implementation_status || "not_implemented",
    effectiveness_rating: control?.effectiveness_rating || "medium",
    maturity_level: control?.maturity_level || "initial",
    owner: control?.owner || "",
    department: control?.department || "",
    responsible_party: control?.responsible_party || "",
    implementation_date: control?.implementation_date || "",
    last_assessment_date: control?.last_assessment_date || "",
    next_assessment_date: control?.next_assessment_date || "",
    assessment_frequency: control?.assessment_frequency || "annual",
    cost_estimate: control?.cost_estimate || "",
    maintenance_cost: control?.maintenance_cost || "",
    automation_level: control?.automation_level || "manual",
    monitoring_frequency: control?.monitoring_frequency || "",
    reporting_frequency: control?.reporting_frequency || "",
    compliance_requirements: control?.compliance_requirements?.join(", ") || "",
    applicable_regulations: control?.applicable_regulations?.join(", ") || "",
    control_measures: control?.control_measures?.join(", ") || "",
    notes: (control as any)?.notes || ""
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const controlData = {
      ...formData,
      compliance_requirements: formData.compliance_requirements.split(",").map(f => f.trim()).filter(f => f),
      applicable_regulations: formData.applicable_regulations.split(",").map(r => r.trim()).filter(r => r),
      control_measures: formData.control_measures.split(",").map(m => m.trim()).filter(m => m),
      cost_estimate: formData.cost_estimate ? parseFloat(formData.cost_estimate.toString()) : null,
      maintenance_cost: formData.maintenance_cost ? parseFloat(formData.maintenance_cost.toString()) : null
    }
    onSubmit(controlData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="name">Control Name</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
        </div>
        <div>
          <Label htmlFor="control_id">Control ID</Label>
          <Input
            id="control_id"
            value={formData.control_id}
            onChange={(e) => setFormData({ ...formData, control_id: e.target.value })}
            placeholder="e.g., A.9.1.1, PR.DS-1"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="category">Category</Label>
          <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Access Control">Access Control</SelectItem>
              <SelectItem value="Data Protection">Data Protection</SelectItem>
              <SelectItem value="Data Security">Data Security</SelectItem>
              <SelectItem value="Incident Management">Incident Management</SelectItem>
              <SelectItem value="Human Resources">Human Resources</SelectItem>
              <SelectItem value="Security Operations">Security Operations</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="subcategory">Subcategory</Label>
          <Input
            id="subcategory"
            value={formData.subcategory}
            onChange={(e) => setFormData({ ...formData, subcategory: e.target.value })}
            placeholder="Optional subcategory"
          />
        </div>
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

      <div className="grid grid-cols-3 gap-4">
        <div>
          <Label htmlFor="control_type">Control Type</Label>
          <Select value={formData.control_type} onValueChange={(value) => setFormData({ ...formData, control_type: value })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Administrative">Administrative</SelectItem>
              <SelectItem value="Technical">Technical</SelectItem>
              <SelectItem value="Physical">Physical</SelectItem>
              <SelectItem value="Preventive">Preventive</SelectItem>
              <SelectItem value="Detective">Detective</SelectItem>
              <SelectItem value="Corrective">Corrective</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="framework">Primary Framework</Label>
          <Select value={formData.framework} onValueChange={(value) => setFormData({ ...formData, framework: value })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ISO 27001">ISO 27001</SelectItem>
              <SelectItem value="NIST CSF">NIST CSF</SelectItem>
              <SelectItem value="COBIT">COBIT</SelectItem>
              <SelectItem value="PCI DSS">PCI DSS</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="implementation_status">Status</Label>
          <Select value={formData.implementation_status} onValueChange={(value) => setFormData({ ...formData, implementation_status: value })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="not_implemented">Not Implemented</SelectItem>
              <SelectItem value="partially_implemented">Partially Implemented</SelectItem>
              <SelectItem value="implemented">Implemented</SelectItem>
              <SelectItem value="not_applicable">Not Applicable</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="effectiveness_rating">Effectiveness Rating</Label>
          <Select value={formData.effectiveness_rating} onValueChange={(value) => setFormData({ ...formData, effectiveness_rating: value })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="low">Low</SelectItem>
              <SelectItem value="not_assessed">Not Assessed</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="maturity_level">Maturity Level</Label>
          <Select value={formData.maturity_level} onValueChange={(value) => setFormData({ ...formData, maturity_level: value })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="initial">Initial</SelectItem>
              <SelectItem value="managed">Managed</SelectItem>
              <SelectItem value="defined">Defined</SelectItem>
              <SelectItem value="quantitatively_managed">Quantitatively Managed</SelectItem>
              <SelectItem value="optimizing">Optimizing</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <Label htmlFor="owner">Owner</Label>
          <Input
            id="owner"
            value={formData.owner}
            onChange={(e) => setFormData({ ...formData, owner: e.target.value })}
            required
          />
        </div>
        <div>
          <Label htmlFor="department">Department</Label>
          <Input
            id="department"
            value={formData.department}
            onChange={(e) => setFormData({ ...formData, department: e.target.value })}
            required
          />
        </div>
        <div>
          <Label htmlFor="responsible_party">Responsible Party</Label>
          <Input
            id="responsible_party"
            value={formData.responsible_party}
            onChange={(e) => setFormData({ ...formData, responsible_party: e.target.value })}
            placeholder="Optional"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="assessment_frequency">Assessment Frequency</Label>
          <Select value={formData.assessment_frequency} onValueChange={(value) => setFormData({ ...formData, assessment_frequency: value })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="daily">Daily</SelectItem>
              <SelectItem value="weekly">Weekly</SelectItem>
              <SelectItem value="monthly">Monthly</SelectItem>
              <SelectItem value="quarterly">Quarterly</SelectItem>
              <SelectItem value="semi-annual">Semi-Annual</SelectItem>
              <SelectItem value="annual">Annual</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="automation_level">Automation Level</Label>
          <Select value={formData.automation_level} onValueChange={(value) => setFormData({ ...formData, automation_level: value })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="manual">Manual</SelectItem>
              <SelectItem value="semi_automated">Semi-Automated</SelectItem>
              <SelectItem value="automated">Automated</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
      <div>
          <Label htmlFor="implementation_date">Implementation Date</Label>
          <Input
            id="implementation_date"
            type="date"
            value={formData.implementation_date}
            onChange={(e) => setFormData({ ...formData, implementation_date: e.target.value })}
          />
        </div>
        <div>
          <Label htmlFor="last_assessment_date">Last Assessment Date</Label>
          <Input
            id="last_assessment_date"
            type="date"
            value={formData.last_assessment_date}
            onChange={(e) => setFormData({ ...formData, last_assessment_date: e.target.value })}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
      <div>
          <Label htmlFor="next_assessment_date">Next Assessment Date</Label>
          <Input
            id="next_assessment_date"
            type="date"
            value={formData.next_assessment_date}
            onChange={(e) => setFormData({ ...formData, next_assessment_date: e.target.value })}
          />
        </div>
        <div>
          <Label htmlFor="cost_estimate">Cost Estimate</Label>
          <Input
            id="cost_estimate"
            type="number"
            step="0.01"
            value={formData.cost_estimate}
            onChange={(e) => setFormData({ ...formData, cost_estimate: e.target.value })}
            placeholder="0.00"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="maintenance_cost">Maintenance Cost</Label>
          <Input
            id="maintenance_cost"
            type="number"
            step="0.01"
            value={formData.maintenance_cost}
            onChange={(e) => setFormData({ ...formData, maintenance_cost: e.target.value })}
            placeholder="0.00"
          />
        </div>
        <div>
          <Label htmlFor="monitoring_frequency">Monitoring Frequency</Label>
          <Input
            id="monitoring_frequency"
            value={formData.monitoring_frequency}
            onChange={(e) => setFormData({ ...formData, monitoring_frequency: e.target.value })}
            placeholder="e.g., continuous, daily, weekly"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
      <div>
          <Label htmlFor="compliance_requirements">Compliance Requirements (comma-separated)</Label>
        <Input
            id="compliance_requirements"
            value={formData.compliance_requirements}
            onChange={(e) => setFormData({ ...formData, compliance_requirements: e.target.value })}
            placeholder="e.g., ISO 27001, SOX, GDPR"
          />
        </div>
        <div>
          <Label htmlFor="applicable_regulations">Applicable Regulations (comma-separated)</Label>
          <Input
            id="applicable_regulations"
            value={formData.applicable_regulations}
            onChange={(e) => setFormData({ ...formData, applicable_regulations: e.target.value })}
            placeholder="e.g., GDPR, HIPAA, PCI DSS"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="control_measures">Control Measures (comma-separated)</Label>
        <Input
          id="control_measures"
          value={formData.control_measures}
          onChange={(e) => setFormData({ ...formData, control_measures: e.target.value })}
          placeholder="e.g., User provisioning, Access reviews, Encryption"
        />
      </div>

      <div>
        <Label htmlFor="notes">Notes</Label>
        <Textarea
          id="notes"
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          rows={3}
          placeholder="Additional notes or comments"
        />
      </div>

      <DialogFooter>
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button type="submit" className="bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700">
          {control ? "Update Control" : "Create Control"}
        </Button>
      </DialogFooter>
    </form>
  )
}
