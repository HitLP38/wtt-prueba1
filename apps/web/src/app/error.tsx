'use client';

import { useEffect } from 'react';
import { Container, Typography, Button, Box } from '@mui/material';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          my: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
        }}
      >
        <Typography variant="h4" component="h1" gutterBottom>
          Algo salió mal
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          {error.message || 'Ocurrió un error inesperado'}
        </Typography>
        <Button variant="contained" onClick={reset} sx={{ mt: 2 }}>
          Intentar de nuevo
        </Button>
      </Box>
    </Container>
  );
}





