"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Progress } from "@/components/ui/progress"
import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from "@/components/ui/separator"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import {
  Shield,
  Plus,
  Edit,
  Trash2,
  FileText,
  Target,
  AlertTriangle,
  CheckCircle,
  Calendar,
  User,
  Building,
  TrendingUp,
  BarChart3,
  Clock,
  Users,
  Zap,
  Award,
  Filter,
  Search,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  X,
  SlidersHorizontal,
  Download,
  Upload
} from "lucide-react"
import { toast } from "sonner"
import StarBorder from "../StarBorder"
import { ActionButtons } from "@/components/ui/action-buttons"
import OwnerSelectInput from "@/components/owner-search-input"

interface CyberMaturityAssessment {
  id?: number
  assessment_name: string
  description: string
  assessment_date: string
  assessor_name: string
  department: string
  status: 'draft' | 'in_progress' | 'completed' | 'approved'
  created_at?: string
  updated_at?: string
}

interface CRIControl {
  id?: number
  control_id: string
  control_name: string
  domain: string
  control_objective: string
  maturity_level_1: string
  maturity_level_2: string
  maturity_level_3: string
  maturity_level_4: string
  maturity_level_5: string
  created_at?: string
  updated_at?: string
}

interface MaturityAssessment {
  id?: number
  assessment_id: number
  control_id: number
  current_maturity_level: number
  target_maturity_level: number
  assessment_date: string
  assessor_comments: string
  evidence: string
  control_id_str?: string
  control_name?: string
  domain?: string
  assessment_name?: string
}

interface GapsAnalysis {
  id?: number
  assessment_id: number
  control_id: number
  gap_description: string
  severity: 'low' | 'medium' | 'high' | 'critical'
  priority: 'low' | 'medium' | 'high' | 'critical'
  estimated_effort: string
  recommended_actions: string
  control_id_str?: string
  control_name?: string
  domain?: string
  assessment_name?: string
}

interface RemediationTracking {
  id?: number
  gap_id: number
  remediation_plan: string
  assigned_to: string
  due_date: string
  status: 'not_started' | 'in_progress' | 'completed' | 'on_hold'
  actual_completion_date?: string
  notes: string
  gap_description?: string
  severity?: string
  control_id?: string
  control_name?: string
}

