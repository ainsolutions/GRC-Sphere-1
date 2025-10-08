import { type NextRequest, NextResponse } from "next/server"
import { getTablePermissionsByTable } from "@/lib/actions/database-table-actions"
import { withContext, HttpSessionContext } from "@/lib/HttpContext"

export const GET = withContext(async (context: HttpSessionContext, request, { params }: { params: { id: string } }) => {
    try {
      const tableId = Number.parseInt(params.id);
      const result = await getTablePermissionsByTable(tableId);
      return NextResponse.json(result.data);
    } catch (error) {
      console.error("Failed to fetch table permissions:", error);
      return NextResponse.json({ error: "Failed to fetch table permissions" }, { status: 500 });
    }
  }
);
