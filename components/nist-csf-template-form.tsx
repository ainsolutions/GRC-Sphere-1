"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Plus, Trash2, Save, X, Shield, Target, AlertTriangle, AlertCircle } from 'lucide-react'
import {
  getNISTCSFFunctions,
  getNISTCSFCategories,
  getNISTCSFSubcategories,
  createNISTCSFRiskTemplate,
  updateNISTCSFRiskTemplate,
  getNISTCSFImplementationTiers,
} from "@/lib/actions/nist-csf-actions"
import { useToast } from "@/hooks/use-toast"
import { getThreats } from "@/lib/actions/threat-actions"
import { getVulnerabilities } from "@/lib/actions/vulnerability-actions"
import { getAssets } from "@/lib/actions/asset-actions"
import { searchThreats as searchThreatsAction } from "@/lib/actions/threat-actions"

interface NISTCSFTemplateFormProps {
  template?: any
  onSuccess: () => void
  onCancel: () => void
}

export function NISTCSFTemplateForm({ template, onSuccess, onCancel }: NISTCSFTemplateFormProps) {
  const [functions, setFunctions] = useState([])
  const [categories, setCategories] = useState([])
  const [subcategories, setSubcategories] = useState([])
  const [implementationTiers, setImplementationTiers] = useState([])
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState("basic")
  const [databaseConfigured, setDatabaseConfigured] = useState(true)
  const { toast } = useToast()

  // Form state
  const [formData, setFormData] = useState({
    template_name: "",
    risk_description: "",
    function_id: "",
    category_id: "",
    threat_sources: [""],
    vulnerabilities: [""],
    asset_types: [""],
    likelihood_score: 3,
    impact_score: 3,
    risk_level: "Medium",
    nist_references: [""],
    is_active: true,
    controls: [],
    scenarios: [],
  })

  // Threat search state
  const [threatSearchTerm, setThreatSearchTerm] = useState("")
  const [threatSearchResults, setThreatSearchResults] = useState([])
  const [showThreatDropdown, setShowThreatDropdown] = useState(false)
  const [selectedThreatIndex, setSelectedThreatIndex] = useState(-1)

  // Vulnerability search state
  const [vulnerabilitySearchTerm, setVulnerabilitySearchTerm] = useState("")
  const [vulnerabilitySearchResults, setVulnerabilitySearchResults] = useState([])
  const [showVulnerabilityDropdown, setShowVulnerabilityDropdown] = useState(false)
  const [selectedVulnerabilityIndex, setSelectedVulnerabilityIndex] = useState(-1)

  // Asset search state
  const [assetSearchTerm, setAssetSearchTerm] = useState("")
  const [assetSearchResults, setAssetSearchResults] = useState([])
  const [showAssetDropdown, setShowAssetDropdown] = useState(false)
  const [selectedAssetIndex, setSelectedAssetIndex] = useState(-1)

  useEffect(() => {
    fetchInitialData()
    if (template) {
      setFormData({
        template_name: template.template_name || "",
        risk_description: template.risk_description || "",
        function_id: template.function_id?.toString() || "",
        category_id: template.category_id?.toString() || "",
        threat_sources:
          Array.isArray(template.threat_sources) && template.threat_sources.length > 0 ? template.threat_sources : [""],
        vulnerabilities:
          Array.isArray(template.vulnerabilities) && template.vulnerabilities.length > 0
            ? template.vulnerabilities
            : [""],
        asset_types:
          Array.isArray(template.asset_types) && template.asset_types.length > 0 ? template.asset_types : [""],
        likelihood_score: template.default_likelihood || 3,
        impact_score: template.default_impact || 3,
        risk_level: template.risk_level || "Medium",
        nist_references:
          Array.isArray(template.nist_references) && template.nist_references.length > 0
            ? template.nist_references
            : [""],
        is_active: template.is_active !== false,
        controls: template.controls || [],
        scenarios: template.scenarios || [],
      })

      // Load categories if function is selected
      if (template.function_id) {
        fetchCategories(template.function_id.toString())
      }

      // Load subcategories if category is selected
      if (template.category_id) {
        fetchSubcategories(template.category_id.toString())
      }
    }
  }, [template])

  const fetchInitialData = async () => {
    try {
      const [functionsResult, tiersResult] = await Promise.all([getNISTCSFFunctions(), getNISTCSFImplementationTiers()])

      if (functionsResult.success) {
        setFunctions(functionsResult.data)
        setDatabaseConfigured(true)
      } else {
        console.warn("Failed to load NIST CSF functions:", functionsResult.error)
        setFunctions([])
        if (functionsResult.error === "Database not configured") {
          setDatabaseConfigured(false)
        }
      }

      if (tiersResult.success) {
        setImplementationTiers(tiersResult.data)
      } else {
        console.warn("Failed to load implementation tiers:", tiersResult.error)
        setImplementationTiers([])
      }
    } catch (error) {
      console.error("Failed to fetch initial data:", error)
      setDatabaseConfigured(false)
    }
  }

  const fetchCategories = async (functionId: string) => {
    if (!functionId) return

    try {
      const result = await getNISTCSFCategories(Number.parseInt(functionId))
      if (result.success) {
        setCategories(result.data)
      }
    } catch (error) {
      console.error("Failed to fetch categories:", error)
    }
  }

  const fetchSubcategories = async (categoryId: string) => {
    if (!categoryId) return

    try {
      const result = await getNISTCSFSubcategories(Number.parseInt(categoryId))
      if (result.success) {
        setSubcategories(result.data)
      }
    } catch (error) {
      console.error("Failed to fetch subcategories:", error)
    }
  }

  const searchThreats = async (searchTerm: string) => {
    if (searchTerm.length < 2) {
      setThreatSearchResults([])
      setShowThreatDropdown(false)
      return
    }

    try {
      const result = await searchThreatsAction(searchTerm, 10)
      if (result.success) {
        setThreatSearchResults(result.data)
        setShowThreatDropdown(true)
      } else {
        setThreatSearchResults([])
        setShowThreatDropdown(false)
      }
    } catch (error) {
      console.error("Failed to search threats:", error)
      setThreatSearchResults([])
      setShowThreatDropdown(false)
    }
  }

  const searchVulnerabilities = async (searchTerm: string) => {
    if (searchTerm.length < 2) {
      setVulnerabilitySearchResults([])
      setShowVulnerabilityDropdown(false)
      return
    }

    try {
      const result = await getVulnerabilities(searchTerm)
      if (result.success) {
        setVulnerabilitySearchResults(result.data.slice(0, 10)) // Limit to 10 results
        setShowVulnerabilityDropdown(true)
      }
    } catch (error) {
      console.error("Failed to search vulnerabilities:", error)
      setVulnerabilitySearchResults([])
      setShowVulnerabilityDropdown(false)
    }
  }

  const searchAssets = async (searchTerm: string) => {
    if (searchTerm.length < 2) {
      setAssetSearchResults([])
      setShowAssetDropdown(false)
      return
    }

    try {
      const result = await getAssets(searchTerm, 10) // Limit to 10 results
      if (result.success) {
        setAssetSearchResults(result.data)
        setShowAssetDropdown(true)
      }
    } catch (error) {
      console.error("Failed to search assets:", error)
      setAssetSearchResults([])
      setShowAssetDropdown(false)
    }
  }

  const handleThreatSearch = (value: string) => {
    setThreatSearchTerm(value);
    if (value.length >= 2) {
      searchThreats(value);
    } else {
      setThreatSearchResults([]);
      setShowThreatDropdown(false);
    }
  };

  const handleVulnerabilitySearch = (value: string) => {
    setVulnerabilitySearchTerm(value)
    searchVulnerabilities(value)
  }

  const handleAssetSearch = (value: string) => {
    setAssetSearchTerm(value)
    searchAssets(value)
  }

  const selectThreat = (threat: any) => {
    const currentSources = [...formData.threat_sources];
    const lastIndex = currentSources.length - 1;
    
    // Set the selected threat name in the current input
    currentSources[lastIndex] = threat.name;
    
    // Add a new empty field for the next threat
    currentSources.push("");
    
    setFormData({ ...formData, threat_sources: currentSources });
    setThreatSearchTerm("");
    setShowThreatDropdown(false);
    setSelectedThreatIndex(-1);
  };

  const selectVulnerability = (vulnerability: any) => {
    const currentVulnerabilities = [...formData.vulnerabilities]
    if (!currentVulnerabilities.includes(vulnerability.name)) {
      currentVulnerabilities[currentVulnerabilities.length - 1] = vulnerability.name
      setFormData({ ...formData, vulnerabilities: currentVulnerabilities })
    }
    setVulnerabilitySearchTerm("")
    setShowVulnerabilityDropdown(false)
    setSelectedVulnerabilityIndex(-1)
  }

  const selectAsset = (asset: any) => {
    const currentAssetTypes = [...formData.asset_types]
    const assetTypeName = `${asset.asset_type} - ${asset.asset_name}`
    if (!currentAssetTypes.includes(assetTypeName)) {
      currentAssetTypes[currentAssetTypes.length - 1] = assetTypeName
      setFormData({ ...formData, asset_types: currentAssetTypes })
    }
    setAssetSearchTerm("")
    setShowAssetDropdown(false)
    setSelectedAssetIndex(-1)
  }

  const handleThreatKeyDown = (e: React.KeyboardEvent) => {
    if (!showThreatDropdown || threatSearchResults.length === 0) return

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault()
        setSelectedThreatIndex((prev) => (prev < threatSearchResults.length - 1 ? prev + 1 : 0))
        break
      case "ArrowUp":
        e.preventDefault()
        setSelectedThreatIndex((prev) => (prev > 0 ? prev - 1 : threatSearchResults.length - 1))
        break
      case "Enter":
        e.preventDefault()
        if (selectedThreatIndex >= 0) {
          selectThreat(threatSearchResults[selectedThreatIndex])
        }
        break
      case "Escape":
        setShowThreatDropdown(false)
        setSelectedThreatIndex(-1)
        break
    }
  }

  const handleVulnerabilityKeyDown = (e: React.KeyboardEvent) => {
    if (!showVulnerabilityDropdown || vulnerabilitySearchResults.length === 0) return

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault()
        setSelectedVulnerabilityIndex((prev) => (prev < vulnerabilitySearchResults.length - 1 ? prev + 1 : 0))
        break
      case "ArrowUp":
        e.preventDefault()
        setSelectedVulnerabilityIndex((prev) => (prev > 0 ? prev - 1 : vulnerabilitySearchResults.length - 1))
        break
      case "Enter":
        e.preventDefault()
        if (selectedVulnerabilityIndex >= 0) {
          selectVulnerability(vulnerabilitySearchResults[selectedVulnerabilityIndex])
        }
        break
      case "Escape":
        setShowVulnerabilityDropdown(false)
        setSelectedVulnerabilityIndex(-1)
        break
    }
  }

  const handleAssetKeyDown = (e: React.KeyboardEvent) => {
    if (!showAssetDropdown || assetSearchResults.length === 0) return

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault()
        setSelectedAssetIndex((prev) => (prev < assetSearchResults.length - 1 ? prev + 1 : 0))
        break
      case "ArrowUp":
        e.preventDefault()
        setSelectedAssetIndex((prev) => (prev > 0 ? prev - 1 : assetSearchResults.length - 1))
        break
      case "Enter":
        e.preventDefault()
        if (selectedAssetIndex >= 0) {
          selectAsset(assetSearchResults[selectedAssetIndex])
        }
        break
      case "Escape":
        setShowAssetDropdown(false)
        setSelectedAssetIndex(-1)
        break
    }
  }

  const handleFunctionChange = (value: string) => {
    setFormData({ ...formData, function_id: value, category_id: "" })
    setCategories([])
    setSubcategories([])
    fetchCategories(value)
  }

  const handleCategoryChange = (value: string) => {
    setFormData({ ...formData, category_id: value })
    setSubcategories([])
    fetchSubcategories(value)
  }

  const handleArrayFieldChange = (field: string, index: number, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].map((item: string, i: number) => (i === index ? value : item)),
    }))
  }

  const addArrayField = (field: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: [...prev[field], ""],
    }))
  }

  const removeArrayField = (field: string, index: number) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].filter((_: any, i: number) => i !== index),
    }))
  }

  const addControl = () => {
    setFormData((prev) => ({
      ...prev,
      controls: [
        ...prev.controls,
        {
          subcategory_id: "",
          implementation_tier: 1,
          current_maturity: 1,
          target_maturity: 2,
          is_priority: false,
          implementation_notes: "",
        },
      ],
    }))
  }

  const updateControl = (index: number, field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      controls: prev.controls.map((control: any, i: number) =>
        i === index ? { ...control, [field]: value } : control,
      ),
    }))
  }

  const removeControl = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      controls: prev.controls.filter((_: any, i: number) => i !== index),
    }))
  }

  const addScenario = () => {
    setFormData((prev) => ({
      ...prev,
      scenarios: [
        ...prev.scenarios,
        {
          scenario_name: "",
          scenario_description: "",
          threat_actor: "",
          attack_vector: "",
          affected_functions: [],
          likelihood: 3,
          impact: 3,
          mitigation_strategies: "",
        },
      ],
    }))
  }

  const updateScenario = (index: number, field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      scenarios: prev.scenarios.map((scenario: any, i: number) =>
        i === index ? { ...scenario, [field]: value } : scenario,
      ),
    }))
  }

  const removeScenario = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      scenarios: prev.scenarios.filter((_: any, i: number) => i !== index),
    }))
  }

  const calculateRiskLevel = (likelihood: number, impact: number) => {
    const score = likelihood * impact
    if (score >= 20) return "Critical"
    if (score >= 15) return "High"
    if (score >= 10) return "Medium"
    if (score >= 5) return "Low"
    return "Very Low"
  }

  const handleLikelihoodImpactChange = (field: string, value: number) => {
    const newFormData = { ...formData, [field]: value }
    const riskLevel = calculateRiskLevel(
      field === "likelihood_score" ? value : formData.likelihood_score,
      field === "impact_score" ? value : formData.impact_score,
    )
    setFormData({ ...newFormData, risk_level: riskLevel })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const cleanedData = {
        ...formData,
        threat_sources: formData.threat_sources.filter((t) => t.trim() !== ""),
        vulnerabilities: formData.vulnerabilities.filter((v) => v.trim() !== ""),
        asset_types: formData.asset_types.filter((a) => a.trim() !== ""),
        nist_references: formData.nist_references.filter((r) => r.trim() !== ""),
        function_id: Number.parseInt(formData.function_id),
        category_id: formData.category_id ? Number.parseInt(formData.category_id) : null,
        controls: formData.controls.filter((c: any) => c.subcategory_id !== ""),
      }

      let result
      if (template?.id) {
        // Update existing template
        result = await updateNISTCSFRiskTemplate(template.id, cleanedData)
      } else {
        // Create new template
        result = await createNISTCSFRiskTemplate(cleanedData)
      }

      if (result.success) {
        toast({
          title: "Success",
          description: `NIST CSF template ${template?.id ? "updated" : "created"} successfully`,
        })
        onSuccess()
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
        description: `Failed to ${template?.id ? "update" : "create"} NIST CSF template`,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const getRiskLevelColor = (level: string) => {
    switch (level) {
      case "Critical":
        return "bg-red-600 text-white"
      case "High":
        return "bg-orange-500 text-white"
      case "Medium":
        return "bg-yellow-500 text-white"
      case "Low":
        return "bg-blue-500 text-white"
      default:
        return "bg-green-500 text-white"
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "Critical":
        return "bg-red-600 text-white"
      case "High":
        return "bg-orange-500 text-white"
      case "Medium":
        return "bg-yellow-500 text-white"
      case "Low":
        return "bg-blue-500 text-white"
      case "Informational":
        return "bg-gray-500 text-white"
      default:
        return "bg-gray-500 text-white"
    }
  }

  const getClassificationColor = (classification: string) => {
    switch (classification) {
      case "Top Secret":
        return "bg-red-600 text-white"
      case "Secret":
        return "bg-orange-500 text-white"
      case "Confidential":
        return "bg-yellow-500 text-white"
      case "Internal":
        return "bg-blue-500 text-white"
      case "Public":
        return "bg-green-500 text-white"
      default:
        return "bg-gray-500 text-white"
    }
  }

  const getTierColor = (tier: number) => {
    switch (tier) {
      case 1:
        return "bg-red-100 text-red-800"
      case 2:
        return "bg-yellow-100 text-yellow-800"
      case 3:
        return "bg-blue-100 text-blue-800"
      case 4:
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  if (!databaseConfigured) {
    return (
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-yellow-500" />
            Database Configuration Required
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <AlertCircle className="mx-auto h-12 w-12 text-yellow-500 mb-4" />
            <p className="text-muted-foreground mb-4">
              Please configure your database connection to use the NIST CSF template features.
            </p>
            <p className="text-sm text-muted-foreground">
              Add your database connection string to the environment variables and restart the application.
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="basic">Basic Info</TabsTrigger>
          <TabsTrigger value="details">Risk Details</TabsTrigger>
          <TabsTrigger value="controls">NIST Controls</TabsTrigger>
          <TabsTrigger value="scenarios">Scenarios</TabsTrigger>
        </TabsList>

        <TabsContent value="basic" className="space-y-4">
          <Card className="bg-slate-900/50 border-slate-700 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-blue-600" />
                NIST CSF Template Information
              </CardTitle>
              <CardDescription>Create risk templates aligned with NIST Cybersecurity Framework 2.0</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="template_name">Template Name *</Label>
                  <Input
                    id="template_name"
                    value={formData.template_name}
                    onChange={(e) => setFormData({ ...formData, template_name: e.target.value })}
                    placeholder="e.g., Identity Management Risk"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="function_id">NIST CSF Function *</Label>
                  <Select value={formData.function_id} onValueChange={handleFunctionChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select NIST CSF function" />
                    </SelectTrigger>
                    <SelectContent>
                      {functions.map((func: any) => (
                        <SelectItem key={func.id} value={func.id.toString()}>
                          <div className="flex flex-col">
                            <span className="font-medium">
                              {func.function_code} - {func.function_name}
                            </span>
                            <span className="text-sm text-muted-foreground">{func.function_description}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {formData.function_id && (
                <div className="space-y-2">
                  <Label htmlFor="category_id">NIST CSF Category</Label>
                  <Select value={formData.category_id} onValueChange={handleCategoryChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select NIST CSF category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category: any) => (
                        <SelectItem key={category.id} value={category.id.toString()}>
                          <div className="flex flex-col">
                            <span className="font-medium">
                              {category.category_code} - {category.category_name}
                            </span>
                            <span className="text-sm text-muted-foreground">{category.category_description}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="risk_description">Risk Description *</Label>
                <Textarea
                  id="risk_description"
                  value={formData.risk_description}
                  onChange={(e) => setFormData({ ...formData, risk_description: e.target.value })}
                  placeholder="Detailed description of the cybersecurity risk..."
                  rows={4}
                  required
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Default Likelihood (1-5) *</Label>
                  <Select
                    value={formData.likelihood_score.toString()}
                    onValueChange={(value) => handleLikelihoodImpactChange("likelihood_score", Number.parseInt(value))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 - Very Low</SelectItem>
                      <SelectItem value="2">2 - Low</SelectItem>
                      <SelectItem value="3">3 - Medium</SelectItem>
                      <SelectItem value="4">4 - High</SelectItem>
                      <SelectItem value="5">5 - Very High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Default Impact (1-5) *</Label>
                  <Select
                    value={formData.impact_score.toString()}
                    onValueChange={(value) => handleLikelihoodImpactChange("impact_score", Number.parseInt(value))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 - Very Low</SelectItem>
                      <SelectItem value="2">2 - Low</SelectItem>
                      <SelectItem value="3">3 - Medium</SelectItem>
                      <SelectItem value="4">4 - High</SelectItem>
                      <SelectItem value="5">5 - Very High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Risk Level</Label>
                  <div className="flex items-center space-x-2">
                    <Badge className={getRiskLevelColor(formData.risk_level)}>{formData.risk_level}</Badge>
                    <span className="text-sm text-muted-foreground">
                      Score: {formData.likelihood_score * formData.impact_score}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="is_active"
                  checked={formData.is_active}
                  onCheckedChange={(checked) => setFormData({ ...formData, is_active: !!checked })}
                />
                <Label htmlFor="is_active">Template is active</Label>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="details" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card key="threat_sources">
              <CardHeader>
                <CardTitle className="text-sm flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4" />
                  Threat Sources
                </CardTitle>
                <CardDescription>Add multiple threat sources with real-time search from database</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                {formData.threat_sources.map((item: string, index: number) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <div className="relative flex-1">
                        <Input
                          value={item}
                          onChange={(e) => {
                            const value = e.target.value;
                            handleArrayFieldChange("threat_sources", index, value);
                            
                            // Only trigger search for the last (active) input
                            if (index === formData.threat_sources.length - 1) {
                              handleThreatSearch(value);
                            }
                          }}
                          onKeyDown={(e) => {
                            if (index === formData.threat_sources.length - 1) {
                              handleThreatKeyDown(e);
                            }
                          }}
                          onFocus={() => {
                            if (index === formData.threat_sources.length - 1 && item.length >= 2) {
                              searchThreats(item);
                            }
                          }}
                          onBlur={() => {
                            // Delay hiding dropdown to allow for clicks
                            setTimeout(() => {
                              setShowThreatDropdown(false);
                              setSelectedThreatIndex(-1);
                            }, 200);
                          }}
                          placeholder="e.g., Nation-state actors (type to search existing threats)"
                          className="flex-1"
                        />
                        {index === formData.threat_sources.length - 1 &&
                          showThreatDropdown &&
                          threatSearchResults.length > 0 && (
                            <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-auto">
                              {threatSearchResults.map((threat: any, threatIndex) => (
                                <div
                                  key={threat.id}
                                  className={`px-3 py-2 cursor-pointer hover:bg-gray-100 border-b border-gray-100 last:border-b-0 ${
                                    selectedThreatIndex === threatIndex ? "bg-blue-50 border-blue-200" : ""
                                  }`}
                                  onClick={() => selectThreat(threat)}
                                >
                                  <div className="flex flex-col">
                                    <span className="font-medium text-sm">{threat.name}</span>
                                    <span className="text-xs text-gray-500 truncate">{threat.description}</span>
                                    <div className="flex items-center gap-2 mt-1">
                                      <Badge variant="outline" className="text-xs">
                                        {threat.category || "Uncategorized"}
                                      </Badge>
                                      <Badge
                                        variant="outline"
                                        className={`text-xs ${
                                          threat.threat_level === "Critical"
                                            ? "border-red-500 text-red-700"
                                            : threat.threat_level === "High"
                                              ? "border-orange-500 text-orange-700"
                                              : threat.threat_level === "Medium"
                                                ? "border-yellow-500 text-yellow-700"
                                                : "border-green-500 text-green-700"
                                        }`}
                                      >
                                        {threat.threat_level || "Unknown"}
                                      </Badge>
                                    </div>
                                  </div>
                                </div>
                              ))}
                              {threatSearchResults.length === 10 && (
                                <div className="px-3 py-2 text-xs text-gray-500 text-center border-t">
                                  Showing first 10 results. Refine search for more specific results.
                                </div>
                              )}
                            </div>
                          )}
                      </div>
                      {formData.threat_sources.length > 1 && (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => removeArrayField("threat_sources", index)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
                <Button type="button" variant="outline" size="sm" onClick={() => addArrayField("threat_sources")}>
                  <Plus className="h-4 w-4 mr-1" />
                  Add Threat Source
                </Button>
              </CardContent>
            </Card>

            <Card key="vulnerabilities">
              <CardHeader>
                <CardTitle className="text-sm flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  Vulnerabilities
                </CardTitle>
              <CardDescription>Add multiple vulnerabilities with search assistance</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                {formData.vulnerabilities.map((item: string, index: number) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <div className="relative flex-1">
                        <Input
                          value={index === formData.vulnerabilities.length - 1 ? vulnerabilitySearchTerm || item : item}
                          onChange={(e) => {
                            if (index === formData.vulnerabilities.length - 1) {
                              handleVulnerabilitySearch(e.target.value)
                            } else {
                              handleArrayFieldChange("vulnerabilities", index, e.target.value)
                            }
                          }}
                          onKeyDown={
                            index === formData.vulnerabilities.length - 1 ? handleVulnerabilityKeyDown : undefined
                          }
                          onFocus={() => {
                            if (index === formData.vulnerabilities.length - 1 && vulnerabilitySearchTerm.length >= 2) {
                              setShowVulnerabilityDropdown(true)
                            }
                          }}
                          onBlur={() => {
                            // Delay hiding dropdown to allow for clicks
                            setTimeout(() => setShowVulnerabilityDropdown(false), 200)
                          }}
                          placeholder="e.g., SQL Injection (type to search existing vulnerabilities)"
                          className="flex-1"
                        />
                        {index === formData.vulnerabilities.length - 1 &&
                          showVulnerabilityDropdown &&
                          vulnerabilitySearchResults.length > 0 && (
                            <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-auto">
                              {vulnerabilitySearchResults.map((vulnerability: any, vulnIndex) => (
                                <div
                                  key={vulnerability.id}
                                  className={`px-3 py-2 cursor-pointer hover:bg-gray-100 border-b border-gray-100 last:border-b-0 ${
                                    selectedVulnerabilityIndex === vulnIndex ? "bg-blue-50 border-blue-200" : ""
                                  }`}
                                  onClick={() => selectVulnerability(vulnerability)}
                                >
                                  <div className="flex flex-col">
                                    <span className="font-medium text-sm">{vulnerability.name}</span>
                                    <span className="text-xs text-gray-500 truncate">{vulnerability.description}</span>
                                    <div className="flex items-center gap-2 mt-1">
                                      <Badge variant="outline" className="text-xs">
                                        {vulnerability.category || "Uncategorized"}
                                      </Badge>
                                      <Badge className={`text-xs ${getSeverityColor(vulnerability.severity)}`}>
                                        {vulnerability.severity || "Unknown"}
                                      </Badge>
                                      {vulnerability.cvss_score && (
                                        <Badge variant="outline" className="text-xs">
                                          CVSS: {vulnerability.cvss_score}
                                        </Badge>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              ))}
                              {vulnerabilitySearchResults.length === 10 && (
                                <div className="px-3 py-2 text-xs text-gray-500 text-center border-t">
                                  Showing first 10 results. Refine search for more specific results.
                                </div>
                              )}
                            </div>
                          )}
                      </div>
                      {formData.vulnerabilities.length > 1 && (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => removeArrayField("vulnerabilities", index)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
                <Button type="button" variant="outline" size="sm" onClick={() => addArrayField("vulnerabilities")}>
                  <Plus className="h-4 w-4 mr-1" />
                  Add Vulnerability
                </Button>
              </CardContent>
            </Card>

            <Card key="asset_types">
              <CardHeader>
                <CardTitle className="text-sm flex items-center gap-2">
                  <Target className="h-4 w-4" />
                  Asset Types
                </CardTitle>
                <CardDescription>Add multiple asset types with search assistance</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                {formData.asset_types.map((item: string, index: number) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <div className="relative flex-1">
                        <Input
                          value={index === formData.asset_types.length - 1 ? assetSearchTerm || item : item}
                          onChange={(e) => {
                            if (index === formData.asset_types.length - 1) {
                              handleAssetSearch(e.target.value)
                            } else {
                              handleArrayFieldChange("asset_types", index, e.target.value)
                            }
                          }}
                          onKeyDown={index === formData.asset_types.length - 1 ? handleAssetKeyDown : undefined}
                          onFocus={() => {
                            if (index === formData.asset_types.length - 1 && assetSearchTerm.length >= 2) {
                              setShowAssetDropdown(true)
                            }
                          }}
                          onBlur={() => {
                            // Delay hiding dropdown to allow for clicks
                            setTimeout(() => setShowAssetDropdown(false), 200)
                          }}
                          placeholder="e.g., Database Server (type to search existing assets)"
                          className="flex-1"
                        />
                        {index === formData.asset_types.length - 1 &&
                          showAssetDropdown &&
                          assetSearchResults.length > 0 && (
                            <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-auto">
                              {assetSearchResults.map((asset: any, assetIndex) => (
                                <div
                                  key={asset.id}
                                  className={`px-3 py-2 cursor-pointer hover:bg-gray-100 border-b border-gray-100 last:border-b-0 ${
                                    selectedAssetIndex === assetIndex ? "bg-blue-50 border-blue-200" : ""
                                  }`}
                                  onClick={() => selectAsset(asset)}
                                >
                                  <div className="flex flex-col">
                                    <span className="font-medium text-sm">{asset.asset_name}</span>
                                    <span className="text-xs text-gray-500 truncate">
                                      {asset.description || "No description"}
                                    </span>
                                    <div className="flex items-center gap-2 mt-1">
                                      <Badge variant="outline" className="text-xs">
                                        {asset.asset_type || "Unknown Type"}
                                      </Badge>
                                      <Badge className={`text-xs ${getClassificationColor(asset.classification)}`}>
                                        {asset.classification || "Unclassified"}
                                      </Badge>
                                      {asset.owner && (
                                        <Badge variant="outline" className="text-xs">
                                          Owner: {asset.owner}
                                        </Badge>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              ))}
                              {assetSearchResults.length === 10 && (
                                <div className="px-3 py-2 text-xs text-gray-500 text-center border-t">
                                  Showing first 10 results. Refine search for more specific results.
                                </div>
                              )}
                            </div>
                          )}
                      </div>
                      {formData.asset_types.length > 1 && (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => removeArrayField("asset_types", index)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
                <Button type="button" variant="outline" size="sm" onClick={() => addArrayField("asset_types")}>
                  <Plus className="h-4 w-4 mr-1" />
                  Add Asset Type
                </Button>
              </CardContent>
            </Card>

            {[{ field: "nist_references", label: "NIST References", icon: Shield }].map(
              ({ field, label, icon: Icon }) => (
                <Card key={field}>
                  <CardHeader>
                    <CardTitle className="text-sm flex items-center gap-2">
                      <Icon className="h-4 w-4" />
                      {label}
                    </CardTitle>
                    <CardDescription>Add multiple {label.toLowerCase()}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {formData[field].map((item: string, index: number) => (
                      <div key={index} className="flex items-center space-x-2">
                        <Input
                          value={item}
                          onChange={(e) => handleArrayFieldChange(field, index, e.target.value)}
                          placeholder={`e.g., ${label.includes("Asset") ? "Critical databases" : "NIST CSF PR.AC-01"}`}
                          className="flex-1"
                        />
                        {formData[field].length > 1 && (
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => removeArrayField(field, index)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    ))}
                    <Button type="button" variant="outline" size="sm" onClick={() => addArrayField(field)}>
                      <Plus className="h-4 w-4 mr-1" />
                      Add {label.replace(" Types", "")}
                    </Button>
                  </CardContent>
                </Card>
              ),
            )}
          </div>
        </TabsContent>

        <TabsContent value="controls" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-blue-600" />
                NIST CSF Controls & Subcategories
              </CardTitle>
              <CardDescription>
                Map relevant NIST CSF subcategories and define implementation tiers and maturity levels.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {formData.controls.map((control: any, index) => (
                <div key={index} className="p-4 border rounded-lg space-y-4 bg-gray-50">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium flex items-center gap-2">
                      <Shield className="h-4 w-4" />
                      Control {index + 1}
                    </h4>
                    <Button type="button" variant="outline" size="sm" onClick={() => removeControl(index)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="space-y-2">
                    <Label>NIST CSF Subcategory *</Label>
                    <Select
                      value={control.subcategory_id}
                      onValueChange={(value) => updateControl(index, "subcategory_id", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select NIST CSF subcategory" />
                      </SelectTrigger>
                      <SelectContent>
                        {subcategories.map((subcategory: any) => (
                          <SelectItem key={subcategory.id} value={subcategory.id.toString()}>
                            <div className="flex flex-col">
                              <span className="font-medium">{subcategory.subcategory_code}</span>
                              <span className="text-sm text-muted-foreground">{subcategory.subcategory_name}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label>Implementation Tier (1-4)</Label>
                      <Select
                        value={control.implementation_tier.toString()}
                        onValueChange={(value) => updateControl(index, "implementation_tier", Number.parseInt(value))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {implementationTiers.map((tier: any) => (
                            <SelectItem key={tier.tier_level} value={tier.tier_level.toString()}>
                              <div className="flex items-center gap-2">
                                <Badge className={getTierColor(tier.tier_level)}>Tier {tier.tier_level}</Badge>
                                <span>{tier.tier_name}</span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Current Maturity (1-4)</Label>
                      <Select
                        value={control.current_maturity.toString()}
                        onValueChange={(value) => updateControl(index, "current_maturity", Number.parseInt(value))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">1 - Initial</SelectItem>
                          <SelectItem value="2">2 - Developing</SelectItem>
                          <SelectItem value="3">3 - Defined</SelectItem>
                          <SelectItem value="4">4 - Optimized</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Target Maturity (1-4)</Label>
                      <Select
                        value={control.target_maturity.toString()}
                        onValueChange={(value) => updateControl(index, "target_maturity", Number.parseInt(value))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">1 - Initial</SelectItem>
                          <SelectItem value="2">2 - Developing</SelectItem>
                          <SelectItem value="3">3 - Defined</SelectItem>
                          <SelectItem value="4">4 - Optimized</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id={`is_priority_${index}`}
                        checked={control.is_priority}
                        onCheckedChange={(checked) => updateControl(index, "is_priority", !!checked)}
                      />
                      <Label htmlFor={`is_priority_${index}`}>Priority control</Label>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`implementation_notes_${index}`}>Implementation Notes</Label>
                    <Textarea
                      id={`implementation_notes_${index}`}
                      value={control.implementation_notes}
                      onChange={(e) => updateControl(index, "implementation_notes", e.target.value)}
                      placeholder="Implementation guidance, responsible parties, timelines, etc."
                      rows={3}
                    />
                  </div>
                </div>
              ))}
              <Button type="button" variant="outline" size="sm" onClick={addControl}>
                <Plus className="h-4 w-4 mr-1" />
                Add Control
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="scenarios" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-blue-600" />
                Risk Scenarios
              </CardTitle>
              <CardDescription>
                Define specific cybersecurity risk scenarios aligned with NIST CSF functions.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {formData.scenarios.map((scenario: any, index) => (
                <div key={index} className="p-4 border rounded-lg space-y-4 bg-gray-50">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium flex items-center gap-2">
                      <Target className="h-4 w-4" />
                      Scenario {index + 1}
                    </h4>
                    <Button type="button" variant="outline" size="sm" onClick={() => removeScenario(index)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor={`scenario_name_${index}`}>Scenario Name *</Label>
                      <Input
                        id={`scenario_name_${index}`}
                        value={scenario.scenario_name}
                        onChange={(e) => updateScenario(index, "scenario_name", e.target.value)}
                        placeholder="e.g., Ransomware attack on critical systems"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor={`threat_actor_${index}`}>Threat Actor</Label>
                      <Input
                        id={`threat_actor_${index}`}
                        value={scenario.threat_actor}
                        onChange={(e) => updateScenario(index, "threat_actor", e.target.value)}
                        placeholder="e.g., Cybercriminal group, nation-state"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`scenario_description_${index}`}>Scenario Description *</Label>
                    <Textarea
                      id={`scenario_description_${index}`}
                      value={scenario.scenario_description}
                      onChange={(e) => updateScenario(index, "scenario_description", e.target.value)}
                      placeholder="Detailed description of the cybersecurity scenario and its potential impact..."
                      rows={3}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`attack_vector_${index}`}>Attack Vector</Label>
                    <Input
                      id={`attack_vector_${index}`}
                      value={scenario.attack_vector}
                      onChange={(e) => updateScenario(index, "attack_vector", e.target.value)}
                      placeholder="e.g., Phishing email, supply chain compromise"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor={`likelihood_${index}`}>Likelihood (1-5) *</Label>
                      <Select
                        value={scenario.likelihood.toString()}
                        onChange={(e) => updateScenario(index, "likelihood", Number.parseInt(e.target.value))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">1 - Very Low</SelectItem>
                          <SelectItem value="2">2 - Low</SelectItem>
                          <SelectItem value="3">3 - Medium</SelectItem>
                          <SelectItem value="4">4 - High</SelectItem>
                          <SelectItem value="5">5 - Very High</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor={`impact_${index}`}>Impact (1-5) *</Label>
                      <Select
                        value={scenario.impact.toString()}
                        onChange={(e) => updateScenario(index, "impact", Number.parseInt(e.target.value))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">1 - Very Low</SelectItem>
                          <SelectItem value="2">2 - Low</SelectItem>
                          <SelectItem value="3">3 - Medium</SelectItem>
                          <SelectItem value="4">4 - High</SelectItem>
                          <SelectItem value="5">5 - Very High</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`mitigation_strategies_${index}`}>Mitigation Strategies</Label>
                    <Textarea
                      id={`mitigation_strategies_${index}`}
                      value={scenario.mitigation_strategies}
                      onChange={(e) => updateScenario(index, "mitigation_strategies", e.target.value)}
                      placeholder="Recommended mitigation strategies and controls..."
                      rows={3}
                    />
                  </div>
                </div>
              ))}
              <Button type="button" variant="outline" size="sm" onClick={addScenario}>
                <Plus className="h-4 w-4 mr-1" />
                Add Scenario
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          <X className="h-4 w-4 mr-2" />
          Cancel
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? (
            <>
              <svg className="animate-spin h-4 w-4 mr-2" viewBox="0 0 24 24">
                <path fill="currentColor" d="M12,4V2A10,10 0 0,0 2,12H4A8,8 0 0,1 12,4Z" />
              </svg>
              {template?.id ? "Updating..." : "Saving..."}
            </>
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
              {template?.id ? "Update NIST CSF Template" : "Save NIST CSF Template"}
            </>
          )}
        </Button>
      </div>
    </form>
  )
}
