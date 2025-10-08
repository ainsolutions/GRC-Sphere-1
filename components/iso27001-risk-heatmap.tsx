"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { BarChart3, TrendingDown, TrendingUp } from "lucide-react"

interface Risk {
  id: string
  riskId: string
  title: string
  likelihood: number
  impact: number
  riskScore: number
  riskLevel: "Low" | "Medium" | "High" | "Critical"
  residualLikelihood: number
  residualImpact: number
  residualRisk: number
  status: string
}

interface ISO27001RiskHeatmapProps {
  risks: Risk[]
}

interface HeatmapCell {
  likelihood: number
  impact: number
  risks: Risk[]
  count: number
  riskLevel: "Low" | "Medium" | "High" | "Critical"
}

export function ISO27001RiskHeatmap({ risks }: ISO27001RiskHeatmapProps) {
  const [viewType, setViewType] = useState<"inherent" | "residual">("inherent")

  const getRiskLevel = (score: number): "Low" | "Medium" | "High" | "Critical" => {
    if (score >= 15) return "Critical"
    if (score >= 10) return "High"
    if (score >= 5) return "Medium"
    return "Low"
  }

  const getRiskLevelColor = (level: string) => {
    switch (level) {
      case "Critical":
        return "bg-red-500 hover:bg-red-600 text-white"
      case "High":
        return "bg-orange-500 hover:bg-orange-600 text-white"
      case "Medium":
        return "bg-yellow-500 hover:bg-yellow-600 text-white"
      case "Low":
        return "bg-green-500 hover:bg-green-600 text-white"
      default:
        return "bg-gray-200 hover:bg-gray-300 text-gray-700"
    }
  }

  const generateHeatmapData = (useResidual = false): HeatmapCell[][] => {
    const heatmapData: HeatmapCell[][] = []

    // Initialize 5x5 grid (likelihood 1-5, impact 1-5)
    for (let likelihood = 5; likelihood >= 1; likelihood--) {
      const row: HeatmapCell[] = []
      for (let impact = 1; impact <= 5; impact++) {
        const cellRisks = risks.filter((risk) => {
          const riskLikelihood = useResidual ? risk.residualLikelihood : risk.likelihood
          const riskImpact = useResidual ? risk.residualImpact : risk.impact
          return riskLikelihood === likelihood && riskImpact === impact
        })

        const score = likelihood * impact
        const riskLevel = getRiskLevel(score)

        row.push({
          likelihood,
          impact,
          risks: cellRisks,
          count: cellRisks.length,
          riskLevel,
        })
      }
      heatmapData.push(row)
    }

    return heatmapData
  }

  const inherentHeatmapData = generateHeatmapData(false)
  const residualHeatmapData = generateHeatmapData(true)
  const currentHeatmapData = viewType === "inherent" ? inherentHeatmapData : residualHeatmapData

  const getHeatmapStats = (data: HeatmapCell[][]) => {
    let totalRisks = 0
    let criticalCount = 0
    let highCount = 0
    let mediumCount = 0
    let lowCount = 0

    data.forEach((row) => {
      row.forEach((cell) => {
        totalRisks += cell.count
        switch (cell.riskLevel) {
          case "Critical":
            criticalCount += cell.count
            break
          case "High":
            highCount += cell.count
            break
          case "Medium":
            mediumCount += cell.count
            break
          case "Low":
            lowCount += cell.count
            break
        }
      })
    })

    return { totalRisks, criticalCount, highCount, mediumCount, lowCount }
  }

  const inherentStats = getHeatmapStats(inherentHeatmapData)
  const residualStats = getHeatmapStats(residualHeatmapData)

  const impactLabels = ["Very Low", "Low", "Medium", "High", "Very High"]
  const likelihoodLabels = ["Very High", "High", "Medium", "Low", "Very Low"]

  return (
    <div className="space-y-6">
      {/* Header with Toggle */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Risk Heatmap</h3>
          <p className="text-sm text-muted-foreground">
            Visual representation of risk distribution by likelihood and impact
          </p>
        </div>
        <Tabs value={viewType} onValueChange={(value) => setViewType(value as "inherent" | "residual")}>
          <TabsList>
            <TabsTrigger value="inherent" className="flex items-center space-x-2">
              <TrendingUp className="h-4 w-4" />
              <span>Inherent Risk</span>
            </TabsTrigger>
            <TabsTrigger value="residual" className="flex items-center space-x-2">
              <TrendingDown className="h-4 w-4" />
              <span>Residual Risk</span>
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-2">
            <div className="flex items-center space-x-2">
              <BarChart3 className="h-2 w-2 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Total Risks</p>
                <p className="text-2xl font-bold">
                  {viewType === "inherent" ? inherentStats.totalRisks : residualStats.totalRisks}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-red-500 rounded"></div>
              <div>
                <p className="text-sm font-medium">Critical</p>
                <p className="text-2xl font-bold text-red-600">
                  {viewType === "inherent" ? inherentStats.criticalCount : residualStats.criticalCount}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-orange-500 rounded"></div>
              <div>
                <p className="text-sm font-medium">High</p>
                <p className="text-2xl font-bold text-orange-600">
                  {viewType === "inherent" ? inherentStats.highCount : residualStats.highCount}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-yellow-500 rounded"></div>
              <div>
                <p className="text-sm font-medium">Medium</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {viewType === "inherent" ? inherentStats.mediumCount : residualStats.mediumCount}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded"></div>
              <div>
                <p className="text-sm font-medium">Low</p>
                <p className="text-2xl font-bold text-green-600">
                  {viewType === "inherent" ? inherentStats.lowCount : residualStats.lowCount}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Heatmap Grid */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <span>{viewType === "inherent" ? "Inherent" : "Residual"} Risk Heatmap</span>
            <Badge variant="outline">{viewType === "inherent" ? "Current Risk Level" : "Risk After Controls"}</Badge>
          </CardTitle>
          <CardDescription>
            Click on any cell to view the risks in that category.
            {viewType === "inherent"
              ? " Inherent risk shows the risk level without considering existing controls."
              : " Residual risk shows the remaining risk after implementing controls."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Heatmap Table */}
            <div className="overflow-x-auto">
              <div className="inline-block min-w-full p-1">
                {/* Impact Header */}
                <div className="flex items-center mb-1">
                  <div className="w-24 text-center text-sm font-medium text-muted-foreground">Likelihood</div>
                  <div className="flex-1 text-center text-sm font-medium text-muted-foreground">Impact →</div>
                </div>

                {/* Impact Labels */}
                <div className="flex items-center">
                  <div className="w-24"></div>
                  {impactLabels.map((label, index) => (
                    <div key={index} className="flex-1 text-center text-xs font-medium text-muted-foreground">
                      {index + 1}
                      <br />
                      <span className="text-xs">{label}</span>
                    </div>
                  ))}
                </div>

                {/* Heatmap Rows */}
                <TooltipProvider>
                  {currentHeatmapData.map((row, rowIndex) => (
                    <div key={rowIndex} className="flex items-center">
                      {/* Likelihood Label */}
                      <div className="w-24 text-center text-xs font-medium text-muted-foreground">
                        {row[0].likelihood}
                        <br />
                        <span className="text-xs">{likelihoodLabels[rowIndex]}</span>
                      </div>

                      {/* Heatmap Cells */}
                      {row.map((cell, cellIndex) => (
                        <Tooltip key={cellIndex}>
                          <TooltipTrigger asChild>
                            <div
                              className={`flex-1 aspect-square border border-gray-300 dark:border-gray-600 cursor-pointer transition-all duration-200 ${
                                cell.count > 0
                                  ? getRiskLevelColor(cell.riskLevel)
                                  : "bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700"
                              } flex flex-col items-center justify-center p-2 m-0.5 rounded`}
                            >
                              <div className="text-6xl">{cell.count}</div>
                              {cell.count > 0 && <div className="text-sm opacity-90">{cell.riskLevel}</div>}
                            </div>
                          </TooltipTrigger>
                          <TooltipContent side="top" className="max-w-sm">
                            <div className="space-y-2">
                              <div className="font-semibold">
                                Likelihood: {cell.likelihood} | Impact: {cell.impact}
                              </div>
                              <div className="text-sm">
                                Risk Score: {cell.likelihood * cell.impact} ({cell.riskLevel})
                              </div>
                              <div className="text-sm">Risk Count: {cell.count}</div>
                              {cell.risks.length > 0 && (
                                <div className="space-y-1">
                                  <div className="text-sm font-medium">Risks:</div>
                                  {cell.risks.slice(0, 5).map((risk) => (
                                    <div key={risk.id} className="text-xs">
                                      • {risk.riskId}: {risk.title.substring(0, 40)}
                                      {risk.title.length > 40 ? "..." : ""}
                                    </div>
                                  ))}
                                  {cell.risks.length > 5 && (
                                    <div className="text-xs text-muted-foreground">
                                      ... and {cell.risks.length - 5} more
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                          </TooltipContent>
                        </Tooltip>
                      ))}
                    </div>
                  ))}
                </TooltipProvider>
              </div>
            </div>

            {/* Legend */}
            <div className="flex items-center justify-center space-x-6 pt-4 border-t">
              <div className="flex items-center space-x-4">
                <span className="text-sm font-medium">Risk Level:</span>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-green-500 rounded"></div>
                  <span className="text-xs">Low (1-4)</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-yellow-500 rounded"></div>
                  <span className="text-xs">Medium (5-9)</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-orange-500 rounded"></div>
                  <span className="text-xs">High (10-14)</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-red-500 rounded"></div>
                  <span className="text-xs">Critical (15-25)</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Risk Comparison */}
      {viewType === "residual" && (
        <Card>
          <CardHeader>
            <CardTitle>Risk Reduction Analysis</CardTitle>
            <CardDescription>Comparison between inherent and residual risk levels</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">
                  {inherentStats.criticalCount - residualStats.criticalCount >= 0
                    ? `↓${inherentStats.criticalCount - residualStats.criticalCount}`
                    : `↑${residualStats.criticalCount - inherentStats.criticalCount}`}
                </div>
                <div className="text-sm text-muted-foreground">Critical Risks Reduced</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">
                  {inherentStats.highCount - residualStats.highCount >= 0
                    ? `↓${inherentStats.highCount - residualStats.highCount}`
                    : `↑${residualStats.highCount - inherentStats.highCount}`}
                </div>
                <div className="text-sm text-muted-foreground">High Risks Reduced</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-600">
                  {inherentStats.mediumCount - residualStats.mediumCount >= 0
                    ? `↓${inherentStats.mediumCount - residualStats.mediumCount}`
                    : `↑${residualStats.mediumCount - inherentStats.mediumCount}`}
                </div>
                <div className="text-sm text-muted-foreground">Medium Risks Reduced</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {residualStats.lowCount - inherentStats.lowCount >= 0
                    ? `↑${residualStats.lowCount - inherentStats.lowCount}`
                    : `↓${inherentStats.lowCount - residualStats.lowCount}`}
                </div>
                <div className="text-sm text-muted-foreground">Low Risks Increased</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
