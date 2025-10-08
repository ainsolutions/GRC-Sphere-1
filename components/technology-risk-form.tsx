"use client";

import type React from "react";
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CalendarIcon, Calculator, RefreshCw } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { ControlAssessmentModule } from "./control-assessment-module";
import OwnerSelectInput from "@/components/owner-search-input";

interface Asset {
  id: number | string;
  asset_id: string;
  asset_name: string;
  asset_type: string;
  classification: string;
  owner: string;
}

interface TechnologyRisk {
  id?: number;
  risk_id?: string;
  title: string;
  description: string;
  technology_category: string;
  technology_type: string;
  asset_ids?: string | null; // VARCHAR field - comma-separated string
  risk_category: string;
  likelihood: number;
  impact: number;
  risk_score?: number;
  risk_level?: string;
  current_controls: string;
  recommended_controls: string;
  owner: string;
  status: string;
  due_date?: string | null;
  residual_impact: number;
  residual_likelihood: number;
  residual_risk?: number;
  control_assessment: string;
  risk_treatment: string;
  treatment_state: string;
  treatment_end_date?: string | null;
  action_owner: string;
  related_assets?: Asset[]; // For display purposes
}

interface TechnologyRiskFormProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  onSubmit: (data: any) => void;
  assets: Asset[];
  editingRisk?: TechnologyRisk | null;
}

const technologyCategories = [
  "Infrastructure",
  "Software",
  "Network",
  "Database",
  "Cloud Services",
  "Security Systems",
  "Communication",
  "Hardware",
  "Mobile",
  "IoT Devices",
  "AI/ML Systems",
  "Blockchain",
];

const technologyTypes = [
  "Server",
  "Application",
  "Operating System",
  "Firewall",
  "Router",
  "Switch",
  "Database Server",
  "Web Server",
  "Email Server",
  "Backup System",
  "Monitoring Tool",
  "Development Tool",
  "Third-party Service",
  "API",
  "Microservice",
  "Container",
  "Virtual Machine",
  "Storage System",
  "Network Protocol",
  "Authentication System",
];

const riskTreatments = [
  { value: "mitigate", label: "Mitigate" },
  { value: "transfer", label: "Transfer" },
  { value: "avoid", label: "Avoid" },
  { value: "accept", label: "Accept" },
];

const treatmentStates = [
  { value: "planned", label: "Planned" },
  { value: "in-progress", label: "In Progress" },
  { value: "completed", label: "Completed" },
  { value: "overdue", label: "Overdue" },
  { value: "cancelled", label: "Cancelled" },
];

const statuses = [
  { value: "open", label: "Open" },
  { value: "in-progress", label: "In Progress" },
  { value: "mitigated", label: "Mitigated" },
  { value: "accepted", label: "Accepted" },
  { value: "closed", label: "Closed" },
];

