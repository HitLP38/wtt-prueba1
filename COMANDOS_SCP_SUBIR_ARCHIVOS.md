# Comandos SCP para subir archivos actualizados al VPS

## 📋 Información necesaria
Antes de ejecutar, reemplaza:
- `TU_IP_VPS` - La IP de tu servidor VPS (ej: `a474420503`)
- `root@TU_IP_VPS` - Usuario y IP del VPS
- O usa la IP completa si la conoces

## 📁 Archivos a subir

Los archivos modificados son:
1. `WTT/services/matches/src/services/table-status.service.ts`
2. `WTT/services/matches/src/matches.controller.ts`
3. `WTT/services/matches/src/matches.service.ts`
4. `WTT/services/eventos/src/eventos.controller.ts`

## 🚀 Comandos (ejecutar desde PowerShell)

### Desde el directorio del proyecto:
```powershell
cd "C:\Users\Usuario\Desktop\Pagina Iglesia Alex"
```

### 1. Subir archivos del servicio MATCHES

```powershell
# Subir table-status.service.ts
scp "WTT\services\matches\src\services\table-status.service.ts" root@TU_IP_VPS:/var/www/WTT/services/matches/src/services/

# Subir matches.controller.ts
scp "WTT\services\matches\src\matches.controller.ts" root@TU_IP_VPS:/var/www/WTT/services/matches/src/

# Subir matches.service.ts
scp "WTT\services\matches\src\matches.service.ts" root@TU_IP_VPS:/var/www/WTT/services/matches/src/
```

### 2. Subir archivos del servicio EVENTOS

```powershell
# Subir eventos.controller.ts
scp "WTT\services\eventos\src\eventos.controller.ts" root@TU_IP_VPS:/var/www/WTT/services/eventos/src/
```

## 📝 Después de subir los archivos

**En el VPS (conectado por SSH):**

```bash
# 1. Ir al directorio del proyecto
cd /var/www/WTT

# 2. Compilar los servicios actualizados
cd services/matches && node ../../node_modules/typescript/bin/tsc && cd ../..
cd services/eventos && node ../../node_modules/typescript/bin/tsc && cd ../..

# 3. Reiniciar PM2
pm2 restart matches eventos

# 4. Verificar que estén corriendo
pm2 status

# 5. Ver logs para confirmar que no hay errores
pm2 logs matches --lines 10 --nostream
pm2 logs eventos --lines 10 --nostream
```

## ✅ Probar los endpoints

```bash
# Probar endpoint de mesas (antes se colgaba)
curl "http://localhost:3001/api/admin/events/550e8400-e29b-41d4-a716-446655440000/tables"

# Probar endpoint de árbitros (antes se colgaba)
curl "http://localhost:3001/api/admin/events/550e8400-e29b-41d4-a716-446655440000/referees"
```

---

## 🔍 Si no conoces la IP del VPS

Desde PowerShell, si usas el mismo hostname que en SSH:
```powershell
# Ejemplo si tu comando SSH es:
# ssh root@a474420503
# Entonces usa:
scp "WTT\services\matches\src\services\table-status.service.ts" root@a474420503:/var/www/WTT/services/matches/src/services/
```

