import { NextResponse } from "next/server"
import { withContext, HttpSessionContext } from "@/lib/HttpContext"

export const GET = withContext(async({ tenantDb }: HttpSessionContext) => {
  try {
    const agingAnalysis = await tenantDb`
      SELECT 
        aging_status,
        COUNT(*) as count,
        AVG(aging_days) as avg_aging_days,
        MAX(aging_days) as max_aging_days,
        MIN(aging_days) as min_aging_days
      FROM fair_risk_treatment_controls
      GROUP BY aging_status
      ORDER BY 
        CASE aging_status
          WHEN 'overdue' THEN 1
          WHEN 'due_soon' THEN 2
          WHEN 'on_track' THEN 3
          WHEN 'completed' THEN 4
        END
    `

    const overdueControls = await tenantDb`
      SELECT 
        ftc.*,
        ftp.treatment_strategy,
        fr.title as risk_title,
        fr.risk_id as risk_id
      FROM fair_risk_treatment_controls ftc
      JOIN fair_risk_treatment_plans ftp ON ftc.treatment_plan_id = ftp.id
      JOIN fair_risks fr ON ftp.fair_risk_id = fr.id
      WHERE ftc.aging_status = 'overdue'
      ORDER BY ftc.aging_days DESC
      LIMIT 20
    `

    const dueSoonControls = await tenantDb`
      SELECT 
        ftc.*,
        ftp.treatment_strategy,
        fr.title as risk_title,
        fr.risk_id as risk_id
      FROM fair_risk_treatment_controls ftc
      JOIN fair_risk_treatment_plans ftp ON ftc.treatment_plan_id = ftp.id
      JOIN fair_risks fr ON ftp.fair_risk_id = fr.id
      WHERE ftc.aging_status = 'due_soon'
      ORDER BY ftc.due_date ASC
      LIMIT 20
    `

    return NextResponse.json({
      aging_analysis: agingAnalysis,
      overdue_controls: overdueControls,
      due_soon_controls: dueSoonControls,
    })
  } catch (error) {
    console.error("Error fetching aging analysis:", error)
    return NextResponse.json({ error: "Failed to fetch aging analysis" }, { status: 500 })
  }
});
