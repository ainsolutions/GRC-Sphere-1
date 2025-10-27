-- SBP ETRMF Gap Analysis Table
-- Create table for SBP ETRMF compliance gap analysis

CREATE TABLE IF NOT EXISTS sbp_etrmf_gap_analysis (
    id SERIAL PRIMARY KEY,
    domain VARCHAR(100) NOT NULL,
    control_id VARCHAR(50) NOT NULL,
    control_name VARCHAR(200) NOT NULL,
    current_status VARCHAR(50) NOT NULL, -- Not Implemented, Partially Implemented, Implemented
    target_status VARCHAR(50) NOT NULL, -- Implemented, Advanced Implementation
    gap_severity VARCHAR(20) NOT NULL, -- Critical, High, Medium, Low
    business_impact VARCHAR(20) NOT NULL, -- Critical, High, Medium, Low
    implementation_effort VARCHAR(20) NOT NULL, -- Low, Medium, High, Very High
    estimated_cost DECIMAL(12,2) DEFAULT 0,
    timeline_months INTEGER DEFAULT 6,
    responsible_party VARCHAR(200),
    dependencies TEXT,
    risk_if_not_addressed TEXT,
    priority_score INTEGER DEFAULT 5,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_sbp_etrmf_gap_domain ON sbp_etrmf_gap_analysis(domain);
CREATE INDEX IF NOT EXISTS idx_sbp_etrmf_gap_severity ON sbp_etrmf_gap_analysis(gap_severity);
CREATE INDEX IF NOT EXISTS idx_sbp_etrmf_gap_priority ON sbp_etrmf_gap_analysis(priority_score);
CREATE INDEX IF NOT EXISTS idx_sbp_etrmf_gap_status ON sbp_etrmf_gap_analysis(current_status);
CREATE INDEX IF NOT EXISTS idx_sbp_etrmf_gap_impact ON sbp_etrmf_gap_analysis(business_impact);


