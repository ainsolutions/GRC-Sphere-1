import { NextRequest, NextResponse } from 'next/server';
import { generateAIText } from '@/lib/openai';

export async function POST(request: NextRequest) {
  try {
    const { prompt, model, maxTokens, temperature } = await request.json();

    if (!prompt) {
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      );
    }

    const result = await generateAIText(prompt, {
      model,
      maxTokens,
      temperature,
    });

    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      text: result.text,
      usage: result.usage,
    });
  } catch (error) {
    console.error('AI Test API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    // Test connection with a simple prompt
    const result = await generateAIText('Hello, this is a test. Please respond with "OpenAI connection successful!"');

    if (!result.success) {
      return NextResponse.json(
        { 
          connected: false, 
          error: result.error 
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      connected: true,
      message: result.text,
      usage: result.usage,
    });
  } catch (error) {
    console.error('AI Connection Test Error:', error);
    return NextResponse.json(
      { 
        connected: false, 
        error: 'Failed to connect to OpenAI' 
      },
      { status: 500 }
    );
  }
}




