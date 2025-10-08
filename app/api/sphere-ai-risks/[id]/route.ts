import { type NextRequest, NextResponse } from "next/server"
import { withContext } from "@/lib/HttpContext"


export const GET = withContext(async({ tenantDb }, request, { params }: { params: { id: string } }) => {
  try {
    const result = await tenantDb`
      SELECT * FROM sphere_ai_risks WHERE id = ${params.id}
    ` as Record<string, any>[]

    if (result.length === 0) {
      return NextResponse.json({ error: "Risk not found" }, { status: 404 })
    }

    return NextResponse.json(result[0])
  } catch (error) {
    console.error("Error fetching sphere AI risk:", error)
    return NextResponse.json({ error: "Failed to fetch risk" }, { status: 500 })
  }
});

export const PUT = withContext(async({ tenantDb }, request, { params }: { params: { id: string } }) => {
  try {
    const body = await request.json()

    const {
      title,
      description,
      category,
      likelihood,
      impact,
      riskOwner,
      businessUnit,
      assets,
      threatSources,
      vulnerabilities,
      existingControls,
      aiRiskScore,
      aiRiskLevel,
      aiConfidence,
      aiRecommendations,
      aiSimilarRisks,
      aiPredictedTrends,
      status,
    } = body

    const result = await tenantDb`
      UPDATE sphere_ai_risks SET
        title = ${title},
        description = ${description},
        category = ${category},
        likelihood = ${likelihood},
        impact = ${impact},
        risk_owner = ${riskOwner},
        business_unit = ${businessUnit},
        assets = ${JSON.stringify(assets)},
        threat_sources = ${JSON.stringify(threatSources)},
        vulnerabilities = ${JSON.stringify(vulnerabilities)},
        existing_controls = ${JSON.stringify(existingControls)},
        ai_risk_score = ${aiRiskScore},
        ai_risk_level = ${aiRiskLevel},
        ai_confidence = ${aiConfidence},
        ai_recommendations = ${JSON.stringify(aiRecommendations)},
        ai_similar_risks = ${JSON.stringify(aiSimilarRisks)},
        ai_predicted_trends = ${JSON.stringify(aiPredictedTrends)},
        status = ${status},
        updated_at = NOW()
      WHERE id = ${params.id}
      RETURNING *
    ` as Record<string, any>[]

    if (result.length === 0) {
      return NextResponse.json({ error: "Risk not found" }, { status: 404 })
    }

    return NextResponse.json(result[0])
  } catch (error) {
    console.error("Error updating sphere AI risk:", error)
    return NextResponse.json({ error: "Failed to update risk" }, { status: 500 })
  }
});

export const DELETE = withContext(async({ tenantDb }, request, { params }: { params: { id: string } }) => {
  try {
    const result = await tenantDb`
      DELETE FROM sphere_ai_risks WHERE id = ${params.id}
      RETURNING id
    ` as Record<string, any>[]

    if (result.length === 0) {
      return NextResponse.json({ error: "Risk not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "Risk deleted successfully" })
  } catch (error) {
    console.error("Error deleting sphere AI risk:", error)
    return NextResponse.json({ error: "Failed to delete risk" }, { status: 500 })
  }
});
