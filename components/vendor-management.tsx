"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
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
import {
  Search,
  Eye,
  RefreshCw,
  Building2,
  Users,
  AlertTriangle,
  Plus,
  Edit,
  Trash2,
  Calendar,
  DollarSign,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { VendorForm } from "./vendor-form"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import StarBorder from "@/app/StarBorder"

interface Vendor {
  id: number
  vendor_id: string
  vendor_name: string
  vendor_type: string
  contact_person: string
  contact_email: string
  contact_phone: string
  address: string
  city: string
  state: string
  country: string
  postal_code: string
  website: string
  business_registration_number: string
  tax_id: string
  industry: string
  services_provided: string
  contract_start_date: string
  contract_end_date: string
  contract_value: number
  currency: string
  payment_terms: string
  sla_requirements: string
  data_processing_agreement: boolean
  security_requirements: string
  compliance_certifications: string[]
  risk_level: string
  last_assessment_date: string
  next_assessment_date: string
  status: string
  notes: string
  created_at: string
  updated_at: string
}

interface VendorStats {
  total_vendors: number
  active_vendors: number
  inactive_vendors: number
  pending_vendors: number
  high_risk_vendors: number
  critical_risk_vendors: number
  expired_contracts: number
  expiring_soon_contracts: number
}

export function VendorManagement() {
  const [vendors, setVendors] = useState<Vendor[]>([])
  const [stats, setStats] = useState<VendorStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [riskLevelFilter, setRiskLevelFilter] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [totalItems, setTotalItems] = useState(0)
  const [totalPages, setTotalPages] = useState(1)
  const [itemsPerPage] = useState(10)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null)
  const { toast } = useToast()

  const fetchVendors = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: itemsPerPage.toString(),
        search: searchTerm,
      })

      if (statusFilter !== "all") {
        params.append("status", statusFilter)
      }
      if (riskLevelFilter !== "all") {
        params.append("riskLevel", riskLevelFilter)
      }

      const response = await fetch(`/api/vendors?${params}`)
      const data = await response.json()

      if (data.success) {
        setVendors(data.data.vendors)
        setTotalItems(data.data.pagination.total)
        setTotalPages(data.data.pagination.totalPages)
      } else {
        throw new Error(data.error)
      }
    } catch (error) {
      console.error("Error fetching vendors:", error)
      toast({
        title: "Error",
        description: "Failed to fetch vendors",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const fetchStats = async () => {
    try {
      const response = await fetch("/api/vendors/stats")
      const data = await response.json()

      if (data.success) {
        setStats(data.data.summary)
      }
    } catch (error) {
      console.error("Error fetching vendor stats:", error)
    }
  }

  useEffect(() => {
    fetchStats()
  }, [])

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchVendors()
    }, 300)

    return () => clearTimeout(timeoutId)
  }, [searchTerm, statusFilter, riskLevelFilter, currentPage])

  const handleDelete = async (vendorId: number) => {
    try {
      const response = await fetch(`/api/vendors/${vendorId}`, {
        method: "DELETE",
      })

      const data = await response.json()

      if (data.success) {
        toast({
          title: "Success",
          description: "Vendor deleted successfully",
        })
        fetchVendors()
        fetchStats()
      } else {
        throw new Error(data.error)
      }
    } catch (error) {
      console.error("Error deleting vendor:", error)
      toast({
        title: "Error",
        description: "Failed to delete vendor",
        variant: "destructive",
      })
    }
  }

  const handleView = (vendor: Vendor) => {
    setSelectedVendor(vendor)
    setIsViewDialogOpen(true)
  }

  const handleEdit = (vendor: Vendor) => {
    setSelectedVendor(vendor)
    setIsEditDialogOpen(true)
  }

  const handleFormSuccess = () => {
    fetchVendors()
    fetchStats()
    setIsAddDialogOpen(false)
    setIsEditDialogOpen(false)
    setSelectedVendor(null)
  }

  const getRiskLevelColor = (level: string) => {
    switch (level) {
      case "Critical":
        return "text-red-500"
      case "High":
        return "text-orange-900"
      case "Medium":
        return "text-yellow-600"
      case "Low":
        return "text-purple-900"
      default:
        return "text-blue-900"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "text-red-500"
      case "Inactive":
        return "text-orange-900"
      case "Pending":
        return "text-yellow-600"
      default:
        return "text-blue-900"
    }
  }

  const isContractExpiringSoon = (endDate: string) => {
    if (!endDate) return false
    const end = new Date(endDate)
    const now = new Date()
    const thirtyDaysFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000)
    return end <= thirtyDaysFromNow && end >= now
  }

  const isContractExpired = (endDate: string) => {
    if (!endDate) return false
    return new Date(endDate) < new Date()
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5 text-blue-600" />
                <h1 className="text-lg font-bold text-blue-600/100 dark:text-blue-500/100">Vendor Management</h1>
              </CardTitle>
              <CardDescription>Manage vendor relationships, contracts, and risk assessments</CardDescription>
            </div>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="accent" onClick={() => setIsAddDialogOpen(true)}>
                  Add New Vendor
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Add New Vendor</DialogTitle>
                </DialogHeader>
                <VendorForm onSuccess={handleFormSuccess} onCancel={() => setIsAddDialogOpen(false)} />
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          {/* Statistics */}
          {stats && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <Users className="h-4 w-4 text-blue-600/100 dark:text-blue-500/100" />
                    Total Vendors
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-600/100 dark:text-blue-500/100">{stats.total_vendors}</div>
                  <div className="text-xs text-muted-foreground">
                    {stats.active_vendors} active, {stats.inactive_vendors} inactive
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-red-600/100 dark:text-red-500/100" />
                    High Risk
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-red-600/100 dark:text-red-500/100">
                    {stats.high_risk_vendors + stats.critical_risk_vendors}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {stats.critical_risk_vendors} critical, {stats.high_risk_vendors} high
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-orange-600/100 dark:text-orange-500/100" />
                    Contract Status
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-orange-600/100 dark:text-orange-500/100">{stats.expiring_soon_contracts}</div>
                  <div className="text-xs text-muted-foreground">Expiring soon, {stats.expired_contracts} expired</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-green-600" />
                    Avg Risk Score
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">
                    {stats.average_risk_level ? stats.average_risk_level.toFixed(1) : "N/A"}
                  </div>
                  <div className="text-xs text-muted-foreground">Out of 10</div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Filters and Search */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Search className="h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search vendors..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="max-w-sm"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Inactive">Inactive</SelectItem>
                  <SelectItem value="Pending">Pending</SelectItem>
                </SelectContent>
              </Select>
              <Select value={riskLevelFilter} onValueChange={setRiskLevelFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Risk Level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Levels</SelectItem>
                  <SelectItem value="Critical">Critical</SelectItem>
                  <SelectItem value="High">High</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="Low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button variant="outline" onClick={fetchVendors} disabled={loading}>
              <RefreshCw className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`} />
              Refresh
            </Button>
          </div>

          {/* Table */}
          {loading ? (
            <div className="flex justify-center items-center py-8">
              <RefreshCw className="h-6 w-6 animate-spin text-blue-600" />
              <span className="ml-2">Loading vendors...</span>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="truncate">Vendor ID</TableHead>
                    <TableHead className="truncate">Vendor Name</TableHead>
                    <TableHead className="truncate">Type</TableHead>
                    <TableHead className="truncate">Contact</TableHead>
                    <TableHead className="truncate">Risk Level</TableHead>
                    <TableHead className="truncate">Status</TableHead>
                    <TableHead className="truncate">Contract End</TableHead>
                    <TableHead className="truncate text-center">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {vendors.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                        No vendors found. Try adjusting your search criteria.
                      </TableCell>
                    </TableRow>
                  ) : (
                    vendors.map((vendor) => (
                      <TableRow key={vendor.id}>
                        <TableCell className="font-mono text-sm truncate">{vendor.vendor_id}</TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="font-medium">{vendor.vendor_name}</div>
                            <div className="text-sm text-muted-foreground">{vendor.industry}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{vendor.vendor_type || "N/A"}</Badge>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="text-sm font-medium">{vendor.contact_person}</div>
                            <div className="text-xs text-muted-foreground">{vendor.contact_email}</div>
                          </div>
                        </TableCell>
                        <TableCell className="truncate">
                          <Badge variant="outline" className={getRiskLevelColor(vendor.risk_level)}>{vendor.risk_level}</Badge>
                        </TableCell>
                        <TableCell className="truncate">
                          <Badge variant="outline" className={getStatusColor(vendor.status)}>{vendor.status}</Badge>
                        </TableCell>
                        <TableCell className="truncate">
                          {vendor.contract_end_date ? (
                            <div className="space-y-1">
                              <div className="text-sm">{new Date(vendor.contract_end_date).toLocaleDateString()}</div>
                              {isContractExpired(vendor.contract_end_date) && (
                                <Badge variant="destructive" className="text-xs">
                                  Expired
                                </Badge>
                              )}
                              {isContractExpiringSoon(vendor.contract_end_date) &&
                                !isContractExpired(vendor.contract_end_date) && (
                                  <Badge variant="outline" className="text-xs text-orange-600">
                                    Expiring Soon
                                  </Badge>
                                )}
                            </div>
                          ) : (
                            <span className="text-muted-foreground">N/A</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-1">
                            <Button variant="ghost" size="sm" onClick={() => handleView(vendor)}>
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => handleEdit(vendor)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button variant="ghost" size="sm"
                                  className="text-red-400 hover:bg-red-900/20 hover:text-red-300 dark:text-red-400 dark:hover:bg-red-900/20 dark:hover:text-red-300"
                                >
                                  <Trash2 className="h-4 w-4 " />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Delete Vendor</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Are you sure you want to delete "{vendor.vendor_name}" ({vendor.vendor_id})? This
                                    action cannot be undone.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => handleDelete(vendor.id)}
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
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          )}

          {/* Pagination */}
          {vendors.length > 0 && totalPages > 1 && (
            <div className="mt-6 flex justify-center">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      href="#"
                      onClick={(e) => {
                        e.preventDefault()
                        if (currentPage > 1) {
                          setCurrentPage(currentPage - 1)
                        }
                      }}
                      className={currentPage <= 1 ? "pointer-events-none opacity-50" : ""}
                    />
                  </PaginationItem>

                  {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                    let page: number
                    if (totalPages <= 5) {
                      page = i + 1
                    } else if (currentPage <= 3) {
                      page = i + 1
                    } else if (currentPage >= totalPages - 2) {
                      page = totalPages - 4 + i
                    } else {
                      page = currentPage - 2 + i
                    }

                    return (
                      <PaginationItem key={page}>
                        <PaginationLink
                          href="#"
                          onClick={(e) => {
                            e.preventDefault()
                            setCurrentPage(page)
                          }}
                          isActive={currentPage === page}
                        >
                          {page}
                        </PaginationLink>
                      </PaginationItem>
                    )
                  })}

                  <PaginationItem>
                    <PaginationNext
                      href="#"
                      onClick={(e) => {
                        e.preventDefault()
                        if (currentPage < totalPages) {
                          setCurrentPage(currentPage + 1)
                        }
                      }}
                      className={currentPage >= totalPages ? "pointer-events-none opacity-50" : ""}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </CardContent>
      </Card>

      {/* View Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Vendor Details</DialogTitle>
          </DialogHeader>
          {selectedVendor && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Vendor ID</label>
                  <p className="text-sm font-mono bg-gray-200 dark:bg-gray-900 p-2 rounded">{selectedVendor.vendor_id}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Vendor Name</label>
                  <p className="text-sm font-semibold bg-gray-200 dark:bg-gray-900 p-2 rounded">{selectedVendor.vendor_name}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Type</label>
                  <p className="text-sm bg-gray-200 dark:bg-gray-900 p-2 rounded">{selectedVendor.vendor_type || "N/A"}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Industry</label>
                  <p className="text-sm bg-gray-200 dark:bg-gray-900 p-2 rounded">{selectedVendor.industry || "N/A"}</p>
                </div>
              </div>


              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Status</label>
                  <p>
                    <Badge variant="outline" className={getStatusColor(selectedVendor.status)}>{selectedVendor.status}</Badge>
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Risk Level</label>
                    <p>
                      <Badge variant="outline" className={getRiskLevelColor(selectedVendor.risk_level)}>{selectedVendor.risk_level}</Badge>
                    </p>
                  </div>
              
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Contact Person</label>
                  <p className="text-sm bg-gray-200 dark:bg-gray-900 p-2 rounded">{selectedVendor.contact_person || "N/A"}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Contact Email</label>
                  <p className="text-sm bg-gray-200 dark:bg-gray-900 p-2 rounded">{selectedVendor.contact_email || "N/A"}</p>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground">Address</label>
                <p className="text-sm bg-gray-200 dark:bg-gray-900 p-2 rounded">
                  {[selectedVendor.address, selectedVendor.city, selectedVendor.state, selectedVendor.country]
                    .filter(Boolean)
                    .join(", ") || "N/A"}
                </p>
              </div>

              {selectedVendor.contract_start_date && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Contract Start</label>
                    <p className="text-sm bg-gray-200 dark:bg-gray-900 p-2 rounded">{new Date(selectedVendor.contract_start_date).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Contract End</label>
                    <p className="text-sm bg-gray-200 dark:bg-gray-900 p-2 rounded">
                      {selectedVendor.contract_end_date
                        ? new Date(selectedVendor.contract_end_date).toLocaleDateString()
                        : "N/A"}
                    </p>
                  </div>
                </div>
              )}

              {selectedVendor.notes && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Notes</label>
                  <p className="text-sm bg-gray-200 dark:bg-gray-900 p-3 rounded">{selectedVendor.notes}</p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Vendor</DialogTitle>
          </DialogHeader>
          {selectedVendor && (
            <VendorForm
              vendor={selectedVendor}
              onSuccess={handleFormSuccess}
              onCancel={() => setIsEditDialogOpen(false)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
