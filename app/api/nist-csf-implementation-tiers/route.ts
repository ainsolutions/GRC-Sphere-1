import { NextResponse } from "next/server"
import { withContext } from "@/lib/HttpContext"

export const GET = withContext(async({ tenantDb }, request) => {
  try {
    const tiers = await tenantDb`
      SELECT 
        tier_level,
        tier_name,
        tier_description,
        characteristics   
      FROM nist_csf_implementation_tiers
      ORDER BY tier_level ASC
    `

    return NextResponse.json({
      success: true,
      data: tiers,
    })
  } catch (error) {
    console.error("Error fetching NIST CSF implementation tiers:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch implementation tiers",
      },
      { status: 500 },
    )
  }
});
