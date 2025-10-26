import { CreateActionButton } from "@/components/ui/create-action-button";
import { TableActionButtons } from "@/components/ui/table-actions-buttons";


interface ActionButtonsProps {
  isTableAction: boolean;
  onAdd?: () => void;
  onView?: (actionObj: any) => void;
  onEdit?: (actionObj: any) => void;
  onDelete?: (actionObj: any) => void;
  actionObj?: any;
  btnAddText?: string;
  deleteDialogTitle?: string;
}

export function ActionButtons(props: ActionButtonsProps) {
  if (props.isTableAction) {
    return <TableActionButtons {...props} />;
  }
  return <CreateActionButton {...props} />;
}

