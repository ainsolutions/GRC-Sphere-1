"use server"

import { getDatabase } from "@/lib/database"
import { revalidatePath } from "next/cache"

const sql = getDatabase()

export interface RiskImportData {
  risk_title: string
  risk_description: string
  category_name?: string
  asset_name?: string
  threat_source: string
  vulnerability: string
  likelihood_score: number
  impact_score: number
  risk_owner: string
  risk_status: string
  identified_date: string
  next_review_date: string
  existing_controls?: string
  risk_treatment?: string
  risk_treatment_plan?: string
  review_frequency?: string
  control_effectiveness?: string
  business_impact?: string
  regulatory_impact?: string
  financial_impact_min?: number
  financial_impact_max?: number
  treatment_cost?: number
  treatment_timeline?: string
  risk_tolerance?: string
}

export async function importRisksFromCSV(csvData: RiskImportData[]) {
  try {
    const results = []
    const errors = []

    for (let i = 0; i < csvData.length; i++) {
      const row = csvData[i]
      try {
        // Validate required fields
        if (!row.risk_title || !row.risk_description || !row.likelihood_score || !row.impact_score) {
          errors.push(
            `Row ${i + 1}: Missing required fields (risk_title, risk_description, likelihood_score, impact_score)`,
          )
          continue
        }

        // Get category ID if category name is provided
        let category_id = null
        if (row.category_name) {
          const categoryResult = await sql`
            SELECT id FROM risk_categories WHERE category_name = ${row.category_name}
          `
          if (categoryResult.length > 0) {
            category_id = categoryResult[0].id
          } else {
            // Create new category if it doesn't exist
            const newCategory = await sql`
              INSERT INTO risk_categories (category_name, category_description)
              VALUES (${row.category_name}, ${`Imported category: ${row.category_name}`})
              RETURNING id
            `
            category_id = newCategory[0].id
          }
        }

        // Get asset ID if asset name is provided
        let asset_id = null
        if (row.asset_name) {
          const assetResult = await sql`
            SELECT id FROM information_assets WHERE asset_name = ${row.asset_name}
          `
          if (assetResult.length > 0) {
            asset_id = assetResult[0].id
          }
        }

        const inherent_risk_score = row.likelihood_score * row.impact_score

        const result = await sql`
          INSERT INTO risks (
            risk_title, risk_description, category_id, asset_id,
            threat_source, vulnerability, likelihood_score, impact_score,
            inherent_risk_score, risk_owner, risk_status, identified_date,
            next_review_date, existing_controls, risk_treatment,
            risk_treatment_plan, review_frequency, control_effectiveness,
            business_impact, regulatory_impact, financial_impact_min,
            financial_impact_max, treatment_cost, treatment_timeline,
            risk_tolerance
          ) VALUES (
            ${row.risk_title}, ${row.risk_description}, ${category_id}, ${asset_id},
            ${row.threat_source || ""}, ${row.vulnerability || ""}, ${row.likelihood_score}, ${row.impact_score},
            ${inherent_risk_score}, ${row.risk_owner || "Unassigned"}, ${row.risk_status || "Open"},
            ${row.identified_date || new Date().toISOString().split("T")[0]}, ${row.next_review_date || new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]},
            ${row.existing_controls || ""}, ${row.risk_treatment || "Mitigate"},
            ${row.risk_treatment_plan || ""}, ${row.review_frequency || "Quarterly"},
            ${row.control_effectiveness || "Not Assessed"}, ${row.business_impact || ""},
            ${row.regulatory_impact || ""}, ${row.financial_impact_min || null},
            ${row.financial_impact_max || null}, ${row.treatment_cost || null},
            ${row.treatment_timeline || ""}, ${row.risk_tolerance || "Low"}
          ) RETURNING *
        `

        results.push(result[0])
      } catch (error) {
        console.error(`Error importing row ${i + 1}:`, error)
        errors.push(`Row ${i + 1}: ${error instanceof Error ? error.message : "Unknown error"}`)
      }
    }

    revalidatePath("/risks")
    return {
      success: true,
      imported: results.length,
      errors: errors,
      data: results,
    }
  } catch (error) {
    console.error("Failed to import risks:", error)
    return {
      success: false,
      error: "Failed to import risks",
      imported: 0,
      errors: [],
    }
  }
}

