import { useState } from "react";
import { getThreats } from "@/lib/actions/threat-actions";

export interface Threat {
  id: string;
  threat_id: string;
  name: string;
  description: string;
  category: string;
  source: string;
  threat_level: string;
  status: string;
}

export function useThreatSearch() {
  const [threats, setThreats] = useState<Threat[]>([]);
  const [threatSearchTerm, setThreatSearchTerm] = useState("");
  const [SearchThreatLoading, setSearchThreatLoading] = useState(false);

  const handleThreatSearch = async (searchTerm: string) => {    
    setThreatSearchTerm(searchTerm);

    if (searchTerm.length > 2) {
      setSearchThreatLoading(true);
      try {
        const result = await getThreats(searchTerm);
        if (result.success) {
          setThreats(result.data as Threat[]);
        }
      } catch (error) {
        console.error("Failed to search threats:", error);
      } finally {        
        setSearchThreatLoading(false);
      }
    } else {
      setThreats([]);
    }
  };

  return {
    threats,
    threatSearchTerm,
    setThreatSearchTerm,
    handleThreatSearch,
    setThreats,
    SearchThreatLoading
  };
}
