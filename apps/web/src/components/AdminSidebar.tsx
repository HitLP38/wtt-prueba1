'use client';

import React, { useState, useEffect } from 'react';
import {
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Box,
  Typography,
  Collapse,
  Tooltip,
  IconButton,
  Popover,
  Paper,
  alpha,
} from '@mui/material';
import {
  Settings as SettingsIcon,
  EmojiEvents as TorneosIcon,
  Schedule as ScheduleIcon,
  Inventory as MaterialesIcon,
  People as PersonalIcon,
  Casino as SorteosIcon,
  TrendingUp as RankingIcon,
  Public as InternacionalIcon,
  Flag as NacionalIcon,
  Assessment as AnalisisIcon,
  AccountBalance as FinancieroIcon,
  AccessTime as TiemposIcon,
  SportsTennis as PartidosIcon,
  HowToReg as InscritosIcon,
  Timeline as SeriesIcon,
  AccountTree as LlavesIcon,
  Score as ResultadosIcon,
  Badge as AsistenciaIcon,
  AttachMoney as CostosIcon,
  Square as MesasIcon,
  ExpandMore,
  ChevronRight,
  KeyboardArrowLeft,
} from '@mui/icons-material';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const drawerWidth = 240; // Ancho del sidebar cuando está expandido
const drawerWidthCollapsed = 64;

interface MenuItem {
  label: string;
  icon: React.ElementType;
  href?: string;
  children?: MenuItem[];
}

interface MenuSection {
  title: string;
  items: MenuItem[];
}

const menuSections: MenuSection[] = [
  {
    title: 'Evento',
    items: [
      { label: 'Torneos', icon: TorneosIcon, href: '/admin/torneos' },
      { label: 'Configuración', icon: SettingsIcon, href: '/admin/sistema' },
      { label: 'Tabla horaria', icon: ScheduleIcon, href: '/admin/tabla-horaria' },
      {
        label: 'Logistica',
        icon: MaterialesIcon,
        children: [
          { label: 'materiales', icon: MaterialesIcon, href: '/admin/materiales' },
          { label: 'Personal', icon: PersonalIcon, href: '/admin/personal' },
        ],
      },
    ],
  },
  {
    title: 'Sorteo',
    items: [
      {
        label: 'Ranking',
        icon: RankingIcon,
        children: [
          { label: 'Internacional', icon: InternacionalIcon, href: '/admin/ranking/internacional' },
          { label: 'Nacional', icon: NacionalIcon, href: '/admin/ranking/nacional' },
        ],
      },
      { label: 'Configuración', icon: SettingsIcon, href: '/admin/sorteos/config' },
    ],
  },
  {
    title: 'Dashboard',
    items: [
      { label: 'Mesas', icon: MesasIcon, href: '/admin/mesas' },
      {
        label: 'Análisis',
        icon: AnalisisIcon,
        children: [
          { label: 'participantes', icon: PersonalIcon, href: '/admin/analisis/participantes' },
          { label: 'financiero', icon: FinancieroIcon, href: '/admin/analisis/financiero' },
          { label: 'Tiempos', icon: TiemposIcon, href: '/admin/analisis/tiempos' },
        ],
      },
    ],
  },
  {
    title: 'Partidos',
    items: [
      { label: 'Inscritos', icon: InscritosIcon, href: '/admin/partidos/inscritos' },
      {
        label: 'Series',
        icon: SeriesIcon,
        children: [
          { label: 'Generar', icon: SettingsIcon, href: '/admin/partidos/series/generar' },
          { label: 'Visualizaciones', icon: AnalisisIcon, href: '/admin/partidos/series/visualizaciones' },
        ],
      },
      {
        label: 'Llaves',
        icon: LlavesIcon,
        children: [
          { label: 'Generar', icon: SettingsIcon, href: '/admin/partidos/llaves/generar' },
          { label: 'Visualizaciones', icon: AnalisisIcon, href: '/admin/partidos/llaves/visualizaciones' },
        ],
      },
      {
        label: 'Resultados',
        icon: ResultadosIcon,
        children: [
          { label: 'Series', icon: SeriesIcon, href: '/admin/partidos/resultados/series' },
          { label: 'Llaves', icon: LlavesIcon, href: '/admin/partidos/resultados/llaves' },
        ],
      },
    ],
  },
  {
    title: 'ASISTENCIA',
    items: [
      { label: 'Personal', icon: AsistenciaIcon, href: '/admin/asistencia/personal' },
    ],
  },
  {
    title: 'FINANCIERO',
    items: [
      {
        label: 'Costos',
        icon: CostosIcon,
        children: [
          { label: 'Personal', icon: PersonalIcon, href: '/admin/costos/personal' },
          { label: 'Materiales', icon: MaterialesIcon, href: '/admin/costos/materiales' },
        ],
      },
    ],
  },
];

