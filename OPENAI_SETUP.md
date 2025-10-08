# OpenAI Integration Setup Guide

This guide will help you configure OpenAI API integration for your GRC application.

## Prerequisites

1. OpenAI API account with credits
2. OpenAI API key

## Step 1: Get Your OpenAI API Key

1. Go to [OpenAI Platform](https://platform.openai.com/)
2. Sign in or create an account
3. Navigate to API Keys section
4. Create a new API key
5. Copy the API key (it starts with `sk-`)

## Step 2: Configure Environment Variables

Create a `.env.local` file in your project root with the following content:

```bash
# OpenAI Configuration
OPENAI_API_KEY="sk-your-api-key-here"

# Database Configuration (if not already set)
DATABASE_URL="your_neon_database_url_here"

# Next.js Configuration
NEXTAUTH_SECRET="your_nextauth_secret_here"
NEXTAUTH_URL="http://localhost:3000"
```

## Step 3: Test the Connection

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Test the OpenAI connection:
   ```bash
   curl http://localhost:3000/api/ai/test
   ```

   You should see a response like:
   ```json
   {
     "connected": true,
     "message": "OpenAI connection successful!",
     "usage": {
       "promptTokens": 15,
       "completionTokens": 8,
       "totalTokens": 23
     }
   }
   ```

## Step 4: Available AI Features

The application includes the following AI-powered features:

### 1. Risk Analysis (`/api/ai/risk-analysis`)
- Analyzes risk assessment data
- Provides risk level assessment
- Suggests mitigation strategies
- Offers priority recommendations

### 2. Compliance Analysis (`/api/ai/compliance-analysis`)
- Analyzes compliance data
- Provides gap analysis
- Suggests remediation recommendations
- Offers best practices

### 3. Governance Recommendations (`/api/ai/governance-recommendations`)
- Generates strategic recommendations
- Suggests performance improvements
- Provides budget optimization advice
- Offers policy enhancement suggestions

### 4. Incident Response (`/api/ai/incident-response`)
- Analyzes incident data
- Provides severity assessment
- Suggests immediate response actions
- Offers investigation steps

### 5. Asset Classification (`/api/ai/asset-classification`)
- Classifies information assets
- Provides security requirements
- Suggests protection recommendations

## Step 5: Using AI Components

The `AIAnalysis` component can be used in your pages:

```tsx
import { AIAnalysis } from '@/components/ai-analysis';

// In your component
<AIAnalysis
  type="risk"
  title="Risk Assessment Analysis"
  description="Get AI-powered insights for your risk assessments"
  onAnalysisComplete={(result) => {
    console.log('Analysis result:', result);
  }}
/>
```

## Step 6: API Usage

You can also use the AI APIs directly:

```javascript
// Risk Analysis
const response = await fetch('/api/ai/risk-analysis', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    riskId: 'RISK-001',
    description: 'Data breach risk',
    impact: 'High',
    likelihood: 'Medium'
  })
});

const result = await response.json();
console.log(result.analysis);
```

## Current Issue: API Key Not Set

**❌ CURRENT STATUS:** Your `.env.local` file contains a placeholder API key that needs to be replaced with your actual OpenAI API key.

### Quick Fix Steps

1. **Get your real OpenAI API key** from [OpenAI Platform](https://platform.openai.com/account/api-keys)
2. **Update your `.env.local` file**:
   ```bash
   # Replace this placeholder:
   OPENAI_API_KEY="your-api-key-here"

   # With your actual key:
   OPENAI_API_KEY="sk-your-actual-openai-api-key-here"
   ```
3. **Restart your development server**:
   ```bash
   npm run dev
   ```
4. **Test the connection**:
   ```bash
   curl http://localhost:3000/api/test-openai
   ```

### Troubleshooting

### Common Issues

1. **"OpenAI API key is not properly configured. Please set your actual API key in .env.local"**
   - ✅ **This is your current issue!** Replace the placeholder API key with your real one
   - The placeholder "your-api-key-here" won't work with OpenAI

2. **"OpenAI API key is not configured"**
   - Ensure `OPENAI_API_KEY` is set in your `.env.local` file
   - Restart your development server after adding the key

3. **"Insufficient quota"**
   - Check your OpenAI account billing and usage
   - Ensure you have sufficient credits

4. **"Invalid API key"**
   - Verify your API key is correct and starts with `sk-`
   - Make sure you copied the entire key without extra spaces

5. **Rate limiting errors**
   - OpenAI has rate limits based on your plan
   - Consider implementing retry logic for production use

### Testing Individual Endpoints

```bash
# Test risk analysis
curl -X POST http://localhost:3000/api/ai/risk-analysis \
  -H "Content-Type: application/json" \
  -d '{"riskId": "RISK-001", "description": "Test risk"}'

# Test compliance analysis
curl -X POST http://localhost:3000/api/ai/compliance-analysis \
  -H "Content-Type: application/json" \
  -d '{"framework": "ISO27001", "status": "Non-compliant"}'
```

## Security Considerations

1. **Never commit API keys to version control**
2. **Use environment variables for all sensitive data**
3. **Implement rate limiting in production**
4. **Consider implementing user authentication for AI features**
5. **Monitor API usage and costs**

## Cost Management

- Monitor your OpenAI usage in the OpenAI dashboard
- Set up billing alerts
- Consider implementing usage limits
- Use appropriate models for different tasks (GPT-3.5 for simple tasks, GPT-4 for complex analysis)

## Support

If you encounter issues:
1. Check the browser console for errors
2. Check the server logs
3. Verify your API key and environment variables
4. Test with the `/api/ai/test` endpoint first




