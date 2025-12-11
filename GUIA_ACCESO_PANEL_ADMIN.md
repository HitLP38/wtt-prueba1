# 🔐 Guía de Acceso al Panel de Administración

## 📋 **VISIÓN GENERAL:**

El panel de administración está protegido con:
1. **Autenticación** - Clerk (login requerido)
2. **Autorización** - Verificación de roles (ADMIN o MASTER)
3. **Validación Backend** - Los ADMINs deben estar habilitados por un MASTER

---

## 🚀 **CÓMO ACCEDER EN DESARROLLO:**

### **Opción 1: Con Clerk Configurado** (Recomendado para producción)

1. **Configurar Clerk:**
   ```bash
   # En .env.local del frontend (apps/web/.env.local)
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
   ```

2. **Crear usuario en Clerk Dashboard:**
   - Ve a https://dashboard.clerk.com
   - Crea un usuario
   - En "Metadata" → "Public metadata", agrega:
     ```json
     {
       "role": "admin",
       "organizationId": "tu-org-id"
     }
     ```

3. **Acceder al panel:**
   - Ve a: http://localhost:3000/admin/dashboard
   - Clerk te redirigirá a `/sign-in`
   - Inicia sesión con tu usuario
   - Si tienes rol `admin` o `master`, verás el panel

---

### **Opción 2: Sin Clerk (Desarrollo Rápido)** ⚡ **RECOMENDADO PARA PROBAR**

Si quieres probar el panel **SIN configurar Clerk**:

1. **No configures** `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` en `.env.local`

2. **Acceder directamente:**
   ```bash
   # Iniciar servidor
   npm run dev
   
   # Ir directamente a:
   http://localhost:3000/admin/dashboard
   ```

3. **El AdminGuard detectará** que Clerk no está configurado y **permitirá acceso automáticamente** (modo desarrollo)

✅ **Esto es perfecto para desarrollar y probar las vistas del panel sin preocuparte por autenticación**

---

## 🔑 **FLUJO DE AUTENTICACIÓN:**

```
Usuario → /admin/dashboard
   ↓
¿Clerk configurado?
   ├─ NO → ✅ Permitir acceso (modo desarrollo)
   └─ SÍ → Middleware verifica autenticación
            ↓
            ¿Está autenticado?
            ├─ NO → Redirige a /sign-in
            └─ SÍ → AdminGuard verifica rol
                     ↓
                     ¿Tiene rol admin o master?
                     ├─ NO → Muestra "Acceso Denegado"
                     └─ SÍ → Muestra Panel Admin
```

---

## 👥 **ROLES Y PERMISOS:**

### **MASTER:**
- Acceso completo al sistema
- Puede habilitar/deshabilitar ADMINs
- Puede gestionar organizaciones
- No requiere validación adicional

### **ADMIN:**
- Acceso al panel de administración
- Debe estar habilitado por un MASTER
- Solo puede ver/modificar datos de su organización
- Validación en backend (a implementar)

---

## 📝 **CONFIGURACIÓN COMPLETA:**

### **1. Variables de Entorno (.env.local):**

**Sin Clerk (Desarrollo):**
```env
# Deja vacío o no crees la variable
# NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=

# API Backend
NEXT_PUBLIC_API_URL=http://localhost:3001
```

**Con Clerk (Producción):**
```env
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/admin/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/admin/dashboard

# API Backend
NEXT_PUBLIC_API_URL=http://localhost:3001
```

### **2. Configurar Roles en Clerk:**

**Para un usuario MASTER:**
1. Ve a Clerk Dashboard → Users
2. Selecciona el usuario
3. Ve a "Metadata" → "Public metadata"
4. Agrega:
   ```json
   {
     "role": "master"
   }
   ```

