'use client';

import React from 'react';
import { Typography, Paper, Box } from '@mui/material';

export default function SistemaPage() {
  return (
    <Box>
      <Typography variant="h4" gutterBottom sx={{ mb: 4, fontWeight: 600 }}>
        Configuración del Sistema
      </Typography>

      <Paper elevation={2} sx={{ p: 4, borderRadius: 2 }}>
        <Typography variant="h6" gutterBottom>
          Configuración General
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Aquí podrás configurar las opciones generales del sistema.
        </Typography>

        <Box sx={{ mt: 3 }}>
          <Typography variant="subtitle2" color="text.secondary">
            Funcionalidades próximas:
          </Typography>
          <ul>
            <li>Configuración de organización</li>
            <li>Gestión de usuarios y roles</li>
            <li>Configuración de categorías y modalidades</li>
            <li>Sistema de plantillas</li>
            <li>Configuración de pagos</li>
          </ul>
        </Box>
      </Paper>
    </Box>
  );
}

