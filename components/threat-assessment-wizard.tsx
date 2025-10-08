"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Slider } from "@/components/ui/slider"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import {
  CalendarIcon,
  ChevronLeft,
  ChevronRight,
  AlertTriangle,
  Shield,
  Target,
  Users,
  CheckCircle,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import OwnerSelectInput from "@/components/owner-search-input"

interface ThreatAssessmentData {
  // Basic Information
  name: string
  description: string
  methodology: string
  scope: string

  // Threat Selection
  selectedThreats: string[]

  // Risk Evaluation
  riskEvaluations: Record<string, { likelihood: number; impact: number }>

  // Mitigation Planning
  mitigationStrategies: string
  recommendations: string

  // Assignment & Review
  assignedTo: string
  dueDate: Date | undefined
  priority: string
  reviewNotes: string
}

const steps = [
  { id: 1, name: "Basic Information", icon: Target },
  { id: 2, name: "Threat Selection", icon: AlertTriangle },
  { id: 3, name: "Risk Evaluation", icon: Shield },
  { id: 4, name: "Mitigation Planning", icon: CheckCircle },
  { id: 5, name: "Assignment & Review", icon: Users },
]

const mockThreats = [
  {
    id: "1",
    name: "Malware Attack",
    category: "Cybersecurity",
    description: "Malicious software designed to damage or disrupt systems",
  },
  {
    id: "2",
    name: "Phishing",
    category: "Social Engineering",
    description: "Fraudulent attempts to obtain sensitive information",
  },
  { id: "3", name: "Data Breach", category: "Data Security", description: "Unauthorized access to confidential data" },
  {
    id: "4",
    name: "Insider Threat",
    category: "Personnel",
    description: "Security risk from people within the organization",
  },
  {
    id: "5",
    name: "Physical Security Breach",
    category: "Physical",
    description: "Unauthorized physical access to facilities",
  },
  {
    id: "6",
    name: "Supply Chain Attack",
    category: "Third Party",
    description: "Attack through compromised suppliers or vendors",
  },
]

const riskMatrix = [
  { likelihood: 1, impact: 1, level: "Very Low", color: "bg-green-100 text-green-800" },
  { likelihood: 1, impact: 2, level: "Low", color: "bg-green-100 text-green-800" },
  { likelihood: 1, impact: 3, level: "Low", color: "bg-green-100 text-green-800" },
  { likelihood: 1, impact: 4, level: "Medium", color: "bg-yellow-100 text-yellow-800" },
  { likelihood: 1, impact: 5, level: "Medium", color: "bg-yellow-100 text-yellow-800" },
  { likelihood: 2, impact: 1, level: "Low", color: "bg-green-100 text-green-800" },
  { likelihood: 2, impact: 2, level: "Low", color: "bg-green-100 text-green-800" },
  { likelihood: 2, impact: 3, level: "Medium", color: "bg-yellow-100 text-yellow-800" },
  { likelihood: 2, impact: 4, level: "Medium", color: "bg-yellow-100 text-yellow-800" },
  { likelihood: 2, impact: 5, level: "High", color: "bg-orange-100 text-orange-800" },
  { likelihood: 3, impact: 1, level: "Low", color: "bg-green-100 text-green-800" },
  { likelihood: 3, impact: 2, level: "Medium", color: "bg-yellow-100 text-yellow-800" },
  { likelihood: 3, impact: 3, level: "Medium", color: "bg-yellow-100 text-yellow-800" },
  { likelihood: 3, impact: 4, level: "High", color: "bg-orange-100 text-orange-800" },
  { likelihood: 3, impact: 5, level: "High", color: "bg-orange-100 text-orange-800" },
  { likelihood: 4, impact: 1, level: "Medium", color: "bg-yellow-100 text-yellow-800" },
  { likelihood: 4, impact: 2, level: "Medium", color: "bg-yellow-100 text-yellow-800" },
  { likelihood: 4, impact: 3, level: "High", color: "bg-orange-100 text-orange-800" },
  { likelihood: 4, impact: 4, level: "High", color: "bg-orange-100 text-orange-800" },
  { likelihood: 4, impact: 5, level: "Critical", color: "bg-red-100 text-red-800" },
  { likelihood: 5, impact: 1, level: "Medium", color: "bg-yellow-100 text-yellow-800" },
  { likelihood: 5, impact: 2, level: "High", color: "bg-orange-100 text-orange-800" },
  { likelihood: 5, impact: 3, level: "High", color: "bg-orange-100 text-orange-800" },
  { likelihood: 5, impact: 4, level: "Critical", color: "bg-red-100 text-red-800" },
  { likelihood: 5, impact: 5, level: "Critical", color: "bg-red-100 text-red-800" },
]

