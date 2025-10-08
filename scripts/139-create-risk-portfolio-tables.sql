-- Create risk portfolio management tables for aggregation and correlation analysis

-- Risk portfolios table
CREATE TABLE IF NOT EXISTS risk_portfolios (
    id SERIAL PRIMARY KEY,
    portfolio_id VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    owner VARCHAR(255) NOT NULL,
    business_unit VARCHAR(255),
    portfolio_type VARCHAR(50) DEFAULT 'operational' CHECK (portfolio_type IN ('operational', 'strategic', 'compliance', 'technology', 'financial')),
    risk_appetite DECIMAL(15,2) DEFAULT 0,
    risk_tolerance DECIMAL(15,2) DEFAULT 0,
    review_frequency VARCHAR(50) DEFAULT 'quarterly' CHECK (review_frequency IN ('monthly', 'quarterly', 'semi_annual', 'annual')),
    total_risks INTEGER DEFAULT 0,
    total_ale DECIMAL(15,2) DEFAULT 0,
    avg_ale DECIMAL(15,2) DEFAULT 0,
    risks_above_tolerance INTEGER DEFAULT 0,
    diversified_ale DECIMAL(15,2),
    correlation_benefit DECIMAL(15,2),
    diversification_ratio DECIMAL(5,4),
    portfolio_var_95 DECIMAL(15,2),
    portfolio_var_99 DECIMAL(15,2),
    expected_shortfall_95 DECIMAL(15,2),
    expected_shortfall_99 DECIMAL(15,2),
    concentration_index DECIMAL(5,4),
    largest_risk_contribution DECIMAL(5,4),
    last_calculation TIMESTAMP,
    status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'archived')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(255) DEFAULT 'system',
    updated_by VARCHAR(255) DEFAULT 'system'
);

