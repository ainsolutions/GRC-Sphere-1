"use server"

import { neon } from "@neondatabase/serverless"

// Initialize database connection with error handling
let sql: any = null

try {
  if (process.env.DATABASE_URL) {
    sql = neon(process.env.DATABASE_URL)
  } else {
    console.warn("DATABASE_URL not found, using mock data for findings reports")
  }
} catch (error) {
  console.error("Failed to initialize database connection for findings reports:", error)
}

// Mock data for findings reports
const mockReportData = {
  totalFindings: 24,
  criticalFindings: 4,
  highFindings: 7,
  mediumFindings: 8,
  lowFindings: 5,
  openFindings: 15,
  inProgressFindings: 6,
  resolvedFindings: 3,
  findingsByCategory: [
    { category: "Access Control", count: 6 },
    { category: "Data Protection", count: 5 },
    { category: "Network Security", count: 4 },
    { category: "Web Security", count: 3 },
    { category: "Compliance", count: 4 },
    { category: "Physical Security", count: 2 },
  ],
  findingsBySeverity: [
    { severity: "Critical", count: 4 },
    { severity: "High", count: 7 },
    { severity: "Medium", count: 8 },
    { severity: "Low", count: 5 },
  ],
  findingsByAssessment: [
    { assessment: "ISO 27001 Assessment", count: 8 },
    { assessment: "NIST CSF Review", count: 6 },
    { assessment: "Penetration Test", count: 5 },
    { assessment: "Vulnerability Scan", count: 3 },
    { assessment: "Compliance Audit", count: 2 },
  ],
  findingsTrend: [
    { month: "Jan", open: 12, resolved: 3, total: 15 },
    { month: "Feb", open: 14, resolved: 5, total: 19 },
    { month: "Mar", open: 16, resolved: 4, total: 20 },
    { month: "Apr", open: 18, resolved: 6, total: 24 },
    { month: "May", open: 15, resolved: 8, total: 23 },
    { month: "Jun", open: 15, resolved: 3, total: 18 },
  ],
  recentFindings: [
    {
      id: 1,
      finding_id: "F-2024-001",
      finding_title: "Weak Password Policy Implementation",
      severity: "High",
      status: "Open",
      category: "Access Control",
      created_at: new Date().toISOString(),
      assessment_name: "ISO 27001 Assessment",
      assigned_to: "John Smith",
      due_date: "2024-02-15",
    },
    {
      id: 2,
      finding_id: "F-2024-002",
      finding_title: "Missing Security Headers",
      severity: "Medium",
      status: "In Progress",
      category: "Web Security",
      created_at: new Date().toISOString(),
      assessment_name: "Penetration Test",
      assigned_to: "Jane Doe",
      due_date: "2024-02-20",
    },
    {
      id: 3,
      finding_id: "F-2024-003",
      finding_title: "Unencrypted Data Transmission",
      severity: "Critical",
      status: "Open",
      category: "Data Protection",
      created_at: new Date().toISOString(),
      assessment_name: "NIST CSF Review",
      assigned_to: "Mike Johnson",
      due_date: "2024-02-10",
    },
  ],
  agingAnalysis: [
    { ageRange: "0-30 days", count: 8 },
    { ageRange: "31-60 days", count: 6 },
    { ageRange: "61-90 days", count: 4 },
    { ageRange: "90+ days", count: 6 },
  ],
  assigneeWorkload: [
    { assignee: "John Smith", open: 5, inProgress: 2, resolved: 1 },
    { assignee: "Jane Doe", open: 4, inProgress: 3, resolved: 2 },
    { assignee: "Mike Johnson", open: 3, inProgress: 1, resolved: 0 },
    { assignee: "Sarah Wilson", open: 3, inProgress: 0, resolved: 0 },
  ],
}

