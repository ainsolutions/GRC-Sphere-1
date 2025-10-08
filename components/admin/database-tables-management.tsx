"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DatabaseTableForm } from "./database-table-form"
import { DatabaseTableViewDialog } from "./database-table-view-dialog"
import { toast } from "@/components/ui/use-toast"
import { Search, Plus, Edit, Trash2, Eye, Database, Shield } from "lucide-react"

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
  created_at: string
  updated_at: string
  permission_count?: number
}

export function DatabaseTablesManagement() {
  const [tables, setTables] = useState<DatabaseTable[]>([])
  const [filteredTables, setFilteredTables] = useState<DatabaseTable[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [moduleFilter, setModuleFilter] = useState("all")
  const [showForm, setShowForm] = useState(false)
  const [editingTable, setEditingTable] = useState<DatabaseTable | null>(null)
  const [viewingTable, setViewingTable] = useState<DatabaseTable | null>(null)

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

  const moduleColors = {
    Core: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
    Assets: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
    Risks: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
    Compliance: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
    Audit: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300",
    Incidents: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
    Users: "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300",
    Settings: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300",
    Reports: "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-300",
    Analytics: "bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-300",
  }

  useEffect(() => {
    fetchTables()
  }, [])

  useEffect(() => {
    let filtered = tables

    if (searchTerm) {
      filtered = filtered.filter(
        (table) =>
          table.table_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          table.display_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          table.description.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    if (moduleFilter !== "all") {
      filtered = filtered.filter((table) => table.module === moduleFilter)
    }

    setFilteredTables(filtered)
  }, [tables, searchTerm, moduleFilter])

  const fetchTables = async () => {
    try {
      const response = await fetch("/api/database-tables")
      if (response.ok) {
        const result = await response.json()
        setTables(data)
        // Ensure we always set an array
        setTables(Array.isArray(result.data) ? result.data : [])
      } else {
        toast({
          title: "Error",
          description: "Failed to fetch database tables",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch database tables",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(`/api/database-tables/${id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: "Database table deleted successfully",
        })
        fetchTables()
      } else {
        const error = await response.json()
        toast({
          title: "Error",
          description: error.error || "Failed to delete database table",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete database table",
        variant: "destructive",
      })
    }
  }

  const handleFormSuccess = () => {
    setShowForm(false)
    setEditingTable(null)
    fetchTables()
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-cyan-600 bg-clip-text text-transparent">
            Database Tables
          </h2>
          <p className="text-muted-foreground">Manage database table definitions and access controls</p>
        </div>
        <Dialog open={showForm} onOpenChange={setShowForm}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 text-white">
              <Plus className="h-4 w-4 mr-2" />
              Add Table
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add Database Table</DialogTitle>
            </DialogHeader>
            <DatabaseTableForm onSuccess={handleFormSuccess} onCancel={() => setShowForm(false)} />
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search tables..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={moduleFilter} onValueChange={setModuleFilter}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Filter by module" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Modules</SelectItem>
            {modules.map((module) => (
              <SelectItem key={module} value={module}>
                {module}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-4">
        {filteredTables.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Database className="h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">No database tables found</h3>
              <p className="text-gray-500 dark:text-gray-400 text-center mb-4">
                {searchTerm || moduleFilter !== "all"
                  ? "No tables match your current filters."
                  : "Get started by adding your first database table."}
              </p>
              {!searchTerm && moduleFilter === "all" && (
                <Button
                  onClick={() => setShowForm(true)}
                  className="bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 text-white"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Database Table
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Table Name</TableHead>
                  <TableHead>Display Name</TableHead>
                  <TableHead>Module</TableHead>
                  <TableHead>Access Control</TableHead>
                  <TableHead>Permissions</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTables.map((table) => (
                  <TableRow key={table.id}>
                    <TableCell className="font-mono text-sm">{table.table_name}</TableCell>
                    <TableCell className="font-medium">{table.display_name}</TableCell>
                    <TableCell>
                      <Badge className={moduleColors[table.module as keyof typeof moduleColors] || moduleColors.Core}>
                        {table.module}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        {table.has_organization_filter && (
                          <Badge variant="outline" className="text-xs">
                            <Shield className="h-3 w-3 mr-1" />
                            Org
                          </Badge>
                        )}
                        {table.has_department_filter && (
                          <Badge variant="outline" className="text-xs">
                            <Shield className="h-3 w-3 mr-1" />
                            Dept
                          </Badge>
                        )}
                        {!table.has_organization_filter && !table.has_department_filter && (
                          <Badge variant="secondary" className="text-xs">
                            Global
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">{table.permission_count || 0} roles</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="ghost" size="sm" onClick={() => setViewingTable(table)}>
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="ghost" size="sm" onClick={() => setEditingTable(table)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl">
                            <DialogHeader>
                              <DialogTitle>Edit Database Table</DialogTitle>
                            </DialogHeader>
                            <DatabaseTableForm
                              table={editingTable}
                              onSuccess={handleFormSuccess}
                              onCancel={() => setEditingTable(null)}
                            />
                          </DialogContent>
                        </Dialog>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <Trash2 className="h-4 w-4 text-red-500" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Database Table</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete "{table.display_name}"? This action cannot be undone and
                                will remove all associated permissions.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDelete(table.id)}
                                className="bg-red-600 hover:bg-red-700"
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        )}
      </div>

      {viewingTable && (
        <DatabaseTableViewDialog table={viewingTable} open={!!viewingTable} onClose={() => setViewingTable(null)} />
      )}
    </div>
  )
}
