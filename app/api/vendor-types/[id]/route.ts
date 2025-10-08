import { type NextRequest, NextResponse } from "next/server"
import { withContext } from "@/lib/HttpContext"


export const GET = withContext(async({ tenantDb }, request, { params }: { params: { id: string } }) => {
  try {
    const [vendorType] = await tenantDb`
      SELECT * FROM vendor_types 
      WHERE id = ${Number.parseInt(params.id)}::INTEGER AND is_active = true
    ` as Record<string, any>[]

    if (!vendorType) {
      return NextResponse.json({ error: "Vendor type not found" }, { status: 404 })
    }

    return NextResponse.json(vendorType)
  } catch (error) {
    console.error("Error fetching vendor type:", error)
    return NextResponse.json({ error: "Failed to fetch vendor type" }, { status: 500 })
  }
});

export const PUT = withContext(async({ tenantDb }, request, { params }: { params: { id: string } }) => {
  try {
    const body = await request.json()
    const { name, description, color, icon, is_active } = body

    const [vendorType] = await tenantDb`
      UPDATE vendor_types 
      SET 
        name = ${name},
        description = ${description},
        color = ${color},
        icon = ${icon},
        is_active = ${is_active},
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ${Number.parseInt(params.id)}::INTEGER
      RETURNING *
    ` as Record<string, any>[]

    if (!vendorType) {
      return NextResponse.json({ error: "Vendor type not found" }, { status: 404 })
    }

    return NextResponse.json(vendorType)
  } catch (error) {
    console.error("Error updating vendor type:", error)
    return NextResponse.json({ error: "Failed to update vendor type" }, { status: 500 })
  }
});

export const DELETE = withContext(async({ tenantDb }, request, { params }: { params: { id: string } }) => {
  try {
    const [vendorType] = await tenantDb`
      UPDATE vendor_types 
      SET is_active = false, updated_at = CURRENT_TIMESTAMP
      WHERE id = ${Number.parseInt(params.id)}::INTEGER
      RETURNING *
    ` as Record<string, any>[]

    if (!vendorType) {
      return NextResponse.json({ error: "Vendor type not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "Vendor type deactivated successfully" })
  } catch (error) {
    console.error("Error deactivating vendor type:", error)
    return NextResponse.json({ error: "Failed to deactivate vendor type" }, { status: 500 })
  }
});
