# 🔧 Solución: Página se queda cargando infinitamente

## Problemas encontrados y corregidos:

### 1. ✅ Layout con metadata y 'use client' conflictivo
**Problema:** El layout intentaba usar `export const metadata` (Server Component) con `process.env` (requiere Client Component).

**Solución:** Simplificado el layout, removido el uso condicional de Clerk por ahora.

### 2. ✅ CSS con variables no definidas
**Problema:** `globals.css` referenciaba variables CSS (`--foreground-rgb`, `--background-end-rgb`) que no existían.

**Solución:** Reemplazado con valores simples de color.

## 🚀 Qué hacer ahora:

### 1. Reiniciar el servidor de desarrollo:

```powershell
# Si npm run dev está corriendo, presiona Ctrl + C
# Luego ejecuta:
cd "C:\Users\Usuario\Desktop\Pagina Iglesia Alex\WTT"
npm run dev
```

### 2. Esperar a que compile:

Deberías ver:
```
▲ Next.js ready on http://localhost:3000
```

### 3. Recargar el navegador:

- Presiona `Ctrl + Shift + R` (recarga forzada)
- O cierra y abre la pestaña de nuevo
- O abre en modo incógnito: http://localhost:3000

## ✅ Resultado esperado:

Deberías ver:
- 🏓 WTT Platform (título grande)
- "Plataforma Integral de Gestión de Torneos" (subtítulo)
- Dos botones: "Ver Eventos" y "Panel Árbitro"

## 🔍 Si aún se queda cargando:

### Verificar en la consola del navegador:

1. Abre las herramientas de desarrollador (F12)
2. Ve a la pestaña "Console"
3. Busca errores en rojo
4. Comparte los errores que veas

### Verificar en la terminal:

1. Mira la terminal donde corre `npm run dev`
2. Busca errores en rojo
3. Comparte los mensajes de error

### Verificar que los servicios están corriendo:

```powershell
# Verificar puerto 3000 (Frontend)
netstat -ano | findstr :3000

# Verificar puerto 3001 (API)
netstat -ano | findstr :3001

# Verificar Docker
docker ps
```

## 🐛 Errores comunes:

### Error: "Cannot find module"
**Solución:**
```powershell
cd apps/web
rmdir /s /q .next
cd ../..
npm install
npm run dev
```

### Error: "Port already in use"
**Solución:**
```powershell
# Ver qué está usando el puerto
netstat -ano | findstr :3000

# Matar el proceso
taskkill /PID <PID> /F
```

### Error: "ECONNREFUSED" o problemas de conexión
**Solución:**
```powershell
# Verificar que Docker está corriendo
docker ps

# Si no está corriendo:
npm run docker:up
```

## 📝 Nota sobre Clerk:

ClerkProvider ahora está siempre presente pero sin keys. Esto puede causar un warning pero no debería bloquear la carga. Si quieres eliminar el warning:

1. Comenta temporalmente ClerkProvider en `layout.tsx`
2. O configura las keys de Clerk en `.env`





