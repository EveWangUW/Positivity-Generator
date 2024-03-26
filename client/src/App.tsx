import React, { useState, useEffect } from 'react';
import { Button, Container, Typography } from '@mui/material';

interface Quote {
  quote: string;
  category: string;
}

const App: React.FC = () => {
  const [quote, setQuote] = useState<Quote | null>(null);
  const [favorites, setFavorites] = useState<string[]>([]);

  useEffect(() => {
    fetchFavorites();
  }, []);

  const fetchFavorites = async () => {
    try {
      const response = await fetch('http://127.0.0.1:5000/favorites');
      const data = await response.json();
      setFavorites(data.favorites);
    } catch (error) {
      console.error('Error fetching favorites:', error);
    }
  };

  const generateQuote = async (category: string) => {
    try {
      const response = await fetch('http://127.0.0.1:5000/quote', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ category })
      });
      const data: Quote | null = await response.json();
      setQuote(data);
    } catch (error) {
      console.error('Error generating quote:', error);
    }
  };

  const addToFavorites = async () => {
    try {
      if (!quote) return;
      await fetch('http://127.0.0.1:5000/favorites', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ quote: quote.quote })
      });
      await fetchFavorites();
    } catch (error) {
      console.error('Error adding to favorites:', error);
    }
  };

  const removeFromFavorites = async (favorite: string) => {
    try {
      await fetch('http://127.0.0.1:5000/favorites', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ quote: favorite })
      });
      await fetchFavorites();
    } catch (error) {
      console.error('Error removing from favorites:', error);
    }
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" gutterBottom>
        Quote Generator
      </Typography>
      <div>
        <Button variant="contained" color="primary" onClick={() => generateQuote('think_positive')}>
          Think Positive
        </Button>
        <Button variant="contained" color="primary" onClick={() => generateQuote('control_stress')}>
          Control Stress and Anxiety
        </Button>
        <Button variant="contained" color="primary" onClick={() => generateQuote('be_confident')}>
          Be Confident
        </Button>
      </div>
      {quote && (
        <div style={{ marginTop: '20px' }}>
          <Typography variant="h6">Category: {quote.category}</Typography>
          <Typography variant="body1">{quote.quote}</Typography>
          <Button variant="outlined" color="primary" onClick={addToFavorites}>
            Add to Favorites
          </Button>
        </div>
      )}
      {favorites.length > 0 && (
        <div style={{ marginTop: '20px' }}>
          <Typography variant="h6">Favorites:</Typography>
          <ul>
            {favorites.map((fav, index) => (
              <li key={index}>
                {fav}
                <Button variant="outlined" color="secondary" onClick={() => removeFromFavorites(fav)}>
                  Delete
                </Button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </Container>
  );
};

export default App;