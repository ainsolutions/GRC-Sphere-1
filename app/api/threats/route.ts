import { NextResponse } from "next/server"
import { withContext } from "@/lib/HttpContext"
import { AUDIT_ACTIONS, AuditLogger, ENTITY_TYPES } from "@/lib/audit-logger"

export const GET = withContext(async ({ tenantDb }, request) => {
  try {
    const { searchParams } = new URL(request.url);
    const searchTerm = searchParams.get("q");
    const limit = parseInt(searchParams.get("limit") || "10");

    // Search threats
    if (searchTerm) {
      if (searchTerm.length < 2) {
        return NextResponse.json({ success: true, data: [] });
      }

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
      `;
      return NextResponse.json({ success: true, data: threats || [] });
    }

    const threats = await tenantDb`
      SELECT
        id, threat_id, name, description, category, source,
        threat_level, status, indicators_of_compromise,
        mitigation_strategies, threat_references, associated_risks,
        threat_analysis, impact_analysis, risk_analysis,
        created_at, updated_at
      FROM threats
      ORDER BY created_at DESC
    `

    return NextResponse.json({
      success: true,
      data: threats
    })
  } catch (error) {
    console.error("Threats API error:", error)
    return NextResponse.json(
      { success: false, error: "Failed to fetch threats" },
      { status: 500 }
    )
  }
})

// ✅ POST → Create threat (formerly your createThreat function)
export const POST = withContext(async ({ tenantDb }, request) => {
  try {
    const threat = await request.json()

    if (!threat.name) {
      return NextResponse.json({ success: false, error: "Threat name is required" }, { status: 400 })
    }

    // --- Auto-generate threat ID if missing ---
    let threatId = threat.threat_id
    if (!threatId) {
      const yearSuffix = new Date().getFullYear().toString().slice(-2)
      const [{ max_id }] = await tenantDb`
        SELECT MAX(CAST(SUBSTRING(threat_id FROM 5) AS INTEGER)) as max_id
        FROM threats
        WHERE threat_id LIKE ${`THR-${yearSuffix}%`}
      ` as Record<string, any>[]
      const next = (max_id || 0) + 1
      threatId = `THR-${yearSuffix}${next.toString().padStart(5, "0")}`
    }

    // --- Insert threat record ---
    const [result] = await tenantDb`
      INSERT INTO threats (
        threat_id, name, description, category, source, threat_level, status,
        indicators_of_compromise, mitigation_strategies, threat_references,
        associated_risks, threat_analysis, impact_analysis, risk_analysis
      )
      VALUES (
        ${threatId}, ${threat.name}, ${threat.description || ""}, ${threat.category || ""},
        ${threat.source || ""}, ${threat.threat_level || ""}, ${threat.status || ""},
        ${JSON.stringify(threat.indicators_of_compromise || [])},
        ${JSON.stringify(threat.mitigation_strategies || [])},
        ${JSON.stringify(threat.threat_references || [])},
        ${JSON.stringify(threat.associated_risks || [])},
        ${threat.threat_analysis || ""}, ${threat.impact_analysis || ""}, ${threat.risk_analysis || ""}
      )
      RETURNING id, threat_id, name
    ` as Record<string, any>[]



    return NextResponse.json({
      success: true,
      data: result,
      message: `Threat "${result.name}" created successfully`,
    })
  } catch (error: any) {
    console.error("❌ Failed to create threat:", error)
    const msg = error.message?.includes("duplicate key")
      ? "Threat ID already exists"
      : "Failed to create threat"
    return NextResponse.json({ success: false, error: msg }, { status: 500 })
  }
})

// ✅ PUT → Update threat (optional for later)
export const PUT = withContext(async ({ tenantDb }, request) => {
  try {
    const threat = await request.json();

    if (!threat.id) {
      return NextResponse.json({ success: false, error: "Missing threat ID" }, { status: 400 });
    }

    const result = await tenantDb`
      UPDATE threats SET
        name = ${threat.name},
        description = ${threat.description},
        category = ${threat.category},
        source = ${threat.source},
        threat_level = ${threat.threat_level},
        status = ${threat.status},
        indicators_of_compromise = ${JSON.stringify(threat.indicators_of_compromise || [])},
        mitigation_strategies = ${JSON.stringify(threat.mitigation_strategies || [])},
        threat_references = ${JSON.stringify(threat.threat_references || [])},
        associated_risks = ${JSON.stringify(threat.associated_risks || [])},
        threat_analysis = ${threat.threat_analysis || null},
        impact_analysis = ${threat.impact_analysis || null},
        risk_analysis = ${threat.risk_analysis || null}
      WHERE id = ${threat.id}
      RETURNING *;
    ` as Record<string, any>[];

    return NextResponse.json({ success: true, data: result[0] });
  } catch (error) {
    console.error("Error updating threat:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
});

