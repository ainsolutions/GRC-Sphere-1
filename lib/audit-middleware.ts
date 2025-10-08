import type { NextRequest } from "next/server"
import { AuditLogger } from "./audit-logger"

export interface AuditContext {
  userId: string
  userEmail: string
  sessionId?: string
  ipAddress?: string
  userAgent?: string
}

export function getAuditContext(request: NextRequest): Partial<AuditContext> {
  return {
    ipAddress: request.ip || request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || undefined,
    userAgent: request.headers.get("user-agent") || undefined,
    sessionId: request.cookies.get("session-id")?.value,
  }
}

export async function auditApiCall(
  context: AuditContext,
  action: string,
  entityType: string,
  entityId?: string,
  oldValues?: Record<string, any>,
  newValues?: Record<string, any>,
  additionalContext?: Record<string, any>,
) {
  await AuditLogger.log({
    userId: context.userId,
    userEmail: context.userEmail,
    action,
    entityType,
    entityId,
    oldValues,
    newValues,
    ipAddress: context.ipAddress,
    userAgent: context.userAgent,
    sessionId: context.sessionId,
    additionalContext,
  })
}

export function withAudit<T extends any[], R>(
  fn: (...args: T) => Promise<R>,
  auditConfig: {
    action: string
    entityType: string
    getEntityId?: (...args: T) => string
    getOldValues?: (...args: T) => Record<string, any>
    getNewValues?: (...args: T) => Record<string, any>
    getContext?: (...args: T) => Record<string, any>
  },
) {
  return async (...args: T): Promise<R> => {
    const context = args[0] as AuditContext // Assume first arg is context
    let result: R
    let success = true
    let errorMessage: string | undefined

    try {
      result = await fn(...args)
    } catch (error) {
      success = false
      errorMessage = error instanceof Error ? error.message : "Unknown error"
      throw error
    } finally {
      await AuditLogger.log({
        userId: context.userId,
        userEmail: context.userEmail,
        action: auditConfig.action,
        entityType: auditConfig.entityType,
        entityId: auditConfig.getEntityId?.(...args),
        oldValues: auditConfig.getOldValues?.(...args),
        newValues: auditConfig.getNewValues?.(...args),
        ipAddress: context.ipAddress,
        userAgent: context.userAgent,
        sessionId: context.sessionId,
        success,
        errorMessage,
        additionalContext: auditConfig.getContext?.(...args),
      })
    }

    return result!
  }
}
