"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useToast } from "@/hooks/use-toast"
import {
  Brain,
  Shield,
  Bug,
  AlertTriangle,
  CheckCircle,
  Clock,
  Download,
  Eye,
  Target,
  Sparkles,
  Activity,
  Cpu,
} from "lucide-react"

interface AIAnalysisResult {
  id: number
  analysis_type: string
  analysis_content: string
  created_at: string
  updated_at: string
}

const analysisTypeConfig = {
  risk_exposure: {
    title: "Risk Exposure Analysis",
    icon: Target,
    color: "from-red-500 to-pink-600",
    bgGlow: "bg-red-500/20",
    textColor: "text-red-400",
    description: "AI-powered risk assessment and treatment recommendations",
  },
  threat_landscape: {
    title: "Threat Landscape Analysis",
    icon: Shield,
    color: "from-orange-500 to-red-500",
    bgGlow: "bg-orange-500/20",
    textColor: "text-orange-400",
    description: "Cybersecurity threat intelligence and defensive strategies",
  },
  vulnerability_remediation: {
    title: "Vulnerability Remediation",
    icon: Bug,
    color: "from-yellow-500 to-orange-500",
    bgGlow: "bg-yellow-500/20",
    textColor: "text-yellow-400",
    description: "Vulnerability prioritization and remediation strategies",
  },
  incident_patterns: {
    title: "Incident Pattern Analysis",
    icon: AlertTriangle,
    color: "from-purple-500 to-pink-500",
    bgGlow: "bg-purple-500/20",
    textColor: "text-purple-400",
    description: "Incident trends and response effectiveness analysis",
  },
  compliance_remediation: {
    title: "Compliance Remediation",
    icon: CheckCircle,
    color: "from-blue-500 to-cyan-500",
    bgGlow: "bg-blue-500/20",
    textColor: "text-blue-400",
    description: "Regulatory compliance gap analysis and remediation",
  },
  integrated_grc: {
    title: "Integrated GRC Analysis",
    icon: Brain,
    color: "from-green-500 to-emerald-500",
    bgGlow: "bg-green-500/20",
    textColor: "text-green-400",
    description: "Comprehensive organizational risk posture assessment",
  },
}