-- Portfolio items junction table
CREATE TABLE IF NOT EXISTS portfolio_items (
    id SERIAL PRIMARY KEY,
    portfolio_id INTEGER REFERENCES risk_portfolios(id) ON DELETE CASCADE,
    risk_id VARCHAR(50) NOT NULL,
    risk_type VARCHAR(50) DEFAULT 'fair' CHECK (risk_type IN ('fair', 'iso27001', 'nist_csf', 'technology', 'operational')),
    weight DECIMAL(5,4) DEFAULT 1.0 CHECK (weight >= 0 AND weight <= 1),
    correlation_group VARCHAR(100),
    business_impact_multiplier DECIMAL(5,2) DEFAULT 1.0,
    strategic_importance VARCHAR(50) DEFAULT 'medium' CHECK (strategic_importance IN ('low', 'medium', 'high', 'critical')),
    treatment_priority INTEGER DEFAULT 3 CHECK (treatment_priority BETWEEN 1 AND 5),
    marginal_contribution DECIMAL(15,2),
    component_contribution DECIMAL(15,2),
    percentage_contribution DECIMAL(5,4),
    correlation_impact DECIMAL(15,2),
    diversification_benefit DECIMAL(15,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(portfolio_id, risk_id, risk_type)
);

-- Risk correlations table
CREATE TABLE IF NOT EXISTS risk_correlations (
    id SERIAL PRIMARY KEY,
    portfolio_id INTEGER REFERENCES risk_portfolios(id) ON DELETE CASCADE,
    risk_1_id VARCHAR(50) NOT NULL,
    risk_2_id VARCHAR(50) NOT NULL,
    risk_1_type VARCHAR(50) DEFAULT 'fair',
    risk_2_type VARCHAR(50) DEFAULT 'fair',
    correlation_coefficient DECIMAL(6,5) NOT NULL CHECK (correlation_coefficient >= -1 AND correlation_coefficient <= 1),
    correlation_type VARCHAR(50) DEFAULT 'expert_judgment' CHECK (correlation_type IN ('statistical', 'causal', 'common_cause', 'expert_judgment')),
    confidence_level DECIMAL(3,2) DEFAULT 0.5 CHECK (confidence_level >= 0 AND confidence_level <= 1),
    analysis_method VARCHAR(100) DEFAULT 'Manual Entry',
    data_source VARCHAR(255),
    notes TEXT,
    validated_by VARCHAR(255),
    validation_date TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(255) DEFAULT 'system',
    UNIQUE(portfolio_id, risk_1_id, risk_2_id, risk_1_type, risk_2_type)
);

-- Portfolio aggregation results table
CREATE TABLE IF NOT EXISTS portfolio_aggregation_results (
    id SERIAL PRIMARY KEY,
    portfolio_id INTEGER REFERENCES risk_portfolios(id) ON DELETE CASCADE,
    calculation_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    simulation_runs INTEGER DEFAULT 10000,
    confidence_interval DECIMAL(3,2) DEFAULT 0.95,
    individual_ale_sum DECIMAL(15,2) NOT NULL,
    diversified_ale DECIMAL(15,2) NOT NULL,
    correlation_benefit DECIMAL(15,2) NOT NULL,
    diversification_ratio DECIMAL(5,4) NOT NULL,
    portfolio_var_95 DECIMAL(15,2) NOT NULL,
    portfolio_var_99 DECIMAL(15,2) NOT NULL,
    expected_shortfall_95 DECIMAL(15,2) NOT NULL,
    expected_shortfall_99 DECIMAL(15,2) NOT NULL,
    concentration_index DECIMAL(5,4) NOT NULL,
    largest_risk_contribution DECIMAL(5,4) NOT NULL,
    calculation_time_seconds DECIMAL(8,3),
    methodology VARCHAR(100) DEFAULT 'Monte Carlo',
    parameters JSONB,
    created_by VARCHAR(255) DEFAULT 'system'
);

-- Risk contributions table
CREATE TABLE IF NOT EXISTS risk_contributions (
    id SERIAL PRIMARY KEY,
    aggregation_result_id INTEGER REFERENCES portfolio_aggregation_results(id) ON DELETE CASCADE,
    portfolio_id INTEGER REFERENCES risk_portfolios(id) ON DELETE CASCADE,
    risk_id VARCHAR(50) NOT NULL,
    risk_type VARCHAR(50) DEFAULT 'fair',
    marginal_contribution DECIMAL(15,2) NOT NULL,
    component_contribution DECIMAL(15,2) NOT NULL,
    percentage_contribution DECIMAL(5,4) NOT NULL,
    correlation_impact DECIMAL(15,2),
    diversification_benefit DECIMAL(15,2),
    risk_weight DECIMAL(5,4),
    standalone_ale DECIMAL(15,2),
    portfolio_ale DECIMAL(15,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_risk_portfolios_status ON risk_portfolios(status);
CREATE INDEX IF NOT EXISTS idx_risk_portfolios_type ON risk_portfolios(portfolio_type);
CREATE INDEX IF NOT EXISTS idx_risk_portfolios_owner ON risk_portfolios(owner);
CREATE INDEX IF NOT EXISTS idx_portfolio_items_portfolio ON portfolio_items(portfolio_id);
CREATE INDEX IF NOT EXISTS idx_portfolio_items_risk ON portfolio_items(risk_id, risk_type);
CREATE INDEX IF NOT EXISTS idx_risk_correlations_portfolio ON risk_correlations(portfolio_id);
CREATE INDEX IF NOT EXISTS idx_risk_correlations_risks ON risk_correlations(risk_1_id, risk_2_id);
CREATE INDEX IF NOT EXISTS idx_aggregation_results_portfolio ON portfolio_aggregation_results(portfolio_id);
CREATE INDEX IF NOT EXISTS idx_risk_contributions_portfolio ON risk_contributions(portfolio_id);
CREATE INDEX IF NOT EXISTS idx_risk_contributions_risk ON risk_contributions(risk_id, risk_type);

-- Add triggers for updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_risk_portfolios_updated_at BEFORE UPDATE ON risk_portfolios FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_portfolio_items_updated_at BEFORE UPDATE ON portfolio_items FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_risk_correlations_updated_at BEFORE UPDATE ON risk_correlations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Add comments for documentation
COMMENT ON TABLE risk_portfolios IS 'Risk portfolios for aggregation and correlation analysis';
COMMENT ON TABLE portfolio_items IS 'Junction table linking risks to portfolios with weights and contributions';
COMMENT ON TABLE risk_correlations IS 'Correlation coefficients between risk pairs in portfolios';
COMMENT ON TABLE portfolio_aggregation_results IS 'Results from Monte Carlo portfolio aggregation calculations';
COMMENT ON TABLE risk_contributions IS 'Individual risk contributions to portfolio metrics';

COMMENT ON COLUMN risk_portfolios.diversification_ratio IS 'Ratio of diversified ALE to individual sum (0-1)';
COMMENT ON COLUMN risk_portfolios.concentration_index IS 'Herfindahl-Hirschman Index for risk concentration';
COMMENT ON COLUMN risk_correlations.correlation_coefficient IS 'Pearson correlation coefficient (-1 to 1)';
COMMENT ON COLUMN portfolio_aggregation_results.expected_shortfall_95 IS 'Conditional VaR at 95% confidence level';
