"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Database, Send, Bot, User } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { createAsset } from "@/lib/actions/asset-actions"
import { ChatbotButton } from "./ui/chatbotButton"

interface Message {
  id: string
  type: "bot" | "user"
  content: string
  timestamp: Date
}

interface AssetChatbotProps {
  onAssetCreated?: () => void
}

export function AssetChatbot({ onAssetCreated }: AssetChatbotProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [currentInput, setCurrentInput] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [assetData, setAssetData] = useState({
    asset_name: "",
    asset_type: "",
    owner: "",
    classification: "",
    business_value: "",
    confidentiality_level: "",
    integrity_level: "",
    availability_level: "",
    location: "",
    description: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const { toast } = useToast()

  const chatSteps = [
    {
      field: "asset_name",
      question:
        "Hi! I'm here to help you register a new asset. Let's start with the basics. What's the name of the asset you'd like to register?",
      validation: (value: string) => value.length >= 2,
      errorMessage: "Asset name must be at least 2 characters long.",
    },
    {
      field: "asset_type",
      question:
        "Great! What type of asset is this? Please choose from: Hardware, Software, Data, Network, Physical, or Document.",
      validation: (value: string) =>
        ["Hardware", "Software", "Data", "Network", "Physical", "Document"].includes(value),
      errorMessage: "Please select a valid asset type: Hardware, Software, Data, Network, Physical, or Document.",
    },
    {
      field: "owner",
      question: "Who is the owner or responsible person for this asset? Please provide their name or department.",
      validation: (value: string) => value.length >= 2,
      errorMessage: "Owner name must be at least 2 characters long.",
    },
    {
      field: "classification",
      question:
        "What's the data classification level? Please choose from: Public, Internal, Confidential, or Restricted.",
      validation: (value: string) => ["Public", "Internal", "Confidential", "Restricted"].includes(value),
      errorMessage: "Please select a valid classification: Public, Internal, Confidential, or Restricted.",
    },
    {
      field: "business_value",
      question: "What's the business value of this asset? Please choose from: Low, Medium, High, or Critical.",
      validation: (value: string) => ["Low", "Medium", "High", "Critical"].includes(value),
      errorMessage: "Please select a valid business value: Low, Medium, High, or Critical.",
    },
    {
      field: "confidentiality_level",
      question:
        "Now let's set the CIA ratings. What's the confidentiality level? Please enter a number from 1 to 5 (1 = lowest, 5 = highest).",
      validation: (value: string) => /^[1-5]$/.test(value),
      errorMessage: "Please enter a number from 1 to 5.",
    },
    {
      field: "integrity_level",
      question: "What's the integrity level? Please enter a number from 1 to 5 (1 = lowest, 5 = highest).",
      validation: (value: string) => /^[1-5]$/.test(value),
      errorMessage: "Please enter a number from 1 to 5.",
    },
    {
      field: "availability_level",
      question: "What's the availability level? Please enter a number from 1 to 5 (1 = lowest, 5 = highest).",
      validation: (value: string) => /^[1-5]$/.test(value),
      errorMessage: "Please enter a number from 1 to 5.",
    },
    {
      field: "location",
      question: "Where is this asset located? Please provide the physical or logical location.",
      validation: (value: string) => value.length >= 2,
      errorMessage: "Location must be at least 2 characters long.",
    },
    {
      field: "description",
      question: "Finally, please provide a brief description of this asset and its purpose.",
      validation: (value: string) => value.length >= 10,
      errorMessage: "Description must be at least 10 characters long.",
    },
  ]

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      // Start the conversation
      addBotMessage(chatSteps[0].question)
    }
  }, [isOpen])

  const addMessage = (type: "bot" | "user", content: string) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      type,
      content,
      timestamp: new Date(),
    }
    setMessages((prev) => [...prev, newMessage])
  }

  const addBotMessage = (content: string) => {
    setIsTyping(true)
    setTimeout(() => {
      setIsTyping(false)
      addMessage("bot", content)
    }, 1000)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!currentInput.trim()) return

    const userInput = currentInput.trim()
    addMessage("user", userInput)
    setCurrentInput("")

    if (currentStep < chatSteps.length) {
      const step = chatSteps[currentStep]

      if (step.validation(userInput)) {
        // Valid input
        setAssetData((prev) => ({
          ...prev,
          [step.field]: userInput,
        }))

        if (currentStep === chatSteps.length - 1) {
          // Last step - show summary
          showSummary()
        } else {
          // Move to next step
          setCurrentStep((prev) => prev + 1)
          setTimeout(() => {
            addBotMessage(chatSteps[currentStep + 1].question)
          }, 500)
        }
      } else {
        // Invalid input
        addBotMessage(step.errorMessage + " Please try again.")
      }
    }
  }

  const showSummary = () => {
    const updatedAssetData = { ...assetData }
    updatedAssetData[chatSteps[currentStep].field] = currentInput.trim()

    const summaryMessage = `Perfect! Here's a summary of the asset information:

📋 **Asset Summary:**
• Name: ${updatedAssetData.asset_name}
• Type: ${updatedAssetData.asset_type}
• Owner: ${updatedAssetData.owner}
• Classification: ${updatedAssetData.classification}
• Business Value: ${updatedAssetData.business_value}
• CIA Levels: C:${updatedAssetData.confidentiality_level} I:${updatedAssetData.integrity_level} A:${updatedAssetData.availability_level}
• Location: ${updatedAssetData.location}
• Description: ${updatedAssetData.description}

Would you like me to create this asset? Type "yes" to confirm or "no" to cancel.`

    addBotMessage(summaryMessage)
    setCurrentStep(chatSteps.length) // Move to confirmation step
  }

