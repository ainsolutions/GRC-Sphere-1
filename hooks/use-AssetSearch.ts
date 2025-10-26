import { useState } from "react";

interface Asset {
  id: number;
  asset_id: string;
  asset_name: string;
  asset_type: string;
  classification?: string;
  owner?: string;
  model_version?: string;
  display_name?: string;
  full_info?: string;
}

export function useAssetSearch() {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [assetSearchTerm, setAssetSearchTerm] = useState("");
  const [SearchAssetLoading, setSearchAssetLoading] = useState(false);

  const handleAssetSearch = async (searchTerm: string) => {
    if (searchTerm.length < 3) {
      setAssets([]);
      return;
    }

    setSearchAssetLoading(true);
    try {
      const response = await fetch(`/api/assets/search?q=${encodeURIComponent(searchTerm)}&limit=20`);
      const data = await response.json();

      if (data.success && data.data) {
        setAssets(data.data);
      } else {
        setAssets([]);
      }
    } catch (error) {
      console.error("Error searching assets:", error);
      setAssets([]);
    } finally {
      setSearchAssetLoading(false);
    }
  };

  return {
    assets,
    assetSearchTerm,
    handleAssetSearch,
    setAssets,
    setAssetSearchTerm,
    SearchAssetLoading,
  };
}

