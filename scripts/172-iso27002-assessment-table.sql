-- ISO 27002 Assessments table
CREATE TABLE IF NOT EXISTS iso27002_assessments (
    id SERIAL PRIMARY KEY,
    assessment_id VARCHAR(50) NOT NULL UNIQUE,
    title VARCHAR(500) NOT NULL,
    description TEXT,
    status VARCHAR(50) NOT NULL DEFAULT 'planned',
    start_date DATE,
    end_date DATE,
    assessor VARCHAR(200),
    overall_score INTEGER DEFAULT 0,
    total_controls INTEGER DEFAULT 0,
    assessed_controls INTEGER DEFAULT 0,
    compliant_controls INTEGER DEFAULT 0,
    partially_compliant_controls INTEGER DEFAULT 0,
    non_compliant_controls INTEGER DEFAULT 0,
    not_assessed_controls INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT chk_iso27002_assessment_status CHECK (status IN ('planned', 'in_progress', 'completed', 'cancelled')),
    CONSTRAINT chk_iso27002_assessment_score CHECK (overall_score >= 0 AND overall_score <= 100)
);

-- ISO 27002 Assessment Results table
CREATE TABLE IF NOT EXISTS iso27002_assessment_results (
    id SERIAL PRIMARY KEY,
    assessment_id VARCHAR(50) NOT NULL,
    control_id VARCHAR(10) NOT NULL,
    response VARCHAR(50),
    evidence TEXT,
    score INTEGER DEFAULT 0,
    assessor_notes TEXT,
    status VARCHAR(50) DEFAULT 'not_started',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (assessment_id) REFERENCES iso27002_assessments(assessment_id) ON DELETE CASCADE,
    FOREIGN KEY (control_id) REFERENCES iso27002_requirements(control_id),
    CONSTRAINT chk_iso27002_result_response CHECK (response IN ('compliant', 'partially_compliant', 'non_compliant', 'not_applicable')),
    CONSTRAINT chk_iso27002_result_score CHECK (score >= 0 AND score <= 100),
    CONSTRAINT chk_iso27002_result_status CHECK (status IN ('not_started', 'in_progress', 'completed'))
);

-- Insert sample ISO 27002 assessment
INSERT INTO iso27002_assessments (
    assessment_id, title, description, status, start_date, end_date, assessor,
    overall_score, total_controls, assessed_controls, compliant_controls,
    partially_compliant_controls, non_compliant_controls, not_assessed_controls
) VALUES (
    'iso27002-2024-001',
    'ISO 27002:2022 Annual Assessment',
    'Comprehensive assessment of information security controls based on ISO 27002:2022',
    'in_progress',
    '2024-11-01',
    '2024-12-31',
    'Security Team',
    78,
    93,
    65,
    51,
    14,
    0,
    28
) ON CONFLICT (assessment_id) DO NOTHING;

-- Insert sample assessment results
INSERT INTO iso27002_assessment_results (assessment_id, control_id, response, evidence, score, status) VALUES
('iso27002-2024-001', '5.1', 'compliant', 'Information security policy framework established and approved by board', 95, 'completed'),
('iso27002-2024-001', '5.2', 'partially_compliant', 'Roles defined but some responsibilities need clarification', 75, 'in_progress'),
('iso27002-2024-001', '5.3', 'non_compliant', 'Segregation of duties analysis in progress, gaps identified', 60, 'in_progress'),
('iso27002-2024-001', '6.1', 'compliant', 'Background screening process implemented for all employees', 90, 'completed'),
('iso27002-2024-001', '6.2', 'partially_compliant', 'Employment contracts updated, contractor agreements pending', 80, 'in_progress'),
('iso27002-2024-001', '7.1', 'compliant', 'Physical security perimeters established with access controls', 100, 'completed'),
('iso27002-2024-001', '7.2', 'compliant', 'Badge access system implemented with monitoring', 95, 'completed'),
('iso27002-2024-001', '8.1', '', '', 0, 'not_started'),
('iso27002-2024-001', '8.2', 'partially_compliant', 'Privileged access management system deployed, policies being refined', 70, 'in_progress'),
('iso27002-2024-001', '8.3', 'compliant', 'Role-based access control implemented across systems', 85, 'completed')
ON CONFLICT DO NOTHING;

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_iso27002_assessments_status ON iso27002_assessments(status);
CREATE INDEX IF NOT EXISTS idx_iso27002_assessments_start_date ON iso27002_assessments(start_date);
CREATE INDEX IF NOT EXISTS idx_iso27002_assessment_results_assessment_id ON iso27002_assessment_results(assessment_id);
CREATE INDEX IF NOT EXISTS idx_iso27002_assessment_results_control_id ON iso27002_assessment_results(control_id);
CREATE INDEX IF NOT EXISTS idx_iso27002_assessment_results_response ON iso27002_assessment_results(response);

-- Update timestamp triggers
CREATE OR REPLACE FUNCTION update_iso27002_assessments_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_iso27002_assessments_updated_at
    BEFORE UPDATE ON iso27002_assessments
    FOR EACH ROW
    EXECUTE FUNCTION update_iso27002_assessments_updated_at();

CREATE OR REPLACE FUNCTION update_iso27002_assessment_results_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_iso27002_assessment_results_updated_at
    BEFORE UPDATE ON iso27002_assessment_results
    FOR EACH ROW
    EXECUTE FUNCTION update_iso27002_assessment_results_updated_at();
