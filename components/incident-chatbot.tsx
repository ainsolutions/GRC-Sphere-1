"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Progress } from "@/components/ui/progress"
import { MessageCircle, Send, X, Bot, User, Loader2 } from "lucide-react"
import { createIncidentFromChatbot } from "@/lib/actions/incident-actions"
import { toast } from "@/hooks/use-toast"
import { ChatbotButton } from "./ui/chatbotButton"

interface Message {
  id: string
  type: "bot" | "user"
  content: string
  timestamp: Date
}

// Update the interface to match the database schema
interface IncidentData {
  incident_id?: string
  incident_title?: string
  incident_description?: string
  incident_type?: string
  severity?: string
  status?: string
  reported_by?: string
  assigned_to?: string
  detected_date?: string
  reported_date?: string
  related_asset_id?: number
  related_risk_id?: number
}

interface IncidentChatbotProps {
  onIncidentCreated?: () => void
}

const INCIDENT_TYPES = [
  "Security Breach",
  "Data Loss",
  "System Failure",
  "Malware",
  "Phishing",
  "Unauthorized Access",
  "Other",
]

const SEVERITY_LEVELS = ["Low", "Medium", "High", "Critical"]

const CONVERSATION_STEPS = [
  "greeting",
  "title",
  "description",
  "type",
  "severity",
  "reporter",
  "assignee",
  "detection_date",
  "confirmation",
  "submission",
]

