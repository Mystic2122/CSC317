/**
 * Index routes
 * Handles public routes that don't require authentication
 */
const express = require('express');
const router = express.Router();
const Movie = require('../models/Movie');
const Review = require('../models/Review');
const { isAuthenticated } = require('../middlewares/auth');
const { body, validationResult } = require('express-validator');

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
      Movie.getTrendingMovies(8),   // top by reviews this week
      Movie.getPopularMovies(8),   // top by reviews all time (includes 0-review movies)
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
      path: req.path,
      error: null      // 👈 add this
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

// Show all reviews by the logged-in user
router.get('/my-reviews', isAuthenticated, async (req, res, next) => {
  try {
    const userId = req.session.user.id;

    // Get all reviews + movie titles
    const reviews = await Review.getUserReviewsWithMovieInfo(userId);

    res.render('my-reviews', {
      title: 'My Reviews',
      isAuthenticated: req.session.user,
      path: req.path,
      reviews,
    });
  } catch (err) {
    next(err);
  }
});

// Movie detail page with reviews and review form
router.get('/movies/:id', async (req, res, next) => {
  try {
    const movieId = parseInt(req.params.id, 10);
    if (isNaN(movieId)) {
      return res.status(400).send('Invalid movie id');
    }

    const movie = await Movie.findById(movieId);
    if (!movie) {
      return res.status(404).send('Movie not found');
    }

    // All reviews for this movie
    const reviews = await Review.getMovieReviewsWithUsers(movieId);

    // Current user's review (if logged in)
    let userReview = null;
    if (req.session.user) {
      userReview = await Review.getUserReviewForMovie(req.session.user.id, movieId);
    }

    res.render('review', {          // 👈 using review.ejs
      title: movie.title,
      movie,
      reviews,
      userReview,
      isAuthenticated: req.session.user,
      path: req.path,
      reviewError: null,
    });
  } catch (err) {
    next(err);
  }
});

// Review validation middleware
const reviewValidation = [
  body('review')
    .trim()
    .isLength({ min: 10, max: 1000 })
    .withMessage('Review must be between 10 and 1000 characters')
];

// Create or update review for a movie
router.post('/movies/:id/review', isAuthenticated, reviewValidation, async (req, res, next) => {
  try {
    const movieId = parseInt(req.params.id, 10);
    if (isNaN(movieId)) {
      return res.status(400).send('Invalid movie id');
    }

    // Check validation results
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // Re-render page with validation errors
      const movie = await Movie.findById(movieId);
      if (!movie) {
        return res.status(404).send('Movie not found');
      }

      const reviews = await Review.getMovieReviewsWithUsers(movieId);
      const userReview = await Review.getUserReviewForMovie(req.session.user.id, movieId);

      return res.render('review', {
        title: movie.title,
        movie,
        reviews,
        userReview,
        isAuthenticated: req.session.user,
        path: req.path,
        reviewError: errors.array()[0].msg,
      });
    }

    const reviewText = (req.body.review || '').trim();

    // Insert or update the review
    await Review.upsert(req.session.user.id, movieId, reviewText);

    // Redirect back to the movie page
    return res.redirect(`/movies/${movieId}`);
  } catch (err) {
    next(err);
  }
});

// Delete a review
router.delete('/movies/:movieId/review', isAuthenticated, async (req, res, next) => {
  try {
    const movieId = parseInt(req.params.movieId, 10);
    if (isNaN(movieId)) {
      return res.status(400).json({ error: 'Invalid movie id' });
    }

    const userId = req.session.user.id;

    // Check if review exists and belongs to user
    const existingReview = await Review.getUserReviewForMovie(userId, movieId);
    if (!existingReview) {
      return res.status(404).json({ error: 'Review not found' });
    }

    // Delete the review
    const deleted = await Review.deleteReview(userId, movieId);

    if (deleted) {
      return res.json({ success: true, message: 'Review deleted successfully' });
    } else {
      return res.status(500).json({ error: 'Failed to delete review' });
    }
  } catch (err) {
    next(err);
  }
});

module.exports = router;
