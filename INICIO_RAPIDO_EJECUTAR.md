# ⚡ INICIO RÁPIDO - Ejecutar el Proyecto

## 🎯 Solución Rápida (3 Pasos)

### **PASO 1: Instalar Todo** ⏱️ 5-10 min

**En Windows (PowerShell):**
```powershell
.\install-all.ps1
```

**En Linux/Mac:**
```bash
chmod +x install-all.sh
./install-all.sh
```

**O manualmente:**
```bash
# 1. Compilar common
cd packages/common && npm install && npm run build && cd ../..

# 2. Instalar servicios nuevos
cd services/referees && npm install && cd ../..
cd services/notifications && npm install && cd ../..
cd services/players && npm install && cd ../..

# 3. Instalar desde raíz
npm install
```

---

### **PASO 2: Ejecutar** ⏱️

```bash
npm run dev
```

**O con concurrency manual:**
```bash
npx turbo run dev --concurrency=15
```

---

### **PASO 3: Verificar** ⏱️

- **Frontend:** `http://localhost:3001`
- **Gateway:** `http://localhost:3000`
- **Logs:** Aparecen en la terminal

---

## ❌ Si Hay Errores

### **Error: "Workspace not found"**
```bash
npm install
```

### **Error: "Cannot find module '@wtt/common'"**
```bash
cd packages/common
npm run build
cd ../..
```

### **Error: "Concurrency"**
Ya está solucionado en `package.json`, pero si persiste:
```bash
npx turbo run dev --concurrency=15
```

---

## 📋 Pasos Detallados

Si necesitas más detalles, ve a: **`PASOS_PARA_EJECUTAR.md`**

---

## ✅ Listo

Después de ejecutar, tendrás:
- ✅ Todos los servicios corriendo
- ✅ Frontend disponible
- ✅ Backend disponible
- ✅ Listo para configurar base de datos

---

**¡Ejecuta los 3 pasos y debería funcionar!** 🚀

