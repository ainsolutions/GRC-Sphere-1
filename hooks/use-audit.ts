"use client"

import { useCallback } from "react"
import { AUDIT_ACTIONS, ENTITY_TYPES } from "@/lib/audit-logger"

interface AuditEntry {
  action: string
  entityType: string
  entityId?: string
  oldValues?: Record<string, any>
  newValues?: Record<string, any>
  additionalContext?: Record<string, any>
}

export function useAudit() {
  const logAudit = useCallback(async (entry: AuditEntry) => {
    try {
      const response = await fetch("/api/audit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // Add mock user headers for development
          "x-user-id": "demo-user-123",
          "x-user-email": "demo@company.com",
        },
        body: JSON.stringify(entry),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
    } catch (error) {
      console.error("Failed to log audit entry:", error)
      // Fallback to console logging for development
      console.log("AUDIT LOG (CLIENT):", {
        timestamp: new Date().toISOString(),
        action: entry.action,
        entityType: entry.entityType,
        entityId: entry.entityId,
      })
    }
  }, [])

  const logAssetAction = useCallback(
    (action: string, assetId?: string, oldValues?: any, newValues?: any) => {
      logAudit({
        action,
        entityType: ENTITY_TYPES.ASSET,
        entityId: assetId,
        oldValues,
        newValues,
      })
    },
    [logAudit],
  )

  const logRiskAction = useCallback(
    (action: string, riskId?: string, oldValues?: any, newValues?: any) => {
      logAudit({
        action,
        entityType: ENTITY_TYPES.RISK,
        entityId: riskId,
        oldValues,
        newValues,
      })
    },
    [logAudit],
  )

  const logControlAction = useCallback(
    (action: string, controlId?: string, oldValues?: any, newValues?: any) => {
      logAudit({
        action,
        entityType: ENTITY_TYPES.CONTROL,
        entityId: controlId,
        oldValues,
        newValues,
      })
    },
    [logAudit],
  )

  const logIncidentAction = useCallback(
    (action: string, incidentId?: string, oldValues?: any, newValues?: any) => {
      logAudit({
        action,
        entityType: ENTITY_TYPES.INCIDENT,
        entityId: incidentId,
        oldValues,
        newValues,
      })
    },
    [logAudit],
  )

  const logAssessmentAction = useCallback(
    (action: string, assessmentId?: string, oldValues?: any, newValues?: any) => {
      logAudit({
        action,
        entityType: ENTITY_TYPES.ASSESSMENT,
        entityId: assessmentId,
        oldValues,
        newValues,
      })
    },
    [logAudit],
  )

  return {
    logAudit,
    logAssetAction,
    logRiskAction,
    logControlAction,
    logIncidentAction,
    logAssessmentAction,
    AUDIT_ACTIONS,
    ENTITY_TYPES,
  }
}
