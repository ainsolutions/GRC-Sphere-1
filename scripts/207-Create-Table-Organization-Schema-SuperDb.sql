-- Create Organization Schemas table
CREATE TABLE IF NOT EXISTS Organization_Schemas (
    id SERIAL PRIMARY KEY,
    SchemaName VARCHAR(255) NOT NULL,
    ConnectionString TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(100),
    updated_by VARCHAR(100)
);

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_Organization_Schemas_SchemaName ON Organization_Schemas(SchemaName);

