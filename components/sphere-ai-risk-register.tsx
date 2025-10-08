"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Search, Eye, Edit, Trash2, Brain, AlertTriangle, Shield } from "lucide-react"
import { toast } from "sonner"

interface SphereAiRisk {
  id: number
  risk_id: string
  title: string
  description: string
  category: string
  ai_risk_level: string
  ai_risk_score: number
  ai_confidence: number
  likelihood: number
  impact: number
  status: string
  created_at: string
  updated_at: string
}

interface RiskFilters {
  search: string
  category: string
  status: string
  riskLevel: string
}

export function SphereAiRiskRegister() {
  const [risks, setRisks] = useState<SphereAiRisk[]>([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState<RiskFilters>({
    search: "",
    category: "All Categories",
    status: "All Statuses",
    riskLevel: "All Levels",
  })
  const [selectedRisk, setSelectedRisk] = useState<SphereAiRisk | null>(null)
  const [showDetails, setShowDetails] = useState(false)

  useEffect(() => {
    fetchRisks()
  }, [filters])

  const fetchRisks = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (filters.search) params.append("search", filters.search)
      if (filters.category !== "All Categories") params.append("category", filters.category)
      if (filters.status !== "All Statuses") params.append("status", filters.status)
      if (filters.riskLevel !== "All Levels") params.append("riskLevel", filters.riskLevel)

      const response = await fetch(`/api/sphere-ai-risks?${params}`)
      if (!response.ok) {
        throw new Error("Failed to fetch risks")
      }
      const data = await response.json()
      setRisks(data.risks || [])
    } catch (error) {
      console.error("Error fetching sphere AI risks:", error)
      toast.error("Failed to fetch risks")
      // Set mock data for demo
      setRisks([
        {
          id: 1,
          risk_id: "SAR-0001",
          title: "Cloud Infrastructure Vulnerability",
          description: "Critical vulnerability in cloud infrastructure requiring immediate attention",
          category: "Infrastructure Security",
          ai_risk_level: "Critical",
          ai_risk_score: 9.2,
          ai_confidence: 95,
          likelihood: 8,
          impact: 9,
          status: "Under Review",
          created_at: "2024-01-15T10:30:00Z",
          updated_at: "2024-01-15T10:30:00Z",
        },
        {
          id: 2,
          risk_id: "SAR-0002",
          title: "Data Encryption Weakness",
          description: "Weak encryption protocols detected in data storage systems",
          category: "Data Security",
          ai_risk_level: "High",
          ai_risk_score: 8.1,
          ai_confidence: 88,
          likelihood: 7,
          impact: 8,
          status: "Approved",
          created_at: "2024-01-14T15:45:00Z",
          updated_at: "2024-01-14T15:45:00Z",
        },
        {
          id: 3,
          risk_id: "SAR-0003",
          title: "Third-party API Security",
          description: "Security concerns with third-party API integrations",
          category: "Third-party Risk",
          ai_risk_level: "Medium",
          ai_risk_score: 6.5,
          ai_confidence: 82,
          likelihood: 6,
          impact: 7,
          status: "Draft",
          created_at: "2024-01-13T09:20:00Z",
          updated_at: "2024-01-13T09:20:00Z",
        },
      ])
    } finally {
      setLoading(false)
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
        return "bg-slate-500/20  border-slate-400/30"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Draft":
        return "bg-slate-500/20  border-slate-400/30"
      case "Under Review":
        return "bg-blue-500/20 text-blue-300 border-blue-400/30"
      case "Approved":
        return "bg-green-500/20 text-green-300 border-green-400/30"
      case "Mitigated":
        return "bg-purple-500/20 text-purple-300 border-purple-400/30"
      default:
        return "bg-slate-500/20  border-slate-400/30"
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const handleViewDetails = (risk: SphereAiRisk) => {
    setSelectedRisk(risk)
    setShowDetails(true)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 ">
            <Shield className="h-6 w-6 text-blue-400" />
            AI Risk Register
          </CardTitle>
          <CardDescription className="">
            Comprehensive register of AI-assessed security risks and vulnerabilities
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Search risks..."
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              />
            </div>

            <Select value={filters.category} onValueChange={(value) => setFilters({ ...filters, category: value })}>
              <SelectTrigger> 
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All Categories">All Categories</SelectItem>
                <SelectItem value="Infrastructure Security">Infrastructure Security</SelectItem>
                <SelectItem value="Data Security">Data Security</SelectItem>
                <SelectItem value="Application Security">Application Security</SelectItem>
                <SelectItem value="Third-party Risk">Third-party Risk</SelectItem>
                <SelectItem value="Compliance">Compliance</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filters.status} onValueChange={(value) => setFilters({ ...filters, status: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All Statuses">All Statuses</SelectItem>
                <SelectItem value="Draft">Draft</SelectItem>
                <SelectItem value="Under Review">Under Review</SelectItem>
                <SelectItem value="Approved">Approved</SelectItem>
                <SelectItem value="Mitigated">Mitigated</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filters.riskLevel} onValueChange={(value) => setFilters({ ...filters, riskLevel: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Risk Level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All Levels">All Levels</SelectItem>
                <SelectItem value="Critical">Critical</SelectItem>
                <SelectItem value="High">High</SelectItem>
                <SelectItem value="Medium">Medium</SelectItem>
                <SelectItem value="Low">Low</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Risk Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="truncate font-semibold">Risk ID</TableHead>
                  <TableHead className="truncate font-semibold">Title</TableHead>
                  <TableHead className="truncate font-semibold">Category</TableHead>
                  <TableHead className="truncate font-semibold">Risk Level</TableHead>
                  <TableHead className="truncate font-semibold">AI Score</TableHead>
                  <TableHead className="truncate font-semibold">Confidence</TableHead>
                  <TableHead className="truncate font-semibold">Status</TableHead>
                  <TableHead className="truncate font-semibold">Created</TableHead>
                  <TableHead className="truncate text-center font-semibold">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-8">
                      <Brain className="h-8 w-8 animate-pulse text-blue-400 mx-auto mb-2" />
                      <span className="">Loading risks...</span>
                    </TableCell>
                  </TableRow>
                ) : risks.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-8">
                      <AlertTriangle className="h-8 w-8 text-slate-400 mx-auto mb-2" />
                      <span className="">No risks found</span>
                    </TableCell>
                  </TableRow>
                ) : (
                  risks.map((risk) => (
                    <TableRow key={risk.id}>
                      <TableCell className="font-mono text-blue-400 truncate">{risk.risk_id}</TableCell>
                      <TableCell className=" font-medium max-w-xs truncate">{risk.title}</TableCell>
                      <TableCell className="">{risk.category}</TableCell>
                      <TableCell className="truncate">
                        <Badge variant="outline" className={getRiskLevelColor(risk.ai_risk_level)}>{risk.ai_risk_level}</Badge>
                      </TableCell>
                      <TableCell className=" font-semibold">{Number(risk.ai_risk_score).toFixed(1)}</TableCell>
                      <TableCell className="">{risk.ai_confidence}%</TableCell>
                      <TableCell className="truncate">
                        <Badge variant="outline" className={getStatusColor(risk.status)}>{risk.status}</Badge>
                      </TableCell>
                      <TableCell className="">{formatDate(risk.created_at)}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleViewDetails(risk)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-400 hover:bg-red-900/20 hover:text-red-300 dark:text-red-400 dark:hover:bg-red-900/20 dark:hover:text-red-300"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Risk Details Dialog */}
      <Dialog open={showDetails} onOpenChange={setShowDetails}>
        <DialogContent className="bg-gradient-to-br from-slate-800 to-slate-900 border-slate-600  max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-blue-400" />
              Risk Details: {selectedRisk?.risk_id}
            </DialogTitle>
            <DialogDescription className="">
              Detailed information about the AI-assessed risk
            </DialogDescription>
          </DialogHeader>

          {selectedRisk && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium ">Risk Level</label>
                  <Badge className={`${getRiskLevelColor(selectedRisk.ai_risk_level)} mt-1`}>
                    {selectedRisk.ai_risk_level}
                  </Badge>
                </div>
                <div>
                  <label className="text-sm font-medium ">Status</label>
                  <Badge className={`${getStatusColor(selectedRisk.status)} mt-1`}>{selectedRisk.status}</Badge>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium ">Title</label>
                <p className=" mt-1">{selectedRisk.title}</p>
              </div>

              <div>
                <label className="text-sm font-medium ">Description</label>
                <p className="text-slate-200 mt-1">{selectedRisk.description}</p>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium ">AI Risk Score</label>
                  <p className=" font-semibold text-lg mt-1">{selectedRisk.ai_risk_score.toFixed(1)}</p>
                </div>
                <div>
                  <label className="text-sm font-medium ">AI Confidence</label>
                  <p className=" font-semibold text-lg mt-1">{selectedRisk.ai_confidence}%</p>
                </div>
                <div>
                  <label className="text-sm font-medium ">Category</label>
                  <p className=" mt-1">{selectedRisk.category}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium ">Likelihood</label>
                  <p className=" font-semibold text-lg mt-1">{selectedRisk.likelihood}/10</p>
                </div>
                <div>
                  <label className="text-sm font-medium ">Impact</label>
                  <p className=" font-semibold text-lg mt-1">{selectedRisk.impact}/10</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium ">Created</label>
                  <p className="text-slate-200 mt-1">{formatDate(selectedRisk.created_at)}</p>
                </div>
                <div>
                  <label className="text-sm font-medium ">Last Updated</label>
                  <p className="text-slate-200 mt-1">{formatDate(selectedRisk.updated_at)}</p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
