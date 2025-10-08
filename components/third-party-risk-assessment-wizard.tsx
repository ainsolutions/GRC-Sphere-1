"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import {
  AlertCircle,
  CheckCircle2,
  Building2,
  Shield,
  ArrowLeft,
  ArrowRight,
  AlertTriangle,
  Target,
} from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { toast } from "sonner"
import { Checkbox } from "@/components/ui/checkbox"

interface Vendor {
  id: number
  vendor_name: string
  vendor_type: string
  contact_email: string
}

interface Contract {
  id: number
  contract_name: string
  vendor_id: number
  contract_type: string
  status: string
}

interface RiskQuestion {
  id: string
  category: string
  question: string
  description: string
  weight: number
  is_mandatory: boolean
  best_practice_guidance: string
}

interface QuestionResponse {
  question_id: string
  response: string
  likelihood_score: number
  impact_score: number
  risk_score: number
  mitigation_status: string
  notes: string
  evidence_provided: boolean
  gap_identified: boolean
  remediation_plan: string
  remediation_priority: string
  remediation_timeline: string
}

interface GapAnalysis {
  question_id: string
  gap_description: string
  current_state: string
  target_state: string
  remediation_actions: string[]
  priority: string
  timeline: string
  responsible_party: string
  status: string
}

const RISK_QUESTIONNAIRES: RiskQuestion[] = [
  // Security & Data Protection
  {
    id: "SEC-001",
    category: "Security & Data Protection",
    question: "Does the vendor have ISO 27001 or equivalent security certification?",
    description: "Assess if the vendor maintains internationally recognized security standards",
    weight: 3,
    is_mandatory: true,
    best_practice_guidance:
      "Vendors should maintain ISO 27001, SOC 2 Type II, or equivalent certifications with annual audits",
  },
  {
    id: "SEC-002",
    category: "Security & Data Protection",
    question: "Does the vendor implement multi-factor authentication for all system access?",
    description: "Evaluate access control mechanisms and authentication requirements",
    weight: 2,
    is_mandatory: true,
    best_practice_guidance: "All privileged and user accounts should require MFA with modern authentication methods",
  },
  {
    id: "SEC-003",
    category: "Security & Data Protection",
    question: "Does the vendor encrypt data at rest and in transit using industry standards?",
    description: "Assess data encryption practices and key management",
    weight: 3,
    is_mandatory: true,
    best_practice_guidance:
      "Data should be encrypted using AES-256 or equivalent, with proper key management practices",
  },
  {
    id: "SEC-004",
    category: "Security & Data Protection",
    question: "Does the vendor conduct regular penetration testing and vulnerability assessments?",
    description: "Evaluate proactive security testing and vulnerability management",
    weight: 2,
    is_mandatory: false,
    best_practice_guidance:
      "Annual penetration testing and quarterly vulnerability assessments by qualified third parties",
  },
  {
    id: "SEC-005",
    category: "Security & Data Protection",
    question: "Does the vendor have a documented incident response plan with 24/7 capability?",
    description: "Assess incident response readiness and communication procedures",
    weight: 2,
    is_mandatory: true,
    best_practice_guidance:
      "Documented incident response plan with defined roles, escalation procedures, and customer notification timelines",
  },

  // Privacy & Data Handling
  {
    id: "PRI-001",
    category: "Privacy & Data Handling",
    question: "Is the vendor compliant with applicable data protection regulations (GDPR, CCPA, etc.)?",
    description: "Assess compliance with relevant privacy and data protection laws",
    weight: 3,
    is_mandatory: true,
    best_practice_guidance:
      "Full compliance with GDPR, CCPA, and other applicable regional data protection regulations",
  },
  {
    id: "PRI-002",
    category: "Privacy & Data Handling",
    question: "Does the vendor have clear data retention and deletion policies?",
    description: "Evaluate data lifecycle management and deletion capabilities",
    weight: 2,
    is_mandatory: true,
    best_practice_guidance: "Documented data retention schedules with automated deletion capabilities and audit trails",
  },
  {
    id: "PRI-003",
    category: "Privacy & Data Handling",
    question: "Does the vendor provide data portability and subject access rights?",
    description: "Assess ability to support data subject rights and data portability",
    weight: 2,
    is_mandatory: true,
    best_practice_guidance: "Automated systems to handle data subject requests within regulatory timeframes",
  },
  {
    id: "PRI-004",
    category: "Privacy & Data Handling",
    question: "Does the vendor conduct privacy impact assessments for data processing activities?",
    description: "Evaluate privacy by design implementation and risk assessment",
    weight: 1,
    is_mandatory: false,
    best_practice_guidance: "Regular privacy impact assessments with documented risk mitigation measures",
  },

  // Operational Risk
  {
    id: "OPS-001",
    category: "Operational Risk",
    question: "Does the vendor have documented business continuity and disaster recovery plans?",
    description: "Assess business continuity planning and disaster recovery capabilities",
    weight: 3,
    is_mandatory: true,
    best_practice_guidance: "Tested BCP/DR plans with defined RTOs/RPOs and regular testing schedules",
  },
  {
    id: "OPS-002",
    category: "Operational Risk",
    question: "Does the vendor maintain appropriate service level agreements with monitoring?",
    description: "Evaluate service level commitments and performance monitoring",
    weight: 2,
    is_mandatory: true,
    best_practice_guidance: "Clear SLAs with 99.9%+ uptime commitments and real-time monitoring dashboards",
  },
  {
    id: "OPS-003",
    category: "Operational Risk",
    question: "Does the vendor have redundant infrastructure and failover capabilities?",
    description: "Assess infrastructure resilience and redundancy measures",
    weight: 2,
    is_mandatory: false,
    best_practice_guidance: "Multi-region deployment with automated failover and load balancing capabilities",
  },
  {
    id: "OPS-004",
    category: "Operational Risk",
    question: "Does the vendor provide 24/7 technical support with defined response times?",
    description: "Evaluate support capabilities and response time commitments",
    weight: 2,
    is_mandatory: true,
    best_practice_guidance: "24/7 support with tiered response times based on severity levels",
  },
  {
    id: "OPS-005",
    category: "Operational Risk",
    question: "Does the vendor have documented change management processes?",
    description: "Assess change control and release management practices",
    weight: 1,
    is_mandatory: false,
    best_practice_guidance: "Formal change management with approval workflows, testing, and rollback procedures",
  },

  // Financial Stability
  {
    id: "FIN-001",
    category: "Financial Stability",
    question: "Has the vendor provided audited financial statements for the last 3 years?",
    description: "Assess financial transparency and stability over time",
    weight: 2,
    is_mandatory: true,
    best_practice_guidance: "Audited financial statements showing consistent profitability and strong cash flow",
  },
  {
    id: "FIN-002",
    category: "Financial Stability",
    question: "Does the vendor have appropriate insurance coverage (E&O, cyber liability)?",
    description: "Evaluate insurance protection for potential liabilities",
    weight: 2,
    is_mandatory: true,
    best_practice_guidance: "Comprehensive insurance including cyber liability, E&O, and general liability coverage",
  },
  {
    id: "FIN-003",
    category: "Financial Stability",
    question: "Is the vendor financially stable with positive cash flow and profitability?",
    description: "Assess current financial health and sustainability",
    weight: 3,
    is_mandatory: true,
    best_practice_guidance: "Positive cash flow, profitability, and strong balance sheet with low debt-to-equity ratio",
  },
  {
    id: "FIN-004",
    category: "Financial Stability",
    question: "Does the vendor have diversified revenue streams and customer base?",
    description: "Evaluate business model sustainability and customer concentration risk",
    weight: 1,
    is_mandatory: false,
    best_practice_guidance: "Diversified customer base with no single customer representing >20% of revenue",
  },

  // Compliance & Regulatory
  {
    id: "COM-001",
    category: "Compliance & Regulatory",
    question: "Does the vendor comply with industry-specific regulations applicable to your business?",
    description: "Assess compliance with relevant industry regulations (HIPAA, PCI-DSS, etc.)",
    weight: 3,
    is_mandatory: true,
    best_practice_guidance: "Full compliance with all applicable industry regulations with regular compliance audits",
  },
  {
    id: "COM-002",
    category: "Compliance & Regulatory",
    question: "Does the vendor have documented policies for regulatory compliance management?",
    description: "Evaluate compliance program maturity and documentation",
    weight: 2,
    is_mandatory: true,
    best_practice_guidance: "Comprehensive compliance program with documented policies, procedures, and training",
  },
  {
    id: "COM-003",
    category: "Compliance & Regulatory",
    question: "Does the vendor conduct regular compliance audits and assessments?",
    description: "Assess ongoing compliance monitoring and validation practices",
    weight: 2,
    is_mandatory: false,
    best_practice_guidance: "Annual compliance audits by qualified third parties with remediation tracking",
  },
  {
    id: "COM-004",
    category: "Compliance & Regulatory",
    question: "Does the vendor provide compliance reporting and audit support?",
    description: "Evaluate vendor's ability to support your compliance requirements",
    weight: 1,
    is_mandatory: false,
    best_practice_guidance: "Regular compliance reports and dedicated support for customer audit requirements",
  },

  // Vendor Management
  {
    id: "VEN-001",
    category: "Vendor Management",
    question: "Does the vendor have a formal vendor risk management program for their suppliers?",
    description: "Assess fourth-party risk management capabilities",
    weight: 2,
    is_mandatory: false,
    best_practice_guidance:
      "Comprehensive vendor risk management program with regular assessments of critical suppliers",
  },
  {
    id: "VEN-002",
    category: "Vendor Management",
    question: "Does the vendor provide transparency into their supply chain and dependencies?",
    description: "Evaluate supply chain visibility and dependency management",
    weight: 2,
    is_mandatory: true,
    best_practice_guidance: "Clear documentation of critical dependencies and supply chain risk mitigation strategies",
  },
  {
    id: "VEN-003",
    category: "Vendor Management",
    question: "Does the vendor have established contract terms for data protection and security?",
    description: "Assess contractual protections and liability allocation",
    weight: 2,
    is_mandatory: true,
    best_practice_guidance:
      "Comprehensive contract terms covering data protection, security requirements, and liability",
  },
]

