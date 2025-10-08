"use server"

import { getDatabase } from "@/lib/database"
import { revalidatePath } from "next/cache"
import { withContext, HttpSessionContext } from "@/lib/HttpContext"

const sql = getDatabase()

export interface ISO27001Risk {
  id: number
  risk_id: string
  title: string
  description: string
  category: string
  likelihood: number
  impact: number
  risk_score: number
  risk_level: "Low" | "Medium" | "High" | "Critical"
  status: "Open" | "In Progress" | "Mitigated" | "Accepted"
  owner: string | null
  treatment_plan: string | null
  residual_likelihood: number | null
  residual_impact: number | null
  residual_risk: number | null
  last_reviewed: string
  next_review: string | null
  controls: string[]
  assets: string[]
  control_assessment: string | null
  risk_treatment: string | null
  created_at: string
  updated_at: string
}

export interface ISO27001Control {
  id: number
  control_id: string
  control_name: string
  control_description: string | null
  category: string
  created_at: string
}

export interface ControlEffectiveness {
  id: number
  risk_id: number
  control_id: string
  effectiveness: number
  implementation_status: string
  created_at: string
}

export async function getISO27001Risks(ctx: HttpSessionContext): Promise<ISO27001Risk[]> {
  const { tenantDb } = ctx
  try {
    const risks = await tenantDb<ISO27001Risk[]>`
      SELECT 
        id,
        risk_id,
        title,
        description,
        category,
        likelihood,
        impact,
        risk_score,
        risk_level,
        status,
        owner,
        treatment_plan,
        residual_likelihood,
        residual_impact,
        residual_risk,
        last_reviewed::text,
        next_review::text,
        COALESCE(controls, ARRAY[]::text[]) as controls,
        COALESCE(assets, ARRAY[]::text[]) as assets,
        control_assessment,
        risk_treatment,
        created_at::text,
        updated_at::text
      FROM iso27001_risks 
      ORDER BY risk_score DESC, created_at DESC
    `
    return risks as ISO27001Risk[]
  } catch (error) {
    console.error("Error fetching ISO 27001 risks:", error)
    throw new Error("Failed to fetch ISO 27001 risks")
  }
}

export async function getISO27001RiskById(ctx: HttpSessionContext, id: number): Promise<ISO27001Risk | null> {
  const { tenantDb } = ctx
  try {
    const [risk] = await tenantDb`
      SELECT 
        id,
        risk_id,
        title,
        description,
        category,
        likelihood,
        impact,
        risk_score,
        risk_level,
        status,
        owner,
        treatment_plan,
        residual_likelihood,
        residual_impact,
        residual_risk,
        last_reviewed::text,
        next_review::text,
        COALESCE(controls, ARRAY[]::text[]) as controls,
        COALESCE(assets, ARRAY[]::text[]) as assets,
        control_assessment,
        risk_treatment,
        created_at::text,
        updated_at::text
      FROM iso27001_risks 
      WHERE id = ${id}
    ` as Record<string, any>[]
    return (risk as ISO27001Risk) || null
  } catch (error) {
    console.error("Error fetching ISO 27001 risk:", error)
    throw new Error("Failed to fetch ISO 27001 risk")
  }
}

