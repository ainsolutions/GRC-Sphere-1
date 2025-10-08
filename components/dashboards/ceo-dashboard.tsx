"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  AlertTriangle,
  Shield,
  Target,
  BarChart3,
  PieChart,
  Activity,
  Zap,
  Eye,
  RefreshCw,
  Crown,
  Building2,
  Users,
  FileText,
  Loader2,
  Bug,
  AlertCircle,
  Lock
} from "lucide-react"
import { PieChart as RechartsPieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, LineChart, Line } from "recharts"
import { useState, useEffect } from "react"

// Interfaces for real data sources
interface Vulnerability {
  id: number
  name: string
  description: string
  severity: string
  category: string
  cve_id?: string
  cvss_score?: number
  remediation_status: string
  remediation_due_date?: string
  assigned_to?: string
  affected_systems: string[]
  remediation_notes?: string
  created_at: string
  updated_at: string
}

interface Incident {
  id: number
  title: string
  description: string
  severity: string
  status: string
  incident_type: string
  reported_by: string
  assigned_to?: string
  reported_date: string
  resolved_date?: string
  impact_assessment?: string
  root_cause?: string
  lessons_learned?: string
  created_at: string
  updated_at: string
}

interface ISO27001Risk {
  id: number
  risk_id: string
  title: string
  description: string
  category: string
  likelihood: number
  impact: number
  risk_score: number
  risk_level: string
  status: string
  owner: string
  treatment_plan?: string
  residual_likelihood: number
  residual_impact: number
  residual_risk: number
  last_reviewed?: string
  next_review?: string
  controls: string[]
  assets: string[]
  control_assessment?: string
  risk_treatment?: string
  created_at: string
  updated_at: string
}

interface NISTCSFTemplate {
  id: number
  template_id: string
  template_name: string
  risk_description: string
  function_id: string
  category_id?: string
  default_likelihood: number
  default_impact: number
  risk_level: string
  threat_sources: string[]
  vulnerabilities: string[]
  asset_types: string[]
  nist_references: string[]
  is_active: boolean
  created_at: string
  updated_at: string
}

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

interface CEODashboardProps {
  metrics: any
  onRefresh: () => void
  refreshing: boolean
}

const COLORS = {
  critical: '#ef4444',
  high: '#f97316',
  medium: '#eab308',
  low: '#22c55e',
  compliant: '#10b981',
  nonCompliant: '#ef4444'
}

