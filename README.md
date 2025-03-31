# Movie Success Predictor

A Flask-based web application that predicts the success of a movie (Not Successful, Average, Success) using a trained XGBoost model. Features include user signup/login with PostgreSQL storage and a password reset system.

## Features
- **Movie Prediction:** Predicts movie success based on year, duration, genre, director, and actor.
- **User Authentication:** Signup and login with credentials stored in PostgreSQL, password hashing with Bcrypt.
- **Password Reset:** Basic forgot-password system with a demo reset link.
- **Responsive UI:** Modern login/signup interface with real-time validation.

## Prerequisites
- Python 3.8+
- PostgreSQL 13+
- Git
- A trained XGBoost model (`best_movie_success_model.pkl`)—optional, see "Training the Model" below.

## Setup Instructions

### 1. Clone the Repository
```bash
git clone https://github.com/tonyvarghese7/movie-success-predictor.git
cd movie-success-predictor

2. Set Up a Virtual Environment
    python -m venv venv
    On Windows: venv\Scripts\activate

3. Install Dependencies
    pip install -r requirements.txt
4. Configure PostgreSQL
    Install PostgreSQL and create a database named movie_app_db.
    Run the following SQL to create the users table:
          CREATE TABLE users (
          id SERIAL PRIMARY KEY,
          name VARCHAR(100) NOT NULL,
          email VARCHAR(100) UNIQUE NOT NULL,
          password VARCHAR(255) NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
          );
7. Run the Application
    python app.py
    Open http://localhost:5000 in your browser.
