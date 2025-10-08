"use client"

import type React from "react"
import { useState, useEffect, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Slider } from "@/components/ui/slider"
import { Separator } from "@/components/ui/separator"
import {
  AlertTriangle,
  DollarSign,
  Shield,
  TrendingUp,
  Calendar,
  User,
  CheckCircle,
  Clock,
  Plus,
  Edit,
  Trash2,
  Calculator,
  Activity,
  BarChart3,
  Loader2,
  Search,
  Filter,
  X,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { FairRiskImportExport } from "@/components/fair-risk-import-export"
import OwnerSelectInput from "@/components/owner-search-input"

interface FairRisk {
  id: number
  risk_id: string
  title: string
  description: string | null
  asset_id: string | null
  threat_actor: string | null
  threat_capability: number | null
  threat_motivation: number | null
  control_strength: number | null
  vulnerability_score: number | null
  loss_event_frequency_min: number | null
  loss_event_frequency_most_likely: number | null
  loss_event_frequency_max: number | null
  primary_loss_min: number | null
  primary_loss_most_likely: number | null
  primary_loss_max: number | null
  secondary_loss_min: number | null
  secondary_loss_most_likely: number | null
  secondary_loss_max: number | null
  annual_loss_expectancy: number | null
  risk_tolerance: number | null
  treatment_plan: string | null
  treatment_status: string | null
  treatment_due_date: string | null
  created_at: string
  updated_at: string
}

interface TreatmentPlan {
  id: number
  fair_risk_id: number
  risk_id: string
  asset_name: string
  threat_event: string
  treatment_type: string
  treatment_strategy: string
  estimated_cost: number
  expected_risk_reduction: number
  approval_status: string
  approved_by: string | null
  approved_date: string | null
  implementation_status: string
  progress_percentage: number
  start_date: string
  target_completion_date: string
  actual_completion_date: string | null
  owner: string
  assigned_to: string
  controls_count: number
  implemented_controls: number
  created_at: string
  updated_at: string
}

interface TreatmentStats {
  total_plans: number
  approved_plans: number
  pending_approval: number
  implemented_plans: number
  total_investment: number
  average_risk_reduction: number
}

interface Asset {
  id: string
  name: string
  type: string
  criticality: string
}

type SortField =
  | "risk_id"
  | "title"
  | "annual_loss_expectancy"
  | "treatment_status"
  | "updated_at"
  | "threat_actor"
  | "asset_id"
type SortDirection = "asc" | "desc"

function FairRiskDashboard() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <Card >
        <CardHeader>
          <CardTitle className="text-blue-800">Risk Assessment Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-32">
            <div className="text-center">
              <Calculator className="h-12 w-12 text-blue-600 mx-auto mb-2" />
              <p className="text-blue-700">FAIR Methodology</p>
              <p className="text-sm text-blue-600">Quantitative Risk Analysis</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-green-800">Loss Magnitude Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-32">
            <div className="text-center">
              <DollarSign className="h-12 w-12 text-green-600 mx-auto mb-2" />
              <p className="text-green-700">Financial Impact</p>
              <p className="text-sm text-green-600">Primary & Secondary Losses</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-purple-800">Threat Event Frequency</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-32">
            <div className="text-center">
              <Activity className="h-12 w-12 text-purple-600 mx-auto mb-2" />
              <p className="text-purple-700">Occurrence Rate</p>
              <p className="text-sm text-purple-600">Min, Most Likely, Max</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function FairRiskHeatMap() {
  return (
    <div className="h-64 flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg border">
      <div className="text-center">
        <BarChart3 className="h-16 w-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-700 mb-2">Risk Heatmap</h3>
        <p className="text-sm text-gray-500">Visual representation of risk distribution</p>
        <p className="text-xs text-gray-400 mt-2">Coming soon - Interactive risk visualization</p>
      </div>
    </div>
  )
}

function FairRiskTreatmentManager({
  risks,
  treatmentPlans,
  onPlanCreated,
}: {
  risks: FairRisk[]
  treatmentPlans: TreatmentPlan[]
  onPlanCreated: () => void
}) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [form, setForm] = useState({
    fair_risk_id: "",
    treatment_type: "mitigate",
    treatment_strategy: "",
    estimated_cost: 0,
    expected_risk_reduction: 0,
    owner: "",
    assigned_to: "",
    start_date: "",
    target_completion_date: "",
  })
  const { toast } = useToast()

  const handleCreatePlan = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.fair_risk_id) {
      toast({
        title: "Error",
        description: "Please select a risk",
        variant: "destructive",
      })
      return
    }
    try {
      const response = await fetch("/api/fair-risks/treatment-plans", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, created_by: "Current User" }),
      })

      if (response.ok) {
        toast({
          title: "Treatment Plan Created",
          description: "Treatment plan has been created successfully.",
        })
        setIsDialogOpen(false)
        setForm({
          fair_risk_id: "",
          treatment_type: "mitigate",
          treatment_strategy: "",
          estimated_cost: 0,
          expected_risk_reduction: 0,
          owner: "",
          assigned_to: "",
          start_date: "",
          target_completion_date: "",
        })
        onPlanCreated()
      } else {
        throw new Error("Failed to create treatment plan")
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: `Failed to create treatment plan: ${error.message}`,
        variant: "destructive",
      })
    }
  }

  return (
    <div className="space-y-4">
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button>
            Create Treatment Plan
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create Treatment Plan</DialogTitle>
            <DialogDescription>Create a new treatment plan for a FAIR risk assessment.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCreatePlan} className="space-y-4">
            <div>
              <Label htmlFor="fair_risk_id">Select Risk</Label>
              <Select value={form.fair_risk_id} onValueChange={(value) => setForm({ ...form, fair_risk_id: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a risk" />
                </SelectTrigger>
                <SelectContent>
                  {risks.map((risk) => (
                    <SelectItem key={risk.id} value={risk.id.toString()}>
                      {risk.risk_id} - {risk.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="treatment_type">Treatment Type</Label>
              <Select
                value={form.treatment_type}
                onValueChange={(value) => setForm({ ...form, treatment_type: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="mitigate">Mitigate</SelectItem>
                  <SelectItem value="accept">Accept</SelectItem>
                  <SelectItem value="transfer">Transfer</SelectItem>
                  <SelectItem value="avoid">Avoid</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="treatment_strategy">Treatment Strategy</Label>
              <Textarea
                id="treatment_strategy"
                value={form.treatment_strategy}
                onChange={(e) => setForm({ ...form, treatment_strategy: e.target.value })}
                placeholder="Describe the treatment strategy"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="estimated_cost">Estimated Cost ($)</Label>
                <Input
                  id="estimated_cost"
                  type="number"
                  min="0"
                  value={form.estimated_cost}
                  onChange={(e) => setForm({ ...form, estimated_cost: Number(e.target.value) })}
                />
              </div>
              <div>
                <Label htmlFor="expected_risk_reduction">Expected Risk Reduction (%)</Label>
                <Input
                  id="expected_risk_reduction"
                  type="number"
                  min="0"
                  max="100"
                  value={form.expected_risk_reduction}
                  onChange={(e) => setForm({ ...form, expected_risk_reduction: Number(e.target.value) })}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="owner">Owner</Label>
                <Input
                  id="owner"
                  value={form.owner}
                  onChange={(e) => setForm({ ...form, owner: e.target.value })}
                  placeholder="Risk owner"
                />
              </div>
              <div>
                <Label htmlFor="assigned_to">Assigned To</Label>
                <OwnerSelectInput formData={form} setFormData={setForm} fieldName="assigned_to" />
                {/* <Input
                  id="assigned_to"
                  value={form.assigned_to}
                  onChange={(e) => setForm({ ...form, assigned_to: e.target.value })}
                  placeholder="Assigned person"
                /> */}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="start_date">Start Date</Label>
                <Input
                  id="start_date"
                  type="date"
                  value={form.start_date}
                  onChange={(e) => setForm({ ...form, start_date: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="target_completion_date">Target Completion Date</Label>
                <Input
                  id="target_completion_date"
                  type="date"
                  value={form.target_completion_date}
                  onChange={(e) => setForm({ ...form, target_completion_date: e.target.value })}
                />
              </div>
            </div>

            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Create Plan</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <div className="text-sm text-gray-600">
        <p>Total Treatment Plans: {treatmentPlans.length}</p>
        <p>Available Risks: {risks.length}</p>
      </div>
    </div>
  )
}

function FairRiskForm({
  isOpen,
  onClose,
  onSubmit,
  editingRisk,
}: {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: any) => Promise<void>
  editingRisk?: FairRisk | null
}) {
  const [loading, setLoading] = useState(false)
  const [assets, setAssets] = useState<Asset[]>([])
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    asset_id: "",
    threat_actor: "",
    threat_capability: 5,
    threat_motivation: 5,
    control_strength: 5,
    vulnerability_score: 5,
    loss_event_frequency_min: 0,
    loss_event_frequency_most_likely: 0,
    loss_event_frequency_max: 0,
    primary_loss_min: 0,
    primary_loss_most_likely: 0,
    primary_loss_max: 0,
    secondary_loss_min: 0,
    secondary_loss_most_likely: 0,
    secondary_loss_max: 0,
    annual_loss_expectancy: 0,
    risk_tolerance: 0,
    treatment_plan: "",
    treatment_status: "identified",
    treatment_due_date: "",
  })
  const { toast } = useToast()

  useEffect(() => {
    const fetchAssets = async () => {
      try {
        const response = await fetch("/api/assets")
        if (response.ok) {
          const assetsData = await response.json()
          setAssets(Array.isArray(assetsData) ? assetsData : [])
        } else {
          setAssets([])
        }
      } catch (error) {
        console.error("Failed to fetch assets:", error)
        setAssets([])
      }
    }
    fetchAssets()
  }, [])

  useEffect(() => {
    if (editingRisk) {
      setFormData({
        title: editingRisk.title || "",
        description: editingRisk.description || "",
        asset_id: editingRisk.asset_id || "",
        threat_actor: editingRisk.threat_actor || "",
        threat_capability: editingRisk.threat_capability || 5,
        threat_motivation: editingRisk.threat_motivation || 5,
        control_strength: editingRisk.control_strength || 5,
        vulnerability_score: editingRisk.vulnerability_score || 5,
        loss_event_frequency_min: editingRisk.loss_event_frequency_min || 0,
        loss_event_frequency_most_likely: editingRisk.loss_event_frequency_most_likely || 0,
        loss_event_frequency_max: editingRisk.loss_event_frequency_max || 0,
        primary_loss_min: editingRisk.primary_loss_min || 0,
        primary_loss_most_likely: editingRisk.primary_loss_most_likely || 0,
        primary_loss_max: editingRisk.primary_loss_max || 0,
        secondary_loss_min: editingRisk.secondary_loss_min || 0,
        secondary_loss_most_likely: editingRisk.secondary_loss_most_likely || 0,
        secondary_loss_max: editingRisk.secondary_loss_max || 0,
        annual_loss_expectancy: editingRisk.annual_loss_expectancy || 0,
        risk_tolerance: editingRisk.risk_tolerance || 0,
        treatment_plan: editingRisk.treatment_plan || "",
        treatment_status: editingRisk.treatment_status || "identified",
        treatment_due_date: editingRisk.treatment_due_date ? editingRisk.treatment_due_date.split("T")[0] : "",
      })
    } else {
      setFormData({
        title: "",
        description: "",
        asset_id: "",
        threat_actor: "",
        threat_capability: 5,
        threat_motivation: 5,
        control_strength: 5,
        vulnerability_score: 5,
        loss_event_frequency_min: 0,
        loss_event_frequency_most_likely: 0,
        loss_event_frequency_max: 0,
        primary_loss_min: 0,
        primary_loss_most_likely: 0,
        primary_loss_max: 0,
        secondary_loss_min: 0,
        secondary_loss_most_likely: 0,
        secondary_loss_max: 0,
        annual_loss_expectancy: 0,
        risk_tolerance: 0,
        treatment_plan: "",
        treatment_status: "identified",
        treatment_due_date: "",
      })
    }
  }, [editingRisk, isOpen])

  useEffect(() => {
    const calculateALE = () => {
      const frequency = formData.loss_event_frequency_most_likely || 0
      const primaryLoss = formData.primary_loss_most_likely || 0
      const secondaryLoss = formData.secondary_loss_most_likely || 0
      const ale = frequency * (primaryLoss + secondaryLoss)

      setFormData((prev) => ({
        ...prev,
        annual_loss_expectancy: ale,
      }))
    }

    calculateALE()
  }, [
    formData.loss_event_frequency_most_likely,
    formData.primary_loss_most_likely,
    formData.secondary_loss_most_likely,
  ])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.title.trim()) {
      toast({
        title: "Validation Error",
        description: "Title is required",
        variant: "destructive",
      })
      return
    }

    setLoading(true)
    try {
      await onSubmit(formData)
      onClose()
      toast({
        title: "Success",
        description: `FAIR risk ${editingRisk ? "updated" : "created"} successfully`,
      })
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || `Failed to ${editingRisk ? "update" : "create"} FAIR risk`,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const getRiskLevel = () => {
    const ale = formData.annual_loss_expectancy
    if (ale >= 1000000) return { level: "Critical", color: "bg-red-100 text-red-800" }
    if (ale >= 500000) return { level: "High", color: "bg-orange-100 text-orange-800" }
    if (ale >= 100000) return { level: "Medium", color: "bg-yellow-100 text-yellow-800" }
    return { level: "Low", color: "bg-green-100 text-green-800" }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const riskLevel = getRiskLevel()

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            {editingRisk ? "Edit FAIR Risk" : "Create FAIR Risk"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Tabs defaultValue="basic" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="basic">Basic Info</TabsTrigger>
              <TabsTrigger value="threat">Threat Analysis</TabsTrigger>
              <TabsTrigger value="loss">Loss Magnitude</TabsTrigger>
              <TabsTrigger value="summary">Summary</TabsTrigger>
            </TabsList>

            <TabsContent value="basic" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Basic Information</CardTitle>
                  <CardDescription>Provide basic details about the risk scenario</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="title">Risk Title *</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                      placeholder="e.g., Data breach via phishing attack"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                      placeholder="Detailed description of the risk scenario"
                      rows={3}
                    />
                  </div>

                  <div>
                    <Label htmlFor="asset_id">Asset</Label>
                    <Select
                      value={formData.asset_id}
                      onValueChange={(value) => setFormData((prev) => ({ ...prev, asset_id: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select an asset" />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.isArray(assets) &&
                          assets.map((asset) => (
                            <SelectItem key={asset.id} value={asset.id}>
                              {asset.name} ({asset.type})
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="threat_actor">Threat Actor</Label>
                    <Input
                      id="threat_actor"
                      value={formData.threat_actor}
                      onChange={(e) => setFormData((prev) => ({ ...prev, threat_actor: e.target.value }))}
                      placeholder="e.g., External hacker, Insider threat, Nation state"
                    />
                  </div>

                  <div>
                    <Label htmlFor="treatment_status">Treatment Status</Label>
                    <Select
                      value={formData.treatment_status}
                      onValueChange={(value) => setFormData((prev) => ({ ...prev, treatment_status: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="identified">Identified</SelectItem>
                        <SelectItem value="assessed">Assessed</SelectItem>
                        <SelectItem value="treated">Treated</SelectItem>
                        <SelectItem value="monitored">Monitored</SelectItem>
                        <SelectItem value="accepted">Accepted</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="threat" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Threat Analysis</CardTitle>
                  <CardDescription>Assess threat capability, motivation, and control effectiveness</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <Label>Threat Capability (1-10)</Label>
                    <div className="px-3 py-2">
                      <Slider
                        value={[formData.threat_capability]}
                        onValueChange={(value) => setFormData((prev) => ({ ...prev, threat_capability: value[0] }))}
                        max={10}
                        min={1}
                        step={1}
                        className="w-full"
                      />
                      <div className="flex justify-between text-sm text-gray-500 mt-1">
                        <span>Low (1)</span>
                        <span className="font-medium">{formData.threat_capability}</span>
                        <span>High (10)</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <Label>Threat Motivation (1-10)</Label>
                    <div className="px-3 py-2">
                      <Slider
                        value={[formData.threat_motivation]}
                        onValueChange={(value) => setFormData((prev) => ({ ...prev, threat_motivation: value[0] }))}
                        max={10}
                        min={1}
                        step={1}
                        className="w-full"
                      />
                      <div className="flex justify-between text-sm text-gray-500 mt-1">
                        <span>Low (1)</span>
                        <span className="font-medium">{formData.threat_motivation}</span>
                        <span>High (10)</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <Label>Control Strength (1-10)</Label>
                    <div className="px-3 py-2">
                      <Slider
                        value={[formData.control_strength]}
                        onValueChange={(value) => setFormData((prev) => ({ ...prev, control_strength: value[0] }))}
                        max={10}
                        min={1}
                        step={1}
                        className="w-full"
                      />
                      <div className="flex justify-between text-sm text-gray-500 mt-1">
                        <span>Weak (1)</span>
                        <span className="font-medium">{formData.control_strength}</span>
                        <span>Strong (10)</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <Label>Vulnerability Score (1-10)</Label>
                    <div className="px-3 py-2">
                      <Slider
                        value={[formData.vulnerability_score]}
                        onValueChange={(value) => setFormData((prev) => ({ ...prev, vulnerability_score: value[0] }))}
                        max={10}
                        min={1}
                        step={1}
                        className="w-full"
                      />
                      <div className="flex justify-between text-sm text-gray-500 mt-1">
                        <span>Low (1)</span>
                        <span className="font-medium">{formData.vulnerability_score}</span>
                        <span>High (10)</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="loss" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Loss Event Frequency</CardTitle>
                  <CardDescription>Estimate how often this loss event might occur per year</CardDescription>
                </CardHeader>
                <CardContent className="grid grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="freq_min">Minimum</Label>
                    <Input
                      id="freq_min"
                      type="number"
                      step="0.1"
                      min="0"
                      value={formData.loss_event_frequency_min}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          loss_event_frequency_min: Number.parseFloat(e.target.value) || 0,
                        }))
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="freq_likely">Most Likely</Label>
                    <Input
                      id="freq_likely"
                      type="number"
                      step="0.1"
                      min="0"
                      value={formData.loss_event_frequency_most_likely}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          loss_event_frequency_most_likely: Number.parseFloat(e.target.value) || 0,
                        }))
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="freq_max">Maximum</Label>
                    <Input
                      id="freq_max"
                      type="number"
                      step="0.1"
                      min="0"
                      value={formData.loss_event_frequency_max}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          loss_event_frequency_max: Number.parseFloat(e.target.value) || 0,
                        }))
                      }
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Primary Loss Magnitude</CardTitle>
                  <CardDescription>Direct financial impact (USD)</CardDescription>
                </CardHeader>
                <CardContent className="grid grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="primary_min">Minimum</Label>
                    <Input
                      id="primary_min"
                      type="number"
                      min="0"
                      value={formData.primary_loss_min}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          primary_loss_min: Number.parseFloat(e.target.value) || 0,
                        }))
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="primary_likely">Most Likely</Label>
                    <Input
                      id="primary_likely"
                      type="number"
                      min="0"
                      value={formData.primary_loss_most_likely}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          primary_loss_most_likely: Number.parseFloat(e.target.value) || 0,
                        }))
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="primary_max">Maximum</Label>
                    <Input
                      id="primary_max"
                      type="number"
                      min="0"
                      value={formData.primary_loss_max}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          primary_loss_max: Number.parseFloat(e.target.value) || 0,
                        }))
                      }
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Secondary Loss Magnitude</CardTitle>
                  <CardDescription>Indirect costs like reputation damage, regulatory fines (USD)</CardDescription>
                </CardHeader>
                <CardContent className="grid grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="secondary_min">Minimum</Label>
                    <Input
                      id="secondary_min"
                      type="number"
                      min="0"
                      value={formData.secondary_loss_min}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          secondary_loss_min: Number.parseFloat(e.target.value) || 0,
                        }))
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="secondary_likely">Most Likely</Label>
                    <Input
                      id="secondary_likely"
                      type="number"
                      min="0"
                      value={formData.secondary_loss_most_likely}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          secondary_loss_most_likely: Number.parseFloat(e.target.value) || 0,
                        }))
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="secondary_max">Maximum</Label>
                    <Input
                      id="secondary_max"
                      type="number"
                      min="0"
                      value={formData.secondary_loss_max}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          secondary_loss_max: Number.parseFloat(e.target.value) || 0,
                        }))
                      }
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="summary" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calculator className="h-5 w-5" />
                    Risk Assessment Summary
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 bg-gradient-to-br from-green-900 to-green-800 border-green-300 rounded-lg text-white font-bold">
                        <div className="flex items-center gap-2">
                          <TrendingUp className="h-5 w-5 text-blue-400" />
                          <span className="font-medium">Annual Loss Expectancy</span>
                        </div>
                        <span className="text-2xl font-bold text-blue-400">
                          {formatCurrency(formData.annual_loss_expectancy)}
                        </span>
                      </div>

                      <div className="flex items-center justify-between p-4 bg-gradient-to-br from-orange-500 to-orange-600 border-green-200 rounded-lg text-white font-bold">
                        <span className="font-medium">Risk Level</span>
                        <Badge variant="outline" className={riskLevel.color}>{riskLevel.level}</Badge>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="p-4 bg-gradient-to-br from-blue-900 to-blue-800 border-green-200 text-white rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <AlertTriangle className="h-4 w-4 text-orange-600" />
                          <span className="font-medium">Threat Assessment</span>
                        </div>
                        <div className="space-y-1 text-sm">
                          <div className="flex justify-between">
                            <span>Capability:</span>
                            <span className="font-medium">{formData.threat_capability}/10</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Motivation:</span>
                            <span className="font-medium">{formData.threat_motivation}/10</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Control Strength:</span>
                            <span className="font-medium">{formData.control_strength}/10</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Vulnerability:</span>
                            <span className="font-medium">{formData.vulnerability_score}/10</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="risk_tolerance">Risk Tolerance (USD)</Label>
                      <Input
                        id="risk_tolerance"
                        type="number"
                        min="0"
                        value={formData.risk_tolerance}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            risk_tolerance: Number.parseFloat(e.target.value) || 0,
                          }))
                        }
                        placeholder="Maximum acceptable loss"
                      />
                    </div>

                    <div>
                      <Label htmlFor="treatment_plan">Treatment Plan</Label>
                      <Textarea
                        id="treatment_plan"
                        value={formData.treatment_plan}
                        onChange={(e) => setFormData((prev) => ({ ...prev, treatment_plan: e.target.value }))}
                        placeholder="Describe the risk treatment approach"
                        rows={3}
                      />
                    </div>

                    <div>
                      <Label htmlFor="treatment_due_date">Treatment Due Date</Label>
                      <Input
                        id="treatment_due_date"
                        type="date"
                        value={formData.treatment_due_date}
                        onChange={(e) => setFormData((prev) => ({ ...prev, treatment_due_date: e.target.value }))}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : editingRisk ? (
                "Update Risk"
              ) : (
                "Create Risk"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default function FairRiskAnalysisPage() {
  const [risks, setRisks] = useState<FairRisk[]>([])
  const [treatmentPlans, setTreatmentPlans] = useState<TreatmentPlan[]>([])
  const [treatmentStats, setTreatmentStats] = useState<TreatmentStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [retryCount, setRetryCount] = useState(0)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingRisk, setEditingRisk] = useState<FairRisk | null>(null)
  const [deleteRisk, setDeleteRisk] = useState<FairRisk | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  // Filter and search states
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [filterAsset, setFilterAsset] = useState("all")
  const [filterThreatActor, setFilterThreatActor] = useState("all")
  const [filterRiskLevel, setFilterRiskLevel] = useState("all")
  const [sortField, setSortField] = useState<SortField>("updated_at")
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc")
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(10)

  const { toast } = useToast()

  useEffect(() => {
    fetchData()
  }, [])

  // Reset pagination when filters change
  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm, filterStatus, filterAsset, filterThreatActor, filterRiskLevel])

  const fetchData = async () => {
    try {
      setLoading(true)
      setError(null)

      const params = new URLSearchParams({
        limit: "50",
        treatment_status: "all",
      })

      const risksResponse = await fetch(`/api/fair-risks?${params.toString()}`)
      if (!risksResponse.ok) {
        throw new Error(`Failed to fetch FAIR risks: ${risksResponse.statusText}`)
      }
      const risksData: FairRisk[] = await risksResponse.json()
      const validRisks = risksData.filter(
        (risk) => risk.id != null && risk.risk_id && risk.title && risk.risk_id !== "",
      )
      setRisks(validRisks)

      const treatmentResponse = await fetch(`/api/fair-risks/treatment-plans?${params.toString()}`)
      if (!treatmentResponse.ok) {
        throw new Error(`Failed to fetch treatment plans: ${treatmentResponse.statusText}`)
      }
      const treatmentData = await treatmentResponse.json()
      const validPlans =
        treatmentData.plans?.filter(
          (plan: TreatmentPlan) =>
            plan.id != null && plan.risk_id && plan.owner && plan.risk_id !== "" && plan.owner !== "",
        ) || []
      setTreatmentPlans(validPlans)
      setTreatmentStats(treatmentData.stats || null)
    } catch (err: any) {
      console.error("Fetch error:", err.message, err.stack)
      if (retryCount < 3) {
        setTimeout(
          () => {
            setRetryCount(retryCount + 1)
            fetchData()
          },
          2000 * (retryCount + 1),
        )
        toast({
          title: "Retrying",
          description: `Retrying data fetch (attempt ${retryCount + 2}/3)...`,
        })
      } else {
        setError(err instanceof Error ? err.message : "An error occurred while fetching data")
        toast({
          title: "Error",
          description: "Failed to load data after retries",
          variant: "destructive",
        })
      }
    } finally {
      if (retryCount === 0) {
        setLoading(false)
      }
    }
  }

  // Get unique values for filters
  const uniqueAssets = useMemo(() => {
    const assets = risks.map((risk) => risk.asset_id).filter((asset): asset is string => asset !== null && asset !== "")
    return [...new Set(assets)].sort()
  }, [risks])

  const uniqueThreatActors = useMemo(() => {
    const actors = risks
      .map((risk) => risk.threat_actor)
      .filter((actor): actor is string => actor !== null && actor !== "")
    return [...new Set(actors)].sort()
  }, [risks])

  const uniqueStatuses = useMemo(() => {
    const statuses = risks
      .map((risk) => risk.treatment_status)
      .filter((status): status is string => status !== null && status !== "")
    return [...new Set(statuses)].sort()
  }, [risks])

  // Get risk level based on ALE
  const getRiskLevel = (ale: number | null) => {
    if (!ale) return "Unknown"
    if (ale >= 1000000) return "Critical"
    if (ale >= 500000) return "High"
    if (ale >= 100000) return "Medium"
    return "Low"
  }

  // Filter and sort risks
  const filteredAndSortedRisks = useMemo(() => {
    const filtered = risks.filter((risk) => {
      const matchesSearch =
        !searchTerm ||
        risk.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        risk.risk_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (risk.description && risk.description.toLowerCase().includes(searchTerm.toLowerCase()))

      const matchesStatus = filterStatus === "all" || risk.treatment_status === filterStatus
      const matchesAsset = filterAsset === "all" || risk.asset_id === filterAsset
      const matchesThreatActor = filterThreatActor === "all" || risk.threat_actor === filterThreatActor
      const matchesRiskLevel =
        filterRiskLevel === "all" || getRiskLevel(risk.annual_loss_expectancy) === filterRiskLevel

      return matchesSearch && matchesStatus && matchesAsset && matchesThreatActor && matchesRiskLevel
    })

    // Sort risks
    filtered.sort((a, b) => {
      let aValue: any = a[sortField]
      let bValue: any = b[sortField]

      // Handle null values
      if (aValue === null) aValue = sortField === "annual_loss_expectancy" ? 0 : ""
      if (bValue === null) bValue = sortField === "annual_loss_expectancy" ? 0 : ""

      // Handle different data types
      if (sortField === "annual_loss_expectancy") {
        aValue = Number(aValue) || 0
        bValue = Number(bValue) || 0
      } else if (sortField === "updated_at") {
        aValue = new Date(aValue).getTime()
        bValue = new Date(bValue).getTime()
      } else {
        aValue = String(aValue).toLowerCase()
        bValue = String(bValue).toLowerCase()
      }

      if (aValue < bValue) return sortDirection === "asc" ? -1 : 1
      if (aValue > bValue) return sortDirection === "asc" ? 1 : -1
      return 0
    })

    return filtered
  }, [risks, searchTerm, filterStatus, filterAsset, filterThreatActor, filterRiskLevel, sortField, sortDirection])

  // Pagination
  const totalPages = Math.ceil(filteredAndSortedRisks.length / itemsPerPage)
  const paginatedRisks = filteredAndSortedRisks.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) return <ArrowUpDown className="h-4 w-4" />
    return sortDirection === "asc" ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />
  }

  const clearAllFilters = () => {
    setSearchTerm("")
    setFilterStatus("all")
    setFilterAsset("all")
    setFilterThreatActor("all")
    setFilterRiskLevel("all")
    setCurrentPage(1)
  }

  const activeFiltersCount = [
    searchTerm,
    filterStatus !== "all" ? filterStatus : null,
    filterAsset !== "all" ? filterAsset : null,
    filterThreatActor !== "all" ? filterThreatActor : null,
    filterRiskLevel !== "all" ? filterRiskLevel : null,
  ].filter(Boolean).length

  const handleCreateRisk = async (riskData: any) => {
    try {
      const response = await fetch("/api/fair-risks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(riskData),
      })

      if (!response.ok) {
        throw new Error("Failed to create FAIR risk")
      }

      await fetchData()
      toast({
        title: "Success",
        description: "FAIR risk created successfully",
      })
    } catch (error: any) {
      toast({
        title: "Error",
        description: `Failed to create FAIR risk: ${error.message}`,
        variant: "destructive",
      })
      throw error
    }
  }

  const handleEditRisk = async (riskData: any) => {
    if (!editingRisk) return

    try {
      const response = await fetch(`/api/fair-risks/${editingRisk.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(riskData),
      })

      if (!response.ok) {
        throw new Error("Failed to update FAIR risk")
      }

      await fetchData()
      setEditingRisk(null)
      toast({
        title: "Success",
        description: "FAIR risk updated successfully",
      })
    } catch (error: any) {
      toast({
        title: "Error",
        description: `Failed to update FAIR risk: ${error.message}`,
        variant: "destructive",
      })
      throw error
    }
  }

  const handleDeleteRisk = async () => {
    if (!deleteRisk) return

    setIsDeleting(true)
    try {
      const response = await fetch(`/api/fair-risks/${deleteRisk.id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to delete FAIR risk")
      }

      await fetchData()
      setDeleteRisk(null)
      toast({
        title: "Success",
        description: "FAIR risk deleted successfully",
      })
    } catch (error: any) {
      toast({
        title: "Error",
        description: `Failed to delete FAIR risk: ${error.message}`,
        variant: "destructive",
      })
    } finally {
      setIsDeleting(false)
    }
  }

  const getRiskLevelColor = (level: string) => {
    switch (level) {
      case "Critical":
        return "text-red-500"
      case "High":
        return "text-orange-900"
      case "Medium":
        return "text-yellow-600"
      case "Low":
        return "text-purple-900"
      default:
        return "text-blue-900"
    }
  }

  const getStatusColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case "approved":
        return "text-green-500"
      case "pending":
        return "text-yellow-900"
      case "rejected":
        return "text-red-500"
      case "completed":
        return "text-green-900"
      case "in_progress":
      case "in-progress":
        return "text-purple-900"
      default:
        return "text-blue-500"
    }
  }

  // const getStatusColor = (status: string) => {
  //   switch (status.toLowerCase()) {
  //     case "approved":
  //       return "bg-green-100 text-green-800"
  //     case "pending":
  //       return "bg-yellow-100 text-yellow-800"
  //     case "rejected":
  //       return "bg-red-100 text-red-800"
  //     case "completed":
  //       return "bg-blue-100 text-blue-800"
  //     case "in_progress":
  //       return "bg-purple-100 text-purple-800"
  //     default:
  //       return "bg-gray-100 text-gray-800"
  //   }
  // }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString || isNaN(Date.parse(dateString))) return "N/A"
    return new Date(dateString).toLocaleDateString()
  }

  // Aggregated metrics for animated assessment dashboard
  const totalRisks = risks.length
  const totalALE = useMemo(
    () => risks.reduce((sum, r) => sum + (r.annual_loss_expectancy || 0), 0),
    [risks],
  )
  const avgALE = useMemo(() => (totalRisks > 0 ? totalALE / totalRisks : 0), [totalALE, totalRisks])
  const levelCounts = useMemo(() => {
    const counts: Record<string, number> = { Critical: 0, High: 0, Medium: 0, Low: 0 }
    risks.forEach((r) => {
      const lvl = getRiskLevel(r.annual_loss_expectancy)
      if (counts[lvl] !== undefined) counts[lvl] += 1
    })
    return counts
  }, [risks])
  const statusCounts = useMemo(() => {
    const counts = new Map<string, number>()
    risks.forEach((r) => {
      const s = (r.treatment_status || "unknown").toString()
      counts.set(s, (counts.get(s) || 0) + 1)
    })
    return Array.from(counts.entries()).sort((a, b) => b[1] - a[1])
  }, [risks])
  const frequencyBuckets = useMemo(() => {
    const buckets: { label: string; count: number }[] = [
      { label: "<= 1 / yr", count: 0 },
      { label: "1 - 5 / yr", count: 0 },
      { label: "5 - 10 / yr", count: 0 },
      { label: "> 10 / yr", count: 0 },
    ]
    risks.forEach((r) => {
      const f = Number(r.loss_event_frequency_most_likely) || 0
      if (f <= 1) buckets[0].count += 1
      else if (f <= 5) buckets[1].count += 1
      else if (f <= 10) buckets[2].count += 1
      else buckets[3].count += 1
    })
    return buckets
  }, [risks])
  const topAleRisks = useMemo(
    () =>
      [...risks]
        .sort((a, b) => (b.annual_loss_expectancy || 0) - (a.annual_loss_expectancy || 0))
        .slice(0, 5),
    [risks],
  )

  if (loading) {
    return (
      <main className="flex-1 overflow-y-auto">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <Loader2 className="animate-spin h-12 w-12 text-blue-600 mx-auto" />
            <p className="mt-4 text-gray-300">Loading FAIR risk analysis...</p>
          </div>
        </div>
      </main>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-950 relative overflow-hidden">
        <div className="light-rays-bg animate-light-rays opacity-30"></div>
        <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"></div>
        <div className="flex h-screen relative z-10">
          {/* <Sidebar /> */}
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* <Header /> */}
            <main className="flex-1 overflow-y-auto p-6">
              <Card className="border-red-200 bg-red-50">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-2 text-red-800">
                    <AlertTriangle className="h-5 w-5" />
                    <span>Error: {error}</span>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setRetryCount(0)
                        fetchData()
                      }}
                    >
                      Retry
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </main>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-transparent">
      {/* <Sidebar /> */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* <Header /> */}
        <main className="flex-1 overflow-y-auto p-6">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold  animate-pulse">
                  FAIR Risk Analysis
                </h1>
                <p className="text-gray-300 mt-2">
                  Factor Analysis of Information Risk (FAIR) quantitative risk assessment
                </p>
              </div>
              <div className="flex gap-2">
                <FairRiskImportExport onImportComplete={fetchData} currentFilters={{ treatment_status: "all" }} />

                <Button
                  onClick={() => setIsFormOpen(true)}
                >
                  Create FAIR Risk
                </Button>
              </div>
            </div>

            <Tabs defaultValue="assessment" className="space-y-6">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="assessment">Dashboard</TabsTrigger>
                <TabsTrigger value="register">Risk Register</TabsTrigger>
                <TabsTrigger value="treatment">Treatment Plans</TabsTrigger>
              </TabsList>

              <TabsContent value="assessment" className="space-y-6">
                {/* Summary cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <Card className="animate-in fade-in slide-in-from-bottom-2 duration-500">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm">Total Risks</CardTitle>
                      <CardDescription>Count of FAIR risks</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold">{totalRisks}</div>
                    </CardContent>
                  </Card>

                  <Card className="animate-in fade-in slide-in-from-bottom-2 duration-500 delay-100">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm">Total ALE</CardTitle>
                      <CardDescription>Annual Loss Expectancy</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold">{formatCurrency(totalALE)}</div>
                    </CardContent>
                  </Card>

                  <Card className="animate-in fade-in slide-in-from-bottom-2 duration-500 delay-200">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm">Average ALE</CardTitle>
                      <CardDescription>Per risk</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold">{formatCurrency(avgALE)}</div>
                    </CardContent>
                  </Card>

                  <Card className="animate-in fade-in slide-in-from-bottom-2 duration-500 delay-300">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm">Critical Risks</CardTitle>
                      <CardDescription>Immediate attention</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold text-red-600">{levelCounts.Critical}</div>
                    </CardContent>
                  </Card>
                </div>

                {/* Distributions */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Card className="animate-in fade-in duration-700">
                    <CardHeader>
                      <CardTitle>Risk Levels</CardTitle>
                      <CardDescription>Distribution by ALE tiers</CardDescription>
                    </CardHeader>
                    <CardContent>
                      {["Critical", "High", "Medium", "Low"].map((lvl) => {
                        const v = (levelCounts as any)[lvl] || 0
                        return (
                          <div key={lvl} className="mb-2">
                            <div className="flex justify-between text-xs mb-1"><span>{lvl}</span><span>{v}</span></div>
                            <Progress value={(v / Math.max(1, totalRisks)) * 100} className="h-2" />
                          </div>
                        )
                      })}
                    </CardContent>
                  </Card>

                  <Card className="animate-in fade-in duration-700 delay-100">
                    <CardHeader>
                      <CardTitle>Status</CardTitle>
                      <CardDescription>Treatment status mix</CardDescription>
                    </CardHeader>
                    <CardContent>
                      {statusCounts.slice(0, 5).map(([name, count]) => (
                        <div key={name} className="mb-2">
                          <div className="flex justify-between text-xs mb-1"><span>{name}</span><span>{count}</span></div>
                          <Progress value={(count / Math.max(1, totalRisks)) * 100} className="h-2" />
                        </div>
                      ))}
                    </CardContent>
                  </Card>

                  <Card className="animate-in fade-in duration-700 delay-200">
                    <CardHeader>
                      <CardTitle>Frequency</CardTitle>
                      <CardDescription>Most likely events / year</CardDescription>
                    </CardHeader>
                    <CardContent>
                      {frequencyBuckets.map((b) => (
                        <div key={b.label} className="mb-2">
                          <div className="flex justify-between text-xs mb-1"><span>{b.label}</span><span>{b.count}</span></div>
                          <Progress value={(b.count / Math.max(1, totalRisks)) * 100} className="h-2" />
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                </div>

                {/* ALE by risks */}
                <Card className="animate-in fade-in duration-700">
                  <CardHeader>
                    <CardTitle>Top Risks by ALE</CardTitle>
                    <CardDescription>Highest annualized loss expectations</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Risk ID</TableHead>
                            <TableHead>Title</TableHead>
                            <TableHead className="text-right">ALE</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {topAleRisks.map((r) => (
                            <TableRow key={r.id}>
                              <TableCell className="font-mono text-xs">{r.risk_id}</TableCell>
                              <TableCell className="truncate max-w-[420px]">{r.title}</TableCell>
                              <TableCell className="text-right font-semibold">{formatCurrency(r.annual_loss_expectancy || 0)}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="register" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <h1 className="text-lg font-bold text-cyan-300">Total Risks</h1>
                          <p className="text-2xl font-bold text-blue-900">{risks.length}</p>
                        </div>
                        <Shield className="h-8 w-8 text-blue-600" />
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <h1 className="text-lg font-bold text-cyan-300">Critical Risks</h1>
                          <p className="text-2xl font-bold text-red-900">
                            {risks.filter((r) => getRiskLevel(r.annual_loss_expectancy) === "Critical").length}
                          </p>
                        </div>
                        <AlertTriangle className="h-8 w-8 text-red-600" />
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <h1 className="text-lg font-bold text-cyan-300">Total ALE</h1>
                          <p className="text-2xl font-bold text-green-900">
                            {formatCurrency(risks.reduce((sum, r) => sum + (r.annual_loss_expectancy || 0), 0))}
                          </p>
                        </div>
                        <DollarSign className="h-8 w-8 text-green-600" />
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <h1 className="text-lg font-bold text-cyan-300">Avg ALE</h1>
                          <p className="text-2xl font-bold text-purple-900">
                            {formatCurrency(
                              risks.length > 0
                                ? risks.reduce((sum, r) => sum + (r.annual_loss_expectancy || 0), 0) / risks.length
                                : 0,
                            )}
                          </p>
                        </div>
                        <TrendingUp className="h-8 w-8 text-purple-600" />
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card bg-transparent>
                    <CardHeader>
                      <CardTitle>Risk Heatmap</CardTitle>
                      <CardDescription>Visual representation of risk distribution</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <FairRiskHeatMap />
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Risk Management</CardTitle>
                      <CardDescription>Manage FAIR risk assessments and treatments</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <FairRiskTreatmentManager
                        risks={risks}
                        treatmentPlans={treatmentPlans}
                        onPlanCreated={fetchData}
                      />
                    </CardContent>
                  </Card>
                </div>

                {/* Search and Filter Controls */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Filter className="h-5 w-5" />
                      Search & Filter Controls
                      {activeFiltersCount > 0 && (
                        <Badge variant="secondary" className="ml-2">
                          {activeFiltersCount} active
                        </Badge>
                      )}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Search Bar */}
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        placeholder="Search by title, risk ID, or description..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>

                    {/* Filter Controls */}
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                      <div>
                        <Label htmlFor="status-filter">Status</Label>
                        <Select value={filterStatus} onValueChange={setFilterStatus}>
                          <SelectTrigger>
                            <SelectValue placeholder="All Statuses" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Statuses</SelectItem>
                            {uniqueStatuses.map((status) => (
                              <SelectItem key={status} value={status}>
                                {status.charAt(0).toUpperCase() + status.slice(1)}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label htmlFor="asset-filter">Asset</Label>
                        <Select value={filterAsset} onValueChange={setFilterAsset}>
                          <SelectTrigger>
                            <SelectValue placeholder="All Assets" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Assets</SelectItem>
                            {uniqueAssets.map((asset) => (
                              <SelectItem key={asset} value={asset}>
                                {asset}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label htmlFor="threat-actor-filter">Threat Actor</Label>
                        <Select value={filterThreatActor} onValueChange={setFilterThreatActor}>
                          <SelectTrigger>
                            <SelectValue placeholder="All Threat Actors" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Threat Actors</SelectItem>
                            {uniqueThreatActors.map((actor) => (
                              <SelectItem key={actor} value={actor}>
                                {actor}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label htmlFor="risk-level-filter">Risk Level</Label>
                        <Select value={filterRiskLevel} onValueChange={setFilterRiskLevel}>
                          <SelectTrigger>
                            <SelectValue placeholder="All Risk Levels" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Risk Levels</SelectItem>
                            <SelectItem value="Critical">Critical</SelectItem>
                            <SelectItem value="High">High</SelectItem>
                            <SelectItem value="Medium">Medium</SelectItem>
                            <SelectItem value="Low">Low</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="flex items-end">
                        <Button
                          variant="outline"
                          onClick={clearAllFilters}
                          disabled={activeFiltersCount === 0}
                          className="w-full bg-transparent"
                        >
                          <X className="h-4 w-4 mr-2" />
                          Clear All
                        </Button>
                      </div>
                    </div>

                    {/* Active Filters Summary */}
                    {activeFiltersCount > 0 && (
                      <div className="flex flex-wrap gap-2 pt-2 border-t">
                        <span className="text-sm text-gray-600">Active filters:</span>
                        {searchTerm && (
                          <Badge variant="secondary" className="text-xs">
                            Search: "{searchTerm}"
                          </Badge>
                        )}
                        {filterStatus !== "all" && (
                          <Badge variant="secondary" className="text-xs">
                            Status: {filterStatus}
                          </Badge>
                        )}
                        {filterAsset !== "all" && (
                          <Badge variant="secondary" className="text-xs">
                            Asset: {filterAsset}
                          </Badge>
                        )}
                        {filterThreatActor !== "all" && (
                          <Badge variant="secondary" className="text-xs">
                            Threat Actor: {filterThreatActor}
                          </Badge>
                        )}
                        {filterRiskLevel !== "all" && (
                          <Badge variant="secondary" className="text-xs">
                            Risk Level: {filterRiskLevel}
                          </Badge>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="p-4 pt-6 pb-6">
                    <CardTitle>FAIR Risk Register</CardTitle>
                    <CardDescription>
                      Comprehensive list of quantified risks using FAIR methodology
                      {filteredAndSortedRisks.length !== risks.length && (
                        <span className="ml-2 text-blue-600">
                          ({filteredAndSortedRisks.length} of {risks.length} risks shown)
                        </span>
                      )}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>
                              <Button
                                variant="ghost"
                                onClick={() => handleSort("risk_id")}
                                className="h-auto p-0 font-semibold hover:bg-transparent"
                              >
                                Risk ID {getSortIcon("risk_id")}
                              </Button>
                            </TableHead>
                            <TableHead>
                              <Button
                                variant="ghost"
                                onClick={() => handleSort("asset_id")}
                                className="h-auto p-0 font-semibold hover:bg-transparent"
                              >
                                Asset {getSortIcon("asset_id")}
                              </Button>
                            </TableHead>
                            <TableHead>
                              <Button
                                variant="ghost"
                                onClick={() => handleSort("title")}
                                className="h-auto p-0 font-semibold hover:bg-transparent"
                              >
                                Threat Event {getSortIcon("title")}
                              </Button>
                            </TableHead>
                            <TableHead>
                              <Button
                                variant="ghost"
                                onClick={() => handleSort("threat_actor")}
                                className="h-auto p-0 font-semibold hover:bg-transparent"
                              >
                                Threat Actor {getSortIcon("threat_actor")}
                              </Button>
                            </TableHead>
                            <TableHead>Loss Magnitude</TableHead>
                            <TableHead>Frequency</TableHead>
                            <TableHead>
                              <Button
                                variant="ghost"
                                onClick={() => handleSort("annual_loss_expectancy")}
                                className="h-auto p-0 font-semibold hover:bg-transparent"
                              >
                                ALE {getSortIcon("annual_loss_expectancy")}
                              </Button>
                            </TableHead>
                            <TableHead>Risk Level</TableHead>
                            <TableHead>
                              <Button
                                variant="ghost"
                                onClick={() => handleSort("treatment_status")}
                                className="h-auto p-0 font-semibold hover:bg-transparent"
                              >
                                Status {getSortIcon("treatment_status")}
                              </Button>
                            </TableHead>
                            <TableHead>
                              <Button
                                variant="ghost"
                                onClick={() => handleSort("updated_at")}
                                className="h-auto p-0 font-semibold hover:bg-transparent"
                              >
                                Last Updated {getSortIcon("updated_at")}
                              </Button>
                            </TableHead>
                            <TableHead className="text-center">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {paginatedRisks.map((risk) => (
                            <TableRow key={risk.id}>
                              <TableCell className="font-medium text-xs truncate">{risk.risk_id}</TableCell>
                              <TableCell className="font-medium text-xs truncate">{risk.asset_id || "N/A"}</TableCell>
                              <TableCell className="max-w-xs truncate">{risk.title}</TableCell>
                              <TableCell>{risk.threat_actor || "N/A"}</TableCell>
                              <TableCell>
                                {formatCurrency(risk.primary_loss_min || 0)} -{" "}
                                {formatCurrency(risk.primary_loss_max || 0)}
                              </TableCell>
                              <TableCell>
                                {risk.loss_event_frequency_min || 0} - {risk.loss_event_frequency_max || 0}
                              </TableCell>
                              <TableCell className="font-semibold">
                                {formatCurrency(risk.annual_loss_expectancy || 0)}
                              </TableCell>
                              <TableCell className="truncate">
                                <Badge variant="outline" className={getRiskLevelColor(getRiskLevel(risk.annual_loss_expectancy))}>
                                  {getRiskLevel(risk.annual_loss_expectancy)}
                                </Badge>
                              </TableCell>
                              <TableCell className="truncate">
                                <Badge variant="outline" className={getStatusColor(risk.treatment_status || "unknown")}>
                                  {risk.treatment_status || "Unknown"}
                                </Badge>
                              </TableCell>
                              <TableCell>{formatDate(risk.updated_at)}</TableCell>
                              <TableCell>
                                <div className="flex space-x-2">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => {
                                      setEditingRisk(risk)
                                      setIsFormOpen(true)
                                    }}
                                  >
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setDeleteRisk(risk)}
                                    className="text-red-400 hover:bg-red-900/20 hover:text-red-300 dark:text-red-400 dark:hover:bg-red-900/20 dark:hover:text-red-300"
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

                    {/* Pagination */}
                    {totalPages > 1 && (
                      <div className="flex items-center justify-between mt-4">
                        <div className="text-sm text-gray-600">
                          Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
                          {Math.min(currentPage * itemsPerPage, filteredAndSortedRisks.length)} of{" "}
                          {filteredAndSortedRisks.length} risks
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setCurrentPage(currentPage - 1)}
                            disabled={currentPage === 1}
                          >
                            Previous
                          </Button>
                          <span className="text-sm">
                            Page {currentPage} of {totalPages}
                          </span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setCurrentPage(currentPage + 1)}
                            disabled={currentPage === totalPages}
                          >
                            Next
                          </Button>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="treatment" className="space-y-6">
                {treatmentStats && (
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                    <Card>
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <h1 className="text-lg font-bold text-cyan-300">Total Plans</h1>
                            <p className="text-2xl font-bold text-blue-900">{treatmentStats.total_plans}</p>
                          </div>
                          <Shield className="h-8 w-8 text-blue-600" />
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <h1 className="text-lg font-bold text-cyan-300">Pending Approval</h1>
                            <p className="text-2xl font-bold text-yellow-900">{treatmentStats.pending_approval}</p>
                          </div>
                          <Clock className="h-8 w-8 text-yellow-600" />
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <h1 className="text-lg font-bold text-cyan-300">Implemented</h1>
                            <p className="text-2xl font-bold text-green-900">{treatmentStats.implemented_plans}</p>
                          </div>
                          <CheckCircle className="h-8 w-8 text-green-600" />
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <h1 className="text-lg font-bold text-cyan-300">Total Investment</h1>
                            <p className="text-2xl font-bold text-purple-900">
                              {formatCurrency(treatmentStats.total_investment)}
                            </p>
                          </div>
                          <DollarSign className="h-8 w-8 text-purple-600" />
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                )}

                <Card>
                  <CardHeader>
                    <CardTitle>Treatment Plans</CardTitle>
                    <CardDescription>Risk treatment plans for FAIR-assessed risks</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Risk ID</TableHead>
                            <TableHead>Asset</TableHead>
                            <TableHead>Treatment Type</TableHead>
                            <TableHead>Strategy</TableHead>
                            <TableHead>Cost</TableHead>
                            <TableHead>Risk Reduction</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Progress</TableHead>
                            <TableHead>Owner</TableHead>
                            <TableHead>Target Date</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {treatmentPlans.map((plan) => (
                            <TableRow key={plan.id}>
                              <TableCell className="font-medium text-xs truncate">{plan.risk_id}</TableCell>
                              <TableCell className="font-medium text-xs truncate">{plan.asset_name || "N/A"}</TableCell>
                              <TableCell>
                                <Badge variant="outline" className="capitalize">
                                  {plan.treatment_type.replace("_", " ")}
                                </Badge>
                              </TableCell>
                              <TableCell className="max-w-xs truncate">{plan.treatment_strategy || "N/A"}</TableCell>
                              <TableCell>{formatCurrency(plan.estimated_cost)}</TableCell>
                              <TableCell>
                                <div className="flex items-center space-x-2">
                                  <span className="text-sm font-medium">{plan.expected_risk_reduction}%</span>
                                  <TrendingUp className="h-4 w-4 text-green-600" />
                                </div>
                              </TableCell>
                              <TableCell>
                                <Badge variant="outline" className={getStatusColor(plan.approval_status)}>
                                  {plan.approval_status.replace("_", " ")}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center space-x-2">
                                  <Progress
                                    value={
                                      isNaN(plan.progress_percentage)
                                        ? 0
                                        : Math.max(0, Math.min(100, plan.progress_percentage))
                                    }
                                    className="w-16"
                                  />
                                  <span className="text-sm text-gray-600">
                                    {isNaN(plan.progress_percentage)
                                      ? 0
                                      : Math.max(0, Math.min(100, plan.progress_percentage))}
                                    %
                                  </span>
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center space-x-2 truncate max-w-xs">
                                  <User className="h-4 w-4 text-gray-400" />
                                  <span className="text-sm">{plan.owner}</span>
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center space-x-2">
                                  <Calendar className="h-4 w-4 text-gray-400" />
                                  <span className="text-sm">{formatDate(plan.target_completion_date)}</span>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>

      <FairRiskForm
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false)
          setEditingRisk(null)
        }}
        onSubmit={editingRisk ? handleEditRisk : handleCreateRisk}
        editingRisk={editingRisk}
      />

      <AlertDialog open={!!deleteRisk} onOpenChange={() => setDeleteRisk(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete FAIR Risk</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete the risk "{deleteRisk?.title}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteRisk} className="bg-red-600 hover:bg-red-700" disabled={isDeleting}>
              {isDeleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
