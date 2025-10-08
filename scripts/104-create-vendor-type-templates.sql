-- Create vendor types table
CREATE TABLE IF NOT EXISTS vendor_types (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    color VARCHAR(7) DEFAULT '#3B82F6', -- Hex color code
    icon VARCHAR(50) DEFAULT 'Building2',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create vendor type template categories
CREATE TABLE IF NOT EXISTS vendor_type_template_categories (
    id SERIAL PRIMARY KEY,
    vendor_type_id INTEGER REFERENCES vendor_types(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    weight DECIMAL(3,2) DEFAULT 1.00, -- Weight for scoring (0.00 to 1.00)
    is_mandatory BOOLEAN DEFAULT false,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create vendor type risk templates
CREATE TABLE IF NOT EXISTS vendor_type_risk_templates (
    id SERIAL PRIMARY KEY,
    vendor_type_id INTEGER REFERENCES vendor_types(id) ON DELETE CASCADE,
    category_id INTEGER REFERENCES vendor_type_template_categories(id) ON DELETE CASCADE,
    risk_title VARCHAR(200) NOT NULL,
    risk_description TEXT,
    default_likelihood INTEGER DEFAULT 3 CHECK (default_likelihood BETWEEN 1 AND 5),
    default_impact INTEGER DEFAULT 3 CHECK (default_impact BETWEEN 1 AND 5),
    default_risk_score INTEGER DEFAULT 9,
    control_catalogue VARCHAR(50) DEFAULT 'ISO27001', -- ISO27001, SOC2, NIST, PCI_DSS, etc.
    control_reference VARCHAR(50),
    is_mandatory BOOLEAN DEFAULT false,
    weight DECIMAL(3,2) DEFAULT 1.00,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_vendor_type_templates_vendor_type ON vendor_type_risk_templates(vendor_type_id);
CREATE INDEX IF NOT EXISTS idx_vendor_type_templates_category ON vendor_type_risk_templates(category_id);
CREATE INDEX IF NOT EXISTS idx_vendor_type_categories_vendor_type ON vendor_type_template_categories(vendor_type_id);

-- Add vendor_type_id to existing third_party_risk_assessments table
ALTER TABLE third_party_risk_assessments 
ADD COLUMN IF NOT EXISTS vendor_type_id INTEGER REFERENCES vendor_types(id);

-- Create trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_vendor_types_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_vendor_types_updated_at
    BEFORE UPDATE ON vendor_types
    FOR EACH ROW
    EXECUTE FUNCTION update_vendor_types_updated_at();
