-- Create ISO 27001 risk categories table
CREATE TABLE IF NOT EXISTS iso27001_risk_categories (
    id SERIAL PRIMARY KEY,
    control_domain VARCHAR(10) NOT NULL UNIQUE,
    domain_name VARCHAR(255) NOT NULL,
    domain_description TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create ISO 27001 risk templates table
CREATE TABLE IF NOT EXISTS iso27001_risk_templates (
    id SERIAL PRIMARY KEY,
    template_id VARCHAR(50) NOT NULL UNIQUE,
    template_name VARCHAR(255) NOT NULL,
    risk_description TEXT NOT NULL,
    category_id INTEGER REFERENCES iso27001_risk_categories(id),
    threats JSONB DEFAULT '[]',
    vulnerabilities JSONB DEFAULT '[]',
    assets_affected JSONB DEFAULT '[]',
    default_likelihood INTEGER CHECK (default_likelihood BETWEEN 1 AND 5),
    default_impact INTEGER CHECK (default_impact BETWEEN 1 AND 5),
    risk_level VARCHAR(20) DEFAULT 'Medium',
    compliance_references JSONB DEFAULT '[]',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create ISO 27001 template controls table
CREATE TABLE IF NOT EXISTS iso27001_template_controls (
    id SERIAL PRIMARY KEY,
    template_id INTEGER REFERENCES iso27001_risk_templates(id) ON DELETE CASCADE,
    control_reference VARCHAR(20) NOT NULL,
    control_effectiveness INTEGER DEFAULT 3 CHECK (control_effectiveness BETWEEN 1 AND 5),
    is_mandatory BOOLEAN DEFAULT false,
    implementation_notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create ISO 27001 template scenarios table
CREATE TABLE IF NOT EXISTS iso27001_template_scenarios (
    id SERIAL PRIMARY KEY,
    template_id INTEGER REFERENCES iso27001_risk_templates(id) ON DELETE CASCADE,
    scenario_name VARCHAR(255) NOT NULL,
    scenario_description TEXT,
    threat_actor VARCHAR(255),
    attack_vector VARCHAR(255),
    likelihood INTEGER CHECK (likelihood BETWEEN 1 AND 5),
    impact INTEGER CHECK (impact BETWEEN 1 AND 5),
    risk_score INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_iso27001_templates_category ON iso27001_risk_templates(category_id);
CREATE INDEX IF NOT EXISTS idx_iso27001_templates_active ON iso27001_risk_templates(is_active);
CREATE INDEX IF NOT EXISTS idx_iso27001_template_controls_template ON iso27001_template_controls(template_id);
CREATE INDEX IF NOT EXISTS idx_iso27001_template_scenarios_template ON iso27001_template_scenarios(template_id);
