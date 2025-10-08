import { type NextRequest, NextResponse } from "next/server"
import { withContext } from "@/lib/HttpContext"


export const GET = withContext(async({ tenantDb }, request) => {
  try {
    const currentYear = new Date().getFullYear()

    // Check if technology_risks table exists
    const tableCheck = await tenantDb`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'technology_risks'
      );
    ` as Record<string, any>[]

    if (!tableCheck[0]?.exists) {
      console.log("Technology risks table does not exist, generating fallback ID")
      const randomNum = Math.floor(Math.random() * 100000)
        .toString()
        .padStart(5, "0")
      const fallbackId = `TR-${currentYear}-${randomNum}`

      return NextResponse.json({
        success: true,
        risk_id: fallbackId,
      })
    }

    try {
      const result = await tenantDb`
        SELECT COALESCE(MAX(CAST(SUBSTRING(risk_id FROM 9) AS INTEGER)), 0) + 1 as next_id
        FROM technology_risks 
        WHERE risk_id LIKE ${"TR-" + currentYear + "-%"}
      ` as Record<string, any>[]

      const nextId = result[0]?.next_id || 1
      const riskId = `TR-${currentYear}-${nextId.toString().padStart(5, "0")}`

      console.log("Generated risk ID:", riskId)

      return NextResponse.json({
        success: true,
        risk_id: riskId,
      })
    } catch (error) {
      console.error("Error querying for next risk ID:", error)
      // Fallback to random ID
      const randomNum = Math.floor(Math.random() * 100000)
        .toString()
        .padStart(5, "0")
      const fallbackId = `TR-${currentYear}-${randomNum}`

      return NextResponse.json({
        success: true,
        risk_id: fallbackId,
      })
    }
  } catch (error) {
    console.error("Error generating risk ID:", error)

    // Final fallback
    const currentYear = new Date().getFullYear()
    const randomNum = Math.floor(Math.random() * 100000)
      .toString()
      .padStart(5, "0")
    const fallbackId = `TR-${currentYear}-${randomNum}`

    return NextResponse.json({
      success: true,
      risk_id: fallbackId,
    })
  }
});
