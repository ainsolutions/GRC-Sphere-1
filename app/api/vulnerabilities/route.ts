import { NextResponse } from "next/server";
import { withContext } from "@/lib/HttpContext";

//getVulnerabilities
export const GET = withContext(async ({ tenantDb }, request) => {
  try {
    const { searchParams } = new URL(request.url);
    const searchTerm = searchParams.get("searchTerm") || "";
    const statusFilter = searchParams.get("statusFilter") || "";
    const severityFilter = searchParams.get("severityFilter") || "";
    const categoryFilter = searchParams.get("categoryFilter") || "";
    const sortBy = searchParams.get("sortBy") || "created_at";
    const sortDirection = searchParams.get("sortDirection") || "desc";
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const offset = (page - 1) * limit;

    const whereConditions: string[] = [];
    if (searchTerm) {
      whereConditions.push(`(
        name ILIKE '%${searchTerm}%' OR
        description ILIKE '%${searchTerm}%' OR 
        category ILIKE '%${searchTerm}%' OR 
        cve_id ILIKE '%${searchTerm}%' OR
        affected_systems::text ILIKE '%${searchTerm}%'
      )`);
    }
    if (statusFilter) whereConditions.push(`remediation_status = '${statusFilter}'`);
    if (severityFilter) whereConditions.push(`severity = '${severityFilter}'`);
    if (categoryFilter) whereConditions.push(`category = '${categoryFilter}'`);

    const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(" AND ")}` : "";

    const validSortColumns = [
      "name","severity","category","remediation_status","assigned_to","remediation_due_date",
      "created_at","updated_at","cvss_score","priority"
    ];
    const sortColumn = validSortColumns.includes(sortBy) ? sortBy : "created_at";
    const sortDir = sortDirection === "asc" ? "ASC" : "DESC";

    let orderClause = `ORDER BY ${sortColumn} ${sortDir}`;
    if (sortColumn === "severity") {
      orderClause = `ORDER BY 
        CASE severity 
          WHEN 'Critical' THEN 1
          WHEN 'High' THEN 2
          WHEN 'Medium' THEN 3
          WHEN 'Low' THEN 4
          WHEN 'Informational' THEN 5
          ELSE 6
        END ${sortDir}`;
    } else if (sortColumn === "remediation_status") {
      orderClause = `ORDER BY 
        CASE remediation_status 
          WHEN 'Open' THEN 1
          WHEN 'In Progress' THEN 2
          WHEN 'Resolved' THEN 3
          WHEN 'Accepted Risk' THEN 4
          WHEN 'False Positive' THEN 5
          ELSE 6
        END ${sortDir}`;
    }

    const countResult = await tenantDb`
      SELECT COUNT(*) as total FROM vulnerabilities ${tenantDb.unsafe(whereClause)}
    `;
    const countRow = countResult as { total: any}[];
    const total = Number(countRow[0].total);

    const result = await tenantDb`
      SELECT id,name,description,category,severity,cvss_score,cve_id,affected_systems,
             assets,remediation_status,remediation_notes,assigned_to,priority,tat_days,
             remediation_due_date,remediation_completed_date,tags,external_references,
             remediation_department,remediation_departmental_unit,
             epss_score,epss_percentile,epss_last_updated,
             created_at,updated_at
      FROM vulnerabilities
      ${tenantDb.unsafe(whereClause)}
      ${tenantDb.unsafe(orderClause)}
      LIMIT ${limit} OFFSET ${offset}
    `;

    return NextResponse.json({ success: true, data: result, total });
  } catch (error) {
    console.error("Error fetching vulnerabilities:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch vulnerabilities", data: [], total: 0 }, { status: 500 });
  }
});

//createVulnerability
export const POST = withContext(async ({ tenantDb }, request) => {
  try {
    const body = await request.json()
    const {
      name,
      description,
      severity,
      cvss_score,
      category,
      affected_systems = [],
      remediation_status = "Open",
      assigned_to,
      remediation_department,
      remediation_departmental_unit,
      priority = 3,
      external_references = [],
      tags = [],
      remediation_notes,
      remediation_due_date,
      cve_id,
      assets = [],
    } = body

    const result = await tenantDb`
      INSERT INTO vulnerabilities (
        name,
        description,
        severity,
        cvss_score,
        category,
        affected_systems,
        assets,
        remediation_status,
        assigned_to,
        remediation_department,
        remediation_departmental_unit,
        priority,
        external_references,
        tags,
        remediation_notes,
        remediation_due_date,
        cve_id,
        tat_days
      )
      VALUES (
        ${name},
        ${description},
        ${severity},
        ${cvss_score},
        ${category},
        ${JSON.stringify(affected_systems)},   -- ✅ convert array/object to JSON
        ${JSON.stringify(assets)},             -- ✅ convert assets array to JSON
        ${remediation_status},
        ${assigned_to},
        ${remediation_department || null},
        ${remediation_departmental_unit || null},
        ${priority},
        ${JSON.stringify(external_references)}, -- ✅ ensure JSONB insert
        ${JSON.stringify(tags)},                -- ✅ ensure JSONB insert
        ${remediation_notes},
        ${remediation_due_date},
        ${cve_id},
        CASE 
          WHEN ${severity} = 'Critical' THEN 7
          WHEN ${severity} = 'High' THEN 14
          WHEN ${severity} = 'Medium' THEN 30
          ELSE 60
        END
      )
      RETURNING *
    ` as Record<string, any>[]

    return NextResponse.json({ success: true, data: result[0] })
  } catch (error: any) {
    console.error("Error creating vulnerability:", error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
})