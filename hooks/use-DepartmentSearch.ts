import { useState } from "react";

export interface Department {
  id: number;
  name: string;
  description?: string;
  organization_id?: number;
  department_head?: string;
  cost_center?: string;
  location?: string;
  status?: string;
}

export function useDepartmentSearch() {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [departmentSearchTerm, setDepartmentSearchTerm] = useState("");
  const [SearchDepartmentLoading, setSearchDepartmentLoading] = useState(false);

  const handleDepartmentSearch = async (searchTerm: string) => {    
    setDepartmentSearchTerm(searchTerm);

    if (searchTerm.length > 2) {
      setSearchDepartmentLoading(true);
      try {
        const response = await fetch(`/api/departments/search?q=${encodeURIComponent(searchTerm)}`);
        
        if (response.ok) {
          const result = await response.json();
          if (result.success) {
            setDepartments(result.data as Department[]);
          }
        }
      } catch (error) {
        console.error("Failed to search departments:", error);
      } finally {        
        setSearchDepartmentLoading(false);
      }
    } else {
      setDepartments([]);
    }
  };

  return {
    departments,
    departmentSearchTerm,
    setDepartmentSearchTerm,
    handleDepartmentSearch,
    setDepartments,
    SearchDepartmentLoading
  };
}

