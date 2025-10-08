import { NextRequest, NextResponse } from 'next/server'
import { withContext } from "@/lib/HttpContext";
import { getAssetsCommon } from '@/app/api/assets/route';

export const GET = withContext(async ({ tenantDb }, request) => {
  try {
    const { searchParams } = new URL(request.url)
    const searchTerm = searchParams.get('q') || ''
    const limit = parseInt(searchParams.get('limit') || '10')
    const offset = parseInt(searchParams.get('offset') || '0')

    // call getAssetsCommon which now returns plain object
    const result = await getAssetsCommon(searchTerm, null, null, tenantDb, limit, offset);

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: "Failed to fetch assets" },
        { status: 500 }
      );
    }

    const resultRows = result.data || []

    // Transform rows for frontend consumption
    const transformedData = resultRows.map((asset: any) => ({
      id: asset.id,
      asset_id: asset.asset_id,
      asset_name: asset.asset_name,
      asset_type: asset.asset_type,
      classification: asset.classification,
      owner: asset.owner,
      model_version: asset.model_version,
      display_name: `${asset.asset_name} (${asset.asset_id})`,
      full_info: `${asset.asset_name} - ${asset.asset_type}${
        asset.model_version ? ` - ${asset.model_version}` : ""
      }`
    }))

    return NextResponse.json({
      success: true,
      data: transformedData,
      pagination: result.pagination,  // ✅ include pagination for frontend
    })

  } catch (error) {
    console.error('Error searching assets:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
});
