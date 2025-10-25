"use client";

import { Input } from "@/components/ui/input";
import { AlertTriangle } from "lucide-react";
import { useRiskSearch } from "@/hooks/use-RiskSearch";
import { useEffect } from "react";
import { Badge } from "@/components/ui/badge";

interface RiskSelectInputProps {
    formData: any;
    setFormData: (data: any) => void;
    fieldName: string;
    onRiskSelected?: (risk: any) => void;
}

export default function RiskSelectInput({ 
    formData, 
    setFormData, 
    fieldName, 
    onRiskSelected 
}: RiskSelectInputProps) {
    const { risks, riskSearchTerm, handleRiskSearch, setRisks, setRiskSearchTerm, SearchRiskLoading } = useRiskSearch();

  useEffect(() => {
        if (formData[fieldName] && !riskSearchTerm) {
            setRiskSearchTerm(formData[fieldName]);
        }
    }, [formData[fieldName]]);

    const getRiskLevelColor = (level: string) => {
        switch (level?.toLowerCase()) {
            case 'critical':
                return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
            case 'high':
                return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
            case 'medium':
                return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
            case 'low':
                return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
            default:
                return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
        }
    };

    const getSourceColor = (source: string) => {
        switch (source) {
            case 'ISO27001':
                return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
            case 'NIST_CSF':
                return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
            case 'FAIR':
                return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200';
            default:
                return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
        }
    };

    const handleSelect = (risk: any) => {
        const riskText = `${risk.risk_id} - ${risk.title} (${risk.source})`;
        setFormData({
            ...formData,
            [fieldName]: riskText,
        });
        setRiskSearchTerm(riskText);
        setRisks([]);
        
        // Call callback if provided
        if (onRiskSelected) {
            onRiskSelected(risk);
        }
    };

  return (
        <div className="relative">
            <Input
                id="risk"
                value={riskSearchTerm}
                onChange={(e) => {
                    const value = e.target.value;
                    setRiskSearchTerm(value);
                    setFormData({...formData,[fieldName]: value});
                    handleRiskSearch(value);
                }}
                placeholder={`Search ${fieldName}...`}
            />
            {
                SearchRiskLoading && (
                    <div className="absolute right-10 top-2.5 h-4 w-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                )
            }
            <AlertTriangle className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground" />
            {!SearchRiskLoading && risks.length > 0 && (
                <div className="absolute z-50 w-full mt-1 bg-white dark:bg-gray-800 rounded-xl border-purple-400 shadow-lg max-h-80 overflow-y-auto">
                    {risks.map((risk) => (
                      <div
                            key={`${risk.source}-${risk.id}`}
                            className="p-3 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer border-b border-gray-200 dark:border-gray-700 last:border-b-0"
                            onClick={() => handleSelect(risk)}
                        >
                            <div className="flex items-center justify-between mb-1">
                                <div className="font-medium text-sm">
                            {risk.risk_id}
                                </div>
                                <div className="flex gap-1">
                                    <Badge variant="outline" className={`text-xs ${getSourceColor(risk.source)}`}>
                                        {risk.source.replace('_', ' ')}
                                    </Badge>
                                    {risk.risk_level && (
                                        <Badge variant="outline" className={`text-xs ${getRiskLevelColor(risk.risk_level)}`}>
                                            {risk.risk_level}
                                        </Badge>
                                    )}
                                </div>
                            </div>
                            <div className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-1">
                                {risk.title}
                            </div>
                            <div className="text-xs text-muted-foreground line-clamp-2">
                                {risk.description}
                            </div>
                            <div className="flex gap-2 mt-2">
                                {risk.category && (
                                    <Badge variant="secondary" className="text-xs">
                                        {risk.category}
                          </Badge>
                                )}
                                {risk.status && (
                                    <Badge variant="outline" className="text-xs">
                                        {risk.status}
                          </Badge>
                                )}
                                {risk.likelihood && risk.impact && (
                          <Badge variant="outline" className="text-xs">
                                        L:{risk.likelihood} I:{risk.impact}
                          </Badge>
                                )}
                            </div>
                      </div>
                    ))}
                  </div>
          )}
        </div>
    );
}
