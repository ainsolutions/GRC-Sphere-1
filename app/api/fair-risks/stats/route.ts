import { NextResponse } from "next/server"
import { withContext, HttpSessionContext } from "@/lib/HttpContext"

export const GET = withContext(async({ tenantDb }: HttpSessionContext) => {
  try {
    // Get total risks and total ALE
    const totalStats = await tenantDb`
      SELECT 
        COUNT(*) as total_risks,
        COALESCE(SUM(annual_loss_expectancy), 0) as total_ale,
        COALESCE(AVG(control_effectiveness), 0) as avg_control_effectiveness
      FROM fair_risks
    ` as Record<string, any>[]

    // Get overdue treatments
    const overdueStats = await tenantDb`
      SELECT COUNT(*) as overdue_treatments
      FROM fair_risks 
      WHERE treatment_status = 'overdue' 
         OR (treatment_due_date < CURRENT_DATE AND treatment_status != 'completed')
    ` as Record<string, any>[]

    // Get risk distribution by level
    const riskDistribution = await tenantDb`
      SELECT 
        CASE 
          WHEN annual_loss_expectancy / NULLIF(risk_tolerance, 0) > 2 THEN 'Critical'
          WHEN annual_loss_expectancy / NULLIF(risk_tolerance, 0) > 1 THEN 'High'
          WHEN annual_loss_expectancy / NULLIF(risk_tolerance, 0) > 0.5 THEN 'Medium'
          ELSE 'Low'
        END as risk_level,
        COUNT(*) as count
      FROM fair_risks
      GROUP BY 
        CASE 
          WHEN annual_loss_expectancy / NULLIF(risk_tolerance, 0) > 2 THEN 'Critical'
          WHEN annual_loss_expectancy / NULLIF(risk_tolerance, 0) > 1 THEN 'High'
          WHEN annual_loss_expectancy / NULLIF(risk_tolerance, 0) > 0.5 THEN 'Medium'
          ELSE 'Low'
        END
    ` as Record<string, any>[]

    // Get top 5 risks by ALE
    const topRisks = await tenantDb`
      SELECT 
        risk_id,
        risk_title,
        annual_loss_expectancy,
        threat_actor
      FROM fair_risks
      ORDER BY annual_loss_expectancy DESC
      LIMIT 5
    ` as Record<string, any>[]

    // Format risk distribution
    const distribution = riskDistribution.reduce((acc: any, row: any) => {
      acc[row.risk_level] = Number.parseInt(row.count)
      return acc
    }, {})

    const stats = {
      total_risks: Number.parseInt(totalStats[0].total_risks),
      total_ale: Number.parseFloat(totalStats[0].total_ale),
      avg_control_effectiveness: Math.round(Number.parseFloat(totalStats[0].avg_control_effectiveness)),
      overdue_treatments: Number.parseInt(overdueStats[0].overdue_treatments),
      risk_distribution: distribution,
      top_risks: topRisks.map((risk: any) => ({
        risk_id: risk.risk_id,
        risk_title: risk.risk_title,
        annual_loss_expectancy: Number.parseFloat(risk.annual_loss_expectancy),
        threat_actor: risk.threat_actor,
      })),
    }

    return NextResponse.json(stats)
  } catch (error) {
    console.error("Error fetching FAIR risk stats:", error)
    return NextResponse.json({ error: "Failed to fetch FAIR risk statistics" }, { status: 500 })
  }
});
