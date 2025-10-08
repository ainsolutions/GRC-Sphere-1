"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { AlertTriangle, Calculator, Shield, TrendingUp } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface FairRiskFormProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: any) => Promise<void>
  editingRisk?: any
}

interface Asset {
  id: string
  name: string
  type: string
  criticality: string
}

export function FairRiskForm({ isOpen, onClose, onSubmit, editingRisk }: FairRiskFormProps) {
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

  // Load assets on component mount
  useEffect(() => {
    const fetchAssets = async () => {
      try {
        const response = await fetch("/api/assets/list")
        if (response.ok) {
          const assetsData = await response.json()
          setAssets(assetsData)
        }
      } catch (error) {
        console.error("Failed to fetch assets:", error)
      }
    }
    fetchAssets()
  }, [])

  // Populate form when editing
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
      // Reset form for new risk
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

  // Calculate ALE automatically
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
              <Card className="bg-slate-900/50 border-slate-700 backdrop-blur-sm">
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
                        {assets.map((asset) => (
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
                      <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                        <div className="flex items-center gap-2">
                          <TrendingUp className="h-5 w-5 text-blue-600" />
                          <span className="font-medium">Annual Loss Expectancy</span>
                        </div>
                        <span className="text-2xl font-bold text-blue-900">
                          {formatCurrency(formData.annual_loss_expectancy)}
                        </span>
                      </div>

                      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <span className="font-medium">Risk Level</span>
                        <Badge className={riskLevel.color}>{riskLevel.level}</Badge>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="p-4 bg-orange-50 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <AlertTriangle className="h-4 w-4 text-orange-600" />
                          <span className="font-medium text-orange-900">Threat Assessment</span>
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
              {loading ? "Saving..." : editingRisk ? "Update Risk" : "Create Risk"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
