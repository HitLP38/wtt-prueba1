# 📋 Pasos Después de Subir el Archivo main.ts

## ✅ Ya completado:
- [x] Archivo `main.ts` actualizado localmente
- [ ] Archivo `main.ts` subido al VPS ← **DEBES HACER ESTO PRIMERO**

---

## 🔄 **PASO 1: Subir el archivo al VPS**

### **📍 Dónde ejecutar:** En tu PC (PowerShell)

**Comando:**
```powershell
scp "C:\Users\Usuario\Desktop\Pagina Iglesia Alex\WTT\services\gateway\src\main.ts" root@149.33.24.31:/var/www/WTT/services/gateway/src/
```

**Cuando termines**, deberías ver un mensaje de éxito.

---

## 🔄 **PASO 2: Conectarte al VPS**

### **📍 Dónde ejecutar:** En tu PC (PowerShell - nueva terminal o la misma)

**Comando:**
```powershell
ssh root@149.33.24.31
```

**Cuando te pida la contraseña**, ingrésala.

**Después de conectarte**, deberías ver algo como:
```
root@a474420503:~#
```

---

## 🔄 **PASO 3: Ir al directorio del gateway**

### **📍 Dónde ejecutar:** Dentro del VPS (después de hacer `ssh`)

**Comando:**
```bash
cd /var/www/WTT/services/gateway
```

**Para verificar que estás en el lugar correcto:**
```bash
pwd
```

Debe mostrar: `/var/www/WTT/services/gateway`

---

## 🔄 **PASO 4: Recompilar el gateway**

### **📍 Dónde ejecutar:** Dentro del VPS, en `/var/www/WTT/services/gateway`

**Comando:**
```bash
node ../../node_modules/typescript/bin/tsc
```

**Espera** a que termine (puede tardar unos segundos).

**Si no hay errores**, no verás ningún mensaje o solo mensajes de compilación.

---

## 🔄 **PASO 5: Verificar que se compiló correctamente**

### **📍 Dónde ejecutar:** Dentro del VPS, en `/var/www/WTT/services/gateway`

**Comando:**
```bash
ls -la dist/services/gateway/src/main.js
```

**Si el archivo existe**, verás información del archivo.

**Si dice "No such file or directory"**, hubo un error en la compilación. Revisa los mensajes del paso anterior.

---

## 🔄 **PASO 6: Reiniciar el gateway con PM2**

### **📍 Dónde ejecutar:** Dentro del VPS (puedes estar en cualquier directorio)

**Comando:**
```bash
pm2 restart gateway
```

**Deberías ver:**
```
[PM2] Applying action restartProcessId on app [gateway] (ids: X)
[PM2] [gateway] Restarting
[PM2] [gateway] ✓ Successfully restarted
```

---

## 🔄 **PASO 7: Verificar que el gateway esté corriendo**

### **📍 Dónde ejecutar:** Dentro del VPS

**Comando:**
```bash
pm2 status
```

**Debe mostrar** que `gateway` está `online` (en verde).

---

## 🔄 **PASO 8: Ver los logs del gateway para confirmar los cambios**

### **📍 Dónde ejecutar:** Dentro del VPS

**Comando:**
```bash
pm2 logs gateway --lines 20
```

**Busca estas líneas** en los logs:
- `🚀 Gateway running on: http://0.0.0.0:3001`
- `🌐 CORS: Allowed from any origin (development)`

Si ves estas líneas, **¡está funcionando correctamente!**

**Para salir de los logs**, presiona `Ctrl + C`

---

## 🔄 **PASO 9: Salir del VPS**

### **📍 Dónde ejecutar:** Dentro del VPS

**Comando:**
```bash
exit
```

Ahora estás de vuelta en tu PC.

---

## 🔄 **PASO 10: Probar la conexión desde tu PC**

### **📍 Dónde ejecutar:** En tu PC (PowerShell)

**Comando:**
```powershell
curl "http://149.33.24.31:3001/api/health"
```

**Si funciona**, deberías ver:
```json
{"status":"ok","service":"gateway"}
```

---

## 🔄 **PASO 11: Probar en el navegador**

1. Abre tu navegador
2. Ve a: `http://localhost:3000/test-data`
3. **Deberías ver los datos** (evento, mesas, árbitros)
4. Si aún aparece "Failed to fetch", abre las **Herramientas de Desarrollador** (F12) y revisa la pestaña "Console" o "Network"

---

## 📝 Resumen de Rutas:

| Paso | Dónde Ejecutar | Ruta/Contexto |
|------|----------------|---------------|
| 1 | Tu PC (PowerShell) | `C:\Users\Usuario\Desktop\Pagina Iglesia Alex` |
| 2 | Tu PC (PowerShell) | Cualquier directorio |
| 3-8 | Dentro del VPS (después de `ssh`) | `/var/www/WTT/services/gateway` o cualquier lugar |
| 9 | Dentro del VPS | Cualquier lugar |
| 10 | Tu PC (PowerShell) | Cualquier directorio |
| 11 | Navegador | `http://localhost:3000/test-data` |

---

## ⚠️ Si algo falla:

**Si el archivo no se sube:**
- Verifica que el comando `scp` tenga la ruta correcta
- Verifica tu conexión a internet
- Verifica que puedas conectarte al VPS con `ssh`

**Si la compilación falla:**
- Verifica que estés en el directorio correcto (`/var/www/WTT/services/gateway`)
- Revisa los mensajes de error de TypeScript

**Si el gateway no reinicia:**
- Verifica con `pm2 status` que el gateway exista
- Revisa los logs con `pm2 logs gateway --lines 50`

---

¡Sigue estos pasos en orden y todo debería funcionar! 🚀

