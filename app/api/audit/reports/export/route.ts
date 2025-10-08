import { NextRequest, NextResponse } from 'next/server'
import { withContext } from '@/lib/HttpContext'

// GET /api/audit/reports/export - Export report as PDF/DOCX
export const GET = withContext(async ({ tenantDb }, request: NextRequest) => {
  try {
    const { searchParams } = new URL(request.url)
    const reportId = searchParams.get('reportId')
    const format = searchParams.get('format') || 'pdf' // 'pdf' or 'docx'

    if (!reportId) {
      return NextResponse.json(
        { success: false, error: 'Report ID is required' },
        { status: 400 }
      )
    }

    // Get report data
    const reportQuery = `
      SELECT 
        r.*, ae.engagement_name, ae.engagement_type,
        au.entity_name, au.entity_type
      FROM audit_reports r
      LEFT JOIN audit_engagements ae ON r.engagement_id = ae.engagement_id
      LEFT JOIN audit_universe au ON ae.entity_id = au.entity_id
      WHERE r.report_id = $1
    `
    const reportResult = await tenantDb.query(reportQuery, [reportId])

    if (reportResult.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Report not found' },
        { status: 404 }
      )
    }

    const report = reportResult.rows[0]

    // Get findings for this report
    const findingsQuery = `
      SELECT * FROM audit_findings
      WHERE report_id = $1
      ORDER BY risk_level DESC, created_at ASC
    `
    const findingsResult = await tenantDb.query(findingsQuery, [reportId])
    const findings = findingsResult.rows

    // Generate export data
    const exportData = {
      report: report,
      findings: findings,
      metadata: {
        exportDate: new Date().toISOString(),
        format: format,
        version: '1.0'
      }
    }

    // For now, return the data structure
    // In a real implementation, you would use libraries like:
    // - jsPDF for PDF generation
    // - docx for DOCX generation
    // - puppeteer for HTML to PDF conversion

    return NextResponse.json({
      success: true,
      data: exportData,
      message: `Report exported as ${format.toUpperCase()}`,
      downloadUrl: `/api/audit/reports/download?reportId=${reportId}&format=${format}`
    })
  } catch (error) {
    console.error('Error exporting report:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to export report' },
      { status: 500 }
    )
  }
})

// POST /api/audit/reports/export - Generate and download report
export const POST = withContext(async ({ tenantDb }, request: NextRequest) => {
  try {
    const body = await request.json()
    const { reportId, format = 'pdf', templateId } = body

    if (!reportId) {
      return NextResponse.json(
        { success: false, error: 'Report ID is required' },
        { status: 400 }
      )
    }

    // Get report data
    const reportQuery = `
      SELECT 
        r.*, ae.engagement_name, ae.engagement_type,
        au.entity_name, au.entity_type
      FROM audit_reports r
      LEFT JOIN audit_engagements ae ON r.engagement_id = ae.engagement_id
      LEFT JOIN audit_universe au ON ae.entity_id = au.entity_id
      WHERE r.report_id = $1
    `
    const reportResult = await tenantDb.query(reportQuery, [reportId])

    if (reportResult.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Report not found' },
        { status: 404 }
      )
    }

    const report = reportResult.rows[0]

    // Get findings
    const findingsQuery = `
      SELECT * FROM audit_findings
      WHERE report_id = $1
      ORDER BY risk_level DESC, created_at ASC
    `
    const findingsResult = await tenantDb.query(findingsQuery, [reportId])
    const findings = findingsResult.rows

    // Get template if specified
    let template = null
    if (templateId) {
      const templateQuery = `
          SELECT * FROM report_templates
        WHERE template_id = $1 AND is_active = true
      `
      const templateResult = await tenantDb.query(templateQuery, [templateId])
      if (templateResult.rows.length > 0) {
        template = templateResult.rows[0]
      }
    }

    // Generate HTML content for the report
    const htmlContent = generateReportHTML(report, findings, template)

    // For PDF generation, you would typically:
    // 1. Use puppeteer to convert HTML to PDF
    // 2. Use jsPDF for direct PDF generation
    // 3. Use a service like wkhtmltopdf

    // For DOCX generation, you would typically:
    // 1. Use the docx library to create Word documents
    // 2. Use templates and fill in the data

    return NextResponse.json({
      success: true,
      data: {
        reportId,
        format,
        htmlContent,
        downloadUrl: `/api/audit/reports/download?reportId=${reportId}&format=${format}`
      },
      message: `Report generated successfully as ${format.toUpperCase()}`
    })
  } catch (error) {
    console.error('Error generating report:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to generate report' },
      { status: 500 }
    )
  }
})

