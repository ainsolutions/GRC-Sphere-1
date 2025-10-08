"use server"

import { HttpSessionContext } from "@/lib/HttpContext"
import { AuditLogger, AUDIT_ACTIONS, ENTITY_TYPES } from "@/lib/audit-logger"

interface Threat {
  id?: string
  threat_id: string
  name: string
  description: string
  category: string
  source: string
  threat_level: string
  status: string
  indicators_of_compromise: string[]
  mitigation_strategies: string[]
  threat_references: string[]
  associated_risks?: Array<{
    id: string
    title: string
    description: string
    category: string
    source: string
    risk_level?: string
    status?: string
    table: string
    uniqueId: string
  }>
  threat_analysis?: string
  impact_analysis?: string
  risk_analysis?: string
}

// ------------------ Helpers ------------------
function requireDb(ctx: HttpSessionContext) {
  if (!ctx?.tenantDb) {
    throw new Error("No tenantDb on context. Make sure the API route is wrapped with withContext and pass ctx.")
  }
  return ctx.tenantDb
}

// ------------------ CRUD ---------------------

export async function getThreats(searchTerm?: string) {
  try {
    const params = new URLSearchParams();
    if (searchTerm) params.set("q", searchTerm);

    const res = await fetch(`/api/threats?${params.toString()}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    if (!res.ok) {
      return { success: false, error: `HTTP error ${res.status}`, data: [] };
    }

    const data = await res.json();
    return data; // already { success, data }
  } catch (error: any) {
    console.error("❌ Failed to fetch threats:", error);
    return { success: false, error: error.message, data: [] };
  }
}

export async function getThreatById(ctx: HttpSessionContext, id: string) {
  const tenantDb = requireDb(ctx)
  try {
    const threat = await tenantDb`
      SELECT * FROM threats WHERE id = ${id}
    `
    if (threat.length === 0) return { success: false, error: "Threat not found", data: null }

    await AuditLogger.log({
      userId: "system",
      userEmail: "system@company.com",
      action: AUDIT_ACTIONS.READ,
      entityType: ENTITY_TYPES.THREAT,
      entityId: id,
    })

    return { success: true, data: threat[0] }
  } catch (error) {
    console.error("Failed to get threat:", error)
    return { success: false, error: "Failed to get threat", data: null }
  }
}

// No "use server" here — it's a client helper
export async function createThreat(threat: any) {
  const res = await fetch("/api/risks/threats", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(threat),
  })

  return res.json()
}

export async function updateThreat(threat: any) {
  const res = await fetch("/api/risks/threats", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(threat),
  })

  return res.json()
}




export async function deleteThreat(ctx: HttpSessionContext, id: string) {
  const tenantDb = requireDb(ctx)
  try {
    const threat = await tenantDb`SELECT * FROM threats WHERE id = ${id}`
    if (threat.length === 0) return { success: false, error: "Threat not found" }

    const refs = await tenantDb`
      SELECT COUNT(*) as count FROM threat_assessments WHERE threat_id = ${id}
    `
    if (refs[0]?.count > 0) {
      return { success: false, error: "Cannot delete threat as it is referenced in threat assessments" }
    }

    await tenantDb`DELETE FROM threats WHERE id = ${id}`

    await AuditLogger.log({
      userId: "system",
      userEmail: "system@company.com",
      action: AUDIT_ACTIONS.DELETE,
      entityType: ENTITY_TYPES.THREAT,
      entityId: id,
      oldValues: threat[0],
    })

    return { success: true, message: `Threat "${threat[0].name}" deleted successfully` }
  } catch (error) {
    console.error("Failed to delete threat:", error)
    return { success: false, error: "Failed to delete threat" }
  }
}

export async function searchThreats(ctx: HttpSessionContext, searchTerm: string, limit = 10) {
  const tenantDb = requireDb(ctx)
  try {
    if (searchTerm.length < 2) return { success: true, data: [] }

    const threats = await tenantDb`
      SELECT *
      FROM threats
      WHERE
        (name ILIKE ${'%' + searchTerm + '%'}
        OR description ILIKE ${'%' + searchTerm + '%'}
        OR category ILIKE ${'%' + searchTerm + '%'}
        OR source ILIKE ${'%' + searchTerm + '%'}
        OR threat_id ILIKE ${'%' + searchTerm + '%'})
        AND status != 'Inactive'
      ORDER BY
        CASE
          WHEN name ILIKE ${searchTerm + '%'} THEN 1
          WHEN name ILIKE ${'%' + searchTerm + '%'} THEN 2
          WHEN description ILIKE ${searchTerm + '%'} THEN 3
          ELSE 4
        END,
        name ASC
      LIMIT ${limit}
    `
    return { success: true, data: threats || [] }
  } catch (error) {
    console.error("Failed to search threats:", error)
    return { success: false, error: "Failed to search threats", data: [] }
  }
}
