-- Create custom assessment templates tables
CREATE TABLE IF NOT EXISTS custom_assessment_templates (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    template_type VARCHAR(50) NOT NULL DEFAULT 'third_party_risk',
    vendor_type_id INTEGER REFERENCES vendor_types(id),
    is_public BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    created_by VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    usage_count INTEGER DEFAULT 0,
    settings JSONB DEFAULT '{}',
    UNIQUE(name, template_type)
);

CREATE TABLE IF NOT EXISTS custom_assessment_template_risk_items (
    id SERIAL PRIMARY KEY,
    template_id INTEGER REFERENCES custom_assessment_templates(id) ON DELETE CASCADE,
    category_name VARCHAR(255) NOT NULL,
    category_description TEXT,
    risk_title VARCHAR(255) NOT NULL,
    risk_description TEXT NOT NULL,
    default_likelihood INTEGER DEFAULT 3 CHECK (default_likelihood BETWEEN 1 AND 5),
    default_impact INTEGER DEFAULT 3 CHECK (default_impact BETWEEN 1 AND 5),
    default_risk_score INTEGER GENERATED ALWAYS AS (default_likelihood * default_impact) STORED,
    control_catalogue VARCHAR(50) DEFAULT 'ISO27001',
    control_reference VARCHAR(100),
    is_mandatory BOOLEAN DEFAULT false,
    weight DECIMAL(3,2) DEFAULT 1.0,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_custom_templates_type ON custom_assessment_templates(template_type);
CREATE INDEX IF NOT EXISTS idx_custom_templates_vendor_type ON custom_assessment_templates(vendor_type_id);
CREATE INDEX IF NOT EXISTS idx_custom_templates_public ON custom_assessment_templates(is_public, is_active);
CREATE INDEX IF NOT EXISTS idx_template_risk_items_template ON custom_assessment_template_risk_items(template_id);
CREATE INDEX IF NOT EXISTS idx_template_risk_items_category ON custom_assessment_template_risk_items(category_name);

-- Add trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_custom_template_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_custom_assessment_templates_updated_at
    BEFORE UPDATE ON custom_assessment_templates
    FOR EACH ROW
    EXECUTE FUNCTION update_custom_template_updated_at();

CREATE TRIGGER update_custom_assessment_template_risk_items_updated_at
    BEFORE UPDATE ON custom_assessment_template_risk_items
    FOR EACH ROW
    EXECUTE FUNCTION update_custom_template_updated_at();
