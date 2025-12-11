'use client';

import React, { useState } from 'react';
import {
  Typography,
  Box,
  Paper,
  Grid,
  IconButton,
  TextField,
  InputAdornment,
  Chip,
  Pagination,
  Button,
  Menu,
  MenuItem,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import MoreVertIcon from '@mui/icons-material/MoreVert';

interface MesaCard {
  id: string;
  numero: number;
  arbitro?: string;
  estado: 'activo' | 'libre' | 'tarde';
}

export default function MesasPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedMesa, setSelectedMesa] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const itemsPerPage = 9;

  // Datos de ejemplo
  const mesas: MesaCard[] = Array.from({ length: 12 }, (_, i) => ({
    id: `mesa-${i + 1}`,
    numero: i + 1,
    arbitro: i % 3 === 0 ? 'Nombre de arbitro' : undefined,
    estado: i % 3 === 0 ? 'activo' : i % 3 === 1 ? 'libre' : 'tarde',
  }));

  const filteredMesas = mesas.filter(
    (mesa) =>
      mesa.numero.toString().includes(searchTerm) ||
      (mesa.arbitro?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false),
  );

  const paginatedMesas = filteredMesas.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage,
  );

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, mesaId: string) => {
    setAnchorEl(event.currentTarget);
    setSelectedMesa(mesaId);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedMesa(null);
  };

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case 'activo':
        return '#ff9800'; // Naranja
      case 'libre':
        return '#9c27b0'; // Morado
      case 'tarde':
        return '#2196f3'; // Azul
      default:
        return '#9e9e9e';
    }
  };

  return (
    <Box>
      {/* Breadcrumbs */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
        <Box
          sx={{
            width: 24,
            height: 24,
            borderRadius: 1,
            backgroundColor: 'primary.main',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        />
        <Typography variant="body2" color="text.secondary">
          Home / Mesas
        </Typography>
      </Box>

      {/* Barra de búsqueda y filtros */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3, gap: 2 }}>
        <TextField
          placeholder="Mesa, arbitro"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          sx={{ flexGrow: 1, maxWidth: 400 }}
        />

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {/* Filtros por estado */}
          <Chip
            label="Activo"
            sx={{
              backgroundColor: '#ff9800',
              color: 'white',
              width: 80,
              height: 36,
            }}
          />
          <Chip
            label="Libre"
            sx={{
              backgroundColor: '#9c27b0',
              color: 'white',
              width: 80,
              height: 36,
            }}
          />
          <Chip
            label="Tarde"
            sx={{
              backgroundColor: '#2196f3',
              color: 'white',
              width: 80,
              height: 36,
            }}
          />

          {/* Botón Acciones */}
          <Button
            variant="contained"
            sx={{
              backgroundColor: '#1a237e',
              '&:hover': { backgroundColor: '#283593' },
            }}
            endIcon={<Typography>▼</Typography>}
          >
            Acciones
          </Button>
        </Box>
      </Box>

      {/* Paginación superior */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 3 }}>
        <Pagination
          count={Math.ceil(filteredMesas.length / itemsPerPage)}
          page={page}
          onChange={(_, value) => setPage(value)}
          color="primary"
        />
      </Box>

      {/* Grid de mesas */}
      <Grid container spacing={3}>
        {paginatedMesas.map((mesa) => (
          <Grid item xs={12} sm={6} md={4} key={mesa.id}>
            <Paper
              elevation={2}
              sx={{
                p: 3,
                borderRadius: 2,
                border: '1px solid #e0e0e0',
                position: 'relative',
                '&:hover': {
                  boxShadow: 4,
                },
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  mb: 2,
                }}
              >
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
                    Mesa {mesa.numero}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ fontSize: '0.875rem' }}
                  >
                    {mesa.arbitro || 'Sin asignar'}
                  </Typography>
                </Box>
                <IconButton
                  size="small"
                  onClick={(e) => handleMenuOpen(e, mesa.id)}
                  sx={{ mt: -1 }}
                >
                  <MoreVertIcon />
                </IconButton>
              </Box>

              {/* Estado */}
              <Chip
                label={mesa.estado.charAt(0).toUpperCase() + mesa.estado.slice(1)}
                size="small"
                sx={{
                  backgroundColor: getEstadoColor(mesa.estado),
                  color: 'white',
                  fontSize: '0.75rem',
                }}
              />
            </Paper>
          </Grid>
        ))}
      </Grid>

      {/* Paginación inferior */}
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <Pagination
          count={Math.ceil(filteredMesas.length / itemsPerPage)}
          page={page}
          onChange={(_, value) => setPage(value)}
          color="primary"
        />
      </Box>

      {/* Menú de acciones */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleMenuClose}>Ver detalles</MenuItem>
        <MenuItem onClick={handleMenuClose}>Asignar árbitro</MenuItem>
        <MenuItem onClick={handleMenuClose}>Editar</MenuItem>
        <MenuItem onClick={handleMenuClose} sx={{ color: 'error.main' }}>
          Eliminar
        </MenuItem>
      </Menu>
    </Box>
  );
}

