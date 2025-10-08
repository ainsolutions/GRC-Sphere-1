"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Settings, Shield, Target, Calendar, CheckCircle, Plus } from "lucide-react"
import { toast } from "sonner"

interface TreatmentPlan {
  id: number
  riskId: string
  title: string
  description: string
  strategy: string
  priority: string
  status: string
  progress: number
  assignedTo: string
  dueDate: string
  estimatedCost: number
  controls: string[]
  createdAt: string
}

export function SphereAiRiskTreatmentPlan() {
  const [treatmentPlans, setTreatmentPlans] = useState<TreatmentPlan[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedPlan, setSelectedPlan] = useState<TreatmentPlan | null>(null)
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [activeTab, setActiveTab] = useState("active")

  useEffect(() => {
    fetchTreatmentPlans()
  }, [])

  const fetchTreatmentPlans = async () => {
    setLoading(true)
    try {
      // Mock data for demo
      const mockPlans: TreatmentPlan[] = [
        {
          id: 1,
          riskId: "SAR-0001",
          title: "Cloud Infrastructure Security Enhancement",
          description: "Implement comprehensive security measures for cloud infrastructure",
          strategy: "Mitigate",
          priority: "Critical",
          status: "In Progress",
          progress: 65,
          assignedTo: "Security Team",
          dueDate: "2024-03-15",
          estimatedCost: 50000,
          controls: ["Multi-factor Authentication", "Network Segmentation", "Continuous Monitoring"],
          createdAt: "2024-01-15T10:30:00Z",
        },
        {
          id: 2,
          riskId: "SAR-0002",
          title: "Data Encryption Protocol Upgrade",
          description: "Upgrade encryption protocols across all data storage systems",
          strategy: "Mitigate",
          priority: "High",
          status: "Planning",
          progress: 25,
          assignedTo: "IT Operations",
          dueDate: "2024-04-30",
          estimatedCost: 25000,
          controls: ["Advanced Encryption", "Key Management", "Access Controls"],
          createdAt: "2024-01-14T15:45:00Z",
        },
        {
          id: 3,
          riskId: "SAR-0003",
          title: "Third-party API Security Review",
          description: "Comprehensive security assessment of all third-party integrations",
          strategy: "Accept",
          priority: "Medium",
          status: "Completed",
          progress: 100,
          assignedTo: "DevSecOps Team",
          dueDate: "2024-02-28",
          estimatedCost: 15000,
          controls: ["API Security Testing", "Vendor Assessment", "Contract Updates"],
          createdAt: "2024-01-13T09:20:00Z",
        },
      ]
      setTreatmentPlans(mockPlans)
    } catch (error) {
      console.error("Error fetching treatment plans:", error)
      toast.error("Failed to fetch treatment plans")
    } finally {
      setLoading(false)
    }
  }

  const getStrategyColor = (strategy: string) => {
    switch (strategy) {
      case "Mitigate":
        return "bg-blue-500/20"
      case "Accept":
        return "bg-green-500/20"
      case "Transfer":
        return "bg-purple-500/20"
      case "Avoid":
        return "bg-red-500/20"
      default:
        return "bg-slate-500/20"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "Critical":
        return "bg-red-500/20"
      case "High":
        return "bg-orange-500/20"
      case "Medium":
        return "bg-yellow-500/20"
      case "Low":
        return "bg-green-500/20"
      default:
        return "bg-slate-500/20"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Planning":
        return "bg-slate-500/20"
      case "In Progress":
        return "bg-blue-500/20"
      case "Completed":
        return "bg-green-500/20"
      case "On Hold":
        return "bg-yellow-500/20"
      default:
        return "bg-slate-500/20"
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount)
  }

  const filterPlansByStatus = (status: string) => {
    switch (status) {
      case "active":
        return treatmentPlans.filter((plan) => ["Planning", "In Progress"].includes(plan.status))
      case "completed":
        return treatmentPlans.filter((plan) => plan.status === "Completed")
      case "all":
        return treatmentPlans
      default:
        return treatmentPlans
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2 ">
                <Settings className="h-6 w-6 text-blue-400" />
                Risk Treatment Plans
              </CardTitle>
              <CardDescription>
                Manage and track risk mitigation strategies and implementation progress
              </CardDescription>
            </div>
            <Button
              onClick={() => setShowCreateDialog(true)}
            >
              <Plus className="h-4 w-4 mr-2" />
              New Treatment Plan
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Treatment Plans Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger
            value="active"
          >
            Active Plans ({filterPlansByStatus("active").length})
          </TabsTrigger>
          <TabsTrigger
            value="completed"
          >
            Completed ({filterPlansByStatus("completed").length})
          </TabsTrigger>
          <TabsTrigger
            value="all"
          >
            All Plans ({treatmentPlans.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="space-y-4">
          {loading ? (
            <div className="text-center py-12">
              <Settings className="h-8 w-8 animate-pulse text-blue-400 mx-auto mb-2" />
              <span>Loading treatment plans...</span>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filterPlansByStatus(activeTab).map((plan) => (
                <Card
                  key={plan.id}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <CardTitle className="text-lg ">{plan.title}</CardTitle>
                        <div className="flex items-center gap-2">
                          <Badge
                            variant="outline"
                          >
                            {plan.riskId}
                          </Badge>
                          <Badge variant="outline" className={getStrategyColor(plan.strategy)}>{plan.strategy}</Badge>
                        </div>
                      </div>
                      <Badge variant="outline" className={getPriorityColor(plan.priority)}>{plan.priority}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm">{plan.description}</p>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Progress</span>
                        <span className="font-semibold">{plan.progress}%</span>
                      </div>
                      <Progress value={plan.progress} className="h-2" />
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <Label>Status</Label>
                        <Badge variant="outline" className={`${getStatusColor(plan.status)} mt-1`}>{plan.status}</Badge>
                      </div>
                      <div>
                        <Label>Due Date</Label>
                        <p className="mt-1">{formatDate(plan.dueDate)}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <Label>Assigned To</Label>
                        <p className="mt-1">{plan.assignedTo}</p>
                      </div>
                      <div>
                        <Label>Estimated Cost</Label>
                        <p className="mt-1">{formatCurrency(plan.estimatedCost)}</p>
                      </div>
                    </div>

                    <div>
                      <Label className="text-sm">Controls</Label>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {plan.controls.map((control, index) => (
                          <Badge
                            key={index}
                            variant="outline"
                          >
                            {control}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="flex justify-end gap-2 pt-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedPlan(plan)}
                      >
                        View Details
                      </Button>
                      <Button size="sm">
                        Update Progress
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Treatment Plan Details Dialog */}
      <Dialog open={!!selectedPlan} onOpenChange={() => setSelectedPlan(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5 text-blue-400" />
              Treatment Plan Details
            </DialogTitle>
            <DialogDescription>
              Comprehensive view of the risk treatment plan and implementation status
            </DialogDescription>
          </DialogHeader>

          {selectedPlan && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardContent className="p-4 text-center">
                    <Shield className="h-8 w-8 text-blue-400 mx-auto mb-2" />
                    <div className="text-2xl font-bold ">{selectedPlan.progress}%</div>
                    <div className="text-sm ">Completion</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <Calendar className="h-8 w-8 text-green-400 mx-auto mb-2" />
                    <div className="text-lg font-bold ">{formatDate(selectedPlan.dueDate)}</div>
                    <div className="text-sm ">Due Date</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <Target className="h-8 w-8 text-purple-400 mx-auto mb-2" />
                    <div className="text-lg font-bold ">{formatCurrency(selectedPlan.estimatedCost)}</div>
                    <div className="text-sm ">Budget</div>
                  </CardContent>
                </Card>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label>Risk ID</Label>
                    <p className="text-blue-400 font-mono">{selectedPlan.riskId}</p>
                  </div>
                  <div>
                    <Label>Title</Label>
                    <p className="font-semibold">{selectedPlan.title}</p>
                  </div>
                  <div>
                    <Label>Description</Label>
                    <p>{selectedPlan.description}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Strategy</Label>
                      <Badge className={`${getStrategyColor(selectedPlan.strategy)} mt-1`}>
                        {selectedPlan.strategy}
                      </Badge>
                    </div>
                    <div>
                      <Label>Priority</Label>
                      <Badge className={`${getPriorityColor(selectedPlan.priority)} mt-1`}>
                        {selectedPlan.priority}
                      </Badge>
                    </div>
                  </div>
                  <div>
                    <Label>Status</Label>
                    <Badge className={`${getStatusColor(selectedPlan.status)} mt-1`}>{selectedPlan.status}</Badge>
                  </div>
                  <div>
                    <Label>Assigned To</Label>
                    <p>{selectedPlan.assignedTo}</p>
                  </div>
                </div>
              </div>

              <div>
                <Label>Security Controls</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
                  {selectedPlan.controls.map((control, index) => (
                    <div key={index} className="flex items-center gap-2 p-2 rounded-lg">
                      <CheckCircle className="h-4 w-4 text-green-400 flex-shrink-0" />
                      <span>{control}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-slate-600/30">
                <Button
                  variant="outline"
                  onClick={() => setSelectedPlan(null)}
                >
                  Close
                </Button>
                <Button>Edit Plan</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Create Treatment Plan Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5 text-blue-400" />
              Create New Treatment Plan
            </DialogTitle>
            <DialogDescription>
              Define a comprehensive risk treatment strategy and implementation plan
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Risk ID</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select risk" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="SAR-0001">SAR-0001</SelectItem>
                    <SelectItem value="SAR-0002">SAR-0002</SelectItem>
                    <SelectItem value="SAR-0003">SAR-0003</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Strategy</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select strategy" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Mitigate">Mitigate</SelectItem>
                    <SelectItem value="Accept">Accept</SelectItem>
                    <SelectItem value="Transfer">Transfer</SelectItem>
                    <SelectItem value="Avoid">Avoid</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label>Treatment Plan Title</Label>
              <Input
                placeholder="Enter treatment plan title..."
              />
            </div>

            <div>
              <Label>Description</Label>
              <Textarea
                placeholder="Describe the treatment approach and objectives..."
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Priority</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Critical">Critical</SelectItem>
                    <SelectItem value="High">High</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="Low">Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Assigned To</Label>
                <Input
                  placeholder="Team or individual..."
                  />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Due Date</Label>
                <Input type="date" />
              </div>
              <div>
                <Label>Estimated Cost</Label>
                <Input
                  type="number"
                  placeholder="0"
                  />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button
                variant="outline"
                onClick={() => setShowCreateDialog(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={() => {
                  toast.success("Treatment plan created successfully")
                  setShowCreateDialog(false)
                }}
              >
                Create Plan
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
