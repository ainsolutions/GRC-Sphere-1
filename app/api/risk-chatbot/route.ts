import { type NextRequest, NextResponse } from "next/server"
import { withContext } from "@/lib/HttpContext"


interface ChatbotState {
  step: number
  data: Record<string, any>
  completed: boolean
}

// In-memory storage for conversation states (in production, use Redis or database)
const conversationStates = new Map<string, ChatbotState>()

const steps = [
  "risk_title",
  "risk_description",
  "category_id",
  "asset_id",
  "threat_source",
  "vulnerability",
  "likelihood_score",
  "impact_score",
  "risk_owner",
  "risk_status",
  "identified_date",
  "next_review_date",
  "existing_controls",
  "risk_treatment",
  "risk_treatment_plan",
  "review_frequency",
]

async function getRiskCategories(tenantDb: any) {
  try {
    const categories = await tenantDb`SELECT id, category_name FROM risk_categories ORDER BY category_name`
    return categories
  } catch (error) {
    console.error("Error fetching categories:", error)
    return []
  }
}

async function getAssets(tenantDb: any) {
  try {
    const assets = await tenantDb`SELECT id, asset_name FROM information_assets ORDER BY asset_name`
    return assets
  } catch (error) {
    console.error("Error fetching assets:", error)
    return []
  }
}

function validateInput(step: string, value: string): { isValid: boolean; errorMsg: string } {
  switch (step) {
    case "risk_title":
      return {
        isValid: value.trim().length >= 3,
        errorMsg: "Risk title must be at least 3 characters long",
      }
    case "risk_description":
      return {
        isValid: value.trim().length >= 10,
        errorMsg: "Risk description must be at least 10 characters long",
      }
    case "category_id":
      try {
        const catId = Number.parseInt(value)
        return {
          isValid: !isNaN(catId) && catId > 0,
          errorMsg: "Please enter a valid category ID number",
        }
      } catch {
        return { isValid: false, errorMsg: "Please enter a valid number" }
      }
    case "asset_id":
      try {
        const assetId = Number.parseInt(value)
        return {
          isValid: !isNaN(assetId) && assetId > 0,
          errorMsg: "Please enter a valid asset ID number",
        }
      } catch {
        return { isValid: false, errorMsg: "Please enter a valid number" }
      }
    case "likelihood_score":
    case "impact_score":
      try {
        const score = Number.parseInt(value)
        return {
          isValid: score >= 1 && score <= 5,
          errorMsg: "Score must be between 1 and 5",
        }
      } catch {
        return { isValid: false, errorMsg: "Please enter a valid number between 1 and 5" }
      }
    case "risk_owner":
      return {
        isValid: value.trim().length >= 2,
        errorMsg: "Risk owner must be at least 2 characters long",
      }
    case "risk_status":
      const validStatuses = ["Open", "In Progress", "Closed", "Under Review"]
      return {
        isValid: validStatuses.includes(value),
        errorMsg: `Status must be one of: ${validStatuses.join(", ")}`,
      }
    case "identified_date":
    case "next_review_date":
      try {
        const date = new Date(value)
        return {
          isValid: !isNaN(date.getTime()) && /^\d{4}-\d{2}-\d{2}$/.test(value),
          errorMsg: "Please enter date in YYYY-MM-DD format",
        }
      } catch {
        return { isValid: false, errorMsg: "Please enter date in YYYY-MM-DD format" }
      }
    case "existing_controls":
      return {
        isValid: value.trim().length >= 5,
        errorMsg: "Existing controls description must be at least 5 characters long",
      }
    case "risk_treatment":
      const validTreatments = ["Accept", "Mitigate", "Transfer", "Avoid"]
      return {
        isValid: validTreatments.includes(value),
        errorMsg: `Treatment must be one of: ${validTreatments.join(", ")}`,
      }
    case "risk_treatment_plan":
      return {
        isValid: value.trim().length >= 10,
        errorMsg: "Treatment plan must be at least 10 characters long",
      }
    case "review_frequency":
      const validFrequencies = ["Monthly", "Quarterly", "Semi-annually", "Annually"]
      return {
        isValid: validFrequencies.includes(value),
        errorMsg: `Frequency must be one of: ${validFrequencies.join(", ")}`,
      }
    default:
      return { isValid: true, errorMsg: "" }
  }
}

