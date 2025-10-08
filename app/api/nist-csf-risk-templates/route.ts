import { type NextRequest, NextResponse } from "next/server"
import { withContext } from "@/lib/HttpContext"

export const GET = withContext(async({ tenantDb }, request) => {
  try {
    const { searchParams } = new URL(request.url)
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "10")
    const search = searchParams.get("search") || ""
    const functionId = searchParams.get("functionId")
    const riskLevel = searchParams.get("riskLevel")
    const offset = (page - 1) * limit

    const whereConditions = ["t.is_active = true"]
    const queryParams: any[] = []

    if (search) {
      whereConditions.push(
        `(t.template_name ILIKE $${queryParams.length + 1} OR t.risk_description ILIKE $${queryParams.length + 1})`,
      )
      queryParams.push(`%${search}%`)
    }

    if (functionId) {
      whereConditions.push(`t.function_id = $${queryParams.length + 1}`)
      queryParams.push(functionId)
    }

    if (riskLevel && riskLevel !== "all") {
      whereConditions.push(`t.risk_level = $${queryParams.length + 1}`)
      queryParams.push(riskLevel)
    }

    const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(" AND ")}` : ""

    // Get total count
    const countQuery = `
      SELECT COUNT(*) as total
      FROM nist_csf_risk_templates t
      ${whereClause}
    `

    const countResult = await tenantDb`
      SELECT COUNT(*) as total
      FROM nist_csf_risk_templates t
      LEFT JOIN nist_csf_functions f ON t.function_id = f.id
      LEFT JOIN nist_csf_categories c ON t.category_id = c.id
      ${search ? tenantDb`WHERE (t.template_name ILIKE ${`%${search}%`} OR t.risk_description ILIKE ${`%${search}%`}) AND t.is_active = true` : tenantDb`WHERE t.is_active = true`}
      ${functionId ? tenantDb`AND t.function_id = ${functionId}` : tenantDb``}
      ${riskLevel && riskLevel !== "all" ? tenantDb`AND t.risk_level = ${riskLevel}` : tenantDb``}
    ` as Record<string, any>[]

    // Get templates with pagination
    const templates = await tenantDb`
      SELECT 
        t.id,
        t.template_id,
        t.template_name,
        t.risk_description,
        t.function_id,
        t.category_id,
        t.default_likelihood,
        t.default_impact,
        t.risk_level,
        t.threat_sources,
        t.vulnerabilities,
        t.asset_types,
        t.nist_references,
        t.is_active,
        t.created_at,
        t.updated_at,
        f.function_code,
        f.function_name,
        c.category_code,
        c.category_name
      FROM nist_csf_risk_templates t
      LEFT JOIN nist_csf_functions f ON t.function_id = f.id
      LEFT JOIN nist_csf_categories c ON t.category_id = c.id
      ${search ? tenantDb`WHERE (t.template_name ILIKE ${`%${search}%`} OR t.risk_description ILIKE ${`%${search}%`}) AND t.is_active = true` : tenantDb`WHERE t.is_active = true`}
      ${functionId ? tenantDb`AND t.function_id = ${functionId}` : tenantDb``}
      ${riskLevel && riskLevel !== "all" ? tenantDb`AND t.risk_level = ${riskLevel}` : tenantDb``}
      ORDER BY t.created_at DESC
      LIMIT ${limit} OFFSET ${offset}
    `

    const total = Number.parseInt(countResult[0].total)
    const totalPages = Math.ceil(total / limit)

    return NextResponse.json({
      success: true,
      data: {
        templates,
        pagination: {
          page,
          limit,
          total,
          totalPages,
        },
      },
    })
  } catch (error) {
    console.error("Error fetching NIST CSF risk templates:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch risk templates",
      },
      { status: 500 },
    )
  }
});

export const POST = withContext(async({ tenantDb }, request) => {
  try {
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

    // Generate template ID
    const templateCount = await tenantDb`SELECT COUNT(*) as count FROM nist_csf_risk_templates` as Record<string, any>[]
    const [{ nextval }] = await tenantDb`SELECT nextval('nist_csf_risk_templates_seq')` as Record<string, any>[]
    // const nextval = templateCount[0].count + 1;
    const templateId = `NIST-TMPL-${String(nextval).padStart(4,"0")}`

    const template = await tenantDb`
      INSERT INTO nist_csf_risk_templates (
        template_id,
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
        is_active
      ) VALUES (
        ${templateId},
        ${template_name},
        ${risk_description},
        ${function_id},
        ${category_id || null},
        ${default_likelihood},
        ${default_impact},
        ${risk_level},
        ${JSON.stringify(threat_sources || [])},
        ${JSON.stringify(vulnerabilities || [])},
        ${JSON.stringify(asset_types || [])},
        ${JSON.stringify(nist_references || [])},
        true
      ) RETURNING *
    ` as Record<string, any>[]

    return NextResponse.json({
      success: true,
      data: template[0],
    })
  } catch (error) {
    console.error("Error creating NIST CSF risk template:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to create risk template",
      },
      { status: 500 },
    )
  }
});