export async function exportRisksToCSV(filters?: {
  searchTerm?: string
  categoryFilter?: string
  statusFilter?: string
}) {
  try {
    let risks

    // Build query based on filters
    if (filters?.searchTerm && filters?.categoryFilter && filters?.statusFilter) {
      risks = await sql`
        SELECT r.*, rc.category_name, ia.asset_name, ic.control_code, ic.control_title
        FROM risks r
        LEFT JOIN risk_categories rc ON r.category_id = rc.id
        LEFT JOIN information_assets ia ON r.asset_id = ia.id
        LEFT JOIN iso27002_controls ic ON r.iso27002_control_id = ic.id
        WHERE (r.risk_title ILIKE ${`%${filters.searchTerm}%`} OR r.risk_description ILIKE ${`%${filters.searchTerm}%`})
        AND rc.category_name = ${filters.categoryFilter}
        AND r.risk_status = ${filters.statusFilter}
        ORDER BY r.inherent_risk_score DESC, r.created_at DESC
      `
    } else if (filters?.searchTerm) {
      risks = await sql`
        SELECT r.*, rc.category_name, ia.asset_name, ic.control_code, ic.control_title
        FROM risks r
        LEFT JOIN risk_categories rc ON r.category_id = rc.id
        LEFT JOIN information_assets ia ON r.asset_id = ia.id
        LEFT JOIN iso27002_controls ic ON r.iso27002_control_id = ic.id
        WHERE (r.risk_title ILIKE ${`%${filters.searchTerm}%`} OR r.risk_description ILIKE ${`%${filters.searchTerm}%`})
        ORDER BY r.inherent_risk_score DESC, r.created_at DESC
      `
    } else if (filters?.categoryFilter) {
      risks = await sql`
        SELECT r.*, rc.category_name, ia.asset_name, ic.control_code, ic.control_title
        FROM risks r
        LEFT JOIN risk_categories rc ON r.category_id = rc.id
        LEFT JOIN information_assets ia ON r.asset_id = ia.id
        LEFT JOIN iso27002_controls ic ON r.iso27002_control_id = ic.id
        WHERE rc.category_name = ${filters.categoryFilter}
        ORDER BY r.inherent_risk_score DESC, r.created_at DESC
      `
    } else if (filters?.statusFilter) {
      risks = await sql`
        SELECT r.*, rc.category_name, ia.asset_name, ic.control_code, ic.control_title
        FROM risks r
        LEFT JOIN risk_categories rc ON r.category_id = rc.id
        LEFT JOIN information_assets ia ON r.asset_id = ia.id
        LEFT JOIN iso27002_controls ic ON r.iso27002_control_id = ic.id
        WHERE r.risk_status = ${filters.statusFilter}
        ORDER BY r.inherent_risk_score DESC, r.created_at DESC
      `
    } else {
      risks = await sql`
        SELECT r.*, rc.category_name, ia.asset_name, ic.control_code, ic.control_title
        FROM risks r
        LEFT JOIN risk_categories rc ON r.category_id = rc.id
        LEFT JOIN information_assets ia ON r.asset_id = ia.id
        LEFT JOIN iso27002_controls ic ON r.iso27002_control_id = ic.id
        ORDER BY r.inherent_risk_score DESC, r.created_at DESC
      `
    }

    return { success: true, data: risks }
  } catch (error) {
    console.error("Failed to export risks:", error)
    return { success: false, error: "Failed to export risks", data: [] }
  }
}

export async function getRiskExportTemplate() {
  try {
    // Return template with sample data and all possible columns
    const template = [
      {
        risk_title: "Sample Risk Title",
        risk_description: "Detailed description of the risk scenario",
        category_name: "Information Security",
        asset_name: "Customer Database",
        threat_source: "External Hackers",
        vulnerability: "Weak authentication",
        likelihood_score: 3,
        impact_score: 4,
        risk_owner: "CISO",
        risk_status: "Open",
        identified_date: "2024-01-15",
        next_review_date: "2024-04-15",
        existing_controls: "Multi-factor authentication, access logging",
        risk_treatment: "Mitigate",
        risk_treatment_plan: "Implement additional security controls",
        review_frequency: "Quarterly",
        control_effectiveness: "Effective",
        business_impact: "Service disruption, customer data exposure",
        regulatory_impact: "GDPR compliance violation",
        financial_impact_min: 10000,
        financial_impact_max: 100000,
        treatment_cost: 25000,
        treatment_timeline: "3 months",
        risk_tolerance: "Low",
      },
    ]

    return { success: true, data: template }
  } catch (error) {
    console.error("Failed to get export template:", error)
    return { success: false, error: "Failed to get export template", data: [] }
  }
}
