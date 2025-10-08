"use client"

import React, { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import {
  BarChart3,
  TrendingUp,
  DollarSign,
  FileText,
  Shield,
  Target,
  Activity,
  PieChart,
  Zap,
  Star,
  Globe,
  Users,
  Calendar,
  AlertTriangle,
  CheckCircle,
  Clock,
  ArrowUp,
  ArrowDown,
  RefreshCw,
  Settings,
  Eye,
  Download,
  Loader2,
} from "lucide-react"

// Interfaces for real data
interface GovernanceKPI {
  id: number
  name: string
  description: string
  target_value: string
  current_value: string
  unit: string
  category: string
  framework: string
  status: string
  trend: string
  measurement_frequency: string
  owner: string
  department: string
  calculation_method: string
  data_source: string
  last_updated: string
  next_review_date: string
  created_at: string
  updated_at: string
}

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

interface GovernanceDocument {
  id: number
  title: string
  document_type: string
  current_version: string
  status: string
  category: string
  subcategory?: string
  description: string
  document_owner: string
  department_owner?: string
  approval_authority?: string
  review_frequency: string
  related_documents: string[]
  applicable_frameworks: string[]
  tags: string[]
  confidentiality_level: string
  distribution_list: string[]
  compliance_requirements: string[]
  created_at: string
  updated_at: string
  created_by?: string
  updated_by?: string
  file_path?: string
  file_size?: number
  mime_type?: string
  version_count?: number
  pending_approvals?: number
}

interface GovernanceControl {
  id: number
  name: string
  description: string
  control_id: string
  framework: string
  category: string
  subcategory?: string
  control_type?: string
  implementation_status: string
  effectiveness_rating?: string
  maturity_level?: string
  owner: string
  department?: string
  responsible_party?: string
  implementation_date?: string
  last_assessment_date?: string
  next_assessment_date?: string
  assessment_frequency: string
  test_results?: any
  evidence_location?: string
  related_risks: string[]
  related_assets: string[]
  dependencies: string[]
  cost_estimate?: number
  maintenance_cost?: number
  automation_level: string
  monitoring_frequency?: string
  reporting_frequency?: string
  compliance_requirements: string[]
  applicable_regulations: string[]
  control_measures: string[]
  exceptions?: string
  remediation_plan?: string
  notes?: string
  created_at: string
  updated_at: string
  created_by?: string
  updated_by?: string
}

// Animated Counter Component
const AnimatedCounter = ({ value, duration = 2000 }: { value: number; duration?: number }) => {
  const [count, setCount] = useState(0)

  useEffect(() => {
    let startTime: number
    const startValue = 0
    const endValue = value

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime
      const progress = Math.min((currentTime - startTime) / duration, 1)
      
      const easeOutCubic = 1 - Math.pow(1 - progress, 3)
      const currentValue = startValue + (endValue - startValue) * easeOutCubic
      
      setCount(Math.floor(currentValue))
      
      if (progress < 1) {
        requestAnimationFrame(animate)
      }
    }

    requestAnimationFrame(animate)
  }, [value, duration])

  return <span>{count}</span>
}

// Futuristic Progress Ring Component
const ProgressRing = ({ 
  percentage, 
  size = 120, 
  strokeWidth = 8, 
  color = "#3b82f6",
  animated = true 
}: {
  percentage: number
  size?: number
  strokeWidth?: number
  color?: string
  animated?: boolean
}) => {
  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const strokeDasharray = circumference
  const strokeDashoffset = circumference - (percentage / 100) * circumference

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg
        width={size}
        height={size}
        className="transform -rotate-90"
      >
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="transparent"
          className="text-gray-200 dark:text-gray-700"
        />
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={strokeDasharray}
          strokeDashoffset={animated ? strokeDashoffset : 0}
          className={`transition-all duration-2000 ease-out ${
            animated ? 'animate-pulse' : ''
          }`}
          style={{
            strokeDasharray: strokeDasharray,
            strokeDashoffset: animated ? strokeDashoffset : 0,
            filter: 'drop-shadow(0 0 8px rgba(59, 130, 246, 0.5))'
          }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-2xl font-bold text-gray-900 dark:text-white">
          <AnimatedCounter value={percentage} />
          <span className="text-sm text-gray-500">%</span>
        </span>
      </div>
    </div>
  )
}

