"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from "@/components/ui/pagination"
import {
  Plus,
  Search,
  Download,
  Upload,
  Eye,
  Edit,
  Trash2,
  Calendar,
  FileText,
  CheckCircle,
  Clock,
  AlertTriangle,
  Loader2,
} from "lucide-react"
import { toast } from "sonner"
import { AssetSelector } from "@/components/asset-selector"
import AssetSelectInput from "@/components/asset-search-input"
import OwnerSelectInput from "@/components/owner-search-input"
import DepartmentSelectInput from "@/components/department-search-input"
import UnitSelectInput from "@/components/unit-search-input"
import FrameworkSelectInput from "@/components/framework-search-input"
import StarBorder from "../StarBorder"
import { ActionButtons } from "@/components/ui/action-buttons"
import { AssessmentGanttChart } from "@/components/assessment-gantt-chart"

interface Assessment {
  id: string
  assessmentId?: string
  title: string
  type: string
  framework: string
  status: "Planning" | "In Progress" | "Completed" | "On Hold" | "Cancelled"
  priority: "Low" | "Medium" | "High" | "Critical"
  startDate: string
  endDate: string
  dueDate: string
  assessor: string
  reviewer?: string
  department: string
  departmental_unit?: string
  scope: string
  description: string
  progress: number
  findings: number
  criticalFindings: number
  majorFindings: number
  minorFindings: number
  asset_id?: string
  asset_name?: string
  model_version?: string
  createdAt: string
  updatedAt: string
}

