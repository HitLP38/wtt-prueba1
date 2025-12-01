# ⚡ Comandos Rápidos - WTT Platform

## 📍 RUTA DONDE TRABAJAR (SIEMPRE)

```
C:\Users\Usuario\Desktop\Pagina Iglesia Alex\WTT
```

### Cómo llegar aquí desde PowerShell:

```powershell
cd "C:\Users\Usuario\Desktop\Pagina Iglesia Alex\WTT"
```

### Verificar que estás en el lugar correcto:

```powershell
pwd
# Debe mostrar: C:\Users\Usuario\Desktop\Pagina Iglesia Alex\WTT

dir
# Debe mostrar: package.json, services, apps, packages, etc.
```

---

## 🚀 Comandos Principales

### 1. Iniciar PostgreSQL y Redis (Docker)

```powershell
cd "C:\Users\Usuario\Desktop\Pagina Iglesia Alex\WTT"
npm run docker:up
```

**¿Qué hace?**
- Inicia PostgreSQL (base de datos) en el puerto 5432
- Inicia Redis (cache) en el puerto 6379

**Verificar que funcionó:**
```powershell
docker ps
# Debe mostrar: wtt-postgres y wtt-redis
```

### 2. Detener PostgreSQL y Redis

```powershell
cd "C:\Users\Usuario\Desktop\Pagina Iglesia Alex\WTT"
npm run docker:down
```

### 3. Iniciar todos los servicios (Desarrollo)

```powershell
cd "C:\Users\Usuario\Desktop\Pagina Iglesia Alex\WTT"
npm run dev
```

**¿Qué hace?**
- Inicia el Gateway (puerto 3001)
- Inicia todos los microservicios
- Inicia el frontend (puerto 3000)

**Abrir en navegador:**
- Frontend: http://localhost:3000
- API: http://localhost:3001

**Para detener:** Presiona `Ctrl + C` en la terminal

### 4. Construir para producción

```powershell
cd "C:\Users\Usuario\Desktop\Pagina Iglesia Alex\WTT"
npm run build
```

### 5. Ver logs de Docker

```powershell
cd "C:\Users\Usuario\Desktop\Pagina Iglesia Alex\WTT"
npm run docker:logs
```

---

## 📋 Secuencia Normal de Trabajo

### Primera vez (Setup inicial):

```powershell
# 1. Ir a la ruta del proyecto
cd "C:\Users\Usuario\Desktop\Pagina Iglesia Alex\WTT"

# 2. Instalar dependencias (solo la primera vez)
npm install

# 3. Crear archivo .env (solo la primera vez)
Copy-Item env.example .env

# 4. Iniciar Docker
npm run docker:up

# 5. Iniciar desarrollo
npm run dev
```

### Cada vez que trabajas:

```powershell
# 1. Ir a la ruta del proyecto
cd "C:\Users\Usuario\Desktop\Pagina Iglesia Alex\WTT"

# 2. Iniciar Docker (si no está corriendo)
npm run docker:up

# 3. Iniciar desarrollo
npm run dev
```

### Al terminar de trabajar:

```powershell
# Presionar Ctrl + C para detener npm run dev

# Opcional: Detener Docker (si no lo necesitas)
npm run docker:down
```

---

## 🔍 Comandos de Verificación

### Verificar ruta actual:
```powershell
pwd
```

### Verificar que Docker está corriendo:
```powershell
docker ps
```

### Verificar que los servicios están corriendo:
- Abrir navegador: http://localhost:3000
- Debe mostrar la página principal

### Verificar archivo .env existe:
```powershell
Test-Path .env
# Debe retornar: True
```

---

## 🆘 Solución de Problemas

### Error: "No estoy en la ruta correcta"
```powershell
cd "C:\Users\Usuario\Desktop\Pagina Iglesia Alex\WTT"
```

### Error: "Docker no está corriendo"
```powershell
# Verificar Docker Desktop está abierto
# Luego:
npm run docker:up
```

### Error: "Puerto en uso"
```powershell
# Ver qué está usando el puerto 3000 o 3001
netstat -ano | findstr :3000
netstat -ano | findstr :3001

# Matar el proceso (reemplaza <PID>)
taskkill /PID <PID> /F
```

### Error: "Module not found"
```powershell
# Reinstalar dependencias
npm install
```

---

## 📚 Documentación Completa

- **GUIA_PRINCIPIANTE.md** - Explicación detallada de todo
- **DEPLOY.md** - Cómo hacer deploy a producción
- **ARCHITECTURE.md** - Arquitectura del sistema
- **QUICKSTART.md** - Inicio rápido

---

## 💡 Tips

1. **Siempre verifica la ruta** antes de ejecutar comandos
2. **Docker Desktop debe estar abierto** para que funcione
3. **Ctrl + C** detiene los servicios en desarrollo
4. **Guarda este archivo** para referencia rápida

