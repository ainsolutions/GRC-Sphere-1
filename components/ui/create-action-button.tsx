import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PermissionGuard } from "@/components/ui/permission-guard";

export function CreateActionButton({ onAdd , btnText}: {
  onAdd?: () => void;
  btnText?: string;
}) {
  return (
    <PermissionGuard action="create">
      <Button className="w-full" onClick={onAdd}>
        <Plus className="mr-2 h-4 w-4" />
        {btnText}
      </Button>
    </PermissionGuard>
  );
}
