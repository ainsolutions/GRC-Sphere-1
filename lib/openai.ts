import { createOpenAI } from "@ai-sdk/openai";
import { generateText } from "ai";

// ✅ Initialize OpenAI client correctly
export const openaiClient = createOpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

// ✅ Helper to generate text with OpenAI models
export async function generateAIText(
  prompt: string,
  options?: { model?: string; maxTokens?: number; temperature?: number }
) {
  try {
    if (!process.env.OPENAI_API_KEY) {
      throw new Error("OpenAI API key is not configured");
    }

    const modelName = options?.model || "gpt-4o-mini";
    const model = openaiClient(modelName); // ✅ correct way to call the model

    const result = await generateText({
      model,
      prompt,
      maxOutputTokens: options?.maxTokens || 1000, // ✅ correct property name
      temperature: options?.temperature ?? 0.7,
    });

    return {
      success: true,
      text: result.text,
      usage: result.usage,
    };
  } catch (error) {
    console.error("OpenAI API Error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}

// Utility function for risk assessment analysis
export async function analyzeRiskAssessment(riskData: any) {
  const prompt = `
    Analyze the following risk assessment data and provide insights:
    
    Risk Data: ${JSON.stringify(riskData, null, 2)}
    
    Please provide:
    1. Risk level assessment
    2. Recommended mitigation strategies
    3. Priority recommendations
    4. Compliance considerations
    
    Format the response in a structured way.
  `;

  return generateAIText(prompt, {
    model: 'gpt-4o-2024-05-13',
    maxTokens: 1500,
    temperature: 0.3,
  });
}

// Utility function for compliance analysis
export async function analyzeCompliance(complianceData: any) {
  const prompt = `
    Analyze the following compliance data and provide recommendations:
    
    Compliance Data: ${JSON.stringify(complianceData, null, 2)}
    
    Please provide:
    1. Compliance status assessment
    2. Gap analysis
    3. Remediation recommendations
    4. Best practices suggestions
    
    Format the response in a structured way.
  `;

  return generateAIText(prompt, {
    model: 'gpt-4o-2024-05-13',
    maxTokens: 1500,
    temperature: 0.3,
  });
}

// Utility function for governance recommendations
export async function generateGovernanceRecommendations(governanceData: any) {
  const prompt = `
    Based on the following governance data, provide strategic recommendations:
    
    Governance Data: ${JSON.stringify(governanceData, null, 2)}
    
    Please provide:
    1. Strategic recommendations
    2. Performance improvement suggestions
    3. Budget optimization recommendations
    4. Policy enhancement suggestions
    
    Format the response in a structured way.
  `;

  return generateAIText(prompt, {
    model: 'gpt-4o-2024-05-13',
    maxTokens: 1500,
    temperature: 0.4,
  });
}

// Utility function for incident response recommendations
export async function generateIncidentResponse(incidentData: any) {
  const prompt = `
    Analyze the following incident data and provide response recommendations:
    
    Incident Data: ${JSON.stringify(incidentData, null, 2)}
    
    Please provide:
    1. Incident severity assessment
    2. Immediate response actions
    3. Investigation steps
    4. Prevention measures
    
    Format the response in a structured way.
  `;

  return generateAIText(prompt, {
    model: 'gpt-4o-2024-05-13',
    maxTokens: 1200,
    temperature: 0.2,
  });
}

// Utility function for asset classification
export async function classifyAsset(assetData: any) {
  const prompt = `
    Classify the following information asset based on its characteristics:
    
    Asset Data: ${JSON.stringify(assetData, null, 2)}
    
    Please provide:
    1. Asset classification (Critical/High/Medium/Low)
    2. Justification for classification
    3. Security requirements
    4. Protection recommendations
    
    Format the response in a structured way.
  `;

  return generateAIText(prompt, {
    model: 'gpt-4o-2024-05-13',
    maxTokens: 800,
    temperature: 0.3,
  });
}

