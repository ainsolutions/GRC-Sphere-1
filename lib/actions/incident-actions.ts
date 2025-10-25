"use client"

export interface Incident {
  id: number;
  title: string;
  description?: string;
  severity?: string;
  status?: string;
  occurred_at?: string; // ISO string
  detected_at?: string; // ISO string
  related_asset_id?: number | null;
  related_risk_id?: number | null;
  created_at?: string;
  updated_at?: string;
}

export interface CreateIncidentPayload {
  title: string;
  description?: string;
  severity?: string;
  status?: string;
  occurred_at?: string;
  detected_at?: string;
  related_asset_id?: number | null;
  related_risk_id?: number | null;
}

export interface UpdateIncidentPayload extends Partial<CreateIncidentPayload> {}


export async function getIncidents(filters?: { limit?: number; offset?: number; status?: string }) {
  try {
    const params = new URLSearchParams();
    if (filters?.limit) params.set("limit", filters.limit.toString());
    if (filters?.offset) params.set("offset", filters.offset.toString());
    if (filters?.status) params.set("status", filters.status);

    const response = await fetch(`/api/incidents?${params.toString()}`);
    const result = await response.json();
    debugger;

    return { success: true, data: result  };
  } catch (error) {
    console.error("Failed to get incidents:", error);
    return { success: false, error: "Failed to get incidents", data: [] };
  }
}

export async function getIncidentById(id: number) {
  try {
    const response = await fetch(`/api/incidents/${id}`);
    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Failed to get incident:", error);
    return { success: false, error: "Failed to get incident", data: null };
  }
}

export async function createIncident(payload: any) {
  try {
    const response = await fetch("/api/incidents", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Failed to create incident:", error);
    return { success: false, error: "Failed to create incident" };
  }
}

export async function updateIncident(id: number, payload: any) {
  try {
    const response = await fetch(`/api/incidents/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Failed to update incident:", error);
    return { success: false, error: "Failed to update incident" };
  }
}

export async function deleteIncident(id: number) {
  try {
    const response = await fetch(`/api/incidents/${id}`, {
      method: "DELETE",
    });
    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Failed to delete incident:", error);
    return { success: false, error: "Failed to delete incident" };
  }
}

// Keep these if you have separate search endpoints
export async function searchAssets() {
  try {
    const response = await fetch("/api/assets/lookup");
    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Failed to fetch assets:", error);
    return { success: false, error: "Failed to fetch assets", data: [] };
  }
}

export async function searchRisks() {
  try {
    const response = await fetch("/api/risks/search");
    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Failed to fetch risks:", error);
    return { success: false, error: "Failed to fetch risks", data: [] };
  }
}


export async function createIncidentFromChatbot(form: FormData) {
  // call your createIncident logic, passing ctx.tenantDb as needed
  debugger;
  return createIncident(form)
}

