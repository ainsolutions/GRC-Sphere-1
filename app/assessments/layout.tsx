import type React from "react"

export default function AssessmentsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <main className="flex-1 overflow-y-auto">{children}</main>
  )
}