export function CEODashboard({ metrics, onRefresh, refreshing }: CEODashboardProps) {
  // State management for real data
  const [vulnerabilities, setVulnerabilities] = useState<Vulnerability[]>([])
  const [incidents, setIncidents] = useState<Incident[]>([])
  const [iso27001Risks, setIso27001Risks] = useState<ISO27001Risk[]>([])
  const [nistTemplates, setNistTemplates] = useState<NISTCSFTemplate[]>([])
  const [governanceKPIs, setGovernanceKPIs] = useState<GovernanceKPI[]>([])
  const [governanceBudgets, setGovernanceBudgets] = useState<GovernanceBudget[]>([])
  const [loadingStates, setLoadingStates] = useState({
    vulnerabilities: false,
    incidents: false,
    iso27001Risks: false,
    nistTemplates: false,
    governanceKPIs: false,
    governanceBudgets: false
  })

  // Fetch vulnerabilities data
  const fetchVulnerabilities = async () => {
    try {
      setLoadingStates(prev => ({ ...prev, vulnerabilities: true }))
      const response = await fetch('/api/vulnerabilities')
      const result = await response.json()
      
      if (result.success) {
        setVulnerabilities(result.data || [])
      } else {
        console.error('Failed to fetch vulnerabilities:', result.error)
      }
    } catch (error) {
      console.error('Error fetching vulnerabilities:', error)
    } finally {
      setLoadingStates(prev => ({ ...prev, vulnerabilities: false }))
    }
  }

  // Fetch incidents data
  const fetchIncidents = async () => {
    try {
      setLoadingStates(prev => ({ ...prev, incidents: true }))
      const response = await fetch('/api/incidents')
      const result = await response.json()
      
      if (result.success) {
        setIncidents(result.data || [])
      } else {
        console.error('Failed to fetch incidents:', result.error)
      }
    } catch (error) {
      console.error('Error fetching incidents:', error)
    } finally {
      setLoadingStates(prev => ({ ...prev, incidents: false }))
    }
  }

  // Fetch ISO27001 risks data
  const fetchISO27001Risks = async () => {
    try {
      setLoadingStates(prev => ({ ...prev, iso27001Risks: true }))
      const response = await fetch('/api/iso27001-risks')
      const result = await response.json()
      
      if (result.success) {
        setIso27001Risks(result.data || [])
      } else {
        console.error('Failed to fetch ISO27001 risks:', result.error)
      }
    } catch (error) {
      console.error('Error fetching ISO27001 risks:', error)
    } finally {
      setLoadingStates(prev => ({ ...prev, iso27001Risks: false }))
    }
  }

  // Fetch NIST CSF templates data
  const fetchNISTTemplates = async () => {
    try {
      setLoadingStates(prev => ({ ...prev, nistTemplates: true }))
      const response = await fetch('/api/nist-csf-risk-templates')
      const result = await response.json()
      
      if (result.success) {
        setNistTemplates(result.data || [])
      } else {
        console.error('Failed to fetch NIST templates:', result.error)
      }
    } catch (error) {
      console.error('Error fetching NIST templates:', error)
    } finally {
      setLoadingStates(prev => ({ ...prev, nistTemplates: false }))
    }
  }

  // Fetch governance KPIs data
  const fetchGovernanceKPIs = async () => {
    try {
      setLoadingStates(prev => ({ ...prev, governanceKPIs: true }))
      const response = await fetch('/api/governance/kpis')
      const result = await response.json()
      
      if (result.success) {
        setGovernanceKPIs(result.data || [])
      } else {
        console.error('Failed to fetch governance KPIs:', result.error)
      }
    } catch (error) {
      console.error('Error fetching governance KPIs:', error)
    } finally {
      setLoadingStates(prev => ({ ...prev, governanceKPIs: false }))
    }
  }

  // Fetch governance budgets data
  const fetchGovernanceBudgets = async () => {
    try {
      setLoadingStates(prev => ({ ...prev, governanceBudgets: true }))
      const response = await fetch('/api/governance/budget')
      const result = await response.json()
      
      if (result.success) {
        setGovernanceBudgets(result.data || [])
      } else {
        console.error('Failed to fetch governance budgets:', result.error)
      }
    } catch (error) {
      console.error('Error fetching governance budgets:', error)
    } finally {
      setLoadingStates(prev => ({ ...prev, governanceBudgets: false }))
    }
  }

  // Fetch all executive data
  const fetchAllExecutiveData = async () => {
    await Promise.all([
      fetchVulnerabilities(),
      fetchIncidents(),
      fetchISO27001Risks(),
      fetchNISTTemplates(),
      fetchGovernanceKPIs(),
      fetchGovernanceBudgets()
    ])
  }

  // Initial data fetch
  useEffect(() => {
    fetchAllExecutiveData()
  }, [])

  // Enhanced refresh function
  const handleRefresh = async () => {
    await fetchAllExecutiveData()
    onRefresh()
  }

  // Calculate executive-level metrics from real data with safe array handling
  const executiveMetrics = {
    // Risk metrics
    totalRisks: Array.isArray(iso27001Risks) ? iso27001Risks.length : 0,
    highRiskCount: Array.isArray(iso27001Risks) ? iso27001Risks.filter(risk => risk.risk_level === 'High').length : 0,
    criticalRisks: Array.isArray(iso27001Risks) ? iso27001Risks.filter(risk => risk.risk_level === 'Critical').length : 0,
    averageRiskScore: Array.isArray(iso27001Risks) && iso27001Risks.length > 0 ? 
      iso27001Risks.reduce((sum, risk) => sum + (risk.risk_score || 0), 0) / iso27001Risks.length : 0,
    
    // Vulnerability metrics
    totalVulnerabilities: Array.isArray(vulnerabilities) ? vulnerabilities.length : 0,
    criticalVulns: Array.isArray(vulnerabilities) ? vulnerabilities.filter(vuln => vuln.severity === 'Critical').length : 0,
    highVulns: Array.isArray(vulnerabilities) ? vulnerabilities.filter(vuln => vuln.severity === 'High').length : 0,
    unpatchedVulns: Array.isArray(vulnerabilities) ? vulnerabilities.filter(vuln => vuln.remediation_status === 'Open').length : 0,
    
    // Incident metrics
    totalIncidents: Array.isArray(incidents) ? incidents.length : 0,
    openIncidents: Array.isArray(incidents) ? incidents.filter(incident => incident.status === 'Open').length : 0,
    criticalIncidents: Array.isArray(incidents) ? incidents.filter(incident => incident.severity === 'Critical').length : 0,
    resolvedIncidents: Array.isArray(incidents) ? incidents.filter(incident => incident.status === 'Resolved').length : 0,
    
    // Governance metrics
    totalKPIs: Array.isArray(governanceKPIs) ? governanceKPIs.length : 0,
    kpiCompliance: Array.isArray(governanceKPIs) ? governanceKPIs.filter(kpi => kpi.status === 'active').length : 0,
    totalBudget: Array.isArray(governanceBudgets) ? governanceBudgets.reduce((sum, budget) => sum + Number(budget.allocated_amount || 0), 0) : 0,
    budgetUtilization: Array.isArray(governanceBudgets) && governanceBudgets.length > 0 ? 
      governanceBudgets.reduce((sum, budget) => sum + Number(budget.utilization_percentage || 0), 0) / governanceBudgets.length : 0,
    
    // Template metrics
    totalNISTTemplates: Array.isArray(nistTemplates) ? nistTemplates.length : 0,
    activeTemplates: Array.isArray(nistTemplates) ? nistTemplates.filter(template => template.is_active).length : 0
  }

  // Business impact calculations based on real data
  const businessImpactMetrics = {
    totalRiskValue: executiveMetrics.totalRisks * 50000, // Estimated $50k per risk
    vulnerabilityExposure: executiveMetrics.criticalVulns * 100000 + executiveMetrics.highVulns * 50000, // $100k critical, $50k high
    incidentCost: executiveMetrics.criticalIncidents * 250000 + executiveMetrics.openIncidents * 100000, // $250k critical, $100k open
    complianceValue: executiveMetrics.totalBudget * 0.1, // 10% of budget for compliance
    totalAssetsValue: executiveMetrics.totalBudget * 2 // Estimated 2x budget as asset value
  }

  // Calculate compliance data from real governance KPIs
  const complianceData = governanceKPIs.length > 0 ? [
    { 
      name: 'Compliant', 
      value: Math.round((executiveMetrics.kpiCompliance / executiveMetrics.totalKPIs) * 100), 
      color: COLORS.compliant 
    },
    { 
      name: 'Non-Compliant', 
      value: Math.round(((executiveMetrics.totalKPIs - executiveMetrics.kpiCompliance) / executiveMetrics.totalKPIs) * 100), 
      color: COLORS.nonCompliant 
    }
  ] : [
    { name: 'Compliant', value: 0, color: COLORS.compliant },
    { name: 'Non-Compliant', value: 100, color: COLORS.nonCompliant }
  ]

  const riskTrendData = [
    { month: 'Jan', risks: 45, incidents: 3 },
    { month: 'Feb', risks: 52, incidents: 5 },
    { month: 'Mar', risks: 48, incidents: 2 },
    { month: 'Apr', risks: 61, incidents: 8 },
    { month: 'May', risks: 55, incidents: 4 },
    { month: 'Jun', risks: 49, incidents: 3 }
  ]

  // Generate business unit data from real risk categories
  const businessUnitData = iso27001Risks.reduce((acc, risk) => {
    const existing = acc.find(item => item.name === risk.category)
    if (existing) {
      existing.risks++
      existing.assets += risk.assets.length
    } else {
      acc.push({ name: risk.category, risks: 1, assets: risk.assets.length })
    }
    return acc
  }, [] as { name: string; risks: number; assets: number }[]).slice(0, 5)

  return (
    <div className="space-y-8">
      {/* CEO Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-full">
            <Crown className="h-8 w-8 text-white" />
          </div>
          <div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">
              Executive Dashboard
            </h2>
            <p className="text-slate-300">Strategic oversight and business risk management</p>
          </div>
        </div>
        <Button onClick={handleRefresh} disabled={refreshing || Object.values(loadingStates).some(loading => loading)} className="glass-card text-cyan-300 hover:bg-white/20">
          <RefreshCw className={`h-4 w-4 mr-2 ${refreshing || Object.values(loadingStates).some(loading => loading) ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>

      {/* Key Business Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle>Total Assets Value</CardTitle>
            <DollarSign className="h-4 w-4 text-green-400 animate-pulse" />
          </CardHeader>
          <CardContent>
            {loadingStates.governanceBudgets ? (
              <div className="flex items-center justify-center py-4">
                <Loader2 className="h-6 w-6 animate-spin" />
              </div>
            ) : (
              <>
            <div className="text-3xl font-bold text-green-300 animate-count-up">
              ${(businessImpactMetrics.totalAssetsValue / 1000000).toFixed(1)}M
            </div>
            <p className="text-xs text-green-600 mt-1">
              Protected assets portfolio
            </p>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle>Risk Exposure</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-400 animate-pulse" />
          </CardHeader>
          <CardContent>
            {loadingStates.iso27001Risks ? (
              <div className="flex items-center justify-center py-4">
                <Loader2 className="h-6 w-6 animate-spin" />
              </div>
            ) : (
              <>
            <div className="text-3xl font-bold text-red-300 animate-count-up">
              ${(businessImpactMetrics.totalRiskValue / 1000).toFixed(0)}K
            </div>
            <p className="text-xs text-red-600 mt-1">
                  {executiveMetrics.criticalRisks} critical, {executiveMetrics.highRiskCount} high risks
            </p>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle>Security Posture</CardTitle>
            <Shield className="h-4 w-4 text-blue-400 animate-pulse" />
          </CardHeader>
          <CardContent>
            {loadingStates.vulnerabilities || loadingStates.incidents ? (
              <div className="flex items-center justify-center py-4">
                <Loader2 className="h-6 w-6 animate-spin" />
              </div>
            ) : (
              <>
            <div className="text-3xl font-bold text-blue-300 animate-count-up">
                  {executiveMetrics.criticalVulns + executiveMetrics.criticalIncidents}
            </div>
            <p className="text-xs text-blue-600 mt-1">
                  Critical vulnerabilities & incidents
            </p>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle>Governance KPIs</CardTitle>
            <Target className="h-4 w-4 text-purple-400 animate-pulse" />
          </CardHeader>
          <CardContent>
            {loadingStates.governanceKPIs ? (
              <div className="flex items-center justify-center py-4">
                <Loader2 className="h-6 w-6 animate-spin" />
              </div>
            ) : (
              <>
            <div className="text-3xl font-bold text-purple-300 animate-count-up">
                  {executiveMetrics.kpiCompliance}/{executiveMetrics.totalKPIs}
            </div>
            <p className="text-xs text-purple-600 mt-1">
                  Active KPIs tracking
            </p>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Business Impact Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>
              <BarChart3 className="h-5 w-5 mr-2 animate-bounce" />
              Risk vs Business Impact
            </CardTitle>
            <CardDescription className="text-gray-400">
              Financial exposure across business units
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loadingStates.iso27001Risks ? (
              <div className="flex items-center justify-center h-[300px]">
                <Loader2 className="h-8 w-8 animate-spin" />
                <span className="ml-2">Loading risk data...</span>
              </div>
            ) : businessUnitData.length === 0 ? (
              <div className="flex items-center justify-center h-[300px] text-gray-500">
                <div className="text-center">
                  <AlertTriangle className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                  <p>No risk data available</p>
                </div>
              </div>
            ) : (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={businessUnitData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis
                  dataKey="name"
                  tick={{ fill: "#9ca3af", fontSize: 12 }}
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis tick={{ fill: "#9ca3af", fontSize: 12 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1e293b",
                    border: "1px solid #475569",
                    borderRadius: "6px",
                    color: "#fff",
                  }}
                />
                <Bar dataKey="risks" fill="#ef4444" name="Risk Count" />
                <Bar dataKey="assets" fill="#3b82f6" name="Asset Count" />
              </BarChart>
            </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>
              <PieChart className="h-5 w-5 mr-2 animate-pulse" />
              Compliance Overview
            </CardTitle>
            <CardDescription className="text-gray-400">
              Regulatory compliance status
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loadingStates.governanceKPIs ? (
              <div className="flex items-center justify-center h-[300px]">
                <Loader2 className="h-8 w-8 animate-spin" />
                <span className="ml-2">Loading compliance data...</span>
              </div>
            ) : governanceKPIs.length === 0 ? (
              <div className="flex items-center justify-center h-[300px] text-gray-500">
                <div className="text-center">
                  <Shield className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                  <p>No compliance data available</p>
                </div>
              </div>
            ) : (
              <>
            <div className="flex items-center justify-center mb-4">
              <div className="text-center">
                    <div className="text-4xl font-bold text-green-400">
                      {complianceData[0]?.value || 0}%
                    </div>
                <div className="text-sm">Compliant</div>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <RechartsPieChart>
                <Pie
                  data={complianceData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {complianceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1e293b",
                        border: "1px solid #475569",
                    borderRadius: "6px",
                    color: "white",
                  }}
                />
              </RechartsPieChart>
            </ResponsiveContainer>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Security & Risk Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>
              <Bug className="h-5 w-5 mr-2 animate-pulse" />
              Vulnerability Status
            </CardTitle>
            <CardDescription className="text-gray-400">
              Current vulnerability landscape
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loadingStates.vulnerabilities ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin" />
                <span className="ml-2">Loading...</span>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-red-400">Critical</span>
                  <span className="text-lg font-bold text-red-300">{executiveMetrics.criticalVulns}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-orange-400">High</span>
                  <span className="text-lg font-bold text-orange-300">{executiveMetrics.highVulns}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-yellow-400">Unpatched</span>
                  <span className="text-lg font-bold text-yellow-300">{executiveMetrics.unpatchedVulns}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-400">Total</span>
                  <span className="text-lg font-bold text-gray-300">{executiveMetrics.totalVulnerabilities}</span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>
              <AlertCircle className="h-5 w-5 mr-2 animate-pulse" />
              Incident Status
            </CardTitle>
            <CardDescription className="text-gray-400">
              Security incident summary
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loadingStates.incidents ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin" />
                <span className="ml-2">Loading...</span>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-red-400">Critical</span>
                  <span className="text-lg font-bold text-red-300">{executiveMetrics.criticalIncidents}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-orange-400">Open</span>
                  <span className="text-lg font-bold text-orange-300">{executiveMetrics.openIncidents}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-green-400">Resolved</span>
                  <span className="text-lg font-bold text-green-300">{executiveMetrics.resolvedIncidents}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-400">Total</span>
                  <span className="text-lg font-bold text-gray-300">{executiveMetrics.totalIncidents}</span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>
              <Lock className="h-5 w-5 mr-2 animate-pulse" />
              Risk Framework
            </CardTitle>
            <CardDescription className="text-gray-400">
              Risk management overview
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loadingStates.iso27001Risks || loadingStates.nistTemplates ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin" />
                <span className="ml-2">Loading...</span>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-blue-400">ISO27001 Risks</span>
                  <span className="text-lg font-bold text-blue-300">{executiveMetrics.totalRisks}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-purple-400">NIST Templates</span>
                  <span className="text-lg font-bold text-purple-300">{executiveMetrics.totalNISTTemplates}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-green-400">Active Templates</span>
                  <span className="text-lg font-bold text-green-300">{executiveMetrics.activeTemplates}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-400">Avg Risk Score</span>
                  <span className="text-lg font-bold text-gray-300">{executiveMetrics.averageRiskScore.toFixed(1)}</span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Strategic Initiatives & Risk Trends */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>
              <TrendingUp className="h-5 w-5 mr-2 animate-pulse" />
              Risk Trend Analysis
            </CardTitle>
            <CardDescription className="text-gray-400">
              6-month risk and incident trends
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={riskTrendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="month" tick={{ fill: "#9ca3af", fontSize: 12 }} />
                <YAxis tick={{ fill: "#9ca3af", fontSize: 12 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1e293b",
                    border: "1px solid #475569",
                    borderRadius: "6px",
                    color: "#fff",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="risks"
                  stroke="#ef4444"
                  strokeWidth={2}
                  name="Risks"
                />
                <Line
                  type="monotone"
                  dataKey="incidents"
                  stroke="#f97316"
                  strokeWidth={2}
                  name="Incidents"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>
              <Building2 className="h-5 w-5 mr-2 animate-bounce" />
              Strategic Initiatives
            </CardTitle>
            <CardDescription className="text-gray-400">
              Key projects and their risk profiles
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  <div>
                    <div className="font-medium text-blue-600">Cloud Migration</div>
                    <div className="text-sm text-slate-400">Q2 2024 completion</div>
                  </div>
                </div>
                <Badge variant="outline" className="text-green-400 border-green-500/50">
                  Low Risk
                </Badge>
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full animate-pulse"></div>
                  <div>
                    <div className="font-medium text-yellow-600">AI Implementation</div>
                    <div className="text-sm text-slate-400">Q3 2024 completion</div>
                  </div>
                </div>
                <Badge variant="outline" className="text-yellow-400 border-yellow-500/50">
                  Medium Risk
                </Badge>
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                  <div>
                    <div className="font-medium text-red-600">Data Center Upgrade</div>
                    <div className="text-sm text-slate-400">Q4 2024 completion</div>
                  </div>
                </div>
                <Badge variant="outline" className="text-red-400 border-red-500/50">
                  High Risk
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Executive Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <Users className="h-8 w-8 text-blue-800" />
              <div>
                <div className="text-2xl font-bold text-blue-300">
                  {loadingStates.iso27001Risks ? (
                    <Loader2 className="h-6 w-6 animate-spin" />
                  ) : (
                    executiveMetrics.totalRisks
                  )}
                </div>
                <div className="text-sm text-blue-600">Total Risks</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <FileText className="h-8 w-8 text-purple-800" />
              <div>
                <div className="text-2xl font-bold text-purple-300">
                  {loadingStates.governanceKPIs ? (
                    <Loader2 className="h-6 w-6 animate-spin" />
                  ) : (
                    executiveMetrics.totalKPIs - executiveMetrics.kpiCompliance
                  )}
                </div>
                <div className="text-sm text-purple-600">Inactive KPIs</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <Activity className="h-8 w-8 text-green-400" />
              <div>
                <div className="text-2xl font-bold text-green-300">
                  {loadingStates.vulnerabilities || loadingStates.incidents ? (
                    <Loader2 className="h-6 w-6 animate-spin" />
                  ) : (
                    executiveMetrics.unpatchedVulns + executiveMetrics.openIncidents
                  )}
                </div>
                <div className="text-sm text-green-600">Open Issues</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
