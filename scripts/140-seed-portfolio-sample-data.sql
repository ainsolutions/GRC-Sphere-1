-- Seed sample data for risk portfolio management

-- Insert sample risk portfolios
INSERT INTO risk_portfolios (
    portfolio_id, name, description, owner, business_unit, portfolio_type,
    risk_appetite, risk_tolerance, review_frequency, status
) VALUES 
(
    'PORT-001',
    'Cybersecurity Risk Portfolio',
    'Comprehensive cybersecurity risks across all business units including data breaches, system failures, and cyber attacks',
    'John Smith',
    'Information Security',
    'operational',
    2000000,
    5000000,
    'quarterly',
    'active'
),
(
    'PORT-002',
    'Financial Services Risk Portfolio',
    'Financial and regulatory risks for banking operations including credit risk, market risk, and compliance violations',
    'Sarah Johnson',
    'Risk Management',
    'financial',
    1500000,
    3000000,
    'monthly',
    'active'
),
(
    'PORT-003',
    'Technology Infrastructure Portfolio',
    'Technology infrastructure risks including system outages, hardware failures, and software vulnerabilities',
    'Mike Chen',
    'IT Operations',
    'technology',
    1000000,
    2500000,
    'quarterly',
    'active'
),
(
    'PORT-004',
    'Strategic Business Risks',
    'High-level strategic risks affecting business objectives and competitive positioning',
    'Lisa Anderson',
    'Strategy',
    'strategic',
    3000000,
    7500000,
    'semi_annual',
    'active'
),
(
    'PORT-005',
    'Compliance & Regulatory Portfolio',
    'Regulatory compliance risks across multiple jurisdictions and frameworks',
    'David Wilson',
    'Compliance',
    'compliance',
    800000,
    2000000,
    'quarterly',
    'active'
);

-- Get portfolio IDs for foreign key references
DO $$
DECLARE
    cyber_portfolio_id INTEGER;
    financial_portfolio_id INTEGER;
    tech_portfolio_id INTEGER;
    strategic_portfolio_id INTEGER;
    compliance_portfolio_id INTEGER;
    fair_risk_ids VARCHAR(50)[];
    risk_id VARCHAR(50);
    i INTEGER;
