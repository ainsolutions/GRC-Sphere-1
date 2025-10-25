"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Shield, FileText, AlertTriangle, CheckCircle, Target, Users } from "lucide-react"

interface PromptTemplate {
  id: string
  title: string
  category: string
  framework: string
  prompt: string
  icon: React.ReactNode
  difficulty: "Beginner" | "Intermediate" | "Advanced"
}

const promptTemplates: PromptTemplate[] = [
  {
    id: "nist-csf-implementation",
    title: "NIST CSF Implementation Guide",
    category: "Framework Implementation",
    framework: "NIST CSF",
    prompt:
      "Provide a comprehensive implementation roadmap for NIST Cybersecurity Framework including the five core functions (Identify, Protect, Detect, Respond, Recover), timeline, resource requirements, and key milestones for a mid-size organization.",
    icon: <Shield className="h-4 w-4" />,
    difficulty: "Intermediate",
  },
  {
    id: "iso27001-gap-analysis",
    title: "ISO 27001 Gap Analysis",
    category: "Compliance Assessment",
    framework: "ISO 27001",
    prompt:
      "Conduct a gap analysis for ISO 27001:2022 certification readiness. Analyze our current security posture against Annex A controls, identify critical gaps, prioritize remediation efforts, and provide a certification timeline.",
    icon: <FileText className="h-4 w-4" />,
    difficulty: "Advanced",
  },
  {
    id: "incident-response-plan",
    title: "Incident Response Planning",
    category: "Incident Management",
    framework: "NIST SP 800-61",
    prompt:
      "Design a comprehensive incident response plan following NIST SP 800-61 guidelines. Include preparation, detection, analysis, containment, eradication, recovery phases, and integration with business continuity processes.",
    icon: <AlertTriangle className="h-4 w-4" />,
    difficulty: "Intermediate",
  },
  {
    id: "risk-assessment-methodology",
    title: "Risk Assessment Framework",
    category: "Risk Management",
    framework: "NIST RMF",
    prompt:
      "Establish a quantitative risk assessment methodology using NIST Risk Management Framework. Include asset valuation, threat modeling, vulnerability assessment, and risk calculation formulas with business impact analysis.",
    icon: <Target className="h-4 w-4" />,
    difficulty: "Advanced",
  },
  {
    id: "third-party-risk-program",
    title: "Third-Party Risk Management",
    category: "Vendor Management",
    framework: "NIST SP 800-161",
    prompt:
      "Develop a comprehensive third-party risk management program including vendor assessment questionnaires, due diligence processes, contract security requirements, and ongoing monitoring procedures.",
    icon: <Users className="h-4 w-4" />,
    difficulty: "Intermediate",
  },
  {
    id: "zero-trust-architecture",
    title: "Zero Trust Implementation",
    category: "Architecture Design",
    framework: "NIST SP 800-207",
    prompt:
      "Design a Zero Trust architecture implementation plan following NIST SP 800-207. Include identity verification, device security, network segmentation, data protection, and application security components.",
    icon: <Shield className="h-4 w-4" />,
    difficulty: "Advanced",
  },
  {
    id: "hipaa-compliance-assessment",
    title: "HIPAA Compliance Review",
    category: "Healthcare Compliance",
    framework: "HIPAA",
    prompt:
      "Conduct a comprehensive HIPAA compliance assessment covering Administrative, Physical, and Technical Safeguards. Include risk analysis requirements, breach notification procedures, and business associate agreements.",
    icon: <CheckCircle className="h-4 w-4" />,
    difficulty: "Intermediate",
  },
  {
    id: "pci-dss-implementation",
    title: "PCI DSS Compliance Program",
    category: "Payment Security",
    framework: "PCI DSS",
    prompt:
      "Develop a PCI DSS compliance program including network segmentation, access controls, vulnerability management, monitoring procedures, and annual assessment requirements for Level 1 merchant compliance.",
    icon: <Shield className="h-4 w-4" />,
    difficulty: "Advanced",
  },
]

interface CybersecurityPromptTemplatesProps {
  onPromptSelect: (prompt: string) => void
}

export default function CybersecurityPromptTemplates({ onPromptSelect }: CybersecurityPromptTemplatesProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("All")
  const [selectedFramework, setSelectedFramework] = useState<string>("All")

  const categories = ["All", ...Array.from(new Set(promptTemplates.map((t) => t.category)))]
  const frameworks = ["All", ...Array.from(new Set(promptTemplates.map((t) => t.framework)))]

  const filteredTemplates = promptTemplates.filter((template) => {
    const categoryMatch = selectedCategory === "All" || template.category === selectedCategory
    const frameworkMatch = selectedFramework === "All" || template.framework === selectedFramework
    return categoryMatch && frameworkMatch
  })

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Beginner":
        return "bg-green-100 text-green-800"
      case "Intermediate":
        return "bg-yellow-100 text-yellow-800"
      case "Advanced":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        <div className="flex gap-1 full-width overflow-x-auto">
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </Button>
          ))}
        </div>
        <div className="flex gap-1 full-width overflow-x-auto">
          {frameworks.map((framework) => (
            <Button
              key={framework}
              variant={selectedFramework === framework ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setSelectedFramework(framework)}
            >
              {framework}
            </Button>
          ))}
        </div>
      </div>

      <ScrollArea className="h-96">
        <div className="grid gap-3">
          {filteredTemplates.map((template) => (
            <Card key={template.id} className="cursor-pointer hover:shadow-md transition-shadow">
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    {template.icon}
                    <CardTitle className="text-sm">{template.title}</CardTitle>
                  </div>
                  <Badge className={getDifficultyColor(template.difficulty)}>{template.difficulty}</Badge>
                </div>
                <div className="flex gap-2">
                  <Badge variant="outline" className="text-xs">
                    {template.category}
                  </Badge>
                  <Badge variant="secondary" className="text-xs">
                    {template.framework}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{template.prompt}</p>
                <Button size="sm" className="w-full" onClick={() => onPromptSelect(template.prompt)}>
                  Use This Prompt
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </ScrollArea>
    </div>
  )
}
