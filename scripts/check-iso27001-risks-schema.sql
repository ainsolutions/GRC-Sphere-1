-- Check the structure of the iso27001_risks table
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default,
    character_maximum_length
FROM information_schema.columns 
WHERE table_name = 'iso27001_risks' 
ORDER BY ordinal_position;

-- Also check if the table exists and get a sample record
SELECT COUNT(*) as record_count FROM iso27001_risks;
SELECT * FROM iso27001_risks LIMIT 1;
