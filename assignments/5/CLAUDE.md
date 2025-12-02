# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build/Run/Test Commands
- `npm start` - Start the production server
- `npm run dev` - Start the development server with hot reloading
- `npm run db:init` - Initialize the PostgreSQL database tables
- `npm test` - Currently configured to exit with error (not implemented)

## Code Style Guidelines
- **Formatting**: 2-space indentation, single quotes for strings
- **Imports**: Group by type (npm packages first, then local modules)
- **Comments**: Use JSDoc-style comments for functions and modules
- **Naming**: camelCase for variables/functions, PascalCase for classes
- **Error Handling**: Use try/catch blocks and pass errors to next() for centralized handling
- **Validation**: Use express-validator for input validation
- **Module Pattern**: Use CommonJS (require/exports), not ES modules
- **Async Code**: Use async/await over callbacks or promise chains
- **Sessions/Auth**: Store minimal user info in session, validate with middleware

## Database
- **PostgreSQL** with raw `pg` driver (no ORM)
- Database configuration in `config/database.js`
- Models export functions for database operations (not Mongoose-style objects)
- Use parameterized queries ($1, $2, etc.) to prevent SQL injection
- Snake_case for database columns (e.g., `has_profile_image`, `created_at`)

## Project Structure
- `config/` - Database configuration
- `scripts/` - Database initialization scripts
- `models/` - Data access functions (not ORM models)
- `controllers/` - Route handlers
- `routes/` - Express route definitions
- `middlewares/` - Custom middleware functions
- `views/` - EJS templates

When working in this Express.js application, follow the existing patterns in controllers, models, and routes folders. Handle all form validation with express-validator and use the error handling middleware for consistent error responses.
