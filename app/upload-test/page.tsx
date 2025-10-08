"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle, Upload, AlertCircle } from "lucide-react"

export default function UploadTestPage() {
  const [file, setFile] = useState<File | null>(null)
  const [policyId, setPolicyId] = useState("1")
  const [uploading, setUploading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  const handleFileUpload = async () => {
    if (!file || !policyId) {
      setError("Please select a file and enter a policy ID")
      return
    }

    setUploading(true)
    setError(null)
    setResult(null)

    try {
      const formData = new FormData()
      formData.append("file", file)
      formData.append("policy_id", policyId)

      const response = await fetch(`/api/policies/${policyId}/attachments`, {
        method: "POST",
        body: formData,
      })

      const data = await response.json()

      if (response.ok) {
        setResult(data)
      } else {
        setError(data.error || "Upload failed")
      }
    } catch (err) {
      setError("Network error occurred")
    } finally {
      setUploading(false)
    }
  }

  const testGetAttachments = async () => {
    try {
      const response = await fetch(`/api/policies/${policyId}/attachments`)
      const data = await response.json()
      setResult({ attachments: data })
    } catch (err) {
      setError("Failed to fetch attachments")
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5" />
              File Upload Test
            </CardTitle>
            <CardDescription>
              Test the policy file upload functionality
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="policy-id">Policy ID</Label>
              <Input
                id="policy-id"
                value={policyId}
                onChange={(e) => setPolicyId(e.target.value)}
                placeholder="Enter policy ID (e.g., 1)"
              />
            </div>

            <div>
              <Label htmlFor="file-upload">Select File</Label>
              <Input
                id="file-upload"
                type="file"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                accept=".pdf,.doc,.docx,.txt,.jpg,.png"
              />
              {file && (
                <p className="text-sm text-gray-600 mt-1">
                  Selected: {file.name} ({(file.size / 1024).toFixed(1)} KB)
                </p>
              )}
            </div>

            <div className="flex gap-2">
              <Button
                onClick={handleFileUpload}
                disabled={!file || !policyId || uploading}
                className="flex-1"
              >
                {uploading ? "Uploading..." : "Upload File"}
              </Button>

              <Button
                variant="outline"
                onClick={testGetAttachments}
                disabled={!policyId}
              >
                Get Attachments
              </Button>
            </div>
          </CardContent>
        </Card>

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {result && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-600">
                <CheckCircle className="h-5 w-5" />
                Success
              </CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="bg-gray-100 p-4 rounded text-sm overflow-x-auto">
                {JSON.stringify(result, null, 2)}
              </pre>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle>API Endpoints</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div>
              <strong>Upload:</strong> POST /api/policies/[id]/attachments
            </div>
            <div>
              <strong>Get Attachments:</strong> GET /api/policies/[id]/attachments
            </div>
            <div>
              <strong>Download File:</strong> GET /api/files/[filename]
            </div>
            <div>
              <strong>Delete Attachment:</strong> DELETE /api/policy-attachments/[id]
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
