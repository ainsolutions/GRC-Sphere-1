import { type NextRequest, NextResponse } from "next/server";
import { withContext } from "@/lib/HttpContext";


// Input validation helper
function validateInput(value: any, fieldName: string): boolean {
  if (value === null || value === undefined || value === '') {
    return false;
  }
  // Basic XSS prevention
  if (typeof value === 'string' && value.includes('<script>')) {
    return false;
  }
  // Specific field validations
  if (fieldName === 'effectiveness_rating') {
    const num = Number(value);
    return !isNaN(num) && num >= 0 && num <= 10; // Assuming 0-10 scale
  }
  if (fieldName === 'implementation_cost') {
    const num = Number(value);
    return !isNaN(num) && num >= 0;
  }
  if (fieldName === 'control_type' || fieldName === 'control_category' || fieldName === 'implementation_status') {
    return typeof value === 'string' && value.length <= 50;
  }
  return true;
}

export const GET = withContext(async({ tenantDb }, request, { params }: { params: { id: string } }) => {
  try {
    const { id } = params;

    // Validate ID
    if (!validateInput(id, 'id') || isNaN(Number(id))) {
      return NextResponse.json({ error: "Invalid control ID" }, { status: 400 });
    }

    // Use parameterized query
    const result = await tenantDb`
      SELECT tc.*, tp.plan_id as treatment_plan_id_display, tp.treatment_type,
             ir.risk_id as iso_risk_id, ir.title as risk_title
      FROM iso27001_treatment_controls tc
      LEFT JOIN iso27001_treatment_plans tp ON tc.treatment_plan_id = tp.id
      LEFT JOIN iso27001_risks ir ON tp.iso27001_risk_id = ir.id
      WHERE tc.id = ${id}
    `as Record <string, any>[];

    if (!result || result.length === 0) {
      return NextResponse.json({ error: "Treatment control not found" }, { status: 404 });
    }

    const serializedResult = {
      ...result[0],
      created_at: result[0].created_at ? new Date(result[0].created_at).toISOString() : null,
      updated_at: result[0].updated_at ? new Date(result[0].updated_at).toISOString() : null,
      implementation_date: result[0].implementation_date ? new Date(result[0].implementation_date).toISOString() : null,
      testing_date: result[0].testing_date ? new Date(result[0].testing_date).toISOString() : null,
      next_review_date: result[0].next_review_date ? new Date(result[0].next_review_date).toISOString() : null,
      due_date: result[0].due_date ? new Date(result[0].due_date).toISOString() : null,
      completion_date: result[0].completion_date ? new Date(result[0].completion_date).toISOString() : null,
      effectiveness_rating: Number(result[0].effectiveness_rating) || 0,
      implementation_cost: Number(result[0].implementation_cost) || 0,
      compliance_frameworks: Array.isArray(result[0].compliance_frameworks) ? result[0].compliance_frameworks : [],
    };

    return NextResponse.json(serializedResult);
  } catch (error: any) {
    console.error("Error fetching treatment control:", error);
    return NextResponse.json(
      { error: "Failed to fetch treatment control", details: error.message },
      { status: 500 }
    );
  }
});

export const PUT = withContext(async({ tenantDb }, request, { params }: { params: { id: string } }) => {
  try {
    const { id } = params;
    const body = await request.json();
    const {
      control_title,
      control_description,
      control_type,
      control_category,
      implementation_status,
      effectiveness_rating,
      implementation_cost,
      assigned_owner,
      technical_contact,
      implementation_date,
      testing_date,
      next_review_date,
      due_date,
      completion_date,
      automation_level,
      compliance_frameworks,
      evidence_location,
      testing_procedure,
      remediation_notes,
      changed_by,
    } = body;

    // Validate required fields
    const requiredFields = { control_title, control_type, implementation_status, changed_by };
    for (const [field, value] of Object.entries(requiredFields)) {
      if (!validateInput(value, field)) {
        return NextResponse.json(
          { error: `Invalid or missing ${field}` },
          { status: 400 }
        );
      }
    }

    // Validate ID
    if (!validateInput(id, 'id') || isNaN(Number(id))) {
      return NextResponse.json({ error: "Invalid control ID" }, { status: 400 });
    }

    // Validate optional numeric fields
    if (effectiveness_rating !== undefined && !validateInput(effectiveness_rating, 'effectiveness_rating')) {
      return NextResponse.json({ error: "Invalid effectiveness rating" }, { status: 400 });
    }
    if (implementation_cost !== undefined && !validateInput(implementation_cost, 'implementation_cost')) {
      return NextResponse.json({ error: "Invalid implementation cost" }, { status: 400 });
    }

    // Validate array field
    if (compliance_frameworks && !Array.isArray(compliance_frameworks)) {
      return NextResponse.json({ error: "Invalid compliance frameworks format" }, { status: 400 });
    }

    // Use transaction for atomic updates
    await tenantDb`BEGIN`;
      // Update control
      const updateResult = await tenantDb`
        UPDATE iso27001_treatment_controls
        SET control_title = $1,
            control_description = $2,
            control_type = $3,
            control_category = $4,
            implementation_status = $5,
            effectiveness_rating = $6,
            implementation_cost = $7,
            assigned_owner = $8,
            technical_contact = $9,
            implementation_date = $10,
            testing_date = $11,
            next_review_date = $12,
            due_date = $13,
            completion_date = $14,
            automation_level = $15,
            compliance_frameworks = $16,
            evidence_location = $17,
            testing_procedure = $18,
            remediation_notes = $19,
            updated_at = CURRENT_TIMESTAMP
        WHERE id = ${id}
        RETURNING *
      ` as Record<string, any>[];
      if (!updateResult || updateResult.length === 0) {
        await tenantDb`ROLLBACK`;
        return NextResponse.json({ error: "Treatment control not found" }, { status: 404 });
      }


      await tenantDb`
        INSERT INTO iso27001_treatment_tracking (
          treatment_plan_id, control_id, tracking_type, new_status, tracking_date,
          description, responsible_party, created_by
        )
        VALUES (
          ${updateResult[0].treatment_plan_id},
          ${updateResult[0].id},
          'status_change',
          ${implementation_status},
          CURRENT_TIMESTAMP,
          'Control status updated',
          ${changed_by},
          ${changed_by}
        )
      `;

      await tenantDb`COMMIT`;

      const r = updateResult[0];
      const serializedResult = {
        ...r,
        created_at: r.created_at ? new Date(r.created_at).toISOString() : null,
        updated_at: r.updated_at ? new Date(r.updated_at).toISOString() : null,
        implementation_date: r.implementation_date ? new Date(r.implementation_date).toISOString() : null,
        testing_date: r.testing_date ? new Date(r.testing_date).toISOString() : null,
        next_review_date: r.next_review_date ? new Date(r.next_review_date).toISOString() : null,
        due_date: r.due_date ? new Date(r.due_date).toISOString() : null,
        completion_date: r.completion_date ? new Date(r.completion_date).toISOString() : null,
        effectiveness_rating: Number(r.effectiveness_rating) || 0,
        implementation_cost: Number(r.implementation_cost) || 0,
        compliance_frameworks: Array.isArray(r.compliance_frameworks) ? r.compliance_frameworks : [],
      };

      return NextResponse.json(serializedResult);
    } catch (error: any) {
      console.error("Error updating treatment control:", error);
      try { await tenantDb`ROLLBACK`; } catch {}
      return NextResponse.json(
        { error: error.message || "Failed to update treatment control", details: error.message },
        { status: error.message === "Treatment control not found" ? 404 : 500 }
      );
    }
  }
);