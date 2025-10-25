import { NextResponse } from "next/server"
import { getDatabase } from "@/lib/database"
import { withContext } from "@/lib/HttpContext"


export const GET = withContext( async ({ tenantDb }) => {
  try {
    const assets = await tenantDb`
      SELECT 
        id,
        asset_id,
        asset_name,
        asset_type,
        classification,
        owner,
        custodian,
        retention_period,
        disposal_method,
        location,
        business_value,
        
      FROM assets 
      ORDER BY asset_name ASC
    `

    return NextResponse.json(assets)
  } catch (error) {
    console.error("Error fetching assets list:", error)
    return NextResponse.json({ error: "Failed to fetch assets list" }, { status: 500 })
  }
})
