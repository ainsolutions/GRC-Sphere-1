import { type NextRequest, NextResponse } from "next/server"
import { withContext } from "@/lib/HttpContext"


export const GET = withContext(async({ tenantDb }, request) => {
  try {
    const vendorTypes = await tenantDb`
      SELECT 
        vt.*,
        COUNT(vtrc.id) as template_count
      FROM vendor_types vt
      LEFT JOIN vendor_type_risk_templates vtrc ON vt.id = vtrc.vendor_type_id
      WHERE vt.is_active = true
      GROUP BY vt.id
      ORDER BY vt.name
    `

    return NextResponse.json(vendorTypes)
  } catch (error) {
    console.error("Error fetching vendor types:", error)
    return NextResponse.json({ error: "Failed to fetch vendor types" }, { status: 500 })
  }
});

export const POST = withContext(async({ tenantDb }, request) => {
  try {
    const body = await request.json()
    const { name, description, color, icon } = body

    if (!name) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 })
    }

    const [vendorType] = await tenantDb`
      INSERT INTO vendor_types (name, description, color, icon)
      VALUES (${name}, ${description || null}, ${color || "#3B82F6"}, ${icon || "Building2"})
      RETURNING *
    ` as Record<string, any>[]

    return NextResponse.json(vendorType, { status: 201 })
  } catch (error) {
    console.error("Error creating vendor type:", error)
    return NextResponse.json({ error: "Failed to create vendor type" }, { status: 500 })
  }
});
