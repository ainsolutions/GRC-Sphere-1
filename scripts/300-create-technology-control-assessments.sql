-- Create technology control assessments tables
-- This script creates proper relational tables for technology control assessments

-- Technology Control Assessments table
CREATE TABLE IF NOT EXISTS technology_control_assessments (
    id SERIAL PRIMARY KEY,
    assessment_id VARCHAR(50) UNIQUE NOT NULL,
    technology_risk_id UUID NOT NULL,
    assessment_name VARCHAR(255) NOT NULL,
    assessment_date DATE NOT NULL,
    assessor_name VARCHAR(255),
    assessor_email VARCHAR(255),
    status VARCHAR(50) DEFAULT 'draft' CHECK (status IN ('draft', 'in_progress', 'completed', 'approved', 'rejected')),
    overall_effectiveness_score INTEGER CHECK (overall_effectiveness_score >= 1 AND overall_effectiveness_score <= 5),
    total_controls INTEGER DEFAULT 0,
    implemented_controls INTEGER DEFAULT 0,
    partially_implemented_controls INTEGER DEFAULT 0,
    not_implemented_controls INTEGER DEFAULT 0,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(255),
    updated_by VARCHAR(255),
    
    CONSTRAINT fk_tech_risk FOREIGN KEY (technology_risk_id) REFERENCES technology_risks(id) ON DELETE CASCADE
);

-- Technology Control Assessment Items table
CREATE TABLE IF NOT EXISTS technology_control_assessment_items (
    id SERIAL PRIMARY KEY,
    assessment_id INTEGER NOT NULL,
    control_id VARCHAR(50) NOT NULL,
    control_name VARCHAR(255) NOT NULL,
    control_description TEXT,
    control_type VARCHAR(50) CHECK (control_type IN ('preventive', 'detective', 'corrective', 'compensating')),
    control_category VARCHAR(100),
    implementation_status VARCHAR(50) DEFAULT 'not_implemented' CHECK (implementation_status IN ('not_implemented', 'partially_implemented', 'fully_implemented', 'not_applicable')),
    effectiveness_rating INTEGER CHECK (effectiveness_rating >= 1 AND effectiveness_rating <= 5),
    testing_status VARCHAR(50) DEFAULT 'not_tested' CHECK (testing_status IN ('not_tested', 'scheduled', 'in_progress', 'passed', 'failed', 'not_applicable')),
    testing_frequency VARCHAR(50) CHECK (testing_frequency IN ('monthly', 'quarterly', 'semi_annually', 'annually', 'ad_hoc')),
    last_test_date DATE,
    next_test_date DATE,
    test_results TEXT,
    evidence_location TEXT,
    gaps_identified TEXT,
    recommendations TEXT,
    responsible_party VARCHAR(255),
    implementation_date DATE,
    target_completion_date DATE,
    compliance_frameworks TEXT[], -- Array of frameworks like ISO27001, NIST, SOC2, etc.
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_assessment FOREIGN KEY (assessment_id) REFERENCES technology_control_assessments(id) ON DELETE CASCADE
);

-- Technology Control Assessment Evidence table
CREATE TABLE IF NOT EXISTS technology_control_assessment_evidence (
    id SERIAL PRIMARY KEY,
    assessment_item_id INTEGER NOT NULL,
    evidence_id VARCHAR(50) UNIQUE NOT NULL,
    evidence_name VARCHAR(255) NOT NULL,
    evidence_type VARCHAR(50) CHECK (evidence_type IN ('document', 'screenshot', 'log_file', 'certificate', 'policy', 'procedure', 'other')),
    file_path VARCHAR(500),
    file_size BIGINT,
    file_hash VARCHAR(255),
    description TEXT,
    collection_date DATE,
    collected_by VARCHAR(255),
    verification_status VARCHAR(50) DEFAULT 'pending' CHECK (verification_status IN ('pending', 'verified', 'rejected', 'expired')),
    verified_by VARCHAR(255),
    verified_date DATE,
    expiry_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_assessment_item FOREIGN KEY (assessment_item_id) REFERENCES technology_control_assessment_items(id) ON DELETE CASCADE
);

