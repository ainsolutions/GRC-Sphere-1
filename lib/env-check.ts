export function isDatabaseConfigured(): boolean {
  return !!(process.env.DATABASE_URL || process.env.POSTGRES_URL)
}

export function isProductionEnvironment(): boolean {
  return process.env.NODE_ENV === "production"
}

export function getDatabaseStatus(): {
  configured: boolean
  url?: string
  provider?: string
} {
  const databaseUrl = process.env.DATABASE_URL || process.env.POSTGRES_URL

  return {
    configured: !!databaseUrl,
    url: databaseUrl ? databaseUrl.split("@")[1]?.split("/")[0] : undefined,
    provider: databaseUrl?.includes("neon")
      ? "Neon"
      : databaseUrl?.includes("supabase")
        ? "Supabase"
        : databaseUrl?.includes("postgres")
          ? "PostgreSQL"
          : "Unknown",
  }
}

export function getEnvironmentInfo() {
  return {
    nodeEnv: process.env.NODE_ENV,
    database: getDatabaseStatus(),
    hasNeonIntegration: !!process.env.DATABASE_URL,
    isProduction: isProductionEnvironment(),
  }
}
