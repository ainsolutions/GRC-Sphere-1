import { NextResponse } from "next/server"
import { withContext } from "@/lib/HttpContext"


export const GET = withContext(async({ tenantDb }, request) => {
  try {
    const currentYear = new Date().getFullYear()

    // Get the next sequence number for the current year
    const result = await tenantDb`
      SELECT COALESCE(MAX(CAST(SUBSTRING(vendor_id FROM 10) AS INTEGER)), 0) + 1 as next_sequence
      FROM vendors 
      WHERE vendor_id LIKE ${"VNC-" + currentYear + "-%"}
    ` as Record<string, any>[]

    const nextSequence = result[0].next_sequence
    const vendorId = `VNC-${currentYear}-${nextSequence.toString().padStart(4, "0")}`

    return NextResponse.json({
      success: true,
      data: { vendor_id: vendorId },
    })
  } catch (error) {
    console.error("Error generating vendor ID:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to generate vendor ID",
      },
      { status: 500 },
    )
  }
});
