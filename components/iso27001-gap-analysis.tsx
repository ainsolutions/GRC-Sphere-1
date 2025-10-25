"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import {
  Shield,
  Building,
  Users,
  Server,
  FileText,
  Lock,
  Network,
  Database,
  Search,
  RefreshCw,
  TrendingUp,
  Minus,
  Plus,
  CalendarIcon,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { ActionButtons } from "./ui/action-buttons"

interface ISO27001Assessment {
  id: number
  assessment_id: string
  assessment_name: string
  assessment_type: string
  status: string
}

interface ISO27001GapAnalysisItem {
  id: number
  assessment_id: number
  assessment_name: string
  domain: string
  control_id: string
  control_name: string
  current_status: string
  target_status: string
  gap_severity: string
  priority: string
  effort_estimate: string
  responsible_party: string
  target_date: string
  remediation_plan: string
  cost_estimate: number
  business_impact: string
  created_at: string
}

export function ISO27001GapAnalysis() {
  const [gapItems, setGapItems] = useState<ISO27001GapAnalysisItem[]>([])
  const [assessments, setAssessments] = useState<ISO27001Assessment[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedDomain, setSelectedDomain] = useState<string>("all")
  const [selectedSeverity, setSelectedSeverity] = useState<string>("all")
  const [selectedAssessment, setSelectedAssessment] = useState<string>("all")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [formData, setFormData] = useState({
    assessment_id: "",
    domain: "",
    control_id: "",
    control_name: "",
    current_status: "",
    target_status: "",
    gap_severity: "",
    priority: "",
    effort_estimate: "",
    responsible_party: "",
    target_date: new Date(),
    remediation_plan: "",
    cost_estimate: 0,
    business_impact: "",
  })
  const { toast } = useToast()

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    setLoading(true)
    try {
      // Mock data for ISO 27001 assessments
      const mockAssessments: ISO27001Assessment[] = [
        {
          id: 1,
          assessment_id: "ISO-ASS-001",
          assessment_name: "Initial ISO 27001 Certification Assessment",
          assessment_type: "Initial Certification",
          status: "Completed",
        },
        {
          id: 2,
          assessment_id: "ISO-ASS-002",
          assessment_name: "First Surveillance Audit",
          assessment_type: "Surveillance",
          status: "Completed",
        },
        {
          id: 3,
          assessment_id: "ISO-ASS-003",
          assessment_name: "Internal Audit Q4 2024",
          assessment_type: "Internal Audit",
          status: "In Progress",
        },
      ]

      // Mock data for ISO 27001 gap analysis
      const mockGapItems: ISO27001GapAnalysisItem[] = [
        {
          id: 1,
          assessment_id: 1,
          assessment_name: "Initial ISO 27001 Certification Assessment",
          domain: "Human Resource Security",
          control_id: "A.7.1",
          control_name: "Screening",
          current_status: "Partially Implemented",
          target_status: "Implemented",
          gap_severity: "Medium",
          priority: "High",
          effort_estimate: "2-3 months",
          responsible_party: "HR Department",
          target_date: "2024-04-30",
          remediation_plan: "Implement comprehensive background verification process for all new hires",
          cost_estimate: 15000,
          business_impact: "Reduced risk of insider threats and compliance violations",
          created_at: "2024-01-20T10:00:00Z",
        },
        {
          id: 2,
          assessment_id: 1,
          assessment_name: "Initial ISO 27001 Certification Assessment",
          domain: "Cryptography",
          control_id: "A.10.1",
          control_name: "Cryptographic controls",
          current_status: "Partially Implemented",
          target_status: "Implemented",
          gap_severity: "High",
          priority: "Critical",
          effort_estimate: "4-6 months",
          responsible_party: "IT Security Team",
          target_date: "2024-06-30",
          remediation_plan: "Complete implementation of encryption for all data at rest and in transit",
          cost_estimate: 50000,
          business_impact: "Enhanced data protection and regulatory compliance",
          created_at: "2024-01-20T10:00:00Z",
        },
        {
          id: 3,
          assessment_id: 2,
          assessment_name: "First Surveillance Audit",
          domain: "Operations Security",
          control_id: "A.12.1",
          control_name: "Operational procedures and responsibilities",
          current_status: "Partially Implemented",
          target_status: "Implemented",
          gap_severity: "Medium",
          priority: "Medium",
          effort_estimate: "1-2 months",
          responsible_party: "Operations Team",
          target_date: "2024-03-31",
          remediation_plan: "Document all operational procedures and ensure staff training",
          cost_estimate: 8000,
          business_impact: "Improved operational efficiency and reduced errors",
          created_at: "2024-07-17T14:00:00Z",
        },
        {
          id: 4,
          assessment_id: 2,
          assessment_name: "First Surveillance Audit",
          domain: "Incident Management",
          control_id: "A.16.1",
          control_name: "Management of information security incidents",
          current_status: "Not Implemented",
          target_status: "Implemented",
          gap_severity: "High",
          priority: "High",
          effort_estimate: "3-4 months",
          responsible_party: "Security Team",
          target_date: "2024-05-31",
          remediation_plan: "Establish formal incident response procedures and team",
          cost_estimate: 25000,
          business_impact: "Faster incident response and reduced business impact",
          created_at: "2024-07-17T14:00:00Z",
        },
        {
          id: 5,
          assessment_id: 3,
          assessment_name: "Internal Audit Q4 2024",
          domain: "Business Continuity",
          control_id: "A.17.1",
          control_name: "Planning information security continuity",
          current_status: "Not Implemented",
          target_status: "Implemented",
          gap_severity: "Critical",
          priority: "Critical",
          effort_estimate: "6-8 months",
          responsible_party: "Business Continuity Team",
          target_date: "2024-08-31",
          remediation_plan: "Develop comprehensive business continuity and disaster recovery plans",
          cost_estimate: 75000,
          business_impact: "Ensured business resilience and regulatory compliance",
          created_at: "2024-12-01T09:00:00Z",
        },
        {
          id: 6,
          assessment_id: 3,
          assessment_name: "Internal Audit Q4 2024",
          domain: "Supplier Relationships",
          control_id: "A.15.1",
          control_name: "Information security in supplier relationships",
          current_status: "Partially Implemented",
          target_status: "Implemented",
          gap_severity: "Medium",
          priority: "Medium",
          effort_estimate: "2-3 months",
          responsible_party: "Procurement Team",
          target_date: "2024-04-15",
          remediation_plan: "Implement security requirements in all supplier contracts",
          cost_estimate: 12000,
          business_impact: "Reduced third-party security risks",
          created_at: "2024-12-01T09:00:00Z",
        },
      ]

      setAssessments(mockAssessments)
      setGapItems(mockGapItems)
    } catch (error) {
      console.error("Failed to fetch ISO 27001 gap analysis:", error)
      toast({
        title: "Error",
        description: "Failed to load gap analysis data",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleCreateGapItem = async () => {
    try {
      const selectedAssessmentData = assessments.find((a) => a.id === Number.parseInt(formData.assessment_id))

      const newGapItem: ISO27001GapAnalysisItem = {
        id: gapItems.length + 1,
        assessment_id: Number.parseInt(formData.assessment_id),
        assessment_name: selectedAssessmentData?.assessment_name || "",
        domain: formData.domain,
        control_id: formData.control_id,
        control_name: formData.control_name,
        current_status: formData.current_status,
        target_status: formData.target_status,
        gap_severity: formData.gap_severity,
        priority: formData.priority,
        effort_estimate: formData.effort_estimate,
        responsible_party: formData.responsible_party,
        target_date: formData.target_date.toISOString().split("T")[0],
        remediation_plan: formData.remediation_plan,
        cost_estimate: formData.cost_estimate,
        business_impact: formData.business_impact,
        created_at: new Date().toISOString(),
      }

      setGapItems([...gapItems, newGapItem])
      setIsCreateDialogOpen(false)
      setFormData({
        assessment_id: "",
        domain: "",
        control_id: "",
        control_name: "",
        current_status: "",
        target_status: "",
        gap_severity: "",
        priority: "",
        effort_estimate: "",
        responsible_party: "",
        target_date: new Date(),
        remediation_plan: "",
        cost_estimate: 0,
        business_impact: "",
      })

      toast({
        title: "Success",
        description: "Gap analysis item created successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create gap analysis item",
        variant: "destructive",
      })
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Implemented":
        return "bg-gradient-to-r from-green-500 to-teal-500 text-white"
      case "Partially Implemented":
        return "bg-gradient-to-r from-yellow-500 to-orange-500 text-white"
      case "Not Implemented":
        return "bg-gradient-to-r from-red-500 to-red-700 text-white"
      default:
        return "bg-gradient-to-r from-gray-400 to-gray-500 text-white"
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "Critical":
        return "bg-gradient-to-r from-red-600 to-red-800 text-white"
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

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "Critical":
        return "bg-gradient-to-r from-red-600 to-red-800 text-white"
      case "High":
        return "bg-gradient-to-r from-orange-500 to-red-500 text-white"
      case "Medium":
        return "bg-gradient-to-r from-blue-500 to-cyan-500 text-white"
      case "Low":
        return "bg-gradient-to-r from-gray-500 to-gray-600 text-white"
      default:
        return "bg-gradient-to-r from-gray-400 to-gray-500 text-white"
    }
  }

  const getGapIcon = (currentStatus: string, targetStatus: string) => {
    if (currentStatus === "Not Implemented" && targetStatus === "Implemented") {
      return <TrendingUp className="h-4 w-4 text-red-600" />
    } else if (currentStatus === "Partially Implemented" && targetStatus === "Implemented") {
      return <TrendingUp className="h-4 w-4 text-yellow-600" />
    } else if (currentStatus === targetStatus) {
      return <Minus className="h-4 w-4 text-green-600" />
    }
    return <TrendingUp className="h-4 w-4 text-blue-600" />
  }

  const getDomainIcon = (domain: string) => {
    switch (domain) {
      case "Information Security Policies":
        return <FileText className="h-4 w-4" />
      case "Organization of Information Security":
        return <Building className="h-4 w-4" />
      case "Human Resource Security":
        return <Users className="h-4 w-4" />
      case "Asset Management":
        return <Database className="h-4 w-4" />
      case "Access Control":
        return <Lock className="h-4 w-4" />
      case "Cryptography":
        return <Shield className="h-4 w-4" />
      case "Physical and Environmental Security":
        return <Server className="h-4 w-4" />
      case "Operations Security":
        return <Network className="h-4 w-4" />
      case "Communications Security":
        return <Network className="h-4 w-4" />
      case "Incident Management":
        return <Shield className="h-4 w-4" />
      case "Business Continuity":
        return <Building className="h-4 w-4" />
      case "Supplier Relationships":
        return <Users className="h-4 w-4" />
      default:
        return <Shield className="h-4 w-4" />
    }
  }

  const domains = [...new Set(gapItems.map((item) => item.domain))]
  const severities = ["Critical", "High", "Medium", "Low"]

  const filteredItems = gapItems.filter((item) => {
    const matchesSearch =
      item.control_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.control_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.domain.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesDomain = selectedDomain === "all" || item.domain === selectedDomain
    const matchesSeverity = selectedSeverity === "all" || item.gap_severity === selectedSeverity
    const matchesAssessment = selectedAssessment === "all" || item.assessment_id === Number.parseInt(selectedAssessment)

    return matchesSearch && matchesDomain && matchesSeverity && matchesAssessment
  })

  const getGapStats = () => {
    const total = filteredItems.length
    const critical = filteredItems.filter((item) => item.gap_severity === "Critical").length
    const high = filteredItems.filter((item) => item.gap_severity === "High").length
    const medium = filteredItems.filter((item) => item.gap_severity === "Medium").length
    const low = filteredItems.filter((item) => item.gap_severity === "Low").length
    const totalCost = filteredItems.reduce((sum, item) => sum + item.cost_estimate, 0)

    return { total, critical, high, medium, low, totalCost }
  }

  const stats = getGapStats()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 bg-clip-text text-transparent">
            ISO 27001 Gap Analysis
          </h2>
          <p className="text-muted-foreground">Identify and prioritize gaps in ISO 27001 implementation</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            onClick={fetchData}
            disabled={loading}
          >
            <RefreshCw className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <ActionButtons isTableAction={false} onAdd={()=>{}} btnAddText="Add Gap Item"/>
              {/* <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Gap Item
              </Button> */}
            </DialogTrigger>
            <DialogContent className="max-w-3xl">
              <DialogHeader>
                <DialogTitle>Create Gap Analysis Item</DialogTitle>
                <DialogDescription>Add a new gap analysis item for ISO 27001 compliance</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="assessment_id">Assessment</Label>
                    <Select
                      value={formData.assessment_id}
                      onValueChange={(value) => setFormData({ ...formData, assessment_id: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select assessment" />
                      </SelectTrigger>
                      <SelectContent>
                        {assessments.map((assessment) => (
                          <SelectItem key={assessment.id} value={assessment.id.toString()}>
                            {assessment.assessment_id} - {assessment.assessment_name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="domain">Domain</Label>
                    <Select
                      value={formData.domain}
                      onValueChange={(value) => setFormData({ ...formData, domain: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select domain" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Information Security Policies">Information Security Policies</SelectItem>
                        <SelectItem value="Organization of Information Security">
                          Organization of Information Security
                        </SelectItem>
                        <SelectItem value="Human Resource Security">Human Resource Security</SelectItem>
                        <SelectItem value="Asset Management">Asset Management</SelectItem>
                        <SelectItem value="Access Control">Access Control</SelectItem>
                        <SelectItem value="Cryptography">Cryptography</SelectItem>
                        <SelectItem value="Physical and Environmental Security">
                          Physical and Environmental Security
                        </SelectItem>
                        <SelectItem value="Operations Security">Operations Security</SelectItem>
                        <SelectItem value="Communications Security">Communications Security</SelectItem>
                        <SelectItem value="Incident Management">Incident Management</SelectItem>
                        <SelectItem value="Business Continuity">Business Continuity</SelectItem>
                        <SelectItem value="Supplier Relationships">Supplier Relationships</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="control_id">Control ID</Label>
                    <Input
                      id="control_id"
                      value={formData.control_id}
                      onChange={(e) => setFormData({ ...formData, control_id: e.target.value })}
                      placeholder="e.g., A.5.1"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="control_name">Control Name</Label>
                    <Input
                      id="control_name"
                      value={formData.control_name}
                      onChange={(e) => setFormData({ ...formData, control_name: e.target.value })}
                      placeholder="Enter control name"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="current_status">Current Status</Label>
                    <Select
                      value={formData.current_status}
                      onValueChange={(value) => setFormData({ ...formData, current_status: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select current status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Implemented">Implemented</SelectItem>
                        <SelectItem value="Partially Implemented">Partially Implemented</SelectItem>
                        <SelectItem value="Not Implemented">Not Implemented</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="target_status">Target Status</Label>
                    <Select
                      value={formData.target_status}
                      onValueChange={(value) => setFormData({ ...formData, target_status: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select target status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Implemented">Implemented</SelectItem>
                        <SelectItem value="Partially Implemented">Partially Implemented</SelectItem>
                        <SelectItem value="Not Implemented">Not Implemented</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="gap_severity">Gap Severity</Label>
                    <Select
                      value={formData.gap_severity}
                      onValueChange={(value) => setFormData({ ...formData, gap_severity: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select severity" />
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
                    <Label htmlFor="priority">Priority</Label>
                    <Select
                      value={formData.priority}
                      onValueChange={(value) => setFormData({ ...formData, priority: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select priority" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Critical">Critical</SelectItem>
                        <SelectItem value="High">High</SelectItem>
                        <SelectItem value="Medium">Medium</SelectItem>
                        <SelectItem value="Low">Low</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="effort_estimate">Effort Estimate</Label>
                    <Input
                      id="effort_estimate"
                      value={formData.effort_estimate}
                      onChange={(e) => setFormData({ ...formData, effort_estimate: e.target.value })}
                      placeholder="e.g., 2-3 months"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="responsible_party">Responsible Party</Label>
                    <Input
                      id="responsible_party"
                      value={formData.responsible_party}
                      onChange={(e) => setFormData({ ...formData, responsible_party: e.target.value })}
                      placeholder="Enter responsible party"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Target Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="w-full justify-start text-left font-normal bg-transparent">
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {format(formData.target_date, "PPP")}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={formData.target_date}
                          onSelect={(date) => date && setFormData({ ...formData, target_date: date })}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cost_estimate">Cost Estimate ($)</Label>
                    <Input
                      id="cost_estimate"
                      type="number"
                      value={formData.cost_estimate}
                      onChange={(e) =>
                        setFormData({ ...formData, cost_estimate: Number.parseInt(e.target.value) || 0 })
                      }
                      placeholder="Enter cost estimate"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="remediation_plan">Remediation Plan</Label>
                  <Textarea
                    id="remediation_plan"
                    value={formData.remediation_plan}
                    onChange={(e) => setFormData({ ...formData, remediation_plan: e.target.value })}
                    placeholder="Describe the remediation plan..."
                    rows={3}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="business_impact">Business Impact</Label>
                  <Textarea
                    id="business_impact"
                    value={formData.business_impact}
                    onChange={(e) => setFormData({ ...formData, business_impact: e.target.value })}
                    placeholder="Describe the business impact..."
                    rows={2}
                  />
                </div>
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleCreateGapItem}>Create Gap Item</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Total Gaps
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-700">{stats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Critical
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-700">{stats.critical}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              High
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{stats.high}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Medium
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{stats.medium}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">
              Low
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.low}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Total Cost
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">${stats.totalCost.toLocaleString()}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Gap Analysis Table */}
      <Card className="gradient-card-primary">
        <CardHeader>
          <CardTitle className="text-sm font-medium">
            Gap Analysis Results
          </CardTitle>
          <CardDescription>Detailed analysis of implementation gaps and remediation plans</CardDescription>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="flex flex-wrap items-center gap-4 mb-6">
            <div className="flex items-center space-x-2">
              <Search className="h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search gaps..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-64 border-blue-200 focus:border-purple-400"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Label htmlFor="assessment-filter">Assessment:</Label>
              <Select value={selectedAssessment} onValueChange={setSelectedAssessment}>
                <SelectTrigger className="w-64">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Assessments</SelectItem>
                  {assessments.map((assessment) => (
                    <SelectItem key={assessment.id} value={assessment.id.toString()}>
                      {assessment.assessment_id}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center space-x-2">
              <Label htmlFor="domain-filter">Domain:</Label>
              <Select value={selectedDomain} onValueChange={setSelectedDomain}>
                <SelectTrigger className="w-48">
                  <SelectValue />
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
            <div className="flex items-center space-x-2">
              <Label htmlFor="severity-filter">Severity:</Label>
              <Select value={selectedSeverity} onValueChange={setSelectedSeverity}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  {severities.map((severity) => (
                    <SelectItem key={severity} value={severity}>
                      {severity}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-8">
              <RefreshCw className="h-6 w-6 animate-spin text-blue-600" />
              <span className="ml-2">Loading gap analysis...</span>
            </div>
          ) : (
            <div className="rounded-lg overflow-hidden border border-blue-200/50">
              <Table>
                <TableHeader>
                  <TableRow className="text-md-white">
                    <TableHead>Control</TableHead>
                    <TableHead>Assessment</TableHead>
                    <TableHead>Domain</TableHead>
                    <TableHead>Current Status</TableHead>
                    <TableHead>Target Status</TableHead>
                    <TableHead>Gap Severity</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Effort</TableHead>
                    <TableHead>Cost</TableHead>
                    <TableHead>Target Date</TableHead>
                    <TableHead>Responsible Party</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredItems.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={11} className="text-center py-8 text-muted-foreground">
                        No gaps found matching the current filters.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredItems.map((item) => (
                      <TableRow
                        key={item.id}
                        className="hover:bg-gradient-to-r hover:from-blue-50/30 hover:via-purple-50/30 hover:to-cyan-50/30"
                      >
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            {getGapIcon(item.current_status, item.target_status)}
                            <div>
                              <div className="font-medium">{item.control_id}</div>
                              <div className="text-sm text-muted-foreground">{item.control_name}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <div className="font-medium">{item.assessment_name}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            {getDomainIcon(item.domain)}
                            <span className="text-sm">{item.domain}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(item.current_status)}>{item.current_status}</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(item.target_status)}>{item.target_status}</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge className={getSeverityColor(item.gap_severity)}>{item.gap_severity}</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge className={getPriorityColor(item.priority)}>{item.priority}</Badge>
                        </TableCell>
                        <TableCell className="text-sm">{item.effort_estimate}</TableCell>
                        <TableCell className="text-sm font-medium">${item.cost_estimate.toLocaleString()}</TableCell>
                        <TableCell className="text-sm">{new Date(item.target_date).toLocaleDateString()}</TableCell>
                        <TableCell className="text-sm">{item.responsible_party}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Remediation Plans */}
      <Card className="gradient-card-secondary">
        <CardHeader>
          <CardTitle className="bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent">
            Remediation Plans
          </CardTitle>
          <CardDescription>Detailed remediation plans for identified gaps</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredItems
              .filter((item) => item.gap_severity === "Critical" || item.gap_severity === "High")
              .map((item) => (
                <Card key={`plan-${item.id}`} className="border-orange-200/50">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        {getDomainIcon(item.domain)}
                        <div>
                          <h3 className="font-semibold">
                            {item.control_id} - {item.control_name}
                          </h3>
                          <p className="text-sm text-muted-foreground">{item.domain}</p>
                          <p className="text-xs text-muted-foreground">Assessment: {item.assessment_name}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge className={getSeverityColor(item.gap_severity)}>{item.gap_severity}</Badge>
                        <Badge className={getPriorityColor(item.priority)}>{item.priority}</Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <h4 className="font-medium text-sm mb-1">Remediation Plan:</h4>
                      <p className="text-sm text-muted-foreground">{item.remediation_plan}</p>
                    </div>
                    <div>
                      <h4 className="font-medium text-sm mb-1">Business Impact:</h4>
                      <p className="text-sm text-muted-foreground">{item.business_impact}</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="font-medium">Effort:</span> {item.effort_estimate}
                      </div>
                      <div>
                        <span className="font-medium">Cost:</span> ${item.cost_estimate.toLocaleString()}
                      </div>
                      <div>
                        <span className="font-medium">Target Date:</span>{" "}
                        {new Date(item.target_date).toLocaleDateString()}
                      </div>
                      <div>
                        <span className="font-medium">Owner:</span> {item.responsible_party}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
