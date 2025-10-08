-- MICA Gap Analysis tables for identifying and managing compliance gaps

-- MICA Gap Analysis table
CREATE TABLE IF NOT EXISTS mica_gap_analysis (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    analysis_name VARCHAR(200) NOT NULL,
    description TEXT,
    baseline_assessment_id UUID REFERENCES mica_assessments(id),
    target_maturity_level INTEGER NOT NULL DEFAULT 4, -- Target maturity level (1-5)
    analysis_scope TEXT,
    analyst_name VARCHAR(100) NOT NULL,
    analyst_email VARCHAR(255) NOT NULL,
    analysis_methodology TEXT,
    status VARCHAR(30) NOT NULL DEFAULT 'draft', -- draft, in_progress, completed, under_review
    start_date DATE,
    target_completion_date DATE,
    actual_completion_date DATE,
    executive_summary TEXT,
    key_findings TEXT,
    recommendations TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    
    CONSTRAINT mica_gap_analysis_maturity_check 
        CHECK (target_maturity_level >= 1 AND target_maturity_level <= 5),
    CONSTRAINT mica_gap_analysis_status_check 
        CHECK (status IN ('draft', 'in_progress', 'completed', 'under_review'))
);

-- MICA Gap Analysis Items table
CREATE TABLE IF NOT EXISTS mica_gap_analysis_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    gap_analysis_id UUID NOT NULL REFERENCES mica_gap_analysis(id) ON DELETE CASCADE,
    requirement_id UUID REFERENCES mica_requirements(id),
    control_id VARCHAR(50),
    control_title VARCHAR(200) NOT NULL,
    current_maturity_level INTEGER NOT NULL DEFAULT 0,
    target_maturity_level INTEGER NOT NULL DEFAULT 4,
    gap_description TEXT NOT NULL,
    impact_assessment TEXT,
    severity VARCHAR(20) NOT NULL, -- critical, high, medium, low
    likelihood VARCHAR(20) NOT NULL DEFAULT 'medium', -- very_high, high, medium, low, very_low
    business_impact VARCHAR(20) NOT NULL DEFAULT 'medium', -- very_high, high, medium, low, very_low
    regulatory_impact VARCHAR(20) NOT NULL DEFAULT 'medium', -- very_high, high, medium, low, very_low
    estimated_cost DECIMAL(12,2),
    estimated_effort_days INTEGER,
    recommended_actions TEXT,
    alternative_solutions TEXT,
    dependencies TEXT,
    responsible_party VARCHAR(100),
    target_completion_date DATE,
    status VARCHAR(30) NOT NULL DEFAULT 'open', -- open, in_progress, closed, deferred
    priority_score INTEGER, -- Calculated priority score
    risk_score INTEGER, -- Calculated risk score
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    
    CONSTRAINT mica_gap_analysis_items_current_maturity_check 
        CHECK (current_maturity_level >= 0 AND current_maturity_level <= 5),
    CONSTRAINT mica_gap_analysis_items_target_maturity_check 
        CHECK (target_maturity_level >= 1 AND target_maturity_level <= 5),
    CONSTRAINT mica_gap_analysis_items_severity_check 
        CHECK (severity IN ('critical', 'high', 'medium', 'low')),
    CONSTRAINT mica_gap_analysis_items_likelihood_check 
        CHECK (likelihood IN ('very_high', 'high', 'medium', 'low', 'very_low')),
    CONSTRAINT mica_gap_analysis_items_business_impact_check 
        CHECK (business_impact IN ('very_high', 'high', 'medium', 'low', 'very_low')),
    CONSTRAINT mica_gap_analysis_items_regulatory_impact_check 
        CHECK (regulatory_impact IN ('very_high', 'high', 'medium', 'low', 'very_low')),
    CONSTRAINT mica_gap_analysis_items_status_check 
        CHECK (status IN ('open', 'in_progress', 'closed', 'deferred'))
);

-- MICA Gap Analysis Categories table
CREATE TABLE IF NOT EXISTS mica_gap_analysis_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    gap_analysis_id UUID NOT NULL REFERENCES mica_gap_analysis(id) ON DELETE CASCADE,
    category_name VARCHAR(100) NOT NULL,
    current_maturity_avg DECIMAL(3,2),
    target_maturity_avg DECIMAL(3,2),
    gap_count INTEGER DEFAULT 0,
    critical_gaps INTEGER DEFAULT 0,
    high_gaps INTEGER DEFAULT 0,
    medium_gaps INTEGER DEFAULT 0,
    low_gaps INTEGER DEFAULT 0,
    total_estimated_cost DECIMAL(12,2),
    total_estimated_effort_days INTEGER,
    category_priority_score INTEGER,
    recommendations TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- MICA Gap Analysis Reports table
