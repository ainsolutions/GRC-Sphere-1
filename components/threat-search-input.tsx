"use client";

import { Input } from "@/components/ui/input";
import { AlertTriangle } from "lucide-react";
import { useThreatSearch } from "@/hooks/use-ThreatSearch";
import { useEffect } from "react";

interface ThreatSelectInputProps {
    formData: any;
    setFormData: (data: any) => void;
    fieldName: string;
}

export default function ThreatSelectInput({ formData, setFormData, fieldName }: ThreatSelectInputProps) {
    const { threats, threatSearchTerm, handleThreatSearch, setThreats, setThreatSearchTerm, SearchThreatLoading } = useThreatSearch();
    
    useEffect(() => {
        if (formData[fieldName] && !threatSearchTerm) {
            setThreatSearchTerm(formData[fieldName]);
        }
    }, [formData[fieldName]]);

    return (
        <div className="relative">
            <Input
                id="threat"
                value={threatSearchTerm}
                onChange={(e) => {
                    const value = e.target.value;
                    setThreatSearchTerm(value);
                    setFormData({...formData,[fieldName]: value});
                    handleThreatSearch(value);
                }}
                placeholder={`Search ${fieldName}...`}
            />
            {
                SearchThreatLoading && (
                    <div className="absolute right-10 top-2.5 h-4 w-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                )
            }
            <AlertTriangle className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground" />
            {!SearchThreatLoading && threats.length > 0 && (
                <div className="absolute z-100 w-full mt-1 bg-white dark:bg-gray-800 rounded-xl border-purple-400 shadow-lg max-h-40 overflow-y-auto">
                    {threats.map((threat) => (
                        <div
                            key={threat.id}
                            className="p-2 hover:bg-gray-100 dark:hover:bg-transparent cursor-pointer border rounded-xl border-purple-400"
                            onClick={() => {
                                const threatText = threat.name;
                                setFormData({
                                    ...formData,
                                    [fieldName]: threatText,
                                });
                                setThreatSearchTerm(threatText);
                                setThreats([]);
                            }}
                        >
                            <div className="font-medium">
                                {threat.name}
                            </div>
                            <div className="text-sm text-muted-foreground">
                                {threat.category} - {threat.threat_level}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
