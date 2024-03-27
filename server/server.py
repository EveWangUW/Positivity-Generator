from flask import Flask, jsonify, request
from flask_cors import CORS
import random

app = Flask(__name__)
CORS(app)

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
    ],
    "😎":[
        "Brauni is cute :3",
        "ME is great ;D",
        "Lol this is fun"
    ]
}

# Initialize an empty list to store favorite quotes
favorites = []

class QuoteGenerator:
    @staticmethod
    def generate_quote(category):
        if category in quotes:
            quote = random.choice(quotes[category])
            return {"quote": quote, "category": category}
        else:
            return {"error": "Invalid category"}, 400

class FavoritesManager:
    @staticmethod
    def add_to_favorites(quote):
        favorites.append(quote)
        return {"message": "Quote added to favorites"}, 201

    @staticmethod
    def remove_from_favorites(quote):
        if quote in favorites:
            favorites.remove(quote)
            return {"message": "Quote deleted from favorites"}, 200
        else:
            return {"error": "Quote not found in favorites"}, 404

@app.route('/quote', methods=['POST'])
def generate_quote_endpoint():
    category = request.json.get('category')
    return jsonify(QuoteGenerator.generate_quote(category))

@app.route('/favorites', methods=['GET', 'POST', 'DELETE'])
def manage_favorites_endpoint():
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
