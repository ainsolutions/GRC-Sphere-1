"use client";

import { Input } from "@/components/ui/input";
import { Building2 } from "lucide-react";
import { useDepartmentSearch } from "@/hooks/use-DepartmentSearch";
import { useEffect } from "react";
import { Badge } from "@/components/ui/badge";

interface DepartmentSelectInputProps {
    formData: any;
    setFormData: (data: any) => void;
    fieldName: string;
    onDepartmentSelected?: (department: any) => void;
}

export default function DepartmentSelectInput({ 
    formData, 
    setFormData, 
    fieldName, 
    onDepartmentSelected 
}: DepartmentSelectInputProps) {
    const { departments, departmentSearchTerm, handleDepartmentSearch, setDepartments, setDepartmentSearchTerm, SearchDepartmentLoading } = useDepartmentSearch();
    
    useEffect(() => {
        if (formData[fieldName] && !departmentSearchTerm) {
            setDepartmentSearchTerm(formData[fieldName]);
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

    const handleSelect = (department: any) => {
        const departmentText = department.name;
        setFormData({
            ...formData,
            [fieldName]: departmentText,
        });
        setDepartmentSearchTerm(departmentText);
        setDepartments([]);
        
        // Call callback if provided
        if (onDepartmentSelected) {
            onDepartmentSelected(department);
        }
    };

    return (
        <div className="relative">
            <Input
                id="department"
                value={departmentSearchTerm}
                onChange={(e) => {
                    const value = e.target.value;
                    setDepartmentSearchTerm(value);
                    setFormData({...formData,[fieldName]: value});
                    handleDepartmentSearch(value);
                }}
                placeholder={`Search ${fieldName}...`}
            />
            {
                SearchDepartmentLoading && (
                    <div className="absolute right-10 top-2.5 h-4 w-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                )
            }
            <Building2 className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground" />
            {!SearchDepartmentLoading && departments.length > 0 && (
                <div className="absolute z-50 w-full mt-1 bg-white dark:bg-gray-800 rounded-xl border-purple-400 shadow-lg max-h-60 overflow-y-auto">
                    {departments.map((department) => (
                        <div
                            key={department.id}
                            className="p-3 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer border-b border-gray-200 dark:border-gray-700 last:border-b-0"
                            onClick={() => handleSelect(department)}
                        >
                            <div className="flex items-center justify-between mb-1">
                                <div className="font-medium text-sm">
                                    {department.name}
                                </div>
                                {department.status && (
                                    <Badge variant="outline" className={`text-xs ${getStatusColor(department.status)}`}>
                                        {department.status}
                                    </Badge>
                                )}
                            </div>
                            {department.description && (
                                <div className="text-xs text-muted-foreground line-clamp-1 mb-1">
                                    {department.description}
                                </div>
                            )}
                            <div className="flex gap-2 flex-wrap mt-1">
                                {department.department_head && (
                                    <Badge variant="secondary" className="text-xs">
                                        Head: {department.department_head}
                                    </Badge>
                                )}
                                {department.cost_center && (
                                    <Badge variant="outline" className="text-xs">
                                        {department.cost_center}
                                    </Badge>
                                )}
                                {department.location && (
                                    <Badge variant="outline" className="text-xs">
                                        📍 {department.location}
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

