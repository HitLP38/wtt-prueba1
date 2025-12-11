# 🔧 Solución: PostgreSQL "active (exited)"

## ⚠️ Problema Detectado

PostgreSQL muestra `active (exited)` porque `postgresql.service` es solo un wrapper. El servicio real es `postgresql@<version>-main.service`.

---

## 🔧 Solución: Iniciar el Servicio Real

### **PASO 1: Verificar Versión de PostgreSQL Instalada** ✅

```bash
# Ver qué versión de PostgreSQL se instaló
psql --version

# O ver servicios de PostgreSQL disponibles
systemctl list-units | grep postgresql
```

### **PASO 2: Iniciar el Servicio Real de PostgreSQL** ✅

```bash
# En Ubuntu 22.04, normalmente es PostgreSQL 14
# Iniciar el servicio específico
sudo systemctl start postgresql@14-main

# Habilitar para que inicie automáticamente
sudo systemctl enable postgresql@14-main

# Verificar que está corriendo
sudo systemctl status postgresql@14-main
```

### **PASO 3: Verificar Estado** ✅

```bash
# Verificar que el servicio esté "active (running)" (no "exited")
sudo systemctl status postgresql@14-main
```

**Deberías ver:**
- `Active: active (running)`
- Un proceso de PostgreSQL corriendo

---

## 📋 Comandos Todo-en-Uno

```bash
# 1. Ver versión
psql --version

# 2. Ver servicios disponibles
systemctl list-units --all | grep postgresql

# 3. Iniciar servicio (ajustar versión si es necesario)
sudo systemctl start postgresql@14-main
sudo systemctl enable postgresql@14-main

# 4. Verificar
sudo systemctl status postgresql@14-main
```

---

## 🔍 Si la Versión es Diferente

### **PostgreSQL 13:**
```bash
sudo systemctl start postgresql@13-main
sudo systemctl enable postgresql@13-main
```

### **PostgreSQL 15:**
```bash
sudo systemctl start postgresql@15-main
sudo systemctl enable postgresql@15-main
```

---

## ✅ Verificar que Funciona

```bash
# Probar conexión a PostgreSQL
sudo -u postgres psql -c "SELECT version();"
```

**Debería mostrar la versión de PostgreSQL.**

---

## 🚨 Si No Funciona

Si ninguna versión funciona, reinstalar PostgreSQL:

```bash
sudo apt remove --purge postgresql* -y
sudo apt install -y postgresql postgresql-contrib
sudo systemctl start postgresql@14-main
sudo systemctl enable postgresql@14-main
```

---

**Ejecuta primero `psql --version` para ver qué versión tienes, luego inicia el servicio correspondiente.** 🚀

