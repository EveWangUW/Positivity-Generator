import React from 'react';
import { Button, Container, Typography } from '@mui/material';

interface FavoritesPageProps {
  removeFromFavorites: (quote: string) => void;
  favorites: string[];
}

const FavoritesPage: React.FC<FavoritesPageProps> = ({ removeFromFavorites, favorites }) => {
  return (
    <Container maxWidth="sm">
      <Typography variant="h4" gutterBottom>
        Favorite Quotes
      </Typography>
      {favorites.length > 0 ? (
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
      ) : (
        <Typography variant="body1">No favorite quotes yet.</Typography>
      )}
    </Container>
  );
};

export default FavoritesPage;
