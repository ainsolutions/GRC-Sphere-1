"use client"

/**
 * Fetch a paginated list of assessments.
 */
export async function getAssessments(
  searchTerm?: string,
  limit = 50,
  offset = 0
) {
  try {
    const params = new URLSearchParams({
      limit: limit.toString(),
      offset: offset.toString(),
    })
    if (searchTerm) params.append("search", searchTerm)

    const res = await fetch(`/api/assessments?${params.toString()}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    })

    if (!res.ok) {
      return { success: false, error: "Failed to fetch assessments", data: [] }
    }

    const json = await res.json()
    return {
      success: true,
      data: json,
      pagination: json.pagination,
    }
  } catch (error) {
    console.error("Error fetching assessments:", error)
    return { success: false, error: "Failed to fetch assessments", data: [] }
  }
}

/**
 * Create a new assessment.
 */
export async function createAssessment(formData: FormData) {
  // Convert FormData to object
  const data: any = {}
  formData.forEach((value, key) => {
    if (key === 'assets') {
      try {
        data[key] = JSON.parse(value as string)
      } catch {
        data[key] = []
      }
    } else {
      data[key] = value
    }
  })

  const res = await fetch("/api/assessments", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })

  if (!res.ok) {
    return { success: false, error: "Failed to create assessment", data: [] }
  }

  const json = await res.json()
  return { success: true, data: json.assessment }
}

/**
 * Update an existing assessment.
 */
export async function updateAssessment(id: string, formData: FormData) {
  // Convert FormData to object
  const data: any = {}
  formData.forEach((value, key) => {
    if (key === 'assets') {
      try {
        data[key] = JSON.parse(value as string)
      } catch {
        data[key] = []
      }
    } else {
      data[key] = value
    }
  })

  const res = await fetch(`/api/assessments/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })

  if (!res.ok) {
    return { success: false, error: "Failed to update assessment", data: [] }
  }

  const json = await res.json()
  return { success: true, data: json.assessment }
}

/**
 * Delete an assessment.
 */
export async function deleteAssessment(id: string) {
  const res = await fetch(`/api/assessments/${id}`, { method: "DELETE" })

  if (!res.ok) {
    return { success: false, error: "Failed to delete assessment" }
  }

  return { success: true }
}

/**
 * Fetch a single assessment by its id.
 */
export async function getAssessmentById(id: string) {
  const res = await fetch(`/api/assessments/${id}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  })

  if (!res.ok) {
    return { success: false, error: "Failed to fetch assessment", data: null }
  }

  const json = await res.json()
  return { success: true, data: json.assessment }
}

/**
 * (Optional) Bulk import assessments.
 * Only include if you plan to use /api/assessments/import route.
 */
export async function importAssessments(fileData: FormData) {
  const res = await fetch("/api/assessments/import", {
    method: "POST",
    body: fileData,
  })

  if (!res.ok) {
    return { success: false, error: "Failed to import assessments" }
  }

  return { success: true }
}

/**
 * Get assessment types for dropdown
 */
export async function getAssessmentTypes() {
  return [
    { value: "Internal Audit", label: "Internal Audit" },
    { value: "External Audit", label: "External Audit" },
    { value: "Risk Assessment", label: "Risk Assessment" },
    { value: "Compliance Review", label: "Compliance Review" },
    { value: "Security Assessment", label: "Security Assessment" },
    { value: "Vendor Assessment", label: "Vendor Assessment" },
    { value: "Penetration Test", label: "Penetration Test" },
    { value: "Vulnerability Assessment", label: "Vulnerability Assessment" },
    { value: "Gap Analysis", label: "Gap Analysis" },
    { value: "Control Assessment", label: "Control Assessment" },
  ]
}

/**
 * Get assessment methodologies for dropdown
 */
export async function getMethodologies() {
  return [
    { value: "Document Review", label: "Document Review" },
    { value: "Interviews", label: "Interviews" },
    { value: "Technical Testing", label: "Technical Testing" },
    { value: "Walkthrough", label: "Walkthrough" },
    { value: "Observation", label: "Observation" },
    { value: "Sampling", label: "Sampling" },
    { value: "Automated Scanning", label: "Automated Scanning" },
    { value: "Manual Testing", label: "Manual Testing" },
    { value: "Hybrid Approach", label: "Hybrid Approach" },
  ]
}
