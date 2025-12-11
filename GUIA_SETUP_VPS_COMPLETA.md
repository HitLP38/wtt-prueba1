# 🚀 Guía Completa de Setup en VPS

## 📋 Checklist de Configuración

### **FASE 1: Configuración Inicial del VPS** ⏱️ ~30 min
- [ ] Conectar al VPS
- [ ] Actualizar sistema
- [ ] Instalar Node.js y npm
- [ ] Instalar PostgreSQL
- [ ] Instalar Redis
- [ ] Instalar PM2
- [ ] Configurar firewall

### **FASE 2: Base de Datos PostgreSQL** ⏱️ ~15 min
- [ ] Crear base de datos
- [ ] Crear usuario
- [ ] Configurar permisos
- [ ] Probar conexión

### **FASE 3: Configuración del Proyecto** ⏱️ ~20 min
- [ ] Clonar/subir proyecto
- [ ] Configurar variables de entorno
- [ ] Instalar dependencias
- [ ] Crear datos de prueba (seed)

### **FASE 4: Ejecutar Backend** ⏱️ ~10 min
- [ ] Iniciar servicios
- [ ] Verificar que funcionen
- [ ] Probar endpoints

### **FASE 5: Visualización Mínima Frontend** ⏱️ ~20 min
- [ ] Configurar frontend
- [ ] Conectar con backend
- [ ] Crear vista mínima de prueba

---

## 🔧 FASE 1: Configuración Inicial del VPS

### **1.1 Conectar al VPS**

```bash
ssh root@tu_ip_vps
# O si usas usuario específico:
ssh usuario@tu_ip_vps
```

### **1.2 Actualizar Sistema**

```bash
sudo apt update
sudo apt upgrade -y
```

### **1.3 Instalar Node.js (v20 LTS)**

```bash
# Instalar Node.js v20
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Verificar instalación
node --version  # Debe mostrar v20.x.x
npm --version
```

### **1.4 Instalar PostgreSQL**

```bash
# Instalar PostgreSQL
sudo apt install -y postgresql postgresql-contrib

# Verificar que está corriendo
sudo systemctl status postgresql

# Si no está activo, iniciarlo
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

### **1.5 Instalar Redis**

```bash
# Instalar Redis
sudo apt install -y redis-server

# Verificar que está corriendo
sudo systemctl status redis

# Si no está activo, iniciarlo
sudo systemctl start redis-server
sudo systemctl enable redis-server

# Probar Redis
redis-cli ping  # Debe responder "PONG"
```

### **1.6 Instalar PM2 Globalmente**

```bash
sudo npm install -g pm2
```

### **1.7 Configurar Firewall (Opcional pero Recomendado)**

```bash
# Permitir puertos necesarios
sudo ufw allow 22/tcp    # SSH
sudo ufw allow 3000/tcp  # Gateway (ajustar según tu puerto)
sudo ufw allow 5432/tcp  # PostgreSQL (solo si necesitas acceso externo)
sudo ufw allow 6379/tcp  # Redis (solo si necesitas acceso externo)

# Activar firewall
sudo ufw enable
```

---

## 🗄️ FASE 2: Configurar Base de Datos PostgreSQL

### **2.1 Crear Base de Datos y Usuario**

```bash
# Acceder a PostgreSQL
sudo -u postgres psql

# Dentro de PostgreSQL, ejecutar:
```

```sql
-- Crear base de datos
CREATE DATABASE wtt_db;

-- Crear usuario
CREATE USER wtt_user WITH PASSWORD 'tu_password_seguro_aqui';

-- Dar permisos
GRANT ALL PRIVILEGES ON DATABASE wtt_db TO wtt_user;

-- Salir
\q
```

### **2.2 Configurar PostgreSQL para Conexiones Locales**

```bash
# Editar configuración de PostgreSQL
sudo nano /etc/postgresql/*/main/postgresql.conf

# Buscar y cambiar:
# listen_addresses = 'localhost'  (o '*' si necesitas acceso externo)
```

```bash
# Editar pg_hba.conf para permitir conexiones
sudo nano /etc/postgresql/*/main/pg_hba.conf

