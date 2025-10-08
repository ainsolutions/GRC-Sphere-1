import { type NextRequest, NextResponse } from "next/server"
import { withContext } from "@/lib/HttpContext"


export const GET = withContext(async({ tenantDb }, request) => {
  try {
    const { searchParams } = new URL(request.url)
    const vendor_type = searchParams.get("vendor_type")
    const vendor_type_id = searchParams.get("vendor_type_id")

    let templates

    if (vendor_type_id) {
      // Get templates by vendor type ID
      templates = await tenantDb`
        SELECT 
          rt.*,
          vt.type_name,
          vt.color,
          vt.icon
        FROM vendor_type_risk_templates rt
        LEFT JOIN vendor_types vt ON rt.vendor_type_id = vt.id
        WHERE rt.vendor_type_id = ${vendor_type_id}
        ORDER BY rt.risk_category, rt.risk_name
      `
    } else if (vendor_type) {
      // Get templates by vendor type name
      templates = await tenantDb`
        SELECT 
          rt.*,
          vt.type_name,
          vt.color,
          vt.icon
        FROM vendor_type_risk_templates rt
        LEFT JOIN vendor_types vt ON rt.vendor_type_id = vt.id
        WHERE vt.type_name = ${vendor_type}
        ORDER BY rt.risk_category, rt.risk_name
      `
    } else {
      // Get all templates
      templates = await tenantDb`
        SELECT 
          rt.*,
          vt.type_name,
          vt.color,
          vt.icon
        FROM vendor_type_risk_templates rt
        LEFT JOIN vendor_types vt ON rt.vendor_type_id = vt.id
        ORDER BY vt.type_name, rt.risk_category, rt.risk_name
      `
    }

    return NextResponse.json({
      success: true,
      templates,
    })
  } catch (error) {
    console.error("Error fetching risk templates:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch risk templates",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
});

export const POST = withContext(async({ tenantDb }, request) => {
  try {
    const body = await request.json()
    console.log("Creating risk template with data:", body)

    const {
      vendor_type_id,
      risk_category,
      risk_name,
      risk_description,
      default_likelihood_score,
      default_impact_score,
      weight,
      is_mandatory,
      control_catalogue,
    } = body

    // Validate required fields
    if (!vendor_type_id || !risk_category || !risk_name) {
      return NextResponse.json(
        {
          success: false,
          error: "Vendor type, risk category, and risk name are required",
        },
        { status: 400 },
      )
    }

    // Validate vendor type exists
    const vendorTypeExists = await tenantDb`
      SELECT id FROM vendor_types WHERE id = ${vendor_type_id}
    ` as Record<string, any>[]

    if (vendorTypeExists.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Vendor type not found",
        },
        { status: 400 },
      )
    }

    const result = await tenantDb`
      INSERT INTO vendor_type_risk_templates (
        vendor_type_id, category_id, risk_name, risk_description,
        default_likelihood_score, default_impact_score, weight, is_mandatory, control_catalogue
      ) VALUES (
        ${vendor_type_id}, 
        ${risk_category}, 
        ${risk_name}, 
        ${risk_description || null},
        ${default_likelihood_score || 3}, 
        ${default_impact_score || 3}, 
        ${weight || 1.0}, 
        ${is_mandatory || false}, 
        ${JSON.stringify(control_catalogue || [])}
      )
      RETURNING *
    ` as Record<string, any>[]

    return NextResponse.json({
      success: true,
      template: result[0],
      message: "Risk template created successfully",
    })
  } catch (error) {
    console.error("Error creating risk template:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to create risk template",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
});
