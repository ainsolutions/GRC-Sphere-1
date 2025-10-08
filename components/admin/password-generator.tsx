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
import { Key, RefreshCw, Eye, EyeOff, Copy, Shield, UserIcon, Building2, Briefcase, CheckCircle } from "lucide-react"
import { getOrganizations } from "@/lib/actions/organization-actions"
import { getDepartments } from "@/lib/actions/department-actions"

interface AdminUser {
  id: number
  username: string
  first_name: string
  last_name: string
  email: string
  status: string
  organization_name: string
  department_name: string
}

interface Organization {
  id: number
  name: string
}

interface Department {
  id: number
  name: string
  organization_id: number
}

export function PasswordGenerator() {
  const [users, setUsers] = useState<AdminUser[]>([])
  const [organizations, setOrganizations] = useState<Organization[]>([])
  const [departments, setDepartments] = useState<Department[]>([])
  const [selectedOrgId, setSelectedOrgId] = useState<string>("")
  const [selectedDeptId, setSelectedDeptId] = useState<string>("")
  const [selectedUserId, setSelectedUserId] = useState<string>("")
  const [customPassword, setCustomPassword] = useState("")
  const [generatedPassword, setGeneratedPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)

  // Fetch organizations and departments on component mount
  useEffect(() => {
    const fetchData = async () => {
      const [orgsResult, deptsResult] = await Promise.all([getOrganizations(), getDepartments()])

      if (orgsResult.success) setOrganizations(orgsResult.data)
      if (deptsResult.success) setDepartments(deptsResult.data)
    }

    fetchData()
  }, [])

  // Fetch users when filters change
  useEffect(() => {
    fetchUsers()
  }, [selectedOrgId, selectedDeptId])

  const fetchUsers = async () => {
    setIsLoading(true)
    try {
      const params = new URLSearchParams()
      if (selectedOrgId) params.append("organizationId", selectedOrgId)
      if (selectedDeptId) params.append("departmentId", selectedDeptId)

      const response = await fetch(`/api/users/password?${params}`)
      const result = await response.json()

      if (result.success) {
        setUsers(result.data)
      } else {
        toast({
          title: "Error",
          description: "Failed to fetch users",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Failed to fetch users:", error)
      toast({
        title: "Error",
        description: "Failed to fetch users",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const generatePassword = () => {
    setIsGenerating(true)
    // Simulate generation delay for better UX
    setTimeout(() => {
      const lowercase = "abcdefghijklmnopqrstuvwxyz"
      const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
      const numbers = "0123456789"
      const symbols = "!@#$%^&*()_+-=[]{}|;:,.<>?"

      const allChars = lowercase + uppercase + numbers + symbols
      let password = ""

      // Ensure at least one character from each category
      password += lowercase[Math.floor(Math.random() * lowercase.length)]
      password += uppercase[Math.floor(Math.random() * uppercase.length)]
      password += numbers[Math.floor(Math.random() * numbers.length)]
      password += symbols[Math.floor(Math.random() * symbols.length)]

      // Fill the rest randomly
      for (let i = 4; i < 12; i++) {
        password += allChars[Math.floor(Math.random() * allChars.length)]
      }

      // Shuffle the password
      const shuffled = password
        .split("")
        .sort(() => Math.random() - 0.5)
        .join("")
      setGeneratedPassword(shuffled)
      setCustomPassword(shuffled)
      setIsGenerating(false)
    }, 500)
  }

  const updatePassword = async (useGenerated = false) => {
    if (!selectedUserId) {
      toast({
        title: "Error",
        description: "Please select a user",
        variant: "destructive",
      })
      return
    }

    if (!useGenerated && !customPassword) {
      toast({
        title: "Error",
        description: "Please enter a password or generate one",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch("/api/users/password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: selectedUserId,
          password: useGenerated ? undefined : customPassword,
          generateNew: useGenerated,
        }),
      })

      const result = await response.json()

      if (result.success) {
        toast({
          title: "Success",
          description: "Password updated successfully",
        })

        if (result.generatedPassword) {
          setGeneratedPassword(result.generatedPassword)
          setCustomPassword(result.generatedPassword)
        }

        // Reset form
        setSelectedUserId("")
        setCustomPassword("")
        setGeneratedPassword("")
        setShowPassword(false)
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to update password",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Failed to update password:", error)
      toast({
        title: "Error",
        description: "Failed to update password",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast({
      title: "Copied",
      description: "Password copied to clipboard",
    })
  }

  const filteredDepartments = departments.filter(
    (dept) => !selectedOrgId || dept.organization_id.toString() === selectedOrgId,
  )

  const selectedUser = users.find((user) => user.id.toString() === selectedUserId)

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Key className="h-5 w-5" />
            Password Generation Utility
          </CardTitle>
          <CardDescription>Generate and update passwords for active users in the system</CardDescription>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Selection Panel */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserIcon className="h-4 w-4" />
              User Selection
            </CardTitle>
            <CardDescription>Filter and select users by organization and department</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="organization">Organization</Label>
              <Select
                value={selectedOrgId}
                onValueChange={(value) => {
                  setSelectedOrgId(value)
                  setSelectedDeptId("")
                  setSelectedUserId("")
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select organization (optional)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Organizations</SelectItem>
                  {organizations.map((org) => (
                    <SelectItem key={org.id} value={org.id.toString()}>
                      <div className="flex items-center gap-2">
                        <Building2 className="h-4 w-4" />
                        {org.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="department">Department</Label>
              <Select
                value={selectedDeptId}
                onValueChange={(value) => {
                  setSelectedDeptId(value)
                  setSelectedUserId("")
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select department (optional)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Departments</SelectItem>
                  {filteredDepartments.map((dept) => (
                    <SelectItem key={dept.id} value={dept.id.toString()}>
                      <div className="flex items-center gap-2">
                        <Briefcase className="h-4 w-4" />
                        {dept.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="user">User</Label>
              <Select value={selectedUserId} onValueChange={setSelectedUserId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select user" />
                </SelectTrigger>
                <SelectContent>
                  {users.map((user) => (
                    <SelectItem key={user.id} value={user.id.toString()}>
                      <div className="flex items-center justify-between w-full">
                        <span>
                          {user.first_name} {user.last_name} ({user.username})
                        </span>
                        <Badge variant="outline" className="ml-2">
                          {user.status}
                        </Badge>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {selectedUser && (
              <Card className="bg-muted/50">
                <CardContent className="pt-4">
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="font-medium">Name:</span>
                      <span>
                        {selectedUser.first_name} {selectedUser.last_name}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Username:</span>
                      <span>{selectedUser.username}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Email:</span>
                      <span>{selectedUser.email}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Organization:</span>
                      <span>{selectedUser.organization_name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Department:</span>
                      <span>{selectedUser.department_name || "N/A"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Status:</span>
                      <Badge variant={selectedUser.status === "Active" ? "default" : "secondary"}>
                        {selectedUser.status}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </CardContent>
        </Card>

        {/* Password Generation Panel */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Password Management
            </CardTitle>
            <CardDescription>Generate secure passwords or set custom ones</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={customPassword}
                    onChange={(e) => setCustomPassword(e.target.value)}
                    placeholder="Enter custom password or generate one"
                    className="pr-20"
                  />
                  <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowPassword(!showPassword)}
                      className="h-6 w-6 p-0"
                    >
                      {showPassword ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                    </Button>
                    {customPassword && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(customPassword)}
                        className="h-6 w-6 p-0"
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <Button
              onClick={generatePassword}
              disabled={isGenerating}
              variant="outline"
              className="w-full bg-transparent"
            >
              {isGenerating ? <RefreshCw className="h-4 w-4 mr-2 animate-spin" /> : <Key className="h-4 w-4 mr-2" />}
              Generate Secure Password
            </Button>

            {generatedPassword && (
              <Card className="bg-green-50 border-green-200">
                <CardContent className="pt-4">
                  <div className="flex items-center gap-2 text-green-800">
                    <CheckCircle className="h-4 w-4" />
                    <span className="text-sm font-medium">Generated Password:</span>
                  </div>
                  <div className="mt-2 p-2 bg-white rounded border font-mono text-sm break-all">
                    {showPassword ? generatedPassword : "••••••••••••"}
                  </div>
                </CardContent>
              </Card>
            )}

            <div className="flex gap-2 pt-4">
              <Button
                onClick={() => updatePassword(false)}
                disabled={isLoading || !selectedUserId || !customPassword}
                className="flex-1"
              >
                {isLoading ? <RefreshCw className="h-4 w-4 mr-2 animate-spin" /> : <Key className="h-4 w-4 mr-2" />}
                Update Password
              </Button>
              <Button
                onClick={() => updatePassword(true)}
                disabled={isLoading || !selectedUserId}
                variant="outline"
                className="flex-1"
              >
                {isLoading ? <RefreshCw className="h-4 w-4 mr-2 animate-spin" /> : <Shield className="h-4 w-4 mr-2" />}
                Generate & Update
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Active Users Table */}
      <Card>
        <CardHeader>
          <CardTitle>Active Users</CardTitle>
          <CardDescription>
            {users.length} active user{users.length !== 1 ? "s" : ""} found
            {selectedOrgId && ` in ${organizations.find((o) => o.id.toString() === selectedOrgId)?.name}`}
            {selectedDeptId && ` - ${departments.find((d) => d.id.toString() === selectedDeptId)?.name}`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Username</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Organization</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
                      <div className="flex items-center justify-center gap-2">
                        <RefreshCw className="h-4 w-4 animate-spin" />
                        Loading users...
                      </div>
                    </TableCell>
                  </TableRow>
                ) : users.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
                      <div className="flex flex-col items-center gap-2 text-muted-foreground">
                        <UserIcon className="h-8 w-8" />
                        <p>No active users found</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  users.map((user) => (
                    <TableRow key={user.id} className={selectedUserId === user.id.toString() ? "bg-muted/50" : ""}>
                      <TableCell className="font-medium">
                        {user.first_name} {user.last_name}
                      </TableCell>
                      <TableCell>{user.username}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{user.organization_name}</TableCell>
                      <TableCell>{user.department_name || "N/A"}</TableCell>
                      <TableCell>
                        <Badge variant="default">{user.status}</Badge>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
