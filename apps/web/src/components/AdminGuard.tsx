'use client';

import { useEffect, useState } from 'react';
import { useAuth, useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { Box, CircularProgress, Typography, Alert } from '@mui/material';
import { UserRole } from '@wtt/common';

interface AdminGuardProps {
  children: React.ReactNode;
}

// Función helper para verificar si Clerk está realmente configurado
function isClerkReallyEnabled(): boolean {
  if (typeof window === 'undefined') {
    // SSR: leer del proceso
    const key = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
    return !!(key && key !== 'pk_test_dummy' && key.length > 20);
  }
  // Cliente: leer de window (Next.js inyecta variables de entorno)
  // En producción, las variables NEXT_PUBLIC_ están disponibles en window
  const key = (window as any).__NEXT_DATA__?.env?.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY 
    || process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
  return !!(key && key !== 'pk_test_dummy' && key.length > 20);
}

export default function AdminGuard({ children }: AdminGuardProps) {
  // Verificar si Clerk está habilitado solo una vez al montar
  const clerkEnabled = isClerkReallyEnabled();
  
  // Si Clerk NO está configurado, permitir acceso inmediatamente sin usar hooks
  if (!clerkEnabled) {
    if (typeof window !== 'undefined') {
      console.warn('⚠️ Clerk no configurado - Modo desarrollo: Permitiendo acceso al panel de administración');
    }
    return <>{children}</>;
  }

  // Solo usar hooks de Clerk si está realmente configurado
  const { isLoaded, isSignedIn } = useAuth();
  const { user } = useUser();
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkAuthorization = async () => {
      if (!isLoaded) return;

      // Si no está autenticado, redirigir al login
      if (!isSignedIn) {
        router.push('/sign-in?redirect=/admin');
        return;
      }

      // Verificar rol del usuario
      if (user) {
        const userRole = user.publicMetadata?.role as string | undefined;

        // Normalizar a minúsculas para comparación
        const normalizedRole = userRole?.toLowerCase();

        // MASTER y ADMIN tienen acceso
        const hasAccess = 
          normalizedRole === 'master' || 
          normalizedRole === 'admin';

        if (!hasAccess) {
          setIsAuthorized(false);
          setIsChecking(false);
          return;
        }

        // TODO: Verificar en backend que el ADMIN está habilitado por un MASTER
        // Por ahora, si tiene el rol, se permite el acceso
        setIsAuthorized(true);
        setIsChecking(false);
      }
    };

    checkAuthorization();
  }, [isLoaded, isSignedIn, user, router]);

  // Mostrar loading mientras se verifica
  if (!isLoaded || isChecking) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          gap: 2,
        }}
      >
        <CircularProgress />
        <Typography variant="body2" color="text.secondary">
          Verificando permisos...
        </Typography>
      </Box>
    );
  }

  // Si no está autorizado, mostrar mensaje
  if (isAuthorized === false) {
    return (
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          p: 4,
        }}
      >
        <Alert severity="error" sx={{ maxWidth: 500 }}>
          <Typography variant="h6" gutterBottom>
            Acceso Denegado
          </Typography>
          <Typography variant="body2">
            No tienes permisos para acceder al panel de administración.
            Contacta a un administrador si necesitas acceso.
          </Typography>
        </Alert>
      </Box>
    );
  }

  // Si está autorizado, mostrar el contenido
  return <>{children}</>;
}

