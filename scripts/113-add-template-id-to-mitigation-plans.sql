-- Add template_id column to nist_csf_mitigation_plans table
-- This links mitigation plans to specific NIST CSF risk templates

-- First, check if the column already exists
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'nist_csf_mitigation_plans' 
        AND column_name = 'template_id'
    ) THEN
        -- Add the template_id column
        ALTER TABLE nist_csf_mitigation_plans 
        ADD COLUMN template_id INTEGER;
        
        -- Add foreign key constraint to nist_csf_risk_templates
        ALTER TABLE nist_csf_mitigation_plans 
        ADD CONSTRAINT fk_mitigation_plan_template 
        FOREIGN KEY (template_id) REFERENCES nist_csf_risk_templates(id) 
        ON DELETE SET NULL;
        
        -- Add index for better query performance
        CREATE INDEX idx_mitigation_plans_template_id 
        ON nist_csf_mitigation_plans(template_id);
        
        RAISE NOTICE 'Added template_id column and constraints to nist_csf_mitigation_plans table';
    ELSE
        RAISE NOTICE 'template_id column already exists in nist_csf_mitigation_plans table';
    END IF;
END $$;

-- Update the table structure to match the expected schema
-- Ensure we have all the required columns with proper data types
DO $$
BEGIN
    -- Check and add missing columns if they don't exist
    
    -- Add action_owner if it doesn't exist (rename from assigned_owner if needed)
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'nist_csf_mitigation_plans' 
        AND column_name = 'action_owner'
    ) THEN
        IF EXISTS (
            SELECT 1 FROM information_schema.columns 
            WHERE table_name = 'nist_csf_mitigation_plans' 
            AND column_name = 'assigned_owner'
        ) THEN
            -- Rename existing column
            ALTER TABLE nist_csf_mitigation_plans 
            RENAME COLUMN assigned_owner TO action_owner;
            RAISE NOTICE 'Renamed assigned_owner to action_owner';
        ELSE
            -- Add new column
            ALTER TABLE nist_csf_mitigation_plans 
            ADD COLUMN action_owner VARCHAR(255);
            RAISE NOTICE 'Added action_owner column';
        END IF;
    END IF;
    
    -- Add due_date if it doesn't exist (rename from target_completion_date if needed)
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'nist_csf_mitigation_plans' 
        AND column_name = 'due_date'
    ) THEN
        IF EXISTS (
            SELECT 1 FROM information_schema.columns 
            WHERE table_name = 'nist_csf_mitigation_plans' 
            AND column_name = 'target_completion_date'
        ) THEN
            -- Rename existing column
            ALTER TABLE nist_csf_mitigation_plans 
            RENAME COLUMN target_completion_date TO due_date;
            RAISE NOTICE 'Renamed target_completion_date to due_date';
        ELSE
            -- Add new column
            ALTER TABLE nist_csf_mitigation_plans 
            ADD COLUMN due_date DATE;
            RAISE NOTICE 'Added due_date column';
        END IF;
    END IF;
    
    -- Add investment_amount if it doesn't exist (rename from estimated_cost if needed)
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'nist_csf_mitigation_plans' 
        AND column_name = 'investment_amount'
    ) THEN
        IF EXISTS (
            SELECT 1 FROM information_schema.columns 
            WHERE table_name = 'nist_csf_mitigation_plans' 
            AND column_name = 'estimated_cost'
        ) THEN
            -- Rename existing column
            ALTER TABLE nist_csf_mitigation_plans 
            RENAME COLUMN estimated_cost TO investment_amount;
            RAISE NOTICE 'Renamed estimated_cost to investment_amount';
        ELSE
            -- Add new column
            ALTER TABLE nist_csf_mitigation_plans 
            ADD COLUMN investment_amount DECIMAL(15,2) DEFAULT 0;
            RAISE NOTICE 'Added investment_amount column';
        END IF;
    END IF;
    
    -- Add priority if it doesn't exist (rename from priority_level if needed)
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'nist_csf_mitigation_plans' 
        AND column_name = 'priority'
    ) THEN
        IF EXISTS (
            SELECT 1 FROM information_schema.columns 
            WHERE table_name = 'nist_csf_mitigation_plans' 
            AND column_name = 'priority_level'
        ) THEN
            -- Rename existing column
            ALTER TABLE nist_csf_mitigation_plans 
            RENAME COLUMN priority_level TO priority;
            RAISE NOTICE 'Renamed priority_level to priority';
        ELSE
            -- Add new column
            ALTER TABLE nist_csf_mitigation_plans 
            ADD COLUMN priority VARCHAR(50) DEFAULT 'Medium';
            RAISE NOTICE 'Added priority column';
        END IF;
    END IF;
    
    -- Add residual_risk_level if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'nist_csf_mitigation_plans' 
        AND column_name = 'residual_risk_level'
    ) THEN
        ALTER TABLE nist_csf_mitigation_plans 
        ADD COLUMN residual_risk_level VARCHAR(50) DEFAULT 'Medium';
        RAISE NOTICE 'Added residual_risk_level column';
    END IF;
    
    -- Add notes if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'nist_csf_mitigation_plans' 
        AND column_name = 'notes'
    ) THEN
        ALTER TABLE nist_csf_mitigation_plans 
        ADD COLUMN notes TEXT;
        RAISE NOTICE 'Added notes column';
    END IF;
    
END $$;

-- Update any existing records to have default values where needed
UPDATE nist_csf_mitigation_plans 
SET 
    priority = COALESCE(priority, 'Medium'),
    residual_risk_level = COALESCE(residual_risk_level, 'Medium'),
    investment_amount = COALESCE(investment_amount, 0)
WHERE priority IS NULL OR residual_risk_level IS NULL OR investment_amount IS NULL;

RAISE NOTICE 'Successfully updated nist_csf_mitigation_plans table schema';