export async function createISO27001Risk(ctx: HttpSessionContext, data: {
  title: string
  description: string
  category: string
  likelihood: number
  impact: number
  owner?: string
  treatment_plan?: string
  status?: string
  controls?: string[]
  assets?: string[]
  control_assessment?: string
  risk_treatment?: string
  residual_likelihood?: number
  residual_impact?: number
  next_review?: string
}): Promise<ISO27001Risk> {
  const { tenantDb } = ctx
  try {
    // Generate next risk ID
    const [{ count }] = await tenantDb`SELECT COUNT(*) as count FROM iso27001_risks` as Record<string, any>[]
    const riskId = `ISO-${String(Number.parseInt(count) + 1).padStart(3, "0")}`

    // Calculate residual risk if both components are provided
    const residualRisk =
      data.residual_likelihood && data.residual_impact ? data.residual_likelihood * data.residual_impact : null

    const nextReview = data.next_review || new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]

    const [risk] = await tenantDb`
      INSERT INTO iso27001_risks (
        risk_id,
        title,
        description,
        category,
        likelihood,
        impact,
        owner,
        treatment_plan,
        status,
        residual_likelihood,
        residual_impact,
        residual_risk,
        next_review,
        controls,
        assets,
        control_assessment,
        risk_treatment
      ) VALUES (
        ${riskId},
        ${data.title},
        ${data.description},
        ${data.category},
        ${data.likelihood},
        ${data.impact},
        ${data.owner || null},
        ${data.treatment_plan || null},
        ${data.status || "Open"},
        ${data.residual_likelihood || null},
        ${data.residual_impact || null},
        ${residualRisk},
        ${nextReview},
        ${data.controls || []},
        ${data.assets || []},
        ${data.control_assessment || null},
        ${data.risk_treatment || null}
      )
      RETURNING 
        id,
        risk_id,
        title,
        description,
        category,
        likelihood,
        impact,
        risk_score,
        risk_level,
        status,
        owner,
        treatment_plan,
        residual_likelihood,
        residual_impact,
        residual_risk,
        last_reviewed::text,
        next_review::text,
        COALESCE(controls, ARRAY[]::text[]) as controls,
        COALESCE(assets, ARRAY[]::text[]) as assets,
        control_assessment,
        risk_treatment,
        created_at::text,
        updated_at::text
    `

    revalidatePath("/risks/iso27001")
    return risk as ISO27001Risk
  } catch (error) {
    console.error("Error creating ISO 27001 risk:", error)
    throw new Error("Failed to create ISO 27001 risk")
  }
}

export async function updateISO27001Risk(ctx: HttpSessionContext,
  id: number,
  data: Partial<{
    title: string;
    description: string;
    category: string;
    likelihood: number;
    impact: number;
    owner: string;
    treatment_plan: string;
    status: string;
    controls: string[];
    assets: string[];
    control_assessment: string;
    risk_treatment: string;
    residual_likelihood: number;
    residual_impact: number;
    next_review: string;
  }>
): Promise<ISO27001Risk> {
  const { tenantDb } = ctx
  try {
    const updateFields: string[] = [];
    const values: any[] = [];

    // Build SET fields and values, use $1, $2, ... placeholders
    let paramIndex = 1;

    if (data.title !== undefined) {
      updateFields.push(`title = $${paramIndex++}`);
      values.push(data.title);
    }
    if (data.description !== undefined) {
      updateFields.push(`description = $${paramIndex++}`);
      values.push(data.description);
    }
    if (data.category !== undefined) {
      updateFields.push(`category = $${paramIndex++}`);
      values.push(data.category);
    }
    if (data.likelihood !== undefined) {
      updateFields.push(`likelihood = $${paramIndex++}`);
      values.push(data.likelihood);
    }
    if (data.impact !== undefined) {
      updateFields.push(`impact = $${paramIndex++}`);
      values.push(data.impact);
    }
    if (data.owner !== undefined) {
      updateFields.push(`owner = $${paramIndex++}`);
      values.push(data.owner);
    }
    if (data.treatment_plan !== undefined) {
      updateFields.push(`treatment_plan = $${paramIndex++}`);
      values.push(data.treatment_plan);
    }
    if (data.status !== undefined) {
      updateFields.push(`status = $${paramIndex++}`);
      values.push(data.status);
    }
    if (data.controls !== undefined) {
      updateFields.push(`controls = $${paramIndex++}`);
      values.push(data.controls);
    }
    if (data.assets !== undefined) {
      updateFields.push(`assets = $${paramIndex++}`);
      values.push(data.assets);
    }
    if (data.control_assessment !== undefined) {
      updateFields.push(`control_assessment = $${paramIndex++}`);
      values.push(data.control_assessment);
    }
    if (data.risk_treatment !== undefined) {
      updateFields.push(`risk_treatment = $${paramIndex++}`);
      values.push(data.risk_treatment);
    }
    if (data.residual_likelihood !== undefined) {
      updateFields.push(`residual_likelihood = $${paramIndex++}`);
      values.push(data.residual_likelihood);
    }
    if (data.residual_impact !== undefined) {
      updateFields.push(`residual_impact = $${paramIndex++}`);
      values.push(data.residual_impact);
    }
    if (data.next_review !== undefined) {
      updateFields.push(`next_review = $${paramIndex++}`);
      values.push(data.next_review);
    }

    // Add residual_risk if both likelihood & impact present
    if (data.residual_likelihood !== undefined && data.residual_impact !== undefined) {
      updateFields.push(`residual_risk = $${paramIndex++}`);
      values.push(data.residual_likelihood * data.residual_impact);
    }

    if (updateFields.length === 0) {
      throw new Error("No fields to update");
    }

    // Add id for WHERE clause
    values.push(id);

    const query = `
      UPDATE iso27001_risks
      SET ${updateFields.join(", ")}, updated_at = CURRENT_TIMESTAMP
      WHERE id = $${paramIndex}
      RETURNING
        id,
        risk_id,
        title,
        description,
        category,
        likelihood,
        impact,
        risk_score,
        risk_level,
        status,
        owner,
        treatment_plan,
        residual_likelihood,
        residual_impact,
        residual_risk,
        last_reviewed::text,
        next_review::text,
        COALESCE(controls, ARRAY[]::text[]) as controls,
        COALESCE(assets, ARRAY[]::text[]) as assets,
        control_assessment,
        risk_treatment,
        created_at::text,
        updated_at::text
    `;

    const risks = await tenantDb.query(query, values);
    if (risks.length === 0) {
      throw new Error(`Risk with id ${id} not found`);
    }
    
    return risks[0] as ISO27001Risk;
  } catch (error) {
    console.error("Error updating ISO 27001 risk:", error);
    throw new Error("Failed to update ISO 27001 risk");
  }
}

