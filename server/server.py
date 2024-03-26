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

@app.route('/quote', methods=['POST'])
def generate_quote():
    category = request.json.get('category')
    if category in quotes:
        quote = random.choice(quotes[category])
        return jsonify({"quote": quote, "category": category})
    else:
        return jsonify({"error": "Invalid category"}), 400

@app.route('/favorites', methods=['GET', 'POST', 'DELETE'])
def manage_favorites():
    global favorites
    if request.method == 'GET':
        return jsonify({"favorites": favorites})
    elif request.method == 'POST':
        data = request.json
        if 'quote' in data:
            quote = data['quote']
            favorites.append(quote)
            return jsonify({"message": "Quote added to favorites"}), 201
        else:
            return jsonify({"error": "Missing 'quote' in request"}), 400
    elif request.method == 'DELETE':
        data = request.json
        if 'quote' in data:
            quote = data['quote']
            if quote in favorites:
                favorites.remove(quote)
                return jsonify({"message": "Quote deleted from favorites"}), 200
            else:
                return jsonify({"error": "Quote not found in favorites"}), 404
        else:
            return jsonify({"error": "Missing 'quote' in request"}), 400

if __name__ == '__main__':
    app.run(debug=True)
