"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Progress } from "@/components/ui/progress"
import { Plus, Edit, Download, SaveAll, CheckCircle, AlertCircle, Building2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { ActionButtons } from "./ui/action-buttons"

interface RiskTemplate {
  id: number
  category_id: string
  category_name: string
  risk_id: string
  risk_title: string
  control_catalogue: string
}

interface TemplateCategory {
  categoryId: string
  categoryName: string
  templates: RiskTemplate[]
}

interface Assessment {
  id: number
  vendor_id: string
  vendor_name: string
  assessment_name: string
  assessment_date: string
  assessor_name: string
  status: string
  overall_risk_level?: string
  total_responses: number
  effective_count: number
  partial_count: number
  not_effective_count: number
  avg_risk_score: number
  vendor_type_id?: number
}

interface AssessmentResponse {
  id?: number
  assessment_id: number
  template_id: number
  assessment_result: string
  assessment_remarks: string
  impact_score: number
  likelihood_score: number
  risk_level: string
  risk_treatment: string
  residual_impact_score: number
  residual_likelihood_score: number
  residual_risk_level: string
}

interface VendorType {
  id: number
  name: string
  description: string
  color: string
  icon: string
  is_active: boolean
  template_count: number
}

const riskLevelColors = {
  "Very Low": "bg-green-600/20 text-green-300 border-green-600/30",
  Low: "bg-green-500/20 text-green-300 border-green-500/30",
  Medium: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30",
  High: "bg-orange-500/20 text-orange-300 border-orange-500/30",
  Critical: "bg-red-500/20 text-red-300 border-red-500/30",
}

const assessmentResultColors = {
  Effective: "bg-green-500/20 text-green-300 border-green-500/30",
  "Partial Effective": "bg-yellow-500/20 text-yellow-300 border-yellow-500/30",
  "Not Effective": "bg-red-500/20 text-red-300 border-red-500/30",
}

const iconMap = {
  Building2: Building2,
}

export function ThirdPartyRiskAssessment() {
  const [templates, setTemplates] = useState<TemplateCategory[]>([])
  const [assessments, setAssessments] = useState<Assessment[]>([])
  const [isNewAssessmentOpen, setIsNewAssessmentOpen] = useState(false)
  const [isAssessmentOpen, setIsAssessmentOpen] = useState(false)
  const [currentAssessment, setCurrentAssessment] = useState<Assessment | null>(null)
  const [responses, setResponses] = useState<{ [key: number]: AssessmentResponse }>({})
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState<{ [key: number]: boolean }>({})
  const [bulkSaving, setBulkSaving] = useState(false)
  const [savedResponses, setSavedResponses] = useState<Set<number>>(new Set())
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const { toast } = useToast()
  const [vendorTypes, setVendorTypes] = useState<VendorType[]>([])

  useEffect(() => {
    fetchTemplates()
    fetchAssessments()
    fetchVendorTypes()
  }, [])

  const fetchVendorTypes = async () => {
    try {
      const response = await fetch("/api/vendor-types")
      const data = await response.json()
      if (data.success) {
        setVendorTypes(data.vendorTypes)
      }
    } catch (error) {
      console.error("Error fetching vendor types:", error)
    }
  }

  const fetchTemplates = async () => {
    try {
      // First try to get vendor type specific templates if assessment has vendor_type_id
      if (currentAssessment?.vendor_type_id) {
        const response = await fetch(`/api/vendor-types/${currentAssessment.vendor_type_id}/templates`)
        const data = await response.json()
        if (data.success && data.categories.length > 0) {
          setTemplates(data.categories)
          return
        }
      }

      // Fallback to generic templates
      const response = await fetch("/api/third-party-risk-templates")
      const data = await response.json()
      if (data.success) {
        // Group templates by category
        const groupedTemplates: { [key: string]: TemplateCategory } = {}

        data.templates.forEach((template: RiskTemplate) => {
          const categoryKey = template.category_id
          if (!groupedTemplates[categoryKey]) {
            groupedTemplates[categoryKey] = {
              categoryId: template.category_id,
              categoryName: template.category_name,
              templates: [],
            }
          }
          groupedTemplates[categoryKey].templates.push(template)
        })

        setTemplates(Object.values(groupedTemplates))
      }
    } catch (error) {
      console.error("Error fetching templates:", error)
      toast({
        title: "Error",
        description: "Failed to fetch risk templates",
        variant: "destructive",
      })
    }
  }

  const fetchAssessments = async () => {
    try {
      const response = await fetch("/api/third-party-risk-assessments")
      const data = await response.json()
      if (data.success) {
        setAssessments(data.assessments || [])
      }
    } catch (error) {
      console.error("Error fetching assessments:", error)
    }
  }

  const createNewAssessment = async (formData: FormData) => {
    setLoading(true)
    try {
      const response = await fetch("/api/third-party-risk-assessments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          assessment_name: formData.get("assessmentName"),
          vendor_id: formData.get("vendorId"),
          vendor_name: formData.get("vendorName"),
          vendor_type_id: Number.parseInt(formData.get("vendorType") as string),
          assessor_name: formData.get("assessorName"),
          assessment_type: "Third Party Risk Assessment",
          assessment_status: "Draft",
          assessment_date: new Date().toISOString().split("T")[0],
        }),
      })

      const data = await response.json()
      if (data.success) {
        toast({
          title: "Success",
          description: "Assessment created successfully",
        })
        setIsNewAssessmentOpen(false)
        fetchAssessments()
      } else {
        throw new Error(data.error || "Failed to create assessment")
      }
    } catch (error) {
      console.error("Error creating assessment:", error)
      toast({
        title: "Error",
        description: "Failed to create assessment",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const openAssessment = async (assessment: Assessment) => {
    setCurrentAssessment(assessment)
    setLoading(true)

    try {
      const response = await fetch(`/api/third-party-risk-assessments/${assessment.id}`)
      const data = await response.json()

      if (data.success) {
        const responseMap: { [key: number]: AssessmentResponse } = {}
        const savedSet = new Set<number>()

        if (data.responses && Array.isArray(data.responses)) {
          data.responses.forEach((resp: any) => {
            responseMap[resp.template_id] = resp
            savedSet.add(resp.template_id)
          })
        }

        setResponses(responseMap)
        setSavedResponses(savedSet)
        setHasUnsavedChanges(false)
        setIsAssessmentOpen(true)
      }
    } catch (error) {
      console.error("Error fetching assessment:", error)
      toast({
        title: "Error",
        description: "Failed to load assessment",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const saveAllResponses = async () => {
    if (!currentAssessment) return

    setBulkSaving(true)
    let successCount = 0
    let errorCount = 0

    try {
      const responseEntries = Object.entries(responses).filter(([templateId, response]) => {
        const id = Number.parseInt(templateId)
        return (
          response &&
          (response.assessment_result ||
            response.assessment_remarks ||
            response.impact_score ||
            response.likelihood_score ||
            response.risk_treatment ||
            response.residual_impact_score ||
            response.residual_likelihood_score)
        )
      })

      if (responseEntries.length === 0) {
        toast({
          title: "No Data",
          description: "No responses to save",
          variant: "destructive",
        })
        setBulkSaving(false)
        return
      }

      // Process responses in batches of 5 to avoid overwhelming the server
      const batchSize = 5
      for (let i = 0; i < responseEntries.length; i += batchSize) {
        const batch = responseEntries.slice(i, i + batchSize)

        const batchPromises = batch.map(async ([templateId, response]) => {
          try {
            const apiResponse = await fetch("/api/third-party-risk-assessment-responses", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                assessmentId: currentAssessment.id,
                templateId: Number.parseInt(templateId),
                ...response,
              }),
            })

            const data = await apiResponse.json()
            if (data.success) {
              setSavedResponses((prev) => new Set([...prev, Number.parseInt(templateId)]))
              successCount++
            } else {
              errorCount++
            }
          } catch (error) {
            console.error(`Error saving response for template ${templateId}:`, error)
            errorCount++
          }
        })

        await Promise.all(batchPromises)
      }

      setHasUnsavedChanges(false)

      if (successCount > 0) {
        toast({
          title: "Bulk Save Complete",
          description: `Successfully saved ${successCount} responses${errorCount > 0 ? `, ${errorCount} failed` : ""}`,
        })
      }

      if (errorCount > 0 && successCount === 0) {
        toast({
          title: "Save Failed",
          description: `Failed to save ${errorCount} responses`,
          variant: "destructive",
        })
      }

      // Refresh the assessment data
      fetchAssessments()
    } catch (error) {
      console.error("Error in bulk save:", error)
      toast({
        title: "Error",
        description: "Failed to save responses",
        variant: "destructive",
      })
    } finally {
      setBulkSaving(false)
    }
  }

  const getRiskLevel = (impact: number, likelihood: number): string => {
    const score = impact * likelihood
    if (score >= 20) return "Critical"
    if (score >= 15) return "High"
    if (score >= 10) return "Medium"
    if (score >= 5) return "Low"
    return "Very Low"
  }

  const getCompletionPercentage = () => {
    if (!currentAssessment) return 0
    const totalTemplates = templates.reduce((sum, cat) => sum + cat.templates.length, 0)
    const completedResponses = Object.keys(responses).filter((templateId) => {
      const response = responses[Number.parseInt(templateId)]
      return response && response.assessment_result && response.impact_score && response.likelihood_score
    }).length
    return totalTemplates > 0 ? (completedResponses / totalTemplates) * 100 : 0
  }

  const updateResponseField = (templateId: number, field: string, value: any) => {
    setResponses((prev) => {
      const updatedResponse = {
        ...prev[templateId],
        [field]: value,
        assessment_id: currentAssessment?.id || 0,
        template_id: templateId,
      } as AssessmentResponse

      // Auto-calculate risk levels
      if (field === "impact_score" || field === "likelihood_score") {
        const impact = field === "impact_score" ? value : updatedResponse.impact_score
        const likelihood = field === "likelihood_score" ? value : updatedResponse.likelihood_score
        if (impact && likelihood) {
          updatedResponse.risk_level = getRiskLevel(impact, likelihood)
        }
      }

      if (field === "residual_impact_score" || field === "residual_likelihood_score") {
        const residualImpact = field === "residual_impact_score" ? value : updatedResponse.residual_impact_score
        const residualLikelihood =
          field === "residual_likelihood_score" ? value : updatedResponse.residual_likelihood_score
        if (residualImpact && residualLikelihood) {
          updatedResponse.residual_risk_level = getRiskLevel(residualImpact, residualLikelihood)
        }
      }

      return {
        ...prev,
        [templateId]: updatedResponse,
      }
    })

    // Mark as having unsaved changes if this response was previously saved
    if (savedResponses.has(templateId)) {
      setHasUnsavedChanges(true)
    }
  }

  const getUnsavedCount = () => {
    return Object.keys(responses).filter((templateId) => {
      const id = Number.parseInt(templateId)
      const response = responses[id]
      return (
        response &&
        (response.assessment_result ||
          response.assessment_remarks ||
          response.impact_score ||
          response.likelihood_score ||
          response.risk_treatment ||
          response.residual_impact_score ||
          response.residual_likelihood_score) &&
        !savedResponses.has(id)
      )
    }).length
  }

  const getTotalTemplateCount = () => {
    return templates.reduce((sum, cat) => sum + cat.templates.length, 0)
  }

  return (
    <div className="space-y-6">
      {/* Assessment Overview */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Third Party Risk Assessments</h2>
          <p className="text-gray-600 dark:text-gray-400">
            Conduct comprehensive risk assessments for third-party vendors
          </p>
        </div>
        <Dialog open={isNewAssessmentOpen} onOpenChange={setIsNewAssessmentOpen}>
          <DialogTrigger asChild>
            <ActionButtons isTableAction={false} onAdd={()=>{}} btnAddText="New Assessment"/>
            {/* <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
              <Plus className="h-4 w-4 mr-2" />
              New Assessment
            </Button> */}
          </DialogTrigger>
          <DialogContent className="bg-white/95 dark:bg-black/95 backdrop-blur-md border border-white/20">
            <form action={createNewAssessment}>
              <DialogHeader>
                <DialogTitle>Create New Risk Assessment</DialogTitle>
                <DialogDescription>Start a new third-party risk assessment for a vendor</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="vendorId">Vendor ID</Label>
                  <Input id="vendorId" name="vendorId" placeholder="TPV-001" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="vendorName">Vendor Name</Label>
                  <Input id="vendorName" name="vendorName" placeholder="Vendor Company Name" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="vendorType">Vendor Type</Label>
                  <Select name="vendorType" required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select vendor type" />
                    </SelectTrigger>
                    <SelectContent>
                      {vendorTypes.map((vendorType) => {
                        const IconComponent = iconMap[vendorType.icon as keyof typeof iconMap] || Building2
                        return (
                          <SelectItem key={vendorType.id} value={vendorType.id.toString()}>
                            <div className="flex items-center space-x-2">
                              <IconComponent className="h-4 w-4" style={{ color: vendorType.color }} />
                              <span>{vendorType.name}</span>
                            </div>
                          </SelectItem>
                        )
                      })}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="assessmentName">Assessment Name</Label>
                  <Input id="assessmentName" name="assessmentName" placeholder="Q1 2024 Risk Assessment" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="assessorName">Assessor Name</Label>
                  <Input id="assessorName" name="assessorName" placeholder="Your Name" required />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" disabled={loading}>
                  {loading ? "Creating..." : "Create Assessment"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Assessments List */}
      <Card className="bg-white/10 dark:bg-black/20 backdrop-blur-md border border-white/20">
        <CardHeader>
          <CardTitle className="text-gray-900 dark:text-white">Risk Assessments</CardTitle>
          <CardDescription className="text-gray-600 dark:text-gray-400">
            Manage and track third-party risk assessments
          </CardDescription>
        </CardHeader>
        <CardContent>
          {assessments.length === 0 ? (
            <div className="text-center py-8">
              <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 dark:text-gray-400 mb-4">No assessments found</p>
              <ActionButtons isTableAction={false} onAdd={()=>{setIsAssessmentOpen}} btnAddText="Create Your First Assessment"/>
              {/* <Button onClick={() => setIsNewAssessmentOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Create Your First Assessment
              </Button> */}
            </div>
          ) : (
            <div className="rounded-md border border-white/20 overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-white/5 dark:bg-black/20 border-white/10">
                    <TableHead className="text-gray-700 dark:text-gray-300">Assessment</TableHead>
                    <TableHead className="text-gray-700 dark:text-gray-300">Vendor</TableHead>
                    <TableHead className="text-gray-700 dark:text-gray-300">Status</TableHead>
                    <TableHead className="text-gray-700 dark:text-gray-300">Progress</TableHead>
                    <TableHead className="text-gray-700 dark:text-gray-300">Risk Level</TableHead>
                    <TableHead className="text-gray-700 dark:text-gray-300">Date</TableHead>
                    <TableHead className="text-gray-700 dark:text-gray-300">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {assessments.map((assessment) => (
                    <TableRow key={assessment.id} className="border-white/10 hover:bg-white/5">
                      <TableCell>
                        <div>
                          <div className="font-medium text-gray-900 dark:text-white">{assessment.assessment_name}</div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">by {assessment.assessor_name}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium text-gray-900 dark:text-white">{assessment.vendor_name}</div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">{assessment.vendor_id}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="border-blue-500/30 text-blue-300">
                          {assessment.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center space-x-2">
                            <Progress
                              value={
                                getTotalTemplateCount() > 0
                                  ? (assessment.total_responses / getTotalTemplateCount()) * 100
                                  : 0
                              }
                              className="w-20 h-2"
                            />
                            <span className="text-sm text-gray-600 dark:text-gray-400">
                              {assessment.total_responses}/{getTotalTemplateCount()}
                            </span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {assessment.overall_risk_level && (
                          <Badge
                            className={riskLevelColors[assessment.overall_risk_level as keyof typeof riskLevelColors]}
                          >
                            {assessment.overall_risk_level}
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-gray-700 dark:text-gray-300">
                        {new Date(assessment.assessment_date).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <ActionButtons isTableAction={true} 
                                  //onView={() => {}} 
                                  onEdit={() => {()=>{openAssessment(assessment)}}} 
                                actionObj={assessment}
                                  // onDelete={() => {}}   
                                  // deleteDialogTitle={}                                
                                  />
                          {/* <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openAssessment(assessment)}
                            className="text-slate-300 hover:bg-slate-700"
                          >
                            <Edit className="h-4 w-4" />
                          </Button> */}
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-slate-300 hover:bg-slate-700"
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Assessment Matrix Dialog */}
      <Dialog open={isAssessmentOpen} onOpenChange={setIsAssessmentOpen}>
        <DialogContent className="bg-white/95 dark:bg-black/95 backdrop-blur-md border border-white/20 max-w-[95vw] max-h-[90vh] overflow-hidden">
          {currentAssessment && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center justify-between">
                  <span>{currentAssessment.assessment_name}</span>
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline" className="border-blue-500/30 text-blue-300">
                      {currentAssessment.status}
                    </Badge>
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {getCompletionPercentage().toFixed(0)}% Complete
                    </span>
                  </div>
                </DialogTitle>
                <DialogDescription>
                  Vendor: {currentAssessment.vendor_name} ({currentAssessment.vendor_id})
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 overflow-y-auto max-h-[70vh]">
                {/* PROMINENT BULK ACTIONS SECTION */}
                <div className="bg-gradient-to-r from-blue-50/50 to-purple-50/50 dark:from-blue-900/20 dark:to-purple-900/20 p-6 rounded-lg border-2 border-blue-200/50 dark:border-blue-700/50 shadow-lg">
                  <div className="flex items-center justify-between space-x-4">
                    <div className="flex-1 space-y-3">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Assessment Progress</h3>
                        <span className="text-lg font-bold text-blue-600 dark:text-blue-400">
                          {getCompletionPercentage().toFixed(0)}% Complete
                        </span>
                      </div>
                      <Progress value={getCompletionPercentage()} className="w-full h-3" />
                      <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
                        <span>
                          {
                            Object.keys(responses).filter((id) => {
                              const resp = responses[Number.parseInt(id)]
                              return resp && resp.assessment_result && resp.impact_score && resp.likelihood_score
                            }).length
                          }{" "}
                          of {getTotalTemplateCount()} completed
                        </span>
                        <span>{getUnsavedCount()} unsaved changes</span>
                      </div>
                    </div>

                    <div className="flex flex-col items-end space-y-3">
                      {getUnsavedCount() > 0 && (
                        <Badge
                          variant="outline"
                          className="border-yellow-500/50 text-yellow-600 dark:text-yellow-400 bg-yellow-50/50 dark:bg-yellow-900/20 px-3 py-1"
                        >
                          <AlertCircle className="h-3 w-3 mr-1" />
                          {getUnsavedCount()} unsaved
                        </Badge>
                      )}

                      <Button
                        onClick={saveAllResponses}
                        disabled={bulkSaving || Object.keys(responses).length === 0}
                        size="lg"
                        className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold px-6 py-3 shadow-lg hover:shadow-xl transition-all duration-200"
                      >
                        {bulkSaving ? (
                          <>
                            <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent mr-2" />
                            Saving All Responses...
                          </>
                        ) : (
                          <>
                            <SaveAll className="h-5 w-5 mr-2" />
                            Save All Responses ({Object.keys(responses).length})
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Assessment Matrix Table */}
                <div className="border border-white/20 rounded-lg overflow-hidden">
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-white/5 dark:bg-black/20 border-white/10">
                          <TableHead className="text-xs font-medium text-gray-700 dark:text-gray-300 w-16">
                            Risk ID
                          </TableHead>
                          <TableHead className="text-xs font-medium text-gray-700 dark:text-gray-300 w-48">
                            Category & Risk Title
                          </TableHead>
                          <TableHead className="text-xs font-medium text-gray-700 dark:text-gray-300 w-32">
                            Control Catalogue
                          </TableHead>
                          <TableHead className="text-xs font-medium text-gray-700 dark:text-gray-300 w-24">
                            Assessment
                          </TableHead>
                          <TableHead className="text-xs font-medium text-gray-700 dark:text-gray-300 w-32">
                            Remarks
                          </TableHead>
                          <TableHead className="text-xs font-medium text-gray-700 dark:text-gray-300 w-20">
                            Impact
                          </TableHead>
                          <TableHead className="text-xs font-medium text-gray-700 dark:text-gray-300 w-20">
                            Likelihood
                          </TableHead>
                          <TableHead className="text-xs font-medium text-gray-700 dark:text-gray-300 w-20">
                            Risk Level
                          </TableHead>
                          <TableHead className="text-xs font-medium text-gray-700 dark:text-gray-300 w-32">
                            Treatment
                          </TableHead>
                          <TableHead className="text-xs font-medium text-gray-700 dark:text-gray-300 w-24">
                            Residual I/L
                          </TableHead>
                          <TableHead className="text-xs font-medium text-gray-700 dark:text-gray-300 w-20">
                            Residual Risk
                          </TableHead>
                          <TableHead className="text-xs font-medium text-gray-700 dark:text-gray-300 w-16">
                            Status
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {templates.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={12} className="text-center py-8">
                              <AlertCircle className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                              <p className="text-gray-500 dark:text-gray-400">No risk templates available</p>
                            </TableCell>
                          </TableRow>
                        ) : (
                          templates.map((category) =>
                            category.templates.map((template) => {
                              const response = responses[template.id] || {
                                assessment_id: currentAssessment.id,
                                template_id: template.id,
                                assessment_result: "",
                                assessment_remarks: "",
                                impact_score: 0,
                                likelihood_score: 0,
                                risk_level: "",
                                risk_treatment: "",
                                residual_impact_score: 0,
                                residual_likelihood_score: 0,
                                residual_risk_level: "",
                              }

                              const riskLevel =
                                response.impact_score && response.likelihood_score
                                  ? getRiskLevel(response.impact_score, response.likelihood_score)
                                  : ""

                              const residualRiskLevel =
                                response.residual_impact_score && response.residual_likelihood_score
                                  ? getRiskLevel(response.residual_impact_score, response.residual_likelihood_score)
                                  : ""

                              const isSaved = savedResponses.has(template.id)
                              const hasData =
                                response.assessment_result || response.impact_score || response.likelihood_score

                              return (
                                <TableRow key={template.id} className="border-white/10 hover:bg-white/5">
                                  <TableCell className="text-xs font-medium text-gray-700 dark:text-gray-300">
                                    {template.risk_id}
                                  </TableCell>
                                  <TableCell className="text-xs">
                                    <div className="space-y-1">
                                      <div className="font-medium text-gray-900 dark:text-white text-xs">
                                        {template.category_name}
                                      </div>
                                      <div className="text-gray-600 dark:text-gray-400 text-xs">
                                        {template.risk_title}
                                      </div>
                                    </div>
                                  </TableCell>
                                  <TableCell className="text-xs text-gray-600 dark:text-gray-400">
                                    {template.control_catalogue}
                                  </TableCell>
                                  <TableCell>
                                    <Select
                                      value={response.assessment_result || ""}
                                      onValueChange={(value) =>
                                        updateResponseField(template.id, "assessment_result", value)
                                      }
                                    >
                                      <SelectTrigger className="h-8 text-xs">
                                        <SelectValue placeholder="Select" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="Effective">Effective</SelectItem>
                                        <SelectItem value="Partial Effective">Partial Effective</SelectItem>
                                        <SelectItem value="Not Effective">Not Effective</SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </TableCell>
                                  <TableCell>
                                    <Textarea
                                      placeholder="Remarks"
                                      value={response.assessment_remarks || ""}
                                      onChange={(e) =>
                                        updateResponseField(template.id, "assessment_remarks", e.target.value)
                                      }
                                      className="h-8 text-xs resize-none"
                                    />
                                  </TableCell>
                                  <TableCell>
                                    <Select
                                      value={response.impact_score?.toString() || ""}
                                      onValueChange={(value) =>
                                        updateResponseField(template.id, "impact_score", Number.parseInt(value))
                                      }
                                    >
                                      <SelectTrigger className="h-8 text-xs">
                                        <SelectValue placeholder="I" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        {[1, 2, 3, 4, 5].map((num) => (
                                          <SelectItem key={num} value={num.toString()}>
                                            {num}
                                          </SelectItem>
                                        ))}
                                      </SelectContent>
                                    </Select>
                                  </TableCell>
                                  <TableCell>
                                    <Select
                                      value={response.likelihood_score?.toString() || ""}
                                      onValueChange={(value) =>
                                        updateResponseField(template.id, "likelihood_score", Number.parseInt(value))
                                      }
                                    >
                                      <SelectTrigger className="h-8 text-xs">
                                        <SelectValue placeholder="L" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        {[1, 2, 3, 4, 5].map((num) => (
                                          <SelectItem key={num} value={num.toString()}>
                                            {num}
                                          </SelectItem>
                                        ))}
                                      </SelectContent>
                                    </Select>
                                  </TableCell>
                                  <TableCell>
                                    {residualRiskLevel && (
                                      <Badge
                                        className={riskLevelColors[residualRiskLevel as keyof typeof riskLevelColors]}
                                        variant="outline"
                                      >
                                        {residualRiskLevel}
                                      </Badge>
                                    )}
                                  </TableCell>
                                  <TableCell>
                                    <div className="flex items-center justify-center">
                                      {isSaved && hasData ? (
                                        <CheckCircle className="h-4 w-4 text-green-400" />
                                      ) : hasData ? (
                                        <div className="h-2 w-2 rounded-full bg-yellow-400" title="Unsaved changes" />
                                      ) : (
                                        <div className="h-2 w-2 rounded-full bg-gray-400" title="No data" />
                                      )}
                                    </div>
                                  </TableCell>
                                </TableRow>
                              )
                            }),
                          )
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
