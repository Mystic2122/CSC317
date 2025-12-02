/**
 * User Controller
 * Handles logic for user-related pages and actions
 */
const User = require('../models/User');
const Image = require('../models/Image');
const upload = require('../middlewares/upload');

/**
 * Display user profile page
 */
exports.getProfile = (req, res) => {
  // Add hasProfileImage flag to user object
  const user = { ...req.session.user };
  user.hasProfileImage = user.hasProfileImage || false;

  res.render('user/profile', {
    title: 'Profile',
    user: user
  });
};

/**
 * Display user settings page
 */
exports.getSettings = (req, res) => {
  res.render('user/settings', {
    title: 'Settings',
    user: req.session.user,
    errors: []
  });
};

/**
 * Update user settings
 */
exports.updateSettings = [
  // Use multer middleware to handle file upload
  // We need to handle errors from multer separately
  async (req, res, next) => {
    try {
      upload.single('profileImage')(req, res, async (err) => {
        if (err) {
          // Handle file upload error
          return res.status(400).render('user/settings', {
            title: 'Settings',
            user: req.session.user,
            errors: [{ msg: err.message || 'File upload error' }]
          });
        }

        try {
          // Get user ID from session
          const userId = req.session.user.id;

          // Find user in database
          const user = await User.findById(userId);

          if (!user) {
            const error = new Error('User not found');
            error.statusCode = 404;
            throw error;
          }

          // Update username if provided and different
          if (req.body.username && req.body.username !== user.username) {
            // Check if username is already taken
            const existingUser = await User.findByUsername(req.body.username);
            if (existingUser && existingUser.id !== userId) {
              return res.status(400).render('user/settings', {
                title: 'Settings',
                user: req.session.user,
                errors: [{ msg: 'Username is already taken' }]
              });
            }

            // Update username in database
            await User.updateUsername(userId, req.body.username);
            // Update session data
            req.session.user.username = req.body.username;
          }

          // Process profile image if uploaded
          if (req.file) {
            try {
              // Upsert profile image (creates or updates)
              await Image.upsert(userId, req.file.buffer, req.file.mimetype);

              // Update user's hasProfileImage flag if not already set
              if (!user.has_profile_image) {
                await User.updateProfileImageFlag(userId, true);
              }

              // Update session to indicate user has a profile image
              req.session.user.hasProfileImage = true;
            } catch (imageError) {
              console.error('Error handling profile image:', imageError);
              return res.status(500).render('user/settings', {
                title: 'Settings',
                user: req.session.user,
                errors: [{ msg: 'Error saving profile image' }]
              });
            }
          }

          // Render settings page with success message
          res.render('user/settings', {
            title: 'Settings',
            user: req.session.user,
            errors: [],
            flashMessage: {
              type: 'success',
              text: 'Settings updated successfully'
            }
          });
        } catch (error) {
          next(error);
        }
      });
    } catch (error) {
      next(error);
    }
  }
];

/**
 * Get current user's profile image
 */
exports.getProfileImage = async (req, res, next) => {
  try {
    // Get user ID from session
    const userId = req.session.user.id;

    // Find image in database
    const image = await Image.findByUserId(userId);

    if (!image || !image.data) {
      return res.status(404).send('Image not found');
    }

    // Set the content type header and send the image data
    res.set('Content-Type', image.content_type);
    res.send(image.data);
  } catch (error) {
    next(error);
  }
};

/**
 * Get any user's profile image by ID
 */
exports.getUserProfileImage = async (req, res, next) => {
  try {
    // Get user ID from params
    const userId = req.params.userId;

    // Find image in database
    const image = await Image.findByUserId(userId);

    if (!image || !image.data) {
      return res.status(404).send('Image not found');
    }

    // Set the content type header and send the image data
    res.set('Content-Type', image.content_type);
    res.send(image.data);
  } catch (error) {
    next(error);
  }
};
