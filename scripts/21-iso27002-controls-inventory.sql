-- Create ISO 27002 Controls Inventory

-- ISO 27002 Control Categories (Annex A domains)
CREATE TABLE IF NOT EXISTS iso27002_control_categories (
    id SERIAL PRIMARY KEY,
    category_code VARCHAR(10) NOT NULL UNIQUE,
    category_name VARCHAR(255) NOT NULL,
    category_description TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ISO 27002 Controls (Sub-controls)
CREATE TABLE IF NOT EXISTS iso27002_controls (
    id SERIAL PRIMARY KEY,
    control_code VARCHAR(20) NOT NULL UNIQUE,
    control_title VARCHAR(500) NOT NULL,
    control_description TEXT,
    control_guidance TEXT,
    category_id INTEGER REFERENCES iso27002_control_categories(id),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_iso27002_controls_category_id ON iso27002_controls(category_id);
CREATE INDEX IF NOT EXISTS idx_iso27002_controls_code ON iso27002_controls(control_code);
CREATE INDEX IF NOT EXISTS idx_iso27002_control_categories_code ON iso27002_control_categories(category_code);

-- Add comments
COMMENT ON TABLE iso27002_control_categories IS 'ISO 27002 control categories (Annex A domains)';
COMMENT ON TABLE iso27002_controls IS 'Complete ISO 27002 controls inventory with sub-controls';

-- Add trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_iso27002_control_categories_updated_at 
    BEFORE UPDATE ON iso27002_control_categories 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_iso27002_controls_updated_at 
    BEFORE UPDATE ON iso27002_controls 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
