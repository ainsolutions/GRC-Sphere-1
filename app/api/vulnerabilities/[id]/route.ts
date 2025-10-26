import { NextResponse } from "next/server";
import { withContext } from "@/lib/HttpContext";

//getVulnerabilityById
export const GET = withContext(async ({ tenantDb }, request) => {
  const id = request.url.split("/").pop();
  const result = await tenantDb`SELECT * FROM vulnerabilities WHERE id = ${id}` as Record<string, any>[];
  if (result.length === 0) return NextResponse.json({ success: false, error: "Vulnerability not found" }, { status: 404 });
  return NextResponse.json({ success: true, data: result[0] });
});

// updateVulnerability
export const PUT = withContext(async ({ tenantDb }, request) => {
  const id = request.url.split("/").pop();
  const vulnerabilityData = await request.json();

  let tatDays = vulnerabilityData.tat_days;
  if (!tatDays) {
    switch (vulnerabilityData.severity) {
      case "Critical": tatDays = 7; break;
      case "High": tatDays = 14; break;
      case "Medium": tatDays = 30; break;
      case "Low": tatDays = 60; break;
      case "Informational": tatDays = 90; break;
      default: tatDays = 30;
    }
  }

  let completedDate = vulnerabilityData.remediation_completed_date;
  if (vulnerabilityData.remediation_status === "Resolved" && !completedDate) {
    completedDate = new Date().toISOString();
  } else if (vulnerabilityData.remediation_status !== "Resolved") {
    completedDate = null;
  }

  const result = await tenantDb`
    UPDATE vulnerabilities SET
      name = ${vulnerabilityData.name},
      description = ${vulnerabilityData.description || ""},
      category = ${vulnerabilityData.category || null},
      severity = ${vulnerabilityData.severity},
      cvss_score = ${vulnerabilityData.cvss_score || null},
      cve_id = ${vulnerabilityData.cve_id || null},
      affected_systems = ${JSON.stringify(vulnerabilityData.affected_systems || []) },
      assets = ${JSON.stringify(vulnerabilityData.assets || [])},
      remediation_status = ${vulnerabilityData.remediation_status || "Open"},
      remediation_notes = ${vulnerabilityData.remediation_notes || ""},
      assigned_to = ${vulnerabilityData.assigned_to || null},
      remediation_department = ${vulnerabilityData.remediation_department || null},
      remediation_departmental_unit = ${vulnerabilityData.remediation_departmental_unit || null},
      priority = ${vulnerabilityData.priority || 3},
      tat_days = ${tatDays},
      remediation_completed_date = ${completedDate},
      tags = ${JSON.stringify(vulnerabilityData.tags || [])},
      external_references = ${JSON.stringify(vulnerabilityData.external_references || [])},
      updated_at = NOW()
    WHERE id = ${id}
    RETURNING *
  ` as Record<string, any>[]
  if (result.length === 0) return NextResponse.json({ success: false, error: "Vulnerability not found" }, { status: 404 });
  return NextResponse.json({ success: true, data: result[0] });
});

// deleteVulnerability
export const DELETE = withContext(async ({ tenantDb }, request) => {
  const id = request.url.split("/").pop();
  const result = await tenantDb`DELETE FROM vulnerabilities WHERE id = ${id} RETURNING *` as Record<string, any>[];
  if (result.length === 0) return NextResponse.json({ success: false, error: "Vulnerability not found" }, { status: 404 });
  return NextResponse.json({ success: true, data: result[0] });
});
