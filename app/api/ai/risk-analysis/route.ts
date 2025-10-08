import { NextRequest, NextResponse } from 'next/server';
import { analyzeRiskAssessment } from '@/lib/openai';
import { withContext } from '@/lib/HttpContext';

export const POST = withContext( async ({}, request) => {
  try {
    const riskData = await request.json();

    if (!riskData) {
      return NextResponse.json(
        { error: 'Risk data is required' },
        { status: 400 }
      );
    }

    const result = await analyzeRiskAssessment(riskData);

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
    console.error('Risk Analysis API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
});




