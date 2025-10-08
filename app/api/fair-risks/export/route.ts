import { type NextRequest, NextResponse } from "next/server"
import { withContext, HttpSessionContext } from "@/lib/HttpContext"

export const GET= withContext(async({ tenantDb }, request) => {
  try {
    const { searchParams } = new URL(request.url)
    const format = searchParams.get("format") || "csv"
    const template = searchParams.get("template") === "true"
    const treatment_status = searchParams.get("treatment_status") || "all"

    if (template) {
      // Return template data
      const templateData = [
        {
          risk_title: "Sample Data Breach Risk",
          risk_description: "Risk of data breach through phishing attack",
          asset_id: "Customer Database",
          threat_actor: "External Hackers",
          threat_capability: 7,
          threat_motivation: 8,
          control_strength: 6,
          vulnerability_score: 7,
          loss_event_frequency_min: 0.5,
          loss_event_frequency_most_likely: 1.2,
          loss_event_frequency_max: 3.0,
          primary_loss_min: 50000,
          primary_loss_most_likely: 150000,
          primary_loss_max: 500000,
          secondary_loss_min: 25000,
          secondary_loss_most_likely: 75000,
          secondary_loss_max: 200000,
          annual_loss_expectancy: 270000,
          risk_tolerance: 100000,
          treatment_plan: "Implement additional security controls and training",
          treatment_status: "identified",
          treatment_due_date: "2024-06-30",
        },
      ]

      return NextResponse.json({
        success: true,
        data: templateData,
        message: "Template data generated successfully",
      })
    }

      // --- Fetch risks ---
      const rawRisks = await tenantDb`
        SELECT
          fr.*,
          ia.asset_name
        FROM fair_risks fr
        LEFT JOIN information_assets ia
          ON fr.asset_id = ia.id::text
        WHERE ${
          treatment_status && treatment_status !== "all"
            ? tenantDb`fr.treatment_status = ${treatment_status}`
            : tenantDb`true`
        }
      `


      // --- Guard & assert type ---
      if (!Array.isArray(rawRisks)) {
        return NextResponse.json(
          { success: false, error: "Unexpected DB result", data: [], count: 0 },
          { status: 500 }
        );
      }

      const risks = rawRisks as Record<string, any>[];
    

    // Transform data for export
    const exportData = risks.map((risk: any) => ({
      risk_id: risk.risk_id,
      risk_title: risk.risk_title,
      risk_description: risk.risk_description || "",
      asset_name: risk.asset_name || "",
      threat_actor: risk.threat_actor || "",
      threat_capability: risk.threat_capability || "",
      threat_motivation: risk.threat_motivation || "",
      control_strength: risk.control_strength || "",
      vulnerability_score: risk.vulnerability_score || "",
      loss_event_frequency_min: risk.loss_event_frequency_min || "",
      loss_event_frequency_most_likely: risk.loss_event_frequency_most_likely || "",
      loss_event_frequency_max: risk.loss_event_frequency_max || "",
      primary_loss_min: risk.primary_loss_min || "",
      primary_loss_most_likely: risk.primary_loss_most_likely || "",
      primary_loss_max: risk.primary_loss_max || "",
      secondary_loss_min: risk.secondary_loss_min || "",
      secondary_loss_most_likely: risk.secondary_loss_most_likely || "",
      secondary_loss_max: risk.secondary_loss_max || "",
      annual_loss_expectancy: risk.annual_loss_expectancy || "",
      risk_tolerance: risk.risk_tolerance || "",
      treatment_plan: risk.treatment_plan || "",
      treatment_status: risk.treatment_status || "",
      treatment_due_date: risk.treatment_due_date ? new Date(risk.treatment_due_date).toISOString().split("T")[0] : "",
      created_at: risk.created_at ? new Date(risk.created_at).toISOString() : "",
      updated_at: risk.updated_at ? new Date(risk.updated_at).toISOString() : "",
    }))

    return NextResponse.json({
      success: true,
      data: exportData,
      count: exportData.length,
      message: `Successfully exported ${exportData.length} FAIR risks`,
    })
  } catch (error) {
    console.error("Failed to export FAIR risks:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to export FAIR risks",
        data: [],
        count: 0,
      },
      { status: 500 },
    )
  }
});
