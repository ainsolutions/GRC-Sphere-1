import { type NextRequest, NextResponse } from "next/server"
import { withContext } from "@/lib/HttpContext"


export const GET = withContext(async ({ tenantDb },context, req: Request, { params }: { params: { id: string } }) => {
  try {
    const templateId = Number.parseInt(params.id)

    const riskItems = await tenantDb`
      SELECT 
        catri.*,
        cat.name as template_name
      FROM custom_assessment_template_risk_items catri
      JOIN custom_assessment_templates cat ON catri.template_id = cat.id
      WHERE catri.template_id = ${templateId}
      ORDER BY catri.sort_order, catri.category_name, catri.risk_title
    ` as any[]

    // Group by category
    const groupedItems = riskItems.reduce((acc: any, item: any) => {
      const category = item.category_name
      if (!acc[category]) {
        acc[category] = {
          name: category,
          description: item.category_description,
          items: [],
        }
      }
      acc[category].items.push(item)
      return acc
    }, {})

    return NextResponse.json({
      template_id: templateId,
      categories: Object.values(groupedItems),
      total_items: riskItems.length,
    })
  } catch (error) {
    console.error("Error fetching template risk items:", error)
    return NextResponse.json({ error: "Failed to fetch template risk items" }, { status: 500 })
  }
})

export const POST = withContext(async ({ tenantDb },context, request: Request, { params }: { params: { id: string } }) => {
  try {
    const templateId = Number.parseInt(params.id)
    const body = await request.json()
    const {
      category_name,
      category_description,
      risk_title,
      risk_description,
      default_likelihood = 3,
      default_impact = 3,
      control_catalogue = "ISO27001",
      control_reference,
      is_mandatory = false,
      weight = 1.0,
      sort_order = 0,
    } = body

    if (!category_name || !risk_title || !risk_description) {
      return NextResponse.json(
        { error: "Category name, risk title, and risk description are required" },
        { status: 400 },
      )
    }
      const rawResult = await tenantDb`
        INSERT INTO custom_assessment_template_risk_items (
          template_id, category_name, category_description, risk_title, risk_description,
          default_likelihood, default_impact, control_catalogue, control_reference,
          is_mandatory, weight, sort_order
        ) VALUES (
          ${templateId}, ${category_name}, ${category_description},
          ${risk_title}, ${risk_description}, ${default_likelihood},
          ${default_impact}, ${control_catalogue}, ${control_reference},
          ${is_mandatory}, ${weight}, ${sort_order}
        ) RETURNING *
      `;

      if (!Array.isArray(rawResult) || rawResult.length === 0) {
        return NextResponse.json(
          { error: "Failed to create template risk item" },
          { status: 500 }
        );
      }
    const riskItem = rawResult[0] as Record<string, any>;
      return NextResponse.json(riskItem, { status: 201 });
    } catch (error) {
      console.error("Error creating template risk item:", error);
      return NextResponse.json(
        { error: "Failed to create template risk item" },
        { status: 500 }
      );
    }
})
