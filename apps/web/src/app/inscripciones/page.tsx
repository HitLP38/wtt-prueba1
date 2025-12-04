'use client';

import { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  TextField,
  MenuItem,
  Button,
  Paper,
  Stack,
  Card,
  Modal,
  Fade,
  Slide,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Divider,
  Alert,
  Chip,
  RadioGroup,
  FormControlLabel,
  Radio,
  FormControl,
} from '@mui/material';
import {
  CheckCircle as CheckCircleIcon,
  ArrowBack as ArrowBackIcon,
  ArrowForward as ArrowForwardIcon,
  ExpandMore as ExpandMoreIcon,
} from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

interface TeamMember {
  id: string;
  nombreCompleto: string;
  condicion: string;
}

const condiciones = [
  { value: 'alumno', label: 'Alumno', color: '#2563EB' },
  { value: 'egresado', label: 'Egresado', color: '#7C3AED' },
  { value: 'FDPTM', label: 'FDPTM', color: '#06B6D4' },
  { value: 'externo', label: 'Externo', color: '#64748B' },
  { value: 'otros', label: 'Otros', color: '#94A3B8' },
];

const getCondicionColor = (condicion: string) => {
  const found = condiciones.find((c) => c.value === condicion);
  return found?.color || '#64748B';
};

type Step = 'selectCount' | 'registerPlayers' | 'summary' | 'success';

