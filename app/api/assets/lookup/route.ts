import { NextResponse } from "next/server"
import { withContext } from "@/lib/HttpContext"

export const GET = withContext(async ({ tenantDb }, request) => {
  try {
    const { searchParams } = new URL(request.url)
    const q = searchParams.get("q") || ""

    const assets = await tenantDb`
      SELECT id, asset_id, asset_name, asset_type
      FROM assets
      WHERE asset_name ILIKE ${"%" + q + "%"}
         OR asset_id ILIKE ${"%" + q + "%"}
      LIMIT 10
    `

    return NextResponse.json({ success: true, data: assets })
  } catch (error: any) {
    console.error("Error searching assets:", error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
})