// Animated Bar Chart Component
const AnimatedBarChart = ({ data, maxValue }: { data: any[]; maxValue: number }) => {
  const [animatedData, setAnimatedData] = useState(data.map(d => ({ ...d, animatedValue: 0 })))

  useEffect(() => {
    const animate = () => {
      setAnimatedData(prev => 
        prev.map((item, index) => ({
          ...item,
          animatedValue: item.spent || item.count || item.percentage
        }))
      )
    }

    const timer = setTimeout(animate, 500)
    return () => clearTimeout(timer)
  }, [data])

  return (
    <div className="space-y-4">
      {animatedData.map((item, index) => {
        const height = (item.animatedValue / maxValue) * 200
        return (
          <div key={index} className="flex items-end space-x-4">
            <div className="w-16 text-sm text-gray-600 dark:text-gray-400 text-right">
              {item.month || item.name}
            </div>
            <div className="flex-1">
              <div className="relative h-48 bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden">
                <div
                  className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-blue-500 to-blue-400 transition-all duration-2000 ease-out"
                  style={{ height: `${height}px` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-transparent to-white opacity-20"></div>
                  <div className="absolute top-2 left-2 text-white text-sm font-semibold">
                    {item.spent ? `$${(item.spent / 1000).toFixed(0)}k` : 
                     item.count ? item.count : 
                     `${item.percentage?.toFixed(1)}%`}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

// Glowing Card Component
const GlowingCard = ({ children, className = "", glowColor = "blue" }: { 
  children: React.ReactNode
  className?: string
  glowColor?: "blue" | "green" | "purple" | "orange"
}) => {
  const glowClasses = {
    blue: "shadow-blue-500/25 hover:shadow-blue-500/40",
    green: "shadow-green-500/25 hover:shadow-green-500/40",
    purple: "shadow-purple-500/25 hover:shadow-purple-500/40",
    orange: "shadow-orange-500/25 hover:shadow-orange-500/40"
  }

  return (
    <div className={`relative group ${className}`}>
      <div className={`absolute -inset-0.5 bg-gradient-to-r from-${glowColor}-500 to-${glowColor}-600 rounded-lg blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200`}></div>
      <div className="relative bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
        {children}
      </div>
    </div>
  )
}

export default function GovernanceDashboard() {
  const [selectedPeriod, setSelectedPeriod] = useState("6m")
  const [isLoading, setIsLoading] = useState(false)
  const [kpis, setKpis] = useState<GovernanceKPI[]>([])
  const [budgets, setBudgets] = useState<GovernanceBudget[]>([])
  const [documents, setDocuments] = useState<GovernanceDocument[]>([])
  const [controls, setControls] = useState<GovernanceControl[]>([])
  const [loadingStates, setLoadingStates] = useState({
    kpis: false,
    budgets: false,
    documents: false,
    controls: false
  })
  const { toast } = useToast()

  // Fetch KPIs data
  const fetchKPIs = async () => {
    try {
      setLoadingStates(prev => ({ ...prev, kpis: true }))
      const response = await fetch('/api/governance/kpis')
      const result = await response.json()
      
      if (result.success) {
        setKpis(result.data || [])
      } else {
        console.error('Failed to fetch KPIs:', result.error)
      }
    } catch (error) {
      console.error('Error fetching KPIs:', error)
    } finally {
      setLoadingStates(prev => ({ ...prev, kpis: false }))
    }
  }

  // Fetch Budget data
  const fetchBudgets = async () => {
    try {
      setLoadingStates(prev => ({ ...prev, budgets: true }))
      const response = await fetch('/api/governance/budget')
      const result = await response.json()
      
      if (result.success) {
        setBudgets(result.data || [])
      } else {
        console.error('Failed to fetch budgets:', result.error)
      }
    } catch (error) {
      console.error('Error fetching budgets:', error)
    } finally {
      setLoadingStates(prev => ({ ...prev, budgets: false }))
    }
  }

  // Fetch Documents data
  const fetchDocuments = async () => {
    try {
      setLoadingStates(prev => ({ ...prev, documents: true }))
      const response = await fetch('/api/governance/documents')
      const result = await response.json()
      
      if (result.success) {
        setDocuments(result.data || [])
      } else {
        console.error('Failed to fetch documents:', result.error)
      }
    } catch (error) {
      console.error('Error fetching documents:', error)
    } finally {
      setLoadingStates(prev => ({ ...prev, documents: false }))
    }
  }

  // Fetch Controls data
  const fetchControls = async () => {
    try {
      setLoadingStates(prev => ({ ...prev, controls: true }))
      const response = await fetch('/api/governance/controls')
      const result = await response.json()
      
      if (result.success) {
        setControls(result.data || [])
      } else {
        console.error('Failed to fetch controls:', result.error)
      }
    } catch (error) {
      console.error('Error fetching controls:', error)
    } finally {
      setLoadingStates(prev => ({ ...prev, controls: false }))
    }
  }

  // Fetch all data
  const fetchAllData = async () => {
    setIsLoading(true)
    try {
      await Promise.all([
        fetchKPIs(),
        fetchBudgets(),
        fetchDocuments(),
        fetchControls()
      ])
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // Initial data fetch
  useEffect(() => {
    fetchAllData()
  }, [])

  const refreshData = () => {
    fetchAllData()
    toast({
      title: "Data Refreshed",
      description: "Governance dashboard data has been updated.",
    })
  }

  // Calculate derived statistics
  const kpiStats = {
    total: kpis.length,
    onTrack: kpis.filter(kpi => kpi.status === 'active').length,
    avgPerformance: kpis.length > 0 ? kpis.reduce((sum, kpi) => {
      const current = Number(kpi.current_value || 0)
      const target = Number(kpi.target_value || 1)
      return sum + (current / target) * 100
    }, 0) / kpis.length : 0
  }

  const budgetStats = {
    totalAllocated: budgets.reduce((sum, budget) => sum + Number(budget.allocated_amount || 0), 0),
    totalSpent: budgets.reduce((sum, budget) => sum + Number(budget.spent_amount || 0), 0),
    totalRemaining: budgets.reduce((sum, budget) => sum + Number(budget.remaining_amount || 0), 0),
    avgUtilization: budgets.length > 0 ? budgets.reduce((sum, budget) => sum + Number(budget.utilization_percentage || 0), 0) / budgets.length : 0
  }

  const documentStats = {
    total: documents.length,
    active: documents.filter(doc => doc.status === 'active').length,
    underReview: documents.filter(doc => doc.status === 'under_review').length,
    expired: documents.filter(doc => doc.status === 'archived').length,
    categories: documents.reduce((acc, doc) => {
      const existing = acc.find(cat => cat.name === doc.document_type)
      if (existing) {
        existing.count++
      } else {
        acc.push({ name: doc.document_type, count: 1, percentage: 0 })
      }
      return acc
    }, [] as { name: string; count: number; percentage: number }[]).map(cat => ({
      ...cat,
      percentage: (cat.count / documents.length) * 100
    }))
  }

  const controlStats = {
    total: controls.length,
    implemented: controls.filter(control => control.implementation_status === 'implemented').length,
    inProgress: controls.filter(control => control.implementation_status === 'partially_implemented').length,
    planned: controls.filter(control => control.implementation_status === 'not_implemented').length,
    effectiveness: controls.reduce((acc, control) => {
      const rating = control.effectiveness_rating || 'not_assessed'
      const existing = acc.find(eff => eff.name === rating)
      if (existing) {
        existing.count++
      } else {
        acc.push({ name: rating, count: 1, percentage: 0 })
      }
      return acc
    }, [] as { name: string; count: number; percentage: number }[]).map(eff => ({
      ...eff,
      percentage: (eff.count / controls.length) * 100
    }))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-blue-900 dark:to-indigo-900">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Governance Dashboard
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                Real-time insights into your governance framework performance
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1m">1 Month</SelectItem>
                  <SelectItem value="3m">3 Months</SelectItem>
                  <SelectItem value="6m">6 Months</SelectItem>
                  <SelectItem value="1y">1 Year</SelectItem>
                </SelectContent>
              </Select>
              <Button
                onClick={refreshData}
                disabled={isLoading}
                variant="outline"
                size="sm"
                className="hover:bg-blue-50 dark:hover:bg-blue-900"
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            </div>
          </div>
        </div>

        {/* Key Metrics Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <GlowingCard glowColor="blue">
            <Card className="border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total KPIs</p>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white">
                      {loadingStates.kpis ? (
                        <Loader2 className="h-8 w-8 animate-spin" />
                      ) : (
                        <AnimatedCounter value={kpiStats.total} />
                      )}
                    </p>
                    <p className="text-sm text-green-600 dark:text-green-400 flex items-center mt-1">
                      <ArrowUp className="h-3 w-3 mr-1" />
                      {kpiStats.onTrack} active
                    </p>
                  </div>
                  <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-full">
                    <TrendingUp className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </GlowingCard>

          <GlowingCard glowColor="green">
            <Card className="border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Budget Utilization</p>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white">
                      {loadingStates.budgets ? (
                        <Loader2 className="h-8 w-8 animate-spin" />
                      ) : (
                        <>
                          <AnimatedCounter value={Math.round(budgetStats.avgUtilization)} />%
                        </>
                      )}
                    </p>
                    <p className={`text-sm flex items-center mt-1 ${
                      budgetStats.avgUtilization > 90 ? 'text-red-600 dark:text-red-400' :
                      budgetStats.avgUtilization > 75 ? 'text-orange-600 dark:text-orange-400' :
                      'text-green-600 dark:text-green-400'
                    }`}>
                      {budgetStats.avgUtilization > 90 ? (
                        <>
                          <AlertTriangle className="h-3 w-3 mr-1" />
                          Over budget
                        </>
                      ) : budgetStats.avgUtilization > 75 ? (
                        <>
                          <AlertTriangle className="h-3 w-3 mr-1" />
                          Approaching limit
                        </>
                      ) : (
                        <>
                          <CheckCircle className="h-3 w-3 mr-1" />
                          On track
                        </>
                      )}
                    </p>
                  </div>
                  <div className="p-3 bg-green-100 dark:bg-green-900 rounded-full">
                    <DollarSign className="h-6 w-6 text-green-600 dark:text-green-400" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </GlowingCard>

          <GlowingCard glowColor="purple">
            <Card className="border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Active Documents</p>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white">
                      {loadingStates.documents ? (
                        <Loader2 className="h-8 w-8 animate-spin" />
                      ) : (
                        <AnimatedCounter value={documentStats.active} />
                      )}
                    </p>
                    <p className="text-sm text-green-600 dark:text-green-400 flex items-center mt-1">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      {documentStats.total > 0 ? Math.round((documentStats.active / documentStats.total) * 100) : 0}% active
                    </p>
                  </div>
                  <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-full">
                    <FileText className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </GlowingCard>

          <GlowingCard glowColor="orange">
            <Card className="border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Control Effectiveness</p>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white">
                      {loadingStates.controls ? (
                        <Loader2 className="h-8 w-8 animate-spin" />
                      ) : (
                        <>
                          <AnimatedCounter value={controlStats.implemented} />
                        </>
                      )}
                    </p>
                    <p className="text-sm text-green-600 dark:text-green-400 flex items-center mt-1">
                      <ArrowUp className="h-3 w-3 mr-1" />
                      {controlStats.total > 0 ? Math.round((controlStats.implemented / controlStats.total) * 100) : 0}% implemented
                    </p>
                  </div>
                  <div className="p-3 bg-orange-100 dark:bg-orange-900 rounded-full">
                    <Shield className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </GlowingCard>
        </div>

        {/* Main Dashboard Content */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-white dark:bg-gray-800 shadow-lg">
            <TabsTrigger value="overview" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white">
              <BarChart3 className="h-4 w-4 mr-2" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="kpis" className="data-[state=active]:bg-green-500 data-[state=active]:text-white">
              <TrendingUp className="h-4 w-4 mr-2" />
              KPIs
            </TabsTrigger>
            <TabsTrigger value="budget" className="data-[state=active]:bg-purple-500 data-[state=active]:text-white">
              <DollarSign className="h-4 w-4 mr-2" />
              Budget
            </TabsTrigger>
            <TabsTrigger value="documents" className="data-[state=active]:bg-orange-500 data-[state=active]:text-white">
              <FileText className="h-4 w-4 mr-2" />
              Documents
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* KPI Performance Ring */}
              <GlowingCard glowColor="blue">
                <Card className="border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Target className="h-5 w-5 mr-2 text-blue-600" />
                      KPI Performance Overview
                    </CardTitle>
                    <CardDescription>
                      Current performance against targets
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-center">
                      <ProgressRing 
                        percentage={Math.round(kpiStats.avgPerformance)} 
                        size={180} 
                        strokeWidth={12}
                        color="#3b82f6"
                      />
                    </div>
                    <div className="mt-6 space-y-2">
                      {loadingStates.kpis ? (
                        <div className="flex items-center justify-center py-8">
                          <Loader2 className="h-8 w-8 animate-spin" />
                          <span className="ml-2">Loading KPIs...</span>
                        </div>
                      ) : kpis.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">
                          No KPIs found
                        </div>
                      ) : (
                        kpis.slice(0, 4).map((kpi) => {
                          const currentValue = Number(kpi.current_value || 0)
                          const targetValue = Number(kpi.target_value || 1)
                          const progressPercentage = (currentValue / targetValue) * 100
                          
                          return (
                            <div key={kpi.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                              <div className="flex items-center space-x-3">
                                <div className={`w-3 h-3 rounded-full ${
                                  kpi.status === 'active' ? 'bg-green-500' :
                                  kpi.status === 'inactive' ? 'bg-gray-500' :
                                  'bg-yellow-500'
                                }`}></div>
                                <span className="text-sm font-medium">{kpi.name}</span>
                              </div>
                              <div className="text-right">
                                <span className="text-sm font-bold">
                                  <AnimatedCounter value={currentValue} />
                                  {kpi.unit}
                                </span>
                                <div className="flex items-center text-xs">
                                  {kpi.trend === 'improving' ? (
                                    <ArrowUp className="h-3 w-3 text-green-500 mr-1" />
                                  ) : kpi.trend === 'declining' ? (
                                    <ArrowDown className="h-3 w-3 text-red-500 mr-1" />
                                  ) : (
                                    <Activity className="h-3 w-3 text-blue-500 mr-1" />
                                  )}
                                  <span className={
                                    kpi.trend === 'improving' ? 'text-green-500' : 
                                    kpi.trend === 'declining' ? 'text-red-500' : 
                                    'text-blue-500'
                                  }>
                                    {Math.round(progressPercentage)}%
                                  </span>
                                </div>
                              </div>
                            </div>
                          )
                        })
                      )}
                    </div>
                  </CardContent>
                </Card>
              </GlowingCard>

              {/* Budget Utilization Chart */}
              <GlowingCard glowColor="green">
                <Card className="border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <DollarSign className="h-5 w-5 mr-2 text-green-600" />
                      Budget Utilization Trend
                    </CardTitle>
                    <CardDescription>
                      Monthly budget spending analysis
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {loadingStates.budgets ? (
                      <div className="flex items-center justify-center py-8">
                        <Loader2 className="h-8 w-8 animate-spin" />
                        <span className="ml-2">Loading budget data...</span>
                      </div>
                    ) : budgets.length === 0 ? (
                      <div className="text-center py-8 text-gray-500">
                        No budget data found
                      </div>
                    ) : (
                      <AnimatedBarChart 
                        data={budgets.slice(0, 6).map(budget => ({
                          month: budget.category.substring(0, 3),
                          spent: Number(budget.spent_amount || 0),
                          allocated: Number(budget.allocated_amount || 0)
                        }))} 
                        maxValue={Math.max(...budgets.map(b => Number(b.allocated_amount || 0)))}
                      />
                    )}
                  </CardContent>
                </Card>
              </GlowingCard>
            </div>

            {/* Document & Controls Status */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <GlowingCard glowColor="purple">
                <Card className="border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <FileText className="h-5 w-5 mr-2 text-purple-600" />
                      Document Status Distribution
                    </CardTitle>
                    <CardDescription>
                      Current document lifecycle status
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {loadingStates.documents ? (
                        <div className="flex items-center justify-center py-8">
                          <Loader2 className="h-8 w-8 animate-spin" />
                          <span className="ml-2">Loading document data...</span>
                        </div>
                      ) : documentStats.categories.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">
                          No document categories found
                        </div>
                      ) : (
                        documentStats.categories.map((category, index) => (
                          <div key={index} className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <div className="w-4 h-4 rounded-full bg-gradient-to-r from-purple-400 to-purple-600"></div>
                              <span className="text-sm font-medium">{category.name}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <div className="w-24 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                <div 
                                  className="bg-gradient-to-r from-purple-400 to-purple-600 h-2 rounded-full transition-all duration-2000 ease-out"
                                  style={{ width: `${category.percentage}%` }}
                                ></div>
                              </div>
                              <span className="text-sm font-bold w-12 text-right">
                                <AnimatedCounter value={category.count} />
                              </span>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </CardContent>
                </Card>
              </GlowingCard>

              <GlowingCard glowColor="orange">
                <Card className="border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Shield className="h-5 w-5 mr-2 text-orange-600" />
                      Control Effectiveness Matrix
                    </CardTitle>
                    <CardDescription>
                      Control implementation and effectiveness
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {loadingStates.controls ? (
                        <div className="flex items-center justify-center py-8">
                          <Loader2 className="h-8 w-8 animate-spin" />
                          <span className="ml-2">Loading control data...</span>
                        </div>
                      ) : controlStats.effectiveness.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">
                          No control effectiveness data found
                        </div>
                      ) : (
                        controlStats.effectiveness.map((item, index) => (
                          <div key={index} className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <div className={`w-4 h-4 rounded-full ${
                                item.name === 'high' ? 'bg-green-500' :
                                item.name === 'medium' ? 'bg-blue-500' :
                                item.name === 'low' ? 'bg-yellow-500' :
                                'bg-red-500'
                              }`}></div>
                              <span className="text-sm font-medium capitalize">{item.name}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <div className="w-24 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                <div 
                                  className={`h-2 rounded-full transition-all duration-2000 ease-out ${
                                    item.name === 'high' ? 'bg-green-500' :
                                    item.name === 'medium' ? 'bg-blue-500' :
                                    item.name === 'low' ? 'bg-yellow-500' :
                                    'bg-red-500'
                                  }`}
                                  style={{ width: `${item.percentage}%` }}
                                ></div>
                              </div>
                              <span className="text-sm font-bold w-12 text-right">
                                <AnimatedCounter value={item.count} />
                              </span>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </CardContent>
                </Card>
              </GlowingCard>
            </div>
          </TabsContent>

          {/* KPIs Tab */}
          <TabsContent value="kpis" className="space-y-6">
            <GlowingCard glowColor="blue">
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <TrendingUp className="h-5 w-5 mr-2 text-blue-600" />
                    Key Performance Indicators
                  </CardTitle>
                  <CardDescription>
                    Detailed KPI performance metrics and trends
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {loadingStates.kpis ? (
                    <div className="flex items-center justify-center py-12">
                      <Loader2 className="h-12 w-12 animate-spin" />
                      <span className="ml-3 text-lg">Loading KPIs...</span>
                    </div>
                  ) : kpis.length === 0 ? (
                    <div className="text-center py-12 text-gray-500">
                      <TrendingUp className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                      <p className="text-lg">No KPIs found</p>
                      <p className="text-sm">Create your first KPI to get started</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {kpis.map((kpi) => {
                        const currentValue = Number(kpi.current_value || 0)
                        const targetValue = Number(kpi.target_value || 1)
                        const progressPercentage = (currentValue / targetValue) * 100
                        
                        return (
                          <div key={kpi.id} className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900 dark:to-indigo-900 rounded-lg border border-blue-200 dark:border-blue-700">
                            <div className="flex items-center justify-between mb-4">
                              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{kpi.name}</h3>
                              <Badge variant={kpi.status === 'active' ? 'default' : kpi.status === 'inactive' ? 'secondary' : 'destructive'}>
                                {kpi.status}
                              </Badge>
                            </div>
                            <div className="flex items-center justify-between mb-4">
                              <div className="text-3xl font-bold text-gray-900 dark:text-white">
                                <AnimatedCounter value={currentValue} />
                                <span className="text-lg text-gray-500">{kpi.unit}</span>
                              </div>
                              <div className="text-right">
                                <div className="text-sm text-gray-600 dark:text-gray-400">Target</div>
                                <div className="text-lg font-semibold">{targetValue}{kpi.unit}</div>
                              </div>
                            </div>
                            <div className="mb-4">
                              <div className="flex justify-between text-sm mb-1">
                                <span>Progress</span>
                                <span>{Math.round(progressPercentage)}%</span>
                              </div>
                              <Progress 
                                value={progressPercentage} 
                                className="h-2"
                              />
                            </div>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center text-sm">
                                {kpi.trend === 'improving' ? (
                                  <ArrowUp className="h-4 w-4 text-green-500 mr-1" />
                                ) : kpi.trend === 'declining' ? (
                                  <ArrowDown className="h-4 w-4 text-red-500 mr-1" />
                                ) : (
                                  <Activity className="h-4 w-4 text-blue-500 mr-1" />
                                )}
                                <span className={
                                  kpi.trend === 'improving' ? 'text-green-600' : 
                                  kpi.trend === 'declining' ? 'text-red-600' : 
                                  'text-blue-600'
                                }>
                                  {kpi.trend}
                                </span>
                              </div>
                              <div className="text-sm text-gray-600 dark:text-gray-400">
                                {kpi.category}
                              </div>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  )}
                </CardContent>
              </Card>
            </GlowingCard>
          </TabsContent>

          {/* Budget Tab */}
          <TabsContent value="budget" className="space-y-6">
            <GlowingCard glowColor="green">
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <DollarSign className="h-5 w-5 mr-2 text-green-600" />
                    Budget Management Dashboard
                  </CardTitle>
                  <CardDescription>
                    Comprehensive budget tracking and analysis
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {loadingStates.budgets ? (
                    <div className="flex items-center justify-center py-12">
                      <Loader2 className="h-12 w-12 animate-spin" />
                      <span className="ml-3 text-lg">Loading budget data...</span>
                    </div>
                  ) : budgets.length === 0 ? (
                    <div className="text-center py-12 text-gray-500">
                      <DollarSign className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                      <p className="text-lg">No budget data found</p>
                      <p className="text-sm">Create your first budget item to get started</p>
                    </div>
                  ) : (
                    <>
                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                        <div className="text-center p-6 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900 dark:to-emerald-900 rounded-lg border border-green-200 dark:border-green-700">
                          <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">
                            $<AnimatedCounter value={Math.round(budgetStats.totalAllocated)} />
                          </div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">Total Allocated</div>
                        </div>
                        <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900 dark:to-cyan-900 rounded-lg border border-blue-200 dark:border-blue-700">
                          <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                            $<AnimatedCounter value={Math.round(budgetStats.totalSpent)} />
                          </div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">Total Spent</div>
                        </div>
                        <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-violet-50 dark:from-purple-900 dark:to-violet-900 rounded-lg border border-purple-200 dark:border-purple-700">
                          <div className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-2">
                            $<AnimatedCounter value={Math.round(budgetStats.totalRemaining)} />
                          </div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">Remaining</div>
                        </div>
                      </div>
                      <div className="h-80">
                        <AnimatedBarChart 
                          data={budgets.slice(0, 6).map(budget => ({
                            month: budget.category.substring(0, 3),
                            spent: Number(budget.spent_amount || 0),
                            allocated: Number(budget.allocated_amount || 0)
                          }))} 
                          maxValue={Math.max(...budgets.map(b => Number(b.allocated_amount || 0)))}
                        />
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            </GlowingCard>
          </TabsContent>

          {/* Documents Tab */}
          <TabsContent value="documents" className="space-y-6">
            <GlowingCard glowColor="purple">
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <FileText className="h-5 w-5 mr-2 text-purple-600" />
                    Document Management Analytics
                  </CardTitle>
                  <CardDescription>
                    Document lifecycle and compliance tracking
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {loadingStates.documents ? (
                    <div className="flex items-center justify-center py-12">
                      <Loader2 className="h-12 w-12 animate-spin" />
                      <span className="ml-3 text-lg">Loading document data...</span>
                    </div>
                  ) : documents.length === 0 ? (
                    <div className="text-center py-12 text-gray-500">
                      <FileText className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                      <p className="text-lg">No documents found</p>
                      <p className="text-sm">Create your first document to get started</p>
                    </div>
                  ) : (
                    <>
                      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-6">
                        <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-violet-50 dark:from-purple-900 dark:to-violet-900 rounded-lg border border-purple-200 dark:border-purple-700">
                          <div className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-2">
                            <AnimatedCounter value={documentStats.total} />
                          </div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">Total Documents</div>
                        </div>
                        <div className="text-center p-6 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900 dark:to-emerald-900 rounded-lg border border-green-200 dark:border-green-700">
                          <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">
                            <AnimatedCounter value={documentStats.active} />
                          </div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">Active</div>
                        </div>
                        <div className="text-center p-6 bg-gradient-to-br from-yellow-50 to-amber-50 dark:from-yellow-900 dark:to-amber-900 rounded-lg border border-yellow-200 dark:border-yellow-700">
                          <div className="text-3xl font-bold text-yellow-600 dark:text-yellow-400 mb-2">
                            <AnimatedCounter value={documentStats.underReview} />
                          </div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">Under Review</div>
                        </div>
                        <div className="text-center p-6 bg-gradient-to-br from-red-50 to-rose-50 dark:from-red-900 dark:to-rose-900 rounded-lg border border-red-200 dark:border-red-700">
                          <div className="text-3xl font-bold text-red-600 dark:text-red-400 mb-2">
                            <AnimatedCounter value={documentStats.expired} />
                          </div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">Archived</div>
                        </div>
                      </div>
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Document Categories</h3>
                        {documentStats.categories.map((category, index) => (
                          <div key={index} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                            <div className="flex items-center space-x-3">
                              <div className="w-4 h-4 rounded-full bg-gradient-to-r from-purple-400 to-purple-600"></div>
                              <span className="font-medium">{category.name}</span>
                            </div>
                            <div className="flex items-center space-x-4">
                              <div className="w-32 bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                                <div 
                                  className="bg-gradient-to-r from-purple-400 to-purple-600 h-3 rounded-full transition-all duration-2000 ease-out"
                                  style={{ width: `${category.percentage}%` }}
                                ></div>
                              </div>
                              <div className="text-right">
                                <div className="font-bold">
                                  <AnimatedCounter value={category.count} />
                                </div>
                                <div className="text-sm text-gray-500">
                                  {category.percentage.toFixed(1)}%
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            </GlowingCard>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
