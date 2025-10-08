"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Progress } from "@/components/ui/progress"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Bot, Send, RotateCcw, Database } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Message {
  id: string
  text: string
  isBot: boolean
  timestamp: Date
}

interface ChatbotResponse {
  response: string
  completed: boolean
  step: number
  total_steps: number
}

export function RiskChatbot({ onRiskCreated }: { onRiskCreated?: () => void }) {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isTyping, setIsTyping] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [totalSteps, setTotalSteps] = useState(16)
  const [isCompleted, setIsCompleted] = useState(false)
  const { toast } = useToast()

  const addMessage = (text: string, isBot: boolean) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      text,
      isBot,
      timestamp: new Date(),
    }
    setMessages((prev) => [...prev, newMessage])
  }

  const simulateTyping = async (text: string) => {
    setIsTyping(true)
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setIsTyping(false)
    addMessage(text, true)
  }

  const initializeChat = async () => {
    setMessages([])
    setCurrentStep(0)
    setIsCompleted(false)

    const welcomeMessage = `🤖 Hello! I'm your Risk Management Assistant. I'll help you register a new risk in the system through a simple conversation.

I'll guide you through 16 steps to collect all the necessary information:
• Risk details and description
• Category and asset assignment  
• Threat source and vulnerability
• Risk assessment scores
• Management information
• Treatment plans

Let's get started! What is the title of this risk? (e.g., 'Data breach due to weak passwords')`

    await simulateTyping(welcomeMessage)
  }

  const sendMessage = async () => {
    if (!inputValue.trim() || isLoading) return

    const userMessage = inputValue.trim()
    setInputValue("")
    addMessage(userMessage, false)
    setIsLoading(true)

    try {
      const response = await fetch("/api/risk-chatbot", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: userMessage }),
      })

      if (!response.ok) {
        throw new Error("Failed to get response from chatbot")
      }

      const data: ChatbotResponse = await response.json()

      setCurrentStep(data.step)
      setTotalSteps(data.total_steps)
      setIsCompleted(data.completed)

      await simulateTyping(data.response)

      if (data.completed) {
        toast({
          title: "Success",
          description: "Risk has been successfully registered!",
        })
        if (onRiskCreated) {
          onRiskCreated()
        }
      }
    } catch (error) {
      console.error("Error:", error)
      await simulateTyping("❌ Sorry, I encountered an error. Please try again or restart the conversation.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const resetChat = () => {
    setMessages([])
    setCurrentStep(0)
    setIsCompleted(false)
    setInputValue("")
    initializeChat()
  }

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open)
    if (open && messages.length === 0) {
      initializeChat()
    }
  }

  const progress = totalSteps > 0 ? (currentStep / totalSteps) * 100 : 0

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button
          className="fixed left-6 bottom-6 h-14 w-14 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 z-50"
          size="icon"
        >
          <Database className="h-6 w-6" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Bot className="h-5 w-5 text-purple-600" />
            Risk Registration Assistant
            <Badge variant="outline" className="ml-auto">
              Step {currentStep} of {totalSteps}
            </Badge>
          </DialogTitle>
          <Progress value={progress} className="w-full" />
        </DialogHeader>

        <div className="flex-1 flex flex-col gap-4">
          <ScrollArea className="flex-1 pr-4">
            <div className="space-y-4">
              {messages.map((message) => (
                <div key={message.id} className={`flex ${message.isBot ? "justify-start" : "justify-end"}`}>
                  <Card
                    className={`max-w-[80%] ${
                      message.isBot
                        ? "bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200"
                        : "bg-gradient-to-r from-blue-50 to-cyan-50 border-blue-200"
                    }`}
                  >
                    <CardContent className="p-3">
                      <div className="flex items-start gap-2">
                        {message.isBot && <Bot className="h-4 w-4 text-purple-600 mt-1 flex-shrink-0" />}
                        <div className="text-sm whitespace-pre-wrap">{message.text}</div>
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">{message.timestamp.toLocaleTimeString()}</div>
                    </CardContent>
                  </Card>
                </div>
              ))}

              {isTyping && (
                <div className="flex justify-start">
                  <Card className="bg-gradient-to-r from-purple-500 to-pink-500 border-purple-200">
                    <CardContent className="p-3">
                      <div className="flex items-center gap-2">
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
                    </CardContent>
                  </Card>
                </div>
              )}
            </div>
          </ScrollArea>

          <div className="flex gap-2">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={isCompleted ? "Type 'restart' to register another risk..." : "Type your response..."}
              disabled={isLoading || isTyping}
              className="flex-1"
            />
            <Button
              onClick={sendMessage}
              disabled={!inputValue.trim() || isLoading || isTyping}
              size="icon"
              className="bg-gradient-to-r from-purple-600 to-pink-600 text-white"
            >
              <Send className="h-4 w-4" />
            </Button>
            <Button onClick={resetChat} variant="outline" size="icon" disabled={isLoading || isTyping}>
              <RotateCcw className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
