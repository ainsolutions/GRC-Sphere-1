"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CheckCircle, ArrowRight, ArrowLeft, Target, Settings, FileText, Users } from "lucide-react"
import {
  createRiskAssessmentWorkflow,
  getRiskAssessmentTemplates,
  saveWorkflowScope,
  saveWorkflowContext,
  saveWorkflowCriteria,
} from "@/lib/actions/risk-assessment-workflow-actions"
import { useToast } from "@/hooks/use-toast"
import OwnerSelectInput from "@/components/owner-search-input"

interface RiskAssessmentWorkflowWizardProps {
  workflow?: any
  onSuccess?: () => void
  onCancel?: () => void
}

const WIZARD_STEPS = [
  { id: 1, name: "Basic Information", icon: FileText, description: "Define workflow basics" },
  { id: 2, name: "Scope Definition", icon: Target, description: "Define assessment scope" },
  { id: 3, name: "Context & Criteria", icon: Settings, description: "Set context and criteria" },
  { id: 4, name: "Team & Timeline", icon: Users, description: "Assign team and timeline" },
  { id: 5, name: "Review & Create", icon: CheckCircle, description: "Review and finalize" },
]

export function RiskAssessmentWorkflowWizard({ workflow, onSuccess, onCancel }: RiskAssessmentWorkflowWizardProps) {
  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [templates, setTemplates] = useState([])
  const [selectedTemplate, setSelectedTemplate] = useState(null)
  const [workflowData, setWorkflowData] = useState({
    workflow_name: "",
    description: "",
    methodology: "",
    assessment_type: "",
    scope: "",
    created_by: "current_user",
    assigned_to: "",
    start_date: "",
    target_completion_date: "",
  })
  const [scopeItems, setScopeItems] = useState([])
  const [contextData, setContextData] = useState({
    business_objectives: "",
    regulatory_requirements: "",
    stakeholder_expectations: "",
    risk_appetite: "",
    risk_tolerance: "",
    internal_context: "",
    external_context: "",
  })
  const [criteriaData, setCriteriaData] = useState({
    likelihood_scale: [],
    impact_scale: [],
    acceptance_criteria: "",
    escalation_criteria: "",
  })
  const { toast } = useToast()

  useEffect(() => {
    const fetchTemplates = async () => {
      const result = await getRiskAssessmentTemplates()
      if (result.success) {
        setTemplates(result.data)
      }
    }
    fetchTemplates()
  }, [])

  const handleTemplateSelect = (templateId: string) => {
    const template = templates.find((t: any) => t.id.toString() === templateId)
    if (template) {
      setSelectedTemplate(template)
      setWorkflowData((prev) => ({
        ...prev,
        methodology: template.methodology,
      }))

      // Set default criteria from template
      if (template.default_criteria) {
        setCriteriaData((prev) => ({
          ...prev,
          likelihood_scale: template.default_criteria.likelihood || [],
          impact_scale: template.default_criteria.impact || [],
        }))
      }
    }
  }

  const addScopeItem = () => {
    setScopeItems([
      ...scopeItems,
      {
        scope_type: "",
        scope_name: "",
        scope_description: "",
        inclusion_criteria: "",
        exclusion_criteria: "",
        business_impact: "",
      },
    ])
  }

  const updateScopeItem = (index: number, field: string, value: string) => {
    const updated = [...scopeItems]
    updated[index] = { ...updated[index], [field]: value }
    setScopeItems(updated)
  }

  const removeScopeItem = (index: number) => {
    setScopeItems(scopeItems.filter((_, i) => i !== index))
  }

  const handleNext = () => {
    if (currentStep < WIZARD_STEPS.length) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    try {
      // Create the workflow
      const formData = new FormData()
      Object.entries(workflowData).forEach(([key, value]) => {
        formData.append(key, value)
      })

      const workflowResult = await createRiskAssessmentWorkflow(formData)

      if (workflowResult.success) {
        const workflowId = workflowResult.data.id

        // Save scope items
        for (const scopeItem of scopeItems) {
          if (scopeItem.scope_name) {
            await saveWorkflowScope({
              workflow_id: workflowId,
              ...scopeItem,
            })
          }
        }

        // Save context
        await saveWorkflowContext({
          workflow_id: workflowId,
          ...contextData,
        })

        // Save criteria
        await saveWorkflowCriteria({
          workflow_id: workflowId,
          ...criteriaData,
          risk_matrix: generateRiskMatrix(criteriaData.likelihood_scale, criteriaData.impact_scale),
        })

        toast({
          title: "Success",
          description: "Risk assessment workflow created successfully",
        })
        onSuccess?.()
      } else {
        toast({
          title: "Error",
          description: workflowResult.error,
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const generateRiskMatrix = (likelihood: any[], impact: any[]) => {
    const matrix = []
    for (let l = 1; l <= 5; l++) {
      for (let i = 1; i <= 5; i++) {
        const score = l * i
        let level = "Low"
        let color = "green"

        if (score >= 20) {
          level = "Critical"
          color = "red"
        } else if (score >= 15) {
          level = "High"
          color = "orange"
        } else if (score >= 10) {
          level = "Medium"
          color = "yellow"
        } else if (score >= 5) {
          level = "Low"
          color = "blue"
        } else {
          level = "Very Low"
          color = "green"
        }

        matrix.push({
          likelihood: l,
          impact: i,
          score,
          level,
          color,
        })
      }
    }
    return matrix
  }

  const progress = (currentStep / WIZARD_STEPS.length) * 100

  return (
    <div className="w-full max-w-6xl mx-auto">
      {/* Progress Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-cyan-600 bg-clip-text text-transparent">
            Step {currentStep} of {WIZARD_STEPS.length}: {WIZARD_STEPS[currentStep - 1].name}
          </h2>
          <Badge variant="outline" className="bg-gradient-to-r from-purple-100 to-cyan-100">
            {Math.round(progress)}% Complete
          </Badge>
        </div>
        <Progress value={progress} className="h-2 mb-4" />

        {/* Step Navigation */}
        <div className="flex items-center space-x-4 overflow-x-auto pb-2">
          {WIZARD_STEPS.map((step, index) => (
            <div key={step.id} className="flex items-center space-x-2 min-w-fit">
              <div
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg ${
                  currentStep === step.id
                    ? "bg-gradient-to-r from-purple-500 to-cyan-500 text-white"
                    : currentStep > step.id
                      ? "bg-gradient-to-r from-green-500 to-blue-500 text-white"
                      : "bg-gray-100 text-gray-600"
                }`}
              >
                <step.icon className="h-4 w-4" />
                <span className="text-sm font-medium">{step.name}</span>
                {currentStep > step.id && <CheckCircle className="h-4 w-4" />}
              </div>
              {index < WIZARD_STEPS.length - 1 && <ArrowRight className="h-4 w-4 text-gray-400" />}
            </div>
          ))}
        </div>
      </div>

      {/* Step Content */}
      <Card className="gradient-card">
        <CardContent className="p-6">
          {currentStep === 1 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-4 bg-gradient-to-r from-purple-600 to-cyan-600 bg-clip-text text-transparent">
                  Basic Workflow Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="workflow_name">Workflow Name *</Label>
                    <Input
                      id="workflow_name"
                      value={workflowData.workflow_name}
                      onChange={(e) => setWorkflowData((prev) => ({ ...prev, workflow_name: e.target.value }))}
                      placeholder="Enter workflow name"
                      className="border-purple-200 focus:border-cyan-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="assessment_type">Assessment Type *</Label>
                    <Select
                      value={workflowData.assessment_type}
                      onValueChange={(value) => setWorkflowData((prev) => ({ ...prev, assessment_type: value }))}
                    >
                      <SelectTrigger className="border-purple-200 focus:border-cyan-500">
                        <SelectValue placeholder="Select assessment type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Initial">Initial Assessment</SelectItem>
                        <SelectItem value="Annual">Annual Review</SelectItem>
                        <SelectItem value="Triggered">Triggered Assessment</SelectItem>
                        <SelectItem value="Continuous">Continuous Monitoring</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={workflowData.description}
                    onChange={(e) => setWorkflowData((prev) => ({ ...prev, description: e.target.value }))}
                    placeholder="Describe the purpose and scope of this risk assessment"
                    rows={3}
                    className="border-purple-200 focus:border-cyan-500"
                  />
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="text-lg font-semibold mb-4 bg-gradient-to-r from-purple-600 to-cyan-600 bg-clip-text text-transparent">
                  Select Assessment Template
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {templates.map((template: any) => (
                    <Card
                      key={template.id}
                      className={`cursor-pointer transition-all ${
                        selectedTemplate?.id === template.id
                          ? "ring-2 ring-purple-500 bg-gradient-to-r from-purple-50 to-cyan-50"
                          : "hover:shadow-md"
                      }`}
                      onClick={() => handleTemplateSelect(template.id.toString())}
                    >
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base">{template.template_name}</CardTitle>
                        <Badge className="w-fit bg-gradient-to-r from-purple-500 to-cyan-500 text-white">
                          {template.methodology}
                        </Badge>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground">{template.description}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-4 bg-gradient-to-r from-purple-600 to-cyan-600 bg-clip-text text-transparent">
                  Define Assessment Scope
                </h3>
                <div className="space-y-2 mb-4">
                  <Label htmlFor="scope">Overall Scope Description</Label>
                  <Textarea
                    id="scope"
                    value={workflowData.scope}
                    onChange={(e) => setWorkflowData((prev) => ({ ...prev, scope: e.target.value }))}
                    placeholder="Describe the overall scope of this risk assessment"
                    rows={3}
                    className="border-purple-200 focus:border-cyan-500"
                  />
                </div>
              </div>

              <Separator />

              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold bg-gradient-to-r from-purple-600 to-cyan-600 bg-clip-text text-transparent">
                    Scope Items
                  </h3>
                  <Button onClick={addScopeItem} variant="outline" size="sm">
                    <Target className="h-4 w-4 mr-2" />
                    Add Scope Item
                  </Button>
                </div>

                <div className="space-y-4">
                  {scopeItems.map((item, index) => (
                    <Card key={index} className="p-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label>Scope Type</Label>
                          <Select
                            value={item.scope_type}
                            onValueChange={(value) => updateScopeItem(index, "scope_type", value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Business Unit">Business Unit</SelectItem>
                              <SelectItem value="System">System</SelectItem>
                              <SelectItem value="Process">Process</SelectItem>
                              <SelectItem value="Location">Location</SelectItem>
                              <SelectItem value="Asset">Asset</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label>Scope Name</Label>
                          <Input
                            value={item.scope_name}
                            onChange={(e) => updateScopeItem(index, "scope_name", e.target.value)}
                            placeholder="Enter scope name"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Business Impact</Label>
                          <Select
                            value={item.business_impact}
                            onValueChange={(value) => updateScopeItem(index, "business_impact", value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select impact" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Critical">Critical</SelectItem>
                              <SelectItem value="High">High</SelectItem>
                              <SelectItem value="Medium">Medium</SelectItem>
                              <SelectItem value="Low">Low</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                        <div className="space-y-2">
                          <Label>Inclusion Criteria</Label>
                          <Textarea
                            value={item.inclusion_criteria}
                            onChange={(e) => updateScopeItem(index, "inclusion_criteria", e.target.value)}
                            placeholder="What is included in this scope"
                            rows={2}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Exclusion Criteria</Label>
                          <Textarea
                            value={item.exclusion_criteria}
                            onChange={(e) => updateScopeItem(index, "exclusion_criteria", e.target.value)}
                            placeholder="What is excluded from this scope"
                            rows={2}
                          />
                        </div>
                      </div>
                      <div className="flex justify-end mt-4">
                        <Button
                          onClick={() => removeScopeItem(index)}
                          variant="outline"
                          size="sm"
                          className="text-red-600 hover:bg-red-50"
                        >
                          Remove
                        </Button>
                      </div>
                    </Card>
                  ))}

                  {scopeItems.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      No scope items defined. Click "Add Scope Item" to get started.
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-6">
              <Tabs defaultValue="context" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="context">Risk Context</TabsTrigger>
                  <TabsTrigger value="criteria">Risk Criteria</TabsTrigger>
                </TabsList>

                <TabsContent value="context" className="space-y-4">
                  <h3 className="text-lg font-semibold bg-gradient-to-r from-purple-600 to-cyan-600 bg-clip-text text-transparent">
                    Risk Assessment Context
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Business Objectives</Label>
                      <Textarea
                        value={contextData.business_objectives}
                        onChange={(e) => setContextData((prev) => ({ ...prev, business_objectives: e.target.value }))}
                        placeholder="Key business objectives relevant to this assessment"
                        rows={3}
                        className="border-purple-200 focus:border-cyan-500"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Regulatory Requirements</Label>
                      <Textarea
                        value={contextData.regulatory_requirements}
                        onChange={(e) =>
                          setContextData((prev) => ({ ...prev, regulatory_requirements: e.target.value }))
                        }
                        placeholder="Applicable regulatory and compliance requirements"
                        rows={3}
                        className="border-purple-200 focus:border-cyan-500"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Risk Appetite</Label>
                      <Textarea
                        value={contextData.risk_appetite}
                        onChange={(e) => setContextData((prev) => ({ ...prev, risk_appetite: e.target.value }))}
                        placeholder="Organization's risk appetite statement"
                        rows={3}
                        className="border-purple-200 focus:border-cyan-500"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Risk Tolerance</Label>
                      <Textarea
                        value={contextData.risk_tolerance}
                        onChange={(e) => setContextData((prev) => ({ ...prev, risk_tolerance: e.target.value }))}
                        placeholder="Specific risk tolerance levels"
                        rows={3}
                        className="border-purple-200 focus:border-cyan-500"
                      />
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="criteria" className="space-y-4">
                  <h3 className="text-lg font-semibold bg-gradient-to-r from-purple-600 to-cyan-600 bg-clip-text text-transparent">
                    Risk Assessment Criteria
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card className="p-4">
                      <h4 className="font-semibold mb-3">Likelihood Scale</h4>
                      <div className="space-y-2">
                        {criteriaData.likelihood_scale.map((level: any, index: number) => (
                          <div key={index} className="flex items-center space-x-2 p-2 rounded border">
                            <Badge className={`bg-${level.color}-500 text-white`}>{level.level}</Badge>
                            <div>
                              <div className="font-medium">{level.name}</div>
                              <div className="text-sm text-muted-foreground">{level.description}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </Card>

                    <Card className="p-4">
                      <h4 className="font-semibold mb-3">Impact Scale</h4>
                      <div className="space-y-2">
                        {criteriaData.impact_scale.map((level: any, index: number) => (
                          <div key={index} className="flex items-center space-x-2 p-2 rounded border">
                            <Badge className={`bg-${level.color}-500 text-white`}>{level.level}</Badge>
                            <div>
                              <div className="font-medium">{level.name}</div>
                              <div className="text-sm text-muted-foreground">{level.description}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </Card>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Risk Acceptance Criteria</Label>
                      <Textarea
                        value={criteriaData.acceptance_criteria}
                        onChange={(e) => setCriteriaData((prev) => ({ ...prev, acceptance_criteria: e.target.value }))}
                        placeholder="Define when risks are acceptable"
                        rows={3}
                        className="border-purple-200 focus:border-cyan-500"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Escalation Criteria</Label>
                      <Textarea
                        value={criteriaData.escalation_criteria}
                        onChange={(e) => setCriteriaData((prev) => ({ ...prev, escalation_criteria: e.target.value }))}
                        placeholder="Define when risks require escalation"
                        rows={3}
                        className="border-purple-200 focus:border-cyan-500"
                      />
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          )}

          {currentStep === 4 && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold bg-gradient-to-r from-purple-600 to-cyan-600 bg-clip-text text-transparent">
                Team Assignment & Timeline
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="assigned_to">Assigned To</Label>                  
                  <OwnerSelectInput formData={workflowData} setFormData={setWorkflowData} fieldName="assigned_to"/>
                  {/* <Input
                    id="assigned_to"
                    value={workflowData.assigned_to}
                    onChange={(e) => setWorkflowData((prev) => ({ ...prev, assigned_to: e.target.value }))}
                    placeholder="Enter assignee name or email"
                    className="border-purple-200 focus:border-cyan-500"
                  /> */}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="start_date">Start Date</Label>
                  <Input
                    id="start_date"
                    type="date"
                    value={workflowData.start_date}
                    onChange={(e) => setWorkflowData((prev) => ({ ...prev, start_date: e.target.value }))}
                    className="border-purple-200 focus:border-cyan-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="target_completion_date">Target Completion Date</Label>
                  <Input
                    id="target_completion_date"
                    type="date"
                    value={workflowData.target_completion_date}
                    onChange={(e) => setWorkflowData((prev) => ({ ...prev, target_completion_date: e.target.value }))}
                    className="border-purple-200 focus:border-cyan-500"
                  />
                </div>
              </div>

              <Separator />

              <div>
                <h4 className="font-semibold mb-4">Workflow Steps Overview</h4>
                {selectedTemplate && selectedTemplate.default_steps && (
                  <div className="space-y-3">
                    {selectedTemplate.default_steps.map((step: any, index: number) => (
                      <Card key={index} className="p-4">
                        <div className="flex items-center space-x-3">
                          <Badge className="bg-gradient-to-r from-purple-500 to-cyan-500 text-white">
                            Step {step.step}
                          </Badge>
                          <div>
                            <div className="font-medium">{step.name}</div>
                            <div className="text-sm text-muted-foreground">{step.description}</div>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {currentStep === 5 && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold bg-gradient-to-r from-purple-600 to-cyan-600 bg-clip-text text-transparent">
                Review & Finalize Workflow
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="p-4">
                  <h4 className="font-semibold mb-3">Basic Information</h4>
                  <div className="space-y-2 text-sm">
                    <div>
                      <strong>Name:</strong> {workflowData.workflow_name}
                    </div>
                    <div>
                      <strong>Type:</strong> {workflowData.assessment_type}
                    </div>
                    <div>
                      <strong>Methodology:</strong> {workflowData.methodology}
                    </div>
                    <div>
                      <strong>Description:</strong> {workflowData.description || "Not provided"}
                    </div>
                  </div>
                </Card>

                <Card className="p-4">
                  <h4 className="font-semibold mb-3">Timeline & Assignment</h4>
                  <div className="space-y-2 text-sm">
                    <div>
                      <strong>Assigned To:</strong> {workflowData.assigned_to || "Not assigned"}
                    </div>
                    <div>
                      <strong>Start Date:</strong> {workflowData.start_date || "Not set"}
                    </div>
                    <div>
                      <strong>Target Completion:</strong> {workflowData.target_completion_date || "Not set"}
                    </div>
                  </div>
                </Card>

                <Card className="p-4">
                  <h4 className="font-semibold mb-3">Scope Summary</h4>
                  <div className="space-y-2 text-sm">
                    <div>
                      <strong>Overall Scope:</strong> {workflowData.scope || "Not defined"}
                    </div>
                    <div>
                      <strong>Scope Items:</strong> {scopeItems.length} items defined
                    </div>
                  </div>
                </Card>

                <Card className="p-4">
                  <h4 className="font-semibold mb-3">Risk Criteria</h4>
                  <div className="space-y-2 text-sm">
                    <div>
                      <strong>Likelihood Levels:</strong> {criteriaData.likelihood_scale.length}
                    </div>
                    <div>
                      <strong>Impact Levels:</strong> {criteriaData.impact_scale.length}
                    </div>
                    <div>
                      <strong>Acceptance Criteria:</strong>{" "}
                      {criteriaData.acceptance_criteria ? "Defined" : "Not defined"}
                    </div>
                  </div>
                </Card>
              </div>

              <div className="bg-gradient-to-r from-purple-50 to-cyan-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2 text-purple-800">Ready to Create Workflow?</h4>
                <p className="text-sm text-purple-700">
                  Review all the information above. Once created, you can manage the workflow progress, conduct risk
                  assessments, and track completion through the workflow dashboard.
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Navigation Buttons */}
      <div className="flex justify-between mt-6">
        <div>
          {currentStep > 1 && (
            <Button onClick={handlePrevious} variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Previous
            </Button>
          )}
        </div>

        <div className="flex space-x-2">
          {onCancel && (
            <Button onClick={onCancel} variant="outline">
              Cancel
            </Button>
          )}

          {currentStep < WIZARD_STEPS.length ? (
            <Button
              onClick={handleNext}
              className="bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 text-white"
              disabled={
                (currentStep === 1 &&
                  (!workflowData.workflow_name || !workflowData.assessment_type || !selectedTemplate)) ||
                (currentStep === 2 && !workflowData.scope)
              }
            >
              Next
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white"
            >
              {isSubmitting ? "Creating..." : "Create Workflow"}
              <CheckCircle className="h-4 w-4 ml-2" />
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
