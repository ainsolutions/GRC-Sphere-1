import { Edit, Eye, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PermissionGuard } from "@/components/ui/permission-guard";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from "@/components/ui/tooltip";

export function TableActionButtons({
  onView,
  onEdit,
  onDelete,
  actionObj,
  deleteDialogTitle, // ✅ use this prop instead of undefined dialogTitle
}: {
  onView?: (actionObj: any) => void;
  onEdit?: (actionObj: any) => void;
  onDelete?: (actionObj: any) => void;
  actionObj?: any;
  deleteDialogTitle?: string; // ✅ properly typed
}) {
  return (
     <TooltipProvider delayDuration={0}>
      <div className="flex gap-1">
        {onView && (
          <PermissionGuard action="read">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="sm" onClick={() => onView?.(actionObj)}>
                  <Eye className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent sideOffset={6}>View</TooltipContent>
            </Tooltip>
          </PermissionGuard>
        )}

        {onEdit && (
          <PermissionGuard action="update">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="sm" onClick={() => onEdit?.(actionObj)}>
                  <Edit className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent sideOffset={6}>Edit</TooltipContent>
            </Tooltip>
          </PermissionGuard>
        )}

        {onDelete && (
          <PermissionGuard action="delete">
            {/* Keep AlertDialog at top level */}
            <AlertDialog>
              {/* place TooltipTrigger around the Dialog Trigger's child (the actual Button) */}
              <Tooltip>
                <AlertDialogTrigger asChild>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-red-400 hover:bg-red-900/20 hover:text-red-300 dark:text-red-400 dark:hover:bg-red-900/20 dark:hover:text-red-300"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                </AlertDialogTrigger>

                <TooltipContent sideOffset={6}>Delete</TooltipContent>
              </Tooltip>

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
          </PermissionGuard>
        )}
      </div>
    </TooltipProvider>
  );
}
