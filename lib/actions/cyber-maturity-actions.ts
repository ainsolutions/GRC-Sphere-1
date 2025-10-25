"use server";

/**
 * Generic fetch helper for client-side API calls
 * – Keeps business logic identical, just stronger typing & error messages.
 */
async function apiFetch<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(url, options);
  if (!res.ok) {
    let message = res.statusText;
    try {
      const err = await res.json();
      if (err?.error) message = err.error;
    } catch {
      /* ignore JSON parse error and fall back to statusText */
    }
    throw new Error(message);
  }
  return (await res.json()) as T;
}

/* -------------------- Cyber Maturity Assessments -------------------- */

export async function listAssessments() {
  return apiFetch<{ success: boolean; data: any[] }>("/api/cyber-maturity");
}

export async function createAssessment(payload: {
  assessment_name: string;
  description?: string;
  assessment_date: string;
  assessor_name: string;
  department?: string;
  status?: string;
}) {
  return apiFetch("/api/cyber-maturity", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}

export async function getAssessment(id: number) {
  return apiFetch(`/api/cyber-maturity/${id}`);
}

export async function updateAssessment(
  id: number,
  payload: Partial<{
    assessment_name: string;
    description: string;
    assessment_date: string;
    assessor_name: string;
    department: string;
    status: string;
  }>
) {
  return apiFetch(`/api/cyber-maturity/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}

export async function deleteAssessment(id: number) {
  return apiFetch(`/api/cyber-maturity/${id}`, { method: "DELETE" });
}

/* -------------------- CRI Controls -------------------- */

export async function listCRIControls() {
  return apiFetch("/api/cyber-maturity/cri-controls");
}

export async function createCRIControl(payload: any) {
  return apiFetch("/api/cyber-maturity/cri-controls", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}

export async function getCRIControl(id: number) {
  return apiFetch(`/api/cyber-maturity/cri-controls/${id}`);
}

export async function updateCRIControl(id: number, payload: any) {
  return apiFetch(`/api/cyber-maturity/cri-controls/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}

export async function deleteCRIControl(id: number) {
  return apiFetch(`/api/cyber-maturity/cri-controls/${id}`, { method: "DELETE" });
}

/* -------------------- Maturity Assessments -------------------- */

export async function listMaturityAssessments(assessmentId?: number) {
  const q = assessmentId ? `?assessmentId=${assessmentId}` : "";
  return apiFetch(`/api/cyber-maturity/maturity-assessments${q}`);
}

export async function createMaturityAssessment(payload: any) {
  return apiFetch("/api/cyber-maturity/maturity-assessments", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}

export async function getMaturityAssessment(id: number) {
  return apiFetch(`/api/cyber-maturity/maturity-assessments/${id}`);
}

export async function updateMaturityAssessment(id: number, payload: any) {
  return apiFetch(`/api/cyber-maturity/maturity-assessments/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}

export async function deleteMaturityAssessment(id: number) {
  return apiFetch(`/api/cyber-maturity/maturity-assessments/${id}`, {
    method: "DELETE",
  });
}

/* -------------------- Gaps Analysis -------------------- */

export async function listGapsAnalysis(assessmentId?: number) {
  const q = assessmentId ? `?assessmentId=${assessmentId}` : "";
  return apiFetch(`/api/cyber-maturity/gaps-analysis${q}`);
}

export async function createGapAnalysis(payload: {
  assessment_id: number
  control_id: number
  gap_description: string
  severity: string
  priority: string
  estimated_effort: string
  recommended_actions: string
}) {
  return apiFetch("/api/cyber-maturity/gaps-analysis", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}

export async function getGapAnalysis(id: number) {
  return apiFetch(`/api/cyber-maturity/gaps-analysis/${id}`);
}

export async function updateGapAnalysis(id: number, payload: any) {
  return apiFetch(`/api/cyber-maturity/gaps-analysis/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}

export async function deleteGapAnalysis(id: number) {
  return apiFetch(`/api/cyber-maturity/gaps-analysis/${id}`, { method: "DELETE" });
}

/* -------------------- Remediation Tracking -------------------- */

export async function listRemediationTracking(gapId?: number) {
  const q = gapId ? `?gapId=${gapId}` : "";
  return apiFetch(`/api/cyber-maturity/remediation-tracking${q}`);
}

export async function createRemediationTracking(payload: any) {
  return apiFetch("/api/cyber-maturity/remediation-tracking", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}

export async function getRemediationTracking(id: number) {
  return apiFetch(`/api/cyber-maturity/remediation-tracking/${id}`);
}

export async function updateRemediationTracking(id: number, payload: any) {
  return apiFetch(`/api/cyber-maturity/remediation-tracking/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}

export async function deleteRemediationTracking(id: number) {
  return apiFetch(`/api/cyber-maturity/remediation-tracking/${id}`, {
    method: "DELETE",
  });
}

/* -------------------- Seed CRI Controls -------------------- */

export async function seedCRIControls() {
  return apiFetch("/api/cyber-maturity/seed-controls", { method: "POST" });
}
