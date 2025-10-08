import { type NextRequest, NextResponse } from "next/server"
import { withContext, HttpSessionContext } from "@/lib/HttpContext"


export const GET= withContext(async({tenantDb}: HttpSessionContext, request, { params }: { params: { id: string } }) => {
  try {
    const id = Number.parseInt(params.id, 10)

    if (isNaN(id)) {
      return NextResponse.json({ error: "Invalid risk ID" }, { status: 400 })
    }

    const result = await tenantDb`
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
      WHERE id = ${id}
    ` as Record <any, any>[]

    if (result.length === 0) {
      return NextResponse.json({ error: "FAIR risk not found" }, { status: 404 })
    } 

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

    return NextResponse.json(serializedResult)
  } catch (error: any) {
    console.error("Error fetching FAIR risk:", error)
    return NextResponse.json(
      {
        error: "Failed to fetch FAIR risk",
        details: error.message,
      },
      { status: 500 },
    )
  }
});

export const PUT = withContext(async({tenantDb }: HttpSessionContext, request, { params }: { params: { id: string } }) => {
  try {
    const id = Number.parseInt(params.id, 10)

    if (isNaN(id)) {
      return NextResponse.json({ error: "Invalid risk ID" }, { status: 400 })
    }

    const body = await request.json()

    // Validate required fields
    if (!body.title || typeof body.title !== "string" || body.title.trim().length === 0) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 })
    }

    const result = await tenantDb`
      UPDATE fair_risks SET
        risk_title = ${body.title.trim()},
        risk_description = ${body.description?.trim() || null},
        asset_id = ${body.asset_id || null},
        threat_actor = ${body.threat_actor?.trim() || null},
        threat_capability = ${body.threat_capability || null},
        threat_motivation = ${body.threat_motivation || null},
        control_strength = ${body.control_strength || null},
        vulnerability_score = ${body.vulnerability_score || null},
        loss_event_frequency_min = ${body.loss_event_frequency_min || null},
        loss_event_frequency_most_likely = ${body.loss_event_frequency_most_likely || null},
        loss_event_frequency_max = ${body.loss_event_frequency_max || null},
        primary_loss_min = ${body.primary_loss_min || null},
        primary_loss_most_likely = ${body.primary_loss_most_likely || null},
        primary_loss_max = ${body.primary_loss_max || null},
        secondary_loss_min = ${body.secondary_loss_min || null},
        secondary_loss_most_likely = ${body.secondary_loss_most_likely || null},
        secondary_loss_max = ${body.secondary_loss_max || null},
        annual_loss_expectancy = ${body.annual_loss_expectancy || null},
        risk_tolerance = ${body.risk_tolerance || null},
        treatment_plan = ${body.treatment_plan?.trim() || null},
        treatment_status = ${body.treatment_status || "identified"},
        treatment_due_date = ${body.treatment_due_date || null},
        updated_at = NOW()
      WHERE id = ${id}
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
    ` as Record <any, any>[]

    if (result.length === 0) {
      return NextResponse.json({ error: "FAIR risk not found" }, { status: 404 })
    }

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

    return NextResponse.json(serializedResult)
  } catch (error: any) {
    console.error("Error updating FAIR risk:", error)
    return NextResponse.json(
      {
        error: "Failed to update FAIR risk",
        details: error.message,
      },
      { status: 500 },
    )
  }
});

export const DELETE = withContext(async({tenantDb }: HttpSessionContext, request, { params }: { params: { id: string } }) => {
  try {
    const id = Number.parseInt(params.id, 10)

    if (isNaN(id)) {
      return NextResponse.json({ error: "Invalid risk ID" }, { status: 400 })
    }

    const result = await tenantDb`
      DELETE FROM fair_risks 
      WHERE id = ${id}
      RETURNING id
    ` as Record<string, any>[]

    if (result.length === 0) {
      return NextResponse.json({ error: "FAIR risk not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "FAIR risk deleted successfully" })
  } catch (error: any) {
    console.error("Error deleting FAIR risk:", error)
    return NextResponse.json(
      {
        error: "Failed to delete FAIR risk",
        details: error.message,
      },
      { status: 500 },
    )
  }
});
