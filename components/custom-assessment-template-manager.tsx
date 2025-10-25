"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "@/hooks/use-toast"
import { Plus, Edit, Trash2, Copy, Users, Lock, FileText, Settings, ChevronRight, AlertTriangle } from "lucide-react"
import { ActionButtons } from "./ui/action-buttons"

interface CustomTemplate {
  id: number
  name: string
  description: string
  template_type: string
  vendor_type_id: number | null
  vendor_type_name: string | null
  is_public: boolean
  is_active: boolean
  created_by: string
  created_at: string
  updated_at: string
  usage_count: number
  risk_item_count: number
  settings: any
}

interface RiskItem {
  id?: number
  category_name: string
  category_description: string
  risk_title: string
  risk_description: string
  default_likelihood: number
  default_impact: number
  default_risk_score: number
  control_catalogue: string
  control_reference: string
  is_mandatory: boolean
  weight: number
  sort_order: number
}

interface VendorType {
  id: number
  name: string
  description: string
  color: string
  icon: string
}

export function CustomAssessmentTemplateManager() {
  const [templates, setTemplates] = useState<CustomTemplate[]>([])
  const [vendorTypes, setVendorTypes] = useState<VendorType[]>([])
  const [selectedTemplate, setSelectedTemplate] = useState<CustomTemplate | null>(null)
  const [riskItems, setRiskItems] = useState<RiskItem[]>([])
  const [loading, setLoading] = useState(true)
  const [showNewTemplateDialog, setShowNewTemplateDialog] = useState(false)
  const [showRiskItemDialog, setShowRiskItemDialog] = useState(false)
  const [editingTemplate, setEditingTemplate] = useState<CustomTemplate | null>(null)
  const [editingRiskItem, setEditingRiskItem] = useState<RiskItem | null>(null)

  const [newTemplate, setNewTemplate] = useState({
    name: "",
    description: "",
    template_type: "third_party_risk",
    vendor_type_id: null as number | null,
    is_public: false,
    settings: {
      scoring_method: "weighted",
      pass_threshold: 70,
    },
  })

  const [newRiskItem, setNewRiskItem] = useState<RiskItem>({
    category_name: "",
    category_description: "",
    risk_title: "",
    risk_description: "",
    default_likelihood: 3,
    default_impact: 3,
    default_risk_score: 9,
    control_catalogue: "ISO27001",
    control_reference: "",
    is_mandatory: false,
    weight: 1.0,
    sort_order: 0,
  })

  useEffect(() => {
    fetchTemplates()
    fetchVendorTypes()
  }, [])

  const fetchTemplates = async () => {
    try {
      const response = await fetch("/api/custom-assessment-templates")
      if (response.ok) {
        const data = await response.json()
        setTemplates(data)
      }
    } catch (error) {
      console.error("Error fetching templates:", error)
      toast({
        title: "Error",
        description: "Failed to fetch templates",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const fetchVendorTypes = async () => {
    try {
      const response = await fetch("/api/vendor-types")
      if (response.ok) {
        const data = await response.json()
        setVendorTypes(data)
      }
    } catch (error) {
      console.error("Error fetching vendor types:", error)
    }
  }

  const fetchTemplateDetails = async (templateId: number) => {
    try {
      const response = await fetch(`/api/custom-assessment-templates/${templateId}`)
      if (response.ok) {
        const data = await response.json()
        setSelectedTemplate(data)
        setRiskItems(data.risk_items || [])
      }
    } catch (error) {
      console.error("Error fetching template details:", error)
      toast({
        title: "Error",
        description: "Failed to fetch template details",
        variant: "destructive",
      })
    }
  }

  const handleCreateTemplate = async () => {
    if (!newTemplate.name || !newTemplate.description) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    try {
      const response = await fetch("/api/custom-assessment-templates", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newTemplate),
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: "Template created successfully",
        })
        setShowNewTemplateDialog(false)
        setNewTemplate({
          name: "",
          description: "",
          template_type: "third_party_risk",
          vendor_type_id: null,
          is_public: false,
          settings: {
            scoring_method: "weighted",
            pass_threshold: 70,
          },
        })
        fetchTemplates()
      } else {
        throw new Error("Failed to create template")
      }
    } catch (error) {
      console.error("Error creating template:", error)
      toast({
        title: "Error",
        description: "Failed to create template",
        variant: "destructive",
      })
    }
  }

  const handleUpdateTemplate = async (template: CustomTemplate) => {
    try {
      const response = await fetch(`/api/custom-assessment-templates/${template.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(template),
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: "Template updated successfully",
        })
        setEditingTemplate(null)
        fetchTemplates()
        if (selectedTemplate?.id === template.id) {
          fetchTemplateDetails(template.id)
        }
      } else {
        throw new Error("Failed to update template")
      }
    } catch (error) {
      console.error("Error updating template:", error)
      toast({
        title: "Error",
        description: "Failed to update template",
        variant: "destructive",
      })
    }
  }

  const handleDeleteTemplate = async (templateId: number) => {
    if (!confirm("Are you sure you want to delete this template?")) return

    try {
      const response = await fetch(`/api/custom-assessment-templates/${templateId}`, {
        method: "DELETE",
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: "Template deleted successfully",
        })
        fetchTemplates()
        if (selectedTemplate?.id === templateId) {
          setSelectedTemplate(null)
          setRiskItems([])
        }
      } else {
        throw new Error("Failed to delete template")
      }
    } catch (error) {
      console.error("Error deleting template:", error)
      toast({
        title: "Error",
        description: "Failed to delete template",
        variant: "destructive",
      })
    }
  }

  const handleAddRiskItem = async () => {
    if (!selectedTemplate || !newRiskItem.category_name || !newRiskItem.risk_title || !newRiskItem.risk_description) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    try {
      const response = await fetch(`/api/custom-assessment-templates/${selectedTemplate.id}/risk-items`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newRiskItem),
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: "Risk item added successfully",
        })
        setShowRiskItemDialog(false)
        setNewRiskItem({
          category_name: "",
          category_description: "",
          risk_title: "",
          risk_description: "",
          default_likelihood: 3,
          default_impact: 3,
          default_risk_score: 9,
          control_catalogue: "ISO27001",
          control_reference: "",
          is_mandatory: false,
          weight: 1.0,
          sort_order: 0,
        })
        fetchTemplateDetails(selectedTemplate.id)
      } else {
        throw new Error("Failed to add risk item")
      }
    } catch (error) {
      console.error("Error adding risk item:", error)
      toast({
        title: "Error",
        description: "Failed to add risk item",
        variant: "destructive",
      })
    }
  }

  const getRiskScoreColor = (score: number) => {
    if (score <= 4) return "bg-green-100 text-green-800"
    if (score <= 9) return "bg-yellow-100 text-yellow-800"
    if (score <= 16) return "bg-orange-100 text-orange-800"
    return "bg-red-100 text-red-800"
  }

  const getRiskScoreLabel = (score: number) => {
    if (score <= 4) return "Low"
    if (score <= 9) return "Medium"
    if (score <= 16) return "High"
    return "Critical"
  }

  const groupRiskItemsByCategory = (items: RiskItem[]) => {
    return items.reduce((acc: any, item: RiskItem) => {
      const category = item.category_name
      if (!acc[category]) {
        acc[category] = {
          name: category,
          description: item.category_description,
          items: [],
        }
      }
      acc[category].items.push(item)
      return acc
    }, {})
  }

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Custom Assessment Templates</h1>
          <p className="text-gray-600">Create and manage reusable assessment templates</p>
        </div>
        <Dialog open={showNewTemplateDialog} onOpenChange={setShowNewTemplateDialog}>
          <DialogTrigger asChild>
            <ActionButtons isTableAction={false} onAdd={() => { }} btnAddText="New Template" />
            {/* <Button>
              <Plus className="h-4 w-4 mr-2" />
              New Template
            </Button> */}
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create New Assessment Template</DialogTitle>
              <DialogDescription>Create a reusable template for assessments</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Template Name</Label>
                <Input
                  id="name"
                  value={newTemplate.name}
                  onChange={(e) => setNewTemplate({ ...newTemplate, name: e.target.value })}
                  placeholder="Enter template name"
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={newTemplate.description}
                  onChange={(e) => setNewTemplate({ ...newTemplate, description: e.target.value })}
                  placeholder="Enter template description"
                />
              </div>
              <div>
                <Label htmlFor="vendor_type">Vendor Type (Optional)</Label>
                <Select
                  value={newTemplate.vendor_type_id?.toString() || "none"}
                  onValueChange={(value) =>
                    setNewTemplate({
                      ...newTemplate,
                      vendor_type_id: value === "none" ? null : Number.parseInt(value),
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select vendor type (optional)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">No specific vendor type</SelectItem>
                    {vendorTypes.map((type) => (
                      <SelectItem key={type.id} value={type.id.toString()}>
                        {type.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="scoring_method">Scoring Method</Label>
                  <Select
                    value={newTemplate.settings.scoring_method}
                    onValueChange={(value) =>
                      setNewTemplate({
                        ...newTemplate,
                        settings: { ...newTemplate.settings, scoring_method: value },
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="simple">Simple Average</SelectItem>
                      <SelectItem value="weighted">Weighted Average</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Pass Threshold ({newTemplate.settings.pass_threshold}%)</Label>
                  <Slider
                    value={[newTemplate.settings.pass_threshold]}
                    onValueChange={(value) =>
                      setNewTemplate({
                        ...newTemplate,
                        settings: { ...newTemplate.settings, pass_threshold: value[0] },
                      })
                    }
                    max={100}
                    min={0}
                    step={5}
                    className="mt-2"
                  />
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="is_public"
                  checked={newTemplate.is_public}
                  onCheckedChange={(checked) => setNewTemplate({ ...newTemplate, is_public: checked })}
                />
                <Label htmlFor="is_public">Make template public (available to all users)</Label>
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setShowNewTemplateDialog(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateTemplate}>Create Template</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Templates List */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Templates</h2>
          <div className="space-y-2">
            {templates.length === 0 ? (
              <Card>
                <CardContent className="p-6 text-center">
                  <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 mb-4">No templates found</p>
                  <Button onClick={() => setShowNewTemplateDialog(true)}>Create First Template</Button>
                </CardContent>
              </Card>
            ) : (
              templates.map((template) => (
                <Card
                  key={template.id}
                  className={`cursor-pointer transition-all hover:shadow-md ${selectedTemplate?.id === template.id ? "ring-2 ring-blue-500" : ""
                    }`}
                  onClick={() => fetchTemplateDetails(template.id)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <h3 className="font-medium">{template.name}</h3>
                        <p className="text-sm text-gray-500 mb-2">{template.description}</p>
                        <div className="flex items-center space-x-2 text-xs text-gray-400">
                          <span>{template.risk_item_count} items</span>
                          <span>•</span>
                          <span>Used {template.usage_count} times</span>
                          {template.vendor_type_name && (
                            <>
                              <span>•</span>
                              <span>{template.vendor_type_name}</span>
                            </>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center space-x-1">
                        {template.is_public ? (
                          <Users className="h-4 w-4 text-green-600" title="Public template" />
                        ) : (
                          <Lock className="h-4 w-4 text-gray-400" title="Private template" />
                        )}
                        <ChevronRight className="h-4 w-4 text-gray-400" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>

        {/* Template Details */}
        <div className="lg:col-span-2">
          {selectedTemplate ? (
            <Tabs defaultValue="overview" className="space-y-4">
              <div className="flex justify-between items-center">
                <TabsList>
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="risk-items">Risk Items</TabsTrigger>
                  <TabsTrigger value="settings">Settings</TabsTrigger>
                </TabsList>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">
                    <Copy className="h-4 w-4 mr-2" />
                    Duplicate
                  </Button>
                  <ActionButtons isTableAction={true}
                    //onView={() => {}}
                    onEdit={() => setEditingTemplate(selectedTemplate)}
                    onDelete={() => handleDeleteTemplate(selectedTemplate.id)}
                    deleteDialogTitle={selectedTemplate.name}
                                actionObj={selectedTemplate}
                  />
                  {/* <Button variant="outline" size="sm" onClick={() => setEditingTemplate(selectedTemplate)}>
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleDeleteTemplate(selectedTemplate.id)}>
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </Button> */}
                </div>
              </div>

              <TabsContent value="overview" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <FileText className="h-5 w-5" />
                      <span>{selectedTemplate.name}</span>
                      {selectedTemplate.is_public && <Badge variant="secondary">Public</Badge>}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-gray-600">{selectedTemplate.description}</p>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-sm font-medium">Vendor Type</Label>
                        <p className="text-sm text-gray-600">
                          {selectedTemplate.vendor_type_name || "Any vendor type"}
                        </p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium">Usage Count</Label>
                        <p className="text-sm text-gray-600">{selectedTemplate.usage_count} times</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium">Risk Items</Label>
                        <p className="text-sm text-gray-600">{riskItems.length} items</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium">Created</Label>
                        <p className="text-sm text-gray-600">
                          {new Date(selectedTemplate.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="risk-items" className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold">Risk Items ({riskItems.length})</h3>
                  <Dialog open={showRiskItemDialog} onOpenChange={setShowRiskItemDialog}>
                    <DialogTrigger asChild>
                      <Button>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Risk Item
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>Add Risk Item</DialogTitle>
                        <DialogDescription>Add a new risk item to this template</DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="category_name">Category Name</Label>
                            <Input
                              id="category_name"
                              value={newRiskItem.category_name}
                              onChange={(e) => setNewRiskItem({ ...newRiskItem, category_name: e.target.value })}
                              placeholder="e.g., Data Security"
                            />
                          </div>
                          <div>
                            <Label htmlFor="category_description">Category Description</Label>
                            <Input
                              id="category_description"
                              value={newRiskItem.category_description}
                              onChange={(e) => setNewRiskItem({ ...newRiskItem, category_description: e.target.value })}
                              placeholder="Brief category description"
                            />
                          </div>
                        </div>
                        <div>
                          <Label htmlFor="risk_title">Risk Title</Label>
                          <Input
                            id="risk_title"
                            value={newRiskItem.risk_title}
                            onChange={(e) => setNewRiskItem({ ...newRiskItem, risk_title: e.target.value })}
                            placeholder="Enter risk title"
                          />
                        </div>
                        <div>
                          <Label htmlFor="risk_description">Risk Description</Label>
                          <Textarea
                            id="risk_description"
                            value={newRiskItem.risk_description}
                            onChange={(e) => setNewRiskItem({ ...newRiskItem, risk_description: e.target.value })}
                            placeholder="Enter detailed risk description"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label>Likelihood ({newRiskItem.default_likelihood})</Label>
                            <Slider
                              value={[newRiskItem.default_likelihood]}
                              onValueChange={(value) =>
                                setNewRiskItem({
                                  ...newRiskItem,
                                  default_likelihood: value[0],
                                  default_risk_score: value[0] * newRiskItem.default_impact,
                                })
                              }
                              max={5}
                              min={1}
                              step={1}
                              className="mt-2"
                            />
                          </div>
                          <div>
                            <Label>Impact ({newRiskItem.default_impact})</Label>
                            <Slider
                              value={[newRiskItem.default_impact]}
                              onValueChange={(value) =>
                                setNewRiskItem({
                                  ...newRiskItem,
                                  default_impact: value[0],
                                  default_risk_score: newRiskItem.default_likelihood * value[0],
                                })
                              }
                              max={5}
                              min={1}
                              step={1}
                              className="mt-2"
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="control_catalogue">Control Catalogue</Label>
                            <Select
                              value={newRiskItem.control_catalogue}
                              onValueChange={(value) => setNewRiskItem({ ...newRiskItem, control_catalogue: value })}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="ISO27001">ISO 27001</SelectItem>
                                <SelectItem value="SOC2">SOC 2</SelectItem>
                                <SelectItem value="NIST">NIST</SelectItem>
                                <SelectItem value="PCI_DSS">PCI DSS</SelectItem>
                                <SelectItem value="HIPAA">HIPAA</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label htmlFor="control_reference">Control Reference</Label>
                            <Input
                              id="control_reference"
                              value={newRiskItem.control_reference}
                              onChange={(e) => setNewRiskItem({ ...newRiskItem, control_reference: e.target.value })}
                              placeholder="e.g., A.12.1.1"
                            />
                          </div>
                        </div>
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center space-x-2">
                            <Switch
                              id="is_mandatory"
                              checked={newRiskItem.is_mandatory}
                              onCheckedChange={(checked) => setNewRiskItem({ ...newRiskItem, is_mandatory: checked })}
                            />
                            <Label htmlFor="is_mandatory">Mandatory</Label>
                          </div>
                          <div className="flex-1">
                            <Label>Weight ({newRiskItem.weight})</Label>
                            <Slider
                              value={[newRiskItem.weight]}
                              onValueChange={(value) => setNewRiskItem({ ...newRiskItem, weight: value[0] })}
                              max={3}
                              min={0.1}
                              step={0.1}
                              className="mt-2"
                            />
                          </div>
                        </div>
                        <div className="flex justify-end space-x-2">
                          <Button variant="outline" onClick={() => setShowRiskItemDialog(false)}>
                            Cancel
                          </Button>
                          <Button onClick={handleAddRiskItem}>Add Risk Item</Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>

                <div className="space-y-4">
                  {riskItems.length === 0 ? (
                    <Card>
                      <CardContent className="p-8 text-center">
                        <AlertTriangle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-500 mb-4">No risk items found</p>
                        <Button onClick={() => setShowRiskItemDialog(true)}>Add First Risk Item</Button>
                      </CardContent>
                    </Card>
                  ) : (
                    Object.values(groupRiskItemsByCategory(riskItems)).map((category: any) => (
                      <Card key={category.name}>
                        <CardHeader>
                          <CardTitle className="text-lg">{category.name}</CardTitle>
                          {category.description && <p className="text-sm text-gray-600">{category.description}</p>}
                        </CardHeader>
                        <CardContent className="space-y-3">
                          {category.items.map((item: RiskItem) => (
                            <div key={item.id} className="border rounded-lg p-3">
                              <div className="flex justify-between items-start mb-2">
                                <div className="flex-1">
                                  <div className="flex items-center space-x-2 mb-1">
                                    <h4 className="font-medium">{item.risk_title}</h4>
                                    {item.is_mandatory && (
                                      <Badge variant="destructive" className="text-xs">
                                        Mandatory
                                      </Badge>
                                    )}
                                  </div>
                                  <p className="text-sm text-gray-600 mb-2">{item.risk_description}</p>
                                  <div className="flex items-center space-x-4 text-xs text-gray-500">
                                    <span>L: {item.default_likelihood}</span>
                                    <span>I: {item.default_impact}</span>
                                    <Badge className={getRiskScoreColor(item.default_risk_score)}>
                                      {getRiskScoreLabel(item.default_risk_score)} ({item.default_risk_score})
                                    </Badge>
                                    <span>Weight: {item.weight}</span>
                                    <span>
                                      {item.control_catalogue} {item.control_reference}
                                    </span>
                                  </div>
                                </div>
                                <div className="flex space-x-1">
                                  <ActionButtons isTableAction={true}
                                    //onView={() => {}}
                                    onEdit={() => {}}
                                    onDelete={() => {}}
                                actionObj={item}
                                    //deleteDialogTitle={}
                                  />
                                  {/* <Button variant="outline" size="sm">
                                    <Edit className="h-3 w-3" />
                                  </Button>
                                  <Button variant="outline" size="sm">
                                    <Trash2 className="h-3 w-3" />
                                  </Button> */}
                                </div>
                              </div>
                            </div>
                          ))}
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>
              </TabsContent>

              <TabsContent value="settings" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Settings className="h-5 w-5" />
                      <span>Template Settings</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Scoring Method</Label>
                        <p className="text-sm text-gray-600 capitalize">
                          {selectedTemplate.settings?.scoring_method || "weighted"}
                        </p>
                      </div>
                      <div>
                        <Label>Pass Threshold</Label>
                        <p className="text-sm text-gray-600">{selectedTemplate.settings?.pass_threshold || 70}%</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch checked={selectedTemplate.is_public} disabled />
                      <Label>Public Template</Label>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">Select a Template</h3>
                <p className="text-gray-500">Choose a template from the list to view and manage its details.</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