export function ThirdPartyRiskAssessmentWizard() {
  const [currentStep, setCurrentStep] = useState(1)
  const [vendors, setVendors] = useState<Vendor[]>([])
  const [contracts, setContracts] = useState<Contract[]>([])
  const [filteredContracts, setFilteredContracts] = useState<Contract[]>([])
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Form data
  const [assessmentData, setAssessmentData] = useState({
    assessment_name: "",
    vendor_id: "",
    contract_id: "",
    assessment_type: "Initial Assessment",
    assessment_status: "Draft",
    assessor_name: "",
    description: "",
    assessment_date: new Date().toISOString().split("T")[0],
    next_review_date: "",
  })

  const [responses, setResponses] = useState<Record<string, QuestionResponse>>({})
  const [gapAnalyses, setGapAnalyses] = useState<Record<string, GapAnalysis>>({})

  // Load initial data
  useEffect(() => {
    loadVendors()
    loadContracts()
    initializeResponses()
  }, [])

  const initializeResponses = () => {
    const initialResponses: Record<string, QuestionResponse> = {}
    RISK_QUESTIONNAIRES.forEach((question) => {
      initialResponses[question.id] = {
        question_id: question.id,
        response: "",
        likelihood_score: 3,
        impact_score: 3,
        risk_score: 9,
        mitigation_status: "Not Started",
        notes: "",
        evidence_provided: false,
        gap_identified: false,
        remediation_plan: "",
        remediation_priority: "Medium",
        remediation_timeline: "",
      }
    })
    setResponses(initialResponses)
  }

  const loadVendors = async () => {
    try {
      const response = await fetch("/api/vendors")
      const data = await response.json()

      console.log("[v0] Vendor API response:", data)

      if (data.success) {
        let vendorList = []

        // Handle nested structure: data.data.vendors
        if (data.data && Array.isArray(data.data.vendors)) {
          vendorList = data.data.vendors
        }
        // Handle direct structure: data.vendors
        else if (Array.isArray(data.vendors)) {
          vendorList = data.vendors
        }

        console.log("[v0] Processed vendor list:", vendorList)
        setVendors(vendorList)

        if (vendorList.length === 0) {
          toast.error("No vendors found")
        }
      } else {
        console.error("API returned error:", data.error || "Unknown error")
        setVendors([])
        toast.error(data.error || "Failed to load vendors")
      }
    } catch (error) {
      console.error("Error loading vendors:", error)
      setVendors([])
      toast.error("Failed to load vendors")
    }
  }

  const loadContracts = async () => {
    try {
      const response = await fetch("/api/contracts")
      const data = await response.json()

      console.log("[v0] Contract API response:", data)

      if (data.success) {
        let contractList = []

        // Handle nested structure: data.data.contracts
        if (data.data && Array.isArray(data.data.contracts)) {
          contractList = data.data.contracts
        }
        // Handle direct structure: data.contracts
        else if (Array.isArray(data.contracts)) {
          contractList = data.contracts
        }

        console.log("[v0] Processed contract list:", contractList)
        setContracts(contractList)
      } else {
        console.error("API returned error:", data.error || "Unknown error")
        setContracts([])
        toast.error(data.error || "Failed to load contracts")
      }
    } catch (error) {
      console.error("Error loading contracts:", error)
      setContracts([])
      toast.error("Failed to load contracts")
    }
  }

  // Handle vendor selection
  const handleVendorChange = (vendorId: string) => {
    setAssessmentData((prev) => ({ ...prev, vendor_id: vendorId, contract_id: "" }))

    // Filter contracts for selected vendor - ensure contracts is an array
    const vendorContracts = Array.isArray(contracts) ? contracts.filter((c) => c.vendor_id.toString() === vendorId) : []
    setFilteredContracts(vendorContracts)
  }

  // Handle response changes
  const updateResponse = (questionId: string, field: keyof QuestionResponse, value: any) => {
    setResponses((prev) => {
      const updated = {
        ...prev,
        [questionId]: {
          ...prev[questionId],
          [field]: value,
        },
      }

      // Recalculate risk score if likelihood or impact changed
      if (field === "likelihood_score" || field === "impact_score") {
        updated[questionId].risk_score = updated[questionId].likelihood_score * updated[questionId].impact_score
      }

      return updated
    })
  }

  const updateGapAnalysis = (questionId: string, field: keyof GapAnalysis, value: any) => {
    setGapAnalyses((prev) => ({
      ...prev,
      [questionId]: {
        ...prev[questionId],
        question_id: questionId,
        [field]: value,
      },
    }))
  }

  // Calculate overall scores
  const calculateOverallScores = () => {
    const categories = [
      "Security & Data Protection",
      "Privacy & Data Handling",
      "Operational Risk",
      "Financial Stability",
      "Compliance & Regulatory",
      "Vendor Management",
    ]
    const categoryScores: Record<string, number> = {}
    const categoryCounts: Record<string, number> = {}

    categories.forEach((category) => {
      categoryScores[category] = 0
      categoryCounts[category] = 0
    })

    RISK_QUESTIONNAIRES.forEach((question) => {
      const response = responses[question.id]
      if (response) {
        const category = question.category
        if (categoryScores.hasOwnProperty(category)) {
          categoryScores[category] += response.risk_score * question.weight
          categoryCounts[category] += question.weight
        }
      }
    })

    // Calculate weighted averages
    const scores: Record<string, number> = {}
    categories.forEach((category) => {
      scores[category] =
        categoryCounts[category] > 0 ? Math.round(categoryScores[category] / categoryCounts[category]) : 0
    })

    const overall = Math.round(Object.values(scores).reduce((sum, score) => sum + score, 0) / categories.length)

    return { overall, ...scores }
  }

  const calculateGapSummary = () => {
    const gaps = Object.values(responses).filter((r) => r.gap_identified)
    const gapsByPriority = {
      Critical: gaps.filter((g) => g.remediation_priority === "Critical").length,
      High: gaps.filter((g) => g.remediation_priority === "High").length,
      Medium: gaps.filter((g) => g.remediation_priority === "Medium").length,
      Low: gaps.filter((g) => g.remediation_priority === "Low").length,
    }

    return {
      totalGaps: gaps.length,
      gapsByPriority,
      completionRate:
        gaps.length > 0
          ? Math.round((gaps.filter((g) => g.mitigation_status === "Completed").length / gaps.length) * 100)
          : 0,
    }
  }

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true)

      const identifiedGaps = Object.entries(responses)
        .filter(([_, response]) => response.gap_identified)
        .map(([questionId, response]) => {
          const question = RISK_QUESTIONNAIRES.find((q) => q.id === questionId)
          const gapData = gapAnalyses[questionId] || {}

          return {
            gap_id: `GAP-${Date.now()}-${questionId}`,
            title: `${question?.category || "General"} - ${question?.question || "Gap"}`,
            gap_title: `${question?.category || "General"} - ${question?.question || "Gap"}`,
            description: gapData.gap_description || response.remediation_plan || "Gap identified during assessment",
            gap_description: gapData.gap_description || response.remediation_plan || "Gap identified during assessment",
            severity: response.remediation_priority || "Medium",
            gap_severity: response.remediation_priority || "Medium",
            current_state: gapData.current_state || "Not Implemented",
            target_state: gapData.target_state || "Fully Implemented",
            remediation_strategy: response.remediation_plan || "",
            recommended_actions: response.remediation_plan || "",
            priority_ranking:
              response.remediation_priority === "Critical"
                ? 1
                : response.remediation_priority === "High"
                  ? 2
                  : response.remediation_priority === "Medium"
                    ? 3
                    : 4,
            responsible_party: gapData.responsible_party || "Vendor",
            target_completion_date: response.remediation_timeline
              ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]
              : null,
            remediation_status: "Identified",
          }
        })

      const assessmentPayload = {
        assessment_name: assessmentData.assessment_name,
        vendor_id: assessmentData.vendor_id,
        vendor_name: assessmentData.vendor_name,
        contract_id: assessmentData.contract_id,
        assessor_name: assessmentData.assessor_name,
        assessor_email: assessmentData.assessor_email,
        assessment_date: assessmentData.assessment_date,
        questionnaire_responses: Object.entries(responses).map(([questionId, response]) => ({
          question_id: questionId,
          id: questionId,
          category: RISK_QUESTIONNAIRES.find((q) => q.id === questionId)?.category || "General",
          response: response.response,
          answer: response.response,
          risk_score: response.risk_score || 0,
          risk_level: response.risk_level || "Low",
          notes: response.notes || "",
          evidence: response.evidence || "",
          gap_identified: response.gap_identified || false,
          remediation_plan: response.remediation_plan || "",
          remediation_priority: response.remediation_priority || "Medium",
          remediation_timeline: response.remediation_timeline || "",
        })),
        gap_analysis: identifiedGaps,
        remediation_plan: calculateGapSummary(),
      }

      const assessmentResponse = await fetch("/api/third-party-risk-assessments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(assessmentPayload),
      })

      const assessmentResult = await assessmentResponse.json()
      if (!assessmentResult.success) {
        throw new Error(assessmentResult.error)
      }

      toast.success("Risk assessment completed successfully!")

      // Reset form
      setCurrentStep(1)
      setAssessmentData({
        assessment_name: "",
        vendor_id: "",
        contract_id: "",
        assessment_type: "Initial Assessment",
        assessment_status: "Draft",
        assessor_name: "",
        description: "",
        assessment_date: new Date().toISOString().split("T")[0],
        next_review_date: "",
      })
      initializeResponses()
      setGapAnalyses({})
    } catch (error) {
      console.error("Error submitting assessment:", error)
      toast.error("Failed to submit assessment")
    } finally {
      setIsSubmitting(false)
    }
  }

  const getRiskLevel = (score: number): string => {
    if (score >= 16) return "Critical"
    if (score >= 12) return "High"
    if (score >= 8) return "Medium"
    if (score >= 4) return "Low"
    return "Very Low"
  }

  const getRiskColor = (level: string): string => {
    switch (level) {
      case "Critical":
        return "bg-red-500"
      case "High":
        return "bg-orange-500"
      case "Medium":
        return "bg-yellow-500"
      case "Low":
        return "bg-blue-500"
      default:
        return "bg-green-500"
    }
  }

  const canProceedToStep2 = assessmentData.vendor_id && assessmentData.assessment_name && assessmentData.assessor_name
  const canProceedToStep3 = Object.keys(responses).length > 0
  const progress = (currentStep / 4) * 100

  return (
    <div className="space-y-6">
      {/* Progress Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Third Party Risk Assessment Wizard
              </CardTitle>
              <CardDescription>Complete a comprehensive risk assessment for your third-party vendor</CardDescription>
            </div>
            <Badge variant="outline">Step {currentStep} of 4</Badge>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Setup</span>
              <span>Risk Evaluation</span>
              <span>Gap Analysis</span>
              <span>Review & Submit</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        </CardHeader>
      </Card>

      {/* Step 1: Assessment Setup */}
      {currentStep === 1 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Assessment Setup
            </CardTitle>
            <CardDescription>Configure the basic details for your risk assessment</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="assessment_name">Assessment Name *</Label>
                <Input
                  id="assessment_name"
                  value={assessmentData.assessment_name}
                  onChange={(e) => setAssessmentData((prev) => ({ ...prev, assessment_name: e.target.value }))}
                  placeholder="e.g., Q1 2024 Cloud Provider Assessment"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="vendor_id">Vendor *</Label>
                <Select value={assessmentData.vendor_id} onValueChange={handleVendorChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select vendor" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.isArray(vendors) &&
                      vendors.map((vendor) => (
                        <SelectItem key={vendor.id} value={vendor.id.toString()}>
                          <div className="flex flex-col">
                            <span>{vendor.vendor_name}</span>
                            <span className="text-xs text-muted-foreground">{vendor.vendor_type}</span>
                          </div>
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="contract_id">Contract (Optional)</Label>
                <Select
                  value={assessmentData.contract_id}
                  onValueChange={(value) => setAssessmentData((prev) => ({ ...prev, contract_id: value }))}
                  disabled={!assessmentData.vendor_id}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select contract" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.isArray(filteredContracts) &&
                      filteredContracts.map((contract) => (
                        <SelectItem key={contract.id} value={contract.id.toString()}>
                          <div className="flex flex-col">
                            <span>{contract.contract_name}</span>
                            <span className="text-xs text-muted-foreground">
                              {contract.contract_type} - {contract.status}
                            </span>
                          </div>
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="assessment_type">Assessment Type</Label>
                <Select
                  value={assessmentData.assessment_type}
                  onValueChange={(value) => setAssessmentData((prev) => ({ ...prev, assessment_type: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Initial Assessment">Initial Assessment</SelectItem>
                    <SelectItem value="Annual Review">Annual Review</SelectItem>
                    <SelectItem value="Contract Renewal">Contract Renewal</SelectItem>
                    <SelectItem value="Incident Response">Incident Response</SelectItem>
                    <SelectItem value="Ad-hoc Review">Ad-hoc Review</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="assessor_name">Assessor Name *</Label>
                <Input
                  id="assessor_name"
                  value={assessmentData.assessor_name}
                  onChange={(e) => setAssessmentData((prev) => ({ ...prev, assessor_name: e.target.value }))}
                  placeholder="Enter assessor name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="assessment_date">Assessment Date</Label>
                <Input
                  id="assessment_date"
                  type="date"
                  value={assessmentData.assessment_date}
                  onChange={(e) => setAssessmentData((prev) => ({ ...prev, assessment_date: e.target.value }))}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={assessmentData.description}
                onChange={(e) => setAssessmentData((prev) => ({ ...prev, description: e.target.value }))}
                placeholder="Describe the purpose and scope of this assessment..."
                rows={3}
              />
            </div>

            <div className="flex justify-end">
              <Button onClick={() => setCurrentStep(2)} disabled={!canProceedToStep2 || loading}>
                Next: Risk Evaluation
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 2: Risk Evaluation */}
      {currentStep === 2 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5" />
              Risk Evaluation
            </CardTitle>
            <CardDescription>Assess each risk category based on industry best practices</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Risk Categories */}
            <Tabs defaultValue="all" className="w-full">
              <TabsList className="grid w-full grid-cols-7">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="Security & Data Protection">Security</TabsTrigger>
                <TabsTrigger value="Privacy & Data Handling">Privacy</TabsTrigger>
                <TabsTrigger value="Operational Risk">Operational</TabsTrigger>
                <TabsTrigger value="Financial Stability">Financial</TabsTrigger>
                <TabsTrigger value="Compliance & Regulatory">Compliance</TabsTrigger>
                <TabsTrigger value="Vendor Management">Vendor Mgmt</TabsTrigger>
              </TabsList>

              <TabsContent value="all" className="space-y-4">
                {RISK_QUESTIONNAIRES.map((question) => (
                  <RiskQuestionCard
                    key={question.id}
                    question={question}
                    response={responses[question.id]}
                    onUpdate={(field, value) => updateResponse(question.id, field, value)}
                  />
                ))}
              </TabsContent>

              {[
                "Security & Data Protection",
                "Privacy & Data Handling",
                "Operational Risk",
                "Financial Stability",
                "Compliance & Regulatory",
                "Vendor Management",
              ].map((category) => (
                <TabsContent key={category} value={category} className="space-y-4">
                  {RISK_QUESTIONNAIRES.filter((question) => question.category === category).map((question) => (
                    <RiskQuestionCard
                      key={question.id}
                      question={question}
                      response={responses[question.id]}
                      onUpdate={(field, value) => updateResponse(question.id, field, value)}
                    />
                  ))}
                </TabsContent>
              ))}
            </Tabs>

            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setCurrentStep(1)}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Button>
              <Button onClick={() => setCurrentStep(3)} disabled={!canProceedToStep3}>
                Next: Gap Analysis
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 3: Gap Analysis */}
      {currentStep === 3 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Gap Analysis & Remediation
            </CardTitle>
            <CardDescription>Identify gaps and create remediation plans for identified risks</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Gap Summary */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="text-2xl font-bold text-red-600">{calculateGapSummary().totalGaps}</div>
                  <div className="text-sm text-muted-foreground">Total Gaps</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="text-2xl font-bold text-orange-600">
                    {calculateGapSummary().gapsByPriority.Critical}
                  </div>
                  <div className="text-sm text-muted-foreground">Critical Priority</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="text-2xl font-bold text-yellow-600">{calculateGapSummary().gapsByPriority.High}</div>
                  <div className="text-sm text-muted-foreground">High Priority</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="text-2xl font-bold text-green-600">{calculateGapSummary().completionRate}%</div>
                  <div className="text-sm text-muted-foreground">Completion Rate</div>
                </CardContent>
              </Card>
            </div>

            {/* Gap Analysis Items */}
            <div className="space-y-4">
              {RISK_QUESTIONNAIRES.filter((q) => responses[q.id]?.gap_identified).map((question) => (
                <GapAnalysisCard
                  key={question.id}
                  question={question}
                  response={responses[question.id]}
                  gapAnalysis={gapAnalyses[question.id]}
                  onUpdateResponse={(field, value) => updateResponse(question.id, field, value)}
                  onUpdateGap={(field, value) => updateGapAnalysis(question.id, field, value)}
                />
              ))}

              {Object.values(responses).filter((r) => r.gap_identified).length === 0 && (
                <Alert>
                  <CheckCircle2 className="h-4 w-4" />
                  <AlertDescription>
                    No gaps identified in the risk assessment. All requirements appear to be met.
                  </AlertDescription>
                </Alert>
              )}
            </div>

            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setCurrentStep(2)}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Button>
              <Button onClick={() => setCurrentStep(4)}>
                Next: Review & Submit
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 4: Review & Submit */}
      {currentStep === 4 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5" />
              Review & Submit
            </CardTitle>
            <CardDescription>Review your assessment and submit for approval</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Assessment Summary */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Assessment Details</h3>
                <div className="space-y-2 text-sm">
                  <div>
                    <strong>Name:</strong> {assessmentData.assessment_name}
                  </div>
                  <div>
                    <strong>Vendor:</strong>{" "}
                    {vendors.find((v) => v.id.toString() === assessmentData.vendor_id)?.vendor_name}
                  </div>
                  <div>
                    <strong>Contract:</strong>{" "}
                    {assessmentData.contract_id
                      ? contracts.find((c) => c.id.toString() === assessmentData.contract_id)?.contract_name
                      : "None selected"}
                  </div>
                  <div>
                    <strong>Type:</strong> {assessmentData.assessment_type}
                  </div>
                  <div>
                    <strong>Assessor:</strong> {assessmentData.assessor_name}
                  </div>
                  <div>
                    <strong>Date:</strong> {assessmentData.assessment_date}
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Risk Scores</h3>
                <RiskScoreSummary scores={calculateOverallScores()} />
              </div>
            </div>

            <Separator />

            {/* Gap Analysis Summary */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Gap Analysis Summary</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <div className="text-2xl font-bold">{calculateGapSummary().totalGaps}</div>
                  <div className="text-sm text-muted-foreground">Total Gaps Identified</div>
                </div>
                <div>
                  <div className="text-2xl font-bold">{calculateGapSummary().completionRate}%</div>
                  <div className="text-sm text-muted-foreground">Remediation Progress</div>
                </div>
              </div>
            </div>

            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setCurrentStep(3)}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Button>
              <Button onClick={handleSubmit} disabled={submitting}>
                {submitting ? "Submitting..." : "Submit Assessment"}
                <CheckCircle2 className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

function RiskQuestionCard({
  question,
  response,
  onUpdate,
}: {
  question: RiskQuestion
  response: QuestionResponse
  onUpdate: (field: keyof QuestionResponse, value: any) => void
}) {
  return (
    <Card className={`${question.is_mandatory ? "border-orange-200 bg-orange-50/50" : ""}`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="outline">{question.category}</Badge>
              <Badge variant="secondary" className="text-xs">
                {question.id}
              </Badge>
              {question.is_mandatory && (
                <Badge variant="destructive" className="text-xs">
                  Mandatory
                </Badge>
              )}
              <Badge variant="secondary" className="text-xs">
                Weight: {question.weight}
              </Badge>
            </div>
            <CardTitle className="text-lg">{question.question}</CardTitle>
            <CardDescription>{question.description}</CardDescription>
            <div className="mt-2 p-2 bg-blue-50 rounded-md">
              <div className="text-xs font-medium text-blue-800 mb-1">Best Practice:</div>
              <div className="text-xs text-blue-700">{question.best_practice_guidance}</div>
            </div>
          </div>
          <Badge className={`${getRiskColor(getRiskLevel(response?.risk_score || 0))} text-white`}>
            {getRiskLevel(response?.risk_score || 0)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Response</Label>
            <Select value={response?.response || ""} onValueChange={(value) => onUpdate("response", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select response" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Yes - Fully Compliant">Yes - Fully Compliant</SelectItem>
                <SelectItem value="Yes - Partially Compliant">Yes - Partially Compliant</SelectItem>
                <SelectItem value="No - Non-Compliant">No - Non-Compliant</SelectItem>
                <SelectItem value="Not Applicable">Not Applicable</SelectItem>
                <SelectItem value="Under Review">Under Review</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {response?.response !== "Not Applicable" && (
            <div className="space-y-2">
              <Label>Mitigation Status</Label>
              <Select
                value={response?.mitigation_status || "Not Started"}
                onValueChange={(value) => onUpdate("mitigation_status", value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Not Started">Not Started</SelectItem>
                  <SelectItem value="In Progress">In Progress</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
                  <SelectItem value="Not Applicable">Not Applicable</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
        </div>

        {response?.response !== "Not Applicable" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Likelihood (1-5)</Label>
              <Select
                value={response?.likelihood_score?.toString() || "1"}
                onValueChange={(value) => onUpdate("likelihood_score", Number.parseInt(value))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 - Very Low</SelectItem>
                  <SelectItem value="2">2 - Low</SelectItem>
                  <SelectItem value="3">3 - Medium</SelectItem>
                  <SelectItem value="4">4 - High</SelectItem>
                  <SelectItem value="5">5 - Very High</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Impact (1-5)</Label>
              <Select
                value={response?.impact_score?.toString() || "1"}
                onValueChange={(value) => onUpdate("impact_score", Number.parseInt(value))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 - Very Low</SelectItem>
                  <SelectItem value="2">2 - Low</SelectItem>
                  <SelectItem value="3">3 - Medium</SelectItem>
                  <SelectItem value="4">4 - High</SelectItem>
                  <SelectItem value="5">5 - Very High</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        )}

        {response?.response !== "Not Applicable" && (
          <div className="flex items-center space-x-4">
            <div className="space-y-2">
              <Label>Risk Score</Label>
              <div className="flex items-center space-x-2">
                <Badge variant="outline" className="text-lg px-3 py-1">
                  {response?.risk_score || 1}
                </Badge>
                <Badge className={`${getRiskColor(getRiskLevel(response?.risk_score || 1))} text-white`}>
                  {getRiskLevel(response?.risk_score || 1)}
                </Badge>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-2">
          <Label>Notes</Label>
          <Textarea
            value={response?.notes || ""}
            onChange={(e) => onUpdate("notes", e.target.value)}
            placeholder="Additional notes or comments..."
            rows={3}
          />
        </div>

        {response?.response !== "Not Applicable" && (
          <>
            <div className="flex items-center space-x-2">
              <Checkbox
                id={`evidence-${question.id}`}
                checked={response?.evidence_provided || false}
                onCheckedChange={(checked) => onUpdate("evidence_provided", checked)}
              />
              <Label htmlFor={`evidence-${question.id}`}>Evidence Provided</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id={`gap-${question.id}`}
                checked={response?.gap_identified || false}
                onCheckedChange={(checked) => onUpdate("gap_identified", checked)}
              />
              <Label htmlFor={`gap-${question.id}`}>Gap Identified</Label>
            </div>

            {response?.gap_identified && (
              <div className="space-y-4 p-4 border rounded-lg bg-yellow-50">
                <h4 className="font-medium text-yellow-800">Gap Remediation Plan</h4>

                <div className="space-y-2">
                  <Label>Remediation Plan</Label>
                  <Textarea
                    value={response?.remediation_plan || ""}
                    onChange={(e) => onUpdate("remediation_plan", e.target.value)}
                    placeholder="Describe the remediation plan..."
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Priority</Label>
                    <Select
                      value={response?.remediation_priority || "Medium"}
                      onValueChange={(value) => onUpdate("remediation_priority", value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Critical">Critical</SelectItem>
                        <SelectItem value="High">High</SelectItem>
                        <SelectItem value="Medium">Medium</SelectItem>
                        <SelectItem value="Low">Low</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Timeline</Label>
                    <Select
                      value={response?.remediation_timeline || "30 days"}
                      onValueChange={(value) => onUpdate("remediation_timeline", value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Immediate">Immediate</SelectItem>
                        <SelectItem value="7 days">7 days</SelectItem>
                        <SelectItem value="30 days">30 days</SelectItem>
                        <SelectItem value="60 days">60 days</SelectItem>
                        <SelectItem value="90 days">90 days</SelectItem>
                        <SelectItem value="6 months">6 months</SelectItem>
                        <SelectItem value="1 year">1 year</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  )
}

function GapAnalysisCard({
  question,
  response,
  gapAnalysis,
  onUpdateResponse,
  onUpdateGap,
}: {
  question: RiskQuestion
  response: QuestionResponse
  gapAnalysis: GapAnalysis
  onUpdateResponse: (field: keyof QuestionResponse, value: any) => void
  onUpdateGap: (field: keyof GapAnalysis, value: any) => void
}) {
  return (
    <Card className="border-orange-200 bg-orange-50/30">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="outline">{question.category}</Badge>
              <Badge variant="secondary" className="text-xs">
                {question.id}
              </Badge>
              <Badge variant="destructive" className="text-xs">
                Gap Identified
              </Badge>
            </div>
            <CardTitle className="text-lg">{question.question}</CardTitle>
            <CardDescription>{question.description}</CardDescription>
          </div>
          <AlertTriangle className="h-5 w-5 text-orange-500" />
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Gap Description</Label>
            <Textarea
              value={gapAnalysis?.gap_description || ""}
              onChange={(e) => onUpdateGap("gap_description", e.target.value)}
              placeholder="Describe the identified gap..."
              rows={2}
            />
          </div>

          <div className="space-y-2">
            <Label>Current State</Label>
            <Textarea
              value={gapAnalysis?.current_state || ""}
              onChange={(e) => onUpdateGap("current_state", e.target.value)}
              placeholder="Describe the current state..."
              rows={2}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Target State</Label>
            <Textarea
              value={gapAnalysis?.target_state || ""}
              onChange={(e) => onUpdateGap("target_state", e.target.value)}
              placeholder="Describe the desired target state..."
              rows={2}
            />
          </div>

          <div className="space-y-2">
            <Label>Remediation Actions</Label>
            <Textarea
              value={response?.remediation_plan || ""}
              onChange={(e) => onUpdateResponse("remediation_plan", e.target.value)}
              placeholder="List specific remediation actions..."
              rows={2}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label>Priority</Label>
            <Select
              value={response?.remediation_priority || "Medium"}
              onValueChange={(value) => onUpdateResponse("remediation_priority", value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Critical">Critical</SelectItem>
                <SelectItem value="High">High</SelectItem>
                <SelectItem value="Medium">Medium</SelectItem>
                <SelectItem value="Low">Low</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Timeline</Label>
            <Input
              value={response?.remediation_timeline || ""}
              onChange={(e) => onUpdateResponse("remediation_timeline", e.target.value)}
              placeholder="e.g., 30 days, Q2 2024"
            />
          </div>

          <div className="space-y-2">
            <Label>Responsible Party</Label>
            <Input
              value={gapAnalysis?.responsible_party || ""}
              onChange={(e) => onUpdateGap("responsible_party", e.target.value)}
              placeholder="Who is responsible?"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// Risk Score Summary Component
function RiskScoreSummary({ scores }: { scores: any }) {
  const getRiskColor = (level: string): string => {
    switch (level) {
      case "Critical":
        return "bg-red-500"
      case "High":
        return "bg-orange-500"
      case "Medium":
        return "bg-yellow-500"
      case "Low":
        return "bg-blue-500"
      default:
        return "bg-green-500"
    }
  }

  const getRiskLevel = (score: number): string => {
    if (score >= 16) return "Critical"
    if (score >= 12) return "High"
    if (score >= 8) return "Medium"
    if (score >= 4) return "Low"
    return "Very Low"
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="font-medium">Overall Risk</span>
        <Badge className={`${getRiskColor(getRiskLevel(scores.overall))} text-white`}>
          {getRiskLevel(scores.overall)} ({scores.overall})
        </Badge>
      </div>
      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span>Security & Data Protection:</span>
          <span>{scores["Security & Data Protection"] || 0}</span>
        </div>
        <div className="flex justify-between">
          <span>Privacy & Data Handling:</span>
          <span>{scores["Privacy & Data Handling"] || 0}</span>
        </div>
        <div className="flex justify-between">
          <span>Operational Risk:</span>
          <span>{scores["Operational Risk"] || 0}</span>
        </div>
        <div className="flex justify-between">
          <span>Financial Stability:</span>
          <span>{scores["Financial Stability"] || 0}</span>
        </div>
        <div className="flex justify-between">
          <span>Compliance & Regulatory:</span>
          <span>{scores["Compliance & Regulatory"] || 0}</span>
        </div>
        <div className="flex justify-between">
          <span>Vendor Management:</span>
          <span>{scores["Vendor Management"] || 0}</span>
        </div>
      </div>
    </div>
  )
}

function getRiskColor(level: string): string {
  switch (level) {
    case "Critical":
      return "bg-red-500"
    case "High":
      return "bg-orange-500"
    case "Medium":
      return "bg-yellow-500"
    case "Low":
      return "bg-blue-500"
    default:
      return "bg-green-500"
  }
}

function getRiskLevel(score: number): string {
  if (score >= 16) return "Critical"
  if (score >= 12) return "High"
  if (score >= 8) return "Medium"
  if (score >= 4) return "Low"
  return "Very Low"
}
