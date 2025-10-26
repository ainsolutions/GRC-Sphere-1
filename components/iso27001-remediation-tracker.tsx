"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import {
  Plus,
  Eye,
  Edit,
  Trash2,
  CalendarIcon,
  CheckCircle,
  AlertTriangle,
  Clock,
  RefreshCw,
  TrendingUp,
  Search,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import OwnerSelectInput from "@/components/owner-search-input"
import { ActionButtons } from "./ui/action-buttons"

interface ISO27001RemediationItem {
  id: number
  remediation_id: string
  assessment_id: number
  assessment_name: string
  control_id: string
  control_name: string
  domain: string
  gap_severity: string
  priority: string
  remediation_plan: string
  assigned_to: string
  status: string
  progress_percentage: number
  start_date: string
  due_date: string
  completion_date: string | null
  estimated_cost: number
  actual_cost: number
  business_impact: string
  notes: string
  created_at: string
  updated_at: string
}

interface ISO27001RemediationTrackerProps {
  assessmentId?: number
}

export function ISO27001RemediationTracker({ assessmentId }: ISO27001RemediationTrackerProps) {
  const [remediationItems, setRemediationItems] = useState<ISO27001RemediationItem[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedStatus, setSelectedStatus] = useState<string>("all")
  const [selectedPriority, setSelectedPriority] = useState<string>("all")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState<ISO27001RemediationItem | null>(null)
  const [formData, setFormData] = useState({
    assessment_id: assessmentId || 0,
    control_id: "",
    control_name: "",
    domain: "",
    gap_severity: "",
    priority: "",
    remediation_plan: "",
    assigned_to: "",
    start_date: new Date(),
    due_date: new Date(),
    estimated_cost: 0,
    business_impact: "",
  })
  const { toast } = useToast()

  useEffect(() => {
    fetchRemediationItems()
  }, [assessmentId])

  const fetchRemediationItems = async () => {
    setLoading(true)
    try {
      // Mock data for ISO 27001 remediation tracking
      const mockRemediationItems: ISO27001RemediationItem[] = [
        {
          id: 1,
          remediation_id: "REM-001",
          assessment_id: 1,
          assessment_name: "Initial ISO 27001 Certification Assessment",
          control_id: "A.7.1",
          control_name: "Screening",
          domain: "Human Resource Security",
          gap_severity: "Medium",
          priority: "High",
          remediation_plan: "Implement comprehensive background verification process for all new hires",
          assigned_to: "HR Manager",
          status: "In Progress",
          progress_percentage: 65,
          start_date: "2024-02-01",
          due_date: "2024-04-30",
          completion_date: null,
          estimated_cost: 15000,
          actual_cost: 9500,
          business_impact: "Reduced risk of insider threats and compliance violations",
          notes: "Background check vendor selected. Process documentation in progress.",
          created_at: "2024-01-25T10:00:00Z",
          updated_at: "2024-03-15T14:30:00Z",
        },
        {
          id: 2,
          remediation_id: "REM-002",
          assessment_id: 1,
          assessment_name: "Initial ISO 27001 Certification Assessment",
          control_id: "A.10.1",
          control_name: "Cryptographic controls",
          domain: "Cryptography",
          gap_severity: "High",
          priority: "Critical",
          remediation_plan: "Complete implementation of encryption for all data at rest and in transit",
          assigned_to: "IT Security Team",
          status: "In Progress",
          progress_percentage: 40,
          start_date: "2024-01-15",
          due_date: "2024-06-30",
          completion_date: null,
          estimated_cost: 50000,
          actual_cost: 22000,
          business_impact: "Enhanced data protection and regulatory compliance",
          notes: "Encryption solution procured. Implementation phase started.",
          created_at: "2024-01-20T09:00:00Z",
          updated_at: "2024-03-10T16:45:00Z",
        },
        {
          id: 3,
          remediation_id: "REM-003",
          assessment_id: 2,
          assessment_name: "First Surveillance Audit",
          control_id: "A.12.1",
          control_name: "Operational procedures and responsibilities",
          domain: "Operations Security",
          gap_severity: "Medium",
          priority: "Medium",
          remediation_plan: "Document all operational procedures and ensure staff training",
          assigned_to: "Operations Manager",
          status: "Completed",
          progress_percentage: 100,
          start_date: "2024-08-01",
          due_date: "2024-10-31",
          completion_date: "2024-10-25",
          estimated_cost: 8000,
          actual_cost: 7200,
          business_impact: "Improved operational efficiency and reduced errors",
          notes: "All procedures documented and training completed ahead of schedule.",
          created_at: "2024-07-25T11:00:00Z",
          updated_at: "2024-10-25T17:00:00Z",
        },
        {
          id: 4,
          remediation_id: "REM-004",
          assessment_id: 2,
          assessment_name: "First Surveillance Audit",
          control_id: "A.16.1",
          control_name: "Management of information security incidents",
          domain: "Incident Management",
          gap_severity: "High",
          priority: "High",
          remediation_plan: "Establish formal incident response procedures and team",
          assigned_to: "Security Manager",
          status: "Not Started",
          progress_percentage: 0,
          start_date: "2024-12-01",
          due_date: "2025-03-31",
          completion_date: null,
          estimated_cost: 25000,
          actual_cost: 0,
          business_impact: "Faster incident response and reduced business impact",
          notes: "Waiting for budget approval to start implementation.",
          created_at: "2024-07-20T13:00:00Z",
          updated_at: "2024-11-15T10:00:00Z",
        },
        {
          id: 5,
          remediation_id: "REM-005",
          assessment_id: 3,
          assessment_name: "Internal Audit Q4 2024",
          control_id: "A.17.1",
          control_name: "Planning information security continuity",
          domain: "Business Continuity",
          gap_severity: "Critical",
          priority: "Critical",
          remediation_plan: "Develop comprehensive business continuity and disaster recovery plans",
          assigned_to: "Business Continuity Manager",
          status: "Planning",
          progress_percentage: 15,
          start_date: "2024-11-01",
          due_date: "2025-06-30",
          completion_date: null,
          estimated_cost: 75000,
          actual_cost: 5000,
          business_impact: "Ensured business resilience and regulatory compliance",
          notes: "Initial risk assessment completed. Plan development in progress.",
          created_at: "2024-10-25T15:00:00Z",
          updated_at: "2024-12-01T12:00:00Z",
        },
      ]

      // Filter by assessment if provided
      const filteredItems = assessmentId
        ? mockRemediationItems.filter((item) => item.assessment_id === assessmentId)
        : mockRemediationItems

      setRemediationItems(filteredItems)
    } catch (error) {
      console.error("Failed to fetch ISO 27001 remediation items:", error)
      toast({
        title: "Error",
        description: "Failed to load remediation items",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleCreateRemediationItem = async () => {
    try {
      const newItem: ISO27001RemediationItem = {
        id: remediationItems.length + 1,
        remediation_id: `REM-${String(remediationItems.length + 1).padStart(3, "0")}`,
        assessment_id: formData.assessment_id,
        assessment_name: "Current Assessment",
        control_id: formData.control_id,
        control_name: formData.control_name,
        domain: formData.domain,
        gap_severity: formData.gap_severity,
        priority: formData.priority,
        remediation_plan: formData.remediation_plan,
        assigned_to: formData.assigned_to,
        status: "Not Started",
        progress_percentage: 0,
        start_date: formData.start_date.toISOString().split("T")[0],
        due_date: formData.due_date.toISOString().split("T")[0],
        completion_date: null,
        estimated_cost: formData.estimated_cost,
        actual_cost: 0,
        business_impact: formData.business_impact,
        notes: "",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }

      setRemediationItems([...remediationItems, newItem])
      setIsCreateDialogOpen(false)
      setFormData({
        assessment_id: assessmentId || 0,
        control_id: "",
        control_name: "",
        domain: "",
        gap_severity: "",
        priority: "",
        remediation_plan: "",
        assigned_to: "",
        start_date: new Date(),
        due_date: new Date(),
        estimated_cost: 0,
        business_impact: "",
      })

      toast({
        title: "Success",
        description: "Remediation item created successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create remediation item",
        variant: "destructive",
      })
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed":
        return "bg-gradient-to-r from-green-500 to-teal-500 text-white"
      case "In Progress":
        return "bg-gradient-to-r from-blue-500 to-cyan-500 text-white"
      case "Planning":
        return "bg-gradient-to-r from-purple-500 to-purple-700 text-white"
      case "Not Started":
        return "bg-gradient-to-r from-gray-500 to-gray-600 text-white"
      case "On Hold":
        return "bg-gradient-to-r from-yellow-500 to-orange-500 text-white"
      case "Cancelled":
        return "bg-gradient-to-r from-red-500 to-red-700 text-white"
      default:
        return "bg-gradient-to-r from-gray-400 to-gray-500 text-white"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "Critical":
        return "bg-gradient-to-r from-red-600 to-red-800 text-white"
      case "High":
        return "bg-gradient-to-r from-orange-500 to-red-500 text-white"
      case "Medium":
        return "bg-gradient-to-r from-blue-500 to-cyan-500 text-white"
      case "Low":
        return "bg-gradient-to-r from-gray-500 to-gray-600 text-white"
      default:
        return "bg-gradient-to-r from-gray-400 to-gray-500 text-white"
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "Critical":
        return "bg-gradient-to-r from-red-600 to-red-800 text-white"
      case "High":
        return "bg-gradient-to-r from-orange-500 to-red-500 text-white"
      case "Medium":
        return "bg-gradient-to-r from-yellow-500 to-orange-500 text-white"
      case "Low":
        return "bg-gradient-to-r from-green-500 to-teal-500 text-white"
      default:
        return "bg-gradient-to-r from-gray-400 to-gray-500 text-white"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Completed":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "In Progress":
        return <TrendingUp className="h-4 w-4 text-blue-600" />
      case "Planning":
        return <Clock className="h-4 w-4 text-purple-600" />
      case "Not Started":
        return <Clock className="h-4 w-4 text-gray-600" />
      case "On Hold":
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />
      case "Cancelled":
        return <AlertTriangle className="h-4 w-4 text-red-600" />
      default:
        return <Clock className="h-4 w-4 text-gray-600" />
    }
  }

  const statuses = ["Not Started", "Planning", "In Progress", "On Hold", "Completed", "Cancelled"]
  const priorities = ["Critical", "High", "Medium", "Low"]

  const filteredItems = remediationItems.filter((item) => {
    const matchesSearch =
      item.control_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.control_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.remediation_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.assigned_to.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = selectedStatus === "all" || item.status === selectedStatus
    const matchesPriority = selectedPriority === "all" || item.priority === selectedPriority

    return matchesSearch && matchesStatus && matchesPriority
  })

  const getRemediationStats = () => {
    const total = remediationItems.length
    const completed = remediationItems.filter((item) => item.status === "Completed").length
    const inProgress = remediationItems.filter((item) => item.status === "In Progress").length
    const notStarted = remediationItems.filter((item) => item.status === "Not Started").length
    const overdue = remediationItems.filter(
      (item) => item.status !== "Completed" && new Date(item.due_date) < new Date(),
    ).length
    const totalEstimatedCost = remediationItems.reduce((sum, item) => sum + item.estimated_cost, 0)
    const totalActualCost = remediationItems.reduce((sum, item) => sum + item.actual_cost, 0)
    const avgProgress =
      total > 0 ? Math.round(remediationItems.reduce((sum, item) => sum + item.progress_percentage, 0) / total) : 0

    return { total, completed, inProgress, notStarted, overdue, totalEstimatedCost, totalActualCost, avgProgress }
  }

  const stats = getRemediationStats()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 bg-clip-text text-transparent">
            ISO 27001 Remediation Tracker
          </h2>
          <p className="text-muted-foreground">
            Track progress of remediation activities for ISO 27001 compliance gaps
          </p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <ActionButtons isTableAction={false} onAdd={() => { }} btnAddText="Add Remediation Item" />
            {/* <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Remediation Item
            </Button> */}
          </DialogTrigger>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>Create Remediation Item</DialogTitle>
              <DialogDescription>Add a new remediation item to track compliance gap resolution</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="control_id">Control ID</Label>
                  <Input
                    id="control_id"
                    value={formData.control_id}
                    onChange={(e) => setFormData({ ...formData, control_id: e.target.value })}
                    placeholder="e.g., A.5.1"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="control_name">Control Name</Label>
                  <Input
                    id="control_name"
                    value={formData.control_name}
                    onChange={(e) => setFormData({ ...formData, control_name: e.target.value })}
                    placeholder="Enter control name"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="domain">Domain</Label>
                  <Select
                    value={formData.domain}
                    onValueChange={(value) => setFormData({ ...formData, domain: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select domain" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Information Security Policies">Information Security Policies</SelectItem>
                      <SelectItem value="Organization of Information Security">
                        Organization of Information Security
                      </SelectItem>
                      <SelectItem value="Human Resource Security">Human Resource Security</SelectItem>
                      <SelectItem value="Asset Management">Asset Management</SelectItem>
                      <SelectItem value="Access Control">Access Control</SelectItem>
                      <SelectItem value="Cryptography">Cryptography</SelectItem>
                      <SelectItem value="Physical and Environmental Security">
                        Physical and Environmental Security
                      </SelectItem>
                      <SelectItem value="Operations Security">Operations Security</SelectItem>
                      <SelectItem value="Communications Security">Communications Security</SelectItem>
                      <SelectItem value="Incident Management">Incident Management</SelectItem>
                      <SelectItem value="Business Continuity">Business Continuity</SelectItem>
                      <SelectItem value="Supplier Relationships">Supplier Relationships</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="assigned_to">Assigned To</Label>
                  <OwnerSelectInput formData={formData} setFormData={setFormData} fieldName="assigned_to" />
                  {/* <Input
                    id="assigned_to"
                    value={formData.assigned_to}
                    onChange={(e) => setFormData({ ...formData, assigned_to: e.target.value })}
                    placeholder="Enter assignee name"
                  /> */}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="gap_severity">Gap Severity</Label>
                  <Select
                    value={formData.gap_severity}
                    onValueChange={(value) => setFormData({ ...formData, gap_severity: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select severity" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Critical">Critical</SelectItem>
                      <SelectItem value="High">High</SelectItem>
                      <SelectItem value="Medium">Medium</SelectItem>
                      <SelectItem value="Low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="priority">Priority</Label>
                  <Select
                    value={formData.priority}
                    onValueChange={(value) => setFormData({ ...formData, priority: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Critical">Critical</SelectItem>
                      <SelectItem value="High">High</SelectItem>
                      <SelectItem value="Medium">Medium</SelectItem>
                      <SelectItem value="Low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Start Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start text-left font-normal bg-transparent">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {format(formData.start_date, "PPP")}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={formData.start_date}
                        onSelect={(date) => date && setFormData({ ...formData, start_date: date })}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="space-y-2">
                  <Label>Due Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start text-left font-normal bg-transparent">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {format(formData.due_date, "PPP")}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={formData.due_date}
                        onSelect={(date) => date && setFormData({ ...formData, due_date: date })}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="estimated_cost">Estimated Cost ($)</Label>
                <Input
                  id="estimated_cost"
                  type="number"
                  value={formData.estimated_cost}
                  onChange={(e) => setFormData({ ...formData, estimated_cost: Number.parseInt(e.target.value) || 0 })}
                  placeholder="Enter estimated cost"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="remediation_plan">Remediation Plan</Label>
                <Textarea
                  id="remediation_plan"
                  value={formData.remediation_plan}
                  onChange={(e) => setFormData({ ...formData, remediation_plan: e.target.value })}
                  placeholder="Describe the remediation plan..."
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="business_impact">Business Impact</Label>
                <Textarea
                  id="business_impact"
                  value={formData.business_impact}
                  onChange={(e) => setFormData({ ...formData, business_impact: e.target.value })}
                  placeholder="Describe the business impact..."
                  rows={2}
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateRemediationItem}>Create Item</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-8 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Total Items
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-700">{stats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent">
              Completed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-700">{stats.completed}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">
              In Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-cyan-700">{stats.inProgress}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium bg-gradient-to-r from-gray-600 to-gray-700 bg-clip-text text-transparent">
              Not Started
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-700">{stats.notStarted}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium bg-gradient-to-r from-red-600 to-red-800 bg-clip-text text-transparent">
              Overdue
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-700">{stats.overdue}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Avg Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-700">{stats.avgProgress}%</div>
            <Progress value={stats.avgProgress} className="mt-2" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
              Est. Cost
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-700">${(stats.totalEstimatedCost / 1000).toFixed(0)}K</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
              Actual Cost
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-700">${(stats.totalActualCost / 1000).toFixed(0)}K</div>
          </CardContent>
        </Card>
      </div>

      {/* Remediation Items Table */}
      <Card className="gradient-card-primary">
        <CardHeader>
          <CardTitle className="text-sm font-medium">
            Remediation Items
          </CardTitle>
          <CardDescription>Track progress and manage remediation activities</CardDescription>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="flex flex-wrap items-center gap-4 mb-6">
            <div className="flex items-center space-x-2">
              <Search className="h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search items..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-64 border-blue-200 focus:border-purple-400"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Label htmlFor="status-filter">Status:</Label>
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  {statuses.map((status) => (
                    <SelectItem key={status} value={status}>
                      {status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center space-x-2">
              <Label htmlFor="priority-filter">Priority:</Label>
              <Select value={selectedPriority} onValueChange={setSelectedPriority}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  {priorities.map((priority) => (
                    <SelectItem key={priority} value={priority}>
                      {priority}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-8">
              <RefreshCw className="h-6 w-6 animate-spin text-blue-600" />
              <span className="ml-2">Loading remediation items...</span>
            </div>
          ) : (
            <div className="rounded-lg overflow-hidden border border-blue-200/50">
              <Table>
                <TableHeader>
                  <TableRow className="text-md-white">
                    <TableHead>Item</TableHead>
                    <TableHead>Control</TableHead>
                    <TableHead>Domain</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Progress</TableHead>
                    <TableHead>Assigned To</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead>Cost</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredItems.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={10} className="text-center py-8 text-muted-foreground">
                        No remediation items found matching the current filters.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredItems.map((item) => (
                      <TableRow
                        key={item.id}
                        className="hover:bg-gradient-to-r hover:from-blue-50/30 hover:via-purple-50/30 hover:to-cyan-50/30"
                      >
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            {getStatusIcon(item.status)}
                            <div>
                              <div className="font-medium">{item.remediation_id}</div>
                              <div className="text-sm text-muted-foreground">{item.assessment_name}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">{item.control_id}</div>
                            <div className="text-sm text-muted-foreground">{item.control_name}</div>
                          </div>
                        </TableCell>
                        <TableCell className="text-sm">{item.domain}</TableCell>
                        <TableCell>
                          <Badge className={getPriorityColor(item.priority)}>{item.priority}</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(item.status)}>{item.status}</Badge>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="flex items-center justify-between text-sm">
                              <span>{item.progress_percentage}%</span>
                            </div>
                            <Progress value={item.progress_percentage} className="w-20" />
                          </div>
                        </TableCell>
                        <TableCell className="text-sm">{item.assigned_to}</TableCell>
                        <TableCell>
                          <div className="text-sm">
                            {new Date(item.due_date).toLocaleDateString()}
                            {new Date(item.due_date) < new Date() && item.status !== "Completed" && (
                              <div className="text-xs text-red-600">Overdue</div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <div>Est: ${item.estimated_cost.toLocaleString()}</div>
                            <div className="text-muted-foreground">Act: ${item.actual_cost.toLocaleString()}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <ActionButtons isTableAction={true}
                              onView={() => {
                                setSelectedItem(item)
                                setIsViewDialogOpen(true)
                              }}
                              onEdit={() => { }}
                              onDelete={() => { }}
                                actionObj={item}
                            //deleteDialogTitle={}                                
                            />
                            {/* <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setSelectedItem(item)
                                setIsViewDialogOpen(true)
                              }}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                              <Button variant="outline" size="sm">
                              <Trash2 className="h-4 w-4" />
                            </Button> */}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* View Item Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Remediation Item Details</DialogTitle>
            <DialogDescription>
              {selectedItem?.remediation_id} - {selectedItem?.control_name}
            </DialogDescription>
          </DialogHeader>
          {selectedItem && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold mb-2">Item Information</h3>
                    <div className="space-y-2 text-sm">
                      <div>
                        <strong>Control:</strong> {selectedItem.control_id} - {selectedItem.control_name}
                      </div>
                      <div>
                        <strong>Domain:</strong> {selectedItem.domain}
                      </div>
                      <div>
                        <strong>Assessment:</strong> {selectedItem.assessment_name}
                      </div>
                      <div>
                        <strong>Gap Severity:</strong>{" "}
                        <Badge className={getSeverityColor(selectedItem.gap_severity)}>
                          {selectedItem.gap_severity}
                        </Badge>
                      </div>
                      <div>
                        <strong>Priority:</strong>{" "}
                        <Badge className={getPriorityColor(selectedItem.priority)}>{selectedItem.priority}</Badge>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Timeline</h3>
                    <div className="space-y-2 text-sm">
                      <div>
                        <strong>Start Date:</strong> {new Date(selectedItem.start_date).toLocaleDateString()}
                      </div>
                      <div>
                        <strong>Due Date:</strong> {new Date(selectedItem.due_date).toLocaleDateString()}
                      </div>
                      {selectedItem.completion_date && (
                        <div>
                          <strong>Completion Date:</strong>{" "}
                          {new Date(selectedItem.completion_date).toLocaleDateString()}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold mb-2">Progress & Status</h3>
                    <div className="space-y-2 text-sm">
                      <div>
                        <strong>Status:</strong>{" "}
                        <Badge className={getStatusColor(selectedItem.status)}>{selectedItem.status}</Badge>
                      </div>
                      <div>
                        <strong>Progress:</strong> {selectedItem.progress_percentage}%
                      </div>
                      <Progress value={selectedItem.progress_percentage} className="mt-2" />
                      <div>
                        <strong>Assigned To:</strong> {selectedItem.assigned_to}
                      </div>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Cost Information</h3>
                    <div className="space-y-2 text-sm">
                      <div>
                        <strong>Estimated Cost:</strong> ${selectedItem.estimated_cost.toLocaleString()}
                      </div>
                      <div>
                        <strong>Actual Cost:</strong> ${selectedItem.actual_cost.toLocaleString()}
                      </div>
                      <div>
                        <strong>Variance:</strong> $
                        {(selectedItem.actual_cost - selectedItem.estimated_cost).toLocaleString()}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">Remediation Plan</h3>
                  <p className="text-sm text-muted-foreground">{selectedItem.remediation_plan}</p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Business Impact</h3>
                  <p className="text-sm text-muted-foreground">{selectedItem.business_impact}</p>
                </div>
                {selectedItem.notes && (
                  <div>
                    <h3 className="font-semibold mb-2">Notes</h3>
                    <p className="text-sm text-muted-foreground">{selectedItem.notes}</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
