import { useState } from "react";

export interface GovernanceControl {
  id: number;
  name: string;
  description: string;
  control_id: string;
  framework: string;
  category: string;
  subcategory?: string;
  control_type?: string;
  implementation_status: string;
  effectiveness_rating?: string;
  owner: string;
}

export function useControlSearch() {
  const [controls, setControls] = useState<GovernanceControl[]>([]);
  const [controlSearchTerm, setControlSearchTerm] = useState("");
  const [SearchControlLoading, setSearchControlLoading] = useState(false);

  const handleControlSearch = async (searchTerm: string) => {    
    setControlSearchTerm(searchTerm);

    if (searchTerm.length > 2) {
      setSearchControlLoading(true);
      try {
        const response = await fetch(`/api/governance/controls?search=${encodeURIComponent(searchTerm)}`);
        
        if (response.ok) {
          const result = await response.json();
          if (result.success) {
            setControls(result.data as GovernanceControl[]);
          }
        }
      } catch (error) {
        console.error("Failed to search controls:", error);
      } finally {        
        setSearchControlLoading(false);
      }
    } else {
      setControls([]);
    }
  };

  return {
    controls,
    controlSearchTerm,
    setControlSearchTerm,
    handleControlSearch,
    setControls,
    SearchControlLoading
  };
}

