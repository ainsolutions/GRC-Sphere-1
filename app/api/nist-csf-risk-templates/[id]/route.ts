import { type NextRequest, NextResponse } from "next/server"
import { withContext } from "@/lib/HttpContext"

export const GET = withContext(async({ tenantDb }, request, { params }: { params: { id: string } }) => {
  try {
    const templateId = Number.parseInt(params.id)

    const template = await tenantDb`
      SELECT 
        t.*,
        f.function_code,
        f.function_name,
        c.category_code,
        c.category_name
      FROM nist_csf_risk_templates t
      LEFT JOIN nist_csf_functions f ON t.function_id = f.id
      LEFT JOIN nist_csf_categories c ON t.category_id = c.id
      WHERE t.id = ${templateId}
    ` as Record<string, any>[]

    if (template.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Template not found",
        },
        { status: 404 },
      )
    }

    return NextResponse.json({
      success: true,
      data: template[0],
    })
  } catch (error) {
    console.error("Error fetching NIST CSF risk template:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch risk template",
      },
      { status: 500 },
    )
  }
});

export const PUT = withContext(async({ tenantDb }, request, context: { params: Promise<{ id: string }> }) => {
  try {
    const { id } = await context.params;
    const templateId = Number.parseInt(id, 10)
    const body = await request.json()
    const {
      template_name,
      risk_description,
      function_id,
      category_id,
      default_likelihood,
      default_impact,
      risk_level,
      threat_sources,
      vulnerabilities,
      asset_types,
      nist_references,
    } = body

    // Check if template exists
    const existingTemplate = await tenantDb`
      SELECT id FROM nist_csf_risk_templates WHERE id = ${templateId}
    ` as Record<string, number>[]

    if (existingTemplate.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Template not found",
        },
        { status: 404 },
      )
    }

    const updatedTemplate = await tenantDb`
      UPDATE nist_csf_risk_templates SET
        template_name = ${template_name},
        risk_description = ${risk_description},
        function_id = ${function_id},
        category_id = ${category_id || null},
        default_likelihood = ${default_likelihood},
        default_impact = ${default_impact},
        risk_level = ${risk_level},
        threat_sources = ${JSON.stringify(threat_sources || [])},
        vulnerabilities = ${JSON.stringify(vulnerabilities || [])},
        asset_types = ${JSON.stringify(asset_types || [])},
        nist_references = ${JSON.stringify(nist_references || [])},
        updated_at = NOW()
      WHERE id = ${templateId}
      RETURNING *
    ` as Record<string, any>[]

    return NextResponse.json({
      success: true,
      data: updatedTemplate[0],
    })
  } catch (error) {
    console.error("Error updating NIST CSF risk template:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to update risk template",
      },
      { status: 500 },
    )
  }
});

export const DELETE = withContext(async({ tenantDb }, request, { params }: { params: { id: string } }) => {
  try {
    const templateId = Number.parseInt(params.id)

    // Check if template exists
    const existingTemplate = await tenantDb`
      SELECT template_id, template_name FROM nist_csf_risk_templates WHERE id = ${templateId}
    ` as Record<string, any>[]

    if (existingTemplate.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Template not found",
        },
        { status: 404 },
      )
    }

    // Delete the template
    await tenantDb`
      DELETE FROM nist_csf_risk_templates WHERE id = ${templateId}
    `

    return NextResponse.json({
      success: true,
      data: {
        message: "Template deleted successfully",
        deleted_template: existingTemplate[0],
      },
    })
  } catch (error) {
    console.error("Error deleting NIST CSF risk template:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to delete risk template",
      },
      { status: 500 },
    )
  }
});
