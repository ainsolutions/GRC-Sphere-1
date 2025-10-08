"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, XCircle, AlertCircle, Database, Server, Shield } from "lucide-react"

interface SystemStatus {
  database: boolean
  auditLogging: boolean
  environment: string
}

export function SystemStatus() {
  const [status, setStatus] = useState<SystemStatus>({
    database: false,
    auditLogging: false,
    environment: "development",
  })

  useEffect(() => {
    const checkSystemStatus = async () => {
      try {
        // Check database connection
        const auditResponse = await fetch("/api/audit?limit=1")
        const auditData = await auditResponse.json()

        setStatus({
          database: !auditData.warning,
          auditLogging: !auditData.warning,
          environment: process.env.NODE_ENV || "development",
        })
      } catch (error) {
        setStatus({
          database: false,
          auditLogging: false,
          environment: "development",
        })
      }
    }

    checkSystemStatus()
  }, [])

  const getStatusIcon = (isActive: boolean) => {
    return isActive ? <CheckCircle className="h-4 w-4 text-green-600" /> : <XCircle className="h-4 w-4 text-red-600" />
  }

  const getStatusBadge = (isActive: boolean) => {
    return <Badge variant={isActive ? "default" : "destructive"}>{isActive ? "Active" : "Inactive"}</Badge>
  }

  return (
    <Card className="gradient-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Server className="h-5 w-5" />
          System Status
        </CardTitle>
        <CardDescription>Current system component status</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Database className="h-4 w-4" />
            <span className="text-sm font-medium">Database Connection</span>
          </div>
          <div className="flex items-center space-x-2">
            {getStatusIcon(status.database)}
            {getStatusBadge(status.database)}
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Shield className="h-4 w-4" />
            <span className="text-sm font-medium">Audit Logging</span>
          </div>
          <div className="flex items-center space-x-2">
            {getStatusIcon(status.auditLogging)}
            {getStatusBadge(status.auditLogging)}
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <AlertCircle className="h-4 w-4" />
            <span className="text-sm font-medium">Environment</span>
          </div>
          <Badge variant="outline">{status.environment}</Badge>
        </div>

        {!status.database && (
          <div className="mt-4 p-3 bg-orange-50 border border-orange-200 rounded-md">
            <p className="text-sm text-orange-800">
              <strong>Setup Required:</strong> Configure your database connection by adding the Neon integration or
              setting the DATABASE_URL environment variable to enable full functionality.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
