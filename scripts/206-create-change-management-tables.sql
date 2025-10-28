-- Change Management (COBIT-aligned)

-- Sequence and ID generator for Change ID CHG-XXXXXXX
CREATE SEQUENCE IF NOT EXISTS change_id_seq START 1;

CREATE OR REPLACE FUNCTION generate_change_id() RETURNS VARCHAR(20) AS $$
BEGIN
  RETURN 'CHG-' || LPAD(nextval('change_id_seq')::text, 7, '0');
END;
$$ LANGUAGE plpgsql;

-- Main change requests table
CREATE TABLE IF NOT EXISTS tech_change_requests (
  id SERIAL PRIMARY KEY,
  change_id VARCHAR(20) UNIQUE NOT NULL DEFAULT generate_change_id(),
  title VARCHAR(200) NOT NULL,
  description TEXT NOT NULL,
  asset_id INTEGER REFERENCES assets(id),
  asset_type VARCHAR(100), -- denormalized for quick filter
  cia_confidentiality INTEGER, -- from assets.confidentiality_level
  cia_integrity INTEGER,       -- from assets.integrity_level
  cia_availability INTEGER,    -- from assets.availability_level
  change_type VARCHAR(20) NOT NULL CHECK (change_type IN ('standard','normal','emergency')),
  change_category VARCHAR(50) NOT NULL CHECK (change_category IN ('configuration','patch','code')),
  risk_level VARCHAR(10) CHECK (risk_level IN ('high','medium','low')),
  risk_analysis TEXT,
  impact_analysis TEXT,
  implementation_plan TEXT,
  rollback_plan TEXT,
  testing_plan TEXT,
  testing_results TEXT,
  post_implementation_review TEXT,
  document_links TEXT, -- optional links to uploaded docs or storage keys
  initiator VARCHAR(255),
  reviewer VARCHAR(255),
  approver VARCHAR(255),
  planned_start_date TIMESTAMP,
  planned_end_date TIMESTAMP,
  actual_end_date TIMESTAMP,
  -- Security Risk Analysis linkage fields
  related_incident_id INTEGER REFERENCES incidents(id),
  related_risk_id INTEGER REFERENCES iso27001_risks(id),
  related_assessment_id INTEGER REFERENCES assessments(id),
  related_assessment_findings INTEGER,
  security_remarks TEXT,
  status VARCHAR(30) DEFAULT 'draft' CHECK (status IN ('draft','submitted','approved','rejected','implemented','backed_out','cancelled')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Helpful indexes
CREATE INDEX IF NOT EXISTS idx_tech_changes_change_id ON tech_change_requests(change_id);
CREATE INDEX IF NOT EXISTS idx_tech_changes_asset_id ON tech_change_requests(asset_id);
CREATE INDEX IF NOT EXISTS idx_tech_changes_type ON tech_change_requests(change_type);
CREATE INDEX IF NOT EXISTS idx_tech_changes_category ON tech_change_requests(change_category);
CREATE INDEX IF NOT EXISTS idx_tech_changes_status ON tech_change_requests(status);
CREATE INDEX IF NOT EXISTS idx_tech_changes_planned_start ON tech_change_requests(planned_start_date);

-- Optional audit trail table for state transitions and reviews
CREATE TABLE IF NOT EXISTS tech_change_audit (
  id SERIAL PRIMARY KEY,
  change_id VARCHAR(20) NOT NULL,
  action VARCHAR(50) NOT NULL, -- created, submitted, approved, rejected, implemented, backed_out, updated
  actor VARCHAR(255) NOT NULL,
  comment TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_tech_change_audit_change_id ON tech_change_audit(change_id);


