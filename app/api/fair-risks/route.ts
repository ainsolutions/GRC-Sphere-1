import { type NextRequest, NextResponse } from "next/server"
import { withContext, HttpSessionContext } from "@/lib/HttpContext"
import { te } from "date-fns/locale";

export const GET = withContext(async ({ tenantDb}: HttpSessionContext, request) => {
  try {
    const { searchParams } = new URL(request.url)
    const limit = searchParams.get("limit") || "50"
    const offset = searchParams.get("offset") || "0"
    const treatment_status = searchParams.get("treatment_status") || "all"

    const limitNum = Number.parseInt(limit, 10)
    const offsetNum = Number.parseInt(offset, 10)

    let rawRisks = treatment_status !== "all"
      ? await tenantDb`
        SELECT 
          id,
          risk_id,
          risk_title as title,
          risk_description as description,
          asset_id,
          threat_actor,
          threat_capability,
          threat_motivation,
          control_strength,
          vulnerability_score,
          loss_event_frequency_min,
          loss_event_frequency_most_likely,
          loss_event_frequency_max,
          primary_loss_min,
          primary_loss_most_likely,
          primary_loss_max,
          secondary_loss_min,
          secondary_loss_most_likely,
          secondary_loss_max,
          annual_loss_expectancy,
          risk_tolerance,
          treatment_plan,
          treatment_status,
          treatment_due_date,
          created_at,
          updated_at
        FROM fair_risks
        WHERE treatment_status = ${treatment_status}
        ORDER BY created_at DESC 
        LIMIT ${limitNum} 
        OFFSET ${offsetNum}
      `
    
     : await tenantDb`
        SELECT 
          id,
          risk_id,
          risk_title as title,
          risk_description as description,
          asset_id,
          threat_actor,
          threat_capability,
          threat_motivation,
          control_strength,
          vulnerability_score,
          loss_event_frequency_min,
          loss_event_frequency_most_likely,
          loss_event_frequency_max,
          primary_loss_min,
          primary_loss_most_likely,
          primary_loss_max,
          secondary_loss_min,
          secondary_loss_most_likely,
          secondary_loss_max,
          annual_loss_expectancy,
          risk_tolerance,
          treatment_plan,
          treatment_status,
          treatment_due_date,
          created_at,
          updated_at
        FROM fair_risks
        ORDER BY created_at DESC 
        LIMIT ${limitNum} 
        OFFSET ${offsetNum}
      `
          // ✅ runtime guard
      if (!Array.isArray(rawRisks)) {
        return NextResponse.json(
          { error: "Unexpected database result", details: "Result is not an array" },
          { status: 500 }
        );
    }
    const risks = rawRisks as Record<string, any>[]; // now TS knows it's an array
    // Serialize dates and ensure proper data types
    const serializedRisks = risks.map((risk: any) => ({
      ...risk,
      id: Number(risk.id),
      threat_capability: risk.threat_capability ? Number(risk.threat_capability) : null,
      threat_motivation: risk.threat_motivation ? Number(risk.threat_motivation) : null,
      control_strength: risk.control_strength ? Number(risk.control_strength) : null,
      vulnerability_score: risk.vulnerability_score ? Number(risk.vulnerability_score) : null,
      loss_event_frequency_min: risk.loss_event_frequency_min ? Number(risk.loss_event_frequency_min) : null,
      loss_event_frequency_most_likely: risk.loss_event_frequency_most_likely
        ? Number(risk.loss_event_frequency_most_likely)
        : null,
      loss_event_frequency_max: risk.loss_event_frequency_max ? Number(risk.loss_event_frequency_max) : null,
      primary_loss_min: risk.primary_loss_min ? Number(risk.primary_loss_min) : null,
      primary_loss_most_likely: risk.primary_loss_most_likely ? Number(risk.primary_loss_most_likely) : null,
      primary_loss_max: risk.primary_loss_max ? Number(risk.primary_loss_max) : null,
      secondary_loss_min: risk.secondary_loss_min ? Number(risk.secondary_loss_min) : null,
      secondary_loss_most_likely: risk.secondary_loss_most_likely ? Number(risk.secondary_loss_most_likely) : null,
      secondary_loss_max: risk.secondary_loss_max ? Number(risk.secondary_loss_max) : null,
      annual_loss_expectancy: risk.annual_loss_expectancy ? Number(risk.annual_loss_expectancy) : null,
      risk_tolerance: risk.risk_tolerance ? Number(risk.risk_tolerance) : null,
      created_at: risk.created_at ? new Date(risk.created_at).toISOString() : null,
      updated_at: risk.updated_at ? new Date(risk.updated_at).toISOString() : null,
      treatment_due_date: risk.treatment_due_date ? new Date(risk.treatment_due_date).toISOString() : null,
    }))

    return NextResponse.json(serializedRisks)
  } catch (error: any) {
    console.error("Error fetching FAIR risks:", error)
    return NextResponse.json(
      {
        error: "Failed to fetch FAIR risks",
        details: error.message,
      },
      { status: 500 },
    )
  }
});

