"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AssetSelector } from "@/components/asset-selector"
import DepartmentSelectInput from "@/components/department-search-input"
import OwnerSelectInput from "@/components/owner-search-input"
import { roundToNearestHours } from "date-fns"

type Option = "None" | "Low" | "Medium" | "High" | "Critical";

export default function AssetBIAForm() {
  const [selectedAsset, setSelectedAsset] = useState<any | null>(null)
  const [department, setDepartment] = useState("")
  const [owner, setOwner] = useState("")
  const [custodian, setCustodian] = useState("")
  const [impactFinancial, setImpactFinancial] = useState<Option | undefined>()
  const [impactOperational, setImpactOperational] = useState<Option | undefined>()
  const [impactReputational, setImpactReputational] = useState<Option | undefined>()
  const [impactCompliance, setImpactCompliance] = useState<Option | undefined>()
  const [mtd, setMtd] = useState<string>("")
  const [rto, setRto] = useState<string>("")
  const [rpo, setRpo] = useState<string>("")
  const [notes, setNotes] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [formData, setFormData] = useState<any>({ department: "", owner: "", custodian: "" })
  const [dailyRevenue, setDailyRevenue] = useState<string>("")
  const [hourlyLoss, setHourlyLoss] = useState<string>("")
  const [aggregateFinancialLoss, setAggregateFinancialLoss] = useState<string>("")

  useEffect(() => {
    if (!selectedAsset) return;
    const fetchBIA = async () => {
      const res = await fetch(`/api/asset-bia?assetId=${selectedAsset.id}`)
      const data = await res.json()
      if (data?.data) {
        const b = data.data
        setDepartment(b.department || selectedAsset.department || "")
        setOwner(b.owner || selectedAsset.owner || "")
        setCustodian(b.custodian || selectedAsset.custodian || "")
        setFormData({
          department: b.department || selectedAsset.department || "",
          owner: b.owner || selectedAsset.owner || "",
          custodian: b.custodian || selectedAsset.custodian || "",
        })
        setImpactFinancial(b.impact_financial || undefined)
        setImpactOperational(b.impact_operational || undefined)
        setImpactReputational(b.impact_reputational || undefined)
        setImpactCompliance(b.impact_compliance || undefined)
        setMtd(b.max_tolerable_downtime_hours?.toString() || "")
        setRto(b.rto_hours?.toString() || "")
        setRpo(b.rpo_hours?.toString() || "")
        setNotes(b.notes || "")
        setDailyRevenue(b.daily_revenue?.toString() || "")
        setHourlyLoss(b.hourly_loss?.toString() || "")
        setAggregateFinancialLoss(b.aggregate_financial_loss?.toString() || "")
      } else {
        setDepartment(selectedAsset.department || "")
        setOwner(selectedAsset.owner || "")
        setCustodian(selectedAsset.custodian || "")
        setFormData({
          department: selectedAsset.department || "",
          owner: selectedAsset.owner || "",
          custodian: selectedAsset.custodian || "",
        })
      }
    }
    fetchBIA()
  }, [selectedAsset])

  const handleSubmit = async () => {
    if (!selectedAsset) return
    setSubmitting(true)
    try {
      const res = await fetch("/api/asset-bia", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          asset_id: selectedAsset.id,
          department: formData.department || department,
          owner: formData.owner || owner,
          custodian: formData.custodian || custodian,
          impact_financial: impactFinancial,
          impact_operational: impactOperational,
          impact_reputational: impactReputational,
          impact_compliance: impactCompliance,
          max_tolerable_downtime_hours: mtd ? Number(mtd) : null,
          rto_hours: rto ? Number(rto) : null,
          rpo_hours: rpo ? Number(rpo) : null,
          notes,
          daily_revenue: dailyRevenue ? Number(dailyRevenue) : null,
          hourly_loss: hourlyLoss ? Number(hourlyLoss) : null,
          aggregate_financial_loss: aggregateFinancialLoss ? Number(aggregateFinancialLoss) : null,
        })
      })
      if (!res.ok) throw new Error("Failed to save BIA")
    } finally {
      setSubmitting(false)
    }
  }

  const impactOptions: Option[] = ["None", "Low", "Medium", "High", "Critical"]

  // Auto-calc derived fields
  useEffect(() => {
    const dr = Number(dailyRevenue) || 0
    const rtoHrs = Number(rto) || 0
    // hourly loss = daily revenue * RTO (hours). If daily revenue is per day, hourly = daily/24; but user requested multiplication.
    const calcHourly = Math.round(dr / 24 * 100) / 100
    setHourlyLoss(calcHourly ? String(calcHourly) : "")

    const mtdHrs = Number(mtd) || 0
    const agg = calcHourly * mtdHrs
    setAggregateFinancialLoss(agg ? String(agg) : "")
  }, [dailyRevenue, rto, mtd])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Business Impact Analysis</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label>Asset</Label>
            <AssetSelector value={selectedAsset} onChange={setSelectedAsset} placeholder="Select an asset" />
          </div>
          <div>
            <Label>Department</Label>
            <DepartmentSelectInput formData={formData} setFormData={setFormData} fieldName="department" onDepartmentSelected={(d) => setDepartment(d?.name || "") } />
          </div>
          <div>
            <Label>Owner</Label>
            <OwnerSelectInput formData={formData} setFormData={setFormData} fieldName="owner" />
          </div>
          <div>
            <Label>Custodian</Label>
            <OwnerSelectInput formData={formData} setFormData={setFormData} fieldName="custodian" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label>Financial Impact</Label>
            <Select value={impactFinancial} onValueChange={(v: Option) => setImpactFinancial(v)}>
              <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
              <SelectContent>
                {impactOptions.map(o => <SelectItem key={o} value={o}>{o}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Operational Impact</Label>
            <Select value={impactOperational} onValueChange={(v: Option) => setImpactOperational(v)}>
              <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
              <SelectContent>
                {impactOptions.map(o => <SelectItem key={o} value={o}>{o}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Reputational Impact</Label>
            <Select value={impactReputational} onValueChange={(v: Option) => setImpactReputational(v)}>
              <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
              <SelectContent>
                {impactOptions.map(o => <SelectItem key={o} value={o}>{o}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Compliance Impact</Label>
            <Select value={impactCompliance} onValueChange={(v: Option) => setImpactCompliance(v)}>
              <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
              <SelectContent>
                {impactOptions.map(o => <SelectItem key={o} value={o}>{o}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label>Max Tolerable Downtime (hours)</Label>
            <Input type="number" value={mtd} onChange={(e) => setMtd(e.target.value)} />
          </div>
          <div>
            <Label>RTO (hours)</Label>
            <Input type="number" value={rto} onChange={(e) => setRto(e.target.value)} />
          </div>
          <div>
            <Label>RPO (hours)</Label>
            <Input type="number" value={rpo} onChange={(e) => setRpo(e.target.value)} />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label>Daily Revenue</Label>
            <Input type="number" value={dailyRevenue} onChange={(e) => setDailyRevenue(e.target.value)} />
          </div>
          <div>
            <Label>Hourly Loss (auto)</Label>
            <Input type="number" value={hourlyLoss} onChange={(e) => setHourlyLoss(e.target.value)} />
          </div>
          <div>
            <Label>Aggregate Financial Loss (auto)</Label>
            <Input type="number" value={aggregateFinancialLoss} onChange={(e) => setAggregateFinancialLoss(e.target.value)} />
          </div>
        </div>

        <div>
          <Label>Notes</Label>
          <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Additional notes" />
        </div>

        <div className="flex justify-end">
          <Button onClick={handleSubmit} disabled={!selectedAsset || submitting}>Save BIA</Button>
        </div>
      </CardContent>
    </Card>
  )
}


