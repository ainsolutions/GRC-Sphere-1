"use server"

import { neon } from "@neondatabase/serverless"

// Initialize database connection with error handling
function getDbConnection() {
  const databaseUrl = process.env.DATABASE_URL
  if (!databaseUrl) {
    console.warn("DATABASE_URL not found in environment variables")
    return null
  }
  return neon(databaseUrl)
}

// Helper function to convert string values to numeric scores
function convertToNumericScore(value: string): number {
  const scoreMap: { [key: string]: number } = {
    "very low": 1,
    low: 2,
    medium: 3,
    high: 4,
    "very high": 5,
    critical: 5,
  }
  return scoreMap[value.toLowerCase()] || 3
}

// Helper function to convert numeric scores back to string values
function convertToStringValue(score: number): string {
  const valueMap: { [key: number]: string } = {
    1: "very low",
    2: "low",
    3: "medium",
    4: "high",
    5: "very high",
  }
  return valueMap[score] || "medium"
}

export async function getThreatAssessments(searchTerm?: string, limit = 50, offset = 0) {
  try {
    const sql = getDbConnection()
    if (!sql) {
      return {
        success: false,
        error: "Database connection not configured",
        data: [],
      }
    }

    let result

    if (searchTerm) {
      result = await sql`
        SELECT 
          id,
          assessment_name,
          threat_id,
          asset_id,
          likelihood,
          impact,
          risk_level,
          mitigation_status,
          assessment_date,
          assessor,
          notes,
          created_at,
          updated_at
        FROM threat_assessments
        WHERE 
          assessment_name ILIKE ${`%${searchTerm}%`} OR
          threat_id ILIKE ${`%${searchTerm}%`} OR 
          asset_id ILIKE ${`%${searchTerm}%`} OR 
          assessor ILIKE ${`%${searchTerm}%`} OR 
          notes ILIKE ${`%${searchTerm}%`}
        ORDER BY created_at DESC 
        LIMIT ${limit} 
        OFFSET ${offset}
      `
    } else {
      result = await sql`
        SELECT 
          id,
          assessment_name,
          threat_id,
          asset_id,
          likelihood,
          impact,
          risk_level,
          mitigation_status,
          assessment_date,
          assessor,
          notes,
          created_at,
          updated_at
        FROM threat_assessments
        ORDER BY created_at DESC 
        LIMIT ${limit} 
        OFFSET ${offset}
      `
    }

    // Convert numeric scores back to string values for display
    const processedResult = result.map((row) => ({
      ...row,
      likelihood: typeof row.likelihood === "number" ? convertToStringValue(row.likelihood) : row.likelihood,
      impact: typeof row.impact === "number" ? convertToStringValue(row.impact) : row.impact,
      risk_level: typeof row.risk_level === "number" ? convertToStringValue(row.risk_level) : row.risk_level,
    }))

    return {
      success: true,
      data: processedResult,
      error: null,
    }
  } catch (error) {
    console.error("Error fetching threat assessments:", error)
    return {
      success: false,
      error: "Failed to fetch threat assessments",
      data: [],
    }
  }
}

export async function createThreatAssessment(assessmentData: any) {
  try {
    const sql = getDbConnection()
    if (!sql) {
      return {
        success: false,
        error: "Database connection not configured",
      }
    }

    // Convert string values to numeric scores for database storage
    const processedData = {
      ...assessmentData,
      likelihood:
        typeof assessmentData.likelihood === "string"
          ? convertToNumericScore(assessmentData.likelihood)
          : assessmentData.likelihood,
      impact:
        typeof assessmentData.impact === "string"
          ? convertToNumericScore(assessmentData.impact)
          : assessmentData.impact,
      risk_level:
        typeof assessmentData.risk_level === "string"
          ? convertToNumericScore(assessmentData.risk_level)
          : assessmentData.risk_level,
    }

    console.log("Creating threat assessment with processed data:", processedData)

    const result = await sql`
      INSERT INTO threat_assessments (
        assessment_name,
        threat_id,
        asset_id,
        likelihood,
        impact,
        risk_level,
        mitigation_status,
        assessment_date,
        assessor,
        notes
      ) VALUES (
        ${processedData.assessment_name},
        ${processedData.threat_id},
        ${processedData.asset_id},
        ${processedData.likelihood},
        ${processedData.impact},
        ${processedData.risk_level},
        ${processedData.mitigation_status},
        ${processedData.assessment_date},
        ${processedData.assessor},
        ${processedData.notes || ""}
      )
      RETURNING *
    `

    // Convert numeric scores back to string values for response
    const responseData = {
      ...result[0],
      likelihood: convertToStringValue(result[0].likelihood),
      impact: convertToStringValue(result[0].impact),
      risk_level: convertToStringValue(result[0].risk_level),
    }

    return {
      success: true,
      data: responseData,
      error: null,
    }
  } catch (error) {
    console.error("Error creating threat assessment:", error)
    return {
      success: false,
      error: `Failed to create threat assessment: ${error.message}`,
    }
  }
}

