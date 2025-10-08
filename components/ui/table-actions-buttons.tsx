import { Edit, Eye, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PermissionGuard } from "@/components/ui/permission-guard";
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogTitle, AlertDialogDescription, AlertDialogCancel, AlertDialogAction } from "@radix-ui/react-alert-dialog";
import { AlertDialogHeader, AlertDialogFooter } from "./alert-dialog";

export function TableActionButtons({ onView, onEdit, onDelete, actionObj, deleteDialogTitle }: {
    onView?: (actionObj: any) => void;
    onEdit?: (actionObj: any) => void;
    onDelete?: (actionObj: any) => void;
    actionObj?: any;
    deleteDialogTitle?: string
}) {
    return (
        <>
            <PermissionGuard action="read" >
                <Button variant="ghost" size="sm" onClick={() => onView?.(actionObj)}>
                    <Eye className="h-4 w-4" />
                </Button>
            </PermissionGuard>

            <PermissionGuard action="update" >
                <Button variant="ghost" size="sm" onClick={() => onEdit?.(actionObj)}>
                    <Edit className="h-4 w-4" />
                </Button>
            </PermissionGuard>

            <PermissionGuard action="delete" >
                <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-400 hover:bg-red-900/20 hover:text-red-300 dark:text-red-400 dark:hover:bg-red-900/20 dark:hover:text-red-300"
                        >
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                                This action cannot be undone. This will permanently delete the assessment "{deleteDialogTitle}".
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                                onClick={() => onDelete?.(actionObj)}
                                className="bg-red-600 hover:bg-red-700"
                            >
                                Delete Assessment
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
                {/* <Button variant="ghost" size="sm" onClick={() => onDelete?.(actionObj)} className="text-red-400 hover:bg-red-900/20 hover:text-red-300">
                    <Trash2 className="h-4 w-4" />
                </Button> */}
            </PermissionGuard>
        </>
    );
}