async function getStepPrompt(step: string, tenantDb: any): Promise<string> {
  const prompts: Record<string, string | (() => Promise<string>)> = {
    risk_title: "What is the title of this risk? (e.g., 'Data breach due to weak passwords')",
    risk_description: "Please provide a detailed description of this risk:",
    category_id: async () => {
      const categories = await getRiskCategories(tenantDb)
      if (categories.length === 0) {
        return "Please enter the risk category ID:"
      }
      let prompt = "Please select a risk category by entering its ID:\n"
      categories.forEach((cat: any) => {
        prompt += `${cat.id}: ${cat.category_name}\n`
      })
      return prompt
    },
    asset_id: async () => {
      const assets = await getAssets(tenantDb)
      if (assets.length === 0) {
        return "Please enter the asset ID:"
      }
      let prompt = "Please select an asset by entering its ID:\n"
      assets.forEach((asset: any) => {
        prompt += `${asset.id}: ${asset.asset_name}\n`
      })
      return prompt
    },
    threat_source: "What is the threat source? (e.g., 'External hackers', 'Malicious insiders', 'Natural disasters')",
    vulnerability: "What vulnerability could be exploited? (e.g., 'Weak password policy', 'Unpatched software')",
    likelihood_score: "What is the likelihood score (1-5)?\n1 = Very Low, 2 = Low, 3 = Medium, 4 = High, 5 = Very High",
    impact_score: "What is the impact score (1-5)?\n1 = Very Low, 2 = Low, 3 = Medium, 4 = High, 5 = Very High",
    risk_owner: "Who is the risk owner? (person responsible for managing this risk)",
    risk_status: "What is the current risk status?\nOptions: Open, In Progress, Closed, Under Review",
    identified_date: "When was this risk identified? (YYYY-MM-DD format)",
    next_review_date: "When should this risk be reviewed next? (YYYY-MM-DD format)",
    existing_controls: "What existing controls are in place to mitigate this risk?",
    risk_treatment: "What is the risk treatment strategy?\nOptions: Accept, Mitigate, Transfer, Avoid",
    risk_treatment_plan: "Please describe the risk treatment plan in detail:",
    review_frequency: "How often should this risk be reviewed?\nOptions: Monthly, Quarterly, Semi-annually, Annually",
  }

  const prompt = prompts[step]
  if (typeof prompt === "function") {
    return await prompt()
  }
  return prompt || "Please provide the required information:"
}

async function getSummary(data: Record<string, any>, tenantDb: any): Promise<string> {
  const categories = await getRiskCategories(tenantDb)
  const assets = await getAssets(tenantDb)

  const category = categories.find((cat: any) => cat.id === data.category_id)
  const asset = assets.find((asset: any) => asset.id === data.asset_id)

  const inherentRiskScore = (data.likelihood_score || 0) * (data.impact_score || 0)

  return `📋 **Risk Summary:**

**Basic Information:**
• Title: ${data.risk_title || "N/A"}
• Description: ${data.risk_description || "N/A"}
• Category: ${category?.category_name || "Unknown"}
• Asset: ${asset?.asset_name || "Unknown"}

**Risk Assessment:**
• Threat Source: ${data.threat_source || "N/A"}
• Vulnerability: ${data.vulnerability || "N/A"}
• Likelihood Score: ${data.likelihood_score || "N/A"}/5
• Impact Score: ${data.impact_score || "N/A"}/5
• Inherent Risk Score: ${inherentRiskScore}

**Management:**
• Risk Owner: ${data.risk_owner || "N/A"}
• Status: ${data.risk_status || "N/A"}
• Treatment: ${data.risk_treatment || "N/A"}
• Review Frequency: ${data.review_frequency || "N/A"}

**Dates:**
• Identified: ${data.identified_date || "N/A"}
• Next Review: ${data.next_review_date || "N/A"}

**Controls & Treatment:**
• Existing Controls: ${data.existing_controls || "N/A"}
• Treatment Plan: ${data.risk_treatment_plan || "N/A"}`
}

