"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Shield, FileCheck, AlertTriangle, Target, Calendar } from "lucide-react"
import ComplianceAssessmentCreation from "@/components/compliance-assessment-creation"
import ComplianceSelfAssessmentTable from "@/components/compliance-self-assessment-table"
import ComplianceGapRemediation from "@/components/compliance-gap-remediation"
import { AssessmentGanttChart } from "@/components/assessment-gantt-chart"

export default function ComplianceAssessmentPage() {
  const [selectedAssessmentId, setSelectedAssessmentId] = useState<number | null>(null)
  const [assessmentStats, setAssessmentStats] = useState({
    totalAssessments: 0,
    activeAssessments: 0,
    totalControls: 0,
    openGaps: 0,
  })

  const fetchStats = async () => {
    try {
      const response = await fetch("/api/compliance-assessments")
      const result = await response.json()

      if (result.success) {
        const assessments = result.data
        const stats = {
          totalAssessments: assessments.length,
          activeAssessments: assessments.filter(
            (a: any) => a.status === 'In Progress' || a.status === 'Planning'
          ).length,
          totalControls: assessments.reduce(
            (sum: number, a: any) => sum + (parseInt(a.assessed_controls_count) || 0),
            0
          ),
          openGaps: assessments.reduce(
            (sum: number, a: any) => sum + (parseInt(a.open_gaps_count) || 0),
            0
          ),
        }
        setAssessmentStats(stats)
      }
    } catch (error) {
      console.error("Error fetching stats:", error)
    }
  }

  useEffect(() => {
    fetchStats()
  }, [])

  const handleAssessmentCreated = (assessmentId: number) => {
    setSelectedAssessmentId(assessmentId)
    fetchStats()
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
              <Shield className="h-8 w-8" />
              Compliance Assessment Management
            </h1>
            <p>
              Comprehensive regulatory compliance assessment, control evaluation, and gap remediation
            </p>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>
              Total Assessments
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{assessmentStats.totalAssessments}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle>
              Active Assessments
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{assessmentStats.activeAssessments}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle>
              Controls Assessed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{assessmentStats.totalControls}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle>
              Open Gaps
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{assessmentStats.openGaps}</div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content - Tabs */}
      <Tabs defaultValue="assessments" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="assessments" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Compliance Assessments
          </TabsTrigger>
          <TabsTrigger value="controls" className="flex items-center gap-2" disabled={!selectedAssessmentId}>
            <FileCheck className="h-4 w-4" />
            Self Assessment / Controls
            {selectedAssessmentId && (
              <Badge variant="secondary" className="ml-1">Active</Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="gaps" className="flex items-center gap-2" disabled={!selectedAssessmentId}>
            <AlertTriangle className="h-4 w-4" />
            Gap Remediation
            {selectedAssessmentId && (
              <Badge variant="secondary" className="ml-1">Active</Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="planner" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Planner
          </TabsTrigger>
        </TabsList>

        <TabsContent value="assessments">
          <ComplianceAssessmentCreation 
            onAssessmentCreated={handleAssessmentCreated}
            onAssessmentSelected={setSelectedAssessmentId}
            onStatsUpdate={fetchStats}
          />
        </TabsContent>

        <TabsContent value="controls">
          {selectedAssessmentId ? (
            <ComplianceSelfAssessmentTable 
              complianceAssessmentId={selectedAssessmentId}
              onStatsUpdate={fetchStats}
            />
          ) : (
            <Card>
              <CardContent className="p-12 text-center">
                <Target className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Assessment Selected</h3>
                <p className="text-muted-foreground">
                  Please create or select a compliance assessment to begin control evaluation
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="gaps">
          {selectedAssessmentId ? (
            <ComplianceGapRemediation 
              complianceAssessmentId={selectedAssessmentId}
              onStatsUpdate={fetchStats}
            />
          ) : (
            <Card>
              <CardContent className="p-12 text-center">
                <AlertTriangle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Assessment Selected</h3>
                <p className="text-muted-foreground">
                  Please create or select a compliance assessment to track gap remediation
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="planner">
          <AssessmentGanttChart 
            assessments={[]}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}