export default function AssessmentsPage() {
  const [assessments, setAssessments] = useState<Assessment[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [filterFramework, setFilterFramework] = useState("all")
  const [filterPriority, setFilterPriority] = useState("all")
  const [selectedAssessment, setSelectedAssessment] = useState<Assessment | null>(null)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [selectedAsset, setSelectedAsset] = useState<any>(null)
  const [newAssessment, setNewAssessment] = useState<Partial<Assessment>>({
    type: "",
    framework: "",
    status: "Planning",
    priority: "Medium",
    progress: 0,
    findings: 0,
    criticalFindings: 0,
    majorFindings: 0,
    minorFindings: 0,
    asset_id: "",
    asset_name: "",
    model_version: "",
    asset: "",
    assessor: "",
    reviewer: "",
    department: "",
    departmental_unit: "",
  })

  useEffect(() => {

    async function loadAssessments() {
      try {
        setLoading(true)
        const response = await fetch("/api/assessments")
        if (response.ok) {
          const data = await response.json()

          console.log('DATATATATA', data)
          setAssessments(data)
        } else {
          throw new Error("Failed to fetch assessments")
        }
      } catch (error) {
        console.error("Error loading assessments:", error)
        toast.error("Failed to load assessments")
      } finally {
        setLoading(false)
      }
    }

    loadAssessments()

    fetchAssessments()

  }, [])

  const fetchAssessments = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/assessments")

      if (!response.ok) {
        throw new Error("Failed to fetch assessments")
      }

      const data = await response.json()

      const mappedAssessments = data.map((assessment: any) => ({
        id: assessment.id.toString(),
        assessmentId: assessment.assessment_id || "",
        title: assessment.assessment_name || "",
        type: assessment.assessment_type || "",
        framework: assessment.compliance_framework || "",
        status: assessment.assessment_status || "Planning",
        priority: assessment.assessment_priority || "Medium",
        startDate: assessment.start_date ? new Date(assessment.start_date).toISOString().split("T")[0] : "",
        endDate: assessment.end_date ? new Date(assessment.end_date).toISOString().split("T")[0] : "",
        dueDate: assessment.end_date ? new Date(assessment.end_date).toISOString().split("T")[0] : "",
        assessor: assessment.assigned_assessor || "",
        department: assessment.department || "",
        departmental_unit: assessment.departmental_unit || "",
        reviewer: assessment.reviewer || "",
        scope: assessment.assessment_scope || "",
        description: assessment.assessment_methodology || "",
        progress: assessment.completion_percentage || 0,
        findings: assessment.findings_count || 0,
        criticalFindings: assessment.high_risk_findings || 0,
        majorFindings: assessment.medium_risk_findings || 0,
        minorFindings: assessment.low_risk_findings || 0,
        createdAt: assessment.created_at ? new Date(assessment.created_at).toISOString().split("T")[0] : "",
        updatedAt: assessment.updated_at ? new Date(assessment.updated_at).toISOString().split("T")[0] : "",
      }))

      setAssessments(mappedAssessments)

      const stats = {
        total: mappedAssessments.length,
        planning: mappedAssessments.filter((a: Assessment) => a.status === "Planning").length,
        inProgress: mappedAssessments.filter((a: Assessment) => a.status === "In Progress").length,
        completed: mappedAssessments.filter((a: Assessment) => a.status === "Completed").length,
        onHold: mappedAssessments.filter((a: Assessment) => a.status === "On Hold").length,
        overdue: mappedAssessments.filter(
          (a: Assessment) => new Date(a.dueDate) < new Date() && a.status !== "Completed",
        ).length,
      }
      setAssessmentStats(stats)
    } catch (error) {
      console.error("Error fetching assessments:", error)
      toast.error("Failed to load assessments")
    } finally {
      setLoading(false)
    }
  }

  const filteredAssessments = assessments.filter((assessment) => {
    const matchesSearch =
      (assessment.title?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
      (assessment.id?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
      (assessment.assessor?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
      (assessment.department?.toLowerCase() || "").includes(searchTerm.toLowerCase());

    const matchesStatus = filterStatus === "all" || assessment.status === filterStatus;
    const matchesFramework = filterFramework === "all" || assessment.framework === filterFramework;
    const matchesPriority = filterPriority === "all" || assessment.priority === filterPriority;

    return matchesSearch && matchesStatus && matchesFramework && matchesPriority;
  });

  const [assessmentStats, setAssessmentStats] = useState({
    total: 0,
    planning: 0,
    inProgress: 0,
    completed: 0,
    onHold: 0,
    overdue: 0,
  })

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)

  // Reset pagination when filters change
  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm, filterStatus, filterFramework, filterPriority])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Planning":
        return "bg-blue-100 text-blue-800"
      case "In Progress":
        return "bg-yellow-100 text-yellow-800"
      case "Completed":
        return "bg-green-100 text-green-800"
      case "On Hold":
        return "bg-gray-100 text-gray-800"
      case "Cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "Critical":
        return "bg-red-500"
      case "High":
        return "bg-orange-500"
      case "Medium":
        return "bg-yellow-500"
      case "Low":
        return "bg-green-500"
      default:
        return "bg-gray-500"
    }
  }

  const handleAddAssessment = async () => {
    if (!newAssessment.title || !newAssessment.type || !newAssessment.framework) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (!selectedAsset) {
      toast.error("Please select an asset for this assessment");
      return;
    }

    try {
      setSubmitting(true);

      const assessmentData = {
        assessment_name: newAssessment.title,
        assessment_type: newAssessment.type,
        compliance_framework: newAssessment.framework,
        assessment_status: newAssessment.status,
        assessment_priority: newAssessment.priority,
        start_date: newAssessment.startDate || null,
        end_date: newAssessment.endDate || null,
        assigned_assessor: newAssessment.assessor || "",
        assessment_scope: newAssessment.scope || "",
        assessment_methodology: newAssessment.description || "",
        completion_percentage: 0,
        findings_count: 0,
        high_risk_findings: 0,
        medium_risk_findings: 0,
        low_risk_findings: 0,
        asset_id: selectedAsset.asset_id,
        asset_name: selectedAsset.asset_name,
        model_version: selectedAsset.model_version || "",
      };

      const response = await fetch("/api/assessments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-schema-id": localStorage.getItem("schema_id") || "",
          "x-current-session": localStorage.getItem("session_data") || "{}",
        },
        credentials: "include",
        body: JSON.stringify(assessmentData),
      });

      if (!response.ok) {
        const errText = await response.text();
        console.error("❌ Failed to create assessment:", response.status, errText);
        throw new Error(errText || "Failed to create assessment");
      }

      await fetchAssessments(); // Refresh table
      setNewAssessment({
        type: "",
        framework: "",
        status: "Planning",
        priority: "Medium",
        progress: 0,
        findings: 0,
        criticalFindings: 0,
        majorFindings: 0,
        minorFindings: 0,
        asset_id: "",
        asset_name: "",
        model_version: "",
      });
      setSelectedAsset(null);
      setIsAddDialogOpen(false);
      toast.success("✅ Assessment created successfully!");
    } catch (error) {
      console.error("Error creating assessment:", error);
      toast.error("Failed to create assessment");
    } finally {
      setSubmitting(false);
    }
  };


  const handleEditAssessment = async () => {
    if (!selectedAssessment) return

    try {
      setSubmitting(true)

      const assessmentData = {
        assessment_name: selectedAssessment.title,
        assessment_type: selectedAssessment.type,
        compliance_framework: selectedAssessment.framework,
        assessment_status: selectedAssessment.status,
        assessment_priority: selectedAssessment.priority,
        start_date: selectedAssessment.startDate || null,
        end_date: selectedAssessment.endDate || null,
        assigned_assessor: selectedAssessment.assessor,
        assessment_scope: selectedAssessment.scope,
        assessment_methodology: selectedAssessment.description,
        completion_percentage: selectedAssessment.progress,
        findings_count: selectedAssessment.findings,
        high_risk_findings: selectedAssessment.criticalFindings,
        medium_risk_findings: selectedAssessment.majorFindings,
        low_risk_findings: selectedAssessment.minorFindings,
      }

      const response = await fetch(`/api/assessments/${selectedAssessment.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(assessmentData),
      })

      if (!response.ok) {
        throw new Error("Failed to update assessment")
      }

      await fetchAssessments() // Refresh the list
      setIsEditDialogOpen(false)
      setSelectedAssessment(null)
      toast.success("Assessment updated successfully")
    } catch (error) {
      console.error("Error updating assessment:", error)
      toast.error("Failed to update assessment")
    } finally {
      setSubmitting(false)
    }
  }

  const handleDeleteAssessment = async (assessmentId: string) => {
    try {
      const response = await fetch(`/api/assessments/${assessmentId}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to delete assessment")
      }

      await fetchAssessments() // Refresh the list
      toast.success("Assessment deleted successfully")
    } catch (error) {
      console.error("Error deleting assessment:", error)
      toast.error("Failed to delete assessment")
    }
  }

  const openEditDialog = (assessment: Assessment) => {
    setSelectedAssessment({ ...assessment })
    setIsEditDialogOpen(true)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const isOverdue = (dueDate: string, status: string) => {
    return new Date(dueDate) < new Date() && status !== "Completed"
  }

  // Pagination logic
  const totalPages = Math.ceil(filteredAssessments.length / pageSize)
  const startIndex = (currentPage - 1) * pageSize
  const endIndex = startIndex + pageSize
  const currentAssessments = filteredAssessments.slice(startIndex, endIndex)

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  const handlePageSizeChange = (newPageSize: string) => {
    setPageSize(Number(newPageSize))
    setCurrentPage(1) // Reset to first page when changing page size
  }

  const generatePaginationItems = () => {
    const items = []
    const maxVisiblePages = 5

    if (totalPages <= maxVisiblePages) {
      // Show all pages if total pages is less than or equal to maxVisiblePages
      for (let i = 1; i <= totalPages; i++) {
        items.push(
          <PaginationItem key={i}>
            <PaginationLink
              href="#"
              onClick={(e) => {
                e.preventDefault()
                handlePageChange(i)
              }}
              isActive={currentPage === i}
            >
              {i}
            </PaginationLink>
          </PaginationItem>
        )
      }
    } else {
      // Show first page
      items.push(
        <PaginationItem key={1}>
          <PaginationLink
            href="#"
            onClick={(e) => {
              e.preventDefault()
              handlePageChange(1)
            }}
            isActive={currentPage === 1}
          >
            1
          </PaginationLink>
        </PaginationItem>
      )

      // Show ellipsis if current page is far from start
      if (currentPage > 3) {
        items.push(
          <PaginationItem key="ellipsis-start">
            <PaginationEllipsis />
          </PaginationItem>
        )
      }

      // Show pages around current page
      const startPage = Math.max(2, currentPage - 1)
      const endPage = Math.min(totalPages - 1, currentPage + 1)

      for (let i = startPage; i <= endPage; i++) {
        if (i !== 1 && i !== totalPages) {
          items.push(
            <PaginationItem key={i}>
              <PaginationLink
                href="#"
                onClick={(e) => {
                  e.preventDefault()
                  handlePageChange(i)
                }}
                isActive={currentPage === i}
              >
                {i}
              </PaginationLink>
            </PaginationItem>
          )
        }
      }

      // Show ellipsis if current page is far from end
      if (currentPage < totalPages - 2) {
        items.push(
          <PaginationItem key="ellipsis-end">
            <PaginationEllipsis />
          </PaginationItem>
        )
      }

      // Show last page
      if (totalPages > 1) {
        items.push(
          <PaginationItem key={totalPages}>
            <PaginationLink
              href="#"
              onClick={(e) => {
                e.preventDefault()
                handlePageChange(totalPages)
              }}
              isActive={currentPage === totalPages}
            >
              {totalPages}
            </PaginationLink>
          </PaginationItem>
        )
      }
    }

    return items
  }

  return (
    <div className="space-y-6 flex-1">
      <div>
        <h1 className="text-3xl font-bold">
          Information Security Assessments
        </h1>
        <p className="text-blue-600/80 mt-2">Manage and track security assessments and compliance evaluations</p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-lg font-bold ">Total Assessments</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{assessmentStats.total}</div>
            <p className="text-xs text-muted-foreground">Active assessments</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-lg font-bold ">Planning</CardTitle>
            <Calendar className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{assessmentStats.planning}</div>
            <p className="text-xs text-muted-foreground">In planning phase</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-lg font-bold ">In Progress</CardTitle>
            <Clock className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{assessmentStats.inProgress}</div>
            <p className="text-xs text-muted-foreground">Currently active</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-lg font-bold ">Completed</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{assessmentStats.completed}</div>
            <p className="text-xs text-muted-foreground">Successfully completed</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-lg font-bold ">On Hold</CardTitle>
            <AlertTriangle className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-600">{assessmentStats.onHold}</div>
            <p className="text-xs text-muted-foreground">Temporarily paused</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-lg font-bold ">Overdue</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{assessmentStats.overdue}</div>
            <p className="text-xs text-muted-foreground">Past due date</p>
          </CardContent>
        </Card>
      </div>
{/* <div defaultValue="assessments" className="grid w-full grid-cols-3">
  <Button value="assessments" variant="accent" onClick={() => setActiveTab("assessments")}>Assessment Register</Button>
  <Button value="dashboard" variant="accent" onClick={() => setActiveTab("dashboard")}>Dashboard</Button>
  <Button value="reports" variant="accent" onClick={() => setActiveTab("reports")}>Reports</Button>
</div> */}
      <Tabs defaultValue="assessments" className="space-y-6">
        <div className="flex items-center">
          <TabsList>
            <TabsTrigger value="assessments">Assessment Register</TabsTrigger>
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
            <TabsTrigger value="planner">Planner</TabsTrigger>
          </TabsList>

          <div className="flex items-center space-x-2">
            <Button variant="outline" className="ml-2">
              <Upload className="h-4 w-4 mr-2" />
              Import
            </Button>
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            {/* ✅ Add Assessment Dialog */}
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              {/* 🟢 Use a normal Button for the trigger — not ActionButtons */}
              <DialogTrigger asChild>
            <ActionButtons isTableAction={false} onAdd={() => setIsAddDialogOpen(true)} btnAddText="Add Assessment"/>
               {/*  <Button variant="outline">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Assessment
                </Button>
              </DialogTrigger>

              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Create New Assessment</DialogTitle>
                  <DialogDescription>
                    Add a new information security assessment.
                  </DialogDescription>
                </DialogHeader>

                {/* 🧾 Form Fields */}
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="title">Assessment Title *</Label>
                      <Input
                        id="title"
                        value={newAssessment.title || ""}
                        onChange={(e) =>
                          setNewAssessment({ ...newAssessment, title: e.target.value })
                        }
                        placeholder="Enter assessment title"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="type">Assessment Type *</Label>
                      <Select
                        value={newAssessment.type}
                        onValueChange={(value) =>
                          setNewAssessment({ ...newAssessment, type: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Compliance Assessment">
                            Compliance Assessment
                          </SelectItem>
                          <SelectItem value="Security Assessment">
                            Security Assessment
                          </SelectItem>
                          <SelectItem value="Privacy Assessment">
                            Privacy Assessment
                          </SelectItem>
                          <SelectItem value="Risk Assessment">
                            Risk Assessment
                          </SelectItem>
                          <SelectItem value="Vulnerability Assessment">
                            Vulnerability Assessment
                          </SelectItem>
                          <SelectItem value="Penetration Test">
                            Penetration Test
                          </SelectItem>
                          <SelectItem value="Internal Audit">Internal Audit</SelectItem>
                          <SelectItem value="External Audit">External Audit</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* 🆔 Assessment ID Preview */}
                  <div className="space-y-2">
                    <Label htmlFor="assessment_id">Assessment ID</Label>
                    <Input
                      id="assessment_id"
                      value={
                        newAssessment.type
                          ? `AS-${new Date().getFullYear()}-${newAssessment.type.split(' ').map((word: string) => word.charAt(0).toUpperCase()).join('').substring(0, 4)}-XXXXX (Auto-generated)`
                          : "Select assessment type to preview ID format"
                      }
                      readOnly
                      disabled
                      className="bg-muted cursor-not-allowed"
                      placeholder="Auto-generated on save"
                    />
                    <p className="text-xs text-muted-foreground">
                      Format: AS-YYYY-TYPE-XXXXX (Auto-generated on creation)
                    </p>
                  </div>

                  {/* 🧠 Framework */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="framework">Framework *</Label>
                      <FrameworkSelectInput
                        formData={newAssessment}
                        setFormData={setNewAssessment}
                        fieldName="framework"
                        onFrameworkSelected={(framework) => {
                          setNewAssessment({
                            ...newAssessment,
                            framework: framework.version 
                              ? `${framework.framework_name} (${framework.version})`
                              : framework.framework_name
                          })
                        }}
                      />
                      <p className="text-xs text-muted-foreground">
                        Search and select compliance framework (min 2 characters)
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="priority">Priority</Label>
                      <Select
                        value={newAssessment.priority}
                        onValueChange={(value) =>
                          setNewAssessment({ ...newAssessment, priority: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select priority" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Low">Low</SelectItem>
                          <SelectItem value="Medium">Medium</SelectItem>
                          <SelectItem value="High">High</SelectItem>
                          <SelectItem value="Critical">Critical</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* 👤 Assessor and Reviewer */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="assessor">Assessor *</Label>
                      <OwnerSelectInput
                        formData={newAssessment}
                        setFormData={setNewAssessment}
                        fieldName="assessor"
                      />
                      <p className="text-xs text-muted-foreground">
                        Search and select assessor from users
                      </p>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="reviewer">Reviewer</Label>
                      <OwnerSelectInput
                        formData={newAssessment}
                        setFormData={setNewAssessment}
                        fieldName="reviewer"
                      />
                      <p className="text-xs text-muted-foreground">
                        Search and select reviewer from users
                      </p>
                    </div>
                  </div>

                  {/* 🏢 Department and Unit */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="department">Department *</Label>
                      <DepartmentSelectInput
                        formData={newAssessment}
                        setFormData={setNewAssessment}
                        fieldName="department"
                        onDepartmentSelected={(department) => {
                          setNewAssessment({
                            ...newAssessment,
                            department: department.name
                          })
                        }}
                      />
                      <p className="text-xs text-muted-foreground">
                        Search and select department from organization
                      </p>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="departmental_unit">Departmental Unit</Label>
                      <UnitSelectInput
                        formData={newAssessment}
                        setFormData={setNewAssessment}
                        fieldName="departmental_unit"
                        onUnitSelected={(unit) => {
                          setNewAssessment({
                            ...newAssessment,
                            departmental_unit: unit.department_unit || unit.name
                          })
                        }}
                      />
                      <p className="text-xs text-muted-foreground">
                        Search and select specific unit within department
                      </p>
                    </div>
                  </div>

                  {/* 🧩 Asset Search Component */}
                  <div className="space-y-2">
                    <Label htmlFor="asset">Asset *</Label>
                    <AssetSelectInput
                      formData={newAssessment}
                      setFormData={setNewAssessment}
                      fieldName="asset"
                      onAssetSelected={(asset) => {
                        setSelectedAsset(asset);
                        setNewAssessment({
                          ...newAssessment,
                          asset: `${asset.asset_name} (${asset.asset_id})`,
                          asset_id: asset.asset_id || "",
                          asset_name: asset.asset_name || "",
                          model_version: asset.model_version || "",
                        });
                      }}
                    />
                    <p className="text-xs text-muted-foreground">
                      Search and select asset by name or ID (min 3 characters)
                    </p>
                  </div>

                  {selectedAsset && (
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="asset_type">Asset Type</Label>
                        <Input
                          id="asset_type"
                          value={selectedAsset.asset_type || "Not specified"}
                          readOnly
                          className="bg-muted"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="model_version">Model/Version</Label>
                        <Input
                          id="model_version"
                          value={selectedAsset.model_version || "Not specified"}
                          readOnly
                          className="bg-muted"
                        />
                      </div>
                      {selectedAsset.classification && (
                        <div className="space-y-2">
                          <Label htmlFor="classification">Classification</Label>
                          <Input
                            id="classification"
                            value={selectedAsset.classification}
                            readOnly
                            className="bg-muted"
                          />
                        </div>
                      )}
                      {selectedAsset.owner && (
                        <div className="space-y-2">
                          <Label htmlFor="asset_owner">Asset Owner</Label>
                          <Input
                            id="asset_owner"
                            value={selectedAsset.owner}
                            readOnly
                            className="bg-muted"
                          />
                        </div>
                      )}
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={newAssessment.description || ""}
                      onChange={(e) =>
                        setNewAssessment({
                          ...newAssessment,
                          description: e.target.value,
                        })
                      }
                      placeholder="Describe the assessment scope and objectives"
                      rows={3}
                    />
                  </div>
                </div>

                {/* ✅ Dialog Footer */}
              <div>
             
              <Dialog>
                  <DialogContent>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleAddAssessment} disabled={submitting}>
                    {submitting && (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    )}
                    Create Assessment
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

          </div>
        

        <TabsContent value="assessments" className="space-y-4">
          {/* Filters */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search assessments..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-8"
                    />
                  </div>
                </div>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="Planning">Planning</SelectItem>
                    <SelectItem value="In Progress">In Progress</SelectItem>
                    <SelectItem value="Completed">Completed</SelectItem>
                    <SelectItem value="On Hold">On Hold</SelectItem>
                    <SelectItem value="Cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={filterFramework} onValueChange={setFilterFramework}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Framework" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Frameworks</SelectItem>
                    <SelectItem value="ISO 27001">ISO 27001</SelectItem>
                    <SelectItem value="NIST CSF">NIST CSF</SelectItem>
                    <SelectItem value="HIPAA">HIPAA</SelectItem>
                    <SelectItem value="SOC 2">SOC 2</SelectItem>
                    <SelectItem value="PCI DSS">PCI DSS</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={filterPriority} onValueChange={setFilterPriority}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Priorities</SelectItem>
                    <SelectItem value="Critical">Critical</SelectItem>
                    <SelectItem value="High">High</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="Low">Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Pagination Controls - Top */}
          {!loading && filteredAssessments.length > 0 && (
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <span className="text-sm text-muted-foreground">Show</span>
                <Select value={pageSize.toString()} onValueChange={handlePageSizeChange}>
                  <SelectTrigger className="w-[70px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">5</SelectItem>
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="25">25</SelectItem>
                    <SelectItem value="50">50</SelectItem>
                    <SelectItem value="100">100</SelectItem>
                  </SelectContent>
                </Select>
                <span className="text-sm text-muted-foreground">entries</span>
              </div>



              <div className="text-sm ">
                {filteredAssessments.length > 0 ? (
                  <>
                    Showing {startIndex + 1} to {Math.min(endIndex, filteredAssessments.length)} of {filteredAssessments.length} assessments
                  </>
                ) : (
                  "No assessments found"
                )}
              </div>
            </div>
          )}

          {/* Assessments Table */}
          <Card>
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin" />
                <span className="ml-2">Loading assessments...</span>
              </div>
            ) : (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="truncate">Assessment</TableHead>
                      <TableHead className="truncate">Framework</TableHead>
                      <TableHead className="truncate">Status</TableHead>
                      <TableHead className="truncate">Priority</TableHead>
                      <TableHead className="truncate">Progress</TableHead>
                      <TableHead className="truncate">Assessor</TableHead>
                      <TableHead className="truncate">Due Date</TableHead>
                      <TableHead className="truncate">Findings</TableHead>
                      <TableHead className="truncate text-center">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {currentAssessments.map((assessment) => (
                      <TableRow key={assessment.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{assessment.title}</div>
                            <div className="text-sm text-muted-foreground">
                              {assessment.assessmentId || assessment.id}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="truncate">
                          <Badge variant="outline">{assessment.framework}</Badge>
                        </TableCell>
                        <TableCell className="truncate">
                          <Badge variant="outline" className={getStatusColor(assessment.status)}>
                            {assessment.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <div className={`w-2 h-2 rounded-full ${getPriorityColor(assessment.priority)}`} />
                            <span className="text-sm">{assessment.priority}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Progress value={assessment.progress} className="w-16" />
                            <span className="text-sm">{assessment.progress}%</span>
                          </div>
                        </TableCell>
                        <TableCell>{assessment.assessor}</TableCell>
                        <TableCell>
                          <div className={isOverdue(assessment.dueDate, assessment.status) ? "text-red-600" : ""}>
                            {formatDate(assessment.dueDate)}
                            {isOverdue(assessment.dueDate, assessment.status) && (
                              <Badge variant="outline" className="m-2 truncate">
                                Overdue
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-1">
                            <span className="text-sm">{assessment.findings}</span>
                            {assessment.criticalFindings > 0 && (
                              <Badge variant="outline" className="truncate">
                                {assessment.criticalFindings} Critical
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <ActionButtons isTableAction={true} 
                              onView={() => {
                                setSelectedAssessment(assessment)
                                setIsViewDialogOpen(true)
                              }} 
                              onEdit={() => openEditDialog(assessment)} 
                              onDelete={() => handleDeleteAssessment(assessment.id)}
                              actionObj={assessment}
                              deleteDialogTitle={assessment.title}                           
                              />
                            {/* <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setSelectedAssessment(assessment)
                                setIsViewDialogOpen(true)
                              }}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => openEditDialog(assessment)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="text-red-400 hover:bg-red-900/20 hover:text-red-300 dark:text-red-400 dark:hover:bg-red-900/20 dark:hover:text-red-300"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    This action cannot be undone. This will permanently delete the assessment "
                                    {assessment.title}".
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => handleDeleteAssessment(assessment.id)}
                                    className="bg-red-600 hover:bg-red-700"
                                  >
                                    Delete Assessment
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog> */}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </Card>

          {/* Pagination Controls - Bottom */}
          {!loading && totalPages > 1 && (
            <div className="flex items-center justify-between">
              <div className="text-sm ">
                {filteredAssessments.length > 0 ? (
                  <>
                    Showing {startIndex + 1} to {Math.min(endIndex, filteredAssessments.length)} of {filteredAssessments.length} assessments
                  </>
                ) : (
                  "No assessments found"
                )}
              </div>

              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      href="#"
                      onClick={(e) => {
                        e.preventDefault()
                        if (currentPage > 1) handlePageChange(currentPage - 1)
                      }}
                      className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                    />
                  </PaginationItem>

                  {generatePaginationItems()}

                  <PaginationItem>
                    <PaginationNext
                      href="#"
                      onClick={(e) => {
                        e.preventDefault()
                        if (currentPage < totalPages) handlePageChange(currentPage + 1)
                      }}
                      className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </TabsContent>

        <TabsContent value="dashboard" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Assessment Status Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Planning</span>
                    <span className="text-sm font-medium">{assessmentStats.planning}</span>
                  </div>
                  <Progress value={(assessmentStats.planning / assessmentStats.total) * 100} className="h-2" />

                  <div className="flex items-center justify-between">
                    <span className="text-sm">In Progress</span>
                    <span className="text-sm font-medium">{assessmentStats.inProgress}</span>
                  </div>
                  <Progress value={(assessmentStats.inProgress / assessmentStats.total) * 100} className="h-2" />

                  <div className="flex items-center justify-between">
                    <span className="text-sm">Completed</span>
                    <span className="text-sm font-medium">{assessmentStats.completed}</span>
                  </div>
                  <Progress value={(assessmentStats.completed / assessmentStats.total) * 100} className="h-2" />

                  <div className="flex items-center justify-between">
                    <span className="text-sm">On Hold</span>
                    <span className="text-sm font-medium">{assessmentStats.onHold}</span>
                  </div>
                  <Progress value={(assessmentStats.onHold / assessmentStats.total) * 100} className="h-2" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Framework Coverage</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {["ISO 27001", "NIST CSF", "HIPAA", "SOC 2"].map((framework) => {
                    const count = assessments.filter((a) => a.framework === framework).length
                    return (
                      <div key={framework} className="flex items-center justify-between">
                        <span className="text-sm">{framework}</span>
                        <span className="text-sm font-medium">{count}</span>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="reports" className="space-y-4">
          {/* Placeholder for Reports Tab */}
          <div className="p-4">
            <p>Reports Tab Content</p>
          </div>
        </TabsContent>

        <TabsContent value="planner" className="space-y-4">
          <AssessmentGanttChart 
            assessments={assessments.map(a => ({
              id: Number(a.id),
              assessment_id: a.assessmentId || a.id,
              name: a.title,
              type: a.type,
              status: a.status,
              priority: a.priority,
              start_date: a.startDate,
              end_date: a.endDate,
              assessor: a.assessor,
              progress: a.progress,
              organization: a.department
            }))}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}
