import { type NextRequest, NextResponse } from "next/server"
import { withContext } from "@/lib/HttpContext"

export const GET = withContext(async ({ tenantDb }, request: Request) => {
    try {
      const { searchParams } = new URL(request.url);
      const templateType = searchParams.get("template_type") || "third_party_risk";
      const vendorTypeId = searchParams.get("vendor_type_id");
      const isPublic = searchParams.get("is_public");

      // --- Build query directly as a tagged template ---
      const templates = await tenantDb`
        SELECT 
          cat.*,
          vt.name AS vendor_type_name,
          COUNT(catri.id) AS risk_item_count
        FROM custom_assessment_templates cat
        LEFT JOIN vendor_types vt ON cat.vendor_type_id = vt.id
        LEFT JOIN custom_assessment_template_risk_items catri ON cat.id = catri.template_id
        WHERE cat.template_type = ${templateType}
          AND cat.is_active = true
          ${vendorTypeId
            ? tenantDb` AND (cat.vendor_type_id = ${Number(vendorTypeId)} OR cat.vendor_type_id IS NULL)`
            : tenantDb``}
          ${isPublic !== null
            ? tenantDb` AND cat.is_public = ${isPublic === "true"}`
            : tenantDb``}
        GROUP BY cat.id, vt.name
        ORDER BY cat.usage_count DESC, cat.created_at DESC
      `;

      return NextResponse.json(templates);
    } catch (error) {
      console.error("Error fetching custom assessment templates:", error);
      return NextResponse.json(
        { error: "Failed to fetch custom assessment templates" },
        { status: 500 }
      );
    }
  });


export const POST = withContext(async ({ tenantDb }, request: Request) => {
  try {
    const body = await request.json()
    const {
      name,
      description,
      template_type = "third_party_risk",
      vendor_type_id,
      is_public = false,
      created_by = "user",
      settings = {},
      risk_items = [],
    } = body

    if (!name || !description) {
      return NextResponse.json({ error: "Name and description are required" }, { status: 400 })
    }

    // Create the template
    const rawResult = await tenantDb`
      INSERT INTO custom_assessment_templates (
        template_name, template_description, template_type, vendor_type_id,
        is_public, created_by, settings
      ) VALUES (
        ${name}, ${description}, ${template_type}, ${vendor_type_id},
        ${is_public}, ${created_by}, ${JSON.stringify(settings)}
      ) RETURNING *
    `;

    if (!Array.isArray(rawResult) || rawResult.length === 0) {
      return NextResponse.json({ error: "Failed to create custom assessment template" }, { status: 500 });
    }

    const template = rawResult[0] as Record<string, any>;

    // Add risk items if provided
    if (risk_items.length > 0) {
      for (const item of risk_items) {
        await tenantDb`
          INSERT INTO custom_assessment_template_risk_items (
            template_id, risk_category, risk_description,
            default_likelihood, default_impact, control_catalogue, control_reference,
            is_mandatory, weight, sort_order
          ) VALUES (
            ${template.id}, ${item.category_name}, ${item.category_description}, 
            ${item.risk_title}, ${item.risk_description}, ${item.default_likelihood}, 
            ${item.default_impact}, ${item.control_catalogue}, ${item.control_reference},
            ${item.is_mandatory}, ${item.weight}, ${item.sort_order}
          )
        `
      }
    }

    return NextResponse.json(template, { status: 201 })
  } catch (error) {
    console.error("Error creating custom assessment template:", error)
    return NextResponse.json({ error: "Failed to create custom assessment template" }, { status: 500 })
  }
})
