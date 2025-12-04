'use client';

import { Box, Typography, Button, Stack, Paper, Divider, Grid } from '@mui/material';
import { Event, LocalOffer, Schedule, WhatsApp, EmojiEvents } from '@mui/icons-material';
import Image from 'next/image';
import Link from 'next/link';
import CountdownTimer from './CountdownTimer';

interface Category {
  name: string;
  acronym: string;
}

interface FeaturedEventBannerProps {
  event: {
    name: string;
    startDate: Date;
    endDate: Date;
    location: string;
    venue: string;
    prizeMoney?: string;
    categories: Category[];
    registrationDeadline?: {
      date: Date;
      whatsapp: string;
    };
    draw?: {
      date: Date;
    };
    schedule?: {
      publication: Date;
      competition: Date;
      awards: string;
      celebration: string;
    };
    backgroundImage?: string;
  };
}

export default function FeaturedEventBanner({ event }: FeaturedEventBannerProps) {
  const formatDate = (date: Date, includeTime = false) => {
    const options: Intl.DateTimeFormatOptions = {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    };
    if (includeTime) {
      options.hour = '2-digit';
      options.minute = '2-digit';
    }
    return date.toLocaleDateString('es-ES', options);
  };

  const formatDateRange = (start: Date, end: Date) => {
    // Mostrar solo la fecha de inicio con año
    return start.toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const getCategoryAcronym = (category: Category | string): string => {
    if (typeof category === 'string') {
      // Extraer primeras dos letras de las palabras principales
      const words = category.split(' ');
      if (words.length >= 2) {
        return (words[0][0] + words[1][0]).toUpperCase();
      }
      return category.substring(0, 2).toUpperCase();
    }
    return category.acronym;
  };

  const getCategoryName = (category: Category | string): string => {
    return typeof category === 'string' ? category : category.name;
  };

  return (
    <Box
      sx={{
        position: 'relative',
        width: '100%',
        minHeight: { xs: '90vh', md: '85vh' },
        display: 'flex',
        alignItems: 'center',
        overflow: 'hidden',
        background: event.backgroundImage
          ? `url(${event.backgroundImage})`
          : 'linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #1e40af 100%)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.6) 100%)',
          zIndex: 1,
        },
      }}
    >
      {/* Background overlay pattern */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage:
            'radial-gradient(circle at 20% 50%, rgba(124, 58, 237, 0.15) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(37, 99, 235, 0.15) 0%, transparent 50%)',
          zIndex: 2,
        }}
      />

      <Box
        sx={{
          position: 'relative',
          zIndex: 3,
          width: '100%',
          maxWidth: '1400px',
          mx: 'auto',
          px: { xs: 3, md: 6, lg: 8 },
          py: { xs: 6, md: 8 },
        }}
      >
        {/* Content Container */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', lg: '1.2fr 1fr' },
            gap: { xs: 4, md: 6, lg: 8 },
            alignItems: 'flex-start',
          }}
        >
          {/* Left Column - Event Information */}
          <Box>
            {/* Logo Principal - Doyi Sports */}
            <Box
              sx={{
                mb: 2,
                display: 'flex',
                alignItems: 'center',
                // Sin altura fija para que el contenedor se adapte al logo
              }}
            >
              <Image
                src="/logo-wtt.avif"
                alt="Doyi Sports Logo"
                width={280}
                height={112}
                priority
                style={{
                  objectFit: 'contain',
                  height: 'auto',
                  width: 'auto',
                }}
              />
            </Box>

            {/* Date */}
            <Box sx={{ mb: 2 }}>
              <Typography
                variant="body1"
                sx={{
                  color: 'white',
                  fontSize: { xs: '0.95rem', md: '1.1rem' },
                  fontWeight: 500,
                }}
              >
                {formatDateRange(event.startDate, event.endDate)}
              </Typography>
            </Box>

            {/* Event Title */}
            <Typography
              variant="h2"
              component="h1"
              sx={{
                color: 'white',
                fontWeight: 700,
                fontSize: { xs: '2rem', md: '3rem', lg: '3.5rem' },
                lineHeight: 1.1,
                mb: 2,
              }}
            >
              {event.name}
            </Typography>

            {/* Location */}
            <Typography
              variant="h6"
              sx={{
                color: 'rgba(255, 255, 255, 0.9)',
                fontSize: { xs: '1rem', md: '1.25rem' },
                fontWeight: 400,
                mb: 1,
              }}
            >
              {event.venue}
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: 'rgba(255, 255, 255, 0.8)',
                fontSize: { xs: '0.9rem', md: '1rem' },
                fontWeight: 400,
                mb: 4,
              }}
            >
              {event.location}
            </Typography>

            {/* Action Buttons */}
            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              spacing={2}
              sx={{ mb: 3 }}
            >
              <Button
                variant="contained"
                size="large"
                component="a"
                href="/Bases_confraternidad2025.pdf"
                target="_blank"
                rel="noopener noreferrer"
                sx={{
                  backgroundColor: '#f97316',
                  color: 'white',
                  fontWeight: 600,
                  px: 4,
                  py: 1.5,
                  fontSize: '0.95rem',
                  textTransform: 'none',
                  textDecoration: 'none',
                  '&:hover': {
                    backgroundColor: '#ea580c',
                  },
                }}
              >
                INFORMACIÓN
              </Button>
              <Button
                variant="outlined"
                size="large"
                component={Link}
                href="/inscripciones"
                sx={{
                  borderColor: 'white',
                  color: 'white',
                  fontWeight: 600,
                  px: 4,
                  py: 1.5,
                  fontSize: '0.95rem',
                  textTransform: 'none',
                  '&:hover': {
                    borderColor: 'white',
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  },
                }}
                startIcon={<LocalOffer />}
              >
                INSCRIPCIONES
              </Button>
            </Stack>

            {/* Registration Deadline Section - Como nota */}
            {event.registrationDeadline && (
              <Box>
                <Typography
                  variant="h6"
                  sx={{
                    color: 'white',
                    fontWeight: 600,
                    mb: 1.5,
                    fontSize: { xs: '1rem', md: '1.1rem' },
                  }}
                >
                  Cierre de Inscripciones
                </Typography>
                <Box>
                  <Typography
                    sx={{
                      color: 'white',
                      fontWeight: 400,
                      fontSize: { xs: '0.85rem', md: '0.95rem' },
                      lineHeight: 1.3,
                      mb: 0.5,
                    }}
                  >
                    Hasta el <strong>{formatDate(event.registrationDeadline.date, true)}</strong>
                  </Typography>
                  <Typography
                    sx={{
                      color: 'rgba(255, 255, 255, 0.9)',
                      fontWeight: 400,
                      fontSize: { xs: '0.8rem', md: '0.9rem' },
                      lineHeight: 1.3,
                    }}
                  >
                    WhatsApp: <strong>{event.registrationDeadline.whatsapp}</strong>
                  </Typography>
                </Box>
              </Box>
            )}

          </Box>

          {/* Right Column - Countdown, Event Information & Categories */}
          <Box>
            {/* Countdown Timer */}
            <Box
              sx={{
                backgroundColor: 'rgba(0, 0, 0, 0.4)',
                backdropFilter: 'blur(10px)',
                borderRadius: 3,
                p: { xs: 3, md: 4 },
                mb: 4,
                border: '1px solid rgba(255, 255, 255, 0.1)',
                display: 'flex',
                justifyContent: 'center',
                width: '100%',
              }}
            >
              <CountdownTimer targetDate={event.startDate} />
            </Box>

            {/* Categories */}
            <Box>
              <Typography
                variant="h6"
                sx={{
                  color: 'white',
                  fontWeight: 600,
                  mb: 2,
                  fontSize: { xs: '1rem', md: '1.1rem' },
                }}
              >
                Categorías
              </Typography>
              <Grid container spacing={1.5}>
                {event.categories.map((category, index) => {
                  const acronym = getCategoryAcronym(category);
                  const name = getCategoryName(category);
                  return (
                    <Grid item xs={6} key={index}>
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 1,
                          backgroundColor: 'rgba(0, 0, 0, 0.3)',
                          backdropFilter: 'blur(10px)',
                          borderRadius: 2,
                          p: 1,
                          border: '1px solid rgba(255, 255, 255, 0.1)',
                        }}
                      >
                        {/* Circular Badge with Acronym */}
                        <Box
                          sx={{
                            width: { xs: 36, md: 40 },
                            height: { xs: 36, md: 40 },
                            borderRadius: '50%',
                            backgroundColor: '#2563EB',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0,
                          }}
                        >
                          <Typography
                            sx={{
                              color: 'white',
                              fontWeight: 700,
                              fontSize: { xs: '0.75rem', md: '0.85rem' },
                            }}
                          >
                            {acronym}
                          </Typography>
                        </Box>
                        {/* Category Name */}
                        <Typography
                          sx={{
                            color: 'white',
                            fontWeight: 500,
                            fontSize: { xs: '0.75rem', md: '0.85rem' },
                            flex: 1,
                            lineHeight: 1.2,
                          }}
                        >
                          {name}
                        </Typography>
                      </Box>
                    </Grid>
                  );
                })}
              </Grid>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

