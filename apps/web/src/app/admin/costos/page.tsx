'use client';

import React from 'react';
import { Container, Typography, Paper } from '@mui/material';

export default function CostosPage() {
  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 4, fontWeight: 600 }}>
        Costos
      </Typography>
      <Paper elevation={2} sx={{ p: 4, borderRadius: 2 }}>
        <Typography variant="body1">Página de gestión de costos (próximamente)</Typography>
      </Paper>
    </Container>
  );
}

