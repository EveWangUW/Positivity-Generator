import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Button, Container, Typography, Tab, Tabs,Box} from '@mui/material';
import FavoritesPage from './FavoritesPage';
import "./App.css";

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
  };

  const addToFavorites = async () => {
      if (!quote) return;
      await fetch('http://127.0.0.1:5000/favorites', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ quote: quote.quote })
      });
      await fetchFavorites();
  };

  const removeFromFavorites = async (favorite: string) => {
      await fetch('http://127.0.0.1:5000/favorites', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ quote: favorite })
      });
      await fetchFavorites();
  };

  return (
    <Router>
      <Container maxWidth="sm">
        <Typography variant="h4" style={{ fontSize: '4.2rem' }} gutterBottom>
          Quote Generator
        </Typography>
        <div>
        <Tabs>
            <Tab label="Generate Quotes" style={{ fontSize: '1.2rem' }} component={Link} to="/" sx={{ minWidth: '120px', minHeight: '40px' }}/>
            <Tab label="Favorite Quotes" style={{ fontSize: '1.2rem' }} component={Link} to="/favorites"sx={{ minWidth: '120px', minHeight: '40px' }}/>
        </Tabs>
        </div>
        
        {/* <div>
          <Link to="/">
            <Button variant="contained" color="primary">
              Generate Quotes
            </Button>
          </Link>
          <Link to="/favorites">
            <Button variant="contained" color="primary">
              Favorite Quotes
            </Button>
          </Link>
        </div> */}

        <Routes>
          <Route path="/" element={
            <div>
              <Button variant="contained" style={{ fontSize: '2.2rem' }} color="primary" onClick={() => generateQuote('think_positive')}>
                Think Positive
              </Button>
              <Button variant="contained" style={{ fontSize: '1.8rem' }} color="primary" onClick={() => generateQuote('control_stress')}>
                Control Stress and Anxiety
              </Button>
              <Button variant="contained" style={{ fontSize: '2.2rem' }} color="primary" onClick={() => generateQuote('be_confident')}>
                Be Confident
              </Button>
              {quote && (
                <div style={{ marginTop: '20px' }}>
                  <Typography variant="h4" style={{ fontSize: '2.2rem' }}>Category: {quote.category}</Typography>
                  <Typography variant="body1" style={{ fontSize: '2.2rem' }}>{quote.quote}</Typography>
                  <Button variant="outlined" style={{ fontSize: '2.2rem' }} color="primary" onClick={addToFavorites}>
                    Add to Favorites
                  </Button>
                </div>
              )}
            </div>
          } />
          <Route path="/favorites" element={<FavoritesPage favorites={favorites} removeFromFavorites={removeFromFavorites} />} />
        </Routes>
      </Container>
    </Router>
  );
};

export default App;