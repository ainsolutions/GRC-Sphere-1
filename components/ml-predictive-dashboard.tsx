"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Brain,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Shield,
  Activity,
  Target,
  BarChart3,
  RefreshCw,
  Download,
  Eye,
  Zap,
  CheckCircle,
  XCircle,
  Clock,
  Users,
  Database,
  Cpu,
  Lightbulb,
  PieChart,
  LineChart,
  BarChart,
  ScatterChart,
  Layers,
  ChevronRight,
  Info,
  ArrowUpRight,
  AlertOctagon,
  CheckSquare,
  Minus,
  Plus,
} from "lucide-react"
import { format } from "date-fns"

interface MLAnalysisResult {
  success?: boolean
  analysis?: {
    timestamp: string
    predictions: {
      [key: string]: {
        prediction: number
        probabilities?: number[]
        confidence: number
        error?: string
      }
    }
    insights: {
      risk_assessment: {
        level: string
        color: string
      }
      recommendations: string[]
      trends: {
        [key: string]: string
      }
      alerts: string[]
    }
    advanced_insights?: {
      risk_drivers: {
        top_risk_categories: { [key: string]: number }
        remediation_effectiveness: number
        aging_risks: number
        overdue_critical_risks: number
      }
      predictive_reasoning: {
        [key: string]: {
          primary_factors: string[]
          contributing_elements: string[]
          confidence_factors: string[]
          uncertainty_sources: string[]
          recommended_actions: string[]
        }
      }
      mitigation_priorities: Array<{
        priority: string
        action: string
        impact: string
        timeline: string
      }>
      emerging_patterns: string[]
      comparative_analysis: any
      forecasting: any
    }
    visualization_data?: {
      risk_distribution: {
        labels: string[]
        values: number[]
        colors: string[]
      }
      vulnerability_distribution: {
        labels: string[]
        values: number[]
        colors: string[]
      }
      prediction_confidence: {
        [key: string]: {
          confidence: number
          uncertainty: number
          prediction: number
        }
      }
      performance_metrics: {
        overall_health_score: number
        risk_trend: string
        compliance_trend: string
        incident_trend: string
      }
    }
    correlation_analysis?: {
      correlation_matrix: any
      significant_correlations: Array<{
        factor1: string
        factor2: string
        correlation: number
        strength: string
      }>
      key_insights: string[]
    }
    uncertainty_analysis?: {
      [key: string]: {
        confidence_level: number
        uncertainty_range: number
        prediction_interval: number[]
        confidence_interpretation: string
        recommendations: string[]
      }
    }
    trend_analysis?: {
      historical_data: {
        [key: string]: number[]
        time_labels: string[]
      }
      trend_analysis: {
        [key: string]: {
          values: number[]
          direction: string
          change_percentage: number
        }
      }
      forecast_periods: number
      forecast_confidence: number
    }
    feature_summary: {
      total_risks: number
      open_risks: number
      open_incidents: number
      open_vulnerabilities: number
      overdue_items: number
      compliance_score: number
      remediated_risks: number
      critical_vulnerabilities: number
      incident_resolution_rate: number
      avg_cvss_score: number
    }
    model_performance: {
      models_trained: number
      available_predictions: string[]
      mode: string
      feature_count: number
      training_samples: number
    }
    analysis_metadata: {
      data_tables_processed: number
      total_records_processed: number
      analysis_duration_seconds: number
      ml_algorithms_used: string[]
    }
  }
  error?: string
  metadata?: {
    executed_at: string
    execution_time: string
    demo_mode: boolean
    mode_description: string
  }
}

