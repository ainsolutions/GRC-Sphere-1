import { type NextRequest, NextResponse } from "next/server"
import { withContext, HttpSessionContext } from "@/lib/HttpContext"


export const GET = withContext(async ({ tenantDb }: HttpSessionContext, request) => {
  try {
    const { searchParams } = new URL(request.url);
    const riskId = searchParams.get("riskId");
    const controlId = searchParams.get("controlId");

    let result;

    if (riskId && controlId) {
      result = await tenantDb`
        SELECT 
          id,
          risk_id,
          control_id,
          file_name,
          file_type,
          file_size,
          description,
          uploaded_by,
          created_at::text
        FROM iso27001_evidence
        WHERE risk_id = ${Number(riskId)} AND control_id = ${controlId}
        ORDER BY created_at DESC
      `;
    } else if (riskId) {
      result = await tenantDb`
        SELECT 
          id,
          risk_id,
          control_id,
          file_name,
          file_type,
          file_size,
          description,
          uploaded_by,
          created_at::text
        FROM iso27001_evidence
        WHERE risk_id = ${Number(riskId)}
        ORDER BY created_at DESC
      `;
    } else if (controlId) {
      result = await tenantDb`
        SELECT 
          id,
          risk_id,
          control_id,
          file_name,
          file_type,
          file_size,
          description,
          uploaded_by,
          created_at::text
        FROM iso27001_evidence
        WHERE control_id = ${controlId}
        ORDER BY created_at DESC
      `;
    } else {
      result = await tenantDb`
        SELECT 
          id,
          risk_id,
          control_id,
          file_name,
          file_type,
          file_size,
          description,
          uploaded_by,
          created_at::text
        FROM iso27001_evidence
        ORDER BY created_at DESC
      `;
    }

    return NextResponse.json(result);
  } catch (error: any) {
    console.error("Error fetching evidence:", error);
    return NextResponse.json(
      { error: "Failed to fetch evidence", details: error.message },
      { status: 500 }
    );
  }
});


export const POST = withContext(async({ tenantDb }, request) => {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File
    const riskId = formData.get("riskId") as string
    const controlId = formData.get("controlId") as string | null
    const description = formData.get("description") as string
    const uploadedBy = formData.get("uploadedBy") as string

    if (!file || !riskId || !uploadedBy) {
      return NextResponse.json({ error: "Missing required fields: file, riskId, uploadedBy" }, { status: 400 })
    }

    // Convert file to base64
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const base64Data = buffer.toString("base64")

    const result = await tenantDb`
      INSERT INTO iso27001_evidence (
        risk_id, control_id, file_name, file_type, file_size, 
        file_data, description, uploaded_by
      ) VALUES (
        ${Number.parseInt(riskId)}, ${controlId}, ${file.name}, ${file.type}, 
        ${file.size}, ${base64Data}, ${description}, ${uploadedBy}
      )
      RETURNING 
        id, risk_id, control_id, file_name, file_type, file_size,
        description, uploaded_by, created_at::text
    ` as Record<string, any>[]

    return NextResponse.json(result[0], { status: 201 })
  } catch (error: any) {
    console.error("Error uploading evidence:", error)
    return NextResponse.json({ error: "Failed to upload evidence", details: error.message }, { status: 500 })
  }
});
