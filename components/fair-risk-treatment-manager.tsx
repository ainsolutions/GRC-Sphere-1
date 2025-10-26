"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Progress } from "@/components/ui/progress"
import { AlertTriangle, Calendar, CheckCircle, Clock, Eye, Plus, Shield, Target, User, History } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import OwnerSelectInput from "@/components/owner-search-input"
import { ActionButtons } from "./ui/action-buttons"

interface TreatmentPlan {
  id: string
  treatment_type: string
  treatment_strategy: string
  business_justification: string
  cost_estimate: number
  expected_risk_reduction: number
  approval_status: string
  approved_by: string
  approved_date: string
  created_at: string
  updated_at: string
  total_controls: number
  completed_controls: number
  overdue_controls: number
  avg_progress: number
}

interface TreatmentControl {
  id: string
  treatment_plan_id: string
  control_id: string
  control_title: string
  control_description: string
  control_type: string
  control_category: string
  implementation_status: string
  assigned_to: string
  start_date: string
  due_date: string
  completion_date: string
  progress_percentage: number
  implementation_notes: string
  evidence_links: string[]
  testing_status: string
  testing_date: string
  testing_notes: string
  effectiveness_rating: number
  cost_actual: number
  aging_days: number
  aging_status: string
  created_at: string
  updated_at: string
}

interface TrackingRecord {
  id: string
  field_changed: string
  old_value: string
  new_value: string
  changed_by: string
  change_reason: string
  changed_at: string
}

interface FairRiskTreatmentManagerProps {
  riskId: string
  riskTitle: string
  onClose?: () => void
}

