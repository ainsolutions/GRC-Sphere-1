"use client";

import { Input } from "@/components/ui/input";
import { Building } from "lucide-react";
import { useUnitSearch } from "@/hooks/use-UnitSearch";
import { useEffect } from "react";
import { Badge } from "@/components/ui/badge";

interface UnitSelectInputProps {
    formData: any;
    setFormData: (data: any) => void;
    fieldName: string;
    onUnitSelected?: (unit: any) => void;
}

export default function UnitSelectInput({ 
    formData, 
    setFormData, 
    fieldName, 
    onUnitSelected 
}: UnitSelectInputProps) {
    const { units, unitSearchTerm, handleUnitSearch, setUnits, setUnitSearchTerm, SearchUnitLoading } = useUnitSearch();
    
    useEffect(() => {
        if (formData[fieldName] && !unitSearchTerm) {
            setUnitSearchTerm(formData[fieldName]);
        }
    }, [formData[fieldName]]);

    const getStatusColor = (status?: string) => {
        switch (status?.toLowerCase()) {
            case 'active':
                return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
            case 'inactive':
                return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
            default:
                return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
        }
    };

    const handleSelect = (unit: any) => {
        const unitText = unit.department_unit || unit.name;
        setFormData({
            ...formData,
            [fieldName]: unitText,
        });
        setUnitSearchTerm(unitText);
        setUnits([]);
        
        // Call callback if provided
        if (onUnitSelected) {
            onUnitSelected(unit);
        }
    };

    return (
        <div className="relative">
            <Input
                id="unit"
                value={unitSearchTerm}
                onChange={(e) => {
                    const value = e.target.value;
                    setUnitSearchTerm(value);
                    setFormData({...formData,[fieldName]: value});
                    handleUnitSearch(value);
                }}
                placeholder={`Search ${fieldName}...`}
            />
            {
                SearchUnitLoading && (
                    <div className="absolute right-10 top-2.5 h-4 w-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                )
            }
            <Building className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground" />
            {!SearchUnitLoading && units.length > 0 && (
                <div className="absolute z-50 w-full mt-1 bg-white dark:bg-gray-800 rounded-xl border-purple-400 shadow-lg max-h-60 overflow-y-auto">
                    {units.map((unit) => (
                        <div
                            key={unit.id}
                            className="p-3 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer border-b border-gray-200 dark:border-gray-700 last:border-b-0"
                            onClick={() => handleSelect(unit)}
                        >
                            <div className="flex items-center justify-between mb-1">
                                <div className="font-medium text-sm">
                                    {unit.department_unit || unit.name}
                                </div>
                                {unit.status && (
                                    <Badge variant="outline" className={`text-xs ${getStatusColor(unit.status)}`}>
                                        {unit.status}
                                    </Badge>
                                )}
                            </div>
                            <div className="text-xs text-muted-foreground">
                                {unit.name} {unit.parent_department_name ? `(Parent: ${unit.parent_department_name})` : ''}
                            </div>
                            {unit.description && (
                                <div className="text-xs text-muted-foreground line-clamp-1 mt-1">
                                    {unit.description}
                                </div>
                            )}
                            <div className="flex gap-2 flex-wrap mt-1">
                                {unit.department_head && (
                                    <Badge variant="secondary" className="text-xs">
                                        Head: {unit.department_head}
                                    </Badge>
                                )}
                                {unit.location && (
                                    <Badge variant="outline" className="text-xs">
                                        📍 {unit.location}
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

