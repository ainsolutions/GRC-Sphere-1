import { type NextRequest, NextResponse } from "next/server"
import { withContext } from "@/lib/HttpContext"


export const GET = withContext(async({ tenantDb }, request, { params }: { params: { id: string } }) => {
  try {
    const id = params.id
    console.log("Fetching technology risk with ID:", id)

    const result = await tenantDb`
      SELECT 
        tr.id,
        tr.risk_id,
        tr.title,
        tr.description,
        tr.technology_category,
        tr.technology_type,
        tr.asset_ids,
        tr.risk_category,
        tr.likelihood,
        tr.impact,
        tr.current_controls,
        tr.recommended_controls,
        tr.owner,
        tr.status,
        tr.due_date,
        tr.residual_likelihood,
        tr.residual_impact,
        tr.control_assessment,
        tr.risk_treatment,
        tr.treatment_state,
        tr.treatment_end_date,
        tr.action_owner,
        tr.created_at,
        tr.updated_at,
        (tr.likelihood * tr.impact) as risk_score,
        (tr.residual_likelihood * tr.residual_impact) as residual_risk,
        CASE 
          WHEN (tr.likelihood * tr.impact) >= 15 THEN 'High'
          WHEN (tr.likelihood * tr.impact) >= 8 THEN 'Medium'
          ELSE 'Low'
        END as risk_level,
        -- Get related assets information
        COALESCE(
          (
            SELECT json_agg(
              json_build_object(
                'id', a.id,
                'asset_id', a.asset_id,
                'asset_name', a.asset_name,
                'asset_type', a.asset_type,
                'classification', a.classification,
                'owner', a.owner
              )
            )
            FROM assets a 
            WHERE tr.asset_ids IS NOT NULL 
            AND tr.asset_ids != ''
            AND a.id::text = ANY(string_to_array(tr.asset_ids, ','))
          ),
          '[]'::json
        ) as related_assets
      FROM technology_risks tr
      WHERE tr.id = ${id}
    ` as Record<string, any>[]

    if (result.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Technology risk not found",
        },
        { status: 404 },
      )
    }

    console.log("Found technology risk:", result[0])

    return NextResponse.json({
      success: true,
      data: result[0],
    })
  } catch (error) {
    console.error("Error fetching technology risk:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch technology risk",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
});

export const PUT = withContext(async({ tenantDb }, request, { params }: { params: { id: string } }) => {
  try {
    const id = params.id
    const body = await request.json()
    console.log("Updating technology risk with ID:", id, "Data:", JSON.stringify(body, null, 2))

    // Validate required fields
    if (!body.title || !body.description || !body.technology_category || !body.owner) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing required fields: title, description, technology_category, owner",
        },
        { status: 400 },
      )
    }

    // Handle asset_ids - convert array to comma-separated string
    let assetIds = null
    if (body.asset_ids && Array.isArray(body.asset_ids) && body.asset_ids.length > 0) {
      const validAssetIds: string[] = body.asset_ids
        .filter((id: string | null) => id && id !== "none" && id !== "")
        .map((id: string) => id.toString())

      if (validAssetIds.length > 0) {
        assetIds = validAssetIds.join(",")
      }
    }

    // Calculate risk scores
    const likelihood = Number(body.likelihood) || 1
    const impact = Number(body.impact) || 1
    const residualLikelihood = Number(body.residual_likelihood) || likelihood
    const residualImpact = Number(body.residual_impact) || impact

    const result = await tenantDb`
      UPDATE technology_risks SET
        risk_id = ${body.risk_id},
        title = ${body.title},
        description = ${body.description},
        technology_category = ${body.technology_category},
        technology_type = ${body.technology_type || "Server"},
        asset_ids = ${assetIds},
        risk_category = ${body.risk_category || "Technology"},
        likelihood = ${likelihood},
        impact = ${impact},
        current_controls = ${body.current_controls || ""},
        recommended_controls = ${body.recommended_controls || ""},
        owner = ${body.owner},
        status = ${body.status || "open"},
        due_date = ${body.due_date || null},
        residual_likelihood = ${residualLikelihood},
        residual_impact = ${residualImpact},
        control_assessment = ${body.control_assessment || ""},
        risk_treatment = ${body.risk_treatment || "mitigate"},
        treatment_state = ${body.treatment_state || "planned"},
        treatment_end_date = ${body.treatment_end_date || null},
        action_owner = ${body.action_owner || ""},
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ${id}
      RETURNING *
    ` as Record<string, any>[]

    if (result.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Technology risk not found",
        },
        { status: 404 },
      )
    }

    console.log("Technology risk updated successfully:", result[0])

    return NextResponse.json({
      success: true,
      data: result[0],
      message: "Technology risk updated successfully",
    })
  } catch (error) {
    console.error("Error updating technology risk:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to update technology risk",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
});

export const DELETE = withContext(async({ tenantDb }, request, { params }: { params: { id: string } }) => {
  try {
    const id = params.id
    console.log("Deleting technology risk with ID:", id)

    const result = await tenantDb`
      DELETE FROM technology_risks 
      WHERE id = ${id}
      RETURNING *
    ` as Record<string, any>[]

    if (result.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Technology risk not found",
        },
        { status: 404 },
      )
    }

    console.log("Technology risk deleted successfully:", result[0])

    return NextResponse.json({
      success: true,
      message: "Technology risk deleted successfully",
    })
  } catch (error) {
    console.error("Error deleting technology risk:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to delete technology risk",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
});
