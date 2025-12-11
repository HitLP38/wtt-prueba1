# 📚 FASE 3: Configurar Proyecto - Explicación Detallada

## 🎯 Objetivo de esta Fase

Subir tu proyecto al VPS y configurarlo para que pueda conectarse a la base de datos y ejecutarse correctamente.

---

## 🔍 Paso 3.1: Subir Proyecto al VPS

### **¿Por qué necesitamos esto?**

Tu proyecto está en tu computadora local (Windows). Necesitas copiarlo al VPS para que pueda ejecutarse allí.

### **¿Qué método usar?**

Tienes 2 opciones:

#### **Opción A: Usando Git (RECOMENDADO)** ✅

**¿Por qué Git?**
- Control de versiones
- Fácil actualizar (solo `git pull`)
- Historial de cambios
- Trabajo en equipo

**Requisitos:**
- Tu proyecto debe estar en un repositorio Git (GitHub, GitLab, etc.)
- O puedes crear un repo ahora mismo

```bash
cd /var/www  # Directorio donde guardamos proyectos web
git clone tu_repositorio.git wtt
cd wtt
```

**Explicación:**
- `/var/www`: Directorio estándar para proyectos web en Linux
- `git clone`: Descarga el repositorio completo
- `wtt`: Nombre de la carpeta donde se clonará (puedes cambiar)
- `cd wtt`: Entrar al directorio del proyecto

#### **Opción B: Usando SCP (Simple Copy)** 📁

**¿Cuándo usar SCP?**
- Si no tienes Git configurado
- Si es tu primera vez subiendo
- Si prefieres copiar archivos directamente

**Desde tu máquina Windows (PowerShell):**

```bash
# Copiar todo el proyecto al VPS
scp -r "C:\Users\Usuario\Desktop\Pagina Iglesia Alex\WTT" root@tu_ip_vps:/var/www/
```

**Explicación:**
- `scp`: Secure Copy Protocol (copia segura por SSH)
- `-r`: Recursivo (copiar carpetas completas)
- `"ruta_local"`: Ruta de tu proyecto en Windows
- `root@tu_ip_vps:/var/www/`: Destino en el VPS
  - `root`: Usuario del VPS
  - `tu_ip_vps`: IP de tu VPS
  - `/var/www/`: Directorio destino

**Después de copiar, en el VPS:**
```bash
cd /var/www/WTT  # Entrar al proyecto
```

---

## 🔍 Paso 3.2: Crear Archivo de Variables de Entorno

### **¿Por qué necesitamos `.env`?**

El archivo `.env` contiene configuraciones sensibles y específicas del entorno:
- Contraseñas de base de datos
- URLs de servicios
- Claves secretas
- Configuraciones que cambian entre desarrollo/producción

**¿Por qué NO poner esto en el código?**
- Seguridad: No subir contraseñas a Git
- Flexibilidad: Diferentes configs para dev/prod
- Separación: Configuración separada del código

### **¿Qué contiene el archivo `.env`?**

```env
# Base de Datos
DB_HOST=localhost
DB_PORT=5432
DB_USER=wtt_user
DB_PASSWORD=tu_password_seguro_aqui
DB_NAME=wtt_db
```

**Explicación:**
- `DB_HOST`: Dónde está PostgreSQL (localhost = mismo servidor)
- `DB_PORT`: Puerto de PostgreSQL (5432 es el default)
- `DB_USER`: Usuario que creaste (`wtt_user`)
- `DB_PASSWORD`: **¡La contraseña real que configuraste!**
- `DB_NAME`: Base de datos (`wtt_db`)

```env
# Redis
REDIS_HOST=localhost
REDIS_PORT=6379
```

**Explicación:**
- `REDIS_HOST`: Dónde está Redis (localhost)
- `REDIS_PORT`: Puerto de Redis (6379 es el default)

```env
# Node Environment
NODE_ENV=development
```

**Explicación:**
- `development`: Modo desarrollo (logs detallados, sin optimizaciones)
- `production`: Modo producción (optimizado, menos logs)

```env
# Puerto del Gateway
GATEWAY_PORT=3000
```

**Explicación:**
- Puerto donde correrá el API Gateway (el punto de entrada)

```env
# JWT Secret (generar uno seguro)
JWT_SECRET=tu_jwt_secret_muy_seguro_aqui
```

**Explicación:**
- `JWT_SECRET`: Clave secreta para firmar tokens JWT (autenticación)
- **⚠️ IMPORTANTE**: Genera uno único y seguro
- Ejemplo: `openssl rand -base64 32` (genera uno aleatorio)

```env
# Otros
LOG_LEVEL=debug
```

**Explicación:**
- `debug`: Muestra logs detallados (útil para desarrollo)

### **Cómo crear el archivo:**

```bash
cd /var/www/wtt  # O donde esté tu proyecto

# Crear archivo .env
nano .env
```

