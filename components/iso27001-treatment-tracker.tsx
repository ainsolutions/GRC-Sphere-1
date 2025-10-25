"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Progress } from "@/components/ui/progress"
import {
  AlertTriangle,
  Calendar,
  CheckCircle,
  Clock,
  DollarSign,
  Edit,
  Eye,
  FileText,
  Plus,
  Shield,
  TrendingDown,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import OwnerSelectInput from "@/components/owner-search-input"
import { ActionButtons } from "./ui/action-buttons"

interface ISO27001Risk {
  id: number
  risk_id: string
  title: string
  risk_level: string
  risk_score: number
}

interface TreatmentPlan {
  id: number
  plan_id: string
  iso27001_risk_id: number
  iso_risk_id: string
  risk_title: string
  original_risk_level: string
  original_risk_score: number
  treatment_type: string
  treatment_strategy: string
  business_justification: string
  estimated_cost: number
  expected_risk_reduction: number
  plan_status: string
  owner: string
  assigned_to: string
  start_date: string
  target_completion_date: string
  actual_completion_date: string
  residual_likelihood: number
  residual_impact: number
  residual_risk_score: number
  residual_risk_level: string
  total_controls: number
  completed_controls: number
  overdue_controls: number
  avg_effectiveness: number
  actual_cost: number
  plan_aging_days: number
  created_at: string
  updated_at: string
}

interface TreatmentControl {
  id: number
  control_id: string
  treatment_plan_id: number
  treatment_plan_id_display: string
  treatment_type: string
  iso_risk_id: string
  risk_title: string
  control_title: string
  control_description: string
  control_type: string
  control_category: string
  implementation_status: string
  effectiveness_rating: number
  implementation_cost: number
  assigned_owner: string
  technical_contact: string
  implementation_date: string
  testing_date: string
  next_review_date: string
  due_date: string
  completion_date: string
  automation_level: string
  compliance_frameworks: string[]
  evidence_location: string
  testing_procedure: string
  remediation_notes: string
  aging_days: number
  aging_status: string
  created_at: string
  updated_at: string
}

export function ISO27001TreatmentTracker() {
  const [treatmentPlans, setTreatmentPlans] = useState<TreatmentPlan[]>([])
  const [treatmentControls, setTreatmentControls] = useState<TreatmentControl[]>([])
  const [iso27001Risks, setISO27001Risks] = useState<ISO27001Risk[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("plans")
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [ownerFilter, setOwnerFilter] = useState("all")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [dialogType, setDialogType] = useState<"plan" | "view" | "edit">("plan")
  const [selectedItem, setSelectedItem] = useState<TreatmentPlan | TreatmentControl | null>(null)
  const { toast } = useToast()

  // Form states
  const [planForm, setPlanForm] = useState({
    iso27001_risk_id: "",
    treatment_type: "mitigate",
    treatment_strategy: "",
    // treatment_control replaces business_justification in UI
    treatment_control: "",
    estimated_cost: 0,
    // control_assessment_notes replaces expected_risk_reduction in UI
    control_assessment_notes: "",
    owner: "",
    assigned_to: "",
    start_date: "",
    target_completion_date: "",
    // implementation status replaces residual_likelihood in UI (not persisted on plan)
    implementation_status_ui: "",
    // plan status replaces residual_impact in UI
    plan_status: "draft",
  })


  useEffect(() => {
    fetchData()
  }, [])

  // When a risk is selected, fetch details to prefill fields
  useEffect(() => {
    const loadRiskDetails = async () => {
      if (!planForm.iso27001_risk_id) return
      try {
        const res = await fetch(`/api/iso27001-risks/${planForm.iso27001_risk_id}`)
        if (!res.ok) return
        const risk = await res.json()
        setPlanForm((prev) => ({
          ...prev,
          owner: risk.owner || prev.owner,
          treatment_strategy: risk.treatment_plan || prev.treatment_strategy,
          control_assessment_notes: risk.control_assessment || prev.control_assessment_notes,
          // Optional: default plan status from risk.status if present
          plan_status: prev.plan_status || (risk.status ? String(risk.status).toLowerCase() : "draft"),
        }))
      } catch (e) {
        // ignore
      }
    }
    loadRiskDetails()
  }, [planForm.iso27001_risk_id])

  const fetchData = async () => {
    try {
      setLoading(true)
      await Promise.all([fetchTreatmentPlans(), fetchTreatmentControls(), fetchISO27001Risks()])
    } catch (error) {
      console.error("Error fetching data:", error)
      toast({
        title: "Error",
        description: "Failed to load treatment data.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const fetchTreatmentPlans = async () => {
    const response = await fetch("/api/iso27001-treatment-plans")
    if (response.ok) {
      const data = await response.json()
      setTreatmentPlans(data)
    }
  }

  const fetchTreatmentControls = async () => {
    const response = await fetch("/api/iso27001-treatment-controls")
    if (response.ok) {
      const data = await response.json()
      setTreatmentControls(data)
    }
  }

  const fetchISO27001Risks = async () => {
    const response = await fetch("/api/iso27001-risks")
    if (response.ok) {
      const result = await response.json()
      setISO27001Risks(result.data || result)
    }
  }

  const handleCreatePlan = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch("/api/iso27001-treatment-plans", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          iso27001_risk_id: planForm.iso27001_risk_id,
          treatment_type: planForm.treatment_type,
          treatment_strategy: planForm.treatment_strategy,
          // Map treatment_control to business_justification for API
          business_justification: planForm.treatment_control || null,
          estimated_cost: planForm.estimated_cost || null,
          // Send plan status chosen by user
          plan_status: planForm.plan_status || "draft",
          owner: planForm.owner,
          assigned_to: planForm.assigned_to || null,
          start_date: planForm.start_date,
          target_completion_date: planForm.target_completion_date,
          // Do not send residual fields; DB may compute score
          created_by: "Current User",
        }),
      })

      if (response.ok) {
        toast({
          title: "Treatment Plan Created",
          description: "ISO 27001 treatment plan has been created successfully.",
        })
        // Create initial tracking entry
        try {
          const created = await response.json()
          await fetch("/api/iso27001-treatment-tracking", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              treatment_plan_id: created.id,
              tracking_type: "plan_created",
              new_status: planForm.plan_status || "draft",
              description: `Plan created for risk ${created.iso27001_risk_id}`,
              created_by: "Current User",
            }),
          })
        } catch { }
        setIsDialogOpen(false)
        resetPlanForm()
        fetchTreatmentPlans()
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create treatment plan.",
        variant: "destructive",
      })
    }
  }


  const resetPlanForm = () => {
    setPlanForm({
      iso27001_risk_id: "",
      treatment_type: "mitigate",
      treatment_strategy: "",
      treatment_control: "",
      estimated_cost: 0,
      control_assessment_notes: "",
      owner: "",
      assigned_to: "",
      start_date: "",
      target_completion_date: "",
      implementation_status_ui: "",
      plan_status: "draft",
    })
  }


  const openDialog = (type: "plan" | "view" | "edit", item?: TreatmentPlan | TreatmentControl) => {
    setDialogType(type)
    setSelectedItem(item || null)
    if (type === "edit" && item && "id" in item) {
      // Prefill form from selected plan
      setPlanForm((prev) => ({
        ...prev,
        iso27001_risk_id: String((item as any).iso27001_risk_id || prev.iso27001_risk_id),
        treatment_type: (item as any).treatment_type || prev.treatment_type,
        treatment_strategy: (item as any).treatment_strategy || prev.treatment_strategy,
        treatment_control: (item as any).business_justification || "",
        estimated_cost: Number((item as any).estimated_cost) || 0,
        owner: (item as any).owner || prev.owner,
        assigned_to: (item as any).assigned_to || prev.assigned_to,
        start_date: (item as any).start_date ? String((item as any).start_date).slice(0, 10) : prev.start_date,
        target_completion_date: (item as any).target_completion_date ? String((item as any).target_completion_date).slice(0, 10) : prev.target_completion_date,
        plan_status: (item as any).plan_status || prev.plan_status,
      }))
    }
    setIsDialogOpen(true)
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return "Not set"
    return new Date(dateString).toLocaleDateString()
  }

  const getRiskLevelColor = (level: string) => {
    switch (level) {
      case "Critical":
        return "bg-red-500"
      case "High":
        return "bg-orange-500"
      case "Medium":
        return "bg-yellow-500"
      case "Low":
        return "bg-green-500"
      default:
        return "bg-gray-500"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
      case "approved":
        return "bg-green-500"
      case "in_progress":
        return "bg-blue-500"
      case "draft":
      case "not_started":
        return "bg-gray-500"
      case "overdue":
        return "bg-red-500"
      case "on_hold":
        return "bg-yellow-500"
      default:
        return "bg-gray-500"
    }
  }

  const getAgingIcon = (agingStatus: string, agingDays: number) => {
    if (agingStatus === "overdue") {
      return <AlertTriangle className="h-4 w-4 text-red-500" />
    } else if (agingStatus === "due_soon") {
      return <Clock className="h-4 w-4 text-orange-500" />
    } else if (agingStatus === "completed") {
      return <CheckCircle className="h-4 w-4 text-green-500" />
    }
    return <Calendar className="h-4 w-4 text-gray-500" />
  }

  const filteredPlans = treatmentPlans.filter((plan) => {
    const matchesSearch =
      plan.risk_title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      plan.plan_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      plan.owner.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || plan.plan_status === statusFilter
    const matchesOwner = ownerFilter === "all" || plan.owner.includes(ownerFilter)
    return matchesSearch && matchesStatus && matchesOwner
  })

  const filteredControls = treatmentControls.filter((control) => {
    const matchesSearch =
      control.control_title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      control.risk_title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      control.assigned_owner?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || control.implementation_status === statusFilter
    const matchesOwner = ownerFilter === "all" || control.assigned_owner?.includes(ownerFilter)
    return matchesSearch && matchesStatus && matchesOwner
  })

  // Calculate statistics
  const stats = {
    totalPlans: treatmentPlans.length,
    approvedPlans: treatmentPlans.filter((p) => p.plan_status === "approved").length,
    inProgressPlans: treatmentPlans.filter((p) => p.plan_status === "in_progress").length,
    overduePlans: treatmentPlans.filter((p) => p.plan_aging_days > 0).length,
    totalControls: treatmentControls.length,
    completedControls: treatmentControls.filter((c) => c.implementation_status === "completed").length,
    overdueControls: treatmentControls.filter((c) => c.aging_status === "overdue").length,
    totalInvestment: treatmentPlans.reduce((sum, p) => sum + (p.actual_cost || p.estimated_cost), 0),
    avgRiskReduction:
      treatmentPlans.reduce((sum, p) => sum + p.expected_risk_reduction, 0) / treatmentPlans.length || 0,
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">Loading Treatment Tracker...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Treatment Plans</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalPlans}</div>
            <p className="text-xs text-muted-foreground">
              {stats.approvedPlans} approved, {stats.overduePlans} overdue
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Controls</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.completedControls}</div>
            <p className="text-xs text-muted-foreground">
              of {stats.totalControls} total controls ({stats.overdueControls} overdue)
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Investment</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(stats.totalInvestment)}</div>
            <p className="text-xs text-muted-foreground">Total treatment investment</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Risk Reduction</CardTitle>
            <TrendingDown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Math.round(stats.avgRiskReduction)}%</div>
            <p className="text-xs text-muted-foreground">Average expected reduction</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="flex items-center justify-between mb-4">
          <TabsList className="grid w-full grid-cols-2 lg:w-[450px]">
            <TabsTrigger value="plans">Treatment Plans</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <div className="flex items-center space-x-2">
            <ActionButtons isTableAction={false} onAdd={() => openDialog("plan")} btnAddText="New Plan" />
            {/* <Button onClick={() => openDialog("plan")}>
              <Plus className="h-4 w-4 mr-2" />
              New Plan
            </Button> */}
          </div>
        </div>

        {/* Filters */}
        <div className="flex gap-4 items-center mb-4">
          <Input
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
          />
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="in_progress">In Progress</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="not_started">Not Started</SelectItem>
              <SelectItem value="on_hold">On Hold</SelectItem>
            </SelectContent>
          </Select>
          <Select value={ownerFilter} onValueChange={setOwnerFilter}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Filter by owner" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Owners</SelectItem>
              {Array.from(new Set(treatmentPlans.map((p) => p.owner))).map((owner) => (
                <SelectItem key={owner} value={owner}>
                  {owner}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <TabsContent value="plans" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>ISO 27001 Treatment Plans</CardTitle>
              <CardDescription>Manage risk treatment plans and track their progress</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Plan ID</TableHead>
                    <TableHead>Risk</TableHead>
                    <TableHead>Treatment Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Progress</TableHead>
                    <TableHead>Owner</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead>Investment</TableHead>
                    <TableHead>Residual Risk</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPlans.map((plan) => (
                    <TableRow key={plan.id}>
                      <TableCell className="font-mono text-sm">{plan.plan_id}</TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-medium">{plan.risk_title}</span>
                          <span className="text-sm text-muted-foreground">{plan.original_risk_level}</span>
                        </div>
                      </TableCell>
                      <TableCell>{plan.treatment_type}</TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(plan.plan_status)}>{plan.plan_status}</Badge>
                      </TableCell>
                      <TableCell>
                        <Progress value={(plan.completed_controls / plan.total_controls) * 100} />
                      </TableCell>
                      <TableCell>{plan.owner}</TableCell>
                      <TableCell>{formatDate(plan.target_completion_date)}</TableCell>
                      <TableCell>{formatCurrency(plan.estimated_cost)}</TableCell>
                      <TableCell>
                        <Badge className={getRiskLevelColor(plan.residual_risk_level)}>
                          {plan.residual_risk_level}
                        </Badge>
                      </TableCell>
                      <TableCell className="flex items-center space-x-1">
                        <Button variant="ghost" onClick={() => openDialog("view", plan)}>
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" onClick={() => openDialog("edit", plan)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Controls Tab */}
        <TabsContent value="controls" className="space-y-4">
          <Card className="bg-slate-900/50 border-slate-700 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Controls</CardTitle>
              <CardDescription>Manage treatment controls and track their implementation</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Control ID</TableHead>
                    <TableHead>Risk</TableHead>
                    <TableHead>Control Title</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Owner</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredControls.map((control) => (
                    <TableRow key={control.id}>
                      <TableCell className="font-mono text-sm">{control.control_id}</TableCell>
                      <TableCell>{control.risk_title}</TableCell>
                      <TableCell>{control.control_title}</TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(control.implementation_status)}>
                          {control.implementation_status}
                        </Badge>
                      </TableCell>
                      <TableCell>{control.assigned_owner}</TableCell>
                      <TableCell>{formatDate(control.due_date)}</TableCell>
                      <TableCell className="flex items-center space-x-2">
                        <ActionButtons isTableAction={true}
                          onView={() => openDialog("view", control)}
                                actionObj={control}
                        //onEdit={() => {}} 
                        //onDelete={() => {}}   
                        //deleteDialogTitle={}                                
                        />
                        {/* <Button variant="outline" onClick={() => openDialog("view", control)}>
                          <Eye className="h-4 w-4" />
                        </Button> */}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Analytics</CardTitle>
              <CardDescription>View analytics and insights for treatment plans and controls</CardDescription>
            </CardHeader>
            <CardContent>
              {/* Placeholder for analytics content */}
              <p className="text-sm text-muted-foreground">Analytics content goes here</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* New Plan Dialog */}
      <Dialog open={isDialogOpen && dialogType === "plan"} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create ISO 27001 Treatment Plan</DialogTitle>
            <DialogDescription>Define a plan linked to an existing ISO 27001 risk.</DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCreatePlan} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Risk</Label>
                <Select value={planForm.iso27001_risk_id} onValueChange={(v) => setPlanForm({ ...planForm, iso27001_risk_id: v })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select ISO 27001 risk" />
                  </SelectTrigger>
                  <SelectContent>
                    {iso27001Risks.map((r) => (
                      <SelectItem key={r.id} value={String(r.id)}>
                        {r.risk_id} - {r.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Treatment Type</Label>
                <Select value={planForm.treatment_type} onValueChange={(v) => setPlanForm({ ...planForm, treatment_type: v })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select treatment type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="mitigate">Mitigate</SelectItem>
                    <SelectItem value="transfer">Transfer</SelectItem>
                    <SelectItem value="avoid">Avoid</SelectItem>
                    <SelectItem value="accept">Accept</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Owner</Label>
                <Input value={planForm.owner} onChange={(e) => setPlanForm({ ...planForm, owner: e.target.value })} placeholder="Plan owner" />
              </div>

              <div className="space-y-2">
                <Label>Assigned To</Label>
                <OwnerSelectInput formData={planForm as any} setFormData={(f: any) => setPlanForm({ ...planForm, ...f })} fieldName="assigned_to" />
              </div>

              <div className="space-y-2">
                <Label>Start Date</Label>
                <Input type="date" value={planForm.start_date} onChange={(e) => setPlanForm({ ...planForm, start_date: e.target.value })} />
              </div>

              <div className="space-y-2">
                <Label>Target Completion</Label>
                <Input type="date" value={planForm.target_completion_date} onChange={(e) => setPlanForm({ ...planForm, target_completion_date: e.target.value })} />
              </div>

              <div className="space-y-2">
                <Label>Estimated Cost</Label>
                <Input type="number" value={String(planForm.estimated_cost)} onChange={(e) => setPlanForm({ ...planForm, estimated_cost: Number(e.target.value) || 0 })} placeholder="0" />
              </div>

              <div className="space-y-2">
                <Label>Control Assessment Notes</Label>
                <Textarea value={planForm.control_assessment_notes} onChange={(e) => setPlanForm({ ...planForm, control_assessment_notes: e.target.value })} placeholder="Notes from control assessment" />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Treatment Strategy</Label>
              <Textarea value={planForm.treatment_strategy} onChange={(e) => setPlanForm({ ...planForm, treatment_strategy: e.target.value })} placeholder="Describe the treatment approach (prefilled from risk)" />
            </div>

            <div className="space-y-2">
              <Label>Treatment Control</Label>
              <Textarea value={planForm.treatment_control} onChange={(e) => setPlanForm({ ...planForm, treatment_control: e.target.value })} placeholder="Describe controls to be applied" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Implementation Status</Label>
                <Select value={planForm.implementation_status_ui} onValueChange={(v) => setPlanForm({ ...planForm, implementation_status_ui: v })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="not_started">Not Started</SelectItem>
                    <SelectItem value="in_progress">In Progress</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="on_hold">On Hold</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Status</Label>
                <Select value={planForm.plan_status} onValueChange={(v) => setPlanForm({ ...planForm, plan_status: v })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select plan status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="in_progress">In Progress</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="on_hold">On Hold</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
              <Button type="submit">Create Plan</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* View Plan Dialog */}
      <Dialog open={isDialogOpen && dialogType === "view"} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>View Treatment Plan</DialogTitle>
            <DialogDescription>Read-only details of the selected plan.</DialogDescription>
          </DialogHeader>

          {selectedItem && "plan_id" in selectedItem && (
            <div className="space-y-3 text-sm">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-muted-foreground">Plan ID</div>
                  <div className="font-medium">{selectedItem.plan_id}</div>
                </div>
                <div>
                  <div className="text-muted-foreground">Risk</div>
                  <div className="font-medium">{selectedItem.risk_title}</div>
                </div>
                <div>
                  <div className="text-muted-foreground">Type</div>
                  <div className="font-medium">{selectedItem.treatment_type}</div>
                </div>
                <div>
                  <div className="text-muted-foreground">Status</div>
                  <div className="font-medium">{(selectedItem as any).plan_status}</div>
                </div>
                <div>
                  <div className="text-muted-foreground">Owner</div>
                  <div className="font-medium">{selectedItem.owner}</div>
                </div>
                <div>
                  <div className="text-muted-foreground">Assigned To</div>
                  <div className="font-medium">{selectedItem.assigned_to}</div>
                </div>
              </div>
              <div>
                <div className="text-muted-foreground">Treatment Strategy</div>
                <div className="whitespace-pre-wrap">{selectedItem.treatment_strategy}</div>
              </div>
              <div>
                <div className="text-muted-foreground">Treatment Control</div>
                <div className="whitespace-pre-wrap">{selectedItem.business_justification}</div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Plan Dialog */}
      <Dialog open={isDialogOpen && dialogType === "edit"} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Treatment Plan</DialogTitle>
            <DialogDescription>Update fields for the selected plan.</DialogDescription>
          </DialogHeader>

          {selectedItem && "id" in selectedItem && (
            <form
              onSubmit={async (e) => {
                e.preventDefault()
                try {
                  await fetch(`/api/iso27001-treatment-plans/${(selectedItem as any).id}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                      treatment_type: planForm.treatment_type,
                      treatment_strategy: planForm.treatment_strategy,
                      business_justification: planForm.treatment_control || null,
                      estimated_cost: planForm.estimated_cost || 0,
                      plan_status: planForm.plan_status,
                      owner: planForm.owner,
                      assigned_to: planForm.assigned_to || null,
                      start_date: planForm.start_date,
                      target_completion_date: planForm.target_completion_date,
                      updated_by: "Current User",
                    }),
                  })
                  setIsDialogOpen(false)
                  fetchTreatmentPlans()
                } catch { }
              }}
              className="space-y-4"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Treatment Type</Label>
                  <Select value={planForm.treatment_type} onValueChange={(v) => setPlanForm({ ...planForm, treatment_type: v })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select treatment type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="mitigate">Mitigate</SelectItem>
                      <SelectItem value="transfer">Transfer</SelectItem>
                      <SelectItem value="avoid">Avoid</SelectItem>
                      <SelectItem value="accept">Accept</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Status</Label>
                  <Select value={planForm.plan_status} onValueChange={(v) => setPlanForm({ ...planForm, plan_status: v })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select plan status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="in_progress">In Progress</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="on_hold">On Hold</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Treatment Strategy</Label>
                <Textarea value={planForm.treatment_strategy} onChange={(e) => setPlanForm({ ...planForm, treatment_strategy: e.target.value })} />
              </div>

              <div className="space-y-2">
                <Label>Treatment Control</Label>
                <Textarea value={planForm.treatment_control} onChange={(e) => setPlanForm({ ...planForm, treatment_control: e.target.value })} />
              </div>

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                <Button type="submit">Save Changes</Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
