"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Target, BarChart3, Activity } from "lucide-react"
import Link from "next/link"
import { PortfolioRiskAggregation } from "@/components/portfolio-risk-aggregation"

export default function PortfolioAnalysisPage() {
  return (
    <div>
      {/* Header */}
      <div className="bg-white border-b dark:bg-gray-900 rounded-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Link href="/risks/fair">
                <Button size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to FAIR Analysis
                </Button>
              </Link>
              <div className="h-6 border-l border-gray-300" />
              <div>
                <h1 className="text-xl font-semibold">Portfolio Risk Aggregation</h1>
                <p className="text-sm text-gray-500">
                  Advanced portfolio-level risk analysis with Monte Carlo simulation
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-1 text-sm text-gray-500">
                <Target className="h-4 w-4" />
                <span>Portfolio Analysis</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto pt-8">
        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-600 text-sm font-medium">Portfolio Aggregation</p>
                  <p className="text-blue-900 text-lg font-semibold">Monte Carlo Simulation</p>
                  <p className="text-blue-700 text-xs mt-1">10,000+ simulation runs</p>
                </div>
                <BarChart3 className="h-10 w-10 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-600 text-sm font-medium">Risk Correlations</p>
                  <p className="text-green-900 text-lg font-semibold">Diversification Benefits</p>
                  <p className="text-green-700 text-xs mt-1">Correlation analysis</p>
                </div>
                <Activity className="h-10 w-10 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-600 text-sm font-medium">Advanced Metrics</p>
                  <p className="text-purple-900 text-lg font-semibold">VaR & Expected Shortfall</p>
                  <p className="text-purple-700 text-xs mt-1">95% & 99% confidence</p>
                </div>
                <Target className="h-10 w-10 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Portfolio Analysis Component */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Portfolio Risk Analysis
            </CardTitle>
            <CardDescription>
              Comprehensive portfolio-level risk aggregation with correlation analysis and Monte Carlo simulation
            </CardDescription>
          </CardHeader>
          <CardContent>
            <PortfolioRiskAggregation />
          </CardContent>
        </Card>

        {/* Information Section */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>About Portfolio Aggregation</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">Monte Carlo Simulation</h4>
                <p className="text-sm">
                  Uses advanced Monte Carlo simulation with 10,000+ runs to model portfolio risk distributions,
                  accounting for correlations between individual risks.
                </p>
              </div>
              <div>
                <h4 className="font-medium mb-2">Diversification Benefits</h4>
                <p className="text-sm">
                  Calculates the reduction in portfolio risk due to diversification effects, showing how risk
                  correlations impact overall portfolio exposure.
                </p>
              </div>
              <div>
                <h4 className="font-medium mb-2">Risk Contributions</h4>
                <p className="text-sm">
                  Analyzes marginal and component contributions of each risk to the overall portfolio, helping identify
                  concentration risks and optimization opportunities.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Key Metrics Explained</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">Value at Risk (VaR)</h4>
                <p className="text-sm">
                  The maximum expected loss over a specific time period at a given confidence level (95% or 99%).
                </p>
              </div>
              <div>
                <h4 className="font-medium mb-2">Expected Shortfall</h4>
                <p className="text-sm">
                  The expected loss given that the loss exceeds the VaR threshold, providing insight into tail risk.
                </p>
              </div>
              <div>
                <h4 className="font-medium mb-2">Concentration Index</h4>
                <p className="text-sm">
                  Measures how concentrated the portfolio risk is across individual risks, with higher values indicating
                  more concentration.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
