import { NextRequest, NextResponse } from 'next/server'
import { getCRIControls, CRIControl } from '@/lib/actions/cyber-maturity-actions'
import { HttpSessionContext, withContext } from '@/lib/HttpContext'

export const GET = withContext(async (context: HttpSessionContext, request: Request) => {
  try {
    const { searchParams } = new URL(request.url)
    const format = searchParams.get('format') || 'csv'
    const domain = searchParams.get('domain')

    const result = await getCRIControls()

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: 'Failed to fetch CRI controls' },
        { status: 500 }
      )
    }

    let controls: CRIControl[] = (result.data ?? []) as CRIControl[];
    // Filter by domain if specified
    
    if (domain && domain !== 'all') {
      controls = controls.filter(control => control.domain === domain)
    }

    // Generate response based on format
    if (format === 'json') {
      return NextResponse.json(controls)
    }

    if (format === 'csv') {
      const csvData = generateCSV(controls)

      return new NextResponse(csvData, {
        status: 200,
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': `attachment; filename=cri-controls-${domain || 'all'}-${new Date().toISOString().split('T')[0]}.csv`
        }
      })
    }

    if (format === 'excel') {
      const excelData = generateExcelCSV(controls)

      return new NextResponse(excelData, {
        status: 200,
        headers: {
          'Content-Type': 'application/vnd.ms-excel',
          'Content-Disposition': `attachment; filename=cri-controls-${domain || 'all'}-${new Date().toISOString().split('T')[0]}.xls`
        }
      })
    }

    return NextResponse.json(
      { success: false, error: 'Invalid format specified' },
      { status: 400 }
    )

  } catch (error) {
    console.error('Error exporting CRI controls:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
});

function generateCSV(controls: any[]): string {
  const headers = [
    'Control ID',
    'Control Name',
    'Domain',
    'Control Objective',
    'Maturity Level 1',
    'Maturity Level 2',
    'Maturity Level 3',
    'Maturity Level 4',
    'Maturity Level 5'
  ]

  const rows = controls.map(control => [
    control.control_id,
    `"${control.control_name}"`,
    control.domain,
    `"${control.control_objective}"`,
    `"${control.maturity_level_1}"`,
    `"${control.maturity_level_2}"`,
    `"${control.maturity_level_3}"`,
    `"${control.maturity_level_4}"`,
    `"${control.maturity_level_5}"`
  ])

  return [headers, ...rows].map(row => row.join(',')).join('\n')
}

function generateExcelCSV(controls: any[]): string {
  const headers = [
    'Control ID',
    'Control Name',
    'Domain',
    'Control Objective',
    'Maturity Level 1',
    'Maturity Level 2',
    'Maturity Level 3',
    'Maturity Level 4',
    'Maturity Level 5'
  ]

  const rows = controls.map(control => [
    control.control_id,
    control.control_name,
    control.domain,
    control.control_objective,
    control.maturity_level_1,
    control.maturity_level_2,
    control.maturity_level_3,
    control.maturity_level_4,
    control.maturity_level_5
  ])

  return [headers, ...rows].map(row => row.join('\t')).join('\n')
}
