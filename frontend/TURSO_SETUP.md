# Turso Database Setup Guide

This guide explains how to set up your Turso database for deployment.

## Option 1: Local Development (Using Existing SQLite File)

Your `.env` file is already configured to use the local SQLite database:

```bash
TURSO_DB_URL=file:../database/portfolio.db
TURSO_DB_AUTH_TOKEN=
```

This will work for `npm run dev` locally. **No additional setup needed!**

---

## Option 2: Deploy to Vercel with Turso (Production)

### Step 1: Install Turso CLI

```bash
# Windows (PowerShell)
iwr -useb https://get.tur.so/windows | iex

# macOS/Linux
curl -sSfL https://get.tur.so/install.sh | bash
```

### Step 2: Create Turso Account & Database

```bash
# Sign up / login
turso auth signup

# Create database
turso db create dave-delivers

# Get database URL
turso db show dave-delivers
# Copy the URL (e.g., libsql://dave-delivers-yourname.turso.io)

# Create auth token
turso db tokens create dave-delivers
# Copy the token
```

### Step 3: Migrate Data from SQLite to Turso

```bash
# Dump your local database
turso db shell dave-delivers < ../database/portfolio.db

# Or manually export/import:
# 1. Export local data as SQL
sqlite3 ../database/portfolio.db .dump > portfolio_dump.sql

# 2. Import to Turso
turso db shell dave-delivers < portfolio_dump.sql
```

### Step 4: Update Environment Variables

Update your `.env` file:

```bash
TURSO_DB_URL=libsql://dave-delivers-yourname.turso.io
TURSO_DB_AUTH_TOKEN=your_actual_token_here
```

### Step 5: Deploy to Vercel

1. **Push to GitHub:**
   ```bash
   git add .
   git commit -m "Migrate to full-stack SvelteKit with Turso"
   git push
   ```

2. **Connect Vercel:**
   - Go to vercel.com
   - Import your GitHub repo
   - Add environment variables:
     - `TURSO_DB_URL` = your Turso URL
     - `TURSO_DB_AUTH_TOKEN` = your Turso token

3. **Deploy!**

---

## Verify Database Connection

```bash
npm run dev
```

Check console for:
```
✅ Database initialized successfully
```

If you see errors, verify your `.env` file paths.

---

## Troubleshooting

### Error: "Database connection failed"

**Local Development:**
- Check that `../database/portfolio.db` exists
- Ensure path is relative to `frontend/` directory

**Turso:**
- Verify `TURSO_DB_URL` and `TURSO_DB_AUTH_TOKEN` are correct
- Test connection: `turso db shell dave-delivers`

### Error: "Table does not exist"

The tables will be created automatically on first run. If not:

```bash
# For Turso
turso db shell dave-delivers

# Run DDL manually (from connection.ts file)
CREATE TABLE IF NOT EXISTS project (...);
```

---

## Additional Resources

- [Turso Documentation](https://docs.turso.tech/)
- [Turso + SvelteKit Guide](https://docs.turso.tech/sdk/ts/guides/sveltekit)
- [Vercel Deployment](https://vercel.com/docs/frameworks/sveltekit)
