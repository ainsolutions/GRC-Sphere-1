"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Save, X, RefreshCw, Building2, User, MapPin, FileText, DollarSign, Shield } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Vendor {
  id?: number
  vendor_id?: string
  vendor_name: string
  vendor_type: string
  contact_person: string
  contact_email: string
  contact_phone: string
  address: string
  city: string
  state: string
  country: string
  postal_code: string
  website: string
  business_registration_number: string
  tax_id: string
  industry: string
  services_provided: string
  contract_start_date: string
  contract_end_date: string
  contract_value: number
  currency: string
  payment_terms: string
  sla_requirements: string
  data_processing_agreement: boolean
  security_requirements: string
  compliance_certifications: string[]
  risk_level: string
  risk_score: number
  last_assessment_date: string
  next_assessment_date: string
  status: string
  notes: string
}

interface VendorFormProps {
  vendor?: Vendor
  onSuccess: () => void
  onCancel: () => void
}

export function VendorForm({ vendor, onSuccess, onCancel }: VendorFormProps) {
  const [loading, setLoading] = useState(false)
  const [generatingId, setGeneratingId] = useState(false)
  const { toast } = useToast()

  const [formData, setFormData] = useState<Vendor>({
    vendor_id: "",
    vendor_name: "",
    vendor_type: "",
    contact_person: "",
    contact_email: "",
    contact_phone: "",
    address: "",
    city: "",
    state: "",
    country: "",
    postal_code: "",
    website: "",
    business_registration_number: "",
    tax_id: "",
    industry: "",
    services_provided: "",
    contract_start_date: "",
    contract_end_date: "",
    contract_value: 0,
    currency: "USD",
    payment_terms: "",
    sla_requirements: "",
    data_processing_agreement: false,
    security_requirements: "",
    compliance_certifications: [],
    risk_level: "Medium",
    risk_score: 0,
    last_assessment_date: "",
    next_assessment_date: "",
    status: "Active",
    notes: "",
  })

  const [certificationInput, setCertificationInput] = useState("")

  useEffect(() => {
    if (vendor) {
      setFormData({
        ...vendor,
        compliance_certifications: Array.isArray(vendor.compliance_certifications)
          ? vendor.compliance_certifications
          : [],
      })
    } else {
      // Generate vendor ID for new vendors
      generateVendorId()
    }
  }, [vendor])

  const generateVendorId = async () => {
    if (vendor?.vendor_id) return // Don't generate for existing vendors

    setGeneratingId(true)
    try {
      const response = await fetch("/api/vendors/generate-id")
      const data = await response.json()

      if (data.success) {
        setFormData((prev) => ({ ...prev, vendor_id: data.data.vendor_id }))
      } else {
        throw new Error(data.error)
      }
    } catch (error) {
      console.error("Error generating vendor ID:", error)
      toast({
        title: "Error",
        description: "Failed to generate vendor ID",
        variant: "destructive",
      })
    } finally {
      setGeneratingId(false)
    }
  }

  const addCertification = () => {
    if (certificationInput.trim() && !formData.compliance_certifications.includes(certificationInput.trim())) {
      setFormData((prev) => ({
        ...prev,
        compliance_certifications: [...prev.compliance_certifications, certificationInput.trim()],
      }))
      setCertificationInput("")
    }
  }

  const removeCertification = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      compliance_certifications: prev.compliance_certifications.filter((_, i) => i !== index),
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const url = vendor ? `/api/vendors/${vendor.id}` : "/api/vendors"
      const method = vendor ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (data.success) {
        toast({
          title: "Success",
          description: `Vendor ${vendor ? "updated" : "created"} successfully`,
        })
        onSuccess()
      } else {
        throw new Error(data.error)
      }
    } catch (error) {
      console.error(`Error ${vendor ? "updating" : "creating"} vendor:`, error)
      toast({
        title: "Error",
        description: `Failed to ${vendor ? "update" : "create"} vendor`,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Vendor Identification */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5 text-blue-600" />
            Vendor Identification
          </CardTitle>
          <CardDescription>Basic vendor identification and contact information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="vendor_id">Vendor ID *</Label>
              <div className="flex gap-2">
                <Input
                  id="vendor_id"
                  value={formData.vendor_id}
                  readOnly={!!vendor?.vendor_id}
                  className="font-mono"
                  placeholder="VNC-YYYY-XXXX"
                />
                {!vendor?.vendor_id && (
                  <Button type="button" variant="outline" onClick={generateVendorId} disabled={generatingId}>
                    {generatingId ? <RefreshCw className="h-4 w-4 animate-spin" /> : "Generate New"}
                  </Button>
                )}
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="vendor_name">Vendor Name *</Label>
              <Input
                id="vendor_name"
                value={formData.vendor_name}
                onChange={(e) => setFormData({ ...formData, vendor_name: e.target.value })}
                placeholder="Enter vendor name"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="vendor_type">Vendor Type</Label>
              <Select
                value={formData.vendor_type}
                onValueChange={(value) => setFormData({ ...formData, vendor_type: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select vendor type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Technology">Technology</SelectItem>
                  <SelectItem value="Consulting">Consulting</SelectItem>
                  <SelectItem value="Manufacturing">Manufacturing</SelectItem>
                  <SelectItem value="Financial Services">Financial Services</SelectItem>
                  <SelectItem value="Healthcare">Healthcare</SelectItem>
                  <SelectItem value="Legal">Legal</SelectItem>
                  <SelectItem value="Marketing">Marketing</SelectItem>
                  <SelectItem value="Logistics">Logistics</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="industry">Industry</Label>
              <Input
                id="industry"
                value={formData.industry}
                onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                placeholder="e.g., Software Development, Healthcare"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="business_registration_number">Business Registration Number</Label>
              <Input
                id="business_registration_number"
                value={formData.business_registration_number}
                onChange={(e) => setFormData({ ...formData, business_registration_number: e.target.value })}
                placeholder="Enter registration number"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="tax_id">Tax ID</Label>
              <Input
                id="tax_id"
                value={formData.tax_id}
                onChange={(e) => setFormData({ ...formData, tax_id: e.target.value })}
                placeholder="Enter tax identification number"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Contact Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5 text-green-600" />
            Contact Information
          </CardTitle>
          <CardDescription>Primary contact details for the vendor</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="contact_person">Contact Person</Label>
              <Input
                id="contact_person"
                value={formData.contact_person}
                onChange={(e) => setFormData({ ...formData, contact_person: e.target.value })}
                placeholder="Primary contact name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contact_email">Contact Email</Label>
              <Input
                id="contact_email"
                type="email"
                value={formData.contact_email}
                onChange={(e) => setFormData({ ...formData, contact_email: e.target.value })}
                placeholder="contact@vendor.com"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="contact_phone">Contact Phone</Label>
              <Input
                id="contact_phone"
                value={formData.contact_phone}
                onChange={(e) => setFormData({ ...formData, contact_phone: e.target.value })}
                placeholder="+1 (555) 123-4567"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="website">Website</Label>
              <Input
                id="website"
                value={formData.website}
                onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                placeholder="https://www.vendor.com"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Address Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-orange-600" />
            Address Information
          </CardTitle>
          <CardDescription>Physical address and location details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="address">Street Address</Label>
            <Input
              id="address"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              placeholder="123 Main Street"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                placeholder="City name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="state">State/Province</Label>
              <Input
                id="state"
                value={formData.state}
                onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                placeholder="State or province"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="country">Country</Label>
              <Input
                id="country"
                value={formData.country}
                onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                placeholder="Country name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="postal_code">Postal Code</Label>
              <Input
                id="postal_code"
                value={formData.postal_code}
                onChange={(e) => setFormData({ ...formData, postal_code: e.target.value })}
                placeholder="12345"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Contract Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-purple-600" />
            Contract Information
          </CardTitle>
          <CardDescription>Contract terms and financial details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="contract_start_date">Contract Start Date</Label>
              <Input
                id="contract_start_date"
                type="date"
                value={formData.contract_start_date}
                onChange={(e) => setFormData({ ...formData, contract_start_date: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contract_end_date">Contract End Date</Label>
              <Input
                id="contract_end_date"
                type="date"
                value={formData.contract_end_date}
                onChange={(e) => setFormData({ ...formData, contract_end_date: e.target.value })}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="contract_value">Contract Value</Label>
              <Input
                id="contract_value"
                type="number"
                value={formData.contract_value}
                onChange={(e) => setFormData({ ...formData, contract_value: Number.parseFloat(e.target.value) || 0 })}
                placeholder="0.00"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="currency">Currency</Label>
              <Select
                value={formData.currency}
                onValueChange={(value) => setFormData({ ...formData, currency: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="USD">USD</SelectItem>
                  <SelectItem value="EUR">EUR</SelectItem>
                  <SelectItem value="GBP">GBP</SelectItem>
                  <SelectItem value="CAD">CAD</SelectItem>
                  <SelectItem value="AUD">AUD</SelectItem>
                  <SelectItem value="JPY">JPY</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="payment_terms">Payment Terms</Label>
            <Input
              id="payment_terms"
              value={formData.payment_terms}
              onChange={(e) => setFormData({ ...formData, payment_terms: e.target.value })}
              placeholder="e.g., Net 30, Net 60"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="sla_requirements">SLA Requirements</Label>
            <Textarea
              id="sla_requirements"
              value={formData.sla_requirements}
              onChange={(e) => setFormData({ ...formData, sla_requirements: e.target.value })}
              placeholder="Service level agreement requirements..."
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      {/* Risk and Compliance */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-red-600" />
            Risk and Compliance
          </CardTitle>
          <CardDescription>Risk assessment and compliance information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="risk_level">Risk Level</Label>
              <Select
                value={formData.risk_level}
                onValueChange={(value) => setFormData({ ...formData, risk_level: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Low">Low</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="High">High</SelectItem>
                  <SelectItem value="Critical">Critical</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="risk_score">Risk Score (1-10)</Label>
              <Input
                id="risk_score"
                type="number"
                min="1"
                max="10"
                value={formData.risk_score}
                onChange={(e) => setFormData({ ...formData, risk_score: Number.parseFloat(e.target.value) || 0 })}
                placeholder="5"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Inactive">Inactive</SelectItem>
                  <SelectItem value="Pending">Pending</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="last_assessment_date">Last Assessment Date</Label>
              <Input
                id="last_assessment_date"
                type="date"
                value={formData.last_assessment_date}
                onChange={(e) => setFormData({ ...formData, last_assessment_date: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="next_assessment_date">Next Assessment Date</Label>
              <Input
                id="next_assessment_date"
                type="date"
                value={formData.next_assessment_date}
                onChange={(e) => setFormData({ ...formData, next_assessment_date: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="data_processing_agreement"
                checked={formData.data_processing_agreement}
                onCheckedChange={(checked) => setFormData({ ...formData, data_processing_agreement: !!checked })}
              />
              <Label htmlFor="data_processing_agreement">Data Processing Agreement in place</Label>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="security_requirements">Security Requirements</Label>
            <Textarea
              id="security_requirements"
              value={formData.security_requirements}
              onChange={(e) => setFormData({ ...formData, security_requirements: e.target.value })}
              placeholder="Specific security requirements and controls..."
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label>Compliance Certifications</Label>
            <div className="flex gap-2">
              <Input
                value={certificationInput}
                onChange={(e) => setCertificationInput(e.target.value)}
                placeholder="Add certification (e.g., ISO 27001, SOC 2)"
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault()
                    addCertification()
                  }
                }}
              />
              <Button type="button" onClick={addCertification}>
                Add
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {formData.compliance_certifications.map((cert, index) => (
                <Badge key={index} variant="outline" className="flex items-center gap-1">
                  {cert}
                  <X className="h-3 w-3 cursor-pointer" onClick={() => removeCertification(index)} />
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Services and Notes */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-gray-600" />
            Services and Notes
          </CardTitle>
          <CardDescription>Additional information about services and notes</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="services_provided">Services Provided</Label>
            <Textarea
              id="services_provided"
              value={formData.services_provided}
              onChange={(e) => setFormData({ ...formData, services_provided: e.target.value })}
              placeholder="Description of services provided by the vendor..."
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Additional notes and comments..."
              rows={4}
            />
          </div>
        </CardContent>
      </Card>

      {/* Form Actions */}
      <div className="flex justify-end space-x-2">
        <Button type="button" onClick={onCancel}>
          <X className="h-4 w-4 mr-2" />
          Cancel
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? (
            <>
              <RefreshCw className="animate-spin h-4 w-4 mr-2" />
              {vendor ? "Updating..." : "Creating..."}
            </>
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
              {vendor ? "Update Vendor" : "Create Vendor"}
            </>
          )}
        </Button>
      </div>
    </form>
  )
}
