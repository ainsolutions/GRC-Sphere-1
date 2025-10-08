"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"

interface Vendor {
  id: number
  vendor_name: string
  vendor_type: string
  contact_person: string
  contact_email: string
}

interface ContractFormProps {
  contract?: any
  onSubmit: (data: any) => void
  onCancel: () => void
  isLoading?: boolean
}

export function ContractForm({ contract, onSubmit, onCancel, isLoading = false }: ContractFormProps) {
  const [formData, setFormData] = useState({
    contract_name: "",
    contract_number: "",
    vendor_id: "",
    contract_type: "",
    start_date: "",
    end_date: "",
    contract_value: "",
    currency: "USD",
    status: "Active",
    description: "",
    terms_and_conditions: "",
    renewal_terms: "",
    sla_requirements: "",
    compliance_requirements: "",
  })

  const [vendors, setVendors] = useState<Vendor[]>([])
  const [vendorsLoading, setVendorsLoading] = useState(true)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [submitting, setSubmitting] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    fetchVendors()
  }, [])

  useEffect(() => {
    if (contract) {
      setFormData({
        contract_name: contract.contract_name || "",
        contract_number: contract.contract_number || "",
        vendor_id: contract.vendor_id?.toString() || "",
        contract_type: contract.contract_type || "",
        start_date: contract.start_date ? contract.start_date.split("T")[0] : "",
        end_date: contract.end_date ? contract.end_date.split("T")[0] : "",
        contract_value: contract.contract_value?.toString() || "",
        currency: contract.currency || "USD",
        status: contract.status || "Active",
        description: contract.description || "",
        terms_and_conditions: contract.terms_and_conditions || "",
        renewal_terms: contract.renewal_terms || "",
        sla_requirements: contract.sla_requirements || "",
        compliance_requirements: contract.compliance_requirements || "",
      })
    }
  }, [contract])

  const fetchVendors = async () => {
    try {
      setVendorsLoading(true)
      console.log("Fetching vendors for contract form...")

      const response = await fetch("/api/vendors?limit=100")
      const data = await response.json()

      console.log("Vendors response for contract form:", data)

      if (data.success && data.data && data.data.vendors) {
        setVendors(data.data.vendors)
        console.log("Loaded vendors:", data.data.vendors.length)
      } else {
        console.error("Invalid vendors data:", data)
        toast({
          title: "Warning",
          description: "Failed to load vendors. Please refresh the page.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error fetching vendors:", error)
      toast({
        title: "Error",
        description: "Failed to load vendors",
        variant: "destructive",
      })
    } finally {
      setVendorsLoading(false)
    }
  }

  const handleInputChange = (key: string, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }))
    // Clear error for this field
    setErrors((prev) => ({ ...prev, [key]: undefined }))
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    if (!formData.contract_name.trim()) {
      newErrors.contract_name = "Contract name is required"
    }
    if (!formData.contract_type.trim()) {
      newErrors.contract_type = "Contract type is required"
    }
    if (!formData.vendor_id || isNaN(Number(formData.vendor_id))) {
      newErrors.vendor_id = "Valid vendor ID is required"
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return

    setSubmitting(true)

    try {
      const payload = {
        contract_name: formData.contract_name.trim(),
        contract_type: formData.contract_type.trim(),
        vendor_id: Number(formData.vendor_id),
        contract_value: formData.contract_value ? Number(formData.contract_value) : null,
        start_date: formData.start_date || null,
        end_date: formData.end_date || null,
        status: formData.status,
        description: formData.description,
        sla_requirements: formData.sla_requirements,
        compliance_requirements: formData.compliance_requirements,
        renewal_terms: formData.renewal_terms,
      }

      console.log("Submitting contract:", payload)

      const response = await fetch("/api/contracts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      const result = await response.json()

      if (result.success) {
        toast({
          title: "Success",
          description: "Contract created successfully",
        })
        onSubmit(result.contract)
      } else {
        console.error("Failed to create contract:", result.error)
        toast({
          title: "Error",
          description: result.error || "Failed to create contract",
          variant: "destructive",
        })
        setErrors({ form: result.error || "Failed to create contract" })
      }
    } catch (error) {
      console.error("Error submitting contract:", error)
      toast({
        title: "Error",
        description: "Network error, please try again",
        variant: "destructive",
      })
      setErrors({ form: "Network error, please try again" })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Information */}
      <Card>
        <CardHeader>
          <CardTitle>Contract Information</CardTitle>
          <CardDescription>Basic contract details and vendor selection</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="contract_name">Contract Name *</Label>
              <Input
                id="contract_name"
                value={formData.contract_name}
                onChange={(e) => handleInputChange("contract_name", e.target.value)}
                placeholder="Enter contract name"
                className={errors.contract_name ? "border-red-500" : ""}
              />
              {errors.contract_name && <p className="text-sm text-red-500">{errors.contract_name}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="contract_number">Contract Number</Label>
              <Input
                id="contract_number"
                value={formData.contract_number}
                onChange={(e) => handleInputChange("contract_number", e.target.value)}
                placeholder="Enter contract number"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="vendor_id">Vendor *</Label>
              {vendorsLoading ? (
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
                  <span className="text-sm text-muted-foreground">Loading vendors...</span>
                </div>
              ) : (
                <Select value={formData.vendor_id} onValueChange={(value) => handleInputChange("vendor_id", value)}>
                  <SelectTrigger className={errors.vendor_id ? "border-red-500" : ""}>
                    <SelectValue placeholder="Select a vendor" />
                  </SelectTrigger>
                  <SelectContent>
                    {vendors.length > 0 ? (
                      vendors.map((vendor) => (
                        <SelectItem key={vendor.id} value={vendor.id.toString()}>
                          <div className="flex flex-col">
                            <span className="font-medium">{vendor.vendor_name}</span>
                            <span className="text-sm text-muted-foreground">
                              {vendor.vendor_type} • {vendor.contact_person || "No contact"}
                            </span>
                          </div>
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem value="no-vendors" disabled>
                        No vendors available
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
              )}
              {errors.vendor_id && <p className="text-sm text-red-500">{errors.vendor_id}</p>}
              {vendors.length === 0 && !vendorsLoading && (
                <p className="text-sm text-muted-foreground">No vendors found. Please add vendors first.</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="contract_type">Contract Type *</Label>
              <Select
                value={formData.contract_type}
                onValueChange={(value) => handleInputChange("contract_type", value)}
              >
                <SelectTrigger className={errors.contract_type ? "border-red-500" : ""}>
                  <SelectValue placeholder="Select contract type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Service Agreement">Service Agreement</SelectItem>
                  <SelectItem value="Software License">Software License</SelectItem>
                  <SelectItem value="Maintenance Contract">Maintenance Contract</SelectItem>
                  <SelectItem value="Consulting Agreement">Consulting Agreement</SelectItem>
                  <SelectItem value="Data Processing Agreement">Data Processing Agreement</SelectItem>
                  <SelectItem value="Master Service Agreement">Master Service Agreement</SelectItem>
                  <SelectItem value="Non-Disclosure Agreement">Non-Disclosure Agreement</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
              {errors.contract_type && <p className="text-sm text-red-500">{errors.contract_type}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select value={formData.status} onValueChange={(value) => handleInputChange("status", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Draft">Draft</SelectItem>
                  <SelectItem value="Under Review">Under Review</SelectItem>
                  <SelectItem value="Expired">Expired</SelectItem>
                  <SelectItem value="Terminated">Terminated</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="currency">Currency</Label>
              <Select value={formData.currency} onValueChange={(value) => handleInputChange("currency", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select currency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="USD">USD</SelectItem>
                  <SelectItem value="EUR">EUR</SelectItem>
                  <SelectItem value="GBP">GBP</SelectItem>
                  <SelectItem value="AED">AED</SelectItem>
                  <SelectItem value="SAR">SAR</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Contract Terms */}
      <Card>
        <CardHeader>
          <CardTitle>Contract Terms</CardTitle>
          <CardDescription>Duration and financial details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="start_date">Start Date</Label>
              <Input
                id="start_date"
                type="date"
                value={formData.start_date}
                onChange={(e) => handleInputChange("start_date", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="end_date">End Date</Label>
              <Input
                id="end_date"
                type="date"
                value={formData.end_date}
                onChange={(e) => handleInputChange("end_date", e.target.value)}
                className={errors.end_date ? "border-red-500" : ""}
              />
              {errors.end_date && <p className="text-sm text-red-500">{errors.end_date}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="contract_value">Contract Value</Label>
              <Input
                id="contract_value"
                type="number"
                value={formData.contract_value}
                onChange={(e) => handleInputChange("contract_value", e.target.value)}
                placeholder="Enter contract value"
                min="0"
                step="0.01"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              placeholder="Enter contract description"
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      {/* Additional Terms */}
      <Card>
        <CardHeader>
          <CardTitle>Additional Terms</CardTitle>
          <CardDescription>Detailed contract terms and conditions</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="terms_and_conditions">Terms and Conditions</Label>
            <Textarea
              id="terms_and_conditions"
              value={formData.terms_and_conditions}
              onChange={(e) => handleInputChange("terms_and_conditions", e.target.value)}
              placeholder="Enter terms and conditions"
              rows={4}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="renewal_terms">Renewal Terms</Label>
              <Textarea
                id="renewal_terms"
                value={formData.renewal_terms}
                onChange={(e) => handleInputChange("renewal_terms", e.target.value)}
                placeholder="Enter renewal terms"
                rows={3}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="sla_requirements">SLA Requirements</Label>
              <Textarea
                id="sla_requirements"
                value={formData.sla_requirements}
                onChange={(e) => handleInputChange("sla_requirements", e.target.value)}
                placeholder="Enter SLA requirements"
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="compliance_requirements">Compliance Requirements</Label>
              <Textarea
                id="compliance_requirements"
                value={formData.compliance_requirements}
                onChange={(e) => handleInputChange("compliance_requirements", e.target.value)}
                placeholder="Enter compliance requirements"
                rows={3}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Form Actions */}
      <div className="flex justify-end space-x-4">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading || submitting}>
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading || submitting || vendorsLoading}>
          {submitting ? "Saving..." : contract ? "Update Contract" : "Create Contract"}
        </Button>
      </div>

      {errors.form && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-md">
          <p className="text-sm text-red-600">{errors.form}</p>
        </div>
      )}
    </form>
  )
}