# Agregar línea:
# host    wtt_db    wtt_user    127.0.0.1/32    md5
```

```bash
# Reiniciar PostgreSQL
sudo systemctl restart postgresql
```
####### sudo systemctl restart postgresql@14-main
# verifica si esta corriendo
sudo systemctl status postgresql@14-main

### **2.3 Probar Conexión**

```bash
# Probar conexión
psql -h localhost -U wtt_user -d wtt_db

# Debe pedir password y conectarse
# Luego puedes probar:
SELECT version();
\q
```

---

## 📦 FASE 3: Configurar Proyecto

### **3.1 Subir Proyecto al VPS**

**Opción A: Usando Git (recomendado)**
```bash
cd /var/www  # O donde quieras el proyecto
git clone tu_repositorio.git wtt
cd wtt
```

**Opción B: Usando SCP desde tu máquina local**
```bash
# Desde tu máquina Windows (PowerShell)
scp -r "C:\Users\Usuario\Desktop\Pagina Iglesia Alex\WTT" root@tu_ip_vps:/var/www/
```

### **3.2 Crear Archivo de Variables de Entorno**

```bash
cd /var/www/wtt  # Ajustar ruta según donde esté

# Crear .env en la raíz del proyecto
nano .env
```

**Contenido del archivo `.env`:**

```env
# Base de Datos
DB_HOST=localhost
DB_PORT=5432
DB_USER=wtt_user
DB_PASSWORD=tu_password_seguro_aqui
DB_NAME=wtt_db

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379

# Node Environment
NODE_ENV=development

# Puerto del Gateway
GATEWAY_PORT=3000

# JWT Secret (generar uno seguro)
JWT_SECRET=tu_jwt_secret_muy_seguro_aqui

# Otros
LOG_LEVEL=debug
```

### **3.3 Copiar .env a Cada Servicio**

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

### **3.4 Instalar Dependencias**

```bash
# Desde la raíz del proyecto
cd /var/www/wtt

# Instalar dependencias de packages/common primero
cd packages/common
npm install
npm run build
cd ../..

# Instalar dependencias de cada servicio
cd services/gateway && npm install && cd ../..
cd services/eventos && npm install && cd ../..
cd services/matches && npm install && cd ../..
cd services/teams && npm install && cd ../..
cd services/inscriptions && npm install && cd ../..
cd services/referees && npm install && cd ../..
cd services/notifications && npm install && cd ../..
cd services/players && npm install && cd ../..

# Si usas turbo, instalar dependencias globales
npm install
```

---

## 🌱 FASE 4: Crear Datos de Prueba (SEED)

### **4.1 Crear Script de Seed**

Voy a crear un script SQL para insertar datos mínimos de prueba.

```bash
# Crear directorio para seeds
mkdir -p scripts/seeds
nano scripts/seeds/seed.sql
```

**Contenido del archivo `scripts/seeds/seed.sql`:**

```sql
-- Habilitar extensión para UUIDs
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Crear un Evento de Prueba
INSERT INTO events (id, name, description, "startDate", "endDate", "isActive", "createdAt", "updatedAt")
VALUES (
  uuid_generate_v4(),
  'Confraternidad UNI 2025',
  'Torneo de tenis de mesa - Confraternidad UNI 2025',
  '2025-12-20 09:30:00',
  '2025-12-20 18:00:00',
  true,
  NOW(),
  NOW()
) ON CONFLICT DO NOTHING;

-- Obtener ID del evento creado (ajustar según tu lógica)
-- Por ahora, usaremos el primer evento

-- 2. Crear Mesas de Prueba (3 mesas)
INSERT INTO tables (id, "eventId", "tableNumber", "isActive", status, "createdAt", "updatedAt")
SELECT
  uuid_generate_v4(),
  (SELECT id FROM events LIMIT 1),
  table_num,
  true,
  'available',
  NOW(),
  NOW()
