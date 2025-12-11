# 🔧 Solución: Connection Refused en Gateway

## ❌ Problema

```
curl: (7) Failed to connect to localhost port 3001 after 0 ms: Connection refused
```

Esto significa que el servicio Gateway **no está corriendo** o no está escuchando en el puerto 3001.

---

## 🔍 Diagnóstico Rápido

Ejecuta estos comandos **en el VPS** para diagnosticar:

### **1. Verificar estado de PM2:**

```bash
pm2 status
```

**Busca:**
- ¿Aparece `gateway` en la lista?
- ¿Cuál es su estado? (online, errored, stopped)

### **2. Ver logs del Gateway:**

```bash
pm2 logs gateway --lines 30 --nostream
```

**Busca errores como:**
- Errores de conexión
- Errores de compilación
- Puertos en uso

### **3. Verificar si algo está escuchando en el puerto 3001:**

```bash
ss -tlnp | grep 3001
# O
netstat -tlnp | grep 3001
```

Si **no hay nada**, el servicio no está corriendo.

---

## 🚀 Soluciones

### **Solución 1: Reiniciar Gateway**

```bash
cd /var/www/WTT
pm2 restart gateway
pm2 logs gateway --lines 20
```

### **Solución 2: Si no está en la lista de PM2, iniciarlo**

```bash
cd /var/www/WTT
pm2 start ecosystem.config.js --only gateway
pm2 logs gateway --lines 20
```

### **Solución 3: Verificar que el archivo compilado existe**

```bash
ls -la /var/www/WTT/services/gateway/dist/services/gateway/src/main.js
```

**Si no existe:**
```bash
cd /var/www/WTT/services/gateway
node ../../node_modules/typescript/bin/tsc
cd /var/www/WTT
pm2 restart gateway
```

### **Solución 4: Verificar Redis está corriendo**

```bash
sudo systemctl status redis
# O
redis-cli ping
```

**Debería responder:** `PONG`

Si Redis no está corriendo:
```bash
sudo systemctl start redis
sudo systemctl enable redis
```

---

## 📋 Checklist Rápido

```bash
# 1. Ver estado PM2
pm2 status

# 2. Ver logs
pm2 logs gateway --lines 30

# 3. Verificar puerto
ss -tlnp | grep 3001

# 4. Verificar Redis
redis-cli ping

# 5. Reiniciar si es necesario
pm2 restart gateway
```

---

## ⚠️ Si el servicio tiene errores

Si ves errores en los logs, comparte el error y te ayudo a solucionarlo.

**Comandos útiles:**
```bash
# Ver solo errores
pm2 logs gateway --err --lines 50

# Ver todo
pm2 logs gateway --lines 50
```

---

**Ejecuta estos comandos y comparte los resultados:**
1. `pm2 status`
2. `pm2 logs gateway --lines 30 --nostream`

