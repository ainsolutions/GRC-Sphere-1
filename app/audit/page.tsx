"use client"

import { useState, useEffect } from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Search, CalendarIcon, Download, Filter, Eye, Shield, Activity, FileText } from "lucide-react"
import { format } from "date-fns"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

interface AuditLog {
  id: number
  user_id: string
  user_email: string
  action: string
  entity_type: string
  entity_id?: string
  old_values?: any
  new_values?: any
  ip_address?: string
  user_agent?: string
  timestamp: string
  success: boolean
  error_message?: string
}

const mockAuditLogs: AuditLog[] = [
  {
    id: 1,
    user_id: "user123",
    user_email: "john.doe@company.com",
    action: "CREATE",
    entity_type: "ASSET",
    entity_id: "ASSET-001",
    new_values: { name: "Customer Database", type: "Database" },
    ip_address: "192.168.1.100",
    timestamp: "2024-01-15T10:30:00Z",
    success: true,
  },
  {
    id: 2,
    user_id: "user456",
    user_email: "jane.smith@company.com",
    action: "UPDATE",
    entity_type: "RISK",
    entity_id: "RISK-001",
    old_values: { status: "Open", likelihood: 3 },
    new_values: { status: "Mitigated", likelihood: 2 },
    ip_address: "192.168.1.101",
    timestamp: "2024-01-15T11:15:00Z",
    success: true,
  },
  {
    id: 3,
    user_id: "user789",
    user_email: "admin@company.com",
    action: "DELETE",
    entity_type: "CONTROL",
    entity_id: "CTRL-005",
    old_values: { name: "Deprecated Control", status: "Inactive" },
    ip_address: "192.168.1.102",
    timestamp: "2024-01-15T12:00:00Z",
    success: true,
  },
  {
    id: 4,
    user_id: "user123",
    user_email: "john.doe@company.com",
    action: "LOGIN",
    entity_type: "USER",
    ip_address: "192.168.1.100",
    timestamp: "2024-01-15T09:00:00Z",
    success: true,
  },
  {
    id: 5,
    user_id: "user999",
    user_email: "hacker@malicious.com",
    action: "LOGIN_FAILED",
    entity_type: "USER",
    ip_address: "203.0.113.1",
    timestamp: "2024-01-15T08:45:00Z",
    success: false,
    error_message: "Invalid credentials",
  },
]

