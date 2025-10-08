import { type NextRequest, NextResponse } from "next/server"
import { withContext } from "@/lib/HttpContext"


export const GET = withContext(async({ tenantDb }, request) => {
  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get("search")
    const limit = Number.parseInt(searchParams.get("limit") || "50")
    const offset = Number.parseInt(searchParams.get("offset") || "0")

    console.log("Fetching technology risks with params:", { search, limit, offset })

    // First check if the table exists
    const tableCheck = await tenantDb`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'technology_risks'
      );
    ` as Record<string, any>[]

    if (!tableCheck[0]?.exists) {
      console.log("Technology risks table does not exist, returning empty array")
      return NextResponse.json({
        success: true,
        risks: [],
        total: 0,
      })
    }

    let result

    if (search) {
      result = await tenantDb`
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
          -- Get related assets information using VARCHAR asset_ids
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
          ) as related_assets,
          -- Get asset names for display
          COALESCE(
            (
              SELECT string_agg(a.asset_name, ', ')
              FROM assets a 
              WHERE tr.asset_ids IS NOT NULL 
              AND tr.asset_ids != ''
              AND a.id::text = ANY(string_to_array(tr.asset_ids, ','))
            ),
            'N/A'
          ) as asset_name
        FROM technology_risks tr
        WHERE 
          tr.risk_id ILIKE ${`%${search}%`} OR
          tr.title ILIKE ${`%${search}%`} OR 
          tr.description ILIKE ${`%${search}%`} OR 
          tr.technology_category ILIKE ${`%${search}%`} OR 
          tr.owner ILIKE ${`%${search}%`}
        ORDER BY tr.created_at DESC 
        LIMIT ${limit} 
        OFFSET ${offset}
      ` as Record<string, any>[]
    } else {
      result = await tenantDb`
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
          -- Get related assets information using VARCHAR asset_ids
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
          ) as related_assets,
          -- Get asset names for display
          COALESCE(
            (
              SELECT string_agg(a.asset_name, ', ')
              FROM assets a 
              WHERE tr.asset_ids IS NOT NULL 
              AND tr.asset_ids != ''
              AND a.id::text = ANY(string_to_array(tr.asset_ids, ','))
            ),
            'N/A'
          ) as asset_name
        FROM technology_risks tr
        ORDER BY tr.created_at DESC 
        LIMIT ${limit} 
        OFFSET ${offset}
      ` as Record<string, any>[]
    }

    console.log(`Found ${result.length} technology risks`)

    return NextResponse.json({
      success: true,
      risks: result,
      total: result.length,
    })
  } catch (error) {
    console.error("Error fetching technology risks:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch technology risks",
        details: error instanceof Error ? error.message : "Unknown error",
        risks: [],
      },
      { status: 500 },
    )
  }
});

export const POST = withContext(async({ tenantDb }, request) => {
  try {
    const body = await request.json()
    console.log("Received POST request body:", JSON.stringify(body, null, 2))

    // Validate required fields
    if (!body.title || !body.description || !body.technology_category || !body.owner) {
      console.error("Missing required fields:", {
        title: !!body.title,
        description: !!body.description,
        technology_category: !!body.technology_category,
        owner: !!body.owner,
      })
      return NextResponse.json(
        {
          success: false,
          error: "Missing required fields: title, description, technology_category, owner",
        },
        { status: 400 },
      )
    }

    // Check if technology_risks table exists
    const tableCheck = await tenantDb`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'technology_risks'
      );
    ` as Record<string, any>[]

    if (!tableCheck[0]?.exists) {
      console.error("Technology risks table does not exist")
      return NextResponse.json(
        {
          success: false,
          error: "Technology risks table does not exist. Please run the database migration first.",
        },
        { status: 500 },
      )
    }

    // Generate or use provided risk ID
    let riskId = body.risk_id
    if (!riskId) {
      const currentYear = new Date().getFullYear()
      try {
        const riskIdResult = await tenantDb`
          SELECT COALESCE(MAX(CAST(SUBSTRING(risk_id FROM 9) AS INTEGER)), 0) + 1 as next_id
          FROM technology_risks 
          WHERE risk_id LIKE ${"TR-" + currentYear + "-%"}
        ` as Record<string, any>[]
        const nextId = riskIdResult[0]?.next_id || 1
        riskId = `TR-${currentYear}-${nextId.toString().padStart(5, "0")}`
      } catch (error) {
        console.error("Error generating risk ID:", error)
        // Fallback to random ID
        const randomNum = Math.floor(Math.random() * 100000)
          .toString()
          .padStart(5, "0")
        riskId = `TR-${currentYear}-${randomNum}`
      }
    }

    // Handle asset_ids - convert array to comma-separated string
    let assetIds = null
    if (body.asset_ids && Array.isArray(body.asset_ids) && body.asset_ids.length > 0) {
      // Filter out null, undefined, empty strings, and "none" values
      const validAssetIds: string[] = body.asset_ids
        .filter((id: string | null | undefined) => id && id !== "none" && id !== "")
        .map((id: string) => id.toString()) // Keep as strings since asset_ids is VARCHAR

      if (validAssetIds.length > 0) {
        assetIds = validAssetIds.join(",") // Store as comma-separated string
      }
    }

    // Calculate risk scores
    const likelihood = Number(body.likelihood) || 1
    const impact = Number(body.impact) || 1
    const residualLikelihood = Number(body.residual_likelihood) || likelihood
    const residualImpact = Number(body.residual_impact) || impact

    console.log("Creating technology risk with data:", {
      riskId,
      title: body.title,
      assetIds,
      likelihood,
      impact,
      residualLikelihood,
      residualImpact,
    })

    // Check table schema to ensure all columns exist
    const schemaCheck = await tenantDb`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'technology_risks'
      ORDER BY ordinal_position;
    `
    console.log("Technology risks table schema:", schemaCheck)

    const result = await tenantDb`
      INSERT INTO technology_risks (
        risk_id,
        title,
        description,
        technology_category,
        technology_type,
        asset_ids,
        risk_category,
        likelihood,
        impact,
        current_controls,
        recommended_controls,
        owner,
        status,
        due_date,
        residual_likelihood,
        residual_impact,
        control_assessment,
        risk_treatment,
        treatment_state,
        treatment_end_date,
        action_owner,
        created_at,
        updated_at
      ) VALUES (
        ${riskId},
        ${body.title},
        ${body.description},
        ${body.technology_category},
        ${body.technology_type || "Server"},
        ${assetIds},
        ${body.risk_category || "Technology"},
        ${likelihood},
        ${impact},
        ${body.current_controls || ""},
        ${body.recommended_controls || ""},
        ${body.owner},
        ${body.status || "open"},
        ${body.due_date || null},
        ${residualLikelihood},
        ${residualImpact},
        ${body.control_assessment || ""},
        ${body.risk_treatment || "mitigate"},
        ${body.treatment_state || "planned"},
        ${body.treatment_end_date || null},
        ${body.action_owner || ""},
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP
      )
      RETURNING *
    ` as Record<string, any>[]

    console.log("Technology risk created successfully:", result[0])

    return NextResponse.json({
      success: true,
      data: result[0],
      message: "Technology risk created successfully",
    })
  } catch (error) {
    console.error("Error creating technology risk:", error)
    console.error("Error stack:", error instanceof Error ? error.stack : "No stack trace")

    return NextResponse.json(
      {
        success: false,
        error: "Failed to create technology risk",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
});
