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
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, Plus, Search, Filter, Eye, Edit, Trash2, AlertTriangle, CheckCircle, Clock, Users, DollarSign, Target } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"

interface AnnualPlan {
  id: number
  plan_year: number
  plan_name: string
  plan_status: string
  plan_description: string
  total_budget: number
  allocated_budget: number
  total_hours: number
  allocated_hours: number
  risk_focus_areas: string[]
  regulatory_priorities: string[]
  strategic_objectives: string[]
  approval_status: string
  approved_by: string
  approval_date: string
  created_at: string
  updated_at: string
}

interface AuditEngagement {
  id: number
  engagement_id: string
  annual_plan_id: number
  entity_id: string
  engagement_name: string
  engagement_type: string
  audit_scope: string
  audit_objectives: string[]
  risk_assessment: string
  planned_start_date: string
  planned_end_date: string
  actual_start_date: string
  actual_end_date: string
  planned_hours: number
  actual_hours: number
  planned_budget: number
  actual_budget: number
  engagement_status: string
  priority: string
  complexity: string
  team_lead: string
  team_lead_email: string
  audit_team: string[]
  stakeholders: string[]
  deliverables: string[]
  methodology: string
  tools_used: string[]
  entity_name: string
  plan_name: string
  created_at: string
  updated_at: string
}

const mockAnnualPlans: AnnualPlan[] = [
  {
    id: 1,
    plan_year: 2024,
    plan_name: "2024 Annual Audit Plan",
    plan_status: "approved",
    plan_description: "Comprehensive audit plan for 2024 covering all critical business areas",
    total_budget: 500000,
    allocated_budget: 450000,
    total_hours: 2000,
    allocated_hours: 1800,
    risk_focus_areas: ["Cybersecurity", "Financial Controls", "Compliance"],
    regulatory_priorities: ["SOX", "GDPR", "ISO27001"],
    strategic_objectives: ["Risk Mitigation", "Process Improvement", "Compliance Assurance"],
    approval_status: "approved",
    approved_by: "John Smith",
    approval_date: "2023-12-15",
    created_at: "2023-12-01T00:00:00Z",
    updated_at: "2023-12-15T00:00:00Z"
  }
]

const mockEngagements: AuditEngagement[] = [
  {
    id: 1,
    engagement_id: "AE-2024-001",
    annual_plan_id: 1,
    entity_id: "AU-001",
    engagement_name: "Customer Database System Audit",
    engagement_type: "it",
    audit_scope: "Comprehensive audit of customer database system including data security, access controls, and backup procedures",
    audit_objectives: ["Assess data security", "Review access controls", "Evaluate backup procedures"],
    risk_assessment: "High risk due to sensitive customer data and regulatory requirements",
    planned_start_date: "2024-01-15",
    planned_end_date: "2024-03-15",
    actual_start_date: "2024-01-15",
    actual_end_date: "",
    planned_hours: 200,
    actual_hours: 0,
    planned_budget: 50000,
    actual_budget: 0,
    engagement_status: "planned",
    priority: "high",
    complexity: "high",
    team_lead: "Sarah Johnson",
    team_lead_email: "sarah.johnson@company.com",
    audit_team: ["Mike Wilson", "Lisa Brown"],
    stakeholders: ["IT Department", "Legal Department"],
    deliverables: ["Audit Report", "Management Letter", "Action Plan"],
    methodology: "Risk-based audit approach",
    tools_used: ["ACL", "Excel", "SQL"],
    entity_name: "Customer Database System",
    plan_name: "2024 Annual Audit Plan",
    created_at: "2023-12-01T00:00:00Z",
    updated_at: "2023-12-01T00:00:00Z"
  },
  {
    id: 2,
    engagement_id: "AE-2024-002",
    annual_plan_id: 1,
    entity_id: "AU-002",
    engagement_name: "Financial Reporting Process Audit",
    engagement_type: "financial",
    audit_scope: "Audit of monthly financial reporting process and controls",
    audit_objectives: ["Assess reporting accuracy", "Review control effectiveness", "Evaluate compliance"],
    risk_assessment: "Critical risk due to regulatory requirements and financial impact",
    planned_start_date: "2024-02-01",
    planned_end_date: "2024-04-01",
    actual_start_date: "",
    actual_end_date: "",
    planned_hours: 150,
    actual_hours: 0,
    planned_budget: 40000,
    actual_budget: 0,
    engagement_status: "planned",
    priority: "critical",
    complexity: "medium",
    team_lead: "David Lee",
    team_lead_email: "david.lee@company.com",
    audit_team: ["Anna Garcia", "Tom Wilson"],
    stakeholders: ["Finance Department", "External Auditors"],
    deliverables: ["Audit Report", "Management Letter", "Compliance Assessment"],
    methodology: "Compliance-focused audit approach",
    tools_used: ["Excel", "Audit Software"],
    entity_name: "Financial Reporting Process",
    plan_name: "2024 Annual Audit Plan",
    created_at: "2023-12-01T00:00:00Z",
    updated_at: "2023-12-01T00:00:00Z"
  }
]

