import { NextResponse } from "next/server";
import { getDatabase, testDatabaseConnection, getDatabaseStatus } from "@/lib/database";

export async function GET() {
  try {
    const db = getDatabase();
    const status = getDatabaseStatus();
    const connectionTest = await testDatabaseConnection();

    // Test basic query
    let userCount = 0;
    let orgSchemaCount = 0;
    
    if (db) {
      try {
        const users = await db`SELECT COUNT(*) as count FROM users`;
        userCount = users[0]?.count || 0;
      } catch (e) {
        console.error("Users table query failed:", e);
      }

      try {
        const schemas = await db`SELECT COUNT(*) as count FROM organization_schemas`;
        orgSchemaCount = schemas[0]?.count || 0;
      } catch (e) {
        console.error("Organization schemas table query failed:", e);
      }
    }

    return NextResponse.json({
      success: true,
      database: {
        configured: status.connected,
        provider: status.provider,
        host: status.host,
        connectionTest,
        userCount,
        orgSchemaCount,
        hasRequiredTables: userCount > 0 && orgSchemaCount > 0
      }
    });
  } catch (error) {
    console.error("Database test failed:", error);
    return NextResponse.json({
      success: false,
      error: "Database test failed",
      details: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 });
  }
}
