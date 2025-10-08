import { type NextRequest, NextResponse } from "next/server"
import { withContext } from "@/lib/HttpContext"
import { getDatabase } from "@/lib/database"



export const GET = withContext( async ({ tenantDb },request, { params }: { params: { id: string } }) =>{
  try {
    const id = params.id
    console.log("Fetching asset with ID:", id)

    const result = await tenantDb`
      SELECT 
        id,
        asset_id,
        asset_name,
        asset_type,
        classification,
        owner,
        location,
        description,
        created_at,
        updated_at
      FROM assets
      WHERE id = ${id}
    `

    if (!Array.isArray(result) || result.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Asset not found",
        },
        { status: 404 },
      )
    }

    console.log("Found asset:", result[0])

    return NextResponse.json({
      success: true,
      asset: result[0],
    })
  } catch (error) {
    console.error("Error fetching asset:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch asset",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
})

export const PUT = withContext( async ({ tenantDb },request, { params }: { params: { id: string } }) =>  {
  try {
    const { id } = await params;
    const body = await request.json()
    console.log("Updating asset with ID:", id, "Data:", body)

    // Validate required fields
    if (!body.asset_name || !body.asset_type || !body.owner) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing required fields: asset_name, asset_type, owner",
        },
        { status: 400 },
      )
    }
    
    const result = await tenantDb`
      UPDATE assets SET
        asset_name = ${body.asset_name},
        asset_type = ${body.asset_type},
        classification = ${body.classification || "Internal"},
        owner = ${body.owner},
        location = ${body.location || ""},
        description = ${body.description || ""},
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ${id}
      RETURNING *
    `

    if (!Array.isArray(result) || result.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Asset not found",
        },
        { status: 404 },
      )
    }

    console.log("Asset updated successfully:", result[0])

    return NextResponse.json({
      success: true,
      asset: result[0],
      message: "Asset updated successfully",
    })
  } catch (error) {
    console.error("Error updating asset:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to update asset",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
})

export const DELETE = withContext( async ({ tenantDb },request, { params }: { params: { id: string } }) => {
  try {
    const { id } = await params
    console.log("Deleting asset with ID:", id)

    const result = (await tenantDb`
      DELETE FROM assets 
      WHERE id = ${id}
      RETURNING *
    `) as Record<string, any>[];

    if (result.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Asset not found",
        },
        { status: 404 },
      )
    }

    console.log("Asset deleted successfully:", result[0])

    return NextResponse.json({
      success: true,
      message: "Asset deleted successfully",
    })
  } catch (error) {
    console.error("Error deleting asset:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to delete asset",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
})
