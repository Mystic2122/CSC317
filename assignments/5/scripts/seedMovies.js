// scripts/seedMovies.js
const { pool } = require('../config/database');
const { findMovieByTitle } = require('../models/Movie');

async function seed() {
  try {
    const titles = [
      'Over the Hedge',
      'Shrek',
      'The Incredibles',
      'Toy Story',
      'Inception',
      'My Neighbor Totoro',
      'suzume'
    ];

    for (const title of titles) {
      console.log(`Seeding: ${title}`);
      await findMovieByTitle(title);
    }

    console.log('Done seeding movies.');
  } catch (err) {
    console.error('Seed error:', err);
  } finally {
    await pool.end();
  }
}

seed();