export default function CyberMaturityPage() {
  const [activeTab, setActiveTab] = useState("planning")
  const [assessments, setAssessments] = useState<CyberMaturityAssessment[]>([])
  const [criControls, setCriControls] = useState<CRIControl[]>([])
  const [maturityAssessments, setMaturityAssessments] = useState<MaturityAssessment[]>([])
  const [gapsAnalysis, setGapsAnalysis] = useState<GapsAnalysis[]>([])
  const [remediationTracking, setRemediationTracking] = useState<RemediationTracking[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedAssessment, setSelectedAssessment] = useState<number | null>(null)

  // Form states
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [editingAssessment, setEditingAssessment] = useState<CyberMaturityAssessment | null>(null)
  const [selectedAssessmentForControls, setSelectedAssessmentForControls] = useState<number | null>(null)
  const [isAssessDialogOpen, setIsAssessDialogOpen] = useState(false)
  const [selectedControl, setSelectedControl] = useState<CRIControl | null>(null)
  const [isCreateRemediationOpen, setIsCreateRemediationOpen] = useState(false)
  const [selectedGapForRemediation, setSelectedGapForRemediation] = useState<number | null>(null)
  const [mounted, setMounted] = useState(false)
  const [editingRemediationId, setEditingRemediationId] = useState<number | null>(null);

  const [isCreateGapDialogOpen, setIsCreateGapDialogOpen] = useState(false)
  const [manualGapForm, setManualGapForm] = useState({
    assessment_id: "",
    control_id: "",
    gap_description: "",
    severity: "medium",
    priority: "medium",
    estimated_effort: "",
    recommended_actions: ""
  })


  // Set mounted state to fix hydration issues
  useEffect(() => {
    setMounted(true)
  }, [])

  // Filter states
  const [controlFilters, setControlFilters] = useState({
    domains: [] as string[],
    search: ""
  })
  const [assessmentFilters, setAssessmentFilters] = useState({
    statuses: [] as string[],
    departments: [] as string[],
    assessors: [] as string[]
  })
  const [gapFilters, setGapFilters] = useState({
    severities: [] as string[],
    priorities: [] as string[],
    domains: [] as string[]
  })
  const [remediationFilters, setRemediationFilters] = useState({
    statuses: [] as string[],
    assignees: [] as string[],
    severities: [] as string[]
  })

  // Pagination states
  const [controlPagination, setControlPagination] = useState({
    page: 1,
    pageSize: 10,
    total: 0
  })
  const [assessmentPagination, setAssessmentPagination] = useState({
    page: 1,
    pageSize: 10,
    total: 0
  })
  const [gapPagination, setGapPagination] = useState({
    page: 1,
    pageSize: 10,
    total: 0
  })
  const [remediationPagination, setRemediationPagination] = useState({
    page: 1,
    pageSize: 10,
    total: 0
  })
  const [assessmentForm, setAssessmentForm] = useState({
    assessment_name: "",
    description: "",
    assessment_date: "",
    assessor_name: "",
    department: "",
    status: "draft" as const
  })

  const [controlAssessmentForm, setControlAssessmentForm] = useState({
    current_level: 1,
    target_level: 1,
    assessment_date: new Date().toISOString().split('T')[0],
    comments: "",
    evidence: "",
    gap_description: "",
    gap_severity: "medium" as const,
    estimated_effort: "",
    recommended_actions: ""
  })

  const [remediationForm, setRemediationForm] = useState({
    gap_id: "",
    remediation_plan: "",
    assigned_to: "",
    due_date: "",
    status: "not_started" as const,
    notes: ""
  })

  // Import/Export state
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false)
  const [isExportDialogOpen, setIsExportDialogOpen] = useState(false)
  const [exportFormat, setExportFormat] = useState<'csv' | 'excel' | 'json'>('csv')
  const [exportDomain, setExportDomain] = useState<string>('all')
  const [isImporting, setIsImporting] = useState(false)
  const [isExporting, setIsExporting] = useState(false)

  useEffect(() => {
    loadData()
  }, [])

  // Update pagination totals when filtered data changes
  useEffect(() => {
    const filteredAssessments = assessments.filter(assessment => {
      // Search filter
      if (assessmentFilters.search) {
        const searchTerm = assessmentFilters.search.toLowerCase()
        if (!assessment.assessment_name.toLowerCase().includes(searchTerm) &&
          !assessment.assessor_name.toLowerCase().includes(searchTerm) &&
          !assessment.department?.toLowerCase().includes(searchTerm)) {
          return false
        }
      }

      // Status filter
      if (assessmentFilters.statuses?.length > 0) {
        if (!assessmentFilters.statuses.includes(assessment.status)) {
          return false
        }
      }

      // Department filter
      if (assessmentFilters.departments?.length > 0) {
        if (!assessment.department || !assessmentFilters.departments.includes(assessment.department)) {
          return false
        }
      }

      // Assessor filter
      if (assessmentFilters.assessors?.length > 0) {
        if (!assessmentFilters.assessors.includes(assessment.assessor_name)) {
          return false
        }
      }

      return true
    })

    setAssessmentPagination(prev => ({ ...prev, total: filteredAssessments.length }))
  }, [assessments, assessmentFilters])

  useEffect(() => {
    const filteredControls = criControls.filter(control => {
      // Search filter
      if (controlFilters.search) {
        const searchTerm = controlFilters.search.toLowerCase()
        if (!control.control_name.toLowerCase().includes(searchTerm) &&
          !control.control_id.toLowerCase().includes(searchTerm) &&
          !control.control_objective.toLowerCase().includes(searchTerm)) {
          return false
        }
      }

      // Domain filter
      if (controlFilters.domains.length > 0) {
        if (!controlFilters.domains.includes(control.domain)) {
          return false
        }
      }

      return true
    })

    setControlPagination(prev => ({ ...prev, total: filteredControls.length }))
  }, [criControls, controlFilters])

  useEffect(() => {
    const filteredGaps = gapsAnalysis.filter(gap => {
      // Assessment filter
      if (gap.assessment_id !== selectedAssessmentForControls) {
        return false
      }

      // Search filter
      if (gapFilters.search) {
        const searchTerm = gapFilters.search.toLowerCase()
        if (!gap.gap_description.toLowerCase().includes(searchTerm) &&
          !gap.control_id_str?.toLowerCase().includes(searchTerm) &&
          !gap.control_name?.toLowerCase().includes(searchTerm)) {
          return false
        }
      }

      // Severity filter
      if (gapFilters.severities?.length > 0) {
        if (!gapFilters.severities.includes(gap.severity)) {
          return false
        }
      }

      // Priority filter
      if (gapFilters.priorities?.length > 0) {
        if (!gapFilters.priorities.includes(gap.priority)) {
          return false
        }
      }

      // Domain filter
      if (gapFilters.domains?.length > 0) {
        if (!gap.domain || !gapFilters.domains.includes(gap.domain)) {
          return false
        }
      }

      return true
    })

    setGapPagination(prev => ({ ...prev, total: filteredGaps.length }))
  }, [gapsAnalysis, gapFilters, selectedAssessmentForControls])

  useEffect(() => {
    const filteredRemediations = remediationTracking.filter(remediation => {
      // Assessment filter
      const gap = gapsAnalysis.find(g => g.id === remediation.gap_id)
      if (!gap || gap.assessment_id !== selectedAssessmentForControls) {
        return false
      }

      // Search filter
      if (remediationFilters.search) {
        const searchTerm = remediationFilters.search.toLowerCase()
        if (!remediation.remediation_plan.toLowerCase().includes(searchTerm) &&
          !remediation.assigned_to.toLowerCase().includes(searchTerm) &&
          !remediation.notes?.toLowerCase().includes(searchTerm)) {
          return false
        }
      }

      // Status filter
      if (remediationFilters.statuses?.length > 0) {
        if (!remediationFilters.statuses.includes(remediation.status)) {
          return false
        }
      }

      // Assignee filter
      if (remediationFilters.assignees?.length > 0) {
        if (!remediationFilters.assignees.includes(remediation.assigned_to)) {
          return false
        }
      }

      // Severity filter (from associated gap)
      if (remediationFilters.severities?.length > 0) {
        const gap = gapsAnalysis.find(g => g.id === remediation.gap_id)
        if (!gap || !remediationFilters.severities.includes(gap.severity)) {
          return false
        }
      }

      return true
    })

    setRemediationPagination(prev => ({ ...prev, total: filteredRemediations.length }))
  }, [remediationTracking, remediationFilters, gapsAnalysis, selectedAssessmentForControls])

  const loadData = async () => {
    try {
      setLoading(true)
      await Promise.all([
        loadAssessments(),
        loadCRIControls(),
        loadMaturityAssessments(),
        loadGapsAnalysis(),
        loadRemediationTracking()
      ])
    } catch (error) {
      console.error("Error loading data:", error)
      toast.error("Failed to load data")
    } finally {
      setLoading(false)
    }
  }

  const loadAssessments = async () => {
    try {
      const response = await fetch('/api/cyber-maturity')
      const result = await response.json()
      if (result.success) {
        setAssessments(result.data)
      }
    } catch (error) {
      console.error("Error loading assessments:", error)
    }
  }

  const loadCRIControls = async () => {
    try {
      const response = await fetch('/api/cri-controls')
      const result = await response.json()
      if (result.success) {
        setCriControls(result.data)

        // If no controls exist, seed them
        if (result.data.length === 0) {
          await seedCRIControlsData()
        }
      }
    } catch (error) {
      console.error("Error loading CRI controls:", error)
    }
  }

  const seedCRIControlsData = async () => {
    try {
      const response = await fetch('/api/cri-controls/seed', {
        method: 'POST'
      })
      const result = await response.json()
      if (result.success) {
        // Reload controls after seeding
        loadCRIControls()
        toast.success("CRI controls initialized successfully")
      }
    } catch (error) {
      console.error("Error seeding CRI controls:", error)
    }
  }

  const loadMaturityAssessments = async () => {
    try {
      const response = await fetch('/api/maturity-assessments')
      const result = await response.json()
      if (result.success) {
        setMaturityAssessments(result.data)
      }
    } catch (error) {
      console.error("Error loading maturity assessments:", error)
    }
  }

  const loadGapsAnalysis = async () => {
    try {
      const response = await fetch('/api/gaps-analysis')
      const result = await response.json()
      if (result.success) {
        setGapsAnalysis(result.data)
      }
    } catch (error) {
      console.error("Error loading gaps analysis:", error)
    }
  }

  const loadRemediationTracking = async () => {
    try {
      const response = await fetch('/api/remediation-tracking')
      const result = await response.json()
      if (result.success) {
        setRemediationTracking(result.data)
      }
    } catch (error) {
      console.error("Error loading remediation tracking:", error)
    }
  }

  const handleCreateAssessment = async () => {
    try {
      const response = await fetch('/api/cyber-maturity', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(assessmentForm)
      })

      const result = await response.json()

      if (result.success) {
        toast.success("Assessment created successfully")
        setIsCreateDialogOpen(false)
        resetForm()
        loadAssessments()
      } else {
        toast.error(result.error || "Failed to create assessment")
      }
    } catch (error) {
      console.error("Error creating assessment:", error)
      toast.error("Failed to create assessment")
    }
  }

  const handleUpdateAssessment = async () => {
    if (!editingAssessment?.id) return

    try {
      const response = await fetch(`/api/cyber-maturity/${editingAssessment.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(assessmentForm)
      })

      const result = await response.json()

      if (result.success) {
        toast.success("Assessment updated successfully")
        setEditingAssessment(null)
        resetForm()
        loadAssessments()
      } else {
        toast.error(result.error || "Failed to update assessment")
      }
    } catch (error) {
      console.error("Error updating assessment:", error)
      toast.error("Failed to update assessment")
    }
  }

  const handleDeleteAssessment = async (id: number) => {
    try {
      const response = await fetch(`/api/cyber-maturity/${id}`, {
        method: 'DELETE'
      })

      const result = await response.json()

      if (result.success) {
        toast.success("Assessment deleted successfully")
        loadAssessments()
      } else {
        toast.error(result.error || "Failed to delete assessment")
      }
    } catch (error) {
      console.error("Error deleting assessment:", error)
      toast.error("Failed to delete assessment")
    }
  }

  const resetForm = () => {
    setAssessmentForm({
      assessment_name: "",
      description: "",
      assessment_date: "",
      assessor_name: "",
      department: "",
      status: "draft"
    })
  }

  const openEditDialog = (assessment: CyberMaturityAssessment) => {
    setEditingAssessment(assessment)
    setAssessmentForm({
      assessment_name: assessment.assessment_name,
      description: assessment.description,
      assessment_date: assessment.assessment_date,
      assessor_name: assessment.assessor_name,
      department: assessment.department,
      status: assessment.status
    })
  }

  const openAssessControlDialog = (control: CRIControl) => {
    setSelectedControl(control)
    setIsAssessDialogOpen(true)
    setControlAssessmentForm({
      current_level: 1,
      target_level: 1,
      assessment_date: new Date().toISOString().split('T')[0],
      comments: "",
      evidence: "",
      gap_description: "",
      gap_severity: "medium",
      estimated_effort: "",
      recommended_actions: ""
    })
  }

  const handleControlAssessment = async () => {
    if (!selectedAssessmentForControls || !selectedControl) return;

    try {
      // First, create the maturity assessment
      const response = await fetch('/api/maturity-assessments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          assessment_id: selectedAssessmentForControls,
          control_id: selectedControl.id,
          current_maturity_level: controlAssessmentForm.current_level,
          target_maturity_level: controlAssessmentForm.target_level,
          assessment_date: controlAssessmentForm.assessment_date,
          assessor_comments: controlAssessmentForm.comments,
          evidence: controlAssessmentForm.evidence,
        }),
      });

      const result = await response.json();

      if (result.success) {
        // If there's a gap (current level < target level), create a gap record
        if (controlAssessmentForm.current_level < controlAssessmentForm.target_level) {
          // Validate required gap fields
          if (!controlAssessmentForm.gap_description || !controlAssessmentForm.estimated_effort) {
            toast.error("Gap description and estimated effort are required when a gap is detected");
            return;
          }

          // Auto-generate gap description if not provided
          const gapDescription =
            controlAssessmentForm.gap_description ||
            `Current maturity level (${controlAssessmentForm.current_level}) is below target level (${controlAssessmentForm.target_level}) for ${selectedControl.control_name}`;

          // Determine priority based on severity
          let priority: 'low' | 'medium' | 'high' | 'critical' = 'medium';
          if (controlAssessmentForm.gap_severity === 'critical') priority = 'critical';
          else if (controlAssessmentForm.gap_severity === 'high') priority = 'high';
          else if (controlAssessmentForm.gap_severity === 'low') priority = 'low';

          // Create the gap record
          const gapResponse = await fetch('/api/gaps-analysis', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              assessment_id: selectedAssessmentForControls ?? 2, // fallback for safety
              control_id: selectedControl.id,
              gap_description: gapDescription,
              severity: controlAssessmentForm.gap_severity,
              priority,
              estimated_effort: controlAssessmentForm.estimated_effort,
              recommended_actions: controlAssessmentForm.recommended_actions,
            }),
          });

          const gapResult = await gapResponse.json();

          if (gapResult.success) {
            toast.success("Control assessment and gap analysis created successfully");
            loadGapsAnalysis();
          } else {
            toast.warning("Control assessment created but gap analysis failed");
          }
        }

        setIsAssessDialogOpen(false);
        loadMaturityAssessments();
      } else {
        toast.error(result.error || "Failed to create control assessment");
      }
    } catch (error) {
      console.error("Error creating control assessment:", error);
      toast.error("Failed to create control assessment");
    }
  };


  const handleCreateRemediation = async () => {
    try {
      const response = await fetch('/api/remediation-tracking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          gap_id: parseInt(remediationForm.gap_id),
          remediation_plan: remediationForm.remediation_plan,
          assigned_to: remediationForm.assigned_to,
          due_date: remediationForm.due_date,
          status: remediationForm.status,
          notes: remediationForm.notes
        })
      })

      const result = await response.json()

      if (result.success) {
        toast.success("Remediation activity created successfully")
        setIsCreateRemediationOpen(false)
        resetRemediationForm()
        loadRemediationTracking()
      } else {
        toast.error(result.error || "Failed to create remediation activity")
      }
    } catch (error) {
      console.error("Error creating remediation:", error)
      toast.error("Failed to create remediation activity")
    }
  }

  // Import/Export handlers
  const handleExportControls = async () => {
    setIsExporting(true)
    try {
      const response = await fetch(`/api/cri-controls/export?format=${exportFormat}&domain=${exportDomain}`)

      if (!response.ok) {
        const error = await response.json()
        toast.error(error.error || "Failed to export controls")
        return
      }

      // Create download link
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url

      const extension = exportFormat === 'excel' ? 'xls' : exportFormat
      link.download = `cri-controls-${exportDomain}-${new Date().toISOString().split('T')[0]}.${extension}`

      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)

      toast.success("Controls exported successfully")
      setIsExportDialogOpen(false)
    } catch (error) {
      console.error("Error exporting controls:", error)
      toast.error("Failed to export controls")
    } finally {
      setIsExporting(false)
    }
  }

  const handleImportControls = async (file: File, overwrite: boolean = false) => {
    setIsImporting(true)
    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('overwrite', overwrite.toString())

      const response = await fetch('/api/cri-controls/import', {
        method: 'POST',
        body: formData
      })

      const result = await response.json()

      if (result.success) {
        toast.success(result.message)
        setIsImportDialogOpen(false)
        // Reload CRI controls to reflect changes
        loadCRIControls()
      } else {
        toast.error(result.error || "Failed to import controls")
      }
    } catch (error) {
      console.error("Error importing controls:", error)
      toast.error("Failed to import controls")
    } finally {
      setIsImporting(false)
    }
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      handleImportControls(file, false)
    }
  }

  const resetRemediationForm = () => {
    setRemediationForm({
      gap_id: "",
      remediation_plan: "",
      assigned_to: "",
      due_date: "",
      status: "not_started",
      notes: ""
    })
  }

  const handleEditRemediation = (remediation) => {
    setEditingRemediationId(remediation.id);
    setRemediationForm({
      gap_id: remediation.gap_id,
      remediation_plan: remediation.remediation_plan,
      assigned_to: remediation.assigned_to,
      due_date: remediation.due_date.split("T")[0],
      status: remediation.status,
      notes: remediation.notes || "",
    });
    setIsCreateRemediationOpen(true);
  };


  const handleCompleteRemediation = async (id: number) => {
    try {
      const response = await fetch(`/api/remediation-tracking/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: "completed",
          actual_completion_date: new Date().toISOString(),
        }),
      });

      const result = await response.json();

      if (result.success) {
        toast.success("Remediation marked as completed");

        // ✅ Update local state without reload
        setRemediationTracking((prev) =>
          prev.map((r) =>
            r.id === id ? { ...r, status: "completed" } : r
          )
        );

        // Optionally still reload from API if needed
        // await loadRemediationTracking();
      } else {
        toast.error(result.error || "Failed to complete remediation");
      }
    } catch (error) {
      console.error("Error completing remediation:", error);
      toast.error("Error completing remediation");
    }
  };

  const handleUpdateRemediation = async (id: number) => {
    try {
      const response = await fetch(`/api/remediation-tracking/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(remediationForm),
      });

      const result = await response.json();

      if (result.success) {
        toast.success("Remediation updated successfully");
        setIsCreateRemediationOpen(false);
        setEditingRemediationId(null);
        resetRemediationForm();
        loadRemediationTracking();
      } else {
        toast.error(result.error || "Failed to update remediation");
      }
    } catch (error) {
      console.error("Error updating remediation:", error);
      toast.error("Failed to update remediation");
    }
  };



  const generateGapsFromAssessments = async () => {
    if (!selectedAssessmentForControls) return

    try {
      // Find all maturity assessments for the selected assessment
      const assessmentMaturity = maturityAssessments.filter(
        ma => ma.assessment_id === selectedAssessmentForControls
      )

      const gapsToCreate = []

      for (const assessment of assessmentMaturity) {
        const gap = assessment.current_maturity_level - assessment.target_maturity_level

        if (gap < 0) { // Current level is lower than target
          const control = criControls.find(c => c.id === assessment.control_id)

          if (control) {
            // Determine severity based on gap size and current level
            let severity: 'low' | 'medium' | 'high' | 'critical' = 'low'
            let priority: 'low' | 'medium' | 'high' | 'critical' = 'low'

            if (assessment.current_maturity_level <= 1 && Math.abs(gap) >= 2) {
              severity = 'critical'
              priority = 'critical'
            } else if (assessment.current_maturity_level <= 2 && Math.abs(gap) >= 1) {
              severity = 'high'
              priority = 'high'
            } else if (Math.abs(gap) >= 2) {
              severity = 'medium'
              priority = 'medium'
            }

            const gapDescription = `Current maturity level (${assessment.current_maturity_level}) is below target level (${assessment.target_maturity_level}) for ${control.control_name}`

            // Check if gap already exists
            const existingGap = gapsAnalysis.find(
              g => g.assessment_id === assessment.assessment_id && g.control_id === assessment.control_id
            )

            if (!existingGap) {
              gapsToCreate.push({
                assessment_id: assessment.assessment_id,
                control_id: assessment.control_id,
                gap_description: gapDescription,
                severity,
                priority,
                estimated_effort: `Level ${Math.abs(gap)} gap remediation`,
                recommended_actions: `Implement maturity level ${assessment.target_maturity_level} practices for ${control.control_name}`
              })
            }
          }
        }
      }

      // Create gaps in batch
      for (const gap of gapsToCreate) {
        await fetch('/api/gaps-analysis', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(gap)
        })
      }

      if (gapsToCreate.length > 0) {
        toast.success(`Generated ${gapsToCreate.length} gaps from maturity assessments`)
        loadGapsAnalysis()
      } else {
        toast.info("No new gaps identified from current assessments")
      }
    } catch (error) {
      console.error("Error generating gaps:", error)
      toast.error("Failed to generate gaps from assessments")
    }
  }

  const getStatusBadge = (status: string) => {
    const variants = {
      draft: "secondary",
      in_progress: "default",
      completed: "outline",
      approved: "default"
    } as const

    return (
      <Badge variant={variants[status as keyof typeof variants] || "secondary"}>
        {status.replace('_', ' ').toUpperCase()}
      </Badge>
    )
  }

  const getSeverityBadge = (severity: string) => {
    const variants = {
      low: "secondary",
      medium: "outline",
      high: "destructive",
      critical: "destructive"
    } as const

    return (
      <Badge variant={variants[severity as keyof typeof variants] || "secondary"}>
        {severity.toUpperCase()}
      </Badge>
    )
  }

  const getPriorityBadge = (priority: string) => {
    const variants = {
      low: "secondary",
      medium: "outline",
      high: "destructive",
      critical: "destructive"
    } as const

    return (
      <Badge variant={variants[priority as keyof typeof variants] || "secondary"}>
        {priority.toUpperCase()}
      </Badge>
    )
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'in_progress':
        return <Clock className="h-4 w-4 text-blue-500" />
      case 'draft':
        return <FileText className="h-4 w-4 text-gray-500" />
      case 'approved':
        return <Award className="h-4 w-4 text-purple-500" />
      default:
        return <FileText className="h-4 w-4 text-gray-500" />
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  // Prevent hydration mismatch and infinite re-renders
  if (!mounted) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <main className="flex-1 custom-scrollbar">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-blue-600/100 dark:text-blue-500/100">
              Cyber Security Maturity Assessment
            </h1>
            <p className="text-muted-foreground mt-2">
              Cyber Risk Institute (CRI) Framework Assessment and Management
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Badge variant="outline" className="text-sm">
              {assessments.length} Assessments
            </Badge>
            <Badge variant="outline" className="text-sm">
              {criControls.length} CRI Controls
            </Badge>
          </div>
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="planning" className="flex items-center gap-2">
              <FileText className="h-4 w-4" text-cyan-300 />
              Planning Assessment
            </TabsTrigger>
            <TabsTrigger value="controls" className="flex items-center gap-2">
              <Target className="h-4 w-4" text-cyan-300 />
              Framework Controls
            </TabsTrigger>
            <TabsTrigger value="gaps" className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" text-cyan-300 />
              Gaps Analysis
            </TabsTrigger>
            <TabsTrigger value="remediation" className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4" text-cyan-300 />
              Remediation Tracking
            </TabsTrigger>
          </TabsList>

          {/* Planning Assessment Tab */}
          <TabsContent value="planning" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="h-5 w-5" />
                      Planning Assessment
                    </CardTitle>
                    <CardDescription>
                      Create and manage cyber maturity assessments
                    </CardDescription>
                  </div>
                </div>

                {/* Filters and Search */}
                <div className="flex items-center gap-4 mt-4">
                  <div className="flex items-center gap-2">
                    <Search className="h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search assessments..."
                      value={assessmentFilters.search || ""}
                      onChange={(e) => setAssessmentFilters({ ...assessmentFilters, search: e.target.value })}
                      className="w-64"
                    />
                  </div>

                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="flex items-center gap-2">
                        <Filter className="h-4 w-4" />
                        Filters
                        {((assessmentFilters.statuses?.length || 0) + (assessmentFilters.departments?.length || 0) + (assessmentFilters.assessors?.length || 0)) > 0 && (
                          <Badge variant="secondary" className="ml-1">
                            {(assessmentFilters.statuses?.length || 0) + (assessmentFilters.departments?.length || 0) + (assessmentFilters.assessors?.length || 0)}
                          </Badge>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-80">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium">Filter by Status</h4>
                          {assessmentFilters.statuses?.length > 0 && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setAssessmentFilters({ ...assessmentFilters, statuses: [] })}
                            >
                              Clear
                            </Button>
                          )}
                        </div>
                        <div className="space-y-2">
                          {["draft", "in_progress", "completed", "approved"].map((status) => (
                            <div key={status} className="flex items-center space-x-2">
                              <Checkbox
                                id={`status-${status}`}
                                checked={assessmentFilters.statuses?.includes(status) || false}
                                onCheckedChange={(checked) => {
                                  if (checked) {
                                    setAssessmentFilters({
                                      ...assessmentFilters,
                                      statuses: [...(assessmentFilters.statuses || []), status]
                                    })
                                  } else {
                                    setAssessmentFilters({
                                      ...assessmentFilters,
                                      statuses: (assessmentFilters.statuses || []).filter(s => s !== status)
                                    })
                                  }
                                }}
                              />
                              <Label htmlFor={`status-${status}`} className="text-sm capitalize">
                                {status.replace('_', ' ')}
                              </Label>
                            </div>
                          ))}
                        </div>

                        <Separator />

                        <div className="flex items-center justify-between">
                          <h4 className="font-medium">Filter by Department</h4>
                          {assessmentFilters.departments?.length > 0 && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setAssessmentFilters({ ...assessmentFilters, departments: [] })}
                            >
                              Clear
                            </Button>
                          )}
                        </div>
                        <div className="space-y-2">
                          {Array.from(new Set(assessments.map(a => a.department))).filter(Boolean).map((department) => (
                            <div key={department} className="flex items-center space-x-2">
                              <Checkbox
                                id={`dept-${department}`}
                                checked={assessmentFilters.departments?.includes(department) || false}
                                onCheckedChange={(checked) => {
                                  if (checked) {
                                    setAssessmentFilters({
                                      ...assessmentFilters,
                                      departments: [...(assessmentFilters.departments || []), department]
                                    })
                                  } else {
                                    setAssessmentFilters({
                                      ...assessmentFilters,
                                      departments: (assessmentFilters.departments || []).filter(d => d !== department)
                                    })
                                  }
                                }}
                              />
                              <Label htmlFor={`dept-${department}`} className="text-sm">
                                {department}
                              </Label>
                            </div>
                          ))}
                        </div>

                        <Separator />

                        <div className="flex items-center justify-between">
                          <h4 className="font-medium">Filter by Assessor</h4>
                          {assessmentFilters.assessors?.length > 0 && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setAssessmentFilters({ ...assessmentFilters, assessors: [] })}
                            >
                              Clear
                            </Button>
                          )}
                        </div>
                        <div className="space-y-2">
                          {Array.from(new Set(assessments.map(a => a.assessor_name))).filter(Boolean).map((assessor) => (
                            <div key={assessor} className="flex items-center space-x-2">
                              <Checkbox
                                id={`assessor-${assessor}`}
                                checked={assessmentFilters.assessors?.includes(assessor) || false}
                                onCheckedChange={(checked) => {
                                  if (checked) {
                                    setAssessmentFilters({
                                      ...assessmentFilters,
                                      assessors: [...(assessmentFilters.assessors || []), assessor]
                                    })
                                  } else {
                                    setAssessmentFilters({
                                      ...assessmentFilters,
                                      assessors: (assessmentFilters.assessors || []).filter(a => a !== assessor)
                                    })
                                  }
                                }}
                              />
                              <Label htmlFor={`assessor-${assessor}`} className="text-sm">
                                {assessor}
                              </Label>
                            </div>
                          ))}
                        </div>
                      </div>
                    </PopoverContent>
                  </Popover>

                  <div className="flex items-center gap-2 ml-auto">
                    <Label htmlFor="page-size">Show:</Label>
                    <Select
                      value={assessmentPagination.pageSize.toString()}
                      onValueChange={(value) => setAssessmentPagination({ ...assessmentPagination, pageSize: parseInt(value), page: 1 })}
                    >
                      <SelectTrigger className="w-20">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="5">5</SelectItem>
                        <SelectItem value="10">10</SelectItem>
                        <SelectItem value="20">20</SelectItem>
                        <SelectItem value="50">50</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                    <DialogTrigger asChild>
                      <ActionButtons isTableAction={false} onAdd={() => setIsCreateDialogOpen(true)} btnAddText="New Assessment" />
                      {/* <Button variant="outline" onClick={() => setIsCreateDialogOpen(true)}>
                        <Plus className="h-4 w-4 mr-2" />
                        New Assessment
                      </Button> */}
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[600px]">
                      <DialogHeader>
                        <DialogTitle>Create New Assessment</DialogTitle>
                        <DialogDescription>
                          Fill in the details for the new cyber maturity assessment.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="assessment_name">Assessment Name</Label>
                            <Input
                              id="assessment_name"
                              value={assessmentForm.assessment_name}
                              onChange={(e) => setAssessmentForm({ ...assessmentForm, assessment_name: e.target.value })}
                              placeholder="Enter assessment name"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="assessment_date">Assessment Date</Label>
                            <Input
                              id="assessment_date"
                              type="date"
                              value={assessmentForm.assessment_date}
                              onChange={(e) => setAssessmentForm({ ...assessmentForm, assessment_date: e.target.value })}
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="assessor_name">Assessor Name</Label>
                            <Input
                              id="assessor_name"
                              value={assessmentForm.assessor_name}
                              onChange={(e) => setAssessmentForm({ ...assessmentForm, assessor_name: e.target.value })}
                              placeholder="Enter assessor name"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="department">Department</Label>
                            <Input
                              id="department"
                              value={assessmentForm.department}
                              onChange={(e) => setAssessmentForm({ ...assessmentForm, department: e.target.value })}
                              placeholder="Enter department"
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="status">Status</Label>
                          <Select value={assessmentForm.status} onValueChange={(value: any) => setAssessmentForm({ ...assessmentForm, status: value })}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="draft">Draft</SelectItem>
                              <SelectItem value="in_progress">In Progress</SelectItem>
                              <SelectItem value="completed">Completed</SelectItem>
                              <SelectItem value="approved">Approved</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="description">Description</Label>
                          <Textarea
                            id="description"
                            value={assessmentForm.description}
                            onChange={(e) => setAssessmentForm({ ...assessmentForm, description: e.target.value })}
                            placeholder="Enter assessment description"
                            rows={3}
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button onClick={() => setIsCreateDialogOpen(false)}>
                          Cancel
                        </Button>
                        <Button onClick={handleCreateAssessment}>
                          Create Assessment
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Assessor</TableHead>
                        <TableHead>Department</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {(() => {
                        // Apply filters and search
                        let filteredAssessments = assessments.filter(assessment => {
                          // Search filter
                          if (assessmentFilters.search) {
                            const searchTerm = assessmentFilters.search.toLowerCase()
                            if (!assessment.assessment_name.toLowerCase().includes(searchTerm) &&
                              !assessment.assessor_name.toLowerCase().includes(searchTerm) &&
                              !assessment.department?.toLowerCase().includes(searchTerm)) {
                              return false
                            }
                          }

                          // Status filter
                          if (assessmentFilters.statuses?.length > 0) {
                            if (!assessmentFilters.statuses.includes(assessment.status)) {
                              return false
                            }
                          }

                          // Department filter
                          if (assessmentFilters.departments?.length > 0) {
                            if (!assessment.department || !assessmentFilters.departments.includes(assessment.department)) {
                              return false
                            }
                          }

                          // Assessor filter
                          if (assessmentFilters.assessors?.length > 0) {
                            if (!assessmentFilters.assessors.includes(assessment.assessor_name)) {
                              return false
                            }
                          }

                          return true
                        })



                        // Apply pagination
                        const startIndex = (assessmentPagination.page - 1) * assessmentPagination.pageSize
                        const endIndex = startIndex + assessmentPagination.pageSize
                        const paginatedAssessments = filteredAssessments.slice(startIndex, endIndex)

                        return paginatedAssessments.map((assessment) => (
                          <TableRow key={assessment.id}>
                            <TableCell className="font-medium">{assessment.assessment_name}</TableCell>
                            <TableCell>{assessment.assessor_name}</TableCell>
                            <TableCell>{assessment.department}</TableCell>
                            <TableCell>{new Date(assessment.assessment_date).toLocaleDateString()}</TableCell>
                            <TableCell>{getStatusBadge(assessment.status)}</TableCell>
                            <TableCell className="text-right">
                              <div className="flex items-center gap-2 justify-end">

                                <ActionButtons isTableAction={true}
                                  //onView={() => handleViewAsset(asset)}
                                  onEdit={() => openEditDialog(assessment)}
                                  onDelete={() => assessment.id && handleDeleteAssessment(assessment.id)}
                                  actionObj={assessment}
                                  deleteDialogTitle={assessment.assessment_name}
                                />

                                {/* <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => openEditDialog(assessment)}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <AlertDialog>
                                  <AlertDialogTrigger asChild>
                                    <Button variant="ghost" size="sm" className="text-red-400 hover:bg-red-900/20 hover:text-red-300 dark:text-red-400 dark:hover:bg-red-900/20 dark:hover:text-red-300">
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </AlertDialogTrigger>
                                  <AlertDialogContent>
                                    <AlertDialogHeader>
                                      <AlertDialogTitle>Delete Assessment</AlertDialogTitle>
                                      <AlertDialogDescription>
                                        Are you sure you want to delete this assessment? This action cannot be undone.
                                      </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                                      <AlertDialogAction onClick={() => assessment.id && handleDeleteAssessment(assessment.id)}>
                                        Delete
                                      </AlertDialogAction>
                                    </AlertDialogFooter>
                                  </AlertDialogContent>
                                </AlertDialog> */}
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      })()}
                    </TableBody>
                  </Table>
                </div>

                {/* Pagination Controls */}
                {assessmentPagination.total > assessmentPagination.pageSize && (
                  <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span>
                        Showing {((assessmentPagination.page - 1) * assessmentPagination.pageSize) + 1} to {Math.min(assessmentPagination.page * assessmentPagination.pageSize, assessmentPagination.total)} of {assessmentPagination.total} assessments
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setAssessmentPagination({ ...assessmentPagination, page: 1 })}
                        disabled={assessmentPagination.page === 1}
                      >
                        <ChevronsLeft className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setAssessmentPagination({ ...assessmentPagination, page: assessmentPagination.page - 1 })}
                        disabled={assessmentPagination.page === 1}
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </Button>

                      <span className="text-sm">
                        Page {assessmentPagination.page} of {Math.ceil(assessmentPagination.total / assessmentPagination.pageSize)}
                      </span>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setAssessmentPagination({ ...assessmentPagination, page: assessmentPagination.page + 1 })}
                        disabled={assessmentPagination.page === Math.ceil(assessmentPagination.total / assessmentPagination.pageSize)}
                      >
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setAssessmentPagination({ ...assessmentPagination, page: Math.ceil(assessmentPagination.total / assessmentPagination.pageSize) })}
                        disabled={assessmentPagination.page === Math.ceil(assessmentPagination.total / assessmentPagination.pageSize)}
                      >
                        <ChevronsRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Framework Controls Tab */}
          <TabsContent value="controls" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Target className="h-5 w-5" />
                      CRI Framework Control Objectives
                    </CardTitle>
                    <CardDescription>
                      Review and assess maturity against Cyber Risk Institute controls
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <Label htmlFor="assessment-select">Select Assessment:</Label>
                      <Select
                        value={selectedAssessmentForControls?.toString() || ""}
                        onValueChange={(value) => setSelectedAssessmentForControls(parseInt(value))}
                      >
                        <SelectTrigger className="w-48">
                          <SelectValue placeholder="Choose assessment" />
                        </SelectTrigger>
                        <SelectContent>
                          {assessments.map((assessment) => (
                            <SelectItem key={assessment.id} value={assessment.id?.toString() || ""}>
                              {assessment.assessment_name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                {/* Filters and Search */}
                <div className="flex items-center gap-4 mt-4">
                  <div className="flex items-center gap-2">
                    <Search className="h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search controls..."
                      value={controlFilters.search}
                      onChange={(e) => setControlFilters({ ...controlFilters, search: e.target.value })}
                      className="w-64"
                    />
                  </div>

                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="flex items-center gap-2">
                        <Filter className="h-4 w-4" />
                        Filters
                        {(controlFilters.domains.length > 0) && (
                          <Badge variant="secondary" className="ml-1">
                            {controlFilters.domains.length}
                          </Badge>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-80">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium">Filter by Domain</h4>
                          {controlFilters.domains.length > 0 && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setControlFilters({ ...controlFilters, domains: [] })}
                            >
                              Clear all
                            </Button>
                          )}
                        </div>
                        <div className="space-y-2">
                          {["Governance", "Information Security", "Operations", "Compliance", "Supply Chain", "People", "Technology"].map((domain) => (
                            <div key={domain} className="flex items-center space-x-2">
                              <Checkbox
                                id={`domain-${domain}`}
                                checked={controlFilters.domains.includes(domain)}
                                onCheckedChange={(checked) => {
                                  if (checked) {
                                    setControlFilters({
                                      ...controlFilters,
                                      domains: [...controlFilters.domains, domain]
                                    })
                                  } else {
                                    setControlFilters({
                                      ...controlFilters,
                                      domains: controlFilters.domains.filter(d => d !== domain)
                                    })
                                  }
                                }}
                              />
                              <Label htmlFor={`domain-${domain}`} className="text-sm">
                                {domain}
                              </Label>
                            </div>
                          ))}
                        </div>
                      </div>
                    </PopoverContent>
                  </Popover>

                  {/* Import/Export Buttons */}
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setIsExportDialogOpen(true)}
                      className="flex items-center gap-2"
                    >
                      <Download className="h-4 w-4" />
                      Export
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setIsImportDialogOpen(true)}
                      className="flex items-center gap-2"
                    >
                      <Upload className="h-4 w-4" />
                      Import
                    </Button>
                  </div>

                  <div className="flex items-center gap-2 ml-auto">
                    <Label htmlFor="page-size">Show:</Label>
                    <Select
                      value={controlPagination.pageSize.toString()}
                      onValueChange={(value) => setControlPagination({ ...controlPagination, pageSize: parseInt(value), page: 1 })}
                    >
                      <SelectTrigger className="w-20">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="5">5</SelectItem>
                        <SelectItem value="10">10</SelectItem>
                        <SelectItem value="20">20</SelectItem>
                        <SelectItem value="50">50</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {!selectedAssessmentForControls ? (
                  <div className="text-center py-8">
                    <Target className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">Please select an assessment to view and assess controls</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {/* Filtered and paginated controls */}
                    <div className="space-y-4">
                      {(() => {
                        // Apply filters and search
                        let filteredControls = criControls.filter(control => {
                          // Search filter
                          if (controlFilters.search) {
                            const searchTerm = controlFilters.search.toLowerCase()
                            if (!control.control_name.toLowerCase().includes(searchTerm) &&
                              !control.control_id.toLowerCase().includes(searchTerm) &&
                              !control.control_objective.toLowerCase().includes(searchTerm)) {
                              return false
                            }
                          }

                          // Domain filter
                          if (controlFilters.domains.length > 0) {
                            if (!controlFilters.domains.includes(control.domain)) {
                              return false
                            }
                          }

                          return true
                        })



                        // Apply pagination
                        const startIndex = (controlPagination.page - 1) * controlPagination.pageSize
                        const endIndex = startIndex + controlPagination.pageSize
                        const paginatedControls = filteredControls.slice(startIndex, endIndex)

                        return paginatedControls.map((control) => {
                          const existingAssessment = maturityAssessments.find(
                            ma => ma.control_id === control.id && ma.assessment_id === selectedAssessmentForControls
                          )

                          return (
                            <Card key={control.id} className="border-l-4 border-l-blue-500">
                              <CardHeader className="pb-3">
                                <div className="flex items-center justify-between">
                                  <div>
                                    <CardTitle className="text-lg">{control.control_id}: {control.control_name}</CardTitle>
                                    <div className="flex items-center gap-2">
                                      <Badge variant="outline">{control.domain}</Badge>
                                      {existingAssessment && (
                                        <Badge variant="default" className="bg-green-500">
                                          Assessed (Level {existingAssessment.current_maturity_level})
                                        </Badge>
                                      )}
                                    </div>
                                  </div>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => openAssessControlDialog(control)}
                                    disabled={!selectedAssessmentForControls}
                                  >
                                    {existingAssessment ? 'Re-assess' : 'Assess'} Control
                                  </Button>
                                </div>
                              </CardHeader>
                              <CardContent>
                                <p className="text-sm text-muted-foreground mb-4">{control.control_objective}</p>

                                {existingAssessment && (
                                  <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                                    <h4 className="font-medium mb-2">Current Assessment</h4>
                                    <div className="grid grid-cols-2 gap-4 text-sm">
                                      <div>
                                        <span className="font-medium">Current Level:</span> {existingAssessment.current_maturity_level}
                                      </div>
                                      <div>
                                        <span className="font-medium">Target Level:</span> {existingAssessment.target_maturity_level}
                                      </div>
                                      <div>
                                        <span className="font-medium">Assessment Date:</span> {new Date(existingAssessment.assessment_date).toLocaleDateString()}
                                      </div>
                                      <div>
                                        <span className="font-medium">Comments:</span> {existingAssessment.assessor_comments}
                                      </div>
                                    </div>
                                  </div>
                                )}

                                <div className="grid grid-cols-5 gap-2 text-xs">
                                  <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded">
                                    <div className="font-medium">Level 1</div>
                                    <div className="text-muted-foreground">{control.maturity_level_1}</div>
                                  </div>
                                  <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded">
                                    <div className="font-medium">Level 2</div>
                                    <div className="text-muted-foreground">{control.maturity_level_2}</div>
                                  </div>
                                  <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded">
                                    <div className="font-medium">Level 3</div>
                                    <div className="text-muted-foreground">{control.maturity_level_3}</div>
                                  </div>
                                  <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded">
                                    <div className="font-medium">Level 4</div>
                                    <div className="text-muted-foreground">{control.maturity_level_4}</div>
                                  </div>
                                  <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded">
                                    <div className="font-medium">Level 5</div>
                                    <div className="text-muted-foreground">{control.maturity_level_5}</div>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          )
                        })
                      })()}
                    </div>

                    {/* Pagination Controls */}
                    {controlPagination.total > controlPagination.pageSize && (
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <span>
                            Showing {((controlPagination.page - 1) * controlPagination.pageSize) + 1} to {Math.min(controlPagination.page * controlPagination.pageSize, controlPagination.total)} of {controlPagination.total} controls
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setControlPagination({ ...controlPagination, page: 1 })}
                            disabled={controlPagination.page === 1}
                          >
                            <ChevronsLeft className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setControlPagination({ ...controlPagination, page: controlPagination.page - 1 })}
                            disabled={controlPagination.page === 1}
                          >
                            <ChevronLeft className="h-4 w-4" />
                          </Button>

                          <span className="text-sm">
                            Page {controlPagination.page} of {Math.ceil(controlPagination.total / controlPagination.pageSize)}
                          </span>

                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setControlPagination({ ...controlPagination, page: controlPagination.page + 1 })}
                            disabled={controlPagination.page === Math.ceil(controlPagination.total / controlPagination.pageSize)}
                          >
                            <ChevronRight className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setControlPagination({ ...controlPagination, page: Math.ceil(controlPagination.total / controlPagination.pageSize) })}
                            disabled={controlPagination.page === Math.ceil(controlPagination.total / controlPagination.pageSize)}
                          >
                            <ChevronsRight className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Gaps Analysis Tab */}
          <TabsContent value="gaps" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <AlertTriangle className="h-5 w-5" />
                      Gaps Analysis
                    </CardTitle>
                    <CardDescription>
                      Identify and analyze gaps in cyber maturity assessments
                    </CardDescription>
                  </div>
                </div>

                {/* Filters and Search */}
                <div className="flex items-center gap-4 mt-4">
                  <div className="flex items-center gap-2">
                    <Search className="h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search gaps..."
                      value={gapFilters.search || ""}
                      onChange={(e) => setGapFilters({ ...gapFilters, search: e.target.value })}
                      className="w-64"
                    />
                  </div>

                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="flex items-center gap-2">
                        <Filter className="h-4 w-4" />
                        Filters
                        {((gapFilters.severities?.length || 0) + (gapFilters.priorities?.length || 0) + (gapFilters.domains?.length || 0)) > 0 && (
                          <Badge variant="secondary" className="ml-1">
                            {(gapFilters.severities?.length || 0) + (gapFilters.priorities?.length || 0) + (gapFilters.domains?.length || 0)}
                          </Badge>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-80">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium">Filter by Severity</h4>
                          {gapFilters.severities?.length > 0 && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setGapFilters({ ...gapFilters, severities: [] })}
                            >
                              Clear
                            </Button>
                          )}
                        </div>
                        <div className="space-y-2">
                          {["low", "medium", "high", "critical"].map((severity) => (
                            <div key={severity} className="flex items-center space-x-2">
                              <Checkbox
                                id={`severity-${severity}`}
                                checked={gapFilters.severities?.includes(severity) || false}
                                onCheckedChange={(checked) => {
                                  if (checked) {
                                    setGapFilters({
                                      ...gapFilters,
                                      severities: [...(gapFilters.severities || []), severity]
                                    })
                                  } else {
                                    setGapFilters({
                                      ...gapFilters,
                                      severities: (gapFilters.severities || []).filter(s => s !== severity)
                                    })
                                  }
                                }}
                              />
                              <Label htmlFor={`severity-${severity}`} className="text-sm capitalize">
                                {severity}
                              </Label>
                            </div>
                          ))}
                        </div>

                        <Separator />

                        <div className="flex items-center justify-between">
                          <h4 className="font-medium">Filter by Priority</h4>
                          {gapFilters.priorities?.length > 0 && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setGapFilters({ ...gapFilters, priorities: [] })}
                            >
                              Clear
                            </Button>
                          )}
                        </div>
                        <div className="space-y-2">
                          {["low", "medium", "high", "critical"].map((priority) => (
                            <div key={priority} className="flex items-center space-x-2">
                              <Checkbox
                                id={`priority-${priority}`}
                                checked={gapFilters.priorities?.includes(priority) || false}
                                onCheckedChange={(checked) => {
                                  if (checked) {
                                    setGapFilters({
                                      ...gapFilters,
                                      priorities: [...(gapFilters.priorities || []), priority]
                                    })
                                  } else {
                                    setGapFilters({
                                      ...gapFilters,
                                      priorities: (gapFilters.priorities || []).filter(p => p !== priority)
                                    })
                                  }
                                }}
                              />
                              <Label htmlFor={`priority-${priority}`} className="text-sm capitalize">
                                {priority}
                              </Label>
                            </div>
                          ))}
                        </div>

                        <Separator />

                        <div className="flex items-center justify-between">
                          <h4 className="font-medium">Filter by Domain</h4>
                          {gapFilters.domains?.length > 0 && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setGapFilters({ ...gapFilters, domains: [] })}
                            >
                              Clear
                            </Button>
                          )}
                        </div>
                        <div className="space-y-2">
                          {["Governance", "Information Security", "Operations", "Compliance", "Supply Chain", "People", "Technology"].map((domain) => (
                            <div key={domain} className="flex items-center space-x-2">
                              <Checkbox
                                id={`gap-domain-${domain}`}
                                checked={gapFilters.domains?.includes(domain) || false}
                                onCheckedChange={(checked) => {
                                  if (checked) {
                                    setGapFilters({
                                      ...gapFilters,
                                      domains: [...(gapFilters.domains || []), domain]
                                    })
                                  } else {
                                    setGapFilters({
                                      ...gapFilters,
                                      domains: (gapFilters.domains || []).filter(d => d !== domain)
                                    })
                                  }
                                }}
                              />
                              <Label htmlFor={`gap-domain-${domain}`} className="text-sm">
                                {domain}
                              </Label>
                            </div>
                          ))}
                        </div>
                      </div>
                    </PopoverContent>
                  </Popover>

                  <div className="flex items-center gap-2 ml-auto">
                    <Label htmlFor="gap-page-size">Show:</Label>
                    <Select
                      value={gapPagination.pageSize.toString()}
                      onValueChange={(value) => setGapPagination({ ...gapPagination, pageSize: parseInt(value), page: 1 })}
                    >
                      <SelectTrigger className="w-20">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="5">5</SelectItem>
                        <SelectItem value="10">10</SelectItem>
                        <SelectItem value="20">20</SelectItem>
                        <SelectItem value="50">50</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Button
                    variant="outline"
                    onClick={() => {
                      if (!selectedAssessmentForControls) {
                        toast.error("Please select an assessment first");
                        return;
                      }
                      setIsCreateGapDialogOpen(true);
                    }}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Manual Gap
                  </Button>
                </div>
              </CardHeader>
              <Dialog open={isCreateGapDialogOpen} onOpenChange={setIsCreateGapDialogOpen}>
                <DialogContent className="sm:max-w-[600px]">
                  <DialogHeader>
                    <DialogTitle>Add Manual Gap</DialogTitle>
                    <DialogDescription>
                      Manually add a new gap for the selected assessment.
                    </DialogDescription>
                  </DialogHeader>

                  <div className="grid gap-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="control_select">Select Control</Label>
                      <Select
                        value={manualGapForm.control_id || ""}
                        onValueChange={(value) => setManualGapForm({ ...manualGapForm, control_id: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Choose control" />
                        </SelectTrigger>
                        <SelectContent>
                          {criControls.map((control) => (
                            <SelectItem key={control.id} value={control.id?.toString() || ""}>
                              {control.control_id}: {control.control_name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="gap_description">Gap Description</Label>
                      <Textarea
                        id="gap_description"
                        placeholder="Describe the identified gap"
                        value={manualGapForm.gap_description}
                        onChange={(e) => setManualGapForm({ ...manualGapForm, gap_description: e.target.value })}
                        rows={3}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Severity</Label>
                        <Select
                          value={manualGapForm.severity}
                          onValueChange={(value) => setManualGapForm({ ...manualGapForm, severity: value })}
                        >
                          <SelectTrigger><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="low">Low</SelectItem>
                            <SelectItem value="medium">Medium</SelectItem>
                            <SelectItem value="high">High</SelectItem>
                            <SelectItem value="critical">Critical</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label>Priority</Label>
                        <Select
                          value={manualGapForm.priority}
                          onValueChange={(value) => setManualGapForm({ ...manualGapForm, priority: value })}
                        >
                          <SelectTrigger><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="low">Low</SelectItem>
                            <SelectItem value="medium">Medium</SelectItem>
                            <SelectItem value="high">High</SelectItem>
                            <SelectItem value="critical">Critical</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="estimated_effort">Estimated Effort</Label>
                      <Input
                        id="estimated_effort"
                        placeholder="e.g. 5 days, 2 weeks"
                        value={manualGapForm.estimated_effort}
                        onChange={(e) => setManualGapForm({ ...manualGapForm, estimated_effort: e.target.value })}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="recommended_actions">Recommended Actions</Label>
                      <Textarea
                        id="recommended_actions"
                        placeholder="Suggested remediation or actions"
                        value={manualGapForm.recommended_actions}
                        onChange={(e) => setManualGapForm({ ...manualGapForm, recommended_actions: e.target.value })}
                        rows={2}
                      />
                    </div>
                  </div>

                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsCreateGapDialogOpen(false)}>Cancel</Button>
                    <Button
                      onClick={async () => {
                        try {
                          const res = await fetch("/api/gaps-analysis", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({
                              assessment_id: selectedAssessmentForControls ?? 2,
                              control_id: parseInt(manualGapForm.control_id),
                              gap_description: manualGapForm.gap_description,
                              severity: manualGapForm.severity,
                              priority: manualGapForm.priority,
                              estimated_effort: manualGapForm.estimated_effort,
                              recommended_actions: manualGapForm.recommended_actions
                            })
                          });
                          const result = await res.json();
                          if (result.success) {
                            toast.success("Manual gap added successfully");
                            setIsCreateGapDialogOpen(false);
                            loadGapsAnalysis();
                          } else {
                            toast.error(result.error || "Failed to create gap");
                          }
                        } catch (error) {
                          console.error(error);
                          toast.error("Error creating manual gap");
                        }
                      }}
                      disabled={
                        !manualGapForm.control_id ||
                        !manualGapForm.gap_description ||
                        !manualGapForm.estimated_effort
                      }
                    >
                      Save Gap
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              <CardContent>
                {!selectedAssessmentForControls ? (
                  <div className="text-center py-8">
                    <AlertTriangle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">Please select an assessment to view gaps analysis</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {/* Gaps Summary */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <Card className="border-l-4 border-l-red-500">
                        <CardContent className="p-4">
                          <div className="text-2xl font-bold text-red-600">{gapsAnalysis.filter(g => g.severity === 'critical').length}</div>
                          <div className="text-sm text-muted-foreground">Critical Gaps</div>
                        </CardContent>
                      </Card>
                      <Card className="border-l-4 border-l-orange-500">
                        <CardContent className="p-4">
                          <div className="text-2xl font-bold text-orange-600">{gapsAnalysis.filter(g => g.severity === 'high').length}</div>
                          <div className="text-sm text-muted-foreground">High Priority</div>
                        </CardContent>
                      </Card>
                      <Card className="border-l-4 border-l-yellow-500">
                        <CardContent className="p-4">
                          <div className="text-2xl font-bold text-yellow-600">{gapsAnalysis.filter(g => g.severity === 'medium').length}</div>
                          <div className="text-sm text-muted-foreground">Medium Priority</div>
                        </CardContent>
                      </Card>
                      <Card className="border-l-4 border-l-green-500">
                        <CardContent className="p-4">
                          <div className="text-2xl font-bold text-green-600">{gapsAnalysis.filter(g => g.severity === 'low').length}</div>
                          <div className="text-sm text-muted-foreground">Low Priority</div>
                        </CardContent>
                      </Card>
                    </div>

                    {/* Gaps Table */}
                    <div className="rounded-md border">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Control</TableHead>
                            <TableHead>Gap Description</TableHead>
                            <TableHead>Current vs Target</TableHead>
                            <TableHead>Severity</TableHead>
                            <TableHead>Priority</TableHead>
                            <TableHead>Effort</TableHead>
                            <TableHead>Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {(() => {
                            // Apply filters and search
                            let filteredGaps = gapsAnalysis.filter(gap => {
                              // Assessment filter
                              if (gap.assessment_id !== selectedAssessmentForControls) {
                                return false
                              }

                              // Search filter
                              if (gapFilters.search) {
                                const searchTerm = gapFilters.search.toLowerCase()
                                if (!gap.gap_description.toLowerCase().includes(searchTerm) &&
                                  !gap.control_id_str?.toLowerCase().includes(searchTerm) &&
                                  !gap.control_name?.toLowerCase().includes(searchTerm)) {
                                  return false
                                }
                              }

                              // Severity filter
                              if (gapFilters.severities?.length > 0) {
                                if (!gapFilters.severities.includes(gap.severity)) {
                                  return false
                                }
                              }

                              // Priority filter
                              if (gapFilters.priorities?.length > 0) {
                                if (!gapFilters.priorities.includes(gap.priority)) {
                                  return false
                                }
                              }

                              // Domain filter
                              if (gapFilters.domains?.length > 0) {
                                if (!gap.domain || !gapFilters.domains.includes(gap.domain)) {
                                  return false
                                }
                              }

                              return true
                            })



                            // Apply pagination
                            const startIndex = (gapPagination.page - 1) * gapPagination.pageSize
                            const endIndex = startIndex + gapPagination.pageSize
                            const paginatedGaps = filteredGaps.slice(startIndex, endIndex)

                            return paginatedGaps.map((gap) => (
                              <TableRow key={gap.id}>
                                <TableCell className="font-medium">
                                  <div>
                                    <div className="font-medium">{gap.control_id_str}: {gap.control_name}</div>
                                    <div className="text-sm text-muted-foreground">{gap.domain}</div>
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <div className="max-w-xs">
                                    <div className="font-medium text-sm">{gap.gap_description}</div>
                                    {gap.recommended_actions && (
                                      <div className="text-xs text-muted-foreground mt-1">
                                        {gap.recommended_actions.length > 50
                                          ? `${gap.recommended_actions.substring(0, 50)}...`
                                          : gap.recommended_actions}
                                      </div>
                                    )}
                                  </div>
                                </TableCell>
                                <TableCell>
                                  {(() => {
                                    const assessment = maturityAssessments.find(
                                      ma => ma.control_id === gap.control_id && ma.assessment_id === gap.assessment_id
                                    )
                                    return assessment ? `${assessment.current_maturity_level} → ${assessment.target_maturity_level}` : 'N/A'
                                  })()}
                                </TableCell>
                                <TableCell>{getSeverityBadge(gap.severity)}</TableCell>
                                <TableCell>{getPriorityBadge(gap.priority)}</TableCell>
                                <TableCell>{gap.estimated_effort}</TableCell>
                                <TableCell>
                                  <div className="flex items-center gap-2">
                                    <Button variant="outline" size="sm">
                                      View Details
                                    </Button>
                                    <Button variant="outline" size="sm">
                                      Assign Remediation
                                    </Button>
                                  </div>
                                </TableCell>
                              </TableRow>
                            ))
                          })()}
                        </TableBody>
                      </Table>
                    </div>

                    {/* Pagination Controls for Gaps */}
                    {gapPagination.total > gapPagination.pageSize && (
                      <div className="flex items-center justify-between mt-4">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <span>
                            Showing {((gapPagination.page - 1) * gapPagination.pageSize) + 1} to {Math.min(gapPagination.page * gapPagination.pageSize, gapPagination.total)} of {gapPagination.total} gaps
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setGapPagination({ ...gapPagination, page: 1 })}
                            disabled={gapPagination.page === 1}
                          >
                            <ChevronsLeft className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setGapPagination({ ...gapPagination, page: gapPagination.page - 1 })}
                            disabled={gapPagination.page === 1}
                          >
                            <ChevronLeft className="h-4 w-4" />
                          </Button>

                          <span className="text-sm">
                            Page {gapPagination.page} of {Math.ceil(gapPagination.total / gapPagination.pageSize)}
                          </span>

                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setGapPagination({ ...gapPagination, page: gapPagination.page + 1 })}
                            disabled={gapPagination.page === Math.ceil(gapPagination.total / gapPagination.pageSize)}
                          >
                            <ChevronRight className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setGapPagination({ ...gapPagination, page: Math.ceil(gapPagination.total / gapPagination.pageSize) })}
                            disabled={gapPagination.page === Math.ceil(gapPagination.total / gapPagination.pageSize)}
                          >
                            <ChevronsRight className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    )}

                    {gapsAnalysis.filter(gap => gap.assessment_id === selectedAssessmentForControls).length === 0 && (
                      <div className="text-center py-8">
                        <AlertTriangle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <p className="text-muted-foreground mb-4">No gaps identified for this assessment</p>
                        <Button variant="outline" onClick={() => generateGapsFromAssessments()}>
                          <Zap className="h-4 w-4 mr-2" />
                          Generate Gaps from Assessments
                        </Button>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Remediation Tracking Tab */}
          <TabsContent value="remediation" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5" />
                      Remediation Tracking
                    </CardTitle>
                    <CardDescription>
                      Track remediation activities for identified gaps
                    </CardDescription>
                  </div>
                </div>

                {/* Filters and Search */}
                <div className="flex items-center gap-4 mt-4">
                  <div className="flex items-center gap-2">
                    <Search className="h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search remediation activities..."
                      value={remediationFilters.search || ""}
                      onChange={(e) => setRemediationFilters({ ...remediationFilters, search: e.target.value })}
                      className="w-64"
                    />
                  </div>

                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="flex items-center gap-2">
                        <Filter className="h-4 w-4" />
                        Filters
                        {((remediationFilters.statuses?.length || 0) + (remediationFilters.assignees?.length || 0) + (remediationFilters.severities?.length || 0)) > 0 && (
                          <Badge variant="secondary" className="ml-1">
                            {(remediationFilters.statuses?.length || 0) + (remediationFilters.assignees?.length || 0) + (remediationFilters.severities?.length || 0)}
                          </Badge>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-80">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium">Filter by Status</h4>
                          {remediationFilters.statuses?.length > 0 && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setRemediationFilters({ ...remediationFilters, statuses: [] })}
                            >
                              Clear
                            </Button>
                          )}
                        </div>
                        <div className="space-y-2">
                          {["not_started", "in_progress", "completed", "on_hold"].map((status) => (
                            <div key={status} className="flex items-center space-x-2">
                              <Checkbox
                                id={`remediation-status-${status}`}
                                checked={remediationFilters.statuses?.includes(status) || false}
                                onCheckedChange={(checked) => {
                                  if (checked) {
                                    setRemediationFilters({
                                      ...remediationFilters,
                                      statuses: [...(remediationFilters.statuses || []), status]
                                    })
                                  } else {
                                    setRemediationFilters({
                                      ...remediationFilters,
                                      statuses: (remediationFilters.statuses || []).filter(s => s !== status)
                                    })
                                  }
                                }}
                              />
                              <Label htmlFor={`remediation-status-${status}`} className="text-sm capitalize">
                                {status.replace('_', ' ')}
                              </Label>
                            </div>
                          ))}
                        </div>

                        <Separator />

                        <div className="flex items-center justify-between">
                          <h4 className="font-medium">Filter by Assignee</h4>
                          {remediationFilters.assignees?.length > 0 && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setRemediationFilters({ ...remediationFilters, assignees: [] })}
                            >
                              Clear
                            </Button>
                          )}
                        </div>
                        <div className="space-y-2">
                          {Array.from(new Set(remediationTracking.map(r => r.assigned_to))).filter(Boolean).map((assignee) => (
                            <div key={assignee} className="flex items-center space-x-2">
                              <Checkbox
                                id={`assignee-${assignee}`}
                                checked={remediationFilters.assignees?.includes(assignee) || false}
                                onCheckedChange={(checked) => {
                                  if (checked) {
                                    setRemediationFilters({
                                      ...remediationFilters,
                                      assignees: [...(remediationFilters.assignees || []), assignee]
                                    })
                                  } else {
                                    setRemediationFilters({
                                      ...remediationFilters,
                                      assignees: (remediationFilters.assignees || []).filter(a => a !== assignee)
                                    })
                                  }
                                }}
                              />
                              <Label htmlFor={`assignee-${assignee}`} className="text-sm">
                                {assignee}
                              </Label>
                            </div>
                          ))}
                        </div>

                        <Separator />

                        <div className="flex items-center justify-between">
                          <h4 className="font-medium">Filter by Gap Severity</h4>
                          {remediationFilters.severities?.length > 0 && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setRemediationFilters({ ...remediationFilters, severities: [] })}
                            >
                              Clear
                            </Button>
                          )}
                        </div>
                        <div className="space-y-2">
                          {["low", "medium", "high", "critical"].map((severity) => (
                            <div key={severity} className="flex items-center space-x-2">
                              <Checkbox
                                id={`remediation-severity-${severity}`}
                                checked={remediationFilters.severities?.includes(severity) || false}
                                onCheckedChange={(checked) => {
                                  if (checked) {
                                    setRemediationFilters({
                                      ...remediationFilters,
                                      severities: [...(remediationFilters.severities || []), severity]
                                    })
                                  } else {
                                    setRemediationFilters({
                                      ...remediationFilters,
                                      severities: (remediationFilters.severities || []).filter(s => s !== severity)
                                    })
                                  }
                                }}
                              />
                              <Label htmlFor={`remediation-severity-${severity}`} className="text-sm capitalize">
                                {severity}
                              </Label>
                            </div>
                          ))}
                        </div>
                      </div>
                    </PopoverContent>
                  </Popover>

                  <div className="flex items-center gap-2 ml-auto">
                    <Label htmlFor="remediation-page-size">Show:</Label>
                    <Select
                      value={remediationPagination.pageSize.toString()}
                      onValueChange={(value) => setRemediationPagination({ ...remediationPagination, pageSize: parseInt(value), page: 1 })}
                    >
                      <SelectTrigger className="w-20">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="5">5</SelectItem>
                        <SelectItem value="10">10</SelectItem>
                        <SelectItem value="20">20</SelectItem>
                        <SelectItem value="50">50</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Button
                    variant="outline"
                    onClick={() => setIsCreateRemediationOpen(true)}
                    disabled={!selectedAssessmentForControls}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Assign Remediation
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {!selectedAssessmentForControls ? (
                  <div className="text-center py-8">
                    <CheckCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">Please select an assessment to view remediation tracking</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {/* Remediation Summary */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <Card className="border-l-4 border-l-green-500">
                        <CardContent className="p-4">
                          <div className="text-2xl font-bold text-green-600">
                            {remediationTracking.filter(r => r.status === 'completed').length}
                          </div>
                          <div className="text-sm text-muted-foreground">Completed</div>
                        </CardContent>
                      </Card>
                      <Card className="border-l-4 border-l-blue-500">
                        <CardContent className="p-4">
                          <div className="text-2xl font-bold text-blue-600">
                            {remediationTracking.filter(r => r.status === 'in_progress').length}
                          </div>
                          <div className="text-sm text-muted-foreground">In Progress</div>
                        </CardContent>
                      </Card>
                      <Card className="border-l-4 border-l-yellow-500">
                        <CardContent className="p-4">
                          <div className="text-2xl font-bold text-yellow-600">
                            {remediationTracking.filter(r => r.status === 'not_started').length}
                          </div>
                          <div className="text-sm text-muted-foreground">Not Started</div>
                        </CardContent>
                      </Card>
                      <Card className="border-l-4 border-l-red-500">
                        <CardContent className="p-4">
                          <div className="text-2xl font-bold text-red-600">
                            {remediationTracking.filter(r => r.status === 'on_hold').length}
                          </div>
                          <div className="text-sm text-muted-foreground">On Hold</div>
                        </CardContent>
                      </Card>
                    </div>

                    {/* Remediation Table */}
                    <div className="rounded-md border">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Control & Gap</TableHead>
                            <TableHead>Remediation Plan</TableHead>
                            <TableHead>Assigned To</TableHead>
                            <TableHead>Due Date</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Priority</TableHead>
                            <TableHead>Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {(() => {
                            // Apply filters and search
                            let filteredRemediations = remediationTracking.filter(remediation => {
                              // Assessment filter
                              const gap = gapsAnalysis.find(g => g.id === remediation.gap_id)
                              if (!gap || gap.assessment_id !== selectedAssessmentForControls) {
                                return false
                              }

                              // Search filter
                              if (remediationFilters.search) {
                                const searchTerm = remediationFilters.search.toLowerCase()
                                if (!remediation.remediation_plan.toLowerCase().includes(searchTerm) &&
                                  !remediation.assigned_to.toLowerCase().includes(searchTerm) &&
                                  !remediation.notes?.toLowerCase().includes(searchTerm)) {
                                  return false
                                }
                              }

                              // Status filter
                              if (remediationFilters.statuses?.length > 0) {
                                if (!remediationFilters.statuses.includes(remediation.status)) {
                                  return false
                                }
                              }

                              // Assignee filter
                              if (remediationFilters.assignees?.length > 0) {
                                if (!remediationFilters.assignees.includes(remediation.assigned_to)) {
                                  return false
                                }
                              }

                              // Severity filter (from associated gap)
                              if (remediationFilters.severities?.length > 0) {
                                const gap = gapsAnalysis.find(g => g.id === remediation.gap_id)
                                if (!gap || !remediationFilters.severities.includes(gap.severity)) {
                                  return false
                                }
                              }

                              return true
                            }))



                            // Apply pagination
                            const startIndex = (remediationPagination.page - 1) * remediationPagination.pageSize
                          const endIndex = startIndex + remediationPagination.pageSize
                          const paginatedRemediations = filteredRemediations.slice(startIndex, endIndex)

                            return paginatedRemediations.map((remediation) => {
                              const gap = gapsAnalysis.find(g => g.id === remediation.gap_id)
                          return (
                          <TableRow key={remediation.id}>
                            <TableCell className="font-medium">
                              <div>
                                <div className="font-medium text-sm">
                                  {remediation.control_id}: {remediation.control_name}
                                </div>
                                <div className="text-xs text-muted-foreground">
                                  {remediation.gap_description?.length > 60
                                    ? `${remediation.gap_description.substring(0, 60)}...`
                                    : remediation.gap_description}
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="max-w-xs">
                                <div className="font-medium text-sm">{remediation.remediation_plan}</div>
                                {remediation.notes && (
                                  <div className="text-xs text-muted-foreground mt-1">
                                    {remediation.notes.length > 50
                                      ? `${remediation.notes.substring(0, 50)}...`
                                      : remediation.notes}
                                  </div>
                                )}
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <User className="h-4 w-4 text-muted-foreground" />
                                {remediation.assigned_to}
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Calendar className="h-4 w-4 text-muted-foreground" />
                                {new Date(remediation.due_date).toLocaleDateString()}
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge
                                variant={
                                  remediation.status === 'completed' ? 'default' :
                                    remediation.status === 'in_progress' ? 'secondary' :
                                      remediation.status === 'not_started' ? 'outline' : 'destructive'
                                }
                              >
                                {remediation.status.replace('_', ' ').toUpperCase()}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              {gap && getPriorityBadge(gap.priority)}
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <ActionButtons isTableAction={true}
                                  //onView={() => {}}
                                  onEdit={() => handleEditRemediation(remediation)}

                                  actionObj={remediation}
                                //onDelete={() => handleDeleteAsset(asset)}
                                //deleteDialogTitle={asset.asset_name}
                                />
                                {/* <Button variant="outline" size="sm">
                                        <Edit className="h-4 w-4 mr-1" />
                                        Update
                                      </Button>

                                      <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleCompleteRemediation(remediation.id)}
                                      >
                                        <CheckCircle className="h-4 w-4 mr-1" />
                                        Complete
                                      </Button>
                                    </div>
                                  </TableCell>
                                </TableRow>
                              )
                            })
                          })()}
                        </TableBody>
                      </Table>
                    </div>

                    {/* Pagination Controls for Remediation */}
                                {remediationPagination.total > remediationPagination.pageSize && (
                                  <div className="flex items-center justify-between mt-4">
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                      <span>
                                        Showing {((remediationPagination.page - 1) * remediationPagination.pageSize) + 1} to {Math.min(remediationPagination.page * remediationPagination.pageSize, remediationPagination.total)} of {remediationPagination.total} remediation activities
                                      </span>
                                    </div>

                                    <div className="flex items-center gap-2">
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setRemediationPagination({ ...remediationPagination, page: 1 })}
                                        disabled={remediationPagination.page === 1}
                                      >
                                        <ChevronsLeft className="h-4 w-4" />
                                      </Button>
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setRemediationPagination({ ...remediationPagination, page: remediationPagination.page - 1 })}
                                        disabled={remediationPagination.page === 1}
                                      >
                                        <ChevronLeft className="h-4 w-4" />
                                      </Button>

                                      <span className="text-sm">
                                        Page {remediationPagination.page} of {Math.ceil(remediationPagination.total / remediationPagination.pageSize)}
                                      </span>

                                      <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setRemediationPagination({ ...remediationPagination, page: remediationPagination.page + 1 })}
                                        disabled={remediationPagination.page === Math.ceil(remediationPagination.total / remediationPagination.pageSize)}
                                      >
                                        <ChevronRight className="h-4 w-4" />
                                      </Button>
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setRemediationPagination({ ...remediationPagination, page: Math.ceil(remediationPagination.total / remediationPagination.pageSize) })}
                                        disabled={remediationPagination.page === Math.ceil(remediationPagination.total / remediationPagination.pageSize)}
                                      >
                                        <ChevronsRight className="h-4 w-4" />
                                      </Button>
                                    </div>
                                  </div>
                                )}

                                {remediationTracking.filter(remediation => {
                                  const gap = gapsAnalysis.find(g => g.id === remediation.gap_id)
                                  return gap && gap.assessment_id === selectedAssessmentForControls
                                }).length === 0 && (
                                    <div className="text-center py-8">
                                      <CheckCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                                      <p className="text-muted-foreground mb-4">No remediation activities assigned for this assessment</p>
                                      <p className="text-sm text-muted-foreground">
                                        Create gaps first, then assign remediation activities to track progress
                                      </p>
                                    </div>
                                  )}
                              </div>
                )}
                            </CardContent>
                          </Card>

                          {/* Create Remediation Dialog */}
                          <Dialog open={isCreateRemediationOpen} onOpenChange={setIsCreateRemediationOpen}>
                            <DialogContent className="sm:max-w-[600px]">
                              <DialogHeader>
                                <DialogTitle>Assign Remediation Activity</DialogTitle>
                                <DialogDescription>
                                  Create a remediation plan for an identified gap
                                </DialogDescription>
                              </DialogHeader>
                              <div className="grid gap-4 py-4">
                                <div className="space-y-2">
                                  <Label htmlFor="gap_select">Select Gap</Label>
                                  <Select
                                    value={remediationForm.gap_id?.toString() || ""}
                                    onValueChange={(value) => setRemediationForm({ ...remediationForm, gap_id: parseInt(value) })}
                                  >
                                    <SelectTrigger>
                                      <SelectValue placeholder="Choose a gap to remediate" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {gapsAnalysis
                                        .filter(gap => gap.assessment_id === selectedAssessmentForControls)
                                        .map((gap) => (
                                          <SelectItem key={gap.id} value={gap.id?.toString() || ""}>
                                            {gap.control_id_str}: {gap.gap_description?.substring(0, 50)}...
                                          </SelectItem>
                                        ))}
                                    </SelectContent>
                                  </Select>
                                </div>

                                <div className="space-y-2">
                                  <Label htmlFor="remediation_plan">Remediation Plan</Label>
                                  <Textarea
                                    id="remediation_plan"
                                    value={remediationForm.remediation_plan}
                                    onChange={(e) => setRemediationForm({ ...remediationForm, remediation_plan: e.target.value })}
                                    placeholder="Describe the remediation plan"
                                    rows={3}
                                  />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                  <div className="space-y-2">
                                    <Label htmlFor="assigned_to">Assigned To</Label>
                                    <OwnerSelectInput formData={remediationForm} setFormData={setRemediationFilters} fieldName="assigned_to" />
                                    {/* <Input
                        id="assigned_to"
                        value={remediationForm.assigned_to}
                        onChange={(e) => setRemediationForm({ ...remediationForm, assigned_to: e.target.value })}
                        placeholder="Person responsible"
                      /> */}
                                  </div>
                                  <div className="space-y-2">
                                    <Label htmlFor="due_date">Due Date</Label>
                                    <Input
                                      id="due_date"
                                      type="date"
                                      value={remediationForm.due_date}
                                      onChange={(e) => setRemediationForm({ ...remediationForm, due_date: e.target.value })}
                                    />
                                  </div>
                                </div>

                                <div className="space-y-2">
                                  <Label htmlFor="remediation_notes">Notes</Label>
                                  <Textarea
                                    id="remediation_notes"
                                    value={remediationForm.notes}
                                    onChange={(e) => setRemediationForm({ ...remediationForm, notes: e.target.value })}
                                    placeholder="Additional notes or context"
                                    rows={2}
                                  />
                                </div>
                              </div>
                              <DialogFooter>
                                <Button variant="outline" onClick={() => setIsCreateRemediationOpen(false)}>
                                  Cancel
                                </Button>
                                <Button
                                  onClick={
                                    editingRemediationId
                                      ? () => handleUpdateRemediation(editingRemediationId)
                                      : handleCreateRemediation
                                  }
                                  variant="outline"
                                  disabled={
                                    !remediationForm.gap_id ||
                                    !remediationForm.remediation_plan ||
                                    !remediationForm.assigned_to ||
                                    !remediationForm.due_date
                                  }
                                >
                                  {editingRemediationId ? "Update Remediation" : "Assign Remediation"}
                                </Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
                        </TabsContent>
                      </Tabs>
                      {/* Assess Control Dialog */}
                      <Dialog open={isAssessDialogOpen} onOpenChange={setIsAssessDialogOpen}>
                        <DialogContent className="sm:max-w-[600px]">
                          <DialogHeader>
                            <DialogTitle>Assess Control</DialogTitle>
                            <DialogDescription>
                              Evaluate the current and target maturity levels for the selected control.
                            </DialogDescription>
                          </DialogHeader>

                          {selectedControl ? (
                            <div className="grid gap-4 py-4">
                              <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-md">
                                <h3 className="font-medium text-blue-700 dark:text-blue-300 mb-1">
                                  {selectedControl.control_id}: {selectedControl.control_name}
                                </h3>
                                <p className="text-sm text-muted-foreground">
                                  {selectedControl.control_objective}
                                </p>
                              </div>

                              <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                  <Label htmlFor="current_level">Current Maturity Level</Label>
                                  <Select
                                    value={controlAssessmentForm.current_level.toString()}
                                    onValueChange={(value) =>
                                      setControlAssessmentForm({
                                        ...controlAssessmentForm,
                                        current_level: parseInt(value),
                                      })
                                    }
                                  >
                                    <SelectTrigger>
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {[1, 2, 3, 4, 5].map((level) => (
                                        <SelectItem key={level} value={level.toString()}>
                                          Level {level}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                </div>

                                <div className="space-y-2">
                                  <Label htmlFor="target_level">Target Maturity Level</Label>
                                  <Select
                                    value={controlAssessmentForm.target_level.toString()}
                                    onValueChange={(value) =>
                                      setControlAssessmentForm({
                                        ...controlAssessmentForm,
                                        target_level: parseInt(value),
                                      })
                                    }
                                  >
                                    <SelectTrigger>
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {[1, 2, 3, 4, 5].map((level) => (
                                        <SelectItem key={level} value={level.toString()}>
                                          Level {level}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                </div>
                              </div>

                              <div className="space-y-2">
                                <Label htmlFor="assessment_date">Assessment Date</Label>
                                <Input
                                  id="assessment_date"
                                  type="date"
                                  value={controlAssessmentForm.assessment_date}
                                  onChange={(e) =>
                                    setControlAssessmentForm({
                                      ...controlAssessmentForm,
                                      assessment_date: e.target.value,
                                    })
                                  }
                                />
                              </div>

                              <div className="space-y-2">
                                <Label htmlFor="comments">Assessor Comments</Label>
                                <Textarea
                                  id="comments"
                                  placeholder="Provide assessment rationale or notes"
                                  value={controlAssessmentForm.comments}
                                  onChange={(e) =>
                                    setControlAssessmentForm({
                                      ...controlAssessmentForm,
                                      comments: e.target.value,
                                    })
                                  }
                                  rows={2}
                                />
                              </div>

                              <div className="space-y-2">
                                <Label htmlFor="evidence">Evidence / Reference</Label>
                                <Textarea
                                  id="evidence"
                                  placeholder="Add link or description of supporting evidence"
                                  value={controlAssessmentForm.evidence}
                                  onChange={(e) =>
                                    setControlAssessmentForm({
                                      ...controlAssessmentForm,
                                      evidence: e.target.value,
                                    })
                                  }
                                  rows={2}
                                />
                              </div>

                              {/* Gap Fields (shown if current < target) */}
                              {controlAssessmentForm.current_level < controlAssessmentForm.target_level && (
                                <div className="space-y-4 border-t pt-4">
                                  <h4 className="font-medium text-red-600">Gap Details</h4>

                                  <div className="space-y-2">
                                    <Label htmlFor="gap_description">Gap Description</Label>
                                    <Textarea
                                      id="gap_description"
                                      placeholder="Describe the gap between current and target levels"
                                      value={controlAssessmentForm.gap_description}
                                      onChange={(e) =>
                                        setControlAssessmentForm({
                                          ...controlAssessmentForm,
                                          gap_description: e.target.value,
                                        })
                                      }
                                      rows={2}
                                    />
                                  </div>

                                  <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                      <Label htmlFor="gap_severity">Severity</Label>
                                      <Select
                                        value={controlAssessmentForm.gap_severity}
                                        onValueChange={(value) =>
                                          setControlAssessmentForm({
                                            ...controlAssessmentForm,
                                            gap_severity: value as
                                              | "low"
                                              | "medium"
                                              | "high"
                                              | "critical",
                                          })
                                        }
                                      >
                                        <SelectTrigger>
                                          <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                          <SelectItem value="low">Low</SelectItem>
                                          <SelectItem value="medium">Medium</SelectItem>
                                          <SelectItem value="high">High</SelectItem>
                                          <SelectItem value="critical">Critical</SelectItem>
                                        </SelectContent>
                                      </Select>
                                    </div>

                                    <div className="space-y-2">
                                      <Label htmlFor="estimated_effort">Estimated Effort</Label>
                                      <Input
                                        id="estimated_effort"
                                        placeholder="e.g. 5 days, 2 weeks"
                                        value={controlAssessmentForm.estimated_effort}
                                        onChange={(e) =>
                                          setControlAssessmentForm({
                                            ...controlAssessmentForm,
                                            estimated_effort: e.target.value,
                                          })
                                        }
                                      />
                                    </div>
                                  </div>

                                  <div className="space-y-2">
                                    <Label htmlFor="recommended_actions">Recommended Actions</Label>
                                    <Textarea
                                      id="recommended_actions"
                                      placeholder="Suggested remediation steps or improvements"
                                      value={controlAssessmentForm.recommended_actions}
                                      onChange={(e) =>
                                        setControlAssessmentForm({
                                          ...controlAssessmentForm,
                                          recommended_actions: e.target.value,
                                        })
                                      }
                                      rows={2}
                                    />
                                  </div>
                                </div>
                              )}
                            </div>
                          ) : (
                            <p className="text-center text-muted-foreground py-4">
                              No control selected.
                            </p>
                          )}

                          <DialogFooter>
                            <Button variant="outline" onClick={() => setIsAssessDialogOpen(false)}>
                              Cancel
                            </Button>
                            <Button onClick={handleControlAssessment}>Save Assessment</Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>

                      {/* Export Dialog */}
                      <Dialog open={isExportDialogOpen} onOpenChange={setIsExportDialogOpen}>
                        <DialogContent className="sm:max-w-[425px]">
                          <DialogHeader>
                            <DialogTitle>Export CRI Controls</DialogTitle>
                            <DialogDescription>
                              Export CRI framework controls to a file format of your choice.
                            </DialogDescription>
                          </DialogHeader>
                          <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label htmlFor="export-format" className="text-right">
                                Format
                              </Label>
                              <Select value={exportFormat} onValueChange={(value: any) => setExportFormat(value)}>
                                <SelectTrigger className="col-span-3">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="csv">CSV</SelectItem>
                                  <SelectItem value="excel">Excel</SelectItem>
                                  <SelectItem value="json">JSON</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label htmlFor="export-domain" className="text-right">
                                Domain
                              </Label>
                              <Select value={exportDomain} onValueChange={setExportDomain}>
                                <SelectTrigger className="col-span-3">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="all">All Domains</SelectItem>
                                  <SelectItem value="Governance">Governance</SelectItem>
                                  <SelectItem value="Information Security">Information Security</SelectItem>
                                  <SelectItem value="Operations">Operations</SelectItem>
                                  <SelectItem value="Compliance">Compliance</SelectItem>
                                  <SelectItem value="Supply Chain">Supply Chain</SelectItem>
                                  <SelectItem value="People">People</SelectItem>
                                  <SelectItem value="Technology">Technology</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                          <DialogFooter>
                            <Button variant="outline" onClick={() => setIsExportDialogOpen(false)}>
                              Cancel
                            </Button>
                            <Button onClick={handleExportControls} disabled={isExporting}>
                              {isExporting ? "Exporting..." : "Export"}
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>

                      {/* Import Dialog */}
                      <Dialog open={isImportDialogOpen} onOpenChange={setIsImportDialogOpen}>
                        <DialogContent className="sm:max-w-[425px]">
                          <DialogHeader>
                            <DialogTitle>Import CRI Controls</DialogTitle>
                            <DialogDescription>
                              Import CRI framework controls from a CSV or Excel file. This will add new controls to the existing framework.
                            </DialogDescription>
                          </DialogHeader>
                          <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label htmlFor="import-file" className="text-right">
                                File
                              </Label>
                              <div className="col-span-3">
                                <Input
                                  id="import-file"
                                  type="file"
                                  accept=".csv,.xls,.xlsx"
                                  onChange={handleFileUpload}
                                  disabled={isImporting}
                                />
                                <p className="text-sm text-muted-foreground mt-1">
                                  Supported formats: CSV, Excel (.xls, .xlsx)
                                </p>
                              </div>
                            </div>
                            <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                              <p className="text-sm text-blue-700 dark:text-blue-300">
                                <strong>CSV Format:</strong> Control ID, Control Name, Domain, Control Objective, Maturity Level 1, Maturity Level 2, Maturity Level 3, Maturity Level 4, Maturity Level 5
                              </p>
                            </div>
                          </div>
                          <DialogFooter>
                            <Button variant="outline" onClick={() => setIsImportDialogOpen(false)}>
                              Cancel
                            </Button>
                            <Button variant="outline" onClick={() => {
                              const input = document.getElementById('import-file') as HTMLInputElement
                              if (input?.files?.[0]) {
                                handleImportControls(input.files[0], true)
                              }
                            }} disabled={isImporting}>
                              {isImporting ? "Importing..." : "Import & Overwrite"}
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>

                    </div>
                  </main>
                )
                }