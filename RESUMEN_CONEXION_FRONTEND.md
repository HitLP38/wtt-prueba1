# ✅ Resumen: Conexión Frontend-Backend Completada

## 📋 Pasos Ejecutados

### ✅ **Paso 1: Crear archivo `.env.local`**
- **Ubicación:** `WTT/apps/web/.env.local`
- **Contenido:**
  ```
  NEXT_PUBLIC_API_URL=http://149.33.24.31:3001
  ```
- **Estado:** ✅ **CREADO EXITOSAMENTE**

### ✅ **Paso 2: Iniciar Frontend**
- **Comando ejecutado:** `npm run dev:web`
- **Estado:** ✅ **EJECUTÁNDOSE EN SEGUNDO PLANO**
- **Puerto esperado:** `http://localhost:3000`

---

## 🎯 **Próximos Pasos para Ti:**

### **1. Verificar que el frontend esté corriendo**

Abre tu navegador y ve a:
```
http://localhost:3000
```

Deberías ver la página principal del proyecto.

### **2. Ver la página de prueba con datos del backend**

Ve a:
```
http://localhost:3000/test-data
```

**Lo que deberías ver:**
- ✅ Evento: "Confraternidad UNI 2025"
- ✅ 5 mesas (Mesa 1, Mesa 2, Mesa 3, Mesa 4, Mesa 5)
- ✅ 3 árbitros del evento

---

## 🔍 **Si algo no funciona:**

### **Frontend no carga (página en blanco o error)**

1. **Verifica que el frontend esté corriendo:**
   - Abre PowerShell en tu PC
   - Ejecuta: `cd "C:\Users\Usuario\Desktop\Pagina Iglesia Alex\WTT"`
   - Ejecuta: `npm run dev:web`
   - Espera a que aparezca: `▲ Next.js ready on http://localhost:3000`

2. **Verifica que el backend del VPS esté funcionando:**
   - Conéctate al VPS: `ssh root@149.33.24.31`
   - Ejecuta: `pm2 status`
   - Debe mostrar que `gateway` está `online`

### **Error: "Cannot connect to server"**

1. **Verifica el archivo `.env.local`:**
   - Ruta: `C:\Users\Usuario\Desktop\Pagina Iglesia Alex\WTT\apps\web\.env.local`
   - Debe contener: `NEXT_PUBLIC_API_URL=http://149.33.24.31:3001`
   - Sin espacios ni comillas

2. **Verifica que el firewall del VPS permita conexiones:**
   - En el VPS: `sudo ufw status`
   - Debe mostrar que el puerto 3001 está permitido

### **No se cargan los datos (pantalla de carga infinita)**

1. Abre las **Herramientas de Desarrollador** del navegador (F12)
2. Ve a la pestaña **"Network"** o **"Red"**
3. Recarga la página (F5)
4. Busca las peticiones a `149.33.24.31:3001`
5. Haz clic en cada una y revisa:
   - **Status:** Debe ser 200 (OK)
   - **Response:** Debe mostrar un JSON con datos

---

## 📝 **Comandos Útiles:**

### **En tu PC (PowerShell):**
```powershell
# Ver si el frontend está corriendo
# (deberías ver procesos de Node.js en el Administrador de Tareas)

# Si necesitas reiniciar el frontend:
cd "C:\Users\Usuario\Desktop\Pagina Iglesia Alex\WTT"
npm run dev:web
```

### **En el VPS (después de hacer ssh):**
```bash
# Verificar estado del backend
pm2 status

# Ver logs del gateway
pm2 logs gateway --lines 20

# Reiniciar gateway si es necesario
pm2 restart gateway
```

---

## ✅ **Checklist Final:**

- [x] Archivo `.env.local` creado
- [x] URL del API configurada: `http://149.33.24.31:3001`
- [ ] Frontend corriendo localmente (puerto 3000) - **VERIFICAR EN NAVEGADOR**
- [ ] Backend corriendo en el VPS (puerto 3001) - **VERIFICAR CON `pm2 status`**
- [ ] Página `http://localhost:3000/test-data` muestra datos - **VERIFICAR EN NAVEGADOR**

---

## 🎉 **¡Listo!**

Tu frontend local ahora está configurado para conectarse con el backend del VPS.

**Siguiente paso:** Abre `http://localhost:3000/test-data` en tu navegador para ver los datos en acción.

