import { type NextRequest, NextResponse } from "next/server"
import { withContext } from "@/lib/HttpContext"

export const GET = withContext(async({ tenantDb }, request) => {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get("type") // 'control', 'guidance', 'compliance'
    const search = searchParams.get("search") || ""
    const category = searchParams.get("category")

    const whereConditions = ["is_active = true"]
    const queryParams: any[] = []

    if (type) {
      whereConditions.push(`reference_type = $${queryParams.length + 1}`)
      queryParams.push(type)
    }

    if (search) {
      whereConditions.push(
        `(reference_code ILIKE $${queryParams.length + 1} OR reference_name ILIKE $${queryParams.length + 1} OR reference_description ILIKE $${queryParams.length + 1})`,
      )
      queryParams.push(`%${search}%`)
    }

    if (category) {
      whereConditions.push(`category = $${queryParams.length + 1}`)
      queryParams.push(category)
    }

    const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(" AND ")}` : ""

    const references = await tenantDb`
      SELECT 
        id,
        reference_code,
        reference_name,
        reference_description,
        reference_type,
        category,
        implementation_guidance,
        compliance_requirement,
        is_active,
        created_at,
        updated_at
      FROM nist_references
      ${search ? tenantDb`WHERE (reference_code ILIKE ${`%${search}%`} OR reference_name ILIKE ${`%${search}%`} OR reference_description ILIKE ${`%${search}%`}) AND is_active = true` : tenantDb`WHERE is_active = true`}
      ${type ? tenantDb`AND reference_type = ${type}` : tenantDb``}
      ${category ? tenantDb`AND category = ${category}` : tenantDb``}
      ORDER BY reference_code ASC
    `

    return NextResponse.json({
      success: true,
      data: references,
    })
  } catch (error) {
    console.error("Error fetching NIST references:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch NIST references",
      },
      { status: 500 },
    )
  }
});

export const POST = withContext(async({ tenantDb }, request) => {
  try {
    const body = await request.json()
    const {
      reference_code,
      reference_name,
      reference_description,
      reference_type,
      category,
      implementation_guidance,
      compliance_requirement,
    } = body

    const reference = await tenantDb`
      INSERT INTO nist_references (
        reference_code,
        reference_name,
        reference_description,
        reference_type,
        category,
        implementation_guidance,
        compliance_requirement,
        is_active
      ) VALUES (
        ${reference_code},
        ${reference_name},
        ${reference_description || ""},
        ${reference_type},
        ${category || ""},
        ${implementation_guidance || ""},
        ${compliance_requirement || ""},
        true
      ) RETURNING *
    ` as Record<string, any>[]

    return NextResponse.json({
      success: true,
      data: reference[0],
    })
  } catch (error) {
    console.error("Error creating NIST reference:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to create NIST reference",
      },
      { status: 500 },
    )
  }
});
