# 🚀 Guía de Deploy a Producción

## 📍 Ruta donde trabajar (SIEMPRE)

```
C:\Users\Usuario\Desktop\Pagina Iglesia Alex\WTT
```

**IMPORTANTE:** Todos los comandos se ejecutan desde esta carpeta.

---

## 🎯 Pasos para Deploy

### Paso 1: Preparar el código localmente

```powershell
# 1. Asegúrate de estar en la ruta correcta
cd "C:\Users\Usuario\Desktop\Pagina Iglesia Alex\WTT"

# 2. Verificar que todo funciona
npm run build

# 3. Hacer commit de los cambios
git add .
git commit -m "Preparar para deploy"
git push origin main
```

### Paso 2: En el servidor (tu amigo te dará acceso)

Tu amigo necesitará:

1. **Acceso SSH al servidor** (te dará usuario y contraseña o clave)
2. **Configuración del dominio** (DNS)
3. **Variables de entorno de producción**

### Paso 3: Configurar el servidor

#### Si el servidor tiene Docker:

```bash
# 1. Conectarse al servidor (SSH)
ssh usuario@tu-servidor.com

# 2. Clonar o actualizar el repositorio
cd /ruta/donde/quieres/el/proyecto
git clone https://github.com/tu-usuario/WTT.git
# O si ya existe:
cd WTT
git pull origin main

# 3. Instalar dependencias
npm install

# 4. Crear archivo .env de producción
nano .env
# Pegar las variables que te dé tu amigo

# 5. Iniciar servicios
npm run docker:up
npm run build
npm run start
```

#### Si el servidor NO tiene Docker:

```bash
# 1. Instalar PostgreSQL y Redis en el servidor
# (Tu amigo puede hacerlo o darte instrucciones)

# 2. Clonar repositorio
git clone https://github.com/tu-usuario/WTT.git
cd WTT

# 3. Instalar dependencias
npm install

# 4. Crear .env con credenciales del servidor
nano .env
# Usar las credenciales de PostgreSQL y Redis del servidor

# 5. Construir y ejecutar
npm run build
npm run start
```

### Paso 4: Configurar dominio

Tu amigo configurará:
- **DNS:** Apuntar tu dominio al servidor
- **Nginx/Apache:** Configurar proxy reverso (opcional pero recomendado)
- **SSL/HTTPS:** Certificado SSL (Let's Encrypt es gratis)

---

## 🔐 Variables de Entorno para Producción

Crea un archivo `.env` en el servidor con:

```env
# Database (valores del servidor)
DB_HOST=localhost
DB_PORT=5432
DB_USER=wtt_prod_user
DB_PASSWORD=tu_password_seguro
DB_NAME=wtt_prod_db

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379

# Services Ports
GATEWAY_PORT=3001
EVENTOS_PORT=3002
INSCRIPTIONS_PORT=3003
TEAMS_PORT=3004
MATCHES_PORT=3005

# Frontend
FRONTEND_URL=https://tu-dominio.com
NEXT_PUBLIC_API_URL=https://api.tu-dominio.com

# Clerk Auth (producción)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_...
CLERK_SECRET_KEY=sk_live_...

# Environment
NODE_ENV=production
```

---

## 📦 Opciones de Hosting

### Opción 1: Servidor VPS (Tu amigo)
- **Ventaja:** Control total
- **Desventaja:** Necesitas configurar todo

### Opción 2: Railway.app (Recomendado para principiantes)
- **Ventaja:** Muy fácil, despliegue automático
- **Desventaja:** Puede ser más caro
- **URL:** https://railway.app

### Opción 3: Render.com
- **Ventaja:** Fácil, incluye PostgreSQL y Redis gratis
- **Desventaja:** Servicios gratuitos son lentos
- **URL:** https://render.com

### Opción 4: Vercel (Frontend) + Railway (Backend)
- **Ventaja:** Optimizado para Next.js
- **Desventaja:** Dos servicios que mantener

---

## 🔄 Proceso de Actualización

Cuando hagas cambios y quieras actualizar producción:

```powershell
# 1. En tu computadora (ruta: WTT)
cd "C:\Users\Usuario\Desktop\Pagina Iglesia Alex\WTT"

# 2. Hacer cambios y commit
git add .
git commit -m "Descripción de los cambios"
git push origin main

# 3. En el servidor
ssh usuario@servidor
cd /ruta/WTT
git pull origin main
npm install
npm run build
# Reiniciar servicios (depende de cómo los estés ejecutando)
```

---

## 📝 Checklist antes de Deploy

- [ ] Código funciona localmente
- [ ] `npm run build` funciona sin errores
- [ ] Variables de entorno configuradas
- [ ] Base de datos de producción creada
- [ ] Clerk configurado para producción
- [ ] Dominio configurado
- [ ] SSL/HTTPS configurado
- [ ] Backups configurados

---

## 🆘 Problemas Comunes

### Error: "Cannot connect to database"
- Verifica que PostgreSQL está corriendo
- Verifica credenciales en `.env`
- Verifica que el firewall permite la conexión

### Error: "Port already in use"
- Cambia los puertos en `.env`
- O detén el proceso que está usando el puerto

### Error: "Module not found"
- Ejecuta `npm install` en el servidor
- Verifica que `node_modules` existe

---

## 📞 Información que necesitas de tu amigo

1. **Credenciales SSH** (usuario, contraseña/clave)
2. **Ruta donde desplegar** (`/var/www/wtt` o similar)
3. **Credenciales de PostgreSQL** (host, usuario, contraseña, base de datos)
4. **Credenciales de Redis** (si aplica)
5. **URL del dominio** (`https://tu-dominio.com`)
6. **Puertos disponibles** (3000, 3001, etc.)
7. **Si tiene Docker instalado** (sí/no)

---

## 🎓 Recursos para Aprender

- **Docker:** https://docs.docker.com/get-started/
- **Git:** https://git-scm.com/doc
- **Node.js Deploy:** https://nodejs.org/en/docs/guides/nodejs-docker-webapp/
- **Next.js Deploy:** https://nextjs.org/docs/deployment

