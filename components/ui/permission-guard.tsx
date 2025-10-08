import { usePathname } from "next/navigation";
import { useSession } from "../session-provider";

type PermissionAction = "read" | "create" | "update" | "delete";

export function PermissionGuard({ action, children }: {
    action: PermissionAction;
    children: React.ReactNode;
}) {
    const { hasPermission } = useSession();
    const path = usePathname();
    return hasPermission(path, action) ? <>{children}</> : null;
}
