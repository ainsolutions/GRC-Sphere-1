"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { useToast } from "@/hooks/use-toast"
import { Download, Upload, FileText, FileSpreadsheet, AlertCircle, CheckCircle, Calculator } from "lucide-react"

interface FairRiskImportExportProps {
  onImportComplete?: () => void
  currentFilters?: {
    treatment_status?: string
  }
}

export function FairRiskImportExport({ onImportComplete, currentFilters }: FairRiskImportExportProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [importing, setImporting] = useState(false)
  const [exporting, setExporting] = useState(false)
  const [importProgress, setImportProgress] = useState(0)
  const [importResults, setImportResults] = useState<{
    imported: number
    errors: string[]
  } | null>(null)
  const { toast } = useToast()

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    if (!file.name.endsWith(".csv")) {
      toast({
        title: "Invalid File",
        description: "Please select a CSV file",
        variant: "destructive",
      })
      return
    }

    setImporting(true)
    setImportProgress(0)
    setImportResults(null)

    try {
      const text = await file.text()
      const lines = text.split("\n").filter((line) => line.trim())

      if (lines.length < 2) {
        toast({
          title: "Invalid File",
          description: "CSV file must contain headers and at least one data row",
          variant: "destructive",
        })
        setImporting(false)
        return
      }

      // Parse CSV
      const headers = lines[0].split(",").map((h) => h.trim().replace(/"/g, ""))
      const data = []

      for (let i = 1; i < lines.length; i++) {
        setImportProgress((i / (lines.length - 1)) * 50) // First 50% for parsing

        const values = lines[i].split(",").map((v) => v.trim().replace(/"/g, ""))
        const row: any = {}

        headers.forEach((header, index) => {
          const value = values[index] || ""

          // Convert numeric fields
          if (
            [
              "threat_capability",
              "threat_motivation",
              "control_strength",
              "vulnerability_score",
              "loss_event_frequency_min",
              "loss_event_frequency_most_likely",
              "loss_event_frequency_max",
              "primary_loss_min",
              "primary_loss_most_likely",
              "primary_loss_max",
              "secondary_loss_min",
              "secondary_loss_most_likely",
              "secondary_loss_max",
              "annual_loss_expectancy",
              "risk_tolerance",
            ].includes(header)
          ) {
            row[header] = value ? Number(value) : null
          } else {
            row[header] = value
          }
        })

        data.push(row)
      }

      setImportProgress(50)

      // Import to database
      const response = await fetch("/api/fair-risks/import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data }),
      })

      const result = await response.json()
      setImportProgress(100)

      if (result.success) {
        setImportResults({
          imported: result.imported,
          errors: result.errors,
        })

        toast({
          title: "Import Complete",
          description: `Successfully imported ${result.imported} FAIR risks${result.errors.length > 0 ? ` with ${result.errors.length} errors` : ""}`,
        })

        if (onImportComplete) {
          onImportComplete()
        }
      } else {
        toast({
          title: "Import Failed",
          description: result.error,
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Import error:", error)
      toast({
        title: "Import Failed",
        description: "Failed to parse CSV file",
        variant: "destructive",
      })
    } finally {
      setImporting(false)
      event.target.value = "" // Reset file input
    }
  }

  const handleExportCSV = async () => {
    setExporting(true)
    try {
      const params = new URLSearchParams({
        format: "csv",
        ...(currentFilters?.treatment_status &&
          currentFilters.treatment_status !== "all" && {
            treatment_status: currentFilters.treatment_status,
          }),
      })

      const response = await fetch(`/api/fair-risks/export?${params.toString()}`)
      const result = await response.json()

      if (result.success) {
        const risks = result.data
        if (risks.length === 0) {
          toast({
            title: "No Data",
            description: "No FAIR risks found to export",
            variant: "destructive",
          })
          return
        }

        const headers = [
          "risk_id",
          "risk_title",
          "risk_description",
          "asset_name",
          "threat_actor",
          "threat_capability",
          "threat_motivation",
          "control_strength",
          "vulnerability_score",
          "loss_event_frequency_min",
          "loss_event_frequency_most_likely",
          "loss_event_frequency_max",
          "primary_loss_min",
          "primary_loss_most_likely",
          "primary_loss_max",
          "secondary_loss_min",
          "secondary_loss_most_likely",
          "secondary_loss_max",
          "annual_loss_expectancy",
          "risk_tolerance",
          "treatment_plan",
          "treatment_status",
          "treatment_due_date",
          "created_at",
          "updated_at",
        ]

        const csvContent = [
          headers.join(","),
          ...risks.map((risk: any) =>
            headers
              .map((header) => {
                const value = risk[header] || ""
                // Escape commas and quotes in values
                return typeof value === "string" && (value.includes(",") || value.includes('"'))
                  ? `"${value.replace(/"/g, '""')}"`
                  : value
              })
              .join(","),
          ),
        ].join("\n")

        // Download file
        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
        const link = document.createElement("a")
        const url = URL.createObjectURL(blob)
        link.setAttribute("href", url)
        link.setAttribute("download", `fair_risks_export_${new Date().toISOString().split("T")[0]}.csv`)
        link.style.visibility = "hidden"
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)

        toast({
          title: "Export Complete",
          description: `Exported ${risks.length} FAIR risks to CSV`,
        })
      } else {
        toast({
          title: "Export Failed",
          description: result.error,
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Export error:", error)
      toast({
        title: "Export Failed",
        description: "Failed to export FAIR risks",
        variant: "destructive",
      })
    } finally {
      setExporting(false)
    }
  }

  const handleDownloadTemplate = async () => {
    try {
      const response = await fetch("/api/fair-risks/export?template=true")
      const result = await response.json()

      if (result.success) {
        const template = result.data[0]
        const headers = Object.keys(template)
        const csvContent = [
          headers.join(","),
          headers
            .map((header) => {
              const value = template[header] || ""
              return typeof value === "string" && (value.includes(",") || value.includes('"'))
                ? `"${value.replace(/"/g, '""')}"`
                : value
            })
            .join(","),
        ].join("\n")

        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
        const link = document.createElement("a")
        const url = URL.createObjectURL(blob)
        link.setAttribute("href", url)
        link.setAttribute("download", "fair_risk_import_template.csv")
        link.style.visibility = "hidden"
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)

        toast({
          title: "Template Downloaded",
          description: "FAIR risk import template downloaded successfully",
        })
      }
    } catch (error) {
      console.error("Template download error:", error)
      toast({
        title: "Download Failed",
        description: "Failed to download template",
        variant: "destructive",
      })
    }
  }

  const handleExportPDF = async () => {
    setExporting(true)
    try {
      const params = new URLSearchParams({
        format: "csv",
        ...(currentFilters?.treatment_status &&
          currentFilters.treatment_status !== "all" && {
            treatment_status: currentFilters.treatment_status,
          }),
      })

      const response = await fetch(`/api/fair-risks/export?${params.toString()}`)
      const result = await response.json()

      if (result.success) {
        const risks = result.data
        if (risks.length === 0) {
          toast({
            title: "No Data",
            description: "No FAIR risks found to export",
            variant: "destructive",
          })
          return
        }

        // Create HTML content for PDF
        const htmlContent = `
          <!DOCTYPE html>
          <html>
          <head>
            <title>FAIR Risk Analysis Report</title>
            <style>
              body { font-family: Arial, sans-serif; margin: 20px; }
              .header { text-align: center; margin-bottom: 30px; }
              .risk-card { border: 1px solid #ddd; margin-bottom: 20px; padding: 15px; border-radius: 5px; }
              .risk-title { font-size: 18px; font-weight: bold; color: #333; margin-bottom: 10px; }
              .risk-meta { display: flex; gap: 20px; margin-bottom: 10px; }
              .risk-meta span { background: #f5f5f5; padding: 5px 10px; border-radius: 3px; font-size: 12px; }
              .risk-description { margin-bottom: 10px; line-height: 1.4; }
              .fair-metrics { display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px; margin-top: 10px; }
              .metric { text-align: center; padding: 10px; border-radius: 5px; background: #f8f9fa; }
              .ale-high { background: #fee; color: #c53030; }
              .ale-medium { background: #fef5e7; color: #d69e2e; }
              .ale-low { background: #f0fff4; color: #38a169; }
            </style>
          </head>
          <body>
            <div class="header">
              <h1>FAIR Risk Analysis Report</h1>
              <p>Generated on ${new Date().toLocaleDateString()}</p>
              <p>Total Risks: ${risks.length}</p>
            </div>
            ${risks
              .map((risk: any) => {
                const ale = Number(risk.annual_loss_expectancy) || 0
                const aleClass = ale >= 1000000 ? "ale-high" : ale >= 100000 ? "ale-medium" : "ale-low"
                return `
              <div class="risk-card">
                <div class="risk-title">${risk.risk_id}: ${risk.risk_title}</div>
                <div class="risk-meta">
                  <span>Asset: ${risk.asset_name || "N/A"}</span>
                  <span>Status: ${risk.treatment_status}</span>
                  <span>Threat Actor: ${risk.threat_actor || "N/A"}</span>
                </div>
                <div class="risk-description">${risk.risk_description || ""}</div>
                <div class="fair-metrics">
                  <div class="metric ${aleClass}">
                    <div>Annual Loss Expectancy</div>
                    <div>$${ale.toLocaleString()}</div>
                  </div>
                  <div class="metric">
                    <div>Threat Capability</div>
                    <div>${risk.threat_capability || "N/A"}/10</div>
                  </div>
                  <div class="metric">
                    <div>Control Strength</div>
                    <div>${risk.control_strength || "N/A"}/10</div>
                  </div>
                  <div class="metric">
                    <div>Loss Frequency</div>
                    <div>${risk.loss_event_frequency_most_likely || "N/A"}/year</div>
                  </div>
                </div>
              </div>
            `
              })
              .join("")}
          </body>
          </html>
        `

        // Create and download HTML file (user can print to PDF)
        const blob = new Blob([htmlContent], { type: "text/html;charset=utf-8;" })
        const link = document.createElement("a")
        const url = URL.createObjectURL(blob)
        link.setAttribute("href", url)
        link.setAttribute("download", `fair_risks_report_${new Date().toISOString().split("T")[0]}.html`)
        link.style.visibility = "hidden"
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)

        toast({
          title: "Report Generated",
          description: "HTML report downloaded. Open in browser and print to PDF.",
        })
      }
    } catch (error) {
      console.error("PDF export error:", error)
      toast({
        title: "Export Failed",
        description: "Failed to generate PDF report",
        variant: "destructive",
      })
    } finally {
      setExporting(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>Import/Export</Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5" />
            Import/Export FAIR Risks
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="export" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="export">Export</TabsTrigger>
            <TabsTrigger value="import">Import</TabsTrigger>
          </TabsList>

          <TabsContent value="export" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Download className="h-5 w-5" />
                  Export FAIR Risks
                </CardTitle>
                <CardDescription>
                  Export your FAIR risk analysis data in various formats. Current filters will be applied to the export.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-3">
                  <Button onClick={handleExportCSV} disabled={exporting} className="flex items-center gap-2">
                    <FileSpreadsheet className="h-4 w-4" />
                    Export CSV
                  </Button>
                  <Button
                    onClick={handleExportPDF}
                    disabled={exporting}
                    variant="outline"
                    className="flex items-center gap-2 bg-transparent"
                  >
                    <FileText className="h-4 w-4" />
                    Export PDF Report
                  </Button>
                  <Button
                    onClick={handleDownloadTemplate}
                    variant="outline"
                    className="flex items-center gap-2 bg-transparent"
                  >
                    <Download className="h-4 w-4" />
                    Download Template
                  </Button>
                </div>

                {exporting && (
                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>Exporting data... Please wait.</AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="import" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Upload className="h-5 w-5" />
                  Import FAIR Risks
                </CardTitle>
                <CardDescription>
                  Import FAIR risks from a CSV file. Download the template first to see the required format.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="csv-file">Select CSV File</Label>
                  <Input id="csv-file" type="file" accept=".csv" onChange={handleFileUpload} disabled={importing} />
                </div>

                {importing && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <AlertCircle className="h-4 w-4" />
                      <span>Importing FAIR risks...</span>
                    </div>
                    <Progress value={importProgress} className="w-full" />
                  </div>
                )}

                {importResults && (
                  <Alert className={importResults.errors.length > 0 ? "border-yellow-500" : "border-green-500"}>
                    <CheckCircle className="h-4 w-4" />
                    <AlertDescription>
                      <div className="space-y-2">
                        <p>Import completed: {importResults.imported} FAIR risks imported successfully</p>
                        {importResults.errors.length > 0 && (
                          <div>
                            <p className="font-medium">Errors encountered:</p>
                            <ul className="list-disc list-inside text-sm space-y-1">
                              {importResults.errors.slice(0, 10).map((error, index) => (
                                <li key={index}>{error}</li>
                              ))}
                              {importResults.errors.length > 10 && (
                                <li>... and {importResults.errors.length - 10} more errors</li>
                              )}
                            </ul>
                          </div>
                        )}
                      </div>
                    </AlertDescription>
                  </Alert>
                )}

                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Import Guidelines:</strong>
                    <ul className="list-disc list-inside mt-2 space-y-1 text-sm">
                      <li>Required field: risk_title</li>
                      <li>Threat capability, motivation, control strength, vulnerability: 1-10 scale</li>
                      <li>Loss amounts should be numeric values (no currency symbols)</li>
                      <li>Treatment status: identified, assessed, treated, monitored, accepted</li>
                      <li>Dates should be in YYYY-MM-DD format</li>
                      <li>Asset can be referenced by ID or name</li>
                      <li>ALE will be auto-calculated if not provided</li>
                    </ul>
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
