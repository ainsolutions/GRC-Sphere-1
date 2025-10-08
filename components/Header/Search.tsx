import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

export const MainSearch = () => {

      const [searchQuery, setSearchQuery] = useState("");
    
    return (
        <div className="flex w-5/6 items-center flex-1 space-y-4">
            <div className="relative w-96">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <Input
                    placeholder="Search assets, risks, controls..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                />
            </div>
        </div>);
}
