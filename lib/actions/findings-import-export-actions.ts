"use server"

import { getDatabase } from "@/lib/database"

const sql = getDatabase()

// Helper function to format array data for CSV
const formatArrayForCSV = (arr: any[]): string => {
  if (!arr || arr.length === 0) return ""
  return arr.join(";")
}

// Helper function to parse CSV array data
const parseCSVArray = (str: string): string[] => {
  if (!str || str.trim() === "") return []
  return str
    .split(";")
    .map((item) => item.trim())
    .filter((item) => item !== "")
}

// Helper function to validate severity
const isValidSeverity = (severity: string): boolean => {
  const validSeverities = ["Critical", "High", "Medium", "Low", "Informational"]
  return validSeverities.includes(severity)
}

// Helper function to validate status
const isValidStatus = (status: string): boolean => {
  const validStatuses = ["Open", "In Progress", "Resolved", "Closed", "Accepted Risk"]
  return validStatuses.includes(status)
}

// Helper function to generate finding ID
const generateFindingId = async (): Promise<string> => {
  const result = await sql`
    SELECT finding_id FROM assessment_findings 
    ORDER BY id DESC LIMIT 1
  `

  let nextNumber = 1
  if (result.length > 0) {
    const lastId = result[0].finding_id
    const match = lastId.match(/FND-(\d+)/)
    if (match) {
      nextNumber = Number.parseInt(match[1]) + 1
    }
  }

  return `FND-${nextNumber.toString().padStart(4, "0")}`
}

export async function importFindingsFromCSV(data: any[]) {
  try {
    let imported = 0
    const errors: string[] = []

    for (let i = 0; i < data.length; i++) {
      const row = data[i]

      try {
        // Validate required fields
        if (!row.finding_title || !row.finding_description || !row.severity) {
          errors.push(`Row ${i + 2}: Missing required fields (finding_title, finding_description, severity)`)
          continue
        }

        // Validate severity
        if (!isValidSeverity(row.severity)) {
          errors.push(
            `Row ${i + 2}: Invalid severity '${row.severity}'. Must be one of: Critical, High, Medium, Low, Informational`,
          )
          continue
        }

        // Validate status if provided
        if (row.status && !isValidStatus(row.status)) {
          errors.push(
            `Row ${i + 2}: Invalid status '${row.status}'. Must be one of: Open, In Progress, Resolved, Closed, Accepted Risk`,
          )
          continue
        }

        // Check if assessment exists (if assessment_id provided)
        let assessmentId = null
        if (row.assessment_id) {
          const assessment = await sql`
            SELECT id FROM assessments WHERE id = ${row.assessment_id}
          `
          if (assessment.length === 0) {
            errors.push(`Row ${i + 2}: Assessment with ID ${row.assessment_id} not found`)
            continue
          }
          assessmentId = row.assessment_id
        } else {
          // Try to find assessment by name if provided
          if (row.assessment_name) {
            const assessment = await sql`
              SELECT id FROM assessments WHERE assessment_name = ${row.assessment_name}
            `
            if (assessment.length > 0) {
              assessmentId = assessment[0].id
            }
          }
        }

        if (!assessmentId) {
          errors.push(`Row ${i + 2}: No valid assessment found. Provide assessment_id or assessment_name`)
          continue
        }

        // Generate finding ID
        const findingId = await generateFindingId()

        // Insert finding
        await sql`
          INSERT INTO assessment_findings (
            finding_id, assessment_id, finding_title, finding_description, severity,
            category, recommendation, status, assigned_to, due_date,
            completed_date, created_at, updated_at
          )
          VALUES (
            ${findingId},
            ${assessmentId},
            ${row.finding_title},
            ${row.finding_description},
            ${row.severity},
            ${row.category || null},
            ${row.recommendation || null},
            ${row.status || "Open"},
            ${row.assigned_to || null},
            ${row.due_date || null},
            ${row.completed_date || null},
            NOW(),
            NOW()
          )
        `

        imported++
      } catch (error) {
        console.error(`Error importing row ${i + 2}:`, error)
        errors.push(`Row ${i + 2}: ${error.message}`)
      }
    }

    return {
      success: true,
      imported,
      errors,
    }
  } catch (error) {
    console.error("Failed to import findings:", error)
    return {
      success: false,
      error: `Failed to import findings: ${error.message}`,
      imported: 0,
      errors: [],
    }
  }
}