// Helper function to generate HTML content
function generateReportHTML(report: any, findings: any[], template: any) {
  const findingsByRisk = {
    critical: findings.filter(f => f.risk_level === 'critical'),
    high: findings.filter(f => f.risk_level === 'high'),
    medium: findings.filter(f => f.risk_level === 'medium'),
    low: findings.filter(f => f.risk_level === 'low')
  }

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>${report.report_title}</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 40px; line-height: 1.6; }
        .header { text-align: center; margin-bottom: 40px; }
        .report-title { font-size: 24px; font-weight: bold; margin-bottom: 10px; }
        .report-meta { color: #666; font-size: 14px; }
        .section { margin: 30px 0; }
        .section-title { font-size: 18px; font-weight: bold; margin-bottom: 15px; border-bottom: 2px solid #333; }
        .finding { margin: 20px 0; padding: 15px; border-left: 4px solid #ddd; }
        .finding.critical { border-left-color: #dc3545; }
        .finding.high { border-left-color: #fd7e14; }
        .finding.medium { border-left-color: #ffc107; }
        .finding.low { border-left-color: #28a745; }
        .finding-title { font-weight: bold; margin-bottom: 10px; }
        .finding-description { margin-bottom: 10px; }
        .recommendation { background: #f8f9fa; padding: 10px; margin: 10px 0; }
        .table { width: 100%; border-collapse: collapse; margin: 20px 0; }
        .table th, .table td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        .table th { background-color: #f2f2f2; }
        .footer { margin-top: 40px; text-align: center; font-size: 12px; color: #666; }
      </style>
    </head>
    <body>
      <div class="header">
        <div class="report-title">${report.report_title}</div>
        <div class="report-meta">
          Engagement: ${report.engagement_name || 'N/A'}<br>
          Report Period: ${report.report_period_start ? new Date(report.report_period_start).toLocaleDateString() : 'N/A'} - ${report.report_period_end ? new Date(report.report_period_end).toLocaleDateString() : 'N/A'}<br>
          Report Date: ${report.report_date ? new Date(report.report_date).toLocaleDateString() : 'N/A'}
        </div>
      </div>

      <div class="section">
        <div class="section-title">Executive Summary</div>
        <p>${report.executive_summary || 'No executive summary provided.'}</p>
      </div>

      <div class="section">
        <div class="section-title">Scope and Objectives</div>
        <p>${report.scope_and_objectives || 'No scope and objectives provided.'}</p>
      </div>

      <div class="section">
        <div class="section-title">Methodology</div>
        <p>${report.methodology || 'No methodology provided.'}</p>
      </div>

      <div class="section">
        <div class="section-title">Key Findings</div>
        ${findings.length === 0 ? '<p>No findings identified during this audit.</p>' : ''}
        
        ${findingsByRisk.critical.length > 0 ? `
          <h3>Critical Findings</h3>
          ${findingsByRisk.critical.map(finding => `
            <div class="finding critical">
              <div class="finding-title">${finding.finding_title}</div>
              <div class="finding-description">${finding.finding_description}</div>
              <div class="recommendation">
                <strong>Recommendation:</strong> ${finding.recommendation}
              </div>
            </div>
          `).join('')}
        ` : ''}

        ${findingsByRisk.high.length > 0 ? `
          <h3>High Risk Findings</h3>
          ${findingsByRisk.high.map(finding => `
            <div class="finding high">
              <div class="finding-title">${finding.finding_title}</div>
              <div class="finding-description">${finding.finding_description}</div>
              <div class="recommendation">
                <strong>Recommendation:</strong> ${finding.recommendation}
              </div>
            </div>
          `).join('')}
        ` : ''}

        ${findingsByRisk.medium.length > 0 ? `
          <h3>Medium Risk Findings</h3>
          ${findingsByRisk.medium.map(finding => `
            <div class="finding medium">
              <div class="finding-title">${finding.finding_title}</div>
              <div class="finding-description">${finding.finding_description}</div>
              <div class="recommendation">
                <strong>Recommendation:</strong> ${finding.recommendation}
              </div>
            </div>
          `).join('')}
        ` : ''}

        ${findingsByRisk.low.length > 0 ? `
          <h3>Low Risk Findings</h3>
          ${findingsByRisk.low.map(finding => `
            <div class="finding low">
              <div class="finding-title">${finding.finding_title}</div>
              <div class="finding-description">${finding.finding_description}</div>
              <div class="recommendation">
                <strong>Recommendation:</strong> ${finding.recommendation}
              </div>
            </div>
          `).join('')}
        ` : ''}
      </div>

      <div class="section">
        <div class="section-title">Overall Conclusion</div>
        <p>${report.overall_conclusion || 'No overall conclusion provided.'}</p>
      </div>

      <div class="section">
        <div class="section-title">Management Response</div>
        <p>${report.management_response || 'No management response provided.'}</p>
      </div>

      <div class="section">
        <div class="section-title">Next Steps</div>
        <p>${report.next_steps || 'No next steps provided.'}</p>
      </div>

      <div class="footer">
        <p>Confidentiality Level: ${report.confidentiality_level || 'Internal'}</p>
        <p>Report Version: ${report.version || '1.0'}</p>
        <p>Generated on: ${new Date().toLocaleDateString()}</p>
      </div>
    </body>
    </html>
  `
}