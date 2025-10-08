-- Create policy categories table
CREATE TABLE IF NOT EXISTS policy_categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    color VARCHAR(7) DEFAULT '#3B82F6',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create policies table
CREATE TABLE IF NOT EXISTS policies (
    id SERIAL PRIMARY KEY,
    policy_id VARCHAR(20) NOT NULL UNIQUE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    content TEXT NOT NULL,
    category_id INTEGER REFERENCES policy_categories(id),
    status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'under_review', 'approved', 'published', 'archived')),
    version VARCHAR(10) DEFAULT '1.0',
    effective_date DATE,
    review_date DATE,
    next_review_date DATE,
    tags TEXT[], -- Use TEXT array instead of JSON
    created_by INTEGER DEFAULT 1,
    updated_by INTEGER DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create procedures table
CREATE TABLE IF NOT EXISTS procedures (
    id SERIAL PRIMARY KEY,
    procedure_id VARCHAR(20) NOT NULL UNIQUE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    policy_id INTEGER REFERENCES policies(id) ON DELETE CASCADE,
    steps JSONB DEFAULT '[]',
    roles_responsibilities JSONB DEFAULT '{}',
    status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'under_review', 'approved', 'published', 'archived')),
    version VARCHAR(10) DEFAULT '1.0',
    created_by INTEGER DEFAULT 1,
    updated_by INTEGER DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create procedure executions table
CREATE TABLE IF NOT EXISTS procedure_executions (
    id SERIAL PRIMARY KEY,
    execution_id VARCHAR(20) NOT NULL UNIQUE,
    procedure_id INTEGER REFERENCES procedures(id) ON DELETE CASCADE,
    executed_by INTEGER DEFAULT 1,
    status VARCHAR(20) DEFAULT 'in_progress' CHECK (status IN ('in_progress', 'completed', 'failed', 'cancelled')),
    started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP,
    duration_minutes INTEGER,
    steps_completed JSONB DEFAULT '[]',
    notes TEXT,
    evidence_files JSONB DEFAULT '[]',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_policies_category_id ON policies(category_id);
CREATE INDEX IF NOT EXISTS idx_policies_status ON policies(status);
CREATE INDEX IF NOT EXISTS idx_policies_next_review_date ON policies(next_review_date);
CREATE INDEX IF NOT EXISTS idx_procedures_policy_id ON procedures(policy_id);
CREATE INDEX IF NOT EXISTS idx_procedure_executions_procedure_id ON procedure_executions(procedure_id);
CREATE INDEX IF NOT EXISTS idx_procedure_executions_status ON procedure_executions(status);

-- Add triggers for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_policies_updated_at BEFORE UPDATE ON policies FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_procedures_updated_at BEFORE UPDATE ON procedures FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_procedure_executions_updated_at BEFORE UPDATE ON procedure_executions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
