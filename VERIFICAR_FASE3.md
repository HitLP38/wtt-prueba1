# ✅ Verificación FASE 3 - Checklist Completo

## 📋 Checklist de Verificación

### **✅ Paso 3.1: Proyecto Subido**
- [ ] Proyecto está en `/var/www/WTT`
- [ ] Archivos principales presentes (`package.json`, `services/`, `apps/`, `packages/`)

### **✅ Paso 3.2: Archivo .env Configurado**
- [ ] Archivo `.env` existe en la raíz
- [ ] `DB_PASSWORD` tiene la contraseña correcta
- [ ] `DB_USER`, `DB_NAME`, etc. configurados

### **✅ Paso 3.3: .env Copiado a Servicios**
- [ ] Cada servicio tiene su `.env`

### **✅ Paso 3.4: Dependencias Instaladas**
- [ ] `packages/common` compilado (carpeta `dist/` existe)
- [ ] Dependencias de servicios instaladas
- [ ] Dependencias globales instaladas

---

## 🔍 Comandos de Verificación

### **1. Verificar Estructura del Proyecto**

**Ruta: `/var/www/WTT#`**

```bash
# Ver estructura
ls -la

# Deberías ver:
# - package.json ✅
# - services/ ✅
# - apps/ ✅
# - packages/ ✅
# - .env ✅
```

---

### **2. Verificar .env en Cada Servicio**

**Ruta: `/var/www/WTT#`**

```bash
# Verificar que cada servicio tiene .env
ls services/gateway/.env
ls services/eventos/.env
ls services/matches/.env
ls services/teams/.env
ls services/inscriptions/.env
ls services/referees/.env
ls services/notifications/.env
ls services/players/.env
```

**Resultado esperado:** Cada comando debe mostrar el archivo (no error).

---

### **3. Verificar packages/common Compilado**

**Ruta: `/var/www/WTT#`**

```bash
# Verificar que packages/common está compilado
ls -la packages/common/dist/

# Deberías ver archivos .js y .d.ts
```

---

### **4. Verificar node_modules en Servicios**

**Ruta: `/var/www/WTT#`**

```bash
# Verificar que los servicios tienen node_modules
ls services/gateway/node_modules/ 2>/dev/null && echo "✅ Gateway tiene node_modules" || echo "❌ Gateway NO tiene node_modules"
ls services/eventos/node_modules/ 2>/dev/null && echo "✅ Eventos tiene node_modules" || echo "❌ Eventos NO tiene node_modules"
ls services/matches/node_modules/ 2>/dev/null && echo "✅ Matches tiene node_modules" || echo "❌ Matches NO tiene node_modules"
```

---

### **5. Verificación Completa (Script)**

**Ruta: `/var/www/WTT#`**

```bash
# Script de verificación completa
echo "=== Verificando FASE 3 ==="
echo ""
echo "1. Estructura del proyecto:"
[ -f package.json ] && echo "✅ package.json existe" || echo "❌ package.json NO existe"
[ -d services ] && echo "✅ services/ existe" || echo "❌ services/ NO existe"
[ -d packages ] && echo "✅ packages/ existe" || echo "❌ packages/ NO existe"
[ -f .env ] && echo "✅ .env existe" || echo "❌ .env NO existe"
echo ""
echo "2. packages/common compilado:"
[ -d packages/common/dist ] && echo "✅ dist/ existe" || echo "❌ dist/ NO existe"
echo ""
echo "3. .env en servicios:"
[ -f services/gateway/.env ] && echo "✅ gateway/.env" || echo "❌ gateway/.env"
[ -f services/eventos/.env ] && echo "✅ eventos/.env" || echo "❌ eventos/.env"
[ -f services/matches/.env ] && echo "✅ matches/.env" || echo "❌ matches/.env"
[ -f services/teams/.env ] && echo "✅ teams/.env" || echo "❌ teams/.env"
[ -f services/inscriptions/.env ] && echo "✅ inscriptions/.env" || echo "❌ inscriptions/.env"
[ -f services/referees/.env ] && echo "✅ referees/.env" || echo "❌ referees/.env"
[ -f services/notifications/.env ] && echo "✅ notifications/.env" || echo "❌ notifications/.env"
[ -f services/players/.env ] && echo "✅ players/.env" || echo "❌ players/.env"
echo ""
echo "4. node_modules en servicios:"
[ -d services/gateway/node_modules ] && echo "✅ gateway/node_modules" || echo "❌ gateway/node_modules"
[ -d services/eventos/node_modules ] && echo "✅ eventos/node_modules" || echo "❌ eventos/node_modules"
[ -d services/matches/node_modules ] && echo "✅ matches/node_modules" || echo "❌ matches/node_modules"
echo ""
echo "=== Verificación Completa ==="
```

---

## ✅ Criterios de Éxito

La FASE 3 es exitosa si:

1. ✅ Proyecto está en `/var/www/WTT`
2. ✅ Archivo `.env` existe y tiene las configuraciones correctas
3. ✅ Cada servicio tiene su archivo `.env`
4. ✅ `packages/common/dist/` existe (compilado)
5. ✅ Al menos algunos servicios tienen `node_modules/` instalados

---

## ⚠️ Si Algo Falla

- **Si falta `.env` en algún servicio:** Ejecuta `cp .env services/[nombre]/.env`
- **Si falta `dist/` en packages/common:** Compila con `node ../../node_modules/typescript/bin/tsc`
- **Si falta `node_modules` en servicios:** Ejecuta `cd services/[nombre] && npm install && cd ../..`

---

**Ejecuta el script de verificación para ver el estado completo.** 🔍

