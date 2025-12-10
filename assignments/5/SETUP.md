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

#### Option 1: Using Installer (Easiest)

1. Go to [Node.js official website](https://nodejs.org/)
2. Download the **LTS (Long Term Support)** version (recommended for stability)
3. Run the downloaded `.msi` installer
4. Follow the installation wizard:
   - Accept the license agreement
   - Choose installation location (default is fine)
   - Keep "npm package manager" checked
   - Click "Install"
5. Restart your computer after installation

#### Option 2: Using Chocolatey (Advanced)

If you have Chocolatey installed:
```powershell
choco install nodejs
```

#### Verify Installation

Open **Command Prompt** or **PowerShell** and type:
```cmd
node --version
npm --version
```

You should see version numbers displayed (e.g., v20.10.0 and 10.2.3).

---

### For macOS:

#### Option 1: Using Homebrew (Recommended)

Homebrew is a package manager for macOS that makes installation easier.

**Step 1: Install Homebrew** (if not already installed)

Open **Terminal** and run:
```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

Follow the on-screen instructions.

**Step 2: Install Node.js**

```bash
brew install node@20
```

**Step 3: Verify Installation**

```bash
node --version
npm --version
```

#### Option 2: Using Installer

1. Go to [Node.js official website](https://nodejs.org/)
2. Download the **LTS (Long Term Support)** version for macOS
3. Run the `.pkg` installer
4. Follow the installation wizard
5. Restart Terminal or run:
   ```bash
   source ~/.zprofile
   ```

**Step 3: Verify Installation**

Open **Terminal** and type:
```bash
node --version
npm --version
```

#### Option 3: Using MacPorts (Alternative)

If you have MacPorts installed:
```bash
sudo port install nodejs20 +universal
```

---

### For Linux (Ubuntu/Debian):

```bash
sudo apt update
sudo apt install nodejs npm
node --version
npm --version
```

## Step 2: Set Up PostgreSQL Locally

PostgreSQL is the database used by this application to store user information.

### For Windows:

#### Option 1: Using Installer (Recommended)

1. Go to [PostgreSQL Downloads for Windows](https://www.postgresql.org/download/windows/)
2. Click on the **Latest version** link (currently PostgreSQL 16/17)
3. Download the installer executable
4. Run the installer and follow the wizard:
   - Accept the license
   - Choose installation directory (default: `C:\Program Files\PostgreSQL`)
   - Select components to install:
     - ✓ PostgreSQL Server
     - ✓ pgAdmin 4 (GUI tool for managing databases)
     - ✓ Stack Builder (for additional tools)
     - ✓ Command Line Tools
   - Choose the data directory (default is fine)
   - **Important:** Set a strong password for the `postgres` superuser - write it down!
   - Port: Keep as 5432 (default)
   - Locale: Select your region
5. Click "Next" and let it install
6. Uncheck "Launch Stack Builder" at the end (optional)

#### Option 2: Using Chocolatey (Advanced)

If you have Chocolatey installed:
```powershell
choco install postgresql
```

#### Verify Installation

Open **Command Prompt** and type:
```cmd
psql --version
```

You should see: `psql (PostgreSQL) 16.x` or similar.

#### Add PostgreSQL to PATH (if needed)

1. Open System Properties:
   - Press `Win + X`, select "System"
   - Click "Advanced system settings"
   - Click "Environment Variables"
2. Under "System variables", find `Path` and click "Edit"
3. Click "New" and add: `C:\Program Files\PostgreSQL\16\bin`
4. Click OK and restart Command Prompt

#### Create Database

Open **Command Prompt** (or **pgAdmin 4**) and run:
```cmd
psql -U postgres
```

Enter your postgres password when prompted, then:
```sql
CREATE DATABASE csc317_project;
\q
```

---

### For macOS:

#### Option 1: Using Homebrew (Recommended)

Open **Terminal** and run:

```bash
# Install PostgreSQL
brew install postgresql@17

# Start PostgreSQL service
brew services start postgresql@17

# Verify installation
psql --version
```

#### Option 2: Using Postgres.app (GUI - Easiest)

1. Go to [Postgres.app](https://postgresapp.com/)
2. Download the latest version
3. Move the `Postgres.app` to your Applications folder
4. Double-click to launch it
5. Click "Initialize" to create a new server
6. PostgreSQL is now running in the background

**Verify:**
```bash
psql --version
```

#### Option 3: Using MacPorts (Alternative)

```bash
sudo port install postgresql17
```

#### Option 4: Using Docker (Advanced)

If you have Docker installed:
```bash
docker run --name postgres -e POSTGRES_PASSWORD=postgres -d postgres:17
```

#### Create Database

```bash
# Using psql
psql -U postgres

# In the PostgreSQL prompt:
CREATE DATABASE csc317_project;
\q
```

Or with Postgres.app:
```bash
/Applications/Postgres.app/Contents/Versions/17/bin/psql -U postgres
```

Then run the same SQL commands above.

#### If psql command not found (Homebrew)

Add PostgreSQL to your PATH. Edit `~/.zprofile` or `~/.bash_profile`:

```bash
nano ~/.zprofile
```

Add this line:
```bash
export PATH="/usr/local/opt/postgresql@17/bin:$PATH"
```

Save (Ctrl+X, then Y, then Enter), then reload:
```bash
source ~/.zprofile
```

---

### For Linux (Ubuntu/Debian):

```bash
sudo apt update
sudo apt install postgresql postgresql-contrib

# Start PostgreSQL
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Verify installation
psql --version
```

#### Create Database

```bash
sudo -u postgres psql

# In the PostgreSQL prompt:
CREATE DATABASE csc317_project;
\q
```

## Step 3: Install Git

### For Windows:

1. Go to [Git for Windows](https://git-scm.com/download/win)
2. Download the installer
3. Run the installer and follow the wizard:
   - Accept the license
   - Choose installation location
   - Use default options for most settings
   - **Important:** When asked "Which editor would you like to use?", choose your preference (VS Code recommended)
   - Complete the installation
4. Open **Command Prompt** and verify:
   ```cmd
   git --version
   ```

### For macOS:

**Option 1: Using Homebrew (Recommended)**
```bash
brew install git
git --version
```

**Option 2: Using Installer**
1. Go to [Git for Mac](https://git-scm.com/download/mac)
2. Download the installer
3. Run and follow the installation wizard

**Option 3: Using Xcode Command Line Tools**
```bash
xcode-select --install
```

---

## Step 4: Fork and Clone the Template

### Step 4.1: Fork the Repository

1. Go to the [CSC317 Repository](https://github.com/Mystic2122/CSC317Project-F25)
2. Click the **"Fork"** button in the top right corner
3. Select your GitHub account as the destination
4. Wait for the fork to complete

### Step 4.2: Clone Your Fork

#### For Windows:

Open **Command Prompt** or **PowerShell**:
```cmd
cd Documents
git clone https://github.com/YOUR-USERNAME/CSC317Project-F25.git
cd CSC317Project-F25
```

#### For macOS:

Open **Terminal**:
```bash
cd Documents
git clone https://github.com/YOUR-USERNAME/CSC317Project-F25.git
cd CSC317Project-F25
```

#### For Linux:

```bash
cd ~
git clone https://github.com/YOUR-USERNAME/CSC317Project-F25.git
cd CSC317Project-F25
```

**Replace `YOUR-USERNAME` with your actual GitHub username!**

### Alternative: Download as ZIP

If you prefer not to use Git:
1. Go to your forked repository on GitHub
2. Click **"Code"** → **"Download ZIP"**
3. Extract the ZIP file to your desired location

## Step 5: Install Project Dependencies

In the project directory, run:

#### For Windows (Command Prompt or PowerShell):
```cmd
npm install
```

#### For macOS and Linux (Terminal):
```bash
npm install
```

This will install all the required dependencies specified in `package.json`. You should see output showing packages being installed. Wait for it to complete.

**Expected output:**
```
added 223 packages, and audited 224 packages in 12s
```

---

## Step 6: Set Up Environment Variables

### Step 6.1: Generate a Secure Session Secret

#### For Windows (Command Prompt):
```cmd
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

#### For macOS and Linux (Terminal):
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Copy the output string - you'll need it in the next step.

### Step 6.2: Create the `.env` File

Navigate to your project root directory and create a `.env` file:

#### For Windows (using Notepad):
1. Open Notepad
2. Paste the following content:
```
PORT=3000
NODE_ENV=development
DATABASE_URL=postgresql://postgres:your_password@localhost:5432/csc317_project
SESSION_SECRET=paste_the_generated_string_here
```
3. Replace `your_password` with the PostgreSQL password you set earlier
4. Replace `paste_the_generated_string_here` with the string from Step 6.1
5. Save as `.env` in your project root folder (important: not `.env.txt`)

#### For macOS and Linux (using Terminal):
```bash
cat > .env << 'EOF'
PORT=3000
NODE_ENV=development
DATABASE_URL=postgresql://postgres:your_password@localhost:5432/csc317_project
SESSION_SECRET=paste_the_generated_string_here
EOF
```

Replace `your_password` and the SESSION_SECRET accordingly.

### Step 6.3: Verify the `.env` File

#### For Windows:
In Command Prompt, run:
```cmd
type .env
```

#### For macOS and Linux:
In Terminal, run:
```bash
cat .env
```

You should see the environment variables you just set.

---

## Step 7: Initialize the Database Tables

Run the database initialization script:

#### For Windows:
```cmd
npm run db:init
```

#### For macOS and Linux:
```bash
npm run db:init
```

**Expected output:**
```
Connected to PostgreSQL database
✓ Users table created
✓ Profile images table created
✓ Session table created
✓ Indexes created

✅ Database initialization complete!
```

If you see an error, make sure:
- PostgreSQL is running
- The `DATABASE_URL` in `.env` is correct
- You've set the correct password

---

## Step 8: Start the Application

### For Windows (Command Prompt or PowerShell):
```cmd
npm run dev
```

### For macOS and Linux (Terminal):
```bash
npm run dev
```

**Expected output:**
```
[nodemon] 3.1.11
[nodemon] watching path(s): *.*
[nodemon] starting `node app.js`
PostgreSQL session store configured
CSRF protection is currently disabled
Server running on http://localhost:3000
Connected to PostgreSQL database
PostgreSQL connected successfully
```

The server is now running!

---

## Step 9: Access the Application

Open your web browser and navigate to:
```
http://localhost:3000
```

You should see the home page of the authentication template.

### Test the Application

1. Click **"Register"** and create a test account
2. Fill in:
   - Username: testuser
   - Email: test@example.com
   - Password: Test1234 (or any password meeting the requirements)
3. Click **"Register"**
4. You should be redirected to the login page with a success message
5. Click **"Login"** and log in with your credentials
6. You should be redirected to your profile page
7. Click **"Settings"** to test the profile image upload feature
8. Click **"Logout"** to test the logout functionality

---

## Stopping the Application

### For Windows:
In Command Prompt/PowerShell where the app is running, press:
```
Ctrl + C
```

### For macOS and Linux:
In Terminal where the app is running, press:
```
Ctrl + C
```

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
