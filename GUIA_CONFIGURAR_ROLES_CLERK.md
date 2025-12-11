# 🔐 Guía Completa: Configurar Roles en Clerk

## 📋 Paso a Paso

### **Paso 1: Acceder a Clerk Dashboard**

1. Ve a https://clerk.com
2. Inicia sesión con tu cuenta
3. Selecciona tu aplicación

---

### **Paso 2: Ir a la sección de Usuarios**

1. En el menú lateral izquierdo, busca **"Users"** o **"Usuarios"**
2. Haz clic en **"Users"**
3. Verás la lista de usuarios de tu aplicación

---

### **Paso 3: Seleccionar un Usuario**

1. Haz clic en el usuario al que quieres asignar un rol
2. Se abrirá la página de detalles del usuario

---

### **Paso 4: Agregar Rol en Metadata**

1. En la página del usuario, busca la pestaña o sección **"Metadata"**
2. Verás dos tipos de metadata:
   - **Public metadata** (metadata pública)
   - **Private metadata** (metadata privada)

3. Haz clic en **"Public metadata"** (recomendado para roles)

4. Verás un editor JSON. Si está vacío, agrega:
   ```json
   {
     "roles": ["ADMIN"]
   }
   ```

   O para un árbitro:
   ```json
   {
     "roles": ["REFEREE"]
   }
   ```

   **O si ya tienes otros campos en metadata, agrega `roles` a lo existente:**
   ```json
   {
     "otroCampo": "valor",
     "roles": ["ADMIN"]
   }
   ```

5. Haz clic en **"Save"** o **"Guardar"**

---

## 🎯 Roles Disponibles

Según nuestro sistema, los roles son:

- **`ADMIN`** - Administrador (acceso completo)
- **`REFEREE`** - Árbitro (acceso a panel de árbitro)
- **`COACH`** - Entrenador (acceso a panel de entrenador)
- **`PLAYER`** - Jugador (acceso limitado)
- **`VIEWER`** - Visitante (solo lectura)

---

## 📝 Ejemplo Completo

### **Para un Administrador:**

1. Ve a Users → Selecciona usuario
2. Metadata → Public metadata
3. Agrega:
   ```json
   {
     "roles": ["ADMIN"]
   }
   ```
4. Guarda

### **Para un Árbitro:**

1. Ve a Users → Selecciona usuario
2. Metadata → Public metadata
3. Agrega:
   ```json
   {
     "roles": ["REFEREE"]
   }
   ```
4. Guarda

### **Para un Usuario con Múltiples Roles:**

```json
{
  "roles": ["REFEREE", "COACH"]
}
```

---

## 🔍 Verificar que Funcionó

Después de configurar el rol, puedes verificar:

1. El rol debería aparecer en la metadata del usuario
2. Cuando el usuario haga login y acceda a `/api/admin/*`, debería funcionar si tiene rol `ADMIN`
3. Si no tiene el rol, verá error `403 Forbidden`

---

## ⚠️ Notas Importantes

1. **Los roles son case-sensitive**: Usa mayúsculas como `ADMIN`, no `admin`
2. **Debes usar un array**: Siempre `["ADMIN"]`, no solo `"ADMIN"`
3. **Los cambios son inmediatos**: No necesitas reiniciar nada
4. **Si usas Private metadata**: Cambia "Public metadata" por "Private metadata" en nuestro código (en `roles.guard.ts`)

---

## 🧪 Probar

Después de configurar el rol, prueba con:

```bash
# Si configuraste ADMIN, prueba:
curl -H "Authorization: Bearer TU_TOKEN" \
  "http://localhost:3001/api/admin/dashboard?eventId=550e8400-e29b-41d4-a716-446655440000"
```

**Nota:** Necesitas el token JWT del usuario. El token se obtiene cuando el usuario hace login desde el frontend con Clerk.

---

## 🆘 Problemas Comunes

### **No puedo ver Metadata:**
- Asegúrate de estar en la página del usuario (click en el usuario)
- Busca en las pestañas: "Metadata", "Public metadata", o "User metadata"

### **El rol no funciona:**
- Verifica que guardaste los cambios
- Verifica que usaste mayúsculas: `ADMIN`, no `admin`
- Verifica que es un array: `["ADMIN"]`, no `"ADMIN"`
- Revisa los logs del gateway: `pm2 logs gateway`

### **No tengo usuarios en Clerk:**
- Crea un usuario desde el dashboard de Clerk
- O permite registro desde el frontend
- O usa el cli de Clerk para crear usuarios

---

¿Necesitas ayuda con algún paso específico?

