import { type NextRequest, NextResponse } from "next/server"
import { withContext } from "@/lib/HttpContext"


export const GET = withContext(async({ tenantDb }, request) => {
  try {
    const { searchParams } = new URL(request.url)
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "10")
    const search = searchParams.get("search") || ""
    const status = searchParams.get("status") || ""
    const riskLevel = searchParams.get("riskLevel") || ""
    const offset = (page - 1) * limit

    const whereConditions = []
    const queryParams: any[] = []

    if (search) {
      whereConditions.push(
        `(vendor_name ILIKE $${queryParams.length + 1} OR vendor_id ILIKE $${queryParams.length + 1} OR contact_email ILIKE $${queryParams.length + 1})`,
      )
      queryParams.push(`%${search}%`)
    }

    if (status && status !== "all") {
      whereConditions.push(`status = $${queryParams.length + 1}`)
      queryParams.push(status)
    }

    if (riskLevel && riskLevel !== "all") {
      whereConditions.push(`risk_level = $${queryParams.length + 1}`)
      queryParams.push(riskLevel)
    }

    const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(" AND ")}` : ""

    // Get total count
    const countResult = await tenantDb`
      SELECT COUNT(*) as total
      FROM vendors
      ${whereConditions.length > 0 ? tenantDb`WHERE ${tenantDb.unsafe(whereConditions.join(" AND "))}` : tenantDb``}
    ` as Record<string, any>[]

    // Get vendors with pagination
    const vendors = await tenantDb`
      SELECT 
        id,
        vendor_id,
        vendor_name,
        vendor_type,
        contact_person,
        contact_email,
        contact_phone,
        address,
        city,
        state,
        country,
        postal_code,
        website,
        business_registration_number,
        tax_id,
        industry,
        services_provided,
        contract_start_date,
        contract_end_date,
        contract_value,
        currency,
        payment_terms,
        sla_requirements,
        data_processing_agreement,
        security_requirements,
        compliance_certifications,
        risk_level,
        last_assessment_date,
        next_assessment_date,
        status,
        notes,
        created_at,
        updated_at
      FROM vendors
      ${whereConditions.length > 0 ? tenantDb`WHERE ${tenantDb.unsafe(whereConditions.join(" AND "))}` : tenantDb``}
      ORDER BY created_at DESC
      LIMIT ${limit} OFFSET ${offset}
    `

    const total = Number.parseInt(countResult[0].total)
    const totalPages = Math.ceil(total / limit)

    return NextResponse.json({
      success: true,
      data: {
        vendors,
        pagination: {
          page,
          limit,
          total,
          totalPages,
        },
      },
    })
  } catch (error) {
    console.error("Error fetching vendors:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch vendors",
      },
      { status: 500 },
    )
  }
});

export const POST = withContext(async({ tenantDb }, request) => {
  try {
    const body = await request.json()

    // Generate vendor ID if not provided
    if (!body.vendor_id) {
      const currentYear = new Date().getFullYear()
      const countResult = await tenantDb`
        SELECT COUNT(*) as count 
        FROM vendors 
        WHERE vendor_id LIKE ${"VNC-" + currentYear + "-%"}
      ` as Record<string, any>[]
      const nextSequence = Number.parseInt(countResult[0].count) + 1
      body.vendor_id = `VNC-${currentYear}-${nextSequence.toString().padStart(4, "0")}`
    }

    const vendor = await tenantDb`
      INSERT INTO vendors (
        vendor_id,
        vendor_name,
        vendor_type,
        contact_person,
        contact_email,
        contact_phone,
        address,
        city,
        state,
        country,
        postal_code,
        website,
        business_registration_number,
        tax_id,
        industry,
        services_provided,
        contract_start_date,
        contract_end_date,
        contract_value,
        currency,
        payment_terms,
        sla_requirements,
        data_processing_agreement,
        security_requirements,
        compliance_certifications,
        risk_level,
        last_assessment_date,
        next_assessment_date,
        status,
        notes
      ) VALUES (
        ${body.vendor_id},
        ${body.vendor_name},
        ${body.vendor_type || null},
        ${body.contact_person || null},
        ${body.contact_email || null},
        ${body.contact_phone || null},
        ${body.address || null},
        ${body.city || null},
        ${body.state || null},
        ${body.country || null},
        ${body.postal_code || null},
        ${body.website || null},
        ${body.business_registration_number || null},
        ${body.tax_id || null},
        ${body.industry || null},
        ${body.services_provided || null},
        ${body.contract_start_date || null},
        ${body.contract_end_date || null},
        ${body.contract_value || null},
        ${body.currency || "USD"},
        ${body.payment_terms || null},
        ${body.sla_requirements || null},
        ${body.data_processing_agreement || false},
        ${body.security_requirements || null},
        ${JSON.stringify(body.compliance_certifications || [])},
        ${body.risk_level || "Medium"},
        ${body.last_assessment_date || null},
        ${body.next_assessment_date || null},
        ${body.status || "Active"},
        ${body.notes || null}
      ) RETURNING *
    ` as Record<string, any>[]

    return NextResponse.json({
      success: true,
      data: vendor[0],
    })
  } catch (error) {
    console.error("Error creating vendor:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to create vendor",
      },
      { status: 500 },
    )
  }
});
