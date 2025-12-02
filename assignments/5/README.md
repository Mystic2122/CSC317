# CSC317 Fall 2025: Group Web Application Project

## Overview

For this assignment, you will work in groups of 3-4 students to develop a complete web application using HTML, CSS, and JavaScript with Express.js for the backend and PostgreSQL for the database. This project will allow you to apply all the skills you've learned throughout the course in a collaborative setting.

## Starter Template

This repository is a starter template that includes:
- User registration and login
- Session-based authentication
- Profile management with image upload
- PostgreSQL database integration
- Ready for deployment on Render.com

Fork this repository to get started with your project!

## Timeline and Deliverables

You have 4 weeks to complete this project with the following key deliverables:

1. **Week 1: Ideation and Proposal**
   - Deliverable: README.md describing the project, features, and team responsibilities

2. **Week 2: Alpha Version**
   - Deliverable: First functional prototype demonstrating core features

3. **Week 3: Beta Version**
   - Deliverable: Refined application with most features implemented

4. **Week 4: Final Version (V1)**
   - Deliverable: Complete, polished application ready for submission

5. **Demo**
   - Deliverable: 5-minute Zoom recording demonstrating your application
   - Each team member must speak for at least 1 minute

## Project Requirements

Your web application must include:

1. **Frontend**
   - Responsive HTML/CSS layout
   - Client-side form validation
   - Interactive UI elements using JavaScript
   - Consistent design system and typography

2. **Backend (Express.js)**
   - RESTful API endpoints
   - PostgreSQL database for data persistence
   - Error handling
   - User authentication (provided in template)

3. **Full-Stack Features**
   - CRUD operations
   - Input validation (both client and server side)
   - At least one complex feature unique to your project

4. **Deployment**
   - Application deployed on Render.com
   - PostgreSQL database hosted on Render.com

## Project Ideas

Choose one of the following project ideas or propose your own (with instructor approval):

1. **Recipe Sharing Platform**

Entities: User, Recipe
Minimal Features:
Create recipe (title, description, instructions, ingredients)
View all recipes
View single recipe
(Optional) Tag recipes, like recipes

2. **Task Management System**

Entities: User, Task, (optional: Project/List)
Minimal Features:
Create task (title, status)
View/edit/delete tasks
(Optional) Assign to user, add due date

3. **Twitter Clone**

Entities: User, Tweet/Post
Minimal Features:
Create post (text, timestamp)
View feed
(Optional) Like/retweet, reply

4. **Local Event Finder**

Entities: User, Event
Minimal Features:
Create event (title, datetime, location)
View all events
(Optional) RSVP feature

5. **Fitness Tracker**

Entities: User, Exercise/Entry
Minimal Features:
Log workout (type, duration, date)
View log history

6. **Book/Movie Review Site**

Entities: User, Book/Movie, Review
Minimal Features:
Add book/movie
Add review (rating, comment)
View reviews

7. **Budget Planner**

Entities: User, Expense/Income
Minimal Features:
Add expense/income (amount, date, category)
View summary/list

8. **Digital Notebook/Wiki**

Entities: User, Note/Page
Minimal Features:
Create/edit note (title, content)
View notes

9. **Interactive Visualization Tool**

Entities: User, Dataset/Chart
Minimal Features:
Upload data or input directly
Render a basic chart (bar/line)

Feel free to adapt these ideas or propose something entirely different that interests your team!

## Directory Structure

Your project must follow this directory structure:

```
├── /
    ├── app.js
    ├── package.json
    ├── public/
    │   ├── css/
    │   ├── js/
    │   └── images/
    ├── routes/
    │   └── api/
    ├── views/
    ├── middlewares/
    ├── models/
    ├── config/
    ├── scripts/
    └── README.md
```

## Getting Started

1. **Fork this repository** on GitHub (click the "Fork" button in the top right)
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/YOUR-USERNAME/CSC317Project-F25.git
   cd CSC317Project-F25
   ```
3. Follow the instructions in [SETUP.md](SETUP.md) to set up your development environment
4. Start building your project features!

## Grading Criteria

Your project will be evaluated on:

1. **Functionality (40%)**
   - All features work as described
   - No major bugs or errors
   - Proper error handling

2. **Code Quality (25%)**
   - Well-structured and organized code
   - Proper comments and documentation
   - Follows best practices

3. **Design and User Experience (20%)**
   - Visual appeal and consistency
   - Intuitive navigation and interface
   - Responsive design

4. **Presentation and Documentation (15%)**
   - Clear and engaging demo
   - Comprehensive README
   - Equal contribution from all team members

## Important Notes

- **Individual Contribution**: All team members must contribute code. Zero code contribution will result in no credit for that student.
- **Version Control**: Use Git for collaboration and maintain a clear commit history.
- **Progress Updates**: Weekly check-ins will be required to ensure steady progress.
- **Technology Stack**: You may use additional libraries with instructor approval, but the core must be HTML, CSS, JavaScript, Express.js, and PostgreSQL.

## Submission Guidelines

1. Push your code to GitHub under the specified directory structure
2. Deploy your application to Render.com
3. Submit your repository link and deployed URL through the class portal
4. Upload your demo video to the designated platform
5. Include a contribution.md file detailing each member's contributions

## Due Date

**December 10th, 2025 11:59pm**

Good luck with your projects! This is your opportunity to showcase all you've learned throughout the course while gaining valuable collaborative development experience.
