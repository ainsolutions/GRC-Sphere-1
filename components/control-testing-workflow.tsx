"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Calendar, Clock, FileText, AlertTriangle, CheckCircle, Plus, Eye } from "lucide-react"
import {
  createTestPlan,
  executeControlTest,
  getControlTestHistory,
  getControlTestPlans,
  scheduleControlTest,
} from "@/lib/actions/control-testing-actions"
import { toast } from "@/components/ui/use-toast"

interface ControlTestingWorkflowProps {
  control: any
  onClose?: () => void
}

export function ControlTestingWorkflow({ control, onClose }: ControlTestingWorkflowProps) {
  const [testHistory, setTestHistory] = useState([])
  const [testPlans, setTestPlans] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("history")
  const [isExecuteDialogOpen, setIsExecuteDialogOpen] = useState(false)
  const [isPlanDialogOpen, setIsPlanDialogOpen] = useState(false)
  const [isScheduleDialogOpen, setIsScheduleDialogOpen] = useState(false)

  useEffect(() => {
    if (control?.id) {
      loadTestData()
    }
  }, [control?.id])

  const loadTestData = async () => {
    setLoading(true)
    try {
      const [historyResult, plansResult] = await Promise.all([
        getControlTestHistory(control.id),
        getControlTestPlans(control.id),
      ])

      if (historyResult.success) {
        setTestHistory(historyResult.data)
      }
      if (plansResult.success) {
        setTestPlans(plansResult.data)
      }
    } catch (error) {
      console.error("Failed to load test data:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleExecuteTest = async (formData: FormData) => {
    formData.append("control_id", control.id.toString())
    const result = await executeControlTest(formData)

    if (result.success) {
      toast({
        title: "Success",
        description: "Control test executed successfully",
      })
      setIsExecuteDialogOpen(false)
      loadTestData()
    } else {
      toast({
        title: "Error",
        description: result.error,
        variant: "destructive",
      })
    }
  }

  const handleCreatePlan = async (formData: FormData) => {
    formData.append("control_id", control.id.toString())
    const result = await createTestPlan(formData)

    if (result.success) {
      toast({
        title: "Success",
        description: "Test plan created successfully",
      })
      setIsPlanDialogOpen(false)
      loadTestData()
    } else {
      toast({
        title: "Error",
        description: result.error,
        variant: "destructive",
      })
    }
  }

  const handleScheduleTest = async (formData: FormData) => {
    const scheduledDate = formData.get("scheduled_date") as string
    const testType = formData.get("test_type") as string
    const assignedTester = formData.get("assigned_tester") as string

    const result = await scheduleControlTest(control.id, scheduledDate, testType, assignedTester)

    if (result.success) {
      toast({
        title: "Success",
        description: "Control test scheduled successfully",
      })
      setIsScheduleDialogOpen(false)
    } else {
      toast({
        title: "Error",
        description: result.error,
        variant: "destructive",
      })
    }
  }

  const getTestResultBadge = (result: string) => {
    switch (result) {
      case "Pass":
        return <Badge className="bg-green-500 text-white">Pass</Badge>
      case "Fail":
        return <Badge className="bg-red-500 text-white">Fail</Badge>
      case "Partial":
        return <Badge className="bg-yellow-500 text-white">Partial</Badge>
      case "Not Applicable":
        return <Badge className="bg-gray-500 text-white">N/A</Badge>
      default:
        return <Badge variant="outline">{result}</Badge>
    }
  }

  const getEffectivenessBadge = (rating: string) => {
    switch (rating) {
      case "Effective":
        return <Badge className="bg-green-500 text-white">Effective</Badge>
      case "Partially Effective":
        return <Badge className="bg-yellow-500 text-white">Partially Effective</Badge>
      case "Ineffective":
        return <Badge className="bg-red-500 text-white">Ineffective</Badge>
      default:
        return <Badge variant="outline">{rating || "Not Rated"}</Badge>
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Control Testing Workflow</h2>
          <p className="text-muted-foreground">
            {control?.control_name} ({control?.control_id})
          </p>
        </div>
        <div className="flex space-x-2">
          <Dialog open={isScheduleDialogOpen} onOpenChange={setIsScheduleDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Calendar className="mr-2 h-4 w-4" />
                Schedule Test
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Schedule Control Test</DialogTitle>
                <DialogDescription>Schedule a future test for this control</DialogDescription>
              </DialogHeader>
              <form action={handleScheduleTest}>
                <div className="grid gap-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="scheduled_date">Scheduled Date</Label>
                    <Input id="scheduled_date" name="scheduled_date" type="date" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="test_type">Test Type</Label>
                    <Select name="test_type" required>
                      <SelectTrigger>
                        <SelectValue placeholder="Select test type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Manual">Manual Testing</SelectItem>
                        <SelectItem value="Automated">Automated Testing</SelectItem>
                        <SelectItem value="Walkthrough">Walkthrough</SelectItem>
                        <SelectItem value="Inspection">Inspection</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="assigned_tester">Assigned Tester</Label>
                    <Input id="assigned_tester" name="assigned_tester" placeholder="Enter tester name" />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setIsScheduleDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">Schedule Test</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>

          <Dialog open={isExecuteDialogOpen} onOpenChange={setIsExecuteDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <CheckCircle className="mr-2 h-4 w-4" />
                Execute Test
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Execute Control Test</DialogTitle>
                <DialogDescription>Record the results of a control test execution</DialogDescription>
              </DialogHeader>
              <form action={handleExecuteTest}>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="test_date">Test Date</Label>
                      <Input
                        id="test_date"
                        name="test_date"
                        type="date"
                        required
                        defaultValue={new Date().toISOString().split("T")[0]}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="test_plan_id">Test Plan (Optional)</Label>
                      <Select name="test_plan_id">
                        <SelectTrigger>
                          <SelectValue placeholder="Select test plan" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">No specific plan</SelectItem>
                          {testPlans.map((plan: any) => (
                            <SelectItem key={plan.id} value={plan.id.toString()}>
                              {plan.test_name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="tester_name">Tester Name</Label>
                      <Input id="tester_name" name="tester_name" required placeholder="Enter tester name" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="tester_email">Tester Email</Label>
                      <Input id="tester_email" name="tester_email" type="email" placeholder="Enter tester email" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="test_result">Test Result</Label>
                      <Select name="test_result" required>
                        <SelectTrigger>
                          <SelectValue placeholder="Select test result" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Pass">Pass</SelectItem>
                          <SelectItem value="Fail">Fail</SelectItem>
                          <SelectItem value="Partial">Partial</SelectItem>
                          <SelectItem value="Not Applicable">Not Applicable</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="effectiveness_rating">Effectiveness Rating</Label>
                      <Select name="effectiveness_rating">
                        <SelectTrigger>
                          <SelectValue placeholder="Select effectiveness" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Effective">Effective</SelectItem>
                          <SelectItem value="Partially Effective">Partially Effective</SelectItem>
                          <SelectItem value="Ineffective">Ineffective</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="test_notes">Test Notes</Label>
                    <Textarea id="test_notes" name="test_notes" placeholder="Describe the test execution..." rows={3} />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="evidence_collected">Evidence Collected</Label>
                    <Textarea
                      id="evidence_collected"
                      name="evidence_collected"
                      placeholder="List evidence collected during testing..."
                      rows={2}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="issues_identified">Issues Identified</Label>
                    <Textarea
                      id="issues_identified"
                      name="issues_identified"
                      placeholder="Describe any issues found..."
                      rows={2}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="recommendations">Recommendations</Label>
                    <Textarea
                      id="recommendations"
                      name="recommendations"
                      placeholder="Provide recommendations for improvement..."
                      rows={2}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="next_test_date">Next Test Date</Label>
                    <Input id="next_test_date" name="next_test_date" type="date" />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setIsExecuteDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">Save Test Results</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="history">Test History</TabsTrigger>
          <TabsTrigger value="plans">Test Plans</TabsTrigger>
          <TabsTrigger value="schedule">Schedule</TabsTrigger>
        </TabsList>

        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Test Execution History</CardTitle>
              <CardDescription>Historical record of all control tests</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex justify-center items-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : testHistory.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <FileText className="mx-auto h-12 w-12 mb-4" />
                  <p>No test history available</p>
                  <p className="text-sm">Execute a test to start building history</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Test Date</TableHead>
                      <TableHead>Tester</TableHead>
                      <TableHead>Result</TableHead>
                      <TableHead>Effectiveness</TableHead>
                      <TableHead>Issues</TableHead>
                      <TableHead>Next Test</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {testHistory.map((test: any) => (
                      <TableRow key={test.id}>
                        <TableCell>{new Date(test.test_date).toLocaleDateString()}</TableCell>
                        <TableCell>{test.tester_name}</TableCell>
                        <TableCell>{getTestResultBadge(test.test_result)}</TableCell>
                        <TableCell>{getEffectivenessBadge(test.effectiveness_rating)}</TableCell>
                        <TableCell>
                          {test.issues_identified ? (
                            <Badge variant="destructive">
                              <AlertTriangle className="mr-1 h-3 w-3" />
                              Issues Found
                            </Badge>
                          ) : (
                            <Badge variant="outline">No Issues</Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          {test.next_test_date ? new Date(test.next_test_date).toLocaleDateString() : "Not Set"}
                        </TableCell>
                        <TableCell>
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="plans" className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-semibold">Test Plans</h3>
              <p className="text-sm text-muted-foreground">Standardized testing procedures for this control</p>
            </div>
            <Dialog open={isPlanDialogOpen} onOpenChange={setIsPlanDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Create Test Plan
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-3xl">
                <DialogHeader>
                  <DialogTitle>Create Test Plan</DialogTitle>
                  <DialogDescription>Define a standardized testing procedure for this control</DialogDescription>
                </DialogHeader>
                <form action={handleCreatePlan}>
                  <div className="grid gap-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="test_name">Test Plan Name</Label>
                      <Input id="test_name" name="test_name" required placeholder="Enter test plan name" />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="test_description">Description</Label>
                      <Textarea
                        id="test_description"
                        name="test_description"
                        placeholder="Describe the test plan..."
                        rows={2}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="test_type">Test Type</Label>
                        <Select name="test_type" required>
                          <SelectTrigger>
                            <SelectValue placeholder="Select test type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Manual">Manual Testing</SelectItem>
                            <SelectItem value="Automated">Automated Testing</SelectItem>
                            <SelectItem value="Walkthrough">Walkthrough</SelectItem>
                            <SelectItem value="Inspection">Inspection</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="test_frequency">Test Frequency</Label>
                        <Select name="test_frequency" required>
                          <SelectTrigger>
                            <SelectValue placeholder="Select frequency" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Monthly">Monthly</SelectItem>
                            <SelectItem value="Quarterly">Quarterly</SelectItem>
                            <SelectItem value="Semi-Annually">Semi-Annually</SelectItem>
                            <SelectItem value="Annually">Annually</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="test_procedures">Test Procedures</Label>
                      <Textarea
                        id="test_procedures"
                        name="test_procedures"
                        required
                        placeholder="Detailed step-by-step testing procedures..."
                        rows={4}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="expected_evidence">Expected Evidence</Label>
                      <Textarea
                        id="expected_evidence"
                        name="expected_evidence"
                        placeholder="What evidence should be collected..."
                        rows={2}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="test_criteria">Pass/Fail Criteria</Label>
                      <Textarea
                        id="test_criteria"
                        name="test_criteria"
                        placeholder="Define what constitutes a pass or fail..."
                        rows={2}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="assigned_tester">Default Assigned Tester</Label>
                      <Input id="assigned_tester" name="assigned_tester" placeholder="Enter default tester name" />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="button" variant="outline" onClick={() => setIsPlanDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button type="submit">Create Test Plan</Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid gap-4">
            {testPlans.length === 0 ? (
              <Card>
                <CardContent className="text-center py-8">
                  <FileText className="mx-auto h-12 w-12 mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground">No test plans created</p>
                  <p className="text-sm text-muted-foreground">Create a test plan to standardize testing procedures</p>
                </CardContent>
              </Card>
            ) : (
              testPlans.map((plan: any) => (
                <Card key={plan.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{plan.test_name}</CardTitle>
                        <CardDescription>{plan.test_description}</CardDescription>
                      </div>
                      <div className="flex space-x-2">
                        <Badge variant="outline">{plan.test_type}</Badge>
                        <Badge variant="outline">{plan.test_frequency}</Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div>
                        <Label className="text-sm font-medium">Test Procedures:</Label>
                        <p className="text-sm text-muted-foreground mt-1">{plan.test_procedures}</p>
                      </div>
                      {plan.expected_evidence && (
                        <div>
                          <Label className="text-sm font-medium">Expected Evidence:</Label>
                          <p className="text-sm text-muted-foreground mt-1">{plan.expected_evidence}</p>
                        </div>
                      )}
                      {plan.assigned_tester && (
                        <div>
                          <Label className="text-sm font-medium">Assigned Tester:</Label>
                          <p className="text-sm text-muted-foreground mt-1">{plan.assigned_tester}</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="schedule" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Testing Schedule</CardTitle>
              <CardDescription>Upcoming and scheduled tests for this control</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                <Clock className="mx-auto h-12 w-12 mb-4" />
                <p>No scheduled tests</p>
                <p className="text-sm">Use the Schedule Test button to plan future tests</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
