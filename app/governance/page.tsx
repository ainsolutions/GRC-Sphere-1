"use client"

import React, { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"

import { DocumentUploadForm } from "@/components/document-upload-form"
import { DocumentEditForm } from "@/components/document-edit-form"
import { DocumentVersionHistory } from "@/components/document-version-history"
import { DocumentStatusWorkflow } from "@/components/document-status-workflow"
import { ControlCreateForm, ControlEditForm } from "@/components/controls-forms"
import {
  Building2,
  TrendingUp,
  DollarSign,
  FileText,
  Shield,
  Target,
  BarChart3,
  Plus,
  Edit,
  Trash2,
  Eye,
  Download,
  Upload,
  Calendar,
  Users,
  AlertTriangle,
  CheckCircle,
  Clock,
  PieChart,
  Activity,
  BookOpen,
  Settings,
  Search,
  Filter,
  MoreHorizontal,
  GitBranch,
  ArrowUp,
  ArrowDown,
} from "lucide-react"
import StarBorder from "../StarBorder"
// Removed duplicate ControlEditForm import; using controls-forms.tsx export

// Remove mock data - we'll use the API data

// Remove mock budget data - we'll use the API data

const mockDocuments = [
  {
    id: 1,
    title: "ISO 27001 Information Security Management System",
    type: "Framework",
    version: "v2.1",
    status: "Active",
    lastReview: "2024-01-10",
    nextReview: "2024-07-10",
    owner: "CISO",
    category: "Security Framework",
  },
  {
    id: 2,
    title: "Data Classification and Handling Policy",
    type: "Policy",
    version: "v1.3",
    status: "Active",
    lastReview: "2024-01-05",
    nextReview: "2024-07-05",
    owner: "Data Protection Officer",
    category: "Data Protection",
  },
  {
    id: 3,
    title: "Incident Response Procedure",
    type: "Procedure",
    version: "v3.0",
    status: "Under Review",
    lastReview: "2023-12-15",
    nextReview: "2024-06-15",
    owner: "Security Operations Manager",
    category: "Incident Management",
  },
  {
    id: 4,
    title: "Access Control Standard",
    type: "Standard",
    version: "v2.2",
    status: "Active",
    lastReview: "2024-01-08",
    nextReview: "2024-07-08",
    owner: "Identity & Access Manager",
    category: "Access Management",
  },
]

const mockControls = [
  {
    id: 1,
    name: "Access Control Management",
    framework: "ISO 27001",
    controlId: "A.9.1.1",
    category: "Access Control",
    status: "Implemented",
    effectiveness: "High",
    lastAssessment: "2024-01-10",
    owner: "IT Security Team",
    description: "Controls for managing user access to information systems",
  },
  {
    id: 2,
    name: "Data Encryption",
    framework: "NIST CSF",
    controlId: "PR.DS-1",
    category: "Data Security",
    status: "Implemented",
    effectiveness: "High",
    lastAssessment: "2024-01-08",
    owner: "Data Security Team",
    description: "Encryption controls for data at rest and in transit",
  },
  {
    id: 3,
    name: "Security Monitoring",
    framework: "ISO 27001",
    controlId: "A.12.4.1",
    category: "Monitoring",
    status: "Partially Implemented",
    effectiveness: "Medium",
    lastAssessment: "2024-01-05",
    owner: "SOC Team",
    description: "Continuous monitoring of security events and incidents",
  },
  {
    id: 4,
    name: "Vulnerability Management",
    framework: "NIST CSF",
    controlId: "PR.IP-12",
    category: "Vulnerability Management",
    status: "Implemented",
    effectiveness: "High",
    lastAssessment: "2024-01-12",
    owner: "Vulnerability Management Team",
    description: "Processes for identifying and remediating vulnerabilities",
  },
]

export default function GovernancePage() {
  const [activeTab, setActiveTab] = useState("kpis")
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [loading, setLoading] = useState(false)
  const [kpis, setKpis] = useState<any[]>([])
  const [budgets, setBudgets] = useState<any[]>([])
  const [documents, setDocuments] = useState<any[]>([])
  const [controls, setControls] = useState<any[]>([])
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<any>(null)
  const [currentModule, setCurrentModule] = useState("")

  // Filter and sort states for each tab
  const [kpiFilters, setKpiFilters] = useState({
    status: "all",
    category: "all",
    trend: "all",
    owner: "all",
    department: "all",
    search: ""
  })
  const [kpiSortBy, setKpiSortBy] = useState("name")
  const [kpiSortOrder, setKpiSortOrder] = useState("asc")

  const [budgetFilters, setBudgetFilters] = useState({
    status: "all",
    category: "all",
    fiscalYear: "all",
    search: ""
  })
  const [budgetSortBy, setBudgetSortBy] = useState("category")
  const [budgetSortOrder, setBudgetSortOrder] = useState("asc")

  const [controlFilters, setControlFilters] = useState({
    status: "all",
    framework: "all",
    category: "all",
    effectiveness: "all",
    search: ""
  })
  const [controlSortBy, setControlSortBy] = useState("name")
  const [controlSortOrder, setControlSortOrder] = useState("asc")

  // Document management state
  const [isDocumentUploadOpen, setIsDocumentUploadOpen] = useState(false)
  const [isDocumentHistoryOpen, setIsDocumentHistoryOpen] = useState(false)
  const [isDocumentWorkflowOpen, setIsDocumentWorkflowOpen] = useState(false)
  const [selectedDocument, setSelectedDocument] = useState<any>(null)
  const { toast } = useToast()

  // Document management functions
  const handleDocumentUpload = (document: any) => {
    setDocuments(prev => [document, ...prev])
    setIsDocumentUploadOpen(false)
    fetchDocuments() // Refresh the list
  }

  const handleViewDocumentHistory = (document: any) => {
    setSelectedDocument(document)
    setIsDocumentHistoryOpen(true)
  }

  const handleViewDocumentWorkflow = (document: any) => {
    setSelectedDocument(document)
    setIsDocumentWorkflowOpen(true)
  }

  // Data fetching functions
  const fetchKPIs = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/governance/kpis")
      const data = await response.json()
      if (data.success) {
        setKpis(data.data)
      }
    } catch (error) {
      console.error("Error fetching KPIs:", error)
      toast({
        title: "Error",
        description: "Failed to fetch KPIs",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const fetchBudgets = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/governance/budget")
      const data = await response.json()
      if (data.success) {
        setBudgets(data.data)
      }
    } catch (error) {
      console.error("Error fetching budgets:", error)
      toast({
        title: "Error",
        description: "Failed to fetch budget data",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const fetchDocuments = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/governance/documents")
      const data = await response.json()
      if (data.success) {
        setDocuments(data.data)
      }
    } catch (error) {
      console.error("Error fetching documents:", error)
      toast({
        title: "Error",
        description: "Failed to fetch documents",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const fetchControls = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/governance/controls")
      const data = await response.json()
      if (data.success) {
        setControls(data.data)
      }
    } catch (error) {
      console.error("Error fetching controls:", error)
      toast({
        title: "Error",
        description: "Failed to fetch controls",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  // Filtering and sorting functions
  const filterAndSortKPIs = (kpiData: any[]) => {
    let filtered = kpiData.filter((kpi: any) => {
      // Search filter
      if (kpiFilters.search && !kpi.name?.toLowerCase().includes(kpiFilters.search.toLowerCase()) &&
        !kpi.description?.toLowerCase().includes(kpiFilters.search.toLowerCase()) &&
        !kpi.category?.toLowerCase().includes(kpiFilters.search.toLowerCase())) {
        return false
      }

      // Status filter
      if (kpiFilters.status !== "all" && kpi.status !== kpiFilters.status) {
        return false
      }

      // Category filter
      if (kpiFilters.category !== "all" && kpi.category !== kpiFilters.category) {
        return false
      }

      // Trend filter
      if (kpiFilters.trend !== "all" && kpi.trend !== kpiFilters.trend) {
        return false
      }

      // Owner filter
      if (kpiFilters.owner !== "all" && kpi.owner !== kpiFilters.owner) {
        return false
      }

      // Department filter
      if (kpiFilters.department !== "all" && kpi.department !== kpiFilters.department) {
        return false
      }

      return true
    })

    // Sort the filtered results
    filtered.sort((a: any, b: any) => {
      let aVal = a[kpiSortBy]
      let bVal = b[kpiSortBy]

      // Handle different data types
      if (kpiSortBy === "last_updated" || kpiSortBy === "created_at") {
        aVal = new Date(aVal).getTime()
        bVal = new Date(bVal).getTime()
      } else if (kpiSortBy === "target_value" || kpiSortBy === "current_value") {
        aVal = parseFloat(aVal) || 0
        bVal = parseFloat(bVal) || 0
      } else {
        aVal = String(aVal || "").toLowerCase()
        bVal = String(bVal || "").toLowerCase()
      }

      if (kpiSortOrder === "asc") {
        return aVal < bVal ? -1 : aVal > bVal ? 1 : 0
      } else {
        return aVal > bVal ? -1 : aVal < bVal ? 1 : 0
      }
    })

    return filtered
  }

  const filterAndSortBudgets = (budgetData: any[]) => {
    let filtered = budgetData.filter((budget: any) => {
      // Search filter
      if (budgetFilters.search && !budget.category?.toLowerCase().includes(budgetFilters.search.toLowerCase()) &&
        !budget.subcategory?.toLowerCase().includes(budgetFilters.search.toLowerCase())) {
        return false
      }

      // Status filter
      if (budgetFilters.status !== "all" && budget.status !== budgetFilters.status) {
        return false
      }

      // Category filter
      if (budgetFilters.category !== "all" && budget.category !== budgetFilters.category) {
        return false
      }

      // Fiscal year filter
      if (budgetFilters.fiscalYear !== "all" && budget.fiscal_year !== budgetFilters.fiscalYear) {
        return false
      }

      return true
    })

    // Sort the filtered results
    filtered.sort((a: any, b: any) => {
      let aVal = a[budgetSortBy]
      let bVal = b[budgetSortBy]

      // Handle different data types
      if (budgetSortBy === "allocated_amount" || budgetSortBy === "spent_amount" || budgetSortBy === "remaining_amount") {
        aVal = parseFloat(aVal) || 0
        bVal = parseFloat(bVal) || 0
      } else if (budgetSortBy === "created_at" || budgetSortBy === "updated_at") {
        aVal = new Date(aVal).getTime()
        bVal = new Date(bVal).getTime()
      } else {
        aVal = String(aVal || "").toLowerCase()
        bVal = String(bVal || "").toLowerCase()
      }

      if (budgetSortOrder === "asc") {
        return aVal < bVal ? -1 : aVal > bVal ? 1 : 0
      } else {
        return aVal > bVal ? -1 : aVal < bVal ? 1 : 0
      }
    })

    return filtered
  }

  const filterAndSortControls = (controlData: any[]) => {
    let filtered = controlData.filter((control: any) => {
      // Search filter
      if (controlFilters.search && !control.name?.toLowerCase().includes(controlFilters.search.toLowerCase()) &&
        !control.description?.toLowerCase().includes(controlFilters.search.toLowerCase()) &&
        !control.control_id?.toLowerCase().includes(controlFilters.search.toLowerCase())) {
        return false
      }

      // Status filter
      if (controlFilters.status !== "all" && (control.implementation_status || control.status) !== controlFilters.status) {
        return false
      }

      // Framework filter
      if (controlFilters.framework !== "all" && control.framework !== controlFilters.framework) {
        return false
      }

      // Category filter
      if (controlFilters.category !== "all" && control.category !== controlFilters.category) {
        return false
      }

      // Effectiveness filter
      if (controlFilters.effectiveness !== "all" && (control.effectiveness_rating || control.effectiveness) !== controlFilters.effectiveness) {
        return false
      }

      return true
    })

    // Sort the filtered results
    filtered.sort((a: any, b: any) => {
      let aVal = a[controlSortBy]
      let bVal = b[controlSortBy]

      // Handle different data types
      if (controlSortBy === "effectiveness_rating" || controlSortBy === "effectiveness") {
        aVal = parseFloat(aVal) || 0
        bVal = parseFloat(bVal) || 0
      } else if (controlSortBy === "last_assessment_date" || controlSortBy === "lastAssessment" || controlSortBy === "created_at") {
        aVal = new Date(aVal).getTime()
        bVal = new Date(bVal).getTime()
      } else {
        aVal = String(aVal || "").toLowerCase()
        bVal = String(bVal || "").toLowerCase()
      }

      if (controlSortOrder === "asc") {
        return aVal < bVal ? -1 : aVal > bVal ? 1 : 0
      } else {
        return aVal > bVal ? -1 : aVal < bVal ? 1 : 0
      }
    })

    return filtered
  }

  // Get filtered and sorted data
  const filteredKPIs = filterAndSortKPIs(kpis)
  const filteredBudgets = filterAndSortBudgets(budgets)
  const filteredControls = filterAndSortControls(controls)

  // CRUD operations
  const handleCreate = async (module: string, data: any) => {
    try {
      setLoading(true)
      const response = await fetch(`/api/governance/${module}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })
      const result = await response.json()
      if (result.success) {
        toast({
          title: "Success",
          description: `${module} created successfully`,
        })
        // Refresh data
        switch (module) {
          case "kpis":
            fetchKPIs()
            break
          case "budget":
            fetchBudgets()
            break
          case "documents":
            fetchDocuments()
            break
          case "controls":
            fetchControls()
            break
        }
        setIsCreateDialogOpen(false)
      } else {
        throw new Error(result.error)
      }
    } catch (error) {
      console.error(`Error creating ${module}:`, error)
      toast({
        title: "Error",
        description: `Failed to create ${module}`,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleUpdate = async (module: string, id: string, data: any) => {
    try {
      setLoading(true)
      const response = await fetch(`/api/governance/${module}/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })
      const result = await response.json()
      if (result.success) {
        toast({
          title: "Success",
          description: `${module} updated successfully`,
        })
        // Refresh data
        switch (module) {
          case "kpis":
            fetchKPIs()
            break
          case "budget":
            fetchBudgets()
            break
          case "documents":
            fetchDocuments()
            break
          case "controls":
            fetchControls()
            break
        }
        setIsEditDialogOpen(false)
        setEditingItem(null)
      } else {
        throw new Error(result.error)
      }
    } catch (error) {
      console.error(`Error updating ${module}:`, error)
      toast({
        title: "Error",
        description: `Failed to update ${module}`,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (module: string, id: string) => {
    try {
      setLoading(true)
      const response = await fetch(`/api/governance/${module}/${id}`, {
        method: "DELETE",
      })
      const result = await response.json()
      if (result.success) {
        toast({
          title: "Success",
          description: `${module} deleted successfully`,
        })
        // Refresh data
        switch (module) {
          case "kpis":
            fetchKPIs()
            break
          case "budget":
            fetchBudgets()
            break
          case "documents":
            fetchDocuments()
            break
          case "controls":
            fetchControls()
            break
        }
      } else {
        throw new Error(result.error)
      }
    } catch (error) {
      console.error(`Error deleting ${module}:`, error)
      toast({
        title: "Error",
        description: `Failed to delete ${module}`,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  // Load data on component mount
  useEffect(() => {
    fetchKPIs()
    fetchBudgets()
    fetchDocuments()
    fetchControls()
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "green":
      case "on-track":
      case "Active":
      case "Implemented":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      case "yellow":
      case "warning":
      case "Under Review":
      case "Partially Implemented":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
      case "red":
      case "critical":
      case "Overdue":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
    }
  }

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "improving":
        return <TrendingUp className="h-4 w-4 text-green-500" />
      case "declining":
        return <TrendingUp className="h-4 w-4 text-red-500 rotate-180" />
      case "stable":
        return <Activity className="h-4 w-4 text-blue-500" />
      default:
        return <Activity className="h-4 w-4 text-gray-500" />
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(amount)
  }

  return (
    <div className="min-h-screen ">
      <main className="flex-1 overflow-x-hidden overflow-y-auto">
        <div className="container mx-auto p-6 space-y-6">
          <div className="flex justify-between items-center">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold text-blue-600/100 dark:text-blue-500/100">
                Governance
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Comprehensive governance, risk, and compliance management
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
              <Button variant="outline" onClick={() => {
                setCurrentModule(activeTab)
                setIsCreateDialogOpen(true)
              }}>  Add New
              </Button>
            </div>
          </div>

          {/* Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle>Active KPIs</CardTitle>
                <TrendingUp className="h-8 w-8 text-blue-500" />
               </CardHeader>
               <CardContent>
                  <div className="flex items-center justify-between">
                    <div>
                    <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">24</p>
                  </div>
                    <div className="mt-2">
                  <span className="text-xs text-green-600 dark:text-green-400">+12% from last month</span>
                </div>
                </div>
                </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle>Budget Utilization</CardTitle>
                <DollarSign className="h-8 w-8 text-green-500" />
               </CardHeader>
               <CardContent>
                  <div className="flex items-center justify-between">
                    <div>
                    <p className="text-2xl font-bold text-green-600 dark:text-green-400">78%</p>
                    </div>
                    <div className="mt-2">
                  <span className="text-xs text-green-600 dark:text-green-400">On track</span>
                </div>
                </div>
                </CardContent>
            </Card>
           
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle>Active Documents</CardTitle>
              <FileText className="h-8 w-8 text-purple-500" />
              </CardHeader>
                  <CardContent>
                <div className="flex items-center justify-between">
                  <div>
              
                    <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">156</p>
                  </div>
                </div>
                <div className="mt-2">
                  <span className="text-xs text-yellow-600 dark:text-yellow-400">8 pending review</span>
                </div>
              </CardContent>
              </Card>
           
            
        
       

           <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle>Security Controls</CardTitle>
              <Shield className="h-8 w-8 text-cyan-500" />
              </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold text-cyan-600 dark:text-cyan-400">89</p>
                  <span className="text-xs text-green-600 dark:text-green-400">92% effective</span>
                  </CardContent>
            
              
            </Card>
          </div>    

          {/* Main Content Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-4 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
              <TabsTrigger value="kpis" className="flex items-center space-x-2">
                <Target className="h-6 w-6" />
                KPIs & Performance
              </TabsTrigger>
              <TabsTrigger value="budget" className="flex items-center space-x-2">
                <DollarSign className="h-6 w-6" />
                Budget Management
              </TabsTrigger>
              <TabsTrigger value="documents" className="flex items-center space-x-2">
                <Shield className="h-6 w-6" />
                Document Management
              </TabsTrigger>
              <TabsTrigger value="controls" className="flex items-center space-x-2">
                <Shield className="h-6 w-6" />
                Controls Repository
              </TabsTrigger>
            </TabsList>

            {/* KPIs & Performance Measurement Tab */}
            <TabsContent value="kpis" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Target className="h-5 w-5 text-blue-500" />
                    <span>Information Security KPIs & Performance Measurement</span>
                  </CardTitle>
                  <CardDescription>
                    Monitor and track key performance indicators for information security governance
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {/* KPI Filters */}
                  <div className="mb-6 p-4 rounded-lg">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                      {/* Search */}
                      <div>
                        <Label htmlFor="kpi-search" className="text-sm font-medium">Search</Label>
                        <Input
                          id="kpi-search"
                          placeholder="Search KPIs..."
                          value={kpiFilters.search}
                          onChange={(e) => setKpiFilters({ ...kpiFilters, search: e.target.value })}
                          className="mt-1"
                        />
                      </div>

                      {/* Status Filter */}
                      <div>
                        <Label htmlFor="kpi-status" className="text-sm font-medium">Status</Label>
                        <Select value={kpiFilters.status} onValueChange={(value) => setKpiFilters({ ...kpiFilters, status: value })}>
                          <SelectTrigger className="mt-1">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Statuses</SelectItem>
                            <SelectItem value="active">Active</SelectItem>
                            <SelectItem value="inactive">Inactive</SelectItem>
                            <SelectItem value="draft">Draft</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Category Filter */}
                      <div>
                        <Label htmlFor="kpi-category" className="text-sm font-medium">Category</Label>
                        <Select value={kpiFilters.category} onValueChange={(value) => setKpiFilters({ ...kpiFilters, category: value })}>
                          <SelectTrigger className="mt-1">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Categories</SelectItem>
                            <SelectItem value="security">Security</SelectItem>
                            <SelectItem value="compliance">Compliance</SelectItem>
                            <SelectItem value="performance">Performance</SelectItem>
                            <SelectItem value="risk">Risk</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Trend Filter */}
                      <div>
                        <Label htmlFor="kpi-trend" className="text-sm font-medium">Trend</Label>
                        <Select value={kpiFilters.trend} onValueChange={(value) => setKpiFilters({ ...kpiFilters, trend: value })}>
                          <SelectTrigger className="mt-1">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Trends</SelectItem>
                            <SelectItem value="improving">Improving</SelectItem>
                            <SelectItem value="stable">Stable</SelectItem>
                            <SelectItem value="declining">Declining</SelectItem>
                            <SelectItem value="unknown">Unknown</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    {/* Sort Options */}
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        <Label htmlFor="kpi-sort" className="text-sm font-medium">Sort by:</Label>
                        <Select value={kpiSortBy} onValueChange={setKpiSortBy}>
                          <SelectTrigger className="w-40">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="name">Name</SelectItem>
                            <SelectItem value="category">Category</SelectItem>
                            <SelectItem value="status">Status</SelectItem>
                            <SelectItem value="trend">Trend</SelectItem>
                            <SelectItem value="target_value">Target Value</SelectItem>
                            <SelectItem value="current_value">Current Value</SelectItem>
                            <SelectItem value="last_updated">Last Updated</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setKpiSortOrder(kpiSortOrder === "asc" ? "desc" : "asc")}
                        className="flex items-center space-x-1"
                      >
                        {kpiSortOrder === "asc" ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />}
                        <span>{kpiSortOrder === "asc" ? "Ascending" : "Descending"}</span>
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {loading ? (
                      <div className="flex items-center justify-center h-32">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                      </div>
                    ) : filteredKPIs.length === 0 ? (
                      <div className="text-center py-8 text-gray-500">
                        {kpis.length === 0 ? "No KPIs found. Create your first KPI to get started." : "No KPIs match your current filters."}
                      </div>
                    ) : (
                      filteredKPIs.map((kpi: any) => (
                        <div key={kpi.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center space-x-3">
                              <h3 className="font-semibold text-gray-900 dark:text-white">{kpi.name}</h3>
                              <Badge className={getStatusColor(kpi.status)}>{kpi.status}</Badge>
                              <Badge variant="outline">{kpi.category}</Badge>
                            </div>
                            <div className="flex items-center space-x-2">
                              {getTrendIcon(kpi.trend)}
                              <span className="text-sm text-gray-500">{kpi.trend}</span>
                            </div>
                          </div>
                          <div className="grid grid-cols-3 gap-4 mb-3">
                            <div>
                              <p className="text-sm text-gray-600 dark:text-gray-400">Target</p>
                              <p className="font-semibold text-blue-600 dark:text-blue-400">{kpi.target_value} {kpi.unit || ''}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-600 dark:text-gray-400">Current</p>
                              <p className="font-semibold text-green-600 dark:text-green-400">{kpi.current_value} {kpi.unit || ''}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-600 dark:text-gray-400">Last Updated</p>
                              <p className="font-semibold text-gray-600 dark:text-gray-400">
                                {kpi.last_updated ? new Date(kpi.last_updated).toLocaleDateString() : 'Not updated'}
                              </p>
                            </div>
                          </div>
                          <div className="mb-3">
                            <p className="text-sm text-gray-600 dark:text-gray-400">Owner: {kpi.owner || 'Not assigned'}</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Department: {kpi.department || 'Not assigned'}</p>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  setEditingItem(kpi)
                                  setCurrentModule("kpis")
                                  setIsEditDialogOpen(true)
                                }}
                              >
                                <Edit className="h-4 w-4 mr-1" />
                                Edit
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDelete("kpis", kpi.id.toString())}
                                className="text-red-600 hover:text-red-700"
                              >
                                <Trash2 className="h-4 w-4 mr-1" />
                                Delete
                              </Button>
                            </div>
                            <Button variant="ghost" size="sm">
                              <BarChart3 className="h-4 w-4 mr-1" />
                              View Trends
                            </Button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Budget Management Tab */}
            <TabsContent value="budget" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <DollarSign className="h-5 w-5 text-green-500" />
                    <span>Budget Management</span>
                  </CardTitle>
                  <CardDescription>
                    Track and manage information security budget allocation and spending
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {/* Budget Filters */}
                  <div className="mb-6 p-4 rounded-lg">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                      {/* Search */}
                      <div>
                        <Label htmlFor="budget-search" className="text-sm font-medium">Search</Label>
                        <Input
                          id="budget-search"
                          placeholder="Search budgets..."
                          value={budgetFilters.search}
                          onChange={(e) => setBudgetFilters({ ...budgetFilters, search: e.target.value })}
                          className="mt-1"
                        />
                      </div>

                      {/* Status Filter */}
                      <div>
                        <Label htmlFor="budget-status" className="text-sm font-medium">Status</Label>
                        <Select value={budgetFilters.status} onValueChange={(value) => setBudgetFilters({ ...budgetFilters, status: value })}>
                          <SelectTrigger className="mt-1">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Statuses</SelectItem>
                            <SelectItem value="on-track">On Track</SelectItem>
                            <SelectItem value="warning">Warning</SelectItem>
                            <SelectItem value="critical">Critical</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Category Filter */}
                      <div>
                        <Label htmlFor="budget-category" className="text-sm font-medium">Category</Label>
                        <Select value={budgetFilters.category} onValueChange={(value) => setBudgetFilters({ ...budgetFilters, category: value })}>
                          <SelectTrigger className="mt-1">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Categories</SelectItem>
                            <SelectItem value="Security Tools & Software">Security Tools & Software</SelectItem>
                            <SelectItem value="Security Training & Certification">Security Training & Certification</SelectItem>
                            <SelectItem value="Incident Response & Recovery">Incident Response & Recovery</SelectItem>
                            <SelectItem value="Compliance & Auditing">Compliance & Auditing</SelectItem>
                            <SelectItem value="Infrastructure & Hardware">Infrastructure & Hardware</SelectItem>
                            <SelectItem value="Other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Fiscal Year Filter */}
                      <div>
                        <Label htmlFor="budget-fiscal-year" className="text-sm font-medium">Fiscal Year</Label>
                        <Select value={budgetFilters.fiscalYear} onValueChange={(value) => setBudgetFilters({ ...budgetFilters, fiscalYear: value })}>
                          <SelectTrigger className="mt-1">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Years</SelectItem>
                            <SelectItem value="2024">2024</SelectItem>
                            <SelectItem value="2025">2025</SelectItem>
                            <SelectItem value="2026">2026</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    {/* Sort Options */}
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        <Label htmlFor="budget-sort" className="text-sm font-medium">Sort by:</Label>
                        <Select value={budgetSortBy} onValueChange={setBudgetSortBy}>
                          <SelectTrigger className="w-40">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="category">Category</SelectItem>
                            <SelectItem value="subcategory">Subcategory</SelectItem>
                            <SelectItem value="status">Status</SelectItem>
                            <SelectItem value="allocated_amount">Allocated Amount</SelectItem>
                            <SelectItem value="spent_amount">Spent Amount</SelectItem>
                            <SelectItem value="remaining_amount">Remaining Amount</SelectItem>
                            <SelectItem value="fiscal_year">Fiscal Year</SelectItem>
                            <SelectItem value="created_at">Created Date</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setBudgetSortOrder(budgetSortOrder === "asc" ? "desc" : "asc")}
                        className="flex items-center space-x-1"
                      >
                        {budgetSortOrder === "asc" ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />}
                        <span>{budgetSortOrder === "asc" ? "Ascending" : "Descending"}</span>
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {loading ? (
                      <div className="flex items-center justify-center h-32">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                      </div>
                    ) : filteredBudgets.length === 0 ? (
                      <div className="text-center py-8 text-gray-500">
                        {budgets.length === 0 ? "No budget items found. Create your first budget item to get started." : "No budget items match your current filters."}
                      </div>
                    ) : (
                      filteredBudgets.map((budget: any) => (
                        <div key={budget.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center space-x-3">
                              <h3 className="font-semibold text-gray-900 dark:text-white">{budget.category}</h3>
                              {budget.subcategory && (
                                <Badge variant="outline">{budget.subcategory}</Badge>
                              )}
                              <Badge className={getStatusColor(budget.status)}>{budget.status}</Badge>
                              <Badge variant="outline">{budget.fiscal_year}</Badge>
                            </div>
                            <div className="text-right">
                              <p className="text-sm text-gray-600 dark:text-gray-400">Utilization</p>
                              <p className="font-semibold text-blue-600 dark:text-blue-400">
                                {(() => {
                                  const percentage = budget.utilization_percentage;
                                  if (typeof percentage === 'number' && !isNaN(percentage)) {
                                    return percentage.toFixed(1);
                                  }
                                  return '0.0';
                                })()}%
                              </p>
                            </div>
                          </div>
                          <div className="mb-3">
                            <Progress
                              value={(() => {
                                const percentage = budget.utilization_percentage;
                                if (typeof percentage === 'number' && !isNaN(percentage)) {
                                  return Math.min(Math.max(percentage, 0), 100); // Ensure value is between 0-100
                                }
                                return 0;
                              })()}
                              className="h-2"
                            />
                          </div>
                          <div className="grid grid-cols-3 gap-4 mb-3">
                            <div>
                              <p className="text-sm text-gray-600 dark:text-gray-400">Allocated</p>
                              <p className="font-semibold text-blue-600 dark:text-blue-400">
                                {formatCurrency(typeof budget.allocated_amount === 'number' ? budget.allocated_amount : 0)}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-600 dark:text-gray-400">Spent</p>
                              <p className="font-semibold text-red-600 dark:text-red-400">
                                {formatCurrency(typeof budget.spent_amount === 'number' ? budget.spent_amount : 0)}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-600 dark:text-gray-400">Remaining</p>
                              <p className="font-semibold text-green-600 dark:text-green-400">
                                {(() => {
                                  const remaining = budget.remaining_amount;
                                  if (typeof remaining === 'number' && !isNaN(remaining)) {
                                    return formatCurrency(remaining);
                                  }
                                  // Fallback calculation
                                  const allocated = budget.allocated_amount || 0;
                                  const spent = budget.spent_amount || 0;
                                  const committed = budget.committed_amount || 0;
                                  return formatCurrency(allocated - spent - committed);
                                })()}
                              </p>
                            </div>
                          </div>
                          <div className="mb-3">
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              Owner: {budget.budget_owner || 'Not assigned'} •
                              Department: {budget.department || 'Not assigned'}
                            </p>
                            {budget.description && (
                              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                {budget.description}
                              </p>
                            )}
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  setEditingItem(budget)
                                  setCurrentModule("budget")
                                  setIsEditDialogOpen(true)
                                }}
                              >
                                <Edit className="h-4 w-4 mr-1" />
                                Edit Budget
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDelete("budget", budget.id.toString())}
                                className="text-red-600 hover:text-red-700"
                              >
                                <Trash2 className="h-4 w-4 mr-1" />
                                Delete
                              </Button>
                            </div>
                            <Button variant="ghost" size="sm">
                              <BarChart3 className="h-4 w-4 mr-1" />
                              View Reports
                            </Button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Document Management Tab */}
            <TabsContent value="documents" className="space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center space-x-2">
                        <FileText className="h-5 w-5 text-purple-500" />
                        <span>Document Management</span>
                      </CardTitle>
                      <CardDescription>
                        Manage security frameworks, policies, procedures, and standards with version control
                      </CardDescription>
                    </div>
                    <Button onClick={() => setIsDocumentUploadOpen(true)}>
                      <Upload className="h-4 w-4 mr-2" />
                      Add Document
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Document ID</TableHead>
                        <TableHead>Title</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Version</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Owner</TableHead>
                        <TableHead>Versions</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {loading ? (
                        <TableRow>
                          <TableCell colSpan={8} className="text-center py-8">
                            <div className="flex items-center justify-center">
                              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                            </div>
                          </TableCell>
                        </TableRow>
                      ) : documents.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                            No documents found. Create your first document to get started.
                          </TableCell>
                        </TableRow>
                      ) : (
                        documents.map((doc: any) => (
                          <TableRow key={doc.id}>
                            <TableCell className="font-mono text-sm">{doc.document_id || doc.id}</TableCell>
                            <TableCell className="font-medium">{doc.title}</TableCell>
                            <TableCell>
                              <Badge variant="outline">{doc.document_type}</Badge>
                            </TableCell>
                            <TableCell>{doc.current_version}</TableCell>
                            <TableCell>
                              <Badge className={getStatusColor(doc.status)}>{doc.status?.replace('_', ' ')}</Badge>
                            </TableCell>
                            <TableCell>{doc.document_owner}</TableCell>
                            <TableCell>
                              <div className="flex items-center gap-1">
                                <GitBranch className="h-4 w-4 text-gray-400" />
                                <span className="text-sm">{doc.version_count || 1}</span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center space-x-1">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleViewDocumentHistory(doc)}
                                  title="Version History"
                                >
                                  <GitBranch className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleViewDocumentWorkflow(doc)}
                                  title="Workflow Status"
                                >
                                  <Activity className="h-4 w-4" />
                                </Button>
                                {doc.file_name && (
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => {
                                      const link = document.createElement('a')
                                      link.href = `/api/governance/documents/download?documentId=${doc.id}&userId=current-user`
                                      link.download = doc.file_name
                                      link.click()
                                    }}
                                    title="Download"
                                  >
                                    <Download className="h-4 w-4" />
                                  </Button>
                                )}
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => {
                                    setEditingItem(doc)
                                    setCurrentModule("documents")
                                    setIsEditDialogOpen(true)
                                  }}
                                  title="Edit"
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleDelete("documents", doc.id.toString())}
                                  className="text-red-600 hover:text-red-700"
                                  title="Delete"
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
                </CardContent>
              </Card>
            </TabsContent>

            {/* Controls Repository Tab */}
            <TabsContent value="controls" className="space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center space-x-2">
                        <Shield className="h-5 w-5 text-cyan-500" />
                        <span>Controls Repository Management</span>
                      </CardTitle>
                      <CardDescription>
                        Manage and track security controls across different frameworks
                      </CardDescription>
                    </div>
                    <Button variant="outline" onClick={() => {
                      setCurrentModule("controls")
                      setIsCreateDialogOpen(true)
                    }}>
                      Add Control
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {/* Controls Filters */}
                  <div className="mb-6 p-4 rounded-lg">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                      {/* Search */}
                      <div>
                        <Label htmlFor="control-search" className="text-sm font-medium">Search</Label>
                        <Input
                          id="control-search"
                          placeholder="Search controls..."
                          value={controlFilters.search}
                          onChange={(e) => setControlFilters({ ...controlFilters, search: e.target.value })}
                          className="mt-1"
                        />
                      </div>

                      {/* Status Filter */}
                      <div>
                        <Label htmlFor="control-status" className="text-sm font-medium">Status</Label>
                        <Select value={controlFilters.status} onValueChange={(value) => setControlFilters({ ...controlFilters, status: value })}>
                          <SelectTrigger className="mt-1">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Statuses</SelectItem>
                            <SelectItem value="implemented">Implemented</SelectItem>
                            <SelectItem value="in-progress">In Progress</SelectItem>
                            <SelectItem value="not-implemented">Not Implemented</SelectItem>
                            <SelectItem value="partially-implemented">Partially Implemented</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Framework Filter */}
                      <div>
                        <Label htmlFor="control-framework" className="text-sm font-medium">Framework</Label>
                        <Select value={controlFilters.framework} onValueChange={(value) => setControlFilters({ ...controlFilters, framework: value })}>
                          <SelectTrigger className="mt-1">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Frameworks</SelectItem>
                            <SelectItem value="ISO 27001">ISO 27001</SelectItem>
                            <SelectItem value="NIST CSF">NIST CSF</SelectItem>
                            <SelectItem value="SOC 2">SOC 2</SelectItem>
                            <SelectItem value="PCI DSS">PCI DSS</SelectItem>
                            <SelectItem value="GDPR">GDPR</SelectItem>
                            <SelectItem value="COBIT">COBIT</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Category Filter */}
                      <div>
                        <Label htmlFor="control-category" className="text-sm font-medium">Category</Label>
                        <Select value={controlFilters.category} onValueChange={(value) => setControlFilters({ ...controlFilters, category: value })}>
                          <SelectTrigger className="mt-1">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Categories</SelectItem>
                            <SelectItem value="Access Control">Access Control</SelectItem>
                            <SelectItem value="Data Protection">Data Protection</SelectItem>
                            <SelectItem value="Network Security">Network Security</SelectItem>
                            <SelectItem value="Incident Response">Incident Response</SelectItem>
                            <SelectItem value="Risk Management">Risk Management</SelectItem>
                            <SelectItem value="Compliance">Compliance</SelectItem>
                            <SelectItem value="Monitoring">Monitoring</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    {/* Sort Options */}
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        <Label htmlFor="control-sort" className="text-sm font-medium">Sort by:</Label>
                        <Select value={controlSortBy} onValueChange={setControlSortBy}>
                          <SelectTrigger className="w-40">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="name">Name</SelectItem>
                            <SelectItem value="control_id">Control ID</SelectItem>
                            <SelectItem value="framework">Framework</SelectItem>
                            <SelectItem value="category">Category</SelectItem>
                            <SelectItem value="implementation_status">Status</SelectItem>
                            <SelectItem value="effectiveness_rating">Effectiveness</SelectItem>
                            <SelectItem value="last_assessment_date">Last Assessment</SelectItem>
                            <SelectItem value="created_at">Created Date</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setControlSortOrder(controlSortOrder === "asc" ? "desc" : "asc")}
                        className="flex items-center space-x-1"
                      >
                        {controlSortOrder === "asc" ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />}
                        <span>{controlSortOrder === "asc" ? "Ascending" : "Descending"}</span>
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {loading ? (
                      <div className="flex items-center justify-center h-32">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                      </div>
                    ) : filteredControls.length === 0 ? (
                      <div className="text-center py-8 text-gray-500">
                        {controls.length === 0 ? "No controls found. Create your first control to get started." : "No controls match your current filters."}
                      </div>
                    ) : (
                      filteredControls.map((control: any) => (
                        <div key={control.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center space-x-3">
                              <h3 className="font-semibold text-gray-900 dark:text-white">{control.name}</h3>
                              <Badge className={getStatusColor(control.implementation_status || control.status)}>
                                {control.implementation_status || control.status}
                              </Badge>
                              <Badge variant="outline">{control.framework}</Badge>
                            </div>
                            <div className="text-right">
                              <p className="text-sm text-gray-600 dark:text-gray-400">Effectiveness</p>
                              <p className="font-semibold text-green-600 dark:text-green-400">{control.effectiveness_rating || control.effectiveness}</p>
                            </div>
                          </div>
                          <div className="mb-3">
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{control.description}</p>
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <p className="text-sm text-gray-600 dark:text-gray-400">Control ID</p>
                                <p className="font-semibold text-blue-600 dark:text-blue-400">{control.control_id || control.controlId}</p>
                              </div>
                              <div>
                                <p className="text-sm text-gray-600 dark:text-gray-400">Category</p>
                                <p className="font-semibold text-purple-600 dark:text-purple-400">{control.category}</p>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                              <span>Owner: {control.owner}</span>
                              <span>Last Assessment: {control.last_assessment_date || control.lastAssessment}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  setEditingItem(control)
                                  setCurrentModule("controls")
                                  setIsEditDialogOpen(true)
                                }}
                              >
                                <Edit className="h-4 w-4 mr-1" />
                                Edit
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDelete("controls", control.id.toString())}
                                className="text-red-600 hover:text-red-700"
                              >
                                <Trash2 className="h-4 w-4 mr-1" />
                                Delete
                              </Button>
                              <Button variant="ghost" size="sm">
                                <BarChart3 className="h-4 w-4 mr-1" />
                                Assess
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      {/* KPI Create/Edit Dialog */}
      <Dialog open={isCreateDialogOpen && currentModule === "kpis"} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <Plus className="h-5 w-5" />
              <span className="text-cyan-300">Add New KPI</span>
            </DialogTitle>
            <DialogDescription>
              Create a new Key Performance Indicator for security governance
            </DialogDescription>
          </DialogHeader>

          <KPICreateForm
            onSubmit={(data) => handleCreate("kpis", data)}
            onCancel={() => setIsCreateDialogOpen(false)}
            loading={loading}
          />
        </DialogContent>
      </Dialog>

      {/* KPI Edit Dialog */}
      <Dialog open={isEditDialogOpen && currentModule === "kpis"} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <Edit className="h-5 w-5" />
              <span>Edit KPI</span>
            </DialogTitle>
            <DialogDescription>
              Update the Key Performance Indicator details
            </DialogDescription>
          </DialogHeader>

          <KPIEditForm
            kpi={editingItem}
            onSubmit={(data) => handleUpdate("kpis", editingItem?.id?.toString(), data)}
            onCancel={() => setIsEditDialogOpen(false)}
            loading={loading}
          />
        </DialogContent>
      </Dialog>

      {/* Budget Create/Edit Dialog */}
      <Dialog open={isCreateDialogOpen && currentModule === "budget"} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <Plus className="h-5 w-5" />
              <span>Add New Budget Item</span>
            </DialogTitle>
            <DialogDescription>
              Create a new budget item for security governance
            </DialogDescription>
          </DialogHeader>

          <BudgetCreateForm
            onSubmit={(data) => handleCreate("budget", data)}
            onCancel={() => setIsCreateDialogOpen(false)}
            loading={loading}
          />
        </DialogContent>
      </Dialog>

      {/* Budget Edit Dialog */}
      <Dialog open={isEditDialogOpen && currentModule === "budget"} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <Edit className="h-5 w-5" />
              <span>Edit Budget Item</span>
            </DialogTitle>
            <DialogDescription>
              Update the budget item details
            </DialogDescription>
          </DialogHeader>

          <BudgetEditForm
            budget={editingItem}
            onSubmit={(data) => handleUpdate("budget", editingItem?.id?.toString(), data)}
            onCancel={() => setIsEditDialogOpen(false)}
            loading={loading}
          />
        </DialogContent>
      </Dialog>

      {/* Controls Create Dialog */}
      <Dialog open={isCreateDialogOpen && currentModule === "controls"} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <Plus className="h-5 w-5" />
              <span>Add New Control</span>
            </DialogTitle>
            <DialogDescription>
              Create a new control in the repository
            </DialogDescription>
          </DialogHeader>

          <ControlCreateForm
            onSubmit={(data) => handleCreate("controls", data)}
            onCancel={() => setIsCreateDialogOpen(false)}
            loading={loading} />
        </DialogContent>
      </Dialog>

      {/* Controls Edit Dialog */}
      <Dialog open={isEditDialogOpen && currentModule === "controls"} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <Edit className="h-5 w-5" />
              <span>Edit Control</span>
            </DialogTitle>
            <DialogDescription>
              Update the control details
            </DialogDescription>
          </DialogHeader>

          <ControlEditForm
            control={editingItem}
            onSubmit={(data) => handleUpdate("controls", editingItem?.id?.toString(), data)}
            onCancel={() => setIsEditDialogOpen(false)}
            loading={loading}
          />
        </DialogContent>
      </Dialog>

    </div>
  )
}

// KPI Create Form Component
function KPICreateForm({ onSubmit, onCancel, loading }: {
  onSubmit: (data: any) => void
  onCancel: () => void
  loading: boolean
}) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    target_value: "",
    current_value: "",
    unit: "",
    category: "",
    framework: "",
    status: "active",
    trend: "stable",
    measurement_frequency: "monthly",
    owner: "",
    department: "",
    calculation_method: "",
    data_source: "",
    next_review_date: ""
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  const categories = [
    "Response",
    "Remediation",
    "Training",
    "Compliance",
    "Access Control",
    "Monitoring",
    "Risk Management",
    "Incident Management",
    "Audit",
    "Other"
  ]

  const frameworks = [
    "ISO 27001",
    "NIST CSF",
    "COBIT",
    "PCI DSS",
    "SOX",
    "GDPR",
    "HIPAA",
    "Other"
  ]

  const units = [
    "percentage",
    "hours",
    "days",
    "count",
    "dollars",
    "score",
    "ratio",
    "other"
  ]

  const trends = [
    "improving",
    "stable",
    "declining",
    "unknown"
  ]

  const frequencies = [
    "daily",
    "weekly",
    "monthly",
    "quarterly",
    "annually"
  ]

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">KPI Name *</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="e.g., Security Incident Response Time"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="category">Category *</Label>
          <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Describe what this KPI measures"
          rows={3}
        />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="target_value">Target Value *</Label>
          <Input
            id="target_value"
            value={formData.target_value}
            onChange={(e) => setFormData({ ...formData, target_value: e.target.value })}
            placeholder="e.g., 4"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="current_value">Current Value *</Label>
          <Input
            id="current_value"
            value={formData.current_value}
            onChange={(e) => setFormData({ ...formData, current_value: e.target.value })}
            placeholder="e.g., 3.2"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="unit">Unit</Label>
          <Select value={formData.unit} onValueChange={(value) => setFormData({ ...formData, unit: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Select unit" />
            </SelectTrigger>
            <SelectContent>
              {units.map((unit) => (
                <SelectItem key={unit} value={unit}>
                  {unit}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="framework">Framework</Label>
          <Select value={formData.framework} onValueChange={(value) => setFormData({ ...formData, framework: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Select framework" />
            </SelectTrigger>
            <SelectContent>
              {frameworks.map((framework) => (
                <SelectItem key={framework} value={framework}>
                  {framework}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="measurement_frequency">Measurement Frequency</Label>
          <Select value={formData.measurement_frequency} onValueChange={(value) => setFormData({ ...formData, measurement_frequency: value })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {frequencies.map((freq) => (
                <SelectItem key={freq} value={freq}>
                  {freq}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="owner">Owner *</Label>
          <Input
            id="owner"
            value={formData.owner}
            onChange={(e) => setFormData({ ...formData, owner: e.target.value })}
            placeholder="e.g., CISO"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="department">Department</Label>
          <Input
            id="department"
            value={formData.department}
            onChange={(e) => setFormData({ ...formData, department: e.target.value })}
            placeholder="e.g., Security Operations"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
              <SelectItem value="archived">Archived</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="trend">Trend</Label>
          <Select value={formData.trend} onValueChange={(value) => setFormData({ ...formData, trend: value })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {trends.map((trend) => (
                <SelectItem key={trend} value={trend}>
                  {trend}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="calculation_method">Calculation Method</Label>
        <Textarea
          id="calculation_method"
          value={formData.calculation_method}
          onChange={(e) => setFormData({ ...formData, calculation_method: e.target.value })}
          placeholder="Describe how this KPI is calculated"
          rows={2}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="data_source">Data Source</Label>
          <Input
            id="data_source"
            value={formData.data_source}
            onChange={(e) => setFormData({ ...formData, data_source: e.target.value })}
            placeholder="e.g., SIEM System"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="next_review_date">Next Review Date</Label>
          <Input
            id="next_review_date"
            type="date"
            value={formData.next_review_date}
            onChange={(e) => setFormData({ ...formData, next_review_date: e.target.value })}
          />
        </div>
      </div>

      <DialogFooter>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
              Creating KPI...
            </>
          ) : (
            <>
              <Plus className="h-4 w-4 mr-2" />
              Create KPI
            </>
          )}
        </Button>
      </DialogFooter>
    </form>
  )
}

// KPI Edit Form Component
function KPIEditForm({ kpi, onSubmit, onCancel, loading }: {
  kpi: any
  onSubmit: (data: any) => void
  onCancel: () => void
  loading: boolean
}) {
  const [formData, setFormData] = useState({
    name: kpi?.name || "",
    description: kpi?.description || "",
    target_value: kpi?.target_value || "",
    current_value: kpi?.current_value || "",
    unit: kpi?.unit || "",
    category: kpi?.category || "",
    framework: kpi?.framework || "",
    status: kpi?.status || "active",
    trend: kpi?.trend || "stable",
    measurement_frequency: kpi?.measurement_frequency || "monthly",
    owner: kpi?.owner || "",
    department: kpi?.department || "",
    calculation_method: kpi?.calculation_method || "",
    data_source: kpi?.data_source || "",
    next_review_date: kpi?.next_review_date ? new Date(kpi.next_review_date).toISOString().split('T')[0] : ""
  })

  // Update form data when kpi changes
  useEffect(() => {
    if (kpi) {
      setFormData({
        name: kpi.name || "",
        description: kpi.description || "",
        target_value: kpi.target_value || "",
        current_value: kpi.current_value || "",
        unit: kpi.unit || "",
        category: kpi.category || "",
        framework: kpi.framework || "",
        status: kpi.status || "active",
        trend: kpi.trend || "stable",
        measurement_frequency: kpi.measurement_frequency || "monthly",
        owner: kpi.owner || "",
        department: kpi.department || "",
        calculation_method: kpi.calculation_method || "",
        data_source: kpi.data_source || "",
        next_review_date: kpi.next_review_date ? new Date(kpi.next_review_date).toISOString().split('T')[0] : ""
      })
    }
  }, [kpi])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  const categories = [
    "Response",
    "Remediation",
    "Training",
    "Compliance",
    "Access Control",
    "Monitoring",
    "Risk Management",
    "Incident Management",
    "Audit",
    "Other"
  ]

  const frameworks = [
    "ISO 27001",
    "NIST CSF",
    "COBIT",
    "PCI DSS",
    "SOX",
    "GDPR",
    "HIPAA",
    "Other"
  ]

  const units = [
    "percentage",
    "hours",
    "days",
    "count",
    "dollars",
    "score",
    "ratio",
    "other"
  ]

  const trends = [
    "improving",
    "stable",
    "declining",
    "unknown"
  ]

  // Controls Create Form Component
  function ControlCreateForm({ onSubmit, onCancel, loading }: {
    onSubmit: (data: any) => void
    onCancel: () => void
    loading: boolean
  }) {
    const [formData, setFormData] = useState({
      name: "",
      description: "",
      control_id: "",
      framework: "ISO 27001",
      category: "",
      subcategory: "",
      control_type: "preventive",
      implementation_status: "not_implemented",
      effectiveness_rating: "medium",
      maturity_level: "initial",
      owner: "",
      department: "",
      responsible_party: "",
      implementation_date: "",
      assessment_frequency: "annual",
      evidence_location: "",
      notes: ""
    })

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault()
      onSubmit(formData)
    }

    const frameworks = ["ISO 27001", "NIST CSF", "COBIT", "PCI DSS", "SOX", "GDPR", "HIPAA", "Other"]
    const types = ["preventive", "detective", "corrective", "directive", "compensating"]
    const statuses = ["not_implemented", "in_progress", "implemented", "deprecated"]
    const effectiveness = ["low", "medium", "high"]
    const maturities = ["initial", "managed", "defined", "quantitatively_managed", "optimizing"]

    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Control Name</Label>
            <Input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
          </div>
          <div className="space-y-2">
            <Label>Control ID</Label>
            <Input value={formData.control_id} onChange={(e) => setFormData({ ...formData, control_id: e.target.value })} required />
          </div>
        </div>
        <div className="space-y-2">
          <Label>Description</Label>
          <Textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} rows={3} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label>Framework</Label>
            <Select value={formData.framework} onValueChange={(v) => setFormData({ ...formData, framework: v })}>
              <SelectTrigger><SelectValue placeholder="Select framework" /></SelectTrigger>
              <SelectContent>
                {frameworks.map(f => (<SelectItem key={f} value={f}>{f}</SelectItem>))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Category</Label>
            <Input value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} />
          </div>
          <div className="space-y-2">
            <Label>Subcategory</Label>
            <Input value={formData.subcategory} onChange={(e) => setFormData({ ...formData, subcategory: e.target.value })} />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label>Control Type</Label>
            <Select value={formData.control_type} onValueChange={(v) => setFormData({ ...formData, control_type: v })}>
              <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
              <SelectContent>
                {types.map(t => (<SelectItem key={t} value={t}>{t}</SelectItem>))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Status</Label>
            <Select value={formData.implementation_status} onValueChange={(v) => setFormData({ ...formData, implementation_status: v })}>
              <SelectTrigger><SelectValue placeholder="Select status" /></SelectTrigger>
              <SelectContent>
                {statuses.map(s => (<SelectItem key={s} value={s}>{s}</SelectItem>))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Effectiveness</Label>
            <Select value={formData.effectiveness_rating} onValueChange={(v) => setFormData({ ...formData, effectiveness_rating: v })}>
              <SelectTrigger><SelectValue placeholder="Select effectiveness" /></SelectTrigger>
              <SelectContent>
                {effectiveness.map(s => (<SelectItem key={s} value={s}>{s}</SelectItem>))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label>Maturity</Label>
            <Select value={formData.maturity_level} onValueChange={(v) => setFormData({ ...formData, maturity_level: v })}>
              <SelectTrigger><SelectValue placeholder="Select maturity" /></SelectTrigger>
              <SelectContent>
                {maturities.map(s => (<SelectItem key={s} value={s}>{s}</SelectItem>))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Owner</Label>
            <Input value={formData.owner} onChange={(e) => setFormData({ ...formData, owner: e.target.value })} required />
          </div>
          <div className="space-y-2">
            <Label>Department</Label>
            <Input value={formData.department} onChange={(e) => setFormData({ ...formData, department: e.target.value })} />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Responsible Party</Label>
            <Input value={formData.responsible_party} onChange={(e) => setFormData({ ...formData, responsible_party: e.target.value })} />
          </div>
          <div className="space-y-2">
            <Label>Implementation Date</Label>
            <Input type="date" value={formData.implementation_date} onChange={(e) => setFormData({ ...formData, implementation_date: e.target.value })} />
          </div>
        </div>
        <div className="flex justify-end gap-3 pt-2">
          <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
          <Button type="submit" disabled={loading}>
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                Creating...
              </>
            ) : (
              <>
                <Plus className="h-4 w-4 mr-2" />
                Create Control
              </>
            )}
          </Button>
        </div>
      </form>
    )
  }

  // Controls Edit Form Component
  function ControlEditForm({ control, onSubmit, onCancel, loading }: {
    control: any
    onSubmit: (data: any) => void
    onCancel: () => void
    loading: boolean
  }) {
    const [formData, setFormData] = useState({
      name: control?.name || "",
      description: control?.description || "",
      control_id: control?.control_id || control?.controlId || "",
      framework: control?.framework || "ISO 27001",
      category: control?.category || "",
      subcategory: control?.subcategory || "",
      control_type: control?.control_type || "preventive",
      implementation_status: control?.implementation_status || control?.status || "not_implemented",
      effectiveness_rating: control?.effectiveness_rating || control?.effectiveness || "medium",
      maturity_level: control?.maturity_level || "initial",
      owner: control?.owner || "",
      department: control?.department || "",
      responsible_party: control?.responsible_party || "",
      implementation_date: control?.implementation_date ? String(control.implementation_date).split('T')[0] : "",
      assessment_frequency: control?.assessment_frequency || "annual",
      evidence_location: control?.evidence_location || "",
      notes: control?.notes || ""
    })

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault()
      onSubmit(formData)
    }

    const frameworks = ["ISO 27001", "NIST CSF", "COBIT", "PCI DSS", "SOX", "GDPR", "HIPAA", "Other"]
    const types = ["preventive", "detective", "corrective", "directive", "compensating"]
    const statuses = ["not_implemented", "in_progress", "implemented", "deprecated"]
    const effectiveness = ["low", "medium", "high"]
    const maturities = ["initial", "managed", "defined", "quantitatively_managed", "optimizing"]

    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Control Name</Label>
            <Input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
          </div>
          <div className="space-y-2">
            <Label>Control ID</Label>
            <Input value={formData.control_id} onChange={(e) => setFormData({ ...formData, control_id: e.target.value })} required />
          </div>
        </div>
        <div className="space-y-2">
          <Label>Description</Label>
          <Textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} rows={3} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label>Framework</Label>
            <Select value={formData.framework} onValueChange={(v) => setFormData({ ...formData, framework: v })}>
              <SelectTrigger><SelectValue placeholder="Select framework" /></SelectTrigger>
              <SelectContent>
                {frameworks.map(f => (<SelectItem key={f} value={f}>{f}</SelectItem>))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Category</Label>
            <Input value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} />
          </div>
          <div className="space-y-2">
            <Label>Subcategory</Label>
            <Input value={formData.subcategory} onChange={(e) => setFormData({ ...formData, subcategory: e.target.value })} />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label>Control Type</Label>
            <Select value={formData.control_type} onValueChange={(v) => setFormData({ ...formData, control_type: v })}>
              <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
              <SelectContent>
                {types.map(t => (<SelectItem key={t} value={t}>{t}</SelectItem>))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Status</Label>
            <Select value={formData.implementation_status} onValueChange={(v) => setFormData({ ...formData, implementation_status: v })}>
              <SelectTrigger><SelectValue placeholder="Select status" /></SelectTrigger>
              <SelectContent>
                {statuses.map(s => (<SelectItem key={s} value={s}>{s}</SelectItem>))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Effectiveness</Label>
            <Select value={formData.effectiveness_rating} onValueChange={(v) => setFormData({ ...formData, effectiveness_rating: v })}>
              <SelectTrigger><SelectValue placeholder="Select effectiveness" /></SelectTrigger>
              <SelectContent>
                {effectiveness.map(s => (<SelectItem key={s} value={s}>{s}</SelectItem>))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label>Maturity</Label>
            <Select value={formData.maturity_level} onValueChange={(v) => setFormData({ ...formData, maturity_level: v })}>
              <SelectTrigger><SelectValue placeholder="Select maturity" /></SelectTrigger>
              <SelectContent>
                {maturities.map(s => (<SelectItem key={s} value={s}>{s}</SelectItem>))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Owner</Label>
            <Input value={formData.owner} onChange={(e) => setFormData({ ...formData, owner: e.target.value })} required />
          </div>
          <div className="space-y-2">
            <Label>Department</Label>
            <Input value={formData.department} onChange={(e) => setFormData({ ...formData, department: e.target.value })} />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Responsible Party</Label>
            <Input value={formData.responsible_party} onChange={(e) => setFormData({ ...formData, responsible_party: e.target.value })} />
          </div>
          <div className="space-y-2">
            <Label>Implementation Date</Label>
            <Input type="date" value={formData.implementation_date} onChange={(e) => setFormData({ ...formData, implementation_date: e.target.value })} />
          </div>
        </div>
        <div className="flex justify-end gap-3 pt-2">
          <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
          <Button type="submit" disabled={loading}>
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                Updating...
              </>
            ) : (
              <>
                <Edit className="h-4 w-4 mr-2" />
                Update Control
              </>
            )}
          </Button>
        </div>
      </form>
    )
  }

  const frequencies = [
    "daily",
    "weekly",
    "monthly",
    "quarterly",
    "annually"
  ]

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="edit-name">KPI Name *</Label>
          <Input
            id="edit-name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="edit-category">Category *</Label>
          <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="edit-description">Description</Label>
        <Textarea
          id="edit-description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          rows={3}
        />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="edit-target_value">Target Value *</Label>
          <Input
            id="edit-target_value"
            value={formData.target_value}
            onChange={(e) => setFormData({ ...formData, target_value: e.target.value })}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="edit-current_value">Current Value *</Label>
          <Input
            id="edit-current_value"
            value={formData.current_value}
            onChange={(e) => setFormData({ ...formData, current_value: e.target.value })}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="edit-unit">Unit</Label>
          <Select value={formData.unit} onValueChange={(value) => setFormData({ ...formData, unit: value })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {units.map((unit) => (
                <SelectItem key={unit} value={unit}>
                  {unit}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="edit-framework">Framework</Label>
          <Select value={formData.framework} onValueChange={(value) => setFormData({ ...formData, framework: value })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {frameworks.map((framework) => (
                <SelectItem key={framework} value={framework}>
                  {framework}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="edit-measurement_frequency">Measurement Frequency</Label>
          <Select value={formData.measurement_frequency} onValueChange={(value) => setFormData({ ...formData, measurement_frequency: value })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {frequencies.map((freq) => (
                <SelectItem key={freq} value={freq}>
                  {freq}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="edit-owner">Owner *</Label>
          <Input
            id="edit-owner"
            value={formData.owner}
            onChange={(e) => setFormData({ ...formData, owner: e.target.value })}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="edit-department">Department</Label>
          <Input
            id="edit-department"
            value={formData.department}
            onChange={(e) => setFormData({ ...formData, department: e.target.value })}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="edit-status">Status</Label>
          <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
              <SelectItem value="archived">Archived</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="edit-trend">Trend</Label>
          <Select value={formData.trend} onValueChange={(value) => setFormData({ ...formData, trend: value })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {trends.map((trend) => (
                <SelectItem key={trend} value={trend}>
                  {trend}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="edit-calculation_method">Calculation Method</Label>
        <Textarea
          id="edit-calculation_method"
          value={formData.calculation_method}
          onChange={(e) => setFormData({ ...formData, calculation_method: e.target.value })}
          rows={2}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="edit-data_source">Data Source</Label>
          <Input
            id="edit-data_source"
            value={formData.data_source}
            onChange={(e) => setFormData({ ...formData, data_source: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="edit-next_review_date">Next Review Date</Label>
          <Input
            id="edit-next_review_date"
            type="date"
            value={formData.next_review_date}
            onChange={(e) => setFormData({ ...formData, next_review_date: e.target.value })}
          />
        </div>
      </div>

      <DialogFooter>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
              Updating KPI...
            </>
          ) : (
            <>
              <Edit className="h-4 w-4 mr-2" />
              Update KPI
            </>
          )}
        </Button>
      </DialogFooter>
    </form>
  )
}

// Budget Create Form Component
function BudgetCreateForm({ onSubmit, onCancel, loading }: {
  onSubmit: (data: any) => void
  onCancel: () => void
  loading: boolean
}) {
  const [formData, setFormData] = useState({
    category: "",
    subcategory: "",
    description: "",
    fiscal_year: new Date().getFullYear().toString(),
    allocated_amount: "",
    spent_amount: "0",
    committed_amount: "0",
    status: "on-track",
    budget_owner: "",
    department: "",
    cost_center: "",
    vendor: "",
    contract_reference: "",
    approval_date: "",
    approval_authority: "",
    notes: ""
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const submitData = {
      ...formData,
      allocated_amount: parseFloat(formData.allocated_amount),
      spent_amount: parseFloat(formData.spent_amount),
      committed_amount: parseFloat(formData.committed_amount)
    }
    onSubmit(submitData)
  }

  const budgetCategories = [
    "Security Tools & Software",
    "Security Training & Certification",
    "Incident Response & Recovery",
    "Compliance & Audit",
    "Security Assessments",
    "Infrastructure Security",
    "Data Protection",
    "Identity & Access Management",
    "Physical Security",
    "Other"
  ]

  const budgetStatuses = [
    "on-track",
    "warning",
    "critical",
    "over-budget"
  ]

  const currentYear = new Date().getFullYear()
  const fiscalYears = Array.from({ length: 5 }, (_, i) => (currentYear + i).toString())

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="budget-category">Category *</Label>
          <Select
            value={formData.category}
            onValueChange={(value) => setFormData({ ...formData, category: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {budgetCategories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="budget-subcategory">Subcategory</Label>
          <Input
            id="budget-subcategory"
            value={formData.subcategory}
            onChange={(e) => setFormData({ ...formData, subcategory: e.target.value })}
            placeholder="e.g., SIEM Platform"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="budget-description">Description</Label>
        <Textarea
          id="budget-description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Describe the budget item purpose and scope"
          rows={3}
        />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="budget-fiscal-year">Fiscal Year *</Label>
          <Select
            value={formData.fiscal_year}
            onValueChange={(value) => setFormData({ ...formData, fiscal_year: value })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {fiscalYears.map((year) => (
                <SelectItem key={year} value={year}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="budget-allocated">Allocated Amount *</Label>
          <Input
            id="budget-allocated"
            type="number"
            step="0.01"
            value={formData.allocated_amount}
            onChange={(e) => setFormData({ ...formData, allocated_amount: e.target.value })}
            placeholder="0.00"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="budget-status">Status</Label>
          <Select
            value={formData.status}
            onValueChange={(value) => setFormData({ ...formData, status: value })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {budgetStatuses.map((status) => (
                <SelectItem key={status} value={status}>
                  {status.replace('-', ' ')}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="budget-spent">Spent Amount</Label>
          <Input
            id="budget-spent"
            type="number"
            step="0.01"
            value={formData.spent_amount}
            onChange={(e) => setFormData({ ...formData, spent_amount: e.target.value })}
            placeholder="0.00"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="budget-committed">Committed Amount</Label>
          <Input
            id="budget-committed"
            type="number"
            step="0.01"
            value={formData.committed_amount}
            onChange={(e) => setFormData({ ...formData, committed_amount: e.target.value })}
            placeholder="0.00"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="budget-owner">Budget Owner *</Label>
          <Input
            id="budget-owner"
            value={formData.budget_owner}
            onChange={(e) => setFormData({ ...formData, budget_owner: e.target.value })}
            placeholder="e.g., CISO"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="budget-department">Department</Label>
          <Input
            id="budget-department"
            value={formData.department}
            onChange={(e) => setFormData({ ...formData, department: e.target.value })}
            placeholder="e.g., Security Operations"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="budget-cost-center">Cost Center</Label>
          <Input
            id="budget-cost-center"
            value={formData.cost_center}
            onChange={(e) => setFormData({ ...formData, cost_center: e.target.value })}
            placeholder="e.g., SEC-001"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="budget-vendor">Vendor</Label>
          <Input
            id="budget-vendor"
            value={formData.vendor}
            onChange={(e) => setFormData({ ...formData, vendor: e.target.value })}
            placeholder="e.g., Splunk Inc."
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="budget-contract-ref">Contract Reference</Label>
          <Input
            id="budget-contract-ref"
            value={formData.contract_reference}
            onChange={(e) => setFormData({ ...formData, contract_reference: e.target.value })}
            placeholder="Contract or PO number"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="budget-approval-authority">Approval Authority</Label>
          <Input
            id="budget-approval-authority"
            value={formData.approval_authority}
            onChange={(e) => setFormData({ ...formData, approval_authority: e.target.value })}
            placeholder="e.g., CFO"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="budget-approval-date">Approval Date</Label>
        <Input
          id="budget-approval-date"
          type="date"
          value={formData.approval_date}
          onChange={(e) => setFormData({ ...formData, approval_date: e.target.value })}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="budget-notes">Notes</Label>
        <Textarea
          id="budget-notes"
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          placeholder="Additional notes and comments"
          rows={2}
        />
      </div>

      <DialogFooter>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
              Creating Budget...
            </>
          ) : (
            <>
              <Plus className="h-4 w-4 mr-2" />
              Create Budget Item
            </>
          )}
        </Button>
      </DialogFooter>
    </form>
  )
}

// Budget Edit Form Component
function BudgetEditForm({ budget, onSubmit, onCancel, loading }: {
  budget: any
  onSubmit: (data: any) => void
  onCancel: () => void
  loading: boolean
}) {
  const [formData, setFormData] = useState({
    category: budget?.category || "",
    subcategory: budget?.subcategory || "",
    description: budget?.description || "",
    fiscal_year: budget?.fiscal_year || new Date().getFullYear().toString(),
    allocated_amount: budget?.allocated_amount?.toString() || "",
    spent_amount: budget?.spent_amount?.toString() || "0",
    committed_amount: budget?.committed_amount?.toString() || "0",
    status: budget?.status || "on-track",
    budget_owner: budget?.budget_owner || "",
    department: budget?.department || "",
    cost_center: budget?.cost_center || "",
    vendor: budget?.vendor || "",
    contract_reference: budget?.contract_reference || "",
    approval_date: budget?.approval_date ? new Date(budget.approval_date).toISOString().split('T')[0] : "",
    approval_authority: budget?.approval_authority || "",
    notes: budget?.notes || ""
  })

  // Update form data when budget changes
  useEffect(() => {
    if (budget) {
      setFormData({
        category: budget.category || "",
        subcategory: budget.subcategory || "",
        description: budget.description || "",
        fiscal_year: budget.fiscal_year || new Date().getFullYear().toString(),
        allocated_amount: budget.allocated_amount?.toString() || "",
        spent_amount: budget.spent_amount?.toString() || "0",
        committed_amount: budget.committed_amount?.toString() || "0",
        status: budget.status || "on-track",
        budget_owner: budget.budget_owner || "",
        department: budget.department || "",
        cost_center: budget.cost_center || "",
        vendor: budget.vendor || "",
        contract_reference: budget.contract_reference || "",
        approval_date: budget.approval_date ? new Date(budget.approval_date).toISOString().split('T')[0] : "",
        approval_authority: budget.approval_authority || "",
        notes: budget.notes || ""
      })
    }
  }, [budget])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const submitData = {
      ...formData,
      allocated_amount: parseFloat(formData.allocated_amount),
      spent_amount: parseFloat(formData.spent_amount),
      committed_amount: parseFloat(formData.committed_amount)
    }
    onSubmit(submitData)
  }

  const budgetCategories = [
    "Security Tools & Software",
    "Security Training & Certification",
    "Incident Response & Recovery",
    "Compliance & Audit",
    "Security Assessments",
    "Infrastructure Security",
    "Data Protection",
    "Identity & Access Management",
    "Physical Security",
    "Other"
  ]

  const budgetStatuses = [
    "on-track",
    "warning",
    "critical",
    "over-budget"
  ]

  const currentYear = new Date().getFullYear()
  const fiscalYears = Array.from({ length: 5 }, (_, i) => (currentYear + i).toString())

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="edit-budget-category">Category *</Label>
          <Select
            value={formData.category}
            onValueChange={(value) => setFormData({ ...formData, category: value })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {budgetCategories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="edit-budget-subcategory">Subcategory</Label>
          <Input
            id="edit-budget-subcategory"
            value={formData.subcategory}
            onChange={(e) => setFormData({ ...formData, subcategory: e.target.value })}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="edit-budget-description">Description</Label>
        <Textarea
          id="edit-budget-description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          rows={3}
        />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="edit-budget-fiscal-year">Fiscal Year *</Label>
          <Select
            value={formData.fiscal_year}
            onValueChange={(value) => setFormData({ ...formData, fiscal_year: value })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {fiscalYears.map((year) => (
                <SelectItem key={year} value={year}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="edit-budget-allocated">Allocated Amount *</Label>
          <Input
            id="edit-budget-allocated"
            type="number"
            step="0.01"
            value={formData.allocated_amount}
            onChange={(e) => setFormData({ ...formData, allocated_amount: e.target.value })}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="edit-budget-status">Status</Label>
          <Select
            value={formData.status}
            onValueChange={(value) => setFormData({ ...formData, status: value })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {budgetStatuses.map((status) => (
                <SelectItem key={status} value={status}>
                  {status.replace('-', ' ')}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="edit-budget-spent">Spent Amount</Label>
          <Input
            id="edit-budget-spent"
            type="number"
            step="0.01"
            value={formData.spent_amount}
            onChange={(e) => setFormData({ ...formData, spent_amount: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="edit-budget-committed">Committed Amount</Label>
          <Input
            id="edit-budget-committed"
            type="number"
            step="0.01"
            value={formData.committed_amount}
            onChange={(e) => setFormData({ ...formData, committed_amount: e.target.value })}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="edit-budget-owner">Budget Owner *</Label>
          <Input
            id="edit-budget-owner"
            value={formData.budget_owner}
            onChange={(e) => setFormData({ ...formData, budget_owner: e.target.value })}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="edit-budget-department">Department</Label>
          <Input
            id="edit-budget-department"
            value={formData.department}
            onChange={(e) => setFormData({ ...formData, department: e.target.value })}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="edit-budget-cost-center">Cost Center</Label>
          <Input
            id="edit-budget-cost-center"
            value={formData.cost_center}
            onChange={(e) => setFormData({ ...formData, cost_center: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="edit-budget-vendor">Vendor</Label>
          <Input
            id="edit-budget-vendor"
            value={formData.vendor}
            onChange={(e) => setFormData({ ...formData, vendor: e.target.value })}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="edit-budget-contract-ref">Contract Reference</Label>
          <Input
            id="edit-budget-contract-ref"
            value={formData.contract_reference}
            onChange={(e) => setFormData({ ...formData, contract_reference: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="edit-budget-approval-authority">Approval Authority</Label>
          <Input
            id="edit-budget-approval-authority"
            value={formData.approval_authority}
            onChange={(e) => setFormData({ ...formData, approval_authority: e.target.value })}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="edit-budget-approval-date">Approval Date</Label>
        <Input
          id="edit-budget-approval-date"
          type="date"
          value={formData.approval_date}
          onChange={(e) => setFormData({ ...formData, approval_date: e.target.value })}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="edit-budget-notes">Notes</Label>
        <Textarea
          id="edit-budget-notes"
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          rows={2}
        />
      </div>

      <DialogFooter>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
              Updating Budget...
            </>
          ) : (
            <>
              <Edit className="h-4 w-4 mr-2" />
              Update Budget Item
            </>
          )}
        </Button>
      </DialogFooter>
    </form>
  )
}

