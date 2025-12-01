'use client';

import { useEffect } from 'react';
import { Container, Typography, Box, Card, CardContent, CardMedia, Button, Grid } from '@mui/material';
import { useEventStore } from '@/store/useEventStore';
import Link from 'next/link';

export default function EventsPage() {
  const { events, fetchEvents } = useEventStore();

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h3" component="h1" gutterBottom>
        Eventos
      </Typography>
      
      <Grid container spacing={3} sx={{ mt: 2 }}>
        {events.map((event) => (
          <Grid item xs={12} md={6} lg={4} key={event.id}>
            <Card>
              {event.bannerUrl && (
                <CardMedia
                  component="img"
                  height="200"
                  image={event.bannerUrl}
                  alt={event.name}
                />
              )}
              <CardContent>
                <Typography variant="h5" component="h2" gutterBottom>
                  {event.name}
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  {event.description}
                </Typography>
                <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                  <Button
                    variant="contained"
                    component={Link}
                    href={`/events/${event.id}`}
                  >
                    Ver Detalles
                  </Button>
                  <Button variant="outlined" component={Link} href={`/events/${event.id}/inscribe`}>
                    Inscribirme
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {events.length === 0 && (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="h6" color="text.secondary">
            No hay eventos disponibles
          </Typography>
        </Box>
      )}
    </Container>
  );
}


