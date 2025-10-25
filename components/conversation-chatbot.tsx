"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { X, Send, User, Sparkles, Mic, MicOff, Shield } from "lucide-react"
import type SpeechRecognition from "speech-recognition"
import CybersecurityPromptTemplates from "./cybersecurity-prompt-templates"
import { ChatbotButton } from "./ui/chatbotButton"

declare global {
  interface Window {
    SpeechRecognition: typeof SpeechRecognition
    webkitSpeechRecognition: typeof SpeechRecognition
  }
}

interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string
}

interface Message {
  id: string
  type: "user" | "bot"
  content: string
  timestamp: Date
}

interface ConversationChatbotProps {
  className?: string
  autoOpen?: boolean
}

export default function ConversationChatbot({ className = "", autoOpen = false }: ConversationChatbotProps) {
  const [isOpen, setIsOpen] = useState(autoOpen)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      type: "bot",
      content:
        'Hello! I\'m your AI-powered GRC assistant with specialized expertise in cybersecurity frameworks and industry standards. I can help you with:\n\n🔒 **Cybersecurity Frameworks:**\n• NIST Cybersecurity Framework implementation\n• ISO 27001/27002 controls assessment\n• HIPAA compliance requirements\n• PCI DSS security standards\n• SOC 2 Type II controls\n\n🛡️ **Risk Management:**\n• Threat modeling and risk assessments\n• Vulnerability management programs\n• Incident response planning\n• Business continuity strategies\n\n📋 **Compliance Guidance:**\n• Regulatory requirement mapping\n• Control effectiveness testing\n• Audit preparation and evidence collection\n• Gap analysis and remediation planning\n\nAsk me anything like "How do I implement NIST CSF?" or "What are the key ISO 27001 controls?" and I\'ll provide expert guidance based on industry best practices.',
      timestamp: new Date(),
    },
  ])
  const [inputValue, setInputValue] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const [speechSupported, setSpeechSupported] = useState(false)
  const [showPromptTemplates, setShowPromptTemplates] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const soundPlayedRef = useRef(false)
  const recognitionRef = useRef<SpeechRecognition | null>(null)

  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
      if (SpeechRecognition) {
        setSpeechSupported(true)
        const recognition = new SpeechRecognition()
        recognition.continuous = false
        recognition.interimResults = false
        recognition.lang = "en-US"

        recognition.onstart = () => {
          setIsListening(true)
        }

        recognition.onresult = (event) => {
          const transcript = event.results[0][0].transcript
          setInputValue(transcript)
          setIsListening(false)
        }

        recognition.onerror = (event) => {
          console.error("Speech recognition error:", event.error)
          setIsListening(false)
        }

        recognition.onend = () => {
          setIsListening(false)
        }

        recognitionRef.current = recognition
      }
    }
  }, [])

  const startListening = () => {
    if (recognitionRef.current && speechSupported) {
      try {
        recognitionRef.current.start()
      } catch (error) {
        console.error("Error starting speech recognition:", error)
        setIsListening(false)
      }
    }
  }

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop()
    }
  }

  const playNotificationSound = () => {
    try {
      // Create a simple notification sound using Web Audio API
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
      const oscillator = audioContext.createOscillator()
      const gainNode = audioContext.createGain()

      oscillator.connect(gainNode)
      gainNode.connect(audioContext.destination)

      oscillator.frequency.setValueAtTime(800, audioContext.currentTime)
      oscillator.frequency.setValueAtTime(600, audioContext.currentTime + 0.1)
      oscillator.frequency.setValueAtTime(800, audioContext.currentTime + 0.2)

      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime)
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3)

      oscillator.start(audioContext.currentTime)
      oscillator.stop(audioContext.currentTime + 0.3)
    } catch (error) {
      console.log("Could not play notification sound:", error)
    }
  }

  useEffect(() => {
    if (autoOpen && isOpen && !soundPlayedRef.current) {
      // Delay sound slightly to ensure component is mounted
      setTimeout(() => {
        playNotificationSound()
        soundPlayedRef.current = true
      }, 500)
    }
  }, [autoOpen, isOpen])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: inputValue.trim(),
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputValue("")
    setIsLoading(true)

    try {
      console.log("[v0] Sending message to API")
      const response = await fetch("/api/chatbot-query", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query: userMessage.content }),
      })

      console.log("[v0] Response status:", response.status)
      console.log("[v0] Response headers:", response.headers.get("content-type"))

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const contentType = response.headers.get("content-type")
      if (!contentType || !contentType.includes("application/json")) {
        const textResponse = await response.text()
        console.error("[v0] Non-JSON response received:", textResponse)
        throw new Error("Server returned non-JSON response")
      }

      const data = await response.json()
      console.log("[v0] Parsed JSON response:", data)

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: "bot",
        content: typeof data.response === "string" && data.response.trim().length > 0
          ? data.response
          : "I couldn’t find any detailed answer for that. Please try rephrasing your question.",
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, botMessage])
    } catch (error) {
      console.error("[v0] Error sending message:", error)
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: "bot",
        content: "I apologize, but I encountered an error processing your request. Please try again.",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const handlePromptSelect = (prompt: string) => {
    setInputValue(prompt)
    setShowPromptTemplates(false)
  }

  if (!isOpen) {
    return (
        <ChatbotButton
          className=""
          onClick={() => setIsOpen(true)}
          icon={<Sparkles className="h-6 w-6 text-white" />}
        />

        /* <Button
          onClick={() => setIsOpen(true)}
          className="h-14 w-14 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg animate-pulse"
          size="icon"
        >
          <Sparkles className="h-6 w-6 text-white" />
        </Button> */
    )
  }

  return (
    <div className={`fixed bottom-6 right-6 z-50 ${className}`}>
      <Card className="w-[400px] h-[520px] shadow-xl border-0 bg-transparent">
        <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-lg">
          <div className="flex items-center gap-2">
            <Sparkles className="h-9 w-9 animate-pulse" />
            <h3 className="font-semibold">AI GRC Assistant</h3>
          </div>
          <Button
            onClick={() => setIsOpen(false)}
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-white hover:bg-white/20"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <CardContent className="p-0 h-[450px] flex flex-col">
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.type === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[80%] rounded-lg p-3 ${
                    message.type === "user"
                      ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white"
                      : "bg-gray-100 text-gray-900"
                  }`}
                >
                  <div className="flex items-start gap-2">
                    {message.type === "bot" && (
                      <Sparkles className="h-4 w-4 mt-0.5 flex-shrink-0 text-purple-600" />
                    )}
                    {message.type === "user" && (
                      <User className="h-4 w-4 mt-0.5 flex-shrink-0" />
                    )}

                    {/* ✅ Safe render: handles string, object, or anything else */}
                    <div className="text-sm whitespace-pre-wrap">
                      {typeof message.content === "object" ? (
                        <pre className="text-xs whitespace-pre-wrap">
                          {JSON.stringify(message.content, null, 2)}
                        </pre>
                      ) : (
                        message.content
                      )}
                    </div>
                  </div>

                  {/* ✅ Guard against undefined timestamps */}
                  <div
                    className={`text-xs mt-1 ${
                      message.type === "user" ? "text-blue-100" : "text-gray-500"
                    }`}
                  >
                    {message.timestamp?.toLocaleTimeString
                      ? message.timestamp.toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })
                      : ""}
                  </div>
                </div>
              </div>
            ))}

            {/* Loading Indicator */}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 rounded-lg p-3 max-w-[80%]">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-purple-600 animate-spin" />
                    <div className="text-sm text-gray-600">
                      AI is analyzing your request...
                    </div>
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
                      <div
                        className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0.1s" }}
                      ></div>
                      <div
                        className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0.2s" }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          <div className="p-4 border-t overflow-y-auto">
            {showPromptTemplates && (
              <div className="mb-4 border rounded-lg p-3 bg-gray-50">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-sm">Cybersecurity Expert Prompts</h4>
                  <Button variant="ghost" size="sm" onClick={() => setShowPromptTemplates(false)}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <CybersecurityPromptTemplates onPromptSelect={handlePromptSelect} />
              </div>
            )}

            {isListening && (
              <div className="mb-2 flex items-center justify-center gap-2 text-sm text-purple-600">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                Listening... Speak now
              </div>
            )}

            <div className="flex gap-2 mb-2">
              <Button
                variant="accent"
                size="sm"
                onClick={() => setShowPromptTemplates(!showPromptTemplates)}
                className="text-xs"
              >
                <Shield className="h-3 w-3 mr-1" />
                Expert Prompts
              </Button>
            </div>

            <div className="flex gap-2">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask me anything about cybersecurity frameworks..."
                className="flex-1"
                disabled={isLoading || isListening}
              />
              {speechSupported && (
                <Button
                  onClick={isListening ? stopListening : startListening}
                  disabled={isLoading}
                  variant={isListening ? "destructive" : "accent"}
                  size="icon"
                  className={isListening ? "animate-pulse" : ""}
                >
                  {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                </Button>
              )}
              <Button
                variant="accent"
                onClick={handleSendMessage}
                disabled={!inputValue.trim() || isLoading}
                size="icon"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
