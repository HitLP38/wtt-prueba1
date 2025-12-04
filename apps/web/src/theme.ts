'use client';

import { createTheme } from '@mui/material/styles';

// Paleta de colores inspirada en Doyi Sports (5 colores base)
// 1. Azul oscuro profundo - Para texto y elementos oscuros
// 2. Púrpura vibrante - Color primario
// 3. Azul profundo - Color secundario
// 4. Teal/Cyan claro - Acentos
// 5. Púrpura claro - Variantes y fondos

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#7C3AED', // Púrpura vibrante del logo (color principal)
      light: '#A78BFA', // Púrpura claro con opacidad
      dark: '#5B21B6', // Púrpura oscuro
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#2563EB', // Azul profundo del logo
      light: '#60A5FA', // Azul claro
      dark: '#1E40AF', // Azul oscuro
      contrastText: '#FFFFFF',
    },
    info: {
      main: '#06B6D4', // Teal/Cyan claro del logo (para acentos)
      light: '#67E8F9',
      dark: '#0891B2',
      contrastText: '#FFFFFF',
    },
    background: {
      default: '#FFFFFF',
      paper: '#FFFFFF',
    },
    error: {
      main: '#EF4444',
      light: '#F87171',
      dark: '#DC2626',
    },
    text: {
      primary: '#1E293B', // Azul oscuro profundo (texto principal)
      secondary: '#475569', // Azul oscuro con menor opacidad
    },
  },
  typography: {
    fontFamily: [
      'Roboto',
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
    ].join(','),
    h1: {
      fontWeight: 400,
      fontSize: '3.5625rem',
      lineHeight: 1.2,
      letterSpacing: '-0.01562em',
    },
    h2: {
      fontWeight: 400,
      fontSize: '2.8125rem',
      lineHeight: 1.2,
    },
    h3: {
      fontWeight: 400,
      fontSize: '2.125rem',
      lineHeight: 1.2,
    },
    h4: {
      fontWeight: 400,
      fontSize: '1.75rem',
      lineHeight: 1.3,
    },
    h5: {
      fontWeight: 400,
      fontSize: '1.5rem',
      lineHeight: 1.3,
    },
    h6: {
      fontWeight: 500,
      fontSize: '1.25rem',
      lineHeight: 1.4,
    },
    button: {
      textTransform: 'none', // M3 no usa mayúsculas por defecto
      fontWeight: 500,
      letterSpacing: '0.02857em',
    },
  },
  shape: {
    borderRadius: 12, // Bordes más redondeados estilo M3
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 20,
          padding: '10px 24px',
          fontWeight: 600,
          textTransform: 'none',
        },
        contained: {
          background: 'linear-gradient(135deg, #7C3AED 0%, #2563EB 100%)',
          boxShadow: '0px 4px 14px rgba(124, 58, 237, 0.3)',
          '&:hover': {
            background: 'linear-gradient(135deg, #5B21B6 0%, #1E40AF 100%)',
            boxShadow: '0px 6px 20px rgba(124, 58, 237, 0.4)',
          },
        },
        outlined: {
          borderColor: '#7C3AED',
          color: '#7C3AED',
          '&:hover': {
            borderColor: '#5B21B6',
            backgroundColor: 'rgba(124, 58, 237, 0.08)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0px 2px 8px rgba(30, 41, 59, 0.08)',
          border: '1px solid rgba(124, 58, 237, 0.1)',
          '&:hover': {
            boxShadow: '0px 4px 16px rgba(124, 58, 237, 0.15)',
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: '0px 2px 8px rgba(30, 41, 59, 0.08)',
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)',
        },
      },
    },
    MuiLink: {
      styleOverrides: {
        root: {
          transition: 'all 0.2s ease',
          '&:hover': {
            color: '#7C3AED',
          },
        },
      },
    },
    MuiDivider: {
      styleOverrides: {
        root: {
          borderColor: 'rgba(124, 58, 237, 0.12)',
        },
      },
    },
  },
});

export default theme;


