"use client"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"
import { Calendar, MapPin, User, Shield, Database, Activity } from "lucide-react"

interface AssetViewDialogProps {
  asset: any
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AssetViewDialog({ asset, open, onOpenChange }: AssetViewDialogProps) {
  if (!asset) return null

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

  const getCIALevelColor = (level: string) => {
    const numLevel = Number.parseInt(level)
    if (numLevel >= 5) return "text-red-700"
    if (numLevel >= 4) return "text-orange-500"
    if (numLevel >= 3) return "text-yellow-500"
    if (numLevel >= 2) return "text-purple-500"
    return "text-blue-500"
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto  from-purple-50/95 via-cyan-50/95 to-blue-100/95 backdrop-blur-sm">
        <DialogHeader>
          <DialogTitle className="text-2xl">
            Asset Details
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Asset Header */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl">{asset.asset_name}</CardTitle>
                  <CardDescription className="text-base mt-1">
                    <Badge variant="outline" className="font-mono mr-2">
                      {asset.asset_id}
                    </Badge>
                    {asset.asset_type}
                  </CardDescription>
                </div>
                <div className="flex flex-col items-end space-y-2">
                  <Badge variant="outline"className={getClassificationColor(asset.classification)}>{asset.classification}</Badge>
                  <Badge variant="outline"className={getValueColor(asset.business_value)}>{asset.business_value}</Badge>
                </div>
              </div>
            </CardHeader>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5" />
                  Basic Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Department Owner:</span>
                  <span className="text-sm">{asset.department}</span>
                </div>
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Custodian Department:</span>
                  <span className="text-sm">{asset.custodian}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Location:</span>
                  <span className="text-sm">{asset.location || "Not specified"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Created:</span>
                  <span className="text-sm">{new Date(asset.created_at).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Activity className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Last Updated:</span>
                  <span className="text-sm">{new Date(asset.updated_at).toLocaleDateString()}</span>
                </div>
              </CardContent>
            </Card>

            {/* Security Classification */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Security Classification
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <span className="text-sm font-medium">Data Classification:</span>
                  <div className="mt-1">
                    <Badge variant="outline"className={getClassificationColor(asset.classification)}>{asset.classification}</Badge>
                  </div>
                </div>
                <Separator />
                <div>
                  <span className="text-sm font-medium mb-2 block">CIA Triad Ratings:</span>
                  <div className="grid grid-cols-3 gap-2">
                    <div className="text-center">
                      <div className="text-xs text-muted-foreground mb-1">Confidentiality</div>
                      <Badge variant="outline"className={getCIALevelColor(asset.confidentiality_level)}>
                        Level {asset.confidentiality_level}
                      </Badge>
                    </div>
                    <div className="text-center">
                      <div className="text-xs text-muted-foreground mb-1">Integrity</div>
                      <Badge variant="outline"className={getCIALevelColor(asset.integrity_level)}>Level {asset.integrity_level}</Badge>
                    </div>
                    <div className="text-center">
                      <div className="text-xs text-muted-foreground mb-1">Availability</div>
                      <Badge variant="outline"className={getCIALevelColor(asset.availability_level)}>
                        Level {asset.availability_level}
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Description */}
          {asset.description && (
            <Card>
              <CardHeader>
                <CardTitle>Description</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{asset.description}</p>
              </CardContent>
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
