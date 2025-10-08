"use client"

import { useState } from "react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import {
  Shield,
  FileText,
  AlertTriangle,
  CheckCircle,
  TrendingUp,
  Users,
  Building,
  BarChart3,
  FileCheck,
  Activity,
  Plus,
  Lock,
  Globe,
} from "lucide-react"
import { HIPAAComplianceAssessment } from "@/components/hipaa-compliance-assessment"
import { HIPAARemediationTracker } from "@/components/hipaa-remediation-tracker"
import { NESAUAEComplianceAssessment } from "@/components/nesa-uae-compliance-assessment"
import { NESAUAERemediationTracker } from "@/components/nesa-uae-remediation-tracker"
import { NESAUAEGapAnalysis } from "@/components/nesa-uae-gap-analysis"
import { MICAComplianceAssessment } from "@/components/mica-compliance-assessment"
import { MICAGapAnalysis } from "@/components/mica-gap-analysis"
import { MICARemediationTracker } from "@/components/mica-remediation-tracker"
import { SAMAComplianceAssessment } from "@/components/sama-compliance-assessment"
import { SAMARemediationTracker } from "@/components/sama-remediation-tracker"
import { SAMASelfAssessment } from "@/components/sama-self-assessment"
import { SAMAGapAnalysis } from "@/components/sama-gap-analysis"
import { NIS2ComplianceAssessment } from "@/components/nis2-compliance-assessment"
import { NIS2RemediationTracker } from "@/components/nis2-remediation-tracker"
import { NIS2SelfAssessment } from "@/components/nis2-self-assessment"
import { NIS2GapAnalysis } from "@/components/nis2-gap-analysis"
import { QatarNIAComplianceAssessment } from "@/components/qatar-nia-compliance-assessment"
import { QatarNIARemediationTracker } from "@/components/qatar-nia-remediation-tracker"
import { QatarNIASelfAssessment } from "@/components/qatar-nia-self-assessment"
import { QatarNIAGapAnalysis } from "@/components/qatar-nia-gap-analysis"
import { DORAComplianceAssessment } from "@/components/dora-compliance-assessment"
import { DORARemediationTracker } from "@/components/dora-remediation-tracker"
import { DORASelfAssessment } from "@/components/dora-self-assessment"
import { DORAGapAnalysis } from "@/components/dora-gap-analysis"
import { MASComplianceAssessment } from "@/components/mas-compliance-assessment"
import { MASRemediationTracker } from "@/components/mas-remediation-tracker"
import { MASSelfAssessment } from "@/components/mas-self-assessment"
import { MASGapAnalysis } from "@/components/mas-gap-analysis"
import { ISO27001ComplianceAssessment } from "@/components/iso27001-compliance-assessment"
import { ISO27001RemediationTracker } from "@/components/iso27001-remediation-tracker"
import { ISO27001SelfAssessment } from "@/components/iso27001-self-assessment"
import { ISO27001GapAnalysis } from "@/components/iso27001-gap-analysis"  
import StarBorder from "../StarBorder"

