# 📤 Comandos para Subir Archivos de Clerk al VPS

## 📁 Archivos a subir

**Desde PowerShell (tu máquina local):**

```powershell
# Ir al directorio del proyecto
cd "C:\Users\Usuario\Desktop\Pagina Iglesia Alex"

# 1. Subir toda la carpeta de guards
scp -r "WTT\services\gateway\src\guards" root@149.33.24.31:/var/www/WTT/services/gateway/src/

# 2. Subir toda la carpeta de decorators
scp -r "WTT\services\gateway\src\decorators" root@149.33.24.31:/var/www/WTT/services/gateway/src/

# 3. Subir controllers actualizados
scp "WTT\services\gateway\src\admin.controller.ts" root@149.33.24.31:/var/www/WTT/services/gateway/src/
scp "WTT\services\gateway\src\referee.controller.ts" root@149.33.24.31:/var/www/WTT/services/gateway/src/

# 4. Subir package.json actualizado
scp "WTT\services\gateway\package.json" root@149.33.24.31:/var/www/WTT/services/gateway/
```

---

## 🔧 Después de subir los archivos (en el VPS)

```bash
# 1. Instalar dependencia de Clerk
cd /var/www/WTT/services/gateway
npm install @clerk/clerk-sdk-node

# 2. Compilar
node ../../node_modules/typescript/bin/tsc

# 3. Reiniciar PM2
cd /var/www/WTT
pm2 restart gateway --update-env

# 4. Verificar que no hay errores
pm2 logs gateway --lines 20 --nostream
```

---

## ⚠️ Nota importante

Si `CLERK_SECRET_KEY` no está configurada todavía, verás warnings pero el servicio funcionará (modo desarrollo sin autenticación).

Para configurar Clerk:
1. Obtén tu clave en https://clerk.com
2. Agrégalo al `.env`:
   ```bash
   nano /var/www/WTT/.env
   # Agregar: CLERK_SECRET_KEY=sk_test_...
   ```
3. Copiar a gateway:
   ```bash
   cp /var/www/WTT/.env /var/www/WTT/services/gateway/.env
   ```
4. Reiniciar con variables actualizadas:
   ```bash
   pm2 restart gateway --update-env
   ```

