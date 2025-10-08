"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/use-toast"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Settings,
  Shield,
  Mail,
  Globe,
  Bell,
  Database,
  Plus,
  Edit,
  Trash2,
  Save,
  RefreshCw,
  TestTube,
  Eye,
  EyeOff,
  AlertCircle,
} from "lucide-react"

interface SystemConfig {
  id: number
  key: string
  value: string
  category: string
  description: string
  data_type: string
  is_sensitive: boolean
  created_at: string
  updated_at: string
}

interface ConfigFormData {
  key: string
  value: string
  category: string
  description: string
  data_type: string
  is_sensitive: boolean
}

const categories = [
  { value: "security", label: "Security", icon: Shield },
  { value: "email", label: "Email", icon: Mail },
  { value: "general", label: "General", icon: Globe },
  { value: "notifications", label: "Notifications", icon: Bell },
  { value: "backup", label: "Backup", icon: Database },
]

const dataTypes = [
  { value: "string", label: "String" },
  { value: "number", label: "Number" },
  { value: "boolean", label: "Boolean" },
  { value: "json", label: "JSON" },
]

export function SystemConfiguration() {
  const [configs, setConfigs] = useState<SystemConfig[]>([])
  const [loading, setLoading] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingConfig, setEditingConfig] = useState<SystemConfig | null>(null)
  const [showSensitive, setShowSensitive] = useState<Record<number, boolean>>({})
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const [testEmailAddress, setTestEmailAddress] = useState("")
  const [isTestingEmail, setIsTestingEmail] = useState(false)

  const [formData, setFormData] = useState<ConfigFormData>({
    key: "",
    value: "",
    category: "general",
    description: "",
    data_type: "string",
    is_sensitive: false,
  })

  const fetchConfigs = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (selectedCategory !== "all") {
        params.append("category", selectedCategory)
      }

      const response = await fetch(`/api/system/config?${params}`)
      if (response.ok) {
        const data = await response.json()
        setConfigs(Array.isArray(data) ? data : data.data || [])
      } else {
        toast({
          title: "Error",
          description: "Failed to load system configuration",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Failed to fetch configs:", error)
      toast({
        title: "Error",
        description: "Failed to load system configuration",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    try {
      const method = editingConfig ? "PUT" : "POST"
      const body = editingConfig ? { ...formData, id: editingConfig.id } : formData

      const response = await fetch("/api/system/config", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: `Configuration ${editingConfig ? "updated" : "created"} successfully`,
        })
        setIsDialogOpen(false)
        setEditingConfig(null)
        resetForm()
        fetchConfigs()
        setHasUnsavedChanges(false)
      } else {
        const errorData = await response.json()
        toast({
          title: "Error",
          description: errorData.error || "Failed to save configuration",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Save error:", error)
      toast({
        title: "Error",
        description: "Failed to save configuration",
        variant: "destructive",
      })
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this configuration?")) return

    try {
      const response = await fetch(`/api/system/config?id=${id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: "Configuration deleted successfully",
        })
        fetchConfigs()
      } else {
        toast({
          title: "Error",
          description: "Failed to delete configuration",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Delete error:", error)
      toast({
        title: "Error",
        description: "Failed to delete configuration",
        variant: "destructive",
      })
    }
  }

  const handleEdit = (config: SystemConfig) => {
    setEditingConfig(config)
    setFormData({
      key: config.key,
      value: config.value,
      category: config.category,
      description: config.description,
      data_type: config.data_type,
      is_sensitive: config.is_sensitive,
    })
    setIsDialogOpen(true)
  }

  const resetForm = () => {
    setFormData({
      key: "",
      value: "",
      category: "general",
      description: "",
      data_type: "string",
      is_sensitive: false,
    })
  }

  const handleFormChange = (field: keyof ConfigFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    setHasUnsavedChanges(true)
  }

  const toggleSensitiveVisibility = (configId: number) => {
    setShowSensitive((prev) => ({
      ...prev,
      [configId]: !prev[configId],
    }))
  }

  const testEmailConfiguration = async () => {
    if (!testEmailAddress) {
      toast({
        title: "Error",
        description: "Please enter an email address for testing",
        variant: "destructive",
      })
      return
    }

    setIsTestingEmail(true)
    try {
      const response = await fetch("/api/system/test-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ testEmail: testEmailAddress }),
      })

      const result = await response.json()

      if (result.success) {
        toast({
          title: "Success",
          description: "Test email sent successfully! Check your inbox.",
        })
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to send test email",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Email test error:", error)
      toast({
        title: "Error",
        description: "Failed to test email configuration",
        variant: "destructive",
      })
    } finally {
      setIsTestingEmail(false)
    }
  }

  const renderValue = (config: SystemConfig) => {
    if (config.is_sensitive && !showSensitive[config.id]) {
      return (
        <div className="flex items-center gap-2">
          <span className="text-muted-foreground">••••••••</span>
          <Button variant="ghost" size="sm" onClick={() => toggleSensitiveVisibility(config.id)}>
            <Eye className="h-4 w-4" />
          </Button>
        </div>
      )
    }

    if (config.data_type === "boolean") {
      return (
        <div className="flex items-center gap-2">
          <Badge variant={config.value === "true" ? "default" : "secondary"}>
            {config.value === "true" ? "Enabled" : "Disabled"}
          </Badge>
          {config.is_sensitive && (
            <Button variant="ghost" size="sm" onClick={() => toggleSensitiveVisibility(config.id)}>
              <EyeOff className="h-4 w-4" />
            </Button>
          )}
        </div>
      )
    }

    return (
      <div className="flex items-center gap-2">
        <span className="max-w-xs truncate">{config.value}</span>
        {config.is_sensitive && (
          <Button variant="ghost" size="sm" onClick={() => toggleSensitiveVisibility(config.id)}>
            <EyeOff className="h-4 w-4" />
          </Button>
        )}
      </div>
    )
  }

  useEffect(() => {
    fetchConfigs()
  }, [selectedCategory])

  const filteredConfigs = configs.filter((config) => selectedCategory === "all" || config.category === selectedCategory)

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            System Configuration
          </CardTitle>
          <CardDescription>Manage system-wide settings and configuration parameters</CardDescription>
        </CardHeader>
      </Card>

      <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="w-full">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="all">All Settings</TabsTrigger>
          {categories.map((category) => {
            const Icon = category.icon
            return (
              <TabsTrigger key={category.value} value={category.value} className="flex items-center gap-2">
                <Icon className="h-4 w-4" />
                {category.label}
              </TabsTrigger>
            )
          })}
        </TabsList>

        <div className="mt-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Configuration Settings</CardTitle>
                  <CardDescription>
                    {selectedCategory === "all"
                      ? "All system configuration parameters"
                      : `${categories.find((c) => c.value === selectedCategory)?.label} settings`}
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  {selectedCategory === "email" && (
                    <div className="flex items-center gap-2">
                      <Input
                        placeholder="test@example.com"
                        value={testEmailAddress}
                        onChange={(e) => setTestEmailAddress(e.target.value)}
                        className="w-48"
                      />
                      <Button onClick={testEmailConfiguration} disabled={isTestingEmail} variant="outline">
                        {isTestingEmail ? (
                          <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                        ) : (
                          <TestTube className="h-4 w-4 mr-2" />
                        )}
                        Test Email
                      </Button>
                    </div>
                  )}
                  <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                      <Button
                        onClick={() => {
                          resetForm()
                          setEditingConfig(null)
                        }}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Setting
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-md">
                      <DialogHeader>
                        <DialogTitle>{editingConfig ? "Edit Configuration" : "Add Configuration"}</DialogTitle>
                        <DialogDescription>
                          {editingConfig
                            ? "Update the configuration setting"
                            : "Add a new system configuration setting"}
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="key">Key</Label>
                          <Input
                            id="key"
                            value={formData.key}
                            onChange={(e) => handleFormChange("key", e.target.value)}
                            placeholder="configuration_key"
                            disabled={!!editingConfig}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="value">Value</Label>
                          {formData.data_type === "boolean" ? (
                            <div className="flex items-center space-x-2">
                              <Switch
                                checked={formData.value === "true"}
                                onCheckedChange={(checked) => handleFormChange("value", checked.toString())}
                              />
                              <Label>{formData.value === "true" ? "Enabled" : "Disabled"}</Label>
                            </div>
                          ) : formData.data_type === "json" ? (
                            <Textarea
                              id="value"
                              value={formData.value}
                              onChange={(e) => handleFormChange("value", e.target.value)}
                              placeholder='{"key": "value"}'
                              rows={4}
                            />
                          ) : (
                            <Input
                              id="value"
                              type={
                                formData.data_type === "number" ? "number" : formData.is_sensitive ? "password" : "text"
                              }
                              value={formData.value}
                              onChange={(e) => handleFormChange("value", e.target.value)}
                              placeholder="Configuration value"
                            />
                          )}
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="category">Category</Label>
                          <Select
                            value={formData.category}
                            onValueChange={(value) => handleFormChange("category", value)}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {categories.map((category) => (
                                <SelectItem key={category.value} value={category.value}>
                                  {category.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="data_type">Data Type</Label>
                          <Select
                            value={formData.data_type}
                            onValueChange={(value) => handleFormChange("data_type", value)}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {dataTypes.map((type) => (
                                <SelectItem key={type.value} value={type.value}>
                                  {type.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="description">Description</Label>
                          <Textarea
                            id="description"
                            value={formData.description}
                            onChange={(e) => handleFormChange("description", e.target.value)}
                            placeholder="Configuration description"
                            rows={2}
                          />
                        </div>
                        <div className="flex items-center space-x-2">
                          <Switch
                            checked={formData.is_sensitive}
                            onCheckedChange={(checked) => handleFormChange("is_sensitive", checked)}
                          />
                          <Label>Sensitive (hide value)</Label>
                        </div>
                      </div>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                          Cancel
                        </Button>
                        <Button onClick={handleSave} disabled={!formData.key || !formData.value}>
                          <Save className="h-4 w-4 mr-2" />
                          {editingConfig ? "Update" : "Create"}
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                  <Button onClick={fetchConfigs} variant="outline">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Refresh
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {hasUnsavedChanges && (
                <div className="flex items-center gap-2 p-3 mb-4 bg-yellow-50 border border-yellow-200 rounded-lg text-yellow-800">
                  <AlertCircle className="h-4 w-4" />
                  <span className="text-sm">You have unsaved changes</span>
                </div>
              )}

              <div className="border rounded-lg">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Key</TableHead>
                      <TableHead>Value</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loading ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8">
                          <div className="flex items-center justify-center gap-2">
                            <RefreshCw className="h-4 w-4 animate-spin" />
                            Loading configuration...
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : filteredConfigs.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8">
                          <div className="flex flex-col items-center gap-2 text-muted-foreground">
                            <Settings className="h-8 w-8" />
                            <p>No configuration settings found</p>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredConfigs.map((config) => (
                        <TableRow key={config.id}>
                          <TableCell className="font-mono text-sm">{config.key}</TableCell>
                          <TableCell>{renderValue(config)}</TableCell>
                          <TableCell>
                            <Badge variant="outline">{config.category}</Badge>
                          </TableCell>
                          <TableCell>
                            <Badge variant="secondary">{config.data_type}</Badge>
                          </TableCell>
                          <TableCell className="max-w-xs">
                            <span className="text-sm text-muted-foreground truncate">{config.description}</span>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Button variant="ghost" size="sm" onClick={() => handleEdit(config)}>
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDelete(config.id)}
                                className="text-red-600 hover:text-red-700"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
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
      </Tabs>
    </div>
  )
}
