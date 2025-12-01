import { Container, Typography, Box, Button } from '@mui/material';
import Link from 'next/link';

export default function Home() {
  return (
    <Container maxWidth="lg">
      <Box
        sx={{
          my: 4,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '80vh',
        }}
      >
        <Typography variant="h2" component="h1" gutterBottom>
          🏓 WTT Platform
        </Typography>
        <Typography variant="h5" component="h2" gutterBottom>
          Plataforma Integral de Gestión de Torneos
        </Typography>
        <Box sx={{ mt: 4, display: 'flex', gap: 2 }}>
          <Button variant="contained" component={Link} href="/events">
            Ver Eventos
          </Button>
          <Button variant="outlined" component={Link} href="/referee">
            Panel Árbitro
          </Button>
        </Box>
      </Box>
    </Container>
  );
}


