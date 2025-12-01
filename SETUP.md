# 🔧 Guía de Configuración Inicial

## 📍 ¿Dónde ejecutar los comandos?

**IMPORTANTE**: Todos los comandos deben ejecutarse en la **raíz del proyecto WTT**, es decir:

```
C:\Users\Usuario\Desktop\Pagina Iglesia Alex\WTT
```

Este es el directorio que contiene:
- `package.json` (raíz)
- `services/`
- `apps/`
- `packages/`
- `docker-compose.yml`

## 🚀 Pasos de Instalación

### Paso 1: Verificar que estás en la raíz

```bash
# Deberías ver estos archivos/directorios:
dir
# Deberías ver: package.json, services, apps, packages, etc.
```

### Paso 2: Limpiar instalaciones previas (si hay errores)

```bash
# Eliminar node_modules y package-lock.json si existen
rmdir /s /q node_modules
del package-lock.json
```

### Paso 3: Instalar dependencias

```bash
npm install
```

Esto instalará todas las dependencias de todos los servicios y el frontend.

### Paso 4: Crear archivo .env

**En Windows (PowerShell):**
```powershell
# Desde la raíz del proyecto WTT
Copy-Item env.example .env
```

**O manualmente:**
1. Copia el archivo `env.example`
2. Renómbralo a `.env`
3. Ábrelo con un editor de texto (Notepad, VS Code, etc.)

**Ubicación del archivo .env:**
```
WTT\.env
```

### Paso 5: Editar .env

Abre el archivo `.env` y configura las variables. Por ahora puedes dejar los valores por defecto, excepto si tienes Clerk configurado:

```env
# Database (valores por defecto están bien)
DB_HOST=localhost
DB_PORT=5432
DB_USER=wtt_user
DB_PASSWORD=wtt_password
DB_NAME=wtt_db

# Redis (valores por defecto están bien)
REDIS_HOST=localhost
REDIS_PORT=6379

# Clerk Auth (opcional por ahora, puedes dejarlo vacío)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
```

## ✅ Verificación

### Verificar que npm install funcionó:

```bash
# Deberías ver node_modules en la raíz
dir node_modules

# Y también en los servicios
dir services\gateway\node_modules
```

### Verificar que .env existe:

```bash
# En PowerShell
Test-Path .env
# Debería retornar: True
```

## 🐳 Iniciar Servicios

### 1. Iniciar PostgreSQL y Redis:

```bash
npm run docker:up
```

### 2. Verificar que Docker está corriendo:

```bash
docker ps
# Deberías ver: wtt-postgres y wtt-redis
```

### 3. Iniciar todos los servicios:

```bash
npm run dev
```

## ❌ Solución de Problemas

### Error: "Cannot find module '@wtt/common'"

**Solución:**
1. Asegúrate de que `packages/common` existe
2. Ejecuta desde la raíz: `npm install`
3. Si persiste, elimina `node_modules` y `package-lock.json` y vuelve a instalar

### Error: "Workspace not found"

**Solución:**
Verifica que `package.json` en la raíz tenga:
```json
"workspaces": [
  "packages/*",
  "services/*",
  "apps/*"
]
```

### Error: Puerto en uso

**Solución:**
```bash
# Ver qué está usando el puerto 3001
netstat -ano | findstr :3001

# Matar el proceso (reemplaza <PID> con el número)
taskkill /PID <PID> /F
```

## 📝 Resumen de Rutas

```
WTT/                          ← AQUÍ ejecutas todos los comandos
├── .env                      ← Crea este archivo aquí (copiando env.example)
├── package.json              ← Archivo principal
├── services/                 ← Microservicios
├── apps/                     ← Frontend
└── packages/                 ← Paquetes compartidos
    └── common/               ← @wtt/common está aquí
```

## 🎯 Comandos Rápidos

```bash
# Desde WTT/ (raíz del proyecto)

# 1. Instalar
npm install

# 2. Crear .env (PowerShell)
Copy-Item env.example .env

# 3. Iniciar Docker
npm run docker:up

# 4. Desarrollo
npm run dev
```


