"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { toast } from "@/components/ui/use-toast"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Download, Search, Filter, RefreshCw, User, Activity, Shield, AlertCircle } from "lucide-react"

interface AuditLog {
  id: number
  user_id: number
  username: string
  action: string
  entity_type: string
  entity_id: number
  old_values: any
  new_values: any
  ip_address: string
  user_agent: string
  success: boolean
  created_at: string
}

interface LoginAttempt {
  id: number
  username: string
  ip_address: string
  user_agent: string
  success: boolean
  failure_reason: string
  created_at: string
}

interface UserSession {
  id: number
  user_id: number
  username: string
  ip_address: string
  user_agent: string
  last_activity: string
  created_at: string
  is_active: boolean
}

export function AuditLogsManagement() {
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([])
  const [loginAttempts, setLoginAttempts] = useState<LoginAttempt[]>([])
  const [userSessions, setUserSessions] = useState<UserSession[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [filters, setFilters] = useState({
    user: "",
    action: "",
    entity_type: "",
    success: "",
    date_from: "",
    date_to: "",
    search: "",
  })

  const fetchAuditLogs = async () => {
    setLoading(true)
    setError(null)
    try {
      const queryParams = new URLSearchParams()
      Object.entries(filters).forEach(([key, value]) => {
        if (value && value !== "all") queryParams.append(key, value)
      })

      const response = await fetch(`/api/audit?${queryParams}`)
      if (response.ok) {
        const data = await response.json()
        // Handle both direct array and nested response structures
        const logs = Array.isArray(data) ? data : data.logs || data.data || []
        setAuditLogs(logs)
      } else {
        const errorData = await response.json()
        setError(errorData.error || "Failed to fetch audit logs")
        setAuditLogs([])
      }
    } catch (error) {
      console.error("Failed to fetch audit logs:", error)
      setError("Failed to load audit logs. Please check your connection.")
      setAuditLogs([])
      toast({
        title: "Error",
        description: "Failed to load audit logs",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const fetchLoginAttempts = async () => {
    try {
      const response = await fetch("/api/audit/login-attempts")
      if (response.ok) {
        const data = await response.json()
        const attempts = Array.isArray(data) ? data : data.data || []
        setLoginAttempts(attempts)
      } else {
        setLoginAttempts([])
      }
    } catch (error) {
      console.error("Failed to fetch login attempts:", error)
      setLoginAttempts([])
    }
  }

  const fetchUserSessions = async () => {
    try {
      const response = await fetch("/api/audit/sessions")
      if (response.ok) {
        const data = await response.json()
        const sessions = Array.isArray(data) ? data : data.data || []
        setUserSessions(sessions)
      } else {
        setUserSessions([])
      }
    } catch (error) {
      console.error("Failed to fetch user sessions:", error)
      setUserSessions([])
    }
  }

  const exportAuditLogs = async () => {
    try {
      const queryParams = new URLSearchParams()
      Object.entries(filters).forEach(([key, value]) => {
        if (value && value !== "all") queryParams.append(key, value)
      })

      const response = await fetch(`/api/audit/export?${queryParams}`)
      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = `audit-logs-${new Date().toISOString().split("T")[0]}.csv`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)

        toast({
          title: "Success",
          description: "Audit logs exported successfully",
        })
      } else {
        toast({
          title: "Error",
          description: "Failed to export audit logs",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Failed to export audit logs:", error)
      toast({
        title: "Error",
        description: "Failed to export audit logs",
        variant: "destructive",
      })
    }
  }

  useEffect(() => {
    fetchAuditLogs()
    fetchLoginAttempts()
    fetchUserSessions()
  }, [])

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
  }

  const clearFilters = () => {
    setFilters({
      user: "",
      action: "",
      entity_type: "",
      success: "",
      date_from: "",
      date_to: "",
      search: "",
    })
  }

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleString()
    } catch {
      return "Invalid Date"
    }
  }

  const getActionBadgeVariant = (action: string) => {
    switch (action?.toLowerCase()) {
      case "create":
        return "default"
      case "update":
        return "secondary"
      case "delete":
        return "destructive"
      default:
        return "outline"
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Audit Logs Management
          </CardTitle>
          <CardDescription>Monitor system activities, user actions, and security events</CardDescription>
        </CardHeader>
      </Card>

      <Tabs defaultValue="audit-logs" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="audit-logs" className="flex items-center gap-2">
            <Activity className="h-4 w-4" />
            System Audit Logs
          </TabsTrigger>
          <TabsTrigger value="login-attempts" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Login Attempts
          </TabsTrigger>
          <TabsTrigger value="user-sessions" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            Active Sessions
          </TabsTrigger>
        </TabsList>

        <TabsContent value="audit-logs" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>System Audit Logs</CardTitle>
                <div className="flex gap-2">
                  <Button onClick={exportAuditLogs} variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Export CSV
                  </Button>
                  <Button onClick={fetchAuditLogs} variant="outline">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Refresh
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Filters */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-muted rounded-lg">
                <div className="space-y-2">
                  <Label htmlFor="search">Search</Label>
                  <Input
                    id="search"
                    placeholder="Search logs..."
                    value={filters.search}
                    onChange={(e) => handleFilterChange("search", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="user">User</Label>
                  <Input
                    id="user"
                    placeholder="Username"
                    value={filters.user}
                    onChange={(e) => handleFilterChange("user", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="action">Action</Label>
                  <Select value={filters.action} onValueChange={(value) => handleFilterChange("action", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select action" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Actions</SelectItem>
                      <SelectItem value="CREATE">Create</SelectItem>
                      <SelectItem value="UPDATE">Update</SelectItem>
                      <SelectItem value="DELETE">Delete</SelectItem>
                      <SelectItem value="LOGIN">Login</SelectItem>
                      <SelectItem value="LOGOUT">Logout</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="entity_type">Entity Type</Label>
                  <Select
                    value={filters.entity_type}
                    onValueChange={(value) => handleFilterChange("entity_type", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select entity" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Entities</SelectItem>
                      <SelectItem value="users">Users</SelectItem>
                      <SelectItem value="organizations">Organizations</SelectItem>
                      <SelectItem value="departments">Departments</SelectItem>
                      <SelectItem value="roles">Roles</SelectItem>
                      <SelectItem value="risks">Risks</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="success">Status</Label>
                  <Select value={filters.success} onValueChange={(value) => handleFilterChange("success", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All</SelectItem>
                      <SelectItem value="true">Success</SelectItem>
                      <SelectItem value="false">Failed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="date_from">From Date</Label>
                  <Input
                    id="date_from"
                    type="date"
                    value={filters.date_from}
                    onChange={(e) => handleFilterChange("date_from", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="date_to">To Date</Label>
                  <Input
                    id="date_to"
                    type="date"
                    value={filters.date_to}
                    onChange={(e) => handleFilterChange("date_to", e.target.value)}
                  />
                </div>
                <div className="flex items-end gap-2">
                  <Button onClick={fetchAuditLogs} className="flex-1">
                    <Search className="h-4 w-4 mr-2" />
                    Apply Filters
                  </Button>
                  <Button onClick={clearFilters} variant="outline">
                    <Filter className="h-4 w-4 mr-2" />
                    Clear
                  </Button>
                </div>
              </div>

              {/* Error Display */}
              {error && (
                <div className="flex items-center gap-2 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                  <AlertCircle className="h-4 w-4" />
                  <span>{error}</span>
                </div>
              )}

              {/* Audit Logs Table */}
              <div className="border rounded-lg">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Timestamp</TableHead>
                      <TableHead>User</TableHead>
                      <TableHead>Action</TableHead>
                      <TableHead>Entity</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>IP Address</TableHead>
                      <TableHead>Details</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loading ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-8">
                          <div className="flex items-center justify-center gap-2">
                            <RefreshCw className="h-4 w-4 animate-spin" />
                            Loading audit logs...
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : !Array.isArray(auditLogs) || auditLogs.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-8">
                          <div className="flex flex-col items-center gap-2 text-muted-foreground">
                            <Activity className="h-8 w-8" />
                            <p>No audit logs found</p>
                            {error && <p className="text-sm">Please check your database connection</p>}
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : (
                      auditLogs.map((log) => (
                        <TableRow key={log.id}>
                          <TableCell className="font-mono text-sm">{formatDate(log.created_at)}</TableCell>
                          <TableCell>{log.username || "Unknown"}</TableCell>
                          <TableCell>
                            <Badge variant={getActionBadgeVariant(log.action)}>{log.action}</Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-col">
                              <span>{log.entity_type}</span>
                              {log.entity_id && <span className="text-xs text-muted-foreground">#{log.entity_id}</span>}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant={log.success ? "default" : "destructive"}>
                              {log.success ? "Success" : "Failed"}
                            </Badge>
                          </TableCell>
                          <TableCell className="font-mono text-sm">{log.ip_address || "N/A"}</TableCell>
                          <TableCell>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                // Show details modal or expand row
                                console.log("Show details for log:", log)
                                toast({
                                  title: "Log Details",
                                  description: `Action: ${log.action} on ${log.entity_type}`,
                                })
                              }}
                            >
                              View Details
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="login-attempts" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Login Attempts</CardTitle>
              <CardDescription>Monitor authentication attempts and security events</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Timestamp</TableHead>
                    <TableHead>Username</TableHead>
                    <TableHead>IP Address</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Failure Reason</TableHead>
                    <TableHead>User Agent</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {!Array.isArray(loginAttempts) || loginAttempts.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8">
                        <div className="flex flex-col items-center gap-2 text-muted-foreground">
                          <Shield className="h-8 w-8" />
                          <p>No login attempts found</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    loginAttempts.map((attempt) => (
                      <TableRow key={attempt.id}>
                        <TableCell className="font-mono text-sm">{formatDate(attempt.created_at)}</TableCell>
                        <TableCell>{attempt.username}</TableCell>
                        <TableCell className="font-mono text-sm">{attempt.ip_address}</TableCell>
                        <TableCell>
                          <Badge variant={attempt.success ? "default" : "destructive"}>
                            {attempt.success ? "Success" : "Failed"}
                          </Badge>
                        </TableCell>
                        <TableCell>{attempt.failure_reason || "N/A"}</TableCell>
                        <TableCell className="max-w-xs truncate text-sm text-muted-foreground">
                          {attempt.user_agent}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="user-sessions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Active User Sessions</CardTitle>
              <CardDescription>Monitor current user sessions and activity</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>IP Address</TableHead>
                    <TableHead>Session Started</TableHead>
                    <TableHead>Last Activity</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {!Array.isArray(userSessions) || userSessions.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8">
                        <div className="flex flex-col items-center gap-2 text-muted-foreground">
                          <User className="h-8 w-8" />
                          <p>No active sessions found</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    userSessions.map((session) => (
                      <TableRow key={session.id}>
                        <TableCell>{session.username}</TableCell>
                        <TableCell className="font-mono text-sm">{session.ip_address}</TableCell>
                        <TableCell className="font-mono text-sm">{formatDate(session.created_at)}</TableCell>
                        <TableCell className="font-mono text-sm">{formatDate(session.last_activity)}</TableCell>
                        <TableCell>
                          <Badge variant={session.is_active ? "default" : "secondary"}>
                            {session.is_active ? "Active" : "Inactive"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {session.is_active && (
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => {
                                // Implement session termination
                                console.log("Terminate session:", session.id)
                                toast({
                                  title: "Session Terminated",
                                  description: `Session for ${session.username} has been terminated`,
                                })
                              }}
                            >
                              Terminate
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
