"use client";

import { Input } from "@/components/ui/input";
import { BookOpen } from "lucide-react";
import { useFrameworkSearch } from "@/hooks/use-FrameworkSearch";
import { useEffect } from "react";
import { Badge } from "@/components/ui/badge";

interface FrameworkSelectInputProps {
    formData: any;
    setFormData: (data: any) => void;
    fieldName: string;
    onFrameworkSelected?: (framework: any) => void;
}

export default function FrameworkSelectInput({ 
    formData, 
    setFormData, 
    fieldName,
    onFrameworkSelected 
}: FrameworkSelectInputProps) {
    const { 
        frameworks, 
        frameworkSearchTerm, 
        handleFrameworkSearch, 
        setFrameworks, 
        setFrameworkSearchTerm,
        SearchFrameworkLoading 
    } = useFrameworkSearch();
    
    useEffect(() => {
        if (formData[fieldName] && !frameworkSearchTerm) {
            setFrameworkSearchTerm(formData[fieldName]);
        }
    }, [formData[fieldName]]);

    return (
        <div className="relative">
            <Input
                id={fieldName}
                value={frameworkSearchTerm}
                onChange={(e) => {
                    const value = e.target.value;
                    setFrameworkSearchTerm(value);
                    setFormData({...formData, [fieldName]: value});
                    handleFrameworkSearch(value);
                }}
                placeholder="Search frameworks..."
            />
            {
                SearchFrameworkLoading && (
                    <div className="absolute right-10 top-2.5 h-4 w-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                )
            }
            <BookOpen className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground" />
            {!SearchFrameworkLoading && frameworks.length > 0 && (
                <div className="absolute z-50 w-full mt-1 bg-white dark:bg-gray-800 rounded-xl border-purple-400 shadow-lg max-h-60 overflow-y-auto">
                    {frameworks.map((framework) => (
                        <div
                            key={framework.id}
                            className="p-3 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer border-b border-purple-400 last:border-b-0"
                            onClick={() => {
                                const frameworkText = framework.version 
                                    ? `${framework.framework_name} (${framework.version})`
                                    : framework.framework_name;
                                setFormData({
                                    ...formData,
                                    [fieldName]: frameworkText,
                                });
                                setFrameworkSearchTerm(frameworkText);
                                setFrameworks([]);
                                
                                // Call optional callback with full framework data
                                if (onFrameworkSelected) {
                                    onFrameworkSelected(framework);
                                }
                            }}
                        >
                            <div className="flex items-center justify-between">
                                <div className="font-medium text-sm">
                                    {framework.framework_name}
                                </div>
                                {framework.version && (
                                    <Badge variant="outline" className="text-xs">
                                        v{framework.version}
                                    </Badge>
                                )}
                            </div>
                            {framework.description && (
                                <div className="text-xs text-muted-foreground mt-1 line-clamp-2">
                                    {framework.description}
                                </div>
                            )}
                            <div className="flex items-center gap-2 mt-1">
                                {framework.status && (
                                    <Badge 
                                        variant={framework.status === 'Active' ? 'default' : 'secondary'} 
                                        className="text-xs"
                                    >
                                        {framework.status}
                                    </Badge>
                                )}
                                {framework.effective_date && (
                                    <span className="text-xs text-muted-foreground">
                                        Effective: {new Date(framework.effective_date).toLocaleDateString()}
                                    </span>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

