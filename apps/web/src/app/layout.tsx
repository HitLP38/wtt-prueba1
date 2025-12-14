import { Inter } from 'next/font/google';
import { ClerkProvider } from '@clerk/nextjs';
import { Box } from '@mui/material';
import ThemeProvider from '@/components/ThemeProvider';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'WTT - Plataforma de Torneos',
  description: 'Plataforma Integral de Gestión de Torneos de Tenis de Mesa',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const clerkPublishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
  const isClerkEnabled = clerkPublishableKey && 
    clerkPublishableKey !== 'pk_test_dummy' && 
    clerkPublishableKey.length > 20;

  return (
    <html lang="es">
      <body className={inter.className}>
        <ThemeProvider>
          {isClerkEnabled ? (
            <ClerkProvider publishableKey={clerkPublishableKey}>
              {children}
            </ClerkProvider>
          ) : (
            <>{children}</>
          )}
        </ThemeProvider>
      </body>
    </html>
  );
}
