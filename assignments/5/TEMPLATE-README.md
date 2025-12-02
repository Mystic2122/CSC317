# User Authentication Template

A complete web application template with user authentication features built with Express.js, PostgreSQL, and vanilla JavaScript. This template serves as a foundation for students to build upon in their web development projects.

## Features

- User registration and login system
- Secure password hashing with bcrypt
- Session management with express-session
- Protected routes that require authentication
- CSRF protection
- Form validation with express-validator
- Responsive UI with clean CSS (no frameworks)
- MVC architecture pattern with EJS templating
- PostgreSQL database integration
- Profile image upload and storage

## Project Structure

```
.
├── app.js                 # Application entry point
├── config/                # Configuration files
│   └── database.js        # PostgreSQL connection pool
├── controllers/           # Route controllers
│   ├── authController.js  # Authentication logic
│   └── userController.js  # User-related logic
├── middlewares/           # Custom middleware
│   ├── auth.js            # Authentication middleware
│   ├── error-handler.js   # Error handling middleware
│   ├── locals.js          # Template locals middleware
│   └── upload.js          # File upload middleware
├── models/                # Database operations
│   ├── User.js            # User data access functions
│   └── Image.js           # Profile image data access
├── public/                # Static assets
│   ├── css/
│   ├── js/
│   └── images/
├── routes/                # Express routes
│   ├── auth.js            # Authentication routes
│   ├── index.js           # Public routes
│   └── user.js            # Protected user routes
├── scripts/               # Utility scripts
│   └── init-db.js         # Database initialization
└── views/                 # EJS templates
    ├── partials/          # Reusable template parts (header, footer, etc.)
    ├── auth/              # Authentication templates
    └── user/              # User-related templates
```

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- PostgreSQL

### Installation

1. Fork and clone the repository:
   ```bash
   # Fork on GitHub first, then clone your fork
   git clone https://github.com/YOUR-USERNAME/CSC317Project-F25.git
   cd CSC317Project-F25
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file in the root directory:
   ```
   cp .env.example .env
   ```

4. Modify the `.env` file with your configuration:
   ```
   PORT=3000
   NODE_ENV=development
   DATABASE_URL=postgresql://postgres:your_password@localhost:5432/csc317_project
   SESSION_SECRET=your_secure_secret_key
   ```

5. Create the database and initialize tables:
   ```
   createdb csc317_project
   npm run db:init
   ```

6. Start the development server:
   ```
   npm run dev
   ```

7. Open your browser and visit `http://localhost:3000`

## Educational Components

This template includes detailed comments throughout the codebase to explain:

- Authentication flow and best practices
- Password hashing implementation
- Session management
- Middleware usage
- Security considerations
- Form validation
- SQL queries and database interactions

## Security Features

- Passwords are hashed using bcrypt
- CSRF protection for all forms
- HTTP-only session cookies
- Input validation and sanitization
- Parameterized SQL queries (prevents SQL injection)
- Secure session configuration
- Protection against common web vulnerabilities

## Development

### Running in Development Mode

```
npm run dev
```

This will start the server with nodemon, which automatically restarts when files change.

### Running in Production Mode

```
npm start
```

## Deployment

For deployment to Render.com:

1. Create a PostgreSQL database on Render
2. Create a Web Service connected to your GitHub repository
3. Set environment variables (DATABASE_URL, SESSION_SECRET, NODE_ENV)
4. Initialize the database using Render Shell: `npm run db:init`

See [SETUP.md](SETUP.md) for detailed deployment instructions.

## Database Schema

### Users Table
```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(20) NOT NULL UNIQUE,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  has_profile_image BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Profile Images Table
```sql
CREATE TABLE profile_images (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  data BYTEA NOT NULL,
  content_type VARCHAR(50) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## License

This project is available for educational purposes.

## Acknowledgments

- This template was created as a learning resource for web development students
- Built with Express.js, PostgreSQL, and other open-source technologies
