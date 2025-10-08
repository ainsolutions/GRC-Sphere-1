import { type NextRequest, NextResponse } from "next/server"
import { withContext } from "@/lib/HttpContext"


export const PUT = withContext(async({ tenantDb }, request, { params }: { params: { id: string } }) => {
  try {
    const body = await request.json()
    const {

      risk_title,
      risk_description,
      default_likelihood,
      default_impact,
      control_catalogue,
      control_reference,
      is_mandatory,
      weight,
    } = body

    const default_risk_score = (default_likelihood || 3) * (default_impact || 3)

    const [template] = await tenantDb`
      UPDATE vendor_type_risk_templates 
      SET 
        risk_title = ${risk_title},
        risk_description = ${risk_description},
        default_likelihood = ${default_likelihood || 3},
        default_impact = ${default_impact || 3},
        default_risk_score = ${default_risk_score},
        control_catalogue = ${control_catalogue || "ISO27001"},
        control_reference = ${control_reference},
        is_mandatory = ${is_mandatory || false},
        weight = ${weight || 1}
      WHERE id = ${Number.parseInt(params.id)}::INTEGER
      RETURNING *
    ` as Record<string, any>[]

    if (!template) {
      return NextResponse.json({ error: "Template not found" }, { status: 404 })
    }

    return NextResponse.json(template)
  } catch (error) {
    console.error("Error updating vendor type template:", error)
    return NextResponse.json({ error: "Failed to update vendor type template" }, { status: 500 })
  }
});

export const DELETE = withContext(async({ tenantDb }, request, { params }: { params: { id: string } }) => {
  try {
    const [template] = await tenantDb`
      DELETE FROM vendor_type_risk_templates 
      ${Number.parseInt(params.id)}::INTEGER
      RETURNING *
    ` as Record<string, any>[]

    if (!template) {
      return NextResponse.json({ error: "Template not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "Template deleted successfully" })
  } catch (error) {
    console.error("Error deleting vendor type template:", error)
    return NextResponse.json({ error: "Failed to delete vendor type template" }, { status: 500 })
  }
});
