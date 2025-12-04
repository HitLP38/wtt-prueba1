'use client';

import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Container,
  Typography,
  Button,
  IconButton,
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Divider,
  useMediaQuery,
  useTheme,
  Stack,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import Link from 'next/link';
import Image from 'next/image';

const navigationItems = [
  { label: 'NEWS', href: '/news' },
  { label: 'VIDEOS', href: '/videos' },
  { label: 'PLAYERS', href: '/players' },
  { label: 'EVENTS', href: '/events' },
  { label: 'RANKINGS', href: '/rankings' },
  { label: 'WATCH LIVE', href: '/watch' },
];

const Header = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawer = (
    <Box sx={{ width: 280, height: '100%' }}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          p: 2,
        }}
      >
        <Image
          src="/logo-wtt.svg"
          alt="WTT Logo"
          width={180}
          height={72}
          priority
          style={{
            objectFit: 'contain',
            height: '48px',
            width: 'auto',
            maxWidth: '100%',
          }}
        />
        <IconButton onClick={handleDrawerToggle} color="inherit">
          <CloseIcon />
        </IconButton>
      </Box>
      <Divider />
      <List>
        {navigationItems.map((item) => (
          <ListItem key={item.label} disablePadding>
            <ListItemButton
              component={Link}
              href={item.href}
              onClick={handleDrawerToggle}
              sx={{
                '&:hover': {
                  backgroundColor: 'action.hover',
                },
              }}
            >
              <ListItemText
                primary={item.label}
                primaryTypographyProps={{
                  fontWeight: 500,
                  fontSize: '0.95rem',
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider sx={{ my: 2 }} />
      <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 1 }}>
        <Button
          component={Link}
          href="/events"
          variant="outlined"
          fullWidth
          sx={{
            textTransform: 'none',
            fontWeight: 600,
          }}
        >
          Ver Eventos
        </Button>
        <Button
          component={Link}
          href="/referee"
          variant="outlined"
          fullWidth
          sx={{
            textTransform: 'none',
            fontWeight: 600,
          }}
        >
          Panel Árbitro
        </Button>
        <Button
          component={Link}
          href="/signin"
          variant="outlined"
          fullWidth
          sx={{
            textTransform: 'none',
            fontWeight: 500,
          }}
        >
          SIGN IN
        </Button>
        <Button
          variant="contained"
          fullWidth
          sx={{
            textTransform: 'none',
            fontWeight: 600,
          }}
        >
          SUBSCRIBE
        </Button>
      </Box>
    </Box>
  );

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        backgroundColor: 'background.paper',
        borderBottom: '1px solid',
        borderColor: 'divider',
      }}
    >
      <Container maxWidth="xl">
        <Toolbar
          disableGutters
          sx={{
            minHeight: { xs: 64, md: 72 },
            justifyContent: 'space-between',
          }}
        >
          {/* Logo */}
          <Box
            component={Link}
            href="/"
            sx={{
              display: 'flex',
              alignItems: 'center',
              textDecoration: 'none',
              mr: { xs: 2, md: 4 },
              height: { xs: 48, md: 56 },
              position: 'relative',
            }}
          >
            <Image
              src="/logo-wtt.svg"
              alt="WTT Logo"
              width={180}
              height={72}
              priority
              style={{
                objectFit: 'contain',
                height: '100%',
                width: 'auto',
                maxWidth: '100%',
              }}
            />
          </Box>

          {/* Desktop Navigation */}
          {!isMobile && (
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: { md: 1, lg: 2 },
                flex: 1,
                justifyContent: 'center',
              }}
            >
              {navigationItems.map((item) => (
                <Button
                  key={item.label}
                  component={Link}
                  href={item.href}
                  sx={{
                    color: 'text.primary',
                    fontWeight: 600,
                    fontSize: '0.875rem',
                    textTransform: 'none',
                    px: 1.5,
                    '&:hover': {
                      backgroundColor: 'action.hover',
                      color: 'primary.main',
                    },
                  }}
                >
                  {item.label}
                </Button>
              ))}
            </Box>
          )}

          {/* Desktop Actions */}
          {!isMobile && (
            <Stack direction="row" spacing={1.5} alignItems="center">
              <Button
                component={Link}
                href="/events"
                sx={{
                  color: 'text.primary',
                  fontWeight: 600,
                  fontSize: '0.875rem',
                  textTransform: 'none',
                  px: 2,
                  '&:hover': {
                    backgroundColor: 'action.hover',
                    color: 'primary.main',
                  },
                }}
              >
                Ver Eventos
              </Button>
              <Button
                component={Link}
                href="/referee"
                variant="outlined"
                sx={{
                  fontWeight: 600,
                  fontSize: '0.875rem',
                  textTransform: 'none',
                  px: 2.5,
                }}
              >
                Panel Árbitro
              </Button>
              <Button
                component={Link}
                href="/signin"
                sx={{
                  color: 'text.primary',
                  fontWeight: 600,
                  fontSize: '0.875rem',
                  textTransform: 'none',
                  px: 2,
                  '&:hover': {
                    backgroundColor: 'action.hover',
                  },
                }}
              >
                SIGN IN
              </Button>
              <Button
                variant="contained"
                sx={{
                  fontWeight: 600,
                  fontSize: '0.875rem',
                  textTransform: 'none',
                  px: 3,
                }}
              >
                SUBSCRIBE
              </Button>
            </Stack>
          )}

          {/* Mobile Menu Button */}
          {isMobile && (
            <IconButton
              edge="end"
              color="inherit"
              aria-label="menu"
              onClick={handleDrawerToggle}
              sx={{
                color: 'text.primary',
              }}
            >
              <MenuIcon />
            </IconButton>
          )}
        </Toolbar>
      </Container>

      {/* Mobile Drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile
        }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: 280,
            backgroundColor: 'background.paper',
          },
        }}
      >
        {drawer}
      </Drawer>
    </AppBar>
  );
};

export default Header;
