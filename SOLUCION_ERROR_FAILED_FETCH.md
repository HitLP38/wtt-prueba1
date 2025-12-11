# 🔧 Solución: Error "Failed to fetch"

## 🔴 Problema
El frontend muestra "Failed to fetch" y no puede conectarse al backend del VPS.

## ✅ Soluciones Paso a Paso

---

## **PASO 1: Actualizar el código del Gateway en el VPS**

El código del gateway necesita estar actualizado para:
- Permitir CORS desde cualquier origen en desarrollo
- Escuchar en todas las interfaces (0.0.0.0)

### 1.1. Subir el archivo actualizado al VPS

**En tu PC (PowerShell):**

```powershell
cd "C:\Users\Usuario\Desktop\Pagina Iglesia Alex"
```

```powershell
scp "WTT\services\gateway\src\main.ts" root@149.33.24.31:/var/www/WTT/services/gateway/src/
```

### 1.2. Recompilar el gateway en el VPS

**Conéctate al VPS:**
```powershell
ssh root@149.33.24.31
```

**Una vez dentro del VPS:**
```bash
cd /var/www/WTT/services/gateway
node ../../node_modules/typescript/bin/tsc
```

### 1.3. Reiniciar el gateway con PM2

```bash
pm2 restart gateway
```

**Verificar que esté corriendo:**
```bash
pm2 status
pm2 logs gateway --lines 30
```

---

## **PASO 2: Verificar que el puerto 3001 esté abierto en el firewall**

**En el VPS:**
```bash
sudo ufw status
```

**Si el puerto 3001 no está permitido, ábrelo:**
```bash
sudo ufw allow 3001/tcp
sudo ufw reload
```

**Verificar de nuevo:**
```bash
sudo ufw status
```

Debes ver una línea como:
```
3001/tcp                   ALLOW       Anywhere
```

---

## **PASO 3: Verificar que el gateway esté escuchando correctamente**

**En el VPS:**
```bash
ss -tlnp | grep 3001
```

Debes ver algo como:
```
LISTEN 0      511         0.0.0.0:3001      0.0.0.0:*    users:(("node",pid=XXX,fd=XX))
```

**Importante:** Debe mostrar `0.0.0.0:3001`, no `127.0.0.1:3001` (localhost).

Si muestra `127.0.0.1:3001`, el gateway solo está escuchando localmente y no acepta conexiones externas.

---

## **PASO 4: Probar la conexión desde tu PC**

**En tu PC (PowerShell):**

```powershell
curl "http://149.33.24.31:3001/api/admin/dashboard?eventId=550e8400-e29b-41d4-a716-446655440000"
```

**Si funciona**, deberías ver un JSON con datos del evento.

**Si no funciona**, puede ser:
- El firewall está bloqueando
- El gateway no está corriendo
- Hay un problema de red

---

## **PASO 5: Verificar CORS en el navegador**

1. Abre tu navegador y ve a `http://localhost:3000/test-data`
2. Abre las **Herramientas de Desarrollador** (F12)
3. Ve a la pestaña **"Console"** o **"Consola"**
4. Busca errores relacionados con CORS

**Errores comunes:**
- `Access to fetch at '...' from origin '...' has been blocked by CORS policy`
- `Failed to fetch`

Si ves errores de CORS, el problema está en la configuración del gateway.

---

## **PASO 6: Verificar la URL en el frontend**

**En tu PC, verifica el archivo `.env.local`:**

```powershell
Get-Content "C:\Users\Usuario\Desktop\Pagina Iglesia Alex\WTT\apps\web\.env.local"
```

Debe mostrar:
```
NEXT_PUBLIC_API_URL=http://149.33.24.31:3001
```

**Si está diferente o no existe**, créalo o corrígelo.

---

## **PASO 7: Reiniciar el frontend**

**En tu PC (PowerShell):**

1. Detén el frontend si está corriendo (Ctrl + C)
2. Vuelve a iniciarlo:

```powershell
cd "C:\Users\Usuario\Desktop\Pagina Iglesia Alex\WTT"
npm run dev:web
```

3. Espera a que aparezca: `▲ Next.js ready on http://localhost:3000`
4. Abre `http://localhost:3000/test-data` en tu navegador

---

## 📋 Checklist de Diagnóstico

Ejecuta estos comandos y verifica cada punto:

### En el VPS:
- [ ] `pm2 status` - Gateway debe estar `online`
- [ ] `ss -tlnp | grep 3001` - Debe mostrar `0.0.0.0:3001`
- [ ] `sudo ufw status` - Debe mostrar `3001/tcp ALLOW`
- [ ] `curl http://localhost:3001/api/health` - Debe devolver `{"status":"ok"}`

### En tu PC:
- [ ] `curl "http://149.33.24.31:3001/api/health"` - Debe devolver `{"status":"ok"}`
- [ ] Archivo `.env.local` existe y tiene la URL correcta
- [ ] Frontend está corriendo en `http://localhost:3000`

### En el navegador:
- [ ] Abrir `http://localhost:3000/test-data`
- [ ] Abrir Herramientas de Desarrollador (F12)
- [ ] Revisar pestaña "Network" o "Red" para ver las peticiones
- [ ] Revisar pestaña "Console" o "Consola" para ver errores

---

## 🔍 Diagnóstico Detallado

### Si `curl` desde tu PC funciona pero el navegador no:

**Problema:** CORS o problema del navegador.

**Solución:**
1. Verifica que el gateway tenga CORS configurado correctamente
2. Limpia la caché del navegador (Ctrl + Shift + Delete)
3. Prueba en otro navegador o en modo incógnito

### Si `curl` desde tu PC NO funciona:

**Problema:** Firewall o el gateway no está accesible.

**Solución:**
1. Verifica el firewall del VPS (`sudo ufw status`)
2. Verifica que el gateway esté escuchando en `0.0.0.0:3001`
3. Verifica que el gateway esté corriendo (`pm2 status`)

### Si todo está bien pero sigue fallando:

**Problema:** Puede ser un problema de red o de configuración.

**Solución:**
1. Verifica que puedas hacer ping al VPS: `ping 149.33.24.31`
2. Verifica los logs del gateway: `pm2 logs gateway --lines 50`
3. Verifica los logs del frontend en la consola del navegador

---

## 📝 Comandos Rápidos de Referencia

### VPS:
```bash
# Estado del gateway
pm2 status

# Logs del gateway
pm2 logs gateway --lines 30

# Reiniciar gateway
pm2 restart gateway

# Verificar puerto
ss -tlnp | grep 3001

# Verificar firewall
sudo ufw status

# Abrir puerto si es necesario
sudo ufw allow 3001/tcp
sudo ufw reload
```

### Tu PC:
```powershell
# Probar conexión
curl "http://149.33.24.31:3001/api/health"

# Ver contenido de .env.local
Get-Content "C:\Users\Usuario\Desktop\Pagina Iglesia Alex\WTT\apps\web\.env.local"
```

---

¡Sigue estos pasos en orden y el problema debería resolverse! 🚀

