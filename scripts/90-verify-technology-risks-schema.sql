-- Verify and fix technology_risks table schema
DO $$
BEGIN
    -- Check if technology_risks table exists
    IF NOT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'technology_risks') THEN
        -- Create the table if it doesn't exist
        CREATE TABLE technology_risks (
            id SERIAL PRIMARY KEY,
            risk_id VARCHAR(50) UNIQUE DEFAULT 'TR-' || LPAD(nextval('technology_risks_id_seq')::text, 6, '0'),
            title VARCHAR(255) NOT NULL,
            description TEXT,
            technology_category VARCHAR(100),
            technology_type VARCHAR(100),
            asset_id VARCHAR(50),
            risk_category VARCHAR(100) DEFAULT 'Technology',
            likelihood INTEGER DEFAULT 1 CHECK (likelihood >= 1 AND likelihood <= 5),
            impact INTEGER DEFAULT 1 CHECK (impact >= 1 AND impact <= 5),
            risk_score INTEGER GENERATED ALWAYS AS (likelihood * impact) STORED,
            risk_level VARCHAR(20) GENERATED ALWAYS AS (
                CASE 
                    WHEN (likelihood * impact) >= 15 THEN 'High'
                    WHEN (likelihood * impact) >= 8 THEN 'Medium'
                    ELSE 'Low'
                END
            ) STORED,
            current_controls TEXT,
            recommended_controls TEXT,
            control_assessment TEXT,
            residual_likelihood INTEGER DEFAULT 1 CHECK (residual_likelihood >= 1 AND residual_likelihood <= 5),
            residual_impact INTEGER DEFAULT 1 CHECK (residual_impact >= 1 AND residual_impact <= 5),
            residual_risk INTEGER GENERATED ALWAYS AS (residual_likelihood * residual_impact) STORED,
            risk_treatment VARCHAR(50) DEFAULT 'mitigate',
            treatment_state VARCHAR(50) DEFAULT 'planned',
            treatment_end_date DATE,
            action_owner VARCHAR(255),
            owner VARCHAR(255) NOT NULL,
            status VARCHAR(50) DEFAULT 'open',
            due_date DATE,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
        
        -- Create indexes
        CREATE INDEX idx_technology_risks_status ON technology_risks(status);
        CREATE INDEX idx_technology_risks_risk_level ON technology_risks(risk_level);
        CREATE INDEX idx_technology_risks_owner ON technology_risks(owner);
        CREATE INDEX idx_technology_risks_category ON technology_risks(technology_category);
        
        RAISE NOTICE 'Created technology_risks table with all required columns';
    ELSE
        -- Table exists, check and add missing columns
        
        -- Check and add residual_likelihood column
        IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'technology_risks' AND column_name = 'residual_likelihood') THEN
            ALTER TABLE technology_risks ADD COLUMN residual_likelihood INTEGER DEFAULT 1 CHECK (residual_likelihood >= 1 AND residual_likelihood <= 5);
            RAISE NOTICE 'Added residual_likelihood column';
        END IF;
        
        -- Check and add residual_impact column
        IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'technology_risks' AND column_name = 'residual_impact') THEN
            ALTER TABLE technology_risks ADD COLUMN residual_impact INTEGER DEFAULT 1 CHECK (residual_impact >= 1 AND residual_impact <= 5);
            RAISE NOTICE 'Added residual_impact column';
        END IF;
        
        -- Check and add residual_risk column
        IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'technology_risks' AND column_name = 'residual_risk') THEN
            ALTER TABLE technology_risks ADD COLUMN residual_risk INTEGER GENERATED ALWAYS AS (residual_likelihood * residual_impact) STORED;
            RAISE NOTICE 'Added residual_risk column';
        END IF;
        
        -- Check and add control_assessment column
        IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'technology_risks' AND column_name = 'control_assessment') THEN
            ALTER TABLE technology_risks ADD COLUMN control_assessment TEXT;
            RAISE NOTICE 'Added control_assessment column';
        END IF;
        
        -- Check and add risk_treatment column
        IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'technology_risks' AND column_name = 'risk_treatment') THEN
            ALTER TABLE technology_risks ADD COLUMN risk_treatment VARCHAR(50) DEFAULT 'mitigate';
            RAISE NOTICE 'Added risk_treatment column';
        END IF;
        
        -- Check and add treatment_state column
        IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'technology_risks' AND column_name = 'treatment_state') THEN
            ALTER TABLE technology_risks ADD COLUMN treatment_state VARCHAR(50) DEFAULT 'planned';
            RAISE NOTICE 'Added treatment_state column';
        END IF;
        
        -- Check and add treatment_end_date column
        IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'technology_risks' AND column_name = 'treatment_end_date') THEN
            ALTER TABLE technology_risks ADD COLUMN treatment_end_date DATE;
            RAISE NOTICE 'Added treatment_end_date column';
        END IF;
        
        -- Check and add action_owner column
        IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'technology_risks' AND column_name = 'action_owner') THEN
            ALTER TABLE technology_risks ADD COLUMN action_owner VARCHAR(255);
            RAISE NOTICE 'Added action_owner column';
        END IF;
        
        -- Ensure asset_id is VARCHAR
        DO $inner$
        BEGIN
            IF EXISTS (
                SELECT FROM information_schema.columns 
                WHERE table_name = 'technology_risks' 
                AND column_name = 'asset_id' 
                AND data_type != 'character varying'
            ) THEN
                ALTER TABLE technology_risks ALTER COLUMN asset_id TYPE VARCHAR(50);
                RAISE NOTICE 'Changed asset_id column type to VARCHAR(50)';
            END IF;
        END $inner$;
        
        RAISE NOTICE 'Verified technology_risks table schema';
    END IF;
END $$;
