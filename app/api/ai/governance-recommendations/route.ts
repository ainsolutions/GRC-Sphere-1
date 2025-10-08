import { NextRequest, NextResponse } from 'next/server';
import { generateGovernanceRecommendations } from '@/lib/openai';
import { withContext } from '@/lib/HttpContext';

export const POST = withContext( async ( context ,request) => {
  try {
    const governanceData = await request.json();

    if (!governanceData) {
      return NextResponse.json(
        { error: 'Governance data is required' },
        { status: 400 }
      );
    }

    const result = await generateGovernanceRecommendations(governanceData);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      recommendations: result.text,
      usage: result.usage,
    });
  } catch (error) {
    console.error('Governance Recommendations API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
});