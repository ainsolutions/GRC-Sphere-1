import { type NextRequest, NextResponse } from "next/server"
import { withContext } from "@/lib/HttpContext"

export const GET = withContext(async ({ tenantDb },context, req: Request, { params }: { params: { id: string } }) => {
  try {
    const templateId = Number.parseInt(params.id)

    const queryResult = await tenantDb`
      SELECT 
        cat.*,
        vt.name as vendor_type_name
      FROM custom_assessment_templates cat
      LEFT JOIN vendor_types vt ON cat.vendor_type_id = vt.id
      WHERE cat.id = ${templateId}
    `;

    const template = Array.isArray(queryResult) ? queryResult[0] : null;

    if (!template) {
      return NextResponse.json({ error: "Template not found" }, { status: 404 })
    }

    const riskItems = await tenantDb`
      SELECT * FROM custom_assessment_template_risk_items
      WHERE template_id = ${templateId}
      ORDER BY sort_order, category_name, risk_title
    `

    return NextResponse.json({
      ...template,
      risk_items: riskItems,
    })
  } catch (error) {
    console.error("Error fetching custom assessment template:", error)
    return NextResponse.json({ error: "Failed to fetch custom assessment template" }, { status: 500 })
  }
});

export const PUT = withContext(
  async ({ tenantDb }, request: Request, { params }: { params: { id: string } }) => {
    try {
      const templateId = Number.parseInt(params.id);
      const body = await request.json();
      const { template_name, template_description, vendor_type_id, is_public, settings, risk_items } = body;

      // --- Update template ---
      const rawResult = await tenantDb`
        UPDATE custom_assessment_templates 
        SET 
          template_name = ${template_name},
          template_description = ${template_description},
          vendor_type_id = ${vendor_type_id},
          is_public = ${is_public},
          settings = ${JSON.stringify(settings)},
          updated_at = CURRENT_TIMESTAMP
        WHERE id = ${templateId}
        RETURNING *
      `;

      if (!Array.isArray(rawResult) || rawResult.length === 0) {
        return NextResponse.json({ error: "Template not found" }, { status: 404 });
      }

      const updatedTemplate = rawResult[0] as Record<string, any>;

      // --- Update risk items if provided ---
      if (risk_items) {
        await tenantDb`DELETE FROM custom_assessment_template_risk_items WHERE template_id = ${templateId}`;

        for (const item of risk_items) {
          await tenantDb`
            INSERT INTO custom_assessment_template_risk_items (
              template_id, category_name, category_description, risk_title, risk_description,
              default_likelihood, default_impact, control_catalogue, control_reference,
              is_mandatory, weight, sort_order
            ) VALUES (
              ${templateId}, ${item.category_name}, ${item.category_description}, 
              ${item.risk_title}, ${item.risk_description}, ${item.default_likelihood}, 
              ${item.default_impact}, ${item.control_catalogue}, ${item.control_reference},
              ${item.is_mandatory}, ${item.weight}, ${item.sort_order}
            )
          `;
        }
      }

      return NextResponse.json(updatedTemplate);
    } catch (error) {
      console.error("Error updating custom assessment template:", error);
      return NextResponse.json({ error: "Failed to update custom assessment template" }, { status: 500 });
    }
  }
);


export const DELETE = withContext(async ( {tenantDb },context, request: Request, { params }: { params: { id: string } }) => {
  try {
    const templateId = Number.parseInt(params.id)

    const rawResult = await tenantDb`
        UPDATE custom_assessment_templates 
        SET is_active = false, updated_at = CURRENT_TIMESTAMP
        WHERE id = ${templateId}
        RETURNING *
      `;

      // --- Runtime guard before indexing ---
      if (!Array.isArray(rawResult) || rawResult.length === 0) {
        return NextResponse.json({ error: "Template not found" }, { status: 404 });
      }

      const deletedTemplate = rawResult[0] as Record<string, any>;

    return NextResponse.json({ message: "Template deleted successfully" })
  } catch (error) {
    console.error("Error deleting custom assessment template:", error)
    return NextResponse.json({ error: "Failed to delete custom assessment template" }, { status: 500 })
  }
});
