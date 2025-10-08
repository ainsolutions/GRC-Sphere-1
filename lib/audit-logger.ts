import { neon } from "@neondatabase/serverless"
import { HttpSessionContext } from "./HttpContext";

let sql: any = null

try {
  if (process.env.DATABASE_URL) {
    sql = neon(process.env.DATABASE_URL)
  } else {
    console.warn("DATABASE_URL not found. Audit logging will be disabled.")
  }
} catch (error) {
  console.error("Failed to initialize database connection:", error)
}

export interface AuditLogEntry {
  userId: string
  userEmail: string
  action: string
  entityType: string
  entityId?: string
  oldValues?: Record<string, any>
  newValues?: Record<string, any>
  ipAddress?: string
  userAgent?: string
  sessionId?: string
  success?: boolean
  errorMessage?: string
  additionalContext?: Record<string, any>
}

export interface UserSession {
  sessionId: string
  userId: string
  userEmail: string
  ipAddress?: string
  userAgent?: string
}

interface AuditEntry {
  userId?: string;
  userEmail?: string;
  action: string;
  entityType: string;
  entityId?: string;
  oldValues?: any;
  newValues?: any;
  ipAddress?: string;
  userAgent?: string;
  sessionId?: string;
  success?: boolean;
  error_message?: string;
  additional_context?: any;
}

export class AuditLogger {
  static async log(entry: AuditEntry, tenantDb: ReturnType<typeof neon> ): Promise<void> {
    if (!entry.userId || !entry.userEmail) {
      console.warn("AUDIT: Missing userId or userEmail", entry);
      // Optionally still store a minimal log
      return;
    }

    try {
      await tenantDb`
        INSERT INTO audit_logs
          (user_id, user_email, action, entity_type, entity_id,
           old_values, new_values, ip_address, user_agent, session_id,
           success, error_message, additional_context)
        VALUES (
          ${entry.userId},
          ${entry.userEmail},
          ${entry.action},
          ${entry.entityType},
          ${entry.entityId || null},
          ${entry.oldValues ? JSON.stringify(entry.oldValues) : null},
          ${entry.newValues ? JSON.stringify(entry.newValues) : null},
          ${entry.ipAddress || null},
          ${entry.userAgent || null},
          ${entry.sessionId || null},
          ${entry.success ?? true},
          ${entry.error_message || null},
          ${entry.additional_context ? JSON.stringify(entry.additional_context) : null}
        )
      `;
    } catch (err) {
      console.error("AUDIT LOG DB ERROR:", err);
      console.log("AUDIT LOG (FALLBACK):", {
        timestamp: new Date().toISOString(),
        user: entry.userEmail,
        action: entry.action,
        entity: entry.entityType,
        entityId: entry.entityId,
      });
    }
  }