export function MLPredictiveDashboard() {
  const [analysisResult, setAnalysisResult] = useState<MLAnalysisResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)

  useEffect(() => {
    // Load analysis on component mount
    runAnalysis()
  }, [])

  const runAnalysis = async () => {
    setLoading(true)
    setError(null)

    try {
      console.log("🚀 Running ML Analysis...")
      const response = await fetch('/api/ml-analysis', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      const data = await response.json()

      if (response.ok && data.success) {
        setAnalysisResult(data)
        setLastUpdated(new Date())
        console.log("✅ ML Analysis completed successfully")
      } else {
        throw new Error(data.error || 'Analysis failed')
      }
    } catch (err) {
      console.error('ML Analysis Error:', err)
      setError(err instanceof Error ? err.message : 'Analysis failed')
      setAnalysisResult(null)
    } finally {
      setLoading(false)
    }
  }

  const getRiskColor = (level: string) => {
    switch (level.toLowerCase()) {
      case 'critical': return 'text-red-600 bg-red-50 border-red-200'
      case 'high': return 'text-orange-600 bg-orange-50 border-orange-200'
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200'
      case 'low': return 'text-green-600 bg-green-50 border-green-200'
      default: return 'text-gray-600 bg-gray-50 border-gray-200'
    }
  }

  const getRiskIcon = (level: string) => {
    switch (level.toLowerCase()) {
      case 'critical': return <XCircle className="h-5 w-5 text-red-600" />
      case 'high': return <AlertTriangle className="h-5 w-5 text-orange-600" />
      case 'medium': return <Clock className="h-5 w-5 text-yellow-600" />
      case 'low': return <CheckCircle className="h-5 w-5 text-green-600" />
      default: return <Shield className="h-5 w-5 text-gray-600" />
    }
  }

  const formatPrediction = (prediction: number, type: string) => {
    if (type.includes('likelihood')) {
      return `${(prediction * 100).toFixed(1)}%`
    }
    return prediction.toFixed(1)
  }

  const getPredictionStatus = (prediction: number, type: string) => {
    if (type.includes('likelihood')) {
      if (prediction > 0.7) return { status: 'High', color: 'text-red-600', bgColor: 'bg-red-50' }
      if (prediction > 0.4) return { status: 'Medium', color: 'text-yellow-600', bgColor: 'bg-yellow-50' }
      return { status: 'Low', color: 'text-green-600', bgColor: 'bg-green-50' }
    } else {
      if (prediction > 70) return { status: 'Critical', color: 'text-red-600', bgColor: 'bg-red-50' }
      if (prediction > 40) return { status: 'High', color: 'text-orange-600', bgColor: 'bg-orange-50' }
      return { status: 'Normal', color: 'text-green-600', bgColor: 'bg-green-50' }
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Running ML Analysis</h3>
          <p className="text-gray-500">Processing predictive models...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-4">
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            {error}
          </AlertDescription>
        </Alert>
        <Button onClick={runAnalysis} className="w-full">
          <RefreshCw className="h-4 w-4 mr-2" />
          Retry Analysis
        </Button>
      </div>
    )
  }

  if (!analysisResult?.analysis) {
    return (
      <div className="space-y-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <Brain className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-700 mb-2">No Analysis Data</h3>
              <p className="text-gray-500 mb-4">Run a predictive analysis to see insights</p>
              <Button onClick={runAnalysis}>
                <Brain className="h-4 w-4 mr-2" />
                Run Analysis
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const { analysis } = analysisResult

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-2">
            <Brain className="h-8 w-8 text-blue-400" />
            AI Predictive Analysis
          </h1>
          <p className="text-gray-400 mt-1">
            Machine learning insights for risk management and compliance
          </p>
        </div>
        <div className="flex items-center gap-2">
          {lastUpdated && (
            <span className="text-sm text-gray-400">
              Last updated: {format(lastUpdated, "MMM dd, yyyy HH:mm")}
            </span>
          )}
          <Button onClick={runAnalysis} disabled={loading} variant="outline">
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>

      {/* Risk Assessment Summary */}
      {analysis.insights.risk_assessment && (
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              {getRiskIcon(analysis.insights.risk_assessment.level)}
              Overall Risk Assessment
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <Badge className={`text-white ${getRiskColor(analysis.insights.risk_assessment.level)}`}>
                  {analysis.insights.risk_assessment.level} Risk Level
                </Badge>
                <p className="text-gray-400 mt-2">
                  Based on current risk indicators and predictive models
                </p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-white">
                  {analysis.feature_summary?.open_risks || 0}
                </div>
                <div className="text-sm text-gray-400">Open Risks</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
               <CardTitle>Open Risks</CardTitle>
                <p className="text-2xl font-bold text-blue-600">
                  {analysis.feature_summary?.open_risks || 0}
                </p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-400" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Open Incidents</CardTitle>
                <p className="text-2xl font-bold text-orange-600">
                  {analysis.feature_summary?.open_incidents || 0}
                </p>
              </div>
              <Activity className="h-8 w-8 text-orange-400" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Open Vulnerabilities</CardTitle>
                <p className="text-2xl font-bold text-yellow-600">
                  {analysis.feature_summary?.open_vulnerabilities || 0}
                </p>
              </div>
              <Shield className="h-8 w-8 text-yellow-400" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Overdue Items</CardTitle>
                <p className="text-2xl font-bold text-purple-600">
                  {analysis.feature_summary?.overdue_items || 0}
                </p>
              </div>
              <Clock className="h-8 w-8 text-purple-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Analysis Tabs */}
      <Tabs defaultValue="predictions" className="space-y-4">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="predictions">
            <Target className="h-6 w-6 mr-2" />
            Predictions
          </TabsTrigger>
          <TabsTrigger value="insights">
            <Zap className="h-6 w-6 mr-2" />
            Insights
          </TabsTrigger>
          <TabsTrigger value="visualizations">
            <BarChart className="h-6 w-6 mr-2" />
            Visualizations
          </TabsTrigger>
          <TabsTrigger value="reasoning">
            <Lightbulb className="h-6 w-6 mr-2" />
            AI Reasoning
          </TabsTrigger>
          <TabsTrigger value="correlations">
            <ScatterChart className="h-6 w-6 mr-2" />
            Correlations
          </TabsTrigger>
          <TabsTrigger value="performance">
            <BarChart3 className="h-6 w-6 mr-2" />
            Performance
          </TabsTrigger>
        </TabsList>

        <TabsContent value="predictions" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Object.entries(analysis.predictions || {}).map(([metric, data]) => {
              if (data.error) {
                return (
                  <Card key={metric} className="bg-slate-800 border-slate-700">
                    <CardHeader>
                      <CardTitle className="text-white capitalize">
                        {metric.replace('_', ' ')}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Alert variant="destructive">
                        <AlertDescription>{data.error}</AlertDescription>
                      </Alert>
                    </CardContent>
                  </Card>
                )
              }

              const prediction = data.prediction
              const status = getPredictionStatus(prediction, metric)

              return (
                <Card key={metric}>
                  <CardHeader>
                    <CardTitle className="font-semibold capitalize flex items-center justify-between">
                      {metric.replace('_', ' ')}
                      <Badge className={`${status.color} ${status.bgColor}`}>
                        {status.status}
                      </Badge>
                    </CardTitle>
                    <CardDescription>
                      ML Prediction with {Math.round(data.confidence * 100)}% confidence
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="text-center">
                      <div className="text-4xl font-bold text-red-600 mb-2">
                        {formatPrediction(prediction, metric)}
                      </div>
                      <Progress
                        value={metric.includes('likelihood') ? prediction * 100 : prediction}
                        className="w-full"
                      />
                    </div>

                    {data.probabilities && (
                      <div className="space-y-2">
                        <p className="text-sm text-gray-400">Probability Distribution:</p>
                        <div className="flex justify-between text-xs">
                          <span>Low: {(data.probabilities[0] * 100).toFixed(1)}%</span>
                          <span>High: {(data.probabilities[1] * 100).toFixed(1)}%</span>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </TabsContent>

        <TabsContent value="visualizations" className="space-y-6">
          {/* Risk Distribution Chart */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {analysis.visualization_data?.risk_distribution && (
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <PieChart className="h-5 w-5 text-blue-400" />
                    Risk Distribution
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {analysis.visualization_data.risk_distribution.labels.map((label, index) => (
                      <div key={label} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div
                            className="w-4 h-4 rounded"
                            style={{ backgroundColor: analysis.visualization_data!.risk_distribution.colors[index] }}
                          />
                          <span className="text-white capitalize">{label}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="text-white font-semibold">
                            {analysis.visualization_data!.risk_distribution.values[index]}
                          </div>
                          <div className="w-20 bg-slate-700 rounded-full h-2">
                            <div
                              className="h-2 rounded-full"
                              style={{
                                width: `${(analysis.visualization_data!.risk_distribution.values[index] /
                                  Math.max(...analysis.visualization_data!.risk_distribution.values)) * 100}%`,
                                backgroundColor: analysis.visualization_data!.risk_distribution.colors[index]
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {analysis.visualization_data?.vulnerability_distribution && (
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <BarChart className="h-5 w-5 text-red-400" />
                    Vulnerability Distribution
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {analysis.visualization_data.vulnerability_distribution.labels.map((label, index) => (
                      <div key={label} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div
                            className="w-4 h-4 rounded"
                            style={{ backgroundColor: analysis.visualization_data!.vulnerability_distribution.colors[index] }}
                          />
                          <span className="text-white capitalize">{label}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="text-white font-semibold">
                            {analysis.visualization_data!.vulnerability_distribution.values[index]}
                          </div>
                          <div className="w-20 bg-slate-700 rounded-full h-2">
                            <div
                              className="h-2 rounded-full"
                              style={{
                                width: `${(analysis.visualization_data!.vulnerability_distribution.values[index] /
                                  Math.max(...analysis.visualization_data!.vulnerability_distribution.values)) * 100}%`,
                                backgroundColor: analysis.visualization_data!.vulnerability_distribution.colors[index]
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Trend Analysis */}
          {analysis.trend_analysis && (
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <LineChart className="h-5 w-5 text-green-400" />
                  Historical Trends (6 Months)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {Object.entries(analysis.trend_analysis.trend_analysis || {}).map(([metric, data]) => {
                    if (metric.includes('time_labels')) return null
                    return (
                      <div key={metric} className="p-4 bg-slate-700/30 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-white text-sm capitalize">
                            {metric.replace('_trend', '').replace('_', ' ')}
                          </span>
                          {data.direction === 'increasing' ? (
                            <TrendingUp className="h-4 w-4 text-green-400" />
                          ) : data.direction === 'decreasing' ? (
                            <TrendingDown className="h-4 w-4 text-red-400" />
                          ) : (
                            <Minus className="h-4 w-4 text-yellow-400" />
                          )}
                        </div>
                        <div className="text-2xl font-bold text-white mb-1">
                          {data.change_percentage > 0 ? '+' : ''}{data.change_percentage.toFixed(1)}%
                        </div>
                        <div className="text-xs text-gray-400 capitalize">
                          {data.direction}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Performance Metrics Visualization */}
          {analysis.visualization_data?.performance_metrics && (
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Target className="h-5 w-5 text-purple-400" />
                  Overall Health Score
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center space-y-4">
                  <div className="text-6xl font-bold text-white">
                    {analysis.visualization_data.performance_metrics.overall_health_score}
                  </div>
                  <Progress
                    value={analysis.visualization_data.performance_metrics.overall_health_score}
                    className="w-full h-4"
                  />
                  <div className="grid grid-cols-3 gap-4 mt-6">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-white">
                        {analysis.visualization_data.performance_metrics.risk_trend === 'improving' ? '🟢' :
                         analysis.visualization_data.performance_metrics.risk_trend === 'needs_attention' ? '🟡' : '🔴'}
                      </div>
                      <div className="text-sm text-gray-400">Risk Trend</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-white">
                        {analysis.visualization_data.performance_metrics.compliance_trend === 'improving' ? '🟢' :
                         analysis.visualization_data.performance_metrics.compliance_trend === 'needs_attention' ? '🟡' : '🔴'}
                      </div>
                      <div className="text-sm text-gray-400">Compliance</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-white">
                        {analysis.visualization_data.performance_metrics.incident_trend === 'improving' ? '🟢' :
                         analysis.visualization_data.performance_metrics.incident_trend === 'needs_attention' ? '🟡' : '🔴'}
                      </div>
                      <div className="text-sm text-gray-400">Incidents</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="reasoning" className="space-y-6">
          {analysis.advanced_insights?.predictive_reasoning && (
            <div className="space-y-6">
              {Object.entries(analysis.advanced_insights.predictive_reasoning).map(([metric, reasoning]) => (
                <Card key={metric}>
                  <CardHeader>
                    <CardTitle className="capitalize flex items-center gap-2">
                      <Lightbulb className="h-5 w-5 text-yellow-400" />
                      {metric.replace('_', ' ')} - AI Reasoning
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {reasoning.primary_factors?.length > 0 && (
                      <div>
                          <h4 className="font-semibold mb-2 flex items-center gap-2">
                          <CheckSquare className="h-4 w-4 text-green-400" />
                          Primary Factors
                        </h4>
                        <ul className="space-y-1">
                          {reasoning.primary_factors.map((factor, index) => (
                            <li key={index} className="text-sm flex items-start gap-2">
                              <ChevronRight className="h-3 w-3 text-blue-400 mt-0.5 flex-shrink-0" />
                              {factor}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {reasoning.confidence_factors?.length > 0 && (
                      <div>
                        <h4 className="font-semibold mb-2 flex items-center gap-2">
                          <Target className="h-4 w-4 text-blue-400" />
                          Confidence Factors
                        </h4>
                        <ul className="space-y-1">
                          {reasoning.confidence_factors.map((factor, index) => (
                            <li key={index} className="text-sm flex items-start gap-2">
                              <ChevronRight className="h-3 w-3 text-blue-400 mt-0.5 flex-shrink-0" />
                              {factor}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {reasoning.recommended_actions?.length > 0 && (
                      <div>
                        <h4 className="font-semibold mb-2 flex items-center gap-2">
                          <Zap className="h-4 w-4 text-purple-400" />
                          Recommended Actions
                        </h4>
                        <ul className="space-y-1">
                          {reasoning.recommended_actions.map((action, index) => (
                            <li key={index} className="text-sm flex items-start gap-2">
                              <ChevronRight className="h-3 w-3 text-purple-400 mt-0.5 flex-shrink-0" />
                              {action}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {reasoning.uncertainty_sources?.length > 0 && (
                      <div>
                        <h4 className="font-semibold mb-2 flex items-center gap-2">
                          <AlertTriangle className="h-4 w-4 text-yellow-400" />
                          Uncertainty Sources
                        </h4>
                        <ul className="space-y-1">
                          {reasoning.uncertainty_sources.map((source, index) => (
                            <li key={index} className="text-sm flex items-start gap-2">
                              <ChevronRight className="h-3 w-3 text-yellow-400 mt-0.5 flex-shrink-0" />
                              {source}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Mitigation Priorities */}
          {analysis.advanced_insights?.mitigation_priorities?.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertOctagon className="h-5 w-5 text-red-400" />
                  Mitigation Priorities
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analysis.advanced_insights.mitigation_priorities.map((priority, index) => (
                    <div key={index}>
                      <div className="flex items-center justify-between mb-3">
                        <Badge className={
                          priority.priority === 'CRITICAL' ? 'bg-red-500 text-white' :
                          priority.priority === 'HIGH' ? 'bg-orange-500 text-white' :
                          'bg-yellow-500 text-white'
                        }>
                          {priority.priority}
                        </Badge>
                        <span className="text-sm">{priority.timeline}</span>
                      </div>
                      <h4 className="font-medium mb-2">{priority.action}</h4>
                      <p className="text-sm">Impact: {priority.impact}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="correlations" className="space-y-6">
          {/* Correlation Matrix */}
          {analysis.correlation_analysis?.significant_correlations?.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ScatterChart className="h-5 w-5 text-cyan-400" />
                  Significant Correlations
                </CardTitle>
                <CardDescription>
                  Key relationships between risk factors
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analysis.correlation_analysis.significant_correlations.map((corr, index) => (
                    <div key={index}>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">
                            {corr.factor1.replace('_', ' ')}
                          </span>
                          <span className="text-gray-400">vs</span>
                          <span className="font-medium">
                            {corr.factor2.replace('_', ' ')}
                          </span>
                        </div>
                        <Badge className={
                          corr.strength === 'Strong' ? 'bg-red-500 text-white' :
                          corr.strength === 'Moderate' ? 'bg-yellow-500 text-white' :
                          'bg-green-500 text-white'
                        }>
                          {corr.strength}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4">
                          <div className="text-sm">
                          Correlation: {corr.correlation > 0 ? '+' : ''}{(corr.correlation * 100).toFixed(1)}%
                        </div>
                        <div className="flex-1 bg-slate-600 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${
                              corr.correlation > 0 ? 'bg-green-500' : 'bg-red-500'
                            }`}
                            style={{ width: `${Math.abs(corr.correlation) * 100}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Correlation Insights */}
          {analysis.correlation_analysis?.key_insights?.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="h-5 w-5 text-yellow-400" />
                  Correlation Insights
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {analysis.correlation_analysis.key_insights.map((insight, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <Info className="h-4 w-4 text-yellow-400 mt-0.5 flex-shrink-0" />
                      <p className="text-sm">{insight}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Uncertainty Analysis */}
          {analysis.uncertainty_analysis && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-orange-400" />
                  Prediction Uncertainty Analysis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Object.entries(analysis.uncertainty_analysis).map(([metric, uncertainty]) => (
                    <div key={metric}>
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-medium capitalize">
                          {metric.replace('_', ' ')}
                        </h4>
                        <Badge className={
                          uncertainty.confidence_level > 0.8 ? 'bg-green-500 text-white' :
                          uncertainty.confidence_level > 0.6 ? 'bg-yellow-500 text-white' :
                          'bg-red-500 text-white'
                        }>
                          {uncertainty.confidence_interpretation.split(' ')[0]}
                        </Badge>
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Confidence Level:</span>
                          <span>{(uncertainty.confidence_level * 100).toFixed(1)}%</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Uncertainty Range:</span>
                          <span>{(uncertainty.uncertainty_range * 100).toFixed(1)}%</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Prediction Interval:</span>
                          <span>
                            [{uncertainty.prediction_interval[0].toFixed(1)}, {uncertainty.prediction_interval[1].toFixed(1)}]
                          </span>
                        </div>
                      </div>

                      {uncertainty.recommendations?.length > 0 && (
                        <div className="mt-3 pt-3 border-t border-slate-600">
                          <h5 className="text-sm font-medium mb-2">Recommendations:</h5>
                          <ul className="space-y-1">
                            {uncertainty.recommendations.map((rec, index) => (
                              <li key={index} className="text-xs flex items-start gap-2">
                                <ChevronRight className="h-3 w-3 text-blue-400 mt-0.5 flex-shrink-0" />
                                {rec}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="insights" className="space-y-6">
          {/* Advanced Risk Drivers */}
          {analysis.advanced_insights?.risk_drivers && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart className="h-5 w-5 text-orange-400" />
                  Risk Drivers Analysis
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Key factors influencing your risk landscape
                </CardDescription>
              </CardHeader>
             
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <div><CardTitle className="text-2xl font-bold text-orange-400 mb-2">
                      {Object.keys(analysis.advanced_insights.risk_drivers.top_risk_categories).length}</CardTitle>
                    </div>
                    <div><CardTitle>Risk Categories</CardTitle></div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-orange-400 mb-2">
                      {(analysis.advanced_insights.risk_drivers.remediation_effectiveness * 100).toFixed(1)}%
                    </div>
                    <div><CardTitle>Remediation Rate</CardTitle></div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-orange-400 mb-2">
                      {analysis.advanced_insights.risk_drivers.aging_risks}
                    </div>
                    <div><CardTitle>High/Critical Risks</CardTitle></div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-orange-400 mb-2">
                      {analysis.advanced_insights.risk_drivers.overdue_critical_risks}
                    </div>
                    <div><CardTitle>Overdue Critical</CardTitle></div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Emerging Patterns */}
          {analysis.advanced_insights?.emerging_patterns?.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ArrowUpRight className="h-5 w-5 text-purple-400" />
                  Emerging Patterns
                </CardTitle>
                <CardDescription>
                  Identified trends and patterns requiring attention
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {analysis.advanced_insights.emerging_patterns.map((pattern, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <AlertOctagon className="h-5 w-5 text-purple-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-medium mb-1">Pattern Detected</p>
                        <p className="text-gray-300 text-sm">{pattern}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Alerts */}
          {analysis.insights?.alerts?.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-red-400" />
                  Critical Alerts
                </CardTitle>
                <CardDescription>
                  Immediate attention required
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {analysis.insights.alerts.map((alert, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4 text-red-400 flex-shrink-0" />
                      <span className="text-red-300">{alert}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Recommendations */}
          {analysis.insights?.recommendations?.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-blue-400" />
                  AI Recommendations
                </CardTitle>
                <CardDescription>
                  Actionable insights from machine learning analysis
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {analysis.insights.recommendations.map((rec, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-blue-400 flex-shrink-0" />
                      <span className="text-blue-300">{rec}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="trends" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-green-400" />
                Trend Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {Object.entries(analysis.insights.trends || {}).map(([trend, status]) => (
                  <div key={trend}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="capitalize">
                        {trend.replace('_', ' ')}
                      </span>
                      {status === 'increasing' || status === 'improving' ? (
                        <TrendingUp className="h-4 w-4 text-green-400" />
                      ) : (
                        <TrendingDown className="h-4 w-4 text-red-400" />
                      )}
                    </div>
                    <Badge className={
                      status === 'increasing' || status === 'improving'
                        ? 'bg-green-500 text-white'
                        : 'bg-red-500 text-white'
                    }>
                      {status}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          {/* Analysis Metadata */}
          {analysis.analysis_metadata && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5 text-blue-400" />
                  Analysis Metadata
                </CardTitle>
                <CardDescription>
                  Technical details of the ML analysis process
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <div className="text-2xl font-bold text-orange-400 mb-2">
                      {analysis.analysis_metadata.data_tables_processed}
                    </div>
                    <div><CardTitle>Tables Processed</CardTitle></div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-orange-400 mb-2">
                      {analysis.analysis_metadata.total_records_processed}
                    </div>
                    <div><CardTitle>Records Analyzed</CardTitle></div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-orange-400 mb-2">
                      {analysis.model_performance?.feature_count || 0}
                    </div>
                    <div><CardTitle>Features Used</CardTitle></div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-orange-400 mb-2">
                      {analysis.model_performance?.training_samples || 0}
                    </div>
                    <div><CardTitle>Training Samples</CardTitle></div>
                  </div>
                </div>

                <div className="mt-6">
                  <h4 className="font-semibold mb-3">ML Algorithms Used:</h4>
                  <div className="flex flex-wrap gap-2">
                    {analysis.analysis_metadata.ml_algorithms_used.map((algorithm, index) => (
                      <Badge key={index} className="bg-purple-500 text-white">
                        {algorithm}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Model Performance Details */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Cpu className="h-5 w-5 text-purple-400" />
                  Model Performance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span>Models Trained:</span>
                    <span className="text-blue font-semibold">
                      {analysis.model_performance?.models_trained || 0}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Available Predictions:</span>
                    <span className="text-blue font-semibold">
                      {analysis.model_performance?.available_predictions?.length || 0}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Analysis Mode:</span>
                    <Badge className={
                      analysis.model_performance?.mode === 'production'
                        ? 'bg-green-500 text-white'
                        : 'bg-blue-500 text-white'
                    }>
                      {analysis.model_performance?.mode || 'unknown'}
                    </Badge>
                  </div>
                  <div>
                    <span className="block mb-2">Prediction Types:</span>
                    <div className="flex flex-wrap gap-2">
                      {analysis.model_performance?.available_predictions?.map((pred, index) => (
                        <Badge key={index} variant="outline" className="text-blue-400 border-blue-400">
                          {pred.replace('_', ' ')}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5 text-green-400" />
                  Enhanced Data Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Total Risks:</span>
                    <span className="text-blue font-semibold">{analysis.feature_summary?.total_risks || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Remediated Risks:</span>
                    <span className="text-blue font-semibold">{analysis.feature_summary?.remediated_risks || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Critical Vulnerabilities:</span>
                    <span className="text-blue font-semibold">{analysis.feature_summary?.critical_vulnerabilities || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Incident Resolution Rate:</span>
                    <span className="text-blue font-semibold">{analysis.feature_summary?.incident_resolution_rate || 0}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Avg CVSS Score:</span>
                    <span className="text-blue font-semibold">{analysis.feature_summary?.avg_cvss_score || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Data Source:</span>
                    <Badge className={
                      analysis.data_source === 'database'
                        ? 'bg-green-500 text-white'
                        : 'bg-blue-500 text-white'
                    }>
                      {analysis.data_source || 'unknown'}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Analysis Timestamp:</span>
                    <span className="text-blue text-sm">
                      {analysis.timestamp ? format(new Date(analysis.timestamp), "MMM dd, yyyy HH:mm") : "N/A"}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Prediction Confidence Dashboard */}
          {analysis.visualization_data?.prediction_confidence && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-cyan-400" />
                  Prediction Confidence Overview
                </CardTitle>
                <CardDescription>
                  Confidence levels and uncertainty analysis for all predictions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {Object.entries(analysis.visualization_data.prediction_confidence).map(([metric, confidence]) => (
                    <div key={metric}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm capitalize">
                          {metric.replace('_', ' ')}
                        </span>
                        <div className={`w-3 h-3 rounded-full ${
                          confidence.confidence > 0.8 ? 'bg-green-500' :
                          confidence.confidence > 0.6 ? 'bg-yellow-500' :
                          'bg-red-500'
                        }`} />
                      </div>
                      <div className="text-2xl font-bold text-orange-400 mb-1">
                        {(confidence.confidence * 100).toFixed(0)}%
                      </div>
                      <div className="text-xs">
                        Uncertainty: {(confidence.uncertainty * 100).toFixed(0)}%
                      </div>
                      <div className="w-full bg-slate-600 rounded-full h-1 mt-2">
                        <div
                          className="bg-blue-500 h-1 rounded-full"
                          style={{ width: `${confidence.confidence * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      {/* Footer */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div className="text-sm">
              Analysis powered by Machine Learning • Data-driven insights
            </div>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export Report
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
