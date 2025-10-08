import { NextResponse } from "next/server";
import { withContext } from "@/lib/HttpContext";

export const GET = withContext(async ({ tenantDb }, request) => {
    try {
    const { searchParams } = new URL(request.url)
    const categoryId = searchParams.get("categoryId")

    let subcategories

    
    if (categoryId) {
      subcategories = await tenantDb`
        SELECT 
          s.id,
          s.subcategory_code,
          s.subcategory_name,
          s.subcategory_description,
          s.category_id,
          s.implementation_guidance,
          s.is_active,
          s.created_at,
          c.category_code,
          c.category_name,
          f.function_code,
          f.function_name
        FROM nist_csf_subcategories s
        LEFT JOIN nist_csf_categories c ON s.category_id = c.id
        LEFT JOIN nist_csf_functions f ON c.function_id = f.id
        WHERE s.category_id = ${categoryId} AND s.is_active = true
        ORDER BY s.subcategory_code
      `
    } else {
      subcategories = await tenantDb`
        SELECT 
          s.id,
          s.subcategory_code,
          s.subcategory_name,
          s.subcategory_description,
          s.category_id,
          s.implementation_guidance,
          s.is_active,
          s.created_at,
          c.category_code,
          c.category_name,
          f.function_code,
          f.function_name
        FROM nist_csf_subcategories s
        LEFT JOIN nist_csf_categories c ON s.category_id = c.id
        LEFT JOIN nist_csf_functions f ON c.function_id = f.id
        WHERE s.is_active = true
        ORDER BY s.subcategory_code
      `
    }

    return NextResponse.json({
      success: true,
      data: subcategories,
    })
  } catch (error) {
    console.error("Error fetching NIST CSF subcategories:", error)
    return NextResponse.json({
      success: false,
      error: "Failed to fetch NIST CSF subcategories",
      data: [],
    })
  }
});