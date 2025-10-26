"use client"

import { useState, useEffect } from "react"
import { useTheme } from "next-themes"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from "@/components/ui/pagination"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
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
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  RefreshCw,
  BarChart3,
  Database,
  Shield,
  TrendingUp,
  Network,
} from "lucide-react"
import { AssetForm } from "@/components/asset-form"
import { AssetViewDialog } from "@/components/asset-view-dialog"
import { deleteAsset, getAssets } from "@/lib/actions/asset-actions"
import { useToast } from "@/hooks/use-toast"
import { AssetChatbot } from "@/components/asset-chatbot"
import { Tree } from "react-tree-graph";
import { useSession } from "@/components/session-provider";
import { usePathname } from "next/navigation"
import { ActionButtons } from "@/components/ui/action-buttons"

export default function AssetsPage() {
  const { theme } = useTheme()
  const [assets, setAssets] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [isFormDialogOpen, setIsFormDialogOpen] = useState(false)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedAsset, setSelectedAsset] = useState(null)
  const [viewingAsset, setViewingAsset] = useState(null)
  const [assetToDelete, setAssetToDelete] = useState(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [activeTab, setActiveTab] = useState("assets")
  const { toast } = useToast()

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)

  const { hasPermission } = useSession();
  const pathName = usePathname();

  const fetchAssets = async (search?: string) => {
    setLoading(true);
    try {
      const result = await getAssets(search);
      if (result.success) {
        setAssets(result.assets || []);
      } else {
        console.error("API error:", result.error);
        setAssets([]);
        toast({
          title: "Error",
          description: result.error,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Failed to fetch assets:", error);
      setAssets([]);
      toast({
        title: "Error",
        description: "Failed to load assets. Please check your database connection.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssets()
  }, [])

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchAssets(searchTerm)
    }, 300)

    return () => clearTimeout(timeoutId)
  }, [searchTerm])

  const handleAddAsset = () => {
    setSelectedAsset(null)
    setIsFormDialogOpen(true)
  }

  const handleViewAsset = (asset: any) => {
    setViewingAsset(asset)
    setIsViewDialogOpen(true)
  }

  const handleEditAsset = (asset: any) => {
    setSelectedAsset(asset)
    setIsFormDialogOpen(true)
  }

  const handleDeleteAsset = (asset: any) => {
    setAssetToDelete(asset)
    //setIsDeleteDialogOpen(true)
    confirmDelete();
  }

  const confirmDelete = async () => {
    if (!assetToDelete) return

    setIsDeleting(true)
    try {
      const result = await deleteAsset(assetToDelete.id)

      if (result.success) {
        toast({
          title: "Success",
          description: "Asset deleted successfully",
        })
        fetchAssets(searchTerm)
      } else {
        toast({
          title: "Error",
          description: result.error,
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete asset",
        variant: "destructive",
      })
    } finally {
      setIsDeleting(false)
      setIsDeleteDialogOpen(false)
      setAssetToDelete(null)
    }
  }

  const handleFormSuccess = () => {
    setIsFormDialogOpen(false)
    setSelectedAsset(null)
    fetchAssets(searchTerm)
  }

  const getClassificationColor = (classification: string) => {
    switch (classification) {
      case "Restricted":
        return "text-red-500"
      case "Confidential":
        return "text-orange-900"
      case "Internal":
        return "text-purple-900"
      default:
        return "text-blue-900"
    }
  }

  const getValueColor = (value: string) => {
    switch (value) {
      case "Critical":
        return "text-red-500"
      case "High":
        return "text-orange-900"
      case "Medium":
        return "text-yellow-900"
      case "Low":
        return "text-purple-900"
      default:
        return "text-blue-900"
    }
  }

  // Pagination logic
  const filteredAssets = assets.filter((asset: any) => {
    if (!searchTerm) return true
    const searchLower = searchTerm.toLowerCase()
    return (
      asset.asset_id?.toLowerCase().includes(searchLower) ||
      asset.asset_name?.toLowerCase().includes(searchLower) ||
      asset.asset_type?.toLowerCase().includes(searchLower) ||
      asset.owner?.toLowerCase().includes(searchLower) ||
      asset.classification?.toLowerCase().includes(searchLower) ||
      asset.business_value?.toLowerCase().includes(searchLower)
    )
  })

  const totalPages = Math.ceil(filteredAssets.length / pageSize)
  const startIndex = (currentPage - 1) * pageSize
  const endIndex = startIndex + pageSize
  const currentAssets = filteredAssets.slice(startIndex, endIndex)

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  const handlePageSizeChange = (newPageSize: string) => {
    setPageSize(Number(newPageSize))
    setCurrentPage(1) // Reset to first page when changing page size
  }

  const generatePaginationItems = () => {
    const items = []
    const maxVisiblePages = 5
    const halfVisible = Math.floor(maxVisiblePages / 2)

    if (totalPages <= maxVisiblePages) {
      // Show all pages if total is less than max visible
      for (let i = 1; i <= totalPages; i++) {
        items.push(
          <PaginationItem key={i}>
            <PaginationLink
              onClick={() => handlePageChange(i)}
              isActive={currentPage === i}
              className="cursor-pointer"
            >
              {i}
            </PaginationLink>
          </PaginationItem>
        )
      }
    } else {
      // Show first page
      items.push(
        <PaginationItem key={1}>
          <PaginationLink
            onClick={() => handlePageChange(1)}
            isActive={currentPage === 1}
            className="cursor-pointer"
          >
            1
          </PaginationLink>
        </PaginationItem>
      )

      // Show ellipsis if current page is far from start
      if (currentPage > halfVisible + 2) {
        items.push(
          <PaginationItem key="ellipsis-start">
            <PaginationEllipsis />
          </PaginationItem>
        )
      }

      // Show pages around current page
      const startPage = Math.max(2, currentPage - halfVisible)
      const endPage = Math.min(totalPages - 1, currentPage + halfVisible)

      for (let i = startPage; i <= endPage; i++) {
        items.push(
          <PaginationItem key={i}>
            <PaginationLink
              onClick={() => handlePageChange(i)}
              isActive={currentPage === i}
              className="cursor-pointer"
            >
              {i}
            </PaginationLink>
          </PaginationItem>
        )
      }

      // Show ellipsis if current page is far from end
      if (currentPage < totalPages - halfVisible - 1) {
        items.push(
          <PaginationItem key="ellipsis-end">
            <PaginationEllipsis />
          </PaginationItem>
        )
      }

      // Show last page
      if (totalPages > 1) {
        items.push(
          <PaginationItem key={totalPages}>
            <PaginationLink
              onClick={() => handlePageChange(totalPages)}
              isActive={currentPage === totalPages}
              className="cursor-pointer"
            >
              {totalPages}
            </PaginationLink>
          </PaginationItem>
        )
      }
    }

    return items
  }

  // Reset pagination when search term changes
  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm])

  const metrics = {
    total: assets.length,
    critical: assets.filter((asset: any) => asset.business_value === "Critical").length,
    high: assets.filter((asset: any) => asset.business_value === "High").length,
    restricted: assets.filter((asset: any) => asset.classification === "Restricted").length,
  }

  const businessValueData = [
    {
      name: "Critical",
      value: assets.filter((asset: any) => asset.business_value === "Critical").length,
      color: "#dc2626",
    },
    {
      name: "High",
      value: assets.filter((asset: any) => asset.business_value === "High").length,
      color: "#ea580c",
    },
    {
      name: "Medium",
      value: assets.filter((asset: any) => asset.business_value === "Medium").length,
      color: "#0891b2",
    },
    {
      name: "Low",
      value: assets.filter((asset: any) => asset.business_value === "Low").length,
      color: "#0284c7",
    },
  ].filter((item) => item.value > 0)

  const classificationData = [
    {
      name: "Restricted",
      value: assets.filter((asset: any) => asset.classification === "Restricted").length,
      color: "#dc2626",
    },
    {
      name: "Confidential",
      value: assets.filter((asset: any) => asset.classification === "Confidential").length,
      color: "#ea580c",
    },
    {
      name: "Internal",
      value: assets.filter((asset: any) => asset.classification === "Internal").length,
      color: "#eab308",
    },
    {
      name: "Public",
      value: assets.filter((asset: any) => asset.classification === "Public").length,
      color: "#16a34a",
    },
  ].filter((item) => item.value > 0)

  const assetTypeData = Object.entries(
    assets.reduce((acc: any, asset: any) => {
      acc[asset.asset_type] = (acc[asset.asset_type] || 0) + 1
      return acc
    }, {}),
  ).map(([type, count]) => ({
    name: type,
    value: count,
  }))

  const ciaData = [
    {
      name: "Confidentiality",
      level1: assets.filter((asset: any) => asset.confidentiality_level === 1).length,
      level2: assets.filter((asset: any) => asset.confidentiality_level === 2).length,
      level3: assets.filter((asset: any) => asset.confidentiality_level === 3).length,
      level4: assets.filter((asset: any) => asset.confidentiality_level === 4).length,
      level5: assets.filter((asset: any) => asset.confidentiality_level === 5).length,
    },
    {
      name: "Integrity",
      level1: assets.filter((asset: any) => asset.integrity_level === 1).length,
      level2: assets.filter((asset: any) => asset.integrity_level === 2).length,
      level3: assets.filter((asset: any) => asset.integrity_level === 3).length,
      level4: assets.filter((asset: any) => asset.integrity_level === 4).length,
      level5: assets.filter((asset: any) => asset.integrity_level === 5).length,
    },
    {
      name: "Availability",
      level1: assets.filter((asset: any) => asset.availability_level === 1).length,
      level2: assets.filter((asset: any) => asset.availability_level === 2).length,
      level3: assets.filter((asset: any) => asset.availability_level === 3).length,
      level4: assets.filter((asset: any) => asset.availability_level === 4).length,
      level5: assets.filter((asset: any) => asset.availability_level === 5).length,
    },
  ]

  const renderPieChart = (data: any[], title: string) => {
    const total = data.reduce((sum, item) => sum + item.value, 0)
    if (total === 0) return <div className="text-center text-muted-foreground py-8">No data available</div>

    return (
      <div className="space-y-4">
        <div className="grid gap-2">
          {data.map((item, index) => {
            const percentage = ((item.value / total) * 100).toFixed(1)
            return (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-sm font-medium">{item.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">{item.value}</span>
                  <span className="text-xs text-muted-foreground">({percentage}%)</span>
                </div>
              </div>
            )
          })}
        </div>
        <div className="space-y-2">
          {data.map((item, index) => {
            const percentage = (item.value / total) * 100
            return (
              <div key={index} className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span>{item.name}</span>
                  <span>{percentage.toFixed(1)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="h-2 rounded-full transition-all duration-300"
                    style={{
                      width: `${percentage}%`,
                      backgroundColor: item.color,
                    }}
                  />
                </div>
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  const renderBarChart = (data: any[], title: string) => {
    if (data.length === 0) return <div className="text-center text-muted-foreground py-8">No data available</div>

    const maxValue = Math.max(...data.map((item) => item.value))

    return (
      <div className="space-y-4">
        {data.map((item, index) => {
          const percentage = maxValue > 0 ? (item.value / maxValue) * 100 : 0
          return (
            <div key={index} className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="font-medium">{item.name}</span>
                <span className="text-muted-foreground">{item.value}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-gradient-to-r from-blue-500 to-cyan-500 h-3 rounded-full transition-all duration-300"
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          )
        })}
      </div>
    )
  }

  const renderCIAChart = (data: any[]) => {
    if (data.length === 0) return <div className="text-center text-muted-foreground py-8">No data available</div>

    const colors = {
      level1: "#16a34a",
      level2: "#eab308",
      level3: "#ea580c",
      level4: "#dc2626",
      level5: "#991b1b",
    }

    return (
      <div className="space-y-6">
        {data.map((category, categoryIndex) => {
          const total = category.level1 + category.level2 + category.level3 + category.level4 + category.level5
          if (total === 0) return null

          return (
            <div key={categoryIndex} className="space-y-3">
              <h4 className="font-medium text-sm">{category.name}</h4>
              <div className="flex h-6 rounded-full overflow-hidden bg-gray-200">
                {Object.entries(colors).map(([level, color]) => {
                  const value = category[level as keyof typeof category] as number
                  const percentage = total > 0 ? (value / total) * 100 : 0
                  return percentage > 0 ? (
                    <div
                      key={level}
                      className="transition-all duration-300"
                      style={{
                        width: `${percentage}%`,
                        backgroundColor: color,
                      }}
                      title={`${level.replace("level", "Level ")}: ${value} (${percentage.toFixed(1)}%)`}
                    />
                  ) : null
                })}
              </div>
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Level 1: {category.level1}</span>
                <span>Level 2: {category.level2}</span>
                <span>Level 3: {category.level3}</span>
                <span>Level 4: {category.level4}</span>
                <span>Level 5: {category.level5}</span>
              </div>
            </div>
          )
        })}
      </div>
    )
  }

  const transformAssetsToTree = () => {
    if (!assets || assets.length === 0) {
      return {
        name: "No Assets",
        children: [],
      }
    }

    const assetsByType = assets.reduce((acc: any, asset: any) => {
      const type = asset.asset_type || "Unknown"
      if (!acc[type]) {
        acc[type] = []
      }
      acc[type].push(asset)
      return acc
    }, {})

    const treeData = {
      name: `Assets (${assets.length})`,
      children: Object.entries(assetsByType).map(([type, typeAssets]: [string, any]) => ({
        name: `${type} (${typeAssets.length})`,
        children: typeAssets.map((asset: any) => ({
          name: asset.asset_name || asset.asset_id,
          attributes: {
            id: asset.asset_id,
            classification: asset.classification,
            owner: asset.owner,
            custodian: asset.custodian,
            retention_period: asset.retention_period,
            disposal_method: asset.disposal_method,
            ip_address: asset.ip_address,
            model_version: asset.model_version,
            business_value: asset.business_value,
            cia: `C:${asset.confidentiality_level} I:${asset.integrity_level} A:${asset.availability_level}`,
          },
        })),
      })),
    }

    return treeData
  }

  const getNodeColor = (node: any) => {
    if (node.attributes?.classification) {
      switch (node.attributes.classification) {
        case "Restricted":
          return "#dc2626"
        case "Confidential":
          return "#ea580c"
        case "Internal":
          return "#eab308"
        case "Public":
          return "#16a34a"
        default:
          return "#6b7280"
      }
    }
    if (node.children && node.children.length > 0) {
      return "#8b5cf6"
    }
    return "#0891b2"
  }




  return (
    <>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">
              Information Asset Register
            </h1>
            <p className="text-muted-foreground">
              Manage and track all information assets across your organization
            </p>
          </div>
          <div className="flex space-x-2">
            <AssetChatbot onAssetCreated={handleFormSuccess} />
            <Button
              className="w-full"
              onClick={() => fetchAssets(searchTerm)}
              disabled={loading}
              variant="outline"
            >
              <RefreshCw className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`} />
              Refresh
            </Button>
            <ActionButtons isTableAction={false} onAdd={handleAddAsset} btnAddText="Add Asset" />

            {/* {(hasPermission(pathName, "create")) && (<Button
              className="w-full"
              onClick={handleAddAsset}
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Asset
            </Button>
            )} */}
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-lg font-bold">Total Assets</CardTitle>
              <Badge variant="outline">{metrics.total}</Badge>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{metrics.total}</div>
              <p className="text-xs text-muted-foreground">All registered assets</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-lg font-bold ">Critical Assets</CardTitle>
              <Badge variant="destructive">{metrics.critical}</Badge>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{metrics.critical}</div>
              <p className="text-xs text-muted-foreground">Business critical</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-lg font-bold ">High Value</CardTitle>
              <Badge variant="secondary">{metrics.high}</Badge>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">{metrics.high}</div>
              <p className="text-xs text-muted-foreground">High business value</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-lg font-bold ">Restricted</CardTitle>
              <Badge variant="outline">{metrics.restricted}</Badge>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">{metrics.restricted}</div>
              <p className="text-xs text-muted-foreground">Restricted access</p>
            </CardContent>
          </Card>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="assets" className="flex items-center gap-2">
              <Database className="h-6 w-6" />
              Assets
            </TabsTrigger>
            <TabsTrigger value="dashboard" className="flex items-center gap-2">
              <BarChart3 className="h-6 w-6" />
              Dashboard
            </TabsTrigger>
          </TabsList>

          <TabsContent value="assets" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>
                  Asset Overview
                </CardTitle>
                <CardDescription>
                  Total assets: {assets.length} | Last updated: {new Date().toLocaleString()}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-2 mb-4">
                  <Search className="h-4 w-4 text-sm font-bold " />
                  <Input
                    placeholder="Search assets by ID, name, type, owner..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="max-w-sm"
                  />
                </div>

                {/* Pagination Controls - Top */}
                {!loading && filteredAssets.length > 0 && (
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm">Show</span>
                      <Select value={pageSize.toString()} onValueChange={handlePageSizeChange}>
                        <SelectTrigger className="w-[70px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="">
                          <SelectItem value="5">5</SelectItem>
                          <SelectItem value="10">10</SelectItem>
                          <SelectItem value="25">25</SelectItem>
                          <SelectItem value="50">50</SelectItem>
                          <SelectItem value="100">100</SelectItem>
                        </SelectContent>
                      </Select>
                      <span className="text-sm">entries</span>
                    </div>

                    <div className="text-sm">
                      {filteredAssets.length > 0 ? (
                        <>
                          Showing {startIndex + 1} to {Math.min(endIndex, filteredAssets.length)} of {filteredAssets.length} assets
                        </>
                      ) : (
                        "No assets found"
                      )}
                    </div>
                  </div>
                )}

                {loading ? (
                  <div className="flex justify-center items-center py-8">
                    <RefreshCw className="h-6 w-6 animate-spin text-purple-600" />
                    <span className="ml-2">Loading assets...</span>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-blue-200/200">
                        <TableHead className="truncate">Asset ID</TableHead>
                        <TableHead className="truncate">Asset Name</TableHead>
                        <TableHead className="truncate">Type</TableHead>
                        <TableHead className="truncate">Model/Version</TableHead>
                        <TableHead className="truncate">Classification</TableHead>
                        <TableHead className="truncate">Owner</TableHead>
                        <TableHead className="truncate">Business Value</TableHead>
                        <TableHead className="truncate">CIA Rating</TableHead>
                        <TableHead className="truncate text-center">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {currentAssets.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                            No assets found.{" "}
                            {searchTerm ? "Try adjusting your search." : "Add your first asset to get started."}
                          </TableCell>
                        </TableRow>
                      ) : (
                        currentAssets.map((asset: any) => (
                          <TableRow
                            key={asset.id}
                            className="hover:bg-gradient-to-r hover:from-purple-50/30 hover:via-cyan-50/30 hover:to-blue-50/30"
                          >
                            {/* <TableCell className="font-mono text-sm font-medium">
                                    <Badge variant="outline" className="bg-gradient-to-r from-blue-50 to-purple-50">
                                      {asset.asset_id}
                                    </Badge>
                                  </TableCell> */}
                            <TableCell className="font-medium text-xs truncate">{asset.asset_id}</TableCell>
                            <TableCell className="font-medium truncate">{asset.asset_name}</TableCell>
                            <TableCell>{asset.asset_type}</TableCell>
                            <TableCell className="text-sm text-muted-foreground truncate">
                              {asset.model_version || "Not specified"}
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline" className={getClassificationColor(asset.classification)}>
                                {asset.classification}
                              </Badge>
                            </TableCell>
                            <TableCell>{asset.department}</TableCell>
                            <TableCell>
                              <Badge variant="outline" className={getValueColor(asset.business_value)}>
                                {asset.business_value}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex space-x-1">
                                <Badge variant="outline" className="text-xs">
                                  C:{asset.confidentiality_level}
                                </Badge>
                                <Badge variant="outline" className="text-xs">
                                  I:{asset.integrity_level}
                                </Badge>
                                <Badge variant="outline" className="text-xs">
                                  A:{asset.availability_level}
                                </Badge>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex space-x-2">
                                <ActionButtons isTableAction={true} 
                                  onView={() => handleViewAsset(asset)} 
                                  onEdit={() => handleEditAsset(asset)} 
                                  onDelete={() => handleDeleteAsset(asset)}  
                                  actionObj={asset}
                                  deleteDialogTitle={asset.asset_name}                                
                                  />
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                )}

                {/* Pagination Controls - Bottom */}
                {!loading && totalPages > 1 && (
                  <div className="flex items-center justify-between mt-4">
                    <div className="text-sm ">
                      {filteredAssets.length > 0 ? (
                        <>
                          Showing {startIndex + 1} to {Math.min(endIndex, filteredAssets.length)} of {filteredAssets.length} assets
                        </>
                      ) : (
                        "No assets found"
                      )}
                    </div>
                    <Pagination>
                      <PaginationContent>
                        <PaginationItem>
                          <PaginationPrevious
                            onClick={() => handlePageChange(currentPage - 1)}
                            className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                          />
                        </PaginationItem>
                        {generatePaginationItems()}
                        <PaginationItem>
                          <PaginationNext
                            onClick={() => handlePageChange(currentPage + 1)}
                            className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                          />
                        </PaginationItem>
                      </PaginationContent>
                    </Pagination>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="dashboard" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Assets by Business Value
                  </CardTitle>
                  <CardDescription>Distribution of assets by business criticality</CardDescription>
                </CardHeader>
                <CardContent>{renderPieChart(businessValueData, "Business Value")}</CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    Assets by Classification
                  </CardTitle>
                  <CardDescription>Distribution of assets by data classification</CardDescription>
                </CardHeader>
                <CardContent>{renderPieChart(classificationData, "Classification")}</CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Database className="h-5 w-5" />
                    Asset Count by Type
                  </CardTitle>
                  <CardDescription>Number of assets by asset type</CardDescription>
                </CardHeader>
                <CardContent>{renderBarChart(assetTypeData, "Asset Types")}</CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    Assets by CIA Ratings
                  </CardTitle>
                  <CardDescription>
                    Distribution of Confidentiality, Integrity, and Availability levels
                  </CardDescription>
                </CardHeader>
                <CardContent>{renderCIAChart(ciaData)}</CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="asset-view" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-cyan-600 bg-clip-text text-transparent">
                  <Network className="h-5 w-5" />
                  Asset View
                </CardTitle>
                <CardDescription>
                  Interactive tree visualization of all information assets organized by type
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex justify-center items-center py-12">
                    <RefreshCw className="h-8 w-8 animate-spin text-purple-600" />
                    <span className="ml-3 text-lg">Loading asset tree...</span>
                  </div>
                ) : assets.length === 0 ? (
                  <div className="text-center py-12">
                    <Network className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No Assets to Display</h3>
                    <p className="text-muted-foreground mb-4">Add some assets to see the tree visualization</p>
                    <ActionButtons isTableAction={false} onAdd={handleAddAsset} btnAddText="Add First Asset"/>
                  </div>
                ) : (
                  <div className="w-full h-[600px] border rounded-lg bg-gradient-to-br from-purple-50/30 via-cyan-50/30 to-blue-50/30 overflow-hidden">
                    <Tree
                      data={transformAssetsToTree()}
                      height={600}
                      width={800}
                      svgProps={{
                        className: "w-full h-full",
                      }}
                      margins={{
                        bottom: 50,
                        left: 50,
                        right: 50,
                        top: 50,
                      }}
                      nodeProps={{
                        r: 8,
                        fill: (node: any) => getNodeColor(node),
                        stroke: "#ffffff",
                        strokeWidth: 2,
                      }}
                      textProps={{
                        fill: "#374151",
                        fontSize: 12,
                        fontWeight: "bold",
                        textAnchor: "middle",
                        dy: -15,
                      }}
                      pathProps={{
                        stroke: "#8b5cf6",
                        strokeWidth: 2,
                        fill: "none",
                      }}
                      animated={true}
                      animationDuration={1000}
                    />
                  </div>
                )}

                {assets.length > 0 && (
                  <div className="mt-6 p-4 bg-gradient-to-r from-purple-50/50 to-cyan-50/50 rounded-lg">
                    <h4 className="font-semibold mb-3 text-sm">Legend</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded-full bg-red-600"></div>
                        <span>Restricted</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded-full bg-orange-600"></div>
                        <span>Confidential</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded-full bg-yellow-600"></div>
                        <span>Internal</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded-full bg-green-600"></div>
                        <span>Public</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded-full bg-purple-600"></div>
                        <span>Asset Types</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded-full bg-cyan-600"></div>
                        <span>Root Node</span>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <Dialog open={isFormDialogOpen} onOpenChange={(open) => {
        setIsFormDialogOpen(open);
        if (!open) setTimeout(() => setSelectedAsset(null), 200);
      }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {selectedAsset ? "Edit Asset" : "Add New Asset"}
            </DialogTitle>
          </DialogHeader>
          <AssetForm asset={selectedAsset} onSuccess={handleFormSuccess} onCancel={() => setIsFormDialogOpen(false)} />
        </DialogContent>
      </Dialog>

      <AssetViewDialog asset={viewingAsset} open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen} />


    </>
  )
}
