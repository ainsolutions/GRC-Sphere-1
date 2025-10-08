import { type NextRequest, NextResponse } from "next/server"
import { withContext } from "@/lib/HttpContext"


export const GET = withContext(async ({ tenantDb }, request: Request) => {
  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get("search")
    const contract_status = searchParams.get("contract_status")
    const contract_type = searchParams.get("contract_type")
    const vendor_id = searchParams.get("vendor_id")
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "50")
    const offset = (page - 1) * limit

    // Build WHERE conditions
    let whereClause = ""
    const conditions = []

    if (search) {
      conditions.push(`(
        c.contract_name ILIKE '%${search}%' OR 
        v.vendor_name ILIKE '%${search}%' OR
        c.description ILIKE '%${search}%'
      )`)
    }

    if (contract_status && contract_status !== "All Statuses") {
      conditions.push(`c.contract_status = '${contract_status}'`)
    }

    if (contract_type && contract_type !== "All Types") {
      conditions.push(`c.contract_type = '${contract_type}'`)
    }

    if (vendor_id) {
      conditions.push(`c.vendor_id = ${vendor_id}`)
    }

    if (conditions.length > 0) {
      whereClause = `WHERE ${conditions.join(" AND ")}`
    }

    // Get total count for pagination
    const countResult = await tenantDb`
      SELECT COUNT(*) as total
      FROM contracts c
      LEFT JOIN vendors v ON c.vendor_id = v.id
      ${tenantDb.unsafe(whereClause)}
    ` as Record<string, any>[]
    const totalCount = Number.parseInt(countResult[0].total)

    // Get contracts with vendor information
    const contracts = await tenantDb`
      SELECT 
        c.id,
        c.contract_name,
        c.contract_number,
        c.contract_type,
        c.vendor_id,
        c.vendor_name,
        c.contract_value,
        c.currency,
        c.start_date,
        c.end_date,
        c.renewal_date,
        c.contract_status,
        c.payment_terms,
        c.sla_requirements,
        c.compliance_requirements,
        c.description,
        c.created_at,
        c.updated_at,
        CASE 
          WHEN c.end_date <= CURRENT_DATE THEN 'Expired'
          WHEN c.end_date <= CURRENT_DATE + INTERVAL '30 days' THEN 'Expiring Soon'
          WHEN c.end_date <= CURRENT_DATE + INTERVAL '90 days' THEN 'Due for Review'
          ELSE 'Active'
        END as health_status
      FROM contracts c
      LEFT JOIN vendors v ON c.vendor_id = v.id
      ${tenantDb.unsafe(whereClause)}
      ORDER BY c.contract_name ASC
      LIMIT ${limit} OFFSET ${offset}
    `

    return NextResponse.json({
      success: true,
      contracts,
      pagination: {
        page,
        limit,
        total: totalCount,
        totalPages: Math.ceil(totalCount / limit),
      },
    })
  } catch (error) {
    console.error("Error fetching contracts:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch contracts",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
})

