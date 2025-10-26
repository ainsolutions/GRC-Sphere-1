"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { Shield, FileCheck, AlertTriangle, Target } from "lucide-react"
import { SWIFTComplianceAssessment } from "@/components/swift-compliance-assessment"
import { SWIFTSelfAssessment } from "@/components/swift-self-assessment"
import { SWIFTGapAnalysis } from "@/components/swift-gap-analysis"
import { SWIFTRemediationTracker } from "@/components/swift-remediation-tracker"

export default function SWIFTCompliancePage() {
  const [selectedAssessmentId, setSelectedAssessmentId] = useState<number | undefined>(undefined)

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
        
          SWIFT Customer Security Programme (CSP) Compliance
        </h1>
        <p className="text-blue-400">
          Comprehensive SWIFT CSP compliance assessment, control evaluation, and attestation management
        </p>
      </div>

      {/* Main Content - Nested Tabs */}
      <Tabs defaultValue="assessment" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="assessment" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Assessment
          </TabsTrigger>
          <TabsTrigger value="self-assessment" className="flex items-center gap-2">
            <FileCheck className="h-4 w-4" />
            Self Assessment
          </TabsTrigger>
          <TabsTrigger value="gap-analysis" className="flex items-center gap-2">
            <Target className="h-4 w-4" />
            Gap Analysis
          </TabsTrigger>
          <TabsTrigger value="remediation" className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" />
            Remediation Tracking
          </TabsTrigger>
        </TabsList>

        <TabsContent value="assessment">
          <SWIFTComplianceAssessment onAssessmentSelected={setSelectedAssessmentId} />
        </TabsContent>

        <TabsContent value="self-assessment">
          {selectedAssessmentId ? (
            <SWIFTSelfAssessment assessmentId={selectedAssessmentId} />
          ) : (
            <Card>
              <CardContent className="p-12 text-center">
                <Shield className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Assessment Selected</h3>
                <p className="text-muted-foreground">
                  Please create or select a SWIFT assessment in the Assessment tab first
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="gap-analysis">
          {selectedAssessmentId ? (
            <SWIFTGapAnalysis assessmentId={selectedAssessmentId} />
          ) : (
            <Card>
              <CardContent className="p-12 text-center">
                <Target className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Assessment Selected</h3>
                <p className="text-muted-foreground">
                  Please create or select a SWIFT assessment to view gap analysis
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="remediation">
          {selectedAssessmentId ? (
            <SWIFTRemediationTracker assessmentId={selectedAssessmentId} />
          ) : (
            <Card>
              <CardContent className="p-12 text-center">
                <AlertTriangle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Assessment Selected</h3>
                <p className="text-muted-foreground">
                  Please create or select a SWIFT assessment to track remediation
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}

