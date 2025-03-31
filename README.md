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
