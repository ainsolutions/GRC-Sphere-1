-- Comprehensive Audit Management Database Schema
-- This script creates all necessary tables for audit management modules

-- Create audit management schema
CREATE SCHEMA IF NOT EXISTS org_mashreqbank;

-- 1. AUDIT UNIVERSE MODULE
-- Audit Universe - Master list of all auditable entities
CREATE TABLE IF NOT EXISTS org_mashreqbank.audit_universe (
    id SERIAL PRIMARY KEY,
    entity_id VARCHAR(100) UNIQUE NOT NULL,
    entity_name VARCHAR(500) NOT NULL,
    entity_type VARCHAR(100) NOT NULL, -- 'process', 'system', 'location', 'department', 'vendor'
    entity_category VARCHAR(100) NOT NULL, -- 'financial', 'operational', 'compliance', 'it', 'security'
    description TEXT,
    owner_department VARCHAR(255),
    owner_name VARCHAR(255),
    owner_email VARCHAR(255),
    risk_rating VARCHAR(20) DEFAULT 'medium', -- 'low', 'medium', 'high', 'critical'
    last_audit_date DATE,
    next_audit_due_date DATE,
    audit_frequency VARCHAR(50) DEFAULT 'annual', -- 'quarterly', 'semi-annual', 'annual', 'bi-annual'
    regulatory_requirements TEXT[], -- Array of applicable regulations
    business_criticality VARCHAR(20) DEFAULT 'medium', -- 'low', 'medium', 'high', 'critical'
    materiality_score INTEGER DEFAULT 5, -- 1-10 scale
    inherent_risk_score INTEGER DEFAULT 5, -- 1-10 scale
    control_environment_score INTEGER DEFAULT 5, -- 1-10 scale
    status VARCHAR(50) DEFAULT 'active', -- 'active', 'inactive', 'archived'
    tags TEXT[],
    metadata JSONB,
    created_by VARCHAR(255) DEFAULT 'System',
    updated_by VARCHAR(255) DEFAULT 'System',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Audit Universe Dependencies
CREATE TABLE IF NOT EXISTS org_mashreqbank.audit_universe_dependencies (
    id SERIAL PRIMARY KEY,
    parent_entity_id VARCHAR(100) NOT NULL REFERENCES org_mashreqbank.audit_universe(entity_id),
    dependent_entity_id VARCHAR(100) NOT NULL REFERENCES org_mashreqbank.audit_universe(entity_id),
    dependency_type VARCHAR(50) NOT NULL, -- 'upstream', 'downstream', 'interdependent'
    dependency_strength VARCHAR(20) DEFAULT 'medium', -- 'weak', 'medium', 'strong'
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(parent_entity_id, dependent_entity_id)
);

-- 2. AUDIT PLANNING MODULE
-- Annual Audit Plans
CREATE TABLE IF NOT EXISTS org_mashreqbank.annual_audit_plans (
    id SERIAL PRIMARY KEY,
    plan_year INTEGER NOT NULL,
    plan_name VARCHAR(255) NOT NULL,
    plan_status VARCHAR(50) DEFAULT 'draft', -- 'draft', 'approved', 'in-progress', 'completed', 'cancelled'
    plan_description TEXT,
    total_budget DECIMAL(12,2) DEFAULT 0,
    allocated_budget DECIMAL(12,2) DEFAULT 0,
    total_hours INTEGER DEFAULT 0,
    allocated_hours INTEGER DEFAULT 0,
    risk_focus_areas TEXT[],
    regulatory_priorities TEXT[],
    strategic_objectives TEXT[],
    approval_status VARCHAR(50) DEFAULT 'pending',
    approved_by VARCHAR(255),
    approval_date DATE,
    created_by VARCHAR(255) DEFAULT 'System',
    updated_by VARCHAR(255) DEFAULT 'System',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(plan_year)
);

-- Individual Audit Engagements
CREATE TABLE IF NOT EXISTS org_mashreqbank.audit_engagements (
    id SERIAL PRIMARY KEY,
    engagement_id VARCHAR(100) UNIQUE NOT NULL,
    annual_plan_id INTEGER REFERENCES org_mashreqbank.annual_audit_plans(id),
    entity_id VARCHAR(100) REFERENCES org_mashreqbank.audit_universe(entity_id),
    engagement_name VARCHAR(500) NOT NULL,
    engagement_type VARCHAR(100) NOT NULL, -- 'financial', 'operational', 'compliance', 'it', 'special'
    audit_scope TEXT NOT NULL,
    audit_objectives TEXT[],
    risk_assessment TEXT,
    planned_start_date DATE,
    planned_end_date DATE,
    actual_start_date DATE,
    actual_end_date DATE,
    planned_hours INTEGER DEFAULT 0,
    actual_hours INTEGER DEFAULT 0,
    planned_budget DECIMAL(12,2) DEFAULT 0,
    actual_budget DECIMAL(12,2) DEFAULT 0,
    engagement_status VARCHAR(50) DEFAULT 'planned', -- 'planned', 'in-progress', 'fieldwork', 'reporting', 'completed', 'cancelled'
    priority VARCHAR(20) DEFAULT 'medium', -- 'low', 'medium', 'high', 'critical'
    complexity VARCHAR(20) DEFAULT 'medium', -- 'low', 'medium', 'high'
    team_lead VARCHAR(255),
    team_lead_email VARCHAR(255),
    audit_team TEXT[], -- Array of auditor names/emails
    stakeholders TEXT[], -- Array of stakeholder names/emails
    deliverables TEXT[],
    methodology TEXT,
    tools_used TEXT[],
    created_by VARCHAR(255) DEFAULT 'System',
    updated_by VARCHAR(255) DEFAULT 'System',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Audit Schedule
CREATE TABLE IF NOT EXISTS org_mashreqbank.audit_schedule (
    id SERIAL PRIMARY KEY,
    engagement_id VARCHAR(100) REFERENCES org_mashreqbank.audit_engagements(engagement_id),
    phase VARCHAR(100) NOT NULL, -- 'planning', 'fieldwork', 'reporting', 'follow-up'
    phase_name VARCHAR(255) NOT NULL,
    planned_start_date DATE,
    planned_end_date DATE,
    actual_start_date DATE,
    actual_end_date DATE,
    responsible_auditor VARCHAR(255),
    deliverables TEXT[],
    status VARCHAR(50) DEFAULT 'planned', -- 'planned', 'in-progress', 'completed', 'delayed'
    dependencies TEXT[],
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. RISK & CONTROL REPOSITORY MODULE
-- Control Library
CREATE TABLE IF NOT EXISTS org_mashreqbank.control_library (
    id SERIAL PRIMARY KEY,
    control_id VARCHAR(100) UNIQUE NOT NULL,
    control_name VARCHAR(500) NOT NULL,
    control_category VARCHAR(100) NOT NULL, -- 'preventive', 'detective', 'corrective', 'compensating'
    control_type VARCHAR(100) NOT NULL, -- 'manual', 'automated', 'hybrid'
    control_family VARCHAR(100) NOT NULL, -- 'access_control', 'data_protection', 'change_management', etc.
    description TEXT NOT NULL,
    control_objective TEXT NOT NULL,
    control_activities TEXT[],
    applicable_frameworks TEXT[], -- 'COSO', 'COBIT', 'ISO27001', 'NIST', etc.
    regulatory_mappings TEXT[], -- Applicable regulations
    risk_categories TEXT[], -- Risks this control addresses
    control_owner VARCHAR(255),
    control_owner_email VARCHAR(255),
    implementation_status VARCHAR(50) DEFAULT 'not-implemented', -- 'not-implemented', 'partially-implemented', 'fully-implemented'
    effectiveness_rating VARCHAR(20) DEFAULT 'unknown', -- 'ineffective', 'partially-effective', 'effective', 'unknown'
    last_review_date DATE,
    next_review_date DATE,
    testing_frequency VARCHAR(50) DEFAULT 'annual', -- 'quarterly', 'semi-annual', 'annual'
    testing_method VARCHAR(100), -- 'inquiry', 'observation', 'inspection', 'reperformance', 'analytical'
    control_design VARCHAR(20) DEFAULT 'unknown', -- 'effective', 'ineffective', 'unknown'
    control_operation VARCHAR(20) DEFAULT 'unknown', -- 'effective', 'ineffective', 'unknown'
    documentation_location TEXT,
    related_controls TEXT[], -- Array of related control IDs
    tags TEXT[],
    metadata JSONB,
    created_by VARCHAR(255) DEFAULT 'System',
    updated_by VARCHAR(255) DEFAULT 'System',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Risk-Control Mappings
CREATE TABLE IF NOT EXISTS org_mashreqbank.risk_control_mappings_audit_audit (
    id SERIAL PRIMARY KEY,
    risk_id VARCHAR(100) NOT NULL, -- References risk management system
    control_id VARCHAR(100) REFERENCES org_mashreqbank.control_library(control_id),
    mapping_type VARCHAR(50) NOT NULL, -- 'mitigates', 'monitors', 'prevents'
    effectiveness_rating VARCHAR(20) DEFAULT 'unknown', -- 'high', 'medium', 'low', 'unknown'
    coverage_percentage INTEGER DEFAULT 0, -- 0-100%
    residual_risk_level VARCHAR(20), -- 'low', 'medium', 'high', 'critical'
    last_assessment_date DATE,
    next_assessment_date DATE,
    assessment_notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(risk_id, control_id)
);

-- 4. CONTROLS TESTING MODULE
-- Control Testing Plans
CREATE TABLE IF NOT EXISTS org_mashreqbank.control_testing_plans (
    id SERIAL PRIMARY KEY,
    plan_id VARCHAR(100) UNIQUE NOT NULL,
    engagement_id VARCHAR(100) REFERENCES org_mashreqbank.audit_engagements(engagement_id),
    plan_name VARCHAR(500) NOT NULL,
    testing_period_start DATE,
    testing_period_end DATE,
    plan_status VARCHAR(50) DEFAULT 'draft', -- 'draft', 'approved', 'in-progress', 'completed'
    testing_objective TEXT,
    sampling_methodology TEXT,
    sample_size INTEGER,
    population_size INTEGER,
    confidence_level DECIMAL(5,2) DEFAULT 95.00,
    tolerable_error_rate DECIMAL(5,2) DEFAULT 5.00,
    expected_error_rate DECIMAL(5,2) DEFAULT 2.00,
    testing_approach TEXT,
    deliverables TEXT[],
    approval_status VARCHAR(50) DEFAULT 'pending',
    approved_by VARCHAR(255),
    approval_date DATE,
    created_by VARCHAR(255) DEFAULT 'System',
    updated_by VARCHAR(255) DEFAULT 'System',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Control Testing Procedures
CREATE TABLE IF NOT EXISTS org_mashreqbank.control_testing_procedures (
    id SERIAL PRIMARY KEY,
    procedure_id VARCHAR(100) UNIQUE NOT NULL,
    plan_id VARCHAR(100) REFERENCES org_mashreqbank.control_testing_plans(plan_id),
    control_id VARCHAR(100) REFERENCES org_mashreqbank.control_library(control_id),
    procedure_name VARCHAR(500) NOT NULL,
    procedure_description TEXT NOT NULL,
    testing_method VARCHAR(100) NOT NULL, -- 'inquiry', 'observation', 'inspection', 'reperformance', 'analytical'
    testing_steps TEXT[],
    expected_results TEXT,
    acceptance_criteria TEXT,
    sample_size INTEGER,
    population_size INTEGER,
    sampling_method VARCHAR(100),
    testing_frequency VARCHAR(50),
    responsible_auditor VARCHAR(255),
    planned_start_date DATE,
    planned_end_date DATE,
    actual_start_date DATE,
    actual_end_date DATE,
    procedure_status VARCHAR(50) DEFAULT 'planned', -- 'planned', 'in-progress', 'completed', 'cancelled'
    testing_notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Control Testing Results
CREATE TABLE IF NOT EXISTS org_mashreqbank.control_testing_results (
    id SERIAL PRIMARY KEY,
    result_id VARCHAR(100) UNIQUE NOT NULL,
    procedure_id VARCHAR(100) REFERENCES org_mashreqbank.control_testing_procedures(procedure_id),
    test_date DATE NOT NULL,
    tested_by VARCHAR(255) NOT NULL,
    test_result VARCHAR(50) NOT NULL, -- 'effective', 'ineffective', 'partially-effective', 'not-tested'
    exceptions_found INTEGER DEFAULT 0,
    exceptions_description TEXT,
    root_cause_analysis TEXT,
    management_response TEXT,
    remediation_plan TEXT,
    remediation_timeline DATE,
    follow_up_required BOOLEAN DEFAULT FALSE,
    follow_up_date DATE,
    testing_notes TEXT,
    conclusion TEXT,
    recommendations TEXT[],
    risk_implications TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Control Testing Evidence
CREATE TABLE IF NOT EXISTS org_mashreqbank.control_testing_evidence (
    id SERIAL PRIMARY KEY,
    evidence_id VARCHAR(100) UNIQUE NOT NULL,
    result_id VARCHAR(100) REFERENCES org_mashreqbank.control_testing_results(result_id),
    evidence_type VARCHAR(100) NOT NULL, -- 'document', 'screenshot', 'email', 'report', 'interview_notes'
    evidence_name VARCHAR(500) NOT NULL,
    evidence_description TEXT,
    file_path TEXT,
    file_size BIGINT,
    file_type VARCHAR(100),
    upload_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    uploaded_by VARCHAR(255),
    evidence_source VARCHAR(255), -- Where the evidence was obtained
    reliability_rating VARCHAR(20) DEFAULT 'medium', -- 'high', 'medium', 'low'
    relevance_rating VARCHAR(20) DEFAULT 'medium', -- 'high', 'medium', 'low'
    sufficiency_rating VARCHAR(20) DEFAULT 'medium', -- 'high', 'medium', 'low'
    confidentiality_level VARCHAR(20) DEFAULT 'internal', -- 'public', 'internal', 'confidential', 'restricted'
    retention_period INTEGER DEFAULT 7, -- Years
    tags TEXT[],
    metadata JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 5. REPORTING MODULE
-- Audit Reports
CREATE TABLE IF NOT EXISTS org_mashreqbank.audit_reports (
    id SERIAL PRIMARY KEY,
    report_id VARCHAR(100) UNIQUE NOT NULL,
    engagement_id VARCHAR(100) REFERENCES org_mashreqbank.audit_engagements(engagement_id),
    report_title VARCHAR(500) NOT NULL,
    report_type VARCHAR(100) NOT NULL, -- 'executive_summary', 'detailed_report', 'interim_report', 'final_report'
    report_status VARCHAR(50) DEFAULT 'draft', -- 'draft', 'review', 'approved', 'issued', 'archived'
    report_period_start DATE,
    report_period_end DATE,
    report_date DATE DEFAULT CURRENT_DATE,
    executive_summary TEXT,
    scope_and_objectives TEXT,
    methodology TEXT,
    key_findings TEXT[],
    recommendations TEXT[],
    management_response TEXT,
    overall_conclusion TEXT,
    risk_assessment TEXT,
    compliance_status TEXT,
    next_steps TEXT,
    distribution_list TEXT[],
    confidentiality_level VARCHAR(20) DEFAULT 'internal',
    version VARCHAR(20) DEFAULT '1.0',
    previous_version_id VARCHAR(100),
    approval_status VARCHAR(50) DEFAULT 'pending',
    approved_by VARCHAR(255),
    approval_date DATE,
    issued_by VARCHAR(255),
    issued_date DATE,
    created_by VARCHAR(255) DEFAULT 'System',
    updated_by VARCHAR(255) DEFAULT 'System',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Audit Findings
CREATE TABLE IF NOT EXISTS org_mashreqbank.audit_findings (
    id SERIAL PRIMARY KEY,
    finding_id VARCHAR(100) UNIQUE NOT NULL,
    report_id VARCHAR(100) REFERENCES org_mashreqbank.audit_reports(report_id),
    finding_title VARCHAR(500) NOT NULL,
    finding_description TEXT NOT NULL,
    finding_category VARCHAR(100) NOT NULL, -- 'control_deficiency', 'compliance_violation', 'process_weakness', 'system_vulnerability'
    risk_level VARCHAR(20) NOT NULL, -- 'low', 'medium', 'high', 'critical'
    impact_assessment TEXT,
    root_cause TEXT,
    affected_controls TEXT[],
    affected_processes TEXT[],
    affected_systems TEXT[],
    regulatory_implications TEXT[],
    business_impact TEXT,
    recommendation TEXT NOT NULL,
    management_response TEXT,
    remediation_plan TEXT,
    remediation_timeline DATE,
    responsible_party VARCHAR(255),
    status VARCHAR(50) DEFAULT 'open', -- 'open', 'in-progress', 'resolved', 'closed', 'cancelled'
    priority VARCHAR(20) DEFAULT 'medium', -- 'low', 'medium', 'high', 'critical'
    evidence_references TEXT[],
    follow_up_required BOOLEAN DEFAULT TRUE,
    follow_up_date DATE,
    closure_criteria TEXT,
    closure_evidence TEXT,
    closed_by VARCHAR(255),
    closed_date DATE,
    created_by VARCHAR(255) DEFAULT 'System',
    updated_by VARCHAR(255) DEFAULT 'System',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Report Templates
CREATE TABLE IF NOT EXISTS org_mashreqbank.report_templates (
    id SERIAL PRIMARY KEY,
    template_id VARCHAR(100) UNIQUE NOT NULL,
    template_name VARCHAR(500) NOT NULL,
    template_type VARCHAR(100) NOT NULL, -- 'executive_summary', 'detailed_report', 'interim_report', 'finding_report'
    template_description TEXT,
    template_content TEXT NOT NULL, -- HTML/Markdown content
    template_styles TEXT, -- CSS styles
    template_variables TEXT[], -- Available template variables
    default_settings JSONB,
    is_active BOOLEAN DEFAULT TRUE,
    version VARCHAR(20) DEFAULT '1.0',
    created_by VARCHAR(255) DEFAULT 'System',
    updated_by VARCHAR(255) DEFAULT 'System',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_audit_universe_entity_type ON org_mashreqbank.audit_universe(entity_type);
CREATE INDEX IF NOT EXISTS idx_audit_universe_category ON org_mashreqbank.audit_universe(entity_category);
CREATE INDEX IF NOT EXISTS idx_audit_universe_status ON org_mashreqbank.audit_universe(status);
CREATE INDEX IF NOT EXISTS idx_audit_universe_next_audit ON org_mashreqbank.audit_universe(next_audit_due_date);

CREATE INDEX IF NOT EXISTS idx_annual_plans_year ON org_mashreqbank.annual_audit_plans(plan_year);
CREATE INDEX IF NOT EXISTS idx_annual_plans_status ON org_mashreqbank.annual_audit_plans(plan_status);

CREATE INDEX IF NOT EXISTS idx_engagements_plan ON org_mashreqbank.audit_engagements(annual_plan_id);
CREATE INDEX IF NOT EXISTS idx_engagements_entity ON org_mashreqbank.audit_engagements(entity_id);
CREATE INDEX IF NOT EXISTS idx_engagements_status ON org_mashreqbank.audit_engagements(engagement_status);
CREATE INDEX IF NOT EXISTS idx_engagements_dates ON org_mashreqbank.audit_engagements(planned_start_date, planned_end_date);

CREATE INDEX IF NOT EXISTS idx_control_library_category ON org_mashreqbank.control_library(control_category);
CREATE INDEX IF NOT EXISTS idx_control_library_family ON org_mashreqbank.control_library(control_family);
CREATE INDEX IF NOT EXISTS idx_control_library_status ON org_mashreqbank.control_library(implementation_status);

CREATE INDEX IF NOT EXISTS idx_testing_results_procedure ON org_mashreqbank.control_testing_results(procedure_id);
CREATE INDEX IF NOT EXISTS idx_testing_results_date ON org_mashreqbank.control_testing_results(test_date);
CREATE INDEX IF NOT EXISTS idx_testing_results_result ON org_mashreqbank.control_testing_results(test_result);

CREATE INDEX IF NOT EXISTS idx_evidence_result ON org_mashreqbank.control_testing_evidence(result_id);
CREATE INDEX IF NOT EXISTS idx_evidence_type ON org_mashreqbank.control_testing_evidence(evidence_type);
CREATE INDEX IF NOT EXISTS idx_evidence_upload_date ON org_mashreqbank.control_testing_evidence(upload_date);

CREATE INDEX IF NOT EXISTS idx_reports_engagement ON org_mashreqbank.audit_reports(engagement_id);
CREATE INDEX IF NOT EXISTS idx_reports_status ON org_mashreqbank.audit_reports(report_status);
CREATE INDEX IF NOT EXISTS idx_reports_date ON org_mashreqbank.audit_reports(report_date);

CREATE INDEX IF NOT EXISTS idx_findings_report ON org_mashreqbank.audit_findings(report_id);
CREATE INDEX IF NOT EXISTS idx_findings_status ON org_mashreqbank.audit_findings(status);
CREATE INDEX IF NOT EXISTS idx_findings_risk_level ON org_mashreqbank.audit_findings(risk_level);

-- Add comments for documentation
COMMENT ON SCHEMA org_mashreqbank IS 'Comprehensive audit management system schema';
COMMENT ON TABLE org_mashreqbank.audit_universe IS 'Master list of all auditable entities in the organization';
COMMENT ON TABLE org_mashreqbank.annual_audit_plans IS 'Annual audit planning and budgeting';
COMMENT ON TABLE org_mashreqbank.audit_engagements IS 'Individual audit engagements and projects';
COMMENT ON TABLE org_mashreqbank.control_library IS 'Central repository of all controls';
COMMENT ON TABLE org_mashreqbank.control_testing_results IS 'Results of control testing activities';
COMMENT ON TABLE org_mashreqbank.audit_reports IS 'Audit reports and documentation';
COMMENT ON TABLE org_mashreqbank.audit_findings IS 'Audit findings and recommendations';
