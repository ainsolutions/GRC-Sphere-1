-- SBP ETRMF Requirements Table
-- Create table for SBP ETRMF controls and requirements

CREATE TABLE IF NOT EXISTS sbp_etrmf_requirements (
    id SERIAL PRIMARY KEY,
    domain VARCHAR(100) NOT NULL,
    control_id VARCHAR(50) NOT NULL UNIQUE,
    control_name VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    control_type VARCHAR(50) NOT NULL, -- Mandatory, Recommended
    maturity_level VARCHAR(20) NOT NULL, -- Basic, Intermediate, Advanced
    status VARCHAR(50) DEFAULT 'Not Implemented', -- Implemented, Partially Implemented, Not Implemented, Not Applicable
    implementation_guidance TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_sbp_etrmf_requirements_domain ON sbp_etrmf_requirements(domain);
CREATE INDEX IF NOT EXISTS idx_sbp_etrmf_requirements_control_id ON sbp_etrmf_requirements(control_id);
CREATE INDEX IF NOT EXISTS idx_sbp_etrmf_requirements_status ON sbp_etrmf_requirements(status);
CREATE INDEX IF NOT EXISTS idx_sbp_etrmf_requirements_maturity_level ON sbp_etrmf_requirements(maturity_level);


