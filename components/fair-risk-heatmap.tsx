"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts"
import { Flame, Shield, TrendingUp, Activity, DollarSign } from "lucide-react"

interface HeatMapData {
  heatmap_data: Array<{
    asset_category: string
    risk_level: string
    risk_count: number
    total_ale: number
    avg_ale: number
    treated_risks: number
    avg_risk_reduction: number
  }>
  category_totals: Array<{
    asset_category: string
    total_risks: number
    total_category_ale: number
    total_assets: number
  }>
  severity_distribution: Array<{
    asset_category: string
    severity_level: string
    count: number
    avg_ale: number
  }>
  treatment_effectiveness: Array<{
    asset_category: string
    treatment_plans: number
    avg_reduction: number
    total_cost: number
    approved_plans: number
    total_controls: number
    completed_controls: number
  }>
  risk_trends: Array<{
    asset_category: string
    month: string
    new_risks: number
    monthly_ale: number
  }>
  risk_intensity: Array<{
    asset_category: string
    risks_per_asset: number
    total_risks: number
    total_assets: number
    max_ale: number
    min_ale: number
  }>
}

const RISK_COLORS = {
  Critical: "#dc2626", // red-600
  High: "#ea580c", // orange-600
  Medium: "#ca8a04", // yellow-600
  Low: "#16a34a", // green-600
}

const ASSET_TYPE_COLORS = [
  "#3b82f6", // blue-500
  "#8b5cf6", // violet-500
  "#06b6d4", // cyan-500
  "#10b981", // emerald-500
  "#f59e0b", // amber-500
  "#ef4444", // red-500
  "#8b5cf6", // purple-500
  "#06b6d4", // cyan-500
]

