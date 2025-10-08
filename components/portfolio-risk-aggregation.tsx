"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  AlertTriangle,
  DollarSign,
  Shield,
  Calculator,
  Activity,
  BarChart3,
  Loader2,
  PieChart,
  Target,
  Zap,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface RiskPortfolio {
  id: number
  portfolio_id: string
  name: string
  description: string | null
  risk_appetite: number
  risk_tolerance: number
  created_by: string
  created_at: string
  updated_at: string
  item_count: number
  correlation_count: number
  calculation_status: string
}

interface PortfolioItem {
  id: number
  portfolio_id: number
  risk_id: string
  risk_type: string
  weight: number
  correlation_group: string | null
  created_at: string
  updated_at: string
  risk_title?: string
  annual_loss_expectancy?: number
  risk_code?: string
}

interface PortfolioAggregation {
  id: number
  portfolio_id: number
  individual_ale_sum: number
  diversified_ale: number
  portfolio_var_95: number
  portfolio_var_99: number
  expected_shortfall_95: number
  diversification_ratio: number
  correlation_benefit: number
  concentration_index: number
  simulation_runs: number
  confidence_interval: number
  calculation_date: string
}

interface RiskContribution {
  id: number
  portfolio_id: number
  risk_id: string
  risk_title: string
  marginal_contribution: number
  component_contribution: number
  percentage_contribution: number
  standalone_ale: number
  portfolio_ale: number
}

interface CorrelationData {
  id: number
  portfolio_id: number
  risk_1_id: string
  risk_2_id: string
  correlation_coefficient: number
  correlation_type: string
  confidence_level: number
  risk_1_title?: string
  risk_2_title?: string
}

interface PortfolioRiskAggregationProps {
  portfolioId?: number
}

