from flask import Flask, jsonify, request
from flask_cors import CORS
import random

app = Flask(__name__)
CORS(app)

# Dummy data for quotes
quotes = {
    "think_positive": ["Quote 1", "Quote 2", "Quote 3"],
    "control_stress": ["Quote 4", "Quote 5", "Quote 6"],
    "be_confident": ["Quote 7", "Quote 8", "Quote 9"]
}

# Initialize an empty list to store favorite quotes
favorites = []

class QuoteGenerator:
    def generate_quote(category):
        if category in quotes:
            quote = random.choice(quotes[category])
            return {"quote": quote, "category": category}
        else:
            return {"error": "Invalid category"}, 400

class FavoritesManager:
    def add_to_favorites(quote):
        favorites.append(quote)
        return {"message": "Quote added to favorites"}, 201

    def remove_from_favorites(quote):
        if quote in favorites:
            favorites.remove(quote)
            return {"message": "Quote deleted from favorites"}, 200
        else:
            return {"error": "Quote not found in favorites"}, 404

@app.route('/quote', methods=['POST'])
def generate_quote():
    category = request.json.get('category')
    return jsonify(QuoteGenerator.generate_quote(category))

@app.route('/favorites', methods=['GET', 'POST', 'DELETE'])
def manage_favorites():
    if request.method == 'GET':
        return jsonify({"favorites": favorites})
    elif request.method == 'POST':
        data = request.json
        if 'quote' in data:
            quote = data['quote']
            return jsonify(FavoritesManager.add_to_favorites(quote))
        else:
            return jsonify({"error": "Missing 'quote' in request"}), 400
    elif request.method == 'DELETE':
        data = request.json
        if 'quote' in data:
            quote = data['quote']
            return jsonify(FavoritesManager.remove_from_favorites(quote))
        else:
            return jsonify({"error": "Missing 'quote' in request"}), 400

if __name__ == '__main__':
    app.run(debug=True)
