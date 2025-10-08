-- Create contract management tables
CREATE TABLE IF NOT EXISTS contracts (
    id SERIAL PRIMARY KEY,
    contract_number VARCHAR(50) UNIQUE NOT NULL,
    contract_name VARCHAR(255) NOT NULL,
    vendor_id INTEGER REFERENCES vendors(id) ON DELETE CASCADE,
    vendor_name VARCHAR(255) NOT NULL,
    contract_type VARCHAR(100) NOT NULL,
    contract_status VARCHAR(50) DEFAULT 'Draft' CHECK (contract_status IN ('Draft', 'Active', 'Expired', 'Terminated', 'Renewed')),
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    renewal_date DATE,
    contract_value DECIMAL(15,2),
    currency VARCHAR(10) DEFAULT 'USD',
    payment_terms TEXT,
    billing_frequency VARCHAR(50),
    risk_rating VARCHAR(20) DEFAULT 'Medium' CHECK (risk_rating IN ('Low', 'Medium', 'High', 'Critical')),
    compliance_requirements TEXT,
    sla_requirements TEXT,
    contract_owner VARCHAR(255),
    business_unit VARCHAR(255),
    description TEXT,
    tags TEXT,
    is_critical BOOLEAN DEFAULT FALSE,
    auto_renewal BOOLEAN DEFAULT FALSE,
    renewal_notice_period INTEGER DEFAULT 30,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(255),
    updated_by VARCHAR(255)
);

-- Create contract amendments table
CREATE TABLE IF NOT EXISTS contract_amendments (
    id SERIAL PRIMARY KEY,
    contract_id INTEGER REFERENCES contracts(id) ON DELETE CASCADE,
    amendment_number VARCHAR(50) NOT NULL,
    amendment_date DATE NOT NULL,
    amendment_type VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    old_value TEXT,
    new_value TEXT,
    financial_impact DECIMAL(15,2),
    approval_status VARCHAR(50) DEFAULT 'Pending' CHECK (approval_status IN ('Pending', 'Approved', 'Rejected')),
    approved_by VARCHAR(255),
    approved_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(255)
);

-- Create contract renewals table
CREATE TABLE IF NOT EXISTS contract_renewals (
    id SERIAL PRIMARY KEY,
    contract_id INTEGER REFERENCES contracts(id) ON DELETE CASCADE,
    renewal_date DATE NOT NULL,
    new_end_date DATE NOT NULL,
    renewal_value DECIMAL(15,2),
    renewal_terms TEXT,
    approval_status VARCHAR(50) DEFAULT 'Pending' CHECK (approval_status IN ('Pending', 'Approved', 'Rejected')),
    approved_by VARCHAR(255),
    approved_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(255)
);

-- Create contract notifications table
CREATE TABLE IF NOT EXISTS contract_notifications (
    id SERIAL PRIMARY KEY,
    contract_id INTEGER REFERENCES contracts(id) ON DELETE CASCADE,
    notification_type VARCHAR(100) NOT NULL,
    notification_date DATE NOT NULL,
    message TEXT NOT NULL,
    is_sent BOOLEAN DEFAULT FALSE,
    sent_date TIMESTAMP,
    recipient_email VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_contracts_vendor_id ON contracts(vendor_id);
CREATE INDEX IF NOT EXISTS idx_contracts_status ON contracts(contract_status);
CREATE INDEX IF NOT EXISTS idx_contracts_end_date ON contracts(end_date);
CREATE INDEX IF NOT EXISTS idx_contracts_risk_rating ON contracts(risk_rating);
CREATE INDEX IF NOT EXISTS idx_contract_amendments_contract_id ON contract_amendments(contract_id);
CREATE INDEX IF NOT EXISTS idx_contract_renewals_contract_id ON contract_renewals(contract_id);
CREATE INDEX IF NOT EXISTS idx_contract_notifications_contract_id ON contract_notifications(contract_id);

-- Create function to auto-generate contract numbers
CREATE OR REPLACE FUNCTION generate_contract_number()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.contract_number IS NULL OR NEW.contract_number = '' THEN
        NEW.contract_number := 'CTR-' || TO_CHAR(CURRENT_DATE, 'YYYY') || '-' || 
                              LPAD(NEXTVAL('contracts_id_seq')::TEXT, 4, '0');
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for auto-generating contract numbers
DROP TRIGGER IF EXISTS trigger_generate_contract_number ON contracts;
CREATE TRIGGER trigger_generate_contract_number
    BEFORE INSERT ON contracts
    FOR EACH ROW
    EXECUTE FUNCTION generate_contract_number();

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for updating updated_at
DROP TRIGGER IF EXISTS trigger_update_contracts_updated_at ON contracts;
CREATE TRIGGER trigger_update_contracts_updated_at
    BEFORE UPDATE ON contracts
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
