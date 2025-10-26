-- Business Impact Analysis table for assets (tenant schema)

CREATE TABLE IF NOT EXISTS asset_bia (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  asset_id integer NOT NULL,
  department text,
  owner text,
  custodian text,
  -- BIA dimensions
  impact_financial text,        -- None/Low/Medium/High/Critical
  impact_operational text,
  impact_reputational text,
  impact_compliance text,
  max_tolerable_downtime_hours integer,
  rto_hours integer,
  rpo_hours integer,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(asset_id)
);

CREATE INDEX IF NOT EXISTS idx_asset_bia_asset_id ON asset_bia(asset_id);