interface ThreatAssessmentWizardProps {
  onComplete: () => void
}

export function ThreatAssessmentWizard({ onComplete }: ThreatAssessmentWizardProps) {
  const [currentStep, setCurrentStep] = useState(1)
  const [data, setData] = useState<ThreatAssessmentData>({
    name: "",
    description: "",
    methodology: "",
    scope: "",
    selectedThreats: [],
    riskEvaluations: {},
    mitigationStrategies: "",
    recommendations: "",
    assignedTo: "",
    dueDate: undefined,
    priority: "",
    reviewNotes: "",
  })

  const updateData = (updates: Partial<ThreatAssessmentData>) => {
    setData((prev) => ({ ...prev, ...updates }))
  }

  const getRiskLevel = (likelihood: number, impact: number) => {
    const risk = riskMatrix.find((r) => r.likelihood === likelihood && r.impact === impact)
    return risk || { level: "Unknown", color: "bg-gray-100 text-gray-800" }
  }

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return data.name && data.methodology
      case 2:
        return data.selectedThreats.length > 0
      case 3:
        return data.selectedThreats.every((threatId) => data.riskEvaluations[threatId])
      case 4:
        return data.mitigationStrategies
      case 5:
        return data.assignedTo && data.priority
      default:
        return false
    }
  }

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div>
              <Label htmlFor="name">Assessment Name *</Label>
              <Input
                id="name"
                value={data.name}
                onChange={(e) => updateData({ name: e.target.value })}
                placeholder="Enter assessment name"
              />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={data.description}
                onChange={(e) => updateData({ description: e.target.value })}
                placeholder="Describe the purpose and scope of this assessment"
                rows={3}
              />
            </div>
            <div>
              <Label htmlFor="methodology">Methodology *</Label>
              <Select value={data.methodology} onValueChange={(value) => updateData({ methodology: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select assessment methodology" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="nist">NIST Cybersecurity Framework</SelectItem>
                  <SelectItem value="iso27001">ISO 27001</SelectItem>
                  <SelectItem value="coso">COSO Framework</SelectItem>
                  <SelectItem value="octave">OCTAVE</SelectItem>
                  <SelectItem value="fair">FAIR (Factor Analysis of Information Risk)</SelectItem>
                  <SelectItem value="custom">Custom Methodology</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="scope">Assessment Scope</Label>
              <Textarea
                id="scope"
                value={data.scope}
                onChange={(e) => updateData({ scope: e.target.value })}
                placeholder="Define what systems, processes, or areas this assessment covers"
                rows={3}
              />
            </div>
          </div>
        )

      case 2:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium mb-4">Select Threats to Assess</h3>
              <p className="text-sm text-gray-600 mb-4">
                Choose the threats that are relevant to your assessment scope.
              </p>
            </div>
            <div className="grid gap-4">
              {mockThreats.map((threat) => (
                <Card key={threat.id} className="cursor-pointer hover:bg-gray-50">
                  <CardContent className="p-4">
                    <div className="flex items-start space-x-3">
                      <Checkbox
                        checked={data.selectedThreats.includes(threat.id)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            updateData({ selectedThreats: [...data.selectedThreats, threat.id] })
                          } else {
                            updateData({
                              selectedThreats: data.selectedThreats.filter((id) => id !== threat.id),
                              riskEvaluations: Object.fromEntries(
                                Object.entries(data.riskEvaluations).filter(([key]) => key !== threat.id),
                              ),
                            })
                          }
                        }}
                      />
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium">{threat.name}</h4>
                          <Badge variant="outline">{threat.category}</Badge>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">{threat.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            {data.selectedThreats.length > 0 && (
              <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-800">
                  Selected {data.selectedThreats.length} threat{data.selectedThreats.length !== 1 ? "s" : ""} for
                  assessment.
                </p>
              </div>
            )}
          </div>
        )

      case 3:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium mb-4">Risk Evaluation</h3>
              <p className="text-sm text-gray-600 mb-4">Evaluate the likelihood and impact of each selected threat.</p>
            </div>
            {data.selectedThreats.map((threatId) => {
              const threat = mockThreats.find((t) => t.id === threatId)
              const evaluation = data.riskEvaluations[threatId] || { likelihood: 3, impact: 3 }
              const riskLevel = getRiskLevel(evaluation.likelihood, evaluation.impact)

              return (
                <Card key={threatId}>
                  <CardHeader>
                    <CardTitle className="text-base">{threat?.name}</CardTitle>
                    <CardDescription>{threat?.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <Label>Likelihood: {evaluation.likelihood}/5</Label>
                      <Slider
                        value={[evaluation.likelihood]}
                        onValueChange={([value]) => {
                          updateData({
                            riskEvaluations: {
                              ...data.riskEvaluations,
                              [threatId]: { ...evaluation, likelihood: value },
                            },
                          })
                        }}
                        max={5}
                        min={1}
                        step={1}
                        className="mt-2"
                      />
                      <div className="flex justify-between text-xs text-gray-500 mt-1">
                        <span>Very Unlikely</span>
                        <span>Very Likely</span>
                      </div>
                    </div>
                    <div>
                      <Label>Impact: {evaluation.impact}/5</Label>
                      <Slider
                        value={[evaluation.impact]}
                        onValueChange={([value]) => {
                          updateData({
                            riskEvaluations: {
                              ...data.riskEvaluations,
                              [threatId]: { ...evaluation, impact: value },
                            },
                          })
                        }}
                        max={5}
                        min={1}
                        step={1}
                        className="mt-2"
                      />
                      <div className="flex justify-between text-xs text-gray-500 mt-1">
                        <span>Minimal Impact</span>
                        <span>Severe Impact</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm font-medium">Risk Level:</span>
                      <Badge className={riskLevel.color}>{riskLevel.level}</Badge>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )

      case 4:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium mb-4">Mitigation Planning</h3>
              <p className="text-sm text-gray-600 mb-4">
                Define strategies and recommendations for addressing the identified risks.
              </p>
            </div>
            <div>
              <Label htmlFor="strategies">Mitigation Strategies *</Label>
              <Textarea
                id="strategies"
                value={data.mitigationStrategies}
                onChange={(e) => updateData({ mitigationStrategies: e.target.value })}
                placeholder="Describe the strategies to mitigate the identified threats..."
                rows={6}
              />
            </div>
            <div>
              <Label htmlFor="recommendations">Recommendations</Label>
              <Textarea
                id="recommendations"
                value={data.recommendations}
                onChange={(e) => updateData({ recommendations: e.target.value })}
                placeholder="Provide specific recommendations for risk treatment..."
                rows={4}
              />
            </div>
          </div>
        )

      case 5:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium mb-4">Assignment & Review</h3>
              <p className="text-sm text-gray-600 mb-4">Assign the assessment and set review parameters.</p>
            </div>
            <div>
              <Label htmlFor="assignedTo">Assigned To *</Label>
              <OwnerSelectInput formData={data} setFormData={setData} fieldName="assignedTo"/>
              {/* <Input
                id="assignedTo"
                value={data.assignedTo}
                onChange={(e) => updateData({ assignedTo: e.target.value })}
                placeholder="Enter assignee name or team"
              /> */}
            </div>
            <div>
              <Label>Due Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !data.dueDate && "text-muted-foreground",
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {data.dueDate ? format(data.dueDate, "PPP") : "Select due date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={data.dueDate}
                    onSelect={(date) => updateData({ dueDate: date })}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div>
              <Label htmlFor="priority">Priority *</Label>
              <Select value={data.priority} onValueChange={(value) => updateData({ priority: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select priority level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="critical">Critical</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="reviewNotes">Review Notes</Label>
              <Textarea
                id="reviewNotes"
                value={data.reviewNotes}
                onChange={(e) => updateData({ reviewNotes: e.target.value })}
                placeholder="Add any additional notes for review..."
                rows={3}
              />
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="space-y-6">
      {/* Progress Header */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Threat Assessment Wizard</h2>
          <Badge variant="outline">
            Step {currentStep} of {steps.length}
          </Badge>
        </div>
        <Progress value={(currentStep / steps.length) * 100} className="w-full" />
        <div className="flex items-center justify-between text-sm">
          {steps.map((step, index) => (
            <div
              key={step.id}
              className={cn("flex items-center space-x-2", currentStep >= step.id ? "text-blue-600" : "text-gray-400")}
            >
              <step.icon className="h-4 w-4" />
              <span className="hidden sm:inline">{step.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Step Content */}
      <Card>
        <CardHeader>
          <CardTitle>{steps[currentStep - 1].name}</CardTitle>
        </CardHeader>
        <CardContent>{renderStep()}</CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={() => setCurrentStep((prev) => Math.max(1, prev - 1))}
          disabled={currentStep === 1}
        >
          <ChevronLeft className="mr-2 h-4 w-4" />
          Previous
        </Button>

        {currentStep < steps.length ? (
          <Button onClick={() => setCurrentStep((prev) => prev + 1)} disabled={!canProceed()}>
            Next
            <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        ) : (
          <Button onClick={onComplete} disabled={!canProceed()}>
            Complete Assessment
          </Button>
        )}
      </div>
    </div>
  )
}
