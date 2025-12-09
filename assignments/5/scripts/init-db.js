/**
 * Database Initialization Script
 *
 * Run this script to create the necessary tables in your PostgreSQL database.
 * Usage: npm run db:init
 */

require('dotenv').config();
const { pool } = require('../config/database');

const createTables = async () => {
  try {
    // Create users table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(20) NOT NULL UNIQUE,
        email VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        has_profile_image BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✓ Users table created');

    // Create profile_images table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS profile_images (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
        data BYTEA NOT NULL,
        content_type VARCHAR(50) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✓ Profile images table created');

    // Create session table for connect-pg-simple
    await pool.query(`
      CREATE TABLE IF NOT EXISTS "session" (
        "sid" VARCHAR NOT NULL COLLATE "default",
        "sess" JSON NOT NULL,
        "expire" TIMESTAMP(6) NOT NULL,
        PRIMARY KEY ("sid")
      )
    `);

    // Create index on session expire for cleanup
    await pool.query(`
      CREATE INDEX IF NOT EXISTS "IDX_session_expire" ON "session" ("expire")
    `);
    console.log('✓ Session table created');

    // Create indexes for better query performance
    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)
    `);
    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_users_username ON users(username)
    `);
    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_profile_images_user_id ON profile_images(user_id)
    `);
    console.log('✓ Indexes created');

    // TABLES FOR PROJECT
    // Movie Table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS movies(
        id SERIAL PRIMARY KEY,
        title VARCHAR(63) NOT NULL,
        year INT,
        rating VARCHAR(7),
        genre VARCHAR(127),
        plot TEXT,
        image VARCHAR(255)
      )
    `); // Maybe add: director VARCHAR(127), language VARCHAR(31), rotten_tomatoes int
    
    // Many-to-many users to movies association table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS reviews(
        user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        movie_id INT NOT NULL REFERENCES movies(id) ON DELETE CASCADE,
        review TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        edited BOOLEAN DEFAULT FALSE,
        PRIMARY KEY (user_id, movie_id)
      )
    `);

    console.log('\n✅ Database initialization complete!');
  } catch (error) {
    console.error('Error initializing database:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
};

createTables();