-- Technology Risk Control Mapping table (many-to-many relationship)
CREATE TABLE IF NOT EXISTS technology_risk_control_mappings (
    id SERIAL PRIMARY KEY,
    technology_risk_id UUID NOT NULL,
    control_id VARCHAR(50) NOT NULL,
    control_name VARCHAR(255) NOT NULL,
    mapping_type VARCHAR(50) DEFAULT 'mitigates' CHECK (mapping_type IN ('mitigates', 'monitors', 'prevents', 'detects', 'responds')),
    effectiveness_contribution DECIMAL(5,2) CHECK (effectiveness_contribution >= 0 AND effectiveness_contribution <= 100),
    implementation_priority INTEGER CHECK (implementation_priority >= 1 AND implementation_priority <= 5),
    cost_estimate DECIMAL(15,2),
    implementation_effort VARCHAR(50) CHECK (implementation_effort IN ('low', 'medium', 'high', 'very_high')),
    business_justification TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_tech_risk_mapping FOREIGN KEY (technology_risk_id) REFERENCES technology_risks(id) ON DELETE CASCADE,
    UNIQUE(technology_risk_id, control_id)
);

-- Technology Control Assessment History table (for audit trail)
CREATE TABLE IF NOT EXISTS technology_control_assessment_history (
    id SERIAL PRIMARY KEY,
    assessment_id INTEGER NOT NULL,
    assessment_item_id INTEGER,
    field_changed VARCHAR(100) NOT NULL,
    old_value TEXT,
    new_value TEXT,
    change_reason TEXT,
    changed_by VARCHAR(255) NOT NULL,
    changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_assessment_history FOREIGN KEY (assessment_id) REFERENCES technology_control_assessments(id) ON DELETE CASCADE
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_tech_control_assessments_risk_id ON technology_control_assessments(technology_risk_id);
CREATE INDEX IF NOT EXISTS idx_tech_control_assessments_status ON technology_control_assessments(status);
CREATE INDEX IF NOT EXISTS idx_tech_control_assessments_date ON technology_control_assessments(assessment_date);

CREATE INDEX IF NOT EXISTS idx_tech_control_items_assessment_id ON technology_control_assessment_items(assessment_id);
CREATE INDEX IF NOT EXISTS idx_tech_control_items_control_id ON technology_control_assessment_items(control_id);
CREATE INDEX IF NOT EXISTS idx_tech_control_items_status ON technology_control_assessment_items(implementation_status);
CREATE INDEX IF NOT EXISTS idx_tech_control_items_effectiveness ON technology_control_assessment_items(effectiveness_rating);

CREATE INDEX IF NOT EXISTS idx_tech_control_evidence_item_id ON technology_control_assessment_evidence(assessment_item_id);
CREATE INDEX IF NOT EXISTS idx_tech_control_evidence_type ON technology_control_assessment_evidence(evidence_type);

CREATE INDEX IF NOT EXISTS idx_tech_risk_mappings_risk_id ON technology_risk_control_mappings(technology_risk_id);
CREATE INDEX IF NOT EXISTS idx_tech_risk_mappings_control_id ON technology_risk_control_mappings(control_id);

CREATE INDEX IF NOT EXISTS idx_tech_control_history_assessment_id ON technology_control_assessment_history(assessment_id);
CREATE INDEX IF NOT EXISTS idx_tech_control_history_changed_at ON technology_control_assessment_history(changed_at);

-- Add triggers for updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_tech_control_assessments_updated_at 
    BEFORE UPDATE ON technology_control_assessments 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tech_control_items_updated_at 
    BEFORE UPDATE ON technology_control_assessment_items 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tech_risk_mappings_updated_at 
    BEFORE UPDATE ON technology_risk_control_mappings 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
