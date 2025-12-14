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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Select,
  MenuItem,
  InputAdornment,
  alpha,
  Autocomplete,
  Checkbox,
} from '@mui/material';
import {
  Home as HomeIcon,
  Search as SearchIcon,
  PictureAsPdf as PdfIcon,
  Alarm as AlarmIcon,
  CheckBoxOutlineBlank as CheckBoxOutlineBlankIcon,
  CheckBox as CheckBoxIcon,
} from '@mui/icons-material';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';

interface Competition {
  id: string;
  name: string;
  participants: number;
  configuration: string;
  totalSeries: number;
}

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

// Datos de ejemplo
const competitionOptions = [
  'Competencia IV13',
  'Competencia IV14',
  'Competencia IV15',
  'Competencia IV19',
  'Competencia IV20',
];

export default function GenerarSeriesPage() {
  // Estados para configuración
  const [selectedCompetitions, setSelectedCompetitions] = useState<string[]>([]);
  const [sortType, setSortType] = useState('ranking');
  const [priority, setPriority] = useState('4');

  // Estados para tabla
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState('');

  // Datos de ejemplo de competencias generadas
  const [competitions, setCompetitions] = useState<Competition[]>([
    {
      id: 'iv14',
      name: 'IV14',
      participants: 78,
      configuration: '15 series de 4\n6 series de 3',
      totalSeries: 19,
    },
    {
      id: 'iv15',
      name: 'IV15',
      participants: 64,
      configuration: '16 series de 4',
      totalSeries: 16,
    },
    {
      id: 'iv19',
      name: 'IV19',
      participants: 72,
      configuration: '15 series de 4\n4 series de 3',
      totalSeries: 19,
    },
    {
      id: 'iv20',
      name: 'IV20',
      participants: 89,
      configuration: '20 series de 4\n3 series de 3',
      totalSeries: 23,
    },
  ]);

  const handleGenerateSeries = () => {
    console.log('Generando series con:', {
      competitions: selectedCompetitions,
      sortType,
      priority,
    });
    alert('Generando series...');
  };

  const handleExportPdf = () => {
    console.log('Exportando PDF...');
    alert('Exportación PDF en desarrollo');
  };

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const filteredCompetitions = competitions.filter((comp) =>
    comp.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
          Generar
        </Typography>
      </Breadcrumbs>

      {/* Panel de configuración */}
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
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' },
            gap: 3,
            mb: 3,
          }}
        >
          {/* Selección de competencia */}
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2.5 }}>
              <Box
                sx={{
                  width: 36,
                  height: 36,
                  borderRadius: 1.5,
                  background: 'linear-gradient(135deg, #3742FA 0%, #5F6FFF 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                }}
              >
                <AlarmIcon sx={{ fontSize: 20 }} />
              </Box>
              <Typography variant="h6" sx={{ fontWeight: 600, color: '#2D3436', fontSize: '0.9375rem' }}>
                Selección de competencia
              </Typography>
            </Box>
            <Autocomplete
              multiple
              options={competitionOptions}
              disableCloseOnSelect
              value={selectedCompetitions}
              onChange={(event, newValue) => {
                setSelectedCompetitions(newValue);
              }}
              renderOption={(props, option, { selected }) => (
                <li {...props}>
                  <Checkbox
                    icon={icon}
                    checkedIcon={checkedIcon}
                    style={{ marginRight: 8 }}
                    checked={selected}
                    sx={{
                      color: '#ADB5BD',
                      '&.Mui-checked': {
                        color: '#6C5CE7',
                      },
                    }}
                  />
                  {option}
                </li>
              )}
              renderInput={(params) => (
                <TextField
                  {...params}
                  placeholder="ALL"
                  InputProps={{
                    ...params.InputProps,
                    startAdornment: (
                      <>
                        <InputAdornment position="start">
                          <SearchIcon sx={{ color: '#ADB5BD', fontSize: 20 }} />
                        </InputAdornment>
                        {params.InputProps.startAdornment}
                      </>
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
                />
              )}
              sx={{
                '& .MuiAutocomplete-tag': {
                  backgroundColor: alpha('#6C5CE7', 0.1),
                  color: '#6C5CE7',
                  borderRadius: '6px',
                  fontSize: '0.8125rem',
                  fontWeight: 500,
                },
              }}
            />
          </Box>

          {/* Selección de tipo de sorteo */}
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2.5 }}>
              <Box
                sx={{
                  width: 36,
                  height: 36,
                  borderRadius: 1.5,
                  background: 'linear-gradient(135deg, #3742FA 0%, #5F6FFF 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                }}
              >
                <AlarmIcon sx={{ fontSize: 20 }} />
              </Box>
              <Typography variant="h6" sx={{ fontWeight: 600, color: '#2D3436', fontSize: '0.9375rem' }}>
                Selección de tipo de sorteo
              </Typography>
            </Box>
            <FormControl fullWidth>
              <RadioGroup
                row
                value={sortType}
                onChange={(e) => setSortType(e.target.value)}
                sx={{ gap: 3, mt: 1 }}
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
                      Ranking y sorteo
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
          </Box>

          {/* Selección de prioridad */}
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2.5 }}>
              <Box
                sx={{
                  width: 36,
                  height: 36,
                  borderRadius: 1.5,
                  background: 'linear-gradient(135deg, #3742FA 0%, #5F6FFF 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                }}
              >
                <AlarmIcon sx={{ fontSize: 20 }} />
              </Box>
              <Typography variant="h6" sx={{ fontWeight: 600, color: '#2D3436', fontSize: '0.9375rem' }}>
                Seleccione prioridad
              </Typography>
            </Box>
            <FormControl fullWidth>
              <RadioGroup
                row
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                sx={{ gap: 3, mt: 1 }}
              >
                <FormControlLabel
                  value="4"
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
                      4 por serie
                    </Typography>
                  }
                />
                <FormControlLabel
                  value="3"
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
                      3 por serie
                    </Typography>
                  }
                />
              </RadioGroup>
            </FormControl>
          </Box>
        </Box>

        {/* Botón Generar series */}
        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            variant="contained"
            onClick={handleGenerateSeries}
            disabled={selectedCompetitions.length === 0}
            sx={{
              backgroundColor: '#2D3748',
              color: '#FFFFFF',
              textTransform: 'none',
              borderRadius: '10px',
              px: 4,
              py: 1.5,
              fontSize: '0.875rem',
              fontWeight: 600,
              boxShadow: 'none',
              minWidth: 180,
              '&:hover': {
                backgroundColor: '#1A202C',
                boxShadow: '0 4px 16px rgba(45, 55, 72, 0.25)',
              },
              '&:disabled': {
                backgroundColor: '#E9ECEF',
                color: '#ADB5BD',
              },
            }}
          >
            Generar series
          </Button>
        </Box>
      </Paper>

      {/* Tabla de resultados */}
      <Paper
        elevation={0}
        sx={{
          p: 3,
          borderRadius: '12px',
          border: '1px solid #E9ECEF',
          backgroundColor: '#FFFFFF',
        }}
      >
        {/* Header con controles */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            mb: 3,
            flexWrap: 'wrap',
            gap: 2,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Typography sx={{ fontSize: '0.875rem', color: '#6C757D', fontWeight: 500 }}>
              Show
            </Typography>
            <Select
              value={rowsPerPage}
              onChange={handleChangeRowsPerPage}
              size="small"
              sx={{
                borderRadius: '8px',
                fontSize: '0.875rem',
                minWidth: 70,
                backgroundColor: '#F8F9FA',
                '& .MuiSelect-select': {
                  py: 0.75,
                },
                '&:hover': {
                  backgroundColor: '#FFFFFF',
                },
              }}
            >
              <MenuItem value={10}>10</MenuItem>
              <MenuItem value={25}>25</MenuItem>
              <MenuItem value={50}>50</MenuItem>
            </Select>
            <Typography sx={{ fontSize: '0.875rem', color: '#6C757D', fontWeight: 500 }}>
              rows for page
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {/* Búsqueda */}
            <Box
              sx={{
                position: 'relative',
                borderRadius: '8px',
                backgroundColor: '#F8F9FA',
                border: '1px solid #E9ECEF',
                display: 'flex',
                alignItems: 'center',
                px: 2,
                py: 1,
                minWidth: 200,
                '&:hover': {
                  backgroundColor: '#FFFFFF',
                  borderColor: '#DEE2E6',
                },
                '&:focus-within': {
                  backgroundColor: '#FFFFFF',
                  borderColor: '#6C5CE7',
                  boxShadow: `0 0 0 3px ${alpha('#6C5CE7', 0.1)}`,
                },
              }}
            >
              <SearchIcon sx={{ color: '#ADB5BD', mr: 1, fontSize: 20 }} />
              <input
                type="text"
                placeholder="Search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  border: 'none',
                  outline: 'none',
                  backgroundColor: 'transparent',
                  fontSize: '0.875rem',
                  color: '#2D3436',
                  width: '100%',
                }}
              />
            </Box>

            {/* Botón Exportar PDF */}
            <Button
              variant="contained"
              startIcon={<PdfIcon />}
              onClick={handleExportPdf}
              sx={{
                backgroundColor: '#2D3748',
                color: '#FFFFFF',
                textTransform: 'none',
                borderRadius: '8px',
                px: 3,
                py: 1.25,
                fontSize: '0.875rem',
                fontWeight: 600,
                boxShadow: 'none',
                whiteSpace: 'nowrap',
                '&:hover': {
                  backgroundColor: '#1A202C',
                  boxShadow: '0 4px 12px rgba(45, 55, 72, 0.2)',
                },
              }}
            >
              Exportar pdf
            </Button>
          </Box>
        </Box>

        {/* Tabla */}
        <TableContainer
          sx={{
            borderRadius: '8px',
            border: '1px solid #E9ECEF',
            overflow: 'hidden',
          }}
        >
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: '#F8F9FA' }}>
                <TableCell sx={{ fontWeight: 600, color: '#2D3436', fontSize: '0.875rem', py: 2 }}>
                  Competencia
                </TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#2D3436', fontSize: '0.875rem', py: 2 }}>
                  Cantidad de participantes
                </TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#2D3436', fontSize: '0.875rem', py: 2 }}>
                  Configuracion
                </TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#2D3436', fontSize: '0.875rem', py: 2 }}>
                  Total de series
                </TableCell>
                <TableCell
                  align="center"
                  sx={{ fontWeight: 600, color: '#2D3436', fontSize: '0.875rem', py: 2 }}
                >
                  Acciones
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredCompetitions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 6 }}>
                    <Typography sx={{ color: '#ADB5BD', fontSize: '0.9375rem' }}>
                      No hay series generadas
                    </Typography>
                    <Typography sx={{ color: '#CED4DA', fontSize: '0.8125rem', mt: 0.5 }}>
                      Seleccione una competencia y haga clic en "Generar series"
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                filteredCompetitions
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((comp) => (
                    <TableRow
                      key={comp.id}
                      hover
                      sx={{
                        '&:hover': {
                          backgroundColor: alpha('#6C5CE7', 0.02),
                        },
                      }}
                    >
                      <TableCell sx={{ fontSize: '0.875rem', color: '#2D3436', fontWeight: 600, py: 2.5 }}>
                        {comp.name}
                      </TableCell>
                      <TableCell sx={{ fontSize: '0.875rem', color: '#495057', py: 2.5 }}>
                        {comp.participants}
                      </TableCell>
                      <TableCell sx={{ fontSize: '0.875rem', color: '#495057', py: 2.5 }}>
                        <Box sx={{ whiteSpace: 'pre-line' }}>{comp.configuration}</Box>
                      </TableCell>
                      <TableCell sx={{ fontSize: '0.875rem', color: '#495057', py: 2.5 }}>
                        {comp.totalSeries}
                      </TableCell>
                      <TableCell align="center" sx={{ py: 2.5 }}>
                        <Button
                          variant="contained"
                          size="small"
                          sx={{
                            backgroundColor: '#2D3748',
                            color: '#FFFFFF',
                            textTransform: 'none',
                            borderRadius: '6px',
                            px: 2.5,
                            py: 0.75,
                            fontSize: '0.8125rem',
                            fontWeight: 600,
                            minWidth: 'auto',
                            boxShadow: 'none',
                            '&:hover': {
                              backgroundColor: '#1A202C',
                              boxShadow: '0 2px 8px rgba(45, 55, 72, 0.15)',
                            },
                          }}
                        >
                          Acciones
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Paginación */}
        {filteredCompetitions.length > 0 && (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
            <TablePagination
              component="div"
              count={filteredCompetitions.length}
              page={page}
              onPageChange={handleChangePage}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              labelRowsPerPage=""
              rowsPerPageOptions={[]}
              sx={{
                border: 'none',
                '& .MuiTablePagination-toolbar': {
                  minHeight: 'auto',
                  padding: 0,
                },
                '& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows': {
                  display: 'none',
                },
                '& .MuiTablePagination-actions': {
                  gap: 1,
                  '& .MuiIconButton-root': {
                    borderRadius: '8px',
                    border: '1px solid #E9ECEF',
                    color: '#6C757D',
                    fontSize: '0.875rem',
                    padding: '8px 12px',
                    '&:hover': {
                      backgroundColor: alpha('#6C5CE7', 0.08),
                      borderColor: '#6C5CE7',
                      color: '#6C5CE7',
                    },
                    '&.Mui-disabled': {
                      color: '#CED4DA',
                      borderColor: '#F1F3F5',
                    },
                  },
                },
              }}
            />
          </Box>
        )}
      </Paper>
    </Box>
  );
}

