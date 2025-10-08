import { NextResponse } from "next/server"
import { withContext } from "@/lib/HttpContext"

export const GET = withContext(async ({ tenantDb }, request ) => {
  try {
    // ✅ Extract query params
    const { searchParams } = new URL(request.url);
    const searchTerm = searchParams.get("q") || "";  // <-- define searchTerm

    // Build base query
    let whereClause = tenantDb``;
    if (searchTerm) {
      whereClause = tenantDb`WHERE risk_name ILIKE ${'%' + searchTerm + '%'}`;
    }

    // ----- total count -----
    const totalRows = await tenantDb`
      SELECT COUNT(*)::int AS count
      FROM sphere_ai_risks
      ${whereClause}
    ` as Record<string, any>[];

    // ----- fetch rows -----
    const risks = await tenantDb`
      SELECT *
      FROM sphere_ai_risks
      ${whereClause}
      ORDER BY created_at DESC
      LIMIT 50
    `;

    return NextResponse.json({
      success: true,
      total: totalRows[0].count,
      risks,
    });
  } catch (error: any) {
    console.error("❌ Error fetching sphere AI risks:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
});


export const POST = withContext(async ({ tenantDb }, request) => {
  try {
    const body = await request.json();
    const {
      title,
      description,
      category,
      ai_risk_level,
      ai_risk_score,
      ai_confidence,
      likelihood,
      impact,
      status = "Draft",
      risk_owner,
      business_unit,   // ✅ add this
    } = body;

    // Generate risk ID
    const riskIdResult = await tenantDb`
      SELECT COALESCE(MAX(CAST(SUBSTRING(risk_id FROM 5) AS INTEGER)), 0) + 1 as next_id 
      FROM sphere_ai_risks 
      WHERE risk_id LIKE 'SAR-%'
    ` as Record<string, any>[];

    const nextId = riskIdResult[0].next_id;
    const riskId = `SAR-${nextId.toString().padStart(4, "0")}`;


    const [newRisk] = await tenantDb`
      INSERT INTO sphere_ai_risks (
        risk_id, title, description, category, ai_risk_level,
        ai_risk_score, ai_confidence, likelihood, impact, status, risk_owner, business_unit
      ) VALUES (
        ${riskId}, ${title}, ${description}, ${category}, ${ai_risk_level},
        ${Number(ai_risk_score)}, ${Number(ai_confidence)},
        ${Number(likelihood)}, ${Number(impact)}, ${status}, ${risk_owner}, ${business_unit}
      )
      RETURNING *
    ` as Record<string, any>[];

    return NextResponse.json({ success: true, risk: newRisk });
  } catch (error: any) {
    console.error("❌ Error creating sphere AI risk:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to create risk" },
      { status: 500 }
    );
  }
});

