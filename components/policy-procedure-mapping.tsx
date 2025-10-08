"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import {
  FileText,
  Settings,
  Link,
  Eye,
  Edit,
  Play,
  CheckCircle,
  AlertTriangle,
  BarChart3,
  Activity,
  Users,
  Clock,
  ArrowRight,
} from "lucide-react"
import { Label } from "./ui/label"

interface Policy {
  id: number
  policy_id: string
  title: string
  description: string
  status: string
  version: string
  category_name: string
  category_color: string
  procedure_count: number
  created_at: string
}

interface Procedure {
  id: number
  procedure_id: string
  title: string
  description: string
  policy_id: number
  policy_title: string
  policy_code: string
  status: string
  version: string
  execution_count: number
  completed_executions: number
  active_executions: number
  last_execution: string
  success_rate: number
}

interface PolicyProcedureMapping {
  policy: Policy
  procedures: Procedure[]
  total_executions: number
  completed_executions: number
  active_executions: number
  success_rate: number
}

export function PolicyProcedureMapping() {
  const [mappings, setMappings] = useState<PolicyProcedureMapping[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedMapping, setSelectedMapping] = useState<PolicyProcedureMapping | null>(null)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  useEffect(() => {
    fetchPolicyProcedureMappings()
  }, [])

  const fetchPolicyProcedureMappings = async () => {
    try {
      setLoading(true)

      // Fetch policies with procedure counts
      const policiesResponse = await fetch('/api/policies')
      const policiesData = await policiesResponse.json()
      const policies = Array.isArray(policiesData.policies) ? policiesData.policies : []

      // Fetch procedures
      const proceduresResponse = await fetch('/api/procedures')
      const procedures = await proceduresResponse.json()
      const proceduresArray = Array.isArray(procedures) ? procedures : []

      // Create mappings
      const mappingsMap = new Map<number, PolicyProcedureMapping>()

      // Initialize mappings for policies that have procedures
      proceduresArray.forEach((procedure: Procedure) => {
        const policy = policies.find((p: Policy) => p.id === procedure.policy_id)
        if (policy) {
          if (!mappingsMap.has(policy.id)) {
            mappingsMap.set(policy.id, {
              policy,
              procedures: [],
              total_executions: 0,
              completed_executions: 0,
              active_executions: 0,
              success_rate: 0
            })
          }
          mappingsMap.get(policy.id)!.procedures.push(procedure)
        }
      })

      // Calculate execution statistics
      const mappings = Array.from(mappingsMap.values()).map(mapping => {
        const totalExecutions = mapping.procedures.reduce((sum, proc) => sum + proc.execution_count, 0)
        const completedExecutions = mapping.procedures.reduce((sum, proc) => sum + proc.completed_executions, 0)
        const activeExecutions = mapping.procedures.reduce((sum, proc) => sum + proc.active_executions, 0)
        const successRate = totalExecutions > 0 ? Math.round((completedExecutions / totalExecutions) * 100) : 0

        return {
          ...mapping,
          total_executions: totalExecutions,
          completed_executions: completedExecutions,
          active_executions: activeExecutions,
          success_rate: successRate
        }
      })

      setMappings(mappings)
    } catch (error) {
      console.error('Error fetching policy-procedure mappings:', error)
      setMappings([])
    } finally {
      setLoading(false)
    }
  }

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      draft: { color: "bg-gray-500", label: "Draft" },
      under_review: { color: "bg-yellow-500", label: "Under Review" },
      approved: { color: "bg-blue-500", label: "Approved" },
      published: { color: "bg-green-500", label: "Published" },
      archived: { color: "bg-red-500", label: "Archived" },
    }

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.draft
    return <Badge className={`${config.color} text-white`}>{config.label}</Badge>
  }

  const getSuccessRateColor = (rate: number) => {
    if (rate >= 90) return "text-green-600"
    if (rate >= 70) return "text-yellow-600"
    return "text-red-600"
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Policy-Procedure Mapping</h2>
          <p className="text-gray-400">Comprehensive mapping between policies and their associated procedures</p>
        </div>
        <div className="flex space-x-2">
          <Button
            variant={viewMode === 'grid' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('grid')}
          >
            <BarChart3 className="h-4 w-4 mr-2" />
            Grid
          </Button>
          <Button
            variant={viewMode === 'list' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('list')}
          >
            <FileText className="h-4 w-4 mr-2" />
            List
          </Button>
        </div>
      </div>

      {/* Statistics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Total Mappings</p>
                <p className="text-2xl font-bold">{mappings.length}</p>
              </div>
              <Link className="h-8 w-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Total Procedures</p>
                <p className="text-2xl font-bold">
                  {mappings.reduce((sum, mapping) => sum + mapping.procedures.length, 0)}
                </p>
              </div>
              <Settings className="h-8 w-8 text-green-400" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Active Executions</p>
                <p className="text-2xl font-bold">
                  {mappings.reduce((sum, mapping) => sum + mapping.active_executions, 0)}
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
                <p className="text-sm font-medium">Avg Success Rate</p>
                <p className={`text-2xl font-bold ${getSuccessRateColor(
                  mappings.length > 0
                    ? Math.round(mappings.reduce((sum, mapping) => sum + mapping.success_rate, 0) / mappings.length)
                    : 0
                )}`}>
                  {mappings.length > 0
                    ? Math.round(mappings.reduce((sum, mapping) => sum + mapping.success_rate, 0) / mappings.length)
                    : 0}%
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mappings.map((mapping) => (
            <Card key={mapping.policy.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg">{mapping.policy.title}</CardTitle>
                    <CardDescription className="text-gray-400">{mapping.policy.policy_id}</CardDescription>
                  </div>
                  {getStatusBadge(mapping.policy.status)}
                </div>
                <div className="flex items-center space-x-2 mt-2">
                  <Badge style={{ backgroundColor: mapping.policy.category_color }} className="text-white">
                    {mapping.policy.category_name}
                  </Badge>
                  <span className="text-sm">v{mapping.policy.version}</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Procedures Summary */}
                <div className="border rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Procedures</span>
                    <Badge variant="secondary">{mapping.procedures.length}</Badge>
                  </div>
                  {mapping.procedures.length > 0 ? (
                    <div className="space-y-2">
                      {mapping.procedures.slice(0, 3).map((procedure) => (
                        <div key={procedure.id} className="flex items-center justify-between text-xs">
                          <span className="text-gray-300 truncate">{procedure.title}</span>
                          <div className="flex items-center space-x-1">
                            {procedure.active_executions > 0 && (
                              <Badge className="bg-blue-500 text-xs">
                                {procedure.active_executions}
                              </Badge>
                            )}
                            {getStatusBadge(procedure.status)}
                          </div>
                        </div>
                      ))}
                      {mapping.procedures.length > 3 && (
                        <div className="text-xs text-center">
                          +{mapping.procedures.length - 3} more procedures
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-xs text-center py-2">
                      No procedures linked
                    </div>
                  )}
                </div>

                {/* Execution Stats */}
                <div className="grid grid-cols-2 gap-2">
                  <div className="text-center p-2 rounded">
                    <div className="text-lg font-bold">{mapping.total_executions}</div>
                    <div className="text-xs text-gray-400">Total Executions</div>
                  </div>
                  <div className="text-center p-2 rounded">
                    <div className={`text-lg font-bold ${getSuccessRateColor(mapping.success_rate)}`}>
                      {mapping.success_rate}%
                    </div>
                    <div className="text-xs text-gray-400">Success Rate</div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex space-x-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    className="flex-1"
                    onClick={() => setSelectedMapping(mapping)}
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    View Details
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle className="text-white">Policy-Procedure Relationships</CardTitle>
            <CardDescription className="text-gray-400">
              Detailed view of all policy-procedure mappings
            </CardDescription>
          </CardHeader>
          <CardContent>
            {mappings.length === 0 ? (
              <div className="text-center py-8">
                <Link className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-400">No policy-procedure mappings found</p>
                <p className="text-gray-500 text-sm">Create procedures linked to policies to see mappings here</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow className="border-slate-700">
                    <TableHead className="text-gray-300">Policy</TableHead>
                    <TableHead className="text-gray-300">Category</TableHead>
                    <TableHead className="text-gray-300">Procedures</TableHead>
                    <TableHead className="text-gray-300">Executions</TableHead>
                    <TableHead className="text-gray-300">Success Rate</TableHead>
                    <TableHead className="text-gray-300">Status</TableHead>
                    <TableHead className="text-gray-300">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mappings.map((mapping) => (
                    <TableRow key={mapping.policy.id} className="border-slate-700">
                      <TableCell>
                        <div>
                          <div className="font-medium text-white">{mapping.policy.title}</div>
                          <div className="text-sm text-gray-400">{mapping.policy.policy_id}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge style={{ backgroundColor: mapping.policy.category_color }} className="text-white">
                          {mapping.policy.category_name}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <span className="text-white">{mapping.procedures.length}</span>
                          {mapping.procedures.length > 0 && (
                            <div className="flex space-x-1">
                              {mapping.procedures.slice(0, 3).map((_, index) => (
                                <div key={index} className="w-2 h-2 bg-blue-400 rounded-full" />
                              ))}
                              {mapping.procedures.length > 3 && (
                                <span className="text-xs text-gray-400">+{mapping.procedures.length - 3}</span>
                              )}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-white">
                          {mapping.total_executions} total
                          {mapping.active_executions > 0 && (
                            <span className="text-orange-400 ml-1">
                              ({mapping.active_executions} active)
                            </span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className={`font-medium ${getSuccessRateColor(mapping.success_rate)}`}>
                          {mapping.success_rate}%
                        </div>
                        <Progress value={mapping.success_rate} className="w-16 h-1 mt-1" />
                      </TableCell>
                      <TableCell>{getStatusBadge(mapping.policy.status)}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setSelectedMapping(mapping)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                          >
                            <ArrowRight className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      )}

      {/* Detail Modal */}
      {selectedMapping && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-slate-900 border border-slate-700 rounded-lg max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-white">Policy-Procedure Mapping Details</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedMapping(null)}
                  className="text-slate-400 hover:text-white"
                >
                  ✕
                </Button>
              </div>

              {/* Policy Info */}
              <Card className="bg-slate-800 border-slate-700 mb-4">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <FileText className="h-5 w-5 mr-2" />
                    {selectedMapping.policy.title}
                  </CardTitle>
                  <CardDescription className="text-gray-400">
                    {selectedMapping.policy.policy_id} • Version {selectedMapping.policy.version}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-gray-300">Status</Label>
                      <div className="mt-1">{getStatusBadge(selectedMapping.policy.status)}</div>
                    </div>
                    <div>
                      <Label className="text-gray-300">Category</Label>
                      <div className="mt-1">
                        <Badge style={{ backgroundColor: selectedMapping.policy.category_color }} className="text-white">
                          {selectedMapping.policy.category_name}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Procedures List */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Settings className="h-5 w-5 mr-2" />
                    Associated Procedures ({selectedMapping.procedures.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {selectedMapping.procedures.length === 0 ? (
                    <div className="text-center py-8">
                      <Settings className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-400">No procedures linked to this policy</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {selectedMapping.procedures.map((procedure) => (
                        <div key={procedure.id} className="border border-slate-600 rounded-lg p-4 bg-slate-700/30">
                          <div className="flex items-center justify-between mb-3">
                            <div>
                              <h4 className="font-medium">{procedure.title}</h4>
                              <p className="text-sm text-gray-400">{procedure.procedure_id}</p>
                            </div>
                            <div className="flex items-center space-x-2">
                              {getStatusBadge(procedure.status)}
                              {procedure.active_executions > 0 && (
                                <Badge className="bg-orange-500 text-white">
                                  {procedure.active_executions} active
                                </Badge>
                              )}
                            </div>
                          </div>

                          <div className="grid grid-cols-3 gap-4 mb-3">
                            <div className="text-center">
                              <div className="text-lg font-bold text-white">{procedure.execution_count}</div>
                              <div className="text-xs text-gray-400">Total Executions</div>
                            </div>
                            <div className="text-center">
                              <div className={`text-lg font-bold ${getSuccessRateColor(procedure.success_rate)}`}>
                                {procedure.success_rate}%
                              </div>
                              <div className="text-xs text-gray-400">Success Rate</div>
                            </div>
                            <div className="text-center">
                              <div className="text-sm text-white">
                                {procedure.last_execution
                                  ? new Date(procedure.last_execution).toLocaleDateString()
                                  : "Never"}
                              </div>
                              <div className="text-xs text-gray-400">Last Execution</div>
                            </div>
                          </div>

                          <div className="flex space-x-2">
                            <Button variant="outline" size="sm" className="text-slate-300 hover:bg-slate-600">
                              <Eye className="h-4 w-4 mr-2" />
                              View Details
                            </Button>
                            <Button variant="outline" size="sm" className="text-green-400 hover:bg-green-900/20">
                              <Play className="h-4 w-4 mr-2" />
                              Execute
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
