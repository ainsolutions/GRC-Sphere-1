-- Fix department table structure to match the application code
-- Add missing columns if they don't exist

-- Add department_head column if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'departments' AND column_name = 'department_head') THEN
        ALTER TABLE departments ADD COLUMN department_head VARCHAR(255);
    END IF;
END $$;

-- Add cost_center column if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'departments' AND column_name = 'cost_center') THEN
        ALTER TABLE departments ADD COLUMN cost_center VARCHAR(100);
    END IF;
END $$;

-- Add phone column if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'departments' AND column_name = 'phone') THEN
        ALTER TABLE departments ADD COLUMN phone VARCHAR(50);
    END IF;
END $$;

-- Add email column if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'departments' AND column_name = 'email') THEN
        ALTER TABLE departments ADD COLUMN email VARCHAR(255);
    END IF;
END $$;

-- Add location column if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'departments' AND column_name = 'location') THEN
        ALTER TABLE departments ADD COLUMN location VARCHAR(255);
    END IF;
END $$;

-- Add budget column if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'departments' AND column_name = 'budget') THEN
        ALTER TABLE departments ADD COLUMN budget DECIMAL(15,2);
    END IF;
END $$;

-- Update any existing data to ensure consistency
UPDATE departments SET 
    department_head = COALESCE(department_head, ''),
    cost_center = COALESCE(cost_center, ''),
    phone = COALESCE(phone, ''),
    email = COALESCE(email, ''),
    location = COALESCE(location, ''),
    budget = COALESCE(budget, 0.00)
WHERE department_head IS NULL OR cost_center IS NULL OR phone IS NULL 
   OR email IS NULL OR location IS NULL OR budget IS NULL;