**Para un usuario ADMIN:**
1. Ve a Clerk Dashboard → Users
2. Selecciona el usuario
3. Ve a "Metadata" → "Public metadata"
4. Agrega:
   ```json
   {
     "role": "admin",
     "organizationId": "uuid-de-la-organizacion"
   }
   ```

### **3. Habilitar ADMIN en Backend** (Futuro):

```bash
# POST /api/admin/users/:userId/enable
# Debe ser llamado por un MASTER
{
  "organizationId": "uuid-org",
  "role": "admin",
  "enabledBy": "master-user-id"
}
```

---

## 🛠️ **DESARROLLO LOCAL - PASOS RÁPIDOS:**

### **Para probar AHORA (sin Clerk):**

```powershell
# 1. Asegúrate de que NO tengas NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY en .env.local
#    (o simplemente no lo configures)

# 2. Iniciar servidor
cd "C:\Users\Usuario\Desktop\Pagina Iglesia Alex\WTT"
npm run dev

# 3. Abrir navegador
# Ve a: http://localhost:3000/admin/dashboard
```

✅ **¡Eso es todo! El panel debería cargar directamente sin pedir login.**

---

## 🔒 **PROTECCIÓN DE RUTAS:**

### **Middleware (`middleware.ts`):**
- Protege todas las rutas `/admin/*`
- Solo activo si Clerk está configurado
- Redirige a `/sign-in` si no está autenticado

### **AdminGuard (`AdminGuard.tsx`):**
- Verifica rol del usuario
- Permite acceso si Clerk no está configurado (modo desarrollo)
- Muestra loading mientras verifica
- Muestra error si no tiene permisos

---

## ✅ **PARA EMPEZAR A DESARROLLAR VISTAS:**

**Recomendación:** Usa el **modo sin Clerk** por ahora:

1. **NO configures** `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
2. **Inicia el servidor:** `npm run dev`
3. **Ve a:** http://localhost:3000/admin/dashboard
4. **¡Empieza a desarrollar las vistas!** 🎨

Cuando termines de desarrollar, luego configuras Clerk para producción.

---

## 📋 **PRÓXIMOS PASOS:**

### **1. Validación Backend** (A implementar después):
```typescript
// En el backend, verificar que el ADMIN esté habilitado
async function verifyAdminAccess(userId: string, organizationId: string) {
  // Buscar en User entity
  // Verificar que tenga rol ADMIN y esté activo
  // Verificar que pertenezca a la organización
}
```

### **2. API de Verificación:**
```typescript
// GET /api/admin/verify-access
// Retorna: { hasAccess: boolean, user: User }
```

### **3. Refresh Token:**
- Implementar refresh automático de permisos
- Notificar cuando un ADMIN es deshabilitado

---

## 🐛 **TROUBLESHOOTING:**

### **Error: "Redirect loop"**
- Verifica que las URLs de Clerk estén correctas en `.env.local`
- O simplemente NO configures Clerk para desarrollo

### **Error: "Acceso Denegado" aunque tengo rol admin**
- Verifica que el metadata en Clerk tenga `role: "admin"` (minúscula)
- Verifica que estés autenticado correctamente

### **No puedo acceder sin Clerk**
- Verifica que `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` NO esté en `.env.local`
- Reinicia el servidor después de cambiar `.env.local`

---

## 📚 **RECURSOS:**

- Clerk Docs: https://clerk.com/docs
- Next.js Middleware: https://nextjs.org/docs/app/building-your-application/routing/middleware

---

## 🎯 **RESUMEN PARA EMPEZAR:**

**Para desarrollo rápido (AHORA):**
1. ✅ No configures Clerk
2. ✅ `npm run dev`
3. ✅ Ve a http://localhost:3000/admin/dashboard
4. ✅ **¡Empieza a desarrollar las vistas!**

**Para producción (DESPUÉS):**
1. Configura Clerk
2. Crea usuarios con roles
3. Configura validación en backend

---

**🎉 ¡Ahora puedes visualizar y desarrollar el panel de administración!**
