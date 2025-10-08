"use server"

import { getDatabase } from "@/lib/database"

const sql = getDatabase()

// Mock data for development
const mockFindings = [
  {
    id: 1,
    finding_id: "FIND-2025-0000001",
    assessment_id: 1,
    finding_title: "Weak Password Policy Implementation",
    finding_description: "The current password policy does not meet industry standards for complexity requirements.",
    severity: "High",
    category: "Access Control",
    recommendation:
      "Implement stronger password complexity requirements including minimum length, character diversity, and regular rotation.",
    status: "Open",
    user_id: 1,
    department_id: 1,
    organization_id: 1,
    assigned_to: "John Smith",
    due_date: "2025-02-15",
    created_at: "2025-01-15T10:00:00Z",
    updated_at: "2025-01-15T10:00:00Z",
    assessment_name: "ISO 27001 Security Assessment",
    assessment_code: "ISO-2025-001",
    user_name: "Admin User",
    username: "admin",
    department_name: "IT Security",
    organization_name: "Sample Organization",
  },
  {
    id: 2,
    finding_id: "FIND-2025-0000002",
    assessment_id: 2,
    finding_title: "Missing Security Headers in Web Applications",
    finding_description:
      "Web applications are missing critical security headers such as HSTS, CSP, and X-Frame-Options.",
    severity: "Medium",
    category: "Web Security",
    recommendation: "Implement comprehensive security headers across all web applications to prevent common attacks.",
    status: "In Progress",
    user_id: 1,
    department_id: 1,
    organization_id: 1,
    assigned_to: "Jane Doe",
    due_date: "2025-02-20",
    created_at: "2025-01-10T14:30:00Z",
    updated_at: "2025-01-20T09:15:00Z",
    assessment_name: "Web Application Security Test",
    assessment_code: "WAST-2025-001",
    user_name: "Admin User",
    username: "admin",
    department_name: "IT Security",
    organization_name: "Sample Organization",
  },
  {
    id: 3,
    finding_id: "FIND-2025-0000003",
    assessment_id: 1,
    finding_title: "Unencrypted Data Transmission",
    finding_description: "Sensitive data is being transmitted over unencrypted channels in several system interfaces.",
    severity: "Critical",
    category: "Data Protection",
    recommendation: "Implement TLS encryption for all data transmission channels and disable legacy protocols.",
    status: "Open",
    user_id: 1,
    department_id: 1,
    organization_id: 1,
    assigned_to: "Mike Johnson",
    due_date: "2025-02-10",
    created_at: "2025-01-08T16:45:00Z",
    updated_at: "2025-01-08T16:45:00Z",
    assessment_name: "ISO 27001 Security Assessment",
    assessment_code: "ISO-2025-001",
    user_name: "Admin User",
    username: "admin",
    department_name: "IT Security",
    organization_name: "Sample Organization",
  },
  {
    id: 4,
    finding_id: "FIND-2025-0000004",
    assessment_id: 3,
    finding_title: "Inadequate Access Control Reviews",
    finding_description: "User access reviews are not conducted regularly, leading to potential privilege creep.",
    severity: "High",
    category: "Access Control",
    recommendation: "Establish quarterly access reviews and implement automated tools for access monitoring.",
    status: "Resolved",
    user_id: 1,
    department_id: 1,
    organization_id: 1,
    assigned_to: "Sarah Wilson",
    due_date: "2025-01-25",
    created_at: "2025-01-05T11:20:00Z",
    updated_at: "2025-01-25T15:30:00Z",
    assessment_name: "NIST Cybersecurity Framework Review",
    assessment_code: "NIST-2025-001",
    user_name: "Admin User",
    username: "admin",
    department_name: "IT Security",
    organization_name: "Sample Organization",
  },
  {
    id: 5,
    finding_id: "FIND-2025-0000005",
    assessment_id: 2,
    finding_title: "SQL Injection Vulnerabilities",
    finding_description: "Multiple SQL injection vulnerabilities identified in the customer portal application.",
    severity: "Critical",
    category: "Web Security",
    recommendation: "Implement parameterized queries and input validation across all database interactions.",
    status: "In Progress",
    user_id: 1,
    department_id: 1,
    organization_id: 1,
    assigned_to: "Tom Anderson",
    due_date: "2025-02-05",
    created_at: "2025-01-12T13:15:00Z",
    updated_at: "2025-01-22T10:45:00Z",
    assessment_name: "Web Application Security Test",
    assessment_code: "WAST-2025-001",
    user_name: "Admin User",
    username: "admin",
    department_name: "IT Security",
    organization_name: "Sample Organization",
  },
  {
    id: 6,
    finding_id: "FIND-2025-0000006",
    assessment_id: 4,
    finding_title: "Missing Data Backup Procedures",
    finding_description: "Critical business data lacks proper backup procedures and disaster recovery testing.",
    severity: "High",
    category: "Business Continuity",
    recommendation: "Implement comprehensive backup strategy with regular testing and offsite storage.",
    status: "Open",
    user_id: 1,
    department_id: 1,
    organization_id: 1,
    assigned_to: "Lisa Chen",
    due_date: "2025-02-28",
    created_at: "2025-01-18T09:30:00Z",
    updated_at: "2025-01-18T09:30:00Z",
    assessment_name: "Business Continuity Assessment",
    assessment_code: "BCP-2025-001",
    user_name: "Admin User",
    username: "admin",
    department_name: "IT Operations",
    organization_name: "Sample Organization",
  },
  {
    id: 7,
    finding_id: "FIND-2025-0000007",
    assessment_id: 3,
    finding_title: "Insufficient Network Segmentation",
    finding_description: "Network lacks proper segmentation between critical and non-critical systems.",
    severity: "Medium",
    category: "Network Security",
    recommendation: "Implement network segmentation using VLANs and firewalls to isolate critical systems.",
    status: "Open",
    user_id: 1,
    department_id: 1,
    organization_id: 1,
    assigned_to: "David Kim",
    due_date: "2025-03-15",
    created_at: "2025-01-20T14:20:00Z",
    updated_at: "2025-01-20T14:20:00Z",
    assessment_name: "NIST Cybersecurity Framework Review",
    assessment_code: "NIST-2025-001",
    user_name: "Admin User",
    username: "admin",
    department_name: "Network Operations",
    organization_name: "Sample Organization",
  },
  {
    id: 8,
    finding_id: "FIND-2025-0000008",
    assessment_id: 5,
    finding_title: "Outdated Antivirus Signatures",
    finding_description: "Several workstations have outdated antivirus signatures and definitions.",
    severity: "Low",
    category: "Endpoint Security",
    recommendation: "Configure automatic updates for antivirus software and implement centralized management.",
    status: "Resolved",
    user_id: 1,
    department_id: 1,
    organization_id: 1,
    assigned_to: "Robert Taylor",
    due_date: "2025-01-30",
    created_at: "2025-01-14T08:45:00Z",
    updated_at: "2025-01-28T16:20:00Z",
    assessment_name: "Endpoint Security Review",
    assessment_code: "ESR-2025-001",
    user_name: "Admin User",
    username: "admin",
    department_name: "IT Support",
    organization_name: "Sample Organization",
  },
]

