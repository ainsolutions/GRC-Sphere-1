"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { Upload, Download, FileText, AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface FindingsImportExportProps {
  onImportComplete: () => void
  currentFilters: {
    searchTerm: string
    statusFilter: string
    severityFilter: string
    assessmentFilter: string
    timelineFilter: string
  }
}

export function FindingsImportExport({ onImportComplete, currentFilters }: FindingsImportExportProps) {
  const [isImportOpen, setIsImportOpen] = useState(false)
  const [isExportOpen, setIsExportOpen] = useState(false)
  const [importFile, setImportFile] = useState<File | null>(null)
  const [importing, setImporting] = useState(false)
  const [exporting, setExporting] = useState(false)
  const { toast } = useToast()

  const handleImport = async () => {
    if (!importFile) {
      toast({
        title: "Error",
        description: "Please select a file to import",
        variant: "destructive",
      })
      return
    }

    setImporting(true)
    try {
      // Simulate import process
      await new Promise((resolve) => setTimeout(resolve, 2000))

      toast({
        title: "Success",
        description: "Findings imported successfully",
      })
      setIsImportOpen(false)
      setImportFile(null)
      onImportComplete()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to import findings",
        variant: "destructive",
      })
    } finally {
      setImporting(false)
    }
  }

  const downloadTemplate = () => {
    const headers = [
      "finding_title",
      "finding_description",
      "severity",
      "category",
      "recommendation",
      "status",
      "assigned_to",
      "due_date",
      "assessment_name",
    ]

    const sampleData = [
      [
        "Sample Finding Title",
        "Description of the security finding",
        "High",
        "Access Control",
        "Implement stronger authentication",
        "Open",
        "John Doe",
        "2025-03-01",
        "Security Assessment 2025",
      ],
    ]

    const csvContent = [headers, ...sampleData].map((row) => row.map((field) => `"${field}"`).join(",")).join("\n")

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const link = document.createElement("a")
    const url = URL.createObjectURL(blob)
    link.setAttribute("href", url)
    link.setAttribute("download", "findings-import-template.csv")
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    toast({
      title: "Success",
      description: "Template downloaded successfully",
    })
  }

  const handleExport = async () => {
    setExporting(true)
    try {
      // Simulate export process
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Create export data based on current filters
      const exportData = {
        filters: currentFilters,
        timestamp: new Date().toISOString(),
        // In a real implementation, this would contain the actual filtered data
      }

      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: "application/json" })
      const link = document.createElement("a")
      const url = URL.createObjectURL(blob)
      link.setAttribute("href", url)
      link.setAttribute("download", `findings-export-${new Date().toISOString().split("T")[0]}.json`)
      link.style.visibility = "hidden"
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      toast({
        title: "Success",
        description: "Findings exported successfully",
      })
      setIsExportOpen(false)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to export findings",
        variant: "destructive",
      })
    } finally {
      setExporting(false)
    }
  }

  return (
    <div className="flex gap-2">
      {/* Import Dialog */}
      <Dialog open={isImportOpen} onOpenChange={setIsImportOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm">
            <Upload className="mr-2 h-4 w-4" />
            Import
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Import Findings</DialogTitle>
            <DialogDescription>
              Upload a CSV file to import findings. Download the template first to see the required format.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Make sure your CSV file follows the template format. Invalid data will be skipped.
              </AlertDescription>
            </Alert>

            <div className="space-y-2">
              <Label htmlFor="template">Download Template</Label>
              <Button variant="outline" onClick={downloadTemplate} className="w-full bg-transparent">
                <FileText className="mr-2 h-4 w-4" />
                Download CSV Template
              </Button>
            </div>

            <div className="space-y-2">
              <Label htmlFor="file">Select CSV File</Label>
              <Input id="file" type="file" accept=".csv" onChange={(e) => setImportFile(e.target.files?.[0] || null)} />
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsImportOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleImport} disabled={!importFile || importing}>
                {importing ? "Importing..." : "Import Findings"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Export Dialog */}
      <Dialog open={isExportOpen} onOpenChange={setIsExportOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Export Findings</DialogTitle>
            <DialogDescription>Export the current filtered findings data to a file.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>The export will include all findings matching your current filters.</AlertDescription>
            </Alert>

            <div className="space-y-2">
              <Label>Current Filters</Label>
              <div className="text-sm text-muted-foreground space-y-1">
                {currentFilters.searchTerm && <div>Search: {currentFilters.searchTerm}</div>}
                {currentFilters.statusFilter && currentFilters.statusFilter !== "all" && (
                  <div>Status: {currentFilters.statusFilter}</div>
                )}
                {currentFilters.severityFilter && currentFilters.severityFilter !== "all" && (
                  <div>Severity: {currentFilters.severityFilter}</div>
                )}
                {currentFilters.assessmentFilter && currentFilters.assessmentFilter !== "all" && (
                  <div>Assessment: {currentFilters.assessmentFilter}</div>
                )}
                {currentFilters.timelineFilter && currentFilters.timelineFilter !== "all" && (
                  <div>Timeline: {currentFilters.timelineFilter}</div>
                )}
                {!currentFilters.searchTerm &&
                  currentFilters.statusFilter === "all" &&
                  currentFilters.severityFilter === "all" &&
                  currentFilters.assessmentFilter === "all" &&
                  currentFilters.timelineFilter === "all" && <div>No filters applied - exporting all findings</div>}
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsExportOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleExport} disabled={exporting}>
                {exporting ? "Exporting..." : "Export Findings"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
