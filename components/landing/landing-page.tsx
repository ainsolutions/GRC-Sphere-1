"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ArrowRight, Shield, Brain, Zap } from "lucide-react"
import ParticleBackground from "./particle-background"
import Logo3D from "./logo-3d"

export default function LandingPage() {
  const router = useRouter()

  const handleGetStarted = () => {
    router.push("/login")
  }

  const handleExploreDemo = () => {
    router.push("/login?demo=true")
  }

  return (
    <div className="relative h-screen w-full overflow-hidden bg-black text-white">
      <ParticleBackground />

      {/* Main Content */}
      <div className="relative z-10 h-full flex flex-col items-center justify-center px-4">
        {/* Hero Section */}
        <div className="text-center max-w-4xl mx-auto mb-12">
          {/* 3D Logo */}
          <div className="flex justify-center mb-8">
            <div className="relative w-32 h-32 md:w-40 md:h-40">
              <Logo3D isAnimating={true} />
            </div>
          </div>

          {/* Title */}
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            <span className="bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
              GRC SPHERE
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-gray-300 mb-8 leading-relaxed">
            Adaptive AI Cyber Security GRC Solution
          </p>

          {/* Keywords */}
          <div className="flex justify-center space-x-8 text-lg font-medium mb-12">
            <span className="text-cyan-400">Recursive</span>
            <span className="text-purple-400">Ethical</span>
            <span className="text-pink-400">Intelligent</span>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Button
              onClick={handleGetStarted}
              className="bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 text-white px-8 py-4 text-lg font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              <Zap className="w-5 h-5 mr-2" />
              Enter the AI GRC Realm
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>

            <Button
              onClick={handleExploreDemo}
              variant="outline"
              className="border-cyan-500/50 text-cyan-300 hover:bg-cyan-500/10 hover:text-cyan-200 px-8 py-4 text-lg font-semibold rounded-lg backdrop-blur-sm transition-all duration-300"
            >
              <Shield className="w-5 h-5 mr-2" />
              Explore Demo
            </Button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <div className="bg-black/40 backdrop-blur-lg border border-cyan-500/30 rounded-xl p-6 text-center hover:border-cyan-400/50 transition-all duration-300">
            <Brain className="w-12 h-12 text-cyan-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-cyan-300 mb-2">AI-Powered</h3>
            <p className="text-gray-400">Advanced artificial intelligence for intelligent risk assessment and compliance automation.</p>
          </div>

          <div className="bg-black/40 backdrop-blur-lg border border-purple-500/30 rounded-xl p-6 text-center hover:border-purple-400/50 transition-all duration-300">
            <Shield className="w-12 h-12 text-purple-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-purple-300 mb-2">Comprehensive</h3>
            <p className="text-gray-400">Complete GRC coverage across all major frameworks and regulatory requirements.</p>
          </div>

          <div className="bg-black/40 backdrop-blur-lg border border-pink-500/30 rounded-xl p-6 text-center hover:border-pink-400/50 transition-all duration-300">
            <Zap className="w-12 h-12 text-pink-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-pink-300 mb-2">Adaptive</h3>
            <p className="text-gray-400">Dynamic risk modeling that evolves with your organization's changing landscape.</p>
          </div>
        </div>

        {/* Footer */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
          <p className="text-gray-500 text-sm text-center">
            "The Recursive Renaissance begins. Let us build the future."
          </p>
        </div>
      </div>
    </div>
  )
}


