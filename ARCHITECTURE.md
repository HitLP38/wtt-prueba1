# 🏗️ Arquitectura del Sistema WTT

## Visión General

Sistema modular de microservicios para gestión integral de torneos de tenis de mesa, construido con NestJS y Next.js.

## Estructura del Monorepo

```
WTT/
├── packages/
│   └── common/          # Código compartido (tipos, constantes, DTOs)
├── services/            # Microservicios NestJS
│   ├── gateway/         # API Gateway (puerto 3001)
│   ├── eventos/         # Gestión de eventos
│   ├── inscriptions/    # Inscripciones individuales y por equipos
│   ├── teams/           # Equipos y alineaciones
│   ├── matches/         # Partidos y asignación de mesas
│   ├── scoring/         # Puntuación y reglas
│   └── scheduler/       # Cronograma y automatización
└── apps/
    └── web/             # Frontend Next.js (puerto 3000)
```

## Microservicios

### 1. Gateway Service
- **Puerto**: 3001
- **Función**: Punto de entrada único para todas las peticiones
- **Tecnología**: NestJS + Express
- **Comunicación**: Redis (bus de eventos)

### 2. Eventos Service
- **Función**: Gestión de eventos/torneos
- **Entidades**: Event, Bases (PDF)
- **Endpoints**: CRUD de eventos, landing pública

### 3. Inscriptions Service
- **Función**: Inscripciones individuales y validación
- **Entidades**: Inscription, PaymentReceipt
- **Validaciones**: Edad, cupos, período, ranking

### 4. Teams Service
- **Función**: Equipos y alineaciones oficiales
- **Entidades**: Team, TeamPlayer, TeamLineup
- **Validaciones**: Orden S1-S2-D-S3-S4, jugadores únicos

### 5. Matches Service
- **Función**: Gestión de partidos
- **Entidades**: Match, Set, MatchIncident
- **Features**: Asignación de mesas, estados, árbitros

### 6. Scoring Service
- **Función**: Puntuación y reglas oficiales
- **Validaciones**: Set point, match point, finalización

### 7. Scheduler Service
- **Función**: Cronograma y automatización
- **Features**: Asignación óptima de mesas, alertas

## Base de Datos

### PostgreSQL
- **Host**: localhost:5432
- **Database**: wtt_db
- **Usuario**: wtt_user

### Tablas Principales
- `events` - Eventos/Torneos
- `inscriptions` - Inscripciones
- `teams` - Equipos
- `team_lineups` - Alineaciones oficiales
- `matches` - Partidos
- `sets` - Sets de partidos
- `match_incidents` - Incidencias (tarjetas, timeouts)

## Comunicación entre Servicios

### Redis (Bus de Eventos)
- **Host**: localhost:6379
- **Protocolo**: Redis Pub/Sub
- **Patrón**: Message Pattern (NestJS Microservices)

### WebSockets
- **Tecnología**: Socket.io
- **Uso**: Tiempo real para marcadores, actualizaciones

## Frontend

### Next.js 14
- **Puerto**: 3000
- **Framework**: React 18
- **Estado**: Zustand
- **UI**: Material-UI (MUI)
- **Auth**: Clerk

### Estructura
```
apps/web/src/
├── app/              # App Router (Next.js 14)
├── components/       # Componentes reutilizables
├── store/           # Zustand stores
├── lib/             # Utilidades
└── theme.ts         # Tema MUI
```

## Autenticación

### Clerk
- **Integración**: @clerk/nextjs
- **Roles**: Admin, Referee, Coach, Player, Viewer
- **Middleware**: Protección de rutas

## Nomenclatura

### Variables
- **JavaScript/TypeScript**: `camelCase` (matchId, playerName)
- **Base de Datos**: `snake_case` (team_id, player_order)
- **Constantes**: `UPPER_SNAKE_CASE` (MAX_SETS, DEFAULT_TIMEOUT)

### Funciones
- **Verbos claros**: `assignMatchToTable()`, `validateTeamLineup()`
- **Evitar**: `doSomething()`, `process()`, `handle()`

## Desarrollo por Etapas

### ✅ ETAPA 1: Cimentación
- Monorepo configurado
- Microservicios base creados
- PostgreSQL + Redis configurados
- Gateway funcionando

### 🔄 ETAPA 2: Estructura (En progreso)
- Servicios principales implementados
- Modelos de base de datos
- Validaciones básicas

### 📋 ETAPA 3: Visualización Pública
- Landing empresarial
- Página de eventos
- Visualizador de equipos/jugadores

### 📋 ETAPA 4: Paneles Internos
- Panel Admin
- Panel Árbitros (estilo WTT)
- Control de marcador

### 📋 ETAPA 5: Inscripciones
- Formularios dinámicos
- Validaciones automáticas
- Carga de comprobantes

### 📋 ETAPA 6: Automatización
- Rondas automáticas
- Analytics
- Streaming

## Comandos

```bash
# Desarrollo
npm run dev              # Todos los servicios
npm run docker:up        # Iniciar PostgreSQL + Redis

# Construcción
npm run build            # Build completo
npm run lint             # Linter

# Servicios individuales
cd services/gateway && npm run dev
cd apps/web && npm run dev
```

## Variables de Entorno

Ver `env.example` para todas las variables necesarias.

## Próximos Pasos

1. Completar servicios de Scoring y Scheduler
2. Implementar WebSockets para tiempo real
3. Crear panel de árbitros (estilo WTT)
4. Implementar validaciones de alineaciones
5. Sistema de archivos para PDFs e imágenes


