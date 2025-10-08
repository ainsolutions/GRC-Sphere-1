import type React from "react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Technology Risk Management | GRC Platform",
  description: "Identify, assess, and manage technology-related risks across your organization",
}

export default function TechnologyRiskLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
