"use client"

import React, { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import {
  CheckCircle,
  XCircle,
  Clock,
  ArrowRight,
  User,
  Calendar,
  AlertTriangle,
  FileText
} from "lucide-react"

interface StatusWorkflowProps {
  documentId: number
  currentVersion: string
  currentStatus: string
  documentOwner: string
  approvalAuthority: string
  onStatusChange?: (newStatus: string) => void
}

interface WorkflowStep {
  id: string
  name: string
  status: 'pending' | 'in_progress' | 'completed' | 'rejected'
  assigned_to?: string
  completed_by?: string
  completed_at?: string
  comments?: string
  required: boolean
}

const WORKFLOW_STEPS = [
  {
    id: 'draft',
    name: 'Document Draft',
    description: 'Initial document creation and drafting phase',
    icon: FileText,
    color: 'bg-gray-500'
  },
  {
    id: 'review',
    name: 'Peer Review',
    description: 'Review by subject matter experts',
    icon: Clock,
    color: 'bg-blue-500'
  },
  {
    id: 'approval',
    name: 'Management Approval',
    description: 'Final approval by designated authority',
    icon: CheckCircle,
    color: 'bg-green-500'
  },
  {
    id: 'published',
    name: 'Published',
    description: 'Document is published and active',
    icon: CheckCircle,
    color: 'bg-purple-500'
  }
]

const STATUS_TRANSITIONS = {
  initial: ['draft'],
  draft: ['under_review', 'cancelled'],
  under_review: ['reviewed', 'draft'],
  reviewed: ['approved', 'draft'],
  approved: ['published', 'archived'],
  published: ['archived'],
  archived: [],
  cancelled: ['draft']
}

export function DocumentStatusWorkflow({
  documentId,
  currentVersion,
  currentStatus,
  documentOwner,
  approvalAuthority,
  onStatusChange
}: StatusWorkflowProps) {
  const { toast } = useToast()
  const [workflowSteps, setWorkflowSteps] = useState<WorkflowStep[]>([])
  const [isTransitionDialogOpen, setIsTransitionDialogOpen] = useState(false)
  const [selectedTransition, setSelectedTransition] = useState<string>('')
  const [transitionComments, setTransitionComments] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    initializeWorkflow()
  }, [currentStatus])

  const initializeWorkflow = () => {
    const steps: WorkflowStep[] = [
      {
        id: 'draft',
        name: 'Document Draft',
        status: ['initial', 'draft'].includes(currentStatus) ? 'in_progress' : 'completed',
        assigned_to: documentOwner,
        required: true,
        completed_at: ['reviewed', 'approved', 'published'].includes(currentStatus) ? new Date().toISOString() : undefined,
        completed_by: ['reviewed', 'approved', 'published'].includes(currentStatus) ? documentOwner : undefined,
        comments: 'Document created and saved as draft'
      },
      {
        id: 'review',
        name: 'Peer Review',
        status: ['under_review', 'reviewed', 'approved', 'published'].includes(currentStatus) ? 'completed' : 'pending',
        assigned_to: 'Peer Review Team',
        required: true,
        completed_at: ['reviewed', 'approved', 'published'].includes(currentStatus) ? new Date().toISOString() : undefined,
        completed_by: ['reviewed', 'approved', 'published'].includes(currentStatus) ? 'Review Team' : undefined,
        comments: 'Document reviewed by peer review team'
      },
      {
        id: 'approval',
        name: 'Management Approval',
        status: ['approved', 'published'].includes(currentStatus) ? 'completed' : 'pending',
        assigned_to: approvalAuthority,
        required: true,
        completed_at: ['approved', 'published'].includes(currentStatus) ? new Date().toISOString() : undefined,
        completed_by: ['approved', 'published'].includes(currentStatus) ? approvalAuthority : undefined,
        comments: 'Document approved by management'
      },
      {
        id: 'published',
        name: 'Published',
        status: currentStatus === 'published' ? 'completed' : 'pending',
        required: true,
        completed_at: currentStatus === 'published' ? new Date().toISOString() : undefined,
        completed_by: currentStatus === 'published' ? approvalAuthority : undefined,
        comments: 'Document published and made available to authorized users'
      }
    ]

    setWorkflowSteps(steps)
  }

  const getAvailableTransitions = () => {
    return STATUS_TRANSITIONS[currentStatus as keyof typeof STATUS_TRANSITIONS] || []
  }

  const handleStatusTransition = async () => {
    if (!selectedTransition || !transitionComments.trim()) {
      toast({
        title: "Validation Error",
        description: "Please select a status and provide comments",
        variant: "destructive"
      })
      return
    }

    try {
      setLoading(true)

      // Update document status
      const response = await fetch(`/api/governance/documents/${documentId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: selectedTransition,
          updated_by: "current-user", // Replace with actual user ID
          // Add transition comments to change history
          change_history: {
            action: `Status changed from ${currentStatus} to ${selectedTransition}`,
            comments: transitionComments,
            changed_by: "current-user", // Replace with actual user
            changed_at: new Date().toISOString()
          }
        })
      })

      const result = await response.json()

      if (result.success) {
        toast({
          title: "Success",
          description: `Document status updated to ${selectedTransition}`
        })

        setIsTransitionDialogOpen(false)
        setSelectedTransition('')
        setTransitionComments('')

        onStatusChange?.(selectedTransition)

        // Refresh workflow steps
        initializeWorkflow()
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to update status",
          variant: "destructive"
        })
      }
    } catch (error) {
      console.error("Error updating status:", error)
      toast({
        title: "Error",
        description: "Failed to update document status",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case 'in_progress':
        return <Clock className="h-5 w-5 text-blue-500" />
      case 'rejected':
        return <XCircle className="h-5 w-5 text-red-500" />
      default:
        return <AlertTriangle className="h-5 w-5 text-gray-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'border-green-500 bg-green-50 dark:bg-green-950'
      case 'in_progress':
        return 'border-blue-500 bg-blue-50 dark:bg-blue-950'
      case 'rejected':
        return 'border-red-500 bg-red-50 dark:bg-red-950'
      default:
        return 'border-gray-300 bg-gray-50 dark:bg-gray-950'
    }
  }

  const getProgressPercentage = () => {
    const completedSteps = workflowSteps.filter(step => step.status === 'completed').length
    return (completedSteps / workflowSteps.length) * 100
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Document Workflow
            </CardTitle>
            <CardDescription>
              Track the approval and publication process
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="capitalize">
              Version {currentVersion}
            </Badge>
            <Badge
              variant={currentStatus === 'approved' ? 'default' :
                     currentStatus === 'published' ? 'secondary' : 'outline'}
              className="capitalize"
            >
              {currentStatus.replace('_', ' ')}
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {/* Progress Overview */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Workflow Progress</span>
            <span className="text-sm text-gray-500">
              {workflowSteps.filter(step => step.status === 'completed').length} / {workflowSteps.length} steps completed
            </span>
          </div>
          <Progress value={getProgressPercentage()} className="h-2" />
        </div>

        {/* Workflow Steps */}
        <div className="space-y-4">
          {workflowSteps.map((step, index) => {
            const StepIcon = WORKFLOW_STEPS.find(ws => ws.id === step.id)?.icon || FileText

            return (
              <div key={step.id} className="relative">
                {/* Connection Line */}
                {index < workflowSteps.length - 1 && (
                  <div className="absolute left-6 top-12 w-0.5 h-8 bg-gray-300 dark:bg-gray-600"></div>
                )}

                <div className={`flex items-start gap-4 p-4 rounded-lg border-2 ${getStatusColor(step.status)}`}>
                  <div className="flex-shrink-0">
                    {getStatusIcon(step.status)}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <StepIcon className="h-4 w-4" />
                      <h4 className="font-medium">{step.name}</h4>
                      <Badge
                        variant={step.status === 'completed' ? 'default' :
                               step.status === 'in_progress' ? 'secondary' : 'outline'}
                        className="text-xs capitalize"
                      >
                        {step.status.replace('_', ' ')}
                      </Badge>
                    </div>

                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                      {WORKFLOW_STEPS.find(ws => ws.id === step.id)?.description}
                    </p>

                    {step.assigned_to && (
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <User className="h-4 w-4" />
                        <span>Assigned to: {step.assigned_to}</span>
                      </div>
                    )}

                    {step.completed_at && (
                      <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                        <Calendar className="h-4 w-4" />
                        <span>Completed: {new Date(step.completed_at).toLocaleDateString()}</span>
                        {step.completed_by && <span>by {step.completed_by}</span>}
                      </div>
                    )}

                    {step.comments && (
                      <div className="mt-2 p-2 bg-gray-50 dark:bg-gray-800 rounded text-sm">
                        <strong>Comments:</strong> {step.comments}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Status Transition Actions */}
        {getAvailableTransitions().length > 0 && (
          <div className="mt-6 pt-6 border-t">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Status Transition</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Move document to next status in workflow
                </p>
              </div>

              <Dialog open={isTransitionDialogOpen} onOpenChange={setIsTransitionDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <ArrowRight className="h-4 w-4 mr-2" />
                    Change Status
                  </Button>
                </DialogTrigger>

                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Change Document Status</DialogTitle>
                    <DialogDescription>
                      Update the status of version {currentVersion}
                    </DialogDescription>
                  </DialogHeader>

                  <div className="space-y-4">
                    <div>
                      <Label>Current Status</Label>
                      <Badge variant="outline" className="ml-2 capitalize">
                        {currentStatus.replace('_', ' ')}
                      </Badge>
                    </div>

                    <div>
                      <Label htmlFor="new_status">New Status</Label>
                      <select
                        id="new_status"
                        value={selectedTransition}
                        onChange={(e) => setSelectedTransition(e.target.value)}
                        className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Select new status...</option>
                        {getAvailableTransitions().map((status) => (
                          <option key={status} value={status}>
                            {status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <Label htmlFor="comments">Comments</Label>
                      <Textarea
                        id="comments"
                        value={transitionComments}
                        onChange={(e) => setTransitionComments(e.target.value)}
                        placeholder="Provide details about this status change..."
                        rows={3}
                      />
                    </div>
                  </div>

                  <DialogFooter>
                    <Button
                      variant="outline"
                      onClick={() => setIsTransitionDialogOpen(false)}
                      disabled={loading}
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleStatusTransition}
                      disabled={loading || !selectedTransition || !transitionComments.trim()}
                    >
                      {loading ? "Updating..." : "Update Status"}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
