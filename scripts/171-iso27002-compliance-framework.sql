-- ISO 27002:2022 Compliance Framework Tables

-- ISO 27002 Requirements table
CREATE TABLE IF NOT EXISTS iso27002_requirements (
    id SERIAL PRIMARY KEY,
    control_id VARCHAR(10) NOT NULL UNIQUE,
    category VARCHAR(100) NOT NULL,
    title VARCHAR(500) NOT NULL,
    description TEXT NOT NULL,
    requirement TEXT NOT NULL,
    implementation_guidance TEXT,
    control_type VARCHAR(50) NOT NULL DEFAULT 'preventive',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert ISO 27002:2022 control requirements
INSERT INTO iso27002_requirements (control_id, category, title, description, requirement, implementation_guidance, control_type) VALUES
('5.1', 'Organizational Controls', 'Information security policies', 'Information security policy and topic-specific policies should be defined, approved by management, published, communicated to and acknowledged by relevant personnel and relevant interested parties, and reviewed at planned intervals and if significant changes occur.', 'A set of policies for information security shall be defined, approved by management, published and communicated to employees and relevant external parties.', 'The organization shall establish, implement and maintain policies for information security.', 'preventive'),
('5.2', 'Organizational Controls', 'Information security roles and responsibilities', 'Information security roles and responsibilities should be defined and allocated according to the organization needs.', 'All information security responsibilities shall be defined and allocated.', 'Information security roles and responsibilities shall be defined, allocated to personnel and communicated.', 'preventive'),
('5.3', 'Organizational Controls', 'Segregation of duties', 'Conflicting duties and areas of responsibility should be segregated to reduce opportunities for unauthorized or unintentional modification or misuse of the organization''s assets.', 'Conflicting duties and areas of responsibility shall be segregated to reduce opportunities for unauthorized or unintentional modification or misuse of the organization''s assets.', 'The organization shall identify conflicting duties and areas of responsibility and take action to segregate them.', 'preventive'),
('6.1', 'People Controls', 'Screening', 'Background verification checks on all candidates for employment should be carried out in accordance with relevant laws, regulations and ethics and should be proportional to the business requirements, the classification of the information to be accessed and the perceived risks.', 'Background verification checks on all candidates for employment shall be carried out in accordance with relevant laws, regulations and ethics.', 'The organization shall define and implement a screening process for personnel.', 'preventive'),
('6.2', 'People Controls', 'Terms and conditions of employment', 'The contractual agreements with employees and contractors should state their and the organization''s responsibilities for information security.', 'The contractual agreements with employees and contractors shall state their and the organization''s responsibilities for information security.', 'Employment agreements shall include information security responsibilities and consequences of breaches.', 'preventive'),
('7.1', 'Physical Controls', 'Physical security perimeters', 'Physical security perimeters should be defined and used to protect areas that contain information and other associated assets.', 'Physical security perimeters shall be defined and used to protect areas that contain information and other associated assets.', 'The organization shall establish physical security perimeters to protect areas containing sensitive information and assets.', 'preventive'),
('7.2', 'Physical Controls', 'Physical entry', 'Secure areas should be protected by appropriate entry controls to ensure that only authorized personnel are allowed access.', 'Secure areas shall be protected by appropriate entry controls to ensure that only authorized personnel are allowed access.', 'The organization shall implement entry controls for secure areas.', 'preventive'),
('8.1', 'Technological Controls', 'User endpoint devices', 'Information stored on, processed by or accessible via user endpoint devices should be protected.', 'Information stored on, processed by or accessible via user endpoint devices shall be protected.', 'The organization shall implement controls to protect information on user endpoint devices.', 'preventive'),
('8.2', 'Technological Controls', 'Privileged access rights', 'The allocation and use of privileged access rights should be restricted and managed.', 'The allocation and use of privileged access rights shall be restricted and managed.', 'The organization shall implement controls for managing privileged access rights.', 'preventive'),
('8.3', 'Technological Controls', 'Information access restriction', 'Access to information and application system functions should be restricted in accordance with the access control policy.', 'Access to information and application system functions shall be restricted in accordance with the access control policy.', 'The organization shall implement access controls based on business requirements and information security policy.', 'preventive')
ON CONFLICT (control_id) DO NOTHING;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_iso27002_requirements_category ON iso27002_requirements(category);
CREATE INDEX IF NOT EXISTS idx_iso27002_requirements_control_type ON iso27002_requirements(control_type);

-- Update timestamp trigger
CREATE OR REPLACE FUNCTION update_iso27002_requirements_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_iso27002_requirements_updated_at
    BEFORE UPDATE ON iso27002_requirements
    FOR EACH ROW
    EXECUTE FUNCTION update_iso27002_requirements_updated_at();
