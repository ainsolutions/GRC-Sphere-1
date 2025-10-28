import { NextResponse } from "next/server"
import { withContext } from "@/lib/HttpContext"


export const GET = withContext(async({ tenantDb }, request, { params }: { params: { id: string } }) => {
  try {
    const id = Number(params.id)
    const rows = await tenantDb`SELECT * FROM tech_change_requests WHERE id = ${id}` as Record<string, any>[]
    if (rows.length === 0) return NextResponse.json({ success: false, error: 'Not found' }, { status: 404 })
    return NextResponse.json({ success: true, data: rows[0] })
  } catch (e) {
    console.error("Error fetching change request:", e)
    return NextResponse.json({ success: false, error: "Failed to fetch" }, { status: 500 })
  }
});

export const PUT = withContext(async({ tenantDb }, request, { params }: { params: { id: string } }) => {
  try {
    const id = Number(params.id)
    const body = await request.json()
    const fields = [
      'title','description','asset_id','change_type','change_category','risk_level','risk_analysis','impact_analysis','implementation_plan','rollback_plan','testing_plan','testing_results','post_implementation_review','document_links','initiator','reviewer','approver','planned_start_date','planned_end_date','actual_end_date','status'
    ] as const

    const updates: string[] = []
    for (const f of fields) {
      if (f in body) updates.push(`${f} = ${tenantDb(body[f] ?? null)}`)
    }

    // If asset_id updated, refresh denormalized fields
    if ('asset_id' in body) {
      updates.push(`asset_type = (SELECT asset_type FROM assets WHERE id = ${tenantDb(body.asset_id || null)} LIMIT 1)`)
      updates.push(`cia_confidentiality = (SELECT confidentiality_level FROM assets WHERE id = ${tenantDb(body.asset_id || null)} LIMIT 1)`)
      updates.push(`cia_integrity = (SELECT integrity_level FROM assets WHERE id = ${tenantDb(body.asset_id || null)} LIMIT 1)`)
      updates.push(`cia_availability = (SELECT availability_level FROM assets WHERE id = ${tenantDb(body.asset_id || null)} LIMIT 1)`)
    }

    const setClause = updates.length ? `SET ${updates.join(', ')}, updated_at = CURRENT_TIMESTAMP` : `SET updated_at = CURRENT_TIMESTAMP`

    const result = await tenantDb`
      UPDATE tech_change_requests 
      ${tenantDb.unsafe(setClause)}
      WHERE id = ${id}
      RETURNING *
    ` as Record<string, any>[]

    if (result.length === 0) return NextResponse.json({ success: false, error: 'Not found' }, { status: 404 })
    return NextResponse.json({ success: true, data: result[0] })
  } catch (e) {
    console.error("Error updating change request:", e)
    return NextResponse.json({ success: false, error: "Failed to update" }, { status: 500 })
  }
});

export const DELETE = withContext(async({ tenantDb }, request, { params }: { params: { id: string } }) => {
  try {
    const id = Number(params.id)
    const result = await tenantDb`DELETE FROM tech_change_requests WHERE id = ${id} RETURNING id` as Record<string, any>[]
    if (result.length === 0) return NextResponse.json({ success: false, error: 'Not found' }, { status: 404 })
    return NextResponse.json({ success: true, data: { id } })
  } catch (e) {
    console.error("Error deleting change request:", e)
    return NextResponse.json({ success: false, error: "Failed to delete" }, { status: 500 })
  }
});


