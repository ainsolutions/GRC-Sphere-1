// lib/actions/incident-actions.ts
"use server";

import { HttpSessionContext } from "@/lib/HttpContext";
import { AuditLogger, AUDIT_ACTIONS } from "@/lib/audit-logger";

/**
 * Small helper to guarantee we always use the tenant-scoped DB.
 * If you see this error, wrap your API route with withContext and
 * pass the ctx into these action functions.
 */
function requireTenantDb(ctx?: HttpSessionContext) {
  if (!ctx?.tenantDb) {
    throw new Error(
      "No tenantDb on context. Make sure the API route is wrapped with withContext and pass ctx into incident-actions."
    );
  }
  return ctx.tenantDb;
}

// Types — adjust to your table columns if they differ
export interface Incident {
  id: number;
  title: string;
  description?: string;
  severity?: string;
  status?: string;
  occurred_at?: string; // ISO string
  detected_at?: string; // ISO string
  related_asset_id?: number | null;
  related_risk_id?: number | null;
  created_at?: string;
  updated_at?: string;
}

export interface CreateIncidentPayload {
  title: string;
  description?: string;
  severity?: string;
  status?: string;
  occurred_at?: string;
  detected_at?: string;
  related_asset_id?: number | null;
  related_risk_id?: number | null;
}

export interface UpdateIncidentPayload extends Partial<CreateIncidentPayload> {}

/* ============================================================================
   READ
   ========================================================================== */

/**
 * List incidents (optionally filtered)
 * Frontend can keep calling getIncidents() — but now your API route must pass ctx.
 * Example route:
 *   export const GET = withContext(async (ctx) => {
 *     const rows = await getIncidents(ctx);
 *     return NextResponse.json({ success: true, data: rows });
 *   });
 */
export async function getIncidents(
  ctx?: HttpSessionContext,
  opts?: { limit?: number; offset?: number; status?: string }
): Promise<{ success: true; data: Incident[] } | { success: false; error: string }> {
  try {
    const db = requireTenantDb(ctx);

    const limit = opts?.limit ?? 100;
    const offset = opts?.offset ?? 0;

    if (opts?.status) {
      const rows = await db<Incident[]>`
        SELECT i.*, ia.asset_name, r.title as risk_title
        FROM incidents i
        LEFT JOIN information_assets ia ON i.related_asset_id = ia.id
        LEFT JOIN iso27001_risks r ON i.related_risk_id = r.id
        WHERE i.status = ${opts.status}
        ORDER BY i.created_at DESC
        LIMIT ${limit} OFFSET ${offset}
      `;
      return { success: true, data: rows as Incident[] };
    }

    const rows = await db<Incident[]>`
      SELECT i.*, ia.asset_name, r.title as risk_title
      FROM incidents i
      LEFT JOIN information_assets ia ON i.related_asset_id = ia.id
      LEFT JOIN iso27001_risks r ON i.related_risk_id = r.id
      ORDER BY i.created_at DESC
      LIMIT ${limit} OFFSET ${offset}
    `;
    return { success: true, data: rows as Incident[] };
  } catch (err) {
    console.error("Failed to get incidents:", err);
    return { success: false, error: "Failed to get incidents" };
  }
}

export async function getIncidentById(
  id: number,
  ctx?: HttpSessionContext
): Promise<{ success: true; data: Incident } | { success: false; error: string }> {
  try {
    const db = requireTenantDb(ctx);
    const rows = await db<Incident[]>`
      SELECT i.*, ia.asset_name, r.title as risk_title
      FROM incidents i
      LEFT JOIN information_assets ia ON i.related_asset_id = ia.id
      LEFT JOIN iso27001_risks r ON i.related_risk_id = r.id
      WHERE i.id = ${id}
      LIMIT 1
    `;
    if (!rows.length) return { success: false, error: "Incident not found" };
    return { success: true, data: rows[0] as Incident };
  } catch (err) {
    console.error("Failed to get incident:", err);
    return { success: false, error: "Failed to get incident" };
  }
}

/* ============================================================================
   CREATE / UPDATE / DELETE
   ========================================================================== */

