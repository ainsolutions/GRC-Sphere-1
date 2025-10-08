# Database Setup Guide

This guide will help you connect your GRC Tech application with a database.

## Prerequisites

- Node.js 18+ installed
- A PostgreSQL-compatible database (recommended: Neon Database)
- Git installed

## Quick Setup

### 1. Get a Database

**Option A: Neon Database (Recommended)**
1. Go to [Neon Console](https://console.neon.tech/)
2. Sign up/Login and create a new project
3. Copy the connection string from the dashboard
4. It will look like: `postgresql://user:password@ep-xxx-xxx-xxx.region.aws.neon.tech/dbname?sslmode=require`

**Option B: Other PostgreSQL Database**
- Use any PostgreSQL database (local, cloud, etc.)
- Ensure it's accessible from your application

### 2. Set Environment Variables

Create a `.env` file in the root directory:

```bash
# Database Configuration
DATABASE_URL="your-database-connection-string"

# OpenAI Configuration (for AI features)
OPENAI_API_KEY="your-openai-api-key"

# Application Configuration
NODE_ENV="development"
NEXTAUTH_SECRET="your-nextauth-secret"
NEXTAUTH_URL="http://localhost:3000"
```

### 3. Run Database Setup

```bash
# Set your database URL
export DATABASE_URL="your-database-connection-string"

# Run the setup script
./scripts/setup-database.sh
```

### 4. Start the Application

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

## Manual Setup

If you prefer to set up manually:

### 1. Install PostgreSQL Client

**macOS:**
```bash
brew install postgresql
```

**Ubuntu/Debian:**
```bash
sudo apt-get update && sudo apt-get install postgresql-client
```

**Windows:**
Download from [PostgreSQL website](https://www.postgresql.org/download/windows/)

### 2. Test Database Connection

```bash
psql "your-database-connection-string" -c "SELECT version();"
```

### 3. Run Schema Files

```bash
# Run all schema files in order
for file in scripts/*.sql; do
  psql "your-database-connection-string" -f "$file"
done
```

## Database Schema

The application includes comprehensive database schemas for:

- **User Management**: Users, roles, permissions
- **Risk Management**: Various risk frameworks (ISO27001, NIST CSF, FAIR, etc.)
- **Compliance**: HIPAA, NESA UAE, SAMA, MICA, NIS2, DORA, Qatar NIA
- **Asset Management**: Assets, vulnerabilities, controls
- **Incident Management**: Incidents, remediation tracking
- **Third-party Risk**: Vendor assessments, evaluations
- **Policy Management**: Policies, procedures, versions
- **Audit & Analytics**: Audit logs, analytics data

## Health Check

Test your database connection:

```bash
# API endpoint
curl http://localhost:3000/api/database/health

# Or visit in browser
http://localhost:3000/api/database/health
```

## Troubleshooting

### Common Issues

**1. Connection Refused**
- Check if your database is running
- Verify the connection string
- Ensure firewall allows connections

**2. Authentication Failed**
- Check username/password in connection string
- Verify database exists
- Check SSL requirements

**3. Schema Errors**
- Some tables might already exist (this is normal)
- Check database permissions
- Ensure you have CREATE TABLE permissions

**4. Environment Variables Not Loading**
- Restart your development server after setting .env
- Check .env file location (should be in root directory)
- Verify variable names match exactly

### Debug Commands

```bash
# Test database connection
psql "your-database-url" -c "SELECT 1"

# Check if tables exist
psql "your-database-url" -c "\dt"

# View database logs (if available)
psql "your-database-url" -c "SELECT * FROM pg_stat_activity;"
```

## Production Deployment

### Environment Variables

Set these in your hosting platform (Vercel, Railway, etc.):

```bash
DATABASE_URL=your-production-database-url
NODE_ENV=production
NEXTAUTH_SECRET=your-production-secret
NEXTAUTH_URL=https://your-domain.com
OPENAI_API_KEY=your-openai-key
```

### Database Considerations

1. **Connection Pooling**: Neon Database handles this automatically
2. **SSL**: Always use SSL in production
3. **Backups**: Enable automated backups
4. **Monitoring**: Set up database monitoring
5. **Scaling**: Consider read replicas for high traffic

## Security Best Practices

1. **Never commit .env files** (they're already in .gitignore)
2. **Use strong passwords** for database users
3. **Limit database permissions** to minimum required
4. **Enable SSL** for all connections
5. **Regular security updates** for database software
6. **Monitor access logs** for suspicious activity

## Support

If you encounter issues:

1. Check the troubleshooting section above
2. Verify your database connection string
3. Check the application logs
4. Test database connectivity manually
5. Ensure all environment variables are set correctly

## Next Steps

After successful database setup:

1. **Configure AI Features**: Set your OpenAI API key
2. **Set Up Authentication**: Configure NextAuth.js
3. **Customize Application**: Modify settings and configurations
4. **Add Sample Data**: Use the provided seed scripts
5. **Test Functionality**: Verify all features work correctly

