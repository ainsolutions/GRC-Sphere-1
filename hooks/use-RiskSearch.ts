import { useState } from "react";

export interface UnifiedRisk {
  id: string;
  risk_id: string;
  title: string;
  description: string;
  risk_level: string;
  source: "ISO27001" | "NIST_CSF" | "FAIR";
  category?: string;
  status?: string;
  likelihood?: number;
  impact?: number;
}

export function useRiskSearch() {
  const [risks, setRisks] = useState<UnifiedRisk[]>([]);
  const [riskSearchTerm, setRiskSearchTerm] = useState("");
  const [SearchRiskLoading, setSearchRiskLoading] = useState(false);

  const handleRiskSearch = async (searchTerm: string) => {    
    setRiskSearchTerm(searchTerm);

    if (searchTerm.length > 2) {
      setSearchRiskLoading(true);
      try {
        const response = await fetch(`/api/unified-risks/search?q=${encodeURIComponent(searchTerm)}`);
        
        if (response.ok) {
          const result = await response.json();
          if (result.success) {
            setRisks(result.data as UnifiedRisk[]);
          }
        }
      } catch (error) {
        console.error("Failed to search risks:", error);
      } finally {        
        setSearchRiskLoading(false);
      }
    } else {
      setRisks([]);
    }
  };

  return {
    risks,
    riskSearchTerm,
    setRiskSearchTerm,
    handleRiskSearch,
    setRisks,
    SearchRiskLoading
  };
}

