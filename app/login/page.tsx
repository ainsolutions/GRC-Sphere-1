"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Eye, EyeOff, AlertCircle, UserPlus, KeyRound, Brain, Zap } from "lucide-react"
import Link from "next/link"
import styles from "./login.module.css"
import Logo3D from "../../components/landing/logo-3d"
import ParticleBackground from "../../components/landing/particle-background"

import { useSession } from "@/components/session-provider"
import StarBorder from "../StarBorder"


export default function LoginPage() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()
  const { setSession } = useSession();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      })
      
      const data = await response.json()

      if (response.ok && data.success) {
        setSession(data.user, data.permissionMap,data.menuList);

        // Store user info in localStorage for simple state management
        // localStorage.setItem("user", JSON.stringify(data.user))
        // Redirect to dashboard
        router.push("/dashboard")
      } else {
        setError(data.error || "Invalid credentials")
      }
    } catch (error) {
      setError("Login failed. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="relative h-screen w-full overflow-hidden bg-black text-white">
      <ParticleBackground />

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {/* Central Emblem */}
          <div className="flex justify-center mb-8">
            <div className="relative">
              {/* Outer glowing ring */}
              <div className={`w-32 h-32 rounded-full border-2 border-transparent bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 p-1 ${styles.emblemGlow}`}>
                <div className="w-full h-full rounded-full bg-black/80 flex items-center justify-center relative overflow-hidden">
                  {/* 3D Logo with glow effect */}
                  <div className="w-20 h-20">
                    <Logo3D isAnimating={true} />
                  </div>

                  {/* Neural network lines */}
                  <div className="absolute inset-0">
                    <div className={`${styles.neuralNode} top-1/4 left-1/4 bg-purple-400`}></div>
                    <div className={`${styles.neuralNode} top-3/4 right-1/4 bg-pink-400`}></div>
                    <div className={`${styles.neuralNode} top-1/2 left-1/2 bg-cyan-400`}></div>
                  </div>
                </div>
              </div>
              
              {/* Floating particles around emblem */}
              {[...Array(8)].map((_, i) => {
                const floatingClass = `floating-particle-${(i % 8) + 1}`
                return (
                  <div
                    key={i}
                    className={`absolute w-1 h-1 bg-cyan-400 rounded-full animate-ping ${styles[floatingClass]}`}
                  />
                )
              })}
            </div>
          </div>

          {/* Title Section */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 bg-clip-text text-transparent mb-2">
              GRC SPHERE
            </h1>
            <p className="text-gray-300 text-lg mb-4">Adaptive AI Cyber Security GRC Solution</p>
            
            {/* Keywords */}
            <div className="flex justify-center space-x-6 text-sm">
              <span className="text-cyan-400 font-medium">Recursive</span>
              <span className="text-purple-400 font-medium">Ethical</span>
              <span className="text-pink-400 font-medium">Intelligent</span>
            </div>
          </div>

          {/* Login Form */}
          <div className="bg-black/40 backdrop-blur-lg border border-cyan-500/30 rounded-2xl p-8 shadow-2xl">
            <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
                <Label htmlFor="username" className="text-cyan-300 text-sm font-medium">
                Username
              </Label>
              <Input
                id="username"
                type="text"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                  className="bg-black/50 border-cyan-500/50 text-white placeholder-gray-400 focus:border-cyan-400 focus:ring-cyan-400/20 rounded-lg"
                required
                disabled={isLoading}
              />
            </div>
              
            <div className="space-y-2">
                <Label htmlFor="password" className="text-cyan-300 text-sm font-medium">
                Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                    className="bg-black/50 border-cyan-500/50 text-white placeholder-gray-400 focus:border-cyan-400 focus:ring-cyan-400/20 rounded-lg pr-12"
                  required
                  disabled={isLoading}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent text-gray-400 hover:text-cyan-400"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isLoading}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            {error && (
                <Alert className="border-red-500/50 bg-red-500/10 backdrop-blur-sm">
                <AlertCircle className="h-4 w-4 text-red-400" />
                <AlertDescription className="text-red-400">{error}</AlertDescription>
              </Alert>
            )}

              <StarBorder
                type="submit" 
                className={`w-full ${styles.quantumButton}`}
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="text-center">
                    Enter the AI GRC Realm ...
                  </div>
                ) : (
                  <div className="text-center">
                  
                    Enter the AI GRC Realm ...
                  </div>
                )}
            </StarBorder>
              
          </form>

            {/* Additional Links */}
            <div className="mt-6 space-y-4">
             

            <div className="text-center">
                <p className="text-gray-400 text-sm mb-3">Don't have an account?</p>
                <Link href="mailto:support@grcsphere.com">
                <StarBorder
            
                  >
         
                    Connect with us
                </StarBorder>
              </Link>
            </div>

              {/* Demo Credentials */}
              {/* <div className="text-center text-xs text-gray-500 border-t border-cyan-500/20 pt-4">
                <p className="font-medium mb-2 text-cyan-300">Demo Credentials:</p>
                <div className="space-y-1">
              <p>Username: admin | Password: admin123</p>
              <p>Username: user1 | Password: password123</p>
                </div>
              </div> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}