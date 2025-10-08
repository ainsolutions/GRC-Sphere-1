import { useState } from "react";
import { getUserAsOwner } from "@/lib/actions/user-actions"
import { Owner } from "@/lib/types/owner"

export function useOwnerSearch() {
  const [owners, setOwners] = useState<Owner[]>([]);
  const [ownerSearchTerm, setOwnerSearchTerm] = useState("");
  const [SearchOwnerLoading, setSearchOwnerLoading] = useState(false);

  const handleOwnerSearch = async (searchTerm: string) => {    
    setOwnerSearchTerm(searchTerm);

    if (searchTerm.length > 2) {
      setSearchOwnerLoading(true);
      try {
        const result = await getUserAsOwner(searchTerm);
        if (result.success) {
            setOwners(result.data as Owner[]);
        }
      } catch (error) {
        console.error("Failed to search owners:", error);
      }finally{        
        setSearchOwnerLoading(false);
      }
    } else {
      setOwners([]);
    }
  };

    return {
        owners,
        ownerSearchTerm,
        setOwnerSearchTerm,
        handleOwnerSearch,
        setOwners,
        SearchOwnerLoading
    };
}