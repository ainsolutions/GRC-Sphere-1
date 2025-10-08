-- Ensure technology_risks table exists with correct schema
DO $$
BEGIN
    -- Check if technology_risks table exists
    IF NOT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'technology_risks') THEN
        -- Create the technology_risks table
        CREATE TABLE technology_risks (
            id SERIAL PRIMARY KEY,
            risk_id VARCHAR(50) UNIQUE NOT NULL,
            title VARCHAR(255) NOT NULL,
            description TEXT NOT NULL,
            technology_category VARCHAR(100) NOT NULL,
            technology_type VARCHAR(100) DEFAULT 'Server',
            asset_ids VARCHAR(500), -- Comma-separated asset IDs
            risk_category VARCHAR(50) DEFAULT 'Technology',
            likelihood INTEGER DEFAULT 1 CHECK (likelihood >= 1 AND likelihood <= 5),
            impact INTEGER DEFAULT 1 CHECK (impact >= 1 AND impact <= 5),
            current_controls TEXT DEFAULT '',
            recommended_controls TEXT DEFAULT '',
            owner VARCHAR(255) NOT NULL,
            status VARCHAR(50) DEFAULT 'open' CHECK (status IN ('open', 'in-progress', 'mitigated', 'accepted', 'closed')),
            due_date DATE,
            residual_likelihood INTEGER DEFAULT 1 CHECK (residual_likelihood >= 1 AND residual_likelihood <= 5),
            residual_impact INTEGER DEFAULT 1 CHECK (residual_impact >= 1 AND residual_impact <= 5),
            control_assessment TEXT DEFAULT '',
            risk_treatment VARCHAR(50) DEFAULT 'mitigate' CHECK (risk_treatment IN ('mitigate', 'transfer', 'avoid', 'accept')),
            treatment_state VARCHAR(50) DEFAULT 'planned' CHECK (treatment_state IN ('planned', 'in-progress', 'completed', 'overdue', 'cancelled')),
            treatment_end_date DATE,
            action_owner VARCHAR(255) DEFAULT '',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );

        -- Create indexes for better performance
        CREATE INDEX idx_technology_risks_risk_id ON technology_risks(risk_id);
        CREATE INDEX idx_technology_risks_status ON technology_risks(status);
        CREATE INDEX idx_technology_risks_owner ON technology_risks(owner);
        CREATE INDEX idx_technology_risks_category ON technology_risks(technology_category);
        CREATE INDEX idx_technology_risks_created_at ON technology_risks(created_at);

        RAISE NOTICE 'Created technology_risks table with all required columns';
    ELSE
        -- Table exists, check if asset_ids column exists and is VARCHAR
        IF NOT EXISTS (
            SELECT FROM information_schema.columns 
            WHERE table_name = 'technology_risks' 
            AND column_name = 'asset_ids'
        ) THEN
            -- Add asset_ids column if it doesn't exist
            ALTER TABLE technology_risks ADD COLUMN asset_ids VARCHAR(500);
            RAISE NOTICE 'Added asset_ids column to technology_risks table';
        ELSE
            -- Check if asset_ids is the correct type (VARCHAR)
            IF EXISTS (
                SELECT FROM information_schema.columns 
                WHERE table_name = 'technology_risks' 
                AND column_name = 'asset_ids'
                AND data_type != 'character varying'
            ) THEN
                -- Convert asset_ids to VARCHAR if it's not already
                ALTER TABLE technology_risks ALTER COLUMN asset_ids TYPE VARCHAR(500);
                RAISE NOTICE 'Converted asset_ids column to VARCHAR type';
            END IF;
        END IF;

        -- Ensure all other required columns exist
        IF NOT EXISTS (
            SELECT FROM information_schema.columns 
            WHERE table_name = 'technology_risks' 
            AND column_name = 'technology_category'
        ) THEN
            ALTER TABLE technology_risks ADD COLUMN technology_category VARCHAR(100) NOT NULL DEFAULT 'Infrastructure';
            RAISE NOTICE 'Added technology_category column to technology_risks table';
        END IF;

        IF NOT EXISTS (
            SELECT FROM information_schema.columns 
            WHERE table_name = 'technology_risks' 
            AND column_name = 'technology_type'
        ) THEN
            ALTER TABLE technology_risks ADD COLUMN technology_type VARCHAR(100) DEFAULT 'Server';
            RAISE NOTICE 'Added technology_type column to technology_risks table';
        END IF;

        IF NOT EXISTS (
            SELECT FROM information_schema.columns 
            WHERE table_name = 'technology_risks' 
            AND column_name = 'residual_likelihood'
        ) THEN
            ALTER TABLE technology_risks ADD COLUMN residual_likelihood INTEGER DEFAULT 1 CHECK (residual_likelihood >= 1 AND residual_likelihood <= 5);
            RAISE NOTICE 'Added residual_likelihood column to technology_risks table';
        END IF;

        IF NOT EXISTS (
            SELECT FROM information_schema.columns 
            WHERE table_name = 'technology_risks' 
            AND column_name = 'residual_impact'
        ) THEN
            ALTER TABLE technology_risks ADD COLUMN residual_impact INTEGER DEFAULT 1 CHECK (residual_impact >= 1 AND residual_impact <= 5);
            RAISE NOTICE 'Added residual_impact column to technology_risks table';
        END IF;

        IF NOT EXISTS (
            SELECT FROM information_schema.columns 
            WHERE table_name = 'technology_risks' 
            AND column_name = 'control_assessment'
        ) THEN
            ALTER TABLE technology_risks ADD COLUMN control_assessment TEXT DEFAULT '';
            RAISE NOTICE 'Added control_assessment column to technology_risks table';
        END IF;

        IF NOT EXISTS (
            SELECT FROM information_schema.columns 
            WHERE table_name = 'technology_risks' 
            AND column_name = 'risk_treatment'
        ) THEN
            ALTER TABLE technology_risks ADD COLUMN risk_treatment VARCHAR(50) DEFAULT 'mitigate' CHECK (risk_treatment IN ('mitigate', 'transfer', 'avoid', 'accept'));
            RAISE NOTICE 'Added risk_treatment column to technology_risks table';
        END IF;

        IF NOT EXISTS (
            SELECT FROM information_schema.columns 
            WHERE table_name = 'technology_risks' 
            AND column_name = 'treatment_state'
        ) THEN
            ALTER TABLE technology_risks ADD COLUMN treatment_state VARCHAR(50) DEFAULT 'planned' CHECK (treatment_state IN ('planned', 'in-progress', 'completed', 'overdue', 'cancelled'));
            RAISE NOTICE 'Added treatment_state column to technology_risks table';
        END IF;

        IF NOT EXISTS (
            SELECT FROM information_schema.columns 
            WHERE table_name = 'technology_risks' 
            AND column_name = 'treatment_end_date'
        ) THEN
            ALTER TABLE technology_risks ADD COLUMN treatment_end_date DATE;
            RAISE NOTICE 'Added treatment_end_date column to technology_risks table';
        END IF;

        IF NOT EXISTS (
            SELECT FROM information_schema.columns 
            WHERE table_name = 'technology_risks' 
            AND column_name = 'action_owner'
        ) THEN
            ALTER TABLE technology_risks ADD COLUMN action_owner VARCHAR(255) DEFAULT '';
            RAISE NOTICE 'Added action_owner column to technology_risks table';
        END IF;

        RAISE NOTICE 'Technology_risks table schema verified and updated';
    END IF;
