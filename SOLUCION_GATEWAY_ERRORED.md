# 🔴 Solución: Gateway en Estado "Errored"

## ❌ Problema Detectado

Los procesos de `gateway` están en estado **"errored"**:
- IDs: 0, 2, 4, 6
- Restarts: 119, 119, 116, 118 (están intentando reiniciarse constantemente)
- Memoria: 0b (no están corriendo)

---

## 🔍 Diagnóstico

Necesitamos ver los **logs de error** para saber qué está fallando.

---

## 🚀 Solución Paso a Paso

### **Paso 1: Ver logs de error del Gateway**

```bash
pm2 logs gateway --err --lines 50 --nostream
```

**Esto mostrará los errores específicos que están causando que el gateway falle.**

---

### **Paso 2: Posibles Causas y Soluciones**

#### **Causa A: Error de compilación o archivo faltante**

**Síntomas:** Error como "Cannot find module" o "File not found"

**Solución:**
```bash
cd /var/www/WTT/services/gateway
node ../../node_modules/typescript/bin/tsc
cd /var/www/WTT
pm2 restart gateway
```

#### **Causa B: Dependencia faltante (Clerk)**

**Síntomas:** Error como "Cannot find module '@clerk/clerk-sdk-node'"

**Solución:**
```bash
cd /var/www/WTT/services/gateway
npm install @clerk/clerk-sdk-node
cd /var/www/WTT
pm2 restart gateway
```

#### **Causa C: Error en el código (guards nuevos)**

**Síntomas:** Error de sintaxis o importación

**Solución:**
```bash
# Ver logs detallados
pm2 logs gateway --err --lines 100

# Recompilar
cd /var/www/WTT/services/gateway
node ../../node_modules/typescript/bin/tsc

# Ver errores de compilación
```

#### **Causa D: Redis no disponible**

**Síntomas:** Error de conexión a Redis

**Solución:**
```bash
# Verificar Redis
redis-cli ping

# Si no responde, iniciar Redis
sudo systemctl start redis
sudo systemctl enable redis

# Reiniciar gateway
pm2 restart gateway
```

---

### **Paso 3: Limpiar y Reiniciar**

Si los errores persisten:

```bash
# Detener todos los procesos de gateway
pm2 delete gateway

# Verificar que el archivo compilado existe
ls -la /var/www/WTT/services/gateway/dist/services/gateway/src/main.js

# Recompilar si es necesario
cd /var/www/WTT/services/gateway
node ../../node_modules/typescript/bin/tsc

# Reiniciar desde cero
cd /var/www/WTT
pm2 start ecosystem.config.js --only gateway

# Ver logs en tiempo real
pm2 logs gateway
```

---

## 📋 Comandos para Diagnosticar

Ejecuta estos comandos **en orden**:

```bash
# 1. Ver errores del gateway
pm2 logs gateway --err --lines 50 --nostream

# 2. Verificar Redis
redis-cli ping

# 3. Verificar archivo compilado
ls -la /var/www/WTT/services/gateway/dist/services/gateway/src/main.js

# 4. Verificar dependencias
cd /var/www/WTT/services/gateway
ls node_modules/@clerk/clerk-sdk-node 2>/dev/null || echo "Clerk no instalado"

# 5. Intentar compilar manualmente
cd /var/www/WTT/services/gateway
node ../../node_modules/typescript/bin/tsc
```

---

## ⚡ Solución Rápida

Si quieres una solución rápida, ejecuta:

```bash
# 1. Detener gateway
pm2 delete gateway

# 2. Recompilar
cd /var/www/WTT/services/gateway
node ../../node_modules/typescript/bin/tsc

# 3. Verificar errores de compilación (si hay)

# 4. Verificar dependencias
npm install @clerk/clerk-sdk-node

# 5. Reiniciar
cd /var/www/WTT
pm2 start ecosystem.config.js --only gateway

# 6. Ver logs
pm2 logs gateway --lines 30
```

---

**Ejecuta primero:** `pm2 logs gateway --err --lines 50 --nostream`

**Y comparte el error** para darte la solución específica.

