# Setup Guide

This guide provides step-by-step instructions for setting up the authentication template application on your local machine and deploying to Render.com.

## Prerequisites

Before you begin, you'll need to install the following software:

1. Node.js and npm (Node Package Manager)
2. PostgreSQL
3. A code editor (e.g., VS Code, Webstorm, etc.)
4. Git

## Step 1: Install Node.js and npm

Node.js is the JavaScript runtime that powers the server-side of this application. npm is the package manager that comes with Node.js and helps you install dependencies.

### For Windows:

1. Download the installer from [Node.js official website](https://nodejs.org/)
2. Choose the LTS (Long Term Support) version
3. Run the installer and follow the installation wizard
4. Verify installation by opening Command Prompt and typing:
   ```
   node --version
   npm --version
   ```

### For macOS:

Option 1: Using Homebrew (recommended):
```
brew install node
```

Option 2: Using the installer:
1. Download the installer from [Node.js official website](https://nodejs.org/)
2. Choose the LTS version
3. Run the installer and follow the instructions
4. Verify installation in Terminal:
   ```
   node --version
   npm --version
   ```

### For Linux (Ubuntu/Debian):

```
sudo apt update
sudo apt install nodejs npm
node --version
npm --version
```

## Step 2: Set Up PostgreSQL Locally

PostgreSQL is the database used by this application to store user information.

### For Windows:

1. Download the installer from [PostgreSQL Downloads](https://www.postgresql.org/download/windows/)
2. Run the installer and follow the installation wizard
3. Remember the password you set for the `postgres` superuser
4. Ensure the installer adds PostgreSQL to your PATH
5. Verify installation:
   ```
   psql --version
   ```

### For macOS:

Option 1: Using Homebrew (recommended):
```bash
brew install postgresql@17
brew services start postgresql@17
```

Option 2: Using Postgres.app:
1. Download from [Postgres.app](https://postgresapp.com/)
2. Move to Applications and open
3. Click "Initialize" to create a new server

Verify installation:
```
psql --version
```

### For Linux (Ubuntu/Debian):

```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

### Create the Database

After installing PostgreSQL, create a database for the project:

```bash
# Connect to PostgreSQL as the postgres user
psql -U postgres

# In the PostgreSQL shell, create the database
CREATE DATABASE csc317_project;

# Exit the shell
\q
```

On macOS with Homebrew, you may need to use:
```bash
createdb csc317_project
```

## Step 3: Fork and Clone the Template

1. **Fork the repository** on GitHub by clicking the "Fork" button in the top right corner

2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/YOUR-USERNAME/CSC317Project-F25.git
   cd CSC317Project-F25
   ```

Alternatively, download the ZIP file of the project and extract it to a location of your choice.

## Step 4: Install Project Dependencies

In the project directory, run:
```
npm install
```

This will install all the required dependencies specified in package.json.

## Step 5: Set Up Environment Variables

Create a `.env` file in the root directory of the project:
```
cp .env.example .env
```

Or manually create a file named `.env` in the project root directory with the following content:
```
PORT=3000
NODE_ENV=development
DATABASE_URL=postgresql://postgres:your_password@localhost:5432/csc317_project
SESSION_SECRET=your_secure_random_string_here
```

Notes:
- `PORT`: The port on which the application will run (default: 3000)
- `NODE_ENV`: The environment (development, production, etc.)
- `DATABASE_URL`: The connection string for your PostgreSQL database
  - Format: `postgresql://username:password@host:port/database_name`
  - Replace `your_password` with the password you set during PostgreSQL installation
- `SESSION_SECRET`: A random string used to sign the session ID cookie (for security)

For the `SESSION_SECRET`, you should use a long, random string. You can generate one by running this in the terminal:
```
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## Step 6: Initialize the Database Tables

Run the database initialization script to create the required tables:
```
npm run db:init
```

You should see output like:
```
✓ Users table created
✓ Profile images table created
✓ Session table created
✓ Indexes created

✅ Database initialization complete!
```

## Step 7: Start the Application

In the project directory, run:
```
npm run dev
```

This will start the application in development mode with nodemon, which automatically restarts the server when you make changes to the code.

## Step 8: Access the Application

Open your web browser and navigate to:
```
http://localhost:3000
```

You should see the home page of the authentication template.

---

## Deploying to Render.com

Render.com is a cloud platform that makes it easy to deploy web applications with PostgreSQL databases.

### Step 1: Create a Render Account

1. Go to [Render.com](https://render.com) and sign up for a free account
2. Connect your GitHub account to Render

### Step 2: Push Your Code to GitHub

Make sure your project is in a GitHub repository:
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin <your-github-repo-url>
git push -u origin main
```

### Step 3: Create a PostgreSQL Database on Render

1. In your Render dashboard, click "New" → "PostgreSQL"
2. Fill in the details:
   - **Name**: `csc317-project-db` (or your preferred name)
   - **Database**: `csc317_project`
   - **User**: Leave as default
   - **Region**: Choose the closest to your users
   - **PostgreSQL Version**: 17 (latest)
   - **Instance Type**: Free (for development)
3. Click "Create Database"
4. Wait for the database to be created
5. Copy the **Internal Database URL** from the database info page (you'll need this later)

### Step 4: Create a Web Service on Render

1. In your Render dashboard, click "New" → "Web Service"
2. Connect your GitHub repository
3. Fill in the details:
   - **Name**: `csc317-project` (or your preferred name)
   - **Region**: Same as your database
   - **Branch**: `main`
   - **Runtime**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Instance Type**: Free (for development)

### Step 5: Set Environment Variables

In your web service settings, add the following environment variables:

1. Click "Environment" in the left sidebar
2. Add the following variables:
   - `DATABASE_URL`: Paste the **Internal Database URL** from your PostgreSQL database
   - `SESSION_SECRET`: Generate a secure random string (use the command from Step 5 above)
   - `NODE_ENV`: `production`

### Step 6: Initialize the Database on Render

After your first deployment, you need to initialize the database tables. You have two options:

**Option A: Using Render Shell**
1. Go to your web service dashboard
2. Click "Shell" in the left sidebar
3. Run: `npm run db:init`

**Option B: Using a One-off Job**
1. In your Render dashboard, click "New" → "Cron Job"
2. Connect to the same repository
3. Set the command to: `npm run db:init`
4. Run it once, then delete the cron job

### Step 7: Deploy

1. Render will automatically deploy your application when you push to GitHub
2. You can also manually trigger a deploy from the dashboard
3. Once deployed, click the URL at the top of your web service page to view your app

### Updating Your Application

When you push changes to GitHub, Render will automatically redeploy your application. You can also:
- View deploy logs in the "Events" tab
- Rollback to previous versions if needed
- Monitor your app's health in the "Metrics" tab

---

## Troubleshooting

### PostgreSQL Connection Issues

If you encounter issues connecting to PostgreSQL:

1. Ensure PostgreSQL is running:
   - Windows: Check Services for "postgresql"
   - macOS: `brew services list` or check Postgres.app
   - Linux: `sudo systemctl status postgresql`

2. Check your DATABASE_URL in the `.env` file:
   - Verify username and password are correct
   - Ensure the database exists
   - Check the port (default: 5432)

3. Test the connection manually:
   ```
   psql -U postgres -d csc317_project
   ```

### Database Initialization Errors

If `npm run db:init` fails:

1. Ensure the database exists: `createdb csc317_project`
2. Check database permissions
3. Verify your DATABASE_URL is correct
4. Check PostgreSQL logs for detailed error messages

### Node.js/npm Issues

If you encounter issues with Node.js or npm:

1. Ensure you have the correct version of Node.js installed (18.x or higher recommended)
2. Try deleting the `node_modules` folder and running `npm install` again
3. Clear npm cache with `npm cache clean --force`

### Port Already in Use

If port 3000 is already in use:

1. Change the PORT in your `.env` file to another value (e.g., 3001, 8080)
2. Restart the application

### Render Deployment Issues

If your Render deployment fails:

1. Check the deploy logs for error messages
2. Ensure all environment variables are set correctly
3. Verify the DATABASE_URL uses the **Internal Database URL**
4. Check that the build and start commands are correct

---

## Next Steps

After setting up the application, you can:

1. Register a new user account
2. Log in with the created account
3. Explore the protected routes
4. Start building your own features on top of this authentication template
5. Modify the styling to match your application's design

For more information about the template features and how to extend them, refer to the TEMPLATE-README.md file.
