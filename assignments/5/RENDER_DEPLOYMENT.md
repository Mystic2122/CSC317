# Deployment to Render.com

Complete step-by-step guide to deploy your CSC317 web application to Render.com.

---

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Step 1: Prepare Your Repository](#step-1-prepare-your-repository)
3. [Step 2: Create a Render Account](#step-2-create-a-render-account)
4. [Step 3: Create PostgreSQL Database](#step-3-create-postgresql-database)
5. [Step 4: Deploy the Web Service](#step-4-deploy-the-web-service)
6. [Step 5: Configure Environment Variables](#step-5-configure-environment-variables)
7. [Step 6: Initialize Database](#step-6-initialize-database)
8. [Step 7: Test Deployment](#step-7-test-deployment)
9. [Troubleshooting](#troubleshooting)
10. [Monitoring & Logs](#monitoring--logs)

---

## Prerequisites

- ✅ GitHub account with your repository pushed
- ✅ Render.com account (free tier available)
- ✅ Application fully tested locally
- ✅ All dependencies in `package.json`
- ✅ `.env.example` file (for reference)

**Note:** Do NOT commit `.env` file to GitHub (it's in `.gitignore`)

---

## Step 1: Prepare Your Repository

### 1.1 Create `.env.example` File

Create a template file showing required environment variables:

```bash
# In your project root
cat > .env.example << 'EOF'
PORT=3000
NODE_ENV=production
DATABASE_URL=postgresql://username:password@host:5432/database_name
SESSION_SECRET=your_secure_random_string_here
EOF
```

### 1.2 Verify `.gitignore`

Ensure these files are ignored (not committed):

```
# .gitignore should contain:
.env
.env.local
node_modules/
*.log
.DS_Store
```

### 1.3 Update `package.json`

Ensure `package.json` has proper scripts:

```json
{
  "scripts": {
    "start": "node app.js",
    "dev": "nodemon app.js",
    "db:init": "node scripts/init-db.js"
  },
  "engines": {
    "node": "20.x"
  }
}
```

### 1.4 Push to GitHub

```bash
git add -A
git commit -m "Prepare for Render deployment"
git push origin main
```

---

## Step 2: Create a Render Account

### 2.1 Sign Up for Render

1. Go to [https://render.com](https://render.com)
2. Click "Get Started" or "Sign Up"
3. Create account using:
   - GitHub account (recommended for easy integration)
   - Email and password
4. Verify email address

### 2.2 Connect GitHub

1. Go to Dashboard → Account Settings
2. Click "Connect GitHub"
3. Authorize Render to access your repositories
4. Select your repository in the list

---

## Step 3: Create PostgreSQL Database

### 3.1 Create New PostgreSQL Database

1. In Render Dashboard, click **"+ New"** button
2. Select **"PostgreSQL"**
3. Fill in the form:
   - **Name:** `csc317-db` (or your preferred name)
   - **Database:** `csc317_project` (same as development)
   - **User:** `postgres` (default)
   - **Region:** Choose closest to your location (e.g., Ohio, Oregon)
   - **PostgreSQL Version:** 14 or higher (leave default)

4. Click **"Create Database"**

### 3.2 Save Database Credentials

Once created, you'll see a connection string:

```
postgresql://username:password@dpg-xxx.render.internal:5432/database_name
```

**⚠️ Important:** Save these credentials somewhere safe! You'll need them for the web service.

### 3.3 Wait for Database Initialization

The database will take 1-2 minutes to initialize. You'll see a green status when ready.

---

## Step 4: Deploy the Web Service

### 4.1 Create New Web Service

1. In Render Dashboard, click **"+ New"**
2. Select **"Web Service"**
3. Choose **"Deploy from a Git repository"**
4. Click **"Connect Repository"**

### 4.2 Connect Repository

1. Search for your CSC317 repository
2. Click **"Connect"** next to the correct repo
3. You may need to authorize Render again

### 4.3 Configure Web Service

Fill in the deployment form:

| Field | Value |
|-------|-------|
| **Name** | `csc317-web-app` |
| **Environment** | `Node` |
| **Region** | Same as database (e.g., Ohio) |
| **Branch** | `main` |
| **Build Command** | `npm install` |
| **Start Command** | `npm start` |
| **Instance Type** | `Free` (or Starter for better performance) |

### 4.4 Advanced Settings (Optional)

- **Auto-deploy:** Enable (auto-redeploy on git push)
- **Health Check:** Enabled (Render will monitor your app)

Click **"Create Web Service"**

---

## Step 5: Configure Environment Variables

### 5.1 Add Environment Variables in Render

1. On your Web Service page, go to **"Environment"**
2. Click **"Add Environment Variable"**
3. Add the following variables:

```
PORT=3000
NODE_ENV=production
DATABASE_URL=<paste your PostgreSQL connection string from Step 3>
SESSION_SECRET=<generate with: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))">
```

**⚠️ For DATABASE_URL:**
- Use the internal connection string: `postgresql://...render.internal:...`
- This is faster than external connection
- Format: `postgresql://username:password@host:5432/database_name`

### 5.2 Verify All Variables Added

- [ ] PORT=3000
- [ ] NODE_ENV=production
- [ ] DATABASE_URL=postgresql://...
- [ ] SESSION_SECRET=random_string

Click **"Save"** after adding each variable.

---

## Step 6: Initialize Database

### 6.1 Run Database Initialization Script

After web service is deployed (you'll see a green "Active" status):

1. Go to **"Shell"** tab in your Render Web Service
2. Run the initialization command:

```bash
npm run db:init
```

Expected output:

```
✓ Users table created
✓ Profile images table created
✓ Session table created
✓ Indexes created

✅ Database initialization complete!
```

### 6.2 Alternative: SSH into Service

If Shell tab is unavailable on free tier:

1. Use Render's CLI or
2. Deploy manually and check logs for errors

---

## Step 7: Test Deployment

### 7.1 Access Your Application

1. Go to your Web Service page on Render
2. Click the URL at the top (e.g., `https://csc317-web-app.onrender.com`)
3. You should see your application home page

### 7.2 Test Core Features

- [ ] Navigate to home page - loads without errors
- [ ] Click "Register" - registration form loads
- [ ] Create a test account - user created successfully
- [ ] Click "Login" - login form loads
- [ ] Login with test account - redirected to profile
- [ ] Upload profile image - image saves and displays
- [ ] Update settings - changes persist
- [ ] Logout - session destroyed, redirected home
- [ ] Try accessing /user/profile without login - redirected to login

### 7.3 Check Application Logs

1. On Render Web Service page, click **"Logs"**
2. Look for any errors or warnings
3. Verify database connection message appears

---

## Troubleshooting

### Issue: "Deployment Failed"

**Check:**
1. Verify `package.json` has correct scripts
2. Ensure all dependencies are listed (not in node_modules)
3. Check build command: `npm install`
4. Look at build logs for specific errors

**Solution:**
```bash
# Locally verify everything works
rm -rf node_modules
npm install
npm start
```

---

### Issue: "Cannot Connect to Database"

**Check:**
1. DATABASE_URL is correct in Environment Variables
2. PostgreSQL database is running (green status in Render)
3. Connection string format is correct
4. Using internal connection string (render.internal)

**Solution:**
1. Copy DATABASE_URL from Render PostgreSQL page
2. Make sure it ends with correct database name
3. Verify username and password are correct

---

### Issue: "500 Internal Server Error"

**Check:**
1. Application logs for specific error
2. PostgreSQL is initialized
3. All required tables exist

**Solution:**
```bash
# In Render Shell, verify database
npm run db:init
```

---

### Issue: "Application Running but Page Won't Load"

**Check:**
1. Open browser console (F12)
2. Look for specific error messages
3. Check Render logs for server errors

**Common Causes:**
- CSS/JS files not loading (check public/ folder)
- Missing environment variables
- Database connection timeout

---

### Issue: "Free Tier Service Spinning Down"

Render's free tier spins down inactive services after 15 minutes of inactivity.

**Solutions:**
- Use Starter tier ($7/month) for always-on
- Or accept ~30 second startup time
- Use `render-keep-alive.js` to ping service periodically

---

## Monitoring & Logs

### 7.1 View Logs

1. Web Service page → **"Logs"** tab
2. See real-time application output
3. Filter by type (Build, Runtime, etc.)

### 7.2 Monitor Performance

1. Web Service page → **"Metrics"** tab
2. View:
   - CPU usage
   - Memory usage
   - Response times
   - Error rates

### 7.3 Set Up Notifications

1. Web Service page → **"Alerts"**
2. Create alerts for:
   - Deployment failures
   - High error rate
   - Service crashes

---

## Continuous Deployment

### Auto-Deploy on Git Push

Once configured with GitHub integration:

1. Make changes locally
2. Commit and push: `git push origin main`
3. Render automatically rebuilds and deploys
4. Check deployment status in Render Dashboard

### Disable Auto-Deploy

If you need to prevent automatic deployments:

1. Web Service page → **"Settings"**
2. Disable **"Auto-deploy"**
3. Manually trigger deployment when ready

---

## Production Best Practices

### Security Checklist

- ✅ Never commit `.env` file
- ✅ Use strong SESSION_SECRET (32+ chars random)
- ✅ Enable HTTPS (Render does this automatically)
- ✅ Use environment-specific database
- ✅ Keep dependencies updated
- ✅ Monitor error logs regularly

### Performance Optimization

- ✅ Use Starter tier or higher for production
- ✅ Enable caching headers in Express
- ✅ Compress response bodies
- ✅ Monitor database query performance
- ✅ Use connection pooling

### Backup Strategy

PostgreSQL on Render includes automatic backups:
- Daily backups retained for 7 days
- Manual backups available
- Located in database settings

---

## Rollback & Troubleshooting

### Rollback to Previous Deployment

1. Web Service page → **"Deployments"**
2. Find previous working deployment
3. Click **"Re-deploy"**

### Check Deployment History

1. View all deployments and their status
2. See build logs for each deployment
3. Identify when issues started

---

## Useful Commands

### Run Database Initialization on Render

```bash
# In Render Shell
npm run db:init
```

### Access PostgreSQL from Shell

```bash
# Using psql (if available)
psql $DATABASE_URL
```

### Check Environment Variables

```bash
# In Render Shell
env | grep -E "PORT|NODE_ENV|DATABASE"
```

### View Application Startup

```bash
# In Logs tab, watch:
npm start
# Should see: "Server running on http://0.0.0.0:3000"
# Should see: "PostgreSQL connected successfully"
```

---

## Summary Checklist

Before considering deployment complete:

- [ ] Repository pushed to GitHub
- [ ] `.env.example` file created
- [ ] `.gitignore` includes `.env`
- [ ] PostgreSQL database created on Render
- [ ] Web service created and connected
- [ ] All environment variables configured
- [ ] Database initialized (tables created)
- [ ] Application loads without errors
- [ ] Core features tested (register, login, logout)
- [ ] Profile image upload works
- [ ] User settings can be updated
- [ ] Protected routes redirect when not authenticated
- [ ] Session persists across requests
- [ ] Logs show no errors

---

## Support & Resources

- **Render Docs:** https://render.com/docs
- **Node.js on Render:** https://render.com/docs/deploy-node
- **PostgreSQL on Render:** https://render.com/docs/postgres
- **Troubleshooting:** https://render.com/docs/troubleshooting
- **Support:** https://render.com/support

---

## Deployment Success Message

When everything is working correctly, you should see:

```
✅ Application deployed successfully
✅ Database initialized
✅ Server running on Render
✅ All features working
✅ Ready for production use
```

---

**Deployment Date:** [Your Date]  
**Deployed By:** [Your Name]  
**Application URL:** https://your-app-name.onrender.com  
**Status:** Active ✅
