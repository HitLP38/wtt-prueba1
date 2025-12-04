'use client';

import React from 'react';
import {
  Box,
  Container,
  Grid,
  Typography,
  Link as MuiLink,
  Stack,
  Divider,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  Facebook as FacebookIcon,
  Instagram as InstagramIcon,
  YouTube as YouTubeIcon,
  X as TwitterIcon,
} from '@mui/icons-material';
import Image from 'next/image';
import Link from 'next/link';

const footerLinks = {
  about: [
    { label: 'WHAT IS WTT', href: '/about' },
    { label: 'HOST A WTT EVENT', href: '/host' },
    { label: 'BRAND PARTNERSHIPS', href: '/brand' },
    { label: 'CONTACT US', href: '/contact' },
  ],
  company: [
    { label: 'TEAM', href: '/team' },
    { label: 'CAREERS', href: '/careers' },
    { label: 'TECHNICAL DOCUMENTS', href: '/docs' },
  ],
  legal: [
    { label: 'TERMS AND CONDITIONS', href: '/terms' },
    { label: 'PRIVACY NOTICE', href: '/privacy' },
    { label: 'MEDIA PORTAL', href: '/media' },
  ],
};

const socialLinks = [
  { icon: FacebookIcon, href: '#', label: 'Facebook' },
  { icon: InstagramIcon, href: '#', label: 'Instagram' },
  { icon: YouTubeIcon, href: '#', label: 'YouTube' },
  { icon: TwitterIcon, href: '#', label: 'Twitter' },
];

const Footer = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: 'background.paper',
        borderTop: '1px solid',
        borderColor: 'divider',
        background: 'linear-gradient(to bottom, rgba(255, 255, 255, 1) 0%, rgba(167, 139, 250, 0.03) 100%)',
        pt: { xs: 4, md: 6 },
        pb: { xs: 3, md: 4 },
        mt: 'auto',
      }}
    >
      <Container maxWidth="xl">
        <Grid container spacing={{ xs: 4, md: 6 }}>
          {/* Logo and Partner Logos */}
          <Grid item xs={12} md={3}>
            <Stack spacing={3}>
              <Box
                sx={{
                  height: 56,
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <Image
                  src="/logo-wtt.svg"
                  alt="WTT Logo"
                  width={180}
                  height={72}
                  style={{
                    objectFit: 'contain',
                    height: '100%',
                    width: 'auto',
                    maxWidth: '100%',
                  }}
                />
              </Box>
              <Stack direction="row" spacing={2}>
                <Image
                  src="/logo-ittf.svg"
                  alt="ITTF Logo"
                  width={48}
                  height={24}
                />
                <Image
                  src="/logo-foundation.svg"
                  alt="Foundation Logo"
                  width={48}
                  height={24}
                />
              </Stack>
            </Stack>
          </Grid>

          {/* Links Sections */}
          <Grid item xs={12} md={6}>
            <Grid container spacing={{ xs: 3, md: 4 }}>
              {/* About Links */}
              <Grid item xs={6} sm={4}>
                <Stack spacing={1.5}>
                  {footerLinks.about.map((link) => (
                    <MuiLink
                      key={link.label}
                      component={Link}
                      href={link.href}
                      underline="none"
                      sx={{
                        color: 'text.secondary',
                        fontSize: '0.875rem',
                        fontWeight: 500,
                        '&:hover': {
                          color: 'primary.main',
                        },
                      }}
                    >
                      {link.label}
                    </MuiLink>
                  ))}
                </Stack>
              </Grid>

              {/* Company Links */}
              <Grid item xs={6} sm={4}>
                <Stack spacing={1.5}>
                  {footerLinks.company.map((link) => (
                    <MuiLink
                      key={link.label}
                      component={Link}
                      href={link.href}
                      underline="none"
                      sx={{
                        color: 'text.secondary',
                        fontSize: '0.875rem',
                        fontWeight: 500,
                        '&:hover': {
                          color: 'primary.main',
                        },
                      }}
                    >
                      {link.label}
                    </MuiLink>
                  ))}
                </Stack>
              </Grid>

              {/* Legal Links */}
              <Grid item xs={6} sm={4}>
                <Stack spacing={1.5}>
                  {footerLinks.legal.map((link) => (
                    <MuiLink
                      key={link.label}
                      component={Link}
                      href={link.href}
                      underline="none"
                      sx={{
                        color: 'text.secondary',
                        fontSize: '0.875rem',
                        fontWeight: 500,
                        '&:hover': {
                          color: 'primary.main',
                        },
                      }}
                    >
                      {link.label}
                    </MuiLink>
                  ))}
                </Stack>
              </Grid>
            </Grid>
          </Grid>

          {/* App Download Section */}
          <Grid item xs={12} md={3}>
            <Stack spacing={2} alignItems={{ xs: 'flex-start', md: 'flex-end' }}>
              <Typography
                variant="body2"
                fontWeight={500}
                sx={{ color: 'text.primary' }}
              >
                Game On
              </Typography>
              <Stack
                direction={{ xs: 'row', md: 'column' }}
                spacing={1.5}
                width={{ xs: '100%', md: 'auto' }}
              >
                <Box
                  component="a"
                  href="#"
                  sx={{
                    display: 'block',
                    width: { xs: 'calc(50% - 8px)', md: 120 },
                    height: { xs: 'auto', md: 36 },
                  }}
                >
                  <Image
                    src="/appstore.svg"
                    alt="App Store"
                    width={120}
                    height={36}
                    style={{ width: '100%', height: 'auto' }}
                  />
                </Box>
                <Box
                  component="a"
                  href="#"
                  sx={{
                    display: 'block',
                    width: { xs: 'calc(50% - 8px)', md: 120 },
                    height: { xs: 'auto', md: 36 },
                  }}
                >
                  <Image
                    src="/googleplay.svg"
                    alt="Google Play"
                    width={120}
                    height={36}
                    style={{ width: '100%', height: 'auto' }}
                  />
                </Box>
              </Stack>
            </Stack>
          </Grid>
        </Grid>

        <Divider sx={{ my: { xs: 3, md: 4 } }} />

        {/* Bottom Section */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            justifyContent: 'space-between',
            alignItems: { xs: 'flex-start', md: 'center' },
            gap: 2,
          }}
        >
          <Typography
            variant="body2"
            sx={{
              color: 'text.secondary',
              fontSize: '0.8125rem',
            }}
          >
            Copyright ©2025 World Table Tennis Pte. Ltd. All Rights Reserved
          </Typography>

          {/* Social Media Icons */}
          <Stack direction="row" spacing={1.5}>
            {socialLinks.map((social) => {
              const IconComponent = social.icon;
              return (
                <MuiLink
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  sx={{
                    color: 'text.secondary',
                    '&:hover': {
                      color: 'primary.main',
                    },
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <IconComponent fontSize="small" />
                </MuiLink>
              );
            })}
          </Stack>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
