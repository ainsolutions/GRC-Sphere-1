"use server"

import { getDatabase } from "@/lib/database"
import { AuditLogger, AUDIT_ACTIONS, ENTITY_TYPES } from "@/lib/audit-logger"

const sql = getDatabase()

interface Control {
  id?: string
  control_id: string
  control_name: string
  control_description: string
  control_type: string
  control_category: string
  implementation_status: string
  effectiveness_rating: string
  control_owner: string
  iso27001_reference?: string
  iso27002_control_id?: number
  implementation_date?: string
  testing_frequency: string
  last_test_date?: string
  next_test_date?: string
  review_frequency?: string
  next_review_date?: string
  compliance_frameworks?: string[]
  control_activities?: string[]
  testing_procedures?: string[]
  evidence_requirements?: string[]
  remediation_notes?: string
  responsible_party?: string
}

export async function getControls(searchTerm?: string) {
  try {
    // Create enhanced controls table if it doesn't exist
    await sql`
      CREATE TABLE IF NOT EXISTS controls (
        id SERIAL PRIMARY KEY,
        control_id VARCHAR(50) UNIQUE NOT NULL,
        control_name VARCHAR(255) NOT NULL,
        control_description TEXT,
        control_type VARCHAR(100),
        control_category VARCHAR(100),
        implementation_status VARCHAR(50),
        effectiveness_rating VARCHAR(20),
        control_owner VARCHAR(255),
        iso27001_reference VARCHAR(20),
        iso27002_control_id INTEGER REFERENCES iso27002_controls(id),
        implementation_date DATE,
        testing_frequency VARCHAR(50),
        last_test_date DATE,
        next_test_date DATE,
        review_frequency VARCHAR(50) DEFAULT 'Annual',
        next_review_date DATE,
        responsible_party VARCHAR(255),
        compliance_frameworks JSONB DEFAULT '[]'::jsonb,
        control_activities JSONB DEFAULT '[]'::jsonb,
        testing_procedures JSONB DEFAULT '[]'::jsonb,
        evidence_requirements JSONB DEFAULT '[]'::jsonb,
        remediation_notes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `

    // Create indexes for better performance
    await sql`
      CREATE INDEX IF NOT EXISTS idx_controls_iso27002_control_id ON controls(iso27002_control_id);
      CREATE INDEX IF NOT EXISTS idx_controls_iso27001_reference ON controls(iso27001_reference);
      CREATE INDEX IF NOT EXISTS idx_controls_implementation_status ON controls(implementation_status);
      CREATE INDEX IF NOT EXISTS idx_controls_effectiveness_rating ON controls(effectiveness_rating);
      CREATE INDEX IF NOT EXISTS idx_controls_next_test_date ON controls(next_test_date);
      CREATE INDEX IF NOT EXISTS idx_controls_next_review_date ON controls(next_review_date);
    `

    let controls
    if (searchTerm && searchTerm.trim() !== "") {
      controls = await sql`
        SELECT 
          c.id,
          c.control_id,
          c.control_name,
          c.control_description,
          c.control_type,
          c.control_category,
          c.implementation_status,
          c.effectiveness_rating,
          c.control_owner,
          c.iso27001_reference,
          c.iso27002_control_id,
          c.implementation_date,
          c.testing_frequency,
          c.last_test_date,
          c.next_test_date,
          c.review_frequency,
          c.next_review_date,
          c.responsible_party,
          c.compliance_frameworks,
          c.control_activities,
          c.testing_procedures,
          c.evidence_requirements,
          c.remediation_notes,
          c.created_at,
          c.updated_at,
          iso27002.control_code as iso27002_control_code,
          iso27002.control_title as iso27002_control_title,
          iso27002_cat.category_code as iso27002_category_code,
          iso27002_cat.category_name as iso27002_category_name
        FROM controls c
        LEFT JOIN iso27002_controls iso27002 ON c.iso27002_control_id = iso27002.id
        LEFT JOIN iso27002_control_categories iso27002_cat ON iso27002.category_id = iso27002_cat.id
        WHERE 
          c.control_name ILIKE ${`%${searchTerm}%`} OR
          c.control_description ILIKE ${`%${searchTerm}%`} OR
          c.control_id ILIKE ${`%${searchTerm}%`} OR
          c.control_category ILIKE ${`%${searchTerm}%`} OR
          c.iso27001_reference ILIKE ${`%${searchTerm}%`} OR
          iso27002.control_code ILIKE ${`%${searchTerm}%`} OR
          iso27002.control_title ILIKE ${`%${searchTerm}%`}
        ORDER BY c.created_at DESC
      `
    } else {
      controls = await sql`
        SELECT 
          c.id,
          c.control_id,
          c.control_name,
          c.control_description,
          c.control_type,
          c.control_category,
          c.implementation_status,
          c.effectiveness_rating,
          c.control_owner,
          c.iso27001_reference,
          c.iso27002_control_id,
          c.implementation_date,
          c.testing_frequency,
          c.last_test_date,
          c.next_test_date,
          c.review_frequency,
          c.next_review_date,
          c.responsible_party,
          c.compliance_frameworks,
          c.control_activities,
          c.testing_procedures,
          c.evidence_requirements,
          c.remediation_notes,
          c.created_at,
          c.updated_at,
          iso27002.control_code as iso27002_control_code,
          iso27002.control_title as iso27002_control_title,
          iso27002_cat.category_code as iso27002_category_code,
          iso27002_cat.category_name as iso27002_category_name
        FROM controls c
        LEFT JOIN iso27002_controls iso27002 ON c.iso27002_control_id = iso27002.id
        LEFT JOIN iso27002_control_categories iso27002_cat ON iso27002.category_id = iso27002_cat.id
        ORDER BY c.created_at DESC
      `
    }

    // Log the read action
    await AuditLogger.log({
      userId: "system",
      userEmail: "system@company.com",
      action: AUDIT_ACTIONS.READ,
      entityType: ENTITY_TYPES.CONTROL,
      entityId: "all",
    })

    return { success: true, data: controls }
  } catch (error) {
    console.error("Failed to get controls:", error)
    return { success: false, error: "Failed to get controls", data: [] }
  }
}

