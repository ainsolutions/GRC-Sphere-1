// NO "use client"
import { HttpSessionContext } from "@/lib/HttpContext";

export async function getCyberMaturityAssessments(tenantDb: HttpSessionContext["tenantDb"]) {
  // Example query
  return await tenantDb`SELECT * FROM cyber_maturity_assessments ORDER BY created_at DESC`;
}

export async function getMaturityAssessments(tenantDb: HttpSessionContext["tenantDb"], assessmentId?: number) {
  if (assessmentId) {
    return await tenantDb`SELECT * FROM maturity_assessments WHERE assessment_id = ${assessmentId}`;
  }
  return await tenantDb`SELECT * FROM maturity_assessments`;
}

export async function getGapsAnalysis(tenantDb: HttpSessionContext["tenantDb"], assessmentId?: number) {
  if (assessmentId) {
    return await tenantDb`SELECT * FROM gaps_analysis WHERE assessment_id = ${assessmentId}`;
  }
  return await tenantDb`SELECT * FROM gaps_analysis`;
}

export async function createRemediationTracking(
  tenantDb: HttpSessionContext["tenantDb"],
  data: {
    gap_id: number;
    remediation_plan: string;
    assigned_to: string;
    due_date: string;
    status?: string;
    notes?: string;
  }
) {
  const rows = (await tenantDb`
    INSERT INTO remediation_tracking
      (gap_id, remediation_plan, assigned_to, due_date, status, notes)
    VALUES
      (${data.gap_id}, ${data.remediation_plan}, ${data.assigned_to},
       ${data.due_date}, ${data.status ?? "not_started"}, ${data.notes ?? ""})
    RETURNING *;
  `) as Record<string, any>[]; // Explicitly assert rows as an array of records
  return rows[0];
}

export async function updateRemediationTracking(
  tenantDb: HttpSessionContext["tenantDb"],
  id: number,
  data: {
    remediation_plan?: string;
    assigned_to?: string;
    due_date?: string;
    status?: string;
    actual_completion_date?: string;
    notes?: string;
  }
) {
  const rows = (await tenantDb`
    UPDATE remediation_tracking
    SET
      remediation_plan = ${data.remediation_plan},
      assigned_to = ${data.assigned_to},
      due_date = ${data.due_date},
      status = ${data.status},
      actual_completion_date = ${data.actual_completion_date},
      notes = ${data.notes}
    WHERE id = ${id}
    RETURNING *;
  `) as Record<string, any>[];
  return rows[0];
}

// list all remediation_tracking records
export async function getRemediationTracking(
  tenantDb: HttpSessionContext["tenantDb"],
  gapId?: number
) {
  if (gapId) {
    return await tenantDb`
      SELECT * FROM remediation_tracking WHERE gap_id = ${gapId}
    `;
  }
  return await tenantDb`SELECT * FROM remediation_tracking`;
}


type CRIControl = {
  id: number;
  control_id: string;
  control_name: string;
  domain: string;
  control_objective: string;
  maturity_level_1?: string;
  maturity_level_2?: string;
  maturity_level_3?: string;
  maturity_level_4?: string;
  maturity_level_5?: string;
};

export async function listCRIControls(
  tenantDb: HttpSessionContext["tenantDb"]
): Promise<CRIControl[]> {
  const rows = (await tenantDb`SELECT * FROM cri_controls ORDER BY id`) as Record<string, any>[];
  return rows.map(row => ({
    id: row.id,
    control_id: row.control_id,
    control_name: row.control_name,
    domain: row.domain,
    control_objective: row.control_objective,
    maturity_level_1: row.maturity_level_1,
    maturity_level_2: row.maturity_level_2,
    maturity_level_3: row.maturity_level_3,
    maturity_level_4: row.maturity_level_4,
    maturity_level_5: row.maturity_level_5,
  }));
}

export async function getCRIControl(
  tenantDb: HttpSessionContext["tenantDb"],
  id: number
) {
  // 👇 explicitly assert we expect an array of CRIControl rows
  const rows = (await tenantDb`
      SELECT * FROM cri_controls WHERE id = ${id}
  `) as CRIControl[];

  return rows[0] ?? null; // safely return first row or null if none
}

// Add more create/update/delete functions as needed, all using tenantDb
