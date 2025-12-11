// Middleware condicional: solo activa Clerk si está configurado
const clerkPublishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

export default clerkPublishableKey
  ? require('@clerk/nextjs').authMiddleware({
      // Rutas públicas que no requieren autenticación
      publicRoutes: [
        '/',
        '/events(.*)',
        '/inscripciones(.*)',
        '/news(.*)',
        '/videos(.*)',
        '/players(.*)',
        '/rankings(.*)',
        '/watch(.*)',
        '/sign-in(.*)',
        '/sign-up(.*)',
        '/api/public(.*)',
      ],
      // Rutas que requieren autenticación
      protectedRoutes: [
        '/admin(.*)',
        '/referee(.*)',
      ],
      // Ignorar rutas estáticas
      ignoredRoutes: ['/_next(.*)', '/static(.*)', '/(.*\\.(?!html$|json$))'],
    })
  : () => {
      // Middleware vacío si Clerk no está configurado (modo desarrollo)
      return;
    };

export const config = {
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
};

