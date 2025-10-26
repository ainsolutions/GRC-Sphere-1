"use client"

import { useEffect, useMemo, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { NISTCSFRiskTemplatesList } from "@/components/nist-csf-risk-templates-list"
import { NISTCSFMitigationRegister } from "@/components/nist-csf-mitigation-register"
import { NISTCSFDashboard } from "@/components/nist-csf-dashboard"
import { Shield, Target, FileText, TrendingUp, BarChart3 } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export default function NISTCSFPage() {
  const [activeTab, setActiveTab] = useState("dashboard")

  // Dashboard data
  const [nistFunctions, setNistFunctions] = useState<any[]>([])
  const [nistCategories, setNistCategories] = useState<any[]>([])
  const [nistTemplates, setNistTemplates] = useState<any[]>([])
  const [mitigationPlans, setMitigationPlans] = useState<any[]>([])

  useEffect(() => {
    async function load() {
      try {
        const [fnRes, catRes, tplRes, planRes] = await Promise.all([
          fetch("/api/nist-csf-functions"),
          fetch("/api/nist-csf-categories"),
          fetch("/api/nist-csf-risk-templates?limit=1000"),
          fetch("/api/nist-csf-mitigation-plans?limit=1000"),
        ])

        if (fnRes.ok) {
          const f = await fnRes.json()
          setNistFunctions(f.data || [])
        }
        if (catRes.ok) {
          const c = await catRes.json()
          setNistCategories(c.data || [])
        }
        if (tplRes.ok) {
          const t = await tplRes.json()
          // endpoint returns { success, data: { templates, total ... } } or array in some cases
          const tpl = Array.isArray(t) ? t : t.data?.templates || []
          setNistTemplates(tpl)
        }
        if (planRes.ok) {
          const p = await planRes.json()
          // endpoint returns { success, data: { plans, pagination } }
          setMitigationPlans(p.data?.plans || [])
        }
      } catch (e) {
        console.error("Failed to load NIST dashboard data", e)
      }
    }
    load()
  }, [])

  // Aggregations
  const metrics = useMemo(() => {
    const totalRisks = nistTemplates.length
    const risksByLevel: Record<string, number> = {}
    nistTemplates.forEach((r: any) => {
      const lvl = (r.risk_level || "Unknown").toString()
      risksByLevel[lvl] = (risksByLevel[lvl] || 0) + 1
    })

    const byFunction: { code: string; name: string; count: number }[] = []
    const fnMap = new Map<number, { code: string; name: string }>()
    nistFunctions.forEach((f: any) => fnMap.set(Number(f.id), { code: f.function_code, name: f.function_name }))
    const fnCounts = new Map<number, number>()
    nistTemplates.forEach((t: any) => {
      const fid = Number(t.function_id)
      fnCounts.set(fid, (fnCounts.get(fid) || 0) + 1)
    })
    fnCounts.forEach((count, fid) => {
      const meta = fnMap.get(fid) || { code: `F-${fid}`, name: "Function" }
      byFunction.push({ code: meta.code, name: meta.name, count })
    })
    byFunction.sort((a, b) => b.count - a.count)

    const byCategory: { name: string; count: number }[] = []
    const catCounts = new Map<string, number>()
    nistTemplates.forEach((t: any) => {
      const cat = t.category_name || t.category_code || "Uncategorized"
      catCounts.set(cat, (catCounts.get(cat) || 0) + 1)
    })
    catCounts.forEach((count, name) => byCategory.push({ name, count }))
    byCategory.sort((a, b) => b.count - a.count)

    const statusCounts: Record<string, number> = {}
    let totalInvestment = 0
    const residualCounts: Record<string, number> = {}
    mitigationPlans.forEach((p: any) => {
      const s = (p.status || "Planning").toString()
      statusCounts[s] = (statusCounts[s] || 0) + 1
      totalInvestment += Number(p.investment_amount) || 0
      const rr = (p.residual_risk_level || "Medium").toString()
      residualCounts[rr] = (residualCounts[rr] || 0) + 1
    })

    return { totalRisks, risksByLevel, byFunction, byCategory, statusCounts, totalInvestment, residualCounts }
  }, [nistTemplates, nistFunctions, mitigationPlans])

  return (
    <main className="flex-1 overflow-y-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold" >
            <Shield className="h-8 w-8 text-blue-600" />
            NIST Cybersecurity Framework
          </h1>
          <p className="text-muted-foreground mt-2">
            Comprehensive risk management aligned with NIST CSF functions and categories
          </p>
        </div>
        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
          NIST CSF v1.1
        </Badge>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Shield className="h-4 w-4 text-blue-600" />
              <h1 className="text-lg font-bold text-cyan-300">Framework Functions</h1>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-700">5</div>
            <p className="text-xs text-muted-foreground">ID, PR, DE, RS, RC</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <FileText className="h-4 w-4 text-green-600" />
              <h1 className="text-lg font-bold text-cyan-300">Risk Register</h1>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-700">Active</div>
            <p className="text-xs text-muted-foreground">Standardized assessments</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Target className="h-4 w-4 text-purple-600" />
              <h1 className="text-lg font-bold text-cyan-300">Mitigation Plans</h1>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-700">Tracked</div>
            <p className="text-xs text-muted-foreground">Implementation progress</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-orange-600" />
              <h1 className="text-lg font-bold text-cyan-300">Maturity Level</h1>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-700">Tier 2</div>
            <p className="text-xs text-muted-foreground">Risk Informed</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Card>
        <CardHeader>
          <CardTitle>NIST CSF Risk Management</CardTitle>
          <CardDescription>
            Manage cybersecurity risks using standardized NIST CSF framework and track mitigation efforts
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="dashboard" className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                Cyber Hub
              </TabsTrigger>
              <TabsTrigger value="templates" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Risk Register
              </TabsTrigger>
              <TabsTrigger value="mitigation" className="flex items-center gap-2">
                <Target className="h-4 w-4" />
                Mitigation Plans
              </TabsTrigger>
            </TabsList>

            <TabsContent value="dashboard" className="space-y-6">
              <NISTCSFDashboard />
            </TabsContent>

            <TabsContent value="templates" className="space-y-6">
              <NISTCSFRiskTemplatesList />
            </TabsContent>

            <TabsContent value="mitigation" className="space-y-6">
              <NISTCSFMitigationRegister />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </main>
  )
}