interface AdminSidebarProps {
  open: boolean;
  onClose: () => void;
  variant?: 'permanent' | 'persistent' | 'temporary';
  collapsed?: boolean;
  onCollapseChange?: (collapsed: boolean) => void;
  sectionTitle?: string; // Nombre de la sección actual (ej: "Dashboard")
}

export default function AdminSidebar({
  open,
  onClose,
  variant = 'persistent',
  collapsed: collapsedProp,
  onCollapseChange,
  sectionTitle = 'Dashboard',
}: AdminSidebarProps) {
  const pathname = usePathname();
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const [internalCollapsed, setInternalCollapsed] = useState(false);
  const collapsed = collapsedProp !== undefined ? collapsedProp : internalCollapsed;

  const isActive = (href?: string) => {
    if (!href) return false;
    return pathname === href || pathname.startsWith(href + '/');
  };

  // Función para verificar si un item tiene un hijo activo
  const hasActiveChild = (item: MenuItem): boolean => {
    if (!item.children) return false;
    return item.children.some((child) => isActive(child.href) || hasActiveChild(child));
  };

  // Auto-expandir items que tengan hijos activos
  useEffect(() => {
    if (!pathname) return;
    
    try {
      const autoExpanded: string[] = [];
      menuSections.forEach((section) => {
        section.items.forEach((item) => {
          if (item.children && item.children.length > 0) {
            const hasActive = item.children.some((child) => {
              if (!child || !child.href) return false;
              return pathname === child.href || pathname.startsWith(child.href + '/');
            });
            if (hasActive && !autoExpanded.includes(item.label)) {
              autoExpanded.push(item.label);
            }
          }
        });
      });
      
      if (autoExpanded.length > 0) {
        setExpandedItems((prev) => {
          // Evitar actualización innecesaria
          const needsUpdate = !autoExpanded.every((label) => prev.includes(label));
          if (!needsUpdate) return prev;
          return [...new Set([...prev, ...autoExpanded])];
        });
      }
    } catch (error) {
      console.error('Error en useEffect del sidebar:', error);
    }
  }, [pathname]);

  const handleCollapse = (newCollapsed: boolean) => {
    if (collapsedProp === undefined) {
      setInternalCollapsed(newCollapsed);
    }
    onCollapseChange?.(newCollapsed);
  };

  const toggleExpanded = (label: string) => {
    setExpandedItems((prev) =>
      prev.includes(label) ? prev.filter((item) => item !== label) : [...prev, label],
    );
  };

  const isItemExpanded = (label: string) => expandedItems.includes(label);

  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [popoverItem, setPopoverItem] = useState<MenuItem | null>(null);

  const handlePopoverOpen = (event: React.MouseEvent<HTMLElement>, item: MenuItem) => {
    if (collapsed && item.children && item.children.length > 0) {
      setAnchorEl(event.currentTarget);
      setPopoverItem(item);
    }
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
    setPopoverItem(null);
  };

  const renderMenuItem = (item: MenuItem, level: number = 0, isChild: boolean = false) => {
    const Icon = item.icon;
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = isItemExpanded(item.label);
    const itemActive = isActive(item.href) || (hasChildren && item.children?.some((child) => isActive(child.href)));
    const childActive = isActive(item.href);

    // Estilo diferente para hijos (subdivisiones)
    const isChildItem = level > 0;

    const menuItemContent = (
      <ListItemButton
        component={item.href ? Link : 'div'}
        href={item.href || '#'}
        onClick={() => {
          if (hasChildren && !collapsed) {
            toggleExpanded(item.label);
          }
          if (variant === 'temporary' && !hasChildren) {
            onClose();
          }
        }}
        onMouseEnter={(e) => handlePopoverOpen(e, item)}
        onMouseLeave={handlePopoverClose}
        sx={{
          pl: collapsed ? 2 : isChildItem ? 4.5 : 2 + level * 2,
          pr: 2,
          py: isChildItem ? 0.625 : 0.875,
          minHeight: isChildItem ? 32 : 36,
          borderRadius: isChildItem ? 1 : 1.5,
          mx: 1,
          mb: isChildItem ? 0.125 : 0.25,
          backgroundColor: (isChildItem && childActive) || (!isChildItem && itemActive) ? alpha('#6C5CE7', 0.06) : 'transparent',
          color: (isChildItem && childActive) || (!isChildItem && itemActive) ? '#6C5CE7' : '#6C757D',
          position: 'relative',
          '&::before': !isChildItem && itemActive
            ? {
                content: '""',
                position: 'absolute',
                left: 0,
                top: '50%',
                transform: 'translateY(-50%)',
                width: 2.5,
                height: '50%',
                backgroundColor: '#6C5CE7',
                borderRadius: '0 2px 2px 0',
              }
            : {},
          '&:hover': {
            backgroundColor: alpha('#6C5CE7', 0.04),
            color: '#6C5CE7',
          },
          transition: 'all 0.2s ease-in-out',
        }}
      >
        {!isChildItem && (
          <ListItemIcon
            sx={{
              minWidth: collapsed ? 0 : 40,
              color: 'inherit',
              justifyContent: 'center',
            }}
          >
            <Icon fontSize="small" />
          </ListItemIcon>
        )}
        {isChildItem && !collapsed && (
          <Box
            sx={{
              width: 4,
              height: 4,
              borderRadius: '50%',
              backgroundColor: childActive ? '#6C5CE7' : '#ADB5BD',
              mr: 1.5,
              flexShrink: 0,
            }}
          />
        )}
        {!collapsed && (
          <>
            <ListItemText
              primary={item.label}
              primaryTypographyProps={{
                fontSize: isChildItem ? '0.75rem' : '0.8125rem',
                fontWeight: isChildItem ? (childActive ? 600 : 400) : (itemActive ? 600 : 500),
                color: 'inherit',
                textTransform: isChildItem ? 'none' : 'capitalize',
              }}
            />
            {hasChildren && !isChildItem && (
              <Box>
                {isExpanded ? (
                  <ExpandMore sx={{ fontSize: 16, color: 'inherit' }} />
                ) : (
                  <ChevronRight sx={{ fontSize: 16, color: 'inherit' }} />
                )}
              </Box>
            )}
          </>
        )}
      </ListItemButton>
    );

    return (
      <React.Fragment key={item.label}>
        {collapsed ? (
          <Tooltip title={item.label} placement="right" arrow>
            {menuItemContent}
          </Tooltip>
        ) : (
          menuItemContent
        )}
        {hasChildren && !collapsed && (
          <Collapse in={isExpanded} timeout="auto" unmountOnExit>
            <List component="div" disablePadding sx={{ pl: 1, pt: 0.5 }}>
              {item.children?.map((child) => renderMenuItem(child, level + 1, true))}
            </List>
          </Collapse>
        )}
      </React.Fragment>
    );
  };

  const drawerContent = (
    <Box sx={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', bgcolor: '#FFFFFF' }}>
      {/* Sin logo, título ni botón colapsar - todo está en el header */}

      {/* Menú */}
      <Box
        sx={{
          flexGrow: 1,
          overflow: 'auto',
          pt: 2,
          // Ocultar scrollbar pero mantener funcionalidad
          '&::-webkit-scrollbar': {
            width: '6px',
          },
          '&::-webkit-scrollbar-track': {
            background: 'transparent',
          },
          '&::-webkit-scrollbar-thumb': {
            background: '#E9ECEF',
            borderRadius: '3px',
            '&:hover': {
              background: '#DEE2E6',
            },
          },
          // Firefox
          scrollbarWidth: 'thin',
          scrollbarColor: '#E9ECEF transparent',
        }}
      >
        {menuSections.map((section, sectionIndex) => (
          <React.Fragment key={section.title}>
            {!collapsed && (
              <Box sx={{ px: 2, py: 0.75 }}>
                <Typography
                  variant="caption"
                  sx={{
                    fontSize: '0.6875rem',
                    fontWeight: 600,
                    color: '#ADB5BD',
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                  }}
                >
                  {section.title}
                </Typography>
              </Box>
            )}
            <List component="nav" sx={{ px: collapsed ? 0.5 : 1, pb: 0 }}>
              {section.items.map((item) => renderMenuItem(item))}
            </List>
            {/* Separador suave entre secciones */}
            {sectionIndex < menuSections.length - 1 && !collapsed && (
              <Box
                sx={{
                  mx: 2,
                  my: 1.5,
                  height: '1px',
                  backgroundColor: '#F1F3F5',
                }}
              />
            )}
          </React.Fragment>
        ))}
      </Box>

      {/* Popover para mostrar sub-opciones cuando está contraído */}
      <Popover
        open={Boolean(anchorEl) && collapsed}
        anchorEl={anchorEl}
        onClose={handlePopoverClose}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        sx={{
          pointerEvents: 'none',
          ml: 0.5,
        }}
        PaperProps={{
          sx: {
            pointerEvents: 'auto',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
            borderRadius: 2,
            minWidth: 200,
          },
          onMouseEnter: () => setAnchorEl(anchorEl),
          onMouseLeave: handlePopoverClose,
        }}
      >
        {popoverItem && (
          <Paper elevation={0} sx={{ p: 1 }}>
            <Typography
              variant="subtitle2"
              sx={{
                px: 2,
                py: 1,
                fontWeight: 600,
                color: '#2D3436',
                fontSize: '0.875rem',
              }}
            >
              {popoverItem.label}
            </Typography>
            <List sx={{ py: 0 }}>
              {popoverItem.children?.map((child) => (
                <ListItemButton
                  key={child.label}
                  component={child.href ? Link : 'div'}
                  href={child.href || '#'}
                  onClick={handlePopoverClose}
                  sx={{
                    py: 1,
                    px: 2,
                    borderRadius: 1,
                    '&:hover': {
                      backgroundColor: alpha('#6C5CE7', 0.08),
                    },
                  }}
                >
                  <ListItemText
                    primary={child.label}
                    primaryTypographyProps={{
                      fontSize: '0.8125rem',
                      fontWeight: 500,
                    }}
                  />
                </ListItemButton>
              ))}
            </List>
          </Paper>
        )}
      </Popover>
    </Box>
  );

  return (
    <Drawer
      variant={variant}
      open={open}
      onClose={onClose}
      sx={{
        width: collapsed ? drawerWidthCollapsed : drawerWidth,
        flexShrink: 0,
        zIndex: (theme) => theme.zIndex.drawer,
        '& .MuiDrawer-paper': {
          width: collapsed ? drawerWidthCollapsed : drawerWidth,
          boxSizing: 'border-box',
          backgroundColor: '#FFFFFF',
          borderRight: '1px solid #F1F3F5',
          transition: 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          overflowX: 'hidden',
          top: 70,
          height: 'calc(100% - 70px)',
          boxShadow: 'none',
        },
      }}
    >
      {drawerContent}
    </Drawer>
  );
}
