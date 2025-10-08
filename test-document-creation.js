// Simple test script to verify document creation API is working
// Run this with: node test-document-creation.js

const testDocumentCreation = async () => {
  console.log("🧪 Testing Document Creation API...")

  try {
    const testData = {
      title: "Test Security Policy",
      document_type: "Policy",
      category: "Information Security",
      document_owner: "Security Officer",
      description: "This is a test document for verification",
      created_by: "test-user"
    }

    console.log("📤 Sending test data:", testData)

    const response = await fetch('http://localhost:3000/api/governance/documents', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData)
    })

    console.log("📥 Response status:", response.status)

    if (response.ok) {
      const result = await response.json()
      console.log("✅ Success! Document created:")
      console.log(JSON.stringify(result, null, 2))
    } else {
      const error = await response.json()
      console.log("❌ Error:", error)
    }
  } catch (error) {
    console.error("❌ Network error:", error.message)
  }
}

// Only run if this is the main module
if (require.main === module) {
  testDocumentCreation()
}

module.exports = { testDocumentCreation }
