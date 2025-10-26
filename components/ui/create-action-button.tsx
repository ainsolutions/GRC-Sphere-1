import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PermissionGuard } from "@/components/ui/permission-guard";

export function CreateActionButton({ onAdd , btnAddText}: {
  onAdd?: () => void;
  btnAddText?: string;
}) {
  return (
    <PermissionGuard action="create">
      <Button onClick={onAdd}>
        <Plus className="mr-2 h-4 w-4" />
        {btnAddText}
      </Button>
    </PermissionGuard>
  );
}
