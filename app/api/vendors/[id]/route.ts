import { type NextRequest, NextResponse } from "next/server"
import { withContext } from "@/lib/HttpContext"


export const GET = withContext(async({ tenantDb }, request, { params }: { params: { id: string } }) => {
  try {
    const vendorId = Number.parseInt(params.id)

    const vendor = await tenantDb`
      SELECT * FROM vendors WHERE id = ${vendorId}
    ` as Record<string, any>[]

    if (vendor.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Vendor not found",
        },
        { status: 404 },
      )
    }

    return NextResponse.json({
      success: true,
      data: vendor[0],
    })
  } catch (error) {
    console.error("Error fetching vendor:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch vendor",
      },
      { status: 500 },
    )
  }
});

export const PUT = withContext(async({ tenantDb }, request, context) => {
  try {
    const { id } = await context.params  // ✅ Await params
    const vendorId = Number.parseInt(id, 10)


    const body = await request.json()
    const vendor = await tenantDb`
      UPDATE vendors SET
        vendor_name = ${body.vendor_name},
        vendor_type = ${body.vendor_type || null},
        contact_person = ${body.contact_person || null},
        contact_email = ${body.contact_email || null},
        contact_phone = ${body.contact_phone || null},
        address = ${body.address || null},
        city = ${body.city || null},
        state = ${body.state || null},
        country = ${body.country || null},
        postal_code = ${body.postal_code || null},
        website = ${body.website || null},
        business_registration_number = ${body.business_registration_number || null},
        tax_id = ${body.tax_id || null},
        industry = ${body.industry || null},
        services_provided = ${body.services_provided || null},
        contract_start_date = ${body.contract_start_date || null},
        contract_end_date = ${body.contract_end_date || null},
        contract_value = ${body.contract_value || null},
        currency = ${body.currency || "USD"},
        payment_terms = ${body.payment_terms || null},
        sla_requirements = ${body.sla_requirements || null},
        data_processing_agreement = ${body.data_processing_agreement || false},
        security_requirements = ${body.security_requirements || null},
        compliance_certifications = ${JSON.stringify(body.compliance_certifications || [])},
        risk_level = ${body.risk_level || "Medium"},
        last_assessment_date = ${body.last_assessment_date || null},
        next_assessment_date = ${body.next_assessment_date || null},
        status = ${body.status || "Active"},
        notes = ${body.notes || null},
        updated_at = NOW()
      WHERE id = ${vendorId}
      RETURNING *
    ` as Record<string, any>[]

    if (vendor.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Vendor not found",
        },
        { status: 404 },
      )
    }

    return NextResponse.json({
      success: true,
      data: vendor[0],
    })
  } catch (error) {
    console.error("Error updating vendor:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to update vendor",
      },
      { status: 500 },
    )
  }
});

export const DELETE = withContext(async({ tenantDb }, request, context) => {
  try {
    const { id } = context.params
    const vendorId = Number.parseInt(id, 10)

    const vendor = await tenantDb`
      DELETE FROM vendors WHERE id = ${vendorId} RETURNING vendor_id, vendor_name
    ` as Record<string, any>[]

    if (vendor.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Vendor not found",
        },
        { status: 404 },
      )
    }

    return NextResponse.json({
      success: true,
      data: {
        message: "Vendor deleted successfully",
        deleted_vendor: vendor[0],
      },
    })
  } catch (error) {
    console.error("Error deleting vendor:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to delete vendor",
      },
      { status: 500 },
    )
  }
});
