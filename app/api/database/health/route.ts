import { NextResponse } from 'next/server';
import { testDatabaseConnection, getDatabaseStatus } from '@/lib/database';
import { withContext, HttpSessionContext } from "@/lib/HttpContext";

export const GET = withContext(async (context: HttpSessionContext, request) => {
  try {
    const isConnected = await testDatabaseConnection();
    const status = getDatabaseStatus();
    
    return NextResponse.json({
      success: true,
      connected: isConnected,
      status,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Database health check failed:', error);
    
    return NextResponse.json({
      success: false,
      connected: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
});

