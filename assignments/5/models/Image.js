/**
 * Image model
 * Database operations for storing user profile images using PostgreSQL
 */
const { query } = require('../config/database');

/**
 * Create or update a profile image for a user
 * Uses upsert to replace existing image if one exists
 * @param {number} userId - User's ID
 * @param {Buffer} data - Image binary data
 * @param {string} contentType - MIME type of the image
 * @returns {Promise<Object>} Created/updated image object
 */
const upsert = async (userId, data, contentType) => {
  const result = await query(
    `INSERT INTO profile_images (user_id, data, content_type)
     VALUES ($1, $2, $3)
     ON CONFLICT (user_id)
     DO UPDATE SET data = $2, content_type = $3, created_at = CURRENT_TIMESTAMP
     RETURNING id, user_id, content_type, created_at`,
    [userId, data, contentType]
  );

  return result.rows[0];
};

/**
 * Find profile image by user ID
 * @param {number} userId - User's ID
 * @returns {Promise<Object|null>} Image object with data or null
 */
const findByUserId = async (userId) => {
  const result = await query(
    `SELECT id, user_id, data, content_type, created_at
     FROM profile_images
     WHERE user_id = $1`,
    [userId]
  );

  return result.rows[0] || null;
};

/**
 * Delete profile image by user ID
 * @param {number} userId - User's ID
 * @returns {Promise<boolean>} True if image was deleted
 */
const deleteByUserId = async (userId) => {
  const result = await query(
    'DELETE FROM profile_images WHERE user_id = $1',
    [userId]
  );

  return result.rowCount > 0;
};

module.exports = {
  upsert,
  findByUserId,
  deleteByUserId
};