export async function getISO27002Controls(searchTerm?: string) {
  try {
    let controls
    if (searchTerm && searchTerm.trim() !== "") {
      controls = await sql`
        SELECT 
          iso27002.id,
          iso27002.control_code,
          iso27002.control_title,
          iso27002.control_description,
          iso27002.control_guidance,
          iso27002_cat.category_code,
          iso27002_cat.category_name,
          iso27002_cat.category_description
        FROM iso27002_controls iso27002
        LEFT JOIN iso27002_control_categories iso27002_cat ON iso27002.category_id = iso27002_cat.id
        WHERE 
          iso27002.is_active = true AND
          (iso27002.control_code ILIKE ${`%${searchTerm}%`} OR
           iso27002.control_title ILIKE ${`%${searchTerm}%`} OR
           iso27002.control_description ILIKE ${`%${searchTerm}%`} OR
           iso27002_cat.category_code ILIKE ${`%${searchTerm}%`} OR
           iso27002_cat.category_name ILIKE ${`%${searchTerm}%`})
        ORDER BY iso27002.control_code
      `
    } else {
      controls = await sql`
        SELECT 
          iso27002.id,
          iso27002.control_code,
          iso27002.control_title,
          iso27002.control_description,
          iso27002.control_guidance,
          iso27002_cat.category_code,
          iso27002_cat.category_name,
          iso27002_cat.category_description
        FROM iso27002_controls iso27002
        LEFT JOIN iso27002_control_categories iso27002_cat ON iso27002.category_id = iso27002_cat.id
        WHERE iso27002.is_active = true
        ORDER BY iso27002.control_code
      `
    }

    return { success: true, data: controls }
  } catch (error) {
    console.error("Failed to get ISO 27002 controls:", error)
    return { success: false, error: "Failed to get ISO 27002 controls", data: [] }
  }
}

