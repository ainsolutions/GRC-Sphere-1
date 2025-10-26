"use client";

import { Input } from "@/components/ui/input";
import { Shield } from "lucide-react";
import { useControlSearch } from "@/hooks/use-ControlSearch";
import { useEffect } from "react";
import { Badge } from "@/components/ui/badge";

interface ControlSelectInputProps {
    formData: any;
    setFormData: (data: any) => void;
    fieldName: string;
    onControlSelected?: (control: any) => void;
}

export default function ControlSelectInput({ 
    formData, 
    setFormData, 
    fieldName, 
    onControlSelected 
}: ControlSelectInputProps) {
    const { controls, controlSearchTerm, handleControlSearch, setControls, setControlSearchTerm, SearchControlLoading } = useControlSearch();
    
    useEffect(() => {
        if (formData[fieldName] && !controlSearchTerm) {
            setControlSearchTerm(formData[fieldName]);
        }
    }, [formData[fieldName]]);

    const handleSelect = (control: any) => {
        const controlText = `${control.control_id} - ${control.name}`;
        setFormData({
            ...formData,
            [fieldName]: controlText,
        });
        setControlSearchTerm(controlText);
        setControls([]);
        
        // Call callback if provided
        if (onControlSelected) {
            onControlSelected(control);
        }
    };

    return (
        <div className="relative">
            <Input
                id="control"
                value={controlSearchTerm}
                onChange={(e) => {
                    const value = e.target.value;
                    setControlSearchTerm(value);
                    setFormData({...formData,[fieldName]: value});
                    handleControlSearch(value);
                }}
                placeholder={`Search ${fieldName}...`}
            />
            {
                SearchControlLoading && (
                    <div className="absolute right-10 top-2.5 h-4 w-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                )
            }
            <Shield className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground" />
            {!SearchControlLoading && controls.length > 0 && (
                <div className="absolute z-50 w-full mt-1 bg-white dark:bg-gray-800 rounded-xl border-purple-400 shadow-lg max-h-60 overflow-y-auto">
                    {controls.map((control) => (
                        <div
                            key={control.id}
                            className="p-3 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer border-b border-gray-200 dark:border-gray-700 last:border-b-0"
                            onClick={() => handleSelect(control)}
                        >
                            <div className="flex items-center justify-between mb-1">
                                <div className="font-medium text-sm">
                                    {control.control_id} - {control.name}
                                </div>
                                <Badge variant="outline" className="text-xs">
                                    {control.framework}
                                </Badge>
                            </div>
                            <div className="text-xs text-muted-foreground line-clamp-1">
                                {control.description}
                            </div>
                            <div className="flex gap-2 mt-1">
                                <Badge variant="secondary" className="text-xs">
                                    {control.category}
                                </Badge>
                                {control.implementation_status && (
                                    <Badge 
                                        variant="outline" 
                                        className={`text-xs ${
                                            control.implementation_status === 'implemented' 
                                                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                                                : control.implementation_status === 'partially_implemented'
                                                ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                                                : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                                        }`}
                                    >
                                        {control.implementation_status.replace(/_/g, ' ')}
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