const handleConfirmation = async (userInput: string) => {
  if (userInput.toLowerCase() === "yes") {
    setIsSubmitting(true)
    addBotMessage("Creating your asset... Please wait.")

    try {
      // Generate asset ID (frontend-only for UX, DB handles actual PK)
      const assetId = `AST-${Date.now().toString().slice(-6)}`

      const result = await createAsset({
        asset_id: assetId,                        // ✅ include asset_id
        asset_name: assetData.asset_name,         // ✅ correct key
        asset_type: assetData.asset_type,
        description: assetData.description,
        owner: assetData.owner,
        classification: assetData.classification,
        business_value: assetData.business_value, // ✅ correct key
        confidentiality_level: Number(assetData.confidentiality_level),
        integrity_level: Number(assetData.integrity_level),
        availability_level: Number(assetData.availability_level),
        location: assetData.location,
      })

      console.log("API Response:", result)

      if (result.success) {
        addBotMessage(
          `🎉 Success! Asset "${assetData.asset_name}" has been created with ID: ${assetId}. You can now see it in your assets list.`,
        )
        toast({
          title: "Asset Created",
          description: `Asset "${assetData.asset_name}" has been successfully registered.`,
        })
        onAssetCreated?.()

        // Reset for next asset
        setTimeout(() => {
          addBotMessage("Would you like to register another asset? Type 'yes' to start over or close this chat.")
          setCurrentStep(-1) // Special state for restart
        }, 2000)
      } else {
        addBotMessage(
          `❌ Sorry, there was an error creating the asset: ${result.error}. Please try again or use the manual form.`,
        )
        toast({
          title: "Error",
          description: result.error || "Failed to create asset",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error creating asset:", error)
      addBotMessage("❌ Sorry, there was an error creating the asset. Please try again or use the manual form.")
      toast({
        title: "Error",
        description: "Failed to create asset",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  } else if (userInput.toLowerCase() === "no") {
    addBotMessage("No problem! The asset was not created. You can start over anytime or close this chat.")
    setCurrentStep(-1)
  } else {
    addBotMessage("Please type 'yes' to confirm or 'no' to cancel.")
  }
}
  const handleRestartConfirmation = (userInput: string) => {
    if (userInput.toLowerCase() === "yes") {
      // Reset everything
      setAssetData({
        asset_name: "",
        asset_type: "",
        owner: "",
        classification: "",
        business_value: "",
        confidentiality_level: "",
        integrity_level: "",
        availability_level: "",
        location: "",
        description: "",
      })
      setCurrentStep(0)
      setMessages([])
      addBotMessage(chatSteps[0].question)
    } else {
      addBotMessage(
        "Thanks for using the asset registration chatbot! Feel free to close this chat or start over anytime.",
      )
    }
  }

  const handleChatSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!currentInput.trim() || isSubmitting) return

    const userInput = currentInput.trim()
    addMessage("user", userInput)
    setCurrentInput("")

    if (currentStep === chatSteps.length) {
      // Confirmation step
      await handleConfirmation(userInput)
    } else if (currentStep === -1) {
      // Restart confirmation
      handleRestartConfirmation(userInput)
    } else {
      // Regular step
      const step = chatSteps[currentStep]

      if (step.validation(userInput)) {
        // Valid input
        setAssetData((prev) => ({
          ...prev,
          [step.field]: userInput,
        }))

        if (currentStep === chatSteps.length - 1) {
          // Last step - show summary
          showSummary()
        } else {
          // Move to next step
          setCurrentStep((prev) => prev + 1)
          setTimeout(() => {
            addBotMessage(chatSteps[currentStep + 1].question)
          }, 500)
        }
      } else {
        // Invalid input
        addBotMessage(step.errorMessage + " Please try again.")
      }
    }
  }

  const resetChat = () => {
    setMessages([])
    setCurrentStep(0)
    setAssetData({
      asset_name: "",
      asset_type: "",
      owner: "",
      classification: "",
      business_value: "",
      confidentiality_level: "",
      integrity_level: "",
      availability_level: "",
      location: "",
      description: "",
    })
    addBotMessage(chatSteps[0].question)
  }

  return (
    <>
      {/* Floating Chat Button */}
      <ChatbotButton
        className=""
        onClick={() => setIsOpen(true)}
        icon={<Database className="h-6 w-6" />}
      />
      {/* <Button
        variant="accent"
        onClick={() => setIsOpen(true)}
        size="icon"
      >
        <Database className="h-6 w-6" />
      </Button> */}

      {/* Chat Dialog */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-2xl h-[80vh] flex flex-col p-0 backdrop-blur-sm">
          <DialogHeader className="p-6 pb-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Bot className="h-6 w-6 text-purple-600" />
                <DialogTitle className="bg-gradient-to-r from-purple-600 to-cyan-600 bg-clip-text text-transparent">
                  Asset Registration Assistant
                </DialogTitle>
              </div>
              <div className="flex items-center space-x-2">
                <Badge variant="outline" className="bg-white/50">
                  Step {Math.min(currentStep + 1, chatSteps.length)} of {chatSteps.length}
                </Badge>
                <Button variant="outline" size="sm" onClick={resetChat}>
                  Reset
                </Button>
              </div>
            </div>
          </DialogHeader>

          {/* Messages Area */}
          <ScrollArea className="flex-1 px-6">
            <div className="space-y-4 pb-4">
              {messages.map((message) => (
                <div key={message.id} className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[80%] rounded-lg p-3 ${
                      message.type === "user"
                        ? "bg-gradient-to-r from-cyan-600 to-purple-600 text-white"
                        : "bg-white/80 text-gray-800 border border-purple-200"
                    }`}
                  >
                    <div className="flex items-start space-x-2">
                      {message.type === "bot" && <Bot className="h-4 w-4 mt-0.5 text-purple-600" />}
                      {message.type === "user" && <User className="h-4 w-4 mt-0.5" />}
                      <div className="whitespace-pre-wrap text-sm">{message.content}</div>
                    </div>
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-white/80 rounded-lg p-3 border border-purple-200">
                    <div className="flex items-center space-x-2">
                      <Bot className="h-4 w-4 text-purple-600" />
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce"></div>
                        <div
                          className="w-2 h-2 bg-purple-600 rounded-full animate-bounce"
                          style={{ animationDelay: "0.1s" }}
                        ></div>
                        <div
                          className="w-2 h-2 bg-purple-600 rounded-full animate-bounce"
                          style={{ animationDelay: "0.2s" }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>

          {/* Input Area */}
          <div className="p-6 pt-2 border-t border-purple-200/50">
            <form onSubmit={handleChatSubmit} className="flex space-x-2">
              <Input
                value={currentInput}
                onChange={(e) => setCurrentInput(e.target.value)}
                placeholder="Type your response..."
                disabled={isSubmitting || isTyping}
                className="flex-1 border-purple-200 focus:border-cyan-400"
              />
              <Button
                type="submit"
                variant="accent"
                disabled={isSubmitting || isTyping || !currentInput.trim()}
              >
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
