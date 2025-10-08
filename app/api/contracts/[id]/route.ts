import { type NextRequest, NextResponse } from "next/server"
import { withContext } from "@/lib/HttpContext"
import { getDatabase } from "@/lib/database"
import { te } from "date-fns/locale";

const sql = getDatabase()

export const GET = withContext(async ({ tenantDb }, request: Request, { params }: { params: { id: string } }) => {
  try {
    const contractId = Number.parseInt(params.id)

    if (isNaN(contractId)) {
      return NextResponse.json({ success: false, error: "Invalid contract ID" }, { status: 400 })
    }

    const result = await tenantDb`
      SELECT 
        c.*,
        v.vendor_name as vendor_full_name,
        v.vendor_type,
        v.contact_person,
        v.contact_email
      FROM contracts c
      LEFT JOIN vendors v ON c.vendor_id = v.id
      WHERE c.id = ${contractId}
    ` as Record<string, any>[]

    if (result.length === 0) {
      return NextResponse.json({ success: false, error: "Contract not found" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      contract: result[0],
    })
  } catch (error) {
    console.error("Error fetching contract:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch contract",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
});

export const PUT = withContext(async ({ tenantDb }, request: Request, { params }: { params: { id: string } }) => {
  try {
    const contractId = Number.parseInt(params.id)

    if (isNaN(contractId)) {
      return NextResponse.json({ success: false, error: "Invalid contract ID" }, { status: 400 })
    }

    const body = await request.json()
    console.log("Updating contract with data:", body)

    const {
      contract_name,
      contract_number,
      contract_type,
      vendor_id,
      contract_value,
      currency,
      start_date,
      end_date,
      renewal_date,
      contract_status,
      payment_terms,
      sla_requirements,
      compliance_requirements,
      description,
    } = body

    // Validate required fields
    if (!contract_name || typeof contract_name !== "string" || contract_name.trim().length === 0) {
      return NextResponse.json(
        { success: false, error: "Contract name is required and must be a non-empty string" },
        { status: 400 },
      )
    }

    if (!contract_type || typeof contract_type !== "string" || contract_type.trim().length === 0) {
      return NextResponse.json(
        { success: false, error: "Contract type is required and must be a non-empty string" },
        { status: 400 },
      )
    }

    if (!vendor_id || isNaN(Number(vendor_id))) {
      return NextResponse.json({ success: false, error: "Vendor ID is required and must be a number" }, { status: 400 })
    }

    // Check if contract exists
    const existingContract = await tenantDb`
      SELECT id FROM contracts WHERE id = ${contractId}
    ` as Record<string, any>[]

    if (existingContract.length === 0) {
      return NextResponse.json({ success: false, error: "Contract not found" }, { status: 404 })
    }

    // Fetch vendor information to get vendor_name
    const vendorResult = await tenantDb`
      SELECT id, vendor_name FROM vendors WHERE id = ${Number(vendor_id)}
    ` as Record<string, any>[]

    if (vendorResult.length === 0) {
      return NextResponse.json({ success: false, error: "Vendor not found" }, { status: 400 })
    }

    const vendor_name = vendorResult[0].vendor_name

    // Prepare data for update
    const contractData = {
      contract_name: contract_name.trim(),
      contract_number: contract_number?.trim() || null,
      contract_type: contract_type.trim(),
      vendor_id: Number(vendor_id),
      vendor_name: vendor_name,
      contract_value: contract_value || null,
      currency: currency || "USD",
      start_date: start_date || null,
      end_date: end_date || null,
      renewal_date: renewal_date || null,
      contract_status: contract_status || "Draft",
      payment_terms: payment_terms?.trim() || null,
      sla_requirements: sla_requirements?.trim() || null,
      compliance_requirements: compliance_requirements?.trim() || null,
      description: description?.trim() || null,
    }

    // Update contract
    const result = await tenantDb`
      UPDATE contracts SET
        contract_name = ${contractData.contract_name},
        contract_number = ${contractData.contract_number},
        contract_type = ${contractData.contract_type},
        vendor_id = ${contractData.vendor_id},
        vendor_name = ${contractData.vendor_name},
        contract_value = ${contractData.contract_value},
        currency = ${contractData.currency},
        start_date = ${contractData.start_date},
        end_date = ${contractData.end_date},
        renewal_date = ${contractData.renewal_date},
        contract_status = ${contractData.contract_status},
        payment_terms = ${contractData.payment_terms},
        sla_requirements = ${contractData.sla_requirements},
        compliance_requirements = ${contractData.compliance_requirements},
        description = ${contractData.description},
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ${contractId}
      RETURNING *
    ` as Record<string, any>[]

    return NextResponse.json({
      success: true,
      contract: result[0],
      message: "Contract updated successfully",
    })
  } catch (error) {
    console.error("Error updating contract:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to update contract",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
});

export const DELETE = withContext(async ({ tenantDb }, request: Request, { params }: { params: { id: string } }) =>  {
  try {
    const contractId = Number.parseInt(params.id)

    if (isNaN(contractId)) {
      return NextResponse.json({ success: false, error: "Invalid contract ID" }, { status: 400 })
    }

    // Check if contract exists
    const existingContract = await tenantDb`
      SELECT id FROM contracts WHERE id = ${contractId}
    ` as Record<string, any>[]

    if (existingContract.length === 0) {
      return NextResponse.json({ success: false, error: "Contract not found" }, { status: 404 })
    }

    // Delete contract
    await tenantDb`
      DELETE FROM contracts WHERE id = ${contractId}
    `

    return NextResponse.json({
      success: true,
      message: "Contract deleted successfully",
    })
  } catch (error) {
    console.error("Error deleting contract:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to delete contract",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
});
