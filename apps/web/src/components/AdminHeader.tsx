'use client';

import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Box,
  InputBase,
  Badge,
  Avatar,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import NotificationsIcon from '@mui/icons-material/Notifications';
import SearchIcon from '@mui/icons-material/Search';
import SettingsIcon from '@mui/icons-material/Settings';
import { alpha } from '@mui/material/styles';

interface AdminHeaderProps {
  onMenuClick: () => void;
  pageTitle?: string;
}

export default function AdminHeader({ onMenuClick, pageTitle = 'Dashboard' }: AdminHeaderProps) {
  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        zIndex: (theme) => theme.zIndex.drawer + 1,
        backgroundColor: '#FFFFFF',
        borderBottom: '1px solid #F1F3F5',
        boxShadow: 'none',
        left: 0,
        right: 0,
      }}
    >
      <Toolbar
        sx={{
          px: 0,
          minHeight: '70px !important',
          height: 70,
        }}
      >
        {/* Sección izquierda: Logo + Hamburger + Título (alineados al ancho del sidebar 240px) */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            width: 240,
            px: 2,
            borderRight: '1px solid #F1F3F5',
            height: '100%',
          }}
        >
          {/* Logo */}
          <Box
            sx={{
              width: 36,
              height: 36,
              borderRadius: 1.5,
              background: 'linear-gradient(135deg, #6C5CE7 0%, #A29BFE 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontWeight: 700,
              fontSize: '0.875rem',
              mr: 1.5,
            }}
          >
            W
          </Box>
          
          {/* Marca */}
          <Typography
            variant="h6"
            sx={{
              fontSize: '1.25rem',
              fontWeight: 700,
              color: '#2D3436',
              letterSpacing: '-0.02em',
            }}
          >
            WTT
          </Typography>
        </Box>

        {/* Sección derecha: Hamburger + Título + Búsqueda + Iconos */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            flexGrow: 1,
            px: 2.5,
            gap: 2,
          }}
        >
          {/* Menú hamburguesa */}
          <IconButton
            color="inherit"
            aria-label="menu"
            onClick={onMenuClick}
            sx={{
              color: '#6C757D',
              '&:hover': {
                backgroundColor: alpha('#6C5CE7', 0.06),
                color: '#6C5CE7',
              },
            }}
          >
            <MenuIcon />
          </IconButton>

          {/* Título de la página */}
          <Typography
            variant="h5"
            component="div"
            sx={{
              fontSize: '1.25rem',
              fontWeight: 600,
              color: '#2D3436',
              letterSpacing: '-0.01em',
            }}
          >
            {pageTitle}
          </Typography>

          {/* Búsqueda */}
          <Box
            sx={{
              position: 'relative',
              borderRadius: 2,
              backgroundColor: alpha('#6C5CE7', 0.05),
              '&:hover': {
                backgroundColor: alpha('#6C5CE7', 0.08),
              },
              display: { xs: 'none', md: 'flex' },
              alignItems: 'center',
              px: 2,
              py: 1,
              flexGrow: 1,
              maxWidth: 400,
            }}
          >
            <SearchIcon sx={{ color: '#ADB5BD', mr: 1, fontSize: 20 }} />
            <InputBase
              placeholder="Search..."
              sx={{
                color: '#2D3436',
                fontSize: '0.875rem',
                width: '100%',
                '& .MuiInputBase-input': {
                  padding: 0,
                  '&::placeholder': {
                    color: '#ADB5BD',
                    opacity: 1,
                  },
                },
              }}
            />
          </Box>

          {/* Iconos de acción */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, ml: 'auto' }}>
            {/* Notificaciones */}
            <IconButton
              sx={{
                color: '#ADB5BD',
                '&:hover': {
                  backgroundColor: alpha('#6C5CE7', 0.06),
                  color: '#6C5CE7',
                },
              }}
            >
              <Badge badgeContent={0} color="error">
                <NotificationsIcon />
              </Badge>
            </IconButton>

            {/* Configuración */}
            <IconButton
              sx={{
                color: '#ADB5BD',
                '&:hover': {
                  backgroundColor: alpha('#6C5CE7', 0.06),
                  color: '#6C5CE7',
                },
              }}
            >
              <SettingsIcon />
            </IconButton>

            {/* Avatar */}
            <Avatar
              sx={{
                width: 36,
                height: 36,
                ml: 1,
                background: 'linear-gradient(135deg, #6C5CE7 0%, #A29BFE 100%)',
                cursor: 'pointer',
                fontSize: '0.875rem',
                '&:hover': {
                  opacity: 0.9,
                },
              }}
            >
              A
            </Avatar>
          </Box>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
