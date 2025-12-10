/**
 * Main application entry point
 * This file sets up our Express server, middleware, and routes
 */

// Load environment variables from .env file
require('dotenv').config();

// Core dependencies
const express = require('express');
const path = require('path');
const session = require('express-session');
const pgSession = require('connect-pg-simple')(session);
const csrf = require('csurf');

// Import database configuration
const { pool } = require('./config/database');

// Import routes
const indexRoutes = require('./routes/index');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');

// Import custom middleware
const { setLocals } = require('./middlewares/locals');
const { handleErrors } = require('./middlewares/error-handler');

// Initialize Express app
const app = express();

// Test database connection on startup
if (process.env.DATABASE_URL) {
  pool.query('SELECT NOW()')
    .then(() => console.log('PostgreSQL connected successfully'))
    .catch(err => {
      console.error('PostgreSQL connection error:', err);
      console.log('Continuing without database. Some features may not work.');
    });
} else {
  console.log('No DATABASE_URL found in environment.');
  console.log('Please set up your PostgreSQL connection in the .env file to enable authentication features.');
}

// Configure Express
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Set up EJS view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Helper function for error responses
app.locals.helpers = {
  isActiveRoute: (path, route) => path === route,
  currentYear: () => new Date().getFullYear(),
  formatDate: (date) => {
    if (!date) return '';
    const d = new Date(date);
    return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  }
};

// Session configuration
let sessionConfig = {
  secret: process.env.SESSION_SECRET || 'fallback-secret-for-development',
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24, // 1 day
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax'
  }
};

// Configure PostgreSQL session store
try {
  if (process.env.DATABASE_URL) {
    sessionConfig.store = new pgSession({
      pool: pool,
      tableName: 'session',
      createTableIfMissing: true
    });
    console.log('PostgreSQL session store configured');
  } else {
    console.log('Using memory session store (not recommended for production)');
  }
} catch (error) {
  console.error('Error configuring PostgreSQL session store:', error);
  console.log('Falling back to memory session store (not recommended for production)');
}

app.use(session(sessionConfig));

// CSRF protection disabled temporarily
console.log('CSRF protection is currently disabled');

// Set a dummy CSRF token for templates
app.use((req, res, next) => {
  // Provide a dummy token so templates don't break
  res.locals.csrfToken = 'csrf-protection-disabled';
  next();
});

// Our custom locals middleware
app.use(setLocals);

// Routes
app.use('/', indexRoutes);
app.use('/auth', authRoutes);
app.use('/user', userRoutes);

// Error handling middleware
app.use(handleErrors);

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on http://0.0.0.0:${PORT}`);
});