export async function getControlById(id: string) {
  try {
    const control = await sql`
      SELECT 
        c.id,
        c.control_id,
        c.control_name,
        c.control_description,
        c.control_type,
        c.control_category,
        c.implementation_status,
        c.effectiveness_rating,
        c.control_owner,
        c.iso27001_reference,
        c.iso27002_control_id,
        c.implementation_date,
        c.testing_frequency,
        c.last_test_date,
        c.next_test_date,
        c.review_frequency,
        c.next_review_date,
        c.responsible_party,
        c.compliance_frameworks,
        c.control_activities,
        c.testing_procedures,
        c.evidence_requirements,
        c.remediation_notes,
        c.created_at,
        c.updated_at,
        iso27002.control_code as iso27002_control_code,
        iso27002.control_title as iso27002_control_title,
        iso27002_cat.category_code as iso27002_category_code,
        iso27002_cat.category_name as iso27002_category_name
      FROM controls c
      LEFT JOIN iso27002_controls iso27002 ON c.iso27002_control_id = iso27002.id
      LEFT JOIN iso27002_control_categories iso27002_cat ON iso27002.category_id = iso27002_cat.id
      WHERE c.id = ${id}
    `

    if (control.length === 0) {
      return { success: false, error: "Control not found", data: null }
    }

    // Log the read action
    await AuditLogger.log({
      userId: "system",
      userEmail: "system@company.com",
      action: AUDIT_ACTIONS.READ,
      entityType: ENTITY_TYPES.CONTROL,
      entityId: id,
    })

    return { success: true, data: control[0] }
  } catch (error) {
    console.error("Failed to get control:", error)
    return { success: false, error: "Failed to get control", data: null }
  }
}

export async function createControl(formData: FormData) {
  try {
    // Extract form data
    const control_id = formData.get("control_id") as string
    const control_name = formData.get("control_name") as string
    const control_description = formData.get("control_description") as string
    const control_type = formData.get("control_type") as string
    const control_category = formData.get("control_category") as string
    const implementation_status = formData.get("implementation_status") as string
    const effectiveness_rating = formData.get("effectiveness_rating") as string
    const control_owner = formData.get("control_owner") as string
    const iso27001_reference = formData.get("iso27001_reference") as string
    const iso27002_control_id = formData.get("iso27002_control_id") as string
    const implementation_date = formData.get("implementation_date") as string
    const testing_frequency = formData.get("testing_frequency") as string
    const last_test_date = formData.get("last_test_date") as string
    const next_test_date = formData.get("next_test_date") as string
    const review_frequency = (formData.get("review_frequency") as string) || "Annual"
    const next_review_date = formData.get("next_review_date") as string
    const responsible_party = formData.get("responsible_party") as string

    // Validate required fields
    if (!control_id || !control_name) {
      return { success: false, error: "Control ID and name are required" }
    }

    // Check if control_id already exists
    const existing = await sql`
      SELECT id FROM controls WHERE control_id = ${control_id}
    `

    if (existing.length > 0) {
      return { success: false, error: "Control ID already exists" }
    }

    const result = await sql`
      INSERT INTO controls (
        control_id, control_name, control_description, control_type, control_category,
        implementation_status, effectiveness_rating, control_owner, iso27001_reference,
        iso27002_control_id,implementation_date,
        testing_frequency, last_test_date, next_test_date, review_frequency,
        next_review_date, responsible_party
      ) VALUES (
        ${control_id}, ${control_name}, ${control_description || ""}, 
        ${control_type || ""}, ${control_category || ""}, 
        ${implementation_status || ""}, ${effectiveness_rating || ""}, 
        ${control_owner || ""}, ${iso27001_reference === "none" ? null : iso27001_reference},
        ${iso27002_control_id && iso27002_control_id !== "none" ? Number.parseInt(iso27002_control_id) : null},
        ${implementation_date || null}, ${testing_frequency || ""}, 
        ${last_test_date || null}, ${next_test_date || null},
        ${review_frequency}, ${next_review_date || null}, ${responsible_party || ""}
      ) RETURNING id, control_id, control_name
    `

    // Log the create action
    await AuditLogger.log({
      userId: "system",
      userEmail: "system@company.com",
      action: AUDIT_ACTIONS.CREATE,
      entityType: ENTITY_TYPES.CONTROL,
      entityId: result[0].id.toString(),
      newValues: { control_id, control_name, implementation_status, effectiveness_rating },
    })

    return {
      success: true,
      data: result[0],
      message: `Control "${result[0].control_name}" created successfully`,
    }
  } catch (error) {
    console.error("Failed to create control:", error)
    if (error.message?.includes("duplicate key")) {
      return { success: false, error: "Control ID already exists" }
    }
    return { success: false, error: "Failed to create control" }
  }
}

