-- Enhance vulnerabilities table with TAT and remediation tracking
ALTER TABLE vulnerabilities 
ADD COLUMN IF NOT EXISTS remediation_due_date DATE,
ADD COLUMN IF NOT EXISTS remediation_completed_date DATE,
ADD COLUMN IF NOT EXISTS tat_days INTEGER DEFAULT 30,
ADD COLUMN IF NOT EXISTS assigned_to VARCHAR(255),
ADD COLUMN IF NOT EXISTS priority INTEGER DEFAULT 3,
ADD COLUMN IF NOT EXISTS external_references JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS tags JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS last_reviewed_date DATE,
ADD COLUMN IF NOT EXISTS reviewer VARCHAR(255);

-- Create function to calculate aging days
CREATE OR REPLACE FUNCTION calculate_aging_days(
    p_created_at TIMESTAMP,
    p_remediation_completed_date DATE,
    p_remediation_due_date DATE
) RETURNS INTEGER AS $$
BEGIN
    -- If remediation is completed, return days between creation and completion
    IF p_remediation_completed_date IS NOT NULL THEN
        RETURN EXTRACT(DAY FROM p_remediation_completed_date - p_created_at::DATE);
    END IF;
    
    -- If not completed, return days since creation
    RETURN EXTRACT(DAY FROM CURRENT_DATE - p_created_at::DATE);
END;
$$ LANGUAGE plpgsql;

-- Create function to calculate overdue days
CREATE OR REPLACE FUNCTION calculate_overdue_days(
    p_remediation_due_date DATE,
    p_remediation_completed_date DATE
) RETURNS INTEGER AS $$
BEGIN
    -- If remediation is completed, no overdue
    IF p_remediation_completed_date IS NOT NULL THEN
        RETURN 0;
    END IF;
    
    -- If due date is in the future, not overdue
    IF p_remediation_due_date IS NULL OR p_remediation_due_date >= CURRENT_DATE THEN
        RETURN 0;
    END IF;
    
    -- Calculate overdue days
    RETURN EXTRACT(DAY FROM CURRENT_DATE - p_remediation_due_date);
END;
$$ LANGUAGE plpgsql;

-- Create view for vulnerability dashboard
CREATE OR REPLACE VIEW vulnerability_dashboard AS
SELECT 
    v.*,
    calculate_aging_days(v.created_at, v.remediation_completed_date, v.remediation_due_date) as aging_days,
    calculate_overdue_days(v.remediation_due_date, v.remediation_completed_date) as overdue_days,
    CASE 
        WHEN v.remediation_completed_date IS NOT NULL THEN 'Completed'
        WHEN v.remediation_due_date IS NOT NULL AND v.remediation_due_date < CURRENT_DATE THEN 'Overdue'
        WHEN v.remediation_due_date IS NOT NULL AND v.remediation_due_date <= CURRENT_DATE + INTERVAL '7 days' THEN 'Due Soon'
        ELSE 'On Track'
    END as remediation_timeline_status
FROM vulnerabilities v;

-- Update existing records with default TAT based on severity
UPDATE vulnerabilities SET 
    tat_days = CASE 
        WHEN severity = 'Critical' THEN 7
        WHEN severity = 'High' THEN 14
        WHEN severity = 'Medium' THEN 30
        WHEN severity = 'Low' THEN 60
        WHEN severity = 'Informational' THEN 90
        ELSE 30
    END,
    remediation_due_date = created_at::DATE + INTERVAL '1 day' * CASE 
        WHEN severity = 'Critical' THEN 7
        WHEN severity = 'High' THEN 14
        WHEN severity = 'Medium' THEN 30
        WHEN severity = 'Low' THEN 60
        WHEN severity = 'Informational' THEN 90
        ELSE 30
    END
WHERE tat_days IS NULL OR remediation_due_date IS NULL;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_vulnerabilities_remediation_due_date ON vulnerabilities(remediation_due_date);
CREATE INDEX IF NOT EXISTS idx_vulnerabilities_assigned_to ON vulnerabilities(assigned_to);
CREATE INDEX IF NOT EXISTS idx_vulnerabilities_priority ON vulnerabilities(priority);
CREATE INDEX IF NOT EXISTS idx_vulnerabilities_remediation_status ON vulnerabilities(remediation_status);

-- Add trigger to automatically set remediation due date based on TAT
CREATE OR REPLACE FUNCTION set_remediation_due_date()
RETURNS TRIGGER AS $$
BEGIN
    -- Set remediation due date based on TAT days if not already set
    IF NEW.remediation_due_date IS NULL AND NEW.tat_days IS NOT NULL THEN
        NEW.remediation_due_date = NEW.created_at::DATE + INTERVAL '1 day' * NEW.tat_days;
    END IF;
    
    -- Set remediation completed date when status changes to resolved
    IF NEW.remediation_status = 'Resolved' AND OLD.remediation_status != 'Resolved' AND NEW.remediation_completed_date IS NULL THEN
        NEW.remediation_completed_date = CURRENT_DATE;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_set_remediation_due_date
    BEFORE INSERT OR UPDATE ON vulnerabilities
    FOR EACH ROW
    EXECUTE FUNCTION set_remediation_due_date();
