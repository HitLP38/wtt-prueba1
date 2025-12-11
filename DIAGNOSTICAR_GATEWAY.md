# 🔍 Diagnosticar Problema con Gateway

## ❌ Error: Connection refused

Esto significa que el servicio Gateway no está corriendo o no está escuchando en el puerto correcto.

---

## 🔧 Pasos para Diagnosticar

### **Paso 1: Verificar que PM2 está corriendo**

```bash
pm2 status
```

**Busca:**
- ¿Está el servicio `gateway` en la lista?
- ¿Cuál es su estado? (online, errored, stopped)

---

### **Paso 2: Ver logs del Gateway**

```bash
pm2 logs gateway --lines 50 --nostream
```

**Busca errores como:**
- Errores de conexión a Redis
- Errores de conexión a PostgreSQL
- Errores de compilación
- Errores de puerto en uso

---

### **Paso 3: Verificar en qué puerto está escuchando**

```bash
# Ver procesos en el puerto 3001
netstat -tlnp | grep 3001

# O con ss
ss -tlnp | grep 3001
```

**Si no hay nada en el puerto 3001:**
- El servicio no está corriendo
- O está en otro puerto

---

### **Paso 4: Verificar variables de entorno**

```bash
# Ver variables del gateway
cd /var/www/WTT
cat .env | grep GATEWAY_PORT
cat services/gateway/.env | grep PORT
```

---

### **Paso 5: Intentar iniciar manualmente**

```bash
cd /var/www/WTT/services/gateway
node dist/services/gateway/src/main.js
```

**Esto mostrará errores directamente en la terminal.**

---

## 🚀 Soluciones Comunes

### **Solución 1: Reiniciar el Gateway**

```bash
pm2 restart gateway
pm2 logs gateway --lines 20
```

### **Solución 2: Si el servicio no existe, iniciarlo**

```bash
cd /var/www/WTT
pm2 start ecosystem.config.js --only gateway
```

### **Solución 3: Verificar que el archivo compilado existe**

```bash
ls -la /var/www/WTT/services/gateway/dist/services/gateway/src/main.js
```

Si no existe, necesita compilar:
```bash
cd /var/www/WTT/services/gateway
node ../../node_modules/typescript/bin/tsc
```

### **Solución 4: Verificar Redis está corriendo**

```bash
sudo systemctl status redis
# O
redis-cli ping
```

Debería responder: `PONG`

---

## 📝 Comandos Rápidos

```bash
# Ver estado completo
pm2 status

# Ver logs del gateway
pm2 logs gateway --lines 50

# Reiniciar gateway
pm2 restart gateway

# Ver procesos en puerto 3001
ss -tlnp | grep 3001
```

---

¿Qué muestra cada comando?