export function FairRiskHeatMap() {
  const [data, setData] = useState<HeatMapData | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [activeView, setActiveView] = useState("heatmap")

  useEffect(() => {
    fetchHeatMapData()
  }, [])

  const fetchHeatMapData = async () => {
    try {
      const response = await fetch("/api/fair-risks/heatmap")
      if (response.ok) {
        const heatMapData = await response.json()
        setData(heatMapData)
      }
    } catch (error) {
      console.error("Error fetching heat map data:", error)
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", { month: "short", year: "numeric" })
  }

  const getIntensityColor = (intensity: number, maxIntensity: number) => {
    const normalizedIntensity = intensity / maxIntensity
    const opacity = Math.max(0.1, normalizedIntensity)
    return `rgba(239, 68, 68, ${opacity})` // red with varying opacity
  }

  const getRiskLevelColor = (level: string) => {
    return RISK_COLORS[level as keyof typeof RISK_COLORS] || "#6b7280"
  }

  const prepareHeatMapMatrix = () => {
    if (!data?.heatmap_data) return { matrix: [], categories: [], riskLevels: [] }

    const categories = [...new Set(data.heatmap_data.map((item) => item.asset_category))].sort()
    const riskLevels = ["Critical", "High", "Medium", "Low"]

    const matrix = categories.map((category) => {
      const categoryData = data.heatmap_data.filter((item) => item.asset_category === category)
      return riskLevels.map((level) => {
        const cellData = categoryData.find((item) => item.risk_level === level)
        return {
          category,
          level,
          count: cellData?.risk_count || 0,
          ale: cellData?.total_ale || 0,
          avgAle: cellData?.avg_ale || 0,
          treatedRisks: cellData?.treated_risks || 0,
          avgReduction: cellData?.avg_risk_reduction || 0,
        }
      })
    })

    return { matrix, categories, riskLevels }
  }

  const getMaxRiskCount = () => {
    if (!data?.heatmap_data) return 1
    return Math.max(...data.heatmap_data.map((item) => item.risk_count))
  }

  const getCategoryTrends = (category: string) => {
    if (!data?.risk_trends) return []
    return data.risk_trends
      .filter((item) => item.asset_category === category)
      .sort((a, b) => new Date(a.month).getTime() - new Date(b.month).getTime())
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">Loading Risk Heat Map...</p>
        </div>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="text-center py-8">
        <p className="text-lg text-gray-600 dark:text-gray-400">No heat map data available</p>
      </div>
    )
  }

  const { matrix, categories, riskLevels } = prepareHeatMapMatrix()
  const maxRiskCount = getMaxRiskCount()

  return (
    <div className="space-y-6">
      <Tabs value={activeView} onValueChange={setActiveView} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="heatmap">Risk Heat Map</TabsTrigger>
          <TabsTrigger value="intensity">Risk Intensity</TabsTrigger>
          <TabsTrigger value="treatment">Treatment Status</TabsTrigger>
          <TabsTrigger value="trends">Category Trends</TabsTrigger>
        </TabsList>

        <TabsContent value="heatmap" className="space-y-6">
          <Card className="gradient-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Flame className="h-5 w-5" />
                Risk Level Heat Map by Asset Category
              </CardTitle>
              <CardDescription>
                Visual representation of risk distribution across different asset types and risk levels
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Legend */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <span className="text-sm font-medium">Risk Levels:</span>
                    {riskLevels.map((level) => (
                      <div key={level} className="flex items-center gap-1">
                        <div className="w-4 h-4 rounded" style={{ backgroundColor: getRiskLevelColor(level) }}></div>
                        <span className="text-xs">{level}</span>
                      </div>
                    ))}
                  </div>
                  <div className="text-sm text-muted-foreground">Cell intensity represents risk count</div>
                </div>

                {/* Heat Map Grid */}
                <div className="overflow-x-auto">
                  <div className="min-w-full">
                    {/* Header Row */}
                    <div className="grid grid-cols-5 gap-1 mb-2">
                      <div className="p-2 text-sm font-medium">Asset Category</div>
                      {riskLevels.map((level) => (
                        <div
                          key={level}
                          className="p-2 text-sm font-medium text-center rounded"
                          style={{
                            backgroundColor: getRiskLevelColor(level),
                            color: "white",
                          }}
                        >
                          {level}
                        </div>
                      ))}
                    </div>

                    {/* Data Rows */}
                    {matrix.map((categoryRow, categoryIndex) => (
                      <div key={categories[categoryIndex]} className="grid grid-cols-5 gap-1 mb-1">
                        <div className="p-3 text-sm font-medium bg-gray-100 dark:bg-gray-800 rounded flex items-center">
                          {categories[categoryIndex]}
                        </div>
                        {categoryRow.map((cell, levelIndex) => {
                          const intensity = cell.count / maxRiskCount
                          const backgroundColor =
                            cell.count > 0
                              ? `${getRiskLevelColor(cell.level)}${Math.floor(intensity * 255)
                                  .toString(16)
                                  .padStart(2, "0")}`
                              : "#f3f4f6"

                          return (
                            <TooltipProvider key={levelIndex}>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <div
                                    className="p-3 rounded cursor-pointer transition-all hover:scale-105 border"
                                    style={{ backgroundColor }}
                                    onClick={() => setSelectedCategory(cell.category)}
                                  >
                                    <div className="text-center">
                                      <div className="text-lg font-bold text-gray-900 dark:text-white">
                                        {cell.count}
                                      </div>
                                      {cell.treatedRisks > 0 && (
                                        <div className="text-xs text-gray-700 dark:text-gray-300">
                                          {cell.treatedRisks} treated
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <div className="space-y-1">
                                    <div className="font-medium">
                                      {cell.category} - {cell.level}
                                    </div>
                                    <div>Risks: {cell.count}</div>
                                    <div>Total ALE: {formatCurrency(cell.ale)}</div>
                                    <div>Avg ALE: {formatCurrency(cell.avgAle)}</div>
                                    <div>Treated: {cell.treatedRisks}</div>
                                    {cell.avgReduction > 0 && <div>Avg Reduction: {cell.avgReduction.toFixed(1)}%</div>}
                                  </div>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          )
                        })}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Category Summary */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {data.category_totals.slice(0, 6).map((category, index) => (
                    <Card key={category.asset_category} className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium">{category.asset_category}</div>
                          <div className="text-sm text-muted-foreground">
                            {category.total_risks} risks • {category.total_assets} assets
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold">{formatCurrency(category.total_category_ale)}</div>
                          <div className="text-xs text-muted-foreground">Total ALE</div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="intensity" className="space-y-6">
          <Card className="gradient-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Risk Intensity by Asset Category
              </CardTitle>
              <CardDescription>Risk density analysis showing risks per asset across categories</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={data.risk_intensity}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="asset_category" angle={-45} textAnchor="end" height={100} />
                  <YAxis />
                  <RechartsTooltip
                    formatter={(value: any, name: string) => [
                      name === "risks_per_asset" ? value.toFixed(2) : value,
                      name === "risks_per_asset" ? "Risks per Asset" : name,
                    ]}
                  />
                  <Legend />
                  <Bar dataKey="risks_per_asset" name="Risks per Asset" fill="#3b82f6">
                    {data.risk_intensity.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={ASSET_TYPE_COLORS[index % ASSET_TYPE_COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>

              <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {data.risk_intensity.map((category, index) => (
                  <Card key={category.asset_category} className="p-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: ASSET_TYPE_COLORS[index % ASSET_TYPE_COLORS.length] }}
                        ></div>
                        <span className="font-medium">{category.asset_category}</span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <span className="text-muted-foreground">Intensity:</span>
                          <span className="font-medium ml-1">{category.risks_per_asset.toFixed(2)}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Assets:</span>
                          <span className="font-medium ml-1">{category.total_assets}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Risks:</span>
                          <span className="font-medium ml-1">{category.total_risks}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Max ALE:</span>
                          <span className="font-medium ml-1">{formatCurrency(category.max_ale)}</span>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="treatment" className="space-y-6">
          <Card className="gradient-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Treatment Effectiveness by Asset Category
              </CardTitle>
              <CardDescription>
                Analysis of risk treatment progress and effectiveness across asset types
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {data.treatment_effectiveness.map((category, index) => {
                  const completionRate =
                    category.total_controls > 0 ? (category.completed_controls / category.total_controls) * 100 : 0
                  const approvalRate =
                    category.treatment_plans > 0 ? (category.approved_plans / category.treatment_plans) * 100 : 0

                  return (
                    <div key={category.asset_category} className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h3 className="font-medium text-lg">{category.asset_category}</h3>
                          <p className="text-sm text-muted-foreground">
                            {category.treatment_plans} treatment plans • {category.total_controls} controls
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-blue-600">{category.avg_reduction.toFixed(1)}%</div>
                          <div className="text-xs text-muted-foreground">Avg Risk Reduction</div>
                        </div>
                      </div>

                      <div className="grid gap-4 md:grid-cols-3">
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">Control Completion</span>
                            <span className="text-sm">{completionRate.toFixed(1)}%</span>
                          </div>
                          <Progress value={completionRate} className="h-2" />
                          <div className="text-xs text-muted-foreground">
                            {category.completed_controls} of {category.total_controls} controls
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">Plan Approval</span>
                            <span className="text-sm">{approvalRate.toFixed(1)}%</span>
                          </div>
                          <Progress value={approvalRate} className="h-2" />
                          <div className="text-xs text-muted-foreground">
                            {category.approved_plans} of {category.treatment_plans} plans
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <DollarSign className="h-4 w-4" />
                            <span className="text-sm font-medium">Investment</span>
                          </div>
                          <div className="text-lg font-bold">{formatCurrency(category.total_cost)}</div>
                          <div className="text-xs text-muted-foreground">
                            {formatCurrency(category.total_cost / category.treatment_plans)} avg per plan
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trends" className="space-y-6">
          <Card className="gradient-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Risk Trends by Asset Category
              </CardTitle>
              <CardDescription>Monthly risk identification trends across different asset categories</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" tickFormatter={formatDate} />
                  <YAxis />
                  <RechartsTooltip
                    labelFormatter={(value) => formatDate(value)}
                    formatter={(value: any, name: string) => [
                      name.includes("ALE") ? formatCurrency(value) : value,
                      name,
                    ]}
                  />
                  <Legend />

                  {categories.slice(0, 6).map((category, index) => {
                    const categoryTrends = getCategoryTrends(category)
                    return (
                      <Line
                        key={category}
                        data={categoryTrends}
                        type="monotone"
                        dataKey="new_risks"
                        stroke={ASSET_TYPE_COLORS[index % ASSET_TYPE_COLORS.length]}
                        strokeWidth={2}
                        name={`${category} Risks`}
                      />
                    )
                  })}
                </LineChart>
              </ResponsiveContainer>

              {selectedCategory && (
                <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <h4 className="font-medium mb-2">Selected Category: {selectedCategory}</h4>
                  <div className="grid gap-2 md:grid-cols-3">
                    {getCategoryTrends(selectedCategory)
                      .slice(-3)
                      .map((trend, index) => (
                        <div key={index} className="text-sm">
                          <div className="font-medium">{formatDate(trend.month)}</div>
                          <div>{trend.new_risks} new risks</div>
                          <div>{formatCurrency(trend.monthly_ale)} ALE</div>
                        </div>
                      ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
