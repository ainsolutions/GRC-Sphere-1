import { type NextRequest, NextResponse } from "next/server"
import { withContext } from "@/lib/HttpContext"
import nodemailer from "nodemailer"


export const POST = withContext(async({ tenantDb }, request) => {
  try {
    const body = await request.json()
    const { testEmail } = body

    // Get SMTP configuration from database
    const smtpConfigs = await tenantDb`
      SELECT key, value 
      FROM system_config 
      WHERE category = 'email' AND key IN ('smtp_host', 'smtp_port', 'smtp_user', 'smtp_password', 'smtp_secure', 'from_email', 'from_name')
    ` as Record<string, any>[]

    const config: Record<string, string> = {}
    smtpConfigs.forEach((item) => {
      config[item.key] = item.value
    })

    // Create transporter
    const transporter = nodemailer.createTransport({
      host: config.smtp_host,
      port: Number.parseInt(config.smtp_port || "587", 10),
      secure: config.smtp_secure === "true",
      auth: {
        user: config.smtp_user,
        pass: config.smtp_password,
      },
    })

    // Send test email
    const info = await transporter.sendMail({
      from: `"${config.from_name || "GRC System"}" <${config.from_email}>`,
      to: testEmail,
      subject: "GRC System - Email Configuration Test",
      html: `
        <h2>Email Configuration Test</h2>
        <p>This is a test email to verify your SMTP configuration is working correctly.</p>
        <p><strong>Sent at:</strong> ${new Date().toISOString()}</p>
        <p><strong>SMTP Host:</strong> ${config.smtp_host}</p>
        <p><strong>SMTP Port:</strong> ${config.smtp_port}</p>
        <hr>
        <p><em>GRC System Email Configuration Test</em></p>
      `,
    })

    return NextResponse.json({
      success: true,
      message: "Test email sent successfully",
      messageId: info.messageId,
    })
  } catch (error) {
    console.error("Email test error:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to send test email",
      },
      { status: 500 },
    )
  }
});
