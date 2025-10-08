-- Ensure HIPAA assessment results table exists
DO $$
BEGIN
    -- Check if hipaa_assessment_results table exists
    IF NOT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'hipaa_assessment_results') THEN
        RAISE NOTICE 'Creating hipaa_assessment_results table...';
        
        CREATE TABLE hipaa_assessment_results (
            id SERIAL PRIMARY KEY,
            assessment_id INTEGER NOT NULL,
            requirement_id INTEGER NOT NULL,
            compliance_status VARCHAR(50) DEFAULT 'not-assessed',
            implementation_status VARCHAR(50) DEFAULT 'not-implemented',
            evidence_provided TEXT,
            gaps_identified TEXT,
            remediation_required TEXT,
            risk_rating VARCHAR(20) DEFAULT 'medium',
            comments TEXT,
            assessor_notes TEXT,
            last_reviewed_date TIMESTAMP,
            next_review_date DATE,
            responsible_party VARCHAR(200),
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            created_by VARCHAR(100),
            updated_by VARCHAR(100),
            UNIQUE(assessment_id, requirement_id)
        );
        
        -- Add foreign key constraints if the referenced tables exist
        IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'hipaa_assessments') THEN
            ALTER TABLE hipaa_assessment_results 
            ADD CONSTRAINT fk_hipaa_assessment_results_assessment 
            FOREIGN KEY (assessment_id) REFERENCES hipaa_assessments(id) ON DELETE CASCADE;
        END IF;
        
        IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'hipaa_requirements') THEN
            ALTER TABLE hipaa_assessment_results 
            ADD CONSTRAINT fk_hipaa_assessment_results_requirement 
            FOREIGN KEY (requirement_id) REFERENCES hipaa_requirements(id) ON DELETE CASCADE;
        END IF;
        
        RAISE NOTICE 'HIPAA assessment results table created successfully';
    ELSE
        RAISE NOTICE 'HIPAA assessment results table already exists';
    END IF;
END $$;
