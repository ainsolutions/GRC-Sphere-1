import { NextRequest, NextResponse } from "next/server"
import { withContext, HttpSessionContext } from "@/lib/HttpContext"


export const GET = withContext(async({tenantDb}: HttpSessionContext, request, { params }: { params: { id: string } }) => {
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
        title,
        document_type,
        version,
        status,
        category,
        subcategory,
        description,
        content,
        file_path,
        file_size,
        mime_type,
        document_owner,
        department as department_owner,
        approval_authority,
        effective_date,
        last_review_date,
        next_review_date,
        review_frequency,
        related_documents,
        applicable_frameworks,
        tags,
        confidentiality_level,
        distribution_list,
        change_history,
        approval_workflow,
        compliance_requirements,
        created_at,
        updated_at,
        created_by,
        updated_by
      FROM governance_documents
      WHERE id = ${id}
    `

    const resultArray = Array.isArray(result) ? result : [result];
    if (resultArray.length === 0) {
      return NextResponse.json(
        { success: false, error: "Document not found" },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: resultArray[0]
    })
  } catch (error) {
    console.error("Error fetching document:", error)
    return NextResponse.json(
      { success: false, error: "Failed to fetch document" },
      { status: 500 }
    )
  }
});


export const PUT = withContext(async ({ tenantDb }: HttpSessionContext, request, routeContext) => {
  try {
    const { id } = routeContext.params; // ✅ No await needed now

    const body = await request.json();
    const {
      title,
      document_type,
      version,
      status,
      category,
      subcategory,
      description,
      content,
      file_path,
      file_size,
      mime_type,
      document_owner,
      department_owner,
      approval_authority,
      effective_date,
      last_review_date,
      next_review_date,
      review_frequency,
      related_documents,
      applicable_frameworks,
      tags,
      confidentiality_level,
      distribution_list,
      change_history,
      approval_workflow,
      compliance_requirements,
      updated_by,
    } = body;

    if (!title || !document_type || !version || !category || !document_owner) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    // ✅ Convert arrays to Postgres array literals safely
    const toPgArray = (arr: any) =>
      Array.isArray(arr) && arr.length > 0 ? `{${arr.map((v) => `"${v}"`).join(",")}}` : "{}";

    const result = await tenantDb`
      UPDATE governance_documents SET
        title = ${title},
        document_type = ${document_type},
        version = ${version},
        status = ${status},
        category = ${category},
        subcategory = ${subcategory},
        description = ${description},
        content = ${content},
        file_path = ${file_path},
        file_size = ${file_size},
        mime_type = ${mime_type},
        document_owner = ${document_owner},
        department = ${department_owner},
        approval_authority = ${approval_authority},
        effective_date = ${effective_date},
        last_review_date = ${last_review_date},
        next_review_date = ${next_review_date},
        review_frequency = ${review_frequency},
        related_documents = ${toPgArray(related_documents)},
        applicable_frameworks = ${toPgArray(applicable_frameworks)},
        tags = ${toPgArray(tags)},
        confidentiality_level = ${confidentiality_level},
        distribution_list = ${toPgArray(distribution_list)},
        change_history = ${toPgArray(change_history)},
        approval_workflow = ${toPgArray(approval_workflow)},
        compliance_requirements = ${toPgArray(compliance_requirements)},
        updated_by = ${updated_by},
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ${id}
      RETURNING *;
    `;

    if (!Array.isArray(result) || result.length === 0) {
      return NextResponse.json(
        { success: false, error: "Document not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: result[0],
      message: "Document updated successfully",
    });
  } catch (error: any) {
    console.error("🔥 Error updating document:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to update document" },
      { status: 500 }
    );
  }
});

export const DELETE = withContext( async({tenantDb}: HttpSessionContext, request, { params }: { params: { id: string } }) => {
  try {
    if (!tenantDb) {
      return NextResponse.json(
        { success: false, error: "Database not configured" },
        { status: 500 }
      )
    }
    const { id } = params

    const result = await tenantDb`
      DELETE FROM governance_documents
      WHERE id = ${id}
      RETURNING *
    `

    const resultArray = Array.isArray(result) ? result : [result];
    if (resultArray.length === 0) {
      return NextResponse.json(
        { success: false, error: "Document not found" },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      message: "Document deleted successfully"
    })
  } catch (error) {
    console.error("Error deleting document:", error)
    return NextResponse.json(
      { success: false, error: "Failed to delete document" },
      { status: 500 }
    )
  }
});
