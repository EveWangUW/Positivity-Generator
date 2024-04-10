from flask import Flask, jsonify, request  # Import Flask and other necessary modules
from flask_cors import CORS  # Import CORS module to enable Cross-Origin Resource Sharing
import random  # Import random module for generating random quotes

app = Flask(__name__)  # Create a Flask application
CORS(app)  # Enable CORS for the Flask application

# Dummy data for quotes
quotes = {
    "think_positive": [
        "Think positive, be positive, and positive things will happen.",
        "Your attitude determines your direction.",
        "Believe you can and you're halfway there."
    ],
    "control_stress": [
        "Inhale confidence, exhale doubt.",
        "Stress is caused by giving a fu*k. Eliminate the unnecessary.",
        "Don't stress over what you can't control."
    ],
    "be_confident": [
        "Confidence is not 'they will like me.' Confidence is 'I'll be fine if they don't.'",
        "You gain strength, courage, and confidence by every experience in which you really stop to look fear in the face.",
        "Confidence comes from discipline and training."
    ]
   
}

# Initialize an empty list to store favorite quotes
favorites = []

class QuoteGenerator:
    @staticmethod
    def generate_quote(category):  
        # category is the input (that can be tailored)
        # Method to generate a random quote based on category
        if category in quotes: # check if category is a key in quotes (quotes is a dictionary)
            quote = random.choice(quotes[category]) # quotes[category] gives you the list of quotes corresponding to the provided 'category' key
            # a function called choice(): select a random element from a non-empty sequence, such as a list
            return {"quote": quote, "category": category}  # Return a random quote and its category
        else:
            return {"error": "Invalid category"}, 400  # Return an error if category is invalid
        # Python dictionary that can be converted to json

class FavoritesManager:
    @staticmethod
    def add_to_favorites(quote):  # Method to add a quote to favorites
        favorites.append(quote)  # Append the quote to the favorites list
        return {"message": "Quote added to favorites"}, 201  # Return success message

    @staticmethod
    def remove_from_favorites(quote):  # Method to remove a quote from favorites
        if quote in favorites:
            favorites.remove(quote)  # Remove the quote from favorites if it exists
            return {"message": "Quote deleted from favorites"}, 200  # Return success message
        else:
            return {"error": "Quote not found in favorites"}, 404  # Return error if quote not found in favorites

@app.route('/quote', methods=['POST'])  # Define endpoint for generating quotes
def generate_quote_endpoint():
    category = request.json.get('category')  # Get the category from request JSON data
    return jsonify(QuoteGenerator.generate_quote(category))  # Return generated quote as JSON response

@app.route('/favorites', methods=['GET', 'POST', 'DELETE'])  # Define endpoint for managing favorites
def manage_favorites_endpoint():
    if request.method == 'GET':  # If the request method is GET
        return jsonify({"favorites": favorites})  # Return the list of favorites
    elif request.method == 'POST':  # If the request method is POST
        data = request.json
        if 'quote' in data:  # Check if 'quote' key exists in request data
            quote = data['quote']  # Get the quote from request data
            return jsonify(FavoritesManager.add_to_favorites(quote))  # Add quote to favorites and return response
        else:
            return jsonify({"error": "Missing 'quote' in request"}), 400  # Return error if 'quote' is missing
    elif request.method == 'DELETE':  # If the request method is DELETE
        data = request.json
        if 'quote' in data:  # Check if 'quote' key exists in request data
            quote = data['quote']  # Get the quote from request data
            return jsonify(FavoritesManager.remove_from_favorites(quote))  # Remove quote from favorites and return response
        else:
            return jsonify({"error": "Missing 'quote' in request"}), 400  # Return error if 'quote' is missing

if __name__ == '__main__':
    app.run(debug=True)  # Run the Flask application in debug mode
