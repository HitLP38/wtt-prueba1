# 📚 FASE 2: Configurar Base de Datos PostgreSQL - Explicación Detallada

## 🎯 Objetivo de esta Fase

Crear y configurar una base de datos PostgreSQL donde se almacenará toda la información de tu sistema:
- Eventos de tenis de mesa
- Equipos y jugadores
- Partidos y resultados
- Árbitros y mesas
- Configuraciones del sistema

---

## 🔍 Paso 2.1: Crear Base de Datos y Usuario

### **¿Por qué necesitamos esto?**

PostgreSQL viene instalado, pero está vacío. Necesitamos:

1. **Crear una base de datos específica** para nuestro proyecto (`wtt_db`)
   - Una base de datos es como un "contenedor" donde guardamos todas nuestras tablas
   - Separar nuestros datos de otros proyectos o aplicaciones

2. **Crear un usuario específico** (`wtt_user`)
   - Por seguridad: no usar el usuario `postgres` (superadmin)
   - Principio de menor privilegio: solo los permisos necesarios
   - Fácil de auditar y gestionar

3. **Dar permisos** al usuario sobre la base de datos
   - Sin permisos, el usuario no puede crear/leer/modificar datos
   - `ALL PRIVILEGES` le da control completo sobre `wtt_db`

### **¿Qué hace cada comando?**

```bash
# Acceder a PostgreSQL como usuario postgres (el superadmin)
sudo -u postgres psql
```

**Explicación:**
- `sudo -u postgres`: Ejecuta como usuario `postgres` (el administrador de PostgreSQL)
- `psql`: Es el cliente de línea de comandos para PostgreSQL
- Esto nos da acceso a la consola SQL de PostgreSQL

**Dentro de PostgreSQL, ejecutamos comandos SQL:**

```sql
-- Crear base de datos
CREATE DATABASE wtt_db;
```

**Explicación:**
- `CREATE DATABASE`: Comando SQL para crear una nueva base de datos
- `wtt_db`: Nombre de nuestra base de datos (WTT = World Table Tennis)
- PostgreSQL crea un nuevo "espacio" donde guardaremos nuestras tablas

```sql
-- Crear usuario
CREATE USER wtt_user WITH PASSWORD 'tu_password_seguro_aqui';
```

**Explicación:**
- `CREATE USER`: Crea un nuevo usuario en PostgreSQL
- `wtt_user`: Nombre del usuario que usará nuestra aplicación
- `WITH PASSWORD`: Establece la contraseña del usuario
- **⚠️ IMPORTANTE**: Cambia `'tu_password_seguro_aqui'` por una contraseña REAL y SEGURA
  - Mínimo 12 caracteres
  - Letras mayúsculas, minúsculas, números, símbolos
  - Ejemplo: `'Wtt2025!Secure#Pass'`

```sql
-- Dar permisos
GRANT ALL PRIVILEGES ON DATABASE wtt_db TO wtt_user;
```

**Explicación:**
- `GRANT`: Otorga permisos
- `ALL PRIVILEGES`: Todos los permisos (crear tablas, insertar, leer, modificar, eliminar)
- `ON DATABASE wtt_db`: Sobre la base de datos `wtt_db`
- `TO wtt_user`: Al usuario `wtt_user`
- Esto permite que nuestra aplicación pueda trabajar con la base de datos

```sql
-- Salir
\q
```

