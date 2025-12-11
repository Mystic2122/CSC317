/**
 * Index routes
 * Handles public routes that don't require authentication
 */
const express = require('express');
const router = express.Router();
const Movie = require('../models/Movie');

// Root page route
router.get('/', (req, res) => {
  res.render('index', { 
    title: 'Home',
    message: 'Welcome to the Movie Review',
    isAuthenticated: req.session.user,
    path: req.path,
  });
});

// About page route
router.get('/about', (req, res) => {
  res.render('about', { 
    title: 'About',
    message: 'Learn about this application',
    isAuthenticated: req.session.user,
    path: req.path,
  });
});

// Home page (trending + popular + ensure at least 10 movies)
router.get('/home', async (req, res, next) => {
  try {
    // 1) Get trending and popular lists
    const [trendingMoviesRaw, popularMoviesRaw] = await Promise.all([
      Movie.getTrendingMovies(5),   // top by reviews this week
      Movie.getPopularMovies(10),   // top by reviews all time (includes 0-review movies)
    ]);

    // 2) De-duplicate movies between trending & popular
    const trendingIds = trendingMoviesRaw.map(m => m.id);

    const trendingMovies = trendingMoviesRaw;
    const popularMovies = popularMoviesRaw.filter(m => !trendingIds.includes(m.id));

    // 3) Ensure we have at least 10 total unique movies
    const totalSoFar = trendingMovies.length + popularMovies.length;

    let extraMovies = [];
    if (totalSoFar < 10) {
      const excludeIds = [
        ...new Set([
          ...trendingMovies.map(m => m.id),
          ...popularMovies.map(m => m.id),
        ]),
      ];
      const needed = 10 - totalSoFar;
      extraMovies = await Movie.getAdditionalMovies(excludeIds, needed);
    }

    // final popular list includes "popular + extra filler"
    const finalPopularMovies = popularMovies.concat(extraMovies);

    // Choose a featured movie (first trending, otherwise first popular)
    const featuredMovie =
      trendingMovies[0] || finalPopularMovies[0] || null;

    res.render('home', {
      title: 'Home Page',
      message: 'Welcome to the Home Page!',
      isAuthenticated: req.session.user,
      path: req.path,
      featuredMovie,
      trendingMovies,
      popularMovies: finalPopularMovies,
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
