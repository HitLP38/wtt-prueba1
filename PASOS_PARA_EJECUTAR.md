# 🚀 Pasos para Ejecutar el Proyecto

## ⚠️ Errores Detectados y Soluciones

### **Error 1: Workspace 'services/referees' not found in lockfile**
**Solución:** Instalar dependencias de los servicios nuevos

### **Error 2: Concurrency de turbo insuficiente**
**Solución:** Ya corregido en `turbo.json`

---

## 📋 PASOS PARA EJECUTAR (En Orden)

### **PASO 1: Instalar Dependencias de packages/common** ⏱️ 2 min

```bash
cd packages/common
npm install
npm run build
cd ../..
```

**¿Por qué?** Los servicios dependen de `@wtt/common`, debe estar compilado primero.

---

### **PASO 2: Instalar Dependencias de los Servicios Nuevos** ⏱️ 5 min

```bash
# Servicio Referees
cd services/referees
npm install
cd ../..

# Servicio Notifications
cd services/notifications
npm install
cd ../..

# Servicio Players
cd services/players
npm install
cd ../..
```

**¿Por qué?** Estos servicios son nuevos y no están en el lockfile de npm.

---

### **PASO 3: Instalar Dependencias de Todos los Servicios** ⏱️ 10 min

```bash
# Desde la raíz del proyecto
npm install
```

**¿Por qué?** Esto actualiza el lockfile con todos los workspaces.

---

### **PASO 4: Compilar packages/common** ⏱️ 1 min

```bash
cd packages/common
npm run build
cd ../..
```

**¿Por qué?** Asegura que el paquete común esté compilado antes de ejecutar servicios.

---

### **PASO 5: Ejecutar con Concurrency Aumentado** ⏱️

```bash
# Opción 1: Especificar concurrency manualmente
npx turbo run dev --concurrency=15

# Opción 2: Usar el script actualizado (si lo agregamos)
npm run dev
```

**¿Por qué?** Hay 10+ servicios en modo `dev` (persistent), necesitas más concurrency.

---

## 🔧 Solución Rápida (Todo en Uno)

Copia y pega estos comandos en orden:

```bash
# 1. Compilar common primero
cd packages/common && npm install && npm run build && cd ../..

# 2. Instalar servicios nuevos
cd services/referees && npm install && cd ../..
cd services/notifications && npm install && cd ../..
cd services/players && npm install && cd ../..

# 3. Instalar todo desde raíz
npm install

# 4. Ejecutar con concurrency aumentado
npx turbo run dev --concurrency=15
```

---

## 📝 Alternativa: Ejecutar Servicios Individualmente

Si prefieres ejecutar solo lo que necesitas:

### **Solo Frontend:**
```bash
cd apps/web
npm install
npm run dev
```

### **Solo Gateway:**
```bash
cd services/gateway
npm install
npm run dev
```

### **Solo un Servicio Específico:**
```bash
cd services/eventos
npm install
npm run dev
```

---

## ✅ Verificar que Funciona

### **1. Verificar que los servicios se inician:**
- Gateway: `http://localhost:3000` (o el puerto configurado)
- Frontend: `http://localhost:3001` (o el puerto configurado)

### **2. Ver logs:**
Los logs de cada servicio aparecerán en la terminal.

### **3. Verificar errores:**
Si hay errores, aparecerán en rojo en la terminal.

---

## 🐛 Si Sigue Fallando

### **Error: "Cannot find module '@wtt/common'"**
```bash
cd packages/common
npm run build
cd ../..
```

### **Error: "Workspace not found"**
```bash
# Limpiar e instalar de nuevo
rm -rf node_modules package-lock.json
npm install
```

### **Error: "Port already in use"**
```bash
# En Windows (PowerShell):
netstat -ano | findstr :3000
# Luego matar el proceso con el PID mostrado
```

---

## 🎯 Próximos Pasos Después de Ejecutar

1. **Configurar variables de entorno** (`.env` en cada servicio)
2. **Configurar base de datos** (PostgreSQL)
3. **Configurar Redis** (para microservicios)
4. **Ejecutar seed de datos** (`scripts/seeds/seed.sql`)

---

## 📞 ¿Necesitas Ayuda?

Si algo no funciona:
1. Revisa los logs en la terminal
2. Verifica que todas las dependencias estén instaladas
3. Asegúrate de que `packages/common` esté compilado
4. Pregúntame y lo resolvemos juntos

---

**¡Ejecuta los pasos en orden y debería funcionar!** 🚀