END $$;

-- Insert sample data if table is empty
INSERT INTO technology_risks (
    risk_id,
    title,
    description,
    technology_category,
    technology_type,
    asset_ids,
    risk_category,
    likelihood,
    impact,
    current_controls,
    recommended_controls,
    owner,
    status,
    residual_likelihood,
    residual_impact,
    control_assessment,
    risk_treatment,
    treatment_state,
    action_owner
) 
SELECT 
    'TR-2024-00001',
    'Outdated Server Operating System',
    'Critical servers running on unsupported Windows Server 2012 R2 with no security patches',
    'Infrastructure',
    'Server',
    '1,2',
    'Technology',
    4,
    4,
    'Basic firewall protection, limited access controls',
    'Upgrade to Windows Server 2022, implement patch management system',
    'IT Operations Team',
    'open',
    3,
    3,
    'Current controls provide minimal protection against modern threats',
    'mitigate',
    'planned',
    'John Smith'
WHERE NOT EXISTS (SELECT 1 FROM technology_risks WHERE risk_id = 'TR-2024-00001');

INSERT INTO technology_risks (
    risk_id,
    title,
    description,
    technology_category,
    technology_type,
    asset_ids,
    risk_category,
    likelihood,
    impact,
    current_controls,
    recommended_controls,
    owner,
    status,
    residual_likelihood,
    residual_impact,
    control_assessment,
    risk_treatment,
    treatment_state,
    action_owner
) 
SELECT 
    'TR-2024-00002',
    'Unencrypted Database Communications',
    'Database connections not using TLS encryption, exposing sensitive data in transit',
    'Database',
    'Database Server',
    '3',
    'Technology',
    3,
    5,
    'Network segmentation, VPN access required',
    'Enable TLS 1.3 for all database connections, implement certificate management',
    'Database Administrator',
    'in-progress',
    2,
    4,
    'Network controls reduce exposure but encryption is still needed',
    'mitigate',
    'in-progress',
    'Sarah Johnson'
WHERE NOT EXISTS (SELECT 1 FROM technology_risks WHERE risk_id = 'TR-2024-00002');

INSERT INTO technology_risks (
    risk_id,
    title,
    description,
    technology_category,
    technology_type,
    asset_ids,
    risk_category,
    likelihood,
    impact,
    current_controls,
    recommended_controls,
    owner,
    status,
    residual_likelihood,
    residual_impact,
    control_assessment,
    risk_treatment,
    treatment_state,
    action_owner
) 
SELECT 
    'TR-2024-00003',
    'Legacy Application Security Vulnerabilities',
    'Custom web application built on outdated framework with known security vulnerabilities',
    'Software',
    'Web Application',
    '4,5',
    'Technology',
    4,
    3,
    'Web application firewall, input validation',
    'Migrate to modern framework, conduct security code review',
    'Development Team',
    'mitigated',
    2,
    2,
    'WAF and input validation significantly reduce risk exposure',
    'mitigate',
    'completed',
    'Mike Chen'
WHERE NOT EXISTS (SELECT 1 FROM technology_risks WHERE risk_id = 'TR-2024-00003');

RAISE NOTICE 'Technology risks table setup completed successfully';
