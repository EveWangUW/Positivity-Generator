import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Button, Container, Typography, Tab, Tabs, Box } from '@mui/material';
import FavoritesPage from './FavoritesPage';
import "./App.css";

interface Quote {
  quote: string;
  category: string;
}

const App: React.FC = () => {
  const [quote, setQuote] = useState<Quote | null>(null);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [showSuccessMessage, setShowSuccessMessage] = useState<boolean>(false); // State variable to track success message

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
    setShowSuccessMessage(true); // Display success message
    setTimeout(() => setShowSuccessMessage(false), 1000); // Hide message after 1 seconds
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
      <Container>
        <Typography variant="h4" style={{ fontSize: '5.2rem', fontWeight: 'bold', textAlign: 'center', marginTop: '50px' }} gutterBottom>
          Quote Generator 🩵
        </Typography>
        <div>
          <Tabs sx={{ '& .MuiTabs-flexContainer': { justifyContent: 'space-between' } }}>
            <Tab
              label="Generate Quotes"
              style={{ fontSize: '2.2rem', whiteSpace: 'nowrap' }}
              component={Link}
              to="/"
            />
            <Tab
              label="Favorite Quotes"
              style={{ fontSize: '2.2rem', whiteSpace: 'nowrap' }}
              component={Link}
              to="/favorites"
            />
          </Tabs>
        </div>

        <Routes>
          <Route path="/" element={
            <div>
             <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <Button variant="contained" style={{ fontSize: '2rem' }} color="primary" onClick={() => generateQuote('think_positive')}>
                Think Positive 💪
              </Button>
              <Button variant="contained" style={{ fontSize: '2rem' }} color="primary" onClick={() => generateQuote('control_stress')}>
                Control Stress 🌊
              </Button>
              <Button variant="contained" style={{ fontSize: '2rem' }} color="primary" onClick={() => generateQuote('be_confident')}>
                Be Confident 👩🏻‍💻
              </Button>
              <Button variant="contained" style={{ fontSize: '2rem' }} color="primary" onClick={() => generateQuote('😎')}>
                😎
              </Button>
            </div>
              {quote && (
                <div style={{ marginTop: '20px' }}>
                  <Typography variant="body1" style={{ fontSize: '5.2rem' }}>{quote.quote}</Typography>
                  <Button variant="outlined" style={{ fontSize: '3.2rem' }} color="primary" onClick={addToFavorites}>
                    Add to Favorites
                  </Button>
                  {showSuccessMessage && <Typography style={{ fontSize: '3rem', color: 'green', marginTop: '10px' }}>Successfully added! ;)</Typography>}
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
