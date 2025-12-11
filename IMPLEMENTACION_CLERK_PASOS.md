# 🔐 Pasos para Completar Implementación de Clerk

## ✅ Lo que ya está hecho

1. ✅ Guards creados (`AuthGuard`, `RolesGuard`)
2. ✅ Decorators creados (`@Roles()`)
3. ✅ Guards aplicados a controllers (`AdminController`, `RefereeController`)
4. ✅ Dependencia agregada a `package.json`

---

## 📋 Próximos pasos

### **⚠️ Paso 0: Subir archivos nuevos al VPS** (IMPORTANTE)

**Desde PowerShell (tu máquina local):**

```powershell
# Ir al directorio del proyecto
cd "C:\Users\Usuario\Desktop\Pagina Iglesia Alex"

# Subir carpetas y archivos nuevos
scp -r "WTT\services\gateway\src\guards" root@149.33.24.31:/var/www/WTT/services/gateway/src/
scp -r "WTT\services\gateway\src\decorators" root@149.33.24.31:/var/www/WTT/services/gateway/src/
scp "WTT\services\gateway\src\admin.controller.ts" root@149.33.24.31:/var/www/WTT/services/gateway/src/
scp "WTT\services\gateway\src\referee.controller.ts" root@149.33.24.31:/var/www/WTT/services/gateway/src/
scp "WTT\services\gateway\package.json" root@149.33.24.31:/var/www/WTT/services/gateway/
```

**⚠️ IMPORTANTE:** Debes hacer esto PRIMERO antes de instalar dependencias o compilar.

### **Paso 1: Instalar dependencia en VPS**

```bash
# En el VPS
cd /var/www/WTT/services/gateway
npm install @clerk/clerk-sdk-node
```

### **Paso 2: Obtener credenciales de Clerk**

1. Ve a https://clerk.com
2. Crea una cuenta (gratis)
3. Crea una aplicación
4. Ve a "API Keys"
5. Copia tu `CLERK_SECRET_KEY` (empieza con `sk_test_...`)

### **Paso 3: Configurar variable de entorno en VPS**

```bash
# En el VPS, editar .env
cd /var/www/WTT
nano .env
```

Agregar:
```env
CLERK_SECRET_KEY=sk_test_tu_clave_secreta_aqui
```

**O mejor, agregar a cada servicio:**

```bash
# Copiar .env a gateway
cp .env services/gateway/.env
```

### **Paso 4: Compilar y reiniciar**

```bash
# Compilar gateway
cd /var/www/WTT/services/gateway
node ../../node_modules/typescript/bin/tsc

# Reiniciar PM2
cd /var/www/WTT
pm2 restart gateway
```

### **Paso 5: Configurar roles en Clerk**

En el dashboard de Clerk:

1. Ve a "Users"
2. Selecciona un usuario
3. Ve a "Metadata"
4. Agrega en "Public metadata":
   ```json
   {
     "roles": ["ADMIN"]
   }
   ```
   O para árbitro:
   ```json
   {
     "roles": ["REFEREE"]
   }
   ```

---

## 🧪 Probar autenticación

### **Sin autenticación (debe fallar):**

```bash
curl "http://localhost:3001/api/admin/dashboard?eventId=550e8400-e29b-41d4-a716-446655440000"
```

**Esperado:** Error 401 Unauthorized

### **Con autenticación (desde frontend):**

1. El frontend debe tener Clerk configurado
2. El usuario debe hacer login
3. El frontend debe enviar el token en el header:
   ```
   Authorization: Bearer <token>
   ```

---

## 📝 Notas importantes

### **Modo Desarrollo:**

Si `CLERK_SECRET_KEY` no está configurada, los guards permitirán acceso (modo desarrollo).

Verás warnings en los logs:
```
⚠️ CLERK_SECRET_KEY no configurada. Autenticación deshabilitada.
```

### **Frontend:**

Para que funcione completamente, necesitas:

1. ✅ Backend con guards (ya hecho)
2. ⏳ Frontend configurado con Clerk
3. ⏳ Enviar token JWT en requests desde frontend

---

## 🔄 Próximos pasos después de autenticación

1. Configurar Clerk en frontend
2. Crear páginas de login
3. Proteger rutas en frontend
4. Enviar token en cada request del frontend

---

¿Listo para instalar Clerk en el VPS?

