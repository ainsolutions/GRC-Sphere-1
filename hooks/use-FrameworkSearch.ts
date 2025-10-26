import { useState } from "react";

interface Framework {
  id: number;
  framework_name: string;
  version?: string;
  description?: string;
  effective_date?: string;
  status?: string;
  created_at?: string;
}

export function useFrameworkSearch() {
  const [frameworks, setFrameworks] = useState<Framework[]>([]);
  const [frameworkSearchTerm, setFrameworkSearchTerm] = useState("");
  const [SearchFrameworkLoading, setSearchFrameworkLoading] = useState(false);

  const handleFrameworkSearch = async (searchTerm: string) => {
    if (searchTerm.length < 2) {
      setFrameworks([]);
      return;
    }

    setSearchFrameworkLoading(true);
    try {
      const response = await fetch(`/api/compliance-frameworks/search?q=${encodeURIComponent(searchTerm)}`);
      const data = await response.json();

      if (data.success && data.data) {
        setFrameworks(data.data);
      } else {
        setFrameworks([]);
      }
    } catch (error) {
      console.error("Error searching frameworks:", error);
      setFrameworks([]);
    } finally {
      setSearchFrameworkLoading(false);
    }
  };

  return {
    frameworks,
    frameworkSearchTerm,
    handleFrameworkSearch,
    setFrameworks,
    setFrameworkSearchTerm,
    SearchFrameworkLoading,
  };
}