FROM generate_series(1, 3) AS table_num
ON CONFLICT DO NOTHING;

-- 3. Crear Árbitros de Prueba
INSERT INTO referees (id, "clerkId", "firstName", "lastName", email, "isActive", "createdAt", "updatedAt")
VALUES
  (uuid_generate_v4(), 'referee_1', 'Juan', 'Pérez', 'juan.perez@example.com', true, NOW(), NOW()),
  (uuid_generate_v4(), 'referee_2', 'María', 'González', 'maria.gonzalez@example.com', true, NOW(), NOW())
ON CONFLICT DO NOTHING;

-- 4. Habilitar árbitros para el evento
INSERT INTO event_referees (id, "eventId", "refereeId", "isEnabled", "createdAt", "updatedAt")
SELECT
  uuid_generate_v4(),
  (SELECT id FROM events LIMIT 1),
  r.id,
  true,
  NOW(),
  NOW()
FROM referees r
ON CONFLICT DO NOTHING;

-- Ver datos insertados
SELECT 'Events:' as tipo, COUNT(*) as cantidad FROM events
UNION ALL
SELECT 'Tables:', COUNT(*) FROM tables
UNION ALL
SELECT 'Referees:', COUNT(*) FROM referees
UNION ALL
SELECT 'Event Referees:', COUNT(*) FROM event_referees;
```

### **4.2 Ejecutar Script de Seed**

```bash
# Ejecutar script SQL
psql -h localhost -U wtt_user -d wtt_db -f scripts/seeds/seed.sql
```

---

## 🚀 FASE 5: Ejecutar Backend

### **5.1 Compilar Proyectos**

```bash
cd /var/www/wtt

# Compilar packages/common
cd packages/common
npm run build
cd ../..

# Compilar cada servicio (si es necesario)
cd services/gateway && npm run build && cd ../..
cd services/eventos && npm run build && cd ../..
cd services/matches && npm run build && cd ../..
cd services/teams && npm run build && cd ../..
cd services/inscriptions && npm run build && cd ../..
cd services/referees && npm run build && cd ../..
cd services/notifications && npm run build && cd ../..
cd services/players && npm run build && cd ../..
```

### **5.2 Iniciar con PM2**

```bash
cd /var/www/wtt

# Usar ecosystem.config.js
pm2 start ecosystem.config.js

# O iniciar servicios individualmente:
pm2 start services/gateway/dist/main.js --name gateway
pm2 start services/eventos/dist/main.js --name eventos
pm2 start services/matches/dist/main.js --name matches
pm2 start services/teams/dist/main.js --name teams
pm2 start services/inscriptions/dist/main.js --name inscriptions
pm2 start services/referees/dist/main.js --name referees
pm2 start services/notifications/dist/main.js --name notifications

# Ver estado
pm2 status
pm2 logs
```

### **5.3 Verificar que Funcionen**

```bash
# Probar endpoint del gateway
curl http://localhost:3000/health

# Ver logs
pm2 logs gateway
```

---

## 🎨 FASE 6: Visualización Mínima Frontend

### **6.1 Crear Página de Prueba para Ver Datos**

Voy a crear una página simple para visualizar los datos de prueba.

### **6.2 Configurar Variables de Entorno Frontend**

```bash
cd apps/web

# Crear .env.local
nano .env.local
```

**Contenido:**

```env
NEXT_PUBLIC_API_URL=http://tu_ip_vps:3000
```

### **6.3 Crear Vista Mínima de Prueba**

Te voy a crear una página de prueba para ver eventos, mesas, y árbitros.

---

## 📝 Próximos Pasos Después del Setup

1. **Probar CRUD completo**
2. **Crear más datos de prueba**
3. **Implementar paneles frontend**
4. **Configurar autenticación**
5. **Agregar WebSockets**

---

**¿Quieres que continúe creando el script de seed completo y la página de prueba para visualizar datos?**

