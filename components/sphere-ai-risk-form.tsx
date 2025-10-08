"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Brain, Zap, Shield, AlertTriangle, CheckCircle, Loader2 } from "lucide-react"
import { toast } from "sonner"

interface RiskFormData {
  title: string
  description: string
  category: string
  likelihood: number
  impact: number
  status: string
  risk_owner: string,
  business_unit: string,
}

interface AiAnalysis {
  riskLevel: string
  riskScore: number
  confidence: number
  recommendations: string[]
  threats: string[]
  vulnerabilities: string[]
}

export function SphereAiRiskForm() {
  const [formData, setFormData] = useState<RiskFormData>({
    title: "",
    description: "",
    category: "",
    likelihood: 5,
    impact: 5,
    status: "Draft",
    risk_owner: "",
    business_unit: "",
  })

  const [aiAnalysis, setAiAnalysis] = useState<AiAnalysis | null>(null)
  const [analyzing, setAnalyzing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [activeTab, setActiveTab] = useState("basic")

  const handleInputChange = (field: keyof RiskFormData, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    // Clear AI analysis when form changes
    if (aiAnalysis) {
      setAiAnalysis(null)
    }
  }

  const runAiAnalysis = async () => {
    if (!formData.title || !formData.description) {
      toast.error("Please provide title and description for AI analysis")
      return
    }

    setAnalyzing(true)
    try {
      // Simulate AI analysis
      await new Promise((resolve) => setTimeout(resolve, 3000))

      // Mock AI analysis results
      const mockAnalysis: AiAnalysis = {
        riskLevel:
          formData.likelihood * formData.impact > 35
            ? "Critical"
            : formData.likelihood * formData.impact > 25
              ? "High"
              : formData.likelihood * formData.impact > 15
                ? "Medium"
                : "Low",
        riskScore: (formData.likelihood * formData.impact) / 10,
        confidence: Math.floor(Math.random() * 20) + 80,
        recommendations: [
          "Implement multi-factor authentication",
          "Regular security assessments",
          "Employee security training",
          "Incident response plan updates",
        ],
        threats: ["Advanced Persistent Threats (APT)", "Ransomware attacks", "Data breaches", "Social engineering"],
        vulnerabilities: [
          "Unpatched software systems",
          "Weak access controls",
          "Insufficient monitoring",
          "Legacy system dependencies",
        ],
      }

      setAiAnalysis(mockAnalysis)
      setActiveTab("analysis")
      toast.success("AI analysis completed successfully")
    } catch (error) {
      console.error("AI analysis error:", error)
      toast.error("Failed to complete AI analysis")
    } finally {
      setAnalyzing(false)
    }
  }

  const handleSubmit = async () => {
    if (!formData.title || !formData.description || !formData.category) {
      toast.error("Please fill in all required fields")
      return
    }

    setSaving(true)
    try {
      const payload = {
        ...formData,
        ai_risk_level: aiAnalysis?.riskLevel || "Medium",
        ai_risk_score: aiAnalysis?.riskScore || (formData.likelihood * formData.impact) / 10,
        ai_confidence: aiAnalysis?.confidence || 75,
      }

      const response = await fetch("/api/sphere-ai-risks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        throw new Error("Failed to save risk")
      }

      toast.success("Risk assessment saved successfully")

      // Reset form
      setFormData({
        title: "",
        description: "",
        category: "",
        likelihood: 5,
        impact: 5,
        status: "Draft",
        risk_owner: "",
        business_unit: "",
      })
      setAiAnalysis(null)
      setActiveTab("basic")
    } catch (error) {
      console.error("Save error:", error)
      toast.error("Failed to save risk assessment")
    } finally {
      setSaving(false)
    }
  }

  const getRiskLevelColor = (level: string) => {
    switch (level) {
      case "Critical":
        return "bg-red-500/20 text-red-300 border-red-400/30"
      case "High":
        return "bg-orange-500/20 text-orange-300 border-orange-400/30"
      case "Medium":
        return "bg-yellow-500/20 text-yellow-300 border-yellow-400/30"
      case "Low":
        return "bg-green-500/20 text-green-300 border-green-400/30"
      default:
        return "bg-slate-500/20 text-slate-300 border-slate-400/30"
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-6 w-6 text-blue-400" />
            AI Risk Assessment
          </CardTitle>
          <CardDescription className="text-slate-500">
            Create comprehensive risk assessments with AI-powered analysis and recommendations
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Main Form */}
      <Card>
        <CardContent className="p-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger
                value="basic"
              >
                Basic Information
              </TabsTrigger>
              <TabsTrigger
                value="assessment"
              >
                Risk Assessment
              </TabsTrigger>
              <TabsTrigger
                value="analysis"
                disabled={!aiAnalysis}
              >
                AI Analysis
              </TabsTrigger>
            </TabsList>

            <TabsContent value="basic" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="title">
                    Risk Title *
                  </Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => handleInputChange("title", e.target.value)}
                    placeholder="Enter risk title..."
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">
                    Category *
                  </Label>
                  <Select value={formData.category} onValueChange={(value) => handleInputChange("category", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Infrastructure Security">Infrastructure Security</SelectItem>
                      <SelectItem value="Data Security">Data Security</SelectItem>
                      <SelectItem value="Application Security">Application Security</SelectItem>
                      <SelectItem value="Third-party Risk">Third-party Risk</SelectItem>
                      <SelectItem value="Compliance">Compliance</SelectItem>
                      <SelectItem value="Operational Risk">Operational Risk</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                  {/* ✅ New Risk Owner Field */}
                  <div className="space-y-2">
                    <Label htmlFor="risk_owner">Risk Owner *</Label>
                    <Input
                      id="risk_owner"
                      value={formData.risk_owner}
                      onChange={(e) => setFormData({ ...formData, risk_owner: e.target.value })}
                      placeholder="Enter risk owner..."
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="business_unit">Business Unit *</Label>
                    <Input
                      id="business_unit"
                      value={formData.business_unit || ""}
                      onChange={(e) => setFormData({ ...formData, business_unit: e.target.value })}
                      placeholder="Enter business unit..."
                    />
                  </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">
                  Risk Description *
                </Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                  placeholder="Provide detailed description of the risk..."
                  rows={4}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">
                  Status
                </Label>
                <Select value={formData.status} onValueChange={(value) => handleInputChange("status", value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Draft">Draft</SelectItem>
                    <SelectItem value="Under Review">Under Review</SelectItem>
                    <SelectItem value="Approved">Approved</SelectItem>
                    <SelectItem value="Mitigated">Mitigated</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </TabsContent>

            <TabsContent value="assessment" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label>Likelihood: {formData.likelihood}/10</Label>
                    <input
                      type="range"
                      min="1"
                      max="10"
                      value={formData.likelihood}
                      onChange={(e) => handleInputChange("likelihood", Number.parseInt(e.target.value))}
                      className="w-full h-2 bg-slate-300 rounded-lg appearance-none cursor-pointer slider"
                    />
                    <div className="flex justify-between text-xs text-slate-400 mt-1">
                      <span>Very Low</span>
                      <span>Very High</span>
                    </div>
                  </div>

                  <div>
                    <Label>Impact: {formData.impact}/10</Label>
                    <input
                      type="range"
                      min="1"
                      max="10"
                      value={formData.impact}
                      onChange={(e) => handleInputChange("impact", Number.parseInt(e.target.value))}
                      className="w-full h-2 bg-slate-300 rounded-lg appearance-none cursor-pointer slider"
                    />
                    <div className="flex justify-between text-xs text-slate-400 mt-1">
                      <span>Minimal</span>
                      <span>Catastrophic</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm">Risk Matrix</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-center space-y-2">
                        <div className="text-2xl font-bold">
                          {(formData.likelihood * formData.impact).toFixed(1)}
                        </div>
                        <Badge
                          className={getRiskLevelColor(
                            formData.likelihood * formData.impact > 70
                              ? "Critical"
                              : formData.likelihood * formData.impact > 50
                                ? "High"
                                : formData.likelihood * formData.impact > 30
                                  ? "Medium"
                                  : "Low",
                          )}
                          variant="outline"
                        >
                          {formData.likelihood * formData.impact > 70
                            ? "Critical"
                            : formData.likelihood * formData.impact > 50
                              ? "High"
                              : formData.likelihood * formData.impact > 30
                                ? "Medium"
                                : "Low"}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>

                  <Button
                    onClick={runAiAnalysis}
                    disabled={analyzing || !formData.title || !formData.description}
                    className="w-full"
                  >
                    {analyzing ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Running AI Analysis...
                      </>
                    ) : (
                      <>
                        <Zap className="h-4 w-4 mr-2" />
                        Run AI Analysis
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="analysis" className="space-y-6">
              {aiAnalysis && (
                <div className="space-y-6">
                  {/* AI Analysis Results */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Brain className="h-5 w-5 text-blue-400" />
                        AI Analysis Results
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="text-center">
                          <Label>Risk Level</Label>
                          <div className="mt-2">
                            <Badge className={getRiskLevelColor(aiAnalysis.riskLevel)} size="lg">
                              {aiAnalysis.riskLevel}
                            </Badge>
                          </div>
                        </div>
                        <div className="text-center">
                          <Label>AI Risk Score</Label>
                          <div className="text-2xl font-bold mt-2">{aiAnalysis.riskScore.toFixed(1)}</div>
                        </div>
                        <div className="text-center">
                          <Label>Confidence Level</Label>
                          <div className="mt-2">
                            <div className="text-lg font-semibold">{aiAnalysis.confidence}%</div>
                            <Progress value={aiAnalysis.confidence} className="h-2 mt-1" />
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Recommendations */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <CheckCircle className="h-5 w-5 text-green-400" />
                        AI Recommendations
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {aiAnalysis.recommendations.map((rec, index) => (
                          <div key={index} className="flex items-start gap-2 p-2 bg-slate-300/30 rounded-lg">
                            <div className="w-2 h-2 bg-gflex-shrink-0"></div>
                            <span>{rec}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Identified Threats */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <AlertTriangle className="h-5 w-5 text-red-400" />
                          Identified Threats
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          {aiAnalysis.threats.map((threat, index) => (
                            <div key={index} className="p-2 bg-slate-300/30 rounded-lg">
                              <span>{threat}</span>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>

                    {/* Vulnerabilities */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Shield className="h-5 w-5 text-orange-400" />
                          Vulnerabilities
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          {aiAnalysis.vulnerabilities.map((vuln, index) => (
                            <div key={index} className="p-2 bg-slate-300/30 rounded-lg">
                              <span>{vuln}</span>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              )}
            </TabsContent>
          </Tabs>

          {/* Action Buttons */}
          <div className="flex justify-end gap-4 pt-6 border-t border-slate-600/30">
            <Button
              variant="outline"
              onClick={() => {
                setFormData({
                  title: "",
                  description: "",
                  category: "",
                  likelihood: 5,
                  impact: 5,
                  status: "Draft",
                  risk_owner: ""
                })
                setAiAnalysis(null)
                setActiveTab("basic")
              }}
            >
              Reset Form
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={saving || !formData.title || !formData.description || !formData.category}
            >
              {saving ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Risk Assessment"
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