BEGIN
    -- Get portfolio IDs
    SELECT id INTO cyber_portfolio_id FROM risk_portfolios WHERE portfolio_id = 'PORT-001';
    SELECT id INTO financial_portfolio_id FROM risk_portfolios WHERE portfolio_id = 'PORT-002';
    SELECT id INTO tech_portfolio_id FROM risk_portfolios WHERE portfolio_id = 'PORT-003';
    SELECT id INTO strategic_portfolio_id FROM risk_portfolios WHERE portfolio_id = 'PORT-004';
    SELECT id INTO compliance_portfolio_id FROM risk_portfolios WHERE portfolio_id = 'PORT-005';

    -- Get existing FAIR risk IDs (limit to first 20 for sample data)
    SELECT ARRAY(SELECT risk_id FROM fair_risks WHERE risk_id IS NOT NULL LIMIT 20) INTO fair_risk_ids;

    -- Insert portfolio items for Cybersecurity Portfolio
    IF array_length(fair_risk_ids, 1) > 0 THEN
        FOR i IN 1..LEAST(8, array_length(fair_risk_ids, 1)) LOOP
            risk_id := fair_risk_ids[i];
            INSERT INTO portfolio_items (
                portfolio_id, risk_id, risk_type, weight, correlation_group,
                business_impact_multiplier, strategic_importance, treatment_priority
            ) VALUES (
                cyber_portfolio_id,
                risk_id,
                'fair',
                CASE 
                    WHEN i <= 2 THEN 0.25  -- Top 2 risks get higher weight
                    WHEN i <= 5 THEN 0.15  -- Next 3 risks get medium weight
                    ELSE 0.10               -- Remaining risks get lower weight
                END,
                CASE 
                    WHEN i % 3 = 1 THEN 'external_threats'
                    WHEN i % 3 = 2 THEN 'internal_threats'
                    ELSE 'system_failures'
                END,
                CASE 
                    WHEN i <= 3 THEN 1.5   -- High business impact
                    WHEN i <= 6 THEN 1.2   -- Medium business impact
                    ELSE 1.0                -- Standard business impact
                END,
                CASE 
                    WHEN i <= 2 THEN 'critical'
                    WHEN i <= 5 THEN 'high'
                    ELSE 'medium'
                END,
                CASE 
                    WHEN i <= 2 THEN 1     -- Highest priority
                    WHEN i <= 5 THEN 2     -- High priority
                    ELSE 3                  -- Medium priority
                END
            );
        END LOOP;

        -- Insert portfolio items for Financial Portfolio
        FOR i IN 1..LEAST(6, array_length(fair_risk_ids, 1)) LOOP
            risk_id := fair_risk_ids[i];
            INSERT INTO portfolio_items (
                portfolio_id, risk_id, risk_type, weight, correlation_group,
                business_impact_multiplier, strategic_importance, treatment_priority
            ) VALUES (
                financial_portfolio_id,
                risk_id,
                'fair',
                CASE 
                    WHEN i <= 2 THEN 0.30
                    WHEN i <= 4 THEN 0.20
                    ELSE 0.15
                END,
                CASE 
                    WHEN i % 2 = 1 THEN 'market_risks'
                    ELSE 'operational_risks'
                END,
                1.3,
                CASE 
                    WHEN i <= 2 THEN 'critical'
                    ELSE 'high'
                END,
                CASE 
                    WHEN i <= 2 THEN 1
                    ELSE 2
                END
            );
        END LOOP;

        -- Insert portfolio items for Technology Portfolio
        FOR i IN 1..LEAST(10, array_length(fair_risk_ids, 1)) LOOP
            risk_id := fair_risk_ids[i];
            INSERT INTO portfolio_items (
                portfolio_id, risk_id, risk_type, weight, correlation_group,
                business_impact_multiplier, strategic_importance, treatment_priority
            ) VALUES (
                tech_portfolio_id,
                risk_id,
                'fair',
                0.10,
                CASE 
                    WHEN i % 4 = 1 THEN 'infrastructure'
                    WHEN i % 4 = 2 THEN 'applications'
                    WHEN i % 4 = 3 THEN 'data_systems'
                    ELSE 'network_security'
                END,
                1.1,
                'medium',
                3
            );
        END LOOP;
    END IF;

    -- Insert sample risk correlations for Cybersecurity Portfolio
    IF array_length(fair_risk_ids, 1) >= 4 THEN
        -- High correlation between external threats
        INSERT INTO risk_correlations (
            portfolio_id, risk_1_id, risk_2_id, correlation_coefficient,
            correlation_type, confidence_level, analysis_method, notes
        ) VALUES 
        (
            cyber_portfolio_id,
            fair_risk_ids[1],
            fair_risk_ids[2],
            0.75,
            'causal',
            0.8,
            'Expert Judgment',
            'Both risks involve external threat actors with similar attack vectors'
        ),
        (
            cyber_portfolio_id,
            fair_risk_ids[1],
            fair_risk_ids[3],
            0.45,
            'common_cause',
            0.7,
            'Historical Analysis',
            'Common vulnerability in shared infrastructure'
        ),
        (
            cyber_portfolio_id,
            fair_risk_ids[2],
            fair_risk_ids[4],
            0.60,
            'statistical',
            0.85,
            'Monte Carlo Analysis',
            'Statistical correlation observed in simulation data'
        ),
        (
            cyber_portfolio_id,
            fair_risk_ids[3],
            fair_risk_ids[4],
            0.30,
            'expert_judgment',
            0.6,
            'Risk Workshop',
            'Moderate correlation identified by risk committee'
        );

        -- Medium correlations for Financial Portfolio
        INSERT INTO risk_correlations (
            portfolio_id, risk_1_id, risk_2_id, correlation_coefficient,
            correlation_type, confidence_level, analysis_method, notes
        ) VALUES 
        (
            financial_portfolio_id,
            fair_risk_ids[1],
            fair_risk_ids[2],
            0.55,
            'statistical',
            0.9,
            'Regression Analysis',
            'Market conditions affect both risks similarly'
        ),
        (
            financial_portfolio_id,
            fair_risk_ids[2],
            fair_risk_ids[3],
            0.40,
            'causal',
            0.75,
            'Scenario Analysis',
            'Operational failures can trigger market responses'
        );

        -- Low correlations for Technology Portfolio
        INSERT INTO risk_correlations (
            portfolio_id, risk_1_id, risk_2_id, correlation_coefficient,
            correlation_type, confidence_level, analysis_method, notes
        ) VALUES 
        (
            tech_portfolio_id,
            fair_risk_ids[1],
            fair_risk_ids[5],
            0.25,
            'expert_judgment',
            0.65,
            'Technical Assessment',
            'Different technology stacks with minimal overlap'
        ),
        (
            tech_portfolio_id,
            fair_risk_ids[2],
            fair_risk_ids[6],
            0.35,
            'common_cause',
            0.7,
            'Infrastructure Analysis',
            'Shared network infrastructure creates some correlation'
        );
    END IF;

    -- Insert sample aggregation results
    INSERT INTO portfolio_aggregation_results (
        portfolio_id, simulation_runs, individual_ale_sum, diversified_ale,
        correlation_benefit, diversification_ratio, portfolio_var_95, portfolio_var_99,
        expected_shortfall_95, expected_shortfall_99, concentration_index,
        largest_risk_contribution, calculation_time_seconds, methodology, parameters
    ) VALUES 
    (
        cyber_portfolio_id,
        10000,
        8500000,
        6800000,
        1700000,
        0.80,
        9200000,
        12500000,
        10800000,
        14200000,
        0.35,
        0.28,
        45.2,
        'Monte Carlo',
        '{"confidence_levels": [0.95, 0.99], "distribution": "normal", "correlation_method": "pearson"}'::jsonb
    ),
    (
        financial_portfolio_id,
        10000,
        5200000,
        4500000,
        700000,
        0.87,
        5800000,
        7200000,
        6400000,
        8100000,
        0.42,
        0.35,
        32.8,
        'Monte Carlo',
        '{"confidence_levels": [0.95, 0.99], "distribution": "normal", "correlation_method": "pearson"}'::jsonb
    ),
    (
        tech_portfolio_id,
        10000,
        3800000,
        3600000,
        200000,
        0.95,
        4100000,
        4800000,
        4400000,
        5200000,
        0.15,
        0.18,
        28.5,
        'Monte Carlo',
        '{"confidence_levels": [0.95, 0.99], "distribution": "normal", "correlation_method": "pearson"}'::jsonb
    );

    -- Update portfolio summary statistics
    UPDATE risk_portfolios SET
        total_risks = (SELECT COUNT(*) FROM portfolio_items WHERE portfolio_id = risk_portfolios.id),
        total_ale = (
            SELECT COALESCE(SUM(fr.annual_loss_expectancy * pi.weight), 0)
            FROM portfolio_items pi
            LEFT JOIN fair_risks fr ON pi.risk_id = fr.risk_id
            WHERE pi.portfolio_id = risk_portfolios.id
        ),
        avg_ale = (
            SELECT COALESCE(AVG(fr.annual_loss_expectancy), 0)
            FROM portfolio_items pi
            LEFT JOIN fair_risks fr ON pi.risk_id = fr.risk_id
            WHERE pi.portfolio_id = risk_portfolios.id
        ),
        diversified_ale = (
            SELECT par.diversified_ale
            FROM portfolio_aggregation_results par
            WHERE par.portfolio_id = risk_portfolios.id
            ORDER BY par.calculation_date DESC
            LIMIT 1
        ),
        correlation_benefit = (
            SELECT par.correlation_benefit
            FROM portfolio_aggregation_results par
            WHERE par.portfolio_id = risk_portfolios.id
            ORDER BY par.calculation_date DESC
            LIMIT 1
        ),
        diversification_ratio = (
            SELECT par.diversification_ratio
            FROM portfolio_aggregation_results par
            WHERE par.portfolio_id = risk_portfolios.id
            ORDER BY par.calculation_date DESC
            LIMIT 1
        ),
        portfolio_var_95 = (
            SELECT par.portfolio_var_95
            FROM portfolio_aggregation_results par
            WHERE par.portfolio_id = risk_portfolios.id
            ORDER BY par.calculation_date DESC
            LIMIT 1
        ),
        concentration_index = (
            SELECT par.concentration_index
            FROM portfolio_aggregation_results par
            WHERE par.portfolio_id = risk_portfolios.id
            ORDER BY par.calculation_date DESC
            LIMIT 1
        ),
        largest_risk_contribution = (
            SELECT par.largest_risk_contribution
            FROM portfolio_aggregation_results par
            WHERE par.portfolio_id = risk_portfolios.id
            ORDER BY par.calculation_date DESC
            LIMIT 1
        ),
        last_calculation = (
            SELECT par.calculation_date
            FROM portfolio_aggregation_results par
            WHERE par.portfolio_id = risk_portfolios.id
            ORDER BY par.calculation_date DESC
            LIMIT 1
        ),
        risks_above_tolerance = (
            SELECT COUNT(*)
            FROM portfolio_items pi
            LEFT JOIN fair_risks fr ON pi.risk_id = fr.risk_id
            WHERE pi.portfolio_id = risk_portfolios.id
            AND fr.annual_loss_expectancy > risk_portfolios.risk_tolerance
        );

