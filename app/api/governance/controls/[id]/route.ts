import { NextRequest, NextResponse } from "next/server"
import { withContext, HttpSessionContext } from "@/lib/HttpContext"

export const GET = withContext(async({tenantDb}: HttpSessionContext,request, { params }: { params: { id: string } }) =>{
  try {
    if (!tenantDb) {
      return NextResponse.json(
        { success: false, error: "Database not configured" },
        { status: 500 }
      )
    }
    const { id } = params

    const result = await tenantDb`
      SELECT
        id,
        name,
        description,
        control_id,
        framework,
        category,
        subcategory,
        control_type,
        implementation_status,
        effectiveness_rating,
        maturity_level,
        owner,
        department,
        responsible_party,
        implementation_date,
        last_assessment_date,
        next_assessment_date,
        assessment_frequency,
        test_results,
        evidence_location,
        related_risks,
        related_assets,
        dependencies,
        cost_estimate,
        maintenance_cost,
        automation_level,
        monitoring_frequency,
        reporting_frequency,
        compliance_requirements,
        applicable_regulations,
        control_measures,
        exceptions,
        remediation_plan,
        notes,
        created_at,
        updated_at,
        created_by,
        updated_by
      FROM governance_controls
      WHERE id = ${id}
    `

    const resultArray = Array.isArray(result) ? result : [result];
    if (resultArray.length === 0) {
      return NextResponse.json(
        { success: false, error: "Control not found" },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: resultArray[0]
    })
  } catch (error) {
    console.error("Error fetching control:", error)
    return NextResponse.json(
      { success: false, error: "Failed to fetch control" },
      { status: 500 }
    )
  }
});

export const PUT = withContext(async ({ tenantDb }: HttpSessionContext, request, routeContextPromise) => {
  try {
    if (!tenantDb) {
      return NextResponse.json(
        { success: false, error: "Database not configured" },
        { status: 500 }
      );
    }

    const { params } = await routeContextPromise; // ✅ Await params
    const { id } = params;

    const body = await request.json();

    const {
      name,
      description,
      control_id,
      framework,
      category,
      subcategory,
      control_type,
      implementation_status,
      effectiveness_rating,
      maturity_level,
      owner,
      department,
      responsible_party,
      implementation_date,
      last_assessment_date,
      next_assessment_date,
      assessment_frequency,
      test_results,
      evidence_location,
      related_risks,
      related_assets,
      dependencies,
      cost_estimate,
      maintenance_cost,
      automation_level,
      monitoring_frequency,
      reporting_frequency,
      compliance_requirements,
      applicable_regulations,
      control_measures,
      exceptions,
      remediation_plan,
      notes,
      updated_by,
    } = body;

    if (!name || !control_id || !framework || !category || !owner) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    const toPgArray = (arr: any) =>
      Array.isArray(arr) && arr.length > 0
        ? `{${arr.map((v) => `"${String(v).replace(/"/g, '\\"')}"`).join(",")}}`
        : "{}";

    const toNullableDate = (value: any) =>
      !value || value === "" || value === "null" ? null : value;

    const result = await tenantDb`
      UPDATE governance_controls SET
        name = ${name},
        description = ${description},
        control_id = ${control_id},
        framework = ${framework},
        category = ${category},
        subcategory = ${subcategory},
        control_type = ${control_type},
        implementation_status = ${implementation_status},
        effectiveness_rating = ${effectiveness_rating},
        maturity_level = ${maturity_level},
        owner = ${owner},
        department = ${department},
        responsible_party = ${responsible_party},
        implementation_date = ${toNullableDate(implementation_date)},
        last_assessment_date = ${toNullableDate(last_assessment_date)},
        next_assessment_date = ${toNullableDate(next_assessment_date)},
        assessment_frequency = ${assessment_frequency},
        test_results = ${JSON.stringify(test_results)},
        evidence_location = ${evidence_location},
        related_risks = ${toPgArray(related_risks)},
        related_assets = ${toPgArray(related_assets)},
        dependencies = ${toPgArray(dependencies)},
        cost_estimate = ${cost_estimate},
        maintenance_cost = ${maintenance_cost},
        automation_level = ${automation_level},
        monitoring_frequency = ${monitoring_frequency},
        reporting_frequency = ${reporting_frequency},
        compliance_requirements = ${toPgArray(compliance_requirements)},
        applicable_regulations = ${toPgArray(applicable_regulations)},
        control_measures = ${toPgArray(control_measures)},
        exceptions = ${exceptions},
        remediation_plan = ${remediation_plan},
        notes = ${notes},
        updated_by = ${updated_by},
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ${id}
      RETURNING *;
    `;

    const resultArray = Array.isArray(result) ? result : [result];
    if (resultArray.length === 0) {
      return NextResponse.json(
        { success: false, error: "Control not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: resultArray[0],
      message: "Control updated successfully",
    });
  } catch (error: any) {
    console.error("Error updating control:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to update control" },
      { status: 500 }
    );
  }
});


export const DELETE = withContext(async({tenantDb}: HttpSessionContext, request, { params }: { params: { id: string } }) => {
  try {
    if (!tenantDb) {
      return NextResponse.json(
        { success: false, error: "Database not configured" },
        { status: 500 }
      )
    }
    const { id } = params

    const result = await tenantDb`
      DELETE FROM governance_controls
      WHERE id = ${id}
      RETURNING *
    `

    const resultArray = Array.isArray(result) ? result : [result];
    if (resultArray.length === 0) {
      return NextResponse.json(
        { success: false, error: "Control not found" },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      message: "Control deleted successfully"
    })
  } catch (error) {
    console.error("Error deleting control:", error)
    return NextResponse.json(
      { success: false, error: "Failed to delete control" },
      { status: 500 }
    )
  }
});
