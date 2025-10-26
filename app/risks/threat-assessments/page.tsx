"use client"

import { useState, useEffect } from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Plus, Search, Edit, Trash2, Eye, RefreshCw, Shield, AlertTriangle } from "lucide-react"
import { getThreatAssessments, deleteThreatAssessment } from "@/lib/actions/threat-assessment-actions"
import { ThreatAssessmentForm } from "@/components/threat-assessment-form"
import { ThreatAssessmentWizard } from "@/components/threat-assessment-wizard"
import { useToast } from "@/hooks/use-toast"
import { ActionButtons } from "@/components/ui/action-buttons"

export default function ThreatAssessmentsPage() {
  const [assessments, setAssessments] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [assessmentToDelete, setAssessmentToDelete] = useState(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [isWizardOpen, setIsWizardOpen] = useState(false)
  const { toast } = useToast()

  const fetchAssessments = async (search?: string) => {
    setLoading(true)
    try {
      const result = await getThreatAssessments(search)

      if (result.success) {
        setAssessments(result.data || [])
      } else {
        console.error("API error:", result.error)
        setAssessments([])
        toast({
          title: "Error",
          description: result.error || "Failed to load threat assessments",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Failed to fetch threat assessments:", error)
      setAssessments([])
      toast({
        title: "Error",
        description: "Failed to load threat assessments. Please check your database connection.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAssessments()
  }, [])

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchAssessments(searchTerm)
    }, 300)

    return () => clearTimeout(timeoutId)
  }, [searchTerm])

  const handleDeleteAssessment = (assessment: any) => {
    setAssessmentToDelete(assessment)
    setIsDeleteDialogOpen(true)
  }

  const confirmDelete = async () => {
    if (!assessmentToDelete) return

    setIsDeleting(true)
    try {
      const result = await deleteThreatAssessment(assessmentToDelete.id)

      if (result.success) {
        toast({
          title: "Success",
          description: "Threat assessment deleted successfully",
        })
        fetchAssessments(searchTerm)
      } else {
        toast({
          title: "Error",
          description: result.error,
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete threat assessment",
        variant: "destructive",
      })
    } finally {
      setIsDeleting(false)
      setIsDeleteDialogOpen(false)
      setAssessmentToDelete(null)
    }
  }

  const handleFormSuccess = () => {
    setIsFormOpen(false)
    fetchAssessments(searchTerm)
  }

  const handleWizardComplete = () => {
    setIsWizardOpen(false)
    fetchAssessments(searchTerm)
  }

  const getRiskLevelColor = (riskLevel: string | null | undefined) => {
    const riskStr = riskLevel?.toString()?.toLowerCase() || ""
    switch (riskStr) {
      case "critical":
        return "bg-gradient-to-r from-red-600 to-red-800 text-white"
      case "high":
        return "bg-gradient-to-r from-orange-500 to-red-500 text-white"
      case "medium":
        return "bg-gradient-to-r from-yellow-500 to-orange-500 text-white"
      case "low":
        return "bg-gradient-to-r from-green-500 to-blue-500 text-white"
      default:
        return "bg-gradient-to-r from-gray-400 to-gray-500 text-white"
    }
  }

  const getLikelihoodColor = (likelihood: string | null | undefined) => {
    const likelihoodStr = likelihood?.toString()?.toLowerCase() || ""
    switch (likelihoodStr) {
      case "very high":
        return "bg-red-100 text-red-800 border-red-200"
      case "high":
        return "bg-orange-100 text-orange-800 border-orange-200"
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "low":
        return "bg-green-100 text-green-800 border-green-200"
      case "very low":
        return "bg-blue-100 text-blue-800 border-blue-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getImpactColor = (impact: string | null | undefined) => {
    const impactStr = impact?.toString()?.toLowerCase() || ""
    switch (impactStr) {
      case "very high":
        return "bg-red-100 text-red-800 border-red-200"
      case "high":
        return "bg-orange-100 text-orange-800 border-orange-200"
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "low":
        return "bg-green-100 text-green-800 border-green-200"
      case "very low":
        return "bg-blue-100 text-blue-800 border-blue-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  // Calculate metrics
  const metrics = {
    total: assessments.length,
    critical: assessments.filter((assessment: any) => assessment.risk_level?.toString()?.toLowerCase() === "critical")
      .length,
    high: assessments.filter((assessment: any) => assessment.risk_level?.toString()?.toLowerCase() === "high").length,
    pending: assessments.filter(
      (assessment: any) => assessment.mitigation_status?.toString()?.toLowerCase() === "pending",
    ).length,
  }

  return (
    <div className="flex h-screen bg-transparent">
      <div className="flex h-screen relative z-10">
        {/* <Sidebar /> */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* <Header /> */}
          <main className="flex-1 overflow-y-auto p-6">
            <div className="space-y-6">
              {/* Page Header */}
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold  animate-pulse">Threat Assessments</h1>
                  <p className="text-slate-300">Evaluate and manage threat assessments across your organization</p>
                </div>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    onClick={() => fetchAssessments(searchTerm)}
                    disabled={loading}
                    className="border-slate-600 text-slate-300 hover:bg-slate-700"
                  >
                    <RefreshCw className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`} />
                    Refresh
                  </Button>
                  <ActionButtons isTableAction={false} onAdd={() => setIsWizardOpen(true)} btnAddText="Assessment Wizard" />
                  {/* <Button
                    variant="outline"
                    onClick={() => setIsWizardOpen(true)}
                    className="border-slate-600 text-slate-300 hover:bg-slate-700"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Assessment Wizard
                  </Button> */}
                  <ActionButtons isTableAction={false} onAdd={() => setIsFormOpen(true)} btnAddText="Add Assessment" />
                  {/* <Button onClick={() => setIsFormOpen(true)} className="bg-blue-600 hover:bg-blue-700 text-white">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Assessment
                  </Button> */}
                </div>
              </div>

              {/* Metrics Cards */}
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-slate-200">Total Assessments</CardTitle>
                    <Shield className="h-4 w-4 text-slate-400" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-white">{metrics.total}</div>
                    <p className="text-xs text-slate-400">All threat assessments</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-slate-200">Critical Risk</CardTitle>
                    <AlertTriangle className="h-4 w-4 text-red-400" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-red-400">{metrics.critical}</div>
                    <p className="text-xs text-slate-400">Critical risk level</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-slate-200">High Risk</CardTitle>
                    <AlertTriangle className="h-4 w-4 text-orange-400" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-orange-400">{metrics.high}</div>
                    <p className="text-xs text-slate-400">High risk level</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-slate-200">Pending</CardTitle>
                    <AlertTriangle className="h-4 w-4 text-yellow-400" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-yellow-400">{metrics.pending}</div>
                    <p className="text-xs text-slate-400">Pending mitigation</p>
                  </CardContent>
                </Card>
              </div>

              {/* Assessments Table */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-white">Threat Assessment Overview</CardTitle>
                  <CardDescription className="text-slate-300">
                    Total assessments: {assessments.length} | Last updated: {new Date().toLocaleString()}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-2 mb-4">
                    <Search className="h-4 w-4 text-slate-400" />
                    <Input
                      placeholder="Search assessments by name, threat, asset..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="max-w-sm bg-slate-800/50 border-slate-600 text-white placeholder:text-slate-400"
                    />
                  </div>

                  {loading ? (
                    <div className="flex justify-center items-center py-8">
                      <RefreshCw className="h-6 w-6 animate-spin text-blue-400" />
                      <span className="ml-2 text-slate-300">Loading assessments...</span>
                    </div>
                  ) : (
                    <div className="rounded-lg overflow-hidden border border-slate-700">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="text-slate-300">Assessment Name</TableHead>
                            <TableHead className="text-slate-300">Threat ID</TableHead>
                            <TableHead className="text-slate-300">Asset ID</TableHead>
                            <TableHead className="text-slate-300">Likelihood</TableHead>
                            <TableHead className="text-slate-300">Impact</TableHead>
                            <TableHead className="text-slate-300">Risk Level</TableHead>
                            <TableHead className="text-slate-300">Status</TableHead>
                            <TableHead className="text-slate-300">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {assessments.length === 0 ? (
                            <TableRow>
                              <TableCell colSpan={8} className="text-center py-8 text-slate-400">
                                No threat assessments found.{" "}
                                {searchTerm
                                  ? "Try adjusting your search."
                                  : "Add your first assessment to get started."}
                              </TableCell>
                            </TableRow>
                          ) : (
                            assessments.map((assessment: any) => (
                              <TableRow key={assessment.id}>
                                <TableCell className="font-medium text-white">{assessment.assessment_name}</TableCell>
                                <TableCell className="text-slate-300">{assessment.threat_id}</TableCell>
                                <TableCell className="text-slate-300">{assessment.asset_id}</TableCell>
                                <TableCell>
                                  <Badge className={getLikelihoodColor(assessment.likelihood)}>
                                    {assessment.likelihood}
                                  </Badge>
                                </TableCell>
                                <TableCell>
                                  <Badge className={getImpactColor(assessment.impact)}>{assessment.impact}</Badge>
                                </TableCell>
                                <TableCell>
                                  <Badge className={getRiskLevelColor(assessment.risk_level)}>
                                    {assessment.risk_level}
                                  </Badge>
                                </TableCell>
                                <TableCell>
                                  <Badge variant="outline" className="border-slate-600 text-slate-300">
                                    {assessment.mitigation_status}
                                  </Badge>
                                </TableCell>
                                <TableCell>
                                  <div className="flex space-x-2">
                                    <ActionButtons isTableAction={true}
                                      onView={() => {}}
                                      onEdit={() => {}}
                                      onDelete={() => handleDeleteAssessment(assessment)}
                                actionObj={assessment}
                                      //deleteDialogTitle={}
                                    />
                                    {/* <Button variant="ghost" size="sm" className="hover:bg-slate-700 text-slate-300">
                                      <Eye className="h-4 w-4" />
                                    </Button>
                                    <Button variant="ghost" size="sm" className="hover:bg-slate-700 text-slate-300">
                                      <Edit className="h-4 w-4" />
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => handleDeleteAssessment(assessment)}
                                      className="hover:bg-red-900/20 text-red-400"
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </Button> */}
                                  </div>
                                </TableCell>
                              </TableRow>
                            ))
                          )}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </main>
        </div>
      </div>

      {/* Add Assessment Form Dialog */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-slate-900/95 border-slate-700 backdrop-blur-sm">
          <DialogHeader>
            <DialogTitle className="text-white">Add Threat Assessment</DialogTitle>
            <DialogDescription className="text-slate-300">
              Create a new threat assessment to evaluate risks
            </DialogDescription>
          </DialogHeader>
          <ThreatAssessmentForm onSuccess={handleFormSuccess} onCancel={() => setIsFormOpen(false)} />
        </DialogContent>
      </Dialog>

      {/* Assessment Wizard Dialog */}
      <Dialog open={isWizardOpen} onOpenChange={setIsWizardOpen}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto bg-slate-900/95 border-slate-700 backdrop-blur-sm">
          <DialogHeader>
            <DialogTitle className="text-white">Threat Assessment Wizard</DialogTitle>
            <DialogDescription className="text-slate-300">
              Use the guided wizard to create a comprehensive threat assessment
            </DialogDescription>
          </DialogHeader>
          <ThreatAssessmentWizard onComplete={handleWizardComplete} />
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent className="bg-slate-900/95 border-slate-700 backdrop-blur-sm">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">Are you sure?</AlertDialogTitle>
            <AlertDialogDescription className="text-slate-300">
              This action cannot be undone. This will permanently delete the threat assessment "
              {assessmentToDelete?.assessment_name}" and remove all associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-slate-600 text-slate-300 hover:bg-slate-700">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
