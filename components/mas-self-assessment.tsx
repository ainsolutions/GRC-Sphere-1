"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { toast } from "@/components/ui/use-toast"
import {
  Save,
  Download,
  Upload,
  RefreshCw,
  CheckCircle,
  AlertTriangle,
  Clock,
  FileText,
  BarChart3,
  TrendingUp,
  Shield,
  Building,
} from "lucide-react"

interface MASControl {
  id: string
  domain: string
  control_id: string
  title: string
  description: string
  category: string
  criticality: string
  implementation_status: string
  maturity_level: string
  evidence: string
  gaps_identified: string
  remediation_plan: string
  target_completion_date: string
  responsible_party: string
  last_reviewed: string
  reviewer_comments: string
}

interface MASDomain {
  name: string
  description: string
  controls: MASControl[]
  completionPercentage: number
}

export function MASSelfAssessment() {
  const [domains, setDomains] = useState<MASDomain[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [selectedDomain, setSelectedDomain] = useState<string>("all")
  const [selectedControl, setSelectedControl] = useState<MASControl | null>(null)
  const [isControlDialogOpen, setIsControlDialogOpen] = useState(false)

  const implementationStatuses = ["Implemented", "Partially Implemented", "Not Implemented", "Not Applicable"]

  const maturityLevels = ["Basic", "Intermediate", "Advanced"]

  const domainNames = [
    "Technology Risk Management",
    "Cyber Hygiene",
    "Outsourcing",
    "Business Continuity Management",
    "Data Governance",
    "Cloud Computing",
    "Operational Risk Management",
    "Third Party Risk Management",
    "Incident Management",
    "Access Management",
  ]

  useEffect(() => {
    fetchSelfAssessmentData()
  }, [])

  const fetchSelfAssessmentData = async () => {
    try {
      const response = await fetch("/api/mas-self-assessment/controls")
      if (response.ok) {
        const data = await response.json()

        // Group controls by domain
        const domainMap = new Map<string, MASControl[]>()
        data.forEach((control: MASControl) => {
          if (!domainMap.has(control.domain)) {
            domainMap.set(control.domain, [])
          }
          domainMap.get(control.domain)!.push(control)
        })

        // Create domain objects with completion percentages
        const domainsData: MASDomain[] = Array.from(domainMap.entries()).map(([name, controls]) => {
          const implementedCount = controls.filter((c) => c.implementation_status === "Implemented").length
          const completionPercentage = controls.length > 0 ? (implementedCount / controls.length) * 100 : 0

          return {
            name,
            description: getDomainDescription(name),
            controls,
            completionPercentage,
          }
        })

        setDomains(domainsData)
      }
    } catch (error) {
      console.error("Error fetching MAS self-assessment data:", error)
      toast({
        title: "Error",
        description: "Failed to fetch self-assessment data",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const getDomainDescription = (domainName: string): string => {
    const descriptions: Record<string, string> = {
      "Technology Risk Management":
        "Comprehensive framework for managing technology-related risks in financial institutions",
      "Cyber Hygiene": "Basic cybersecurity practices and controls to maintain security posture",
      Outsourcing: "Risk management for third-party service providers and outsourced functions",
      "Business Continuity Management": "Ensuring continuity of critical business functions during disruptions",
      "Data Governance": "Framework for managing data quality, privacy, and protection",
      "Cloud Computing": "Guidelines for secure adoption and management of cloud services",
      "Operational Risk Management": "Identification and mitigation of operational risks",
      "Third Party Risk Management": "Assessment and monitoring of third-party relationships",
      "Incident Management": "Processes for detecting, responding to, and recovering from incidents",
      "Access Management": "Controls for user access, authentication, and authorization",
    }
    return descriptions[domainName] || "MAS regulatory requirement domain"
  }

  const handleControlUpdate = async (controlId: string, field: string, value: string) => {
    try {
      setSaving(true)

      const response = await fetch("/api/mas-self-assessment/controls", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          control_id: controlId,
          [field]: value,
          last_reviewed: new Date().toISOString().split("T")[0],
        }),
      })

      if (response.ok) {
        // Update local state
        setDomains((prevDomains) =>
          prevDomains.map((domain) => ({
            ...domain,
            controls: domain.controls.map((control) =>
              control.id === controlId
                ? { ...control, [field]: value, last_reviewed: new Date().toISOString().split("T")[0] }
                : control,
            ),
          })),
        )

        toast({
          title: "Success",
          description: "Control updated successfully",
        })
      } else {
        throw new Error("Failed to update control")
      }
    } catch (error) {
      console.error("Error updating control:", error)
      toast({
        title: "Error",
        description: "Failed to update control",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      Implemented: { color: "bg-green-100 text-green-800", icon: CheckCircle },
      "Partially Implemented": { color: "bg-yellow-100 text-yellow-800", icon: Clock },
      "Not Implemented": { color: "bg-red-100 text-red-800", icon: AlertTriangle },
      "Not Applicable": { color: "bg-gray-100 text-gray-800", icon: CheckCircle },
    }
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig["Not Implemented"]
    const Icon = config.icon
    return (
      <Badge className={config.color}>
        <Icon className="w-3 h-3 mr-1" />
        {status}
      </Badge>
    )
  }

  const getMaturityBadge = (level: string) => {
    const levelConfig = {
      Basic: { color: "bg-blue-100 text-blue-800" },
      Intermediate: { color: "bg-purple-100 text-purple-800" },
      Advanced: { color: "bg-green-100 text-green-800" },
    }
    const config = levelConfig[level as keyof typeof levelConfig] || levelConfig["Basic"]
    return <Badge className={config.color}>{level}</Badge>
  }

  const getOverallStats = () => {
    const allControls = domains.flatMap((d) => d.controls)
    const total = allControls.length
    const implemented = allControls.filter((c) => c.implementation_status === "Implemented").length
    const partiallyImplemented = allControls.filter((c) => c.implementation_status === "Partially Implemented").length
    const notImplemented = allControls.filter((c) => c.implementation_status === "Not Implemented").length
    const overallPercentage = total > 0 ? (implemented / total) * 100 : 0

    return { total, implemented, partiallyImplemented, notImplemented, overallPercentage }
  }

  const filteredDomains = selectedDomain === "all" ? domains : domains.filter((d) => d.name === selectedDomain)

  const stats = getOverallStats()

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
              Total Controls
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{stats.total}</div>
            <p className="text-xs text-muted-foreground">Across all domains</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent">
              Implemented
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.implemented}</div>
            <p className="text-xs text-muted-foreground">{stats.overallPercentage.toFixed(1)}% complete</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent">
              Partially Implemented
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{stats.partiallyImplemented}</div>
            <p className="text-xs text-muted-foreground">In progress</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent">
              Not Implemented
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.notImplemented}</div>
            <p className="text-xs text-muted-foreground">Require attention</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Overall Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{stats.overallPercentage.toFixed(1)}%</div>
            <Progress value={stats.overallPercentage} className="mt-2" />
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                MAS Self-Assessment
              </CardTitle>
              <CardDescription>Conduct self-assessment against MAS regulatory requirements</CardDescription>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm">
                <Upload className="mr-2 h-4 w-4" />
                Import
              </Button>
              <Button variant="outline" size="sm">
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
              <Button
                size="sm"
               
                disabled={saving}
              >
                {saving ? <RefreshCw className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                Save Progress
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="assessment" className="space-y-4">
            <TabsList>
              <TabsTrigger value="assessment">Assessment</TabsTrigger>
              <TabsTrigger value="summary">Domain Summary</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
            </TabsList>

            <TabsContent value="assessment" className="space-y-4">
              {/* Domain Filter */}
              <div className="flex items-center space-x-4">
                <Label htmlFor="domain-filter">Filter by Domain:</Label>
                <Select value={selectedDomain} onValueChange={setSelectedDomain}>
                  <SelectTrigger className="w-64">
                    <SelectValue placeholder="Select domain" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Domains</SelectItem>
                    {domainNames.map((domain) => (
                      <SelectItem key={domain} value={domain}>
                        {domain}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Assessment Accordion */}
              <Accordion type="multiple" className="space-y-4">
                {filteredDomains.map((domain) => (
                  <AccordionItem
                    key={domain.name}
                    value={domain.name}
                    className="border rounded-lg bg-black/50 backdrop-blur-sm"
                  >
                    <AccordionTrigger className="px-4 py-3 hover:no-underline">
                      <div className="flex items-center justify-between w-full mr-4">
                        <div className="flex items-center space-x-3">
                          <Shield className="h-5 w-5 text-orange-600" />
                          <div className="text-left">
                            <h3 className="font-semibold">{domain.name}</h3>
                            <p className="text-sm text-muted-foreground">{domain.description}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4">
                          <div className="text-right">
                            <div className="flex items-center space-x-2">
                              <Progress value={domain.completionPercentage} className="w-24 h-2" />
                              <span className="text-sm font-medium">{domain.completionPercentage.toFixed(1)}%</span>
                            </div>
                            <p className="text-xs text-muted-foreground">
                              {domain.controls.filter((c) => c.implementation_status === "Implemented").length} of{" "}
                              {domain.controls.length} controls
                            </p>
                          </div>
                        </div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-4 pb-4">
                      <div className="space-y-4">
                        {domain.controls.map((control) => (
                          <Card key={control.id} className="border-orange-200/50">
                            <CardHeader className="pb-3">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                  <Badge variant="outline" className="text-xs">
                                    {control.control_id}
                                  </Badge>
                                  <Badge
                                    className={
                                      control.criticality === "High"
                                        ? "bg-red-100 text-red-800"
                                        : control.criticality === "Medium"
                                          ? "bg-yellow-100 text-yellow-800"
                                          : "bg-green-100 text-green-800"
                                    }
                                  >
                                    {control.criticality}
                                  </Badge>
                                </div>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => {
                                    setSelectedControl(control)
                                    setIsControlDialogOpen(true)
                                  }}
                                >
                                  <FileText className="h-4 w-4" />
                                </Button>
                              </div>
                              <CardTitle className="text-base">{control.title}</CardTitle>
                              <CardDescription className="text-sm">{control.description}</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                              <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                  <Label htmlFor={`status-${control.id}`}>Implementation Status</Label>
                                  <Select
                                    value={control.implementation_status}
                                    onValueChange={(value) =>
                                      handleControlUpdate(control.id, "implementation_status", value)
                                    }
                                  >
                                    <SelectTrigger>
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {implementationStatuses.map((status) => (
                                        <SelectItem key={status} value={status}>
                                          {status}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                </div>
                                <div className="space-y-2">
                                  <Label htmlFor={`maturity-${control.id}`}>Maturity Level</Label>
                                  <Select
                                    value={control.maturity_level}
                                    onValueChange={(value) => handleControlUpdate(control.id, "maturity_level", value)}
                                  >
                                    <SelectTrigger>
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {maturityLevels.map((level) => (
                                        <SelectItem key={level} value={level}>
                                          {level}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                </div>
                              </div>
                              <div className="flex items-center space-x-4">
                                {getStatusBadge(control.implementation_status)}
                                {getMaturityBadge(control.maturity_level)}
                                {control.last_reviewed && (
                                  <Badge variant="outline" className="text-xs">
                                    Last reviewed: {new Date(control.last_reviewed).toLocaleDateString()}
                                  </Badge>
                                )}
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </TabsContent>

            <TabsContent value="summary" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {domains.map((domain) => (
                  <Card key={domain.name} className="border-orange-200/50 bg-black/50 backdrop-blur-sm">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg flex items-center space-x-2">
                        <Building className="h-5 w-5" />
                        <span>{domain.name}</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Progress</span>
                        <div className="flex items-center space-x-2">
                          <Progress value={domain.completionPercentage} className="w-20 h-2" />
                          <span className="text-sm font-medium">{domain.completionPercentage.toFixed(1)}%</span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-muted-foreground">Total Controls</span>
                          <span className="text-xs font-medium">{domain.controls.length}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-muted-foreground">Implemented</span>
                          <span className="text-xs font-medium text-green-600">
                            {domain.controls.filter((c) => c.implementation_status === "Implemented").length}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-muted-foreground">Partially Implemented</span>
                          <span className="text-xs font-medium text-yellow-600">
                            {domain.controls.filter((c) => c.implementation_status === "Partially Implemented").length}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-muted-foreground">Not Implemented</span>
                          <span className="text-xs font-medium text-red-600">
                            {domain.controls.filter((c) => c.implementation_status === "Not Implemented").length}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="analytics" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="border-orange-200/50 bg-black/50 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center space-x-2">
                      <BarChart3 className="h-5 w-5" />
                      <span>Implementation Status</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {implementationStatuses.map((status) => {
                        const count = domains
                          .flatMap((d) => d.controls)
                          .filter((c) => c.implementation_status === status).length
                        const percentage = stats.total > 0 ? (count / stats.total) * 100 : 0
                        return (
                          <div key={status} className="flex items-center justify-between">
                            <span className="text-sm">{status}</span>
                            <div className="flex items-center space-x-2">
                              <Progress value={percentage} className="w-20 h-2" />
                              <span className="text-sm font-medium w-8">{count}</span>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-orange-200/50 bg-black/50 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center space-x-2">
                      <TrendingUp className="h-5 w-5" />
                      <span>Maturity Distribution</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {maturityLevels.map((level) => {
                        const count = domains
                          .flatMap((d) => d.controls)
                          .filter((c) => c.maturity_level === level).length
                        const percentage = stats.total > 0 ? (count / stats.total) * 100 : 0
                        return (
                          <div key={level} className="flex items-center justify-between">
                            <span className="text-sm">{level}</span>
                            <div className="flex items-center space-x-2">
                              <Progress value={percentage} className="w-20 h-2" />
                              <span className="text-sm font-medium w-8">{count}</span>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Control Details Dialog */}
      <Dialog open={isControlDialogOpen} onOpenChange={setIsControlDialogOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Control Details</DialogTitle>
            <DialogDescription>Detailed view and assessment of MAS control</DialogDescription>
          </DialogHeader>
          {selectedControl && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Control ID</Label>
                  <p className="text-sm text-muted-foreground">{selectedControl.control_id}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Domain</Label>
                  <p className="text-sm text-muted-foreground">{selectedControl.domain}</p>
                </div>
                <div className="col-span-2">
                  <Label className="text-sm font-medium">Title</Label>
                  <p className="text-sm text-muted-foreground">{selectedControl.title}</p>
                </div>
                <div className="col-span-2">
                  <Label className="text-sm font-medium">Description</Label>
                  <p className="text-sm text-muted-foreground">{selectedControl.description}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Implementation Status</Label>
                  <div className="mt-1">{getStatusBadge(selectedControl.implementation_status)}</div>
                </div>
                <div>
                  <Label className="text-sm font-medium">Maturity Level</Label>
                  <div className="mt-1">{getMaturityBadge(selectedControl.maturity_level)}</div>
                </div>
                <div className="col-span-2">
                  <Label htmlFor="evidence">Evidence</Label>
                  <Textarea
                    id="evidence"
                    value={selectedControl.evidence}
                    onChange={(e) => {
                      setSelectedControl({ ...selectedControl, evidence: e.target.value })
                      handleControlUpdate(selectedControl.id, "evidence", e.target.value)
                    }}
                    placeholder="Provide evidence of implementation"
                    rows={3}
                  />
                </div>
                <div className="col-span-2">
                  <Label htmlFor="gaps_identified">Gaps Identified</Label>
                  <Textarea
                    id="gaps_identified"
                    value={selectedControl.gaps_identified}
                    onChange={(e) => {
                      setSelectedControl({ ...selectedControl, gaps_identified: e.target.value })
                      handleControlUpdate(selectedControl.id, "gaps_identified", e.target.value)
                    }}
                    placeholder="Identify any gaps or deficiencies"
                    rows={3}
                  />
                </div>
                <div className="col-span-2">
                  <Label htmlFor="remediation_plan">Remediation Plan</Label>
                  <Textarea
                    id="remediation_plan"
                    value={selectedControl.remediation_plan}
                    onChange={(e) => {
                      setSelectedControl({ ...selectedControl, remediation_plan: e.target.value })
                      handleControlUpdate(selectedControl.id, "remediation_plan", e.target.value)
                    }}
                    placeholder="Describe remediation plan for identified gaps"
                    rows={3}
                  />
                </div>
                <div>
                  <Label htmlFor="responsible_party">Responsible Party</Label>
                  <Input
                    id="responsible_party"
                    value={selectedControl.responsible_party}
                    onChange={(e) => {
                      setSelectedControl({ ...selectedControl, responsible_party: e.target.value })
                      handleControlUpdate(selectedControl.id, "responsible_party", e.target.value)
                    }}
                    placeholder="Enter responsible party"
                  />
                </div>
                <div>
                  <Label htmlFor="target_completion_date">Target Completion Date</Label>
                  <Input
                    id="target_completion_date"
                    type="date"
                    value={selectedControl.target_completion_date}
                    onChange={(e) => {
                      setSelectedControl({ ...selectedControl, target_completion_date: e.target.value })
                      handleControlUpdate(selectedControl.id, "target_completion_date", e.target.value)
                    }}
                  />
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
