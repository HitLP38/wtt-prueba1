# 🏆 Plataforma Integral de Gestión de Torneos de Tenis de Mesa

Sistema modular, escalable y distribuido para la gestión completa de torneos de tenis de mesa.

## 🏗️ Arquitectura

- **Backend**: NestJS Microservices
- **Frontend**: Next.js 14 + React + TypeScript
- **Base de Datos**: PostgreSQL
- **Cache/Event Bus**: Redis
- **Autenticación**: Clerk
- **Tiempo Real**: WebSockets
- **Monorepo**: Turbo

## 📦 Estructura del Proyecto

```
WTT/
├── services/          # Microservicios NestJS
│   ├── gateway/       # API Gateway
│   ├── auth/          # Servicio de autenticación
│   ├── eventos/       # Gestión de eventos
│   ├── inscriptions/  # Inscripciones
│   ├── teams/         # Equipos y alineaciones
│   ├── matches/       # Partidos
│   ├── scoring/       # Puntuación
│   └── scheduler/     # Cronograma
├── apps/
│   └── web/           # Frontend Next.js
└── packages/          # Librerías compartidas
```

## 🚀 Inicio Rápido

### Prerrequisitos

- Node.js >= 18
- Docker y Docker Compose
- npm >= 9

### Instalación

```bash
# Instalar dependencias
npm install

# Iniciar servicios (PostgreSQL, Redis)
npm run docker:up

# Desarrollo
npm run dev
```

## 📋 Etapas de Desarrollo

1. **ETAPA 1**: Cimentación (Infraestructura Backend) ✅
2. **ETAPA 2**: Estructura (Servicios principales)
3. **ETAPA 3**: Primeros pisos (Visualización pública)
4. **ETAPA 4**: Paneles internos (Árbitros + Admin)
5. **ETAPA 5**: Inscripciones profesionales
6. **ETAPA 6**: Crecimiento y automatización

## 🔧 Tecnologías

- NestJS
- Next.js 14
- TypeScript
- PostgreSQL
- Redis
- Clerk
- WebSockets
- Zustand
- Material-UI

## 📝 Licencia

Privado - Todos los derechos reservados


