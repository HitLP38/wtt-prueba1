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
  Breadcrumbs,
  Link,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  InputBase,
  Chip,
  alpha,
} from '@mui/material';
import {
  Home as HomeIcon,
  FilterList as FilterIcon,
  Search as SearchIcon,
  PictureAsPdf as PdfIcon,
  MoreVert as MoreVertIcon,
} from '@mui/icons-material';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';

interface Inscrito {
  id: string;
  nombre: string;
  dni: string;
  categoriaId: string;
  categoria: string;
  modalidad: string;
  sexo: string;
}

export default function InscritosPage() {
  // Estados para filtros
  const [filters, setFilters] = useState({
    categoria: 'All',
    modalidad: 'All',
    sexo: 'All',
  });

  // Estados para tabla
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Datos de ejemplo (simulados)
  const [inscritos, setInscritos] = useState<Inscrito[]>([
    // Aquí irán los datos reales desde el backend
  ]);

  const handleFilterChange = (field: string, value: string) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  const handleSearch = () => {
    // Lógica de búsqueda con filtros
    console.log('Buscando con filtros:', filters);
  };

  const handleSelectAll = () => {
    const allIds = inscritos.map((inscrito) => inscrito.id);
    setSelectedRows(allIds);
  };

  const handleDeselectAll = () => {
    setSelectedRows([]);
  };

  const handleRowSelect = (id: string) => {
    setSelectedRows((prev) =>
      prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]
    );
  };

  const handleExportPdf = () => {
    // TODO: Implementar exportación a PDF
    console.log('Exportando PDF...');
    alert('Exportación a PDF - En desarrollo');
  };

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const filteredInscritos = inscritos.filter((inscrito) => {
    const matchSearch =
      inscrito.nombre.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inscrito.dni.includes(searchQuery);
    const matchCategoria = filters.categoria === 'All' || inscrito.categoria === filters.categoria;
    const matchModalidad = filters.modalidad === 'All' || inscrito.modalidad === filters.modalidad;
    const matchSexo = filters.sexo === 'All' || inscrito.sexo === filters.sexo;
    return matchSearch && matchCategoria && matchModalidad && matchSexo;
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
        <Typography sx={{ fontSize: '0.875rem', color: '#6C757D' }}>partidos</Typography>
        <Typography sx={{ fontSize: '0.875rem', color: '#2D3436', fontWeight: 600 }}>
          inscritos
        </Typography>
      </Breadcrumbs>

      {/* Filtros */}
      <Paper
        elevation={0}
        sx={{
          p: 3,
          borderRadius: '12px',
          border: '1px solid #E9ECEF',
          backgroundColor: '#FFFFFF',
          mb: 2.5,
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
            <FilterIcon />
          </Box>
          <Typography variant="h6" sx={{ fontWeight: 600, color: '#2D3436' }}>
            Relación de inscritos
          </Typography>
        </Box>

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr auto' },
            gap: 2,
            alignItems: 'end',
          }}
        >
          <FormControl fullWidth size="small">
            <InputLabel>Categorías</InputLabel>
            <Select
              value={filters.categoria}
              onChange={(e) => handleFilterChange('categoria', e.target.value)}
              label="Categorías"
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
              <MenuItem value="All">All</MenuItem>
              <MenuItem value="Sub-13">Sub-13</MenuItem>
              <MenuItem value="Sub-15">Sub-15</MenuItem>
              <MenuItem value="Sub-18">Sub-18</MenuItem>
              <MenuItem value="Adultos">Adultos</MenuItem>
            </Select>
          </FormControl>

          <FormControl fullWidth size="small">
            <InputLabel>Modalidad</InputLabel>
            <Select
              value={filters.modalidad}
              onChange={(e) => handleFilterChange('modalidad', e.target.value)}
              label="Modalidad"
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
              <MenuItem value="All">All</MenuItem>
              <MenuItem value="Individual">Individual</MenuItem>
              <MenuItem value="Dobles">Dobles</MenuItem>
              <MenuItem value="Equipos">Equipos</MenuItem>
            </Select>
          </FormControl>

          <FormControl fullWidth size="small">
            <InputLabel>Sexo</InputLabel>
            <Select
              value={filters.sexo}
              onChange={(e) => handleFilterChange('sexo', e.target.value)}
              label="Sexo"
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
              <MenuItem value="All">All</MenuItem>
              <MenuItem value="Varones">Varones</MenuItem>
              <MenuItem value="Damas">Damas</MenuItem>
              <MenuItem value="Mixtos">Mixtos</MenuItem>
            </Select>
          </FormControl>

          <Button
            variant="contained"
            onClick={handleSearch}
            sx={{
              backgroundColor: '#2D3748',
              color: '#FFFFFF',
              textTransform: 'none',
              borderRadius: '8px',
              px: 3.5,
              py: 1.25,
              fontSize: '0.875rem',
              fontWeight: 600,
              boxShadow: 'none',
              minWidth: 120,
              '&:hover': {
                backgroundColor: '#1A202C',
                boxShadow: '0 4px 12px rgba(45, 55, 72, 0.2)',
              },
            }}
          >
            Buscar
          </Button>
        </Box>
      </Paper>

      {/* Controles de tabla */}
      <Paper
        elevation={0}
        sx={{
          p: 2.5,
          borderRadius: '12px',
          border: '1px solid #E9ECEF',
          backgroundColor: '#FFFFFF',
        }}
      >
        {/* Barra de acciones */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            mb: 2.5,
            flexWrap: 'wrap',
            gap: 2,
          }}
        >
          {/* Checkboxes de selección */}
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 0.5,
                cursor: 'pointer',
                '&:hover': {
                  '& .MuiTypography-root': {
                    color: '#6C5CE7',
                  },
                },
              }}
              onClick={handleSelectAll}
            >
              <Checkbox
                checked={selectedRows.length === inscritos.length && inscritos.length > 0}
                onChange={handleSelectAll}
                sx={{
                  color: '#ADB5BD',
                  '&.Mui-checked': { color: '#6C5CE7' },
                  p: 0.5,
                }}
              />
              <Typography sx={{ fontSize: '0.875rem', color: '#495057', fontWeight: 500 }}>
                Seleccionar todo
              </Typography>
            </Box>

            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 0.5,
                cursor: 'pointer',
                '&:hover': {
                  '& .MuiTypography-root': {
                    color: '#6C5CE7',
                  },
                },
              }}
              onClick={handleDeselectAll}
            >
              <Checkbox
                checked={false}
                onChange={handleDeselectAll}
                sx={{
                  color: '#ADB5BD',
                  '&.Mui-checked': { color: '#6C5CE7' },
                  p: 0.5,
                }}
              />
              <Typography sx={{ fontSize: '0.875rem', color: '#495057', fontWeight: 500 }}>
                Desmarcar todo
              </Typography>
            </Box>
          </Box>

          {/* Búsqueda y Exportar */}
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
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
                minWidth: 280,
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
              <InputBase
                placeholder="Search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                sx={{
                  color: '#2D3436',
                  fontSize: '0.875rem',
                  width: '100%',
                  '& .MuiInputBase-input': {
                    padding: 0,
                    '&::placeholder': {
                      color: '#ADB5BD',
                      opacity: 1,
                    },
                  },
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
                <TableCell padding="checkbox" sx={{ width: 50 }}>
                  <Checkbox
                    checked={selectedRows.length === inscritos.length && inscritos.length > 0}
                    onChange={handleSelectAll}
                    indeterminate={selectedRows.length > 0 && selectedRows.length < inscritos.length}
                    sx={{
                      color: '#ADB5BD',
                      '&.Mui-checked': { color: '#6C5CE7' },
                      '&.MuiCheckbox-indeterminate': { color: '#6C5CE7' },
                    }}
                  />
                </TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#2D3436', fontSize: '0.875rem' }}>
                  Nombre
                </TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#2D3436', fontSize: '0.875rem' }}>
                  DNI
                </TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#2D3436', fontSize: '0.875rem' }}>
                  Categoria ID
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
              {inscritos.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 6 }}>
                    <Typography sx={{ color: '#ADB5BD', fontSize: '0.9375rem' }}>
                      No hay inscritos registrados
                    </Typography>
                    <Typography sx={{ color: '#CED4DA', fontSize: '0.8125rem', mt: 0.5 }}>
                      Los inscritos aparecerán aquí cuando se registren
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                filteredInscritos
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((inscrito) => (
                    <TableRow
                      key={inscrito.id}
                      hover
                      selected={selectedRows.includes(inscrito.id)}
                      sx={{
                        '&:hover': {
                          backgroundColor: alpha('#6C5CE7', 0.02),
                        },
                        '&.Mui-selected': {
                          backgroundColor: alpha('#6C5CE7', 0.05),
                          '&:hover': {
                            backgroundColor: alpha('#6C5CE7', 0.08),
                          },
                        },
                      }}
                    >
                      <TableCell padding="checkbox">
                        <Checkbox
                          checked={selectedRows.includes(inscrito.id)}
                          onChange={() => handleRowSelect(inscrito.id)}
                          sx={{
                            color: '#ADB5BD',
                            '&.Mui-checked': { color: '#6C5CE7' },
                          }}
                        />
                      </TableCell>
                      <TableCell sx={{ fontSize: '0.875rem', color: '#2D3436', fontWeight: 500 }}>
                        {inscrito.nombre}
                      </TableCell>
                      <TableCell sx={{ fontSize: '0.875rem', color: '#495057' }}>
                        {inscrito.dni}
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={inscrito.categoriaId}
                          size="small"
                          sx={{
                            backgroundColor: alpha('#3742FA', 0.1),
                            color: '#3742FA',
                            fontWeight: 500,
                            fontSize: '0.75rem',
                            height: 24,
                          }}
                        />
                      </TableCell>
                      <TableCell align="center">
                        <Button
                          variant="contained"
                          size="small"
                          endIcon={<MoreVertIcon sx={{ fontSize: 16 }} />}
                          sx={{
                            backgroundColor: '#2D3748',
                            color: '#FFFFFF',
                            textTransform: 'none',
                            borderRadius: '6px',
                            px: 2,
                            py: 0.625,
                            fontSize: '0.75rem',
                            fontWeight: 500,
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
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            mt: 2,
            pt: 2,
            borderTop: '1px solid #F1F3F5',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Typography sx={{ fontSize: '0.875rem', color: '#6C757D' }}>Show</Typography>
            <Select
              value={rowsPerPage}
              onChange={handleChangeRowsPerPage}
              size="small"
              sx={{
                borderRadius: '6px',
                fontSize: '0.875rem',
                minWidth: 70,
                '& .MuiSelect-select': {
                  py: 0.5,
                },
              }}
            >
              <MenuItem value={5}>5</MenuItem>
              <MenuItem value={10}>10</MenuItem>
              <MenuItem value={25}>25</MenuItem>
              <MenuItem value={50}>50</MenuItem>
            </Select>
            <Typography sx={{ fontSize: '0.875rem', color: '#6C757D' }}>
              rows for page
            </Typography>
          </Box>

          <TablePagination
            component="div"
            count={filteredInscritos.length}
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
                gap: 0.5,
                '& .MuiIconButton-root': {
                  borderRadius: '6px',
                  color: '#6C757D',
                  fontSize: '0.875rem',
                  padding: '6px 12px',
                  '&:hover': {
                    backgroundColor: alpha('#6C5CE7', 0.08),
                    color: '#6C5CE7',
                  },
                  '&.Mui-disabled': {
                    color: '#CED4DA',
                  },
                },
              },
            }}
          />
        </Box>
      </Paper>
    </Box>
  );
}

