# 🔧 Instrucciones: Compilar Servicios Antes de Ejecutar Dev

## ⚠️ **Problema:**
Los servicios NestJS necesitan compilar antes de ejecutarse en modo `dev`. Si no existe `dist/main.js`, aparece el error:
```
Error: Cannot find module '.../dist/main'
```

## ✅ **Solución:**

### **Opción 1: Compilar Manualmente Primero (RECOMENDADO)**

Antes de ejecutar `npm run dev`, compila todos los servicios una vez:

```powershell
cd "C:\Users\Usuario\Desktop\Pagina Iglesia Alex\WTT"

# Compilar common primero
cd packages\common
npm run build
cd ..\..

# Compilar todos los servicios
cd services\gateway
npm run build
cd ..\eventos
npm run build
cd ..\teams
npm run build
cd ..\inscriptions
npm run build
cd ..\matches
npm run build
cd ..\referees
npm run build
cd ..\notifications
npm run build
cd ..\players
npm run build
cd ..\..
```

**O usa el script PowerShell:**
```powershell
.\scripts\build-all-services.ps1
```

Luego ejecuta:
```powershell
npm run dev
```

---

### **Opción 2: Usar el Hook `predev`**

Cada servicio tiene un hook `predev` que compila automáticamente antes de `dev`. Esto debería funcionar, pero puede fallar si Turbo ejecuta servicios en paralelo antes de compilar dependencias.

**Si usas esta opción, asegúrate de que `@wtt/common` esté compilado primero:**
```powershell
cd packages\common
npm run build
cd ..\..
npm run dev
```

---

### **Opción 3: Compilar Todo con Turbo**

Compila todo el proyecto primero:
```powershell
npm run build
```

Luego ejecuta en modo dev:
```powershell
npm run dev
```

---

## 🎯 **Flujo Recomendado (Primera Vez):**

1. **Compilar common:**
   ```powershell
   cd packages\common
   npm run build
   cd ..\..
   ```

2. **Compilar todos los servicios:**
   ```powershell
   npm run build
   ```
   
   O compilar individualmente si hay errores:
   ```powershell
   cd services\gateway && npm run build && cd ..\..
   cd services\eventos && npm run build && cd ..\..
   # ... etc
   ```

3. **Ejecutar en modo dev:**
   ```powershell
   npm run dev
   ```

---

## 📝 **Notas:**

- **`nest start --watch`** compila automáticamente cuando detecta cambios, PERO necesita que `dist/main.js` exista la primera vez
- **Turbo** ejecuta comandos en paralelo, por lo que puede intentar ejecutar servicios antes de que dependencias estén compiladas
- **El hook `predev`** se ejecuta automáticamente antes de `dev` en npm, pero Turbo puede no respetarlo siempre

---

## ✅ **Después de la Primera Compilación:**

Una vez que todos los servicios estén compilados, `npm run dev` debería funcionar correctamente porque `nest start --watch` detectará cambios y recompilará automáticamente.