export async function deleteISO27001Risk(ctx: HttpSessionContext, id: number) {
  const { tenantDb } = ctx;
  if (!tenantDb) {
    throw new Error("No tenantDb in context");
  }

  try {
    await tenantDb`DELETE FROM iso27001_risks WHERE id = ${id}`;
    revalidatePath("/risks/iso27001");
  } catch (error) {
    console.error("Error deleting ISO 27001 risk:", error);
    throw new Error("Failed to delete ISO 27001 risk");
  }
  }

export async function getISO27001Controls(ctx: HttpSessionContext): Promise<ISO27001Control[]> {
  const { tenantDb } = ctx
  try {
    const controls = await tenantDb<ISO27001Control[]>`
      SELECT 
        id,
        control_id,
        control_name,
        control_description,
        category,
        created_at::text
      FROM iso27001_controls 
      ORDER BY control_id
    `
    return controls as ISO27001Control[]
  } catch (error) {
    console.error("Error fetching ISO 27001 controls:", error)
    throw new Error("Failed to fetch ISO 27001 controls")
  }
}

export async function getControlEffectiveness(ctx: HttpSessionContext, riskId: number): Promise<ControlEffectiveness[]> {
  const { tenantDb } = ctx
  try {
    const effectiveness = await tenantDb`
      SELECT 
        rc.id,
        rc.risk_id,
        rc.control_id as control_id,
        rc.effectiveness,
        rc.implementation_status,
        rc.created_at::text
      FROM iso27001_risk_controls rc
      JOIN iso27001_controls c ON rc.control_id = c.id
      WHERE rc.risk_id = ${riskId}
      ORDER BY c.control_id
    `
    return effectiveness as ControlEffectiveness[]
  } catch (error) {
    console.error("Error fetching control effectiveness:", error)
    throw new Error("Failed to fetch control effectiveness")
  }
}

export async function updateControlEffectiveness(
  riskId: number,
  controlId: string,
  effectiveness: number,
  implementationStatus = "Implemented",
  tenantDb: HttpSessionContext["tenantDb"]
): Promise<void> {
  try {
    // First get the control's database ID
    const [control] = await tenantDb`
      SELECT id FROM iso27001_controls WHERE control_id = ${controlId}
    ` as Record<string, any>[]

    if (!control) {
      throw new Error(`Control ${controlId} not found`)
    }

    // Upsert the effectiveness rating
    await tenantDb`
      INSERT INTO iso27001_risk_controls (risk_id, control_id, effectiveness, implementation_status)
      VALUES (${riskId}, ${control.id}, ${effectiveness}, ${implementationStatus})
      ON CONFLICT (risk_id, control_id) 
      DO UPDATE SET 
        effectiveness = EXCLUDED.effectiveness,
        implementation_status = EXCLUDED.implementation_status
    `

    revalidatePath("/risks/iso27001")
  } catch (error) {
    console.error("Error updating control effectiveness:", error)
    throw new Error("Failed to update control effectiveness")
  }
}

