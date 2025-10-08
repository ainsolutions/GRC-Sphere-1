-- Add organization_id columns to all relevant tables for proper multi-tenancy
-- This script should be run after the database is set up

-- Core tables
ALTER TABLE information_assets ADD COLUMN IF NOT EXISTS organization_id INTEGER DEFAULT 1;
ALTER TABLE users ADD COLUMN IF NOT EXISTS organization_id INTEGER DEFAULT 1;
ALTER TABLE departments ADD COLUMN IF NOT EXISTS organization_id INTEGER DEFAULT 1;

-- Risk management tables
ALTER TABLE risks ADD COLUMN IF NOT EXISTS organization_id INTEGER DEFAULT 1;
ALTER TABLE iso27001_risks ADD COLUMN IF NOT EXISTS organization_id INTEGER DEFAULT 1;
ALTER TABLE nist_csf_risk_templates ADD COLUMN IF NOT EXISTS organization_id INTEGER DEFAULT 1;
ALTER TABLE fair_risks ADD COLUMN IF NOT EXISTS organization_id INTEGER DEFAULT 1;
ALTER TABLE technology_risks ADD COLUMN IF NOT EXISTS organization_id INTEGER DEFAULT 1;

-- Compliance tables
ALTER TABLE assessments ADD COLUMN IF NOT EXISTS organization_id INTEGER DEFAULT 1;
ALTER TABLE assessment_findings ADD COLUMN IF NOT EXISTS organization_id INTEGER DEFAULT 1;
ALTER TABLE nesa_uae_gap_analysis ADD COLUMN IF NOT EXISTS organization_id INTEGER DEFAULT 1;
ALTER TABLE nesa_uae_remediation_actions ADD COLUMN IF NOT EXISTS organization_id INTEGER DEFAULT 1;

-- Security tables
ALTER TABLE incidents ADD COLUMN IF NOT EXISTS organization_id INTEGER DEFAULT 1;
ALTER TABLE vulnerabilities ADD COLUMN IF NOT EXISTS organization_id INTEGER DEFAULT 1;
ALTER TABLE threats ADD COLUMN IF NOT EXISTS organization_id INTEGER DEFAULT 1;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_assets_org ON information_assets(organization_id);
CREATE INDEX IF NOT EXISTS idx_risks_org ON risks(organization_id);
CREATE INDEX IF NOT EXISTS idx_iso27001_risks_org ON iso27001_risks(organization_id);
CREATE INDEX IF NOT EXISTS idx_nist_risks_org ON nist_csf_risk_templates(organization_id);
CREATE INDEX IF NOT EXISTS idx_assessments_org ON assessments(organization_id);
CREATE INDEX IF NOT EXISTS idx_findings_org ON assessment_findings(organization_id);
CREATE INDEX IF NOT EXISTS idx_incidents_org ON incidents(organization_id);
CREATE INDEX IF NOT EXISTS idx_vulnerabilities_org ON vulnerabilities(organization_id);

-- Update existing records to have organization_id = 1 (default organization)
UPDATE information_assets SET organization_id = 1 WHERE organization_id IS NULL;
UPDATE users SET organization_id = 1 WHERE organization_id IS NULL;
UPDATE risks SET organization_id = 1 WHERE organization_id IS NULL;
UPDATE iso27001_risks SET organization_id = 1 WHERE organization_id IS NULL;
UPDATE nist_csf_risk_templates SET organization_id = 1 WHERE organization_id IS NULL;
UPDATE assessments SET organization_id = 1 WHERE organization_id IS NULL;
UPDATE assessment_findings SET organization_id = 1 WHERE organization_id IS NULL;
UPDATE incidents SET organization_id = 1 WHERE organization_id IS NULL;
UPDATE vulnerabilities SET organization_id = 1 WHERE organization_id IS NULL;
