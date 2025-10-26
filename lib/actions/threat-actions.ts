"use client"

import { HttpSessionContext } from "@/lib/HttpContext"
import { AuditLogger, AUDIT_ACTIONS, ENTITY_TYPES } from "@/lib/audit-logger"


export async function createThreat(threat: any) {
  const res = await fetch("/api/threats", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(threat),
  })

  return res.json()
}


export async function updateThreat(id: Number, data: any) {
  const res = await fetch("/api/threats", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...data, id }),
  });
  return await res.json();
}

export async function deleteThreat(id: string) {
  const res = await fetch(`/api/threats/${id}`, { method: "DELETE" });

  if(!res.ok){
      return {
      success: false,
      error: "Failed to delete threat",
      data: []
      };
    }

  // const json = await res.json();
    return {
      success:true
    };
}

export async function searchThreats(searchTerm: string, limit = 10) {
  try {
    const params = new URLSearchParams();
    params.set("q", searchTerm);
    params.set("limit", limit.toString());

    const response = await fetch(`/api/threats?${params.toString()}`);
    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Failed to search threats:", error);
    return { success: false, error: "Failed to search threats", data: [] };
  }
}

export async function getThreats(searchTerm?: string, limit = 10) {
  try {
    const params = new URLSearchParams();
    if (searchTerm) params.set("q", searchTerm);
    params.set("limit", limit.toString());

    const response = await fetch(`/api/threats?${params.toString()}`);
    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Failed to get threats:", error);
    return { success: false, error: "Failed to get threats", data: [] };
  }
}

export async function getThreatById(id: string) {
  try {
    const response = await fetch(`/api/threats/${id}`);
    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Failed to get threat:", error);
    return { success: false, error: "Failed to get threat", data: null };
  }
}
