'use client';

import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  Breadcrumbs,
  Link,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  Card,
  CardContent,
  IconButton,
  InputAdornment,
  Grid,
  Divider,
  alpha,
  Chip,
} from '@mui/material';
import {
  Home as HomeIcon,
  Search as SearchIcon,
  FileDownload as ExportIcon,
  Edit as EditIcon,
  MoreVert as MoreVertIcon,
  Alarm as AlarmIcon,
  Category as CategoryIcon,
} from '@mui/icons-material';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';

interface Participant {
  position: number;
  name: string;
}

interface Serie {
  serieNumber: number;
  participants: Participant[];
}

interface Competition {
  id: string;
  name: string;
  series: Serie[];
}

export default function SeriesPage() {
  // Estados
  const [selectedCompetition, setSelectedCompetition] = useState('all');
  const [sortType, setSortType] = useState('ranking');
  const [competitionFilter, setCompetitionFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Datos de ejemplo (simulados)
  const [competitions, setCompetitions] = useState<Competition[]>([
    {
      id: 'iv13',
      name: 'Competencia IV13',
      series: [
        {
          serieNumber: 1,
          participants: [
            { position: 1, name: 'Participante 1' },
            { position: 2, name: 'Participante 2' },
            { position: 3, name: 'Participante 3' },
            { position: 4, name: 'Participante 4' },
          ],
        },
        {
          serieNumber: 2,
          participants: [
            { position: 1, name: 'Participante 1' },
            { position: 2, name: 'Participante 2' },
            { position: 3, name: 'Participante 3' },
            { position: 4, name: 'Participante 4' },
          ],
        },
        {
          serieNumber: 3,
          participants: [
            { position: 1, name: 'Participante 1' },
            { position: 2, name: 'Participante 2' },
            { position: 3, name: 'Participante 3' },
            { position: 4, name: 'Participante 4' },
          ],
        },
        {
          serieNumber: 4,
          participants: [
            { position: 1, name: 'Participante 1' },
            { position: 2, name: 'Participante 2' },
            { position: 3, name: 'Participante 3' },
            { position: 4, name: 'Participante 4' },
          ],
        },
        {
          serieNumber: 5,
          participants: [
            { position: 1, name: 'Participante 1' },
            { position: 2, name: 'Participante 2' },
            { position: 3, name: 'Participante 3' },
            { position: 4, name: 'Participante 4' },
          ],
        },
      ],
    },
    {
      id: 'iv14',
      name: 'Competencia IV14',
      series: [
        {
          serieNumber: 1,
          participants: [
            { position: 1, name: 'Participante 1' },
            { position: 2, name: 'Participante 2' },
            { position: 3, name: 'Participante 3' },
            { position: 4, name: 'Participante 4' },
          ],
        },
        {
          serieNumber: 2,
          participants: [
            { position: 1, name: 'Participante 1' },
            { position: 2, name: 'Participante 2' },
            { position: 3, name: 'Participante 3' },
            { position: 4, name: 'Participante 4' },
          ],
        },
        {
          serieNumber: 3,
          participants: [
            { position: 1, name: 'Participante 1' },
            { position: 2, name: 'Participante 2' },
            { position: 3, name: 'Participante 3' },
            { position: 4, name: 'Participante 4' },
          ],
        },
        {
          serieNumber: 4,
          participants: [
            { position: 1, name: 'Participante 1' },
            { position: 2, name: 'Participante 2' },
            { position: 3, name: 'Participante 3' },
            { position: 4, name: 'Participante 4' },
          ],
        },
        {
          serieNumber: 5,
          participants: [
            { position: 1, name: 'Participante 1' },
            { position: 2, name: 'Participante 2' },
            { position: 3, name: 'Participante 3' },
            { position: 4, name: 'Participante 4' },
          ],
        },
      ],
    },
  ]);

  const handleSaveAndStart = () => {
    console.log('Guardando configuración:', {
      competition: selectedCompetition,
      sortType,
    });
    alert('Guardando y comenzando sorteo...');
  };

  const handleExport = () => {
    console.log('Exportando series...');
    alert('Exportación en desarrollo');
  };

  const handleEdit = () => {
    console.log('Editando series...');
    alert('Edición en desarrollo');
  };

  const filteredCompetitions = competitions.filter((comp) => {
    if (competitionFilter === 'all') return true;
    return comp.id === competitionFilter;
  });

  return (
    <Box>
      {/* Breadcrumbs */}
      <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} sx={{ mb: 3 }}>
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
        <Typography sx={{ fontSize: '0.875rem', color: '#6C757D' }}>Series</Typography>
        <Typography sx={{ fontSize: '0.875rem', color: '#2D3436', fontWeight: 600 }}>
          Visualizaciones
        </Typography>
      </Breadcrumbs>

      {/* Configuración de sorteo */}
      <Paper
        elevation={0}
        sx={{
          p: 3.5,
          borderRadius: '12px',
          border: '1px solid #E9ECEF',
          backgroundColor: '#FFFFFF',
          mb: 3,
        }}
      >
        <Grid container spacing={3}>
          {/* Selección de competencia */}
          <Grid item xs={12} md={5}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2.5 }}>
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
                <AlarmIcon sx={{ fontSize: 22 }} />
              </Box>
              <Typography variant="h6" sx={{ fontWeight: 600, color: '#2D3436', fontSize: '1rem' }}>
                Selección de competencia
              </Typography>
            </Box>
            <TextField
              select
              fullWidth
              value={selectedCompetition}
              onChange={(e) => setSelectedCompetition(e.target.value)}
              SelectProps={{
                native: true,
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: '#ADB5BD', fontSize: 20 }} />
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '10px',
                  backgroundColor: '#F8F9FA',
                  fontSize: '0.875rem',
                  '&:hover': {
                    backgroundColor: '#FFFFFF',
                  },
                  '&.Mui-focused': {
                    backgroundColor: '#FFFFFF',
                    '& fieldset': {
                      borderColor: '#6C5CE7',
                      borderWidth: 2,
                    },
                  },
                },
              }}
            >
              <option value="all">ALL</option>
              <option value="iv13">Competencia IV13</option>
              <option value="iv14">Competencia IV14</option>
              <option value="iv15">Competencia IV15</option>
            </TextField>
          </Grid>

          {/* Selección de tipo de sorteo */}
          <Grid item xs={12} md={5}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2.5 }}>
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
                <AlarmIcon sx={{ fontSize: 22 }} />
              </Box>
              <Typography variant="h6" sx={{ fontWeight: 600, color: '#2D3436', fontSize: '1rem' }}>
                Selección de tipo de sorteo
              </Typography>
            </Box>
            <FormControl fullWidth>
              <RadioGroup
                row
                value={sortType}
                onChange={(e) => setSortType(e.target.value)}
                sx={{ gap: 3 }}
              >
                <FormControlLabel
                  value="ranking"
                  control={
                    <Radio
                      sx={{
                        color: '#ADB5BD',
                        '&.Mui-checked': {
                          color: '#6C5CE7',
                        },
                      }}
                    />
                  }
                  label={
                    <Typography sx={{ fontSize: '0.875rem', fontWeight: 500, color: '#2D3436' }}>
                      Ranking
                    </Typography>
                  }
                />
                <FormControlLabel
                  value="manual"
                  control={
                    <Radio
                      sx={{
                        color: '#ADB5BD',
                        '&.Mui-checked': {
                          color: '#6C5CE7',
                        },
                      }}
                    />
                  }
                  label={
                    <Typography sx={{ fontSize: '0.875rem', fontWeight: 500, color: '#2D3436' }}>
                      Manual
                    </Typography>
                  }
                />
              </RadioGroup>
            </FormControl>
          </Grid>

          {/* Botón Guardar e Iniciar */}
          <Grid item xs={12} md={2} sx={{ display: 'flex', alignItems: 'flex-end' }}>
            <Button
              variant="contained"
              fullWidth
              onClick={handleSaveAndStart}
              sx={{
                backgroundColor: '#2D3748',
                color: '#FFFFFF',
                textTransform: 'none',
                borderRadius: '10px',
                py: 1.5,
                fontSize: '0.875rem',
                fontWeight: 600,
                boxShadow: 'none',
                '&:hover': {
                  backgroundColor: '#1A202C',
                  boxShadow: '0 4px 16px rgba(45, 55, 72, 0.25)',
                },
              }}
            >
              Guardar e Iniciar
            </Button>
          </Grid>
        </Grid>

        {/* Nota informativa */}
        <Box
          sx={{
            mt: 3,
            p: 2,
            borderRadius: '10px',
            backgroundColor: alpha('#FFC107', 0.08),
            border: '1px solid',
            borderColor: alpha('#FFC107', 0.2),
          }}
        >
          <Typography sx={{ fontSize: '0.8125rem', color: '#856404', lineHeight: 1.6 }}>
            <strong>Nota:</strong> Se realiza el sorteo acorde a la modalidad de ranking de todas las
            competencias
          </Typography>
        </Box>
      </Paper>

      {/* Visualización de Series */}
      <Paper
        elevation={0}
        sx={{
          p: 3.5,
          borderRadius: '12px',
          border: '1px solid #E9ECEF',
          backgroundColor: '#FFFFFF',
        }}
      >
        {/* Header con filtros y acciones */}
        <Box sx={{ mb: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h5" sx={{ fontWeight: 700, color: '#2D3436', fontSize: '1.25rem' }}>
              Visualización de Series
            </Typography>
            <Button
              variant="contained"
              startIcon={<ExportIcon />}
              onClick={handleExport}
              sx={{
                backgroundColor: '#8B5CF6',
                color: '#FFFFFF',
                textTransform: 'none',
                borderRadius: '10px',
                px: 3,
                py: 1.25,
                fontSize: '0.875rem',
                fontWeight: 600,
                boxShadow: 'none',
                '&:hover': {
                  backgroundColor: '#7C3AED',
                  boxShadow: '0 4px 16px rgba(139, 92, 246, 0.3)',
                },
              }}
            >
              Exportar
            </Button>
          </Box>

          {/* Barra de filtro y edición */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              p: 2.5,
              borderRadius: '10px',
              backgroundColor: '#7C3AED',
              gap: 2,
              flexWrap: 'wrap',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexGrow: 1 }}>
              <Typography
                sx={{
                  fontSize: '0.9375rem',
                  fontWeight: 600,
                  color: '#FFFFFF',
                  minWidth: 'fit-content',
                }}
              >
                Competencia
              </Typography>
              <TextField
                select
                value={competitionFilter}
                onChange={(e) => setCompetitionFilter(e.target.value)}
                SelectProps={{
                  native: true,
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon sx={{ color: '#ADB5BD', fontSize: 18 }} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  minWidth: 200,
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: '#FFFFFF',
                    borderRadius: '8px',
                    fontSize: '0.875rem',
                    '& fieldset': {
                      borderColor: 'transparent',
                    },
                    '&:hover fieldset': {
                      borderColor: 'transparent',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#6C5CE7',
                      borderWidth: 2,
                    },
                  },
                  '& .MuiSelect-select': {
                    py: 1,
                  },
                }}
              >
                <option value="all">ALL</option>
                <option value="iv13">Competencia IV13</option>
                <option value="iv14">Competencia IV14</option>
              </TextField>
            </Box>
            <Button
              variant="contained"
              startIcon={<EditIcon />}
              onClick={handleEdit}
              sx={{
                backgroundColor: '#FFFFFF',
                color: '#7C3AED',
                textTransform: 'none',
                borderRadius: '8px',
                px: 3,
                py: 1,
                fontSize: '0.875rem',
                fontWeight: 600,
                boxShadow: 'none',
                '&:hover': {
                  backgroundColor: '#F8F9FA',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                },
              }}
            >
              Editar
            </Button>
          </Box>
        </Box>

        {/* Grid de Series */}
        {filteredCompetitions.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Typography sx={{ color: '#ADB5BD', fontSize: '0.9375rem' }}>
              No hay series disponibles
            </Typography>
          </Box>
        ) : (
          filteredCompetitions.map((competition) => (
            <Box key={competition.id} sx={{ mb: 5 }}>
              {/* Título de competencia */}
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 700,
                  color: '#2D3436',
                  fontSize: '1.125rem',
                  mb: 3,
                  textAlign: 'center',
                }}
              >
                {competition.name}
              </Typography>

              {/* Grid de series */}
              <Grid container spacing={2.5}>
                {competition.series.map((serie) => (
                  <Grid item xs={12} sm={6} md={4} lg={2.4} key={serie.serieNumber}>
                    <Card
                      elevation={0}
                      sx={{
                        borderRadius: '12px',
                        border: '1px solid #E9ECEF',
                        backgroundColor: '#FFFFFF',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          transform: 'translateY(-4px)',
                          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.08)',
                          borderColor: alpha('#6C5CE7', 0.3),
                        },
                      }}
                    >
                      <CardContent sx={{ p: 2.5 }}>
                        {/* Header de la serie */}
                        <Box
                          sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            mb: 2,
                            pb: 1.5,
                            borderBottom: '2px solid #F1F3F5',
                          }}
                        >
                          <Typography
                            variant="subtitle1"
                            sx={{
                              fontWeight: 700,
                              color: '#2D3436',
                              fontSize: '0.9375rem',
                            }}
                          >
                            Serie {serie.serieNumber}
                          </Typography>
                          <IconButton
                            size="small"
                            sx={{
                              color: '#ADB5BD',
                              '&:hover': {
                                color: '#6C5CE7',
                                backgroundColor: alpha('#6C5CE7', 0.08),
                              },
                            }}
                          >
                            <MoreVertIcon fontSize="small" />
                          </IconButton>
                        </Box>

                        {/* Lista de participantes */}
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.25 }}>
                          {serie.participants.map((participant) => (
                            <Box
                              key={participant.position}
                              sx={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 1.5,
                                py: 0.75,
                                px: 1.25,
                                borderRadius: '8px',
                                backgroundColor: '#F8F9FA',
                                transition: 'all 0.2s ease',
                                '&:hover': {
                                  backgroundColor: alpha('#6C5CE7', 0.06),
                                },
                              }}
                            >
                              <Chip
                                label={participant.position}
                                size="small"
                                sx={{
                                  minWidth: 28,
                                  height: 28,
                                  backgroundColor: '#6C5CE7',
                                  color: '#FFFFFF',
                                  fontWeight: 700,
                                  fontSize: '0.75rem',
                                  '& .MuiChip-label': {
                                    px: 0.75,
                                  },
                                }}
                              />
                              <Typography
                                sx={{
                                  fontSize: '0.8125rem',
                                  fontWeight: 500,
                                  color: '#495057',
                                  lineHeight: 1.4,
                                }}
                              >
                                {participant.name}
                              </Typography>
                            </Box>
                          ))}
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Box>
          ))
        )}
      </Paper>
    </Box>
  );
}

