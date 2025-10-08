"use client";

import { Input } from "@/components/ui/input";
import { Target } from "lucide-react";
import { useOwnerSearch } from "@/hooks/use-OwnerSearch";
import { useEffect } from "react";

interface OwnerSelectInputProps {
    formData: any;
    setFormData: (data: any) => void;
    fieldName: string;
}

export default function OwnerSelectInput({ formData, setFormData, fieldName }: OwnerSelectInputProps) {
    const { owners, ownerSearchTerm, handleOwnerSearch, setOwners, setOwnerSearchTerm,SearchOwnerLoading } = useOwnerSearch();
    
    useEffect(() => {
  
  if (formData[fieldName] && !ownerSearchTerm) {
    setOwnerSearchTerm(formData[fieldName]);
  }
}, [formData[fieldName]]);

    return (
        <div className="relative">
            <Input
                id="owner"
                value={ownerSearchTerm}
                onChange={(e) => {
                    const value = e.target.value;
                    setOwnerSearchTerm(value);
                    setFormData({...formData,[fieldName]: value});
                    handleOwnerSearch(value);
                }}
                placeholder={`Search ${fieldName}...`}
            />
            {
                SearchOwnerLoading && (
                    <div className="absolute right-10 top-2.5 h-4 w-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                )
            }
            <Target className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground" />
            {!SearchOwnerLoading && owners.length > 0 && (
                <div className="absolute z-100 w-full mt-1 bg-white dark:bg-gray-800 rounded-xl border-purple-400  shadow-lg max-h-40 overflow-y-auto">
                    {owners.map((owner) => (
                        <div
                            key={owner.id}
                            className="p-2 hover:bg-gray-100 dark:hover:bg-transparent cursor-pointer border rounded-xl border-purple-400"
                            onClick={() => {
                                const ownerText = `${owner.username} <${owner.email}>`;
                                setFormData({
                                    ...formData,
                                    [fieldName]: ownerText,
                                });
                                setOwnerSearchTerm(ownerText);
                                setOwners([]);
                            }}
                        >
                            <div className="font-medium">
                                {owner.first_name + " " + owner.last_name}
                            </div>
                            <div className="text-sm text-muted-foreground">
                                {`${owner.username} <${owner.email}>`}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>

    );
}