export async function getRiskStatistics(ctx: HttpSessionContext): Promise<{
  total: number
  byLevel: Record<string, number>
  byStatus: Record<string, number>
  byCategory: Record<string, number>
}> {
  const { tenantDb } = ctx
  try {
    const [totalResult] = await tenantDb`SELECT COUNT(*) as total FROM iso27001_risks` as Record<string, any>[]

    const levelStats = await tenantDb`
      SELECT risk_level, COUNT(*) as count 
      FROM iso27001_risks 
      GROUP BY risk_level
    ` as Record<string, any>[]

    const statusStats = await tenantDb`
      SELECT status, COUNT(*) as count 
      FROM iso27001_risks 
      GROUP BY status
    ` as Record<string, any>[]

    const categoryStats = await tenantDb`
      SELECT category, COUNT(*) as count 
      FROM iso27001_risks 
      GROUP BY category
      ORDER BY count DESC
    ` as Record<string, any>[]

    return {
      total: Number.parseInt(totalResult.total),
      byLevel: Object.fromEntries(levelStats.map((s) => [s.risk_level, Number.parseInt(s.count)])),
      byStatus: Object.fromEntries(statusStats.map((s) => [s.status, Number.parseInt(s.count)])),
      byCategory: Object.fromEntries(categoryStats.map((s) => [s.category, Number.parseInt(s.count)])),
    }
  } catch (error) {
    console.error("Error fetching risk statistics:", error)
    throw new Error("Failed to fetch risk statistics")
  }
}

export async function getRiskWithControlEffectiveness(ctx: HttpSessionContext, id: number): Promise<{
  risk: ISO27001Risk
  controlEffectiveness: Array<{
    controlId: string
    controlName: string
    effectiveness: number
    implementationStatus: string
  }>
} | null> {
  const { tenantDb } = ctx
  try {
    const risk = await getISO27001RiskById(ctx, id)
    if (!risk) return null

    const effectiveness = await tenantDb`
      SELECT 
        c.control_id,
        c.control_name,
        rc.effectiveness,
        rc.implementation_status
      FROM iso27001_risk_controls rc
      JOIN iso27001_controls c ON rc.control_id = c.id
      WHERE rc.risk_id = ${id}
      ORDER BY c.control_id
    ` as Record<string, any>[]

    return {
      risk,
      controlEffectiveness: effectiveness.map((e) => ({
        controlId: e.control_id,
        controlName: e.control_name,
        effectiveness: e.effectiveness,
        implementationStatus: e.implementation_status,
      })),
    }
  } catch (error) {
    console.error("Error fetching risk with control effectiveness:", error)
    throw new Error("Failed to fetch risk with control effectiveness")
  }
}





function getBaseUrl() {
  if (process.env.NEXT_PUBLIC_SITE_URL) return process.env.NEXT_PUBLIC_SITE_URL;
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return "http://localhost:3000"; // dev fallback
}

export async function exportISO27001Risks(params: {
  format?: "csv" | "template";
  search?: string;
  riskLevel?: string;
}) {
  const query = new URLSearchParams({
    format: params.format ?? "csv",
    search: params.search ?? "",
  });
  if (params.riskLevel && params.riskLevel !== "all") {
    query.append("riskLevel", params.riskLevel);
  }

  const res = await fetch(`${getBaseUrl()}/api/iso27001-risks/export?${query}`);
  if (!res.ok) throw new Error("Failed to export ISO27001 risks");

  // ✅ read raw text, not JSON
  const csvText = await res.text();
  return csvText;
}

// ----------- Import -----------
export async function importISO27001Risks(csvData: any[]) {
  const res = await fetch("/api/iso27001-risks/import", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ csvData }),
  });
  if (!res.ok) throw new Error("Failed to import ISO27001 risks");
  return res.json();
}