export default function AIGRCDashboard() {
  const [analysisResults, setAnalysisResults] = useState<AIAnalysisResult[]>([])
  const [loading, setLoading] = useState(true)
  const [triggering, setTriggering] = useState(false)
  const [selectedAnalysis, setSelectedAnalysis] = useState<AIAnalysisResult | null>(null)
  const [activeTab, setActiveTab] = useState("overview")
  const { toast } = useToast()

  useEffect(() => {
    fetchAnalysisResults()
  }, [])

  const fetchAnalysisResults = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/ai-analysis?limit=50")
      const data = await response.json()

      if (data.success) {
        setAnalysisResults(data.data)
      } else {
        toast({
          title: "Error",
          description: "Failed to fetch AI analysis results",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error fetching analysis results:", error)
      toast({
        title: "Error",
        description: "Failed to fetch AI analysis results",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const triggerAIAnalysis = async () => {
    try {
      setTriggering(true)
      toast({
        title: "AI Analysis Started",
        description: "Running comprehensive GRC analysis with AI...",
      })

      const response = await fetch("/api/ai-analysis/trigger", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ analysis_types: ["all"] }),
      })

      const data = await response.json()

      if (data.success) {
        toast({
          title: "AI Analysis Completed",
          description: "New AI insights have been generated successfully",
        })
        await fetchAnalysisResults()
      } else {
        toast({
          title: "Analysis Failed",
          description: data.error || "Failed to complete AI analysis",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error triggering AI analysis:", error)
      toast({
        title: "Error",
        description: "Failed to trigger AI analysis",
        variant: "destructive",
      })
    } finally {
      setTriggering(false)
    }
  }

  const getLatestAnalysisByType = (type: string) => {
    return analysisResults
      .filter((result) => result.analysis_type === type)
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())[0]
  }

  const formatAnalysisContent = (content: string) => {
    const sections = content.split(/\d+\.\s+[A-Z\s]+:/)
    return sections.map((section, index) => (
      <div key={index} className="mb-6 group">
        {section.trim() && (
          <div className="relative">
            <div className="absolute -left-4 top-0 w-1 h-full bg-gradient-to-b from-cyan-400 to-blue-600 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="bg-gradient-to-r from-slate-900/50 to-slate-800/30 backdrop-blur-sm border border-slate-700/50 rounded-lg p-4 hover:border-cyan-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/20">
              <div className="whitespace-pre-wrap text-sm leading-relaxed text-slate-300 font-mono">
                {section.trim()}
              </div>
            </div>
          </div>
        )}
      </div>
    ))
  }

  const exportAnalysis = (analysis: AIAnalysisResult) => {
    const blob = new Blob([analysis.analysis_content], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${analysis.analysis_type}_${new Date(analysis.created_at).toISOString().split("T")[0]}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin"></div>
          <div className="absolute inset-0 w-16 h-16 border-4 border-purple-500/30 border-b-purple-500 rounded-full animate-spin animate-reverse"></div>
          <Cpu className="absolute inset-0 m-auto h-6 w-6 text-cyan-400 animate-pulse" />
        </div>
        <span className="ml-4 text-slate-300 font-mono animate-pulse">Initializing AI Analysis Engine...</span>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Futuristic Header */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 via-purple-500/10 to-pink-500/10 animate-pulse"></div>
        <div className="relative flex items-center justify-between p-6 backdrop-blur-sm border border-slate-700/50 rounded-xl">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-purple-600 rounded-full blur-lg opacity-75 animate-pulse"></div>
              <div className="relative bg-gradient-to-r from-cyan-500 to-purple-600 p-3 rounded-full">
                <Brain className="h-8 w-8 text-white" />
              </div>
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 bg-clip-text text-transparent animate-pulse">
                AI GRC Analysis Engine
              </h1>
              <p className="text-slate-400 font-mono mt-2">
                Advanced AI-powered insights for Risk, Governance, and Compliance management
              </p>
            </div>
          </div>
          <Button
            onClick={triggerAIAnalysis}
            disabled={triggering}
            className="relative overflow-hidden bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-700 hover:to-purple-700 border-0 px-8 py-3 text-lg font-semibold transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-cyan-500/25"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
            {triggering ? (
              <>
                <div className="flex items-center space-x-2">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Analyzing...</span>
                </div>
              </>
            ) : (
              <>
                <Sparkles className="h-5 w-5 mr-2" />
                Run AI Analysis
              </>
            )}
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 bg-slate-900/50 backdrop-blur-sm border border-slate-700/50">
          <TabsTrigger
            value="overview"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-500 data-[state=active]:to-purple-600 data-[state=active]:text-white transition-all duration-300"
          >
            Analysis Overview
          </TabsTrigger>
          <TabsTrigger
            value="detailed"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-500 data-[state=active]:to-purple-600 data-[state=active]:text-white transition-all duration-300"
          >
            Detailed Results
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-8">
          {/* Futuristic Analysis Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Object.entries(analysisTypeConfig).map(([type, config]) => {
              const latestAnalysis = getLatestAnalysisByType(type)
              const Icon = config.icon

              return (
                <Card
                  key={type}
                  className="group relative overflow-hidden bg-slate-900/50 backdrop-blur-sm border border-slate-700/50 hover:border-cyan-500/50 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-cyan-500/20"
                >
                  {/* Animated background glow */}
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${config.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}
                  ></div>

                  {/* Animated border glow */}
                  <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-cyan-500/0 via-cyan-500/50 to-cyan-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm"></div>

                  <CardHeader className="relative pb-3">
                    <div className="flex items-center space-x-3">
                      <div
                        className={`relative p-3 rounded-lg bg-gradient-to-br ${config.color} group-hover:scale-110 transition-transform duration-300`}
                      >
                        <div className="absolute inset-0 bg-white/20 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        <Icon className="relative h-6 w-6 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-xl text-slate-200 group-hover:text-white transition-colors duration-300">
                          {config.title}
                        </CardTitle>
                        <CardDescription className="text-sm text-slate-400 font-mono">
                          {config.description}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="relative">
                    {latestAnalysis ? (
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <Badge
                            variant="outline"
                            className="text-xs border-slate-600 text-slate-300 bg-slate-800/50 backdrop-blur-sm"
                          >
                            <Clock className="h-3 w-3 mr-1" />
                            {new Date(latestAnalysis.created_at).toLocaleDateString()}
                          </Badge>
                          <div className="flex space-x-2">
                            <Button
                              size="sm"
                              variant="accent"
                              onClick={() => setSelectedAnalysis(latestAnalysis)}
                            >
                              <Eye className="h-3 w-3" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => exportAnalysis(latestAnalysis)}
                            >
                              <Download className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                        <div className="relative">
                          <div className="absolute -left-2 top-0 w-0.5 h-full bg-gradient-to-b from-cyan-400 to-transparent opacity-50"></div>
                          <div className="text-sm text-slate-400 line-clamp-3 pl-4 font-mono">
                            {latestAnalysis.analysis_content.substring(0, 150)}...
                          </div>
                        </div>
                      </div>
                    ) : (
                      <Alert className="border-slate-700 bg-slate-800/50 backdrop-blur-sm">
                        <AlertTriangle className="h-4 w-4 text-amber-400" />
                        <AlertDescription className="text-slate-300 font-mono">
                          No analysis available. Run AI analysis to generate insights.
                        </AlertDescription>
                      </Alert>
                    )}
                  </CardContent>
                </Card>
              )
            })}
          </div>

          {/* Futuristic Stats Summary */}
          {analysisResults.length > 0 && (
            <Card className="relative overflow-hidden bg-slate-900/50 backdrop-blur-sm border border-slate-700/50">
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 via-purple-500/5 to-pink-500/5 animate-pulse"></div>
              <CardHeader className="relative">
                <CardTitle className="text-2xl bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
                  Analysis Intelligence Summary
                </CardTitle>
                <CardDescription className="text-slate-400 font-mono">
                  Real-time AI-generated insights across all GRC domains
                </CardDescription>
              </CardHeader>
              <CardContent className="relative">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="text-center group">
                    <div className="relative inline-block">
                      <div className="absolute inset-0 bg-blue-500 rounded-full blur-lg opacity-50 group-hover:opacity-75 transition-opacity duration-300"></div>
                      <div className="relative text-4xl font-bold text-blue-400 font-mono">
                        {analysisResults.length}
                      </div>
                    </div>
                    <div className="text-sm text-slate-400 mt-2 font-mono">Total Analyses</div>
                    <div className="w-full h-1 bg-slate-700 rounded-full mt-2 overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full animate-pulse"></div>
                    </div>
                  </div>
                  <div className="text-center group">
                    <div className="relative inline-block">
                      <div className="absolute inset-0 bg-green-500 rounded-full blur-lg opacity-50 group-hover:opacity-75 transition-opacity duration-300"></div>
                      <div className="relative text-4xl font-bold text-green-400 font-mono">
                        {Object.keys(analysisTypeConfig).filter((type) => getLatestAnalysisByType(type)).length}
                      </div>
                    </div>
                    <div className="text-sm text-slate-400 mt-2 font-mono">Active Domains</div>
                    <div className="w-full h-1 bg-slate-700 rounded-full mt-2 overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-green-500 to-emerald-500 rounded-full animate-pulse"></div>
                    </div>
                  </div>
                  <div className="text-center group">
                    <div className="relative inline-block">
                      <div className="absolute inset-0 bg-purple-500 rounded-full blur-lg opacity-50 group-hover:opacity-75 transition-opacity duration-300"></div>
                      <div className="relative text-4xl font-bold text-purple-400 font-mono">
                        {analysisResults.length > 0
                          ? Math.round(
                              (Date.now() - new Date(analysisResults[0].created_at).getTime()) / (1000 * 60 * 60 * 24),
                            )
                          : 0}
                      </div>
                    </div>
                    <div className="text-sm text-slate-400 mt-2 font-mono">Days Since Last</div>
                    <div className="w-full h-1 bg-slate-700 rounded-full mt-2 overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full animate-pulse"></div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="detailed" className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Futuristic Analysis List */}
            <Card className="lg:col-span-1 bg-slate-900/50 backdrop-blur-sm border border-slate-700/50">
              <CardHeader>
                <CardTitle className="text-xl bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
                  Analysis History
                </CardTitle>
                <CardDescription className="text-slate-400 font-mono">
                  Click to view detailed analysis results
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <ScrollArea className="h-96">
                  {analysisResults.map((analysis) => {
                    const config = analysisTypeConfig[analysis.analysis_type as keyof typeof analysisTypeConfig]
                    const Icon = config?.icon || Brain

                    return (
                      <div
                        key={analysis.id}
                        className={`group relative p-4 border-b border-slate-700/50 cursor-pointer hover:bg-slate-800/50 transition-all duration-300 ${
                          selectedAnalysis?.id === analysis.id ? "bg-slate-800/50 border-l-4 border-l-cyan-500" : ""
                        }`}
                        onClick={() => setSelectedAnalysis(analysis)}
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/0 to-purple-500/0 group-hover:from-cyan-500/5 group-hover:to-purple-500/5 transition-all duration-300"></div>
                        <div className="relative flex items-center space-x-3">
                          <div
                            className={`p-2 rounded-lg bg-gradient-to-br ${config?.color || "from-gray-500 to-gray-600"} group-hover:scale-110 transition-transform duration-300`}
                          >
                            <Icon className="h-4 w-4 text-white" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-medium truncate text-slate-200 group-hover:text-white transition-colors duration-300">
                              {config?.title || analysis.analysis_type}
                            </div>
                            <div className="text-xs text-slate-400 font-mono">
                              {new Date(analysis.created_at).toLocaleString()}
                            </div>
                          </div>
                          <Activity className="h-4 w-4 text-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        </div>
                      </div>
                    )
                  })}
                </ScrollArea>
              </CardContent>
            </Card>

            {/* Futuristic Analysis Detail */}
            <Card className="lg:col-span-2 bg-slate-900/50 backdrop-blur-sm border border-slate-700/50">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-xl bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
                      {selectedAnalysis
                        ? analysisTypeConfig[selectedAnalysis.analysis_type as keyof typeof analysisTypeConfig]
                            ?.title || selectedAnalysis.analysis_type
                        : "Select Analysis"}
                    </CardTitle>
                    {selectedAnalysis && (
                      <CardDescription className="text-slate-400 font-mono mt-2">
                        Generated on {new Date(selectedAnalysis.created_at).toLocaleString()}
                      </CardDescription>
                    )}
                  </div>
                  {selectedAnalysis && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => exportAnalysis(selectedAnalysis)}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Export
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {selectedAnalysis ? (
                  <ScrollArea className="h-96">
                    <div className="space-y-4">{formatAnalysisContent(selectedAnalysis.analysis_content)}</div>
                  </ScrollArea>
                ) : (
                  <div className="flex items-center justify-center h-96 text-slate-400">
                    <div className="text-center">
                      <div className="relative mb-6">
                        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-full blur-2xl opacity-20 animate-pulse"></div>
                        <Brain className="relative h-16 w-16 mx-auto text-slate-500" />
                      </div>
                      <p className="font-mono text-lg">Select an analysis from the list to view detailed results</p>
                      <div className="mt-4 flex justify-center space-x-1">
                        <div className="w-2 h-2 bg-cyan-500 rounded-full animate-bounce"></div>
                        <div
                          className="w-2 h-2 bg-purple-500 rounded-full animate-bounce"
                          style={{ animationDelay: "0.1s" }}
                        ></div>
                        <div
                          className="w-2 h-2 bg-pink-500 rounded-full animate-bounce"
                          style={{ animationDelay: "0.2s" }}
                        ></div>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
