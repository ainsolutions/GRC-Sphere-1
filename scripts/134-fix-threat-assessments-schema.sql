-- Fix threat assessments table schema to handle string/numeric conversion properly
-- This script ensures the table exists with the correct data types

-- First, check if the table exists and create it if it doesn't
DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'threat_assessments') THEN
        CREATE TABLE threat_assessments (
            id SERIAL PRIMARY KEY,
            assessment_name VARCHAR(255) NOT NULL,
            threat_id VARCHAR(100) NOT NULL,
            asset_id VARCHAR(100) NOT NULL,
            likelihood INTEGER NOT NULL DEFAULT 3,
            impact INTEGER NOT NULL DEFAULT 3,
            risk_level INTEGER NOT NULL DEFAULT 3,
            mitigation_status VARCHAR(50) DEFAULT 'pending',
            assessment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            assessor VARCHAR(255) NOT NULL,
            notes TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
        
        -- Add constraints for valid values
        ALTER TABLE threat_assessments 
        ADD CONSTRAINT chk_likelihood CHECK (likelihood >= 1 AND likelihood <= 5);
        
        ALTER TABLE threat_assessments 
        ADD CONSTRAINT chk_impact CHECK (impact >= 1 AND impact <= 5);
        
        ALTER TABLE threat_assessments 
        ADD CONSTRAINT chk_risk_level CHECK (risk_level >= 1 AND risk_level <= 5);
        
        ALTER TABLE threat_assessments 
        ADD CONSTRAINT chk_mitigation_status CHECK (mitigation_status IN ('pending', 'in_progress', 'completed', 'not_required'));
        
        RAISE NOTICE 'Created threat_assessments table with proper schema';
    ELSE
        RAISE NOTICE 'threat_assessments table already exists';
    END IF;
END
$$;

-- Ensure columns have correct data types
DO $$
BEGIN
    -- Check and fix likelihood column
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'threat_assessments' 
        AND column_name = 'likelihood' 
        AND data_type != 'integer'
    ) THEN
        -- Convert existing string values to integers
        UPDATE threat_assessments SET 
            likelihood = CASE 
                WHEN LOWER(likelihood::text) = 'very low' THEN 1
                WHEN LOWER(likelihood::text) = 'low' THEN 2
                WHEN LOWER(likelihood::text) = 'medium' THEN 3
                WHEN LOWER(likelihood::text) = 'high' THEN 4
                WHEN LOWER(likelihood::text) = 'very high' THEN 5
                ELSE 3
            END
        WHERE likelihood::text ~ '^[a-zA-Z]';
        
        -- Change column type to integer
        ALTER TABLE threat_assessments ALTER COLUMN likelihood TYPE INTEGER USING likelihood::integer;
        RAISE NOTICE 'Fixed likelihood column data type';
    END IF;
    
    -- Check and fix impact column
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'threat_assessments' 
        AND column_name = 'impact' 
        AND data_type != 'integer'
    ) THEN
        -- Convert existing string values to integers
        UPDATE threat_assessments SET 
            impact = CASE 
                WHEN LOWER(impact::text) = 'very low' THEN 1
                WHEN LOWER(impact::text) = 'low' THEN 2
                WHEN LOWER(impact::text) = 'medium' THEN 3
                WHEN LOWER(impact::text) = 'high' THEN 4
                WHEN LOWER(impact::text) = 'very high' THEN 5
                ELSE 3
            END
        WHERE impact::text ~ '^[a-zA-Z]';
        
        -- Change column type to integer
        ALTER TABLE threat_assessments ALTER COLUMN impact TYPE INTEGER USING impact::integer;
        RAISE NOTICE 'Fixed impact column data type';
    END IF;
    
    -- Check and fix risk_level column
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'threat_assessments' 
        AND column_name = 'risk_level' 
        AND data_type != 'integer'
    ) THEN
        -- Convert existing string values to integers
        UPDATE threat_assessments SET 
            risk_level = CASE 
                WHEN LOWER(risk_level::text) = 'low' THEN 2
                WHEN LOWER(risk_level::text) = 'medium' THEN 3
                WHEN LOWER(risk_level::text) = 'high' THEN 4
                WHEN LOWER(risk_level::text) = 'critical' THEN 5
                ELSE 3
            END
        WHERE risk_level::text ~ '^[a-zA-Z]';
        
        -- Change column type to integer
        ALTER TABLE threat_assessments ALTER COLUMN risk_level TYPE INTEGER USING risk_level::integer;
        RAISE NOTICE 'Fixed risk_level column data type';
    END IF;
END
$$;

-- Add constraints if they don't exist
DO $$
BEGIN
    -- Add likelihood constraint if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE table_name = 'threat_assessments' 
        AND constraint_name = 'chk_likelihood'
    ) THEN
        ALTER TABLE threat_assessments 
        ADD CONSTRAINT chk_likelihood CHECK (likelihood >= 1 AND likelihood <= 5);
        RAISE NOTICE 'Added likelihood constraint';
    END IF;
    
    -- Add impact constraint if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE table_name = 'threat_assessments' 
        AND constraint_name = 'chk_impact'
    ) THEN
        ALTER TABLE threat_assessments 
        ADD CONSTRAINT chk_impact CHECK (impact >= 1 AND impact <= 5);
        RAISE NOTICE 'Added impact constraint';
    END IF;
    
    -- Add risk_level constraint if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE table_name = 'threat_assessments' 
        AND constraint_name = 'chk_risk_level'
    ) THEN
        ALTER TABLE threat_assessments 
        ADD CONSTRAINT chk_risk_level CHECK (risk_level >= 1 AND risk_level <= 5);
        RAISE NOTICE 'Added risk_level constraint';
    END IF;
    
    -- Add mitigation_status constraint if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE table_name = 'threat_assessments' 
        AND constraint_name = 'chk_mitigation_status'
    ) THEN
        ALTER TABLE threat_assessments 
        ADD CONSTRAINT chk_mitigation_status CHECK (mitigation_status IN ('pending', 'in_progress', 'completed', 'not_required'));
        RAISE NOTICE 'Added mitigation_status constraint';
    END IF;
END
$$;

-- Insert some sample data if the table is empty
INSERT INTO threat_assessments (
    assessment_name, threat_id, asset_id, likelihood, impact, risk_level, 
    mitigation_status, assessor, notes
) 
SELECT 
    'Sample Threat Assessment ' || generate_series,
    'THR-' || LPAD(generate_series::text, 3, '0'),
    'AST-' || LPAD((generate_series % 10 + 1)::text, 3, '0'),
    (generate_series % 5) + 1, -- likelihood 1-5
    (generate_series % 5) + 1, -- impact 1-5
    (generate_series % 4) + 2, -- risk_level 2-5
    CASE (generate_series % 4)
        WHEN 0 THEN 'pending'
        WHEN 1 THEN 'in_progress'
        WHEN 2 THEN 'completed'
        ELSE 'not_required'
    END,
    'System Administrator',
    'Sample threat assessment for testing purposes'
FROM generate_series(1, 10)
WHERE NOT EXISTS (SELECT 1 FROM threat_assessments LIMIT 1);

-- Verify the schema
SELECT 
    column_name, 
    data_type, 
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'threat_assessments' 
ORDER BY ordinal_position;

RAISE NOTICE 'Threat assessments table schema verification completed';
