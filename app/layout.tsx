import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { SessionProvider } from "@/components/session-provider";
import { getSession } from "@/lib/sessionHelper";
import { User } from "@/lib/types/user"
import Content from "./content"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "GRC Tech - Governance, Risk & Compliance",
  description: "Comprehensive cybersecurity and technology GRC solution",
  generator: 'v0.dev'
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {

  const session: any | null = await getSession();

  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          <SessionProvider initialSession={session}>
            <Content>
              {children}
            </Content>
          </SessionProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
