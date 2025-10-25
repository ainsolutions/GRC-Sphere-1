import { getDatabase } from "@/lib/database";

const sql = getDatabase();

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

async function seedIncidents(count: number) {
  if (!sql) {
    console.error("Database is not configured. Please set DATABASE_URL.");
    process.exit(1);
  }

  try {
    // Determine next numeric id for incident_id suffix
    const idRow = (await sql`
      SELECT COALESCE(MAX(CAST(SUBSTRING(incident_id FROM 'INC-(.*)') AS INTEGER)), 0) + 1 as next_id
      FROM incidents 
      WHERE incident_id ~ '^INC-[0-9]+$'
    `) as Record<string, number>[];
    let nextId = idRow[0]?.next_id || 1;

    const now = new Date();
    const rows = [] as any[];

    for (let i = 0; i < count; i++) {
      const incident_id = `INC-${String(nextId++).padStart(4, "0")}`;
      const reported = randomDate(new Date(now.getFullYear(), 0, 1), now);
      const detected = Math.random() > 0.2 ? randomDate(new Date(now.getFullYear(), 0, 1), now) : null;

      rows.push({
        incident_id,
        incident_title: `Seeded ${randomFrom(INCIDENT_TYPES)} #${incident_id}`,
        incident_description: "Synthetic seeded incident for testing dashboards and flows.",
        incident_type: randomFrom(INCIDENT_TYPES),
        severity: randomFrom(SEVERITIES),
        status: randomFrom(STATUSES),
        reported_by: `user${Math.floor(Math.random() * 50) + 1}@company.com`,
        assigned_to: Math.random() > 0.4 ? `analyst${Math.floor(Math.random() * 20) + 1}@company.com` : "Unassigned",
        reported_date: reported,
        detected_date: detected,
        related_asset_id: null,
        related_risk_id: null,
      });
    }

    await sql`INSERT INTO incidents ${sql(rows)}`;
    console.log(`✅ Inserted ${rows.length} incidents`);
  } catch (err) {
    console.error("❌ Failed to seed incidents:", err);
    process.exit(1);
  }
}

async function main() {
  const arg = process.argv.find((a) => a.startsWith("--count="));
  const count = arg ? parseInt(arg.split("=")[1], 10) : 25;
  const safeCount = Number.isFinite(count) ? Math.max(1, Math.min(200, count)) : 25;
  await seedIncidents(safeCount);
}

main();

