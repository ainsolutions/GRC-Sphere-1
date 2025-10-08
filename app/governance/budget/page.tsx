"use client"

import React, { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useToast } from "@/hooks/use-toast"
import {
  DollarSign,
  Plus,
  Edit,
  Trash2,
  Eye,
  TrendingUp,
  TrendingDown,
  BarChart3,
  PieChart,
  Calendar,
  Users,
  AlertTriangle,
  CheckCircle,
  Clock,
  ArrowUp,
  ArrowDown,
  Search,
  Filter,
  RefreshCw,
  Download,
  Upload,
  Loader2,
} from "lucide-react"

// Interface for governance budget data from API
interface GovernanceBudget {
  id: number
  category: string
  subcategory?: string
  description: string
  fiscal_year: string
  allocated_amount: number | string
  spent_amount: number | string
  committed_amount: number | string
  remaining_amount: number | string
  utilization_percentage: number | string
  status: string
  budget_owner: string
  department?: string
  cost_center?: string
  vendor?: string
  contract_reference?: string
  approval_date?: string
  approval_authority?: string
  notes?: string
  created_at: string
  updated_at: string
}

const categories = ["All", "Security Tools & Software", "Compliance Training", "Risk Assessment", "Governance Framework", "Security Infrastructure", "Audit & Assessment"]
const statuses = ["All", "on-track", "under-budget", "near-limit", "over-budget"]
const fiscalYears = ["All", "2024", "2025", "2026"]

