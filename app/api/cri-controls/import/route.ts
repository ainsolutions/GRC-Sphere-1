import { NextRequest, NextResponse } from 'next/server'
import { withContext, HttpSessionContext } from '@/lib/HttpContext'
import { sql } from '@/lib/database'

export const POST = withContext(async (context: HttpSessionContext, request: Request) => {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    const overwrite = formData.get('overwrite') === 'true'

    if (!file) {
      return NextResponse.json(
        { success: false, error: 'No file provided' },
        { status: 400 }
      )
    }

    // Check file type
    const allowedTypes = [
      'text/csv',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    ]

    if (!allowedTypes.includes(file.type) && !file.name.endsWith('.csv') && !file.name.endsWith('.xls') && !file.name.endsWith('.xlsx')) {
      return NextResponse.json(
        { success: false, error: 'Invalid file type. Please upload a CSV or Excel file.' },
        { status: 400 }
      )
    }

    // Read file content
    const fileContent = await file.text()

    // Parse the file content
    const parsedControls = await parseFileContent(fileContent, file.name)

    if (parsedControls.length === 0) {
      return NextResponse.json(
        { success: false, error: 'No valid CRI controls found in the file' },
        { status: 400 }
      )
    }

    // Validate parsed controls
    const validationResult = validateControls(parsedControls)
    if (!validationResult.valid) {
      return NextResponse.json(
        { success: false, error: validationResult.errors.join(', ') },
        { status: 400 }
      )
    }

    // Import controls to database
    const importResult = await importControls(parsedControls, overwrite, { tenantDb: context.tenantDb })

    return NextResponse.json({
      success: true,
      message: `Successfully imported ${importResult.imported} CRI controls`,
      data: {
        imported: importResult.imported,
        skipped: importResult.skipped,
        errors: importResult.errors
      }
    })

  } catch (error) {
    console.error('Error importing CRI controls:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error during import' },
      { status: 500 }
    )
  }
});

async function parseFileContent(content: string, filename: string): Promise<any[]> {
  const controls: any[] = []

  try {
    const lines = content.split('\n').filter(line => line.trim())

    if (lines.length < 2) {
      return controls
    }

    // Skip header row
    const dataLines = lines.slice(1)

    for (const line of dataLines) {
      if (!line.trim()) continue

      let columns: string[]

      if (filename.endsWith('.csv')) {
        // Simple CSV parsing - handle quoted values
        columns = parseCSVLine(line)
      } else {
        // Excel/TSV format
        columns = line.split('\t')
      }

      if (columns.length >= 9) {
        const control = {
          control_id: columns[0]?.trim(),
          control_name: columns[1]?.trim(),
          domain: columns[2]?.trim(),
          control_objective: columns[3]?.trim(),
          maturity_level_1: columns[4]?.trim(),
          maturity_level_2: columns[5]?.trim(),
          maturity_level_3: columns[6]?.trim(),
          maturity_level_4: columns[7]?.trim(),
          maturity_level_5: columns[8]?.trim()
        }

        // Only add if we have the essential fields
        if (control.control_id && control.control_name && control.domain) {
          controls.push(control)
        }
      }
    }
  } catch (error) {
    console.error('Error parsing file content:', error)
  }

  return controls
}

function parseCSVLine(line: string): string[] {
  const result: string[] = []
  let current = ''
  let inQuotes = false

  for (let i = 0; i < line.length; i++) {
    const char = line[i]

    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        // Escaped quote
        current += '"'
        i++ // Skip next quote
      } else {
        inQuotes = !inQuotes
      }
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim())
      current = ''
    } else {
      current += char
    }
  }

  // Add the last column
  result.push(current.trim())

  return result
}

function validateControls(controls: any[]): { valid: boolean; errors: string[] } {
  const errors: string[] = []

  if (controls.length === 0) {
    errors.push('No controls to validate')
    return { valid: false, errors }
  }

  controls.forEach((control, index) => {
    if (!control.control_id) {
      errors.push(`Row ${index + 1}: Missing control ID`)
    }
    if (!control.control_name) {
      errors.push(`Row ${index + 1}: Missing control name`)
    }
    if (!control.domain) {
      errors.push(`Row ${index + 1}: Missing domain`)
    }
    if (!control.control_objective) {
      errors.push(`Row ${index + 1}: Missing control objective`)
    }

    // Check for duplicate control IDs
    const duplicateIndex = controls.findIndex((c, i) => i !== index && c.control_id === control.control_id)
    if (duplicateIndex !== -1) {
      errors.push(`Row ${index + 1}: Duplicate control ID "${control.control_id}"`)
    }
  })

  return { valid: errors.length === 0, errors }
}

async function importControls(controls: any[], overwrite: boolean, { tenantDb }: { tenantDb: any }) {
  let imported = 0
  let skipped = 0
  const errors: string[] = []

  for (const control of controls) {
    try {
      if (overwrite) {
        // Upsert - insert or update
        await tenantDb`
          INSERT INTO cri_controls (
            control_id, control_name, domain, control_objective,
            maturity_level_1, maturity_level_2, maturity_level_3,
            maturity_level_4, maturity_level_5
          ) VALUES (
            ${control.control_id}, ${control.control_name}, ${control.domain},
            ${control.control_objective}, ${control.maturity_level_1 || ''},
            ${control.maturity_level_2 || ''}, ${control.maturity_level_3 || ''},
            ${control.maturity_level_4 || ''}, ${control.maturity_level_5 || ''}
          )
          ON CONFLICT (control_id) DO UPDATE SET
            control_name = EXCLUDED.control_name,
            domain = EXCLUDED.domain,
            control_objective = EXCLUDED.control_objective,
            maturity_level_1 = EXCLUDED.maturity_level_1,
            maturity_level_2 = EXCLUDED.maturity_level_2,
            maturity_level_3 = EXCLUDED.maturity_level_3,
            maturity_level_4 = EXCLUDED.maturity_level_4,
            maturity_level_5 = EXCLUDED.maturity_level_5
        `
      } else {
        // Insert only if not exists
        const result = await tenantDb`
          INSERT INTO cri_controls (
            control_id, control_name, domain, control_objective,
            maturity_level_1, maturity_level_2, maturity_level_3,
            maturity_level_4, maturity_level_5
          ) VALUES (
            ${control.control_id}, ${control.control_name}, ${control.domain},
            ${control.control_objective}, ${control.maturity_level_1 || ''},
            ${control.maturity_level_2 || ''}, ${control.maturity_level_3 || ''},
            ${control.maturity_level_4 || ''}, ${control.maturity_level_5 || ''}
          )
          ON CONFLICT (control_id) DO NOTHING
        `

        if (result.rowCount === 0) {
          skipped++
          continue
        }
      }

      imported++
    } catch (error) {
      console.error('Error importing control:', control.control_id, error)
      errors.push(`Failed to import control ${control.control_id}: ${error}`)
    }
  }

  return { imported, skipped, errors }
}