END $$;

-- Insert sample risk contributions for the aggregation results
DO $$
DECLARE
    result_record RECORD;
    item_record RECORD;
    contribution_pct DECIMAL(5,4);
    base_contribution DECIMAL(15,2);
BEGIN
    -- For each aggregation result, create risk contributions
    FOR result_record IN 
        SELECT id, portfolio_id, individual_ale_sum, diversified_ale 
        FROM portfolio_aggregation_results 
    LOOP
        -- Get portfolio items for this result
        FOR item_record IN 
            SELECT pi.risk_id, pi.risk_type, pi.weight, fr.annual_loss_expectancy
            FROM portfolio_items pi
            LEFT JOIN fair_risks fr ON pi.risk_id = fr.risk_id
            WHERE pi.portfolio_id = result_record.portfolio_id
            AND fr.annual_loss_expectancy IS NOT NULL
        LOOP
            -- Calculate contributions
            base_contribution := COALESCE(item_record.annual_loss_expectancy, 0) * item_record.weight;
            contribution_pct := CASE 
                WHEN result_record.individual_ale_sum > 0 
                THEN base_contribution / result_record.individual_ale_sum 
                ELSE 0 
            END;
            
            INSERT INTO risk_contributions (
                aggregation_result_id, portfolio_id, risk_id, risk_type,
                marginal_contribution, component_contribution, percentage_contribution,
                correlation_impact, diversification_benefit, risk_weight,
                standalone_ale, portfolio_ale
            ) VALUES (
                result_record.id,
                result_record.portfolio_id,
                item_record.risk_id,
                item_record.risk_type,
                base_contribution * 0.95, -- Marginal slightly less due to correlations
                base_contribution,
                contribution_pct,
                base_contribution * 0.05, -- Small correlation impact
                base_contribution * 0.1,  -- Diversification benefit
                item_record.weight,
                item_record.annual_loss_expectancy,
                result_record.diversified_ale
            );
        END LOOP;
    END LOOP;
