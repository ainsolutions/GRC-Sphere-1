"use client"

import type React from "react"
import StarBorder from "@/app/StarBorder"
import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { MessageCircle, Send, Bot, User, Loader2 } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

interface Message {
  id: string
  type: "bot" | "user"
  content: string
  timestamp: Date
}

interface TechnologyRiskData {
  title?: string
  description?: string
  technology_category?: string
  technology_type?: string
  asset_ids?: string // Changed from string[] to string to match form
  owner?: string
  status?: string
  likelihood?: number
  impact?: number
  residual_likelihood?: number // Added residual risk fields
  residual_impact?: number
  current_controls?: string
  recommended_controls?: string
  control_assessment?: string // Added control assessment
  risk_treatment?: string
  treatment_state?: string
  action_owner?: string
  due_date?: string
  treatment_end_date?: string // Added treatment end date
}

const technologyCategories = [
  "Infrastructure",
  "Software",
  "Network",
  "Database",
  "Cloud Services",
  "Security Systems",
  "Communication",
  "Hardware",
  "Mobile",
  "IoT Devices",
  "AI/ML Systems",
  "Blockchain",
]

const technologyTypes = [
  "Server",
  "Application",
  "Operating System",
  "Firewall",
  "Router",
  "Switch",
  "Database Server",
  "Web Server",
  "Email Server",
  "Backup System",
  "Monitoring Tool",
  "Development Tool",
  "Third-party Service",
  "API",
  "Microservice",
  "Container",
  "Virtual Machine",
  "Storage System",
  "Network Protocol",
  "Authentication System",
]

const riskTreatments = ["mitigate", "transfer", "avoid", "accept"]
const treatmentStates = ["planned", "in-progress", "completed", "overdue", "cancelled"]
const statuses = ["open", "in-progress", "mitigated", "accepted", "closed"]

