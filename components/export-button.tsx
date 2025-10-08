// components/export-button.tsx
"use client"

export default function ExportButton() {
  return (
    <a href="/api/iso27001-risks/export?format=csv">
      Export
    </a>
  )
}
