import { NextResponse } from "next/server";
import { withContext } from "@/lib/HttpContext";

const INCIDENT_TYPES = [
  "Security Breach",
  "System Failure",
  "Phishing",
  "Malware",
  "Data Loss",
  "Performance",
  "Network",
  "Application Error",
  "Hardware Failure",
  "Unauthorized Access",
];

const SEVERITIES = ["Critical", "High", "Medium", "Low"] as const;
const STATUSES = ["Open", "In Progress", "Resolved", "Closed"] as const;

function randomFrom<T>(arr: readonly T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomDate(start: Date, end: Date) {
  const ts = start.getTime() + Math.random() * (end.getTime() - start.getTime());
  return new Date(ts).toISOString();
}

export const POST = withContext(async ({ tenantDb }, request) => {
  try {
    const body = await request.json().catch(() => ({}));
    const count = Math.max(1, Math.min(200, Number(body.count) || 25));

    // Get next numeric sequence for incident_id suffix
    const idRow = (await tenantDb`
      SELECT COALESCE(MAX(CAST(SUBSTRING(incident_id FROM 'INC-(.*)') AS INTEGER)), 0) + 1 as next_id
      FROM incidents 
      WHERE incident_id ~ '^INC-[0-9]+$'
    `) as Record<string, number>[];
    let nextId = idRow[0]?.next_id || 1;

    const rowsToInsert = [] as any[];
    for (let i = 0; i < count; i++) {
      const incident_id = `INC-${String(nextId++).padStart(4, "0")}`;
      const now = new Date();
      const reported = randomDate(new Date(now.getFullYear(), 0, 1), now);
      const detected = Math.random() > 0.2 ? randomDate(new Date(now.getFullYear(), 0, 1), now) : null;
      const status = randomFrom(STATUSES);

      rowsToInsert.push({
        incident_id,
        incident_title: `Seeded ${randomFrom(INCIDENT_TYPES)} #${incident_id}`,
        incident_description: "Synthetic seeded incident for testing dashboards and flows.",
        incident_type: randomFrom(INCIDENT_TYPES),
        severity: randomFrom(SEVERITIES),
        status,
        reported_by: `user${Math.floor(Math.random() * 50) + 1}@company.com`,
        assigned_to: Math.random() > 0.4 ? `analyst${Math.floor(Math.random() * 20) + 1}@company.com` : "Unassigned",
        reported_date: reported,
        detected_date: detected,
        related_asset_id: null,
        related_risk_id: null,
      });
    }

    // Bulk insert
    await tenantDb`INSERT INTO incidents ${tenantDb(rowsToInsert)}`;

    return NextResponse.json({ success: true, inserted: rowsToInsert.length });
  } catch (error: any) {
    console.error("Error seeding incidents:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
});