export async function getFindings(
  assessmentId?: number,
  status?: string,
  organizationId?: number,
  departmentId?: number,
) {

  try {
    const findings = await sql`
      SELECT 
        af.*,
        COALESCE(a.assessment_name, a.name, 'Unknown Assessment') as assessment_name,
        COALESCE(a.assessment_id, a.id::text, 'Unknown') as assessment_code,
        COALESCE(u.first_name || ' ' || u.last_name, 'Unknown User') as user_name,
        COALESCE(u.username, 'unknown') as username,
        COALESCE(d.name, 'Unknown Department') as department_name,
        COALESCE(o.name, 'Unknown Organization') as organization_name
      FROM assessment_findings af
      LEFT JOIN assessments a ON af.assessment_id = a.id
      LEFT JOIN users u ON af.user_id = u.id
      LEFT JOIN departments d ON af.department_id = d.id
      LEFT JOIN organizations o ON af.organization_id = o.id
      ORDER BY 
        CASE af.severity 
          WHEN 'Critical' THEN 1 
          WHEN 'High' THEN 2 
          WHEN 'Medium' THEN 3 
          WHEN 'Low' THEN 4 
          WHEN 'Informational' THEN 5 
        END,
        af.created_at DESC
    `

    return { success: true, data: findings }
  } catch (error) {
    console.error("Failed to get findings:", error)
    console.log("Falling back to mock data")
    return {
      success: true,
      data: mockFindings,
    }
  }
}

export async function deleteFinding(id: number) {

  try {
    const existing = await sql`
      SELECT * FROM assessment_findings WHERE id = ${id}
    `

    if (existing.length === 0) {
      return { success: false, error: "Finding not found" }
    }

    await sql`
      DELETE FROM assessment_findings WHERE id = ${id}
    `

    return { success: true }
  } catch (error) {
    console.error("Failed to delete finding:", error)
    return { success: false, error: `Failed to delete finding: ${error.message}` }
  }
}

export async function updateFindingStatus(id: number, status: string, userId?: string) {

  try {
    const existing = await sql`
      SELECT * FROM assessment_findings WHERE id = ${id}
    `

    if (existing.length === 0) {
      return { success: false, error: "Finding not found" }
    }

    const result = await sql`
      UPDATE assessment_findings 
      SET 
        status = ${status},
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ${id}
      RETURNING *
    `

    return { success: true, data: result[0] }
  } catch (error) {
    console.error("Failed to update finding status:", error)
    return { success: false, error: `Failed to update finding status: ${error.message}` }
  }
}
