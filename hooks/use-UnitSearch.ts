import { useState } from "react";

export interface DepartmentUnit {
  id: number;
  name: string;
  department_unit?: string;
  description?: string;
  department_head?: string;
  parent_department_id?: number;
  parent_department_name?: string;
  location?: string;
  status?: string;
}

export function useUnitSearch() {
  const [units, setUnits] = useState<DepartmentUnit[]>([]);
  const [unitSearchTerm, setUnitSearchTerm] = useState("");
  const [SearchUnitLoading, setSearchUnitLoading] = useState(false);

  const handleUnitSearch = async (searchTerm: string) => {    
    setUnitSearchTerm(searchTerm);

    if (searchTerm.length > 2) {
      setSearchUnitLoading(true);
      try {
        const response = await fetch(`/api/department-units/search?q=${encodeURIComponent(searchTerm)}`);
        
        if (response.ok) {
          const result = await response.json();
          if (result.success) {
            setUnits(result.data as DepartmentUnit[]);
          }
        }
      } catch (error) {
        console.error("Failed to search department units:", error);
      } finally {        
        setSearchUnitLoading(false);
      }
    } else {
      setUnits([]);
    }
  };

  return {
    units,
    unitSearchTerm,
    setUnitSearchTerm,
    handleUnitSearch,
    setUnits,
    SearchUnitLoading
  };
}

