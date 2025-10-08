
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bell } from "lucide-react";

export const NotificationIcon = () => {
    return (
        <Button variant="ghost" size="sm" className="relative text-gray-600 dark:text-white">
            <Bell className="h-4 w-4" />
            <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs text-center">
                3
            </Badge>
        </Button>
    )
}