import { NextResponse } from "next/server"
import { withContext } from "@/lib/HttpContext"

export const GET = withContext(async ({ tenantDb }, _req: Request) => {
  const rows = await tenantDb`
    SELECT b.id::text,
           b.asset_id,
           a.asset_id AS asset_code,
           a.asset_name,
           a.asset_type,
           b.department,
           b.owner,
           b.custodian,
           b.impact_financial,
           b.impact_operational,
           b.impact_reputational,
           b.impact_compliance,
           b.max_tolerable_downtime_hours,
           b.rto_hours,
           b.rpo_hours,
           b.notes,
           b.updated_at
    FROM asset_bia b
    LEFT JOIN assets a ON a.id = b.asset_id
    ORDER BY b.updated_at DESC
    LIMIT 500
  `;
  return NextResponse.json({ success: true, data: rows })
})


