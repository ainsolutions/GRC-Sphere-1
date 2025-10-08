

-- SET statement_timeout = 0;
-- SET lock_timeout = 0;
-- SET idle_in_transaction_session_timeout = 0;
-- SET transaction_timeout = 0;
-- SET client_encoding = 'UTF8';
-- SET standard_conforming_strings = on;
-- SELECT pg_catalog.set_config('search_path', '', false);
-- SET check_function_bodies = false;
-- SET xmloption = content;
-- SET client_min_messages = warning;
-- SET row_security = off;


-- --

-- CREATE FUNCTION org_mashreqbank.authenticate_user(p_email text, p_password text) RETURNS TABLE(success boolean, user_id integer, user_data jsonb, organization_id integer, organization_schema text, is_super_admin boolean, accessible_schemas text[], message text)
--     LANGUAGE plpgsql
--     AS $$
-- BEGIN
--   RETURN QUERY
--   SELECT 
--     TRUE AS success, -- Explicitly set success as a literal
--     u.id AS user_id,
--     jsonb_build_object('id', u.id, 'email', u.email) AS user_data,
--     u.organization_id,
--     o.schema AS organization_schema,
--     u.is_super_admin,
--     ARRAY[o.schema] AS accessible_schemas,
--     NULL::TEXT AS message
--   FROM users u
--   LEFT JOIN organizations o ON u.organization_id = o.id
--   WHERE u.email = p_email AND u.password_hash = crypt(p_password, u.password_hash);

--   IF NOT FOUND THEN
--     RETURN QUERY
--     SELECT 
--       FALSE AS success,
--       NULL::INTEGER AS user_id,
--       NULL::JSONB AS user_data,
--       NULL::INTEGER AS organization_id,
--       NULL::TEXT AS organization_schema,
--       FALSE AS is_super_admin,
--       ARRAY[]::TEXT[] AS accessible_schemas,
--       'Invalid email or password'::TEXT AS message;
--   END IF;
-- END;
-- $$;


-- ALTER FUNCTION org_mashreqbank.authenticate_user(p_email text, p_password text) OWNER TO neondb_owner;

-- --
-- -- TOC entry 737 (class 1255 OID 917537)
-- -- Name: authenticate_user(character varying, character varying); Type: FUNCTION; Schema: public; Owner: neondb_owner
-- --

-- CREATE FUNCTION org_mashreqbank.authenticate_user(p_email character varying, p_password character varying) RETURNS TABLE(user_id integer, organization_id integer, organization_schema character varying, user_data jsonb, success boolean, message text, is_super_admin boolean, accessible_schemas text[])
--     LANGUAGE plpgsql SECURITY DEFINER
--     AS $_$
-- DECLARE
--     org_record RECORD;
--     user_record RECORD;
--     failed_attempts INTEGER;
--     user_schemas TEXT[];
-- BEGIN
--     -- Check for too many failed attempts (basic brute force protection)
--     SELECT COUNT(*) INTO failed_attempts
--     FROM login_attempts
--     WHERE email = p_email
--     AND success = false
--     AND attempted_at > NOW() - INTERVAL '15 minutes';

--     IF failed_attempts >= 5 THEN
--         RETURN QUERY SELECT NULL::INTEGER, NULL::INTEGER, NULL::VARCHAR(63), NULL::JSONB, false, 'Account temporarily locked due to too many failed attempts', false, NULL::TEXT[];
--         RETURN;
--     END IF;

--     -- First check if this is a super admin user (in main users table)
--     SELECT u.id, u.email, u.password_hash, u.first_name, u.last_name, u.role, u.is_active, u.organization_id,
--            o.id as org_id, o.schema_name, o.name as org_name
--     INTO user_record
--     FROM users u
--     JOIN organizations o ON u.organization_id = o.id
--     WHERE u.email = p_email AND u.is_active = true;

--     IF FOUND THEN
--         -- Verify password
--         IF crypt(p_password, user_record.password_hash) = user_record.password_hash THEN
--             -- Update last login
--             UPDATE users SET last_login = NOW() WHERE id = user_record.id;

--             -- Log successful attempt
--             INSERT INTO login_attempts (email, organization_id, success, ip_address)
--             VALUES (p_email, user_record.organization_id, true, inet_client_addr());

--             -- Get accessible schemas for super admin
--             IF user_record.role = 'super_admin' AND user_record.schema_name = 'public' THEN
--                 SELECT ARRAY(SELECT schema_name FROM organizations WHERE is_active = true) INTO user_schemas;
--             ELSE
--                 user_schemas := ARRAY[user_record.schema_name];
--             END IF;

--             -- Return success
--             RETURN QUERY SELECT 
--                 user_record.id,
--                 user_record.organization_id,
--                 user_record.schema_name,
--                 jsonb_build_object(
--                     'id', user_record.id,
--                     'email', user_record.email,
--                     'first_name', user_record.first_name,
--                     'last_name', user_record.last_name,
--                     'role', user_record.role,
--                     'organization_name', user_record.org_name
--                 ),
--                 true,
--                 'Login successful',
--                 (user_record.role = 'super_admin' AND user_record.schema_name = 'public'),
--                 user_schemas;
--             RETURN;
--         END IF;
--     END IF;

--     -- If not found in main users table or password incorrect, check organization-specific tables
--     FOR org_record IN SELECT id, schema_name, name FROM organizations WHERE is_active = true AND schema_name != 'public'
--     LOOP
--         BEGIN
--             -- Look up user in organization schema
--             EXECUTE format('
--                 SELECT id, email, password_hash, first_name, last_name, role, department, is_active
--                 FROM %I.users 
--                 WHERE email = $1 AND is_active = true
--             ', org_record.schema_name)
--             INTO user_record
--             USING p_email;

--             IF FOUND THEN
--                 -- Verify password
--                 IF crypt(p_password, user_record.password_hash) = user_record.password_hash THEN
--                     -- Update last login
--                     EXECUTE format('UPDATE %I.users SET last_login = NOW() WHERE id = $1', org_record.schema_name)
--                     USING user_record.id;

--                     -- Log successful attempt
--                     INSERT INTO login_attempts (email, organization_id, success, ip_address)
--                     VALUES (p_email, org_record.id, true, inet_client_addr());

--                     -- Return success
--                     RETURN QUERY SELECT 
--                         user_record.id,
--                         org_record.id,
--                         org_record.schema_name,
--                         jsonb_build_object(
--                             'id', user_record.id,
--                             'email', user_record.email,
--                             'first_name', user_record.first_name,
--                             'last_name', user_record.last_name,
--                             'role', user_record.role,
--                             'department', user_record.department,
--                             'organization_name', org_record.name
--                         ),
--                         true,
--                         'Login successful',
--                         false,
--                         ARRAY[org_record.schema_name];
--                     RETURN;
--                 END IF;
--             END IF;
--         EXCEPTION
--             WHEN OTHERS THEN
--                 -- Skip this organization if table doesn't exist
--                 CONTINUE;
--         END;
--     END LOOP;

--     -- Log failed attempt
--     INSERT INTO login_attempts (email, organization_id, success, ip_address)
--     VALUES (p_email, NULL, false, inet_client_addr());
    
--     RETURN QUERY SELECT NULL::INTEGER, NULL::INTEGER, NULL::VARCHAR(63), NULL::JSONB, false, 'Invalid credentials', false, NULL::TEXT[];
-- END;
-- $_$;


-- ALTER FUNCTION org_mashreqbank.authenticate_user(p_email character varying, p_password character varying) OWNER TO neondb_owner;

-- --
-- -- TOC entry 707 (class 1255 OID 360658)
-- -- Name: auto_generate_risk_id(); Type: FUNCTION; Schema: public; Owner: neondb_owner
-- --

-- CREATE FUNCTION org_mashreqbank.auto_generate_risk_id() RETURNS trigger
--     LANGUAGE plpgsql
--     AS $$
-- BEGIN
--     -- Only generate if risk_id is null or empty
--     IF NEW.risk_id IS NULL OR NEW.risk_id = '' THEN
--         NEW.risk_id := generate_risk_id();
--     END IF;
--     RETURN NEW;
-- END;
-- $$;


-- ALTER FUNCTION org_mashreqbank.auto_generate_risk_id() OWNER TO neondb_owner;

-- --
-- -- TOC entry 690 (class 1255 OID 491521)
-- -- Name: calculate_aging_days(timestamp without time zone, date, date); Type: FUNCTION; Schema: public; Owner: neondb_owner
-- --

-- CREATE FUNCTION org_mashreqbank.calculate_aging_days(p_created_at timestamp without time zone, p_remediation_completed_date date, p_remediation_due_date date) RETURNS integer
--     LANGUAGE plpgsql
--     AS $$
-- BEGIN
--     -- If remediation is completed, return days between creation and completion
--     IF p_remediation_completed_date IS NOT NULL THEN
--         RETURN EXTRACT(DAY FROM p_remediation_completed_date - p_created_at::DATE);
--     END IF;
    
--     -- If not completed, return days since creation
--     RETURN EXTRACT(DAY FROM CURRENT_DATE - p_created_at::DATE);
-- END;
-- $$;


-- ALTER FUNCTION org_mashreqbank.calculate_aging_days(p_created_at timestamp without time zone, p_remediation_completed_date date, p_remediation_due_date date) OWNER TO neondb_owner;

-- --
-- -- TOC entry 713 (class 1255 OID 712704)
-- -- Name: calculate_aging_status(timestamp without time zone); Type: FUNCTION; Schema: public; Owner: neondb_owner
-- --

-- CREATE FUNCTION org_mashreqbank.calculate_aging_status(approved_date timestamp without time zone) RETURNS text
--     LANGUAGE plpgsql IMMUTABLE
--     AS $$
-- BEGIN
-- RETURN CASE 
--              WHEN approved_date IS NULL THEN 'Not Approved'
--                      WHEN age(approved_date) < INTERVAL '7 days' THEN 'Recent'
--                              WHEN age(approved_date) < INTERVAL '14 days' THEN '14 Days Old'
--                                     WHEN age(approved_date) < INTERVAL '31 days' THEN '30 Days Old'
--                                              ELSE 'Critical'
--                                                  END;
--                                                  END;
--                                                 $$;


-- ALTER FUNCTION org_mashreqbank.calculate_aging_status(approved_date timestamp without time zone) OWNER TO neondb_owner;

-- --
-- -- TOC entry 703 (class 1255 OID 680010)
-- -- Name: calculate_control_aging(date, date); Type: FUNCTION; Schema: public; Owner: neondb_owner
-- --

-- CREATE FUNCTION org_mashreqbank.calculate_control_aging(due_date date, completion_date date DEFAULT NULL::date) RETURNS integer
--     LANGUAGE plpgsql
--     AS $$
-- BEGIN
--     IF completion_date IS NOT NULL THEN
--         RETURN 0; -- Completed controls have no aging
--     END IF;
    
--     RETURN GREATEST(0, CURRENT_DATE - due_date);
-- END;
-- $$;


-- ALTER FUNCTION org_mashreqbank.calculate_control_aging(due_date date, completion_date date) OWNER TO neondb_owner;

-- --
-- -- TOC entry 710 (class 1255 OID 491522)
-- -- Name: calculate_overdue_days(date, date); Type: FUNCTION; Schema: public; Owner: neondb_owner
-- --

-- CREATE FUNCTION org_mashreqbank.calculate_overdue_days(p_remediation_due_date date, p_remediation_completed_date date) RETURNS integer
--     LANGUAGE plpgsql
--     AS $$
-- BEGIN
--     -- If remediation is completed, no overdue
--     IF p_remediation_completed_date IS NOT NULL THEN
--         RETURN 0;
--     END IF;
    
--     -- If due date is in the future, not overdue
--     IF p_remediation_due_date IS NULL OR p_remediation_due_date >= CURRENT_DATE THEN
--         RETURN 0;
--     END IF;
    
--     -- Calculate overdue days
--     RETURN EXTRACT(DAY FROM CURRENT_DATE - p_remediation_due_date);
-- END;
-- $$;


-- ALTER FUNCTION org_mashreqbank.calculate_overdue_days(p_remediation_due_date date, p_remediation_completed_date date) OWNER TO neondb_owner;

-- --
-- -- TOC entry 662 (class 1255 OID 98438)
-- -- Name: calculate_residual_risk(); Type: FUNCTION; Schema: public; Owner: neondb_owner
-- --

-- CREATE FUNCTION org_mashreqbank.calculate_residual_risk() RETURNS trigger
--     LANGUAGE plpgsql
--     AS $$
-- BEGIN
--     -- Calculate residual risk when control effectiveness is updated
--     IF NEW.control_effectiveness_score IS NOT NULL AND NEW.control_effectiveness_score != OLD.control_effectiveness_score THEN
--         -- Simple calculation: reduce likelihood based on control effectiveness
--         NEW.residual_likelihood := GREATEST(1, ROUND(NEW.likelihood_score * (1 - (NEW.control_effectiveness_score - 1) * 0.2)));
--         NEW.residual_impact := GREATEST(1, ROUND(NEW.impact_score * (1 - (NEW.control_effectiveness_score - 1) * 0.1)));
--         NEW.residual_risk_score := NEW.residual_likelihood * NEW.residual_impact;
        
--         -- Update risk appetite alignment
--         NEW.risk_appetite_alignment := CASE 
--             WHEN NEW.residual_risk_score <= 6 THEN 'Within Appetite'
--             WHEN NEW.residual_risk_score <= 12 THEN 'Above Appetite'
--             ELSE 'Exceeds Tolerance'
--         END;
--     END IF;
    
--     NEW.updated_at := CURRENT_TIMESTAMP;
--     RETURN NEW;
-- END;
-- $$;


-- ALTER FUNCTION org_mashreqbank.calculate_residual_risk() OWNER TO neondb_owner;

-- --
-- -- TOC entry 674 (class 1255 OID 360459)
-- -- Name: calculate_residual_risk_score(); Type: FUNCTION; Schema: public; Owner: neondb_owner
-- --

-- CREATE FUNCTION org_mashreqbank.calculate_residual_risk_score() RETURNS trigger
--     LANGUAGE plpgsql
--     AS $$
-- BEGIN
--     NEW.residual_risk_score := COALESCE(NEW.residual_likelihood_score, NEW.likelihood_score) * COALESCE(NEW.residual_impact_score, NEW.impact_score);
--     RETURN NEW;
-- END;
-- $$;


-- ALTER FUNCTION org_mashreqbank.calculate_residual_risk_score() OWNER TO neondb_owner;

-- --
-- -- TOC entry 693 (class 1255 OID 311359)
-- -- Name: calculate_risk_score_and_level(); Type: FUNCTION; Schema: public; Owner: neondb_owner
-- --

-- CREATE FUNCTION org_mashreqbank.calculate_risk_score_and_level() RETURNS trigger
--     LANGUAGE plpgsql
--     AS $$
-- BEGIN
--     -- Calculate inherent risk score
--     NEW.inherent_risk_score = NEW.inherent_likelihood * NEW.inherent_impact;
    
--     -- Determine inherent risk level
--     NEW.inherent_risk_level = CASE 
--         WHEN NEW.inherent_risk_score >= 20 THEN 'Critical'
--         WHEN NEW.inherent_risk_score >= 15 THEN 'High'
--         WHEN NEW.inherent_risk_score >= 10 THEN 'Medium'
--         WHEN NEW.inherent_risk_score >= 5 THEN 'Low'
--         ELSE 'Very Low'
--     END;
    
--     -- Calculate residual risk score
--     NEW.residual_risk_score = NEW.residual_likelihood * NEW.residual_impact;
    
--     -- Determine residual risk level
--     NEW.residual_risk_level = CASE 
--         WHEN NEW.residual_risk_score >= 20 THEN 'Critical'
--         WHEN NEW.residual_risk_score >= 15 THEN 'High'
--         WHEN NEW.residual_risk_score >= 10 THEN 'Medium'
--         WHEN NEW.residual_risk_score >= 5 THEN 'Low'
--         ELSE 'Very Low'
--     END;
    
--     RETURN NEW;
-- END;
-- $$;


-- ALTER FUNCTION org_mashreqbank.calculate_risk_score_and_level() OWNER TO neondb_owner;

-- --
-- -- TOC entry 740 (class 1255 OID 917541)
-- -- Name: cleanup_expired_sessions(); Type: FUNCTION; Schema: public; Owner: neondb_owner
-- --

-- CREATE FUNCTION org_mashreqbank.cleanup_expired_sessions() RETURNS integer
--     LANGUAGE plpgsql
--     AS $$
-- DECLARE
--     deleted_count INTEGER;
-- BEGIN
--     DELETE FROM user_sessions WHERE expires_at < NOW();
--     GET DIAGNOSTICS deleted_count = ROW_COUNT;
--     RETURN deleted_count;
-- END;
-- $$;


-- ALTER FUNCTION org_mashreqbank.cleanup_expired_sessions() OWNER TO neondb_owner;

-- --
-- -- TOC entry 733 (class 1255 OID 909315)
-- -- Name: create_organization_schema(integer); Type: FUNCTION; Schema: public; Owner: neondb_owner
-- --

-- CREATE FUNCTION org_mashreqbank.create_organization_schema(org_id integer) RETURNS void
--     LANGUAGE plpgsql
--     AS $$
-- DECLARE
--     schema_name_var VARCHAR(50);
-- BEGIN
--     -- Get the schema name for the organization
--     SELECT schema_name INTO schema_name_var FROM organizations WHERE id = org_id;
    
--     IF schema_name_var IS NOT NULL THEN
--         -- Create the schema
--         EXECUTE 'CREATE SCHEMA IF NOT EXISTS ' || quote_ident(schema_name_var);
        
--         -- Create tables in the organization schema
--         EXECUTE 'CREATE TABLE IF NOT EXISTS ' || quote_ident(schema_name_var) || '.information_assets (LIKE org_mashreqbank.information_assets INCLUDING ALL)';
--         EXECUTE 'CREATE TABLE IF NOT EXISTS ' || quote_ident(schema_name_var) || '.risks (LIKE org_mashreqbank.risks INCLUDING ALL)';
--         EXECUTE 'CREATE TABLE IF NOT EXISTS ' || quote_ident(schema_name_var) || '.controls (LIKE org_mashreqbank.controls INCLUDING ALL)';
--         EXECUTE 'CREATE TABLE IF NOT EXISTS ' || quote_ident(schema_name_var) || '.incidents (LIKE org_mashreqbank.incidents INCLUDING ALL)';
--         EXECUTE 'CREATE TABLE IF NOT EXISTS ' || quote_ident(schema_name_var) || '.cybersecurity_assessments (LIKE org_mashreqbank.cybersecurity_assessments INCLUDING ALL)';
--         EXECUTE 'CREATE TABLE IF NOT EXISTS ' || quote_ident(schema_name_var) || '.assessment_findings (LIKE org_mashreqbank.assessment_findings INCLUDING ALL)';
--         EXECUTE 'CREATE TABLE IF NOT EXISTS ' || quote_ident(schema_name_var) || '.vulnerabilities (LIKE org_mashreqbank.vulnerabilities INCLUDING ALL)';
--         EXECUTE 'CREATE TABLE IF NOT EXISTS ' || quote_ident(schema_name_var) || '.threats (LIKE org_mashreqbank.threats INCLUDING ALL)';
--         EXECUTE 'CREATE TABLE IF NOT EXISTS ' || quote_ident(schema_name_var) || '.threat_assessments (LIKE org_mashreqbank.threat_assessments INCLUDING ALL)';
--         EXECUTE 'CREATE TABLE IF NOT EXISTS ' || quote_ident(schema_name_var) || '.iso27001_risks (LIKE org_mashreqbank.iso27001_risks INCLUDING ALL)';
--         EXECUTE 'CREATE TABLE IF NOT EXISTS ' || quote_ident(schema_name_var) || '.fair_risks (LIKE org_mashreqbank.fair_risks INCLUDING ALL)';
--         EXECUTE 'CREATE TABLE IF NOT EXISTS ' || quote_ident(schema_name_var) || '.technology_risks (LIKE org_mashreqbank.technology_risks INCLUDING ALL)';
--         EXECUTE 'CREATE TABLE IF NOT EXISTS ' || quote_ident(schema_name_var) || '.nist_csf_risk_templates (LIKE org_mashreqbank.nist_csf_risk_templates INCLUDING ALL)';
--         EXECUTE 'CREATE TABLE IF NOT EXISTS ' || quote_ident(schema_name_var) || '.hipaa_assessments (LIKE org_mashreqbank.hipaa_assessments INCLUDING ALL)';
--         EXECUTE 'CREATE TABLE IF NOT EXISTS ' || quote_ident(schema_name_var) || '.nesa_uae_assessments (LIKE org_mashreqbank.nesa_uae_assessments INCLUDING ALL)';
        
--         -- Create indexes for performance
--         EXECUTE 'CREATE INDEX IF NOT EXISTS idx_' || schema_name_var || '_assets_owner ON ' || quote_ident(schema_name_var) || '.information_assets(owner)';
--         EXECUTE 'CREATE INDEX IF NOT EXISTS idx_' || schema_name_var || '_risks_status ON ' || quote_ident(schema_name_var) || '.risks(risk_status)';
--         EXECUTE 'CREATE INDEX IF NOT EXISTS idx_' || schema_name_var || '_incidents_status ON ' || quote_ident(schema_name_var) || '.incidents(status)';
--     END IF;
-- END;
-- $$;


-- ALTER FUNCTION org_mashreqbank.create_organization_schema(org_id integer) OWNER TO neondb_owner;

-- --
-- -- TOC entry 741 (class 1255 OID 925731)
-- -- Name: create_organization_schema(text); Type: FUNCTION; Schema: public; Owner: neondb_owner
-- --

-- CREATE FUNCTION org_mashreqbank.create_organization_schema(schema_name text) RETURNS boolean
--     LANGUAGE plpgsql
--     AS $$
-- BEGIN
--     -- Create schema
--     EXECUTE format('CREATE SCHEMA IF NOT EXISTS %I', schema_name);
    
--     -- Create users table in organization schema
--     EXECUTE format('
--         CREATE TABLE IF NOT EXISTS %I.users (
--             id SERIAL PRIMARY KEY,
--             email VARCHAR(255) UNIQUE NOT NULL,
--             password_hash VARCHAR(255) NOT NULL,
--             first_name VARCHAR(100) NOT NULL,
--             last_name VARCHAR(100) NOT NULL,
--             role VARCHAR(50) DEFAULT ''user'',
--             department VARCHAR(100),
--             is_active BOOLEAN DEFAULT TRUE,
--             created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
--             updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
--             last_login TIMESTAMP,
--             login_attempts INTEGER DEFAULT 0,
--             locked_until TIMESTAMP
--         )', schema_name);
    
--     -- Create incidents table in organization schema
--     EXECUTE format('
--         CREATE TABLE IF NOT EXISTS %I.incidents (
--             id SERIAL PRIMARY KEY,
--             title VARCHAR(255) NOT NULL,
--             description TEXT,
--             severity VARCHAR(20) DEFAULT ''medium'',
--             status VARCHAR(20) DEFAULT ''open'',
--             category VARCHAR(100),
--             assigned_to INTEGER REFERENCES %I.users(id),
--             created_by INTEGER REFERENCES %I.users(id),
--             created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
--             updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
--             resolved_at TIMESTAMP
--         )', schema_name, schema_name, schema_name);
    
--     RETURN TRUE;
-- EXCEPTION
--     WHEN OTHERS THEN
--         RETURN FALSE;
-- END;
-- $$;


-- ALTER FUNCTION org_mashreqbank.create_organization_schema(schema_name text) OWNER TO neondb_owner;

-- --
-- -- TOC entry 743 (class 1255 OID 958478)
-- -- Name: create_user_session(integer, character varying, timestamp without time zone); Type: FUNCTION; Schema: public; Owner: neondb_owner
-- --

-- CREATE FUNCTION org_mashreqbank.create_user_session(p_user_id integer, p_session_token character varying, p_expires_at timestamp without time zone) RETURNS integer
--     LANGUAGE plpgsql
--     AS $$
-- DECLARE
--     session_id INTEGER;
-- BEGIN
--     -- Clean up expired sessions for this user
--     DELETE FROM user_sessions 
--     WHERE user_id = p_user_id AND expires_at < NOW();
    
--     -- Insert new session
--     INSERT INTO user_sessions (user_id, session_token, expires_at)
--     VALUES (p_user_id, p_session_token, p_expires_at)
--     RETURNING id INTO session_id;
    
--     -- Update user's last login
--     UPDATE users 
--     SET last_login = NOW(), login_attempts = 0
--     WHERE id = p_user_id;
    
--     RETURN session_id;
-- END;
-- $$;


-- ALTER FUNCTION org_mashreqbank.create_user_session(p_user_id integer, p_session_token character varying, p_expires_at timestamp without time zone) OWNER TO neondb_owner;

-- --
-- -- TOC entry 738 (class 1255 OID 917539)
-- -- Name: create_user_session(integer, integer, character varying, inet, text); Type: FUNCTION; Schema: public; Owner: neondb_owner
-- --

-- CREATE FUNCTION org_mashreqbank.create_user_session(p_user_id integer, p_organization_id integer, p_session_token character varying, p_ip_address inet DEFAULT NULL::inet, p_user_agent text DEFAULT NULL::text) RETURNS boolean
--     LANGUAGE plpgsql
--     AS $$
-- BEGIN
--     INSERT INTO user_sessions (user_id, organization_id, session_token, expires_at, ip_address, user_agent)
--     VALUES (p_user_id, p_organization_id, p_session_token, NOW() + INTERVAL '24 hours', p_ip_address, p_user_agent);
    
--     RETURN true;
-- EXCEPTION
--     WHEN OTHERS THEN
--         RETURN false;
-- END;
-- $$;


-- ALTER FUNCTION org_mashreqbank.create_user_session(p_user_id integer, p_organization_id integer, p_session_token character varying, p_ip_address inet, p_user_agent text) OWNER TO neondb_owner;

-- --
-- -- TOC entry 655 (class 1255 OID 253962)
-- -- Name: generate_asset_id(); Type: FUNCTION; Schema: public; Owner: neondb_owner
-- --

-- CREATE FUNCTION org_mashreqbank.generate_asset_id() RETURNS character varying
--     LANGUAGE plpgsql
--     AS $$
-- DECLARE
--     next_num INTEGER;
--     asset_id_str VARCHAR(20);
-- BEGIN
--     -- Get the next sequence value
--     SELECT nextval('asset_id_seq') INTO next_num;
    
--     -- Format as ASST-XXXXXXX (7 digits with leading zeros)
--     asset_id_str := 'ASST-' || LPAD(next_num::TEXT, 7, '0');
    
--     RETURN asset_id_str;
-- END;
-- $$;


-- ALTER FUNCTION org_mashreqbank.generate_asset_id() OWNER TO neondb_owner;

-- --
-- -- TOC entry 699 (class 1255 OID 671745)
-- -- Name: generate_fair_risk_id(); Type: FUNCTION; Schema: public; Owner: neondb_owner
-- --

-- CREATE FUNCTION org_mashreqbank.generate_fair_risk_id() RETURNS character varying
--     LANGUAGE plpgsql
--     AS $$
-- DECLARE
--     next_id INTEGER;
--     formatted_id VARCHAR(20);
-- BEGIN
--     -- Get next sequence value
--     SELECT nextval('fair_risk_id_seq') INTO next_id;
    
--     -- Format as FAIR-XXXXXX (6 digits with leading zeros)
--     formatted_id := 'FAIR-' || LPAD(next_id::TEXT, 6, '0');
    
--     RETURN formatted_id;
-- END;
-- $$;


-- ALTER FUNCTION org_mashreqbank.generate_fair_risk_id() OWNER TO neondb_owner;

-- --
-- -- TOC entry 705 (class 1255 OID 688227)
-- -- Name: generate_iso27001_control_id(); Type: FUNCTION; Schema: public; Owner: neondb_owner
-- --

-- CREATE FUNCTION org_mashreqbank.generate_iso27001_control_id() RETURNS trigger
--     LANGUAGE plpgsql
--     AS $$
-- BEGIN
--     NEW.control_id := 'ISO-TC-' || LPAD(nextval('iso27001_treatment_controls_id_seq')::text, 6, '0');
--     RETURN NEW;
-- END;
-- $$;


-- ALTER FUNCTION org_mashreqbank.generate_iso27001_control_id() OWNER TO neondb_owner;

-- --
-- -- TOC entry 704 (class 1255 OID 688226)
-- -- Name: generate_iso27001_treatment_plan_id(); Type: FUNCTION; Schema: public; Owner: neondb_owner
-- --

-- CREATE FUNCTION org_mashreqbank.generate_iso27001_treatment_plan_id() RETURNS trigger
--     LANGUAGE plpgsql
--     AS $$
-- BEGIN
--     NEW.plan_id := 'ISO-TP-' || LPAD(nextval('iso27001_treatment_plans_id_seq')::text, 6, '0');
--     RETURN NEW;
-- END;
-- $$;


-- ALTER FUNCTION org_mashreqbank.generate_iso27001_treatment_plan_id() OWNER TO neondb_owner;

-- --
-- -- TOC entry 654 (class 1255 OID 253954)
-- -- Name: generate_next_asset_id(); Type: FUNCTION; Schema: public; Owner: neondb_owner
-- --

-- CREATE FUNCTION org_mashreqbank.generate_next_asset_id() RETURNS character varying
--     LANGUAGE plpgsql
--     AS $_$
-- DECLARE
--     next_number INTEGER;
--     formatted_id VARCHAR(20);
-- BEGIN
--     -- Get the highest existing asset number
--     SELECT COALESCE(
--         MAX(CAST(SUBSTRING(asset_id FROM 'ASST - (\d+)') AS INTEGER)), 
--         0
--     ) + 1 INTO next_number
--     FROM information_assets 
--     WHERE asset_id IS NOT NULL AND asset_id ~ '^ASST - \d{7}$';
    
--     -- Format the ID with leading zeros
--     formatted_id := 'ASST - ' || LPAD(next_number::TEXT, 7, '0');
    
--     RETURN formatted_id;
-- END;
-- $_$;


-- ALTER FUNCTION org_mashreqbank.generate_next_asset_id() OWNER TO neondb_owner;

-- --
-- -- TOC entry 706 (class 1255 OID 360657)
-- -- Name: generate_risk_id(); Type: FUNCTION; Schema: public; Owner: neondb_owner
-- --

-- CREATE FUNCTION org_mashreqbank.generate_risk_id() RETURNS text
--     LANGUAGE plpgsql
--     AS $$
-- DECLARE
--     next_id INTEGER;
--     formatted_id TEXT;
-- BEGIN
--     -- Get next sequence value
--     next_id := nextval('risk_id_seq');
    
--     -- Format as RISK-XXXX (4 digits with leading zeros)
--     formatted_id := 'RISK-' || LPAD(next_id::TEXT, 4, '0');
    
--     -- Check if this ID already exists (in case of manual entries)
--     WHILE EXISTS (SELECT 1 FROM risks WHERE risk_id = formatted_id) LOOP
--         next_id := nextval('risk_id_seq');
--         formatted_id := 'RISK-' || LPAD(next_id::TEXT, 4, '0');
--     END LOOP;
    
--     RETURN formatted_id;
-- END;
-- $$;


-- ALTER FUNCTION org_mashreqbank.generate_risk_id() OWNER TO neondb_owner;

-- --
-- -- TOC entry 739 (class 1255 OID 925730)
-- -- Name: get_accessible_schemas(text); Type: FUNCTION; Schema: public; Owner: neondb_owner
-- --

-- CREATE FUNCTION org_mashreqbank.get_accessible_schemas(user_email text) RETURNS text[]
--     LANGUAGE plpgsql
--     AS $$
-- DECLARE
--     user_role TEXT;
--     user_org_schema TEXT;
--     schemas TEXT[];
-- BEGIN
--     -- Get user role and organization schema
--     SELECT u.role, o.schema_name INTO user_role, user_org_schema
--     FROM users u
--     JOIN organizations o ON u.organization_id = o.id
--     WHERE u.email = user_email AND u.is_active = TRUE;

--     IF user_role = 'super_admin' THEN
--         -- Super admin can access all schemas
--         SELECT ARRAY(
--             SELECT schema_name 
--             FROM organizations 
--             WHERE is_active = TRUE
--             UNION
--             SELECT 'public'
--         ) INTO schemas;
--     ELSE
--         -- Regular users can only access their organization schema
--         schemas := ARRAY[user_org_schema];
--     END IF;

--     RETURN schemas;
-- END;
-- $$;


-- ALTER FUNCTION org_mashreqbank.get_accessible_schemas(user_email text) OWNER TO neondb_owner;

-- --
-- -- TOC entry 708 (class 1255 OID 466946)
-- -- Name: get_risk_controls(integer[]); Type: FUNCTION; Schema: public; Owner: neondb_owner
-- --

-- CREATE FUNCTION org_mashreqbank.get_risk_controls(control_ids integer[]) RETURNS TABLE(id integer, control_code character varying, control_title text, control_description text, category_code character varying, category_name character varying)
--     LANGUAGE plpgsql
--     AS $$
-- BEGIN
--     RETURN QUERY
--     SELECT 
--         c.id,
--         c.control_code,
--         c.control_title,
--         c.control_description,
--         cat.category_code,
--         cat.category_name
--     FROM iso27002_controls c
--     JOIN iso27002_categories cat ON c.category_id = cat.id
--     WHERE c.id = ANY(control_ids)
--     ORDER BY c.control_code;
-- END;
-- $$;


-- ALTER FUNCTION org_mashreqbank.get_risk_controls(control_ids integer[]) OWNER TO neondb_owner;

-- --
-- -- TOC entry 6909 (class 0 OID 0)
-- -- Dependencies: 708
-- -- Name: FUNCTION get_risk_controls(control_ids integer[]); Type: COMMENT; Schema: public; Owner: neondb_owner
-- --

-- COMMENT ON FUNCTION org_mashreqbank.get_risk_controls(control_ids integer[]) IS 'Returns control details for an array of control IDs';


-- --
-- -- TOC entry 745 (class 1255 OID 958480)
-- -- Name: handle_failed_login(character varying); Type: FUNCTION; Schema: public; Owner: neondb_owner
-- --

-- CREATE FUNCTION org_mashreqbank.handle_failed_login(p_email character varying) RETURNS void
--     LANGUAGE plpgsql
--     AS $$
-- DECLARE
--     current_attempts INTEGER;
-- BEGIN
--     UPDATE users 
--     SET login_attempts = login_attempts + 1
--     WHERE email = p_email
--     RETURNING login_attempts INTO current_attempts;
    
--     -- Lock account after 5 failed attempts for 15 minutes
--     IF current_attempts >= 5 THEN
--         UPDATE users 
--         SET locked_until = NOW() + INTERVAL '15 minutes'
--         WHERE email = p_email;
--     END IF;
-- END;
-- $$;


-- ALTER FUNCTION org_mashreqbank.handle_failed_login(p_email character varying) OWNER TO neondb_owner;

-- --
-- -- TOC entry 735 (class 1255 OID 910714)
-- -- Name: hash_password(text); Type: FUNCTION; Schema: public; Owner: neondb_owner
-- --

-- CREATE FUNCTION org_mashreqbank.hash_password(password text) RETURNS text
--     LANGUAGE plpgsql
--     AS $$
-- BEGIN
--     RETURN crypt(password, gen_salt('bf', 12));
-- END;
-- $$;


-- ALTER FUNCTION org_mashreqbank.hash_password(password text) OWNER TO neondb_owner;

-- --
-- -- TOC entry 694 (class 1255 OID 311373)
-- -- Name: log_iso27001_risk_assessment_changes(); Type: FUNCTION; Schema: public; Owner: neondb_owner
-- --

-- CREATE FUNCTION org_mashreqbank.log_iso27001_risk_assessment_changes() RETURNS trigger
--     LANGUAGE plpgsql
--     AS $$
-- BEGIN
--     IF TG_OP = 'INSERT' THEN
--         INSERT INTO audit_log (table_name, operation, record_id, new_values, user_id, timestamp)
--         VALUES ('iso27001_risk_assessments', 'INSERT', NEW.id, row_to_json(NEW), NEW.created_by, CURRENT_TIMESTAMP);
--         RETURN NEW;
--     ELSIF TG_OP = 'UPDATE' THEN
--         INSERT INTO audit_log (table_name, operation, record_id, old_values, new_values, user_id, timestamp)
--         VALUES ('iso27001_risk_assessments', 'UPDATE', NEW.id, row_to_json(OLD), row_to_json(NEW), NEW.updated_by, CURRENT_TIMESTAMP);
--         RETURN NEW;
--     ELSIF TG_OP = 'DELETE' THEN
--         INSERT INTO audit_log (table_name, operation, record_id, old_values, user_id, timestamp)
--         VALUES ('iso27001_risk_assessments', 'DELETE', OLD.id, row_to_json(OLD), OLD.updated_by, CURRENT_TIMESTAMP);
--         RETURN OLD;
--     END IF;
--     RETURN NULL;
-- END;
-- $$;


-- ALTER FUNCTION org_mashreqbank.log_iso27001_risk_assessment_changes() OWNER TO neondb_owner;

-- --
-- -- TOC entry 667 (class 1255 OID 98440)
-- -- Name: log_risk_assessment_changes(); Type: FUNCTION; Schema: public; Owner: neondb_owner
-- --

-- CREATE FUNCTION org_mashreqbank.log_risk_assessment_changes() RETURNS trigger
--     LANGUAGE plpgsql
--     AS $$
-- BEGIN
--     -- Log workflow stage changes
--     IF OLD.workflow_stage IS DISTINCT FROM NEW.workflow_stage THEN
--         INSERT INTO risk_assessment_history (assessment_id, field_name, old_value, new_value, changed_by)
--         VALUES (NEW.id, 'workflow_stage', OLD.workflow_stage::text, NEW.workflow_stage::text, NEW.updated_by);
--     END IF;
    
--     -- Log assessment status changes
--     IF OLD.assessment_status IS DISTINCT FROM NEW.assessment_status THEN
--         INSERT INTO risk_assessment_history (assessment_id, field_name, old_value, new_value, changed_by)
--         VALUES (NEW.id, 'assessment_status', OLD.assessment_status, NEW.assessment_status, NEW.updated_by);
--     END IF;
    
--     -- Log residual risk changes
--     IF OLD.residual_risk_score IS DISTINCT FROM NEW.residual_risk_score THEN
--         INSERT INTO risk_assessment_history (assessment_id, field_name, old_value, new_value, changed_by)
--         VALUES (NEW.id, 'residual_risk_score', OLD.residual_risk_score::text, NEW.residual_risk_score::text, NEW.updated_by);
--     END IF;
    
--     RETURN NEW;
-- END;
-- $$;


-- ALTER FUNCTION org_mashreqbank.log_risk_assessment_changes() OWNER TO neondb_owner;

-- --
-- -- TOC entry 657 (class 1255 OID 253963)
-- -- Name: set_asset_id(); Type: FUNCTION; Schema: public; Owner: neondb_owner
-- --

-- CREATE FUNCTION org_mashreqbank.set_asset_id() RETURNS trigger
--     LANGUAGE plpgsql
--     AS $$
-- BEGIN
--     IF NEW.asset_id IS NULL OR NEW.asset_id = '' THEN
--         NEW.asset_id := generate_asset_id();
--     END IF;
--     RETURN NEW;
-- END;
-- $$;


-- ALTER FUNCTION org_mashreqbank.set_asset_id() OWNER TO neondb_owner;

-- --
-- -- TOC entry 700 (class 1255 OID 671746)
-- -- Name: set_fair_risk_id(); Type: FUNCTION; Schema: public; Owner: neondb_owner
-- --

-- CREATE FUNCTION org_mashreqbank.set_fair_risk_id() RETURNS trigger
--     LANGUAGE plpgsql
--     AS $$
-- BEGIN
--     IF NEW.risk_id IS NULL THEN
--         NEW.risk_id := generate_fair_risk_id();
--     END IF;
--     RETURN NEW;
-- END;
-- $$;


-- ALTER FUNCTION org_mashreqbank.set_fair_risk_id() OWNER TO neondb_owner;

-- --
-- -- TOC entry 711 (class 1255 OID 491532)
-- -- Name: set_remediation_due_date(); Type: FUNCTION; Schema: public; Owner: neondb_owner
-- --

-- CREATE FUNCTION org_mashreqbank.set_remediation_due_date() RETURNS trigger
--     LANGUAGE plpgsql
--     AS $$
-- BEGIN
--     -- Set remediation due date based on TAT days if not already set
--     IF NEW.remediation_due_date IS NULL AND NEW.tat_days IS NOT NULL THEN
--         NEW.remediation_due_date = NEW.created_at::DATE + INTERVAL '1 day' * NEW.tat_days;
--     END IF;
    
--     -- Set remediation completed date when status changes to resolved
--     IF NEW.remediation_status = 'Resolved' AND OLD.remediation_status != 'Resolved' AND NEW.remediation_completed_date IS NULL THEN
--         NEW.remediation_completed_date = CURRENT_DATE;
--     END IF;
    
--     RETURN NEW;
-- END;
-- $$;


-- ALTER FUNCTION org_mashreqbank.set_remediation_due_date() OWNER TO neondb_owner;

-- --
-- -- TOC entry 709 (class 1255 OID 466947)
-- -- Name: sync_control_fields(); Type: FUNCTION; Schema: public; Owner: neondb_owner
-- --

-- CREATE FUNCTION org_mashreqbank.sync_control_fields() RETURNS trigger
--     LANGUAGE plpgsql
--     AS $$
-- BEGIN
--     -- If multiple controls are set, clear the single control field
--     IF array_length(NEW.iso27002_control_ids, 1) > 1 THEN
--         NEW.iso27002_control_id := NULL;
--     -- If only one control in array, sync it to single field
--     ELSIF array_length(NEW.iso27002_control_ids, 1) = 1 THEN
--         NEW.iso27002_control_id := NEW.iso27002_control_ids[1];
--     -- If array is empty, clear single field
--     ELSE
--         NEW.iso27002_control_id := NULL;
--     END IF;
    
--     RETURN NEW;
-- END;
-- $$;


-- ALTER FUNCTION org_mashreqbank.sync_control_fields() OWNER TO neondb_owner;

-- --
-- -- TOC entry 6910 (class 0 OID 0)
-- -- Dependencies: 709
-- -- Name: FUNCTION sync_control_fields(); Type: COMMENT; Schema: public; Owner: neondb_owner
-- --

-- COMMENT ON FUNCTION org_mashreqbank.sync_control_fields() IS 'Synchronizes single and multiple control fields';


-- --
-- -- TOC entry 642 (class 1255 OID 90188)
-- -- Name: track_risk_treatment_changes(); Type: FUNCTION; Schema: public; Owner: neondb_owner
-- --

-- CREATE FUNCTION org_mashreqbank.track_risk_treatment_changes() RETURNS trigger
--     LANGUAGE plpgsql
--     AS $$
-- BEGIN
--     IF TG_OP = 'UPDATE' THEN
--         INSERT INTO risk_treatment_history (
--             treatment_plan_id, 
--             changed_by, 
--             change_type, 
--             old_values, 
--             new_values,
--             change_reason
--         ) VALUES (
--             NEW.id,
--             COALESCE(NEW.created_by, 'system'),
--             'UPDATE',
--             row_to_json(OLD),
--             row_to_json(NEW),
--             'Treatment plan updated'
--         );
--     END IF;
--     RETURN NEW;
-- END;
-- $$;


-- ALTER FUNCTION org_mashreqbank.track_risk_treatment_changes() OWNER TO neondb_owner;

-- --
-- -- TOC entry 714 (class 1255 OID 712705)
-- -- Name: update_aging_status(); Type: FUNCTION; Schema: public; Owner: neondb_owner
-- --

-- CREATE FUNCTION org_mashreqbank.update_aging_status() RETURNS trigger
--     LANGUAGE plpgsql
--     AS $$
-- BEGIN
--     NEW.aging_status := 
--             CASE 
--                         WHEN NEW.due_date IS NULL THEN 'No Due Date'
--                                     WHEN NEW.due_date < CURRENT_DATE THEN 'Overdue'
--                                                 WHEN NEW.due_date = CURRENT_DATE THEN 'Due Today'
--                                                             WHEN NEW.due_date <= CURRENT_DATE + INTERVAL '7 days' THEN 'Due Soon'
--                                                                         ELSE 'On Track'
--                                                                                 END;
--                                                                                     RETURN NEW;
--                                                                                     END;
--                                                                                     $$;


-- ALTER FUNCTION org_mashreqbank.update_aging_status() OWNER TO neondb_owner;

-- --
-- -- TOC entry 697 (class 1255 OID 614413)
-- -- Name: update_ai_analysis_timestamp(); Type: FUNCTION; Schema: public; Owner: neondb_owner
-- --

-- CREATE FUNCTION org_mashreqbank.update_ai_analysis_timestamp() RETURNS trigger
--     LANGUAGE plpgsql
--     AS $$
-- BEGIN
--     NEW.updated_at = CURRENT_TIMESTAMP;
--     RETURN NEW;
-- END;
-- $$;


-- ALTER FUNCTION org_mashreqbank.update_ai_analysis_timestamp() OWNER TO neondb_owner;

-- --
-- -- TOC entry 698 (class 1255 OID 622594)
-- -- Name: update_ai_analysis_updated_at(); Type: FUNCTION; Schema: public; Owner: neondb_owner
-- --

-- CREATE FUNCTION org_mashreqbank.update_ai_analysis_updated_at() RETURNS trigger
--     LANGUAGE plpgsql
--     AS $$
-- BEGIN
--     NEW.updated_at = CURRENT_TIMESTAMP;
--     RETURN NEW;
-- END;
-- $$;


-- ALTER FUNCTION org_mashreqbank.update_ai_analysis_updated_at() OWNER TO neondb_owner;

-- --
-- -- TOC entry 715 (class 1255 OID 106651)
-- -- Name: update_assessment_findings_count(); Type: FUNCTION; Schema: public; Owner: neondb_owner
-- --

-- CREATE FUNCTION org_mashreqbank.update_assessment_findings_count() RETURNS trigger
--     LANGUAGE plpgsql
--     AS $$
-- BEGIN
--     IF TG_OP = 'INSERT' THEN
--         UPDATE assessments 
--         SET findings_count = findings_count + 1,
--             updated_at = CURRENT_TIMESTAMP
--         WHERE id = NEW.assessment_id;
--         RETURN NEW;
--     ELSIF TG_OP = 'DELETE' THEN
--         UPDATE assessments 
--         SET findings_count = findings_count - 1,
--             updated_at = CURRENT_TIMESTAMP
--         WHERE id = OLD.assessment_id;
--         RETURN OLD;
--     ELSIF TG_OP = 'UPDATE' AND OLD.assessment_id != NEW.assessment_id THEN
--         -- If assessment_id changed, update both old and new assessments
--         UPDATE assessments 
--         SET findings_count = findings_count - 1,
--             updated_at = CURRENT_TIMESTAMP
--         WHERE id = OLD.assessment_id;
        
--         UPDATE assessments 
--         SET findings_count = findings_count + 1,
--             updated_at = CURRENT_TIMESTAMP
--         WHERE id = NEW.assessment_id;
--         RETURN NEW;
--     END IF;
--     RETURN COALESCE(NEW, OLD);
-- END;
-- $$;


-- ALTER FUNCTION org_mashreqbank.update_assessment_findings_count() OWNER TO neondb_owner;

-- --
-- -- TOC entry 702 (class 1255 OID 680007)
-- -- Name: update_fair_treatment_controls_updated_at(); Type: FUNCTION; Schema: public; Owner: neondb_owner
-- --

-- CREATE FUNCTION org_mashreqbank.update_fair_treatment_controls_updated_at() RETURNS trigger
--     LANGUAGE plpgsql
--     AS $$
-- BEGIN
--     NEW.updated_at = CURRENT_TIMESTAMP;
--     RETURN NEW;
-- END;
-- $$;


-- ALTER FUNCTION org_mashreqbank.update_fair_treatment_controls_updated_at() OWNER TO neondb_owner;

-- --
-- -- TOC entry 701 (class 1255 OID 680006)
-- -- Name: update_fair_treatment_plans_updated_at(); Type: FUNCTION; Schema: public; Owner: neondb_owner
-- --

-- CREATE FUNCTION org_mashreqbank.update_fair_treatment_plans_updated_at() RETURNS trigger
--     LANGUAGE plpgsql
--     AS $$
-- BEGIN
--     NEW.updated_at = CURRENT_TIMESTAMP;
--     RETURN NEW;
-- END;
-- $$;


-- ALTER FUNCTION org_mashreqbank.update_fair_treatment_plans_updated_at() OWNER TO neondb_owner;

-- --
-- -- TOC entry 732 (class 1255 OID 827392)
-- -- Name: update_findings_count_in_findings(); Type: FUNCTION; Schema: public; Owner: neondb_owner
-- --

-- CREATE FUNCTION org_mashreqbank.update_findings_count_in_findings() RETURNS trigger
--     LANGUAGE plpgsql
--     AS $$
-- BEGIN
--   -- Handle INSERT: Increment findings_count for the finding_id
--   IF TG_OP = 'INSERT' THEN
--     UPDATE assessment_findings
--     SET findings_count = (
--       SELECT COUNT(*) 
--       FROM assessment_findings 
--       WHERE assessment_findings.id = NEW.assessment_findings.id
--     )
--     WHERE id = NEW.finding_id;
--     RETURN NEW;
--   END IF;

--   -- Handle DELETE: Decrement findings_count for the finding_id
--   IF TG_OP = 'DELETE' THEN
--     UPDATE assessment_findings
--     SET findings_count = (
--       SELECT COUNT(*) 
--       FROM assessment_findings 
--       WHERE assessment_findings.id = OLD.assessment_findings.id
--     )
--     WHERE id = OLD.assessment_findings.id;
--     RETURN OLD;
--   END IF;

--   -- Handle UPDATE: Update findings_count for both old and new finding_id
--   IF TG_OP = 'UPDATE' THEN
--     IF OLD.finding_id != NEW.finding_id THEN
--       UPDATE assessment_findings
--       SET findings_count = (
--         SELECT COUNT(*) 
--         FROM assessment_findings
--         WHERE assessment_findings.id = OLD.assessment_findings.id
--       )
--       WHERE id = OLD.assessment_findings.id;
      
--       UPDATE assessment_findings
--       SET findings_count = (
--         SELECT COUNT(*) 
--         FROM assessment_findings 
--         WHERE assessment_findings.id = NEW.assessment_findings.id
--       )
--       WHERE id = NEW.assessment_findings.id;
--     ELSE
--       UPDATE assessment_findings
--       SET findings_count = (
--         SELECT COUNT(*) 
--         FROM assessment_findings
--         WHERE assessment_findings.id = NEW.assessment_findings.id
--       )
--       WHERE id = NEW.assessment_findings.id;
--     END IF;
--     RETURN NEW;
--   END IF;

--   RETURN NULL;
-- END;
-- $$;


-- ALTER FUNCTION org_mashreqbank.update_findings_count_in_findings() OWNER TO neondb_owner;

-- --
-- -- TOC entry 696 (class 1255 OID 598046)
-- -- Name: update_hipaa_assessment_results_updated_at(); Type: FUNCTION; Schema: public; Owner: neondb_owner
-- --

-- CREATE FUNCTION org_mashreqbank.update_hipaa_assessment_results_updated_at() RETURNS trigger
--     LANGUAGE plpgsql
--     AS $$
-- BEGIN
--     NEW.updated_at = CURRENT_TIMESTAMP;
--     RETURN NEW;
-- END;
-- $$;


-- ALTER FUNCTION org_mashreqbank.update_hipaa_assessment_results_updated_at() OWNER TO neondb_owner;

-- --
-- -- TOC entry 675 (class 1255 OID 450579)
-- -- Name: update_incidents_updated_at(); Type: FUNCTION; Schema: public; Owner: neondb_owner
-- --

-- CREATE FUNCTION org_mashreqbank.update_incidents_updated_at() RETURNS trigger
--     LANGUAGE plpgsql
--     AS $$
-- BEGIN
--     NEW.updated_at = NOW();
--     RETURN NEW;
-- END;
-- $$;


-- ALTER FUNCTION org_mashreqbank.update_incidents_updated_at() OWNER TO neondb_owner;

-- --
-- -- TOC entry 712 (class 1255 OID 688228)
-- -- Name: update_iso27001_aging(); Type: FUNCTION; Schema: public; Owner: neondb_owner
-- --

-- CREATE FUNCTION org_mashreqbank.update_iso27001_aging() RETURNS trigger
--     LANGUAGE plpgsql
--     AS $$
-- BEGIN
--     -- Update plan aging
--     IF TG_TABLE_NAME = 'iso27001_treatment_plans' THEN
--         IF NEW.target_completion_date IS NOT NULL AND NEW.actual_completion_date IS NULL THEN
--             NEW.plan_aging_days := GREATEST(0, CURRENT_DATE - NEW.target_completion_date);
--         ELSE
--             NEW.plan_aging_days := 0;
--         END IF;
--     END IF;
    
--     -- Update control aging
--     IF TG_TABLE_NAME = 'iso27001_treatment_controls' THEN
--         IF NEW.due_date IS NOT NULL AND NEW.completion_date IS NULL THEN
--             NEW.aging_days := GREATEST(0, CURRENT_DATE - NEW.due_date);
            
--             -- Update aging status
--             IF NEW.implementation_status = 'completed' THEN
--                 NEW.aging_status := 'completed';
--             ELSIF NEW.aging_days > 0 THEN
--                 NEW.aging_status := 'overdue';
--             ELSIF NEW.aging_days >= -7 THEN
--                 NEW.aging_status := 'due_soon';
--             ELSE
--                 NEW.aging_status := 'on_track';
--             END IF;
--         ELSE
--             NEW.aging_days := 0;
--             NEW.aging_status := CASE WHEN NEW.implementation_status = 'completed' THEN 'completed' ELSE 'on_track' END;
--         END IF;
--     END IF;
    
--     NEW.updated_at := CURRENT_TIMESTAMP;
--     RETURN NEW;
-- END;
-- $$;


-- ALTER FUNCTION org_mashreqbank.update_iso27001_aging() OWNER TO neondb_owner;

-- --
-- -- TOC entry 677 (class 1255 OID 483353)
-- -- Name: update_iso27001_risks_updated_at(); Type: FUNCTION; Schema: public; Owner: neondb_owner
-- --

-- CREATE FUNCTION org_mashreqbank.update_iso27001_risks_updated_at() RETURNS trigger
--     LANGUAGE plpgsql
--     AS $$
-- BEGIN
--     NEW.updated_at = CURRENT_TIMESTAMP;
--     RETURN NEW;
-- END;
-- $$;


-- ALTER FUNCTION org_mashreqbank.update_iso27001_risks_updated_at() OWNER TO neondb_owner;

-- --
-- -- TOC entry 643 (class 1255 OID 139339)
-- -- Name: update_iso27001_templates_updated_at(); Type: FUNCTION; Schema: public; Owner: neondb_owner
-- --

-- CREATE FUNCTION org_mashreqbank.update_iso27001_templates_updated_at() RETURNS trigger
--     LANGUAGE plpgsql
--     AS $$
-- BEGIN
--     NEW.updated_at = CURRENT_TIMESTAMP;
--     RETURN NEW;
-- END;
-- $$;


-- ALTER FUNCTION org_mashreqbank.update_iso27001_templates_updated_at() OWNER TO neondb_owner;

-- --
-- -- TOC entry 695 (class 1255 OID 589894)
-- -- Name: update_nesa_gap_analysis_updated_at(); Type: FUNCTION; Schema: public; Owner: neondb_owner
-- --

-- CREATE FUNCTION org_mashreqbank.update_nesa_gap_analysis_updated_at() RETURNS trigger
--     LANGUAGE plpgsql
--     AS $$
-- BEGIN
--     NEW.updated_at = CURRENT_TIMESTAMP;
--     RETURN NEW;
-- END;
-- $$;


-- ALTER FUNCTION org_mashreqbank.update_nesa_gap_analysis_updated_at() OWNER TO neondb_owner;

-- --
-- -- TOC entry 644 (class 1255 OID 696352)
-- -- Name: update_nist_csf_mitigation_plans_updated_at(); Type: FUNCTION; Schema: public; Owner: neondb_owner
-- --

-- CREATE FUNCTION org_mashreqbank.update_nist_csf_mitigation_plans_updated_at() RETURNS trigger
--     LANGUAGE plpgsql
--     AS $$
-- BEGIN
--     NEW.updated_at = CURRENT_TIMESTAMP;
--     RETURN NEW;
-- END;
-- $$;


-- ALTER FUNCTION org_mashreqbank.update_nist_csf_mitigation_plans_updated_at() OWNER TO neondb_owner;

-- --
-- -- TOC entry 646 (class 1255 OID 704517)
-- -- Name: update_nist_mitigation_plans_updated_at(); Type: FUNCTION; Schema: public; Owner: neondb_owner
-- --

-- CREATE FUNCTION org_mashreqbank.update_nist_mitigation_plans_updated_at() RETURNS trigger
--     LANGUAGE plpgsql
--     AS $$
-- BEGIN
--     NEW.updated_at = CURRENT_TIMESTAMP;
--     RETURN NEW;
-- END;
-- $$;


-- ALTER FUNCTION org_mashreqbank.update_nist_mitigation_plans_updated_at() OWNER TO neondb_owner;

-- --
-- -- TOC entry 670 (class 1255 OID 344182)
-- -- Name: update_nist_references_updated_at(); Type: FUNCTION; Schema: public; Owner: neondb_owner
-- --

-- CREATE FUNCTION org_mashreqbank.update_nist_references_updated_at() RETURNS trigger
--     LANGUAGE plpgsql
--     AS $$
-- BEGIN
--     NEW.updated_at = NOW();
--     RETURN NEW;
-- END;
-- $$;


-- ALTER FUNCTION org_mashreqbank.update_nist_references_updated_at() OWNER TO neondb_owner;

-- --
-- -- TOC entry 640 (class 1255 OID 82109)
-- -- Name: update_risk_assessment_updated_at(); Type: FUNCTION; Schema: public; Owner: neondb_owner
-- --

-- CREATE FUNCTION org_mashreqbank.update_risk_assessment_updated_at() RETURNS trigger
--     LANGUAGE plpgsql
--     AS $$
-- BEGIN
--     NEW.updated_at = CURRENT_TIMESTAMP;
--     RETURN NEW;
-- END;
-- $$;


-- ALTER FUNCTION org_mashreqbank.update_risk_assessment_updated_at() OWNER TO neondb_owner;

-- --
-- -- TOC entry 666 (class 1255 OID 327745)
-- -- Name: update_risk_asset_relationships_updated_at(); Type: FUNCTION; Schema: public; Owner: neondb_owner
-- --

-- CREATE FUNCTION org_mashreqbank.update_risk_asset_relationships_updated_at() RETURNS trigger
--     LANGUAGE plpgsql
--     AS $$
-- BEGIN
--     NEW.updated_at = CURRENT_TIMESTAMP;
--     RETURN NEW;
-- END;
-- $$;


-- ALTER FUNCTION org_mashreqbank.update_risk_asset_relationships_updated_at() OWNER TO neondb_owner;

-- --
-- -- TOC entry 649 (class 1255 OID 860236)
-- -- Name: update_sla_rules_updated_at(); Type: FUNCTION; Schema: public; Owner: neondb_owner
-- --

-- CREATE FUNCTION org_mashreqbank.update_sla_rules_updated_at() RETURNS trigger
--     LANGUAGE plpgsql
--     AS $$
-- BEGIN
--     NEW.updated_at = CURRENT_TIMESTAMP;
--     RETURN NEW;
-- END;
-- $$;


-- ALTER FUNCTION org_mashreqbank.update_sla_rules_updated_at() OWNER TO neondb_owner;

-- --
-- -- TOC entry 648 (class 1255 OID 860234)
-- -- Name: update_sla_templates_updated_at(); Type: FUNCTION; Schema: public; Owner: neondb_owner
-- --

-- CREATE FUNCTION org_mashreqbank.update_sla_templates_updated_at() RETURNS trigger
--     LANGUAGE plpgsql
--     AS $$
-- BEGIN
--     NEW.updated_at = CURRENT_TIMESTAMP;
--     RETURN NEW;
-- END;
-- $$;


-- ALTER FUNCTION org_mashreqbank.update_sla_templates_updated_at() OWNER TO neondb_owner;

-- --
-- -- TOC entry 647 (class 1255 OID 835611)
-- -- Name: update_tat_settings_updated_at(); Type: FUNCTION; Schema: public; Owner: neondb_owner
-- --

-- CREATE FUNCTION org_mashreqbank.update_tat_settings_updated_at() RETURNS trigger
--     LANGUAGE plpgsql
--     AS $$
-- BEGIN
--     NEW.updated_at = CURRENT_TIMESTAMP;
--     RETURN NEW;
-- END;
-- $$;


-- ALTER FUNCTION org_mashreqbank.update_tat_settings_updated_at() OWNER TO neondb_owner;

-- --
-- -- TOC entry 746 (class 1255 OID 876567)
-- -- Name: update_technology_risks_updated_at(); Type: FUNCTION; Schema: public; Owner: neondb_owner
-- --

-- CREATE FUNCTION org_mashreqbank.update_technology_risks_updated_at() RETURNS trigger
--     LANGUAGE plpgsql
--     AS $$
-- BEGIN
--     NEW.updated_at = CURRENT_TIMESTAMP;
--     RETURN NEW;
-- END;
-- $$;


-- ALTER FUNCTION org_mashreqbank.update_technology_risks_updated_at() OWNER TO neondb_owner;

-- --
-- -- TOC entry 747 (class 1255 OID 983091)
-- -- Name: update_third_party_assessment_timestamp(); Type: FUNCTION; Schema: public; Owner: neondb_owner
-- --

-- CREATE FUNCTION org_mashreqbank.update_third_party_assessment_timestamp() RETURNS trigger
--     LANGUAGE plpgsql
--     AS $$
-- BEGIN
--     NEW.updated_at = CURRENT_TIMESTAMP;
--     RETURN NEW;
-- END;
-- $$;


-- ALTER FUNCTION org_mashreqbank.update_third_party_assessment_timestamp() OWNER TO neondb_owner;

-- --
-- -- TOC entry 645 (class 1255 OID 213125)
-- -- Name: update_threat_assessments_updated_at(); Type: FUNCTION; Schema: public; Owner: neondb_owner
-- --

-- CREATE FUNCTION org_mashreqbank.update_threat_assessments_updated_at() RETURNS trigger
--     LANGUAGE plpgsql
--     AS $$
-- BEGIN
--     NEW.updated_at = CURRENT_TIMESTAMP;
--     RETURN NEW;
-- END;
-- $$;


-- ALTER FUNCTION org_mashreqbank.update_threat_assessments_updated_at() OWNER TO neondb_owner;

-- --
-- -- TOC entry 692 (class 1255 OID 98442)
-- -- Name: update_treatment_progress(); Type: FUNCTION; Schema: public; Owner: neondb_owner
-- --

-- CREATE FUNCTION org_mashreqbank.update_treatment_progress() RETURNS trigger
--     LANGUAGE plpgsql
--     AS $$
-- BEGIN
--     -- Update assessment workflow stage based on treatment action completion
--     UPDATE comprehensive_risk_assessments 
--     SET workflow_stage = GREATEST(workflow_stage, 4),
--         assessment_status = CASE 
--             WHEN (SELECT COUNT(*) FROM risk_treatment_actions WHERE assessment_id = NEW.assessment_id AND status = 'Completed') = 
--                  (SELECT COUNT(*) FROM risk_treatment_actions WHERE assessment_id = NEW.assessment_id) 
--             THEN 'Completed'
--             ELSE 'In Progress'
--         END,
--         updated_at = CURRENT_TIMESTAMP
--     WHERE id = NEW.assessment_id;
    
--     RETURN NEW;
-- END;
-- $$;


-- ALTER FUNCTION org_mashreqbank.update_treatment_progress() OWNER TO neondb_owner;

-- --
-- -- TOC entry 641 (class 1255 OID 65605)
-- -- Name: update_updated_at_column(); Type: FUNCTION; Schema: public; Owner: neondb_owner
-- --

-- CREATE FUNCTION org_mashreqbank.update_updated_at_column() RETURNS trigger
--     LANGUAGE plpgsql
--     AS $$
-- BEGIN
--     NEW.updated_at = CURRENT_TIMESTAMP;
--     RETURN NEW;
-- END;
-- $$;


-- ALTER FUNCTION org_mashreqbank.update_updated_at_column() OWNER TO neondb_owner;

-- --
-- -- TOC entry 748 (class 1255 OID 991249)
-- -- Name: update_vendors_updated_at(); Type: FUNCTION; Schema: public; Owner: neondb_owner
-- --

-- CREATE FUNCTION org_mashreqbank.update_vendors_updated_at() RETURNS trigger
--     LANGUAGE plpgsql
--     AS $$
-- BEGIN
--     NEW.updated_at = CURRENT_TIMESTAMP;
--     RETURN NEW;
-- END;
-- $$;


-- ALTER FUNCTION org_mashreqbank.update_vendors_updated_at() OWNER TO neondb_owner;

-- --
-- -- TOC entry 668 (class 1255 OID 344153)
-- -- Name: update_vulnerabilities_updated_at(); Type: FUNCTION; Schema: public; Owner: neondb_owner
-- --

-- CREATE FUNCTION org_mashreqbank.update_vulnerabilities_updated_at() RETURNS trigger
--     LANGUAGE plpgsql
--     AS $$
-- BEGIN
--     NEW.updated_at = NOW();
--     RETURN NEW;
-- END;
-- $$;


-- ALTER FUNCTION org_mashreqbank.update_vulnerabilities_updated_at() OWNER TO neondb_owner;

-- --
-- -- TOC entry 744 (class 1255 OID 958479)
-- -- Name: validate_session(character varying); Type: FUNCTION; Schema: public; Owner: neondb_owner
-- --

-- CREATE FUNCTION org_mashreqbank.validate_session(p_session_token character varying) RETURNS TABLE(user_id integer, email character varying, organization_id integer, schema_name character varying, is_valid boolean)
--     LANGUAGE plpgsql
--     AS $$
-- BEGIN
--     RETURN QUERY
--     SELECT 
--         u.id,
--         u.email,
--         u.organization_id,
--         COALESCE(o.schema_name, 'default_schema'),
--         CASE 
--             WHEN s.expires_at > NOW() AND u.status = 'Active' 
--             THEN TRUE 
--             ELSE FALSE 
--         END as is_valid
--     FROM user_sessions s
--     JOIN users u ON s.user_id = u.id
--     JOIN organizations o ON u.organization_id = o.id
--     WHERE s.session_token = p_session_token;
    
--     -- Update last accessed time
--     UPDATE user_sessions 
--     SET last_accessed = NOW() 
--     WHERE session_token = p_session_token;
-- END;
-- $$;


-- ALTER FUNCTION org_mashreqbank.validate_session(p_session_token character varying) OWNER TO neondb_owner;

-- --
-- -- TOC entry 736 (class 1255 OID 910715)
-- -- Name: verify_password(text, text); Type: FUNCTION; Schema: public; Owner: neondb_owner
-- --

-- CREATE FUNCTION org_mashreqbank.verify_password(password text, hash text) RETURNS boolean
--     LANGUAGE plpgsql
--     AS $$
-- BEGIN
--     RETURN hash = crypt(password, hash);
-- END;
-- $$;


-- ALTER FUNCTION org_mashreqbank.verify_password(password text, hash text) OWNER TO neondb_owner;

-- SET default_tablespace = '';

-- SET default_table_access_method = heap;

-- --
-- -- TOC entry 484 (class 1259 OID 614401)
-- -- Name: ai_analysis_results; Type: TABLE; Schema: public; Owner: neondb_owner
-- --

-- CREATE TABLE org_mashreqbank.ai_analysis_results (
--     id integer NOT NULL,
--     analysis_type character varying(100) NOT NULL,
--     analysis_content text NOT NULL,
--     created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
--     updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
-- );


-- ALTER TABLE org_mashreqbank.ai_analysis_results OWNER TO neondb_owner;

-- --
-- -- TOC entry 483 (class 1259 OID 614400)
-- -- Name: ai_analysis_results_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
-- --

-- CREATE SEQUENCE org_mashreqbank.ai_analysis_results_id_seq
--     AS integer
--     START WITH 1
--     INCREMENT BY 1
--     NO MINVALUE
--     NO MAXVALUE
--     CACHE 1;


-- ALTER SEQUENCE org_mashreqbank.ai_analysis_results_id_seq OWNER TO neondb_owner;

-- --
-- -- TOC entry 6912 (class 0 OID 0)
-- -- Dependencies: 483
-- -- Name: ai_analysis_results_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
-- --

-- ALTER SEQUENCE org_mashreqbank.ai_analysis_results_id_seq OWNED BY org_mashreqbank.ai_analysis_results.id;


-- --
-- -- TOC entry 255 (class 1259 OID 82045)
-- -- Name: assessment_action_plans; Type: TABLE; Schema: public; Owner: neondb_owner
-- --

-- CREATE TABLE org_mashreqbank.assessment_action_plans (
--     id integer NOT NULL,
--     assessment_id integer,
--     risk_evaluation_id integer,
--     action_type character varying(100) NOT NULL,
--     action_title character varying(255) NOT NULL,
--     action_description text,
--     mitigation_strategy character varying(100),
--     priority character varying(50),
--     assigned_to character varying(255),
--     due_date date,
--     estimated_cost numeric(15,2),
--     expected_risk_reduction numeric(5,2),
--     implementation_status character varying(50) DEFAULT 'Planned'::character varying,
--     completion_date date,
--     effectiveness_rating integer,
--     notes text,
--     created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
--     CONSTRAINT assessment_action_plans_effectiveness_rating_check CHECK (((effectiveness_rating >= 1) AND (effectiveness_rating <= 5)))
-- );


-- ALTER TABLE org_mashreqbank.assessment_action_plans OWNER TO neondb_owner;

-- --
-- -- TOC entry 254 (class 1259 OID 82044)
-- -- Name: assessment_action_plans_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
-- --

-- CREATE SEQUENCE org_mashreqbank.assessment_action_plans_id_seq
--     AS integer
--     START WITH 1
--     INCREMENT BY 1
--     NO MINVALUE
--     NO MAXVALUE
--     CACHE 1;


-- ALTER SEQUENCE org_mashreqbank.assessment_action_plans_id_seq OWNER TO neondb_owner;

-- --
-- -- TOC entry 6914 (class 0 OID 0)
-- -- Dependencies: 254
-- -- Name: assessment_action_plans_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
-- --

-- ALTER SEQUENCE org_mashreqbank.assessment_action_plans_id_seq OWNED BY org_mashreqbank.assessment_action_plans.id;


-- --
-- -- TOC entry 245 (class 1259 OID 81943)
-- -- Name: assessment_assets; Type: TABLE; Schema: public; Owner: neondb_owner
-- --

-- CREATE TABLE org_mashreqbank.assessment_assets (
--     id integer NOT NULL,
--     assessment_id integer,
--     asset_id integer,
--     asset_criticality character varying(50),
--     asset_value_rating integer,
--     created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
--     CONSTRAINT assessment_assets_asset_value_rating_check CHECK (((asset_value_rating >= 1) AND (asset_value_rating <= 5)))
-- );


-- ALTER TABLE org_mashreqbank.assessment_assets OWNER TO neondb_owner;

-- --
-- -- TOC entry 244 (class 1259 OID 81942)
-- -- Name: assessment_assets_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
-- --

-- CREATE SEQUENCE org_mashreqbank.assessment_assets_id_seq
--     AS integer
--     START WITH 1
--     INCREMENT BY 1
--     NO MINVALUE
--     NO MAXVALUE
--     CACHE 1;


-- ALTER SEQUENCE org_mashreqbank.assessment_assets_id_seq OWNER TO neondb_owner;

-- --
-- -- TOC entry 6915 (class 0 OID 0)
-- -- Dependencies: 244
-- -- Name: assessment_assets_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
-- --

-- ALTER SEQUENCE org_mashreqbank.assessment_assets_id_seq OWNED BY org_mashreqbank.assessment_assets.id;


-- --
-- -- TOC entry 405 (class 1259 OID 410014)
-- -- Name: assessment_attachments; Type: TABLE; Schema: public; Owner: neondb_owner
-- --

-- CREATE TABLE org_mashreqbank.assessment_attachments (
--     id uuid DEFAULT gen_random_uuid() NOT NULL,
--     assessment_id uuid,
--     file_name character varying(255) NOT NULL,
--     file_path character varying(500),
--     file_size integer,
--     file_type character varying(50),
--     uploaded_by uuid,
--     uploaded_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
-- );


-- ALTER TABLE org_mashreqbank.assessment_attachments OWNER TO neondb_owner;

-- --
-- -- TOC entry 257 (class 1259 OID 82067)
-- -- Name: assessment_comments; Type: TABLE; Schema: public; Owner: neondb_owner
-- --

-- CREATE TABLE org_mashreqbank.assessment_comments (
--     id integer NOT NULL,
--     assessment_id integer,
--     step_number integer,
--     comment_type character varying(50),
--     comment_text text NOT NULL,
--     created_by character varying(255),
--     created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
--     CONSTRAINT assessment_comments_step_number_check CHECK (((step_number >= 1) AND (step_number <= 7)))
-- );


-- ALTER TABLE org_mashreqbank.assessment_comments OWNER TO neondb_owner;

-- --
-- -- TOC entry 256 (class 1259 OID 82066)
-- -- Name: assessment_comments_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
-- --

-- CREATE SEQUENCE org_mashreqbank.assessment_comments_id_seq
--     AS integer
--     START WITH 1
--     INCREMENT BY 1
--     NO MINVALUE
--     NO MAXVALUE
--     CACHE 1;


-- ALTER SEQUENCE org_mashreqbank.assessment_comments_id_seq OWNER TO neondb_owner;

-- --
-- -- TOC entry 6916 (class 0 OID 0)
-- -- Dependencies: 256
-- -- Name: assessment_comments_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
-- --

-- ALTER SEQUENCE org_mashreqbank.assessment_comments_id_seq OWNED BY org_mashreqbank.assessment_comments.id;


-- --
-- -- TOC entry 509 (class 1259 OID 778359)
-- -- Name: assessment_findings; Type: TABLE; Schema: public; Owner: neondb_owner
-- --

-- CREATE TABLE org_mashreqbank.assessment_findings (
--     id integer NOT NULL,
--     assessment_id integer NOT NULL,
--     finding_title character varying(500) NOT NULL,
--     finding_description text NOT NULL,
--     severity character varying(50) DEFAULT 'Medium'::character varying NOT NULL,
--     category character varying(100),
--     recommendation text,
--     status character varying(50) DEFAULT 'Open'::character varying NOT NULL,
--     assigned_to character varying(200),
--     due_date date,
--     created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
--     updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
--     user_id integer,
--     department_id integer,
--     organization_id integer DEFAULT 1,
--     finding_reference character varying(100),
--     priority character varying(50) DEFAULT 'Medium'::character varying,
--     impact_rating integer,
--     likelihood_rating integer,
--     risk_score integer,
--     remediation_effort character varying(50),
--     business_impact text,
--     technical_impact text,
--     compliance_reference character varying(200),
--     evidence_location text,
--     retest_date date,
--     closure_date date,
--     closure_notes text,
--     findings_count integer,
--     CONSTRAINT assessment_findings_impact_rating_check CHECK (((impact_rating >= 1) AND (impact_rating <= 5))),
--     CONSTRAINT assessment_findings_likelihood_rating_check CHECK (((likelihood_rating >= 1) AND (likelihood_rating <= 5)))
-- );


-- ALTER TABLE org_mashreqbank.assessment_findings OWNER TO neondb_owner;

-- --
-- -- TOC entry 508 (class 1259 OID 778358)
-- -- Name: assessment_findings_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
-- --

-- CREATE SEQUENCE org_mashreqbank.assessment_findings_id_seq
--     AS integer
--     START WITH 1
--     INCREMENT BY 1
--     NO MINVALUE
--     NO MAXVALUE
--     CACHE 1;


-- ALTER SEQUENCE org_mashreqbank.assessment_findings_id_seq OWNER TO neondb_owner;

-- --
-- -- TOC entry 6917 (class 0 OID 0)
-- -- Dependencies: 508
-- -- Name: assessment_findings_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
-- --

-- ALTER SEQUENCE org_mashreqbank.assessment_findings_id_seq OWNED BY org_mashreqbank.assessment_findings.id;


-- --
-- -- TOC entry 251 (class 1259 OID 81995)
-- -- Name: assessment_impacts; Type: TABLE; Schema: public; Owner: neondb_owner
-- --

-- CREATE TABLE org_mashreqbank.assessment_impacts (
--     id integer NOT NULL,
--     assessment_id integer,
--     impact_category character varying(100) NOT NULL,
--     impact_type character varying(100),
--     impact_description text,
--     confidentiality_impact integer,
--     integrity_impact integer,
--     availability_impact integer,
--     financial_impact numeric(15,2),
--     operational_impact character varying(50),
--     reputational_impact character varying(50),
--     regulatory_impact character varying(50),
--     impact_rationale text,
--     created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
--     CONSTRAINT assessment_impacts_availability_impact_check CHECK (((availability_impact >= 1) AND (availability_impact <= 5))),
--     CONSTRAINT assessment_impacts_confidentiality_impact_check CHECK (((confidentiality_impact >= 1) AND (confidentiality_impact <= 5))),
--     CONSTRAINT assessment_impacts_integrity_impact_check CHECK (((integrity_impact >= 1) AND (integrity_impact <= 5)))
-- );


-- ALTER TABLE org_mashreqbank.assessment_impacts OWNER TO neondb_owner;

-- --
-- -- TOC entry 250 (class 1259 OID 81994)
-- -- Name: assessment_impacts_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
-- --

-- CREATE SEQUENCE org_mashreqbank.assessment_impacts_id_seq
--     AS integer
--     START WITH 1
--     INCREMENT BY 1
--     NO MINVALUE
--     NO MAXVALUE
--     CACHE 1;


-- ALTER SEQUENCE org_mashreqbank.assessment_impacts_id_seq OWNER TO neondb_owner;

-- --
-- -- TOC entry 6918 (class 0 OID 0)
-- -- Dependencies: 250
-- -- Name: assessment_impacts_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
-- --

-- ALTER SEQUENCE org_mashreqbank.assessment_impacts_id_seq OWNED BY org_mashreqbank.assessment_impacts.id;


-- --
-- -- TOC entry 253 (class 1259 OID 82013)
-- -- Name: assessment_risk_evaluations; Type: TABLE; Schema: public; Owner: neondb_owner
-- --

-- CREATE TABLE org_mashreqbank.assessment_risk_evaluations (
--     id integer NOT NULL,
--     assessment_id integer,
--     threat_id integer,
--     vulnerability_id integer,
--     impact_id integer,
--     likelihood_score integer,
--     impact_score integer,
--     inherent_risk_score numeric(5,2),
--     risk_level character varying(50),
--     risk_description text,
--     risk_owner character varying(255),
--     risk_tolerance character varying(50),
--     created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
--     CONSTRAINT assessment_risk_evaluations_impact_score_check CHECK (((impact_score >= 1) AND (impact_score <= 5))),
--     CONSTRAINT assessment_risk_evaluations_likelihood_score_check CHECK (((likelihood_score >= 1) AND (likelihood_score <= 5)))
-- );


-- ALTER TABLE org_mashreqbank.assessment_risk_evaluations OWNER TO neondb_owner;

-- --
-- -- TOC entry 252 (class 1259 OID 82012)
-- -- Name: assessment_risk_evaluations_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
-- --

-- CREATE SEQUENCE org_mashreqbank.assessment_risk_evaluations_id_seq
--     AS integer
--     START WITH 1
--     INCREMENT BY 1
--     NO MINVALUE
--     NO MAXVALUE
--     CACHE 1;


-- ALTER SEQUENCE org_mashreqbank.assessment_risk_evaluations_id_seq OWNER TO neondb_owner;

-- --
-- -- TOC entry 6919 (class 0 OID 0)
-- -- Dependencies: 252
-- -- Name: assessment_risk_evaluations_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
-- --

-- ALTER SEQUENCE org_mashreqbank.assessment_risk_evaluations_id_seq OWNED BY org_mashreqbank.assessment_risk_evaluations.id;


-- --
-- -- TOC entry 247 (class 1259 OID 81964)
-- -- Name: assessment_threats; Type: TABLE; Schema: public; Owner: neondb_owner
-- --

-- CREATE TABLE org_mashreqbank.assessment_threats (
--     id integer NOT NULL,
--     assessment_id integer,
--     threat_source character varying(255) NOT NULL,
--     threat_event character varying(255) NOT NULL,
--     threat_description text,
--     threat_category character varying(100),
--     likelihood_score integer,
--     likelihood_rationale text,
--     threat_capability character varying(50),
--     threat_intent character varying(50),
--     threat_targeting character varying(50),
--     created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
--     CONSTRAINT assessment_threats_likelihood_score_check CHECK (((likelihood_score >= 1) AND (likelihood_score <= 5)))
-- );


-- ALTER TABLE org_mashreqbank.assessment_threats OWNER TO neondb_owner;

-- --
-- -- TOC entry 246 (class 1259 OID 81963)
-- -- Name: assessment_threats_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
-- --

-- CREATE SEQUENCE org_mashreqbank.assessment_threats_id_seq
--     AS integer
--     START WITH 1
--     INCREMENT BY 1
--     NO MINVALUE
--     NO MAXVALUE
--     CACHE 1;


-- ALTER SEQUENCE org_mashreqbank.assessment_threats_id_seq OWNER TO neondb_owner;

-- --
-- -- TOC entry 6920 (class 0 OID 0)
-- -- Dependencies: 246
-- -- Name: assessment_threats_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
-- --

-- ALTER SEQUENCE org_mashreqbank.assessment_threats_id_seq OWNED BY org_mashreqbank.assessment_threats.id;


-- --
-- -- TOC entry 249 (class 1259 OID 81980)
-- -- Name: assessment_vulnerabilities; Type: TABLE; Schema: public; Owner: neondb_owner
-- --

-- CREATE TABLE org_mashreqbank.assessment_vulnerabilities (
--     id integer NOT NULL,
--     assessment_id integer,
--     vulnerability_name character varying(255) NOT NULL,
--     vulnerability_description text,
--     vulnerability_type character varying(100),
--     severity_level character varying(50),
--     cvss_score numeric(3,1),
--     exploitability character varying(50),
--     affected_assets text,
--     discovery_method character varying(100),
--     remediation_effort character varying(50),
--     created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
-- );


-- ALTER TABLE org_mashreqbank.assessment_vulnerabilities OWNER TO neondb_owner;

-- --
-- -- TOC entry 248 (class 1259 OID 81979)
-- -- Name: assessment_vulnerabilities_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
-- --

-- CREATE SEQUENCE org_mashreqbank.assessment_vulnerabilities_id_seq
--     AS integer
--     START WITH 1
--     INCREMENT BY 1
--     NO MINVALUE
--     NO MAXVALUE
--     CACHE 1;


-- ALTER SEQUENCE org_mashreqbank.assessment_vulnerabilities_id_seq OWNER TO neondb_owner;

-- --
-- -- TOC entry 6921 (class 0 OID 0)
-- -- Dependencies: 248
-- -- Name: assessment_vulnerabilities_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
-- --

-- ALTER SEQUENCE org_mashreqbank.assessment_vulnerabilities_id_seq OWNED BY org_mashreqbank.assessment_vulnerabilities.id;


-- --
-- -- TOC entry 507 (class 1259 OID 778265)
-- -- Name: assessments; Type: TABLE; Schema: public; Owner: neondb_owner
-- --

-- CREATE TABLE org_mashreqbank.assessments (
--     id integer NOT NULL,
--     assessment_id character varying(50) NOT NULL,
--     assessment_name character varying(255) NOT NULL,
--     type character varying(100) DEFAULT 'Security'::character varying,
--     status character varying(50) DEFAULT 'Planning'::character varying,
--     description text,
--     organization_id integer DEFAULT 1,
--     department_id integer,
--     user_id integer,
--     created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
--     updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
--     findings_count integer DEFAULT 0,
--     start_date date,
--     end_date date,
--     scope text,
--     methodology character varying(100),
--     assessor_name character varying(255),
--     review_status character varying(50) DEFAULT 'Draft'::character varying
-- );


-- ALTER TABLE org_mashreqbank.assessments OWNER TO neondb_owner;

-- --
-- -- TOC entry 506 (class 1259 OID 778264)
-- -- Name: assessments_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
-- --

-- CREATE SEQUENCE org_mashreqbank.assessments_id_seq
--     AS integer
--     START WITH 1
--     INCREMENT BY 1
--     NO MINVALUE
--     NO MAXVALUE
--     CACHE 1;


-- ALTER SEQUENCE org_mashreqbank.assessments_id_seq OWNER TO neondb_owner;

-- --
-- -- TOC entry 6922 (class 0 OID 0)
-- -- Dependencies: 506
-- -- Name: assessments_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
-- --

-- ALTER SEQUENCE org_mashreqbank.assessments_id_seq OWNED BY org_mashreqbank.assessments.id;


-- --
-- -- TOC entry 337 (class 1259 OID 253961)
-- -- Name: asset_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
-- --

-- CREATE SEQUENCE org_mashreqbank.asset_id_seq
--     START WITH 1
--     INCREMENT BY 1
--     NO MINVALUE
--     NO MAXVALUE
--     CACHE 1;


-- ALTER SEQUENCE org_mashreqbank.asset_id_seq OWNER TO neondb_owner;

-- --
-- -- TOC entry 336 (class 1259 OID 237569)
-- -- Name: assets; Type: TABLE; Schema: public; Owner: neondb_owner
-- --

-- CREATE TABLE org_mashreqbank.assets (
--     id integer NOT NULL,
--     asset_name character varying(255) NOT NULL,
--     asset_type character varying(100) NOT NULL,
--     classification character varying(50) NOT NULL,
--     owner character varying(255) NOT NULL,
--     business_value character varying(50) NOT NULL,
--     confidentiality_level integer DEFAULT 1,
--     integrity_level integer DEFAULT 1,
--     availability_level integer DEFAULT 1,
--     description text,
--     location character varying(255),
--     created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
--     updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
--     asset_id character varying(20),
--     category character varying(20),
--     status character varying(20),
--     CONSTRAINT assets_availability_level_check CHECK (((availability_level >= 1) AND (availability_level <= 5))),
--     CONSTRAINT assets_confidentiality_level_check CHECK (((confidentiality_level >= 1) AND (confidentiality_level <= 5))),
--     CONSTRAINT assets_integrity_level_check CHECK (((integrity_level >= 1) AND (integrity_level <= 5)))
-- );


-- ALTER TABLE org_mashreqbank.assets OWNER TO neondb_owner;

-- --
-- -- TOC entry 335 (class 1259 OID 237568)
-- -- Name: assets_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
-- --

-- CREATE SEQUENCE org_mashreqbank.assets_id_seq
--     AS integer
--     START WITH 1
--     INCREMENT BY 1
--     NO MINVALUE
--     NO MAXVALUE
--     CACHE 1;


-- ALTER SEQUENCE org_mashreqbank.assets_id_seq OWNER TO neondb_owner;

-- --
-- -- TOC entry 6923 (class 0 OID 0)
-- -- Dependencies: 335
-- -- Name: assets_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
-- --

-- ALTER SEQUENCE org_mashreqbank.assets_id_seq OWNED BY org_mashreqbank.assets.id;


-- --
-- -- TOC entry 412 (class 1259 OID 450563)
-- -- Name: audit_logs; Type: TABLE; Schema: public; Owner: neondb_owner
-- --

-- CREATE TABLE org_mashreqbank.audit_logs (
--     id integer NOT NULL,
--     user_email character varying(255),
--     action character varying(50),
--     entity_type character varying(50),
--     entity_id character varying(255),
--     old_values jsonb,
--     new_values jsonb,
--     ip_address inet,
--     user_agent text,
--     session_id character varying(255),
--     success boolean DEFAULT true,
--     error_message text,
--     additional_context jsonb,
--     "timestamp" timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
--     user_id uuid
-- );


-- ALTER TABLE org_mashreqbank.audit_logs OWNER TO neondb_owner;

-- --
-- -- TOC entry 411 (class 1259 OID 450562)
-- -- Name: audit_logs_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
-- --

-- CREATE SEQUENCE org_mashreqbank.audit_logs_id_seq
--     AS integer
--     START WITH 1
--     INCREMENT BY 1
--     NO MINVALUE
--     NO MAXVALUE
--     CACHE 1;


-- ALTER SEQUENCE org_mashreqbank.audit_logs_id_seq OWNER TO neondb_owner;

-- --
-- -- TOC entry 6924 (class 0 OID 0)
-- -- Dependencies: 411
-- -- Name: audit_logs_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
-- --

-- ALTER SEQUENCE org_mashreqbank.audit_logs_id_seq OWNED BY org_mashreqbank.audit_logs.id;


-- --
-- -- TOC entry 604 (class 1259 OID 910663)
-- -- Name: auth_audit_log; Type: TABLE; Schema: public; Owner: neondb_owner
-- --

-- CREATE TABLE org_mashreqbank.auth_audit_log (
--     id integer NOT NULL,
--     user_id integer,
--     email character varying(255),
--     event_type character varying(50) NOT NULL,
--     ip_address inet,
--     user_agent text,
--     details jsonb,
--     created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
-- );


-- ALTER TABLE org_mashreqbank.auth_audit_log OWNER TO neondb_owner;

-- --
-- -- TOC entry 603 (class 1259 OID 910662)
-- -- Name: auth_audit_log_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
-- --

-- CREATE SEQUENCE org_mashreqbank.auth_audit_log_id_seq
--     AS integer
--     START WITH 1
--     INCREMENT BY 1
--     NO MINVALUE
--     NO MAXVALUE
--     CACHE 1;


-- ALTER SEQUENCE org_mashreqbank.auth_audit_log_id_seq OWNER TO neondb_owner;

-- --
-- -- TOC entry 6925 (class 0 OID 0)
-- -- Dependencies: 603
-- -- Name: auth_audit_log_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
-- --

-- ALTER SEQUENCE org_mashreqbank.auth_audit_log_id_seq OWNED BY org_mashreqbank.auth_audit_log.id;


-- --
-- -- TOC entry 239 (class 1259 OID 24710)
-- -- Name: compliance_frameworks; Type: TABLE; Schema: public; Owner: neondb_owner
-- --

-- CREATE TABLE org_mashreqbank.compliance_frameworks (
--     id integer NOT NULL,
--     framework_name character varying(255) NOT NULL,
--     version character varying(50),
--     description text,
--     created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
-- );


-- ALTER TABLE org_mashreqbank.compliance_frameworks OWNER TO neondb_owner;

-- --
-- -- TOC entry 238 (class 1259 OID 24709)
-- -- Name: compliance_frameworks_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
-- --

-- CREATE SEQUENCE org_mashreqbank.compliance_frameworks_id_seq
--     AS integer
--     START WITH 1
--     INCREMENT BY 1
--     NO MINVALUE
--     NO MAXVALUE
--     CACHE 1;


-- ALTER SEQUENCE org_mashreqbank.compliance_frameworks_id_seq OWNER TO neondb_owner;

-- --
-- -- TOC entry 6926 (class 0 OID 0)
-- -- Dependencies: 238
-- -- Name: compliance_frameworks_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
-- --

-- ALTER SEQUENCE org_mashreqbank.compliance_frameworks_id_seq OWNED BY org_mashreqbank.compliance_frameworks.id;


-- --
-- -- TOC entry 241 (class 1259 OID 24720)
-- -- Name: compliance_requirements; Type: TABLE; Schema: public; Owner: neondb_owner
-- --

-- CREATE TABLE org_mashreqbank.compliance_requirements (
--     id integer NOT NULL,
--     framework_id integer,
--     requirement_id character varying(100),
--     requirement_title character varying(255),
--     requirement_description text,
--     compliance_status character varying(50),
--     evidence text,
--     last_assessment_date date,
--     next_assessment_date date,
--     responsible_party character varying(255),
--     created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
-- );


-- ALTER TABLE org_mashreqbank.compliance_requirements OWNER TO neondb_owner;

-- --
-- -- TOC entry 240 (class 1259 OID 24719)
-- -- Name: compliance_requirements_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
-- --

-- CREATE SEQUENCE org_mashreqbank.compliance_requirements_id_seq
--     AS integer
--     START WITH 1
--     INCREMENT BY 1
--     NO MINVALUE
--     NO MAXVALUE
--     CACHE 1;


-- ALTER SEQUENCE org_mashreqbank.compliance_requirements_id_seq OWNER TO neondb_owner;

-- --
-- -- TOC entry 6927 (class 0 OID 0)
-- -- Dependencies: 240
-- -- Name: compliance_requirements_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
-- --

-- ALTER SEQUENCE org_mashreqbank.compliance_requirements_id_seq OWNED BY org_mashreqbank.compliance_requirements.id;


-- --
-- -- TOC entry 265 (class 1259 OID 98308)
-- -- Name: comprehensive_risk_assessments; Type: TABLE; Schema: public; Owner: neondb_owner
-- --

-- CREATE TABLE org_mashreqbank.comprehensive_risk_assessments (
--     id integer NOT NULL,
--     risk_id character varying(50) NOT NULL,
--     risk_title character varying(255) NOT NULL,
--     risk_description text NOT NULL,
--     risk_category character varying(100) NOT NULL,
--     risk_owner character varying(255) NOT NULL,
--     business_unit character varying(100),
--     likelihood_score integer NOT NULL,
--     impact_score integer NOT NULL,
--     inherent_risk_score integer NOT NULL,
--     financial_impact numeric(15,2),
--     operational_impact character varying(100),
--     reputational_impact character varying(100),
--     compliance_impact character varying(100),
--     existing_controls text,
--     control_effectiveness_score integer,
--     control_gaps text,
--     control_recommendations text,
--     treatment_strategy character varying(50),
--     treatment_description text,
--     treatment_owner character varying(255),
--     treatment_timeline character varying(100),
--     treatment_cost numeric(12,2),
--     treatment_priority character varying(20),
--     residual_likelihood integer,
--     residual_impact integer,
--     residual_risk_score integer,
--     risk_appetite_alignment character varying(50),
--     monitoring_frequency character varying(50),
--     escalation_threshold integer,
--     key_risk_indicators text,
--     assessment_status character varying(50) DEFAULT 'Draft'::character varying,
--     workflow_stage integer DEFAULT 1,
--     next_review_date date,
--     last_reviewed_date date,
--     reviewed_by character varying(255),
--     reviewed_date timestamp without time zone,
--     approved_by character varying(255),
--     approved_date timestamp without time zone,
--     approval_comments text,
--     created_by character varying(255) NOT NULL,
--     created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
--     updated_by character varying(255),
--     updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
--     CONSTRAINT comprehensive_risk_assessment_control_effectiveness_score_check CHECK (((control_effectiveness_score >= 1) AND (control_effectiveness_score <= 5))),
--     CONSTRAINT comprehensive_risk_assessments_assessment_status_check CHECK (((assessment_status)::text = ANY ((ARRAY['Draft'::character varying, 'In Progress'::character varying, 'Under Review'::character varying, 'Completed'::character varying, 'Archived'::character varying])::text[]))),
--     CONSTRAINT comprehensive_risk_assessments_impact_score_check CHECK (((impact_score >= 1) AND (impact_score <= 5))),
--     CONSTRAINT comprehensive_risk_assessments_likelihood_score_check CHECK (((likelihood_score >= 1) AND (likelihood_score <= 5))),
--     CONSTRAINT comprehensive_risk_assessments_monitoring_frequency_check CHECK (((monitoring_frequency)::text = ANY ((ARRAY['Daily'::character varying, 'Weekly'::character varying, 'Monthly'::character varying, 'Quarterly'::character varying, 'Annually'::character varying])::text[]))),
--     CONSTRAINT comprehensive_risk_assessments_residual_impact_check CHECK (((residual_impact >= 1) AND (residual_impact <= 5))),
--     CONSTRAINT comprehensive_risk_assessments_residual_likelihood_check CHECK (((residual_likelihood >= 1) AND (residual_likelihood <= 5))),
--     CONSTRAINT comprehensive_risk_assessments_risk_appetite_alignment_check CHECK (((risk_appetite_alignment)::text = ANY ((ARRAY['Within Appetite'::character varying, 'Above Appetite'::character varying, 'Exceeds Tolerance'::character varying])::text[]))),
--     CONSTRAINT comprehensive_risk_assessments_treatment_priority_check CHECK (((treatment_priority)::text = ANY ((ARRAY['Critical'::character varying, 'High'::character varying, 'Medium'::character varying, 'Low'::character varying])::text[]))),
--     CONSTRAINT comprehensive_risk_assessments_treatment_strategy_check CHECK (((treatment_strategy)::text = ANY ((ARRAY['Mitigate'::character varying, 'Accept'::character varying, 'Transfer'::character varying, 'Avoid'::character varying])::text[]))),
--     CONSTRAINT comprehensive_risk_assessments_workflow_stage_check CHECK (((workflow_stage >= 1) AND (workflow_stage <= 6)))
-- );


-- ALTER TABLE org_mashreqbank.comprehensive_risk_assessments OWNER TO neondb_owner;

-- --
-- -- TOC entry 264 (class 1259 OID 98307)
-- -- Name: comprehensive_risk_assessments_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
-- --

-- CREATE SEQUENCE org_mashreqbank.comprehensive_risk_assessments_id_seq
--     AS integer
--     START WITH 1
--     INCREMENT BY 1
--     NO MINVALUE
--     NO MAXVALUE
--     CACHE 1;


-- ALTER SEQUENCE org_mashreqbank.comprehensive_risk_assessments_id_seq OWNER TO neondb_owner;

-- --
-- -- TOC entry 6928 (class 0 OID 0)
-- -- Dependencies: 264
-- -- Name: comprehensive_risk_assessments_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
-- --

-- ALTER SEQUENCE org_mashreqbank.comprehensive_risk_assessments_id_seq OWNED BY org_mashreqbank.comprehensive_risk_assessments.id;


-- --
-- -- TOC entry 307 (class 1259 OID 131102)
-- -- Name: control_assessments; Type: TABLE; Schema: public; Owner: neondb_owner
-- --

-- CREATE TABLE org_mashreqbank.control_assessments (
--     id integer NOT NULL,
--     risk_scenario_id integer,
--     control_id integer,
--     is_implemented boolean DEFAULT false,
--     implementation_status character varying(50) DEFAULT 'Not Implemented'::character varying,
--     effectiveness_rating integer,
--     evidence_of_implementation text,
--     control_owner character varying(255),
--     last_tested_date date,
--     test_results text,
--     deficiencies_identified text,
--     improvement_recommendations text,
--     cost_of_implementation numeric(12,2),
--     implementation_timeline character varying(100),
--     created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
--     updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
--     CONSTRAINT control_assessments_effectiveness_rating_check CHECK (((effectiveness_rating >= 1) AND (effectiveness_rating <= 5)))
-- );


-- ALTER TABLE org_mashreqbank.control_assessments OWNER TO neondb_owner;

-- --
-- -- TOC entry 306 (class 1259 OID 131101)
-- -- Name: control_assessments_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
-- --

-- CREATE SEQUENCE org_mashreqbank.control_assessments_id_seq
--     AS integer
--     START WITH 1
--     INCREMENT BY 1
--     NO MINVALUE
--     NO MAXVALUE
--     CACHE 1;


-- ALTER SEQUENCE org_mashreqbank.control_assessments_id_seq OWNER TO neondb_owner;

-- --
-- -- TOC entry 6929 (class 0 OID 0)
-- -- Dependencies: 306
-- -- Name: control_assessments_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
-- --

-- ALTER SEQUENCE org_mashreqbank.control_assessments_id_seq OWNED BY org_mashreqbank.control_assessments.id;


-- --
-- -- TOC entry 305 (class 1259 OID 131073)
-- -- Name: control_categories; Type: TABLE; Schema: public; Owner: neondb_owner
-- --

-- CREATE TABLE org_mashreqbank.control_categories (
--     id integer NOT NULL,
--     category_code character varying(10) NOT NULL,
--     category_name character varying(255) NOT NULL,
--     description text,
--     created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
-- );


-- ALTER TABLE org_mashreqbank.control_categories OWNER TO neondb_owner;

-- --
-- -- TOC entry 304 (class 1259 OID 131072)
-- -- Name: control_categories_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
-- --

-- CREATE SEQUENCE org_mashreqbank.control_categories_id_seq
--     AS integer
--     START WITH 1
--     INCREMENT BY 1
--     NO MINVALUE
--     NO MAXVALUE
--     CACHE 1;


-- ALTER SEQUENCE org_mashreqbank.control_categories_id_seq OWNER TO neondb_owner;

-- --
-- -- TOC entry 6930 (class 0 OID 0)
-- -- Dependencies: 304
-- -- Name: control_categories_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
-- --

-- ALTER SEQUENCE org_mashreqbank.control_categories_id_seq OWNED BY org_mashreqbank.control_categories.id;


-- --
-- -- TOC entry 369 (class 1259 OID 286775)
-- -- Name: control_test_evidence; Type: TABLE; Schema: public; Owner: neondb_owner
-- --

-- CREATE TABLE org_mashreqbank.control_test_evidence (
--     id integer NOT NULL,
--     test_execution_id integer NOT NULL,
--     evidence_name character varying(255) NOT NULL,
--     evidence_type character varying(100),
--     file_path character varying(500),
--     file_size integer,
--     description text,
--     uploaded_by character varying(255) NOT NULL,
--     created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
-- );


-- ALTER TABLE org_mashreqbank.control_test_evidence OWNER TO neondb_owner;

-- --
-- -- TOC entry 368 (class 1259 OID 286774)
-- -- Name: control_test_evidence_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
-- --

-- CREATE SEQUENCE org_mashreqbank.control_test_evidence_id_seq
--     AS integer
--     START WITH 1
--     INCREMENT BY 1
--     NO MINVALUE
--     NO MAXVALUE
--     CACHE 1;


-- ALTER SEQUENCE org_mashreqbank.control_test_evidence_id_seq OWNER TO neondb_owner;

-- --
-- -- TOC entry 6931 (class 0 OID 0)
-- -- Dependencies: 368
-- -- Name: control_test_evidence_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
-- --

-- ALTER SEQUENCE org_mashreqbank.control_test_evidence_id_seq OWNED BY org_mashreqbank.control_test_evidence.id;


-- --
-- -- TOC entry 365 (class 1259 OID 286737)
-- -- Name: control_test_executions; Type: TABLE; Schema: public; Owner: neondb_owner
-- --

-- CREATE TABLE org_mashreqbank.control_test_executions (
--     id integer NOT NULL,
--     control_id integer NOT NULL,
--     test_plan_id integer,
--     test_date date NOT NULL,
--     tester_name character varying(255) NOT NULL,
--     tester_email character varying(255),
--     test_result character varying(50) NOT NULL,
--     effectiveness_rating character varying(50),
--     test_notes text,
--     evidence_collected text,
--     issues_identified text,
--     recommendations text,
--     next_test_date date,
--     created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
--     updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
-- );


-- ALTER TABLE org_mashreqbank.control_test_executions OWNER TO neondb_owner;

-- --
-- -- TOC entry 364 (class 1259 OID 286736)
-- -- Name: control_test_executions_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
-- --

-- CREATE SEQUENCE org_mashreqbank.control_test_executions_id_seq
--     AS integer
--     START WITH 1
--     INCREMENT BY 1
--     NO MINVALUE
--     NO MAXVALUE
--     CACHE 1;


-- ALTER SEQUENCE org_mashreqbank.control_test_executions_id_seq OWNER TO neondb_owner;

-- --
-- -- TOC entry 6932 (class 0 OID 0)
-- -- Dependencies: 364
-- -- Name: control_test_executions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
-- --

-- ALTER SEQUENCE org_mashreqbank.control_test_executions_id_seq OWNED BY org_mashreqbank.control_test_executions.id;


-- --
-- -- TOC entry 367 (class 1259 OID 286758)
-- -- Name: control_test_issues; Type: TABLE; Schema: public; Owner: neondb_owner
-- --

-- CREATE TABLE org_mashreqbank.control_test_issues (
--     id integer NOT NULL,
--     test_execution_id integer NOT NULL,
--     issue_title character varying(255) NOT NULL,
--     issue_description text NOT NULL,
--     severity character varying(50) NOT NULL,
--     status character varying(50) DEFAULT 'Open'::character varying,
--     assigned_to character varying(255),
--     due_date date,
--     resolution_notes text,
--     resolved_date date,
--     created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
--     updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
-- );


-- ALTER TABLE org_mashreqbank.control_test_issues OWNER TO neondb_owner;

-- --
-- -- TOC entry 366 (class 1259 OID 286757)
-- -- Name: control_test_issues_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
-- --

-- CREATE SEQUENCE org_mashreqbank.control_test_issues_id_seq
--     AS integer
--     START WITH 1
--     INCREMENT BY 1
--     NO MINVALUE
--     NO MAXVALUE
--     CACHE 1;


-- ALTER SEQUENCE org_mashreqbank.control_test_issues_id_seq OWNER TO neondb_owner;

-- --
-- -- TOC entry 6933 (class 0 OID 0)
-- -- Dependencies: 366
-- -- Name: control_test_issues_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
-- --

-- ALTER SEQUENCE org_mashreqbank.control_test_issues_id_seq OWNED BY org_mashreqbank.control_test_issues.id;


-- --
-- -- TOC entry 363 (class 1259 OID 286721)
-- -- Name: control_test_plans; Type: TABLE; Schema: public; Owner: neondb_owner
-- --

-- CREATE TABLE org_mashreqbank.control_test_plans (
--     id integer NOT NULL,
--     control_id integer NOT NULL,
--     test_name character varying(255) NOT NULL,
--     test_description text,
--     test_type character varying(50) NOT NULL,
--     test_frequency character varying(50) NOT NULL,
--     test_procedures text NOT NULL,
--     expected_evidence text,
--     test_criteria text,
--     assigned_tester character varying(255),
--     created_by character varying(255) NOT NULL,
--     created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
--     updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
-- );


-- ALTER TABLE org_mashreqbank.control_test_plans OWNER TO neondb_owner;

-- --
-- -- TOC entry 362 (class 1259 OID 286720)
-- -- Name: control_test_plans_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
-- --

-- CREATE SEQUENCE org_mashreqbank.control_test_plans_id_seq
--     AS integer
--     START WITH 1
--     INCREMENT BY 1
--     NO MINVALUE
--     NO MAXVALUE
--     CACHE 1;


-- ALTER SEQUENCE org_mashreqbank.control_test_plans_id_seq OWNER TO neondb_owner;

-- --
-- -- TOC entry 6934 (class 0 OID 0)
-- -- Dependencies: 362
-- -- Name: control_test_plans_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
-- --

-- ALTER SEQUENCE org_mashreqbank.control_test_plans_id_seq OWNED BY org_mashreqbank.control_test_plans.id;


-- --
-- -- TOC entry 371 (class 1259 OID 286790)
-- -- Name: control_test_schedule; Type: TABLE; Schema: public; Owner: neondb_owner
-- --

-- CREATE TABLE org_mashreqbank.control_test_schedule (
--     id integer NOT NULL,
--     control_id integer NOT NULL,
--     scheduled_date date NOT NULL,
--     test_type character varying(50) NOT NULL,
--     assigned_tester character varying(255),
--     status character varying(50) DEFAULT 'Scheduled'::character varying,
--     reminder_sent boolean DEFAULT false,
--     notes text,
--     created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
--     updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
-- );


-- ALTER TABLE org_mashreqbank.control_test_schedule OWNER TO neondb_owner;

-- --
-- -- TOC entry 370 (class 1259 OID 286789)
-- -- Name: control_test_schedule_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
-- --

-- CREATE SEQUENCE org_mashreqbank.control_test_schedule_id_seq
--     AS integer
--     START WITH 1
--     INCREMENT BY 1
--     NO MINVALUE
--     NO MAXVALUE
--     CACHE 1;


-- ALTER SEQUENCE org_mashreqbank.control_test_schedule_id_seq OWNER TO neondb_owner;

-- --
-- -- TOC entry 6935 (class 0 OID 0)
-- -- Dependencies: 370
-- -- Name: control_test_schedule_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
-- --

-- ALTER SEQUENCE org_mashreqbank.control_test_schedule_id_seq OWNED BY org_mashreqbank.control_test_schedule.id;


-- --
-- -- TOC entry 311 (class 1259 OID 131141)
-- -- Name: control_testing_schedule; Type: TABLE; Schema: public; Owner: neondb_owner
-- --

-- CREATE TABLE org_mashreqbank.control_testing_schedule (
--     id integer NOT NULL,
--     control_assessment_id integer,
--     test_frequency character varying(50) NOT NULL,
--     next_test_date date NOT NULL,
--     test_type character varying(100),
--     assigned_tester character varying(255),
--     test_status character varying(50) DEFAULT 'Scheduled'::character varying,
--     created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
-- );


-- ALTER TABLE org_mashreqbank.control_testing_schedule OWNER TO neondb_owner;

-- --
-- -- TOC entry 310 (class 1259 OID 131140)
-- -- Name: control_testing_schedule_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
-- --

-- CREATE SEQUENCE org_mashreqbank.control_testing_schedule_id_seq
--     AS integer
--     START WITH 1
--     INCREMENT BY 1
--     NO MINVALUE
--     NO MAXVALUE
--     CACHE 1;


-- ALTER SEQUENCE org_mashreqbank.control_testing_schedule_id_seq OWNER TO neondb_owner;

-- --
-- -- TOC entry 6936 (class 0 OID 0)
-- -- Dependencies: 310
-- -- Name: control_testing_schedule_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
-- --

-- ALTER SEQUENCE org_mashreqbank.control_testing_schedule_id_seq OWNED BY org_mashreqbank.control_testing_schedule.id;


-- --
-- -- TOC entry 233 (class 1259 OID 24624)
-- -- Name: controls; Type: TABLE; Schema: public; Owner: neondb_owner
-- --

-- CREATE TABLE org_mashreqbank.controls (
--     id integer NOT NULL,
--     control_id character varying(50) NOT NULL,
--     control_name character varying(255) NOT NULL,
--     control_description text,
--     control_type character varying(100),
--     control_category character varying(100),
--     iso27001_reference character varying(100),
--     implementation_status character varying(50),
--     effectiveness_rating character varying(50),
--     control_owner character varying(255),
--     implementation_date date,
--     last_test_date date,
--     next_test_date date,
--     testing_frequency character varying(50),
--     created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
--     updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
--     last_test_result character varying(50),
--     test_status character varying(50) DEFAULT 'Not Tested'::character varying,
--     next_review_date date
-- );


-- ALTER TABLE org_mashreqbank.controls OWNER TO neondb_owner;

-- --
-- -- TOC entry 232 (class 1259 OID 24623)
-- -- Name: controls_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
-- --

-- CREATE SEQUENCE org_mashreqbank.controls_id_seq
--     AS integer
--     START WITH 1
--     INCREMENT BY 1
--     NO MINVALUE
--     NO MAXVALUE
--     CACHE 1;


-- ALTER SEQUENCE org_mashreqbank.controls_id_seq OWNER TO neondb_owner;

-- --
-- -- TOC entry 6937 (class 0 OID 0)
-- -- Dependencies: 232
-- -- Name: controls_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
-- --

-- ALTER SEQUENCE org_mashreqbank.controls_id_seq OWNED BY org_mashreqbank.controls.id;


-- --
-- -- TOC entry 237 (class 1259 OID 24681)
-- -- Name: cybersecurity_assessments; Type: TABLE; Schema: public; Owner: neondb_owner
-- --

-- CREATE TABLE org_mashreqbank.cybersecurity_assessments (
--     id integer NOT NULL,
--     cybersecurity_assessment_id character varying(50) NOT NULL,
--     assessment_name character varying(255) NOT NULL,
--     type character varying(100),
--     description character varying(50),
--     methodology character varying(255),
--     assessor character varying(255),
--     start_date date,
--     end_date date,
--     status character varying(50),
--     overall_score integer,
--     maturity_level character varying(50),
--     executive_summary text,
--     recommendations text,
--     created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
--     updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
--     organization_id integer,
--     department_id integer,
--     findings_count integer
-- );


-- ALTER TABLE org_mashreqbank.cybersecurity_assessments OWNER TO neondb_owner;

-- --
-- -- TOC entry 236 (class 1259 OID 24680)
-- -- Name: cybersecurity_assessments_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
-- --

-- CREATE SEQUENCE org_mashreqbank.cybersecurity_assessments_id_seq
--     AS integer
--     START WITH 1
--     INCREMENT BY 1
--     NO MINVALUE
--     NO MAXVALUE
--     CACHE 1;


-- ALTER SEQUENCE org_mashreqbank.cybersecurity_assessments_id_seq OWNER TO neondb_owner;

-- --
-- -- TOC entry 6938 (class 0 OID 0)
-- -- Dependencies: 236
-- -- Name: cybersecurity_assessments_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
-- --

-- ALTER SEQUENCE org_mashreqbank.cybersecurity_assessments_id_seq OWNED BY org_mashreqbank.cybersecurity_assessments.id;


-- --
-- -- TOC entry 528 (class 1259 OID 802817)
-- -- Name: database_tables; Type: TABLE; Schema: public; Owner: neondb_owner
-- --

-- CREATE TABLE org_mashreqbank.database_tables (
--     id integer NOT NULL,
--     table_name character varying(100) NOT NULL,
--     display_name character varying(100) NOT NULL,
--     module character varying(100) NOT NULL,
--     description text,
--     is_active boolean DEFAULT true,
--     created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
--     updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
-- );


-- ALTER TABLE org_mashreqbank.database_tables OWNER TO neondb_owner;

-- --
-- -- TOC entry 527 (class 1259 OID 802816)
-- -- Name: database_tables_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
-- --

-- CREATE SEQUENCE org_mashreqbank.database_tables_id_seq
--     AS integer
--     START WITH 1
--     INCREMENT BY 1
--     NO MINVALUE
--     NO MAXVALUE
--     CACHE 1;


-- ALTER SEQUENCE org_mashreqbank.database_tables_id_seq OWNER TO neondb_owner;

-- --
-- -- TOC entry 6939 (class 0 OID 0)
-- -- Dependencies: 527
-- -- Name: database_tables_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
-- --

-- ALTER SEQUENCE org_mashreqbank.database_tables_id_seq OWNED BY org_mashreqbank.database_tables.id;


-- --
-- -- TOC entry 422 (class 1259 OID 516176)
-- -- Name: departments; Type: TABLE; Schema: public; Owner: neondb_owner
-- --

-- CREATE TABLE org_mashreqbank.departments (
--     id integer NOT NULL,
--     organization_id integer,
--     name character varying(255) NOT NULL,
--     description text,
--     department_id integer,
--     department_head character varying(255),
--     budget numeric(15,2),
--     cost_center character varying(100),
--     phone character varying(50),
--     email character varying(255),
--     location character varying(255),
--     status character varying(50) DEFAULT 'Active'::character varying,
--     created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
--     updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
--     parent_department_id integer
-- );


-- ALTER TABLE org_mashreqbank.departments OWNER TO neondb_owner;

-- --
-- -- TOC entry 421 (class 1259 OID 516175)
-- -- Name: departments_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
-- --

-- CREATE SEQUENCE org_mashreqbank.departments_id_seq
--     AS integer
--     START WITH 1
--     INCREMENT BY 1
--     NO MINVALUE
--     NO MAXVALUE
--     CACHE 1;


-- ALTER SEQUENCE org_mashreqbank.departments_id_seq OWNER TO neondb_owner;

-- --
-- -- TOC entry 6940 (class 0 OID 0)
-- -- Dependencies: 421
-- -- Name: departments_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
-- --

-- ALTER SEQUENCE org_mashreqbank.departments_id_seq OWNED BY org_mashreqbank.departments.id;


-- --
-- -- TOC entry 444 (class 1259 OID 532674)
-- -- Name: document_access_log; Type: TABLE; Schema: public; Owner: neondb_owner
-- --

-- CREATE TABLE org_mashreqbank.document_access_log (
--     id integer NOT NULL,
--     document_id integer,
--     version_id integer,
--     user_id integer,
--     access_type character varying(50),
--     ip_address inet,
--     user_agent text,
--     accessed_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
--     CONSTRAINT document_access_log_access_type_check CHECK (((access_type)::text = ANY ((ARRAY['view'::character varying, 'download'::character varying, 'edit'::character varying, 'approve'::character varying, 'publish'::character varying])::text[])))
-- );


-- ALTER TABLE org_mashreqbank.document_access_log OWNER TO neondb_owner;

-- --
-- -- TOC entry 443 (class 1259 OID 532673)
-- -- Name: document_access_log_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
-- --

-- CREATE SEQUENCE org_mashreqbank.document_access_log_id_seq
--     AS integer
--     START WITH 1
--     INCREMENT BY 1
--     NO MINVALUE
--     NO MAXVALUE
--     CACHE 1;


-- ALTER SEQUENCE org_mashreqbank.document_access_log_id_seq OWNER TO neondb_owner;

-- --
-- -- TOC entry 6941 (class 0 OID 0)
-- -- Dependencies: 443
-- -- Name: document_access_log_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
-- --

-- ALTER SEQUENCE org_mashreqbank.document_access_log_id_seq OWNED BY org_mashreqbank.document_access_log.id;


-- --
-- -- TOC entry 426 (class 1259 OID 532481)
-- -- Name: document_categories; Type: TABLE; Schema: public; Owner: neondb_owner
-- --

-- CREATE TABLE org_mashreqbank.document_categories (
--     id integer NOT NULL,
--     name character varying(255) NOT NULL,
--     description text,
--     color character varying(7) DEFAULT '#3B82F6'::character varying,
--     icon character varying(50) DEFAULT 'FileText'::character varying,
--     created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
--     updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
-- );


-- ALTER TABLE org_mashreqbank.document_categories OWNER TO neondb_owner;

-- --
-- -- TOC entry 425 (class 1259 OID 532480)
-- -- Name: document_categories_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
-- --

-- CREATE SEQUENCE org_mashreqbank.document_categories_id_seq
--     AS integer
--     START WITH 1
--     INCREMENT BY 1
--     NO MINVALUE
--     NO MAXVALUE
--     CACHE 1;


-- ALTER SEQUENCE org_mashreqbank.document_categories_id_seq OWNER TO neondb_owner;

-- --
-- -- TOC entry 6942 (class 0 OID 0)
-- -- Dependencies: 425
-- -- Name: document_categories_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
-- --

-- ALTER SEQUENCE org_mashreqbank.document_categories_id_seq OWNED BY org_mashreqbank.document_categories.id;


-- --
-- -- TOC entry 436 (class 1259 OID 532582)
-- -- Name: document_control_mappings; Type: TABLE; Schema: public; Owner: neondb_owner
-- --

-- CREATE TABLE org_mashreqbank.document_control_mappings (
--     id integer NOT NULL,
--     document_id integer,
--     control_id integer,
--     mapping_type character varying(50) DEFAULT 'implements'::character varying,
--     description text,
--     effectiveness_rating character varying(20),
--     last_assessed date,
--     created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
--     CONSTRAINT document_control_mappings_effectiveness_rating_check CHECK (((effectiveness_rating)::text = ANY ((ARRAY['not_effective'::character varying, 'partially_effective'::character varying, 'largely_effective'::character varying, 'fully_effective'::character varying])::text[]))),
--     CONSTRAINT document_control_mappings_mapping_type_check CHECK (((mapping_type)::text = ANY ((ARRAY['implements'::character varying, 'supports'::character varying, 'references'::character varying, 'defines'::character varying])::text[])))
-- );


-- ALTER TABLE org_mashreqbank.document_control_mappings OWNER TO neondb_owner;

-- --
-- -- TOC entry 435 (class 1259 OID 532581)
-- -- Name: document_control_mappings_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
-- --

-- CREATE SEQUENCE org_mashreqbank.document_control_mappings_id_seq
--     AS integer
--     START WITH 1
--     INCREMENT BY 1
--     NO MINVALUE
--     NO MAXVALUE
--     CACHE 1;


-- ALTER SEQUENCE org_mashreqbank.document_control_mappings_id_seq OWNER TO neondb_owner;

-- --
-- -- TOC entry 6943 (class 0 OID 0)
-- -- Dependencies: 435
-- -- Name: document_control_mappings_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
-- --

-- ALTER SEQUENCE org_mashreqbank.document_control_mappings_id_seq OWNED BY org_mashreqbank.document_control_mappings.id;


-- --
-- -- TOC entry 440 (class 1259 OID 532625)
-- -- Name: document_finding_mappings; Type: TABLE; Schema: public; Owner: neondb_owner
-- --

-- CREATE TABLE org_mashreqbank.document_finding_mappings (
--     id integer NOT NULL,
--     document_id integer,
--     finding_id integer,
--     mapping_type character varying(50) DEFAULT 'addresses'::character varying,
--     description text,
--     remediation_status character varying(50) DEFAULT 'open'::character varying,
--     created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
--     CONSTRAINT document_finding_mappings_mapping_type_check CHECK (((mapping_type)::text = ANY ((ARRAY['addresses'::character varying, 'remediates'::character varying, 'prevents'::character varying, 'references'::character varying])::text[]))),
--     CONSTRAINT document_finding_mappings_remediation_status_check CHECK (((remediation_status)::text = ANY ((ARRAY['open'::character varying, 'in_progress'::character varying, 'resolved'::character varying, 'accepted'::character varying])::text[])))
-- );


-- ALTER TABLE org_mashreqbank.document_finding_mappings OWNER TO neondb_owner;

-- --
-- -- TOC entry 439 (class 1259 OID 532624)
-- -- Name: document_finding_mappings_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
-- --

-- CREATE SEQUENCE org_mashreqbank.document_finding_mappings_id_seq
--     AS integer
--     START WITH 1
--     INCREMENT BY 1
--     NO MINVALUE
--     NO MAXVALUE
--     CACHE 1;


-- ALTER SEQUENCE org_mashreqbank.document_finding_mappings_id_seq OWNER TO neondb_owner;

-- --
-- -- TOC entry 6944 (class 0 OID 0)
-- -- Dependencies: 439
-- -- Name: document_finding_mappings_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
-- --

-- ALTER SEQUENCE org_mashreqbank.document_finding_mappings_id_seq OWNED BY org_mashreqbank.document_finding_mappings.id;


-- --
-- -- TOC entry 434 (class 1259 OID 532559)
-- -- Name: document_relationships; Type: TABLE; Schema: public; Owner: neondb_owner
-- --

-- CREATE TABLE org_mashreqbank.document_relationships (
--     id integer NOT NULL,
--     parent_document_id integer,
--     child_document_id integer,
--     relationship_type character varying(50),
--     description text,
--     created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
--     CONSTRAINT document_relationships_relationship_type_check CHECK (((relationship_type)::text = ANY ((ARRAY['references'::character varying, 'supersedes'::character varying, 'implements'::character varying, 'supports'::character varying, 'conflicts'::character varying, 'related'::character varying])::text[])))
-- );


-- ALTER TABLE org_mashreqbank.document_relationships OWNER TO neondb_owner;

-- --
-- -- TOC entry 433 (class 1259 OID 532558)
-- -- Name: document_relationships_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
-- --

-- CREATE SEQUENCE org_mashreqbank.document_relationships_id_seq
--     AS integer
--     START WITH 1
--     INCREMENT BY 1
--     NO MINVALUE
--     NO MAXVALUE
--     CACHE 1;


-- ALTER SEQUENCE org_mashreqbank.document_relationships_id_seq OWNER TO neondb_owner;

-- --
-- -- TOC entry 6945 (class 0 OID 0)
-- -- Dependencies: 433
-- -- Name: document_relationships_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
-- --

-- ALTER SEQUENCE org_mashreqbank.document_relationships_id_seq OWNED BY org_mashreqbank.document_relationships.id;


-- --
-- -- TOC entry 442 (class 1259 OID 532651)
-- -- Name: document_review_history; Type: TABLE; Schema: public; Owner: neondb_owner
-- --

-- CREATE TABLE org_mashreqbank.document_review_history (
--     id integer NOT NULL,
--     document_id integer,
--     version_id integer,
--     reviewer_id integer,
--     review_type character varying(50),
--     review_status character varying(50),
--     review_date timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
--     due_date timestamp without time zone,
--     comments text,
--     recommendations text,
--     action_items text[],
--     created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
--     CONSTRAINT document_review_history_review_status_check CHECK (((review_status)::text = ANY ((ARRAY['pending'::character varying, 'in_progress'::character varying, 'completed'::character varying, 'approved'::character varying, 'rejected'::character varying])::text[]))),
--     CONSTRAINT document_review_history_review_type_check CHECK (((review_type)::text = ANY ((ARRAY['periodic'::character varying, 'triggered'::character varying, 'approval'::character varying, 'compliance'::character varying])::text[])))
-- );


-- ALTER TABLE org_mashreqbank.document_review_history OWNER TO neondb_owner;

-- --
-- -- TOC entry 441 (class 1259 OID 532650)
-- -- Name: document_review_history_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
-- --

-- CREATE SEQUENCE org_mashreqbank.document_review_history_id_seq
--     AS integer
--     START WITH 1
--     INCREMENT BY 1
--     NO MINVALUE
--     NO MAXVALUE
--     CACHE 1;


-- ALTER SEQUENCE org_mashreqbank.document_review_history_id_seq OWNER TO neondb_owner;

-- --
-- -- TOC entry 6946 (class 0 OID 0)
-- -- Dependencies: 441
-- -- Name: document_review_history_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
-- --

-- ALTER SEQUENCE org_mashreqbank.document_review_history_id_seq OWNED BY org_mashreqbank.document_review_history.id;


-- --
-- -- TOC entry 438 (class 1259 OID 532607)
-- -- Name: document_risk_mappings; Type: TABLE; Schema: public; Owner: neondb_owner
-- --

-- CREATE TABLE org_mashreqbank.document_risk_mappings (
--     id integer NOT NULL,
--     document_id integer,
--     risk_id integer,
--     risk_table character varying(50),
--     mapping_type character varying(50) DEFAULT 'mitigates'::character varying,
--     description text,
--     mitigation_effectiveness character varying(20),
--     created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
--     CONSTRAINT document_risk_mappings_mapping_type_check CHECK (((mapping_type)::text = ANY ((ARRAY['mitigates'::character varying, 'addresses'::character varying, 'monitors'::character varying, 'references'::character varying])::text[]))),
--     CONSTRAINT document_risk_mappings_mitigation_effectiveness_check CHECK (((mitigation_effectiveness)::text = ANY ((ARRAY['low'::character varying, 'medium'::character varying, 'high'::character varying, 'very_high'::character varying])::text[])))
-- );


-- ALTER TABLE org_mashreqbank.document_risk_mappings OWNER TO neondb_owner;

-- --
-- -- TOC entry 437 (class 1259 OID 532606)
-- -- Name: document_risk_mappings_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
-- --

-- CREATE SEQUENCE org_mashreqbank.document_risk_mappings_id_seq
--     AS integer
--     START WITH 1
--     INCREMENT BY 1
--     NO MINVALUE
--     NO MAXVALUE
--     CACHE 1;


-- ALTER SEQUENCE org_mashreqbank.document_risk_mappings_id_seq OWNER TO neondb_owner;

-- --
-- -- TOC entry 6947 (class 0 OID 0)
-- -- Dependencies: 437
-- -- Name: document_risk_mappings_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
-- --

-- ALTER SEQUENCE org_mashreqbank.document_risk_mappings_id_seq OWNED BY org_mashreqbank.document_risk_mappings.id;


-- --
-- -- TOC entry 450 (class 1259 OID 540706)
-- -- Name: evidence; Type: TABLE; Schema: public; Owner: neondb_owner
-- --

-- CREATE TABLE org_mashreqbank.evidence (
--     id integer NOT NULL,
--     evidence_id character varying(50) NOT NULL,
--     title character varying(255) NOT NULL,
--     description text,
--     type character varying(100) NOT NULL,
--     category character varying(100),
--     file_name character varying(255),
--     file_path character varying(500),
--     file_size integer,
--     mime_type character varying(100),
--     collection_date date,
--     retention_date date,
--     status character varying(50) DEFAULT 'active'::character varying,
--     confidentiality character varying(20) DEFAULT 'internal'::character varying,
--     integrity_hash character varying(255),
--     tags text[],
--     metadata jsonb,
--     created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
--     updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
--     created_by character varying(255),
--     updated_by character varying(255),
--     CONSTRAINT evidence_confidentiality_check CHECK (((confidentiality)::text = ANY ((ARRAY['public'::character varying, 'internal'::character varying, 'confidential'::character varying, 'restricted'::character varying])::text[]))),
--     CONSTRAINT evidence_status_check CHECK (((status)::text = ANY ((ARRAY['active'::character varying, 'archived'::character varying, 'expired'::character varying])::text[])))
-- );


-- ALTER TABLE org_mashreqbank.evidence OWNER TO neondb_owner;

-- --
-- -- TOC entry 449 (class 1259 OID 540705)
-- -- Name: evidence_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
-- --

-- CREATE SEQUENCE org_mashreqbank.evidence_id_seq
--     AS integer
--     START WITH 1
--     INCREMENT BY 1
--     NO MINVALUE
--     NO MAXVALUE
--     CACHE 1;


-- ALTER SEQUENCE org_mashreqbank.evidence_id_seq OWNER TO neondb_owner;

-- --
-- -- TOC entry 6948 (class 0 OID 0)
-- -- Dependencies: 449
-- -- Name: evidence_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
-- --

-- ALTER SEQUENCE org_mashreqbank.evidence_id_seq OWNED BY org_mashreqbank.evidence.id;


-- --
-- -- TOC entry 432 (class 1259 OID 532543)
-- -- Name: evidence_library; Type: TABLE; Schema: public; Owner: neondb_owner
-- --

-- CREATE TABLE org_mashreqbank.evidence_library (
--     id integer NOT NULL,
--     evidence_number character varying(100) NOT NULL,
--     title character varying(500) NOT NULL,
--     description text,
--     evidence_type character varying(100),
--     file_name character varying(255),
--     file_path character varying(500),
--     file_size bigint,
--     file_type character varying(100),
--     file_hash character varying(128),
--     source character varying(255),
--     collection_date timestamp without time zone,
--     retention_period integer,
--     confidentiality_level character varying(20) DEFAULT 'internal'::character varying,
--     related_documents integer[],
--     related_controls integer[],
--     related_risks integer[],
--     related_findings integer[],
--     collected_by integer,
--     custodian_id integer,
--     tags text[],
--     keywords text[],
--     created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
--     updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
--     CONSTRAINT evidence_library_confidentiality_level_check CHECK (((confidentiality_level)::text = ANY ((ARRAY['public'::character varying, 'internal'::character varying, 'confidential'::character varying, 'restricted'::character varying])::text[]))),
--     CONSTRAINT evidence_library_evidence_type_check CHECK (((evidence_type)::text = ANY ((ARRAY['screenshot'::character varying, 'document'::character varying, 'log'::character varying, 'certificate'::character varying, 'report'::character varying, 'email'::character varying, 'video'::character varying, 'audio'::character varying, 'other'::character varying])::text[])))
-- );


-- ALTER TABLE org_mashreqbank.evidence_library OWNER TO neondb_owner;

-- --
-- -- TOC entry 431 (class 1259 OID 532542)
-- -- Name: evidence_library_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
-- --

-- CREATE SEQUENCE org_mashreqbank.evidence_library_id_seq
--     AS integer
--     START WITH 1
--     INCREMENT BY 1
--     NO MINVALUE
--     NO MAXVALUE
--     CACHE 1;


-- ALTER SEQUENCE org_mashreqbank.evidence_library_id_seq OWNER TO neondb_owner;

-- --
-- -- TOC entry 6949 (class 0 OID 0)
-- -- Dependencies: 431
-- -- Name: evidence_library_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
-- --

-- ALTER SEQUENCE org_mashreqbank.evidence_library_id_seq OWNED BY org_mashreqbank.evidence_library.id;


-- --
-- -- TOC entry 487 (class 1259 OID 671744)
-- -- Name: fair_risk_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
-- --

-- CREATE SEQUENCE org_mashreqbank.fair_risk_id_seq
--     START WITH 1
--     INCREMENT BY 1
--     NO MINVALUE
--     NO MAXVALUE
--     CACHE 1;


-- ALTER SEQUENCE org_mashreqbank.fair_risk_id_seq OWNER TO neondb_owner;

-- --
-- -- TOC entry 491 (class 1259 OID 679959)
-- -- Name: fair_risk_treatment_controls; Type: TABLE; Schema: public; Owner: neondb_owner
-- --

-- CREATE TABLE org_mashreqbank.fair_risk_treatment_controls (
--     id integer NOT NULL,
--     treatment_plan_id integer NOT NULL,
--     control_id character varying(100) NOT NULL,
--     control_title character varying(255) NOT NULL,
--     control_description text,
--     control_type character varying(50) NOT NULL,
--     control_category character varying(100),
--     implementation_status character varying(50) DEFAULT 'not_started'::character varying,
--     assigned_to character varying(255),
--     start_date date,
--     due_date date NOT NULL,
--     completion_date date,
--     progress_percentage integer DEFAULT 0,
--     implementation_notes text,
--     evidence_links text[],
--     testing_status character varying(50) DEFAULT 'not_tested'::character varying,
--     testing_date date,
--     testing_notes text,
--     effectiveness_rating integer,
--     cost_actual numeric(15,2) DEFAULT 0,
--     created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
--     updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
--     aging_status text,
--     CONSTRAINT fair_risk_treatment_controls_control_type_check CHECK (((control_type)::text = ANY ((ARRAY['preventive'::character varying, 'detective'::character varying, 'corrective'::character varying, 'compensating'::character varying])::text[]))),
--     CONSTRAINT fair_risk_treatment_controls_effectiveness_rating_check CHECK (((effectiveness_rating >= 1) AND (effectiveness_rating <= 5))),
--     CONSTRAINT fair_risk_treatment_controls_implementation_status_check CHECK (((implementation_status)::text = ANY ((ARRAY['not_started'::character varying, 'in_progress'::character varying, 'completed'::character varying, 'on_hold'::character varying, 'cancelled'::character varying])::text[]))),
--     CONSTRAINT fair_risk_treatment_controls_progress_percentage_check CHECK (((progress_percentage >= 0) AND (progress_percentage <= 100))),
--     CONSTRAINT fair_risk_treatment_controls_testing_status_check CHECK (((testing_status)::text = ANY ((ARRAY['not_tested'::character varying, 'testing_planned'::character varying, 'testing_in_progress'::character varying, 'passed'::character varying, 'failed'::character varying, 'needs_retest'::character varying])::text[])))
-- );


-- ALTER TABLE org_mashreqbank.fair_risk_treatment_controls OWNER TO neondb_owner;

-- --
-- -- TOC entry 6950 (class 0 OID 0)
-- -- Dependencies: 491
-- -- Name: TABLE fair_risk_treatment_controls; Type: COMMENT; Schema: public; Owner: neondb_owner
-- --

-- COMMENT ON TABLE org_mashreqbank.fair_risk_treatment_controls IS 'Individual controls/actions within treatment plans with detailed tracking';


-- --
-- -- TOC entry 6951 (class 0 OID 0)
-- -- Dependencies: 491
-- -- Name: COLUMN fair_risk_treatment_controls.control_type; Type: COMMENT; Schema: public; Owner: neondb_owner
-- --

-- COMMENT ON COLUMN org_mashreqbank.fair_risk_treatment_controls.control_type IS 'Type of control: preventive, detective, corrective, or compensating';


-- --
-- -- TOC entry 6952 (class 0 OID 0)
-- -- Dependencies: 491
-- -- Name: COLUMN fair_risk_treatment_controls.progress_percentage; Type: COMMENT; Schema: public; Owner: neondb_owner
-- --

-- COMMENT ON COLUMN org_mashreqbank.fair_risk_treatment_controls.progress_percentage IS 'Implementation progress from 0-100%';


-- --
-- -- TOC entry 6953 (class 0 OID 0)
-- -- Dependencies: 491
-- -- Name: COLUMN fair_risk_treatment_controls.effectiveness_rating; Type: COMMENT; Schema: public; Owner: neondb_owner
-- --

-- COMMENT ON COLUMN org_mashreqbank.fair_risk_treatment_controls.effectiveness_rating IS 'Control effectiveness rating from 1-5';


-- --
-- -- TOC entry 490 (class 1259 OID 679958)
-- -- Name: fair_risk_treatment_controls_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
-- --

-- CREATE SEQUENCE org_mashreqbank.fair_risk_treatment_controls_id_seq
--     AS integer
--     START WITH 1
--     INCREMENT BY 1
--     NO MINVALUE
--     NO MAXVALUE
--     CACHE 1;


-- ALTER SEQUENCE org_mashreqbank.fair_risk_treatment_controls_id_seq OWNER TO neondb_owner;

-- --
-- -- TOC entry 6954 (class 0 OID 0)
-- -- Dependencies: 490
-- -- Name: fair_risk_treatment_controls_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
-- --

-- ALTER SEQUENCE org_mashreqbank.fair_risk_treatment_controls_id_seq OWNED BY org_mashreqbank.fair_risk_treatment_controls.id;


-- --
-- -- TOC entry 489 (class 1259 OID 679937)
-- -- Name: fair_risk_treatment_plans; Type: TABLE; Schema: public; Owner: neondb_owner
-- --

-- CREATE TABLE org_mashreqbank.fair_risk_treatment_plans (
--     id integer NOT NULL,
--     fair_risk_id integer NOT NULL,
--     treatment_type character varying(50) NOT NULL,
--     treatment_strategy text NOT NULL,
--     business_justification text,
--     estimated_cost numeric(15,2) DEFAULT 0,
--     expected_risk_reduction integer DEFAULT 0,
--     approval_status character varying(50) DEFAULT 'pending'::character varying,
--     approved_by character varying(255),
--     approved_date timestamp without time zone,
--     created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
--     updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
--     agining_status text,
--     implementation_status text DEFAULT 'not_started'::character varying,
--     progress_percentage integer,
--     start_date date,
--     target_completion_date date,
--     actual_completion_date date,
--     owner character varying(200),
--     assigned_to character varying(200),
--     created_by character varying(255),
--     risk_id character varying(55),
--     asset_name character varying(100),
--     threat_event character varying(500),
--     controls_count integer,
--     implemented_controls character varying(500),
--     CONSTRAINT fair_risk_treatment_plans_approval_status_check CHECK (((approval_status)::text = ANY ((ARRAY['pending'::character varying, 'approved'::character varying, 'rejected'::character varying, 'under_review'::character varying])::text[]))),
--     CONSTRAINT fair_risk_treatment_plans_expected_risk_reduction_check CHECK (((expected_risk_reduction >= 0) AND (expected_risk_reduction <= 100))),
--     CONSTRAINT fair_risk_treatment_plans_treatment_type_check CHECK (((treatment_type)::text = ANY ((ARRAY['accept'::character varying, 'mitigate'::character varying, 'transfer'::character varying, 'avoid'::character varying])::text[])))
-- );


-- ALTER TABLE org_mashreqbank.fair_risk_treatment_plans OWNER TO neondb_owner;

-- --
-- -- TOC entry 6955 (class 0 OID 0)
-- -- Dependencies: 489
-- -- Name: TABLE fair_risk_treatment_plans; Type: COMMENT; Schema: public; Owner: neondb_owner
-- --

-- COMMENT ON TABLE org_mashreqbank.fair_risk_treatment_plans IS 'Treatment plans for FAIR risks including strategy and approval workflow';


-- --
-- -- TOC entry 6956 (class 0 OID 0)
-- -- Dependencies: 489
-- -- Name: COLUMN fair_risk_treatment_plans.treatment_type; Type: COMMENT; Schema: public; Owner: neondb_owner
-- --

-- COMMENT ON COLUMN org_mashreqbank.fair_risk_treatment_plans.treatment_type IS 'Risk treatment strategy: accept, mitigate, transfer, or avoid';


-- --
-- -- TOC entry 6957 (class 0 OID 0)
-- -- Dependencies: 489
-- -- Name: COLUMN fair_risk_treatment_plans.expected_risk_reduction; Type: COMMENT; Schema: public; Owner: neondb_owner
-- --

-- COMMENT ON COLUMN org_mashreqbank.fair_risk_treatment_plans.expected_risk_reduction IS 'Expected percentage reduction in risk level';


-- --
-- -- TOC entry 488 (class 1259 OID 679936)
-- -- Name: fair_risk_treatment_plans_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
-- --

-- CREATE SEQUENCE org_mashreqbank.fair_risk_treatment_plans_id_seq
--     AS integer
--     START WITH 1
--     INCREMENT BY 1
--     NO MINVALUE
--     NO MAXVALUE
--     CACHE 1;


-- ALTER SEQUENCE org_mashreqbank.fair_risk_treatment_plans_id_seq OWNER TO neondb_owner;

-- --
-- -- TOC entry 6958 (class 0 OID 0)
-- -- Dependencies: 488
-- -- Name: fair_risk_treatment_plans_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
-- --

-- ALTER SEQUENCE org_mashreqbank.fair_risk_treatment_plans_id_seq OWNED BY org_mashreqbank.fair_risk_treatment_plans.id;


-- --
-- -- TOC entry 493 (class 1259 OID 679984)
-- -- Name: fair_risk_treatment_tracking; Type: TABLE; Schema: public; Owner: neondb_owner
-- --

-- CREATE TABLE org_mashreqbank.fair_risk_treatment_tracking (
--     id integer NOT NULL,
--     control_id integer NOT NULL,
--     field_changed character varying(100) NOT NULL,
--     old_value text,
--     new_value text,
--     changed_by character varying(255),
--     change_reason text,
--     changed_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
--     implementation_status text DEFAULT 'not_started'::character varying
-- );


-- ALTER TABLE org_mashreqbank.fair_risk_treatment_tracking OWNER TO neondb_owner;

-- --
-- -- TOC entry 6959 (class 0 OID 0)
-- -- Dependencies: 493
-- -- Name: TABLE fair_risk_treatment_tracking; Type: COMMENT; Schema: public; Owner: neondb_owner
-- --

-- COMMENT ON TABLE org_mashreqbank.fair_risk_treatment_tracking IS 'Audit trail for changes to treatment controls';


-- --
-- -- TOC entry 492 (class 1259 OID 679983)
-- -- Name: fair_risk_treatment_tracking_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
-- --

-- CREATE SEQUENCE org_mashreqbank.fair_risk_treatment_tracking_id_seq
--     AS integer
--     START WITH 1
--     INCREMENT BY 1
--     NO MINVALUE
--     NO MAXVALUE
--     CACHE 1;


-- ALTER SEQUENCE org_mashreqbank.fair_risk_treatment_tracking_id_seq OWNER TO neondb_owner;

-- --
-- -- TOC entry 6960 (class 0 OID 0)
-- -- Dependencies: 492
-- -- Name: fair_risk_treatment_tracking_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
-- --

-- ALTER SEQUENCE org_mashreqbank.fair_risk_treatment_tracking_id_seq OWNED BY org_mashreqbank.fair_risk_treatment_tracking.id;


-- --
-- -- TOC entry 486 (class 1259 OID 638977)
-- -- Name: fair_risks; Type: TABLE; Schema: public; Owner: neondb_owner
-- --

-- CREATE TABLE org_mashreqbank.fair_risks (
--     id integer NOT NULL,
--     risk_id character varying(50) NOT NULL,
--     risk_title character varying(255) NOT NULL,
--     risk_description text,
--     asset_id character varying(50),
--     asset_name character varying(255),
--     threat_actor character varying(100),
--     threat_event character varying(255),
--     vulnerability text,
--     owner character varying(100),
--     inherent_likelihood integer,
--     inherent_impact integer,
--     inherent_risk_score numeric(5,2),
--     inherent_risk_level character varying(20),
--     residual_likelihood numeric(5,2),
--     residual_impact numeric(5,2),
--     residual_risk_score numeric(5,2),
--     residual_risk_level character varying(20),
--     threat_event_frequency integer,
--     vulnerability_score integer,
--     loss_event_frequency numeric(10,6),
--     primary_loss_min numeric(15,2) DEFAULT 0,
--     primary_loss_max numeric(15,2) DEFAULT 0,
--     primary_loss_most_likely numeric(15,2) DEFAULT 0,
--     secondary_loss_min numeric(15,2) DEFAULT 0,
--     secondary_loss_max numeric(15,2) DEFAULT 0,
--     secondary_loss_most_likely numeric(15,2) DEFAULT 0,
--     annual_loss_expectancy numeric(15,2),
--     control_strength numeric(5,2) DEFAULT 0,
--     treatment_plan text,
--     treatment_status character varying(20) DEFAULT 'planned'::character varying,
--     treatment_due_date date,
--     created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
--     updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
--     threat_capability character varying(600),
--     threat_motivation character varying(600),
--     loss_event_frequency_min numeric DEFAULT '0'::numeric,
--     loss_event_frequency_most_likely numeric DEFAULT '0'::numeric,
--     loss_event_frequency_max numeric,
--     risk_tolerance numeric,
--     CONSTRAINT fair_risks_control_effectiveness_check CHECK (((control_strength >= (0)::numeric) AND (control_strength <= (100)::numeric))),
--     CONSTRAINT fair_risks_inherent_impact_check CHECK (((inherent_impact >= 1) AND (inherent_impact <= 5))),
--     CONSTRAINT fair_risks_inherent_likelihood_check CHECK (((inherent_likelihood >= 1) AND (inherent_likelihood <= 5))),
--     CONSTRAINT fair_risks_threat_event_frequency_check CHECK (((threat_event_frequency >= 1) AND (threat_event_frequency <= 5))),
--     CONSTRAINT fair_risks_treatment_status_check CHECK (((treatment_status)::text = ANY ((ARRAY['planned'::character varying, 'in-progress'::character varying, 'completed'::character varying, 'deferred'::character varying, 'cancelled'::character varying])::text[]))),
--     CONSTRAINT fair_risks_vulnerability_score_check CHECK (((vulnerability_score >= 1) AND (vulnerability_score <= 5)))
-- );


-- ALTER TABLE org_mashreqbank.fair_risks OWNER TO neondb_owner;

-- --
-- -- TOC entry 6961 (class 0 OID 0)
-- -- Dependencies: 486
-- -- Name: TABLE fair_risks; Type: COMMENT; Schema: public; Owner: neondb_owner
-- --

-- COMMENT ON TABLE org_mashreqbank.fair_risks IS 'FAIR (Factor Analysis of Information Risk) quantitative risk assessments';


-- --
-- -- TOC entry 6962 (class 0 OID 0)
-- -- Dependencies: 486
-- -- Name: COLUMN fair_risks.risk_id; Type: COMMENT; Schema: public; Owner: neondb_owner
-- --

-- COMMENT ON COLUMN org_mashreqbank.fair_risks.risk_id IS 'Auto-generated FAIR risk identifier in format FAIR-XXXXXX';


-- --
-- -- TOC entry 6963 (class 0 OID 0)
-- -- Dependencies: 486
-- -- Name: COLUMN fair_risks.loss_event_frequency; Type: COMMENT; Schema: public; Owner: neondb_owner
-- --

-- COMMENT ON COLUMN org_mashreqbank.fair_risks.loss_event_frequency IS 'Calculated as (Threat Event Frequency × Vulnerability) / 100';


-- --
-- -- TOC entry 6964 (class 0 OID 0)
-- -- Dependencies: 486
-- -- Name: COLUMN fair_risks.primary_loss_min; Type: COMMENT; Schema: public; Owner: neondb_owner
-- --

-- COMMENT ON COLUMN org_mashreqbank.fair_risks.primary_loss_min IS 'Minimum direct financial loss estimate';


-- --
-- -- TOC entry 6965 (class 0 OID 0)
-- -- Dependencies: 486
-- -- Name: COLUMN fair_risks.primary_loss_max; Type: COMMENT; Schema: public; Owner: neondb_owner
-- --

-- COMMENT ON COLUMN org_mashreqbank.fair_risks.primary_loss_max IS 'Maximum direct financial loss estimate';


-- --
-- -- TOC entry 6966 (class 0 OID 0)
-- -- Dependencies: 486
-- -- Name: COLUMN fair_risks.primary_loss_most_likely; Type: COMMENT; Schema: public; Owner: neondb_owner
-- --

-- COMMENT ON COLUMN org_mashreqbank.fair_risks.primary_loss_most_likely IS 'Most likely direct financial loss estimate';


-- --
-- -- TOC entry 6967 (class 0 OID 0)
-- -- Dependencies: 486
-- -- Name: COLUMN fair_risks.secondary_loss_min; Type: COMMENT; Schema: public; Owner: neondb_owner
-- --

-- COMMENT ON COLUMN org_mashreqbank.fair_risks.secondary_loss_min IS 'Minimum indirect loss estimate (reputation, regulatory, etc.)';


-- --
-- -- TOC entry 6968 (class 0 OID 0)
-- -- Dependencies: 486
-- -- Name: COLUMN fair_risks.secondary_loss_max; Type: COMMENT; Schema: public; Owner: neondb_owner
-- --

-- COMMENT ON COLUMN org_mashreqbank.fair_risks.secondary_loss_max IS 'Maximum indirect loss estimate';


-- --
-- -- TOC entry 6969 (class 0 OID 0)
-- -- Dependencies: 486
-- -- Name: COLUMN fair_risks.secondary_loss_most_likely; Type: COMMENT; Schema: public; Owner: neondb_owner
-- --

-- COMMENT ON COLUMN org_mashreqbank.fair_risks.secondary_loss_most_likely IS 'Most likely indirect loss estimate';


-- --
-- -- TOC entry 6970 (class 0 OID 0)
-- -- Dependencies: 486
-- -- Name: COLUMN fair_risks.annual_loss_expectancy; Type: COMMENT; Schema: public; Owner: neondb_owner
-- --

-- COMMENT ON COLUMN org_mashreqbank.fair_risks.annual_loss_expectancy IS 'Calculated as Loss Event Frequency × Loss Magnitude';


-- --
-- -- TOC entry 485 (class 1259 OID 638976)
-- -- Name: fair_risks_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
-- --

-- CREATE SEQUENCE org_mashreqbank.fair_risks_id_seq
--     AS integer
--     START WITH 1
--     INCREMENT BY 1
--     NO MINVALUE
--     NO MAXVALUE
--     CACHE 1;


-- ALTER SEQUENCE org_mashreqbank.fair_risks_id_seq OWNER TO neondb_owner;

-- --
-- -- TOC entry 6971 (class 0 OID 0)
-- -- Dependencies: 485
-- -- Name: fair_risks_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
-- --

-- ALTER SEQUENCE org_mashreqbank.fair_risks_id_seq OWNED BY org_mashreqbank.fair_risks.id;


-- --
-- -- TOC entry 243 (class 1259 OID 49153)
-- -- Name: organizations; Type: TABLE; Schema: public; Owner: neondb_owner
-- --

-- CREATE TABLE org_mashreqbank.organizations (
--     id integer NOT NULL,
--     name character varying(255) NOT NULL,
--     description text,
--     address text,
--     phone character varying(50),
--     email character varying(255),
--     website character varying(255),
--     status character varying(50) DEFAULT 'Active'::character varying,
--     created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
--     updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
--     organization_id integer NOT NULL,
--     schema_name character varying(50),
--     is_active boolean DEFAULT true
-- );


-- ALTER TABLE org_mashreqbank.organizations OWNER TO neondb_owner;

-- --
-- -- TOC entry 424 (class 1259 OID 516199)
-- -- Name: users; Type: TABLE; Schema: public; Owner: neondb_owner
-- --

-- CREATE TABLE org_mashreqbank.users (
--     id integer NOT NULL,
--     organization_id integer,
--     department_id integer,
--     username character varying(100) NOT NULL,
--     email character varying(255),
--     first_name character varying(100),
--     last_name character varying(100),
--     phone character varying(50),
--     job_title character varying(255),
--     employee_id character varying(100),
--     manager_id integer,
--     status character varying(50) DEFAULT 'Active'::character varying,
--     last_login timestamp without time zone,
--     password_hash character varying(255),
--     created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
--     updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
--     primary_role_id integer,
--     login_attempts integer DEFAULT 0,
--     locked_until timestamp without time zone,
--     is_active boolean DEFAULT true,
--     email_verified boolean DEFAULT false,
--     role character varying(100),
--     failed_login_attempts integer DEFAULT 0,
--     account_locked_until timestamp without time zone
-- );


-- ALTER TABLE org_mashreqbank.users OWNER TO neondb_owner;

-- --
-- -- TOC entry 510 (class 1259 OID 778398)
-- -- Name: findings_with_assessment_details; Type: VIEW; Schema: public; Owner: neondb_owner
-- --

-- CREATE VIEW org_mashreqbank.findings_with_assessment_details AS
--  SELECT af.id,
--     af.finding_reference,
--     af.finding_title,
--     af.finding_description,
--     af.severity,
--     af.category,
--     af.status,
--     af.priority,
--     af.risk_score,
--     af.assigned_to,
--     af.due_date,
--     af.created_at AS finding_created_at,
--     af.updated_at AS finding_updated_at,
--     a.assessment_id,
--     a.assessment_name,
--     a.type AS assessment_type,
--     a.status AS assessment_status,
--     a.methodology,
--     a.assessor_name,
--     o.name AS organization_name,
--     d.name AS department_name,
--     concat(u.first_name, ' ', u.last_name) AS user_name
--    FROM ((((org_mashreqbank.assessment_findings af
--      JOIN org_mashreqbank.assessments a ON ((af.assessment_id = a.id)))
--      LEFT JOIN org_mashreqbank.organizations o ON ((af.organization_id = o.id)))
--      LEFT JOIN org_mashreqbank.departments d ON ((af.department_id = d.id)))
--      LEFT JOIN org_mashreqbank.users u ON ((af.user_id = u.id)));


-- ALTER VIEW org_mashreqbank.findings_with_assessment_details OWNER TO neondb_owner;

-- --
-- -- TOC entry 456 (class 1259 OID 548884)
-- -- Name: hipaa_assessment_requirements; Type: TABLE; Schema: public; Owner: neondb_owner
-- --

-- CREATE TABLE org_mashreqbank.hipaa_assessment_requirements (
--     id integer NOT NULL,
--     assessment_id integer,
--     requirement_id integer,
--     compliance_status character varying(50),
--     evidence text,
--     gaps_identified text,
--     remediation_plan text,
--     remediation_priority character varying(20),
--     remediation_due_date date,
--     remediation_owner character varying(255),
--     remediation_status character varying(50) DEFAULT 'Open'::character varying,
--     assessment_notes text,
--     created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
--     updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
-- );


-- ALTER TABLE org_mashreqbank.hipaa_assessment_requirements OWNER TO neondb_owner;

-- --
-- -- TOC entry 455 (class 1259 OID 548883)
-- -- Name: hipaa_assessment_requirements_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
-- --

-- CREATE SEQUENCE org_mashreqbank.hipaa_assessment_requirements_id_seq
--     AS integer
--     START WITH 1
--     INCREMENT BY 1
--     NO MINVALUE
--     NO MAXVALUE
--     CACHE 1;


-- ALTER SEQUENCE org_mashreqbank.hipaa_assessment_requirements_id_seq OWNER TO neondb_owner;

-- --
-- -- TOC entry 6972 (class 0 OID 0)
-- -- Dependencies: 455
-- -- Name: hipaa_assessment_requirements_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
-- --

-- ALTER SEQUENCE org_mashreqbank.hipaa_assessment_requirements_id_seq OWNED BY org_mashreqbank.hipaa_assessment_requirements.id;


-- --
-- -- TOC entry 482 (class 1259 OID 598017)
-- -- Name: hipaa_assessment_results; Type: TABLE; Schema: public; Owner: neondb_owner
-- --

-- CREATE TABLE org_mashreqbank.hipaa_assessment_results (
--     id integer NOT NULL,
--     assessment_id integer NOT NULL,
--     requirement_id integer NOT NULL,
--     compliance_status character varying(50) DEFAULT 'not-assessed'::character varying,
--     implementation_status character varying(50) DEFAULT 'not-implemented'::character varying,
--     evidence_provided text,
--     gaps_identified text,
--     remediation_required text,
--     risk_rating character varying(20) DEFAULT 'medium'::character varying,
--     comments text,
--     assessor_notes text,
--     last_reviewed_date date,
--     next_review_date date,
--     responsible_party character varying(255),
--     created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
--     updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
--     created_by character varying(255),
--     updated_by character varying(255)
-- );


-- ALTER TABLE org_mashreqbank.hipaa_assessment_results OWNER TO neondb_owner;

-- --
-- -- TOC entry 6973 (class 0 OID 0)
-- -- Dependencies: 482
-- -- Name: TABLE hipaa_assessment_results; Type: COMMENT; Schema: public; Owner: neondb_owner
-- --

-- COMMENT ON TABLE org_mashreqbank.hipaa_assessment_results IS 'Stores individual assessment results for HIPAA requirements';


-- --
-- -- TOC entry 6974 (class 0 OID 0)
-- -- Dependencies: 482
-- -- Name: COLUMN hipaa_assessment_results.compliance_status; Type: COMMENT; Schema: public; Owner: neondb_owner
-- --

-- COMMENT ON COLUMN org_mashreqbank.hipaa_assessment_results.compliance_status IS 'Status: compliant, non-compliant, partially-compliant, not-applicable, not-assessed';


-- --
-- -- TOC entry 6975 (class 0 OID 0)
-- -- Dependencies: 482
-- -- Name: COLUMN hipaa_assessment_results.implementation_status; Type: COMMENT; Schema: public; Owner: neondb_owner
-- --

-- COMMENT ON COLUMN org_mashreqbank.hipaa_assessment_results.implementation_status IS 'Implementation: implemented, partially-implemented, not-implemented, planned';


-- --
-- -- TOC entry 6976 (class 0 OID 0)
-- -- Dependencies: 482
-- -- Name: COLUMN hipaa_assessment_results.risk_rating; Type: COMMENT; Schema: public; Owner: neondb_owner
-- --

-- COMMENT ON COLUMN org_mashreqbank.hipaa_assessment_results.risk_rating IS 'Risk level: critical, high, medium, low';


-- --
-- -- TOC entry 481 (class 1259 OID 598016)
-- -- Name: hipaa_assessment_results_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
-- --

-- CREATE SEQUENCE org_mashreqbank.hipaa_assessment_results_id_seq
--     AS integer
--     START WITH 1
--     INCREMENT BY 1
--     NO MINVALUE
--     NO MAXVALUE
--     CACHE 1;


-- ALTER SEQUENCE org_mashreqbank.hipaa_assessment_results_id_seq OWNER TO neondb_owner;

-- --
-- -- TOC entry 6977 (class 0 OID 0)
-- -- Dependencies: 481
-- -- Name: hipaa_assessment_results_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
-- --

-- ALTER SEQUENCE org_mashreqbank.hipaa_assessment_results_id_seq OWNED BY org_mashreqbank.hipaa_assessment_results.id;


-- --
-- -- TOC entry 454 (class 1259 OID 548865)
-- -- Name: hipaa_assessments; Type: TABLE; Schema: public; Owner: neondb_owner
-- --

-- CREATE TABLE org_mashreqbank.hipaa_assessments (
--     id integer NOT NULL,
--     assessment_name character varying(255) NOT NULL,
--     organization_id integer,
--     assessment_type character varying(50) DEFAULT 'Initial'::character varying,
--     scope text,
--     covered_entity_type character varying(100),
--     phi_types text[],
--     assessment_date date DEFAULT CURRENT_DATE,
--     assessor character varying(255),
--     assessor_email character varying(255),
--     status character varying(50) DEFAULT 'In Progress'::character varying,
--     overall_compliance_score integer,
--     risk_level character varying(20),
--     findings_summary text,
--     recommendations text,
--     target_date date,
--     created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
--     updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
--     entity_type character varying(20),
--     completion_percentage integer,
--     total_requirements integer,
--     compliant_count integer,
--     non_compliant_count integer,
--     partially_compliant_count integer,
--     not_applicable_count integer,
--     created_by character varying(200),
--     dept_name character varying(100),
--     description character varying(255)
-- );


-- ALTER TABLE org_mashreqbank.hipaa_assessments OWNER TO neondb_owner;

-- --
-- -- TOC entry 453 (class 1259 OID 548864)
-- -- Name: hipaa_assessments_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
-- --

-- CREATE SEQUENCE org_mashreqbank.hipaa_assessments_id_seq
--     AS integer
--     START WITH 1
--     INCREMENT BY 1
--     NO MINVALUE
--     NO MAXVALUE
--     CACHE 1;


-- ALTER SEQUENCE org_mashreqbank.hipaa_assessments_id_seq OWNER TO neondb_owner;

-- --
-- -- TOC entry 6978 (class 0 OID 0)
-- -- Dependencies: 453
-- -- Name: hipaa_assessments_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
-- --

-- ALTER SEQUENCE org_mashreqbank.hipaa_assessments_id_seq OWNED BY org_mashreqbank.hipaa_assessments.id;


-- --
-- -- TOC entry 395 (class 1259 OID 385041)
-- -- Name: hipaa_compliance_tests; Type: TABLE; Schema: public; Owner: neondb_owner
-- --

-- CREATE TABLE org_mashreqbank.hipaa_compliance_tests (
--     id integer NOT NULL,
--     test_id character varying(50) NOT NULL,
--     control_id character varying(20),
--     test_name character varying(255) NOT NULL,
--     test_description text,
--     test_procedure text NOT NULL,
--     test_frequency character varying(50) NOT NULL,
--     test_status character varying(50) DEFAULT 'Pending'::character varying,
--     test_result character varying(50),
--     test_date date,
--     tester_name character varying(255),
--     findings text,
--     recommendations text,
--     evidence_collected text,
--     next_test_date date,
--     created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
--     updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
-- );


-- ALTER TABLE org_mashreqbank.hipaa_compliance_tests OWNER TO neondb_owner;

-- --
-- -- TOC entry 394 (class 1259 OID 385040)
-- -- Name: hipaa_compliance_tests_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
-- --

-- CREATE SEQUENCE org_mashreqbank.hipaa_compliance_tests_id_seq
--     AS integer
--     START WITH 1
--     INCREMENT BY 1
--     NO MINVALUE
--     NO MAXVALUE
--     CACHE 1;


-- ALTER SEQUENCE org_mashreqbank.hipaa_compliance_tests_id_seq OWNER TO neondb_owner;

-- --
-- -- TOC entry 6979 (class 0 OID 0)
-- -- Dependencies: 394
-- -- Name: hipaa_compliance_tests_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
-- --

-- ALTER SEQUENCE org_mashreqbank.hipaa_compliance_tests_id_seq OWNED BY org_mashreqbank.hipaa_compliance_tests.id;


-- --
-- -- TOC entry 393 (class 1259 OID 385025)
-- -- Name: hipaa_controls; Type: TABLE; Schema: public; Owner: neondb_owner
-- --

-- CREATE TABLE org_mashreqbank.hipaa_controls (
--     id integer NOT NULL,
--     control_id character varying(20) NOT NULL,
--     control_title character varying(255) NOT NULL,
--     control_description text NOT NULL,
--     rule_type character varying(20) NOT NULL,
--     section character varying(100) NOT NULL,
--     implementation_specification character varying(20) NOT NULL,
--     control_category character varying(100) NOT NULL,
--     implementation_status character varying(50) DEFAULT 'Not Implemented'::character varying,
--     compliance_status character varying(50) DEFAULT 'Non-Compliant'::character varying,
--     evidence text,
--     responsible_party character varying(255),
--     implementation_date date,
--     last_assessment_date date,
--     next_assessment_date date,
--     risk_level character varying(20) DEFAULT 'Medium'::character varying,
--     remediation_notes text,
--     created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
--     updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
-- );


-- ALTER TABLE org_mashreqbank.hipaa_controls OWNER TO neondb_owner;

-- --
-- -- TOC entry 392 (class 1259 OID 385024)
-- -- Name: hipaa_controls_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
-- --

-- CREATE SEQUENCE org_mashreqbank.hipaa_controls_id_seq
--     AS integer
--     START WITH 1
--     INCREMENT BY 1
--     NO MINVALUE
--     NO MAXVALUE
--     CACHE 1;


-- ALTER SEQUENCE org_mashreqbank.hipaa_controls_id_seq OWNER TO neondb_owner;

-- --
-- -- TOC entry 6980 (class 0 OID 0)
-- -- Dependencies: 392
-- -- Name: hipaa_controls_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
-- --

-- ALTER SEQUENCE org_mashreqbank.hipaa_controls_id_seq OWNED BY org_mashreqbank.hipaa_controls.id;


-- --
-- -- TOC entry 470 (class 1259 OID 573499)
-- -- Name: hipaa_remediation_actions; Type: TABLE; Schema: public; Owner: neondb_owner
-- --

-- CREATE TABLE org_mashreqbank.hipaa_remediation_actions (
--     id integer NOT NULL,
--     assessment_id integer,
--     requirement_id integer,
--     finding_id character varying(50) NOT NULL,
--     finding_title character varying(255) NOT NULL,
--     finding_description text NOT NULL,
--     finding_severity character varying(20) NOT NULL,
--     finding_category character varying(100),
--     remediation_action text NOT NULL,
--     remediation_priority character varying(20) NOT NULL,
--     remediation_status character varying(50) DEFAULT 'Open'::character varying,
--     remediation_type character varying(50),
--     assigned_to character varying(255),
--     assigned_department character varying(100),
--     responsible_manager character varying(255),
--     target_completion_date date,
--     actual_completion_date date,
--     estimated_effort_hours integer,
--     actual_effort_hours integer,
--     estimated_cost numeric(12,2),
--     actual_cost numeric(12,2),
--     budget_approved boolean DEFAULT false,
--     progress_percentage integer DEFAULT 0,
--     last_update_date date DEFAULT CURRENT_DATE,
--     next_review_date date,
--     evidence_required text,
--     evidence_provided text,
--     supporting_documents text[],
--     risk_before_remediation character varying(20),
--     risk_after_remediation character varying(20),
--     business_impact text,
--     phi_involved boolean DEFAULT false,
--     breach_risk boolean DEFAULT false,
--     regulatory_deadline date,
--     requires_approval boolean DEFAULT false,
--     approved_by character varying(255),
--     approval_date date,
--     approval_comments text,
--     verification_method character varying(100),
--     verified_by character varying(255),
--     verification_date date,
--     verification_status character varying(50),
--     verification_comments text,
--     created_by character varying(255),
--     created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
--     updated_by character varying(255),
--     updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
--     CONSTRAINT valid_priority CHECK (((remediation_priority)::text = ANY ((ARRAY['Critical'::character varying, 'High'::character varying, 'Medium'::character varying, 'Low'::character varying])::text[]))),
--     CONSTRAINT valid_progress CHECK (((progress_percentage >= 0) AND (progress_percentage <= 100))),
--     CONSTRAINT valid_severity CHECK (((finding_severity)::text = ANY ((ARRAY['Critical'::character varying, 'High'::character varying, 'Medium'::character varying, 'Low'::character varying])::text[]))),
--     CONSTRAINT valid_status CHECK (((remediation_status)::text = ANY ((ARRAY['Open'::character varying, 'In Progress'::character varying, 'Under Review'::character varying, 'Completed'::character varying, 'Closed'::character varying, 'Deferred'::character varying])::text[])))
-- );


-- ALTER TABLE org_mashreqbank.hipaa_remediation_actions OWNER TO neondb_owner;

-- --
-- -- TOC entry 469 (class 1259 OID 573498)
-- -- Name: hipaa_remediation_actions_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
-- --

-- CREATE SEQUENCE org_mashreqbank.hipaa_remediation_actions_id_seq
--     AS integer
--     START WITH 1
--     INCREMENT BY 1
--     NO MINVALUE
--     NO MAXVALUE
--     CACHE 1;


-- ALTER SEQUENCE org_mashreqbank.hipaa_remediation_actions_id_seq OWNER TO neondb_owner;

-- --
-- -- TOC entry 6981 (class 0 OID 0)
-- -- Dependencies: 469
-- -- Name: hipaa_remediation_actions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
-- --

-- ALTER SEQUENCE org_mashreqbank.hipaa_remediation_actions_id_seq OWNED BY org_mashreqbank.hipaa_remediation_actions.id;


-- --
-- -- TOC entry 458 (class 1259 OID 557057)
-- -- Name: hipaa_requirements; Type: TABLE; Schema: public; Owner: neondb_owner
-- --

-- CREATE TABLE org_mashreqbank.hipaa_requirements (
--     id integer NOT NULL,
--     category character varying(100) NOT NULL,
--     requirement_id character varying(20) NOT NULL,
--     title character varying(255) NOT NULL,
--     description text NOT NULL,
--     priority character varying(20) DEFAULT 'Required'::character varying NOT NULL,
--     status character varying(50) DEFAULT 'Not Started'::character varying NOT NULL,
--     created_date timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
--     updated_date timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
--     applicable_entities character varying(500)
-- );


-- ALTER TABLE org_mashreqbank.hipaa_requirements OWNER TO neondb_owner;

-- --
-- -- TOC entry 457 (class 1259 OID 557056)
-- -- Name: hipaa_requirements_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
-- --

-- CREATE SEQUENCE org_mashreqbank.hipaa_requirements_id_seq
--     AS integer
--     START WITH 1
--     INCREMENT BY 1
--     NO MINVALUE
--     NO MAXVALUE
--     CACHE 1;


-- ALTER SEQUENCE org_mashreqbank.hipaa_requirements_id_seq OWNER TO neondb_owner;

-- --
-- -- TOC entry 6982 (class 0 OID 0)
-- -- Dependencies: 457
-- -- Name: hipaa_requirements_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
-- --

-- ALTER SEQUENCE org_mashreqbank.hipaa_requirements_id_seq OWNED BY org_mashreqbank.hipaa_requirements.id;


-- --
-- -- TOC entry 408 (class 1259 OID 410106)
-- -- Name: incident_actions; Type: TABLE; Schema: public; Owner: neondb_owner
-- --

-- CREATE TABLE org_mashreqbank.incident_actions (
--     id uuid DEFAULT gen_random_uuid() NOT NULL,
--     incident_id uuid,
--     action_type character varying(50) NOT NULL,
--     action_description text NOT NULL,
--     assigned_to uuid,
--     due_date timestamp with time zone,
--     completion_date timestamp with time zone,
--     status character varying(50) DEFAULT 'pending'::character varying,
--     priority character varying(20) DEFAULT 'medium'::character varying,
--     created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
-- );


-- ALTER TABLE org_mashreqbank.incident_actions OWNER TO neondb_owner;

-- --
-- -- TOC entry 410 (class 1259 OID 410147)
-- -- Name: incident_attachments; Type: TABLE; Schema: public; Owner: neondb_owner
-- --

-- CREATE TABLE org_mashreqbank.incident_attachments (
--     id uuid DEFAULT gen_random_uuid() NOT NULL,
--     incident_id uuid,
--     file_name character varying(255) NOT NULL,
--     file_path character varying(500),
--     file_size integer,
--     file_type character varying(50),
--     uploaded_by uuid,
--     uploaded_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
-- );


-- ALTER TABLE org_mashreqbank.incident_attachments OWNER TO neondb_owner;

-- --
-- -- TOC entry 406 (class 1259 OID 410048)
-- -- Name: incident_categories; Type: TABLE; Schema: public; Owner: neondb_owner
-- --

-- CREATE TABLE org_mashreqbank.incident_categories (
--     id uuid DEFAULT gen_random_uuid() NOT NULL,
--     name character varying(100) NOT NULL,
--     description text,
--     color character varying(7) DEFAULT '#ef4444'::character varying,
--     created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
--     updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
-- );


-- ALTER TABLE org_mashreqbank.incident_categories OWNER TO neondb_owner;

-- --
-- -- TOC entry 409 (class 1259 OID 410127)
-- -- Name: incident_communications; Type: TABLE; Schema: public; Owner: neondb_owner
-- --

-- CREATE TABLE org_mashreqbank.incident_communications (
--     id uuid DEFAULT gen_random_uuid() NOT NULL,
--     incident_id uuid,
--     communication_type character varying(50) NOT NULL,
--     recipient character varying(255),
--     subject character varying(255),
--     message text,
--     sent_date timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
--     sent_by uuid,
--     created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
-- );


-- ALTER TABLE org_mashreqbank.incident_communications OWNER TO neondb_owner;

-- --
-- -- TOC entry 235 (class 1259 OID 24657)
-- -- Name: incidents; Type: TABLE; Schema: public; Owner: neondb_owner
-- --

-- CREATE TABLE org_mashreqbank.incidents (
--     id integer NOT NULL,
--     incident_id character varying(50) NOT NULL,
--     incident_title character varying(255) NOT NULL,
--     incident_description text,
--     incident_type character varying(100),
--     severity character varying(50),
--     status character varying(50) DEFAULT 'Open'::character varying,
--     reported_by character varying(255),
--     assigned_to character varying(255),
--     reported_date timestamp without time zone,
--     detected_date timestamp without time zone,
--     resolved_date timestamp without time zone,
--     root_cause text,
--     impact_assessment text,
--     lessons_learned text,
--     related_asset_id integer,
--     related_risk_id integer,
--     created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
--     updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
--     due_date date
-- );


-- ALTER TABLE org_mashreqbank.incidents OWNER TO neondb_owner;

-- --
-- -- TOC entry 234 (class 1259 OID 24656)
-- -- Name: incidents_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
-- --

-- CREATE SEQUENCE org_mashreqbank.incidents_id_seq
--     AS integer
--     START WITH 1
--     INCREMENT BY 1
--     NO MINVALUE
--     NO MAXVALUE
--     CACHE 1;


-- ALTER SEQUENCE org_mashreqbank.incidents_id_seq OWNER TO neondb_owner;

-- --
-- -- TOC entry 6983 (class 0 OID 0)
-- -- Dependencies: 234
-- -- Name: incidents_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
-- --

-- ALTER SEQUENCE org_mashreqbank.incidents_id_seq OWNED BY org_mashreqbank.incidents.id;


-- --
-- -- TOC entry 229 (class 1259 OID 24577)
-- -- Name: information_assets; Type: TABLE; Schema: public; Owner: neondb_owner
-- --

-- CREATE TABLE org_mashreqbank.information_assets (
--     id integer NOT NULL,
--     asset_name character varying(255) NOT NULL,
--     asset_type character varying(100) NOT NULL,
--     classification character varying(50) NOT NULL,
--     owner character varying(255) NOT NULL,
--     custodian character varying(255),
--     location character varying(255),
--     description text,
--     criticality character varying(50),
--     confidentiality_level character varying(50),
--     integrity_level character varying(50),
--     availability_level character varying(50),
--     retention_period integer,
--     disposal_method character varying(255),
--     created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
--     updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
--     organization_id integer,
--     departments_id integer,
--     asset_id character varying(20),
--     status boolean DEFAULT true,
--     compliance_requirements character varying(50),
--     created_by character varying(20)
-- );


-- ALTER TABLE org_mashreqbank.information_assets OWNER TO neondb_owner;

-- --
-- -- TOC entry 289 (class 1259 OID 122884)
-- -- Name: information_assets_detailed; Type: TABLE; Schema: public; Owner: neondb_owner
-- --

-- CREATE TABLE org_mashreqbank.information_assets_detailed (
--     id integer NOT NULL,
--     workflow_id integer,
--     asset_name character varying(255) NOT NULL,
--     asset_type character varying(100) NOT NULL,
--     asset_description text,
--     asset_owner character varying(255),
--     asset_custodian character varying(255),
--     business_value character varying(50),
--     confidentiality_requirement character varying(50),
--     integrity_requirement character varying(50),
--     availability_requirement character varying(50),
--     authenticity_requirement character varying(50),
--     accountability_requirement character varying(50),
--     non_repudiation_requirement character varying(50),
--     reliability_requirement character varying(50),
--     location character varying(255),
--     dependencies text,
--     legal_regulatory_requirements text,
--     created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
--     updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
-- );


-- ALTER TABLE org_mashreqbank.information_assets_detailed OWNER TO neondb_owner;

-- --
-- -- TOC entry 288 (class 1259 OID 122883)
-- -- Name: information_assets_detailed_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
-- --

-- CREATE SEQUENCE org_mashreqbank.information_assets_detailed_id_seq
--     AS integer
--     START WITH 1
--     INCREMENT BY 1
--     NO MINVALUE
--     NO MAXVALUE
--     CACHE 1;


-- ALTER SEQUENCE org_mashreqbank.information_assets_detailed_id_seq OWNER TO neondb_owner;

-- --
-- -- TOC entry 6984 (class 0 OID 0)
-- -- Dependencies: 288
-- -- Name: information_assets_detailed_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
-- --

-- ALTER SEQUENCE org_mashreqbank.information_assets_detailed_id_seq OWNED BY org_mashreqbank.information_assets_detailed.id;


-- --
-- -- TOC entry 228 (class 1259 OID 24576)
-- -- Name: information_assets_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
-- --

-- CREATE SEQUENCE org_mashreqbank.information_assets_id_seq
--     AS integer
--     START WITH 1
--     INCREMENT BY 1
--     NO MINVALUE
--     NO MAXVALUE
--     CACHE 1;


-- ALTER SEQUENCE org_mashreqbank.information_assets_id_seq OWNER TO neondb_owner;

-- --
-- -- TOC entry 6985 (class 0 OID 0)
-- -- Dependencies: 228
-- -- Name: information_assets_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
-- --

-- ALTER SEQUENCE org_mashreqbank.information_assets_id_seq OWNED BY org_mashreqbank.information_assets.id;


-- --
-- -- TOC entry 505 (class 1259 OID 761857)
-- -- Name: iso27001_control_effectiveness; Type: TABLE; Schema: public; Owner: neondb_owner
-- --

-- CREATE TABLE org_mashreqbank.iso27001_control_effectiveness (
--     id integer NOT NULL,
--     risk_id integer,
--     control_id character varying(20) NOT NULL,
--     effectiveness integer DEFAULT 0,
--     implementation_status character varying(50) DEFAULT 'Not Started'::character varying,
--     created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
--     updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
--     CONSTRAINT iso27001_control_effectiveness_effectiveness_check CHECK (((effectiveness >= 0) AND (effectiveness <= 5)))
-- );


-- ALTER TABLE org_mashreqbank.iso27001_control_effectiveness OWNER TO neondb_owner;

-- --
-- -- TOC entry 504 (class 1259 OID 761856)
-- -- Name: iso27001_control_effectiveness_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
-- --

-- CREATE SEQUENCE org_mashreqbank.iso27001_control_effectiveness_id_seq
--     AS integer
--     START WITH 1
--     INCREMENT BY 1
--     NO MINVALUE
--     NO MAXVALUE
--     CACHE 1;


-- ALTER SEQUENCE org_mashreqbank.iso27001_control_effectiveness_id_seq OWNER TO neondb_owner;

-- --
-- -- TOC entry 6986 (class 0 OID 0)
-- -- Dependencies: 504
-- -- Name: iso27001_control_effectiveness_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
-- --

-- ALTER SEQUENCE org_mashreqbank.iso27001_control_effectiveness_id_seq OWNED BY org_mashreqbank.iso27001_control_effectiveness.id;


-- --
-- -- TOC entry 416 (class 1259 OID 483376)
-- -- Name: iso27001_controls; Type: TABLE; Schema: public; Owner: neondb_owner
-- --

-- CREATE TABLE org_mashreqbank.iso27001_controls (
--     id integer NOT NULL,
--     control_id character varying(20) NOT NULL,
--     control_name character varying(255) NOT NULL,
--     control_description text,
--     category character varying(100) NOT NULL,
--     created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
-- );


-- ALTER TABLE org_mashreqbank.iso27001_controls OWNER TO neondb_owner;

-- --
-- -- TOC entry 415 (class 1259 OID 483375)
-- -- Name: iso27001_controls_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
-- --

-- CREATE SEQUENCE org_mashreqbank.iso27001_controls_id_seq
--     AS integer
--     START WITH 1
--     INCREMENT BY 1
--     NO MINVALUE
--     NO MAXVALUE
--     CACHE 1;


-- ALTER SEQUENCE org_mashreqbank.iso27001_controls_id_seq OWNER TO neondb_owner;

-- --
-- -- TOC entry 6987 (class 0 OID 0)
-- -- Dependencies: 415
-- -- Name: iso27001_controls_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
-- --

-- ALTER SEQUENCE org_mashreqbank.iso27001_controls_id_seq OWNED BY org_mashreqbank.iso27001_controls.id;


-- --
-- -- TOC entry 512 (class 1259 OID 786433)
-- -- Name: iso27001_evidence; Type: TABLE; Schema: public; Owner: neondb_owner
-- --

-- CREATE TABLE org_mashreqbank.iso27001_evidence (
--     id integer NOT NULL,
--     risk_id integer NOT NULL,
--     control_id character varying(50),
--     file_name character varying(255) NOT NULL,
--     file_type character varying(100) NOT NULL,
--     file_size integer NOT NULL,
--     file_data text NOT NULL,
--     description text,
--     uploaded_by character varying(255) NOT NULL,
--     created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
--     updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
-- );


-- ALTER TABLE org_mashreqbank.iso27001_evidence OWNER TO neondb_owner;

-- --
-- -- TOC entry 511 (class 1259 OID 786432)
-- -- Name: iso27001_evidence_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
-- --

-- CREATE SEQUENCE org_mashreqbank.iso27001_evidence_id_seq
--     AS integer
--     START WITH 1
--     INCREMENT BY 1
--     NO MINVALUE
--     NO MAXVALUE
--     CACHE 1;


-- ALTER SEQUENCE org_mashreqbank.iso27001_evidence_id_seq OWNER TO neondb_owner;

-- --
-- -- TOC entry 6988 (class 0 OID 0)
-- -- Dependencies: 511
-- -- Name: iso27001_evidence_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
-- --

-- ALTER SEQUENCE org_mashreqbank.iso27001_evidence_id_seq OWNED BY org_mashreqbank.iso27001_evidence.id;


-- --
-- -- TOC entry 377 (class 1259 OID 311297)
-- -- Name: iso27001_risk_assessments; Type: TABLE; Schema: public; Owner: neondb_owner
-- --

-- CREATE TABLE org_mashreqbank.iso27001_risk_assessments (
--     id integer NOT NULL,
--     risk_id character varying(50) NOT NULL,
--     risk_title character varying(255) NOT NULL,
--     risk_description text,
--     risk_category character varying(100),
--     risk_source character varying(100),
--     asset_id integer,
--     asset_name character varying(255),
--     asset_criticality character varying(20),
--     threat_sources text[],
--     vulnerabilities text[],
--     inherent_likelihood integer,
--     inherent_impact integer,
--     inherent_risk_score integer,
--     inherent_risk_level character varying(20),
--     existing_controls text[],
--     control_effectiveness integer DEFAULT 0,
--     risk_treatment character varying(20),
--     treatment_strategy text,
--     residual_likelihood integer,
--     residual_impact integer,
--     residual_risk_score integer,
--     residual_risk_level character varying(20),
--     risk_owner_name character varying(255),
--     risk_owner_email character varying(255),
--     risk_owner_department character varying(255),
--     risk_status character varying(20) DEFAULT 'Open'::character varying,
--     last_review_date date,
--     next_review_date date,
--     review_frequency character varying(50),
--     business_impact text,
--     regulatory_requirements text[],
--     notes text,
--     created_by character varying(255),
--     updated_by character varying(255),
--     created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
--     updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
--     audit_log character varying(20),
--     CONSTRAINT iso27001_risk_assessments_asset_criticality_check CHECK (((asset_criticality)::text = ANY ((ARRAY['Critical'::character varying, 'High'::character varying, 'Medium'::character varying, 'Low'::character varying])::text[]))),
--     CONSTRAINT iso27001_risk_assessments_control_effectiveness_check CHECK (((control_effectiveness >= 0) AND (control_effectiveness <= 100))),
--     CONSTRAINT iso27001_risk_assessments_inherent_impact_check CHECK (((inherent_impact >= 1) AND (inherent_impact <= 5))),
--     CONSTRAINT iso27001_risk_assessments_inherent_likelihood_check CHECK (((inherent_likelihood >= 1) AND (inherent_likelihood <= 5))),
--     CONSTRAINT iso27001_risk_assessments_inherent_risk_level_check CHECK (((inherent_risk_level)::text = ANY ((ARRAY['Low'::character varying, 'Medium'::character varying, 'High'::character varying, 'Critical'::character varying])::text[]))),
--     CONSTRAINT iso27001_risk_assessments_residual_impact_check CHECK (((residual_impact >= 1) AND (residual_impact <= 5))),
--     CONSTRAINT iso27001_risk_assessments_review_frequency_check CHECK (((review_frequency)::text = ANY ((ARRAY['monthly'::character varying, 'quarterly'::character varying, 'semi-annually'::character varying, 'annually'::character varying])::text[]))),
--     CONSTRAINT iso27001_risk_assessments_risk_treatment_check CHECK (((risk_treatment)::text = ANY ((ARRAY['accept'::character varying, 'mitigate'::character varying, 'transfer'::character varying, 'avoid'::character varying])::text[])))
-- );


-- ALTER TABLE org_mashreqbank.iso27001_risk_assessments OWNER TO neondb_owner;

-- --
-- -- TOC entry 376 (class 1259 OID 311296)
-- -- Name: iso27001_risk_assessments_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
-- --

-- CREATE SEQUENCE org_mashreqbank.iso27001_risk_assessments_id_seq
--     AS integer
--     START WITH 1
--     INCREMENT BY 1
--     NO MINVALUE
--     NO MAXVALUE
--     CACHE 1;


-- ALTER SEQUENCE org_mashreqbank.iso27001_risk_assessments_id_seq OWNER TO neondb_owner;

-- --
-- -- TOC entry 6989 (class 0 OID 0)
-- -- Dependencies: 376
-- -- Name: iso27001_risk_assessments_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
-- --

-- ALTER SEQUENCE org_mashreqbank.iso27001_risk_assessments_id_seq OWNED BY org_mashreqbank.iso27001_risk_assessments.id;


-- --
-- -- TOC entry 418 (class 1259 OID 483388)
-- -- Name: iso27001_risk_controls; Type: TABLE; Schema: public; Owner: neondb_owner
-- --

-- CREATE TABLE org_mashreqbank.iso27001_risk_controls (
--     id integer NOT NULL,
--     risk_id integer,
--     control_id integer,
--     effectiveness character varying(20) DEFAULT 'Medium'::character varying,
--     implementation_status character varying(20) DEFAULT 'Planned'::character varying,
--     created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
--     CONSTRAINT iso27001_risk_controls_effectiveness_check CHECK (((effectiveness)::text = ANY ((ARRAY['Low'::character varying, 'Medium'::character varying, 'High'::character varying])::text[]))),
--     CONSTRAINT iso27001_risk_controls_implementation_status_check CHECK (((implementation_status)::text = ANY ((ARRAY['Planned'::character varying, 'In Progress'::character varying, 'Implemented'::character varying, 'Not Applicable'::character varying])::text[])))
-- );


-- ALTER TABLE org_mashreqbank.iso27001_risk_controls OWNER TO neondb_owner;

-- --
-- -- TOC entry 417 (class 1259 OID 483387)
-- -- Name: iso27001_risk_controls_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
-- --

-- CREATE SEQUENCE org_mashreqbank.iso27001_risk_controls_id_seq
--     AS integer
--     START WITH 1
--     INCREMENT BY 1
--     NO MINVALUE
--     NO MAXVALUE
--     CACHE 1;


-- ALTER SEQUENCE org_mashreqbank.iso27001_risk_controls_id_seq OWNER TO neondb_owner;

-- --
-- -- TOC entry 6990 (class 0 OID 0)
-- -- Dependencies: 417
-- -- Name: iso27001_risk_controls_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
-- --

-- ALTER SEQUENCE org_mashreqbank.iso27001_risk_controls_id_seq OWNED BY org_mashreqbank.iso27001_risk_controls.id;


-- --
-- -- TOC entry 303 (class 1259 OID 123013)
-- -- Name: iso27001_risk_metrics; Type: TABLE; Schema: public; Owner: neondb_owner
-- --

-- CREATE TABLE org_mashreqbank.iso27001_risk_metrics (
--     id integer NOT NULL,
--     workflow_id integer,
--     metric_date date DEFAULT CURRENT_DATE,
--     total_assets integer DEFAULT 0,
--     critical_assets integer DEFAULT 0,
--     high_value_assets integer DEFAULT 0,
--     total_risk_scenarios integer DEFAULT 0,
--     critical_risks integer DEFAULT 0,
--     high_risks integer DEFAULT 0,
--     medium_risks integer DEFAULT 0,
--     low_risks integer DEFAULT 0,
--     total_treatments integer DEFAULT 0,
--     implemented_treatments integer DEFAULT 0,
--     pending_treatments integer DEFAULT 0,
--     overdue_treatments integer DEFAULT 0,
--     iso_controls_addressed integer DEFAULT 0,
--     compliance_percentage numeric(5,2) DEFAULT 0,
--     created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
-- );


-- ALTER TABLE org_mashreqbank.iso27001_risk_metrics OWNER TO neondb_owner;

-- --
-- -- TOC entry 302 (class 1259 OID 123012)
-- -- Name: iso27001_risk_metrics_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
-- --

-- CREATE SEQUENCE org_mashreqbank.iso27001_risk_metrics_id_seq
--     AS integer
--     START WITH 1
--     INCREMENT BY 1
--     NO MINVALUE
--     NO MAXVALUE
--     CACHE 1;


-- ALTER SEQUENCE org_mashreqbank.iso27001_risk_metrics_id_seq OWNER TO neondb_owner;

-- --
-- -- TOC entry 6991 (class 0 OID 0)
-- -- Dependencies: 302
-- -- Name: iso27001_risk_metrics_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
-- --

-- ALTER SEQUENCE org_mashreqbank.iso27001_risk_metrics_id_seq OWNED BY org_mashreqbank.iso27001_risk_metrics.id;


-- --
-- -- TOC entry 301 (class 1259 OID 122997)
-- -- Name: iso27001_risk_reviews; Type: TABLE; Schema: public; Owner: neondb_owner
-- --

-- CREATE TABLE org_mashreqbank.iso27001_risk_reviews (
--     id integer NOT NULL,
--     workflow_id integer,
--     review_type character varying(50),
--     review_date timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
--     reviewer_name character varying(255),
--     reviewer_role character varying(100),
--     assets_reviewed integer,
--     scenarios_reviewed integer,
--     treatments_reviewed integer,
--     review_findings text,
--     recommendations text,
--     issues_identified text,
--     review_status character varying(50),
--     approval_conditions text,
--     next_review_date date,
--     created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
-- );


-- ALTER TABLE org_mashreqbank.iso27001_risk_reviews OWNER TO neondb_owner;

-- --
-- -- TOC entry 300 (class 1259 OID 122996)
-- -- Name: iso27001_risk_reviews_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
-- --

-- CREATE SEQUENCE org_mashreqbank.iso27001_risk_reviews_id_seq
--     AS integer
--     START WITH 1
--     INCREMENT BY 1
--     NO MINVALUE
--     NO MAXVALUE
--     CACHE 1;


-- ALTER SEQUENCE org_mashreqbank.iso27001_risk_reviews_id_seq OWNER TO neondb_owner;

-- --
-- -- TOC entry 6992 (class 0 OID 0)
-- -- Dependencies: 300
-- -- Name: iso27001_risk_reviews_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
-- --

-- ALTER SEQUENCE org_mashreqbank.iso27001_risk_reviews_id_seq OWNED BY org_mashreqbank.iso27001_risk_reviews.id;


-- --
-- -- TOC entry 297 (class 1259 OID 122941)
-- -- Name: iso27001_risk_scenarios; Type: TABLE; Schema: public; Owner: neondb_owner
-- --

-- CREATE TABLE org_mashreqbank.iso27001_risk_scenarios (
--     id integer NOT NULL,
--     workflow_id integer,
--     scenario_id character varying(50) NOT NULL,
--     asset_id integer,
--     threat_id integer,
--     vulnerability_id integer,
--     scenario_description text,
--     attack_vector text,
--     prerequisites text,
--     threat_frequency character varying(50),
--     vulnerability_exploitability character varying(50),
--     existing_controls_effectiveness character varying(50),
--     likelihood_score integer,
--     likelihood_justification text,
--     confidentiality_impact character varying(50),
--     integrity_impact character varying(50),
--     availability_impact character varying(50),
--     financial_impact character varying(50),
--     operational_impact character varying(50),
--     legal_regulatory_impact character varying(50),
--     reputation_impact character varying(50),
--     impact_score integer,
--     impact_justification text,
--     inherent_risk_score integer,
--     inherent_risk_level character varying(50),
--     risk_treatment_option character varying(50),
--     treatment_justification text,
--     residual_risk_score integer,
--     residual_risk_level character varying(50),
--     assessment_status character varying(50) DEFAULT 'Draft'::character varying,
--     assessed_by character varying(255),
--     reviewed_by character varying(255),
--     approved_by character varying(255),
--     assessment_date timestamp without time zone,
--     review_date timestamp without time zone,
--     approval_date timestamp without time zone,
--     created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
--     updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
--     CONSTRAINT iso27001_risk_scenarios_impact_score_check CHECK (((impact_score >= 1) AND (impact_score <= 5))),
--     CONSTRAINT iso27001_risk_scenarios_likelihood_score_check CHECK (((likelihood_score >= 1) AND (likelihood_score <= 5)))
-- );


-- ALTER TABLE org_mashreqbank.iso27001_risk_scenarios OWNER TO neondb_owner;

-- --
-- -- TOC entry 296 (class 1259 OID 122940)
-- -- Name: iso27001_risk_scenarios_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
-- --

-- CREATE SEQUENCE org_mashreqbank.iso27001_risk_scenarios_id_seq
--     AS integer
--     START WITH 1
--     INCREMENT BY 1
--     NO MINVALUE
--     NO MAXVALUE
--     CACHE 1;


-- ALTER SEQUENCE org_mashreqbank.iso27001_risk_scenarios_id_seq OWNER TO neondb_owner;

-- --
-- -- TOC entry 6993 (class 0 OID 0)
-- -- Dependencies: 296
-- -- Name: iso27001_risk_scenarios_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
-- --

-- ALTER SEQUENCE org_mashreqbank.iso27001_risk_scenarios_id_seq OWNED BY org_mashreqbank.iso27001_risk_scenarios.id;


-- --
-- -- TOC entry 299 (class 1259 OID 122975)
-- -- Name: iso27001_risk_treatment_plans; Type: TABLE; Schema: public; Owner: neondb_owner
-- --

-- CREATE TABLE org_mashreqbank.iso27001_risk_treatment_plans (
--     id integer NOT NULL,
--     risk_scenario_id integer,
--     workflow_id integer,
--     treatment_id character varying(50) NOT NULL,
--     treatment_name character varying(255) NOT NULL,
--     treatment_description text,
--     treatment_type character varying(50),
--     iso_control_reference character varying(50),
--     control_category character varying(100),
--     control_description text,
--     implementation_approach text,
--     responsible_party character varying(255),
--     target_completion_date date,
--     estimated_cost numeric(12,2),
--     priority character varying(50),
--     success_criteria text,
--     measurement_method text,
--     expected_risk_reduction integer,
--     implementation_status character varying(50) DEFAULT 'Planned'::character varying,
--     actual_completion_date date,
--     actual_cost numeric(12,2),
--     effectiveness_rating character varying(50),
--     created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
--     updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
-- );


-- ALTER TABLE org_mashreqbank.iso27001_risk_treatment_plans OWNER TO neondb_owner;

-- --
-- -- TOC entry 298 (class 1259 OID 122974)
-- -- Name: iso27001_risk_treatment_plans_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
-- --

-- CREATE SEQUENCE org_mashreqbank.iso27001_risk_treatment_plans_id_seq
--     AS integer
--     START WITH 1
--     INCREMENT BY 1
--     NO MINVALUE
--     NO MAXVALUE
--     CACHE 1;


-- ALTER SEQUENCE org_mashreqbank.iso27001_risk_treatment_plans_id_seq OWNER TO neondb_owner;

-- --
-- -- TOC entry 6994 (class 0 OID 0)
-- -- Dependencies: 298
-- -- Name: iso27001_risk_treatment_plans_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
-- --

-- ALTER SEQUENCE org_mashreqbank.iso27001_risk_treatment_plans_id_seq OWNED BY org_mashreqbank.iso27001_risk_treatment_plans.id;


-- --
-- -- TOC entry 414 (class 1259 OID 483329)
-- -- Name: iso27001_risks; Type: TABLE; Schema: public; Owner: neondb_owner
-- --

-- CREATE TABLE org_mashreqbank.iso27001_risks (
--     id integer NOT NULL,
--     risk_id character varying(20) NOT NULL,
--     title character varying(255) NOT NULL,
--     description text NOT NULL,
--     category character varying(400) NOT NULL,
--     likelihood integer NOT NULL,
--     impact integer NOT NULL,
--     risk_score integer GENERATED ALWAYS AS ((likelihood * impact)) STORED,
--     risk_level character varying(20) GENERATED ALWAYS AS (
-- CASE
--     WHEN ((likelihood * impact) >= 15) THEN 'Critical'::text
--     WHEN ((likelihood * impact) >= 10) THEN 'High'::text
--     WHEN ((likelihood * impact) >= 5) THEN 'Medium'::text
--     ELSE 'Low'::text
-- END) STORED,
--     status character varying(20) DEFAULT 'Open'::character varying NOT NULL,
--     owner character varying(300),
--     treatment_plan text,
--     residual_risk integer,
--     last_reviewed date DEFAULT CURRENT_DATE,
--     next_review date,
--     controls text[],
--     assets text[],
--     created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
--     updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
--     residual_likelihood integer NOT NULL,
--     residual_impact integer NOT NULL,
--     control_assessment character varying(600),
--     risk_treatment character varying(600),
--     CONSTRAINT iso27001_risks_impact_check CHECK (((impact >= 1) AND (impact <= 5))),
--     CONSTRAINT iso27001_risks_likelihood_check CHECK (((likelihood >= 1) AND (likelihood <= 5))),
--     CONSTRAINT iso27001_risks_status_check CHECK (((status)::text = ANY ((ARRAY['Open'::character varying, 'In Progress'::character varying, 'Mitigated'::character varying, 'Accepted'::character varying])::text[])))
-- );


-- ALTER TABLE org_mashreqbank.iso27001_risks OWNER TO neondb_owner;

-- --
-- -- TOC entry 413 (class 1259 OID 483328)
-- -- Name: iso27001_risks_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
-- --

-- CREATE SEQUENCE org_mashreqbank.iso27001_risks_id_seq
--     AS integer
--     START WITH 1
--     INCREMENT BY 1
--     NO MINVALUE
--     NO MAXVALUE
--     CACHE 1;


-- ALTER SEQUENCE org_mashreqbank.iso27001_risks_id_seq OWNER TO neondb_owner;

-- --
-- -- TOC entry 6995 (class 0 OID 0)
-- -- Dependencies: 413
-- -- Name: iso27001_risks_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
-- --

-- ALTER SEQUENCE org_mashreqbank.iso27001_risks_id_seq OWNED BY org_mashreqbank.iso27001_risks.id;


-- --
-- -- TOC entry 375 (class 1259 OID 303195)
-- -- Name: iso27001_sub_controls; Type: TABLE; Schema: public; Owner: neondb_owner
-- --

-- CREATE TABLE org_mashreqbank.iso27001_sub_controls (
--     id integer NOT NULL,
--     control_id integer,
--     sub_control_id character varying(20) NOT NULL,
--     sub_control_title character varying(500) NOT NULL,
--     sub_control_description text,
--     implementation_guidance text,
--     is_active boolean DEFAULT true,
--     created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
--     updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
-- );


-- ALTER TABLE org_mashreqbank.iso27001_sub_controls OWNER TO neondb_owner;

-- --
-- -- TOC entry 374 (class 1259 OID 303194)
-- -- Name: iso27001_sub_controls_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
-- --

-- CREATE SEQUENCE org_mashreqbank.iso27001_sub_controls_id_seq
--     AS integer
--     START WITH 1
--     INCREMENT BY 1
--     NO MINVALUE
--     NO MAXVALUE
--     CACHE 1;


-- ALTER SEQUENCE org_mashreqbank.iso27001_sub_controls_id_seq OWNER TO neondb_owner;

-- --
-- -- TOC entry 6996 (class 0 OID 0)
-- -- Dependencies: 374
-- -- Name: iso27001_sub_controls_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
-- --

-- ALTER SEQUENCE org_mashreqbank.iso27001_sub_controls_id_seq OWNED BY org_mashreqbank.iso27001_sub_controls.id;


-- --
-- -- TOC entry 291 (class 1259 OID 122900)
-- -- Name: iso27001_threat_categories; Type: TABLE; Schema: public; Owner: neondb_owner
-- --

-- CREATE TABLE org_mashreqbank.iso27001_threat_categories (
--     id integer NOT NULL,
--     category_code character varying(20) NOT NULL,
--     category_name character varying(255) NOT NULL,
--     category_description text,
--     annex_reference character varying(50),
--     is_active boolean DEFAULT true
-- );


-- ALTER TABLE org_mashreqbank.iso27001_threat_categories OWNER TO neondb_owner;

-- --
-- -- TOC entry 290 (class 1259 OID 122899)
-- -- Name: iso27001_threat_categories_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
-- --

-- CREATE SEQUENCE org_mashreqbank.iso27001_threat_categories_id_seq
--     AS integer
--     START WITH 1
--     INCREMENT BY 1
--     NO MINVALUE
--     NO MAXVALUE
--     CACHE 1;


-- ALTER SEQUENCE org_mashreqbank.iso27001_threat_categories_id_seq OWNER TO neondb_owner;

-- --
-- -- TOC entry 6997 (class 0 OID 0)
-- -- Dependencies: 290
-- -- Name: iso27001_threat_categories_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
-- --

-- ALTER SEQUENCE org_mashreqbank.iso27001_threat_categories_id_seq OWNED BY org_mashreqbank.iso27001_threat_categories.id;


-- --
-- -- TOC entry 293 (class 1259 OID 122912)
-- -- Name: iso27001_threats; Type: TABLE; Schema: public; Owner: neondb_owner
-- --

-- CREATE TABLE org_mashreqbank.iso27001_threats (
--     id integer NOT NULL,
--     threat_id character varying(50) NOT NULL,
--     threat_name character varying(255) NOT NULL,
--     threat_description text,
--     category_id integer,
--     threat_source character varying(100),
--     threat_type character varying(100),
--     annex_control_reference character varying(50),
--     is_active boolean DEFAULT true
-- );


-- ALTER TABLE org_mashreqbank.iso27001_threats OWNER TO neondb_owner;

-- --
-- -- TOC entry 292 (class 1259 OID 122911)
-- -- Name: iso27001_threats_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
-- --

-- CREATE SEQUENCE org_mashreqbank.iso27001_threats_id_seq
--     AS integer
--     START WITH 1
--     INCREMENT BY 1
--     NO MINVALUE
--     NO MAXVALUE
--     CACHE 1;


-- ALTER SEQUENCE org_mashreqbank.iso27001_threats_id_seq OWNER TO neondb_owner;

-- --
-- -- TOC entry 6998 (class 0 OID 0)
-- -- Dependencies: 292
-- -- Name: iso27001_threats_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
-- --

-- ALTER SEQUENCE org_mashreqbank.iso27001_threats_id_seq OWNED BY org_mashreqbank.iso27001_threats.id;


-- --
-- -- TOC entry 497 (class 1259 OID 688166)
-- -- Name: iso27001_treatment_controls; Type: TABLE; Schema: public; Owner: neondb_owner
-- --

-- CREATE TABLE org_mashreqbank.iso27001_treatment_controls (
--     id integer NOT NULL,
--     control_id character varying(50) NOT NULL,
--     treatment_plan_id integer NOT NULL,
--     treatment_plan_id_display character varying(50) NOT NULL,
--     treatment_type character varying(20) NOT NULL,
--     iso_risk_id character varying(50) NOT NULL,
--     risk_title character varying(500) NOT NULL,
--     control_title character varying(200) NOT NULL,
--     control_description text,
--     control_type character varying(20) DEFAULT 'preventive'::character varying,
--     control_category character varying(100),
--     implementation_status character varying(20) DEFAULT 'not_started'::character varying,
--     effectiveness_rating integer DEFAULT 0,
--     implementation_cost numeric(10,2) DEFAULT 0,
--     assigned_owner character varying(100),
--     technical_contact character varying(100),
--     implementation_date date,
--     testing_date date,
--     next_review_date date,
--     due_date date,
--     completion_date date,
--     automation_level character varying(20) DEFAULT 'manual'::character varying,
--     compliance_frameworks text[] DEFAULT ARRAY['ISO 27001'::text],
--     evidence_location text,
--     testing_procedure text,
--     remediation_notes text,
--     aging_days integer DEFAULT 0,
--     aging_status character varying(20) DEFAULT 'on_track'::character varying,
--     created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
--     updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
--     CONSTRAINT iso27001_treatment_controls_aging_status_check CHECK (((aging_status)::text = ANY ((ARRAY['on_track'::character varying, 'due_soon'::character varying, 'overdue'::character varying, 'completed'::character varying])::text[]))),
--     CONSTRAINT iso27001_treatment_controls_automation_level_check CHECK (((automation_level)::text = ANY ((ARRAY['manual'::character varying, 'semi_automated'::character varying, 'fully_automated'::character varying])::text[]))),
--     CONSTRAINT iso27001_treatment_controls_control_type_check CHECK (((control_type)::text = ANY ((ARRAY['preventive'::character varying, 'detective'::character varying, 'corrective'::character varying])::text[]))),
--     CONSTRAINT iso27001_treatment_controls_effectiveness_rating_check CHECK (((effectiveness_rating >= 0) AND (effectiveness_rating <= 5))),
--     CONSTRAINT iso27001_treatment_controls_implementation_status_check CHECK (((implementation_status)::text = ANY ((ARRAY['not_started'::character varying, 'in_progress'::character varying, 'completed'::character varying, 'on_hold'::character varying, 'cancelled'::character varying])::text[])))
-- );


-- ALTER TABLE org_mashreqbank.iso27001_treatment_controls OWNER TO neondb_owner;

-- --
-- -- TOC entry 496 (class 1259 OID 688165)
-- -- Name: iso27001_treatment_controls_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
-- --

-- CREATE SEQUENCE org_mashreqbank.iso27001_treatment_controls_id_seq
--     AS integer
--     START WITH 1
--     INCREMENT BY 1
--     NO MINVALUE
--     NO MAXVALUE
--     CACHE 1;


-- ALTER SEQUENCE org_mashreqbank.iso27001_treatment_controls_id_seq OWNER TO neondb_owner;

-- --
-- -- TOC entry 6999 (class 0 OID 0)
-- -- Dependencies: 496
-- -- Name: iso27001_treatment_controls_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
-- --

-- ALTER SEQUENCE org_mashreqbank.iso27001_treatment_controls_id_seq OWNED BY org_mashreqbank.iso27001_treatment_controls.id;


-- --
-- -- TOC entry 495 (class 1259 OID 688129)
-- -- Name: iso27001_treatment_plans; Type: TABLE; Schema: public; Owner: neondb_owner
-- --

-- CREATE TABLE org_mashreqbank.iso27001_treatment_plans (
--     id integer NOT NULL,
--     plan_id character varying(50) NOT NULL,
--     iso27001_risk_id integer NOT NULL,
--     iso_risk_id character varying(50) NOT NULL,
--     risk_title character varying(500) NOT NULL,
--     original_risk_level character varying(20) NOT NULL,
--     original_risk_score integer NOT NULL,
--     treatment_type character varying(20) NOT NULL,
--     treatment_strategy text,
--     business_justification text,
--     estimated_cost numeric(12,2) DEFAULT 0,
--     expected_risk_reduction integer DEFAULT 0,
--     plan_status character varying(20) DEFAULT 'draft'::character varying,
--     owner character varying(100) NOT NULL,
--     assigned_to character varying(100),
--     start_date date,
--     target_completion_date date,
--     actual_completion_date date,
--     residual_likelihood integer DEFAULT 1,
--     residual_impact integer DEFAULT 1,
--     residual_risk_score integer GENERATED ALWAYS AS ((residual_likelihood * residual_impact)) STORED,
--     residual_risk_level character varying(20) GENERATED ALWAYS AS (
-- CASE
--     WHEN ((residual_likelihood * residual_impact) >= 15) THEN 'Critical'::text
--     WHEN ((residual_likelihood * residual_impact) >= 10) THEN 'High'::text
--     WHEN ((residual_likelihood * residual_impact) >= 5) THEN 'Medium'::text
--     ELSE 'Low'::text
-- END) STORED,
--     total_controls integer DEFAULT 0,
--     completed_controls integer DEFAULT 0,
--     overdue_controls integer DEFAULT 0,
--     avg_effectiveness numeric(3,2) DEFAULT 0,
--     actual_cost numeric(12,2) DEFAULT 0,
--     plan_aging_days integer DEFAULT 0,
--     created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
--     updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
--     created_by character varying(100) DEFAULT 'System'::character varying,
--     CONSTRAINT iso27001_treatment_plans_expected_risk_reduction_check CHECK (((expected_risk_reduction >= 0) AND (expected_risk_reduction <= 100))),
--     CONSTRAINT iso27001_treatment_plans_plan_status_check CHECK (((plan_status)::text = ANY ((ARRAY['draft'::character varying, 'approved'::character varying, 'in_progress'::character varying, 'completed'::character varying, 'on_hold'::character varying])::text[]))),
--     CONSTRAINT iso27001_treatment_plans_residual_impact_check CHECK (((residual_impact >= 1) AND (residual_impact <= 5))),
--     CONSTRAINT iso27001_treatment_plans_residual_likelihood_check CHECK (((residual_likelihood >= 1) AND (residual_likelihood <= 5))),
--     CONSTRAINT iso27001_treatment_plans_treatment_type_check CHECK (((treatment_type)::text = ANY ((ARRAY['mitigate'::character varying, 'transfer'::character varying, 'accept'::character varying, 'avoid'::character varying])::text[])))
-- );


-- ALTER TABLE org_mashreqbank.iso27001_treatment_plans OWNER TO neondb_owner;

-- --
-- -- TOC entry 494 (class 1259 OID 688128)
-- -- Name: iso27001_treatment_plans_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
-- --

-- CREATE SEQUENCE org_mashreqbank.iso27001_treatment_plans_id_seq
--     AS integer
--     START WITH 1
--     INCREMENT BY 1
--     NO MINVALUE
--     NO MAXVALUE
--     CACHE 1;


-- ALTER SEQUENCE org_mashreqbank.iso27001_treatment_plans_id_seq OWNER TO neondb_owner;

-- --
-- -- TOC entry 7000 (class 0 OID 0)
-- -- Dependencies: 494
-- -- Name: iso27001_treatment_plans_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
-- --

-- ALTER SEQUENCE org_mashreqbank.iso27001_treatment_plans_id_seq OWNED BY org_mashreqbank.iso27001_treatment_plans.id;


-- --
-- -- TOC entry 499 (class 1259 OID 688197)
-- -- Name: iso27001_treatment_tracking; Type: TABLE; Schema: public; Owner: neondb_owner
-- --

-- CREATE TABLE org_mashreqbank.iso27001_treatment_tracking (
--     id integer NOT NULL,
--     treatment_plan_id integer NOT NULL,
--     control_id integer,
--     treatment_plan_id_display character varying(50) NOT NULL,
--     control_title character varying(200),
--     iso_risk_id character varying(50) NOT NULL,
--     risk_title character varying(500) NOT NULL,
--     tracking_type character varying(20) NOT NULL,
--     old_status character varying(50),
--     new_status character varying(50),
--     tracking_date date DEFAULT CURRENT_DATE,
--     description text,
--     impact_assessment text,
--     action_required text,
--     responsible_party character varying(100),
--     due_date date,
--     resolution_date date,
--     aging_days integer DEFAULT 0,
--     created_by character varying(100) DEFAULT 'System'::character varying,
--     created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
--     CONSTRAINT iso27001_treatment_tracking_tracking_type_check CHECK (((tracking_type)::text = ANY ((ARRAY['status_change'::character varying, 'assignment_change'::character varying, 'progress_update'::character varying, 'cost_update'::character varying, 'review'::character varying])::text[])))
-- );


-- ALTER TABLE org_mashreqbank.iso27001_treatment_tracking OWNER TO neondb_owner;

-- --
-- -- TOC entry 498 (class 1259 OID 688196)
-- -- Name: iso27001_treatment_tracking_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
-- --

-- CREATE SEQUENCE org_mashreqbank.iso27001_treatment_tracking_id_seq
--     AS integer
--     START WITH 1
--     INCREMENT BY 1
--     NO MINVALUE
--     NO MAXVALUE
--     CACHE 1;


-- ALTER SEQUENCE org_mashreqbank.iso27001_treatment_tracking_id_seq OWNER TO neondb_owner;

-- --
-- -- TOC entry 7001 (class 0 OID 0)
-- -- Dependencies: 498
-- -- Name: iso27001_treatment_tracking_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
-- --

-- ALTER SEQUENCE org_mashreqbank.iso27001_treatment_tracking_id_seq OWNED BY org_mashreqbank.iso27001_treatment_tracking.id;


-- --
-- -- TOC entry 514 (class 1259 OID 786449)
-- -- Name: iso27001_validation_rules; Type: TABLE; Schema: public; Owner: neondb_owner
-- --

-- CREATE TABLE org_mashreqbank.iso27001_validation_rules (
--     id integer NOT NULL,
--     rule_name character varying(100) NOT NULL,
--     rule_description text,
--     is_active boolean DEFAULT true,
--     require_evidence_for_mitigated boolean DEFAULT true,
--     require_evidence_for_accepted boolean DEFAULT true,
--     created_by character varying(255),
--     created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
--     updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
--     updated_by character varying(255)
-- );


-- ALTER TABLE org_mashreqbank.iso27001_validation_rules OWNER TO neondb_owner;

-- --
-- -- TOC entry 513 (class 1259 OID 786448)
-- -- Name: iso27001_validation_rules_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
-- --

-- CREATE SEQUENCE org_mashreqbank.iso27001_validation_rules_id_seq
--     AS integer
--     START WITH 1
--     INCREMENT BY 1
--     NO MINVALUE
--     NO MAXVALUE
--     CACHE 1;


-- ALTER SEQUENCE org_mashreqbank.iso27001_validation_rules_id_seq OWNER TO neondb_owner;

-- --
-- -- TOC entry 7002 (class 0 OID 0)
-- -- Dependencies: 513
-- -- Name: iso27001_validation_rules_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
-- --

-- ALTER SEQUENCE org_mashreqbank.iso27001_validation_rules_id_seq OWNED BY org_mashreqbank.iso27001_validation_rules.id;


-- --
-- -- TOC entry 295 (class 1259 OID 122929)
-- -- Name: iso27001_vulnerabilities; Type: TABLE; Schema: public; Owner: neondb_owner
-- --

-- CREATE TABLE org_mashreqbank.iso27001_vulnerabilities (
--     id integer NOT NULL,
--     vulnerability_id character varying(50) NOT NULL,
--     vulnerability_name character varying(255) NOT NULL,
--     vulnerability_description text,
--     vulnerability_type character varying(100),
--     severity_level character varying(50),
--     cve_reference character varying(50),
--     is_active boolean DEFAULT true
-- );


-- ALTER TABLE org_mashreqbank.iso27001_vulnerabilities OWNER TO neondb_owner;

-- --
-- -- TOC entry 294 (class 1259 OID 122928)
-- -- Name: iso27001_vulnerabilities_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
-- --

-- CREATE SEQUENCE org_mashreqbank.iso27001_vulnerabilities_id_seq
--     AS integer
--     START WITH 1
--     INCREMENT BY 1
--     NO MINVALUE
--     NO MAXVALUE
--     CACHE 1;


-- ALTER SEQUENCE org_mashreqbank.iso27001_vulnerabilities_id_seq OWNER TO neondb_owner;

-- --
-- -- TOC entry 7003 (class 0 OID 0)
-- -- Dependencies: 294
-- -- Name: iso27001_vulnerabilities_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
-- --

-- ALTER SEQUENCE org_mashreqbank.iso27001_vulnerabilities_id_seq OWNED BY org_mashreqbank.iso27001_vulnerabilities.id;


-- --
-- -- TOC entry 313 (class 1259 OID 147457)
-- -- Name: iso27002_control_categories; Type: TABLE; Schema: public; Owner: neondb_owner
-- --

-- CREATE TABLE org_mashreqbank.iso27002_control_categories (
--     id integer NOT NULL,
--     category_code character varying(10) NOT NULL,
--     category_name character varying(255) NOT NULL,
--     category_description text,
--     is_active boolean DEFAULT true,
--     created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
--     control_type character varying(50) DEFAULT 'Technical'::character varying
-- );


-- ALTER TABLE org_mashreqbank.iso27002_control_categories OWNER TO neondb_owner;

-- --
-- -- TOC entry 7004 (class 0 OID 0)
-- -- Dependencies: 313
-- -- Name: TABLE iso27002_control_categories; Type: COMMENT; Schema: public; Owner: neondb_owner
-- --

-- COMMENT ON TABLE org_mashreqbank.iso27002_control_categories IS 'ISO 27002 control categories (Annex A domains)';


-- --
-- -- TOC entry 312 (class 1259 OID 147456)
-- -- Name: iso27002_control_categories_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
-- --

-- CREATE SEQUENCE org_mashreqbank.iso27002_control_categories_id_seq
--     AS integer
--     START WITH 1
--     INCREMENT BY 1
--     NO MINVALUE
--     NO MAXVALUE
--     CACHE 1;


-- ALTER SEQUENCE org_mashreqbank.iso27002_control_categories_id_seq OWNER TO neondb_owner;

-- --
-- -- TOC entry 7005 (class 0 OID 0)
-- -- Dependencies: 312
-- -- Name: iso27002_control_categories_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
-- --

-- ALTER SEQUENCE org_mashreqbank.iso27002_control_categories_id_seq OWNED BY org_mashreqbank.iso27002_control_categories.id;


-- --
-- -- TOC entry 315 (class 1259 OID 147470)
-- -- Name: iso27002_controls; Type: TABLE; Schema: public; Owner: neondb_owner
-- --

-- CREATE TABLE org_mashreqbank.iso27002_controls (
--     id integer NOT NULL,
--     control_code character varying(20) NOT NULL,
--     control_title character varying(500) NOT NULL,
--     control_description text,
--     control_guidance text,
--     category_id integer,
--     parent_control character varying(20),
--     control_type character varying(50) DEFAULT 'Organizational'::character varying,
--     implementation_level character varying(50) DEFAULT 'Standard'::character varying,
--     is_mandatory boolean DEFAULT false,
--     is_active boolean DEFAULT true,
--     created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
-- );


-- ALTER TABLE org_mashreqbank.iso27002_controls OWNER TO neondb_owner;

-- --
-- -- TOC entry 7006 (class 0 OID 0)
-- -- Dependencies: 315
-- -- Name: TABLE iso27002_controls; Type: COMMENT; Schema: public; Owner: neondb_owner
-- --

-- COMMENT ON TABLE org_mashreqbank.iso27002_controls IS 'Complete ISO 27002 controls inventory with sub-controls';


-- --
-- -- TOC entry 314 (class 1259 OID 147469)
-- -- Name: iso27002_controls_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
-- --

-- CREATE SEQUENCE org_mashreqbank.iso27002_controls_id_seq
--     AS integer
--     START WITH 1
--     INCREMENT BY 1
--     NO MINVALUE
--     NO MAXVALUE
--     CACHE 1;


-- ALTER SEQUENCE org_mashreqbank.iso27002_controls_id_seq OWNER TO neondb_owner;

-- --
-- -- TOC entry 7007 (class 0 OID 0)
-- -- Dependencies: 314
-- -- Name: iso27002_controls_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
-- --

-- ALTER SEQUENCE org_mashreqbank.iso27002_controls_id_seq OWNED BY org_mashreqbank.iso27002_controls.id;


-- --
-- -- TOC entry 606 (class 1259 OID 925715)
-- -- Name: login_attempts; Type: TABLE; Schema: public; Owner: neondb_owner
-- --

-- CREATE TABLE org_mashreqbank.login_attempts (
--     id integer NOT NULL,
--     email character varying(255) NOT NULL,
--     organization_id integer,
--     success boolean NOT NULL,
--     ip_address inet,
--     user_agent text,
--     attempted_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
-- );


-- ALTER TABLE org_mashreqbank.login_attempts OWNER TO neondb_owner;

-- --
-- -- TOC entry 605 (class 1259 OID 925714)
-- -- Name: login_attempts_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
-- --

-- CREATE SEQUENCE org_mashreqbank.login_attempts_id_seq
--     AS integer
--     START WITH 1
--     INCREMENT BY 1
--     NO MINVALUE
--     NO MAXVALUE
--     CACHE 1;


-- ALTER SEQUENCE org_mashreqbank.login_attempts_id_seq OWNER TO neondb_owner;

-- --
-- -- TOC entry 7008 (class 0 OID 0)
-- -- Dependencies: 605
-- -- Name: login_attempts_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
-- --

-- ALTER SEQUENCE org_mashreqbank.login_attempts_id_seq OWNED BY org_mashreqbank.login_attempts.id;


-- --
-- -- TOC entry 261 (class 1259 OID 90143)
-- -- Name: mitigation_actions; Type: TABLE; Schema: public; Owner: neondb_owner
-- --

-- CREATE TABLE org_mashreqbank.mitigation_actions (
--     id integer NOT NULL,
--     treatment_plan_id integer NOT NULL,
--     action_title character varying(255) NOT NULL,
--     action_description text NOT NULL,
--     assigned_to character varying(255) NOT NULL,
--     due_date date NOT NULL,
--     status character varying(50) DEFAULT 'Not Started'::character varying,
--     priority character varying(20) NOT NULL,
--     estimated_effort_hours numeric(8,2) DEFAULT 0,
--     actual_effort_hours numeric(8,2),
--     completion_date date,
--     notes text,
--     created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
--     updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
--     CONSTRAINT mitigation_actions_priority_check CHECK (((priority)::text = ANY ((ARRAY['Critical'::character varying, 'High'::character varying, 'Medium'::character varying, 'Low'::character varying])::text[]))),
--     CONSTRAINT mitigation_actions_status_check CHECK (((status)::text = ANY ((ARRAY['Not Started'::character varying, 'In Progress'::character varying, 'Completed'::character varying, 'On Hold'::character varying, 'Cancelled'::character varying])::text[])))
-- );


-- ALTER TABLE org_mashreqbank.mitigation_actions OWNER TO neondb_owner;

-- --
-- -- TOC entry 260 (class 1259 OID 90142)
-- -- Name: mitigation_actions_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
-- --

-- CREATE SEQUENCE org_mashreqbank.mitigation_actions_id_seq
--     AS integer
--     START WITH 1
--     INCREMENT BY 1
--     NO MINVALUE
--     NO MAXVALUE
--     CACHE 1;


-- ALTER SEQUENCE org_mashreqbank.mitigation_actions_id_seq OWNER TO neondb_owner;

-- --
-- -- TOC entry 7009 (class 0 OID 0)
-- -- Dependencies: 260
-- -- Name: mitigation_actions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
-- --

-- ALTER SEQUENCE org_mashreqbank.mitigation_actions_id_seq OWNED BY org_mashreqbank.mitigation_actions.id;


-- --
-- -- TOC entry 464 (class 1259 OID 565321)
-- -- Name: nesa_uae_assessment_results; Type: TABLE; Schema: public; Owner: neondb_owner
-- --

-- CREATE TABLE org_mashreqbank.nesa_uae_assessment_results (
--     id integer NOT NULL,
--     assessment_id integer,
--     requirement_id integer,
--     implementation_status character varying(50) NOT NULL,
--     maturity_level character varying(20),
--     evidence text,
--     gaps_identified text,
--     remediation_actions text,
--     target_completion_date date,
--     responsible_party character varying(100),
--     created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
--     updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
-- );


-- ALTER TABLE org_mashreqbank.nesa_uae_assessment_results OWNER TO neondb_owner;

-- --
-- -- TOC entry 463 (class 1259 OID 565320)
-- -- Name: nesa_uae_assessment_results_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
-- --

-- CREATE SEQUENCE org_mashreqbank.nesa_uae_assessment_results_id_seq
--     AS integer
--     START WITH 1
--     INCREMENT BY 1
--     NO MINVALUE
--     NO MAXVALUE
--     CACHE 1;


-- ALTER SEQUENCE org_mashreqbank.nesa_uae_assessment_results_id_seq OWNER TO neondb_owner;

-- --
-- -- TOC entry 7010 (class 0 OID 0)
-- -- Dependencies: 463
-- -- Name: nesa_uae_assessment_results_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
-- --

-- ALTER SEQUENCE org_mashreqbank.nesa_uae_assessment_results_id_seq OWNED BY org_mashreqbank.nesa_uae_assessment_results.id;


-- --
-- -- TOC entry 460 (class 1259 OID 565269)
-- -- Name: nesa_uae_assessments; Type: TABLE; Schema: public; Owner: neondb_owner
-- --

-- CREATE TABLE org_mashreqbank.nesa_uae_assessments (
--     id integer NOT NULL,
--     assessment_name character varying(200) NOT NULL,
--     organization_id integer,
--     assessment_type character varying(50) NOT NULL,
--     scope text,
--     critical_infrastructure_type character varying(100) NOT NULL,
--     assessment_methodology character varying(50) NOT NULL,
--     assessment_date date DEFAULT CURRENT_DATE,
--     assessor_name character varying(100),
--     assessor_organization character varying(200),
--     status character varying(50) DEFAULT 'Draft'::character varying,
--     overall_maturity_level character varying(20),
--     compliance_percentage integer DEFAULT 0,
--     risk_rating character varying(20),
--     findings_summary text,
--     recommendations text,
--     next_assessment_date date,
--     nesa_approval_status character varying(50) DEFAULT 'Not Submitted'::character varying,
--     created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
--     updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
-- );


-- ALTER TABLE org_mashreqbank.nesa_uae_assessments OWNER TO neondb_owner;

-- --
-- -- TOC entry 459 (class 1259 OID 565268)
-- -- Name: nesa_uae_assessments_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
-- --

-- CREATE SEQUENCE org_mashreqbank.nesa_uae_assessments_id_seq
--     AS integer
--     START WITH 1
--     INCREMENT BY 1
--     NO MINVALUE
--     NO MAXVALUE
--     CACHE 1;


-- ALTER SEQUENCE org_mashreqbank.nesa_uae_assessments_id_seq OWNER TO neondb_owner;

-- --
-- -- TOC entry 7011 (class 0 OID 0)
-- -- Dependencies: 459
-- -- Name: nesa_uae_assessments_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
-- --

-- ALTER SEQUENCE org_mashreqbank.nesa_uae_assessments_id_seq OWNED BY org_mashreqbank.nesa_uae_assessments.id;


-- --
-- -- TOC entry 480 (class 1259 OID 589861)
-- -- Name: nesa_uae_gap_analysis; Type: TABLE; Schema: public; Owner: neondb_owner
-- --

-- CREATE TABLE org_mashreqbank.nesa_uae_gap_analysis (
--     id integer NOT NULL,
--     control_id integer NOT NULL,
--     sub_control_id integer,
--     existing_control_name character varying(500) NOT NULL,
--     existing_control_description text,
--     control_owner character varying(255) NOT NULL,
--     political_procedure_control text,
--     initial_control_maturity character varying(50) NOT NULL,
--     gap_description text,
--     financial_action text,
--     target_control_maturity character varying(50) NOT NULL,
--     action_owner character varying(255),
--     reviewer character varying(255),
--     status character varying(50) DEFAULT 'Not Started'::character varying NOT NULL,
--     notes text,
--     created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
--     updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
--     CONSTRAINT nesa_uae_gap_analysis_initial_control_maturity_check CHECK (((initial_control_maturity)::text = ANY ((ARRAY['Not Implemented'::character varying, 'Ad Hoc'::character varying, 'Repeatable'::character varying, 'Defined'::character varying, 'Managed'::character varying, 'Optimized'::character varying])::text[]))),
--     CONSTRAINT nesa_uae_gap_analysis_status_check CHECK (((status)::text = ANY ((ARRAY['Not Started'::character varying, 'In Progress'::character varying, 'Under Review'::character varying, 'Completed'::character varying, 'On Hold'::character varying])::text[]))),
--     CONSTRAINT nesa_uae_gap_analysis_target_control_maturity_check CHECK (((target_control_maturity)::text = ANY ((ARRAY['Not Implemented'::character varying, 'Ad Hoc'::character varying, 'Repeatable'::character varying, 'Defined'::character varying, 'Managed'::character varying, 'Optimized'::character varying])::text[])))
-- );


-- ALTER TABLE org_mashreqbank.nesa_uae_gap_analysis OWNER TO neondb_owner;

-- --
-- -- TOC entry 7012 (class 0 OID 0)
-- -- Dependencies: 480
-- -- Name: TABLE nesa_uae_gap_analysis; Type: COMMENT; Schema: public; Owner: neondb_owner
-- --

-- COMMENT ON TABLE org_mashreqbank.nesa_uae_gap_analysis IS 'NESA UAE Gap Analysis entries mapping existing controls to NESA requirements';


-- --
-- -- TOC entry 7013 (class 0 OID 0)
-- -- Dependencies: 480
-- -- Name: COLUMN nesa_uae_gap_analysis.control_id; Type: COMMENT; Schema: public; Owner: neondb_owner
-- --

-- COMMENT ON COLUMN org_mashreqbank.nesa_uae_gap_analysis.control_id IS 'Reference to NESA UAE control';


-- --
-- -- TOC entry 7014 (class 0 OID 0)
-- -- Dependencies: 480
-- -- Name: COLUMN nesa_uae_gap_analysis.sub_control_id; Type: COMMENT; Schema: public; Owner: neondb_owner
-- --

-- COMMENT ON COLUMN org_mashreqbank.nesa_uae_gap_analysis.sub_control_id IS 'Reference to NESA UAE sub-control (optional)';


-- --
-- -- TOC entry 7015 (class 0 OID 0)
-- -- Dependencies: 480
-- -- Name: COLUMN nesa_uae_gap_analysis.existing_control_name; Type: COMMENT; Schema: public; Owner: neondb_owner
-- --

-- COMMENT ON COLUMN org_mashreqbank.nesa_uae_gap_analysis.existing_control_name IS 'Name of the existing organizational control';


-- --
-- -- TOC entry 7016 (class 0 OID 0)
-- -- Dependencies: 480
-- -- Name: COLUMN nesa_uae_gap_analysis.existing_control_description; Type: COMMENT; Schema: public; Owner: neondb_owner
-- --

-- COMMENT ON COLUMN org_mashreqbank.nesa_uae_gap_analysis.existing_control_description IS 'Description of the existing organizational control';


-- --
-- -- TOC entry 7017 (class 0 OID 0)
-- -- Dependencies: 480
-- -- Name: COLUMN nesa_uae_gap_analysis.control_owner; Type: COMMENT; Schema: public; Owner: neondb_owner
-- --

-- COMMENT ON COLUMN org_mashreqbank.nesa_uae_gap_analysis.control_owner IS 'Person responsible for the control';


-- --
-- -- TOC entry 7018 (class 0 OID 0)
-- -- Dependencies: 480
-- -- Name: COLUMN nesa_uae_gap_analysis.political_procedure_control; Type: COMMENT; Schema: public; Owner: neondb_owner
-- --

-- COMMENT ON COLUMN org_mashreqbank.nesa_uae_gap_analysis.political_procedure_control IS 'Political or procedural control details';


-- --
-- -- TOC entry 7019 (class 0 OID 0)
-- -- Dependencies: 480
-- -- Name: COLUMN nesa_uae_gap_analysis.initial_control_maturity; Type: COMMENT; Schema: public; Owner: neondb_owner
-- --

-- COMMENT ON COLUMN org_mashreqbank.nesa_uae_gap_analysis.initial_control_maturity IS 'Current maturity level of the control';


-- --
-- -- TOC entry 7020 (class 0 OID 0)
-- -- Dependencies: 480
-- -- Name: COLUMN nesa_uae_gap_analysis.gap_description; Type: COMMENT; Schema: public; Owner: neondb_owner
-- --

-- COMMENT ON COLUMN org_mashreqbank.nesa_uae_gap_analysis.gap_description IS 'Description of identified gaps';


-- --
-- -- TOC entry 7021 (class 0 OID 0)
-- -- Dependencies: 480
-- -- Name: COLUMN nesa_uae_gap_analysis.financial_action; Type: COMMENT; Schema: public; Owner: neondb_owner
-- --

-- COMMENT ON COLUMN org_mashreqbank.nesa_uae_gap_analysis.financial_action IS 'Financial actions required to address gaps';


-- --
-- -- TOC entry 7022 (class 0 OID 0)
-- -- Dependencies: 480
-- -- Name: COLUMN nesa_uae_gap_analysis.target_control_maturity; Type: COMMENT; Schema: public; Owner: neondb_owner
-- --

-- COMMENT ON COLUMN org_mashreqbank.nesa_uae_gap_analysis.target_control_maturity IS 'Desired maturity level of the control';


-- --
-- -- TOC entry 7023 (class 0 OID 0)
-- -- Dependencies: 480
-- -- Name: COLUMN nesa_uae_gap_analysis.action_owner; Type: COMMENT; Schema: public; Owner: neondb_owner
-- --

-- COMMENT ON COLUMN org_mashreqbank.nesa_uae_gap_analysis.action_owner IS 'Person responsible for remediation actions';


-- --
-- -- TOC entry 7024 (class 0 OID 0)
-- -- Dependencies: 480
-- -- Name: COLUMN nesa_uae_gap_analysis.reviewer; Type: COMMENT; Schema: public; Owner: neondb_owner
-- --

-- COMMENT ON COLUMN org_mashreqbank.nesa_uae_gap_analysis.reviewer IS 'Person responsible for reviewing the gap analysis';


-- --
-- -- TOC entry 7025 (class 0 OID 0)
-- -- Dependencies: 480
-- -- Name: COLUMN nesa_uae_gap_analysis.status; Type: COMMENT; Schema: public; Owner: neondb_owner
-- --

-- COMMENT ON COLUMN org_mashreqbank.nesa_uae_gap_analysis.status IS 'Current status of the gap analysis entry';


-- --
-- -- TOC entry 7026 (class 0 OID 0)
-- -- Dependencies: 480
-- -- Name: COLUMN nesa_uae_gap_analysis.notes; Type: COMMENT; Schema: public; Owner: neondb_owner
-- --

-- COMMENT ON COLUMN org_mashreqbank.nesa_uae_gap_analysis.notes IS 'Additional notes and comments';


-- --
-- -- TOC entry 479 (class 1259 OID 589860)
-- -- Name: nesa_uae_gap_analysis_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
-- --

-- CREATE SEQUENCE org_mashreqbank.nesa_uae_gap_analysis_id_seq
--     AS integer
--     START WITH 1
--     INCREMENT BY 1
--     NO MINVALUE
--     NO MAXVALUE
--     CACHE 1;


-- ALTER SEQUENCE org_mashreqbank.nesa_uae_gap_analysis_id_seq OWNER TO neondb_owner;

-- --
-- -- TOC entry 7027 (class 0 OID 0)
-- -- Dependencies: 479
-- -- Name: nesa_uae_gap_analysis_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
-- --

-- ALTER SEQUENCE org_mashreqbank.nesa_uae_gap_analysis_id_seq OWNED BY org_mashreqbank.nesa_uae_gap_analysis.id;


-- --
-- -- TOC entry 503 (class 1259 OID 753668)
-- -- Name: nesa_uae_remediation_actions; Type: TABLE; Schema: public; Owner: neondb_owner
-- --

-- CREATE TABLE org_mashreqbank.nesa_uae_remediation_actions (
--     id integer NOT NULL,
--     assessment_id integer,
--     requirement_id integer,
--     finding_id character varying(50) NOT NULL,
--     finding_title character varying(255) NOT NULL,
--     finding_description text NOT NULL,
--     finding_severity character varying(20) NOT NULL,
--     finding_category character varying(100),
--     remediation_action text NOT NULL,
--     remediation_priority character varying(20) NOT NULL,
--     remediation_status character varying(50) DEFAULT 'Open'::character varying,
--     remediation_type character varying(50),
--     assigned_to character varying(255),
--     assigned_department character varying(100),
--     responsible_manager character varying(255),
--     target_completion_date date,
--     actual_completion_date date,
--     estimated_effort_hours integer,
--     actual_effort_hours integer,
--     estimated_cost numeric(12,2),
--     actual_cost numeric(12,2),
--     budget_approved boolean DEFAULT false,
--     progress_percentage integer DEFAULT 0,
--     last_update_date date DEFAULT CURRENT_DATE,
--     next_review_date date,
--     evidence_required text,
--     evidence_provided text,
--     supporting_documents text[],
--     risk_before_remediation character varying(20),
--     risk_after_remediation character varying(20),
--     business_impact text,
--     requires_approval boolean DEFAULT false,
--     approved_by character varying(255),
--     approval_date date,
--     approval_comments text,
--     verification_method character varying(100),
--     verified_by character varying(255),
--     verification_date date,
--     verification_status character varying(50),
--     verification_comments text,
--     created_by character varying(255),
--     created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
--     updated_by character varying(255),
--     updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
--     CONSTRAINT valid_priority CHECK (((remediation_priority)::text = ANY ((ARRAY['Critical'::character varying, 'High'::character varying, 'Medium'::character varying, 'Low'::character varying])::text[]))),
--     CONSTRAINT valid_progress CHECK (((progress_percentage >= 0) AND (progress_percentage <= 100))),
--     CONSTRAINT valid_severity CHECK (((finding_severity)::text = ANY ((ARRAY['Critical'::character varying, 'High'::character varying, 'Medium'::character varying, 'Low'::character varying])::text[]))),
--     CONSTRAINT valid_status CHECK (((remediation_status)::text = ANY ((ARRAY['Open'::character varying, 'In Progress'::character varying, 'Under Review'::character varying, 'Completed'::character varying, 'Closed'::character varying, 'Deferred'::character varying])::text[])))
-- );


-- ALTER TABLE org_mashreqbank.nesa_uae_remediation_actions OWNER TO neondb_owner;

-- --
-- -- TOC entry 502 (class 1259 OID 753667)
-- -- Name: nesa_uae_remediation_actions_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
-- --

-- CREATE SEQUENCE org_mashreqbank.nesa_uae_remediation_actions_id_seq
--     AS integer
--     START WITH 1
--     INCREMENT BY 1
--     NO MINVALUE
--     NO MAXVALUE
--     CACHE 1;


-- ALTER SEQUENCE org_mashreqbank.nesa_uae_remediation_actions_id_seq OWNER TO neondb_owner;

-- --
-- -- TOC entry 7028 (class 0 OID 0)
-- -- Dependencies: 502
-- -- Name: nesa_uae_remediation_actions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
-- --

-- ALTER SEQUENCE org_mashreqbank.nesa_uae_remediation_actions_id_seq OWNED BY org_mashreqbank.nesa_uae_remediation_actions.id;


-- --
-- -- TOC entry 468 (class 1259 OID 565399)
-- -- Name: nesa_uae_remediation_dependencies; Type: TABLE; Schema: public; Owner: neondb_owner
-- --

-- CREATE TABLE org_mashreqbank.nesa_uae_remediation_dependencies (
--     id integer NOT NULL,
--     parent_action_id integer,
--     dependent_action_id integer,
--     dependency_type character varying(50) NOT NULL,
--     description text,
--     created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
--     CONSTRAINT no_self_dependency CHECK ((parent_action_id <> dependent_action_id))
-- );


-- ALTER TABLE org_mashreqbank.nesa_uae_remediation_dependencies OWNER TO neondb_owner;

-- --
-- -- TOC entry 467 (class 1259 OID 565398)
-- -- Name: nesa_uae_remediation_dependencies_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
-- --

-- CREATE SEQUENCE org_mashreqbank.nesa_uae_remediation_dependencies_id_seq
--     AS integer
--     START WITH 1
--     INCREMENT BY 1
--     NO MINVALUE
--     NO MAXVALUE
--     CACHE 1;


-- ALTER SEQUENCE org_mashreqbank.nesa_uae_remediation_dependencies_id_seq OWNER TO neondb_owner;

-- --
-- -- TOC entry 7029 (class 0 OID 0)
-- -- Dependencies: 467
-- -- Name: nesa_uae_remediation_dependencies_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
-- --

-- ALTER SEQUENCE org_mashreqbank.nesa_uae_remediation_dependencies_id_seq OWNED BY org_mashreqbank.nesa_uae_remediation_dependencies.id;


-- --
-- -- TOC entry 466 (class 1259 OID 565384)
-- -- Name: nesa_uae_remediation_updates; Type: TABLE; Schema: public; Owner: neondb_owner
-- --

-- CREATE TABLE org_mashreqbank.nesa_uae_remediation_updates (
--     id integer NOT NULL,
--     remediation_action_id integer,
--     update_type character varying(50) NOT NULL,
--     update_description text NOT NULL,
--     previous_status character varying(50),
--     new_status character varying(50),
--     previous_progress integer,
--     new_progress integer,
--     update_by character varying(255) NOT NULL,
--     update_date timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
--     attachments text[]
-- );


-- ALTER TABLE org_mashreqbank.nesa_uae_remediation_updates OWNER TO neondb_owner;

-- --
-- -- TOC entry 465 (class 1259 OID 565383)
-- -- Name: nesa_uae_remediation_updates_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
-- --

-- CREATE SEQUENCE org_mashreqbank.nesa_uae_remediation_updates_id_seq
--     AS integer
--     START WITH 1
--     INCREMENT BY 1
--     NO MINVALUE
--     NO MAXVALUE
--     CACHE 1;


-- ALTER SEQUENCE org_mashreqbank.nesa_uae_remediation_updates_id_seq OWNER TO neondb_owner;

-- --
-- -- TOC entry 7030 (class 0 OID 0)
-- -- Dependencies: 465
-- -- Name: nesa_uae_remediation_updates_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
-- --

-- ALTER SEQUENCE org_mashreqbank.nesa_uae_remediation_updates_id_seq OWNED BY org_mashreqbank.nesa_uae_remediation_updates.id;


-- --
-- -- TOC entry 462 (class 1259 OID 565307)
-- -- Name: nesa_uae_requirements; Type: TABLE; Schema: public; Owner: neondb_owner
-- --

-- CREATE TABLE org_mashreqbank.nesa_uae_requirements (
--     id integer NOT NULL,
--     domain character varying(100) NOT NULL,
--     control_id character varying(20) NOT NULL,
--     control_name character varying(200) NOT NULL,
--     description text NOT NULL,
--     control_type character varying(50) NOT NULL,
--     maturity_level character varying(20) NOT NULL,
--     status character varying(50) DEFAULT 'Not Implemented'::character varying,
--     implementation_guidance text,
--     created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
--     updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
-- );


-- ALTER TABLE org_mashreqbank.nesa_uae_requirements OWNER TO neondb_owner;

-- --
-- -- TOC entry 461 (class 1259 OID 565306)
-- -- Name: nesa_uae_requirements_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
-- --

-- CREATE SEQUENCE org_mashreqbank.nesa_uae_requirements_id_seq
--     AS integer
--     START WITH 1
--     INCREMENT BY 1
--     NO MINVALUE
--     NO MAXVALUE
--     CACHE 1;


-- ALTER SEQUENCE org_mashreqbank.nesa_uae_requirements_id_seq OWNER TO neondb_owner;

-- --
-- -- TOC entry 7031 (class 0 OID 0)
-- -- Dependencies: 461
-- -- Name: nesa_uae_requirements_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
-- --

-- ALTER SEQUENCE org_mashreqbank.nesa_uae_requirements_id_seq OWNED BY org_mashreqbank.nesa_uae_requirements.id;


-- --
-- -- TOC entry 474 (class 1259 OID 581662)
-- -- Name: nesa_uae_self_assessment_audit_log; Type: TABLE; Schema: public; Owner: neondb_owner
-- --

-- CREATE TABLE org_mashreqbank.nesa_uae_self_assessment_audit_log (
--     id integer NOT NULL,
--     assessment_id integer,
--     control_id character varying(50),
--     action_type character varying(50) NOT NULL,
--     field_changed character varying(100),
--     old_value text,
--     new_value text,
--     changed_by character varying(255) NOT NULL,
--     change_reason text,
--     "timestamp" timestamp without time zone DEFAULT CURRENT_TIMESTAMP
-- );


-- ALTER TABLE org_mashreqbank.nesa_uae_self_assessment_audit_log OWNER TO neondb_owner;

-- --
-- -- TOC entry 7032 (class 0 OID 0)
-- -- Dependencies: 474
-- -- Name: TABLE nesa_uae_self_assessment_audit_log; Type: COMMENT; Schema: public; Owner: neondb_owner
-- --

-- COMMENT ON TABLE org_mashreqbank.nesa_uae_self_assessment_audit_log IS 'Complete audit trail of all changes made to assessments and controls';


-- --
-- -- TOC entry 473 (class 1259 OID 581661)
-- -- Name: nesa_uae_self_assessment_audit_log_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
-- --

-- CREATE SEQUENCE org_mashreqbank.nesa_uae_self_assessment_audit_log_id_seq
--     AS integer
--     START WITH 1
--     INCREMENT BY 1
--     NO MINVALUE
--     NO MAXVALUE
--     CACHE 1;


-- ALTER SEQUENCE org_mashreqbank.nesa_uae_self_assessment_audit_log_id_seq OWNER TO neondb_owner;

-- --
-- -- TOC entry 7033 (class 0 OID 0)
-- -- Dependencies: 473
-- -- Name: nesa_uae_self_assessment_audit_log_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
-- --

-- ALTER SEQUENCE org_mashreqbank.nesa_uae_self_assessment_audit_log_id_seq OWNED BY org_mashreqbank.nesa_uae_self_assessment_audit_log.id;


-- --
-- -- TOC entry 476 (class 1259 OID 581680)
-- -- Name: nesa_uae_self_assessment_controls; Type: TABLE; Schema: public; Owner: neondb_owner
-- --

-- CREATE TABLE org_mashreqbank.nesa_uae_self_assessment_controls (
--     id integer NOT NULL,
--     assessment_id integer,
--     requirement_id integer,
--     control_id character varying(50) NOT NULL,
--     control_name character varying(500),
--     domain character varying(255),
--     current_maturity_level character varying(50) DEFAULT 'Not Implemented'::character varying,
--     target_maturity_level character varying(50) DEFAULT 'Basic'::character varying,
--     implementation_status character varying(50) DEFAULT 'Not Implemented'::character varying,
--     existing_controls text,
--     target_controls text,
--     action_owner character varying(255),
--     action_owner_email character varying(255),
--     target_completion_date date,
--     evidence_provided text,
--     gaps_identified text,
--     remediation_actions text,
--     business_justification text,
--     estimated_cost numeric(12,2) DEFAULT 0,
--     estimated_effort_hours integer DEFAULT 0,
--     priority character varying(20) DEFAULT 'Medium'::character varying,
--     compliance_percentage integer DEFAULT 0,
--     last_reviewed_date timestamp without time zone,
--     next_review_date date,
--     reviewer_name character varying(255),
--     reviewer_comments text,
--     approval_status character varying(50) DEFAULT 'Pending'::character varying,
--     approved_by character varying(255),
--     approval_date timestamp without time zone,
--     created_by character varying(255) DEFAULT 'System'::character varying,
--     updated_by character varying(255) DEFAULT 'System'::character varying,
--     created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
--     updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
-- );


-- ALTER TABLE org_mashreqbank.nesa_uae_self_assessment_controls OWNER TO neondb_owner;

-- --
-- -- TOC entry 7034 (class 0 OID 0)
-- -- Dependencies: 476
-- -- Name: TABLE nesa_uae_self_assessment_controls; Type: COMMENT; Schema: public; Owner: neondb_owner
-- --

-- COMMENT ON TABLE org_mashreqbank.nesa_uae_self_assessment_controls IS 'Individual control assessments with maturity levels, implementation status, and action plans';


-- --
-- -- TOC entry 7035 (class 0 OID 0)
-- -- Dependencies: 476
-- -- Name: COLUMN nesa_uae_self_assessment_controls.current_maturity_level; Type: COMMENT; Schema: public; Owner: neondb_owner
-- --

-- COMMENT ON COLUMN org_mashreqbank.nesa_uae_self_assessment_controls.current_maturity_level IS 'Current maturity: Not Implemented, Basic, Intermediate, Advanced';


-- --
-- -- TOC entry 7036 (class 0 OID 0)
-- -- Dependencies: 476
-- -- Name: COLUMN nesa_uae_self_assessment_controls.target_maturity_level; Type: COMMENT; Schema: public; Owner: neondb_owner
-- --

-- COMMENT ON COLUMN org_mashreqbank.nesa_uae_self_assessment_controls.target_maturity_level IS 'Target maturity level to achieve';


-- --
-- -- TOC entry 7037 (class 0 OID 0)
-- -- Dependencies: 476
-- -- Name: COLUMN nesa_uae_self_assessment_controls.implementation_status; Type: COMMENT; Schema: public; Owner: neondb_owner
-- --

-- COMMENT ON COLUMN org_mashreqbank.nesa_uae_self_assessment_controls.implementation_status IS 'Implementation status: Not Implemented, Partially Implemented, Implemented, Not Applicable';


-- --
-- -- TOC entry 7038 (class 0 OID 0)
-- -- Dependencies: 476
-- -- Name: COLUMN nesa_uae_self_assessment_controls.priority; Type: COMMENT; Schema: public; Owner: neondb_owner
-- --

-- COMMENT ON COLUMN org_mashreqbank.nesa_uae_self_assessment_controls.priority IS 'Priority level: Low, Medium, High';


-- --
-- -- TOC entry 7039 (class 0 OID 0)
-- -- Dependencies: 476
-- -- Name: COLUMN nesa_uae_self_assessment_controls.compliance_percentage; Type: COMMENT; Schema: public; Owner: neondb_owner
-- --

-- COMMENT ON COLUMN org_mashreqbank.nesa_uae_self_assessment_controls.compliance_percentage IS 'Compliance percentage (0-100)';


-- --
-- -- TOC entry 475 (class 1259 OID 581679)
-- -- Name: nesa_uae_self_assessment_controls_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
-- --

-- CREATE SEQUENCE org_mashreqbank.nesa_uae_self_assessment_controls_id_seq
--     AS integer
--     START WITH 1
--     INCREMENT BY 1
--     NO MINVALUE
--     NO MAXVALUE
--     CACHE 1;


-- ALTER SEQUENCE org_mashreqbank.nesa_uae_self_assessment_controls_id_seq OWNER TO neondb_owner;

-- --
-- -- TOC entry 7040 (class 0 OID 0)
-- -- Dependencies: 475
-- -- Name: nesa_uae_self_assessment_controls_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
-- --

-- ALTER SEQUENCE org_mashreqbank.nesa_uae_self_assessment_controls_id_seq OWNED BY org_mashreqbank.nesa_uae_self_assessment_controls.id;


-- --
-- -- TOC entry 472 (class 1259 OID 581633)
-- -- Name: nesa_uae_self_assessments; Type: TABLE; Schema: public; Owner: neondb_owner
-- --

-- CREATE TABLE org_mashreqbank.nesa_uae_self_assessments (
--     id integer NOT NULL,
--     assessment_name character varying(255) NOT NULL,
--     organization_id integer,
--     assessment_scope text,
--     assessment_period_start date,
--     assessment_period_end date,
--     assessor_name character varying(255),
--     assessor_title character varying(255),
--     assessor_email character varying(255),
--     status character varying(50) DEFAULT 'Draft'::character varying,
--     overall_maturity_score numeric(3,2) DEFAULT 0,
--     compliance_percentage numeric(5,2) DEFAULT 0,
--     total_controls integer DEFAULT 0,
--     implemented_controls integer DEFAULT 0,
--     partially_implemented_controls integer DEFAULT 0,
--     not_implemented_controls integer DEFAULT 0,
--     not_applicable_controls integer DEFAULT 0,
--     high_priority_gaps integer DEFAULT 0,
--     medium_priority_gaps integer DEFAULT 0,
--     low_priority_gaps integer DEFAULT 0,
--     executive_summary text,
--     key_findings text,
--     recommendations text,
--     next_assessment_date date,
--     created_by character varying(255) DEFAULT 'System'::character varying,
--     updated_by character varying(255) DEFAULT 'System'::character varying,
--     created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
--     updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
-- );


-- ALTER TABLE org_mashreqbank.nesa_uae_self_assessments OWNER TO neondb_owner;

-- --
-- -- TOC entry 7041 (class 0 OID 0)
-- -- Dependencies: 472
-- -- Name: TABLE nesa_uae_self_assessments; Type: COMMENT; Schema: public; Owner: neondb_owner
-- --

-- COMMENT ON TABLE org_mashreqbank.nesa_uae_self_assessments IS 'NESA UAE self-assessment projects with overall metrics and status';


-- --
-- -- TOC entry 471 (class 1259 OID 581632)
-- -- Name: nesa_uae_self_assessments_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
-- --

-- CREATE SEQUENCE org_mashreqbank.nesa_uae_self_assessments_id_seq
--     AS integer
--     START WITH 1
--     INCREMENT BY 1
--     NO MINVALUE
--     NO MAXVALUE
--     CACHE 1;


-- ALTER SEQUENCE org_mashreqbank.nesa_uae_self_assessments_id_seq OWNER TO neondb_owner;

-- --
-- -- TOC entry 7042 (class 0 OID 0)
-- -- Dependencies: 471
-- -- Name: nesa_uae_self_assessments_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
-- --

-- ALTER SEQUENCE org_mashreqbank.nesa_uae_self_assessments_id_seq OWNED BY org_mashreqbank.nesa_uae_self_assessments.id;


-- --
-- -- TOC entry 478 (class 1259 OID 589855)
-- -- Name: nesa_uae_sub_controls; Type: TABLE; Schema: public; Owner: neondb_owner
-- --

-- CREATE TABLE org_mashreqbank.nesa_uae_sub_controls (
--     id integer NOT NULL,
--     sub_control_id integer,
--     sub_control_name character varying(20)
-- );


-- ALTER TABLE org_mashreqbank.nesa_uae_sub_controls OWNER TO neondb_owner;

-- --
-- -- TOC entry 477 (class 1259 OID 589854)
-- -- Name: nesa_uae_sub_controls_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
-- --

-- ALTER TABLE org_mashreqbank.nesa_uae_sub_controls ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
--     SEQUENCE NAME org_mashreqbank.nesa_uae_sub_controls_id_seq
--     START WITH 1
--     INCREMENT BY 1
--     NO MINVALUE
--     NO MAXVALUE
--     CACHE 1
-- );


-- --
-- -- TOC entry 319 (class 1259 OID 163855)
-- -- Name: nist_csf_categories; Type: TABLE; Schema: public; Owner: neondb_owner
-- --

-- CREATE TABLE org_mashreqbank.nist_csf_categories (
--     id integer NOT NULL,
--     category_code character varying(20) NOT NULL,
--     category_name character varying(200) NOT NULL,
--     category_description text,
--     function_id integer,
--     is_active boolean DEFAULT true,
--     created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
--     updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
-- );


-- ALTER TABLE org_mashreqbank.nist_csf_categories OWNER TO neondb_owner;

-- --
-- -- TOC entry 7043 (class 0 OID 0)
-- -- Dependencies: 319
-- -- Name: TABLE nist_csf_categories; Type: COMMENT; Schema: public; Owner: neondb_owner
-- --

-- COMMENT ON TABLE org_mashreqbank.nist_csf_categories IS 'NIST CSF Categories within each function';


-- --
-- -- TOC entry 318 (class 1259 OID 163854)
-- -- Name: nist_csf_categories_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
-- --

-- CREATE SEQUENCE org_mashreqbank.nist_csf_categories_id_seq
--     AS integer
--     START WITH 1
--     INCREMENT BY 1
--     NO MINVALUE
--     NO MAXVALUE
--     CACHE 1;


-- ALTER SEQUENCE org_mashreqbank.nist_csf_categories_id_seq OWNER TO neondb_owner;

-- --
-- -- TOC entry 7044 (class 0 OID 0)
-- -- Dependencies: 318
-- -- Name: nist_csf_categories_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
-- --

-- ALTER SEQUENCE org_mashreqbank.nist_csf_categories_id_seq OWNED BY org_mashreqbank.nist_csf_categories.id;


-- --
-- -- TOC entry 317 (class 1259 OID 163841)
-- -- Name: nist_csf_functions; Type: TABLE; Schema: public; Owner: neondb_owner
-- --

-- CREATE TABLE org_mashreqbank.nist_csf_functions (
--     id integer NOT NULL,
--     function_code character varying(10) NOT NULL,
--     function_name character varying(100) NOT NULL,
--     function_description text,
--     function_purpose text,
--     is_active boolean DEFAULT true,
--     created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
--     updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
-- );


-- ALTER TABLE org_mashreqbank.nist_csf_functions OWNER TO neondb_owner;

-- --
-- -- TOC entry 7045 (class 0 OID 0)
-- -- Dependencies: 317
-- -- Name: TABLE nist_csf_functions; Type: COMMENT; Schema: public; Owner: neondb_owner
-- --

-- COMMENT ON TABLE org_mashreqbank.nist_csf_functions IS 'NIST CSF 2.0 Core Functions (Govern, Identify, Protect, Detect, Respond, Recover)';


-- --
-- -- TOC entry 316 (class 1259 OID 163840)
-- -- Name: nist_csf_functions_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
-- --

-- CREATE SEQUENCE org_mashreqbank.nist_csf_functions_id_seq
--     AS integer
--     START WITH 1
--     INCREMENT BY 1
--     NO MINVALUE
--     NO MAXVALUE
--     CACHE 1;


-- ALTER SEQUENCE org_mashreqbank.nist_csf_functions_id_seq OWNER TO neondb_owner;

-- --
-- -- TOC entry 7046 (class 0 OID 0)
-- -- Dependencies: 316
-- -- Name: nist_csf_functions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
-- --

-- ALTER SEQUENCE org_mashreqbank.nist_csf_functions_id_seq OWNED BY org_mashreqbank.nist_csf_functions.id;


-- --
-- -- TOC entry 327 (class 1259 OID 163951)
-- -- Name: nist_csf_implementation_tiers; Type: TABLE; Schema: public; Owner: neondb_owner
-- --

-- CREATE TABLE org_mashreqbank.nist_csf_implementation_tiers (
--     id integer NOT NULL,
--     tier_level integer NOT NULL,
--     tier_name character varying(50) NOT NULL,
--     tier_description text,
--     characteristics jsonb DEFAULT '[]'::jsonb,
--     created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
--     CONSTRAINT nist_csf_implementation_tiers_tier_level_check CHECK (((tier_level >= 1) AND (tier_level <= 4)))
-- );


-- ALTER TABLE org_mashreqbank.nist_csf_implementation_tiers OWNER TO neondb_owner;

-- --
-- -- TOC entry 7047 (class 0 OID 0)
-- -- Dependencies: 327
-- -- Name: TABLE nist_csf_implementation_tiers; Type: COMMENT; Schema: public; Owner: neondb_owner
-- --

-- COMMENT ON TABLE org_mashreqbank.nist_csf_implementation_tiers IS 'NIST CSF Implementation Tiers (Partial, Risk Informed, Repeatable, Adaptive)';


-- --
-- -- TOC entry 326 (class 1259 OID 163950)
-- -- Name: nist_csf_implementation_tiers_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
-- --

-- CREATE SEQUENCE org_mashreqbank.nist_csf_implementation_tiers_id_seq
--     AS integer
--     START WITH 1
--     INCREMENT BY 1
--     NO MINVALUE
--     NO MAXVALUE
--     CACHE 1;


-- ALTER SEQUENCE org_mashreqbank.nist_csf_implementation_tiers_id_seq OWNER TO neondb_owner;

-- --
-- -- TOC entry 7048 (class 0 OID 0)
-- -- Dependencies: 326
-- -- Name: nist_csf_implementation_tiers_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
-- --

-- ALTER SEQUENCE org_mashreqbank.nist_csf_implementation_tiers_id_seq OWNED BY org_mashreqbank.nist_csf_implementation_tiers.id;


-- --
-- -- TOC entry 501 (class 1259 OID 696321)
-- -- Name: nist_csf_mitigation_plans; Type: TABLE; Schema: public; Owner: neondb_owner
-- --

-- CREATE TABLE org_mashreqbank.nist_csf_mitigation_plans (
--     id integer NOT NULL,
--     plan_id character varying(50) NOT NULL,
--     plan_name character varying(255) NOT NULL,
--     risk_template_id integer,
--     mitigation_strategy text NOT NULL,
--     status character varying(50) DEFAULT 'Planning'::character varying,
--     progress_percentage integer DEFAULT 0,
--     assigned_owner character varying(255) NOT NULL,
--     due_date date,
--     estimated_cost numeric(15,2) DEFAULT 0,
--     residual_risk_level character varying(20) DEFAULT 'Medium'::character varying,
--     priority_level character varying(20) DEFAULT 'Medium'::character varying,
--     created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
--     updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
--     notes character varying(400),
--     implementation_approach character varying(600),
--     success_criteria character varying(500),
--     estimated_duration_days numeric(10,6),
--     start_date date,
--     target_completion_date date,
--     actual_completion_date text,
--     CONSTRAINT nist_csf_mitigation_plans_priority_check CHECK (((priority_level)::text = ANY ((ARRAY['Critical'::character varying, 'High'::character varying, 'Medium'::character varying, 'Low'::character varying])::text[]))),
--     CONSTRAINT nist_csf_mitigation_plans_progress_percentage_check CHECK (((progress_percentage >= 0) AND (progress_percentage <= 100))),
--     CONSTRAINT nist_csf_mitigation_plans_residual_risk_level_check CHECK (((residual_risk_level)::text = ANY ((ARRAY['Critical'::character varying, 'High'::character varying, 'Medium'::character varying, 'Low'::character varying, 'Very Low'::character varying])::text[]))),
--     CONSTRAINT nist_csf_mitigation_plans_status_check CHECK (((status)::text = ANY ((ARRAY['Planning'::character varying, 'In Progress'::character varying, 'Completed'::character varying, 'On Hold'::character varying])::text[])))
-- );


-- ALTER TABLE org_mashreqbank.nist_csf_mitigation_plans OWNER TO neondb_owner;

-- --
-- -- TOC entry 7049 (class 0 OID 0)
-- -- Dependencies: 501
-- -- Name: TABLE nist_csf_mitigation_plans; Type: COMMENT; Schema: public; Owner: neondb_owner
-- --

-- COMMENT ON TABLE org_mashreqbank.nist_csf_mitigation_plans IS 'Risk mitigation plans aligned with NIST Cybersecurity Framework';


-- --
-- -- TOC entry 7050 (class 0 OID 0)
-- -- Dependencies: 501
-- -- Name: COLUMN nist_csf_mitigation_plans.plan_id; Type: COMMENT; Schema: public; Owner: neondb_owner
-- --

-- COMMENT ON COLUMN org_mashreqbank.nist_csf_mitigation_plans.plan_id IS 'Unique identifier for the mitigation plan (e.g., NIST-MIT-0001)';


-- --
-- -- TOC entry 7051 (class 0 OID 0)
-- -- Dependencies: 501
-- -- Name: COLUMN nist_csf_mitigation_plans.plan_name; Type: COMMENT; Schema: public; Owner: neondb_owner
-- --

-- COMMENT ON COLUMN org_mashreqbank.nist_csf_mitigation_plans.plan_name IS 'Descriptive name of the mitigation plan';


-- --
-- -- TOC entry 7052 (class 0 OID 0)
-- -- Dependencies: 501
-- -- Name: COLUMN nist_csf_mitigation_plans.risk_template_id; Type: COMMENT; Schema: public; Owner: neondb_owner
-- --

-- COMMENT ON COLUMN org_mashreqbank.nist_csf_mitigation_plans.risk_template_id IS 'Reference to the associated NIST CSF risk template';


-- --
-- -- TOC entry 7053 (class 0 OID 0)
-- -- Dependencies: 501
-- -- Name: COLUMN nist_csf_mitigation_plans.mitigation_strategy; Type: COMMENT; Schema: public; Owner: neondb_owner
-- --

-- COMMENT ON COLUMN org_mashreqbank.nist_csf_mitigation_plans.mitigation_strategy IS 'Detailed description of the mitigation strategy';


-- --
-- -- TOC entry 7054 (class 0 OID 0)
-- -- Dependencies: 501
-- -- Name: COLUMN nist_csf_mitigation_plans.status; Type: COMMENT; Schema: public; Owner: neondb_owner
-- --

-- COMMENT ON COLUMN org_mashreqbank.nist_csf_mitigation_plans.status IS 'Current status of the mitigation plan';


-- --
-- -- TOC entry 7055 (class 0 OID 0)
-- -- Dependencies: 501
-- -- Name: COLUMN nist_csf_mitigation_plans.progress_percentage; Type: COMMENT; Schema: public; Owner: neondb_owner
-- --

-- COMMENT ON COLUMN org_mashreqbank.nist_csf_mitigation_plans.progress_percentage IS 'Completion percentage (0-100)';


-- --
-- -- TOC entry 7056 (class 0 OID 0)
-- -- Dependencies: 501
-- -- Name: COLUMN nist_csf_mitigation_plans.assigned_owner; Type: COMMENT; Schema: public; Owner: neondb_owner
-- --

-- COMMENT ON COLUMN org_mashreqbank.nist_csf_mitigation_plans.assigned_owner IS 'Person or team responsible for executing the plan';


-- --
-- -- TOC entry 7057 (class 0 OID 0)
-- -- Dependencies: 501
-- -- Name: COLUMN nist_csf_mitigation_plans.due_date; Type: COMMENT; Schema: public; Owner: neondb_owner
-- --

-- COMMENT ON COLUMN org_mashreqbank.nist_csf_mitigation_plans.due_date IS 'Target completion date';


-- --
-- -- TOC entry 7058 (class 0 OID 0)
-- -- Dependencies: 501
-- -- Name: COLUMN nist_csf_mitigation_plans.estimated_cost; Type: COMMENT; Schema: public; Owner: neondb_owner
-- --

-- COMMENT ON COLUMN org_mashreqbank.nist_csf_mitigation_plans.estimated_cost IS 'Budget allocated for this mitigation plan';


-- --
-- -- TOC entry 7059 (class 0 OID 0)
-- -- Dependencies: 501
-- -- Name: COLUMN nist_csf_mitigation_plans.residual_risk_level; Type: COMMENT; Schema: public; Owner: neondb_owner
-- --

-- COMMENT ON COLUMN org_mashreqbank.nist_csf_mitigation_plans.residual_risk_level IS 'Expected risk level after mitigation implementation';


-- --
-- -- TOC entry 7060 (class 0 OID 0)
-- -- Dependencies: 501
-- -- Name: COLUMN nist_csf_mitigation_plans.priority_level; Type: COMMENT; Schema: public; Owner: neondb_owner
-- --

-- COMMENT ON COLUMN org_mashreqbank.nist_csf_mitigation_plans.priority_level IS 'Priority level of the mitigation plan';


-- --
-- -- TOC entry 500 (class 1259 OID 696320)
-- -- Name: nist_csf_mitigation_plans_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
-- --

-- CREATE SEQUENCE org_mashreqbank.nist_csf_mitigation_plans_id_seq
--     AS integer
--     START WITH 1
--     INCREMENT BY 1
--     NO MINVALUE
--     NO MAXVALUE
--     CACHE 1;


-- ALTER SEQUENCE org_mashreqbank.nist_csf_mitigation_plans_id_seq OWNER TO neondb_owner;

-- --
-- -- TOC entry 7061 (class 0 OID 0)
-- -- Dependencies: 500
-- -- Name: nist_csf_mitigation_plans_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
-- --

-- ALTER SEQUENCE org_mashreqbank.nist_csf_mitigation_plans_id_seq OWNED BY org_mashreqbank.nist_csf_mitigation_plans.id;


-- --
-- -- TOC entry 329 (class 1259 OID 163965)
-- -- Name: nist_csf_organizational_profiles; Type: TABLE; Schema: public; Owner: neondb_owner
-- --

-- CREATE TABLE org_mashreqbank.nist_csf_organizational_profiles (
--     id integer NOT NULL,
--     profile_name character varying(255) NOT NULL,
--     profile_description text,
--     organization_type character varying(100),
--     industry_sector character varying(100),
--     profile_type character varying(20) DEFAULT 'Current'::character varying,
--     subcategory_implementations jsonb DEFAULT '[]'::jsonb,
--     created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
--     updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
-- );


-- ALTER TABLE org_mashreqbank.nist_csf_organizational_profiles OWNER TO neondb_owner;

-- --
-- -- TOC entry 7062 (class 0 OID 0)
-- -- Dependencies: 329
-- -- Name: TABLE nist_csf_organizational_profiles; Type: COMMENT; Schema: public; Owner: neondb_owner
-- --

-- COMMENT ON TABLE org_mashreqbank.nist_csf_organizational_profiles IS 'Current and target organizational profiles';


-- --
-- -- TOC entry 328 (class 1259 OID 163964)
-- -- Name: nist_csf_organizational_profiles_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
-- --

-- CREATE SEQUENCE org_mashreqbank.nist_csf_organizational_profiles_id_seq
--     AS integer
--     START WITH 1
--     INCREMENT BY 1
--     NO MINVALUE
--     NO MAXVALUE
--     CACHE 1;


-- ALTER SEQUENCE org_mashreqbank.nist_csf_organizational_profiles_id_seq OWNER TO neondb_owner;

-- --
-- -- TOC entry 7063 (class 0 OID 0)
-- -- Dependencies: 328
-- -- Name: nist_csf_organizational_profiles_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
-- --

-- ALTER SEQUENCE org_mashreqbank.nist_csf_organizational_profiles_id_seq OWNED BY org_mashreqbank.nist_csf_organizational_profiles.id;


-- --
-- -- TOC entry 331 (class 1259 OID 163978)
-- -- Name: nist_csf_risk_scenarios; Type: TABLE; Schema: public; Owner: neondb_owner
-- --

-- CREATE TABLE org_mashreqbank.nist_csf_risk_scenarios (
--     id integer NOT NULL,
--     template_id integer,
--     scenario_name character varying(255) NOT NULL,
--     scenario_description text,
--     threat_actor character varying(255),
--     attack_vector character varying(255),
--     affected_functions jsonb DEFAULT '[]'::jsonb,
--     likelihood integer,
--     impact integer,
--     risk_score integer,
--     mitigation_strategies text,
--     created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
--     CONSTRAINT nist_csf_risk_scenarios_impact_check CHECK (((impact >= 1) AND (impact <= 5))),
--     CONSTRAINT nist_csf_risk_scenarios_likelihood_check CHECK (((likelihood >= 1) AND (likelihood <= 5)))
-- );


-- ALTER TABLE org_mashreqbank.nist_csf_risk_scenarios OWNER TO neondb_owner;

-- --
-- -- TOC entry 330 (class 1259 OID 163977)
-- -- Name: nist_csf_risk_scenarios_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
-- --

-- CREATE SEQUENCE org_mashreqbank.nist_csf_risk_scenarios_id_seq
--     AS integer
--     START WITH 1
--     INCREMENT BY 1
--     NO MINVALUE
--     NO MAXVALUE
--     CACHE 1;


-- ALTER SEQUENCE org_mashreqbank.nist_csf_risk_scenarios_id_seq OWNER TO neondb_owner;

-- --
-- -- TOC entry 7064 (class 0 OID 0)
-- -- Dependencies: 330
-- -- Name: nist_csf_risk_scenarios_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
-- --

-- ALTER SEQUENCE org_mashreqbank.nist_csf_risk_scenarios_id_seq OWNED BY org_mashreqbank.nist_csf_risk_scenarios.id;


-- --
-- -- TOC entry 323 (class 1259 OID 163893)
-- -- Name: nist_csf_risk_templates; Type: TABLE; Schema: public; Owner: neondb_owner
-- --

-- CREATE TABLE org_mashreqbank.nist_csf_risk_templates (
--     id integer NOT NULL,
--     template_id character varying(50) NOT NULL,
--     template_name character varying(255) NOT NULL,
--     risk_description text NOT NULL,
--     function_id integer,
--     category_id integer,
--     default_impact integer,
--     risk_level character varying(20) DEFAULT 'Medium'::character varying,
--     is_active boolean DEFAULT true,
--     created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
--     updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
--     default_likelihood integer,
--     threat_sources jsonb DEFAULT '[]'::jsonb,
--     vulnerabilities jsonb DEFAULT '[]'::jsonb,
--     asset_types jsonb DEFAULT '[]'::jsonb,
--     nist_references jsonb DEFAULT '[]'::jsonb,
--     subcategory_id integer,
--     mitigation_strategies text,
--     CONSTRAINT nist_csf_risk_templates_default_impact_check CHECK (((default_impact >= 1) AND (default_impact <= 5)))
-- );


-- ALTER TABLE org_mashreqbank.nist_csf_risk_templates OWNER TO neondb_owner;

-- --
-- -- TOC entry 7065 (class 0 OID 0)
-- -- Dependencies: 323
-- -- Name: TABLE nist_csf_risk_templates; Type: COMMENT; Schema: public; Owner: neondb_owner
-- --

-- COMMENT ON TABLE org_mashreqbank.nist_csf_risk_templates IS 'Risk templates aligned with NIST CSF framework';


-- --
-- -- TOC entry 322 (class 1259 OID 163892)
-- -- Name: nist_csf_risk_templates_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
-- --

-- CREATE SEQUENCE org_mashreqbank.nist_csf_risk_templates_id_seq
--     AS integer
--     START WITH 1
--     INCREMENT BY 1
--     NO MINVALUE
--     NO MAXVALUE
--     CACHE 1;


-- ALTER SEQUENCE org_mashreqbank.nist_csf_risk_templates_id_seq OWNER TO neondb_owner;

-- --
-- -- TOC entry 7066 (class 0 OID 0)
-- -- Dependencies: 322
-- -- Name: nist_csf_risk_templates_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
-- --

-- ALTER SEQUENCE org_mashreqbank.nist_csf_risk_templates_id_seq OWNED BY org_mashreqbank.nist_csf_risk_templates.id;


-- --
-- -- TOC entry 321 (class 1259 OID 163874)
-- -- Name: nist_csf_subcategories; Type: TABLE; Schema: public; Owner: neondb_owner
-- --

-- CREATE TABLE org_mashreqbank.nist_csf_subcategories (
--     id integer NOT NULL,
--     subcategory_code character varying(30) NOT NULL,
--     subcategory_name character varying(300) NOT NULL,
--     subcategory_description text,
--     category_id integer,
--     implementation_guidance text,
--     is_active boolean DEFAULT true,
--     created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
--     updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
--     informative_references character varying(200)
-- );


-- ALTER TABLE org_mashreqbank.nist_csf_subcategories OWNER TO neondb_owner;

-- --
-- -- TOC entry 7067 (class 0 OID 0)
-- -- Dependencies: 321
-- -- Name: TABLE nist_csf_subcategories; Type: COMMENT; Schema: public; Owner: neondb_owner
-- --

-- COMMENT ON TABLE org_mashreqbank.nist_csf_subcategories IS 'NIST CSF Subcategories with implementation guidance';


-- --
-- -- TOC entry 320 (class 1259 OID 163873)
-- -- Name: nist_csf_subcategories_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
-- --

-- CREATE SEQUENCE org_mashreqbank.nist_csf_subcategories_id_seq
--     AS integer
--     START WITH 1
--     INCREMENT BY 1
--     NO MINVALUE
--     NO MAXVALUE
--     CACHE 1;


-- ALTER SEQUENCE org_mashreqbank.nist_csf_subcategories_id_seq OWNER TO neondb_owner;

-- --
-- -- TOC entry 7068 (class 0 OID 0)
-- -- Dependencies: 320
-- -- Name: nist_csf_subcategories_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
-- --

-- ALTER SEQUENCE org_mashreqbank.nist_csf_subcategories_id_seq OWNED BY org_mashreqbank.nist_csf_subcategories.id;


-- --
-- -- TOC entry 325 (class 1259 OID 163924)
-- -- Name: nist_csf_template_controls; Type: TABLE; Schema: public; Owner: neondb_owner
-- --

-- CREATE TABLE org_mashreqbank.nist_csf_template_controls (
--     id integer NOT NULL,
--     template_id integer,
--     subcategory_id integer,
--     implementation_tier integer DEFAULT 1,
--     current_maturity integer DEFAULT 1,
--     target_maturity integer DEFAULT 2,
--     is_priority boolean DEFAULT false,
--     implementation_notes text,
--     created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
--     CONSTRAINT nist_csf_template_controls_current_maturity_check CHECK (((current_maturity >= 1) AND (current_maturity <= 4))),
--     CONSTRAINT nist_csf_template_controls_implementation_tier_check CHECK (((implementation_tier >= 1) AND (implementation_tier <= 4))),
--     CONSTRAINT nist_csf_template_controls_target_maturity_check CHECK (((target_maturity >= 1) AND (target_maturity <= 4)))
-- );


-- ALTER TABLE org_mashreqbank.nist_csf_template_controls OWNER TO neondb_owner;

-- --
-- -- TOC entry 324 (class 1259 OID 163923)
-- -- Name: nist_csf_template_controls_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
-- --

-- CREATE SEQUENCE org_mashreqbank.nist_csf_template_controls_id_seq
--     AS integer
--     START WITH 1
--     INCREMENT BY 1
--     NO MINVALUE
--     NO MAXVALUE
--     CACHE 1;


-- ALTER SEQUENCE org_mashreqbank.nist_csf_template_controls_id_seq OWNER TO neondb_owner;

-- --
-- -- TOC entry 7069 (class 0 OID 0)
-- -- Dependencies: 324
-- -- Name: nist_csf_template_controls_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
-- --

-- ALTER SEQUENCE org_mashreqbank.nist_csf_template_controls_id_seq OWNED BY org_mashreqbank.nist_csf_template_controls.id;


-- --
-- -- TOC entry 388 (class 1259 OID 344156)
-- -- Name: nist_references; Type: TABLE; Schema: public; Owner: neondb_owner
-- --

-- CREATE TABLE org_mashreqbank.nist_references (
--     id integer NOT NULL,
--     reference_code character varying(100) NOT NULL,
--     reference_type character varying(50) NOT NULL,
--     reference_name character varying(500) NOT NULL,
--     reference_description text,
--     framework_version character varying(20) DEFAULT '2.0'::character varying,
--     category character varying(50),
--     control_number character varying(20),
--     implementation_guidance text,
--     related_controls jsonb DEFAULT '[]'::jsonb,
--     compliance_requirement jsonb DEFAULT '[]'::jsonb,
--     maturity_level integer DEFAULT 1,
--     is_active boolean DEFAULT true,
--     created_at timestamp with time zone DEFAULT now(),
--     updated_at timestamp with time zone DEFAULT now(),
--     CONSTRAINT chk_nist_maturity_level CHECK (((maturity_level >= 1) AND (maturity_level <= 5))),
--     CONSTRAINT chk_nist_reference_type CHECK (((reference_type)::text = ANY ((ARRAY['NIST CSF'::character varying, 'NIST SP 800-53'::character varying, 'NIST SP 800-171'::character varying, 'NIST RMF'::character varying, 'NIST Privacy Framework'::character varying, 'NIST AI RMF'::character varying])::text[])))
-- );


-- ALTER TABLE org_mashreqbank.nist_references OWNER TO neondb_owner;

-- --
-- -- TOC entry 387 (class 1259 OID 344155)
-- -- Name: nist_references_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
-- --

-- CREATE SEQUENCE org_mashreqbank.nist_references_id_seq
--     AS integer
--     START WITH 1
--     INCREMENT BY 1
--     NO MINVALUE
--     NO MAXVALUE
--     CACHE 1;


-- ALTER SEQUENCE org_mashreqbank.nist_references_id_seq OWNER TO neondb_owner;

-- --
-- -- TOC entry 7070 (class 0 OID 0)
-- -- Dependencies: 387
-- -- Name: nist_references_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
-- --

-- ALTER SEQUENCE org_mashreqbank.nist_references_id_seq OWNED BY org_mashreqbank.nist_references.id;


-- --
-- -- TOC entry 540 (class 1259 OID 860195)
-- -- Name: organization_sla_config; Type: TABLE; Schema: public; Owner: neondb_owner
-- --

-- CREATE TABLE org_mashreqbank.organization_sla_config (
--     id integer NOT NULL,
--     organization_id integer,
--     template_id integer,
--     is_active boolean DEFAULT true,
--     assigned_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
--     assigned_by character varying(255)
-- );


-- ALTER TABLE org_mashreqbank.organization_sla_config OWNER TO neondb_owner;

-- --
-- -- TOC entry 539 (class 1259 OID 860194)
-- -- Name: organization_sla_config_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
-- --

-- CREATE SEQUENCE org_mashreqbank.organization_sla_config_id_seq
--     AS integer
--     START WITH 1
--     INCREMENT BY 1
--     NO MINVALUE
--     NO MAXVALUE
--     CACHE 1;


-- ALTER SEQUENCE org_mashreqbank.organization_sla_config_id_seq OWNER TO neondb_owner;

-- --
-- -- TOC entry 7071 (class 0 OID 0)
-- -- Dependencies: 539
-- -- Name: organization_sla_config_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
-- --

-- ALTER SEQUENCE org_mashreqbank.organization_sla_config_id_seq OWNED BY org_mashreqbank.organization_sla_config.id;


-- --
-- -- TOC entry 242 (class 1259 OID 49152)
-- -- Name: organizations_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
-- --

-- CREATE SEQUENCE org_mashreqbank.organizations_id_seq
--     AS integer
--     START WITH 1
--     INCREMENT BY 1
--     NO MINVALUE
--     NO MAXVALUE
--     CACHE 1;


-- ALTER SEQUENCE org_mashreqbank.organizations_id_seq OWNER TO neondb_owner;

-- --
-- -- TOC entry 7072 (class 0 OID 0)
-- -- Dependencies: 242
-- -- Name: organizations_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
-- --

-- ALTER SEQUENCE org_mashreqbank.organizations_id_seq OWNED BY org_mashreqbank.organizations.id;


-- --
-- -- TOC entry 420 (class 1259 OID 516109)
-- -- Name: organizations_organization_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
-- --

-- ALTER TABLE org_mashreqbank.organizations ALTER COLUMN organization_id ADD GENERATED ALWAYS AS IDENTITY (
--     SEQUENCE NAME org_mashreqbank.organizations_organization_id_seq
--     START WITH 1
--     INCREMENT BY 1
--     NO MINVALUE
--     NO MAXVALUE
--     CACHE 1
-- );


-- --
-- -- TOC entry 518 (class 1259 OID 794639)
-- -- Name: pages; Type: TABLE; Schema: public; Owner: neondb_owner
-- --

-- CREATE TABLE org_mashreqbank.pages (
--     id integer NOT NULL,
--     name character varying(100) NOT NULL,
--     path character varying(255) NOT NULL,
--     description text,
--     module character varying(100),
--     created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
--     is_active boolean DEFAULT true,
--     updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
-- );


-- ALTER TABLE org_mashreqbank.pages OWNER TO neondb_owner;

-- --
-- -- TOC entry 517 (class 1259 OID 794638)
-- -- Name: pages_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
-- --

-- CREATE SEQUENCE org_mashreqbank.pages_id_seq
--     AS integer
--     START WITH 1
--     INCREMENT BY 1
--     NO MINVALUE
--     NO MAXVALUE
--     CACHE 1;


-- ALTER SEQUENCE org_mashreqbank.pages_id_seq OWNER TO neondb_owner;

-- --
-- -- TOC entry 7073 (class 0 OID 0)
-- -- Dependencies: 517
-- -- Name: pages_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
-- --

-- ALTER SEQUENCE org_mashreqbank.pages_id_seq OWNED BY org_mashreqbank.pages.id;


-- --
-- -- TOC entry 531 (class 1259 OID 811034)
-- -- Name: parent_departments; Type: TABLE; Schema: public; Owner: neondb_owner
-- --

-- CREATE TABLE org_mashreqbank.parent_departments (
--     id integer NOT NULL,
--     parent_department_name character varying(200)
-- );


-- ALTER TABLE org_mashreqbank.parent_departments OWNER TO neondb_owner;

-- --
-- -- TOC entry 522 (class 1259 OID 794763)
-- -- Name: permissions; Type: TABLE; Schema: public; Owner: neondb_owner
-- --

-- CREATE TABLE org_mashreqbank.permissions (
--     id integer NOT NULL,
--     name character varying(100) NOT NULL,
--     description text,
--     permission_type character varying(50) DEFAULT 'read'::character varying NOT NULL,
--     is_system_permission boolean DEFAULT false,
--     created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
--     updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
-- );


-- ALTER TABLE org_mashreqbank.permissions OWNER TO neondb_owner;

-- --
-- -- TOC entry 521 (class 1259 OID 794762)
-- -- Name: permissions_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
-- --

-- CREATE SEQUENCE org_mashreqbank.permissions_id_seq
--     AS integer
--     START WITH 1
--     INCREMENT BY 1
--     NO MINVALUE
--     NO MAXVALUE
--     CACHE 1;


-- ALTER SEQUENCE org_mashreqbank.permissions_id_seq OWNER TO neondb_owner;

-- --
-- -- TOC entry 7074 (class 0 OID 0)
-- -- Dependencies: 521
-- -- Name: permissions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
-- --

-- ALTER SEQUENCE org_mashreqbank.permissions_id_seq OWNED BY org_mashreqbank.permissions.id;


-- --
-- -- TOC entry 361 (class 1259 OID 278722)
-- -- Name: phishing_simulation_results; Type: TABLE; Schema: public; Owner: neondb_owner
-- --

-- CREATE TABLE org_mashreqbank.phishing_simulation_results (
--     id integer NOT NULL,
--     simulation_id integer,
--     user_id integer NOT NULL,
--     email_sent boolean DEFAULT false,
--     email_opened boolean DEFAULT false,
--     link_clicked boolean DEFAULT false,
--     data_entered boolean DEFAULT false,
--     reported_phishing boolean DEFAULT false,
--     clicked_at timestamp without time zone,
--     reported_at timestamp without time zone,
--     ip_address inet,
--     user_agent text,
--     follow_up_training_assigned boolean DEFAULT false
-- );


-- ALTER TABLE org_mashreqbank.phishing_simulation_results OWNER TO neondb_owner;

-- --
-- -- TOC entry 360 (class 1259 OID 278721)
-- -- Name: phishing_simulation_results_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
-- --

-- CREATE SEQUENCE org_mashreqbank.phishing_simulation_results_id_seq
--     AS integer
--     START WITH 1
--     INCREMENT BY 1
--     NO MINVALUE
--     NO MAXVALUE
--     CACHE 1;


-- ALTER SEQUENCE org_mashreqbank.phishing_simulation_results_id_seq OWNER TO neondb_owner;

-- --
-- -- TOC entry 7075 (class 0 OID 0)
-- -- Dependencies: 360
-- -- Name: phishing_simulation_results_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
-- --

-- ALTER SEQUENCE org_mashreqbank.phishing_simulation_results_id_seq OWNED BY org_mashreqbank.phishing_simulation_results.id;


-- --
-- -- TOC entry 359 (class 1259 OID 278706)
-- -- Name: phishing_simulations; Type: TABLE; Schema: public; Owner: neondb_owner
-- --

-- CREATE TABLE org_mashreqbank.phishing_simulations (
--     id integer NOT NULL,
--     campaign_name character varying(255) NOT NULL,
--     description text,
--     template_type character varying(100),
--     target_users jsonb,
--     launch_date timestamp without time zone,
--     end_date timestamp without time zone,
--     status character varying(50) DEFAULT 'draft'::character varying,
--     click_rate numeric(5,2) DEFAULT 0,
--     report_rate numeric(5,2) DEFAULT 0,
--     total_sent integer DEFAULT 0,
--     total_clicked integer DEFAULT 0,
--     total_reported integer DEFAULT 0,
--     created_by integer,
--     created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
-- );


-- ALTER TABLE org_mashreqbank.phishing_simulations OWNER TO neondb_owner;

-- --
-- -- TOC entry 358 (class 1259 OID 278705)
-- -- Name: phishing_simulations_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
-- --

-- CREATE SEQUENCE org_mashreqbank.phishing_simulations_id_seq
--     AS integer
--     START WITH 1
--     INCREMENT BY 1
--     NO MINVALUE
--     NO MAXVALUE
--     CACHE 1;


-- ALTER SEQUENCE org_mashreqbank.phishing_simulations_id_seq OWNER TO neondb_owner;

-- --
-- -- TOC entry 7076 (class 0 OID 0)
-- -- Dependencies: 358
-- -- Name: phishing_simulations_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
-- --

-- ALTER SEQUENCE org_mashreqbank.phishing_simulations_id_seq OWNED BY org_mashreqbank.phishing_simulations.id;


-- --
-- -- TOC entry 227 (class 1259 OID 16480)
-- -- Name: playing_with_neon; Type: TABLE; Schema: public; Owner: neondb_owner
-- --

-- CREATE TABLE org_mashreqbank.playing_with_neon (
--     id integer NOT NULL,
--     name text NOT NULL,
--     value real
-- );


-- ALTER TABLE org_mashreqbank.playing_with_neon OWNER TO neondb_owner;

-- --
-- -- TOC entry 226 (class 1259 OID 16479)
-- -- Name: playing_with_neon_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
-- --

-- CREATE SEQUENCE org_mashreqbank.playing_with_neon_id_seq
--     AS integer
--     START WITH 1
--     INCREMENT BY 1
--     NO MINVALUE
--     NO MAXVALUE
--     CACHE 1;


-- ALTER SEQUENCE org_mashreqbank.playing_with_neon_id_seq OWNER TO neondb_owner;

-- --
-- -- TOC entry 7077 (class 0 OID 0)
-- -- Dependencies: 226
-- -- Name: playing_with_neon_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
-- --

-- ALTER SEQUENCE org_mashreqbank.playing_with_neon_id_seq OWNED BY org_mashreqbank.playing_with_neon.id;


-- --
-- -- TOC entry 446 (class 1259 OID 540673)
-- -- Name: policies; Type: TABLE; Schema: public; Owner: neondb_owner
-- --

-- CREATE TABLE org_mashreqbank.policies (
--     id integer NOT NULL,
--     policy_id character varying(50) NOT NULL,
--     title character varying(255) NOT NULL,
--     description text,
--     category character varying(100) NOT NULL,
--     owner_id integer,
--     approver_id integer,
--     status character varying(50) DEFAULT 'draft'::character varying,
--     priority character varying(20) DEFAULT 'medium'::character varying,
--     effective_date date,
--     review_date date,
--     next_review_date date,
--     version character varying(20) DEFAULT '1.0'::character varying,
--     content text,
--     tags text[],
--     compliance_frameworks text[],
--     created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
--     updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
--     created_by character varying(255),
--     updated_by character varying(255),
--     CONSTRAINT policies_priority_check CHECK (((priority)::text = ANY ((ARRAY['low'::character varying, 'medium'::character varying, 'high'::character varying, 'critical'::character varying])::text[]))),
--     CONSTRAINT policies_status_check CHECK (((status)::text = ANY ((ARRAY['draft'::character varying, 'review'::character varying, 'approved'::character varying, 'archived'::character varying])::text[])))
-- );


-- ALTER TABLE org_mashreqbank.policies OWNER TO neondb_owner;

-- --
-- -- TOC entry 445 (class 1259 OID 540672)
-- -- Name: policies_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
-- --

-- CREATE SEQUENCE org_mashreqbank.policies_id_seq
--     AS integer
--     START WITH 1
--     INCREMENT BY 1
--     NO MINVALUE
--     NO MAXVALUE
--     CACHE 1;


-- ALTER SEQUENCE org_mashreqbank.policies_id_seq OWNER TO neondb_owner;

-- --
-- -- TOC entry 7078 (class 0 OID 0)
-- -- Dependencies: 445
-- -- Name: policies_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
-- --

-- ALTER SEQUENCE org_mashreqbank.policies_id_seq OWNED BY org_mashreqbank.policies.id;


-- --
-- -- TOC entry 430 (class 1259 OID 532520)
-- -- Name: policy_document_versions; Type: TABLE; Schema: public; Owner: neondb_owner
-- --

-- CREATE TABLE org_mashreqbank.policy_document_versions (
--     id integer NOT NULL,
--     document_id integer,
--     version_number character varying(20) NOT NULL,
--     version_type character varying(20) DEFAULT 'minor'::character varying,
--     content text,
--     summary text,
--     change_log text,
--     file_name character varying(255),
--     file_path character varying(500),
--     file_size bigint,
--     file_type character varying(100),
--     file_hash character varying(128),
--     created_by integer,
--     approved_by integer,
--     approval_date timestamp without time zone,
--     published_date timestamp without time zone,
--     is_current boolean DEFAULT false,
--     status character varying(50) DEFAULT 'draft'::character varying,
--     created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
--     updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
--     CONSTRAINT policy_document_versions_status_check CHECK (((status)::text = ANY ((ARRAY['draft'::character varying, 'review'::character varying, 'approved'::character varying, 'published'::character varying, 'archived'::character varying])::text[]))),
--     CONSTRAINT policy_document_versions_version_type_check CHECK (((version_type)::text = ANY ((ARRAY['major'::character varying, 'minor'::character varying, 'patch'::character varying])::text[])))
-- );


-- ALTER TABLE org_mashreqbank.policy_document_versions OWNER TO neondb_owner;

-- --
-- -- TOC entry 429 (class 1259 OID 532519)
-- -- Name: policy_document_versions_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
-- --

-- CREATE SEQUENCE org_mashreqbank.policy_document_versions_id_seq
--     AS integer
--     START WITH 1
--     INCREMENT BY 1
--     NO MINVALUE
--     NO MAXVALUE
--     CACHE 1;


-- ALTER SEQUENCE org_mashreqbank.policy_document_versions_id_seq OWNER TO neondb_owner;

-- --
-- -- TOC entry 7079 (class 0 OID 0)
-- -- Dependencies: 429
-- -- Name: policy_document_versions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
-- --

-- ALTER SEQUENCE org_mashreqbank.policy_document_versions_id_seq OWNED BY org_mashreqbank.policy_document_versions.id;


-- --
-- -- TOC entry 428 (class 1259 OID 532496)
-- -- Name: policy_documents; Type: TABLE; Schema: public; Owner: neondb_owner
-- --

-- CREATE TABLE org_mashreqbank.policy_documents (
--     id integer NOT NULL,
--     document_number character varying(100) NOT NULL,
--     title character varying(500) NOT NULL,
--     description text,
--     document_type character varying(100),
--     category_id integer,
--     status character varying(50) DEFAULT 'draft'::character varying,
--     priority character varying(20) DEFAULT 'medium'::character varying,
--     owner_id integer,
--     approver_id integer,
--     reviewer_ids integer[],
--     effective_date date,
--     review_date date,
--     expiry_date date,
--     next_review_date date,
--     compliance_frameworks text[],
--     regulatory_references text[],
--     tags text[],
--     keywords text[],
--     business_units text[],
--     geographic_scope text[],
--     current_version_id integer,
--     is_current boolean DEFAULT true,
--     created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
--     updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
--     CONSTRAINT policy_documents_document_type_check CHECK (((document_type)::text = ANY ((ARRAY['policy'::character varying, 'procedure'::character varying, 'standard'::character varying, 'framework'::character varying, 'regulatory'::character varying, 'guideline'::character varying, 'template'::character varying])::text[]))),
--     CONSTRAINT policy_documents_priority_check CHECK (((priority)::text = ANY ((ARRAY['low'::character varying, 'medium'::character varying, 'high'::character varying, 'critical'::character varying])::text[]))),
--     CONSTRAINT policy_documents_status_check CHECK (((status)::text = ANY ((ARRAY['draft'::character varying, 'review'::character varying, 'approved'::character varying, 'published'::character varying, 'archived'::character varying, 'withdrawn'::character varying])::text[])))
-- );


-- ALTER TABLE org_mashreqbank.policy_documents OWNER TO neondb_owner;

-- --
-- -- TOC entry 427 (class 1259 OID 532495)
-- -- Name: policy_documents_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
-- --

-- CREATE SEQUENCE org_mashreqbank.policy_documents_id_seq
--     AS integer
--     START WITH 1
--     INCREMENT BY 1
--     NO MINVALUE
--     NO MAXVALUE
--     CACHE 1;


-- ALTER SEQUENCE org_mashreqbank.policy_documents_id_seq OWNER TO neondb_owner;

-- --
-- -- TOC entry 7080 (class 0 OID 0)
-- -- Dependencies: 427
-- -- Name: policy_documents_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
-- --

-- ALTER SEQUENCE org_mashreqbank.policy_documents_id_seq OWNED BY org_mashreqbank.policy_documents.id;


-- --
-- -- TOC entry 452 (class 1259 OID 540723)
-- -- Name: policy_evidence_links; Type: TABLE; Schema: public; Owner: neondb_owner
-- --

-- CREATE TABLE org_mashreqbank.policy_evidence_links (
--     id integer NOT NULL,
--     policy_id integer,
--     evidence_id integer,
--     relationship_type character varying(100) DEFAULT 'supports'::character varying,
--     created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
--     created_by character varying(255)
-- );


-- ALTER TABLE org_mashreqbank.policy_evidence_links OWNER TO neondb_owner;

-- --
-- -- TOC entry 451 (class 1259 OID 540722)
-- -- Name: policy_evidence_links_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
-- --

-- CREATE SEQUENCE org_mashreqbank.policy_evidence_links_id_seq
--     AS integer
--     START WITH 1
--     INCREMENT BY 1
--     NO MINVALUE
--     NO MAXVALUE
--     CACHE 1;


-- ALTER SEQUENCE org_mashreqbank.policy_evidence_links_id_seq OWNER TO neondb_owner;

-- --
-- -- TOC entry 7081 (class 0 OID 0)
-- -- Dependencies: 451
-- -- Name: policy_evidence_links_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
-- --

-- ALTER SEQUENCE org_mashreqbank.policy_evidence_links_id_seq OWNED BY org_mashreqbank.policy_evidence_links.id;


-- --
-- -- TOC entry 448 (class 1259 OID 540691)
-- -- Name: policy_versions; Type: TABLE; Schema: public; Owner: neondb_owner
-- --

-- CREATE TABLE org_mashreqbank.policy_versions (
--     id integer NOT NULL,
--     policy_id integer,
--     version character varying(20) NOT NULL,
--     content text,
--     changes_summary text,
--     created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
--     created_by character varying(255)
-- );


-- ALTER TABLE org_mashreqbank.policy_versions OWNER TO neondb_owner;

-- --
-- -- TOC entry 447 (class 1259 OID 540690)
-- -- Name: policy_versions_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
-- --

-- CREATE SEQUENCE org_mashreqbank.policy_versions_id_seq
--     AS integer
--     START WITH 1
--     INCREMENT BY 1
--     NO MINVALUE
--     NO MAXVALUE
--     CACHE 1;


-- ALTER SEQUENCE org_mashreqbank.policy_versions_id_seq OWNER TO neondb_owner;

-- --
-- -- TOC entry 7082 (class 0 OID 0)
-- -- Dependencies: 447
-- -- Name: policy_versions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
-- --

-- ALTER SEQUENCE org_mashreqbank.policy_versions_id_seq OWNED BY org_mashreqbank.policy_versions.id;


-- --
-- -- TOC entry 353 (class 1259 OID 278645)
-- -- Name: quiz_attempts; Type: TABLE; Schema: public; Owner: neondb_owner
-- --

-- CREATE TABLE org_mashreqbank.quiz_attempts (
--     id integer NOT NULL,
--     enrollment_id integer,
--     module_id integer,
--     attempt_number integer DEFAULT 1,
--     score integer DEFAULT 0,
--     total_questions integer DEFAULT 0,
--     correct_answers integer DEFAULT 0,
--     time_spent_minutes integer DEFAULT 0,
--     started_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
--     completed_at timestamp without time zone,
--     answers jsonb,
--     passed boolean DEFAULT false
-- );


-- ALTER TABLE org_mashreqbank.quiz_attempts OWNER TO neondb_owner;

-- --
-- -- TOC entry 352 (class 1259 OID 278644)
-- -- Name: quiz_attempts_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
-- --

-- CREATE SEQUENCE org_mashreqbank.quiz_attempts_id_seq
--     AS integer
--     START WITH 1
--     INCREMENT BY 1
--     NO MINVALUE
--     NO MAXVALUE
--     CACHE 1;


-- ALTER SEQUENCE org_mashreqbank.quiz_attempts_id_seq OWNER TO neondb_owner;

-- --
-- -- TOC entry 7083 (class 0 OID 0)
-- -- Dependencies: 352
-- -- Name: quiz_attempts_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
-- --

-- ALTER SEQUENCE org_mashreqbank.quiz_attempts_id_seq OWNED BY org_mashreqbank.quiz_attempts.id;


-- --
-- -- TOC entry 347 (class 1259 OID 278582)
-- -- Name: quiz_questions; Type: TABLE; Schema: public; Owner: neondb_owner
-- --

-- CREATE TABLE org_mashreqbank.quiz_questions (
--     id integer NOT NULL,
--     module_id integer,
--     question text NOT NULL,
--     question_type character varying(50) DEFAULT 'multiple_choice'::character varying,
--     options jsonb,
--     correct_answer text NOT NULL,
--     explanation text,
--     points integer DEFAULT 1,
--     question_order integer DEFAULT 1,
--     is_active boolean DEFAULT true,
--     created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
-- );


-- ALTER TABLE org_mashreqbank.quiz_questions OWNER TO neondb_owner;

-- --
-- -- TOC entry 346 (class 1259 OID 278581)
-- -- Name: quiz_questions_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
-- --

-- CREATE SEQUENCE org_mashreqbank.quiz_questions_id_seq
--     AS integer
--     START WITH 1
--     INCREMENT BY 1
--     NO MINVALUE
--     NO MAXVALUE
--     CACHE 1;


-- ALTER SEQUENCE org_mashreqbank.quiz_questions_id_seq OWNER TO neondb_owner;

-- --
-- -- TOC entry 7084 (class 0 OID 0)
-- -- Dependencies: 346
-- -- Name: quiz_questions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
-- --

-- ALTER SEQUENCE org_mashreqbank.quiz_questions_id_seq OWNED BY org_mashreqbank.quiz_questions.id;


-- --
-- -- TOC entry 373 (class 1259 OID 294913)
-- -- Name: report_downloads; Type: TABLE; Schema: public; Owner: neondb_owner
-- --

-- CREATE TABLE org_mashreqbank.report_downloads (
--     id integer NOT NULL,
--     filename character varying(255) NOT NULL,
--     report_type character varying(50) NOT NULL,
--     report_data jsonb NOT NULL,
--     created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
--     expires_at timestamp without time zone NOT NULL,
--     download_count integer DEFAULT 0,
--     last_downloaded_at timestamp without time zone
-- );


-- ALTER TABLE org_mashreqbank.report_downloads OWNER TO neondb_owner;

-- --
-- -- TOC entry 7085 (class 0 OID 0)
-- -- Dependencies: 373
-- -- Name: TABLE report_downloads; Type: COMMENT; Schema: public; Owner: neondb_owner
-- --

-- COMMENT ON TABLE org_mashreqbank.report_downloads IS 'Stores generated reports for download with expiration';


-- --
-- -- TOC entry 7086 (class 0 OID 0)
-- -- Dependencies: 373
-- -- Name: COLUMN report_downloads.filename; Type: COMMENT; Schema: public; Owner: neondb_owner
-- --

-- COMMENT ON COLUMN org_mashreqbank.report_downloads.filename IS 'Unique filename for the report';


-- --
-- -- TOC entry 7087 (class 0 OID 0)
-- -- Dependencies: 373
-- -- Name: COLUMN report_downloads.report_type; Type: COMMENT; Schema: public; Owner: neondb_owner
-- --

-- COMMENT ON COLUMN org_mashreqbank.report_downloads.report_type IS 'Type of report (pdf, csv, excel, etc.)';


-- --
-- -- TOC entry 7088 (class 0 OID 0)
-- -- Dependencies: 373
-- -- Name: COLUMN report_downloads.report_data; Type: COMMENT; Schema: public; Owner: neondb_owner
-- --

-- COMMENT ON COLUMN org_mashreqbank.report_downloads.report_data IS 'JSON data containing the report content';


-- --
-- -- TOC entry 7089 (class 0 OID 0)
-- -- Dependencies: 373
-- -- Name: COLUMN report_downloads.expires_at; Type: COMMENT; Schema: public; Owner: neondb_owner
-- --

-- COMMENT ON COLUMN org_mashreqbank.report_downloads.expires_at IS 'When the report download link expires';


-- --
-- -- TOC entry 372 (class 1259 OID 294912)
-- -- Name: report_downloads_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
-- --

-- CREATE SEQUENCE org_mashreqbank.report_downloads_id_seq
--     AS integer
--     START WITH 1
--     INCREMENT BY 1
--     NO MINVALUE
--     NO MAXVALUE
--     CACHE 1;


-- ALTER SEQUENCE org_mashreqbank.report_downloads_id_seq OWNER TO neondb_owner;

-- --
-- -- TOC entry 7090 (class 0 OID 0)
-- -- Dependencies: 372
-- -- Name: report_downloads_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
-- --

-- ALTER SEQUENCE org_mashreqbank.report_downloads_id_seq OWNED BY org_mashreqbank.report_downloads.id;


-- --
-- -- TOC entry 309 (class 1259 OID 131126)
-- -- Name: residual_risk_calculations; Type: TABLE; Schema: public; Owner: neondb_owner
-- --

-- CREATE TABLE org_mashreqbank.residual_risk_calculations (
--     id integer NOT NULL,
--     risk_scenario_id integer,
--     inherent_likelihood integer NOT NULL,
--     inherent_impact integer NOT NULL,
--     inherent_risk_score integer NOT NULL,
--     control_effectiveness_factor numeric(3,2) DEFAULT 1.00,
--     residual_likelihood integer NOT NULL,
--     residual_impact integer NOT NULL,
--     residual_risk_score integer NOT NULL,
--     risk_reduction_percentage numeric(5,2),
--     calculation_method character varying(100) DEFAULT 'ISO 27001 Standard'::character varying,
--     calculated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
--     calculated_by character varying(255)
-- );


-- ALTER TABLE org_mashreqbank.residual_risk_calculations OWNER TO neondb_owner;

-- --
-- -- TOC entry 308 (class 1259 OID 131125)
-- -- Name: residual_risk_calculations_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
-- --

-- CREATE SEQUENCE org_mashreqbank.residual_risk_calculations_id_seq
--     AS integer
--     START WITH 1
--     INCREMENT BY 1
--     NO MINVALUE
--     NO MAXVALUE
--     CACHE 1;


-- ALTER SEQUENCE org_mashreqbank.residual_risk_calculations_id_seq OWNER TO neondb_owner;

-- --
-- -- TOC entry 7091 (class 0 OID 0)
-- -- Dependencies: 308
-- -- Name: residual_risk_calculations_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
-- --

-- ALTER SEQUENCE org_mashreqbank.residual_risk_calculations_id_seq OWNED BY org_mashreqbank.residual_risk_calculations.id;


-- --
-- -- TOC entry 381 (class 1259 OID 311338)
-- -- Name: risk_action_plans; Type: TABLE; Schema: public; Owner: neondb_owner
-- --

-- CREATE TABLE org_mashreqbank.risk_action_plans (
--     id integer NOT NULL,
--     risk_assessment_id integer,
--     action_title character varying(255) NOT NULL,
--     action_description text,
--     action_type character varying(50),
--     priority character varying(20),
--     assigned_to character varying(255),
--     assigned_email character varying(255),
--     assigned_department character varying(255),
--     start_date date,
--     due_date date,
--     completion_date date,
--     status character varying(50) DEFAULT 'Not Started'::character varying,
--     progress_percentage integer DEFAULT 0,
--     estimated_cost numeric(12,2),
--     actual_cost numeric(12,2),
--     resources_required text,
--     progress_notes text,
--     last_update_date date,
--     created_by character varying(255),
--     updated_by character varying(255),
--     created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
--     updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
--     CONSTRAINT risk_action_plans_action_type_check CHECK (((action_type)::text = ANY ((ARRAY['Preventive'::character varying, 'Detective'::character varying, 'Corrective'::character varying, 'Compensating'::character varying])::text[]))),
--     CONSTRAINT risk_action_plans_priority_check CHECK (((priority)::text = ANY ((ARRAY['Critical'::character varying, 'High'::character varying, 'Medium'::character varying, 'Low'::character varying])::text[]))),
--     CONSTRAINT risk_action_plans_progress_percentage_check CHECK (((progress_percentage >= 0) AND (progress_percentage <= 100))),
--     CONSTRAINT risk_action_plans_status_check CHECK (((status)::text = ANY ((ARRAY['Not Started'::character varying, 'In Progress'::character varying, 'Completed'::character varying, 'On Hold'::character varying, 'Cancelled'::character varying])::text[])))
-- );


-- ALTER TABLE org_mashreqbank.risk_action_plans OWNER TO neondb_owner;

-- --
-- -- TOC entry 380 (class 1259 OID 311337)
-- -- Name: risk_action_plans_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
-- --

-- CREATE SEQUENCE org_mashreqbank.risk_action_plans_id_seq
--     AS integer
--     START WITH 1
--     INCREMENT BY 1
--     NO MINVALUE
--     NO MAXVALUE
--     CACHE 1;


-- ALTER SEQUENCE org_mashreqbank.risk_action_plans_id_seq OWNER TO neondb_owner;

-- --
-- -- TOC entry 7092 (class 0 OID 0)
-- -- Dependencies: 380
-- -- Name: risk_action_plans_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
-- --

-- ALTER SEQUENCE org_mashreqbank.risk_action_plans_id_seq OWNED BY org_mashreqbank.risk_action_plans.id;


-- --
-- -- TOC entry 279 (class 1259 OID 114734)
-- -- Name: risk_assessment_context; Type: TABLE; Schema: public; Owner: neondb_owner
-- --

-- CREATE TABLE org_mashreqbank.risk_assessment_context (
--     id integer NOT NULL,
--     workflow_id integer,
--     business_objectives text,
--     regulatory_requirements text,
--     stakeholder_expectations text,
--     risk_appetite text,
--     risk_tolerance text,
--     internal_context text,
--     external_context text,
--     created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
-- );


-- ALTER TABLE org_mashreqbank.risk_assessment_context OWNER TO neondb_owner;

-- --
-- -- TOC entry 278 (class 1259 OID 114733)
-- -- Name: risk_assessment_context_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
-- --

-- CREATE SEQUENCE org_mashreqbank.risk_assessment_context_id_seq
--     AS integer
--     START WITH 1
--     INCREMENT BY 1
--     NO MINVALUE
--     NO MAXVALUE
--     CACHE 1;


-- ALTER SEQUENCE org_mashreqbank.risk_assessment_context_id_seq OWNER TO neondb_owner;

-- --
-- -- TOC entry 7093 (class 0 OID 0)
-- -- Dependencies: 278
-- -- Name: risk_assessment_context_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
-- --

-- ALTER SEQUENCE org_mashreqbank.risk_assessment_context_id_seq OWNED BY org_mashreqbank.risk_assessment_context.id;


-- --
-- -- TOC entry 379 (class 1259 OID 311320)
-- -- Name: risk_assessment_controls; Type: TABLE; Schema: public; Owner: neondb_owner
-- --

-- CREATE TABLE org_mashreqbank.risk_assessment_controls (
--     id integer NOT NULL,
--     risk_assessment_id integer,
--     control_id integer,
--     sub_control_id integer,
--     implementation_status character varying(50),
--     implementation_notes text,
--     effectiveness_rating integer,
--     created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
--     updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
--     CONSTRAINT risk_assessment_controls_effectiveness_rating_check CHECK (((effectiveness_rating >= 1) AND (effectiveness_rating <= 5))),
--     CONSTRAINT risk_assessment_controls_implementation_status_check CHECK (((implementation_status)::text = ANY ((ARRAY['Not Started'::character varying, 'In Progress'::character varying, 'Implemented'::character varying, 'Not Applicable'::character varying])::text[])))
-- );


-- ALTER TABLE org_mashreqbank.risk_assessment_controls OWNER TO neondb_owner;

-- --
-- -- TOC entry 378 (class 1259 OID 311319)
-- -- Name: risk_assessment_controls_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
-- --

-- CREATE SEQUENCE org_mashreqbank.risk_assessment_controls_id_seq
--     AS integer
--     START WITH 1
--     INCREMENT BY 1
--     NO MINVALUE
--     NO MAXVALUE
--     CACHE 1;


-- ALTER SEQUENCE org_mashreqbank.risk_assessment_controls_id_seq OWNER TO neondb_owner;

-- --
-- -- TOC entry 7094 (class 0 OID 0)
-- -- Dependencies: 378
-- -- Name: risk_assessment_controls_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
-- --

-- ALTER SEQUENCE org_mashreqbank.risk_assessment_controls_id_seq OWNED BY org_mashreqbank.risk_assessment_controls.id;


-- --
-- -- TOC entry 281 (class 1259 OID 114749)
-- -- Name: risk_assessment_criteria; Type: TABLE; Schema: public; Owner: neondb_owner
-- --

-- CREATE TABLE org_mashreqbank.risk_assessment_criteria (
--     id integer NOT NULL,
--     workflow_id integer,
--     likelihood_scale jsonb,
--     impact_scale jsonb,
--     risk_matrix jsonb,
--     acceptance_criteria text,
--     escalation_criteria text,
--     created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
-- );


-- ALTER TABLE org_mashreqbank.risk_assessment_criteria OWNER TO neondb_owner;

-- --
-- -- TOC entry 280 (class 1259 OID 114748)
-- -- Name: risk_assessment_criteria_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
-- --

-- CREATE SEQUENCE org_mashreqbank.risk_assessment_criteria_id_seq
--     AS integer
--     START WITH 1
--     INCREMENT BY 1
--     NO MINVALUE
--     NO MAXVALUE
--     CACHE 1;


-- ALTER SEQUENCE org_mashreqbank.risk_assessment_criteria_id_seq OWNER TO neondb_owner;

-- --
-- -- TOC entry 7095 (class 0 OID 0)
-- -- Dependencies: 280
-- -- Name: risk_assessment_criteria_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
-- --

-- ALTER SEQUENCE org_mashreqbank.risk_assessment_criteria_id_seq OWNED BY org_mashreqbank.risk_assessment_criteria.id;


-- --
-- -- TOC entry 269 (class 1259 OID 98385)
-- -- Name: risk_assessment_history; Type: TABLE; Schema: public; Owner: neondb_owner
-- --

-- CREATE TABLE org_mashreqbank.risk_assessment_history (
--     id integer NOT NULL,
--     assessment_id integer NOT NULL,
--     field_name character varying(100) NOT NULL,
--     old_value text,
--     new_value text,
--     change_reason text,
--     changed_by character varying(255) NOT NULL,
--     changed_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
-- );


-- ALTER TABLE org_mashreqbank.risk_assessment_history OWNER TO neondb_owner;

-- --
-- -- TOC entry 268 (class 1259 OID 98384)
-- -- Name: risk_assessment_history_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
-- --

-- CREATE SEQUENCE org_mashreqbank.risk_assessment_history_id_seq
--     AS integer
--     START WITH 1
--     INCREMENT BY 1
--     NO MINVALUE
--     NO MAXVALUE
--     CACHE 1;


-- ALTER SEQUENCE org_mashreqbank.risk_assessment_history_id_seq OWNER TO neondb_owner;

-- --
-- -- TOC entry 7096 (class 0 OID 0)
-- -- Dependencies: 268
-- -- Name: risk_assessment_history_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
-- --

-- ALTER SEQUENCE org_mashreqbank.risk_assessment_history_id_seq OWNED BY org_mashreqbank.risk_assessment_history.id;


-- --
-- -- TOC entry 285 (class 1259 OID 114784)
-- -- Name: risk_assessment_reviews; Type: TABLE; Schema: public; Owner: neondb_owner
-- --

-- CREATE TABLE org_mashreqbank.risk_assessment_reviews (
--     id integer NOT NULL,
--     workflow_id integer,
--     reviewer_name character varying(255),
--     reviewer_role character varying(100),
--     review_date date,
--     review_status character varying(50),
--     comments text,
--     recommendations text,
--     created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
-- );


-- ALTER TABLE org_mashreqbank.risk_assessment_reviews OWNER TO neondb_owner;

-- --
-- -- TOC entry 284 (class 1259 OID 114783)
-- -- Name: risk_assessment_reviews_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
-- --

-- CREATE SEQUENCE org_mashreqbank.risk_assessment_reviews_id_seq
--     AS integer
--     START WITH 1
--     INCREMENT BY 1
--     NO MINVALUE
--     NO MAXVALUE
--     CACHE 1;


-- ALTER SEQUENCE org_mashreqbank.risk_assessment_reviews_id_seq OWNER TO neondb_owner;

-- --
-- -- TOC entry 7097 (class 0 OID 0)
-- -- Dependencies: 284
-- -- Name: risk_assessment_reviews_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
-- --

-- ALTER SEQUENCE org_mashreqbank.risk_assessment_reviews_id_seq OWNED BY org_mashreqbank.risk_assessment_reviews.id;


-- --
-- -- TOC entry 277 (class 1259 OID 114719)
-- -- Name: risk_assessment_scope; Type: TABLE; Schema: public; Owner: neondb_owner
-- --

-- CREATE TABLE org_mashreqbank.risk_assessment_scope (
--     id integer NOT NULL,
--     workflow_id integer,
--     scope_type character varying(100),
--     scope_name character varying(255),
--     scope_description text,
--     inclusion_criteria text,
--     exclusion_criteria text,
--     business_impact character varying(50),
--     created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
-- );


-- ALTER TABLE org_mashreqbank.risk_assessment_scope OWNER TO neondb_owner;

-- --
-- -- TOC entry 276 (class 1259 OID 114718)
-- -- Name: risk_assessment_scope_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
-- --

-- CREATE SEQUENCE org_mashreqbank.risk_assessment_scope_id_seq
--     AS integer
--     START WITH 1
--     INCREMENT BY 1
--     NO MINVALUE
--     NO MAXVALUE
--     CACHE 1;


-- ALTER SEQUENCE org_mashreqbank.risk_assessment_scope_id_seq OWNER TO neondb_owner;

-- --
-- -- TOC entry 7098 (class 0 OID 0)
-- -- Dependencies: 276
-- -- Name: risk_assessment_scope_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
-- --

-- ALTER SEQUENCE org_mashreqbank.risk_assessment_scope_id_seq OWNED BY org_mashreqbank.risk_assessment_scope.id;


-- --
-- -- TOC entry 275 (class 1259 OID 114703)
-- -- Name: risk_assessment_steps; Type: TABLE; Schema: public; Owner: neondb_owner
-- --

-- CREATE TABLE org_mashreqbank.risk_assessment_steps (
--     id integer NOT NULL,
--     workflow_id integer,
--     step_number integer NOT NULL,
--     step_name character varying(255) NOT NULL,
--     step_description text,
--     status character varying(50) DEFAULT 'Pending'::character varying,
--     assigned_to character varying(255),
--     started_at timestamp without time zone,
--     completed_at timestamp without time zone,
--     notes text,
--     created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
-- );


-- ALTER TABLE org_mashreqbank.risk_assessment_steps OWNER TO neondb_owner;

-- --
-- -- TOC entry 274 (class 1259 OID 114702)
-- -- Name: risk_assessment_steps_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
-- --

-- CREATE SEQUENCE org_mashreqbank.risk_assessment_steps_id_seq
--     AS integer
--     START WITH 1
--     INCREMENT BY 1
--     NO MINVALUE
--     NO MAXVALUE
--     CACHE 1;


-- ALTER SEQUENCE org_mashreqbank.risk_assessment_steps_id_seq OWNER TO neondb_owner;

-- --
-- -- TOC entry 7099 (class 0 OID 0)
-- -- Dependencies: 274
-- -- Name: risk_assessment_steps_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
-- --

-- ALTER SEQUENCE org_mashreqbank.risk_assessment_steps_id_seq OWNED BY org_mashreqbank.risk_assessment_steps.id;


-- --
-- -- TOC entry 382 (class 1259 OID 311375)
-- -- Name: risk_assessment_summary; Type: VIEW; Schema: public; Owner: neondb_owner
-- --

-- CREATE VIEW org_mashreqbank.risk_assessment_summary AS
-- SELECT
--     NULL::integer AS id,
--     NULL::character varying(50) AS risk_id,
--     NULL::character varying(255) AS risk_title,
--     NULL::character varying(100) AS risk_category,
--     NULL::character varying(20) AS inherent_risk_level,
--     NULL::integer AS inherent_risk_score,
--     NULL::character varying(20) AS residual_risk_level,
--     NULL::integer AS residual_risk_score,
--     NULL::character varying(20) AS risk_status,
--     NULL::character varying(255) AS risk_owner_name,
--     NULL::date AS next_review_date,
--     NULL::character varying(255) AS asset_name,
--     NULL::bigint AS action_plan_count,
--     NULL::bigint AS completed_actions,
--     NULL::bigint AS overdue_actions;


-- ALTER VIEW org_mashreqbank.risk_assessment_summary OWNER TO neondb_owner;

-- --
-- -- TOC entry 287 (class 1259 OID 114799)
-- -- Name: risk_assessment_templates; Type: TABLE; Schema: public; Owner: neondb_owner
-- --

-- CREATE TABLE org_mashreqbank.risk_assessment_templates (
--     id integer NOT NULL,
--     template_name character varying(255) NOT NULL,
--     methodology character varying(100) NOT NULL,
--     description text,
--     default_steps jsonb,
--     default_criteria jsonb,
--     is_active boolean DEFAULT true,
--     created_by character varying(255),
--     created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
-- );


-- ALTER TABLE org_mashreqbank.risk_assessment_templates OWNER TO neondb_owner;

-- --
-- -- TOC entry 286 (class 1259 OID 114798)
-- -- Name: risk_assessment_templates_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
-- --

-- CREATE SEQUENCE org_mashreqbank.risk_assessment_templates_id_seq
--     AS integer
--     START WITH 1
--     INCREMENT BY 1
--     NO MINVALUE
--     NO MAXVALUE
--     CACHE 1;


-- ALTER SEQUENCE org_mashreqbank.risk_assessment_templates_id_seq OWNER TO neondb_owner;

-- --
-- -- TOC entry 7100 (class 0 OID 0)
-- -- Dependencies: 286
-- -- Name: risk_assessment_templates_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
-- --

-- ALTER SEQUENCE org_mashreqbank.risk_assessment_templates_id_seq OWNED BY org_mashreqbank.risk_assessment_templates.id;


-- --
-- -- TOC entry 273 (class 1259 OID 114689)
-- -- Name: risk_assessment_workflows; Type: TABLE; Schema: public; Owner: neondb_owner
-- --

-- CREATE TABLE org_mashreqbank.risk_assessment_workflows (
--     id integer NOT NULL,
--     workflow_id character varying(50) NOT NULL,
--     workflow_name character varying(255) NOT NULL,
--     description text,
--     methodology character varying(100) NOT NULL,
--     scope text,
--     assessment_type character varying(100),
--     status character varying(50) DEFAULT 'Draft'::character varying,
--     created_by character varying(255),
--     assigned_to character varying(255),
--     start_date date,
--     target_completion_date date,
--     actual_completion_date date,
--     approval_date date,
--     approved_by character varying(255),
--     executive_summary text,
--     overall_risk_rating character varying(50),
--     recommendations text,
--     next_review_date date,
--     created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
--     updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
-- );


-- ALTER TABLE org_mashreqbank.risk_assessment_workflows OWNER TO neondb_owner;

-- --
-- -- TOC entry 272 (class 1259 OID 114688)
-- -- Name: risk_assessment_workflows_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
-- --

-- CREATE SEQUENCE org_mashreqbank.risk_assessment_workflows_id_seq
--     AS integer
--     START WITH 1
--     INCREMENT BY 1
--     NO MINVALUE
--     NO MAXVALUE
--     CACHE 1;


-- ALTER SEQUENCE org_mashreqbank.risk_assessment_workflows_id_seq OWNER TO neondb_owner;

-- --
-- -- TOC entry 7101 (class 0 OID 0)
-- -- Dependencies: 272
-- -- Name: risk_assessment_workflows_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
-- --

-- ALTER SEQUENCE org_mashreqbank.risk_assessment_workflows_id_seq OWNED BY org_mashreqbank.risk_assessment_workflows.id;


-- --
-- -- TOC entry 401 (class 1259 OID 409914)
-- -- Name: risk_assessments; Type: TABLE; Schema: public; Owner: neondb_owner
-- --

-- CREATE TABLE org_mashreqbank.risk_assessments (
--     id uuid DEFAULT gen_random_uuid() NOT NULL,
--     title character varying(255) NOT NULL,
--     description text,
--     assessment_type character varying(50) DEFAULT 'standard'::character varying NOT NULL,
--     status character varying(50) DEFAULT 'draft'::character varying NOT NULL,
--     priority character varying(20) DEFAULT 'medium'::character varying NOT NULL,
--     framework_id uuid,
--     category_id uuid,
--     assessor_id uuid,
--     reviewer_id uuid,
--     department character varying(100),
--     business_unit character varying(100),
--     assessment_date date,
--     review_date date,
--     next_review_date date,
--     inherent_risk_score integer DEFAULT 0,
--     residual_risk_score integer DEFAULT 0,
--     risk_appetite_threshold integer DEFAULT 15,
--     created_by uuid,
--     created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
--     updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
-- );


-- ALTER TABLE org_mashreqbank.risk_assessments OWNER TO neondb_owner;

-- --
-- -- TOC entry 384 (class 1259 OID 327716)
-- -- Name: risk_asset_relationships; Type: TABLE; Schema: public; Owner: neondb_owner
-- --

-- CREATE TABLE org_mashreqbank.risk_asset_relationships (
--     id integer NOT NULL,
--     risk_assessment_id integer NOT NULL,
--     information_asset_id integer NOT NULL,
--     relationship_type character varying(50) DEFAULT 'affected_by'::character varying,
--     impact_level character varying(20) DEFAULT 'Medium'::character varying,
--     created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
--     created_by character varying(255) DEFAULT 'System'::character varying,
--     updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
--     updated_by character varying(255) DEFAULT 'System'::character varying
-- );


-- ALTER TABLE org_mashreqbank.risk_asset_relationships OWNER TO neondb_owner;

-- --
-- -- TOC entry 383 (class 1259 OID 327715)
-- -- Name: risk_asset_relationships_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
-- --

-- CREATE SEQUENCE org_mashreqbank.risk_asset_relationships_id_seq
--     AS integer
--     START WITH 1
--     INCREMENT BY 1
--     NO MINVALUE
--     NO MAXVALUE
--     CACHE 1;


-- ALTER SEQUENCE org_mashreqbank.risk_asset_relationships_id_seq OWNER TO neondb_owner;

-- --
-- -- TOC entry 7102 (class 0 OID 0)
-- -- Dependencies: 383
-- -- Name: risk_asset_relationships_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
-- --

-- ALTER SEQUENCE org_mashreqbank.risk_asset_relationships_id_seq OWNED BY org_mashreqbank.risk_asset_relationships.id;


-- --
-- -- TOC entry 399 (class 1259 OID 409888)
-- -- Name: risk_categories; Type: TABLE; Schema: public; Owner: neondb_owner
-- --

-- CREATE TABLE org_mashreqbank.risk_categories (
--     id uuid DEFAULT gen_random_uuid() NOT NULL,
--     category_name character varying(100) NOT NULL,
--     description text,
--     color character varying(7) DEFAULT '#6366f1'::character varying,
--     created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
--     updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
--     category_id integer NOT NULL
-- );


-- ALTER TABLE org_mashreqbank.risk_categories OWNER TO neondb_owner;

-- --
-- -- TOC entry 390 (class 1259 OID 360465)
-- -- Name: risk_control_mappings; Type: TABLE; Schema: public; Owner: neondb_owner
-- --

-- CREATE TABLE org_mashreqbank.risk_control_mappings (
--     id integer NOT NULL,
--     risk_id integer NOT NULL,
--     iso27002_control_id integer NOT NULL,
--     control_effectiveness character varying(20),
--     implementation_status character varying(20),
--     testing_frequency character varying(20),
--     last_tested_date date,
--     next_test_date date,
--     control_owner character varying(100),
--     notes text,
--     created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
--     updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
--     CONSTRAINT risk_control_mappings_control_effectiveness_check CHECK (((control_effectiveness)::text = ANY ((ARRAY['Effective'::character varying, 'Partially Effective'::character varying, 'Ineffective'::character varying, 'Not Tested'::character varying])::text[]))),
--     CONSTRAINT risk_control_mappings_implementation_status_check CHECK (((implementation_status)::text = ANY ((ARRAY['Planned'::character varying, 'In Progress'::character varying, 'Implemented'::character varying, 'Not Applicable'::character varying])::text[]))),
--     CONSTRAINT risk_control_mappings_testing_frequency_check CHECK (((testing_frequency)::text = ANY ((ARRAY['Monthly'::character varying, 'Quarterly'::character varying, 'Semi-Annual'::character varying, 'Annual'::character varying])::text[])))
-- );


-- ALTER TABLE org_mashreqbank.risk_control_mappings OWNER TO neondb_owner;

-- --
-- -- TOC entry 389 (class 1259 OID 360464)
-- -- Name: risk_control_mappings_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
-- --

-- CREATE SEQUENCE org_mashreqbank.risk_control_mappings_id_seq
--     AS integer
--     START WITH 1
--     INCREMENT BY 1
--     NO MINVALUE
--     NO MAXVALUE
--     CACHE 1;


-- ALTER SEQUENCE org_mashreqbank.risk_control_mappings_id_seq OWNER TO neondb_owner;

-- --
-- -- TOC entry 7103 (class 0 OID 0)
-- -- Dependencies: 389
-- -- Name: risk_control_mappings_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
-- --

-- ALTER SEQUENCE org_mashreqbank.risk_control_mappings_id_seq OWNED BY org_mashreqbank.risk_control_mappings.id;


-- --
-- -- TOC entry 403 (class 1259 OID 409972)
-- -- Name: risk_controls; Type: TABLE; Schema: public; Owner: neondb_owner
-- --

-- CREATE TABLE org_mashreqbank.risk_controls (
--     id uuid DEFAULT gen_random_uuid() NOT NULL,
--     assessment_id uuid,
--     control_type character varying(50) NOT NULL,
--     control_name character varying(255) NOT NULL,
--     control_description text,
--     implementation_status character varying(50) DEFAULT 'planned'::character varying,
--     effectiveness_rating character varying(20) DEFAULT 'moderate'::character varying,
--     owner_id uuid,
--     implementation_date date,
--     review_frequency character varying(50),
--     cost_estimate numeric(12,2),
--     created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
-- );


-- ALTER TABLE org_mashreqbank.risk_controls OWNER TO neondb_owner;

-- --
-- -- TOC entry 402 (class 1259 OID 409955)
-- -- Name: risk_factors; Type: TABLE; Schema: public; Owner: neondb_owner
-- --

-- CREATE TABLE org_mashreqbank.risk_factors (
--     id uuid DEFAULT gen_random_uuid() NOT NULL,
--     assessment_id uuid,
--     factor_type character varying(50) NOT NULL,
--     name character varying(255) NOT NULL,
--     description text,
--     likelihood_score integer,
--     impact_score integer,
--     current_controls text,
--     control_effectiveness character varying(20) DEFAULT 'moderate'::character varying,
--     created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
--     CONSTRAINT risk_factors_impact_score_check CHECK (((impact_score >= 1) AND (impact_score <= 5))),
--     CONSTRAINT risk_factors_likelihood_score_check CHECK (((likelihood_score >= 1) AND (likelihood_score <= 5)))
-- );


-- ALTER TABLE org_mashreqbank.risk_factors OWNER TO neondb_owner;

-- --
-- -- TOC entry 400 (class 1259 OID 409901)
-- -- Name: risk_frameworks; Type: TABLE; Schema: public; Owner: neondb_owner
-- --

-- CREATE TABLE org_mashreqbank.risk_frameworks (
--     id uuid DEFAULT gen_random_uuid() NOT NULL,
--     name character varying(100) NOT NULL,
--     description text,
--     version character varying(20),
--     is_active boolean DEFAULT true,
--     created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
--     updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
-- );


-- ALTER TABLE org_mashreqbank.risk_frameworks OWNER TO neondb_owner;

-- --
-- -- TOC entry 391 (class 1259 OID 360656)
-- -- Name: risk_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
-- --

-- CREATE SEQUENCE org_mashreqbank.risk_id_seq
--     START WITH 1
--     INCREMENT BY 1
--     NO MINVALUE
--     NO MAXVALUE
--     CACHE 1;


-- ALTER SEQUENCE org_mashreqbank.risk_id_seq OWNER TO neondb_owner;

-- --
-- -- TOC entry 407 (class 1259 OID 410061)
-- -- Name: risk_incidents; Type: TABLE; Schema: public; Owner: neondb_owner
-- --

-- CREATE TABLE org_mashreqbank.risk_incidents (
--     id uuid DEFAULT gen_random_uuid() NOT NULL,
--     incident_number character varying(50) NOT NULL,
--     title character varying(255) NOT NULL,
--     description text,
--     risk_assessment_id uuid,
--     category_id uuid,
--     severity character varying(20) DEFAULT 'medium'::character varying NOT NULL,
--     status character varying(50) DEFAULT 'open'::character varying NOT NULL,
--     priority character varying(20) DEFAULT 'medium'::character varying NOT NULL,
--     impact_level character varying(20) DEFAULT 'medium'::character varying,
--     likelihood character varying(20) DEFAULT 'medium'::character varying,
--     incident_date timestamp with time zone NOT NULL,
--     discovered_date timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
--     reported_by uuid,
--     assigned_to uuid,
--     department character varying(100),
--     business_unit character varying(100),
--     estimated_cost numeric(12,2) DEFAULT 0,
--     actual_cost numeric(12,2) DEFAULT 0,
--     target_resolution_date timestamp with time zone,
--     actual_resolution_date timestamp with time zone,
--     root_cause text,
--     contributing_factors text,
--     lessons_learned text,
--     created_by uuid,
--     created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
--     updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
-- );


-- ALTER TABLE org_mashreqbank.risk_incidents OWNER TO neondb_owner;

-- --
-- -- TOC entry 271 (class 1259 OID 98400)
-- -- Name: risk_key_indicators; Type: TABLE; Schema: public; Owner: neondb_owner
-- --

-- CREATE TABLE org_mashreqbank.risk_key_indicators (
--     id integer NOT NULL,
--     assessment_id integer NOT NULL,
--     indicator_name character varying(255) NOT NULL,
--     indicator_description text,
--     measurement_unit character varying(50),
--     target_value numeric(15,4),
--     warning_threshold numeric(15,4),
--     critical_threshold numeric(15,4),
--     current_value numeric(15,4),
--     measurement_frequency character varying(50),
--     data_source character varying(255),
--     responsible_party character varying(255),
--     last_measured_date date,
--     status character varying(50) DEFAULT 'Active'::character varying,
--     created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
--     updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
--     CONSTRAINT risk_key_indicators_measurement_frequency_check CHECK (((measurement_frequency)::text = ANY ((ARRAY['Real-time'::character varying, 'Daily'::character varying, 'Weekly'::character varying, 'Monthly'::character varying, 'Quarterly'::character varying])::text[]))),
--     CONSTRAINT risk_key_indicators_status_check CHECK (((status)::text = ANY ((ARRAY['Active'::character varying, 'Inactive'::character varying, 'Under Review'::character varying])::text[])))
-- );


-- ALTER TABLE org_mashreqbank.risk_key_indicators OWNER TO neondb_owner;

-- --
-- -- TOC entry 270 (class 1259 OID 98399)
-- -- Name: risk_key_indicators_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
-- --

-- CREATE SEQUENCE org_mashreqbank.risk_key_indicators_id_seq
--     AS integer
--     START WITH 1
--     INCREMENT BY 1
--     NO MINVALUE
--     NO MAXVALUE
--     CACHE 1;


-- ALTER SEQUENCE org_mashreqbank.risk_key_indicators_id_seq OWNER TO neondb_owner;

-- --
-- -- TOC entry 7104 (class 0 OID 0)
-- -- Dependencies: 270
-- -- Name: risk_key_indicators_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
-- --

-- ALTER SEQUENCE org_mashreqbank.risk_key_indicators_id_seq OWNED BY org_mashreqbank.risk_key_indicators.id;


-- --
-- -- TOC entry 404 (class 1259 OID 409993)
-- -- Name: risk_mitigation_plans; Type: TABLE; Schema: public; Owner: neondb_owner
-- --

-- CREATE TABLE org_mashreqbank.risk_mitigation_plans (
--     id uuid DEFAULT gen_random_uuid() NOT NULL,
--     assessment_id uuid,
--     strategy character varying(50) NOT NULL,
--     action_plan text,
--     responsible_party_id uuid,
--     target_completion_date date,
--     budget_allocated numeric(12,2),
--     status character varying(50) DEFAULT 'planned'::character varying,
--     progress_percentage integer DEFAULT 0,
--     created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
-- );


-- ALTER TABLE org_mashreqbank.risk_mitigation_plans OWNER TO neondb_owner;

-- --
-- -- TOC entry 267 (class 1259 OID 98360)
-- -- Name: risk_treatment_actions; Type: TABLE; Schema: public; Owner: neondb_owner
-- --

-- CREATE TABLE org_mashreqbank.risk_treatment_actions (
--     id integer NOT NULL,
--     assessment_id integer NOT NULL,
--     action_title character varying(255) NOT NULL,
--     action_description text NOT NULL,
--     action_type character varying(50) NOT NULL,
--     assigned_to character varying(255) NOT NULL,
--     due_date date NOT NULL,
--     status character varying(50) DEFAULT 'Not Started'::character varying,
--     priority character varying(20) NOT NULL,
--     estimated_cost numeric(12,2) DEFAULT 0,
--     actual_cost numeric(12,2),
--     estimated_effort_hours integer DEFAULT 0,
--     actual_effort_hours integer,
--     completion_percentage integer DEFAULT 0,
--     completion_date date,
--     effectiveness_rating integer,
--     notes text,
--     created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
--     updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
--     CONSTRAINT risk_treatment_actions_action_type_check CHECK (((action_type)::text = ANY ((ARRAY['Preventive'::character varying, 'Detective'::character varying, 'Corrective'::character varying, 'Compensating'::character varying])::text[]))),
--     CONSTRAINT risk_treatment_actions_completion_percentage_check CHECK (((completion_percentage >= 0) AND (completion_percentage <= 100))),
--     CONSTRAINT risk_treatment_actions_effectiveness_rating_check CHECK (((effectiveness_rating >= 1) AND (effectiveness_rating <= 5))),
--     CONSTRAINT risk_treatment_actions_priority_check CHECK (((priority)::text = ANY ((ARRAY['Critical'::character varying, 'High'::character varying, 'Medium'::character varying, 'Low'::character varying])::text[]))),
--     CONSTRAINT risk_treatment_actions_status_check CHECK (((status)::text = ANY ((ARRAY['Not Started'::character varying, 'In Progress'::character varying, 'Completed'::character varying, 'On Hold'::character varying, 'Cancelled'::character varying])::text[])))
-- );


-- ALTER TABLE org_mashreqbank.risk_treatment_actions OWNER TO neondb_owner;

-- --
-- -- TOC entry 266 (class 1259 OID 98359)
-- -- Name: risk_treatment_actions_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
-- --

-- CREATE SEQUENCE org_mashreqbank.risk_treatment_actions_id_seq
--     AS integer
--     START WITH 1
--     INCREMENT BY 1
--     NO MINVALUE
--     NO MAXVALUE
--     CACHE 1;


-- ALTER SEQUENCE org_mashreqbank.risk_treatment_actions_id_seq OWNER TO neondb_owner;

-- --
-- -- TOC entry 7105 (class 0 OID 0)
-- -- Dependencies: 266
-- -- Name: risk_treatment_actions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
-- --

-- ALTER SEQUENCE org_mashreqbank.risk_treatment_actions_id_seq OWNED BY org_mashreqbank.risk_treatment_actions.id;


-- --
-- -- TOC entry 263 (class 1259 OID 90163)
-- -- Name: risk_treatment_history; Type: TABLE; Schema: public; Owner: neondb_owner
-- --

-- CREATE TABLE org_mashreqbank.risk_treatment_history (
--     id integer NOT NULL,
--     treatment_plan_id integer NOT NULL,
--     changed_by character varying(255) NOT NULL,
--     change_type character varying(50) NOT NULL,
--     old_values jsonb,
--     new_values jsonb,
--     change_reason text,
--     created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
-- );


-- ALTER TABLE org_mashreqbank.risk_treatment_history OWNER TO neondb_owner;

-- --
-- -- TOC entry 262 (class 1259 OID 90162)
-- -- Name: risk_treatment_history_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
-- --

-- CREATE SEQUENCE org_mashreqbank.risk_treatment_history_id_seq
--     AS integer
--     START WITH 1
--     INCREMENT BY 1
--     NO MINVALUE
--     NO MAXVALUE
--     CACHE 1;


-- ALTER SEQUENCE org_mashreqbank.risk_treatment_history_id_seq OWNER TO neondb_owner;

-- --
-- -- TOC entry 7106 (class 0 OID 0)
-- -- Dependencies: 262
-- -- Name: risk_treatment_history_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
-- --

-- ALTER SEQUENCE org_mashreqbank.risk_treatment_history_id_seq OWNED BY org_mashreqbank.risk_treatment_history.id;


-- --
-- -- TOC entry 259 (class 1259 OID 90116)
-- -- Name: risk_treatment_plans; Type: TABLE; Schema: public; Owner: neondb_owner
-- --

-- CREATE TABLE org_mashreqbank.risk_treatment_plans (
--     id integer NOT NULL,
--     risk_id integer NOT NULL,
--     treatment_strategy character varying(50) NOT NULL,
--     treatment_description text NOT NULL,
--     assigned_to character varying(255) NOT NULL,
--     priority character varying(20) NOT NULL,
--     target_completion_date date NOT NULL,
--     estimated_cost numeric(12,2) DEFAULT 0,
--     expected_risk_reduction integer DEFAULT 0,
--     status character varying(50) DEFAULT 'Planning'::character varying,
--     approval_status character varying(20) DEFAULT 'Pending'::character varying,
--     approved_by character varying(255),
--     approved_date timestamp without time zone,
--     implementation_notes text,
--     progress_percentage integer DEFAULT 0,
--     created_by character varying(255) NOT NULL,
--     created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
--     updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
--     CONSTRAINT risk_treatment_plans_approval_status_check CHECK (((approval_status)::text = ANY ((ARRAY['Pending'::character varying, 'Approved'::character varying, 'Rejected'::character varying])::text[]))),
--     CONSTRAINT risk_treatment_plans_expected_risk_reduction_check CHECK (((expected_risk_reduction >= 0) AND (expected_risk_reduction <= 100))),
--     CONSTRAINT risk_treatment_plans_priority_check CHECK (((priority)::text = ANY ((ARRAY['Critical'::character varying, 'High'::character varying, 'Medium'::character varying, 'Low'::character varying])::text[]))),
--     CONSTRAINT risk_treatment_plans_progress_percentage_check CHECK (((progress_percentage >= 0) AND (progress_percentage <= 100))),
--     CONSTRAINT risk_treatment_plans_status_check CHECK (((status)::text = ANY ((ARRAY['Planning'::character varying, 'In Progress'::character varying, 'Completed'::character varying, 'On Hold'::character varying, 'Cancelled'::character varying])::text[]))),
--     CONSTRAINT risk_treatment_plans_treatment_strategy_check CHECK (((treatment_strategy)::text = ANY ((ARRAY['Mitigate'::character varying, 'Accept'::character varying, 'Transfer'::character varying, 'Avoid'::character varying])::text[])))
-- );


-- ALTER TABLE org_mashreqbank.risk_treatment_plans OWNER TO neondb_owner;

-- --
-- -- TOC entry 258 (class 1259 OID 90115)
-- -- Name: risk_treatment_plans_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
-- --

-- CREATE SEQUENCE org_mashreqbank.risk_treatment_plans_id_seq
--     AS integer
--     START WITH 1
--     INCREMENT BY 1
--     NO MINVALUE
--     NO MAXVALUE
--     CACHE 1;


-- ALTER SEQUENCE org_mashreqbank.risk_treatment_plans_id_seq OWNER TO neondb_owner;

-- --
-- -- TOC entry 7107 (class 0 OID 0)
-- -- Dependencies: 258
-- -- Name: risk_treatment_plans_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
-- --

-- ALTER SEQUENCE org_mashreqbank.risk_treatment_plans_id_seq OWNED BY org_mashreqbank.risk_treatment_plans.id;


-- --
-- -- TOC entry 231 (class 1259 OID 24598)
-- -- Name: risks; Type: TABLE; Schema: public; Owner: neondb_owner
-- --

-- CREATE TABLE org_mashreqbank.risks (
--     id integer NOT NULL,
--     risk_id character varying(50) NOT NULL,
--     risk_title character varying(255) NOT NULL,
--     risk_description text NOT NULL,
--     threat_source character varying(255),
--     vulnerability character varying(255),
--     likelihood_score integer,
--     impact_score integer,
--     inherent_risk_score integer,
--     risk_owner character varying(255),
--     risk_status character varying(50) DEFAULT 'Open'::character varying,
--     identified_date date,
--     last_review_date date,
--     next_review_date date,
--     created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
--     updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
--     existing_controls text,
--     iso27002_control_id integer,
--     residual_likelihood_score integer,
--     residual_impact_score integer,
--     residual_risk_score integer,
--     risk_treatment character varying(20),
--     risk_treatment_plan text,
--     review_frequency character varying(20),
--     control_effectiveness character varying(20),
--     risk_appetite_threshold integer,
--     business_impact text,
--     regulatory_impact text,
--     financial_impact_min numeric(15,2),
--     financial_impact_max numeric(15,2),
--     treatment_cost numeric(15,2),
--     treatment_timeline character varying(50),
--     risk_tolerance character varying(20),
--     asset_id character varying(20),
--     category_id integer,
--     iso27002_control_ids integer[] DEFAULT '{}'::integer[],
--     CONSTRAINT risks_control_effectiveness_check CHECK (((control_effectiveness)::text = ANY ((ARRAY['Effective'::character varying, 'Partially Effective'::character varying, 'Ineffective'::character varying, 'Not Tested'::character varying])::text[]))),
--     CONSTRAINT risks_impact_score_check CHECK (((impact_score >= 1) AND (impact_score <= 5))),
--     CONSTRAINT risks_likelihood_score_check CHECK (((likelihood_score >= 1) AND (likelihood_score <= 5))),
--     CONSTRAINT risks_residual_impact_score_check CHECK (((residual_impact_score >= 1) AND (residual_impact_score <= 5))),
--     CONSTRAINT risks_residual_likelihood_score_check CHECK (((residual_likelihood_score >= 1) AND (residual_likelihood_score <= 5))),
--     CONSTRAINT risks_review_frequency_check CHECK (((review_frequency)::text = ANY ((ARRAY['Monthly'::character varying, 'Quarterly'::character varying, 'Semi-Annual'::character varying, 'Annual'::character varying])::text[]))),
--     CONSTRAINT risks_risk_tolerance_check CHECK (((risk_tolerance)::text = ANY ((ARRAY['Low'::character varying, 'Medium'::character varying, 'High'::character varying])::text[]))),
--     CONSTRAINT risks_risk_treatment_check CHECK (((risk_treatment)::text = ANY ((ARRAY['Accept'::character varying, 'Mitigate'::character varying, 'Transfer'::character varying, 'Avoid'::character varying])::text[])))
-- );


-- ALTER TABLE org_mashreqbank.risks OWNER TO neondb_owner;

-- --
-- -- TOC entry 7108 (class 0 OID 0)
-- -- Dependencies: 231
-- -- Name: COLUMN risks.iso27002_control_ids; Type: COMMENT; Schema: public; Owner: neondb_owner
-- --

-- COMMENT ON COLUMN org_mashreqbank.risks.iso27002_control_ids IS 'Array of ISO 27002 control IDs for multiple control support';


-- --
-- -- TOC entry 230 (class 1259 OID 24597)
-- -- Name: risks_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
-- --

-- CREATE SEQUENCE org_mashreqbank.risks_id_seq
--     AS integer
--     START WITH 1
--     INCREMENT BY 1
--     NO MINVALUE
--     NO MAXVALUE
--     CACHE 1;


-- ALTER SEQUENCE org_mashreqbank.risks_id_seq OWNER TO neondb_owner;

-- --
-- -- TOC entry 7109 (class 0 OID 0)
-- -- Dependencies: 230
-- -- Name: risks_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
-- --

-- ALTER SEQUENCE org_mashreqbank.risks_id_seq OWNED BY org_mashreqbank.risks.id;


-- --
-- -- TOC entry 530 (class 1259 OID 811009)
-- -- Name: role_page_access; Type: TABLE; Schema: public; Owner: neondb_owner
-- --

-- CREATE TABLE org_mashreqbank.role_page_access (
--     id integer NOT NULL,
--     role_id integer NOT NULL,
--     page_id integer NOT NULL,
--     has_access boolean DEFAULT false,
--     created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
--     updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
-- );


-- ALTER TABLE org_mashreqbank.role_page_access OWNER TO neondb_owner;

-- --
-- -- TOC entry 529 (class 1259 OID 811008)
-- -- Name: role_page_access_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
-- --

-- CREATE SEQUENCE org_mashreqbank.role_page_access_id_seq
--     AS integer
--     START WITH 1
--     INCREMENT BY 1
--     NO MINVALUE
--     NO MAXVALUE
--     CACHE 1;


-- ALTER SEQUENCE org_mashreqbank.role_page_access_id_seq OWNER TO neondb_owner;

-- --
-- -- TOC entry 7110 (class 0 OID 0)
-- -- Dependencies: 529
-- -- Name: role_page_access_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
-- --

-- ALTER SEQUENCE org_mashreqbank.role_page_access_id_seq OWNED BY org_mashreqbank.role_page_access.id;


-- --
-- -- TOC entry 524 (class 1259 OID 794783)
-- -- Name: role_permissions; Type: TABLE; Schema: public; Owner: neondb_owner
-- --

-- CREATE TABLE org_mashreqbank.role_permissions (
--     id integer NOT NULL,
--     role_id integer NOT NULL,
--     page_id integer NOT NULL,
--     permission_id integer NOT NULL,
--     granted boolean DEFAULT false,
--     created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
--     updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
-- );


-- ALTER TABLE org_mashreqbank.role_permissions OWNER TO neondb_owner;

-- --
-- -- TOC entry 398 (class 1259 OID 409789)
-- -- Name: role_permissions_audit; Type: TABLE; Schema: public; Owner: neondb_owner
-- --

-- CREATE TABLE org_mashreqbank.role_permissions_audit (
--     id uuid DEFAULT gen_random_uuid() NOT NULL,
--     role_id uuid,
--     permission_id uuid,
--     action character varying(20) NOT NULL,
--     changed_by uuid,
--     changed_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
-- );


-- ALTER TABLE org_mashreqbank.role_permissions_audit OWNER TO neondb_owner;

-- --
-- -- TOC entry 523 (class 1259 OID 794782)
-- -- Name: role_permissions_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
-- --

-- CREATE SEQUENCE org_mashreqbank.role_permissions_id_seq
--     AS integer
--     START WITH 1
--     INCREMENT BY 1
--     NO MINVALUE
--     NO MAXVALUE
--     CACHE 1;


-- ALTER SEQUENCE org_mashreqbank.role_permissions_id_seq OWNER TO neondb_owner;

-- --
-- -- TOC entry 7111 (class 0 OID 0)
-- -- Dependencies: 523
-- -- Name: role_permissions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
-- --

-- ALTER SEQUENCE org_mashreqbank.role_permissions_id_seq OWNED BY org_mashreqbank.role_permissions.id;


-- --
-- -- TOC entry 516 (class 1259 OID 794625)
-- -- Name: roles; Type: TABLE; Schema: public; Owner: neondb_owner
-- --

-- CREATE TABLE org_mashreqbank.roles (
--     id integer NOT NULL,
--     name character varying(100) NOT NULL,
--     description text,
--     is_system_role boolean DEFAULT false,
--     created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
--     updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
-- );


-- ALTER TABLE org_mashreqbank.roles OWNER TO neondb_owner;

-- --
-- -- TOC entry 515 (class 1259 OID 794624)
-- -- Name: roles_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
-- --

-- CREATE SEQUENCE org_mashreqbank.roles_id_seq
--     AS integer
--     START WITH 1
--     INCREMENT BY 1
--     NO MINVALUE
--     NO MAXVALUE
--     CACHE 1;


-- ALTER SEQUENCE org_mashreqbank.roles_id_seq OWNER TO neondb_owner;

-- --
-- -- TOC entry 7112 (class 0 OID 0)
-- -- Dependencies: 515
-- -- Name: roles_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
-- --

-- ALTER SEQUENCE org_mashreqbank.roles_id_seq OWNED BY org_mashreqbank.roles.id;


-- --
-- -- TOC entry 357 (class 1259 OID 278690)
-- -- Name: security_awareness_metrics; Type: TABLE; Schema: public; Owner: neondb_owner
-- --

-- CREATE TABLE org_mashreqbank.security_awareness_metrics (
--     id integer NOT NULL,
--     metric_date date DEFAULT CURRENT_DATE,
--     total_users integer DEFAULT 0,
--     enrolled_users integer DEFAULT 0,
--     completed_courses integer DEFAULT 0,
--     average_score numeric(5,2) DEFAULT 0,
--     compliance_rate numeric(5,2) DEFAULT 0,
--     overdue_trainings integer DEFAULT 0,
--     certificates_issued integer DEFAULT 0,
--     created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
-- );


-- ALTER TABLE org_mashreqbank.security_awareness_metrics OWNER TO neondb_owner;

-- --
-- -- TOC entry 356 (class 1259 OID 278689)
-- -- Name: security_awareness_metrics_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
-- --

-- CREATE SEQUENCE org_mashreqbank.security_awareness_metrics_id_seq
--     AS integer
--     START WITH 1
--     INCREMENT BY 1
--     NO MINVALUE
--     NO MAXVALUE
--     CACHE 1;


-- ALTER SEQUENCE org_mashreqbank.security_awareness_metrics_id_seq OWNER TO neondb_owner;

-- --
-- -- TOC entry 7113 (class 0 OID 0)
-- -- Dependencies: 356
-- -- Name: security_awareness_metrics_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
-- --

-- ALTER SEQUENCE org_mashreqbank.security_awareness_metrics_id_seq OWNED BY org_mashreqbank.security_awareness_metrics.id;


-- --
-- -- TOC entry 639 (class 1259 OID 1007616)
-- -- Name: sessions; Type: TABLE; Schema: public; Owner: neondb_owner
-- --

-- CREATE TABLE org_mashreqbank.sessions (
--     id uuid DEFAULT gen_random_uuid() NOT NULL,
--     user_id integer NOT NULL,
--     token text NOT NULL,
--     created_at timestamp without time zone DEFAULT now(),
--     expires_at timestamp without time zone NOT NULL
-- );


-- ALTER TABLE org_mashreqbank.sessions OWNER TO neondb_owner;

-- --
-- -- TOC entry 542 (class 1259 OID 860216)
-- -- Name: sla_exceptions; Type: TABLE; Schema: public; Owner: neondb_owner
-- --

-- CREATE TABLE org_mashreqbank.sla_exceptions (
--     id integer NOT NULL,
--     entity_type character varying(50) NOT NULL,
--     entity_id integer NOT NULL,
--     organization_id integer,
--     severity character varying(50) NOT NULL,
--     acknowledgment_days integer,
--     resolution_days integer,
--     escalation_days integer,
--     reason text,
--     approved_by character varying(255),
--     created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
--     expires_at timestamp without time zone,
--     is_active boolean DEFAULT true
-- );


-- ALTER TABLE org_mashreqbank.sla_exceptions OWNER TO neondb_owner;

-- --
-- -- TOC entry 541 (class 1259 OID 860215)
-- -- Name: sla_exceptions_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
-- --

-- CREATE SEQUENCE org_mashreqbank.sla_exceptions_id_seq
--     AS integer
--     START WITH 1
--     INCREMENT BY 1
--     NO MINVALUE
--     NO MAXVALUE
--     CACHE 1;


-- ALTER SEQUENCE org_mashreqbank.sla_exceptions_id_seq OWNER TO neondb_owner;

-- --
-- -- TOC entry 7114 (class 0 OID 0)
-- -- Dependencies: 541
-- -- Name: sla_exceptions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
-- --

-- ALTER SEQUENCE org_mashreqbank.sla_exceptions_id_seq OWNED BY org_mashreqbank.sla_exceptions.id;


-- --
-- -- TOC entry 534 (class 1259 OID 851968)
-- -- Name: sla_notification_log; Type: TABLE; Schema: public; Owner: neondb_owner
-- --

-- CREATE TABLE org_mashreqbank.sla_notification_log (
--     email_message_id character varying(255),
--     delivery_status character varying(50) DEFAULT 'pending'::character varying,
--     delivery_error text,
--     delivered_at timestamp without time zone
-- );


-- ALTER TABLE org_mashreqbank.sla_notification_log OWNER TO neondb_owner;

-- --
-- -- TOC entry 538 (class 1259 OID 860176)
-- -- Name: sla_rules; Type: TABLE; Schema: public; Owner: neondb_owner
-- --

-- CREATE TABLE org_mashreqbank.sla_rules (
--     id integer NOT NULL,
--     template_id integer,
--     severity character varying(50) NOT NULL,
--     acknowledgment_days integer DEFAULT 1 NOT NULL,
--     resolution_days integer DEFAULT 7 NOT NULL,
--     escalation_days integer DEFAULT 5 NOT NULL,
--     created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
--     updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
-- );


-- ALTER TABLE org_mashreqbank.sla_rules OWNER TO neondb_owner;

-- --
-- -- TOC entry 537 (class 1259 OID 860175)
-- -- Name: sla_rules_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
-- --

-- CREATE SEQUENCE org_mashreqbank.sla_rules_id_seq
--     AS integer
--     START WITH 1
--     INCREMENT BY 1
--     NO MINVALUE
--     NO MAXVALUE
--     CACHE 1;


-- ALTER SEQUENCE org_mashreqbank.sla_rules_id_seq OWNER TO neondb_owner;

-- --
-- -- TOC entry 7115 (class 0 OID 0)
-- -- Dependencies: 537
-- -- Name: sla_rules_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
-- --

-- ALTER SEQUENCE org_mashreqbank.sla_rules_id_seq OWNED BY org_mashreqbank.sla_rules.id;


-- --
-- -- TOC entry 536 (class 1259 OID 860161)
-- -- Name: sla_templates; Type: TABLE; Schema: public; Owner: neondb_owner
-- --

-- CREATE TABLE org_mashreqbank.sla_templates (
--     id integer NOT NULL,
--     name character varying(255) NOT NULL,
--     description text,
--     is_default boolean DEFAULT false,
--     created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
--     updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
--     created_by character varying(255),
--     is_active boolean DEFAULT true
-- );


-- ALTER TABLE org_mashreqbank.sla_templates OWNER TO neondb_owner;

-- --
-- -- TOC entry 535 (class 1259 OID 860160)
-- -- Name: sla_templates_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
-- --

-- CREATE SEQUENCE org_mashreqbank.sla_templates_id_seq
--     AS integer
--     START WITH 1
--     INCREMENT BY 1
--     NO MINVALUE
--     NO MAXVALUE
--     CACHE 1;


-- ALTER SEQUENCE org_mashreqbank.sla_templates_id_seq OWNER TO neondb_owner;

-- --
-- -- TOC entry 7116 (class 0 OID 0)
-- -- Dependencies: 535
-- -- Name: sla_templates_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
-- --

-- ALTER SEQUENCE org_mashreqbank.sla_templates_id_seq OWNED BY org_mashreqbank.sla_templates.id;


-- --
-- -- TOC entry 520 (class 1259 OID 794727)
-- -- Name: table_permissions; Type: TABLE; Schema: public; Owner: neondb_owner
-- --

-- CREATE TABLE org_mashreqbank.table_permissions (
--     id integer NOT NULL,
--     role_id integer,
--     table_id integer,
--     can_view boolean DEFAULT false,
--     can_create boolean DEFAULT false,
--     can_edit boolean DEFAULT false,
--     can_delete boolean DEFAULT false,
--     can_export boolean DEFAULT false,
--     scope_filter character varying(50) DEFAULT 'organization'::character varying,
--     created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
-- );


-- ALTER TABLE org_mashreqbank.table_permissions OWNER TO neondb_owner;

-- --
-- -- TOC entry 519 (class 1259 OID 794726)
-- -- Name: table_permissions_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
-- --

-- CREATE SEQUENCE org_mashreqbank.table_permissions_id_seq
--     AS integer
--     START WITH 1
--     INCREMENT BY 1
--     NO MINVALUE
--     NO MAXVALUE
--     CACHE 1;


-- ALTER SEQUENCE org_mashreqbank.table_permissions_id_seq OWNER TO neondb_owner;

-- --
-- -- TOC entry 7117 (class 0 OID 0)
-- -- Dependencies: 519
-- -- Name: table_permissions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
-- --

-- ALTER SEQUENCE org_mashreqbank.table_permissions_id_seq OWNED BY org_mashreqbank.table_permissions.id;


-- --
-- -- TOC entry 533 (class 1259 OID 835585)
-- -- Name: tat_settings; Type: TABLE; Schema: public; Owner: neondb_owner
-- --

-- CREATE TABLE org_mashreqbank.tat_settings (
--     id integer NOT NULL,
--     severity character varying(50) NOT NULL,
--     tat_days integer NOT NULL,
--     description text,
--     is_active boolean DEFAULT true,
--     created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
--     updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
--     created_by integer,
--     updated_by integer,
--     CONSTRAINT tat_settings_tat_days_check CHECK (((tat_days > 0) AND (tat_days <= 365)))
-- );


-- ALTER TABLE org_mashreqbank.tat_settings OWNER TO neondb_owner;

-- --
-- -- TOC entry 532 (class 1259 OID 835584)
-- -- Name: tat_settings_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
-- --

-- CREATE SEQUENCE org_mashreqbank.tat_settings_id_seq
--     AS integer
--     START WITH 1
--     INCREMENT BY 1
--     NO MINVALUE
--     NO MAXVALUE
--     CACHE 1;


-- ALTER SEQUENCE org_mashreqbank.tat_settings_id_seq OWNER TO neondb_owner;

-- --
-- -- TOC entry 7118 (class 0 OID 0)
-- -- Dependencies: 532
-- -- Name: tat_settings_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
-- --

-- ALTER SEQUENCE org_mashreqbank.tat_settings_id_seq OWNED BY org_mashreqbank.tat_settings.id;


-- --
-- -- TOC entry 630 (class 1259 OID 966657)
-- -- Name: technology_risks; Type: TABLE; Schema: public; Owner: neondb_owner
-- --

-- CREATE TABLE org_mashreqbank.technology_risks (
--     id integer NOT NULL,
--     risk_id character varying(50) NOT NULL,
--     title character varying(255) NOT NULL,
--     description text NOT NULL,
--     technology_category character varying(100) NOT NULL,
--     technology_type character varying(100) NOT NULL,
--     risk_category character varying(100) DEFAULT 'Technology'::character varying,
--     likelihood integer NOT NULL,
--     impact integer NOT NULL,
--     risk_score integer GENERATED ALWAYS AS ((likelihood * impact)) STORED,
--     risk_level character varying(20) GENERATED ALWAYS AS (
-- CASE
--     WHEN ((likelihood * impact) >= 15) THEN 'High'::text
--     WHEN ((likelihood * impact) >= 8) THEN 'Medium'::text
--     ELSE 'Low'::text
-- END) STORED,
--     current_controls text,
--     recommended_controls text,
--     control_assessment text,
--     risk_treatment character varying(50) DEFAULT 'mitigate'::character varying,
--     treatment_state character varying(50) DEFAULT 'planned'::character varying,
--     treatment_end_date date,
--     action_owner character varying(255),
--     owner character varying(255) NOT NULL,
--     status character varying(50) DEFAULT 'open'::character varying,
--     due_date date,
--     residual_likelihood integer NOT NULL,
--     residual_impact integer NOT NULL,
--     residual_risk integer GENERATED ALWAYS AS ((residual_likelihood * residual_impact)) STORED,
--     created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
--     updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
--     asset_id character varying(20),
--     CONSTRAINT technology_risks_impact_check CHECK (((impact >= 1) AND (impact <= 5))),
--     CONSTRAINT technology_risks_likelihood_check CHECK (((likelihood >= 1) AND (likelihood <= 5))),
--     CONSTRAINT technology_risks_residual_impact_check CHECK (((residual_impact >= 1) AND (residual_impact <= 5))),
--     CONSTRAINT technology_risks_residual_likelihood_check CHECK (((residual_likelihood >= 1) AND (residual_likelihood <= 5))),
--     CONSTRAINT technology_risks_risk_treatment_check CHECK (((risk_treatment)::text = ANY ((ARRAY['mitigate'::character varying, 'transfer'::character varying, 'avoid'::character varying, 'accept'::character varying])::text[]))),
--     CONSTRAINT technology_risks_status_check CHECK (((status)::text = ANY ((ARRAY['open'::character varying, 'in-progress'::character varying, 'mitigated'::character varying, 'accepted'::character varying, 'closed'::character varying])::text[]))),
--     CONSTRAINT technology_risks_treatment_state_check CHECK (((treatment_state)::text = ANY ((ARRAY['planned'::character varying, 'in-progress'::character varying, 'completed'::character varying, 'overdue'::character varying, 'cancelled'::character varying])::text[])))
-- );


-- ALTER TABLE org_mashreqbank.technology_risks OWNER TO neondb_owner;

-- --
-- -- TOC entry 629 (class 1259 OID 966656)
-- -- Name: technology_risks_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
-- --

-- CREATE SEQUENCE org_mashreqbank.technology_risks_id_seq
--     AS integer
--     START WITH 1
--     INCREMENT BY 1
--     NO MINVALUE
--     NO MAXVALUE
--     CACHE 1;


-- ALTER SEQUENCE org_mashreqbank.technology_risks_id_seq OWNER TO neondb_owner;

-- --
-- -- TOC entry 7119 (class 0 OID 0)
-- -- Dependencies: 629
-- -- Name: technology_risks_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
-- --

-- ALTER SEQUENCE org_mashreqbank.technology_risks_id_seq OWNED BY org_mashreqbank.technology_risks.id;


-- --
-- -- TOC entry 636 (class 1259 OID 983064)
-- -- Name: third_party_risk_assessment_responses; Type: TABLE; Schema: public; Owner: neondb_owner
-- --

-- CREATE TABLE org_mashreqbank.third_party_risk_assessment_responses (
--     id integer NOT NULL,
--     assessment_id integer,
--     template_id integer,
--     assessment_result character varying(50),
--     assessment_remarks text,
--     impact_score integer,
--     likelihood_score integer,
--     risk_level character varying(20),
--     risk_treatment text,
--     residual_impact_score integer,
--     residual_likelihood_score integer,
--     residual_risk_level character varying(20),
--     created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
--     updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
--     CONSTRAINT third_party_risk_assessment_res_residual_likelihood_score_check CHECK (((residual_likelihood_score >= 1) AND (residual_likelihood_score <= 5))),
--     CONSTRAINT third_party_risk_assessment_respons_residual_impact_score_check CHECK (((residual_impact_score >= 1) AND (residual_impact_score <= 5))),
--     CONSTRAINT third_party_risk_assessment_responses_impact_score_check CHECK (((impact_score >= 1) AND (impact_score <= 5))),
--     CONSTRAINT third_party_risk_assessment_responses_likelihood_score_check CHECK (((likelihood_score >= 1) AND (likelihood_score <= 5))),
--     CONSTRAINT valid_assessment_result CHECK (((assessment_result)::text = ANY ((ARRAY['Effective'::character varying, 'Partial Effective'::character varying, 'Not Effective'::character varying])::text[])))
-- );


-- ALTER TABLE org_mashreqbank.third_party_risk_assessment_responses OWNER TO neondb_owner;

-- --
-- -- TOC entry 635 (class 1259 OID 983063)
-- -- Name: third_party_risk_assessment_responses_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
-- --

-- CREATE SEQUENCE org_mashreqbank.third_party_risk_assessment_responses_id_seq
--     AS integer
--     START WITH 1
--     INCREMENT BY 1
--     NO MINVALUE
--     NO MAXVALUE
--     CACHE 1;


-- ALTER SEQUENCE org_mashreqbank.third_party_risk_assessment_responses_id_seq OWNER TO neondb_owner;

-- --
-- -- TOC entry 7120 (class 0 OID 0)
-- -- Dependencies: 635
-- -- Name: third_party_risk_assessment_responses_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
-- --

-- ALTER SEQUENCE org_mashreqbank.third_party_risk_assessment_responses_id_seq OWNED BY org_mashreqbank.third_party_risk_assessment_responses.id;


-- --
-- -- TOC entry 634 (class 1259 OID 983052)
-- -- Name: third_party_risk_assessments; Type: TABLE; Schema: public; Owner: neondb_owner
-- --

-- CREATE TABLE org_mashreqbank.third_party_risk_assessments (
--     id integer NOT NULL,
--     vendor_id character varying(20),
--     vendor_name character varying(255) NOT NULL,
--     assessment_name character varying(255) NOT NULL,
--     assessment_date date NOT NULL,
--     assessor_name character varying(255) NOT NULL,
--     status character varying(50) DEFAULT 'In Progress'::character varying,
--     overall_risk_level character varying(20),
--     created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
--     updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
--     CONSTRAINT valid_status CHECK (((status)::text = ANY ((ARRAY['In Progress'::character varying, 'Completed'::character varying, 'Under Review'::character varying, 'Approved'::character varying])::text[])))
-- );


-- ALTER TABLE org_mashreqbank.third_party_risk_assessments OWNER TO neondb_owner;

-- --
-- -- TOC entry 633 (class 1259 OID 983051)
-- -- Name: third_party_risk_assessments_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
-- --

-- CREATE SEQUENCE org_mashreqbank.third_party_risk_assessments_id_seq
--     AS integer
--     START WITH 1
--     INCREMENT BY 1
--     NO MINVALUE
--     NO MAXVALUE
--     CACHE 1;


-- ALTER SEQUENCE org_mashreqbank.third_party_risk_assessments_id_seq OWNER TO neondb_owner;

-- --
-- -- TOC entry 7121 (class 0 OID 0)
-- -- Dependencies: 633
-- -- Name: third_party_risk_assessments_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
-- --

-- ALTER SEQUENCE org_mashreqbank.third_party_risk_assessments_id_seq OWNED BY org_mashreqbank.third_party_risk_assessments.id;


-- --
-- -- TOC entry 632 (class 1259 OID 983041)
-- -- Name: third_party_risk_templates; Type: TABLE; Schema: public; Owner: neondb_owner
-- --

-- CREATE TABLE org_mashreqbank.third_party_risk_templates (
--     id integer NOT NULL,
--     category_id character varying(10) NOT NULL,
--     category_name character varying(255) NOT NULL,
--     risk_id character varying(10) NOT NULL,
--     risk_title character varying(500) NOT NULL,
--     control_catalogue text NOT NULL,
--     created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
--     updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
-- );


-- ALTER TABLE org_mashreqbank.third_party_risk_templates OWNER TO neondb_owner;

-- --
-- -- TOC entry 631 (class 1259 OID 983040)
-- -- Name: third_party_risk_templates_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
-- --

-- CREATE SEQUENCE org_mashreqbank.third_party_risk_templates_id_seq
--     AS integer
--     START WITH 1
--     INCREMENT BY 1
--     NO MINVALUE
--     NO MAXVALUE
--     CACHE 1;


-- ALTER SEQUENCE org_mashreqbank.third_party_risk_templates_id_seq OWNER TO neondb_owner;

-- --
-- -- TOC entry 7122 (class 0 OID 0)
-- -- Dependencies: 631
-- -- Name: third_party_risk_templates_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
-- --

-- ALTER SEQUENCE org_mashreqbank.third_party_risk_templates_id_seq OWNED BY org_mashreqbank.third_party_risk_templates.id;


-- --
-- -- TOC entry 334 (class 1259 OID 213089)
-- -- Name: threat_assessments; Type: TABLE; Schema: public; Owner: neondb_owner
-- --

-- CREATE TABLE org_mashreqbank.threat_assessments (
--     id integer NOT NULL,
--     assessment_id character varying(50),
--     assessment_name character varying(255) NOT NULL,
--     description text,
--     threat_id character varying(50),
--     threat_name character varying(255),
--     assessment_type character varying(50),
--     methodology character varying(50),
--     status character varying(50) DEFAULT 'draft'::character varying,
--     priority character varying(20),
--     likelihood integer DEFAULT 1,
--     impact integer DEFAULT 1,
--     risk_score integer DEFAULT 1,
--     risk_level character varying(20),
--     assessor character varying(255),
--     due_date date,
--     mitigation_status text,
--     recommendations text,
--     notes text,
--     created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
--     updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
--     asset_id character varying(20),
--     assessment_date date,
--     CONSTRAINT threat_assessments_assessment_type_check CHECK (((assessment_type)::text = ANY ((ARRAY['structured'::character varying, 'rapid'::character varying, 'detailed'::character varying, 'continuous'::character varying])::text[]))),
--     CONSTRAINT threat_assessments_impact_score_check CHECK (((impact >= 1) AND (impact <= 5))),
--     CONSTRAINT threat_assessments_likelihood_score_check CHECK (((likelihood >= 1) AND (likelihood <= 5))),
--     CONSTRAINT threat_assessments_methodology_check CHECK (((methodology)::text = ANY ((ARRAY['qualitative'::character varying, 'quantitative'::character varying, 'semi-quantitative'::character varying, 'nist'::character varying, 'iso27005'::character varying])::text[]))),
--     CONSTRAINT threat_assessments_priority_check CHECK (((priority)::text = ANY ((ARRAY['critical'::character varying, 'high'::character varying, 'medium'::character varying, 'low'::character varying])::text[]))),
--     CONSTRAINT threat_assessments_risk_level_check CHECK (((risk_level)::text = ANY ((ARRAY['critical'::character varying, 'high'::character varying, 'medium'::character varying, 'low'::character varying, 'very-low'::character varying])::text[]))),
--     CONSTRAINT threat_assessments_status_check CHECK (((status)::text = ANY ((ARRAY['draft'::character varying, 'in-progress'::character varying, 'under-review'::character varying, 'completed'::character varying, 'approved'::character varying])::text[])))
-- );


-- ALTER TABLE org_mashreqbank.threat_assessments OWNER TO neondb_owner;

-- --
-- -- TOC entry 333 (class 1259 OID 213088)
-- -- Name: threat_assessments_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
-- --

-- CREATE SEQUENCE org_mashreqbank.threat_assessments_id_seq
--     AS integer
--     START WITH 1
--     INCREMENT BY 1
--     NO MINVALUE
--     NO MAXVALUE
--     CACHE 1;


-- ALTER SEQUENCE org_mashreqbank.threat_assessments_id_seq OWNER TO neondb_owner;

-- --
-- -- TOC entry 7123 (class 0 OID 0)
-- -- Dependencies: 333
-- -- Name: threat_assessments_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
-- --

-- ALTER SEQUENCE org_mashreqbank.threat_assessments_id_seq OWNED BY org_mashreqbank.threat_assessments.id;


-- --
-- -- TOC entry 332 (class 1259 OID 196608)
-- -- Name: threats; Type: TABLE; Schema: public; Owner: neondb_owner
-- --

-- CREATE TABLE org_mashreqbank.threats (
--     threat_id character varying(50) NOT NULL,
--     name character varying(255) NOT NULL,
--     description text,
--     category character varying(100),
--     source character varying(100),
--     threat_level character varying(50),
--     status character varying(50),
--     indicators_of_compromise text,
--     mitigation_strategies text,
--     threat_references text,
--     created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
--     updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
--     id character varying(50) DEFAULT '1'::character varying
-- );


-- ALTER TABLE org_mashreqbank.threats OWNER TO neondb_owner;

-- --
-- -- TOC entry 355 (class 1259 OID 278671)
-- -- Name: training_assignments; Type: TABLE; Schema: public; Owner: neondb_owner
-- --

-- CREATE TABLE org_mashreqbank.training_assignments (
--     id integer NOT NULL,
--     course_id integer,
--     assigned_to_user integer,
--     assigned_to_department integer,
--     assigned_to_role character varying(100),
--     assigned_by integer NOT NULL,
--     assignment_type character varying(50) DEFAULT 'individual'::character varying,
--     due_date timestamp without time zone,
--     priority character varying(20) DEFAULT 'medium'::character varying,
--     notification_sent boolean DEFAULT false,
--     reminder_count integer DEFAULT 0,
--     notes text,
--     created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
-- );


-- ALTER TABLE org_mashreqbank.training_assignments OWNER TO neondb_owner;

-- --
-- -- TOC entry 354 (class 1259 OID 278670)
-- -- Name: training_assignments_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
-- --

-- CREATE SEQUENCE org_mashreqbank.training_assignments_id_seq
--     AS integer
--     START WITH 1
--     INCREMENT BY 1
--     NO MINVALUE
--     NO MAXVALUE
--     CACHE 1;


-- ALTER SEQUENCE org_mashreqbank.training_assignments_id_seq OWNER TO neondb_owner;

-- --
-- -- TOC entry 7124 (class 0 OID 0)
-- -- Dependencies: 354
-- -- Name: training_assignments_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
-- --

-- ALTER SEQUENCE org_mashreqbank.training_assignments_id_seq OWNED BY org_mashreqbank.training_assignments.id;


-- --
-- -- TOC entry 341 (class 1259 OID 278529)
-- -- Name: training_categories; Type: TABLE; Schema: public; Owner: neondb_owner
-- --

-- CREATE TABLE org_mashreqbank.training_categories (
--     id integer NOT NULL,
--     name character varying(255) NOT NULL,
--     description text,
--     icon character varying(100),
--     color character varying(50),
--     is_active boolean DEFAULT true,
--     created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
--     updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
-- );


-- ALTER TABLE org_mashreqbank.training_categories OWNER TO neondb_owner;

-- --
-- -- TOC entry 340 (class 1259 OID 278528)
-- -- Name: training_categories_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
-- --

-- CREATE SEQUENCE org_mashreqbank.training_categories_id_seq
--     AS integer
--     START WITH 1
--     INCREMENT BY 1
--     NO MINVALUE
--     NO MAXVALUE
--     CACHE 1;


-- ALTER SEQUENCE org_mashreqbank.training_categories_id_seq OWNER TO neondb_owner;

-- --
-- -- TOC entry 7125 (class 0 OID 0)
-- -- Dependencies: 340
-- -- Name: training_categories_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
-- --

-- ALTER SEQUENCE org_mashreqbank.training_categories_id_seq OWNED BY org_mashreqbank.training_categories.id;


-- --
-- -- TOC entry 343 (class 1259 OID 278541)
-- -- Name: training_courses; Type: TABLE; Schema: public; Owner: neondb_owner
-- --

-- CREATE TABLE org_mashreqbank.training_courses (
--     id integer NOT NULL,
--     title character varying(255) NOT NULL,
--     description text,
--     category_id integer,
--     content text,
--     duration_minutes integer DEFAULT 30,
--     difficulty_level character varying(20) DEFAULT 'beginner'::character varying,
--     is_mandatory boolean DEFAULT false,
--     is_active boolean DEFAULT true,
--     passing_score integer DEFAULT 80,
--     certificate_template text,
--     created_by integer,
--     created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
--     updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
-- );


-- ALTER TABLE org_mashreqbank.training_courses OWNER TO neondb_owner;

-- --
-- -- TOC entry 342 (class 1259 OID 278540)
-- -- Name: training_courses_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
-- --

-- CREATE SEQUENCE org_mashreqbank.training_courses_id_seq
--     AS integer
--     START WITH 1
--     INCREMENT BY 1
--     NO MINVALUE
--     NO MAXVALUE
--     CACHE 1;


-- ALTER SEQUENCE org_mashreqbank.training_courses_id_seq OWNER TO neondb_owner;

-- --
-- -- TOC entry 7126 (class 0 OID 0)
-- -- Dependencies: 342
-- -- Name: training_courses_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
-- --

-- ALTER SEQUENCE org_mashreqbank.training_courses_id_seq OWNED BY org_mashreqbank.training_courses.id;


-- --
-- -- TOC entry 345 (class 1259 OID 278562)
-- -- Name: training_modules; Type: TABLE; Schema: public; Owner: neondb_owner
-- --

-- CREATE TABLE org_mashreqbank.training_modules (
--     id integer NOT NULL,
--     course_id integer,
--     title character varying(255) NOT NULL,
--     description text,
--     content text,
--     module_order integer DEFAULT 1,
--     duration_minutes integer DEFAULT 10,
--     module_type character varying(50) DEFAULT 'lesson'::character varying,
--     is_active boolean DEFAULT true,
--     created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
--     updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
-- );


-- ALTER TABLE org_mashreqbank.training_modules OWNER TO neondb_owner;

-- --
-- -- TOC entry 344 (class 1259 OID 278561)
-- -- Name: training_modules_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
-- --

-- CREATE SEQUENCE org_mashreqbank.training_modules_id_seq
--     AS integer
--     START WITH 1
--     INCREMENT BY 1
--     NO MINVALUE
--     NO MAXVALUE
--     CACHE 1;


-- ALTER SEQUENCE org_mashreqbank.training_modules_id_seq OWNER TO neondb_owner;

-- --
-- -- TOC entry 7127 (class 0 OID 0)
-- -- Dependencies: 344
-- -- Name: training_modules_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
-- --

-- ALTER SEQUENCE org_mashreqbank.training_modules_id_seq OWNED BY org_mashreqbank.training_modules.id;


-- --
-- -- TOC entry 397 (class 1259 OID 409775)
-- -- Name: user_activity_logs; Type: TABLE; Schema: public; Owner: neondb_owner
-- --

-- CREATE TABLE org_mashreqbank.user_activity_logs (
--     id uuid DEFAULT gen_random_uuid() NOT NULL,
--     user_id uuid,
--     action character varying(100) NOT NULL,
--     resource character varying(100),
--     resource_id uuid,
--     details jsonb,
--     ip_address inet,
--     user_agent text,
--     created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
-- );


-- ALTER TABLE org_mashreqbank.user_activity_logs OWNER TO neondb_owner;

-- --
-- -- TOC entry 351 (class 1259 OID 278622)
-- -- Name: user_module_progress; Type: TABLE; Schema: public; Owner: neondb_owner
-- --

-- CREATE TABLE org_mashreqbank.user_module_progress (
--     id integer NOT NULL,
--     enrollment_id integer,
--     module_id integer,
--     status character varying(50) DEFAULT 'not_started'::character varying,
--     score integer DEFAULT 0,
--     time_spent_minutes integer DEFAULT 0,
--     started_at timestamp without time zone,
--     completed_at timestamp without time zone,
--     attempts integer DEFAULT 0
-- );


-- ALTER TABLE org_mashreqbank.user_module_progress OWNER TO neondb_owner;

-- --
-- -- TOC entry 350 (class 1259 OID 278621)
-- -- Name: user_module_progress_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
-- --

-- CREATE SEQUENCE org_mashreqbank.user_module_progress_id_seq
--     AS integer
--     START WITH 1
--     INCREMENT BY 1
--     NO MINVALUE
--     NO MAXVALUE
--     CACHE 1;


-- ALTER SEQUENCE org_mashreqbank.user_module_progress_id_seq OWNER TO neondb_owner;

-- --
-- -- TOC entry 7128 (class 0 OID 0)
-- -- Dependencies: 350
-- -- Name: user_module_progress_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
-- --

-- ALTER SEQUENCE org_mashreqbank.user_module_progress_id_seq OWNED BY org_mashreqbank.user_module_progress.id;


-- --
-- -- TOC entry 396 (class 1259 OID 409718)
-- -- Name: user_permissions; Type: TABLE; Schema: public; Owner: neondb_owner
-- --

-- CREATE TABLE org_mashreqbank.user_permissions (
--     id uuid DEFAULT gen_random_uuid() NOT NULL,
--     user_id uuid NOT NULL,
--     permission_id uuid NOT NULL,
--     granted_by uuid,
--     granted_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
--     expires_at timestamp with time zone,
--     is_active boolean DEFAULT true
-- );


-- ALTER TABLE org_mashreqbank.user_permissions OWNER TO neondb_owner;

-- --
-- -- TOC entry 526 (class 1259 OID 794811)
-- -- Name: user_roles; Type: TABLE; Schema: public; Owner: neondb_owner
-- --

-- CREATE TABLE org_mashreqbank.user_roles (
--     id integer NOT NULL,
--     user_id integer NOT NULL,
--     role_id integer NOT NULL,
--     assigned_by integer,
--     assigned_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
--     is_active boolean DEFAULT true
-- );


-- ALTER TABLE org_mashreqbank.user_roles OWNER TO neondb_owner;

-- --
-- -- TOC entry 525 (class 1259 OID 794810)
-- -- Name: user_roles_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
-- --

-- CREATE SEQUENCE org_mashreqbank.user_roles_id_seq
--     AS integer
--     START WITH 1
--     INCREMENT BY 1
--     NO MINVALUE
--     NO MAXVALUE
--     CACHE 1;


-- ALTER SEQUENCE org_mashreqbank.user_roles_id_seq OWNER TO neondb_owner;

-- --
-- -- TOC entry 7129 (class 0 OID 0)
-- -- Dependencies: 525
-- -- Name: user_roles_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
-- --

-- ALTER SEQUENCE org_mashreqbank.user_roles_id_seq OWNED BY org_mashreqbank.user_roles.id;


-- --
-- -- TOC entry 628 (class 1259 OID 958465)
-- -- Name: user_sessions; Type: TABLE; Schema: public; Owner: neondb_owner
-- --

-- CREATE TABLE org_mashreqbank.user_sessions (
--     id integer NOT NULL,
--     session_token character varying(255) NOT NULL,
--     user_id integer NOT NULL,
--     created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
--     expires_at timestamp without time zone NOT NULL,
--     last_accessed timestamp without time zone DEFAULT CURRENT_TIMESTAMP
-- );


-- ALTER TABLE org_mashreqbank.user_sessions OWNER TO neondb_owner;

-- --
-- -- TOC entry 7130 (class 0 OID 0)
-- -- Dependencies: 628
-- -- Name: TABLE user_sessions; Type: COMMENT; Schema: public; Owner: neondb_owner
-- --

-- COMMENT ON TABLE org_mashreqbank.user_sessions IS 'Stores active user sessions for authentication';


-- --
-- -- TOC entry 627 (class 1259 OID 958464)
-- -- Name: user_sessions_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
-- --

-- CREATE SEQUENCE org_mashreqbank.user_sessions_id_seq
--     AS integer
--     START WITH 1
--     INCREMENT BY 1
--     NO MINVALUE
--     NO MAXVALUE
--     CACHE 1;


-- ALTER SEQUENCE org_mashreqbank.user_sessions_id_seq OWNER TO neondb_owner;

-- --
-- -- TOC entry 7131 (class 0 OID 0)
-- -- Dependencies: 627
-- -- Name: user_sessions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
-- --

-- ALTER SEQUENCE org_mashreqbank.user_sessions_id_seq OWNED BY org_mashreqbank.user_sessions.id;


-- --
-- -- TOC entry 349 (class 1259 OID 278601)
-- -- Name: user_training_enrollments; Type: TABLE; Schema: public; Owner: neondb_owner
-- --

-- CREATE TABLE org_mashreqbank.user_training_enrollments (
--     id integer NOT NULL,
--     user_id integer NOT NULL,
--     course_id integer,
--     enrollment_date timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
--     due_date timestamp without time zone,
--     status character varying(50) DEFAULT 'enrolled'::character varying,
--     progress_percentage integer DEFAULT 0,
--     score integer DEFAULT 0,
--     attempts integer DEFAULT 0,
--     max_attempts integer DEFAULT 3,
--     started_at timestamp without time zone,
--     completed_at timestamp without time zone,
--     certificate_issued boolean DEFAULT false,
--     certificate_url text,
--     assigned_by integer,
--     notes text
-- );


-- ALTER TABLE org_mashreqbank.user_training_enrollments OWNER TO neondb_owner;

-- --
-- -- TOC entry 348 (class 1259 OID 278600)
-- -- Name: user_training_enrollments_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
-- --

-- CREATE SEQUENCE org_mashreqbank.user_training_enrollments_id_seq
--     AS integer
--     START WITH 1
--     INCREMENT BY 1
--     NO MINVALUE
--     NO MAXVALUE
--     CACHE 1;


-- ALTER SEQUENCE org_mashreqbank.user_training_enrollments_id_seq OWNER TO neondb_owner;

-- --
-- -- TOC entry 7132 (class 0 OID 0)
-- -- Dependencies: 348
-- -- Name: user_training_enrollments_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
-- --

-- ALTER SEQUENCE org_mashreqbank.user_training_enrollments_id_seq OWNED BY org_mashreqbank.user_training_enrollments.id;


-- --
-- -- TOC entry 423 (class 1259 OID 516198)
-- -- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
-- --

-- CREATE SEQUENCE org_mashreqbank.users_id_seq
--     AS integer
--     START WITH 1
--     INCREMENT BY 1
--     NO MINVALUE
--     NO MAXVALUE
--     CACHE 1;


-- ALTER SEQUENCE org_mashreqbank.users_id_seq OWNER TO neondb_owner;

-- --
-- -- TOC entry 7133 (class 0 OID 0)
-- -- Dependencies: 423
-- -- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
-- --

-- ALTER SEQUENCE org_mashreqbank.users_id_seq OWNED BY org_mashreqbank.users.id;


-- --
-- -- TOC entry 339 (class 1259 OID 262157)
-- -- Name: userss; Type: TABLE; Schema: public; Owner: neondb_owner
-- --

-- CREATE TABLE org_mashreqbank.userss (
--     id integer NOT NULL,
--     user_id character varying(20) NOT NULL,
--     username character varying(100) NOT NULL,
--     email character varying(255) NOT NULL,
--     first_name character varying(100) NOT NULL,
--     last_name character varying(100) NOT NULL,
--     password_hash character varying(255) NOT NULL,
--     phone character varying(50),
--     job_title character varying(100),
--     employee_id character varying(50),
--     organization_id integer,
--     department_id integer,
--     manager_id integer,
--     hire_date date,
--     status character varying(20) DEFAULT 'Active'::character varying,
--     last_login timestamp without time zone,
--     failed_login_attempts integer DEFAULT 0,
--     account_locked_until timestamp without time zone,
--     password_changed_at timestamp without time zone DEFAULT now(),
--     must_change_password boolean DEFAULT true,
--     two_factor_enabled boolean DEFAULT false,
--     profile_image_url character varying(500),
--     created_at timestamp without time zone DEFAULT now(),
--     updated_at timestamp without time zone DEFAULT now()
-- );


-- ALTER TABLE org_mashreqbank.userss OWNER TO neondb_owner;

-- --
-- -- TOC entry 338 (class 1259 OID 262156)
-- -- Name: userss_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
-- --

-- CREATE SEQUENCE org_mashreqbank.userss_id_seq
--     AS integer
--     START WITH 1
--     INCREMENT BY 1
--     NO MINVALUE
--     NO MAXVALUE
--     CACHE 1;


-- ALTER SEQUENCE org_mashreqbank.userss_id_seq OWNER TO neondb_owner;

-- --
-- -- TOC entry 7134 (class 0 OID 0)
-- -- Dependencies: 338
-- -- Name: userss_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
-- --

-- ALTER SEQUENCE org_mashreqbank.userss_id_seq OWNED BY org_mashreqbank.userss.id;


-- --
-- -- TOC entry 638 (class 1259 OID 991233)
-- -- Name: vendors; Type: TABLE; Schema: public; Owner: neondb_owner
-- --

-- CREATE TABLE org_mashreqbank.vendors (
--     id integer NOT NULL,
--     vendor_name character varying(255) NOT NULL,
--     vendor_type character varying(100) NOT NULL,
--     contact_person character varying(255),
--     contact_email character varying(255),
--     contact_phone character varying(50),
--     address text,
--     website character varying(255),
--     business_registration_number character varying(100),
--     tax_id character varying(100),
--     contract_start_date date,
--     contract_end_date date,
--     contract_value numeric(15,2),
--     risk_rating character varying(50) DEFAULT 'Medium'::character varying,
--     status character varying(50) DEFAULT 'Active'::character varying,
--     description text,
--     created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
--     updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
--     vendor_id character varying(20)
-- );


-- ALTER TABLE org_mashreqbank.vendors OWNER TO neondb_owner;

-- --
-- -- TOC entry 637 (class 1259 OID 991232)
-- -- Name: vendors_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
-- --

-- CREATE SEQUENCE org_mashreqbank.vendors_id_seq
--     AS integer
--     START WITH 1
--     INCREMENT BY 1
--     NO MINVALUE
--     NO MAXVALUE
--     CACHE 1;


-- ALTER SEQUENCE org_mashreqbank.vendors_id_seq OWNER TO neondb_owner;

-- --
-- -- TOC entry 7135 (class 0 OID 0)
-- -- Dependencies: 637
-- -- Name: vendors_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
-- --

-- ALTER SEQUENCE org_mashreqbank.vendors_id_seq OWNED BY org_mashreqbank.vendors.id;


-- --
-- -- TOC entry 386 (class 1259 OID 344116)
-- -- Name: vulnerabilities; Type: TABLE; Schema: public; Owner: neondb_owner
-- --

-- CREATE TABLE org_mashreqbank.vulnerabilities (
--     id integer NOT NULL,
--     name character varying(255) NOT NULL,
--     description text,
--     severity character varying(20) DEFAULT 'Medium'::character varying,
--     cvss_score numeric(3,1),
--     category character varying(100),
--     affected_systems jsonb DEFAULT '[]'::jsonb,
--     remediation_status character varying(50) DEFAULT 'Open'::character varying,
--     discovery_date timestamp without time zone DEFAULT now(),
--     remediation_date timestamp without time zone,
--     assigned_to character varying(255),
--     priority integer DEFAULT 3,
--     external_references jsonb DEFAULT '[]'::jsonb,
--     tags jsonb DEFAULT '[]'::jsonb,
--     created_at timestamp without time zone DEFAULT now(),
--     updated_at timestamp without time zone DEFAULT now(),
--     created_by integer,
--     updated_by integer,
--     cve_id character varying(10),
--     remediation_notes character varying(100),
--     remediation_due_date date,
--     remediation_completed_date date,
--     tat_days integer DEFAULT 30,
--     last_reviewed_date date,
--     reviewer character varying(255),
--     CONSTRAINT vulnerabilities_cvss_score_check CHECK (((cvss_score >= (0)::numeric) AND (cvss_score <= (10)::numeric))),
--     CONSTRAINT vulnerabilities_priority_check CHECK (((priority >= 1) AND (priority <= 5))),
--     CONSTRAINT vulnerabilities_remediation_status_check CHECK (((remediation_status)::text = ANY ((ARRAY['Open'::character varying, 'In Progress'::character varying, 'Resolved'::character varying, 'Accepted Risk'::character varying, 'False Positive'::character varying])::text[]))),
--     CONSTRAINT vulnerabilities_severity_check CHECK (((severity)::text = ANY ((ARRAY['Critical'::character varying, 'High'::character varying, 'Medium'::character varying, 'Low'::character varying, 'Informational'::character varying])::text[])))
-- );


-- ALTER TABLE org_mashreqbank.vulnerabilities OWNER TO neondb_owner;

-- --
-- -- TOC entry 7136 (class 0 OID 0)
-- -- Dependencies: 386
-- -- Name: TABLE vulnerabilities; Type: COMMENT; Schema: public; Owner: neondb_owner
-- --

-- COMMENT ON TABLE org_mashreqbank.vulnerabilities IS 'Vulnerability management and tracking';


-- --
-- -- TOC entry 7137 (class 0 OID 0)
-- -- Dependencies: 386
-- -- Name: COLUMN vulnerabilities.cvss_score; Type: COMMENT; Schema: public; Owner: neondb_owner
-- --

-- COMMENT ON COLUMN org_mashreqbank.vulnerabilities.cvss_score IS 'Common Vulnerability Scoring System score (0-10)';


-- --
-- -- TOC entry 7138 (class 0 OID 0)
-- -- Dependencies: 386
-- -- Name: COLUMN vulnerabilities.affected_systems; Type: COMMENT; Schema: public; Owner: neondb_owner
-- --

-- COMMENT ON COLUMN org_mashreqbank.vulnerabilities.affected_systems IS 'JSON array of affected systems/assets';


-- --
-- -- TOC entry 7139 (class 0 OID 0)
-- -- Dependencies: 386
-- -- Name: COLUMN vulnerabilities.external_references; Type: COMMENT; Schema: public; Owner: neondb_owner
-- --

-- COMMENT ON COLUMN org_mashreqbank.vulnerabilities.external_references IS 'JSON array of CVE IDs, vendor advisories, etc.';


-- --
-- -- TOC entry 7140 (class 0 OID 0)
-- -- Dependencies: 386
-- -- Name: COLUMN vulnerabilities.tags; Type: COMMENT; Schema: public; Owner: neondb_owner
-- --

-- COMMENT ON COLUMN org_mashreqbank.vulnerabilities.tags IS 'JSON array of tags for categorization';


-- --
-- -- TOC entry 385 (class 1259 OID 344115)
-- -- Name: vulnerabilities_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
-- --

-- CREATE SEQUENCE org_mashreqbank.vulnerabilities_id_seq
--     AS integer
--     START WITH 1
--     INCREMENT BY 1
--     NO MINVALUE
--     NO MAXVALUE
--     CACHE 1;


-- ALTER SEQUENCE org_mashreqbank.vulnerabilities_id_seq OWNER TO neondb_owner;

-- --
-- -- TOC entry 7141 (class 0 OID 0)
-- -- Dependencies: 385
-- -- Name: vulnerabilities_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
-- --

-- ALTER SEQUENCE org_mashreqbank.vulnerabilities_id_seq OWNED BY org_mashreqbank.vulnerabilities.id;


-- --
-- -- TOC entry 419 (class 1259 OID 491523)
-- -- Name: vulnerability_dashboard; Type: VIEW; Schema: public; Owner: neondb_owner
-- --

-- CREATE VIEW org_mashreqbank.vulnerability_dashboard AS
--  SELECT id,
--     name,
--     description,
--     severity,
--     cvss_score,
--     category,
--     affected_systems,
--     remediation_status,
--     discovery_date,
--     remediation_date,
--     assigned_to,
--     priority,
--     external_references,
--     tags,
--     created_at,
--     updated_at,
--     created_by,
--     updated_by,
--     cve_id,
--     remediation_notes,
--     remediation_due_date,
--     remediation_completed_date,
--     tat_days,
--     last_reviewed_date,
--     reviewer,
--     org_mashreqbank.calculate_aging_days(created_at, remediation_completed_date, remediation_due_date) AS aging_days,
--     org_mashreqbank.calculate_overdue_days(remediation_due_date, remediation_completed_date) AS overdue_days,
--         CASE
--             WHEN (remediation_completed_date IS NOT NULL) THEN 'Completed'::text
--             WHEN ((remediation_due_date IS NOT NULL) AND (remediation_due_date < CURRENT_DATE)) THEN 'Overdue'::text
--             WHEN ((remediation_due_date IS NOT NULL) AND (remediation_due_date <= (CURRENT_DATE + '7 days'::interval))) THEN 'Due Soon'::text
--             ELSE 'On Track'::text
--         END AS remediation_timeline_status
--    FROM org_mashreqbank.vulnerabilities v;


-- ALTER VIEW org_mashreqbank.vulnerability_dashboard OWNER TO neondb_owner;

-- --
-- -- TOC entry 283 (class 1259 OID 114764)
-- -- Name: workflow_risk_assessments; Type: TABLE; Schema: public; Owner: neondb_owner
-- --

-- CREATE TABLE org_mashreqbank.workflow_risk_assessments (
--     id integer NOT NULL,
--     workflow_id integer,
--     risk_id integer,
--     assessment_notes text,
--     mitigation_strategy text,
--     treatment_option character varying(100),
--     treatment_plan text,
--     treatment_owner character varying(255),
--     treatment_deadline date,
--     monitoring_requirements text,
--     created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
-- );


-- ALTER TABLE org_mashreqbank.workflow_risk_assessments OWNER TO neondb_owner;

-- --
-- -- TOC entry 282 (class 1259 OID 114763)
-- -- Name: workflow_risk_assessments_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
-- --

-- CREATE SEQUENCE org_mashreqbank.workflow_risk_assessments_id_seq
--     AS integer
--     START WITH 1
--     INCREMENT BY 1
--     NO MINVALUE
--     NO MAXVALUE
--     CACHE 1;


-- ALTER SEQUENCE org_mashreqbank.workflow_risk_assessments_id_seq OWNER TO neondb_owner;

-- --
-- -- TOC entry 7142 (class 0 OID 0)
-- -- Dependencies: 282
-- -- Name: workflow_risk_assessments_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
-- --

-- ALTER SEQUENCE org_mashreqbank.workflow_risk_assessments_id_seq OWNED BY org_mashreqbank.workflow_risk_assessments.id;


-- --
-- -- TOC entry 4972 (class 2604 OID 614404)
-- -- Name: ai_analysis_results id; Type: DEFAULT; Schema: public; Owner: neondb_owner
-- --

-- ALTER TABLE ONLY org_mashreqbank.ai_analysis_results ALTER COLUMN id SET DEFAULT nextval('org_mashreqbank.ai_analysis_results_id_seq'::regclass);


-- --
-- -- TOC entry 4411 (class 2604 OID 82048)
-- -- Name: assessment_action_plans id; Type: DEFAULT; Schema: public; Owner: neondb_owner
-- --

-- ALTER TABLE ONLY org_mashreqbank.assessment_action_plans ALTER COLUMN id SET DEFAULT nextval('org_mashreqbank.assessment_action_plans_id_seq'::regclass);


-- --
-- -- TOC entry 4401 (class 2604 OID 81946)
-- -- Name: assessment_assets id; Type: DEFAULT; Schema: public; Owner: neondb_owner
-- --

-- ALTER TABLE ONLY org_mashreqbank.assessment_assets ALTER COLUMN id SET DEFAULT nextval('org_mashreqbank.assessment_assets_id_seq'::regclass);


-- --
-- -- TOC entry 4414 (class 2604 OID 82070)
-- -- Name: assessment_comments id; Type: DEFAULT; Schema: public; Owner: neondb_owner
-- --

-- ALTER TABLE ONLY org_mashreqbank.assessment_comments ALTER COLUMN id SET DEFAULT nextval('org_mashreqbank.assessment_comments_id_seq'::regclass);


-- --
-- -- TOC entry 5067 (class 2604 OID 778362)
-- -- Name: assessment_findings id; Type: DEFAULT; Schema: public; Owner: neondb_owner
-- --

-- ALTER TABLE ONLY org_mashreqbank.assessment_findings ALTER COLUMN id SET DEFAULT nextval('org_mashreqbank.assessment_findings_id_seq'::regclass);


-- --
-- -- TOC entry 4407 (class 2604 OID 81998)
-- -- Name: assessment_impacts id; Type: DEFAULT; Schema: public; Owner: neondb_owner
-- --

-- ALTER TABLE ONLY org_mashreqbank.assessment_impacts ALTER COLUMN id SET DEFAULT nextval('org_mashreqbank.assessment_impacts_id_seq'::regclass);


-- --
-- -- TOC entry 4409 (class 2604 OID 82016)
-- -- Name: assessment_risk_evaluations id; Type: DEFAULT; Schema: public; Owner: neondb_owner
-- --

-- ALTER TABLE ONLY org_mashreqbank.assessment_risk_evaluations ALTER COLUMN id SET DEFAULT nextval('org_mashreqbank.assessment_risk_evaluations_id_seq'::regclass);


-- --
-- -- TOC entry 4403 (class 2604 OID 81967)
-- -- Name: assessment_threats id; Type: DEFAULT; Schema: public; Owner: neondb_owner
-- --

-- ALTER TABLE ONLY org_mashreqbank.assessment_threats ALTER COLUMN id SET DEFAULT nextval('org_mashreqbank.assessment_threats_id_seq'::regclass);


-- --
-- -- TOC entry 4405 (class 2604 OID 81983)
-- -- Name: assessment_vulnerabilities id; Type: DEFAULT; Schema: public; Owner: neondb_owner
-- --

-- ALTER TABLE ONLY org_mashreqbank.assessment_vulnerabilities ALTER COLUMN id SET DEFAULT nextval('org_mashreqbank.assessment_vulnerabilities_id_seq'::regclass);


-- --
-- -- TOC entry 5059 (class 2604 OID 778268)
-- -- Name: assessments id; Type: DEFAULT; Schema: public; Owner: neondb_owner
-- --

-- ALTER TABLE ONLY org_mashreqbank.assessments ALTER COLUMN id SET DEFAULT nextval('org_mashreqbank.assessments_id_seq'::regclass);


-- --
-- -- TOC entry 4578 (class 2604 OID 237572)
-- -- Name: assets id; Type: DEFAULT; Schema: public; Owner: neondb_owner
-- --

-- ALTER TABLE ONLY org_mashreqbank.assets ALTER COLUMN id SET DEFAULT nextval('org_mashreqbank.assets_id_seq'::regclass);


-- --
-- -- TOC entry 4806 (class 2604 OID 450566)
-- -- Name: audit_logs id; Type: DEFAULT; Schema: public; Owner: neondb_owner
-- --

-- ALTER TABLE ONLY org_mashreqbank.audit_logs ALTER COLUMN id SET DEFAULT nextval('org_mashreqbank.audit_logs_id_seq'::regclass);


-- --
-- -- TOC entry 5141 (class 2604 OID 910666)
-- -- Name: auth_audit_log id; Type: DEFAULT; Schema: public; Owner: neondb_owner
-- --

-- ALTER TABLE ONLY org_mashreqbank.auth_audit_log ALTER COLUMN id SET DEFAULT nextval('org_mashreqbank.auth_audit_log_id_seq'::regclass);


-- --
-- -- TOC entry 4392 (class 2604 OID 24713)
-- -- Name: compliance_frameworks id; Type: DEFAULT; Schema: public; Owner: neondb_owner
-- --

-- ALTER TABLE ONLY org_mashreqbank.compliance_frameworks ALTER COLUMN id SET DEFAULT nextval('org_mashreqbank.compliance_frameworks_id_seq'::regclass);


-- --
-- -- TOC entry 4394 (class 2604 OID 24723)
-- -- Name: compliance_requirements id; Type: DEFAULT; Schema: public; Owner: neondb_owner
-- --

-- ALTER TABLE ONLY org_mashreqbank.compliance_requirements ALTER COLUMN id SET DEFAULT nextval('org_mashreqbank.compliance_requirements_id_seq'::regclass);


-- --
-- -- TOC entry 4431 (class 2604 OID 98311)
-- -- Name: comprehensive_risk_assessments id; Type: DEFAULT; Schema: public; Owner: neondb_owner
-- --

-- ALTER TABLE ONLY org_mashreqbank.comprehensive_risk_assessments ALTER COLUMN id SET DEFAULT nextval('org_mashreqbank.comprehensive_risk_assessments_id_seq'::regclass);


-- --
-- -- TOC entry 4508 (class 2604 OID 131105)
-- -- Name: control_assessments id; Type: DEFAULT; Schema: public; Owner: neondb_owner
-- --

-- ALTER TABLE ONLY org_mashreqbank.control_assessments ALTER COLUMN id SET DEFAULT nextval('org_mashreqbank.control_assessments_id_seq'::regclass);


-- --
-- -- TOC entry 4506 (class 2604 OID 131076)
-- -- Name: control_categories id; Type: DEFAULT; Schema: public; Owner: neondb_owner
-- --

-- ALTER TABLE ONLY org_mashreqbank.control_categories ALTER COLUMN id SET DEFAULT nextval('org_mashreqbank.control_categories_id_seq'::regclass);


-- --
-- -- TOC entry 4679 (class 2604 OID 286778)
-- -- Name: control_test_evidence id; Type: DEFAULT; Schema: public; Owner: neondb_owner
-- --

-- ALTER TABLE ONLY org_mashreqbank.control_test_evidence ALTER COLUMN id SET DEFAULT nextval('org_mashreqbank.control_test_evidence_id_seq'::regclass);


-- --
-- -- TOC entry 4672 (class 2604 OID 286740)
-- -- Name: control_test_executions id; Type: DEFAULT; Schema: public; Owner: neondb_owner
-- --

-- ALTER TABLE ONLY org_mashreqbank.control_test_executions ALTER COLUMN id SET DEFAULT nextval('org_mashreqbank.control_test_executions_id_seq'::regclass);


-- --
-- -- TOC entry 4675 (class 2604 OID 286761)
-- -- Name: control_test_issues id; Type: DEFAULT; Schema: public; Owner: neondb_owner
-- --

-- ALTER TABLE ONLY org_mashreqbank.control_test_issues ALTER COLUMN id SET DEFAULT nextval('org_mashreqbank.control_test_issues_id_seq'::regclass);


-- --
-- -- TOC entry 4669 (class 2604 OID 286724)
-- -- Name: control_test_plans id; Type: DEFAULT; Schema: public; Owner: neondb_owner
-- --

-- ALTER TABLE ONLY org_mashreqbank.control_test_plans ALTER COLUMN id SET DEFAULT nextval('org_mashreqbank.control_test_plans_id_seq'::regclass);


-- --
-- -- TOC entry 4681 (class 2604 OID 286793)
-- -- Name: control_test_schedule id; Type: DEFAULT; Schema: public; Owner: neondb_owner
-- --

-- ALTER TABLE ONLY org_mashreqbank.control_test_schedule ALTER COLUMN id SET DEFAULT nextval('org_mashreqbank.control_test_schedule_id_seq'::regclass);


-- --
-- -- TOC entry 4517 (class 2604 OID 131144)
-- -- Name: control_testing_schedule id; Type: DEFAULT; Schema: public; Owner: neondb_owner
-- --

-- ALTER TABLE ONLY org_mashreqbank.control_testing_schedule ALTER COLUMN id SET DEFAULT nextval('org_mashreqbank.control_testing_schedule_id_seq'::regclass);


-- --
-- -- TOC entry 4381 (class 2604 OID 24627)
-- -- Name: controls id; Type: DEFAULT; Schema: public; Owner: neondb_owner
-- --

-- ALTER TABLE ONLY org_mashreqbank.controls ALTER COLUMN id SET DEFAULT nextval('org_mashreqbank.controls_id_seq'::regclass);


-- --
-- -- TOC entry 4389 (class 2604 OID 24684)
-- -- Name: cybersecurity_assessments id; Type: DEFAULT; Schema: public; Owner: neondb_owner
-- --

-- ALTER TABLE ONLY org_mashreqbank.cybersecurity_assessments ALTER COLUMN id SET DEFAULT nextval('org_mashreqbank.cybersecurity_assessments_id_seq'::regclass);


-- --
-- -- TOC entry 5111 (class 2604 OID 802820)
-- -- Name: database_tables id; Type: DEFAULT; Schema: public; Owner: neondb_owner
-- --

-- ALTER TABLE ONLY org_mashreqbank.database_tables ALTER COLUMN id SET DEFAULT nextval('org_mashreqbank.database_tables_id_seq'::regclass);


-- --
-- -- TOC entry 4822 (class 2604 OID 516179)
-- -- Name: departments id; Type: DEFAULT; Schema: public; Owner: neondb_owner
-- --

-- ALTER TABLE ONLY org_mashreqbank.departments ALTER COLUMN id SET DEFAULT nextval('org_mashreqbank.departments_id_seq'::regclass);


-- --
-- -- TOC entry 4870 (class 2604 OID 532677)
-- -- Name: document_access_log id; Type: DEFAULT; Schema: public; Owner: neondb_owner
-- --

-- ALTER TABLE ONLY org_mashreqbank.document_access_log ALTER COLUMN id SET DEFAULT nextval('org_mashreqbank.document_access_log_id_seq'::regclass);


-- --
-- -- TOC entry 4834 (class 2604 OID 532484)
-- -- Name: document_categories id; Type: DEFAULT; Schema: public; Owner: neondb_owner
-- --

-- ALTER TABLE ONLY org_mashreqbank.document_categories ALTER COLUMN id SET DEFAULT nextval('org_mashreqbank.document_categories_id_seq'::regclass);


-- --
-- -- TOC entry 4857 (class 2604 OID 532585)
-- -- Name: document_control_mappings id; Type: DEFAULT; Schema: public; Owner: neondb_owner
-- --

-- ALTER TABLE ONLY org_mashreqbank.document_control_mappings ALTER COLUMN id SET DEFAULT nextval('org_mashreqbank.document_control_mappings_id_seq'::regclass);


-- --
-- -- TOC entry 4863 (class 2604 OID 532628)
-- -- Name: document_finding_mappings id; Type: DEFAULT; Schema: public; Owner: neondb_owner
-- --

-- ALTER TABLE ONLY org_mashreqbank.document_finding_mappings ALTER COLUMN id SET DEFAULT nextval('org_mashreqbank.document_finding_mappings_id_seq'::regclass);


-- --
-- -- TOC entry 4855 (class 2604 OID 532562)
-- -- Name: document_relationships id; Type: DEFAULT; Schema: public; Owner: neondb_owner
-- --

-- ALTER TABLE ONLY org_mashreqbank.document_relationships ALTER COLUMN id SET DEFAULT nextval('org_mashreqbank.document_relationships_id_seq'::regclass);


-- --
-- -- TOC entry 4867 (class 2604 OID 532654)
-- -- Name: document_review_history id; Type: DEFAULT; Schema: public; Owner: neondb_owner
-- --

-- ALTER TABLE ONLY org_mashreqbank.document_review_history ALTER COLUMN id SET DEFAULT nextval('org_mashreqbank.document_review_history_id_seq'::regclass);


-- --
-- -- TOC entry 4860 (class 2604 OID 532610)
-- -- Name: document_risk_mappings id; Type: DEFAULT; Schema: public; Owner: neondb_owner
-- --

-- ALTER TABLE ONLY org_mashreqbank.document_risk_mappings ALTER COLUMN id SET DEFAULT nextval('org_mashreqbank.document_risk_mappings_id_seq'::regclass);


-- --
-- -- TOC entry 4880 (class 2604 OID 540709)
-- -- Name: evidence id; Type: DEFAULT; Schema: public; Owner: neondb_owner
-- --

-- ALTER TABLE ONLY org_mashreqbank.evidence ALTER COLUMN id SET DEFAULT nextval('org_mashreqbank.evidence_id_seq'::regclass);


-- --
-- -- TOC entry 4851 (class 2604 OID 532546)
-- -- Name: evidence_library id; Type: DEFAULT; Schema: public; Owner: neondb_owner
-- --

-- ALTER TABLE ONLY org_mashreqbank.evidence_library ALTER COLUMN id SET DEFAULT nextval('org_mashreqbank.evidence_library_id_seq'::regclass);


-- --
-- -- TOC entry 4995 (class 2604 OID 679962)
-- -- Name: fair_risk_treatment_controls id; Type: DEFAULT; Schema: public; Owner: neondb_owner
-- --

-- ALTER TABLE ONLY org_mashreqbank.fair_risk_treatment_controls ALTER COLUMN id SET DEFAULT nextval('org_mashreqbank.fair_risk_treatment_controls_id_seq'::regclass);


-- --
-- -- TOC entry 4988 (class 2604 OID 679940)
-- -- Name: fair_risk_treatment_plans id; Type: DEFAULT; Schema: public; Owner: neondb_owner
-- --

-- ALTER TABLE ONLY org_mashreqbank.fair_risk_treatment_plans ALTER COLUMN id SET DEFAULT nextval('org_mashreqbank.fair_risk_treatment_plans_id_seq'::regclass);


-- --
-- -- TOC entry 5002 (class 2604 OID 679987)
-- -- Name: fair_risk_treatment_tracking id; Type: DEFAULT; Schema: public; Owner: neondb_owner
-- --

-- ALTER TABLE ONLY org_mashreqbank.fair_risk_treatment_tracking ALTER COLUMN id SET DEFAULT nextval('org_mashreqbank.fair_risk_treatment_tracking_id_seq'::regclass);


-- --
-- -- TOC entry 4975 (class 2604 OID 638980)
-- -- Name: fair_risks id; Type: DEFAULT; Schema: public; Owner: neondb_owner
-- --

-- ALTER TABLE ONLY org_mashreqbank.fair_risks ALTER COLUMN id SET DEFAULT nextval('org_mashreqbank.fair_risks_id_seq'::regclass);


-- --
-- -- TOC entry 4894 (class 2604 OID 548887)
-- -- Name: hipaa_assessment_requirements id; Type: DEFAULT; Schema: public; Owner: neondb_owner
-- --

-- ALTER TABLE ONLY org_mashreqbank.hipaa_assessment_requirements ALTER COLUMN id SET DEFAULT nextval('org_mashreqbank.hipaa_assessment_requirements_id_seq'::regclass);


-- --
-- -- TOC entry 4966 (class 2604 OID 598020)
-- -- Name: hipaa_assessment_results id; Type: DEFAULT; Schema: public; Owner: neondb_owner
-- --

-- ALTER TABLE ONLY org_mashreqbank.hipaa_assessment_results ALTER COLUMN id SET DEFAULT nextval('org_mashreqbank.hipaa_assessment_results_id_seq'::regclass);


-- --
-- -- TOC entry 4888 (class 2604 OID 548868)
-- -- Name: hipaa_assessments id; Type: DEFAULT; Schema: public; Owner: neondb_owner
-- --

-- ALTER TABLE ONLY org_mashreqbank.hipaa_assessments ALTER COLUMN id SET DEFAULT nextval('org_mashreqbank.hipaa_assessments_id_seq'::regclass);


-- --
-- -- TOC entry 4741 (class 2604 OID 385044)
-- -- Name: hipaa_compliance_tests id; Type: DEFAULT; Schema: public; Owner: neondb_owner
-- --

-- ALTER TABLE ONLY org_mashreqbank.hipaa_compliance_tests ALTER COLUMN id SET DEFAULT nextval('org_mashreqbank.hipaa_compliance_tests_id_seq'::regclass);


-- --
-- -- TOC entry 4735 (class 2604 OID 385028)
-- -- Name: hipaa_controls id; Type: DEFAULT; Schema: public; Owner: neondb_owner
-- --

-- ALTER TABLE ONLY org_mashreqbank.hipaa_controls ALTER COLUMN id SET DEFAULT nextval('org_mashreqbank.hipaa_controls_id_seq'::regclass);


-- --
-- -- TOC entry 4921 (class 2604 OID 573502)
-- -- Name: hipaa_remediation_actions id; Type: DEFAULT; Schema: public; Owner: neondb_owner
-- --

-- ALTER TABLE ONLY org_mashreqbank.hipaa_remediation_actions ALTER COLUMN id SET DEFAULT nextval('org_mashreqbank.hipaa_remediation_actions_id_seq'::regclass);


-- --
-- -- TOC entry 4898 (class 2604 OID 557060)
-- -- Name: hipaa_requirements id; Type: DEFAULT; Schema: public; Owner: neondb_owner
-- --

-- ALTER TABLE ONLY org_mashreqbank.hipaa_requirements ALTER COLUMN id SET DEFAULT nextval('org_mashreqbank.hipaa_requirements_id_seq'::regclass);


-- --
-- -- TOC entry 4385 (class 2604 OID 24660)
-- -- Name: incidents id; Type: DEFAULT; Schema: public; Owner: neondb_owner
-- --

-- ALTER TABLE ONLY org_mashreqbank.incidents ALTER COLUMN id SET DEFAULT nextval('org_mashreqbank.incidents_id_seq'::regclass);


-- --
-- -- TOC entry 4372 (class 2604 OID 40960)
-- -- Name: information_assets id; Type: DEFAULT; Schema: public; Owner: neondb_owner
-- --

-- ALTER TABLE ONLY org_mashreqbank.information_assets ALTER COLUMN id SET DEFAULT nextval('org_mashreqbank.information_assets_id_seq'::regclass);


-- --
-- -- TOC entry 4469 (class 2604 OID 122887)
-- -- Name: information_assets_detailed id; Type: DEFAULT; Schema: public; Owner: neondb_owner
-- --

-- ALTER TABLE ONLY org_mashreqbank.information_assets_detailed ALTER COLUMN id SET DEFAULT nextval('org_mashreqbank.information_assets_detailed_id_seq'::regclass);


-- --
-- -- TOC entry 5054 (class 2604 OID 761860)
-- -- Name: iso27001_control_effectiveness id; Type: DEFAULT; Schema: public; Owner: neondb_owner
-- --

-- ALTER TABLE ONLY org_mashreqbank.iso27001_control_effectiveness ALTER COLUMN id SET DEFAULT nextval('org_mashreqbank.iso27001_control_effectiveness_id_seq'::regclass);


-- --
-- -- TOC entry 4816 (class 2604 OID 483379)
-- -- Name: iso27001_controls id; Type: DEFAULT; Schema: public; Owner: neondb_owner
-- --

-- ALTER TABLE ONLY org_mashreqbank.iso27001_controls ALTER COLUMN id SET DEFAULT nextval('org_mashreqbank.iso27001_controls_id_seq'::regclass);


-- --
-- -- TOC entry 5074 (class 2604 OID 786436)
-- -- Name: iso27001_evidence id; Type: DEFAULT; Schema: public; Owner: neondb_owner
-- --

-- ALTER TABLE ONLY org_mashreqbank.iso27001_evidence ALTER COLUMN id SET DEFAULT nextval('org_mashreqbank.iso27001_evidence_id_seq'::regclass);


-- --
-- -- TOC entry 4693 (class 2604 OID 311300)
-- -- Name: iso27001_risk_assessments id; Type: DEFAULT; Schema: public; Owner: neondb_owner
-- --

-- ALTER TABLE ONLY org_mashreqbank.iso27001_risk_assessments ALTER COLUMN id SET DEFAULT nextval('org_mashreqbank.iso27001_risk_assessments_id_seq'::regclass);


-- --
-- -- TOC entry 4818 (class 2604 OID 483391)
-- -- Name: iso27001_risk_controls id; Type: DEFAULT; Schema: public; Owner: neondb_owner
-- --

-- ALTER TABLE ONLY org_mashreqbank.iso27001_risk_controls ALTER COLUMN id SET DEFAULT nextval('org_mashreqbank.iso27001_risk_controls_id_seq'::regclass);


-- --
-- -- TOC entry 4489 (class 2604 OID 123016)
-- -- Name: iso27001_risk_metrics id; Type: DEFAULT; Schema: public; Owner: neondb_owner
-- --

-- ALTER TABLE ONLY org_mashreqbank.iso27001_risk_metrics ALTER COLUMN id SET DEFAULT nextval('org_mashreqbank.iso27001_risk_metrics_id_seq'::regclass);


-- --
-- -- TOC entry 4486 (class 2604 OID 123000)
-- -- Name: iso27001_risk_reviews id; Type: DEFAULT; Schema: public; Owner: neondb_owner
-- --

-- ALTER TABLE ONLY org_mashreqbank.iso27001_risk_reviews ALTER COLUMN id SET DEFAULT nextval('org_mashreqbank.iso27001_risk_reviews_id_seq'::regclass);


-- --
-- -- TOC entry 4478 (class 2604 OID 122944)
-- -- Name: iso27001_risk_scenarios id; Type: DEFAULT; Schema: public; Owner: neondb_owner
-- --

-- ALTER TABLE ONLY org_mashreqbank.iso27001_risk_scenarios ALTER COLUMN id SET DEFAULT nextval('org_mashreqbank.iso27001_risk_scenarios_id_seq'::regclass);


-- --
-- -- TOC entry 4482 (class 2604 OID 122978)
-- -- Name: iso27001_risk_treatment_plans id; Type: DEFAULT; Schema: public; Owner: neondb_owner
-- --

-- ALTER TABLE ONLY org_mashreqbank.iso27001_risk_treatment_plans ALTER COLUMN id SET DEFAULT nextval('org_mashreqbank.iso27001_risk_treatment_plans_id_seq'::regclass);


-- --
-- -- TOC entry 4809 (class 2604 OID 483332)
-- -- Name: iso27001_risks id; Type: DEFAULT; Schema: public; Owner: neondb_owner
-- --

-- ALTER TABLE ONLY org_mashreqbank.iso27001_risks ALTER COLUMN id SET DEFAULT nextval('org_mashreqbank.iso27001_risks_id_seq'::regclass);


-- --
-- -- TOC entry 4689 (class 2604 OID 303198)
-- -- Name: iso27001_sub_controls id; Type: DEFAULT; Schema: public; Owner: neondb_owner
-- --

-- ALTER TABLE ONLY org_mashreqbank.iso27001_sub_controls ALTER COLUMN id SET DEFAULT nextval('org_mashreqbank.iso27001_sub_controls_id_seq'::regclass);


-- --
-- -- TOC entry 4472 (class 2604 OID 122903)
-- -- Name: iso27001_threat_categories id; Type: DEFAULT; Schema: public; Owner: neondb_owner
-- --

-- ALTER TABLE ONLY org_mashreqbank.iso27001_threat_categories ALTER COLUMN id SET DEFAULT nextval('org_mashreqbank.iso27001_threat_categories_id_seq'::regclass);


-- --
-- -- TOC entry 4474 (class 2604 OID 122915)
-- -- Name: iso27001_threats id; Type: DEFAULT; Schema: public; Owner: neondb_owner
-- --

-- ALTER TABLE ONLY org_mashreqbank.iso27001_threats ALTER COLUMN id SET DEFAULT nextval('org_mashreqbank.iso27001_threats_id_seq'::regclass);


-- --
-- -- TOC entry 5022 (class 2604 OID 688169)
-- -- Name: iso27001_treatment_controls id; Type: DEFAULT; Schema: public; Owner: neondb_owner
-- --

-- ALTER TABLE ONLY org_mashreqbank.iso27001_treatment_controls ALTER COLUMN id SET DEFAULT nextval('org_mashreqbank.iso27001_treatment_controls_id_seq'::regclass);


-- --
-- -- TOC entry 5005 (class 2604 OID 688132)
-- -- Name: iso27001_treatment_plans id; Type: DEFAULT; Schema: public; Owner: neondb_owner
-- --

-- ALTER TABLE ONLY org_mashreqbank.iso27001_treatment_plans ALTER COLUMN id SET DEFAULT nextval('org_mashreqbank.iso27001_treatment_plans_id_seq'::regclass);


-- --
-- -- TOC entry 5033 (class 2604 OID 688200)
-- -- Name: iso27001_treatment_tracking id; Type: DEFAULT; Schema: public; Owner: neondb_owner
-- --

-- ALTER TABLE ONLY org_mashreqbank.iso27001_treatment_tracking ALTER COLUMN id SET DEFAULT nextval('org_mashreqbank.iso27001_treatment_tracking_id_seq'::regclass);


-- --
-- -- TOC entry 5077 (class 2604 OID 786452)
-- -- Name: iso27001_validation_rules id; Type: DEFAULT; Schema: public; Owner: neondb_owner
-- --

-- ALTER TABLE ONLY org_mashreqbank.iso27001_validation_rules ALTER COLUMN id SET DEFAULT nextval('org_mashreqbank.iso27001_validation_rules_id_seq'::regclass);


-- --
-- -- TOC entry 4476 (class 2604 OID 122932)
-- -- Name: iso27001_vulnerabilities id; Type: DEFAULT; Schema: public; Owner: neondb_owner
-- --

-- ALTER TABLE ONLY org_mashreqbank.iso27001_vulnerabilities ALTER COLUMN id SET DEFAULT nextval('org_mashreqbank.iso27001_vulnerabilities_id_seq'::regclass);


-- --
-- -- TOC entry 4520 (class 2604 OID 147460)
-- -- Name: iso27002_control_categories id; Type: DEFAULT; Schema: public; Owner: neondb_owner
-- --

-- ALTER TABLE ONLY org_mashreqbank.iso27002_control_categories ALTER COLUMN id SET DEFAULT nextval('org_mashreqbank.iso27002_control_categories_id_seq'::regclass);


-- --
-- -- TOC entry 4524 (class 2604 OID 147473)
-- -- Name: iso27002_controls id; Type: DEFAULT; Schema: public; Owner: neondb_owner
-- --

-- ALTER TABLE ONLY org_mashreqbank.iso27002_controls ALTER COLUMN id SET DEFAULT nextval('org_mashreqbank.iso27002_controls_id_seq'::regclass);


-- --
-- -- TOC entry 5143 (class 2604 OID 925718)
-- -- Name: login_attempts id; Type: DEFAULT; Schema: public; Owner: neondb_owner
-- --

-- ALTER TABLE ONLY org_mashreqbank.login_attempts ALTER COLUMN id SET DEFAULT nextval('org_mashreqbank.login_attempts_id_seq'::regclass);


-- --
-- -- TOC entry 4424 (class 2604 OID 90146)
-- -- Name: mitigation_actions id; Type: DEFAULT; Schema: public; Owner: neondb_owner
-- --

-- ALTER TABLE ONLY org_mashreqbank.mitigation_actions ALTER COLUMN id SET DEFAULT nextval('org_mashreqbank.mitigation_actions_id_seq'::regclass);


-- --
-- -- TOC entry 4914 (class 2604 OID 565324)
-- -- Name: nesa_uae_assessment_results id; Type: DEFAULT; Schema: public; Owner: neondb_owner
-- --

-- ALTER TABLE ONLY org_mashreqbank.nesa_uae_assessment_results ALTER COLUMN id SET DEFAULT nextval('org_mashreqbank.nesa_uae_assessment_results_id_seq'::regclass);


-- --
-- -- TOC entry 4903 (class 2604 OID 565272)
-- -- Name: nesa_uae_assessments id; Type: DEFAULT; Schema: public; Owner: neondb_owner
-- --

-- ALTER TABLE ONLY org_mashreqbank.nesa_uae_assessments ALTER COLUMN id SET DEFAULT nextval('org_mashreqbank.nesa_uae_assessments_id_seq'::regclass);


-- --
-- -- TOC entry 4962 (class 2604 OID 589864)
-- -- Name: nesa_uae_gap_analysis id; Type: DEFAULT; Schema: public; Owner: neondb_owner
-- --

-- ALTER TABLE ONLY org_mashreqbank.nesa_uae_gap_analysis ALTER COLUMN id SET DEFAULT nextval('org_mashreqbank.nesa_uae_gap_analysis_id_seq'::regclass);


-- --
-- -- TOC entry 5046 (class 2604 OID 753671)
-- -- Name: nesa_uae_remediation_actions id; Type: DEFAULT; Schema: public; Owner: neondb_owner
-- --

-- ALTER TABLE ONLY org_mashreqbank.nesa_uae_remediation_actions ALTER COLUMN id SET DEFAULT nextval('org_mashreqbank.nesa_uae_remediation_actions_id_seq'::regclass);


-- --
-- -- TOC entry 4919 (class 2604 OID 565402)
-- -- Name: nesa_uae_remediation_dependencies id; Type: DEFAULT; Schema: public; Owner: neondb_owner
-- --

-- ALTER TABLE ONLY org_mashreqbank.nesa_uae_remediation_dependencies ALTER COLUMN id SET DEFAULT nextval('org_mashreqbank.nesa_uae_remediation_dependencies_id_seq'::regclass);


-- --
-- -- TOC entry 4917 (class 2604 OID 565387)
-- -- Name: nesa_uae_remediation_updates id; Type: DEFAULT; Schema: public; Owner: neondb_owner
-- --

-- ALTER TABLE ONLY org_mashreqbank.nesa_uae_remediation_updates ALTER COLUMN id SET DEFAULT nextval('org_mashreqbank.nesa_uae_remediation_updates_id_seq'::regclass);


-- --
-- -- TOC entry 4910 (class 2604 OID 565310)
-- -- Name: nesa_uae_requirements id; Type: DEFAULT; Schema: public; Owner: neondb_owner
-- --

-- ALTER TABLE ONLY org_mashreqbank.nesa_uae_requirements ALTER COLUMN id SET DEFAULT nextval('org_mashreqbank.nesa_uae_requirements_id_seq'::regclass);


-- --
-- -- TOC entry 4947 (class 2604 OID 581665)
-- -- Name: nesa_uae_self_assessment_audit_log id; Type: DEFAULT; Schema: public; Owner: neondb_owner
-- --

-- ALTER TABLE ONLY org_mashreqbank.nesa_uae_self_assessment_audit_log ALTER COLUMN id SET DEFAULT nextval('org_mashreqbank.nesa_uae_self_assessment_audit_log_id_seq'::regclass);


-- --
-- -- TOC entry 4949 (class 2604 OID 581683)
-- -- Name: nesa_uae_self_assessment_controls id; Type: DEFAULT; Schema: public; Owner: neondb_owner
-- --

-- ALTER TABLE ONLY org_mashreqbank.nesa_uae_self_assessment_controls ALTER COLUMN id SET DEFAULT nextval('org_mashreqbank.nesa_uae_self_assessment_controls_id_seq'::regclass);


-- --
-- -- TOC entry 4931 (class 2604 OID 581636)
-- -- Name: nesa_uae_self_assessments id; Type: DEFAULT; Schema: public; Owner: neondb_owner
-- --

-- ALTER TABLE ONLY org_mashreqbank.nesa_uae_self_assessments ALTER COLUMN id SET DEFAULT nextval('org_mashreqbank.nesa_uae_self_assessments_id_seq'::regclass);


-- --
-- -- TOC entry 4534 (class 2604 OID 163858)
-- -- Name: nist_csf_categories id; Type: DEFAULT; Schema: public; Owner: neondb_owner
-- --

-- ALTER TABLE ONLY org_mashreqbank.nist_csf_categories ALTER COLUMN id SET DEFAULT nextval('org_mashreqbank.nist_csf_categories_id_seq'::regclass);


-- --
-- -- TOC entry 4530 (class 2604 OID 163844)
-- -- Name: nist_csf_functions id; Type: DEFAULT; Schema: public; Owner: neondb_owner
-- --

-- ALTER TABLE ONLY org_mashreqbank.nist_csf_functions ALTER COLUMN id SET DEFAULT nextval('org_mashreqbank.nist_csf_functions_id_seq'::regclass);


-- --
-- -- TOC entry 4557 (class 2604 OID 163954)
-- -- Name: nist_csf_implementation_tiers id; Type: DEFAULT; Schema: public; Owner: neondb_owner
-- --

-- ALTER TABLE ONLY org_mashreqbank.nist_csf_implementation_tiers ALTER COLUMN id SET DEFAULT nextval('org_mashreqbank.nist_csf_implementation_tiers_id_seq'::regclass);


-- --
-- -- TOC entry 5038 (class 2604 OID 696324)
-- -- Name: nist_csf_mitigation_plans id; Type: DEFAULT; Schema: public; Owner: neondb_owner
-- --

-- ALTER TABLE ONLY org_mashreqbank.nist_csf_mitigation_plans ALTER COLUMN id SET DEFAULT nextval('org_mashreqbank.nist_csf_mitigation_plans_id_seq'::regclass);


-- --
-- -- TOC entry 4560 (class 2604 OID 163968)
-- -- Name: nist_csf_organizational_profiles id; Type: DEFAULT; Schema: public; Owner: neondb_owner
-- --

-- ALTER TABLE ONLY org_mashreqbank.nist_csf_organizational_profiles ALTER COLUMN id SET DEFAULT nextval('org_mashreqbank.nist_csf_organizational_profiles_id_seq'::regclass);


-- --
-- -- TOC entry 4565 (class 2604 OID 163981)
-- -- Name: nist_csf_risk_scenarios id; Type: DEFAULT; Schema: public; Owner: neondb_owner
-- --

-- ALTER TABLE ONLY org_mashreqbank.nist_csf_risk_scenarios ALTER COLUMN id SET DEFAULT nextval('org_mashreqbank.nist_csf_risk_scenarios_id_seq'::regclass);


-- --
-- -- TOC entry 4542 (class 2604 OID 163896)
-- -- Name: nist_csf_risk_templates id; Type: DEFAULT; Schema: public; Owner: neondb_owner
-- --

-- ALTER TABLE ONLY org_mashreqbank.nist_csf_risk_templates ALTER COLUMN id SET DEFAULT nextval('org_mashreqbank.nist_csf_risk_templates_id_seq'::regclass);


-- --
-- -- TOC entry 4538 (class 2604 OID 163877)
-- -- Name: nist_csf_subcategories id; Type: DEFAULT; Schema: public; Owner: neondb_owner
-- --

-- ALTER TABLE ONLY org_mashreqbank.nist_csf_subcategories ALTER COLUMN id SET DEFAULT nextval('org_mashreqbank.nist_csf_subcategories_id_seq'::regclass);


-- --
-- -- TOC entry 4551 (class 2604 OID 163927)
-- -- Name: nist_csf_template_controls id; Type: DEFAULT; Schema: public; Owner: neondb_owner
-- --

-- ALTER TABLE ONLY org_mashreqbank.nist_csf_template_controls ALTER COLUMN id SET DEFAULT nextval('org_mashreqbank.nist_csf_template_controls_id_seq'::regclass);


-- --
-- -- TOC entry 4724 (class 2604 OID 344159)
-- -- Name: nist_references id; Type: DEFAULT; Schema: public; Owner: neondb_owner
-- --

-- ALTER TABLE ONLY org_mashreqbank.nist_references ALTER COLUMN id SET DEFAULT nextval('org_mashreqbank.nist_references_id_seq'::regclass);


-- --
-- -- TOC entry 5135 (class 2604 OID 860198)
-- -- Name: organization_sla_config id; Type: DEFAULT; Schema: public; Owner: neondb_owner
-- --

-- ALTER TABLE ONLY org_mashreqbank.organization_sla_config ALTER COLUMN id SET DEFAULT nextval('org_mashreqbank.organization_sla_config_id_seq'::regclass);


-- --
-- -- TOC entry 4396 (class 2604 OID 516116)
-- -- Name: organizations id; Type: DEFAULT; Schema: public; Owner: neondb_owner
-- --

-- ALTER TABLE ONLY org_mashreqbank.organizations ALTER COLUMN id SET DEFAULT nextval('org_mashreqbank.organizations_id_seq'::regclass);


-- --
-- -- TOC entry 5087 (class 2604 OID 794642)
-- -- Name: pages id; Type: DEFAULT; Schema: public; Owner: neondb_owner
-- --

-- ALTER TABLE ONLY org_mashreqbank.pages ALTER COLUMN id SET DEFAULT nextval('org_mashreqbank.pages_id_seq'::regclass);


-- --
-- -- TOC entry 5099 (class 2604 OID 794766)
-- -- Name: permissions id; Type: DEFAULT; Schema: public; Owner: neondb_owner
-- --

-- ALTER TABLE ONLY org_mashreqbank.permissions ALTER COLUMN id SET DEFAULT nextval('org_mashreqbank.permissions_id_seq'::regclass);


-- --
-- -- TOC entry 4662 (class 2604 OID 278725)
-- -- Name: phishing_simulation_results id; Type: DEFAULT; Schema: public; Owner: neondb_owner
-- --

-- ALTER TABLE ONLY org_mashreqbank.phishing_simulation_results ALTER COLUMN id SET DEFAULT nextval('org_mashreqbank.phishing_simulation_results_id_seq'::regclass);


-- --
-- -- TOC entry 4654 (class 2604 OID 278709)
-- -- Name: phishing_simulations id; Type: DEFAULT; Schema: public; Owner: neondb_owner
-- --

-- ALTER TABLE ONLY org_mashreqbank.phishing_simulations ALTER COLUMN id SET DEFAULT nextval('org_mashreqbank.phishing_simulations_id_seq'::regclass);


-- --
-- -- TOC entry 4371 (class 2604 OID 16483)
-- -- Name: playing_with_neon id; Type: DEFAULT; Schema: public; Owner: neondb_owner
-- --

-- ALTER TABLE ONLY org_mashreqbank.playing_with_neon ALTER COLUMN id SET DEFAULT nextval('org_mashreqbank.playing_with_neon_id_seq'::regclass);


-- --
-- -- TOC entry 4872 (class 2604 OID 540676)
-- -- Name: policies id; Type: DEFAULT; Schema: public; Owner: neondb_owner
-- --

-- ALTER TABLE ONLY org_mashreqbank.policies ALTER COLUMN id SET DEFAULT nextval('org_mashreqbank.policies_id_seq'::regclass);


-- --
-- -- TOC entry 4845 (class 2604 OID 532523)
-- -- Name: policy_document_versions id; Type: DEFAULT; Schema: public; Owner: neondb_owner
-- --

-- ALTER TABLE ONLY org_mashreqbank.policy_document_versions ALTER COLUMN id SET DEFAULT nextval('org_mashreqbank.policy_document_versions_id_seq'::regclass);


-- --
-- -- TOC entry 4839 (class 2604 OID 532499)
-- -- Name: policy_documents id; Type: DEFAULT; Schema: public; Owner: neondb_owner
-- --

-- ALTER TABLE ONLY org_mashreqbank.policy_documents ALTER COLUMN id SET DEFAULT nextval('org_mashreqbank.policy_documents_id_seq'::regclass);


-- --
-- -- TOC entry 4885 (class 2604 OID 540726)
-- -- Name: policy_evidence_links id; Type: DEFAULT; Schema: public; Owner: neondb_owner
-- --

-- ALTER TABLE ONLY org_mashreqbank.policy_evidence_links ALTER COLUMN id SET DEFAULT nextval('org_mashreqbank.policy_evidence_links_id_seq'::regclass);


-- --
-- -- TOC entry 4878 (class 2604 OID 540694)
-- -- Name: policy_versions id; Type: DEFAULT; Schema: public; Owner: neondb_owner
-- --

-- ALTER TABLE ONLY org_mashreqbank.policy_versions ALTER COLUMN id SET DEFAULT nextval('org_mashreqbank.policy_versions_id_seq'::regclass);


-- --
-- -- TOC entry 4630 (class 2604 OID 278648)
-- -- Name: quiz_attempts id; Type: DEFAULT; Schema: public; Owner: neondb_owner
-- --

-- ALTER TABLE ONLY org_mashreqbank.quiz_attempts ALTER COLUMN id SET DEFAULT nextval('org_mashreqbank.quiz_attempts_id_seq'::regclass);


-- --
-- -- TOC entry 4611 (class 2604 OID 278585)
-- -- Name: quiz_questions id; Type: DEFAULT; Schema: public; Owner: neondb_owner
-- --

-- ALTER TABLE ONLY org_mashreqbank.quiz_questions ALTER COLUMN id SET DEFAULT nextval('org_mashreqbank.quiz_questions_id_seq'::regclass);


-- --
-- -- TOC entry 4686 (class 2604 OID 294916)
-- -- Name: report_downloads id; Type: DEFAULT; Schema: public; Owner: neondb_owner
-- --

-- ALTER TABLE ONLY org_mashreqbank.report_downloads ALTER COLUMN id SET DEFAULT nextval('org_mashreqbank.report_downloads_id_seq'::regclass);


-- --
-- -- TOC entry 4513 (class 2604 OID 131129)
-- -- Name: residual_risk_calculations id; Type: DEFAULT; Schema: public; Owner: neondb_owner
-- --

-- ALTER TABLE ONLY org_mashreqbank.residual_risk_calculations ALTER COLUMN id SET DEFAULT nextval('org_mashreqbank.residual_risk_calculations_id_seq'::regclass);


-- --
-- -- TOC entry 4701 (class 2604 OID 311341)
-- -- Name: risk_action_plans id; Type: DEFAULT; Schema: public; Owner: neondb_owner
-- --

-- ALTER TABLE ONLY org_mashreqbank.risk_action_plans ALTER COLUMN id SET DEFAULT nextval('org_mashreqbank.risk_action_plans_id_seq'::regclass);


-- --
-- -- TOC entry 4458 (class 2604 OID 114737)
-- -- Name: risk_assessment_context id; Type: DEFAULT; Schema: public; Owner: neondb_owner
-- --

-- ALTER TABLE ONLY org_mashreqbank.risk_assessment_context ALTER COLUMN id SET DEFAULT nextval('org_mashreqbank.risk_assessment_context_id_seq'::regclass);


-- --
-- -- TOC entry 4698 (class 2604 OID 311323)
-- -- Name: risk_assessment_controls id; Type: DEFAULT; Schema: public; Owner: neondb_owner
-- --

-- ALTER TABLE ONLY org_mashreqbank.risk_assessment_controls ALTER COLUMN id SET DEFAULT nextval('org_mashreqbank.risk_assessment_controls_id_seq'::regclass);


-- --
-- -- TOC entry 4460 (class 2604 OID 114752)
-- -- Name: risk_assessment_criteria id; Type: DEFAULT; Schema: public; Owner: neondb_owner
-- --

-- ALTER TABLE ONLY org_mashreqbank.risk_assessment_criteria ALTER COLUMN id SET DEFAULT nextval('org_mashreqbank.risk_assessment_criteria_id_seq'::regclass);


-- --
-- -- TOC entry 4443 (class 2604 OID 98388)
-- -- Name: risk_assessment_history id; Type: DEFAULT; Schema: public; Owner: neondb_owner
-- --

-- ALTER TABLE ONLY org_mashreqbank.risk_assessment_history ALTER COLUMN id SET DEFAULT nextval('org_mashreqbank.risk_assessment_history_id_seq'::regclass);


-- --
-- -- TOC entry 4464 (class 2604 OID 114787)
-- -- Name: risk_assessment_reviews id; Type: DEFAULT; Schema: public; Owner: neondb_owner
-- --

-- ALTER TABLE ONLY org_mashreqbank.risk_assessment_reviews ALTER COLUMN id SET DEFAULT nextval('org_mashreqbank.risk_assessment_reviews_id_seq'::regclass);


-- --
-- -- TOC entry 4456 (class 2604 OID 114722)
-- -- Name: risk_assessment_scope id; Type: DEFAULT; Schema: public; Owner: neondb_owner
-- --

-- ALTER TABLE ONLY org_mashreqbank.risk_assessment_scope ALTER COLUMN id SET DEFAULT nextval('org_mashreqbank.risk_assessment_scope_id_seq'::regclass);


-- --
-- -- TOC entry 4453 (class 2604 OID 114706)
-- -- Name: risk_assessment_steps id; Type: DEFAULT; Schema: public; Owner: neondb_owner
-- --

-- ALTER TABLE ONLY org_mashreqbank.risk_assessment_steps ALTER COLUMN id SET DEFAULT nextval('org_mashreqbank.risk_assessment_steps_id_seq'::regclass);


-- --
-- -- TOC entry 4466 (class 2604 OID 114802)
-- -- Name: risk_assessment_templates id; Type: DEFAULT; Schema: public; Owner: neondb_owner
-- --

-- ALTER TABLE ONLY org_mashreqbank.risk_assessment_templates ALTER COLUMN id SET DEFAULT nextval('org_mashreqbank.risk_assessment_templates_id_seq'::regclass);


-- --
-- -- TOC entry 4449 (class 2604 OID 114692)
-- -- Name: risk_assessment_workflows id; Type: DEFAULT; Schema: public; Owner: neondb_owner
-- --

-- ALTER TABLE ONLY org_mashreqbank.risk_assessment_workflows ALTER COLUMN id SET DEFAULT nextval('org_mashreqbank.risk_assessment_workflows_id_seq'::regclass);


-- --
-- -- TOC entry 4706 (class 2604 OID 327719)
-- -- Name: risk_asset_relationships id; Type: DEFAULT; Schema: public; Owner: neondb_owner
-- --

-- ALTER TABLE ONLY org_mashreqbank.risk_asset_relationships ALTER COLUMN id SET DEFAULT nextval('org_mashreqbank.risk_asset_relationships_id_seq'::regclass);


-- --
-- -- TOC entry 4732 (class 2604 OID 360468)
-- -- Name: risk_control_mappings id; Type: DEFAULT; Schema: public; Owner: neondb_owner
-- --

-- ALTER TABLE ONLY org_mashreqbank.risk_control_mappings ALTER COLUMN id SET DEFAULT nextval('org_mashreqbank.risk_control_mappings_id_seq'::regclass);


-- --
-- -- TOC entry 4445 (class 2604 OID 98403)
-- -- Name: risk_key_indicators id; Type: DEFAULT; Schema: public; Owner: neondb_owner
-- --

-- ALTER TABLE ONLY org_mashreqbank.risk_key_indicators ALTER COLUMN id SET DEFAULT nextval('org_mashreqbank.risk_key_indicators_id_seq'::regclass);


-- --
-- -- TOC entry 4436 (class 2604 OID 98363)
-- -- Name: risk_treatment_actions id; Type: DEFAULT; Schema: public; Owner: neondb_owner
-- --

-- ALTER TABLE ONLY org_mashreqbank.risk_treatment_actions ALTER COLUMN id SET DEFAULT nextval('org_mashreqbank.risk_treatment_actions_id_seq'::regclass);


-- --
-- -- TOC entry 4429 (class 2604 OID 90166)
-- -- Name: risk_treatment_history id; Type: DEFAULT; Schema: public; Owner: neondb_owner
-- --

-- ALTER TABLE ONLY org_mashreqbank.risk_treatment_history ALTER COLUMN id SET DEFAULT nextval('org_mashreqbank.risk_treatment_history_id_seq'::regclass);


-- --
-- -- TOC entry 4416 (class 2604 OID 90119)
-- -- Name: risk_treatment_plans id; Type: DEFAULT; Schema: public; Owner: neondb_owner
-- --

-- ALTER TABLE ONLY org_mashreqbank.risk_treatment_plans ALTER COLUMN id SET DEFAULT nextval('org_mashreqbank.risk_treatment_plans_id_seq'::regclass);


-- --
-- -- TOC entry 4376 (class 2604 OID 24601)
-- -- Name: risks id; Type: DEFAULT; Schema: public; Owner: neondb_owner
-- --

-- ALTER TABLE ONLY org_mashreqbank.risks ALTER COLUMN id SET DEFAULT nextval('org_mashreqbank.risks_id_seq'::regclass);


-- --
-- -- TOC entry 5115 (class 2604 OID 811012)
-- -- Name: role_page_access id; Type: DEFAULT; Schema: public; Owner: neondb_owner
-- --

-- ALTER TABLE ONLY org_mashreqbank.role_page_access ALTER COLUMN id SET DEFAULT nextval('org_mashreqbank.role_page_access_id_seq'::regclass);


-- --
-- -- TOC entry 5104 (class 2604 OID 794786)
-- -- Name: role_permissions id; Type: DEFAULT; Schema: public; Owner: neondb_owner
-- --

-- ALTER TABLE ONLY org_mashreqbank.role_permissions ALTER COLUMN id SET DEFAULT nextval('org_mashreqbank.role_permissions_id_seq'::regclass);


-- --
-- -- TOC entry 5083 (class 2604 OID 794628)
-- -- Name: roles id; Type: DEFAULT; Schema: public; Owner: neondb_owner
-- --

-- ALTER TABLE ONLY org_mashreqbank.roles ALTER COLUMN id SET DEFAULT nextval('org_mashreqbank.roles_id_seq'::regclass);


-- --
-- -- TOC entry 4644 (class 2604 OID 278693)
-- -- Name: security_awareness_metrics id; Type: DEFAULT; Schema: public; Owner: neondb_owner
-- --

-- ALTER TABLE ONLY org_mashreqbank.security_awareness_metrics ALTER COLUMN id SET DEFAULT nextval('org_mashreqbank.security_awareness_metrics_id_seq'::regclass);


-- --
-- -- TOC entry 5138 (class 2604 OID 860219)
-- -- Name: sla_exceptions id; Type: DEFAULT; Schema: public; Owner: neondb_owner
-- --

-- ALTER TABLE ONLY org_mashreqbank.sla_exceptions ALTER COLUMN id SET DEFAULT nextval('org_mashreqbank.sla_exceptions_id_seq'::regclass);


-- --
-- -- TOC entry 5129 (class 2604 OID 860179)
-- -- Name: sla_rules id; Type: DEFAULT; Schema: public; Owner: neondb_owner
-- --

-- ALTER TABLE ONLY org_mashreqbank.sla_rules ALTER COLUMN id SET DEFAULT nextval('org_mashreqbank.sla_rules_id_seq'::regclass);


-- --
-- -- TOC entry 5124 (class 2604 OID 860164)
-- -- Name: sla_templates id; Type: DEFAULT; Schema: public; Owner: neondb_owner
-- --

-- ALTER TABLE ONLY org_mashreqbank.sla_templates ALTER COLUMN id SET DEFAULT nextval('org_mashreqbank.sla_templates_id_seq'::regclass);


-- --
-- -- TOC entry 5091 (class 2604 OID 794730)
-- -- Name: table_permissions id; Type: DEFAULT; Schema: public; Owner: neondb_owner
-- --

-- ALTER TABLE ONLY org_mashreqbank.table_permissions ALTER COLUMN id SET DEFAULT nextval('org_mashreqbank.table_permissions_id_seq'::regclass);


-- --
-- -- TOC entry 5119 (class 2604 OID 835588)
-- -- Name: tat_settings id; Type: DEFAULT; Schema: public; Owner: neondb_owner
-- --

-- ALTER TABLE ONLY org_mashreqbank.tat_settings ALTER COLUMN id SET DEFAULT nextval('org_mashreqbank.tat_settings_id_seq'::regclass);


-- --
-- -- TOC entry 5148 (class 2604 OID 966660)
-- -- Name: technology_risks id; Type: DEFAULT; Schema: public; Owner: neondb_owner
-- --

-- ALTER TABLE ONLY org_mashreqbank.technology_risks ALTER COLUMN id SET DEFAULT nextval('org_mashreqbank.technology_risks_id_seq'::regclass);


-- --
-- -- TOC entry 5149 (class 2604 OID 966661)
-- -- Name: technology_risks risk_id; Type: DEFAULT; Schema: public; Owner: neondb_owner
-- --

-- ALTER TABLE ONLY org_mashreqbank.technology_risks ALTER COLUMN risk_id SET DEFAULT ('TR-'::text || lpad((nextval('org_mashreqbank.technology_risks_id_seq'::regclass))::text, 6, '0'::text));


-- --
-- -- TOC entry 5166 (class 2604 OID 983067)
-- -- Name: third_party_risk_assessment_responses id; Type: DEFAULT; Schema: public; Owner: neondb_owner
-- --

-- ALTER TABLE ONLY org_mashreqbank.third_party_risk_assessment_responses ALTER COLUMN id SET DEFAULT nextval('org_mashreqbank.third_party_risk_assessment_responses_id_seq'::regclass);


-- --
-- -- TOC entry 5162 (class 2604 OID 983055)
-- -- Name: third_party_risk_assessments id; Type: DEFAULT; Schema: public; Owner: neondb_owner
-- --

-- ALTER TABLE ONLY org_mashreqbank.third_party_risk_assessments ALTER COLUMN id SET DEFAULT nextval('org_mashreqbank.third_party_risk_assessments_id_seq'::regclass);


-- --
-- -- TOC entry 5159 (class 2604 OID 983044)
-- -- Name: third_party_risk_templates id; Type: DEFAULT; Schema: public; Owner: neondb_owner
-- --

-- ALTER TABLE ONLY org_mashreqbank.third_party_risk_templates ALTER COLUMN id SET DEFAULT nextval('org_mashreqbank.third_party_risk_templates_id_seq'::regclass);


-- --
-- -- TOC entry 4571 (class 2604 OID 213092)
-- -- Name: threat_assessments id; Type: DEFAULT; Schema: public; Owner: neondb_owner
-- --

-- ALTER TABLE ONLY org_mashreqbank.threat_assessments ALTER COLUMN id SET DEFAULT nextval('org_mashreqbank.threat_assessments_id_seq'::regclass);


-- --
-- -- TOC entry 4638 (class 2604 OID 278674)
-- -- Name: training_assignments id; Type: DEFAULT; Schema: public; Owner: neondb_owner
-- --

-- ALTER TABLE ONLY org_mashreqbank.training_assignments ALTER COLUMN id SET DEFAULT nextval('org_mashreqbank.training_assignments_id_seq'::regclass);


-- --
-- -- TOC entry 4592 (class 2604 OID 278532)
-- -- Name: training_categories id; Type: DEFAULT; Schema: public; Owner: neondb_owner
-- --

-- ALTER TABLE ONLY org_mashreqbank.training_categories ALTER COLUMN id SET DEFAULT nextval('org_mashreqbank.training_categories_id_seq'::regclass);


-- --
-- -- TOC entry 4596 (class 2604 OID 278544)
-- -- Name: training_courses id; Type: DEFAULT; Schema: public; Owner: neondb_owner
-- --

-- ALTER TABLE ONLY org_mashreqbank.training_courses ALTER COLUMN id SET DEFAULT nextval('org_mashreqbank.training_courses_id_seq'::regclass);


-- --
-- -- TOC entry 4604 (class 2604 OID 278565)
-- -- Name: training_modules id; Type: DEFAULT; Schema: public; Owner: neondb_owner
-- --

-- ALTER TABLE ONLY org_mashreqbank.training_modules ALTER COLUMN id SET DEFAULT nextval('org_mashreqbank.training_modules_id_seq'::regclass);


-- --
-- -- TOC entry 4625 (class 2604 OID 278625)
-- -- Name: user_module_progress id; Type: DEFAULT; Schema: public; Owner: neondb_owner
-- --

-- ALTER TABLE ONLY org_mashreqbank.user_module_progress ALTER COLUMN id SET DEFAULT nextval('org_mashreqbank.user_module_progress_id_seq'::regclass);


-- --
-- -- TOC entry 5108 (class 2604 OID 794814)
-- -- Name: user_roles id; Type: DEFAULT; Schema: public; Owner: neondb_owner
-- --

-- ALTER TABLE ONLY org_mashreqbank.user_roles ALTER COLUMN id SET DEFAULT nextval('org_mashreqbank.user_roles_id_seq'::regclass);


-- --
-- -- TOC entry 5145 (class 2604 OID 958468)
-- -- Name: user_sessions id; Type: DEFAULT; Schema: public; Owner: neondb_owner
-- --

-- ALTER TABLE ONLY org_mashreqbank.user_sessions ALTER COLUMN id SET DEFAULT nextval('org_mashreqbank.user_sessions_id_seq'::regclass);


-- --
-- -- TOC entry 4617 (class 2604 OID 278604)
-- -- Name: user_training_enrollments id; Type: DEFAULT; Schema: public; Owner: neondb_owner
-- --

-- ALTER TABLE ONLY org_mashreqbank.user_training_enrollments ALTER COLUMN id SET DEFAULT nextval('org_mashreqbank.user_training_enrollments_id_seq'::regclass);


-- --
-- -- TOC entry 4826 (class 2604 OID 516202)
-- -- Name: users id; Type: DEFAULT; Schema: public; Owner: neondb_owner
-- --

-- ALTER TABLE ONLY org_mashreqbank.users ALTER COLUMN id SET DEFAULT nextval('org_mashreqbank.users_id_seq'::regclass);


-- --
-- -- TOC entry 4584 (class 2604 OID 262160)
-- -- Name: userss id; Type: DEFAULT; Schema: public; Owner: neondb_owner
-- --

-- ALTER TABLE ONLY org_mashreqbank.userss ALTER COLUMN id SET DEFAULT nextval('org_mashreqbank.userss_id_seq'::regclass);


-- --
-- -- TOC entry 5169 (class 2604 OID 991236)
-- -- Name: vendors id; Type: DEFAULT; Schema: public; Owner: neondb_owner
-- --

-- ALTER TABLE ONLY org_mashreqbank.vendors ALTER COLUMN id SET DEFAULT nextval('org_mashreqbank.vendors_id_seq'::regclass);


-- --
-- -- TOC entry 4713 (class 2604 OID 344119)
-- -- Name: vulnerabilities id; Type: DEFAULT; Schema: public; Owner: neondb_owner
-- --

-- ALTER TABLE ONLY org_mashreqbank.vulnerabilities ALTER COLUMN id SET DEFAULT nextval('org_mashreqbank.vulnerabilities_id_seq'::regclass);


-- --
-- -- TOC entry 4462 (class 2604 OID 114767)
-- -- Name: workflow_risk_assessments id; Type: DEFAULT; Schema: public; Owner: neondb_owner
-- --

-- ALTER TABLE ONLY org_mashreqbank.workflow_risk_assessments ALTER COLUMN id SET DEFAULT nextval('org_mashreqbank.workflow_risk_assessments_id_seq'::regclass);




