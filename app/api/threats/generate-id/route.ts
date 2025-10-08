import { type NextRequest, NextResponse } from "next/server"
import { withContext } from "@/lib/HttpContext"


export const GET = withContext(async({ tenantDb }, request) => {
  try {
    // Get the current year for the threat ID prefix
    const currentYear = new Date().getFullYear()

    // Find the highest existing threat ID number
    const result = await tenantDb`
      SELECT MAX(CAST(SUBSTRING(threat_id FROM 5) AS INTEGER)) as max_id
      FROM threats
      WHERE threat_id LIKE ${`THR-${currentYear.toString().slice(-2)}%`}
    ` as Record<string, any>[]

    const maxId = result[0]?.max_id || 0
    const nextId = maxId + 1

    // Format the ID as THR-YYXXXXX (YY = last 2 digits of year, XXXXX = 5-digit number)
    const threatId = `THR-${currentYear.toString().slice(-2)}${nextId.toString().padStart(5, '0')}`

    return NextResponse.json({
      success: true,
      threatId,
      message: "Threat ID generated successfully"
    })

  } catch (error: any) {
    console.error("Error generating threat ID:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to generate threat ID",
        details: error.message
      },
      { status: 500 }
    )
  }
});
