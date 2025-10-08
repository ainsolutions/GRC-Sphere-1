"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Search, Eye, RefreshCw, AlertTriangle, Plus, Edit, Trash2, Calendar, Shield, DollarSign } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import StarBorder from "@/app/StarBorder"

interface VendorRisk {
  id: number
  evaluation_id: string
  vendor_id: number
  vendor_name: string
  evaluation_name: string
  evaluation_type: string
  overall_risk_level: string
  overall_risk_score: number
  security_score: number
  operational_score: number
  financial_score: number
  compliance_score: number
  privacy_score: number
  business_continuity_score: number
  evaluation_date: string
  next_review_date: string
  evaluation_status: string
  key_findings: string
  recommendations: string
  evaluator_name: string
  created_at: string
  updated_at: string
}

interface RiskStats {
  total_risks: number
  critical_risks: number
  high_risks: number
  medium_risks: number
  low_risks: number
  overdue_reviews: number
  avg_risk_score: number
}

export function VendorRiskRegister() {
  const [risks, setRisks] = useState<VendorRisk[]>([])
  const [stats, setStats] = useState<RiskStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [riskLevelFilter, setRiskLevelFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [totalItems, setTotalItems] = useState(0)
  const [totalPages, setTotalPages] = useState(1)
  const [itemsPerPage] = useState(10)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [selectedRisk, setSelectedRisk] = useState<VendorRisk | null>(null)
  const [formData, setFormData] = useState({
    vendor_id: "",
    evaluation_name: "",
    evaluation_type: "Comprehensive",
    security_score: "",
    operational_score: "",
    financial_score: "",
    compliance_score: "",
    privacy_score: "",
    business_continuity_score: "",
    key_findings: "",
    recommendations: "",
    evaluator_name: "",
  })
  const { toast } = useToast()

  const fetchRisks = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: itemsPerPage.toString(),
        search: searchTerm,
      })

      if (riskLevelFilter !== "all") {
        params.append("riskLevel", riskLevelFilter)
      }
      if (statusFilter !== "all") {
        params.append("status", statusFilter)
      }

      const response = await fetch(`/api/third-party-risk-evaluations?${params}`)
      const data = await response.json()

      if (data.success) {
        setRisks(data.data.evaluations || [])
        setTotalItems(data.data.pagination?.total || 0)
        setTotalPages(data.data.pagination?.totalPages || 1)
      } else {
        throw new Error(data.error)
      }
    } catch (error) {
      console.error("Error fetching vendor risks:", error)
      toast({
        title: "Error",
        description: "Failed to fetch vendor risks",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const fetchStats = async () => {
    try {
      const response = await fetch("/api/third-party-risk-evaluations/stats")
      const data = await response.json()

      if (data.success) {
        setStats(data.data.stats)
      }
    } catch (error) {
      console.error("Error fetching risk stats:", error)
    }
  }

  useEffect(() => {
    fetchStats()
  }, [])

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchRisks()
    }, 300)

    return () => clearTimeout(timeoutId)
  }, [searchTerm, riskLevelFilter, statusFilter, currentPage])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const url = selectedRisk
        ? `/api/third-party-risk-evaluations/${selectedRisk.id}`
        : "/api/third-party-risk-evaluations"
      const method = selectedRisk ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (data.success) {
        toast({
          title: "Success",
          description: `Vendor risk ${selectedRisk ? "updated" : "created"} successfully`,
        })
        setIsAddDialogOpen(false)
        setIsEditDialogOpen(false)
        setSelectedRisk(null)
        setFormData({
          vendor_id: "",
          evaluation_name: "",
          evaluation_type: "Comprehensive",
          security_score: "",
          operational_score: "",
          financial_score: "",
          compliance_score: "",
          privacy_score: "",
          business_continuity_score: "",
          key_findings: "",
          recommendations: "",
          evaluator_name: "",
        })
        fetchRisks()
        fetchStats()
      } else {
        throw new Error(data.error)
      }
    } catch (error) {
      console.error("Error saving vendor risk:", error)
      toast({
        title: "Error",
        description: `Failed to ${selectedRisk ? "update" : "create"} vendor risk`,
        variant: "destructive",
      })
    }
  }

  const handleDelete = async (riskId: number) => {
    try {
      const response = await fetch(`/api/third-party-risk-evaluations/${riskId}`, {
        method: "DELETE",
      })

      const data = await response.json()

      if (data.success) {
        toast({
          title: "Success",
          description: "Vendor risk deleted successfully",
        })
        fetchRisks()
        fetchStats()
      } else {
        throw new Error(data.error)
      }
    } catch (error) {
      console.error("Error deleting vendor risk:", error)
      toast({
        title: "Error",
        description: "Failed to delete vendor risk",
        variant: "destructive",
      })
    }
  }

  const handleView = (risk: VendorRisk) => {
    setSelectedRisk(risk)
    setIsViewDialogOpen(true)
  }

  const handleEdit = (risk: VendorRisk) => {
    setSelectedRisk(risk)
    setFormData({
      vendor_id: risk.vendor_id.toString(),
      evaluation_name: risk.evaluation_name,
      evaluation_type: risk.evaluation_type,
      security_score: risk.security_score?.toString() || "",
      operational_score: risk.operational_score?.toString() || "",
      financial_score: risk.financial_score?.toString() || "",
      compliance_score: risk.compliance_score?.toString() || "",
      privacy_score: risk.privacy_score?.toString() || "",
      business_continuity_score: risk.business_continuity_score?.toString() || "",
      key_findings: risk.key_findings || "",
      recommendations: risk.recommendations || "",
      evaluator_name: risk.evaluator_name || "",
    })
    setIsEditDialogOpen(true)
  }

  const getRiskLevelColor = (level: string) => {
    switch (level) {
      case "Critical":
        return "bg-red-600 text-white"
      case "High":
        return "bg-orange-500 text-white"
      case "Medium":
        return "bg-yellow-500 text-white"
      case "Low":
        return "bg-blue-500 text-white"
      default:
        return "bg-gray-500 text-white"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed":
        return "bg-green-100 text-green-800"
      case "In Progress":
        return "bg-blue-100 text-blue-800"
      case "Pending":
        return "bg-yellow-100 text-yellow-800"
      case "Overdue":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const isOverdue = (nextReviewDate: string) => {
    if (!nextReviewDate) return false
    return new Date(nextReviewDate) < new Date()
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-red-600" />
                <h1 className="text-lg font-bold text-blue-600/100 dark:text-blue-500/100">Vendor Risk Register</h1>
              </CardTitle>
              <CardDescription>Comprehensive vendor risk evaluations and monitoring</CardDescription>
            </div>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="accent" onClick={() => setIsAddDialogOpen(true)}>
                  Add Risk Evaluation
                  </Button> 
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Add New Risk Evaluation</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="vendor_id">Vendor ID</Label>
                      <Input
                        id="vendor_id"
                        value={formData.vendor_id}
                        onChange={(e) => setFormData({ ...formData, vendor_id: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="evaluation_name">Evaluation Name</Label>
                      <Input
                        id="evaluation_name"
                        value={formData.evaluation_name}
                        onChange={(e) => setFormData({ ...formData, evaluation_name: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="evaluation_type">Evaluation Type</Label>
                      <Select
                        value={formData.evaluation_type}
                        onValueChange={(value) => setFormData({ ...formData, evaluation_type: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Initial">Initial</SelectItem>
                          <SelectItem value="Annual">Annual</SelectItem>
                          <SelectItem value="Comprehensive">Comprehensive</SelectItem>
                          <SelectItem value="Targeted">Targeted</SelectItem>
                          <SelectItem value="Incident-Driven">Incident-Driven</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="evaluator_name">Evaluator Name</Label>
                      <Input
                        id="evaluator_name"
                        value={formData.evaluator_name}
                        onChange={(e) => setFormData({ ...formData, evaluator_name: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="security_score">Security Score (0-100)</Label>
                      <Input
                        id="security_score"
                        type="number"
                        min="0"
                        max="100"
                        value={formData.security_score}
                        onChange={(e) => setFormData({ ...formData, security_score: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="operational_score">Operational Score (0-100)</Label>
                      <Input
                        id="operational_score"
                        type="number"
                        min="0"
                        max="100"
                        value={formData.operational_score}
                        onChange={(e) => setFormData({ ...formData, operational_score: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="financial_score">Financial Score (0-100)</Label>
                      <Input
                        id="financial_score"
                        type="number"
                        min="0"
                        max="100"
                        value={formData.financial_score}
                        onChange={(e) => setFormData({ ...formData, financial_score: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="compliance_score">Compliance Score (0-100)</Label>
                      <Input
                        id="compliance_score"
                        type="number"
                        min="0"
                        max="100"
                        value={formData.compliance_score}
                        onChange={(e) => setFormData({ ...formData, compliance_score: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="privacy_score">Privacy Score (0-100)</Label>
                      <Input
                        id="privacy_score"
                        type="number"
                        min="0"
                        max="100"
                        value={formData.privacy_score}
                        onChange={(e) => setFormData({ ...formData, privacy_score: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="business_continuity_score">Business Continuity Score (0-100)</Label>
                      <Input
                        id="business_continuity_score"
                        type="number"
                        min="0"
                        max="100"
                        value={formData.business_continuity_score}
                        onChange={(e) => setFormData({ ...formData, business_continuity_score: e.target.value })}
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="key_findings">Key Findings</Label>
                    <Textarea
                      id="key_findings"
                      value={formData.key_findings}
                      onChange={(e) => setFormData({ ...formData, key_findings: e.target.value })}
                      rows={3}
                    />
                  </div>

                  <div>
                    <Label htmlFor="recommendations">Recommendations</Label>
                    <Textarea
                      id="recommendations"
                      value={formData.recommendations}
                      onChange={(e) => setFormData({ ...formData, recommendations: e.target.value })}
                      rows={3}
                    />
                  </div>

                  <div className="flex justify-end space-x-2">
                    <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button type="submit">Create Risk Evaluation</Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          {/* Statistics */}
          {stats && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <Shield className="h-4 w-4 text-blue-600/100 dark:text-blue-500/100" />
                    Total Risks
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-600/100 dark:text-blue-500/100">{stats.total_risks}</div>
                  <div className="text-xs text-muted-foreground">
                    {stats.critical_risks} critical, {stats.high_risks} high
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-red-600/100 dark:text-red-500/100" />
                    High Risk
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-red-600/100 dark:text-red-500/100">{stats.critical_risks + stats.high_risks}</div>
                  <div className="text-xs text-muted-foreground">
                    {stats.critical_risks} critical, {stats.high_risks} high
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-orange-600/100 dark:text-orange-500/100" />
                    Overdue Reviews
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-orange-600/100 dark:text-orange-500/100">{stats.overdue_reviews}</div>
                  <div className="text-xs text-muted-foreground">Require immediate attention</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-green-600/100 dark:text-green-500/100" />
                    Avg Risk Score
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600/100 dark:text-green-500/100">
                    {stats.avg_risk_score ? stats.avg_risk_score.toFixed(1) : "N/A"}
                  </div>
                  <div className="text-xs text-muted-foreground">Out of 100</div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Filters and Search */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Search className="h-4 w-4 text-muted-foreground/100 dark:text-muted-foreground/100"/>
                <Input
                  placeholder="Search vendor risks..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="max-w-sm"
                />
              </div>
              <Select value={riskLevelFilter} onValueChange={setRiskLevelFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Risk Level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Levels</SelectItem>
                  <SelectItem value="Critical">Critical</SelectItem>
                  <SelectItem value="High">High</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="Low">Low</SelectItem>
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
                  <SelectItem value="In Progress">In Progress</SelectItem>
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="Overdue">Overdue</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button variant="outline" onClick={fetchRisks} disabled={loading}>
              <RefreshCw className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`} />
              Refresh
            </Button>
          </div>

          {/* Table */}
          {loading ? (
            <div className="flex justify-center items-center py-8">
              <RefreshCw className="h-6 w-6 animate-spin text-blue-600/100" />
              <span className="ml-2">Loading vendor risks...</span>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Evaluation ID</TableHead>
                    <TableHead>Vendor</TableHead>
                    <TableHead>Risk Level</TableHead>
                    <TableHead>Overall Score</TableHead>
                    <TableHead>Category Scores</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Next Review</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {risks.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                        No vendor risks found. Try adjusting your search criteria.
                      </TableCell>
                    </TableRow>
                  ) : (
                    risks.map((risk) => (
                      <TableRow key={risk.id}>
                        <TableCell className="font-mono text-sm">{risk.evaluation_id}</TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="font-medium">{risk.vendor_name}</div>
                            <div className="text-sm text-muted-foreground">{risk.evaluation_name}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={getRiskLevelColor(risk.overall_risk_level)}>
                            {risk.overall_risk_level}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <span className="text-lg font-semibold">{risk.overall_risk_score}</span>
                            <span className="text-sm text-muted-foreground">/100</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1 text-xs">
                            <div>Security: {risk.security_score || "N/A"}</div>
                            <div>Operational: {risk.operational_score || "N/A"}</div>
                            <div>Financial: {risk.financial_score || "N/A"}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(risk.evaluation_status)}>{risk.evaluation_status}</Badge>
                        </TableCell>
                        <TableCell>
                          {risk.next_review_date ? (
                            <div className="space-y-1">
                              <div className="text-sm">{new Date(risk.next_review_date).toLocaleDateString()}</div>
                              {isOverdue(risk.next_review_date) && (
                                <Badge variant="destructive" className="text-xs">
                                  Overdue
                                </Badge>
                              )}
                            </div>
                          ) : (
                            <span className="text-muted-foreground">N/A</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-1">
                            <Button variant="ghost" size="sm" onClick={() => handleView(risk)}>
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => handleEdit(risk)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  <Trash2 className="h-4 w-4 text-red-600" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Delete Risk Evaluation</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Are you sure you want to delete this risk evaluation for "{risk.vendor_name}"? This
                                    action cannot be undone.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => handleDelete(risk.id)}
                                    className="bg-red-600 hover:bg-red-700"
                                  >
                                    Delete
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          )}

          {/* Pagination */}
          {risks.length > 0 && totalPages > 1 && (
            <div className="mt-6 flex justify-center">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      href="#"
                      onClick={(e) => {
                        e.preventDefault()
                        if (currentPage > 1) {
                          setCurrentPage(currentPage - 1)
                        }
                      }}
                      className={currentPage <= 1 ? "pointer-events-none opacity-50" : ""}
                    />
                  </PaginationItem>

                  {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                    let page: number
                    if (totalPages <= 5) {
                      page = i + 1
                    } else if (currentPage <= 3) {
                      page = i + 1
                    } else if (currentPage >= totalPages - 2) {
                      page = totalPages - 4 + i
                    } else {
                      page = currentPage - 2 + i
                    }

                    return (
                      <PaginationItem key={page}>
                        <PaginationLink
                          href="#"
                          onClick={(e) => {
                            e.preventDefault()
                            setCurrentPage(page)
                          }}
                          isActive={currentPage === page}
                        >
                          {page}
                        </PaginationLink>
                      </PaginationItem>
                    )
                  })}

                  <PaginationItem>
                    <PaginationNext
                      href="#"
                      onClick={(e) => {
                        e.preventDefault()
                        if (currentPage < totalPages) {
                          setCurrentPage(currentPage + 1)
                        }
                      }}
                      className={currentPage >= totalPages ? "pointer-events-none opacity-50" : ""}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </CardContent>
      </Card>

      {/* View Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Risk Evaluation Details</DialogTitle>
          </DialogHeader>
          {selectedRisk && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Evaluation ID</label>
                  <p className="text-sm font-mono bg-gray-100 p-2 rounded">{selectedRisk.evaluation_id}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Vendor Name</label>
                  <p className="text-sm font-semibold">{selectedRisk.vendor_name}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Risk Level</label>
                  <Badge className={getRiskLevelColor(selectedRisk.overall_risk_level)}>
                    {selectedRisk.overall_risk_level}
                  </Badge>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Overall Score</label>
                  <p className="text-sm font-semibold">{selectedRisk.overall_risk_score}/100</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Status</label>
                  <Badge className={getStatusColor(selectedRisk.evaluation_status)}>
                    {selectedRisk.evaluation_status}
                  </Badge>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Security Score</label>
                  <p className="text-sm">{selectedRisk.security_score || "N/A"}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Operational Score</label>
                  <p className="text-sm">{selectedRisk.operational_score || "N/A"}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Financial Score</label>
                  <p className="text-sm">{selectedRisk.financial_score || "N/A"}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Compliance Score</label>
                  <p className="text-sm">{selectedRisk.compliance_score || "N/A"}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Privacy Score</label>
                  <p className="text-sm">{selectedRisk.privacy_score || "N/A"}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Business Continuity</label>
                  <p className="text-sm">{selectedRisk.business_continuity_score || "N/A"}</p>
                </div>
              </div>

              {selectedRisk.key_findings && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Key Findings</label>
                  <p className="text-sm bg-gray-50 p-3 rounded">{selectedRisk.key_findings}</p>
                </div>
              )}

              {selectedRisk.recommendations && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Recommendations</label>
                  <p className="text-sm bg-gray-50 p-3 rounded">{selectedRisk.recommendations}</p>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Evaluator</label>
                  <p className="text-sm">{selectedRisk.evaluator_name || "N/A"}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Evaluation Date</label>
                  <p className="text-sm">
                    {selectedRisk.evaluation_date ? new Date(selectedRisk.evaluation_date).toLocaleDateString() : "N/A"}
                  </p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Risk Evaluation</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit_vendor_id">Vendor ID</Label>
                <Input
                  id="edit_vendor_id"
                  value={formData.vendor_id}
                  onChange={(e) => setFormData({ ...formData, vendor_id: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="edit_evaluation_name">Evaluation Name</Label>
                <Input
                  id="edit_evaluation_name"
                  value={formData.evaluation_name}
                  onChange={(e) => setFormData({ ...formData, evaluation_name: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit_evaluation_type">Evaluation Type</Label>
                <Select
                  value={formData.evaluation_type}
                  onValueChange={(value) => setFormData({ ...formData, evaluation_type: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Initial">Initial</SelectItem>
                    <SelectItem value="Annual">Annual</SelectItem>
                    <SelectItem value="Comprehensive">Comprehensive</SelectItem>
                    <SelectItem value="Targeted">Targeted</SelectItem>
                    <SelectItem value="Incident-Driven">Incident-Driven</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="edit_evaluator_name">Evaluator Name</Label>
                <Input
                  id="edit_evaluator_name"
                  value={formData.evaluator_name}
                  onChange={(e) => setFormData({ ...formData, evaluator_name: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="edit_security_score">Security Score (0-100)</Label>
                <Input
                  id="edit_security_score"
                  type="number"
                  min="0"
                  max="100"
                  value={formData.security_score}
                  onChange={(e) => setFormData({ ...formData, security_score: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="edit_operational_score">Operational Score (0-100)</Label>
                <Input
                  id="edit_operational_score"
                  type="number"
                  min="0"
                  max="100"
                  value={formData.operational_score}
                  onChange={(e) => setFormData({ ...formData, operational_score: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="edit_financial_score">Financial Score (0-100)</Label>
                <Input
                  id="edit_financial_score"
                  type="number"
                  min="0"
                  max="100"
                  value={formData.financial_score}
                  onChange={(e) => setFormData({ ...formData, financial_score: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="edit_compliance_score">Compliance Score (0-100)</Label>
                <Input
                  id="edit_compliance_score"
                  type="number"
                  min="0"
                  max="100"
                  value={formData.compliance_score}
                  onChange={(e) => setFormData({ ...formData, compliance_score: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="edit_privacy_score">Privacy Score (0-100)</Label>
                <Input
                  id="edit_privacy_score"
                  type="number"
                  min="0"
                  max="100"
                  value={formData.privacy_score}
                  onChange={(e) => setFormData({ ...formData, privacy_score: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="edit_business_continuity_score">Business Continuity Score (0-100)</Label>
                <Input
                  id="edit_business_continuity_score"
                  type="number"
                  min="0"
                  max="100"
                  value={formData.business_continuity_score}
                  onChange={(e) => setFormData({ ...formData, business_continuity_score: e.target.value })}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="edit_key_findings">Key Findings</Label>
              <Textarea
                id="edit_key_findings"
                value={formData.key_findings}
                onChange={(e) => setFormData({ ...formData, key_findings: e.target.value })}
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="edit_recommendations">Recommendations</Label>
              <Textarea
                id="edit_recommendations"
                value={formData.recommendations}
                onChange={(e) => setFormData({ ...formData, recommendations: e.target.value })}
                rows={3}
              />
            </div>

            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Update Risk Evaluation</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
