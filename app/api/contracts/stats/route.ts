import { type NextRequest, NextResponse } from "next/server"
import { withContext } from "@/lib/HttpContext"
import { getDatabase } from "@/lib/database"

const sql = getDatabase()

export const GET = withContext(async ({ tenantDb }, request: Request) => {
  try {
    // Get basic contract statistics
    const statsResult = await tenantDb`
      SELECT 
        COUNT(*) as total_contracts,
        COUNT(CASE WHEN contract_status = 'Active' THEN 1 END) as active_contracts,
        COUNT(CASE WHEN contract_status = 'Draft' THEN 1 END) as draft_contracts,
        COUNT(CASE WHEN contract_status = 'Expired' THEN 1 END) as expired_contracts,
        COUNT(CASE WHEN end_date <= CURRENT_DATE + INTERVAL '30 days' AND contract_status = 'Active' THEN 1 END) as expiring_soon,
        COALESCE(SUM(contract_value), 0) as total_value,
        COALESCE(AVG(contract_value), 0) as average_value
      FROM contracts
    ` as Record<string, any>[]
    if (!Array.isArray(statsResult) ||
  statsResult.length === 0 ||
  typeof statsResult[0] !== "object"
    ) {
  throw new Error("Unexpected result from stats query");
  }

    // Get contract type distribution
    const typeDistribution = await tenantDb`
      SELECT 
        contract_type,
        COUNT(*) as count,
        COALESCE(SUM(contract_value), 0) as total_value
      FROM contracts
      GROUP BY contract_type
      ORDER BY count DESC
    `

    // Get vendor distribution
    const vendorDistribution = await tenantDb`
      SELECT 
        v.vendor_name,
        COUNT(c.id) as contract_count,
        COALESCE(SUM(c.contract_value), 0) as total_value
      FROM vendors v
      LEFT JOIN contracts c ON v.id = c.vendor_id
      GROUP BY v.id, v.vendor_name
      HAVING COUNT(c.id) > 0
      ORDER BY contract_count DESC
      LIMIT 10
    `

    // Get monthly contract creation trend
    const monthlyTrend = await tenantDb`
      SELECT 
        DATE_TRUNC('month', created_at) as month,
        COUNT(*) as contracts_created,
        COALESCE(SUM(contract_value), 0) as total_value
      FROM contracts
      WHERE created_at >= CURRENT_DATE - INTERVAL '12 months'
      GROUP BY DATE_TRUNC('month', created_at)
      ORDER BY month DESC
    `

    // Get upcoming renewals
    const upcomingRenewals = await tenantDb`
      SELECT 
        id,
        contract_name,
        vendor_name,
        end_date,
        contract_value,
        CASE 
          WHEN end_date <= CURRENT_DATE THEN 'Overdue'
          WHEN end_date <= CURRENT_DATE + INTERVAL '30 days' THEN 'Critical'
          WHEN end_date <= CURRENT_DATE + INTERVAL '90 days' THEN 'Warning'
          ELSE 'Normal'
        END as urgency
      FROM contracts
      WHERE contract_status = 'Active' 
        AND end_date <= CURRENT_DATE + INTERVAL '90 days'
      ORDER BY end_date ASC
      LIMIT 10
    ` as Record<string, any>[]

    return NextResponse.json({
      success: true,
      stats: {
        overview: statsResult[0],
        typeDistribution,
        vendorDistribution,
        monthlyTrend,
        upcomingRenewals,
      },
    })
  } catch (error) {
    console.error("Error fetching contract statistics:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch contract statistics",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
});
