# 🚀 Inicio Rápido - WTT Platform

## Prerrequisitos

- Node.js >= 18.0.0
- npm >= 9.0.0
- Docker y Docker Compose
- Git

## Instalación Paso a Paso

### 1. Clonar e Instalar

```bash
# Ya estás en el directorio del proyecto
npm install
```

### 2. Configurar Variables de Entorno

```bash
# Copiar archivo de ejemplo
cp env.example .env

# Editar .env con tus valores (especialmente Clerk si lo usas)
```

### 3. Iniciar Servicios de Infraestructura

```bash
# Iniciar PostgreSQL y Redis
npm run docker:up

# Verificar que están corriendo
docker ps
```

### 4. Iniciar Desarrollo

```bash
# Opción 1: Iniciar todo con Turbo (recomendado)
npm run dev

# Opción 2: Iniciar servicios individualmente
# Terminal 1 - Gateway
cd services/gateway && npm run dev

# Terminal 2 - Eventos Service
cd services/eventos && npm run dev

# Terminal 3 - Inscriptions Service
cd services/inscriptions && npm run dev

# Terminal 4 - Teams Service
cd services/teams && npm run dev

# Terminal 5 - Matches Service
cd services/matches && npm run dev

# Terminal 6 - Frontend
cd apps/web && npm run dev
```

## URLs de Desarrollo

- **Frontend**: http://localhost:3000
- **Gateway API**: http://localhost:3001
- **PostgreSQL**: localhost:5432
- **Redis**: localhost:6379

## Estructura de Comandos

```bash
# Desarrollo
npm run dev              # Iniciar todos los servicios en modo desarrollo

# Construcción
npm run build            # Build de todos los servicios
npm run lint             # Linter en todos los servicios

# Docker
npm run docker:up        # Iniciar PostgreSQL + Redis
npm run docker:down      # Detener servicios Docker
npm run docker:logs      # Ver logs de Docker

# Limpieza
npm run clean            # Limpiar builds
```

## Verificación

### 1. Verificar Gateway
```bash
curl http://localhost:3001/api/health
# Debería responder: {"status":"ok","service":"gateway"}
```

### 2. Verificar Frontend
Abrir http://localhost:3000 en el navegador

### 3. Verificar Base de Datos
```bash
# Conectarse a PostgreSQL
docker exec -it wtt-postgres psql -U wtt_user -d wtt_db

# Ver tablas
\dt
```

## Problemas Comunes

### Error: Puerto en uso
```bash
# Windows
netstat -ano | findstr :3001
# Linux/Mac
lsof -i :3001

# Matar proceso
# Windows
taskkill /PID <PID> /F
# Linux/Mac
kill -9 <PID>
```

### Error: Docker no inicia
```bash
# Verificar que Docker está corriendo
docker ps

# Reiniciar servicios
npm run docker:down
npm run docker:up
```

### Error: Dependencias no instaladas
```bash
# Limpiar e instalar de nuevo
rm -rf node_modules
npm install
```

## Próximos Pasos

1. ✅ Configurar Clerk Auth (obtener keys de https://clerk.com)
2. ✅ Crear primer evento desde el admin
3. ✅ Probar inscripciones
4. ✅ Configurar panel de árbitros

## Soporte

Para más información, ver:
- `README.md` - Información general
- `ARCHITECTURE.md` - Arquitectura detallada


