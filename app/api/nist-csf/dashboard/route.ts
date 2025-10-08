import { NextResponse } from "next/server"
import { withContext } from "@/lib/HttpContext"

export const GET = withContext(async({ tenantDb }, request) => {
  try {
    // Get risk distribution by NIST CSF function
    const riskByFunction = (await tenantDb`
      SELECT 
        f.function_code,
        f.function_name,
        COUNT(t.id) as risk_count,
        COUNT(CASE WHEN t.risk_level = 'Critical' THEN 1 END) as critical_count,
        COUNT(CASE WHEN t.risk_level = 'High' THEN 1 END) as high_count,
        COUNT(CASE WHEN t.risk_level = 'Medium' THEN 1 END) as medium_count,
        COUNT(CASE WHEN t.risk_level = 'Low' THEN 1 END) as low_count
      FROM nist_csf_functions f
      LEFT JOIN nist_csf_risk_templates t ON f.id = t.function_id AND t.is_active = true
      WHERE f.is_active = true
      GROUP BY f.id, f.function_code, f.function_name
      ORDER BY f.function_code
    `) as any[]

    // Get risk level distribution
    const riskByLevel = (await tenantDb`
      SELECT 
        risk_level as level,
        COUNT(*) as count,
        ROUND(COUNT(*) * 100.0 / SUM(COUNT(*)) OVER(), 1) as percentage
      FROM nist_csf_risk_templates
      WHERE is_active = true
      GROUP BY risk_level
      ORDER BY 
        CASE risk_level
          WHEN 'Critical' THEN 1
          WHEN 'High' THEN 2
          WHEN 'Medium' THEN 3
          WHEN 'Low' THEN 4
          ELSE 5
        END
    `) as any[]

    // Get mitigation status distribution
    const mitigationStatus = (await tenantDb`
      SELECT 
        status,
        COUNT(*) as count,
        ROUND(COUNT(*) * 100.0 / SUM(COUNT(*)) OVER(), 1) as percentage
      FROM nist_csf_mitigation_plans
      GROUP BY status
      ORDER BY 
        CASE status
          WHEN 'Completed' THEN 1
          WHEN 'In Progress' THEN 2
          WHEN 'Planning' THEN 3
          WHEN 'On Hold' THEN 4
          ELSE 5
        END
    `) as any[]

    // Get investment data by function
    const investmentData = (await tenantDb`
      SELECT 
        f.function_code as function,
        f.function_name,
        COALESCE(SUM(mp.investment_amount), 0) as investment,
        COUNT(mp.id) as plan_count,
        ROUND(AVG(mp.progress_percentage), 1) as avg_progress,
        ROUND(
          CASE 
            WHEN COUNT(mp.id) > 0 THEN 
              (COUNT(CASE WHEN mp.status = 'Completed' THEN 1 END) * 100.0 / COUNT(mp.id))
            ELSE 0 
          END, 1
        ) as risk_reduction
      FROM nist_csf_functions f
      LEFT JOIN nist_csf_risk_templates t ON f.id = t.function_id
      LEFT JOIN nist_csf_mitigation_plans mp ON t.id = mp.template_id
      WHERE f.is_active = true
      GROUP BY f.id, f.function_code, f.function_name
      ORDER BY f.function_code
    `) as any[]

    // Get maturity progress by function
    const maturityProgress = (await tenantDb`
      SELECT 
        f.function_code as function,
        f.function_name,
        COUNT(t.id) as total_risks,
        COUNT(mp.id) as total_plans,
        COUNT(CASE WHEN mp.status = 'Completed' THEN 1 END) as completed_plans,
        ROUND(
          CASE 
            WHEN COUNT(t.id) > 0 THEN 
              (COUNT(mp.id) * 100.0 / COUNT(t.id))
            ELSE 0 
          END, 1
        ) as coverage_percentage,
        ROUND(
          CASE 
            WHEN COUNT(mp.id) > 0 THEN 
              (COUNT(CASE WHEN mp.status = 'Completed' THEN 1 END) * 100.0 / COUNT(mp.id))
            ELSE 0 
          END, 1
        ) as completion_rate,
        ROUND(
          CASE 
            WHEN COUNT(t.id) > 0 AND COUNT(mp.id) > 0 THEN 
              ((COUNT(mp.id) * 100.0 / COUNT(t.id)) * 0.4 + 
               (COUNT(CASE WHEN mp.status = 'Completed' THEN 1 END) * 100.0 / COUNT(mp.id)) * 0.6)
            ELSE 0 
          END, 1
        ) as score
      FROM nist_csf_functions f
      LEFT JOIN nist_csf_risk_templates t ON f.id = t.function_id AND t.is_active = true
      LEFT JOIN nist_csf_mitigation_plans mp ON t.id = mp.template_id
      WHERE f.is_active = true
      GROUP BY f.id, f.function_code, f.function_name
      ORDER BY f.function_code
    `) as any[]

    // Get threat landscape data (simulated monthly data)
    const threatLandscape = (await tenantDb`
      SELECT 
        DATE_TRUNC('month', mp.created_at) as month,
        COUNT(t.id) as threats,
        COUNT(mp.id) as mitigations,
        COUNT(CASE WHEN mp.status = 'Completed' THEN 1 END) as completed_mitigations
      FROM nist_csf_mitigation_plans mp
      LEFT JOIN nist_csf_risk_templates t ON mp.template_id = t.id
      WHERE mp.created_at >= CURRENT_DATE - INTERVAL '12 months'
      GROUP BY DATE_TRUNC('month', mp.created_at)
      ORDER BY month
    `) as any[]

    // Get overall statistics
    const totalRisks = riskByLevel.reduce((sum: number, item: any) => sum + Number(item.count), 0)
    const totalInvestment = investmentData.reduce((sum: number, item: any) => sum + Number(item.investment), 0)
    const totalPlans = mitigationStatus.reduce((sum: number, item: any) => sum + Number(item.count), 0)
    const completedPlans = mitigationStatus.find((item: any) => item.status === 'Completed')?.count || 0
    const mitigationProgress = totalPlans > 0 ? Math.round((completedPlans / totalPlans) * 100) : 0

    // Calculate framework coverage
    const frameworkCoverage = Math.round(
      maturityProgress.reduce((sum: number, item: any) => sum + Number(item.score), 0) / 
      Math.max(maturityProgress.length, 1)
    )

    // Calculate compliance metrics
    const complianceMetrics = {
      frameworkCoverage,
      riskCoverage: totalRisks > 0 ? Math.round((totalPlans / totalRisks) * 100) : 0,
      mitigationEffectiveness: mitigationProgress,
      investmentEfficiency: totalInvestment > 0 ? Math.round((completedPlans / totalInvestment) * 1000000) : 0
    }

    // Calculate advanced metrics
    const networkResilience = Math.round(85 + Math.random() * 10) // Simulated
    const dataProtection = Math.round(80 + Math.random() * 15) // Simulated
    const automationLevel = Math.round(70 + Math.random() * 20) // Simulated

    return NextResponse.json({
      riskByFunction,
      riskByLevel,
      mitigationStatus,
      investmentData,
      maturityProgress,
      threatLandscape,
      totalRisks,
      totalInvestment,
      totalPlans,
      completedPlans,
      mitigationProgress,
      complianceMetrics,
      networkResilience,
      dataProtection,
      automationLevel,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error("Error fetching NIST CSF dashboard data:", error)
    return NextResponse.json({ error: "Failed to fetch dashboard data" }, { status: 500 })
  }
})