export async function updateControl(id: string, formData: FormData) {
  try {
    // Extract form data
    const control_id = formData.get("control_id") as string
    const control_name = formData.get("control_name") as string
    const control_description = formData.get("control_description") as string
    const control_type = formData.get("control_type") as string
    const control_category = formData.get("control_category") as string
    const implementation_status = formData.get("implementation_status") as string
    const effectiveness_rating = formData.get("effectiveness_rating") as string
    const control_owner = formData.get("control_owner") as string
    const iso27001_reference = formData.get("iso27001_reference") as string
    const iso27002_control_id = formData.get("iso27002_control_id") as string
    const implementation_date = formData.get("implementation_date") as string
    const testing_frequency = formData.get("testing_frequency") as string
    const last_test_date = formData.get("last_test_date") as string
    const next_test_date = formData.get("next_test_date") as string
    const review_frequency = (formData.get("review_frequency") as string) || "Annual"
    const next_review_date = formData.get("next_review_date") as string
    const responsible_party = formData.get("responsible_party") as string

    // Validate required fields
    if (!control_id || !control_name) {
      return { success: false, error: "Control ID and name are required" }
    }

    // Get old values for audit log
    const oldControl = await sql`
      SELECT * FROM controls WHERE id = ${id}
    `

    if (oldControl.length === 0) {
      return { success: false, error: "Control not found" }
    }

    // Check if control_id already exists for other records
    const existing = await sql`
      SELECT id FROM controls WHERE control_id = ${control_id} AND id != ${id}
    `

    if (existing.length > 0) {
      return { success: false, error: "Control ID already exists" }
    }

    const result = await sql`
      UPDATE controls SET
        control_id = ${control_id},
        control_name = ${control_name},
        control_description = ${control_description || ""},
        control_type = ${control_type || ""},
        control_category = ${control_category || ""},
        implementation_status = ${implementation_status || ""},
        effectiveness_rating = ${effectiveness_rating || ""},
        control_owner = ${control_owner || ""},
        iso27001_reference = ${iso27001_reference === "none" ? null : iso27001_reference},
        iso27002_control_id = ${iso27002_control_id && iso27002_control_id !== "none" ? Number.parseInt(iso27002_control_id) : null},
        implementation_date = ${implementation_date || null},
        testing_frequency = ${testing_frequency || ""},
        last_test_date = ${last_test_date || null},
        next_test_date = ${next_test_date || null},
        review_frequency = ${review_frequency},
        next_review_date = ${next_review_date || null},
        responsible_party = ${responsible_party || ""},
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ${id}
      RETURNING id, control_id, control_name
    `

    if (result.length === 0) {
      return { success: false, error: "Failed to update control" }
    }

    // Log the update action
    await AuditLogger.log({
      userId: "system",
      userEmail: "system@company.com",
      action: AUDIT_ACTIONS.UPDATE,
      entityType: ENTITY_TYPES.CONTROL,
      entityId: id,
      oldValues: oldControl[0],
      newValues: { control_id, control_name, implementation_status, effectiveness_rating },
    })

    return {
      success: true,
      data: result[0],
      message: `Control "${result[0].control_name}" updated successfully`,
    }
  } catch (error) {
    console.error("Failed to update control:", error)
    if (error.message?.includes("duplicate key")) {
      return { success: false, error: "Control ID already exists" }
    }
    return { success: false, error: "Failed to update control" }
  }
}

