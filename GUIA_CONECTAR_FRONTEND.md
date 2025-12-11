# 🔗 Guía: Conectar Frontend con Backend del VPS

## 📋 Pasos para conectar el frontend local con el backend del VPS

---

## **PASO 1: Crear archivo de configuración del frontend**

### 🔹 1.1. Ubicación del archivo
Necesitas crear el archivo `.env.local` en la carpeta del frontend.

**Ruta completa:**
```
C:\Users\Usuario\Desktop\Pagina Iglesia Alex\WTT\apps\web\.env.local
```

### 🔹 1.2. Crear el archivo con este contenido

Abre un editor de texto (Notepad, VS Code, etc.) y crea un archivo nuevo con este contenido:

```env
NEXT_PUBLIC_API_URL=http://149.33.24.31:3001
```

**⚠️ IMPORTANTE:** 
- El archivo debe llamarse exactamente `.env.local` (con el punto al inicio)
- La URL es `http://149.33.24.31:3001` (tu IP del VPS + puerto 3001 del Gateway)

### 🔹 1.3. Guardar el archivo
Guarda el archivo en la ruta exacta:
```
C:\Users\Usuario\Desktop\Pagina Iglesia Alex\WTT\apps\web\.env.local
```

---

## **PASO 2: Verificar que el backend del VPS esté funcionando**

### 🔹 2.1. Conectar al VPS (desde PowerShell o CMD)

```powershell
ssh root@149.33.24.31
```

Cuando te pida la contraseña, ingrésala.

### 🔹 2.2. Verificar que el gateway esté corriendo

Una vez dentro del VPS, ejecuta:

```bash
pm2 status
```

Debes ver que `gateway` está en estado **online**.

### 🔹 2.3. Probar el endpoint (opcional, para confirmar)

En el VPS, ejecuta:

```bash
curl "http://localhost:3001/api/admin/dashboard?eventId=550e8400-e29b-41d4-a716-446655440000"
```

Si ves un JSON con datos del evento, mesas y estadísticas, está funcionando correctamente.

### 🔹 2.4. Salir del VPS

```bash
exit
```

---

## **PASO 3: Ejecutar el frontend en tu PC**

### 🔹 3.1. Abrir PowerShell en tu PC

Presiona `Windows + X` y selecciona **"Windows PowerShell"** o **"Terminal"**.

### 🔹 3.2. Navegar al directorio del proyecto

Ejecuta estos comandos **uno por uno**:

```powershell
cd "C:\Users\Usuario\Desktop\Pagina Iglesia Alex\WTT"
```

### 🔹 3.3. Verificar que existe el archivo .env.local

```powershell
Test-Path "apps\web\.env.local"
```

Si aparece `True`, el archivo existe. Si aparece `False`, vuelve al **PASO 1** y créalo.

### 🔹 3.4. Instalar dependencias (si no las has instalado antes)

```powershell
npm install
```

**⏱️ Esto puede tardar varios minutos la primera vez.**

### 🔹 3.5. Ejecutar el frontend en modo desarrollo

```powershell
npm run dev:web
```

O si prefieres ejecutar todo el proyecto:

```powershell
npm run dev
```

**⏱️ Espera a que aparezca un mensaje como:**

```
▲ Next.js ready on http://localhost:3000
```

---

## **PASO 4: Abrir la página de prueba en el navegador**

### 🔹 4.1. Abrir el navegador

Abre tu navegador (Chrome, Firefox, Edge, etc.).

### 🔹 4.2. Ir a la página de prueba

En la barra de direcciones, escribe:

```
http://localhost:3000/test-data
```

Y presiona **Enter**.

---

## **PASO 5: Verificar que los datos se carguen**

### ✅ Lo que deberías ver:

1. **Un título:** "🧪 Página de Prueba - Visualización de Datos"

2. **Sección de Eventos:**
   - Nombre: "Confraternidad UNI 2025"
   - Descripción, fechas, lugar, dirección

3. **Sección de Mesas:**
   - 5 mesas (Mesa 1, Mesa 2, Mesa 3, Mesa 4, Mesa 5)
   - Cada una con estado "available" (verde)

4. **Sección de Árbitros:**
   - 3 árbitros del evento
   - Con sus IDs y estado habilitado

---

## **❌ Si algo no funciona:**

### **Error: "Cannot connect to server" o página en blanco**

1. **Verifica que el backend esté corriendo en el VPS:**
   - Conéctate al VPS: `ssh root@149.33.24.31`
   - Ejecuta: `pm2 status`
   - Si `gateway` no está `online`, reinícialo: `pm2 restart gateway`

2. **Verifica que el firewall del VPS permita conexiones:**
   - En el VPS: `sudo ufw status`
   - Debe mostrar que el puerto 3001 está permitido

3. **Verifica la URL en `.env.local`:**
   - Debe ser exactamente: `NEXT_PUBLIC_API_URL=http://149.33.24.31:3001`
   - Sin espacios ni comillas

### **Error: "404 Not Found"**

- Verifica que la URL del API tenga el prefijo `/api`
- La página ya está configurada para usar `/api/admin/dashboard`, así que debería funcionar

### **Error: "Failed to fetch"**

1. Abre las **Herramientas de Desarrollador** del navegador (F12)
2. Ve a la pestaña **"Console"** o **"Red"**
3. Copia el error exacto y compártelo

### **No se cargan los datos (pantalla de carga infinita)**

1. Abre las **Herramientas de Desarrollador** (F12)
2. Ve a la pestaña **"Network"** o **"Red"**
3. Recarga la página (F5)
4. Busca las peticiones a `149.33.24.31:3001`
5. Haz clic en cada una y revisa:
   - **Status:** Debe ser 200 (OK)
   - **Response:** Debe mostrar un JSON con datos

---

## **📝 Resumen de comandos rápidos**

### En tu PC (PowerShell):
```powershell
# 1. Ir al proyecto
cd "C:\Users\Usuario\Desktop\Pagina Iglesia Alex\WTT"

# 2. Ejecutar frontend
npm run dev:web
```

### En el VPS (después de hacer ssh):
```bash
# Verificar estado
pm2 status

# Ver logs del gateway
pm2 logs gateway --lines 20

# Reiniciar gateway si es necesario
pm2 restart gateway
```

---

## **✅ Checklist final**

- [ ] Archivo `.env.local` creado en `WTT/apps/web/`
- [ ] URL del API configurada: `http://149.33.24.31:3001`
- [ ] Backend corriendo en el VPS (verificado con `pm2 status`)
- [ ] Frontend corriendo localmente (puerto 3000)
- [ ] Página `http://localhost:3000/test-data` muestra datos

---

¡Listo! Si sigues estos pasos, deberías poder ver los datos del backend en tu frontend. 🎉

