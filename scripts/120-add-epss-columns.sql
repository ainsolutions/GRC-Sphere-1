-- Add EPSS (Exploit Prediction Scoring System) columns to vulnerabilities table
SET search_path TO org_mashreqbank;

ALTER TABLE vulnerabilities 
ADD COLUMN IF NOT EXISTS epss_score DECIMAL(5,4),
ADD COLUMN IF NOT EXISTS epss_percentile DECIMAL(5,4),
ADD COLUMN IF NOT EXISTS epss_last_updated TIMESTAMP,
ADD COLUMN IF NOT EXISTS epss_model_version VARCHAR(20);

-- Create index for EPSS score for better query performance
CREATE INDEX IF NOT EXISTS idx_vulnerabilities_epss_score ON vulnerabilities(epss_score);
CREATE INDEX IF NOT EXISTS idx_vulnerabilities_epss_percentile ON vulnerabilities(epss_percentile);

-- Add comment to document EPSS columns
COMMENT ON COLUMN vulnerabilities.epss_score IS 'EPSS probability score (0.0 to 1.0) indicating likelihood of exploitation within 30 days';
COMMENT ON COLUMN vulnerabilities.epss_percentile IS 'EPSS percentile (0.0 to 1.0) indicating relative ranking compared to all CVEs';
COMMENT ON COLUMN vulnerabilities.epss_last_updated IS 'Timestamp when EPSS data was last fetched from FIRST.org API';
COMMENT ON COLUMN vulnerabilities.epss_model_version IS 'Version of the EPSS model used for scoring';
