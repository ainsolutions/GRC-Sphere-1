import { type NextRequest, NextResponse } from "next/server"
import { withContext } from "@/lib/HttpContext";
import { neon } from "@neondatabase/serverless";


export const GET = withContext(async ({ tenantDb }, request) => {
  try {
    const assets = await tenantDb`SELECT * FROM assets ORDER BY created_at DESC`;

    return NextResponse.json({ success: true, assets });
  } catch (error: any) {
    console.error("❌ GET /api/assets error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
});

// POST: Create a new asset
export const POST = withContext(async ({ tenantDb }, request) => {
  try {
    const body = await request.json();
    console.log("POST /api/assets body:", body);

    // Validate required fields
    const requiredFields = ["asset_id", "asset_name", "asset_type", "classification", "owner", "business_value"];
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { success: false, error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }

    const [newAsset] = await tenantDb`
      INSERT INTO assets (
        asset_id, asset_name, asset_type, classification, owner, business_value,
        custodian, retention_period, disposal_method, ip_address, model_version,
        confidentiality_level, integrity_level, availability_level, description, location,
        created_by, status
      ) VALUES (
        ${body.asset_id}, ${body.asset_name}, ${body.asset_type}, ${body.classification},
        ${body.owner}, ${body.business_value},
        ${body.custodian || null}, ${body.retention_period || null}, ${body.disposal_method || null},
        ${body.ip_address || null}, ${body.model_version || null},
        ${body.confidentiality_level || 1}, ${body.integrity_level || 1}, ${body.availability_level || 1},
        ${body.description || null}, ${body.location || null},
        ${body.created_by || "system"}, ${body.status || "active"}
      )
      RETURNING *;
    ` as Record<string, any>[];

    return NextResponse.json({ success: true, data: newAsset });
  } catch (error: any) {
    console.error("❌ POST /api/assets error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
});



export async function getAssetsCommon(
  search: string | null,
  category: string | null,
  criticality: string | null,
  tenantDb: ReturnType<typeof neon>,
  limit: number,
  offset: number
) {
  const whereConditions = [];

  if (search) {
    whereConditions.push(
      `(asset_name ILIKE '%${search}%' OR description ILIKE '%${search}%' OR asset_id ILIKE '%${search}%')`
    );
  }

  if (category) {
    whereConditions.push(`asset_type = '${category}'`);
  }

  if (criticality) {
    whereConditions.push(`business_value = '${criticality}'`);
  }

  const whereClause =
    whereConditions.length > 0 ? `WHERE ${whereConditions.join(" AND ")}` : "";

  const assets = await tenantDb`
    SELECT 
      id,
      asset_id,
      asset_name,
      description,
      asset_type,
      classification,
      business_value,
      confidentiality_level,
      integrity_level,
      availability_level,
      custodian,
      retention_period,
      disposal_method,
      ip_address,
      model_version,
      owner,
      location,
      status,
      created_at,
      updated_at
    FROM assets
    ${whereClause ? tenantDb.unsafe(whereClause) : tenantDb``}
    ORDER BY asset_name ASC
    LIMIT ${limit} OFFSET ${offset}
  ` as Record <string, any>[];

  // Get total count
  const countResult = await tenantDb`
    SELECT COUNT(*) as total
    FROM assets
    ${whereClause ? tenantDb.unsafe(whereClause) : tenantDb``}
  ` as Record<string, any>[];
  const total = Number.parseInt((countResult as { total: string }[])[0]?.total || "0");

  // 🔑 Return plain object, not NextResponse
  return {
    success: true,
    data: assets,
    pagination: {
      total,
      limit,
      offset,
      hasMore: offset + limit < total,
    },
  };
}
