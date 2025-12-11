'use client';

import React from 'react';
import { Container, Typography, Paper } from '@mui/material';

export default function ArbitrosPage() {
  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 4, fontWeight: 600 }}>
        Árbitros
      </Typography>
      <Paper elevation={2} sx={{ p: 4, borderRadius: 2 }}>
        <Typography variant="body1">Página de gestión de árbitros (próximamente)</Typography>
      </Paper>
    </Container>
  );
}