END $$;

-- Update portfolio items with contribution data from risk_contributions
UPDATE portfolio_items SET
    marginal_contribution = rc.marginal_contribution,
    component_contribution = rc.component_contribution,
    percentage_contribution = rc.percentage_contribution,
    correlation_impact = rc.correlation_impact,
    diversification_benefit = rc.diversification_benefit
FROM risk_contributions rc
WHERE portfolio_items.portfolio_id = rc.portfolio_id
AND portfolio_items.risk_id = rc.risk_id
AND portfolio_items.risk_type = rc.risk_type;

-- Add some additional correlations for better analysis
INSERT INTO risk_correlations (
    portfolio_id, risk_1_id, risk_2_id, correlation_coefficient,
    correlation_type, confidence_level, analysis_method, notes
)
SELECT 
    rp.id,
    pi1.risk_id,
    pi2.risk_id,
    CASE 
        WHEN pi1.correlation_group = pi2.correlation_group THEN 0.6 + (RANDOM() * 0.3)
        WHEN pi1.correlation_group != pi2.correlation_group THEN 0.1 + (RANDOM() * 0.3)
        ELSE 0.2 + (RANDOM() * 0.2)
    END,
    'expert_judgment',
    0.7,
    'Automated Correlation Assignment',
    'System-generated correlation based on risk groupings'
FROM risk_portfolios rp
JOIN portfolio_items pi1 ON rp.id = pi1.portfolio_id
JOIN portfolio_items pi2 ON rp.id = pi2.portfolio_id
WHERE pi1.risk_id < pi2.risk_id  -- Avoid duplicates
AND NOT EXISTS (
    SELECT 1 FROM risk_correlations rc 
    WHERE rc.portfolio_id = rp.id 
    AND ((rc.risk_1_id = pi1.risk_id AND rc.risk_2_id = pi2.risk_id) 
         OR (rc.risk_1_id = pi2.risk_id AND rc.risk_2_id = pi1.risk_id))
)
AND RANDOM() < 0.3;  -- Only create correlations for 30% of pairs

-- Final verification and summary
DO $$
DECLARE
    portfolio_count INTEGER;
    item_count INTEGER;
    correlation_count INTEGER;
    result_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO portfolio_count FROM risk_portfolios;
    SELECT COUNT(*) INTO item_count FROM portfolio_items;
    SELECT COUNT(*) INTO correlation_count FROM risk_correlations;
    SELECT COUNT(*) INTO result_count FROM portfolio_aggregation_results;
    
    RAISE NOTICE 'Portfolio seeding completed:';
    RAISE NOTICE '- Portfolios created: %', portfolio_count;
    RAISE NOTICE '- Portfolio items: %', item_count;
    RAISE NOTICE '- Risk correlations: %', correlation_count;
    RAISE NOTICE '- Aggregation results: %', result_count;
END $$;