export function TechnologyRiskChatbot({ onRiskCreated }: { onRiskCreated?: () => void }) {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [riskData, setRiskData] = useState<TechnologyRiskData>({})
  const [assets, setAssets] = useState<any[]>([])
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  const steps = [
    { field: "title", question: "What is the title of this technology risk?", type: "text" },
    { field: "description", question: "Please provide a detailed description of this technology risk.", type: "text" },
    {
      field: "technology_category",
      question: "What technology category does this risk belong to?",
      type: "select",
      options: technologyCategories,
    },
    {
      field: "technology_type",
      question: "What specific technology type is this?",
      type: "select",
      options: technologyTypes,
    },
    {
      field: "asset_ids",
      question:
        "Which assets are affected by this risk? Please provide asset names separated by commas (or type 'none' if no specific assets).",
      type: "assets",
      optional: true,
    },
    { field: "owner", question: "Who is the risk owner (person responsible)?", type: "text" },
    {
      field: "likelihood",
      question: "What is the inherent likelihood of this risk occurring? (1-5, where 1 is Very Low and 5 is Very High)",
      type: "number",
      min: 1,
      max: 5,
    },
    {
      field: "impact",
      question: "What is the inherent impact if this risk occurs? (1-5, where 1 is Very Low and 5 is Very High)",
      type: "number",
      min: 1,
      max: 5,
    },
    {
      field: "current_controls",
      question: "What current controls are in place to manage this risk? (Optional)",
      type: "text",
      optional: true,
    },
    {
      field: "recommended_controls",
      question: "What additional controls do you recommend? (Optional)",
      type: "text",
      optional: true,
    },
    {
      field: "residual_likelihood",
      question:
        "After considering current controls, what is the residual likelihood? (1-5, where 1 is Very Low and 5 is Very High)",
      type: "number",
      min: 1,
      max: 5,
    },
    {
      field: "residual_impact",
      question:
        "After considering current controls, what is the residual impact? (1-5, where 1 is Very Low and 5 is Very High)",
      type: "number",
      min: 1,
      max: 5,
    },
    {
      field: "risk_treatment",
      question: "What is your preferred risk treatment strategy?",
      type: "select",
      options: riskTreatments,
    },
    {
      field: "action_owner",
      question: "Who will be responsible for implementing the risk treatment? (Optional)",
      type: "text",
      optional: true,
    },
  ]

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      initializeChat()
      fetchAssets()
    }
  }, [isOpen])

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
    }
  }, [messages])

  const fetchAssets = async () => {
    try {
      const response = await fetch("/api/assets?limit=100")
      const data = await response.json()
      if (data.success) {
        setAssets(data.assets || [])
      }
    } catch (error) {
      console.error("Error fetching assets:", error)
    }
  }

  const initializeChat = () => {
    const welcomeMessage: Message = {
      id: Date.now().toString(),
      type: "bot",
      content:
        "Hi! I'm here to help you create a new technology risk assessment. I'll ask you a series of questions to gather all the necessary information. Let's get started!",
      timestamp: new Date(),
    }
    setMessages([welcomeMessage])
    //setTimeout(() => askNextQuestion(0), 1000)
    setTimeout(() => {
      setCurrentStep(0)
      askNextQuestion(0)
    }, 800)
  }

  const askNextQuestion = (stepIndex: number) => {
    if (stepIndex < steps.length) {
      const step = steps[stepIndex]
      let questionText = step.question

      if (step.type === "select" && step.options) {
        questionText += `\n\nOptions: ${step.options.join(", ")}`
      }

      if (step.type === "assets") {
        const assetNames = assets.map((asset) => asset.asset_name || asset.name).slice(0, 10) // Show first 10 assets as examples
        if (assetNames.length > 0) {
          questionText += `\n\nAvailable assets include: ${assetNames.join(", ")}${assets.length > 10 ? "..." : ""}`
        }
      }

      if (step.optional) {
        questionText += "\n\n(You can skip this by typing 'skip')"
      }

      const questionMessage: Message = {
        id: Date.now().toString(),
        type: "bot",
        content: questionText,
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, questionMessage])
    } else {
      // All questions answered, show summary
      showSummary()
    }
  }

  const showSummary = () => {
    const inherentRiskScore = (riskData.likelihood || 1) * (riskData.impact || 1)
    const inherentRiskLevel = inherentRiskScore >= 15 ? "High" : inherentRiskScore >= 8 ? "Medium" : "Low"

    const residualRiskScore = (riskData.residual_likelihood || 1) * (riskData.residual_impact || 1)
    const residualRiskLevel = residualRiskScore >= 15 ? "High" : residualRiskScore >= 8 ? "Medium" : "Low"

    let affectedAssets = "None specified"
    if (riskData.asset_ids && riskData.asset_ids.trim() !== "") {
      const assetIds = riskData.asset_ids.split(",").map((id) => id.trim())
      const matchedAssets = assets.filter(
        (asset) => assetIds.includes(asset.id?.toString()) || assetIds.includes(asset.asset_id),
      )
      if (matchedAssets.length > 0) {
        affectedAssets = matchedAssets.map((a) => a.asset_name || a.name).join(", ")
      }
    }

    const summaryMessage: Message = {
      id: Date.now().toString(),
      type: "bot",
      content: `Great! I've collected all the information for your technology risk. Here's a summary:

**Risk Title:** ${riskData.title}
**Description:** ${riskData.description}
**Technology Category:** ${riskData.technology_category}
**Technology Type:** ${riskData.technology_type}
**Affected Assets:** ${affectedAssets}
**Risk Owner:** ${riskData.owner}
**Inherent Risk Score:** ${inherentRiskScore} (${inherentRiskLevel})
**Residual Risk Score:** ${residualRiskScore} (${residualRiskLevel})
**Treatment Strategy:** ${riskData.risk_treatment}
**Action Owner:** ${riskData.action_owner || "Not specified"}

Would you like me to create this technology risk? Type 'yes' to confirm or 'no' to cancel.`,
      timestamp: new Date(),
    }
    setMessages((prev) => [...prev, summaryMessage])
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!inputValue.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: inputValue.trim(),
      timestamp: new Date(),
    }
    setMessages((prev) => [...prev, userMessage])

    const userInput = inputValue.trim()
    setInputValue("")
    setIsLoading(true)

    try {
      if (currentStep < steps.length) {
        await processAnswer(userInput)
      } else {
        // Handle confirmation
        if (userInput && userInput.toLowerCase() === "yes") {
          await createTechnologyRisk()
        } else if (userInput && userInput.toLowerCase() === "no") {
          const cancelMessage: Message = {
            id: Date.now().toString(),
            type: "bot",
            content: "No problem! The technology risk creation has been cancelled. Feel free to start over anytime.",
            timestamp: new Date(),
          }
          setMessages((prev) => [...prev, cancelMessage])
        } else {
          const clarifyMessage: Message = {
            id: Date.now().toString(),
            type: "bot",
            content: "Please type 'yes' to create the technology risk or 'no' to cancel.",
            timestamp: new Date(),
          }
          setMessages((prev) => [...prev, clarifyMessage])
        }
      }
    } catch (error) {
      console.error("Error processing answer:", error)
      const errorMessage: Message = {
        id: Date.now().toString(),
        type: "bot",
        content: "Sorry, there was an error processing your response. Please try again.",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const processAnswer = async (answer: string) => {
    const step = steps[currentStep]

    if (step.optional && (answer?.toLowerCase() === "skip" || answer?.toLowerCase() === "none")) {
      // Just update the step. The useEffect hook will do the rest.
      setCurrentStep((prev) => prev + 1)
      return
    }


    let processedValue: any = answer

    if (step.type === "number") {
      const num = Number.parseInt(answer)
      if (isNaN(num) || num < (step.min || 1) || num > (step.max || 5)) {
        const errorMessage: Message = {
          id: Date.now().toString(),
          type: "bot",
          content: `Please enter a valid number between ${step.min || 1} and ${step.max || 5}.`,
          timestamp: new Date(),
        }
        setMessages((prev) => [...prev, errorMessage])
        return
      }
      processedValue = num
    } else if (step.type === "select" && step.options) {
      const matchedOption = step.options.find((option) => option?.toLowerCase() === answer?.toLowerCase())
      if (!matchedOption) {
        const errorMessage: Message = {
          id: Date.now().toString(),
          type: "bot",
          content: `Please select one of the following options: ${step.options.join(", ")}`,
          timestamp: new Date(),
        }
        setMessages((prev) => [...prev, errorMessage])
        return
      }
      processedValue = matchedOption
    } else if (step.type === "assets") {
      if (answer?.toLowerCase() !== "none") {
        const assetNames = answer.split(",").map((name) => name.trim())
        const matchedAssets = assets.filter((asset) =>
          assetNames.some((name) => {
            const assetName = asset?.asset_name || asset?.name || ""
            return name && assetName && assetName.toLowerCase().includes(name.toLowerCase())
          }),
        )

        if (matchedAssets.length === 0) {
          const errorMessage: Message = {
            id: Date.now().toString(),
            type: "bot",
            content: `I couldn't find any assets matching "${answer}". Please check the asset names or type 'none' if no specific assets are affected.`,
            timestamp: new Date(),
          }
          setMessages((prev) => [...prev, errorMessage])
          return
        }

        processedValue = matchedAssets.map((asset) => asset.id || asset.asset_id).join(",")

        const confirmMessage: Message = {
          id: Date.now().toString(),
          type: "bot",
          content: `Great! I found ${matchedAssets.length} matching asset(s): ${matchedAssets.map((a) => a.asset_name || a.name).join(", ")}`,
          timestamp: new Date(),
        }
        setMessages((prev) => [...prev, confirmMessage])
      } else {
        processedValue = null // Set to null instead of empty array to match form
      }
    }

    setRiskData((prev) => ({
      ...prev,
      [step.field]: processedValue,
    }))
    setCurrentStep((prev) => prev + 1)
  }


  useEffect(() => {
    if (currentStep > 0 && currentStep <= steps.length) {

      if (messages.length > 0 && messages[messages.length - 1].type === "user") {
        if (currentStep < steps.length) {
          setTimeout(() => askNextQuestion(currentStep), 800)
        } else {

          setTimeout(() => showSummary(), 800)
        }
      }
    }
  }, [currentStep])

  const createTechnologyRisk = async () => {
    try {
      const submitData = {
        ...riskData,
        status: "open",
        treatment_state: "planned",
        risk_category: "Technology", // Added required field
        // Convert asset_ids string to array for API if needed
        asset_ids: riskData.asset_ids ? riskData.asset_ids.split(",").map((id) => id.trim()) : null,
      }

      const response = await fetch("/api/technology-risks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(submitData),
      })

      const result = await response.json()

      if (result.success) {
        const successMessage: Message = {
          id: Date.now().toString(),
          type: "bot",
          content: `🎉 Technology risk created successfully! Risk ID: ${result.data.risk_id}. You can now close this chat and view your new risk in the technology risks list.`,
          timestamp: new Date(),
        }
        setMessages((prev) => [...prev, successMessage])

        if (onRiskCreated) {
          onRiskCreated()
        }
      } else {
        throw new Error(result.error || "Failed to create technology risk")
      }
    } catch (error) {
      console.error("Error creating technology risk:", error)
      const errorMessage: Message = {
        id: Date.now().toString(),
        type: "bot",
        content: `Sorry, there was an error creating the technology risk: ${error instanceof Error ? error.message : "Unknown error"}. Please try again or use the manual form.`,
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorMessage])
    }
  }

  const resetChat = () => {
    setMessages([])
    setCurrentStep(0)
    setRiskData({})
    setInputValue("")
    setIsLoading(false)
  }

  const handleClose = () => {
    setIsOpen(false)
    resetChat()
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          AI Risk Assistant
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] p-0">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle className="flex items-center gap-2">
            <Bot className="h-5 w-5 text-blue-600" />
            Technology Risk Assistant
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col h-[60vh]">
          <ScrollArea className="flex-1 p-6" ref={scrollAreaRef}>
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex items-start gap-3 ${message.type === "user" ? "flex-row-reverse" : ""}`}
                >
                  <div
                    className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${message.type === "bot" ? "bg-blue-100 text-blue-600" : "bg-gray-100 text-gray-600"
                      }`}
                  >
                    {message.type === "bot" ? <Bot className="h-4 w-4" /> : <User className="h-4 w-4" />}
                  </div>
                  <div className={`flex-1 max-w-[80%] ${message.type === "user" ? "text-right" : ""}`}>
                    <div
                      className={`inline-block p-3 rounded-lg whitespace-pre-wrap ${message.type === "bot" ? "bg-gray-100 text-gray-900" : "bg-blue-600 text-white"
                        }`}
                    >
                      {message.content}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">{message.timestamp.toLocaleTimeString()}</div>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
                    <Bot className="h-4 w-4" />
                  </div>
                  <div className="flex-1">
                    <div className="inline-block p-3 rounded-lg bg-gray-100">
                      <Loader2 className="h-4 w-4 animate-spin" />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          <div className="border-t p-4">
            <form onSubmit={handleSubmit} className="flex gap-2">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Type your response..."
                disabled={isLoading}
                className="flex-1"
              />
              <Button type="submit" disabled={isLoading || !inputValue.trim()}>
                <Send className="h-4 w-4" />
              </Button>
            </form>
            <div className="flex justify-between items-center mt-2">
              <div className="text-xs text-gray-500">
                {currentStep < steps.length ? `Step ${currentStep + 1} of ${steps.length}` : "Ready to create"}
              </div>
              <Button variant="ghost" size="sm" onClick={resetChat} className="text-xs">
                Start Over
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
