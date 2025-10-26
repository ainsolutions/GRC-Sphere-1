-- Add EPSS (Exploit Prediction Scoring System) fields to vulnerabilities table
-- These fields store AI-calculated EPSS scores and metadata

DO $$
BEGIN
    -- Add epss_score column (0-1 scale)
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'vulnerabilities' 
        AND column_name = 'epss_score'
    ) THEN
        ALTER TABLE vulnerabilities ADD COLUMN epss_score DECIMAL(5,4);
        CREATE INDEX IF NOT EXISTS idx_vulnerabilities_epss_score ON vulnerabilities(epss_score);
        RAISE NOTICE 'epss_score column added to vulnerabilities table';
    ELSE
        RAISE NOTICE 'epss_score column already exists';
    END IF;

    -- Add epss_percentile column (0-100 scale)
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'vulnerabilities' 
        AND column_name = 'epss_percentile'
    ) THEN
        ALTER TABLE vulnerabilities ADD COLUMN epss_percentile DECIMAL(5,2);
        CREATE INDEX IF NOT EXISTS idx_vulnerabilities_epss_percentile ON vulnerabilities(epss_percentile);
        RAISE NOTICE 'epss_percentile column added to vulnerabilities table';
    ELSE
        RAISE NOTICE 'epss_percentile column already exists';
    END IF;

    -- Add epss_last_updated timestamp
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'vulnerabilities' 
        AND column_name = 'epss_last_updated'
    ) THEN
        ALTER TABLE vulnerabilities ADD COLUMN epss_last_updated TIMESTAMP;
        CREATE INDEX IF NOT EXISTS idx_vulnerabilities_epss_updated ON vulnerabilities(epss_last_updated);
        RAISE NOTICE 'epss_last_updated column added to vulnerabilities table';
    ELSE
        RAISE NOTICE 'epss_last_updated column already exists';
    END IF;

    -- Add epss_calculation_metadata (JSONB for storing calculation details)
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'vulnerabilities' 
        AND column_name = 'epss_calculation_metadata'
    ) THEN
        ALTER TABLE vulnerabilities ADD COLUMN epss_calculation_metadata JSONB;
        CREATE INDEX IF NOT EXISTS idx_vulnerabilities_epss_metadata ON vulnerabilities USING gin(epss_calculation_metadata);
        RAISE NOTICE 'epss_calculation_metadata column added to vulnerabilities table';
    ELSE
        RAISE NOTICE 'epss_calculation_metadata column already exists';
    END IF;

END $$;

-- Add constraints
DO $$
BEGIN
    -- Ensure EPSS score is between 0 and 1
    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.check_constraints
        WHERE constraint_name = 'chk_epss_score_range'
    ) THEN
        ALTER TABLE vulnerabilities 
        ADD CONSTRAINT chk_epss_score_range 
        CHECK (epss_score IS NULL OR (epss_score >= 0 AND epss_score <= 1));
        RAISE NOTICE 'EPSS score range constraint added';
    END IF;

    -- Ensure EPSS percentile is between 0 and 100
    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.check_constraints
        WHERE constraint_name = 'chk_epss_percentile_range'
    ) THEN
        ALTER TABLE vulnerabilities 
        ADD CONSTRAINT chk_epss_percentile_range 
        CHECK (epss_percentile IS NULL OR (epss_percentile >= 0 AND epss_percentile <= 100));
        RAISE NOTICE 'EPSS percentile range constraint added';
    END IF;
END $$;

-- Add helpful comments
COMMENT ON COLUMN vulnerabilities.epss_score IS 'AI-calculated Exploit Prediction Scoring System (EPSS) score (0-1 scale)';
COMMENT ON COLUMN vulnerabilities.epss_percentile IS 'EPSS score as percentile (0-100 scale)';
COMMENT ON COLUMN vulnerabilities.epss_last_updated IS 'Timestamp of last EPSS score calculation';
COMMENT ON COLUMN vulnerabilities.epss_calculation_metadata IS 'Metadata about EPSS calculation including risk factors and weights';

-- Create a view for vulnerabilities with high EPSS scores
CREATE OR REPLACE VIEW high_epss_vulnerabilities AS
SELECT 
    v.id,
    v.name,
    v.cve_id,
    v.severity,
    v.cvss_score,
    v.epss_score,
    v.epss_percentile,
    v.epss_last_updated,
    v.assets,
    v.remediation_status,
    v.created_at,
    v.updated_at,
    CASE 
        WHEN v.epss_score >= 0.8 THEN 'Critical'
        WHEN v.epss_score >= 0.6 THEN 'High'
        WHEN v.epss_score >= 0.4 THEN 'Medium'
        WHEN v.epss_score >= 0.2 THEN 'Low'
        ELSE 'Very Low'
    END as epss_risk_level
FROM vulnerabilities v
WHERE v.epss_score IS NOT NULL
  AND v.remediation_status IN ('Open', 'In Progress')
ORDER BY v.epss_score DESC, v.cvss_score DESC;

COMMENT ON VIEW high_epss_vulnerabilities IS 'View of vulnerabilities with calculated EPSS scores, showing highest risk first';