export default function AuditPage() {
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(mockAuditLogs)
  const [filteredLogs, setFilteredLogs] = useState<AuditLog[]>(mockAuditLogs)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedAction, setSelectedAction] = useState<string>("all")
  const [selectedEntityType, setSelectedEntityType] = useState<string>("all")
  const [selectedUser, setSelectedUser] = useState<string>("all")
  const [dateRange, setDateRange] = useState<{ from?: Date; to?: Date }>({})
  const [showFailedOnly, setShowFailedOnly] = useState(false)
  const [isDatabaseConnected, setIsDatabaseConnected] = useState(true)

  useEffect(() => {
    // Check if we're getting real data or mock data
    const checkDatabaseConnection = async () => {
      try {
        const response = await fetch("/api/audit?limit=1")
        const data = await response.json()
        if (data.warning) {
          setIsDatabaseConnected(false)
        }
      } catch (error) {
        setIsDatabaseConnected(false)
      }
    }

    checkDatabaseConnection()
  }, [])

  useEffect(() => {
    let filtered = auditLogs

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (log) =>
          log.user_email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
          log.entity_type.toLowerCase().includes(searchTerm.toLowerCase()) ||
          log.entity_id?.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // Filter by action
    if (selectedAction !== "all") {
      filtered = filtered.filter((log) => log.action === selectedAction)
    }

    // Filter by entity type
    if (selectedEntityType !== "all") {
      filtered = filtered.filter((log) => log.entity_type === selectedEntityType)
    }

    // Filter by user
    if (selectedUser !== "all") {
      filtered = filtered.filter((log) => log.user_email === selectedUser)
    }

    // Filter by success/failure
    if (showFailedOnly) {
      filtered = filtered.filter((log) => !log.success)
    }

    // Filter by date range
    if (dateRange.from) {
      filtered = filtered.filter((log) => new Date(log.timestamp) >= dateRange.from!)
    }
    if (dateRange.to) {
      filtered = filtered.filter((log) => new Date(log.timestamp) <= dateRange.to!)
    }

    setFilteredLogs(filtered)
  }, [auditLogs, searchTerm, selectedAction, selectedEntityType, selectedUser, showFailedOnly, dateRange])

  const getActionColor = (action: string) => {
    switch (action) {
      case "CREATE":
        return "default"
      case "UPDATE":
        return "secondary"
      case "DELETE":
        return "destructive"
      case "LOGIN":
        return "outline"
      case "LOGIN_FAILED":
        return "destructive"
      default:
        return "outline"
    }
  }

  const getEntityIcon = (entityType: string) => {
    switch (entityType) {
      case "ASSET":
        return <FileText className="h-4 w-4" />
      case "RISK":
        return <Shield className="h-4 w-4" />
      case "CONTROL":
        return <Shield className="h-4 w-4" />
      case "INCIDENT":
        return <Activity className="h-4 w-4" />
      case "USER":
        return <Eye className="h-4 w-4" />
      default:
        return <FileText className="h-4 w-4" />
    }
  }

  const exportAuditLogs = () => {
    const csv = [
      ["Timestamp", "User", "Action", "Entity Type", "Entity ID", "IP Address", "Success", "Error Message"].join(","),
      ...filteredLogs.map((log) =>
        [
          log.timestamp,
          log.user_email,
          log.action,
          log.entity_type,
          log.entity_id || "",
          log.ip_address || "",
          log.success ? "Yes" : "No",
          log.error_message || "",
        ].join(","),
      ),
    ].join("\n")

    const blob = new Blob([csv], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `audit-logs-${format(new Date(), "yyyy-MM-dd")}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  const uniqueUsers = Array.from(new Set(auditLogs.map((log) => log.user_email)))
  const uniqueActions = Array.from(new Set(auditLogs.map((log) => log.action)))
  const uniqueEntityTypes = Array.from(new Set(auditLogs.map((log) => log.entity_type)))

  return (
    <div className="min-h-screen aurora-bg">
      <div className="aurora-overlay"></div>
      <div className="flex aurora-content">
        {/* <Sidebar /> */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* <Header /> */}
          <main className="flex-1 overflow-y-auto p-6">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold  animate-pulse">
                  Audit Trail
                </h1>
                <p className="text-muted-foreground">Comprehensive logging of all system activities</p>
              </div>
              <Button onClick={exportAuditLogs} className="gradient-bg text-white">
                <Download className="mr-2 h-4 w-4" />
                Export Logs
              </Button>
            </div>
            {!isDatabaseConnected && (
              <Alert className="border-orange-200 bg-orange-50">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Development Mode</AlertTitle>
                <AlertDescription>
                  Database connection not configured. Audit logging is using console output for development. Configure
                  the DATABASE_URL environment variable to enable full audit functionality.
                </AlertDescription>
              </Alert>
            )}

            {/* Summary Cards */}
            <div className="grid gap-4 md:grid-cols-4">
              <Card className="gradient-card">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Activities</CardTitle>
                  <Activity className="h-4 w-4 text-blue-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{auditLogs.length}</div>
                  <p className="text-xs text-muted-foreground">All logged activities</p>
                </CardContent>
              </Card>
              <Card className="gradient-card">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Failed Actions</CardTitle>
                  <Shield className="h-4 w-4 text-red-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{auditLogs.filter((log) => !log.success).length}</div>
                  <p className="text-xs text-muted-foreground">Security incidents</p>
                </CardContent>
              </Card>
              <Card className="gradient-card">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Users</CardTitle>
                  <Eye className="h-4 w-4 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{uniqueUsers.length}</div>
                  <p className="text-xs text-muted-foreground">Unique users today</p>
                </CardContent>
              </Card>
              <Card className="gradient-card">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Data Changes</CardTitle>
                  <FileText className="h-4 w-4 text-purple-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {auditLogs.filter((log) => ["CREATE", "UPDATE", "DELETE"].includes(log.action)).length}
                  </div>
                  <p className="text-xs text-muted-foreground">CRUD operations</p>
                </CardContent>
              </Card>
            </div>

            {/* Filters */}
            <Card className="gradient-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Filter className="h-4 w-4" />
                  Filters
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Search</label>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        placeholder="Search logs..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Action</label>
                    <Select value={selectedAction} onValueChange={setSelectedAction}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Actions</SelectItem>
                        {uniqueActions.map((action) => (
                          <SelectItem key={action} value={action}>
                            {action}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Entity Type</label>
                    <Select value={selectedEntityType} onValueChange={setSelectedEntityType}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Types</SelectItem>
                        {uniqueEntityTypes.map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">User</label>
                    <Select value={selectedUser} onValueChange={setSelectedUser}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Users</SelectItem>
                        {uniqueUsers.map((user) => (
                          <SelectItem key={user} value={user}>
                            {user}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Date Range</label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="w-full justify-start text-left font-normal">
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {dateRange.from ? (
                            dateRange.to ? (
                              <>
                                {format(dateRange.from, "LLL dd, y")} - {format(dateRange.to, "LLL dd, y")}
                              </>
                            ) : (
                              format(dateRange.from, "LLL dd, y")
                            )
                          ) : (
                            <span>Pick a date</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          initialFocus
                          mode="range"
                          defaultMonth={dateRange.from}
                          selected={dateRange}
                          onSelect={setDateRange}
                          numberOfMonths={2}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Status</label>
                    <Select
                      value={showFailedOnly ? "failed" : "all"}
                      onValueChange={(value) => setShowFailedOnly(value === "failed")}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="failed">Failed Only</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Audit Logs Table */}
            <Card className="gradient-card">
              <CardHeader>
                <CardTitle>Audit Logs</CardTitle>
                <CardDescription>
                  Showing {filteredLogs.length} of {auditLogs.length} audit entries
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Timestamp</TableHead>
                      <TableHead>User</TableHead>
                      <TableHead>Action</TableHead>
                      <TableHead>Entity</TableHead>
                      <TableHead>Entity ID</TableHead>
                      <TableHead>IP Address</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Details</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredLogs.map((log) => (
                      <TableRow key={log.id}>
                        <TableCell className="font-mono text-sm">
                          {format(new Date(log.timestamp), "MMM dd, HH:mm:ss")}
                        </TableCell>
                        <TableCell>{log.user_email}</TableCell>
                        <TableCell>
                          <Badge variant={getActionColor(log.action)}>{log.action}</Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            {getEntityIcon(log.entity_type)}
                            <span>{log.entity_type}</span>
                          </div>
                        </TableCell>
                        <TableCell className="font-mono text-sm">{log.entity_id || "-"}</TableCell>
                        <TableCell className="font-mono text-sm">{log.ip_address || "-"}</TableCell>
                        <TableCell>
                          <Badge variant={log.success ? "default" : "destructive"}>
                            {log.success ? "Success" : "Failed"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {log.error_message && <span className="text-red-600 text-sm">{log.error_message}</span>}
                          {log.old_values && (
                            <div className="text-xs text-muted-foreground">
                              Changed: {Object.keys(log.old_values).join(", ")}
                            </div>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </main>
        </div>
      </div>
    </div>
  )
}
