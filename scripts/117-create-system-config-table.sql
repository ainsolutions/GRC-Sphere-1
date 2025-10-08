-- Create system configuration table
CREATE TABLE IF NOT EXISTS system_config (
    id SERIAL PRIMARY KEY,
    key VARCHAR(255) NOT NULL UNIQUE,
    value TEXT,
    category VARCHAR(100) NOT NULL DEFAULT 'general',
    description TEXT,
    data_type VARCHAR(50) DEFAULT 'string',
    is_sensitive BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create login attempts table for security monitoring
CREATE TABLE IF NOT EXISTS login_attempts (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    ip_address INET,
    user_agent TEXT,
    success BOOLEAN NOT NULL,
    failure_reason TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create user sessions table for session management
CREATE TABLE IF NOT EXISTS user_sessions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    username VARCHAR(255) NOT NULL,
    ip_address INET,
    user_agent TEXT,
    last_activity TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE
);

-- Insert default system configuration values
INSERT INTO system_config (key, value, category, description, data_type, is_sensitive) VALUES
-- Security settings
('session_timeout', '3600', 'security', 'Session timeout in seconds', 'number', false),
('max_login_attempts', '5', 'security', 'Maximum login attempts before lockout', 'number', false),
('password_min_length', '8', 'security', 'Minimum password length', 'number', false),
('require_2fa', 'false', 'security', 'Require two-factor authentication', 'boolean', false),
('jwt_secret', 'your-jwt-secret-key', 'security', 'JWT secret key for token signing', 'string', true),

-- Email settings
('smtp_host', 'smtp.gmail.com', 'email', 'SMTP server hostname', 'string', false),
('smtp_port', '587', 'email', 'SMTP server port', 'number', false),
('smtp_user', '', 'email', 'SMTP username', 'string', false),
('smtp_password', '', 'email', 'SMTP password', 'string', true),
('smtp_secure', 'true', 'email', 'Use TLS/SSL for SMTP', 'boolean', false),
('from_email', 'noreply@yourcompany.com', 'email', 'Default from email address', 'string', false),
('from_name', 'GRC System', 'email', 'Default from name', 'string', false),

-- General settings
('app_name', 'GRC Management System', 'general', 'Application name', 'string', false),
('app_url', 'https://yourcompany.com', 'general', 'Application URL', 'string', false),
('timezone', 'UTC', 'general', 'Default timezone', 'string', false),
('date_format', 'YYYY-MM-DD', 'general', 'Default date format', 'string', false),
('items_per_page', '25', 'general', 'Default items per page', 'number', false),

-- Notification settings
('email_notifications', 'true', 'notifications', 'Enable email notifications', 'boolean', false),
('risk_alert_threshold', 'high', 'notifications', 'Risk level threshold for alerts', 'string', false),
('audit_notifications', 'true', 'notifications', 'Enable audit log notifications', 'boolean', false),
('compliance_reminders', 'true', 'notifications', 'Enable compliance deadline reminders', 'boolean', false),

-- Backup settings
('backup_enabled', 'true', 'backup', 'Enable automatic backups', 'boolean', false),
('backup_frequency', 'daily', 'backup', 'Backup frequency (daily, weekly, monthly)', 'string', false),
('backup_retention_days', '30', 'backup', 'Number of days to retain backups', 'number', false),
('backup_location', '/backups', 'backup', 'Backup storage location', 'string', false)

ON CONFLICT (key) DO NOTHING;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_system_config_category ON system_config(category);
CREATE INDEX IF NOT EXISTS idx_login_attempts_username ON login_attempts(username);
CREATE INDEX IF NOT EXISTS idx_login_attempts_created_at ON login_attempts(created_at);
CREATE INDEX IF NOT EXISTS idx_user_sessions_user_id ON user_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_sessions_is_active ON user_sessions(is_active);
CREATE INDEX IF NOT EXISTS idx_user_sessions_last_activity ON user_sessions(last_activity);

-- Add trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_system_config_updated_at 
    BEFORE UPDATE ON system_config 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();
