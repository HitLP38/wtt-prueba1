'use client';

import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  Checkbox,
  FormControlLabel,
  Breadcrumbs,
  Link,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Chip,
  alpha,
} from '@mui/material';
import {
  Home as HomeIcon,
  EmojiEvents as EventIcon,
  LocationOn as LocationIcon,
  CalendarMonth as CalendarIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';

interface Tournament {
  id: string;
  name: string;
  type: string;
  startDate: string;
  endDate: string;
  location: string;
  modalities: {
    individuales: { varones: boolean; damas: boolean; mixtos: boolean };
    dobles: { varones: boolean; damas: boolean; mixtos: boolean };
    equipos: { varones: boolean; damas: boolean; mixtos: boolean };
  };
}

export default function TorneosPage() {
  const [formData, setFormData] = useState({
    name: '',
    type: 'Torneo',
    startDate: '',
    endDate: '',
    location: '',
    address: '',
    modalities: {
      individuales: { varones: false, damas: false, mixtos: false },
      dobles: { varones: false, damas: false, mixtos: false },
      equipos: { varones: false, damas: false, mixtos: false },
    },
  });

  const [tournaments, setTournaments] = useState<Tournament[]>([]);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleModalityChange = (
    category: 'individuales' | 'dobles' | 'equipos',
    subcategory: 'varones' | 'damas' | 'mixtos',
  ) => {
    setFormData((prev) => ({
      ...prev,
      modalities: {
        ...prev.modalities,
        [category]: {
          ...prev.modalities[category],
          [subcategory]: !prev.modalities[category][subcategory],
        },
      },
    }));
  };

  const handleSelectAll = () => {
    setFormData((prev) => ({
      ...prev,
      modalities: {
        individuales: { varones: true, damas: true, mixtos: true },
        dobles: { varones: true, damas: true, mixtos: true },
        equipos: { varones: true, damas: true, mixtos: true },
      },
    }));
  };

  const handleClearAll = () => {
    setFormData((prev) => ({
      ...prev,
      modalities: {
        individuales: { varones: false, damas: false, mixtos: false },
        dobles: { varones: false, damas: false, mixtos: false },
        equipos: { varones: false, damas: false, mixtos: false },
      },
    }));
  };

  const handleSave = () => {
    const newTournament: Tournament = {
      id: Date.now().toString(),
      name: formData.name,
      type: formData.type,
      startDate: formData.startDate,
      endDate: formData.endDate,
      location: formData.location,
      modalities: formData.modalities,
    };
    setTournaments((prev) => [...prev, newTournament]);
    // Reset form
    setFormData({
      name: '',
      type: 'Torneo',
      startDate: '',
      endDate: '',
      location: '',
      address: '',
      modalities: {
        individuales: { varones: false, damas: false, mixtos: false },
        dobles: { varones: false, damas: false, mixtos: false },
        equipos: { varones: false, damas: false, mixtos: false },
      },
    });
  };

  const getModalitiesText = (modalities: Tournament['modalities']) => {
    const selected: string[] = [];
    Object.entries(modalities).forEach(([category, subcategories]) => {
      Object.entries(subcategories).forEach(([subcategory, value]) => {
        if (value) {
          selected.push(`${category.charAt(0).toUpperCase()}${category.slice(1)} ${subcategory}`);
        }
      });
    });
    return selected.join(', ') || 'Ninguna';
  };

  return (
    <Box>
      {/* Breadcrumbs */}
      <Breadcrumbs
        separator={<NavigateNextIcon fontSize="small" />}
        sx={{ mb: 3 }}
      >
        <Link
          href="/admin/dashboard"
          sx={{
            display: 'flex',
            alignItems: 'center',
            color: '#6C757D',
            textDecoration: 'none',
            fontSize: '0.875rem',
            '&:hover': { color: '#6C5CE7' },
          }}
        >
          <HomeIcon sx={{ mr: 0.5, fontSize: 18 }} />
          Home
        </Link>
        <Typography sx={{ fontSize: '0.875rem', color: '#6C757D' }}>
          evento
        </Typography>
        <Typography sx={{ fontSize: '0.875rem', color: '#2D3436', fontWeight: 600 }}>
          torneos
        </Typography>
      </Breadcrumbs>

      {/* Formulario */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
        {/* Información del evento - Parte 1 */}
        <Paper
          elevation={0}
          sx={{
            p: 3,
            borderRadius: '12px',
            border: '1px solid #E9ECEF',
            backgroundColor: '#FFFFFF',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: 2,
                background: 'linear-gradient(135deg, #6C5CE7 0%, #A29BFE 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
              }}
            >
              <EventIcon />
            </Box>
            <Typography variant="h6" sx={{ fontWeight: 600, color: '#2D3436' }}>
              Información del evento
            </Typography>
          </Box>

          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2.5 }}>
            <TextField
              label="Nombre del evento"
              placeholder="Placeholder"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              fullWidth
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '8px',
                  backgroundColor: '#F8F9FA',
                  '&:hover': {
                    backgroundColor: '#FFFFFF',
                  },
                  '&.Mui-focused': {
                    backgroundColor: '#FFFFFF',
                  },
                },
              }}
            />

            <FormControl fullWidth>
              <InputLabel>Tipo de evento</InputLabel>
              <Select
                value={formData.type}
                onChange={(e) => handleInputChange('type', e.target.value)}
                label="Tipo de evento"
                sx={{
                  borderRadius: '8px',
                  backgroundColor: '#F8F9FA',
                  '&:hover': {
                    backgroundColor: '#FFFFFF',
                  },
                  '&.Mui-focused': {
                    backgroundColor: '#FFFFFF',
                  },
                }}
              >
                <MenuItem value="Torneo">Torneo</MenuItem>
                <MenuItem value="Campeonato">Campeonato</MenuItem>
                <MenuItem value="Liga">Liga</MenuItem>
                <MenuItem value="Copa">Copa</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </Paper>

        {/* Información del evento - Parte 2: Fechas */}
        <Paper
          elevation={0}
          sx={{
            p: 3,
            borderRadius: '12px',
            border: '1px solid #E9ECEF',
            backgroundColor: '#FFFFFF',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: 2,
                background: 'linear-gradient(135deg, #3742FA 0%, #5F6FFF 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
              }}
            >
              <CalendarIcon />
            </Box>
            <Typography variant="h6" sx={{ fontWeight: 600, color: '#2D3436' }}>
              Información del evento
            </Typography>
          </Box>

          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2.5 }}>
            <TextField
              label="Fecha de inicio"
              type="date"
              value={formData.startDate}
              onChange={(e) => handleInputChange('startDate', e.target.value)}
              fullWidth
              InputLabelProps={{ shrink: true }}
              placeholder="dd/mm/aaaa"
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '8px',
                  backgroundColor: '#F8F9FA',
                  '&:hover': {
                    backgroundColor: '#FFFFFF',
                  },
                  '&.Mui-focused': {
                    backgroundColor: '#FFFFFF',
                  },
                },
              }}
            />

            <TextField
              label="Fecha de termino"
              type="date"
              value={formData.endDate}
              onChange={(e) => handleInputChange('endDate', e.target.value)}
              fullWidth
              InputLabelProps={{ shrink: true }}
              placeholder="dd/mm/aaaa"
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '8px',
                  backgroundColor: '#F8F9FA',
                  '&:hover': {
                    backgroundColor: '#FFFFFF',
                  },
                  '&.Mui-focused': {
                    backgroundColor: '#FFFFFF',
                  },
                },
              }}
            />
          </Box>
        </Paper>

        {/* Ubicación */}
        <Paper
          elevation={0}
          sx={{
            p: 3,
            borderRadius: '12px',
            border: '1px solid #E9ECEF',
            backgroundColor: '#FFFFFF',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: 2,
                background: 'linear-gradient(135deg, #2ECC71 0%, #55EFC4 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
              }}
            >
              <LocationIcon />
            </Box>
            <Typography variant="h6" sx={{ fontWeight: 600, color: '#2D3436' }}>
              Ubicación
            </Typography>
          </Box>

          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2.5 }}>
            <TextField
              label="Lugar"
              placeholder="Placeholder"
              value={formData.location}
              onChange={(e) => handleInputChange('location', e.target.value)}
              fullWidth
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '8px',
                  backgroundColor: '#F8F9FA',
                  '&:hover': {
                    backgroundColor: '#FFFFFF',
                  },
                  '&.Mui-focused': {
                    backgroundColor: '#FFFFFF',
                  },
                },
              }}
            />

            <TextField
              label="Dirección"
              placeholder="Placeholder"
              value={formData.address}
              onChange={(e) => handleInputChange('address', e.target.value)}
              fullWidth
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '8px',
                  backgroundColor: '#F8F9FA',
                  '&:hover': {
                    backgroundColor: '#FFFFFF',
                  },
                  '&.Mui-focused': {
                    backgroundColor: '#FFFFFF',
                  },
                },
              }}
            />
          </Box>
        </Paper>

        {/* Modalidades */}
        <Paper
          elevation={0}
          sx={{
            p: 3,
            borderRadius: '12px',
            border: '1px solid #E9ECEF',
            backgroundColor: '#FFFFFF',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: 2,
                  background: 'linear-gradient(135deg, #F39C12 0%, #FDCB6E 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                }}
              >
                <EventIcon />
              </Box>
              <Typography variant="h6" sx={{ fontWeight: 600, color: '#2D3436' }}>
                Modalidades
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', gap: 1.5 }}>
              <Button
                variant="contained"
                size="small"
                onClick={handleSelectAll}
                sx={{
                  backgroundColor: '#ADB5BD',
                  color: '#FFFFFF',
                  textTransform: 'none',
                  borderRadius: '8px',
                  px: 2.5,
                  py: 0.75,
                  fontSize: '0.875rem',
                  fontWeight: 500,
                  boxShadow: 'none',
                  '&:hover': {
                    backgroundColor: '#6C757D',
                    boxShadow: 'none',
                  },
                }}
              >
                Seleccionar todo
              </Button>
              <Button
                variant="outlined"
                size="small"
                onClick={handleClearAll}
                sx={{
                  color: '#6C757D',
                  borderColor: '#ADB5BD',
                  textTransform: 'none',
                  borderRadius: '8px',
                  px: 2.5,
                  py: 0.75,
                  fontSize: '0.875rem',
                  fontWeight: 500,
                  '&:hover': {
                    borderColor: '#6C757D',
                    backgroundColor: alpha('#6C757D', 0.04),
                  },
                }}
              >
                Borrar todo
              </Button>
            </Box>
          </Box>

          {/* Grid de modalidades */}
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' },
              gap: 3,
            }}
          >
            {/* Individuales */}
            <Box>
              <Typography
                variant="subtitle1"
                sx={{ fontWeight: 600, mb: 1.5, color: '#2D3436', fontSize: '0.9375rem' }}
              >
                Individuales
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={formData.modalities.individuales.varones}
                      onChange={() => handleModalityChange('individuales', 'varones')}
                      sx={{
                        color: '#ADB5BD',
                        '&.Mui-checked': { color: '#6C5CE7' },
                      }}
                    />
                  }
                  label={
                    <Typography sx={{ fontSize: '0.875rem', color: '#495057' }}>
                      Varones
                    </Typography>
                  }
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={formData.modalities.individuales.damas}
                      onChange={() => handleModalityChange('individuales', 'damas')}
                      sx={{
                        color: '#ADB5BD',
                        '&.Mui-checked': { color: '#6C5CE7' },
                      }}
                    />
                  }
                  label={
                    <Typography sx={{ fontSize: '0.875rem', color: '#495057' }}>
                      Damas
                    </Typography>
                  }
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={formData.modalities.individuales.mixtos}
                      onChange={() => handleModalityChange('individuales', 'mixtos')}
                      sx={{
                        color: '#ADB5BD',
                        '&.Mui-checked': { color: '#6C5CE7' },
                      }}
                    />
                  }
                  label={
                    <Typography sx={{ fontSize: '0.875rem', color: '#495057' }}>
                      Mixtos
                    </Typography>
                  }
                />
              </Box>
            </Box>

            {/* Dobles */}
            <Box>
              <Typography
                variant="subtitle1"
                sx={{ fontWeight: 600, mb: 1.5, color: '#2D3436', fontSize: '0.9375rem' }}
              >
                Dobles
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={formData.modalities.dobles.varones}
                      onChange={() => handleModalityChange('dobles', 'varones')}
                      sx={{
                        color: '#ADB5BD',
                        '&.Mui-checked': { color: '#6C5CE7' },
                      }}
                    />
                  }
                  label={
                    <Typography sx={{ fontSize: '0.875rem', color: '#495057' }}>
                      Varones
                    </Typography>
                  }
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={formData.modalities.dobles.damas}
                      onChange={() => handleModalityChange('dobles', 'damas')}
                      sx={{
                        color: '#ADB5BD',
                        '&.Mui-checked': { color: '#6C5CE7' },
                      }}
                    />
                  }
                  label={
                    <Typography sx={{ fontSize: '0.875rem', color: '#495057' }}>
                      Damas
                    </Typography>
                  }
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={formData.modalities.dobles.mixtos}
                      onChange={() => handleModalityChange('dobles', 'mixtos')}
                      sx={{
                        color: '#ADB5BD',
                        '&.Mui-checked': { color: '#6C5CE7' },
                      }}
                    />
                  }
                  label={
                    <Typography sx={{ fontSize: '0.875rem', color: '#495057' }}>
                      Mixtos
                    </Typography>
                  }
                />
              </Box>
            </Box>

            {/* Equipos */}
            <Box>
              <Typography
                variant="subtitle1"
                sx={{ fontWeight: 600, mb: 1.5, color: '#2D3436', fontSize: '0.9375rem' }}
              >
                Equipos
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={formData.modalities.equipos.varones}
                      onChange={() => handleModalityChange('equipos', 'varones')}
                      sx={{
                        color: '#ADB5BD',
                        '&.Mui-checked': { color: '#6C5CE7' },
                      }}
                    />
                  }
                  label={
                    <Typography sx={{ fontSize: '0.875rem', color: '#495057' }}>
                      Equipos
                    </Typography>
                  }
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={formData.modalities.equipos.damas}
                      onChange={() => handleModalityChange('equipos', 'damas')}
                      sx={{
                        color: '#ADB5BD',
                        '&.Mui-checked': { color: '#6C5CE7' },
                      }}
                    />
                  }
                  label={
                    <Typography sx={{ fontSize: '0.875rem', color: '#495057' }}>
                      Equipos
                    </Typography>
                  }
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={formData.modalities.equipos.mixtos}
                      onChange={() => handleModalityChange('equipos', 'mixtos')}
                      sx={{
                        color: '#ADB5BD',
                        '&.Mui-checked': { color: '#6C5CE7' },
                      }}
                    />
                  }
                  label={
                    <Typography sx={{ fontSize: '0.875rem', color: '#495057' }}>
                      Equipos
                    </Typography>
                  }
                />
              </Box>
            </Box>
          </Box>
        </Paper>

        {/* Botón Guardar */}
        <Box sx={{ display: 'flex', justifyContent: 'flex-start' }}>
          <Button
            variant="contained"
            onClick={handleSave}
            disabled={!formData.name || !formData.startDate || !formData.endDate}
            sx={{
              backgroundColor: '#2D3748',
              color: '#FFFFFF',
              textTransform: 'none',
              borderRadius: '8px',
              px: 4,
              py: 1.25,
              fontSize: '0.9375rem',
              fontWeight: 600,
              boxShadow: '0 2px 8px rgba(45, 55, 72, 0.15)',
              '&:hover': {
                backgroundColor: '#1A202C',
                boxShadow: '0 4px 12px rgba(45, 55, 72, 0.25)',
              },
              '&:disabled': {
                backgroundColor: '#E9ECEF',
                color: '#ADB5BD',
              },
            }}
          >
            Guardar torneo
          </Button>
        </Box>

        {/* Tabla de torneos guardados */}
        {tournaments.length > 0 && (
          <Paper
            elevation={0}
            sx={{
              borderRadius: '12px',
              border: '1px solid #E9ECEF',
              backgroundColor: '#FFFFFF',
              overflow: 'hidden',
              mt: 1,
            }}
          >
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow sx={{ backgroundColor: '#F8F9FA' }}>
                    <TableCell sx={{ fontWeight: 600, color: '#2D3436', fontSize: '0.875rem' }}>
                      Nombre
                    </TableCell>
                    <TableCell sx={{ fontWeight: 600, color: '#2D3436', fontSize: '0.875rem' }}>
                      Tipo
                    </TableCell>
                    <TableCell sx={{ fontWeight: 600, color: '#2D3436', fontSize: '0.875rem' }}>
                      Modalidades
                    </TableCell>
                    <TableCell
                      align="center"
                      sx={{ fontWeight: 600, color: '#2D3436', fontSize: '0.875rem' }}
                    >
                      Acciones
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {tournaments.map((tournament) => (
                    <TableRow
                      key={tournament.id}
                      sx={{
                        '&:hover': {
                          backgroundColor: '#F8F9FA',
                        },
                      }}
                    >
                      <TableCell sx={{ fontSize: '0.875rem', color: '#495057' }}>
                        {tournament.name}
                      </TableCell>
                      <TableCell sx={{ fontSize: '0.875rem', color: '#495057' }}>
                        <Chip
                          label={tournament.type}
                          size="small"
                          sx={{
                            backgroundColor: alpha('#6C5CE7', 0.1),
                            color: '#6C5CE7',
                            fontWeight: 500,
                            fontSize: '0.75rem',
                          }}
                        />
                      </TableCell>
                      <TableCell sx={{ fontSize: '0.8125rem', color: '#6C757D' }}>
                        {getModalitiesText(tournament.modalities)}
                      </TableCell>
                      <TableCell align="center">
                        <Box sx={{ display: 'flex', gap: 0.5, justifyContent: 'center' }}>
                          <Button
                            variant="contained"
                            size="small"
                            sx={{
                              backgroundColor: '#2D3748',
                              color: '#FFFFFF',
                              textTransform: 'none',
                              borderRadius: '6px',
                              px: 2,
                              py: 0.5,
                              fontSize: '0.75rem',
                              fontWeight: 500,
                              minWidth: 'auto',
                              boxShadow: 'none',
                              '&:hover': {
                                backgroundColor: '#1A202C',
                                boxShadow: 'none',
                              },
                            }}
                          >
                            Acciones
                          </Button>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        )}
      </Box>
    </Box>
  );
}
