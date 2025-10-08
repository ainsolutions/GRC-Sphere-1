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

    const res = await fetch(`/api/assessment?${params.toString()}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    })

    if (!res.ok) {
      return { success: false, error: "Failed to fetch assessments", data: [] }
    }

    const json = await res.json()
    return {
      success: true,
      data: json.assessments,
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
export async function createAssessment(assessmentData: any) {
  const res = await fetch("/api/assessment", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(assessmentData),
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
export async function updateAssessment(id: string, assessmentData: any) {
  const res = await fetch(`/api/assessment/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(assessmentData),
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
  const res = await fetch(`/api/assessment/${id}`, { method: "DELETE" })

  if (!res.ok) {
    return { success: false, error: "Failed to delete assessment" }
  }

  return { success: true }
}

/**
 * Fetch a single assessment by its id.
 */
export async function getAssessmentById(id: string) {
  const res = await fetch(`/api/assessment/${id}`, {
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
 * Only include if you plan to use /api/assessment/import route.
 */
export async function importAssessments(fileData: FormData) {
  const res = await fetch("/api/assessment/import", {
    method: "POST",
    body: fileData,
  })

  if (!res.ok) {
    return { success: false, error: "Failed to import assessments" }
  }

  return { success: true }
}
