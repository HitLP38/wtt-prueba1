# 🔧 Solución: Node.js Versión Antigua (v12)

## ⚠️ Problema Detectado

- Tienes Node.js **v12.22.9** (muy antiguo)
- Necesitamos Node.js **v20 LTS**
- npm no está instalado

---

## 🔧 Solución: Reinstalar Node.js v20

### **PASO 1: Desinstalar Node.js Actual** ✅

```bash
# Desinstalar Node.js y npm actuales
sudo apt remove --purge nodejs npm -y

# Limpiar cache
sudo apt autoremove -y
sudo apt autoclean
```

### **PASO 2: Agregar Repositorio NodeSource para v20** ✅

```bash
# Agregar repositorio oficial de NodeSource para Node.js v20
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
```

### **PASO 3: Instalar Node.js v20** ✅

```bash
# Instalar Node.js v20 (incluye npm automáticamente)
sudo apt install -y nodejs
```

### **PASO 4: Verificar Instalación** ✅

```bash
# Verificar versiones
node --version  # Debe mostrar v20.x.x
npm --version   # Debe mostrar 10.x.x o superior
```

---

## 📋 Comandos Todo-en-Uno

Copia y pega estos comandos en orden:

```bash
# 1. Desinstalar versión antigua
sudo apt remove --purge nodejs npm -y
sudo apt autoremove -y

# 2. Agregar repositorio NodeSource v20
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -

# 3. Instalar Node.js v20
sudo apt install -y nodejs

# 4. Verificar
node --version
npm --version
```

---

## ✅ Resultado Esperado

Después de ejecutar los comandos deberías ver:

```
node --version
v20.11.0  (o similar v20.x.x)

npm --version
10.2.4  (o similar 10.x.x)
```

---

## 🚨 Si Hay Errores

### Error: "Repository already exists"
```bash
# Limpiar y volver a agregar
sudo rm -f /etc/apt/sources.list.d/nodesource.list
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
```

### Error: "GPG key"
```bash
# Actualizar claves GPG
sudo apt-key adv --keyserver keyserver.ubuntu.com --recv-keys 68576280
sudo apt update
sudo apt install -y nodejs
```

---

**Ejecuta los comandos del PASO 1-4 y me dices qué versión te muestra.** 🚀

