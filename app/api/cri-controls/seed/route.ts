import { type NextRequest, NextResponse } from "next/server"
import { seedCRIControls } from "@/lib/actions/cyber-maturity-actions"
import { withContext } from "@/lib/HttpContext"

export const POST = withContext(async ({ tenantDb }, request: Request) => {
  try {
    const result = await seedCRIControls()

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: result.message
    })
  } catch (error: any) {
    console.error("Error seeding CRI controls:", error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
});
