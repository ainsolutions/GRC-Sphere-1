"use server"

import { neon } from "@neondatabase/serverless"
import { AuditLogger, AUDIT_ACTIONS } from "@/lib/audit-logger"
import { searchThreats } from "@/lib/actions/threat-actions"

// Check if database is configured
const databaseUrl = process.env.DATABASE_URL || process.env.POSTGRES_URL
if (!databaseUrl) {
  console.warn("No database connection string found. Database operations will fail.")
}

const sql = databaseUrl ? neon(databaseUrl) : null

export async function getNISTCSFFunctions() {
  const res = await fetch("/api/nist-csf-functions", {
    method: "GET",
    credentials: "include"
  })
  if (!res.ok) {
    return { success: false, error: "Failed to fetch functions" }
  }
  return await res.json()
}

export async function getNISTCSFCategories(functionId?: number) {
  const res = await fetch(`/api/nist-csf-categories${functionId ? `?functionId=${functionId}` : ""}`, {
    method: "GET",
    credentials: "include"
  })
  if (!res.ok) {
    return { success: false, error: "Failed to fetch categories" }
  }
  return await res.json()
}

export async function getNISTCSFSubcategories(categoryId: number) {
  const res = await fetch(`/api/nist-csf-subcategories?categoryId=${categoryId}`, {
    method: "GET",
    credentials: "include"
  })
  if (!res.ok) {
    return { success: false, error: "Failed to fetch subcategories" }
  }
  return await res.json()
}


// nist-csf-actions.ts
export async function getNistCsfRiskTemplates(params?: {
  search?: string;
  functionId?: string;
  riskLevel?: string;
  page?: number;
  limit?: number;
}) {
  const query = new URLSearchParams();
  if (params?.search) query.append("search", params.search);
  if (params?.functionId) query.append("functionId", params.functionId);
  if (params?.riskLevel) query.append("riskLevel", params.riskLevel);
  if (params?.page) query.append("page", String(params.page));
  if (params?.limit) query.append("limit", String(params.limit));

  const res = await fetch(`/api/nist-csf-risk-templates?${query.toString()}`);
  if (!res.ok) throw new Error("Failed to fetch NIST CSF risk templates");
  return await res.json();     // preserves same return shape
}

export async function getNistCsfRiskTemplateById(id: number) {
  const res = await fetch(`/api/nist-csf-risk-templates/${id}`);
  if (!res.ok) throw new Error("Failed to fetch template");
  return await res.json();
}

export async function createNistCsfRiskTemplate(data: any) {
  const res = await fetch(`/api/nist-csf-risk-templates`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to create template");
  return await res.json();
}

export async function createNistCsfRiskTemplate(data: any) {
  const res = await fetch(`/api/nist-csf-risk-templates`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to create template");
  return await res.json();
}


export async function getNISTCSFImplementationTiers() {
  if (!sql) {
    return {
      success: false,
      error: "Database not configured",
      data: [],
    }
  }

  try {
    const tiers = await sql`
      SELECT 
        id,
        tier_level,
        tier_name,
        tier_description,
        characteristics,
        created_at
      FROM nist_csf_implementation_tiers 
      ORDER BY tier_level
    `

    return {
      success: true,
      data: tiers,
    }
  } catch (error) {
    console.error("Error fetching NIST CSF implementation tiers:", error)
    return {
      success: false,
      error: "Failed to fetch NIST CSF implementation tiers",
      data: [],
    }
  }
}

export async function createNISTCSFOrganizationalProfile(profileData: any) {
  if (!sql) {
    return {
      success: false,
      error: "Database not configured",
    }
  }

  try {
    const profile = await sql`
      INSERT INTO nist_csf_organizational_profiles (
        profile_name,
        profile_description,
        organization_type,
        industry_sector,
        profile_type,
        subcategory_implementations
      ) VALUES (
        ${profileData.profile_name},
        ${profileData.profile_description},
        ${profileData.organization_type},
        ${profileData.industry_sector},
        ${profileData.profile_type || "Current"},
        ${JSON.stringify(profileData.subcategory_implementations || {})}
      ) RETURNING id
    `

    await AuditLogger.log({
      userId: "system",
      userEmail: "system@company.com",
      action: AUDIT_ACTIONS.CREATE,
      entityType: "NIST_CSF_PROFILE",
      entityId: profile[0].id.toString(),
      newValues: {
        profile_name: profileData.profile_name,
        profile_type: profileData.profile_type,
      },
    })

    return {
      success: true,
      data: { id: profile[0].id },
    }
  } catch (error) {
    console.error("Error creating NIST CSF organizational profile:", error)
    return {
      success: false,
      error: "Failed to create NIST CSF organizational profile",
    }
  }
}

export async function deleteNistCsfRiskTemplate(id: number) {
  const res = await fetch(`/api/nist-csf-risk-templates/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Failed to delete template");
  return await res.json();
}

export async function updateNistCsfRiskTemplate(id: number, data: any) {
  const res = await fetch(`/api/nist-csf-risk-templates/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to update template");
  return await res.json();
}


export async function getNISTCSFRiskTemplate(templateId: number) {
  if (!sql) {
    return {
      success: false,
      error: "Database not configured",
      data: null,
    }
  }

  try {
    const template = await sql`
      SELECT 
        t.*,
        f.function_code,
        f.function_name,
        c.category_code,
        c.category_name
      FROM nist_csf_risk_templates t
      LEFT JOIN nist_csf_functions f ON t.function_id = f.id
      LEFT JOIN nist_csf_categories c ON t.category_id = c.id
      WHERE t.id = ${templateId}
    `

    if (template.length === 0) {
      return {
        success: false,
        error: "Template not found",
        data: null,
      }
    }

    // Get associated controls
    const controls = await sql`
      SELECT 
        tc.*,
        s.subcategory_code,
        s.subcategory_name
      FROM nist_csf_template_controls tc
      LEFT JOIN nist_csf_subcategories s ON tc.subcategory_id = s.id
      WHERE tc.template_id = ${templateId}
    `

    // Get associated scenarios
    const scenarios = await sql`
      SELECT * FROM nist_csf_risk_scenarios
      WHERE template_id = ${templateId}
    `

    const templateData = {
      ...template[0],
      controls: controls,
      scenarios: scenarios,
    }

    return {
      success: true,
      data: templateData,
    }
  } catch (error) {
    console.error("Error fetching NIST CSF risk template:", error)
    return {
      success: false,
      error: "Failed to fetch NIST CSF risk template",
      data: null,
    }
  }
}