export function FairRiskTreatmentManager({ riskId, riskTitle, onClose }: FairRiskTreatmentManagerProps) {
  const [treatmentPlans, setTreatmentPlans] = useState<TreatmentPlan[]>([])
  const [selectedPlan, setSelectedPlan] = useState<TreatmentPlan | null>(null)
  const [controls, setControls] = useState<TreatmentControl[]>([])
  const [selectedControl, setSelectedControl] = useState<TreatmentControl | null>(null)
  const [tracking, setTracking] = useState<TrackingRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [dialogType, setDialogType] = useState<"plan" | "control" | "view" | "tracking">("plan")
  const { toast } = useToast()

  // Form states
  const [planForm, setPlanForm] = useState({
    treatment_type: "mitigate",
    treatment_strategy: "",
    business_justification: "",
    cost_estimate: 0,
    expected_risk_reduction: 0,
  })

  const [controlForm, setControlForm] = useState({
    control_id: "",
    control_title: "",
    control_description: "",
    control_type: "preventive",
    control_category: "",
    assigned_to: "",
    start_date: "",
    due_date: "",
    implementation_notes: "",
  })

  useEffect(() => {
    fetchTreatmentPlans()
  }, [riskId])

  useEffect(() => {
    if (selectedPlan) {
      fetchControls(selectedPlan.id)
    }
  }, [selectedPlan])

  const fetchTreatmentPlans = async () => {
    try {
      const response = await fetch(`/api/fair-risks/${riskId}/treatments`)
      if (response.ok) {
        const data = await response.json()
        setTreatmentPlans(data)
        if (data.length > 0) {
          setSelectedPlan(data[0])
        }
      }
    } catch (error) {
      console.error("Error fetching treatment plans:", error)
    } finally {
      setLoading(false)
    }
  }

  const fetchControls = async (planId: string) => {
    try {
      const response = await fetch(`/api/fair-risks/treatments/${planId}/controls`)
      if (response.ok) {
        const data = await response.json()
        setControls(data)
      }
    } catch (error) {
      console.error("Error fetching controls:", error)
    }
  }

  const fetchTracking = async (controlId: string) => {
    try {
      const response = await fetch(`/api/fair-risks/treatments/controls/${controlId}/tracking`)
      if (response.ok) {
        const data = await response.json()
        setTracking(data)
      }
    } catch (error) {
      console.error("Error fetching tracking:", error)
    }
  }

  const handleCreatePlan = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch(`/api/fair-risks/${riskId}/treatments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(planForm),
      })

      if (response.ok) {
        toast({
          title: "Treatment Plan Created",
          description: "Risk treatment plan has been created successfully.",
        })
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

  const handleCreateControl = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedPlan) return

    try {
      const response = await fetch(`/api/fair-risks/treatments/${selectedPlan.id}/controls`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(controlForm),
      })

      if (response.ok) {
        toast({
          title: "Control Created",
          description: "Treatment control has been created successfully.",
        })
        setIsDialogOpen(false)
        resetControlForm()
        fetchControls(selectedPlan.id)
        fetchTreatmentPlans() // Refresh to update counts
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create treatment control.",
        variant: "destructive",
      })
    }
  }

  const handleUpdateControl = async (control: TreatmentControl, updates: Partial<TreatmentControl>) => {
    try {
      const response = await fetch(`/api/fair-risks/treatments/controls/${control.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...control,
          ...updates,
          changed_by: "Current User", // In real app, get from auth
          change_reason: "Control updated via UI",
        }),
      })

      if (response.ok) {
        toast({
          title: "Control Updated",
          description: "Treatment control has been updated successfully.",
        })
        if (selectedPlan) {
          fetchControls(selectedPlan.id)
          fetchTreatmentPlans() // Refresh to update counts
        }
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update treatment control.",
        variant: "destructive",
      })
    }
  }

  const resetPlanForm = () => {
    setPlanForm({
      treatment_type: "mitigate",
      treatment_strategy: "",
      business_justification: "",
      cost_estimate: 0,
      expected_risk_reduction: 0,
    })
  }

  const resetControlForm = () => {
    setControlForm({
      control_id: "",
      control_title: "",
      control_description: "",
      control_type: "preventive",
      control_category: "",
      assigned_to: "",
      start_date: "",
      due_date: "",
      implementation_notes: "",
    })
  }

  const openDialog = (type: "plan" | "control" | "view" | "tracking", control?: TreatmentControl) => {
    setDialogType(type)
    if (control) {
      setSelectedControl(control)
      if (type === "tracking") {
        fetchTracking(control.id)
      }
    }
    setIsDialogOpen(true)
  }

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      not_started: { variant: "outline" as const, color: "text-gray-600" },
      in_progress: { variant: "secondary" as const, color: "text-blue-600" },
      completed: { variant: "default" as const, color: "text-green-600" },
      on_hold: { variant: "destructive" as const, color: "text-yellow-600" },
      cancelled: { variant: "destructive" as const, color: "text-red-600" },
      overdue: { variant: "destructive" as const, color: "text-red-600" },
      due_soon: { variant: "secondary" as const, color: "text-orange-600" },
      on_track: { variant: "outline" as const, color: "text-green-600" },
    }

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.not_started
    return (
      <Badge variant={config.variant} className={config.color}>
        {status.replace("_", " ").toUpperCase()}
      </Badge>
    )
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

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Risk Treatment Management</h2>
          <p className="text-muted-foreground">Risk: {riskTitle}</p>
        </div>
        <div className="flex gap-2">
          <ActionButtons isTableAction={false} onAdd={() => openDialog("plan")} btnAddText="New Treatment Plan"/>
          {/* <Button onClick={() => openDialog("plan")}>
            <Plus className="h-4 w-4 mr-2" />
            New Treatment Plan
          </Button> */}
          {onClose && (
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
          )}
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Treatment Plans */}
        <Card className="bg-slate-900/50 border-slate-700 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Treatment Plans
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {treatmentPlans.map((plan) => (
              <div
                key={plan.id}
                className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                  selectedPlan?.id === plan.id
                    ? "border-blue-500 bg-blue-50 dark:bg-blue-950"
                    : "hover:bg-gray-50 dark:hover:bg-gray-800"
                }`}
                onClick={() => setSelectedPlan(plan)}
              >
                <div className="flex items-center justify-between mb-2">
                  <Badge variant="outline">{plan.treatment_type.toUpperCase()}</Badge>
                  {getStatusBadge(plan.approval_status)}
                </div>
                <p className="text-sm font-medium mb-1">{plan.treatment_strategy.substring(0, 100)}...</p>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>{formatCurrency(plan.cost_estimate)}</span>
                  <span>{plan.expected_risk_reduction}% reduction</span>
                </div>
                <div className="flex items-center justify-between text-xs text-muted-foreground mt-2">
                  <span>
                    {plan.completed_controls}/{plan.total_controls} controls
                  </span>
                  {plan.overdue_controls > 0 && (
                    <span className="text-red-500 font-medium">{plan.overdue_controls} overdue</span>
                  )}
                </div>
                <Progress value={plan.avg_progress} className="mt-2 h-1" />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Treatment Controls */}
        <Card className="md:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Treatment Controls
                {selectedPlan && (
                  <Badge variant="outline" className="ml-2">
                    {selectedPlan.treatment_type}
                  </Badge>
                )}
              </CardTitle>
              {selectedPlan && (
                <ActionButtons isTableAction={false} onAdd={() => openDialog("control")} btnAddText="Add Control"/>
                {/* <Button size="sm" onClick={() => openDialog("control")}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Control
                </Button> */}
              )}
            </div>
          </CardHeader>
          <CardContent>
            {selectedPlan ? (
              <div className="space-y-4">
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="text-center p-3 bg-blue-50 dark:bg-blue-950 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">{selectedPlan.total_controls}</div>
                    <div className="text-sm text-muted-foreground">Total Controls</div>
                  </div>
                  <div className="text-center p-3 bg-green-50 dark:bg-green-950 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">{selectedPlan.completed_controls}</div>
                    <div className="text-sm text-muted-foreground">Completed</div>
                  </div>
                  <div className="text-center p-3 bg-red-50 dark:bg-red-950 rounded-lg">
                    <div className="text-2xl font-bold text-red-600">{selectedPlan.overdue_controls}</div>
                    <div className="text-sm text-muted-foreground">Overdue</div>
                  </div>
                </div>

                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Control</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Assigned To</TableHead>
                      <TableHead>Due Date</TableHead>
                      <TableHead>Progress</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {controls.map((control) => (
                      <TableRow key={control.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{control.control_title}</div>
                            <div className="text-sm text-muted-foreground">{control.control_id}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{control.control_type}</Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4" />
                            {control.assigned_to || "Unassigned"}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {getAgingIcon(control.aging_status, control.aging_days)}
                            <div>
                              <div className="text-sm">{formatDate(control.due_date)}</div>
                              {control.aging_days > 0 && (
                                <div className="text-xs text-red-500">{control.aging_days} days overdue</div>
                              )}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <Progress value={control.progress_percentage} className="h-2" />
                            <div className="text-xs text-center">{control.progress_percentage}%</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            {getStatusBadge(control.implementation_status)}
                            {getStatusBadge(control.aging_status)}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <ActionButtons isTableAction={true} 
                                  onView={() => openDialog("view", control)} 
                                actionObj={control}
                                  //onEdit={() => {}} 
                                  //onDelete={() => {}}   
                                  //deleteDialogTitle={}                                
                                  />
                            {/* <Button variant="ghost" size="sm" onClick={() => openDialog("view", control)}>
                              <Eye className="h-4 w-4" />
                            </Button> */}
                            <Button variant="ghost" size="sm" onClick={() => openDialog("tracking", control)}>
                              <History className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">Select a treatment plan to view controls</div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Dialogs */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          {dialogType === "plan" && (
            <>
              <DialogHeader>
                <DialogTitle>Create Treatment Plan</DialogTitle>
                <DialogDescription>Define a comprehensive treatment strategy for this risk</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleCreatePlan} className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <Label>Treatment Type</Label>
                    <Select
                      value={planForm.treatment_type}
                      onValueChange={(value) => setPlanForm({ ...planForm, treatment_type: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="accept">Accept</SelectItem>
                        <SelectItem value="mitigate">Mitigate</SelectItem>
                        <SelectItem value="transfer">Transfer</SelectItem>
                        <SelectItem value="avoid">Avoid</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Expected Risk Reduction (%)</Label>
                    <Input
                      type="number"
                      min="0"
                      max="100"
                      value={planForm.expected_risk_reduction}
                      onChange={(e) =>
                        setPlanForm({ ...planForm, expected_risk_reduction: Number.parseInt(e.target.value) || 0 })
                      }
                    />
                  </div>
                </div>
                <div>
                  <Label>Treatment Strategy</Label>
                  <Textarea
                    value={planForm.treatment_strategy}
                    onChange={(e) => setPlanForm({ ...planForm, treatment_strategy: e.target.value })}
                    placeholder="Describe the overall treatment approach..."
                    rows={3}
                    required
                  />
                </div>
                <div>
                  <Label>Business Justification</Label>
                  <Textarea
                    value={planForm.business_justification}
                    onChange={(e) => setPlanForm({ ...planForm, business_justification: e.target.value })}
                    placeholder="Provide business justification for this treatment..."
                    rows={3}
                  />
                </div>
                <div>
                  <Label>Estimated Cost ($)</Label>
                  <Input
                    type="number"
                    min="0"
                    value={planForm.cost_estimate}
                    onChange={(e) =>
                      setPlanForm({ ...planForm, cost_estimate: Number.parseFloat(e.target.value) || 0 })
                    }
                  />
                </div>
                <div className="flex justify-end space-x-2">
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">Create Treatment Plan</Button>
                </div>
              </form>
            </>
          )}

          {dialogType === "control" && (
            <>
              <DialogHeader>
                <DialogTitle>Add Treatment Control</DialogTitle>
                <DialogDescription>Add a specific control or action to implement this treatment</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleCreateControl} className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <Label>Control ID</Label>
                    <Input
                      value={controlForm.control_id}
                      onChange={(e) => setControlForm({ ...controlForm, control_id: e.target.value })}
                      placeholder="e.g., EDR-001, WAF-001"
                      required
                    />
                  </div>
                  <div>
                    <Label>Control Type</Label>
                    <Select
                      value={controlForm.control_type}
                      onValueChange={(value) => setControlForm({ ...controlForm, control_type: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="preventive">Preventive</SelectItem>
                        <SelectItem value="detective">Detective</SelectItem>
                        <SelectItem value="corrective">Corrective</SelectItem>
                        <SelectItem value="compensating">Compensating</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <Label>Control Title</Label>
                  <Input
                    value={controlForm.control_title}
                    onChange={(e) => setControlForm({ ...controlForm, control_title: e.target.value })}
                    placeholder="Brief title for this control"
                    required
                  />
                </div>
                <div>
                  <Label>Control Description</Label>
                  <Textarea
                    value={controlForm.control_description}
                    onChange={(e) => setControlForm({ ...controlForm, control_description: e.target.value })}
                    placeholder="Detailed description of what needs to be implemented..."
                    rows={3}
                  />
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <Label>Control Category</Label>
                    <Input
                      value={controlForm.control_category}
                      onChange={(e) => setControlForm({ ...controlForm, control_category: e.target.value })}
                      placeholder="e.g., Network Security, Access Control"
                    />
                  </div>
                  <div>
                    <Label>Assigned To</Label>                 
                    <OwnerSelectInput formData={controlForm} setFormData={setControlForm} fieldName="assigned_to"/>
                    {/* <Input
                      value={controlForm.assigned_to}
                      onChange={(e) => setControlForm({ ...controlForm, assigned_to: e.target.value })}
                      placeholder="Person or team responsible"
                    /> */}
                  </div>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <Label>Start Date</Label>
                    <Input
                      type="date"
                      value={controlForm.start_date}
                      onChange={(e) => setControlForm({ ...controlForm, start_date: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label>Due Date</Label>
                    <Input
                      type="date"
                      value={controlForm.due_date}
                      onChange={(e) => setControlForm({ ...controlForm, due_date: e.target.value })}
                      required
                    />
                  </div>
                </div>
                <div>
                  <Label>Implementation Notes</Label>
                  <Textarea
                    value={controlForm.implementation_notes}
                    onChange={(e) => setControlForm({ ...controlForm, implementation_notes: e.target.value })}
                    placeholder="Additional notes or requirements..."
                    rows={2}
                  />
                </div>
                <div className="flex justify-end space-x-2">
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">Add Control</Button>
                </div>
              </form>
            </>
          )}

          {dialogType === "view" && selectedControl && (
            <>
              <DialogHeader>
                <DialogTitle>Control Details - {selectedControl.control_id}</DialogTitle>
                <DialogDescription>View and update control implementation details</DialogDescription>
              </DialogHeader>
              <Tabs defaultValue="details" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="details">Details</TabsTrigger>
                  <TabsTrigger value="progress">Progress</TabsTrigger>
                  <TabsTrigger value="testing">Testing</TabsTrigger>
                </TabsList>

                <TabsContent value="details" className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <Label>Control Title</Label>
                      <Input value={selectedControl.control_title} readOnly />
                    </div>
                    <div>
                      <Label>Control Type</Label>
                      <Input value={selectedControl.control_type} readOnly />
                    </div>
                  </div>
                  <div>
                    <Label>Description</Label>
                    <Textarea value={selectedControl.control_description} readOnly rows={3} />
                  </div>
                </TabsContent>
                <TabsContent value="progress" className="space-y-4">
                  {/* Progress tab content */}
                </TabsContent>
                <TabsContent value="testing" className="space-y-4">
                  {/* Testing tab content */}
                </TabsContent>
              </Tabs>
            </>
          )}

          {dialogType === "tracking" && selectedControl && (
            <>
              <DialogHeader>
                <DialogTitle>Tracking - {selectedControl.control_id}</DialogTitle>
                <DialogDescription>View tracking records for this control</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Field Changed</TableHead>
                      <TableHead>Old Value</TableHead>
                      <TableHead>New Value</TableHead>
                      <TableHead>Changed By</TableHead>
                      <TableHead>Change Reason</TableHead>
                      <TableHead>Changed At</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {tracking.map((record) => (
                      <TableRow key={record.id}>
                        <TableCell>{record.field_changed}</TableCell>
                        <TableCell>{record.old_value}</TableCell>
                        <TableCell>{record.new_value}</TableCell>
                        <TableCell>{record.changed_by}</TableCell>
                        <TableCell>{record.change_reason}</TableCell>
                        <TableCell>{formatDate(record.changed_at)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
