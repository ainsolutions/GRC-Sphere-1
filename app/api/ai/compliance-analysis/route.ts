import { NextRequest, NextResponse } from 'next/server';
import { analyzeCompliance } from '@/lib/openai';
import { withContext } from '@/lib/HttpContext';


export const POST = withContext(async ({ tenantDb },request) => {
  try {
    const complianceData = await request.json();

    if (!complianceData) {
      return NextResponse.json(
        { error: 'Compliance data is required' },
        { status: 400 }
      );
    }

    const result = await analyzeCompliance(complianceData);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      analysis: result.text,
      usage: result.usage,
    });
  } catch (error) {
    console.error('Compliance Analysis API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
);