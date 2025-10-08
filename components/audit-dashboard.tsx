"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts"
import { Activity, Shield, Eye, AlertTriangle, TrendingUp, TrendingDown } from "lucide-react"

const activityData = [
  { hour: "00", activities: 12 },
  { hour: "04", activities: 8 },
  { hour: "08", activities: 45 },
  { hour: "12", activities: 67 },
  { hour: "16", activities: 52 },
  { hour: "20", activities: 23 },
]

const actionTypeData = [
  { name: "CREATE", value: 145, color: "#22c55e" },
  { name: "UPDATE", value: 89, color: "#3b82f6" },
  { name: "DELETE", value: 23, color: "#ef4444" },
  { name: "READ", value: 234, color: "#8b5cf6" },
]

const securityEventsData = [
  { date: "Jan 1", failed_logins: 3, suspicious_activity: 1 },
  { date: "Jan 2", failed_logins: 5, suspicious_activity: 2 },
  { date: "Jan 3", failed_logins: 2, suspicious_activity: 0 },
  { date: "Jan 4", failed_logins: 8, suspicious_activity: 3 },
  { date: "Jan 5", failed_logins: 4, suspicious_activity: 1 },
]

export function AuditDashboard() {
  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="gradient-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Activities</CardTitle>
            <Activity className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,247</div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="inline h-3 w-3 mr-1" />
              +12% from yesterday
            </p>
          </CardContent>
        </Card>

        <Card className="gradient-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Security Events</CardTitle>
            <Shield className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">23</div>
            <p className="text-xs text-muted-foreground">
              <TrendingDown className="inline h-3 w-3 mr-1" />
              -5% from yesterday
            </p>
          </CardContent>
        </Card>

        <Card className="gradient-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <Eye className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">89</div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="inline h-3 w-3 mr-1" />
              +3 new users today
            </p>
          </CardContent>
        </Card>

        <Card className="gradient-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Failed Actions</CardTitle>
            <AlertTriangle className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">7</div>
            <p className="text-xs text-muted-foreground">Requires investigation</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Activity Timeline */}
        <Card className="gradient-card">
          <CardHeader>
            <CardTitle>Activity Timeline</CardTitle>
            <CardDescription>User activities throughout the day</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={activityData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="hour" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="activities" stroke="#8884d8" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Action Distribution */}
        <Card className="gradient-card">
          <CardHeader>
            <CardTitle>Action Distribution</CardTitle>
            <CardDescription>Breakdown of user actions</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={actionTypeData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {actionTypeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Security Events Trend */}
      <Card className="gradient-card">
        <CardHeader>
          <CardTitle>Security Events Trend</CardTitle>
          <CardDescription>Failed logins and suspicious activities over time</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={securityEventsData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="failed_logins" fill="#ef4444" name="Failed Logins" />
              <Bar dataKey="suspicious_activity" fill="#f97316" name="Suspicious Activity" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Recent Critical Events */}
      <Card className="gradient-card">
        <CardHeader>
          <CardTitle>Recent Critical Events</CardTitle>
          <CardDescription>High-priority security events requiring attention</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-4">
            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
            <div className="flex-1">
              <p className="text-sm font-medium">Multiple failed login attempts from suspicious IP</p>
              <p className="text-xs text-muted-foreground">203.0.113.1 - 2 hours ago</p>
            </div>
            <Badge variant="destructive">Critical</Badge>
          </div>
          <div className="flex items-center space-x-4">
            <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
            <div className="flex-1">
              <p className="text-sm font-medium">Unauthorized access attempt to sensitive data</p>
              <p className="text-xs text-muted-foreground">user@external.com - 4 hours ago</p>
            </div>
            <Badge variant="secondary">High</Badge>
          </div>
          <div className="flex items-center space-x-4">
            <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
            <div className="flex-1">
              <p className="text-sm font-medium">Bulk data export by privileged user</p>
              <p className="text-xs text-muted-foreground">admin@company.com - 6 hours ago</p>
            </div>
            <Badge variant="outline">Medium</Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
