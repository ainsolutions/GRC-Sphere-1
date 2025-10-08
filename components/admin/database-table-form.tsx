"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "@/components/ui/use-toast"

interface DatabaseTable {
  id: number
  table_name: string
  display_name: string
  description: string
  module: string
  has_organization_filter: boolean
  has_department_filter: boolean
  organization_column: string
  department_column: string
}

interface DatabaseTableFormProps {
  table?: DatabaseTable
  onSuccess?: () => void
  onCancel?: () => void
}

export function DatabaseTableForm({ table, onSuccess, onCancel }: DatabaseTableFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [hasOrgFilter, setHasOrgFilter] = useState(table?.has_organization_filter || false)
  const [hasDeptFilter, setHasDeptFilter] = useState(table?.has_department_filter || false)

  const modules = [
    "Core",
    "Assets",
    "Risks",
    "Compliance",
    "Audit",
    "Incidents",
    "Users",
    "Settings",
    "Reports",
    "Analytics",
  ]

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)

    const formData = new FormData(e.currentTarget)
    formData.set("has_organization_filter", hasOrgFilter.toString())
    formData.set("has_department_filter", hasDeptFilter.toString())

    try {
      const url = table ? `/api/database-tables/${table.id}` : "/api/database-tables"
      const method = table ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        body: formData,
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: `Database table ${table ? "updated" : "created"} successfully`,
        })
        onSuccess?.()
      } else {
        const error = await response.json()
        toast({
          title: "Error",
          description: error.error || "Failed to save database table",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{table ? "Edit Database Table" : "Add Database Table"}</CardTitle>
        <CardDescription>
          {table ? "Update database table configuration" : "Define a new database table with access controls"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="table_name">Table Name *</Label>
              <Input
                id="table_name"
                name="table_name"
                defaultValue={table?.table_name || ""}
                placeholder="e.g., users, assets, risks"
                required
                className="font-mono"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="display_name">Display Name *</Label>
              <Input
                id="display_name"
                name="display_name"
                defaultValue={table?.display_name || ""}
                placeholder="e.g., Users, Assets, Risks"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              defaultValue={table?.description || ""}
              placeholder="Describe what this table contains and its purpose"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="module">Module *</Label>
            <Select name="module" defaultValue={table?.module || ""} required>
              <SelectTrigger>
                <SelectValue placeholder="Select module" />
              </SelectTrigger>
              <SelectContent>
                {modules.map((module) => (
                  <SelectItem key={module} value={module}>
                    {module}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Access Control Configuration</h3>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="has_organization_filter">Organization Filter</Label>
                  <p className="text-sm text-muted-foreground">Enable organization-based data filtering</p>
                </div>
                <Switch id="has_organization_filter" checked={hasOrgFilter} onCheckedChange={setHasOrgFilter} />
              </div>

              {hasOrgFilter && (
                <div className="space-y-2 ml-4">
                  <Label htmlFor="organization_column">Organization Column *</Label>
                  <Input
                    id="organization_column"
                    name="organization_column"
                    defaultValue={table?.organization_column || "organization_id"}
                    placeholder="e.g., organization_id, org_id"
                    className="font-mono"
                    required={hasOrgFilter}
                  />
                </div>
              )}

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="has_department_filter">Department Filter</Label>
                  <p className="text-sm text-muted-foreground">Enable department-based data filtering</p>
                </div>
                <Switch id="has_department_filter" checked={hasDeptFilter} onCheckedChange={setHasDeptFilter} />
              </div>

              {hasDeptFilter && (
                <div className="space-y-2 ml-4">
                  <Label htmlFor="department_column">Department Column *</Label>
                  <Input
                    id="department_column"
                    name="department_column"
                    defaultValue={table?.department_column || "department_id"}
                    placeholder="e.g., department_id, dept_id"
                    className="font-mono"
                    required={hasDeptFilter}
                  />
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-end space-x-4 pt-4">
            {onCancel && (
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancel
              </Button>
            )}
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 text-white"
            >
              {isSubmitting ? "Saving..." : table ? "Update Table" : "Create Table"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
