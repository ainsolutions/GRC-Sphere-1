import type React from "react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "FAIR Risk Analysis | GRC Platform",
  description: "Quantitative risk analysis using Factor Analysis of Information Risk (FAIR) methodology",
}

export default function FairRiskLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
