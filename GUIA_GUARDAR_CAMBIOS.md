# 💾 Guía Rápida: Guardar Todos los Cambios

## 📋 **MÉTODO 1: Atajo de Teclado (Más Rápido)**

En **Cursor/VS Code**:
```
Ctrl + K, S
```
O simplemente:
```
Ctrl + S  (múltiples veces si hay varios archivos abiertos)
```

---

## 📋 **MÉTODO 2: Desde la Terminal (Git)**

### **Opción A: Guardar TODOS los cambios (recomendado)**

```powershell
cd "C:\Users\Usuario\Desktop\Pagina Iglesia Alex\WTT"
git add .
git status  # Ver qué se va a guardar
```

**Si está todo bien:**
```powershell
git commit -m "feat: Panel Admin, autenticación Clerk, PDFMake, correcciones TypeScript"
```

---

## 📋 **MÉTODO 3: Aceptar Cambios Específicos (Desde Cursor UI)**

En la pestaña **Source Control** (Ctrl+Shift+G):
- ✅ Marca los archivos que quieres guardar
- ❌ Desmarca los que NO quieres (ej: `.md` de documentación)

**Recomendación:** Acepta TODOS menos:
- `tsconfig.tsbuildinfo` (archivos de build)
- Documentación `.md` (opcional, pero útil)

---

## ✅ **ARCHIVOS CRÍTICOS QUE DEBES ACEPTAR:**

### **Frontend:**
- `apps/web/src/app/admin/` (toda la carpeta)
- `apps/web/src/components/Admin*.tsx`
- `apps/web/src/middleware.ts`
- `apps/web/src/app/layout.tsx`
- `apps/web/src/lib/auth.ts`

### **Backend:**
- `services/*/src/**/*.ts` (todos los servicios)
- `services/*/src/entities/*.ts` (todas las entidades)
- `services/*/src/controllers/*.ts`
- `services/*/src/guards/*.ts`
- `services/*/src/decorators/*.ts`
- `services/*/src/services/*.ts`

### **Configuración:**
- `package.json` y `package-lock.json`
- `turbo.json`
- `ecosystem.config.js`

---

## 🚀 **COMANDO RÁPIDO (Copia y pega):**

```powershell
cd "C:\Users\Usuario\Desktop\Pagina Iglesia Alex\WTT"
git add .
git commit -m "feat: Panel Admin completo, autenticación Clerk, PDFMake, multi-tenant, correcciones"
```

---

## ⚠️ **IMPORTANTE:**

**ANTES de hacer commit**, verifica que **NO** estés incluyendo:
- `.env.local` con tus claves (debe estar en `.gitignore`)
- `node_modules/`
- `.next/` (build de Next.js)
- Archivos temporales

**Verificar:**
```powershell
git status
```

Si ves `.env.local`, agrégalo a `.gitignore`:
```powershell
echo ".env.local" >> .gitignore
```

---

**✅ Recomendación final:** **Acepta TODOS los cambios** (son necesarios para que funcione el panel admin).

