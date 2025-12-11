# 🔍 Verificar por qué Gateway no responde

## 🔴 Problema

Gateway está "online" en PM2 pero `curl` da "Connection refused".

---

## 🔍 Diagnóstico

Ejecuta estos comandos para verificar:

### **1. Verificar si algo está escuchando en el puerto 3001:**

```bash
ss -tlnp | grep 3001
# O
netstat -tlnp | grep 3001
```

**Si no muestra nada** → El gateway no está escuchando en el puerto 3001.

---

### **2. Ver logs recientes del Gateway:**

```bash
pm2 logs gateway --lines 50 --nostream
```

**Busca:**
- Errores al iniciar
- Mensaje de "Gateway running on: http://localhost:3001"
- Errores de conexión

---

### **3. Ver logs de error específicos:**

```bash
pm2 logs gateway --err --lines 50 --nostream
```

---

### **4. Verificar variable de entorno PORT:**

```bash
cd /var/www/WTT
cat .env | grep PORT
cat services/gateway/.env | grep PORT
```

---

### **5. Probar iniciar manualmente para ver errores:**

```bash
cd /var/www/WTT/services/gateway
node dist/services/gateway/src/main.js
```

**Esto mostrará errores directamente en la terminal.**

Presiona `Ctrl+C` para detener después de ver los errores.

---

## 🚀 Soluciones Posibles

### **Solución 1: Gateway está escuchando en otro puerto**

Si `ss -tlnp | grep 3001` no muestra nada pero hay algo en otro puerto:

```bash
# Ver todos los puertos ocupados por Node.js
ss -tlnp | grep node

# O ver todos los puertos del gateway
ss -tlnp | grep gateway
```

### **Solución 2: Error al iniciar (ver logs)**

Si los logs muestran errores, necesitamos verlos para solucionarlos.

### **Solución 3: Reiniciar completamente**

```bash
# Detener gateway
pm2 delete gateway

# Verificar archivo compilado
ls -la /var/www/WTT/services/gateway/dist/services/gateway/src/main.js

# Recompilar si es necesario
cd /var/www/WTT/services/gateway
node ../../node_modules/typescript/bin/tsc

# Reiniciar
cd /var/www/WTT
pm2 start ecosystem.config.js --only gateway

# Ver logs en tiempo real
pm2 logs gateway
```

---

## 📋 Comandos Rápidos

Ejecuta estos en orden:

```bash
# 1. Verificar puerto
ss -tlnp | grep 3001

# 2. Ver logs
pm2 logs gateway --lines 50 --nostream

# 3. Ver errores
pm2 logs gateway --err --lines 30 --nostream

# 4. Probar manualmente
cd /var/www/WTT/services/gateway
node dist/services/gateway/src/main.js
```

---

**Ejecuta estos comandos y comparte los resultados:**
1. `ss -tlnp | grep 3001`
2. `pm2 logs gateway --lines 30 --nostream`

