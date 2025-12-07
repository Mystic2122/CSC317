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

/**
 * @param {string} title
 * @returns {Promise<Object[] | Object>}
 */
const findMovieByTitle = async (title) => {
    const result = await query(
        `SELECT title, year, rating, genre, plot, image
         FROM movies
         WHERE LOWER(title) = LOWER($1)`,
         [title]
    );

    if (result.rows.length > 0){
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
    
    const url = `http://www.omdbapi.com/?apikey=${API_KEY}&t=${title}`
    const newMovie = await APIgetMovie(url);
    console.log("OMDb response:", newMovie);

    if (!newMovie || newMovie.Response === "False") {
        console.error("OMDb error:", newMovie && newMovie.Error);
        throw new Error("Failed to fetch movie from OMDb");
    }
    
    const newTitle = newMovie['Title']
    let yearVal = parseInt(newMovie["Year"]);
    if (isNaN(yearVal)) {
        yearVal = null;
    }

    const rating = newMovie['Rated'];
    

    const genre = newMovie['Genre']
    const plot = newMovie['Plot']
    const image = newMovie['Poster']

    const newRow = await insert(newTitle, yearVal, rating, genre, plot, image);
    console.log("Saved movie to DB from API");
    return [newRow];
};

module.exports = {
    insert,
    findMovieByTitle,
};



