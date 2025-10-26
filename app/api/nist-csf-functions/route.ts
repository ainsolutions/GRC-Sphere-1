import { type NextRequest, NextResponse } from "next/server"
import { withContext } from "@/lib/HttpContext"


export const GET = withContext(async({ tenantDb }, request) => {
  try {
    const functions = await tenantDb`
      SELECT 
        id,
        function_code,
        function_name,
        function_description,
        function_purpose,
        is_active,
        created_at
      FROM nist_csf_functions 
      WHERE is_active = true
      ORDER BY function_code
    `

    console.log("Query Result:", functions);

    return NextResponse.json({
      success: true,
      data: functions,
    })
  } catch (error) {
    console.error("Error fetching NIST CSF functions:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch NIST CSF functions",
        data: [],
      },
      { status: 500 },
    )
  }
});
