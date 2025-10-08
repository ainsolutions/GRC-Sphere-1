-- This script ensures the ISO 27002 tables exist and have the correct structure
-- It's safe to run multiple times

-- Ensure the tables exist with correct structure
DO $$
BEGIN
    -- Check if iso27002_control_categories table exists, if not create it
    IF NOT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'iso27002_control_categories') THEN
        CREATE TABLE iso27002_control_categories (
            id SERIAL PRIMARY KEY,
            category_code VARCHAR(10) NOT NULL UNIQUE,
            category_name VARCHAR(255) NOT NULL,
            category_description TEXT,
            is_active BOOLEAN DEFAULT true,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    END IF;

    -- Check if iso27002_controls table exists, if not create it
    IF NOT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'iso27002_controls') THEN
        CREATE TABLE iso27002_controls (
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
    END IF;
END
$$;

-- Insert sample data if tables are empty
INSERT INTO iso27002_control_categories (category_code, category_name, category_description) 
SELECT * FROM (VALUES
    ('A.5', 'Information Security Policies', 'Management direction and support for information security'),
    ('A.6', 'Organization of Information Security', 'Management framework for information security'),
    ('A.7', 'Human Resource Security', 'Ensuring employees understand their responsibilities'),
    ('A.8', 'Asset Management', 'Identifying and protecting organizational assets'),
    ('A.9', 'Access Control', 'Limiting access to information and facilities'),
    ('A.10', 'Cryptography', 'Proper use of cryptography for information protection')
) AS v(category_code, category_name, category_description)
WHERE NOT EXISTS (SELECT 1 FROM iso27002_control_categories WHERE category_code = v.category_code);

-- Insert sample controls
INSERT INTO iso27002_controls (control_code, control_title, control_description, category_id)
SELECT * FROM (VALUES
    ('A.5.1.1', 'Policies for information security', 'A set of policies for information security shall be defined, approved by management, published and communicated to employees and relevant external parties.', (SELECT id FROM iso27002_control_categories WHERE category_code = 'A.5')),
    ('A.6.1.1', 'Information security roles and responsibilities', 'All information security responsibilities shall be defined and allocated.', (SELECT id FROM iso27002_control_categories WHERE category_code = 'A.6')),
    ('A.7.1.1', 'Screening', 'Background verification checks on all candidates for employment shall be carried out in accordance with relevant laws, regulations and ethics.', (SELECT id FROM iso27002_control_categories WHERE category_code = 'A.7')),
    ('A.8.1.1', 'Inventory of assets', 'Assets associated with information and information processing facilities shall be identified and an inventory of these assets shall be drawn up and maintained.', (SELECT id FROM iso27002_control_categories WHERE category_code = 'A.8')),
    ('A.9.1.1', 'Access control policy', 'An access control policy shall be established, documented and reviewed based on business and information security requirements.', (SELECT id FROM iso27002_control_categories WHERE category_code = 'A.9')),
    ('A.10.1.1', 'Policy on the use of cryptographic controls', 'A policy on the use of cryptographic controls for protection of information shall be developed and implemented.', (SELECT id FROM iso27002_control_categories WHERE category_code = 'A.10'))
) AS v(control_code, control_title, control_description, category_id)
WHERE NOT EXISTS (SELECT 1 FROM iso27002_controls WHERE control_code = v.control_code);

-- Create indexes if they don't exist
CREATE INDEX IF NOT EXISTS idx_iso27002_controls_category_id ON iso27002_controls(category_id);
CREATE INDEX IF NOT EXISTS idx_iso27002_controls_code ON iso27002_controls(control_code);
CREATE INDEX IF NOT EXISTS idx_iso27002_control_categories_code ON iso27002_control_categories(category_code);
