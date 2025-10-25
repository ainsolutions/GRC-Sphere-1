"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
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
import { toast } from "@/hooks/use-toast"
import {
  Cloud,
  DollarSign,
  Heart,
  Monitor,
  Scale,
  Megaphone,
  Truck,
  Factory,
  Users,
  Code,
  Building2,
  Plus,
  Edit,
  Trash2,
  Save,
  X,
} from "lucide-react"
import { ActionButtons } from "./ui/action-buttons"

const iconMap = {
  Cloud,
  DollarSign,
  Heart,
  Monitor,
  Scale,
  Megaphone,
  Truck,
  Factory,
  Users,
  Code,
  Building2,
}

interface VendorType {
  id: number;
  name: string;
  description: string;
  color: string;
  icon: string;
  template_count: number;
}

interface RiskTemplate {
  id: number;
  vendorTypeid: number;
  category_id: number;
  risk_title: string;
  risk_description: string | null;
  default_likelihood: number;
  default_impact: number;
  default_risk_score: number;
  control_catalogue: string | null;
  control_reference: string | null;
  is_mandatory: boolean;
  weight: number;
  sort_order: number;
  category_name: string;
  category_description: string | null;
  category_weight: number;
  category_mandatory: boolean;
}

interface TemplateCategory {
  id: number;
  vendor_type_id: number;
  name: string;
  description: string | null;
  weight: number;
  is_mandatory: boolean;
  sort_order: number;
}