async function saveRisk(data: Record<string, any>, tenantDb: any) {
  try {
    const inherentRiskScore = data.likelihood_score * data.impact_score

    const result = await tenantDb`
      INSERT INTO risks (
        risk_title, risk_description, category_id, asset_id,
        threat_source, vulnerability, likelihood_score, impact_score,
        inherent_risk_score, risk_owner, risk_status, identified_date,
        next_review_date, existing_controls, risk_treatment,
        risk_treatment_plan, review_frequency
      ) VALUES (
        ${data.risk_title}, ${data.risk_description}, ${data.category_id}, ${data.asset_id},
        ${data.threat_source}, ${data.vulnerability}, ${data.likelihood_score}, ${data.impact_score},
        ${inherentRiskScore}, ${data.risk_owner}, ${data.risk_status}, ${data.identified_date},
        ${data.next_review_date}, ${data.existing_controls}, ${data.risk_treatment},
        ${data.risk_treatment_plan}, ${data.review_frequency}
      ) RETURNING id, risk_id
    `

    return {
      success: true,
      risk_id: result[0].risk_id,
      id: result[0].id,
    }
  } catch (error) {
    console.error("Error saving risk:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}

export const POST = withContext(async({ tenantDb }, request) => {
  try {
    const { message } = await request.json()
    const sessionId = "default" // In production, use proper session management

    let state = conversationStates.get(sessionId) || {
      step: 0,
      data: {},
      completed: false,
    }

    if (state.completed) {
      if (message.toLowerCase() === "restart") {
        state = { step: 0, data: {}, completed: false }
        conversationStates.set(sessionId, state)
        const prompt = await getStepPrompt(steps[0], tenantDb)
        return NextResponse.json({
          response: "Let's register a new risk! " + prompt,
          completed: false,
          step: 0,
          total_steps: steps.length,
        })
      }
      return NextResponse.json({
        response: "Risk registration completed! Type 'restart' to register another risk.",
        completed: true,
        step: steps.length,
        total_steps: steps.length,
      })
    }

    if (message.toLowerCase() === "restart") {
      state = { step: 0, data: {}, completed: false }
      conversationStates.set(sessionId, state)
      const prompt = await getStepPrompt(steps[0], tenantDb)
      return NextResponse.json({
        response: "Let's register a new risk! " + prompt,
        completed: false,
        step: 0,
        total_steps: steps.length,
      })
    }

    const currentStep = state.step

    if (currentStep >= steps.length) {
      // Show summary and confirm
      if (message.toLowerCase() === "yes" || message.toLowerCase() === "y" || message.toLowerCase() === "confirm") {
        const result = await saveRisk(state.data, tenantDb)
        if (result.success) {
          state.completed = true
          conversationStates.set(sessionId, state)
          return NextResponse.json({
            response: `✅ Risk successfully registered with ID: ${result.risk_id}!\n\nType 'restart' to register another risk.`,
            completed: true,
            step: steps.length,
            total_steps: steps.length,
          })
        } else {
          return NextResponse.json({
            response: `❌ Error saving risk: ${result.error}\n\nType 'restart' to try again.`,
            completed: false,
            step: currentStep,
            total_steps: steps.length,
          })
        }
      } else if (
        message.toLowerCase() === "no" ||
        message.toLowerCase() === "n" ||
        message.toLowerCase() === "cancel"
      ) {
        state = { step: 0, data: {}, completed: false }
        conversationStates.set(sessionId, state)
        const prompt = await getStepPrompt(steps[0], tenantDb)
        return NextResponse.json({
          response: "Risk registration cancelled. Let's start over!\n\n" + prompt,
          completed: false,
          step: 0,
          total_steps: steps.length,
        })
      } else {
        const summary = await getSummary(state.data, tenantDb)
        return NextResponse.json({
          response: summary + "\n\nPlease confirm by typing 'yes' or 'no':",
          completed: false,
          step: currentStep,
          total_steps: steps.length,
        })
      }
    }

    const stepName = steps[currentStep]
    const validation = validateInput(stepName, message)

    if (!validation.isValid) {
      const prompt = await getStepPrompt(stepName, tenantDb)
      return NextResponse.json({
        response: `❌ ${validation.errorMsg}\n\n${prompt}`,
        completed: false,
        step: currentStep,
        total_steps: steps.length,
      })
    }

    // Store the validated input
    if (
      stepName === "category_id" ||
      stepName === "asset_id" ||
      stepName === "likelihood_score" ||
      stepName === "impact_score"
    ) {
      state.data[stepName] = Number.parseInt(message)
    } else {
      state.data[stepName] = message
    }

    state.step += 1
    conversationStates.set(sessionId, state)

    if (state.step >= steps.length) {
      // Show summary
      const summary = await getSummary(state.data, tenantDb)
      return NextResponse.json({
        response: summary + "\n\nDo you want to save this risk? (yes/no)",
        completed: false,
        step: state.step,
        total_steps: steps.length,
      })
    } else {
      // Move to next step
      const nextStep = steps[state.step]
      const prompt = await getStepPrompt(nextStep, tenantDb)
      return NextResponse.json({
        response: `✅ Got it!\n\n${prompt}`,
        completed: false,
        step: state.step,
        total_steps: steps.length,
      })
    }
  } catch (error) {
    console.error("Risk chatbot error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
});