export default function CompliancePage() {
  const [activeTab, setActiveTab] = useState("overview")

  return (
    <main className="flex-1 overflow-y-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">
            Compliance Management
          </h1>
          <p className="text-muted-foreground mt-2">
            Monitor and manage regulatory compliance across multiple frameworks
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          New Assessment
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="gradient-card-primary border-0 shadow-lg">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-bold text-cyan-300">
              Overall Compliance Score
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">87%</div>
            <Progress value={87} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-2">+2% from last month</p>
          </CardContent>
        </Card>

        <Card className="gradient-card-secondary border-0 shadow-lg">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-bold text-cyan-300">
              Active Frameworks
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">12</div>
            <p className="text-xs text-muted-foreground">
              HIPAA, NESA UAE, MICA, SAMA, NIS2, Qatar NIA, DORA, MAS, PCI DSS, ISO 27001, NIST CSF, SOC 2
            </p>
          </CardContent>
        </Card>

        <Card className="gradient-card-accent border-0 shadow-lg">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-bold text-cyan-300">
              Open Findings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">28</div>
            <p className="text-xs text-muted-foreground">10 high, 18 medium priority</p>
          </CardContent>
        </Card>

        <Card className="gradient-card-warning border-0 shadow-lg">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-bold text-cyan-300">
              Upcoming Assessments
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">5</div>
            <p className="text-xs text-muted-foreground">Next: NIS2 Review (Dec 10)</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-12 mt-4">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="hipaa" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            HIPAA
          </TabsTrigger>
          <TabsTrigger value="nesa-uae" className="flex items-center gap-2">
            <Building className="h-4 w-4" />
            NESA UAE
          </TabsTrigger>
          <TabsTrigger value="mica" className="flex items-center gap-2">
            <Lock className="h-4 w-4" />
            MICA
          </TabsTrigger>
          <TabsTrigger value="sama" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            SAMA
          </TabsTrigger>
          <TabsTrigger value="nis2" className="flex items-center gap-2">
            <Globe className="h-4 w-4" />
            NIS2
          </TabsTrigger>
          <TabsTrigger value="qatar-nia" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Qatar NIA
          </TabsTrigger>
          <TabsTrigger value="dora" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            DORA
          </TabsTrigger>
          <TabsTrigger value="mas" className="flex items-center gap-2">
            <Building className="h-4 w-4" />
            MAS
          </TabsTrigger>
          <TabsTrigger value="iso27001" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            ISO 27001
          </TabsTrigger>
          <TabsTrigger value="frameworks" className="flex items-center gap-2">
            <FileCheck className="h-4 w-4" />
            Frameworks
          </TabsTrigger>
          <TabsTrigger value="reports" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Reports
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <Card className="gradient-card-primary border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Compliance Overview
              </CardTitle>
              <CardDescription>Current status across all compliance frameworks</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* HIPAA Framework */}
                <div className="flex items-center justify-between p-4 rounded-lg border border-blue-200/50 hover:bg-gradient-to-r hover:from-blue-50/30 hover:via-purple-50/30 hover:to-cyan-50/30 transition-all duration-200">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 rounded-full bg-green-500" />
                      <div>
                        <h3 className="font-semibold">HIPAA</h3>
                        <p className="text-sm text-muted-foreground">Last assessed: Jan 15, 2024</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <div className="flex items-center space-x-2">
                        <Progress value={87} className="w-20 h-2" />
                        <span className="text-sm font-medium text-green-600">87%</span>
                      </div>
                      <p className="text-xs text-muted-foreground">5 findings</p>
                    </div>
                    <Badge className="bg-green-100 text-green-800">Active</Badge>
                  </div>
                </div>

                {/* NESA UAE Framework */}
                <div className="flex items-center justify-between p-4 rounded-lg border border-blue-200/50 hover:bg-gradient-to-r hover:from-blue-50/30 hover:via-purple-50/30 hover:to-cyan-50/30 transition-all duration-200">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 rounded-full bg-yellow-500" />
                      <div>
                        <h3 className="font-semibold">NESA UAE</h3>
                        <p className="text-sm text-muted-foreground">Last assessed: Jan 10, 2024</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <div className="flex items-center space-x-2">
                        <Progress value={72} className="w-20 h-2" />
                        <span className="text-sm font-medium text-yellow-600">72%</span>
                      </div>
                      <p className="text-xs text-muted-foreground">12 findings</p>
                    </div>
                    <Badge className="bg-yellow-100 text-yellow-800">In Progress</Badge>
                  </div>
                </div>

                {/* MICA Framework */}
                <div className="flex items-center justify-between p-4 rounded-lg border border-blue-200/50 hover:bg-gradient-to-r hover:from-blue-50/30 hover:via-purple-50/30 hover:to-cyan-50/30 transition-all duration-200">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 rounded-full bg-blue-500" />
                      <div>
                        <h3 className="font-semibold">MICA</h3>
                        <p className="text-sm text-muted-foreground">Last assessed: Jan 8, 2024</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <div className="flex items-center space-x-2">
                        <Progress value={78} className="w-20 h-2" />
                        <span className="text-sm font-medium text-blue-600">78%</span>
                      </div>
                      <p className="text-xs text-muted-foreground">8 findings</p>
                    </div>
                    <Badge className="bg-blue-100 text-blue-800">In Progress</Badge>
                  </div>
                </div>

                {/* SAMA Framework */}
                <div className="flex items-center justify-between p-4 rounded-lg border border-blue-200/50 hover:bg-gradient-to-r hover:from-blue-50/30 hover:via-purple-50/30 hover:to-cyan-50/30 transition-all duration-200">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 rounded-full bg-blue-500" />
                      <div>
                        <h3 className="font-semibold">SAMA</h3>
                        <p className="text-sm text-muted-foreground">Last assessed: Jan 5, 2024</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <div className="flex items-center space-x-2">
                        <Progress value={75} className="w-20 h-2" />
                        <span className="text-sm font-medium text-blue-600">75%</span>
                      </div>
                      <p className="text-xs text-muted-foreground">10 findings</p>
                    </div>
                    <Badge className="bg-blue-100 text-blue-800">In Progress</Badge>
                  </div>
                </div>

                {/* NIS2 Framework */}
                <div className="flex items-center justify-between p-4 rounded-lg border border-blue-200/50 hover:bg-gradient-to-r hover:from-blue-50/30 hover:via-purple-50/30 hover:to-cyan-50/30 transition-all duration-200">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 rounded-full bg-purple-500" />
                      <div>
                        <h3 className="font-semibold">NIS2</h3>
                        <p className="text-sm text-muted-foreground">Last assessed: Jan 3, 2024</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <div className="flex items-center space-x-2">
                        <Progress value={68} className="w-20 h-2" />
                        <span className="text-sm font-medium text-purple-600">68%</span>
                      </div>
                      <p className="text-xs text-muted-foreground">15 findings</p>
                    </div>
                    <Badge className="bg-purple-100 text-purple-800">In Progress</Badge>
                  </div>
                </div>

                {/* Qatar NIA Framework */}
                <div className="flex items-center justify-between p-4 rounded-lg border border-blue-200/50 hover:bg-gradient-to-r hover:from-blue-50/30 hover:via-purple-50/30 hover:to-cyan-50/30 transition-all duration-200">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 rounded-full bg-teal-500" />
                      <div>
                        <h3 className="font-semibold">Qatar NIA</h3>
                        <p className="text-sm text-muted-foreground">Last assessed: Jan 2, 2024</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <div className="flex items-center space-x-2">
                        <Progress value={71} className="w-20 h-2" />
                        <span className="text-sm font-medium text-teal-600">71%</span>
                      </div>
                      <p className="text-xs text-muted-foreground">12 findings</p>
                    </div>
                    <Badge className="bg-teal-100 text-teal-800">In Progress</Badge>
                  </div>
                </div>

                {/* DORA Framework */}
                <div className="flex items-center justify-between p-4 rounded-lg border border-blue-200/50 hover:bg-gradient-to-r hover:from-blue-50/30 hover:via-purple-50/30 hover:to-cyan-50/30 transition-all duration-200">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 rounded-full bg-indigo-500" />
                      <div>
                        <h3 className="font-semibold">DORA</h3>
                        <p className="text-sm text-muted-foreground">Last assessed: Jan 1, 2024</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <div className="flex items-center space-x-2">
                        <Progress value={73} className="w-20 h-2" />
                        <span className="text-sm font-medium text-indigo-600">73%</span>
                      </div>
                      <p className="text-xs text-muted-foreground">11 findings</p>
                    </div>
                    <Badge className="bg-indigo-100 text-indigo-800">In Progress</Badge>
                  </div>
                </div>

                {/* MAS Framework */}
                <div className="flex items-center justify-between p-4 rounded-lg border border-blue-200/50 hover:bg-gradient-to-r hover:from-blue-50/30 hover:via-purple-50/30 hover:to-cyan-50/30 transition-all duration-200">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 rounded-full bg-orange-500" />
                      <div>
                        <h3 className="font-semibold">MAS Singapore</h3>
                        <p className="text-sm text-muted-foreground">Last assessed: Dec 28, 2023</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <div className="flex items-center space-x-2">
                        <Progress value={76} className="w-20 h-2" />
                        <span className="text-sm font-medium text-orange-600">76%</span>
                      </div>
                      <p className="text-xs text-muted-foreground">9 findings</p>
                    </div>
                    <Badge className="bg-orange-100 text-orange-800">In Progress</Badge>
                  </div>
                </div>

                {/* ISO 27001 Framework */}
                <div className="flex items-center justify-between p-4 rounded-lg border border-blue-200/50 hover:bg-gradient-to-r hover:from-blue-50/30 hover:via-purple-50/30 hover:to-cyan-50/30 transition-all duration-200">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 rounded-full bg-green-500" />
                      <div>
                        <h3 className="font-semibold">ISO 27001</h3>
                        <p className="text-sm text-muted-foreground">Last assessed: Dec 1, 2023</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <div className="flex items-center space-x-2">
                        <Progress value={84} className="w-20 h-2" />
                        <span className="text-sm font-medium text-green-600">84%</span>
                      </div>
                      <p className="text-xs text-muted-foreground">3 findings</p>
                    </div>
                    <Badge className="bg-green-100 text-green-800">Active</Badge>
                  </div>
                </div>

                {/* SOC 2 Framework */}
                <div className="flex items-center justify-between p-4 rounded-lg border border-blue-200/50 hover:bg-gradient-to-r hover:from-blue-50/30 hover:via-purple-50/30 hover:to-cyan-50/30 transition-all duration-200">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 rounded-full bg-green-500" />
                      <div>
                        <h3 className="font-semibold">SOC 2</h3>
                        <p className="text-sm text-muted-foreground">Last assessed: Jan 20, 2024</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <div className="flex items-center space-x-2">
                        <Progress value={91} className="w-20 h-2" />
                        <span className="text-sm font-medium text-green-600">91%</span>
                      </div>
                      <p className="text-xs text-muted-foreground">2 findings</p>
                    </div>
                    <Badge className="bg-green-100 text-green-800">Active</Badge>
                  </div>
                </div>

                {/* PCI DSS Framework */}
                <div className="flex items-center justify-between p-4 rounded-lg border border-blue-200/50 hover:bg-gradient-to-r hover:from-blue-50/30 hover:via-purple-50/30 hover:to-cyan-50/30 transition-all duration-200">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 rounded-full bg-orange-500" />
                      <div>
                        <h3 className="font-semibold">PCI DSS</h3>
                        <p className="text-sm text-muted-foreground">Last assessed: Jan 20, 2024</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <div className="flex items-center space-x-2">
                        <Progress value={82} className="w-20 h-2" />
                        <span className="text-sm font-medium text-orange-600">82%</span>
                      </div>
                      <p className="text-xs text-muted-foreground">14 findings</p>
                    </div>
                    <Badge className="bg-orange-100 text-orange-800">In Progress</Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="gradient-card-secondary border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent">
                  Recent Activities
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <Activity className="h-4 w-4 text-green-600" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">HIPAA assessment completed</p>
                      <p className="text-xs text-muted-foreground">2 hours ago</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <TrendingUp className="h-4 w-4 text-blue-600" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">NIS2 compliance score improved</p>
                      <p className="text-xs text-muted-foreground">6 hours ago</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <TrendingUp className="h-4 w-4 text-blue-600" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">NESA UAE compliance score improved</p>
                      <p className="text-xs text-muted-foreground">1 day ago</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <AlertTriangle className="h-4 w-4 text-yellow-600" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">ISO 27001 finding identified</p>
                      <p className="text-xs text-muted-foreground">2 days ago</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">SOC 2 controls validated</p>
                      <p className="text-xs text-muted-foreground">3 days ago</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="gradient-card-accent border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Upcoming Assessments
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">NIS2 Review</p>
                      <p className="text-xs text-muted-foreground">Due: Dec 10, 2024</p>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      10 days
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">HIPAA Review</p>
                      <p className="text-xs text-muted-foreground">Due: Dec 15, 2024</p>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      15 days
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">NESA UAE Assessment</p>
                      <p className="text-xs text-muted-foreground">Due: Mar 10, 2025</p>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      100 days
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">ISO 27001 Audit</p>
                      <p className="text-xs text-muted-foreground">Due: Jun 1, 2025</p>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      183 days
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">SOC 2 Type II</p>
                      <p className="text-xs text-muted-foreground">Due: Jul 20, 2025</p>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      232 days
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="hipaa" className="space-y-4">
          <Tabs defaultValue="assessment" className="space-y-4">
            <TabsList>
              <TabsTrigger value="assessment">Assessment</TabsTrigger>
              <TabsTrigger value="remediation">Remediation Tracking</TabsTrigger>
              <TabsTrigger value="reports">Audit Reports</TabsTrigger>
              <TabsTrigger value="risk-scoring">Risk Scoring</TabsTrigger>
              <TabsTrigger value="breach-notification">Breach Notification</TabsTrigger>
              <TabsTrigger value="phi-inventory">PHI Inventory</TabsTrigger>
            </TabsList>

            <TabsContent value="assessment">
              <HIPAAComplianceAssessment />
            </TabsContent>

            <TabsContent value="remediation">
              <HIPAARemediationTracker />
            </TabsContent>

            <TabsContent value="reports">
              <Card className="gradient-card-primary border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    HIPAA Audit Reports
                  </CardTitle>
                  <CardDescription>Generate and manage HIPAA compliance audit reports</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-muted-foreground">HIPAA audit report generation coming soon</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="risk-scoring">
              <Card className="gradient-card-secondary border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent">
                    HIPAA Risk Scoring
                  </CardTitle>
                  <CardDescription>Automated risk scoring for HIPAA compliance</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <TrendingUp className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-muted-foreground">HIPAA risk scoring system coming soon</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="breach-notification">
              <Card className="gradient-card-warning border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="bg-gradient-to-r from-red-600 to-red-700 bg-clip-text text-transparent">
                    Breach Notification
                  </CardTitle>
                  <CardDescription>Manage HIPAA breach notification requirements</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <AlertTriangle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-muted-foreground">Breach notification system coming soon</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="phi-inventory">
              <Card className="gradient-card-accent border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                    PHI Inventory Management
                  </CardTitle>
                  <CardDescription>Track and manage Protected Health Information inventory</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-muted-foreground">PHI inventory management coming soon</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </TabsContent>

        <TabsContent value="nesa-uae" className="space-y-4">
          <Tabs defaultValue="assessment" className="space-y-4">
            <TabsList>
              <TabsTrigger value="assessment">Assessment</TabsTrigger>
              <TabsTrigger value="gap-analysis">Gap Analysis</TabsTrigger>
              <TabsTrigger value="remediation">Remediation Tracking</TabsTrigger>
            </TabsList>

            <TabsContent value="assessment">
              <NESAUAEComplianceAssessment />
            </TabsContent>

            <TabsContent value="gap-analysis">
              <NESAUAEGapAnalysis />
            </TabsContent>

            <TabsContent value="remediation">
              <NESAUAERemediationTracker />
            </TabsContent>
          </Tabs>
        </TabsContent>

        <TabsContent value="mica" className="space-y-4">
          <Tabs defaultValue="assessment" className="space-y-4">
            <TabsList>
              <TabsTrigger value="assessment">Assessment</TabsTrigger>
              <TabsTrigger value="gap-analysis">Gap Analysis</TabsTrigger>
              <TabsTrigger value="remediation">Remediation Tracking</TabsTrigger>
            </TabsList>

            <TabsContent value="assessment">
              <MICAComplianceAssessment />
            </TabsContent>

            <TabsContent value="gap-analysis">
              <MICAGapAnalysis />
            </TabsContent>

            <TabsContent value="remediation">
              <MICARemediationTracker />
            </TabsContent>
          </Tabs>
        </TabsContent>

        <TabsContent value="sama" className="space-y-4">
          <Tabs defaultValue="assessment" className="space-y-4">
            <TabsList>
              <TabsTrigger value="assessment">Assessment</TabsTrigger>
              <TabsTrigger value="self-assessment">Self Assessment</TabsTrigger>
              <TabsTrigger value="gap-analysis">Gap Analysis</TabsTrigger>
              <TabsTrigger value="remediation">Remediation Tracking</TabsTrigger>
            </TabsList>

            <TabsContent value="assessment">
              <SAMAComplianceAssessment />
            </TabsContent>

            <TabsContent value="self-assessment">
              <SAMASelfAssessment />
            </TabsContent>

            <TabsContent value="gap-analysis">
              <SAMAGapAnalysis />
            </TabsContent>

            <TabsContent value="remediation">
              <SAMARemediationTracker assessmentId={undefined} />
            </TabsContent>
          </Tabs>
        </TabsContent>

        <TabsContent value="nis2" className="space-y-4">
          <Tabs defaultValue="assessment" className="space-y-4">
            <TabsList>
              <TabsTrigger value="assessment">Assessment</TabsTrigger>
              <TabsTrigger value="self-assessment">Self Assessment</TabsTrigger>
              <TabsTrigger value="gap-analysis">Gap Analysis</TabsTrigger>
              <TabsTrigger value="remediation">Remediation Tracking</TabsTrigger>
            </TabsList>

            <TabsContent value="assessment">
              <NIS2ComplianceAssessment />
            </TabsContent>

            <TabsContent value="self-assessment">
              <NIS2SelfAssessment />
            </TabsContent>

            <TabsContent value="gap-analysis">
              <NIS2GapAnalysis />
            </TabsContent>

            <TabsContent value="remediation">
              <NIS2RemediationTracker assessmentId={undefined} />
            </TabsContent>
          </Tabs>
        </TabsContent>

        <TabsContent value="qatar-nia" className="space-y-4">
          <Tabs defaultValue="assessment" className="space-y-4">
            <TabsList>
              <TabsTrigger value="assessment">Assessment</TabsTrigger>
              <TabsTrigger value="self-assessment">Self Assessment</TabsTrigger>
              <TabsTrigger value="gap-analysis">Gap Analysis</TabsTrigger>
              <TabsTrigger value="remediation">Remediation Tracking</TabsTrigger>
            </TabsList>

            <TabsContent value="assessment">
              <QatarNIAComplianceAssessment />
            </TabsContent>

            <TabsContent value="self-assessment">
              <QatarNIASelfAssessment />
            </TabsContent>

            <TabsContent value="gap-analysis">
              <QatarNIAGapAnalysis />
            </TabsContent>

            <TabsContent value="remediation">
              <QatarNIARemediationTracker assessmentId={undefined} />
            </TabsContent>
          </Tabs>
        </TabsContent>

        <TabsContent value="dora" className="space-y-4">
          <Tabs defaultValue="assessment" className="space-y-4">
            <TabsList>
              <TabsTrigger value="assessment">Assessment</TabsTrigger>
              <TabsTrigger value="self-assessment">Self Assessment</TabsTrigger>
              <TabsTrigger value="gap-analysis">Gap Analysis</TabsTrigger>
              <TabsTrigger value="remediation">Remediation Tracking</TabsTrigger>
            </TabsList>

            <TabsContent value="assessment">
              <DORAComplianceAssessment />
            </TabsContent>

            <TabsContent value="self-assessment">
              <DORASelfAssessment />
            </TabsContent>

            <TabsContent value="gap-analysis">
              <DORAGapAnalysis />
            </TabsContent>

            <TabsContent value="remediation">
              <DORARemediationTracker assessmentId={undefined} />
            </TabsContent>
          </Tabs>
        </TabsContent>

        <TabsContent value="mas" className="space-y-4">
          <Tabs defaultValue="assessment" className="space-y-4">
            <TabsList>
              <TabsTrigger value="assessment">Assessment</TabsTrigger>
              <TabsTrigger value="self-assessment">Self Assessment</TabsTrigger>
              <TabsTrigger value="gap-analysis">Gap Analysis</TabsTrigger>
              <TabsTrigger value="remediation">Remediation Tracking</TabsTrigger>
            </TabsList>

            <TabsContent value="assessment">
              <MASComplianceAssessment />
            </TabsContent>

            <TabsContent value="self-assessment">
              <MASSelfAssessment />
            </TabsContent>

            <TabsContent value="gap-analysis">
              <MASGapAnalysis />
            </TabsContent>

            <TabsContent value="remediation">
              <MASRemediationTracker assessmentId={undefined} />
            </TabsContent>
          </Tabs>
        </TabsContent>

        <TabsContent value="iso27001" className="space-y-4">
          <Tabs defaultValue="assessment" className="space-y-4">
            <TabsList>
              <TabsTrigger value="assessment">Assessment</TabsTrigger>
              <TabsTrigger value="self-assessment">Self Assessment</TabsTrigger>
              <TabsTrigger value="gap-analysis">Gap Analysis</TabsTrigger>
              <TabsTrigger value="remediation">Remediation Tracking</TabsTrigger>
            </TabsList>

            <TabsContent value="assessment">
              <ISO27001ComplianceAssessment />
            </TabsContent>

            <TabsContent value="self-assessment">
              <ISO27001SelfAssessment />
            </TabsContent>

            <TabsContent value="gap-analysis">
              <ISO27001GapAnalysis />
            </TabsContent>

            <TabsContent value="remediation">
              <ISO27001RemediationTracker assessmentId={undefined} />
            </TabsContent>
          </Tabs>
        </TabsContent>

        <TabsContent value="frameworks" className="space-y-4">
          <Card className="gradient-card-primary border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Compliance Frameworks
              </CardTitle>
              <CardDescription>
                Detailed view of all compliance frameworks and their requirements
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <Card className="border-blue-200/50 bg-black/50 backdrop-blur-sm">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">ISO 27001</CardTitle>
                      <Badge className="bg-green-100 text-green-800">Active</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Compliance Score</span>
                      <div className="flex items-center space-x-2">
                        <Progress value={84} className="w-16 h-2" />
                        <span className="text-sm font-medium text-green-600">84%</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Findings</span>
                      <Badge variant="outline" className="text-xs">
                        3
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Last Assessment</span>
                      <span className="text-xs">Dec 1, 2023</span>
                    </div>
                    <Button
                      variant="outline"
                      className="w-full mt-3"
                    >
                      View Details
                    </Button>
                  </CardContent>
                </Card>

                <Card className="border-blue-200/50 bg-black/50 backdrop-blur-sm">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">NIST CSF</CardTitle>
                      <Badge className="bg-yellow-100 text-yellow-800">In Progress</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Compliance Score</span>
                      <div className="flex items-center space-x-2">
                        <Progress value={76} className="w-16 h-2" />
                        <span className="text-sm font-medium text-yellow-600">76%</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Findings</span>
                      <Badge variant="outline" className="text-xs">
                        8
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Last Assessment</span>
                      <span className="text-xs">Nov 10, 2024</span>
                    </div>
                    <Button
                      variant="outline"
                      className="w-full mt-3"
                    >
                      View Details
                    </Button>
                  </CardContent>
                </Card>

                <Card className="border-blue-200/50 bg-black/50 backdrop-blur-sm">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">GDPR</CardTitle>
                      <Badge className="bg-green-100 text-green-800">Active</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Compliance Score</span>
                      <div className="flex items-center space-x-2">
                        <Progress value={92} className="w-16 h-2" />
                        <span className="text-sm font-medium text-green-600">92%</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Findings</span>
                      <Badge variant="outline" className="text-xs">
                        1
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Last Assessment</span>
                      <span className="text-xs">Nov 10, 2024</span>
                    </div>
                    <Button
                      variant="outline"
                      className="w-full mt-3"
                    >
                      View Details
                    </Button>
                  </CardContent>
                </Card>

                <Card className="border-blue-200/50 bg-black/50 backdrop-blur-sm">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">SAMA</CardTitle>
                      <Badge className="bg-blue-100 text-blue-800">In Progress</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Compliance Score</span>
                      <div className="flex items-center space-x-2">
                        <Progress value={75} className="w-16 h-2" />
                        <span className="text-sm font-medium text-blue-600">75%</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Findings</span>
                      <Badge variant="outline" className="text-xs">
                        10
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Last Assessment</span>
                      <span className="text-xs">Jan 5, 2024</span>
                    </div>
                    <Button
                      variant="outline"
                      className="w-full mt-3"
                    >
                      View Details
                    </Button>
                  </CardContent>
                </Card>

                <Card className="border-blue-200/50 bg-black/50 backdrop-blur-sm">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">NIS2</CardTitle>
                      <Badge className="bg-purple-100 text-purple-800">In Progress</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Compliance Score</span>
                      <div className="flex items-center space-x-2">
                        <Progress value={68} className="w-16 h-2" />
                        <span className="text-sm font-medium text-purple-600">68%</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Findings</span>
                      <Badge variant="outline" className="text-xs">
                        15
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Last Assessment</span>
                      <span className="text-xs">Jan 3, 2024</span>
                    </div>
                    <Button
                      variant="outline"
                      className="w-full mt-3"
                    >
                      View Details
                    </Button>
                  </CardContent>
                </Card>

                <Card className="border-blue-200/50 bg-black/50 backdrop-blur-sm">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">Qatar NIA</CardTitle>
                      <Badge className="bg-teal-100 text-teal-800">In Progress</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Compliance Score</span>
                      <div className="flex items-center space-x-2">
                        <Progress value={71} className="w-16 h-2" />
                        <span className="text-sm font-medium text-teal-600">71%</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Findings</span>
                      <Badge variant="outline" className="text-xs">
                        12
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Last Assessment</span>
                      <span className="text-xs">Jan 2, 2024</span>
                    </div>
                    <Button
                      variant="outline"
                      className="w-full mt-3"
                    >
                      View Details
                    </Button>
                  </CardContent>
                </Card>

                <Card className="border-blue-200/50 bg-black/50 backdrop-blur-sm">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">DORA</CardTitle>
                      <Badge className="bg-indigo-100 text-indigo-800">In Progress</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Compliance Score</span>
                      <div className="flex items-center space-x-2">
                        <Progress value={73} className="w-16 h-2" />
                        <span className="text-sm font-medium text-indigo-600">73%</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Findings</span>
                      <Badge variant="outline" className="text-xs">
                        11
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Last Assessment</span>
                      <span className="text-xs">Jan 1, 2024</span>
                    </div>
                    <Button
                      variant="outline"
                      className="w-full mt-3"
                    >
                      View Details
                    </Button>
                  </CardContent>
                </Card>

                <Card className="border-blue-200/50 bg-black/50 backdrop-blur-sm">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">MAS Singapore</CardTitle>
                      <Badge className="bg-orange-100 text-orange-800">In Progress</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Compliance Score</span>
                      <div className="flex items-center space-x-2">
                        <Progress value={76} className="w-16 h-2" />
                        <span className="text-sm font-medium text-orange-600">76%</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Findings</span>
                      <Badge variant="outline" className="text-xs">
                        9
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Last Assessment</span>
                      <span className="text-xs">Dec 28, 2023</span>
                    </div>
                    <Button
                      variant="outline"
                      className="w-full mt-3"
                    >
                      View Details
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="space-y-4">
          <Card className="gradient-card-primary border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Compliance Reports
              </CardTitle>
              <CardDescription>Generate and view compliance reports and documentation</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <Card className="border-blue-200/50 bg-black/50 backdrop-blur-sm">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center space-x-2">
                      <BarChart3 className="h-5 w-5" />
                      <span>Executive Summary</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-3">
                      High-level compliance status across all frameworks
                    </p>
                    <Button
                      variant="outline"
                      className="w-full border-blue-200 hover:bg-blue-50 bg-transparent"
                    >
                      Generate Report
                    </Button>
                  </CardContent>
                </Card>

                <Card className="border-blue-200/50 bg-black/50 backdrop-blur-sm">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center space-x-2">
                      <FileText className="h-5 w-5" />
                      <span>Detailed Assessment</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-3">
                      Comprehensive assessment results and findings
                    </p>
                    <Button
                      variant="outline"
                      className="w-full border-blue-200 hover:bg-blue-50 bg-transparent"
                    >
                      Generate Report
                    </Button>
                  </CardContent>
                </Card>

                <Card className="border-blue-200/50 bg-black/50 backdrop-blur-sm">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center space-x-2">
                      <Shield className="h-5 w-5" />
                      <span>Audit Trail</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-3">
                      Complete audit trail and compliance history
                    </p>
                    <Button
                      variant="outline"
                      className="w-full border-blue-200 hover:bg-blue-50 bg-transparent"
                    >
                      Generate Report
                    </Button>
                  </CardContent>
                </Card>

                <Card className="border-blue-200/50 bg-black/50 backdrop-blur-sm">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center space-x-2">
                      <FileText className="h-5 w-5" />
                      <span>HIPAA Report</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-3">
                      HIPAA-specific compliance report and documentation
                    </p>
                    <Button
                      variant="outline"
                      className="w-full border-blue-200 hover:bg-blue-50 bg-transparent"
                    >
                      Generate Report
                    </Button>
                  </CardContent>
                </Card>

                <Card className="border-blue-200/50 bg-black/50 backdrop-blur-sm">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center space-x-2">
                      <Shield className="h-5 w-5" />
                      <span>NESA UAE Report</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-3">
                      NESA UAE cybersecurity compliance report
                    </p>
                    <Button
                      variant="outline"
                      className="w-full border-blue-200 hover:bg-blue-50 bg-transparent"
                    >
                      Generate Report
                    </Button>
                  </CardContent>
                </Card>

                <Card className="border-blue-200/50 bg-black/50 backdrop-blur-sm">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center space-x-2">
                      <Globe className="h-5 w-5" />
                      <span>NIS2 Report</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-3">
                      NIS2 directive compliance report for EU entities
                    </p>
                    <Button
                      variant="outline"
                      className="w-full border-blue-200 hover:bg-blue-50 bg-transparent"
                    >
                      Generate Report
                    </Button>
                  </CardContent>
                </Card>

                <Card className="border-blue-200/50 bg-black/50 backdrop-blur-sm">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center space-x-2">
                      <Shield className="h-5 w-5" />
                      <span>Qatar NIA Report</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-3">
                      Qatar National Information Assurance compliance report
                    </p>
                    <Button
                      variant="outline"
                      className="w-full border-blue-200 hover:bg-blue-50 bg-transparent"
                    >
                      Generate Report
                    </Button>
                  </CardContent>
                </Card>

                <Card className="border-blue-200/50 bg-black/50 backdrop-blur-sm">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center space-x-2">
                      <Shield className="h-5 w-5" />
                      <span>DORA Report</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-3">
                      Digital Operational Resilience Act compliance report for EU financial entities
                    </p>
                    <Button
                      variant="outline"
                      className="w-full border-blue-200 hover:bg-blue-50 bg-transparent"
                    >
                      Generate Report
                    </Button>
                  </CardContent>
                </Card>

                <Card className="border-blue-200/50 bg-black/50 backdrop-blur-sm">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center space-x-2">
                      <Building className="h-5 w-5" />
                      <span>MAS Report</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-3">
                      Singapore MAS compliance report for financial institutions
                    </p>
                    <Button
                      variant="outline"
                      className="w-full border-blue-200 hover:bg-blue-50 bg-transparent"
                    >
                      Generate Report
                    </Button>
                  </CardContent>
                </Card>

                <Card className="border-blue-200/50 bg-black/50 backdrop-blur-sm">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center space-x-2">
                      <BarChart3 className="h-5 w-5" />
                      <span>Compliance Metrics</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-3">
                      Key performance indicators and compliance metrics
                    </p>
                    <Button
                      variant="outline"
                      className="w-full border-blue-200 hover:bg-blue-50 bg-transparent"
                    >
                      Generate Report
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </main>
  )
}
