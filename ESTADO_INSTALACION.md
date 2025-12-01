# ✅ Estado de Instalación

## Completado ✅

1. ✅ **npm install** - Dependencias instaladas correctamente
2. ✅ **Archivo .env** - Creado desde env.example

## Pendiente ⏳

### 1. Docker Desktop

**Verificar si Docker está instalado:**
```powershell
docker --version
```

**Si no está instalado:**
1. Descargar Docker Desktop para Windows: https://www.docker.com/products/docker-desktop/
2. Instalar y reiniciar la computadora
3. Abrir Docker Desktop y esperar a que inicie

**Verificar que Docker está corriendo:**
```powershell
docker ps
# Debería mostrar una lista (aunque esté vacía)
```

### 2. Iniciar Servicios Docker

Una vez Docker esté funcionando:
```powershell
npm run docker:up
```

Esto iniciará:
- PostgreSQL (puerto 5432)
- Redis (puerto 6379)

### 3. Iniciar Desarrollo

```powershell
npm run dev
```

Esto iniciará todos los microservicios y el frontend.

## Resumen de Comandos

```powershell
# 1. Verificar Docker
docker --version

# 2. Iniciar PostgreSQL + Redis
npm run docker:up

# 3. Verificar que están corriendo
docker ps

# 4. Iniciar todos los servicios
npm run dev
```

## URLs cuando todo esté corriendo

- Frontend: http://localhost:3000
- Gateway API: http://localhost:3001
- PostgreSQL: localhost:5432
- Redis: localhost:6379


