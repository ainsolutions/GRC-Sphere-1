import { type NextRequest, NextResponse } from "next/server"
import { withContext } from "@/lib/HttpContext"
import { generateAIText } from "@/lib/openai"

export const POST = withContext(async (ctx, request) => {
  const { tenantDb } = ctx;

  try {
    const body = await request.json();
    const { threatName, threatDescription, threatCategory } = body;

    // 🔹 1. Input validation
    if (!threatName || !threatName.trim()) {
      return NextResponse.json(
        { success: false, error: "Threat name is required" },
        { status: 400 }
      );
    }

    // 🔹 2. Dynamic AI prompt
    const prompt = `
You are an expert cybersecurity threat analyst. Analyze the following threat and provide a comprehensive analysis:

THREAT NAME: ${threatName}
${threatDescription ? `DESCRIPTION: ${threatDescription}` : ""}
${threatCategory ? `CATEGORY: ${threatCategory}` : ""}

Provide a detailed report covering:
1. Threat Overview — What is this threat and how does it typically operate?
2. Potential Impact — What are the likely consequences and risks to an organization?
3. Attack Vectors — How might this threat be delivered or executed?
4. Indicators of Compromise — What signs should organizations monitor?
5. Mitigation Strategies — What preventive and response actions are recommended?
6. Risk Level Assessment — Rate severity (Critical, High, Medium, Low) and explain reasoning.
7. Industry Context — How common is this threat in current cybersecurity landscapes?

Format the output as **structured, sectioned markdown** suitable for a professional security report.
`;

    // 🔹 3. Call OpenAI
    const result = await generateAIText(prompt, {
      model: "gpt-4o-2024-05-13",
      maxTokens: 2000,
      temperature: 0.3,
    });

    // 🔹 4. Handle AI failures
    if (!result.success) {
      console.error("AI generation failed:", result.error);
      return NextResponse.json(
        { success: false, error: result.error || "Failed to generate analysis" },
        { status: 500 }
      );
    }

    const analysis = result.text?.trim() || "No analysis generated.";

    // 🔹 5. Optional: store in tenant DB (if needed)
    // await tenantDb`
    //   INSERT INTO threat_analyses (threat_name, threat_category, analysis, created_at)
    //   VALUES (${threatName}, ${threatCategory || null}, ${analysis}, NOW())
    // `;

    // 🔹 6. Return successful response
    return NextResponse.json({
      success: true,
      threatName,
      analysis,
      timestamp: new Date().toISOString(),
    });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Unknown error occurred";

    console.error("❌ Error analyzing threat:", message);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to analyze threat",
        details: message,
      },
      { status: 500 }
    );
  }
});