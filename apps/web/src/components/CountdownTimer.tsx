'use client';

import { useState, useEffect } from 'react';
import { Box, Typography } from '@mui/material';

interface CountdownTimerProps {
  targetDate: Date | string;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export default function CountdownTimer({ targetDate }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      try {
        // Asegurarnos de que tenemos una fecha válida
        let target: Date;
        
        if (targetDate instanceof Date) {
          target = new Date(targetDate.getTime());
        } else if (typeof targetDate === 'string') {
          target = new Date(targetDate);
        } else {
          target = new Date(targetDate);
        }
        
        const now = new Date();
        
        // Verificar que la fecha sea válida
        if (isNaN(target.getTime())) {
          console.error('Invalid target date:', targetDate);
          setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
          return;
        }

        const difference = target.getTime() - now.getTime();

        if (difference > 0) {
          const totalSeconds = Math.floor(difference / 1000);
          const days = Math.floor(totalSeconds / (60 * 60 * 24));
          const hours = Math.floor((totalSeconds % (60 * 60 * 24)) / (60 * 60));
          const minutes = Math.floor((totalSeconds % (60 * 60)) / 60);
          const seconds = totalSeconds % 60;

          setTimeLeft({ days, hours, minutes, seconds });
        } else {
          // Si la fecha ya pasó, mostrar ceros
          setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        }
      } catch (error) {
        console.error('Error calculating countdown:', error);
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    // Calcular inmediatamente
    calculateTimeLeft();
    
    // Actualizar cada segundo
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  const timeUnits = [
    { label: 'Días', value: timeLeft.days },
    { label: 'Horas', value: timeLeft.hours },
    { label: 'Minutos', value: timeLeft.minutes },
    { label: 'Segundos', value: timeLeft.seconds },
  ];

  return (
    <Box
      sx={{
        display: 'flex',
        gap: { xs: 2, md: 3 },
        flexWrap: 'wrap',
        justifyContent: 'center',
        width: '100%',
      }}
    >
      {timeUnits.map((unit) => (
        <Box
          key={unit.label}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            flex: '1 1 auto',
            minWidth: { xs: '60px', md: '80px' },
            maxWidth: { xs: '80px', md: '100px' },
          }}
        >
          <Typography
            variant="h4"
            component="div"
            sx={{
              fontWeight: 700,
              color: 'white',
              fontSize: { xs: '1.75rem', md: '2.5rem' },
              lineHeight: 1,
            }}
          >
            {unit.value.toString().padStart(2, '0')}
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: 'rgba(255, 255, 255, 0.9)',
              fontSize: { xs: '0.75rem', md: '0.875rem' },
              mt: 0.5,
              textTransform: 'uppercase',
            }}
          >
            {unit.label}
          </Typography>
        </Box>
      ))}
    </Box>
  );
}