export default function GovernanceBudget() {
  const [budgets, setBudgets] = useState<GovernanceBudget[]>([])
  const [filteredBudgets, setFilteredBudgets] = useState<GovernanceBudget[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [selectedStatus, setSelectedStatus] = useState("All")
  const [selectedFiscalYear, setSelectedFiscalYear] = useState("All")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editingBudget, setEditingBudget] = useState<GovernanceBudget | null>(null)
  const { toast } = useToast()

  // Fetch budgets from API
  const fetchBudgets = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      if (selectedCategory !== "All") params.append("category", selectedCategory)
      if (selectedStatus !== "All") params.append("status", selectedStatus)
      if (selectedFiscalYear !== "All") params.append("fiscal_year", selectedFiscalYear)

      const response = await fetch(`/api/governance/budget?${params.toString()}`)
      const result = await response.json()

      if (result.success) {
        setBudgets(result.data || [])
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to fetch budget data",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error fetching budget data:", error)
      toast({
        title: "Error",
        description: "Failed to fetch budget data",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  // Fetch budgets on component mount and when filters change
  useEffect(() => {
    fetchBudgets()
  }, [selectedCategory, selectedStatus, selectedFiscalYear])

  // Filter budgets based on search (other filters are handled by API)
  useEffect(() => {
    let filtered = budgets.filter(budget => {
      const matchesSearch = budget.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           budget.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           (budget.subcategory && budget.subcategory.toLowerCase().includes(searchTerm.toLowerCase()))

      return matchesSearch
    })
    setFilteredBudgets(filtered)
  }, [budgets, searchTerm])

  const handleCreateBudget = async (budgetData: any) => {
    try {
      const response = await fetch('/api/governance/budget', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(budgetData),
      })

      const result = await response.json()

      if (result.success) {
        await fetchBudgets() // Refresh the budgets list
    setIsCreateDialogOpen(false)
    toast({
      title: "Budget Created",
      description: "New budget has been successfully created.",
    })
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to create budget",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error creating budget:", error)
      toast({
        title: "Error",
        description: "Failed to create budget",
        variant: "destructive",
      })
    }
  }

  const handleEditBudget = async (budgetData: any) => {
    if (!editingBudget || !editingBudget.id) return

    try {
      const response = await fetch(`/api/governance/budget/${editingBudget.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(budgetData),
      })

      const result = await response.json()

      if (result.success) {
        await fetchBudgets() // Refresh the budgets list
    setIsEditDialogOpen(false)
    setEditingBudget(null)
    toast({
      title: "Budget Updated",
      description: "Budget has been successfully updated.",
    })
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to update budget",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error updating budget:", error)
      toast({
        title: "Error",
        description: "Failed to update budget",
        variant: "destructive",
      })
    }
  }

  const handleDeleteBudget = async (id: number) => {
    try {
      const response = await fetch(`/api/governance/budget/${id}`, {
        method: 'DELETE',
      })

      const result = await response.json()

      if (result.success) {
        await fetchBudgets() // Refresh the budgets list
    toast({
      title: "Budget Deleted",
      description: "Budget has been successfully deleted.",
    })
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to delete budget",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error deleting budget:", error)
      toast({
        title: "Error",
        description: "Failed to delete budget",
        variant: "destructive",
      })
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "under-budget": return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      case "on-track": return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
      case "near-limit": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
      case "over-budget": return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  // Calculate totals
  const totalAllocated = budgets.reduce((sum, budget) => sum + Number(budget.allocated_amount || 0), 0)
  const totalSpent = budgets.reduce((sum, budget) => sum + Number(budget.spent_amount || 0), 0)
  const totalRemaining = budgets.reduce((sum, budget) => sum + Number(budget.remaining_amount || 0), 0)
  const overallUtilization = totalAllocated > 0 ? (totalSpent / totalAllocated) * 100 : 0

  return (
    <div>
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                Budget Management
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                Track and manage governance budget allocations and spending
              </p>
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" className="hover:bg-green-50 dark:hover:bg-green-900">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Budget
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Create New Budget</DialogTitle>
                    <DialogDescription>
                      Add a new budget allocation for governance activities.
                    </DialogDescription>
                  </DialogHeader>
                  <BudgetForm onSubmit={handleCreateBudget} />
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Allocated</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {formatCurrency(totalAllocated)}
                  </p>
                </div>
                <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-full">
                  <DollarSign className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Spent</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {formatCurrency(totalSpent)}
                  </p>
                </div>
                <div className="p-3 bg-green-100 dark:bg-green-900 rounded-full">
                  <TrendingUp className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Remaining</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {formatCurrency(totalRemaining)}
                  </p>
                </div>
                <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-full">
                  <TrendingDown className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Utilization</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {overallUtilization.toFixed(1)}%
                  </p>
                </div>
                <div className="p-3 bg-orange-100 dark:bg-orange-900 rounded-full">
                  <BarChart3 className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-6 shadow-lg border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex flex-wrap gap-4 items-center">
              <div className="flex-1 min-w-64">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search budgets..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={fetchBudgets}
                disabled={loading}
                className="flex items-center gap-2"
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <RefreshCw className="h-4 w-4" />
                )}
                Refresh
              </Button>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  {statuses.map((status) => (
                    <SelectItem key={status} value={status}>
                      {status.replace('-', ' ')}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={selectedFiscalYear} onValueChange={setSelectedFiscalYear}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Fiscal Year" />
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
          </CardContent>
        </Card>

        {/* Budget Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Budget Management ({filteredBudgets.length})
                    </CardTitle>
            <CardDescription>
              Track and manage governance budget allocations and spending
                    </CardDescription>
              </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin" />
                <span className="ml-2">Loading budget data...</span>
                  </div>
            ) : filteredBudgets.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No budget data found. Try adjusting your filters or create a new budget item.
                  </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Category</TableHead>
                      <TableHead>Subcategory</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Fiscal Year</TableHead>
                      <TableHead>Allocated</TableHead>
                      <TableHead>Spent</TableHead>
                      <TableHead>Committed</TableHead>
                      <TableHead>Remaining</TableHead>
                      <TableHead>Utilization</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Owner</TableHead>
                      <TableHead>Department</TableHead>
                      <TableHead>Vendor</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredBudgets.map((budget) => (
                      <TableRow key={budget.id}>
                        <TableCell>
                          <Badge variant="outline">{budget.category}</Badge>
                        </TableCell>
                        <TableCell className="text-sm">{budget.subcategory || 'N/A'}</TableCell>
                        <TableCell>
                          <div className="max-w-xs">
                            <div className="text-sm truncate" title={budget.description}>
                              {budget.description}
                  </div>
                </div>
                        </TableCell>
                        <TableCell className="font-mono text-sm">{budget.fiscal_year}</TableCell>
                        <TableCell className="font-semibold">
                          {formatCurrency(Number(budget.allocated_amount || 0))}
                        </TableCell>
                        <TableCell className="font-semibold text-green-600">
                          {formatCurrency(Number(budget.spent_amount || 0))}
                        </TableCell>
                        <TableCell className="font-semibold text-yellow-600">
                          {formatCurrency(Number(budget.committed_amount || 0))}
                        </TableCell>
                        <TableCell className="font-semibold text-blue-600">
                          {formatCurrency(Number(budget.remaining_amount || 0))}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className="text-sm font-semibold">
                              {Number(budget.utilization_percentage || 0).toFixed(1)}%
                  </div>
                  <Progress 
                              value={Number(budget.utilization_percentage || 0)} 
                              className="h-2 w-16"
                  />
                </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(budget.status)}>
                            {budget.status.replace('-', ' ')}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm">{budget.budget_owner}</TableCell>
                        <TableCell className="text-sm">{budget.department || 'N/A'}</TableCell>
                        <TableCell className="text-sm">{budget.vendor || 'N/A'}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Button variant="ghost" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                  <Button
                              variant="ghost"
                    size="sm"
                    onClick={() => {
                      setEditingBudget(budget)
                      setIsEditDialogOpen(true)
                    }}
                  >
                              <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                              variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteBudget(budget.id)}
                  >
                              <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
              </CardContent>
            </Card>

        {/* Edit Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Edit Budget</DialogTitle>
              <DialogDescription>
                Update the budget allocation details.
              </DialogDescription>
            </DialogHeader>
            <BudgetForm 
              budget={editingBudget || undefined} 
              onSubmit={handleEditBudget}
              onCancel={() => {
                setIsEditDialogOpen(false)
                setEditingBudget(null)
              }}
            />
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}

// Budget Form Component
function BudgetForm({ budget, onSubmit, onCancel }: { 
  budget?: GovernanceBudget
  onSubmit: (data: any) => void
  onCancel?: () => void
}) {
  const [formData, setFormData] = useState({
    category: budget?.category || "Security Tools & Software",
    subcategory: budget?.subcategory || "",
    description: budget?.description || "",
    fiscal_year: budget?.fiscal_year || "2024",
    allocated_amount: budget?.allocated_amount || 0,
    spent_amount: budget?.spent_amount || 0,
    committed_amount: budget?.committed_amount || 0,
    status: budget?.status || "on-track",
    budget_owner: budget?.budget_owner || "",
    department: budget?.department || "",
    cost_center: budget?.cost_center || "",
    vendor: budget?.vendor || "",
    contract_reference: budget?.contract_reference || "",
    approval_date: budget?.approval_date || "",
    approval_authority: budget?.approval_authority || "",
    notes: budget?.notes || ""
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="category">Category</Label>
          <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Security Tools & Software">Security Tools & Software</SelectItem>
              <SelectItem value="Compliance Training">Compliance Training</SelectItem>
              <SelectItem value="Risk Assessment">Risk Assessment</SelectItem>
              <SelectItem value="Governance Framework">Governance Framework</SelectItem>
              <SelectItem value="Security Infrastructure">Security Infrastructure</SelectItem>
              <SelectItem value="Audit & Assessment">Audit & Assessment</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="subcategory">Subcategory</Label>
          <Input
            id="subcategory"
            value={formData.subcategory}
            onChange={(e) => setFormData({ ...formData, subcategory: e.target.value })}
            placeholder="Optional subcategory"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          rows={3}
        />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <Label htmlFor="allocated_amount">Allocated Amount ($)</Label>
          <Input
            id="allocated_amount"
            type="number"
            value={formData.allocated_amount}
            onChange={(e) => setFormData({ ...formData, allocated_amount: parseFloat(e.target.value) || 0 })}
            required
          />
        </div>
        <div>
          <Label htmlFor="spent_amount">Spent Amount ($)</Label>
          <Input
            id="spent_amount"
            type="number"
            value={formData.spent_amount}
            onChange={(e) => setFormData({ ...formData, spent_amount: parseFloat(e.target.value) || 0 })}
            required
          />
        </div>
        <div>
          <Label htmlFor="committed_amount">Committed Amount ($)</Label>
          <Input
            id="committed_amount"
            type="number"
            value={formData.committed_amount}
            onChange={(e) => setFormData({ ...formData, committed_amount: parseFloat(e.target.value) || 0 })}
          />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <Label htmlFor="fiscal_year">Fiscal Year</Label>
          <Select value={formData.fiscal_year} onValueChange={(value) => setFormData({ ...formData, fiscal_year: value })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="2024">2024</SelectItem>
              <SelectItem value="2025">2025</SelectItem>
              <SelectItem value="2026">2026</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="status">Status</Label>
          <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="on-track">On Track</SelectItem>
              <SelectItem value="under-budget">Under Budget</SelectItem>
              <SelectItem value="near-limit">Near Limit</SelectItem>
              <SelectItem value="over-budget">Over Budget</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="approval_date">Approval Date</Label>
          <Input
            id="approval_date"
            type="date"
            value={formData.approval_date}
            onChange={(e) => setFormData({ ...formData, approval_date: e.target.value })}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="budget_owner">Budget Owner</Label>
          <Input
            id="budget_owner"
            value={formData.budget_owner}
            onChange={(e) => setFormData({ ...formData, budget_owner: e.target.value })}
            required
          />
        </div>
        <div>
          <Label htmlFor="department">Department</Label>
          <Input
            id="department"
            value={formData.department}
            onChange={(e) => setFormData({ ...formData, department: e.target.value })}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="cost_center">Cost Center</Label>
          <Input
            id="cost_center"
            value={formData.cost_center}
            onChange={(e) => setFormData({ ...formData, cost_center: e.target.value })}
          />
        </div>
        <div>
          <Label htmlFor="vendor">Vendor</Label>
          <Input
            id="vendor"
            value={formData.vendor}
            onChange={(e) => setFormData({ ...formData, vendor: e.target.value })}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="contract_reference">Contract Reference</Label>
          <Input
            id="contract_reference"
            value={formData.contract_reference}
            onChange={(e) => setFormData({ ...formData, contract_reference: e.target.value })}
          />
        </div>
        <div>
          <Label htmlFor="approval_authority">Approval Authority</Label>
          <Input
            id="approval_authority"
            value={formData.approval_authority}
            onChange={(e) => setFormData({ ...formData, approval_authority: e.target.value })}
          />
        </div>
      </div>

      <div>
        <Label htmlFor="notes">Notes</Label>
        <Textarea
          id="notes"
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          rows={2}
        />
      </div>

      <DialogFooter>
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button type="submit">
          {budget ? "Update Budget" : "Create Budget"}
        </Button>
      </DialogFooter>
    </form>
  )
}
