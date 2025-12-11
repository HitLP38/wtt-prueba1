# 🔐 Guía: Implementar Autenticación con Clerk

## 📋 Resumen

Vamos a implementar autenticación con Clerk en el backend para proteger las rutas de admin y referee.

---

## 🎯 Fase 1: Crear cuenta y obtener credenciales

### **Paso 1.1: Crear cuenta en Clerk**

1. Ve a https://clerk.com
2. Crea una cuenta (gratis para desarrollo)
3. Crea una nueva aplicación
4. Selecciona "Next.js" como framework (funciona para nuestro caso)

### **Paso 1.2: Obtener las claves**

En el dashboard de Clerk, ve a **"API Keys"**:

```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
```

**Importante:**
- `pk_test_...` es la clave pública (puede ir en el frontend)
- `sk_test_...` es la clave secreta (SOLO backend, nunca en frontend)

---

## 🚀 Fase 2: Instalar dependencias

### **En el Gateway (backend)**

Necesitamos instalar el SDK de Clerk para NestJS.

**En el VPS:**

```bash
cd /var/www/WTT/services/gateway
npm install @clerk/clerk-sdk-node
```

**O mejor, actualizar package.json local y luego subir:**

---

## 📦 Fase 3: Crear Guards y Decorators

Vamos a crear:

1. **AuthGuard** - Verifica que el usuario esté autenticado
2. **AdminGuard** - Verifica que el usuario tenga rol ADMIN
3. **RefereeGuard** - Verifica que el usuario tenga rol REFEREE
4. **Roles decorator** - Decorator para especificar roles permitidos

---

## 🔧 Fase 4: Configurar variables de entorno

**En el VPS (.env):**

```env
# Clerk Auth
CLERK_SECRET_KEY=sk_test_tu_clave_secreta_aqui
```

**En LOCAL (.env) - Para desarrollo futuro:**

```env
# Clerk Auth
CLERK_SECRET_KEY=sk_test_tu_clave_secreta_aqui
```

---

## 📝 Plan de Implementación

1. ✅ Crear estructura de guards y decorators
2. ✅ Instalar dependencias de Clerk
3. ✅ Implementar AuthGuard básico
4. ✅ Implementar AdminGuard y RefereeGuard
5. ✅ Agregar guards a los controllers
6. ✅ Probar autenticación
7. ✅ Configurar roles en Clerk

---

## ⚠️ Nota Importante

Para que funcione, también necesitas:

1. **Frontend configurado con Clerk** (para que los usuarios puedan hacer login)
2. **Enviar el token JWT** desde el frontend en cada request
3. **Configurar CORS** para aceptar requests del frontend

---

## 🎯 ¿Dónde implementar?

**Por ahora: VPS** (ya está funcionando)

1. Hacer cambios en código local
2. Subir al VPS con SCP
3. Instalar dependencias en VPS
4. Probar en VPS

**Más adelante: LOCAL** (para desarrollo más rápido)

Cuando quieras configurar backend local, podemos hacerlo después.

---

¿Quieres que empecemos a implementar los guards ahora?

