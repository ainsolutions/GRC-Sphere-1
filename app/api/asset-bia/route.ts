import { NextResponse } from "next/server"
import { withContext } from "@/lib/HttpContext"

export const GET = withContext(async ({ tenantDb }, req: Request) => {
  const { searchParams } = new URL(req.url);
  const assetId = searchParams.get("assetId");
  if (!assetId) return NextResponse.json({ success: false, error: "assetId is required" }, { status: 400 });

  const rows = (await tenantDb`
    SELECT id::text, asset_id, department, owner, custodian,
           impact_financial, impact_operational, impact_reputational, impact_compliance,
           max_tolerable_downtime_hours, rto_hours, rpo_hours, notes,
           daily_revenue, hourly_loss, aggregate_financial_loss,
           created_at, updated_at
    FROM asset_bia
    WHERE asset_id = ${Number(assetId)}
    LIMIT 1
  `) as Record<string, any>[];

  return NextResponse.json({ success: true, data: rows[0] || null });
});

export const POST = withContext(async ({ tenantDb }, req: Request) => {
  const body = await req.json();
  const {
    asset_id,
    department,
    owner,
    custodian,
    impact_financial,
    impact_operational,
    impact_reputational,
    impact_compliance,
    max_tolerable_downtime_hours,
    rto_hours,
    rpo_hours,
    notes,
    daily_revenue,
    hourly_loss,
    aggregate_financial_loss,
  } = body || {};

  if (!asset_id) return NextResponse.json({ success: false, error: "asset_id is required" }, { status: 400 });

  const rows = (await tenantDb`
    INSERT INTO asset_bia (
      asset_id, department, owner, custodian,
      impact_financial, impact_operational, impact_reputational, impact_compliance,
      max_tolerable_downtime_hours, rto_hours, rpo_hours, notes,
      daily_revenue, hourly_loss, aggregate_financial_loss,
      updated_at
    )
    VALUES (
      ${asset_id}, ${department}, ${owner}, ${custodian},
      ${impact_financial}, ${impact_operational}, ${impact_reputational}, ${impact_compliance},
      ${max_tolerable_downtime_hours}, ${rto_hours}, ${rpo_hours}, ${notes},
      ${daily_revenue}, ${hourly_loss}, ${aggregate_financial_loss},
      NOW()
    )
    ON CONFLICT (asset_id) DO UPDATE SET
      department = EXCLUDED.department,
      owner = EXCLUDED.owner,
      custodian = EXCLUDED.custodian,
      impact_financial = EXCLUDED.impact_financial,
      impact_operational = EXCLUDED.impact_operational,
      impact_reputational = EXCLUDED.impact_reputational,
      impact_compliance = EXCLUDED.impact_compliance,
      max_tolerable_downtime_hours = EXCLUDED.max_tolerable_downtime_hours,
      rto_hours = EXCLUDED.rto_hours,
      rpo_hours = EXCLUDED.rpo_hours,
      notes = EXCLUDED.notes,
      daily_revenue = EXCLUDED.daily_revenue,
      hourly_loss = EXCLUDED.hourly_loss,
      aggregate_financial_loss = EXCLUDED.aggregate_financial_loss,
      updated_at = NOW()
    RETURNING id::text, asset_id, department, owner, custodian,
              impact_financial, impact_operational, impact_reputational, impact_compliance,
              max_tolerable_downtime_hours, rto_hours, rpo_hours, notes,
              daily_revenue, hourly_loss, aggregate_financial_loss,
              created_at, updated_at
  `) as Record<string, any>[];

  return NextResponse.json({ success: true, data: rows[0] }, { status: 201 });
});


