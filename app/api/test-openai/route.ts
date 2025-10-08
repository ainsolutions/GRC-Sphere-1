import { type NextRequest, NextResponse } from "next/server"
import { withContext } from "@/lib/HttpContext"
import { generateAIText } from "@/lib/openai"

export const GET = withContext(async({ tenantDb }, request) => {
  try {
    console.log("Testing OpenAI connection...")
    console.log("OPENAI_API_KEY exists:", !!process.env.OPENAI_API_KEY)
    console.log("OPENAI_API_KEY starts with sk-:", process.env.OPENAI_API_KEY?.startsWith("sk-"))

    const testPrompt = "Say 'Hello, OpenAI is working!' in exactly those words."

    const result = await generateAIText(testPrompt, {
      model: "gpt-4o-2024-05-13",
      maxTokens: 50,
      temperature: 0.1
    })

    console.log("OpenAI test result:", result)

    return NextResponse.json({
      success: result.success,
      message: result.success ? result.text : result.error,
      hasApiKey: !!process.env.OPENAI_API_KEY,
      apiKeyPrefix: process.env.OPENAI_API_KEY?.substring(0, 10) + "..."
    })

  } catch (error: any) {
    console.error("OpenAI test error:", error)
    return NextResponse.json(
      {
        success: false,
        error: error.message,
        hasApiKey: !!process.env.OPENAI_API_KEY,
        stack: error.stack
      },
      { status: 500 }
    )
  }
});