**Explicación:**
- `\q`: Comando especial de `psql` para salir
- `\` indica que es un comando de `psql`, no SQL estándar

---

## 🔍 Paso 2.2: Configurar PostgreSQL para Conexiones Locales

### **¿Por qué necesitamos esto?**

Por defecto, PostgreSQL solo acepta conexiones desde el mismo servidor (`localhost`). Pero necesitamos configurar:

1. **`postgresql.conf`**: Dónde escucha PostgreSQL (puerto, direcciones IP)
2. **`pg_hba.conf`**: Quién puede conectarse y cómo (autenticación)

### **¿Qué hace cada configuración?**

#### **A) Configurar `postgresql.conf`**

```bash
sudo nano /etc/postgresql/*/main/postgresql.conf
```

**Explicación:**
- `/etc/postgresql/*/main/`: Ruta donde está la configuración
  - `*` es la versión (ej: `14`)
  - `main` es el cluster (instancia) de PostgreSQL
- `nano`: Editor de texto simple en terminal
- Buscar la línea: `listen_addresses = 'localhost'`

**¿Qué cambiar?**
- `'localhost'`: Solo acepta conexiones desde el mismo servidor ✅ (RECOMENDADO para desarrollo)
- `'*'`: Acepta conexiones desde cualquier IP ⚠️ (Solo si necesitas acceso externo)

**Para desarrollo local en el VPS, dejamos `'localhost'`.**

#### **B) Configurar `pg_hba.conf` (Host-Based Authentication)**

```bash
sudo nano /etc/postgresql/*/main/pg_hba.conf
```

**Explicación:**
- `pg_hba.conf`: Define reglas de autenticación (quién puede conectarse)
- Formato: `TIPO DATABASE USER ADDRESS METHOD`

**Agregar esta línea:**
```
host    wtt_db    wtt_user    127.0.0.1/32    md5
```

**Desglose:**
- `host`: Conexión TCP/IP (red)
- `wtt_db`: Nombre de la base de datos
- `wtt_user`: Nombre del usuario
- `127.0.0.1/32`: Dirección IP permitida
  - `127.0.0.1` = localhost (mismo servidor)
  - `/32` = máscara de red (solo esa IP exacta)
- `md5`: Método de autenticación (contraseña encriptada)

**¿Qué hace?**
Permite que `wtt_user` se conecte a `wtt_db` desde `localhost` usando contraseña.

#### **C) Reiniciar PostgreSQL**

```bash
sudo systemctl restart postgresql
```

**Explicación:**
- `systemctl restart`: Reinicia un servicio del sistema
- `postgresql`: El servicio de PostgreSQL
- **¿Por qué?** Los cambios en archivos de configuración requieren reinicio para aplicarse

**Alternativa más precisa:**
```bash
sudo systemctl restart postgresql@14-main
```
Esto reinicia solo el cluster específico de PostgreSQL 14.

---

## 🔍 Paso 2.3: Probar Conexión

### **¿Por qué probar?**

Antes de continuar, debemos verificar que:
1. La base de datos existe
2. El usuario puede conectarse
3. La autenticación funciona
4. Los permisos están correctos

### **¿Qué hace el comando?**

```bash
psql -h localhost -U wtt_user -d wtt_db
```

**Desglose:**
- `psql`: Cliente de PostgreSQL
- `-h localhost`: Host (servidor) donde está PostgreSQL
- `-U wtt_user`: Usuario con el que conectarse
- `-d wtt_db`: Base de datos a la que conectarse

**Lo que pasará:**
1. Te pedirá la contraseña que configuraste
2. Si es correcta, entrarás a la consola de PostgreSQL
3. Verás el prompt: `wtt_db=>`

**Dentro de PostgreSQL, puedes probar:**
```sql
-- Ver versión de PostgreSQL
SELECT version();

-- Ver bases de datos (deberías ver wtt_db)
\l

-- Salir
\q
```

**Si funciona:**
- ✅ Base de datos creada correctamente
- ✅ Usuario creado correctamente
- ✅ Permisos configurados correctamente
- ✅ Autenticación funcionando

**Si falla:**
- Revisar contraseña
- Verificar que el usuario existe: `\du` (dentro de `psql` como postgres)
- Verificar permisos: `\l` (dentro de `psql` como postgres)

---

## 🎓 Conceptos Clave Aprendidos

1. **Base de Datos**: Contenedor lógico donde se almacenan las tablas
2. **Usuario**: Identidad para autenticarse y autorizarse
3. **Permisos**: Qué puede hacer cada usuario
4. **Autenticación**: Verificar identidad (contraseña)
5. **Autorización**: Qué recursos puede usar el usuario autenticado

---

## 📋 Checklist de Seguridad

- ✅ Usar contraseña segura (no la default)
- ✅ Usuario específico (no `postgres`)
- ✅ Permisos mínimos necesarios
- ✅ Solo conexiones locales (localhost) por ahora
- ✅ Método de autenticación seguro (md5)

---

## 🚀 Siguiente Paso

Una vez que hayas completado esta fase, tendrás:
- Base de datos `wtt_db` lista
- Usuario `wtt_user` con permisos
- Conexión funcionando

**Luego seguimos con FASE 3: Configurar el proyecto**

---

## ❓ Preguntas Frecuentes

**P: ¿Por qué no usar el usuario `postgres` directamente?**
R: Por seguridad. `postgres` es superadmin y puede hacer cualquier cosa. Si alguien lo compromete, tiene acceso total.

**P: ¿Qué pasa si olvido la contraseña?**
R: Puedes cambiarla como `postgres`: `ALTER USER wtt_user WITH PASSWORD 'nueva_password';`

**P: ¿Puedo crear múltiples bases de datos?**
R: Sí, cada proyecto puede tener su propia base de datos.

**P: ¿Por qué `127.0.0.1/32` y no `localhost`?**
R: `127.0.0.1/32` es más específico. `localhost` puede resolverse a IPv4 o IPv6 y causar confusión.

---

**¿Listo para empezar? Ejecuta los comandos explicados arriba.** 🚀