export const POST = withContext(async ({ tenantDb }, request: Request) => {
  try {
    const body = await request.json()
    console.log("Creating contract with data:", body)

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

    // Validate optional fields
    if (contract_value && (typeof contract_value !== "number" || contract_value < 0)) {
      return NextResponse.json({ success: false, error: "Contract value must be a positive number" }, { status: 400 })
    }

    if (start_date && !isValidDate(start_date)) {
      return NextResponse.json({ success: false, error: "Invalid start date format" }, { status: 400 })
    }

    if (end_date && !isValidDate(end_date)) {
      return NextResponse.json({ success: false, error: "Invalid end date format" }, { status: 400 })
    }

    if (renewal_date && !isValidDate(renewal_date)) {
      return NextResponse.json({ success: false, error: "Invalid renewal date format" }, { status: 400 })
    }

    // Validate contract status
    const validStatuses = ["Draft", "Active", "Expired", "Terminated", "Under Review"]
    if (contract_status && !validStatuses.includes(contract_status)) {
      return NextResponse.json({ success: false, error: "Invalid contract status" }, { status: 400 })
    }

    // Fetch vendor information to get vendor_name
    const vendorResult = await tenantDb`
      SELECT id, vendor_name FROM vendors WHERE id = ${Number(vendor_id)}
    ` as Record<string, any>[]

    if (vendorResult.length === 0) {
      return NextResponse.json({ success: false, error: "Vendor not found" }, { status: 400 })
    }

    const vendor_name = vendorResult[0].vendor_name

    let finalContractNumber = contract_number?.trim() || null

    if (!finalContractNumber) {
      // Auto-generate contract number with format: CONT-YYYY-NNNN
      const year = new Date().getFullYear()
      const prefix = `CONT-${year}-`

      // Find the highest existing contract number for this year
      const existingNumbers = await tenantDb`
        SELECT contract_number 
        FROM contracts 
        WHERE contract_number LIKE ${prefix + "%"}
        ORDER BY contract_number DESC
        LIMIT 1
      ` as Record<string, any>[]

      let nextNumber = 1
      if (existingNumbers.length > 0) {
        const lastNumber = existingNumbers[0].contract_number
        const numberPart = lastNumber.split("-")[2]
        nextNumber = Number.parseInt(numberPart) + 1
      }

      finalContractNumber = `${prefix}${nextNumber.toString().padStart(4, "0")}`
    } else {
      // Check if provided contract number already exists
      const existingContract = await tenantDb`
        SELECT id FROM contracts WHERE contract_number = ${finalContractNumber}
      ` as Record<string, any>[]

      if (existingContract.length > 0) {
        return NextResponse.json(
          {
            success: false,
            error: `Contract number '${finalContractNumber}' already exists. Please use a different contract number.`,
          },
          { status: 400 },
        )
      }
    }

    const convertToArray = (value: string | null | undefined): string[] => {
      if (!value || typeof value !== "string") return []
      // Split by common delimiters and clean up
      return value
        .split(/[,;\n]/)
        .map((item) => item.trim())
        .filter((item) => item.length > 0)
    }

    // Prepare data for insertion - handle array fields properly
    const contractData = {
      contract_name: contract_name.trim(),
      contract_number: finalContractNumber, // Use the generated or validated contract number
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
      compliance_requirements: convertToArray(compliance_requirements),
      description: description?.trim() || null,
    }

    console.log("Prepared contract data:", contractData)

    // Insert contract
    const result = await tenantDb`
      INSERT INTO contracts (
        contract_name, contract_number, contract_type, vendor_id, vendor_name, 
        contract_value, currency, start_date, end_date, renewal_date, 
        contract_status, payment_terms, sla_requirements, compliance_requirements, description
      ) VALUES (
        ${contractData.contract_name}, 
        ${contractData.contract_number}, 
        ${contractData.contract_type}, 
        ${contractData.vendor_id},
        ${contractData.vendor_name}, 
        ${contractData.contract_value}, 
        ${contractData.currency},
        ${contractData.start_date},
        ${contractData.end_date}, 
        ${contractData.renewal_date}, 
        ${contractData.contract_status}, 
        ${contractData.payment_terms}, 
        ${contractData.sla_requirements}, 
        ${contractData.compliance_requirements}, 
        ${contractData.description}
      )
      RETURNING *
    ` as Record<string, any>[]

    console.log("Contract created successfully:", result[0])

    return NextResponse.json({
      success: true,
      contract: result[0],
      message: "Contract created successfully",
    })
  } catch (error) {
    console.error("Error creating contract:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to create contract",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
})

// Helper function to validate dates
function isValidDate(date: string): boolean {
  if (!date) return false
  const parsed = Date.parse(date)
  return !isNaN(parsed)
}
// function isValidDate(start_date: any) {
//   throw new Error("Function not implemented.")
// }