export function VendorTypeTemplateManager() {
  const [vendorTypes, setVendorTypes] = useState<VendorType[]>([])
  const [selectedVendorType, setSelectedVendorType] = useState<VendorType | null>(null)
  const [templates, setTemplates] = useState<RiskTemplate[]>([])
  const [categories, setCategories] = useState<TemplateCategory[]>([])
  const [loading, setLoading] = useState(true)
  const [editingTemplate, setEditingTemplate] = useState<RiskTemplate | null>(null)
  const [showNewTemplateDialog, setShowNewTemplateDialog] = useState(false)

  const [newTemplate, setNewTemplate] = useState({
    category_id: "",
    risk_title: "",
    risk_description: "",
    default_likelihood: 3,
    default_impact: 3,
    control_catalogue: "ISO27001",
    control_reference: "",
    is_mandatory: false,
    weight: 1.0,
  })

  useEffect(() => {
    fetchVendorTypes()
  }, [])

  const fetchVendorTypes = async () => {
    try {
      const response = await fetch("/api/vendor-types")
      if (response.ok) {
        const data = await response.json()
        setVendorTypes(data)
      }
    } catch (error) {
      console.error("Error fetching vendor types:", error)
      toast({
        title: "Error",
        description: "Failed to fetch vendor types",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const fetchTemplates = async (vendorTypeId: number) => {
    try {
      const response = await fetch(`/api/vendor-types/${vendorTypeId}/templates`)
      if (response.ok) {
        const data = await response.json()
        setTemplates(data.templates)
        setCategories(data.categories)
      }
    } catch (error) {
      console.error("Error fetching templates:", error)
      toast({
        title: "Error",
        description: "Failed to fetch templates",
        variant: "destructive",
      })
    }
  }

  const handleVendorTypeSelect = (vendorType: VendorType) => {
    setSelectedVendorType(vendorType)
    fetchTemplates(vendorType.id)
  }

  const handleCreateTemplate = async () => {
    if (!selectedVendorType || !newTemplate.risk_title || !newTemplate.category_id) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    try {
      const response = await fetch(`/api/vendor-types/${selectedVendorType.id}/templates`, {
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
          category_id: "",
          risk_title: "",
          risk_description: "",
          default_likelihood: 3,
          default_impact: 3,
          control_catalogue: "ISO27001",
          control_reference: "",
          is_mandatory: false,
          weight: 1.0,
        })
        fetchTemplates(selectedVendorType.id)
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

  const handleUpdateTemplate = async (template: RiskTemplate) => {
    try {
      const response = await fetch(`/api/vendor-type-templates/${template.id}`, {
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
        if (selectedVendorType) {
          fetchTemplates(selectedVendorType.id)
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
      const response = await fetch(`/api/vendor-type-templates/${templateId}`, {
        method: "DELETE",
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: "Template deleted successfully",
        })
        if (selectedVendorType) {
          fetchTemplates(selectedVendorType.id)
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

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Vendor Type Templates</h1>
          <p className="text-gray-600">Manage reusable risk assessment templates for different vendor types</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Vendor Types List */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Vendor Types</h2>
          <div className="space-y-2">
            {vendorTypes.map((vendorType) => {
              const IconComponent = iconMap[vendorType.icon as keyof typeof iconMap] || Building2
              return (
                <Card
                  key={vendorType.id}
                  className={`cursor-pointer transition-all hover:shadow-md ${selectedVendorType?.id === vendorType.id ? "ring-2 ring-blue-500" : ""
                    }`}
                  onClick={() => handleVendorTypeSelect(vendorType)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-3">
                      <div
                        className="p-2 rounded-lg"
                        style={{ backgroundColor: `${vendorType.color}20`, color: vendorType.color }}
                      >
                        <IconComponent className="h-5 w-5" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium">{vendorType.name}</h3>
                        <p className="text-sm text-gray-500">{vendorType.template_count} templates</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>

        {/* Templates Management */}
        <div className="lg:col-span-2">
          {selectedVendorType ? (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">{selectedVendorType.name} Templates</h2>
                <Dialog open={showNewTemplateDialog} onOpenChange={setShowNewTemplateDialog}>
                  <DialogTrigger asChild>
                    <ActionButtons isTableAction={false} onAdd={() => { }} btnAddText="Add Template" />
                    {/* <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Template
                    </Button> */}
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>Create New Risk Template</DialogTitle>
                      <DialogDescription>Add a new risk template for {selectedVendorType.name}</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="category">Category</Label>
                        <Select
                          value={newTemplate.category_id}
                          onValueChange={(value) => setNewTemplate({ ...newTemplate, category_id: value })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            {categories.map((category) => (
                              <SelectItem key={category.id} value={category.id}>
                                {category.risk_category}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="risk_title">Risk Title</Label>
                        <Input
                          id="risk_title"
                          value={newTemplate.risk_title}
                          onChange={(e) => setNewTemplate({ ...newTemplate, risk_title: e.target.value })}
                          placeholder="Enter risk title"
                        />
                      </div>
                      <div>
                        <Label htmlFor="risk_description">Risk Description</Label>
                        <Textarea
                          id="risk_description"
                          value={newTemplate.risk_description}
                          onChange={(e) => setNewTemplate({ ...newTemplate, risk_description: e.target.value })}
                          placeholder="Enter risk description"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label>Likelihood ({newTemplate.default_likelihood})</Label>
                          <Slider
                            value={[newTemplate.default_likelihood]}
                            onValueChange={(value) => setNewTemplate({ ...newTemplate, default_likelihood: value[0] })}
                            max={5}
                            min={1}
                            step={1}
                            className="mt-2"
                          />
                        </div>
                        <div>
                          <Label>Impact ({newTemplate.default_impact})</Label>
                          <Slider
                            value={[newTemplate.default_impact]}
                            onValueChange={(value) => setNewTemplate({ ...newTemplate, default_impact: value[0] })}
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
                            value={newTemplate.control_catalogue}
                            onValueChange={(value) => setNewTemplate({ ...newTemplate, control_catalogue: value })}
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
                            value={newTemplate.control_reference}
                            onChange={(e) => setNewTemplate({ ...newTemplate, control_reference: e.target.value })}
                            placeholder="e.g., A.12.1.1"
                          />
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch
                          id="is_mandatory"
                          checked={newTemplate.is_mandatory}
                          onCheckedChange={(checked) => setNewTemplate({ ...newTemplate, is_mandatory: checked })}
                        />
                        <Label htmlFor="is_mandatory">Mandatory Template</Label>
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

              <div className="space-y-4">
                {templates.length === 0 ? (
                  <Card>
                    <CardContent className="p-8 text-center">
                      <p className="text-gray-500">No templates found for this vendor type.</p>
                      <Button className="mt-4" onClick={() => setShowNewTemplateDialog(true)}>
                        Create First Template
                      </Button>
                    </CardContent>
                  </Card>
                ) : (
                  templates.map((template) => (
                    <Card key={template.id}>
                      <CardContent className="p-4">
                        {editingTemplate?.id === template.id ? (
                          <div className="space-y-4">
                            <Input
                              value={editingTemplate.risk_title}
                              onChange={(e) => setEditingTemplate({ ...editingTemplate, risk_title: e.target.value })}
                              placeholder="Risk title"
                            />
                            <Textarea
                              value={editingTemplate.risk_description}
                              onChange={(e) =>
                                setEditingTemplate({ ...editingTemplate, risk_description: e.target.value })
                              }
                              placeholder="Risk description"
                            />
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <Label>Likelihood ({editingTemplate.default_likelihood})</Label>
                                <Slider
                                  value={[editingTemplate.default_likelihood]}
                                  onValueChange={(value) =>
                                    setEditingTemplate({ ...editingTemplate, default_likelihood: value[0] })
                                  }
                                  max={5}
                                  min={1}
                                  step={1}
                                  className="mt-2"
                                />
                              </div>
                              <div>
                                <Label>Impact ({editingTemplate.default_impact})</Label>
                                <Slider
                                  value={[editingTemplate.default_impact]}
                                  onValueChange={(value) =>
                                    setEditingTemplate({ ...editingTemplate, default_impact: value[0] })
                                  }
                                  max={5}
                                  min={1}
                                  step={1}
                                  className="mt-2"
                                />
                              </div>
                            </div>
                            <div className="flex justify-end space-x-2">
                              <Button variant="outline" onClick={() => setEditingTemplate(null)}>
                                <X className="h-4 w-4 mr-2" />
                                Cancel
                              </Button>
                              <Button onClick={() => handleUpdateTemplate(editingTemplate)}>
                                <Save className="h-4 w-4 mr-2" />
                                Save
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <div>
                            <div className="flex justify-between items-start mb-2">
                              <div className="flex-1">
                                <div className="flex items-center space-x-2 mb-1">
                                  <h3 className="font-medium">{template.risk_title}</h3>
                                  {template.is_mandatory && (
                                    <Badge variant="destructive" className="text-xs">
                                      Mandatory
                                    </Badge>
                                  )}
                                </div>
                                <p className="text-sm text-gray-600 mb-2">{template.risk_description}</p>
                                <div className="flex items-center space-x-4 text-sm text-gray-500">
                                  <span>Category: {template.category_name}</span>
                                  <span>
                                    Control: {template.control_catalogue} {template.control_reference}
                                  </span>
                                  <Badge className={getRiskScoreColor(template.default_risk_score)}>
                                    {getRiskScoreLabel(template.default_risk_score)} ({template.default_risk_score})
                                  </Badge>
                                </div>
                              </div>
                              <div className="flex space-x-2">
                                <ActionButtons isTableAction={true}
                                  //onView={() => {}} 
                                  onEdit={() => { setEditingTemplate(template) }}
                                  onDelete={() => handleDeleteTemplate(template.id)}
                                  deleteDialogTitle={template.category_name}
                                actionObj={template}
                                />
                                {/* <Button variant="outline" size="sm" onClick={() => setEditingTemplate(template)}>
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button variant="outline" size="sm" onClick={() => handleDeleteTemplate(template.id)}>
                                  <Trash2 className="h-4 w-4" />
                                </Button> */}
                              </div>
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </div>
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">Select a Vendor Type</h3>
                <p className="text-gray-500">
                  Choose a vendor type from the list to view and manage its risk templates.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