export async function exportFindingsToCSV(filters?: {
  searchTerm?: string
  statusFilter?: string
  severityFilter?: string
  assessmentFilter?: string
  timelineFilter?: string
}) {
  try {
    let query = `
      SELECT 
        af.finding_id,
        af.finding_title,
        af.finding_description,
        af.severity,
        af.category,
        af.recommendation,
        af.status,
        af.assigned_to,
        af.due_date,
        af.completed_date,
        af.created_at,
        af.updated_at,
        a.assessment_name,
        a.assessment_code,
        u.username,
        d.department_name,
        o.organization_name
      FROM assessment_findings af
      LEFT JOIN assessments a ON af.assessment_id = a.id
      LEFT JOIN users u ON af.user_id = u.id
      LEFT JOIN departments d ON af.department_id = d.id
      LEFT JOIN organizations o ON af.organization_id = o.id
      WHERE 1=1
    `

    const params: any[] = []
    let paramIndex = 1

    // Apply filters
    if (filters?.searchTerm) {
      query += ` AND (af.finding_title ILIKE $${paramIndex} OR af.finding_description ILIKE $${paramIndex} OR a.assessment_name ILIKE $${paramIndex})`
      params.push(`%${filters.searchTerm}%`)
      paramIndex++
    }

    if (filters?.statusFilter && filters.statusFilter !== "all") {
      query += ` AND af.status = $${paramIndex}`
      params.push(filters.statusFilter)
      paramIndex++
    }

    if (filters?.severityFilter && filters.severityFilter !== "all") {
      query += ` AND af.severity = $${paramIndex}`
      params.push(filters.severityFilter)
      paramIndex++
    }

    if (filters?.assessmentFilter && filters.assessmentFilter !== "all") {
      query += ` AND af.assessment_id = $${paramIndex}`
      params.push(Number.parseInt(filters.assessmentFilter))
      paramIndex++
    }

    query += ` ORDER BY af.created_at DESC`

    const findings = await sql(query, params)

    // Generate CSV content
    const headers = [
      "Finding ID",
      "Finding Title",
      "Finding Description",
      "Severity",
      "Category",
      "Recommendation",
      "Status",
      "Assigned To",
      "Due Date",
      "Completed Date",
      "Assessment Name",
      "Assessment Code",
      "Username",
      "Department",
      "Organization",
      "Created At",
      "Updated At",
    ]

    let csvContent = headers.join(",") + "\n"

    findings.forEach((finding: any) => {
      const row = [
        `"${finding.finding_id || ""}"`,
        `"${(finding.finding_title || "").replace(/"/g, '""')}"`,
        `"${(finding.finding_description || "").replace(/"/g, '""')}"`,
        `"${finding.severity || ""}"`,
        `"${finding.category || ""}"`,
        `"${(finding.recommendation || "").replace(/"/g, '""')}"`,
        `"${finding.status || ""}"`,
        `"${finding.assigned_to || ""}"`,
        `"${finding.due_date ? new Date(finding.due_date).toISOString().split("T")[0] : ""}"`,
        `"${finding.completed_date ? new Date(finding.completed_date).toISOString().split("T")[0] : ""}"`,
        `"${finding.assessment_name || ""}"`,
        `"${finding.assessment_code || ""}"`,
        `"${finding.username || ""}"`,
        `"${finding.department_name || ""}"`,
        `"${finding.organization_name || ""}"`,
        `"${finding.created_at ? new Date(finding.created_at).toISOString() : ""}"`,
        `"${finding.updated_at ? new Date(finding.updated_at).toISOString() : ""}"`,
      ]
      csvContent += row.join(",") + "\n"
    })

    const timestamp = new Date().toISOString().split("T")[0]
    const filename = `findings-export-${timestamp}.csv`

    return {
      success: true,
      data: csvContent,
      filename,
      count: findings.length,
    }
  } catch (error) {
    console.error("Export error:", error)
    return {
      success: false,
      error: "Failed to export findings",
    }
  }
}

