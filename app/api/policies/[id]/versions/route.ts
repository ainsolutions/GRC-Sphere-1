import { type NextRequest, NextResponse } from "next/server"
import { withContext } from "@/lib/HttpContext"

export const GET = withContext(async({ tenantDb }, request, { params }: { params: Promise<{ id: string }> }) => {
  try {
    const { id } = await params
    
    // Check if policy_versions table exists
    const tableExists = await tenantDb`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'policy_versions'
      )
    ` as Record<string, boolean>[]

    if (!tableExists[0].exists) {
      console.log("Policy versions table does not exist, returning empty array")
      return NextResponse.json([])
    }

    // Check if policy_attachments table exists
    const attachmentsTableExists = await tenantDb`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'policy_attachments'
      )
    ` as Record<string, boolean>[]

    // First, let's check what columns exist in policy_versions table
    const columns = await tenantDb`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'policy_versions' 
      AND table_schema = 'public'
    ` as Record<string, any>[]
    
    const hasIsCurrent = columns.some((col: any) => col.column_name === 'is_current')
    
    let versions
    if (attachmentsTableExists[0].exists) {
      if (hasIsCurrent) {
        versions = await tenantDb`
          SELECT 
            pv.*,
            COUNT(pa.id) as attachment_count,
            CASE WHEN pv.is_current IS TRUE THEN 'current' ELSE 'historical' END as version_status
          FROM policy_versions pv
          LEFT JOIN policy_attachments pa ON pv.id = pa.version_id
          WHERE pv.policy_id = ${id}::INTEGER
          GROUP BY pv.id
          ORDER BY pv.created_at DESC
        `
      } else {
        versions = await tenantDb`
          SELECT 
            pv.*,
            COUNT(pa.id) as attachment_count,
            'historical' as version_status
          FROM policy_versions pv
          LEFT JOIN policy_attachments pa ON pv.id = pa.version_id
          WHERE pv.policy_id = ${id}::INTEGER
          GROUP BY pv.id
          ORDER BY pv.created_at DESC
        `
      }
    } else {
      if (hasIsCurrent) {
        versions = await tenantDb`
          SELECT 
            pv.*,
            0 as attachment_count,
            CASE WHEN pv.is_current IS TRUE THEN 'current' ELSE 'historical' END as version_status
          FROM policy_versions pv
          WHERE pv.policy_id = ${id}::INTEGER
          ORDER BY pv.created_at DESC
        `
      } else {
        versions = await tenantDb`
          SELECT 
            pv.*,
            0 as attachment_count,
            'historical' as version_status
          FROM policy_versions pv
          WHERE pv.policy_id = ${id}::INTEGER
          ORDER BY pv.created_at DESC
        `
      }
    }

    return NextResponse.json(versions)
  } catch (error) {
    console.error("Error fetching policy versions:", error)
    return NextResponse.json({ error: "Failed to fetch policy versions" }, { status: 500 })
  }
});

export const POST = withContext(async({ tenantDb }, request, { params }: { params: Promise<{ id: string }> }) => {
  try {
    const { id } = await params
    
    // Check if policy_versions table exists
    const tableExists = await tenantDb`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'policy_versions'
      )
    ` as Record<string, any>[]

    if (!tableExists[0].exists) {
      return NextResponse.json(
        { error: "Policy versions feature not available. Please run database migrations." },
        { status: 503 }
      )
    }

    const body = await request.json()
    const { change_summary } = body

    // Check if the create_policy_version function exists
    const functionExists = await tenantDb`
      SELECT EXISTS (
        SELECT FROM information_schema.routines 
        WHERE routine_schema = 'public' 
        AND routine_name = 'create_policy_version'
      )
    ` as Record<string, any>[]

    if (!functionExists[0].exists) {
      return NextResponse.json(
        { error: "Policy version creation function not available. Please run database migrations." },
        { status: 503 }
      )
    }

    const result = await tenantDb`
      SELECT create_policy_version(${id}::INTEGER, ${change_summary || null}) as version_id
    ` as Record<string, any>[]

    const versionId = result[0].version_id

    // Get the created version
    const version = await tenantDb`
      SELECT * FROM policy_versions WHERE id = ${versionId}
    ` as Record<string, any>[]

    return NextResponse.json(version[0], { status: 201 })
  } catch (error) {
    console.error("Error creating policy version:", error)
    return NextResponse.json({ error: "Failed to create policy version" }, { status: 500 })
  }
});
