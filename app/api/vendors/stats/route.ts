import { NextResponse } from "next/server"
import { withContext } from "@/lib/HttpContext"


export const GET = withContext(async({ tenantDb }, request) => {
  try {
    const stats = await tenantDb`
      SELECT 
        COUNT(*) as total_vendors,
        COUNT(CASE WHEN status = 'Active' THEN 1 END) as active_vendors,
        COUNT(CASE WHEN status = 'Inactive' THEN 1 END) as inactive_vendors,
        COUNT(CASE WHEN status = 'Pending' THEN 1 END) as pending_vendors,
        COUNT(CASE WHEN risk_level = 'High' THEN 1 END) as high_risk_vendors,
        COUNT(CASE WHEN risk_level = 'Critical' THEN 1 END) as critical_risk_vendors,
        COUNT(CASE WHEN contract_end_date < CURRENT_DATE THEN 1 END) as expired_contracts,
        COUNT(CASE WHEN contract_end_date BETWEEN CURRENT_DATE AND CURRENT_DATE + INTERVAL '30 days' THEN 1 END) as expiring_soon_contracts
      FROM vendors
    ` as Record<string, any>[]

    const riskDistribution = await tenantDb`
      SELECT 
        risk_level,
        COUNT(*) as count
      FROM vendors
      WHERE risk_level IS NOT NULL
      GROUP BY risk_level
      ORDER BY 
        CASE risk_level
          WHEN 'Critical' THEN 1
          WHEN 'High' THEN 2
          WHEN 'Medium' THEN 3
          WHEN 'Low' THEN 4
          ELSE 5
        END
    `

    const vendorTypes = await tenantDb`
      SELECT 
        vendor_type,
        COUNT(*) as count
      FROM vendors
      WHERE vendor_type IS NOT NULL
      GROUP BY vendor_type
      ORDER BY count DESC
      LIMIT 10
    `

    return NextResponse.json({
      success: true,
      data: {
        summary: stats[0],
        riskDistribution,
        vendorTypes,
      },
    })
  } catch (error) {
    console.error("Error fetching vendor stats:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch vendor statistics",
      },
      { status: 500 },
    )
  }
});
