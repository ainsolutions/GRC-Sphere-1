import { NextResponse } from "next/server"
import { withContext } from "@/lib/HttpContext"


export const GET = withContext( async ({ tenantDb }) => {
  try {
    // Get risk trends over time
    const riskTrends = (await tenantDb`
      SELECT 
        DATE_TRUNC('month', created_at) as month,
        risk_level,
        COUNT(*) as count
      FROM risks 
      WHERE created_at >= NOW() - INTERVAL '12 months'
      GROUP BY DATE_TRUNC('month', created_at), risk_level
      ORDER BY month
    `) as Record<string,any>[];

    // Get assessment completion rates
    const assessmentCompletion = (await tenantDb`
      SELECT 
        DATE_TRUNC('month', created_at) as month,
        status,
        COUNT(*) as count
      FROM cybersecurity_assessments 
      WHERE created_at >= NOW() - INTERVAL '12 months'
      GROUP BY DATE_TRUNC('month', created_at), status
      ORDER BY month
    `) as Record<string,any>[];

    // Get findings trends
    const findingsTrends = (await tenantDb`
      SELECT 
        DATE_TRUNC('month', created_at) as month,
        severity,
        COUNT(*) as count
      FROM assessment_findings 
      WHERE created_at >= NOW() - INTERVAL '12 months'
      GROUP BY DATE_TRUNC('month', created_at), severity
      ORDER BY month
    `) as Record<string,any>[];

    // Get threat landscape
    const threatLandscape = (await tenantDb`
      SELECT 
        category,
        threat_level,
        COUNT(*) as count
      FROM threats 
      GROUP BY category, threat_level
    `) as Record<string,any>[];

    // Get control effectiveness
    const controlEffectiveness = (await tenantDb`
      SELECT 
        control_type,
        implementation_status,
        COUNT(*) as count
      FROM iso27002_controls 
      GROUP BY control_type, implementation_status
    `) as Record<string,any>[];

    const analyticsData = {
      riskTrends: riskTrends.map((trend) => ({
        month: trend.month,
        riskLevel: trend.risk_level,
        count: Number.parseInt(trend.count),
      })),
      assessmentCompletion: assessmentCompletion.map((assessment) => ({
        month: assessment.month,
        status: assessment.status,
        count: Number.parseInt(assessment.count),
      })),
      findingsTrends: findingsTrends.map((finding) => ({
        month: finding.month,
        severity: finding.severity,
        count: Number.parseInt(finding.count),
      })),
      threatLandscape: threatLandscape.map((threat) => ({
        category: threat.category,
        threatLevel: threat.threat_level,
        count: Number.parseInt(threat.count),
      })),
      controlEffectiveness: controlEffectiveness.map((control) => ({
        controlType: control.control_type,
        implementationStatus: control.implementation_status,
        count: Number.parseInt(control.count),
      })),
    }

    return NextResponse.json(analyticsData)
  } catch (error) {
    console.error("Analytics API error:", error)

    // Return fallback data
    const fallbackData = {
      riskTrends: [],
      assessmentCompletion: [],
      findingsTrends: [],
      threatLandscape: [],
      controlEffectiveness: [],
    }

    return NextResponse.json(fallbackData)
  }
});