export async function createIncident(payload: any) {
  try {
    const baseUrl =
      typeof window === "undefined"
        ? process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"
        : window.location.origin;

    // ✅ Ensure correct API route
    const response = await fetch(`${baseUrl}/api/incidents`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    // Guard against HTML responses
    const contentType = response.headers.get("content-type") || "";
    if (!contentType.includes("application/json")) {
      const text = await response.text();
      throw new Error(`Expected JSON, got HTML. Maybe hitting /incidents instead of /api/incidents: ${text.slice(0, 80)}`);
    }

    const result = await response.json();
    if (!response.ok) {
      return { success: false, error: result.error || "Failed to create incident" };
    }

    return { success: true, data: result.data };
  } catch (err: any) {
    console.error("createIncident error:", err);
    return { success: false, error: err.message };
  }
}

export async function updateIncident(
  id: number,
  payload: UpdateIncidentPayload,
  ctx?: HttpSessionContext
): Promise<{ success: true; data: Incident } | { success: false; error: string }> {
  try {
    const db = requireTenantDb(ctx);

    // Build dynamic SET list
    const fields: string[] = [];
    const values: any[] = [];
    let i = 1;

    const set = (key: string, val: any) => {
      fields.push(`${key} = $${i++}`);
      values.push(val);
    };

    if (payload.title !== undefined) set("title", payload.title);
    if (payload.description !== undefined) set("description", payload.description);
    if (payload.severity !== undefined) set("severity", payload.severity);
    if (payload.status !== undefined) set("status", payload.status);
    if (payload.occurred_at !== undefined) set("occurred_at", payload.occurred_at);
    if (payload.detected_at !== undefined) set("detected_at", payload.detected_at);
    if (payload.related_asset_id !== undefined) set("related_asset_id", payload.related_asset_id);
    if (payload.related_risk_id !== undefined) set("related_risk_id", payload.related_risk_id);

    if (!fields.length) {
      return { success: false, error: "No fields to update" };
    }

    values.push(id); // WHERE id = $i

    const query = `
      UPDATE incidents
      SET ${fields.join(", ")}, updated_at = CURRENT_TIMESTAMP
      WHERE id = $${i}
      RETURNING *
    `;
    const rows = await db.query(query, values);
    if (!rows.length) return { success: false, error: "Incident not found" };

    const updated = rows[0] as Incident;

    // Audit (best effort)
    try {
      await AuditLogger.log({
        userId: ctx?.sessionData?.userId ?? "system",
        userEmail: ctx?.sessionData?.userEmail ?? "system@grc.local",
        action: AUDIT_ACTIONS.UPDATE,
        entityType: "INCIDENT",
        entityId: String(id),
        newValues: payload,
        sessionId: ctx?.sessionData?.sessionId,
      });
    } catch (e) {
      console.warn("Audit log (updateIncident) failed:", e);
    }

    return { success: true, data: updated };
  } catch (err) {
    console.error("Failed to update incident:", err);
    return { success: false, error: "Failed to update incident" };
  }
}

export async function deleteIncident(
  id: number,
  ctx?: HttpSessionContext
): Promise<{ success: true } | { success: false; error: string }> {
  try {
    const db = requireTenantDb(ctx);

    const resp = await db`
      DELETE FROM incidents WHERE id = ${id}
      RETURNING id
    `;
    if (!resp.length) return { success: false, error: "Incident not found" };

    // Audit (best effort)
    try {
      await AuditLogger.log({
        userId: ctx?.sessionData?.userId ?? "system",
        userEmail: ctx?.sessionData?.userEmail ?? "system@grc.local",
        action: AUDIT_ACTIONS.DELETE,
        entityType: "INCIDENT",
        entityId: String(id),
        sessionId: ctx?.sessionData?.sessionId,
      });
    } catch (e) {
      console.warn("Audit log (deleteIncident) failed:", e);
    }

    return { success: true };
  } catch (err) {
    console.error("Failed to delete incident:", err);
    return { success: false, error: "Failed to delete incident" };
  }
}

// actions/asset-actions.ts
export async function searchAssets(searchTerm: string) {
  const res = await fetch(`/api/assets/lookup?q=${encodeURIComponent(searchTerm)}`)
  const json = await res.json()
  return json
}

// actions/risk-actions.ts
export async function searchRisks(searchTerm: string) {
  const res = await fetch(`/api/risks/lookup?q=${encodeURIComponent(searchTerm)}`)
  const json = await res.json()
  return json
}


export async function createIncidentFromChatbot(form: FormData, ctx: HttpSessionContext) {
  // call your createIncident logic, passing ctx.tenantDb as needed
  return createIncident(form, ctx)
}

