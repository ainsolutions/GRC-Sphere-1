import { type NextRequest, NextResponse } from "next/server"
import { withContext } from "@/lib/HttpContext"

export const GET = withContext(async({ tenantDb }, request) => {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get("status")
    const category = searchParams.get("category")
    const search = searchParams.get("search")

    let policies

    if (status && status !== "all" && category && category !== "all" && search) {
      // All filters applied
      policies = await tenantDb`
        SELECT 
          p.*,
          pc.name as category_name,
          pc.color as category_color,
          COUNT(pr.id) as procedure_count
        FROM policies p
        LEFT JOIN policy_categories pc ON p.category_id = pc.id
        LEFT JOIN procedures pr ON p.id = pr.policy_id
        WHERE p.status = ${status} 
          AND pc.name = ${category}
          AND (p.title ILIKE ${`%${search}%`} OR p.description ILIKE ${`%${search}%`} OR p.policy_id ILIKE ${`%${search}%`})
        GROUP BY p.id, pc.name, pc.color
        ORDER BY p.created_at DESC
      `
    } else if (status && status !== "all" && category && category !== "all") {
      // Status and category filters
      policies = await tenantDb`
        SELECT 
          p.*,
          pc.name as category_name,
          pc.color as category_color,
          COUNT(pr.id) as procedure_count
        FROM policies p
        LEFT JOIN policy_categories pc ON p.category_id = pc.id
        LEFT JOIN procedures pr ON p.id = pr.policy_id
        WHERE p.status = ${status} AND pc.name = ${category}
        GROUP BY p.id, pc.name, pc.color
        ORDER BY p.created_at DESC
      `
    } else if (status && status !== "all" && search) {
      // Status and search filters
      policies = await tenantDb`
        SELECT 
          p.*,
          pc.name as category_name,
          pc.color as category_color,
          COUNT(pr.id) as procedure_count
        FROM policies p
        LEFT JOIN policy_categories pc ON p.category_id = pc.id
        LEFT JOIN procedures pr ON p.id = pr.policy_id
        WHERE p.status = ${status}
          AND (p.title ILIKE ${`%${search}%`} OR p.description ILIKE ${`%${search}%`} OR p.policy_id ILIKE ${`%${search}%`})
        GROUP BY p.id, pc.name, pc.color
        ORDER BY p.created_at DESC
      `
    } else if (category && category !== "all" && search) {
      // Category and search filters
      policies = await tenantDb`
        SELECT 
          p.*,
          pc.name as category_name,
          pc.color as category_color,
          COUNT(pr.id) as procedure_count
        FROM policies p
        LEFT JOIN policy_categories pc ON p.category_id = pc.id
        LEFT JOIN procedures pr ON p.id = pr.policy_id
        WHERE pc.name = ${category}
          AND (p.title ILIKE ${`%${search}%`} OR p.description ILIKE ${`%${search}%`} OR p.policy_id ILIKE ${`%${search}%`})
        GROUP BY p.id, pc.name, pc.color
        ORDER BY p.created_at DESC
      `
    } else if (status && status !== "all") {
      // Status filter only
      policies = await tenantDb`
        SELECT 
          p.*,
          pc.name as category_name,
          pc.color as category_color,
          COUNT(pr.id) as procedure_count
        FROM policies p
        LEFT JOIN policy_categories pc ON p.category_id = pc.id
        LEFT JOIN procedures pr ON p.id = pr.policy_id
        WHERE p.status = ${status}
        GROUP BY p.id, pc.name, pc.color
        ORDER BY p.created_at DESC
      `
    } else if (category && category !== "all") {
      // Category filter only
      policies = await tenantDb`
        SELECT 
          p.*,
          pc.name as category_name,
          pc.color as category_color,
          COUNT(pr.id) as procedure_count
        FROM policies p
        LEFT JOIN policy_categories pc ON p.category_id = pc.id
        LEFT JOIN procedures pr ON p.id = pr.policy_id
        WHERE pc.name = ${category}
        GROUP BY p.id, pc.name, pc.color
        ORDER BY p.created_at DESC
      `
    } else if (search) {
      // Search filter only
      policies = await tenantDb`
        SELECT 
          p.*,
          pc.name as category_name,
          pc.color as category_color,
          COUNT(pr.id) as procedure_count
        FROM policies p
        LEFT JOIN policy_categories pc ON p.category_id = pc.id
        LEFT JOIN procedures pr ON p.id = pr.policy_id
        WHERE (p.title ILIKE ${`%${search}%`} OR p.description ILIKE ${`%${search}%`} OR p.policy_id ILIKE ${`%${search}%`})
        GROUP BY p.id, pc.name, pc.color
        ORDER BY p.created_at DESC
      `
    } else {
      // No filters
      policies = await tenantDb`
        SELECT 
          p.*,
          pc.name as category_name,
          pc.color as category_color,
          COUNT(pr.id) as procedure_count
        FROM policies p
        LEFT JOIN policy_categories pc ON p.category_id = pc.id
        LEFT JOIN procedures pr ON p.id = pr.policy_id
        GROUP BY p.id, pc.name, pc.color
        ORDER BY p.created_at DESC
      `
    }

    return NextResponse.json({ policies })
  } catch (error) {
    console.error("Error fetching policies:", error)
    return NextResponse.json({ error: "Failed to fetch policies" }, { status: 500 })
  }
});

export const POST = withContext(async({ tenantDb }, request) => {
  try {
    const body = await request.json()
    const {
      title,
      description,
      content,
      category_id,
      status,
      effective_date,
      review_date,
      next_review_date,
      tags = [],
    } = body

    // Generate policy ID
    const policyIdResult = await tenantDb`
      SELECT COALESCE(MAX(CAST(SUBSTRING(policy_id FROM 4) AS INTEGER)), 0) + 1 as next_id
      FROM policies 
      WHERE policy_id LIKE 'POL%'
    ` as Record<string, any>[]
    const nextId = policyIdResult[0].next_id
    const policyId = `POL${String(nextId).padStart(3, "0")}`

    // Convert tags array to PostgreSQL array format
    const tagsArray = Array.isArray(tags) ? tags : []

    const result = await tenantDb`
      INSERT INTO policies (
        policy_id, title, description, content, category_id, status, version,
        effective_date, review_date, next_review_date, tags
      ) VALUES (
        ${policyId}, ${title}, ${description}, ${content}, ${category_id}, ${status}, '1.0',
        ${effective_date || null}, ${review_date || null}, ${next_review_date || null}, ${tagsArray}
      ) RETURNING *
    ` as Record<string, any>[]

    return NextResponse.json(result[0], { status: 201 })
  } catch (error) {
    console.error("Error creating policy:", error)
    return NextResponse.json({ error: "Failed to create policy" }, { status: 500 })
  }
});