CREATE TABLE IF NOT EXISTS mica_gap_analysis_reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    gap_analysis_id UUID NOT NULL REFERENCES mica_gap_analysis(id) ON DELETE CASCADE,
    report_type VARCHAR(50) NOT NULL, -- executive_summary, detailed_analysis, action_plan, cost_benefit
    report_title VARCHAR(200) NOT NULL,
    report_content TEXT,
    report_format VARCHAR(20) NOT NULL DEFAULT 'html', -- html, pdf, excel, json
    generated_by VARCHAR(100),
    generation_date TIMESTAMP DEFAULT NOW(),
    file_path VARCHAR(500),
    file_size BIGINT,
    is_confidential BOOLEAN DEFAULT false,
    access_permissions TEXT[], -- Array of roles/users with access
    created_at TIMESTAMP DEFAULT NOW(),
    
    CONSTRAINT mica_gap_analysis_reports_type_check 
        CHECK (report_type IN ('executive_summary', 'detailed_analysis', 'action_plan', 'cost_benefit')),
    CONSTRAINT mica_gap_analysis_reports_format_check 
        CHECK (report_format IN ('html', 'pdf', 'excel', 'json'))
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_mica_gap_analysis_status ON mica_gap_analysis(status);
CREATE INDEX IF NOT EXISTS idx_mica_gap_analysis_analyst ON mica_gap_analysis(analyst_email);
CREATE INDEX IF NOT EXISTS idx_mica_gap_analysis_items_analysis ON mica_gap_analysis_items(gap_analysis_id);
CREATE INDEX IF NOT EXISTS idx_mica_gap_analysis_items_severity ON mica_gap_analysis_items(severity);
CREATE INDEX IF NOT EXISTS idx_mica_gap_analysis_items_status ON mica_gap_analysis_items(status);
CREATE INDEX IF NOT EXISTS idx_mica_gap_analysis_items_priority ON mica_gap_analysis_items(priority_score);
CREATE INDEX IF NOT EXISTS idx_mica_gap_analysis_categories_analysis ON mica_gap_analysis_categories(gap_analysis_id);
CREATE INDEX IF NOT EXISTS idx_mica_gap_analysis_reports_analysis ON mica_gap_analysis_reports(gap_analysis_id);
CREATE INDEX IF NOT EXISTS idx_mica_gap_analysis_reports_type ON mica_gap_analysis_reports(report_type);

-- Function to calculate priority score based on multiple factors
CREATE OR REPLACE FUNCTION calculate_mica_gap_priority_score(
    p_severity VARCHAR(20),
    p_likelihood VARCHAR(20),
    p_business_impact VARCHAR(20),
    p_regulatory_impact VARCHAR(20),
    p_current_maturity INTEGER,
    p_target_maturity INTEGER
) RETURNS INTEGER AS $$
DECLARE
    severity_score INTEGER;
    likelihood_score INTEGER;
    business_impact_score INTEGER;
    regulatory_impact_score INTEGER;
    maturity_gap_score INTEGER;
    total_score INTEGER;
BEGIN
    -- Severity scoring
    severity_score := CASE p_severity
        WHEN 'critical' THEN 25
        WHEN 'high' THEN 20
        WHEN 'medium' THEN 15
        WHEN 'low' THEN 10
        ELSE 10
    END;
    
    -- Likelihood scoring
    likelihood_score := CASE p_likelihood
        WHEN 'very_high' THEN 20
        WHEN 'high' THEN 16
        WHEN 'medium' THEN 12
        WHEN 'low' THEN 8
        WHEN 'very_low' THEN 4
        ELSE 12
    END;
    
    -- Business impact scoring
    business_impact_score := CASE p_business_impact
        WHEN 'very_high' THEN 20
        WHEN 'high' THEN 16
        WHEN 'medium' THEN 12
        WHEN 'low' THEN 8
        WHEN 'very_low' THEN 4
        ELSE 12
    END;
    
    -- Regulatory impact scoring
    regulatory_impact_score := CASE p_regulatory_impact
        WHEN 'very_high' THEN 20
        WHEN 'high' THEN 16
        WHEN 'medium' THEN 12
        WHEN 'low' THEN 8
        WHEN 'very_low' THEN 4
        ELSE 12
    END;
    
    -- Maturity gap scoring (larger gap = higher score)
    maturity_gap_score := (p_target_maturity - p_current_maturity) * 3;
    
    -- Calculate total score
    total_score := severity_score + likelihood_score + business_impact_score + regulatory_impact_score + maturity_gap_score;
    
    RETURN total_score;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically calculate priority score
CREATE OR REPLACE FUNCTION update_mica_gap_priority_score()
RETURNS TRIGGER AS $$
BEGIN
    NEW.priority_score := calculate_mica_gap_priority_score(
        NEW.severity,
        NEW.likelihood,
        NEW.business_impact,
        NEW.regulatory_impact,
        NEW.current_maturity_level,
        NEW.target_maturity_level
    );
    
    -- Calculate risk score (simplified version)
    NEW.risk_score := CASE NEW.severity
        WHEN 'critical' THEN 90 + (CASE NEW.likelihood WHEN 'very_high' THEN 10 WHEN 'high' THEN 8 ELSE 5 END)
        WHEN 'high' THEN 70 + (CASE NEW.likelihood WHEN 'very_high' THEN 10 WHEN 'high' THEN 8 ELSE 5 END)
        WHEN 'medium' THEN 50 + (CASE NEW.likelihood WHEN 'very_high' THEN 10 WHEN 'high' THEN 8 ELSE 5 END)
        ELSE 30 + (CASE NEW.likelihood WHEN 'very_high' THEN 10 WHEN 'high' THEN 8 ELSE 5 END)
    END;
    
    NEW.updated_at := NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_mica_gap_priority_score
    BEFORE INSERT OR UPDATE ON mica_gap_analysis_items
    FOR EACH ROW
    EXECUTE FUNCTION update_mica_gap_priority_score();

-- Add triggers for updated_at timestamps
CREATE TRIGGER trigger_update_mica_gap_analysis_updated_at
    BEFORE UPDATE ON mica_gap_analysis
    FOR EACH ROW
    EXECUTE FUNCTION update_mica_requirements_updated_at();

CREATE TRIGGER trigger_update_mica_gap_analysis_categories_updated_at
    BEFORE UPDATE ON mica_gap_analysis_categories
    FOR EACH ROW
    EXECUTE FUNCTION update_mica_requirements_updated_at();

COMMIT;
