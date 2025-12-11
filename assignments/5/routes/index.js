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

router.get('/search', async (req, res, next) => {
  try {
    const query = req.query.q;

    if (!query) {
      return res.redirect('/home');
    }

    // Try to find the movie locally or fetch via your findMovieByTitle()
    const results = await Movie.findLocalMovies(query);

    res.render('search-results', {
      title: 'Search Results',
      query,
      results,
      isAuthenticated: req.session.user,
      path: req.path
    });

  } catch (err) {
    next(err);
  }
});

router.post('/movies/add-from-api', async (req, res, next) => {
  try {
    const title = (req.body.title || '').trim();
    const yearRaw = (req.body.year || '').trim();
    const year = yearRaw ? parseInt(yearRaw, 10) : undefined;

    if (!title) {
      return res.render('search-results', {
        title: 'Search Results',
        query: '',
        results: [],
        error: 'Movie title is required.',
        isAuthenticated: req.session.user,
        path: req.path
      });
    }

    let results;
    try {
      results = await Movie.findMovieByTitle(title, year);
    } catch (err) {
      // Movie not found or API failed
      return res.render('search-results', {
        title: 'Search Results',
        query: title,
        results: [],
        error: 'Movie not found.',
        isAuthenticated: req.session.user,
        path: req.path
      });
    }

    if (!results || !results.length) {
      return res.render('search-results', {
        title: 'Search Results',
        query: title,
        results: [],
        error: 'Movie not found.',
        isAuthenticated: req.session.user,
        path: req.path
      });
    }

    // success → show search results page with new movie included
    return res.render('search-results', {
      title: 'Search Results',
      query: title,
      results,
      error: null,
      isAuthenticated: req.session.user,
      path: req.path
    });

  } catch (err) {
    next(err);
  }
});



module.exports = router;