export async function exportFindingsToPDF(filters: any) {
  try {
    let query = `
      SELECT 
        af.finding_id,
        af.finding_title,
        af.finding_description,
        af.severity,
        af.category,
        af.recommendation,
        af.status,
        af.assigned_to,
        af.due_date,
        af.completed_date,
        af.created_at,
        a.assessment_name,
        a.assessment_code
      FROM assessment_findings af
      LEFT JOIN assessments a ON af.assessment_id = a.id
      WHERE 1=1
    `

    const params: any[] = []
    let paramIndex = 1

    // Apply filters (same as CSV export)
    if (filters.searchTerm) {
      query += ` AND (af.finding_title ILIKE $${paramIndex} OR af.finding_description ILIKE $${paramIndex} OR a.assessment_name ILIKE $${paramIndex})`
      params.push(`%${filters.searchTerm}%`)
      paramIndex++
    }

    if (filters.statusFilter && filters.statusFilter !== "all") {
      query += ` AND af.status = $${paramIndex}`
      params.push(filters.statusFilter)
      paramIndex++
    }

    if (filters.severityFilter && filters.severityFilter !== "all") {
      query += ` AND af.severity = $${paramIndex}`
      params.push(filters.severityFilter)
      paramIndex++
    }

    if (filters.assessmentFilter && filters.assessmentFilter !== "all") {
      query += ` AND af.assessment_id = $${paramIndex}`
      params.push(Number.parseInt(filters.assessmentFilter))
      paramIndex++
    }

    query += ` ORDER BY af.created_at DESC`

    const findings = await sql(query, params)

    // Generate HTML report
    const timestamp = new Date().toLocaleString()
    const reportDate = new Date().toISOString().split("T")[0]

    let htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Findings Report - ${reportDate}</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          .header { text-align: center; margin-bottom: 30px; }
          .summary { background: #f5f5f5; padding: 15px; margin-bottom: 20px; border-radius: 5px; }
          .finding { border: 1px solid #ddd; margin-bottom: 15px; padding: 15px; border-radius: 5px; }
          .finding-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; }
          .severity-critical { background: #fee2e2; border-left: 4px solid #dc2626; }
          .severity-high { background: #fef3c7; border-left: 4px solid #f59e0b; }
          .severity-medium { background: #fef3c7; border-left: 4px solid #eab308; }
          .severity-low { background: #dcfce7; border-left: 4px solid #16a34a; }
          .severity-informational { background: #e0e7ff; border-left: 4px solid #6366f1; }
          .status-open { background: #fee2e2; color: #dc2626; }
          .status-in-progress { background: #fef3c7; color: #f59e0b; }
          .status-resolved { background: #dcfce7; color: #16a34a; }
          .status-closed { background: #f3f4f6; color: #6b7280; }
          .status-accepted-risk { background: #e0e7ff; color: #6366f1; }
          @media print { body { margin: 0; } }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>Assessment Findings Report</h1>
          <p>Generated on: ${timestamp}</p>
        </div>
        
        <div class="summary">
          <h2>Summary</h2>
          <p><strong>Total Findings:</strong> ${findings.length}</p>
          <p><strong>Critical:</strong> ${findings.filter((f: any) => f.severity === "Critical").length}</p>
          <p><strong>High:</strong> ${findings.filter((f: any) => f.severity === "High").length}</p>
          <p><strong>Medium:</strong> ${findings.filter((f: any) => f.severity === "Medium").length}</p>
          <p><strong>Low:</strong> ${findings.filter((f: any) => f.severity === "Low").length}</p>
          <p><strong>Open:</strong> ${findings.filter((f: any) => f.status === "Open").length}</p>
          <p><strong>In Progress:</strong> ${findings.filter((f: any) => f.status === "In Progress").length}</p>
          <p><strong>Resolved:</strong> ${findings.filter((f: any) => f.status === "Resolved").length}</p>
        </div>
    `

    findings.forEach((finding: any) => {
      const severityClass = `severity-${finding.severity?.toLowerCase() || "informational"}`
      const statusClass = `status-${finding.status?.toLowerCase().replace(" ", "-") || "open"}`

      htmlContent += `
        <div class="finding ${severityClass}">
          <div class="finding-header">
            <h3>${finding.finding_id} - ${finding.finding_title}</h3>
            <div>
              <span class="badge">${finding.severity}</span>
              <span class="badge ${statusClass}">${finding.status}</span>
            </div>
          </div>
          <p><strong>Assessment:</strong> ${finding.assessment_name || "N/A"}</p>
          <p><strong>Category:</strong> ${finding.category || "N/A"}</p>
          <p><strong>Description:</strong> ${finding.finding_description}</p>
          <p><strong>Recommendation:</strong> ${finding.recommendation || "N/A"}</p>
          <p><strong>Assigned To:</strong> ${finding.assigned_to || "Unassigned"}</p>
          <p><strong>Due Date:</strong> ${finding.due_date ? new Date(finding.due_date).toLocaleDateString() : "Not set"}</p>
          <p><strong>Created:</strong> ${new Date(finding.created_at).toLocaleDateString()}</p>
        </div>
      `
    })

    htmlContent += `
      </body>
      </html>
    `

    const filename = `findings-report-${reportDate}.html`

    return {
      success: true,
      data: htmlContent,
      filename,
      count: findings.length,
    }
  } catch (error) {
    console.error("PDF export error:", error)
    return {
      success: false,
      error: "Failed to generate PDF report",
    }
  }
}

export async function downloadFindingsTemplate() {
  try {
    const headers = [
      "finding_title",
      "finding_description",
      "severity",
      "category",
      "recommendation",
      "status",
      "assigned_to",
      "due_date",
      "assessment_name",
      "assessment_id",
    ]

    let csvContent = headers.join(",") + "\n"

    // Add sample data
    const sampleData = [
      [
        "Weak Password Policy",
        "The current password policy does not meet security standards",
        "High",
        "Access Control",
        "Implement stronger password requirements including minimum length, complexity, and rotation",
        "Open",
        "john.doe@company.com",
        "2024-03-15",
        "Security Assessment 2024",
        "",
      ],
      [
        "Unencrypted Data Transmission",
        "Sensitive data is transmitted without encryption",
        "Critical",
        "Data Protection",
        "Implement TLS encryption for all data transmission",
        "In Progress",
        "jane.smith@company.com",
        "2024-02-28",
        "Network Security Review",
        "",
      ],
      [
        "Missing Security Headers",
        "Web application lacks important security headers",
        "Medium",
        "Web Security",
        "Configure security headers including CSP, HSTS, and X-Frame-Options",
        "Open",
        "security.team@company.com",
        "2024-04-01",
        "Web Application Assessment",
        "",
      ],
    ]

    sampleData.forEach((row) => {
      const csvRow = row.map((field) => `"${field}"`).join(",")
      csvContent += csvRow + "\n"
    })

    const filename = "findings-import-template.csv"

    return {
      success: true,
      data: csvContent,
      filename,
    }
  } catch (error) {
    console.error("Template generation error:", error)
    return {
      success: false,
      error: "Failed to generate template",
    }
  }
}
