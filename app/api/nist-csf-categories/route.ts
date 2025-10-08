import { type NextRequest, NextResponse } from "next/server"
import { withContext } from "@/lib/HttpContext"


export const GET = withContext(async({ tenantDb }, request) => {
  try {
    const { searchParams } = new URL(request.url)
    const functionId = searchParams.get("functionId")

    let categories
    if (functionId) {
      categories = await tenantDb`
        SELECT 
          c.id,
          c.category_code,
          c.category_name,
          c.category_description,
          c.function_id,
          c.is_active,
          c.created_at,
          f.function_code,
          f.function_name
        FROM nist_csf_categories c
        LEFT JOIN nist_csf_functions f ON c.function_id = f.id
        WHERE c.function_id = ${functionId} AND c.is_active = true
        ORDER BY c.category_code
      `
    } else {
      categories = await tenantDb`
        SELECT 
          c.id,
          c.category_code,
          c.category_name,
          c.category_description,
          c.function_id,
          c.is_active,
          c.created_at,
          f.function_code,
          f.function_name
        FROM nist_csf_categories c
        LEFT JOIN nist_csf_functions f ON c.function_id = f.id
        WHERE c.is_active = true
        ORDER BY c.category_code
      `
    }

    return NextResponse.json({
      success: true,
      data: categories,
    })
  } catch (error) {
    console.error("Error fetching NIST CSF categories:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch NIST CSF categories",
        data: [],
      },
      { status: 500 },
    )
  }
});
