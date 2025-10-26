"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, Trash2, Save, X } from "lucide-react"
import { getAssessments } from "@/lib/actions/findings-actions"
import { useToast } from "@/components/ui/use-toast"
import OwnerSelectInput from "@/components/owner-search-input"
import { ActionButtons } from "./ui/action-buttons"

interface BulkFinding {
  id: string
  findingReference: string
  findings: string
  impact: string
  priority: string
  recommendation: string
  framework: string
  dueDate: string
  actionOwner: string
}

interface BulkFindingsTableFormProps {
  onSuccess: () => void
  onCancel: () => void
}

export function BulkFindingsTableForm({ onSuccess, onCancel }: BulkFindingsTableFormProps) {
  const [selectedAssessment, setSelectedAssessment] = useState("")
  const [assessments, setAssessments] = useState<any[]>([])
  const [findings, setFindings] = useState<BulkFinding[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    loadAssessments()
    initializeFindings()
  }, [])

  const loadAssessments = async () => {
    try {
      const result = await getAssessments()
      if (result.success) {
        setAssessments(result.data)
      }
    } catch (error) {
      console.error("Failed to load assessments:", error)
    }
  }

  const initializeFindings = () => {
    const initialFindings: BulkFinding[] = Array.from({ length: 10 }, (_, index) => ({
      id: `finding-${index + 1}`,
      findingReference: "",
      findings: "",
      impact: "",
      priority: "",
      recommendation: "",
      framework: "",
      dueDate: "",
      actionOwner: "",
    }))
    setFindings(initialFindings)
  }

  const generateFindingReference = (assessmentId: string, index: number) => {
    const assessment = assessments.find((a) => a.id.toString() === assessmentId)
    const currentYear = new Date().getFullYear()
    
    if (assessment) {
      // Truncate assessment name to 20 characters and replace spaces with dashes
      const truncatedName = (assessment.assessment_name || "UNKNOWN")
        .substring(0, 20)
        .trim()
        .replace(/\s+/g, "-")
        .toUpperCase()
      
      return `FIND-${currentYear}-${truncatedName}-${String(index + 1).padStart(6, "0")}`
    }
    return `FIND-${currentYear}-UNKNOWN-${String(index + 1).padStart(6, "0")}`
  }

  const updateFinding = (index: number, field: keyof BulkFinding, value: any) => {
    const updatedFindings = [...findings]
    updatedFindings[index] = { ...updatedFindings[index], [field]: value }
    setFindings(updatedFindings)
  }

  const addRow = () => {
    const newFinding: BulkFinding = {
      id: `finding-${findings.length + 1}`,
      findingReference: selectedAssessment ? generateFindingReference(selectedAssessment, findings.length) : "",
      findings: "",
      impact: "",
      priority: "",
      recommendation: "",
      framework: "",
      dueDate: "",
      actionOwner: "",
    }
    setFindings([...findings, newFinding])
  }

  const removeRow = (index: number) => {
    if (findings.length > 1) {
      const updatedFindings = findings.filter((_, i) => i !== index)
      setFindings(updatedFindings)
    }
  }

  const handleAssessmentChange = (assessmentId: string) => {
    setSelectedAssessment(assessmentId)
    // Update all finding references
    const updatedFindings = findings.map((finding, index) => ({
      ...finding,
      findingReference: generateFindingReference(assessmentId, index),
    }))
    setFindings(updatedFindings)
  }

  const validateFindings = () => {
    return findings.filter(
      (finding) => finding.findings.trim() !== "" && finding.impact !== "" && finding.priority !== "" && finding.findingReference.trim() !== "",
    )
  }

  const handleSubmit = async () => {
    if (!selectedAssessment) {
      toast({
        title: "Error",
        description: "Please select an assessment",
        variant: "destructive",
      })
      return
    }

    const validFindings = validateFindings()
    if (validFindings.length === 0) {
      toast({
        title: "Error",
        description: "Please fill in at least one complete finding",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)
    try {
      // Transform findings to match database structure
      const findingsData = validFindings.map((finding) => ({
        assessment_id: Number(selectedAssessment),
        finding_title: finding.findings.substring(0, 100) + (finding.findings.length > 100 ? "..." : ""),
        finding_description: finding.findings,
        severity: finding.impact,
        priority: finding.priority,
        recommendation: finding.recommendation,
        category: finding.framework,
        due_date: finding.dueDate || null,
        assigned_to: finding.actionOwner || null,
        status: "Open",
        finding_reference: finding.findingReference,
      }))

      const response = await fetch("/api/findings/bulk", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ findings: findingsData }),
      })

      const result = await response.json()

      if (result.success) {
        toast({
          title: "🎉 Congratulations!",
          description: `${validFindings.length} finding(s) are successfully created`,
          duration: 5000,
        })
        onSuccess()
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to create findings",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error creating bulk findings:", error)
      toast({
        title: "Error",
        description: "Failed to create findings",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const validFindingsCount = validateFindings().length

  return (
    <div className="space-y-6">
      {/* Assessment Selection */}
      <Card className="gradient-card">
        <CardHeader>
          <CardTitle className="text-lg">Select Target Assessment</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
          <Select value={selectedAssessment} onValueChange={handleAssessmentChange}>
            <SelectTrigger className="w-96">
              <SelectValue placeholder="Choose assessment for all findings..." />
            </SelectTrigger>
            <SelectContent>
              {assessments.length > 0 ? (
                assessments.map((assessment) => (
                  <SelectItem key={assessment.id} value={assessment.id.toString()}>
                    <div className="flex flex-col">
                      <span className="font-medium">{assessment.assessment_name}</span>
                      <span className="text-sm text-muted-foreground">
                        {assessment.assessment_id} • {assessment.organization_name}
                      </span>
                    </div>
                  </SelectItem>
                ))
              ) : (
                <SelectItem disabled value="none">No assessments found</SelectItem>
              )}
            </SelectContent>
          </Select>
            {validFindingsCount > 0 && (
              <Badge className="bg-gradient-to-r from-green-600 to-blue-600 text-white">
                {validFindingsCount} Valid Findings
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Bulk Findings Table */}
      <Card className="gradient-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Bulk Findings Entry</CardTitle>
            <ActionButtons isTableAction={false} onAdd={addRow} btnAddText="Add Row"/>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="truncate">Find ID</TableHead>
                  <TableHead className="truncate">Finding Reference</TableHead>
                  <TableHead className="truncate">Findings</TableHead>
                  <TableHead className="truncate">Impact</TableHead>
                  <TableHead className="truncate">Priority</TableHead>
                  <TableHead className="truncate">Recommendation</TableHead>
                  <TableHead className="truncate">Framework</TableHead>
                  <TableHead className="truncate">Due Date</TableHead>
                  <TableHead className="truncate">Action Owner</TableHead>
                  <TableHead className="truncate text-center">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {findings.map((finding, index) => (
                  <TableRow key={finding.id}>
                    {/* Find ID */}
                    <TableCell className="text-center font-medium">{index + 1}</TableCell>

                    {/* Finding Reference */}
                    <TableCell>
                      <Input
                        value={finding.findingReference}
                        readOnly
                        disabled
                        placeholder="Auto-generated"
                        className="text-sm bg-muted"
                      />
                    </TableCell>

                    {/* Findings */}
                    <TableCell>
                      <Textarea
                        value={finding.findings}
                        onChange={(e) => updateFinding(index, "findings", e.target.value)}
                        placeholder="Describe the security finding..."
                        className="min-h-20 resize-none"
                        rows={3}
                      />
                    </TableCell>

                    {/* Impact */}
                    <TableCell>
                      <Select value={finding.impact} onValueChange={(value) => updateFinding(index, "impact", value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Impact" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Critical">Critical</SelectItem>
                          <SelectItem value="High">High</SelectItem>
                          <SelectItem value="Medium">Medium</SelectItem>
                          <SelectItem value="Low">Low</SelectItem>
                          <SelectItem value="Informational">Informational</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>

                    {/* Priority */}
                    <TableCell>
                      <Select
                        value={finding.priority}
                        onValueChange={(value) => updateFinding(index, "priority", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Priority" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Critical">Critical</SelectItem>
                          <SelectItem value="High">High</SelectItem>
                          <SelectItem value="Medium">Medium</SelectItem>
                          <SelectItem value="Low">Low</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>

                    {/* Recommendation */}
                    <TableCell>
                      <Textarea
                        value={finding.recommendation}
                        onChange={(e) => updateFinding(index, "recommendation", e.target.value)}
                        placeholder="Recommended remediation steps..."
                        className="min-h-20 resize-none"
                        rows={3}
                      />
                    </TableCell>

                    {/* Framework */}
                    <TableCell>
                      <Select
                        value={finding.framework}
                        onValueChange={(value) => updateFinding(index, "framework", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Framework" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="CIS">CIS</SelectItem>
                          <SelectItem value="NIST">NIST</SelectItem>
                          <SelectItem value="ISO27001">ISO 27001</SelectItem>
                          <SelectItem value="OWASP">OWASP</SelectItem>
                          <SelectItem value="PCI-DSS">PCI-DSS</SelectItem>
                          <SelectItem value="HIPAA">HIPAA</SelectItem>
                          <SelectItem value="SOX">SOX</SelectItem>
                          <SelectItem value="Custom">Custom</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>

                    {/* Due Date */}
                    <TableCell>
                      <Input
                        type="date"
                        value={finding.dueDate}
                        onChange={(e) => updateFinding(index, "dueDate", e.target.value)}
                        className="w-full border-2 hover:border-purple-300 focus:border-purple-500 transition-colors"
                        placeholder="Select due date"
                      />
                    </TableCell>

                    {/* Action Owner */}
                    <TableCell>
                      <OwnerSelectInput
                        formData={finding}
                        setFormData={(updatedFinding) => {
                          const updatedFindings = [...findings]
                          updatedFindings[index] = updatedFinding
                          setFindings(updatedFindings)
                        }}
                        fieldName="actionOwner"
                      />
                    </TableCell>

                    {/* Actions */}
                    <TableCell>
                      <ActionButtons isTableAction={true}
                        onDelete={() => removeRow(index)}
                        deleteDialogTitle={finding.findings}
                                actionObj={finding}
                      />                      
                      {/* <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeRow(index)}
                        disabled={findings.length <= 1}
                        className="text-red-400 hover:bg-red-900/20 hover:text-red-300 dark:text-red-400 dark:hover:bg-red-900/20 dark:hover:text-red-300"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button> */}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          {validFindingsCount} of {findings.length} findings are complete and ready to submit
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={onCancel} 
            disabled={isSubmitting}
          >
            <X className="h-4 w-4 mr-2" />
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!selectedAssessment || validFindingsCount === 0 || isSubmitting}
          >
            <Save className="h-4 w-4 mr-2" />
            {isSubmitting ? "Creating..." : `Create ${validFindingsCount} Findings`}
          </Button>
        </div>
      </div>
    </div>
  )
}
