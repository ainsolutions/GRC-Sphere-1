import { type NextRequest, NextResponse } from "next/server"
import { withContext } from "@/lib/HttpContext"


export const GET = withContext(async({ tenantDb }, request, { params }: { params: { id: string } }) => {
  try {
    const templates = await tenantDb`
      SELECT 
        vrt.*,
        vtc.category_name as category_name,
        vtc.description as category_description,
        vtc.weight as category_weight,
        vtc.is_mandatory as category_mandatory
      FROM vendor_type_risk_templates vrt
      JOIN vendor_type_template_categories vtc ON vrt.category_id = vtc.id
      WHERE vrt.vendor_type_id = ${Number.parseInt(params.id)}::INTEGER
      ORDER BY vtc.sort_order, vrt.sort_order
    `

    const categories = await tenantDb`
      SELECT * FROM vendor_type_template_categories
      WHERE vendor_type_id = ${Number.parseInt(params.id)}::INTEGER
      ORDER BY sort_order
    `

    return NextResponse.json({ templates, categories })
  } catch (error) {
    console.error("Error fetching vendor type templates:", error)
    return NextResponse.json({ error: "Failed to fetch vendor type templates" }, { status: 500 })
  }
});

export const POST = withContext(async({ tenantDb }, request, { params }: { params: { id: string } }) => {
  try {
    const body = await request.json()
    const {
      category_id,
      risk_title,
      risk_description,
      default_likelihood,
      default_impact,
      control_catalogue,
      control_reference,
      is_mandatory,
      weight,
    } = body

    if (!risk_title || !category_id) {
      return NextResponse.json({ error: "Risk title and category are required" }, { status: 400 })
    }

    const default_risk_score = (default_likelihood || 3) * (default_impact || 3)

    const [template] = await tenantDb`
      INSERT INTO vendor_type_risk_templates (
        vendor_type_id, category_id, risk_title, risk_description,
        default_likelihood, default_impact, default_risk_score,
        control_catalogue, control_reference, is_mandatory, weight
      )
      VALUES (
        ${params.id}::INTEGER, ${category_id}, ${risk_title}, ${risk_description},
        ${default_likelihood || 3}, ${default_impact || 3}, ${default_risk_score},
        ${control_catalogue || "ISO27001"}, ${control_reference}, 
        ${is_mandatory || false}, ${weight || 1}
      )
      RETURNING *
    ` as Record<string, any>[]

    return NextResponse.json(template, { status: 201 })
  } catch (error) {
    console.error("Error creating vendor type template:", error)
    return NextResponse.json({ error: "Failed to create vendor type template" }, { status: 500 })
  }
});
