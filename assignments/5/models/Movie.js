/**
 * Movie model
 * Database operations for storing movies in PostgreSQL
 */
const { query } = require('../config/database');
require("dotenv").config();

/**
 * Create or update a profile image for a user
 * Uses upsert to replace existing image if one exists
 * @param {string} title 
 * @param {string} year
 * @param {string} rating
 * @param {string} genre
 * @param {string} plot
 * @param {string} image \\ poster url
 * @returns {Promise<Object>} Created/updated image object
 */

// Insert Movie
const insert = async (title, year, rating, genre, plot, image) => {
    const result = await query(
        `INSERT INTO movies (title, year, rating, genre, plot, image)
         VALUES ($1, $2, $3, $4, $5, $6)
         RETURNING *`,
         [title, year, rating, genre, plot, image]
    );

    return result.rows[0];
};

const findMovieByTitle = async (title, year) => {
  const params = [title];
  let sql = `
    SELECT id, title, year, rating, genre, plot, image
    FROM movies
    WHERE LOWER(title) = LOWER($1)
  `;

  if (year) {
    sql += ' AND year = $2';
    params.push(year);
  }

  const result = await query(sql, params);

  if (result.rows.length > 0) {
    console.log("Loaded movie(s) from db");
    return result.rows;
  }

  console.log("Fetching movie from external API");
  const API_KEY = process.env.MOVIE_API_KEY;

  async function APIgetMovie(url) {
    const res = await fetch(url);
    const data = await res.json();
    return data;
  }

  let url = `http://www.omdbapi.com/?apikey=${API_KEY}&t=${encodeURIComponent(title)}`;
  if (year) {
    url += `&y=${year}`;
  }

  const newMovie = await APIgetMovie(url);
  console.log("OMDb response:", newMovie);

  if (!newMovie || newMovie.Response === "False") {
    console.error("OMDb error:", newMovie && newMovie.Error);
    throw new Error("Failed to fetch movie from OMDb");
  }

  const newTitle = newMovie['Title'];
  let yearVal = parseInt(newMovie["Year"]);
  if (isNaN(yearVal)) {
    yearVal = null;
  }

  const rating = newMovie['Rated'];
  const genre = newMovie['Genre'];
  const plot = newMovie['Plot'];
  const image = newMovie['Poster'];

  const newRow = await insert(newTitle, yearVal, rating, genre, plot, image);
  console.log("Saved movie to DB from API");
  return [newRow];
};


// Get most-reviewed movies of all time (popular), including movies with 0 reviews
const getPopularMovies = async (limit = 10) => {
  const result = await query(
    `SELECT
       m.id,
       m.title,
       m.year,
       m.rating,
       m.genre,
       m.plot,
       m.image,
       COUNT(r.user_id) AS review_count_all
     FROM movies m
     LEFT JOIN reviews r ON r.movie_id = m.id
     GROUP BY m.id
     ORDER BY review_count_all DESC, m.title ASC
     LIMIT $1`,
    [limit]
  );
  return result.rows;
};

// Get most-reviewed movies in the last 7 days (trending)
// This only includes movies that HAVE reviews this week
const getTrendingMovies = async (limit = 5) => {
  const result = await query(
    `SELECT
       m.id,
       m.title,
       m.year,
       m.rating,
       m.genre,
       m.plot,
       m.image,
       COUNT(r.user_id) AS review_count_week
     FROM movies m
     JOIN reviews r ON r.movie_id = m.id
     WHERE r.created_at >= NOW() - INTERVAL '7 days'
     GROUP BY m.id
     ORDER BY review_count_week DESC, m.title ASC
     LIMIT $1`,
    [limit]
  );
  return result.rows;
};

// Fallback: get more movies (even with 0 reviews) to ensure we have enough
const getAdditionalMovies = async (excludeIds = [], limit = 10) => {
  const result = await query(
    `SELECT
       m.id,
       m.title,
       m.year,
       m.rating,
       m.genre,
       m.plot,
       m.image
     FROM movies m
     WHERE NOT (m.id = ANY($1))
     ORDER BY m.year DESC, m.title ASC
     LIMIT $2`,
    [excludeIds, limit]
  );
  return result.rows;
};

const findLocalMovies = async (title) => {
  const result = await query(
    `SELECT id, title, year, rating, genre, plot, image
     FROM movies
     WHERE title ILIKE $1`,
    [`%${title}%`]        
  );
  return result.rows;
};

// Get a single movie by id
const findById = async (id) => {
  const result = await query(
    `SELECT id, title, year, rating, genre, plot, image
     FROM movies
     WHERE id = $1`,
    [id]
  );
  return result.rows[0] || null;
};


module.exports = {
    insert,
    findMovieByTitle,
    getPopularMovies,
    getTrendingMovies,
    getAdditionalMovies,
    findLocalMovies,
    findById,
};



