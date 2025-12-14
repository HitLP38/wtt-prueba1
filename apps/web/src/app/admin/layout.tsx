'use client';

import React, { useState } from 'react';
import { Box, Toolbar, Container } from '@mui/material';
import AdminSidebar from '@/components/AdminSidebar';
import AdminHeader from '@/components/AdminHeader';
import AdminGuard from '@/components/AdminGuard';
import { usePathname } from 'next/navigation';

const pageTitles: Record<string, string> = {
  '/admin/dashboard': 'Dashboard',
  '/admin/sistema': 'Sistema',
  '/admin/mesas': 'Mesas',
  '/admin/sorteos': 'Sorteos',
  '/admin/torneos': 'Torneos',
  '/admin/participantes': 'Participantes',
  '/admin/materiales': 'Materiales',
  '/admin/arbitros': 'Arbitros',
  '/admin/costos': 'Costos',
  '/admin/configuracion-evento': 'Configuración',
  '/admin/tabla-horaria': 'Tabla Horaria',
  '/admin/logistica/materiales': 'Materiales',
  '/admin/logistica/personal': 'Personal',
  '/admin/ranking/internacional': 'Ranking Internacional',
  '/admin/ranking/nacional': 'Ranking Nacional',
  '/admin/sorteos/config': 'Configuración Sorteo',
  '/admin/analisis/participantes': 'Análisis Participantes',
  '/admin/analisis/financiero': 'Análisis Financiero',
  '/admin/analisis/tiempos': 'Análisis Tiempos',
  '/admin/partidos/inscritos': 'Inscritos',
  '/admin/partidos/series/generar': 'Series - Generar',
  '/admin/partidos/series/visualizaciones': 'Series - Visualizaciones',
  '/admin/partidos/llaves/generar': 'Llaves - Generar',
  '/admin/partidos/llaves/visualizaciones': 'Llaves - Visualizaciones',
  '/admin/partidos/resultados/series': 'Resultados - Series',
  '/admin/partidos/resultados/llaves': 'Resultados - Llaves',
  '/admin/asistencia/personal': 'Asistencia Personal',
  '/admin/costos/personal': 'Costos Personal',
  '/admin/costos/materiales': 'Costos Materiales',
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(true); // Siempre abierto
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const pathname = usePathname();
  const pageTitle = pageTitles[pathname] || 'Admin';
  const sidebarWidth = sidebarCollapsed ? 64 : 240; // Debe coincidir con drawerWidth en AdminSidebar.tsx

  const handleMenuClick = () => {
    setSidebarCollapsed(!sidebarCollapsed); // Cambia entre contraído y expandido
  };

  return (
    // AdminGuard deshabilitado temporalmente - habilitar cuando se configure Clerk
    // <AdminGuard>
      <Box
        sx={{
          display: 'flex',
          minHeight: '100vh',
          backgroundColor: '#F8F9FA',
          position: 'relative',
        }}
      >
        <AdminHeader onMenuClick={handleMenuClick} pageTitle={pageTitle} />
        <AdminSidebar
          open={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          variant="persistent"
          collapsed={sidebarCollapsed}
          onCollapseChange={setSidebarCollapsed}
          sectionTitle={pageTitle}
        />
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            backgroundColor: '#F8F9FA',
            minHeight: '100vh',
            pt: '70px', // Altura del header (aumentada)
            overflow: 'auto',
          }}
        >
          <Container 
            maxWidth={false} 
            sx={{ 
              p: 2.5, // 20px de padding (2.5 * 8 = 20px)
              height: '100%',
            }}
          >
            {children}
          </Container>
        </Box>
      </Box>
    // </AdminGuard>
  );
}

