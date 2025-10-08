# Quick Database Setup Guide

## 🚀 Get Started in 5 Minutes

### Step 1: Get a Free Neon Database

1. Go to [Neon Console](https://console.neon.tech/)
2. Click "Sign Up" (free account)
3. Create a new project
4. Copy the connection string from the dashboard

### Step 2: Set Your Database URL

```bash
# Replace with your actual Neon connection string
export DATABASE_URL="postgresql://user:password@ep-xxx-xxx-xxx.region.aws.neon.tech/dbname?sslmode=require"
```

### Step 3: Run Database Setup

```bash
# This will create all tables and set up your database
npm run db:setup
```

### Step 4: Start Your Application

```bash
npm run dev
```

## 🎉 That's It!

Your application will now be connected to your database and ready to use.

## Need Help?

If you get stuck:

1. **Check your connection string** - Make sure it's copied correctly from Neon
2. **Test connection** - Run `npm run db:test` to verify
3. **Check health** - Visit `http://localhost:3000/api/database/health` after starting the app

## Example Neon Connection String

Your connection string from Neon will look like this:
```
postgresql://alex:password123@ep-cool-forest-123456.us-east-2.aws.neon.tech/neondb?sslmode=require
```

## Why Neon?

- ✅ **Free tier** - No credit card required
- ✅ **Serverless** - No setup or maintenance
- ✅ **PostgreSQL compatible** - Works perfectly with your app
- ✅ **Fast** - Global edge locations
- ✅ **Secure** - Built-in SSL and backups

## Alternative: Local Database

If you prefer local development, you can also:

1. Install PostgreSQL: `brew install postgresql`
2. Start service: `brew services start postgresql`
3. Create database: `createdb grc_tech`
4. Set URL: `export DATABASE_URL="postgresql://apple@localhost:5432/grc_tech"`

But Neon is recommended for easier setup and better performance.



