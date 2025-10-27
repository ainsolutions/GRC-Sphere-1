"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { AlertTriangle, Building, CheckCircle, Edit, Eye, FileText, Globe, Lock, Plus, RefreshCw, Search, Server, XCircle, Zap } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface SBPAssessment {
  id: number
  assessment_name: string
  organization_id: number
  assessment_type: string
  scope: string
  assessment_methodology: string
  assessor_name: string
  assessor_organization: string
  status: string
  overall_maturity_level?: string
  compliance_percentage?: number
  risk_rating?: string
  findings_summary?: string
  recommendations?: string
  next_assessment_date?: string
}

interface SBPRequirement {
  id: number
  domain: string
  control_id: string
  control_name: string
  description: string
  control_type: string
  maturity_level: string
  status?: string
  implementation_guidance: string
}

export function SBPETRMFComplianceAssessment() {
  const [assessments, setAssessments] = useState<SBPAssessment[]>([])
  const [requirements, setRequirements] = useState<SBPRequirement[]>([])
  const [selectedAssessment, setSelectedAssessment] = useState<SBPAssessment | null>(null)
  const [isNewAssessmentOpen, setIsNewAssessmentOpen] = useState(false)
  const [isAssessmentDetailOpen, setIsAssessmentDetailOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const { toast } = useToast()

  const [newAssessment, setNewAssessment] = useState({
    assessment_name: "",
    organization_id: 1,
    assessment_type: "Initial",
    scope: "",
    assessment_methodology: "Self-Assessment",
    assessor_name: "",
    assessor_organization: "",
  })

  useEffect(() => {
    fetchAssessments()
    fetchRequirements()
  }, [])

  const fetchAssessments = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/sbp-etrmf-assessments")
      if (response.ok) {
        const data = await response.json()
        setAssessments(data)
      }
    } catch (error) {
      console.error("Failed to fetch SBP ETRMF assessments:", error)
      toast({ title: "Error", description: "Failed to load SBP ETRMF assessments", variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }

  const fetchRequirements = async () => {
    try {
      const response = await fetch("/api/sbp-etrmf/requirements")
      if (response.ok) {
        const data = await response.json()
        setRequirements(data)
      }
    } catch (error) {
      console.error("Failed to fetch SBP ETRMF requirements:", error)
    }
  }

  const createAssessment = async () => {
    try {
      const response = await fetch("/api/sbp-etrmf-assessments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newAssessment),
      })
      if (response.ok) {
        toast({ title: "Created", description: "Assessment created successfully" })
        setIsNewAssessmentOpen(false)
        setNewAssessment({
          assessment_name: "",
          organization_id: 1,
          assessment_type: "Initial",
          scope: "",
          assessment_methodology: "Self-Assessment",
          assessor_name: "",
          assessor_organization: "",
        })
        fetchAssessments()
      }
    } catch (error) {
      console.error("Failed to create SBP ETRMF assessment:", error)
      toast({ title: "Error", description: "Failed to create assessment", variant: "destructive" })
    }
  }

  const filteredRequirements = requirements.filter(r =>
    r.control_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.control_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.domain.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-4">
      <Card className="gradient-card-primary">
        <CardHeader className="pb-2">
          <CardTitle className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            SBP ETRMF Compliance Assessment
          </CardTitle>
          <CardDescription>Assess against State Bank of Pakistan ETRMF requirements</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">Assessments: {assessments.length} • Requirements: {requirements.length}</div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={fetchAssessments}>
                <RefreshCw className="h-4 w-4 mr-2" /> Refresh
              </Button>
              <Dialog open={isNewAssessmentOpen} onOpenChange={setIsNewAssessmentOpen}>
                <DialogTrigger asChild>
                  <Button size="sm">
                    <Plus className="h-4 w-4 mr-2" /> New Assessment
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-lg">
                  <DialogHeader>
                    <DialogTitle>New SBP ETRMF Assessment</DialogTitle>
                  </DialogHeader>
                  <div className="grid grid-cols-1 gap-3">
                    <div>
                      <Label>Assessment Name</Label>
                      <Input value={newAssessment.assessment_name} onChange={e => setNewAssessment(a => ({ ...a, assessment_name: e.target.value }))} />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label>Type</Label>
                        <Select value={newAssessment.assessment_type} onValueChange={v => setNewAssessment(a => ({ ...a, assessment_type: v }))}>
                          <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Initial">Initial</SelectItem>
                            <SelectItem value="Periodic">Periodic</SelectItem>
                            <SelectItem value="Follow-up">Follow-up</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>Methodology</Label>
                        <Select value={newAssessment.assessment_methodology} onValueChange={v => setNewAssessment(a => ({ ...a, assessment_methodology: v }))}>
                          <SelectTrigger><SelectValue placeholder="Select methodology" /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Self-Assessment">Self-Assessment</SelectItem>
                            <SelectItem value="Independent Review">Independent Review</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div>
                      <Label>Scope</Label>
                      <Textarea value={newAssessment.scope} onChange={e => setNewAssessment(a => ({ ...a, scope: e.target.value }))} />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label>Assessor Name</Label>
                        <Input value={newAssessment.assessor_name} onChange={e => setNewAssessment(a => ({ ...a, assessor_name: e.target.value }))} />
                      </div>
                      <div>
                        <Label>Assessor Organization</Label>
                        <Input value={newAssessment.assessor_organization} onChange={e => setNewAssessment(a => ({ ...a, assessor_organization: e.target.value }))} />
                      </div>
                    </div>
                    <div className="flex justify-end gap-2 pt-2">
                      <Button variant="outline" onClick={() => setIsNewAssessmentOpen(false)}>Cancel</Button>
                      <Button onClick={createAssessment}>Create</Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle>Requirements</CardTitle>
          <CardDescription>ETRMF domains and controls</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2 w-80">
              <Search className="h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search controls, domains..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
            </div>
          </div>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-24">Control ID</TableHead>
                  <TableHead>Control</TableHead>
                  <TableHead>Domain</TableHead>
                  <TableHead className="hidden md:table-cell">Type</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRequirements.map((r) => (
                  <TableRow key={r.id}>
                    <TableCell className="font-medium">{r.control_id}</TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-medium">{r.control_name}</span>
                        <span className="text-xs text-muted-foreground line-clamp-2">{r.description}</span>
                      </div>
                    </TableCell>
                    <TableCell>{r.domain}</TableCell>
                    <TableCell className="hidden md:table-cell">
                      <Badge variant="outline">{r.control_type}</Badge>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredRequirements.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center text-muted-foreground py-8">No requirements found.</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default SBPETRMFComplianceAssessment


