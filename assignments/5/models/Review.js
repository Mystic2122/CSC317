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

const upsert = async(userId, movieId, review) => {
    const result = await query(
        `INSERT INTO reviews (user_id, movie_id, review)
        VALUES ($1, $2, $3)
        ON CONFLICT (user_id, movie_id)
        DO UPDATE SET review = EXCLUDED.review, edited = TRUE
        RETURNING *`,
        [userId, movieId, review]
    );
    return result.rows[0]
};

const getReviewsByUser = async(userId) => {
    const result = await query(
        `SELECT movie_id, review
        FROM reviews
        WHERE user_id = $1`,
        [userId]
    );
    return result.rows 
};

const getReviewsByMovie = async(movieId) => {
    const result = await query(
        `SELECT user_id, review
        FROM reviews
        WHERE movie_id = $1`,
        [movieId]
    );
    return result.rows
};


module.exports = {
    upsert,
    getReviewsByUser,
    getReviewsByMovie
};
