"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { ContractForm } from "@/components/contract-form"
import { FileText, DollarSign, Calendar, AlertTriangle, Plus, Search, Edit, Trash2, Contact } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { ActionButtons } from "./ui/action-buttons"

interface Contract {
  id: number
  contract_name: string
  contract_number: string
  vendor_name: string
  contract_type: string
  start_date: string
  end_date: string
  contract_value: number
  currency: string
  status: string
  health_status: string
  created_at: string
}

interface ContractStats {
  total_contracts: number
  active_contracts: number
  expired_contracts: number
  expiring_soon: number
  total_contract_value: number
  avg_contract_value: number
}

const statusColors = {
  Active: "bg-green-100 text-green-800 border-green-200",
  Draft: "bg-gray-100 text-gray-800 border-gray-200",
  "Under Review": "bg-yellow-100 text-yellow-800 border-yellow-200",
  Expired: "bg-red-100 text-red-800 border-red-200",
  Terminated: "bg-red-100 text-red-800 border-red-200",
}

const healthColors = {
  Active: "bg-green-100 text-green-800 border-green-200",
  "Expiring Soon": "bg-yellow-100 text-yellow-800 border-yellow-200",
  Expired: "bg-red-100 text-red-800 border-red-200",
}

export function ContractManagement() {
  const [contracts, setContracts] = useState<Contract[]>([])
  const [stats, setStats] = useState<ContractStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("All Statuses")
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [selectedContract, setSelectedContract] = useState<Contract | null>(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [contractToDelete, setContractToDelete] = useState<Contract | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    fetchContracts()
    fetchStats()
  }, [searchTerm, statusFilter])

  const fetchContracts = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      if (searchTerm) params.append("search", searchTerm)
      if (statusFilter !== "All Statuses") params.append("status", statusFilter)

      console.log("Fetching contracts with params:", params.toString())

      const response = await fetch(`/api/contracts?${params}`)
      const data = await response.json()

      console.log("Contracts API response:", data)

      if (data.success) {
        setContracts(data.contracts || [])
      } else {
        console.error("Failed to fetch contracts:", data.error)
        toast({
          title: "Error",
          description: data.error || "Failed to fetch contracts",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error fetching contracts:", error)
      toast({
        title: "Error",
        description: "Failed to fetch contracts",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const fetchStats = async () => {
    try {
      const response = await fetch("/api/contracts/stats")
      const data = await response.json()

      console.log("Contract stats response:", data)

      if (data.success) {
        setStats(data.stats)
      }
    } catch (error) {
      console.error("Error fetching stats:", error)
    }
  }

  const handleCreateContract = () => {
    setSelectedContract(null)
    setIsFormOpen(true)
  }

  const handleEditContract = (contract: Contract) => {
    setSelectedContract(contract)
    setIsFormOpen(true)
  }

  const handleDeleteContract = (contract: Contract) => {
    setContractToDelete(contract)
    setIsDeleteDialogOpen(true)
  }

  const confirmDelete = async () => {
    if (!contractToDelete) return

    try {
      const response = await fetch(`/api/contracts/${contractToDelete.id}`, {
        method: "DELETE",
      })

      const data = await response.json()

      if (data.success) {
        toast({
          title: "Success",
          description: "Contract deleted successfully",
        })
        fetchContracts()
        fetchStats()
      } else {
        throw new Error(data.error || "Failed to delete contract")
      }
    } catch (error) {
      console.error("Error deleting contract:", error)
      toast({
        title: "Error",
        description: "Failed to delete contract",
        variant: "destructive",
      })
    } finally {
      setIsDeleteDialogOpen(false)
      setContractToDelete(null)
    }
  }

  const handleFormSubmit = async (formData: any) => {
    setIsSubmitting(true)
    try {
      console.log("Submitting contract form data:", formData)

      const url = selectedContract ? `/api/contracts/${selectedContract.id}` : "/api/contracts"
      const method = selectedContract ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()
      console.log("Contract form response:", data)

      if (data.success) {
        toast({
          title: "Success",
          description: `Contract ${selectedContract ? "updated" : "created"} successfully`,
        })
        setIsFormOpen(false)
        fetchContracts()
        fetchStats()
      } else {
        throw new Error(data.error || `Failed to ${selectedContract ? "update" : "create"} contract`)
      }
    } catch (error) {
      console.error("Error submitting form:", error)
      toast({
        title: "Error",
        description: `Failed to ${selectedContract ? "update" : "create"} contract`,
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        <span className="ml-2">Loading contracts...</span>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Statistics Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Contracts</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total_contracts}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Contracts</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.active_contracts}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Value</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ${stats.total_contract_value ? (stats.total_contract_value / 1000000).toFixed(1) : "0"}M
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Expiring Soon</CardTitle>
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.expiring_soon}</div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Contract Management */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Contract Management</CardTitle>
              <CardDescription>Manage contracts with your vendors and suppliers</CardDescription>
            </div>
            <Button onClick={handleCreateContract}>
              Add Contract
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search contracts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="All Statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All Statuses">All Statuses</SelectItem>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Draft">Draft</SelectItem>
                <SelectItem value="Under Review">Under Review</SelectItem>
                <SelectItem value="Expired">Expired</SelectItem>
                <SelectItem value="Terminated">Terminated</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Contracts Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="truncate">Contract</TableHead>
                  <TableHead className="truncate">Vendor</TableHead>
                  <TableHead className="truncate">Type</TableHead>
                  <TableHead className="truncate">Value</TableHead>
                  <TableHead className="truncate">Duration</TableHead>
                  <TableHead className="truncate">Status</TableHead>
                  <TableHead className="truncate">Health</TableHead>
                  <TableHead className="truncate text-center">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {contracts.length > 0 ? (
                  contracts.map((contract) => (
                    <TableRow key={contract.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{contract.contract_name}</div>
                          <div className="text-sm text-muted-foreground">
                            {contract.contract_number || `ID: ${contract.id}`}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">{contract.vendor_name || "N/A"}</div>
                      </TableCell>
                      <TableCell>{contract.contract_type}</TableCell>
                      <TableCell>
                        {contract.contract_value
                          ? `${contract.currency || "USD"} ${contract.contract_value.toLocaleString()}`
                          : "N/A"}
                      </TableCell>
                      <TableCell>
                        <div>
                          {contract.start_date && (
                            <div className="text-sm">Start: {new Date(contract.start_date).toLocaleDateString()}</div>
                          )}
                          {contract.end_date && (
                            <div className="text-sm">End: {new Date(contract.end_date).toLocaleDateString()}</div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="truncate">
                        <Badge
                          variant="outline"
                          className={
                            statusColors[contract.status as keyof typeof statusColors] || "bg-gray-100 text-gray-800"
                          }
                        >
                          {contract.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="truncate">
                        <Badge
                          variant="outline"
                          className={
                            healthColors[contract.health_status as keyof typeof healthColors] ||
                            "bg-gray-100 text-gray-800"
                          }
                        >
                          {contract.health_status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center justify-between">
                          <ActionButtons isTableAction={true}
                            onEdit={() => handleEditContract(contract)}
                            onDelete={() => handleDeleteContract(contract)}
                            deleteDialogTitle={contract.contract_name}
                                actionObj={contract}
                          />
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8">
                      <p className="text-muted-foreground">No contracts found</p>
                      <ActionButtons isTableAction={false} onAdd={handleCreateContract} btnAddText="Add Your First Contract"/>                      
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Contract Form Dialog */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selectedContract ? "Edit Contract" : "Add New Contract"}</DialogTitle>
          </DialogHeader>
          <ContractForm
            contract={selectedContract}
            onSubmit={handleFormSubmit}
            onCancel={() => setIsFormOpen(false)}
            isLoading={isSubmitting}
          />
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the contract "{contractToDelete?.contract_name}
              " and all associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
