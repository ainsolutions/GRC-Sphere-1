-- Information Assets Table
CREATE TABLE information_assets (
    id SERIAL PRIMARY KEY,
    asset_name VARCHAR(255) NOT NULL,
    asset_type VARCHAR(100) NOT NULL,
    classification VARCHAR(50) NOT NULL,
    owner VARCHAR(255) NOT NULL,
    custodian VARCHAR(255),
    location VARCHAR(255),
    description TEXT,
    business_value VARCHAR(50),
    confidentiality_level VARCHAR(50),
    integrity_level VARCHAR(50),
    availability_level VARCHAR(50),
    retention_period INTEGER,
    disposal_method VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Risk Categories Table
CREATE TABLE risk_categories (
    id SERIAL PRIMARY KEY,
    category_name VARCHAR(255) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Risks Table
CREATE TABLE risks (
    id SERIAL PRIMARY KEY,
    risk_id VARCHAR(50) UNIQUE NOT NULL,
    risk_title VARCHAR(255) NOT NULL,
    risk_description TEXT NOT NULL,
    category_id INTEGER REFERENCES risk_categories(id),
    asset_id INTEGER REFERENCES information_assets(id),
    threat_source VARCHAR(255),
    vulnerability VARCHAR(255),
    likelihood_score INTEGER CHECK (likelihood_score BETWEEN 1 AND 5),
    impact_score INTEGER CHECK (impact_score BETWEEN 1 AND 5),
    inherent_risk_score INTEGER,
    risk_owner VARCHAR(255),
    risk_status VARCHAR(50) DEFAULT 'Open',
    identified_date DATE,
    last_review_date DATE,
    next_review_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Controls Table
CREATE TABLE controls (
    id SERIAL PRIMARY KEY,
    control_id VARCHAR(50) UNIQUE NOT NULL,
    control_name VARCHAR(255) NOT NULL,
    control_description TEXT,
    control_type VARCHAR(100),
    control_category VARCHAR(100),
    iso27001_reference VARCHAR(100),
    implementation_status VARCHAR(50),
    effectiveness_rating VARCHAR(50),
    control_owner VARCHAR(255),
    implementation_date DATE,
    last_test_date DATE,
    next_test_date DATE,
    testing_frequency VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Risk Control Mapping Table
CREATE TABLE risk_controls (
    id SERIAL PRIMARY KEY,
    risk_id INTEGER REFERENCES risks(id),
    control_id INTEGER REFERENCES controls(id),
    mitigation_effectiveness VARCHAR(50),
    residual_likelihood INTEGER CHECK (residual_likelihood BETWEEN 1 AND 5),
    residual_impact INTEGER CHECK (residual_impact BETWEEN 1 AND 5),
    residual_risk_score INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Incidents Table
CREATE TABLE incidents (
    id SERIAL PRIMARY KEY,
    incident_id VARCHAR(50) UNIQUE NOT NULL,
    incident_title VARCHAR(255) NOT NULL,
    incident_description TEXT,
    incident_type VARCHAR(100),
    severity VARCHAR(50),
    status VARCHAR(50) DEFAULT 'Open',
    reported_by VARCHAR(255),
    assigned_to VARCHAR(255),
    reported_date TIMESTAMP,
    detected_date TIMESTAMP,
    resolved_date TIMESTAMP,
    root_cause TEXT,
    impact_assessment TEXT,
    lessons_learned TEXT,
    related_asset_id INTEGER REFERENCES information_assets(id),
    related_risk_id INTEGER REFERENCES risks(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Cybersecurity Assessments Table
CREATE TABLE cybersecurity_assessments (
    id SERIAL PRIMARY KEY,
    assessment_id VARCHAR(50) UNIQUE NOT NULL,
    assessment_name VARCHAR(255) NOT NULL,
    assessment_type VARCHAR(100),
    scope TEXT,
    methodology VARCHAR(255),
    assessor VARCHAR(255),
    start_date DATE,
    end_date DATE,
    status VARCHAR(50),
    overall_score INTEGER,
    maturity_level VARCHAR(50),
    executive_summary TEXT,
    recommendations TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Assessment Findings Table
CREATE TABLE assessment_findings (
    id SERIAL PRIMARY KEY,
    assessment_id INTEGER REFERENCES cybersecurity_assessments(id),
    finding_title VARCHAR(255) NOT NULL,
    finding_description TEXT,
    severity VARCHAR(50),
    category VARCHAR(100),
    recommendation TEXT,
    status VARCHAR(50) DEFAULT 'Open',
    due_date DATE,
    assigned_to VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Compliance Frameworks Table
CREATE TABLE compliance_frameworks (
    id SERIAL PRIMARY KEY,
    framework_name VARCHAR(255) NOT NULL,
    version VARCHAR(50),
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Compliance Requirements Table
CREATE TABLE compliance_requirements (
    id SERIAL PRIMARY KEY,
    framework_id INTEGER REFERENCES compliance_frameworks(id),
    requirement_id VARCHAR(100),
    requirement_title VARCHAR(255),
    requirement_description TEXT,
    compliance_status VARCHAR(50),
    evidence TEXT,
    last_assessment_date DATE,
    next_assessment_date DATE,
    responsible_party VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