export function IncidentChatbot({ onIncidentCreated }: IncidentChatbotProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [currentInput, setCurrentInput] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [incidentData, setIncidentData] = useState<IncidentData>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const addMessage = (type: "bot" | "user", content: string) => {
    const message: Message = {
      id: Date.now().toString(),
      type,
      content,
      timestamp: new Date(),
    }
    setMessages((prev) => [...prev, message])
  }

  const addBotMessage = async (content: string, delay = 1000) => {
    setIsTyping(true)
    await new Promise((resolve) => setTimeout(resolve, delay))
    setIsTyping(false)
    addMessage("bot", content)
  }

  const resetConversation = () => {
    setMessages([])
    setCurrentStep(0)
    setIncidentData({})
    setCurrentInput("")
    setIsSubmitting(false)
  }

  const startConversation = async () => {
    resetConversation()
    await addBotMessage(
      "👋 Hello! I'm here to help you report a security incident. I'll guide you through the process step by step.\n\nLet's start with the incident title. Please provide a brief, descriptive title for this incident:",
      500,
    )
    setCurrentStep(1)
  }

  const handleNextStep = async (userInput: string) => {
    addMessage("user", userInput)

    const step = CONVERSATION_STEPS[currentStep]

    switch (step) {
      case "title":
        setIncidentData((prev) => ({ ...prev, incident_title: userInput }))
        await addBotMessage(
          "Great! Now please provide a detailed description of the incident. Include what happened, when you noticed it, and any other relevant details:",
        )
        setCurrentStep(2)
        break

      case "description":
        setIncidentData((prev) => ({ ...prev, incident_description: userInput }))
        await addBotMessage(
          `Perfect! Now, what type of incident is this? Please choose from the following options or type the number:\n\n${INCIDENT_TYPES.map((type, index) => `${index + 1}. ${type}`).join("\n")}`,
        )
        setCurrentStep(3)
        break

      case "type":
        let selectedType = userInput
        const typeIndex = Number.parseInt(userInput) - 1
        if (typeIndex >= 0 && typeIndex < INCIDENT_TYPES.length) {
          selectedType = INCIDENT_TYPES[typeIndex]
        } else if (!INCIDENT_TYPES.includes(userInput)) {
          selectedType = INCIDENT_TYPES.find((type) => type.toLowerCase().includes(userInput.toLowerCase())) || "Other"
        }

        setIncidentData((prev) => ({ ...prev, incident_type: selectedType }))
        await addBotMessage(
          `Got it! The incident type is "${selectedType}".\n\nNow, what's the severity level? Please choose:\n\n${SEVERITY_LEVELS.map((level, index) => `${index + 1}. ${level}`).join("\n")}`,
        )
        setCurrentStep(4)
        break

      case "severity":
        let selectedSeverity = userInput
        const severityIndex = Number.parseInt(userInput) - 1
        if (severityIndex >= 0 && severityIndex < SEVERITY_LEVELS.length) {
          selectedSeverity = SEVERITY_LEVELS[severityIndex]
        } else if (!SEVERITY_LEVELS.includes(userInput)) {
          selectedSeverity =
            SEVERITY_LEVELS.find((level) => level.toLowerCase().includes(userInput.toLowerCase())) || "Medium"
        }

        setIncidentData((prev) => ({ ...prev, severity: selectedSeverity }))
        await addBotMessage(
          `Severity level set to "${selectedSeverity}".\n\nWho is reporting this incident? Please provide the reporter's name:`,
        )
        setCurrentStep(5)
        break

      case "reporter":
        setIncidentData((prev) => ({ ...prev, reported_by: userInput }))
        await addBotMessage(
          "Thank you! Now, who should this incident be assigned to? Please provide the assignee's name:",
        )
        setCurrentStep(6)
        break

      case "assignee":
        setIncidentData((prev) => ({ ...prev, assigned_to: userInput }))
        await addBotMessage(
          "Excellent! When was this incident first detected? You can provide a date/time or just say 'now' for the current time:",
        )
        setCurrentStep(7)
        break

      case "detection_date":
        let detectionDate = new Date().toISOString()
        if (userInput.toLowerCase() !== "now") {
          try {
            detectionDate = new Date(userInput).toISOString()
          } catch {
            // Keep current time if parsing fails
          }
        }

        setIncidentData((prev) => ({
          ...prev,
          detected_date: detectionDate,
          reported_date: new Date().toISOString(),
        }))

        const finalData = {
          ...incidentData,
          detected_date: detectionDate,
          reported_date: new Date().toISOString(),
        }

        await addBotMessage(
          `Perfect! Let me summarize the incident details:\n\n**Title:** ${finalData.incident_title}\n**Description:** ${finalData.incident_description}\n**Type:** ${finalData.incident_type}\n**Severity:** ${finalData.severity}\n**Reporter:** ${finalData.reported_by}\n**Assignee:** ${finalData.assigned_to}\n**Detection Date:** ${new Date(detectionDate).toLocaleString()}\n\nDoes this look correct? Type 'yes' to submit or 'no' to start over:`,
        )
        setCurrentStep(8)
        break

      case "confirmation":
        if (userInput.toLowerCase().includes("yes") || userInput.toLowerCase().includes("confirm")) {
          await submitIncident()
        } else {
          await addBotMessage("No problem! Let's start over. Click the 'Start New Report' button to begin again.")
          resetConversation()
        }
        break
    }
  }

  const submitIncident = async () => {
    setIsSubmitting(true)
    await addBotMessage("Submitting your incident report...", 500)

    try {
      // Update the createIncidentFromChatbot call to use the correct field names
      const result = await createIncidentFromChatbot({
        incident_id: incidentData.incident_id,
        incident_title: incidentData.incident_title,
        incident_description: incidentData.incident_description,
        incident_type: incidentData.incident_type,
        severity: incidentData.severity,
        status: "Open",
        reported_by: incidentData.reported_by,
        assigned_to: incidentData.assigned_to,
        detected_date: incidentData.detected_date,
        reported_date: new Date().toISOString(),
        related_asset_id: incidentData.related_asset_id,
        related_risk_id: incidentData.related_risk_id,
      })

      if (result.success) {
        await addBotMessage(
          `✅ Incident successfully reported!\n\n**Incident ID:** ${result.data.incident_id}\n\nThe incident has been logged in the system and the assigned person will be notified. Thank you for reporting this incident!`,
          1000,
        )

        toast({
          title: "Success",
          description: `Incident ${result.data.incident_id} has been successfully reported`,
        })

        if (onIncidentCreated) {
          onIncidentCreated()
        }
      } else {
        await addBotMessage(
          "❌ Sorry, there was an error submitting your incident report. Please try again or use the manual form.",
          1000,
        )

        toast({
          title: "Error",
          description: "Failed to submit incident report",
          variant: "destructive",
        })
      }
    } catch (error) {
      await addBotMessage(
        "❌ Sorry, there was an error submitting your incident report. Please try again or use the manual form.",
        1000,
      )

      toast({
        title: "Error",
        description: "Failed to submit incident report",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
      setCurrentStep(9)
    }
  }

  const handleSendMessage = async () => {
    if (!currentInput.trim() || isTyping || isSubmitting) return

    const input = currentInput.trim()
    setCurrentInput("")

    if (currentStep === 0) {
      await startConversation()
    } else if (currentStep < CONVERSATION_STEPS.length - 1) {
      await handleNextStep(input)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const getProgress = () => {
    return Math.round((currentStep / (CONVERSATION_STEPS.length - 1)) * 100)
  }

  return (
    <>
      {/* Floating Chat Button */}
      <ChatbotButton
        className=""
        onClick={() => setIsOpen(true)}
        icon={<MessageCircle className="h-6 w-6" />}
      />
      
      {/* <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 h-20 w-20 rounded-full border-4 border-cyan-400 shadow-lg bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:scale-105 transition-transform z-50"
        size="icon"
      >
        <MessageCircle className="h-6 w-6" />
      </Button> */}

      {/* Chat Dialog */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-2xl h-[80vh] flex flex-col p-0">
          <DialogHeader className="p-6 pb-4 border-b">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="h-14 w-14 rounded-full bg-gradient-to-r from-cyan-800 to-purple-600 flex items-center justify-center">
                  <Bot className="h-5 w-5 text-white" />
                </div>
                <div>
                  <DialogTitle>Incident Reporting Assistant</DialogTitle>
                  <p className="text-sm text-muted-foreground">AI-powered incident reporting</p>
                </div>
              </div>
              <Button variant="outline" size="icon" onClick={() => setIsOpen(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>

            {currentStep > 0 && currentStep < CONVERSATION_STEPS.length - 1 && (
              <div className="mt-4">
                <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
                  <span>Progress</span>
                  <span>{getProgress()}%</span>
                </div>
                <Progress value={getProgress()} className="h-2" />
              </div>
            )}
          </DialogHeader>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {messages.length === 0 && (
              <div className="text-center py-8">
                <Bot className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">Welcome to Incident Reporting</h3>
                <p className="text-muted-foreground mb-4">
                  I'll help you report a security incident quickly and efficiently.
                </p>
                <Button onClick={startConversation}>
                  Start New Report
                </Button>
              </div>
            )}

            {messages.map((message) => (
              <div key={message.id} className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`flex items-start space-x-2 max-w-[80%] ${
                    message.type === "user" ? "flex-row-reverse space-x-reverse" : ""
                  }`}
                >
                  <div
                    className={`h-8 w-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                      message.type === "user" ? "bg-blue-500" : "bg-gradient-to-r from-blue-500 to-purple-600"
                    }`}
                  >
                    {message.type === "user" ? (
                      <User className="h-4 w-4 text-white" />
                    ) : (
                      <Bot className="h-4 w-4 text-white" />
                    )}
                  </div>
                  <div className={`rounded-lg p-3 ${message.type === "user" ? "bg-blue-500 text-white" : "bg-muted"}`}>
                    <div className="whitespace-pre-wrap text-sm">{message.content}</div>
                    <div className="text-xs opacity-70 mt-1">{message.timestamp.toLocaleTimeString()}</div>
                  </div>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex justify-start">
                <div className="flex items-start space-x-2">
                  <div className="h-8 w-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                    <Bot className="h-4 w-4 text-white" />
                  </div>
                  <div className="bg-muted rounded-lg p-3">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div
                        className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0.1s" }}
                      ></div>
                      <div
                        className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0.2s" }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          {currentStep > 0 && currentStep < CONVERSATION_STEPS.length - 1 && (
            <div className="border-t p-4">
              <div className="flex space-x-2">
                <Input
                  value={currentInput}
                  onChange={(e) => setCurrentInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your response..."
                  disabled={isTyping || isSubmitting}
                  className="flex-1"
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={!currentInput.trim() || isTyping || isSubmitting}
                  size="icon"
                >
                  {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                </Button>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          {messages.length > 0 && currentStep >= CONVERSATION_STEPS.length - 1 && (
            <div className="border-t p-4">
              <div className="flex justify-center space-x-2">
                <Button onClick={startConversation} variant="outline" disabled={isSubmitting}>
                  Start New Report
                </Button>
                <Button onClick={() => setIsOpen(false)} variant="outline">
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
