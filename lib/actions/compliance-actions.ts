"use client"

/**
 * Fetch all HIPAA (or other compliance) requirements.
 */
export async function getComplianceRequirements() {
  try {
    const res = await fetch("/api/compliance/requirement", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    })

    if (!res.ok) {
      return {
        success: false,
        error: "Failed to fetch compliance requirements",
        data: [],
      }
    }

    const json = await res.json()
    return {
      success: true,
      data: json, // API already returns the list of requirements
    }
  } catch (error) {
    console.error("Failed to fetch compliance requirements:", error)
    return {
      success: false,
      error: "Failed to fetch compliance requirements",
      data: [],
    }
  }
}

/**
 * Fetch all compliance frameworks (if you have an API endpoint for it).
 * Adjust the URL if your endpoint is different.
 */
export async function getComplianceFrameworks() {
  try {
    const res = await fetch("/api/compliance/frameworks", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    })

    if (!res.ok) {
      return {
        success: false,
        error: "Failed to fetch compliance frameworks",
        data: [],
      }
    }

    const json = await res.json()
    return { success: true, data: json }
  } catch (error) {
    console.error("Failed to fetch compliance frameworks:", error)
    return {
      success: false,
      error: "Failed to fetch compliance frameworks",
      data: [],
    }
  }
}

/**
 * Create or update an asset–compliance mapping.
 * Make sure you have a POST endpoint such as /api/compliance/mapping.
 * Adjust the URL if your API route is named differently.
 */
export async function createAssetComplianceMapping(mappingData: {
  assetId: number
  requirementId: number
  status: string
  evidence?: string
}) {
  try {
    const res = await fetch("/api/compliance/mapping", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(mappingData),
    })

    if (!res.ok) {
      return {
        success: false,
        error: "Failed to create asset compliance mapping",
      }
    }

    const json = await res.json()
    return { success: true, data: json }
  } catch (error) {
    console.error("Failed to create asset compliance mapping:", error)
    return {
      success: false,
      error: "Failed to create asset compliance mapping",
    }
  }
}
