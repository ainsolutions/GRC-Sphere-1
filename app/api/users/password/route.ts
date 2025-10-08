import { type NextRequest, NextResponse } from "next/server"
import { withContext } from "@/lib/HttpContext"
import bcrypt from "bcryptjs"


// Generate a secure random password
function generatePassword(length = 12): string {
  const lowercase = "abcdefghijklmnopqrstuvwxyz"
  const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
  const numbers = "0123456789"
  const symbols = "!@#$%^&*()_+-=[]{}|;:,.<>?"

  const allChars = lowercase + uppercase + numbers + symbols
  let password = ""

  // Ensure at least one character from each category
  password += lowercase[Math.floor(Math.random() * lowercase.length)]
  password += uppercase[Math.floor(Math.random() * uppercase.length)]
  password += numbers[Math.floor(Math.random() * numbers.length)]
  password += symbols[Math.floor(Math.random() * symbols.length)]

  // Fill the rest randomly
  for (let i = 4; i < length; i++) {
    password += allChars[Math.floor(Math.random() * allChars.length)]
  }

  // Shuffle the password
  return password
    .split("")
    .sort(() => Math.random() - 0.5)
    .join("")
}

export const GET = withContext(async({ tenantDb }, request) => {
  try {
    const { searchParams } = new URL(request.url)
    const organizationId = searchParams.get("organizationId")
    const departmentId = searchParams.get("departmentId")

    let users

    if (organizationId && departmentId) {
      users = await tenantDb`
        SELECT u.id, u.username, u.first_name, u.last_name, u.email, u.status,
               o.name as organization_name, d.name as department_name
        FROM users u
        LEFT JOIN organizations o ON u.organization_id = o.id
        LEFT JOIN departments d ON u.department_id = d.id
        WHERE u.status = 'Active'
          AND u.organization_id = ${organizationId}
          AND u.department_id = ${departmentId}
        ORDER BY u.first_name, u.last_name
      `
    } else if (organizationId) {
      users = await tenantDb`
        SELECT u.id, u.username, u.first_name, u.last_name, u.email, u.status,
               o.name as organization_name, d.name as department_name
        FROM users u
        LEFT JOIN organizations o ON u.organization_id = o.id
        LEFT JOIN departments d ON u.department_id = d.id
        WHERE u.status = 'Active'
          AND u.organization_id = ${organizationId}
        ORDER BY u.first_name, u.last_name
      `
    } else if (departmentId) {
      users = await tenantDb`
        SELECT u.id, u.username, u.first_name, u.last_name, u.email, u.status,
               o.name as organization_name, d.name as department_name
        FROM users u
        LEFT JOIN organizations o ON u.organization_id = o.id
        LEFT JOIN departments d ON u.department_id = d.id
        WHERE u.status = 'Active'
          AND u.department_id = ${departmentId}
        ORDER BY u.first_name, u.last_name
      `
    } else {
      users = await tenantDb`
        SELECT u.id, u.username, u.first_name, u.last_name, u.email, u.status,
               o.name as organization_name, d.name as department_name
        FROM users u
        LEFT JOIN organizations o ON u.organization_id = o.id
        LEFT JOIN departments d ON u.department_id = d.id
        WHERE u.status = 'Active'
        ORDER BY u.first_name, u.last_name
      `
    }

    return NextResponse.json({ success: true, data: users })
  } catch (error) {
    console.error("Failed to fetch users:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch users" }, { status: 500 })
  }
});

export const POST = withContext(async({ tenantDb }, request) => {
  try {
    const body = await request.json()
    const { userId, password, generateNew } = body

    // Validate that user exists and is active
    const user = await tenantDb`
      SELECT id, username, status FROM users WHERE id = ${userId}
    ` as Record<string, any>[]

    if (user.length === 0) {
      return NextResponse.json({ success: false, error: "User not found" }, { status: 404 })
    }

    if (user[0].status !== "Active") {
      return NextResponse.json({ success: false, error: "Cannot change password for inactive user" }, { status: 400 })
    }

    let finalPassword = password

    // Generate new password if requested
    if (generateNew) {
      finalPassword = generatePassword(12)
    }

    if (!finalPassword) {
      return NextResponse.json({ success: false, error: "Password is required" }, { status: 400 })
    }

    // Hash the password
    const saltRounds = 12
    const hashedPassword = await bcrypt.hash(finalPassword, saltRounds)

    // Update user password
    await tenantDb`
      UPDATE users 
      SET password_hash = ${hashedPassword}, updated_at = CURRENT_TIMESTAMP
      WHERE id = ${userId}
    `

    return NextResponse.json({
      success: true,
      message: "Password updated successfully",
      generatedPassword: generateNew ? finalPassword : undefined,
    })
  } catch (error) {
    console.error("Failed to update password:", error)
    return NextResponse.json({ success: false, error: "Failed to update password" }, { status: 500 })
  }
});
