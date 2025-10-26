"use client";

import { Input } from "@/components/ui/input";
import { Package } from "lucide-react";
import { useAssetSearch } from "@/hooks/use-AssetSearch";
import { useEffect } from "react";
import { Badge } from "@/components/ui/badge";

interface AssetSelectInputProps {
    formData: any;
    setFormData: (data: any) => void;
    fieldName: string;
    onAssetSelected?: (asset: any) => void;
}

export default function AssetSelectInput({ 
    formData, 
    setFormData, 
    fieldName,
    onAssetSelected 
}: AssetSelectInputProps) {
    const { 
        assets, 
        assetSearchTerm, 
        handleAssetSearch, 
        setAssets, 
        setAssetSearchTerm,
        SearchAssetLoading 
    } = useAssetSearch();
    
    useEffect(() => {
        if (formData[fieldName] && !assetSearchTerm) {
            setAssetSearchTerm(formData[fieldName]);
        }
    }, [formData[fieldName]]);

    return (
        <div className="relative">
            <Input
                id={fieldName}
                value={assetSearchTerm}
                onChange={(e) => {
                    const value = e.target.value;
                    setAssetSearchTerm(value);
                    setFormData({...formData, [fieldName]: value});
                    handleAssetSearch(value);
                }}
                placeholder={`Search assets by name or ID...`}
            />
            {
                SearchAssetLoading && (
                    <div className="absolute right-10 top-2.5 h-4 w-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                )
            }
            <Package className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground" />
            {!SearchAssetLoading && assets.length > 0 && (
                <div className="absolute z-50 w-full mt-1 bg-white dark:bg-gray-800 rounded-xl border-purple-400 shadow-lg max-h-60 overflow-y-auto">
                    {assets.map((asset) => (
                        <div
                            key={asset.id}
                            className="p-3 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer border-b border-purple-400 last:border-b-0"
                            onClick={() => {
                                const assetText = `${asset.asset_name} (${asset.asset_id})`;
                                setFormData({
                                    ...formData,
                                    [fieldName]: assetText,
                                });
                                setAssetSearchTerm(assetText);
                                setAssets([]);
                                
                                // Call optional callback with full asset data
                                if (onAssetSelected) {
                                    onAssetSelected(asset);
                                }
                            }}
                        >
                            <div className="flex items-center justify-between">
                                <div className="font-medium text-sm">
                                    {asset.asset_name}
                                </div>
                                <Badge variant="outline" className="text-xs">
                                    {asset.asset_type}
                                </Badge>
                            </div>
                            <div className="text-xs text-muted-foreground mt-1">
                                ID: {asset.asset_id}
                            </div>
                            {asset.classification && (
                                <div className="flex items-center gap-2 mt-1">
                                    <Badge variant="secondary" className="text-xs">
                                        {asset.classification}
                                    </Badge>
                                    {asset.owner && (
                                        <span className="text-xs text-muted-foreground">
                                            Owner: {asset.owner}
                                        </span>
                                    )}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

