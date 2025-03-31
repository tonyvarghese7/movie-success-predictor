import pandas as pd
import numpy as np
import joblib

# Load the saved model
model_filename = 'best_movie_success_model.pkl'  # Adjust to match your saved model filename
try:
    loaded_model = joblib.load(model_filename)
    print("Model loaded successfully")
except FileNotFoundError:
    print(f"Error: '{model_filename}' not found. Please ensure the model is saved in the current directory.")
    exit()

# Function to get predictions with probabilities
def get_prediction_with_probability(model, X):
    classes = ['Not Successful', 'Average', 'Success']
    proba = model.predict_proba(X)
    predictions = []
    for i in range(len(proba)):
        max_index = np.argmax(proba[i])
        predicted_class = classes[max_index]
        predicted_probability = proba[i][max_index] * 100
        predictions.append((predicted_class, predicted_probability))
    return predictions

# Collect user input for a single movie
print("\nEnter movie details for prediction:")
year = int(input("Year (e.g., 2023): "))
duration = int(input("Duration (in minutes, e.g., 120): "))
genre = input("Genre (e.g., Action): ")
director = input("Director (e.g., Christopher Nolan): ")
actor = input("Actor (e.g., Leonardo DiCaprio): ")

# Create a DataFrame with the user input
new_data = pd.DataFrame({
    'Year': [year],
    'Duration': [duration],
    'Genre': [genre],
    'Director': [director],
    'Actor': [actor]
})

# Make predictions on the user input
try:
    predictions = get_prediction_with_probability(loaded_model, new_data)
except Exception as e:
    print(f"Error during prediction: {e}")
    exit()

# Display the prediction
print("\nPrediction for Your Movie:")
pred_class, pred_prob = predictions[0]  # Only one movie, so take the first result
print(f"Predicted {pred_class} with {pred_prob:.2f}% probability")