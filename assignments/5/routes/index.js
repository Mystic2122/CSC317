/**
 * Index routes
 * Handles public routes that don't require authentication
 */
const express = require('express');
const router = express.Router();

// Home page route (index)
router.get('/', (req, res) => {
  console.log('[/] req.session.user =', req.session?.user);

  // If user is logged in, send them to /home
  if (req.session && req.session.user) {
    return res.redirect('/home');
  }

  // If not logged in, show the original index page
  res.render('index', { 
    title: 'Home',
    message: 'Welcome to the Authentication Template',
    isAuthenticated: false
  });
});

// About page route
router.get('/about', (req, res) => {
  res.render('about', { 
    title: 'About',
    message: 'Learn about this application',
    isAuthenticated: req.session.user
  });
});

// Home page (movie site) route
router.get('/home', (req, res) => {
  res.render('home', {
    title: 'Home Page',
    message: 'Welcome to the Home Page!',
    isAuthenticated: req.session.user
  });
});

module.exports = router;
