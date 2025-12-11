# 📋 Comando Exacto para Subir el Archivo

## 🎯 Ejecuta este comando en tu terminal:

```powershell
scp "C:\Users\Usuario\Desktop\Pagina Iglesia Alex\WTT\services\gateway\src\main.ts" root@149.33.24.31:/var/www/WTT/services/gateway/src/
```

---

## 📝 Paso a Paso:

### 1. **Copia este comando completo:**
```powershell
scp "C:\Users\Usuario\Desktop\Pagina Iglesia Alex\WTT\services\gateway\src\main.ts" root@149.33.24.31:/var/www/WTT/services/gateway/src/
```

### 2. **Pégalo en tu terminal PowerShell y presiona Enter**

### 3. **Cuando te pida la contraseña**, ingrésala (no verás lo que escribes, es normal)

### 4. **Deberías ver un mensaje de éxito** como:
```
main.ts                                                                                                                          100%  XXXX  X.XXKB/s    XX:XX
```

---

## ✅ Si funciona correctamente:

Después de subir el archivo, necesitas:

1. **Conectarte al VPS:**
   ```powershell
   ssh root@149.33.24.31
   ```

2. **Recompilar el gateway:**
   ```bash
   cd /var/www/WTT/services/gateway
   node ../../node_modules/typescript/bin/tsc
   ```

3. **Reiniciar el gateway:**
   ```bash
   pm2 restart gateway
   ```

---

## ❌ Si hay error:

**Error: "No such file or directory"**
- Verifica que estés en PowerShell (no CMD)
- Usa comillas alrededor de la ruta completa
- Verifica que el archivo exista en esa ubicación

**Error: "Permission denied"**
- Asegúrate de tener permisos para acceder al archivo
- Verifica la contraseña del VPS