export async function updateThreatAssessment(id: string, assessmentData: any) {
  try {
    const sql = getDbConnection()
    if (!sql) {
      return {
        success: false,
        error: "Database connection not configured",
      }
    }

    // Convert string values to numeric scores for database storage
    const processedData = {
      ...assessmentData,
      likelihood:
        typeof assessmentData.likelihood === "string"
          ? convertToNumericScore(assessmentData.likelihood)
          : assessmentData.likelihood,
      impact:
        typeof assessmentData.impact === "string"
          ? convertToNumericScore(assessmentData.impact)
          : assessmentData.impact,
      risk_level:
        typeof assessmentData.risk_level === "string"
          ? convertToNumericScore(assessmentData.risk_level)
          : assessmentData.risk_level,
    }

    const result = await sql`
      UPDATE threat_assessments SET
        assessment_name = ${processedData.assessment_name},
        threat_id = ${processedData.threat_id},
        asset_id = ${processedData.asset_id},
        likelihood = ${processedData.likelihood},
        impact = ${processedData.impact},
        risk_level = ${processedData.risk_level},
        mitigation_status = ${processedData.mitigation_status},
        assessment_date = ${processedData.assessment_date},
        assessor = ${processedData.assessor},
        notes = ${processedData.notes || ""},
        updated_at = NOW()
      WHERE id = ${id}
      RETURNING *
    `

    if (result.length === 0) {
      return {
        success: false,
        error: "Threat assessment not found",
      }
    }

    // Convert numeric scores back to string values for response
    const responseData = {
      ...result[0],
      likelihood: convertToStringValue(result[0].likelihood),
      impact: convertToStringValue(result[0].impact),
      risk_level: convertToStringValue(result[0].risk_level),
    }

    return {
      success: true,
      data: responseData,
      error: null,
    }
  } catch (error) {
    console.error("Error updating threat assessment:", error)
    return {
      success: false,
      error: `Failed to update threat assessment: ${error.message}`,
    }
  }
}

export async function deleteThreatAssessment(id: string) {
  try {
    const sql = getDbConnection()
    if (!sql) {
      return {
        success: false,
        error: "Database connection not configured",
      }
    }

    const result = await sql`
      DELETE FROM threat_assessments 
      WHERE id = ${id}
      RETURNING *
    `

    if (result.length === 0) {
      return {
        success: false,
        error: "Threat assessment not found",
      }
    }

    return {
      success: true,
      data: result[0],
      error: null,
    }
  } catch (error) {
    console.error("Error deleting threat assessment:", error)
    return {
      success: false,
      error: `Failed to delete threat assessment: ${error.message}`,
    }
  }
}

export async function getThreatAssessmentById(id: string) {
  try {
    const sql = getDbConnection()
    if (!sql) {
      return {
        success: false,
        error: "Database connection not configured",
        data: null,
      }
    }

    const result = await sql`
      SELECT * FROM threat_assessments WHERE id = ${id}
    `

    if (result.length === 0) {
      return {
        success: false,
        error: "Threat assessment not found",
        data: null,
      }
    }

    // Convert numeric scores back to string values for response
    const responseData = {
      ...result[0],
      likelihood:
        typeof result[0].likelihood === "number" ? convertToStringValue(result[0].likelihood) : result[0].likelihood,
      impact: typeof result[0].impact === "number" ? convertToStringValue(result[0].impact) : result[0].impact,
      risk_level:
        typeof result[0].risk_level === "number" ? convertToStringValue(result[0].risk_level) : result[0].risk_level,
    }

    return {
      success: true,
      data: responseData,
      error: null,
    }
  } catch (error) {
    console.error("Error fetching threat assessment:", error)
    return {
      success: false,
      error: `Failed to fetch threat assessment: ${error.message}`,
      data: null,
    }
  }
}
