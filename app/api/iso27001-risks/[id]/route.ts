import { type NextRequest, NextResponse } from "next/server"
import { withContext } from "@/lib/HttpContext"
import { deleteISO27001Risk } from "@/lib/actions/iso27001-actions";


export const GET = withContext(async({ tenantDb }, request, context: { params: { id: string } }) => {
  try {
    const id = context.params;

    if (!id || isNaN(Number(id))) {
      return NextResponse.json({ error: "Invalid risk ID" }, { status: 400 })
    }

    const result = await tenantDb`
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
      WHERE id = ${Number(id)}
    ` as Record<string, any>[]

    if (result.length === 0) {
      return NextResponse.json({ error: "Risk not found" }, { status: 404 })
    }

    return NextResponse.json(result[0])
  } catch (error: any) {
    console.error("Error fetching risk:", error)
    return NextResponse.json({ error: "Failed to fetch risk", details: error.message }, { status: 500 })
  }
});

export const PUT = withContext(async({ tenantDb }, request,context: { params: Promise<{ id: string }> }) => {
  try {
    const { id } = await context.params;
    const body = await request.json()

    if (!id || isNaN(Number(id))) {
      return NextResponse.json({ error: "Invalid risk ID" }, { status: 400 })
    }

    const {
      title,
      description,
      category,
      likelihood,
      impact,
      status,
      owner,
      treatment_plan,
      residual_likelihood,
      residual_impact,
      next_review,
      controls,
      assets,
      control_assessment,
      risk_treatment,
    } = body

    // Calculate residual risk if both likelihood and impact are provided
    let residual_risk
    if (residual_likelihood !== undefined && residual_impact !== undefined) {
      residual_risk = residual_likelihood * residual_impact
    }

    // Build the update query - exclude generated columns (risk_score, risk_level)
    let nextReviewValue: string | null = null;
if (body.next_review && body.next_review.trim() !== "") {
  // ensure it's a valid date string
  nextReviewValue = body.next_review;
}

// then in SQL: give Postgres a typed parameter (date or null)
const result = await tenantDb`
  UPDATE iso27001_risks
  SET
    title = COALESCE(${title}, title),
    description = COALESCE(${description}, description),
    category = COALESCE(${category}, category),
    likelihood = COALESCE(${likelihood}, likelihood),
    impact = COALESCE(${impact}, impact),
    status = COALESCE(${status}, status),
    owner = COALESCE(${owner}, owner),
    treatment_plan = COALESCE(${treatment_plan}, treatment_plan),
    residual_likelihood = COALESCE(${residual_likelihood}, residual_likelihood),
    residual_impact = COALESCE(${residual_impact}, residual_impact),
    residual_risk = COALESCE(${residual_risk}, residual_risk),
    next_review = COALESCE(${ nextReviewValue }::date, next_review),
    controls = COALESCE(${controls}, controls),
    assets = COALESCE(${assets}, assets),
    control_assessment = COALESCE(${control_assessment}, control_assessment),
    risk_treatment = COALESCE(${risk_treatment}, risk_treatment),
    updated_at = CURRENT_TIMESTAMP
  WHERE id = ${Number(id)}
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
` as Record<string, any>[];

    if (result.length === 0) {
      return NextResponse.json({ error: "Risk not found" }, { status: 404 })
    }

    return NextResponse.json(result[0])
  } catch (error: any) {
    console.error("Error updating risk:", error)
    return NextResponse.json({ error: "Failed to update risk", details: error.message }, { status: 500 })
  }
});


export const DELETE = withContext(async ({ tenantDb }, req, context: { params: { id: string } }) => {
  try {
  const { id } = await context.params; 

  await tenantDb`DELETE FROM iso27001_risks WHERE id = ${id}`;
  return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting ISO 27001 risk:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete ISO 27001 risk" },
      { status: 500 }
    );
  }
});
