-- NIST Cybersecurity Framework 2.0 Database Schema

-- NIST CSF Functions (Core Functions)
CREATE TABLE IF NOT EXISTS nist_csf_functions (
    id SERIAL PRIMARY KEY,
    function_code VARCHAR(10) NOT NULL UNIQUE,
    function_name VARCHAR(100) NOT NULL,
    function_description TEXT,
    function_purpose TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- NIST CSF Categories
CREATE TABLE IF NOT EXISTS nist_csf_categories (
    id SERIAL PRIMARY KEY,
    category_code VARCHAR(20) NOT NULL UNIQUE,
    category_name VARCHAR(200) NOT NULL,
    category_description TEXT,
    function_id INTEGER REFERENCES nist_csf_functions(id),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- NIST CSF Subcategories (These are the "subcontrols")
CREATE TABLE IF NOT EXISTS nist_csf_subcategories (
    id SERIAL PRIMARY KEY,
    subcategory_code VARCHAR(30) NOT NULL UNIQUE,
    subcategory_name VARCHAR(300) NOT NULL,
    subcategory_description TEXT,
    category_id INTEGER REFERENCES nist_csf_categories(id),
    implementation_guidance TEXT,
    informative_references TEXT[],
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- NIST CSF Implementation Tiers
CREATE TABLE IF NOT EXISTS nist_csf_implementation_tiers (
    id SERIAL PRIMARY KEY,
    tier_level INTEGER NOT NULL UNIQUE,
    tier_name VARCHAR(50) NOT NULL,
    tier_description TEXT,
    characteristics TEXT[],
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- NIST CSF Risk Templates
CREATE TABLE IF NOT EXISTS nist_csf_risk_templates (
    id SERIAL PRIMARY KEY,
    template_id VARCHAR(50) NOT NULL UNIQUE,
    template_name VARCHAR(200) NOT NULL,
    risk_description TEXT,
    function_id INTEGER REFERENCES nist_csf_functions(id),
    category_id INTEGER REFERENCES nist_csf_categories(id),
    threat_sources TEXT[],
    vulnerabilities TEXT[],
    asset_types TEXT[],
    default_likelihood INTEGER CHECK (default_likelihood BETWEEN 1 AND 5),
    default_impact INTEGER CHECK (default_impact BETWEEN 1 AND 5),
    risk_level VARCHAR(20),
    nist_references TEXT[],
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- NIST CSF Template Controls (Links templates to subcategories)
CREATE TABLE IF NOT EXISTS nist_csf_template_controls (
    id SERIAL PRIMARY KEY,
    template_id INTEGER REFERENCES nist_csf_risk_templates(id),
    subcategory_id INTEGER REFERENCES nist_csf_subcategories(id),
    implementation_tier INTEGER DEFAULT 1,
    current_maturity INTEGER DEFAULT 1,
    target_maturity INTEGER DEFAULT 2,
    is_priority BOOLEAN DEFAULT false,
    implementation_notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- NIST CSF Risk Scenarios
CREATE TABLE IF NOT EXISTS nist_csf_risk_scenarios (
    id SERIAL PRIMARY KEY,
    template_id INTEGER REFERENCES nist_csf_risk_templates(id),
    scenario_name VARCHAR(200) NOT NULL,
    scenario_description TEXT,
    threat_actor VARCHAR(100),
    attack_vector VARCHAR(100),
    affected_functions TEXT[],
    likelihood INTEGER CHECK (likelihood BETWEEN 1 AND 5),
    impact INTEGER CHECK (impact BETWEEN 1 AND 5),
    risk_score INTEGER,
    mitigation_strategies TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- NIST CSF Organizational Profiles
CREATE TABLE IF NOT EXISTS nist_csf_organizational_profiles (
    id SERIAL PRIMARY KEY,
    profile_name VARCHAR(200) NOT NULL,
    profile_description TEXT,
    organization_type VARCHAR(100),
    industry_sector VARCHAR(100),
    profile_type VARCHAR(20) DEFAULT 'Current', -- Current or Target
    subcategory_implementations JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_nist_categories_function ON nist_csf_categories(function_id);
CREATE INDEX IF NOT EXISTS idx_nist_subcategories_category ON nist_csf_subcategories(category_id);
CREATE INDEX IF NOT EXISTS idx_nist_templates_function ON nist_csf_risk_templates(function_id);
CREATE INDEX IF NOT EXISTS idx_nist_templates_category ON nist_csf_risk_templates(category_id);
CREATE INDEX IF NOT EXISTS idx_nist_template_controls_template ON nist_csf_template_controls(template_id);
CREATE INDEX IF NOT EXISTS idx_nist_template_controls_subcategory ON nist_csf_template_controls(subcategory_id);
