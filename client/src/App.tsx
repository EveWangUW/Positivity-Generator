import React, { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

interface Quote {
  quote: string;
  category: string;
}

const App: React.FC = () => {
  const [quote, setQuote] = useState<Quote | null>(null);
  const [favorites, setFavorites] = useState<string[]>([]);

  useEffect(() => {
    // Fetch favorites when component mounts
    fetchFavorites();
  }, []);

  const fetchFavorites = async () => {
    const response = await fetch('http://127.0.0.1:5000/favorites');
    const data = await response.json();
    setFavorites(data.favorites);
  };

  const generateQuote = async (category: string) => {
    const response = await fetch('http://127.0.0.1:5000/quote', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ category })
    });

    const data: Quote | null = await response.json();
    setQuote(data);
    if (!data) {
      console.error('Failed to fetch quote:', response.statusText);
    }
  };

  const addToFavorites = async () => {
    if (!quote) return;

    const response = await fetch('http://127.0.0.1:5000/favorites', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ quote: quote.quote })
    });

    await fetchFavorites();
    if (!response.ok) {
      console.error('Failed to add to favorites:', response.statusText);
    }
  };

  const removeFromFavorites = async (favorite: string) => {
    const response = await fetch('http://127.0.0.1:5000/favorites', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ quote: favorite })
    });

    await fetchFavorites();
    if (!response.ok) {
      console.error('Failed to remove from favorites:', response.statusText);
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