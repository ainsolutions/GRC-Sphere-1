"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { createAsset, updateAsset } from "@/lib/actions/asset-actions"
import { Save, X, Shield, Database, MapPin, Target } from "lucide-react"
import OwnerSelectInput from "@/components/owner-search-input"
import DepartmentSelectInput from "@/components/department-search-input"

interface AssetFormProps {
  asset?: any
  onSuccess: () => void
  onCancel: () => void
}


export function AssetForm({ asset, onSuccess, onCancel }: AssetFormProps) {
  const [formData, setFormData] = useState({
    asset_id: `AST-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
    asset_name: "",
    asset_type: "",
    custodian: "",
    department: "",
    retention_period: "",
    disposal_method: "",
    ip_address: "",
    model_version: "",
    classification: "",
    owner: "",
    business_value: "",
    confidentiality_level: "1",
    integrity_level: "1",
    availability_level: "1",
    description: "",
    location: "",
  })

  
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    if (!asset || Object.keys(asset).length === 0) return;
    
      setFormData({
        asset_id: asset.asset_id || `AST-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
        asset_name: asset.asset_name || "",
        asset_type: asset.asset_type || "",
        custodian: asset.custodian || "",
        department: asset.department || "",
        retention_period: asset.retention_period || "",
        disposal_method: asset.disposal_method || "",
        ip_address: asset.ip_address || "",
        model_version: asset.model_version || "",
        classification: asset.classification || "",
        owner: asset.owner || "",
        business_value: asset.business_value || "",
        confidentiality_level: asset.confidentiality_level?.toString() || "1",
        integrity_level: asset.integrity_level?.toString() || "1",
        availability_level: asset.availability_level?.toString() || "1",
        description: asset.description || "",
        location: asset.location || "",
      })
    
  }, [asset])

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const regenerateAssetId = () => {
    setFormData((prev) => ({
      ...prev,
      asset_id: `AST-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const result = asset ? await updateAsset(asset.id, formData) : await createAsset(formData)

      if (result.success) {
        toast({
          title: "Success",
          description: `Asset ${asset ? "updated" : "created"} successfully${!asset ? ` with ID: ${result.data.asset_id}` : ""}`,
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
        description: `Failed to ${asset ? "update" : "create"} asset`,
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const getClassificationColor = (classification: string) => {
    switch (classification) {
      case "Restricted":
        return "text-red-500"
      case "Confidential":
        return "text-orange-900"
      case "Internal":
        return "text-purple-900"
      default:
        return "text-blue-900"
    }
  }

  const getCIALevelColor = (level: string) => {
    const numLevel = Number.parseInt(level)
    if (numLevel >= 5) return "text-red-700"
    if (numLevel >= 4) return "text-orange-500"
    if (numLevel >= 3) return "text-yellow-500"
    if (numLevel >= 2) return "text-purple-500"
    return "text-blue-500"
  }


  

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Tabs defaultValue="basic" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="basic" className="flex items-center gap-2">
            <Database className="h-4 w-4" />
            Basic Info
          </TabsTrigger>
          <TabsTrigger value="classification" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Classification
          </TabsTrigger>
          <TabsTrigger value="details" className="flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            Details
          </TabsTrigger>
        </TabsList>

        <TabsContent value="basic" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                Asset Information
              </CardTitle>
              <CardDescription>Basic information about the asset</CardDescription>
              {asset && (
                <div className="mt-2">
                  <Badge variant="outline" className="text-sm font-mono">
                    Asset ID: {asset.asset_id}
                  </Badge>
                </div>
              )}
            </CardHeader>
            <CardContent className="space-y-4">
            {!asset && (<div className="space-y-2">
                <Label htmlFor="asset_id">Asset ID</Label>
                <div className="flex gap-2 items-center">
                  <Input
                    id="asset_id"
                    value={formData.asset_id}
                    onChange={(e) => handleInputChange("asset_id", e.target.value)}
                    placeholder="AST-XXXXXX"
                    className="font-mono"
                    required
                  />
                  {/* {!asset && ( */}
                    <Button
                      type="button"
                      size="sm"
                      onClick={regenerateAssetId}
                    >
                      Generate New
                    </Button>
                  {/* )} */}
                </div>
                <p className="text-sm text-muted-foreground">Unique identifier for this asset (format: AST-XXXXXX)</p>
              </div>
            )}
              

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="asset_name">Asset Name *</Label>
                  <Input
                    id="asset_name"
                    value={formData.asset_name}
                    onChange={(e) => handleInputChange("asset_name", e.target.value)}
                    placeholder="Enter asset name"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="asset_type">Asset Type * </Label>
                  <Select value={formData.asset_type} onValueChange={(value) => { handleInputChange("asset_type", value)}}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select asset type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Hardware">Hardware</SelectItem>
                      <SelectItem value="Software">Software</SelectItem>
                      <SelectItem value="Data">Data</SelectItem>
                      <SelectItem value="Network">Network</SelectItem>
                      <SelectItem value="Personnel">Personnel</SelectItem>
                      <SelectItem value="Physical">Physical</SelectItem>
                      <SelectItem value="Service">Service</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

             

              <div className="space-y-2">
                <Label htmlFor="custodian">Custodian Department</Label>
                <DepartmentSelectInput 
                  formData={formData} 
                  setFormData={setFormData} 
                  fieldName="custodian"
                  onDepartmentSelected={(custodian) => {
                    // Update form data with selected department name
                    setFormData({
                      ...formData,
                      department: department.name
                    });
                  }}
                />
                <p className="text-sm text-muted-foreground">
                  Search and select department from the organization
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="department">Department Owner</Label>
                <DepartmentSelectInput 
                  formData={formData} 
                  setFormData={setFormData} 
                  fieldName="department"
                  onDepartmentSelected={(department) => {
                    // Update form data with selected department name
                    setFormData({
                      ...formData,
                      department: department.name
                    });
                  }}
                />
                <p className="text-sm text-muted-foreground">
                  Search and select department from the organization
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="retention_period">Retention Period</Label>
                <Input
                  id="retention_period"
                  value={formData.retention_period}
                  onChange={(e) => handleInputChange("retention_period", e.target.value)}
                  placeholder="Enter retention period in years"
                />
              </div>
              <div className="space-y-2">
                  <Label htmlFor="disposal_method">Disposal Method </Label>
                  <Select value={formData.disposal_method} onValueChange={(value) => handleInputChange("disposal_method", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select disposal method" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Destroy">Cloud Data Deletion</SelectItem>
                      <SelectItem value="Sell">Cryptographic Data Destruction</SelectItem>
                      <SelectItem value="Recycle">Physical Data Destruction</SelectItem>
                      <SelectItem value="Donate">Shredding</SelectItem>
                      <SelectItem value="Other">Data Degaussing</SelectItem>
                      <SelectItem value="Physical">Reformatting</SelectItem>
                      <SelectItem value="Service">Secure Erasure</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>

              </div>

              <div className="space-y-2">
                  <Label htmlFor="model_version">Model/Version</Label>
                <Input
                  id="model_version"
                  value={formData.model_version}
                  onChange={(e) => handleInputChange("model_version", e.target.value)}
                  placeholder="e.g., Windows Server 2022, Cisco ASA 5506, v2.1.0"
                />
                <p className="text-sm text-muted-foreground">Specify the model, version, or specific configuration of this asset</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div id="divAssetOwner" className="space-y-2">
                  <Label htmlFor="owner">Custodian Owner *</Label>
                  <OwnerSelectInput formData={formData} setFormData={setFormData} fieldName='owner'/>
                </div>
                {/* <div id="idAssetOwner" className="space-y-2">
                  <Label htmlFor="owner">Asset Owner *</Label>
                  <Input
                    id="owner"
                    value={formData.owner}
                    onChange={(e) => { 
                      handleInputChange("owner", e.target.value)
                      handleOwnerSearch(e.target.value)

                    }}
                    placeholder="Enter asset owner"
                    required
                  />
                </div> */}
                <div className="space-y-2">
                  <Label htmlFor="business_value">Business Value *</Label>
                  <Select
                    value={formData.business_value}
                    onValueChange={(value) => handleInputChange("business_value", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select business value" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Critical">Critical</SelectItem>
                      <SelectItem value="High">High</SelectItem>
                      <SelectItem value="Medium">Medium</SelectItem>
                      <SelectItem value="Low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="classification" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Security Classification
              </CardTitle>
              <CardDescription>Define the security classification and CIA ratings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="classification">Data Classification *</Label>
                <Select
                  value={formData.classification}
                  onValueChange={(value) => handleInputChange("classification", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select classification" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Public">Public</SelectItem>
                    <SelectItem value="Internal">Internal</SelectItem>
                    <SelectItem value="Confidential">Confidential</SelectItem>
                    <SelectItem value="Restricted">Restricted</SelectItem>
                  </SelectContent>
                </Select>
                {formData.classification && (
                  <Badge variant="outline" className={getClassificationColor(formData.classification)}>{formData.classification}</Badge>
                )}
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="confidentiality_level">Confidentiality</Label>
                  <Select
                    value={formData.confidentiality_level}
                    onValueChange={(value) => handleInputChange("confidentiality_level", value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 - Low</SelectItem>
                      <SelectItem value="2">2 - Medium</SelectItem>
                      <SelectItem value="3">3 - High</SelectItem>
                      <SelectItem value="4">4 - Very High</SelectItem>
                      <SelectItem value="5">5 - Critical</SelectItem>
                    </SelectContent>
                  </Select>
                  <Badge variant="outline" className={getCIALevelColor(formData.confidentiality_level)}>
                    Level {formData.confidentiality_level}
                  </Badge>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="integrity_level">Integrity</Label>
                  <Select
                    value={formData.integrity_level}
                    onValueChange={(value) => handleInputChange("integrity_level", value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 - Low</SelectItem>
                      <SelectItem value="2">2 - Medium</SelectItem>
                      <SelectItem value="3">3 - High</SelectItem>
                      <SelectItem value="4">4 - Very High</SelectItem>
                      <SelectItem value="5">5 - Critical</SelectItem>
                    </SelectContent>
                  </Select>
                  <Badge variant="outline" className={getCIALevelColor(formData.integrity_level)}>Level {formData.integrity_level}</Badge>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="availability_level">Availability</Label>
                  <Select
                    value={formData.availability_level}
                    onValueChange={(value) => handleInputChange("availability_level", value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 - Low</SelectItem>
                      <SelectItem value="2">2 - Medium</SelectItem>
                      <SelectItem value="3">3 - High</SelectItem>
                      <SelectItem value="4">4 - Very High</SelectItem>
                      <SelectItem value="5">5 - Critical</SelectItem>
                    </SelectContent>
                  </Select>
                  <Badge variant="outline" className={getCIALevelColor(formData.availability_level)}>
                    Level {formData.availability_level}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="details" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Additional Details
              </CardTitle>
              <CardDescription>Additional information about the asset</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => handleInputChange("location", e.target.value)}
                    placeholder="Enter asset location"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ip_address">IP Address</Label>
                  <Input
                    id="ip_address"
                    value={formData.ip_address}
                    onChange={(e) => handleInputChange("ip_address", e.target.value)}
                    placeholder="e.g., 192.168.1.100"
                    pattern="^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$"
                    title="Please enter a valid IP address (e.g., 192.168.1.100)"
                  />
                  <p className="text-sm text-muted-foreground">IP address for network assets, servers, or devices</p>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                  placeholder="Enter asset description"
                  rows={4}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end space-x-2 pt-4 border-t">
        <Button type="button" onClick={onCancel} disabled={isSubmitting}>
          <X className="mr-2 h-4 w-4" />
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={isSubmitting}
        >
          <Save className="mr-2 h-4 w-4" />
          {isSubmitting ? "Saving..." : asset ? "Update Asset" : "Create Asset"}
        </Button>
      </div>
    </form>
  )
}
