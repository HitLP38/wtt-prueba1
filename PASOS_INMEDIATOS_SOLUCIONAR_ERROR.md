# 🚨 Pasos Inmediatos para Solucionar "Failed to fetch"

## ⚡ Acción Rápida (5 minutos)

El error "Failed to fetch" se debe a que el gateway en el VPS necesita:
1. ✅ CORS actualizado (ya lo actualicé en tu código local)
2. ✅ Escuchar en todas las interfaces (ya lo configuré)
3. ❌ **FALTA:** Subir los cambios al VPS y reiniciar

---

## 📋 Pasos a Ejecutar AHORA:

### **1. Subir el archivo actualizado al VPS**

**En PowerShell (tu PC):**
```powershell
cd "C:\Users\Usuario\Desktop\Pagina Iglesia Alex"
```

```powershell
scp "WTT\services\gateway\src\main.ts" root@149.33.24.31:/var/www/WTT/services/gateway/src/
```

Cuando te pida la contraseña, ingrésala.

---

### **2. Conectarte al VPS y recompilar**

**En PowerShell:**
```powershell
ssh root@149.33.24.31
```

**Una vez dentro del VPS:**
```bash
cd /var/www/WTT/services/gateway
node ../../node_modules/typescript/bin/tsc
```

Espera a que termine la compilación (puede tardar unos segundos).

---

### **3. Reiniciar el gateway**

**Aún en el VPS:**
```bash
pm2 restart gateway
```

**Verificar que esté corriendo:**
```bash
pm2 status
```

Debes ver que `gateway` está `online`.

**Ver los logs para confirmar:**
```bash
pm2 logs gateway --lines 10
```

Debes ver mensajes como:
- `🚀 Gateway running on: http://0.0.0.0:3001`
- `🌐 CORS: Allowed from any origin (development)`

---

### **4. Verificar que el puerto esté abierto**

**Aún en el VPS:**
```bash
sudo ufw status
```

**Si NO ves una línea con `3001/tcp ALLOW`, ejecuta:**
```bash
sudo ufw allow 3001/tcp
sudo ufw reload
sudo ufw status
```

---

### **5. Probar desde tu PC**

**Sal del VPS (escribe `exit`) y en tu PC (PowerShell):**
```powershell
curl "http://149.33.24.31:3001/api/health"
```

**Si funciona**, deberías ver: `{"status":"ok","service":"gateway"}`

**Si NO funciona**, revisa:
- El firewall (`sudo ufw status` en el VPS)
- Que el gateway esté corriendo (`pm2 status` en el VPS)

---

### **6. Probar en el navegador**

1. Abre `http://localhost:3000/test-data` en tu navegador
2. Deberías ver los datos del evento, mesas y árbitros
3. Si aún aparece "Failed to fetch":
   - Abre las Herramientas de Desarrollador (F12)
   - Ve a la pestaña "Console" o "Network"
   - Copia el error exacto y compártelo

---

## ✅ Checklist Rápido

- [ ] Archivo `main.ts` subido al VPS
- [ ] Gateway recompilado en el VPS
- [ ] Gateway reiniciado con PM2
- [ ] Puerta 3001 abierta en el firewall
- [ ] `curl` desde PC funciona
- [ ] Página del navegador muestra datos

---

## 🆘 Si algo falla

**Lee la guía completa aquí:**
`WTT/SOLUCION_ERROR_FAILED_FETCH.md`

O comparte el error específico que ves y te ayudo a solucionarlo.

---

**⏱️ Tiempo estimado:** 5-10 minutos

¡Vamos! 🚀