  static async getAuditLogs(
    tenantDb: ReturnType<typeof neon> ,
    filters: {
      userId?: string
      entityType?: string
      action?: string
      startDate?: Date
      endDate?: Date
      limit?: number
      offset?: number
    } = {},
  ): Promise<any[]> {
    if (!sql) {
      return [
        {
          id: 1,
          user_id: "demo-user",
          user_email: "demo@company.com",
          action: "READ",
          entity_type: "ASSET",
          entity_id: "1",
          timestamp: new Date().toISOString(),
          success: true,
          ip_address: "127.0.0.1",
        },
      ]
    }

    try {
      await tenantDb `
        CREATE TABLE IF NOT EXISTS audit_logs (
          id SERIAL PRIMARY KEY,
          user_id VARCHAR(255),
          user_email VARCHAR(255),
          action VARCHAR(50),
          entity_type VARCHAR(50),
          entity_id VARCHAR(255),
          old_values JSONB,
          new_values JSONB,
          ip_address INET,
          user_agent TEXT,
          session_id VARCHAR(255),
          success BOOLEAN DEFAULT true,
          error_message TEXT,
          additional_context JSONB,
          timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `

      const limit = filters.limit || 100
      const offset = filters.offset || 0

      const whereConditions = []
      const params = []

      if (filters.userId) {
        whereConditions.push(`user_id = $${params.length + 1}`)
        params.push(filters.userId)
      }

      if (filters.entityType) {
        whereConditions.push(`entity_type = $${params.length + 1}`)
        params.push(filters.entityType)
      }

      if (filters.action) {
        whereConditions.push(`action = $${params.length + 1}`)
        params.push(filters.action)
      }

      if (filters.startDate) {
        whereConditions.push(`timestamp >= $${params.length + 1}`)
        params.push(filters.startDate)
      }

      if (filters.endDate) {
        whereConditions.push(`timestamp <= $${params.length + 1}`)
        params.push(filters.endDate)
      }

      const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(" AND ")}` : ""

      return (await tenantDb`
        SELECT * FROM audit_logs 
        ${whereClause ? sql.unsafe(whereClause) : sql``}
        ORDER BY timestamp DESC 
        LIMIT ${limit} OFFSET ${offset}
      `) as Record<string,string>[];
    } catch (error) {
      console.error("Failed to get audit logs:", error)
      return []
    }
  }

  static async logLogin(
    email: string,
    success: boolean,
    ipAddress?: string,
    userAgent?: string,
    failureReason?: string,
  ): Promise<void> {
    if (!sql) {
      console.log("LOGIN ATTEMPT:", {
        timestamp: new Date().toISOString(),
        email,
        success,
        ipAddress,
        failureReason,
      })
      return
    }

    try {
      await sql`
        CREATE TABLE IF NOT EXISTS login_attempts (
          id SERIAL PRIMARY KEY,
          email VARCHAR(255),
          ip_address INET,
          user_agent TEXT,
          success BOOLEAN,
          failure_reason TEXT,
          timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `

      await sql`
        INSERT INTO login_attempts (email, ip_address, user_agent, success, failure_reason)
        VALUES (${email}, ${ipAddress || null}, ${userAgent || null}, ${success}, ${failureReason || null})
      `
    } catch (error) {
      console.error("Failed to log login attempt:", error)
    }
  }

  static async createSession(session: UserSession): Promise<void> {
    if (!sql) {
      console.log("SESSION CREATED:", {
        timestamp: new Date().toISOString(),
        sessionId: session.sessionId,
        userId: session.userId,
        userEmail: session.userEmail,
      })
      return
    }

    try {
      await sql`
        CREATE TABLE IF NOT EXISTS user_sessions (
          id SERIAL PRIMARY KEY,
          session_id VARCHAR(255) UNIQUE,
          user_id VARCHAR(255),
          user_email VARCHAR(255),
          ip_address INET,
          user_agent TEXT,
          is_active BOOLEAN DEFAULT true,
          expires_at TIMESTAMP,
          last_activity TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `

      await sql`
        INSERT INTO user_sessions (session_id, user_id, user_email, ip_address, user_agent, expires_at)
        VALUES (
          ${session.sessionId}, ${session.userId}, ${session.userEmail},
          ${session.ipAddress || null}, ${session.userAgent || null},
          ${new Date(Date.now() + 24 * 60 * 60 * 1000)}
        )
      `
    } catch (error) {
      console.error("Failed to create session:", error)
    }
  }

  static async updateSessionActivity(sessionId: string): Promise<void> {
    if (!sql) return

    try {
      await sql`
        UPDATE user_sessions 
        SET last_activity = CURRENT_TIMESTAMP 
        WHERE session_id = ${sessionId} AND is_active = true
      `
    } catch (error) {
      console.error("Failed to update session activity:", error)
    }
  }

  static async endSession(sessionId: string): Promise<void> {
    if (!sql) return

    try {
      await sql`
        UPDATE user_sessions 
        SET is_active = false 
        WHERE session_id = ${sessionId}
      `
    } catch (error) {
      console.error("Failed to end session:", error)
    }
  }

  static async getLoginAttempts(
    filters: {
      email?: string
      success?: boolean
      startDate?: Date
      endDate?: Date
      limit?: number
    } = {},
  ): Promise<any[]> {
    if (!sql) {
      return []
    }

    try {
      const limit = filters.limit || 100

      return await sql`
        SELECT * FROM login_attempts 
        ORDER BY timestamp DESC 
        LIMIT ${limit}
      `
    } catch (error) {
      console.error("Failed to get login attempts:", error)
      return []
    }
  }

  static async getActiveSessions(): Promise<any[]> {
    if (!sql) {
      return []
    }

    try {
      const result = await sql`
        SELECT * FROM user_sessions 
        WHERE is_active = true AND expires_at > CURRENT_TIMESTAMP
        ORDER BY last_activity DESC
      `
      return result
    } catch (error) {
      console.error("Failed to get active sessions:", error)
      return []
    }
  }
}

// Create an instance for named export compatibility
export const auditLogger = new AuditLogger()

export const AUDIT_ACTIONS = {
  LOGIN: "LOGIN",
  LOGOUT: "LOGOUT",
  LOGIN_FAILED: "LOGIN_FAILED",
  CREATE: "CREATE",
  READ: "READ",
  UPDATE: "UPDATE",
  DELETE: "DELETE",
  EXPORT: "EXPORT",
  IMPORT: "IMPORT",
  APPROVE: "APPROVE",
  REJECT: "REJECT",
  ASSIGN: "ASSIGN",
  ESCALATE: "ESCALATE",
  CLOSE: "CLOSE",
  REOPEN: "REOPEN",
  RISK_ASSESS: "RISK_ASSESS",
  RISK_MITIGATE: "RISK_MITIGATE",
  RISK_ACCEPT: "RISK_ACCEPT",
  RISK_TRANSFER: "RISK_TRANSFER",
  CONTROL_TEST: "CONTROL_TEST",
  CONTROL_IMPLEMENT: "CONTROL_IMPLEMENT",
  CONTROL_REVIEW: "CONTROL_REVIEW",
  INCIDENT_REPORT: "INCIDENT_REPORT",
  INCIDENT_INVESTIGATE: "INCIDENT_INVESTIGATE",
  INCIDENT_RESOLVE: "INCIDENT_RESOLVE",
  ASSESSMENT_START: "ASSESSMENT_START",
  ASSESSMENT_COMPLETE: "ASSESSMENT_COMPLETE",
  ASSESSMENT_REVIEW: "ASSESSMENT_REVIEW",
  THREAT_ASSESS: "THREAT_ASSESS",
  THREAT_EVALUATE: "THREAT_EVALUATE",
  THREAT_APPROVE: "THREAT_APPROVE",
} as const

export const ENTITY_TYPES = {
  ASSET: "ASSET",
  RISK: "RISK",
  CONTROL: "CONTROL",
  INCIDENT: "INCIDENT",
  ASSESSMENT: "ASSESSMENT",
  USER: "USER",
  COMPLIANCE: "COMPLIANCE",
  FINDING: "FINDING",
  THREAT: "THREAT",
  THREAT_ASSESSMENT: "THREAT_ASSESSMENT",
} as const