export default function InscripcionesPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>('selectCount');
  const [playerCount, setPlayerCount] = useState(4);
  const [teamName, setTeamName] = useState('');
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [expandedAccordion, setExpandedAccordion] = useState<string | false>(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const handleRegisterClick = () => {
    // Inicializar el array de jugadores
    const members: TeamMember[] = Array.from({ length: playerCount }, (_, i) => ({
      id: `player-${i}`,
      nombreCompleto: '',
      condicion: '',
    }));
    setTeamMembers(members);
    setStep('registerPlayers');
    // Expandir el primer acordeón
    setExpandedAccordion('player-0');
  };

  const updateMember = (index: number, field: keyof TeamMember, value: string) => {
    const updated = [...teamMembers];
    updated[index] = { ...updated[index], [field]: value };
    setTeamMembers(updated);
  };

  const handleAccordionChange = (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
    setExpandedAccordion(isExpanded ? panel : false);
  };

  const handleGoToSummary = () => {
    setStep('summary');
  };

  const handleGoBackToForm = () => {
    setStep('registerPlayers');
  };

  const handleGoBackToSelectCount = () => {
    setStep('selectCount');
  };

  const handleNextPlayer = () => {
    const currentIndex = teamMembers.findIndex((m) => m.id === expandedAccordion);
    if (currentIndex >= 0 && currentIndex < teamMembers.length - 1) {
      setExpandedAccordion(teamMembers[currentIndex + 1].id);
    }
  };

  const handlePreviousPlayer = () => {
    const currentIndex = teamMembers.findIndex((m) => m.id === expandedAccordion);
    if (currentIndex > 0) {
      setExpandedAccordion(teamMembers[currentIndex - 1].id);
    }
  };

  const validateBusinessRules = () => {
    const errors: string[] = [];
    const alumnos = teamMembers.filter((m) => m.condicion === 'alumno').length;
    const egresados = teamMembers.filter((m) => m.condicion === 'egresado').length;
    const fdptm = teamMembers.filter((m) => m.condicion === 'FDPTM').length;

    if (alumnos < 1) {
      errors.push('Debe haber al menos 1 alumno UNI en el equipo');
    }
    if (egresados < 1) {
      errors.push('Debe haber al menos 1 egresado UNI en el equipo');
    }
    if (fdptm > 1) {
      errors.push('Solo puede haber máximo 1 deportista FDPTM por equipo');
    }

    return errors;
  };

  const handleSubmit = () => {
    // Validar que todos los jugadores estén completos
    const allComplete = teamMembers.every(
      (m) => m.nombreCompleto.trim() && m.condicion
    );

    const businessErrors = validateBusinessRules();

    if (!allComplete || businessErrors.length > 0) {
      return;
    }

    // Enviar inscripción
    console.log('Inscripción válida:', { teamName, teamMembers });
    setShowSuccessModal(true);
  };

  const handleCloseSuccess = () => {
    setShowSuccessModal(false);
    router.push('/events');
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        position: 'relative',
        py: 4,
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
      }}
    >
      {/* Background Image */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: 0,
          '&::after': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            backdropFilter: 'blur(2px)',
          },
        }}
      >
        <Image
          src="/fondo_forms_confraternidad2025.avif"
          alt="Background"
          fill
          style={{ objectFit: 'cover' }}
          priority
        />
      </Box>

      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        {/* Paso 1: Seleccionar número de jugadores */}
        {step === 'selectCount' && (
          <Fade in={step === 'selectCount'} timeout={500}>
            <Box>
              <Paper
                elevation={8}
                sx={{
                  p: 4,
                  borderRadius: 3,
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  backdropFilter: 'blur(10px)',
                  maxWidth: 700,
                  mx: 'auto',
                }}
              >
                <Typography
                  variant="h4"
                  sx={{ fontWeight: 700, mb: 3, textAlign: 'center' }}
                >
                  Form
                </Typography>

                <Stack spacing={3} sx={{ mb: 4 }}>
                  {/* Nombre del Equipo */}
                  <TextField
                    label="Nombre del equipo"
                    fullWidth
                    required
                    value={teamName}
                    onChange={(e) => setTeamName(e.target.value)}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                      },
                    }}
                  />

                  {/* Número de jugadores con Radio Buttons */}
                  <Stack spacing={3} direction={{ xs: 'column', sm: 'row' }} alignItems="flex-end">
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="body1" sx={{ mb: 1, fontWeight: 500 }}>
                        Numero de jugadores
                      </Typography>
                      <FormControl component="fieldset" fullWidth>
                        <RadioGroup
                          row
                          value={playerCount.toString()}
                          onChange={(e) => setPlayerCount(parseInt(e.target.value))}
                          sx={{
                            '& .MuiFormControlLabel-root': {
                              marginRight: 3,
                            },
                          }}
                        >
                          <FormControlLabel
                            value="4"
                            control={<Radio />}
                            label="4"
                            sx={{
                              '& .MuiRadio-root': {
                                color: '#7C3AED',
                              },
                              '& .Mui-checked': {
                                color: '#7C3AED',
                              },
                            }}
                          />
                          <FormControlLabel
                            value="5"
                            control={<Radio />}
                            label="5"
                            sx={{
                              '& .MuiRadio-root': {
                                color: '#7C3AED',
                              },
                              '& .Mui-checked': {
                                color: '#7C3AED',
                              },
                            }}
                          />
                        </RadioGroup>
                      </FormControl>
                    </Box>

                    <Button
                      variant="contained"
                      onClick={handleRegisterClick}
                      size="large"
                      disabled={!teamName.trim()}
                      sx={{
                        borderRadius: 2,
                        textTransform: 'none',
                        fontWeight: 600,
                        px: 4,
                        py: 1.5,
                        minWidth: 150,
                        background: 'linear-gradient(90deg, #7C3AED 0%, #2563EB 100%)',
                      }}
                    >
                      Siguiente
                    </Button>
                  </Stack>
                </Stack>

                {/* Notas dentro del form como texto simple */}
                <Divider sx={{ my: 3 }} />
                <Box sx={{ mt: 3 }}>
                  <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
                    • Alumno: Alumno UNI
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
                    • Egresado: Egresado UNI
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
                    • FDPTM: Deportista selección FDPTM: Máximo 1 por equipo (Deportista selección o
                    preselección categoría mayor en los últimos 3 años, de haber pertenecido antes
                    esta categorización quedará a criterio de la comisión organizadora).
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600, mt: 2, mb: 1 }}>
                    Requisitos del Equipo:
                  </Typography>
                  <Box sx={{ ml: 2 }}>
                    <Typography variant="body2">• Mínimo 1 alumno UNI</Typography>
                    <Typography variant="body2">• Mínimo 1 egresado UNI</Typography>
                    <Typography variant="body2">• Máximo 1 deportista FDPTM</Typography>
                    <Typography variant="body2">• Máximo 5 integrantes</Typography>
                  </Box>
                </Box>
              </Paper>
            </Box>
          </Fade>
        )}

        {/* Paso 2: Registrar todos los jugadores con acordeón */}
        {step === 'registerPlayers' && (
          <Slide direction="left" in={step === 'registerPlayers'} mountOnEnter unmountOnExit>
            <Box>
              <Paper
                elevation={8}
                sx={{
                  p: 4,
                  borderRadius: 3,
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  backdropFilter: 'blur(10px)',
                  maxWidth: 700,
                  mx: 'auto',
                }}
              >
                <Typography
                  variant="h4"
                  sx={{ fontWeight: 700, mb: 3, textAlign: 'center' }}
                >
                  Form
                </Typography>

                <Stack spacing={2} sx={{ width: '100%' }}>
                  {teamMembers.map((member, index) => {
                    const condicionColor = getCondicionColor(member.condicion);
                    const panelId = member.id;

                    return (
                      <Box key={member.id} sx={{ width: '100%' }}>
                        <Accordion
                          expanded={expandedAccordion === panelId}
                          onChange={handleAccordionChange(panelId)}
                          sx={{
                            borderRadius: '8px !important',
                            boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
                            '&:before': {
                              display: 'none',
                            },
                            '&.Mui-expanded': {
                              margin: '0 !important',
                              marginBottom: '16px !important',
                            },
                            marginBottom: '16px',
                            '&:last-of-type': {
                              marginBottom: '0 !important',
                            },
                          }}
                        >
                          <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            sx={{
                              borderRadius: expandedAccordion === panelId ? '8px 8px 0 0' : '8px',
                              minHeight: 56,
                              '&.Mui-expanded': {
                                minHeight: 56,
                              },
                              '& .MuiAccordionSummary-content': {
                                margin: '16px 0',
                                '&.Mui-expanded': {
                                  margin: '16px 0',
                                },
                              },
                            }}
                          >
                            <Box
                              sx={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 2,
                                width: '100%',
                              }}
                            >
                              <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                                Registre jugador {index + 1}
                              </Typography>
                              {member.nombreCompleto.trim() && member.condicion && (
                                <Chip
                                  label={
                                    condiciones.find((c) => c.value === member.condicion)?.label || ''
                                  }
                                  size="small"
                                  sx={{
                                    backgroundColor: condicionColor,
                                    color: 'white',
                                    fontWeight: 600,
                                    height: 24,
                                  }}
                                />
                              )}
                            </Box>
                          </AccordionSummary>
                          <AccordionDetails sx={{ pt: 2, pb: 3 }}>
                            <Stack spacing={3}>
                              <TextField
                                label="Nombre completo"
                                fullWidth
                                required
                                value={member.nombreCompleto}
                                onChange={(e) =>
                                  updateMember(index, 'nombreCompleto', e.target.value)
                                }
                                sx={{
                                  '& .MuiOutlinedInput-root': {
                                    borderRadius: 2,
                                  },
                                }}
                              />

                              <TextField
                                label="Condicion"
                                select
                                fullWidth
                                required
                                value={member.condicion}
                                onChange={(e) => updateMember(index, 'condicion', e.target.value)}
                                sx={{
                                  '& .MuiOutlinedInput-root': {
                                    borderRadius: 2,
                                    '&.Mui-focused fieldset': {
                                      borderColor: condicionColor,
                                    },
                                  },
                                }}
                              >
                                {condiciones.map((option) => (
                                  <MenuItem key={option.value} value={option.value}>
                                    {option.label}
                                  </MenuItem>
                                ))}
                              </TextField>
                            </Stack>
                          </AccordionDetails>
                        </Accordion>
                      </Box>
                    );
                  })}
                </Stack>

                {/* Alertas de Validación */}
                {(() => {
                  const allComplete = teamMembers.every(
                    (m) => m.nombreCompleto.trim() && m.condicion
                  );
                  const businessErrors = allComplete ? validateBusinessRules() : [];

                  if (businessErrors.length > 0) {
                    return (
                      <Box sx={{ mt: 3 }}>
                        {businessErrors.map((error, idx) => (
                          <Alert key={idx} severity="error" sx={{ mb: 1, borderRadius: 2 }}>
                            {error}
                          </Alert>
                        ))}
                      </Box>
                    );
                  }
                  return null;
                })()}

                {/* Botones de Navegación */}
                <Stack direction="row" spacing={2} sx={{ mt: 3 }}>
                  <Button
                    variant="outlined"
                    startIcon={<ArrowBackIcon />}
                    onClick={handleGoBackToSelectCount}
                    sx={{
                      borderRadius: 2,
                      textTransform: 'none',
                      fontWeight: 600,
                      py: 1.5,
                      flex: 1,
                    }}
                  >
                    Anterior
                  </Button>
                  {(() => {
                    const allComplete = teamMembers.every(
                      (m) => m.nombreCompleto.trim() && m.condicion
                    );
                    const businessErrors = allComplete ? validateBusinessRules() : [];
                    const canProceed = allComplete && businessErrors.length === 0;

                    // Si todo está completo y sin errores, mostrar "Ver Resumen"
                    if (canProceed) {
                      return (
                        <Button
                          variant="contained"
                          onClick={handleGoToSummary}
                          size="large"
                          sx={{
                            borderRadius: 2,
                            textTransform: 'none',
                            fontWeight: 600,
                            py: 1.5,
                            flex: 1,
                          }}
                        >
                          Ver Resumen
                        </Button>
                      );
                    }

                    // Si no está completo, mostrar "Siguiente" para navegar entre jugadores
                    const currentIndex = expandedAccordion
                      ? teamMembers.findIndex((m) => m.id === expandedAccordion)
                      : -1;
                    const isLastPlayer = currentIndex >= teamMembers.length - 1;

                    return (
                      <Button
                        variant="outlined"
                        endIcon={<ArrowForwardIcon />}
                        onClick={() => {
                          if (expandedAccordion && !isLastPlayer) {
                            handleNextPlayer();
                          } else if (!expandedAccordion && teamMembers.length > 0) {
                            // Si no hay acordeón desplegado, expandir el primero
                            setExpandedAccordion(teamMembers[0].id);
                          }
                        }}
                        disabled={teamMembers.length === 0}
                        sx={{
                          borderRadius: 2,
                          textTransform: 'none',
                          fontWeight: 600,
                          py: 1.5,
                          flex: 1,
                        }}
                      >
                        Siguiente
                      </Button>
                    );
                  })()}
                </Stack>
              </Paper>
            </Box>
          </Slide>
        )}

        {/* Paso Final: Resumen */}
        {step === 'summary' && (
          <Slide direction="left" in={step === 'summary'} mountOnEnter unmountOnExit>
            <Box>
              <Paper
                elevation={8}
                sx={{
                  p: 4,
                  borderRadius: 3,
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  backdropFilter: 'blur(10px)',
                  maxWidth: 700,
                  mx: 'auto',
                }}
              >
                {/* Información del Equipo - Recuadro Azul Claro */}
                <Box
                  sx={{
                    backgroundColor: '#E3F2FD',
                    borderRadius: 2,
                    p: 2.5,
                    mb: 3,
                  }}
                >
                  <Typography
                    variant="h5"
                    sx={{
                      fontWeight: 600,
                      mb: 0.5,
                      fontSize: '1.5rem',
                      color: '#1976D2',
                    }}
                  >
                    {teamName}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      fontSize: '0.875rem',
                      color: '#666',
                    }}
                  >
                    Cantidad de integrantes : {teamMembers.length}
                  </Typography>
                </Box>

                {/* Lista de Jugadores */}
                <Stack spacing={2} sx={{ mb: 4 }}>
                  {teamMembers.map((member, index) => {
                    const condicionLabel = condiciones.find((c) => c.value === member.condicion)?.label || '';
                    const condicionColor = getCondicionColor(member.condicion);
                    return (
                      <Box
                        key={member.id}
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          gap: 1,
                        }}
                      >
                        <Typography
                          variant="body1"
                          sx={{
                            fontWeight: 500,
                            fontSize: '1rem',
                            color: '#333',
                            flex: 1,
                          }}
                        >
                          {index + 1} {member.nombreCompleto || `Nombre del jugador ${index + 1}`}
                        </Typography>
                        {member.condicion && (
                          <Chip
                            label={condicionLabel}
                            size="small"
                            sx={{
                              backgroundColor: condicionColor,
                              color: 'white',
                              fontWeight: 500,
                              borderRadius: '12px',
                              minWidth: 90,
                              height: 32,
                            }}
                          />
                        )}
                      </Box>
                    );
                  })}
                </Stack>

                {/* Botones de Navegación */}
                <Stack direction="row" spacing={2}>
                  <Button
                    variant="outlined"
                    onClick={handleGoBackToForm}
                    sx={{
                      borderRadius: 2,
                      textTransform: 'none',
                      fontWeight: 600,
                      py: 1.5,
                      flex: 1,
                      borderColor: '#E0E0E0',
                      color: '#666',
                      backgroundColor: '#F5F5F5',
                      '&:hover': {
                        borderColor: '#BDBDBD',
                        backgroundColor: '#EEEEEE',
                      },
                    }}
                  >
                    Anterior
                  </Button>
                  <Button
                    variant="contained"
                    onClick={handleSubmit}
                    sx={{
                      borderRadius: 2,
                      textTransform: 'none',
                      fontWeight: 600,
                      py: 1.5,
                      flex: 1,
                      backgroundColor: '#424242',
                      color: 'white',
                      '&:hover': {
                        backgroundColor: '#616161',
                      },
                    }}
                  >
                    Registrar
                  </Button>
                </Stack>
              </Paper>
            </Box>
          </Slide>
        )}

        {/* Modal de Éxito */}
        <Modal
          open={showSuccessModal}
          onClose={handleCloseSuccess}
          closeAfterTransition
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Fade in={showSuccessModal}>
            <Paper
              elevation={24}
              sx={{
                p: 6,
                borderRadius: 3,
                backgroundColor: 'white',
                maxWidth: 400,
                mx: 'auto',
                textAlign: 'center',
                outline: 'none',
              }}
            >
              <Box
                sx={{
                  width: 100,
                  height: 100,
                  borderRadius: '50%',
                  backgroundColor: '#7C3AED',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mx: 'auto',
                  mb: 3,
                }}
              >
                <CheckCircleIcon sx={{ fontSize: 60, color: 'white' }} />
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 700, mb: 2 }}>
                REGISTRO EXITOSO
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
                Tu equipo ha sido registrado correctamente
              </Typography>
              <Button
                variant="contained"
                onClick={handleCloseSuccess}
                fullWidth
                sx={{
                  borderRadius: 2,
                  textTransform: 'none',
                  fontWeight: 600,
                  py: 1.5,
                }}
              >
                Continuar
              </Button>
            </Paper>
          </Fade>
        </Modal>
      </Container>
    </Box>
  );
}