export async function deleteControl(id: number) {
  try {
    // Get control data for audit log
    const control = await sql`
      SELECT * FROM controls WHERE id = ${id}
    `

    if (control.length === 0) {
      return { success: false, error: "Control not found" }
    }

    await sql`
      DELETE FROM controls WHERE id = ${id}
    `

    // Log the delete action
    await AuditLogger.log({
      userId: "system",
      userEmail: "system@company.com",
      action: AUDIT_ACTIONS.DELETE,
      entityType: ENTITY_TYPES.CONTROL,
      entityId: id.toString(),
      oldValues: control[0],
    })

    return {
      success: true,
      message: `Control "${control[0].control_name}" deleted successfully`,
    }
  } catch (error) {
    console.error("Failed to delete control:", error)
    return { success: false, error: "Failed to delete control" }
  }
}

export async function searchControls(searchTerm: string) {
  try {
    const controls = await sql`
      SELECT 
        c.id,
        c.control_id,
        c.control_name,
        c.control_description,
        c.control_type,
        c.control_category,
        c.implementation_status,
        c.effectiveness_rating,
        c.control_owner,
        c.iso27001_reference,
        c.iso27002_control_id,
        c.implementation_date,
        c.testing_frequency,
        c.last_test_date,
        c.next_test_date,
        c.review_frequency,
        c.next_review_date,
        c.responsible_party,
        c.compliance_frameworks,
        c.control_activities,
        c.testing_procedures,
        c.evidence_requirements,
        c.remediation_notes,
        c.created_at,
        c.updated_at,
        iso27002.control_code as iso27002_control_code,
        iso27002.control_title as iso27002_control_title,
        iso27002_cat.category_code as iso27002_category_code,
        iso27002_cat.category_name as iso27002_category_name
      FROM controls c
      LEFT JOIN iso27002_controls iso27002 ON c.iso27002_control_id = iso27002.id
      LEFT JOIN iso27002_control_categories iso27002_cat ON iso27002.category_id = iso27002_cat.id
      WHERE 
        c.control_name ILIKE ${`%${searchTerm}%`} OR
        c.control_description ILIKE ${`%${searchTerm}%`} OR
        c.control_id ILIKE ${`%${searchTerm}%`} OR
        c.control_category ILIKE ${`%${searchTerm}%`} OR
        c.iso27001_reference ILIKE ${`%${searchTerm}%`} OR
        iso27002.control_code ILIKE ${`%${searchTerm}%`} OR
        iso27002.control_title ILIKE ${`%${searchTerm}%`}
      ORDER BY c.created_at DESC
    `

    return { success: true, data: controls }
  } catch (error) {
    console.error("Failed to search controls:", error)
    return { success: false, error: "Failed to search controls", data: [] }
  }
}

export async function getControlsStatistics() {
  try {
    const stats = await sql`
      SELECT 
        COUNT(*) as total_controls,
        COUNT(CASE WHEN implementation_status = 'Implemented' THEN 1 END) as implemented,
        COUNT(CASE WHEN implementation_status = 'Partially Implemented' THEN 1 END) as partially_implemented,
        COUNT(CASE WHEN implementation_status = 'Not Implemented' THEN 1 END) as not_implemented,
        COUNT(CASE WHEN effectiveness_rating = 'Effective' THEN 1 END) as effective,
        COUNT(CASE WHEN effectiveness_rating = 'Partially Effective' THEN 1 END) as partially_effective,
        COUNT(CASE WHEN effectiveness_rating = 'Ineffective' THEN 1 END) as ineffective,
        COUNT(CASE WHEN effectiveness_rating = 'Not Tested' THEN 1 END) as not_tested,
        COUNT(CASE WHEN next_test_date <= CURRENT_DATE THEN 1 END) as due_for_testing,
        COUNT(CASE WHEN next_review_date <= CURRENT_DATE THEN 1 END) as due_for_review,
       
      FROM controls
    `

    return { success: true, data: stats[0] }
  } catch (error) {
    console.error("Failed to get controls statistics:", error)
    return { success: false, error: "Failed to get controls statistics", data: null }
  }
}
