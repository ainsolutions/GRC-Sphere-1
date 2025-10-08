import { type NextRequest, NextResponse } from "next/server"
import { withContext } from "@/lib/HttpContext"


export const GET = withContext(async({ tenantDb }, request) => {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get("category")

    let whereClause = ""
    if (category && category !== "all") {
      whereClause = `WHERE category = '${category}'`
    }

    const configs = await tenantDb`
      SELECT 
        id,
        key,
        value,
        category,
        description,
        data_type,
        is_sensitive,
        created_at,
        updated_at
      FROM system_config
      ${whereClause ? tenantDb.unsafe(whereClause) : tenantDb``}
      ORDER BY category, key
    ` as Record<string, any>[]

    // Mask sensitive values
    const maskedConfigs = configs.map((config) => ({
      ...config,
      value: config.is_sensitive ? "••••••••" : config.value,
    }))

    return NextResponse.json({
      data: maskedConfigs,
      total: maskedConfigs.length,
    })
  } catch (error) {
    console.error("System config fetch error:", error)
    return NextResponse.json(
      {
        error: "Failed to fetch system configuration",
        data: [],
        total: 0,
      },
      { status: 500 },
    )
  }
});

export const POST = withContext(async({ tenantDb }, request) => {
  try {
    const body = await request.json()
    const { key, value, category, description, data_type, is_sensitive } = body

    const result = await tenantDb`
      INSERT INTO system_config (key, value, category, description, data_type, is_sensitive)
      VALUES (${key}, ${value}, ${category}, ${description || ""}, ${data_type || "string"}, ${is_sensitive || false})
      RETURNING id
    ` as Record<string, any>[]

    return NextResponse.json({ success: true, id: result[0].id })
  } catch (error) {
    console.error("System config creation error:", error)
    return NextResponse.json({ error: "Failed to create configuration" }, { status: 500 })
  }
});

export const PUT = withContext(async({ tenantDb }, request) => {
  try {
    const body = await request.json()
    const { id, key, value, category, description, data_type, is_sensitive } = body

    await tenantDb`
      UPDATE system_config 
      SET 
        key = ${key},
        value = ${value},
        category = ${category},
        description = ${description || ""},
        data_type = ${data_type || "string"},
        is_sensitive = ${is_sensitive || false},
        updated_at = NOW()
      WHERE id = ${id}
    `

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("System config update error:", error)
    return NextResponse.json({ error: "Failed to update configuration" }, { status: 500 })
  }
});

export const DELETE = withContext(async({ tenantDb }, request) => {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json({ error: "Configuration ID is required" }, { status: 400 })
    }

    await tenantDb`
      DELETE FROM system_config 
      WHERE id = ${id}
    `

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("System config deletion error:", error)
    return NextResponse.json({ error: "Failed to delete configuration" }, { status: 500 })
  }
});
