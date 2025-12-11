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

const upsert = async (userId, movieId, review) => {
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

const getReviewsByUser = async (userId) => {
  const result = await query(
    `SELECT movie_id, review
        FROM reviews
        WHERE user_id = $1`,
    [userId]
  );
  return result.rows
};

const getReviewsByMovie = async (movieId) => {
  const result = await query(
    `SELECT user_id, review
        FROM reviews
        WHERE movie_id = $1`,
    [movieId]
  );
  return result.rows
};

// Get all reviews for a user, including movie titles
const getUserReviewsWithMovieInfo = async (userId) => {
  const result = await query(
    `SELECT r.review,
            r.created_at,
            r.edited,
            m.id AS movie_id,
            m.title AS movie_title,
            m.year,
            m.image
     FROM reviews r
     JOIN movies m ON r.movie_id = m.id
     WHERE r.user_id = $1
     ORDER BY r.created_at DESC`,
    [userId]
  );
  return result.rows;
};


// Get this user's review for a specific movie (if any)
const getUserReviewForMovie = async (userId, movieId) => {
  const result = await query(
    `SELECT review, created_at, edited
     FROM reviews
     WHERE user_id = $1 AND movie_id = $2`,
    [userId, movieId]
  );
  return result.rows[0] || null;
};

// Get all reviews for a movie, including username
const getMovieReviewsWithUsers = async (movieId) => {
  const result = await query(
    `SELECT r.review,
            r.created_at,
            r.edited,
            u.username
     FROM reviews r
     JOIN users u ON r.user_id = u.id
     WHERE r.movie_id = $1
     ORDER BY r.created_at DESC`,
    [movieId]
  );
  return result.rows;
};


// Delete a user's review for a movie
const deleteReview = async (userId, movieId) => {
  const result = await query(
    `DELETE FROM reviews
     WHERE user_id = $1 AND movie_id = $2
     RETURNING *`,
    [userId, movieId]
  );
  return result.rowCount > 0;
};

module.exports = {
  upsert,
  getReviewsByUser,
  getReviewsByMovie,
  getUserReviewsWithMovieInfo,
  getUserReviewForMovie,
  getMovieReviewsWithUsers,
  deleteReview,
};
