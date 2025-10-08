import { type NextRequest, NextResponse } from "next/server"
import { HttpSessionContext, withContext } from "@/lib/HttpContext"
import { getISO27001Risks } from "@/lib/actions/iso27001-actions"




export const GET = withContext(async (ctx: HttpSessionContext) => {
  try {
    const risks = await getISO27001Risks(ctx);
    return NextResponse.json({ success: true, data: risks });
  } catch (err) {
    console.error("Error fetching ISO27001 risks:", err);
    return NextResponse.json(
      { success: false, error: (err as Error).message },
      { status: 500 }
    );
  }
});

export const POST = withContext(async({ tenantDb }, request) => {
  try {
    const body = await request.json()
    const {
      title,
      description,
      category,
      likelihood = 1,
      impact = 1,
      status = "Open",
      owner,
      treatment_plan,
      residual_likelihood = 1,
      residual_impact = 1,
      next_review,
      controls = [],
      assets = [],
      control_assessment,
      risk_treatment,
    } = body

    if (!title || !description || !category || !owner) {
      return NextResponse.json(
        {
          error: "Missing required fields: title, description, category, owner",
        },
        { status: 400 },
      )
    }

    // Generate risk ID
    const riskIdResult = await tenantDb`
      SELECT COALESCE(MAX(CAST(SUBSTRING(risk_id FROM 'ISO-(.*)') AS INTEGER)), 0) + 1 as next_id
      FROM iso27001_risks 
      WHERE risk_id ~ '^ISO-[0-9]+$'
    ` as Record<string, number>[]
    const nextId = riskIdResult[0]?.next_id || 1
    const risk_id = `ISO-${String(nextId).padStart(4, "0")}`

    const residual_risk = residual_likelihood * residual_impact
    const nextReview = body.next_review && body.next_review.trim() !== "" ? body.next_review : null;

    const result = await tenantDb`
      INSERT INTO iso27001_risks (
        risk_id, title, description, category, likelihood, impact, 
        status, owner, treatment_plan, residual_likelihood, residual_impact, 
        residual_risk, next_review, controls, assets, control_assessment, risk_treatment
      ) VALUES (
        ${risk_id}, ${title}, ${description}, ${category}, ${likelihood}, ${impact},
        ${status}, ${owner}, ${treatment_plan}, ${residual_likelihood}, ${residual_impact},
        ${residual_risk}, ${nextReview}, ${controls}, ${assets}, ${control_assessment}, ${risk_treatment}
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
    ` as Record<string, any>[]

    return NextResponse.json(result[0], { status: 201 })
  } catch (error: any) {
    console.error("Error creating risk:", error)
    return NextResponse.json({ error: "Failed to create risk", details: error.message }, { status: 500 })
  }
});
