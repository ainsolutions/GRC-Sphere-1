"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { X, Plus, Brain, Loader2, RefreshCw, Edit } from "lucide-react"
import { createThreat, updateThreat } from "@/lib/actions/threat-actions"
import { useToast } from "@/hooks/use-toast"
import { RiskTitleField } from "@/components/risk-title-field"
import { ActionButtons } from "./ui/action-buttons"

interface Threat {
  id?: string
  threat_id: string
  name: string
  description: string
  category: string
  source: string
  threat_level: string
  status: string
  indicators_of_compromise: string[]
  mitigation_strategies: string[]
  threat_references: string[]
  associated_risks?: Array<{
    id: string
    title: string
    description: string
    category: string
    source: string
    risk_level?: string
    status?: string
    table: string
    uniqueId: string
  }>
  threat_analysis?: string
  impact_analysis?: string
  risk_analysis?: string
}

interface ThreatFormProps {
  threat?: Threat | null
  onClose: () => void
}

export function ThreatForm({ threat, onClose }: ThreatFormProps) {
  const normalizeStringArray = (value: unknown): string[] => {
    if (!value) return []
    if (Array.isArray(value)) return value.filter((v) => typeof v === "string") as string[]
    if (typeof value === "string") {
      try {
        const parsed = JSON.parse(value)
        return Array.isArray(parsed) ? parsed.filter((v) => typeof v === "string") : []
      } catch {
        return value.trim().length > 0 ? [value] : []
      }
    }
    return []
  }

  const normalizeAssociatedRisks = (value: unknown): Threat["associated_risks"] => {
    if (!value) return []
    if (Array.isArray(value)) return value as Threat["associated_risks"]
    if (typeof value === "string") {
      try {
        const parsed = JSON.parse(value)
        return Array.isArray(parsed) ? (parsed as Threat["associated_risks"]) : []
      } catch {
        return []
      }
    }
    return []
  }
  const [formData, setFormData] = useState<Threat>({
    threat_id: "",
    name: "",
    description: "",
    category: "",
    source: "",
    threat_level: "",
    status: "",
    indicators_of_compromise: [],
    mitigation_strategies: [],
    threat_references: [],
    associated_risks: [],
    threat_analysis: "",
    impact_analysis: "",
    risk_analysis: "",
  })

  const [newIoC, setNewIoC] = useState("")
  const [newStrategy, setNewStrategy] = useState("")
  const [newReference, setNewReference] = useState("")
  const [loading, setLoading] = useState(false)
  const [analyzingThreat, setAnalyzingThreat] = useState(false)
  const [analysisTimestamp, setAnalysisTimestamp] = useState<string | null>(null)
  const [formattedAnalysisTime, setFormattedAnalysisTime] = useState<string>("")
  const [isClient, setIsClient] = useState(false)
  const [mounted, setMounted] = useState(false)

  // Auto-generate threat ID for new threats
  const generateThreatId = async () => {
    try {
      // Only generate if this is a new threat (no threat prop passed)
      if (threat) return

      const response = await fetch('/api/threats/generate-id')
      if (response.ok) {
        const data = await response.json()
        setFormData(prev => ({ ...prev, threat_id: data.threatId }))
      }
    } catch (error) {
      console.error('Failed to generate threat ID:', error)
    }
  }

  const { toast } = useToast()

  useEffect(() => {
    if (threat) {
      setFormData({
        ...threat,
        indicators_of_compromise: normalizeStringArray((threat as any).indicators_of_compromise),
        mitigation_strategies: normalizeStringArray((threat as any).mitigation_strategies),
        threat_references: normalizeStringArray((threat as any).threat_references),
        associated_risks: normalizeAssociatedRisks((threat as any).associated_risks),
        threat_analysis: threat.threat_analysis || "",
        impact_analysis: threat.impact_analysis || "",
        risk_analysis: threat.risk_analysis || "",
      })
      // Use a consistent timestamp based on when the threat was last updated
      setAnalysisTimestamp(threat.threat_analysis ? ((threat as any).updated_at || new Date().toISOString()) : null)
    }
  }, [threat])

  // Set client-side flag to prevent hydration issues
  useEffect(() => {
    setIsClient(true)
    setMounted(true)
    // Auto-generate threat ID for new threats
    generateThreatId()
  }, [])

  // Format timestamp on client side to avoid hydration mismatch
  useEffect(() => {
    if (isClient && analysisTimestamp) {
      setFormattedAnalysisTime(new Date(analysisTimestamp).toLocaleString())
    } else {
      setFormattedAnalysisTime("")
    }
  }, [analysisTimestamp, isClient])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const result = threat ? await updateThreat(threat.id!, formData) : await createThreat(formData)

      if (result.success) {
        toast({
          title: "Success",
          description: result.message || (threat ? "Threat updated successfully" : "Threat created successfully"),
        })
        onClose()
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to save threat",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error saving threat:", error)
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const addItem = (type: "indicators_of_compromise" | "mitigation_strategies" | "threat_references", value: string) => {
    if (value.trim()) {
      setFormData((prev) => ({
        ...prev,
        [type]: [
          ...((Array.isArray(prev[type]) ? prev[type] : normalizeStringArray(prev[type])) as string[]),
          value.trim(),
        ],
      }))

      if (type === "indicators_of_compromise") setNewIoC("")
      if (type === "mitigation_strategies") setNewStrategy("")
      if (type === "threat_references") setNewReference("")
    }
  }

  const removeItem = (
    type: "indicators_of_compromise" | "mitigation_strategies" | "threat_references",
    index: number,
  ) => {
    setFormData((prev) => ({
      ...prev,
      [type]: ((Array.isArray(prev[type]) ? prev[type] : normalizeStringArray(prev[type])) as string[]).filter(
        (_, i) => i !== index,
      ),
    }))
  }

  const analyzeThreat = async () => {
    if (!formData.name.trim()) {
      toast({
        title: "Error",
        description: "Please enter a threat name before analyzing",
        variant: "destructive",
      })
      return
    }

    setAnalyzingThreat(true)
    try {
      const response = await fetch("/api/threat-analysis", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          threatName: formData.name,
          threatDescription: formData.description,
          threatCategory: formData.category,
        }),
      })

      const data = await response.json()

      if (data.success) {
        setFormData(prev => ({ ...prev, threat_analysis: data.analysis }))
        setAnalysisTimestamp(data.timestamp)
        toast({
          title: "Analysis Complete",
          description: "Threat analysis generated successfully",
        })
      } else {
        toast({
          title: "Analysis Failed",
          description: data.error || "Failed to analyze threat",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error analyzing threat:", error)
      toast({
        title: "Analysis Failed",
        description: "An error occurred while analyzing the threat",
        variant: "destructive",
      })
    } finally {
      setAnalyzingThreat(false)
    }
  }

  // Prevent hydration issues by only rendering after component mounts
  if (!mounted) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-4 bg-slate-700 rounded w-3/4 mb-4"></div>
          <div className="h-8 bg-slate-700 rounded mb-4"></div>
          <div className="h-32 bg-slate-700 rounded"></div>
        </div>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Tabs defaultValue="basic" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="basic">Basic Information</TabsTrigger>
          <TabsTrigger value="classification">Classification</TabsTrigger>
          <TabsTrigger value="intelligence">Threat Intelligence</TabsTrigger>
          <TabsTrigger value="analysis">AI Analysis</TabsTrigger>
          <TabsTrigger value="manual">Manual Analysis</TabsTrigger>
        </TabsList>

        <TabsContent value="basic" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>Enter the basic details of the threat</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="threat_id">Threat ID</Label>
                  <Input
                    id="threat_id"
                    value={formData.threat_id}
                    onChange={(e) => setFormData({ ...formData, threat_id: e.target.value })}
                    placeholder="THR-001"
                    required
                    readOnly={!threat} // Read-only for new threats, editable for existing ones
                    className={!threat ? "bg-slate-100 cursor-not-allowed" : ""}
                  />
                  {!threat && (
                    <p className="text-xs text-slate-500">
                      Threat ID is auto-generated for new threats
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="name">Threat Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Enter threat name"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe the threat in detail"
                  rows={4}
                  required
                />
              </div>

              {/* Associated Risks */}
              <div className="space-y-2">
                <RiskTitleField
                  selectedRisks={formData.associated_risks || []}
                  onRisksChange={(risks) => setFormData({ ...formData, associated_risks: risks })}
                  placeholder="Search for associated risks..."
                  maxSelections={20}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="classification" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Threat Classification</CardTitle>
              <CardDescription>Classify and categorize the threat</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) => setFormData({ ...formData, category: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="malware">Malware</SelectItem>
                      <SelectItem value="phishing">Phishing</SelectItem>
                      <SelectItem value="ransomware">Ransomware</SelectItem>
                      <SelectItem value="insider-threat">Insider Threat</SelectItem>
                      <SelectItem value="ddos">DDoS Attack</SelectItem>
                      <SelectItem value="supply-chain">Supply Chain</SelectItem>
                      <SelectItem value="social-engineering">Social Engineering</SelectItem>
                      <SelectItem value="data-breach">Data Breach</SelectItem>
                      <SelectItem value="physical-security">Physical Security</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="source">Source</Label>
                  <Select
                    value={formData.source}
                    onValueChange={(value) => setFormData({ ...formData, source: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select source" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="internal">Internal</SelectItem>
                      <SelectItem value="external">External</SelectItem>
                      <SelectItem value="threat-intelligence">Threat Intelligence</SelectItem>
                      <SelectItem value="security-vendor">Security Vendor</SelectItem>
                      <SelectItem value="government">Government</SelectItem>
                      <SelectItem value="industry-report">Industry Report</SelectItem>
                      <SelectItem value="incident-response">Incident Response</SelectItem>
                      <SelectItem value="vulnerability-assessment">Vulnerability Assessment</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="threat_level">Threat Level</Label>
                  <Select
                    value={formData.threat_level}
                    onValueChange={(value) => setFormData({ ...formData, threat_level: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select threat level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="critical">Critical</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value) => setFormData({ ...formData, status: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="monitoring">Monitoring</SelectItem>
                      <SelectItem value="mitigated">Mitigated</SelectItem>
                      <SelectItem value="resolved">Resolved</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="intelligence" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Threat Intelligence</CardTitle>
              <CardDescription>Add indicators of compromise, mitigation strategies, and references</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Indicators of Compromise */}
              <div className="space-y-3">
                <Label>Indicators of Compromise (IoCs)</Label>
                <div className="flex space-x-2">
                  <Input
                    value={newIoC}
                    onChange={(e) => setNewIoC(e.target.value)}
                    placeholder="Enter IoC (IP, domain, hash, etc.)"
                    onKeyPress={(e) =>
                      e.key === "Enter" && (e.preventDefault(), addItem("indicators_of_compromise", newIoC))
                    }
                  />
                  <ActionButtons isTableAction={false} onAdd={() => addItem("indicators_of_compromise", newIoC)} btnAddText=""/>
                  {/* <Button type="button" variant="outline" onClick={() => addItem("indicators_of_compromise", newIoC)}>
                    <Plus className="h-4 w-4" />
                  </Button> */}
                </div>
                <div className="flex flex-wrap gap-2">
                  {(Array.isArray(formData.indicators_of_compromise)
                    ? formData.indicators_of_compromise
                    : normalizeStringArray(formData.indicators_of_compromise)
                  ).map((ioc, index) => (
                    <Badge key={`ioc-${index}`} variant="secondary" className="flex items-center gap-1">
                      {ioc}
                      <X
                        className="h-3 w-3 cursor-pointer"
                        onClick={() => removeItem("indicators_of_compromise", index)}
                      />
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Mitigation Strategies */}
              <div className="space-y-3">
                <Label>Mitigation Strategies</Label>
                <div className="flex space-x-2">
                  <Input
                    value={newStrategy}
                    onChange={(e) => setNewStrategy(e.target.value)}
                    placeholder="Enter mitigation strategy"
                    onKeyPress={(e) =>
                      e.key === "Enter" && (e.preventDefault(), addItem("mitigation_strategies", newStrategy))
                    }
                  />
                  <ActionButtons isTableAction={false} onAdd={() => addItem("mitigation_strategies", newStrategy)} btnAddText=""/>
                  {/* <Button type="button" variant="outline" onClick={() => addItem("mitigation_strategies", newStrategy)}>
                    <Plus className="h-4 w-4" />
                  </Button> */}
                </div>
                <div className="flex flex-wrap gap-2">
                  {(Array.isArray(formData.mitigation_strategies)
                    ? formData.mitigation_strategies
                    : normalizeStringArray(formData.mitigation_strategies)
                  ).map((strategy, index) => (
                    <Badge key={`strategy-${index}`} variant="secondary" className="flex items-center gap-1">
                      {strategy}
                      <X
                        className="h-3 w-3 cursor-pointer"
                        onClick={() => removeItem("mitigation_strategies", index)}
                      />
                    </Badge>
                  ))}
                </div>
              </div>

              {/* References */}
              <div className="space-y-3">
                <Label>References</Label>
                <div className="flex space-x-2">
                  <Input
                    value={newReference}
                    onChange={(e) => setNewReference(e.target.value)}
                    placeholder="Enter reference URL or citation"
                    onKeyPress={(e) =>
                      e.key === "Enter" && (e.preventDefault(), addItem("threat_references", newReference))
                    }
                  />
                  <ActionButtons isTableAction={false} onAdd={() => addItem("threat_references", newReference)} btnAddText=""/>
                  {/* <Button type="button" variant="outline" onClick={() => addItem("threat_references", newReference)}>
                    <Plus className="h-4 w-4" />
                  </Button> */}
                </div>
                <div className="flex flex-wrap gap-2">
                  {(Array.isArray(formData.threat_references)
                    ? formData.threat_references
                    : normalizeStringArray(formData.threat_references)
                  ).map((reference, index) => (
                    <Badge key={`reference-${index}`} variant="secondary" className="flex items-center gap-1">
                      {reference}
                      <X className="h-3 w-3 cursor-pointer" onClick={() => removeItem("threat_references", index)} />
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analysis" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5 text-purple-400" />
                AI Threat Analysis
              </CardTitle>
              <CardDescription>
                Get comprehensive threat analysis powered by AI
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Analysis Controls */}
              <div className="flex items-center gap-4">
                <Button
                  type="button"
                  onClick={analyzeThreat}
                  disabled={analyzingThreat || !formData.name.trim()}
                >
                  {analyzingThreat ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Brain className="mr-2 h-4 w-4" />
                      Analyze Threat
                    </>
                  )}
                </Button>

                {formData.threat_analysis && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={analyzeThreat}
                    disabled={analyzingThreat}
                  >
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Refresh Analysis
                  </Button>
                )}
              </div>

              {/* Analysis Status */}
              {isClient && formattedAnalysisTime && (
                <div className="text-sm text-slate-400">
                  Last analyzed: {formattedAnalysisTime}
                </div>
              )}

              {/* Analysis Results */}
              {formData.threat_analysis ? (
                <div className="space-y-4">
                  <div className="border border-slate-300 rounded-lg p-4 bg-gray-50 dark:bg-gray-800">
                    <div className="prose prose-invert max-w-none">
                      <div className="whitespace-pre-wrap text-slate-500 leading-relaxed">
                        {formData.threat_analysis}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="border border-dashed border-slate-600 rounded-lg p-8 text-center">
                  <Brain className="mx-auto h-12 w-12 text-slate-400 mb-4" />
                  <h3 className="text-lg font-medium text-slate-200 mb-2">
                    No Analysis Available
                  </h3>
                  <p className="text-slate-400 mb-4">
                    Click "Analyze Threat" to generate an AI-powered analysis of this threat.
                  </p>
                  {!formData.name.trim() && (
                    <p className="text-amber-400 text-sm">
                      Please enter a threat name first to enable analysis.
                    </p>
                  )}
                </div>
              )}

              {/* Analysis Tips */}
              <div className="border border-slate-300 rounded-lg p-4 bg-gray-50 dark:bg-gray-800">
                <h4 className="text-blue-400 font-medium mb-2">💡 Analysis Tips</h4>
                <ul className="text-sm text-slate-500 space-y-1">
                  <li>• Enter a specific threat name for better analysis</li>
                  <li>• Include category information for more targeted insights</li>
                  <li>• Analysis covers threat overview, impact, attack vectors, and mitigation strategies</li>
                  <li>• Results are generated using advanced AI models for comprehensive threat intelligence</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="manual" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Edit className="h-5 w-5 text-blue-400" />
                Manual Analysis
              </CardTitle>
              <CardDescription>
                Enter your own analysis of the threat's impact and risk assessment
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Impact Analysis */}
              <div className="space-y-3">
                <Label htmlFor="impact-analysis" className="text-base font-medium">
                  Impact Analysis
                </Label>
                <Textarea
                  id="impact-analysis"
                  value={formData.impact_analysis}
                  onChange={(e) => setFormData({ ...formData, impact_analysis: e.target.value })}
                  placeholder="Describe the potential impact of this threat on your organization..."
                  rows={6}
                />
                <p className="text-sm text-slate-400">
                  Consider business operations, data loss, financial impact, reputation damage, and compliance implications.
                </p>
              </div>

              {/* Risk Analysis */}
              <div className="space-y-3">
                <Label htmlFor="risk-analysis" className="text-base font-medium">
                  Risk Analysis
                </Label>
                <Textarea
                  id="risk-analysis"
                  value={formData.risk_analysis}
                  onChange={(e) => setFormData({ ...formData, risk_analysis: e.target.value })}
                  placeholder="Provide your assessment of the risk level and mitigation requirements..."
                  rows={6}
                />
                <p className="text-sm text-slate-400">
                  Include likelihood assessment, risk rating, existing controls, and recommended mitigation strategies.
                </p>
              </div>

              {/* Analysis Tips */}
              <div className="border border-slate-300 rounded-lg p-4 bg-gray-50 dark:bg-gray-800">
                <h4 className="text-blue-400 font-medium mb-2">💡 Analysis Guidelines</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-slate-500">
                  <div>
                    <h5 className="font-medium text-blue-300 mb-1">Impact Analysis Should Cover:</h5>
                    <ul className="space-y-1 text-xs">
                      <li>• Business operations disruption</li>
                      <li>• Financial consequences</li>
                      <li>• Data loss and confidentiality</li>
                      <li>• Regulatory compliance impact</li>
                      <li>• Reputation and brand damage</li>
                    </ul>
                  </div>
                  <div>
                    <h5 className="font-medium text-blue-300 mb-1">Risk Analysis Should Include:</h5>
                    <ul className="space-y-1 text-xs">
                      <li>• Likelihood of occurrence</li>
                      <li>• Risk severity rating</li>
                      <li>• Current control effectiveness</li>
                      <li>• Mitigation priorities</li>
                      <li>• Resource requirements</li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? "Saving..." : threat ? "Update Threat" : "Create Threat"}
        </Button>
      </div>
    </form>
  )
}
