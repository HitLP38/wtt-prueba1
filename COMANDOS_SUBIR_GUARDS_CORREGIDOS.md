# 📤 Comandos para Subir Guards Corregidos

## 📁 Archivos a subir

**Desde PowerShell (tu máquina local):**

```powershell
cd "C:\Users\Usuario\Desktop\Pagina Iglesia Alex"

# Subir guards corregidos
scp "WTT\services\gateway\src\guards\auth.guard.ts" root@149.33.24.31:/var/www/WTT/services/gateway/src/guards/
scp "WTT\services\gateway\src\guards\roles.guard.ts" root@149.33.24.31:/var/www/WTT/services/gateway/src/guards/
```

---

## 🔧 Después de subir (en el VPS)

```bash
# 1. Recompilar gateway
cd /var/www/WTT/services/gateway
node ../../node_modules/typescript/bin/tsc

# 2. Verificar que no hay errores de compilación
# (Si hay errores, compártelos)

# 3. Reiniciar gateway
cd /var/www/WTT
pm2 delete gateway
pm2 start ecosystem.config.js --only gateway

# 4. Ver logs
pm2 logs gateway --lines 30

# 5. Probar endpoint
curl "http://localhost:3001/api/admin/dashboard?eventId=550e8400-e29b-41d4-a716-446655440000"
```

---

## ✅ Qué esperar

**Sin errores:**
- Gateway debería iniciar correctamente
- Los logs deberían mostrar warnings sobre Clerk deshabilitado (normal por ahora)
- El endpoint debería funcionar (modo desarrollo sin autenticación)

**Si hay errores:**
- Comparte los logs y los solucionamos