export default function AuditPlanningPage() {
  const [annualPlans, setAnnualPlans] = useState<AnnualPlan[]>(mockAnnualPlans)
  const [engagements, setEngagements] = useState<AuditEngagement[]>(mockEngagements)
  const [activeTab, setActiveTab] = useState("annual-plans")
  const [isCreatePlanDialogOpen, setIsCreatePlanDialogOpen] = useState(false)
  const [isCreateEngagementDialogOpen, setIsCreateEngagementDialogOpen] = useState(false)

  // Form states
  const [planFormData, setPlanFormData] = useState({
    plan_year: new Date().getFullYear(),
    plan_name: "",
    plan_description: "",
    total_budget: 0,
    total_hours: 0,
    risk_focus_areas: [] as string[],
    regulatory_priorities: [] as string[],
    strategic_objectives: [] as string[]
  })

  const [engagementFormData, setEngagementFormData] = useState({
    engagement_id: "",
    annual_plan_id: 1,
    entity_id: "",
    engagement_name: "",
    engagement_type: "",
    audit_scope: "",
    audit_objectives: [] as string[],
    risk_assessment: "",
    planned_start_date: "",
    planned_end_date: "",
    planned_hours: 0,
    planned_budget: 0,
    priority: "medium",
    complexity: "medium",
    team_lead: "",
    team_lead_email: "",
    audit_team: [] as string[],
    stakeholders: [] as string[],
    deliverables: [] as string[],
    methodology: "",
    tools_used: [] as string[]
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "draft": return "bg-gray-100 text-gray-800"
      case "approved": return "bg-green-100 text-green-800"
      case "in-progress": return "bg-blue-100 text-blue-800"
      case "completed": return "bg-purple-100 text-purple-800"
      case "cancelled": return "bg-red-100 text-red-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "low": return "bg-green-100 text-green-800"
      case "medium": return "bg-yellow-100 text-yellow-800"
      case "high": return "bg-orange-100 text-orange-800"
      case "critical": return "bg-red-100 text-red-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  const getEngagementStatusColor = (status: string) => {
    switch (status) {
      case "planned": return "bg-blue-100 text-blue-800"
      case "in-progress": return "bg-yellow-100 text-yellow-800"
      case "fieldwork": return "bg-orange-100 text-orange-800"
      case "reporting": return "bg-purple-100 text-purple-800"
      case "completed": return "bg-green-100 text-green-800"
      case "cancelled": return "bg-red-100 text-red-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  const handleCreatePlan = () => {
    const newPlan: AnnualPlan = {
      id: annualPlans.length + 1,
      ...planFormData,
      allocated_budget: 0,
      allocated_hours: 0,
      plan_status: "draft",
      approval_status: "pending",
      approved_by: "",
      approval_date: "",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
    setAnnualPlans([...annualPlans, newPlan])
    setIsCreatePlanDialogOpen(false)
    resetPlanForm()
  }

  const handleCreateEngagement = () => {
    const newEngagement: AuditEngagement = {
      id: engagements.length + 1,
      ...engagementFormData,
      actual_start_date: "",
      actual_end_date: "",
      actual_hours: 0,
      actual_budget: 0,
      engagement_status: "planned",
      entity_name: "Selected Entity",
      plan_name: annualPlans.find(p => p.id === engagementFormData.annual_plan_id)?.plan_name || "",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
    setEngagements([...engagements, newEngagement])
    setIsCreateEngagementDialogOpen(false)
    resetEngagementForm()
  }

  const resetPlanForm = () => {
    setPlanFormData({
      plan_year: new Date().getFullYear(),
      plan_name: "",
      plan_description: "",
      total_budget: 0,
      total_hours: 0,
      risk_focus_areas: [],
      regulatory_priorities: [],
      strategic_objectives: []
    })
  }

  const resetEngagementForm = () => {
    setEngagementFormData({
      engagement_id: "",
      annual_plan_id: 1,
      entity_id: "",
      engagement_name: "",
      engagement_type: "",
      audit_scope: "",
      audit_objectives: [],
      risk_assessment: "",
      planned_start_date: "",
      planned_end_date: "",
      planned_hours: 0,
      planned_budget: 0,
      priority: "medium",
      complexity: "medium",
      team_lead: "",
      team_lead_email: "",
      audit_team: [],
      stakeholders: [],
      deliverables: [],
      methodology: "",
      tools_used: []
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto p-6">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Audit Planning
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Plan and manage your audit engagements
              </p>
            </div>
          </div>

          {/* Summary Cards */}
          <div className="grid gap-4 md:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Plans</CardTitle>
                <Calendar className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{annualPlans.length}</div>
                <p className="text-xs text-muted-foreground">Annual audit plans</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Engagements</CardTitle>
                <Target className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {engagements.filter(e => e.engagement_status === 'in-progress' || e.engagement_status === 'fieldwork').length}
                </div>
                <p className="text-xs text-muted-foreground">Currently active</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Budget</CardTitle>
                <DollarSign className="h-4 w-4 text-purple-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  ${annualPlans.reduce((sum, plan) => sum + plan.total_budget, 0).toLocaleString()}
                </div>
                <p className="text-xs text-muted-foreground">Allocated budget</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Hours</CardTitle>
                <Clock className="h-4 w-4 text-orange-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {annualPlans.reduce((sum, plan) => sum + plan.total_hours, 0).toLocaleString()}
                </div>
                <p className="text-xs text-muted-foreground">Planned hours</p>
              </CardContent>
            </Card>
          </div>

          {/* Main Content Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="annual-plans">Annual Plans</TabsTrigger>
              <TabsTrigger value="engagements">Audit Engagements</TabsTrigger>
            </TabsList>

            {/* Annual Plans Tab */}
            <TabsContent value="annual-plans" className="space-y-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Annual Audit Plans</CardTitle>
                    <CardDescription>
                      Manage your annual audit planning and budgeting
                    </CardDescription>
                  </div>
                  <Dialog open={isCreatePlanDialogOpen} onOpenChange={setIsCreatePlanDialogOpen}>
                    <DialogTrigger asChild>
                      <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                        <Plus className="mr-2 h-4 w-4" />
                        Create Plan
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>Create Annual Audit Plan</DialogTitle>
                        <DialogDescription>
                          Create a new annual audit plan for the specified year
                        </DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="plan_year">Plan Year</Label>
                            <Input
                              id="plan_year"
                              type="number"
                              value={planFormData.plan_year}
                              onChange={(e) => setPlanFormData({ ...planFormData, plan_year: parseInt(e.target.value) })}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="plan_name">Plan Name</Label>
                            <Input
                              id="plan_name"
                              value={planFormData.plan_name}
                              onChange={(e) => setPlanFormData({ ...planFormData, plan_name: e.target.value })}
                              placeholder="2024 Annual Audit Plan"
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="plan_description">Description</Label>
                          <Textarea
                            id="plan_description"
                            value={planFormData.plan_description}
                            onChange={(e) => setPlanFormData({ ...planFormData, plan_description: e.target.value })}
                            placeholder="Describe the annual audit plan..."
                            rows={3}
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="total_budget">Total Budget</Label>
                            <Input
                              id="total_budget"
                              type="number"
                              value={planFormData.total_budget}
                              onChange={(e) => setPlanFormData({ ...planFormData, total_budget: parseFloat(e.target.value) })}
                              placeholder="500000"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="total_hours">Total Hours</Label>
                            <Input
                              id="total_hours"
                              type="number"
                              value={planFormData.total_hours}
                              onChange={(e) => setPlanFormData({ ...planFormData, total_hours: parseInt(e.target.value) })}
                              placeholder="2000"
                            />
                          </div>
                        </div>
                      </div>
                      <div className="flex justify-end space-x-2">
                        <Button variant="outline" onClick={() => setIsCreatePlanDialogOpen(false)}>
                          Cancel
                        </Button>
                        <Button onClick={handleCreatePlan}>
                          Create Plan
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Year</TableHead>
                        <TableHead>Plan Name</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Budget</TableHead>
                        <TableHead>Hours</TableHead>
                        <TableHead>Approval</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {annualPlans.map((plan) => (
                        <TableRow key={plan.id}>
                          <TableCell className="font-medium">{plan.plan_year}</TableCell>
                          <TableCell>
                            <div>
                              <div className="font-medium">{plan.plan_name}</div>
                              <div className="text-sm text-muted-foreground truncate max-w-xs">
                                {plan.plan_description}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge className={getStatusColor(plan.plan_status)}>
                              {plan.plan_status.charAt(0).toUpperCase() + plan.plan_status.slice(1)}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm">
                              ${plan.total_budget.toLocaleString()}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              ${plan.allocated_budget.toLocaleString()} allocated
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm">
                              {plan.total_hours.toLocaleString()}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {plan.allocated_hours.toLocaleString()} allocated
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant={plan.approval_status === 'approved' ? 'default' : 'secondary'}>
                              {plan.approval_status.charAt(0).toUpperCase() + plan.approval_status.slice(1)}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Button variant="ghost" size="sm">
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm">
                                <Edit className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Engagements Tab */}
            <TabsContent value="engagements" className="space-y-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Audit Engagements</CardTitle>
                    <CardDescription>
                      Manage individual audit engagements and projects
                    </CardDescription>
                  </div>
                  <Dialog open={isCreateEngagementDialogOpen} onOpenChange={setIsCreateEngagementDialogOpen}>
                    <DialogTrigger asChild>
                      <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                        <Plus className="mr-2 h-4 w-4" />
                        Create Engagement
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>Create Audit Engagement</DialogTitle>
                        <DialogDescription>
                          Create a new audit engagement
                        </DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="engagement_id">Engagement ID</Label>
                            <Input
                              id="engagement_id"
                              value={engagementFormData.engagement_id}
                              onChange={(e) => setEngagementFormData({ ...engagementFormData, engagement_id: e.target.value })}
                              placeholder="AE-2024-001"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="engagement_name">Engagement Name</Label>
                            <Input
                              id="engagement_name"
                              value={engagementFormData.engagement_name}
                              onChange={(e) => setEngagementFormData({ ...engagementFormData, engagement_name: e.target.value })}
                              placeholder="Customer Database System Audit"
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="annual_plan_id">Annual Plan</Label>
                            <Select value={engagementFormData.annual_plan_id.toString()} onValueChange={(value) => setEngagementFormData({ ...engagementFormData, annual_plan_id: parseInt(value) })}>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {annualPlans.map(plan => (
                                  <SelectItem key={plan.id} value={plan.id.toString()}>
                                    {plan.plan_name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="engagement_type">Engagement Type</Label>
                            <Select value={engagementFormData.engagement_type} onValueChange={(value) => setEngagementFormData({ ...engagementFormData, engagement_type: value })}>
                              <SelectTrigger>
                                <SelectValue placeholder="Select type" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="financial">Financial</SelectItem>
                                <SelectItem value="operational">Operational</SelectItem>
                                <SelectItem value="compliance">Compliance</SelectItem>
                                <SelectItem value="it">IT</SelectItem>
                                <SelectItem value="special">Special</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="audit_scope">Audit Scope</Label>
                          <Textarea
                            id="audit_scope"
                            value={engagementFormData.audit_scope}
                            onChange={(e) => setEngagementFormData({ ...engagementFormData, audit_scope: e.target.value })}
                            placeholder="Describe the audit scope..."
                            rows={3}
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="planned_start_date">Planned Start Date</Label>
                            <Input
                              id="planned_start_date"
                              type="date"
                              value={engagementFormData.planned_start_date}
                              onChange={(e) => setEngagementFormData({ ...engagementFormData, planned_start_date: e.target.value })}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="planned_end_date">Planned End Date</Label>
                            <Input
                              id="planned_end_date"
                              type="date"
                              value={engagementFormData.planned_end_date}
                              onChange={(e) => setEngagementFormData({ ...engagementFormData, planned_end_date: e.target.value })}
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="planned_hours">Planned Hours</Label>
                            <Input
                              id="planned_hours"
                              type="number"
                              value={engagementFormData.planned_hours}
                              onChange={(e) => setEngagementFormData({ ...engagementFormData, planned_hours: parseInt(e.target.value) })}
                              placeholder="200"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="planned_budget">Planned Budget</Label>
                            <Input
                              id="planned_budget"
                              type="number"
                              value={engagementFormData.planned_budget}
                              onChange={(e) => setEngagementFormData({ ...engagementFormData, planned_budget: parseFloat(e.target.value) })}
                              placeholder="50000"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="priority">Priority</Label>
                            <Select value={engagementFormData.priority} onValueChange={(value) => setEngagementFormData({ ...engagementFormData, priority: value })}>
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
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="team_lead">Team Lead</Label>
                            <Input
                              id="team_lead"
                              value={engagementFormData.team_lead}
                              onChange={(e) => setEngagementFormData({ ...engagementFormData, team_lead: e.target.value })}
                              placeholder="Sarah Johnson"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="team_lead_email">Team Lead Email</Label>
                            <Input
                              id="team_lead_email"
                              type="email"
                              value={engagementFormData.team_lead_email}
                              onChange={(e) => setEngagementFormData({ ...engagementFormData, team_lead_email: e.target.value })}
                              placeholder="sarah.johnson@company.com"
                            />
                          </div>
                        </div>
                      </div>
                      <div className="flex justify-end space-x-2">
                        <Button variant="outline" onClick={() => setIsCreateEngagementDialogOpen(false)}>
                          Cancel
                        </Button>
                        <Button onClick={handleCreateEngagement}>
                          Create Engagement
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Engagement ID</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Entity</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Priority</TableHead>
                        <TableHead>Team Lead</TableHead>
                        <TableHead>Timeline</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {engagements.map((engagement) => (
                        <TableRow key={engagement.id}>
                          <TableCell className="font-mono text-sm">{engagement.engagement_id}</TableCell>
                          <TableCell>
                            <div>
                              <div className="font-medium">{engagement.engagement_name}</div>
                              <div className="text-sm text-muted-foreground truncate max-w-xs">
                                {engagement.audit_scope}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>{engagement.entity_name}</TableCell>
                          <TableCell>
                            <Badge variant="outline">
                              {engagement.engagement_type.charAt(0).toUpperCase() + engagement.engagement_type.slice(1)}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge className={getEngagementStatusColor(engagement.engagement_status)}>
                              {engagement.engagement_status.charAt(0).toUpperCase() + engagement.engagement_status.slice(1)}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge className={getPriorityColor(engagement.priority)}>
                              {engagement.priority.charAt(0).toUpperCase() + engagement.priority.slice(1)}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div>
                              <div className="text-sm font-medium">{engagement.team_lead}</div>
                              <div className="text-xs text-muted-foreground">{engagement.team_lead_email}</div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm">
                              {format(new Date(engagement.planned_start_date), "MMM dd")} - {format(new Date(engagement.planned_end_date), "MMM dd, yyyy")}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {engagement.planned_hours}h, ${engagement.planned_budget.toLocaleString()}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Button variant="ghost" size="sm">
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm">
                                <Edit className="h-4 w-4" />
                              </Button>
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
