"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
import {
  Shield,
  Building,
  Users,
  Server,
  FileText,
  Lock,
  Network,
  Database,
  Search,
  RefreshCw,
  Save,
  CheckCircle,
  AlertTriangle,
  Minus,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface ISO27001Control {
  id: number
  domain: string
  control_id: string
  control_name: string
  control_description: string
  implementation_status: string
  maturity_level: string
  evidence: string
  comments: string
  responsible_party: string
  last_reviewed: string
  next_review: string
}

export function ISO27001SelfAssessment() {
  const [controls, setControls] = useState<ISO27001Control[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedDomain, setSelectedDomain] = useState<string>("all")
  const [selectedStatus, setSelectedStatus] = useState<string>("all")
  const { toast } = useToast()

  useEffect(() => {
    fetchControls()
  }, [])

  const fetchControls = async () => {
    setLoading(true)
    try {
      // Mock data for ISO 27001 controls
      const mockControls: ISO27001Control[] = [
        {
          id: 1,
          domain: "Information Security Policies",
          control_id: "A.5.1",
          control_name: "Policies for information security",
          control_description:
            "A set of policies for information security shall be defined, approved by management, published and communicated to employees and relevant external parties.",
          implementation_status: "Implemented",
          maturity_level: "Advanced",
          evidence: "Information Security Policy v2.1, Board approval minutes, Employee training records",
          comments: "Policy reviewed and updated quarterly. All staff completed training.",
          responsible_party: "CISO",
          last_reviewed: "2024-01-15",
          next_review: "2024-04-15",
        },
        {
          id: 2,
          domain: "Organization of Information Security",
          control_id: "A.6.1",
          control_name: "Internal organization",
          control_description:
            "Management shall establish a management framework to initiate and control the implementation and operation of information security within the organization.",
          implementation_status: "Partially Implemented",
          maturity_level: "Intermediate",
          evidence: "Security governance framework, RACI matrix, Security committee charter",
          comments: "Framework established but needs regular review meetings implementation.",
          responsible_party: "Security Manager",
          last_reviewed: "2024-01-10",
          next_review: "2024-03-10",
        },
        {
          id: 3,
          domain: "Human Resource Security",
          control_id: "A.7.1",
          control_name: "Screening",
          control_description:
            "Background verification checks on all candidates for employment shall be carried out in accordance with relevant laws, regulations and ethics.",
          implementation_status: "Partially Implemented",
          maturity_level: "Basic",
          evidence: "HR screening procedure, Background check reports for key positions",
          comments: "Screening implemented for critical roles only. Need to extend to all positions.",
          responsible_party: "HR Manager",
          last_reviewed: "2024-01-05",
          next_review: "2024-04-05",
        },
        {
          id: 4,
          domain: "Asset Management",
          control_id: "A.8.1",
          control_name: "Responsibility for assets",
          control_description:
            "Assets associated with information and information processing facilities shall be identified and an inventory of these assets shall be drawn up and maintained.",
          implementation_status: "Implemented",
          maturity_level: "Intermediate",
          evidence: "Asset inventory database, Asset classification scheme, Asset ownership matrix",
          comments: "Comprehensive asset inventory maintained with quarterly updates.",
          responsible_party: "IT Manager",
          last_reviewed: "2024-01-20",
          next_review: "2024-04-20",
        },
        {
          id: 5,
          domain: "Access Control",
          control_id: "A.9.1",
          control_name: "Business requirements of access control",
          control_description:
            "An access control policy shall be established, documented and reviewed based on business and information security requirements.",
          implementation_status: "Implemented",
          maturity_level: "Advanced",
          evidence: "Access control policy, Role-based access matrix, Access review reports",
          comments: "Comprehensive access control framework with regular reviews.",
          responsible_party: "Security Administrator",
          last_reviewed: "2024-01-25",
          next_review: "2024-04-25",
        },
        {
          id: 6,
          domain: "Cryptography",
          control_id: "A.10.1",
          control_name: "Cryptographic controls",
          control_description:
            "A policy on the use of cryptographic controls for protection of information shall be developed and implemented.",
          implementation_status: "Partially Implemented",
          maturity_level: "Intermediate",
          evidence: "Cryptography policy, Encryption standards, Key management procedures",
          comments: "Policy exists but implementation across all systems is ongoing.",
          responsible_party: "Security Architect",
          last_reviewed: "2024-01-12",
          next_review: "2024-03-12",
        },
        {
          id: 7,
          domain: "Physical and Environmental Security",
          control_id: "A.11.1",
          control_name: "Secure areas",
          control_description:
            "Physical security perimeters shall be defined and used to protect areas that contain either sensitive or critical information and information processing facilities.",
          implementation_status: "Implemented",
          maturity_level: "Intermediate",
          evidence: "Physical security assessment, Access control systems, Security camera footage",
          comments: "Physical security measures in place with regular monitoring.",
          responsible_party: "Facilities Manager",
          last_reviewed: "2024-01-08",
          next_review: "2024-04-08",
        },
        {
          id: 8,
          domain: "Operations Security",
          control_id: "A.12.1",
          control_name: "Operational procedures and responsibilities",
          control_description:
            "Operating procedures shall be documented and made available to all users who need them.",
          implementation_status: "Partially Implemented",
          maturity_level: "Basic",
          evidence: "Some operational procedures documented, Process documentation templates",
          comments: "Documentation exists but not comprehensive. Need to complete all procedures.",
          responsible_party: "Operations Manager",
          last_reviewed: "2024-01-03",
          next_review: "2024-03-03",
        },
      ]
      setControls(mockControls)
    } catch (error) {
      console.error("Failed to fetch ISO 27001 controls:", error)
      toast({
        title: "Error",
        description: "Failed to load controls",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const updateControl = (id: number, field: string, value: string) => {
    setControls(controls.map((control) => (control.id === id ? { ...control, [field]: value } : control)))
  }

  const saveAssessment = async () => {
    try {
      // Here you would save to your API
      toast({
        title: "Success",
        description: "Self-assessment saved successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save assessment",
        variant: "destructive",
      })
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Implemented":
        return "bg-gradient-to-r from-green-500 to-teal-500 text-white"
      case "Partially Implemented":
        return "bg-gradient-to-r from-yellow-500 to-orange-500 text-white"
      case "Not Implemented":
        return "bg-gradient-to-r from-red-500 to-red-700 text-white"
      default:
        return "bg-gradient-to-r from-gray-400 to-gray-500 text-white"
    }
  }

  const getMaturityColor = (level: string) => {
    switch (level) {
      case "Advanced":
        return "bg-gradient-to-r from-green-600 to-teal-600 text-white"
      case "Intermediate":
        return "bg-gradient-to-r from-blue-500 to-cyan-500 text-white"
      case "Basic":
        return "bg-gradient-to-r from-yellow-500 to-orange-500 text-white"
      default:
        return "bg-gradient-to-r from-gray-400 to-gray-500 text-white"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Implemented":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "Partially Implemented":
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />
      case "Not Implemented":
        return <Minus className="h-4 w-4 text-red-600" />
      default:
        return <Minus className="h-4 w-4 text-gray-600" />
    }
  }

  const getDomainIcon = (domain: string) => {
    switch (domain) {
      case "Information Security Policies":
        return <FileText className="h-4 w-4" />
      case "Organization of Information Security":
        return <Building className="h-4 w-4" />
      case "Human Resource Security":
        return <Users className="h-4 w-4" />
      case "Asset Management":
        return <Database className="h-4 w-4" />
      case "Access Control":
        return <Lock className="h-4 w-4" />
      case "Cryptography":
        return <Shield className="h-4 w-4" />
      case "Physical and Environmental Security":
        return <Server className="h-4 w-4" />
      case "Operations Security":
        return <Network className="h-4 w-4" />
      default:
        return <Shield className="h-4 w-4" />
    }
  }

  const domains = [...new Set(controls.map((control) => control.domain))]
  const statuses = ["Implemented", "Partially Implemented", "Not Implemented"]

  const filteredControls = controls.filter((control) => {
    const matchesSearch =
      control.control_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      control.control_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      control.domain.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesDomain = selectedDomain === "all" || control.domain === selectedDomain
    const matchesStatus = selectedStatus === "all" || control.implementation_status === selectedStatus

    return matchesSearch && matchesDomain && matchesStatus
  })

  const getAssessmentStats = () => {
    const total = controls.length
    const implemented = controls.filter((c) => c.implementation_status === "Implemented").length
    const partiallyImplemented = controls.filter((c) => c.implementation_status === "Partially Implemented").length
    const notImplemented = controls.filter((c) => c.implementation_status === "Not Implemented").length
    const completionRate = total > 0 ? Math.round((implemented / total) * 100) : 0

    return { total, implemented, partiallyImplemented, notImplemented, completionRate }
  }

  const stats = getAssessmentStats()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 bg-clip-text text-transparent">
            ISO 27001 Self Assessment
          </h2>
          <p className="text-muted-foreground">Assess your organization's compliance with ISO 27001 controls</p>
        </div>
        <Button
          onClick={saveAssessment}
        >
          <Save className="mr-2 h-4 w-4" />
          Save Assessment
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Total Controls
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-700">{stats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent">
              Implemented
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-700">{stats.implemented}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent">
              Partially Implemented
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-700">{stats.partiallyImplemented}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium bg-gradient-to-r from-red-600 to-red-800 bg-clip-text text-transparent">
              Not Implemented
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-700">{stats.notImplemented}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Completion Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-700">{stats.completionRate}%</div>
            <Progress value={stats.completionRate} className="mt-2" />
          </CardContent>
        </Card>
      </div>

      {/* Controls Assessment */}
      <Card className="gradient-card-primary">
        <CardHeader>
          <CardTitle className="text-sm font-medium">
            Control Assessment
          </CardTitle>
          <CardDescription>Assess the implementation status of each ISO 27001 control</CardDescription>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="flex flex-wrap items-center gap-4 mb-6">
            <div className="flex items-center space-x-2">
              <Search className="h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search controls..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-64 border-blue-200 focus:border-purple-400"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Label htmlFor="domain-filter">Domain:</Label>
              <Select value={selectedDomain} onValueChange={setSelectedDomain}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Domains</SelectItem>
                  {domains.map((domain) => (
                    <SelectItem key={domain} value={domain}>
                      {domain}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center space-x-2">
              <Label htmlFor="status-filter">Status:</Label>
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  {statuses.map((status) => (
                    <SelectItem key={status} value={status}>
                      {status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-8">
              <RefreshCw className="h-6 w-6 animate-spin text-blue-600" />
              <span className="ml-2">Loading controls...</span>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredControls.map((control) => (
                <Card key={control.id} className="border-blue-200/50">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        {getDomainIcon(control.domain)}
                        <div>
                          <h3 className="font-semibold">
                            {control.control_id} - {control.control_name}
                          </h3>
                          <p className="text-sm text-muted-foreground">{control.domain}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(control.implementation_status)}
                        <Badge className={getStatusColor(control.implementation_status)}>
                          {control.implementation_status}
                        </Badge>
                        <Badge className={getMaturityColor(control.maturity_level)}>{control.maturity_level}</Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <p className="text-sm text-muted-foreground">{control.control_description}</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor={`status-${control.id}`}>Implementation Status</Label>
                        <Select
                          value={control.implementation_status}
                          onValueChange={(value) => updateControl(control.id, "implementation_status", value)}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Implemented">Implemented</SelectItem>
                            <SelectItem value="Partially Implemented">Partially Implemented</SelectItem>
                            <SelectItem value="Not Implemented">Not Implemented</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor={`maturity-${control.id}`}>Maturity Level</Label>
                        <Select
                          value={control.maturity_level}
                          onValueChange={(value) => updateControl(control.id, "maturity_level", value)}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Basic">Basic</SelectItem>
                            <SelectItem value="Intermediate">Intermediate</SelectItem>
                            <SelectItem value="Advanced">Advanced</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`evidence-${control.id}`}>Evidence</Label>
                      <Textarea
                        id={`evidence-${control.id}`}
                        value={control.evidence}
                        onChange={(e) => updateControl(control.id, "evidence", e.target.value)}
                        placeholder="Provide evidence of implementation..."
                        rows={2}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`comments-${control.id}`}>Comments</Label>
                      <Textarea
                        id={`comments-${control.id}`}
                        value={control.comments}
                        onChange={(e) => updateControl(control.id, "comments", e.target.value)}
                        placeholder="Additional comments or notes..."
                        rows={2}
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="font-medium">Responsible Party:</span> {control.responsible_party}
                      </div>
                      <div>
                        <span className="font-medium">Last Reviewed:</span>{" "}
                        {new Date(control.last_reviewed).toLocaleDateString()}
                      </div>
                      <div>
                        <span className="font-medium">Next Review:</span>{" "}
                        {new Date(control.next_review).toLocaleDateString()}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