export function PortfolioRiskAggregation({ portfolioId }: PortfolioRiskAggregationProps) {
  const [portfolios, setPortfolios] = useState<RiskPortfolio[]>([])
  const [selectedPortfolio, setSelectedPortfolio] = useState<RiskPortfolio | null>(null)
  const [portfolioItems, setPortfolioItems] = useState<PortfolioItem[]>([])
  const [aggregationResults, setAggregationResults] = useState<PortfolioAggregation | null>(null)
  const [riskContributions, setRiskContributions] = useState<RiskContribution[]>([])
  const [correlations, setCorrelations] = useState<CorrelationData[]>([])
  const [loading, setLoading] = useState(true)
  const [calculating, setCalculating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    fetchPortfolios()
  }, [])

  useEffect(() => {
    if (portfolioId) {
      const portfolio = portfolios.find((p) => p.id === portfolioId)
      if (portfolio) {
        setSelectedPortfolio(portfolio)
        fetchPortfolioData(portfolioId)
      }
    }
  }, [portfolioId, portfolios])

  const fetchPortfolios = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/risk-portfolios")
      if (!response.ok) {
        throw new Error("Failed to fetch portfolios")
      }
      const data = await response.json()

      console.log("API Response:", data) // Debug log

      // Ensure we always have an array
      let portfolioList: RiskPortfolio[] = []

      if (Array.isArray(data)) {
        portfolioList = data
      } else if (data && Array.isArray(data.portfolios)) {
        portfolioList = data.portfolios
      } else if (data && Array.isArray(data.data)) {
        portfolioList = data.data
      } else {
        console.warn("Unexpected API response format:", data)
        portfolioList = []
      }

      setPortfolios(portfolioList)

      // Auto-select first portfolio if none selected
      if (portfolioList.length > 0 && !selectedPortfolio) {
        setSelectedPortfolio(portfolioList[0])
        fetchPortfolioData(portfolioList[0].id)
      }
    } catch (err: any) {
      console.error("Error fetching portfolios:", err)
      setError(err.message)
      setPortfolios([]) // Ensure portfolios is always an array
      toast({
        title: "Error",
        description: "Failed to fetch portfolios",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const fetchPortfolioData = async (id: number) => {
    try {
      setLoading(true)

      // Fetch portfolio items
      const itemsResponse = await fetch(`/api/risk-portfolios/${id}/items`)
      if (itemsResponse.ok) {
        const itemsData = await itemsResponse.json()
        setPortfolioItems(Array.isArray(itemsData) ? itemsData : [])
      }

      // Fetch aggregation results
      const aggregateResponse = await fetch(`/api/risk-portfolios/${id}/aggregate`)
      if (aggregateResponse.ok) {
        const aggregateData = await aggregateResponse.json()
        setAggregationResults(aggregateData.aggregation)
        setRiskContributions(Array.isArray(aggregateData.contributions) ? aggregateData.contributions : [])
      }

      // Fetch correlations
      const correlationsResponse = await fetch(`/api/risk-portfolios/${id}/correlations`)
      if (correlationsResponse.ok) {
        const correlationsData = await correlationsResponse.json()
        setCorrelations(Array.isArray(correlationsData) ? correlationsData : [])
      }
    } catch (err: any) {
      console.error("Error fetching portfolio data:", err)
      toast({
        title: "Error",
        description: "Failed to fetch portfolio data",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const runMonteCarloSimulation = async () => {
    if (!selectedPortfolio) return

    try {
      setCalculating(true)
      const response = await fetch(`/api/risk-portfolios/${selectedPortfolio.id}/aggregate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          simulation_runs: 10000,
          confidence_level: 0.95,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to run Monte Carlo simulation")
      }

      const data = await response.json()
      setAggregationResults(data.aggregation)
      setRiskContributions(Array.isArray(data.contributions) ? data.contributions : [])

      toast({
        title: "Success",
        description: "Monte Carlo simulation completed successfully",
      })
    } catch (err: any) {
      toast({
        title: "Error",
        description: `Failed to run simulation: ${err.message}`,
        variant: "destructive",
      })
    } finally {
      setCalculating(false)
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

  const formatPercentage = (value: number) => {
    return `${(value * 100).toFixed(2)}%`
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Loader2 className="animate-spin h-12 w-12 text-blue-600 mx-auto" />
          <p className="mt-4 text-gray-600">Loading portfolio data...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <Card className="border-red-200 bg-red-50">
        <CardContent className="p-6">
          <div className="flex items-center space-x-2 text-red-800">
            <AlertTriangle className="h-5 w-5" />
            <span>Error: {error}</span>
            <Button variant="outline" onClick={fetchPortfolios}>
              Retry
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Portfolio Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Portfolio Selection
          </CardTitle>
          <CardDescription>Select a risk portfolio for aggregation analysis</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="portfolio-select">Risk Portfolio</Label>
              <Select
                value={selectedPortfolio?.id.toString() || ""}
                onValueChange={(value) => {
                  if (value && value !== "no-portfolios") {
                    const portfolio = portfolios.find((p) => p.id === Number.parseInt(value))
                    if (portfolio) {
                      setSelectedPortfolio(portfolio)
                      fetchPortfolioData(portfolio.id)
                    }
                  }
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a portfolio" />
                </SelectTrigger>
                <SelectContent>
                  {Array.isArray(portfolios) && portfolios.length > 0 ? (
                    portfolios.map((portfolio) => (
                      <SelectItem key={portfolio.id} value={portfolio.id.toString()}>
                        {portfolio.name} ({portfolio.portfolio_id})
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="no-portfolios" disabled>
                      No portfolios available
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end">
              <Button onClick={runMonteCarloSimulation} disabled={!selectedPortfolio || calculating} className="w-full">
                {calculating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Running Simulation...
                  </>
                ) : (
                  <>
                    <Zap className="mr-2 h-4 w-4" />
                    Run Monte Carlo Simulation
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {selectedPortfolio && (
        <>
          {/* Portfolio Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-600 text-sm font-medium">Portfolio Items</p>
                    <p className="text-2xl font-bold text-blue-900">{portfolioItems.length}</p>
                  </div>
                  <Shield className="h-8 w-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-600 text-sm font-medium">Total ALE</p>
                    <p className="text-2xl font-bold text-green-900">
                      {aggregationResults ? formatCurrency(aggregationResults.individual_ale_sum) : "N/A"}
                    </p>
                  </div>
                  <DollarSign className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-600 text-sm font-medium">Diversified ALE</p>
                    <p className="text-2xl font-bold text-purple-900">
                      {aggregationResults ? formatCurrency(aggregationResults.diversified_ale) : "N/A"}
                    </p>
                  </div>
                  <PieChart className="h-8 w-8 text-purple-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-orange-600 text-sm font-medium">VaR (95%)</p>
                    <p className="text-2xl font-bold text-orange-900">
                      {aggregationResults ? formatCurrency(aggregationResults.portfolio_var_95) : "N/A"}
                    </p>
                  </div>
                  <BarChart3 className="h-8 w-8 text-orange-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="aggregation" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="aggregation">Aggregation Results</TabsTrigger>
              <TabsTrigger value="contributions">Risk Contributions</TabsTrigger>
              <TabsTrigger value="correlations">Correlations</TabsTrigger>
              <TabsTrigger value="items">Portfolio Items</TabsTrigger>
            </TabsList>

            <TabsContent value="aggregation" className="space-y-6">
              {aggregationResults ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Risk Metrics</CardTitle>
                      <CardDescription>Portfolio-level risk measurements</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">Total ALE:</span>
                        <span className="text-lg font-bold">
                          {formatCurrency(aggregationResults.individual_ale_sum)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="font-medium">Diversified ALE:</span>
                        <span className="text-lg font-bold text-green-600">
                          {formatCurrency(aggregationResults.diversified_ale)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="font-medium">VaR (95%):</span>
                        <span className="text-lg font-bold">{formatCurrency(aggregationResults.portfolio_var_95)}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="font-medium">VaR (99%):</span>
                        <span className="text-lg font-bold">{formatCurrency(aggregationResults.portfolio_var_99)}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="font-medium">Expected Shortfall:</span>
                        <span className="text-lg font-bold">
                          {formatCurrency(aggregationResults.expected_shortfall_95)}
                        </span>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Diversification Analysis</CardTitle>
                      <CardDescription>Portfolio diversification benefits</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">Diversification Ratio:</span>
                        <span className="text-lg font-bold text-blue-600">
                          {aggregationResults.diversification_ratio.toFixed(3)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="font-medium">Correlation Benefit:</span>
                        <span className="text-lg font-bold text-green-600">
                          {formatCurrency(aggregationResults.correlation_benefit)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="font-medium">Concentration Index:</span>
                        <span className="text-lg font-bold">{aggregationResults.concentration_index.toFixed(3)}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="font-medium">Simulation Runs:</span>
                        <span className="text-lg font-bold">{aggregationResults.simulation_runs.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="font-medium">Confidence Level:</span>
                        <span className="text-lg font-bold">
                          {formatPercentage(aggregationResults.confidence_interval)}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ) : (
                <Card>
                  <CardContent className="p-6">
                    <div className="text-center">
                      <Calculator className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-700 mb-2">No Aggregation Results</h3>
                      <p className="text-sm text-gray-500 mb-4">
                        Run Monte Carlo simulation to generate portfolio aggregation results
                      </p>
                      <Button onClick={runMonteCarloSimulation} disabled={calculating}>
                        {calculating ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Running...
                          </>
                        ) : (
                          <>
                            <Zap className="mr-2 h-4 w-4" />
                            Run Simulation
                          </>
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="contributions" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Risk Contributions</CardTitle>
                  <CardDescription>Individual risk contributions to portfolio risk</CardDescription>
                </CardHeader>
                <CardContent>
                  {riskContributions.length > 0 ? (
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Risk</TableHead>
                            <TableHead>Standalone ALE</TableHead>
                            <TableHead>Marginal Contribution</TableHead>
                            <TableHead>Component Contribution</TableHead>
                            <TableHead>Percentage Contribution</TableHead>
                            <TableHead>Portfolio ALE</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {riskContributions.map((contribution) => (
                            <TableRow key={contribution.risk_id}>
                              <TableCell className="font-medium">{contribution.risk_title}</TableCell>
                              <TableCell>{formatCurrency(contribution.standalone_ale)}</TableCell>
                              <TableCell>{formatCurrency(contribution.marginal_contribution)}</TableCell>
                              <TableCell>{formatCurrency(contribution.component_contribution)}</TableCell>
                              <TableCell>
                                <div className="flex items-center space-x-2">
                                  <Progress value={contribution.percentage_contribution * 100} className="w-16" />
                                  <span>{formatPercentage(contribution.percentage_contribution)}</span>
                                </div>
                              </TableCell>
                              <TableCell>{formatCurrency(contribution.portfolio_ale)}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <PieChart className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500">No risk contribution data available</p>
                      <p className="text-sm text-gray-400">Run Monte Carlo simulation to generate contributions</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="correlations" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Risk Correlations</CardTitle>
                  <CardDescription>Correlation coefficients between portfolio risks</CardDescription>
                </CardHeader>
                <CardContent>
                  {correlations.length > 0 ? (
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Risk 1</TableHead>
                            <TableHead>Risk 2</TableHead>
                            <TableHead>Correlation</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead>Confidence</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {correlations.map((correlation) => (
                            <TableRow key={correlation.id}>
                              <TableCell>{correlation.risk_1_title || `Risk ${correlation.risk_1_id}`}</TableCell>
                              <TableCell>{correlation.risk_2_title || `Risk ${correlation.risk_2_id}`}</TableCell>
                              <TableCell>
                                <Badge
                                  variant={
                                    correlation.correlation_coefficient > 0.5
                                      ? "destructive"
                                      : correlation.correlation_coefficient > 0.2
                                        ? "default"
                                        : "secondary"
                                  }
                                >
                                  {correlation.correlation_coefficient.toFixed(3)}
                                </Badge>
                              </TableCell>
                              <TableCell className="capitalize">{correlation.correlation_type}</TableCell>
                              <TableCell>{formatPercentage(correlation.confidence_level)}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Activity className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500">No correlation data available</p>
                      <p className="text-sm text-gray-400">Add correlations to improve portfolio analysis accuracy</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="items" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Portfolio Items</CardTitle>
                  <CardDescription>Risks included in this portfolio</CardDescription>
                </CardHeader>
                <CardContent>
                  {portfolioItems.length > 0 ? (
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Risk</TableHead>
                            <TableHead>Weight</TableHead>
                            <TableHead>Risk Group</TableHead>
                            <TableHead>ALE</TableHead>
                            <TableHead>Added</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {portfolioItems.map((item) => (
                            <TableRow key={item.id}>
                              <TableCell className="font-medium">{item.risk_title || `Risk ${item.risk_id}`}</TableCell>
                              <TableCell>
                                <div className="flex items-center space-x-2">
                                  <Progress value={item.weight * 100} className="w-16" />
                                  <span>{formatPercentage(item.weight)}</span>
                                </div>
                              </TableCell>
                              <TableCell>
                                <Badge variant="outline">{item.correlation_group || "Default"}</Badge>
                              </TableCell>
                              <TableCell>
                                {item.annual_loss_expectancy ? formatCurrency(item.annual_loss_expectancy) : "N/A"}
                              </TableCell>
                              <TableCell>{new Date(item.created_at).toLocaleDateString()}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Shield className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500">No risks in this portfolio</p>
                      <p className="text-sm text-gray-400">Add FAIR risks to begin portfolio analysis</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </>
      )}
    </div>
  )
}
