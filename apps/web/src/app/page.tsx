'use client';

import FeaturedEventBanner from '@/components/FeaturedEventBanner';

export default function Home() {
  // Datos del evento destacado - Confraternidad UNI
  // Crear fecha en zona horaria local de Perú (UTC-5)
  const createLocalDate = (year: number, month: number, day: number, hour: number, minute: number) => {
    // month es 0-indexed en JavaScript (0 = enero, 11 = diciembre)
    return new Date(year, month - 1, day, hour, minute);
  };

  const featuredEvent = {
    name: 'CONFRATERNIDAD UNI',
    // 20 de diciembre 2025 a las 9:30 AM (hora local Perú)
    startDate: createLocalDate(2025, 12, 20, 9, 30),
    endDate: createLocalDate(2025, 12, 20, 18, 0),
    location: 'Av. Tupac Amaru N° 210, Rímac - Lima, Perú',
    venue: 'Antiguo gimnasio UNI',
    prizeMoney: undefined, // No se especifica en el documento
    categories: [
      { name: 'Equipos Mixtos', acronym: 'EM' },
      
    ],
    registrationDeadline: {
      date: createLocalDate(2025, 12, 17, 20, 0),
      whatsapp: '987 682 910',
    },
    draw: {
      date: createLocalDate(2025, 12, 18, 19, 30),
    },
    schedule: {
      publication: createLocalDate(2025, 12, 19, 10, 0),
      competition: createLocalDate(2025, 12, 20, 9, 30),
      awards: 'Al término del evento',
      celebration: 'Al término de la premiación',
    },
     backgroundImage: '/uni-portada.avif', // Descomentar cuando tengas la imagen
  };

  return <FeaturedEventBanner event={featuredEvent} />;
}


