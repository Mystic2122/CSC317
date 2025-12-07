/**
 * Review model
 * Database operations for storing and updating reviews in PostgreSQL
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