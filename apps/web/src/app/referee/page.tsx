'use client';

import { Container, Typography, Box, Paper, Grid, Button } from '@mui/material';
import { SportsTennis, Timer, Assignment, Settings } from '@mui/icons-material';

export default function RefereePage() {
  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Typography variant="h3" component="h1" gutterBottom>
        Panel de Árbitro
      </Typography>
      
      <Grid container spacing={3} sx={{ mt: 2 }}>
        <Grid item xs={12} md={6} lg={3}>
          <Paper sx={{ p: 3, textAlign: 'center' }}>
            <SportsTennis sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
            <Typography variant="h6" gutterBottom>
              Seleccionar Partido
            </Typography>
            <Button variant="contained" fullWidth sx={{ mt: 2 }}>
              Ver Partidos
            </Button>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6} lg={3}>
          <Paper sx={{ p: 3, textAlign: 'center' }}>
            <Timer sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
            <Typography variant="h6" gutterBottom>
              Control de Tiempo
            </Typography>
            <Button variant="contained" fullWidth sx={{ mt: 2 }}>
              Cronómetro
            </Button>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6} lg={3}>
          <Paper sx={{ p: 3, textAlign: 'center' }}>
            <Assignment sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
            <Typography variant="h6" gutterBottom>
              Marcador
            </Typography>
            <Button variant="contained" fullWidth sx={{ mt: 2 }}>
              Abrir Marcador
            </Button>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6} lg={3}>
          <Paper sx={{ p: 3, textAlign: 'center' }}>
            <Settings sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
            <Typography variant="h6" gutterBottom>
              Configuración
            </Typography>
            <Button variant="contained" fullWidth sx={{ mt: 2 }}>
              Ajustes
            </Button>
          </Paper>
        </Grid>
      </Grid>

      <Box sx={{ mt: 4 }}>
        <Paper sx={{ p: 3 }}>
          <Typography variant="h5" gutterBottom>
            Partidos Asignados
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Aquí se mostrarán los partidos asignados al árbitro
          </Typography>
        </Paper>
      </Box>
    </Container>
  );
}


