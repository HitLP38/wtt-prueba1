'use client';

import React from 'react';
import { Typography, Box, Paper, Grid } from '@mui/material';
import {
  Square as MesasIcon,
  EmojiEvents as TorneosIcon,
  People as ParticipantesIcon,
  Gavel as ArbitrosIcon,
} from '@mui/icons-material';
import { alpha } from '@mui/material/styles';

export default function DashboardPage() {
  const stats = [
    {
      title: 'Mesas Activas',
      value: '0',
      icon: MesasIcon,
      color: '#6C5CE7',
      bgGradient: 'linear-gradient(135deg, #6C5CE7 0%, #A29BFE 100%)',
    },
    {
      title: 'Torneos',
      value: '0',
      icon: TorneosIcon,
      color: '#3742FA',
      bgGradient: 'linear-gradient(135deg, #3742FA 0%, #5F6FFF 100%)',
    },
    {
      title: 'Participantes',
      value: '0',
      icon: ParticipantesIcon,
      color: '#2ECC71',
      bgGradient: 'linear-gradient(135deg, #2ECC71 0%, #55EFC4 100%)',
    },
    {
      title: 'Árbitros',
      value: '0',
      icon: ArbitrosIcon,
      color: '#F39C12',
      bgGradient: 'linear-gradient(135deg, #F39C12 0%, #FDCB6E 100%)',
    },
  ];

  return (
    <Box>
      <Typography
        variant="h4"
        gutterBottom
        sx={{
          mb: 4,
          fontWeight: 700,
          color: '#2D3436',
          letterSpacing: '-0.02em',
        }}
      >
        Dashboard
      </Typography>

      <Grid container spacing={3}>
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Grid item xs={12} sm={6} md={3} key={stat.title}>
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2,
                  borderRadius: '12px', // 12px como en Berry
                  border: '1px solid #E9ECEF',
                  backgroundColor: '#FFFFFF',
                  transition: 'all 0.2s ease-in-out',
                  '&:hover': {
                    boxShadow: '0 4px 20px rgba(108, 92, 231, 0.1)',
                    transform: 'translateY(-2px)',
                  },
                }}
              >
                <Box
                  sx={{
                    width: 56,
                    height: 56,
                    borderRadius: 2,
                    background: stat.bgGradient,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                  }}
                >
                  <Icon sx={{ fontSize: 28 }} />
                </Box>
                <Box>
                  <Typography
                    variant="h4"
                    sx={{
                      fontWeight: 700,
                      mb: 0.5,
                      color: '#2D3436',
                      fontSize: '1.75rem',
                    }}
                  >
                    {stat.value}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: '#6C757D',
                      fontSize: '0.875rem',
                      fontWeight: 500,
                    }}
                  >
                    {stat.title}
                  </Typography>
                </Box>
              </Paper>
            </Grid>
          );
        })}
      </Grid>

      <Box sx={{ mt: 4 }}>
        <Paper
          elevation={0}
          sx={{
            p: 4,
            borderRadius: '12px', // 12px como en Berry
            border: '1px solid #E9ECEF',
            backgroundColor: '#FFFFFF',
          }}
        >
          <Typography
            variant="h6"
            gutterBottom
            sx={{
              fontWeight: 600,
              color: '#2D3436',
              mb: 1,
            }}
          >
            Bienvenido al Panel de Administración
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: '#6C757D',
              lineHeight: 1.6,
            }}
          >
            Desde aquí puedes gestionar todos los aspectos de tus torneos. El contenido está en desarrollo.
          </Typography>
        </Paper>
      </Box>
    </Box>
  );
}
