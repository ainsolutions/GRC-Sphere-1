import { NextRequest, NextResponse } from "next/server"
import { withContext, HttpSessionContext } from "@/lib/HttpContext"


export const GET = withContext(async({tenantDb}: HttpSessionContext,request) => {
  try {
    if (!tenantDb) {
      return NextResponse.json(
        { success: false, error: "Database not configured" },
        { status: 500 }
      )
    }
    const { searchParams } = new URL(request.url)
    const documentType = searchParams.get("type")
    const status = searchParams.get("status")
    const category = searchParams.get("category")
    const framework = searchParams.get("framework")
    const owner = searchParams.get("owner")
    const department = searchParams.get("department")

    let whereConditions = []

    if (documentType && documentType !== "all") {
      whereConditions.push(`d.document_type = '${documentType}'`)
    }

    if (status && status !== "all") {
      whereConditions.push(`d.status = '${status}'`)
    }

    if (category && category !== "all") {
      whereConditions.push(`d.category = '${category}'`)
    }

    if (framework && framework !== "all") {
      whereConditions.push(`'${framework}' = ANY(d.applicable_frameworks)`)
    }

    if (owner && owner !== "all") {
      whereConditions.push(`d.document_owner = '${owner}'`)
    }

    if (department && department !== "all") {
      whereConditions.push(`d.department_owner = '${department}'`)
    }

    const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : ""

    const result = await tenantDb`
      SELECT
        d.id,
        d.title,
        d.document_type,
        d.version as current_version,
        d.status,
        d.category,
        d.subcategory,
        d.description,
        d.document_owner,
        d.department as department_owner,
        d.approval_authority,
        d.review_frequency,
        d.related_documents,
        d.applicable_frameworks,
        d.tags,
        d.confidentiality_level,
        d.distribution_list,
        d.compliance_requirements,
        d.created_at,
        d.updated_at,
        d.created_by,
        d.updated_by,
        d.file_path,
        d.file_size,
        d.mime_type,
        -- Mock version count for now (will be 1 for existing records)
        1 as version_count,
        -- Mock pending approvals for now
        0 as pending_approvals
      FROM governance_documents d
      ${whereClause ? tenantDb.unsafe(whereClause) : tenantDb``}
      ORDER BY d.created_at DESC
    `

    return NextResponse.json({
      success: true,
      data: Array.isArray(result) ? result : [result],
      count: Array.isArray(result) ? result.length : 1
    })
  } catch (error) {
    console.error("Error fetching documents:", error)
    return NextResponse.json(
      { success: false, error: "Failed to fetch documents" },
      { status: 500 }
    )
  }
});

export const POST = withContext(async({tenantDb}: HttpSessionContext,request) => {
  try {
    if (!tenantDb) {
      return NextResponse.json(
        { success: false, error: "Database not configured" },
        { status: 500 }
      )
    }

    const body = await request.json()

    const {
      title,
      document_type,
      version = "1.0",
      status = "draft",
      category,
      subcategory,
      description,
      content,
      file_path,
      file_name,
      file_size,
      mime_type,
      document_owner,
      department_owner, // This will be mapped to department
      approval_authority,
      review_frequency = "annual",
      related_documents = [],
      applicable_frameworks = [],
      tags = [],
      confidentiality_level = "internal",
      distribution_list = [],
      compliance_requirements = [],
      version_notes = "Initial version",
      created_by
    } = body

    // Validate required fields
    if (!title || !document_type || !category || !document_owner) {
      return NextResponse.json(
        { success: false, error: "Missing required fields: title, document_type, category, document_owner" },
        { status: 400 }
      )
    }

    // Ensure arrays are properly formatted
    const safeRelatedDocuments = Array.isArray(related_documents) ? related_documents : []
    const safeApplicableFrameworks = Array.isArray(applicable_frameworks) ? applicable_frameworks : []
    const safeTags = Array.isArray(tags) ? tags : []
    const safeDistributionList = Array.isArray(distribution_list) ? distribution_list : []
    const safeComplianceRequirements = Array.isArray(compliance_requirements) ? compliance_requirements : []

    const result = await tenantDb`
      INSERT INTO governance_documents (
        title, document_type, version, status, category, subcategory,
        description, content, file_path, file_size, mime_type, document_owner,
        department, approval_authority, review_frequency, related_documents,
        applicable_frameworks, tags, confidentiality_level, distribution_list,
        change_history, approval_workflow, compliance_requirements, created_by
      ) VALUES (
        ${title}, ${document_type}, ${version}, ${status}, ${category}, ${subcategory},
        ${description}, ${content}, ${file_path}, ${file_size}, ${mime_type}, ${document_owner},
        ${department_owner}, ${approval_authority}, ${review_frequency}, ${safeRelatedDocuments.length > 0 ? tenantDb.unsafe(`ARRAY[${safeRelatedDocuments.map(item => `'${item.replace(/'/g, "''")}'`).join(',')}]`) : tenantDb.unsafe(`ARRAY[]::text[]`)},
        ${safeApplicableFrameworks.length > 0 ? tenantDb.unsafe(`ARRAY[${safeApplicableFrameworks.map(item => `'${item.replace(/'/g, "''")}'`).join(',')}]`) : tenantDb.unsafe(`ARRAY[]::text[]`)}, ${safeTags.length > 0 ? tenantDb.unsafe(`ARRAY[${safeTags.map(item => `'${item.replace(/'/g, "''")}'`).join(',')}]`) : tenantDb.unsafe(`ARRAY[]::text[]`)}, ${confidentiality_level},
        ${safeDistributionList.length > 0 ? tenantDb.unsafe(`ARRAY[${safeDistributionList.map(item => `'${item.replace(/'/g, "''")}'`).join(',')}]`) : tenantDb.unsafe(`ARRAY[]::text[]`)}, ${JSON.stringify({})}::jsonb, ${JSON.stringify({})}::jsonb,
        ${safeComplianceRequirements.length > 0 ? tenantDb.unsafe(`ARRAY[${safeComplianceRequirements.map(item => `'${item.replace(/'/g, "''")}'`).join(',')}]`) : tenantDb.unsafe(`ARRAY[]::text[]`)}, ${created_by}
      ) RETURNING *
    `

    return NextResponse.json({
      success: true,
      data: Array.isArray(result) ? result[0] : result,
      message: "Document created successfully"
    })
  } catch (error: unknown) {
  console.error("Error creating document:", error);

  const message =
    error instanceof Error
      ? error.message
      : String(error); // fall back to string for non-Error values

  return NextResponse.json(
    { success: false, error: "Failed to create document: " + message },
    { status: 500 }
  );
}
});

