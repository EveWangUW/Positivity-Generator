import React from 'react';
import { Button, Container, Typography} from '@mui/material';

interface FavoritesPageProps {
  removeFromFavorites: (quote: string) => void;
  favorites: string[];
}

const FavoritesPage: React.FC<FavoritesPageProps> = ({ removeFromFavorites, favorites }) => {
  return (
      <Container>
    {favorites.length > 0 ? (
      <ul>
        {favorites.map((fav, index) => (
          <li key={index}>
            <Typography variant="body1" style={{ fontSize: '2.5rem' }}>{fav}</Typography>
            <Button variant="outlined" color="secondary" style={{ fontSize: '2rem' }} onClick={() => removeFromFavorites(fav)}>
              Delete
            </Button>
          </li>
        ))}
      </ul>
    ) : (
      <Typography variant="body1" style={{ fontSize: '2.5rem' }}>No favorite quotes yet.</Typography>
    )}
    </Container>
  );
};

export default FavoritesPage;