export const POST = withContext(async ({ tenantDb }: HttpSessionContext, request) => {
  try {
    const body = await request.json()

    // Validate required fields
    if (!body.title || typeof body.title !== "string" || body.title.trim().length === 0) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 })
    }

    // Generate a unique risk ID
    const riskIdResult = await tenantDb`
      SELECT COALESCE(MAX(CAST(SUBSTRING(risk_id FROM 6) AS INTEGER)), 0) + 1 as next_id
      FROM fair_risks 
      WHERE risk_id LIKE 'FAIR-%'
    ` as Record<string, any>[]
    const nextId = riskIdResult[0]?.next_id || 1
    const riskId = `FAIR-${nextId.toString().padStart(4, "0")}`

    const result = await tenantDb`
      INSERT INTO fair_risks (
        risk_id,
        risk_title,
        risk_description,
        asset_id,
        threat_actor,
        threat_capability,
        threat_motivation,
        control_strength,
        vulnerability_score,
        loss_event_frequency_min,
        loss_event_frequency_most_likely,
        loss_event_frequency_max,
        primary_loss_min,
        primary_loss_most_likely,
        primary_loss_max,
        secondary_loss_min,
        secondary_loss_most_likely,
        secondary_loss_max,
        annual_loss_expectancy,
        risk_tolerance,
        treatment_plan,
        treatment_status,
        treatment_due_date,
        created_at,
        updated_at
      ) VALUES (
        ${riskId},
        ${body.title.trim()},
        ${body.description?.trim() || null},
        ${body.asset_id || null},
        ${body.threat_actor?.trim() || null},
        ${body.threat_capability || null},
        ${body.threat_motivation || null},
        ${body.control_strength || null},
        ${body.vulnerability_score || null},
        ${body.loss_event_frequency_min || null},
        ${body.loss_event_frequency_most_likely || null},
        ${body.loss_event_frequency_max || null},
        ${body.primary_loss_min || null},
        ${body.primary_loss_most_likely || null},
        ${body.primary_loss_max || null},
        ${body.secondary_loss_min || null},
        ${body.secondary_loss_most_likely || null},
        ${body.secondary_loss_max || null},
        ${body.annual_loss_expectancy || null},
        ${body.risk_tolerance || null},
        ${body.treatment_plan?.trim() || null},
        ${body.treatment_status || "identified"},
        ${body.treatment_due_date || null},
        NOW(),
        NOW()
      )
      RETURNING 
        id,
        risk_id,
        risk_title as title,
        risk_description as description,
        asset_id,
        threat_actor,
        threat_capability,
        threat_motivation,
        control_strength,
        vulnerability_score,
        loss_event_frequency_min,
        loss_event_frequency_most_likely,
        loss_event_frequency_max,
        primary_loss_min,
        primary_loss_most_likely,
        primary_loss_max,
        secondary_loss_min,
        secondary_loss_most_likely,
        secondary_loss_max,
        annual_loss_expectancy,
        risk_tolerance,
        treatment_plan,
        treatment_status,
        treatment_due_date,
        created_at,
        updated_at
    ` as Record<string, any>[]

    // Serialize the response
    const serializedResult = {
      ...result[0],
      id: Number(result[0].id),
      threat_capability: result[0].threat_capability ? Number(result[0].threat_capability) : null,
      threat_motivation: result[0].threat_motivation ? Number(result[0].threat_motivation) : null,
      control_strength: result[0].control_strength ? Number(result[0].control_strength) : null,
      vulnerability_score: result[0].vulnerability_score ? Number(result[0].vulnerability_score) : null,
      loss_event_frequency_min: result[0].loss_event_frequency_min ? Number(result[0].loss_event_frequency_min) : null,
      loss_event_frequency_most_likely: result[0].loss_event_frequency_most_likely
        ? Number(result[0].loss_event_frequency_most_likely)
        : null,
      loss_event_frequency_max: result[0].loss_event_frequency_max ? Number(result[0].loss_event_frequency_max) : null,
      primary_loss_min: result[0].primary_loss_min ? Number(result[0].primary_loss_min) : null,
      primary_loss_most_likely: result[0].primary_loss_most_likely ? Number(result[0].primary_loss_most_likely) : null,
      primary_loss_max: result[0].primary_loss_max ? Number(result[0].primary_loss_max) : null,
      secondary_loss_min: result[0].secondary_loss_min ? Number(result[0].secondary_loss_min) : null,
      secondary_loss_most_likely: result[0].secondary_loss_most_likely
        ? Number(result[0].secondary_loss_most_likely)
        : null,
      secondary_loss_max: result[0].secondary_loss_max ? Number(result[0].secondary_loss_max) : null,
      annual_loss_expectancy: result[0].annual_loss_expectancy ? Number(result[0].annual_loss_expectancy) : null,
      risk_tolerance: result[0].risk_tolerance ? Number(result[0].risk_tolerance) : null,
      created_at: result[0].created_at ? new Date(result[0].created_at).toISOString() : null,
      updated_at: result[0].updated_at ? new Date(result[0].updated_at).toISOString() : null,
      treatment_due_date: result[0].treatment_due_date ? new Date(result[0].treatment_due_date).toISOString() : null,
    }

    return NextResponse.json(serializedResult, { status: 201 })
  } catch (error: any) {
    console.error("Error creating FAIR risk:", error)
    return NextResponse.json(
      {
        error: "Failed to create FAIR risk",
        details: error.message,
      },
      { status: 500 },
    )
  }
});