export function TechnologyRiskForm({
  open,
  setOpen,
  onSubmit,
  assets = [],
  editingRisk,
}: TechnologyRiskFormProps) {
  const [formData, setFormData] = useState<TechnologyRisk>({
    title: "",
    description: "",
    technology_category: "Infrastructure",
    technology_type: "Server",
    asset_ids: null,
    risk_category: "Technology",
    likelihood: 1,
    impact: 1,
    current_controls: "",
    recommended_controls: "",
    owner: "",
    status: "open",
    due_date: null,
    residual_impact: 1,
    residual_likelihood: 1,
    control_assessment: "",
    risk_treatment: "mitigate",
    treatment_state: "planned",
    treatment_end_date: null,
    action_owner: "",
  });

  const [selectedAssets, setSelectedAssets] = useState<Asset[]>([]);
  const [assetSearchTerm, setAssetSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<Asset[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showAssetDropdown, setShowAssetDropdown] = useState(false);

  const [dueDate, setDueDate] = useState<Date | undefined>();
  const [treatmentEndDate, setTreatmentEndDate] = useState<Date | undefined>();
  const [generatedRiskId, setGeneratedRiskId] = useState<string>("");
  const [isGeneratingRiskId, setIsGeneratingRiskId] = useState(false);

  // Helper function to convert comma-separated string to array
  const stringToAssetIds = (assetIdsString: string | null): string[] => {
    if (!assetIdsString || assetIdsString.trim() === "") return [];
    return assetIdsString.split(",").filter((id) => id.trim() !== "");
  };

  // Helper function to convert array to comma-separated string
  const assetIdsToString = (assetIds: string[]): string | null => {
    if (!assetIds || assetIds.length === 0) return null;
    return assetIds.join(",");
  };

  const searchAssets = async (searchTerm: string) => {
    if (!searchTerm.trim()) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    try {
      const response = await fetch(
        `/api/assets?search=${encodeURIComponent(searchTerm)}&limit=20`
      );
      const data = await response.json();
      if (data.success) {
        // Filter out already selected assets
        const filteredResults = data.assets.filter(
          (asset: Asset) =>
            !selectedAssets.some(
              (selected) => selected.id.toString() === asset.id.toString()
            )
        );
        setSearchResults(filteredResults);
      }
    } catch (error) {
      console.error("Error searching assets:", error);
    } finally {
      setIsSearching(false);
    }
  };

  // Debounced search effect
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      searchAssets(assetSearchTerm);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [assetSearchTerm, selectedAssets]);

  const generateRiskId = async () => {
    setIsGeneratingRiskId(true);
    try {
      const response = await fetch("/api/technology-risks/generate-id");
      const data = await response.json();
      if (data.success) {
        setGeneratedRiskId(data.risk_id);
        setFormData((prev) => ({ ...prev, risk_id: data.risk_id }));
      } else {
        console.error("Failed to generate risk ID:", data.error);
        // Fallback: generate client-side
        const currentYear = new Date().getFullYear();
        const randomNum = Math.floor(Math.random() * 100000)
          .toString()
          .padStart(5, "0");
        const fallbackId = `TR-${currentYear}-${randomNum}`;
        setGeneratedRiskId(fallbackId);
        setFormData((prev) => ({ ...prev, risk_id: fallbackId }));
      }
    } catch (error) {
      console.error("Error generating risk ID:", error);
      // Fallback: generate client-side
      const currentYear = new Date().getFullYear();
      const randomNum = Math.floor(Math.random() * 100000)
        .toString()
        .padStart(5, "0");
      const fallbackId = `TR-${currentYear}-${randomNum}`;
      setGeneratedRiskId(fallbackId);
      setFormData((prev) => ({ ...prev, risk_id: fallbackId }));
    } finally {
      setIsGeneratingRiskId(false);
    }
  };

  const loadSelectedAssets = async (assetIds: string[]) => {
    if (!assetIds || assetIds.length === 0) {
      setSelectedAssets([]);
      return;
    }

    try {
      const assetPromises = assetIds.map((id) =>
        fetch(`/api/assets/${id}`).then((res) => res.json())
      );
      const assetResponses = await Promise.all(assetPromises);
      const loadedAssets = assetResponses
        .filter((response) => response.success)
        .map((response) => response.asset);
      setSelectedAssets(loadedAssets);
    } catch (error) {
      console.error("Error loading selected assets:", error);
    }
  };

  useEffect(() => {
    if (editingRisk) {
      setFormData({
        ...editingRisk,
        asset_ids: editingRisk.asset_ids || null,
        title: editingRisk.title || "",
        description: editingRisk.description || "",
        technology_category:
          editingRisk.technology_category || "Infrastructure",
        technology_type: editingRisk.technology_type || "Server",
        risk_category: editingRisk.risk_category || "Technology",
        likelihood: editingRisk.likelihood || 1,
        impact: editingRisk.impact || 1,
        current_controls: editingRisk.current_controls || "",
        recommended_controls: editingRisk.recommended_controls || "",
        owner: editingRisk.owner || "",
        status: editingRisk.status || "open",
        residual_impact: editingRisk.residual_impact || 1,
        residual_likelihood: editingRisk.residual_likelihood || 1,
        control_assessment: editingRisk.control_assessment || "",
        risk_treatment: editingRisk.risk_treatment || "mitigate",
        treatment_state: editingRisk.treatment_state || "planned",
        action_owner: editingRisk.action_owner || "",
      });

      setGeneratedRiskId(editingRisk.risk_id || "");

      // Load selected assets from asset_ids string or related_assets
      if (editingRisk.related_assets && editingRisk.related_assets.length > 0) {
        setSelectedAssets(editingRisk.related_assets);
      } else if (editingRisk.asset_ids) {
        const assetIds = stringToAssetIds(editingRisk.asset_ids);
        loadSelectedAssets(assetIds);
      }

      if (editingRisk.due_date) {
        try {
          setDueDate(new Date(editingRisk.due_date));
        } catch (error) {
          console.error("Invalid due date:", editingRisk.due_date);
          setDueDate(undefined);
        }
      }

      if (editingRisk.treatment_end_date) {
        try {
          setTreatmentEndDate(new Date(editingRisk.treatment_end_date));
        } catch (error) {
          console.error(
            "Invalid treatment end date:",
            editingRisk.treatment_end_date
          );
          setTreatmentEndDate(undefined);
        }
      }
    } else {
      // Reset form for new risk
      setFormData({
        title: "",
        description: "",
        technology_category: "Infrastructure",
        technology_type: "Server",
        asset_ids: null,
        risk_category: "Technology",
        likelihood: 1,
        impact: 1,
        current_controls: "",
        recommended_controls: "",
        owner: "",
        status: "open",
        due_date: null,
        residual_impact: 1,
        residual_likelihood: 1,
        control_assessment: "",
        risk_treatment: "mitigate",
        treatment_state: "planned",
        treatment_end_date: null,
        action_owner: "",
      });
      setSelectedAssets([]);
      setAssetSearchTerm("");
      setSearchResults([]);
      setDueDate(undefined);
      setTreatmentEndDate(undefined);
      setGeneratedRiskId("");

      // Auto-generate risk ID for new risks
      if (open && !editingRisk) {
        generateRiskId();
      }
    }
  }, [editingRisk, open]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest(".asset-search-container")) {
        setShowAssetDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const calculateRiskScore = (likelihood: number, impact: number) => {
    const likelihoodValue = likelihood || 1;
    const impactValue = impact || 1;
    return likelihoodValue * impactValue;
  };

  const getRiskLevel = (score: number) => {
    if (score >= 15) return "High";
    if (score >= 8) return "Medium";
    return "Low";
  };

  const getRiskLevelColor = (level: string) => {
    switch (level) {
      case "Critical":
        return "text-red-500";
      case "High":
        return "text-orange-900";
      case "Medium":
        return "text-yellow-600";
      case "Low":
        return "text-purple-900";
      default:
        return "text-blue-900";
    }
  };

  const inherentRiskScore = calculateRiskScore(
    formData.likelihood,
    formData.impact
  );
  const inherentRiskLevel = getRiskLevel(inherentRiskScore);
  const residualRiskScore = calculateRiskScore(
    formData.residual_likelihood,
    formData.residual_impact
  );
  const residualRiskLevel = getRiskLevel(residualRiskScore);

  const addAsset = (asset: Asset) => {
    if (
      !selectedAssets.some(
        (selected) => selected.id.toString() === asset.id.toString()
      )
    ) {
      const newSelectedAssets = [...selectedAssets, asset];
      setSelectedAssets(newSelectedAssets);
      const assetIdsString = assetIdsToString(
        newSelectedAssets.map((a) => a.id.toString())
      );
      setFormData((prev) => ({
        ...prev,
        asset_ids: assetIdsString,
      }));
    }
    setAssetSearchTerm("");
    setShowAssetDropdown(false);
    setSearchResults([]);
  };

  const removeAsset = (assetId: string | number) => {
    const newSelectedAssets = selectedAssets.filter(
      (asset) => asset.id.toString() !== assetId.toString()
    );
    setSelectedAssets(newSelectedAssets);
    const assetIdsString = assetIdsToString(
      newSelectedAssets.map((a) => a.id.toString())
    );
    setFormData((prev) => ({
      ...prev,
      asset_ids: assetIdsString,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const submitData = {
      ...formData,
      risk_id: generatedRiskId,
      due_date: dueDate ? format(dueDate, "yyyy-MM-dd") : null,
      treatment_end_date: treatmentEndDate
        ? format(treatmentEndDate, "yyyy-MM-dd")
        : null,
      risk_score: inherentRiskScore,
      risk_level: inherentRiskLevel,
      residual_risk: residualRiskScore,
      asset_ids:
        selectedAssets.length > 0
          ? selectedAssets.map((a) => a.id.toString())
          : null,
    };

    onSubmit(submitData);
  };

  const safeAssets = Array.isArray(assets) ? assets : [];

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {editingRisk ? "Edit Technology Risk" : "Add Technology Risk"}
          </DialogTitle>
          <DialogDescription>
            {editingRisk
              ? "Update the technology risk details"
              : "Create a new technology risk assessment"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Tabs defaultValue="basic" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="basic">Basic Information</TabsTrigger>
              <TabsTrigger value="assessment">Risk Assessment</TabsTrigger>
              <TabsTrigger value="controls">Controls & Treatment</TabsTrigger>
            </TabsList>

            <TabsContent value="basic" className="space-y-6">
              {/* Basic Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Basic Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Risk ID Field */}
                  <div>
                    <Label htmlFor="risk_id">Risk ID</Label>
                    <div className="flex space-x-2">
                      <Input
                        id="risk_id"
                        value={generatedRiskId}
                        onChange={(e) => {
                          setGeneratedRiskId(e.target.value);
                          handleInputChange("risk_id", e.target.value);
                        }}
                        placeholder="TR-YYYY-XXXXX"
                        className="flex-1"
                      />
                      {!editingRisk && (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={generateRiskId}
                          disabled={isGeneratingRiskId}
                          className="px-3 bg-transparent"
                        >
                          {isGeneratingRiskId ? (
                            <RefreshCw className="h-4 w-4 animate-spin" />
                          ) : (
                            <RefreshCw className="h-4 w-4" />
                          )}
                        </Button>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Format: TR-YYYY-XXXXX (e.g., TR-2024-00123)
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="title">Risk Title *</Label>
                      <Input
                        id="title"
                        value={formData.title || ""}
                        onChange={(e) =>
                          handleInputChange("title", e.target.value)
                        }
                        placeholder="Enter risk title"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="owner">Risk Owner *</Label>
                      <OwnerSelectInput
                        formData={formData}
                        setFormData={setFormData}
                        fieldName="owner"
                      />

                      {/* <Input
                    id="owner"
                    value={formData.owner || ""}
                    onChange={(e) => handleInputChange("owner", e.target.value)}
                    placeholder="Enter risk owner"
                    required
                  /> */}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="description">Description *</Label>
                    <Textarea
                      id="description"
                      value={formData.description || ""}
                      onChange={(e) =>
                        handleInputChange("description", e.target.value)
                      }
                      placeholder="Describe the technology risk"
                      rows={3}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="technology_category">
                        Technology Category *
                      </Label>
                      <Select
                        value={formData.technology_category || "Infrastructure"}
                        onValueChange={(value) =>
                          handleInputChange("technology_category", value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          {technologyCategories.map((category) => (
                            <SelectItem key={category} value={category}>
                              {category}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="technology_type">Technology Type</Label>
                      <Select
                        value={formData.technology_type || "Server"}
                        onValueChange={(value) =>
                          handleInputChange("technology_type", value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          {technologyTypes.map((type) => (
                            <SelectItem key={type} value={type}>
                              {type}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="assets">Related Assets</Label>
                    <div className="space-y-2">
                      {/* Selected Assets Display */}
                      {selectedAssets.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {selectedAssets.map((asset) => (
                            <Badge
                              key={asset.id}
                              variant="secondary"
                              className="flex items-center gap-1 px-2 py-1"
                            >
                              <span className="text-xs">
                                {asset.asset_name} ({asset.asset_type})
                              </span>
                              <button
                                type="button"
                                onClick={() => removeAsset(asset.id)}
                                className="ml-1 hover:bg-destructive hover:text-destructive-foreground rounded-full w-4 h-4 flex items-center justify-center text-xs"
                              >
                                ×
                              </button>
                            </Badge>
                          ))}
                        </div>
                      )}

                      {/* Asset Search Input */}
                      <div className="relative asset-search-container">
                        <Input
                          placeholder="Search for assets to add..."
                          value={assetSearchTerm}
                          onChange={(e) => {
                            setAssetSearchTerm(e.target.value);
                            setShowAssetDropdown(true);
                          }}
                          onFocus={() => setShowAssetDropdown(true)}
                          className="w-full"
                        />

                        {/* Search Results Dropdown */}
                        {showAssetDropdown &&
                          (assetSearchTerm.trim() ||
                            searchResults.length > 0) && (
                            <div className="absolute z-10 w-full mt-1 bg-background border rounded-md shadow-lg max-h-60 overflow-y-auto">
                              {isSearching ? (
                                <div className="p-3 text-center text-muted-foreground">
                                  <RefreshCw className="h-4 w-4 animate-spin mx-auto mb-1" />
                                  Searching...
                                </div>
                              ) : searchResults.length > 0 ? (
                                searchResults.map((asset) => (
                                  <button
                                    key={asset.id}
                                    type="button"
                                    onClick={() => addAsset(asset)}
                                    className="w-full px-3 py-2 text-left hover:bg-accent hover:text-accent-foreground border-b last:border-b-0"
                                  >
                                    <div className="font-medium">
                                      {asset.asset_name}
                                    </div>
                                    <div className="text-sm text-muted-foreground">
                                      {asset.asset_id} • {asset.asset_type} •{" "}
                                      {asset.classification}
                                    </div>
                                  </button>
                                ))
                              ) : assetSearchTerm.trim() && !isSearching ? (
                                <div className="p-3 text-center text-muted-foreground">
                                  No assets found matching "{assetSearchTerm}"
                                </div>
                              ) : null}
                            </div>
                          )}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="status">Status</Label>
                      <Select
                        value={formData.status || "open"}
                        onValueChange={(value) =>
                          handleInputChange("status", value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {statuses.map((status) => (
                            <SelectItem key={status.value} value={status.value}>
                              {status.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="assessment" className="space-y-6">
              {/* Risk Assessment */}
              <div className="grid grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center">
                      <Calculator className="mr-2 h-5 w-5" />
                      Inherent Risk
                    </CardTitle>
                    <CardDescription>
                      Risk level without controls
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="likelihood">Likelihood (1-5)</Label>
                      <Select
                        value={(formData.likelihood || 1).toString()}
                        onValueChange={(value) =>
                          handleInputChange(
                            "likelihood",
                            Number.parseInt(value) || 1
                          )
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">1 - Very Low</SelectItem>
                          <SelectItem value="2">2 - Low</SelectItem>
                          <SelectItem value="3">3 - Medium</SelectItem>
                          <SelectItem value="4">4 - High</SelectItem>
                          <SelectItem value="5">5 - Very High</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="impact">Impact (1-5)</Label>
                      <Select
                        value={(formData.impact || 1).toString()}
                        onValueChange={(value) =>
                          handleInputChange(
                            "impact",
                            Number.parseInt(value) || 1
                          )
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">1 - Very Low</SelectItem>
                          <SelectItem value="2">2 - Low</SelectItem>
                          <SelectItem value="3">3 - Medium</SelectItem>
                          <SelectItem value="4">4 - High</SelectItem>
                          <SelectItem value="5">5 - Very High</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="pt-2 border-t">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">Risk Score:</span>
                        <div className="flex items-center space-x-2">
                          <span className="font-bold text-lg">
                            {inherentRiskScore}
                          </span>
                          <Badge
                            variant="outline"
                            className={getRiskLevelColor(inherentRiskLevel)}
                          >
                            {inherentRiskLevel}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center">
                      <Calculator className="mr-2 h-5 w-5" />
                      Residual Risk
                    </CardTitle>
                    <CardDescription>Risk level with controls</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="residual_likelihood">
                        Residual Likelihood (1-5)
                      </Label>
                      <Select
                        value={(formData.residual_likelihood || 1).toString()}
                        onValueChange={(value) =>
                          handleInputChange(
                            "residual_likelihood",
                            Number.parseInt(value) || 1
                          )
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">1 - Very Low</SelectItem>
                          <SelectItem value="2">2 - Low</SelectItem>
                          <SelectItem value="3">3 - Medium</SelectItem>
                          <SelectItem value="4">4 - High</SelectItem>
                          <SelectItem value="5">5 - Very High</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="residual_impact">
                        Residual Impact (1-5)
                      </Label>
                      <Select
                        value={(formData.residual_impact || 1).toString()}
                        onValueChange={(value) =>
                          handleInputChange(
                            "residual_impact",
                            Number.parseInt(value) || 1
                          )
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">1 - Very Low</SelectItem>
                          <SelectItem value="2">2 - Low</SelectItem>
                          <SelectItem value="3">3 - Medium</SelectItem>
                          <SelectItem value="4">4 - High</SelectItem>
                          <SelectItem value="5">5 - Very High</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="pt-2 border-t">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">Risk Score:</span>
                        <div className="flex items-center space-x-2">
                          <span className="font-bold text-lg">
                            {residualRiskScore}
                          </span>
                          <Badge
                            variant="outline"
                            className={getRiskLevelColor(residualRiskLevel)}
                          >
                            {residualRiskLevel}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="controls" className="space-y-6">
              {/* Controls */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Risk Controls</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="current_controls">Current Controls</Label>
                    <Textarea
                      id="current_controls"
                      value={formData.current_controls || ""}
                      onChange={(e) =>
                        handleInputChange("current_controls", e.target.value)
                      }
                      placeholder="Describe existing controls"
                      rows={3}
                    />
                  </div>
                  <div>
                    <Label htmlFor="recommended_controls">
                      Recommended Controls
                    </Label>
                    <Textarea
                      id="recommended_controls"
                      value={formData.recommended_controls || ""}
                      onChange={(e) =>
                        handleInputChange(
                          "recommended_controls",
                          e.target.value
                        )
                      }
                      placeholder="Describe recommended additional controls"
                      rows={3}
                    />
                  </div>

                  <div>
                    <Label className="text-base font-semibold">
                      Control Assessment
                    </Label>
                    <p className="text-sm text-muted-foreground mb-4">
                      Detailed assessment of individual controls and their
                      effectiveness
                    </p>
                    <ControlAssessmentModule
                      riskId={generatedRiskId}
                      currentAssessment={formData.control_assessment || ""}
                      onAssessmentUpdate={(assessment) =>
                        handleInputChange("control_assessment", assessment)
                      }
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Treatment Plan */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Risk Treatment</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="risk_treatment">Treatment Strategy</Label>
                      <Select
                        value={formData.risk_treatment || "mitigate"}
                        onValueChange={(value) =>
                          handleInputChange("risk_treatment", value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {riskTreatments.map((treatment) => (
                            <SelectItem
                              key={treatment.value}
                              value={treatment.value}
                            >
                              {treatment.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="treatment_state">Treatment State</Label>
                      <Select
                        value={formData.treatment_state || "planned"}
                        onValueChange={(value) =>
                          handleInputChange("treatment_state", value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {treatmentStates.map((state) => (
                            <SelectItem key={state.value} value={state.value}>
                              {state.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="action_owner">Action Owner</Label>
                      <Input
                        id="action_owner"
                        value={formData.action_owner || ""}
                        onChange={(e) =>
                          handleInputChange("action_owner", e.target.value)
                        }
                        placeholder="Person responsible for treatment"
                      />
                    </div>
                    <div>
                      <Label>Due Date</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full justify-start text-left font-normal"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {dueDate ? format(dueDate, "PPP") : "Pick a date"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={dueDate}
                            onSelect={setDueDate}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">

                  <div>
                    <Label>Treatment End Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {treatmentEndDate
                            ? format(treatmentEndDate, "PPP")
                            : "Pick a date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={treatmentEndDate}
                          onSelect={setTreatmentEndDate}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  <div></div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Form Actions */}
          <div className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit">
              {editingRisk ? "Update Risk" : "Create Risk"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
