const { getDatabase } = require('./lib/database');

async function debugUpload() {
  console.log('🔍 Debugging Upload Functionality...\n');
  
  try {
    // Test database connection
    console.log('1. Testing database connection...');
    const sql = getDatabase();
    
    if (!sql) {
      console.error('❌ Database connection failed - check DATABASE_URL');
      return;
    }
    console.log('✅ Database connection successful');
    
    // Test basic query
    console.log('\n2. Testing basic database query...');
    const testQuery = await sql`SELECT 1 as test`;
    console.log('✅ Basic query successful:', testQuery);
    
    // Check if policies table exists
    console.log('\n3. Checking policies table...');
    const policiesTableCheck = await sql`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'policies'
      ) as exists
    `;
    console.log('Policies table exists:', policiesTableCheck[0].exists);
    
    // Check if policy_attachments table exists
    console.log('\n4. Checking policy_attachments table...');
    const attachmentsTableCheck = await sql`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'policy_attachments'
      ) as exists
    `;
    console.log('Policy attachments table exists:', attachmentsTableCheck[0].exists);
    
    if (!attachmentsTableCheck[0].exists) {
      console.log('\n⚠️  Policy attachments table does not exist. Creating...');
      
      // Create the table
      await sql.unsafe(`
        CREATE TABLE IF NOT EXISTS policy_attachments (
          id SERIAL PRIMARY KEY,
          policy_id INTEGER NOT NULL,
          version_id INTEGER,
          filename VARCHAR(255) NOT NULL,
          original_filename VARCHAR(255) NOT NULL,
          file_path TEXT NOT NULL,
          file_size BIGINT NOT NULL,
          mime_type VARCHAR(100),
          file_hash VARCHAR(64) UNIQUE,
          uploaded_by INTEGER,
          version VARCHAR(20),
          is_current BOOLEAN DEFAULT FALSE,
          uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `);
      console.log('✅ Policy attachments table created');
    }
    
    // Check if there's a policy with ID 1
    console.log('\n5. Checking for policy ID 1...');
    const policyCheck = await sql`
      SELECT id, title FROM policies WHERE id = 1
    `;
    console.log('Policy ID 1:', policyCheck.length > 0 ? policyCheck[0] : 'Not found');
    
    if (policyCheck.length === 0) {
      console.log('\n⚠️  No policy with ID 1 found. Creating sample policy...');
      await sql`
        INSERT INTO policies (policy_id, title, description, content, status, version) 
        VALUES ('POL-001', 'Test Policy', 'Test policy for uploads', '# Test Policy\n\nThis is a test policy.', 'draft', '1.0')
        ON CONFLICT (policy_id) DO NOTHING
      `;
      console.log('✅ Sample policy created');
    }
    
    console.log('\n🎯 Upload debugging complete!');
    
  } catch (error) {
    console.error('❌ Debug failed:', error);
  }
}

debugUpload();
