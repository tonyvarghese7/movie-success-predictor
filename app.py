from flask import Flask, request, jsonify, send_from_directory, session
import pandas as pd
import numpy as np
import joblib
import psycopg2
from flask_bcrypt import Bcrypt
from datetime import datetime

app = Flask(__name__)
bcrypt = Bcrypt(app)
app.secret_key = 'a3f1c5e7b8d9a0f2c4e6b1d8a7f3e9c2d5b4a6f0'  # Required for session management, replace with a secure key

# Database configuration
DB_CONFIG = {
    'dbname': 'movie_app_db',
    'user': 'postgres',
    'password': '0000',  # Replace with your password
    'host': 'localhost',
    'port': '5432'
}

# Function to connect to the database
def get_db_connection():
    try:
        conn = psycopg2.connect(**DB_CONFIG)
        return conn
    except Exception as e:
        print(f"Database connection error: {e}")
        return None

# Load the saved model
model_filename = 'best_movie_success_model.pkl'
try:
    loaded_model = joblib.load(model_filename)
    print("Model loaded successfully")
except FileNotFoundError:
    print(f"Error: '{model_filename}' not found.")
    exit()

# Function to get predictions with probabilities
def get_prediction_with_probability(model, X):
    classes = ['Not Successful', 'Average', 'Success']
    proba = model.predict_proba(X)
    predictions = []
    for i in range(len(proba)):
        max_index = np.argmax(proba[i])
        predicted_class = classes[max_index]
        predicted_probability = float(proba[i][max_index] * 100)
        predictions.append((predicted_class, predicted_probability))
    return predictions

# Serve the home page
@app.route('/')
def serve_home():
    return send_from_directory('.', 'home.html')

# Serve static files (CSS, JS)
@app.route('/<path:path>')
def serve_static(path):
    return send_from_directory('.', path)

# API endpoint for predictions
@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.get_json()
        year = int(data.get('year', 0))
        duration = int(data.get('duration', 0))
        genre = data.get('genre', '')
        director = data.get('director', '')
        actor = data.get('actor', '')

        new_data = pd.DataFrame({
            'Year': [year],
            'Duration': [duration],
            'Genre': [genre],
            'Director': [director],
            'Actor': [actor]
        })

        predictions = get_prediction_with_probability(loaded_model, new_data)
        pred_class, pred_prob = predictions[0]
        formatted_prob = "{:.2f}".format(pred_prob)

        return jsonify({
            'status': 'success',
            'prediction': pred_class,
            'probability': formatted_prob,
            'title': data.get('title', 'this movie')
        })
    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)}), 500

# API endpoint for signup
@app.route('/signup', methods=['POST'])
def signup():
    try:
        data = request.get_json()
        name = data.get('name')
        email = data.get('email')
        password = data.get('password')

        if not all([name, email, password]):
            return jsonify({'status': 'error', 'message': 'All fields are required'}), 400

        hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')

        conn = get_db_connection()
        if conn is None:
            return jsonify({'status': 'error', 'message': 'Database connection failed'}), 500

        cur = conn.cursor()
        cur.execute(
            "INSERT INTO users (name, email, password) VALUES (%s, %s, %s) ON CONFLICT (email) DO NOTHING RETURNING id;",
            (name, email, hashed_password)
        )
        user_id = cur.fetchone()

        if user_id is None:
            conn.close()
            return jsonify({'status': 'error', 'message': 'Email already exists'}), 409

        conn.commit()
        conn.close()

        return jsonify({'status': 'success', 'message': 'User registered successfully'}), 201

    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)}), 500

# API endpoint for login
@app.route('/login', methods=['POST'])
def login():
    try:
        data = request.get_json()
        email = data.get('email')
        password = data.get('password')

        if not all([email, password]):
            return jsonify({'status': 'error', 'message': 'Email and password are required'}), 400

        conn = get_db_connection()
        if conn is None:
            return jsonify({'status': 'error', 'message': 'Database connection failed'}), 500

        cur = conn.cursor()
        cur.execute("SELECT id, password FROM users WHERE email = %s;", (email,))
        user = cur.fetchone()

        conn.close()

        if user is None:
            return jsonify({'status': 'error', 'message': 'Invalid email or password'}), 401

        user_id, hashed_password = user
        if bcrypt.check_password_hash(hashed_password, password):
            session['user_id'] = user_id  # Store user ID in session
            return jsonify({'status': 'success', 'message': 'Login successful'}), 200
        else:
            return jsonify({'status': 'error', 'message': 'Invalid email or password'}), 401

    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)