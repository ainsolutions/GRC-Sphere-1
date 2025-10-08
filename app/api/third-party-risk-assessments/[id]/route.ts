import { type NextRequest, NextResponse } from "next/server"
import { withContext } from "@/lib/HttpContext"


export const GET = withContext(async({ tenantDb }, request, { params }: { params: { id: string } }) => {
  try {
    const assessmentId = Number.parseInt(params.id)

    if (isNaN(assessmentId)) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid assessment ID",
        },
        { status: 400 },
      )
    }

    const result = await tenantDb`
      SELECT 
        a.id,
        a.assessment_name,
        a.vendor_id,
        v.vendor_name,
        a.assessment_type,
        a.assessment_status,
        a.overall_risk_score,
        a.data_security_score,
        a.operational_risk_score,
        a.financial_stability_score,
        a.compliance_score,
        a.assessment_date,
        a.next_review_date,
        a.assessor_name,
        a.description,
        a.created_at,
        a.updated_at
      FROM third_party_risk_assessments a
      LEFT JOIN vendors v ON a.vendor_id = v.id
      WHERE a.id = ${assessmentId}
    ` as Record<string, any>[]

    if (result.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Third-party risk assessment not found",
        },
        { status: 404 },
      )
    }

    return NextResponse.json({
      success: true,
      assessment: result[0],
    })
  } catch (error) {
    console.error("Error fetching third-party risk assessment:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch third-party risk assessment",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
});

export const PUT = withContext(async({ tenantDb }, request, { params }: { params: { id: string } }) => {
  try {
    const assessmentId = Number.parseInt(params.id)

    if (isNaN(assessmentId)) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid assessment ID",
        },
        { status: 400 },
      )
    }

    const body = await request.json()
    console.log("Updating third-party risk assessment with data:", body)

    const {
      assessment_name,
      vendor_id,
      assessment_type,
      assessment_status,
      overall_risk_score,
      data_security_score,
      operational_risk_score,
      financial_stability_score,
      compliance_score,
      assessment_date,
      next_review_date,
      assessor_name,
      description,
    } = body

    // Validate required fields
    if (!assessment_name || !vendor_id || !assessment_type) {
      return NextResponse.json(
        {
          success: false,
          error: "Assessment name, vendor, and type are required",
        },
        { status: 400 },
      )
    }

    // Validate vendor exists
    const vendorExists = await tenantDb`
      SELECT id FROM vendors WHERE id = ${vendor_id}
    ` as Record<string, any>[]

    if (vendorExists.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Vendor not found",
        },
        { status: 400 },
      )
    }

    // Validate assessment status
    const validStatuses = ["Draft", "In Progress", "Completed", "Under Review", "Approved"]
    if (assessment_status && !validStatuses.includes(assessment_status)) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid assessment status",
        },
        { status: 400 },
      )
    }

    const result = await tenantDb`
      UPDATE third_party_risk_assessments SET
        assessment_name = ${assessment_name},
        vendor_id = ${vendor_id},
        assessment_type = ${assessment_type},
        assessment_status = ${assessment_status},
        overall_risk_score = ${overall_risk_score || null},
        data_security_score = ${data_security_score || null},
        operational_risk_score = ${operational_risk_score || null},
        financial_stability_score = ${financial_stability_score || null},
        compliance_score = ${compliance_score || null},
        assessment_date = ${assessment_date || null},
        next_review_date = ${next_review_date || null},
        assessor_name = ${assessor_name || null},
        description = ${description || null},
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ${assessmentId}
      RETURNING *
    ` as Record<string, any>[]

    if (result.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Third-party risk assessment not found",
        },
        { status: 404 },
      )
    }

    return NextResponse.json({
      success: true,
      assessment: result[0],
      message: "Third-party risk assessment updated successfully",
    })
  } catch (error) {
    console.error("Error updating third-party risk assessment:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to update third-party risk assessment",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
});

export const DELETE = withContext(async({ tenantDb }, request, { params }: { params: { id: string } }) => {
  try {
    const assessmentId = Number.parseInt(params.id)

    if (isNaN(assessmentId)) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid assessment ID",
        },
        { status: 400 },
      )
    }

    // Check if assessment exists
    const existingAssessment = await tenantDb`
      SELECT id, assessment_name FROM third_party_risk_assessments WHERE id = ${assessmentId}
    ` as Record<string, any>[]

    if (existingAssessment.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Third-party risk assessment not found",
        },
        { status: 404 },
      )
    }

    // Delete the assessment
    await tenantDb`
      DELETE FROM third_party_risk_assessments WHERE id = ${assessmentId}
    `

    console.log(
      `Third-party risk assessment ${existingAssessment[0].assessment_name} (ID: ${assessmentId}) deleted successfully`,
    )

    return NextResponse.json({
      success: true,
      message: "Third-party risk assessment deleted successfully",
    })
  } catch (error) {
    console.error("Error deleting third-party risk assessment:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to delete third-party risk assessment",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
});
