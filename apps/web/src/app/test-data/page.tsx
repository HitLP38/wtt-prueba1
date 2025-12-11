'use client';

import { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Alert,
  Stack,
  Divider,
} from '@mui/material';
import { TableChart, Person, Event, SportsTennis } from '@mui/icons-material';

interface EventSummary {
  id: string;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  venue?: string;
  address?: string;
  isActive: boolean;
}

interface TableSummary {
  id: string;
  tableNumber: number;
  status: string;
  location?: string;
  isActive: boolean;
}

interface EventRefereeSummary {
  id: string;
  isActive: boolean;
  refereeId: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
const EVENT_ID = '550e8400-e29b-41d4-a716-446655440000';

export default function TestDataPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [events, setEvents] = useState<EventSummary[]>([]);
  const [tables, setTables] = useState<TableSummary[]>([]);
  const [referees, setReferees] = useState<EventRefereeSummary[]>([]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available':
        return 'success';
      case 'in_progress':
        return 'warning';
      case 'delayed':
        return 'error';
      case 'locked':
        return 'default';
      default:
        return 'info';
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [dashboardRes, refereesRes] = await Promise.all([
        fetch(`${API_URL}/api/admin/dashboard?eventId=${EVENT_ID}`),
        fetch(`${API_URL}/api/admin/events/${EVENT_ID}/referees`),
      ]);

      if (!dashboardRes.ok) {
        throw new Error(`Error al cargar dashboard: ${dashboardRes.status}`);
      }
      if (!refereesRes.ok) {
        throw new Error(`Error al cargar árbitros: ${refereesRes.status}`);
      }

      const dashboardData = await dashboardRes.json();
      const refereesData = await refereesRes.json();

      setEvents([dashboardData.event]);
      setTables(dashboardData.tables || []);
      setReferees(
        (refereesData || []).map((r: any) => ({
          id: r.id,
          refereeId: r.refereeId,
          isActive: r.isEnabled,
        })),
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar datos');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 4, fontWeight: 600 }}>
        🧪 Página de Prueba - Datos en vivo desde el backend
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Stack spacing={4}>
        {/* Eventos */}
        <Paper elevation={3} sx={{ p: 3 }}>
          <Box display="flex" alignItems="center" gap={1} mb={2}>
            <Event color="primary" />
            <Typography variant="h5" fontWeight={600}>
              Evento
            </Typography>
            <Chip label={events.length} color="primary" size="small" />
          </Box>
          <Divider sx={{ mb: 2 }} />
          <Grid container spacing={2}>
            {events.map((event) => (
              <Grid item xs={12} key={event.id}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      {event.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" paragraph>
                      {event.description}
                    </Typography>
                    <Stack spacing={0.5}>
                      <Typography variant="body2">
                        <strong>Inicio:</strong>{' '}
                        {new Date(event.startDate).toLocaleString('es-PE')}
                      </Typography>
                      <Typography variant="body2">
                        <strong>Fin:</strong>{' '}
                        {new Date(event.endDate).toLocaleString('es-PE')}
                      </Typography>
                      {event.venue && (
                        <Typography variant="body2">
                          <strong>Lugar:</strong> {event.venue}
                        </Typography>
                      )}
                      {event.address && (
                        <Typography variant="body2">
                          <strong>Dirección:</strong> {event.address}
                        </Typography>
                      )}
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Paper>

        {/* Mesas */}
        <Paper elevation={3} sx={{ p: 3 }}>
          <Box display="flex" alignItems="center" gap={1} mb={2}>
            <TableChart color="primary" />
            <Typography variant="h5" fontWeight={600}>
              Mesas
            </Typography>
            <Chip label={tables.length} color="primary" size="small" />
          </Box>
          <Divider sx={{ mb: 2 }} />
          <Grid container spacing={2}>
            {tables.map((table) => (
              <Grid item xs={12} sm={6} md={4} key={table.id}>
                <Card variant="outlined">
                  <CardContent>
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                      <Typography variant="h6">
                        Mesa {table.tableNumber}
                      </Typography>
                      <Chip
                        label={table.status}
                        color={getStatusColor(table.status) as any}
                        size="small"
                      />
                    </Box>
                    {table.location && (
                      <Typography variant="body2" color="text.secondary">
                        {table.location}
                      </Typography>
                    )}
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Paper>

        {/* Árbitros del evento */}
        <Paper elevation={3} sx={{ p: 3 }}>
          <Box display="flex" alignItems="center" gap={1} mb={2}>
            <Person color="primary" />
            <Typography variant="h5" fontWeight={600}>
              Árbitros del evento
            </Typography>
            <Chip label={referees.length} color="primary" size="small" />
          </Box>
          <Divider sx={{ mb: 2 }} />
          <Grid container spacing={2}>
            {referees.map((referee, index) => (
              <Grid item xs={12} sm={6} md={4} key={referee.id}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Árbitro {index + 1}
                    </Typography>
                    <Stack spacing={0.5}>
                      <Typography variant="body2" color="text.secondary">
                        ID referencia: {referee.refereeId}
                      </Typography>
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Paper>
      </Stack>

      <Alert severity="info" sx={{ mt: 4 }}>
        <Typography variant="body2">
          <strong>Nota:</strong> Esta página ya está conectada al backend del VPS usando los
          endpoints de admin. Si cambias los datos en la base de datos, se reflejarán aquí.
        </Typography>
      </Alert>
    </Container>
  );
}