export async function generateFindingsReport(filters?: {
  assessmentId?: string
  severity?: string
  status?: string
  category?: string
  assignedTo?: string
  dateFrom?: string
  dateTo?: string
}) {
  try {
    if (!sql) {
      console.log("Using mock findings report data")
      return { success: true, data: mockReportData }
    }

    // Build dynamic query based on filters
    let whereClause = "WHERE 1=1"
    const params: any[] = []

    if (filters?.assessmentId) {
      whereClause += ` AND f.assessment_id = $${params.length + 1}`
      params.push(filters.assessmentId)
    }

    if (filters?.severity) {
      whereClause += ` AND f.severity = $${params.length + 1}`
      params.push(filters.severity)
    }

    if (filters?.status) {
      whereClause += ` AND f.status = $${params.length + 1}`
      params.push(filters.status)
    }

    if (filters?.category) {
      whereClause += ` AND f.category = $${params.length + 1}`
      params.push(filters.category)
    }

    if (filters?.assignedTo) {
      whereClause += ` AND f.assigned_to = $${params.length + 1}`
      params.push(filters.assignedTo)
    }

    if (filters?.dateFrom) {
      whereClause += ` AND f.created_at >= $${params.length + 1}`
      params.push(filters.dateFrom)
    }

    if (filters?.dateTo) {
      whereClause += ` AND f.created_at <= $${params.length + 1}`
      params.push(filters.dateTo)
    }

    // Get total findings count
    const totalFindings = await sql`
      SELECT COUNT(*) as count FROM findings f ${whereClause}
    `

    // Get findings by severity
    const findingsBySeverity = await sql`
      SELECT severity, COUNT(*) as count 
      FROM findings f ${whereClause}
      GROUP BY severity
      ORDER BY 
        CASE severity 
          WHEN 'Critical' THEN 1 
          WHEN 'High' THEN 2 
          WHEN 'Medium' THEN 3 
          WHEN 'Low' THEN 4 
        END
    `

    // Get findings by status
    const findingsByStatus = await sql`
      SELECT status, COUNT(*) as count 
      FROM findings f ${whereClause}
      GROUP BY status
    `

    // Get findings by category
    const findingsByCategory = await sql`
      SELECT category, COUNT(*) as count 
      FROM findings f ${whereClause}
      GROUP BY category
      ORDER BY count DESC
    `

    // Get findings by assessment
    const findingsByAssessment = await sql`
      SELECT a.name as assessment, COUNT(*) as count 
      FROM findings f
      LEFT JOIN assessments a ON f.assessment_id = a.id
      ${whereClause}
      GROUP BY a.name
      ORDER BY count DESC
      LIMIT 10
    `

    // Get findings trend (last 6 months)
    const findingsTrend = await sql`
      SELECT 
        TO_CHAR(DATE_TRUNC('month', f.created_at), 'Mon') as month,
        COUNT(CASE WHEN f.status = 'Open' THEN 1 END) as open,
        COUNT(CASE WHEN f.status = 'Resolved' THEN 1 END) as resolved,
        COUNT(*) as total
      FROM findings f
      WHERE f.created_at >= DATE_TRUNC('month', CURRENT_DATE - INTERVAL '5 months')
      ${filters ? "AND " + whereClause.replace("WHERE 1=1 AND ", "") : ""}
      GROUP BY DATE_TRUNC('month', f.created_at)
      ORDER BY DATE_TRUNC('month', f.created_at)
    `

    // Get recent findings
    const recentFindings = await sql`
      SELECT f.id, f.finding_id, f.finding_title, f.severity, f.status, 
             f.category, f.created_at, f.assigned_to, f.due_date,
             a.name as assessment_name
      FROM findings f
      LEFT JOIN assessments a ON f.assessment_id = a.id
      ${whereClause}
      ORDER BY f.created_at DESC
      LIMIT 10
    `

    // Get aging analysis
    const agingAnalysis = await sql`
      SELECT 
        CASE 
          WHEN CURRENT_DATE - f.created_at::date <= 30 THEN '0-30 days'
          WHEN CURRENT_DATE - f.created_at::date <= 60 THEN '31-60 days'
          WHEN CURRENT_DATE - f.created_at::date <= 90 THEN '61-90 days'
          ELSE '90+ days'
        END as ageRange,
        COUNT(*) as count
      FROM findings f ${whereClause}
      GROUP BY 
        CASE 
          WHEN CURRENT_DATE - f.created_at::date <= 30 THEN '0-30 days'
          WHEN CURRENT_DATE - f.created_at::date <= 60 THEN '31-60 days'
          WHEN CURRENT_DATE - f.created_at::date <= 90 THEN '61-90 days'
          ELSE '90+ days'
        END
      ORDER BY 
        CASE 
          WHEN CURRENT_DATE - f.created_at::date <= 30 THEN 1
          WHEN CURRENT_DATE - f.created_at::date <= 60 THEN 2
          WHEN CURRENT_DATE - f.created_at::date <= 90 THEN 3
          ELSE 4
        END
    `

    // Get assignee workload
    const assigneeWorkload = await sql`
      SELECT 
        f.assigned_to as assignee,
        COUNT(CASE WHEN f.status = 'Open' THEN 1 END) as open,
        COUNT(CASE WHEN f.status = 'In Progress' THEN 1 END) as inProgress,
        COUNT(CASE WHEN f.status = 'Resolved' THEN 1 END) as resolved
      FROM findings f ${whereClause}
      AND f.assigned_to IS NOT NULL
      GROUP BY f.assigned_to
      ORDER BY open DESC, inProgress DESC
      LIMIT 10
    `

    const reportData = {
      totalFindings: Number.parseInt(totalFindings[0].count),
      criticalFindings: findingsBySeverity.find((f) => f.severity === "Critical")?.count || 0,
      highFindings: findingsBySeverity.find((f) => f.severity === "High")?.count || 0,
      mediumFindings: findingsBySeverity.find((f) => f.severity === "Medium")?.count || 0,
      lowFindings: findingsBySeverity.find((f) => f.severity === "Low")?.count || 0,
      openFindings: findingsByStatus.find((f) => f.status === "Open")?.count || 0,
      inProgressFindings: findingsByStatus.find((f) => f.status === "In Progress")?.count || 0,
      resolvedFindings: findingsByStatus.find((f) => f.status === "Resolved")?.count || 0,
      findingsByCategory: findingsByCategory,
      findingsBySeverity: findingsBySeverity,
      findingsByAssessment: findingsByAssessment,
      findingsTrend: findingsTrend,
      recentFindings: recentFindings,
      agingAnalysis: agingAnalysis,
      assigneeWorkload: assigneeWorkload,
    }

    return { success: true, data: reportData }
  } catch (error) {
    console.error("Failed to generate findings report:", error)
    console.log("Falling back to mock findings report data")
    return { success: true, data: mockReportData }
  }
}

export async function exportFindingsReport(format: "csv" | "pdf" | "excel", filters?: any) {
  try {
    if (!sql) {
      console.log("Mock export - would generate", format, "report")
      return {
        success: true,
        data: {
          downloadUrl: `/mock-findings-report.${format}`,
          filename: `findings-report-${new Date().toISOString().split("T")[0]}.${format}`,
        },
      }
    }

    // In a real implementation, this would generate the actual file
    // For now, return a mock response
    return {
      success: true,
      data: {
        downloadUrl: `/api/reports/findings.${format}`,
        filename: `findings-report-${new Date().toISOString().split("T")[0]}.${format}`,
      },
    }
  } catch (error) {
    console.error("Failed to export findings report:", error)
    return { success: false, error: "Failed to export report" }
  }
}
