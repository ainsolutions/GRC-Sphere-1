"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  Shield,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Clock,
  RefreshCw,
  FileText,
  TrendingUp,
  Users,
  Lock,
  CreditCard,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface SAMASelfAssessmentControl {
  id: number
  domain: string
  control_id: string
  control_name: string
  description: string
  implementation_status: string
  maturity_level: string
  evidence: string
  gaps_identified: string
  remediation_plan: string
  target_completion_date: string
  responsible_party: string
  last_reviewed: string
}

export function SAMASelfAssessment() {
  const [controls, setControls] = useState<SAMASelfAssessmentControl[]>([])
  const [selectedDomain, setSelectedDomain] = useState("all")
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const { toast } = useToast()

  const domains = [
    "Cybersecurity Governance",
    "Cybersecurity Defense",
    "Cybersecurity Resilience",
    "Third Party Cybersecurity",
    "Data Management and Privacy",
    "Technology Risk Management",
    "Incident Response",
    "Business Continuity",
    "Payment Systems Security",
  ]

  useEffect(() => {
    fetchSelfAssessmentControls()
  }, [])

  const fetchSelfAssessmentControls = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/sama-self-assessment/controls")
      if (response.ok) {
        const data = await response.json()
        setControls(data)
      }
    } catch (error) {
      console.error("Failed to fetch SAMA self-assessment controls:", error)
      toast({
        title: "Error",
        description: "Failed to load SAMA self-assessment controls",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const updateControl = async (controlId: number, updates: Partial<SAMASelfAssessmentControl>) => {
    setSaving(true)
    try {
      const response = await fetch("/api/sama-self-assessment/controls", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: controlId, ...updates }),
      })

      if (response.ok) {
        setControls((prev) => prev.map((control) => (control.id === controlId ? { ...control, ...updates } : control)))
        toast({
          title: "Success",
          description: "Control assessment updated successfully",
        })
      } else {
        throw new Error("Failed to update control")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update control assessment",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  const getImplementationStatusColor = (status: string) => {
    switch (status) {
      case "Implemented":
        return "bg-gradient-to-r from-green-500 to-teal-500 text-white"
      case "Partially Implemented":
        return "bg-gradient-to-r from-yellow-500 to-orange-500 text-white"
      case "Not Implemented":
        return "bg-gradient-to-r from-red-500 to-red-700 text-white"
      case "Not Applicable":
        return "bg-gradient-to-r from-gray-500 to-gray-600 text-white"
      default:
        return "bg-gradient-to-r from-gray-400 to-gray-500 text-white"
    }
  }

  const getMaturityColor = (level: string) => {
    switch (level) {
      case "Advanced":
        return "bg-gradient-to-r from-green-500 to-teal-500 text-white"
      case "Intermediate":
        return "bg-gradient-to-r from-blue-500 to-cyan-500 text-white"
      case "Basic":
        return "bg-gradient-to-r from-purple-500 to-blue-500 text-white"
      default:
        return "bg-gradient-to-r from-gray-400 to-gray-500 text-white"
    }
  }

  const getImplementationStatusIcon = (status: string) => {
    switch (status) {
      case "Implemented":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "Partially Implemented":
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />
      case "Not Implemented":
        return <XCircle className="h-4 w-4 text-red-600" />
      case "Not Applicable":
        return <Clock className="h-4 w-4 text-gray-600" />
      default:
        return <Clock className="h-4 w-4 text-gray-600" />
    }
  }

  const getDomainIcon = (domain: string) => {
    switch (domain) {
      case "Cybersecurity Governance":
        return <Shield className="h-5 w-5" />
      case "Cybersecurity Defense":
        return <Lock className="h-5 w-5" />
      case "Cybersecurity Resilience":
        return <RefreshCw className="h-5 w-5" />
      case "Third Party Cybersecurity":
        return <Users className="h-5 w-5" />
      case "Data Management and Privacy":
        return <FileText className="h-5 w-5" />
      case "Technology Risk Management":
        return <TrendingUp className="h-5 w-5" />
      case "Payment Systems Security":
        return <CreditCard className="h-5 w-5" />
      default:
        return <FileText className="h-5 w-5" />
    }
  }

  const filteredControls =
    selectedDomain === "all" ? controls : controls.filter((control) => control.domain === selectedDomain)

  const implementedCount = controls.filter((c) => c.implementation_status === "Implemented").length
  const partiallyImplementedCount = controls.filter((c) => c.implementation_status === "Partially Implemented").length
  const notImplementedCount = controls.filter((c) => c.implementation_status === "Not Implemented").length
  const compliancePercentage =
    controls.length > 0 ? Math.round(((implementedCount + partiallyImplementedCount * 0.5) / controls.length) * 100) : 0

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-green-600 via-blue-600 to-purple-600 bg-clip-text text-transparent">
            SAMA Self-Assessment
          </h2>
          <p className="text-muted-foreground">
            Conduct internal assessment of SAMA cybersecurity controls implementation
          </p>
        </div>
        <Button
          variant="outline"
          onClick={fetchSelfAssessmentControls}
          disabled={loading}
          
        >
          <RefreshCw className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent">
              Overall Compliance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{compliancePercentage}%</div>
            <Progress value={compliancePercentage} className="mt-2 h-2" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium bg-gradient-to-r from-green-600 to-green-700 bg-clip-text text-transparent">
              Implemented
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{implementedCount}</div>
            <p className="text-xs text-muted-foreground">Fully compliant controls</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent">
              Partially Implemented
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{partiallyImplementedCount}</div>
            <p className="text-xs text-muted-foreground">Needs improvement</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium bg-gradient-to-r from-red-600 to-red-700 bg-clip-text text-transparent">
              Not Implemented
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{notImplementedCount}</div>
            <p className="text-xs text-muted-foreground">Requires attention</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                SAMA Control Assessment
              </CardTitle>
              <CardDescription>Assess implementation status of SAMA cybersecurity controls</CardDescription>
            </div>
            <Select value={selectedDomain} onValueChange={setSelectedDomain}>
              <SelectTrigger className="w-64">
                <SelectValue placeholder="Select domain" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Domains</SelectItem>
                {domains.map((domain) => (
                  <SelectItem key={domain} value={domain}>
                    {domain}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center items-center py-8">
              <RefreshCw className="h-6 w-6 animate-spin text-green-600" />
              <span className="ml-2">Loading controls...</span>
            </div>
          ) : (
            <Tabs defaultValue="assessment" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="assessment">Control Assessment</TabsTrigger>
                <TabsTrigger value="summary">Domain Summary</TabsTrigger>
              </TabsList>

              <TabsContent value="assessment" className="space-y-4">
                <div className="space-y-4">
                  {filteredControls.map((control) => (
                      <Card key={control.id} className="border-cyan-200/50">
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center space-x-3">
                            {getImplementationStatusIcon(control.implementation_status)}
                            <div>
                              <div className="flex items-center space-x-2">
                                <Badge variant="outline" className="text-xs">
                                  {control.control_id}
                                </Badge>
                                <h3 className="font-semibold">{control.control_name}</h3>
                              </div>
                              <p className="text-sm text-muted-foreground mt-1">{control.description}</p>
                            </div>
                          </div>
                          <div className="flex flex-col space-y-2">
                            <Badge className={getImplementationStatusColor(control.implementation_status)}>
                              {control.implementation_status}
                            </Badge>
                            <Badge className={getMaturityColor(control.maturity_level)}>
                              {control.maturity_level || "Not Assessed"}
                            </Badge>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>Implementation Status</Label>
                            <Select
                              value={control.implementation_status}
                              onValueChange={(value) => updateControl(control.id, { implementation_status: value })}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Implemented">Implemented</SelectItem>
                                <SelectItem value="Partially Implemented">Partially Implemented</SelectItem>
                                <SelectItem value="Not Implemented">Not Implemented</SelectItem>
                                <SelectItem value="Not Applicable">Not Applicable</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label>Maturity Level</Label>
                            <Select
                              value={control.maturity_level}
                              onValueChange={(value) => updateControl(control.id, { maturity_level: value })}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Basic">Basic</SelectItem>
                                <SelectItem value="Intermediate">Intermediate</SelectItem>
                                <SelectItem value="Advanced">Advanced</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label>Evidence of Implementation</Label>
                          <Textarea
                            value={control.evidence}
                            onChange={(e) => updateControl(control.id, { evidence: e.target.value })}
                            placeholder="Describe evidence of control implementation..."
                            rows={2}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label>Gaps Identified</Label>
                          <Textarea
                            value={control.gaps_identified}
                            onChange={(e) => updateControl(control.id, { gaps_identified: e.target.value })}
                            placeholder="Identify any gaps or weaknesses..."
                            rows={2}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label>Remediation Plan</Label>
                          <Textarea
                            value={control.remediation_plan}
                            onChange={(e) => updateControl(control.id, { remediation_plan: e.target.value })}
                            placeholder="Describe remediation actions needed..."
                            rows={2}
                          />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>Responsible Party</Label>
                            <Textarea
                              value={control.responsible_party}
                              onChange={(e) => updateControl(control.id, { responsible_party: e.target.value })}
                              placeholder="Who is responsible for this control?"
                              rows={1}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Target Completion Date</Label>
                            <input
                              type="date"
                              value={control.target_completion_date}
                              onChange={(e) => updateControl(control.id, { target_completion_date: e.target.value })}
                              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="summary" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {domains.map((domain) => {
                    const domainControls = controls.filter((c) => c.domain === domain)
                    const domainImplemented = domainControls.filter(
                      (c) => c.implementation_status === "Implemented",
                    ).length
                    const domainPartial = domainControls.filter(
                      (c) => c.implementation_status === "Partially Implemented",
                    ).length
                    const domainCompliance =
                      domainControls.length > 0
                        ? Math.round(((domainImplemented + domainPartial * 0.5) / domainControls.length) * 100)
                        : 0

                    return (
                      <Card key={domain} className="border-cyan-200/50">
                        <CardHeader className="pb-3">
                          <div className="flex items-center space-x-2">
                            {getDomainIcon(domain)}
                            <CardTitle className="text-base">{domain}</CardTitle>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">Compliance</span>
                            <div className="flex items-center space-x-2">
                              <Progress value={domainCompliance} className="w-16 h-2" />
                              <span className="text-sm font-medium">{domainCompliance}%</span>
                            </div>
                          </div>
                          <div className="space-y-1 text-xs">
                            <div className="flex justify-between">
                              <span className="text-green-600">Implemented:</span>
                              <span>{domainImplemented}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-yellow-600">Partial:</span>
                              <span>{domainPartial}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-red-600">Not Implemented:</span>
                              <span>
                                {domainControls.filter((c) => c.implementation_status === "Not Implemented").length}
                              </span>
                            </div>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full text-xs bg-transparent"
                            onClick={() => setSelectedDomain(domain)}
                          >
                            View Controls
                          </Button>
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>
              </TabsContent>
            </Tabs>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