**Dentro de nano, pega el contenido y modifica:**
1. `DB_PASSWORD`: Tu contraseña real de PostgreSQL
2. `JWT_SECRET`: Genera uno seguro

**Para generar JWT_SECRET seguro:**
```bash
openssl rand -base64 32
```

**Guardar:**
- `Ctrl + O` (guardar)
- `Enter` (confirmar nombre)
- `Ctrl + X` (salir)

---

## 🔍 Paso 3.3: Copiar .env a Cada Servicio

### **¿Por qué copiar a cada servicio?**

Cada microservicio necesita acceso a las variables de entorno:
- `gateway`: Necesita DB, Redis, JWT
- `eventos`: Necesita DB, Redis
- `matches`: Necesita DB, Redis
- `teams`: Necesita DB
- etc.

### **Comando:**

```bash
# Crear .env en cada servicio
cp .env services/gateway/.env
cp .env services/eventos/.env
cp .env services/matches/.env
cp .env services/teams/.env
cp .env services/inscriptions/.env
cp .env services/referees/.env
cp .env services/notifications/.env
cp .env services/players/.env
```

**Explicación:**
- `cp`: Comando para copiar archivos
- `.env`: Archivo origen (en la raíz)
- `services/gateway/.env`: Destino (dentro de cada servicio)

**¿Qué hace?**
Copia el mismo archivo `.env` a cada servicio para que todos tengan las mismas configuraciones.

---

## 🔍 Paso 3.4: Instalar Dependencias

### **¿Por qué instalar dependencias?**

Tu proyecto usa librerías externas (paquetes npm):
- `@nestjs/common`: Framework NestJS
- `typeorm`: ORM para base de datos
- `pg`: Cliente de PostgreSQL
- Y muchas más...

**`package.json`** lista todas las dependencias, pero necesitas instalarlas en el VPS.

### **Orden de instalación:**

#### **1. Primero: packages/common**

```bash
cd packages/common
npm install
npm run build
cd ../..
```

**Explicación:**
- `packages/common`: Paquete compartido entre servicios
- `npm install`: Descarga todas las dependencias
- `npm run build`: Compila TypeScript a JavaScript
- **¿Por qué primero?** Los otros servicios dependen de este

#### **2. Segundo: Cada Servicio**

```bash
cd services/gateway && npm install && cd ../..
cd services/eventos && npm install && cd ../..
cd services/matches && npm install && cd ../..
cd services/teams && npm install && cd ../..
cd services/inscriptions && npm install && cd ../..
cd services/referees && npm install && cd ../..
cd services/notifications && npm install && cd ../..
cd services/players && npm install && cd ../..
```

**Explicación:**
- `cd services/gateway`: Entrar al servicio
- `npm install`: Instalar dependencias de ese servicio
- `&&`: Ejecutar siguiente comando si el anterior tiene éxito
- `cd ../..`: Volver a la raíz del proyecto

**¿Qué hace `npm install`?**
1. Lee `package.json`
2. Descarga todos los paquetes listados
3. Los guarda en `node_modules/`
4. Crea `package-lock.json` (versiones exactas)

#### **3. Tercero: Dependencias Globales (si usas Turbo)**

```bash
# Si usas turbo, instalar dependencias globales
npm install
```

**Explicación:**
- Instala dependencias de la raíz del proyecto (Turbo, Prettier, etc.)

---

## 🎓 Conceptos Clave Aprendidos

1. **Git vs SCP**: Dos formas de subir código al servidor
2. **Variables de Entorno**: Configuración sensible fuera del código
3. **Microservicios**: Cada servicio necesita su propia configuración
4. **Dependencias**: Librerías externas que necesita el proyecto
5. **Orden de Instalación**: Primero lo compartido, luego lo específico

---

## 📋 Checklist de Seguridad

- ✅ Contraseñas en `.env` (no en el código)
- ✅ `.env` en `.gitignore` (no subir a Git)
- ✅ JWT Secret seguro y único
- ✅ Diferentes configs para dev/prod

---

## 🚀 Siguiente Paso

Una vez completada esta fase, tendrás:
- ✅ Proyecto en el VPS
- ✅ Variables de entorno configuradas
- ✅ Dependencias instaladas

**Luego seguimos con FASE 4: Crear datos de prueba**

---

## ❓ Preguntas Frecuentes

**P: ¿Puedo editar `.env` después?**
R: Sí, pero necesitas reiniciar los servicios para que tomen los cambios.

**P: ¿Por qué cada servicio necesita su `.env`?**
R: Porque cada servicio se ejecuta de forma independiente y lee su propio `.env`.

**P: ¿Qué pasa si falta una dependencia?**
R: El servicio no iniciará. Revisa los logs con `pm2 logs`.

**P: ¿Cuánto tarda instalar dependencias?**
R: Depende de la velocidad de internet, pero puede tardar 5-15 minutos.

---

**¿Listo para empezar? Comencemos por subir el proyecto al VPS.** 🚀

