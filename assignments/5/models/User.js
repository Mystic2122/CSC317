/**
 * User model
 * Database operations for users using PostgreSQL
 */
const { query } = require('../config/database');
const bcrypt = require('bcrypt');

const SALT_ROUNDS = 10;

/**
 * Create a new user
 * @param {Object} userData - User data (username, email, password)
 * @returns {Promise<Object>} Created user object
 */
const create = async ({ username, email, password }) => {
  // Hash the password before storing
  const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

  const result = await query(
    `INSERT INTO users (username, email, password)
     VALUES ($1, $2, $3)
     RETURNING id, username, email, has_profile_image, created_at`,
    [username.trim(), email.trim().toLowerCase(), hashedPassword]
  );

  return result.rows[0];
};

/**
 * Find a user by email
 * @param {string} email - User's email
 * @returns {Promise<Object|null>} User object or null
 */
const findByEmail = async (email) => {
  const result = await query(
    `SELECT id, username, email, password, has_profile_image, created_at
     FROM users
     WHERE email = $1`,
    [email.toLowerCase()]
  );

  return result.rows[0] || null;
};

/**
 * Find a user by ID
 * @param {number} id - User's ID
 * @returns {Promise<Object|null>} User object or null
 */
const findById = async (id) => {
  const result = await query(
    `SELECT id, username, email, has_profile_image, created_at
     FROM users
     WHERE id = $1`,
    [id]
  );

  return result.rows[0] || null;
};

/**
 * Find a user by username
 * @param {string} username - User's username
 * @returns {Promise<Object|null>} User object or null
 */
const findByUsername = async (username) => {
  const result = await query(
    `SELECT id, username, email, has_profile_image, created_at
     FROM users
     WHERE username = $1`,
    [username]
  );

  return result.rows[0] || null;
};

/**
 * Check if email already exists
 * @param {string} email - Email to check
 * @returns {Promise<boolean>} True if email exists
 */
const emailExists = async (email) => {
  const result = await query(
    'SELECT 1 FROM users WHERE email = $1',
    [email.toLowerCase()]
  );

  return result.rows.length > 0;
};

/**
 * Check if username already exists
 * @param {string} username - Username to check
 * @returns {Promise<boolean>} True if username exists
 */
const usernameExists = async (username) => {
  const result = await query(
    'SELECT 1 FROM users WHERE username = $1',
    [username]
  );

  return result.rows.length > 0;
};

/**
 * Compare password with hash
 * @param {string} candidatePassword - Password to check
 * @param {string} hashedPassword - Stored hashed password
 * @returns {Promise<boolean>} True if passwords match
 */
const comparePassword = async (candidatePassword, hashedPassword) => {
  return bcrypt.compare(candidatePassword, hashedPassword);
};

/**
 * Update user's username
 * @param {number} userId - User's ID
 * @param {string} username - New username
 * @returns {Promise<Object>} Updated user object
 */
const updateUsername = async (userId, username) => {
  const result = await query(
    `UPDATE users
     SET username = $1
     WHERE id = $2
     RETURNING id, username, email, has_profile_image, created_at`,
    [username.trim(), userId]
  );

  return result.rows[0];
};

/**
 * Update user's profile image flag
 * @param {number} userId - User's ID
 * @param {boolean} hasImage - Whether user has profile image
 * @returns {Promise<Object>} Updated user object
 */
const updateProfileImageFlag = async (userId, hasImage) => {
  const result = await query(
    `UPDATE users
     SET has_profile_image = $1
     WHERE id = $2
     RETURNING id, username, email, has_profile_image, created_at`,
    [hasImage, userId]
  );

  return result.rows[0];
};

module.exports = {
  create,
  findByEmail,
  findById,
  findByUsername,
  emailExists,
  usernameExists,
  comparePassword,
  updateUsername,
  updateProfileImageFlag
};
