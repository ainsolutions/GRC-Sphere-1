import { neon } from '@neondatabase/serverless';

// Database connection singleton
let sql: ReturnType<typeof neon> | null = null;

/**
 * Get database connection
 * @returns Database connection instance
 */
export function getDatabase() {
  if (!sql) {
    const databaseUrl = process.env.DATABASE_URL || process.env.POSTGRES_URL;
    
    if (!databaseUrl || databaseUrl === "your-database-url") {
      console.warn('DATABASE_URL not properly configured. Database features will be limited.');
      return null;
    }
    
    try {
      sql = neon(databaseUrl);
    } catch (error) {
      console.error('Failed to create database connection:', error);
      return null;
    }
  }
  
  return sql;
}

/**
 * Test database connection
 * @returns Promise<boolean>
 */
export async function testDatabaseConnection(): Promise<boolean> {
  try {
    const db = getDatabase();
    if (!db) {
      console.warn('Database not configured. Cannot test connection.');
      return false;
    }
    await db`SELECT 1`;
    return true;
  } catch (error) {
    console.error('Database connection test failed:', error);
    return false;
  }
}

/**
 * Get database status information
 * @returns Database status object
 */
export function getDatabaseStatus() {
  const databaseUrl = process.env.DATABASE_URL || process.env.POSTGRES_URL;
  
  if (!databaseUrl || databaseUrl === "your-database-url") {
    return {
      connected: false,
      error: 'No database URL configured or using placeholder value',
      provider: 'None'
    };
  }
  
  let provider = 'Unknown';
  if (databaseUrl.includes('neon')) {
    provider = 'Neon';
  } else if (databaseUrl.includes('supabase')) {
    provider = 'Supabase';
  } else if (databaseUrl.includes('postgres')) {
    provider = 'PostgreSQL';
  }
  
  return {
    connected: true,
    provider,
    host: databaseUrl.split('@')[1]?.split('/')[0] || 'Unknown'
  };
}

/**
 * Execute a database transaction
 * @param callback Function to execute within transaction
 * @returns Promise<T>
 */
export async function withTransaction<T>(
  callback: (db: ReturnType<typeof neon>) => Promise<T>
): Promise<T> {
  const db = getDatabase();
  
  if (!db) {
    throw new Error('Database not configured. Cannot execute transaction.');
  }
  
  try {
    // Note: Neon serverless doesn't support traditional transactions
    // This is a simplified version for compatibility
    return await callback(db);
  } catch (error) {
    console.error('Transaction failed:', error);
    throw error;
  }
}

/**
 * Close database connection (for cleanup)
 */
export function closeDatabase() {
  // Neon serverless connections are automatically managed
  sql = null;
}

// Export the database instance for direct use
export { sql };
