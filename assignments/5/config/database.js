/**
 * PostgreSQL Database Configuration
 *
 * This module creates and exports a connection pool to the PostgreSQL database.
 * The pool manages multiple connections for better performance.
 */

const { Pool } = require('pg');

// Create a connection pool using the DATABASE_URL environment variable
// This URL format works for both local PostgreSQL and Render.com
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  // SSL configuration for production (Render.com requires SSL)
  ssl: process.env.NODE_ENV === 'production'
    ? { rejectUnauthorized: false }
    : false
});

// Log successful connection
pool.on('connect', () => {
  console.log('Connected to PostgreSQL database');
});

// Handle pool errors
pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
  process.exit(-1);
});

/**
 * Query helper function
 * @param {string} text - SQL query string
 * @param {Array} params - Query parameters
 * @returns {Promise} Query result
 */
const query = (text, params) => pool.query(text, params);

/**
 * Get a client from the pool for transactions
 * @returns {Promise} Pool client
 */
const getClient = () => pool.connect();

module.exports = {
  pool,
  query,
  getClient
};
