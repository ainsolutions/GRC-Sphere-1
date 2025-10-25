"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Progress } from "@/components/ui/progress"
import {
  Plus,
  Search,
  RefreshCw,
  Eye,
  Edit,
  Trash2,
  Calendar,
  User,
  AlertTriangle,
  CheckCircle,
  Clock,
  XCircle,
  Filter,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { ActionButtons } from "./ui/action-buttons"

interface SAMARemediation {
  id: number
  assessment_id?: number
  finding_title: string
  finding_description: string
  control_reference: string
  risk_level: string
  remediation_action: string
  responsible_party: string
  target_date: string
  status: string
  progress_percentage: number
  evidence_provided: string
  verification_status: string
  cost_estimate: number
  actual_completion_date?: string
  notes: string
  created_at: string
  updated_at: string
}

interface SAMARemediationTrackerProps {
  assessmentId?: number
}

export function SAMARemediationTracker({ assessmentId }: SAMARemediationTrackerProps) {
  const [remediations, setRemediations] = useState<SAMARemediation[]>([])
  const [filteredRemediations, setFilteredRemediations] = useState<SAMARemediation[]>([])
  const [selectedRemediation, setSelectedRemediation] = useState<SAMARemediation | null>(null)
  const [isNewRemediationOpen, setIsNewRemediationOpen] = useState(false)
  const [isDetailOpen, setIsDetailOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [riskFilter, setRiskFilter] = useState("all")
  const { toast } = useToast()

  const [newRemediation, setNewRemediation] = useState({
    assessment_id: assessmentId || 0,
    finding_title: "",
    finding_description: "",
    control_reference: "",
    risk_level: "Medium",
    remediation_action: "",
    responsible_party: "",
    target_date: "",
    status: "Open",
    progress_percentage: 0,
    evidence_provided: "",
    verification_status: "Pending",
    cost_estimate: 0,
    notes: "",
  })

  useEffect(() => {
    fetchRemediations()
  }, [assessmentId])

  useEffect(() => {
    filterRemediations()
  }, [remediations, searchTerm, statusFilter, riskFilter])

  const fetchRemediations = async () => {
    setLoading(true)
    try {
      const url = assessmentId ? `/api/sama-remediation?assessment_id=${assessmentId}` : "/api/sama-remediation"

      const response = await fetch(url)
      if (response.ok) {
        const data = await response.json()
        setRemediations(data)
      }
    } catch (error) {
      console.error("Failed to fetch SAMA remediations:", error)
      toast({
        title: "Error",
        description: "Failed to load SAMA remediation items",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const filterRemediations = () => {
    let filtered = remediations

    if (searchTerm) {
      filtered = filtered.filter(
        (item) =>
          item.finding_title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.control_reference.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.responsible_party.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((item) => item.status === statusFilter)
    }

    if (riskFilter !== "all") {
      filtered = filtered.filter((item) => item.risk_level === riskFilter)
    }

    setFilteredRemediations(filtered)
  }

  const createRemediation = async () => {
    try {
      const response = await fetch("/api/sama-remediation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newRemediation),
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: "SAMA remediation item created successfully",
        })
        setIsNewRemediationOpen(false)
        resetNewRemediation()
        fetchRemediations()
      } else {
        throw new Error("Failed to create remediation item")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create SAMA remediation item",
        variant: "destructive",
      })
    }
  }

  const resetNewRemediation = () => {
    setNewRemediation({
      assessment_id: assessmentId || 0,
      finding_title: "",
      finding_description: "",
      control_reference: "",
      risk_level: "Medium",
      remediation_action: "",
      responsible_party: "",
      target_date: "",
      status: "Open",
      progress_percentage: 0,
      evidence_provided: "",
      verification_status: "Pending",
      cost_estimate: 0,
      notes: "",
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed":
        return "bg-gradient-to-r from-green-500 to-teal-500 text-white"
      case "In Progress":
        return "bg-gradient-to-r from-blue-500 to-cyan-500 text-white"
      case "On Hold":
        return "bg-gradient-to-r from-yellow-500 to-orange-500 text-white"
      case "Open":
        return "bg-gradient-to-r from-gray-500 to-gray-600 text-white"
      case "Overdue":
        return "bg-gradient-to-r from-red-500 to-red-700 text-white"
      default:
        return "bg-gradient-to-r from-gray-400 to-gray-500 text-white"
    }
  }

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "Critical":
        return "bg-gradient-to-r from-red-500 to-red-700 text-white"
      case "High":
        return "bg-gradient-to-r from-orange-500 to-red-500 text-white"
      case "Medium":
        return "bg-gradient-to-r from-yellow-500 to-orange-500 text-white"
      case "Low":
        return "bg-gradient-to-r from-green-500 to-teal-500 text-white"
      default:
        return "bg-gradient-to-r from-gray-400 to-gray-500 text-white"
    }
  }

  const getVerificationColor = (status: string) => {
    switch (status) {
      case "Verified":
        return "bg-gradient-to-r from-green-500 to-teal-500 text-white"
      case "Under Review":
        return "bg-gradient-to-r from-blue-500 to-cyan-500 text-white"
      case "Rejected":
        return "bg-gradient-to-r from-red-500 to-red-700 text-white"
      case "Pending":
        return "bg-gradient-to-r from-yellow-500 to-orange-500 text-white"
      default:
        return "bg-gradient-to-r from-gray-400 to-gray-500 text-white"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Completed":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "In Progress":
        return <Clock className="h-4 w-4 text-blue-600" />
      case "On Hold":
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />
      case "Overdue":
        return <XCircle className="h-4 w-4 text-red-600" />
      default:
        return <Clock className="h-4 w-4 text-gray-600" />
    }
  }

  const isOverdue = (targetDate: string, status: string) => {
    if (status === "Completed") return false
    return new Date(targetDate) < new Date()
  }

  const completedCount = remediations.filter((r) => r.status === "Completed").length
  const inProgressCount = remediations.filter((r) => r.status === "In Progress").length
  const overdueCount = remediations.filter((r) => isOverdue(r.target_date, r.status)).length
  const averageProgress =
    remediations.length > 0
      ? Math.round(remediations.reduce((sum, r) => sum + r.progress_percentage, 0) / remediations.length)
      : 0

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-green-600 via-blue-600 to-purple-600 bg-clip-text text-transparent">
            SAMA Remediation Tracker
          </h2>
          <p className="text-muted-foreground">Track and manage remediation actions for SAMA compliance findings</p>
        </div>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            onClick={fetchRemediations}
            disabled={loading}

          >
            <RefreshCw className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
          <Dialog open={isNewRemediationOpen} onOpenChange={setIsNewRemediationOpen}>
            <DialogTrigger asChild>
              <ActionButtons isTableAction={false} onAdd={() => { }} btnAddText="Add Remediation" />
              {/* <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Remediation
              </Button> */}
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                  Add New SAMA Remediation Item
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="finding_title">Finding Title *</Label>
                    <Input
                      id="finding_title"
                      value={newRemediation.finding_title}
                      onChange={(e) => setNewRemediation((prev) => ({ ...prev, finding_title: e.target.value }))}
                      placeholder="Enter finding title"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="control_reference">Control Reference</Label>
                    <Input
                      id="control_reference"
                      value={newRemediation.control_reference}
                      onChange={(e) => setNewRemediation((prev) => ({ ...prev, control_reference: e.target.value }))}
                      placeholder="e.g., CG-01, CD-02"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="finding_description">Finding Description</Label>
                  <Textarea
                    id="finding_description"
                    value={newRemediation.finding_description}
                    onChange={(e) => setNewRemediation((prev) => ({ ...prev, finding_description: e.target.value }))}
                    placeholder="Describe the finding in detail"
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="remediation_action">Remediation Action *</Label>
                  <Textarea
                    id="remediation_action"
                    value={newRemediation.remediation_action}
                    onChange={(e) => setNewRemediation((prev) => ({ ...prev, remediation_action: e.target.value }))}
                    placeholder="Describe the required remediation action"
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="risk_level">Risk Level</Label>
                    <Select
                      value={newRemediation.risk_level}
                      onValueChange={(value) => setNewRemediation((prev) => ({ ...prev, risk_level: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Critical">Critical</SelectItem>
                        <SelectItem value="High">High</SelectItem>
                        <SelectItem value="Medium">Medium</SelectItem>
                        <SelectItem value="Low">Low</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="status">Status</Label>
                    <Select
                      value={newRemediation.status}
                      onValueChange={(value) => setNewRemediation((prev) => ({ ...prev, status: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Open">Open</SelectItem>
                        <SelectItem value="In Progress">In Progress</SelectItem>
                        <SelectItem value="On Hold">On Hold</SelectItem>
                        <SelectItem value="Completed">Completed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="verification_status">Verification Status</Label>
                    <Select
                      value={newRemediation.verification_status}
                      onValueChange={(value) => setNewRemediation((prev) => ({ ...prev, verification_status: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Pending">Pending</SelectItem>
                        <SelectItem value="Under Review">Under Review</SelectItem>
                        <SelectItem value="Verified">Verified</SelectItem>
                        <SelectItem value="Rejected">Rejected</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="responsible_party">Responsible Party</Label>
                    <Input
                      id="responsible_party"
                      value={newRemediation.responsible_party}
                      onChange={(e) => setNewRemediation((prev) => ({ ...prev, responsible_party: e.target.value }))}
                      placeholder="Enter responsible person/team"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="target_date">Target Date</Label>
                    <Input
                      id="target_date"
                      type="date"
                      value={newRemediation.target_date}
                      onChange={(e) => setNewRemediation((prev) => ({ ...prev, target_date: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cost_estimate">Cost Estimate (SAR)</Label>
                    <Input
                      id="cost_estimate"
                      type="number"
                      value={newRemediation.cost_estimate}
                      onChange={(e) =>
                        setNewRemediation((prev) => ({ ...prev, cost_estimate: Number(e.target.value) }))
                      }
                      placeholder="0"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes">Notes</Label>
                  <Textarea
                    id="notes"
                    value={newRemediation.notes}
                    onChange={(e) => setNewRemediation((prev) => ({ ...prev, notes: e.target.value }))}
                    placeholder="Additional notes or comments"
                    rows={2}
                  />
                </div>

                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setIsNewRemediationOpen(false)}>
                    Cancel
                  </Button>
                  <Button
                    onClick={createRemediation}
                    disabled={!newRemediation.finding_title || !newRemediation.remediation_action}
                  >
                    Create Remediation
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent">
              Completed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{completedCount}</div>
            <p className="text-xs text-muted-foreground">
              {remediations.length > 0 ? Math.round((completedCount / remediations.length) * 100) : 0}% of total
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
              In Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{inProgressCount}</div>
            <p className="text-xs text-muted-foreground">Active remediation items</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium bg-gradient-to-r from-red-600 to-red-700 bg-clip-text text-transparent">
              Overdue
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{overdueCount}</div>
            <p className="text-xs text-muted-foreground">Past target date</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Average Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{averageProgress}%</div>
            <Progress value={averageProgress} className="mt-2 h-2" />
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle className="bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
            SAMA Remediation Items
          </CardTitle>
          <CardDescription>Track and manage remediation actions for compliance findings</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <div className="flex items-center space-x-2 flex-1">
              <Search className="h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by title, control, or responsible party..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="border-green-200 focus:border-blue-400"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="Open">Open</SelectItem>
                  <SelectItem value="In Progress">In Progress</SelectItem>
                  <SelectItem value="On Hold">On Hold</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
                  <SelectItem value="Overdue">Overdue</SelectItem>
                </SelectContent>
              </Select>
              <Select value={riskFilter} onValueChange={setRiskFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Risk Level" />
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
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-8">
              <RefreshCw className="h-6 w-6 animate-spin text-green-600" />
              <span className="ml-2">Loading remediation items...</span>
            </div>
          ) : (
            <div className="rounded-lg overflow-hidden border border-green-200/50">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Finding</TableHead>
                    <TableHead>Control</TableHead>
                    <TableHead>Risk Level</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Progress</TableHead>
                    <TableHead>Responsible Party</TableHead>
                    <TableHead>Target Date</TableHead>
                    <TableHead>Verification</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRemediations.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                        No remediation items found. Add your first remediation item to get started.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredRemediations.map((remediation) => (
                      <TableRow
                        key={remediation.id}
                        className="hover:bg-gradient-to-r hover:from-cyan-500/30 hover:to-purple-500/30"
                      >
                        <TableCell className="font-medium max-w-xs">
                          <div className="flex items-center space-x-2">
                            {getStatusIcon(remediation.status)}
                            <div>
                              <div className="font-medium">{remediation.finding_title}</div>
                              <div className="text-xs text-muted-foreground">
                                {remediation.finding_description}
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="text-xs">
                            {remediation.control_reference || "N/A"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge className={getRiskColor(remediation.risk_level)}>{remediation.risk_level}</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(remediation.status)}>{remediation.status}</Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Progress value={remediation.progress_percentage} className="w-16 h-2" />
                            <span className="text-sm">{remediation.progress_percentage}%</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-1">
                            <User className="h-3 w-3 text-muted-foreground" />
                            <span className="text-sm">{remediation.responsible_party || "Unassigned"}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-1">
                            <Calendar className="h-3 w-3 text-muted-foreground" />
                            <span
                              className={`text-sm ${isOverdue(remediation.target_date, remediation.status) ? "text-red-600 font-medium" : ""}`}
                            >
                              {new Date(remediation.target_date).toLocaleDateString()}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={getVerificationColor(remediation.verification_status)}>
                            {remediation.verification_status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <ActionButtons isTableAction={true}
                              onView={() => {
                                setSelectedRemediation(remediation)
                                setIsDetailOpen(true)
                              }}
                              onEdit={() => { }}
                              onDelete={() => { }}
                                actionObj={remediation}
                            //deleteDialogTitle={}                                
                            />
                            {/* <Button
                              variant="outline"
                              size="sm"
                                
                              onClick={() => {
                                setSelectedRemediation(remediation)
                                setIsDetailOpen(true)
                              }}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                            
                            <Button variant="outline" size="sm">
                              <Trash2 className="h-4 w-4" />
                            </Button> */}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Detail Dialog */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
              SAMA Remediation Details
            </DialogTitle>
          </DialogHeader>
          {selectedRemediation && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">Finding Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm">
                    <div>
                      <strong>Title:</strong> {selectedRemediation.finding_title}
                    </div>
                    <div>
                      <strong>Control Reference:</strong> {selectedRemediation.control_reference || "N/A"}
                    </div>
                    <div>
                      <strong>Risk Level:</strong>
                      <Badge className={`ml-2 ${getRiskColor(selectedRemediation.risk_level)}`}>
                        {selectedRemediation.risk_level}
                      </Badge>
                    </div>
                    <div>
                      <strong>Description:</strong>
                      <p className="mt-1 text-muted-foreground">{selectedRemediation.finding_description}</p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">Remediation Status</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm">
                    <div>
                      <strong>Status:</strong>
                      <Badge className={`ml-2 ${getStatusColor(selectedRemediation.status)}`}>
                        {selectedRemediation.status}
                      </Badge>
                    </div>
                    <div>
                      <strong>Progress:</strong>
                      <div className="flex items-center space-x-2 mt-1">
                        <Progress value={selectedRemediation.progress_percentage} className="flex-1 h-2" />
                        <span>{selectedRemediation.progress_percentage}%</span>
                      </div>
                    </div>
                    <div>
                      <strong>Verification:</strong>
                      <Badge className={`ml-2 ${getVerificationColor(selectedRemediation.verification_status)}`}>
                        {selectedRemediation.verification_status}
                      </Badge>
                    </div>
                    <div>
                      <strong>Cost Estimate:</strong> SAR {selectedRemediation.cost_estimate.toLocaleString()}
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">Assignment & Timeline</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm">
                    <div>
                      <strong>Responsible Party:</strong> {selectedRemediation.responsible_party || "Unassigned"}
                    </div>
                    <div>
                      <strong>Target Date:</strong> {new Date(selectedRemediation.target_date).toLocaleDateString()}
                    </div>
                    <div>
                      <strong>Created:</strong> {new Date(selectedRemediation.created_at).toLocaleDateString()}
                    </div>
                    <div>
                      <strong>Last Updated:</strong> {new Date(selectedRemediation.updated_at).toLocaleDateString()}
                    </div>
                    {selectedRemediation.actual_completion_date && (
                      <div>
                        <strong>Completed:</strong>{" "}
                        {new Date(selectedRemediation.actual_completion_date).toLocaleDateString()}
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">Evidence & Notes</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm">
                    <div>
                      <strong>Evidence Provided:</strong>
                      <p className="mt-1 text-muted-foreground">
                        {selectedRemediation.evidence_provided || "No evidence provided yet"}
                      </p>
                    </div>
                    <div>
                      <strong>Notes:</strong>
                      <p className="mt-1 text-muted-foreground">{selectedRemediation.notes || "No additional notes"}</p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">Remediation Action</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">{selectedRemediation.remediation_action}</p>
                </CardContent>
              </Card>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
